// ===================================================================
//  REKENEN IN ℤ +  (7VJHO, gevorderden: ≥ 70/100 op de instaptoets) — slaagdrempel 80%
//  Zelfde tien delen als "Rekenen in ℤ", maar met moeilijkere oefeningen en tests.
//  Leidraad (niets nieuws: alles volgt uit de theorie van Rekenen in ℤ en Rekenen in ℕ +):
//    OneDrive › Vakken › WISKUNDE 7VJHO › 1. GETALLENLEER › Rekenen in Z (werkbundel "Gehele getallen")
//    - optellen/aftrekken (min = plus het tegengestelde), tekenregel, machten (let op de haakjes),
//      vierkants- en derdemachtswortels, logaritmen, volgorde van de bewerkingen (ook [ ]),
//      getallenas en coördinaten, eentermen en veeltermen, rekenregels met machten, verbanden in tabellen.
//  Alles zonder rekenmachine; alle (tussen)uitkomsten blijven gehele getallen.
// ===================================================================
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const nz2 = (a, b) => { let x; do { x = rnd(a, b); } while (Math.abs(x) < 2); return x; }; // geen 0, 1 of −1
const tg = (x, d = null) => W.texGetal(x, d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const isZ = (x) => Number.isInteger(x);
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kTekst = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const vt = (expr, tex, extra = {}) => ({ soort: 'veelterm', expr, vorm: 'uitgewerkt', tex, ...extra });
const VERGELIJK = [{ k: '<', l: '<' }, { k: '>', l: '>' }, { k: '=', l: '=' }];
const vgl = (a, b) => a === b ? '=' : a < b ? '<' : '>';
const delers = (n) => { const d = []; for (let i = 2; i <= Math.abs(n); i++) if (n % i === 0) d.push(i, -i); return d; };
// een term achter een plus- of minteken: "+ 5", "- 5"
const pm = (x) => x < 0 ? `- ${-x}` : `+ ${x}`;
// −(x): minteken vóór een getal
const minVan = (x) => x < 0 ? `-(${tg(x)})` : `-${x}`;

// ---- eentermen/veeltermen als som van termen: [[coëfficiënt, lettergedeelte], …]
const sgn = (c, l, eerst = false) => { const a = Math.abs(c), co = a === 1 && l ? '' : String(a); return eerst ? `${c < 0 ? '-' : ''}${co}${l}` : `${c < 0 ? '-' : '+'} ${co}${l}`; };
function zSom(termen) { const t = termen.filter(x => x[0] !== 0); if (!t.length) return '0'; return t.map((x, i) => sgn(x[0], x[1], i === 0)).join(' ').replace(/\s+/g, ' '); }
const ct = (c) => c === 1 ? '' : c === -1 ? '-' : tg(c);

// ---- mix-deel voor een eindtest
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
// ---- herhaal een generator tot hij een geldige vraag geeft (null = opnieuw)
const tot = (f) => { for (let i = 0; i < 4000; i++) { const r = f(); if (r) return r; } throw new Error('geen geldige vraag gevonden'); };

const PLUS_KADER = (tekst) => `<div class="kader werk"><div class="kader-titel">ℤ + · Extra uitdaging</div>${tekst}</div>`;

const VOLGORDE = `<div class="kader def"><div class="kader-titel">Volgorde van de bewerkingen</div>
  <ol><li><b>Haakjes</b>, van binnen naar buiten: eerst $( \\; )$, dan $[ \\; ]$.</li><li><b>Machten, wortels en logaritmen.</b></li><li><b>Vermenigvuldigen en delen</b>, van links naar rechts.</li><li><b>Optellen en aftrekken</b>, van links naar rechts.</li></ol></div>`;
const REGELS_PLUS = `<div class="kader def"><div class="kader-titel">Optellen en aftrekken in ℤ</div>
  <ul><li><b>Zelfde teken:</b> tel de getallen op en behoud het teken: $-9 + (-11) = -20$.</li>
  <li><b>Verschillend teken:</b> trek af (groot min klein) en neem het teken van het getal met de grootste absolute waarde: $-7 + 15 = 8$.</li>
  <li><b>Aftrekken = optellen met het tegengestelde:</b> $8 - (-5) = 8 + 5 = 13$ &nbsp; en &nbsp; $14 - 20 = 14 + (-20) = -6$.</li></ul></div>`;
const REGELS_MAAL = `<div class="kader def"><div class="kader-titel">Vermenigvuldigen en delen in ℤ: de tekenregel</div>
  <table class="tabel"><tr><td>$+ \\cdot + = +$</td><td>$- \\cdot - = +$</td><td>$+ \\cdot - = -$</td><td>$- \\cdot + = -$</td></tr></table>
  <p>Hetzelfde geldt voor delen. Bij meerdere factoren: tel de mintekens. <b>Even</b> aantal mintekens: positief; <b>oneven</b>: negatief.</p>
  <p class="klein">$-18 : 3 \\cdot (-2) = -6 \\cdot (-2) = 12$ (van links naar rechts!)</p></div>`;

// ---- getallenas met punten (SVG)
const minTekst = (v) => v < 0 ? '−' + (-v) : String(v);
function getallenas(punten, min, max, opt = {}) {
  const u = opt.u || 40, x0 = 24, w = x0 * 2 + (max - min) * u, hh = 64, y = 34;
  const X = (v) => x0 + (v - min) * u;
  let s = `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas" style="font-family:Verdana,sans-serif;max-width:100%">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let v = min; v <= max; v++) s += `<line x1="${X(v)}" y1="${y - 7}" x2="${X(v)}" y2="${y + 7}" stroke="#555" stroke-width="1.4"/><text x="${X(v)}" y="${y + 24}" font-size="13" text-anchor="middle" fill="#333">${minTekst(v)}</text>`;
  for (const p of punten) s += `<circle cx="${X(p.x)}" cy="${y}" r="5" fill="#e8772e"/><text x="${X(p.x)}" y="${y - 12}" font-size="14" font-weight="bold" text-anchor="middle" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}
// ---- getallenas met een eigen ijking: n streepjes, enkel de getallen bij 'labels' (indexen) staan erbij
function getallenasIjking(start, stap, n, labels, punten) {
  const u = 44, x0 = 26, w = x0 * 2 + (n - 1) * u, hh = 66, y = 34;
  const X = (i) => x0 + i * u;
  let s = `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas" style="font-family:Verdana,sans-serif;max-width:100%">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let i = 0; i < n; i++) {
    s += `<line x1="${X(i)}" y1="${y - 7}" x2="${X(i)}" y2="${y + 7}" stroke="#555" stroke-width="1.4"/>`;
    if (labels.includes(i)) s += `<text x="${X(i)}" y="${y + 24}" font-size="13" text-anchor="middle" fill="#333">${minTekst(start + i * stap)}</text>`;
  }
  for (const p of punten) s += `<circle cx="${X(p.i)}" cy="${y}" r="5" fill="#e8772e"/><text x="${X(p.i)}" y="${y - 12}" font-size="14" font-weight="bold" text-anchor="middle" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}
// ---- rooster met punten (SVG)
function rooster(punten, n = 6) {
  const u = 24, w = 2 * n * u + 34, o = w / 2;
  const X = (x) => o + x * u, Y = (y) => o - y * u;
  let s = `<svg viewBox="0 0 ${w} ${w}" width="${w}" height="${w}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rooster" style="font-family:Verdana,sans-serif">`;
  for (let i = -n; i <= n; i++) s += `<line x1="${X(i)}" y1="${Y(-n)}" x2="${X(i)}" y2="${Y(n)}" stroke="#e2e6ec"/><line x1="${X(-n)}" y1="${Y(i)}" x2="${X(n)}" y2="${Y(i)}" stroke="#e2e6ec"/>`;
  s += `<line x1="${X(-n)}" y1="${o}" x2="${X(n) + 10}" y2="${o}" stroke="#333" stroke-width="1.4"/><line x1="${o}" y1="${Y(-n)}" x2="${o}" y2="${Y(n) - 10}" stroke="#333" stroke-width="1.4"/>`;
  s += `<text x="${X(n) + 8}" y="${o - 6}" font-size="12" font-style="italic" text-anchor="end">x</text><text x="${o + 6}" y="${Y(n) - 2}" font-size="12" font-style="italic">y</text>`;
  for (let i = -n; i <= n; i++) if (i) s += `<text x="${X(i)}" y="${o + 14}" font-size="10" text-anchor="middle" fill="#666">${minTekst(i)}</text><text x="${o - 5}" y="${Y(i) + 4}" font-size="10" text-anchor="end" fill="#666">${minTekst(i)}</text>`;
  for (const p of punten) s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="#e8772e"/><text x="${X(p.x) + 7}" y="${Y(p.y) - 7}" font-size="14" font-weight="bold" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}
