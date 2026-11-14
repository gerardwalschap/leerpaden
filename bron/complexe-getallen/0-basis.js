// ===== Complexe getallen · Toegepaste wiskunde 5BCW — hulpmiddelen =====
// Leidraad: cursus en werkbundel TWiskunde 5BCW, hoofdstuk 2 Complexe getallen (G. Walschap).
// Hoeken altijd in GRADEN (de leerlingen kennen nog geen radialen).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(x);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const gr = (x) => `${tg(x)}^\\circ`;
const rond2 = (x) => W.rond(x, 2);

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
  const bs = exact ? `= ${gr(Math.round(basis))}` : `\\approx ${gr(rond2(basis))}`;
  if (a > 0) return [`\\text{kwadrant ${kw}: } \\theta = ${bt} ${bs}`];
  return [`\\text{kwadrant ${kw} } (a < 0)\\text{: } ${bt} ${bs}`, `\\theta ${exact ? '=' : '\\approx'} ${gr(exact ? Math.round(basis) : rond2(basis))} + 180^\\circ ${exact ? '=' : '\\approx'} ${gr(exact ? Math.round(t) : rond2(t))}`];
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
