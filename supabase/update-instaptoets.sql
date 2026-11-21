-- Update november 2026: INSTAPTOETS (en andere toetsen met één poging).
-- Eenmalig uitvoeren in Supabase → SQL Editor → New query → plakken → Run.
-- Er gaan geen gegevens verloren; de gewone leerpaden werken exact zoals voordien.
--
-- * Een programma kan "eenmalig" zijn (staat in het programmabestand, bv. de instaptoets):
--   de leerling krijgt dan ÉÉN poging, ook als hij de drempel niet haalt.
--   Jij kan een nieuwe poging geven op de leerkrachtpagina (leerling → "Nieuwe poging geven").
-- * lk_instaptoets: per ingediende test welke vragen (per domein en niveau) juist waren,
--   voor het resultatenoverzicht.

alter table programmas add column if not exists eenmalig boolean not null default false;

create or replace function lk_programmas(p_token uuid, p_lijst jsonb default '[]'::jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare r jsonb;
begin
  perform _leerkracht(p_token);
  for r in select * from jsonb_array_elements(coalesce(p_lijst, '[]'::jsonb)) loop
    insert into programmas (code, titel, eenmalig)
      values (r->>'code', coalesce(nullif(trim(r->>'titel'), ''), r->>'code'), coalesce((r->>'eenmalig')::boolean, false))
      on conflict (code) do update set titel = excluded.titel, eenmalig = excluded.eenmalig;
  end loop;
  return coalesce((select jsonb_agg(jsonb_build_object('code', p.code, 'titel', p.titel, 'drempel', p.drempel, 'eenmalig', p.eenmalig,
            'leerlingen', (select count(*) from inschrijvingen i where i.programma = p.code)) order by p.aangemaakt)
          from programmas p), '[]'::jsonb);
end $$;

create or replace function ll_test_start(p_token uuid, p_programma text, p_deel int, p_vragen jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid := _leerling(p_token); t testen; eenm boolean; gebruikt int; mag int;
begin
  perform _ingeschreven(v, p_programma);
  select * into t from testen where leerling_id = v and programma = p_programma and deel = p_deel and status = 'bezig'
   order by gestart desc limit 1;
  if t.id is not null then
    return jsonb_build_object('id', t.id, 'vragen', t.vragen, 'gestart', t.gestart);
  end if;
  if not _deel_open(v, p_programma, p_deel) then raise exception 'DEEL_GESLOTEN'; end if;
  select eenmalig into eenm from programmas where code = p_programma;
  if coalesce(eenm, false) then
    -- één poging, tenzij de leerkracht er een extra gaf
    select count(*) into gebruikt from testen where leerling_id = v and programma = p_programma and deel = p_deel;
    select coalesce((select pogingen_toegestaan from toegang where leerling_id = v and programma = p_programma and deel = p_deel), 1) into mag;
    if gebruikt >= mag then raise exception 'AL_GEMAAKT'; end if;
  elsif exists (select 1 from testen where leerling_id = v and programma = p_programma and deel = p_deel and geslaagd) then
    raise exception 'AL_GESLAAGD';
  end if;
  if jsonb_typeof(p_vragen) <> 'array' or jsonb_array_length(p_vragen) < 1 then raise exception 'GEEN_VRAGEN'; end if;
  insert into testen (leerling_id, programma, deel, vragen) values (v, p_programma, p_deel, p_vragen) returning * into t;
  return jsonb_build_object('id', t.id, 'vragen', t.vragen, 'gestart', t.gestart);
end $$;

-- Resultaten van een instaptoets: per ingediende test de domeinen en niveaus van de vragen en of ze juist waren.
create or replace function lk_instaptoets(p_token uuid, p_programma text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return coalesce((select jsonb_agg(jsonb_build_object(
      'leerling', t.leerling_id, 'id', t.id, 'score', t.score, 'max', t.max_score, 'geslaagd', t.geslaagd,
      'gestart', t.gestart, 'ingediend', t.ingediend,
      'items', (select coalesce(jsonb_agg(jsonb_build_object('d', x.v->>'domein', 'n', x.v->>'niveau',
                  'j', coalesce((t.antwoorden->((x.o - 1)::int)->>'juist')::boolean, false)) order by x.o), '[]'::jsonb)
                from jsonb_array_elements(t.vragen) with ordinality as x(v, o)))
      order by t.ingediend)
    from testen t where t.programma = p_programma and t.status = 'ingediend'), '[]'::jsonb);
end $$;

revoke all on function lk_instaptoets(uuid, text) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function lk_instaptoets(uuid, text) from anon, authenticated';
    execute 'grant execute on function lk_instaptoets(uuid, text) to anon';
  end if;
end $$;
