// ===================================================================
//  REKENEN IN ℕ + — de zes delen
// ===================================================================

// ---------------------------------------------------------------
// 1. Bewerkingen en volgorde +
// ---------------------------------------------------------------
const TRIPELS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [9, 12, 15], [12, 5, 13], [8, 15, 17]];
const VOLGORDE = `<div class="kader def"><div class="kader-titel">Volgorde van de bewerkingen</div>
  <ol><li><b>Haakjes</b>, van binnen naar buiten: eerst $( \\; )$, dan $[ \\; ]$.</li><li><b>Machten, wortels en logaritmen.</b></li><li><b>Vermenigvuldigen en delen</b>, van links naar rechts.</li><li><b>Optellen en aftrekken</b>, van links naar rechts.</li></ol></div>`;
const GENEST = [
  () => { // [(a + b)·c − d²] : e
    const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 6), d = rnd(2, 6), e = kies([2, 3, 4, 5, 6]);
    const s1 = a + b, s2 = s1 * c, s3 = d * d, s4 = s2 - s3; if (s4 <= 0 || s4 % e) return null;
    return { tex: `[(${a} + ${b}) \\cdot ${c} - ${d}^2] : ${e}`, w: s4 / e, L: [`= [${s1} \\cdot ${c} - ${d}^2] : ${e}`, `= [${s2} - ${s3}] : ${e}`, `= ${s4} : ${e}`, `= ${s4 / e}`] };
  },
  () => { // a·[b² − (c + d) : e] + f
    const a = rnd(2, 5), b = rnd(3, 8), e = kies([2, 3, 4, 5]), q = rnd(2, 9), c = rnd(1, q * e - 1), d = q * e - c, f = rnd(2, 15);
    const B = b * b, r = B - q; if (r <= 0) return null;
    return { tex: `${a} \\cdot [${b}^2 - (${c} + ${d}) : ${e}] + ${f}`, w: a * r + f, L: [`= ${a} \\cdot [${b}^2 - ${c + d} : ${e}] + ${f}`, `= ${a} \\cdot [${B} - ${q}] + ${f}`, `= ${a} \\cdot ${r} + ${f}`, `= ${a * r} + ${f}`, `= ${a * r + f}`] };
  },
  () => { // [(a² − b²) : (a − b)]² − c
    const b = rnd(2, 6), a = b + rnd(1, 4), A = a * a, B = b * b, s = a + b, c = rnd(1, s * s - 1);
    return { tex: `[(${a}^2 - ${b}^2) : (${a} - ${b})]^2 - ${c}`, w: s * s - c, L: [`= [(${A} - ${B}) : ${a - b}]^2 - ${c}`, `= [${A - B} : ${a - b}]^2 - ${c}`, `= ${s}^2 - ${c}`, `= ${s * s} - ${c}`, `= ${s * s - c}`] };
  },
  () => { // (p + q²) : [r·(s − t)] + u³
    const r = rnd(2, 4), t = rnd(1, 6), s = t + rnd(1, 3), n = r * (s - t), k = rnd(2, 6), q = rnd(2, 9), p = n * k - q * q, u = rnd(2, 4);
    if (p < 1) return null;
    return { tex: `(${p} + ${q}^2) : [${r} \\cdot (${s} - ${t})] + ${u}^3`, w: k + u ** 3, L: [`= (${p} + ${q * q}) : [${r} \\cdot ${s - t}] + ${u}^3`, `= ${p + q * q} : ${n} + ${u ** 3}`, `= ${k} + ${u ** 3}`, `= ${k + u ** 3}`] };
  },
  () => { // 2^a · 3 − [b² − (c·d − e)]
    const a = rnd(3, 6), b = rnd(4, 9), c = rnd(2, 6), d = rnd(2, 6), e = rnd(1, c * d - 1);
    const m = c * d - e, B = b * b, bin = B - m, P = 2 ** a * 3; if (bin < 0 || P < bin) return null;
    return { tex: `2^${a} \\cdot 3 - [${b}^2 - (${c} \\cdot ${d} - ${e})]`, w: P - bin, L: [`= 2^${a} \\cdot 3 - [${b}^2 - (${c * d} - ${e})]`, `= ${2 ** a} \\cdot 3 - [${B} - ${m}]`, `= ${P} - ${bin}`, `= ${P - bin}`] };
  },
  () => { // [(2·a − b) : c]² : d
    const c = kies([2, 3, 4]), q = kies([2, 4, 6, 8]), d = kies([2, 4, 8].filter(x => (q * q) % x === 0)), b = rnd(1, 9), m = q * c + b;
    if (m % 2) return null; const a = m / 2;
    return { tex: `[(2 \\cdot ${a} - ${b}) : ${c}]^2 : ${d}`, w: q * q / d, L: [`= [(${2 * a} - ${b}) : ${c}]^2 : ${d}`, `= [${q * c} : ${c}]^2 : ${d}`, `= ${q}^2 : ${d}`, `= ${q * q} : ${d}`, `= ${q * q / d}`] };
  },
  () => { // √(a² + b²) · [c² − 2·(d + e)]
    const [x, y, z] = kies(TRIPELS), c = rnd(4, 8), d = rnd(1, 6), e = rnd(1, 6), C = c * c, k = 2 * (d + e), r = C - k; if (r <= 0) return null;
    return { tex: `\\sqrt{${x}^2 + ${y}^2} \\cdot [${c}^2 - 2 \\cdot (${d} + ${e})]`, w: z * r, L: [`= \\sqrt{${x * x} + ${y * y}} \\cdot [${C} - 2 \\cdot ${d + e}]`, `= \\sqrt{${z * z}} \\cdot [${C} - ${k}]`, `= ${z} \\cdot ${r}`, `= ${z * r}`] };
  },
];
const WORTELLOG = [
  () => { const [x, y, z] = kies(TRIPELS), c = rnd(2, 6); return { tex: `\\sqrt{${x}^2 + ${y}^2} + \\sqrt[3]{${c ** 3}}`, w: z + c, L: [`= \\sqrt{${x * x} + ${y * y}} + ${c}`, `= \\sqrt{${z * z}} + ${c}`, `= ${z} + ${c}`, `= ${z + c}`] }; },
  () => { const k = kies([2, 3]), m = rnd(3, 12), b = kies([2, 3, 5, 10]), e = b === 2 ? rnd(2, 6) : b === 3 ? rnd(2, 4) : rnd(1, 3); const w = k * m - e; if (w < 0) return null;
    return { tex: `\\sqrt[4]{${k ** 4}} \\cdot \\sqrt{${m * m}} - \\log_{${b}} ${b ** e}`, w, L: [`= ${k} \\cdot ${m} - ${e} \\quad (${k}^4 = ${k ** 4}, \\; ${b}^{${e}} = ${b ** e})`, `= ${k * m} - ${e}`, `= ${w}`] }; },
  () => { const e = rnd(4, 7), N = 2 ** e, p = rnd(2, 9), q = rnd(2, 9), r = N - p * q; if (r < 1) return null;
    return { tex: `\\log_2 (${p} \\cdot ${q} + ${r})`, w: e, L: [`= \\log_2 (${p * q} + ${r})`, `= \\log_2 ${N}`, `= ${e} \\quad (2^{${e}} = ${N})`] }; },
  () => { const b = kies([2, 3]), e = b === 2 ? rnd(3, 8) : rnd(2, 5), N = b ** e, s = rnd(3, 6), c = s * s - e; if (c < 1) return null;
    return { tex: `\\sqrt{\\log_{${b}} ${N} + ${c}}`, w: s, L: [`= \\sqrt{${e} + ${c}} \\quad (${b}^{${e}} = ${N})`, `= \\sqrt{${s * s}}`, `= ${s}`] }; },
  () => { const b = kies([2, 3, 4, 5]), e = b === 2 ? rnd(3, 6) : b === 5 ? 3 : rnd(2, 4), k = rnd(3, 9), e2 = rnd(2, 4), w = e * k - e2; if (w < 0) return null;
    return { tex: `\\log_{${b}} ${b ** e} \\cdot \\sqrt{${k * k}} - \\log_{10} ${10 ** e2}`, w, L: [`= ${e} \\cdot ${k} - ${e2}`, `= ${e * k} - ${e2}`, `= ${w}`] }; },
  () => { const [x, y, z] = kies(TRIPELS), a = rnd(1, z - 1), b = z - a; return { tex: `\\sqrt{(${a} + ${b})^2 - ${y}^2}`, w: x, L: [`= \\sqrt{${z}^2 - ${y}^2}`, `= \\sqrt{${z * z} - ${y * y}}`, `= \\sqrt{${x * x}}`, `= ${x}`] }; },
  () => { const b = kies([2, 3]), e = b === 2 ? rnd(2, 5) : rnd(2, 3), N = (b ** e) ** 2, c = rnd(2, 9);
    return { tex: `\\log_{10} 1 + \\log_{${b}} \\sqrt{${N}} \\cdot ${c}`, w: e * c, L: [`= 0 + \\log_{${b}} ${b ** e} \\cdot ${c} \\quad (10^0 = 1)`, `= 0 + ${e} \\cdot ${c}`, `= ${e * c}`] }; },
];
// ---- haakjes plaatsen: welke plaatsing van haakjes geeft de gevraagde uitkomst?
const OPTEX = { '+': '+', '-': '-', '*': '\\cdot', ':': ':' };
function rekenTokens(t) { // t: [getal, op, getal, op, ...] met haakjes als '(' en ')'; null als het niet in ℕ blijft
  let i = 0;
  const factor = () => { if (t[i] === '(') { i++; const v = som(); i++; return v; } return t[i++]; };
  const product = () => { let v = factor(); while (v !== null && (t[i] === '*' || t[i] === ':')) { const op = t[i++], w = factor(); if (w === null) return null; if (op === '*') v *= w; else { if (w === 0 || v % w) return null; v /= w; } } return v; };
  const som = () => { let v = product(); while (v !== null && (t[i] === '+' || t[i] === '-')) { const op = t[i++], w = product(); if (w === null) return null; v = op === '+' ? v + w : v - w; if (v < 0) return null; } return v; };
  const v = som(); return isN(v) ? v : null;
}
const tokTex = (t) => t.map(x => typeof x === 'number' ? x : x === '(' || x === ')' ? x : ` ${OPTEX[x]} `).join('').replace(/\( /g, '(').replace(/ \)/g, ')');
function haakjesVraag() {
  const PATRONEN = [['+', '*', '-'], ['*', '+', '*'], ['-', '*', '+'], ['+', ':', '+'], ['*', '-', ':'], ['+', '*', '*'], [':', '+', '*']];
  const PLAATS = [[0, 1], [1, 2], [2, 3], [0, 2], [1, 3]]; // haakjes rond getallen i..j
  for (;;) {
    const ops = kies(PATRONEN), g = [rnd(2, 9), rnd(2, 9), rnd(2, 9), rnd(2, 9)];
    const bouw = (p) => { const t = []; g.forEach((x, i) => { if (p && i === p[0]) t.push('('); t.push(x); if (p && i === p[1]) t.push(')'); if (i < 3) t.push(ops[i]); }); return t; };
    const zonder = rekenTokens(bouw(null)); if (zonder === null) continue;
    const opties = [];
    for (const p of PLAATS) { const t = bouw(p), v = rekenTokens(t); if (v !== null && v !== zonder && !opties.some(o => o.v === v)) opties.push({ t, v }); }
    if (opties.length < 3) continue;
    const juist = kies(opties), anderen = schud(opties.filter(o => o !== juist)).slice(0, 3), lijst = schud([juist, ...anderen]);
    const basis = tokTex(bouw(null));
    return { soort: 'haakjes', opdracht: `Waar moeten de haakjes staan zodat de uitkomst ${juist.v} is?`, tex: `${basis} = ${juist.v}`,
      antw: keuze(lijst.map((o, i) => ({ k: String(i), l: tokTex(o.t) })), lijst.indexOf(juist)),
      uitleg: [`\\text{zonder haakjes: } ${basis} = ${zonder}`, ...lijst.map(o => `${tokTex(o.t)} = ${o.v}${o === juist ? ' \\; ✓' : ''}`)] };
  }
}
function vraagUit(lijst, soort) { const r = tot(() => { const x = kies(lijst)(); return x && isN(x.w) ? x : null; }); return { soort, tex: `${r.tex} = \\;?`, antw: getal(r.w), uitleg: r.L }; }
const P1 = {
  nr: 1, titel: 'Bewerkingen en volgorde +', kort: 'Vierkante haakjes, wortels en logaritmen van uitdrukkingen, haakjes plaatsen.', rekenmachine: false,
  opdracht: 'Bereken zonder rekentoestel. Werk stap voor stap.',
  theorie: `${VOLGORDE}
    <div class="kader eig"><div class="kader-titel">Machten, wortels en logaritmen</div>
    <table class="tabel"><tr><td>$3^4 = 3 \\cdot 3 \\cdot 3 \\cdot 3 = 81$</td><td>$\\sqrt[4]{81} = 3$</td><td class="klein">want $3^4 = 81$</td></tr>
    <tr><td>$2^5 = 32$</td><td>$\\log_2 32 = 5$</td><td class="klein">want $2^5 = 32$</td></tr>
    <tr><td>$10^0 = 1$</td><td>$\\log_{10} 1 = 0$</td><td class="klein">elk grondtal tot de macht 0 is 1</td></tr></table></div>
    ${PLUS_KADER(`<p>Staat er een <b>bewerking onder een wortel</b> of <b>in een logaritme</b>, reken die dan eerst uit: de wortel of de logaritme werkt als haakjes.</p>
      <p class="midden">$\\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5 \\qquad \\log_2 (5 \\cdot 6 + 2) = \\log_2 32 = 5$</p>
      <p class="klein">Let op: $\\sqrt{9 + 16}$ is <b>niet</b> $\\sqrt{9} + \\sqrt{16}$.</p>`)}`,
  voorbeelden: [
    { tex: '[(6 + 4) \\cdot 3 - 2^3] : 2', stappen: ['= [10 \\cdot 3 - 2^3] : 2', '= [30 - 8] : 2', '= 22 : 2', '= 11'] },
    { tex: '\\sqrt{\\log_2 64 + 10}', stappen: ['= \\sqrt{6 + 10} \\quad (2^6 = 64)', '= \\sqrt{16}', '= 4'] },
    { tex: '\\text{Haakjes plaatsen: } 2 + 3 \\cdot 4 - 1 = 19', stappen: ['2 + 3 \\cdot 4 - 1 = 13 \\text{ (zonder haakjes)}', '(2 + 3) \\cdot 4 - 1 = 5 \\cdot 4 - 1 = 19 \\; ✓'] },
  ],
  soorten: {
    genest: { naam: 'Vierkante haakjes en volgorde', gen() { return vraagUit(GENEST, 'genest'); } },
    wortellog: { naam: 'Wortels en logaritmen van uitdrukkingen', gen() { return vraagUit(WORTELLOG, 'wortellog'); } },
    haakjes: { naam: 'Haakjes plaatsen', gen: haakjesVraag },
  },
  oefenMix: [['genest', 3], ['wortellog', 3], ['haakjes', 1]],
  test: [['genest', 4], ['wortellog', 4], ['haakjes', 2]], testSchudden: true,
};

