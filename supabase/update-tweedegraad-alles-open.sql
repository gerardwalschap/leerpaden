-- Update november 2026: ook in het leerpad "Tweedegraadsfuncties in contexten" (4BW-MWW)
-- staan ALLE delen open (zoals in "Rationale functies in context").
-- Alle andere leerpaden werken zoals vroeger.
--
-- Eenmalig uitvoeren in Supabase → SQL Editor → New query → plakken → Run.
-- Er gaan geen gegevens verloren.

create or replace function _deel_open(p_ll uuid, p_prog text, p_deel int) returns boolean
language sql security definer set search_path = public, extensions as $$
  select p_deel = 1
      or p_prog in ('rationale-functies-context', 'tweedegraadsfuncties-contexten')
      or exists (select 1 from testen where leerling_id = p_ll and programma = p_prog and deel = p_deel - 1 and geslaagd)
      or exists (select 1 from toegang where leerling_id = p_ll and programma = p_prog and deel = p_deel and vrijgegeven);
$$;
