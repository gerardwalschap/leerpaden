// ===== Afgeleiden: definitie en rekenregels · Toegepaste wiskunde 5BCW =====
// Leidraad: cursus TWiskunde 5BCW hoofdstuk 5 en de PWP/werkbundel "5. Afgeleiden" (G. Walschap).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(x);
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: opties.map(o => ({ k: String(o), l: `\\text{${o}}` })), juist: String(juist) });
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const afg = (expr, extra = {}) => ({ soort: 'functie', expr, vorm: 'vrij', voor: "f'(x) =", ...extra });

// ---------- veeltermen als [[coëf, exponent], ...]
const ptex = (T, v = 'x') => {
  const t = T.filter(([c]) => c !== 0).sort((p, q) => q[1] - p[1]);
  if (!t.length) return '0';
  return t.map(([c, n], i) => {
    const a = Math.abs(c), s = c < 0 ? '-' : i ? '+' : '';
    const coef = n === 0 ? tg(a) : a === 1 ? '' : tg(a);
    const mon = n === 0 ? '' : n === 1 ? v : `${v}^{${n}}`;
    return `${i ? ` ${s} ` : s}${coef}${mon}`;
  }).join('');
};
const pexpr = (T) => { const t = T.filter(([c]) => c !== 0); return t.length ? t.map(([c, n]) => `(${c})${n ? `·x^${n}` : ''}`).join('+') : '0'; };
const pafg = (T) => T.filter(([, n]) => n > 0).map(([c, n]) => [c * n, n - 1]);
const rndPoly = (gr, max = 6) => { const T = [[nz(-max, max), gr]]; for (let n = gr - 1; n >= 0; n--) if (Math.random() < 0.7) T.push([rnd(-max, max), n]); return T; };
const lin = (a, b) => [[a, 1], [b, 0]];
const hk = (s) => `\\left(${s}\\right)`;

// ---------- kleine grafiek
function grafiek(f, opt = {}) {
  const [X0, X1] = opt.x || [-5, 5], [Y0, Y1] = opt.y || [-3, 6], B = 320, H = (Y1 - Y0) / (X1 - X0) * B, m = 18;
  const X = (x) => m + (x - X0) / (X1 - X0) * B, Y = (y) => m + (Y1 - y) / (Y1 - Y0) * H;
  let g = '';
  for (let k = Math.ceil(X0); k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>` + (k ? `<text x="${X(k)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle" fill="#555">${k < 0 ? '−' + -k : k}</text>` : '');
  for (let k = Math.ceil(Y0); k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>`;
  g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1)}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.3"/><line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1)}" stroke="#1f2733" stroke-width="1.3"/>`;
  let d = ''; for (let i = 0; i <= 600; i++) { const x = X0 + (X1 - X0) * i / 600, y = f(x); d += `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(Math.max(Y0 - 1, Math.min(Y1 + 1, y))).toFixed(1)} `; }
  g += `<path d="${d}" fill="none" stroke="#1c4e8a" stroke-width="2.5"/>`;
  for (const [x, y] of opt.punten || []) g += `<circle cx="${X(x)}" cy="${Y(y)}" r="4" fill="#e8772e"/>`;
  return `<div class="figuur"><svg viewBox="0 0 ${B + 2 * m} ${H + 2 * m}" width="${B + 2 * m}" height="${H + 2 * m}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif"><defs><clipPath id="kg"><rect x="${m}" y="${m}" width="${B}" height="${H}"/></clipPath></defs><g clip-path="url(#kg)">${g}</g></svg></div>`;
}

const STIJL = `.vraagzin{margin-top:12px;font-size:16px}`;
if (typeof document !== 'undefined' && document.head && !document.getElementById('afr-stijl')) { const st = document.createElement('style'); st.id = 'afr-stijl'; st.textContent = STIJL; document.head.appendChild(st); }
const INTYPEN = `<div class="kader"><div class="kader-titel">Zo typ je een afgeleide</div>
  <ul><li>Typ enkel het rechterlid, bv. <code>12x^3 - 4x</code> of <code>2x·sin x + x²·cos x</code>.</li>
  <li>Een breuk met <code>/</code> en haakjes: <code>-7/(x - 2)^2</code>. Goniometrisch: <code>cos(2x)</code>, <code>sin x</code>, <code>1/cos²x</code> (of <code>1/cos(x)^2</code>).</li>
  <li>Je hoeft niet te vereenvoudigen: elke juiste vorm wordt aanvaard. Onder het vakje zie je hoe je antwoord gelezen wordt.</li></ul></div>`;
const TABEL = `<table class="tabel"><tr><th>Regel</th><th>$f(x)$</th><th>$f'(x)$</th></tr>
  <tr><td>constante</td><td>$c$</td><td>$0$</td></tr><tr><td>macht</td><td>$x^n$</td><td>$n \\cdot x^{n-1}$</td></tr>
  <tr><td>constante factor</td><td>$c \\cdot f(x)$</td><td>$c \\cdot f'(x)$</td></tr><tr><td>som/verschil</td><td>$f(x) \\pm g(x)$</td><td>$f'(x) \\pm g'(x)$</td></tr></table>`;

