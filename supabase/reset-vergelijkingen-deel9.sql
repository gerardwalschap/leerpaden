-- Reset november 2026: test deel 9 'Vergelijkingen' van De reële getallen opnieuw laten maken
-- (de test is nu uitdagender: 12 vragen, waarvan 9 uitdagend).
--
-- Voer dit maar ÉÉN keer uit (een tweede keer wist ook de nieuwe pogingen!), NADAT de nieuwe versie van de website op GitHub staat.
-- Supabase → SQL Editor → New query → plakken → Run.
--
-- Wat er gebeurt:
--   1. Alle bestaande pogingen van deel 9 gaan naar een archieftabel (testen_archief): niets gaat echt verloren.
--   2. Leerlingen die deel 9 al gehaald hadden, houden toegang tot deel 10 (deel 10 wordt voor hen vrijgegeven).
--   3. De pogingen van deel 9 worden gewist: de leerlingen zien deel 9 weer als 'nog te doen'
--      en maken de nieuwe test. De oude pogingen tellen niet meer mee in de puntenlijst.
--   Oefenresultaten blijven gewoon staan.

begin;

create table if not exists testen_archief as table testen with no data;
alter table testen_archief add column if not exists gearchiveerd timestamptz not null default now();
alter table testen_archief enable row level security;   -- niet publiek leesbaar

insert into testen_archief
  select t.*, now() from testen t where t.programma = 'reele-getallen' and t.deel = 9;

insert into toegang (leerling_id, programma, deel, vrijgegeven)
  select distinct leerling_id, 'reele-getallen', 10, true
    from testen where programma = 'reele-getallen' and deel = 9 and geslaagd
  on conflict (leerling_id, programma, deel) do update set vrijgegeven = true;

delete from testen where programma = 'reele-getallen' and deel = 9;

commit;

-- Controle: wie werd gereset (en hoeveel pogingen had die leerling)?
select l.klas, l.naam, l.voornaam, count(*) as pogingen, bool_or(a.geslaagd) as was_geslaagd
  from testen_archief a join leerlingen l on l.id = a.leerling_id
 where a.programma = 'reele-getallen' and a.deel = 9
 group by l.klas, l.naam, l.voornaam
 order by l.klas, l.naam, l.voornaam;
