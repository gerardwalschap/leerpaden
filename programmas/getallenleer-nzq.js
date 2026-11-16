// Programma 'getallenleer-nzq' — automatisch samengevoegd uit bron/getallenleer-nzq/ (niet rechtstreeks bewerken)
(() => {
// ===== Getallenleer 7VJHO: Rekenen in ℕ, ℤ en ℚ — gedeelde hulpmiddelen =====
// Drie aparte leerpaden in één bestand. Leidraad: de werkbundels "Natuurlijke getallen", "Gehele getallen"
// en "Rationale getallen" en de werkbladen in OneDrive › WISKUNDE 7VJHO › 1. GETALLENLEER (G. Walschap).
// Procenten en evenredigheden: altijd met een verhoudingstabel (wat je boven doet, doe je ook onder).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x, d = null) => W.texGetal(x, d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const kgv = (a, b) => a / ggd(a, b) * b;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kTekst = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const vt = (expr, tex, extra = {}) => ({ soort: 'veelterm', expr, vorm: 'uitgewerkt', tex, ...extra });
const br = (t, n, extra = {}) => { const g = ggd(t, n); return { soort: 'breuk', t: t / g * Math.sign(n), n: Math.abs(n / g), ...extra }; };
const fr = (t, n) => { const g = ggd(t, n); t = t / g * Math.sign(n); n = Math.abs(n / g); return n === 1 ? tg(t) : `${t < 0 ? '-' : ''}\\dfrac{${Math.abs(t)}}{${n}}`; };
const frRaw = (t, n) => `${t < 0 ? '-' : ''}\\dfrac{${Math.abs(t)}}{${n}}`;
const VERGELIJK = [{ k: '<', l: '<' }, { k: '>', l: '>' }, { k: '=', l: '=' }];
const vgl = (a, b) => Math.abs(a - b) < 1e-12 ? '=' : a < b ? '<' : '>';
const naarTekst = (x) => String(x).replace('.', ',');

// ---- verhoudingstabel (HTML) zoals in de werkbladen: hoeveelheid boven, procenten / tweede grootheid onder
function verhoudingstabel(namen, kolommen, bewerking) {
  return `<table class="tabel verhouding"><tr><th>${namen[0]}</th>${kolommen.map(c => `<td>${c[0]}</td>`).join('')}</tr>
    <tr><th>${namen[1]}</th>${kolommen.map(c => `<td>${c[1]}</td>`).join('')}</tr></table>${bewerking ? `<p class="klein midden">${bewerking}</p>` : ''}`;
}
// in de uitleg (TeX): een tabel als array
const vtTex = (namen, kolommen) => { const nm = namen.map(x => x.replace(/%/g, '\\%')); return `\\begin{array}{l|${'c'.repeat(kolommen.length)}} \\text{${nm[0]}} & ${kolommen.map(c => c[0]).join(' & ')} \\\\ \\hline \\text{${nm[1]}} & ${kolommen.map(c => c[1]).join(' & ')} \\end{array}`; };

// ---- getallenas met punten (SVG)
function getallenas(punten, min, max, opt = {}) {
  const deel = opt.deel || 1, u = opt.u || (deel > 1 ? Math.max(16, Math.round(300 / ((max - min) * deel))) * deel : 40), x0 = 24;
  const w = x0 * 2 + (max - min) * u, hh = 64, y = 34;
  const X = (v) => x0 + (v - min) * u;
  let s = `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas" style="font-family:Verdana,sans-serif">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let v = min; v <= max; v++) {
    s += `<line x1="${X(v)}" y1="${y - 7}" x2="${X(v)}" y2="${y + 7}" stroke="#555" stroke-width="1.4"/>`;
    s += `<text x="${X(v)}" y="${y + 24}" font-size="13" text-anchor="middle" fill="#333">${v < 0 ? '−' + (-v) : v}</text>`;
    if (deel > 1 && v < max) for (let k = 1; k < deel; k++) s += `<line x1="${X(v + k / deel)}" y1="${y - 4}" x2="${X(v + k / deel)}" y2="${y + 4}" stroke="#888"/>`;
  }
  for (const p of punten) s += `<circle cx="${X(p.x)}" cy="${y}" r="5" fill="#e8772e"/><text x="${X(p.x)}" y="${y - 12}" font-size="14" font-weight="bold" text-anchor="middle" fill="#e8772e">${p.label}</text>`;
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
  for (let i = -n; i <= n; i++) if (i) s += `<text x="${X(i)}" y="${o + 14}" font-size="10" text-anchor="middle" fill="#666">${i < 0 ? '−' + (-i) : i}</text><text x="${o - 5}" y="${Y(i) + 4}" font-size="10" text-anchor="end" fill="#666">${i < 0 ? '−' + (-i) : i}</text>`;
  for (const p of punten) s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="#e8772e"/><text x="${X(p.x) + 7}" y="${Y(p.y) - 7}" font-size="14" font-weight="bold" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}

// ---- mix-deel voor een eindtest
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
// ===================================================================
//  REKENEN IN ℕ (7VJHO) — slaagdrempel 90%
// ===================================================================

// ---- 1. bewerkingen en volgorde
const VOLGORDE = `<div class="kader def"><div class="kader-titel">Volgorde van de bewerkingen</div>
  <ol><li><b>Haakjes</b> eerst.</li><li><b>Machten, wortels en logaritmen.</b></li><li><b>Vermenigvuldigen en delen</b>, van links naar rechts.</li><li><b>Optellen en aftrekken</b>, van links naar rechts.</li></ol></div>`;
const NOTATIES = `<div class="kader eig"><div class="kader-titel">Machten, wortels en logaritmen</div>
  <table class="tabel"><tr><td>macht</td><td>$2^3 = 2 \\cdot 2 \\cdot 2 = 8$</td><td class="klein">grondtal 2, exponent 3</td></tr>
  <tr><td>vierkantswortel</td><td>$\\sqrt{49} = 7$</td><td class="klein">want $7^2 = 49$</td></tr>
  <tr><td>derdemachtswortel</td><td>$\\sqrt[3]{64} = 4$</td><td class="klein">want $4^3 = 64$</td></tr>
  <tr><td>logaritme</td><td>$\\log_2 8 = 3$</td><td class="klein">want $2^3 = 8$: tot welke macht moet je 2 verheffen om 8 te krijgen?</td></tr></table></div>`;
const NV = {
  kwadMin: () => { const a = rnd(5, 10), c = rnd(4, 9), d = rnd(1, c - 1), b = rnd(2, 4); if (a * a - b * (c - d) < 0) return null;
    return { tex: `${a}^2 - ${b} \\cdot (${c} - ${d})`, w: a * a - b * (c - d), L: [`= ${a * a} - ${b} \\cdot ${c - d}`, `= ${a * a} - ${b * (c - d)}`, `= ${a * a - b * (c - d)}`] }; },
  somKwad: () => { const a = rnd(2, 6), b = rnd(1, 4), c = rnd(2, 3); const w = (a + b) ** 2 - c ** 3; if (w < 0) return null;
    return { tex: `(${a} + ${b})^2 - ${c}^3`, w, L: [`= ${a + b}^2 - ${c}^3`, `= ${(a + b) ** 2} - ${c ** 3}`, `= ${w}`] }; },
  wortelMacht: () => { const k = rnd(3, 12), b = rnd(2, 4), e = b === 2 ? rnd(2, 5) : 3;
    return { tex: `\\sqrt{${k * k}} + ${b}^${e}`, w: k + b ** e, L: [`= ${k} + ${b ** e}`, `= ${k + b ** e}`] }; },
  deelHaak: () => { const a = rnd(2, 4), b = rnd(1, 6), d = a * a + b, q = rnd(2, 9);
    return { tex: `${d * q} : (${a}^2 + ${b})`, w: q, L: [`= ${d * q} : (${a * a} + ${b})`, `= ${d * q} : ${d}`, `= ${q}`] }; },
  haakKwad: () => { const a = rnd(2, 5), b = rnd(1, 6), c = rnd(2, 3), d = rnd(1, 9); const w = a * (b + c * c) - d; if (w < 0) return null;
    return { tex: `${a} \\cdot (${b} + ${c}^2) - ${d}`, w, L: [`= ${a} \\cdot (${b} + ${c * c}) - ${d}`, `= ${a} \\cdot ${b + c * c} - ${d}`, `= ${a * (b + c * c)} - ${d}`, `= ${w}`] }; },
  tweeWortels: () => { const p = rnd(5, 13), q = rnd(2, p - 1);
    return { tex: `\\sqrt{${p * p}} - \\sqrt{${q * q}}`, w: p - q, L: [`= ${p} - ${q}`, `= ${p - q}`] }; },
  machtPlusWortel: () => { const b = rnd(2, 3), e = b === 2 ? 4 : 2, k = rnd(4, 9), m = rnd(2, 5);
    return { tex: `${b}^${e} + \\sqrt{${k * k}} \\cdot ${m}`, w: b ** e + k * m, L: [`= ${b ** e} + ${k} \\cdot ${m}`, `= ${b ** e} + ${k * m}`, `= ${b ** e + k * m}`] }; },
  haakDerde: () => { const a = rnd(5, 11), b = a - kies([2, 3, 4]), d = a - b, c = kies([2, 4, 8].filter(x => (d ** 3) % x === 0));
    return { tex: `(${a} - ${b})^3 : ${c}`, w: d ** 3 / c, L: [`= ${d}^3 : ${c}`, `= ${d ** 3} : ${c}`, `= ${d ** 3 / c}`] }; },
  logs: () => { const b1 = kies([2, 3, 10]), e1 = b1 === 2 ? rnd(2, 5) : b1 === 3 ? rnd(2, 4) : rnd(1, 3), b2 = kies([2, 3, 4, 5]), e2 = rnd(1, 3);
    return { tex: `\\log_{${b1}} ${b1 ** e1} + \\log_{${b2}} ${b2 ** e2}`, w: e1 + e2, L: [`= ${e1} + ${e2} \\quad (${b1}^{${e1}} = ${b1 ** e1}, \\; ${b2}^{${e2}} = ${b2 ** e2})`, `= ${e1 + e2}`] }; },
  derdeWortel: () => { const k = rnd(2, 5), b = rnd(2, 3), e = b === 2 ? rnd(2, 4) : 2;
    return { tex: `\\sqrt[3]{${k ** 3}} + ${b}^${e}`, w: k + b ** e, L: [`= ${k} + ${b ** e}`, `= ${k + b ** e}`] }; },
  logMaal: () => { const b = kies([2, 3, 5]), e = b === 5 ? 2 : rnd(2, 3), m = rnd(2, 4), d = rnd(1, m * e); return { tex: `${m} \\cdot \\log_{${b}} ${b ** e} - ${d}`, w: m * e - d, L: [`= ${m} \\cdot ${e} - ${d}`, `= ${m * e} - ${d}`, `= ${m * e - d}`] }; },
  wortelMaalDerde: () => { const p = rnd(2, 10), q = rnd(2, 4), d = rnd(1, p * q); return { tex: `\\sqrt{${p * p}} \\cdot \\sqrt[3]{${q ** 3}} - ${d}`, w: p * q - d, L: [`= ${p} \\cdot ${q} - ${d}`, `= ${p * q} - ${d}`, `= ${p * q - d}`] }; },
};
function nVraag(soort, sleutels) {
  for (;;) { const r = NV[kies(sleutels)](); if (r && Number.isInteger(r.w) && r.w >= 0) return { soort, tex: `${r.tex} = \\;?`, antw: getal(r.w), uitleg: r.L }; }
}
const N1 = {
  nr: 1, titel: 'Bewerkingen en volgorde', kort: 'Haakjes, machten/wortels/logaritmen, maal/gedeeld door, plus/min.', rekenmachine: false,
  opdracht: 'Bereken zonder rekentoestel. Let op de volgorde van de bewerkingen.',
  theorie: `${VOLGORDE}${NOTATIES}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$6^2 - 4 \\cdot (7 - 3) = 36 - 4 \\cdot 4 = 36 - 16 = 20$</p>
      <p class="klein">Eerst de haakjes ($7 - 3 = 4$), dan de macht ($6^2 = 36$), dan de vermenigvuldiging, en tot slot de aftrekking.</p></div>`,
  voorbeelden: [
    { tex: '(5 + 3)^2 - 2^3', stappen: ['= 8^2 - 2^3', '= 64 - 8', '= 56'] },
    { tex: '2^4 + \\sqrt{36} \\cdot 2', stappen: ['= 16 + 6 \\cdot 2', '= 16 + 12', '= 28'] },
    { tex: '\\log_2 16 + \\log_4 16 - 3', stappen: ['= 4 + 2 - 3 \\quad (2^4 = 16, \\; 4^2 = 16)', '= 3'] },
  ],
  soorten: {
    basis: { naam: 'Haakjes, machten en volgorde', gen() { return nVraag('basis', ['kwadMin', 'somKwad', 'deelHaak', 'haakKwad', 'haakDerde']); } },
    wortel: { naam: 'Met wortels', gen() { return nVraag('wortel', ['wortelMacht', 'tweeWortels', 'machtPlusWortel', 'derdeWortel', 'wortelMaalDerde']); } },
    log: { naam: 'Met logaritmen', gen() { return nVraag('log', ['logs', 'logMaal']); } },
  },
  oefenMix: [['basis', 3], ['wortel', 2], ['log', 1]],
  test: [['basis', 4], ['wortel', 4], ['log', 2]], testSchudden: true,
};

// ---- 2. eentermen en veeltermen
const NV2 = [
  () => { const p = rnd(2, 9), q = rnd(1, 9), r = rnd(1, 9), l = kies(['a', 'x']); return { tex: `${p}${l} + ${q}${l} + ${r}${l}`, e: `${p}${l}+${q}${l}+${r}${l}`, j: `${p + q + r}${l}` }; },
  () => { const p = rnd(2, 8), q = rnd(1, 8), r = rnd(1, 8), s = rnd(1, 8); return { tex: `${p}x + ${q}y + ${r}x + ${s === 1 ? '' : s}y`, e: `${p}x+${q}y+${r}x+${s}y`, j: `${p + r}x + ${q + s}y` }; },
  () => { const p = rnd(2, 9), q = rnd(1, 9); return { tex: `${p} \\cdot (${q} + a)`, e: `${p}*(${q}+a)`, j: `${p * q} + ${p}a` }; },
  () => { const p = rnd(2, 5), q = rnd(2, 5), r = rnd(2, 4); return { tex: `${p} \\cdot (a + b) + ${q} \\cdot (a + ${r}b)`, e: `${p}*(a+b)+${q}*(a+${r}b)`, j: `${p + q}a + ${p + q * r}b` }; },
  () => { const c = rnd(2, 12), p = rnd(2, 6), q = rnd(2, 5), r = rnd(1, 6); return { tex: `${c} + ${p}a + ${q} \\cdot (${r} + a)`, e: `${c}+${p}a+${q}*(${r}+a)`, j: `${c + q * r} + ${p + q}a` }; },
  () => { const p = rnd(2, 6), q = rnd(2, 6), r = rnd(2, 6); return { tex: `${p}a + a \\cdot ${q}a + ${r}b`, e: `${p}a+a*${q}a+${r}b`, j: `${q}a^2 + ${p}a + ${r}b` }; },
  () => { const p = rnd(2, 4), q = rnd(2, 4), r = rnd(2, 6); return { tex: `${p}a \\cdot ${q}b + ${r}ab - ab`, e: `${p}a*${q}b+${r}ab-ab`, j: `${p * q + r - 1}ab` }; },
  () => { const p = rnd(3, 8), q = rnd(1, 5), r = rnd(1, p - 1); return { tex: `${p}a^2 + ${q}a \\cdot a - ${r}a^2`, e: `${p}a^2+${q}a*a-${r}a^2`, j: `${p + q - r}a^2` }; },
];
const GW = [
  { tex: '2a + 3b - c', f: (a, b, c) => 2 * a + 3 * b - c, L: (a, b, c) => `= 2 \\cdot ${a} + 3 \\cdot ${b} - ${c} = ${2 * a + 3 * b - c}` },
  { tex: 'a^2 + b^2 + c^2', f: (a, b, c) => a * a + b * b + c * c, L: (a, b, c) => `= ${a}^2 + ${b}^2 + ${c}^2 = ${a * a} + ${b * b} + ${c * c} = ${a * a + b * b + c * c}` },
  { tex: 'a \\cdot b \\cdot c + 2a', f: (a, b, c) => a * b * c + 2 * a, L: (a, b, c) => `= ${a} \\cdot ${b} \\cdot ${c} + 2 \\cdot ${a} = ${a * b * c} + ${2 * a} = ${a * b * c + 2 * a}` },
  { tex: '3a + 2 \\cdot (b + c)', f: (a, b, c) => 3 * a + 2 * (b + c), L: (a, b, c) => `= 3 \\cdot ${a} + 2 \\cdot (${b} + ${c}) = ${3 * a} + ${2 * (b + c)} = ${3 * a + 2 * (b + c)}` },
  { tex: 'a^2 - b \\cdot c', f: (a, b, c) => a * a - b * c, L: (a, b, c) => `= ${a}^2 - ${b} \\cdot ${c} = ${a * a} - ${b * c} = ${a * a - b * c}` },
];
const EENTERM = `<div class="kader def"><div class="kader-titel">Eentermen en veeltermen</div>
  <p>Een <b>eenterm</b> is een getal maal letters, bv. $5a$, $3ab$, $2a^2$. Het getal heet de <b>coëfficiënt</b>, de letters het <b>lettergedeelte</b>.</p>
  <p><b>Gelijksoortige eentermen</b> hebben hetzelfde lettergedeelte: $3a$ en $5a$ wel, $3a$ en $5a^2$ niet. Enkel gelijksoortige eentermen kan je samentellen: $3a + 5a = 8a$.</p>
  <p>Een <b>veelterm</b> is een som van eentermen, bv. $2a + 5a^2 + 3b$.</p></div>
  <div class="kader eig"><div class="kader-titel">Vereenvoudigen</div>
  <ul><li>Werk haakjes uit: $5 \\cdot (2 + a) = 10 + 5a$ (elke term binnen de haakjes vermenigvuldigen).</li>
  <li>Vermenigvuldig eentermen: $a \\cdot 5a = 5a^2$, $\\; 3a \\cdot 2b = 6ab$.</li>
  <li>Tel gelijksoortige eentermen samen: $4x + 3y + 2x + y = 6x + 4y$.</li></ul></div>
  <div class="kader"><div class="kader-titel">Zo typ je</div><p>Typ bv. <code>6x + 4y</code>, <code>5a^2 + 2a + 3b</code> of met de knop: <code>5a² + 2a + 3b</code>.</p></div>`;
const N2 = {
  nr: 2, titel: 'Eentermen en veeltermen', kort: 'Gelijksoortige termen samentellen, haakjes uitwerken, getalwaarde.', rekenmachine: false,
  theorie: `${EENTERM}<div class="kader werk"><div class="kader-titel">Getalwaarde</div>
    <p>Vervang elke letter door het gegeven getal en reken uit (volgorde van de bewerkingen!).</p>
    <p class="midden">$a = 3, \\; b = 2, \\; c = 1$: &nbsp; $2a + 3b - c = 2 \\cdot 3 + 3 \\cdot 2 - 1 = 6 + 6 - 1 = 11$</p>
    <p class="klein">Soms is het handig om eerst te vereenvoudigen: $3a + 2a + 5b - b = 5a + 4b$, en pas dan in te vullen.</p></div>`,
  voorbeelden: [
    { tex: '3 \\cdot (a + b) + 2 \\cdot (a + 2b)', stappen: ['= 3a + 3b + 2a + 4b', '= 5a + 7b'] },
    { tex: 'a \\cdot 4 + a + b \\cdot a + 3b + 2a', stappen: ['= 4a + a + ab + 3b + 2a', '= 7a + ab + 3b'] },
    { tex: '5a^2 + 3a \\cdot a - 2a^2', stappen: ['= 5a^2 + 3a^2 - 2a^2', '= 6a^2'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Vereenvoudigen', opdracht: 'Vereenvoudig.', gen() { const r = kies(NV2)(); return { soort: 'vereenvoudig', opdracht: 'Vereenvoudig.', tex: r.tex, antw: vt(r.e, r.j), uitleg: [`= ${r.j}`] }; } },
    getalwaarde: { naam: 'Getalwaarde', gen() {
      for (;;) { const a = rnd(1, 6), b = rnd(1, 6), c = rnd(0, 4), G = kies(GW), w = G.f(a, b, c); if (w < 0) continue;
        return { soort: 'getalwaarde', opdracht: 'Bereken de getalwaarde.', tex: `${G.tex} \\quad \\text{voor } a = ${a}, \\; b = ${b}, \\; c = ${c}`, antw: getal(w), uitleg: [G.L(a, b, c)] }; }
    } },
    eerstVereenvoudig: { naam: 'Eerst vereenvoudigen, dan berekenen', gen() {
      const p = rnd(2, 5), q = rnd(1, 5), r = rnd(2, 6), s = rnd(1, r - 1), a = rnd(1, 6), b = rnd(1, 5);
      return { soort: 'eerstVereenvoudig', opdracht: 'Vereenvoudig eerst, bereken dan de getalwaarde.', tex: `${p}a + ${q}a + ${r}b - ${s === 1 ? '' : s}b \\quad \\text{voor } a = ${a}, \\; b = ${b}`,
        antw: getal((p + q) * a + (r - s) * b), uitleg: [`\\text{vereenvoudigen: } ${p + q}a + ${r - s}b`, `= ${p + q} \\cdot ${a} + ${r - s} \\cdot ${b} = ${(p + q) * a} + ${(r - s) * b} = ${(p + q) * a + (r - s) * b}`] };
    } },
  },
  oefenMix: [['vereenvoudig', 4], ['getalwaarde', 2], ['eerstVereenvoudig', 1]],
  test: [['vereenvoudig', 6], ['getalwaarde', 3], ['eerstVereenvoudig', 1]], testSchudden: true,
};

// ---- 3. getallenas en ordenen
function eenvoudigeBewerking() {
  return kies([
    () => { const a = rnd(2, 9), b = rnd(2, 9); return { tex: `${a} \\cdot ${b}`, w: a * b }; },
    () => { const b = rnd(2, 9), q = rnd(2, 12); return { tex: `${b * q} : ${b}`, w: q }; },
    () => { const a = rnd(2, 15), b = rnd(2, 15); return { tex: `${a} + ${b}`, w: a + b }; },
    () => { const a = rnd(3, 9); return { tex: `${a}^2`, w: a * a }; },
    () => { const a = rnd(3, 10); return { tex: `\\sqrt{${a * a}}`, w: a }; },
    () => { const a = rnd(2, 3); return { tex: `${a}^3`, w: a ** 3 }; },
    () => { const a = rnd(10, 40); return { tex: `${a}`, w: a }; },
  ])();
}
const N3 = {
  nr: 3, titel: 'Getallenas en ordenen', kort: 'Getallen aflezen, vergelijken (<, >, =) en oplossingen in ℕ opsommen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De getallenas</div>
      <p>Op een getallenas staan de natuurlijke getallen op gelijke afstanden van elkaar, van klein (links) naar groot (rechts).</p>
      ${getallenas([{ x: 3, label: 'A' }, { x: 7, label: 'B' }, { x: 10, label: 'C' }], 0, 12)}
      <p class="klein midden">$A = 3$, $B = 7$, $C = 10$</p></div>
    <div class="kader eig"><div class="kader-titel">Vergelijken</div>
      <p>$<$ kleiner dan &nbsp; · &nbsp; $>$ groter dan &nbsp; · &nbsp; $=$ gelijk aan. &nbsp; Reken eerst beide kanten uit: $3 \\cdot 4 = 12 > 10 = 20 : 2$.</p></div>
    <div class="kader eig"><div class="kader-titel">Oplossingen in ℕ opsommen</div>
      <p>Welke natuurlijke getallen voldoen aan $4 \\leq x < 10$? &nbsp; $V = \\{4 ; 5 ; 6 ; 7 ; 8 ; 9\\}$</p>
      <p class="klein">$\\leq$ en $\\geq$: de grens hoort erbij. $<$ en $>$: de grens hoort er niet bij. Vergeet $0$ niet: $x < 4$ geeft $V = \\{0 ; 1 ; 2 ; 3\\}$.</p></div>
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Scheid de getallen met een puntkomma: <code>4 ; 5 ; 6 ; 7 ; 8 ; 9</code>.</p></div>`,
  voorbeelden: [
    { tex: '\\sqrt{49} \\;\\ldots\\; 3^2', stappen: ['\\sqrt{49} = 7 \\text{ en } 3^2 = 9', '7 < 9'] },
    { tex: '7 + 3 \\leq x < 2 \\cdot 8 \\text{ in } \\mathbb{N}', stappen: ['10 \\leq x < 16', 'V = \\{10 ; 11 ; 12 ; 13 ; 14 ; 15\\}'] },
  ],
  soorten: {
    vergelijk: { naam: 'Vergelijken', gen() {
      const a = eenvoudigeBewerking(); let b; do { b = eenvoudigeBewerking(); } while (b.tex === a.tex || Math.abs(a.w - b.w) > 12);
      return { soort: 'vergelijk', opdracht: 'Vul in: <, > of =.', tex: `${a.tex} \\;\\ldots\\; ${b.tex}`, antw: keuze(VERGELIJK, vgl(a.w, b.w)), uitleg: [`${a.tex} = ${a.w} \\text{ en } ${b.tex} = ${b.w}`, `${a.tex} ${vgl(a.w, b.w)} ${b.tex}`] };
    } },
    opsommen: { naam: 'Oplossingen in ℕ opsommen', gen() {
      const a = rnd(1, 12), n = rnd(1, 6), soort = kies(['<<', '<=<', '<<=', '<=<=', 'x<']);
      let lo, hi, tex;
      if (soort === 'x<') { hi = rnd(2, 6); lo = 0; tex = `x < ${hi}`; hi -= 1; }
      else {
        const L = a, R = a + n + 1;
        const li = soort === '<=<' || soort === '<=<=', ri = soort === '<<=' || soort === '<=<=';
        tex = `${L} ${li ? '\\leq' : '<'} x ${ri ? '\\leq' : '<'} ${R}`; lo = li ? L : L + 1; hi = ri ? R : R - 1;
      }
      const w = []; for (let k = lo; k <= hi; k++) w.push(k);
      return { soort: 'opsommen', opdracht: 'Welke natuurlijke getallen voldoen? Noteer de oplossingsverzameling.', tex: `${tex} \\quad (x \\in \\mathbb{N})`, antw: { soort: 'Vmeer', waarden: w, dec: 0 },
        uitleg: [soort === 'x<' ? '\\text{vergeet } 0 \\text{ niet!}' : `\\text{de grenzen horen er${soort === '<=<=' ? ' allebei' : soort === '<<' ? ' niet' : ' half'} bij}`, `V = \\{${w.join(' ; ')}\\}`] };
    } },
    aflezen: { naam: 'Aflezen op de getallenas', gen() {
      const x = rnd(1, 11);
      return { soort: 'aflezen', opdracht: 'Welk getal stelt het punt A voor?', html: getallenas([{ x, label: 'A' }], 0, 12), sleutel: 'as' + x, rapport: `punt A op ${x}`, antw: getal(x, { voor: 'A =' }), uitleg: [`A = ${x}`] };
    } },
  },
  oefenMix: [['vergelijk', 3], ['opsommen', 3], ['aflezen', 1]],
  test: [['vergelijk', 4], ['opsommen', 5], ['aflezen', 1]], testSchudden: true,
};

// ---- 4. procenten (verhoudingstabel)
const PROCENTEN = `<div class="kader def"><div class="kader-titel">Procenten met een verhoudingstabel</div>
  <p>Een percentage is een verhouding vergeleken met 100. Zet de gegevens in een <b>verhoudingstabel</b>: <b>wat je boven doet, doe je ook onder</b>.</p>
  <p>Voorbeeld: $25\\%$ van $96$</p>
  ${verhoudingstabel(['%', 'aantal'], [['100', '96'], ['25', '24']], 'bewerking: boven en onder $: 4$')}
  <p class="midden">$25\\%$ van $96$ is $24$.</p></div>
  <div class="kader eig"><div class="kader-titel">Handige stappen</div>
  <table class="tabel"><tr><td>$50\\%$</td><td>$: 2$</td><td>$25\\%$</td><td>$: 4$</td><td>$20\\%$</td><td>$: 5$</td></tr>
  <tr><td>$10\\%$</td><td>$: 10$</td><td>$5\\%$</td><td>$: 20$</td><td>$1\\%$</td><td>$: 100$</td></tr></table>
  <p class="klein">$75\\%$: eerst $: 4$ (25%), dan $\\cdot 3$. &nbsp; $150\\%$: $100\\% + 50\\%$.</p></div>`;
function procentStappen(p) { // van 100% naar p%: deel door d, vermenigvuldig met m
  const g = ggd(100, p), d = 100 / g, m = p / g;
  return { d, m };
}
function procentVan(p, y) {
  const { d, m } = procentStappen(p);
  const kol = [['100', tg(y)]];
  if (m !== 1 && d !== 1) kol.push([tg(100 / d), tg(y / d)]);
  kol.push([tg(p), tg(y / d * m)]);
  const bew = d !== 1 && m !== 1 ? `: ${d} \\text{ en } \\cdot ${m}` : d !== 1 ? `: ${d}` : `\\cdot ${m}`;
  return { w: y / d * m, tabel: vtTex(['%', 'aantal'], kol), bew };
}
const P_WAARDEN = [10, 20, 25, 50, 5, 75, 150, 4, 30, 40, 60];
function pEnY() { for (;;) { const p = kies(P_WAARDEN), { d } = procentStappen(p), y = d * rnd(2, Math.floor(400 / d)); if (y <= 600) return { p, y }; } }
const PROCENTVRAAG = [
  () => { const prijs = kies([40, 60, 80, 120, 160, 200, 240]), p = kies([10, 20, 25, 50]); const r = procentVan(p, prijs);
    return { tekst: `Een artikel kost € ${prijs}. Er is ${p}% korting. Wat is de nieuwe prijs?`, w: prijs - r.w, na: '\\text{ euro}', L: [r.tabel, `\\text{korting: } ${tg(r.w)} \\text{ euro}`, `${prijs} - ${tg(r.w)} = ${tg(prijs - r.w)} \\text{ euro}`] }; },
  () => { const prijs = kies([200, 240, 300, 400, 160]), p = kies([5, 10, 15, 20, 25]); const r = procentVan(p, prijs);
    if (!Number.isInteger(r.w)) return null;
    return { tekst: `Een fiets kost € ${prijs}. De prijs stijgt met ${p}%. Wat is de nieuwe prijs?`, w: prijs + r.w, na: '\\text{ euro}', L: [r.tabel, `\\text{stijging: } ${tg(r.w)} \\text{ euro}`, `${prijs} + ${tg(r.w)} = ${tg(prijs + r.w)} \\text{ euro}`] }; },
  () => { const oud = kies([40, 80, 120, 160, 200, 60]), p = kies([10, 20, 25, 50]), dal = oud * p / 100; if (!Number.isInteger(dal)) return null;
    const d = oud / dal;
    return { tekst: `Een tas kost normaal € ${oud}, je betaalt € ${oud - dal}. Met hoeveel procent is de prijs gedaald?`, w: p, na: '\\%', L: [`\\text{daling: } ${oud} - ${oud - dal} = ${dal} \\text{ euro}`, vtTex(['euro', '%'], [[oud, '100'], [dal, p]]), `\\text{bewerking: } : ${tg(d)} \\Rightarrow ${p}\\%`] }; },
  () => { const n = kies([200, 300, 400, 500, 600]), p = kies([40, 60, 30, 70, 45, 55]); const r = procentVan(p, n);
    if (!Number.isInteger(r.w)) return null;
    return { tekst: `Een school telt ${n} leerlingen, waarvan ${p}% meisjes. Hoeveel jongens zijn er?`, w: n - r.w, na: '\\text{ jongens}', L: [r.tabel, `\\text{meisjes: } ${tg(r.w)}`, `\\text{jongens: } ${n} - ${tg(r.w)} = ${tg(n - r.w)}`] }; },
  () => { const k = kies([200, 300, 500, 400, 1000]), p = kies([2, 3, 4, 5]); const r = procentVan(p, k);
    return { tekst: `Op een spaarrekening staat € ${k}. Je krijgt ${p}% intrest per jaar. Hoeveel staat er na 1 jaar op de rekening?`, w: k + r.w, na: '\\text{ euro}', L: [r.tabel, `\\text{intrest: } ${tg(r.w)} \\text{ euro}`, `${k} + ${tg(r.w)} = ${tg(k + r.w)} \\text{ euro}`] }; },
  () => { const n = kies([50, 100, 150, 200, 250]), p = kies([2, 4, 6, 8, 10]); const r = procentVan(p, n); if (!Number.isInteger(r.w)) return null;
    return { tekst: `Van de ${n} appels in een krat is ${p}% rot. Hoeveel appels zijn nog goed?`, w: n - r.w, na: '\\text{ appels}', L: [r.tabel, `\\text{rot: } ${tg(r.w)}`, `\\text{goed: } ${n} - ${tg(r.w)} = ${tg(n - r.w)}`] }; },
];
const N4 = {
  nr: 4, titel: 'Procenten', kort: 'x% van een getal met een verhoudingstabel, en vraagstukken.', rekenmachine: false,
  theorie: `${PROCENTEN}<div class="kader werk"><div class="kader-titel">Vraagstuk</div>
    <p>Een broek kost € 80. Er is 25% korting. Wat is de nieuwe prijs?</p>
    ${verhoudingstabel(['%', 'euro'], [['100', '80'], ['25', '20']], 'bewerking: $: 4$')}
    <p>Korting: € 20. Nieuwe prijs: $80 - 20 = 60$ euro.</p></div>`,
  voorbeelden: [
    { tex: '75\\% \\text{ van } 64', stappen: [vtTex(['%', 'aantal'], [['100', '64'], ['25', '16'], ['75', '48']]), '\\text{bewerking: } : 4 \\text{ en } \\cdot 3', '75\\% \\text{ van } 64 = 48'] },
    { tex: '\\text{Een fiets kost 240 euro. De prijs stijgt met 15\\%. Nieuwe prijs?}', stappen: [vtTex(['%', 'euro'], [['100', '240'], ['5', '12'], ['15', '36']]), '\\text{stijging: 36 euro}', '240 + 36 = 276 \\text{ euro}'] },
  ],
  soorten: {
    van: { naam: 'x% van een getal', gen() { const { p, y } = pEnY(), r = procentVan(p, y);
      return { soort: 'van', opdracht: 'Bereken met een verhoudingstabel.', tex: `${p}\\% \\text{ van } ${y}`, antw: getal(r.w), uitleg: [r.tabel, `\\text{bewerking: } ${r.bew}`, `${p}\\% \\text{ van } ${y} = ${tg(r.w)}`] }; } },
    vraagstuk: { naam: 'Vraagstukken', gen() {
      for (;;) { const r = kies(PROCENTVRAAG)(); if (!r || !Number.isInteger(r.w)) continue;
        return { soort: 'vraagstuk', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { na: r.na }), uitleg: r.L }; }
    } },
  },
  oefenMix: [['van', 3], ['vraagstuk', 2]],
  test: [['van', 5], ['vraagstuk', 5]], testSchudden: true,
};

// ---- 5. evenredigheden (verhoudingstabel)
const RECHT = [
  ['Een auto verbruikt {a} liter benzine per {b} km. Hoeveel liter verbruikt hij voor {c} km?', 'km', 'liter', 'liter', 'b'],
  ['Een drukker drukt {b} pagina\'s in {a} minuten. Hoeveel pagina\'s drukt hij in {c} minuten (zelfde tempo)?', 'minuten', 'pagina\'s', 'pagina\'s', 'a'],
  ['{a} kg tomaten kosten € {b}. Hoeveel kosten {c} kg?', 'kg', 'euro', 'euro', 'a'],
  ['Een fabriek verpakt {b} dozen in {a} uur. Hoeveel dozen verpakt ze in {c} uur?', 'uur', 'dozen', 'dozen', 'a'],
  ['Een trein legt {b} km af in {a} uur. Hoeveel km legt hij af in {c} uur (constante snelheid)?', 'uur', 'km', 'km', 'a'],
  ['Een kraan levert {b} liter water in {a} minuten. Hoeveel liter in {c} minuten?', 'minuten', 'liter', 'liter', 'a'],
];
const OMGEKEERD = [
  ['{a} machines vullen samen een bestelling in {b} uur. Hoeveel uur hebben {c} machines nodig?', 'machines', 'uur', 'uur'],
  ['{a} schilders schilderen een gebouw in {b} dagen. Hoeveel dagen hebben {c} schilders nodig?', 'schilders', 'dagen', 'dagen'],
  ['Een tank wordt met {a} pompen leeggepompt in {b} uur. Hoeveel uur duurt het met {c} pompen?', 'pompen', 'uur', 'uur'],
  ['{a} vrijwilligers pakken in {b} uur alle pakjes in. Hoeveel uur hebben {c} vrijwilligers nodig?', 'vrijwilligers', 'uur', 'uur'],
  ['{a} arbeiders bouwen een brug in {b} dagen. Hoeveel dagen hebben {c} arbeiders nodig?', 'arbeiders', 'dagen', 'dagen'],
];
const vul = (t, o) => t.replace(/\{(\w)\}/g, (_, k) => o[k]);
function rechtVraag() {
  const [t, n1, n2, eenh, wie] = kies(RECHT);
  for (;;) {
    // a eenheden ↔ b; gevraagd: c eenheden. Tussenstap via g = ggd(a, c).
    const a = wie === 'b' ? 100 : kies([3, 4, 5, 6, 8, 9, 10, 12, 15]), c = rnd(2, 40) * (a === 100 ? 25 : 1), g = ggd(a, c);
    const per = rnd(2, 12), b = a / g * per; // b/a·c = per·c/g  geheel
    if (c === a || c > 400) continue;
    const w = per * c / g;
    const o = wie === 'b' ? { a: b, b: a, c } : { a, b, c };
    const kol = [[a, b], [g, per]]; if (c !== g) kol.push([c, w]);
    return { tekst: vul(t, o), w, L: ['\\text{recht evenredig (hoe meer, hoe meer)}', vtTex([n1, n2], kol), `\\text{bewerking: boven en onder } : ${a / g}${c !== g ? ` \\text{ en } \\cdot ${c / g}` : ''}`, `${tg(w)} \\text{ ${eenh}}`], na: `\\text{ ${eenh}}` };
  }
}
function omgekeerdVraag() {
  const [t, n1, n2, eenh] = kies(OMGEKEERD);
  for (;;) {
    const a = rnd(2, 20), b = rnd(3, 40), c = rnd(2, 30), p = a * b;
    if (c === a || p % c) continue;
    const w = p / c, g = ggd(a, c);
    const kol = [[a, b], [g, b * a / g]]; if (c !== g) kol.push([c, w]);
    return { tekst: vul(t, { a, b, c }), w, L: ['\\text{omgekeerd evenredig (hoe meer, hoe minder)}', vtTex([n1, n2], kol), `\\text{boven } : ${a / g}${c !== g ? ` \\text{ en } \\cdot ${c / g}` : ''} \\Rightarrow \\text{ onder } \\cdot ${a / g}${c !== g ? ` \\text{ en } : ${c / g}` : ''}`, `${tg(w)} \\text{ ${eenh}}`], na: `\\text{ ${eenh}}` };
  }
}
const EVENREDIG = `<div class="kader def"><div class="kader-titel">Rechte evenredigheid</div>
    <p><b>Hoe meer, hoe meer.</b> Wat je boven doet, doe je ook onder.</p>
    <p>4 schriften kosten € 10. Hoeveel kosten 6 schriften?</p>
    ${verhoudingstabel(['schriften', 'euro'], [['4', '10'], ['2', '5'], ['6', '15']], 'boven en onder: $: 2$ en $\\cdot 3$')}</div>
  <div class="kader def"><div class="kader-titel">Omgekeerde evenredigheid</div>
    <p><b>Hoe meer, hoe minder.</b> Doe je boven maal, dan doe je onder gedeeld door (en omgekeerd).</p>
    <p>Met 6 schilders is een gebouw in 8 dagen geschilderd. Hoeveel dagen met 4 schilders?</p>
    ${verhoudingstabel(['schilders', 'dagen'], [['6', '8'], ['2', '24'], ['4', '12']], 'boven $: 3$ en $\\cdot 2$, onder $\\cdot 3$ en $: 2$')}</div>`;
const N5 = {
  nr: 5, titel: 'Evenredigheden', kort: 'Recht of omgekeerd evenredig? Los op met een verhoudingstabel.', rekenmachine: false,
  theorie: EVENREDIG,
  voorbeelden: [
    { tex: '\\text{9 kg tomaten kosten 18 euro. Hoeveel kosten 14 kg?}', stappen: ['\\text{recht evenredig}', vtTex(['kg', 'euro'], [[9, 18], [1, 2], [14, 28]]), '\\text{14 kg kosten 28 euro}'] },
    { tex: '\\text{6 machines: 20 uur. Hoeveel uur met 15 machines?}', stappen: ['\\text{omgekeerd evenredig}', vtTex(['machines', 'uur'], [[6, 20], [3, 40], [15, 8]]), '\\text{boven } : 2 \\text{ en } \\cdot 5 \\Rightarrow \\text{ onder } \\cdot 2 \\text{ en } : 5', '\\text{8 uur}'] },
  ],
  soorten: {
    soortVerband: { naam: 'Recht of omgekeerd?', gen() {
      const recht = kies([true, false]), r = recht ? rechtVraag() : omgekeerdVraag();
      return { soort: 'soortVerband', opdracht: 'Is dit een rechte of een omgekeerde evenredigheid? Los daarna op.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: 's' + r.tekst, rapport: r.tekst,
        antw: { soort: 'delen', delen: [{ label: '\\text{evenredigheid:}', antw: keuze(kTekst(['recht', 'omgekeerd']), recht ? 0 : 1) }, { label: '\\text{antwoord:}', antw: getal(r.w, { voor: '', na: r.na }) }] }, uitleg: r.L };
    } },
    recht: { naam: 'Rechte evenredigheid', gen() { const r = rechtVraag(); return { soort: 'recht', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { na: r.na }), uitleg: r.L }; } },
    omgekeerd: { naam: 'Omgekeerde evenredigheid', gen() { const r = omgekeerdVraag(); return { soort: 'omgekeerd', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { na: r.na }), uitleg: r.L }; } },
  },
  oefenMix: [['recht', 2], ['omgekeerd', 2], ['soortVerband', 1]],
  test: [['recht', 4], ['omgekeerd', 4], ['soortVerband', 2]], testSchudden: true,
};