// ===================================================================
const D1 = {
  nr: 1, titel: 'De afgeleide in een punt', kort: "f'(a) als limiet van het differentiequotiënt en als rico van de raaklijn.", rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De afgeleide in een punt</div>
      <p>De afgeleide van $f$ in het punt $a$, genoteerd $f'(a)$, is de limiet van het differentiequotiënt:</p>
      <p class="midden">$f'(a) = \\lim\\limits_{x \\to a} \\dfrac{f(x) - f(a)}{x - a} \\qquad \\text{of gelijkwaardig} \\qquad f'(a) = \\lim\\limits_{h \\to 0} \\dfrac{f(a + h) - f(a)}{h}$</p>
      <p>Meetkundig is $f'(a)$ de <b>richtingscoëfficiënt van de raaklijn</b> aan de grafiek van $f$ in het punt $(a, f(a))$.</p>
      <p>Bereken je $f'(x)$ niet voor één vaste $a$ maar voor elke $x$, dan krijg je de <b>afgeleide functie</b> $f'(x)$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: $f(x) = x^2$ in $a = 3$</div>
      <p class="midden">$\\dfrac{f(3 + h) - f(3)}{h} = \\dfrac{9 + 6h + h^2 - 9}{h} = \\dfrac{6h + h^2}{h} = 6 + h \\;\\xrightarrow{h \\to 0}\\; 6$</p><p>Dus $f'(3) = 6$.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = x^2 + 2x, \\; a = 1', stappen: ['f(1 + h) - f(1) = (1 + h)^2 + 2(1 + h) - 3 = 4h + h^2', '\\frac{4h + h^2}{h} = 4 + h', "h \\to 0: \\; f'(1) = 4"] },
  ],
  soorten: {
    definitie: { naam: 'Met de definitie', gen() {
      const c = kies([1, 2, -1, 3]), b = rnd(-5, 5), a = rnd(-3, 4), w = 2 * c * a + b;
      const f = ptex([[c, 2], [b, 1]]);
      return { soort: 'definitie', opdracht: "Bereken f'(a) met de limiet van het differentiequotiënt.", tex: `f(x) = ${f}, \\quad a = ${a}`, sleutel: `${c}${b}${a}`,
        antw: getal(w, { voor: `f'(${a}) =` }), uitleg: [`\\frac{f(${a} + h) - f(${a})}{h} = \\frac{${tg(w)}h ${c > 0 ? '+' : '-'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}h^2}{h} = ${tg(w)} ${c > 0 ? '+' : '-'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}h`, `h \\to 0: \\; f'(${a}) = ${tg(w)}`] };
    } },
    dq: { naam: 'Differentiequotiënt vereenvoudigen', gen() {
      const a = nz(-3, 4), w = 2 * a;
      const opties = schud([`${tg(w)} + h`, `${tg(w)} - h`, `${tg(a * a === w ? w + 1 : a * a)} + h`, `${tg(w)}h + h^2`]);
      return { soort: 'dq', opdracht: 'Werk uit en vereenvoudig.', tex: `f(x) = x^2: \\quad \\frac{f(${a} + h) - f(${a})}{h} = \\; ?`, sleutel: `dq${a}`,
        antw: { soort: 'keuze', opties: opties.map((o, i) => ({ k: String(i), l: o })), juist: String(opties.indexOf(`${tg(w)} + h`)) },
        uitleg: [`\\frac{(${a} + h)^2 - ${a * a}}{h} = \\frac{${tg(w)}h + h^2}{h} = ${tg(w)} + h`] };
    } },
    rico: { naam: 'Rico van de raaklijn', gen() {
      const T = rndPoly(2, 4), a = rnd(-3, 3), d = pafg(T), w = d.reduce((s, [c, n]) => s + c * a ** n, 0);
      return { soort: 'rico', opdracht: "De rico van de raaklijn in (a, f(a)) is f'(a). Bereken eerst f'(x) met de rekenregels.", tex: `f(x) = ${ptex(T)}`, html: vraag(`Wat is de rico van de raaklijn aan de grafiek in het punt met x = ${a < 0 ? '−' + -a : a}?`), sleutel: `r${T}${a}`,
        antw: getal(w, { voor: 'm =' }), uitleg: [`f'(x) = ${ptex(d)}`, `m = f'(${a}) = ${tg(w)}`] };
    } },
  },
  oefenMix: [['definitie', 2], ['dq', 1], ['rico', 1]],
  test: [['definitie', 4], ['dq', 3], ['rico', 3]], testSchudden: true,
};

