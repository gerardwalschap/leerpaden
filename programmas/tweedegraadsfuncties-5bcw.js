// Programma 'tweedegraadsfuncties-5bcw' — automatisch samengevoegd uit bron/tweedegraadsfuncties-5bcw/ (niet rechtstreeks bewerken)
(() => {
// ===== Tweedegraadsfuncties · Toegepaste wiskunde 5BCW =====
// Leidraad: cursus, PWP en werkbundel TWiskunde 5BCW hoofdstuk 1 (G. Walschap).
// Hergebruikt delen uit de 4BW-leerpaden (transformaties, ontbinden/discriminant, ongelijkheden) + nieuwe delen.
const EXT = {};
// Overgenomen uit bron/tweedegraadsfuncties-transformaties/ (4BW) en hergebruikt voor toegepaste wiskunde 5BCW. Eigen blok: geen naamconflicten.
{
// ===== Tweedegraadsfuncties: transformaties en kenmerken · Toegepaste wiskunde 4BW — hulpmiddelen =====
// Leidraad: cursus en werkbundel TWiskunde 4BW, hoofdstuk 3 (G. Walschap).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(x);
const h_ = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

// ---- rationale getallen als {t, n}
const Q = (t, n = 1) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return { t: t / g, n: n / g, v: t / n }; };
const qTex = (q, metTeken = true) => { const t = metTeken ? q.t : Math.abs(q.t); return q.n === 1 ? tg(t) : `${t < 0 ? '-' : ''}\\frac{${Math.abs(t)}}{${q.n}}`; };
const qStr = (q) => q.n === 1 ? String(q.t) : `(${q.t}/${q.n})`;          // voor de rekenkern FX
const qDec = (q) => { const v = q.v; return Number.isInteger(v * 100) ? v : null; };
const qGetal = (q) => ({ soort: 'getal', waarde: q.v, voor: '' });       // 5/2 en 2,5 zijn allebei juist

// ---- topvorm a(x − h)² + k  (a, h, k rationaal)
function topTex(a, h, k, naam = 'f') {
  let s = '';
  const aT = a.n === 1 && Math.abs(a.t) === 1 ? (a.t < 0 ? '-' : '') : (a.n === 1 ? tg(a.t) : `${a.t < 0 ? '-' : ''}\\frac{${Math.abs(a.t)}}{${a.n}}`);
  const binnen = h.v === 0 ? 'x' : `x ${h.v > 0 ? '-' : '+'} ${qTex(h, false)}`;
  s = h.v === 0 ? `${aT}x^2` : `${aT}\\left(${binnen}\\right)^2`;
  if (k.v !== 0) s += ` ${k.v > 0 ? '+' : '-'} ${qTex(k, false)}`;
  return naam ? `${naam}(x) = ${s}` : s;
}
const topExpr = (a, h, k) => `${qStr(a)}*(x-${qStr(h)})^2+${qStr(k)}`;
const fAntw = (expr, tex, extra = {}) => ({ soort: 'functie', expr, tex, voor: 'g(x) =', ...extra });
const topAntw = (a, h, k, naam = 'f') => fAntw(topExpr(a, h, k), topTex(a, h, k, null), { vorm: 'topvorm', voor: `${naam}(x) =` });
const getal = (x, extra = {}) => ({ soort: 'getal', waarde: x, voor: '', ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist });
const kz = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
// keuze met tekstopties: juist eerst meegeven, wordt geschud
function tekstKeuze(juist, fout) {
  const alle = schud([juist, ...fout.filter((x, i, r) => x !== juist && r.indexOf(x) === i)].slice(0, 4));
  return { soort: 'keuze', opties: alle.map((t, i) => ({ k: String(i), l: `\\text{${t}}` })), juist: String(alle.indexOf(juist)) };
}
const getalTekst = (x) => String(x).replace('.', ',');
const eenheden = (x) => `${getalTekst(Math.abs(x))} ${Math.abs(x) === 1 ? 'eenheid' : 'eenheden'}`;

// ---- basisfuncties
const BASIS = {
  x2: { tex: 'x^2', naam: 'x²', expr: (u) => `(${u})^2`, texIn: (u) => u === 'x' ? 'x^2' : `\\left(${u}\\right)^2` },
  x3: { tex: 'x^3', naam: 'x³', expr: (u) => `(${u})^3`, texIn: (u) => u === 'x' ? 'x^3' : `\\left(${u}\\right)^3` },
  wortel: { tex: '\\sqrt{x}', naam: '√x', expr: (u) => `√(${u})`, texIn: (u) => `\\sqrt{${u}}` },
  inv: { tex: '\\dfrac{1}{x}', naam: '1/x', expr: (u) => `1/(${u})`, texIn: (u) => `\\dfrac{1}{${u}}` },
};
const xMin = (h) => h === 0 ? 'x' : `x ${h > 0 ? '-' : '+'} ${tg(Math.abs(h))}`;
const plusK = (k) => k === 0 ? '' : ` ${k > 0 ? '+' : '-'} ${tg(Math.abs(k))}`;

// ---- grafieken (SVG): functies als [{f: x => y, stippel?, kleur?, label?}], punten [{x, y, label?}]
function graf(functies = [], punten = [], opt = {}) {
  const X0 = opt.x ? opt.x[0] : -6, X1 = opt.x ? opt.x[1] : 6, Y0 = opt.y ? opt.y[0] : -6, Y1 = opt.y ? opt.y[1] : 8;
  const B = 300, sc = B / (X1 - X0), H = (Y1 - Y0) * sc, m = 18;
  const X = (x) => m + (x - X0) * sc, Y = (y) => m + (Y1 - y) * sc;
  let g = '';
  for (let k = Math.ceil(X0); k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>`;
  for (let k = Math.ceil(Y0); k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>`;
  g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1) + 6}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.4" marker-end="url(#gp)"/>`;
  g += `<line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1) - 6}" stroke="#1f2733" stroke-width="1.4" marker-end="url(#gp)"/>`;
  g += `<text x="${X(X1) + 2}" y="${Y(0) - 6}" font-size="12" text-anchor="end" font-style="italic">x</text><text x="${X(0) + 6}" y="${Y(Y1) + 6}" font-size="12" font-style="italic">y</text>`;
  g += `<text x="${X(1)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle">1</text><text x="${X(0) - 4}" y="${Y(1) + 4}" font-size="10" text-anchor="end">1</text>`;
  for (const fu of functies) {
    let d = '', aan = false;
    for (let i = 0; i <= 600; i++) {
      const x = X0 + (X1 - X0) * i / 600, y = fu.f(x);
      if (!Number.isFinite(y) || y < Y0 - 2 || y > Y1 + 2) { aan = false; continue; }
      d += `${aan ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)} `; aan = true;
    }
    g += `<path d="${d}" fill="none" stroke="${fu.kleur || '#1c4e8a'}" stroke-width="${fu.stippel ? 1.5 : 2.4}" ${fu.stippel ? 'stroke-dasharray="6 4"' : ''}/>`;
    if (fu.label) g += `<text x="${X(fu.label[0])}" y="${Y(fu.label[1])}" font-size="13" font-weight="bold" fill="${fu.kleur || '#1c4e8a'}">${fu.label[2]}</text>`;
  }
  for (const p of punten) {
    g += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4.2" fill="${p.kleur || '#e8772e'}"/>`;
    if (p.label) g += `<text x="${X(p.x) + 7}" y="${Y(p.y) - 6}" font-size="12" font-weight="bold" fill="${p.kleur || '#e8772e'}">${p.label}</text>`;
  }
  const w = B + 2 * m, hh = H + 2 * m;
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif">
    <defs><marker id="gp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f2733"/></marker></defs>${g}</svg></div>`;
}
const parabool = (a, h, k) => (x) => a * (x - h) ** 2 + k;
const STIPPEL_X2 = { f: (x) => x * x, stippel: true, kleur: '#8a94a6' };

// ---- vaste theorieblokken
const INTYPEN = `<div class="kader"><div class="kader-titel">Zo typ je een voorschrift</div>
  <ul><li>Typ enkel het rechterlid, bv. <code>2(x - 1)^2 + 5</code> of met de knop: <code>2(x - 1)² + 5</code>.</li>
  <li>Een breuk typ je met <code>/</code>: <code>1/2 x² + 3</code>. Een wortel: <code>√(x - 3)</code>, en $\\frac{1}{x+2}$ typ je als <code>1/(x + 2)</code>.</li>
  <li>Onder het vakje zie je hoe je voorschrift gelezen wordt. Kijk dat na!</li></ul></div>`;

// ===================================================================
//  A · TRANSFORMATIES
// ===================================================================

const K_WAARDEN = [1, 2, 3, 4, 5, 6, 7, 0.5, 1.5, 2.5];
const kTeken = () => kies(K_WAARDEN) * kies([1, -1]);
const kVorm = (k) => getalTekst(k);

// ---- 1. verticale verschuiving
const D1 = {
  nr: 1, titel: 'Verticale verschuiving: f(x) + k', kort: 'De grafiek schuift k eenheden omhoog (k > 0) of omlaag (k < 0).', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Verticale verschuiving</div>
      <p><b>Regel:</b> de grafiek van $f(x) + k$ is de grafiek van $f$, <b>verticaal verschoven</b> over $k$ eenheden: <b>omhoog</b> als $k > 0$, <b>omlaag</b> als $k < 0$.</p>
      <p>Dit heet een verticale verschuiving of translatie. Ze geldt niet enkel bij tweedegraadsfuncties: ze geldt voor <b>elke</b> functie.</p>
      ${graf([STIPPEL_X2, { f: (x) => x * x + 2, label: [1.6, 6.2, 'x² + 2'] }, { f: (x) => x * x - 3, kleur: '#e8772e', label: [2.3, 1.2, 'x² − 3'] }])}
      <p class="klein midden">Gestreept: $f(x) = x^2$ · blauw: $x^2 + 2$ (2 omhoog) · oranje: $x^2 - 3$ (3 omlaag)</p></div>
    <div class="kader werk"><div class="kader-titel">Ook bij andere functies</div>
      <p>Concreet voorschrift na 2 eenheden omhoog: $x^2 + 2$, &nbsp; $\\dfrac{1}{x} + 2$, &nbsp; $\\sqrt{x} + 2$, &nbsp; $x^3 + 2$.</p>
      <p class="klein">Bij $f(x) = \\frac{1}{x}$ schuift ook de horizontale asymptoot mee: van $y = 0$ naar $y = k$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = x^2 \\text{ schuift 3 eenheden omhoog}', stappen: ['k = 3', 'g(x) = x^2 + 3'] },
    { tex: 'g(x) = x^2 - 7', stappen: ['k = -7 < 0', '\\text{7 eenheden omlaag}'] },
    { tex: 'f(x) = \\sqrt{x} \\text{ schuift 2 eenheden omlaag}', stappen: ['g(x) = \\sqrt{x} - 2'] },
  ],
  soorten: {
    voorschrift: { naam: 'Van beschrijving naar voorschrift', gen() {
      const k = kTeken();
      return { soort: 'voorschrift', opdracht: 'De grafiek van f(x) = x² wordt verschoven. Geef het voorschrift van g.', tex: `\\text{${eenheden(k)} ${k > 0 ? 'omhoog' : 'omlaag'}}`,
        antw: fAntw(`x^2+${k}`, `x^2${plusK(k)}`), uitleg: [`k = ${tg(k)}`, `g(x) = x^2${plusK(k)}`] };
    } },
    beschrijf: { naam: 'Van voorschrift naar beschrijving', gen() {
      const k = kTeken(), a = eenheden(k);
      return { soort: 'beschrijf', opdracht: 'Hoe krijg je de grafiek van g uit de grafiek van f(x) = x²?', tex: `g(x) = x^2${plusK(k)}`,
        antw: tekstKeuze(`${a} ${k > 0 ? 'omhoog' : 'omlaag'}`, [`${a} ${k > 0 ? 'omlaag' : 'omhoog'}`, `${a} naar rechts`, `${a} naar links`]),
        uitleg: [`k = ${tg(k)} ${k > 0 ? '> 0' : '< 0'}`, `\\text{${a} ${k > 0 ? 'omhoog' : 'omlaag'}}`] };
    } },
    tabel: { naam: 'Functiewaarden', gen() {
      const k = nz(-4, 4), xs = schud([-2, -1, 0, 1, 2]).slice(0, 3).sort((p, q) => p - q);
      return { soort: 'tabel', opdracht: 'Bereken de functiewaarden.', tex: `g(x) = x^2${plusK(k)}`,
        antw: { soort: 'delen', delen: xs.map(x => ({ label: `g(${tg(x)}) =`, antw: getal(x * x + k) })) },
        uitleg: xs.map(x => `g(${tg(x)}) = ${h_(x)}^2${plusK(k)} = ${tg(x * x + k)}`) };
    } },
    andere: { naam: 'Andere functies', gen() {
      const b = kies(['x3', 'wortel', 'inv']), B = BASIS[b], k = nz(-5, 5);
      return { soort: 'andere', opdracht: 'Geef het voorschrift van de verschoven functie.', tex: `f(x) = ${B.tex} \\text{ — ${eenheden(k)} ${k > 0 ? 'omhoog' : 'omlaag'}}`,
        antw: fAntw(`${B.expr('x')}+${k}`, `${B.tex}${plusK(k)}`), uitleg: [`g(x) = f(x)${plusK(k)} = ${B.tex}${plusK(k)}`] };
    } },
    grafiek: { naam: 'Voorschrift uit de grafiek', gen() {
      const k = nz(-5, 5);
      return { soort: 'grafiek', opdracht: 'De gestreepte grafiek is die van f(x) = x². Geef het voorschrift van de volle grafiek.', html: graf([STIPPEL_X2, { f: (x) => x * x + k }], [{ x: 0, y: k, label: `(0, ${getalTekst(k)})` }]),
        sleutel: 'gv' + k, rapport: `x² verschoven over ${k}`, antw: fAntw(`x^2+${k}`, `x^2${plusK(k)}`), uitleg: [`\\text{de top gaat van } (0, 0) \\text{ naar } (0, ${tg(k)})`, `g(x) = x^2${plusK(k)}`] };
    } },
  },
  oefenMix: [['voorschrift', 2], ['beschrijf', 2], ['tabel', 1], ['andere', 2], ['grafiek', 1]],
  test: [['voorschrift', 2], ['beschrijf', 2], ['tabel', 2], ['andere', 2], ['grafiek', 2]], testSchudden: true,
};

// ---- 2. horizontale verschuiving
const D2 = {
  nr: 2, titel: 'Horizontale verschuiving: f(x − h)', kort: 'De grafiek schuift h eenheden naar rechts (h > 0) of naar links (h < 0).', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Horizontale verschuiving</div>
      <p><b>Regel:</b> de grafiek van $f(x - h)$ is de grafiek van $f$, <b>horizontaal verschoven</b> over $h$ eenheden: <b>naar rechts</b> als $h > 0$, <b>naar links</b> als $h < 0$.</p>
      ${graf([STIPPEL_X2, { f: (x) => (x - 2) ** 2, label: [3.3, 5, '(x − 2)²'] }, { f: (x) => (x + 3) ** 2, kleur: '#e8772e', label: [-5.8, 5, '(x + 3)²'] }])}
      <p class="klein midden">Gestreept: $f(x) = x^2$ · blauw: $(x - 2)^2$ (2 naar rechts) · oranje: $(x + 3)^2$ (3 naar links)</p></div>
    <div class="kader eig"><div class="kader-titel">Veelgemaakte fout</div>
      <p>$f(x - 2)$ verschuift de grafiek naar <b>rechts</b>, niet naar links! Controleer met een punt: $x^2$ is nul in $x = 0$; $(x - 2)^2$ is nul waar $x - 2 = 0$, dus in $x = 2$: rechts van $0$.</p>
      <p>$f(x + 2) = f(x - (-2))$: dus $h = -2$, verschuiving naar <b>links</b>.</p></div>
    <div class="kader werk"><div class="kader-titel">Ook bij andere functies</div>
      <p>Na 2 eenheden naar rechts: $(x - 2)^2$, &nbsp; $\\dfrac{1}{x - 2}$, &nbsp; $\\sqrt{x - 2}$, &nbsp; $(x - 2)^3$.</p>
      <p class="klein">Bij $\\frac{1}{x}$ schuift de verticale asymptoot mee naar $x = h$; bij $\\sqrt{x}$ schuift het domein mee naar $[h, +\\infty[$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = x^2 \\text{ schuift 4 eenheden naar rechts}', stappen: ['h = 4', 'g(x) = (x - 4)^2'] },
    { tex: 'g(x) = (x + 7)^2', stappen: ['(x + 7)^2 = (x - (-7))^2 \\Rightarrow h = -7', '\\text{7 eenheden naar links}'] },
    { tex: 'f(x) = \\sqrt{x} \\text{ schuift 3 eenheden naar rechts}', stappen: ['g(x) = \\sqrt{x - 3}'] },
  ],
  soorten: {
    voorschrift: { naam: 'Van beschrijving naar voorschrift', gen() {
      const h = nz(-7, 7);
      return { soort: 'voorschrift', opdracht: 'De grafiek van f(x) = x² wordt verschoven. Geef het voorschrift van g.', tex: `\\text{${eenheden(h)} naar ${h > 0 ? 'rechts' : 'links'}}`,
        antw: fAntw(`(x-(${h}))^2`, `(${xMin(h)})^2`), uitleg: [`h = ${tg(h)}`, `g(x) = (x - ${h_(h)})^2 = (${xMin(h)})^2`] };
    } },
    beschrijf: { naam: 'Van voorschrift naar beschrijving', gen() {
      const h = kies([...K_WAARDEN.slice(0, 7), 0.5]) * kies([1, -1]), a = eenheden(h);
      return { soort: 'beschrijf', opdracht: 'Hoe krijg je de grafiek van g uit de grafiek van f(x) = x²?', tex: `g(x) = (${xMin(h)})^2`,
        antw: tekstKeuze(`${a} naar ${h > 0 ? 'rechts' : 'links'}`, [`${a} naar ${h > 0 ? 'links' : 'rechts'}`, `${a} omhoog`, `${a} omlaag`]),
        uitleg: [h > 0 ? `h = ${tg(h)} > 0` : `(${xMin(h)})^2 = (x - (${tg(h)}))^2 \\Rightarrow h = ${tg(h)} < 0`, `\\text{${a} naar ${h > 0 ? 'rechts' : 'links'}}`] };
    } },
    tabel: { naam: 'Functiewaarden', gen() {
      const h = nz(-3, 3), xs = schud([-2, -1, 0, 1, 2]).slice(0, 3).sort((p, q) => p - q);
      return { soort: 'tabel', opdracht: 'Bereken de functiewaarden.', tex: `g(x) = (${xMin(h)})^2`,
        antw: { soort: 'delen', delen: xs.map(x => ({ label: `g(${tg(x)}) =`, antw: getal((x - h) ** 2) })) },
        uitleg: xs.map(x => `g(${tg(x)}) = (${tg(x)} ${h > 0 ? '-' : '+'} ${Math.abs(h)})^2 = ${h_(x - h)}^2 = ${tg((x - h) ** 2)}`) };
    } },
    andere: { naam: 'Andere functies', gen() {
      const b = kies(['x3', 'wortel', 'inv']), B = BASIS[b], h = nz(-5, 5);
      return { soort: 'andere', opdracht: 'Geef het voorschrift van de verschoven functie.', tex: `f(x) = ${B.tex} \\text{ — ${eenheden(h)} naar ${h > 0 ? 'rechts' : 'links'}}`,
        antw: fAntw(B.expr(`x-(${h})`), B.texIn(xMin(h))), uitleg: [`h = ${tg(h)}`, `g(x) = f(${xMin(h)}) = ${B.texIn(xMin(h))}`] };
    } },
    grafiek: { naam: 'Voorschrift uit de grafiek', gen() {
      const h = nz(-4, 4);
      return { soort: 'grafiek', opdracht: 'De gestreepte grafiek is die van f(x) = x². Geef het voorschrift van de volle grafiek.', html: graf([STIPPEL_X2, { f: (x) => (x - h) ** 2 }], [{ x: h, y: 0, label: `(${h}, 0)` }]),
        sleutel: 'gh' + h, rapport: `x² verschoven over ${h} horizontaal`, antw: fAntw(`(x-(${h}))^2`, `(${xMin(h)})^2`), uitleg: [`\\text{de top gaat van } (0, 0) \\text{ naar } (${tg(h)}, 0) \\Rightarrow h = ${tg(h)}`, `g(x) = (${xMin(h)})^2`] };
    } },
  },
  oefenMix: [['voorschrift', 2], ['beschrijf', 2], ['tabel', 1], ['andere', 2], ['grafiek', 1]],
  test: [['voorschrift', 2], ['beschrijf', 2], ['tabel', 2], ['andere', 2], ['grafiek', 2]], testSchudden: true,
};

// ---- 3. verticale rek, krimp en spiegeling
const A_WAARDEN = [Q(2), Q(3), Q(4), Q(5), Q(1, 2), Q(1, 3), Q(1, 4), Q(3, 2)];
const aMet = () => { const a = kies(A_WAARDEN); return kies([true, false]) ? a : Q(-a.t, a.n); };
const aTex = (a) => a.n === 1 && Math.abs(a.t) === 1 ? (a.t < 0 ? '-' : '') : qTex(a);
const aTekst = (a) => a.n === 1 ? String(Math.abs(a.t)) : `${Math.abs(a.t)}/${a.n}`;
function rekTekst(a) {
  const ab = Math.abs(a.v);
  return ab > 1 ? 'smaller (rek)' : ab < 1 ? 'breder (krimp)' : 'even breed';
}
const D3 = {
  nr: 3, titel: 'Verticale rek, krimp en spiegeling: k · f(x)', kort: 'k > 1 smaller, 0 < k < 1 breder, k < 0 ook gespiegeld.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Rek, krimp en spiegeling</div>
      <table class="tabel"><tr><th>getal $k$</th><th>effect op de grootte</th><th>effect op de grafiek</th></tr>
      <tr><td>$k > 1$</td><td>smaller (verticale <b>rek</b>)</td><td>zelfde kant</td></tr>
      <tr><td>$0 < k < 1$</td><td>breder (verticale <b>krimp</b>)</td><td>zelfde kant</td></tr>
      <tr><td>$k < 0$</td><td>rek of krimp volgens $|k|$</td><td><b>spiegeling</b> t.o.v. de $x$-as</td></tr></table>
      ${graf([STIPPEL_X2, { f: (x) => 2 * x * x, label: [1.9, 7.4, '2x²'] }, { f: (x) => -x * x, kleur: '#e8772e', label: [2.4, -4.5, '−x²'] }, { f: (x) => 0.5 * x * x, kleur: '#2e7d4f', label: [4.2, 6.2, '0,5x²'] }])}
      <p class="klein midden">Gestreept: $x^2$ · blauw: $2x^2$ (rek) · groen: $0{,}5x^2$ (krimp) · oranje: $-x^2$ (spiegeling)</p></div>
    <div class="kader werk"><div class="kader-titel">Ook bij andere functies</div>
      <p>$2 \\cdot f(x)$: &nbsp; $2x^2$, &nbsp; $\\dfrac{2}{x}$, &nbsp; $2\\sqrt{x}$, &nbsp; $2x^3$. &nbsp;&nbsp; $-f(x)$: &nbsp; $-x^2$, &nbsp; $-\\dfrac{1}{x}$, &nbsp; $-\\sqrt{x}$, &nbsp; $-x^3$.</p>
      <p class="klein">Hoe groter $|k|$, hoe smaller de grafiek. Elke functiewaarde wordt met $k$ vermenigvuldigd.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'g(x) = 4x^2', stappen: ['k = 4 > 1', '\\text{smaller (rek), niet gespiegeld}'] },
    { tex: 'g(x) = -\\frac{1}{4}x^2', stappen: ['k = -\\frac{1}{4} < 0 \\text{ en } |k| = \\frac{1}{4} < 1', '\\text{breder (krimp) en gespiegeld t.o.v. de } x\\text{-as}'] },
    { tex: 'f(x) = \\sqrt{x} \\text{ en } k = 2', stappen: ['k \\cdot f(x) = 2\\sqrt{x}'] },
  ],
  soorten: {
    vergelijk: { naam: 'Smaller, breder, gespiegeld?', gen() {
      const a = kies([...A_WAARDEN, Q(1)]); const s = kies([1, -1]); const aa = Q(s * a.t, a.n);
      if (aa.v === 1) return D3.soorten.vergelijk.gen();
      const r = rekTekst(aa);
      return { soort: 'vergelijk', opdracht: 'Vergelijk de grafiek van g met die van f(x) = x².', tex: `g(x) = ${aTex(aa)}x^2`,
        antw: { soort: 'delen', delen: [
          { label: '\\text{grootte:}', antw: { soort: 'keuze', opties: kz(['smaller (rek)', 'breder (krimp)', 'even breed']), juist: String(['smaller (rek)', 'breder (krimp)', 'even breed'].indexOf(r)) } },
          { label: '\\text{gespiegeld t.o.v. de } x\\text{-as?}', antw: { soort: 'keuze', opties: kz(['ja', 'nee']), juist: aa.v < 0 ? '0' : '1' } }] },
        uitleg: [`k = ${qTex(aa)}, \\; |k| = ${qTex(Q(Math.abs(aa.t), aa.n))} ${Math.abs(aa.v) > 1 ? '> 1' : Math.abs(aa.v) < 1 ? '< 1' : '= 1'}`, `\\text{${r}, ${aa.v < 0 ? 'wel' : 'niet'} gespiegeld}`] };
    } },
    smalst: { naam: 'Smalste of breedste grafiek', gen() {
      const as = schud(A_WAARDEN.concat([Q(1)])).slice(0, 4).map(a => kies([1, 1, -1]) === 1 ? a : Q(-a.t, a.n));
      const smal = kies([true, false]), abs = as.map(a => Math.abs(a.v));
      if (new Set(abs).size < 4) return D3.soorten.smalst.gen();
      const j = abs.indexOf(smal ? Math.max(...abs) : Math.min(...abs));
      return { soort: 'smalst', opdracht: `Welke grafiek is het ${smal ? 'smalst' : 'breedst'}?`, tex: as.map((a, i) => `${'fghk'[i]}(x) = ${aTex(a)}x^2`).join(' \\qquad '),
        antw: { soort: 'keuze', opties: as.map((a, i) => ({ k: String(i), l: `${'fghk'[i]}` })), juist: String(j) },
        uitleg: [`\\text{vergelijk } |k|: \\; ${as.map((a, i) => `${'fghk'[i]}: ${qTex(Q(Math.abs(a.t), a.n))}`).join(', \\;')}`, `\\text{${smal ? 'grootste' : 'kleinste'} } |k| \\Rightarrow ${'fghk'[j]} \\text{ is het ${smal ? 'smalst' : 'breedst'}}`] };
    } },
    tabel: { naam: 'Functiewaarden', gen() {
      const a = kies([Q(2), Q(3), Q(-2), Q(-1), Q(1, 2), Q(-1, 2)]), xs = schud([-2, -1, 1, 2]).slice(0, 3).sort((p, q) => p - q);
      return { soort: 'tabel', opdracht: 'Bereken de functiewaarden.', tex: `g(x) = ${aTex(a)}x^2`,
        antw: { soort: 'delen', delen: xs.map(x => ({ label: `g(${tg(x)}) =`, antw: getal(a.v * x * x) })) },
        uitleg: xs.map(x => `g(${tg(x)}) = ${qTex(a)} \\cdot ${h_(x)}^2 = ${tg(a.v * x * x)}`) };
    } },
    andere: { naam: 'Andere functies', gen() {
      const b = kies(['x3', 'wortel', 'inv']), B = BASIS[b], a = kies([Q(2), Q(3), Q(-1), Q(-2), Q(1, 2), Q(-1, 3)]);
      const texJ = b === 'inv' && a.n === 1 ? (a.t < 0 ? `-\\dfrac{${-a.t}}{x}` : `\\dfrac{${a.t}}{x}`) : `${aTex(a)}${B.tex}`;
      return { soort: 'andere', opdracht: 'Geef het voorschrift van k · f(x).', tex: `f(x) = ${B.tex} \\text{ en } k = ${qTex(a)}`,
        antw: fAntw(`${qStr(a)}*${B.expr('x')}`, texJ), uitleg: [`k \\cdot f(x) = ${texJ}`] };
    } },
    grafiek: { naam: 'Welk voorschrift hoort bij de grafiek?', gen() {
      const opties = [Q(3), Q(-3), Q(1, 2), Q(-1, 2), Q(2), Q(-2)], a = kies(opties);
      const kandidaten = schud(opties.filter(x => x !== a)).slice(0, 3).concat([a]);
      const ks = schud(kandidaten);
      return { soort: 'grafiek', opdracht: 'De gestreepte grafiek is die van f(x) = x². Welk voorschrift hoort bij de volle grafiek? Gebruik het aangeduide punt.',
        html: graf([STIPPEL_X2, { f: (x) => a.v * x * x }], [{ x: 2, y: a.v * 4, label: `(2, ${getalTekst(a.v * 4)})` }], { y: [-8, 8] }),
        sleutel: 'gr' + a.v, rapport: `grafiek van ${a.v}x²`,
        antw: { soort: 'keuze', opties: ks.map((q, i) => ({ k: String(i), l: `${aTex(q)}x^2` })), juist: String(ks.indexOf(a)) },
        uitleg: [`\\text{in } x = 2 \\text{ is } x^2 = 4 \\text{ en } g(2) = ${tg(a.v * 4)}`, `k = ${tg(a.v * 4)} : 4 = ${qTex(a)} \\Rightarrow g(x) = ${aTex(a)}x^2`] };
    } },
  },
  oefenMix: [['vergelijk', 3], ['smalst', 1], ['tabel', 1], ['andere', 2], ['grafiek', 2]],
  test: [['vergelijk', 3], ['smalst', 1], ['tabel', 2], ['andere', 2], ['grafiek', 2]], testSchudden: true,
};

// ===================================================================
//  B · DE TOPVORM
// ===================================================================

const rq = () => Q(nz(-6, 6));
const aKlein = () => kies([Q(1), Q(-1), Q(2), Q(-2), Q(3), Q(-3), Q(1, 2), Q(-1, 2), Q(4), Q(-4)]);
const D4 = {
  nr: 4, titel: 'De topvorm a(x − h)² + k', kort: 'Top (h, k) aflezen, dal- of bergparabool, transformaties combineren.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Topvorm</div>
      <p>Pas je op $f(x) = x^2$ een rek/krimp/spiegeling ($a$), een horizontale ($h$) en een verticale ($k$) verschuiving toe, dan krijg je de <b>topvorm</b>:</p>
      <p class="midden">$f(x) = a(x - h)^2 + k \\quad \\text{met } a \\neq 0$</p>
      <p>De <b>top</b> van de parabool is het punt $(h, k)$.</p>
      <ul><li>$a > 0$: <b>dalparabool</b> (minimum in de top)</li><li>$a < 0$: <b>bergparabool</b> (maximum in de top)</li></ul>
      <p>Volgorde: eerst de horizontale verschuiving ($h$), daarna rek/krimp/spiegeling ($a$), tot slot de verticale verschuiving ($k$).</p></div>
    <div class="kader eig"><div class="kader-titel">Let op het teken vóór h</div>
      <p>Bij $f(x) = (x - 3)^2 + 2$ is $h = 3$ (niet $-3$): top $(3, 2)$. Bij $f(x) = (x + 3)^2$ is $h = -3$: top $(-3, 0)$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$f(x) = (x - 3)^2 + 2$: top $(3, 2)$, $a = 1 > 0$: dalparabool.</p>
      ${graf([STIPPEL_X2, { f: parabool(1, 3, 2) }], [{ x: 3, y: 2, label: 'top (3, 2)' }])}</div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = -2(x + 5)^2 - 3', stappen: ['h = -5, \\; k = -3 \\Rightarrow \\text{top } (-5, -3)', 'a = -2 < 0 \\Rightarrow \\text{bergparabool}'] },
    { tex: '\\text{spiegeling, rek met factor 3, daarna 6 naar rechts en 4 omlaag}', stappen: ['a = -3, \\; h = 6, \\; k = -4', 'f(x) = -3(x - 6)^2 - 4'] },
    { tex: 'g(x) = 0{,}5(x + 3)^2', stappen: ['a = 0{,}5: \\text{ verticale krimp}', 'h = -3: \\text{ 3 eenheden naar links (geen verticale verschuiving)}'] },
  ],
  soorten: {
    top: { naam: 'Top aflezen, dal of berg', gen() {
      const a = aKlein(), h = Q(nz(-7, 7) * kies([1, 1, 1, 0])), k = Q(nz(-7, 7) * kies([1, 1, 1, 0]));
      return { soort: 'top', opdracht: 'Lees de top af en zeg of het een dalparabool of een bergparabool is.', tex: topTex(a, h, k),
        antw: { soort: 'delen', delen: [{ label: '\\text{top: } x =', antw: qGetal(h) }, { label: 'y =', antw: qGetal(k) },
          { label: '\\text{soort:}', antw: { soort: 'keuze', opties: kz(['dalparabool', 'bergparabool']), juist: a.v > 0 ? '0' : '1' } }] },
        uitleg: [`h = ${qTex(h)}, \\; k = ${qTex(k)} \\Rightarrow \\text{top } (${qTex(h)}, ${qTex(k)})`, `a = ${qTex(a)} ${a.v > 0 ? '> 0 \\Rightarrow \\text{dalparabool}' : '< 0 \\Rightarrow \\text{bergparabool}'}`] };
    } },
    naarTop: { naam: 'Van transformaties naar topvorm', gen() {
      const a = kies([Q(1), Q(1), Q(-1), Q(2), Q(-2), Q(3), Q(-3), Q(1, 2)]), h = Q(nz(-6, 6)), k = Q(nz(-6, 6) * kies([1, 1, 0]));
      const delen = [];
      if (a.v < 0) delen.push('spiegeling t.o.v. de x-as');
      if (Math.abs(a.v) !== 1) delen.push(`verticale ${Math.abs(a.v) > 1 ? 'rek' : 'krimp'} met factor ${aTekst(a)}`);
      const sch = [`${eenheden(h.v)} naar ${h.v > 0 ? 'rechts' : 'links'}`]; if (k.v) sch.push(`${eenheden(k.v)} ${k.v > 0 ? 'omhoog' : 'omlaag'}`);
      const tekst = (delen.length ? delen.join(' en ') + ', daarna ' : '') + sch.join(' en ');
      return { soort: 'naarTop', opdracht: 'Vertrek van f(x) = x². Schrijf de topvorm van de functie na deze transformaties.', tex: `\\text{${tekst}}`,
        antw: topAntw(a, h, k, 'g'), uitleg: [`a = ${qTex(a)}, \\; h = ${qTex(h)}, \\; k = ${qTex(k)}`, topTex(a, h, k, 'g')] };
    } },
    beschrijf: { naam: 'Van topvorm naar transformaties', gen() {
      const a = kies([Q(1), Q(-1), Q(2), Q(-2), Q(3), Q(1, 2), Q(-1, 2)]), h = Q(nz(-6, 6)), k = Q(nz(-6, 6));
      const ra = a.v < 0 ? (Math.abs(a.v) === 1 ? 'spiegeling t.o.v. de x-as, ' : `${Math.abs(a.v) > 1 ? 'rek' : 'krimp'} met factor ${aTekst(a)} en spiegeling, `) : (a.v === 1 ? '' : `${a.v > 1 ? 'rek' : 'krimp'} met factor ${aTekst(a)}, `);
      const zin = (hh, kk) => `${ra}${eenheden(hh)} naar ${hh > 0 ? 'rechts' : 'links'}, ${eenheden(kk)} ${kk > 0 ? 'omhoog' : 'omlaag'}`;
      return { soort: 'beschrijf', opdracht: 'Welke transformaties pas je toe op f(x) = x² om de grafiek van g te krijgen?', tex: topTex(a, h, k, 'g'),
        antw: tekstKeuze(zin(h.v, k.v), [zin(-h.v, k.v), zin(h.v, -k.v), zin(-h.v, -k.v)]),
        uitleg: [`a = ${qTex(a)}, \\; h = ${qTex(h)}, \\; k = ${qTex(k)}`, `\\text{${zin(h.v, k.v)}}`] };
    } },
  },
  oefenMix: [['top', 3], ['naarTop', 3], ['beschrijf', 2]],
  test: [['top', 4], ['naarTop', 4], ['beschrijf', 2]], testSchudden: true,
};

// ---- kwadraat afsplitsen
function algTex(a, b, c, naam = 'f') {
  const t = [];
  t.push(a === 1 ? 'x^2' : a === -1 ? '-x^2' : `${tg(a)}x^2`);
  if (b) t.push(`${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : tg(Math.abs(b))}x`);
  if (c) t.push(`${c < 0 ? '-' : '+'} ${tg(Math.abs(c))}`);
  return `${naam}(x) = ${t.join(' ')}`;
}
function afsplitsen(a, b, c) {
  // a(x² + (b/a)x) + c = a(x + b/(2a))² − b²/(4a) + c
  const h = Q(-b, 2 * a), k = Q(4 * a * c - b * b, 4 * a), A = Q(a);
  const p = Q(b, a), half = Q(b, 2 * a), sq = Q(b * b, 4 * a * a);
  const ptx = p.v === 0 ? '' : ` ${p.v > 0 ? '+' : '-'} ${qTex(Q(Math.abs(p.t), p.n)) === '1' ? '' : qTex(Q(Math.abs(p.t), p.n))}x`;
  const binnen = `x^2${ptx} + ${qTex(sq)} - ${qTex(sq)}`;
  const L = [];
  if (a === 1) {
    L.push(`= x^2${ptx} + ${qTex(sq)} - ${qTex(sq)}${c ? ` ${c > 0 ? '+' : '-'} ${tg(Math.abs(c))}` : ''} \\quad \\left(\\text{helft van } ${qTex(p)} \\text{ is } ${qTex(half)}\\text{, in het kwadraat: } ${qTex(sq)}\\right)`);
  } else {
    L.push(`= ${a === -1 ? '-' : tg(a)}\\left(x^2${ptx}\\right)${c ? ` ${c > 0 ? '+' : '-'} ${tg(Math.abs(c))}` : ''} \\quad (${tg(a)} \\text{ buiten haakjes})`);
    L.push(`= ${a === -1 ? '-' : tg(a)}\\left(${binnen}\\right)${c ? ` ${c > 0 ? '+' : '-'} ${tg(Math.abs(c))}` : ''}`);
  }
  L.push(`= ${topTex(A, h, k, null)}`);
  L.push(`\\text{top } (${qTex(h)}, ${qTex(k)})`);
  return { h, k, A, L };
}
function afsplitsVraag(a, b, c, soort) {
  const r = afsplitsen(a, b, c);
  return { soort, opdracht: 'Schrijf in topvorm door het kwadraat af te splitsen. Geef daarna de top.', tex: algTex(a, b, c),
    antw: { soort: 'delen', delen: [{ label: 'f(x) =', antw: { ...topAntw(r.A, r.h, r.k), voor: '' } }, { label: '\\text{top: } x =', antw: qGetal(r.h) }, { label: 'y =', antw: qGetal(r.k) }] },
    uitleg: [algTex(a, b, c), ...r.L] };
}
const D5 = {
  nr: 5, titel: 'Kwadraat afsplitsen (a = 1)', kort: 'Van x² + bx + c naar de topvorm (x − h)² + k.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat afsplitsen</div>
      <p>Een tweedegraadsfunctie wordt meestal gegeven in de <b>algemene vorm</b> $f(x) = ax^2 + bx + c$. Om de top af te lezen, herschrijf je ze naar de topvorm.</p>
      <ol><li>Groepeer de termen met $x$ (en haal $a$ buiten haakjes: zie deel 6).</li>
      <li>Vul aan tot een volkomen kwadraat: <b>helft van het getal bij $x$, in het kwadraat</b>. Tel dat erbij en trek het er meteen weer af.</li>
      <li>Herschrijf als $(x - h)^2$ en werk de constante uit tot $k$.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$f(x) = x^2 - 6x + 5 = (x^2 - 6x + 9) - 9 + 5 = (x - 3)^2 - 4$</p>
      <p>Helft van $-6$ is $-3$, in het kwadraat $9$. Top: $(3, -4)$.</p>
      <p class="klein">Controle: de nulwaarden van $x^2 - 6x + 5$ zijn $1$ en $5$; het midden is $3 = h$.</p>
      <p class="klein">Is het getal bij $x$ oneven, dan krijg je breuken: $x^2 + 5x + 1 = \\left(x + \\frac{5}{2}\\right)^2 - \\frac{21}{4}$. Typ <code>(x + 5/2)^2 - 21/4</code>.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = x^2 - 4x + 7', stappen: ['= x^2 - 4x + 4 - 4 + 7', '= (x - 2)^2 + 3', '\\text{top } (2, 3)'] },
    { tex: 'f(x) = x^2 + 6x', stappen: ['= x^2 + 6x + 9 - 9', '= (x + 3)^2 - 9', '\\text{top } (-3, -9)'] },
    { tex: 'f(x) = x^2 - 3x + 4', stappen: ['= x^2 - 3x + \\frac{9}{4} - \\frac{9}{4} + 4', '= \\left(x - \\frac{3}{2}\\right)^2 + \\frac{7}{4}', '\\text{top } \\left(\\frac{3}{2}, \\frac{7}{4}\\right)'] },
  ],
  soorten: {
    even: { naam: 'Even getal bij x', gen() { const b = 2 * nz(-6, 6), c = rnd(-12, 15); return afsplitsVraag(1, b, c, 'even'); } },
    zonderC: { naam: 'Zonder constante', gen() { const b = 2 * nz(-6, 6); return afsplitsVraag(1, b, 0, 'zonderC'); } },
    oneven: { naam: 'Oneven getal bij x (breuken)', gen() { const b = kies([1, 3, 5, 7]) * kies([1, -1]), c = rnd(-6, 8); return afsplitsVraag(1, b, c, 'oneven'); } },
  },
  oefenMix: [['even', 4], ['zonderC', 1], ['oneven', 2]],
  test: [['even', 6], ['zonderC', 2], ['oneven', 2]], testSchudden: true,
};
const D6 = {
  nr: 6, titel: 'Kwadraat afsplitsen (a ≠ 1)', kort: 'Eerst a buiten haakjes, dan aanvullen tot een volkomen kwadraat.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat afsplitsen met a ≠ 1</div>
      <ol><li>Haal $a$ buiten haakjes bij de $x^2$- en de $x$-term.</li>
      <li>Vul binnen de haakjes aan tot een volkomen kwadraat en trek er net zoveel weer af.</li>
      <li>Werk de haakjes uit: wat je aftrok, wordt <b>vermenigvuldigd met $a$</b> als het buiten de haakjes komt.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$2x^2 - 8x + 3 = 2(x^2 - 4x + 4 - 4) + 3 = 2(x - 2)^2 - 8 + 3 = 2(x - 2)^2 - 5$</p>
      <p class="midden">$-x^2 + 6x - 4 = -(x^2 - 6x + 9 - 9) - 4 = -(x - 3)^2 + 9 - 4 = -(x - 3)^2 + 5$</p>
      <p class="let-op">Let op bij een negatieve $a$: $-(\\ldots - 9)$ wordt $+9$ buiten de haakjes.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = 3x^2 + 12x + 5', stappen: ['= 3(x^2 + 4x + 4 - 4) + 5', '= 3(x + 2)^2 - 12 + 5', '= 3(x + 2)^2 - 7 \\quad \\text{top } (-2, -7)'] },
    { tex: 'f(x) = -2x^2 - 4x + 1', stappen: ['= -2(x^2 + 2x + 1 - 1) + 1', '= -2(x + 1)^2 + 2 + 1', '= -2(x + 1)^2 + 3 \\quad \\text{top } (-1, 3)'] },
    { tex: 'f(x) = 2x^2 + 6x + 1', stappen: ['= 2\\left(x^2 + 3x + \\frac{9}{4} - \\frac{9}{4}\\right) + 1', '= 2\\left(x + \\frac{3}{2}\\right)^2 - \\frac{9}{2} + 1', '= 2\\left(x + \\frac{3}{2}\\right)^2 - \\frac{7}{2} \\quad \\text{top } \\left(-\\frac{3}{2}, -\\frac{7}{2}\\right)'] },
  ],
  soorten: {
    positief: { naam: 'a > 1', gen() { const a = kies([2, 3, 4]), b = 2 * a * nz(-4, 4), c = rnd(-10, 12); return afsplitsVraag(a, b, c, 'positief'); } },
    negatief: { naam: 'a < 0', gen() { const a = kies([-1, -1, -2, -3]), b = 2 * a * nz(-4, 4), c = rnd(-10, 12); return afsplitsVraag(a, b, c, 'negatief'); } },
    breuk: { naam: 'Met breuken', gen() { const a = kies([2, -2]), b = a * kies([1, 3, 5]) * kies([1, -1]), c = rnd(-5, 6); return afsplitsVraag(a, b, c, 'breuk'); } },
  },
  oefenMix: [['positief', 3], ['negatief', 3], ['breuk', 1]],
  test: [['positief', 4], ['negatief', 4], ['breuk', 2]], testSchudden: true,
};

// ---- voorschrift uit top + punt
function topPuntVraag(soort, metGrafiek) {
  for (;;) {
    const a = kies([Q(1), Q(-1), Q(2), Q(-2), Q(3), Q(-3), Q(1, 2), Q(-1, 2), Q(1, 4), Q(2, 3)]), h = rnd(-4, 4), k = rnd(-5, 5), d = nz(-3, 3);
    const px = h + d, py = a.v * d * d + k;
    if (!Number.isInteger(py) || Math.abs(py) > (metGrafiek ? 7 : 20) || (metGrafiek && Math.abs(px) > 5)) continue;
    const H = Q(h), K = Q(k);
    const kT = k ? ` ${k < 0 ? '-' : '+'} ${tg(Math.abs(k))}` : '';
    const L = [`f(x) = a(x - ${h_(h)})^2${kT} \\quad \\text{(top invullen)}`,
      `${tg(py)} = a(${tg(px)} - ${h_(h)})^2${kT} \\quad \\text{(punt } (${tg(px)}, ${tg(py)}) \\text{ invullen)}`,
      k ? `${tg(py)} = ${d * d}a${kT} \\Leftrightarrow ${d * d}a = ${tg(py - k)} \\Leftrightarrow a = ${qTex(a)}` : `${tg(py)} = ${d * d}a \\Leftrightarrow a = ${qTex(a)}`, topTex(a, H, K)];
    const v = { soort, antw: topAntw(a, H, K), uitleg: L };
    if (!metGrafiek) return { ...v, opdracht: 'Bepaal het voorschrift van de parabool met de gegeven top die door het gegeven punt gaat.', tex: `\\text{top } (${tg(h)}, ${tg(k)}) \\text{ en punt } (${tg(px)}, ${tg(py)})` };
    return { ...v, opdracht: 'Bepaal het voorschrift van de parabool. De top en één ander punt zijn aangeduid.', sleutel: `g${a.v},${h},${k},${d}`, rapport: `top (${h}, ${k}), punt (${px}, ${py})`,
      html: graf([{ f: parabool(a.v, h, k) }], [{ x: h, y: k, label: `top (${h}, ${k})` }, { x: px, y: py, label: `(${px}, ${py})`, kleur: '#2e7d4f' }], { y: [-8, 8] }) };
  }
}
const D7 = {
  nr: 7, titel: 'Het voorschrift bepalen vanuit de grafiek', kort: 'Top invullen, één punt invullen, oplossen naar a.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Voorschrift uit de top en één punt</div>
      <p>Ken je de top $(h, k)$ én de coördinaten van <b>één ander punt</b> van de parabool, dan bepaal je het voorschrift zo:</p>
      <ol><li>Vul de top in de topvorm in: $f(x) = a(x - h)^2 + k$.</li><li>Vul het gekende punt in ($x$ en $f(x)$).</li><li>Los op naar $a$.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>Top $(2, -1)$, de grafiek gaat door $(0, 3)$:</p>
      <p class="midden">$f(x) = a(x - 2)^2 - 1$ &nbsp;⇒&nbsp; $3 = a(0 - 2)^2 - 1 \\Leftrightarrow 3 = 4a - 1 \\Leftrightarrow 4a = 4 \\Leftrightarrow a = 1$</p>
      <p class="midden">$f(x) = (x - 2)^2 - 1$</p>
      ${graf([{ f: parabool(1, 2, -1) }], [{ x: 2, y: -1, label: 'top (2, −1)' }, { x: 0, y: 3, label: '(0, 3)', kleur: '#2e7d4f' }])}</div>${INTYPEN}`,
  voorbeelden: [
    { tex: '\\text{top } (1, -2) \\text{ en punt } (3, 6)', stappen: ['f(x) = a(x - 1)^2 - 2', '6 = a(3 - 1)^2 - 2 \\Leftrightarrow 4a = 8 \\Leftrightarrow a = 2', 'f(x) = 2(x - 1)^2 - 2'] },
    { tex: '\\text{top } (0, 3) \\text{ en punt } (2, 4)', stappen: ['f(x) = a(x - 0)^2 + 3 = ax^2 + 3', '4 = 4a + 3 \\Leftrightarrow a = \\frac{1}{4}', 'f(x) = \\frac{1}{4}x^2 + 3'] },
  ],
  soorten: {
    tekst: { naam: 'Top en punt gegeven', gen() { return topPuntVraag('tekst', false); } },
    grafiek: { naam: 'Top en punt op de grafiek', gen() { return topPuntVraag('grafiek', true); } },
  },
  oefenMix: [['tekst', 3], ['grafiek', 3]],
  test: [['tekst', 5], ['grafiek', 5]], testSchudden: true,
};

// ===================================================================
//  C · KENMERKEN
// ===================================================================

// parabool met "mooie" nulwaarden: kies a, h en het aantal nulwaarden
function maakParabool(soortNul) {
  const a = kies([1, 1, -1, -1, 2, -2, 3, -3]), h = rnd(-5, 5);
  let k, d;
  const n = soortNul ?? kies([2, 2, 2, 1, 0]);
  if (n === 2) { d = rnd(1, 4); k = -a * d * d; }
  else if (n === 1) { d = 0; k = 0; }
  else { k = a * rnd(1, 6); d = null; }
  return { a, h, k, n, nul: n === 2 ? [h - d, h + d] : n === 1 ? [h] : [] };
}
const pTex = (p, naam = 'f') => topTex(Q(p.a), Q(p.h), Q(p.k), naam);
const bereikAntw = (p) => p.a > 0 ? { soort: 'interval', voor: '', a: p.k, ai: true, b: null, bi: false } : { soort: 'interval', voor: '', a: null, ai: false, b: p.k, bi: true };
const bereikTex = (p) => p.a > 0 ? `[${tg(p.k)}, +\\infty[` : `]-\\infty, ${tg(p.k)}]`;
const nulAntw = (p) => p.nul.length ? { soort: 'Vmeer', voor: 'V =', waarden: p.nul, dec: 2 } : { soort: 'Vmeer', voor: 'V =', waarden: [], leeg: true };
function nulUitleg(p) {
  const r = -p.k / p.a;
  const L = [`${pTex(p, '').replace(/^\(x\) = /, '')} = 0 \\Leftrightarrow (${xMin(p.h)})^2${p.a === 1 ? '' : ` = \\dfrac{${tg(-p.k)}}{${tg(p.a)}}`} = ${tg(r)}`];
  if (r < 0) L.push('\\text{een kwadraat is nooit negatief: geen nulwaarden}', 'V = \\varnothing');
  else if (r === 0) L.push(`${xMin(p.h)} = 0 \\Leftrightarrow x = ${tg(p.h)} \\quad \\text{(1 nulwaarde)}`);
  else L.push(`${xMin(p.h)} = ${Math.sqrt(r)} \\text{ of } ${xMin(p.h)} = ${-Math.sqrt(r)}`, `x = ${tg(p.nul[1])} \\text{ of } x = ${tg(p.nul[0])} \\quad \\text{(2 nulwaarden)}`);
  return L;
}
const D8 = {
  nr: 8, titel: 'Domein, bereik en nulwaarden', kort: 'Domein ℝ, bereik vanaf/tot k, nulwaarden met de topvorm.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Domein en bereik van f(x) = a(x − h)² + k</div>
      <p><b>Domein:</b> steeds $\\mathbb{R}$, net als bij $f(x) = ax^2$.</p>
      <p><b>Bereik:</b> bij $a > 0$ is $f(x) \\geq k$ voor elke $x$: bereik $= [k, +\\infty[$. Bij $a < 0$ is $f(x) \\leq k$: bereik $= ]-\\infty, k]$.</p></div>
    <div class="kader eig"><div class="kader-titel">Nulwaarden met de topvorm</div>
      <p class="midden">$a(x - h)^2 + k = 0 \\Leftrightarrow (x - h)^2 = \\dfrac{-k}{a}$</p>
      <p>Is $\\frac{-k}{a}$ <b>negatief</b>, <b>nul</b> of <b>positief</b>, dan zijn er <b>0</b>, <b>1</b> of <b>2</b> nulwaarden (zoals $D < 0$, $D = 0$, $D > 0$ uit hoofdstuk 1).</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p>$f(x) = (x - 1)^2 - 9$: $(x - 1)^2 = 9 \\Leftrightarrow x - 1 = 3$ of $x - 1 = -3 \\Leftrightarrow x = 4$ of $x = -2$.</p>
      <p>$f(x) = (x - 2)^2 + 5$: $(x - 2)^2 = -5$ kan niet: geen nulwaarden.</p></div>
    <div class="kader"><div class="kader-titel">Zo vul je in</div><p>Bereik als interval: <code>[-5, +∞[</code> of <code>]-∞, 4]</code> (knoppen ∞ en haakjes). Nulwaarden: <code>-2 ; 4</code>, of de knop ∅ als er geen zijn.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = -0{,}5(x + 4)^2 - 1', stappen: ['\\text{domein } \\mathbb{R}', 'a < 0 \\Rightarrow \\text{bereik } ]-\\infty, -1]'] },
    { tex: 'f(x) = 2(x + 3)^2 - 8', stappen: ['(x + 3)^2 = \\dfrac{8}{2} = 4', 'x + 3 = 2 \\text{ of } x + 3 = -2', 'x = -1 \\text{ of } x = -5'] },
    { tex: 'f(x) = -(x + 4)^2', stappen: ['(x + 4)^2 = 0 \\Leftrightarrow x = -4', '\\text{1 nulwaarde}'] },
  ],
  soorten: {
    bereik: { naam: 'Domein en bereik', gen() {
      const p = { a: kies([1, -1, 2, -2, 3, -0.5, 0.5]), h: nz(-6, 6), k: nz(-8, 8) }; if (p.h === p.k) p.h = p.h > 0 ? -p.h : p.h - 1;
      return { soort: 'bereik', opdracht: 'Geef het domein en het bereik.', tex: topTex(Q(p.a * 2, 2), Q(p.h), Q(p.k)),
        antw: { soort: 'delen', delen: [{ label: '\\text{dom } f =', antw: { soort: 'keuze', opties: [{ k: 'R', l: '\\mathbb{R}' }, { k: 'k', l: `[${tg(p.k)}, +\\infty[` }, { k: 'h', l: `[${tg(p.h)}, +\\infty[` }], juist: 'R' } },
          { label: '\\text{ber } f =', antw: bereikAntw(p) }] },
        uitleg: ['\\text{dom } f = \\mathbb{R}', `a = ${tg(p.a)} ${p.a > 0 ? '> 0' : '< 0'}, \\; k = ${tg(p.k)} \\Rightarrow \\text{ber } f = ${bereikTex(p)}`] };
    } },
    nul2: { naam: 'Nulwaarden (twee)', gen() { const p = maakParabool(2); return { soort: 'nul2', opdracht: 'Bepaal de nulwaarden met behulp van de topvorm.', tex: pTex(p), antw: nulAntw(p), uitleg: nulUitleg(p) }; } },
    nul01: { naam: 'Nulwaarden (geen of één)', gen() { const p = maakParabool(kies([0, 0, 1])); return { soort: 'nul01', opdracht: 'Bepaal de nulwaarden met behulp van de topvorm.', tex: pTex(p), antw: nulAntw(p), uitleg: nulUitleg(p) }; } },
  },
  oefenMix: [['bereik', 3], ['nul2', 3], ['nul01', 2]],
  test: [['bereik', 4], ['nul2', 4], ['nul01', 2]], testSchudden: true,
};

