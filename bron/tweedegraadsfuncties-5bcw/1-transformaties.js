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
