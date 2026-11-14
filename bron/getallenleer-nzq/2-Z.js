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
