// Programma 'complexe-getallen' — automatisch samengevoegd uit bron/complexe-getallen/ (niet rechtstreeks bewerken)
(() => {
// ===== Complexe getallen · Toegepaste wiskunde 5BCW — hulpmiddelen =====
// Leidraad: cursus en werkbundel TWiskunde 5BCW, hoofdstuk 2 Complexe getallen (G. Walschap).
// Hoeken altijd in GRADEN (de leerlingen kennen nog geen radialen).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(x);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const gr = (x) => `${tg(x)}^\\circ`;
const rond2 = (x) => W.rond(x, 2);
const t2 = (x) => W.texGetal(x, 2, Math.abs(rond2(x) - x) > 1e-9);      // afgerond op 2 decimalen, ook een 0 achteraan
const gr2 = (x) => `${t2(x)}^\\circ`;

// ---- complexe getallen met gehele (of rationale) delen
const Z = (re, im) => ({ re, im });
const zt = (z) => CX.texAbi(z.re, z.im);                          // TeX van a + bi
const zh = (z) => (z.re !== 0 && z.im !== 0) || z.re < 0 || z.im < 0 ? `(${zt(z)})` : zt(z);
const mul = (a, b) => Z(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const plus = (a, b) => Z(a.re + b.re, a.im + b.im);
const min = (a, b) => Z(a.re - b.re, a.im - b.im);
const toeg = (z) => Z(z.re, -z.im);
const willekeurig = (m = 9) => Z(nz(-m, m), nz(-m, m));

// ---- antwoorden
const cAntw = (z, extra = {}) => ({ soort: 'complex', re: z.re, im: z.im, tex: extra.tex || zt(z), ...extra });
const rAntw = (r, tex, extra = {}) => ({ soort: 'complex', re: r, im: 0, tex, vorm: 'vrij', voor: '', ...extra });
const hAntw = (t, extra = {}) => ({ soort: 'hoek', waarde: t, voor: '', na: '^\\circ', ...extra });
const getal = (x, extra = {}) => ({ soort: 'getal', waarde: x, voor: '', ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist });
const goniAntw = (r, rTex, t) => ({ soort: 'delen', delen: [{ label: 'r =', antw: rAntw(r, rTex) }, { label: '\\theta =', antw: hAntw(t) }] });

// ---- exacte getallen q·√s  (q = teller/noemer, s ∈ {1, 2, 3, 6})
const ggd = W.ggd;
function Ex(t, n = 1, s = 1) {
  if (n < 0) { t = -t; n = -n; }
  for (let k = 2; k * k <= s; k++) while (s % (k * k) === 0) { s /= k * k; t *= k; }
  const g = ggd(t, n) || 1;
  return { t: t / g, n: n / g, s, v: (t / g) / (n / g) * Math.sqrt(s) };
}
const exMaal = (a, b) => Ex(a.t * b.t, a.n * b.n, a.s * b.s);
function exTex(e, metTeken = true) {
  if (e.t === 0) return '0';
  const neg = e.t < 0, t = Math.abs(e.t);
  const w = e.s === 1 ? '' : `\\sqrt{${e.s}}`;
  const teller = e.s === 1 ? String(t) : (t === 1 ? w : `${t}${w}`);
  const kern = e.n === 1 ? teller : `\\frac{${teller}}{${e.n}}`;
  return (neg && metTeken ? '-' : '') + kern;
}
// a + bi met exacte delen
function exZTex(a, b) {
  if (b.t === 0) return exTex(a);
  const bAbs = exTex({ ...b, t: Math.abs(b.t) }, false);
  const bDeel = bAbs === '1' ? 'i' : `${bAbs}${b.s !== 1 && b.n === 1 ? '\\,' : ''}i`;
  if (a.t === 0) return (b.t < 0 ? '-' : '') + bDeel;
  return `${exTex(a)} ${b.t < 0 ? '-' : '+'} ${bDeel}`;
}
// cos en sin van bijzondere hoeken (veelvouden van 30° en 45°), exact
function exCos(t) {
  const a = ((t % 360) + 360) % 360;
  const tab = { 0: Ex(1), 30: Ex(1, 2, 3), 45: Ex(1, 2, 2), 60: Ex(1, 2), 90: Ex(0) };
  if (a <= 90) return tab[a];
  if (a <= 180) { const e = tab[180 - a]; return Ex(-e.t, e.n, e.s); }
  if (a <= 270) { const e = tab[a - 180]; return Ex(-e.t, e.n, e.s); }
  return tab[360 - a];
}
const exSin = (t) => exCos(90 - t);
const BIJZONDER = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
const isBijzonder = (t) => BIJZONDER.includes(((t % 360) + 360) % 360);

// ---- goniometrische vorm
const goniTex = (rT, t) => { const g = t < 0 ? `(${gr(t)})` : gr(t); return `${rT}\\left(\\cos ${g} + i \\sin ${g}\\right)`; };
// argument in graden met de werkwijze van de cursus: boogtan(b/a), +180° als a < 0
function argument(a, b) {
  const basis = Math.atan(b / a) * 180 / Math.PI;
  return a > 0 ? basis : basis + 180;
}
function kwadrant(a, b) { return a > 0 ? (b > 0 ? 'I' : 'IV') : (b > 0 ? 'II' : 'III'); }
// modulus √(a² + b²) als TeX (vereenvoudigd) en waarde
function modulus(a, b) {
  const k = a * a + b * b, e = Ex(1, 1, k);
  return { v: Math.sqrt(k), k, tex: exTex(e), exact: e };
}
// uitleg cartesisch → goniometrisch
function argUitleg(a, b) {
  const kw = kwadrant(a, b), basis = Math.atan(b / a) * 180 / Math.PI, t = argument(a, b);
  const bt = `\\text{boogtan}\\,\\dfrac{${tg(b)}}{${tg(a)}}`;
  const exact = Math.abs(basis - Math.round(basis)) < 1e-9;
  const bs = exact ? `= ${gr(Math.round(basis))}` : `\\approx ${gr2(basis)}`;
  if (a > 0) return [`\\text{kwadrant ${kw}: } \\theta = ${bt} ${bs}`];
  return [`\\text{kwadrant ${kw} } (a < 0)\\text{: } ${bt} ${bs}`, `\\theta ${exact ? '=' : '\\approx'} ${exact ? gr(Math.round(basis)) : gr2(basis)} + 180^\\circ ${exact ? '=' : '\\approx'} ${exact ? gr(Math.round(t)) : gr2(t)}`];
}

// ---- het complexe vlak (SVG)
// punten: [{ z: {re, im}, label, kleur? }], opties: { R (bereik), vector (z die met pijl en hoek getekend wordt) }
function vlak(punten = [], opt = {}) {
  const R = opt.R || 5, S = opt.grootte || 260, m = 22, w = S + 2 * m, sc = S / (2 * R);
  const X = (x) => m + (x + R) * sc, Y = (y) => m + (R - y) * sc;
  let g = '';
  for (let k = -R; k <= R; k++) {
    g += `<line x1="${X(k)}" y1="${Y(-R)}" x2="${X(k)}" y2="${Y(R)}" stroke="#e3e7ee" stroke-width="1"/>`;
    g += `<line x1="${X(-R)}" y1="${Y(k)}" x2="${X(R)}" y2="${Y(k)}" stroke="#e3e7ee" stroke-width="1"/>`;
  }
  g += `<line x1="${X(-R)}" y1="${Y(0)}" x2="${X(R) + 8}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.6" marker-end="url(#pijl)"/>`;
  g += `<line x1="${X(0)}" y1="${Y(-R)}" x2="${X(0)}" y2="${Y(R) - 8}" stroke="#1f2733" stroke-width="1.6" marker-end="url(#pijl)"/>`;
  g += `<text x="${X(R) + 2}" y="${Y(0) - 7}" font-size="12" text-anchor="end" font-style="italic">Re</text>`;
  g += `<text x="${X(0) + 6}" y="${Y(R) + 4}" font-size="12" font-style="italic">Im</text>`;
  g += `<text x="${X(1)}" y="${Y(0) + 14}" font-size="11" text-anchor="middle">1</text>`;
  g += `<text x="${X(0) - 5}" y="${Y(1) + 4}" font-size="11" text-anchor="end">i</text>`;
  g += `<text x="${X(0) - 4}" y="${Y(0) + 13}" font-size="11" text-anchor="end">0</text>`;
  if (opt.vector) {
    const v = opt.vector, x = X(v.re), y = Y(v.im);
    g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${x}" y2="${y}" stroke="#e8772e" stroke-width="2.2" marker-end="url(#pijlo)"/>`;
    if (opt.stippel) g += `<line x1="${x}" y1="${y}" x2="${x}" y2="${Y(0)}" stroke="#1c4e8a" stroke-dasharray="4 3"/><line x1="${x}" y1="${y}" x2="${X(0)}" y2="${y}" stroke="#1c4e8a" stroke-dasharray="4 3"/>`;
    const t = argument(v.re, v.im) * Math.PI / 180, rb = 26;
    const groot = ((argument(v.re, v.im) % 360) + 360) % 360 > 180 ? 1 : 0;
    const eind = ((argument(v.re, v.im) % 360) + 360) % 360;
    g += `<path d="M ${X(0) + rb} ${Y(0)} A ${rb} ${rb} 0 ${groot} 0 ${X(0) + rb * Math.cos(eind * Math.PI / 180)} ${Y(0) - rb * Math.sin(eind * Math.PI / 180)}" fill="none" stroke="#2e7d4f" stroke-width="1.6"/>`;
    const mid = eind / 2 * Math.PI / 180;
    g += `<text x="${X(0) + (rb + 10) * Math.cos(mid)}" y="${Y(0) - (rb + 10) * Math.sin(mid) + 4}" font-size="13" fill="#2e7d4f" font-style="italic" text-anchor="middle">θ</text>`;
    g += `<text x="${(X(0) + x) / 2 - 8 * Math.sin(t)}" y="${(Y(0) + y) / 2 - 8 * Math.cos(t)}" font-size="13" fill="#e8772e" font-style="italic" text-anchor="middle">r</text>`;
  }
  for (const p of punten) {
    const x = X(p.z.re), y = Y(p.z.im), k = p.kleur || '#1c4e8a';
    g += `<circle cx="${x}" cy="${y}" r="4.5" fill="${k}"/>`;
    if (p.label) g += `<text x="${x + (p.z.re >= 0 ? 7 : -7)}" y="${y - 7}" font-size="13" font-weight="bold" fill="${k}" text-anchor="${p.z.re >= 0 ? 'start' : 'end'}">${p.label}</text>`;
  }
  return `<svg viewBox="0 0 ${w} ${w}" width="${w}" height="${w}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="complexe vlak" style="font-family:Verdana,sans-serif">
    <defs><marker id="pijl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f2733"/></marker>
    <marker id="pijlo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#e8772e"/></marker></defs>${g}</svg>`;
}
const fig = (svg) => `<div class="figuur">${svg}</div>`;

// ---- vaste theorieblokken
const INTYPEN = `<div class="kader"><div class="kader-titel">Zo typ je een complex getal</div>
  <ul><li>Typ de vorm $a + bi$: bv. <code>3 - 2i</code>, <code>-5i</code>, <code>-1/2 + i</code>. De letter <code>i</code> staat ook op de knoppen.</li>
  <li>Een wortel: <code>2√3 + i</code> of <code>√2 i</code>. Een breuk typ je met <code>/</code>.</li>
  <li>Onder het vakje zie je hoe je antwoord gelezen wordt. Kijk dat even na.</li></ul></div>`;
const INTYPEN_GONI = `<div class="kader"><div class="kader-titel">Zo vul je je antwoord in</div>
  <ul><li>Bij $r$ mag je een wortel typen (<code>2√2</code>) of afronden op 2 decimalen (<code>2,83</code>).</li>
  <li>Bij $\\theta$ typ je de hoek in <b>graden</b>, afgerond op 2 decimalen: <code>233,13</code>. Het gradenteken staat er al.</li>
  <li>Een negatieve hoek mag ook: $-45^\\circ$ en $315^\\circ$ zijn hetzelfde argument.</li></ul></div>`;
const FORMULES_CART = `<div class="kader def"><div class="kader-titel">Bewerkingen in cartesische vorm</div>
  <table class="tabel"><tr><td>optellen / aftrekken</td><td>$(a + bi) \\pm (c + di) = (a \\pm c) + (b \\pm d)i$</td></tr>
  <tr><td>vermenigvuldigen</td><td>$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ &nbsp; (want $i^2 = -1$)</td></tr>
  <tr><td>toegevoegde</td><td>$z = a + bi \\;\\Rightarrow\\; \\bar{z} = a - bi$</td></tr>
  <tr><td>delen</td><td>teller en noemer vermenigvuldigen met de toegevoegde van de noemer</td></tr></table></div>`;
const FORMULES_GONI = `<div class="kader def"><div class="kader-titel">Goniometrische vorm</div>
  <p class="midden">$z = a + bi = r(\\cos \\theta + i \\sin \\theta)$</p>
  <p class="midden">$r = |z| = \\sqrt{a^2 + b^2} \\qquad a = r \\cos \\theta \\qquad b = r \\sin \\theta$</p></div>`;
// ===================================================================
//  A · HET COMPLEXE VLAK
// ===================================================================

const D1 = {
  nr: 1, titel: 'De complexe eenheid i', kort: 'i² = −1, de vorm a + bi, reëel en imaginair deel.', rekenmachine: false,
  opdracht: 'Geef het reëel deel en het imaginair deel.',
  theorie: `<div class="kader"><div class="kader-titel">Instap: een vergelijking zonder reële oplossing</div>
      <p>Los op: $x^2 + 1 = 0$. Er bestaat geen reëel getal $x$ waarvoor $x^2 = -1$: een kwadraat is nooit negatief.
      De discriminant is $D = 0^2 - 4 \\cdot 1 \\cdot 1 = -4 < 0$, dus geen reële oplossingen.</p>
      <p>Wiskundigen hebben daarom een <b>nieuw getal</b> ingevoerd, $i$, waarvoor per definitie geldt: $i^2 = -1$.
      Zo ontstaat een nieuwe verzameling getallen: de <b>complexe getallen</b> $\\mathbb{C}$.</p></div>
    <div class="kader def"><div class="kader-titel">De complexe eenheid en een complex getal</div>
      <p>De <b>complexe eenheid</b> $i$ is het getal waarvoor $i^2 = -1$.</p>
      <p>Een <b>complex getal</b> heeft de vorm $z = a + bi$, met $a$ en $b$ reële getallen.</p>
      <ul><li>$a$ is het <b>reëel deel</b>: $\\text{Re}(z) = a$</li>
      <li>$b$ is het <b>imaginair deel</b>: $\\text{Im}(z) = b$ &nbsp; (zonder de $i$!)</li></ul>
      <p>Die schrijfwijze $a + bi$ heet de <b>cartesische vorm</b>.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <table class="tabel"><tr><th>$z$</th><th>$\\text{Re}(z)$</th><th>$\\text{Im}(z)$</th></tr>
      <tr><td>$6 - 5i$</td><td>$6$</td><td>$-5$</td></tr>
      <tr><td>$-7$</td><td>$-7$</td><td>$0$</td></tr>
      <tr><td>$2i$</td><td>$0$</td><td>$2$</td></tr></table>
      <p class="let-op">Let op: het imaginair deel is een reëel getal. Bij $z = 6 - 5i$ is $\\text{Im}(z) = -5$, niet $-5i$.</p></div>`,
  voorbeelden: [
    { tex: 'z = 3 + 4i', stappen: ['\\text{Re}(z) = 3', '\\text{Im}(z) = 4'] },
    { tex: 'z = -2 - i', stappen: ['z = -2 + (-1)i', '\\text{Re}(z) = -2, \\quad \\text{Im}(z) = -1'] },
    { tex: 'z = -9i', stappen: ['z = 0 + (-9)i', '\\text{Re}(z) = 0, \\quad \\text{Im}(z) = -9'] },
    { tex: '\\text{Schrijf als } a + bi \\text{ met } \\text{Re}(z) = 5 \\text{ en } \\text{Im}(z) = -3', stappen: ['z = 5 - 3i'] },
  ],
  soorten: {
    reim: { naam: 'Re en Im van a + bi', gen() {
      const z = willekeurig(12);
      return { soort: 'reim', tex: `z = ${zt(z)}`, antw: { soort: 'delen', delen: [{ label: '\\text{Re}(z) =', antw: getal(z.re) }, { label: '\\text{Im}(z) =', antw: getal(z.im) }] },
        uitleg: [`\\text{Re}(z) = ${tg(z.re)}`, `\\text{Im}(z) = ${tg(z.im)} \\quad \\text{(zonder } i\\text{)}`] };
    } },
    bijzonder: { naam: 'Re en Im van een reëel of zuiver imaginair getal', gen() {
      const z = kies([Z(nz(-12, 12), 0), Z(0, nz(-12, 12)), Z(0, kies([1, -1]))]);
      return { soort: 'bijzonder', tex: `z = ${zt(z)}`, antw: { soort: 'delen', delen: [{ label: '\\text{Re}(z) =', antw: getal(z.re) }, { label: '\\text{Im}(z) =', antw: getal(z.im) }] },
        uitleg: [`z = ${tg(z.re)} + ${h(z.im)}\\,i`, `\\text{Re}(z) = ${tg(z.re)}, \\quad \\text{Im}(z) = ${tg(z.im)}`] };
    } },
    schrijf: { naam: 'Schrijf als a + bi', opdracht: 'Schrijf het complex getal in de vorm a + bi.', gen() {
      const z = kies([willekeurig(12), willekeurig(12), Z(0, nz(-9, 9)), Z(nz(-9, 9), 0)]);
      return { soort: 'schrijf', opdracht: 'Schrijf het complex getal in de vorm a + bi.', tex: `\\text{Re}(z) = ${tg(z.re)} \\text{ en } \\text{Im}(z) = ${tg(z.im)}`,
        antw: cAntw(z, { voor: 'z =' }), uitleg: [`z = ${zt(z)}`] };
    } },
  },
  oefenMix: [['reim', 3], ['bijzonder', 2], ['schrijf', 2]],
  test: [['reim', 5], ['bijzonder', 3], ['schrijf', 2]], testSchudden: true,
};

// punten op een rooster (verschillend, niet op een as)
function puntenSet(n, R = 5) {
  const uit = [];
  while (uit.length < n) { const z = Z(nz(-R, R), nz(-R, R)); if (!uit.some(p => p.re === z.re && p.im === z.im)) uit.push(z); }
  return uit;
}
const D2 = {
  nr: 2, titel: 'Het complexe vlak', kort: 'Een complex getal is een punt: Re op de horizontale as, Im op de verticale.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Het complexe vlak</div>
      <p>Een complex getal $z = a + bi$ stel je voor als een <b>punt</b> $(a, b)$ in het <b>complexe vlak</b>:</p>
      <ul><li>op de <b>horizontale as</b> (de reële as) zet je $\\text{Re}(z) = a$;</li>
      <li>op de <b>verticale as</b> (de imaginaire as) zet je $\\text{Im}(z) = b$.</li></ul>
      ${fig(vlak([{ z: Z(3, 4), label: '3 + 4i' }, { z: Z(-2, 1), label: '−2 + i' }, { z: Z(-3, -2), label: '−3 − 2i' }, { z: Z(4, -3), label: '4 − 3i' }]))}</div>
    <div class="kader eig"><div class="kader-titel">De vier kwadranten</div>
      <table class="tabel"><tr><th>kwadrant</th><th>I</th><th>II</th><th>III</th><th>IV</th></tr>
      <tr><td>$\\text{Re}(z) = a$</td><td>$> 0$</td><td>$< 0$</td><td>$< 0$</td><td>$> 0$</td></tr>
      <tr><td>$\\text{Im}(z) = b$</td><td>$> 0$</td><td>$> 0$</td><td>$< 0$</td><td>$< 0$</td></tr></table>
      <p class="klein">Een reëel getal ligt op de reële as, een getal $bi$ ligt op de imaginaire as.</p></div>`,
  voorbeelden: [
    { html: `Welk complex getal stelt P voor? ${fig(vlak([{ z: Z(2, 1), label: 'P' }]))}`, stappen: ['\\text{P ligt 2 naar rechts en 1 omhoog}', 'P = 2 + i'] },
    { html: `Welk complex getal stelt R voor? ${fig(vlak([{ z: Z(0, -2), label: 'R' }]))}`, stappen: ['\\text{R ligt op de imaginaire as, 2 omlaag}', 'R = -2i'] },
    { tex: '\\text{In welk kwadrant ligt } z = -2 - 2i\\,?', stappen: ['\\text{Re}(z) = -2 < 0 \\text{ en } \\text{Im}(z) = -2 < 0', '\\text{kwadrant III}'] },
  ],
  soorten: {
    leesaf: { naam: 'Lees een punt af', gen() {
      const z = kies([Z(nz(-5, 5), nz(-5, 5)), Z(nz(-5, 5), nz(-5, 5)), Z(0, nz(-5, 5)), Z(nz(-5, 5), 0)]);
      return { soort: 'leesaf', opdracht: 'Welk complex getal stelt het punt P voor? Schrijf als a + bi.', html: fig(vlak([{ z, label: 'P' }])), sleutel: `P${z.re},${z.im}`,
        rapport: `punt P = (${z.re}, ${z.im})`, antw: cAntw(z, { voor: 'P =' }), uitleg: [`\\text{Re} = ${tg(z.re)} \\text{ (horizontaal)}, \\quad \\text{Im} = ${tg(z.im)} \\text{ (verticaal)}`, `P = ${zt(z)}`] };
    } },
    welk: { naam: 'Welk punt hoort bij z?', gen() {
      const ps = puntenSet(4), j = rnd(0, 3), z = ps[j];
      const labels = ['A', 'B', 'C', 'D'];
      return { soort: 'welk', opdracht: `Welk punt stelt het complex getal voor?`, html: `<p class="midden">$z = ${zt(z)}$</p>${fig(vlak(ps.map((p, k) => ({ z: p, label: labels[k] }))))}`,
        sleutel: 'w' + ps.map(p => p.re + ',' + p.im).join('|') + j, rapport: `z = ${zt(z)}`,
        antw: keuze(labels.map(l => ({ k: l, l: `\\text{${l}}` })), labels[j]),
        uitleg: [`z = ${zt(z)}: \\; ${tg(z.re)} \\text{ op de reële as}, \\; ${tg(z.im)} \\text{ op de imaginaire as}`, `\\text{punt ${labels[j]}}`] };
    } },
    kwadrant: { naam: 'In welk kwadrant?', gen() {
      const z = willekeurig(12), kw = kwadrant(z.re, z.im);
      return { soort: 'kwadrant', opdracht: 'In welk kwadrant ligt z?', tex: `z = ${zt(z)}`,
        antw: keuze(['I', 'II', 'III', 'IV'].map(k => ({ k, l: `\\text{${k}}` })), kw),
        uitleg: [`\\text{Re}(z) = ${tg(z.re)} ${z.re > 0 ? '> 0' : '< 0'} \\text{ en } \\text{Im}(z) = ${tg(z.im)} ${z.im > 0 ? '> 0' : '< 0'}`, `\\text{kwadrant ${kw}}`] };
    } },
  },
  oefenMix: [['leesaf', 3], ['welk', 2], ['kwadrant', 2]],
  test: [['leesaf', 4], ['welk', 3], ['kwadrant', 3]], testSchudden: true,
};

const TRIPELS = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [15, 8], [9, 12], [12, 9]];
function modUitleg(a, b) {
  const m = modulus(a, b);
  const L = [`|z| = \\sqrt{a^2 + b^2} = \\sqrt{${h(a)}^2 + ${h(b)}^2} = \\sqrt{${m.k}}`];
  if (m.tex !== `\\sqrt{${m.k}}`) L.push(`= ${m.tex}`);
  if (m.exact.s !== 1) L.push(`\\approx ${t2(m.v)}`);
  return L;
}
const D3 = {
  nr: 3, titel: 'De modulus', kort: 'De afstand van z tot de oorsprong: |z| = √(a² + b²).', rekenmachine: true,
  opdracht: 'Bereken de modulus |z|.',
  theorie: `<div class="kader def"><div class="kader-titel">Modulus</div>
      <p>De <b>modulus</b> van $z = a + bi$ is de afstand van $z$ tot de oorsprong in het complexe vlak:</p>
      <p class="midden">$|z| = \\sqrt{a^2 + b^2}$</p>
      <p>Dat is de stelling van Pythagoras: $a$ en $b$ zijn de rechthoekszijden, $|z|$ is de schuine zijde.</p>
      ${fig(vlak([{ z: Z(3, 4), label: 'z = 3 + 4i' }], { vector: Z(3, 4), stippel: true }))}
      <p class="klein">De hoek $\\theta$ die de vector maakt met de positieve reële as heet het <b>argument</b> van $z$. Dat zie je in deel 7.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$|6 + 8i| = \\sqrt{36 + 64} = \\sqrt{100} = 10$</p>
      <p class="midden">$|-2 - 2i| = \\sqrt{4 + 4} = \\sqrt{8} = 2\\sqrt{2}$</p>
      <p class="let-op">Let op: kwadrateer ook een negatief deel: $(-2)^2 = 4$. De modulus is nooit negatief.</p></div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div><p>Typ een geheel getal, een wortel (<code>2√2</code> of <code>√8</code>) of rond af op 2 decimalen (<code>2,83</code>).</p></div>`,
  voorbeelden: [
    { tex: '|{-5} + 12i|', stappen: ['= \\sqrt{(-5)^2 + 12^2}', '= \\sqrt{25 + 144} = \\sqrt{169} = 13'] },
    { tex: '|1 - i|', stappen: ['= \\sqrt{1^2 + (-1)^2}', '= \\sqrt{2} \\approx 1{,}41'] },
    { tex: '|{-4}i|', stappen: ['= \\sqrt{0^2 + (-4)^2}', '= \\sqrt{16} = 4'] },
  ],
  soorten: {
    mooi: { naam: 'Modulus (geheel getal)', gen() {
      const [p, q] = kies(TRIPELS), a = p * kies([1, -1]), b = q * kies([1, -1]), m = modulus(a, b);
      return { soort: 'mooi', tex: `z = ${zt(Z(a, b))}`, antw: rAntw(m.v, m.tex, { voor: '|z| =' }), uitleg: modUitleg(a, b) };
    } },
    wortel: { naam: 'Modulus (wortel)', gen() {
      let a, b; do { a = nz(-7, 7); b = nz(-7, 7); } while (Number.isInteger(Math.sqrt(a * a + b * b)));
      const m = modulus(a, b);
      return { soort: 'wortel', tex: `z = ${zt(Z(a, b))}`, antw: rAntw(m.v, m.tex, { voor: '|z| =' }), uitleg: modUitleg(a, b) };
    } },
    as: { naam: 'Modulus van a of bi', gen() {
      const z = kies([Z(nz(-15, 15), 0), Z(0, nz(-15, 15))]), m = modulus(z.re, z.im);
      return { soort: 'as', tex: `z = ${zt(z)}`, antw: rAntw(m.v, m.tex, { voor: '|z| =' }), uitleg: modUitleg(z.re, z.im) };
    } },
  },
  oefenMix: [['mooi', 3], ['wortel', 3], ['as', 1]],
  test: [['mooi', 4], ['wortel', 4], ['as', 2]], testSchudden: true,
};

// ===================================================================
//  B · BEWERKINGEN IN CARTESISCHE VORM
// ===================================================================

const D4 = {
  nr: 4, titel: 'Optellen en aftrekken', kort: 'Reële delen bij elkaar, imaginaire delen bij elkaar.', rekenmachine: false,
  opdracht: 'Bereken. Schrijf het resultaat in de vorm a + bi.',
  theorie: `<div class="kader def"><div class="kader-titel">Optellen en aftrekken</div>
      <p class="midden">$(a + bi) + (c + di) = (a + c) + (b + d)i$</p>
      <p class="midden">$(a + bi) - (c + di) = (a - c) + (b - d)i$</p>
      <p>Je telt de <b>reële delen</b> bij elkaar en de <b>imaginaire delen</b> bij elkaar, net zoals gelijksoortige termen bij veeltermen.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(3 + 2i) + (1 - 4i) = (3 + 1) + (2 - 4)i = 4 - 2i$</p>
      <p class="midden">$(5 - i) - (2 + 3i) = 5 - i - 2 - 3i = 3 - 4i$</p>
      <p class="let-op">Let op bij aftrekken: het minteken geldt voor <b>beide</b> delen tussen de haakjes.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(4 - 3i) + (-2 + 7i)', stappen: ['= (4 - 2) + (-3 + 7)i', '= 2 + 4i'] },
    { tex: '(6 + i) - (3 - 4i)', stappen: ['= 6 + i - 3 + 4i', '= 3 + 5i'] },
    { tex: '(-1 + 2i) - (4 + 2i)', stappen: ['= -1 + 2i - 4 - 2i', '= -5'] },
  ],
  soorten: {
    som: { naam: 'Som', gen() {
      const a = willekeurig(), b = willekeurig(), r = plus(a, b);
      return { soort: 'som', tex: `${zh(a)} + ${zh(b)}`, antw: cAntw(r), uitleg: [`= (${tg(a.re)} + ${h(b.re)}) + (${tg(a.im)} + ${h(b.im)})i`, `= ${zt(r)}`] };
    } },
    verschil: { naam: 'Verschil', gen() {
      const a = willekeurig(), b = willekeurig(), r = min(a, b);
      return { soort: 'verschil', tex: `${zh(a)} - ${zh(b)}`, antw: cAntw(r), uitleg: [`= (${tg(a.re)} - ${h(b.re)}) + (${tg(a.im)} - ${h(b.im)})i`, `= ${zt(r)}`] };
    } },
    drie: { naam: 'Drie termen', gen() {
      const a = willekeurig(6), b = willekeurig(6), c = willekeurig(6), o1 = kies(['+', '-']), o2 = kies(['+', '-']);
      const r = (o2 === '+' ? plus : min)((o1 === '+' ? plus : min)(a, b), c);
      return { soort: 'drie', tex: `${zh(a)} ${o1} ${zh(b)} ${o2} ${zh(c)}`, antw: cAntw(r),
        uitleg: [`\\text{reëel: } ${tg(a.re)} ${o1} ${h(b.re)} ${o2} ${h(c.re)} = ${tg(r.re)}`, `\\text{imaginair: } ${tg(a.im)} ${o1} ${h(b.im)} ${o2} ${h(c.im)} = ${tg(r.im)}`, `= ${zt(r)}`] };
    } },
  },
  oefenMix: [['som', 2], ['verschil', 3], ['drie', 1]],
  test: [['som', 4], ['verschil', 4], ['drie', 2]], testSchudden: true,
};

function prodUitleg(a, b) {
  const r = mul(a, b);
  return [`= ${tg(a.re)} \\cdot ${h(b.re)} + ${tg(a.re)} \\cdot ${h(b.im)}i + ${tg(a.im)}i \\cdot ${h(b.re)} + ${tg(a.im)}i \\cdot ${h(b.im)}i`,
    `= ${tg(a.re * b.re)} ${a.re * b.im + a.im * b.re >= 0 ? '+' : '-'} ${tg(Math.abs(a.re * b.im + a.im * b.re))}i ${a.im * b.im >= 0 ? '+' : '-'} ${tg(Math.abs(a.im * b.im))}i^2`,
    `= ${tg(a.re * b.re)} ${a.re * b.im + a.im * b.re >= 0 ? '+' : '-'} ${tg(Math.abs(a.re * b.im + a.im * b.re))}i ${a.im * b.im >= 0 ? '-' : '+'} ${tg(Math.abs(a.im * b.im))} \\quad (i^2 = -1)`,
    `= ${zt(r)}`];
}
const D5 = {
  nr: 5, titel: 'Vermenigvuldigen', kort: 'Haakjes uitwerken zoals bij veeltermen, en i² = −1.', rekenmachine: false,
  opdracht: 'Bereken. Schrijf het resultaat in de vorm a + bi.',
  theorie: `<div class="kader def"><div class="kader-titel">Vermenigvuldigen</div>
      <p>Werk de haakjes uit zoals bij veeltermen (elke term met elke term) en vervang $i^2$ door $-1$:</p>
      <p class="midden">$(a + bi)(c + di) = ac + adi + bci + bdi^2 = (ac - bd) + (ad + bc)i$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$(2 + 3i)(1 - 2i) = 2 - 4i + 3i - 6i^2 = 2 - i + 6 = 8 - i$</p></div>
    <div class="kader def"><div class="kader-titel">De toegevoegde</div>
      <p>De <b>toegevoegde</b> (of geconjugeerde) van $z = a + bi$ is $\\bar{z} = a - bi$: je verandert het teken van het imaginair deel.</p>
      <p>Het product van een complex getal en zijn toegevoegde is altijd <b>reëel</b>:</p>
      <p class="midden">$z \\cdot \\bar{z} = (a + bi)(a - bi) = a^2 - b^2i^2 = a^2 + b^2$</p>
      <p class="klein">Voorbeeld: $z = 2 + 5i$, $\\bar{z} = 2 - 5i$ en $z \\cdot \\bar{z} = 4 + 25 = 29$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(3 - 2i)(4 + 5i)', stappen: ['= 12 + 15i - 8i - 10i^2', '= 12 + 7i + 10', '= 22 + 7i'] },
    { tex: '-3i(2 - i)', stappen: ['= -6i + 3i^2', '= -6i - 3', '= -3 - 6i'] },
    { tex: 'z = 2 + 5i\\text{: geef } \\bar{z} \\text{ en bereken } z \\cdot \\bar{z}', stappen: ['\\bar{z} = 2 - 5i', 'z \\cdot \\bar{z} = 2^2 + 5^2 = 29'] },
  ],
  soorten: {
    product: { naam: '(a + bi)(c + di)', gen() {
      const a = willekeurig(7), b = willekeurig(7), r = mul(a, b);
      return { soort: 'product', tex: `${zh(a)}${zh(b)}`, antw: cAntw(r), uitleg: prodUitleg(a, b) };
    } },
    getal: { naam: 'Getal of bi maal complex getal', gen() {
      const k = kies([Z(nz(-6, 6), 0), Z(0, nz(-6, 6))]), b = willekeurig(8), r = mul(k, b);
      const kt = zt(k);
      return { soort: 'getal', tex: `${kt}${zh(b)}`, antw: cAntw(r),
        uitleg: k.im === 0 ? [`= ${tg(k.re * b.re)} ${k.re * b.im >= 0 ? '+' : '-'} ${tg(Math.abs(k.re * b.im))}i`] :
          [`= ${tg(k.im * b.re)}i ${k.im * b.im >= 0 ? '+' : '-'} ${tg(Math.abs(k.im * b.im))}i^2`, `= ${tg(k.im * b.re)}i ${k.im * b.im >= 0 ? '-' : '+'} ${tg(Math.abs(k.im * b.im))}`, `= ${zt(r)}`] };
    } },
    toegevoegde: { naam: 'Toegevoegde', gen() {
      const z = willekeurig(12);
      return { soort: 'toegevoegde', opdracht: 'Geef de toegevoegde van z.', tex: `z = ${zt(z)}`, antw: cAntw(toeg(z), { voor: '\\bar{z} =' }), uitleg: [`\\bar{z} = ${zt(toeg(z))} \\quad \\text{(teken van het imaginair deel omkeren)}`] };
    } },
    zzbar: { naam: 'z · z̄', gen() {
      const z = willekeurig(9);
      return { soort: 'zzbar', opdracht: 'Bereken het product van z en zijn toegevoegde.', tex: `z = ${zt(z)} \\qquad z \\cdot \\bar{z} = \\;?`, antw: cAntw(Z(z.re * z.re + z.im * z.im, 0), { voor: 'z \\cdot \\bar{z} =' }),
        uitleg: [`\\bar{z} = ${zt(toeg(z))}`, `z \\cdot \\bar{z} = ${h(z.re)}^2 + ${h(z.im)}^2 = ${z.re * z.re} + ${z.im * z.im} = ${z.re * z.re + z.im * z.im}`] };
    } },
    kwadraat: { naam: '(a + bi)²', gen() {
      const a = willekeurig(6), r = mul(a, a);
      return { soort: 'kwadraat', tex: `${zh(a)}^2`, antw: cAntw(r), uitleg: [`= ${zh(a)}${zh(a)}`, ...prodUitleg(a, a)] };
    } },
  },
  oefenMix: [['product', 4], ['getal', 1], ['toegevoegde', 1], ['zzbar', 1], ['kwadraat', 1]],
  test: [['product', 4], ['getal', 1], ['toegevoegde', 1], ['zzbar', 2], ['kwadraat', 2]], testSchudden: true,
};

// deling met een mooie uitkomst: kies het quotiënt q en de deler d, teller = q·d
function delingUitleg(t, d) {
  const n = d.re * d.re + d.im * d.im, tel = mul(t, toeg(d)), q = Z(tel.re / n, tel.im / n);
  const qT = Number.isInteger(q.re) && Number.isInteger(q.im) ? zt(q) : breukZ(tel, n);
  return { q, qT, L: [`= \\dfrac{${zh(t)}${zh(toeg(d))}}{${zh(d)}${zh(toeg(d))}} \\quad \\text{(maal de toegevoegde van de noemer)}`,
    `= \\dfrac{${zt(tel)}}{${h(d.re)}^2 + ${h(d.im)}^2} = \\dfrac{${zt(tel)}}{${n}}`, `= ${qT}`] };
}
function breukZ(tel, n) { // (p + qi)/n vereenvoudigd als a + bi met breuken
  const f = (x) => { const g = ggd(x, n) || 1; const t = x / g, m = n / g; return m === 1 ? { tex: tg(Math.abs(t)), neg: t < 0 } : { tex: `\\frac{${Math.abs(t)}}{${m}}`, neg: t < 0 }; };
  const a = f(tel.re), b = f(tel.im);
  if (tel.im === 0) return (a.neg ? '-' : '') + a.tex;
  const bT = b.tex === '1' ? 'i' : `${b.tex}\\,i`;
  if (tel.re === 0) return (b.neg ? '-' : '') + bT;
  return `${a.neg ? '-' : ''}${a.tex} ${b.neg ? '-' : '+'} ${bT}`;
}
const D6 = {
  nr: 6, titel: 'Delen', kort: 'Teller en noemer maal de toegevoegde van de noemer.', rekenmachine: false,
  opdracht: 'Bereken. Schrijf het resultaat in de vorm a + bi.',
  theorie: `<div class="kader def"><div class="kader-titel">Delen</div>
      <p>Vermenigvuldig teller en noemer met de <b>toegevoegde van de noemer</b>. Zo wordt de noemer reëel ($z \\cdot \\bar{z} = c^2 + d^2$):</p>
      <p class="midden">$\\dfrac{a + bi}{c + di} = \\dfrac{(a + bi)(c - di)}{(c + di)(c - di)} = \\dfrac{(a + bi)(c - di)}{c^2 + d^2}$</p>
      <p>Deel daarna het reëel deel en het imaginair deel apart door de noemer.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$\\dfrac{7 + i}{1 + i} = \\dfrac{(7 + i)(1 - i)}{(1 + i)(1 - i)} = \\dfrac{7 - 7i + i - i^2}{1 - i^2} = \\dfrac{8 - 6i}{2} = 4 - 3i$</p>
      <p class="klein">Blijft er een breuk over, schrijf dan bv. $\\dfrac{1 + 3i}{2} = \\dfrac{1}{2} + \\dfrac{3}{2}i$. Typ: <code>1/2 + 3/2 i</code>.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(4 + 2i) : (1 - i)', stappen: ['= \\dfrac{(4 + 2i)(1 + i)}{(1 - i)(1 + i)}', '= \\dfrac{4 + 4i + 2i + 2i^2}{1 + 1} = \\dfrac{2 + 6i}{2}', '= 1 + 3i'] },
    { tex: '\\dfrac{10}{3 + i}', stappen: ['= \\dfrac{10(3 - i)}{(3 + i)(3 - i)} = \\dfrac{30 - 10i}{9 + 1}', '= 3 - i'] },
    { tex: '\\dfrac{2 + i}{1 - i}', stappen: ['= \\dfrac{(2 + i)(1 + i)}{1 + 1} = \\dfrac{2 + 2i + i + i^2}{2}', '= \\dfrac{1 + 3i}{2} = \\dfrac{1}{2} + \\dfrac{3}{2}i'] },
  ],
  soorten: {
    mooi: { naam: 'Deling met gehele uitkomst', gen() {
      const q = willekeurig(6), d = willekeurig(4), t = mul(q, d), u = delingUitleg(t, d);
      return { soort: 'mooi', tex: kies([`${zh(t)} : ${zh(d)}`, `\\dfrac{${zt(t)}}{${zt(d)}}`]), antw: cAntw(q), uitleg: u.L };
    } },
    reeel: { naam: 'Reëel getal gedeeld door a + bi', gen() {
      const d = willekeurig(4), n = d.re * d.re + d.im * d.im, k = n * nz(-3, 3), u = delingUitleg(Z(k, 0), d);
      return { soort: 'reeel', tex: `\\dfrac{${tg(k)}}{${zt(d)}}`, antw: cAntw(u.q), uitleg: u.L };
    } },
    breuk: { naam: 'Deling met breuken in de uitkomst', gen() {
      let t, d, u; do { t = willekeurig(5); d = willekeurig(3); u = delingUitleg(t, d); } while (Number.isInteger(u.q.re) && Number.isInteger(u.q.im));
      return { soort: 'breuk', tex: `\\dfrac{${zt(t)}}{${zt(d)}}`, antw: cAntw(u.q, { tex: u.qT }), uitleg: u.L };
    } },
  },
  oefenMix: [['mooi', 4], ['reeel', 1], ['breuk', 2]],
  test: [['mooi', 6], ['reeel', 2], ['breuk', 2]], testSchudden: true,
};

// ===================================================================
//  C · GONIOMETRISCHE VORM
// ===================================================================

const D7 = {
  nr: 7, titel: 'Van cartesische naar goniometrische vorm', kort: 'Modulus r en argument θ berekenen. Let op het kwadrant!', rekenmachine: true,
  opdracht: 'Zet om naar goniometrische vorm: geef r en θ (in graden, afgerond op 0,01°).',
  theorie: `${FORMULES_GONI}
    <div class="kader eig"><div class="kader-titel">Het argument θ</div>
      <p>Het <b>argument</b> $\\theta$ is de hoek (in graden) tussen de positieve reële as en de vector van $z$.</p>
      ${fig(vlak([{ z: Z(3, 4), label: 'z = 3 + 4i' }], { vector: Z(3, 4), stippel: true }))}
      <p>Werkwijze:</p><ol><li>Bepaal eerst het <b>kwadrant</b> van $z$ (teken van $a$ en $b$).</li>
      <li>Bereken $\\text{boogtan}\\,\\dfrac{b}{a}$ met je rekenmachine (in graden: DEG).</li>
      <li>Ligt $z$ in kwadrant <b>II of III</b> ($a < 0$), tel er dan $180^\\circ$ bij.</li></ol>
      <p class="let-op">De rekenmachine geeft niet automatisch de juiste hoek als $a < 0$. Daarom: altijd eerst het kwadrant!</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p>$z = 3 + 4i$: $\\; r = \\sqrt{9 + 16} = 5$, kwadrant I, $\\theta = \\text{boogtan}\\,\\dfrac{4}{3} \\approx 53{,}13^\\circ$ &nbsp;⇒&nbsp; $z = 5(\\cos 53{,}13^\\circ + i \\sin 53{,}13^\\circ)$</p>
      <p>$z = -2 + 2i$: $\\; r = \\sqrt{4 + 4} = 2\\sqrt{2}$, kwadrant II, $\\text{boogtan}\\,\\dfrac{2}{-2} = -45^\\circ$ ⇒ $\\theta = -45^\\circ + 180^\\circ = 135^\\circ$</p>
      <p>$z = 1 - i$: $\\; r = \\sqrt{2}$, kwadrant IV, $\\theta = \\text{boogtan}\\,\\dfrac{-1}{1} = -45^\\circ$ &nbsp;(of $315^\\circ$)</p></div>${INTYPEN_GONI}`,
  voorbeelden: [
    { tex: 'z = 1 + \\sqrt{3}\\,i', stappen: ['r = \\sqrt{1 + 3} = 2', '\\text{kwadrant I: } \\theta = \\text{boogtan}\\,\\sqrt{3} = 60^\\circ', 'z = 2(\\cos 60^\\circ + i \\sin 60^\\circ)'] },
    { tex: 'z = -3 - 4i', stappen: ['r = \\sqrt{9 + 16} = 5', '\\text{kwadrant III: } \\text{boogtan}\\,\\dfrac{-4}{-3} \\approx 53{,}13^\\circ', '\\theta \\approx 53{,}13^\\circ + 180^\\circ = 233{,}13^\\circ', 'z = 5(\\cos 233{,}13^\\circ + i \\sin 233{,}13^\\circ)'] },
    { tex: 'z = 2 - 5i', stappen: ['r = \\sqrt{4 + 25} = \\sqrt{29} \\approx 5{,}39', '\\text{kwadrant IV: } \\theta = \\text{boogtan}\\,\\dfrac{-5}{2} \\approx -68{,}20^\\circ \\;(\\text{of } 291{,}80^\\circ)'] },
  ],
  soorten: {
    kw1: { naam: 'Kwadrant I of IV', gen() {
      const a = rnd(1, 8), b = nz(-8, 8), m = modulus(a, b), t = argument(a, b);
      return { soort: 'kw1', tex: `z = ${zt(Z(a, b))}`, antw: goniAntw(m.v, m.tex, t), uitleg: [...modUitleg(a, b).map((x, i) => i ? x : x.replace('|z|', 'r')), ...argUitleg(a, b)] };
    } },
    kw23: { naam: 'Kwadrant II of III', gen() {
      const a = -rnd(1, 8), b = nz(-8, 8), m = modulus(a, b), t = argument(a, b);
      return { soort: 'kw23', tex: `z = ${zt(Z(a, b))}`, antw: goniAntw(m.v, m.tex, t), uitleg: [...modUitleg(a, b).map((x, i) => i ? x : x.replace('|z|', 'r')), ...argUitleg(a, b)] };
    } },
    bijzonder: { naam: 'Bijzondere hoeken', gen() {
      const [a, b, rT, r] = kies([[1, 1, '\\sqrt{2}', Math.SQRT2], [-1, 1, '\\sqrt{2}', Math.SQRT2], [-1, -1, '\\sqrt{2}', Math.SQRT2], [1, -1, '\\sqrt{2}', Math.SQRT2],
        [2, 2, '2\\sqrt{2}', 2 * Math.SQRT2], [-2, 2, '2\\sqrt{2}', 2 * Math.SQRT2], [-3, -3, '3\\sqrt{2}', 3 * Math.SQRT2], [4, -4, '4\\sqrt{2}', 4 * Math.SQRT2]]);
      const t = argument(a, b);
      return { soort: 'bijzonder', tex: `z = ${zt(Z(a, b))}`, antw: goniAntw(r, rT, Math.round(t)),
        uitleg: [`r = \\sqrt{${h(a)}^2 + ${h(b)}^2} = ${rT}`, ...argUitleg(a, b), `z = ${goniTex(rT, Math.round(t))}`] };
    } },
    wortel3: { naam: 'Met √3', gen() {
      const [a, b] = kies([[1, 1], [-1, 1], [-1, -1], [1, -1]]), k = kies([1, 2, 3]), metW3re = kies([true, false]);
      // a√3 + bi of a + b√3 i, vermenigvuldigd met k: r = 2k
      const re = metW3re ? Ex(a * k, 1, 3) : Ex(a * k), im = metW3re ? Ex(b * k) : Ex(b * k, 1, 3);
      const t = argument(re.v, im.v), tR = Math.round(t);
      return { soort: 'wortel3', tex: `z = ${exZTex(re, im)}`, antw: goniAntw(2 * k, tg(2 * k), tR),
        uitleg: [`r = \\sqrt{(${exTex(re)})^2 + (${exTex(im)})^2} = \\sqrt{${Math.round(re.v * re.v + im.v * im.v)}} = ${2 * k}`,
          `\\text{kwadrant ${kwadrant(re.v, im.v)}: } \\text{boogtan}\\,\\dfrac{${exTex(im)}}{${exTex(re)}} = ${gr(Math.round(Math.atan(im.v / re.v) * 180 / Math.PI))}${re.v < 0 ? ` \\Rightarrow \\theta = ${gr(Math.round(Math.atan(im.v / re.v) * 180 / Math.PI))} + 180^\\circ = ${gr(tR)}` : ''}`,
          `z = ${goniTex(2 * k, tR)}`] };
    } },
  },
  oefenMix: [['kw1', 2], ['kw23', 3], ['bijzonder', 1], ['wortel3', 1]],
  test: [['kw1', 3], ['kw23', 4], ['bijzonder', 2], ['wortel3', 1]], testSchudden: true,
};

const RS = [2, 3, 4, 5, 6, 8, 10];
function naarCart(r, t) {
  const a = exMaal(Ex(r), exCos(t)), b = exMaal(Ex(r), exSin(t));
  return { a, b, tex: exZTex(a, b), z: Z(a.v, b.v) };
}
const D8 = {
  nr: 8, titel: 'Van goniometrische naar cartesische vorm', kort: 'a = r cos θ en b = r sin θ.', rekenmachine: true,
  opdracht: 'Zet om naar de cartesische vorm a + bi.',
  theorie: `${FORMULES_GONI}
    <div class="kader eig"><div class="kader-titel">Werkwijze</div>
      <p>Is $z = r(\\cos \\theta + i \\sin \\theta)$ gegeven, dan bereken je</p>
      <p class="midden">$a = r \\cos \\theta \\qquad b = r \\sin \\theta \\qquad\\Rightarrow\\qquad z = a + bi$</p>
      <p>Bij de <b>bijzondere hoeken</b> geef je de <b>exacte</b> waarde (met een wortel of een breuk):</p>
      <table class="tabel"><tr><th>$\\theta$</th><th>$0^\\circ$</th><th>$30^\\circ$</th><th>$45^\\circ$</th><th>$60^\\circ$</th><th>$90^\\circ$</th></tr>
      <tr><td>$\\cos \\theta$</td><td>$1$</td><td>$\\frac{\\sqrt{3}}{2}$</td><td>$\\frac{\\sqrt{2}}{2}$</td><td>$\\frac{1}{2}$</td><td>$0$</td></tr>
      <tr><td>$\\sin \\theta$</td><td>$0$</td><td>$\\frac{1}{2}$</td><td>$\\frac{\\sqrt{2}}{2}$</td><td>$\\frac{\\sqrt{3}}{2}$</td><td>$1$</td></tr></table>
      <p class="klein">Bij een andere hoek rond je $a$ en $b$ af op 2 decimalen.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$4(\\cos 60^\\circ + i \\sin 60^\\circ) = 4 \\cdot \\frac{1}{2} + 4 \\cdot \\frac{\\sqrt{3}}{2}\\,i = 2 + 2\\sqrt{3}\\,i$</p>
      <p class="midden">$3(\\cos 180^\\circ + i \\sin 180^\\circ) = 3 \\cdot (-1) + 3 \\cdot 0\\,i = -3$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '6(\\cos 30^\\circ + i \\sin 30^\\circ)', stappen: ['a = 6 \\cos 30^\\circ = 6 \\cdot \\frac{\\sqrt{3}}{2} = 3\\sqrt{3}', 'b = 6 \\sin 30^\\circ = 6 \\cdot \\frac{1}{2} = 3', 'z = 3\\sqrt{3} + 3i'] },
    { tex: '4(\\cos 135^\\circ + i \\sin 135^\\circ)', stappen: ['a = 4 \\cdot \\left(-\\frac{\\sqrt{2}}{2}\\right) = -2\\sqrt{2}', 'b = 4 \\cdot \\frac{\\sqrt{2}}{2} = 2\\sqrt{2}', 'z = -2\\sqrt{2} + 2\\sqrt{2}\\,i'] },
    { tex: '5(\\cos 40^\\circ + i \\sin 40^\\circ)', stappen: ['a = 5 \\cos 40^\\circ \\approx 3{,}83', 'b = 5 \\sin 40^\\circ \\approx 3{,}21', 'z \\approx 3{,}83 + 3{,}21i'] },
  ],
  soorten: {
    as: { naam: 'Hoek 0°, 90°, 180°, 270°', gen() {
      const r = kies(RS), t = kies([0, 90, 180, 270]), c = naarCart(r, t);
      return { soort: 'as', tex: goniTex(r, t), antw: cAntw(c.z, { tex: c.tex, exact: true }),
        uitleg: [`a = ${r} \\cos ${gr(t)} = ${exTex(c.a)}`, `b = ${r} \\sin ${gr(t)} = ${exTex(c.b)}`, `z = ${c.tex}`] };
    } },
    bijzonder: { naam: 'Bijzondere hoeken', gen() {
      const t = kies([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]), r = kies(RS), c = naarCart(r, t);
      return { soort: 'bijzonder', tex: goniTex(r, t), antw: cAntw(c.z, { tex: c.tex, exact: true }),
        uitleg: [`a = ${r} \\cos ${gr(t)} = ${r} \\cdot ${exCos(t).t < 0 ? `\\left(${exTex(exCos(t))}\\right)` : exTex(exCos(t))} = ${exTex(c.a)}`,
          `b = ${r} \\sin ${gr(t)} = ${r} \\cdot ${exSin(t).t < 0 ? `\\left(${exTex(exSin(t))}\\right)` : exTex(exSin(t))} = ${exTex(c.b)}`, `z = ${c.tex}`] };
    } },
    afronden: { naam: 'Andere hoek (afronden)', gen() {
      let t; do { t = rnd(5, 355); } while (t % 15 === 0);
      const r = kies(RS), a = r * Math.cos(t * Math.PI / 180), b = r * Math.sin(t * Math.PI / 180);
      const z = Z(rond2(a), rond2(b));
      return { soort: 'afronden', opdracht: 'Zet om naar de cartesische vorm a + bi. Rond a en b af op 2 decimalen.', tex: goniTex(r, t), antw: cAntw(Z(a, b), { tex: CX.texAbi(z.re, z.im, W.texGetal(a, 2, true), W.texGetal(Math.abs(b), 2, true)) }),
        uitleg: [`a = ${r} \\cos ${gr(t)} \\approx ${W.texGetal(a, 2, true)}`, `b = ${r} \\sin ${gr(t)} \\approx ${W.texGetal(b, 2, true)}`, `z \\approx ${CX.texAbi(z.re, z.im, W.texGetal(a, 2, true), W.texGetal(Math.abs(b), 2, true))}`] };
    } },
  },
  oefenMix: [['as', 1], ['bijzonder', 4], ['afronden', 2]],
  test: [['as', 2], ['bijzonder', 6], ['afronden', 2]], testSchudden: true,
};

// ===================================================================
//  D · BEWERKINGEN IN GONIOMETRISCHE VORM
// ===================================================================

const norm360 = (t) => ((t % 360) + 360) % 360;
const D9 = {
  nr: 9, titel: 'Vermenigvuldigen en delen in goniometrische vorm', kort: 'Moduli vermenigvuldigen (delen), argumenten optellen (aftrekken).', rekenmachine: false,
  opdracht: 'Bereken. Geef het resultaat in goniometrische vorm: r en θ.',
  theorie: `<div class="kader def"><div class="kader-titel">Vermenigvuldigen en delen</div>
      <p class="midden">$r_1(\\cos \\theta_1 + i \\sin \\theta_1) \\cdot r_2(\\cos \\theta_2 + i \\sin \\theta_2) = r_1 r_2\\left(\\cos(\\theta_1 + \\theta_2) + i \\sin(\\theta_1 + \\theta_2)\\right)$</p>
      <p class="midden">$r_1(\\cos \\theta_1 + i \\sin \\theta_1) : r_2(\\cos \\theta_2 + i \\sin \\theta_2) = \\dfrac{r_1}{r_2}\\left(\\cos(\\theta_1 - \\theta_2) + i \\sin(\\theta_1 - \\theta_2)\\right)$</p></div>
    <div class="kader eig"><div class="kader-titel">Waarom dit werkt</div>
      <p>Werk de haakjes uit en gebruik de <b>somformules</b> van de goniometrie:</p>
      <p class="midden">$\\cos(\\theta_1 + \\theta_2) = \\cos \\theta_1 \\cos \\theta_2 - \\sin \\theta_1 \\sin \\theta_2 \\qquad \\sin(\\theta_1 + \\theta_2) = \\sin \\theta_1 \\cos \\theta_2 + \\cos \\theta_1 \\sin \\theta_2$</p>
      <p><b>Meetkundige betekenis:</b> vermenigvuldigen met een complex getal betekent de moduli <b>vermenigvuldigen</b> (schaling) en de argumenten <b>optellen</b> (rotatie).</p>
      <p class="klein">Vermenigvuldigen met $i = 1(\\cos 90^\\circ + i \\sin 90^\\circ)$ is dus een rotatie over $90^\\circ$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p>$z_1 = 2(\\cos 20^\\circ + i \\sin 20^\\circ)$ en $z_2 = 3(\\cos 70^\\circ + i \\sin 70^\\circ)$:</p>
      <p class="midden">$z_1 \\cdot z_2 = 6(\\cos 90^\\circ + i \\sin 90^\\circ) \\qquad z_1 : z_2 = \\frac{2}{3}\\left(\\cos(-50^\\circ) + i \\sin(-50^\\circ)\\right)$</p></div>${INTYPEN_GONI}`,
  voorbeelden: [
    { tex: '3(\\cos 40^\\circ + i \\sin 40^\\circ) \\cdot 2(\\cos 50^\\circ + i \\sin 50^\\circ)', stappen: ['= 3 \\cdot 2\\left(\\cos(40^\\circ + 50^\\circ) + i \\sin(40^\\circ + 50^\\circ)\\right)', '= 6(\\cos 90^\\circ + i \\sin 90^\\circ) = 6i'] },
    { tex: '8(\\cos 100^\\circ + i \\sin 100^\\circ) : 2(\\cos 40^\\circ + i \\sin 40^\\circ)', stappen: ['= \\dfrac{8}{2}\\left(\\cos(100^\\circ - 40^\\circ) + i \\sin(100^\\circ - 40^\\circ)\\right)', '= 4(\\cos 60^\\circ + i \\sin 60^\\circ) = 2 + 2\\sqrt{3}\\,i'] },
  ],
  soorten: {
    maal: { naam: 'Product', gen() {
      const r1 = rnd(2, 6), r2 = rnd(2, 6), t1 = 5 * rnd(1, 30), t2 = 5 * rnd(1, 30);
      return { soort: 'maal', tex: `${goniTex(r1, t1)} \\cdot ${goniTex(r2, t2)}`, antw: goniAntw(r1 * r2, tg(r1 * r2), t1 + t2),
        uitleg: [`r = ${r1} \\cdot ${r2} = ${r1 * r2}`, `\\theta = ${gr(t1)} + ${gr(t2)} = ${gr(t1 + t2)}`, `= ${goniTex(r1 * r2, t1 + t2)}`] };
    } },
    deel: { naam: 'Quotiënt', gen() {
      const r2 = rnd(2, 5), r1 = r2 * rnd(1, 5), t1 = 5 * rnd(1, 50), t2 = 5 * rnd(1, 30);
      return { soort: 'deel', tex: `${goniTex(r1, t1)} : ${goniTex(r2, t2)}`, antw: goniAntw(r1 / r2, tg(r1 / r2), t1 - t2),
        uitleg: [`r = ${r1} : ${r2} = ${tg(r1 / r2)}`, `\\theta = ${gr(t1)} - ${gr(t2)} = ${gr(t1 - t2)}`, `= ${goniTex(tg(r1 / r2), t1 - t2)}`] };
    } },
    cartesisch: { naam: 'Product of quotiënt, ook in cartesische vorm', gen() {
      const doel = kies([30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 315, 330]);
      const maal = kies([true, false]), t2 = 5 * rnd(1, 12), t1 = maal ? doel - t2 : doel + t2;
      const r2 = kies([1, 2]), r = kies([2, 4, 6]), r1 = maal ? r / r2 : r * r2;
      const c = naarCart(r, doel);
      return { soort: 'cartesisch', opdracht: 'Bereken. Geef het resultaat in goniometrische vorm én in cartesische vorm (exact).',
        tex: `${goniTex(r1, t1)} ${maal ? '\\cdot' : ':'} ${goniTex(r2, t2)}`,
        antw: { soort: 'delen', delen: [{ label: 'r =', antw: rAntw(r, tg(r)) }, { label: '\\theta =', antw: hAntw(doel) }, { label: '\\text{cartesisch: } z =', antw: cAntw(c.z, { tex: c.tex, exact: true, voor: '' }) }] },
        uitleg: [`r = ${r1} ${maal ? '\\cdot' : ':'} ${r2} = ${r}`, `\\theta = ${gr(t1)} ${maal ? '+' : '-'} ${gr(t2)} = ${gr(doel)}`, `= ${goniTex(r, doel)} = ${c.tex}`] };
    } },
  },
  oefenMix: [['maal', 3], ['deel', 3], ['cartesisch', 2]],
  test: [['maal', 4], ['deel', 4], ['cartesisch', 2]], testSchudden: true,
};

// (a + bi)^n met bekende goniometrische vorm
const BASIS = [
  { z: '1 + i', r: Ex(1, 1, 2), t: 45 }, { z: '1 - i', r: Ex(1, 1, 2), t: -45 }, { z: '-1 + i', r: Ex(1, 1, 2), t: 135 }, { z: '-1 - i', r: Ex(1, 1, 2), t: 225 },
  { z: '\\sqrt{3} + i', r: Ex(2), t: 30 }, { z: '1 + \\sqrt{3}\\,i', r: Ex(2), t: 60 }, { z: '-\\sqrt{3} + i', r: Ex(2), t: 150 }, { z: '1 - \\sqrt{3}\\,i', r: Ex(2), t: -60 },
  { z: '2 + 2i', r: Ex(2, 1, 2), t: 45 },
];
const exMacht = (e, n) => { let r = Ex(1); for (let k = 0; k < n; k++) r = exMaal(r, e); return r; };
const D10 = {
  nr: 10, titel: 'De formule van De Moivre', kort: 'zⁿ = rⁿ(cos(nθ) + i sin(nθ))', rekenmachine: false,
  opdracht: 'Bereken met De Moivre. Geef het resultaat in goniometrische vorm: r en θ.',
  theorie: `<div class="kader def"><div class="kader-titel">Formule van De Moivre</div>
      <p>Machtsverheffen is herhaald vermenigvuldigen: de modulus wordt telkens vermenigvuldigd, het argument telkens opgeteld. Daaruit volgt:</p>
      <p class="midden">$z^n = \\left(r(\\cos \\theta + i \\sin \\theta)\\right)^n = r^n\\left(\\cos(n\\theta) + i \\sin(n\\theta)\\right)$</p>
      <p class="klein">Speciaal geval $n = 2$: dat levert de verdubbelingsformules $\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta$ en $\\sin(2\\theta) = 2 \\sin \\theta \\cos \\theta$.</p></div>
    <div class="kader eig"><div class="kader-titel">Werkwijze bij (a + bi)ⁿ</div>
      <ol><li>Zet $a + bi$ om naar goniometrische vorm (let op het kwadrant!).</li>
      <li>Pas De Moivre toe: $r^n$ en $n\\theta$.</li><li>Zet terug om naar cartesische vorm.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$1 + i = \\sqrt{2}(\\cos 45^\\circ + i \\sin 45^\\circ)$</p>
      <p class="midden">$(1 + i)^4 = (\\sqrt{2})^4\\left(\\cos(4 \\cdot 45^\\circ) + i \\sin(4 \\cdot 45^\\circ)\\right) = 4(\\cos 180^\\circ + i \\sin 180^\\circ) = -4$</p></div>${INTYPEN_GONI}`,
  voorbeelden: [
    { tex: '\\left(2(\\cos 15^\\circ + i \\sin 15^\\circ)\\right)^4', stappen: ['= 2^4\\left(\\cos(4 \\cdot 15^\\circ) + i \\sin(4 \\cdot 15^\\circ)\\right)', '= 16(\\cos 60^\\circ + i \\sin 60^\\circ) = 8 + 8\\sqrt{3}\\,i'] },
    { tex: '(\\sqrt{3} + i)^3', stappen: ['\\sqrt{3} + i = 2(\\cos 30^\\circ + i \\sin 30^\\circ)', '(\\sqrt{3} + i)^3 = 2^3(\\cos 90^\\circ + i \\sin 90^\\circ)', '= 8(0 + i) = 8i'] },
    { tex: '(1 - i)^6', stappen: ['1 - i = \\sqrt{2}\\left(\\cos(-45^\\circ) + i \\sin(-45^\\circ)\\right) \\quad \\text{(kwadrant IV)}', '(1 - i)^6 = (\\sqrt{2})^6\\left(\\cos(-270^\\circ) + i \\sin(-270^\\circ)\\right)', '= 8(0 + i) = 8i'] },
  ],
  soorten: {
    goni: { naam: '(r(cos θ + i sin θ))ⁿ', gen() {
      const r = kies([1, 2, 2, 3]), n = rnd(2, 6), t = 5 * rnd(1, 18);
      return { soort: 'goni', tex: `\\left(${goniTex(r, t)}\\right)^{${n}}`, antw: goniAntw(r ** n, tg(r ** n), n * t),
        uitleg: [`r = ${r}^{${n}} = ${r ** n}`, `\\theta = ${n} \\cdot ${gr(t)} = ${gr(n * t)}`, `= ${goniTex(r ** n, n * t)}`] };
    } },
    cart: { naam: '(a + bi)ⁿ → cartesisch', gen() {
      const B = kies(BASIS), n = rnd(2, 6), R = exMacht(B.r, n), t = n * B.t, c = { a: exMaal(R, exCos(t)), b: exMaal(R, exSin(t)) };
      const tex = exZTex(c.a, c.b);
      return { soort: 'cart', opdracht: 'Bereken met De Moivre. Geef het resultaat in de vorm a + bi (exact).', tex: `(${B.z})^{${n}}`,
        antw: cAntw(Z(c.a.v, c.b.v), { tex, exact: true }),
        uitleg: [`${B.z} = ${goniTex(exTex(B.r), B.t)}`, `(${B.z})^{${n}} = ${B.r.s === 1 ? exTex(B.r) : `(${exTex(B.r)})`}^{${n}}\\left(\\cos(${n} \\cdot ${B.t < 0 ? `(${gr(B.t)})` : gr(B.t)}) + i \\sin(${n} \\cdot ${B.t < 0 ? `(${gr(B.t)})` : gr(B.t)})\\right)`,
          `= ${goniTex(exTex(R), t)}`, `= ${tex}`] };
    } },
  },
  oefenMix: [['goni', 3], ['cart', 3]],
  test: [['goni', 5], ['cart', 5]], testSchudden: true,
};

// ===================================================================
//  E · TWEEDEGRAADSVERGELIJKINGEN IN ℂ
// ===================================================================

function vglTex(a, b, c) {
  const t = [];
  t.push(a === 1 ? 'x^2' : a === -1 ? '-x^2' : `${a}x^2`);
  if (b) t.push(`${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`);
  if (c) t.push(`${c < 0 ? '-' : '+'} ${Math.abs(c)}`);
  return t.join(' ') + ' = 0';
}
// a x² + b x + c = 0 met D = −k² < 0
function maakVgl(soort) {
  for (;;) {
    let a, b, k;
    if (soort === 'zuiver') { a = kies([1, 1, 1, 2, 4]); b = 0; k = 2 * a * rnd(1, 6); }
    else if (soort === 'eenvoudig') { a = 1; b = 2 * nz(-6, 6); k = 2 * rnd(1, 6); }
    else { a = kies([2, 4, 9]); b = nz(-12, 12); k = rnd(1, 12); }
    const D = -(k * k), c = (b * b - D) / (4 * a);
    if (!Number.isInteger(c) || c === 0 || Math.abs(c) > 200) continue;
    return { a, b, c, k, D };
  }
}
function vglUitleg(v) {
  const { a, b, c, k, D } = v;
  const re = -b / (2 * a), im = k / (2 * a);
  const fT = (p, q) => { const g = ggd(p, q) || 1, t = p / g, n = q / g; return n === 1 ? tg(t) : `${t < 0 ? '-' : ''}\\frac{${Math.abs(t)}}{${n}}`; };
  const reT = fT(-b, 2 * a), imT = fT(k, 2 * a);
  const zT = (s) => (b === 0 ? '' : `${reT} `) + (b === 0 ? (s < 0 ? '-' : '') : (s < 0 ? '- ' : '+ ')) + (imT === '1' ? 'i' : `${imT}${/frac/.test(imT) ? '\\,' : ''}i`);
  const L = [`a = ${a},\\; b = ${tg(b)},\\; c = ${tg(c)}`, `D = b^2 - 4ac = ${h(b)}^2 - 4 \\cdot ${a} \\cdot ${h(c)} = ${tg(D)} < 0`,
    `\\sqrt{D} = \\sqrt{${tg(D)}} = ${k}i`, `x = \\dfrac{${tg(-b)} \\pm ${k}i}{${2 * a}} = ${b === 0 ? '' : reT + ' '}\\pm ${imT === '1' ? '' : imT}i`];
  const tex = [zT(1), zT(-1)];
  L.push(`V = \\{${tex.join('\\,;\\,')}\\}`);
  return { L, waarden: [Z(re, im), Z(re, -im)], tex };
}
const D11 = {
  nr: 11, titel: 'Tweedegraadsvergelijkingen oplossen in ℂ', kort: 'Ook als D < 0 zijn er twee oplossingen: elkaars toegevoegde.', rekenmachine: false,
  opdracht: 'Los op in ℂ. Bereken eerst de discriminant.',
  theorie: `<div class="kader def"><div class="kader-titel">Tweedegraadsvergelijkingen in ℂ</div>
      <p>Uit hoofdstuk 1 ken je de discriminantmethode voor $ax^2 + bx + c = 0$:</p>
      <p class="midden">$D = b^2 - 4ac \\qquad x = \\dfrac{-b \\pm \\sqrt{D}}{2a}$</p>
      <p>Als $D < 0$ zijn er <b>geen reële</b> oplossingen. In $\\mathbb{C}$ bestaan ze wél: je schrijft</p>
      <p class="midden">$\\sqrt{D} = \\sqrt{-|D|} = i\\sqrt{|D|} \\qquad \\text{bv. } \\sqrt{-16} = 4i$</p>
      <p>De twee oplossingen zijn dan altijd <b>elkaars toegevoegde</b> (bij reële coëfficiënten).</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>Los op in $\\mathbb{C}$: $x^2 + 2x + 5 = 0$</p>
      <p class="midden">$D = 2^2 - 4 \\cdot 1 \\cdot 5 = -16 \\qquad x = \\dfrac{-2 \\pm 4i}{2} = -1 \\pm 2i$</p>
      <p class="midden">$V = \\{-1 + 2i\\,;\\,-1 - 2i\\}$</p></div>
    <div class="kader"><div class="kader-titel">Zo noteer je de oplossingen</div>
      <p>Typ beide oplossingen met een <b>puntkomma</b> ertussen: <code>-1 + 2i ; -1 - 2i</code>. Je mag ook <code>-1 ± 2i</code> typen (knop ±).
      Een breuk mag: <code>-1/2 + i ; -1/2 - i</code>.</p></div>`,
  voorbeelden: [
    { tex: 'x^2 + 16 = 0', stappen: ['D = 0^2 - 4 \\cdot 1 \\cdot 16 = -64', 'x = \\dfrac{0 \\pm 8i}{2} = \\pm 4i', 'V = \\{4i\\,;\\,-4i\\}'] },
    { tex: 'x^2 - 6x + 13 = 0', stappen: ['D = 36 - 52 = -16', 'x = \\dfrac{6 \\pm 4i}{2} = 3 \\pm 2i', 'V = \\{3 + 2i\\,;\\,3 - 2i\\}'] },
    { tex: '4x^2 + 4x + 5 = 0', stappen: ['D = 16 - 80 = -64', 'x = \\dfrac{-4 \\pm 8i}{8} = -\\frac{1}{2} \\pm i', 'V = \\{-\\frac{1}{2} + i\\,;\\,-\\frac{1}{2} - i\\}'] },
  ],
  soorten: Object.fromEntries([['zuiver', 'ax² + c = 0'], ['eenvoudig', 'x² + bx + c = 0'], ['algemeen', 'ax² + bx + c = 0']].map(([s, naam]) => [s, { naam, gen() {
    const v = maakVgl(s), u = vglUitleg(v);
    return { soort: s, tex: vglTex(v.a, v.b, v.c), antw: { soort: 'Vcomplex', voor: 'V =', waarden: u.waarden, tex: u.tex }, uitleg: u.L };
  } }])),
  oefenMix: [['zuiver', 2], ['eenvoudig', 3], ['algemeen', 2]],
  test: [['zuiver', 3], ['eenvoudig', 4], ['algemeen', 3]], testSchudden: true,
};

// ===================================================================
//  F · EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
const D12 = {
  nr: 12, titel: 'Eindtest complexe getallen', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div>
      <p>In deze eindtest komt alles van het hoofdstuk door elkaar. Herhaal gerust de theorie van een vorig deel: alle delen blijven open.</p></div>
    ${FORMULES_CART}${FORMULES_GONI}
    <div class="kader def"><div class="kader-titel">Goniometrische vorm: bewerkingen</div>
      <p>Vermenigvuldigen: moduli vermenigvuldigen, argumenten optellen. Delen: moduli delen, argumenten aftrekken.</p>
      <p class="midden">$z^n = r^n\\left(\\cos(n\\theta) + i \\sin(n\\theta)\\right)$ &nbsp; (De Moivre)</p></div>`,
  voorbeelden: [],
  soorten: {
    reim: mix(D1, 'reim', 'Re en Im'), leesaf: mix(D2, 'leesaf', 'Punt aflezen'), modulus: mix(D3, 'wortel', 'Modulus'),
    som: mix(D4, 'verschil', 'Optellen en aftrekken'), product: mix(D5, 'product', 'Vermenigvuldigen'), deling: mix(D6, 'mooi', 'Delen'),
    naarGoni: mix(D7, 'kw23', 'Naar goniometrische vorm'), naarCart: mix(D8, 'bijzonder', 'Naar cartesische vorm'),
    goniBew: mix(D9, 'deel', 'Bewerkingen in goniometrische vorm'), moivre: mix(D10, 'cart', 'De Moivre'), vgl: mix(D11, 'eenvoudig', 'Vergelijkingen'),
  },
  oefenMix: [['reim', 1], ['leesaf', 1], ['modulus', 1], ['som', 1], ['product', 1], ['deling', 1], ['naarGoni', 1], ['naarCart', 1], ['goniBew', 1], ['moivre', 1], ['vgl', 1]],
  test: [['leesaf', 1], ['modulus', 1], ['som', 1], ['product', 1], ['deling', 1], ['naarGoni', 1], ['naarCart', 1], ['goniBew', 1], ['moivre', 1], ['vgl', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'complexe-getallen',
  titel: 'Complexe getallen',
  ondertitel: 'Toegepaste wiskunde · 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je werkt het hoofdstuk complexe getallen stap voor stap door: van de complexe eenheid $i$ tot tweedegraadsvergelijkingen oplossen in $\\mathbb{C}$.
    Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p class="klein">Hoeken werk je altijd uit in <b>graden</b>. Zet je rekenmachine dus in de stand DEG.</p>`,
  groepen: [
    { titel: 'A · Het complexe vlak', delen: [1, 2, 3] },
    { titel: 'B · Bewerkingen in cartesische vorm', delen: [4, 5, 6] },
    { titel: 'C · Goniometrische vorm', delen: [7, 8] },
    { titel: 'D · Bewerkingen in goniometrische vorm', delen: [9, 10] },
    { titel: 'E · Tweedegraadsvergelijkingen in ℂ', delen: [11] },
    { titel: 'F · Eindtest', delen: [12] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12],
});
})();
