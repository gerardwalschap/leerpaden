-- Update 28 november 2026: ping (wakker houden), automatische back-up, archief en "foutje melden".
-- Eenmalig uitvoeren (Supabase → SQL Editor → New query → plakken → Run). Er gaat niets verloren.

-- ===================================================================
-- 1. Ping: een onschuldige functie die de GitHub-actie elke 3 dagen oproept,
--    zodat het gratis Supabase-project nooit gepauzeerd wordt (ook niet in de vakanties).
-- ===================================================================
create table if not exists pings (
  id int primary key default 1 check (id = 1),
  laatste timestamptz,
  aantal int not null default 0
);
alter table pings enable row level security;

create or replace function ping() returns text
language plpgsql security definer set search_path = public, extensions as $$
begin
  insert into pings (id, laatste, aantal) values (1, now(), 1)
    on conflict (id) do update set laatste = now(), aantal = pings.aantal + 1;
  return 'ok';
end $$;

-- ===================================================================
-- 2. Momentopname van de hele databank (gebruikt door back-up en archief)
-- ===================================================================
create table if not exists meldingen (
  id          bigserial primary key,
  leerling_id uuid references leerlingen(id) on delete set null,
  programma   text not null,
  deel        int,
  soort       text,
  plaats      text,                 -- 'oefenen' of 'test'
  vraag       jsonb,                -- de vraag zoals de leerling ze zag (met het juiste antwoord)
  antwoord    jsonb,                -- wat de leerling invulde
  opmerking   text,
  status      text not null default 'nieuw' check (status in ('nieuw', 'opgelost', 'geen_fout', 'bekeken')),
  reactie     text,                 -- uitleg: waar liep het fout en wat werd er aangepast
  gemeld      timestamptz not null default now(),
  behandeld   timestamptz
);
create index if not exists meldingen_status on meldingen (status, gemeld);
alter table meldingen enable row level security;

create or replace function _momentopname() returns jsonb
language sql security definer set search_path = public, extensions as $$
  select jsonb_build_object(
    'soort', 'leerpaden-backup',
    'versie', 3,
    'gemaakt', now(),
    'programmas',     coalesce((select jsonb_agg(to_jsonb(p) order by p.aangemaakt) from programmas p), '[]'::jsonb),
    'leerlingen',     coalesce((select jsonb_agg(to_jsonb(l) order by l.klas, l.naam, l.voornaam) from leerlingen l), '[]'::jsonb),
    'inschrijvingen', coalesce((select jsonb_agg(to_jsonb(i)) from inschrijvingen i), '[]'::jsonb),
    'oefeningen',     coalesce((select jsonb_agg(to_jsonb(o) order by o.id) from oefeningen o), '[]'::jsonb),
    'testen',         coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from testen t), '[]'::jsonb),
    'toegang',        coalesce((select jsonb_agg(to_jsonb(a)) from toegang a), '[]'::jsonb),
    'spel_staat',     coalesce((select jsonb_agg(to_jsonb(s)) from spel_staat s), '[]'::jsonb),
    'spel_tijd',      coalesce((select jsonb_agg(to_jsonb(t) order by t.dag) from spel_tijd t), '[]'::jsonb),
    'meldingen',      coalesce((select jsonb_agg(to_jsonb(m) order by m.id) from meldingen m), '[]'::jsonb)
  );
$$;
revoke all on function _momentopname() from public;

alter table instellingen add column if not exists laatste_backup timestamptz;