const KNIK = [
  { f: (x) => Math.abs(x), tex: '|x|', a: 0 }, { f: (x) => Math.abs(x - 2), tex: '|x - 2|', a: 2 }, { f: (x) => Math.abs(x + 1) + 1, tex: '|x + 1| + 1', a: -1 }, { f: (x) => 3 - Math.abs(x - 1), tex: '3 - |x - 1|', a: 1 },
];
const D2 = {
  nr: 2, titel: 'Continuïteit en afleidbaarheid', kort: 'Afleidbaar ⟹ continu, maar niet omgekeerd.', rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Continuïteit en afleidbaarheid</div>
      <p>Als $f$ <b>afleidbaar</b> is in $a$ (dus als $f'(a)$ bestaat), dan is $f$ ook <b>continu</b> in $a$.</p>
      <p>Het omgekeerde geldt <b>niet</b>: een functie kan continu zijn in $a$ zonder er afleidbaar te zijn.</p>
      <p class="midden">afleidbaar in $a$ $\\Longrightarrow$ continu in $a$ &nbsp; (maar niet omgekeerd)</p></div>
    <div class="kader werk"><div class="kader-titel">Klassiek voorbeeld: $f(x) = |x|$</div>
      ${grafiek((x) => Math.abs(x), { x: [-4, 4], y: [-1, 4], punten: [[0, 0]] })}
      <p>$f(x) = |x|$ is continu in $x = 0$, maar niet afleidbaar: de grafiek maakt er een <b>scherpe knik</b>. Van links nadert de rico $-1$, van rechts $+1$: er is geen eenduidige raaklijn.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = |x - 2|', stappen: ['\\text{continu overal (geen sprong)}', '\\text{knik in } x = 2: \\text{ rico links } -1, \\text{ rechts } +1', '\\text{niet afleidbaar in } x = 2'] },
  ],
  soorten: {
    knik: { naam: 'Waar niet afleidbaar?', gen() {
      const K = kies(KNIK);
      return { soort: 'knik', opdracht: 'Zoek de scherpe knik in de grafiek.', tex: `f(x) = ${K.tex}`, html: grafiek(K.f, { x: [-4, 4], y: [-1, 5] }) + vraag('In welke x is f continu maar niet afleidbaar?'), sleutel: K.tex,
        antw: getal(K.a, { voor: 'x =' }), uitleg: [`\\text{knik in } x = ${K.a}: \\text{ de rico van links en van rechts verschillen}`] };
    } },
    ricoLR: { naam: 'Rico van links en van rechts', gen() {
      const K = kies(KNIK), links = K.tex.startsWith('3') ? 1 : -1;
      return { soort: 'ricoLR', opdracht: 'Kijk naar de twee rechte stukken van de grafiek bij de knik.', tex: `f(x) = ${K.tex}`, html: grafiek(K.f, { x: [-4, 4], y: [-1, 5] }) + vraag(`Wat is de rico van links en van rechts in x = ${K.a < 0 ? '−' + -K.a : K.a}?`), sleutel: 'lr' + K.tex,
        antw: { soort: 'delen', delen: [{ label: '\\text{van links}', antw: getal(links) }, { label: '\\text{van rechts}', antw: getal(-links) }] }, uitleg: [`\\text{links } ${links}, \\text{ rechts } ${-links}: \\text{ verschillend, dus niet afleidbaar}`] };
    } },
    wnw: { naam: 'Waar of niet waar?', gen() {
      const v = kies([['Als f afleidbaar is in a, dan is f continu in a.', true, 'Afleidbaar ⟹ continu.'], ['Als f continu is in a, dan is f afleidbaar in a.', false, 'Niet omgekeerd: denk aan |x| in 0.'],
        ['f(x) = |x| is niet continu in x = 0.', false, '|x| is wel continu in 0 (geen sprong), maar niet afleidbaar.'], ['f(x) = |x| is niet afleidbaar in x = 0.', true, 'Knik: rico links −1, rechts +1.'],
        ["f'(a) is de rico van de raaklijn in (a, f(a)).", true, 'Meetkundige betekenis van de afgeleide.'], ['Bij een scherpe knik bestaat er één eenduidige raaklijn.', false, 'Bij een knik is er geen eenduidige raaklijn.']]);
      return { soort: 'wnw', opdracht: 'Denk aan het verband tussen continuïteit en afleidbaarheid.', html: opgave(v[0]) + vraag('Waar of niet waar?'), sleutel: v[0], antw: tekstKeuze(['waar', 'niet waar'], v[1] ? 'waar' : 'niet waar'), uitleg: [tx(v[2])] };
    } },
  },
  oefenMix: [['knik', 1], ['ricoLR', 1], ['wnw', 2]],
  test: [['knik', 3], ['ricoLR', 3], ['wnw', 4]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Basisregels', kort: 'Constante, macht, constante factor, som en verschil.', rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Basisregels voor het afleiden</div>${TABEL}</div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p class="midden">$f(x) = 3x^4 - 2x^2 + 5 \\;\\Rightarrow\\; f'(x) = 12x^3 - 4x$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = 5x^3 - 4x^2 + 7x - 1', stappen: ["f'(x) = 5 \\cdot 3x^2 - 4 \\cdot 2x + 7 - 0", '= 15x^2 - 8x + 7'] },
  ],
  soorten: {
    poly: { naam: 'Veeltermen', gen() {
      const T = rndPoly(rnd(2, 5)), d = pafg(T);
      return { soort: 'poly', opdracht: 'Bereken de afgeleide functie.', tex: `f(x) = ${ptex(T)}`, _f: pexpr(T), sleutel: `${T}`, antw: afg(pexpr(d)), uitleg: [`f'(x) = ${ptex(d)}`] };
    } },
    macht: { naam: 'Hoge machten', gen() {
      const n = rnd(5, 12), c = nz(-4, 4), b = nz(-9, 9), T = [[c, n], [b, 1]], d = pafg(T);
      return { soort: 'macht', opdracht: 'Exponent naar voren, exponent min 1.', tex: `f(x) = ${ptex(T)}`, _f: pexpr(T), sleutel: `m${T}`, antw: afg(pexpr(d)), uitleg: [`f'(x) = ${c} \\cdot ${n}x^{${n - 1}} ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${ptex(d)}`] };
    } },
    waarde: { naam: "f'(a) berekenen", gen() {
      const T = rndPoly(3, 4), a = rnd(-2, 3), d = pafg(T), w = d.reduce((s, [c, n]) => s + c * a ** n, 0);
      return { soort: 'waarde', opdracht: "Bereken eerst f'(x), vul dan a in.", tex: `f(x) = ${ptex(T)}`, html: vraag(`Bereken f '(${a < 0 ? '−' + -a : a}).`), sleutel: `w${T}${a}`,
        antw: getal(w, { voor: `f'(${a}) =` }), uitleg: [`f'(x) = ${ptex(d)}`, `f'(${a}) = ${tg(w)}`] };
    } },
  },
  oefenMix: [['poly', 2], ['macht', 1], ['waarde', 1]],
  test: [['poly', 5], ['macht', 2], ['waarde', 3]], testSchudden: true,
};

