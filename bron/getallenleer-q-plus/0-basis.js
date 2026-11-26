// ===================================================================
//  REKENEN IN ℚ +  (7VJHO, gevorderden: ≥ 70/100 op de instaptoets) — slaagdrempel 70%
//  Zelfde dertien delen als "Rekenen in ℚ", maar met moeilijkere oefeningen en tests.
//  Leidraad (niets nieuws: alles volgt uit de theorie van Rekenen in ℚ, ℤ + en ℕ +):
//    OneDrive › Vakken › WISKUNDE 7VJHO › 1. GETALLENLEER › Rekenen in Q (werkbundel "Rationale getallen")
//    - decimale vormen, afronden, vereenvoudigen en ordenen, percentages, breuken op de getallenas,
//      de vier bewerkingen, machten en wortels (ook negatieve exponenten), volgorde van de bewerkingen,
//      decimaal getal naar breuk, vraagstukken met procenten en evenredigheden (met rekentoestel).
//  Procenten en evenredigheden: altijd met een verhoudingstabel (wat je boven doet, doe je ook onder).
// ===================================================================
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x, d = null) => W.texGetal(x, d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const kgv = (a, b) => a / ggd(a, b) * b;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kTekst = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const br = (t, n, extra = {}) => { const g = ggd(t, n); return { soort: 'breuk', t: t / g * Math.sign(n), n: Math.abs(n / g), ...extra }; };
const fr = (t, n) => { const g = ggd(t, n); t = t / g * Math.sign(n); n = Math.abs(n / g); return n === 1 ? tg(t) : `${t < 0 ? '-' : ''}\\dfrac{${Math.abs(t)}}{${n}}`; };
const frRaw = (t, n) => `${t < 0 ? '-' : ''}\\dfrac{${Math.abs(t)}}{${n}}`;
const VERGELIJK = [{ k: '<', l: '<' }, { k: '>', l: '>' }, { k: '=', l: '=' }];
const naarTekst = (x) => String(x).replace('.', ',');
const vul = (t, o) => t.replace(/\{(\w)\}/g, (_, k) => o[k]);
const tot = (f) => { for (let i = 0; i < 4000; i++) { const r = f(); if (r) return r; } throw new Error('geen geldige vraag gevonden'); };
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });

// ---- kleine breukenrekenkern: [t, n] met n > 0, vereenvoudigd
const R = (t, n = 1) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return [t / g, n / g]; };
const Rplus = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const Rmin = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const Rmaal = (a, b) => R(a[0] * b[0], a[1] * b[1]);
const Rdeel = (a, b) => R(a[0] * b[1], a[1] * b[0]);
const Rmacht = (a, e) => e >= 0 ? R(a[0] ** e, a[1] ** e) : R(a[1] ** -e, a[0] ** -e);
const Rtex = (a) => fr(a[0], a[1]);
const Rh = (a) => a[0] < 0 ? `\\left(${Rtex(a)}\\right)` : Rtex(a);
const Rhm = (a) => a[1] === 1 ? Rh(a) : `\\left(${Rtex(a)}\\right)`; // altijd haakjes rond een breuk (voor machten)
const Rbr = (a, extra) => br(a[0], a[1], extra);
const Rw = (a) => a[0] / a[1];
const Rteller = (n) => { let t; do { t = rnd(1, n - 1); } while (ggd(t, n) !== 1); return t; };
const Rwil = (nmax = 9, neg = true) => { const n = rnd(2, nmax), t = Rteller(n); return R(neg && kies([true, false]) ? -t : t, n); };
const Rnoemer = (lijst, neg = true) => { const n = kies(lijst), t = Rteller(n) * (Math.random() < 0.3 ? rnd(1, 2) : 1); const a = R(t, n); return neg && Math.random() < 0.5 ? R(-a[0], a[1]) : a; };
const klein = (a, m = 200) => Math.abs(a[0]) <= m && a[1] <= m;
const BREUK_TYPEN = `<div class="kader"><div class="kader-titel">Zo typ je</div><p>Een breuk typ je met <code>/</code>: <code>-7/12</code> geeft $-\\frac{7}{12}$. Geef het antwoord altijd <b>onvereenvoudigbaar</b>; is het een geheel getal, typ dan gewoon dat getal.</p></div>`;
const PLUS_KADER = (tekst) => `<div class="kader werk"><div class="kader-titel">ℚ + · Extra uitdaging</div>${tekst}</div>`;
const VOLGORDE = `<div class="kader def"><div class="kader-titel">Volgorde van de bewerkingen</div>
  <ol><li><b>Haakjes</b>, van binnen naar buiten: eerst $( \\; )$, dan $[ \\; ]$.</li><li><b>Machten en wortels.</b></li><li><b>Vermenigvuldigen en delen</b>, van links naar rechts.</li><li><b>Optellen en aftrekken</b>, van links naar rechts.</li></ol></div>`;