const N6 = {
  nr: 6, titel: 'Eindtest rekenen in ℕ', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van ℕ door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${VOLGORDE}`,
  voorbeelden: [],
  soorten: { b: mix(N1, 'basis'), w: mix(N1, 'wortel'), l: mix(N1, 'log'), v: mix(N2, 'vereenvoudig'), g: mix(N2, 'getalwaarde'), o: mix(N3, 'opsommen'), c: mix(N3, 'vergelijk'), p: mix(N4, 'van'), pv: mix(N4, 'vraagstuk'), r: mix(N5, 'recht'), om: mix(N5, 'omgekeerd') },
  oefenMix: [['b', 1], ['w', 1], ['l', 1], ['v', 1], ['g', 1], ['o', 1], ['c', 1], ['p', 1], ['pv', 1], ['r', 1], ['om', 1]],
  test: [['b', 1], ['w', 1], ['l', 1], ['v', 1], ['g', 1], ['o', 1], ['p', 1], ['pv', 1], ['r', 1], ['om', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'getallenleer-n', titel: 'Rekenen in ℕ', ondertitel: 'Getallenleer · 7VJHO', klas: '7VJHO', drempel: 90,
  intro: `<p>Je herhaalt het rekenen met natuurlijke getallen: de volgorde van de bewerkingen, eentermen en veeltermen, de getallenas, procenten en evenredigheden.
    Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test. Haal je <b>9 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Rekenen', delen: [1, 2, 3] }, { titel: 'B · Procenten en evenredigheden', delen: [4, 5] }, { titel: 'C · Eindtest', delen: [6] }],
  delen: [N1, N2, N3, N4, N5, N6],
});
// ===================================================================
//  REKENEN IN ℤ (7VJHO) — slaagdrempel 80%
// ===================================================================
const REGELS_PLUS = `<div class="kader def"><div class="kader-titel">Optellen en aftrekken in ℤ</div>
  <ul><li><b>Zelfde teken:</b> tel de getallen op en behoud het teken: $-9 + (-11) = -20$.</li>
  <li><b>Verschillend teken:</b> trek af (groot min klein) en neem het teken van het getal met de grootste absolute waarde: $-7 + 15 = 8$.</li>
  <li><b>Aftrekken = optellen met het tegengestelde:</b> $8 - (-5) = 8 + 5 = 13$ &nbsp; en &nbsp; $14 - 20 = 14 + (-20) = -6$.</li></ul></div>`;
