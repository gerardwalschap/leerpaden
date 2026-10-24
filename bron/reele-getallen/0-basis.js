// ===== Reële getallen (7VJHO) — gedeelde hulpmiddelen =====
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(x, d);           // getal in TeX met komma
const kg = (x, d = null) => W.komma(x, d);              // getal als tekst met komma
const ggd = W.ggd;
const kgv = (a, b) => a / ggd(a, b) * b;
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);          // haakjes rond negatieve getallen
const isKwadraat = (n) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
const isDerde = (n) => Math.round(Math.cbrt(n)) ** 3 === n;
const KW = [2, 3, 5, 6, 7, 10, 11];                      // kwadraatvrije getallen onder de wortel
// √n = k·√m
function haalUit(n) { let k = 1, m = n; for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; } return { k, m }; }
const coefTex = (k) => k === 1 ? '' : k === -1 ? '-' : `${k}`;
const wTex = (k, m) => m === 1 ? `${k}` : k === 0 ? '0' : `${coefTex(k)}\\sqrt{${m}}`;
const wE = (k, m) => m === 1 ? `${k}` : k === 0 ? '0' : `${coefTex(k)}√(${m})`;
const plusmin = (x) => x < 0 ? `- ${-x}` : `+ ${x}`;
// tijdelijk afgekapte decimale schrijfwijze: 2,23606797…
const afgekapt = (x, d) => { const f = 10 ** d; return W.texGetal(Math.trunc(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f, d, true) + '\\ldots'; };
const zekerRond = (x, d) => !W.grensgeval(x, d);

// ---- keuzes
const QR = [{ k: 'Q', l: '\\mathbb{Q}', tekst: 'ℚ' }, { k: 'RQ', l: '\\mathbb{R}\\setminus\\mathbb{Q}', tekst: 'ℝ \\ ℚ' }];
const NZQR = [{ k: 'N', l: '\\mathbb{N}', tekst: 'ℕ' }, { k: 'Z', l: '\\mathbb{Z}', tekst: 'ℤ' }, { k: 'Q', l: '\\mathbb{Q}', tekst: 'ℚ' }, { k: 'RQ', l: '\\mathbb{R}\\setminus\\mathbb{Q}', tekst: 'ℝ \\ ℚ' }];
const JANEE = [{ k: 'ja', l: 'ja', html: true, tekst: 'ja' }, { k: 'nee', l: 'nee', html: true, tekst: 'nee' }];
const WAAR = [{ k: 'w', l: 'waar', html: true, tekst: 'waar' }, { k: 'nw', l: 'niet waar', html: true, tekst: 'niet waar' }];
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist });
const getal = (waarde, dec = null, extra = {}) => ({ soort: 'getal', waarde, dec, ...extra });
const expr = (e, vormen = [], extra = {}) => ({ soort: 'expr', expr: e, vormen, ...extra });
const veldE = (e, vormen = []) => ({ expr: e, vormen });
const V = (x) => ({ soort: 'vakjes', sjabloon: [{ tex: 'V = \\{' }, { veld: 0 }, { tex: '\\}' }], velden: [veldE(String(x).replace('.', ','))] });

// ---- extra vormcontroles voor de rekenkern
E.VORMEN.wortelvrij = (k) => {
  const z = (x) => { while (x.t === 'neg' || x.t === 'haak') x = x.x; return x; };
  const r = z(k);
  const heeftWortel = (x) => x && (x.t === 'wortel' || ['x', 'a', 'b', 'e'].some(p => heeftWortel(x[p])) || (x.fs || x.ts || []).some(heeftWortel));
  if (r.t === 'deel' && heeftWortel(r.b)) return 'Er staat nog een wortel in de noemer.';
  let wortelFout = null;
  (function loop(x) { if (!x || typeof x !== 'object') return; if (x.t === 'wortel' && x.n === 2) { const b = z(x.x); if (b.t === 'num' && /^\d+$/.test(b.s) && haalUit(+b.s).k > 1) wortelFout = 'Je kan nog factoren buiten het wortelteken brengen.'; } ['x', 'a', 'b', 'e'].forEach(p => loop(x[p])); (x.fs || x.ts || []).forEach(loop); })(k);
  if (wortelFout) return wortelFout;
  if (r.t === 'deel') {
    const getallen = (x, uit = []) => { x = z(x); if (x.t === 'num') uit.push(+x.s); if (x.t === 'maal') x.fs.forEach(f => getallen(f, uit)); return uit; };
    const t = getallen(r.a).reduce((a, b) => a * b, 1), n = getallen(r.b).reduce((a, b) => a * b, 1);
    if (Number.isInteger(t) && Number.isInteger(n) && ggd(t, n) > 1) return 'Vereenvoudig de breuk nog.';
  }
  return null;
};
for (let q = 2; q <= 12; q++) {
  E.VORMEN['wortel' + q] = (k) => {
    if (k.t !== 'wortel') return 'Schrijf je antwoord als één wortel (wortelvorm).';
    if (k.n !== q) return k.n > q ? 'Vereenvoudig eerst de breuk in de exponent.' : 'Kijk nog eens naar de wortelexponent: dat is de noemer van de exponent.';
    const bevatW = (x) => x && (x.t === 'wortel' || ['x', 'a', 'b', 'e'].some(p => bevatW(x[p])) || (x.fs || x.ts || []).some(bevatW));
    if (bevatW(k.x)) return 'Er mag geen wortel in de wortel staan.';
    return null;
  };
}