// productregel
const PROD = [
  () => { const P = lin(nz(-4, 5), rnd(-6, 6)), Q = lin(nz(-4, 5), rnd(-6, 6)); return { f: `(${pexpr(P)})·(${pexpr(Q)})`, tex: `${hk(ptex(P))}${hk(ptex(Q))}`, uit: `${hk(ptex(pafg(P)))}${hk(ptex(Q))} + ${hk(ptex(P))}${hk(ptex(pafg(Q)))}`, expr: `(${pexpr(pafg(P))})·(${pexpr(Q)})+(${pexpr(P)})·(${pexpr(pafg(Q))})` }; },
  () => { const n = rnd(2, 4), P = [[1, n]], Q = lin(nz(-5, 5), rnd(-6, 6)); return { f: `x^${n}·(${pexpr(Q)})`, tex: `x^{${n}}${hk(ptex(Q))}`, uit: `${n}x^{${n - 1}}${hk(ptex(Q))} + x^{${n}} \\cdot ${tg(Q[0][0])}`, expr: `${n}·x^${n - 1}·(${pexpr(Q)})+x^${n}·(${Q[0][0]})` }; },
  () => { const n = rnd(1, 4), g = kies(['sin', 'cos']), xn = n === 1 ? 'x' : `x^{${n}}`; return { f: `x^${n}·${g}(x)`, tex: `${xn} \\cdot \\${g} x`, uit: `${n === 1 ? '' : n}${n - 1 === 0 ? '' : n - 1 === 1 ? 'x' : `x^{${n - 1}}`} \\cdot \\${g} x + ${xn} \\cdot ${g === 'sin' ? '\\cos x' : '(-\\sin x)'}`, expr: `${n}·x^${n - 1}·${g}(x)+x^${n}·${g === 'sin' ? 'cos(x)' : '(-sin(x))'}` }; },
  () => ({ f: 'sin(x)·cos(x)', tex: '\\sin x \\cdot \\cos x', uit: '\\cos x \\cdot \\cos x + \\sin x \\cdot (-\\sin x) = \\cos^2 x - \\sin^2 x', expr: 'cos(x)^2-sin(x)^2' }),
];
const D4 = {
  nr: 4, titel: 'De productregel', kort: "(f · g)' = f' · g + f · g'", rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Productregel</div>
      <p class="midden">$\\big(f(x) \\cdot g(x)\\big)' = f'(x) \\cdot g(x) + f(x) \\cdot g'(x)$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p class="midden">$f(x) = x^2 \\cdot \\sin x \\;\\Rightarrow\\; f'(x) = 2x \\cdot \\sin x + x^2 \\cdot \\cos x$</p>
      <p class="klein">Je gebruikt hier $(\\sin x)' = \\cos x$ en $(\\cos x)' = -\\sin x$ (zie deel 7).</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = (2x + 1)(x - 3)', stappen: ["f'(x) = 2 \\cdot (x - 3) + (2x + 1) \\cdot 1", '= 2x - 6 + 2x + 1 = 4x - 5'] },
  ],
  soorten: {
    lin: { naam: 'Twee eerstegraadsfactoren', gen() { const P = PROD[0](); return { soort: 'lin', opdracht: 'Gebruik de productregel.', tex: `f(x) = ${P.tex}`, sleutel: P.tex, _f: P.f, antw: afg(P.expr), uitleg: [`f'(x) = ${P.uit}`] }; } },
    macht: { naam: 'Macht maal veelterm', gen() { const P = PROD[1](); return { soort: 'macht', opdracht: 'Gebruik de productregel.', tex: `f(x) = ${P.tex}`, sleutel: P.tex, _f: P.f, antw: afg(P.expr), uitleg: [`f'(x) = ${P.uit}`] }; } },
    gonio: { naam: 'Met sin of cos', gen() { const P = kies([PROD[2], PROD[2], PROD[3]])(); return { soort: 'gonio', opdracht: 'Gebruik de productregel.', tex: `f(x) = ${P.tex}`, sleutel: P.tex, _f: P.f, antw: afg(P.expr), uitleg: [`f'(x) = ${P.uit}`] }; } },
  },
  oefenMix: [['lin', 2], ['macht', 1], ['gonio', 1]],
  test: [['lin', 4], ['macht', 3], ['gonio', 3]], testSchudden: true,
};