// ---------------------------------------------------------------
// 2. Eentermen en veeltermen +
// ---------------------------------------------------------------
// eenterm: { c, e: { a: 2, b: 1 } }
const LETTERS = ['a', 'b', 'c'];
function etTex(c, e, metEen = false) {
  const l = LETTERS.filter(x => e[x]).map(x => e[x] === 1 ? x : `${x}^${e[x]}`).join('');
  return `${c === 1 && l && !metEen ? '' : c}${l}`;
}
const etExpr = (c, e) => [String(c), ...LETTERS.filter(x => e[x]).map(x => `${x}^${e[x]}`)].join('*');
const exps = (n) => { const e = {}; LETTERS.slice(0, n).forEach(x => { e[x] = rnd(1, 3); }); return e; };
const somExp = (e1, e2) => { const e = {}; LETTERS.forEach(x => { if (e1[x] || e2[x]) e[x] = (e1[x] || 0) + (e2[x] || 0); }); return e; };
const MACHTPROD = [
  () => { // 3a²b · 2ab³ + 4a³b⁴ − a³b⁴   (zoals "moeilijke veeltermen in ℕ")
    const n = kies([2, 2, 3]), e1 = exps(n), e2 = exps(n), c1 = rnd(2, 5), c2 = rnd(2, 5), e = somExp(e1, e2), p = c1 * c2, k = rnd(2, 6), l = rnd(1, p + k - 1), w = p + k - l;
    return { tex: `${etTex(c1, e1)} \\cdot ${etTex(c2, e2)} + ${etTex(k, e)} - ${etTex(l, e)}`, e: `${etExpr(c1, e1)}*${etExpr(c2, e2)}+${etExpr(k, e)}-${etExpr(l, e)}`,
      j: etTex(w, e), L: [`= ${etTex(p, e)} + ${etTex(k, e)} - ${etTex(l, e)} \\quad (a^x \\cdot a^y = a^{x+y})`, `= ${etTex(w, e)}`] };
  },
  () => { // 2a · 3a² · a³b
    const x = rnd(1, 3), y = rnd(1, 3), z = rnd(1, 3), q = rnd(1, 3), c1 = rnd(2, 4), c2 = rnd(2, 5), r = rnd(2, 9), e = { a: x + y + z, b: q };
    return { tex: `${c1}a${x > 1 ? '^' + x : ''} \\cdot ${c2}a${y > 1 ? '^' + y : ''} \\cdot a${z > 1 ? '^' + z : ''}b${q > 1 ? '^' + q : ''} + ${etTex(r, e)}`,
      e: `${c1}*a^${x}*${c2}*a^${y}*a^${z}*b^${q}+${etExpr(r, e)}`, j: etTex(c1 * c2 + r, e),
      L: [`= ${etTex(c1 * c2, e)} + ${etTex(r, e)} \\quad (\\text{exponenten optellen: } ${x} + ${y} + ${z} = ${x + y + z})`, `= ${etTex(c1 * c2 + r, e)}`] };
  },
  () => { // a² · a³ + 2a · 4a⁴ − 3a⁵ + 6a²
    const s = rnd(4, 7), x = rnd(1, s - 1), y = rnd(1, s - 1), p = rnd(2, 5), q = rnd(2, 5), r = rnd(1, 1 + p * q - 1), t = rnd(2, 9), u = rnd(2, s - 1);
    const w = 1 + p * q - r;
    return { tex: `a^${x} \\cdot a^${s - x} + ${p}a${y > 1 ? '^' + y : ''} \\cdot ${q}a^${s - y} - ${r}a^${s} + ${t}a^${u}`, e: `a^${x}*a^${s - x}+${p}a^${y}*${q}a^${s - y}-${r}a^${s}+${t}a^${u}`,
      j: `${w === 1 ? '' : w}a^${s} + ${t}a^${u}`, L: [`= a^${s} + ${p * q}a^${s} - ${r}a^${s} + ${t}a^${u}`, `= ${w === 1 ? '' : w}a^${s} + ${t}a^${u}`] };
  },
];
const DISTRIB = [
  () => { // p + qa − r(s + ta)
    const r = rnd(2, 6), s = rnd(2, 9), t = rnd(2, 8), p = r * s + rnd(1, 15), q = r * t + rnd(1, 12);
    return { tex: `${p} + ${q}a - ${r}(${s} + ${t}a)`, e: `${p}+${q}a-${r}*(${s}+${t}a)`, j: `${p - r * s} + ${q - r * t === 1 ? '' : q - r * t}a`,
      L: [`= ${p} + ${q}a - ${r * s} - ${r * t}a \\quad (-${r} \\cdot ${s} \\text{ en } -${r} \\cdot ${t}a)`, `= ${p - r * s} + ${q - r * t === 1 ? '' : q - r * t}a`] };
  },
  () => { // pa² + qa·ra − s(a² + ta) + ua
    const p = rnd(2, 6), q = rnd(2, 4), r = rnd(2, 4), s = rnd(2, p + q * r - 1), t = rnd(2, 5), u = s * t + rnd(1, 9);
    const A = p + q * r - s, B = u - s * t;
    return { tex: `${p}a^2 + ${q}a \\cdot ${r}a - ${s}(a^2 + ${t}a) + ${u}a`, e: `${p}a^2+${q}a*${r}a-${s}*(a^2+${t}a)+${u}a`, j: `${A === 1 ? '' : A}a^2 + ${B === 1 ? '' : B}a`,
      L: [`= ${p}a^2 + ${q * r}a^2 - ${s}a^2 - ${s * t}a + ${u}a`, `= ${A === 1 ? '' : A}a^2 + ${B === 1 ? '' : B}a`] };
  },
  () => { // p(a + qb) + r(sa + b) − t(a + b)
    const p = rnd(2, 5), q = rnd(2, 4), r = rnd(2, 5), s = rnd(2, 4), t = rnd(2, Math.min(p + r * s, p * q + r) - 1);
    const A = p + r * s - t, B = p * q + r - t;
    return { tex: `${p}(a + ${q}b) + ${r}(${s}a + b) - ${t}(a + b)`, e: `${p}*(a+${q}b)+${r}*(${s}a+b)-${t}*(a+b)`, j: `${A === 1 ? '' : A}a + ${B === 1 ? '' : B}b`,
      L: [`= ${p}a + ${p * q}b + ${r * s}a + ${r}b - ${t}a - ${t}b`, `= ${A === 1 ? '' : A}a + ${B === 1 ? '' : B}b`] };
  },
  () => { // pa(qa + r) − sa² − ta
    const p = rnd(2, 4), q = rnd(2, 4), r = rnd(2, 6), s = rnd(1, p * q - 1), t = rnd(1, p * r - 1), A = p * q - s, B = p * r - t;
    return { tex: `${p}a(${q}a + ${r}) - ${s === 1 ? '' : s}a^2 - ${t === 1 ? '' : t}a`, e: `${p}a*(${q}a+${r})-${s}a^2-${t}a`, j: `${A === 1 ? '' : A}a^2 + ${B === 1 ? '' : B}a`,
      L: [`= ${p * q}a^2 + ${p * r}a - ${s === 1 ? '' : s}a^2 - ${t === 1 ? '' : t}a \\quad (${p}a \\cdot ${q}a = ${p * q}a^2)`, `= ${A === 1 ? '' : A}a^2 + ${B === 1 ? '' : B}a`] };
  },
];
const GW = [
  { tex: 'a^2b - 2ab + b^3', f: (a, b) => a * a * b - 2 * a * b + b ** 3, L: (a, b) => [`= ${a}^2 \\cdot ${b} - 2 \\cdot ${a} \\cdot ${b} + ${b}^3`, `= ${a * a} \\cdot ${b} - ${2 * a * b} + ${b ** 3}`, `= ${a * a * b} - ${2 * a * b} + ${b ** 3}`, `= ${a * a * b - 2 * a * b + b ** 3}`], ok: (a, b) => a * a * b >= 2 * a * b },
  { tex: '(a + b)^2 - a^2 - b^2', f: (a, b) => 2 * a * b, L: (a, b) => [`= (${a} + ${b})^2 - ${a}^2 - ${b}^2`, `= ${a + b}^2 - ${a * a} - ${b * b}`, `= ${(a + b) ** 2} - ${a * a} - ${b * b}`, `= ${2 * a * b}`] },
  { tex: '3a^2 - (a + b) \\cdot b', f: (a, b) => 3 * a * a - (a + b) * b, L: (a, b) => [`= 3 \\cdot ${a}^2 - (${a} + ${b}) \\cdot ${b}`, `= 3 \\cdot ${a * a} - ${a + b} \\cdot ${b}`, `= ${3 * a * a} - ${(a + b) * b}`, `= ${3 * a * a - (a + b) * b}`] },
  { tex: 'a^3 - 2b^2 + ab^2', f: (a, b) => a ** 3 - 2 * b * b + a * b * b, L: (a, b) => [`= ${a}^3 - 2 \\cdot ${b}^2 + ${a} \\cdot ${b}^2`, `= ${a ** 3} - 2 \\cdot ${b * b} + ${a} \\cdot ${b * b}`, `= ${a ** 3} - ${2 * b * b} + ${a * b * b}`, `= ${a ** 3 - 2 * b * b + a * b * b}`], ok: (a, b) => a ** 3 >= 2 * b * b },
  { tex: '(2a - b)^2 + 2a^2b', f: (a, b) => (2 * a - b) ** 2 + 2 * a * a * b, L: (a, b) => [`= (2 \\cdot ${a} - ${b})^2 + 2 \\cdot ${a}^2 \\cdot ${b}`, `= (${2 * a} - ${b})^2 + 2 \\cdot ${a * a} \\cdot ${b}`, `= ${2 * a - b}^2 + ${2 * a * a * b}`, `= ${(2 * a - b) ** 2} + ${2 * a * a * b}`, `= ${(2 * a - b) ** 2 + 2 * a * a * b}`], ok: (a, b) => 2 * a >= b },
  { tex: 'a(b^2 + 1) - b(a + 1)', f: (a, b) => a * (b * b + 1) - b * (a + 1), L: (a, b) => [`= ${a} \\cdot (${b}^2 + 1) - ${b} \\cdot (${a} + 1)`, `= ${a} \\cdot ${b * b + 1} - ${b} \\cdot ${a + 1}`, `= ${a * (b * b + 1)} - ${b * (a + 1)}`, `= ${a * (b * b + 1) - b * (a + 1)}`] },
];
const EERST = [
  () => { // a·p + a + b·a + qb + a − rb² − sa   (zoals in de PWP)
    const p = rnd(3, 8), q = rnd(2, 6), r = rnd(1, 3), s = rnd(1, p), A = p + 2 - s;
    const j = `${A === 1 ? '' : A}a + ab + ${q}b - ${r === 1 ? '' : r}b^2`;
    return { tex: `a \\cdot ${p} + a + b \\cdot a + ${q}b + a - ${r === 1 ? '' : r}b^2 - ${s === 1 ? '' : s}a`, e: `a*${p}+a+b*a+${q}b+a-${r}b^2-${s}a`, j,
      f: (a, b) => A * a + a * b + q * b - r * b * b, Lw: (a, b) => [`= ${A} \\cdot ${a} + ${a} \\cdot ${b} + ${q} \\cdot ${b} - ${r} \\cdot ${b}^2`, `= ${A * a} + ${a * b} + ${q * b} - ${r * b * b}`, `= ${A * a + a * b + q * b - r * b * b}`] };
  },
  () => { // pa² + a·qa + rab − b·a + sb
    const p = rnd(2, 5), q = rnd(2, 4), r = rnd(2, 6), s = rnd(2, 9), A = p + q, B = r - 1;
    return { tex: `${p}a^2 + a \\cdot ${q}a + ${r}ab - b \\cdot a + ${s}b`, e: `${p}a^2+a*${q}a+${r}ab-b*a+${s}b`, j: `${A}a^2 + ${B === 1 ? '' : B}ab + ${s}b`,
      f: (a, b) => A * a * a + B * a * b + s * b, Lw: (a, b) => [`= ${A} \\cdot ${a}^2 + ${B} \\cdot ${a} \\cdot ${b} + ${s} \\cdot ${b}`, `= ${A} \\cdot ${a * a} + ${B * a * b} + ${s * b}`, `= ${A * a * a} + ${B * a * b} + ${s * b}`, `= ${A * a * a + B * a * b + s * b}`] };
  },
  () => { // 2a·3b + a² − 4ab + a·a + 5
    const p = rnd(2, 3), q = rnd(2, 4), r = rnd(1, p * q - 1), c = rnd(2, 9), B = p * q - r;
    return { tex: `${p}a \\cdot ${q}b + a^2 - ${r === 1 ? '' : r}ab + a \\cdot a + ${c}`, e: `${p}a*${q}b+a^2-${r}ab+a*a+${c}`, j: `2a^2 + ${B === 1 ? '' : B}ab + ${c}`,
      f: (a, b) => 2 * a * a + B * a * b + c, Lw: (a, b) => [`= 2 \\cdot ${a}^2 + ${B} \\cdot ${a} \\cdot ${b} + ${c}`, `= 2 \\cdot ${a * a} + ${B * a * b} + ${c}`, `= ${2 * a * a} + ${B * a * b} + ${c}`, `= ${2 * a * a + B * a * b + c}`] };
  },
];
const P2 = {
  nr: 2, titel: 'Eentermen en veeltermen +', kort: 'Eentermen met exponenten vermenigvuldigen, haakjes met een min ervoor, getalwaarde.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Eentermen en veeltermen</div>
    <p>Een <b>eenterm</b> is een product van getallen en variabelen: $3a^2b$ heeft coëfficiënt $3$ en lettergedeelte $a^2b$. Een <b>veelterm</b> is een som van eentermen.</p>
    <p>Enkel eentermen met <b>hetzelfde lettergedeelte</b> tel je samen: $4a^3b^4 - a^3b^4 = 3a^3b^4$, maar $a^3b^4$ en $a^4b^3$ niet.</p></div>
    <div class="kader eig"><div class="kader-titel">Rekenregel</div>
    <p class="midden">$a^x \\cdot a^y = a^{x+y}$ &nbsp; (bij vermenigvuldigen: exponenten optellen)</p>
    <p class="midden">$3a^2b \\cdot 2ab^3 = 3 \\cdot 2 \\cdot a^{2+1} \\cdot b^{1+3} = 6a^3b^4$</p>
    <p class="klein">Coëfficiënten vermenigvuldig je, exponenten van dezelfde letter tel je op. $a$ betekent $a^1$.</p></div>
    ${PLUS_KADER(`<p><b>Min voor de haakjes</b>: vermenigvuldig elke term binnen de haakjes, ook met het minteken.</p>
      <p class="midden">$8 + 5a - 2(3 + a) = 8 + 5a - 6 - 2a = 2 + 3a$</p>
      <p><b>Getalwaarde</b>: is de uitdrukking lang, vereenvoudig dan eerst en substitueer daarna pas.</p>`)}
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Typ bv. <code>9a^3b^4</code>, <code>2 + 3a</code> of <code>5a^2 + ab - 2b^2</code>.</p></div>`,
  voorbeelden: [
    { tex: '3a^2b \\cdot 2ab^3 + 4a^3b^4 - a^3b^4', stappen: ['= 6a^3b^4 + 4a^3b^4 - a^3b^4', '= 9a^3b^4'] },
    { tex: '19 + 17a - 2(2 + 6a)', stappen: ['= 19 + 17a - 4 - 12a', '= 15 + 5a'] },
    { tex: 'a \\cdot 6 + a + b \\cdot a + 2b + a - 2b^2 - 3a \\quad \\text{voor } a = 2, \\; b = 3', stappen: ['= 5a + ab + 2b - 2b^2', '= 5 \\cdot 2 + 2 \\cdot 3 + 2 \\cdot 3 - 2 \\cdot 3^2', '= 10 + 6 + 6 - 18', '= 4'] },
  ],
  soorten: {
    machten: { naam: 'Eentermen met exponenten', opdracht: 'Vereenvoudig.', gen() { const r = kies(MACHTPROD)(); return { soort: 'machten', opdracht: 'Vereenvoudig.', tex: r.tex, antw: vt(r.e, r.j), uitleg: r.L }; } },
    distributief: { naam: 'Haakjes uitwerken (ook met een min)', opdracht: 'Werk de haakjes uit en vereenvoudig.', gen() { const r = kies(DISTRIB)(); return { soort: 'distributief', opdracht: 'Werk de haakjes uit en vereenvoudig.', tex: r.tex, antw: vt(r.e, r.j), uitleg: r.L }; } },
    getalwaarde: { naam: 'Getalwaarde met machten', gen() {
      return tot(() => { const G = kies(GW), a = rnd(2, 5), b = rnd(1, 4); if (G.ok && !G.ok(a, b)) return null; const w = G.f(a, b); if (!isN(w)) return null;
        return { soort: 'getalwaarde', opdracht: 'Bereken de getalwaarde.', tex: `${G.tex} \\quad \\text{voor } a = ${a}, \\; b = ${b}`, antw: getal(w), uitleg: G.L(a, b) }; });
    } },
    eerst: { naam: 'Eerst vereenvoudigen, dan de getalwaarde', gen() {
      return tot(() => { const r = kies(EERST)(), a = rnd(1, 5), b = rnd(1, 4), w = r.f(a, b); if (!isN(w)) return null;
        return { soort: 'eerst', opdracht: 'Vereenvoudig eerst. Bereken daarna de getalwaarde.', tex: `${r.tex} \\quad \\text{voor } a = ${a}, \\; b = ${b}`, sleutel: r.tex + a + b,
          antw: { soort: 'delen', delen: [{ label: '\\text{vereenvoudigd:}', antw: vt(r.e, r.j) }, { label: '\\text{getalwaarde:}', antw: getal(w) }] },
          uitleg: [`= ${r.j}`, ...r.Lw(a, b)] }; });
    } },
  },
  oefenMix: [['machten', 2], ['distributief', 2], ['getalwaarde', 2], ['eerst', 1]],
  test: [['machten', 3], ['distributief', 3], ['getalwaarde', 2], ['eerst', 2]], testSchudden: true,
};

// ---------------------------------------------------------------
// 3. Getallenas en ordenen +
// ---------------------------------------------------------------
const VGLPOOL = [
  ['2^5', 32], ['5^2', 25], ['3^4', 81], ['9^2', 81], ['4^3', 64], ['8^2', 64], ['2^6', 64], ['2^{10}', 1024], ['10^3', 1000], ['\\sqrt{144}', 12], ['\\sqrt{16 \\cdot 9}', 12],
  ['\\sqrt[3]{125} \\cdot 4', 20], ['\\log_2 64', 6], ['\\sqrt{36}', 6], ['\\log_3 81', 4], ['\\sqrt[4]{256}', 4], ['2^4 : 4', 4], ['7^2 - 1', 48], ['\\sqrt{2500}', 50], ['6^2 + 8^2', 100],
  ['10^2', 100], ['(3 + 4)^2', 49], ['3^2 + 4^2', 25], ['\\sqrt{3^2 + 4^2}', 5], ['\\log_2 32', 5], ['11^2', 121], ['5^3', 125], ['2^7', 128], ['12^2', 144], ['\\sqrt[3]{1000}', 10],
  ['\\log_2 1024', 10], ['3^3', 27], ['5^2 + 2', 27], ['2^3 \\cdot 3^2', 72], ['\\sqrt{81} \\cdot 8', 72], ['\\log_{10} 10\\,000', 4], ['\\sqrt[4]{16} \\cdot 2', 4], ['(2 + 3)^3', 125], ['2^3 + 3^2', 17], ['\\sqrt{289}', 17],
];
const GRENS = [['\\sqrt{36}', 6], ['2^3', 8], ['\\log_2 16', 4], ['\\sqrt[3]{27}', 3], ['3^2', 9], ['\\sqrt{100}', 10], ['2^4 - 3', 13], ['\\log_3 27 + 5', 8], ['\\sqrt{49} + 2', 9], ['\\sqrt[4]{81}', 3],
  ['5^2 : 5', 5], ['\\log_{10} 1000', 3], ['2 \\cdot 3^2', 18], ['4^2', 16], ['\\sqrt{121}', 11], ['\\log_2 1', 0], ['\\sqrt{3^2 + 4^2}', 5], ['2^2 \\cdot 3', 12], ['\\sqrt[3]{64} + 3', 7], ['\\log_2 128', 7], ['3 \\cdot 5 - 1', 14], ['\\sqrt{225}', 15]];
const GROOT = [['2^4', 16], ['10^2', 100], ['5^3', 125], ['2^7', 128], ['\\sqrt{400}', 20], ['3^4', 81], ['7^2', 49], ['2^{10}', 1024], ['10^3', 1000], ['\\sqrt{900}', 30], ['4^4', 256], ['2^5', 32], ['15^2', 225], ['2^8', 256], ['6^3', 216]];
function grensTekens(lo, hi, li, ri) { const w = []; for (let k = li ? lo : lo + 1; k <= (ri ? hi : hi - 1); k++) w.push(k); return w; }
const P3 = {
  nr: 3, titel: 'Getallenas en ordenen +', kort: 'Andere ijking aflezen, berekende punten, vergelijken met machten, V opsommen (ook ∅).', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De getallenas</div>
      <p>Een getallenas is <b>geijkt door twee getallen</b>. Uit die twee getallen haal je de afstand tussen twee streepjes.</p>
      ${getallenasIjking(40, 5, 9, [1, 2], [{ i: 6, label: 'A' }])}
      <p class="klein">Tussen twee streepjes zit $50 - 45 = 5$. A ligt 4 streepjes rechts van 50: $A = 50 + 4 \\cdot 5 = 70$.</p></div>
    <div class="kader eig"><div class="kader-titel">Oplossingen in ℕ opsommen</div>
      <p>Reken eerst de grenzen uit. $\\sqrt{36} < x \\leq 2^3 + 1$ wordt $6 < x \\leq 9$, dus $V = \\{7 ; 8 ; 9\\}$.</p>
      <p>Voldoet geen enkel natuurlijk getal, dan is de verzameling <b>leeg</b>: $7 < x \\leq 7$ geeft $V = \\{ \\} = \\varnothing$.</p></div>
    ${PLUS_KADER(`<p><b>Hoeveel getallen?</b> Van $17$ tot en met $100$ zijn er $100 - 17 + 1 = 84$ natuurlijke getallen. Vergeet de $+ 1$ niet, en vergeet ook $0$ niet bij $x < 5$: dat zijn er $5$.</p>`)}
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Scheid de getallen met een puntkomma: <code>7 ; 8 ; 9</code>. Is er geen oplossing, klik dan op $V = \\varnothing$.</p></div>`,
  voorbeelden: [
    { tex: '2^5 \\;\\ldots\\; 5^2', stappen: ['2^5 = 32 \\text{ en } 5^2 = 25', '2^5 > 5^2'] },
    { tex: '\\log_2 8 \\leq x < \\sqrt{16} \\quad (x \\in \\mathbb{N})', stappen: ['3 \\leq x < 4', 'V = \\{3\\}'] },
    { tex: '\\text{Hoeveel natuurlijke getallen: } 2^4 < x \\leq 10^2 \\,?', stappen: ['16 < x \\leq 100', 'x = 17, 18, \\ldots, 100', '100 - 17 + 1 = 84'] },
  ],
  soorten: {
    aflezen: { naam: 'Aflezen bij een andere ijking', gen() {
      const start = kies([0, 10, 20, 50, 100, 200, 1000]), stap = kies([2, 5, 10, 20, 25, 50]), n = 9;
      let labels, pos;
      do { const i = rnd(0, n - 3); labels = kies([[i, i + 1], [i, i + 2]]); pos = rnd(0, n - 1); } while (labels.includes(pos) || labels[1] > n - 1);
      const x = start + pos * stap;
      return { soort: 'aflezen', opdracht: 'Welk getal stelt het punt A voor?', html: getallenasIjking(start, stap, n, labels, [{ i: pos, label: 'A' }]), sleutel: `as${start}-${stap}-${labels}-${pos}`,
        rapport: `as met ${start + labels[0] * stap} en ${start + labels[1] * stap}, punt A op ${x}`, antw: getal(x, { voor: 'A =' }),
        uitleg: [`\\text{afstand tussen twee streepjes: } (${start + labels[1] * stap} - ${start + labels[0] * stap}) : ${labels[1] - labels[0]} = ${stap}`, `A = ${x}`] };
    } },
    keten: { naam: 'Berekende punten', gen() {
      return tot(() => {
        const a = rnd(2, 6), b = rnd(2, 6), K = a * b, c = rnd(1, K - 1), L = K - c, opsM = kies(['dubbel', 'deel', 'kwad']);
        let Mtex, M, MstapL;
        if (opsM === 'dubbel') { M = 2 * L + K; Mtex = '2 \\cdot L + K'; MstapL = `2 \\cdot ${L} + ${K}`; }
        else if (opsM === 'deel') { const d = kies([2, 3, 4, 5]); if ((K + L) % d) return null; M = (K + L) / d; Mtex = `(K + L) : ${d}`; MstapL = `(${K} + ${L}) : ${d}`; }
        else { if (L > 9) return null; M = L * L - c; if (M < 0) return null; Mtex = `L^2 - ${c}`; MstapL = `${L}^2 - ${c}`; }
        return { soort: 'keten', opdracht: 'Bereken de punten na elkaar. Welk getal stelt M voor?', tex: `K = ${a} \\cdot ${b}, \\quad L = K - ${c}, \\quad M = ${Mtex}`, antw: getal(M, { voor: 'M =' }),
          uitleg: [`K = ${a} \\cdot ${b} = ${K}`, `L = ${K} - ${c} = ${L}`, `M = ${MstapL} = ${M}`] };
      });
    } },
    vergelijk: { naam: 'Vergelijken met machten, wortels en logaritmen', gen() {
      return tot(() => { const [ta, a] = kies(VGLPOOL), [tb, b] = kies(VGLPOOL); if (ta === tb || Math.abs(a - b) > Math.max(3, Math.max(a, b) * 0.25)) return null;
        return { soort: 'vergelijk', opdracht: 'Vul in: <, > of =.', tex: `${ta} \\;\\ldots\\; ${tb}`, antw: keuze(VERGELIJK, vgl(a, b)), uitleg: [`${ta} = ${a} \\text{ en } ${tb} = ${b}`, `${ta} ${vgl(a, b)} ${tb}`] }; });
    } },
    opsommen: { naam: 'Oplossingen in ℕ opsommen (ook ∅)', gen() {
      return tot(() => {
        const [tl, l] = kies(GRENS), [tr, r] = kies(GRENS), li = kies([true, false]), ri = kies([true, false]);
        if (tl === tr || r - l < 0 || r - l > 6) return null;
        const w = grensTekens(l, r, li, ri);
        if (!w.length && Math.random() < 0.6) return null; // lege verzameling af en toe
        const tex = `${tl} ${li ? '\\leq' : '<'} x ${ri ? '\\leq' : '<'} ${tr}`;
        return { soort: 'opsommen', opdracht: 'Welke natuurlijke getallen voldoen? Noteer de oplossingsverzameling.', tex: `${tex} \\quad (x \\in \\mathbb{N})`,
          antw: w.length ? { soort: 'Vmeer', waarden: w, dec: 0 } : { soort: 'Vmeer', waarden: [], leeg: true },
          uitleg: [`${l} ${li ? '\\leq' : '<'} x ${ri ? '\\leq' : '<'} ${r}`, w.length ? `V = \\{${w.join(' ; ')}\\}` : 'V = \\varnothing \\quad \\text{(geen enkel natuurlijk getal voldoet)}'] };
      });
    } },
    aantal: { naam: 'Hoeveel natuurlijke getallen?', gen() {
      return tot(() => {
        if (Math.random() < 0.25) { const [tr, r] = kies(GROOT), ri = kies([true, false]); const n = ri ? r + 1 : r;
          return { soort: 'aantal', opdracht: 'Hoeveel natuurlijke getallen voldoen?', tex: `x ${ri ? '\\leq' : '<'} ${tr} \\quad (x \\in \\mathbb{N})`, antw: getal(n),
            uitleg: [`x ${ri ? '\\leq' : '<'} ${r}`, `x = 0, 1, 2, \\ldots, ${ri ? r : r - 1} \\quad \\text{(vergeet 0 niet!)}`, `${ri ? r : r - 1} - 0 + 1 = ${n}`] }; }
        const [tl, l] = kies(GROOT), [tr, r] = kies(GROOT), li = kies([true, false]), ri = kies([true, false]); if (r - l < 8) return null;
        const lo = li ? l : l + 1, hi = ri ? r : r - 1, n = hi - lo + 1;
        return { soort: 'aantal', opdracht: 'Hoeveel natuurlijke getallen voldoen?', tex: `${tl} ${li ? '\\leq' : '<'} x ${ri ? '\\leq' : '<'} ${tr} \\quad (x \\in \\mathbb{N})`, antw: getal(n),
          uitleg: [`${l} ${li ? '\\leq' : '<'} x ${ri ? '\\leq' : '<'} ${r}`, `x = ${lo}, ${lo + 1}, \\ldots, ${hi}`, `${hi} - ${lo} + 1 = ${n}`] };
      });
    } },
  },
  oefenMix: [['aflezen', 1], ['keten', 1], ['vergelijk', 2], ['opsommen', 2], ['aantal', 1]],
  test: [['aflezen', 2], ['keten', 2], ['vergelijk', 2], ['opsommen', 3], ['aantal', 1]], testSchudden: true,
};

