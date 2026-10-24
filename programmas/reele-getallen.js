// Programma 'reele-getallen' — automatisch samengevoegd uit bron/reele-getallen/ (niet rechtstreeks bewerken)
(() => {
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
// ===================================================================
//  DEEL 1 — De reële getallen
// ===================================================================
// decimale vorm van p/q (q > 0): {voor, periode, geheel, teken}
function decimaal(p, q) {
  const teken = p < 0 ? '-' : ''; p = Math.abs(p);
  const geheel = Math.floor(p / q); let rest = p % q;
  const cijfers = [], gezien = new Map();
  while (rest !== 0 && !gezien.has(rest)) { gezien.set(rest, cijfers.length); rest *= 10; cijfers.push(Math.floor(rest / q)); rest %= q; }
  if (rest === 0) return { teken, geheel, voor: cijfers.join(''), periode: '' };
  const s = gezien.get(rest);
  return { teken, geheel, voor: cijfers.slice(0, s).join(''), periode: cijfers.slice(s).join('') };
}
const decTex = (d) => `${d.teken}${d.geheel}${d.voor || d.periode ? '{,}' + d.voor + d.periode + (d.periode ? d.periode + '\\ldots' : '') : ''}`;
const decSoort = (d) => !d.periode ? 'begrensd' : d.voor ? 'gemengd repeterend' : 'zuiver repeterend';

// willekeurig rationaal decimaal getal in een bepaalde vorm
function rationaalDecimaal(vorm) {
  if (vorm === 'begrensd') {
    const n = kies([1, 2, 3]), x = (Math.random() < 0.3 ? -1 : 1) * rnd(1, 10 ** n * kies([1, 1, 3, 6])) / 10 ** n;
    if (Number.isInteger(x)) return rationaalDecimaal(vorm);
    return { tex: tg(x), soort: 'begrensd' };
  }
  const g = rnd(0, 6);
  let per; if (Math.random() < 0.4) per = String(rnd(1, 8)); else { const x = rnd(1, 9); let y; do { y = rnd(0, 9); } while (y === x); per = `${x}${y}`; }
  const herhaal = per.length === 1 ? per.repeat(3) : per.repeat(2);
  if (vorm === 'zuiver') return { tex: `${g}{,}${herhaal}\\ldots`, soort: 'zuiver repeterend' };
  let v; do { v = String(rnd(0, 9)) + (Math.random() < 0.3 ? String(rnd(0, 9)) : ''); } while (v[v.length - 1] === per[per.length - 1]);
  return { tex: `${g}{,}${v}${herhaal}\\ldots`, soort: 'gemengd repeterend' };
}

const VENN = `<div class="venn"><span class="vlab">$\\mathbb{R}$</span>
  <div class="vgebied"><span class="vlab">$\\mathbb{Q}$</span>
    <div class="vgebied"><span class="vlab">$\\mathbb{Z}$</span>
      <div class="vgebied" style="max-width:60%"><span class="vlab">$\\mathbb{N}$</span><span class="ex">$0$</span><span class="ex">$5$</span></div>
      <span class="ex">$-3$</span></div>
    <span class="ex">$\\frac{1}{3}$</span><span class="ex">$0{,}75$</span></div>
  <div class="vgebied irr"><span class="vlab">$\\mathbb{R}\\setminus\\mathbb{Q}$</span><span class="ex">$\\pi$</span><br><span class="ex">$\\sqrt{2}$</span></div>
</div>`;

const DEEL1 = {
  nr: 1, titel: 'De reële getallen', kort: 'Rationaal of irrationaal? ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.',
  rekenmachine: true,
  opdracht: 'Is het getal rationaal of irrationaal?',
  theorie: `
    <div class="kader">
      <div class="kader-titel">Herhaling: decimale vormen</div>
      <p>In $\\mathbb{Q}$ kwamen we drie soorten decimale getallen tegen.</p>
      <table class="tabel"><tr><th>begrensd</th><th>zuiver repeterend</th><th>gemengd repeterend</th></tr>
        <tr><td>$\\frac{3}{4} = 0{,}75$</td><td>$\\frac{1}{3} = 0{,}33\\ldots$</td><td>$\\frac{1}{6} = 0{,}166\\ldots$</td></tr>
        <tr><td class="klein">De deling stopt: de rest wordt 0.</td><td class="klein">De periode begint meteen na de komma.</td><td class="klein">Eerst een vast deel, dan pas de periode.</td></tr></table>
      <p>Al deze getallen zijn <b>rationaal</b>: je kan ze schrijven als breuk. Maar er bestaan ook decimale getallen die <b>nooit</b> stoppen en <b>nooit</b> herhalen …</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Irrationale getallen ($\\mathbb{R}\\setminus\\mathbb{Q}$)</div>
      <p>Decimale getallen die <b>niet begrensd</b> en <b>niet repeterend</b> zijn.</p>
      <p>$\\pi = 3{,}14159265358979\\ldots$ &nbsp; <span class="klein">de cijfers lopen eindeloos door, zonder periode</span></p>
      <p>$\\sqrt{2} = 1{,}41421356237309\\ldots$ &nbsp; <span class="klein">ook hier vind je nooit een periode</span></p>
      <p class="let-op">Een irrationaal getal kan je nooit exact als breuk schrijven. Je rekenmachine toont altijd een benadering.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Reële getallen</div>
      <p class="midden">$\\mathbb{R} = \\mathbb{Q} \\cup (\\mathbb{R}\\setminus\\mathbb{Q})$</p>
      <p>Alle rationale én irrationale getallen samen vormen de <b>reële getallen</b>.</p>
      <p>$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$ &nbsp;·&nbsp; $\\mathbb{R}\\setminus\\mathbb{Q}$ = de irrationale getallen.</p>
      ${VENN}
      <p class="klein">Elk getal dat je in dit schooljaar tegenkomt, is een reëel getal.</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Werkwijze: rationaal of irrationaal?</div>
      <ol>
        <li>Schrijf het getal decimaal (gebruik je rekenmachine bij een breuk of een wortel). Schrijf minstens 6 decimalen of de periode tweemaal.</li>
        <li><b>Begrensd</b> of <b>repeterend</b>? Dan is het getal rationaal: $\\mathbb{Q}$.</li>
        <li><b>Niet begrensd én niet repeterend</b>? Dan is het getal irrationaal: $\\mathbb{R}\\setminus\\mathbb{Q}$.</li>
      </ol>
      <p class="klein">Let op: $\\sqrt{16} = 4$ en $\\sqrt{0{,}25} = 0{,}5$ zijn gewoon rationale getallen.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">In welk deel van het diagram?</div>
      <p>Zet een getal altijd in het <b>kleinste</b> deel waar het in past: $9 \\in \\mathbb{N}$, $-4 \\in \\mathbb{Z}$, $0{,}5 \\in \\mathbb{Q}$, $\\pi \\in \\mathbb{R}\\setminus\\mathbb{Q}$.</p>
    </div>`,
  voorbeelden: [
    { tex: '0{,}75', stappen: ['\\text{begrensd: de deling stopt}', '0{,}75 \\in \\mathbb{Q}'] },
    { tex: '2{,}333\\ldots', stappen: ['\\text{zuiver repeterend: de periode 3 begint meteen na de komma}', '2{,}333\\ldots \\in \\mathbb{Q}'] },
    { tex: '\\pi = 3{,}14159\\ldots', stappen: ['\\text{niet begrensd en niet repeterend}', '\\pi \\in \\mathbb{R}\\setminus\\mathbb{Q}'] },
    { tex: '0{,}1666\\ldots', stappen: ['\\text{gemengd repeterend: eerst 1, dan de periode 6}', '0{,}1666\\ldots \\in \\mathbb{Q}'] },
    { tex: '\\sqrt{2} = 1{,}41421\\ldots', stappen: ['\\text{niet begrensd en niet repeterend}', '\\sqrt{2} \\in \\mathbb{R}\\setminus\\mathbb{Q}'] },
    { tex: '\\frac{5}{11}', stappen: ['\\text{rekenmachine: } \\frac{5}{11} = 0{,}4545\\ldots', '\\text{zuiver repeterend, dus } \\frac{5}{11} \\in \\mathbb{Q}'] },
    { tex: '\\sqrt{25} \\quad \\text{(plaats in het diagram)}', stappen: ['\\sqrt{25} = 5', '5 \\text{ is een natuurlijk getal: het kleinste deel is } \\mathbb{N}'] },
  ],
  soorten: {
    qofr: { naam: 'Rationaal of irrationaal?', gen() {
      const r = Math.random();
      if (r < 0.2) { const d = rationaalDecimaal('begrensd'); return { soort: 'qofr', tex: d.tex, antw: keuze(QR, 'Q'), uitleg: [`${d.tex} \\text{ is begrensd, dus rationaal: } \\mathbb{Q}`] }; }
      if (r < 0.35) { const d = rationaalDecimaal('zuiver'); return { soort: 'qofr', tex: d.tex, antw: keuze(QR, 'Q'), uitleg: [`${d.tex} \\text{ is zuiver repeterend, dus rationaal: } \\mathbb{Q}`] }; }
      if (r < 0.5) { const d = rationaalDecimaal('gemengd'); return { soort: 'qofr', tex: d.tex, antw: keuze(QR, 'Q'), uitleg: [`${d.tex} \\text{ is gemengd repeterend, dus rationaal: } \\mathbb{Q}`] }; }
      if (r < 0.58) { const z = rnd(-12, 30); return { soort: 'qofr', tex: `${z}`, antw: keuze(QR, 'Q'), uitleg: [`${z} \\text{ is een geheel getal en dus ook rationaal: } ${z} = \\frac{${z}}{1}`] }; }
      if (r < 0.68) { return { soort: 'qofr', tex: `\\pi = 3{,}14159265\\ldots`, antw: keuze(QR, 'RQ'), sleutel: 'pi' + rnd(1, 3), uitleg: ['\\pi \\text{ is niet begrensd en niet repeterend: } \\mathbb{R}\\setminus\\mathbb{Q}'] }; }
      let n; do { n = rnd(2, 60); } while (isKwadraat(n));
      const t = `\\sqrt{${n}} = ${afgekapt(Math.sqrt(n), 8)}`;
      return { soort: 'qofr', tex: t, antw: keuze(QR, 'RQ'), uitleg: [`\\sqrt{${n}} \\text{ is niet begrensd en niet repeterend: } \\mathbb{R}\\setminus\\mathbb{Q}`] };
    } },
    rekenmachine: { naam: 'Reken uit en kies', gen() {
      const r = Math.random();
      if (r < 0.45) {
        const q = kies([3, 4, 5, 6, 8, 9, 11, 12, 15, 20, 25]); let p; do { p = rnd(1, 2 * q); } while (p % q === 0);
        const g = ggd(p, q); if (g > 1 && Math.random() < 0.6) return this.gen();
        const d = decimaal(p, q), dt = decTex(d), s = decSoort(d);
        return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Is het getal rationaal of irrationaal?', tex: `\\frac{${p}}{${q}}`, antw: keuze(QR, 'Q'),
          uitleg: [`\\frac{${p}}{${q}} = ${dt}`, `\\text{${s}, dus } \\mathbb{Q}`] };
      }
      if (r < 0.7) {
        const k = rnd(2, 15), dec = Math.random() < 0.35;
        const n = dec ? kies([0.25, 0.49, 0.09, 0.36, 0.64, 0.81, 1.44, 2.25, 0.16]) : k * k, w = Math.sqrt(n);
        return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Is het getal rationaal of irrationaal?', tex: `\\sqrt{${tg(n)}}`, antw: keuze(QR, 'Q'),
          uitleg: [`\\sqrt{${tg(n)}} = ${tg(+w.toFixed(4))}`, `\\text{begrensd, dus } \\mathbb{Q}`] };
      }
      const dec = Math.random() < 0.2;
      let n; do { n = rnd(2, 99); } while (dec ? isKwadraat(10 * n) || n % 10 === 0 : isKwadraat(n));
      if (dec) n = n / 10;
      return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Is het getal rationaal of irrationaal?', tex: `\\sqrt{${tg(n)}}`, antw: keuze(QR, 'RQ'),
        uitleg: [`\\sqrt{${tg(n)}} = ${afgekapt(Math.sqrt(n), 6)}`, `\\text{niet begrensd en niet repeterend, dus } \\mathbb{R}\\setminus\\mathbb{Q}`] };
    } },
    diagram: { naam: 'Plaats in het diagram', gen() {
      const r = Math.random(); let tex, juist, uitleg;
      if (r < 0.17) { const n = rnd(0, 25); tex = `${n}`; juist = 'N'; uitleg = `${n} \\text{ is een natuurlijk getal: } \\mathbb{N}`; }
      else if (r < 0.3) { const n = -rnd(1, 25); tex = `${n}`; juist = 'Z'; uitleg = `${n} \\text{ is een negatief geheel getal: } \\mathbb{Z}`; }
      else if (r < 0.4) { const k = rnd(2, 12); tex = `\\sqrt{${k * k}}`; juist = 'N'; uitleg = `\\sqrt{${k * k}} = ${k} \\text{, een natuurlijk getal: } \\mathbb{N}`; }
      else if (r < 0.46) { const k = rnd(2, 10); tex = `-\\sqrt{${k * k}}`; juist = 'Z'; uitleg = `-\\sqrt{${k * k}} = -${k} \\text{, een geheel getal: } \\mathbb{Z}`; }
      else if (r < 0.58) { let p, q; do { q = rnd(2, 9); p = rnd(1, 3 * q); } while (p % q === 0); const t = W.breukTex(Math.random() < 0.3 ? -p : p, q); tex = t; juist = 'Q';
        uitleg = `${t} \\text{ is een breuk (geen geheel getal): } \\mathbb{Q}`; }
      else if (r < 0.7) { const d = rationaalDecimaal(kies(['begrensd', 'begrensd', 'zuiver'])); tex = d.tex; juist = 'Q'; uitleg = `${d.tex} \\text{ is ${d.soort}: } \\mathbb{Q}`; }
      else if (r < 0.78) { tex = '\\pi'; juist = 'RQ'; uitleg = '\\pi \\text{ is irrationaal: } \\mathbb{R}\\setminus\\mathbb{Q}'; }
      else { let n; do { n = rnd(2, 60); } while (isKwadraat(n)); tex = (Math.random() < 0.2 ? '-' : '') + `\\sqrt{${n}}`; juist = 'RQ'; uitleg = `${tex} = ${tex.startsWith('-') ? '-' : ''}${afgekapt(Math.sqrt(n), 5)} \\text{ is irrationaal: } \\mathbb{R}\\setminus\\mathbb{Q}`; }
      return { soort: 'diagram', opdracht: 'In welk deel van het diagram plaats je dit getal? Kies het kleinste deel.', tex, antw: keuze(NZQR, juist), uitleg: [uitleg] };
    } },
    waarniet: { naam: 'Waar of niet waar?', gen() {
      const lijst = [
        () => ['Elk natuurlijk getal is een reëel getal.', 'w', '\\mathbb{N} \\subset \\mathbb{R}'],
        () => ['Elk reëel getal is een rationaal getal.', 'nw', '\\pi \\text{ en } \\sqrt{2} \\text{ zijn reëel maar niet rationaal.}'],
        () => ['Elk rationaal getal is een reëel getal.', 'w', '\\mathbb{Q} \\subset \\mathbb{R}'],
        () => ['Elk geheel getal is een natuurlijk getal.', 'nw', '-3 \\in \\mathbb{Z}, \\text{ maar } -3 \\notin \\mathbb{N}'],
        () => ['Elk natuurlijk getal is een geheel getal.', 'w', '\\mathbb{N} \\subset \\mathbb{Z}'],
        () => ['π kan je exact als breuk schrijven.', 'nw', '\\pi \\text{ is irrationaal: dat kan je nooit exact als breuk schrijven.}'],
        () => ['Je rekenmachine toont de exacte waarde van √2.', 'nw', '\\sqrt{2} \\text{ is irrationaal: je rekenmachine toont een benadering.}'],
        () => ['Een irrationaal getal is begrensd of repeterend.', 'nw', '\\text{Een irrationaal getal is niet begrensd en niet repeterend.}'],
        () => { const k = rnd(2, 12), sq = Math.random() < 0.5, n = sq ? k * k : (() => { let m; do { m = rnd(2, 80); } while (isKwadraat(m)); return m; })();
          return [`√${n} is een rationaal getal.`, sq ? 'w' : 'nw', sq ? `\\sqrt{${n}} = ${k} \\in \\mathbb{Q}` : `\\sqrt{${n}} = ${afgekapt(Math.sqrt(n), 5)} \\text{ is irrationaal}`]; },
        () => { const d = rationaalDecimaal(kies(['zuiver', 'gemengd'])); return [`${W.platteTekst(d.tex)} is een irrationaal getal.`, 'nw', `${d.tex} \\text{ is ${d.soort}, dus rationaal.}`]; },
        () => { const z = -rnd(1, 20); return [`${kg(z).replace('-', '−')} behoort tot ℤ en tot ℝ.`, 'w', `${z} \\in \\mathbb{Z} \\text{ en } \\mathbb{Z} \\subset \\mathbb{R}`]; },
        () => { const x = -rnd(11, 99) / 10; return [`${kg(x).replace('-', '−')} behoort tot ℤ.`, 'nw', `${tg(x)} \\text{ is geen geheel getal: } ${tg(x)} \\in \\mathbb{Q}`]; },
        () => { let n; do { n = rnd(2, 50); } while (isKwadraat(n)); return [`√${n} behoort tot ℝ \\ ℚ.`, 'w', `\\sqrt{${n}} \\text{ is irrationaal.}`]; },
        () => ['ℚ ⊂ ℤ', 'nw', '\\text{Andersom: } \\mathbb{Z} \\subset \\mathbb{Q}. \\text{ Bv. } \\frac{1}{3} \\in \\mathbb{Q} \\text{ maar } \\frac{1}{3} \\notin \\mathbb{Z}'],
      ];
      const [zin, juist, u] = kies(lijst)();
      return { soort: 'waarniet', opdracht: 'Waar of niet waar?', html: `<div class="tekstopgave">${W.esc(zin)}</div>`, rapport: zin, sleutel: zin, antw: keuze(WAAR, juist), uitleg: [u] };
    } },
  },
  oefenMix: [['qofr', 3], ['rekenmachine', 2], ['diagram', 3], ['waarniet', 2]],
  test: [['qofr', 3], ['rekenmachine', 2], ['diagram', 3], ['waarniet', 2]],
};

