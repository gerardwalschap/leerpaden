-- Update november 2026: BACKUP van de volledige databank (knop "💾 Backup databank" op de leerkrachtpagina).
-- Eenmalig uitvoeren in Supabase → SQL Editor → New query → plakken → Run.
-- Er verandert niets aan de bestaande gegevens: deze functie LEEST enkel.
--
-- lk_backup geeft alle tabellen terug als één JSON-bestand: leerpaden, leerlingaccounts
-- (met de versleutelde wachtwoorden, zodat logins bij een herstel blijven werken),
-- koppelingen, oefeningen, testen (met vragen en antwoorden) en vrijgaven.
-- Enkel de leerkracht (met geldig token) kan dit opvragen.

create or replace function lk_backup(p_token uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform _leerkracht(p_token);
  return jsonb_build_object(
    'soort', 'leerpaden-backup',
    'versie', 1,
    'gemaakt', now(),
    'programmas',     coalesce((select jsonb_agg(to_jsonb(p) order by p.aangemaakt) from programmas p), '[]'::jsonb),
    'leerlingen',     coalesce((select jsonb_agg(to_jsonb(l) order by l.klas, l.naam, l.voornaam) from leerlingen l), '[]'::jsonb),
    'inschrijvingen', coalesce((select jsonb_agg(to_jsonb(i)) from inschrijvingen i), '[]'::jsonb),
    'oefeningen',     coalesce((select jsonb_agg(to_jsonb(o) order by o.id) from oefeningen o), '[]'::jsonb),
    'testen',         coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from testen t), '[]'::jsonb),
    'toegang',        coalesce((select jsonb_agg(to_jsonb(a)) from toegang a), '[]'::jsonb)
  );
end $$;

revoke all on function lk_backup(uuid) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function lk_backup(uuid) from anon, authenticated';
    execute 'grant execute on function lk_backup(uuid) to anon';
  end if;
end $$;
