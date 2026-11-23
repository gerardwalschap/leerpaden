// ===================================================================
//  REKENEN IN ℕ +  (7VJHO, gevorderden: ≥ 70/100 op de instaptoets) — slaagdrempel 80%
//  Zelfde zes delen als "Rekenen in ℕ", maar met moeilijkere oefeningen en tests.
//  Leidraad (niets nieuws, alles volgt uit de PWP en de werkbladen):
//    OneDrive › Vakken › WISKUNDE 7VJHO › 1. GETALLENLEER › 1.1. Rekenen in N
//    - H1_Getallenleer_Natuurlijke_getallen_PWP (volgorde, ∜, logaritmen, aˣ·aʸ = aˣ⁺ʸ,
//      getalwaarde, ijking van de getallenas, ∅, slim rekenen met procenten, evenredigheden met km/u)
//    - Oefeningen basis en volgorde (reeks J: vierkante haakjes), moeilijke veeltermen in N,
//      werkblad vraagstukken procenten (terugrekenen, btw, procent bepalen, na elkaar), werkblad evenredigheden.
//  Procenten en evenredigheden: altijd met een verhoudingstabel (wat je boven doet, doe je ook onder).
//  Alles zonder rekenmachine; alle (tussen)uitkomsten blijven natuurlijke getallen.
// ===================================================================
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(x, d);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const isN = (x) => Number.isInteger(x) && x >= 0;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kTekst = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const vt = (expr, tex, extra = {}) => ({ soort: 'veelterm', expr, vorm: 'uitgewerkt', tex, ...extra });
const VERGELIJK = [{ k: '<', l: '<' }, { k: '>', l: '>' }, { k: '=', l: '=' }];
const vgl = (a, b) => a === b ? '=' : a < b ? '<' : '>';
const vul = (t, o) => t.replace(/\{(\w)\}/g, (_, k) => o[k]);
const euro = (x) => `€ ${String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;

// ---- verhoudingstabel (HTML) zoals in de werkbladen
function verhoudingstabel(namen, kolommen, bewerking) {
  return `<table class="tabel verhouding"><tr><th>${namen[0]}</th>${kolommen.map(c => `<td>${c[0]}</td>`).join('')}</tr>
    <tr><th>${namen[1]}</th>${kolommen.map(c => `<td>${c[1]}</td>`).join('')}</tr></table>${bewerking ? `<p class="klein midden">${bewerking}</p>` : ''}`;
}
// in de uitleg (TeX): een tabel als array
// (een naam met ^, bv. 'm^2', wordt als formule gezet in plaats van als tekst)
const vtNaam = (x) => x.includes('^') ? `\\text{${x.split('^')[0]}}^{${x.split('^')[1]}}` : `\\text{${x.replace(/%/g, '\\%')}}`;
const vtTex = (namen, kolommen) => `\\begin{array}{l|${'c'.repeat(kolommen.length)}} ${vtNaam(namen[0])} & ${kolommen.map(c => c[0]).join(' & ')} \\\\ \\hline ${vtNaam(namen[1])} & ${kolommen.map(c => c[1]).join(' & ')} \\end{array}`;

// ---- getallenas met een eigen ijking (SVG): n streepjes, enkel de getallen bij 'labels' (indexen) staan erbij
function getallenasIjking(start, stap, n, labels, punten) {
  const u = 44, x0 = 26, w = x0 * 2 + (n - 1) * u, hh = 66, y = 34;
  const X = (i) => x0 + i * u;
  let s = `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas" style="font-family:Verdana,sans-serif;max-width:100%">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let i = 0; i < n; i++) {
    s += `<line x1="${X(i)}" y1="${y - 7}" x2="${X(i)}" y2="${y + 7}" stroke="#555" stroke-width="1.4"/>`;
    if (labels.includes(i)) s += `<text x="${X(i)}" y="${y + 24}" font-size="13" text-anchor="middle" fill="#333">${start + i * stap}</text>`;
  }
  for (const p of punten) s += `<circle cx="${X(p.i)}" cy="${y}" r="5" fill="#e8772e"/><text x="${X(p.i)}" y="${y - 12}" font-size="14" font-weight="bold" text-anchor="middle" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}

// ---- mix-deel voor een eindtest
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });

// ---- herhaal een generator tot hij een geldige vraag geeft (null = opnieuw)
const tot = (f) => { for (let i = 0; i < 2000; i++) { const r = f(); if (r) return r; } throw new Error('geen geldige vraag gevonden'); };

const PLUS_KADER = (tekst) => `<div class="kader werk"><div class="kader-titel">ℕ + · Extra uitdaging</div>${tekst}</div>`;
