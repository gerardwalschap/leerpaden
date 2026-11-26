// ===================================================================
//  REKENEN IN ℤ + — de tien delen
// ===================================================================

// ---------------------------------------------------------------
// 1. Optellen en aftrekken in ℤ +
// ---------------------------------------------------------------
// een term in een lange som: getoond als "+ 7", "- 7", "+ (-7)", "- (-7)" of "- (+7)"
function somTerm(v, eerst) {
  if (eerst) return { tex: tg(v), w: v };
  const vorm = kies(v < 0 ? ['min', 'plusHaak', 'minPlus'] : ['plus', 'minHaak', 'plus']);
  const a = Math.abs(v);
  if (vorm === 'plus') return { tex: `+ ${a}`, w: v };
  if (vorm === 'min') return { tex: `- ${a}`, w: v };
  if (vorm === 'plusHaak') return { tex: `+ (-${a})`, w: v };
  if (vorm === 'minHaak') return { tex: `- (-${a})`, w: v };
  return { tex: `- (+${a})`, w: v };
}
const rijTex = (ws) => ws.map((v, i) => i === 0 ? tg(v) : pm(v)).join(' ');
function posNeg(ws) {
  const P = ws.filter(x => x > 0).reduce((s, x) => s + x, 0), N = ws.filter(x => x < 0).reduce((s, x) => s - x, 0);
  return { P, N, stap: P && N ? `= ${P} - ${N} \\quad \\text{(positieve samen, negatieve samen)}` : null };
}
const Z1 = {
  nr: 1, titel: 'Optellen en aftrekken in ℤ +', kort: 'Lange sommen met haakjes, slim groeperen, het ontbrekende getal.', rekenmachine: false,
  opdracht: 'Bereken zonder rekentoestel.',
  theorie: `${REGELS_PLUS}
    ${PLUS_KADER(`<p><b>Lange sommen</b>: werk eerst alle haakjes weg. $+(-7) = -7$, &nbsp; $-(-7) = +7$, &nbsp; $-(+7) = -7$.
      Tel dan alle <b>positieve</b> getallen samen en alle <b>negatieve</b> getallen samen.</p>
      <p class="midden">$-12 - (-8) + 15 + (-21) - (+4) = -12 + 8 + 15 - 21 - 4 = 23 - 37 = -14$</p>
      <p><b>Slim groeperen</b>: zoek getallen die samen een mooi getal geven: $-47 + 128 - 53 + 72 = (-47 - 53) + (128 + 72) = -100 + 200 = 100$.</p>
      <p><b>Het ontbrekende getal</b>: denk aan de omgekeerde bewerking. $\\square + (-7) = -12$ &nbsp; geeft &nbsp; $\\square = -12 - (-7) = -5$.</p>`)}`,
  voorbeelden: [
    { tex: '-15 - (-9) + 22 + (-31) - (+6)', stappen: ['= -15 + 9 + 22 - 31 - 6', '= 31 - 52', '= -21'] },
    { tex: '-38 + 145 - 62 + 55', stappen: ['= (-38 - 62) + (145 + 55)', '= -100 + 200', '= 100'] },
    { tex: '14 - \\square = -9', stappen: ['\\square = 14 - (-9)', '= 23'] },
  ],
  soorten: {
    lang: { naam: 'Lange sommen met haakjes', gen() {
      return tot(() => {
        const n = kies([5, 5, 6]), ws = [], ts = [];
        for (let i = 0; i < n; i++) { const t = somTerm(nz(-60, 60), i === 0); ts.push(t.tex); ws.push(t.w); }
        if (ws.filter(x => x < 0).length < 2 || ts.filter(x => x.includes('(')).length < 2) return null;
        const tot0 = ws.reduce((s, x) => s + x, 0), pn = posNeg(ws);
        return { soort: 'lang', tex: ts.join(' '), antw: getal(tot0), uitleg: [`= ${rijTex(ws)} \\quad \\text{(haakjes weg)}`, ...(pn.stap ? [pn.stap] : []), `= ${tg(tot0)}`] };
      });
    } },
    slim: { naam: 'Slim groeperen', gen() {
      return tot(() => {
        const paar = () => { const m = kies([100, -100, 50, -50, 200, -200]), a = nz(-99, 99); if (Math.abs(a) < 11 || a % 10 === 0) return null; const b = m - a; if (Math.abs(b) > 260 || b % 10 === 0) return null; return [a, b, m]; };
        const p1 = paar(), p2 = paar(); if (!p1 || !p2) return null;
        const volg = schud([0, 1, 2, 3]), getallen = [p1[0], p1[1], p2[0], p2[1]], ws = volg.map(i => getallen[i]);
        const ts = ws.map((v, i) => somTerm(v, i === 0).tex), tot0 = p1[2] + p2[2];
        return { soort: 'slim', opdracht: 'Bereken slim: zoek getallen die samen een mooi getal geven.', tex: ts.join(' '), antw: getal(tot0),
          uitleg: [`= (${tg(p1[0])} ${pm(p1[1])}) + (${tg(p2[0])} ${pm(p2[1])})`, `= ${tg(p1[2])} + ${h(p2[2])}`, `= ${tg(tot0)}`] };
      });
    } },
    ontbrekend: { naam: 'Het ontbrekende getal', gen() {
      const a = nz(-40, 40), b = nz(-40, 40), vorm = rnd(0, 3);
      if (vorm === 0) { const c = a + b; return { soort: 'ontbrekend', opdracht: 'Welk getal hoort op de plaats van het vakje?', tex: `\\square + ${h(b)} = ${tg(c)}`, antw: getal(a, { voor: '\\square =' }), uitleg: [`\\square = ${tg(c)} - ${h(b)}`, `= ${tg(a)}`] }; }
      if (vorm === 1) { const c = a + b; return { soort: 'ontbrekend', opdracht: 'Welk getal hoort op de plaats van het vakje?', tex: `${tg(a)} + \\square = ${tg(c)}`, antw: getal(b, { voor: '\\square =' }), uitleg: [`\\square = ${tg(c)} - ${h(a)}`, `= ${tg(b)}`] }; }
      if (vorm === 2) { const c = a - b; return { soort: 'ontbrekend', opdracht: 'Welk getal hoort op de plaats van het vakje?', tex: `\\square - ${h(b)} = ${tg(c)}`, antw: getal(a, { voor: '\\square =' }), uitleg: [`\\square = ${tg(c)} + ${h(b)}`, `= ${tg(a)}`] }; }
      const c = a - b; return { soort: 'ontbrekend', opdracht: 'Welk getal hoort op de plaats van het vakje?', tex: `${tg(a)} - \\square = ${tg(c)}`, antw: getal(b, { voor: '\\square =' }), uitleg: [`\\square = ${tg(a)} - ${h(c)}`, `= ${tg(b)}`] };
    } },
  },
  oefenMix: [['lang', 3], ['slim', 2], ['ontbrekend', 2]],
  test: [['lang', 4], ['slim', 3], ['ontbrekend', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 2. Vermenigvuldigen en delen in ℤ +
// ---------------------------------------------------------------
const OPT = { '*': '\\cdot', ':': ':' };
function kettingVraag() {
  return tot(() => {
    let v = nz2(-9, 9) * nz2(-6, 6); const tokens = [v];
    const n = kies([3, 4, 4]);
    for (let i = 0; i < n; i++) {
      let op = kies(['*', ':', ':']), d;
      if (op === ':') { const dl = delers(v).filter(x => Math.abs(x) <= 12 && Math.abs(x) !== Math.abs(v)); if (!dl.length) op = '*'; else d = kies(dl); }
      if (op === '*') d = nz2(-6, 6);
      tokens.push(op, d); v = op === '*' ? v * d : v / d;
      if (Math.abs(v) > 600 || v === 0) return null;
    }
    // valstrik: minstens één keer ': … ·'
    if (!tokens.some((t, i) => t === ':' && tokens[i + 2] === '*')) return null;
    const tex = (t) => t.map((x, i) => typeof x === 'number' ? (i === 0 ? tg(x) : h(x)) : ` ${OPT[x]} `).join('');
    const L = []; let t = tokens.slice();
    while (t.length > 1) { const r = t[1] === '*' ? t[0] * t[2] : t[0] / t[2]; t = [r, ...t.slice(3)]; L.push(`= ${tex(t)}`); }
    L[0] += ' \\quad \\text{(van links naar rechts)}';
    return { soort: 'ketting', tex: tex(tokens), antw: getal(v), uitleg: L };
  });
}
const Z2 = {
  nr: 2, titel: 'Vermenigvuldigen en delen in ℤ +', kort: 'Lange ketens van links naar rechts, het teken zonder rekenen, de ontbrekende factor.', rekenmachine: false,
  opdracht: 'Bereken zonder rekentoestel.',
  theorie: `${REGELS_MAAL}
    ${PLUS_KADER(`<p><b>Van links naar rechts!</b> Bij $\\cdot$ en $:$ door elkaar reken je altijd van links naar rechts:
      $-48 : 4 \\cdot (-2) = -12 \\cdot (-2) = 24$ &nbsp; (en <b>niet</b> $-48 : (-8) = 6$).</p>
      <p><b>Het teken bepalen zonder te rekenen</b>: tel de mintekens. Is één factor $0$, dan is het product $0$.</p>
      <p class="midden">$(-17) \\cdot 23 \\cdot (-4) \\cdot (-9) \\cdot 11$ &nbsp; heeft 3 mintekens: <b>negatief</b>.</p>
      <p><b>De ontbrekende factor</b>: $\\square \\cdot (-6) = 54$ &nbsp; geeft &nbsp; $\\square = 54 : (-6) = -9$.</p>`)}`,
  voorbeelden: [
    { tex: '-36 : (-4) \\cdot 5 : (-3)', stappen: ['= 9 \\cdot 5 : (-3)', '= 45 : (-3)', '= -15'] },
    { tex: '\\text{Teken van } (-3) \\cdot 8 \\cdot (-5) \\cdot (-1) \\cdot (-7) \\cdot 2', stappen: ['4 \\text{ mintekens: even}', '\\text{positief}'] },
    { tex: '-72 : \\square = 8', stappen: ['\\square = -72 : 8', '= -9'] },
  ],
  soorten: {
    ketting: { naam: 'Lange ketens met · en :', gen: kettingVraag },
    teken: { naam: 'Het teken bepalen', gen() {
      const n = rnd(6, 8), f = []; for (let i = 0; i < n; i++) f.push(nz2(-19, 19));
      const nul = Math.random() < 0.15; if (nul) f[rnd(1, n - 1)] = 0;
      const m = f.filter(x => x < 0).length, juist = nul ? 2 : m % 2 ? 1 : 0;
      return { soort: 'teken', opdracht: 'Is de uitkomst positief, negatief of nul? (Je hoeft het product niet uit te rekenen.)', tex: f.map((x, i) => i === 0 ? tg(x) : h(x)).join(' \\cdot '),
        antw: keuze(kTekst(['positief', 'negatief', 'nul']), juist),
        uitleg: [nul ? '\\text{één factor is } 0 \\Rightarrow \\text{ het product is } 0' : `${m} \\text{ minteken${m === 1 ? '' : 's'}: ${m % 2 ? 'oneven' : 'even'}}`, `\\text{${['positief', 'negatief', 'nul'][juist]}}`] };
    } },
    ontbrekend: { naam: 'De ontbrekende factor of deler', gen() {
      const a = nz2(-12, 12), b = nz2(-12, 12), vorm = rnd(0, 3), c = a * b, o = 'Welk getal hoort op de plaats van het vakje?';
      if (vorm === 0) return { soort: 'ontbrekend', opdracht: o, tex: `\\square \\cdot ${h(b)} = ${tg(c)}`, antw: getal(a, { voor: '\\square =' }), uitleg: [`\\square = ${tg(c)} : ${h(b)}`, `= ${tg(a)}`] };
      if (vorm === 1) return { soort: 'ontbrekend', opdracht: o, tex: `${tg(a)} \\cdot \\square = ${tg(c)}`, antw: getal(b, { voor: '\\square =' }), uitleg: [`\\square = ${tg(c)} : ${h(a)}`, `= ${tg(b)}`] };
      if (vorm === 2) return { soort: 'ontbrekend', opdracht: o, tex: `\\square : ${h(b)} = ${tg(a)}`, antw: getal(c, { voor: '\\square =' }), uitleg: [`\\square = ${tg(a)} \\cdot ${h(b)}`, `= ${tg(c)}`] };
      return { soort: 'ontbrekend', opdracht: o, tex: `${tg(c)} : \\square = ${tg(a)}`, antw: getal(b, { voor: '\\square =' }), uitleg: [`\\square = ${tg(c)} : ${h(a)}`, `= ${tg(b)}`] };
    } },
  },
  oefenMix: [['ketting', 3], ['teken', 1], ['ontbrekend', 2]],
  test: [['ketting', 5], ['teken', 2], ['ontbrekend', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 3. Machten in ℤ +
// ---------------------------------------------------------------
const maxExp = (a) => a === 2 ? 7 : a === 3 ? 4 : 3;
const VALSTRIK = [
  () => { const a = rnd(2, 5), n = rnd(2, maxExp(a)); return { tex: `-${a}^{${n}}`, w: -(a ** n), L: [`= -(${a}^{${n}})`, `= ${tg(-(a ** n))}`] }; },
  () => { const a = rnd(2, 5), n = rnd(3, maxExp(a)); return { tex: `-(-${a})^{${n}}`, w: -((-a) ** n), L: [`= -(${tg((-a) ** n)})`, `= ${tg(-((-a) ** n))}`] }; },
  () => { const a = rnd(2, 12); return kies([
    { tex: `-${a}^0`, w: -1, L: [`= -(${a}^0)`, '= -1'] },
    { tex: `(-${a})^0`, w: 1, L: ['a^0 = 1 \\text{ (het minteken zit in het grondtal)}', '= 1'] },
    { tex: `-(-${a})^0`, w: -1, L: ['= -(1)', '= -1'] }]); },
  () => { const n = rnd(20, 99); return { tex: `-(-1)^{${n}}`, w: -((-1) ** n), L: [`= -(${tg((-1) ** n)}) \\quad \\text{(${n % 2 ? 'oneven' : 'even'} exponent)}`, `= ${tg(-((-1) ** n))}`] }; },
  () => { const a = kies([2, 3]), k = a === 2 ? kies([2, 3]) : 2, m = a === 2 ? (k === 2 ? 3 : 2) : 2; // (−a^k)^m
    const b = -(a ** k), w = b ** m; return { tex: `(-${a}^{${k}})^{${m}}`, w, L: [`= (${tg(b)})^{${m}} \\quad (\\text{eerst } ${a}^{${k}} = ${a ** k})`, `= ${tg(w)}`] }; },
  () => { const a = rnd(2, 4), n = rnd(2, maxExp(a)); return { tex: `-(-${a}^{${n}})`, w: a ** n, L: [`= -(${tg(-(a ** n))})`, `= ${tg(a ** n)}`] }; },
];
const COMBI = [
  () => { const a = rnd(2, 3), m = rnd(2, 4), b = rnd(2, 3), n = rnd(2, 3); const A = (-a) ** m, B = (-b) ** n; if (Math.abs(A * B) > 600) return null;
    return { tex: `(-${a})^{${m}} \\cdot (-${b})^{${n}}`, w: A * B, L: [`= ${tg(A)} \\cdot ${h(B)}`, `= ${tg(A * B)}`] }; },
  () => { const a = rnd(2, 4), n = rnd(2, maxExp(a)); const A = -(a ** n), B = (-a) ** n;
    return { tex: `-${a}^{${n}} + (-${a})^{${n}}`, w: A + B, L: [`= ${tg(A)} + ${h(B)}`, `= ${tg(A + B)}`] }; },
  () => { const m = rnd(10, 99), n = rnd(10, 99), p = rnd(10, 99); const A = (-1) ** m, B = (-1) ** n, C = (-1) ** p;
    return { tex: `(-1)^{${m}} - (-1)^{${n}} + (-1)^{${p}}`, w: A - B + C, L: [`= ${tg(A)} - ${h(B)} + ${h(C)}`, `= ${tg(A - B + C)}`] }; },
  () => { const a = 2, m = rnd(5, 8), n = rnd(2, m - 2); const A = (-a) ** m, B = (-a) ** n;
    return { tex: `(-${a})^{${m}} : (-${a})^{${n}}`, w: A / B, L: [`= ${tg(A)} : ${h(B)}`, `= ${tg(A / B)}`] }; },
  () => { const a = rnd(2, 4), b = rnd(2, 4); const A = -((-a) ** 3), B = b ** 2;
    return { tex: `-(-${a})^3 - ${b}^2`, w: A - B, L: [`= -(${tg((-a) ** 3)}) - ${B}`, `= ${A} - ${B}`, `= ${tg(A - B)}`] }; },
  () => { const a = rnd(2, 9), n = rnd(2, 9); return kies([
    { tex: `(-${a})^0 - ${a}^0 + 0^{${n}}`, w: 0, L: ['= 1 - 1 + 0', '= 0'] },
    { tex: `-${a}^0 - (-${a})^0`, w: -2, L: ['= -1 - 1', '= -2'] },
    { tex: `-${a}^0 \\cdot (-${a})^2`, w: -(a * a), L: [`= -1 \\cdot ${a * a}`, `= ${-(a * a)}`] }]); },
  () => { const a = rnd(2, 3), b = rnd(2, 6), c = rnd(2, 3); const A = (-a) ** 2, C = (-c) ** 3, w = A * -b - C;
    return { tex: `(-${a})^2 \\cdot (-${b}) - (-${c})^3`, w, L: [`= ${A} \\cdot (-${b}) - (${tg(C)})`, `= ${-A * b} + ${-C}`, `= ${tg(w)}`] }; },
];
const Z3 = {
  nr: 3, titel: 'Machten in ℤ +', kort: 'Valstrikken met haakjes en mintekens, machten combineren, de ontbrekende exponent.', rekenmachine: false,
  opdracht: 'Bereken zonder rekentoestel.',
  theorie: `<div class="kader def"><div class="kader-titel">Machten van negatieve getallen</div>
      <ul><li><b>Even</b> exponent: positief. $(-2)^4 = 16$ &nbsp; · &nbsp; <b>oneven</b> exponent: negatief. $(-4)^3 = -64$</li>
      <li>$a^0 = 1$ &nbsp; en &nbsp; $(-1)^{\\text{even}} = 1$, $(-1)^{\\text{oneven}} = -1$</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Let op de haakjes!</div>
      <p>$(-3)^4 = 81$, maar $-3^4 = -(3^4) = -81$. &nbsp; $-(-5)^2 = -25$ &nbsp; · &nbsp; $-(-2)^3 = 8$</p></div>
    ${PLUS_KADER(`<p><b>Ook bij de exponent 0</b> geldt de haakjesregel: $(-7)^0 = 1$, maar $-7^0 = -(7^0) = -1$.</p>
      <p><b>Binnen de haakjes eerst</b>: $(-2^2)^3 = (-4)^3 = -64$.</p>
      <p><b>De ontbrekende exponent</b>: $(-2)^{\\square} = -32$. Het resultaat is negatief, dus de exponent is oneven: $2^5 = 32$, dus $\\square = 5$.</p>`)}`,
  voorbeelden: [
    { tex: '-5^0 - (-5)^0', stappen: ['= -1 - 1', '= -2'] },
    { tex: '(-2)^3 \\cdot (-3)^2', stappen: ['= -8 \\cdot 9', '= -72'] },
    { tex: '(-3)^{\\square} = 81', stappen: ['\\text{positief: even exponent}', '3^4 = 81 \\Rightarrow \\square = 4'] },
  ],
  soorten: {
    valstrik: { naam: 'Valstrikken met haakjes', gen() { const r = kies(VALSTRIK)(); return { soort: 'valstrik', tex: r.tex, antw: getal(r.w), uitleg: r.L }; } },
    combi: { naam: 'Machten combineren', gen() { const r = tot(() => kies(COMBI)()); return { soort: 'combi', tex: r.tex, antw: getal(r.w), uitleg: r.L }; } },
    exponent: { naam: 'De ontbrekende exponent', gen() {
      const a = rnd(2, 5), n = rnd(2, a === 2 ? 9 : a === 3 ? 6 : 4);
      if (Math.random() < 0.7) { const v = (-a) ** n; return { soort: 'exponent', opdracht: 'Welke exponent hoort in het vakje?', tex: `(-${a})^{\\square} = ${tg(v)}`, antw: getal(n, { voor: '\\square =' }), uitleg: [`\\text{${v < 0 ? 'negatief: oneven' : 'positief: even'} exponent}`, `${a}^{${n}} = ${a ** n} \\Rightarrow \\square = ${n}`] }; }
      const v = -(a ** n); return { soort: 'exponent', opdracht: 'Welke exponent hoort in het vakje?', tex: `-${a}^{\\square} = ${tg(v)}`, antw: getal(n, { voor: '\\square =' }), uitleg: [`-${a}^{\\square} = -(${a}^{\\square})`, `${a}^{${n}} = ${a ** n} \\Rightarrow \\square = ${n}`] };
    } },
  },
  oefenMix: [['valstrik', 3], ['combi', 3], ['exponent', 1]],
  test: [['valstrik', 4], ['combi', 4], ['exponent', 2]], testSchudden: true,
};

// ---------------------------------------------------------------
// 4. Wortels en logaritmen in ℤ +
// ---------------------------------------------------------------
const BN = 'bestaat niet in ℤ';
function wortelKeuze(juist, extra) {
  const opties = [...new Set([juist, ...extra.map(String)])].slice(0, 4);
  while (opties.length < 4) { const x = String(nz(-30, 30)); if (!opties.includes(x)) opties.push(x); }
  const s = schud(opties);
  return { soort: 'keuze', opties: s.map((t, i) => ({ k: String(i), l: t === BN ? `\\text{${BN}}` : t })), juist: String(s.indexOf(juist)) };
}
const TRIPELS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [9, 12, 15], [12, 5, 13], [8, 15, 17]];
const WORTEL_UITDR = [
  () => { const [x, y, z] = kies(TRIPELS); return { tex: `\\sqrt{(-${x})^2 + ${y}^2}`, j: String(z), extra: [-z, x + y, BN], L: [`= \\sqrt{${x * x} + ${y * y}}`, `= \\sqrt{${z * z}}`, `= ${z}`] }; },
  () => { const k = rnd(4, 12), ds = delers(k * k).filter(d => d > 1 && d < k * k); if (!ds.length) return null; const a = kies(ds), b = k * k / a;
    if (Math.random() < 0.65) return { tex: `\\sqrt{-${a} \\cdot (-${b})}`, j: String(k), extra: [-k, BN, k * k], L: [`= \\sqrt{${k * k}}`, `= ${k}`] };
    return { tex: `\\sqrt{${a} \\cdot (-${b})}`, j: BN, extra: [k, -k, -(k * k)], L: [`= \\sqrt{${-k * k}}`, '\\text{een kwadraat is nooit negatief}', `\\text{${BN}}`] }; },
  () => { const k = rnd(2, 15); return kies([
    { tex: `\\sqrt{(-${k})^2}`, j: String(k), extra: [-k, BN, k * k], L: [`= \\sqrt{${k * k}}`, `= ${k}`] },
    { tex: `\\sqrt{-${k}^2}`, j: BN, extra: [k, -k, -(k * k)], L: [`= \\sqrt{${-k * k}}`, `\\text{${BN}}`] },
    { tex: `-\\sqrt{(-${k})^2}`, j: String(-k), extra: [k, BN, -(k * k)], L: [`= -\\sqrt{${k * k}}`, `= ${-k}`] }]); },
  () => { const k = rnd(2, 6), s = kies([1, -1]), K = s * k ** 3, ds = delers(K).filter(d => Math.abs(d) > 1 && Math.abs(d) < Math.abs(K)); if (!ds.length) return null;
    const a = kies(ds), b = K / a, w = s * k; return { tex: `\\sqrt[3]{${tg(a)} \\cdot ${h(b)}}`, j: String(w), extra: [-w, BN, K], L: [`= \\sqrt[3]{${tg(K)}}`, `${h(w)}^3 = ${tg(K)}`, `= ${tg(w)}`] }; },
  () => { const k = rnd(2, 6); return kies([
    { tex: `\\sqrt[3]{(-${k})^3}`, j: String(-k), extra: [k, BN, -(k ** 3)], L: [`= \\sqrt[3]{${-(k ** 3)}}`, `= ${-k}`] },
    { tex: `\\sqrt[3]{-(-${k})^3}`, j: String(k), extra: [-k, BN, k ** 3], L: [`= \\sqrt[3]{-(${-(k ** 3)})}`, `= \\sqrt[3]{${k ** 3}}`, `= ${k}`] },
    { tex: `-\\sqrt[3]{-${k ** 3}}`, j: String(k), extra: [-k, BN, k * k], L: [`= -(${-k})`, `= ${k}`] }]); },
  () => { const q = rnd(2, 6), r = rnd(2, 9), qr = q * r;
    if (Math.random() < 0.5) { const p = rnd(1, qr - 1); return { tex: `\\sqrt{${p} - ${q} \\cdot ${r}}`, j: BN, extra: [qr - p, p - qr, Math.round(Math.sqrt(qr - p))], L: [`= \\sqrt{${p} - ${qr}}`, `= \\sqrt{${p - qr}}`, `\\text{${BN}}`] }; }
    const k = rnd(1, 9), p = k * k + qr; return { tex: `\\sqrt{${p} - ${q} \\cdot ${r}}`, j: String(k), extra: [-k, BN, k * k], L: [`= \\sqrt{${p} - ${qr}}`, `= \\sqrt{${k * k}}`, `= ${k}`] }; },
  () => { const k = rnd(1, 5), s = kies([1, -1]), w = s * k, K = w ** 3, q = rnd(2, 9), p = K + q * q; if (p === 0) return null;
    return { tex: `\\sqrt[3]{${tg(p)} - ${q}^2}`, j: String(w), extra: [-w, BN, K], L: [`= \\sqrt[3]{${tg(p)} - ${q * q}}`, `= \\sqrt[3]{${tg(K)}}`, `= ${tg(w)}`] }; },
];
const LOG_UITDR = [
  () => { const e = rnd(2, 6), N = 2 ** e, a = nz(-30, -2), b = N - a; return { tex: `\\log_2 (${tg(a)} + ${b})`, w: e, L: [`= \\log_2 ${N}`, `= ${e} \\quad (2^{${e}} = ${N})`] }; },
  () => { const b = kies([2, 3]), n = b === 2 ? kies([2, 4, 6]) : kies([2, 4]), N = b ** n; return { tex: `\\log_{${b}} (-${b})^{${n}}`, w: n, L: [`= \\log_{${b}} ${N} \\quad (\\text{even exponent: positief})`, `= ${n}`] }; },
  () => { const b = kies([2, 3]), e = b === 2 ? rnd(3, 6) : rnd(2, 4), N = b ** e, ds = delers(N).filter(d => d > 1 && d < N); const p = kies(ds), q = N / p;
    return { tex: `\\log_{${b}} [-${p} \\cdot (-${q})]`, w: e, L: [`= \\log_{${b}} ${N}`, `= ${e} \\quad (${b}^{${e}} = ${N})`] }; },
  () => { const b = kies([2, 3, 5]), e = b === 5 ? rnd(2, 3) : b === 3 ? rnd(2, 4) : rnd(2, 6), w = 0 - e; return { tex: `\\log_{10} 1 - \\log_{${b}} ${b ** e}`, w, L: [`= 0 - ${e} \\quad (10^0 = 1)`, `= ${w}`] }; },
  () => { const m = rnd(2, 4), n = rnd(2, 4); return { tex: `\\log_2 (2^{${m}} \\cdot 2^{${n}})`, w: m + n, L: [`= \\log_2 (${2 ** m} \\cdot ${2 ** n})`, `= \\log_2 ${2 ** (m + n)}`, `= ${m + n}`] }; },
  () => { const e = rnd(2, 4), N = 3 ** e, a = rnd(2, 9), c = N + a * a; return { tex: `\\log_3 [${c} - (-${a})^2]`, w: e, L: [`= \\log_3 (${c} - ${a * a})`, `= \\log_3 ${N}`, `= ${e}`] }; },
];
const GEMENGD_WL = [
  () => { const a = rnd(2, 12), b = rnd(2, 5), c = rnd(2, 6), w = -a - b - c;
    return { tex: `-\\sqrt{${a * a}} + \\sqrt[3]{-${b ** 3}} - \\log_2 ${2 ** c}`, w, L: [`= -${a} + (-${b}) - ${c}`, `= ${w}`] }; },
  () => { const a = rnd(2, 9), b = rnd(2, 4), e = kies([2, 3]), N = 3 ** e, w = a * -b; if (w % e) return null;
    return { tex: `\\sqrt{${a * a}} \\cdot \\sqrt[3]{-${b ** 3}} : \\log_3 ${N}`, w: w / e, L: [`= ${a} \\cdot (-${b}) : ${e}`, `= ${w} : ${e}`, `= ${w / e}`] }; },
  () => { const n = rnd(11, 60), k = rnd(2, 10), e = rnd(2, 5), s = (-1) ** n, w = s * k - e;
    return { tex: `(-1)^{${n}} \\cdot \\sqrt{${k * k}} - \\log_2 ${2 ** e}`, w, L: [`= ${tg(s)} \\cdot ${k} - ${e}`, `= ${tg(s * k)} - ${e}`, `= ${tg(w)}`] }; },
  () => { const b = rnd(2, 5), c = rnd(2, 5), w = (-b) - (-c) * (-c);
    return { tex: `\\sqrt[3]{-${b ** 3}} - \\sqrt[3]{-${c ** 3}} \\cdot \\sqrt[3]{-${c ** 3}}`, w, L: [`= -${b} - (-${c}) \\cdot (-${c})`, `= -${b} - ${c * c}`, `= ${w}`] }; },
];
const Z4 = {
  nr: 4, titel: 'Wortels en logaritmen in ℤ +', kort: 'Wortels en logaritmen van uitdrukkingen met mintekens, alles samen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Wortels</div>
      <p>$\\sqrt{64} = 8$ want $8^2 = 64$. De vierkantswortel is nooit negatief. $\\sqrt{-25}$ <b>bestaat niet</b> in ℤ.</p>
      <p>$\\sqrt[3]{-125} = -5$ want $(-5)^3 = -125$: een derdemachtswortel van een negatief getal <b>bestaat wel</b>.</p></div>
    <div class="kader eig"><div class="kader-titel">Logaritme</div>
      <p>$\\log_2 16 = 4$ want $2^4 = 16$ &nbsp; · &nbsp; $\\log_{10} 1 = 0$ want $10^0 = 1$</p></div>
    ${PLUS_KADER(`<p>Staat er een <b>bewerking onder de wortel of in de logaritme</b>, reken die dan eerst uit. Pas daarna kijk je of de wortel bestaat.</p>
      <p class="midden">$\\sqrt{(-6)^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$ &nbsp; · &nbsp; $\\sqrt{5 - 2 \\cdot 7} = \\sqrt{-9}$ bestaat niet</p>
      <p class="midden">$\\sqrt{(-4)^2} = \\sqrt{16} = 4$, maar $\\sqrt{-4^2} = \\sqrt{-16}$ bestaat niet &nbsp; · &nbsp; $\\log_2 (-8 + 24) = \\log_2 16 = 4$</p>`)}`,
  voorbeelden: [
    { tex: '\\sqrt[3]{-4 \\cdot 16}', stappen: ['= \\sqrt[3]{-64}', '= -4'] },
    { tex: '\\log_3 [-3 \\cdot (-27)]', stappen: ['= \\log_3 81', '= 4 \\quad (3^4 = 81)'] },
    { tex: '-\\sqrt{49} + \\sqrt[3]{-27} - \\log_2 8', stappen: ['= -7 + (-3) - 3', '= -13'] },
  ],
  soorten: {
    wortel: { naam: 'Wortels van uitdrukkingen', gen() { const r = tot(() => kies(WORTEL_UITDR)());
      return { soort: 'wortel', opdracht: 'Bereken. Bestaat de uitkomst niet in ℤ, kies dan "bestaat niet".', tex: r.tex, antw: wortelKeuze(r.j, r.extra), uitleg: r.L }; } },
    log: { naam: 'Logaritmen van uitdrukkingen', gen() { const r = kies(LOG_UITDR)(); return { soort: 'log', opdracht: 'Bereken.', tex: r.tex, antw: getal(r.w), uitleg: r.L }; } },
    gemengd: { naam: 'Wortels en logaritmen samen', gen() { const r = tot(() => kies(GEMENGD_WL)()); return { soort: 'gemengd', opdracht: 'Bereken.', tex: r.tex, antw: getal(r.w), uitleg: r.L }; } },
  },
  oefenMix: [['wortel', 3], ['log', 2], ['gemengd', 2]],
  test: [['wortel', 4], ['log', 3], ['gemengd', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 5. Volgorde van de bewerkingen in ℤ +
// ---------------------------------------------------------------
const GENEST = [
  () => { // [a − (b − c)·d] : e
    const a = nz(-20, 20), b = nz(-9, 9), c = nz(-9, 9), d = nz2(-5, 5); const m = b - c; if (!m) return null;
    const p = m * d, s = a - p; if (!s) return null; const e = kies(delers(s).filter(x => Math.abs(x) <= 9)); if (!e) return null;
    return { tex: `[${tg(a)} - (${tg(b)} - ${h(c)}) \\cdot ${h(d)}] : ${h(e)}`, w: s / e,
      L: [`= [${tg(a)} - ${h(m)} \\cdot ${h(d)}] : ${h(e)}`, `= [${tg(a)} - ${h(p)}] : ${h(e)}`, `= ${tg(s)} : ${h(e)}`, `= ${tg(s / e)}`] };
  },
  () => { // (−k)^n − [p − q·(r − s)]
    const k = rnd(2, 3), n = k === 2 ? rnd(2, 5) : rnd(2, 3), p = nz(-15, 15), q = nz2(-6, 6), r = nz(-9, 9), s = nz(-9, 9); const m = r - s; if (!m) return null;
    const P = (-k) ** n, qm = q * m, bin = p - qm, w = P - bin;
    return { tex: `(-${k})^{${n}} - [${tg(p)} - ${h(q)} \\cdot (${tg(r)} - ${h(s)})]`, w,
      L: [`= ${tg(P)} - [${tg(p)} - ${h(q)} \\cdot ${h(m)}]`, `= ${tg(P)} - [${tg(p)} - ${h(qm)}]`, `= ${tg(P)} - ${h(bin)}`, `= ${tg(w)}`] };
  },
  () => { // a·[b² − (c − d)²]
    const a = nz2(-5, 5), b = nz(-7, 7), c = nz(-6, 6), d = nz(-6, 6); const m = c - d; if (!m || Math.abs(m) > 9) return null;
    const bin = b * b - m * m, w = a * bin; if (!bin || Math.abs(w) > 400) return null;
    return { tex: `${tg(a)} \\cdot [${h(b)}^2 - (${tg(c)} - ${h(d)})^2]`, w,
      L: [`= ${tg(a)} \\cdot [${h(b)}^2 - ${h(m)}^2]`, `= ${tg(a)} \\cdot [${b * b} - ${m * m}]`, `= ${tg(a)} \\cdot ${h(bin)}`, `= ${tg(w)}`] };
  },
  () => { // [(−a)² − b·c] : (d − e) + f
    const a = rnd(2, 9), b = nz(-8, 8), c = nz(-8, 8), d = nz(-9, 9), e = nz(-9, 9), f = nz(-15, 15); const de = d - e; if (Math.abs(de) < 2) return null;
    const bc = b * c, bin = a * a - bc; if (!bin || bin % de) return null; const q = bin / de, w = q + f;
    return { tex: `[(-${a})^2 - ${tg(b)} \\cdot ${h(c)}] : (${tg(d)} - ${h(e)}) + ${h(f)}`, w,
      L: [`= [${a * a} - ${h(bc)}] : ${h(de)} + ${h(f)}`, `= ${tg(bin)} : ${h(de)} + ${h(f)}`, `= ${tg(q)} + ${h(f)}`, `= ${tg(w)}`] };
  },
  () => { // −[x − (−y)]·(−z) − w²
    const x = nz(-12, 12), y = rnd(2, 9), z = rnd(2, 6), v = rnd(2, 5); const bin = x + y; if (!bin) return null; const w = bin * z - v * v;
    return { tex: `-[${tg(x)} - (-${y})] \\cdot (-${z}) - ${v}^2`, w,
      L: [`= -[${tg(x)} + ${y}] \\cdot (-${z}) - ${v}^2`, `= ${minVan(bin)} \\cdot (-${z}) - ${v * v}`, `= ${tg(-bin)} \\cdot (-${z}) - ${v * v}`, `= ${tg(bin * z)} - ${v * v}`, `= ${tg(w)}`] };
  },
  () => { // [√(p²) − ∛(−q³)]·(−r) + (−1)^n
    const p = rnd(2, 9), q = rnd(2, 5), r = rnd(2, 5), n = rnd(5, 40), s = (-1) ** n, w = -(p + q) * r + s;
    return { tex: `[\\sqrt{${p * p}} - \\sqrt[3]{-${q ** 3}}] \\cdot (-${r}) + (-1)^{${n}}`, w,
      L: [`= [${p} - (-${q})] \\cdot (-${r}) + (-1)^{${n}}`, `= ${p + q} \\cdot (-${r}) + ${h(s)}`, `= ${-(p + q) * r} ${pm(s)}`, `= ${tg(w)}`] };
  },
  () => { // (a − b)³ : [c − (d − e)]
    const a = nz(-9, 9), b = nz(-9, 9), m = a - b; if (!m || Math.abs(m) > 5) return null;
    const c = nz(-9, 9), d = nz(-9, 9), e = nz(-9, 9), de = d - e, den = c - de; if (Math.abs(den) < 2 || (m ** 3) % den) return null;
    return { tex: `(${tg(a)} - ${h(b)})^3 : [${tg(c)} - (${tg(d)} - ${h(e)})]`, w: m ** 3 / den,
      L: [`= ${h(m)}^3 : [${tg(c)} - ${h(de)}]`, `= ${tg(m ** 3)} : ${h(den)}`, `= ${tg(m ** 3 / den)}`] };
  },
];
// ---- haakjes plaatsen
function rekenTokens(t) { // t: [getal, op, getal, …] met '(' en ')'; null als een deling niet opgaat
  let i = 0, ok = true;
  const factor = () => { if (t[i] === '(') { i++; const v = som(); i++; return v; } return t[i++]; };
  const product = () => { let v = factor(); while (t[i] === '*' || t[i] === ':') { const op = t[i++], w = factor(); if (op === '*') v *= w; else { if (w === 0 || v % w) ok = false; v /= w; } } return v; };
  const som = () => { let v = product(); while (t[i] === '+' || t[i] === '-') { const op = t[i++], w = product(); v = op === '+' ? v + w : v - w; } return v; };
  const v = som(); return ok && isZ(v) ? v : null;
}
const OPTEX = { '+': '+', '-': '-', '*': '\\cdot', ':': ':' };
const tokTex = (t) => t.map((x, i) => typeof x === 'number' ? (i === 0 || t[i - 1] === '(' ? tg(x) : h(x)) : x === '(' || x === ')' ? x : ` ${OPTEX[x]} `).join('').replace(/\( /g, '(').replace(/ \)/g, ')');
function haakjesVraag() {
  const PATRONEN = [['+', '*', '-'], ['*', '+', '*'], ['-', '*', '+'], ['+', ':', '+'], ['*', '-', ':'], ['-', '*', '*'], [':', '+', '*'], ['-', ':', '-']];
  const PLAATS = [[0, 1], [1, 2], [2, 3], [0, 2], [1, 3]];
  for (;;) {
    const ops = kies(PATRONEN), g = [nz2(-9, 9), nz2(-9, 9), rnd(2, 9), nz2(-9, 9)];
    if (g.filter(x => x < 0).length < 2) continue;
    const bouw = (p) => { const t = []; g.forEach((x, i) => { if (p && i === p[0]) t.push('('); t.push(x); if (p && i === p[1]) t.push(')'); if (i < 3) t.push(ops[i]); }); return t; };
    const zonder = rekenTokens(bouw(null)); if (zonder === null) continue;
    const opties = [];
    for (const p of PLAATS) { const t = bouw(p), v = rekenTokens(t); if (v !== null && v !== zonder && !opties.some(o => o.v === v)) opties.push({ t, v }); }
    if (opties.length < 3) continue;
    const juist = kies(opties), lijst = schud([juist, ...schud(opties.filter(o => o !== juist)).slice(0, 3)]);
    const basis = tokTex(bouw(null));
    return { soort: 'haakjes', opdracht: `Waar moeten de haakjes staan zodat de uitkomst ${juist.v} is?`, tex: `${basis} = ${tg(juist.v)}`,
      antw: keuze(lijst.map((o, i) => ({ k: String(i), l: tokTex(o.t) })), lijst.indexOf(juist)),
      uitleg: [`\\text{zonder haakjes: } ${basis} = ${tg(zonder)}`, ...lijst.map(o => `${tokTex(o.t)} = ${tg(o.v)}${o === juist ? ' \\; ✓' : ''}`)] };
  }
}
const Z5 = {
  nr: 5, titel: 'Volgorde van de bewerkingen in ℤ +', kort: 'Vierkante haakjes, machten en wortels met mintekens, haakjes plaatsen.', rekenmachine: false,
  opdracht: 'Bereken zonder rekentoestel. Werk stap voor stap.',
  theorie: `${VOLGORDE}${REGELS_MAAL}
    ${PLUS_KADER(`<p>Werk de haakjes <b>van binnen naar buiten</b> uit en schrijf na elke stap de hele uitdrukking opnieuw. Zet een negatief getal na een bewerkingsteken altijd tussen haakjes.</p>
      <p class="midden">$[-8 - (3 - 7) \\cdot 5] : (-4) = [-8 - (-4) \\cdot 5] : (-4) = [-8 - (-20)] : (-4) = 12 : (-4) = -3$</p>
      <p><b>Haakjes plaatsen</b>: probeer de mogelijke plaatsen uit en reken telkens na.</p>`)}`,
  voorbeelden: [
    { tex: '(-2)^4 - [5 - 3 \\cdot (2 - 6)]', stappen: ['= 16 - [5 - 3 \\cdot (-4)]', '= 16 - [5 - (-12)]', '= 16 - 17', '= -1'] },
    { tex: '-[4 - (-3)] \\cdot (-2) - 3^2', stappen: ['= -[4 + 3] \\cdot (-2) - 3^2', '= -7 \\cdot (-2) - 9', '= 14 - 9', '= 5'] },
  ],
  soorten: {
    genest: { naam: 'Vierkante haakjes en volgorde', gen() { const r = tot(() => kies(GENEST)()); return { soort: 'genest', tex: r.tex, antw: getal(r.w), uitleg: r.L }; } },
    haakjes: { naam: 'Haakjes plaatsen', gen: haakjesVraag },
  },
  oefenMix: [['genest', 4], ['haakjes', 1]],
  test: [['genest', 8], ['haakjes', 2]], testSchudden: true,
};

// ---------------------------------------------------------------
// 6. Getallenas, ordenen en coördinaten +
// ---------------------------------------------------------------
const ZPOOL = [
  ['-2^4', -16], ['(-2)^4', 16], ['-(-4)^2', -16], ['(-4)^2', 16], ['-4^2', -16], ['(-3)^3', -27], ['-3^3', -27], ['\\sqrt[3]{-27}', -3], ['-\\log_3 27', -3],
  ['-\\sqrt{25}', -5], ['\\sqrt[3]{-125}', -5], ['-\\log_2 32', -5], ['(-1)^{99}', -1], ['-(-1)^{100}', -1], ['-5^0', -1], ['(-5)^0', 1], ['-(-2)^3', 8], ['2^3', 8],
  ['-\\sqrt{64}', -8], ['\\sqrt[3]{-512}', -8], ['(-2)^3', -8], ['-10^2', -100], ['(-10)^2', 100], ['-\\sqrt{100}', -10], ['\\sqrt[3]{-1000}', -10], ['-2^5', -32], ['(-2)^5', -32],
  ['-(-2)^5', 32], ['-6^2', -36], ['-\\sqrt{36}', -6], ['\\sqrt[3]{-216}', -6], ['-\\log_2 64', -6], ['(-3)^2 - 12', -3], ['-7 \\cdot (-2)', 14], ['-\\sqrt{196}', -14], ['-15 + 1', -14],
  ['-3^2 + 2', -7], ['-\\sqrt{49}', -7], ['(-1)^7 \\cdot 7', -7], ['-48 : 6', -8], ['-(-9)', 9], ['-3^2', -9], ['(-3)^2', 9], ['\\sqrt[3]{-8} \\cdot 4', -8], ['(-5)^2', 25], ['-5^2', -25],
];
const ZGRENS = [['-2^2', -4], ['(-2)^2', 4], ['\\sqrt[3]{-8}', -2], ['-\\sqrt{9}', -3], ['(-1)^{5}', -1], ['-(-1)^{4}', -1], ['-3^0', -1], ['(-3)^0', 1], ['-\\log_2 8', -3], ['\\log_2 4', 2],
  ['-\\sqrt{16}', -4], ['\\sqrt[3]{-125}', -5], ['-2 \\cdot 3', -6], ['-12 : 4', -3], ['(-2)^3 : 4', -2], ['-(-2)', 2], ['\\sqrt[3]{27}', 3], ['-5 + 5', 0], ['-\\log_{10} 100', -2], ['-\\sqrt{25} + 1', -4], ['-2^3 : 2', -4], ['3 - 2^3', -5], ['(-1)^{20}', 1]];
function grensTekens(lo, hi, li, ri) { const w = []; for (let k = li ? lo : lo + 1; k <= (ri ? hi : hi - 1); k++) w.push(k); return w; }
const Z6 = {
  nr: 6, titel: 'Getallenas, ordenen en coördinaten +', kort: 'Vergelijken met machten en wortels, andere ijking, oplossingen in ℤ, twee punten aflezen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De getallenas in ℤ</div>
      <p>Links van $0$ staan de negatieve getallen. <b>Hoe verder naar links, hoe kleiner</b>: $-12 < -2$ en $-3 > -8$.</p>
      ${getallenas([{ x: -6, label: 'A' }, { x: -1, label: 'B' }, { x: 3, label: 'C' }], -8, 8)}</div>
    <div class="kader def"><div class="kader-titel">Coördinaten in het rooster</div>
      <p>Een punt $P(x, y)$: eerst de $x$-coördinaat (horizontaal), dan de $y$-coördinaat (verticaal).</p>
      ${rooster([{ x: 3, y: 4, label: 'A' }, { x: -5, y: 2, label: 'B' }, { x: -2, y: -4, label: 'C' }])}</div>
    ${PLUS_KADER(`<p><b>Andere ijking</b>: uit twee getallen bij de streepjes haal je de afstand tussen twee streepjes.</p>
      ${getallenasIjking(-40, 10, 9, [1, 3], [{ i: 6, label: 'A' }])}
      <p class="klein">Tussen twee streepjes zit $(-10 - (-30)) : 2 = 10$. A ligt 3 streepjes rechts van $-10$: $A = -10 + 3 \\cdot 10 = 20$.</p>
      <p><b>Oplossingen in ℤ opsommen</b>: reken eerst de grenzen uit. $-2^2 < x \\leq (-1)^3$ wordt $-4 < x \\leq -1$, dus $V = \\{-3 ; -2 ; -1\\}$.
        Voldoet geen enkel geheel getal, dan is $V = \\varnothing$.</p>`)}
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Scheid de getallen met een puntkomma: <code>-3 ; -2 ; -1</code>. Is er geen oplossing, klik dan op $V = \\varnothing$.</p></div>`,
  voorbeelden: [
    { tex: '-2^4 \\;\\ldots\\; (-2)^3', stappen: ['-2^4 = -16 \\text{ en } (-2)^3 = -8', '-16 < -8'] },
    { tex: '\\sqrt[3]{-8} \\leq x < \\log_2 4 \\quad (x \\in \\mathbb{Z})', stappen: ['-2 \\leq x < 2', 'V = \\{-2 ; -1 ; 0 ; 1\\}'] },
  ],
  soorten: {
    vergelijk: { naam: 'Vergelijken met machten, wortels en logaritmen', gen() {
      return tot(() => { const [ta, a] = kies(ZPOOL), [tb, b] = kies(ZPOOL); if (ta === tb || Math.abs(a - b) > Math.max(3, Math.max(Math.abs(a), Math.abs(b)) * 0.3)) return null;
        return { soort: 'vergelijk', opdracht: 'Vul in: <, > of =.', tex: `${ta} \\;\\ldots\\; ${tb}`, antw: keuze(VERGELIJK, vgl(a, b)), uitleg: [`${ta} = ${tg(a)} \\text{ en } ${tb} = ${tg(b)}`, `${ta} ${vgl(a, b)} ${tb}`] }; });
    } },
    ordenen: { naam: 'Het kleinste of het grootste getal', gen() {
      return tot(() => {
        const vier = schud(ZPOOL).slice(0, 4), ws = vier.map(x => x[1]); if (new Set(ws).size < 4) return null;
        if (Math.max(...ws) - Math.min(...ws) > 40) return null;
        const klein = Math.random() < 0.5, doel = klein ? Math.min(...ws) : Math.max(...ws), j = ws.indexOf(doel);
        return { soort: 'ordenen', opdracht: `Welk getal is het ${klein ? 'kleinst' : 'grootst'}?`, tex: vier.map(x => x[0]).join(' \\qquad '), sleutel: vier.map(x => x[0]).join('|') + klein,
          antw: keuze(vier.map((x, i) => ({ k: String(i), l: x[0] })), j),
          uitleg: [vier.map(x => `${x[0]} = ${tg(x[1])}`).join(' \\quad '), `\\text{het ${klein ? 'kleinst' : 'grootst'}: } ${vier[j][0]}`] };
      });
    } },
    aflezen: { naam: 'Aflezen bij een andere ijking', gen() {
      const stap = kies([2, 5, 10, 20, 25, 50]), n = 9, start = -stap * rnd(2, 9);
      let labels, pos;
      do { const i = rnd(0, n - 3); labels = kies([[i, i + 1], [i, i + 2]]); pos = rnd(0, n - 1); } while (labels.includes(pos) || labels[1] > n - 1);
      const x = start + pos * stap, l0 = start + labels[0] * stap, l1 = start + labels[1] * stap;
      return { soort: 'aflezen', opdracht: 'Welk getal stelt het punt A voor?', html: getallenasIjking(start, stap, n, labels, [{ i: pos, label: 'A' }]), sleutel: `as${start}-${stap}-${labels}-${pos}`,
        rapport: `as met ${l0} en ${l1}, punt A op ${x}`, antw: getal(x, { voor: 'A =' }),
        uitleg: [`\\text{afstand tussen twee streepjes: } (${tg(l1)} - ${h(l0)}) : ${labels[1] - labels[0]} = ${stap}`, `A = ${tg(x)}`] };
    } },
    opsommen: { naam: 'Oplossingen in ℤ opsommen (ook ∅)', gen() {
      return tot(() => {
        const [tl, l] = kies(ZGRENS), [tr, r] = kies(ZGRENS), li = kies([true, false]), ri = kies([true, false]);
        if (tl === tr || r - l < 0 || r - l > 6) return null;
        const w = grensTekens(l, r, li, ri); if (!w.length && Math.random() < 0.6) return null;
        const ong = `${li ? '\\leq' : '<'} x ${ri ? '\\leq' : '<'}`;
        return { soort: 'opsommen', opdracht: 'Welke gehele getallen voldoen? Noteer de oplossingsverzameling.', tex: `${tl} ${ong} ${tr} \\quad (x \\in \\mathbb{Z})`,
          antw: w.length ? { soort: 'Vmeer', waarden: w, dec: 0 } : { soort: 'Vmeer', waarden: [], leeg: true },
          uitleg: [`${tg(l)} ${ong} ${tg(r)}`, w.length ? `V = \\{${w.map(tg).join(' ; ')}\\}` : 'V = \\varnothing \\quad \\text{(geen enkel geheel getal voldoet)}'] };
      });
    } },
    coord: { naam: 'Coördinaten van twee punten', gen() {
      let A, B; do { A = { x: nz(-6, 6), y: nz(-6, 6) }; B = { x: nz(-6, 6), y: nz(-6, 6) }; } while ((A.x === B.x && A.y === B.y) || A.x * B.x > 0 && A.y * B.y > 0);
      return { soort: 'coord', opdracht: 'Lees de coördinaten van de punten A en B af.', html: rooster([{ ...A, label: 'A' }, { ...B, label: 'B' }]), sleutel: `A${A.x},${A.y}B${B.x},${B.y}`, rapport: `A(${A.x}, ${A.y}) en B(${B.x}, ${B.y})`,
        antw: { soort: 'delen', delen: [{ label: '\\text{A: } x =', antw: getal(A.x, { voor: '' }) }, { label: '\\text{A: } y =', antw: getal(A.y, { voor: '' }) },
          { label: '\\text{B: } x =', antw: getal(B.x, { voor: '' }) }, { label: '\\text{B: } y =', antw: getal(B.y, { voor: '' }) }] },
        uitleg: [`A(${tg(A.x)}, ${tg(A.y)}) \\quad B(${tg(B.x)}, ${tg(B.y)})`, '\\text{eerst horizontaal (}x\\text{), dan verticaal (}y\\text{)}'] };
    } },
  },
  oefenMix: [['vergelijk', 2], ['ordenen', 1], ['aflezen', 1], ['opsommen', 2], ['coord', 1]],
  test: [['vergelijk', 3], ['ordenen', 2], ['aflezen', 2], ['opsommen', 2], ['coord', 1]], testSchudden: true,
};

// ---------------------------------------------------------------
// 7. Eentermen en veeltermen in ℤ +
// ---------------------------------------------------------------
// elk sjabloon: tex (opgave), e (typbaar voor de controle), L (stappen), r = [[coëf, letters], …] (uitkomst)
const VEREENV = [
  () => { // pa − q[ra − (s − ta)]
    const p = nz(-9, 9), q = rnd(2, 5), r = rnd(2, 6), s = rnd(1, 9), t = rnd(2, 6);
    const r1 = [[p - q * (r + t), 'a'], [q * s, '']];
    return { tex: `${ct(p)}a - ${q}[${r}a - (${s} - ${t}a)]`, e: `${p}a-${q}*(${r}a-(${s}-${t}a))`,
      L: [`= ${ct(p)}a - ${q}[${r}a - ${s} + ${t}a]`, `= ${ct(p)}a - ${q}[${zSom([[r + t, 'a'], [-s, '']])}]`, `= ${zSom([[p, 'a'], [-q * (r + t), 'a'], [q * s, '']])}`], r: r1 };
  },
  () => { // −p(qa − rb) − s(−ta + ub)
    const p = rnd(2, 5), q = rnd(2, 6), r = rnd(1, 6), s = rnd(2, 5), t = rnd(1, 6), u = rnd(1, 6);
    return { tex: `-${p}(${ct(q)}a - ${ct(r)}b) - ${s}(-${ct(t)}a + ${ct(u)}b)`, e: `-${p}*(${q}a-${r}b)-${s}*(-${t}a+${u}b)`,
      L: [`= ${zSom([[-p * q, 'a'], [p * r, 'b'], [s * t, 'a'], [-s * u, 'b']])}`], r: [[-p * q + s * t, 'a'], [p * r - s * u, 'b']] };
  },
  () => { // a − p[q − (a − r)]
    const p = rnd(2, 6), q = nz(-9, 9), r = rnd(1, 9);
    return { tex: `a - ${p}[${tg(q)} - (a - ${r})]`, e: `a-${p}*(${q}-(a-${r}))`,
      L: [`= a - ${p}[${tg(q)} - a + ${r}]`, `= a - ${p}[${zSom([[q + r, ''], [-1, 'a']])}]`, `= ${zSom([[1, 'a'], [-p * (q + r), ''], [p, 'a']])}`], r: [[1 + p, 'a'], [-p * (q + r), '']] };
  },
  () => { // pa² − (qa − ra²) + sa(t − a)
    const p = nz(-6, 6), q = rnd(2, 9), r = rnd(1, 6), s = rnd(2, 5), t = nz(-6, 6);
    return { tex: `${ct(p)}a^2 - (${q}a - ${ct(r)}a^2) + ${s}a(${tg(t)} - a)`, e: `${p}a^2-(${q}a-${r}a^2)+${s}a*(${t}-a)`,
      L: [`= ${zSom([[p, 'a^2'], [-q, 'a'], [r, 'a^2'], [s * t, 'a'], [-s, 'a^2']])}`], r: [[p + r - s, 'a^2'], [s * t - q, 'a']] };
  },
  () => { // −(pa − q) − [r − (sa + t)]
    const p = rnd(2, 9), q = nz(-9, 9), r = nz(-9, 9), s = rnd(2, 9), t = rnd(1, 9);
    return { tex: `-(${p}a ${pm(-q)}) - [${tg(r)} - (${s}a + ${t})]`, e: `-(${p}a-(${q}))-(${r}-(${s}a+${t}))`,
      L: [`= ${zSom([[-p, 'a'], [q, '']])} - [${tg(r)} - ${s}a - ${t}]`, `= ${zSom([[-p, 'a'], [q, ''], [-r, ''], [s, 'a'], [t, '']])}`], r: [[s - p, 'a'], [q - r + t, '']] };
  },
];
function vereenvVraag() {
  return tot(() => {
    const v = kies(VEREENV)(); if (v.r.some(x => x[0] === 0)) return null;
    const j = zSom(v.r), jt = j.replace(/\s+/g, '').replace(/a\^2/g, 'a^2');
    return { tex: v.tex, e: v.e, j, jt, L: [...v.L, `= ${j}`], r: v.r };
  });
}
const GWZ = [
  { tex: '-a^2 + 2ab - b^3', f: (a, b) => -a * a + 2 * a * b - b ** 3, L: (a, b) => [`= -${h(a)}^2 + 2 \\cdot ${h(a)} \\cdot ${h(b)} - ${h(b)}^3`, `= -${a * a} + ${h(2 * a * b)} - ${h(b ** 3)}`] },
  { tex: 'a^3 - (a - b)^2', f: (a, b) => a ** 3 - (a - b) ** 2, L: (a, b) => [`= ${h(a)}^3 - (${tg(a)} - ${h(b)})^2`, `= ${tg(a ** 3)} - ${h(a - b)}^2`, `= ${tg(a ** 3)} - ${(a - b) ** 2}`] },
  { tex: '-2a^2b + ab^2', f: (a, b) => -2 * a * a * b + a * b * b, L: (a, b) => [`= -2 \\cdot ${h(a)}^2 \\cdot ${h(b)} + ${h(a)} \\cdot ${h(b)}^2`, `= -2 \\cdot ${a * a} \\cdot ${h(b)} + ${h(a)} \\cdot ${b * b}`, `= ${tg(-2 * a * a * b)} + ${h(a * b * b)}`] },
  { tex: '(a + b)(a - b) - a^2', f: (a, b) => (a + b) * (a - b) - a * a, L: (a, b) => [`= (${tg(a)} + ${h(b)})(${tg(a)} - ${h(b)}) - ${h(a)}^2`, `= ${h(a + b)} \\cdot ${h(a - b)} - ${a * a}`, `= ${tg((a + b) * (a - b))} - ${a * a}`] },
  { tex: 'a^2 - 3ab - (-b)^2', f: (a, b) => a * a - 3 * a * b - b * b, L: (a, b) => [`= ${h(a)}^2 - 3 \\cdot ${h(a)} \\cdot ${h(b)} - ${h(-b)}^2`, `= ${a * a} - ${h(3 * a * b)} - ${b * b}`] },
  { tex: '-a(b^2 - a)', f: (a, b) => -a * (b * b - a), L: (a, b) => [`= ${minVan(a)} \\cdot (${h(b)}^2 - ${h(a)})`, `= ${tg(-a)} \\cdot (${b * b} - ${h(a)})`, `= ${tg(-a)} \\cdot ${h(b * b - a)}`] },
];
const Z7 = {
  nr: 7, titel: 'Eentermen en veeltermen in ℤ +', kort: 'Haakjes in haakjes met mintekens, getalwaarde met negatieve getallen en machten.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Eentermen en veeltermen</div>
      <p>Enkel <b>gelijksoortige eentermen</b> (zelfde lettergedeelte) tel je samen: $6a - 9a = -3a$, maar $3a$ en $3a^2$ niet.</p>
      <p>$-3(2a - 5) = -6a + 15$ &nbsp; · &nbsp; $-(4a - b) = -4a + b$ (een minteken vóór de haakjes verandert alle tekens).</p></div>
    ${PLUS_KADER(`<p><b>Haakjes in haakjes</b>: werk eerst de <b>binnenste</b> haakjes uit, dan de vierkante haakjes.</p>
      <p class="midden">$2a - 3[a - (4 - a)] = 2a - 3[a - 4 + a] = 2a - 3[2a - 4] = 2a - 6a + 12 = -4a + 12$</p>
      <p><b>Getalwaarde</b>: zet elk negatief getal tussen haakjes. Let op: $-a^2$ voor $a = -3$ is $-(-3)^2 = -9$, en $(-b)^2$ voor $b = -2$ is $2^2 = 4$.</p>
      <p>Is de uitdrukking lang, vereenvoudig dan eerst en substitueer daarna pas.</p>`)}
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Typ bv. <code>-4a + 12</code> of <code>-2a^2 + 5a</code>.</p></div>`,
  voorbeelden: [
    { tex: '-2(3a - b) - 4(-a + 2b)', stappen: ['= -6a + 2b + 4a - 8b', '= -2a - 6b'] },
    { tex: '-a^2 + 2ab \\quad \\text{voor } a = -3, \\; b = 2', stappen: ['= -(-3)^2 + 2 \\cdot (-3) \\cdot 2', '= -9 + (-12)', '= -21'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Haakjes in haakjes', opdracht: 'Werk de haakjes uit en vereenvoudig.', gen() {
      const r = vereenvVraag(); return { soort: 'vereenvoudig', opdracht: 'Werk de haakjes uit en vereenvoudig.', tex: r.tex, antw: vt(r.e, r.j), uitleg: r.L,
        controle: () => VT.controleer(r.jt, r.e, 'uitgewerkt').status === 'juist' ? null : 'uitkomst klopt niet: ' + r.j }; } },
    getalwaarde: { naam: 'Getalwaarde met negatieve getallen', gen() {
      return tot(() => { const G = kies(GWZ), a = nz(-5, 5), b = nz(-4, 4); if (a > 0 && b > 0) return null; const w = G.f(a, b); if (Math.abs(w) > 300) return null;
        return { soort: 'getalwaarde', opdracht: 'Bereken de getalwaarde.', tex: `${G.tex} \\quad \\text{voor } a = ${tg(a)}, \\; b = ${tg(b)}`, antw: getal(w), uitleg: [...G.L(a, b), `= ${tg(w)}`] }; });
    } },
    eerst: { naam: 'Eerst vereenvoudigen, dan de getalwaarde', gen() {
      return tot(() => { const r = vereenvVraag(); if (r.r.some(x => x[1] === 'b')) return null; const a = nz(-5, 5);
        const w = r.r.reduce((s, [c, l]) => s + c * (l === 'a^2' ? a * a : l === 'a' ? a : 1), 0); if (Math.abs(w) > 300) return null;
        const sub = r.r.map(([c, l], i) => `${i === 0 ? (c < 0 ? '-' : '') : c < 0 ? '- ' : '+ '}${Math.abs(c)}${l === 'a^2' ? ` \\cdot ${h(a)}^2` : l === 'a' ? ` \\cdot ${h(a)}` : ''}`).join(' ');
        return { soort: 'eerst', opdracht: 'Vereenvoudig eerst. Bereken daarna de getalwaarde.', tex: `${r.tex} \\quad \\text{voor } a = ${tg(a)}`, sleutel: r.tex + a,
          antw: { soort: 'delen', delen: [{ label: '\\text{vereenvoudigd:}', antw: vt(r.e, r.j) }, { label: '\\text{getalwaarde:}', antw: getal(w) }] },
          uitleg: [...r.L, `\\text{voor } a = ${tg(a)}: \\; ${sub}`, `= ${tg(w)}`] }; });
    } },
  },
  oefenMix: [['vereenvoudig', 3], ['getalwaarde', 2], ['eerst', 1]],
  test: [['vereenvoudig', 4], ['getalwaarde', 3], ['eerst', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 8. Rekenregels met machten en veeltermen +
// ---------------------------------------------------------------
const MREGELS = `<div class="kader def"><div class="kader-titel">Rekenregels met machten</div>
  <table class="tabel"><tr><td>vermenigvuldigen</td><td>$x^m \\cdot x^n = x^{m+n}$</td></tr><tr><td>delen</td><td>$x^m : x^n = x^{m-n}$</td></tr>
  <tr><td>macht van een macht</td><td>$(x^m)^n = x^{m \\cdot n}$</td></tr><tr><td>macht van een product</td><td>$(x \\cdot y)^n = x^n \\cdot y^n$</td></tr></table>
  <p>Bij eentermen: <b>getallen met getallen</b>, <b>letters met letters</b>: $-3x^2 \\cdot 5x^4 = -15x^6$ &nbsp; · &nbsp; $(-2a^3)^3 = -8a^9$</p></div>`;
const xe = (e) => e === 0 ? '' : e === 1 ? 'x' : `x^{${e}}`;
const ae = (l, e) => e === 0 ? '' : e === 1 ? l : `${l}^{${e}}`;
const MRP = [
  () => { const p = kies([-2, 2, -3, 3]), k = kies([2, 3]), m = rnd(2, 3), n = rnd(1, 3), c = p ** k, ex = m * k + n;
    return { tex: `(${tg(p)}a^{${m}})^{${k}} \\cdot a^{${n}}`, e: `(${p}a^${m})^${k}*a^${n}`, L: [`= ${h(p)}^{${k}} \\cdot a^{${m} \\cdot ${k}} \\cdot a^{${n}}`, `= ${tg(c)}a^{${m * k}} \\cdot a^{${n}}`], j: `${ct(c)}a^{${ex}}` }; },
  () => { const p = kies([-2, -3, -4]), m = rnd(1, 3), q = nz2(-5, 5), n = rnd(1, 3), c = p * p * q;
    return { tex: `(${tg(p)}${xe(m)}y)^2 \\cdot ${q < 0 ? `(${tg(q)}xy^{${n}})` : `${q}xy^{${n}}`}`, e: `(${p}x^${m}y)^2*(${q}xy^${n})`,
      L: [`= ${p * p}${xe(2 * m)}y^2 \\cdot ${q < 0 ? `(${tg(q)}xy^{${n}})` : `${q}xy^{${n}}`}`], j: `${ct(c)}${xe(2 * m + 1)}${ae('y', 2 + n)}` }; },
  () => { const p = kies([-2, 2, -3, 3]), n = rnd(1, 3), q = nz2(-5, 5), c = q * p * p, m = 2 * n + rnd(1, 5);
    return { tex: `${tg(c)}a^{${m}} : (${tg(p)}a^{${n}})^2`, e: `${q}a^${m - 2 * n}`, L: [`= ${tg(c)}a^{${m}} : ${p * p}a^{${2 * n}}`, `= (${tg(c)} : ${p * p}) \\cdot a^{${m} - ${2 * n}}`], j: `${ct(q)}a^{${m - 2 * n}}`.replace('a^{1}', 'a') }; },
  () => { const m = rnd(2, 3), k = rnd(2, 3), j0 = rnd(2, 3), s = (-1) ** k * (-1) ** j0, ex = m * k + j0;
    return { tex: `(-a^{${m}})^{${k}} \\cdot (-a)^{${j0}}`, e: `(-a^${m})^${k}*(-a)^${j0}`, L: [`= ${k % 2 ? '-' : ''}a^{${m * k}} \\cdot ${j0 % 2 ? '(-' : ''}a^{${j0}}${j0 % 2 ? ')' : ''}`], j: `${s < 0 ? '-' : ''}a^{${ex}}` }; },
  () => { const p = kies([-3, -2, 2, 3]), m = rnd(1, 3), q = kies([-2, -1]), r0 = p * p * q ** 3, ds = delers(r0).filter(d => Math.abs(d) <= 12); const r = kies(ds.length ? ds : [1]), n = rnd(1, 2 * m + 2), c = r0 / r, ex = 2 * m + 3 - n;
    return { tex: `(${tg(p)}${xe(m)})^2 \\cdot (${tg(q)}x)^3 : ${r < 0 ? `(${tg(r)}${xe(n)})` : `${r}${xe(n)}`}`, e: `${c}x^${ex}`,
      L: [`= ${p * p}${xe(2 * m)} \\cdot ${h(q ** 3)}x^3 : ${h(r)}${xe(n)}`, `= ${tg(p * p * q ** 3)}${xe(2 * m + 3)} : ${h(r)}${xe(n)}`], j: `${ct(c)}${xe(ex)}` }; },
  () => { const m = rnd(1, 3), n = rnd(1, 3), k = rnd(2, 4), s = k % 2 ? -1 : 1;
    return { tex: `(-${xe(m)}y^{${n}})^{${k}}`, e: `(-x^${m}y^${n})^${k}`, L: [`= (-1)^{${k}} \\cdot x^{${m} \\cdot ${k}} \\cdot y^{${n} \\cdot ${k}}`], j: `${s < 0 ? '-' : ''}${xe(m * k)}${ae('y', n * k)}` }; },
];
// veeltermen in x: termen [[coëf, exponent], …]
const pT = (ts) => zSom(ts.map(([c, e]) => [c, xe(e)]));
const pE = (ts) => ts.map(([c, e]) => `${c < 0 ? '-' : '+'}${Math.abs(c)}${e ? `*x^${e}` : ''}`).join('').replace(/^\+/, '');
const maalT = (A, B) => { const r = []; A.forEach(([c, e]) => B.forEach(([d, f]) => r.push([c * d, e + f]))); return r; };
const samen = (ts) => { const m = new Map(); ts.forEach(([c, e]) => m.set(e, (m.get(e) || 0) + c)); return [...m.entries()].filter(x => x[1]).sort((a, b) => b[0] - a[0]).map(([e, c]) => [c, e]); };
const UITWP = [
  () => { const p = nz(-6, 6), q = nz(-5, 5), r = nz(-6, 6); const A = [[1, 1], [p, 0]], B = [[1, 2], [q, 1], [r, 0]]; return { delen: [[1, A, B]] }; },
  () => { const a = nz2(-4, 4), b = nz(-6, 6), c = nz2(-4, 4), d = nz(-6, 6), e = nz(-5, 5), f = nz(-6, 6); return { delen: [[1, [[a, 1], [b, 0]], [[c, 1], [d, 0]]], [-1, [[1, 1]], [[e, 1], [f, 0]]]] }; },
  () => { const p = rnd(2, 4), q = nz(-5, 5), r = nz(-6, 6), s = nz(-6, 6), t = nz(-6, 6); return { delen: [[-p, [[1, 1]], [[1, 2], [q, 1], [r, 0]]], [1, [[1, 1], [s, 0]], [[1, 1], [t, 0]]]] }; },
  () => { const p = nz(-6, 6), q = nz(-5, 5); return { delen: [[1, [[1, 2], [p, 0]], [[1, 2], [q, 1]]]] }; },
];
function uitwerkVraag() {
  return tot(() => {
    const { delen } = kies(UITWP)();
    let tex = '', e = '', ruw = [];
    delen.forEach(([k, A, B], i) => {
      const kTex = k === 1 ? '' : k === -1 ? '' : `${Math.abs(k)}`;
      const voor = i === 0 ? (k < 0 ? '-' : '') : k < 0 ? ' - ' : ' + ';
      const fA = A.length === 1 && A[0][0] === 1 ? xe(A[0][1]) : `(${pT(A)})`;
      tex += `${voor}${kTex}${fA}(${pT(B)})`;
      e += `${i === 0 ? '' : '+'}(${k})*(${pE(A)})*(${pE(B)})`;
      ruw = ruw.concat(maalT(maalT([[k, 0]], A), B));
    });
    const res = samen(ruw); if (res.length < 2) return null;
    return { soort: 'uitwerken', opdracht: 'Werk uit en vereenvoudig.', tex, antw: vt(e, pT(res)), uitleg: ['\\text{elke term maal elke term:}', `= ${pT(ruw)}`, ...(pT(ruw) === pT(res) ? [] : [`= ${pT(res)}`])],
      controle: () => VT.controleer(pE(res), e, 'uitgewerkt').status === 'juist' ? null : 'uitkomst klopt niet' };
  });
}
const Z8 = {
  nr: 8, titel: 'Rekenregels met machten en veeltermen +', kort: 'Meerdere rekenregels na elkaar met mintekens, langere veeltermen uitwerken.', rekenmachine: false,
  theorie: `${MREGELS}
    <div class="kader eig"><div class="kader-titel">Veeltermen uitwerken</div>
      <p>Vermenigvuldig elke term met elke term en tel gelijksoortige termen samen: $(x + 4)(x^2 - 3) = x^3 - 3x + 4x^2 - 12 = x^3 + 4x^2 - 3x - 12$</p></div>
    ${PLUS_KADER(`<p><b>Meerdere regels na elkaar</b>: werk eerst de machten van haakjes uit, dan vermenigvuldigen en delen van links naar rechts.</p>
      <p class="midden">$(-2a^3)^3 \\cdot a^2 = -8a^9 \\cdot a^2 = -8a^{11}$ &nbsp; · &nbsp; $(-a^2)^3 = -a^6$, maar $(-a^2)^2 = a^4$</p>
      <p><b>Een min vóór een product</b>: $-x(2x - 5)$ geeft $-2x^2 + 5x$. Werk alle producten uit en tel pas op het einde samen.</p>`)}
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Een macht met <code>^</code>: <code>-8a^11</code>, <code>x^6y^3</code>, <code>2x^3 - 5x^2 + x - 6</code>.</p></div>`,
  voorbeelden: [
    { tex: '24a^9 : (-2a^2)^3', stappen: ['= 24a^9 : (-8a^6)', '= -3a^3'] },
    { tex: '(2x - 1)(x + 3) - x(x - 4)', stappen: ['= 2x^2 + 6x - x - 3 - x^2 + 4x', '= x^2 + 9x - 3'] },
  ],
  soorten: {
    regels: { naam: 'Meerdere rekenregels na elkaar', gen() { const r = kies(MRP)(); return { soort: 'regels', opdracht: 'Vereenvoudig met de rekenregels van machten.', tex: r.tex, antw: vt(r.e, r.j), uitleg: [...r.L, `= ${r.j}`],
      controle: () => { const t = r.j.replace(/[{}]/g, ''); return VT.controleer(t, r.e, 'uitgewerkt').status === 'juist' ? null : 'uitkomst klopt niet: ' + t; } }; } },
    uitwerken: { naam: 'Langere veeltermen uitwerken', gen: uitwerkVraag },
  },
  oefenMix: [['regels', 3], ['uitwerken', 2]],
  test: [['regels', 5], ['uitwerken', 5]], testSchudden: true,
};

// ---------------------------------------------------------------
// 9. Verbanden in tabellen +
// ---------------------------------------------------------------
function verbandTabelPlus() {
  for (;;) {
    const soort = kies(['recht', 'omgekeerd', 'lineair']);
    let xs, f, uitleg, k, b, c, x0;
    if (soort === 'recht') { k = nz2(-9, 9); xs = schud([-6, -4, -3, -2, -1, 1, 2, 3, 5]).slice(0, 6).sort((p, q) => p - q); f = (x) => k * x; uitleg = `y : x = ${tg(k)} \\text{ is constant}`; x0 = kies([10, -10, 12, -12, 20]); }
    else if (soort === 'omgekeerd') { c = kies([24, 36, 48, 60, 72, -24, -36, -48, -60, -72]); const ds = delers(c).filter(d => Math.abs(d) <= 12); xs = schud(ds).slice(0, 6).sort((p, q) => p - q); f = (x) => c / x; uitleg = `x \\cdot y = ${tg(c)} \\text{ is constant}`;
      const rest = delers(c).filter(d => !xs.includes(d)); if (!rest.length) continue; x0 = kies(rest); }
    else { k = nz(-6, 6); b = nz(-12, 12); const s = rnd(-4, -1); xs = [s, s + 1, s + 2, s + 3, s + 4, s + 5]; f = (x) => k * x + b; uitleg = `x + 1 \\text{ geeft telkens } y ${pm(k)}; \\text{ bij } x = 0 \\text{ is } y = ${tg(b)} \\neq 0`; x0 = kies([10, -10, 8, -8, 20]); }
    if (xs.includes(x0)) continue;
    const j = rnd(1, xs.length - 2);
    return { soort, xs, ys: xs.map(f), j, uitleg, k, b, c, x0, y0: f(x0) };
  }
}
const tabelTex = (t, verberg = true) => `\\begin{array}{c|${'c'.repeat(t.xs.length)}} x & ${t.xs.map(tg).join(' & ')} \\\\ \\hline y & ${t.ys.map((y, i) => verberg && i === t.j ? '\\;?\\;' : tg(y)).join(' & ')} \\end{array}`;
const voorschriftTex = (t) => t.soort === 'recht' ? `y = ${ct(t.k)}x` : t.soort === 'omgekeerd' ? `x \\cdot y = ${tg(t.c)}` : `y = ${ct(t.k)}x ${pm(t.b)}`;
const Z9 = {
  nr: 9, titel: 'Verbanden in tabellen +', kort: 'Negatieve getallen in de tabel, een waarde buiten de tabel, het voorschrift kiezen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Drie soorten verbanden</div>
      <table class="tabel"><tr><th>verband</th><th>hoe herken je het?</th><th>voorbeeld</th></tr>
      <tr><td><b>recht evenredig</b></td><td>$y : x$ is constant (het quotiënt)</td><td>ticket € 6: $p = 6t$</td></tr>
      <tr><td><b>omgekeerd evenredig</b></td><td>$x \\cdot y$ is constant (het product)</td><td>48 stoelen over $r$ rijen: $r \\cdot s = 48$</td></tr>
      <tr><td><b>lineair</b></td><td>als $x$ telkens met 1 stijgt, verandert $y$ telkens met hetzelfde getal; bij $x = 0$ is $y \\neq 0$</td><td>€ 25 lidgeld + € 5 per beurt</td></tr></table></div>
    ${PLUS_KADER(`<p>Ook met <b>negatieve getallen</b> werkt dat zo: $y : x = -4$ (recht), $x \\cdot y = -36$ (omgekeerd) of $y$ daalt telkens met 3 (lineair).</p>
      <p><b>Het voorschrift</b> zegt hoe je $y$ uit $x$ berekent: &nbsp; $y = -4x$ &nbsp; · &nbsp; $x \\cdot y = -36$ &nbsp; · &nbsp; $y = -3x + 5$.
        Daarmee vind je ook een waarde die <b>niet</b> in de tabel staat: voor $x = 10$ is $y = -4 \\cdot 10 = -40$.</p>`)}`,
  voorbeelden: [
    { tex: '\\begin{array}{c|cccccc} x & -6 & -4 & -3 & 2 & 4 & 12 \\\\ \\hline y & 6 & 9 & 12 & -18 & -9 & -3 \\end{array}', stappen: ['x \\cdot y = -36 \\text{ is constant: omgekeerd evenredig}', '\\text{voor } x = -9: \\; y = -36 : (-9) = 4'] },
    { tex: '\\begin{array}{c|cccccc} x & -2 & -1 & 0 & 1 & 2 & 3 \\\\ \\hline y & 11 & 8 & 5 & 2 & -1 & -4 \\end{array}', stappen: ['x + 1 \\Rightarrow y - 3, \\; \\text{bij } x = 0 \\text{ is } y = 5', 'y = -3x + 5', '\\text{voor } x = 10: \\; y = -30 + 5 = -25'] },
  ],
  soorten: {
    verband: { naam: 'Verband, ontbrekende waarde en waarde buiten de tabel', gen() {
      const t = verbandTabelPlus();
      return { soort: 'verband', opdracht: 'Welk verband is dit? Vul de ontbrekende waarde aan en bereken y voor een x die niet in de tabel staat.', tex: tabelTex(t),
        antw: { soort: 'delen', delen: [{ label: '\\text{verband:}', antw: keuze(kTekst(['recht evenredig', 'omgekeerd evenredig', 'lineair']), ['recht', 'omgekeerd', 'lineair'].indexOf(t.soort)) },
          { label: `\\text{voor } x = ${tg(t.xs[t.j])}: \\; y =`, antw: getal(t.ys[t.j], { voor: '' }) }, { label: `\\text{voor } x = ${tg(t.x0)}: \\; y =`, antw: getal(t.y0, { voor: '' }) }] },
        uitleg: [t.uitleg, voorschriftTex(t), `x = ${tg(t.xs[t.j])} \\Rightarrow y = ${tg(t.ys[t.j])}`, `x = ${tg(t.x0)} \\Rightarrow y = ${tg(t.y0)}`] };
    } },
    voorschrift: { naam: 'Het voorschrift kiezen', gen() {
      return tot(() => {
        const t = verbandTabelPlus(), juist = voorschriftTex(t), k = t.k || rnd(2, 6), b = t.b || rnd(2, 9);
        const ander = [`y = ${ct(-k)}x`, `y = ${ct(k)}x ${pm(-b)}`, `x \\cdot y = ${tg(t.c ? -t.c : t.ys[0] * t.xs[0])}`, `y = ${ct(k)}x`, `y = ${ct(-k)}x ${pm(b)}`, `y = x ${pm(t.ys[0] - t.xs[0])}`];
        const opties = [...new Set([juist, ...schud(ander).filter(x => x !== juist)])].slice(0, 4); if (opties.length < 4) return null;
        const s = schud(opties);
        return { soort: 'voorschrift', opdracht: 'Welk voorschrift hoort bij deze tabel?', tex: tabelTex(t, false), antw: keuze(s.map((l, i) => ({ k: String(i), l })), s.indexOf(juist)),
          uitleg: [t.uitleg, juist] };
      });
    } },
  },
  oefenMix: [['verband', 2], ['voorschrift', 1]],
  test: [['verband', 6], ['voorschrift', 4]], testSchudden: true,
};

// ---------------------------------------------------------------
// 10. Eindtest
// ---------------------------------------------------------------
const Z10 = {
  nr: 10, titel: 'Eindtest rekenen in ℤ +', kort: 'Alles door elkaar, op het niveau van ℤ +.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van ℤ + door elkaar. Herhaal gerust de theorie van een vorig deel. Werk op een kladblad en controleer elke tussenstap.</p></div>${VOLGORDE}${REGELS_MAAL}`,
  voorbeelden: [],
  soorten: { l: mix(Z1, 'lang'), k: mix(Z2, 'ketting'), m: mix(Z3, 'combi'), w: mix(Z4, 'wortel'), g: mix(Z4, 'gemengd'), v: mix(Z5, 'genest'), o: mix(Z6, 'opsommen'),
    ve: mix(Z7, 'vereenvoudig'), gw: mix(Z7, 'getalwaarde'), r: mix(Z8, 'regels'), u: mix(Z8, 'uitwerken'), vb: mix(Z9, 'verband') },
  oefenMix: [['l', 1], ['k', 1], ['m', 1], ['w', 1], ['g', 1], ['v', 1], ['o', 1], ['ve', 1], ['gw', 1], ['r', 1], ['u', 1], ['vb', 1]],
  test: [['l', 1], ['k', 1], ['m', 1], ['w', 1], ['v', 1], ['o', 1], ['ve', 1], ['r', 1], ['u', 1], ['vb', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'getallenleer-z-plus', titel: 'Rekenen in ℤ +', ondertitel: 'Getallenleer · 7VJHO · gevorderden', klas: '7VJHO', drempel: 80,
  intro: `<p>Je haalde een sterk resultaat op de instaptoets. Daarom werk je met de <b>+-versie</b>: dezelfde leerstof als Rekenen in ℤ, maar met moeilijkere oefeningen —
    lange sommen en ketens, valstrikken met mintekens en haakjes, vierkante haakjes, veeltermen met haakjes in haakjes en verbanden met negatieve getallen. Alles zonder rekenmachine.</p>
    <p>Lees de theorie (kijk zeker naar het kader <b>Extra uitdaging</b>), bekijk de voorbeelden, oefen zoveel je wil en maak dan de test. Haal je <b>8 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Bewerkingen in ℤ', delen: [1, 2, 3, 4, 5] }, { titel: 'B · Getallenas en coördinaten', delen: [6] }, { titel: 'C · Letterrekenen en verbanden', delen: [7, 8, 9] }, { titel: 'D · Eindtest', delen: [10] }],
  delen: [Z1, Z2, Z3, Z4, Z5, Z6, Z7, Z8, Z9, Z10],
});