const D5 = {
  nr: 5, titel: 'De quotiëntregel', kort: "(f / g)' = (f' · g − f · g') / g²", rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Quotiëntregel</div>
      <p class="midden">$\\left(\\dfrac{f(x)}{g(x)}\\right)' = \\dfrac{f'(x) \\cdot g(x) - f(x) \\cdot g'(x)}{\\big(g(x)\\big)^2}$</p>
      <p class="klein">Let op de volgorde in de teller: <b>eerst</b> de afgeleide van de teller.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld (rationale functie)</div>
      <p class="midden">$f(x) = \\dfrac{x + 3}{x - 2} \\;\\Rightarrow\\; f'(x) = \\dfrac{1 \\cdot (x - 2) - (x + 3) \\cdot 1}{(x - 2)^2} = \\dfrac{-5}{(x - 2)^2}$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = \\frac{2x - 1}{x + 4}', stappen: ["f'(x) = \\frac{2(x + 4) - (2x - 1) \\cdot 1}{(x + 4)^2}", '= \\frac{9}{(x + 4)^2}'] },
  ],
  soorten: {
    lin: { naam: '(ax + b) / (cx + d)', gen() {
      let a, b, c, d; do { a = nz(-4, 5); b = rnd(-6, 6); c = kies([1, 1, 2, -1]); d = nz(-6, 6); } while (a * d - b * c === 0);
      const T = lin(a, b), N = lin(c, d), teller = a * d - b * c;
      return { soort: 'lin', opdracht: 'Gebruik de quotiëntregel.', tex: `f(x) = \\dfrac{${ptex(T)}}{${ptex(N)}}`, _f: `(${pexpr(T)})/(${pexpr(N)})`, sleutel: `${T}${N}`, antw: afg(`(${teller})/(${pexpr(N)})^2`),
        uitleg: [`f'(x) = \\frac{${tg(a)}${hk(ptex(N))} - ${hk(ptex(T))} \\cdot ${tg(c)}}{${hk(ptex(N))}^2}`, `= \\frac{${tg(teller)}}{${hk(ptex(N))}^2}`] };
    } },
    kwadr: { naam: '(x² + a) / (x + b)', gen() {
      const a = nz(-6, 6), b = nz(-5, 5), T = [[1, 2], [a, 0]], N = lin(1, b), tel = [[1, 2], [2 * b, 1], [-a, 0]];
      return { soort: 'kwadr', opdracht: 'Gebruik de quotiëntregel.', tex: `f(x) = \\dfrac{${ptex(T)}}{${ptex(N)}}`, _f: `(${pexpr(T)})/(${pexpr(N)})`, sleutel: `k${a}${b}`, antw: afg(`(${pexpr(tel)})/(${pexpr(N)})^2`),
        uitleg: [`f'(x) = \\frac{2x${hk(ptex(N))} - ${hk(ptex(T))} \\cdot 1}{${hk(ptex(N))}^2}`, `= \\frac{${ptex(tel)}}{${hk(ptex(N))}^2}`] };
    } },
    een: { naam: 'c / (veelterm)', gen() {
      const c = nz(-6, 6), N = kies([lin(nz(-3, 3), nz(-5, 5)), [[1, 2], [nz(-5, 6), 0]]]), dN = pafg(N);
      return { soort: 'een', opdracht: 'Gebruik de quotiëntregel (de afgeleide van de teller is 0).', tex: `f(x) = \\dfrac{${c}}{${ptex(N)}}`, _f: `(${c})/(${pexpr(N)})`, sleutel: `e${c}${N}`, antw: afg(`(${-c})·(${pexpr(dN)})/(${pexpr(N)})^2`),
        uitleg: [`f'(x) = \\frac{0 \\cdot ${hk(ptex(N))} - ${tg(c)} \\cdot ${hk(ptex(dN))}}{${hk(ptex(N))}^2}`] };
    } },
  },
  oefenMix: [['lin', 2], ['kwadr', 1], ['een', 1]],
  test: [['lin', 4], ['kwadr', 3], ['een', 3]], testSchudden: true,
};