// ---- decimale vorm van t/n
function decimaleVorm(t, n) {
  const neg = t < 0; t = Math.abs(t);
  const geheel = Math.floor(t / n); let rest = t % n; const cijfers = [], gezien = new Map(); let start = -1;
  while (rest !== 0 && cijfers.length < 40) {
    if (gezien.has(rest)) { start = gezien.get(rest); break; }
    gezien.set(rest, cijfers.length); rest *= 10; cijfers.push(Math.floor(rest / n)); rest %= n;
  }
  const voor = start < 0 ? cijfers.join('') : cijfers.slice(0, start).join(''), per = start < 0 ? '' : cijfers.slice(start).join('');
  const tex = `${neg ? '-' : ''}${geheel}${cijfers.length ? '{,}' + voor + (per ? `\\overline{${per}}` : '') : ''}`;
  const soort = start < 0 ? 'B' : voor === '' ? 'ZR' : 'GR';
  return { tex, soort, voor, per };
}
const VORMEN = [{ k: 'B', l: '\\text{begrensd}' }, { k: 'ZR', l: '\\text{zuiver repeterend}' }, { k: 'GR', l: '\\text{gemengd repeterend}' }];
const VORM_NAAM = { B: 'begrensd', ZR: 'zuiver repeterend', GR: 'gemengd repeterend' };
const factorTex = (n) => { const f = []; let m = n; for (let p = 2; m > 1; p++) while (m % p === 0) { f.push(p); m /= p; } return f.join(' \\cdot '); };

// ---- verhoudingstabel (HTML) en als TeX
function verhoudingstabel(namen, kolommen, bewerking) {
  return `<table class="tabel verhouding"><tr><th>${namen[0]}</th>${kolommen.map(c => `<td>${c[0]}</td>`).join('')}</tr>
    <tr><th>${namen[1]}</th>${kolommen.map(c => `<td>${c[1]}</td>`).join('')}</tr></table>${bewerking ? `<p class="klein midden">${bewerking}</p>` : ''}`;
}
const vtNaam = (x) => x.includes('^') ? `\\text{${x.split('^')[0]}}^{${x.split('^')[1]}}` : `\\text{${x.replace(/%/g, '\\%')}}`;
const vtTex = (namen, kolommen) => `\\begin{array}{l|${'c'.repeat(kolommen.length)}} ${vtNaam(namen[0])} & ${kolommen.map(c => c[0]).join(' & ')} \\\\ \\hline ${vtNaam(namen[1])} & ${kolommen.map(c => c[1]).join(' & ')} \\end{array}`;

// ---- getallenas met punten (SVG), elke eenheid in 'deel' stukjes
function getallenas(punten, min, max, opt = {}) {
  const deel = opt.deel || 1, u = opt.u || (deel > 1 ? Math.max(14, Math.round(300 / ((max - min) * deel))) * deel : 40), x0 = 24;
  const w = x0 * 2 + (max - min) * u, hh = 64, y = 34;
  const X = (v) => x0 + (v - min) * u;
  let s = `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas" style="font-family:Verdana,sans-serif;max-width:100%">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let v = min; v <= max; v++) {
    s += `<line x1="${X(v)}" y1="${y - 7}" x2="${X(v)}" y2="${y + 7}" stroke="#555" stroke-width="1.4"/>`;
    s += `<text x="${X(v)}" y="${y + 24}" font-size="13" text-anchor="middle" fill="#333">${v < 0 ? '−' + (-v) : v}</text>`;
    if (deel > 1 && v < max) for (let k = 1; k < deel; k++) s += `<line x1="${X(v + k / deel)}" y1="${y - 4}" x2="${X(v + k / deel)}" y2="${y + 4}" stroke="#888"/>`;
  }
  for (const p of punten) s += `<circle cx="${X(p.x)}" cy="${y}" r="5" fill="#e8772e"/><text x="${X(p.x)}" y="${y - 12}" font-size="14" font-weight="bold" text-anchor="middle" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}