const ogAntw = (a, ai, b, bi) => ({ soort: 'ongelijkheid', voor: '', a, ai, b, bi });
const D9 = {
  nr: 9, titel: 'Tekenverloop, stijgen en dalen, extremum', kort: 'Teken van a buiten de nulwaarden; dalparabool: minimum in de top.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Tekenverloop</div>
      <p>Buiten de nulwaarden heeft $f(x)$ <b>hetzelfde teken als $a$</b>, tussen de nulwaarden het <b>tegengestelde teken</b>.</p>
      <p class="klein">Voorbeeld: $f(x) = (x - 1)^2 - 4$ heeft nulwaarden $-1$ en $3$, $a > 0$: $f(x) > 0$ voor $x < -1$ en $x > 3$, $f(x) < 0$ voor $-1 < x < 3$.</p></div>
    <div class="kader eig"><div class="kader-titel">Stijgen, dalen en extremum</div>
      <table class="tabel"><tr><th></th><th>$a > 0$ (dalparabool)</th><th>$a < 0$ (bergparabool)</th></tr>
      <tr><td>stijgen/dalen</td><td>daalt voor $x < h$, stijgt voor $x > h$</td><td>stijgt voor $x < h$, daalt voor $x > h$</td></tr>
      <tr><td>extremum</td><td><b>minimum</b> in de top $(h, k)$</td><td><b>maximum</b> in de top $(h, k)$</td></tr></table>
      ${graf([{ f: parabool(1, 1, -4) }, { f: parabool(-1, -2, 5), kleur: '#e8772e' }], [{ x: 1, y: -4, label: 'min (1, −4)' }, { x: -2, y: 5, label: 'max (−2, 5)', kleur: '#e8772e' }])}</div>
    <div class="kader"><div class="kader-titel">Zo vul je in</div><p>Typ een ongelijkheid: <code>x &lt; 3</code>, <code>x &gt; -2</code> of <code>-1 &lt; x &lt; 3</code>.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = -(x + 2)^2 + 9', stappen: ['\\text{nulwaarden: } (x + 2)^2 = 9 \\Rightarrow x = -5 \\text{ of } x = 1', 'a < 0: \\; f(x) > 0 \\text{ voor } -5 < x < 1, \\; f(x) < 0 \\text{ voor } x < -5 \\text{ en } x > 1'] },
    { tex: 'f(x) = 4(x + 2)^2 + 1', stappen: ['a > 0 \\Rightarrow \\text{dalparabool}', '\\text{dalend voor } x < -2, \\text{ stijgend voor } x > -2', '\\text{minimum } (-2, 1)'] },
  ],
  soorten: {
    teken: { naam: 'Tekenverloop (twee nulwaarden)', gen() {
      const p = maakParabool(2), [x1, x2] = p.nul, tussen = p.a > 0 ? '<' : '>';
      return { soort: 'teken', opdracht: `Voor welke x is f(x) ${tussen === '<' ? 'negatief' : 'positief'}? Geef een ongelijkheid.`, tex: pTex(p),
        antw: ogAntw(x1, false, x2, false),
        uitleg: [...nulUitleg(p).slice(1), `a = ${tg(p.a)} ${p.a > 0 ? '> 0' : '< 0'}: \\text{ tussen de nulwaarden het tegengestelde teken van } a`, `f(x) ${tussen} 0 \\text{ voor } ${tg(x1)} < x < ${tg(x2)}`] };
    } },
    tekenGeen: { naam: 'Tekenverloop (geen of één nulwaarde)', gen() {
      const p = maakParabool(kies([0, 1])), pos = p.a > 0;
      const opties = ['f(x) > 0 \\text{ voor elke } x', 'f(x) < 0 \\text{ voor elke } x', `f(x) \\geq 0 \\text{ voor elke } x \\; (0 \\text{ in } x = ${tg(p.h)})`, `f(x) \\leq 0 \\text{ voor elke } x \\; (0 \\text{ in } x = ${tg(p.h)})`];
      const juist = p.n === 0 ? (pos ? 0 : 1) : (pos ? 2 : 3);
      return { soort: 'tekenGeen', opdracht: 'Wat is het tekenverloop van f?', tex: pTex(p), antw: { soort: 'keuze', opties: opties.map((l, i) => ({ k: String(i), l })), juist: String(juist) },
        uitleg: [...nulUitleg(p).slice(0, 2), `a = ${tg(p.a)} ${pos ? '> 0' : '< 0'} \\Rightarrow ${opties[juist]}`] };
    } },
    stijgen: { naam: 'Stijgen en dalen', gen() {
      const p = maakParabool(), pos = p.a > 0;
      return { soort: 'stijgen', opdracht: 'Geef waar f stijgt en waar f daalt.', tex: pTex(p),
        antw: { soort: 'delen', delen: [{ label: '\\text{stijgend voor}', antw: pos ? ogAntw(p.h, false, null, false) : ogAntw(null, false, p.h, false) },
          { label: '\\text{dalend voor}', antw: pos ? ogAntw(null, false, p.h, false) : ogAntw(p.h, false, null, false) }] },
        uitleg: [`a = ${tg(p.a)} ${pos ? '> 0 \\Rightarrow \\text{dalparabool}' : '< 0 \\Rightarrow \\text{bergparabool}'}, \\; h = ${tg(p.h)}`, pos ? `\\text{dalend voor } x < ${tg(p.h)}, \\text{ stijgend voor } x > ${tg(p.h)}` : `\\text{stijgend voor } x < ${tg(p.h)}, \\text{ dalend voor } x > ${tg(p.h)}`] };
    } },
    extremum: { naam: 'Extremum', gen() {
      const p = { a: kies([1, -1, 2, -2, 4, -0.5]), h: nz(-6, 6), k: nz(-7, 7) }, pos = p.a > 0;
      return { soort: 'extremum', opdracht: 'Geef het extremum van f.', tex: topTex(Q(p.a * 2, 2), Q(p.h), Q(p.k)),
        antw: { soort: 'delen', delen: [{ label: '\\text{soort:}', antw: { soort: 'keuze', opties: kz(['minimum', 'maximum']), juist: pos ? '0' : '1' } },
          { label: '\\text{in } x =', antw: getal(p.h) }, { label: '\\text{waarde } y =', antw: getal(p.k) }] },
        uitleg: [`a = ${tg(p.a)} ${pos ? '> 0 \\Rightarrow \\text{minimum}' : '< 0 \\Rightarrow \\text{maximum}'} \\text{ in de top}`, `\\text{${pos ? 'minimum' : 'maximum'} } (${tg(p.h)}, ${tg(p.k)})`] };
    } },
  },
  oefenMix: [['teken', 2], ['tekenGeen', 1], ['stijgen', 2], ['extremum', 2]],
  test: [['teken', 3], ['tekenGeen', 1], ['stijgen', 3], ['extremum', 3]], testSchudden: true,
};