create or replace function lk_backup(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  update instellingen set laatste_backup = now() where id = 1;
  return _momentopname();
end $$;

-- Wanneer werd de laatste back-up gemaakt? (de leerkrachtpagina maakt er automatisch een als die ouder is dan 7 dagen)
create or replace function lk_backup_info(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return jsonb_build_object(
    'laatste_backup', (select laatste_backup from instellingen where id = 1),
    'laatste_ping', (select laatste from pings where id = 1),
    'nieuwe_meldingen', (select count(*) from meldingen where status = 'nieuw'),
    'ongelezen_reacties', (select count(*) from meldingen where status in ('opgelost', 'geen_fout'))
  );
end $$;

-- ===================================================================
-- 3. Archief: tussentijds archiveren (niets wissen) en het schooljaar afsluiten
-- ===================================================================
create table if not exists archief (
  id           bigserial primary key,
  label        text not null,
  soort        text not null check (soort in ('tussentijds', 'schooljaar')),
  gemaakt      timestamptz not null default now(),
  samenvatting jsonb,
  inhoud       jsonb not null
);
alter table archief enable row level security;

create or replace function _archiveer(p_label text, p_soort text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare s jsonb; nid bigint;
begin
  if coalesce(trim(p_label), '') = '' then raise exception 'Geef het archief een naam (bv. Rapport 1 2026-2027).'; end if;
  s := jsonb_build_object(
    'leerlingen', (select count(*) from leerlingen),
    'koppelingen', (select count(*) from inschrijvingen),
    'testen', (select count(*) from testen where status = 'ingediend'),
    'oefeningen', (select count(*) from oefeningen),
    'klassen', coalesce((select jsonb_agg(distinct klas) from leerlingen where klas <> ''), '[]'::jsonb));
  insert into archief (label, soort, samenvatting, inhoud) values (trim(p_label), p_soort, s, _momentopname()) returning id into nid;
  return s || jsonb_build_object('id', nid, 'label', trim(p_label), 'soort', p_soort);
end $$;
revoke all on function _archiveer(text, text) from public;

create or replace function lk_archiveren(p_token uuid, p_label text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return _archiveer(p_label, 'tussentijds');
end $$;

create or replace function lk_archieven(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return coalesce((select jsonb_agg(jsonb_build_object('id', id, 'label', label, 'soort', soort, 'gemaakt', gemaakt,
            'samenvatting', samenvatting, 'kb', pg_column_size(inhoud) / 1024) order by gemaakt desc) from archief), '[]'::jsonb);
end $$;

create or replace function lk_archief_ophalen(p_token uuid, p_id bigint) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return (select inhoud from archief where id = p_id);
end $$;

-- Schooljaar afsluiten: eerst alles archiveren, dan alle resultaten en koppelingen wissen.
-- Leerlingaccounts: 'behouden' (blijven bestaan, zonder leerpaden), 'deactiveren' (kunnen niet meer aanmelden) of 'verwijderen'.
create or replace function lk_schooljaar_afsluiten(p_token uuid, p_label text, p_accounts text, p_bevestiging text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare s jsonb;
begin
  perform _leerkracht(p_token);
  if p_bevestiging is distinct from 'AFSLUITEN' then raise exception 'Typ AFSLUITEN om te bevestigen.'; end if;
  if p_accounts not in ('behouden', 'deactiveren', 'verwijderen') then raise exception 'Ongeldige keuze voor de accounts.'; end if;
  s := _archiveer(p_label, 'schooljaar');
  delete from testen;
  delete from oefeningen;
  delete from toegang;
  delete from inschrijvingen;
  delete from spel_tijd;
  delete from spel_staat;
  delete from sessies where not is_leerkracht;
  if p_accounts = 'deactiveren' then update leerlingen set actief = false; end if;
  if p_accounts = 'verwijderen' then delete from testen_archief; delete from leerlingen; end if;
  return s || jsonb_build_object('accounts', p_accounts);
end $$;

-- ===================================================================
-- 4. Foutje melden (leerling) en opvolgen (leerkracht)
-- ===================================================================
create or replace function ll_melden(p_token uuid, p_programma text, p_deel int, p_soort text, p_plaats text,
                                     p_vraag jsonb, p_antwoord jsonb, p_opmerking text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid; vr jsonb := p_vraag;
begin
  v := _leerling(p_token);
  perform _ingeschreven(v, p_programma);
  if (select count(*) from meldingen where leerling_id = v and gemeld > now() - interval '1 day') >= 15 then
    raise exception 'TE_VEEL_MELDINGEN';
  end if;
  if pg_column_size(vr) > 200000 then
    vr := jsonb_build_object('te_groot', true, 'tex', vr->>'tex', 'sleutel', vr->>'sleutel', 'antw', vr->'antw');
  end if;
  insert into meldingen (leerling_id, programma, deel, soort, plaats, vraag, antwoord, opmerking)
    values (v, p_programma, p_deel, left(p_soort, 80), left(p_plaats, 20), vr, p_antwoord, left(coalesce(p_opmerking, ''), 1000));
end $$;

create or replace function lk_meldingen(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return coalesce((select jsonb_agg(jsonb_build_object('id', m.id, 'programma', m.programma, 'deel', m.deel, 'soort', m.soort,
            'plaats', m.plaats, 'opmerking', m.opmerking, 'status', m.status, 'reactie', m.reactie, 'gemeld', m.gemeld,
            'behandeld', m.behandeld, 'vraag', m.vraag, 'antwoord', m.antwoord,
            'leerling', coalesce(l.voornaam || ' ' || l.naam, '(verwijderd)'), 'klas', l.klas) order by m.gemeld desc)
          from (select * from meldingen order by gemeld desc limit 300) m left join leerlingen l on l.id = m.leerling_id), '[]'::jsonb);
end $$;

create or replace function lk_melding_status(p_token uuid, p_id bigint, p_status text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  update meldingen set status = p_status, behandeld = coalesce(behandeld, now()) where id = p_id;
end $$;

-- ===================================================================
-- Rechten: enkel deze functies zijn van buitenaf op te roepen (met de publieke sleutel)
-- ===================================================================
do $$ declare f text; begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    foreach f in array array['ping()', 'lk_backup(uuid)', 'lk_backup_info(uuid)', 'lk_archiveren(uuid, text)', 'lk_archieven(uuid)',
      'lk_archief_ophalen(uuid, bigint)', 'lk_schooljaar_afsluiten(uuid, text, text, text)',
      'll_melden(uuid, text, int, text, text, jsonb, jsonb, text)', 'lk_meldingen(uuid)', 'lk_melding_status(uuid, bigint, text)'] loop
      execute format('revoke all on function %s from public, anon, authenticated', f);
      execute format('grant execute on function %s to anon', f);
    end loop;
    execute 'revoke all on function _momentopname() from anon, authenticated';
    execute 'revoke all on function _archiveer(text, text) from anon, authenticated';
  end if;
end $$;
