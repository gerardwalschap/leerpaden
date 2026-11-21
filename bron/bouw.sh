#!/bin/sh
# Voegt de bronbestanden van een programma samen tot programmas/<naam>.js
#   sh bron/bouw.sh instaptoets-7vjho   -> enkel dat programma
#   sh bron/bouw.sh                      -> alle programma's
# LET OP: van sommige oudere leerpaden is het programmabestand later rechtstreeks bijgewerkt;
# bouw daarom liefst enkel het programma waaraan je werkt.
cd "$(dirname "$0")/.."
if [ -n "$1" ]; then mappen="bron/$1/"; else mappen=$(ls -d bron/*/); fi
for map in $mappen; do
  naam=$(basename "$map")
  { echo "// Programma '$naam' — automatisch samengevoegd uit bron/$naam/ (niet rechtstreeks bewerken)"; echo "(() => {"; cat "$map"*.js; echo "})();"; } > "programmas/$naam.js"
  echo "programmas/$naam.js"
done