const D10 = {
  nr: 10, titel: 'Symmetrie', kort: 'De parabool is symmetrisch t.o.v. de rechte x = h.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Symmetrie-as</div>
      <p>De grafiek van $f(x) = a(x - h)^2 + k$ is <b>symmetrisch ten opzichte van de verticale rechte $x = h$</b> (en niet t.o.v. de $y$-as zoals bij $ax^2$, tenzij $h = 0$).</p>
      <p>Twee $x$-waarden die even ver van $h$ liggen ($h - d$ en $h + d$) hebben dezelfde functiewaarde: $a(\\pm d)^2 + k = ad^2 + k$.</p>
      ${graf([{ f: parabool(1, 3, 1) }, { f: (x) => NaN }], [{ x: 3, y: 1, label: 'top' }, { x: 1, y: 5, label: '(1, 5)', kleur: '#2e7d4f' }, { x: 5, y: 5, label: '(5, 5)', kleur: '#2e7d4f' }])}
      <p class="klein midden">$f(x) = (x - 3)^2 + 1$: symmetrie-as $x = 3$. $x = 1$ ligt 2 links van de as, $x = 5$ ligt 2 rechts: $f(1) = f(5) = 5$.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = -3(x + 4)^2', stappen: ['h = -4', '\\text{symmetrie-as: } x = -4'] },
    { tex: 'f(x) = 2x^2 - 5', stappen: ['h = 0', '\\text{symmetrie-as: } x = 0 \\text{ (de } y\\text{-as)}'] },
    { tex: '\\text{top } (-2, 3), \\text{ punt } (0, -1)\\text{: spiegelbeeld?}', stappen: ['\\text{as } x = -2; \\; (0, -1) \\text{ ligt 2 rechts van de as}', '\\text{spiegelbeeld: 2 links van de as: } (-4, -1)'] },
  ],
  soorten: {
    as: { naam: 'Symmetrie-as', gen() {
      const a = kies([1, -1, 2, -3, 0.5]), h = rnd(-8, 8) + kies([0, 0, 0, 0.5]), k = rnd(-6, 6);
      return { soort: 'as', opdracht: 'Geef de vergelijking van de symmetrie-as.', tex: topTex(Q(a * 2, 2), Q(h * 2, 2), Q(k)), antw: getal(h, { voor: 'x =' }),
        uitleg: [`h = ${tg(h)}`, `\\text{symmetrie-as: } x = ${tg(h)}`] };
    } },
    spiegel: { naam: 'Spiegelbeeld van een punt', gen() {
      const h = rnd(-5, 5), d = nz(-5, 5), y = rnd(-8, 8), px = h + d;
      const vorm = kies(['as', 'top']);
      return { soort: 'spiegel', opdracht: 'Geef het spiegelbeeld van het punt t.o.v. de symmetrie-as.', tex: vorm === 'as' ? `\\text{symmetrie-as } x = ${tg(h)} \\text{ en punt } (${tg(px)}, ${tg(y)})` : `\\text{top } (${tg(h)}, ${tg(rnd(-6, 6))}) \\text{ en punt } (${tg(px)}, ${tg(y)})`,
        antw: { soort: 'delen', delen: [{ label: 'x =', antw: getal(h - d) }, { label: 'y =', antw: getal(y) }] },
        uitleg: [`\\text{as } x = ${tg(h)}; \\; (${tg(px)}, ${tg(y)}) \\text{ ligt } ${Math.abs(d)} \\text{ ${d > 0 ? 'rechts' : 'links'} van de as}`, `\\text{spiegelbeeld: } ${Math.abs(d)} \\text{ ${d > 0 ? 'links' : 'rechts'} van de as: } (${tg(h - d)}, ${tg(y)})`] };
    } },
    zelfde: { naam: 'Zelfde functiewaarde', gen() {
      const a = kies([1, -1, 2]), h = rnd(-4, 4), k = rnd(-5, 5), d = nz(-4, 4), x1 = h + d, w = a * d * d + k;
      return { soort: 'zelfde', opdracht: `Gegeven: f(${x1}) = ${getalTekst(w)}. Voor welke andere x-waarde is de functiewaarde ook ${getalTekst(w)}? Gebruik de symmetrie.`, tex: topTex(Q(a), Q(h), Q(k)),
        antw: getal(h - d, { voor: 'x =' }),
        uitleg: [`\\text{symmetrie-as } x = ${tg(h)}`, `x = ${tg(x1)} \\text{ ligt } ${Math.abs(d)} \\text{ ${d > 0 ? 'rechts' : 'links'} van de as} \\Rightarrow x = ${tg(h - d)}`] };
    } },
  },
  oefenMix: [['as', 2], ['spiegel', 2], ['zelfde', 2]],
  test: [['as', 4], ['spiegel', 3], ['zelfde', 3]], testSchudden: true,
};

