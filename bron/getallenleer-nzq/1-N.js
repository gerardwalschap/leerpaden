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