// ---------------------------------------------------------------
// 4. Procenten +
// ---------------------------------------------------------------
// van 'van%' naar 'naar%' via een tussenstap; geeft de kolommen en de bewerking voor de verhoudingstabel
function procentPad(vanP, vanW, naarP) {
  const g = ggd(vanP, naarP), kol = [[tg(vanP), tg(vanW)]];
  const d = vanP / g, m = naarP / g;
  if (d !== 1 && m !== 1) kol.push([tg(g), tg(vanW / d)]);
  kol.push([tg(naarP), tg(vanW / d * m)]);
  const bew = d !== 1 && m !== 1 ? `: ${d} \\text{ en } \\cdot ${m}` : d !== 1 ? `: ${d}` : `\\cdot ${m}`;
  return { w: vanW / d * m, kol, bew, d };
}
const SLIM_P = [8, 12, 15, 35, 45, 6, 120, 175, 2, 4, 65, 85, 16, 24, 36, 125, 110, 135];
const PROCENT_THEORIE = `<div class="kader def"><div class="kader-titel">Procenten met een verhoudingstabel</div>
  <p>Zet de gegevens in een <b>verhoudingstabel</b>: <b>wat je boven doet, doe je ook onder</b>. Werk via een handige tussenstap (bv. $1\\%$, $5\\%$, $10\\%$ of $20\\%$).</p>
  ${verhoudingstabel(['%', 'aantal'], [['100', '600'], ['5', '30'], ['35', '210']], 'bewerking: $: 20$ en $\\cdot 7$')}</div>
  ${PLUS_KADER(`<p><b>Terugrekenen</b>: na $20\\%$ korting betaal je € 48. Die € 48 is dus $80\\%$ van de oude prijs.</p>
    ${verhoudingstabel(['%', 'euro'], [['80', '48'], ['20', '12'], ['100', '60']], 'bewerking: $: 4$ en $\\cdot 5$')}
    <p><b>Na elkaar</b>: eerst $10\\%$ erbij en dan $10\\%$ eraf is <b>niet</b> hetzelfde als niets doen: de tweede keer reken je met de <b>nieuwe</b> prijs.</p>
    <p><b>Met btw</b>: de prijs met $21\\%$ btw is $121\\%$ van de prijs zonder btw.</p>`)}`;
