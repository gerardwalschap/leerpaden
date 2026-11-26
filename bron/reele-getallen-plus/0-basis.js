// ===================================================================
//  REKENEN IN ℝ +  (7VJHO, gevorderden: ≥ 70/100 op de instaptoets)
//  Zelfde tien delen als "Rekenen in ℝ" (reele-getallen), maar met moeilijkere oefeningen en tests.
//  De theorie van elk deel komt uit het gewone leerpad, aangevuld met een kader "Extra uitdaging";
//  bij vergelijkingen en formules worden de ★-soorten van het gewone leerpad hergebruikt.
//  Dit bestand moet dus NA programmas/reele-getallen.js geladen worden (zie index.html).
//  Leidraad: OneDrive › Vakken › WISKUNDE 7VJHO › 1. GETALLENLEER › Rekenen in R (zelfde leerstof, niets nieuws).
// ===================================================================
const { rnd, kies, schud } = W;
const BASIS_R = Leerpaden.vind('reele-getallen');
const BD = (nr) => BASIS_R.delen.find(d => d.nr === nr);
const tg = (x, d = null) => W.texGetal(x, d, d !== null && Math.abs(W.rond(x, d) - x) > 1e-9);
const kg = (x, d = null) => W.komma(x, d);
const ggd = W.ggd;
const kgv = (a, b) => a / ggd(a, b) * b;
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const isKwadraat = (n) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
const isDerde = (n) => Math.round(Math.cbrt(n)) ** 3 === n;
const KW = [2, 3, 5, 6, 7, 10, 11];
function haalUit(n) { let k = 1, m = n; for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; } return { k, m }; }
const coefTex = (k) => k === 1 ? '' : k === -1 ? '-' : `${k}`;
const wTex = (k, m) => m === 1 ? `${k}` : k === 0 ? '0' : `${coefTex(k)}\\sqrt{${m}}`;
const wE = (k, m) => m === 1 ? `${k}` : k === 0 ? '0' : `${coefTex(k)}√(${m})`;
const afgekapt = (x, d) => { const f = 10 ** d; return W.texGetal(Math.trunc(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f, d, true) + '\\ldots'; };
const zekerRond = (x, d) => !W.grensgeval(x, d);
const isGeheel = (x) => Number.isInteger(+x.toFixed(9));
const tot = (f) => { for (let i = 0; i < 4000; i++) { const r = f(); if (r) return r; } throw new Error('geen geldige vraag gevonden'); };
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };

const QR = [{ k: 'Q', l: '\\mathbb{Q}', tekst: 'ℚ' }, { k: 'RQ', l: '\\mathbb{R}\\setminus\\mathbb{Q}', tekst: 'ℝ \\ ℚ' }];
const NZQR = [{ k: 'N', l: '\\mathbb{N}', tekst: 'ℕ' }, { k: 'Z', l: '\\mathbb{Z}', tekst: 'ℤ' }, { k: 'Q', l: '\\mathbb{Q}', tekst: 'ℚ' }, { k: 'RQ', l: '\\mathbb{R}\\setminus\\mathbb{Q}', tekst: 'ℝ \\ ℚ' }];
const JANEE = [{ k: 'ja', l: 'ja', html: true, tekst: 'ja' }, { k: 'nee', l: 'nee', html: true, tekst: 'nee' }];
const WAAR = [{ k: 'w', l: 'waar', html: true, tekst: 'waar' }, { k: 'nw', l: 'niet waar', html: true, tekst: 'niet waar' }];
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist });
const getal = (waarde, dec = null, extra = {}) => ({ soort: 'getal', waarde, dec, ...extra });
const expr = (e, vormen = [], extra = {}) => ({ soort: 'expr', expr: e, vormen, ...extra });
const veldE = (e, vormen = []) => ({ expr: e, vormen });
const breuk = (t, n, extra = {}) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n) || 1; return { soort: 'breuk', t: t / g, n: n / g, ...extra }; };
const brTex = (t, n) => W.breukTex(t, n);

const PLUS_KADER = (tekst) => `<div class="kader werk"><div class="kader-titel">ℝ + · Extra uitdaging</div>${tekst}</div>`;
// theorie van het gewone deel + het kader met de extra uitdaging
const theorieVan = (nr, plus) => `${BD(nr).theorie}${PLUS_KADER(plus)}`;

// ---- getallenas (SVG) in de stijl van het gewone leerpad
const ASKLEUR = '#1d6f73', HAAKKLEUR = '#c0392b';
function getallenas(r, min = -5, max = 6, breedte = 34) {
  const u = breedte, x0 = 24, w = x0 * 2 + (max - min) * u, hh = 50, y = 20;
  const X = (v) => x0 + (v - min) * u;
  let s = `<svg class="as" viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let v = min; v <= max; v++) {
    s += `<line x1="${X(v)}" y1="${y - 5}" x2="${X(v)}" y2="${y + 5}" stroke="#555" stroke-width="1.2"/>`;
    if (v < max) s += `<line x1="${X(v + 0.5)}" y1="${y - 3}" x2="${X(v + 0.5)}" y2="${y + 3}" stroke="#999" stroke-width="1"/>`;
    s += `<text x="${X(v)}" y="${y + 22}" font-size="13" font-family="Verdana,sans-serif" text-anchor="middle" fill="#333">${v < 0 ? '−' + (-v) : v}</text>`;
  }
  if (r) {
    const xa = r.a === null ? 8 : X(r.a), xb = r.b === null ? w - 8 : X(r.b);
    s += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="${ASKLEUR}" stroke-width="5"/>`;
    if (r.a === null) s += `<path d="M14,${y - 7} L2,${y} L14,${y + 7} Z" fill="${ASKLEUR}"/>`;
    if (r.b === null) s += `<path d="M${w - 14},${y - 7} L${w - 2},${y} L${w - 14},${y + 7} Z" fill="${ASKLEUR}"/>`;
    const haak = (x, naarRechts) => { const d = naarRechts ? 6 : -6; return `<path d="M${x + d},${y - 12} L${x},${y - 12} L${x},${y + 12} L${x + d},${y + 12}" stroke="${HAAKKLEUR}" stroke-width="2.6" fill="none"/>`; };
    if (r.a !== null) s += haak(xa, r.ai);
    if (r.b !== null) s += haak(xb, !r.bi);
  }
  return s + '</svg>';
}
const ivTex = (r) => Invoer.intervalTex(r);
const ogTex = (r) => Invoer.ongelijkheidTex(r);
const ivTekst = (r) => W.platteTekst(ivTex(r));
const ivOpg = (r) => ({ soort: 'interval', a: r.a, ai: r.ai, b: r.b, bi: r.bi });
const ogOpg = (r) => ({ soort: 'ongelijkheid', a: r.a, ai: r.ai, b: r.b, bi: r.bi });
