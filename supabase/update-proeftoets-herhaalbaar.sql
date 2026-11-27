-- Update 27 november 2026: de "Proeftoets getallenleer" (7VJHO) is HERHAALBAAR.
-- Ook na slagen mag een leerling een stuk opnieuw maken (telkens nieuwe vragen).
-- Is al uitgevoerd in de databank (via de Supabase-koppeling); enkel ter documentatie / voor een herinstallatie.

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
    select count(*) into gebruikt from testen where leerling_id = v and programma = p_programma and deel = p_deel;
    select coalesce((select pogingen_toegestaan from toegang where leerling_id = v and programma = p_programma and deel = p_deel), 1) into mag;
    if gebruikt >= mag then raise exception 'AL_GEMAAKT'; end if;
  elsif p_programma not in ('proeftoets-getallenleer') -- herhaalbaar: ook na slagen opnieuw te maken
    and exists (select 1 from testen where leerling_id = v and programma = p_programma and deel = p_deel and geslaagd) then
    raise exception 'AL_GESLAAGD';
  end if;
  if jsonb_typeof(p_vragen) <> 'array' or jsonb_array_length(p_vragen) < 1 then raise exception 'GEEN_VRAGEN'; end if;
  insert into testen (leerling_id, programma, deel, vragen) values (v, p_programma, p_deel, p_vragen) returning * into t;
  return jsonb_build_object('id', t.id, 'vragen', t.vragen, 'gestart', t.gestart);
end $$;