// ---- getallenas (SVG), zelfde stijl als in de les: rode haakjes, dikke lijn
const ASKLEUR = '#1d6f73', HAAKKLEUR = '#c0392b';
function getallenas(r, min = -5, max = 6, breedte = 34) {
  const u = breedte, x0 = 24, w = x0 * 2 + (max - min) * u, hh = 50, y = 20;
  const X = (v) => x0 + (v - min) * u;
  let s = `<svg class="as" viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let v = min; v <= max; v++) {
    s += `<line x1="${X(v)}" y1="${y - 5}" x2="${X(v)}" y2="${y + 5}" stroke="#555" stroke-width="1.2"/>`;
    s += `<text x="${X(v)}" y="${y + 22}" font-size="13" font-family="Verdana,sans-serif" text-anchor="middle" fill="#333">${v < 0 ? '−' + (-v) : v}</text>`;
  }
  if (r) {
    const xa = r.a === null ? 8 : X(r.a), xb = r.b === null ? w - 8 : X(r.b);
    s += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="${ASKLEUR}" stroke-width="5"/>`;
    if (r.a === null) s += `<path d="M14,${y - 7} L2,${y} L14,${y + 7} Z" fill="${ASKLEUR}"/>`;
    if (r.b === null) s += `<path d="M${w - 14},${y - 7} L${w - 2},${y} L${w - 14},${y + 7} Z" fill="${ASKLEUR}"/>`;
    const haak = (x, naarRechts) => { const d = naarRechts ? 6 : -6; return `<path d="M${x + d},${y - 12} L${x},${y - 12} L${x},${y + 12} L${x + d},${y + 12}" stroke="${HAAKKLEUR}" stroke-width="2.6" fill="none"/>`; };
    if (r.a !== null) s += haak(xa, r.ai);      // [ = naar binnen (grens hoort erbij)
    if (r.b !== null) s += haak(xb, !r.bi);     // ] = naar binnen
  }
  return s + '</svg>';
}
const ivTex = (r) => Invoer.intervalTex(r);
const ogTex = (r) => Invoer.ongelijkheidTex(r);
const ivTekst = (r) => W.platteTekst(ivTex(r));

// ---- rooster met twee punten (SVG)
function rooster(P, Q, namen = ['A', 'B'], bereik = 6) {
  const u = 22, n = bereik, w = 2 * n * u + 30, o = w / 2;
  const X = (x) => o + x * u, Y = (y) => o - y * u;
  let s = `<svg viewBox="0 0 ${w} ${w}" width="${w}" height="${w}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rooster">`;
  for (let i = -n; i <= n; i++) s += `<line x1="${X(i)}" y1="${Y(-n)}" x2="${X(i)}" y2="${Y(n)}" stroke="#e2e6ec"/><line x1="${X(-n)}" y1="${Y(i)}" x2="${X(n)}" y2="${Y(i)}" stroke="#e2e6ec"/>`;
  s += `<line x1="${X(-n)}" y1="${o}" x2="${X(n) + 8}" y2="${o}" stroke="#444"/><line x1="${o}" y1="${Y(-n)}" x2="${o}" y2="${Y(n) - 8}" stroke="#444"/>`;
  for (let i = -n; i <= n; i += 1) if (i) s += `<text x="${X(i)}" y="${o + 13}" font-size="9" text-anchor="middle" fill="#666">${i < 0 ? '−' + (-i) : i}</text><text x="${o - 4}" y="${Y(i) + 3}" font-size="9" text-anchor="end" fill="#666">${i < 0 ? '−' + (-i) : i}</text>`;
  s += `<line x1="${X(P[0])}" y1="${Y(P[1])}" x2="${X(Q[0])}" y2="${Y(Q[1])}" stroke="${ASKLEUR}" stroke-width="2"/>`;
  s += `<line x1="${X(P[0])}" y1="${Y(P[1])}" x2="${X(Q[0])}" y2="${Y(P[1])}" stroke="${ASKLEUR}" stroke-dasharray="4 3"/><line x1="${X(Q[0])}" y1="${Y(P[1])}" x2="${X(Q[0])}" y2="${Y(Q[1])}" stroke="${ASKLEUR}" stroke-dasharray="4 3"/>`;
  [[P, namen[0]], [Q, namen[1]]].forEach(([p, nm]) => { s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4" fill="${HAAKKLEUR}"/><text x="${X(p[0]) + 6}" y="${Y(p[1]) - 6}" font-size="12" font-weight="bold" fill="${HAAKKLEUR}">${nm}</text>`; });
  return s + '</svg>';
}

// ---- rechthoekige driehoek (SVG) met namen van de zijden
function driehoekSVG(labels = { a: 'a', b: 'b', c: 'c' }) {
  return `<svg viewBox="0 0 200 130" width="200" height="130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rechthoekige driehoek">
    <path d="M30,15 L30,110 L180,110 Z" fill="#fff" stroke="#222" stroke-width="2"/><path d="M30,98 L42,98 L42,110" fill="none" stroke="#222"/>
    <text x="14" y="66" font-size="16" font-weight="bold" fill="#1c4e8a">${labels.a}</text>
    <text x="100" y="128" font-size="16" font-weight="bold" fill="#1c4e8a">${labels.b}</text>
    <text x="112" y="56" font-size="16" font-weight="bold" fill="#b83a2e">${labels.c}</text></svg>`;
}