const D6 = {
  nr: 6, titel: 'De kettingregel', kort: "(f(g(x)))' = f'(g(x)) · g'(x)", rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Kettingregel</div>
      <p>Voor een samengestelde functie $f(g(x))$ ("een functie binnen een functie"):</p>
      <p class="midden">$\\big(f(g(x))\\big)' = f'(g(x)) \\cdot g'(x)$</p>
      <p>In woorden: afgeleide van de <b>buitenfunctie</b> (met de binnenfunctie ingevuld), maal de afgeleide van de <b>binnenfunctie</b>.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$f(x) = (2x + 1)^5$: buitenfunctie $\\text{iets}^5$, binnenfunctie $2x + 1$.</p>
      <p class="midden">$f'(x) = 5(2x + 1)^4 \\cdot 2 = 10(2x + 1)^4$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = (x^2 - 1)^5', stappen: ["f'(x) = 5(x^2 - 1)^4 \\cdot 2x", '= 10x(x^2 - 1)^4'] },
  ],
  soorten: {
    lin: { naam: '(ax + b)ⁿ', gen() {
      const a = nz(-5, 6), b = nz(-7, 7), n = rnd(2, 7), P = lin(a, b);
      return { soort: 'lin', opdracht: 'Gebruik de kettingregel.', tex: `f(x) = ${hk(ptex(P))}^{${n}}`, _f: `(${pexpr(P)})^${n}`, sleutel: `${a}${b}${n}`, antw: afg(`${n * a}·(${pexpr(P)})^${n - 1}`),
        uitleg: [`f'(x) = ${n}${hk(ptex(P))}^{${n - 1}} \\cdot ${tg(a)}`, `= ${tg(n * a)}${hk(ptex(P))}^{${n - 1}}`] };
    } },
    kwadr: { naam: '(x² + a)ⁿ', gen() {
      const c = kies([1, 1, 2, -1]), a = nz(-6, 6), n = rnd(2, 6), P = [[c, 2], [a, 0]];
      return { soort: 'kwadr', opdracht: 'Binnenfunctie: de veelterm tussen haakjes.', tex: `f(x) = ${hk(ptex(P))}^{${n}}`, _f: `(${pexpr(P)})^${n}`, sleutel: `k${c}${a}${n}`, antw: afg(`${n * 2 * c}·x·(${pexpr(P)})^${n - 1}`),
        uitleg: [`f'(x) = ${n}${hk(ptex(P))}^{${n - 1}} \\cdot ${ptex([[2 * c, 1]])}`, `= ${ptex([[2 * n * c, 1]])}${hk(ptex(P))}^{${n - 1}}`] };
    } },
    buiten: { naam: 'Buiten- en binnenfunctie', gen() {
      const a = nz(-4, 5), b = nz(-6, 6), n = rnd(3, 8), P = lin(a, b);
      const opties = schud([`${ptex(P)}`, `\\text{iets}^{${n}}`, `x^{${n}}`, `${n}`]);
      return { soort: 'buiten', opdracht: 'Wat staat er "binnenin"?', tex: `f(x) = ${hk(ptex(P))}^{${n}}`, html: vraag('Wat is de binnenfunctie?'), sleutel: `b${a}${b}${n}`,
        antw: { soort: 'keuze', opties: opties.map((o, i) => ({ k: String(i), l: o })), juist: String(opties.indexOf(ptex(P))) }, uitleg: [`\\text{buitenfunctie: iets}^{${n}}, \\text{ binnenfunctie: } ${ptex(P)}`] };
    } },
  },
  oefenMix: [['lin', 2], ['kwadr', 2], ['buiten', 1]],
  test: [['lin', 4], ['kwadr', 4], ['buiten', 2]], testSchudden: true,
};

