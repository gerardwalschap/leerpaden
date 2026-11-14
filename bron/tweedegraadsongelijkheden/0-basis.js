// ===== Tweedegraadsongelijkheden · Toegepaste wiskunde 4BW — hulpmiddelen =====
// Leidraad: de PowerPoint "2. Tweedegraadsongelijkheden" (werkwijze grafisch en algebraïsch), cursus en werkbundel (G. Walschap).
// Geen vraagstukken.
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(x);
const h_ = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const I = Infinity;
const TEKENS = { '>': '>', '≥': '\\geq', '<': '<', '≤': '\\leq' };
const TEKST = { '>': '> 0', '≥': '≥ 0', '<': '< 0', '≤': '≤ 0' };

// ---- voorschrift ax² + bx + c
function vTex(a, b, c) {
  const t = [a === 1 ? 'x^2' : a === -1 ? '-x^2' : `${tg(a)}x^2`];
  if (b) t.push(`${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : tg(Math.abs(b))}x`);
  if (c) t.push(`${c < 0 ? '-' : '+'} ${tg(Math.abs(c))}`);
  return t.join(' ');
}
const ongTex = (p, t) => `${vTex(p.a, p.b, p.c)} ${TEKENS[t]} 0`;
// parabool met twee gehele nulwaarden
function metNulwaarden(a, x1, x2) { return { a, b: -a * (x1 + x2), c: a * x1 * x2, nul: [x1, x2].sort((p, q) => p - q) }; }
function metEen(a, h) { return { a, b: -2 * a * h, c: a * h * h, nul: [h] }; }
function zonder(a) { for (;;) { const b = rnd(-6, 6), c = a * rnd(1, 12); if (b * b - 4 * a * c < 0) return { a, b, c, nul: [] }; } }
const f = (p) => (x) => p.a * x * x + p.b * x + p.c;

// ---- oplossingsverzameling
const pos = (t) => t === '>' || t === '≥', incl = (t) => t === '≥' || t === '≤';
function oplossing(p, t) {
  const groter = pos(t) === (p.a > 0); // zoek je het teken van a? (buiten de nulwaarden)
  const m = incl(t);
  if (p.nul.length === 2) {
    const [x1, x2] = p.nul;
    return groter ? [{ a: -I, ai: false, b: x1, bi: m }, { a: x2, ai: m, b: I, bi: false }] : [{ a: x1, ai: m, b: x2, bi: m }];
  }
  if (p.nul.length === 1) {
    const h = p.nul[0];
    if (groter) return m ? [{ a: -I, ai: false, b: I, bi: false }] : [{ a: -I, ai: false, b: h, bi: false }, { a: h, ai: false, b: I, bi: false }];
    return m ? [{ a: h, ai: true, b: h, bi: true }] : [];
  }
  return groter ? [{ a: -I, ai: false, b: I, bi: false }] : [];
}
const vAntw = (p, t) => ({ soort: 'verzameling', voor: 'V =', stukken: oplossing(p, t) });
const vTexVan = (p, t) => VZ.texVan(oplossing(p, t));
// de zin uit de PowerPoint: "> 0: kolommen met +, zonder de nulwaarden"
function kolomZin(p, t) {
  const teken = pos(t) ? '+' : '-';
  const met = incl(t) ? '\\text{mét de nulwaarden}' : '\\text{zonder de nulwaarden}';
  return `${TEKENS[t]} 0: \\text{ kolommen met } ${teken}, \\; ${met}`;
}

// ---- tekenschema (HTML-tabel zoals in de PowerPoint)
function tekenschema(p) {
  const teken = (s) => s > 0 ? '+' : '−';
  let x, fx;
  if (p.nul.length === 2) {
    x = ['', tg(p.nul[0]), '', tg(p.nul[1]), ''].map(v => v ? `$${v}$` : '');
    fx = [teken(p.a), '0', teken(-p.a), '0', teken(p.a)];
  } else if (p.nul.length === 1) { x = ['', `$${tg(p.nul[0])}$`, '']; fx = [teken(p.a), '0', teken(p.a)]; }
  else { x = ['geen nulwaarden']; fx = [teken(p.a)]; }
  return `<table class="tabel tekenschema"><tr><th>$x$</th>${x.map(v => `<td>${v}</td>`).join('')}</tr><tr><th>$f(x)$</th>${fx.map(v => `<td>${v}</td>`).join('')}</tr></table>`;
}
function tekenschemaTex(p) {
  const s = (v) => v > 0 ? '+' : '-';
  if (p.nul.length === 2) return `\\begin{array}{c|ccccc} x & & ${tg(p.nul[0])} & & ${tg(p.nul[1])} & \\\\ \\hline f(x) & ${s(p.a)} & 0 & ${s(-p.a)} & 0 & ${s(p.a)} \\end{array}`;
  if (p.nul.length === 1) return `\\begin{array}{c|ccc} x & & ${tg(p.nul[0])} & \\\\ \\hline f(x) & ${s(p.a)} & 0 & ${s(p.a)} \\end{array}`;
  return `\\begin{array}{c|c} x & \\text{geen nulwaarden} \\\\ \\hline f(x) & ${s(p.a)} \\end{array}`;
}

