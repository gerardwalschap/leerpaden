// Overgenomen uit bron/tweedegraadsongelijkheden/ (4BW) en hergebruikt voor toegepaste wiskunde 5BCW. Eigen blok: geen naamconflicten.
{
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

// ===================================================================
//  A · GRAFISCH OPLOSSEN
// ===================================================================

const kiesTeken = () => kies(['>', '≥', '<', '≤']);
function tweeNul(maxA = 1) {
  for (;;) {
    const x1 = rnd(-5, 4), x2 = x1 + rnd(1, 6), a = kies(maxA === 1 ? [1, -1] : [1, -1, 2, -2, 3]);
    if (x2 > 6) continue;
    return metNulwaarden(a, x1, x2);
  }
}
function grafUitleg(p, t) {
  const L = [];
  if (p.nul.length === 2) L.push(`\\text{nulwaarden: } x = ${tg(p.nul[0])} \\text{ en } x = ${tg(p.nul[1])}`);
  else if (p.nul.length === 1) L.push(`\\text{één nulwaarde: } x = ${tg(p.nul[0])} \\text{ (de parabool raakt de } x\\text{-as)}`);
  else L.push('\\text{geen nulwaarden: de parabool snijdt de } x\\text{-as niet}');
  const waar = pos(t) ? 'boven' : 'onder';
  L.push(`${TEKENS[t]} 0: \\text{ waar ligt de grafiek ${waar} de } x\\text{-as?}${p.nul.length ? ` \\; \\text{De nulwaarden horen er${incl(t) ? '' : ' niet'} bij.}` : ''}`);
  L.push(`V = ${vTexVan(p, t)}`);
  return L;
}
function grafVraag(soort, p, t) {
  return { soort, opdracht: 'De grafiek van f is gegeven. Los de ongelijkheid grafisch op.', html: `<p class="midden">$${ongTex(p, t)}$</p>${graf(p)}`,
    sleutel: ongTex(p, t), rapport: ongTex(p, t).replace(/\\geq/g, '≥').replace(/\\leq/g, '≤'), antw: vAntw(p, t), uitleg: grafUitleg(p, t) };
}
const D1 = {
  nr: 1, titel: 'Grafisch oplossen', kort: 'Boven of onder de x-as? Horen de nulwaarden erbij?', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Wat is een tweedegraadsongelijkheid?</div>
      <p>In hoofdstuk 1 loste je tweedegraadsvergelijkingen $ax^2 + bx + c = 0$ op. Nu vervang je het gelijkheidsteken door een ongelijkheidsteken.</p>
      <p><b>Tweedegraadsongelijkheid:</b> een ongelijkheid van de vorm $ax^2 + bx + c > 0$ (of $<$, $\\geq$, $\\leq$), met $a, b, c \\in \\mathbb{R}$ en $a \\neq 0$.</p>
      <p>$ax^2 + bx + c$ is het voorschrift van de tweedegraadsfunctie $f(x) = ax^2 + bx + c$. Een tweedegraadsongelijkheid oplossen komt dus neer op de vraag:</p>
      <p class="midden"><b>Voor welke $x$-waarden ligt de grafiek van $f$ boven (of onder) de $x$-as?</b></p></div>
    ${WERKWIJZE_GRAFISCH}
    <div class="kader werk"><div class="kader-titel">Voorbeeld 1: $x^2 - 5x + 6 > 0$</div>
      ${graf(metNulwaarden(1, 2, 3), { oplossing: '>' })}
      <p>Nulwaarden: $x = 2$ en $x = 3$. &nbsp; $> 0$: de grafiek ligt boven de $x$-as links van 2 en rechts van 3. De nulwaarden horen er niet bij.</p>
      <p class="midden">$x < 2$ of $x > 3$ &nbsp;⇒&nbsp; $V = {]}-\\infty, 2{[} \\cup {]}3, +\\infty{[}$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld 2: $-x^2 + 2x + 3 \\geq 0$</div>
      ${graf(metNulwaarden(-1, -1, 3), { oplossing: '≥' })}
      <p>Nulwaarden: $x = -1$ en $x = 3$. &nbsp; $\\geq 0$: de grafiek ligt boven de $x$-as tussen $-1$ en $3$. De nulwaarden horen erbij.</p>
      <p class="midden">$-1 \\leq x \\leq 3$ &nbsp;⇒&nbsp; $V = [-1, 3]$</p></div>${INTYPEN}`,
  voorbeelden: [
    { html: `<p class="midden">$x^2 - 2x - 8 \\leq 0$</p>${graf(metNulwaarden(1, -2, 4))}`, stappen: ['\\text{nulwaarden: } x = -2 \\text{ en } x = 4', '\\leq 0: \\text{ de grafiek ligt onder de } x\\text{-as tussen } -2 \\text{ en } 4 \\text{; nulwaarden horen erbij}', '-2 \\leq x \\leq 4 \\Rightarrow V = [-2, 4]'] },
    { html: `<p class="midden">$x^2 + x - 6 < 0$</p>${graf(metNulwaarden(1, -3, 2))}`, stappen: ['\\text{nulwaarden: } x = -3 \\text{ en } x = 2', '< 0: \\text{ onder de } x\\text{-as tussen } -3 \\text{ en } 2 \\text{; nulwaarden horen er niet bij}', 'V = {]}-3, 2['] },
    { html: `<p class="midden">$-x^2 + 4x \\leq 0$</p>${graf(metNulwaarden(-1, 0, 4))}`, stappen: ['\\text{nulwaarden: } x = 0 \\text{ en } x = 4', '\\leq 0: \\text{ onder de } x\\text{-as links van 0 en rechts van 4; nulwaarden horen erbij}', 'x \\leq 0 \\text{ of } x \\geq 4 \\Rightarrow V = {]}-\\infty, 0] \\cup [4, +\\infty{[}'] },
  ],
  soorten: {
    dal: { naam: 'Dalparabool', gen() { const q = tweeNul(); return grafVraag('dal', metNulwaarden(1, q.nul[0], q.nul[1]), kiesTeken()); } },
    berg: { naam: 'Bergparabool', gen() { const q = tweeNul(); return grafVraag('berg', metNulwaarden(-1, q.nul[0], q.nul[1]), kiesTeken()); } },
  },
  oefenMix: [['dal', 1], ['berg', 1]],
  test: [['dal', 5], ['berg', 5]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Grafisch: geen of één nulwaarde', kort: 'Snijdt of raakt de parabool de x-as niet? Dan is V = ℝ, ∅, ℝ \\ {a} of {a}.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Geen nulwaarden</div>
      <p>Snijdt de parabool de $x$-as niet, dan ligt de grafiek ofwel volledig <b>boven</b> de $x$-as, ofwel volledig <b>onder</b> de $x$-as.</p>
      ${graf({ a: 1, b: -4, c: 5, nul: [] })}
      <p>$x^2 - 4x + 5 > 0$: de grafiek ligt overal boven de $x$-as &nbsp;⇒&nbsp; $V = \\mathbb{R}$. &nbsp;&nbsp; $x^2 - 4x + 5 < 0$: nergens &nbsp;⇒&nbsp; $V = \\varnothing$.</p></div>
    <div class="kader def"><div class="kader-titel">Eén nulwaarde</div>
      <p>Raakt de parabool de $x$-as in één punt, dan ligt de grafiek overal aan dezelfde kant van de $x$-as, behalve in die nulwaarde.</p>
      ${graf(metEen(1, 3))}
      <table class="tabel"><tr><th>$x^2 - 6x + 9 > 0$</th><td>overal boven, behalve in $x = 3$</td><td>$V = \\mathbb{R} \\setminus \\{3\\}$</td></tr>
      <tr><th>$x^2 - 6x + 9 \\geq 0$</th><td>overal (in 3 is het $0$)</td><td>$V = \\mathbb{R}$</td></tr>
      <tr><th>$x^2 - 6x + 9 < 0$</th><td>nergens</td><td>$V = \\varnothing$</td></tr>
      <tr><th>$x^2 - 6x + 9 \\leq 0$</th><td>enkel in $x = 3$</td><td>$V = \\{3\\}$</td></tr></table></div>${INTYPEN}`,
  voorbeelden: [
    { html: `<p class="midden">$-x^2 + 2x - 3 \\geq 0$</p>${graf({ a: -1, b: 2, c: -3, nul: [] })}`, stappen: ['\\text{geen nulwaarden: de grafiek ligt volledig onder de } x\\text{-as}', '\\geq 0: \\text{ nergens boven of op de } x\\text{-as}', 'V = \\varnothing'] },
    { html: `<p class="midden">$-x^2 - 2x - 1 < 0$</p>${graf(metEen(-1, -1))}`, stappen: ['\\text{één nulwaarde: } x = -1', '< 0: \\text{ overal onder de } x\\text{-as, behalve in } x = -1', 'V = \\mathbb{R} \\setminus \\{-1\\}'] },
  ],
  soorten: {
    geen: { naam: 'Geen nulwaarden', gen() {
      for (;;) { const a = kies([1, -1]), p = zonder(a), top = f(p)(-p.b / (2 * a)); if (Math.abs(top) <= 6 && Math.abs(p.b / (2 * a)) <= 4 && Number.isInteger(p.b / (2 * a) * 2)) return grafVraag('geen', p, kiesTeken()); }
    } },
    een: { naam: 'Eén nulwaarde', gen() { return grafVraag('een', metEen(kies([1, -1]), rnd(-4, 4)), kiesTeken()); } },
  },
  oefenMix: [['geen', 1], ['een', 1]],
  test: [['geen', 5], ['een', 5]], testSchudden: true,
};

// ===================================================================
//  B · TEKENSCHEMA EN ALGEBRAÏSCH OPLOSSEN
// ===================================================================

const D3 = {
  nr: 3, titel: 'V aflezen uit het tekenschema', kort: 'Kolommen met + of −, met of zonder de nulwaarden.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Het tekenschema</div>
      <p>Het tekenschema vat samen waar $f(x)$ positief ($+$), nul ($0$) en negatief ($-$) is. Buiten de nulwaarden heeft $f(x)$ het teken van $a$, tussen de nulwaarden het tegengestelde teken.</p>
      ${tekenschema(metNulwaarden(1, -1, 5))}
      <p class="klein midden">tekenschema van $f(x) = x^2 - 4x - 5$ (nulwaarden $-1$ en $5$, $a > 0$)</p></div>
    <div class="kader eig"><div class="kader-titel">V aflezen</div>
      <ul><li>$> 0$: kolommen met $+$, <b>zonder</b> de nulwaarden &nbsp; · &nbsp; $\\geq 0$: kolommen met $+$, <b>mét</b> de nulwaarden</li>
      <li>$< 0$: kolommen met $-$, <b>zonder</b> de nulwaarden &nbsp; · &nbsp; $\\leq 0$: kolommen met $-$, <b>mét</b> de nulwaarden</li></ul>
      <p>Voor het schema hierboven: $x^2 - 4x - 5 > 0$ &nbsp;⇒&nbsp; $V = {]}-\\infty, -1{[} \\cup {]}5, +\\infty{[}$ &nbsp;&nbsp; en &nbsp;&nbsp; $x^2 - 4x - 5 \\leq 0$ &nbsp;⇒&nbsp; $V = [-1, 5]$.</p>
      <p class="klein">Is er geen kolom met het gevraagde teken, dan is $V = \\varnothing$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { html: `<p class="midden">$-x^2 - 2x + 8 \\geq 0$</p>${tekenschema(metNulwaarden(-1, -4, 2))}`, stappen: ['\\geq 0: \\text{ kolom met } +, \\text{ mét de nulwaarden}', 'V = [-4, 2]'] },
    { html: `<p class="midden">$x^2 + 2x + 5 < 0$</p>${tekenschema({ a: 1, b: 2, c: 5, nul: [] })}`, stappen: ['< 0: \\text{ er is geen kolom met } -', 'V = \\varnothing'] },
  ],
  soorten: {
    twee: { naam: 'Twee nulwaarden', gen() {
      const p = tweeNul(3), t = kiesTeken();
      return { soort: 'twee', opdracht: 'Lees de oplossingsverzameling af uit het tekenschema.', html: `<p class="midden">$${ongTex(p, t)}$</p>${tekenschema(p)}`, sleutel: ongTex(p, t),
        rapport: ongTex(p, t), antw: vAntw(p, t), uitleg: [kolomZin(p, t), `V = ${vTexVan(p, t)}`] };
    } },
    andere: { naam: 'Eén of geen nulwaarde', gen() {
      const p = kies([() => metEen(kies([1, -1, 2]), rnd(-5, 5)), () => zonder(kies([1, -1, 2]))])(), t = kiesTeken();
      return { soort: 'andere', opdracht: 'Lees de oplossingsverzameling af uit het tekenschema.', html: `<p class="midden">$${ongTex(p, t)}$</p>${tekenschema(p)}`, sleutel: ongTex(p, t),
        rapport: ongTex(p, t), antw: vAntw(p, t), uitleg: [kolomZin(p, t), `V = ${vTexVan(p, t)}`] };
    } },
  },
  oefenMix: [['twee', 2], ['andere', 1]],
  test: [['twee', 7], ['andere', 3]], testSchudden: true,
};