// ===================================================================
//  DEEL 2 — Bewerkingen in ℝ (met rekenmachine)
// ===================================================================
const DEEL2 = {
  nr: 2, titel: 'Bewerkingen in ℝ', kort: 'Derdemachtswortels, afronden, wortels benaderen en splitsen.',
  rekenmachine: true,
  opdracht: 'Bereken.',
  theorie: `
    <div class="kader werk">
      <div class="kader-titel">Afspraken</div>
      <p><b>1.</b> Gebruik <b>extra haakjes</b> waar nodig: $\\sqrt[3]{20} = 20^{\\frac{1}{3}}$ → tik <code>20 ^ ( 1 ÷ 3 )</code>.</p>
      <p><b>2.</b> Schrijf tussenresultaten op met <b>minstens 2 extra decimalen</b>. Moet je antwoord op 2 decimalen? Noteer tussenresultaten dan met minstens 4 decimalen. Pas op het einde rond je af.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Waarom 2 extra decimalen?</div>
      <p>Bereken $\\sqrt{2} \\cdot \\sqrt{8}$ op 2 decimalen.</p>
      <p><span class="rood"><b>Fout:</b> eerst afronden op 2 decimalen</span><br>$1{,}41 \\cdot 2{,}83 = 3{,}9903 \\approx 3{,}99$</p>
      <p><span class="groen"><b>Juist:</b> tussenresultaten met 4 decimalen</span><br>$1{,}4142 \\cdot 2{,}8284 = 3{,}99992\\ldots \\approx 4{,}00$</p>
      <p class="klein">Controle: $\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4$. Wie te vroeg afrondt, krijgt een fout antwoord.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Derdemachtswortels</div>
      <p>De <b>derdemachtswortel</b> van een getal is het getal dat je <b>tot de derde macht</b> moet verheffen om dat getal te krijgen.</p>
      <table class="tabel"><tr><td>$\\sqrt[3]{1} = 1$</td><td>want $1^3 = 1$</td></tr><tr><td>$\\sqrt[3]{8} = 2$</td><td>want $2^3 = 2 \\cdot 2 \\cdot 2 = 8$</td></tr>
        <tr><td>$\\sqrt[3]{27} = 3$</td><td>want $3^3 = 3 \\cdot 3 \\cdot 3 = 27$</td></tr><tr><td>$\\sqrt[3]{-8} = -2$</td><td>want $(-2)^3 = (-2) \\cdot (-2) \\cdot (-2) = -8$</td></tr></table>
      <p class="let-op">De derdemachtswortel van een negatief getal bestaat wél: het resultaat is negatief.</p>
      <p class="klein">Gekende derdemachten: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Op de rekenmachine</div>
      <p>Een derdemachtswortel kan je schrijven als een macht: $\\sqrt[3]{x} = x^{\\frac{1}{3}}$</p>
      <ul><li>gebruik de toets voor de derdemachtswortel, <b>of</b></li><li>tik <code>x ^ ( 1 ÷ 3 )</code> (vergeet de haakjes niet!)</li></ul>
      <p>$\\sqrt[3]{27} = 27^{\\frac{1}{3}} = 3$ &nbsp; want $3^3 = 27$</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Bereken op 5 decimalen</div>
      <p>$\\sqrt[3]{2020} \\approx 12{,}64107$ <span class="klein">— controle: het ligt tussen 12 en 13, want $12^3 = 1728$ en $13^3 = 2197$.</span></p>
      <p>$\\sqrt[3]{-17} \\approx -2{,}57128$ <span class="klein">— controle: het ligt tussen −3 en −2, want $(-3)^3 = -27$ en $(-2)^3 = -8$.</span></p>
      <p class="blauwtekst">Zesde decimaal ≥ 5? Dan verhoog je de vijfde decimaal met 1.</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Benaderen van wortels</div>
      <p>Zoek het gekende <b>kwadraat</b> (bij $\\sqrt{\\phantom{x}}$) of de gekende <b>derdemacht</b> (bij $\\sqrt[3]{\\phantom{x}}$) die net kleiner en net groter is.</p>
      <table class="tabel"><tr><th>kwadraten</th><td>1 &nbsp; 4 &nbsp; 9 &nbsp; 16 &nbsp; 25 &nbsp; 36 &nbsp; 49 &nbsp; 64 &nbsp; 81 &nbsp; 100</td></tr>
        <tr><th>derdemachten</th><td>1 &nbsp; 8 &nbsp; 27 &nbsp; 64 &nbsp; 125</td></tr></table>
      <p>$\\sqrt{20}$: &nbsp; $16 < 20 < 25 \\;\\rightarrow\\; 4 < \\sqrt{20} < 5$ &nbsp; en met de rekenmachine $\\sqrt{20} \\approx 4{,}47$</p>
      <p>$\\sqrt[3]{20}$: &nbsp; $8 < 20 < 27 \\;\\rightarrow\\; 2 < \\sqrt[3]{20} < 3$ &nbsp; en met de rekenmachine $\\sqrt[3]{20} \\approx 2{,}71$</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Wortel van een product</div>
      <p class="midden">$\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}$</p>
      <p>$\\sqrt{9 \\cdot 7} = \\sqrt{9} \\cdot \\sqrt{7} = 3 \\cdot \\sqrt{7} \\approx 7{,}94$ &nbsp; <span class="klein">($\\sqrt{9} = 3$ is een gekende wortel)</span></p>
      <p>$\\sqrt{7{,}3^2} = 7{,}3$ &nbsp; <span class="klein">De vierkantswortel en het kwadraat heffen elkaar op (bij een positief getal).</span></p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <p>Typ een kommagetal met een komma: <code>12,64107</code>. Een negatief getal: <code>-2,57128</code>. Bij het splitsen van een wortel typ je bv. <code>3√7</code> (knop √).</p></div>`,
  voorbeelden: [
    { tex: '\\sqrt[3]{125}', stappen: ['5^3 = 125', '\\sqrt[3]{125} = 5'] },
    { tex: '\\sqrt[3]{-64}', stappen: ['(-4)^3 = -64', '\\sqrt[3]{-64} = -4'] },
    { tex: '\\sqrt[3]{2020} \\text{ op 5 decimalen}', stappen: ['\\text{rekenmachine: } 2020^{\\frac{1}{3}} = 12{,}641071\\ldots', '\\text{zesde decimaal is 1: niet verhogen}', '\\sqrt[3]{2020} \\approx 12{,}64107', '\\text{controle: } 12^3 = 1728 < 2020 < 2197 = 13^3'] },
    { tex: '\\sqrt{20} \\text{ benaderen}', stappen: ['16 < 20 < 25', '4 < \\sqrt{20} < 5', '\\text{rekenmachine: } \\sqrt{20} \\approx 4{,}47'] },
    { tex: '\\sqrt[3]{23} \\text{ benaderen}', stappen: ['8 < 23 < 27 \\quad (8 = 2^3,\\ 27 = 3^3)', '2 < \\sqrt[3]{23} < 3', '\\text{rekenmachine: } \\sqrt[3]{23} \\approx 2{,}84'] },
    { tex: '\\sqrt{9 \\cdot 7}', stappen: ['\\sqrt{9 \\cdot 7} = \\sqrt{9} \\cdot \\sqrt{7}', '= 3 \\cdot \\sqrt{7}', '\\approx 7{,}94'] },
    { tex: '\\sqrt{2} \\cdot \\sqrt{8} \\text{ op 2 decimalen}', stappen: ['\\text{tussenresultaten met 4 decimalen: } 1{,}4142 \\cdot 2{,}8284', '= 3{,}99992\\ldots', '\\approx 4{,}00'] },
  ],
  soorten: {
    derde: { naam: 'Derdemachtswortel zonder rekenmachine', gen() {
      const k = rnd(1, 10), t = Math.random() < 0.4 ? -1 : 1, a = t * k ** 3, w = t * k;
      return { soort: 'derde', opdracht: 'Bereken zonder rekenmachine.', tex: `\\sqrt[3]{${a}}`, antw: getal(w), uitleg: [`\\sqrt[3]{${a}} = ${w} \\quad \\text{want} \\quad ${h(w)}^3 = ${a}`] };
    } },
    vijfdec: { naam: 'Op 5 decimalen', gen() {
      for (;;) {
        let n, tex, w, uit;
        if (Math.random() < 0.65) {
          n = Math.random() < 0.15 ? kies([0.5, 0.2, 0.7, 1.5, 2.5]) : (Math.random() < 0.3 ? -1 : 1) * rnd(2, 2999);
          if (Number.isInteger(n) && isDerde(Math.abs(n))) continue;
          tex = `\\sqrt[3]{${tg(n)}}`; w = Math.cbrt(n);
          const g = Math.floor(w);
          uit = Number.isInteger(n) && Math.abs(n) > 1 ? [`\\text{rekenmachine: } ${h(n)}^{\\frac{1}{3}} = ${afgekapt(w, 6)}`, `\\text{controle: } ${h(g)}^3 = ${g ** 3} < ${n} < ${(g + 1) ** 3} = ${h(g + 1)}^3`] : [`\\text{rekenmachine: } ${h(n)}^{\\frac{1}{3}} = ${afgekapt(w, 6)}`];
        } else {
          n = rnd(2, 999); if (isKwadraat(n)) continue;
          tex = `\\sqrt{${n}}`; w = Math.sqrt(n); uit = [`\\text{rekenmachine: } \\sqrt{${n}} = ${afgekapt(w, 6)}`];
        }
        if (!zekerRond(w, 5)) continue;
        uit.push(`${tex} \\approx ${tg(w, 5)}`);
        return { soort: 'vijfdec', opdracht: 'Bereken met je rekenmachine op 5 decimalen.', tex, antw: getal(w, 5, { voor: '\\approx' }), uitleg: uit };
      }
    } },
    tussen: { naam: 'Benader tussen twee gekende wortels', gen() {
      for (;;) {
        const derde = Math.random() < 0.4;
        const n = derde ? rnd(2, 124) : rnd(2, 99);
        if (derde ? isDerde(n) : isKwadraat(n)) continue;
        const w = derde ? Math.cbrt(n) : Math.sqrt(n), g = Math.floor(w);
        if (!zekerRond(w, 2)) continue;
        const wt = derde ? `\\sqrt[3]{${n}}` : `\\sqrt{${n}}`, m = derde ? 3 : 2;
        return { soort: 'tussen', opdracht: 'Tussen welke twee gehele getallen ligt de wortel? Controleer daarna met je rekenmachine (2 decimalen).', tex: wt,
          antw: { soort: 'delen', delen: [
            { label: '\\text{ligt tussen}', antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { tex: `< ${wt} <` }, { veld: 1 }], velden: [veldE(String(g)), veldE(String(g + 1))] } },
            { label: '\\text{rekenmachine}', antw: getal(w, 2, { voor: `${wt} \\approx` }) }] },
          uitleg: [`${g ** m} < ${n} < ${(g + 1) ** m} \\quad (${g ** m} = ${g}^${m},\\ ${(g + 1) ** m} = ${g + 1}^${m})`, `${g} < ${wt} < ${g + 1}`, `${wt} \\approx ${tg(w, 2)}`] };
      }
    } },
    product: { naam: 'Wortel van een product splitsen', gen() {
      if (Math.random() < 0.25) {
        const c = rnd(11, 99) / 10;
        return { soort: 'product', opdracht: 'Bereken. Rond af op 2 decimalen waar nodig.', tex: `\\sqrt{${tg(c)}^2}`, antw: getal(c, 2, { voor: '=' }),
          uitleg: [`\\sqrt{${tg(c)}^2} = ${tg(c)} \\quad \\text{(wortel en kwadraat heffen elkaar op)}`] };
      }
      for (;;) {
        const k = rnd(2, 10), b = kies(KW), w = k * Math.sqrt(b);
        if (!zekerRond(w, 2)) continue;
        const vorm = Math.random() < 0.5 ? `${k * k} \\cdot ${b}` : `${b} \\cdot ${k * k}`;
        return { soort: 'product', opdracht: 'Splits de wortel van het product. Rond af op 2 decimalen.', tex: `\\sqrt{${vorm}}`,
          antw: { soort: 'delen', delen: [
            { label: '\\text{uitwerking}', antw: expr(`${k}√(${b})`, ['vereenvoudigd'], { voor: '=' }) },
            { label: '\\text{resultaat}', antw: getal(w, 2, { voor: '\\approx' }) }] },
          uitleg: [`\\sqrt{${vorm}} = \\sqrt{${k * k}} \\cdot \\sqrt{${b}} = ${k} \\cdot \\sqrt{${b}} \\approx ${tg(w, 2)}`] };
      }
    } },
    tussenres: { naam: 'Bereken op 2 decimalen (tussenresultaten)', gen() {
      for (;;) {
        const vorm = kies(['maal', 'maal', 'plus', 'pi', 'min']);
        let a = rnd(2, 30), b = rnd(2, 30);
        if (isKwadraat(a) || (vorm !== 'pi' && isKwadraat(b))) continue;
        const wa = Math.sqrt(a), wb = vorm === 'pi' ? Math.PI : Math.sqrt(b);
        const r4 = (x) => W.rond(x, 4);
        let tex, exact, benad, tus;
        if (vorm === 'maal') { tex = `\\sqrt{${a}} \\cdot \\sqrt{${b}}`; exact = wa * wb; benad = r4(wa) * r4(wb); tus = `${tg(r4(wa), 4)} \\cdot ${tg(r4(wb), 4)}`; }
        if (vorm === 'plus') { tex = `\\sqrt{${a}} + \\sqrt{${b}}`; exact = wa + wb; benad = r4(wa) + r4(wb); tus = `${tg(r4(wa), 4)} + ${tg(r4(wb), 4)}`; }
        if (vorm === 'min') { if (a <= b) continue; tex = `\\sqrt{${a}} - \\sqrt{${b}}`; exact = wa - wb; benad = r4(wa) - r4(wb); tus = `${tg(r4(wa), 4)} - ${tg(r4(wb), 4)}`; }
        if (vorm === 'pi') { tex = `\\pi \\cdot \\sqrt{${a}}`; exact = Math.PI * wa; benad = r4(Math.PI) * r4(wa); tus = `${tg(r4(Math.PI), 4)} \\cdot ${tg(r4(wa), 4)}`; }
        if (!zekerRond(exact, 2) || W.rond(exact, 2) !== W.rond(benad, 2)) continue;
        const uitleg = [`\\text{tussenresultaten met 4 decimalen: } ${tus}`, `= ${afgekapt(benad, 4)} \\approx ${tg(exact, 2)}`];
        if (vorm === 'maal' && isKwadraat(a * b)) uitleg.push(`\\text{controle: } \\sqrt{${a}} \\cdot \\sqrt{${b}} = \\sqrt{${a * b}} = ${Math.sqrt(a * b)}`);
        return { soort: 'tussenres', opdracht: 'Bereken op 2 decimalen. Noteer de tussenresultaten (op je kladblad) met 4 decimalen.', tex, antw: getal(exact, 2, { voor: '\\approx' }), uitleg };
      }
    } },
  },
  oefenMix: [['derde', 2], ['vijfdec', 3], ['tussen', 2], ['product', 2], ['tussenres', 2]],
  test: [['derde', 2], ['vijfdec', 3], ['tussen', 2], ['product', 1], ['tussenres', 2]],
};