// ---- 11. functieoverzicht
function algUitP(p) { return { a: p.a, b: -2 * p.a * p.h, c: p.a * p.h * p.h + p.k }; }
function overzichtVraag(soort, metAlg, deel) {
  const p = maakParabool(), A = algUitP(p);
  const tex = metAlg ? algTex(A.a, A.b, A.c) : pTex(p);
  const voor = metAlg ? [algTex(A.a, A.b, A.c), ...afsplitsen(A.a, A.b, A.c).L.slice(0, -1)] : [];
  const top = [{ label: '\\text{top: } x =', antw: getal(p.h) }, { label: 'y =', antw: getal(p.k) }];
  const ber = [{ label: '\\text{bereik:}', antw: bereikAntw(p) }];
  const nul = [{ label: '\\text{nulwaarden:}', antw: nulAntw(p) }];
  const pos = p.a > 0;
  const sd = [{ label: '\\text{stijgend voor}', antw: pos ? ogAntw(p.h, false, null, false) : ogAntw(null, false, p.h, false) }];
  const ext = [{ label: '\\text{extremum:}', antw: { soort: 'keuze', opties: kz(['minimum', 'maximum']), juist: pos ? '0' : '1' } }];
  const sym = [{ label: '\\text{symmetrie-as: } x =', antw: getal(p.h) }];
  const sets = { topBereik: [...top, ...ber], nulSym: [...nul, ...sym], verloop: [...ext, ...sd], volledig: [...top, ...ber, ...nul, ...sd, ...ext, ...sym] };
  const uitleg = [...voor, `\\text{top } (${tg(p.h)}, ${tg(p.k)}), \\; a ${pos ? '> 0' : '< 0'} \\text{ (${pos ? 'dal' : 'berg'}parabool)}`, `\\text{domein } \\mathbb{R}, \\; \\text{bereik } ${bereikTex(p)}`,
    `\\text{nulwaarden: } ${p.nul.length ? p.nul.map(tg).join(' \\text{ en } ') : '\\text{geen}'}`,
    pos ? `\\text{dalend voor } x < ${tg(p.h)}, \\text{ stijgend voor } x > ${tg(p.h)}` : `\\text{stijgend voor } x < ${tg(p.h)}, \\text{ dalend voor } x > ${tg(p.h)}`,
    `\\text{${pos ? 'minimum' : 'maximum'} } (${tg(p.h)}, ${tg(p.k)}), \\; \\text{symmetrie-as } x = ${tg(p.h)}`];
  const opdr = { topBereik: 'Geef de top en het bereik.', nulSym: 'Geef de nulwaarden en de symmetrie-as.', verloop: 'Geef het extremum en waar f stijgt.', volledig: 'Stel het functieoverzicht op.' }[deel];
  return { soort, opdracht: opdr + (metAlg ? ' Schrijf f eerst in topvorm.' : ''), tex, antw: { soort: 'delen', delen: sets[deel] }, uitleg };
}
const D11 = {
  nr: 11, titel: 'Functieoverzicht opstellen', kort: 'Top, domein, bereik, nulwaarden, tekenverloop, stijgen/dalen, extremum, symmetrie.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Functieoverzicht</div>
      <p>Op een toets moet je alle kenmerken vlot na elkaar kunnen opsommen, in een vaste volgorde: <b>top, domein, bereik, nulwaarden, tekenverloop, stijgen/dalen, extremum, symmetrie</b>.
      Staat de functie in de algemene vorm, schrijf ze dan eerst in topvorm.</p></div>
    <div class="kader werk"><div class="kader-titel">Volledig voorbeeld: f(x) = x² − 6x + 5 = (x − 3)² − 4</div>
      <table class="tabel"><tr><td>top</td><td>$(3, -4)$</td></tr><tr><td>domein</td><td>$\\mathbb{R}$</td></tr><tr><td>bereik</td><td>$[-4, +\\infty[$</td></tr>
      <tr><td>nulwaarden</td><td>$x = 1$ en $x = 5$</td></tr><tr><td>tekenverloop</td><td>$+$ voor $x < 1$, $0$ in $x = 1$, $-$ voor $1 < x < 5$, $0$ in $x = 5$, $+$ voor $x > 5$</td></tr>
      <tr><td>stijgen/dalen</td><td>dalend voor $x < 3$, stijgend voor $x > 3$</td></tr><tr><td>extremum</td><td>minimum $(3, -4)$</td></tr><tr><td>symmetrie</td><td>t.o.v. de rechte $x = 3$</td></tr></table></div>`,
  voorbeelden: [
    { tex: 'f(x) = -2x^2 - 4x + 6', stappen: ['= -2(x^2 + 2x + 1 - 1) + 6 = -2(x + 1)^2 + 8', '\\text{top } (-1, 8), \\; \\text{bereik } ]-\\infty, 8]', '(x + 1)^2 = 4 \\Rightarrow \\text{nulwaarden } -3 \\text{ en } 1', '\\text{stijgend voor } x < -1, \\text{ dalend voor } x > -1, \\; \\text{maximum } (-1, 8)', '\\text{symmetrie-as } x = -1'] },
  ],
  soorten: {
    topBereik: { naam: 'Top en bereik', gen() { return overzichtVraag('topBereik', kies([false, true]), 'topBereik'); } },
    nulSym: { naam: 'Nulwaarden en symmetrie-as', gen() { return overzichtVraag('nulSym', kies([false, true]), 'nulSym'); } },
    verloop: { naam: 'Extremum en stijgen', gen() { return overzichtVraag('verloop', kies([false, true]), 'verloop'); } },
    volledig: { naam: 'Volledig functieoverzicht', gen() { return overzichtVraag('volledig', kies([false, true]), 'volledig'); } },
  },
  oefenMix: [['topBereik', 1], ['nulSym', 1], ['verloop', 1], ['volledig', 2]],
  test: [['topBereik', 3], ['nulSym', 3], ['verloop', 3], ['volledig', 1]], testSchudden: true,
};


// ======================= NIEUW voor 5BCW =======================
// p, q-notatie zoals in de 5BCW-cursus: f(x) = a(x − p)² + q met top S(p; q)
const pqTekst = (t) => typeof t !== 'string' ? t : t.replace(/\$[^$]*\$/g, (m) => m.replace(/\(h, k\)/g, '(p, q)').replace(/(?<![a-zA-Z\\])h(?![a-zA-Z])/g, 'p').replace(/(?<![a-zA-Z\\])k(?![a-zA-Z])/g, 'q'))
  .replace(/top \(h, k\)/g, 'top (p, q)');
const pqDeel = (D) => ({ ...D, theorie: pqTekst(D.theorie), kort: pqTekst(D.kort).replace(/\(x − h\)² \+ k/g, '(x − p)² + q') });
const DF = {
  nr: 1, titel: 'Topvorm met de formules', kort: 'p = −b/(2a) en q = f(p): zo vind je de top.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Instap: de optimale reactietemperatuur</div>
      <p>Bij een chemische reactie hangt de opbrengst af van de reactietemperatuur: bij een te lage temperatuur verloopt de reactie te traag, bij een te hoge temperatuur nemen ongewenste nevenreacties toe. Dat verband is een tweedegraadsfunctie: de <b>top</b> van de parabool geeft de optimale temperatuur en de maximale opbrengst.</p></div>
    <div class="kader def"><div class="kader-titel">Twee vormen</div>
      <p><b>Topvorm:</b> $f(x) = a(x - p)^2 + q$ met top $S(p; q)$ &nbsp;·&nbsp; <b>Algemene vorm:</b> $f(x) = ax^2 + bx + c$</p></div>
    <div class="kader eig"><div class="kader-titel">Van algemene vorm naar topvorm met de formules</div>
      <p class="midden">$p = -\\dfrac{b}{2a} \\qquad q = f(p) = c - \\dfrac{b^2}{4a}$</p>
      <p>$a$ blijft dezelfde in beide vormen.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$f(x) = 2x^2 - 8x + 3$: $p = -\\dfrac{-8}{2 \\cdot 2} = 2$ en $q = f(2) = 2 \\cdot 4 - 8 \\cdot 2 + 3 = -5$, dus $f(x) = 2(x - 2)^2 - 5$, top $S(2; -5)$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = x^2 - 6x + 5', stappen: ['p = -\\frac{-6}{2 \\cdot 1} = 3', 'q = f(3) = 9 - 18 + 5 = -4', 'f(x) = (x - 3)^2 - 4 \\qquad S(3; -4)'] },
    { tex: 'f(x) = -x^2 + 6x - 2', stappen: ['p = -\\frac{6}{2 \\cdot (-1)} = 3', 'q = f(3) = -9 + 18 - 2 = 7', 'f(x) = -(x - 3)^2 + 7 \\qquad S(3; 7)'] },
  ],
  soorten: {},
  oefenMix: [['geheel', 2], ['negatief', 1], ['breuk', 1]],
  test: [['geheel', 4], ['negatief', 3], ['breuk', 3]], testSchudden: true,
};
function formuleVraag(a, b, c, soort) {
  const r = afsplitsen(a, b, c), pTex = qTex(r.h), qT = qTex(r.k);
  return { soort, opdracht: 'Schrijf in topvorm met de formules p = −b/(2a) en q = f(p). Geef daarna de top.', tex: algTex(a, b, c),
    antw: { soort: 'delen', delen: [{ label: 'f(x) =', antw: { ...topAntw(r.A, r.h, r.k), voor: '' } }, { label: '\\text{top: } p =', antw: qGetal(r.h) }, { label: 'q =', antw: qGetal(r.k) }] },
    uitleg: [`p = -\\frac{${tg(b)}}{2 \\cdot ${h_(a)}} = ${pTex}`, `q = f(${pTex}) = ${qT}`, `f(x) = ${topTex(r.A, r.h, r.k, null)} \\qquad S(${pTex}; ${qT})`] };
}
DF.soorten = {
  geheel: { naam: 'a > 0, p geheel', gen() { const a = kies([1, 1, 2, 3]), p = nz(-5, 5), q = rnd(-9, 9); return formuleVraag(a, -2 * a * p, a * p * p + q, 'geheel'); } },
  negatief: { naam: 'a negatief', gen() { const a = kies([-1, -1, -2, -3]), p = nz(-5, 5), q = rnd(-9, 9); return formuleVraag(a, -2 * a * p, a * p * p + q, 'negatief'); } },
  breuk: { naam: 'p is een breuk', gen() { const b = kies([1, 3, 5, 7]) * kies([1, -1]), c = rnd(-6, 8); return formuleVraag(1, b, c, 'breuk'); } },
};
// topvorm → algemene vorm
const vtTop = (a, p, q) => `${a === 1 ? '' : a === -1 ? '-' : a}(x${p > 0 ? '-' : '+'}${Math.abs(p)})^2${q === 0 ? '' : (q > 0 ? '+' : '') + q}`;
const DA = {
  nr: 4, titel: 'Topvorm → algemene vorm', kort: 'Haakjes uitwerken: eerst het kwadraat, dan vermenigvuldigen met a.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Van topvorm naar algemene vorm</div>
      <ol><li>Werk het kwadraat uit met het merkwaardig product: $(x - p)^2 = x^2 - 2px + p^2$.</li>
      <li>Vermenigvuldig elke term met $a$ (let op de tekens als $a$ negatief is).</li>
      <li>Tel $q$ erbij en herleid.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$f(x) = 2(x + 1)^2 - 3 = 2(x^2 + 2x + 1) - 3 = 2x^2 + 4x + 2 - 3 = 2x^2 + 4x - 1$</p>
      <p class="klein">Controle met de formule: $p = -\\frac{4}{2 \\cdot 2} = -1$ ✓</p></div>
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Typ de uitgewerkte vorm, bv. <code>2x^2 + 4x - 1</code>.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = (x - 3)^2 + 2', stappen: ['= x^2 - 6x + 9 + 2', '= x^2 - 6x + 11'] },
    { tex: 'f(x) = -2(x - 1)^2 + 4', stappen: ['= -2(x^2 - 2x + 1) + 4', '= -2x^2 + 4x - 2 + 4', '= -2x^2 + 4x + 2'] },
  ],
  soorten: {},
  oefenMix: [['een', 1], ['groter', 2], ['negatief', 1]],
  test: [['een', 3], ['groter', 4], ['negatief', 3]], testSchudden: true,
};
function uitwerkTop(a, p, q, soort) {
  const b = -2 * a * p, c = a * p * p + q, s = vtTop(a, p, q);
  const sq = `x^2 ${-2 * p < 0 ? '-' : '+'} ${Math.abs(2 * p)}x + ${p * p}`;
  return { soort, opdracht: 'Schrijf in de algemene vorm f(x) = ax² + bx + c door de haakjes uit te werken.', tex: topTex(Q(a), Q(p), Q(q)),
    antw: { soort: 'veelterm', expr: s, vorm: 'uitgewerkt', voor: 'f(x) =', tex: algTex(a, b, c, null).replace(/^null\(x\) = /, '') },
    uitleg: [`= ${a === 1 ? '' : a === -1 ? '-' : tg(a)}\\left(${sq}\\right)${q ? ` ${q > 0 ? '+' : '-'} ${Math.abs(q)}` : ''}`, `= ${algTex(a, b, c).replace(/^f\(x\) = /, '')}`] };
}
DA.soorten = {
  een: { naam: 'a = 1', gen() { return uitwerkTop(1, nz(-6, 6), rnd(-9, 9), 'een'); } },
  groter: { naam: 'a > 1', gen() { return uitwerkTop(kies([2, 3, 4]), nz(-5, 5), rnd(-9, 9), 'groter'); } },
  negatief: { naam: 'a negatief', gen() { return uitwerkTop(kies([-1, -2, -3]), nz(-5, 5), rnd(-9, 9), 'negatief'); } },
};
EXT.T = { DF, DA, D5: pqDeel(D5), D6: pqDeel(D6), D9: pqDeel(D9), D11: pqDeel(D11) };

}
// Overgenomen uit bron/merkwaardige-producten-ontbinden/ (4BW) en hergebruikt voor toegepaste wiskunde 5BCW. Eigen blok: geen naamconflicten.
{
// ===== Remediëring merkwaardige producten, ontbinden en discriminant (4DOF) — hulpmiddelen =====
// Leidraad: cursus TWiskunde 4BW, hoofdstuk 1 Tweedegraadsvergelijkingen (G. Walschap).
const { rnd, kies } = W;
const ggd = W.ggd;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const teken = () => kies([-1, 1]);
const isKw = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));

// ---- veeltermen als tekst (zoals een leerling ze typt) en als TeX
// monoom: c·letters, bv. mono(3, 'x^2y') = '3x^2y', mono(-1, 'x') = '-x', mono(5) = '5'
const mono = (c, l = '') => l ? (c === 1 ? '' : c === -1 ? '-' : String(c)) + l : String(c);
// som van termen (tekst): ['x^2', '-3x', '5'] -> 'x^2 - 3x + 5'
const som = (ts) => ts.filter(t => t !== '0' && t !== '').map((t, i) => i ? (t[0] === '-' ? ` - ${t.slice(1)}` : ` + ${t}`) : t).join('');
// x + c  (c geheel getal)
const lin = (v, c) => c === 0 ? v : c > 0 ? `${v} + ${c}` : `${v} - ${-c}`;
const etx = (s) => VT.texVan(s);           // TeX zoals geschreven
const vtx = (s) => VT.uitgewerktTex(s);    // TeX van de uitgewerkte en herleide vorm
// TeX van een term in een formule: tussen haakjes als het geen enkele letter of getal is
const P = (s) => /^([a-z]|\d+)$/.test(s) ? s : `\\left(${etx(s)}\\right)`;
const tg = (x) => W.texGetal(x);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const bt = (p, q) => W.breukTex(p, q);

// ---- vragen
const uitwerk = (soort, s, uitleg, extra = {}) => ({ soort, tex: etx(s), antw: { soort: 'veelterm', expr: s, vorm: 'uitgewerkt', tex: vtx(s) }, uitleg, ...extra });
// f = de volledig ontbonden vorm (tekst); opg = TeX van de opgave (standaard: uitgewerkt)
const ontbind = (soort, f, uitleg, opg = null, extra = {}) => ({ soort, tex: opg || vtx(f), antw: { soort: 'veelterm', expr: f, vorm: 'ontbonden', tex: etx(f) }, uitleg, ...extra });

// ---- letters en monomen om mee te werken
const LETTER = () => kies(['x', 'x', 'x', 'a', 'y', 'p']);
const TWEE = () => kies([['x', 'y'], ['a', 'b'], ['p', 'q'], ['x', 'y']]);

const OPDR_MP = 'Werk uit met een merkwaardig product.';
const OPDR_ONT = 'Ontbind volledig in factoren.';
const OPDR_D = 'Los op met de discriminantmethode.';

const FORMULES = `<div class="kader def"><div class="kader-titel">De merkwaardige producten</div>
  <table class="tabel"><tr><td>kwadraat van een som</td><td>$(a+b)^2 = a^2 + 2ab + b^2$</td></tr>
  <tr><td>kwadraat van een verschil</td><td>$(a-b)^2 = a^2 - 2ab + b^2$</td></tr>
  <tr><td>product van een som en een verschil</td><td>$(a+b)(a-b) = a^2 - b^2$</td></tr>
  <tr><td>derde macht van een som</td><td>$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$</td></tr>
  <tr><td>derde macht van een verschil</td><td>$(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$</td></tr></table></div>`;

const STAPPENPLAN = `<div class="kader werk"><div class="kader-titel">Stappenplan om te ontbinden</div>
  <ol><li>Kijk eerst of er een <b>gemeenschappelijke factor</b> buiten haakjes kan.</li>
  <li>Controleer daarna of je een <b>merkwaardig product</b> herkent.</li>
  <li>Herken je geen merkwaardig product, gebruik dan de <b>product-som methode</b>.</li>
  <li>Heeft de veelterm <b>vier termen</b>, probeer dan te <b>groeperen</b>.</li></ol></div>`;

const DISCR = `<div class="kader def"><div class="kader-titel">De discriminantmethode</div>
  <p>Schrijf de vergelijking in de standaardvorm $ax^2 + bx + c = 0$ (met $a \\neq 0$) en bereken de <b>discriminant</b>:</p>
  <p class="midden">$D = b^2 - 4ac$</p>
  <table class="tabel"><tr><th>Discriminant</th><th>Aantal oplossingen</th><th>Notatie</th></tr>
  <tr><td>$D > 0$</td><td>2 verschillende oplossingen</td><td>$V = \\{x_1 ; x_2\\}$</td></tr>
  <tr><td>$D = 0$</td><td>1 oplossing (dubbele wortel)</td><td>$V = \\{x\\}$</td></tr>
  <tr><td>$D < 0$</td><td>geen oplossingen in $\\mathbb{R}$</td><td>$V = \\varnothing$</td></tr></table>
  <p>Als $D > 0$: $\\;x_1 = \\dfrac{-b + \\sqrt{D}}{2a}\\;$ en $\\;x_2 = \\dfrac{-b - \\sqrt{D}}{2a}$. &nbsp; Als $D = 0$: $\\;x = \\dfrac{-b}{2a}$.</p></div>`;

const INTYPEN = `<div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
  <ul><li>Een macht typ je met <code>^</code> of met de knop: <code>x^2</code> of <code>x²</code>.</li>
  <li>Een maalteken mag je weglaten: <code>3x(x - 4)</code> betekent $3x \\cdot (x-4)$.</li>
  <li>Onder het vakje zie je hoe je antwoord gelezen wordt. Kijk dat even na.</li></ul></div>`;
const INTYPEN_V = `<div class="kader"><div class="kader-titel">Zo noteer je de oplossingen</div>
  <p>In het vakje tussen de accolades typ je de oplossingen, met een <b>puntkomma</b> ertussen: <code>2 ; -3</code>.
  Een breuk mag: <code>-1/3</code>. Is een oplossing geen mooi getal, rond dan af op <b>2 cijfers na de komma</b>: <code>3,41</code>.
  Geen oplossingen? Klik op de knop $V = \\varnothing$.</p></div>`;

// ---- discriminant: vergelijking ax² + bx + c = 0 en de volledige uitwerking
function vgl(a, b, c, rechts = '0') { return `${etx(som([mono(a, 'x^2'), mono(b, 'x'), String(c)].filter((t, i) => [a, b, c][i] !== 0)))} = ${rechts}`; }
function discrUitleg(a, b, c) {
  const D = b * b - 4 * a * c;
  const L = [`a = ${tg(a)},\\; b = ${tg(b)},\\; c = ${tg(c)}`,
    `D = b^2 - 4ac = ${h(b)}^2 - 4 \\cdot ${h(a)} \\cdot ${h(c)} = ${tg(D)}`];
  let waarden = [], tex = [];
  if (D < 0) { L.push('D < 0 \\;\\Rightarrow\\; \\text{geen oplossingen}', 'V = \\varnothing'); return { D, L, waarden, tex }; }
  if (D === 0) {
    const t = bt(-b, 2 * a); waarden = [-b / (2 * a)]; tex = [t];
    L.push('D = 0 \\;\\Rightarrow\\; \\text{1 oplossing}', `x = \\dfrac{-b}{2a} = \\dfrac{${tg(-b)}}{${tg(2 * a)}} = ${t}`, `V = \\{${t}\\}`);
    return { D, L, waarden, tex };
  }
  L.push('D > 0 \\;\\Rightarrow\\; \\text{2 oplossingen}');
  const w = Math.sqrt(D), mooi = isKw(D);
  const xs = [(-b + w) / (2 * a), (-b - w) / (2 * a)];
  ['+', '-'].forEach((op, i) => {
    const t = mooi ? bt(op === '+' ? -b + w : -b - w, 2 * a) : W.texGetal(W.rond(xs[i], 2));
    tex.push(t);
    L.push(`x_${i + 1} = \\dfrac{${tg(-b)} ${op} ${mooi ? tg(w) : `\\sqrt{${tg(D)}}`}}{${tg(2 * a)}} ${mooi ? '=' : '\\approx'} ${t}`);
  });
  if (xs[0] > xs[1]) { xs.reverse(); tex.reverse(); }
  waarden = xs;
  L.push(`V = \\{${tex.join('\\,;\\,')}\\}`);
  return { D, L, waarden, tex };
}
const Vantw = (r) => r.waarden.length ? { soort: 'Vmeer', waarden: r.waarden, tex: r.tex, dec: 2 } : { soort: 'Vmeer', waarden: [], leeg: true };

// ===================================================================
//  A · MERKWAARDIGE PRODUCTEN
// ===================================================================

// (A + B)² of (A − B)²  — A en B zijn monomen als tekst (zonder minteken)
function kwadraat(soort, A, B, op) {
  const s = `(${A} ${op} ${B})^2`;
  return uitwerk(soort, s, [`${etx(s)} = ${P(A)}^2 ${op} 2 \\cdot ${etx(A)} \\cdot ${etx(B)} + ${P(B)}^2`, `= ${vtx(s)}`]);
}
const GETAL = () => rnd(1, 12);

const D1 = {
  nr: 1, titel: 'Kwadraat van een som: (x + a)²', kort: 'Het kwadraat van een som met een letter en een getal.', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat van een som</div>
      <p class="midden">$(a+b)^2 = (a+b)(a+b) = a^2 + 2ab + b^2$</p>
      <p>Het kwadraat van een som is het <b>kwadraat van de eerste term</b>, plus <b>twee keer het product</b> van beide termen, plus het <b>kwadraat van de tweede term</b>.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$(x+7)^2 = x^2 + 2 \\cdot x \\cdot 7 + 7^2 = x^2 + 14x + 49$</p>
      <p class="klein">Toepassing: $52^2 = (50+2)^2 = 2500 + 200 + 4 = 2704$.</p>
      <p class="let-op">Let op: $(x+7)^2$ is <b>niet</b> $x^2 + 49$. De middelste term $2ab$ mag je niet vergeten!</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(x+3)^2', stappen: ['= x^2 + 2 \\cdot x \\cdot 3 + 3^2', '= x^2 + 6x + 9'] },
    { tex: '(a+8)^2', stappen: ['= a^2 + 2 \\cdot a \\cdot 8 + 8^2', '= a^2 + 16a + 64'] },
    { tex: '(5+y)^2', stappen: ['= 5^2 + 2 \\cdot 5 \\cdot y + y^2', '= 25 + 10y + y^2 = y^2 + 10y + 25'] },
  ],
  soorten: {
    som: { naam: '(x + a)²', gen() { return kwadraat('som', LETTER(), String(GETAL()), '+'); } },
    voor: { naam: '(a + x)²', gen() { return kwadraat('voor', String(GETAL()), LETTER(), '+'); } },
  },
  oefenMix: [['som', 3], ['voor', 1]],
  test: [['som', 7], ['voor', 3]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Kwadraat van een som: (ax + by)²', kort: 'Ook met een getal voor de letter, twee letters of een macht.', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat van een som</div>
      <p class="midden">$(a+b)^2 = a^2 + 2ab + b^2$</p>
      <p>De letters $a$ en $b$ in de formule mogen ook <b>termen</b> zijn zoals $2x$, $3y$ of $x^2$.
      Zet zo'n term tussen haakjes als je hem kwadrateert: $(2x)^2 = 4x^2$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(2x+5)^2 = (2x)^2 + 2 \\cdot 2x \\cdot 5 + 5^2 = 4x^2 + 20x + 25$</p>
      <p class="midden">$(3a+2b)^2 = (3a)^2 + 2 \\cdot 3a \\cdot 2b + (2b)^2 = 9a^2 + 12ab + 4b^2$</p>
      <p class="midden">$(x^2+4)^2 = (x^2)^2 + 2 \\cdot x^2 \\cdot 4 + 4^2 = x^4 + 8x^2 + 16$</p>
      <p class="let-op">Let op: $(2x)^2 = 2x \\cdot 2x = 4x^2$, niet $2x^2$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(2x+3)^2', stappen: ['= (2x)^2 + 2 \\cdot 2x \\cdot 3 + 3^2', '= 4x^2 + 12x + 9'] },
    { tex: '(4x+11)^2', stappen: ['= (4x)^2 + 2 \\cdot 4x \\cdot 11 + 11^2', '= 16x^2 + 88x + 121'] },
    { tex: '(p+2q)^2', stappen: ['= p^2 + 2 \\cdot p \\cdot 2q + (2q)^2', '= p^2 + 4pq + 4q^2'] },
    { tex: '(x^2+1)^2', stappen: ['= (x^2)^2 + 2 \\cdot x^2 \\cdot 1 + 1^2', '= x^4 + 2x^2 + 1'] },
  ],
  soorten: {
    coef: { naam: '(ax + b)²', gen() { return kwadraat('coef', mono(rnd(2, 9), LETTER()), String(rnd(1, 12)), '+'); } },
    twee: { naam: '(ax + by)²', gen() { const [u, v] = TWEE(); return kwadraat('twee', mono(rnd(1, 6), u), mono(rnd(1, 7), v), '+'); } },
    macht: { naam: '(x² + b)²', gen() { return kwadraat('macht', mono(rnd(1, 3), kies(['x^2', 'x^2', 'x^3', 'a^2'])), String(rnd(1, 9)), '+'); } },
  },
  oefenMix: [['coef', 3], ['twee', 2], ['macht', 1]],
  test: [['coef', 5], ['twee', 3], ['macht', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Kwadraat van een verschil: (a − b)²', kort: 'Zelfde werkwijze, maar de middelste term krijgt een minteken.', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat van een verschil</div>
      <p class="midden">$(a-b)^2 = (a-b)(a-b) = a^2 - 2ab + b^2$</p>
      <p>Alleen de <b>middelste term</b> krijgt een minteken. Het laatste kwadraat $b^2$ is altijd positief.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(x-4)^2 = x^2 - 2 \\cdot x \\cdot 4 + 4^2 = x^2 - 8x + 16$</p>
      <p class="midden">$(3x-4)^2 = (3x)^2 - 2 \\cdot 3x \\cdot 4 + 4^2 = 9x^2 - 24x + 16$</p>
      <p class="midden">$(7-2x)^2 = 7^2 - 2 \\cdot 7 \\cdot 2x + (2x)^2 = 49 - 28x + 4x^2$</p>
      <p class="klein">Toepassing: $49^2 = (50-1)^2 = 2500 - 100 + 1 = 2401$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(x-1)^2', stappen: ['= x^2 - 2 \\cdot x \\cdot 1 + 1^2', '= x^2 - 2x + 1'] },
    { tex: '(5x-12)^2', stappen: ['= (5x)^2 - 2 \\cdot 5x \\cdot 12 + 12^2', '= 25x^2 - 120x + 144'] },
    { tex: '(2a-3b)^2', stappen: ['= (2a)^2 - 2 \\cdot 2a \\cdot 3b + (3b)^2', '= 4a^2 - 12ab + 9b^2'] },
  ],
  soorten: {
    basis: { naam: '(x − a)²', gen() { return kwadraat('basis', LETTER(), String(GETAL()), '-'); } },
    coef: { naam: '(ax − b)²', gen() { return kwadraat('coef', mono(rnd(2, 9), LETTER()), String(rnd(1, 12)), '-'); } },
    twee: { naam: '(ax − by)²', gen() { const [u, v] = TWEE(); return kwadraat('twee', mono(rnd(1, 6), u), mono(rnd(1, 7), v), '-'); } },
    getalvoor: { naam: '(a − bx)²', gen() { return kwadraat('getalvoor', String(rnd(1, 9)), mono(rnd(1, 6), LETTER()), '-'); } },
  },
  oefenMix: [['basis', 2], ['coef', 2], ['twee', 2], ['getalvoor', 1]],
  test: [['basis', 3], ['coef', 3], ['twee', 2], ['getalvoor', 2]], testSchudden: true,
};

// (−A − B)² = (A + B)²   en   (−A + B)² = (A − B)²
function minKwadraat(soort, A, B, op) {
  const s = `(-${A} ${op} ${B})^2`;
  const zelfde = op === '-' ? `(${A} + ${B})^2` : `(${A} - ${B})^2`;
  const o2 = op === '-' ? '+' : '-';
  return uitwerk(soort, s, [
    `${etx(s)} = ${etx(zelfde)} \\qquad \\text{(kwadraat van het tegengestelde)}`,
    `= ${P(A)}^2 ${o2} 2 \\cdot ${etx(A)} \\cdot ${etx(B)} + ${P(B)}^2`, `= ${vtx(s)}`]);
}
const D4 = {
  nr: 4, titel: 'Mintekens: (−a − b)² en (−a + b)²', kort: 'Een minteken voor de eerste term: kijk goed naar de tekens.', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader eig"><div class="kader-titel">Het kwadraat van het tegengestelde</div>
      <p>Een getal en zijn tegengestelde hebben hetzelfde kwadraat: $(-5)^2 = 5^2 = 25$. Dat geldt ook voor veeltermen:</p>
      <p class="midden">$(-a-b)^2 = (a+b)^2 \\qquad (-a+b)^2 = (a-b)^2$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(-x-6)^2 = (x+6)^2 = x^2 + 12x + 36$</p>
      <p class="midden">$(-x+5)^2 = (x-5)^2 = x^2 - 10x + 25$</p>
      <p class="klein">Je mag ook gewoon de formule toepassen met $a = -x$: $(-x)^2 + 2 \\cdot (-x) \\cdot 5 + 5^2 = x^2 - 10x + 25$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(-x-3)^2', stappen: ['= (x+3)^2', '= x^2 + 2 \\cdot x \\cdot 3 + 3^2', '= x^2 + 6x + 9'] },
    { tex: '(-a+8)^2', stappen: ['= (a-8)^2', '= a^2 - 2 \\cdot a \\cdot 8 + 8^2', '= a^2 - 16a + 64'] },
    { tex: '(-3a-2b)^2', stappen: ['= (3a+2b)^2', '= (3a)^2 + 2 \\cdot 3a \\cdot 2b + (2b)^2', '= 9a^2 + 12ab + 4b^2'] },
  ],
  soorten: {
    minmin: { naam: '(−x − a)²', gen() { return minKwadraat('minmin', kies([LETTER(), mono(rnd(2, 6), LETTER())]), String(GETAL()), '-'); } },
    minplus: { naam: '(−x + a)²', gen() { return minKwadraat('minplus', kies([LETTER(), mono(rnd(2, 6), LETTER())]), String(GETAL()), '+'); } },
    twee: { naam: '(−ax ± by)²', gen() { const [u, v] = TWEE(); return minKwadraat('twee', mono(rnd(1, 5), u), mono(rnd(1, 6), v), kies(['+', '-'])); } },
  },
  oefenMix: [['minmin', 2], ['minplus', 2], ['twee', 1]],
  test: [['minmin', 4], ['minplus', 4], ['twee', 2]], testSchudden: true,
};

// (A + B)(A − B) in verschillende volgordes
function somVerschil(soort, A, B, vorm = 0) {
  const vormen = [`(${A} + ${B})(${A} - ${B})`, `(${A} - ${B})(${A} + ${B})`, `(${B} + ${A})(${B} - ${A})`, `(-${A} + ${B})(${A} + ${B})`];
  const s = vormen[vorm];
  const L = [];
  if (vorm === 3) L.push(`${etx(s)} = ${etx(`(${B} - ${A})(${B} + ${A})`)} \\qquad \\text{(herschikken)}`, `= ${P(B)}^2 - ${P(A)}^2`);
  else if (vorm === 2) L.push(`${etx(s)} = ${P(B)}^2 - ${P(A)}^2`);
  else L.push(`${etx(s)} = ${P(A)}^2 - ${P(B)}^2`);
  L.push(`= ${vtx(s)}`);
  return uitwerk(soort, s, L);
}
const D5 = {
  nr: 5, titel: 'Product van een som en een verschil', kort: '(a + b)(a − b) = a² − b²', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Product van een som en een verschil</div>
      <p class="midden">$(a+b)(a-b) = a^2 - b^2$</p>
      <p>Het kwadraat van de term die in beide factoren <b>hetzelfde teken</b> heeft, min het kwadraat van de term met <b>tegengestelde tekens</b>.
      De middelste termen vallen weg: $-ab + ab = 0$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(x+4)(x-4) = x^2 - 4^2 = x^2 - 16$</p>
      <p class="midden">$(2x+5y)(2x-5y) = (2x)^2 - (5y)^2 = 4x^2 - 25y^2$</p>
      <p class="midden">$(-3x+8)(3x+8) = (8-3x)(8+3x) = 8^2 - (3x)^2 = 64 - 9x^2$</p>
      <p class="klein">Toepassing: $21 \\times 19 = (20+1)(20-1) = 400 - 1 = 399$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(x+3)(x-3)', stappen: ['= x^2 - 3^2', '= x^2 - 9'] },
    { tex: '(3x+5)(3x-5)', stappen: ['= (3x)^2 - 5^2', '= 9x^2 - 25'] },
    { tex: '(x^2+3)(x^2-3)', stappen: ['= (x^2)^2 - 3^2', '= x^4 - 9'] },
    { tex: '(-x+3)(x+3)', stappen: ['= (3-x)(3+x)', '= 3^2 - x^2', '= 9 - x^2'] },
  ],
  soorten: {
    basis: { naam: '(x + a)(x − a)', gen() { return somVerschil('basis', LETTER(), String(GETAL()), rnd(0, 1)); } },
    coef: { naam: '(ax + b)(ax − b)', gen() { return somVerschil('coef', mono(rnd(2, 9), LETTER()), String(rnd(1, 12)), rnd(0, 1)); } },
    twee: { naam: '(ax + by)(ax − by)', gen() { const [u, v] = TWEE(); return somVerschil('twee', mono(rnd(1, 9), u), mono(rnd(1, 7), v), rnd(0, 1)); } },
    volgorde: { naam: 'Andere volgorde', gen() { return somVerschil('volgorde', mono(rnd(1, 7), 'x'), String(rnd(1, 9)), kies([2, 3])); } },
    macht: { naam: '(x² + a)(x² − a)', gen() { return somVerschil('macht', mono(rnd(1, 3), 'x^2'), String(rnd(1, 9)), rnd(0, 1)); } },
  },
  oefenMix: [['basis', 2], ['coef', 2], ['twee', 2], ['volgorde', 1], ['macht', 1]],
  test: [['basis', 2], ['coef', 3], ['twee', 2], ['volgorde', 2], ['macht', 1]], testSchudden: true,
};

function derde(soort, A, B, op) {
  const s = `(${A} ${op} ${B})^3`;
  return uitwerk(soort, s, [`${etx(s)} = ${P(A)}^3 ${op} 3 \\cdot ${P(A)}^2 \\cdot ${etx(B)} + 3 \\cdot ${etx(A)} \\cdot ${P(B)}^2 ${op} ${P(B)}^3`, `= ${vtx(s)}`]);
}
const D6 = {
  nr: 6, titel: 'Derde macht van een som of verschil', kort: '(a ± b)³ = a³ ± 3a²b + 3ab² ± b³', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Derde macht van een som en van een verschil</div>
      <p class="midden">$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$</p>
      <p class="midden">$(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$</p>
      <p>Deze twee regels moet je herkennen. Bij een verschil wisselen de tekens af: $+\\;-\\;+\\;-$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$(2x-1)^3 = (2x)^3 - 3 \\cdot (2x)^2 \\cdot 1 + 3 \\cdot 2x \\cdot 1^2 - 1^3 = 8x^3 - 12x^2 + 6x - 1$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(x+2)^3', stappen: ['= x^3 + 3 \\cdot x^2 \\cdot 2 + 3 \\cdot x \\cdot 2^2 + 2^3', '= x^3 + 6x^2 + 12x + 8'] },
    { tex: '(x-3)^3', stappen: ['= x^3 - 3 \\cdot x^2 \\cdot 3 + 3 \\cdot x \\cdot 3^2 - 3^3', '= x^3 - 9x^2 + 27x - 27'] },
    { tex: '(2a+1)^3', stappen: ['= (2a)^3 + 3 \\cdot (2a)^2 \\cdot 1 + 3 \\cdot 2a \\cdot 1^2 + 1^3', '= 8a^3 + 12a^2 + 6a + 1'] },
  ],
  soorten: {
    som: { naam: '(x + a)³', gen() { return derde('som', LETTER(), String(rnd(1, 5)), '+'); } },
    verschil: { naam: '(x − a)³', gen() { return derde('verschil', LETTER(), String(rnd(1, 5)), '-'); } },
    coef: { naam: '(ax ± b)³', gen() { return derde('coef', mono(rnd(2, 3), LETTER()), String(rnd(1, 3)), kies(['+', '-'])); } },
  },
  oefenMix: [['som', 2], ['verschil', 2], ['coef', 1]],
  test: [['som', 4], ['verschil', 4], ['coef', 2]], testSchudden: true,
};

// getal ervoor: k(A ± B)²  of  k(A + B)(A − B)
function metFactor(soort) {
  const k = kies([2, 3, 4, 5, -2, -3, -4, -5, -10]);
  const kx = kies(['', '', 'x']);
  const K = kx ? mono(k, 'x') : String(k);
  const A = kies(['x^2', 'x', mono(rnd(2, 4), 'x')]), B = String(rnd(1, 6));
  const r = rnd(0, 2), op = r === 0 ? '+' : '-';
  const bin = r < 2 ? `(${A} ${op} ${B})^2` : `(${A} + ${B})(${A} - ${B})`;
  const s = `${K}${bin}`;
  return uitwerk(soort, s, [`\\text{eerst } ${etx(bin)} = ${vtx(bin)}`, `${etx(s)} = ${etx(K)} \\cdot \\left(${vtx(bin)}\\right)`, `= ${vtx(s)}`]);
}
// (A ± B)² − (C + D)(C − D)  of  (A + B)² + (A − B)²
function verschilVanTwee(soort) {
  const a = rnd(1, 3), b = rnd(1, 6), c = rnd(1, 2), d = rnd(1, 6);
  const A = mono(a, 'x'), C = mono(c, 'x');
  const op = kies(['+', '-']);
  const p1 = `(${A} ${op} ${b})^2`, p2 = `(${C} + ${d})(${C} - ${d})`;
  const s = `${p1} - ${p2}`;
  const neg = vtx(`-(${p2})`);
  return uitwerk(soort, s, [`${etx(s)} = \\left(${vtx(p1)}\\right) - \\left(${vtx(p2)}\\right)`,
    `= ${vtx(p1)} ${neg.startsWith('-') ? neg : '+ ' + neg} \\qquad \\text{(minteken voor de haakjes!)}`,
    `= ${vtx(s)}`]);
}
const D7 = {
  nr: 7, titel: 'Werk uit en herleid', kort: 'Een factor voor het merkwaardig product, of twee producten na elkaar.', rekenmachine: false, opdracht: 'Werk de haakjes weg en herleid. Gebruik daarbij een merkwaardig product.',
  theorie: `${FORMULES}
    <div class="kader werk"><div class="kader-titel">Staat er een factor voor?</div>
      <p>Werk <b>eerst</b> het merkwaardig product uit. Vermenigvuldig daarna elke term met de factor ervoor.</p>
      <p class="midden">$-2(x^2+3)^2 = -2(x^4 + 6x^2 + 9) = -2x^4 - 12x^2 - 18$</p>
      <p class="midden">$-4x(x^2-2x)^2 = -4x(x^4 - 4x^3 + 4x^2) = -4x^5 + 16x^4 - 16x^3$</p></div>
    <div class="kader eig"><div class="kader-titel">Minteken voor een product</div>
      <p>Werk beide producten uit en zet het tweede tussen haakjes. Een minteken voor de haakjes verandert <b>alle</b> tekens:</p>
      <p class="midden">$(2x-3)^2 - (x+4)(x-4) = (4x^2 - 12x + 9) - (x^2 - 16) = 4x^2 - 12x + 9 - x^2 + 16 = 3x^2 - 12x + 25$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '5(x^2+1)^2', stappen: ['= 5(x^4 + 2x^2 + 1)', '= 5x^4 + 10x^2 + 5'] },
    { tex: '-3(x+2)(x-2)', stappen: ['= -3(x^2 - 4)', '= -3x^2 + 12'] },
    { tex: '(x+5)^2 - (x+1)(x-1)', stappen: ['= (x^2 + 10x + 25) - (x^2 - 1)', '= x^2 + 10x + 25 - x^2 + 1', '= 10x + 26'] },
  ],
  soorten: {
    factor: { naam: 'Factor ervoor', gen() { return metFactor('factor'); } },
    twee: { naam: 'Twee producten', gen() { return verschilVanTwee('twee'); } },
  },
  oefenMix: [['factor', 2], ['twee', 1]],
  test: [['factor', 6], ['twee', 4]], testSchudden: true,
};

// ===================================================================
//  B · ONTBINDEN IN FACTOREN
// ===================================================================

// k·(inner): inner = lijst termen (tekst) met ggd 1
function gemFactor(soort, G, inner) {
  const f = `${G}(${som(inner)})`;
  return ontbind(soort, f, [`\\text{gemeenschappelijke factor: } ${etx(G)}`, `${vtx(f)} = ${etx(f)}`, `\\text{controle: } ${etx(f)} = ${vtx(f)} \\;✓`]);
}
// twee coëfficiënten met ggd 1
function coprime(maxA, maxB) { for (;;) { const a = rnd(1, maxA), b = rnd(1, maxB); if (ggd(a, b) === 1) return [a, b]; } }
function coprime2(maxA, maxB) { for (;;) { const a = rnd(2, maxA), b = rnd(1, maxB); if (ggd(a, b) === 1) return [a, b]; } }
const D8 = {
  nr: 8, titel: 'Gemeenschappelijke factor: een getal', kort: 'Breng het grootste gemeenschappelijke getal buiten haakjes.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader def"><div class="kader-titel">Ontbinden in factoren</div>
      <p>Ontbinden in factoren is het <b>omgekeerde</b> van een product uitwerken: je herschrijft een veelterm als een <b>product</b> van eenvoudigere factoren.</p></div>
    <div class="kader werk"><div class="kader-titel">Gemeenschappelijke factor buiten haakjes brengen</div>
      <p class="midden">$ac + bc = c(a+b)$</p>
      <p>Zoek de <b>grootste</b> factor die in elke term zit. Zet die voor de haakjes en deel elke term erdoor.</p>
      <p class="midden">$4a - 20 = 4(a-5) \\qquad 6a - 18 = 6(a-3)$</p>
      <p>Zijn alle termen negatief, breng dan ook het minteken buiten haakjes: $-2a - 2b = -2(a+b)$.</p>
      <p class="klein"><b>Controle:</b> werk je antwoord terug uit. Je moet de opgave terugvinden.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '5x + 5y', stappen: ['\\text{gemeenschappelijke factor: } 5', '= 5(x + y)'] },
    { tex: '7x + 14', stappen: ['\\text{gemeenschappelijke factor: } 7', '= 7(x + 2) \\qquad (14 = 7 \\cdot 2)'] },
    { tex: '12x - 18', stappen: ['\\text{gemeenschappelijke factor: } 6 \\;\\text{(niet 2 of 3: neem de grootste)}', '= 6(2x - 3)'] },
    { tex: '-5x + 15', stappen: ['\\text{gemeenschappelijke factor: } -5', '= -5(x - 3)'] },
  ],
  soorten: {
    getal: { naam: 'ax + b', gen() { const k = rnd(2, 9), [a, b] = coprime(5, 9); const v = LETTER(); return gemFactor('getal', String(k), [mono(a, v), String(teken() * b)]); } },
    letters: { naam: 'ax + ay', gen() { const k = rnd(2, 9), [u, v] = TWEE(); return gemFactor('letters', String(k), [u, kies(['', '-']) + v]); } },
    drie: { naam: 'Drie termen', gen() { const k = rnd(2, 6); let a, b, c; do { a = rnd(1, 5); b = rnd(1, 5); c = rnd(1, 5); } while (ggd(ggd(a, b), c) !== 1); return gemFactor('drie', mono(k, 'x'), [mono(a, 'a'), mono(teken() * b, 'b'), mono(teken() * c, 'c')]); } },
    min: { naam: 'Minteken buiten haakjes', gen() { const k = rnd(2, 9), [a, b] = coprime(5, 9); const v = LETTER(); return gemFactor('min', String(-k), [mono(a, v), String(teken() * b)]); } },
  },
  oefenMix: [['getal', 3], ['letters', 1], ['drie', 1], ['min', 1]],
  test: [['getal', 4], ['letters', 2], ['drie', 2], ['min', 2]], testSchudden: true,
};