const D7 = {
  nr: 7, titel: 'Goniometrische functies', kort: "(sin x)' = cos x · (cos x)' = −sin x · (tan x)' = 1/cos²x", rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Afgeleiden van de standaardfuncties</div>
      <table class="tabel"><tr><th>Functietype</th><th>$f(x)$</th><th>$f'(x)$</th></tr><tr><td>veeltermfunctie</td><td>$x^n$</td><td>$n \\cdot x^{n-1}$</td></tr>
      <tr><td rowspan="3">goniometrische functie</td><td>$\\sin x$</td><td>$\\cos x$</td></tr><tr><td>$\\cos x$</td><td>$-\\sin x$</td></tr><tr><td>$\\tan x$</td><td>$\\dfrac{1}{\\cos^2 x}$</td></tr></table></div>
    <div class="kader werk"><div class="kader-titel">Samen met de kettingregel</div>
      <p class="midden">$f(x) = \\sin(2x) \\Rightarrow f'(x) = 2\\cos(2x) \\qquad f(x) = \\cos(x^2 + 1) \\Rightarrow f'(x) = -2x \\sin(x^2 + 1)$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = 3\\sin x - 2\\cos x', stappen: ["f'(x) = 3\\cos x - 2 \\cdot (-\\sin x)", '= 3\\cos x + 2\\sin x'] },
    { tex: 'f(x) = \\tan(2x)', stappen: ["f'(x) = \\frac{1}{\\cos^2(2x)} \\cdot 2 = \\frac{2}{\\cos^2(2x)}"] },
  ],
  soorten: {
    basis: { naam: 'a sin x + b cos x', gen() {
      const a = nz(-5, 5), b = nz(-5, 5);
      return { soort: 'basis', opdracht: 'Gebruik de tabel.', tex: `f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}\\sin x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}\\cos x`, _f: `(${a})·sin(x)+(${b})·cos(x)`, sleutel: `${a}${b}`,
        antw: afg(`(${a})·cos(x)-(${b})·sin(x)`), uitleg: [`f'(x) = ${tg(a)}\\cos x - ${hk(tg(b))}\\sin x`] };
    } },
    ketting: { naam: 'sin(kx), cos(kx), tan(kx)', gen() {
      const g = kies(['sin', 'cos', 'tan']), k = kies([2, 3, 4, 5, -2, -3]);
      const e = g === 'sin' ? `${k}·cos(${k}x)` : g === 'cos' ? `${-k}·sin(${k}x)` : `${k}/cos(${k}x)^2`;
      const u = g === 'sin' ? `${tg(k)}\\cos(${k}x)` : g === 'cos' ? `${tg(-k)}\\sin(${k}x)` : `\\frac{${k}}{\\cos^2(${k}x)}`;
      return { soort: 'ketting', opdracht: 'Tabel + kettingregel (binnenfunctie kx).', tex: `f(x) = \\${g}(${k}x)`, _f: `${g}(${k}x)`, sleutel: `${g}${k}`, antw: afg(e), uitleg: [`f'(x) = ${u}`] };
    } },
    samengesteld: { naam: 'sin/cos van een veelterm', gen() {
      const g = kies(['sin', 'cos']), c = kies([1, 1, 2, 3]), a = rnd(-5, 5), P = [[c, 2], [a, 0]], dP = pafg(P);
      return { soort: 'samengesteld', opdracht: 'Buitenfunctie sin of cos, binnenfunctie de veelterm.', tex: `f(x) = \\${g}${hk(ptex(P))}`, _f: `${g}(${pexpr(P)})`, sleutel: `s${g}${c}${a}`,
        antw: afg(`${g === 'sin' ? '' : '-'}(${pexpr(dP)})·${g === 'sin' ? 'cos' : 'sin'}(${pexpr(P)})`), uitleg: [`f'(x) = ${g === 'sin' ? '' : '-'}${ptex(dP)} \\${g === 'sin' ? 'cos' : 'sin'}${hk(ptex(P))}`] };
    } },
  },
  oefenMix: [['basis', 1], ['ketting', 2], ['samengesteld', 1]],
  test: [['basis', 3], ['ketting', 4], ['samengesteld', 3]], testSchudden: true,
};