const REGELS_MAAL = `<div class="kader def"><div class="kader-titel">Vermenigvuldigen en delen in ℤ: de tekenregel</div>
  <table class="tabel"><tr><td>$+ \\cdot + = +$</td><td>$- \\cdot - = +$</td><td>$+ \\cdot - = -$</td><td>$- \\cdot + = -$</td></tr></table>
  <p>Hetzelfde geldt voor delen. Bij meerdere factoren: tel de mintekens. <b>Even</b> aantal mintekens: positief; <b>oneven</b>: negatief.</p>
  <p class="klein">$-2 \\cdot (-3) \\cdot (-5) = -30$ (3 mintekens) &nbsp; · &nbsp; $-18 : 3 \\cdot (-2) = -6 \\cdot (-2) = 12$ (van links naar rechts!)</p></div>`;
const z = (a, b) => nz(a, b);
const Z1 = {
  nr: 1, titel: 'Optellen en aftrekken in ℤ', kort: 'Zelfde teken: optellen. Verschillend teken: aftrekken. Min = plus het tegengestelde.', rekenmachine: false,
  opdracht: 'Bereken.',
  theorie: REGELS_PLUS,
  voorbeelden: [
    { tex: '-6 - 9', stappen: ['= -6 + (-9)', '= -15'] },
    { tex: '-10 - (-10)', stappen: ['= -10 + 10', '= 0'] },
    { tex: '-12 + (-4)', stappen: ['\\text{zelfde teken: } 12 + 4 = 16, \\text{ teken } -', '= -16'] },
  ],
  soorten: {
    plus: { naam: 'Optellen', gen() { const a = z(-20, 20), b = z(-20, 20); return { soort: 'plus', tex: `${tg(a)} + ${h(b)}`, antw: getal(a + b), uitleg: [Math.sign(a) === Math.sign(b) ? `\\text{zelfde teken: } ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a + b)}` : `\\text{verschillend teken: } ${Math.max(Math.abs(a), Math.abs(b))} - ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(a + b)}`, `= ${tg(a + b)}`] }; } },
    min: { naam: 'Aftrekken', gen() { const a = z(-20, 20), b = z(-20, 20); return { soort: 'min', tex: `${tg(a)} - ${h(b)}`, antw: getal(a - b), uitleg: [`= ${tg(a)} + ${h(-b)} \\quad \\text{(plus het tegengestelde)}`, `= ${tg(a - b)}`] }; } },
  },
  oefenMix: [['plus', 1], ['min', 1]],
  test: [['plus', 5], ['min', 5]], testSchudden: true,
};
const Z2 = {
  nr: 2, titel: 'Vermenigvuldigen en delen in ℤ', kort: 'Tekenregel: even aantal mintekens positief, oneven negatief.', rekenmachine: false,
  opdracht: 'Bereken.',
  theorie: REGELS_MAAL,
  voorbeelden: [
    { tex: '-6 \\cdot (-7)', stappen: ['- \\cdot - = +', '= 42'] },
    { tex: '72 : (-8)', stappen: ['+ : - = -', '= -9'] },
    { tex: '6 \\cdot (-2) : (-4)', stappen: ['= -12 : (-4) \\quad \\text{(van links naar rechts)}', '= 3'] },
  ],
  soorten: {
    maal: { naam: 'Vermenigvuldigen', gen() { const a = z(-12, 12), b = z(-12, 12); return { soort: 'maal', tex: `${tg(a)} \\cdot ${h(b)}`, antw: getal(a * b), uitleg: [`${a < 0 ? '-' : '+'} \\cdot ${b < 0 ? '-' : '+'} = ${a * b < 0 ? '-' : '+'}`, `= ${tg(a * b)}`] }; } },
    deel: { naam: 'Delen', gen() { const q = z(-12, 12), b = z(-10, 10), a = q * b; return { soort: 'deel', tex: `${tg(a)} : ${h(b)}`, antw: getal(q), uitleg: [`${a < 0 ? '-' : '+'} : ${b < 0 ? '-' : '+'} = ${q < 0 ? '-' : '+'}`, `= ${tg(q)}`] }; } },
    ketting: { naam: 'Meerdere bewerkingen', gen() {
      return kies([
        () => { const a = z(-6, 6), b = z(-6, 6), c = z(-6, 6); const n = [a, b, c].filter(x => x < 0).length; return { soort: 'ketting', tex: `${tg(a)} \\cdot ${h(b)} \\cdot ${h(c)}`, antw: getal(a * b * c), uitleg: [`${n} \\text{ minteken${n === 1 ? '' : 's'}: ${n % 2 ? 'oneven, negatief' : 'even, positief'}}`, `= ${tg(a * b * c)}`] }; },
        () => { const b = z(-6, 6), q = z(-6, 6), c = z(-5, 5), a = b * q; return { soort: 'ketting', tex: `${tg(a)} : ${h(b)} \\cdot ${h(c)}`, antw: getal(q * c), uitleg: [`= ${tg(q)} \\cdot ${h(c)} \\quad \\text{(van links naar rechts)}`, `= ${tg(q * c)}`] }; },
        () => { const a = z(-8, 8), b = z(-6, 6), c = kies([1, -1, 2, -2, 3, -3, 4, -4].filter(x => (a * b) % x === 0)); return { soort: 'ketting', tex: `${tg(a)} \\cdot ${h(b)} : ${h(c)}`, antw: getal(a * b / c), uitleg: [`= ${tg(a * b)} : ${h(c)}`, `= ${tg(a * b / c)}`] }; },
      ])();
    } },
  },
  oefenMix: [['maal', 2], ['deel', 2], ['ketting', 1]],
  test: [['maal', 3], ['deel', 3], ['ketting', 4]], testSchudden: true,
};
const Z3 = {
  nr: 3, titel: 'Machten in ℤ', kort: 'Let op de haakjes: (−3)⁴ = 81 maar −3⁴ = −81.', rekenmachine: false,
  opdracht: 'Bereken de macht.',
  theorie: `<div class="kader def"><div class="kader-titel">Machten van negatieve getallen</div>
      <ul><li><b>Even</b> exponent: positief. $(-2)^4 = (-2) \\cdot (-2) \\cdot (-2) \\cdot (-2) = 16$</li>
      <li><b>Oneven</b> exponent: negatief. $(-4)^3 = -64$</li>
      <li>$a^0 = 1$ &nbsp; en &nbsp; $(-1)^{\\text{even}} = 1$, $(-1)^{\\text{oneven}} = -1$</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Let op de haakjes!</div>
      <p>$(-3)^4 = 81$: het minteken zit in het grondtal (binnen de haakjes).</p>
      <p>$-3^4 = -(3^4) = -81$: de macht geldt enkel voor $3$, het minteken staat ervoor.</p>
      <p class="klein">$-(-5)^2 = -(25) = -25$ &nbsp; · &nbsp; $-(-2)^3 = -(-8) = 8$</p></div>`,
  voorbeelden: [
    { tex: '(-1)^{15}', stappen: ['\\text{oneven exponent}', '= -1'] },
    { tex: '-3^4', stappen: ['= -(3^4)', '= -81'] },
    { tex: '-(-2)^3', stappen: ['= -(-8)', '= 8'] },
  ],
  soorten: {
    haakjes: { naam: '(−a)ⁿ', gen() { const a = rnd(2, 5), n = a === 2 ? rnd(2, 6) : a === 3 ? rnd(2, 4) : rnd(2, 3); return { soort: 'haakjes', tex: `(-${a})^{${n}}`, antw: getal((-a) ** n), uitleg: [`\\text{${n % 2 ? 'oneven' : 'even'} exponent: ${n % 2 ? 'negatief' : 'positief'}}`, `= ${tg((-a) ** n)}`] }; } },
    zonder: { naam: '−aⁿ en −(−a)ⁿ', gen() {
      const a = rnd(2, 5), n = a === 2 ? rnd(2, 5) : rnd(2, 3);
      return kies([
        () => ({ soort: 'zonder', tex: `-${a}^{${n}}`, antw: getal(-(a ** n)), uitleg: [`= -(${a}^{${n}})`, `= ${tg(-(a ** n))}`] }),
        () => ({ soort: 'zonder', tex: `-(-${a})^{${n}}`, antw: getal(-((-a) ** n)), uitleg: [`= -(${tg((-a) ** n)})`, `= ${tg(-((-a) ** n))}`] }),
      ])();
    } },
    bijzonder: { naam: '(−1)ⁿ en a⁰', gen() {
      return kies([
        () => { const n = rnd(5, 30); return { soort: 'bijzonder', tex: `(-1)^{${n}}`, antw: getal((-1) ** n), uitleg: [`\\text{${n % 2 ? 'oneven' : 'even'} exponent}`, `= ${tg((-1) ** n)}`] }; },
        () => { const a = z(-15, 15); return { soort: 'bijzonder', tex: `${h(a)}^0`, antw: getal(1), uitleg: ['a^0 = 1'] }; },
      ])();
    } },
  },
  oefenMix: [['haakjes', 2], ['zonder', 2], ['bijzonder', 1]],
  test: [['haakjes', 4], ['zonder', 4], ['bijzonder', 2]], testSchudden: true,
};