const D9 = {
  nr: 9, titel: 'Gemeenschappelijke factor: met letters', kort: 'Ook letters en machten kunnen gemeenschappelijk zijn.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader werk"><div class="kader-titel">Gemeenschappelijke factor met letters</div>
      <p>Kijk naar het <b>getal</b> én naar de <b>letters</b>. Een letter is gemeenschappelijk als ze in elke term staat; neem ze met de <b>kleinste exponent</b>.</p>
      <p class="midden">$6x^2 + 9x = 3x(2x + 3)$</p>
      <p class="midden">$15x^2y - 10xy^2 = 5xy(3x - 2y)$</p>
      <p class="midden">$-6a^3 + 9a^2 - 12a = -3a(2a^2 - 3a + 4)$</p></div>
    <div class="kader eig"><div class="kader-titel">Ook een veelterm kan gemeenschappelijk zijn</div>
      <p class="midden">$2x(a-4) + 5(a-4) = (a-4)(2x+5)$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '4x^2 - 8x', stappen: ['\\text{gemeenschappelijke factor: } 4x', '= 4x(x - 2)'] },
    { tex: '12a^2b - 18ab^2', stappen: ['\\text{gemeenschappelijke factor: } 6ab', '= 6ab(2a - 3b)'] },
    { tex: '3x^3 - 6x^2 + 9x', stappen: ['\\text{gemeenschappelijke factor: } 3x', '= 3x(x^2 - 2x + 3)'] },
    { tex: 'x(a-3) - y(a-3)', stappen: ['\\text{gemeenschappelijke factor: } (a - 3)', '= (a - 3)(x - y)'] },
  ],
  soorten: {
    eenletter: { naam: 'ax² + bx', gen() {
      const k = rnd(1, 6), [a, b] = coprime(5, 9), v = LETTER(), e = rnd(1, 2);
      const G = mono(k, e === 1 ? v : `${v}^2`);
      return gemFactor('eenletter', G, [mono(a, v), String(teken() * b)]);
    } },
    tweeletters: { naam: 'Met twee letters', gen() {
      const k = rnd(1, 6), [u, v] = TWEE();
      const G = mono(k, `${u}${v}`);
      const [a, b] = coprime(5, 7);
      return gemFactor('tweeletters', G, [mono(a, u), mono(teken() * b, v)]);
    } },
    drieterm: { naam: 'Drie termen', gen() {
      let a, b, c; do { a = rnd(1, 4); b = nz(-6, 6); c = nz(-9, 9); } while (ggd(ggd(a, b), c) !== 1 || isKw(b * b - 4 * a * c));
      const k = teken() * rnd(1, 5), v = kies(['x', 'a']);
      return gemFactor('drieterm', mono(k, v), [mono(a, `${v}^2`), mono(b, v), String(c)]);
    } },
    veelterm: { naam: 'Gemeenschappelijke veelterm', gen() {
      const v = kies(['x', 'a']), p = nz(-6, 6), [m, n] = coprime(4, 6), w = kies(['y', 'b']);
      const F = `(${lin(v, p)})`, A = mono(m, w), B = String(teken() * n);
      const opg = `${etx(A)}${etx(F)} ${B[0] === '-' ? '-' : '+'} ${B.replace('-', '')}${etx(F)}`;
      const f = `${F}(${som([A, B])})`;
      return ontbind('veelterm', f, [`\\text{gemeenschappelijke factor: } ${etx(F)}`, `= ${etx(f)}`], opg);
    } },
  },
  oefenMix: [['eenletter', 2], ['tweeletters', 2], ['drieterm', 1], ['veelterm', 1]],
  test: [['eenletter', 3], ['tweeletters', 3], ['drieterm', 2], ['veelterm', 2]], testSchudden: true,
};

