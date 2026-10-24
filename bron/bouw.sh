#!/bin/sh
# Voegt de bronbestanden van een programma samen tot programmas/<naam>.js
cd "$(dirname "$0")/.."
for map in bron/*/; do
  naam=$(basename "$map")
  { echo "// Programma '$naam' — automatisch samengevoegd uit bron/$naam/ (niet rechtstreeks bewerken)"; echo "(() => {"; cat "$map"*.js; echo "})();"; } > "programmas/$naam.js"
  echo "programmas/$naam.js"
done