// ===================================================================
//  DEEL 3 — Bewerkingen in ℝ zonder rekenmachine
// ===================================================================
// k·√n vereenvoudigen
function vereenv(k, n) { const r = haalUit(n); return { k: k * r.k, m: r.m }; }
const DEEL3 = {
  nr: 3, titel: 'Bewerkingen in ℝ zonder rekenmachine', kort: 'Wortels vereenvoudigen, vermenigvuldigen, optellen, noemer wortelvrij maken.',
  rekenmachine: false,
  opdracht: 'Vereenvoudig.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">Wortels vereenvoudigen</div>
      <p>Schrijf het getal onder de wortel als een product met een <b>gekend kwadraat</b> (4, 9, 16, 25, 36, 49, …). Haal de wortel van dat kwadraat <b>buiten</b> de wortel.</p>
      <p>$\\sqrt{12} = \\sqrt{4 \\cdot 3} = \\sqrt{4} \\cdot \\sqrt{3} = 2\\sqrt{3}$</p>
      <p>$\\sqrt{50} = \\sqrt{25 \\cdot 2} = \\sqrt{25} \\cdot \\sqrt{2} = 5\\sqrt{2}$</p>
      <p>$\\sqrt{72} = \\sqrt{36 \\cdot 2} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$</p>
      <p class="let-op">Kies het grootste kwadraat: $\\sqrt{72} = \\sqrt{4 \\cdot 18}$ kan ook, maar dan ben je nog niet klaar.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Wortels vermenigvuldigen</div>
      <p class="midden">$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{a \\cdot b} \\qquad \\sqrt{a} \\cdot \\sqrt{a} = a$</p>
      <p>$\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4$ &nbsp;·&nbsp; $\\sqrt{5} \\cdot \\sqrt{5} = 5$</p>
      <p>$2\\sqrt{3} \\cdot 5\\sqrt{3} = 2 \\cdot 5 \\cdot \\sqrt{3} \\cdot \\sqrt{3} = 10 \\cdot 3 = 30$</p>
      <p>$3\\sqrt{2} \\cdot 4\\sqrt{5} = 3 \\cdot 4 \\cdot \\sqrt{2 \\cdot 5} = 12\\sqrt{10}$</p>
      <p class="klein">Getallen voor de wortel vermenigvuldig je met elkaar, wortels met elkaar.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Wortels optellen en aftrekken</div>
      <p>Je kan enkel <b>gelijksoortige wortels</b> optellen of aftrekken: wortels met hetzelfde getal onder het wortelteken. Net zoals bij eentermen: $3x + 5x = 8x$.</p>
      <p>$3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$ &nbsp;·&nbsp; $7\\sqrt{3} - 2\\sqrt{3} = 5\\sqrt{3}$ &nbsp;·&nbsp; $4\\sqrt{5} + \\sqrt{5} - 6\\sqrt{5} = -\\sqrt{5}$ <span class="klein">($\\sqrt{5} = 1 \\cdot \\sqrt{5}$)</span></p>
      <p class="let-op">$\\sqrt{2} + \\sqrt{3} \\neq \\sqrt{5}$: niet gelijksoortig, dit kan je niet samennemen.</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Eerst vereenvoudigen</div>
      <p>Soms zie je pas na het vereenvoudigen dat de wortels gelijksoortig zijn.</p>
      <p>$\\sqrt{12} + \\sqrt{3} = 2\\sqrt{3} + \\sqrt{3} = 3\\sqrt{3}$ &nbsp;·&nbsp; $\\sqrt{50} - \\sqrt{8} = 5\\sqrt{2} - 2\\sqrt{2} = 3\\sqrt{2}$</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Noemer wortelvrij maken</div>
      <p>Staat er een wortel in de noemer? Vermenigvuldig <b>teller én noemer</b> met die wortel. Zo verandert de waarde van de breuk niet, en verdwijnt de wortel uit de noemer.</p>
      <p class="midden">$\\dfrac{a}{\\sqrt{b}} = \\dfrac{a \\cdot \\sqrt{b}}{\\sqrt{b} \\cdot \\sqrt{b}} = \\dfrac{a\\sqrt{b}}{b}$</p>
      <p>$\\dfrac{6}{\\sqrt{3}} = \\dfrac{6 \\cdot \\sqrt{3}}{\\sqrt{3} \\cdot \\sqrt{3}} = \\dfrac{6\\sqrt{3}}{3} = 2\\sqrt{3}$ &nbsp;·&nbsp; $\\dfrac{5}{2\\sqrt{5}} = \\dfrac{5\\sqrt{5}}{10} = \\dfrac{\\sqrt{5}}{2}$</p>
      <p class="klein">Dit werkt omdat $\\sqrt{b} \\cdot \\sqrt{b} = b$. Vereenvoudig op het einde de breuk als het kan.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$6\\sqrt{2}$</td><td><code>6√2</code> (knop √)</td></tr>
        <tr><td>$-\\sqrt{5}$</td><td><code>-√5</code></td></tr>
        <tr><td>$\\dfrac{\\sqrt{5}}{2}$</td><td><code>√5/2</code></td></tr>
        <tr><td>$\\dfrac{2\\sqrt{3}}{3}$</td><td><code>2√3/3</code></td></tr></table>
      <p class="klein">Onder het invulvak zie je meteen hoe je antwoord gelezen wordt. Controleer dat voor je verdergaat.</p></div>`,
  voorbeelden: [
    { tex: '\\sqrt{48}', stappen: ['48 = 16 \\cdot 3 \\quad (16 \\text{ is het grootste kwadraat})', '\\sqrt{48} = \\sqrt{16} \\cdot \\sqrt{3}', '= 4\\sqrt{3}'] },
    { tex: '\\sqrt{6} \\cdot \\sqrt{3}', stappen: ['= \\sqrt{18}', '= \\sqrt{9 \\cdot 2} = 3\\sqrt{2}'] },
    { tex: '2\\sqrt{5} \\cdot 3\\sqrt{5}', stappen: ['= 2 \\cdot 3 \\cdot \\sqrt{5} \\cdot \\sqrt{5}', '= 6 \\cdot 5 = 30'] },
    { tex: '9\\sqrt{7} - 4\\sqrt{7} + \\sqrt{7}', stappen: ['\\text{gelijksoortig: allemaal } \\sqrt{7}', '(9 - 4 + 1)\\sqrt{7} = 6\\sqrt{7}'] },
    { tex: '\\sqrt{18} + \\sqrt{32}', stappen: ['\\sqrt{18} = 3\\sqrt{2} \\quad \\text{en} \\quad \\sqrt{32} = 4\\sqrt{2}', '3\\sqrt{2} + 4\\sqrt{2} = 7\\sqrt{2}'] },
    { tex: '\\dfrac{1}{\\sqrt{2}}', stappen: ['= \\dfrac{1 \\cdot \\sqrt{2}}{\\sqrt{2} \\cdot \\sqrt{2}}', '= \\dfrac{\\sqrt{2}}{2}'] },
    { tex: '\\dfrac{5}{2\\sqrt{5}}', stappen: ['= \\dfrac{5 \\cdot \\sqrt{5}}{2\\sqrt{5} \\cdot \\sqrt{5}} = \\dfrac{5\\sqrt{5}}{10}', '= \\dfrac{\\sqrt{5}}{2} \\quad \\text{(vereenvoudig de breuk)}'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Vereenvoudigen', gen() {
      let k, m; do { k = rnd(2, 10); m = kies(KW); } while (k * k * m > 300);
      const n = k * k * m;
      return { soort: 'vereenvoudig', opdracht: 'Vereenvoudig.', tex: `\\sqrt{${n}}`, antw: expr(wE(k, m), ['vereenvoudigd']),
        uitleg: [`\\sqrt{${n}} = \\sqrt{${k * k} \\cdot ${m}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${wTex(k, m)}`] };
    } },
    vermenigvuldig: { naam: 'Vermenigvuldigen', gen() {
      const vorm = kies(['ww', 'ww', 'zelfde', 'coefzelfde', 'coef']);
      let tex, k, n, stap;
      if (vorm === 'ww') {
        let a, b; do { a = rnd(2, 12); b = rnd(2, 20); } while (isKwadraat(a) || isKwadraat(b) || a === b);
        tex = `\\sqrt{${a}} \\cdot \\sqrt{${b}}`; ({ k, m: n } = vereenv(1, a * b)); stap = `= \\sqrt{${a * b}}`;
      } else if (vorm === 'zelfde') { const a = kies(KW); tex = `\\sqrt{${a}} \\cdot \\sqrt{${a}}`; k = a; n = 1; stap = ''; }
      else if (vorm === 'coefzelfde') { const a = kies(KW), p = rnd(2, 6), q = Math.random() < 0.3 ? 1 : rnd(2, 6); tex = `${p}\\sqrt{${a}} \\cdot ${coefTex(q)}\\sqrt{${a}}`; k = p * q * a; n = 1; stap = `= ${p} \\cdot ${q} \\cdot \\sqrt{${a}} \\cdot \\sqrt{${a}} = ${p * q} \\cdot ${a}`; }
      else { let a, b; do { a = kies(KW); b = kies(KW); } while (a === b || haalUit(a * b).k > 1); const p = rnd(2, 6), q = rnd(2, 6); tex = `${p}\\sqrt{${a}} \\cdot ${q}\\sqrt{${b}}`; k = p * q; n = a * b; stap = `= ${p} \\cdot ${q} \\cdot \\sqrt{${a} \\cdot ${b}}`; }
      return { soort: 'vermenigvuldig', opdracht: 'Vermenigvuldig. Vereenvoudig je resultaat als het kan.', tex, antw: expr(wE(k, n), ['vereenvoudigd']), uitleg: [stap === `= \\sqrt{${k === 1 ? n : ''}}` || stap === `= \\sqrt{${n}}` && k === 1 ? `${tex} ${stap}` : `${tex} ${stap} = ${wTex(k, n)}`] };
    } },
    optellen: { naam: 'Optellen en aftrekken', gen() {
      const m = kies(KW), n = Math.random() < 0.35 ? 3 : 2;
      const c = Array.from({ length: n }, () => rnd(1, 9)), t = c.map((x, i) => i && Math.random() < 0.45 ? -x : x);
      const som = t.reduce((a, b) => a + b, 0);
      const tex = t.map((x, i) => `${i ? (x < 0 ? '- ' : '+ ') : ''}${coefTex(Math.abs(x))}\\sqrt{${m}}`).join(' ');
      return { soort: 'optellen', opdracht: 'Tel op of trek af.', tex, antw: expr(wE(som, m), ['vereenvoudigd']),
        uitleg: [`\\text{gelijksoortig: } (${t.map((x, i) => i ? (x < 0 ? `- ${-x}` : `+ ${x}`) : x).join(' ')})\\sqrt{${m}} = ${wTex(som, m)}`] };
    } },
    eerstvereenv: { naam: 'Eerst vereenvoudigen, dan optellen', gen() {
      let m, k1, k2; do { m = kies([2, 3, 5, 6, 7]); k1 = rnd(1, 7); k2 = rnd(1, 7); } while (k1 === k2 || (k1 === 1 && k2 === 1) || k1 * k1 * m > 250 || k2 * k2 * m > 250);
      const plus = Math.random() < 0.6, uit = plus ? k1 + k2 : k1 - k2;
      const tex = `\\sqrt{${k1 * k1 * m}} ${plus ? '+' : '-'} \\sqrt{${k2 * k2 * m}}`;
      return { soort: 'eerstvereenv', opdracht: 'Vereenvoudig eerst en tel dan op of trek af.', tex, antw: expr(wE(uit, m), ['vereenvoudigd']),
        uitleg: [`${tex} = ${wTex(k1, m)} ${plus ? '+' : '-'} ${wTex(k2, m)} = ${wTex(uit, m)}`] };
    } },
    wortelvrij: { naam: 'Noemer wortelvrij maken', gen() {
      const b = kies(KW), a = rnd(1, 12), c = Math.random() < 0.35 ? rnd(2, 4) : 1;
      // a / (c√b) = a√b / (c·b)
      const g = ggd(a, c * b), p = a / g, q = c * b / g;
      const noemer = `${c === 1 ? '' : c}\\sqrt{${b}}`, tex = `\\dfrac{${a}}{${noemer}}`;
      let ant, at;
      if (q === 1) { ant = wE(p, b); at = wTex(p, b); }
      else { ant = `${p === 1 ? '' : p}√(${b})/${q}`; at = `\\dfrac{${coefTex(p)}\\sqrt{${b}}}{${q}}`; }
      const stap1 = `\\dfrac{${a} \\cdot \\sqrt{${b}}}{${noemer} \\cdot \\sqrt{${b}}} = \\dfrac{${coefTex(a)}\\sqrt{${b}}}{${c * b}}`;
      return { soort: 'wortelvrij', opdracht: 'Maak de noemer wortelvrij. Vereenvoudig je resultaat als het kan.', tex, antw: expr(ant, ['wortelvrij'], { tex: at }),
        uitleg: [`${tex} = ${stap1}${g > 1 ? ` = ${at}` : ''}`] };
    } },
  },
  oefenMix: [['vereenvoudig', 2], ['vermenigvuldig', 2], ['optellen', 2], ['eerstvereenv', 2], ['wortelvrij', 2]],
  test: [['vereenvoudig', 2], ['vermenigvuldig', 2], ['optellen', 2], ['eerstvereenv', 2], ['wortelvrij', 2]],
};
// ===================================================================
//  DEEL 4 — Intervallen en halfrechten
// ===================================================================
function willekeurigInterval(opt = {}) {
  const { min = -5, max = 6, geheel = true } = opt;
  const soort = kies(['begrensd', 'begrensd', 'rechts', 'links']);
  const g = () => geheel || Math.random() < 0.8 ? rnd(min, max) : rnd(min * 2, max * 2) / 2;
  if (soort === 'begrensd') { let a, b; do { a = g(); b = g(); } while (b - a < 2); return { a, ai: Math.random() < 0.5, b, bi: Math.random() < 0.5 }; }
  const n = g();
  return soort === 'rechts' ? { a: n, ai: Math.random() < 0.5, b: null, bi: false } : { a: null, ai: false, b: n, bi: Math.random() < 0.5 };
}
const ivOpg = (r) => ({ soort: 'interval', a: r.a, ai: r.ai, b: r.b, bi: r.bi });
const ogOpg = (r) => ({ soort: 'ongelijkheid', a: r.a, ai: r.ai, b: r.b, bi: r.bi });
function ivUitleg(r) {
  const u = [];
  if (r.a !== null) u.push(`${tg(r.a)} ${r.ai ? '\\text{ hoort erbij: } [ \\text{ en } \\leq' : '\\text{ hoort er niet bij: } ] \\text{ en } <'}`);
  else u.push('\\text{links: } -\\infty \\text{, het haakje staat altijd naar buiten}');
  if (r.b !== null) u.push(`${tg(r.b)} ${r.bi ? '\\text{ hoort erbij: } ] \\text{ en } \\leq' : '\\text{ hoort er niet bij: } [ \\text{ en } <'}`);
  else u.push('\\text{rechts: } +\\infty \\text{, het haakje staat altijd naar buiten}');
  return u;
}
const behoort = (x, r) => (r.a === null || x > r.a || (r.ai && x === r.a)) && (r.b === null || x < r.b || (r.bi && x === r.b));

const DEEL4 = {
  nr: 4, titel: 'Intervallen en halfrechten', kort: 'Haakjes, ongelijkheden en de getallenas.',
  rekenmachine: false,
  opdracht: 'Schrijf als interval.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">Wat is een interval?</div>
      <p>Een <b>interval</b> stelt alle reële getallen voor tussen bepaalde grenzen.</p>
      <div class="twee">
        <div class="kader"><b>haakje <span class="rood">naar binnen</span> &nbsp; [ &nbsp; ]</b><br>het grensgetal <b>hoort erbij</b> ($\\leq$ of $\\geq$)<div class="figuur">${getallenas({ a: 0, ai: true, b: 3, bi: true }, -1, 4)}</div></div>
        <div class="kader"><b>haakje <span class="rood">naar buiten</span> &nbsp; ] &nbsp; [</b><br>het grensgetal hoort er <b>niet</b> bij ($<$ of $>$)<div class="figuur">${getallenas({ a: 0, ai: false, b: 3, bi: false }, -1, 4)}</div></div>
      </div>
      <p>Eén haakje naar binnen en één naar buiten kan ook, bijvoorbeeld $[-4\\,;\\,3[$. Tussen de twee grenzen schrijf je een <b>puntkomma</b>.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Begrensde intervallen</div>
      <table class="tabel"><tr><th>interval</th><th>ongelijkheid</th><th>getallenas</th></tr>
        ${[[true, true], [true, false], [false, true], [false, false]].map(([ai, bi]) => { const r = { a: -4, ai, b: 3, bi }; return `<tr><td>$${ivTex(r)}$</td><td>$${ogTex(r)}$</td><td>${getallenas(r, -5, 4, 26)}</td></tr>`; }).join('')}
      </table>
    </div>
    <div class="kader">
      <div class="kader-titel">Halfrechten</div>
      <p>Bij een halfrecht gaat het interval eindeloos door: tot $+\\infty$ of $-\\infty$ (oneindig). Oneindig bereik je nooit: <b class="rood">het haakje staat daar altijd naar buiten</b>.</p>
      <table class="tabel"><tr><th>interval</th><th>ongelijkheid</th><th>getallenas</th></tr>
        ${[{ a: 1, ai: true, b: null, bi: false }, { a: 1, ai: false, b: null, bi: false }, { a: null, ai: false, b: 1, bi: true }, { a: null, ai: false, b: 1, bi: false }].map(r => `<tr><td>$${ivTex(r)}$</td><td>$${ogTex(r)}$</td><td>${getallenas(r, -3, 4, 26)}</td></tr>`).join('')}
      </table>
      <p class="klein">$\\leq$ of $\\geq$ → haakje naar binnen. &nbsp; $<$ of $>$ → haakje naar buiten.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$[-4\\,;\\,3[$</td><td><code>[-4 ; 3[</code></td></tr>
        <tr><td>$]-\\infty\\,;\\,1]$</td><td><code>]-∞ ; 1]</code> &nbsp;(knop −∞)</td></tr>
        <tr><td>$-4 \\leq x < 3$</td><td><code>-4 ≤ x < 3</code> &nbsp;(knop ≤, of typ <code>&lt;=</code>)</td></tr>
        <tr><td>$x \\geq 2$</td><td><code>x ≥ 2</code> &nbsp;(of <code>x &gt;= 2</code>)</td></tr></table>
      <p class="klein">Kommagetallen typ je met een komma: <code>[2,5 ; 3[</code>. Daarom moet er tussen de grenzen een puntkomma staan.</p></div>`,
  voorbeelden: [
    { tex: '-2 < x \\leq 5', stappen: ['-2 \\text{ hoort er niet bij: haakje naar buiten } ]', '5 \\text{ hoort erbij: haakje naar binnen } ]', ']-2\\,;\\,5]'] },
    { tex: 'x \\geq -3', stappen: ['-3 \\text{ hoort erbij: } [', '\\text{naar rechts tot } +\\infty \\text{, haakje naar buiten}', '[-3\\,;\\,+\\infty['] },
    { tex: 'x < 0', stappen: ['\\text{naar links tot } -\\infty', ']-\\infty\\,;\\,0['] },
    { html: `Lees af: <div class="figuur">${getallenas({ a: -1, ai: true, b: 4, bi: false }, -3, 6)}</div>`, stappen: ['-1 \\text{: haakje naar binnen, } 4 \\text{: haakje naar buiten}', '[-1\\,;\\,4[', '-1 \\leq x < 4'] },
    { tex: '\\text{Hoort } 3 \\text{ bij } [-2\\,;\\,3[\\,?', stappen: ['\\text{het haakje bij 3 staat naar buiten: 3 hoort er niet bij}', '\\text{nee}'] },
  ],
  soorten: {
    naarongelijkheid: { naam: 'Interval → ongelijkheid', gen() {
      const r = willekeurigInterval({ min: -8, max: 9, geheel: false });
      return { soort: 'naarongelijkheid', opdracht: 'Schrijf als ongelijkheid.', tex: ivTex(r), antw: ogOpg(r), uitleg: [...ivUitleg(r), `${ivTex(r)} \\quad \\Leftrightarrow \\quad ${ogTex(r)}`] };
    } },
    naarinterval: { naam: 'Ongelijkheid → interval', gen() {
      const r = willekeurigInterval({ min: -8, max: 9, geheel: false });
      return { soort: 'naarinterval', opdracht: 'Schrijf als interval.', tex: ogTex(r), antw: ivOpg(r), uitleg: [...ivUitleg(r), `${ogTex(r)} \\quad \\Leftrightarrow \\quad ${ivTex(r)}`] };
    } },
    hoortbij: { naam: 'Hoort het getal bij het interval?', gen() {
      const r = willekeurigInterval({ min: -6, max: 8 });
      const grenzen = [r.a, r.b].filter(x => x !== null);
      let x; const k = Math.random();
      if (k < 0.5) x = kies(grenzen);
      else if (k < 0.7) x = kies(grenzen) + kies([-0.1, 0.1, -0.5, 0.5]);
      else x = rnd(-10, 12) + (Math.random() < 0.3 ? 0.5 : 0);
      x = Math.round(x * 10) / 10;
      const ja = behoort(x, r);
      let reden;
      if (r.a !== null && x === r.a) reden = `${tg(x)} \\text{ is de linkergrens; het haakje staat ${r.ai ? 'naar binnen: het hoort erbij' : 'naar buiten: het hoort er niet bij'}}`;
      else if (r.b !== null && x === r.b) reden = `${tg(x)} \\text{ is de rechtergrens; het haakje staat ${r.bi ? 'naar binnen: het hoort erbij' : 'naar buiten: het hoort er niet bij'}}`;
      else reden = `${ogTex(r).replace(/x/, tg(x))} \\text{ ${ja ? 'klopt' : 'klopt niet'}}`;
      return { soort: 'hoortbij', opdracht: 'Hoort het getal bij het interval?', tex: `${tg(x)} \\;\\in\\; ${ivTex(r)} \\;?`, antw: keuze(JANEE, ja ? 'ja' : 'nee'), uitleg: [reden] };
    } },
    leesaf: { naam: 'Lees af op de getallenas', gen() {
      const r = willekeurigInterval({ min: -4, max: 5 });
      return { soort: 'leesaf', opdracht: 'Lees af. Schrijf als interval en als ongelijkheid.', html: `<div class="figuur">${getallenas(r, -5, 6)}</div>`, sleutel: 'as' + ivTex(r), rapport: 'getallenas: ' + ivTekst(r),
        antw: { soort: 'delen', delen: [{ label: '\\text{interval}', antw: ivOpg(r) }, { label: '\\text{ongelijkheid}', antw: ogOpg(r) }] }, uitleg: ivUitleg(r) };
    } },
    tekenen: { naam: 'Welke getallenas hoort erbij?', gen() {
      const r = willekeurigInterval({ min: -4, max: 5 });
      let varianten;
      if (r.a !== null && r.b !== null) varianten = [[true, true], [true, false], [false, true], [false, false]].map(([ai, bi]) => ({ ...r, ai, bi }));
      else if (r.b === null) varianten = [{ ...r, ai: true }, { ...r, ai: false }, { a: null, ai: false, b: r.a, bi: true }, { a: null, ai: false, b: r.a, bi: false }];
      else varianten = [{ ...r, bi: true }, { ...r, bi: false }, { a: r.b, ai: true, b: null, bi: false }, { a: r.b, ai: false, b: null, bi: false }];
      const opties = schud(varianten).map((v, i) => ({ k: 'abcd'[i], l: getallenas(v, -5, 6, 26), html: true, tekst: ivTekst(v), _v: v }));
      const juist = opties.find(o => Invoer.gelijkeGrenzen(o._v, r)).k;
      opties.forEach(o => delete o._v);
      return { soort: 'tekenen', opdracht: 'Welke getallenas stelt dit interval voor?', tex: ivTex(r), antw: keuze(opties, juist), uitleg: ivUitleg(r) };
    } },
  },
  oefenMix: [['naarongelijkheid', 2], ['naarinterval', 2], ['hoortbij', 2], ['leesaf', 2], ['tekenen', 2]],
  test: [['naarongelijkheid', 2], ['naarinterval', 2], ['hoortbij', 2], ['tekenen', 2], ['leesaf', 2]],
};

// ===================================================================
//  DEEL 5 — Machten met rationale exponenten
// ===================================================================
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const wortelE = (n, x) => (n === 2 ? '√' : n === 3 ? '∛' : n === 4 ? '∜' : String(n).split('').map(c => SUPS[+c]).join('') + '√') + `(${x})`;
const wortelT = (n, x) => n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`;
const fr = (p, q) => `\\frac{${p}}{${q}}`;
const machtT = (a, p, q) => q === 1 ? `${a}^{${p}}` : `${a}^{${fr(p, q)}}`;
function red(p, q) { const g = ggd(p, q); return [p / g, q / g]; }
const BASIS = [2, 3, 5, 6, 7, 10, 11];

const DEEL5 = {
  nr: 5, titel: 'Machten met rationale exponenten', kort: 'Van macht naar wortelvorm en terug, rekenregels.',
  rekenmachine: true,
  opdracht: 'Schrijf in wortelvorm.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">De definitie</div>
      <p class="midden" style="font-size:20px">$x^{\\frac{m}{n}} = \\sqrt[n]{x^m}$</p>
      <ul><li>de <b>noemer $n$</b> wordt de wortelexponent</li><li>de <b>teller $m$</b> wordt de exponent onder het wortelteken</li>
        <li>bij $n = 2$ schrijf je de 2 niet: een gewone vierkantswortel, $x^{\\frac{3}{2}} = \\sqrt{x^3}$</li></ul>
      <p>Andersom: van wortelvorm naar machtsvorm: $\\sqrt[3]{7^2} = 7^{\\frac{2}{3}}$</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Voorbeeld</div>
      <p>$5^{\\frac{3}{2}} = \\sqrt{5^3} = \\sqrt{125} \\approx 11{,}1803$</p>
      <ol><li>noemer 2 → vierkantswortel, teller 3 → exponent 3</li><li>reken de macht uit: $5^3 = 125$</li><li>rekenmachine, rond af op 4 decimalen</li></ol>
      <p class="klein">Op de rekenmachine kan je ook rechtstreeks <code>5 ^ ( 3 ÷ 2 )</code> intikken.</p>
      <p>$16^{\\frac{7}{3}} = \\sqrt[3]{16^7} \\approx 645{,}0796$ &nbsp;·&nbsp; $3^{\\frac{2}{5}} = \\sqrt[5]{3^2} \\approx 1{,}5518$</p>
      <p>$23^{\\frac{4}{6}} = 23^{\\frac{2}{3}} = \\sqrt[3]{23^2} \\approx 8{,}0876$ &nbsp;·&nbsp; $9 \\cdot 3^{\\frac{2}{7}} = 9 \\cdot \\sqrt[7]{3^2} \\approx 12{,}3186$</p>
      <p class="blauwtekst">Tip: vereenvoudig eerst de breuk in de exponent: $\\frac{4}{6} = \\frac{2}{3}$.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Rekenregels met machten</div>
      <p>De rekenregels die je kent uit $\\mathbb{Z}$ en $\\mathbb{Q}$ gelden ook voor <b>rationale exponenten</b>.</p>
      <table class="tabel"><tr><td>$a^m \\cdot a^n = a^{m+n}$</td><td class="klein">zelfde grondtal vermenigvuldigen → exponenten optellen</td></tr>
        <tr><td>$a^m : a^n = a^{m-n}$</td><td class="klein">zelfde grondtal delen → exponenten aftrekken</td></tr>
        <tr><td>$(a^m)^n = a^{m \\cdot n}$</td><td class="klein">macht van een macht → exponenten vermenigvuldigen</td></tr></table>
      <p>$5^{\\frac{3}{2}} \\cdot 5^{\\frac{1}{2}} = 5^{\\frac{3}{2} + \\frac{1}{2}} = 5^{\\frac{4}{2}} = 5^2 = 25$</p>
      <p>$5^{\\frac{3}{2}} : 5^{\\frac{1}{2}} = 5^{\\frac{3}{2} - \\frac{1}{2}} = 5^{\\frac{2}{2}} = 5^1 = 5$</p>
      <p>$\\left(5^{\\frac{3}{2}}\\right)^2 = 5^{\\frac{3}{2} \\cdot 2} = 5^3 = 125$</p>
      <p>$5^{\\frac{3}{6}} \\cdot 5^{\\frac{8}{2}} = 5^{\\frac{3}{6} + \\frac{24}{6}} = 5^{\\frac{27}{6}} = 5^{\\frac{9}{2}} \\approx 1397{,}5425$</p>
      <p>$\\left(5^{\\frac{8}{2}}\\right)^{\\frac{1}{3}} = 5^{\\frac{8}{2} \\cdot \\frac{1}{3}} = 5^{\\frac{8}{6}} = 5^{\\frac{4}{3}} = \\sqrt[3]{5^4} \\approx 8{,}5499$</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$\\sqrt{7^3}$</td><td><code>√(7^3)</code> (knop √, dan knop xⁿ)</td></tr>
        <tr><td>$\\sqrt[3]{5^2}$</td><td><code>∛(5^2)</code> (knop ∛)</td></tr>
        <tr><td>$\\sqrt[5]{2^7}$</td><td>kies 5 bij knop ⁿ√, dan <code>(2^7)</code></td></tr>
        <tr><td>$11^{\\frac{1}{2}}$</td><td><code>11^(1/2)</code> (knop x<sup>p/q</sup>)</td></tr>
        <tr><td>$1397{,}5425$</td><td><code>1397,5425</code></td></tr></table>
      <p class="klein">Onder het invulvak zie je meteen hoe je antwoord gelezen wordt.</p></div>`,
  voorbeelden: [
    { tex: '7^{\\frac{1}{2}}', stappen: ['\\text{noemer 2: vierkantswortel, teller 1}', '7^{\\frac{1}{2}} = \\sqrt{7}'] },
    { tex: '3^{\\frac{4}{6}}', stappen: ['\\text{vereenvoudig eerst: } \\frac{4}{6} = \\frac{2}{3}', '3^{\\frac{2}{3}} = \\sqrt[3]{3^2}'] },
    { tex: '\\sqrt[5]{2^7}', stappen: ['\\text{wortelexponent 5 wordt de noemer, exponent 7 de teller}', '\\sqrt[5]{2^7} = 2^{\\frac{7}{5}}'] },
    { tex: '16^{\\frac{3}{4}}', stappen: ['16^{\\frac{3}{4}} = \\sqrt[4]{16^3} = \\sqrt[4]{4096}', '= 8 \\quad \\text{(rekenmachine)}'] },
    { tex: '6^{\\frac{1}{2}} \\cdot 6^{\\frac{1}{3}}', stappen: ['6^{\\frac{1}{2} + \\frac{1}{3}} = 6^{\\frac{3}{6} + \\frac{2}{6}}', '= 6^{\\frac{5}{6}}', '\\approx 4{,}4413'] },
    { tex: '\\left(3^{\\frac{2}{3}}\\right)^3', stappen: ['3^{\\frac{2}{3} \\cdot 3} = 3^2', '= 9'] },
  ],
  soorten: {
    wortelvorm: { naam: 'Schrijf in wortelvorm', gen() {
      for (;;) {
        const a = kies(BASIS.concat([4, 9, 12])), n0 = rnd(2, 7), m0 = rnd(1, 7), f = Math.random() < 0.25 ? 2 : 1;
        const [m, n] = red(m0, n0); if (n === 1 || m > 7) continue;
        const p = m * f, q = n * f; if (q > 12) continue;
        const binnen = m === 1 ? `${a}` : `${a}^${m}`;
        const ant = wortelE(n, m === 1 ? `${a}` : `${a}^${m}`), at = wortelT(n, m === 1 ? `${a}` : `${a}^{${m}}`);
        const uit = f > 1 ? [`\\text{vereenvoudig eerst: } ${fr(p, q)} = ${fr(m, n)}`] : [];
        uit.push(`${machtT(a, m, n)} = ${at}`);
        return { soort: 'wortelvorm', opdracht: 'Schrijf in wortelvorm. Vereenvoudig eerst de breuk in de exponent als het kan.', tex: machtT(a, p, q), antw: expr(ant, ['wortel' + n], { tex: at, toetsen: ['wortel'] }), uitleg: uit };
      }
    } },
    machtsvorm: { naam: 'Schrijf als macht', gen() {
      for (;;) {
        const a = kies(BASIS.concat([4, 9])), n = rnd(2, 7), m = Math.random() < 0.3 ? 1 : rnd(2, 7);
        if (m % n === 0) continue;
        const [p, q] = red(m, n);
        const tex = wortelT(n, m === 1 ? `${a}` : `${a}^{${m}}`);
        const uit = [`\\text{wortelexponent ${n}} \\rightarrow \\text{noemer, exponent ${m}} \\rightarrow \\text{teller}`, `${tex} = ${machtT(a, m, n)}`];
        if (p !== m) uit.push(`= ${machtT(a, p, q)} \\quad \\text{(vereenvoudig de breuk)}`);
        return { soort: 'machtsvorm', opdracht: 'Schrijf als macht met een rationale exponent.', tex, antw: expr(`${a}^(${p}/${q})`, ['een_macht'], { tex: machtT(a, p, q) }), uitleg: uit };
      }
    } },
    rekenmachine: { naam: 'Reken uit met de rekenmachine', gen() {
      for (;;) {
        if (Math.random() < 0.25) {
          const [a, p, q, w] = kies([[8, 2, 3, 4], [9, 1, 2, 3], [9, 3, 2, 27], [27, 2, 3, 9], [16, 3, 4, 8], [4, 3, 2, 8], [32, 2, 5, 4], [25, 3, 2, 125], [64, 5, 6, 32], [81, 3, 4, 27]]);
          return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Rond af op 4 decimalen waar nodig.', tex: machtT(a, p, q), antw: getal(w, 4, { voor: '=' }), uitleg: [`${machtT(a, p, q)} = ${wortelT(q, `${a}^{${p}}`)} = ${w}`] };
        }
        const a = kies(BASIS.concat([4, 8, 9, 12, 15, 20])), q = rnd(2, 7), p0 = rnd(1, 8); const [p, qq] = red(p0, q); if (qq === 1) continue;
        const c = Math.random() < 0.2 ? rnd(2, 9) : 1;
        const w = c * a ** (p / qq); if (!zekerRond(w, 4) || w > 20000) continue;
        const tex = `${c > 1 ? c + ' \\cdot ' : ''}${machtT(a, p, qq)}`;
        return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Rond af op 4 decimalen waar nodig.', tex, antw: getal(w, 4, { voor: '\\approx' }),
          uitleg: [`${tex} = ${c > 1 ? c + ' \\cdot ' : ''}${wortelT(qq, p === 1 ? `${a}` : `${a}^{${p}}`)} \\approx ${tg(w, 4)}`] };
      }
    } },
    eenmacht: { naam: 'Schrijf als één macht en reken uit', gen() {
      for (;;) {
        const a = kies([2, 3, 5, 6, 7, 10]), regel = kies(['maal', 'maal', 'deel', 'macht', 'macht']);
        const b1 = kies([2, 3, 4, 5, 6]), b2 = kies([2, 3, 4, 5, 6]);
        const t1 = rnd(1, 5), t2 = rnd(1, 5);
        let tex, P, Q, stap;
        if (regel === 'maal') { tex = `${machtT(a, t1, b1)} \\cdot ${machtT(a, t2, b2)}`; P = t1 * b2 + t2 * b1; Q = b1 * b2; stap = `${a}^{${fr(t1, b1)} + ${fr(t2, b2)}}`; }
        else if (regel === 'deel') { if (t1 * b2 <= t2 * b1) continue; tex = `${machtT(a, t1, b1)} : ${machtT(a, t2, b2)}`; P = t1 * b2 - t2 * b1; Q = b1 * b2; stap = `${a}^{${fr(t1, b1)} - ${fr(t2, b2)}}`; }
        else { const geheel = Math.random() < 0.5; if (geheel) { const n = rnd(2, 4); tex = `\\left(${machtT(a, t1, b1)}\\right)^{${n}}`; P = t1 * n; Q = b1; stap = `${a}^{${fr(t1, b1)} \\cdot ${n}}`; } else { tex = `\\left(${machtT(a, t1, b1)}\\right)^{${fr(t2, b2)}}`; P = t1 * t2; Q = b1 * b2; stap = `${a}^{${fr(t1, b1)} \\cdot ${fr(t2, b2)}}`; } }
        const [p, q] = red(P, Q); if (p === 0) continue;
        const w = a ** (p / q); if (w > 20000 || (q > 1 && !zekerRond(w, 4))) continue;
        if (ggd(t1, b1) > 1 && Math.random() < 0.7) continue;
        const res = q === 1 ? `${a}^{${p}}` : machtT(a, p, q);
        return { soort: 'eenmacht', opdracht: 'Schrijf als één macht en reken uit. Rond af op 4 decimalen waar nodig.', tex,
          antw: { soort: 'delen', delen: [
            { label: '\\text{als één macht}', antw: expr(`${a}^(${p}/${q})`, ['een_macht'], { tex: res, voor: '=' }) },
            { label: '\\text{uitkomst}', antw: getal(w, 4, { voor: q === 1 ? '=' : '\\approx' }) }] },
          uitleg: [`${tex} = ${stap} = ${res} ${q === 1 ? '=' : '\\approx'} ${q === 1 ? w : tg(w, 4)}`] };
      }
    } },
  },
  oefenMix: [['wortelvorm', 2], ['machtsvorm', 2], ['rekenmachine', 2], ['eenmacht', 3]],
  test: [['wortelvorm', 2], ['machtsvorm', 2], ['rekenmachine', 3], ['eenmacht', 3]],
};