const D10 = {
  nr: 10, titel: 'Ontbinden door groepering', kort: 'Vier termen: groepeer per twee en zoek een gemeenschappelijke factor.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader werk"><div class="kader-titel">Ontbinden door groepering</div>
      <p>Heeft de veelterm <b>vier termen</b>, maak dan twee groepen van twee. Breng in elke groep de gemeenschappelijke factor buiten haakjes.
      Krijg je in beide groepen dezelfde factor tussen haakjes, dan breng je die op zijn beurt buiten haakjes.</p>
      <p class="midden">$ax + ay + bx + by = a(x+y) + b(x+y) = (x+y)(a+b)$</p>
      <p class="midden">$x^3 + 2x^2 - 5x - 10 = x^2(x+2) - 5(x+2) = (x+2)(x^2-5)$</p>
      <p class="let-op">Let op het minteken bij de tweede groep: $-5x - 10 = -5(x + 2)$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'ax + ay + bx + by', stappen: ['= a(x + y) + b(x + y)', '= (x + y)(a + b)'] },
    { tex: '3ax + 6a + bx + 2b', stappen: ['= 3a(x + 2) + b(x + 2)', '= (x + 2)(3a + b)'] },
    { tex: 'x^3 - 3x^2 + 4x - 12', stappen: ['= x^2(x - 3) + 4(x - 3)', '= (x - 3)(x^2 + 4)'] },
  ],
  soorten: {
    letters: { naam: 'ax + ay + bx + by', gen() {
      // (x + p)(m·a + n·b) uitgewerkt in de volgorde  m·a·x + m·p·a + n·b·x + n·p·b
      const p = nz(-7, 7), [m, n] = coprime(4, 5), sn = teken();
      const t = [mono(m, 'ax'), mono(m * p, 'a'), mono(sn * n, 'bx'), mono(sn * n * p, 'b')];
      const f = `(${lin('x', p)})(${som([mono(m, 'a'), mono(sn * n, 'b')])})`;
      const g1 = `${mono(m, 'a')}(${lin('x', p)})`, g2 = `${mono(sn * n, 'b')}(${lin('x', p)})`;
      return ontbind('letters', f, [`= ${etx(g1)} ${sn < 0 ? '' : '+'} ${etx(g2)}`, `= ${etx(f)}`], etx(som(t)));
    } },
    derde: { naam: 'x³ + ax² + bx + ab', gen() {
      // (x + p)(x² + q) = x³ + p·x² + q·x + p·q,  q geen negatief kwadraat (anders verder te ontbinden)
      const p = nz(-6, 6); let q; do { q = nz(-9, 9); } while (q < 0 && isKw(-q));
      const t = [mono(1, 'x^3'), mono(p, 'x^2'), mono(q, 'x'), String(p * q)];
      const f = `(${lin('x', p)})(${som(['x^2', String(q)])})`;
      return ontbind('derde', f, [`= ${etx(`x^2(${lin('x', p)})`)} ${q < 0 ? '-' : '+'} ${etx(`${Math.abs(q)}(${lin('x', p)})`)}`, `= ${etx(f)}`], etx(som(t)));
    } },
  },
  oefenMix: [['letters', 1], ['derde', 1]],
  test: [['letters', 5], ['derde', 5]], testSchudden: true,
};