const PROCENT_BEPALEN = [
  ['In een klas van {n} leerlingen zijn er {k} geslaagd voor hun theorie-examen. Hoeveel procent is dat?', 'leerlingen'],
  ['Van de {n} vragen op een toets had Sam er {k} juist. Hoeveel procent is dat?', 'vragen'],
  ['Op een parking staan {n} auto\'s, waarvan {k} elektrisch. Hoeveel procent van de auto\'s is elektrisch?', "auto's"],
  ['Een jas kost € {n}. Je krijgt € {k} korting. Hoeveel procent korting is dat?', 'euro'],
  ['De prijs van een ticket stijgt van € {n} naar € {m}. Met hoeveel procent is de prijs gestegen?', 'euro'],
];
const TERUG = [
  () => { const k = kies([10, 15, 20, 25, 30, 35, 40, 60]), P = kies([20, 40, 60, 80, 100, 120, 140, 160, 200, 240, 300]), x = P * (100 - k) / 100; if (!isN(x)) return null;
    const r = procentPad(100 - k, x, 100); if (!isN(r.w) || r.kol.some(c => !/^\d+$/.test(c[1]))) return null;
    return { tekst: `Na ${k}% korting betaal je ${euro(x)}. Wat was de oorspronkelijke prijs?`, w: P, na: '\\text{ euro}', L: [`${tg(x)} \\text{ euro is } ${100 - k}\\%`, vtTex(['%', 'euro'], r.kol), `\\text{bewerking: } ${r.bew}`, `${P} \\text{ euro}`] }; },
  () => { const s = kies([2, 4, 5, 8, 10, 20, 25]), P = kies([400, 500, 800, 1000, 1200, 1500, 2000, 2400, 2500]), x = P * (100 + s) / 100; if (!isN(x)) return null;
    const r = procentPad(100 + s, x, 100); if (!isN(r.w) || r.kol.some(c => !/^\d+$/.test(c[1]))) return null;
    return { tekst: `Het maandloon van Sarah stijgt met ${s}%. Ze verdient nu ${euro(x)}. Hoeveel verdiende ze vóór de opslag?`, w: P, na: '\\text{ euro}', L: [`${tg(x)} \\text{ euro is } ${100 + s}\\%`, vtTex(['%', 'euro'], r.kol), `\\text{bewerking: } ${r.bew}`, `${P} \\text{ euro}`] }; },
  () => { const p = kies([4, 6, 8, 12, 15, 24, 35, 45, 60, 75]), N = kies([100, 200, 300, 400, 500, 600, 800, 1200]), x = N * p / 100; if (!isN(x)) return null;
    const r = procentPad(p, x, 100); if (!isN(r.w) || r.kol.some(c => !/^\d+$/.test(c[1]))) return null;
    return { tekst: `Bij een enquête antwoordden ${x} mensen 'ja'. Dat is ${p}% van alle ondervraagden. Hoeveel mensen werden er ondervraagd?`, w: N, na: '\\text{ mensen}', L: [vtTex(['%', 'mensen'], r.kol), `\\text{bewerking: } ${r.bew}`, `${N} \\text{ mensen}`] }; },
];
const P4 = {
  nr: 4, titel: 'Procenten +', kort: 'Slim rekenen, procent bepalen, terugrekenen, procenten na elkaar en btw.', rekenmachine: false,
  theorie: PROCENT_THEORIE,
  voorbeelden: [
    { tex: '8\\% \\text{ van } 25', stappen: [vtTex(['%', 'aantal'], [['100', '25'], ['4', '1'], ['8', '2']]), '\\text{bewerking: } : 25 \\text{ en } \\cdot 2', '8\\% \\text{ van } 25 = 2'] },
    { tex: '\\text{45 mensen antwoordden ja. Dat is 15\\%. Hoeveel mensen werden ondervraagd?}', stappen: [vtTex(['%', 'mensen'], [['15', '45'], ['5', '15'], ['100', '300']]), '\\text{bewerking: } : 3 \\text{ en } \\cdot 20', '300 \\text{ mensen}'] },
    { tex: '\\text{Een tv kost 400 euro: eerst } +10\\%, \\text{ dan } -10\\%.', stappen: ['400 + 40 = 440 \\text{ euro}', '440 - 44 = 396 \\text{ euro}', '\\text{niet gelijk aan de oorspronkelijke prijs!}'] },
  ],
  soorten: {
    slim: { naam: 'Slim rekenen met procenten', gen() {
      return tot(() => {
        if (Math.random() < 0.15) { const y = 8 * rnd(3, 40); return { soort: 'slim', opdracht: 'Bereken met een verhoudingstabel.', tex: `12{,}5\\% \\text{ van } ${y}`, antw: getal(y / 8),
          uitleg: [vtTex(['%', 'aantal'], [['100', y], ['25', y / 4], ['12{,}5', y / 8]]), '\\text{bewerking: } : 4 \\text{ en } : 2', `12{,}5\\% \\text{ van } ${y} = ${y / 8}`] }; }
        const p = kies(SLIM_P), d = 100 / ggd(100, p), y = d * rnd(2, Math.floor(1200 / d)); if (y > 1500 || y < 20) return null;
        const r = procentPad(100, y, p); if (!isN(r.w)) return null;
        return { soort: 'slim', opdracht: 'Bereken met een verhoudingstabel.', tex: `${p}\\% \\text{ van } ${y}`, antw: getal(r.w), uitleg: [vtTex(['%', 'aantal'], r.kol), `\\text{bewerking: } ${r.bew}`, `${p}\\% \\text{ van } ${y} = ${tg(r.w)}`] };
      });
    } },
    bepalen: { naam: 'Hoeveel procent?', gen() {
      return tot(() => {
        const [t, eenh] = kies(PROCENT_BEPALEN), stijging = t.includes('{m}');
        const n = kies([20, 25, 40, 50, 80, 120, 125, 150, 200, 250, 300, 400, 500, 60, 75]), k = rnd(1, n - 1);
        if ((k * 100) % n) return null; const p = k * 100 / n; if ([50, 25, 10].includes(p) && Math.random() < 0.7) return null;
        const r = procentPad(n, 100, k); // n ↔ 100%  →  k ↔ p%
        const tekst = vul(t, { n, k, m: n + k });
        return { soort: 'bepalen', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${tekst}</p>`, sleutel: tekst, rapport: tekst, antw: getal(p, { na: '\\%' }),
          uitleg: [...(stijging ? [`\\text{stijging: } ${n + k} - ${n} = ${k} \\text{ euro}`] : []), vtTex([eenh, '%'], r.kol.map(([x, y]) => [x, y])), `\\text{bewerking: } ${r.bew}`, `${p}\\%`] };
      });
    } },
    terug: { naam: 'Terugrekenen', gen() {
      const r = tot(() => { const x = kies(TERUG)(); return x && isN(x.w) ? x : null; });
      return { soort: 'terug', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { na: r.na }), uitleg: r.L };
    } },
    opeenvolgend: { naam: 'Procenten na elkaar', gen() {
      return tot(() => {
        const P = kies([200, 400, 500, 800, 1000, 1200, 2000]), a = kies([10, 20, 25, 5]), b = kies([10, 20, 25, 5]), op1 = kies(['+', '-']), op2 = op1 === '+' ? '-' : kies(['+', '-']);
        const d1 = P * a / 100, P1 = op1 === '+' ? P + d1 : P - d1, d2 = P1 * b / 100, P2 = op2 === '+' ? P1 + d2 : P1 - d2; if (!isN(d1) || !isN(d2) || !isN(P2)) return null;
        const tekst = `Een toestel kost ${euro(P)}. De winkel ${op1 === '+' ? `verhoogt de prijs eerst met ${a}%` : `geeft eerst ${a}% korting`} en ${op2 === '+' ? `verhoogt daarna de nieuwe prijs met ${b}%` : `geeft daarna nog ${b}% korting op de nieuwe prijs`}. Wat is de prijs na de eerste stap, en wat is de eindprijs?`;
        return { soort: 'opeenvolgend', opdracht: 'Los op met een verhoudingstabel. Reken de tweede keer met de nieuwe prijs.', html: `<p class="opgave-tekst">${tekst}</p>`, sleutel: tekst, rapport: tekst,
          antw: { soort: 'delen', delen: [{ label: '\\text{na stap 1:}', antw: getal(P1, { voor: '', na: '\\text{ euro}' }) }, { label: '\\text{eindprijs:}', antw: getal(P2, { voor: '', na: '\\text{ euro}' }) }] },
          uitleg: [`${a}\\% \\text{ van } ${P} = ${d1} \\Rightarrow ${P} ${op1} ${d1} = ${P1} \\text{ euro}`, `${b}\\% \\text{ van } ${P1} = ${d2} \\Rightarrow ${P1} ${op2} ${d2} = ${P2} \\text{ euro}`] };
      });
    } },
    btw: { naam: 'Btw', gen() {
      const P = 100 * rnd(2, 15), b = P * 21 / 100, T = P + b;
      if (Math.random() < 0.5) {
        const tekst = `Een schilder rekent ${euro(P)} zonder btw. Daarop komt nog 21% btw. Hoeveel moet de klant in totaal betalen?`;
        return { soort: 'btw', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${tekst}</p>`, sleutel: tekst, rapport: tekst, antw: getal(T, { na: '\\text{ euro}' }),
          uitleg: [vtTex(['%', 'euro'], [['100', P], ['1', P / 100], ['21', b]]), `\\text{btw: } ${b} \\text{ euro}`, `${P} + ${b} = ${T} \\text{ euro}`] };
      }
      const tekst = `Met 21% btw betaal je ${euro(T)}. Hoeveel kost het zonder btw?`;
      return { soort: 'btw', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${tekst}</p>`, sleutel: tekst, rapport: tekst, antw: getal(P, { na: '\\text{ euro}' }),
        uitleg: [`${T} \\text{ euro is } 121\\%`, vtTex(['%', 'euro'], [['121', T], ['1', P / 100], ['100', P]]), '\\text{bewerking: } : 121 \\text{ en } \\cdot 100', `${P} \\text{ euro}`] };
    } },
  },
  oefenMix: [['slim', 2], ['bepalen', 1], ['terug', 2], ['opeenvolgend', 1], ['btw', 1]],
  test: [['slim', 2], ['bepalen', 2], ['terug', 3], ['opeenvolgend', 2], ['btw', 1]], testSchudden: true,
};

// ---------------------------------------------------------------
// 5. Evenredigheden +
// ---------------------------------------------------------------
// Elke context heeft eigen, realistische getallen:  a ∈ A, c ∈ C, r = per eenheid (recht) of b ∈ B (omgekeerd).
const R_ = (x, y) => { const l = []; for (let i = x; i <= y; i++) l.push(i); return l; };
// recht: a eenheden ↔ b = a·r; gevraagd c eenheden. Tussenstap via g = ggd(a, c) (c is geen veelvoud van a).
const RECHT = [
  { t: 'Een drukker drukt {b} pagina\'s in {a} minuten. Hoeveel pagina\'s drukt hij in {c} minuten (zelfde tempo)?', n: ['minuten', "pagina's"], e: "pagina's", A: R_(6, 24), C: R_(5, 60), r: R_(10, 40) },
  { t: 'Voor een muur van {a} m² heb je {b} stenen nodig. Hoeveel stenen heb je nodig voor {c} m²?', n: ['m^2', 'stenen'], e: 'stenen', A: R_(4, 15), C: R_(5, 40), r: R_(30, 60) },
  { t: '{a} kg kaas kost € {b}. Hoeveel kost {c} kg van dezelfde kaas?', n: ['kg', 'euro'], e: 'euro', A: R_(2, 9), C: R_(3, 15), r: R_(9, 19) },
  { t: 'Op een kaart stelt {a} cm in werkelijkheid {b} km voor. Twee steden liggen {c} cm van elkaar op de kaart. Hoeveel km is dat in werkelijkheid?', n: ['cm', 'km'], e: 'km', A: R_(2, 6), C: R_(3, 20), r: R_(5, 25) },
  { t: 'Voor {a} euro krijg je {b} Zweedse kronen. Hoeveel kronen krijg je voor {c} euro?', n: ['euro', 'kronen'], e: 'kronen', A: R_(12, 40), C: R_(20, 90), r: R_(10, 12) },
  { t: 'Een recept voor {a} personen vraagt {b} g bloem. Hoeveel g bloem heb je nodig voor {c} personen?', n: ['personen', 'g'], e: 'g', A: R_(4, 8), C: R_(3, 20), r: [50, 60, 75, 80, 100, 120, 125] },
  { t: 'Een bakker bakt {b} broden met {a} kg meel. Hoeveel broden bakt hij met {c} kg meel?', n: ['kg', 'broden'], e: 'broden', A: R_(3, 9), C: R_(5, 40), r: R_(6, 10) },
  { t: 'Een lopende band verpakt {b} dozen in {a} minuten. Hoeveel dozen verpakt ze in {c} minuten?', n: ['minuten', 'dozen'], e: 'dozen', A: R_(6, 15), C: R_(5, 60), r: R_(10, 25) },
];
function rechtGetallen(ctx) {
  for (;;) {
    const a = kies(ctx.A), c = kies(ctx.C), r = kies(ctx.r), g = ggd(a, c);
    if (c === a || c % a === 0 || (a >= 4 && a % c === 0)) continue;
    return { a, b: a * r, c, g, per: g * r, w: c * r };
  }
}
function rechtUitleg(n1, n2, eenh, x) {
  const kol = [[x.a, x.b], [x.g, x.per], [x.c, x.w]];
  return ['\\text{recht evenredig (hoe meer, hoe meer)}', vtTex([n1, n2], kol), `\\text{bewerking: boven en onder } : ${x.a / x.g} \\text{ en } \\cdot ${x.c / x.g}`, `${tg(x.w)} \\text{ ${eenh}}`];
}
function rechtVraag() { const ctx = kies(RECHT), x = rechtGetallen(ctx); return { tekst: vul(ctx.t, x), w: x.w, na: `\\text{ ${ctx.e}}`, L: rechtUitleg(ctx.n[0], ctx.n[1], ctx.e, x) }; }
// omgekeerd: a ↔ b, gevraagd c — het product a·b blijft gelijk
const SNELHEDEN = [40, 50, 60, 80, 90, 100, 120];
const OMGEKEERD = [
  { t: 'Bij een snelheid van {a} km/u duurt een rit {b} uur. Hoeveel uur duurt de rit bij {c} km/u?', n: ['km/u', 'uur'], e: 'uur', A: SNELHEDEN, B: R_(2, 9), C: SNELHEDEN, max: 12 },
  { t: 'Een fietser doet een parcours in {b} minuten bij {a} km/u. Hoeveel minuten doet hij erover bij {c} km/u?', n: ['km/u', 'minuten'], e: 'minuten', A: [12, 15, 16, 18, 20, 24, 25, 30], B: R_(10, 60), C: [12, 15, 16, 18, 20, 24, 25, 30], max: 120 },
  { t: '{a} kranen vullen een zwembad in {b} uur. Hoeveel uur hebben {c} kranen nodig?', n: ['kranen', 'uur'], e: 'uur', A: R_(2, 12), B: R_(4, 48), C: R_(2, 16), max: 100 },
  { t: '{a} printers drukken samen een oplage in {b} uur. Hoeveel uur hebben {c} printers nodig?', n: ['printers', 'uur'], e: 'uur', A: R_(2, 12), B: R_(2, 30), C: R_(2, 16), max: 60 },
  { t: 'Een voorraad voer is genoeg voor {a} paarden gedurende {b} dagen. Hoeveel dagen is het voer genoeg voor {c} paarden?', n: ['paarden', 'dagen'], e: 'dagen', A: R_(3, 20), B: R_(10, 60), C: R_(2, 24), max: 200 },
  { t: 'Een klas van {a} leerlingen verdeelt een taak zo dat elke leerling {b} minuten werkt. Hoeveel minuten werkt elke leerling als de klas {c} leerlingen telt?', n: ['leerlingen', 'minuten'], e: 'minuten', A: R_(12, 30), B: R_(10, 40), C: R_(12, 30), max: 60 },
];
function omgekeerdGetallen(ctx) {
  for (;;) {
    const a = kies(ctx.A), b = kies(ctx.B), c = kies(ctx.C), p = a * b;
    if (c === a || p % c || ((c % a === 0 || a % c === 0) && Math.random() < 0.85)) continue;
    const w = p / c, g = ggd(a, c); if (w > ctx.max || w < 1 || g === a && c % a === 0) continue;
    return { a, b, c, g, w };
  }
}
function omgekeerdUitleg(n1, n2, eenh, x) {
  const kol = [[x.a, x.b], ...(x.g !== x.a && x.g !== x.c ? [[x.g, x.b * x.a / x.g]] : []), [x.c, x.w]];
  const d = x.a / x.g, m = x.c / x.g;
  const boven = [d !== 1 ? `: ${d}` : '', m !== 1 ? `\\cdot ${m}` : ''].filter(Boolean), onder = [d !== 1 ? `\\cdot ${d}` : '', m !== 1 ? `: ${m}` : ''].filter(Boolean);
  return ['\\text{omgekeerd evenredig (hoe meer, hoe minder)}', vtTex([n1, n2], kol), `\\text{boven } ${boven.join(' \\text{ en } ')} \\Rightarrow \\text{ onder } ${onder.join(' \\text{ en } ')}`, `${tg(x.w)} \\text{ ${eenh}}`];
}
function omgekeerdVraag() { const ctx = kies(OMGEKEERD), x = omgekeerdGetallen(ctx); return { tekst: vul(ctx.t, x), w: x.w, na: `\\text{ ${ctx.e}}`, L: omgekeerdUitleg(ctx.n[0], ctx.n[1], ctx.e, x) }; }
// recht of omgekeerd: telkens bijna dezelfde situatie, maar een andere vraag
const PAREN = [
  { t: '{a} arbeiders leggen samen {b} stenen per uur. Hoeveel stenen leggen {c} arbeiders per uur (zelfde tempo per persoon)?', recht: true, n: ['arbeiders', 'stenen'], e: 'stenen', A: R_(3, 8), C: R_(2, 15), r: R_(30, 80) },
  { t: '{a} arbeiders bouwen samen een muur in {b} dagen. Hoeveel dagen hebben {c} arbeiders nodig?', recht: false, n: ['arbeiders', 'dagen'], e: 'dagen', A: R_(2, 12), B: R_(4, 40), C: R_(2, 15), max: 80 },
  { t: 'Een auto rijdt {b} km in {a} uur. Hoeveel km rijdt hij in {c} uur aan dezelfde snelheid?', recht: true, n: ['uur', 'km'], e: 'km', A: R_(2, 5), C: R_(2, 9), r: R_(50, 110) },
  { t: 'Bij {a} km/u duurt een rit {b} uur. Hoeveel uur duurt dezelfde rit bij {c} km/u?', recht: false, n: ['km/u', 'uur'], e: 'uur', A: SNELHEDEN, B: R_(2, 9), C: SNELHEDEN, max: 12 },
  { t: '{a} pompen pompen samen {b} liter water per minuut. Hoeveel liter per minuut pompen {c} pompen?', recht: true, n: ['pompen', 'liter'], e: 'liter', A: R_(2, 8), C: R_(3, 15), r: R_(20, 90) },
  { t: '{a} pompen maken samen een kelder leeg in {b} minuten. Hoeveel minuten hebben {c} pompen nodig?', recht: false, n: ['pompen', 'minuten'], e: 'minuten', A: R_(2, 10), B: R_(10, 90), C: R_(2, 12), max: 180 },
  { t: '{a} paarden eten samen {b} kg hooi per dag. Hoeveel kg hooi per dag eten {c} paarden?', recht: true, n: ['paarden', 'kg'], e: 'kg', A: R_(3, 12), C: R_(2, 20), r: R_(8, 15) },
  { t: 'Een voorraad hooi is genoeg voor {a} paarden gedurende {b} dagen. Hoeveel dagen is hij genoeg voor {c} paarden?', recht: false, n: ['paarden', 'dagen'], e: 'dagen', A: R_(3, 20), B: R_(10, 60), C: R_(2, 24), max: 200 },
];
const P5 = {
  nr: 5, titel: 'Evenredigheden +', kort: 'Moeilijkere getallen, snelheden, valstrikken bij recht/omgekeerd, vraagstukken in twee stappen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Recht of omgekeerd?</div>
      <p><b>Recht evenredig</b>: hoe meer, hoe meer. Wat je boven doet, doe je ook onder.</p>
      <p><b>Omgekeerd evenredig</b>: hoe meer, hoe minder. Doe je boven maal, dan doe je onder gedeeld door (en omgekeerd).</p>
      ${verhoudingstabel(['km/u', 'uur'], [['80', '6'], ['40', '12'], ['120', '4']], 'boven $: 2$ en $\\cdot 3$, onder $\\cdot 2$ en $: 3$')}</div>
    ${PLUS_KADER(`<p><b>Lees de vraag goed.</b> 4 arbeiders leggen 320 stenen <i>per uur</i>: met meer arbeiders leg je <b>meer</b> stenen (recht). 4 arbeiders bouwen een muur in 10 dagen: met meer arbeiders heb je <b>minder</b> dagen nodig (omgekeerd).</p>
      <p><b>Moeilijke getallen?</b> Zoek een handige tussenstap: een getal waardoor je zowel boven als onder mooi kan delen.</p>
      <p><b>In twee stappen</b>: 6 schilders zouden 20 dagen werken. Na 5 dagen komen er 3 bij. Er blijft werk over voor 6 schilders gedurende $20 - 5 = 15$ dagen. Met 9 schilders:</p>
      ${verhoudingstabel(['schilders', 'dagen'], [['6', '15'], ['3', '30'], ['9', '10']], 'boven $: 2$ en $\\cdot 3$, onder $\\cdot 2$ en $: 3$')}
      <p class="midden">Het duurt nog <b>10 dagen</b>.</p>`)}`,
  voorbeelden: [
    { tex: '\\text{Een drukker drukt 480 pagina\'s in 15 minuten. Hoeveel in 40 minuten?}', stappen: ['\\text{recht evenredig}', vtTex(['minuten', "pagina's"], [[15, 480], [5, 160], [40, 1280]]), '\\text{boven en onder } : 3 \\text{ en } \\cdot 8', "1280 \\text{ pagina's}"] },
    { tex: '\\text{Bij 80 km/u duurt een rit 6 uur. Hoe lang bij 120 km/u?}', stappen: ['\\text{omgekeerd evenredig}', vtTex(['km/u', 'uur'], [[80, 6], [40, 12], [120, 4]]), '4 \\text{ uur}'] },
  ],
  soorten: {
    recht: { naam: 'Rechte evenredigheid', gen() { const r = rechtVraag(); return { soort: 'recht', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { na: r.na }), uitleg: r.L }; } },
    omgekeerd: { naam: 'Omgekeerde evenredigheid', gen() { const r = omgekeerdVraag(); return { soort: 'omgekeerd', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { na: r.na }), uitleg: r.L }; } },
    soortVerband: { naam: 'Recht of omgekeerd? (valstrikken)', gen() {
      const ctx = kies(PAREN), recht = ctx.recht, [n1, n2] = ctx.n, eenh = ctx.e;
      const x = recht ? rechtGetallen(ctx) : omgekeerdGetallen(ctx), tekst = vul(ctx.t, x);
      return { soort: 'soortVerband', opdracht: 'Is dit een rechte of een omgekeerde evenredigheid? Los daarna op.', html: `<p class="opgave-tekst">${tekst}</p>`, sleutel: 's' + tekst, rapport: tekst,
        antw: { soort: 'delen', delen: [{ label: '\\text{evenredigheid:}', antw: keuze(kTekst(['recht', 'omgekeerd']), recht ? 0 : 1) }, { label: '\\text{antwoord:}', antw: getal(x.w, { voor: '', na: `\\text{ ${eenh}}` }) }] },
        uitleg: recht ? rechtUitleg(n1, n2, eenh, x) : omgekeerdUitleg(n1, n2, eenh, x) };
    } },
    tweestaps: { naam: 'Vraagstukken in twee stappen', gen() {
      return tot(() => {
        const ctx = kies([
          { t: '{a} schilders zouden een gebouw schilderen in {b} dagen. Na {d} dagen komen er {e} schilders bij. Hoeveel dagen duurt het werk dan nog?', n1: 'schilders', bij: true, wie: 'schilders' },
          { t: '{a} schilders zouden een gebouw schilderen in {b} dagen. Na {d} dagen worden er {e} ziek. Hoeveel dagen duurt het werk dan nog?', n1: 'schilders', bij: false, wie: 'schilders' },
          { t: 'Een voorraad voer is genoeg voor {a} paarden gedurende {b} dagen. Na {d} dagen worden er {e} paarden verkocht. Hoeveel dagen is het voer dan nog genoeg?', n1: 'paarden', bij: false, wie: 'paarden' },
          { t: 'Een voorraad voer is genoeg voor {a} paarden gedurende {b} dagen. Na {d} dagen komen er {e} paarden bij. Hoeveel dagen is het voer dan nog genoeg?', n1: 'paarden', bij: true, wie: 'paarden' },
        ]);
        const a = rnd(4, 15), b = rnd(10, 40), d = rnd(2, b - 4), e = rnd(2, ctx.bij ? 10 : a - 2), rest = b - d, nieuw = ctx.bij ? a + e : a - e;
        if (nieuw < 2 || (a * rest) % nieuw) return null;
        const w = a * rest / nieuw, g = ggd(a, nieuw); if (w === rest) return null;
        const tekst = vul(ctx.t, { a, b, d, e });
        return { soort: 'tweestaps', opdracht: 'Los op in twee stappen. Gebruik een verhoudingstabel.', html: `<p class="opgave-tekst">${tekst}</p>`, sleutel: tekst, rapport: tekst,
          antw: { soort: 'delen', delen: [
            { label: `\\text{stap 1: het werk dat overblijft is voor ${a} ${ctx.wie} gedurende}`, antw: getal(rest, { voor: '', na: '\\text{ dagen}' }) },
            { label: `\\text{stap 2: met ${nieuw} ${ctx.wie} duurt het nog}`, antw: getal(w, { voor: '', na: '\\text{ dagen}' }) }] },
          uitleg: [`\\text{stap 1: } ${b} - ${d} = ${rest} \\text{ dagen voor ${a} ${ctx.wie}}`, `\\text{nu: } ${a} ${ctx.bij ? '+' : '-'} ${e} = ${nieuw} \\text{ ${ctx.wie} (omgekeerd evenredig)}`,
            vtTex([ctx.n1, 'dagen'], [[a, rest], ...(g !== a && g !== nieuw ? [[g, a * rest / g]] : []), [nieuw, w]]), `${w} \\text{ dagen}`] };
      });
    } },
  },
  oefenMix: [['recht', 2], ['omgekeerd', 2], ['soortVerband', 2], ['tweestaps', 1]],
  test: [['recht', 3], ['omgekeerd', 3], ['soortVerband', 2], ['tweestaps', 2]], testSchudden: true,
};

// ---------------------------------------------------------------
// 6. Eindtest
// ---------------------------------------------------------------
const P6 = {
  nr: 6, titel: 'Eindtest rekenen in ℕ +', kort: 'Alles door elkaar, op het niveau van ℕ +.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van ℕ + door elkaar. Herhaal gerust de theorie van een vorig deel. Werk op een kladblad en controleer elke tussenstap.</p></div>${VOLGORDE}`,
  voorbeelden: [],
  soorten: { g: mix(P1, 'genest'), w: mix(P1, 'wortellog'), m: mix(P2, 'machten'), d: mix(P2, 'distributief'), e: mix(P2, 'eerst'), o: mix(P3, 'opsommen'), a: mix(P3, 'aantal'),
    t: mix(P4, 'terug'), n: mix(P4, 'opeenvolgend'), s: mix(P5, 'soortVerband'), ts: mix(P5, 'tweestaps') },
  oefenMix: [['g', 1], ['w', 1], ['m', 1], ['d', 1], ['e', 1], ['o', 1], ['a', 1], ['t', 1], ['n', 1], ['s', 1], ['ts', 1]],
  test: [['g', 1], ['w', 1], ['m', 1], ['d', 1], ['o', 1], ['a', 1], ['t', 1], ['n', 1], ['s', 1], ['ts', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'getallenleer-n-plus', titel: 'Rekenen in ℕ +', ondertitel: 'Getallenleer · 7VJHO · gevorderden', klas: '7VJHO', drempel: 80,
  intro: `<p>Je haalde een sterk resultaat op de instaptoets. Daarom werk je met de <b>+-versie</b>: dezelfde leerstof als Rekenen in ℕ, maar met moeilijkere oefeningen —
    vierkante haakjes, eentermen met exponenten, lastige procenten en evenredigheden in twee stappen. Alles zonder rekenmachine.</p>
    <p>Lees de theorie (kijk zeker naar het kader <b>Extra uitdaging</b>), bekijk de voorbeelden, oefen zoveel je wil en maak dan de test. Haal je <b>8 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Rekenen', delen: [1, 2, 3] }, { titel: 'B · Procenten en evenredigheden', delen: [4, 5] }, { titel: 'C · Eindtest', delen: [6] }],
  delen: [P1, P2, P3, P4, P5, P6],
});
