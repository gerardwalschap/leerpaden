-- =====================================================================
--  Leerpaden De Resonant — databank voor MEERDERE programma's
--  (Supabase / PostgreSQL)
--
--  Eén leerkrachtlogin. Leerlingen hebben één account en worden
--  gekoppeld aan één of meer programma's (bv. "reele-getallen").
--
--  Plak dit volledige script in Supabase > SQL Editor en klik "Run".
--  Daarna (in een nieuwe query) je leerkrachtwachtwoord instellen:
--      select lk_stel_wachtwoord('kies-hier-een-sterk-wachtwoord');
--
--  Het script mag je later opnieuw uitvoeren (bv. na een update):
--  bestaande gegevens blijven behouden.
-- =====================================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------- Tabellen ---------------------------------------------------

create table if not exists instellingen (
  id       int primary key default 1 check (id = 1),
  lk_hash  text                                   -- wachtwoord leerkracht (bcrypt)
);
insert into instellingen (id) values (1) on conflict do nothing;

-- Een programma = één leerpad (bv. "reele-getallen"). De website meldt
-- nieuwe programma's zelf aan zodra de leerkracht zich aanmeldt.
create table if not exists programmas (
  code        text primary key check (code ~ '^[a-z0-9-]{2,40}$'),
  titel       text not null,
  drempel     int  not null default 80 check (drempel between 1 and 100),  -- slaagdrempel in %
  aangemaakt  timestamptz not null default now()
);

create table if not exists leerlingen (
  id              uuid primary key default gen_random_uuid(),
  gebruikersnaam  text unique not null,
  voornaam        text not null,
  naam            text not null,
  klas            text not null default '',
  wachtwoord_hash text not null,
  actief          boolean not null default true,
  aangemaakt      timestamptz not null default now(),
  laatst_actief   timestamptz
);

-- Welke leerling volgt welk programma. Ontkoppelen wist geen resultaten.
create table if not exists inschrijvingen (
  leerling_id uuid not null references leerlingen(id) on delete cascade,
  programma   text not null references programmas(code) on delete cascade on update cascade,
  sinds       timestamptz not null default now(),
  primary key (leerling_id, programma)
);

create table if not exists sessies (
  token         uuid primary key default gen_random_uuid(),
  leerling_id   uuid references leerlingen(id) on delete cascade,  -- null = leerkracht
  is_leerkracht boolean not null default false,
  verloopt      timestamptz not null
);

create table if not exists oefeningen (
  id           bigserial primary key,
  leerling_id  uuid not null references leerlingen(id) on delete cascade,
  programma    text not null references programmas(code) on delete cascade on update cascade,
  deel         int  not null,
  soort        text not null,
  juist        boolean not null,
  tijd         timestamptz not null default now()
);
create index if not exists oef_ll on oefeningen(leerling_id, programma, deel);

create table if not exists testen (
  id           bigserial primary key,
  leerling_id  uuid not null references leerlingen(id) on delete cascade,
  programma    text not null references programmas(code) on delete cascade on update cascade,
  deel         int  not null,
  vragen       jsonb not null,
  antwoorden   jsonb,
  score        int,
  max_score    int,
  geslaagd     boolean,
  status       text not null default 'bezig',      -- bezig | ingediend
  gestart      timestamptz not null default now(),
  ingediend    timestamptz
);
create index if not exists test_ll on testen(leerling_id, programma, deel);

create table if not exists toegang (
  leerling_id          uuid not null references leerlingen(id) on delete cascade,
  programma            text not null references programmas(code) on delete cascade on update cascade,
  deel                 int  not null,
  pogingen_toegestaan  int  not null default 1,
  vrijgegeven          boolean not null default false,  -- door leerkracht opengezet
  primary key (leerling_id, programma, deel)
);

-- Niemand mag rechtstreeks aan de tabellen: alles verloopt via de functies hieronder.
alter table instellingen   enable row level security;
alter table programmas     enable row level security;
alter table leerlingen     enable row level security;
alter table inschrijvingen enable row level security;
alter table sessies        enable row level security;
alter table oefeningen     enable row level security;
alter table testen         enable row level security;
alter table toegang        enable row level security;