// A² − B²  = (A − B)(A + B)
function verschilKw(soort, A, B, omgekeerd = false) {
  const f = omgekeerd ? `(${B} - ${A})(${B} + ${A})` : `(${A} - ${B})(${A} + ${B})`;
  const s = omgekeerd ? `${vtx(`(${B})^2`)} - ${vtx(`(${A})^2`)}` : vtx(f);
  return ontbind(soort, f, [`= ${omgekeerd ? `${P(B)}^2 - ${P(A)}^2` : `${P(A)}^2 - ${P(B)}^2`}`, `= ${etx(f)}`], s);
}
const D11 = {
  nr: 11, titel: 'Verschil van twee kwadraten', kort: 'a² − b² = (a + b)(a − b)', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader def"><div class="kader-titel">Verschil van twee kwadraten herkennen</div>
      <p class="midden">$a^2 - b^2 = (a+b)(a-b)$</p>
      <p>Twee termen, allebei een kwadraat, met een <b>min</b> ertussen. Zoek waarvan elke term het kwadraat is.</p>
      <p class="midden">$x^2 - 16 = x^2 - 4^2 = (x+4)(x-4)$</p>
      <p class="midden">$9x^2 - 49 = (3x)^2 - 7^2 = (3x-7)(3x+7)$</p>
      <p class="let-op">Een <b>som</b> van twee kwadraten, zoals $x^2 + 16$, kan je niet ontbinden.</p></div>
    <div class="kader eig"><div class="kader-titel">Soms twee keer</div>
      <p class="midden">$x^4 - 16 = (x^2-4)(x^2+4) = (x-2)(x+2)(x^2+4)$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'x^2 - 9', stappen: ['= x^2 - 3^2', '= (x + 3)(x - 3)'] },
    { tex: '4a^2 - 81b^2', stappen: ['= (2a)^2 - (9b)^2', '= (2a + 9b)(2a - 9b)'] },
    { tex: '100 - x^2', stappen: ['= 10^2 - x^2', '= (10 + x)(10 - x)'] },
    { tex: 'a^4 - b^4', stappen: ['= (a^2)^2 - (b^2)^2 = (a^2 - b^2)(a^2 + b^2)', '= (a - b)(a + b)(a^2 + b^2)'] },
  ],
  soorten: {
    basis: { naam: 'x² − a²', gen() { return verschilKw('basis', LETTER(), String(rnd(1, 12))); } },
    coef: { naam: 'a²x² − b²', gen() { const [a, b] = coprime2(9, 11); return verschilKw('coef', mono(a, LETTER()), String(b)); } },
    twee: { naam: 'a²x² − b²y²', gen() { const [a, b] = coprime(9, 9); const [u, v] = TWEE(); return verschilKw('twee', mono(a, u), mono(b, v)); } },
    getalvoor: { naam: 'a² − x²', gen() { const [b, a] = coprime(12, 5); return verschilKw('getalvoor', mono(a, LETTER()), String(b), true); } },
    vierde: { naam: 'x⁴ − a⁴', gen() {
      const a = rnd(1, 3), v = kies(['x', 'a']);
      const f = `(${lin(v, -a)})(${lin(v, a)})(${v}^2 + ${a * a})`;
      return ontbind('vierde', f, [`= (${v}^2)^2 - ${a * a}^2 = ${etx(`(${v}^2 - ${a * a})(${v}^2 + ${a * a})`)}`, `= ${etx(f)}`]);
    } },
  },
  oefenMix: [['basis', 2], ['coef', 2], ['twee', 2], ['getalvoor', 1], ['vierde', 1]],
  test: [['basis', 2], ['coef', 3], ['twee', 2], ['getalvoor', 2], ['vierde', 1]], testSchudden: true,
};

// A² ± 2AB + B²  = (A ± B)²
function volkomen(soort, A, B, op) {
  const f = `(${A} ${op} ${B})^2`;
  return ontbind(soort, f, [`= ${P(A)}^2 ${op} 2 \\cdot ${etx(A)} \\cdot ${etx(B)} + ${P(B)}^2`, `= ${etx(f)}`]);
}
const D12 = {
  nr: 12, titel: 'Volkomen kwadraat herkennen', kort: 'a² ± 2ab + b² = (a ± b)²', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat van een som of verschil herkennen</div>
      <p class="midden">$a^2 + 2ab + b^2 = (a+b)^2 \\qquad a^2 - 2ab + b^2 = (a-b)^2$</p>
      <p>Drie termen: twee ervan zijn een <b>kwadraat</b> (en positief). Controleer of de derde term gelijk is aan <b>twee keer het product</b>. Het teken van de middelste term bepaalt of het een som of een verschil is.</p>
      <p class="midden">$x^2 + 6x + 9 = x^2 + 2 \\cdot x \\cdot 3 + 3^2 = (x+3)^2$</p>
      <p class="midden">$4x^2 - 20x + 25 = (2x)^2 - 2 \\cdot 2x \\cdot 5 + 5^2 = (2x-5)^2$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'a^2 + 8a + 16', stappen: ['= a^2 + 2 \\cdot a \\cdot 4 + 4^2', '= (a + 4)^2'] },
    { tex: 'p^2 - 10p + 25', stappen: ['= p^2 - 2 \\cdot p \\cdot 5 + 5^2', '= (p - 5)^2'] },
    { tex: '9x^2 + 24xy + 16y^2', stappen: ['= (3x)^2 + 2 \\cdot 3x \\cdot 4y + (4y)^2', '= (3x + 4y)^2'] },
    { tex: 'x^4 + 2x^2 + 1', stappen: ['= (x^2)^2 + 2 \\cdot x^2 \\cdot 1 + 1^2', '= (x^2 + 1)^2'] },
  ],
  soorten: {
    basis: { naam: 'x² ± 2ax + a²', gen() { return volkomen('basis', LETTER(), String(rnd(1, 12)), kies(['+', '-'])); } },
    coef: { naam: 'a²x² ± 2abx + b²', gen() { const [a, b] = coprime2(7, 9); return volkomen('coef', mono(a, LETTER()), String(b), kies(['+', '-'])); } },
    twee: { naam: 'Met twee letters', gen() { const [a, b] = coprime(5, 5); const [u, v] = TWEE(); return volkomen('twee', mono(a, u), mono(b, v), kies(['+', '-'])); } },
    macht: { naam: 'x⁴ ± 2ax² + a²', gen() { const op = kies(['+', '-']); return volkomen('macht', 'x^2', String(op === '+' ? rnd(1, 6) : kies([2, 3, 5, 6])), op); } },
  },
  oefenMix: [['basis', 2], ['coef', 2], ['twee', 1], ['macht', 1]],
  test: [['basis', 3], ['coef', 3], ['twee', 2], ['macht', 2]], testSchudden: true,
};

// x² + bx + c = (x + p)(x + q)
function productSom(soort, p, q, v = 'x') {
  const f = `(${lin(v, p)})(${lin(v, q)})`;
  const b = p + q, c = p * q;
  return ontbind(soort, f, [`\\text{zoek twee getallen met som } ${tg(b)} \\text{ en product } ${tg(c)}`, `${h(p)} + ${h(q)} = ${tg(b)} \\quad\\text{en}\\quad ${h(p)} \\cdot ${h(q)} = ${tg(c)}`, `= ${etx(f)}`]);
}
function pqPaar(teken) { // teken: 'pp' beide positief, 'mm' beide negatief, 'pm' verschillend
  for (;;) {
    let p = rnd(1, 12), q = rnd(1, 12);
    if (teken === 'mm') { p = -p; q = -q; }
    if (teken === 'pm') q = -q;
    if (p === q || p + q === 0 || Math.abs(p * q) > 72) continue;
    return [p, q];
  }
}
const D13 = {
  nr: 13, titel: 'Product-som methode', kort: 'x² + bx + c: zoek twee getallen met som b en product c.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader def"><div class="kader-titel">Product-som methode</div>
      <p>Herken je géén merkwaardig product, dan zoek je twee getallen $p$ en $q$ waarvan de <b>som</b> gelijk is aan $b$ en het <b>product</b> gelijk aan $c$.</p>
      <p class="midden">$x^2 + bx + c = (x + p)(x + q)$ &nbsp; met $p + q = b$ en $p \\cdot q = c$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$x^2 + 9x + 14$: twee getallen met som $9$ en product $14$ zijn $2$ en $7$.</p>
      <p class="midden">$x^2 + 9x + 14 = (x+2)(x+7)$</p></div>
    <div class="kader eig"><div class="kader-titel">Opgelet bij mintekens</div>
      <ul><li>Product <b>positief</b>: beide getallen hebben hetzelfde teken als de som. $x^2 - 12x + 27$: som $-12$, product $27$ → $-3$ en $-9$ → $(x-3)(x-9)$.</li>
      <li>Product <b>negatief</b>: één getal is positief, één negatief. $x^2 + x - 30$: som $1$, product $-30$ → $6$ en $-5$ → $(x+6)(x-5)$.</li></ul></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'x^2 + 5x + 6', stappen: ['\\text{som } 5,\\ \\text{product } 6 \\;\\Rightarrow\\; 2 \\text{ en } 3', '= (x + 2)(x + 3)'] },
    { tex: 'x^2 - 3x - 10', stappen: ['\\text{som } -3,\\ \\text{product } -10 \\;\\Rightarrow\\; -5 \\text{ en } 2', '= (x - 5)(x + 2)'] },
    { tex: 'a^2 - 9a + 20', stappen: ['\\text{som } -9,\\ \\text{product } 20 \\;\\Rightarrow\\; -4 \\text{ en } -5', '= (a - 4)(a - 5)'] },
  ],
  soorten: {
    plus: { naam: 'Beide positief', gen() { const [p, q] = pqPaar('pp'); return productSom('plus', p, q, kies(['x', 'x', 'a', 'p'])); } },
    min: { naam: 'Beide negatief', gen() { const [p, q] = pqPaar('mm'); return productSom('min', p, q, kies(['x', 'x', 'a', 'p'])); } },
    gemengd: { naam: 'Product negatief', gen() { const [p, q] = pqPaar('pm'); return productSom('gemengd', p, q, kies(['x', 'x', 'a', 'p'])); } },
  },
  oefenMix: [['plus', 1], ['min', 1], ['gemengd', 2]],
  test: [['plus', 3], ['min', 3], ['gemengd', 4]], testSchudden: true,
};

const D14soorten = {
  kw: { naam: 'k(x² − a²)', gen() { const k = rnd(2, 6), a = rnd(1, 6); const f = `${k}(${lin('x', -a)})(${lin('x', a)})`;
    return ontbind('kw', f, [`= ${etx(`${k}(x^2 - ${a * a})`)} \\qquad \\text{(gemeenschappelijke factor)}`, `= ${etx(f)} \\qquad \\text{(verschil van kwadraten)}`]); } },
  vk: { naam: 'k(x ± a)²', gen() { const k = rnd(2, 5), a = nz(-6, 6); const f = `${k}(${lin('x', a)})^2`;
    return ontbind('vk', f, [`= ${k}(${vtx(`(${lin('x', a)})^2`)}) \\qquad \\text{(gemeenschappelijke factor)}`, `= ${etx(f)} \\qquad \\text{(volkomen kwadraat)}`]); } },
  x3: { naam: 'x³ − a²x', gen() { const a = rnd(1, 7); const f = `x(${lin('x', -a)})(${lin('x', a)})`;
    return ontbind('x3', f, [`= x(x^2 - ${a * a})`, `= ${etx(f)}`]); } },
  ps: { naam: 'k(x² + bx + c)', gen() { const k = rnd(2, 4); const [p, q] = pqPaar(kies(['pp', 'mm', 'pm'])); const f = `${k}(${lin('x', p)})(${lin('x', q)})`;
    return ontbind('ps', f, [`= ${k}(${vtx(`(${lin('x', p)})(${lin('x', q)})`)}) \\qquad \\text{(gemeenschappelijke factor)}`, `\\text{som } ${tg(p + q)},\\ \\text{product } ${tg(p * q)}`, `= ${etx(f)} \\qquad \\text{(product-som)}`]); } },
  xvk: { naam: 'x³ ± 2ax² + a²x', gen() { const a = nz(-6, 6); const f = `x(${lin('x', a)})^2`;
    return ontbind('xvk', f, [`= x(${vtx(`(${lin('x', a)})^2`)})`, `= ${etx(f)}`]); } },
  min: { naam: '−x² + bx + c', gen() { const [p, q] = pqPaar('pm'); const f = `-(${lin('x', p)})(${lin('x', q)})`;
    return ontbind('min', f, [`= -(${vtx(`(${lin('x', p)})(${lin('x', q)})`)}) \\qquad \\text{(minteken buiten haakjes)}`, `= ${etx(f)}`]); } },
  vierde: { naam: 'x⁴ − bx² + c', gen() { const [p, q] = kies([[1, 2], [1, 3], [2, 3]]); const f = `(x - ${p})(x + ${p})(x - ${q})(x + ${q})`;
    return ontbind('vierde', f, [`\\text{product-som met } x^2:\\ \\text{som } ${-(p * p + q * q)},\\ \\text{product } ${p * p * q * q}`, `= (x^2 - ${p * p})(x^2 - ${q * q})`, `= ${etx(f)}`]); } },
  kwmin: { naam: '(x − a)² − b²', gen() { const a = nz(-5, 5), b = rnd(1, 6); if (b === Math.abs(a)) return D14soorten.kwmin.gen();
    const f = `(${lin('x', a - b)})(${lin('x', a + b)})`;
    return ontbind('kwmin', f, [`= \\left(${etx(lin('x', a))}\\right)^2 - ${b}^2`, `= \\left(${etx(lin('x', a))} - ${b}\\right)\\left(${etx(lin('x', a))} + ${b}\\right)`, `= ${etx(f)}`], `${etx(`(${lin('x', a)})^2`)} - ${b * b}`); } },
};
const D14 = {
  nr: 14, titel: 'Volledig ontbinden (stappenplan)', kort: 'Eerst een gemeenschappelijke factor, dan verder ontbinden.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `${STAPPENPLAN}
    <div class="kader werk"><div class="kader-titel">Volledig ontbinden</div>
      <p>Na de eerste stap kan je vaak nog <b>verder</b> ontbinden. Ga door tot geen enkele factor nog te ontbinden is.</p>
      <p class="midden">$3x^2 - 75 = 3(x^2 - 25) = 3(x-5)(x+5)$</p>
      <p class="midden">$2x^3 - 12x^2 + 18x = 2x(x^2 - 6x + 9) = 2x(x-3)^2$</p>
      <p class="midden">$3x^3 - 12x^2 - 36x = 3x(x^2 - 4x - 12) = 3x(x-6)(x+2)$</p>
      <p class="midden">$(x-3)^2 - 16 = (x - 3 - 4)(x - 3 + 4) = (x-7)(x+1)$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '2x^2 - 8', stappen: ['= 2(x^2 - 4)', '= 2(x - 2)(x + 2)'] },
    { tex: 'x^3 - 6x^2 + 9x', stappen: ['= x(x^2 - 6x + 9)', '= x(x - 3)^2'] },
    { tex: '2x^2 + 4x - 30', stappen: ['= 2(x^2 + 2x - 15)', '\\text{som } 2,\\ \\text{product } -15 \\;\\Rightarrow\\; 5 \\text{ en } -3', '= 2(x + 5)(x - 3)'] },
    { tex: 'x^4 - 13x^2 + 36', stappen: ['= (x^2 - 4)(x^2 - 9)', '= (x - 2)(x + 2)(x - 3)(x + 3)'] },
  ],
  soorten: D14soorten,
  oefenMix: [['kw', 2], ['vk', 2], ['x3', 1], ['ps', 2], ['xvk', 1], ['min', 1], ['vierde', 1], ['kwmin', 1]],
  test: [['kw', 2], ['vk', 1], ['x3', 1], ['ps', 2], ['xvk', 1], ['min', 1], ['vierde', 1], ['kwmin', 1]], testSchudden: true,
};