const D8 = {
  nr: 8, titel: 'Toepassingen', kort: 'Raaklijn opstellen en snelheid als afgeleide.', rekenmachine: true,
  theorie: `<div class="kader eig"><div class="kader-titel">Vergelijking van de raaklijn</div>
      <p>De raaklijn in het punt met $x = a$ gaat door $(a, f(a))$ en heeft rico $m = f'(a)$:</p>
      <p class="midden">$y - f(a) = f'(a) \\cdot (x - a)$</p>
      <p class="klein">Voorbeeld: $f(x) = x^2 - 3x + 2$ in $x = 2$: $f(2) = 0$, $f'(x) = 2x - 3$, $f'(2) = 1$, dus $y = x - 2$.</p></div>
    <div class="kader eig"><div class="kader-titel">Snelheid</div>
      <p>Is $h(t)$ een hoogte in functie van de tijd, dan is $h'(t)$ de <b>snelheid</b>. Op het hoogste punt is de snelheid nul: $h'(t) = 0$.</p>
      <p class="klein">Voorbeeld: $h(t) = -5t^2 + 20t + 1$, $h'(t) = -10t + 20 = 0 \\Rightarrow t = 2$ s.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = x^3 - 2x, \\; x = 1', stappen: ["f(1) = -1, \\; f'(x) = 3x^2 - 2, \\; f'(1) = 1", 'y + 1 = 1 \\cdot (x - 1) \\Rightarrow y = x - 2'] },
  ],
  soorten: {
    raaklijn: { naam: 'Raaklijn opstellen', gen() {
      const T = rndPoly(kies([2, 2, 3]), 4), a = rnd(-2, 3), d = pafg(T), fa = T.reduce((s, [c, n]) => s + c * a ** n, 0), m = d.reduce((s, [c, n]) => s + c * a ** n, 0), q = fa - m * a;
      return { soort: 'raaklijn', opdracht: 'Schrijf de raaklijn als y = mx + q.', tex: `f(x) = ${ptex(T)}`, html: vraag(`Stel de vergelijking op van de raaklijn in het punt met x = ${a < 0 ? '−' + -a : a}.`), sleutel: `${T}${a}`,
        antw: { soort: 'delen', delen: [{ label: 'm =', antw: getal(m) }, { label: 'q =', antw: getal(q) }] }, uitleg: [`f(${a}) = ${tg(fa)}, \\; f'(x) = ${ptex(d)}, \\; f'(${a}) = ${tg(m)}`, `y - ${hk(tg(fa))} = ${tg(m)}(x - ${hk(tg(a))}) \\Rightarrow y = ${ptex([[m, 1], [q, 0]])}`] };
    } },
    snelheid: { naam: 'Hoogste punt', gen() {
      const v = kies([10, 15, 20, 25, 30]), h0 = rnd(0, 3), t = v / 10, hmax = -5 * t * t + v * t + h0;
      return { soort: 'snelheid', opdracht: "Het hoogste punt: h'(t) = 0.", html: opgave(`Een balletje wordt verticaal omhooggegooid. De hoogte (in m) na t seconden is h(t) = −5t² + ${v}t + ${h0}.`) + vraag('Na hoeveel seconden is het balletje op het hoogste punt, en hoe hoog is dat?'), sleutel: `${v}${h0}`,
        antw: { soort: 'delen', delen: [{ label: 't =', antw: getal(t, { na: '\\text{ s}' }) }, { label: 'h =', antw: getal(hmax, { na: '\\text{ m}' }) }] }, uitleg: [`h'(t) = -10t + ${v} = 0 \\Rightarrow t = ${tg(t)}`, `h(${tg(t)}) = ${tg(hmax)}`] };
    } },
    afgeleide: { naam: 'Snelheid op een tijdstip', gen() {
      const v = kies([10, 15, 20, 25]), h0 = rnd(0, 3), t = kies([0.5, 1, 1.5, 2, 2.5]), s = -10 * t + v;
      return { soort: 'afgeleide', opdracht: "De snelheid is h'(t).", html: opgave(`De hoogte (in m) van een voorwerp na t seconden is h(t) = −5t² + ${v}t + ${h0}.`) + vraag(`Hoe groot is de snelheid na ${String(t).replace('.', ',')} s?`), sleutel: `a${v}${h0}${t}`,
        antw: getal(s, { na: '\\text{ m/s}' }), uitleg: [`h'(t) = -10t + ${v}`, `h'(${tg(t)}) = ${tg(s)} \\text{ m/s}${s < 0 ? ' \\text{ (het voorwerp daalt)}' : ''}`] };
    } },
  },
  oefenMix: [['raaklijn', 2], ['snelheid', 1], ['afgeleide', 1]],
  test: [['raaklijn', 4], ['snelheid', 3], ['afgeleide', 3]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D9 = {
  nr: 9, titel: 'Eindtest afgeleiden', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herken eerst het type (som, product, quotiënt, samengesteld) vóór je een regel toepast.</p></div>${TABEL}${INTYPEN}`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'definitie', 'Met de definitie'), e2: mix(D2, 'wnw', 'Continuïteit en afleidbaarheid'), e3: mix(D3, 'poly', 'Basisregels'), e4: mix(D4, 'lin', 'Productregel'), e5: mix(D4, 'gonio', 'Productregel (gonio)'),
    e6: mix(D5, 'lin', 'Quotiëntregel'), e7: mix(D6, 'lin', 'Kettingregel'), e8: mix(D6, 'kwadr', 'Kettingregel (veelterm)'), e9: mix(D7, 'ketting', 'Goniometrisch'), e10: mix(D8, 'raaklijn', 'Raaklijn') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6, D7, D8, D9]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen.bind(s);
    s.gen = () => {
      const v = { ...g() };
      if (v.antw && v.antw.soort === 'functie' && !v.antw.tex && v.uitleg && v.uitleg.length) { const l = v.uitleg[v.uitleg.length - 1], i = l.lastIndexOf('= '); v.antw = { ...v.antw, tex: l.slice(i + 2) }; }
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
}

Leerpaden.registreer({
  code: 'afgeleiden-rekenregels',
  titel: 'Afgeleiden: definitie en rekenregels',
  ondertitel: 'Toegepaste wiskunde · 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert de <b>afgeleide in een punt</b> en de <b>afgeleide functie</b> definiëren, het verband tussen <b>continuïteit en afleidbaarheid</b>, en vooral: afgeleiden <b>berekenen</b>
    met de rekenregels (som, product, quotiënt en de kettingregel) voor veeltermfuncties, rationale functies en goniometrische functies. Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p>Je hoeft een afgeleide niet te vereenvoudigen: elke juiste vorm wordt aanvaard.</p>`,
  groepen: [
    { titel: 'A · Definitie', delen: [1, 2] },
    { titel: 'B · Rekenregels', delen: [3, 4, 5, 6, 7] },
    { titel: 'C · Toepassen', delen: [8] },
    { titel: 'D · Eindtest', delen: [9] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9],
});