// ---- algebraïsch: D, nulwaarden, V
function algebraVraag(soort, p, t) {
  const { a, b, c } = p, D = b * b - 4 * a * c;
  const L = [`a = ${tg(a)}, \\; b = ${tg(b)}, \\; c = ${tg(c)}`, `D = b^2 - 4ac = ${h_(b)}^2 - 4 \\cdot ${h_(a)} \\cdot ${h_(c)} = ${tg(D)}`];
  if (D > 0) L.push(`x_{1,2} = \\dfrac{${tg(-b)} \\pm \\sqrt{${D}}}{${tg(2 * a)}} = \\dfrac{${tg(-b)} \\pm ${Math.sqrt(D)}}{${tg(2 * a)}} \\Rightarrow x_1 = ${tg(p.nul[0])}, \\; x_2 = ${tg(p.nul[1])}`);
  else if (D === 0) L.push(`D = 0: \\text{ één nulwaarde } x = \\dfrac{${tg(-b)}}{${tg(2 * a)}} = ${tg(p.nul[0])}`);
  else L.push('D < 0: \\text{ geen nulwaarden}');
  L.push(`a ${a > 0 ? '> 0: \\text{ dalparabool}' : '< 0: \\text{ bergparabool}'}`);
  L.push(`\\text{tekenschema: } ${tekenschemaTex(p)}`);
  L.push(kolomZin(p, t), `V = ${vTexVan(p, t)}`);
  return { soort, opdracht: 'Los algebraïsch op: bereken de discriminant, de nulwaarden en lees V af uit het tekenschema.', tex: ongTex(p, t),
    antw: { soort: 'delen', delen: [
      { label: 'D =', antw: { soort: 'getal', waarde: D, voor: '' } },
      { label: '\\text{nulwaarden:}', antw: p.nul.length ? { soort: 'Vmeer', voor: 'V =', waarden: p.nul, dec: 2 } : { soort: 'Vmeer', voor: 'V =', waarden: [], leeg: true } },
      { label: '\\text{oplossing:}', antw: vAntw(p, t) }] },
    uitleg: L };
}
const D4 = {
  nr: 4, titel: 'Algebraïsch oplossen (D > 0)', kort: 'Discriminant, nulwaarden, schets, tekenschema, V.', rekenmachine: false,
  theorie: `${WERKWIJZE_ALGEBRA}
    <div class="kader werk"><div class="kader-titel">Voorbeeld 1: $x^2 - 4x - 5 > 0$</div>
      <p><b>Stap 1 — Discriminant:</b> $a = 1$, $b = -4$, $c = -5$: &nbsp; $D = (-4)^2 - 4 \\cdot 1 \\cdot (-5) = 16 + 20 = 36$</p>
      <p><b>Stap 2 — Nulwaarden:</b> $x_{1,2} = \\dfrac{4 \\pm \\sqrt{36}}{2} = \\dfrac{4 \\pm 6}{2}$ &nbsp;⇒&nbsp; $x_1 = -1$, $x_2 = 5$</p>
      <p><b>Stap 3 — Schets:</b> $a > 0$: dalparabool</p>${graf(metNulwaarden(1, -1, 5), { nulpunten: true })}
      <p><b>Stap 4 — Tekenschema:</b></p>${tekenschema(metNulwaarden(1, -1, 5))}
      <p>$> 0$: kolommen met $+$, zonder de nulwaarden &nbsp;⇒&nbsp; $V = {]}-\\infty, -1{[} \\cup {]}5, +\\infty{[}$</p></div>
    <div class="kader"><div class="kader-titel">Zo vul je in</div><p>Bij <b>nulwaarden</b> typ je beide nulwaarden met een puntkomma: <code>-1 ; 5</code>. Bij <b>oplossing</b> typ je $V$, bv. <code>]-∞, -1[ ∪ ]5, +∞[</code>.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '-x^2 - 2x + 8 \\geq 0', stappen: ['a = -1, \\; b = -2, \\; c = 8: \\; D = (-2)^2 - 4 \\cdot (-1) \\cdot 8 = 4 + 32 = 36', 'x_{1,2} = \\dfrac{2 \\pm 6}{-2} \\Rightarrow x_1 = -4, \\; x_2 = 2', 'a < 0: \\text{ bergparabool}', `\\text{tekenschema: } ${tekenschemaTex(metNulwaarden(-1, -4, 2))}`, '\\geq 0: \\text{ kolom met } +, \\text{ mét de nulwaarden} \\Rightarrow V = [-4, 2]'] },
    { tex: '2x^2 - 2x - 12 \\geq 0', stappen: ['a = 2, \\; b = -2, \\; c = -12: \\; D = 4 + 96 = 100', 'x_{1,2} = \\dfrac{2 \\pm 10}{4} \\Rightarrow x_1 = -2, \\; x_2 = 3', 'a > 0: \\text{ dalparabool}', `\\text{tekenschema: } ${tekenschemaTex(metNulwaarden(2, -2, 3))}`, '\\geq 0: \\text{ kolommen met } +, \\text{ mét de nulwaarden} \\Rightarrow V = {]}-\\infty, -2] \\cup [3, +\\infty{[}'] },
  ],
  soorten: {
    a1: { naam: 'a = 1 of a = −1', gen() { const x1 = rnd(-6, 5), x2 = x1 + rnd(1, 7); return algebraVraag('a1', metNulwaarden(kies([1, -1]), x1, Math.min(x2, 8)), kiesTeken()); } },
    aAnders: { naam: 'a ≠ ±1', gen() { const x1 = rnd(-5, 4), x2 = x1 + rnd(1, 6); return algebraVraag('aAnders', metNulwaarden(kies([2, -2, 3, -3]), x1, x2), kiesTeken()); } },
  },
  oefenMix: [['a1', 2], ['aAnders', 1]],
  test: [['a1', 6], ['aAnders', 4]], testSchudden: true,
};

const D5 = {
  nr: 5, titel: 'Algebraïsch oplossen (D = 0 en D < 0)', kort: 'Eén of geen nulwaarde: V = ℝ, ∅, ℝ \\ {a} of {a}.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">D = 0: één nulwaarde</div>
      <p>De parabool raakt de $x$-as. Het tekenschema heeft één nulwaarde, met aan beide kanten het teken van $a$.</p>
      <p><b>Voorbeeld:</b> $x^2 - 6x + 9 > 0$: &nbsp; $D = 36 - 36 = 0$, nulwaarde $x = \\dfrac{6}{2} = 3$, $a > 0$.</p>${tekenschema(metEen(1, 3))}
      <p>$> 0$: overal $+$, behalve in $x = 3$ &nbsp;⇒&nbsp; $V = \\mathbb{R} \\setminus \\{3\\}$</p></div>
    <div class="kader def"><div class="kader-titel">D < 0: geen nulwaarden</div>
      <p>De parabool snijdt de $x$-as niet: $f(x)$ heeft <b>overal het teken van $a$</b>.</p>
      <p><b>Voorbeeld:</b> $x^2 + 2x + 5 < 0$: &nbsp; $D = 4 - 20 = -16 < 0$, geen nulwaarden, $a > 0$.</p>${tekenschema({ a: 1, b: 2, c: 5, nul: [] })}
      <p>$< 0$: er is geen kolom met $-$ &nbsp;⇒&nbsp; $V = \\varnothing$</p></div>
    <div class="kader"><div class="kader-titel">Zo vul je in</div><p>Geen nulwaarden? Klik bij <b>nulwaarden</b> op de knop $V = \\varnothing$. Eén nulwaarde: typ enkel die waarde.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '-x^2 + 4x - 4 \\geq 0', stappen: ['D = 16 - 16 = 0: \\text{ één nulwaarde } x = \\dfrac{-4}{-2} = 2', 'a < 0: \\text{ bergparabool, overal } - \\text{ behalve } 0 \\text{ in } x = 2', '\\geq 0: \\text{ enkel in } x = 2 \\Rightarrow V = \\{2\\}'] },
    { tex: '-2x^2 + x - 3 < 0', stappen: ['D = 1 - 24 = -23 < 0: \\text{ geen nulwaarden}', 'a < 0: \\; f(x) \\text{ is overal negatief}', '< 0: \\text{ overal} \\Rightarrow V = \\mathbb{R}'] },
  ],
  soorten: {
    nul: { naam: 'D = 0', gen() { return algebraVraag('nul', metEen(kies([1, -1, 2, -2]), nz(-6, 6)), kiesTeken()); } },
    negatief: { naam: 'D < 0', gen() { return algebraVraag('negatief', zonder(kies([1, -1, 2, -2, 3])), kiesTeken()); } },
  },
  oefenMix: [['nul', 1], ['negatief', 1]],
  test: [['nul', 5], ['negatief', 5]], testSchudden: true,
};

// ===================================================================
//  C · EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D6 = {
  nr: 6, titel: 'Eindtest tweedegraadsongelijkheden', kort: 'Grafisch en algebraïsch door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest los je ongelijkheden grafisch en algebraïsch op, door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>
    ${WERKWIJZE_GRAFISCH}${WERKWIJZE_ALGEBRA}${INTYPEN}`,
  voorbeelden: [],
  soorten: {
    grafDal: mix(D1, 'dal', 'Grafisch, dalparabool'), grafBerg: mix(D1, 'berg', 'Grafisch, bergparabool'), grafAnders: mix(D2, 'een', 'Grafisch, één nulwaarde'),
    schema: mix(D3, 'twee', 'Tekenschema'), alg: mix(D4, 'a1', 'Algebraïsch'), algA: mix(D4, 'aAnders', 'Algebraïsch, a ≠ ±1'), algNul: mix(D5, 'nul', 'Algebraïsch, D = 0'), algNeg: mix(D5, 'negatief', 'Algebraïsch, D < 0'),
  },
  oefenMix: [['grafDal', 1], ['grafBerg', 1], ['grafAnders', 1], ['schema', 1], ['alg', 1], ['algA', 1], ['algNul', 1], ['algNeg', 1]],
  test: [['grafDal', 1], ['grafBerg', 1], ['grafAnders', 1], ['schema', 1], ['alg', 2], ['algA', 2], ['algNul', 1], ['algNeg', 1]], testSchudden: true,
};

EXT.O = { D4, D5 };
}