// ===================================================================
//  DEEL 6 — De logaritme
// ===================================================================
const logT = (a, r) => a === 10 ? `\\log ${r}` : `\\log_{${a}} ${r}`;
// r = a^n als TeX: breuk of decimaal getal bij negatieve n
function machtGetal(a, n) {
  if (n >= 0) return { tex: W.duizend(String(a ** n)), e: String(a ** n), waarde: a ** n };
  const nm = a ** -n;
  if ([2, 5, 10].includes(a) && (a === 10 || nm <= 125) && Math.random() < 0.55) { const x = 1 / nm; return { tex: tg(+x.toPrecision(10)), e: kg(+x.toPrecision(10)), waarde: x }; }
  return { tex: `\\left(\\frac{1}{${nm}}\\right)`, e: `1/${nm}`, waarde: 1 / nm, breuk: true };
}
const DEEL6 = {
  nr: 6, titel: 'De logaritme', kort: 'Definitie, berekenen en intuïtief schatten.',
  rekenmachine: true,
  opdracht: 'Bereken.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">De definitie</div>
      <p class="midden" style="font-size:20px">$\\log_a r = n \\quad \\text{als} \\quad a^n = r$</p>
      <p>De logaritme is de <b>omgekeerde bewerking</b> van machtsverheffen.</p>
      <p>$\\log_a r$: hoeveel keer moet je $a$ met zichzelf vermenigvuldigen om $r$ te krijgen?</p>
      <p>$\\log_2 8 = 3 \\quad \\text{want} \\quad 2^3 = 2 \\cdot 2 \\cdot 2 = 8$</p>
      <p class="let-op">Geen grondtal geschreven? Dan is het grondtal 10: $\\log 1000 = \\log_{10} 1000 = 3$</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Berekenen: schrijf het getal als een macht van het grondtal</div>
      <p>$\\log_3 27 = \\log_3 3^3 = 3$ &nbsp;·&nbsp; $\\log_5 25 = \\log_5 5^2 = 2$ &nbsp;·&nbsp; $\\log_4 \\left(\\frac{1}{4}\\right) = \\log_4 4^{-1} = -1$</p>
      <p>$\\log 1\\,000\\,000 = \\log 10^6 = 6$ &nbsp;·&nbsp; $\\log 0{,}01 = \\log 10^{-2} = -2$ &nbsp;·&nbsp; $\\log_2 0{,}25 = \\log_2 \\left(\\frac{1}{4}\\right) = \\log_2 2^{-2} = -2$</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Intuïtief rekenen</div>
      <p>$\\log_4 64 = ?$ &nbsp; Begin bij 1 en vermenigvuldig telkens met 4: $1 \\xrightarrow{\\cdot 4} 4 \\xrightarrow{\\cdot 4} 16 \\xrightarrow{\\cdot 4} 64$. &nbsp; 3 keer, dus $64 = 4^3$ en $\\log_4 64 = 3$.</p>
      <p>$\\log 800 \\approx ?$ &nbsp; $1 \\xrightarrow{\\cdot 10} 10 \\xrightarrow{\\cdot 10} 100 \\xrightarrow{\\cdot 10} 1000$. &nbsp; 2 keer is te weinig (100), 3 keer is te veel (1000).<br>
        $100 < 800 < 1000 \\;\\rightarrow\\; 2 < \\log 800 < 3$ &nbsp; en met de rekenmachine $\\log 800 \\approx 2{,}90$</p>
      <p>$\\log_4 0{,}18 \\approx ?$ &nbsp; 0,18 is kleiner dan 1: <b>deel</b> telkens door 4: $1 \\xrightarrow{:4} 0{,}25 \\xrightarrow{:4} 0{,}0625$.<br>
        $0{,}0625 < 0{,}18 < 0{,}25 \\;\\rightarrow\\; -2 < \\log_4 0{,}18 < -1$ &nbsp; en $\\log_4 0{,}18 \\approx -1{,}24$ &nbsp; <span class="klein">(delen → negatieve exponent)</span></p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <p>Typ een getal: <code>3</code>, <code>-2</code>, <code>2,90</code>. Breuken typ je met een schuine streep: <code>1/8</code>. In de vakjes $\\log_{\\square} \\square = \\square$ typ je in elk vakje één getal.</p></div>`,
  voorbeelden: [
    { tex: '\\log_2 32', stappen: ['32 = 2^5', '\\log_2 32 = \\log_2 2^5 = 5'] },
    { tex: '\\log_3 \\left(\\frac{1}{9}\\right)', stappen: ['\\frac{1}{9} = \\frac{1}{3^2} = 3^{-2}', '\\log_3 \\left(\\frac{1}{9}\\right) = -2'] },
    { tex: '\\log 0{,}001', stappen: ['0{,}001 = 10^{-3}', '\\log 0{,}001 = -3'] },
    { tex: '2^5 = 32 \\text{ als logaritme}', stappen: ['a^n = r \\;\\Leftrightarrow\\; \\log_a r = n', '\\log_2 32 = 5'] },
    { tex: '\\log_2 20 \\approx ?', stappen: ['1 \\xrightarrow{\\cdot 2} 2 \\xrightarrow{\\cdot 2} 4 \\xrightarrow{\\cdot 2} 8 \\xrightarrow{\\cdot 2} 16 \\xrightarrow{\\cdot 2} 32', '16 < 20 < 32 \\;\\rightarrow\\; 4 < \\log_2 20 < 5', '\\text{rekenmachine: } \\log_2 20 \\approx 4{,}32'] },
  ],
  soorten: {
    bereken: { naam: 'Bereken', gen() {
      for (;;) {
        const a = kies([2, 2, 3, 4, 5, 6, 7, 10, 10]), n = Math.random() < 0.06 ? 1 : rnd(-3, 6);
        if (n === 0 || Math.abs(a ** n) > 100000 || (n < 0 && a ** -n > 1000)) continue;
        const m = machtGetal(a, n);
        const tex = logT(a, m.tex);
        const stap = n < 0 && m.breuk ? `${logT(a, m.tex)} = ${logT(a, `${a}^{${n}}`)}` : n < 0 ? `${m.tex} = \\frac{1}{${a ** -n}} = ${a}^{${n}}` : `${m.tex} = ${a}^{${n}}`;
        return { soort: 'bereken', opdracht: 'Bereken. Schrijf het getal als een macht van het grondtal.', tex, antw: getal(n), uitleg: [stap, `${tex} = ${n}`] };
      }
    } },
    omzetten: { naam: 'Macht ↔ logaritme', gen() {
      for (;;) {
        const a = kies([2, 3, 4, 5, 6, 10]), n = rnd(-3, 5); if (n === 0 || a ** n > 10000) continue;
        const m = machtGetal(a, n), rt = m.breuk ? `\\frac{1}{${a ** -n}}` : m.tex;
        if (Math.random() < 0.5) {
          return { soort: 'omzetten', opdracht: 'Schrijf de macht als logaritme.', tex: `${a}^{${n}} = ${rt}`,
            antw: { soort: 'vakjes', sjabloon: [{ tex: '\\log' }, { veld: 0, sub: true }, { veld: 1 }, { tex: '=' }, { veld: 2 }], velden: [veldE(`${a}`), veldE(m.e.replace(/\s/g, '')), veldE(`${n}`)] },
            uitleg: [`a^n = r \\;\\Leftrightarrow\\; \\log_a r = n`, `\\log_{${a}} ${m.breuk ? `\\left(${rt}\\right)` : rt} = ${n}`] };
        }
        return { soort: 'omzetten', opdracht: 'Schrijf de logaritme als macht.', tex: `${logT(a, m.tex)} = ${n}`,
          antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { veld: 1, sup: true }, { tex: '=' }, { veld: 2 }], velden: [veldE(`${a}`), veldE(`${n}`), veldE(m.e.replace(/\s/g, ''))] },
          uitleg: [`\\log_a r = n \\;\\Leftrightarrow\\; a^n = r`, `${a}^{${n}} = ${rt}`] };
      }
    } },
    tussen: { naam: 'Schat intuïtief', gen() {
      for (;;) {
        const a = kies([2, 3, 4, 5, 10]); let r;
        if (Math.random() < 0.7) r = a === 10 ? rnd(11, 9999) : rnd(3, a ** (a === 2 ? 9 : a === 3 ? 6 : 4));
        else r = kies([0.3, 0.05, 0.2, 0.7, 0.15, 0.04, 0.6, 0.008, 0.45]);
        const w = Math.log(r) / Math.log(a), g = Math.floor(w);
        if (Math.abs(w - Math.round(w)) < 1e-9 || !zekerRond(w, 2)) continue;
        const lo = a ** g, hi = a ** (g + 1);
        const tl = (x) => tg(+x.toPrecision(8));
        const keten = r >= 1 ? `1 \\xrightarrow{\\cdot ${a}} ${Array.from({ length: g + 1 }, (_, i) => tl(a ** (i + 1))).join(` \\xrightarrow{\\cdot ${a}} `)}`
          : `1 \\xrightarrow{:${a}} ${Array.from({ length: -g }, (_, i) => tl(a ** (-i - 1))).join(` \\xrightarrow{:${a}} `)}`;
        const lt = logT(a, tg(r));
        return { soort: 'tussen', opdracht: r >= 1 ? 'Tussen welke twee gehele getallen ligt de logaritme? Vermenigvuldig telkens met het grondtal. Controleer met je rekenmachine (2 decimalen).' : 'Tussen welke twee gehele getallen ligt de logaritme? Deel telkens door het grondtal. Controleer met je rekenmachine (2 decimalen).', tex: lt,
          antw: { soort: 'delen', delen: [
            { label: '\\text{ligt tussen}', antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { tex: `< ${lt} <` }, { veld: 1 }], velden: [veldE(String(g)), veldE(String(g + 1))] } },
            { label: '\\text{rekenmachine}', antw: getal(w, 2, { voor: `${lt} \\approx` }) }] },
          uitleg: [keten, `${tl(lo)} < ${tg(r)} < ${tl(hi)} \\;\\rightarrow\\; ${g} < ${lt} < ${g + 1}`, `${lt} \\approx ${tg(w, 2)}`] };
      }
    } },
  },
  oefenMix: [['bereken', 4], ['omzetten', 3], ['tussen', 3]],
  test: [['bereken', 4], ['omzetten', 3], ['tussen', 3]],
};

// ===================================================================
//  DEEL 7 — Rekenregels met logaritmen
// ===================================================================
const delers = (n) => { const d = []; for (let i = 2; i < n; i++) if (n % i === 0) d.push(i); return d; };
const DEEL7 = {
  nr: 7, titel: 'Rekenregels met logaritmen', kort: 'Product, quotiënt, macht en x berekenen.',
  rekenmachine: true,
  opdracht: 'Bereken met een rekenregel.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">De rekenregels</div>
      <table class="tabel">
        <tr><td>$\\log_x 1 = 0$</td><td class="klein">want $x^0 = 1$</td></tr>
        <tr><td>$\\log_x x = 1$</td><td class="klein">want $x^1 = x$</td></tr>
        <tr><td>$\\log_x (m \\cdot n) = \\log_x m + \\log_x n$</td><td class="klein">product → som</td></tr>
        <tr><td>$\\log_x \\left(\\frac{m}{n}\\right) = \\log_x m - \\log_x n$</td><td class="klein">quotiënt → verschil</td></tr>
        <tr><td>$\\log_x m^n = n \\cdot \\log_x m$</td><td class="klein">exponent komt vooraan</td></tr>
        <tr><td>$\\log_x \\left(\\frac{1}{n}\\right) = -\\log_x n$</td><td class="klein">omgekeerde → tegengestelde</td></tr></table>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Voorbeelden</div>
      <p>$\\log_2 4 + \\log_2 2 = \\log_2 (4 \\cdot 2) = \\log_2 8 = 3$</p>
      <p>$\\log 20 + \\log 50 = \\log (20 \\cdot 50) = \\log 1000 = 3$</p>
      <p>$\\log_4 32 - \\log_4 2 = \\log_4 \\left(\\frac{32}{2}\\right) = \\log_4 16 = 2$</p>
      <p>$\\log_3 9^4 = 4 \\cdot \\log_3 9 = 4 \\cdot 2 = 8$ &nbsp;·&nbsp; $\\log_4 \\left(\\frac{1}{16}\\right) = -\\log_4 16 = -2$</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Bereken x: gebruik de definitie</div>
      <p class="midden">$a^n = r \\;\\Leftrightarrow\\; \\log_a r = n$</p>
      <p>$7^x = 16\\,807 \\;\\rightarrow\\; x = \\log_7 16\\,807 = 5$ &nbsp; <span class="klein">(controle: $7^5 = 16\\,807$)</span></p>
      <p>$5 = 7^x \\;\\rightarrow\\; x = \\log_7 5 \\approx 0{,}8$ &nbsp; <span class="klein">(rekenmachine: $\\log_7 5 \\approx 0{,}827 \\approx 0{,}8$ op 1 decimaal)</span></p>
      <p>$3 = \\log_x 81 \\;\\rightarrow\\; x^3 = 81 \\;\\rightarrow\\; x = \\sqrt[3]{81} \\approx 4{,}3$ &nbsp; <span class="klein">Het grondtal is nu de onbekende: neem de derdemachtswortel ($\\sqrt[3]{81} \\approx 4{,}327$).</span></p>
    </div>`,
  voorbeelden: [
    { tex: '\\log_6 4 + \\log_6 9', stappen: ['= \\log_6 (4 \\cdot 9) = \\log_6 36', '= 2 \\quad (6^2 = 36)'] },
    { tex: '\\log_2 40 - \\log_2 5', stappen: ['= \\log_2 \\left(\\frac{40}{5}\\right) = \\log_2 8', '= 3'] },
    { tex: '\\log 100^3', stappen: ['= 3 \\cdot \\log 100', '= 3 \\cdot 2 = 6'] },
    { tex: '\\log_2 8 + \\log_2 4 - \\log_2 2', stappen: ['= \\log_2 \\left(\\frac{8 \\cdot 4}{2}\\right) = \\log_2 16', '= 4'] },
    { tex: '2^x = 64', stappen: ['x = \\log_2 64', '= 6 \\quad (2^6 = 64)'] },
    { tex: '4^x = 20', stappen: ['x = \\log_4 20', '\\approx 2{,}16 \\approx 2{,}2 \\quad \\text{(1 decimaal)}'] },
    { tex: '2 = \\log_x 49', stappen: ['x^2 = 49', 'x = \\sqrt{49} = 7'] },
  ],
  soorten: {
    regel: { naam: 'Eén rekenregel', gen() {
      for (;;) {
        const a = kies([2, 3, 4, 5, 6, 10]), soort = kies(['som', 'som', 'verschil', 'verschil', 'macht', 'macht', 'omgekeerd', 'nul', 'een']);
        if (soort === 'som') { const k = rnd(2, a === 2 ? 6 : a === 10 ? 4 : 3), n = a ** k, d = delers(n).filter(x => x !== a ** (k / 2) || k % 2); if (!d.length) continue; const m = kies(d), q = n / m;
          return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: `${logT(a, m)} + ${logT(a, q)}`, antw: getal(k), uitleg: [`${logT(a, `(${m} \\cdot ${q})`)} = ${logT(a, W.duizend(n))} = ${k} \\quad (${a}^{${k}} = ${W.duizend(n)})`] }; }
        if (soort === 'verschil') { const k = rnd(1, 3), q = rnd(2, 9), m = q * a ** k; if (m > 2000) continue;
          return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: `${logT(a, m)} - ${logT(a, q)}`, antw: getal(k), uitleg: [`${logT(a, `\\left(\\frac{${m}}{${q}}\\right)`)} = ${logT(a, a ** k)} = ${k}`] }; }
        if (soort === 'macht') { const j = rnd(1, 3), b = a ** j, e = rnd(2, 6); if (b > 1000) continue;
          return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: logT(a, `${b}^{${e}}`), antw: getal(j * e), uitleg: [`= ${e} \\cdot ${logT(a, b)} = ${e} \\cdot ${j} = ${j * e}`] }; }
        if (soort === 'omgekeerd') { const k = rnd(1, 4), n = a ** k; if (n > 1000) continue;
          return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: logT(a, `\\left(\\frac{1}{${n}}\\right)`), antw: getal(-k), uitleg: [`= -${logT(a, n)} = -${k}`] }; }
        const b = rnd(2, 9);
        if (soort === 'nul') return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: logT(b, 1), antw: getal(0), uitleg: [`${logT(b, 1)} = 0 \\quad \\text{want } ${b}^0 = 1`] };
        return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: logT(b, b), antw: getal(1), uitleg: [`${logT(b, b)} = 1 \\quad \\text{want } ${b}^1 = ${b}`] };
      }
    } },
    combineer: { naam: 'Rekenregels combineren', gen() {
      for (;;) {
        const a = kies([2, 3, 4, 5, 10]), vorm = kies(['drie', 'drie', 'macht1', 'coef', 'eenmin']);
        if (vorm === 'drie') { // log p + log q − log r = log(pq/r) = k
          const k = rnd(1, a === 2 ? 5 : 3), r = rnd(2, 9), n = r * a ** k, d = delers(n); if (!d.length || n > 5000) continue; const p = kies(d), q = n / p; if (q < 2 || q === r || p === r) continue;
          return { soort: 'combineer', opdracht: 'Combineer de rekenregels.', tex: `${logT(a, p)} + ${logT(a, q)} - ${logT(a, r)}`, antw: getal(k),
            uitleg: [`= ${logT(a, `\\left(\\frac{${p} \\cdot ${q}}{${r}}\\right)`)} = ${logT(a, a ** k)} = ${k}`] };
        }
        if (vorm === 'macht1') { const k = rnd(2, 6), b = rnd(2, 9), aa = kies([2, 3, 5]);
          return { soort: 'combineer', opdracht: 'Combineer de rekenregels.', tex: `${logT(aa, `${aa}^{${k}}`)} + ${logT(b, 1)}`, antw: getal(k), uitleg: [`= ${k} \\cdot ${logT(aa, aa)} + 0 = ${k} \\cdot 1 + 0 = ${k}`] }; }
        if (vorm === 'coef') { const c = rnd(2, 5), j = rnd(1, 3), b = a ** j; if (b > 1000) continue;
          return { soort: 'combineer', opdracht: 'Combineer de rekenregels.', tex: `${c} \\cdot ${logT(a, b)}`, antw: getal(c * j), uitleg: [`= ${c} \\cdot ${j} = ${c * j} \\quad \\text{of} \\quad ${logT(a, `${b}^{${c}}`)} = ${logT(a, `${a}^{${c * j}}`)} = ${c * j}`] }; }
        // log p + log q − log 1
        const k = rnd(1, 3), n = a ** k, d = delers(n); if (!d.length || n > 2000) continue; const p = kies(d), q = n / p;
        return { soort: 'combineer', opdracht: 'Combineer de rekenregels.', tex: `${logT(a, p)} + ${logT(a, q)} - ${logT(a, 1)}`, antw: getal(k), uitleg: [`= ${logT(a, `(${p} \\cdot ${q})`)} - 0 = ${logT(a, n)} = ${k}`] };
      }
    } },
    berekenx: { naam: 'Bereken x', gen() {
      for (;;) {
        const vorm = kies(['macht', 'macht', 'grondtal']);
        if (vorm === 'macht') {
          const a = kies([2, 3, 4, 5, 6, 7, 10]); let r, exact = Math.random() < 0.45, x;
          if (exact) { const n = rnd(-2, 6); if (n === 0 || a ** n > 20000) continue; const m = machtGetal(a, n); r = m.breuk ? `\\frac{1}{${a ** -n}}` : m.tex; x = n; }
          else { const g = rnd(2, 900); if (Number.isInteger(Math.log(g) / Math.log(a))) continue; r = W.duizend(g); x = Math.log(g) / Math.log(a); if (!zekerRond(x, 1)) continue; }
          const links = Math.random() < 0.7;
          const tex = links ? `${a}^x = ${r}` : `${r} = ${a}^x`;
          return { soort: 'berekenx', opdracht: 'Bereken x. Gebruik de definitie. Rond af op 1 decimaal waar nodig.', tex, antw: getal(x, 1, { voor: exact ? 'x =' : 'x \\approx' }),
            uitleg: [`x = ${logT(a, r)}`, exact ? `= ${x}` : `\\approx ${tg(x, 3)} \\approx ${tg(x, 1)}`] };
        }
        const n = kies([2, 2, 3]); let r, x, exact = Math.random() < 0.5;
        if (exact) { x = rnd(2, n === 2 ? 15 : 7); r = x ** n; } else { r = rnd(5, 300); x = r ** (1 / n); if (Number.isInteger(+x.toFixed(9)) || !zekerRond(x, 1)) continue; }
        return { soort: 'berekenx', opdracht: 'Bereken x. Gebruik de definitie. Rond af op 1 decimaal waar nodig.', tex: `${n} = \\log_x ${r}`, antw: getal(x, 1, { voor: exact ? 'x =' : 'x \\approx' }),
          uitleg: [`x^${n} = ${r}`, `x = ${n === 2 ? `\\sqrt{${r}}` : `\\sqrt[3]{${r}}`} ${exact ? `= ${x}` : `\\approx ${tg(x, 3)} \\approx ${tg(x, 1)}`}`] };
      }
    } },
  },
  oefenMix: [['regel', 4], ['combineer', 3], ['berekenx', 3]],
  test: [['regel', 4], ['combineer', 3], ['berekenx', 3]],
};
// ===================================================================
//  DEEL 8 — De stelling van Pythagoras
// ===================================================================
const DRIETALLEN = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41], [20, 21, 29], [12, 35, 37]];
function drietal() { const [a, b, c] = kies(DRIETALLEN), k = c <= 13 ? kies([1, 1, 2, 3]) : 1; return [a * k, b * k, c * k]; }
const sq = (x) => `${h(x)}^2`;
const NAMEN = [['Tom', 'Lisa'], ['Ines', 'Yusuf'], ['Lotte', 'Amir'], ['Noor', 'Milan'], ['Sara', 'Ruben'], ['Elif', 'Jonas']];