// ---- grafiek (SVG) met optioneel de oplossing op de x-as in het oranje
function graf(p, opt = {}) {
  const ff = f(p);
  const mid = p.nul.length ? (p.nul[0] + p.nul[p.nul.length - 1]) / 2 : -p.b / (2 * p.a);
  const X0 = Math.floor(Math.min(mid - 4, (p.nul[0] ?? mid) - 2)), X1 = Math.ceil(Math.max(mid + 4, (p.nul[p.nul.length - 1] ?? mid) + 2));
  const top = ff(-p.b / (2 * p.a));
  const Y0 = Math.floor(Math.min(-3, top - 1)), Y1 = Math.ceil(Math.max(3, top + 1));
  const B = 300, sc = B / (X1 - X0), m = 18, w = B + 2 * m;
  const X = (x) => m + (x - X0) * sc, Y = (y) => m + (Y1 - y) * sc;
  let g = '';
  for (let k = X0; k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>`;
  for (let k = Y0; k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>`;
  g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1) + 6}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.4" marker-end="url(#op)"/>`;
  if (X0 <= 0 && X1 >= 0) g += `<line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1) - 6}" stroke="#1f2733" stroke-width="1.4" marker-end="url(#op)"/>`;
  for (let k = X0 + 1; k < X1; k++) if (k !== 0) g += `<text x="${X(k)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle" fill="#555">${k < 0 ? '−' + (-k) : k}</text>`;
  g += `<text x="${X(X1) + 2}" y="${Y(0) - 6}" font-size="12" text-anchor="end" font-style="italic">x</text>`;
  if (X0 <= 0 && X1 >= 0) g += `<text x="${X(0) + 6}" y="${Y(Y1) + 6}" font-size="12" font-style="italic">y</text>`;
  if (opt.oplossing) {
    for (const s of oplossing(p, opt.oplossing)) {
      const a = Math.max(s.a, X0), b = Math.min(s.b, X1);
      g += `<line x1="${X(a)}" y1="${Y(0)}" x2="${X(b)}" y2="${Y(0)}" stroke="#e8772e" stroke-width="6" stroke-linecap="butt" opacity=".85"/>`;
    }
  }
  let d = '', aan = false;
  for (let i = 0; i <= 500; i++) {
    const x = X0 + (X1 - X0) * i / 500, y = ff(x);
    if (y < Y0 - 1 || y > Y1 + 1) { aan = false; continue; }
    d += `${aan ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)} `; aan = true;
  }
  g += `<path d="${d}" fill="none" stroke="#1c4e8a" stroke-width="2.4"/>`;
  if (opt.nulpunten !== false) for (const n of p.nul) {
    const vol = opt.oplossing ? incl(opt.oplossing) : true;
    g += `<circle cx="${X(n)}" cy="${Y(0)}" r="4.5" fill="${vol ? '#e8772e' : '#fff'}" stroke="#e8772e" stroke-width="2"/>`;
  }
  const hh = (Y1 - Y0) * sc + 2 * m;
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek van f" style="font-family:Verdana,sans-serif">
    <defs><marker id="op" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f2733"/></marker></defs>
    <text x="${w - m - 4}" y="${m + 14}" font-size="12" fill="#1c4e8a" text-anchor="end" paint-order="stroke" stroke="#fff" stroke-width="4">f(x) = ${vTex(p.a, p.b, p.c).replace(/\^2/g, '²').replace(/-/g, '−')}</text>${g}</svg></div>`;
}

// ---- vaste theorieblokken
const INTYPEN = `<div class="kader"><div class="kader-titel">Zo typ je de oplossingsverzameling</div>
  <ul><li>Een interval: <code>[-1, 3]</code> of <code>]-∞, 2[</code>. Een unie met de knop ∪: <code>]-∞, 2[ ∪ ]3, +∞[</code>.</li>
  <li>Alle reële getallen: <code>ℝ</code> · geen oplossingen: <code>∅</code> · alles behalve 3: <code>ℝ \\ {3}</code> · enkel 3: <code>{3}</code>.</li>
  <li>Bij $-\\infty$ en $+\\infty$ staat het haakje altijd naar buiten.</li></ul></div>`;
const WERKWIJZE_GRAFISCH = `<div class="kader eig"><div class="kader-titel">Grafisch oplossen: zo ga je te werk</div>
  <ol><li>Lees de <b>nulwaarden</b> af: waar snijdt de parabool de $x$-as?</li>
  <li>$> 0$: waar ligt de grafiek <b>boven</b> de $x$-as? &nbsp; $< 0$: waar ligt ze <b>onder</b> de $x$-as?</li>
  <li>$\\geq$ of $\\leq$: de nulwaarden <b>horen erbij</b> $[\\;]$. &nbsp; $>$ of $<$: de nulwaarden <b>horen er niet bij</b> $]\\;[$.</li>
  <li>Schrijf de oplossingsverzameling $V$ op.</li></ol></div>`;
const WERKWIJZE_ALGEBRA = `<div class="kader eig"><div class="kader-titel">Algebraïsch oplossen: zo ga je te werk</div>
  <ol><li>Bereken de discriminant $D = b^2 - 4ac$.</li>
  <li>Bereken de nulwaarden met de ABC-formule $x_{1,2} = \\dfrac{-b \\pm \\sqrt{D}}{2a}$.</li>
  <li>Maak een schets: $a > 0$ dalparabool, $a < 0$ bergparabool.</li>
  <li>Stel het tekenschema op en lees $V$ af.</li></ol>
  <p class="klein">$D > 0$: twee nulwaarden · $D = 0$: één nulwaarde (de parabool raakt de $x$-as) · $D < 0$: geen nulwaarden, $f(x)$ heeft overal het teken van $a$.</p></div>`;
