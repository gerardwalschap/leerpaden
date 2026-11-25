-- Update november 2026: in het leerpad "Rationale functies in context" (5BCW / 5WW)
-- staan ALLE delen open: leerlingen mogen elk deel oefenen en elke test maken, in eender welke volgorde.
-- Dit geldt ENKEL voor dit leerpad; alle andere leerpaden werken zoals vroeger
-- (deel 1 open, daarna pas na slagen of als de leerkracht het deel vrijgeeft).
--
-- Eenmalig uitvoeren in Supabase → SQL Editor → New query → plakken → Run.
-- Er gaan geen gegevens verloren.

create or replace function _deel_open(p_ll uuid, p_prog text, p_deel int) returns boolean
language sql security definer set search_path = public, extensions as $$
  select p_deel = 1
      or p_prog = 'rationale-functies-context'
      or exists (select 1 from testen where leerling_id = p_ll and programma = p_prog and deel = p_deel - 1 and geslaagd)
      or exists (select 1 from toegang where leerling_id = p_ll and programma = p_prog and deel = p_deel and vrijgegeven);
$$;