const DEEL8 = {
  nr: 8, titel: 'De stelling van Pythagoras', kort: 'Ontbrekende zijde, omgekeerde stelling, vraagstukken en afstand.',
  rekenmachine: true,
  opdracht: 'Bereken de ontbrekende zijde. Rond af op 2 decimalen waar nodig.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">De stelling van Pythagoras</div>
      <div class="twee"><div class="figuur">${driehoekSVG()}</div>
        <div><p>In elke <b>rechthoekige driehoek</b> is het kwadraat van de <b class="rood">schuine zijde</b> (hypotenusa) gelijk aan de som van de kwadraten van de twee <b>rechthoekszijden</b> (catheten).</p>
        <p class="midden" style="font-size:20px">$a^2 + b^2 = c^2$</p>
        <p class="klein">$c$ = schuine zijde, de langste zijde, tegenover de rechte hoek &nbsp;·&nbsp; $a$ en $b$ = rechthoekszijden</p></div></div>
    </div>
    <div class="twee">
      <div class="kader eig"><div class="kader-titel">Schuine zijde gevraagd</div><p class="midden">$c = \\sqrt{a^2 + b^2}$</p><p class="midden klein">kwadraten <b>optellen</b></p></div>
      <div class="kader eig"><div class="kader-titel">Rechthoekszijde gevraagd</div><p class="midden">$b = \\sqrt{c^2 - a^2}$</p><p class="midden klein">kwadraten <b>aftrekken</b></p></div>
    </div>
    <p class="klein">Rond pas op het einde af (2 decimalen). Controle: de schuine zijde is altijd de langste zijde.</p>
    <div class="kader">
      <table class="tabel"><tr><th>gegeven</th><th>berekening</th><th>antwoord</th></tr>
        <tr><td>$a = 3,\\ b = 4$</td><td>$c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25}$</td><td>$c = 5$</td></tr>
        <tr><td>$c = 10,\\ a = 6$</td><td>$b = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = \\sqrt{64}$</td><td>$b = 8$</td></tr>
        <tr><td>$a = 7,\\ b = 7$</td><td>$c = \\sqrt{7^2 + 7^2} = \\sqrt{49 + 49} = \\sqrt{98}$</td><td>$c \\approx 9{,}90$</td></tr></table>
    </div>
    <div class="kader werk">
      <div class="kader-titel">De omgekeerde stelling</div>
      <p>Als $a^2 + b^2 = c^2$, dan is de driehoek <b>rechthoekig</b>. Zo controleer je of een driehoek rechthoekig is:</p>
      <ol><li>neem voor $c$ de <b>langste</b> zijde</li><li>bereken $a^2 + b^2$ en $c^2$</li><li>gelijk → rechthoekig. Niet gelijk → niet rechthoekig.</li></ol>
      <p>$3, 4, 5$: &nbsp; $3^2 + 4^2 = 9 + 16 = 25$ en $5^2 = 25$ → <span class="groen"><b>ja</b></span> &nbsp;·&nbsp; $5, 7, 9$: &nbsp; $5^2 + 7^2 = 74$ en $9^2 = 81$ → <span class="rood"><b>nee</b></span></p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Vraagstukken</div>
      <p>Maak een schets, zoek de rechthoekige driehoek en duid de schuine zijde aan. Schrijf je berekening en formuleer een antwoord.</p>
      <p>Een ladder van 5 m staat tegen een muur. De voet staat 2 m van de muur. Hoe hoog reikt de ladder?<br>
        Schuine zijde = ladder = 5 m: $h = \\sqrt{5^2 - 2^2} = \\sqrt{25 - 4} = \\sqrt{21} \\approx 4{,}58$. &nbsp; <b>Antwoord:</b> ongeveer 4,58 m.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">De afstandsformule</div>
      <p>De afstand $AB$ tussen $A(x_1, y_1)$ en $B(x_2, y_2)$:</p>
      <p class="midden" style="font-size:19px">$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$</p>
      <ul><li>$x_2 - x_1$ = de horizontale afstand</li><li>$y_2 - y_1$ = de verticale afstand</li><li>Je berekent dus de schuine zijde van een rechthoekige driehoek.</li></ul>
      <div class="twee"><div class="figuur">${rooster([-2, -1], [5, 3], ['A', 'B'], 6)}</div>
        <div><p>$A(-2, -1)$ en $B(5, 3)$<br>horizontaal: $5 - (-2) = 7$, verticaal: $3 - (-1) = 4$</p>
        <p>$AB = \\sqrt{(5+2)^2 + (3+1)^2} = \\sqrt{49 + 16} = \\sqrt{65} \\approx 8{,}06$</p></div></div>
    </div>`,
  voorbeelden: [
    { tex: 'a = 5,\\ b = 12 \\qquad c = \\,?', stappen: ['c = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144}', '= \\sqrt{169} = 13'] },
    { tex: 'c = 13,\\ b = 5 \\qquad a = \\,?', stappen: ['a = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25}', '= \\sqrt{144} = 12'] },
    { tex: 'a = 1,\\ b = 1 \\qquad c = \\,?', stappen: ['c = \\sqrt{1^2 + 1^2} = \\sqrt{2}', '\\approx 1{,}41'] },
    { tex: '8,\\ 15,\\ 17 \\text{ rechthoekig?}', stappen: ['8^2 + 15^2 = 64 + 225 = 289', '17^2 = 289', '\\text{gelijk: ja, rechthoekig}'] },
    { html: 'Een gelijkbenige driehoek heeft een basis van 10 cm en een hoogte van 12 cm. Hoe lang zijn de gelijke zijden?', stappen: ['\\text{De hoogte verdeelt de basis in twee: } 10 : 2 = 5', 'z = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13', '\\text{Antwoord: de gelijke zijden zijn 13 cm lang.}'] },
    { html: 'Een rechthoekige driehoek heeft een schuine zijde van 26 cm en één rechthoekszijde van 24 cm. Bereken de oppervlakte.', stappen: ['a = \\sqrt{26^2 - 24^2} = \\sqrt{676 - 576} = \\sqrt{100} = 10', 'A = \\frac{b \\cdot h}{2} = \\frac{24 \\cdot 10}{2} = 120', '\\text{Antwoord: de oppervlakte is } 120 \\text{ cm}^2.'] },
    { tex: 'A(5, -2) \\text{ en } B(-4, -6)', stappen: ['AB = \\sqrt{(-4-5)^2 + (-6+2)^2}', '= \\sqrt{81 + 16} = \\sqrt{97}', '\\approx 9{,}85'] },
  ],
  soorten: {
    zijde: { naam: 'Ontbrekende zijde', gen() {
      for (;;) {
        let a, b, c;
        if (Math.random() < 0.45) [a, b, c] = drietal();
        else { a = Math.random() < 0.2 ? rnd(11, 99) / 10 : rnd(1, 20); b = rnd(1, 20); c = Math.sqrt(a * a + b * b); }
        const schuin = Math.random() < 0.55;
        if (schuin) {
          if (!Number.isInteger(c) && !zekerRond(c, 2)) continue;
          const ex = Number.isInteger(+c.toFixed(9));
          return { soort: 'zijde', tex: `a = ${tg(a)},\\ b = ${tg(b)} \\qquad c = \\,?`, antw: getal(c, 2, { voor: ex ? 'c =' : 'c \\approx' }),
            uitleg: [`c = \\sqrt{${sq(a)} + ${sq(b)}} = \\sqrt{${tg(+(a * a).toFixed(4))} + ${tg(b * b)}} = \\sqrt{${tg(+(a * a + b * b).toFixed(4))}} ${ex ? '=' : '\\approx'} ${tg(c, 2)}`] };
        }
        // rechthoekszijde: c en a gegeven
        let C, A; if (Number.isInteger(c)) { C = c; A = Math.random() < 0.5 ? a : b; } else { C = rnd(5, 25); A = rnd(1, C - 1); }
        const B = Math.sqrt(C * C - A * A); if (!Number.isInteger(+B.toFixed(9)) && !zekerRond(B, 2)) continue;
        const ex = Number.isInteger(+B.toFixed(9));
        return { soort: 'zijde', tex: `c = ${tg(C)},\\ a = ${tg(A)} \\qquad b = \\,?`, antw: getal(B, 2, { voor: ex ? 'b =' : 'b \\approx' }),
          uitleg: [`b = \\sqrt{${sq(C)} - ${sq(A)}} = \\sqrt{${C * C} - ${A * A}} = \\sqrt{${C * C - A * A}} ${ex ? '=' : '\\approx'} ${tg(B, 2)}`] };
      }
    } },
    rechthoekig: { naam: 'Is de driehoek rechthoekig?', gen() {
      let z, ja = Math.random() < 0.5;
      if (ja) z = drietal();
      else { do { z = drietal(); const i = rnd(0, 2); z[i] += kies([-1, 1, 2]); z.sort((p, q) => p - q); } while (z[0] * z[0] + z[1] * z[1] === z[2] * z[2] || z[0] + z[1] <= z[2]); if (Math.random() < 0.35) { do { z = [rnd(2, 9), rnd(3, 10), rnd(4, 12)].sort((p, q) => p - q); } while (z[0] * z[0] + z[1] * z[1] === z[2] * z[2] || z[0] + z[1] <= z[2]); } }
      const [a, b, c] = z, s = a * a + b * b;
      return { soort: 'rechthoekig', opdracht: 'Is de driehoek rechthoekig? Controleer met de omgekeerde stelling.', tex: `${a},\\ ${b},\\ ${c}`, antw: keuze(JANEE, s === c * c ? 'ja' : 'nee'),
        uitleg: [`${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${s} \\qquad ${c}^2 = ${c * c}`, s === c * c ? '\\text{gelijk: ja, rechthoekig}' : '\\text{niet gelijk: nee, niet rechthoekig}'] };
    } },
    vraagstuk: { naam: 'Vraagstukken', gen() {
      for (;;) {
        const t = kies(['ladder', 'vlieger', 'gelijkbenig', 'perceel', 'opp', 'tv']);
        let zin, w, na, uit;
        if (t === 'ladder') { const L = rnd(8, 16) / 2, v = rnd(2, 6) / 2; if (v >= L - 1) continue; w = Math.sqrt(L * L - v * v); na = '\\text{m}';
          zin = `Een ladder van ${kg(L)} m staat tegen een muur. De voet staat ${kg(v)} m van de muur. Hoe hoog reikt de ladder?`;
          uit = [`\\text{schuine zijde = ladder} = ${tg(L)}`, `h = \\sqrt{${sq(L)} - ${sq(v)}} = \\sqrt{${tg(L * L)} - ${tg(v * v)}} \\approx ${tg(w, 2)}`]; }
        if (t === 'vlieger') { const L = rnd(4, 12) * 5, d = rnd(2, L / 5 - 1) * 5; w = Math.sqrt(L * L - d * d); na = '\\text{m}';
          zin = `Een vlieger hangt aan een strak touw van ${L} m. De vlieger hangt recht boven een punt dat ${d} m van jou verwijderd is. Hoe hoog hangt de vlieger?`;
          uit = [`\\text{schuine zijde = touw} = ${L}`, `h = \\sqrt{${L}^2 - ${d}^2} = \\sqrt{${L * L} - ${d * d}} ${Number.isInteger(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'gelijkbenig') { const B = rnd(3, 12) * 2, hh = rnd(3, 15); w = Math.sqrt((B / 2) ** 2 + hh * hh); na = '\\text{cm}';
          zin = `Een gelijkbenige driehoek heeft een basis van ${B} cm en een hoogte van ${hh} cm. Hoe lang zijn de gelijke zijden?`;
          uit = [`\\text{de hoogte verdeelt de basis in twee: } ${B} : 2 = ${B / 2}`, `z = \\sqrt{${B / 2}^2 + ${hh}^2} = \\sqrt{${(B / 2) ** 2} + ${hh * hh}} ${Number.isInteger(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'perceel') { const p = rnd(5, 40), q = rnd(5, 60); w = Math.sqrt(p * p + q * q); na = '\\text{m}';
          zin = `Een rechthoekig perceel heeft zijden van ${p} m en ${q} m. Hoe lang is de diagonaal?`;
          uit = ['\\text{de diagonaal is de schuine zijde}', `d = \\sqrt{${p}^2 + ${q}^2} = \\sqrt{${p * p} + ${q * q}} ${Number.isInteger(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'opp') { const [a, b, c] = drietal(); w = a * b / 2; na = '\\text{cm}^2';
          zin = `Een rechthoekige driehoek heeft een schuine zijde van ${c} cm en één rechthoekszijde van ${b} cm. Bereken de oppervlakte van de driehoek.`;
          uit = [`a = \\sqrt{${c}^2 - ${b}^2} = \\sqrt{${c * c} - ${b * b}} = ${a}`, `A = \\frac{b \\cdot h}{2} = \\frac{${b} \\cdot ${a}}{2} = ${tg(w)}`]; }
        if (t === 'tv') { const br = rnd(50, 140), ho = Math.round(br * kies([0.5625, 0.6, 0.75]) ); w = Math.sqrt(br * br + ho * ho); na = '\\text{cm}';
          zin = `Een rechthoekig scherm is ${br} cm breed en ${ho} cm hoog. Hoe lang is de diagonaal van het scherm?`;
          uit = ['\\text{de diagonaal is de schuine zijde}', `d = \\sqrt{${br}^2 + ${ho}^2} = \\sqrt{${br * br} + ${ho * ho}} \\approx ${tg(w, 2)}`]; }
        if (!Number.isInteger(+w.toFixed(9)) && !zekerRond(w, 2)) continue;
        uit.push(`\\text{Antwoord: } ${tg(w, 2)}\\ ${na}`);
        return { soort: 'vraagstuk', opdracht: 'Maak een schets op je kladblad en bereken. Rond af op 2 decimalen.', html: `<div class="tekstopgave">${W.esc(zin)}</div>`, rapport: zin, sleutel: zin,
          antw: getal(w, 2, { voor: '', na }), uitleg: uit };
      }
    } },
    afstand: { naam: 'Afstand tussen twee punten', gen() {
      for (;;) {
        const b = 6, P = [rnd(-b, b), rnd(-b, b)], Q = [rnd(-b, b), rnd(-b, b)];
        const dx = Q[0] - P[0], dy = Q[1] - P[1]; if (!dx || !dy) continue;
        const w = Math.sqrt(dx * dx + dy * dy); if (!Number.isInteger(+w.toFixed(9)) && !zekerRond(w, 2)) continue;
        const nm = kies([['A', 'B'], ['P', 'Q'], ['C', 'D'], ['E', 'F']]);
        const pt = (n, p) => `${n}(${tg(p[0])}, ${tg(p[1])})`;
        const ex = Number.isInteger(+w.toFixed(9));
        const metRooster = Math.random() < 0.4;
        const opg = `$${pt(nm[0], P)}$ en $${pt(nm[1], Q)}$`;
        return { soort: 'afstand', opdracht: `Bereken de afstand ${nm.join('')} met de afstandsformule. Rond af op 2 decimalen waar nodig.`,
          html: `<div>${opg}</div>${metRooster ? `<div class="figuur">${rooster(P, Q, nm, b)}</div>` : ''}`, sleutel: opg, rapport: `${nm[0]}(${P}) en ${nm[1]}(${Q})`.replace(/-/g, '−'),
          antw: getal(w, 2, { voor: `${nm.join('')} ${ex ? '=' : '\\approx'}` }),
          uitleg: [`${nm.join('')} = \\sqrt{(${tg(Q[0])} - ${h(P[0])})^2 + (${tg(Q[1])} - ${h(P[1])})^2} = \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${dx * dx + dy * dy}} ${ex ? '=' : '\\approx'} ${tg(w, 2)}`] };
      }
    } },
  },
  oefenMix: [['zijde', 3], ['rechthoekig', 2], ['vraagstuk', 2], ['afstand', 2]],
  test: [['zijde', 3], ['rechthoekig', 2], ['afstand', 3], ['vraagstuk', 2]],
};

