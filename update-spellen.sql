-- Update november 2026: SPELLEN (7VJHO) in de leerpaden.
-- Eenmalig uitvoeren in Supabase → SQL Editor → New query → plakken → Run.
-- Er gaan geen gegevens verloren; de leerpaden werken exact zoals voordien.
--
-- * Elk spel is een "programma" met code spel-… (bv. spel-codekraker). Koppelen en ontkoppelen
--   gaat dus zoals bij een leerpad. De website meldt de spellen zelf aan bij je volgende login.
-- * spel_staat: de voortgang van een leerling in een spel (zodat hij op elke pc verder kan)
--   + een korte samenvatting ("4/6 zalen · 11/18 ★") voor de leerkracht.
-- * spel_tijd: actieve speeltijd per leerling, per spel, per dag (in seconden).
--   Enkel tijd waarin het spel zichtbaar is en de leerling iets doet; 2 min niets = klok stil.

create table if not exists spel_staat (
  leerling_id  uuid not null references leerlingen(id) on delete cascade,
  spel         text not null references programmas(code) on delete cascade on update cascade,
  staat        jsonb not null default '{}'::jsonb,
  samenvatting jsonb,
  bijgewerkt   timestamptz not null default now(),
  primary key (leerling_id, spel)
);

create table if not exists spel_tijd (
  leerling_id uuid not null references leerlingen(id) on delete cascade,
  spel        text not null references programmas(code) on delete cascade on update cascade,
  dag         date not null,
  seconden    int  not null default 0,
  primary key (leerling_id, spel, dag)
);

alter table spel_staat enable row level security;
alter table spel_tijd  enable row level security;

-- Belgische kalenderdag (en niet die van de server in UTC).
create or replace function _vandaag() returns date
language sql stable as $$ select (now() at time zone 'Europe/Brussels')::date $$;

-- Leerling opent een spel: zijn opgeslagen toestand + speeltijd van vandaag.
create or replace function ll_spel_start(p_token uuid, p_spel text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid := _leerling(p_token);
begin
  perform _ingeschreven(v, p_spel);
  return jsonb_build_object(
    'staat', coalesce((select staat from spel_staat where leerling_id = v and spel = p_spel), '{}'::jsonb),
    'vandaag', coalesce((select seconden from spel_tijd where leerling_id = v and spel = p_spel and dag = _vandaag()), 0),
    'voornaam', (select voornaam from leerlingen where id = v));
end $$;

-- Het spel bewaart (om de 30 s en bij elke wijziging): speeltijd erbij en eventueel de nieuwe toestand.
create or replace function ll_spel_bewaar(p_token uuid, p_spel text, p_seconden int default 0,
                                          p_staat jsonb default null, p_samenvatting jsonb default null) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid := _leerling(p_token); s int := least(greatest(coalesce(p_seconden, 0), 0), 300);  -- max 5 min per oproep
begin
  perform _ingeschreven(v, p_spel);
  if s > 0 then
    insert into spel_tijd (leerling_id, spel, dag, seconden) values (v, p_spel, _vandaag(), s)
      on conflict (leerling_id, spel, dag) do update set seconden = spel_tijd.seconden + excluded.seconden;
  end if;
  if p_staat is not null then
    if octet_length(p_staat::text) > 500000 then raise exception 'TE_GROOT'; end if;
    insert into spel_staat (leerling_id, spel, staat, samenvatting, bijgewerkt) values (v, p_spel, p_staat, p_samenvatting, now())
      on conflict (leerling_id, spel) do update set staat = excluded.staat, samenvatting = excluded.samenvatting, bijgewerkt = now();
  elsif s > 0 then
    update spel_staat set bijgewerkt = now() where leerling_id = v and spel = p_spel;
  end if;
end $$;

-- Leerkracht: per leerling en per spel de speeltijd (vandaag, deze week, totaal) en de voortgang.
create or replace function lk_spellen(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare d date := _vandaag(); w date := date_trunc('week', _vandaag())::date;  -- week begint op maandag
begin
  perform _leerkracht(p_token);
  return coalesce((select jsonb_agg(jsonb_build_object(
      'leerling', k.leerling_id, 'spel', k.spel,
      'vandaag', coalesce(t.vandaag, 0), 'week', coalesce(t.week, 0), 'totaal', coalesce(t.totaal, 0), 'dagen', coalesce(t.dagen, 0),
      'samenvatting', s.samenvatting, 'laatst', s.bijgewerkt))
    from (select leerling_id, spel from spel_tijd union select leerling_id, spel from spel_staat) k
    left join (select leerling_id, spel,
                 sum(seconden) filter (where dag = d) vandaag, sum(seconden) filter (where dag >= w) week,
                 sum(seconden) totaal, count(*) dagen
               from spel_tijd group by leerling_id, spel) t on t.leerling_id = k.leerling_id and t.spel = k.spel
    left join spel_staat s on s.leerling_id = k.leerling_id and s.spel = k.spel), '[]'::jsonb);
end $$;

-- Leerkracht: speeltijd per dag van één leerling in één spel.
create or replace function lk_spel_dagen(p_token uuid, p_id uuid, p_spel text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return coalesce((select jsonb_agg(jsonb_build_object('dag', dag, 'seconden', seconden) order by dag desc)
    from spel_tijd where leerling_id = p_id and spel = p_spel), '[]'::jsonb);
end $$;

-- Leerkracht: voortgang van een leerling in een spel wissen (speeltijd blijft bewaard).
create or replace function lk_spel_wissen(p_token uuid, p_id uuid, p_spel text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  delete from spel_staat where leerling_id = p_id and spel = p_spel;
end $$;

-- Backup: nu ook met de spellen.
create or replace function lk_backup(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return jsonb_build_object(
    'soort', 'leerpaden-backup',
    'versie', 2,
    'gemaakt', now(),
    'programmas',     coalesce((select jsonb_agg(to_jsonb(p) order by p.aangemaakt) from programmas p), '[]'::jsonb),
    'leerlingen',     coalesce((select jsonb_agg(to_jsonb(l) order by l.klas, l.naam, l.voornaam) from leerlingen l), '[]'::jsonb),
    'inschrijvingen', coalesce((select jsonb_agg(to_jsonb(i)) from inschrijvingen i), '[]'::jsonb),
    'oefeningen',     coalesce((select jsonb_agg(to_jsonb(o) order by o.id) from oefeningen o), '[]'::jsonb),
    'testen',         coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from testen t), '[]'::jsonb),
    'toegang',        coalesce((select jsonb_agg(to_jsonb(a)) from toegang a), '[]'::jsonb),
    'spel_staat',     coalesce((select jsonb_agg(to_jsonb(s)) from spel_staat s), '[]'::jsonb),
    'spel_tijd',      coalesce((select jsonb_agg(to_jsonb(t) order by t.dag) from spel_tijd t), '[]'::jsonb)
  );
end $$;

-- Rechten: enkel via de website (anon), zoals de andere functies.
do $$
declare f text;
begin
  foreach f in array array['_vandaag()', 'll_spel_start(uuid, text)', 'll_spel_bewaar(uuid, text, int, jsonb, jsonb)',
                           'lk_spellen(uuid)', 'lk_spel_dagen(uuid, uuid, text)', 'lk_spel_wissen(uuid, uuid, text)', 'lk_backup(uuid)'] loop
    execute format('revoke all on function %s from public', f);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on function %s from anon, authenticated', f);
      if f <> '_vandaag()' then execute format('grant execute on function %s to anon', f); end if;
    end if;
  end loop;
end $$;