// ---- 4. wortels en logaritmen
const BN = 'bestaat niet in ℤ';
function wortelKeuze(juist, extra) {
  const opties = [...new Set([juist, ...extra])].filter(x => x !== undefined).slice(0, 4);
  while (opties.length < 4) { const x = String(rnd(-30, 30)); if (!opties.includes(x)) opties.push(x); }
  const s = schud(opties);
  return { soort: 'keuze', opties: s.map((t, i) => ({ k: String(i), l: t === BN ? `\\text{${BN}}` : t })), juist: String(s.indexOf(juist)) };
}
const Z4 = {
  nr: 4, titel: 'Wortels en logaritmen in ℤ', kort: '√ van een negatief getal bestaat niet; ∛ wel.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Vierkantswortel</div>
      <p>$\\sqrt{64} = 8$ want $8^2 = 64$. De vierkantswortel is nooit negatief.</p>
      <p>$\\sqrt{-25}$ <b>bestaat niet</b>: geen enkel getal in het kwadraat geeft een negatief getal.</p>
      <p>$-\\sqrt{36} = -6$: het minteken staat vóór de wortel. &nbsp; $\\sqrt{9 + 16} = \\sqrt{25} = 5$: reken eerst onder de wortel.</p></div>
    <div class="kader def"><div class="kader-titel">Derdemachtswortel</div>
      <p>$\\sqrt[3]{-125} = -5$ want $(-5)^3 = -125$. Een derdemachtswortel van een negatief getal <b>bestaat wel</b>.</p></div>
    <div class="kader eig"><div class="kader-titel">Logaritme</div>
      <p>$\\log_2 16 = 4$ want $2^4 = 16$ &nbsp; · &nbsp; $\\log_{10} 100 = 2$ &nbsp; · &nbsp; $\\log_3 27 = 3$</p></div>`,
  voorbeelden: [
    { tex: '\\sqrt{4 - 13}', stappen: ['= \\sqrt{-9}', '\\text{bestaat niet in } \\mathbb{Z}'] },
    { tex: '-\\sqrt[3]{8}', stappen: ['= -(2)', '= -2'] },
    { tex: '\\sqrt[3]{-1}', stappen: ['(-1)^3 = -1', '= -1'] },
  ],
  soorten: {
    vierkant: { naam: 'Vierkantswortels', gen() {
      const k = rnd(2, 12), v = kies(['p', 'm', 'neg', 'som']);
      if (v === 'p') return { soort: 'vierkant', opdracht: 'Bereken. Bestaat de uitkomst niet in ℤ, kies dan "bestaat niet".', tex: `\\sqrt{${k * k}}`, antw: wortelKeuze(String(k), [String(-k), BN, String(k * k / 2 | 0)]), uitleg: [`${k}^2 = ${k * k} \\Rightarrow ${k}`] };
      if (v === 'm') return { soort: 'vierkant', opdracht: 'Bereken. Bestaat de uitkomst niet in ℤ, kies dan "bestaat niet".', tex: `-\\sqrt{${k * k}}`, antw: wortelKeuze(String(-k), [String(k), BN, String(-k * k)]), uitleg: [`= -(${k})`, `= ${-k}`] };
      if (v === 'neg') return { soort: 'vierkant', opdracht: 'Bereken. Bestaat de uitkomst niet in ℤ, kies dan "bestaat niet".', tex: `\\sqrt{-${k * k}}`, antw: wortelKeuze(BN, [String(-k), String(k), String(-k * k)]), uitleg: ['\\text{een kwadraat is nooit negatief}', `\\text{${BN}}`] };
      const a = rnd(1, k * k - 1), neg = kies([true, false]), b = neg ? -(k * k + a) : k * k - a, s = a + b;
      return { soort: 'vierkant', opdracht: 'Bereken. Bestaat de uitkomst niet in ℤ, kies dan "bestaat niet".', tex: `\\sqrt{${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}}`, antw: wortelKeuze(s < 0 ? BN : String(k), s < 0 ? [String(k), String(-k), String(s)] : [String(-k), BN, String(s)]),
        uitleg: [`= \\sqrt{${s}}`, s < 0 ? `\\text{${BN}}` : `= ${k}`] };
    } },
    derde: { naam: 'Derdemachtswortels', gen() {
      const k = rnd(1, 6), neg = kies([true, false]), voor = kies([true, false]);
      const binnen = neg ? -(k ** 3) : k ** 3, w = (voor ? -1 : 1) * (neg ? -k : k);
      return { soort: 'derde', opdracht: 'Bereken. Bestaat de uitkomst niet in ℤ, kies dan "bestaat niet".', tex: `${voor ? '-' : ''}\\sqrt[3]{${tg(binnen)}}`, antw: wortelKeuze(String(w), [String(-w), BN, String(binnen)]),
        uitleg: [`${h(neg ? -k : k)}^3 = ${tg(binnen)}`, voor ? `= -(${tg(neg ? -k : k)}) = ${tg(w)}` : `= ${tg(w)}`] };
    } },
    log: { naam: 'Logaritmen', gen() { const b = kies([2, 3, 5, 10]), e = b === 2 ? rnd(1, 6) : b === 3 ? rnd(1, 4) : rnd(1, 3); return { soort: 'log', opdracht: 'Bereken.', tex: `\\log_{${b}} ${b ** e}`, antw: getal(e), uitleg: [`${b}^{${e}} = ${b ** e}`, `\\log_{${b}} ${b ** e} = ${e}`] }; } },
  },
  oefenMix: [['vierkant', 3], ['derde', 2], ['log', 2]],
  test: [['vierkant', 4], ['derde', 3], ['log', 3]], testSchudden: true,
};

// ---- 5. volgorde van de bewerkingen in ℤ
const ZV = [
  () => { const a = z(-9, 9), b = rnd(2, 6), c = z(-6, 6); return { tex: `${tg(a)} - ${b} \\cdot ${h(c)}`, w: a - b * c, L: [`= ${tg(a)} - ${h(b * c)}`, `= ${tg(a - b * c)}`] }; },
  () => { const k = rnd(2, 3), e = k === 2 ? 4 : 2, m = rnd(4, 9), c = rnd(2, 5), d = z(-6, 6); const w = (-k) ** e - m + c * d;
    return { tex: `(-${k})^${e} - \\sqrt{${m * m}} + ${c} \\cdot ${h(d)}`, w, L: [`= ${(-k) ** e} - ${m} + ${h(c * d)}`, `= ${tg(w)}`] }; },
  () => { const a = rnd(2, 4), p = rnd(1, 6), q = p + rnd(1, 5), k = kies([2, 3]), w = -a * (p - q) - (-k) / (-k);
    return { tex: `-${a} \\cdot (${p} - ${q}) - \\sqrt[3]{-${k ** 3}} : (-${k})`, w, L: [`= -${a} \\cdot (${p - q}) - (-${k}) : (-${k})`, `= ${-a * (p - q)} - 1`, `= ${tg(w)}`] }; },
  () => { const k = rnd(3, 7), p = rnd(1, 9), b = k * k + p, e = kies([3, 5, 7]), l = rnd(2, 5), w = k - 2 * (-1) + l;
    return { tex: `\\sqrt{-${p} + ${b}} - 2 \\cdot (-1)^${e} + \\log_2 ${2 ** l}`, w, L: [`= \\sqrt{${k * k}} - 2 \\cdot (-1) + ${l}`, `= ${k} + 2 + ${l}`, `= ${w}`] }; },
  () => { const a = rnd(2, 4), b = rnd(2, 6), e = kies([2, 4, 6, 8]), w = a * a + 2 * b + 1;
    return { tex: `(-${a})^2 - 2 \\cdot (-${b}) + (-1)^${e}`, w, L: [`= ${a * a} + ${2 * b} + 1`, `= ${w}`] }; },
  () => { const m = rnd(2, 5), k = 2, w = m * -8 - (-2) / (-2);
    return { tex: `${m} \\cdot (-2)^3 - \\sqrt[3]{-8} : (-2)`, w, L: [`= ${m} \\cdot (-8) - (-2) : (-2)`, `= ${-8 * m} - 1`, `= ${w}`] }; },
];
const Z5 = {
  nr: 5, titel: 'Volgorde van de bewerkingen in ℤ', kort: 'Haakjes, machten/wortels/log, maal/gedeeld, plus/min — met mintekens.', rekenmachine: false,
  opdracht: 'Bereken. Let op de volgorde van de bewerkingen.',
  theorie: `${VOLGORDE}${REGELS_MAAL}<div class="kader werk"><div class="kader-titel">Voorbeeld</div>
    <p class="midden">$(-2)^4 - \\sqrt{49} + 3 \\cdot (-5) = 16 - 7 - 15 = -6$</p></div>`,
  voorbeelden: [
    { tex: '7 - 4 \\cdot (-3)', stappen: ['= 7 - (-12)', '= 7 + 12 = 19'] },
    { tex: '-3 \\cdot (5 - 9) - \\sqrt[3]{-27} : (-3)', stappen: ['= -3 \\cdot (-4) - (-3) : (-3)', '= 12 - 1', '= 11'] },
  ],
  soorten: {
    gemengd: { naam: 'Bewerkingen met volgorde', gen() { const r = kies(ZV)(); return { soort: 'gemengd', tex: `${r.tex}`, antw: getal(r.w), uitleg: r.L }; } },
  },
  oefenMix: [['gemengd', 1]],
  test: [['gemengd', 10]], testSchudden: true,
};

// ---- 6. getallenas, ordenen en coördinaten
function zBewerking() {
  return kies([
    () => { const a = z(-5, 5), b = z(-3, 3); return { tex: `${tg(a)} \\cdot ${h(b)}`, w: a * b }; },
    () => { const a = z(-10, 10), b = z(-10, 10); return { tex: `${tg(a)} + ${h(b)}`, w: a + b }; },
    () => { const b = z(-4, 4), q = z(-5, 5); return { tex: `${tg(b * q)} : ${h(b)}`, w: q }; },
    () => { const a = rnd(2, 3); return kies([{ tex: `(-${a})^2`, w: a * a }, { tex: `-${a}^2`, w: -a * a }, { tex: `(-2)^3`, w: -8 }, { tex: `-2^3`, w: -8 }]); },
    () => { const a = z(-12, 12); return { tex: `${tg(a)}`, w: a }; },
    () => { const a = rnd(2, 9); return { tex: `-(-${a})`, w: a }; },
  ])();
}
const Z6 = {
  nr: 6, titel: 'Getallenas, ordenen en coördinaten', kort: 'Hoe meer naar links, hoe kleiner. Coördinaten (x, y) aflezen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De getallenas in ℤ</div>
      <p>Links van $0$ staan de negatieve getallen. <b>Hoe verder naar links, hoe kleiner</b>: $-12 < -2$ en $-3 > -8$.</p>
      ${getallenas([{ x: -6, label: 'A' }, { x: -1, label: 'B' }, { x: 3, label: 'C' }], -8, 8)}
      <p class="klein midden">$A = -6$, $B = -1$, $C = 3$ &nbsp; en dus &nbsp; $A < B < C$</p></div>
    <div class="kader def"><div class="kader-titel">Coördinaten in het rooster</div>
      <p>Een punt $P(x, y)$: eerst de $x$-coördinaat (horizontaal), dan de $y$-coördinaat (verticaal).</p>
      ${rooster([{ x: 3, y: 4, label: 'A' }, { x: -5, y: 2, label: 'B' }, { x: -2, y: -4, label: 'C' }])}
      <p class="klein midden">$A(3, 4)$, $B(-5, 2)$, $C(-2, -4)$</p></div>`,
  voorbeelden: [
    { tex: '(-2)^2 \\;\\ldots\\; -2^2', stappen: ['(-2)^2 = 4 \\text{ en } -2^2 = -4', '4 > -4'] },
    { tex: '-10 : 2 \\;\\ldots\\; -10 : (-2)', stappen: ['-5 \\text{ en } 5', '-5 < 5'] },
  ],
  soorten: {
    vergelijk: { naam: 'Vergelijken', gen() {
      const a = zBewerking(); let b; do { b = zBewerking(); } while (b.tex === a.tex);
      return { soort: 'vergelijk', opdracht: 'Vul in: <, > of =.', tex: `${a.tex} \\;\\ldots\\; ${b.tex}`, antw: keuze(VERGELIJK, vgl(a.w, b.w)), uitleg: [`${a.tex === tg(a.w) ? a.tex : `${a.tex} = ${tg(a.w)}`} \\text{ en } ${b.tex === tg(b.w) ? b.tex : `${b.tex} = ${tg(b.w)}`}`, `${tg(a.w)} ${vgl(a.w, b.w)} ${tg(b.w)}`] };
    } },
    as: { naam: 'Aflezen op de getallenas', gen() { const x = z(-9, 9); return { soort: 'as', opdracht: 'Welk getal stelt het punt A voor?', html: getallenas([{ x, label: 'A' }], -10, 10, { u: 30 }), sleutel: 'z' + x, rapport: `A op ${x}`, antw: getal(x, { voor: 'A =' }), uitleg: [`A = ${tg(x)}`] }; } },
    coord: { naam: 'Coördinaten aflezen', gen() {
      const x = rnd(-6, 6), y = rnd(-6, 6);
      return { soort: 'coord', opdracht: 'Lees de coördinaten van het punt P af.', html: rooster([{ x, y, label: 'P' }]), sleutel: `P${x},${y}`, rapport: `P(${x}, ${y})`,
        antw: { soort: 'delen', delen: [{ label: 'x =', antw: getal(x, { voor: '' }) }, { label: 'y =', antw: getal(y, { voor: '' }) }] }, uitleg: [`P(${tg(x)}, ${tg(y)})`, '\\text{eerst horizontaal (}x\\text{), dan verticaal (}y\\text{)}'] };
    } },
  },
  oefenMix: [['vergelijk', 3], ['as', 1], ['coord', 2]],
  test: [['vergelijk', 5], ['as', 2], ['coord', 3]], testSchudden: true,
};