// ===================================================================
//  DEEL 9 — Vergelijkingen
// ===================================================================
const term = (c, x = 'x', eerste = false) => { // c·x als TeX met teken
  const k = c === 1 ? x : c === -1 ? `-${x}` : `${c}${x}`;
  return eerste ? k : (c < 0 ? `- ${k.slice(1)}` : `+ ${k}`);
};
const cst = (c) => c === 0 ? '' : c < 0 ? ` - ${-c}` : ` + ${c}`;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const DEEL9 = {
  nr: 9, titel: 'Vergelijkingen', kort: 'Haakjes, noemers, evenredigheden, wortels en vraagstukken.',
  rekenmachine: null,
  opdracht: 'Los op en maak de proef.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">Regels</div>
      <ul><li>Beide leden mogen met <b>dezelfde eenterm</b> opgeteld of afgetrokken worden.</li>
        <li>Beide leden mogen met <b>hetzelfde getal ($\\neq 0$)</b> vermenigvuldigd of gedeeld worden.</li></ul>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Stappenplan</div>
      <ol><li>noemer wegwerken</li><li>wortel wegwerken</li><li>de lineaire vergelijking oplossen</li><li>de proef maken</li></ol>
      <p>Noteer de oplossing als $V = \\{\\ldots\\}$.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Haakjes wegwerken</div>
      <p>Werk eerst de haakjes weg (distributiviteit), daarna los je op zoals gewoonlijk.</p>
      <p>$4(x - 1) + 3 = 15 \\;\\Leftrightarrow\\; 4x - 4 + 3 = 15 \\;\\Leftrightarrow\\; 4x = 16 \\;\\Leftrightarrow\\; x = 4$</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Noemer wegwerken</div>
      <p>Vermenigvuldig beide leden met de (gemeenschappelijke) noemer.</p>
      <p>$\\dfrac{x}{4} + 1 = 3 \\;\\Leftrightarrow\\; x + 4 = 12 \\;\\Leftrightarrow\\; x = 8$ &nbsp; <span class="klein">(beide leden maal 4)</span></p>
    </div>
    <div class="kader">
      <div class="kader-titel">Evenredigheid</div>
      <p>Het product van de uitersten is gelijk aan het product van de middelsten: $\\dfrac{a}{b} = \\dfrac{c}{d} \\;\\Leftrightarrow\\; a \\cdot d = b \\cdot c$</p>
      <p>$\\dfrac{5}{x} = \\dfrac{10}{6} \\;\\Leftrightarrow\\; 5 \\cdot 6 = 10x \\;\\Leftrightarrow\\; x = 3$</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Wortel wegwerken</div>
      <p>Werk de wortel weg door <b>beide leden te kwadrateren</b>. Maak zeker de proef.</p>
      <p>$\\sqrt{x + 5} = 3 \\;\\Leftrightarrow\\; x + 5 = 9 \\;\\Leftrightarrow\\; x = 4$ &nbsp; <span class="klein">proef: $\\sqrt{4 + 5} = \\sqrt{9} = 3$ ✓</span></p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Vraagstukken</div>
      <p><b>Onbekende</b> – <b>vergelijking</b> – <b>oplossing</b> – <b>antwoord</b> – <b>controle</b>.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <p>Typ in het vakje tussen de accolades enkel de oplossing, bv. $V = \\{\\,\\boxed{-3}\\,\\}$: typ <code>-3</code>. Een breuk typ je als <code>5/2</code>.</p></div>`,
  voorbeelden: [
    { tex: '3x - 4 = 11', stappen: ['3x = 11 + 4 = 15', 'x = 5', '\\text{proef: } 3 \\cdot 5 - 4 = 11 \\;✓', 'V = \\{5\\}'] },
    { tex: '5x + 2 = 2x - 7', stappen: ['5x - 2x = -7 - 2', '3x = -9', 'x = -3', 'V = \\{-3\\}'] },
    { tex: '2(x + 3) = x + 10', stappen: ['2x + 6 = x + 10', 'x = 4', 'V = \\{4\\}'] },
    { tex: '\\dfrac{x}{2} + \\dfrac{x}{4} = 6', stappen: ['\\text{beide leden maal 4: } 2x + x = 24', '3x = 24', 'x = 8', 'V = \\{8\\}'] },
    { tex: '\\dfrac{3}{x + 1} = \\dfrac{6}{x + 4}', stappen: ['3(x + 4) = 6(x + 1)', '3x + 12 = 6x + 6', '-3x = -6 \\;\\Leftrightarrow\\; x = 2', 'V = \\{2\\}'] },
    { tex: '\\sqrt{2x + 7} = 5', stappen: ['\\text{kwadrateren: } 2x + 7 = 25', '2x = 18 \\;\\Leftrightarrow\\; x = 9', '\\text{proef: } \\sqrt{2 \\cdot 9 + 7} = \\sqrt{25} = 5 \\;✓', 'V = \\{9\\}'] },
    { html: 'Ines en Yusuf hebben samen € 60. Yusuf heeft € 12 meer dan Ines. Hoeveel heeft elk?', stappen: ['\\text{onbekende: Ines heeft } x \\text{ euro, Yusuf } x + 12', '\\text{vergelijking: } x + (x + 12) = 60', '2x = 48 \\;\\Leftrightarrow\\; x = 24', '\\text{antwoord: Ines heeft 24 euro, Yusuf 36 euro}', '\\text{controle: } 24 + 36 = 60 \\;✓'] },
  ],
  soorten: {
    lineair: { naam: 'Eenvoudige vergelijkingen', gen() {
      const x = nz(-10, 12), vorm = kies(['ax+b', 'ax+b', 'b-ax', 'beide']);
      let tex, stap;
      if (vorm === 'ax+b') { const a = nz(2, 9) * (Math.random() < 0.2 ? -1 : 1), b = nz(-20, 20); tex = `${term(a, 'x', true)}${cst(b)} = ${a * x + b}`; stap = [`${term(a, 'x', true)} = ${a * x + b} ${b < 0 ? '+' : '-'} ${Math.abs(b)} = ${a * x}`]; }
      else if (vorm === 'b-ax') { const a = rnd(2, 9), b = nz(1, 20); tex = `${b} - ${a}x = ${b - a * x}`; stap = [`-${a}x = ${b - a * x} - ${b} = ${-a * x}`]; }
      else { let a, c; do { a = rnd(2, 9); c = rnd(1, 8); } while (a === c); const b = nz(-12, 12), d = (a - c) * x + b; tex = `${term(a, 'x', true)}${cst(b)} = ${term(c, 'x', true)}${cst(d)}`; stap = [`${a}x - ${c === 1 ? '' : c}x = ${d}${b < 0 ? ` + ${-b}` : ` - ${b}`}`, `${a - c}x = ${d - b}`]; }
      return { soort: 'lineair', tex, antw: V(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    haakjes: { naam: 'Eerst de haakjes weg', gen() {
      const x = nz(-8, 10), vorm = kies(['a(x+b)+c', 'a(x+b)=cx+d', 'a(bx+c)-dx']);
      let tex, stap;
      if (vorm === 'a(x+b)+c') { const a = rnd(2, 6), b = nz(-6, 6), c = nz(-9, 9); tex = `${a}(x${cst(b)})${cst(c)} = ${a * (x + b) + c}`; stap = [`${a}x${cst(a * b)}${cst(c)} = ${a * (x + b) + c}`, `${a}x = ${a * x}`]; }
      else if (vorm === 'a(x+b)=cx+d') { let a, c; do { a = rnd(2, 6); c = rnd(1, 7); } while (a === c); const b = nz(-6, 6), d = a * (x + b) - c * x; tex = `${a}(x${cst(b)}) = ${term(c, 'x', true)}${cst(d)}`; stap = [`${a}x${cst(a * b)} = ${term(c, 'x', true)}${cst(d)}`, `${a - c}x = ${(a - c) * x}`]; }
      else { const a = rnd(2, 5), b = rnd(2, 4), c = nz(-5, 5); let d; do { d = rnd(1, 9); } while (d === a * b); const e = a * (b * x + c) - d * x; tex = `${a}(${b}x${cst(c)}) - ${d === 1 ? '' : d}x = ${e}`; stap = [`${a * b}x${cst(a * c)} - ${d === 1 ? '' : d}x = ${e}`, `${a * b - d}x = ${(a * b - d) * x}`]; }
      return { soort: 'haakjes', opdracht: 'Los op. Werk eerst de haakjes weg.', tex, antw: V(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    noemer: { naam: 'Eerst de noemer weg', gen() {
      const vorm = kies(['x/a+b', 'bx/a-c', 'x/a+x/b']);
      let tex, x, stap;
      if (vorm === 'x/a+b') { const a = rnd(2, 9), k = nz(-6, 8), b = nz(-9, 9); x = a * k; const r = k + b; tex = `\\dfrac{x}{${a}}${cst(b)} = ${r}`; stap = [`\\text{beide leden maal ${a}: } x${cst(a * b)} = ${a * r}`]; }
      else if (vorm === 'bx/a-c') { let a, b; do { a = rnd(2, 7); b = rnd(2, 7); } while (ggd(a, b) > 1); const k = nz(-5, 6), c = nz(-9, 9); x = a * k; const r = b * k - c; tex = `\\dfrac{${b}x}{${a}}${cst(-c)} = ${r}`; stap = [`\\text{beide leden maal ${a}: } ${b}x${cst(-a * c)} = ${a * r}`, `${b}x = ${a * r + a * c}`]; }
      else { let a, b; do { a = rnd(2, 6); b = rnd(2, 6); } while (a === b); const L = kgv(a, b), k = nz(-4, 5); x = L * k; const r = x / a + x / b; tex = `\\dfrac{x}{${a}} + \\dfrac{x}{${b}} = ${r}`; stap = [`\\text{beide leden maal ${L}: } ${L / a}x + ${L / b}x = ${L * r}`, `${L / a + L / b}x = ${L * r}`]; }
      return { soort: 'noemer', opdracht: 'Los op. Werk eerst de noemer weg.', tex, antw: V(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    evenredigheid: { naam: 'Evenredigheden', gen() {
      for (;;) {
        if (Math.random() < 0.5) { // a/x = b/c
          const x = rnd(1, 12), b = rnd(2, 12), c = rnd(2, 12); const a = b * x / c; if (!Number.isInteger(a) || a < 1 || a > 40) continue;
          return { soort: 'evenredigheid', opdracht: 'Los de evenredigheid op.', tex: `\\dfrac{${a}}{x} = \\dfrac{${b}}{${c}}`, antw: V(x), uitleg: [`${a} \\cdot ${c} = ${b} \\cdot x`, `${a * c} = ${b}x`, `x = ${x}`, `V = \\{${x}\\}`] };
        }
        const a = rnd(2, 9), b = rnd(2, 9); if (a === b) continue;
        const p = nz(-5, 5), q = nz(-5, 5); if (p === q) continue;
        const x = (b * p - a * q) / (a - b); if (!Number.isInteger(x) || x + p === 0 || x + q === 0 || Math.abs(x) > 20) continue;
        const tex = `\\dfrac{${a}}{x${cst(p)}} = \\dfrac{${b}}{x${cst(q)}}`;
        return { soort: 'evenredigheid', opdracht: 'Los de evenredigheid op.', tex, antw: V(x),
          uitleg: [`${a}(x${cst(q)}) = ${b}(x${cst(p)})`, `${a}x${cst(a * q)} = ${b}x${cst(b * p)}`, `${term(a - b, 'x', true)} = ${b * p - a * q}`, `x = ${x}`, `V = \\{${x}\\}`] };
      }
    } },
    wortel: { naam: 'Eerst de wortel weg', gen() {
      for (;;) {
        const c = rnd(2, 9), a = nz(-4, 5), x = nz(-8, 12), b = c * c - a * x;
        if (Math.abs(b) > 60) continue;
        const binnen = `${term(a, 'x', true)}${cst(b)}`;
        return { soort: 'wortel', opdracht: 'Los op. Werk eerst de wortel weg door beide leden te kwadrateren. Maak de proef.', tex: `\\sqrt{${binnen}} = ${c}`, antw: V(x),
          uitleg: [`\\text{kwadrateren: } ${binnen} = ${c * c}`, `${term(a, 'x', true)} = ${c * c - b}`, `x = ${x}`, `\\text{proef: } \\sqrt{${a === 1 ? '' : a === -1 ? '-' : a + ' \\cdot '}${h(x)}${cst(b)}} = \\sqrt{${c * c}} = ${c} \\;✓`, `V = \\{${x}\\}`] };
      }
    } },
    vraagstuk: { naam: 'Vraagstukken', gen() {
      if (Math.random() < 0.55) {
        const [p, q] = kies(NAMEN), x = rnd(5, 60), d = rnd(2, 30), S = 2 * x + d;
        const zin = `${p} en ${q} hebben samen € ${S}. ${q} heeft € ${d} meer dan ${p}. Hoeveel heeft elk?`;
        return { soort: 'vraagstuk', opdracht: 'Los het vraagstuk op met een vergelijking.', html: `<div class="tekstopgave">${zin}</div>`, rapport: zin, sleutel: zin,
          antw: { soort: 'delen', delen: [{ label: `\\text{${p}}`, antw: getal(x, null, { voor: '', na: '\\text{euro}' }) }, { label: `\\text{${q}}`, antw: getal(x + d, null, { voor: '', na: '\\text{euro}' }) }] },
          uitleg: [`\\text{onbekende: ${p} heeft } x \\text{ euro, ${q} heeft } x + ${d}`, `x + (x + ${d}) = ${S}`, `2x = ${S - d} \\;\\Leftrightarrow\\; x = ${x}`, `\\text{antwoord: ${p} heeft ${x} euro, ${q} heeft ${x + d} euro}`, `\\text{controle: } ${x} + ${x + d} = ${S} \\;✓`] };
      }
      const n = rnd(5, 60), S = 3 * n + 3;
      const zin = `De som van drie opeenvolgende natuurlijke getallen is ${S}. Welke getallen zijn het?`;
      return { soort: 'vraagstuk', opdracht: 'Los het vraagstuk op met een vergelijking.', html: `<div class="tekstopgave">${zin}</div>`, rapport: zin, sleutel: zin,
        antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { tex: ',' }, { veld: 1 }, { tex: '\\text{ en }' }, { veld: 2 }], velden: [veldE(`${n}`), veldE(`${n + 1}`), veldE(`${n + 2}`)] },
        uitleg: [`\\text{onbekende: de getallen zijn } x,\\ x + 1 \\text{ en } x + 2`, `x + (x + 1) + (x + 2) = ${S}`, `3x + 3 = ${S} \\;\\Leftrightarrow\\; 3x = ${S - 3} \\;\\Leftrightarrow\\; x = ${n}`, `\\text{antwoord: } ${n},\\ ${n + 1} \\text{ en } ${n + 2}`, `\\text{controle: } ${n} + ${n + 1} + ${n + 2} = ${S} \\;✓`] };
    } },
  },
  oefenMix: [['lineair', 2], ['haakjes', 2], ['noemer', 2], ['evenredigheid', 2], ['wortel', 2], ['vraagstuk', 1]],
  test: [['lineair', 2], ['haakjes', 2], ['noemer', 2], ['evenredigheid', 1], ['wortel', 2], ['vraagstuk', 1]],
};

// ===================================================================
//  DEEL 10 — Omvormen van formules
// ===================================================================
const FORMULES = [
  { f: 'v = \\dfrac{s}{t}', vars: ['v', 's', 't'], doelen: { s: ['v*t', 'v \\cdot t'], t: ['s/v', '\\dfrac{s}{v}'] } },
  { f: 'P = \\dfrac{F}{A}', vars: ['P', 'F', 'A'], doelen: { F: ['P*A', 'P \\cdot A'], A: ['F/P', '\\dfrac{F}{P}'] } },
  { f: '\\rho = \\dfrac{m}{V}', vars: ['ρ', 'm', 'V'], doelen: { m: ['ρ*V', '\\rho \\cdot V'], V: ['m/ρ', '\\dfrac{m}{\\rho}'] } },
  { f: 'O = 4z', vars: ['O', 'z'], doelen: { z: ['O/4', '\\dfrac{O}{4}'] } },
  { f: 'A = z^2', vars: ['A', 'z'], doelen: { z: ['√A', '\\sqrt{A}'] } },
  { f: 'V = z^3', vars: ['V', 'z'], doelen: { z: ['∛V', '\\sqrt[3]{V}'] } },
  { f: 'O = 2b + 2l', vars: ['O', 'b', 'l'], doelen: { l: ['(O-2b)/2', '\\dfrac{O - 2b}{2}'], b: ['(O-2l)/2', '\\dfrac{O - 2l}{2}'] } },
  { f: 'A = \\dfrac{b \\cdot h}{2}', vars: ['A', 'b', 'h'], doelen: { h: ['2A/b', '\\dfrac{2A}{b}'], b: ['2A/h', '\\dfrac{2A}{h}'] } },
  { f: 'O = 2 \\cdot r \\cdot \\pi', vars: ['O', 'r'], doelen: { r: ['O/(2π)', '\\dfrac{O}{2\\pi}'] } },
  { f: 'A = r^2 \\cdot \\pi', vars: ['A', 'r'], doelen: { r: ['√(A/π)', '\\sqrt{\\dfrac{A}{\\pi}}'] } },
  { f: 'F = m \\cdot g', vars: ['F', 'm', 'g'], doelen: { m: ['F/g', '\\dfrac{F}{g}'], g: ['F/m', '\\dfrac{F}{m}'] } },
];
const DEEL10 = {
  nr: 10, titel: 'Omvormen van formules', kort: 'Een formule omvormen naar een gevraagde grootheid, toepassingen.',
  rekenmachine: true,
  opdracht: 'Vorm om naar de gevraagde grootheid.',
  theorie: `
    <div class="kader werk">
      <div class="kader-titel">Methode</div>
      <ol><li>Staat de gevraagde grootheid in het rechterlid? Verwissel dan de leden.</li>
        <li>Duid de grootheid aan waarnaar je omvormt.</li>
        <li>Pas de regels toe van het oplossen van vergelijkingen.</li></ol>
      <p>Voorbeeld: $F = m \\cdot g \\;\\rightarrow\\; m = \\dfrac{F}{g}$ &nbsp; <span class="klein">(beide leden delen door $g$, daarna de leden verwisselen)</span></p>
    </div>
    <div class="kader">
      <div class="kader-titel">Nog enkele voorbeelden</div>
      <table class="tabel"><tr><th>formule</th><th>gevraagd</th><th>omgevormd</th></tr>
        <tr><td>$\\rho = \\dfrac{m}{V}$</td><td>$V$</td><td>$\\rho \\cdot V = m \\;\\rightarrow\\; V = \\dfrac{m}{\\rho}$</td></tr>
        <tr><td>$A = \\dfrac{b \\cdot h}{2}$</td><td>$b$</td><td>$2A = b \\cdot h \\;\\rightarrow\\; b = \\dfrac{2A}{h}$</td></tr>
        <tr><td>$O = 2b + 2l$</td><td>$b$</td><td>$O - 2l = 2b \\;\\rightarrow\\; b = \\dfrac{O - 2l}{2}$</td></tr>
        <tr><td>$A = z^2$</td><td>$z$</td><td>$z = \\sqrt{A}$ &nbsp; <span class="klein">(de wortel heft het kwadraat op)</span></td></tr></table>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Toepassingen</div>
      <p><b>Gegevens</b> – <b>gevraagd</b> – <b>formule</b> – <b>omgevormde formule</b> – <b>antwoord</b>. Rond af op 2 decimalen waar nodig.</p>
      <p>Een vierkant heeft een oppervlakte van 30,25 cm². Hoe lang is een zijde?<br>
        $A = z^2 \\;\\rightarrow\\; z = \\sqrt{A} = \\sqrt{30{,}25} = 5{,}5$ &nbsp; <b>Antwoord:</b> een zijde is 5,5 cm.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$\\dfrac{F}{g}$</td><td><code>F/g</code></td></tr>
        <tr><td>$\\dfrac{2A}{h}$</td><td><code>2A/h</code></td></tr>
        <tr><td>$\\dfrac{O - 2l}{2}$</td><td><code>(O-2l)/2</code> &nbsp;(haakjes rond de teller!)</td></tr>
        <tr><td>$\\dfrac{O}{2\\pi}$</td><td><code>O/(2π)</code> &nbsp;(haakjes rond de noemer!)</td></tr>
        <tr><td>$\\sqrt{\\dfrac{A}{\\pi}}$</td><td><code>√(A/π)</code></td></tr></table>
      <p class="klein">Let op hoofdletters: $A$ en $a$, $V$ en $v$ zijn verschillende grootheden. $O$ is de letter O, geen nul. Gebruik de knoppen π en ρ.</p></div>`,
  voorbeelden: [
    { tex: 'F = m \\cdot g \\qquad g = \\,?', stappen: ['m \\cdot g = F \\quad \\text{(leden verwisselen)}', 'g = \\dfrac{F}{m} \\quad \\text{(beide leden delen door } m)'] },
    { tex: '\\rho = \\dfrac{m}{V} \\qquad V = \\,?', stappen: ['\\rho \\cdot V = m \\quad \\text{(beide leden maal } V)', 'V = \\dfrac{m}{\\rho} \\quad \\text{(beide leden delen door } \\rho)'] },
    { tex: 'O = 2b + 2l \\qquad b = \\,?', stappen: ['2b + 2l = O', '2b = O - 2l', 'b = \\dfrac{O - 2l}{2}'] },
    { tex: 'A = \\dfrac{b \\cdot h}{2} \\qquad b = \\,?', stappen: ['\\dfrac{b \\cdot h}{2} = A', 'b \\cdot h = 2A', 'b = \\dfrac{2A}{h}'] },
    { html: 'Een kubus heeft een volume van 64 cm³. Hoe lang is een ribbe?', stappen: ['V = z^3 \\;\\rightarrow\\; z = \\sqrt[3]{V}', 'z = \\sqrt[3]{64} = 4', '\\text{Antwoord: een ribbe is 4 cm.}'] },
  ],
  soorten: {
    omvormen: { naam: 'Formule omvormen', gen() {
      const f = kies(FORMULES), doel = kies(Object.keys(f.doelen)), [e, t] = f.doelen[doel];
      return { soort: 'omvormen', opdracht: 'Vorm om naar de gevraagde grootheid.', tex: `${f.f} \\qquad ${doel === 'ρ' ? '\\rho' : doel} = \\,?`, sleutel: f.f + doel,
        antw: { soort: 'formule', expr: e, doel, vars: f.vars, tex: t }, uitleg: [`${doel} = ${t}`] };
    } },
    toepassing: { naam: 'Toepassingen', gen() {
      for (;;) {
        const t = kies(['fiets', 'druk', 'ijzer', 'vierkant', 'cirkel', 'kubus']);
        let zin, w, na, uit;
        if (t === 'fiets') { const v = rnd(12, 30), s = rnd(10, 120); w = s / v; na = '\\text{u}'; zin = `Een fietser legt ${s} km af aan ${v} km/u. Hoe lang is hij onderweg (in uur)?`; uit = [`v = \\dfrac{s}{t} \\;\\rightarrow\\; t = \\dfrac{s}{v}`, `t = \\dfrac{${s}}{${v}} ${Number.isInteger(+(w * 100).toFixed(6)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'druk') { const F = rnd(1, 40) * 50, P = rnd(2, 40) * 100; w = F / P; na = '\\text{m}^2'; zin = `Een kracht van ${F} N zorgt voor een druk van ${P} Pa. Hoe groot is de oppervlakte (in m²)?`; uit = [`P = \\dfrac{F}{A} \\;\\rightarrow\\; A = \\dfrac{F}{P}`, `A = \\dfrac{${F}}{${P}} ${Number.isInteger(+(w * 100).toFixed(6)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'ijzer') { const [stof, rho] = kies([['ijzer', 7.87], ['aluminium', 2.7], ['koper', 8.96], ['goud', 19.3]]); const m = rnd(100, 2000) / 2; w = m / rho; na = '\\text{cm}^3';
          zin = `Een blokje ${stof} heeft een massa van ${kg(m)} g. De massadichtheid van ${stof} is ${kg(rho)} g/cm³. Bereken het volume.`; uit = [`\\rho = \\dfrac{m}{V} \\;\\rightarrow\\; V = \\dfrac{m}{\\rho}`, `V = \\dfrac{${tg(m)}}{${tg(rho)}} \\approx ${tg(w, 2)}`]; }
        if (t === 'vierkant') { const z = Math.random() < 0.5 ? rnd(11, 150) / 2 : rnd(3, 25); const A = Math.random() < 0.5 ? +(z * z).toFixed(2) : rnd(10, 400); w = Math.sqrt(A); na = '\\text{cm}';
          zin = `Een vierkant heeft een oppervlakte van ${kg(A)} cm². Hoe lang is een zijde?`; uit = [`A = z^2 \\;\\rightarrow\\; z = \\sqrt{A}`, `z = \\sqrt{${tg(A)}} ${Number.isInteger(+(w * 100).toFixed(6)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'cirkel') { const O = rnd(10, 150); w = O / (2 * Math.PI); na = '\\text{cm}'; zin = `Een cirkel heeft een omtrek van ${O} cm. Bereken de straal.`; uit = [`O = 2 \\cdot r \\cdot \\pi \\;\\rightarrow\\; r = \\dfrac{O}{2\\pi}`, `r = \\dfrac{${O}}{2\\pi} \\approx ${tg(w, 2)}`]; }
        if (t === 'kubus') { const z = rnd(2, 12), exact = Math.random() < 0.5; const Vv = exact ? z ** 3 : rnd(10, 1500); w = Math.cbrt(Vv); na = '\\text{cm}'; zin = `Een kubus heeft een volume van ${Vv} cm³. Hoe lang is een ribbe?`; uit = [`V = z^3 \\;\\rightarrow\\; z = \\sqrt[3]{V}`, `z = \\sqrt[3]{${Vv}} ${Number.isInteger(+w.toFixed(9)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (!Number.isInteger(+(w * 100).toFixed(6)) && !zekerRond(w, 2)) continue;
        if (w < 0.01) continue;
        uit.push(`\\text{Antwoord: } ${tg(w, 2)}\\ ${na}`);
        return { soort: 'toepassing', opdracht: 'Gegevens – gevraagd – formule – omgevormde formule – antwoord. Rond af op 2 decimalen waar nodig.', html: `<div class="tekstopgave">${zin}</div>`, rapport: zin, sleutel: zin,
          antw: getal(w, 2, { voor: '', na }), uitleg: uit };
      }
    } },
  },
  oefenMix: [['omvormen', 3], ['toepassing', 2]],
  test: [['omvormen', 6], ['toepassing', 4]],
};

// ===================================================================
//  Registratie
// ===================================================================
Leerpaden.registreer({
  code: 'reele-getallen',
  titel: 'De reële getallen',
  ondertitel: 'Zelfstudie · 7VJHO',
  klas: '7VJHO',
  soort: 'zelfstudie',
  groepen: [
    { titel: 'A · Reële getallen en bewerkingen', delen: [1, 2, 3] },
    { titel: 'B · Intervallen', delen: [4] },
    { titel: 'C · Machten en logaritmen', delen: [5, 6, 7] },
    { titel: 'D · Pythagoras, vergelijkingen en formules', delen: [8, 9, 10] },
  ],
  delen: [DEEL1, DEEL2, DEEL3, DEEL4, DEEL5, DEEL6, DEEL7, DEEL8, DEEL9, DEEL10],
});
})();