-- ---------- Hulpfuncties (niet publiek) --------------------------------

create or replace function _leerling(p_token uuid) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid;
begin
  select s.leerling_id into v from sessies s join leerlingen l on l.id = s.leerling_id
   where s.token = p_token and not s.is_leerkracht and s.verloopt > now() and l.actief;
  if v is null then raise exception 'SESSIE_VERLOPEN'; end if;
  update leerlingen set laatst_actief = now() where id = v;
  return v;
end $$;

create or replace function _ingeschreven(p_ll uuid, p_prog text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not exists (select 1 from inschrijvingen where leerling_id = p_ll and programma = p_prog) then
    raise exception 'NIET_INGESCHREVEN';
  end if;
end $$;

create or replace function _leerkracht(p_token uuid) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not exists (select 1 from sessies where token = p_token and is_leerkracht and verloopt > now()) then
    raise exception 'SESSIE_VERLOPEN';
  end if;
end $$;

create or replace function _wachtwoord() returns text
language plpgsql as $$
declare tekens text := 'abcdefghjkmnpqrstuvwxyz'; cijfers text := '23456789'; r text := ''; i int;
begin
  for i in 1..4 loop r := r || substr(tekens, 1 + floor(random()*length(tekens))::int, 1); end loop;
  for i in 1..3 loop r := r || substr(cijfers, 1 + floor(random()*length(cijfers))::int, 1); end loop;
  return r;
end $$;

-- Is een deel open? Deel 1 altijd; anders: vorig deel geslaagd of door de leerkracht vrijgegeven.
create or replace function _deel_open(p_ll uuid, p_prog text, p_deel int) returns boolean
language sql security definer set search_path = public, extensions as $$
  select p_deel = 1
      or exists (select 1 from testen where leerling_id = p_ll and programma = p_prog and deel = p_deel - 1 and geslaagd)
      or exists (select 1 from toegang where leerling_id = p_ll and programma = p_prog and deel = p_deel and vrijgegeven);
$$;

create or replace function _programmas_van(p_ll uuid) returns jsonb
language sql security definer set search_path = public, extensions as $$
  select coalesce(jsonb_agg(jsonb_build_object('code', p.code, 'titel', p.titel) order by i.sinds), '[]'::jsonb)
    from inschrijvingen i join programmas p on p.code = i.programma where i.leerling_id = p_ll;
$$;

create or replace function _status(p_ll uuid, p_prog text) returns jsonb
language sql security definer set search_path = public, extensions as $$
  select jsonb_build_object(
    'programma', p_prog,
    'leerling', (select jsonb_build_object('voornaam', voornaam, 'naam', naam, 'klas', klas, 'gebruikersnaam', gebruikersnaam)
                   from leerlingen where id = p_ll),
    'drempel', (select drempel from programmas where code = p_prog),
    'geslaagd', coalesce((select jsonb_agg(distinct deel) from testen where leerling_id = p_ll and programma = p_prog and geslaagd), '[]'::jsonb),
    'vrijgegeven', coalesce((select jsonb_agg(deel) from toegang where leerling_id = p_ll and programma = p_prog and vrijgegeven), '[]'::jsonb),
    'toegestaan', coalesce((select jsonb_object_agg(deel, pogingen_toegestaan) from toegang where leerling_id = p_ll and programma = p_prog), '{}'::jsonb),
    'testen', coalesce((select jsonb_agg(jsonb_build_object(
                 'id', id, 'deel', deel, 'status', status, 'score', score, 'max', max_score,
                 'geslaagd', geslaagd, 'gestart', gestart, 'ingediend', ingediend) order by gestart)
               from testen where leerling_id = p_ll and programma = p_prog), '[]'::jsonb),
    'oefeningen', coalesce((select jsonb_object_agg(deel, x) from (
                 select deel, jsonb_build_object('aantal', count(*), 'juist', count(*) filter (where juist)) x
                   from oefeningen where leerling_id = p_ll and programma = p_prog group by deel) q), '{}'::jsonb)
  );
$$;

-- ---------- Functies voor leerlingen -----------------------------------

create or replace function ll_login(p_gebruikersnaam text, p_wachtwoord text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare l leerlingen; t uuid;
begin
  select * into l from leerlingen where gebruikersnaam = lower(trim(p_gebruikersnaam)) and actief;
  if l.id is null or l.wachtwoord_hash <> crypt(p_wachtwoord, l.wachtwoord_hash) then
    perform pg_sleep(0.5);
    raise exception 'FOUTE_LOGIN';
  end if;
  delete from sessies where verloopt < now();
  insert into sessies (leerling_id, verloopt) values (l.id, now() + interval '10 hours') returning token into t;
  update leerlingen set laatst_actief = now() where id = l.id;
  return jsonb_build_object('token', t,
    'leerling', jsonb_build_object('voornaam', l.voornaam, 'naam', l.naam, 'klas', l.klas, 'gebruikersnaam', l.gebruikersnaam),
    'programmas', _programmas_van(l.id));
end $$;

create or replace function ll_logout(p_token uuid) returns void
language sql security definer set search_path = public, extensions as $$
  delete from sessies where token = p_token and not is_leerkracht;
$$;

create or replace function ll_programmas(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid := _leerling(p_token);
begin
  return jsonb_build_object(
    'leerling', (select jsonb_build_object('voornaam', voornaam, 'naam', naam, 'klas', klas, 'gebruikersnaam', gebruikersnaam) from leerlingen where id = v),
    'programmas', _programmas_van(v));
end $$;

create or replace function ll_status(p_token uuid, p_programma text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid := _leerling(p_token);
begin
  perform _ingeschreven(v, p_programma);
  return _status(v, p_programma);
end $$;

create or replace function ll_oefening(p_token uuid, p_programma text, p_deel int, p_soort text, p_juist boolean) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid := _leerling(p_token);
begin
  perform _ingeschreven(v, p_programma);
  if not _deel_open(v, p_programma, p_deel) then raise exception 'DEEL_GESLOTEN'; end if;
  insert into oefeningen (leerling_id, programma, deel, soort, juist) values (v, p_programma, p_deel, left(p_soort, 40), p_juist);
end $$;

-- Start een test. Bestaat er al een lopende test voor dit deel, dan krijg je die terug
-- (herladen geeft dus geen nieuwe vragen en geen nieuwe kans).
create or replace function ll_test_start(p_token uuid, p_programma text, p_deel int, p_vragen jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid := _leerling(p_token); t testen; gebruikt int; toegestaan int;
begin
  perform _ingeschreven(v, p_programma);
  select * into t from testen where leerling_id = v and programma = p_programma and deel = p_deel and status = 'bezig'
   order by gestart desc limit 1;
  if t.id is not null then
    return jsonb_build_object('id', t.id, 'vragen', t.vragen, 'gestart', t.gestart);
  end if;
  if not _deel_open(v, p_programma, p_deel) then raise exception 'DEEL_GESLOTEN'; end if;
  if exists (select 1 from testen where leerling_id = v and programma = p_programma and deel = p_deel and geslaagd) then
    raise exception 'AL_GESLAAGD';
  end if;
  select count(*) into gebruikt from testen where leerling_id = v and programma = p_programma and deel = p_deel;
  select coalesce((select pogingen_toegestaan from toegang where leerling_id = v and programma = p_programma and deel = p_deel), 1) into toegestaan;
  if gebruikt >= toegestaan then raise exception 'GEEN_POGINGEN'; end if;
  if jsonb_typeof(p_vragen) <> 'array' or jsonb_array_length(p_vragen) < 1 then raise exception 'GEEN_VRAGEN'; end if;
  insert into testen (leerling_id, programma, deel, vragen) values (v, p_programma, p_deel, p_vragen) returning * into t;
  return jsonb_build_object('id', t.id, 'vragen', t.vragen, 'gestart', t.gestart);
end $$;

create or replace function ll_test_indienen(p_token uuid, p_test bigint, p_antwoorden jsonb, p_score int) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid := _leerling(p_token); t testen; mx int; d int; ok boolean; sc int;
begin
  select * into t from testen where id = p_test and leerling_id = v;
  if t.id is null then raise exception 'ONBEKENDE_TEST'; end if;
  if t.status <> 'bezig' then raise exception 'AL_INGEDIEND'; end if;
  mx := jsonb_array_length(t.vragen);
  sc := greatest(0, least(coalesce(p_score, 0), mx));
  select drempel into d from programmas where code = t.programma;
  ok := sc * 100 >= d * mx;
  update testen set antwoorden = p_antwoorden, score = sc, max_score = mx,
         geslaagd = ok, status = 'ingediend', ingediend = now()
   where id = t.id;
  return jsonb_build_object('score', sc, 'max', mx, 'geslaagd', ok, 'status', _status(v, t.programma));
end $$;

-- ---------- Functies voor de leerkracht --------------------------------

-- Enkel uit te voeren in de SQL Editor (niet via de website).
create or replace function lk_stel_wachtwoord(p_wachtwoord text) returns text
language plpgsql security definer set search_path = public, extensions as $$
begin
  if length(p_wachtwoord) < 8 then raise exception 'Kies minstens 8 tekens.'; end if;
  update instellingen set lk_hash = crypt(p_wachtwoord, gen_salt('bf')) where id = 1;
  delete from sessies where is_leerkracht;
  return 'Wachtwoord leerkracht ingesteld.';
end $$;

create or replace function lk_login(p_wachtwoord text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare h text; t uuid;
begin
  select lk_hash into h from instellingen where id = 1;
  if h is null or h <> crypt(p_wachtwoord, h) then
    perform pg_sleep(1);
    raise exception 'FOUTE_LOGIN';
  end if;
  delete from sessies where verloopt < now();
  insert into sessies (is_leerkracht, verloopt) values (true, now() + interval '8 hours') returning token into t;
  return jsonb_build_object('token', t);
end $$;

create or replace function lk_logout(p_token uuid) returns void
language sql security definer set search_path = public, extensions as $$
  delete from sessies where token = p_token and is_leerkracht;
$$;

-- De website meldt de programma's aan die ze kent (nieuw = toevoegen, bestaand = titel bijwerken).
create or replace function lk_programmas(p_token uuid, p_lijst jsonb default '[]'::jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare r jsonb;
begin
  perform _leerkracht(p_token);
  for r in select * from jsonb_array_elements(coalesce(p_lijst, '[]'::jsonb)) loop
    insert into programmas (code, titel) values (r->>'code', coalesce(nullif(trim(r->>'titel'), ''), r->>'code'))
      on conflict (code) do update set titel = excluded.titel;
  end loop;
  return coalesce((select jsonb_agg(jsonb_build_object('code', p.code, 'titel', p.titel, 'drempel', p.drempel,
            'leerlingen', (select count(*) from inschrijvingen i where i.programma = p.code)) order by p.aangemaakt)
          from programmas p), '[]'::jsonb);
end $$;

create or replace function lk_drempel(p_token uuid, p_programma text, p_drempel int) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  if p_drempel < 1 or p_drempel > 100 then raise exception 'ONGELDIGE_DREMPEL'; end if;
  update programmas set drempel = p_drempel where code = p_programma;
end $$;

-- Nieuwe accounts aanmaken; met p_programma worden ze meteen aan dat programma gekoppeld.
create or replace function lk_leerlingen_toevoegen(p_token uuid, p_lijst jsonb, p_programma text default null) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare r jsonb; basis text; gn text; i int; pw text; nid uuid; uit jsonb := '[]'::jsonb;
begin
  perform _leerkracht(p_token);
  if p_programma is not null and not exists (select 1 from programmas where code = p_programma) then
    raise exception 'ONBEKEND_PROGRAMMA';
  end if;
  for r in select * from jsonb_array_elements(p_lijst) loop
    basis := regexp_replace(lower(coalesce(r->>'gebruikersnaam', '')), '[^a-z0-9.]', '', 'g');
    if basis = '' then basis := 'leerling'; end if;
    gn := basis; i := 1;
    while exists (select 1 from leerlingen where gebruikersnaam = gn) loop
      i := i + 1; gn := basis || i;
    end loop;
    pw := _wachtwoord();
    insert into leerlingen (gebruikersnaam, voornaam, naam, klas, wachtwoord_hash)
      values (gn, trim(r->>'voornaam'), trim(coalesce(r->>'naam', '')), trim(coalesce(r->>'klas', '')), crypt(pw, gen_salt('bf')))
      returning id into nid;
    if p_programma is not null then
      insert into inschrijvingen (leerling_id, programma) values (nid, p_programma) on conflict do nothing;
    end if;
    uit := uit || jsonb_build_object('id', nid, 'voornaam', trim(r->>'voornaam'), 'naam', trim(coalesce(r->>'naam', '')),
                                     'klas', trim(coalesce(r->>'klas', '')), 'gebruikersnaam', gn, 'wachtwoord', pw);
  end loop;
  return uit;
end $$;

-- Koppelen of ontkoppelen (resultaten blijven bewaard bij ontkoppelen).
create or replace function lk_inschrijven(p_token uuid, p_ids jsonb, p_programma text, p_aan boolean) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare x text;
begin
  perform _leerkracht(p_token);
  if not exists (select 1 from programmas where code = p_programma) then raise exception 'ONBEKEND_PROGRAMMA'; end if;
  for x in select * from jsonb_array_elements_text(p_ids) loop
    if p_aan then
      insert into inschrijvingen (leerling_id, programma) select x::uuid, p_programma
        where exists (select 1 from leerlingen where id = x::uuid) on conflict do nothing;
    else
      delete from inschrijvingen where leerling_id = x::uuid and programma = p_programma;
    end if;
  end loop;
end $$;

-- Alle accounts, met de programma's waaraan ze gekoppeld zijn.
create or replace function lk_alle_leerlingen(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return coalesce((select jsonb_agg(jsonb_build_object(
      'id', l.id, 'gebruikersnaam', l.gebruikersnaam, 'voornaam', l.voornaam, 'naam', l.naam, 'klas', l.klas,
      'actief', l.actief, 'aangemaakt', l.aangemaakt, 'laatst_actief', l.laatst_actief,
      'programmas', coalesce((select jsonb_agg(i.programma) from inschrijvingen i where i.leerling_id = l.id), '[]'::jsonb))
      order by l.klas, l.naam, l.voornaam) from leerlingen l), '[]'::jsonb);
end $$;

-- Overzicht van de leerlingen van één programma.
create or replace function lk_overzicht(p_token uuid, p_programma text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return jsonb_build_object(
    'drempel', (select drempel from programmas where code = p_programma),
    'leerlingen', coalesce((select jsonb_agg(jsonb_build_object(
        'id', l.id, 'gebruikersnaam', l.gebruikersnaam, 'voornaam', l.voornaam, 'naam', l.naam,
        'klas', l.klas, 'actief', l.actief, 'aangemaakt', l.aangemaakt, 'laatst_actief', l.laatst_actief,
        'status', _status(l.id, p_programma)) order by l.klas, l.naam, l.voornaam)
      from leerlingen l join inschrijvingen i on i.leerling_id = l.id and i.programma = p_programma), '[]'::jsonb));
end $$;

create or replace function lk_leerling(p_token uuid, p_id uuid, p_programma text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return jsonb_build_object(
    'leerling', (select jsonb_build_object('id', id, 'gebruikersnaam', gebruikersnaam, 'voornaam', voornaam, 'naam', naam,
                  'klas', klas, 'actief', actief, 'aangemaakt', aangemaakt, 'laatst_actief', laatst_actief,
                  'programmas', coalesce((select jsonb_agg(i.programma) from inschrijvingen i where i.leerling_id = p_id), '[]'::jsonb))
                 from leerlingen where id = p_id),
    'status', _status(p_id, p_programma),
    'testen', coalesce((select jsonb_agg(to_jsonb(t) - 'leerling_id' order by t.gestart) from testen t
                 where t.leerling_id = p_id and t.programma = p_programma), '[]'::jsonb),
    'per_soort', coalesce((select jsonb_agg(jsonb_build_object('deel', deel, 'soort', soort, 'aantal', n, 'juist', j) order by deel, soort)
                 from (select deel, soort, count(*) n, count(*) filter (where juist) j
                         from oefeningen where leerling_id = p_id and programma = p_programma group by deel, soort) q), '[]'::jsonb),
    'per_dag', coalesce((select jsonb_agg(jsonb_build_object('dag', dag, 'deel', deel, 'aantal', n, 'juist', j) order by dag, deel)
                 from (select (tijd at time zone 'Europe/Brussels')::date dag, deel, count(*) n, count(*) filter (where juist) j
                         from oefeningen where leerling_id = p_id and programma = p_programma group by 1, 2) q), '[]'::jsonb),
    'recent', coalesce((select jsonb_agg(jsonb_build_object('deel', deel, 'soort', soort, 'juist', juist, 'tijd', tijd) order by tijd)
                 from (select * from oefeningen where leerling_id = p_id and programma = p_programma order by tijd desc limit 500) q), '[]'::jsonb)
  );
end $$;

create or replace function lk_test_heropenen(p_token uuid, p_id uuid, p_programma text, p_deel int) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare gebruikt int;
begin
  perform _leerkracht(p_token);
  select count(*) into gebruikt from testen where leerling_id = p_id and programma = p_programma and deel = p_deel;
  insert into toegang (leerling_id, programma, deel, pogingen_toegestaan) values (p_id, p_programma, p_deel, gebruikt + 1)
    on conflict (leerling_id, programma, deel) do update set pogingen_toegestaan = greatest(toegang.pogingen_toegestaan, gebruikt + 1);
  return _status(p_id, p_programma);
end $$;

-- Een lopende test (bv. leerling heeft per ongeluk gestart en de pagina gesloten) laten vallen:
-- telt dan niet als poging.
create or replace function lk_test_annuleren(p_token uuid, p_test bigint) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  delete from testen where id = p_test and status = 'bezig';
end $$;

create or replace function lk_deel_vrijgeven(p_token uuid, p_id uuid, p_programma text, p_deel int, p_aan boolean) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  insert into toegang (leerling_id, programma, deel, vrijgegeven) values (p_id, p_programma, p_deel, p_aan)
    on conflict (leerling_id, programma, deel) do update set vrijgegeven = p_aan;
  return _status(p_id, p_programma);
end $$;

create or replace function lk_wachtwoord_reset(p_token uuid, p_id uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare pw text := _wachtwoord();
begin
  perform _leerkracht(p_token);
  update leerlingen set wachtwoord_hash = crypt(pw, gen_salt('bf')) where id = p_id;
  delete from sessies where leerling_id = p_id;
  return jsonb_build_object('wachtwoord', pw);
end $$;

create or replace function lk_leerling_bewerken(p_token uuid, p_id uuid, p_voornaam text, p_naam text, p_klas text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  if coalesce(trim(p_voornaam), '') = '' then raise exception 'VOORNAAM_NODIG'; end if;
  update leerlingen set voornaam = trim(p_voornaam), naam = trim(coalesce(p_naam, '')), klas = trim(coalesce(p_klas, '')) where id = p_id;
end $$;

create or replace function lk_leerling_wijzigen(p_token uuid, p_id uuid, p_actief boolean, p_verwijderen boolean) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  if p_verwijderen then
    delete from leerlingen where id = p_id;
  else
    update leerlingen set actief = p_actief where id = p_id;
    if not p_actief then delete from sessies where leerling_id = p_id; end if;
  end if;
end $$;

-- ---------- Rechten -----------------------------------------------------

revoke all on all functions in schema public from public;
do $$
declare r record;
begin
  for r in select p.oid::regprocedure as f, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' loop
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on function %s from anon, authenticated', r.f);
      if (r.proname like 'll\_%' or r.proname like 'lk\_%') and r.proname <> 'lk_stel_wachtwoord' then
        execute format('grant execute on function %s to anon', r.f);
      end if;
    end if;
  end loop;
end $$;