// ===================================================================
//  C · DE DISCRIMINANTMETHODE
// ===================================================================

// vergelijking met D > 0 en mooie (gehele of rationale) oplossingen: (m·x − r)(n·x − s) = 0
function mooieVgl(geheel) {
  for (;;) {
    const m = geheel ? 1 : kies([1, 2, 3]), n = geheel ? kies([1, 1, 2]) : kies([1, 2, 3]);
    const r = nz(-7, 7), s = nz(-7, 7);
    const a = m * n, b = -(m * s + n * r), c = r * s;
    if (b * b - 4 * a * c <= 0 || ggd(ggd(a, b), c) !== 1) continue;
    if (geheel && (r % m || s % n)) continue;
    return [a, b, c];
  }
}
function vglD0() { for (;;) { const m = kies([1, 1, 2, 3]), r = nz(-7, 7), k = kies([1, 1, 2]); if (ggd(m, r) !== 1) continue; return [k * m * m, -2 * k * m * r, k * r * r]; } }
function vglNeg() { for (;;) { const a = kies([1, 1, 2, 3]), b = rnd(-6, 6), c = rnd(1, 12); if (b * b - 4 * a * c < 0) return [a, b, c * (a > 0 ? 1 : -1)]; } }
function vglIrr() { for (;;) { const a = kies([1, 1, 2, 3]), b = rnd(-7, 7), c = nz(-8, 8); const D = b * b - 4 * a * c; if (D > 0 && !isKw(D) && ![0, 1, 2].some(i => W.grensgeval(i === 0 ? (-b + Math.sqrt(D)) / (2 * a) : (-b - Math.sqrt(D)) / (2 * a), 2))) return [a, b, c]; } }

const AANTAL = { soort: 'keuze', opties: [{ k: '2', l: '\\text{2 oplossingen}' }, { k: '1', l: '\\text{1 oplossing}' }, { k: '0', l: '\\text{geen oplossingen}' }] };
function vraagD(soort, [a, b, c]) {
  const r = discrUitleg(a, b, c);
  return { soort, tex: vgl(a, b, c), antw: { soort: 'delen', delen: [
    { label: 'D', antw: { soort: 'getal', waarde: r.D } },
    { label: '<span>Aantal oplossingen</span>', html: true, antw: { ...AANTAL, juist: r.D > 0 ? '2' : r.D === 0 ? '1' : '0' } }] }, uitleg: r.L.slice(0, 3) };
}
function vraagV(soort, [a, b, c], metD = true, opg = null, voorL = []) {
  const r = discrUitleg(a, b, c);
  const delen = [{ label: '<span>Oplossingen</span>', html: true, antw: Vantw(r) }];
  if (metD) delen.unshift({ label: 'D', antw: { soort: 'getal', waarde: r.D } });
  return { soort, tex: opg || vgl(a, b, c), antw: { soort: 'delen', delen }, uitleg: [...voorL, ...r.L] };
}

const D15 = {
  nr: 15, titel: 'De discriminant en het aantal oplossingen', kort: 'Bereken D = b² − 4ac en bepaal hoeveel oplossingen er zijn.', rekenmachine: false, opdracht: 'Bereken de discriminant en bepaal het aantal oplossingen.',
  theorie: `<div class="kader def"><div class="kader-titel">Tweedegraadsvergelijking</div>
      <p>Een tweedegraadsvergelijking (of vierkantsvergelijking) kan je herleiden naar de <b>standaardvorm</b>:</p>
      <p class="midden">$ax^2 + bx + c = 0$ &nbsp; met $a, b, c \\in \\mathbb{R}$ en $a \\neq 0$</p></div>${DISCR}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$x^2 + x - 30 = 0$: $\\;a = 1,\\ b = 1,\\ c = -30$</p>
      <p class="midden">$D = 1^2 - 4 \\cdot 1 \\cdot (-30) = 1 + 120 = 121 > 0$ &nbsp;→ 2 oplossingen</p>
      <p class="let-op">Reken het teken zorgvuldig uit: één tekenfout verandert het aantal oplossingen. Zet negatieve getallen tussen haakjes: $(-4)^2 = 16$.</p></div>`,
  voorbeelden: [
    { tex: 'x^2 - 4x + 4 = 0', stappen: ['a = 1,\\; b = -4,\\; c = 4', 'D = (-4)^2 - 4 \\cdot 1 \\cdot 4 = 16 - 16 = 0', 'D = 0 \\;\\Rightarrow\\; \\text{1 oplossing}'] },
    { tex: 'x^2 + 2x + 5 = 0', stappen: ['a = 1,\\; b = 2,\\; c = 5', 'D = 2^2 - 4 \\cdot 1 \\cdot 5 = 4 - 20 = -16', 'D < 0 \\;\\Rightarrow\\; \\text{geen oplossingen}'] },
    { tex: '2x^2 - 3x - 2 = 0', stappen: ['a = 2,\\; b = -3,\\; c = -2', 'D = (-3)^2 - 4 \\cdot 2 \\cdot (-2) = 9 + 16 = 25', 'D > 0 \\;\\Rightarrow\\; \\text{2 oplossingen}'] },
  ],
  soorten: {
    twee: { naam: 'D > 0', gen() { return vraagD('twee', mooieVgl(false)); } },
    een: { naam: 'D = 0', gen() { return vraagD('een', vglD0()); } },
    geen: { naam: 'D < 0', gen() { return vraagD('geen', vglNeg()); } },
  },
  oefenMix: [['twee', 2], ['een', 1], ['geen', 1]],
  test: [['twee', 4], ['een', 3], ['geen', 3]], testSchudden: true,
};

const D16 = {
  nr: 16, titel: 'Oplossen met de discriminant', kort: 'D is een kwadraat: de oplossingen zijn mooie getallen.', rekenmachine: false, opdracht: OPDR_D,
  theorie: `${DISCR}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$x^2 + x - 30 = 0$: $\\;D = 1^2 - 4 \\cdot 1 \\cdot (-30) = 121$, en $\\sqrt{121} = 11$.</p>
      <p class="midden">$x_1 = \\dfrac{-1 + 11}{2} = 5 \\qquad x_2 = \\dfrac{-1 - 11}{2} = -6 \\qquad V = \\{-6 ; 5\\}$</p>
      <p class="klein">Is de oplossing een breuk, vereenvoudig die dan: $\\dfrac{-2}{6} = -\\dfrac{1}{3}$. Je mag ze ook als kommagetal geven als dat kan: $-\\dfrac{1}{2} = -0{,}5$.</p></div>${INTYPEN_V}`,
  voorbeelden: [
    { tex: 'x^2 - 5x + 6 = 0', stappen: ['D = (-5)^2 - 4 \\cdot 1 \\cdot 6 = 1', 'x_1 = \\dfrac{5 + 1}{2} = 3 \\qquad x_2 = \\dfrac{5 - 1}{2} = 2', 'V = \\{2 ; 3\\}'] },
    { tex: '3x^2 - 2x - 1 = 0', stappen: ['D = (-2)^2 - 4 \\cdot 3 \\cdot (-1) = 16', 'x_1 = \\dfrac{2 + 4}{6} = 1 \\qquad x_2 = \\dfrac{2 - 4}{6} = -\\dfrac{1}{3}', 'V = \\{-\\frac{1}{3} ; 1\\}'] },
    { tex: '2x^2 + 5x + 3 = 0', stappen: ['D = 5^2 - 4 \\cdot 2 \\cdot 3 = 1', 'x_1 = \\dfrac{-5 + 1}{4} = -1 \\qquad x_2 = \\dfrac{-5 - 1}{4} = -\\dfrac{3}{2}', 'V = \\{-\\frac{3}{2} ; -1\\}'] },
  ],
  soorten: {
    geheel: { naam: 'Gehele oplossingen', gen() { return vraagV('geheel', mooieVgl(true)); } },
    breuk: { naam: 'Oplossingen met een breuk', gen() { for (;;) { const v = mooieVgl(false); if (v[0] > 1) return vraagV('breuk', v); } } },
  },
  oefenMix: [['geheel', 2], ['breuk', 1]],
  test: [['geheel', 6], ['breuk', 4]], testSchudden: true,
};

// niet in standaardvorm: a1x² + b1x + c1 = a2x² + b2x + c2
function herleid() {
  const [a, b, c] = kies([mooieVgl(true), mooieVgl(false), vglD0(), vglNeg()]);
  const a2 = nz(-3, 3), b2 = rnd(-6, 6), c2 = rnd(-9, 9);
  const L1 = [mono(a + a2, 'x^2'), mono(b + b2, 'x'), String(c + c2)].filter((t, i) => [a + a2, b + b2, c + c2][i] !== 0);
  const L2 = [mono(a2, 'x^2'), mono(b2, 'x'), String(c2)].filter((t, i) => [a2, b2, c2][i] !== 0);
  if (a + a2 === 0 || !L1.length || !L2.length) return herleid();
  const opg = `${etx(som(L1))} = ${etx(som(L2))}`;
  return vraagV('herleid', [a, b, c], false, opg, [`\\text{alles naar het linkerlid: } ${vgl(a, b, c)}`]);
}
const D17 = {
  nr: 17, titel: 'Discriminant: alle gevallen', kort: 'D = 0, D < 0, D geen kwadraat en eerst herleiden.', rekenmachine: true, opdracht: OPDR_D,
  theorie: `${DISCR}
    <div class="kader werk"><div class="kader-titel">De drie gevallen</div>
      <p><b>D = 0:</b> $4x^2 - 28x + 49 = 0$: $\\;D = (-28)^2 - 4 \\cdot 4 \\cdot 49 = 0$, dus $x = \\dfrac{28}{8} = \\dfrac{7}{2}$ en $V = \\{\\frac{7}{2}\\}$.</p>
      <p><b>D &lt; 0:</b> $x^2 + 4x + 8 = 0$: $\\;D = 16 - 32 = -16 < 0$, dus $V = \\varnothing$.</p>
      <p><b>D geen kwadraat:</b> $x^2 - 4x + 1 = 0$: $\\;D = 12$, $\\;x_1 = \\dfrac{4 + \\sqrt{12}}{2} \\approx 3{,}73$ en $x_2 = \\dfrac{4 - \\sqrt{12}}{2} \\approx 0{,}27$. Gebruik hier je rekenmachine en rond af op 2 decimalen.</p></div>
    <div class="kader eig"><div class="kader-titel">Eerst herleiden naar de standaardvorm</div>
      <p>Breng alle termen naar het linkerlid en herleid: $4x^2 + 3x + 5 = x^2 - 5x + 9 \\;\\Leftrightarrow\\; 3x^2 + 8x - 4 = 0$.</p></div>${INTYPEN_V}`,
  voorbeelden: [
    { tex: 'x^2 + 6x + 9 = 0', stappen: ['D = 6^2 - 4 \\cdot 1 \\cdot 9 = 0', 'x = \\dfrac{-6}{2} = -3', 'V = \\{-3\\}'] },
    { tex: 'x^2 - x + 1 = 0', stappen: ['D = (-1)^2 - 4 \\cdot 1 \\cdot 1 = -3 < 0', 'V = \\varnothing'] },
    { tex: '2x^2 + 3x - 4 = 0', stappen: ['D = 3^2 - 4 \\cdot 2 \\cdot (-4) = 41', 'x_1 = \\dfrac{-3 + \\sqrt{41}}{4} \\approx 0{,}85 \\qquad x_2 = \\dfrac{-3 - \\sqrt{41}}{4} \\approx -2{,}35', 'V = \\{-2{,}35 ; 0{,}85\\}'] },
  ],
  soorten: {
    een: { naam: 'D = 0', gen() { return vraagV('een', vglD0()); } },
    geen: { naam: 'D < 0', gen() { return vraagV('geen', vglNeg()); } },
    irr: { naam: 'D geen kwadraat', gen() { return vraagV('irr', vglIrr()); } },
    herleid: { naam: 'Eerst herleiden', gen() { return herleid(); } },
  },
  oefenMix: [['een', 1], ['geen', 1], ['irr', 2], ['herleid', 1]],
  test: [['een', 2], ['geen', 2], ['irr', 3], ['herleid', 3]], testSchudden: true,
};

// ===================================================================
//  Eindtest
// ===================================================================
const mix = (deel, soort, naam, sleutel, opdracht) => ({ naam, gen() { const v = deel.soorten[soort].gen(); return { ...v, soort: sleutel, opdracht: opdracht || deel.opdracht }; } });
const D18 = {
  nr: 18, titel: 'Eindtest: alles door elkaar', kort: 'Toon dat je alles kan: uitwerken, ontbinden en oplossen.', rekenmachine: true, opdracht: OPDR_ONT,
  theorie: `${FORMULES}${STAPPENPLAN}${DISCR}
    <p>In deze test komt alles door elkaar. Lees bij elke vraag goed of je moet <b>uitwerken</b>, <b>ontbinden</b> of <b>oplossen</b>.</p>${INTYPEN_V}`,
  voorbeelden: [
    { tex: '(3x-4)^2', stappen: ['\\text{uitwerken: } (3x)^2 - 2 \\cdot 3x \\cdot 4 + 4^2', '= 9x^2 - 24x + 16'] },
    { tex: '3x^3 - 12x', stappen: ['\\text{ontbinden: } 3x(x^2 - 4)', '= 3x(x - 2)(x + 2)'] },
    { tex: 'x^2 + 3x - 10 = 0', stappen: ['\\text{oplossen: } D = 3^2 - 4 \\cdot 1 \\cdot (-10) = 49', 'x_1 = \\dfrac{-3 + 7}{2} = 2 \\qquad x_2 = \\dfrac{-3 - 7}{2} = -5', 'V = \\{-5 ; 2\\}'] },
  ],
  soorten: {
    kwadraat: mix(D3, 'coef', 'Kwadraat uitwerken', 'kwadraat'),
    somverschil: mix(D5, 'twee', 'Som × verschil', 'somverschil'),
    derde: mix(D6, 'coef', 'Derde macht', 'derde'),
    herleid: mix(D7, 'twee', 'Werk uit en herleid', 'herleid'),
    gemfactor: mix(D9, 'drieterm', 'Gemeenschappelijke factor', 'gemfactor'),
    groep: mix(D10, 'derde', 'Groeperen', 'groep'),
    verschilkw: mix(D11, 'coef', 'Verschil van kwadraten', 'verschilkw'),
    volkomen: mix(D12, 'coef', 'Volkomen kwadraat', 'volkomen'),
    productsom: mix(D13, 'gemengd', 'Product-som', 'productsom'),
    volledig: mix(D14, 'ps', 'Volledig ontbinden', 'volledig'),
    discr: mix(D16, 'breuk', 'Discriminant', 'discr'),
    discr2: mix(D17, 'irr', 'Discriminant (geen kwadraat)', 'discr2'),
  },
  oefenMix: [['kwadraat', 1], ['somverschil', 1], ['derde', 1], ['herleid', 1], ['gemfactor', 1], ['groep', 1], ['verschilkw', 1], ['volkomen', 1], ['productsom', 1], ['volledig', 1], ['discr', 1], ['discr2', 1]],
  test: [['kwadraat', 1], ['herleid', 1], ['gemfactor', 1], ['groep', 1], ['verschilkw', 1], ['volkomen', 1], ['productsom', 1], ['volledig', 1], ['discr', 1], ['discr2', 1]], testSchudden: false,
};

EXT.M = { D13, D15, D16, D17 };
}
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
// ======================= samenstellen =======================
{
  const { T, M, O } = EXT;
  const reeks = [T.DF, T.D5, T.D6, T.DA, T.D9, T.D11, M.D13, M.D15, M.D16, M.D17, O.D4, O.D5];
  const delen = reeks.map((D, i) => ({ ...D, nr: i + 1 }));
  const mixE = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'E' + D.nr + s, opdracht: v.opdracht || D.opdracht }; } });
  const kiesSoort = (D, i = 0) => Object.keys(D.soorten)[i];
  const E = [[delen[0], 'geheel', 'Topvorm met formules'], [delen[1], kiesSoort(delen[1]), 'Kwadraat afsplitsen (a = 1)'], [delen[2], kiesSoort(delen[2]), 'Kwadraat afsplitsen (a ≠ 1)'],
    [delen[3], 'groter', 'Topvorm → algemene vorm'], [delen[4], 'teken', 'Tekenverloop'], [delen[5], kiesSoort(delen[5], 3), 'Functieoverzicht'], [delen[6], 'gemengd', 'Product-som methode'],
    [delen[8], kiesSoort(delen[8]), 'Oplossen met de discriminant'], [delen[10], kiesSoort(delen[10]), 'Ongelijkheid (D > 0)'], [delen[11], kiesSoort(delen[11]), 'Ongelijkheid (D = 0 of D < 0)']];
  const soorten = {}; E.forEach(([D, s, naam], i) => { soorten['e' + (i + 1)] = mixE(D, s, naam); });
  delen.push({ nr: delen.length + 1, titel: 'Eindtest tweedegraadsfuncties', kort: 'Alles door elkaar.', rekenmachine: false,
    theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p>
      <ul><li>Topvorm $f(x) = a(x - p)^2 + q$, top $S(p; q)$, met $p = -\\frac{b}{2a}$ en $q = f(p)$.</li><li>$D = b^2 - 4ac$ en $x = \\frac{-b \\pm \\sqrt{D}}{2a}$.</li>
      <li>Tekenregel: buiten de nulwaarden het teken van $a$, ertussen het tegengestelde teken.</li></ul></div>`,
    voorbeelden: [], soorten, oefenMix: Object.keys(soorten).map(k => [k, 1]), test: Object.keys(soorten).map(k => [k, 1]), testSchudden: true });
  Leerpaden.registreer({
    code: 'tweedegraadsfuncties-5bcw',
    titel: 'Tweedegraadsfuncties',
    ondertitel: 'Toegepaste wiskunde · 5BCW',
    klas: '5BCW',
    drempel: 70,
    intro: `<p>Je herhaalt de tweedegraadsfunctie uit het 4de jaar en gaat verder: van algemene vorm naar <b>topvorm</b> (met de formules of door kwadraat af te splitsen) en terug, de <b>kenmerken</b>,
      <b>ontbinden</b> met de product-som methode, de <b>discriminant</b> en de abc-formule, en <b>tweedegraadsongelijkheden</b> algebraïsch oplossen. Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
      <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
    groepen: [
      { titel: 'A · Topvorm en algemene vorm', delen: [1, 2, 3, 4] },
      { titel: 'B · Kenmerken', delen: [5, 6] },
      { titel: 'C · Vergelijkingen: ontbinden en discriminant', delen: [7, 8, 9, 10] },
      { titel: 'D · Ongelijkheden', delen: [11, 12] },
      { titel: 'E · Eindtest', delen: [13] },
    ],
    delen,
  });
}
})();