// ---- 7. eentermen en veeltermen in ℤ
const ct = (c) => c === 1 ? '' : c === -1 ? '-' : tg(c);
const sgn = (c, l, eerst = false) => { const a = Math.abs(c), co = a === 1 && l ? '' : String(a); return `${c < 0 ? '-' : eerst ? '' : '+'} ${co}${l}`.trim(); };
function zSom(termen) { return termen.map((t, i) => sgn(t[0], t[1], i === 0)).join(' ').replace(/\s+/g, ' '); }
const ZV2 = [
  () => { const p = z(-9, 9), q = z(-9, 9); return { tex: zSom([[p, 'a'], [q, 'a']]), e: `${p}a+${q}a` }; },
  () => { const p = z(-6, 6), q = z(-6, 6), r = z(-6, 6), s = z(-6, 6); return { tex: zSom([[p, 'a'], [q, 'b'], [r, 'a'], [s, 'b']]), e: `${p}a+${q}b+${r}a+${s}b` }; },
  () => { const p = z(-5, 5), q = z(-6, 6), r = z(-9, 9); return { tex: `${ct(p)}(${zSom([[q, 'a'], [r, '']])})`, e: `${p}*(${q}a+${r})` }; },
  () => { const q = z(-6, 6), r = z(-6, 6); return { tex: `-(${zSom([[q, 'a'], [r, 'b']])})`, e: `-(${q}a+${r}b)` }; },
  () => { const p = z(-4, 4), r = z(-4, 4), s = z(-6, 6); return { tex: `${ct(p)}(${zSom([[1, 'a'], [r, 'b']])}) ${sgn(s, 'a')}`, e: `${p}*(a+${r}b)+${s}a` }; },
  () => { const p = z(-6, 6), q = z(-4, 4), r = z(-4, 4); return { tex: `${sgn(p, 'a', true)} ${q < 0 ? '-' : '+'} ${Math.abs(q)}(${zSom([[r, 'a'], [-1, 'b']])})`, e: `${p}a+${q}*(${r}a-b)` }; },
];
const Z7 = {
  nr: 7, titel: 'Eentermen en veeltermen in ℤ', kort: 'Vereenvoudigen met negatieve coëfficiënten, haakjes uitwerken, getalwaarde.', rekenmachine: false,
  theorie: `${EENTERM}<div class="kader eig"><div class="kader-titel">Met mintekens</div>
    <p>$6a - 9a = -3a$ &nbsp; · &nbsp; $-3(2a - 5) = -6a + 15$ &nbsp; · &nbsp; $-(4a - b) = -4a + b$ (een minteken vóór de haakjes verandert alle tekens).</p>
    <p>Getalwaarde voor $a = -2$, $b = 3$: &nbsp; $3a - b = 3 \\cdot (-2) - 3 = -9$ &nbsp; · &nbsp; zet een negatief getal altijd tussen haakjes!</p></div>`,
  voorbeelden: [
    { tex: '-4a + b - a - 3b + 5a', stappen: ['\\text{a-termen: } -4a - a + 5a = 0', '\\text{b-termen: } b - 3b = -2b', '= -2b'] },
    { tex: '5a - 2(3a - b)', stappen: ['= 5a - 6a + 2b', '= -a + 2b'] },
    { tex: '-2a(a - b) \\text{ voor } a = -2, \\; b = 3', stappen: ['= -2 \\cdot (-2) \\cdot (-2 - 3)', '= 4 \\cdot (-5) = -20'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Vereenvoudigen', gen() { const r = kies(ZV2)(); return { soort: 'vereenvoudig', opdracht: 'Vereenvoudig.', tex: r.tex, antw: vt(r.e, null), uitleg: [] }; } },
    getalwaarde: { naam: 'Getalwaarde', gen() {
      const a = z(-4, 4), b = z(-4, 4);
      const G = kies([
        { tex: 'a^2', f: () => a * a }, { tex: '3a - b', f: () => 3 * a - b }, { tex: 'a \\cdot b^2', f: () => a * b * b }, { tex: 'a^3', f: () => a ** 3 },
        { tex: '(a + b)^2', f: () => (a + b) ** 2 }, { tex: '-2a(a - b)', f: () => -2 * a * (a - b) }, { tex: '2a^2 - 3b', f: () => 2 * a * a - 3 * b }, { tex: 'b^2 - a^2', f: () => b * b - a * a }, { tex: '5a - b \\cdot b', f: () => 5 * a - b * b },
      ]);
      const inv = G.tex.replace(/a/g, `{(${tg(a)})}`).replace(/b/g, `{(${tg(b)})}`);
      return { soort: 'getalwaarde', opdracht: 'Bereken de getalwaarde.', tex: `${G.tex} \\quad \\text{voor } a = ${tg(a)}, \\; b = ${tg(b)}`, antw: getal(G.f()), uitleg: [`= ${inv}`, `= ${tg(G.f())}`] };
    } },
  },
  oefenMix: [['vereenvoudig', 3], ['getalwaarde', 2]],
  test: [['vereenvoudig', 5], ['getalwaarde', 5]], testSchudden: true,
};
// uitleg voor vereenvoudigen: de uitgewerkte veelterm
Z7.soorten.vereenvoudig.gen = function () { const r = kies(ZV2)(); const j = VT.texVan(r.e); return { soort: 'vereenvoudig', opdracht: 'Vereenvoudig.', tex: r.tex, antw: vt(r.e, j), uitleg: ['\\text{haakjes uitwerken, dan gelijksoortige termen samen}', `= ${j}`] }; };

// ---- 8. rekenregels met machten en veeltermen uitwerken
const MACHT_REGELS = `<div class="kader def"><div class="kader-titel">Rekenregels met machten</div>
  <table class="tabel"><tr><td>vermenigvuldigen</td><td>$x^m \\cdot x^n = x^{m+n}$</td><td class="klein">$x^3 \\cdot x^5 = x^8$</td></tr>
  <tr><td>delen</td><td>$x^m : x^n = x^{m-n}$</td><td class="klein">$y^9 : y^3 = y^6$</td></tr>
  <tr><td>macht van een macht</td><td>$(x^m)^n = x^{m \\cdot n}$</td><td class="klein">$(a^4)^3 = a^{12}$</td></tr>
  <tr><td>macht van een product</td><td>$(x \\cdot y)^n = x^n \\cdot y^n$</td><td class="klein">$(x^2 y)^3 = x^6 y^3$</td></tr></table>
  <p>Bij eentermen: <b>getallen met getallen</b>, <b>letters met letters</b>: $-3x^2 \\cdot 5x^4 = -15x^6$ &nbsp; · &nbsp; $(-2a^3)^3 = -8a^9$</p></div>
  <div class="kader eig"><div class="kader-titel">Veeltermen uitwerken</div>
  <p>Vermenigvuldig elke term met elke term (distributiviteit) en tel gelijksoortige termen samen:</p>
  <p class="midden">$(x + 4)(x^2 - 3) = x^3 - 3x + 4x^2 - 12 = x^3 + 4x^2 - 3x - 12$</p></div>
  <div class="kader"><div class="kader-titel">Zo typ je</div><p>Een macht met <code>^</code> of de knoppen: <code>-15x^6</code>, <code>x^6y^3</code>, <code>x^3 + 4x^2 - 3x - 12</code>.</p></div>`;
const MR = [
  () => { const m = rnd(2, 6), n = rnd(2, 6), l = kies(['x', 'a', 'y']); return { tex: `${l}^{${m}} \\cdot ${l}^{${n}}`, e: `${l}^${m + n}`, L: `${l}^{${m} + ${n}}` }; },
  () => { const m = rnd(2, 4), n = rnd(2, 3), l = kies(['x', 'a']); return { tex: `(${l}^{${m}})^{${n}}`, e: `${l}^${m * n}`, L: `${l}^{${m} \\cdot ${n}}` }; },
  () => { const n = rnd(2, 5), m = n + rnd(1, 6), l = kies(['y', 'x']); return { tex: `${l}^{${m}} : ${l}^{${n}}`, e: `${l}^${m - n}`, L: `${l}^{${m} - ${n}}` }; },
  () => { const p = z(-5, 5), q = z(-5, 5), m = rnd(1, 4), n = rnd(1, 4); return { tex: `${ct(p)}x^{${m}} \\cdot ${q < 0 ? `(${ct(q)}x^{${n}})` : `${ct(q)}x^{${n}}`}`, e: `${p * q}x^${m + n}`, L: `(${tg(p)} \\cdot ${h(q)}) \\cdot x^{${m} + ${n}}` }; },
  () => { const p = kies([-2, 2, -3, 3]), m = rnd(1, 4), n = kies([2, 3]); return { tex: `(${p}a^{${m}})^{${n}}`, e: `${p ** n}a^${m * n}`, L: `${h(p)}^{${n}} \\cdot a^{${m} \\cdot ${n}}` }; },
  () => { const q = z(-6, 6), c = z(-5, 5), n = rnd(1, 4), m = n + rnd(1, 4); return { tex: `${tg(q * c)}a^{${m}} : ${c < 0 ? `(${ct(c)}a^{${n}})` : `${ct(c)}a^{${n}}`}`, e: `${q}a^${m - n}`, L: `(${tg(q * c)} : ${h(c)}) \\cdot a^{${m} - ${n}}` }; },
  () => { const m = rnd(2, 3), n = rnd(2, 3); return { tex: `(x^{${m}}y)^{${n}}`, e: `x^${m * n}y^${n}`, L: `x^{${m} \\cdot ${n}} \\cdot y^{${n}}` }; },
  () => { const p = rnd(2, 5), q = rnd(2, 5); return { tex: `${p}a^2b \\cdot ${q}ab^3`, e: `${p * q}a^3b^4`, L: `(${p} \\cdot ${q}) \\cdot a^{2 + 1} \\cdot b^{1 + 3}` }; },
];
const UITW = [
  () => { const p = z(-4, 4), m = rnd(1, 3), q = z(-5, 5), r = z(-5, 5), n = rnd(2, 4); return { tex: `${ct(p)}x^{${m}}(${ct(q)}x^{${n}} ${r < 0 ? '-' : '+'} ${Math.abs(r)}x)`, e: `${p}x^${m}*(${q}x^${n}+${r}x)` }; },
  () => { const p = z(-4, 4), q = z(-5, 5), r = z(-6, 6); return { tex: `${ct(p)}a(a^2 ${q < 0 ? '-' : '+'} ${Math.abs(q)}a ${r < 0 ? '-' : '+'} ${Math.abs(r)})`, e: `${p}a*(a^2+${q}a+${r})` }; },
  () => { const p = z(-6, 6), q = z(-6, 6); return { tex: `(x ${p < 0 ? '-' : '+'} ${Math.abs(p)})(x^2 ${q < 0 ? '-' : '+'} ${Math.abs(q)})`, e: `(x+${p})*(x^2+${q})` }; },
  () => { const p = rnd(2, 4), q = rnd(1, 6), r = rnd(1, 4); return { tex: `${p}x^2(x^3 + ${q}) - x(x^4 - ${r}x)`, e: `${p}x^2*(x^3+${q})-x*(x^4-${r}x)` }; },
];
const Z8 = {
  nr: 8, titel: 'Rekenregels met machten en veeltermen', kort: 'Exponenten optellen, aftrekken, vermenigvuldigen; haakjes uitwerken.', rekenmachine: false,
  theorie: MACHT_REGELS,
  voorbeelden: [
    { tex: '18a^7 : (-6a^3)', stappen: ['\\text{getallen: } 18 : (-6) = -3', '\\text{letters: } a^7 : a^3 = a^4', '= -3a^4'] },
    { tex: '(3x^2)^2 \\cdot x^3', stappen: ['= 9x^4 \\cdot x^3', '= 9x^7'] },
    { tex: '2x^2(x^3 + 4) - x(x^4 - 3x)', stappen: ['= 2x^5 + 8x^2 - x^5 + 3x^2', '= x^5 + 11x^2'] },
  ],
  soorten: {
    regels: { naam: 'Rekenregels met machten', gen() { const r = kies(MR)(); const j = VT.texVan(r.e); return { soort: 'regels', opdracht: 'Vereenvoudig met de rekenregels van machten.', tex: r.tex, antw: vt(r.e, j), uitleg: [`= ${r.L}`, `= ${j}`] }; } },
    uitwerken: { naam: 'Uitwerken en vereenvoudigen', gen() { const r = kies(UITW)(); const j = VT.texVan(r.e); return { soort: 'uitwerken', opdracht: 'Werk uit en vereenvoudig.', tex: r.tex, antw: vt(r.e, j), uitleg: ['\\text{elke term maal elke term, dan gelijksoortige termen samen}', `= ${j}`] }; } },
  },
  oefenMix: [['regels', 3], ['uitwerken', 2]],
  test: [['regels', 6], ['uitwerken', 4]], testSchudden: true,
};

// ---- 9. verbanden in tabellen
function verbandTabel() {
  const soort = kies(['recht', 'omgekeerd', 'lineair']);
  let xs, f, uitleg;
  if (soort === 'recht') { const k = z(-6, 9); xs = schud([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 6).sort((a, b) => a - b); f = (x) => k * x; uitleg = `y : x = ${tg(k)} \\text{ is constant}`; }
  else if (soort === 'omgekeerd') { const c = kies([12, 24, 36, 48, 60]); xs = [1, 2, 3, 4, 6, 12].filter(x => c % x === 0).slice(0, 6); f = (x) => c / x; uitleg = `x \\cdot y = ${c} \\text{ is constant}`; }
  else { const k = z(-5, 5), b = z(-9, 25); xs = [-2, -1, 0, 1, 2, 3]; f = (x) => k * x + b; uitleg = `x + 1 \\text{ geeft telkens } y ${k < 0 ? '-' : '+'} ${Math.abs(k)}; \\text{ bij } x = 0 \\text{ is } y = ${tg(b)} \\neq 0`; }
  const j = rnd(1, xs.length - 2);
  return { soort, xs, ys: xs.map(f), j, uitleg };
}
const Z9 = {
  nr: 9, titel: 'Verbanden in tabellen', kort: 'Recht evenredig, omgekeerd evenredig of lineair?', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Drie soorten verbanden</div>
      <table class="tabel"><tr><th>verband</th><th>hoe herken je het?</th><th>voorbeeld</th></tr>
      <tr><td><b>recht evenredig</b></td><td>$y : x$ is constant (het quotiënt)</td><td>ticket € 6: $p = 6t$</td></tr>
      <tr><td><b>omgekeerd evenredig</b></td><td>$x \\cdot y$ is constant (het product)</td><td>48 stoelen over $r$ rijen: $r \\cdot s = 48$</td></tr>
      <tr><td><b>lineair</b></td><td>als $x$ telkens met 1 stijgt, verandert $y$ telkens met hetzelfde getal; bij $x = 0$ is $y \\neq 0$</td><td>€ 25 lidgeld + € 5 per beurt</td></tr></table></div>`,
  voorbeelden: [
    { tex: '\\begin{array}{c|cccccc} x & 1 & 2 & 3 & 4 & 6 & 9 \\\\ \\hline y & 36 & 18 & 12 & 9 & 6 & 4 \\end{array}', stappen: ['1 \\cdot 36 = 2 \\cdot 18 = 3 \\cdot 12 = 36', '\\text{omgekeerd evenredig}'] },
    { tex: '\\begin{array}{c|cccccc} x & -2 & -1 & 0 & 1 & 2 & 3 \\\\ \\hline y & 10 & 7 & 4 & 1 & -2 & -5 \\end{array}', stappen: ['x + 1 \\Rightarrow y - 3', '\\text{bij } x = 0 \\text{ is } y = 4: \\text{ lineair}'] },
  ],
  soorten: {
    verband: { naam: 'Verband herkennen en tabel aanvullen', gen() {
      const t = verbandTabel();
      const tex = `\\begin{array}{c|${'c'.repeat(t.xs.length)}} x & ${t.xs.map(tg).join(' & ')} \\\\ \\hline y & ${t.ys.map((y, i) => i === t.j ? '\\;?\\;' : tg(y)).join(' & ')} \\end{array}`;
      return { soort: 'verband', opdracht: 'Welk verband is dit? Vul ook de ontbrekende waarde aan.', tex,
        antw: { soort: 'delen', delen: [{ label: '\\text{verband:}', antw: keuze(kTekst(['recht evenredig', 'omgekeerd evenredig', 'lineair']), ['recht', 'omgekeerd', 'lineair'].indexOf(t.soort)) },
          { label: `\\text{voor } x = ${tg(t.xs[t.j])}: \\; y =`, antw: getal(t.ys[t.j], { voor: '' }) }] },
        uitleg: [t.uitleg, `\\text{${t.soort === 'lineair' ? 'lineair' : t.soort + ' evenredig'}}`, `x = ${tg(t.xs[t.j])} \\Rightarrow y = ${tg(t.ys[t.j])}`] };
    } },
  },
  oefenMix: [['verband', 1]],
  test: [['verband', 10]], testSchudden: true,
};

const Z10 = {
  nr: 10, titel: 'Eindtest rekenen in ℤ', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van ℤ door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${REGELS_PLUS}${REGELS_MAAL}`,
  voorbeelden: [],
  soorten: { p: mix(Z1, 'min'), m: mix(Z2, 'ketting'), ma: mix(Z3, 'zonder'), w: mix(Z4, 'vierkant'), v: mix(Z5, 'gemengd'), c: mix(Z6, 'coord'), vg: mix(Z6, 'vergelijk'), ve: mix(Z7, 'vereenvoudig'), r: mix(Z8, 'regels'), u: mix(Z8, 'uitwerken'), vb: mix(Z9, 'verband') },
  oefenMix: [['p', 1], ['m', 1], ['ma', 1], ['w', 1], ['v', 1], ['c', 1], ['vg', 1], ['ve', 1], ['r', 1], ['u', 1], ['vb', 1]],
  test: [['p', 1], ['m', 1], ['ma', 1], ['w', 1], ['v', 1], ['c', 1], ['ve', 1], ['r', 1], ['u', 1], ['vb', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'getallenleer-z', titel: 'Rekenen in ℤ', ondertitel: 'Getallenleer · 7VJHO', klas: '7VJHO', drempel: 80,
  intro: `<p>Je leert rekenen met gehele getallen: positieve en negatieve getallen optellen, aftrekken, vermenigvuldigen en delen, machten, wortels, de getallenas en coördinaten,
    veeltermen en rekenregels met machten, en verbanden in tabellen. Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>8 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Bewerkingen in ℤ', delen: [1, 2, 3, 4, 5] }, { titel: 'B · Getallenas en coördinaten', delen: [6] }, { titel: 'C · Letterrekenen en verbanden', delen: [7, 8, 9] }, { titel: 'D · Eindtest', delen: [10] }],
  delen: [Z1, Z2, Z3, Z4, Z5, Z6, Z7, Z8, Z9, Z10],
});
// ===================================================================
//  REKENEN IN ℚ (7VJHO) — slaagdrempel 70%
// ===================================================================
// ---- kleine breukenrekenkern: [t, n] met n > 0, vereenvoudigd
const R = (t, n = 1) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return [t / g, n / g]; };
const Rplus = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const Rmin = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const Rmaal = (a, b) => R(a[0] * b[0], a[1] * b[1]);
const Rdeel = (a, b) => R(a[0] * b[1], a[1] * b[0]);
const Rmacht = (a, e) => e >= 0 ? R(a[0] ** e, a[1] ** e) : R(a[1] ** -e, a[0] ** -e);
const Rtex = (a) => fr(a[0], a[1]);
const Rh = (a) => a[0] < 0 ? `\\left(${Rtex(a)}\\right)` : Rtex(a);
const Rbr = (a, extra) => br(a[0], a[1], extra);
const Rteller = (n) => { let t; do { t = rnd(1, n - 1); } while (ggd(t, n) !== 1); return t; };
const Rwil = (nmax = 9, neg = true) => { const n = rnd(2, nmax), t = Rteller(n); return R(neg && kies([true, false]) ? -t : t, n); };
const BREUK_TYPEN = `<div class="kader"><div class="kader-titel">Zo typ je</div><p>Een breuk typ je met <code>/</code>: <code>-7/12</code> geeft $-\\frac{7}{12}$. Geef het antwoord altijd <b>onvereenvoudigbaar</b>; is het een geheel getal, typ dan gewoon dat getal.</p></div>`;

// ---- 1. decimale vormen
function decimaleVorm(t, n) { // t/n met n > 0, 0 < |t| < n niet vereist
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
const Q1 = {
  nr: 1, titel: 'Decimale vormen van breuken', kort: 'Begrensd, zuiver repeterend of gemengd repeterend?', rekenmachine: false,
  opdracht: 'Welke decimale vorm heeft deze breuk?',
  theorie: `<div class="kader def"><div class="kader-titel">Drie decimale vormen</div>
      <table class="tabel"><tr><th>vorm</th><th>voorbeeld</th><th>noemer (onvereenvoudigbaar) bevat</th></tr>
      <tr><td><b>begrensd</b></td><td>$\\frac{3}{8} = 0{,}375$</td><td>enkel factoren $2$ en/of $5$</td></tr>
      <tr><td><b>zuiver repeterend</b></td><td>$\\frac{5}{11} = 0{,}\\overline{45}$</td><td>geen factor $2$ of $5$</td></tr>
      <tr><td><b>gemengd repeterend</b></td><td>$\\frac{1}{6} = 0{,}1\\overline{6}$</td><td>een factor $2$ of $5$ én een andere factor</td></tr></table>
      <p>De streep staat boven de <b>periode</b>: de cijfers die zich steeds herhalen.</p></div>
    <div class="kader eig"><div class="kader-titel">Werkwijze</div>
      <ol><li>Vereenvoudig de breuk eerst.</li><li>Ontbind de noemer in priemfactoren.</li><li>Kijk welke factoren er zijn.</li></ol>
      <p class="klein">$\\frac{9}{12} = \\frac{3}{4}$ en $4 = 2 \\cdot 2$: begrensd ($0{,}75$).</p></div>`,
  voorbeelden: [
    { tex: '\\frac{7}{20}', stappen: ['20 = 2 \\cdot 2 \\cdot 5', '\\text{enkel 2 en 5: begrensd}', '= 0{,}35'] },
    { tex: '\\frac{4}{15}', stappen: ['15 = 3 \\cdot 5', '\\text{5 én 3: gemengd repeterend}', '= 0{,}2\\overline{6}'] },
  ],
  soorten: {
    vorm: { naam: 'Decimale vorm herkennen', gen() {
      const n = kies([4, 5, 8, 20, 25, 40, 3, 7, 9, 11, 27, 33, 6, 12, 15, 18, 22, 30, 35, 45]), t = Rteller(n), k = kies([1, 1, 2, 3]);
      const d = decimaleVorm(t, n);
      return { soort: 'vorm', tex: `${frRaw(t * k, n * k)}`, antw: keuze(VORMEN, d.soort),
        uitleg: [k > 1 ? `= ${fr(t, n)}` : `\\text{onvereenvoudigbaar}`, `${n} = ${factorTex(n)}`, `\\text{${VORM_NAAM[d.soort]}: } ${fr(t, n)} = ${d.tex}`] };
    } },
  },
  oefenMix: [['vorm', 1]],
  test: [['vorm', 10]], testSchudden: true,
};

// ---- 2. afronden
const Q2 = {
  nr: 2, titel: 'Afronden', kort: 'Kijk naar het eerstvolgende cijfer: 5 of meer, dan naar boven.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Afronden</div>
      <p>Kijk naar het cijfer <b>na</b> de laatste decimaal die je wil behouden.</p>
      <ul><li>$0, 1, 2, 3$ of $4$: naar beneden afronden (het cijfer blijft).</li><li>$5, 6, 7, 8$ of $9$: naar boven afronden (het cijfer wordt 1 groter).</li></ul>
      <p class="klein">$3{,}14159 \\approx 3{,}14$ (op 2 decimalen) &nbsp; · &nbsp; $2{,}7\\overline{6} = 2{,}7666\\ldots \\approx 2{,}777$ (op 3 decimalen) &nbsp; · &nbsp; $-1{,}4\\overline{9} \\approx -1{,}5$ (op 1 decimaal)</p></div>`,
  voorbeelden: [
    { tex: '\\text{Rond } 0{,}\\overline{36} \\text{ af op 3 decimalen.}', stappen: ['0{,}\\overline{36} = 0{,}36363\\ldots', '\\text{4de decimaal: 6, naar boven}', '\\approx 0{,}364'] },
    { tex: '\\text{Rond } \\frac{2}{7} \\text{ af op 2 decimalen.}', stappen: ['\\frac{2}{7} = 0{,}2857\\ldots', '\\approx 0{,}29'] },
  ],
  soorten: {
    decimaal: { naam: 'Een decimaal getal afronden', gen() {
      const d = rnd(0, 3), x = (kies([1, -1]) * rnd(1, 999999)) / 10 ** rnd(d + 2, 6); if (W.grensgeval(x, d)) return this.gen();
      return { soort: 'decimaal', opdracht: `Rond af op ${d === 0 ? 'een geheel getal' : d === 1 ? '1 decimaal' : d + ' decimalen'}.`, tex: `${tg(x)}`, antw: getal(x, { dec: d, voor: '\\approx' }), uitleg: [`\\approx ${W.texGetal(x, d, true)}`] };
    } },
    repeterend: { naam: 'Een repeterend getal of breuk afronden', gen() {
      const n = kies([3, 6, 7, 9, 11, 12, 13, 15, 18, 22]), t = Rteller(n) + n * rnd(0, 3), d = rnd(1, 3), v = decimaleVorm(t, n);
      const alsBreuk = kies([true, false]), x = t / n;
      return { soort: 'repeterend', opdracht: `Rond af op ${d === 1 ? '1 decimaal' : d + ' decimalen'}.`, tex: alsBreuk ? fr(t, n) : v.tex, antw: getal(x, { dec: d, voor: '\\approx' }),
        uitleg: [`= ${x.toFixed(d + 3).replace('.', '{,}')}\\ldots`, `\\approx ${W.texGetal(x, d, true)}`] };
    } },
  },
  oefenMix: [['decimaal', 1], ['repeterend', 1]],
  test: [['decimaal', 5], ['repeterend', 5]], testSchudden: true,
};

// ---- 3. vereenvoudigen, gelijknamig maken, ordenen
const Q3 = {
  nr: 3, titel: 'Vereenvoudigen en ordenen', kort: 'Teller en noemer delen door de ggd; gelijknamig maken om te vergelijken.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Vereenvoudigen</div>
      <p>Deel teller en noemer door hun <b>grootste gemeenschappelijke deler</b> (ggd): $\\frac{24}{36} = \\frac{24 : 12}{36 : 12} = \\frac{2}{3}$.</p>
      <p>Een breuk is <b>onvereenvoudigbaar</b> als de ggd van teller en noemer $1$ is.</p></div>
    <div class="kader def"><div class="kader-titel">Gelijknamig maken en vergelijken</div>
      <p>Zoek het <b>kleinste gemeenschappelijk veelvoud</b> (kgv) van de noemers: $\\frac{3}{4}$ en $\\frac{5}{6}$ &nbsp; → &nbsp; kgv$(4, 6) = 12$ &nbsp; → &nbsp; $\\frac{9}{12}$ en $\\frac{10}{12}$. Dus $\\frac{3}{4} < \\frac{5}{6}$.</p>
      <p class="klein">Bij negatieve breuken: $-\\frac{3}{4} > -\\frac{5}{6}$ (hoe verder naar links, hoe kleiner).</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\frac{-45}{60}', stappen: ['\\text{ggd}(45, 60) = 15', '= -\\frac{3}{4}'] },
    { tex: '\\text{Grootste van } \\frac{2}{3}, \\; \\frac{5}{8}, \\; \\frac{7}{12}', stappen: ['\\text{kgv}(3, 8, 12) = 24', '\\frac{16}{24}, \\; \\frac{15}{24}, \\; \\frac{14}{24}', '\\text{grootste: } \\frac{2}{3}'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Vereenvoudigen', gen() {
      const a = Rwil(12), k = rnd(2, 12);
      return { soort: 'vereenvoudig', opdracht: 'Vereenvoudig tot een onvereenvoudigbare breuk.', tex: frRaw(a[0] * k, a[1] * k), antw: Rbr(a), uitleg: [`\\text{ggd}(${Math.abs(a[0] * k)}, ${a[1] * k}) = ${ggd(a[0] * k, a[1] * k)}`, `= ${Rtex(a)}`] };
    } },
    ordenen: { naam: 'Kleinste of grootste breuk', gen() {
      const neg = kies([true, false]); let br3;
      do { br3 = [0, 1, 2].map(() => { const n = kies([2, 3, 4, 5, 6, 8, 9, 10, 12]); return R((neg ? -1 : 1) * Rteller(n), n); }); }
      while (new Set(br3.map(b => b[0] / b[1])).size < 3);
      const groot = kies([true, false]), w = br3.map(b => b[0] / b[1]), j = w.indexOf(groot ? Math.max(...w) : Math.min(...w));
      const L = br3.reduce((m, b) => kgv(m, b[1]), 1);
      return { soort: 'ordenen', opdracht: `Welke breuk is het ${groot ? 'grootst' : 'kleinst'}?`, tex: br3.map(Rtex).join(', \\quad '),
        antw: keuze(br3.map((b, i) => ({ k: String(i), l: Rtex(b) })), j),
        uitleg: [`\\text{kgv van de noemers: } ${L}`, br3.map(b => frRaw(b[0] * L / b[1], L)).join(', \\; '), `\\text{${groot ? 'grootste' : 'kleinste'}: } ${Rtex(br3[j])}`] };
    } },
  },
  oefenMix: [['vereenvoudig', 1], ['ordenen', 1]],
  test: [['vereenvoudig', 5], ['ordenen', 5]], testSchudden: true,
};

// ---- 4. breuken, decimale getallen en percentages
const Q4 = {
  nr: 4, titel: 'Breuken en percentages', kort: 'Procent betekent "per honderd".', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Percentages</div>
      <p>$p\\% = \\frac{p}{100}$. &nbsp; $35\\% = \\frac{35}{100} = \\frac{7}{20} = 0{,}35$</p>
      <p><b>Breuk naar percentage:</b> maak de noemer $100$: $\\frac{3}{4} = \\frac{75}{100} = 75\\%$ &nbsp; of reken: $3 : 4 = 0{,}75 = 75\\%$.</p>
      <p><b>Hoeveel procent is 12 van 48?</b> &nbsp; $\\frac{12}{48} = \\frac{1}{4} = 25\\%$</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\text{Schrijf } 45\\% \\text{ als breuk.}', stappen: ['= \\frac{45}{100}', '= \\frac{9}{20}'] },
    { tex: '\\text{Schrijf } \\frac{7}{25} \\text{ als percentage.}', stappen: ['= \\frac{28}{100}', '= 28\\%'] },
  ],
  soorten: {
    naarBreuk: { naam: 'Percentage → breuk', gen() { const p = kies([5, 15, 35, 45, 55, 65, 85, 95, 2, 4, 6, 8, 12, 16, 24, 28, 32, 36, 44, 48, 52, 64, 72, 75, 125, 150]); const a = R(p, 100);
      return { soort: 'naarBreuk', opdracht: 'Schrijf als onvereenvoudigbare breuk.', tex: `${p}\\%`, antw: Rbr(a), uitleg: [`= \\dfrac{${p}}{100}`, `= ${Rtex(a)}`] }; } },
    naarProcent: { naam: 'Breuk → percentage', gen() { const n = kies([2, 4, 5, 10, 20, 25, 50]), t = rnd(1, n * 3 / 2 | 0), p = t * 100 / n;
      return { soort: 'naarProcent', opdracht: 'Schrijf als percentage.', tex: frRaw(t, n), antw: getal(p, { na: '\\%' }), uitleg: [`= \\dfrac{${p}}{100}`, `= ${tg(p)}\\%`] }; } },
    hoeveel: { naam: 'Hoeveel procent?', gen() { const n = kies([2, 4, 5, 10, 20, 25, 50]), t = Rteller(n), m = rnd(2, 12), p = t * 100 / n;
      return { soort: 'hoeveel', opdracht: 'Hoeveel procent is het eerste getal van het tweede?', tex: `${t * m} \\text{ van } ${n * m}`, antw: getal(p, { na: '\\%' }), uitleg: [`\\dfrac{${t * m}}{${n * m}} = ${fr(t, n)}`, `= \\frac{${p}}{100} = ${tg(p)}\\%`] }; } },
  },
  oefenMix: [['naarBreuk', 1], ['naarProcent', 1], ['hoeveel', 1]],
  test: [['naarBreuk', 4], ['naarProcent', 3], ['hoeveel', 3]], testSchudden: true,
};

// ---- 5. getallenas in ℚ
const Q5 = {
  nr: 5, titel: 'Breuken op de getallenas', kort: 'Verdeel elke eenheid in evenveel gelijke stukjes.', rekenmachine: false,
  opdracht: 'Welke breuk stelt het punt A voor?',
  theorie: `<div class="kader def"><div class="kader-titel">Breuken op de getallenas</div>
      <p>De noemer zegt in hoeveel gelijke stukjes elke eenheid verdeeld is. Hieronder is elke eenheid in $4$ stukjes verdeeld.</p>
      ${getallenas([{ x: -5 / 4, label: 'A' }, { x: 3 / 4, label: 'B' }], -2, 2, { deel: 4 })}
      <p class="klein midden">$A = -\\frac{5}{4}$ (5 stukjes links van $0$) &nbsp; · &nbsp; $B = \\frac{3}{4}$</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { html: getallenas([{ x: 4 / 3, label: 'A' }], -2, 2, { deel: 3 }), stappen: ['\\text{eenheid in 3 stukjes}', '\\text{4 stukjes rechts van 0}', 'A = \\frac{4}{3}'] },
  ],
  soorten: {
    aflezen: { naam: 'Breuk aflezen', gen() {
      const d = kies([2, 3, 4, 5, 6]); let k; do { k = rnd(-2 * d + 1, 2 * d - 1); } while (k === 0 || k % d === 0);
      return { soort: 'aflezen', html: getallenas([{ x: k / d, label: 'A' }], -2, 2, { deel: d }), sleutel: `q${k}/${d}`, rapport: `A op ${k}/${d}`, antw: br(k, d, { voor: 'A =' }),
        uitleg: [`\\text{eenheid in ${d} stukjes, ${Math.abs(k)} stukjes ${k < 0 ? 'links' : 'rechts'} van 0}`, `A = ${frRaw(k, d)}${ggd(k, d) > 1 ? ` = ${fr(k, d)}` : ''}`] };
    } },
  },
  oefenMix: [['aflezen', 1]],
  test: [['aflezen', 10]], testSchudden: true,
};

// ---- 6. optellen en aftrekken
const Q6 = {
  nr: 6, titel: 'Breuken optellen en aftrekken', kort: 'Eerst gelijknamig maken, dan de tellers optellen.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Optellen en aftrekken</div>
      <ol><li>Maak de breuken <b>gelijknamig</b> (kgv van de noemers).</li><li>Tel de tellers op (of trek af), de noemer blijft.</li><li>Vereenvoudig.</li></ol>
      <p class="midden">$\\frac{5}{6} - \\frac{3}{4} = \\frac{10}{12} - \\frac{9}{12} = \\frac{1}{12}$</p>
      <p class="klein">De tekenregels van ℤ blijven gelden: $-\\frac{2}{3} - \\frac{1}{6} = -\\frac{4}{6} - \\frac{1}{6} = -\\frac{5}{6}$</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\frac{3}{8} + \\left(-\\frac{5}{6}\\right)', stappen: ['= \\frac{9}{24} - \\frac{20}{24}', '= -\\frac{11}{24}'] },
    { tex: '2 - \\frac{3}{5}', stappen: ['= \\frac{10}{5} - \\frac{3}{5}', '= \\frac{7}{5}'] },
  ],
  soorten: {
    som: { naam: 'Optellen en aftrekken', gen() {
      const a = kies([true, false, false]) ? R(z(-3, 3)) : Rwil(10), b = Rwil(12), plus = kies([true, false]), w = plus ? Rplus(a, b) : Rmin(a, b), L = kgv(a[1], b[1]);
      return { soort: 'som', tex: `${Rtex(a)} ${plus ? '+' : '-'} ${Rh(b)}`, antw: Rbr(w),
        uitleg: [`= ${frRaw(a[0] * L / a[1], L)} ${plus ? '+' : '-'} ${b[0] < 0 ? `\\left(${frRaw(b[0] * L / b[1], L)}\\right)` : frRaw(b[0] * L / b[1], L)}`, `= ${frRaw(a[0] * L / a[1] + (plus ? 1 : -1) * b[0] * L / b[1], L)}`, ...(w[1] === L ? [] : [`= ${Rtex(w)}`])] };
    } },
  },
  oefenMix: [['som', 1]],
  test: [['som', 10]], testSchudden: true,
};

// ---- 7. vermenigvuldigen en delen
const Q7 = {
  nr: 7, titel: 'Breuken vermenigvuldigen en delen', kort: 'Teller maal teller, noemer maal noemer. Delen = vermenigvuldigen met het omgekeerde.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Vermenigvuldigen</div>
      <p>$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$ &nbsp; · &nbsp; vereenvoudig liefst al vóór je vermenigvuldigt: $\\frac{4}{9} \\cdot \\frac{3}{8} = \\frac{\\cancel{4} \\cdot \\cancel{3}}{\\cancel{9} \\cdot \\cancel{8}} = \\frac{1}{6}$</p></div>
    <div class="kader def"><div class="kader-titel">Delen</div>
      <p>Delen door een breuk = vermenigvuldigen met het <b>omgekeerde</b>: $\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$</p>
      <p class="klein">$-\\frac{2}{5} : \\frac{4}{15} = -\\frac{2}{5} \\cdot \\frac{15}{4} = -\\frac{30}{20} = -\\frac{3}{2}$ &nbsp; (tekenregel van ℤ!)</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '-\\frac{6}{7} \\cdot \\left(-\\frac{14}{9}\\right)', stappen: ['= \\frac{6 \\cdot 14}{7 \\cdot 9}', '= \\frac{84}{63}', '= \\frac{4}{3}'] },
    { tex: '3 : \\frac{9}{4}', stappen: ['= 3 \\cdot \\frac{4}{9}', '= \\frac{12}{9} = \\frac{4}{3}'] },
  ],
  soorten: {
    maal: { naam: 'Vermenigvuldigen', gen() { const a = Rwil(10), b = Rwil(12), w = Rmaal(a, b);
      return { soort: 'maal', tex: `${Rtex(a)} \\cdot ${Rh(b)}`, antw: Rbr(w), uitleg: [`= ${frRaw(a[0] * b[0], a[1] * b[1])}`, `= ${Rtex(w)}`] }; } },
    deel: { naam: 'Delen', gen() { const a = kies([true, false, false]) ? R(z(-6, 6)) : Rwil(10), b = Rwil(10), w = Rdeel(a, b), o = R(b[1], b[0]);
      return { soort: 'deel', tex: `${Rtex(a)} : ${Rh(b)}`, antw: Rbr(w), uitleg: [`= ${Rtex(a)} \\cdot ${Rh(o)}`, `= ${frRaw(a[0] * o[0], a[1] * o[1])}`, `= ${Rtex(w)}`] }; } },
  },
  oefenMix: [['maal', 1], ['deel', 1]],
  test: [['maal', 5], ['deel', 5]], testSchudden: true,
};

// ---- 8. machten, wortels en rekenregels in ℚ
const Q8 = {
  nr: 8, titel: 'Machten en wortels van breuken', kort: 'Teller en noemer apart; negatieve exponent = omgekeerde.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Machten van breuken</div>
      <p>$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$: &nbsp; $\\left(-\\frac{2}{3}\\right)^3 = -\\frac{8}{27}$ &nbsp; · &nbsp; $-\\left(\\frac{3}{4}\\right)^2 = -\\frac{9}{16}$</p>
      <p><b>Negatieve exponent:</b> neem het omgekeerde. &nbsp; $\\left(\\frac{2}{5}\\right)^{-2} = \\left(\\frac{5}{2}\\right)^2 = \\frac{25}{4}$ &nbsp; · &nbsp; $3^{-2} = \\frac{1}{9}$</p></div>
    <div class="kader def"><div class="kader-titel">Wortels van breuken</div>
      <p>$\\sqrt{\\frac{9}{16}} = \\frac{3}{4}$ &nbsp; · &nbsp; $\\sqrt[3]{-\\frac{8}{27}} = -\\frac{2}{3}$</p></div>
    <div class="kader eig"><div class="kader-titel">De rekenregels gelden ook in ℚ</div>
      <p>$\\left(\\frac{2}{3}\\right)^5 \\cdot \\left(\\frac{2}{3}\\right)^{-3} = \\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$ &nbsp; · &nbsp; $\\left(\\left(\\frac{1}{2}\\right)^2\\right)^3 = \\left(\\frac{1}{2}\\right)^6 = \\frac{1}{64}$</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\left(-\\frac{3}{2}\\right)^{-3}', stappen: ['= \\left(-\\frac{2}{3}\\right)^3', '= -\\frac{8}{27}'] },
    { tex: '\\left(\\frac{3}{4}\\right)^7 : \\left(\\frac{3}{4}\\right)^5', stappen: ['= \\left(\\frac{3}{4}\\right)^{7-5} = \\left(\\frac{3}{4}\\right)^2', '= \\frac{9}{16}'] },
  ],
  soorten: {
    macht: { naam: 'Machten', gen() {
      const n = rnd(2, 5), t = Rteller(n) * kies([1, -1]), a = R(t, n), e = Math.abs(t) <= 2 && n <= 4 ? rnd(2, 4) : rnd(2, 3), neg = kies([false, false, true]), voor = kies([false, false, true]);
      const ee = neg ? -e : e, w0 = Rmacht(a, ee), w = voor ? R(-w0[0], w0[1]) : w0;
      return { soort: 'macht', tex: `${voor ? '-' : ''}\\left(${Rtex(a)}\\right)^{${ee}}`, antw: Rbr(w), uitleg: [neg ? `= ${voor ? '-' : ''}\\left(${Rtex(R(a[1], a[0]))}\\right)^{${e}}` : `= ${voor ? '-' : ''}\\dfrac{${h(a[0])}^{${e}}}{${a[1]}^{${e}}}`, `= ${Rtex(w)}`] };
    } },
    wortel: { naam: 'Wortels', gen() {
      const derde = kies([true, false]), n = derde ? rnd(2, 5) : rnd(2, 12), t = Rteller(n), neg = derde && kies([true, false]), a = R(neg ? -t : t, n), p = derde ? 3 : 2;
      return { soort: 'wortel', tex: `${derde ? '\\sqrt[3]' : '\\sqrt'}{${neg ? '-' : ''}\\dfrac{${t ** p}}{${n ** p}}}`, antw: Rbr(a), uitleg: [`${Rh(a)}^${p} = ${fr(a[0] ** p, n ** p)}`, `= ${Rtex(a)}`] };
    } },
    regels: { naam: 'Rekenregels met machten', gen() {
      const n = rnd(2, 5), a = R(Rteller(n) * kies([1, -1]), n);
      const v = kies(['maal', 'deel', 'machtmacht']);
      let tex, e, L;
      if (v === 'maal') { const m = rnd(3, 7), k = kies([-(m - 1), -(m - 2), -(m - 3)].filter(x => m + x >= 1 && m + x <= 3)); e = m + k; tex = `\\left(${Rtex(a)}\\right)^{${m}} \\cdot \\left(${Rtex(a)}\\right)^{${k}}`; L = `${m} + (${k}) = ${e}`; }
      else if (v === 'deel') { const k = rnd(2, 6); e = kies([1, 2, 3, -1, -2]); const m = k + e; tex = `\\left(${Rtex(a)}\\right)^{${m}} : \\left(${Rtex(a)}\\right)^{${k}}`; L = `${m} - ${k} = ${e}`; }
      else { const p = kies([1, 2, 3]), q = p === 1 ? kies([2, 3]) : kies([1, -1, 2].filter(x => Math.abs(p * x) <= (Math.abs(a[0]) <= 2 && n <= 3 ? 6 : 3))); e = p * q; tex = `\\left(\\left(${Rtex(a)}\\right)^{${p}}\\right)^{${q}}`; L = `${p} \\cdot ${h(q)} = ${e}`; }
      const w = Rmacht(a, e);
      return { soort: 'regels', opdracht: 'Bereken met de rekenregels van machten.', tex, antw: Rbr(w), uitleg: [`\\text{exponent: } ${L}`, `= \\left(${Rtex(a)}\\right)^{${e}}`, `= ${Rtex(w)}`] };
    } },
  },
  oefenMix: [['macht', 2], ['wortel', 1], ['regels', 2]],
  test: [['macht', 4], ['wortel', 2], ['regels', 4]], testSchudden: true,
};

// ---- 9. volgorde van de bewerkingen in ℚ
const QV = [
  () => { const a = Rwil(6), b = Rwil(6), c = Rwil(6); return { tex: `${Rtex(a)} + ${Rh(b)} \\cdot ${Rh(c)}`, w: Rplus(a, Rmaal(b, c)), L: [`= ${Rtex(a)} + ${Rh(Rmaal(b, c))}`] }; },
  () => { const a = Rwil(6), b = Rwil(6), c = Rwil(5); const s = Rmin(a, b); if (!s[0]) return null; return { tex: `\\left(${Rtex(a)} - ${Rh(b)}\\right) : ${Rh(c)}`, w: Rdeel(s, c), L: [`= ${Rh(s)} : ${Rh(c)}`] }; },
  () => { const a = Rwil(5), b = Rwil(6); const k = Rmacht(a, 2); return { tex: `\\left(${Rtex(a)}\\right)^2 - ${Rh(b)}`, w: Rmin(k, b), L: [`= ${Rtex(k)} - ${Rh(b)}`] }; },
  () => { const a = Rwil(6), n = rnd(2, 9), t = Rteller(n), r = R(t, n); return { tex: `${Rtex(a)} - \\sqrt{\\dfrac{${t * t}}{${n * n}}}`, w: Rmin(a, r), L: [`= ${Rtex(a)} - ${Rtex(r)}`] }; },
  () => { const a = R(z(-4, 4)), b = Rwil(6), c = Rwil(6); return { tex: `${Rtex(a)} \\cdot ${Rh(b)} - ${Rh(c)}`, w: Rmin(Rmaal(a, b), c), L: [`= ${Rtex(Rmaal(a, b))} - ${Rh(c)}`] }; },
  () => { const a = Rwil(5, false), b = Rwil(5); const s = Rplus(R(1), a); return { tex: `\\left(1 + ${Rtex(a)}\\right)^2 \\cdot ${Rh(b)}`, w: Rmaal(Rmacht(s, 2), b), L: [`= \\left(${Rtex(s)}\\right)^2 \\cdot ${Rh(b)}`, `= ${Rtex(Rmacht(s, 2))} \\cdot ${Rh(b)}`] }; },
];
const Q9 = {
  nr: 9, titel: 'Volgorde van de bewerkingen in ℚ', kort: 'Dezelfde volgorde als in ℕ en ℤ, nu met breuken.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `${VOLGORDE}<div class="kader werk"><div class="kader-titel">Voorbeeld</div>
    <p class="midden">$\\frac{1}{2} + \\frac{3}{4} \\cdot \\left(-\\frac{2}{3}\\right) = \\frac{1}{2} + \\left(-\\frac{1}{2}\\right) = 0$</p>
    <p class="klein">Eerst vermenigvuldigen, dan optellen.</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\left(\\frac{2}{3} - \\frac{1}{2}\\right) : \\frac{5}{6}', stappen: ['= \\frac{1}{6} : \\frac{5}{6}', '= \\frac{1}{6} \\cdot \\frac{6}{5}', '= \\frac{1}{5}'] },
  ],
  soorten: {
    gemengd: { naam: 'Bewerkingen met volgorde', gen() { for (;;) { const r = kies(QV)(); if (!r || Math.abs(r.w[0]) > 200 || r.w[1] > 200) continue; return { soort: 'gemengd', tex: r.tex, antw: Rbr(r.w), uitleg: [...r.L, `= ${Rtex(r.w)}`] }; } } },
  },
  oefenMix: [['gemengd', 1]],
  test: [['gemengd', 10]], testSchudden: true,
};

// ---- 10. decimaal getal naar breuk
const Q10 = {
  nr: 10, titel: 'Van decimaal getal naar breuk', kort: 'Begrensd: noemer 10, 100, … Repeterend: met 9-en en 0-en.', rekenmachine: false,
  opdracht: 'Schrijf als onvereenvoudigbare breuk.',
  theorie: `<div class="kader def"><div class="kader-titel">Begrensd decimaal getal</div>
      <p>Zoveel decimalen, zoveel nullen in de noemer: $0{,}35 = \\frac{35}{100} = \\frac{7}{20}$ &nbsp; · &nbsp; $1{,}2 = \\frac{12}{10} = \\frac{6}{5}$</p></div>
    <div class="kader def"><div class="kader-titel">Zuiver repeterend</div>
      <p>Teller: de periode. Noemer: zoveel <b>9-en</b> als de periode cijfers heeft.</p>
      <p class="midden">$0{,}\\overline{27} = \\frac{27}{99} = \\frac{3}{11}$</p></div>
    <div class="kader def"><div class="kader-titel">Gemengd repeterend: 3 stappen</div>
      <ol><li><b>Teller:</b> alle cijfers na de komma tot en met de eerste periode, min de cijfers vóór de periode: $0{,}1\\overline{6} \\to 16 - 1 = 15$.</li>
      <li><b>Noemer:</b> een 9 per cijfer van de periode, gevolgd door een 0 per cijfer vóór de periode: $90$.</li>
      <li><b>Vereenvoudig:</b> $\\frac{15}{90} = \\frac{1}{6}$.</li></ol>
      <p class="klein">Staat er een geheel deel vóór de komma (bv. $2{,}\\overline{3}$), schrijf dan $2 + \\frac{3}{9} = \\frac{7}{3}$.</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '0{,}\\overline{6}', stappen: ['= \\frac{6}{9}', '= \\frac{2}{3}'] },
    { tex: '0{,}4\\overline{18}', stappen: ['\\text{teller: } 418 - 4 = 414', '\\text{noemer: } 990', '= \\frac{414}{990} = \\frac{23}{55}'] },
  ],
  soorten: {
    begrensd: { naam: 'Begrensd', gen() { const d = rnd(1, 3), x = rnd(1, 10 ** d * 2) * (kies([1, 1, -1])); if (x % 10 === 0) return this.gen(); const a = R(x, 10 ** d);
      return { soort: 'begrensd', tex: tg(x / 10 ** d), antw: Rbr(a), uitleg: [`= ${frRaw(x, 10 ** d)}`, `= ${Rtex(a)}`] }; } },
    zuiver: { naam: 'Zuiver repeterend', gen() { const l = kies([1, 1, 2, 2, 3]), q = 10 ** l - 1; let p; do { p = rnd(1, q - 1); } while (l > 1 && String(p).padStart(l, '0').split('').every(c => c === String(p).padStart(l, '0')[0]));
      const ps = String(p).padStart(l, '0'), a = R(p, q);
      return { soort: 'zuiver', tex: `0{,}\\overline{${ps}}`, antw: Rbr(a), uitleg: [`= \\dfrac{${p}}{${q}}`, `= ${Rtex(a)}`] }; } },
    gemengd: { naam: 'Gemengd repeterend', gen() { const v = rnd(1, 9), l = kies([1, 1, 2]), q = 10 ** l - 1; let p; do { p = rnd(1, q - 1); } while (l > 1 && String(p).padStart(2, '0')[0] === String(p).padStart(2, '0')[1]);
      const ps = String(p).padStart(l, '0'); if (ps[l - 1] === String(v)) return this.gen();
      const teller = Number(String(v) + ps) - v, noemer = q * 10, a = R(teller, noemer);
      return { soort: 'gemengd', tex: `0{,}${v}\\overline{${ps}}`, antw: Rbr(a), uitleg: [`\\text{teller: } ${v}${ps} - ${v} = ${teller}`, `\\text{noemer: } ${noemer}`, `= \\dfrac{${teller}}{${noemer}} = ${Rtex(a)}`] }; } },
  },
  oefenMix: [['begrensd', 1], ['zuiver', 1], ['gemengd', 1]],
  test: [['begrensd', 3], ['zuiver', 3], ['gemengd', 4]], testSchudden: true,
};

// ---- 11. vraagstukken met procenten (rekentoestel)
const euro = (x) => Math.round(x * 100) / 100;
const QPV = [
  () => { const p = euro(rnd(1000, 30000) / 100), b = kies([6, 21]); const w = euro(p * (1 + b / 100));
    return { tekst: `Een artikel kost € ${naarTekst(p)} zonder btw. Er komt ${b}% btw bij. Wat is de prijs met btw?`, w, dec: 2, na: '\\text{ euro}', L: [vtTex(['%', 'euro'], [['100', tg(p)], [String(100 + b), `${tg(p)} \\cdot ${tg((100 + b) / 100)}`]]), `= ${W.texGetal(w, 2, true)} \\text{ euro}`] }; },
  () => { const p = euro(rnd(2000, 20000) / 100), k = kies([15, 20, 30, 35, 40, 12]); const w = euro(p * (1 - k / 100));
    return { tekst: `Een jas kost € ${naarTekst(p)}. In de solden krijg je ${k}% korting. Hoeveel betaal je?`, w, dec: 2, na: '\\text{ euro}', L: [`\\text{je betaalt } ${100 - k}\\%`, vtTex(['%', 'euro'], [['100', tg(p)], [String(100 - k), `${tg(p)} \\cdot ${tg((100 - k) / 100)}`]]), `= ${W.texGetal(w, 2, true)} \\text{ euro}`] }; },
  () => { const oud = rnd(40, 400), nieuw = oud + rnd(3, Math.round(oud / 2)), w = (nieuw - oud) / oud * 100;
    return { tekst: `De prijs van een abonnement stijgt van € ${oud} naar € ${nieuw}. Met hoeveel procent is de prijs gestegen? Rond af op 1 decimaal.`, w, dec: 1, na: '\\%', L: [`\\text{stijging: } ${nieuw} - ${oud} = ${nieuw - oud} \\text{ euro}`, vtTex(['euro', '%'], [[oud, '100'], [nieuw - oud, `\\frac{${nieuw - oud}}{${oud}} \\cdot 100`]]), `\\approx ${W.texGetal(w, 1, true)}\\%`] }; },
  () => { const na = euro(rnd(2000, 30000) / 100), k = kies([10, 20, 25, 40, 50]), w = euro(na / (1 - k / 100));
    return { tekst: `Na ${k}% korting betaal je € ${naarTekst(na)}. Wat was de oorspronkelijke prijs? Rond af op de cent.`, w, dec: 2, na: '\\text{ euro}', L: [`${tg(na)} \\text{ euro is } ${100 - k}\\%`, vtTex(['%', 'euro'], [[String(100 - k), tg(na)], ['1', `${tg(na)} : ${100 - k}`], ['100', `${tg(na)} : ${100 - k} \\cdot 100`]]), `\\approx ${W.texGetal(w, 2, true)} \\text{ euro}`] }; },
  () => { const n = rnd(18, 32), d = rnd(2, n - 4), w = d / n * 100;
    return { tekst: `In een klas van ${n} leerlingen dragen er ${d} een bril. Hoeveel procent is dat? Rond af op 1 decimaal.`, w, dec: 1, na: '\\%', L: [vtTex(['leerlingen', '%'], [[n, '100'], [d, `\\frac{${d}}{${n}} \\cdot 100`]]), `\\approx ${W.texGetal(w, 1, true)}\\%`] }; },
];
const Q11 = {
  nr: 11, titel: 'Vraagstukken met procenten', kort: 'Verhoudingstabel en rekentoestel.', rekenmachine: true,
  opdracht: 'Los op met een verhoudingstabel. Je mag je rekentoestel gebruiken.',
  theorie: `${PROCENTEN}<div class="kader eig"><div class="kader-titel">Met het rekentoestel</div>
      <ul><li>$21\\%$ erbij = $121\\%$ van de prijs: vermenigvuldig met $1{,}21$.</li><li>$15\\%$ korting = je betaalt $85\\%$: vermenigvuldig met $0{,}85$.</li>
      <li>Hoeveel procent? &nbsp; $\\frac{\\text{deel}}{\\text{geheel}} \\cdot 100$</li><li>Oorspronkelijke prijs: deel door het percentage en vermenigvuldig met $100$.</li></ul></div>`,
  voorbeelden: [
    { tex: '\\text{84 euro zonder btw, 21\\% btw. Prijs met btw?}', stappen: [vtTex(['%', 'euro'], [['100', '84'], ['121', '84 \\cdot 1{,}21']]), '= 101{,}64 \\text{ euro}'] },
  ],
  soorten: {
    vraagstuk: { naam: 'Vraagstukken met procenten', gen() { const r = kies(QPV)(); if (W.grensgeval(r.w, r.dec)) return this.gen();
      return { soort: 'vraagstuk', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { dec: r.dec, na: r.na, vast: r.na.includes('euro') }), uitleg: r.L }; } },
  },
  oefenMix: [['vraagstuk', 1]],
  test: [['vraagstuk', 10]], testSchudden: true,
};

// ---- 12. evenredigheden
const Q12 = {
  nr: 12, titel: 'Evenredigheden', kort: 'Recht of omgekeerd evenredig? Los op met een verhoudingstabel.', rekenmachine: true,
  theorie: EVENREDIG,
  voorbeelden: N5.voorbeelden,
  soorten: { soortVerband: N5.soorten.soortVerband, recht: N5.soorten.recht, omgekeerd: N5.soorten.omgekeerd },
  oefenMix: [['recht', 2], ['omgekeerd', 2], ['soortVerband', 1]],
  test: [['recht', 3], ['omgekeerd', 3], ['soortVerband', 4]], testSchudden: true,
};

const Q13 = {
  nr: 13, titel: 'Eindtest rekenen in ℚ', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van ℚ door elkaar, zonder rekentoestel. Herhaal gerust de theorie van een vorig deel.</p></div>${BREUK_TYPEN}`,
  voorbeelden: [],
  soorten: { vo: mix(Q1, 'vorm'), af: mix(Q2, 'repeterend'), ve: mix(Q3, 'vereenvoudig'), or: mix(Q3, 'ordenen'), pc: mix(Q4, 'naarBreuk'), as: mix(Q5, 'aflezen'), so: mix(Q6, 'som'), ma: mix(Q7, 'maal'), de: mix(Q7, 'deel'), mc: mix(Q8, 'macht'), rg: mix(Q8, 'regels'), vg: mix(Q9, 'gemengd'), db: mix(Q10, 'gemengd') },
  oefenMix: [['vo', 1], ['af', 1], ['ve', 1], ['or', 1], ['pc', 1], ['as', 1], ['so', 1], ['ma', 1], ['de', 1], ['mc', 1], ['rg', 1], ['vg', 1], ['db', 1]],
  test: [['vo', 1], ['ve', 1], ['pc', 1], ['as', 1], ['so', 1], ['de', 1], ['mc', 1], ['rg', 1], ['vg', 1], ['db', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'getallenleer-q', titel: 'Rekenen in ℚ', ondertitel: 'Getallenleer · 7VJHO', klas: '7VJHO', drempel: 70,
  intro: `<p>Je leert rekenen met rationale getallen (breuken): decimale vormen, afronden, vereenvoudigen en ordenen, percentages, breuken op de getallenas,
    de vier hoofdbewerkingen, machten en wortels, decimale getallen omzetten naar breuken, en vraagstukken met procenten en evenredigheden.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Breuken en decimale getallen', delen: [1, 2, 3, 4, 5] }, { titel: 'B · Bewerkingen met breuken', delen: [6, 7, 8, 9, 10] }, { titel: 'C · Procenten en evenredigheden', delen: [11, 12] }, { titel: 'D · Eindtest', delen: [13] }],
  delen: [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13],
});
})();
