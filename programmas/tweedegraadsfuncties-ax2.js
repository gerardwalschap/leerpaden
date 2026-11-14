// Programma 'tweedegraadsfuncties-ax2' — automatisch samengevoegd uit bron/tweedegraadsfuncties-ax2/ (niet rechtstreeks bewerken)
(() => {
// ===================================================================
//  TWEEDEGRAADSFUNCTIES f(x) = ax² (4BW-MWW) — gedeelde hulpfuncties
// ===================================================================
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(Math.abs(x) < 1e-12 ? 0 : +x.toFixed(10), d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde: +(+waarde).toFixed(10), voor: '', ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kT = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const kTex = (texen) => texen.map((t, i) => ({ k: String(i), l: t }));
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const tekst = (s) => String(+(+s).toFixed(10)).replace('.', ',').replace('-', '−');
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const r10 = (x) => +x.toFixed(10);

// ---- a en het voorschrift
const aTex = (a) => a === 1 ? '' : a === -1 ? '-' : tg(a);
const fTex = (a, naam = 'f', vr = 'x') => `${naam}(${vr}) = ${aTex(a)}${vr}^2`;
const fTxt = (a, naam = 'f') => `${naam}(x) = ${a === 1 ? '' : a === -1 ? '−' : tekst(a)}x²`;
const fAntw = (a, naam = 'f') => ({ soort: 'functie', vorm: 'vrij', expr: `${a}*x^2`, tex: `${aTex(a)}x^2`, voor: `${naam}(x) =`, placeholder: 'bv. -3x^2' });
const POS = [0.1, 0.2, 0.25, 0.4, 0.5, 1.5, 2, 3, 4, 5, 6, 7, 1.2, 2.5, 0.3];
const ALLE_A = [...POS, ...POS.map(a => -a), 1, -1];
const kiesA = () => kies(ALLE_A);
const bd = (a) => a > 0 ? 'dalparabool' : 'bergparabool';
// f(x) uitgerekend in stappen
const reken = (a, x) => `f(${tg(x)}) = ${a === 1 ? '' : a === -1 ? '-' : tg(a) + ' \\cdot '}${h(x)}^2 = ${a === 1 || a === -1 ? (a < 0 ? '-' : '') : tg(a) + ' \\cdot '}${tg(r10(x * x))} = ${tg(r10(a * x * x))}`;

// ---- tabellen
function tabelTex(xs, ys, xn = 'x', yn = 'f(x)') {
  const c = (v) => v === null ? '/' : typeof v === 'string' ? v : tg(v);
  return `\\begin{array}{c|${'c'.repeat(xs.length)}} ${xn} & ${xs.map(c).join(' & ')} \\\\ \\hline ${yn} & ${ys.map(c).join(' & ')} \\end{array}`;
}
// tekentabel en verloopschema van ax²
const tekenTab = (a) => `\\begin{array}{c|ccc} x & & 0 & \\\\ \\hline f(x) & ${a > 0 ? '+' : '-'} & 0 & ${a > 0 ? '+' : '-'} \\end{array}`;
const tekenTabFout = [
  '\\begin{array}{c|ccc} x & & 0 & \\\\ \\hline f(x) & - & 0 & + \\end{array}',
  '\\begin{array}{c|ccc} x & & 0 & \\\\ \\hline f(x) & + & 0 & - \\end{array}',
];
const verloop = (a) => `\\begin{array}{c|ccc} x & & 0 & \\\\ \\hline f(x) & ${a > 0 ? '\\searrow' : '\\nearrow'} & 0 & ${a > 0 ? '\\nearrow' : '\\searrow'} \\\\ & & \\text{${a > 0 ? 'min' : 'max'}} & \\end{array}`;
const verloopFout = (a) => [
  `\\begin{array}{c|ccc} x & & 0 & \\\\ \\hline f(x) & ${a > 0 ? '\\nearrow' : '\\searrow'} & 0 & ${a > 0 ? '\\searrow' : '\\nearrow'} \\\\ & & \\text{${a > 0 ? 'max' : 'min'}} & \\end{array}`,
  `\\begin{array}{c|ccc} x & & 0 & \\\\ \\hline f(x) & ${a > 0 ? '\\searrow' : '\\nearrow'} & 0 & ${a > 0 ? '\\nearrow' : '\\searrow'} \\\\ & & \\text{${a > 0 ? 'max' : 'min'}} & \\end{array}`,
  `\\begin{array}{c|ccc} x & & 0 & \\\\ \\hline f(x) & ${a > 0 ? '\\nearrow' : '\\searrow'} & 0 & ${a > 0 ? '\\searrow' : '\\nearrow'} \\\\ & & \\text{${a > 0 ? 'min' : 'max'}} & \\end{array}`,
];
function drieOpties(juist, fouten) {
  const uniek = [...new Set(fouten)].filter(f => f !== juist).slice(0, 2);
  const opts = schud([juist, ...uniek]);
  return keuze(kTex(opts), opts.indexOf(juist));
}
// bereik als verzameling
const R = [{ a: -Infinity, ai: false, b: Infinity, bi: false }];
const bereikSt = (a) => a > 0 ? [{ a: 0, ai: true, b: Infinity, bi: false }] : [{ a: -Infinity, ai: false, b: 0, bi: true }];
const bereikTex = (a) => a > 0 ? '[0, +\\infty[' : ']-\\infty, 0]';

// ---- grafieken (SVG) ---------------------------------------------------------------
// opt.stukken: [{pts:[[x,y],…] (x stijgend), begin/eind: 'vol'|'hol'|'door'}]  — veelhoekslijnen
// opt.rechten: [{a, b, label?, kleur?}] · opt.krommen: [{pts, kleur?}] · opt.functies: [{f, kleur?}] · opt.punten: [{x, y, label?, hol?}]
const BLAUW = '#1c4e8a', ORANJE = '#e8772e';
function fgraf(opt = {}) {
  const [X0, X1] = opt.x || [-7, 7], [Y0, Y1] = opt.y || [-6, 6];
  const B = opt.breed || 320, sc = B / (X1 - X0), scY = opt.hoog ? opt.hoog / (Y1 - Y0) : sc, H = (Y1 - Y0) * scY, m = 20;
  const X = (x) => m + (x - X0) * sc, Y = (y) => m + (Y1 - y) * scY;
  const stap = opt.stap || 1, ys = opt.ystap || 1;
  let g = '';
  for (let k = Math.ceil(X0); k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>`;
  for (let k = Math.ceil(Y0); k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>`;
  g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1) + 8}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.3" marker-end="url(#fp)"/>`;
  g += `<line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1) - 8}" stroke="#1f2733" stroke-width="1.3" marker-end="url(#fp)"/>`;
  g += `<text x="${X(X1) + 4}" y="${Y(0) - 6}" font-size="12" text-anchor="end" font-style="italic">${opt.xn || 'x'}</text><text x="${X(0) + 6}" y="${Y(Y1) + 4}" font-size="12" font-style="italic">${opt.yn || 'y'}</text>`;
  const num = (v) => v < 0 ? '−' + (-v) : String(v);
  for (let k = Math.ceil(X0 / stap) * stap; k < X1; k += stap) if (k) g += `<text x="${X(k)}" y="${Y(0) + 12}" font-size="9" text-anchor="middle" fill="#555">${num(k)}</text>`;
  for (let k = Math.ceil(Y0 / ys) * ys; k < Y1; k += ys) if (k) g += `<text x="${X(0) - 3}" y="${Y(k) + 3}" font-size="9" text-anchor="end" fill="#555">${num(k)}</text>`;
  g += `<text x="${X(0) - 3}" y="${Y(0) + 11}" font-size="9" text-anchor="end" fill="#555">0</text>`;
  // verlengen tot de rand van de figuur
  const rand = (p, q) => { // van p in de richting p→q… verder dan q tot de rand
    const dx = q[0] - p[0], dy = q[1] - p[1]; let t = Infinity;
    if (dx > 0) t = Math.min(t, (X1 - q[0]) / dx); if (dx < 0) t = Math.min(t, (X0 - q[0]) / dx);
    if (dy > 0) t = Math.min(t, (Y1 - q[1]) / dy); if (dy < 0) t = Math.min(t, (Y0 - q[1]) / dy);
    return [q[0] + dx * t, q[1] + dy * t];
  };
  const pad = (pts, kleur, dik = 2.4) => `<path d="${pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ')}" fill="none" stroke="${kleur}" stroke-width="${dik}" stroke-linejoin="round"/>`;
  const bol = (x, y, hol, kleur = BLAUW) => `<circle cx="${X(x)}" cy="${Y(y)}" r="4.2" fill="${hol ? '#fff' : kleur}" stroke="${kleur}" stroke-width="1.8"/>`;
  for (const s of opt.stukken || []) {
    let pts = s.pts.slice();
    if (s.begin === 'door') pts.unshift(rand(pts[1], pts[0]));
    if (s.eind === 'door') pts.push(rand(pts[pts.length - 2], pts[pts.length - 1]));
    g += pad(pts, s.kleur || BLAUW);
    if (s.begin !== 'door') g += bol(...s.pts[0], s.begin === 'hol', s.kleur || BLAUW);
    if (s.eind !== 'door') g += bol(...s.pts[s.pts.length - 1], s.eind === 'hol', s.kleur || BLAUW);
  }
  for (const k of opt.krommen || []) g += pad(k.pts.filter(p => p[0] >= X0 - 1 && p[0] <= X1 + 1 && p[1] >= Y0 - 1 && p[1] <= Y1 + 1), k.kleur || BLAUW);
  for (const fu of opt.functies || []) {
    const pts = []; for (let i = 0; i <= 400; i++) { const x = (fu.van ?? X0) + ((fu.tot ?? X1) - (fu.van ?? X0)) * i / 400, y = fu.f(x); if (Number.isFinite(y) && y >= Y0 && y <= Y1) pts.push([x, y]); }
    if (pts.length > 1) g += pad(pts, fu.kleur || BLAUW);
  }
  for (const r of opt.rechten || []) {
    const kl = r.kleur || BLAUW, f = (x) => r.a * x + r.b;
    const p = [X0, f(X0)], q = [X1, f(X1)];
    const knip = (u) => { if (u[1] > Y1) return [(Y1 - r.b) / r.a, Y1]; if (u[1] < Y0) return [(Y0 - r.b) / r.a, Y0]; return u; };
    const P = r.a ? knip(p) : p, Qp = r.a ? knip(q) : q;
    g += pad([P, Qp], kl, 2.2);
    if (r.label) {
      const lx = r.lx ?? (Qp[0] - (Qp[0] - P[0]) * 0.12), ly = f(lx);
      g += `<text x="${X(lx) + 5}" y="${Y(ly) - 5}" font-size="14" font-weight="bold" fill="${kl}">${r.label}</text>`;
    }
  }
  for (const p of opt.punten || []) {
    g += bol(p.x, p.y, p.hol, p.kleur || ORANJE);
    if (p.label) g += `<text x="${X(p.x) + 7}" y="${Y(p.y) - 7}" font-size="12" font-weight="bold" fill="${p.kleur || ORANJE}">${p.label}</text>`;
  }
  const w = B + 2 * m, hh = H + 2 * m;
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif;max-width:100%;height:auto">
    <defs><marker id="fp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f2733"/></marker></defs>${g}</svg></div>`;
}
const KLEUREN = ['#1c4e8a', '#e8772e', '#2e7d4f', '#8e44ad', '#b83a2e'];

// parabolen tekenen: lijst {a, kleur?, label?}, met rode punten en labels
function parabolen(lijst, opt = {}) {
  const functies = lijst.map((p, i) => ({ f: (x) => p.a * x * x, kleur: p.kleur || KLEUREN[i % KLEUREN.length] }));
  return fgraf({ functies, punten: opt.punten || [], x: opt.x || [-5, 5], y: opt.y || [-6, 6], breed: opt.breed || 300, ...opt.extra });
}
// ===================================================================
//  TWEEDEGRAADSFUNCTIES f(x) = ax² (4BW-MWW) — de delen
// ===================================================================
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
const ROOD = '#c0392b';
const WNW = kT(['waar', 'niet waar']);

// ---- 1. Wat is een tweedegraadsfunctie? ------------------------------------------------
const HERKEN = [
  // [tex, tweedegraads van de vorm ax²?, a of null, uitleg]
  () => { const a = kiesA(); return [fTex(a), true, a, `\\text{van de vorm } ax^2 \\text{ met } a = ${tg(a)}`]; },
  () => { const a = kiesA(); return [`f(x) = ${aTex(a)}x^2`, true, a, `\\text{van de vorm } ax^2 \\text{ met } a = ${tg(a)}`]; },
  () => { const a = kies([2, 3, -4, 5, -1, 0.5]), b = kies([1, -2, 3, 4, -5]); return [`f(x) = ${aTex(a)}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`, false, null, '\\text{hoogste macht van } x \\text{ is 1: eerstegraadsfunctie}']; },
  () => { const a = kies([2, 3, -4, 5, -1, 0.5]); return [`f(x) = ${aTex(a)}x`, false, null, '\\text{hoogste macht van } x \\text{ is 1: eerstegraadsfunctie}']; },
  () => ['f(x) = 0 \\cdot x^2', false, null, 'a = 0: \\; 0 \\cdot x^2 = 0 \\text{, er staat geen } x^2 \\text{ meer}'],
  () => { const a = kies([2, -3, 0.5, -1]); return [`f(x) = ${aTex(a)}x^3`, false, null, '\\text{hoogste macht van } x \\text{ is 3, niet 2}']; },
];
const D1 = {
  nr: 1, titel: 'Wat is een tweedegraadsfunctie?', kort: 'f(x) = ax² met a ≠ 0. De enige nulwaarde is x = 0.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Van eerste naar tweede graad</div>
      <p>Bij een eerstegraadsfunctie $f(x) = ax + b$ is de hoogste macht van $x$ gelijk aan 1: de grafiek is een rechte. Bij een <b>tweedegraadsfunctie</b> is de hoogste macht van $x$ gelijk aan 2.</p></div>
    <div class="kader def"><div class="kader-titel">Definitie</div>
      <p>Een <b>tweedegraadsfunctie</b> is een functie met voorschrift $f(x) = ax^2$, met $a \\in \\mathbb{R}_0$ (dus $a \\neq 0$). Het getal $a$ noemen we de <b>parameter</b>.</p>
      <p>Voorbeelden: $f(x) = 3x^2$ ($a = 3$), $f(x) = -x^2$ ($a = -1$), $f(x) = 0{,}5x^2$ ($a = 0{,}5$).</p>
      <p class="klein">Waarom $a \\neq 0$? Als $a = 0$, dan is $f(x) = 0 \\cdot x^2 = 0$. Er staat dan geen $x^2$ meer: dat is geen tweedegraadsfunctie.</p></div>
    <div class="kader eig"><div class="kader-titel">De nulwaarde van $f(x) = ax^2$</div>
      <p>Stel $f(x)$ gelijk aan 0: $ax^2 = 0 \\iff x^2 = 0 \\iff x = 0$ (beide leden delen door $a \\neq 0$, en enkel $0^2 = 0$).</p>
      <p>Er is precies <b>één nulwaarde: $x = 0$</b>. Alle grafieken gaan door de oorsprong $(0, 0)$.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = -2{,}5x^2', stappen: ['\\text{hoogste macht van } x \\text{ is 2: tweedegraadsfunctie}', 'a = -2{,}5', '-2{,}5x^2 = 0 \\iff x^2 = 0 \\iff x = 0'] },
    { tex: 'g(x) = 3x + 2', stappen: ['\\text{hoogste macht van } x \\text{ is 1}', '\\text{eerstegraadsfunctie, geen tweedegraadsfunctie}'] },
  ],
  soorten: {
    herken: { naam: 'Herkennen', gen() {
      const [tex, ok, , uitl] = kies(HERKEN)();
      return { soort: 'herken', opdracht: 'Is dit een tweedegraadsfunctie van de vorm f(x) = ax² (a ≠ 0)?', tex, antw: keuze(kT(['ja', 'nee']), ok ? 0 : 1), uitleg: [uitl, `\\text{${ok ? 'ja' : 'nee'}}`] };
    } },
    waardeA: { naam: 'De parameter a', gen() {
      const a = kiesA(), naam = kies(['f', 'g', 'h', 'k']);
      return { soort: 'waardeA', opdracht: 'Wat is de waarde van de parameter a?', tex: fTex(a, naam), antw: getal(a, { voor: 'a =' }), uitleg: [`${naam}(x) = ${aTex(a)}x^2 = ${tg(a)} \\cdot x^2`, `a = ${tg(a)}`] };
    } },
    nul: { naam: 'Nulwaarde', gen() {
      const a = kiesA();
      return { soort: 'nul', opdracht: 'Bepaal de nulwaarde: stel f(x) gelijk aan 0.', tex: fTex(a), antw: getal(0, { voor: 'x =' }),
        uitleg: [`${aTex(a)}x^2 = 0`, `x^2 = 0 \\quad (\\text{beide leden delen door } ${tg(a)})`, 'x = 0'] };
    } },
    grootste: { naam: 'Welke macht?', gen() {
      const [tex, , , uitl] = kies(HERKEN)(), m = tex.includes('^3') ? 2 : tex.includes('0 \\cdot') ? 3 : tex.includes('^2') ? 1 : 0;
      return { soort: 'grootste', opdracht: 'Wat voor functie is dit?', tex, antw: keuze(kT(['eerstegraadsfunctie', 'tweedegraadsfunctie', 'geen van beide (macht 3)', 'constante functie f(x) = 0']), m), uitleg: [uitl] };
    } },
  },
  oefenMix: [['herken', 2], ['waardeA', 1], ['nul', 1], ['grootste', 1]],
  test: [['herken', 4], ['waardeA', 3], ['nul', 1], ['grootste', 2]], testSchudden: true,
};

// ---- 2. Tabel van waarden en grafiek -------------------------------------------------------
const TEKEN_A = [[1, [-2, -1, 0, 1, 2]], [2, [-2, -1, 0, 1, 2]], [-1, [-2, -1, 0, 1, 2]], [-2, [-2, -1, 0, 1, 2]], [0.5, [-4, -2, 0, 2, 4]], [-0.5, [-4, -2, 0, 2, 4]], [0.25, [-4, -2, 0, 2, 4]], [-0.25, [-4, -2, 0, 2, 4]]];
const fwX = () => kies([-3, -2, -1, 1, 2, 3, 4, -4, 5, -5, 0.5, -0.5, 1.5, -1.5]);
const D2 = {
  nr: 2, titel: 'Tabel van waarden en grafiek', kort: 'Kies x, bereken f(x), zet de punten uit en verbind vloeiend.', rekenmachine: false,
  theorie: `<div class="kader werk"><div class="kader-titel">Stappenplan: de grafiek van $f(x) = ax^2$ tekenen</div>
      <ol><li><b>Tabel van waarden:</b> kies enkele waarden voor $x$ (bv. $-2, -1, 0, 1, 2$) en bereken telkens $f(x)$. <b>Negatief getal? Zet het tussen haakjes!</b></li>
      <li><b>Punten uitzetten:</b> elke kolom van de tabel is een punt $(x, f(x))$.</li>
      <li><b>Vloeiend verbinden:</b> verbind de punten met een vloeiende lijn, geen rechte stukjes!</li></ol></div>
    <div class="kader"><div class="kader-titel">Voorbeeld: $f(x) = x^2$</div>
      <p class="midden">$${tabelTex([-2, -1, 0, 1, 2], [4, 1, 0, 1, 4])}$</p>
      ${parabolen([{ a: 1 }], { punten: [-2, -1, 0, 1, 2].map(x => ({ x, y: x * x, kleur: ROOD })), y: [-1, 6], breed: 240 })}
      <p class="klein">Valt je iets op? $x = -2$ en $x = 2$ geven dezelfde functiewaarde 4. Daarover later meer bij symmetrie.</p></div>
    <div class="kader def"><div class="kader-titel">De parabool</div>
      <p>De grafiek van een tweedegraadsfunctie is altijd een <b>parabool</b>: een vloeiende, symmetrische kromme met precies één <b>top</b>.</p>
      <p>Ligt een punt op de grafiek? Vul de $x$-coördinaat in: is de uitkomst gelijk aan de $y$-coördinaat, dan ligt het punt op de grafiek.</p></div>
    <div class="kader"><div class="kader-titel">Zo teken je hier</div><p>Vul eerst je tabel van waarden in. Klik daarna de punten uit je tabel aan in het rooster: vanaf 3 punten verschijnt de kromme. Een fout punt? Klik erop om het weg te halen.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = -2x^2: \\; f(-3) = \\; ?', stappen: ['f(-3) = -2 \\cdot (-3)^2', '= -2 \\cdot 9', '= -18'] },
    { tex: '\\text{Ligt } (2, 8) \\text{ op de grafiek van } f(x) = 2x^2 ?', stappen: ['f(2) = 2 \\cdot 2^2 = 2 \\cdot 4 = 8', '\\text{ja, want } f(2) = 8'] },
  ],
  soorten: {
    bereken: { naam: 'Functiewaarde berekenen', gen() {
      const a = kiesA(), x = fwX();
      return { soort: 'bereken', opdracht: `Bereken f(${tekst(x)}).`, tex: fTex(a), sleutel: `${a}|${x}`, antw: getal(a * x * x, { voor: `f(${tg(x)}) =` }), uitleg: [reken(a, x)] };
    } },
    tabel: { naam: 'Tabel van waarden', gen() {
      const [a, xs] = kies(TEKEN_A.concat([[3, [-2, -1, 0, 1, 2]], [-3, [-2, -1, 0, 1, 2]], [1.5, [-2, -1, 0, 1, 2]], [-4, [-2, -1, 0, 1, 2]]])), vr = schud(xs.filter(x => x)).slice(0, 3).sort((p, q) => p - q);
      return { soort: 'tabel', opdracht: 'Vul de tabel van waarden aan.', tex: `${fTex(a)} \\qquad ${tabelTex(xs, xs.map(x => vr.includes(x) ? '?' : r10(a * x * x)))}`, sleutel: `${a}|${vr}`,
        antw: delen(...vr.map(x => [`f(${tg(x)}) =`, getal(a * x * x)])), uitleg: vr.map(x => reken(a, x)) };
    } },
    ligt: { naam: 'Ligt het punt op de grafiek?', gen() {
      const a = kies([1, 2, 3, -1, -2, -3, 0.5, -0.5, 0.25, -4, 1.5]), x = kies([-4, -3, -2, -1, 1, 2, 3, 4]), juist = kies([true, false]);
      const y = juist ? r10(a * x * x) : kies([r10(-a * x * x), r10(a * x * x + kies([1, -1, 2])), r10(a * x * 2)].filter(v => v !== r10(a * x * x)));
      return { soort: 'ligt', opdracht: `Ligt het punt (${tekst(x)}, ${tekst(y)}) op de grafiek?`, tex: fTex(a), sleutel: `${a}|${x}|${y}`, antw: keuze(kT(['ja', 'nee']), juist ? 0 : 1),
        uitleg: [reken(a, x), juist ? `\\text{ja, want } f(${tg(x)}) = ${tg(y)}` : `\\text{nee, want } f(${tg(x)}) = ${tg(r10(a * x * x))} \\neq ${tg(y)}`] };
    } },
    tekenen: { naam: 'De grafiek tekenen', gen() {
      const [a, xs] = kies(TEKEN_A);
      return { soort: 'tekenen', opdracht: 'Vul de tabel van waarden in en teken de grafiek: klik de 5 punten aan.', tex: `${fTex(a)} \\qquad ${tabelTex(xs, xs.map(() => '?'))}`, sleutel: `t${a}`,
        antw: delen(...xs.map(x => [`f(${tg(x)}) =`, getal(a * x * x)]), ['\\text{teken de parabool}', { soort: 'teken', parabool: { a, n: 5 }, rechten: [{ tex: fTex(a) }], x: [-5, 5], y: [-9, 9] }]),
        uitleg: [tabelTex(xs, xs.map(x => r10(a * x * x))), `\\text{punten: } ${xs.map(x => `(${tg(x)}, ${tg(r10(a * x * x))})`).join(', \\; ')}`, '\\text{verbind ze met een vloeiende lijn}'] };
    } },
  },
  oefenMix: [['bereken', 2], ['tabel', 1], ['ligt', 1], ['tekenen', 1]],
  test: [['bereken', 4], ['tabel', 2], ['ligt', 2], ['tekenen', 2]], testSchudden: true,
};

// ---- 3. Invloed van de parameter a --------------------------------------------------------------
function puntOp(a) { for (const x of [4, 3, 2, 1]) { const y = r10(a * x * x); if (Number.isInteger(y) && Math.abs(y) >= 1 && Math.abs(y) <= 5) return [x, y]; } return [1, a]; }
function koppelSet() {
  const pos = schud([3, 2, 1, 0.5, 0.25]).slice(0, 2), neg = schud([-3, -2, -1, -0.5, -0.25]).slice(0, 2);
  const lijst = schud([...pos, ...neg]).map((a, i) => ({ a, label: 'ABCD'[i], kleur: KLEUREN[i] }));
  const zijde = { p: 1, n: 1 };
  const punten = lijst.map(p => { const [x, y] = puntOp(p.a), k = p.a > 0 ? 'p' : 'n', s = zijde[k]; zijde[k] = -1; return { x: s * x, y, label: p.label, kleur: p.kleur }; });
  return { lijst, html: parabolen(lijst, { punten, y: [-6, 6], x: [-5, 5], breed: 320 }) };
}
const ZIN = [
  () => { const a = kiesA(); return [`De grafiek van ${fTxt(a)} is een dalparabool.`, a > 0, `a = ${tg(a)} ${a > 0 ? '> 0' : '< 0'}: \\text{ ${bd(a)}}`]; },
  () => { const a = kiesA(); return [`De grafiek van ${fTxt(a)} is een bergparabool.`, a < 0, `a = ${tg(a)} ${a > 0 ? '> 0' : '< 0'}: \\text{ ${bd(a)}}`]; },
  () => { const [a, b] = schud(ALLE_A.filter((v, i, l) => l.findIndex(w => Math.abs(w) === Math.abs(v)) === i)).slice(0, 2); return [`De parabool van ${fTxt(a)} is smaller dan die van ${fTxt(b, 'g')}.`, Math.abs(a) > Math.abs(b), `|${tg(a)}| = ${tg(Math.abs(a))} ${Math.abs(a) > Math.abs(b) ? '>' : '<'} ${tg(Math.abs(b))} = |${tg(b)}|`]; },
  () => { const a = kies(POS), s = kies([true, false]), b = s ? -a : -kies(POS.filter(v => v !== a)); return [`De grafieken van ${fTxt(a)} en ${fTxt(b, 'g')} zijn elkaars spiegelbeeld ten opzichte van de x-as.`, s, s ? `\\text{tegengestelde } a\\text{: } ${tg(a)} \\text{ en } ${tg(b)}` : `${tg(b)} \\text{ is niet het tegengestelde van } ${tg(a)}`]; },
  () => ['Hoe dichter a bij 0 ligt, hoe smaller de parabool.', false, '\\text{hoe dichter bij 0, hoe breder (vlakker) de parabool}'],
  () => ['Hoe groter |a|, hoe smaller (steiler) de parabool.', true, '\\text{grotere } |a| \\text{: smallere parabool}'],
  () => ['Als a = 0, dan is f(x) = ax² geen tweedegraadsfunctie.', true, '0 \\cdot x^2 = 0: \\text{ er staat geen } x^2 \\text{ meer}'],
  () => { const a = kies(POS); return [`f(x) = ${tekst(a)}x² en g(x) = −${tekst(a)}x² hebben dezelfde breedte.`, true, `|${tg(a)}| = |{-${tg(a)}}| \\text{: even breed, enkel gespiegeld}`]; },
];
const D3 = {
  nr: 3, titel: 'Invloed van de parameter a', kort: 'Teken van a: berg of dal. Grootte van |a|: smal of breed.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Het teken van $a$</div>
      <ul><li>$a > 0$: een <b>dalparabool</b> (opent naar boven), de top is een <b>minimum</b>.</li>
      <li>$a < 0$: een <b>bergparabool</b> (opent naar onder), de top is een <b>maximum</b>.</li></ul></div>
    <div class="kader def"><div class="kader-titel">De grootte van $|a|$</div>
      <p>Hoe <b>groter</b> $|a|$, hoe <b>smaller</b> (steiler) de parabool. Hoe <b>kleiner</b> $|a|$ (dichter bij 0), hoe <b>breder</b> (vlakker) de parabool.</p></div>
    <div class="kader eig"><div class="kader-titel">Spiegelen</div>
      <p>$f(x) = ax^2$ en $g(x) = -ax^2$ zijn elkaars <b>spiegelbeeld ten opzichte van de $x$-as</b>: dezelfde breedte, tegengesteld teken.</p></div>
    <div class="kader"><div class="kader-titel">Vergelijk</div>
      ${parabolen([{ a: 1 }, { a: 2 }, { a: -1 }], { punten: [{ x: 2, y: 4, label: 'x²', kleur: KLEUREN[0] }, { x: -1.6, y: 5.12, label: '2x²', kleur: KLEUREN[1] }, { x: 2, y: -4, label: '−x²', kleur: KLEUREN[2] }], breed: 280 })}
      <p class="klein">$2x^2$ stijgt sneller dan $x^2$: smaller. $-x^2$ is het spiegelbeeld van $x^2$ ten opzichte van de $x$-as.</p></div>
    <div class="kader"><div class="kader-titel">Een grafiek koppelen aan een voorschrift</div><p>Kijk eerst naar berg of dal (teken van $a$). Gebruik daarna een punt van de grafiek: bv. $(1, 3)$ betekent $a \\cdot 1^2 = 3$, dus $a = 3$.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Rangschik van smal naar breed: } 0{,}5x^2, \\; 4x^2, \\; x^2', stappen: ['|4| > |1| > |0{,}5|', '4x^2, \\; x^2, \\; 0{,}5x^2'] },
  ],
  soorten: {
    bergdal: { naam: 'Berg of dal?', gen() {
      const a = kiesA();
      return { soort: 'bergdal', opdracht: 'Is de grafiek een bergparabool of een dalparabool?', tex: fTex(a), antw: keuze(kT(['dalparabool', 'bergparabool']), a > 0 ? 0 : 1), uitleg: [`a = ${tg(a)} ${a > 0 ? '> 0' : '< 0'}`, `\\text{${bd(a)}: opent naar ${a > 0 ? 'boven' : 'onder'}}`] };
    } },
    smal: { naam: 'Smalst of breedst?', gen() {
      let as; do { as = schud(ALLE_A).slice(0, 3); } while (new Set(as.map(Math.abs)).size < 3);
      const sm = kies([true, false]), doel = as.reduce((p, q) => (sm ? Math.abs(q) > Math.abs(p) : Math.abs(q) < Math.abs(p)) ? q : p), opts = as.map((a, i) => fTex(a, 'fgh'[i]));
      return { soort: 'smal', opdracht: `Welke functie heeft de ${sm ? 'smalste' : 'breedste'} parabool?`, tex: opts.join(' \\qquad '), sleutel: as.join('|') + sm, antw: keuze(kTex(opts), as.indexOf(doel)),
        uitleg: [`\\text{vergelijk } |a|: \\; ${as.map(a => tg(Math.abs(a))).join(', \\; ')}`, `\\text{${sm ? 'grootste' : 'kleinste'} } |a| \\text{: ${sm ? 'smalste' : 'breedste'} parabool}`, opts[as.indexOf(doel)]] };
    } },
    spiegel: { naam: 'Spiegelen t.o.v. de x-as', gen() {
      const a = kiesA();
      return { soort: 'spiegel', opdracht: 'De grafiek van g is het spiegelbeeld van de grafiek van f ten opzichte van de x-as. Geef het voorschrift van g.', tex: fTex(a), antw: fAntw(-a, 'g'),
        uitleg: ['\\text{spiegelen t.o.v. de } x\\text{-as: tegengestelde } a', fTex(-a, 'g')] };
    } },
    wnw: { naam: 'Waar of niet waar?', gen() {
      const [zin, w, uitl] = kies(ZIN)();
      return { soort: 'wnw', opdracht: 'Waar of niet waar?', html: opgave(zin), sleutel: zin, rapport: zin, antw: keuze(WNW, w ? 0 : 1), uitleg: [uitl, `\\text{${w ? 'waar' : 'niet waar'}}`] };
    } },
    koppel: { naam: 'Grafiek en voorschrift koppelen', gen() {
      const K = koppelSet(), j = rnd(0, 3), p = K.lijst[j], [px, py] = puntOp(p.a);
      return { soort: 'koppel', opdracht: 'Welke grafiek hoort bij het voorschrift? Het gekleurde punt ligt op de grafiek met dezelfde letter.', tex: fTex(p.a), html: K.html, sleutel: K.lijst.map(q => q.a).join('|') + j, rapport: fTex(p.a),
        antw: keuze(kT(['A', 'B', 'C', 'D']), j), uitleg: [`\\text{${bd(p.a)}}`, `f(${px}) = ${tg(p.a)} \\cdot ${px}^2 = ${tg(py)} \\text{: het punt } (${px}, ${tg(py)}) \\text{ of } (${-px}, ${tg(py)})`, `\\text{grafiek ${p.label}}`] };
    } },
    welkA: { naam: 'Voorschrift bij een grafiek', gen() {
      const K = koppelSet(), j = rnd(0, 3), p = K.lijst[j], [px, py] = puntOp(p.a), opts = schud(K.lijst.map(q => q.a));
      return { soort: 'welkA', opdracht: `Welk voorschrift hoort bij grafiek ${p.label}?`, html: K.html, sleutel: K.lijst.map(q => q.a).join('|') + 'w' + j, rapport: `grafiek ${p.label}`,
        antw: keuze(kTex(opts.map(a => fTex(a))), opts.indexOf(p.a)), uitleg: [`\\text{grafiek ${p.label} gaat door } (${px}, ${tg(py)})`, `a \\cdot ${px}^2 = ${tg(py)} \\iff a = ${tg(p.a)}`, fTex(p.a)] };
    } },
  },
  oefenMix: [['bergdal', 1], ['smal', 1], ['spiegel', 1], ['wnw', 1], ['koppel', 1], ['welkA', 1]],
  test: [['bergdal', 1], ['smal', 2], ['spiegel', 1], ['wnw', 2], ['koppel', 2], ['welkA', 2]], testSchudden: true,
};

// ---- 4. Domein, bereik en tekenverloop --------------------------------------------------------
const D4 = {
  nr: 4, titel: 'Domein, bereik en tekenverloop', kort: 'Domein ℝ. Bereik [0, +∞[ of ]−∞, 0]. Teken van f(x) = teken van a.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Domein en bereik</div>
      <p>Je kan élk reëel getal invullen voor $x$: het <b>domein</b> is $\\text{dom} f = \\mathbb{R}$.</p>
      <ul><li>$a > 0$: $f(x) \\geq 0$ voor elke $x$, dus $\\text{ber} f = [0, +\\infty[$.</li>
      <li>$a < 0$: $f(x) \\leq 0$ voor elke $x$, dus $\\text{ber} f = \\,]-\\infty, 0]$.</li></ul>
      <p class="klein">Typ ℝ als R en ∞ als oo of inf, bv. [0, +oo[.</p></div>
    <div class="kader eig"><div class="kader-titel">Nulwaarde</div><p>Altijd precies één nulwaarde: $x = 0$. De grafiek raakt de $x$-as enkel in de oorsprong.</p></div>
    <div class="kader def"><div class="kader-titel">Tekenverloop</div>
      <p>$a > 0$: $f(x) > 0$ voor $x \\neq 0$ en $f(0) = 0$ (boven de $x$-as, behalve in de oorsprong).</p>
      <p class="midden">$${tekenTab(1)}$</p>
      <p>$a < 0$: $f(x) < 0$ voor $x \\neq 0$ en $f(0) = 0$ (onder de $x$-as, behalve in de oorsprong).</p>
      <p class="midden">$${tekenTab(-1)}$</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = -3x^2', stappen: ['\\text{dom} f = \\mathbb{R}', 'a = -3 < 0: \\; \\text{ber} f = \\,]-\\infty, 0]', tekenTab(-3), 'f(x) < 0 \\text{ voor } x \\in \\mathbb{R} \\setminus \\{0\\}'] },
  ],
  soorten: {
    domein: { naam: 'Domein', gen() {
      const a = kiesA();
      return { soort: 'domein', opdracht: 'Bepaal het domein.', tex: fTex(a), antw: { soort: 'verzameling', stukken: R, voor: '\\text{dom} f =' }, uitleg: ['\\text{elk reëel getal mag je invullen voor } x', '\\text{dom} f = \\mathbb{R}'] };
    } },
    bereik: { naam: 'Bereik', gen() {
      const a = kiesA();
      return { soort: 'bereik', opdracht: 'Bepaal het bereik.', tex: fTex(a), antw: { soort: 'verzameling', stukken: bereikSt(a), voor: '\\text{ber} f =' },
        uitleg: [`a = ${tg(a)} ${a > 0 ? '> 0: \\; f(x) \\geq 0' : '< 0: \\; f(x) \\leq 0'} \\text{ voor elke } x`, `\\text{ber} f = ${bereikTex(a)}`] };
    } },
    teken: { naam: 'De juiste tekentabel', gen() {
      const a = kiesA();
      return { soort: 'teken', opdracht: 'Welke tekentabel hoort bij de functie?', tex: fTex(a), antw: drieOpties(tekenTab(a), [tekenTab(-a), ...tekenTabFout]),
        uitleg: [`a ${a > 0 ? '> 0' : '< 0'}: \\text{ ${a > 0 ? 'boven' : 'onder'} de } x\\text{-as, behalve in de oorsprong}`, tekenTab(a)] };
    } },
    waar: { naam: 'Waar is f positief of negatief?', gen() {
      const a = kiesA(), pos = kies([true, false]), ok = (a > 0) === pos;
      const st = ok ? [{ a: -Infinity, ai: false, b: 0, bi: false }, { a: 0, ai: false, b: Infinity, bi: false }] : [];
      return { soort: 'waar', opdracht: `Voor welke x-waarden is f(x) ${pos ? '> 0' : '< 0'}? Typ ∅ als lege verzameling (of: leeg).`, tex: fTex(a), sleutel: `${a}|${pos}`,
        antw: { soort: 'verzameling', stukken: st, voor: `f(x) ${pos ? '>' : '<'} 0 \\text{ voor } x \\in` },
        uitleg: [tekenTab(a), ok ? `\\text{voor alle } x \\text{ behalve } 0: \\; \\mathbb{R} \\setminus \\{0\\}` : `\\text{nooit: } \\emptyset`] };
    } },
    nulpunt: { naam: 'Snijpunt met de x-as', gen() {
      const a = kiesA();
      return { soort: 'nulpunt', opdracht: 'Geef de coördinaat van het snijpunt van de grafiek met de x-as.', tex: fTex(a), antw: delen(['x =', getal(0)], ['y =', getal(0)]),
        uitleg: [`${aTex(a)}x^2 = 0 \\iff x = 0`, '\\text{snijpunt } (0, 0) \\text{: de oorsprong}'] };
    } },
  },
  oefenMix: [['domein', 1], ['bereik', 2], ['teken', 1], ['waar', 1], ['nulpunt', 1]],
  test: [['domein', 1], ['bereik', 3], ['teken', 3], ['waar', 2], ['nulpunt', 1]], testSchudden: true,
};

// ---- 5. Stijgen en dalen, extremum, toenemende stijging -----------------------------------------
const D5 = {
  nr: 5, titel: 'Stijgen, dalen en het extremum', kort: 'Top (0, 0) is min of max. Hoe verder van 0, hoe steiler.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Stijgen en dalen</div>
      <ul><li>$a > 0$ (dalparabool): $f$ <b>daalt</b> voor $x < 0$ en <b>stijgt</b> voor $x > 0$.</li>
      <li>$a < 0$ (bergparabool): $f$ <b>stijgt</b> voor $x < 0$ en <b>daalt</b> voor $x > 0$.</li></ul>
      <p class="midden">$${verloop(1)} \\qquad ${verloop(-1)}$</p></div>
    <div class="kader def"><div class="kader-titel">Extremum</div>
      <p>$a > 0$: een <b>minimum</b> in de top $(0, 0)$. &nbsp; $a < 0$: een <b>maximum</b> in de top $(0, 0)$.</p></div>
    <div class="kader eig"><div class="kader-titel">Toenemende stijging en daling</div>
      <p>Hoe verder je van $x = 0$ gaat, hoe sterker de grafiek stijgt of daalt: de stijging/daling is <b>toenemend</b>, niet <b>gelijkmatig</b> zoals bij een rechte.</p>
      <p>Controleer met een tabel: bereken telkens het verschil met de vorige functiewaarde.</p>
      <p class="midden">$\\begin{array}{c|cccccc} x & 0 & 1 & 2 & 3 & 4 & 5 \\\\ \\hline x^2 & 0 & 1 & 4 & 9 & 16 & 25 \\\\ \\text{verschil} & / & +1 & +3 & +5 & +7 & +9 \\end{array}$</p>
      <p class="klein">De verschillen worden steeds groter: de stijging is toenemend. Bij de rechte $g(x) = 2x$ is het verschil altijd $+2$: gelijkmatig.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = -1{,}2x^2', stappen: ['a < 0: \\text{ bergparabool}', '\\text{stijgt voor } x < 0, \\text{ daalt voor } x > 0', '\\text{maximum in } (0, 0)'] },
  ],
  soorten: {
    verloop: { naam: 'Het juiste verloopschema', gen() {
      const a = kiesA();
      return { soort: 'verloop', opdracht: 'Welk verloopschema hoort bij de functie?', tex: fTex(a), antw: drieOpties(verloop(a), verloopFout(a)), uitleg: [`\\text{${bd(a)}}`, verloop(a)] };
    } },
    stijgt: { naam: 'Waar stijgt of daalt f?', gen() {
      const a = kiesA(), st = kies([true, false]), j = (a > 0) === st ? 1 : 0;
      return { soort: 'stijgt', opdracht: `Waar ${st ? 'stijgt' : 'daalt'} de functie?`, tex: fTex(a), sleutel: `${a}|${st}`, antw: keuze(kTex(['\\text{voor } x < 0', '\\text{voor } x > 0', '\\text{overal}']), j),
        uitleg: [`\\text{${bd(a)}}`, `\\text{${st ? 'stijgt' : 'daalt'} voor } x ${j ? '> 0' : '< 0'}`] };
    } },
    extremum: { naam: 'Het extremum', gen() {
      const a = kiesA();
      return { soort: 'extremum', opdracht: 'Bepaal het extremum.', tex: fTex(a), antw: delen(['\\text{soort:}', keuze(kT(['minimum', 'maximum']), a > 0 ? 0 : 1)], ['\\text{top: } x =', getal(0)], ['y =', getal(0)]),
        uitleg: [`a ${a > 0 ? '> 0' : '< 0'}: \\text{ ${bd(a)}}`, `\\text{${a > 0 ? 'minimum' : 'maximum'} in de top } (0, 0)`] };
    } },
    verschil: { naam: 'Verschillen in een tabel', gen() {
      const a = kies([1, 2, 3, -1, -2, -3, 0.5, -0.5, 4, -4]), xs = [0, 1, 2, 3, 4], ys = xs.map(x => r10(a * x * x)), vr = schud([1, 2, 3, 4]).slice(0, 2).sort();
      return { soort: 'verschil', opdracht: 'Bereken het verschil met de vorige functiewaarde. Typ het teken mee.', tex: `${fTex(a)} \\qquad ${tabelTex(xs, ys)}`, sleutel: `${a}|${vr}`,
        antw: delen(...vr.map(k => [`f(${k}) - f(${k - 1}) =`, getal(ys[k] - ys[k - 1])])),
        uitleg: [...vr.map(k => `${tg(ys[k])} - ${h(ys[k - 1])} = ${tg(r10(ys[k] - ys[k - 1]))}`), `\\text{de verschillen worden steeds ${a > 0 ? 'groter' : 'negatiever'}: de ${a > 0 ? 'stijging' : 'daling'} is toenemend}`] };
    } },
    toenemend: { naam: 'Toenemend of gelijkmatig?', gen() {
      const a = kies([1, 2, 3, -1, -2, -3, 0.5, -0.5]), recht = kies([true, false, false]), xs = [0, 1, 2, 3, 4], ys = xs.map(x => r10(recht ? a * x : a * x * x));
      const sd = a > 0 ? 'stijging' : 'daling';
      return { soort: 'toenemend', opdracht: `Is de ${sd} voor x > 0 toenemend of gelijkmatig?`, tex: `${recht ? `g(x) = ${aTex(a)}x` : fTex(a)} \\qquad ${tabelTex(xs, ys, 'x', recht ? 'g(x)' : 'f(x)')}`, sleutel: `${a}|${recht}`,
        antw: keuze(kT([`toenemende ${sd}`, `gelijkmatige ${sd}`]), recht ? 1 : 0),
        uitleg: [`\\text{verschillen: } ${xs.slice(1).map(k => tg(r10(ys[k] - ys[k - 1]))).join(', \\; ')}`, recht ? '\\text{altijd hetzelfde verschil: een rechte, gelijkmatig}' : `\\text{de verschillen worden in absolute waarde groter: toenemende ${sd}}`] };
    } },
  },
  oefenMix: [['verloop', 1], ['stijgt', 1], ['extremum', 1], ['verschil', 1], ['toenemend', 1]],
  test: [['verloop', 2], ['stijgt', 2], ['extremum', 2], ['verschil', 2], ['toenemend', 2]], testSchudden: true,
};

// ---- 6. Symmetrie -------------------------------------------------------------------------------
const SYM_ZIN = [
  ['De grafiek van f(x) = ax² is symmetrisch ten opzichte van de y-as.', true, 'f(-x) = a(-x)^2 = ax^2 = f(x)'],
  ['De grafiek van f(x) = ax² is symmetrisch ten opzichte van de x-as.', false, '\\text{de grafiek ligt helemaal boven (of onder) de } x\\text{-as: symmetrisch t.o.v. de } y\\text{-as}'],
  ['Voor f(x) = ax² geldt altijd f(−3) = f(3).', true, 'f(-3) = a \\cdot 9 = f(3)'],
  ['Voor f(x) = ax² geldt altijd f(−3) = −f(3).', false, 'f(-3) = a \\cdot (-3)^2 = 9a = f(3)'],
  ['Tegengestelde x-waarden geven dezelfde functiewaarde.', true, 'f(-x) = f(x)'],
  ['De symmetrieas van de parabool is de rechte x = 0 (de y-as).', true, '\\text{symmetrisch t.o.v. de } y\\text{-as}'],
];
const D6 = {
  nr: 6, titel: 'Symmetrie', kort: 'f(−x) = f(x): symmetrisch ten opzichte van de y-as.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Symmetrie</div>
      <p>De grafiek van $f(x) = ax^2$ is <b>symmetrisch ten opzichte van de $y$-as</b>. Voor elke $x$ geldt:</p>
      <p class="midden">$f(-x) = a(-x)^2 = ax^2 = f(x)$</p>
      <p>Tegengestelde $x$-waarden geven dus dezelfde functiewaarde.</p></div>
    <div class="kader eig"><div class="kader-titel">Zo gebruik je het</div>
      <ul><li>Ligt $(3, 27)$ op de grafiek, dan ligt ook $(-3, 27)$ op de grafiek.</li>
      <li>Een tabel aanvullen zonder rekenen: $f(-4) = f(4)$, $f(-2) = f(2)$, …</li></ul></div>`,
  voorbeelden: [
    { tex: 'f(x) = 1{,}5x^2: \\; f(-4) \\text{ en } f(4)', stappen: ['f(-4) = 1{,}5 \\cdot 16 = 24', 'f(4) = 1{,}5 \\cdot 16 = 24', '\\text{dezelfde functiewaarde: symmetrie t.o.v. de } y\\text{-as}'] },
  ],
  soorten: {
    punt: { naam: 'Het symmetrische punt', gen() {
      const a = kies([1, 2, 3, -1, -2, -3, 0.5, -0.5, 1.5, -4, 5]), x = kies([-4, -3, -2, -1, 1, 2, 3, 4]), y = r10(a * x * x);
      return { soort: 'punt', opdracht: `Het punt (${tekst(x)}, ${tekst(y)}) ligt op de grafiek van f. Welk ander punt met dezelfde y-waarde ligt zeker ook op de grafiek?`, tex: fTex(a), sleutel: `${a}|${x}`,
        antw: delen(['x =', getal(-x)], ['y =', getal(y)]), uitleg: ['\\text{symmetrie t.o.v. de } y\\text{-as: } f(-x) = f(x)', `(${tg(-x)}, ${tg(y)})`] };
    } },
    aanvullen: { naam: 'Tabel aanvullen met symmetrie', gen() {
      const a = kies([-0.5, 0.5, 2, -2, 3, -3, 1.5, -1.5, 0.25, -0.25]), xs = [-4, -2, 0, 2, 4], gegeven = schud([-4, -2]).map((x, i) => i ? -x : x);
      const ys = xs.map(x => gegeven.includes(x) || x === 0 ? r10(a * x * x) : '?'), vr = xs.filter(x => ys[xs.indexOf(x)] === '?');
      return { soort: 'aanvullen', opdracht: 'Vul de tabel aan zonder te rekenen: gebruik enkel de symmetrie.', tex: `${fTex(a)} \\qquad ${tabelTex(xs, ys)}`, sleutel: `${a}|${gegeven}`,
        antw: delen(...vr.map(x => [`f(${tg(x)}) =`, getal(a * x * x)])), uitleg: vr.map(x => `f(${tg(x)}) = f(${tg(-x)}) = ${tg(r10(a * x * x))}`) };
    } },
    wnw: { naam: 'Waar of niet waar?', gen() {
      const [zin, w, uitl] = kies(SYM_ZIN);
      return { soort: 'wnw', opdracht: 'Waar of niet waar?', html: opgave(zin), sleutel: zin, rapport: zin, antw: keuze(WNW, w ? 0 : 1), uitleg: [uitl, `\\text{${w ? 'waar' : 'niet waar'}}`] };
    } },
    gelijk: { naam: 'Zelfde functiewaarde', gen() {
      const a = kies([1, 2, 3, -1, -2, 0.5, -0.5, 1.5]), x = kies([1, 2, 3, 4, 5]), y = r10(a * x * x);
      return { soort: 'gelijk', opdracht: `Voor welke twee x-waarden is f(x) = ${tekst(y)}? Typ ze met een puntkomma ertussen.`, tex: fTex(a), sleutel: `${a}|${x}`,
        antw: { soort: 'Vmeer', voor: 'x \\in', waarden: [-x, x], dec: 0 }, uitleg: [`${aTex(a)}x^2 = ${tg(y)} \\iff x^2 = ${x * x}`, `x = ${x} \\text{ of } x = -${x} \\quad (\\text{symmetrie})`] };
    } },
  },
  oefenMix: [['punt', 1], ['aanvullen', 1], ['wnw', 1], ['gelijk', 1]],
  test: [['punt', 3], ['aanvullen', 3], ['wnw', 2], ['gelijk', 2]], testSchudden: true,
};

// ---- 7. Eigenschappen en functieoverzicht --------------------------------------------------------------
const EIG_TEKEN = [ // [tekst, voorwaarde op a]
  ['een dalparabool', (a) => a > 0], ['een bergparabool', (a) => a < 0], ['bereik [0, +∞[', (a) => a > 0], ['bereik ]−∞, 0]', (a) => a < 0],
  ['maximum in (0, 0)', (a) => a < 0], ['minimum in (0, 0)', (a) => a > 0], ['daalt voor x < 0', (a) => a > 0], ['stijgt voor x < 0', (a) => a < 0],
];
function eigVraag() {
  for (;;) {
    let opts; do { opts = schud(ALLE_A).slice(0, 4); } while (new Set(opts.map(Math.abs)).size < 3 || !opts.some(a => a > 0) || !opts.some(a => a < 0));
    const [tt, tv] = kies(EIG_TEKEN), r = kies([1, -1, 2, -2, 0.5, -0.5, 3]), sm = kies([true, false]);
    const past = opts.filter(a => tv(a) && (sm ? Math.abs(a) > Math.abs(r) : Math.abs(a) < Math.abs(r)));
    if (past.length !== 1) continue;
    return { opts, a: past[0], zin: `${tt} en ${sm ? 'smaller' : 'breder'} dan die van ${r === 1 ? '' : r === -1 ? '−' : tekst(r)}x²`, sm, r };
  }
}
const D7 = {
  nr: 7, titel: 'Eigenschappen en functieoverzicht', kort: 'Alle kenmerken op een rij, en van eigenschappen naar voorschrift.', rekenmachine: false,
  theorie: `<div class="kader werk"><div class="kader-titel">Het functieoverzicht</div>
      <p>Doorloop steeds dezelfde volgorde: domein, bereik, nulwaarde, tekenverloop, stijgen/dalen, extremum, symmetrie.</p>
      <p class="midden">$\\begin{array}{l|l|l} \\text{kenmerk} & f(x) = 2x^2 \\; (a > 0) & f(x) = -0{,}5x^2 \\; (a < 0) \\\\ \\hline
        \\text{domein} & \\mathbb{R} & \\mathbb{R} \\\\ \\text{bereik} & [0, +\\infty[ & ]-\\infty, 0] \\\\ \\text{nulwaarde} & x = 0 & x = 0 \\\\
        \\text{tekenverloop} & + \\text{ voor } x \\neq 0 & - \\text{ voor } x \\neq 0 \\\\ \\text{stijgen/dalen} & \\searrow \\text{ voor } x < 0, \\nearrow \\text{ voor } x > 0 & \\nearrow \\text{ voor } x < 0, \\searrow \\text{ voor } x > 0 \\\\
        \\text{extremum} & \\text{minimum } (0, 0) & \\text{maximum } (0, 0) \\\\ \\text{symmetrie} & \\text{t.o.v. de } y\\text{-as} & \\text{t.o.v. de } y\\text{-as} \\end{array}$</p></div>
    <div class="kader eig"><div class="kader-titel">Van eigenschappen naar voorschrift</div>
      <p>Het <b>teken</b> van $a$ volgt uit berg/dal, het bereik, het extremum of stijgen/dalen. De <b>grootte</b> van $|a|$ volgt uit smaller/breder.</p>
      <p class="klein">"Een dalparabool die breder is dan die van $x^2$": $a > 0$ en $|a| < 1$, bv. $0{,}4x^2$.</p></div>
    <div class="kader"><div class="kader-titel">$a$ uit een grafiek</div><p>Ligt het punt $(2, 2)$ op de parabool, dan is $a \\cdot 2^2 = 2$, dus $a = \\frac{2}{4} = 0{,}5$. Deel de $y$-waarde door het kwadraat van de $x$-waarde.</p></div>`,
  voorbeelden: [
    { tex: '\\text{bereik } ]-\\infty, 0] \\text{ en smaller dan die van } -x^2 \\text{; kies uit } 2x^2, \\; -2x^2, \\; 0{,}4x^2, \\; -0{,}4x^2', stappen: ['\\text{bereik } ]-\\infty, 0]: \\; a < 0', '\\text{smaller dan } -x^2: \\; |a| > 1', '-2x^2'] },
  ],
  soorten: {
    eigen: { naam: 'Van eigenschappen naar voorschrift', gen() {
      const E = eigVraag(), texen = E.opts.map(a => `${aTex(a)}x^2`);
      return { soort: 'eigen', opdracht: 'Welk voorschrift heeft deze eigenschappen?', html: opgave(`De grafiek is ${E.zin}.`), sleutel: E.zin + E.opts.join('|'), rapport: E.zin,
        antw: keuze(kTex(texen), E.opts.indexOf(E.a)), uitleg: [`\\text{teken: } a ${E.a > 0 ? '> 0' : '< 0'}`, `\\text{${E.sm ? 'smaller' : 'breder'}: } |a| ${E.sm ? '>' : '<'} ${tg(Math.abs(E.r))}`, `f(x) = ${aTex(E.a)}x^2`] };
    } },
    overzicht: { naam: 'Het functieoverzicht', gen() {
      const a = kiesA();
      return { soort: 'overzicht', opdracht: 'Stel het functieoverzicht op.', tex: fTex(a),
        antw: delen(['\\text{bereik: } \\text{ber} f =', { soort: 'verzameling', stukken: bereikSt(a) }], ['\\text{nulwaarde: } x =', getal(0)],
          ['\\text{tekenverloop: } f(x)', keuze(kTex(['> 0 \\text{ voor } x \\neq 0', '< 0 \\text{ voor } x \\neq 0']), a > 0 ? 0 : 1)],
          ['\\text{stijgt voor}', keuze(kTex(['x < 0', 'x > 0']), a > 0 ? 1 : 0)], ['\\text{extremum:}', keuze(kT(['minimum in (0, 0)', 'maximum in (0, 0)']), a > 0 ? 0 : 1)],
          ['\\text{symmetrisch t.o.v.}', keuze(kTex(['\\text{de } x\\text{-as}', '\\text{de } y\\text{-as}', '\\text{de oorsprong}']), 1)]),
        uitleg: [`a = ${tg(a)} ${a > 0 ? '> 0' : '< 0'}: \\text{ ${bd(a)}}`, `\\text{dom} f = \\mathbb{R}, \\; \\text{ber} f = ${bereikTex(a)}, \\; \\text{nulwaarde } x = 0`, tekenTab(a), verloop(a), '\\text{symmetrisch t.o.v. de } y\\text{-as}'] };
    } },
    aGrafiek: { naam: 'a aflezen uit een grafiek', gen() {
      const a = kies([3, 2, 1, 0.5, 0.25, -3, -2, -1, -0.5, -0.25]), [px, py] = puntOp(a), s = kies([1, -1]);
      return { soort: 'aGrafiek', opdracht: 'Het rode punt ligt op de parabool. Bepaal a in f(x) = ax².', html: parabolen([{ a }], { punten: [{ x: s * px, y: py, kleur: ROOD }], breed: 280 }), sleutel: `${a}|${s}`, rapport: fTex(a),
        antw: getal(a, { voor: 'a =' }), uitleg: [`\\text{punt } (${s * px}, ${tg(py)})`, `a \\cdot ${h(s * px)}^2 = ${tg(py)} \\iff a = \\frac{${tg(py)}}{${px * px}} = ${tg(a)}`] };
    } },
    aPunt: { naam: 'a uit een punt', gen() {
      const a = kies([3, 2, 4, 5, 0.5, 0.25, -3, -2, -4, -0.5, 1.5, -1.5, 0.2]), x = kies([-3, -2, 2, 3, 4, -4, 5]), y = r10(a * x * x);
      return { soort: 'aPunt', opdracht: `De grafiek van f(x) = ax² gaat door het punt (${tekst(x)}, ${tekst(y)}). Bereken a.`, tex: `f(x) = ax^2 \\text{ door } (${tg(x)}, ${tg(y)})`, sleutel: `${a}|${x}`,
        antw: getal(a, { voor: 'a =' }), uitleg: [`a \\cdot ${h(x)}^2 = ${tg(y)}`, `${x * x}a = ${tg(y)}`, `a = \\frac{${tg(y)}}{${x * x}} = ${tg(a)}`] };
    } },
  },
  oefenMix: [['eigen', 1], ['overzicht', 1], ['aGrafiek', 1], ['aPunt', 1]],
  test: [['eigen', 3], ['overzicht', 3], ['aGrafiek', 2], ['aPunt', 2]], testSchudden: true,
};

// ---- 8. Toepassingen -------------------------------------------------------------------------------
const ctx = (tekst, antw, uitleg, sleutel) => ({ tekst, antw, uitleg, sleutel: sleutel || tekst });
const eenh = (e) => `\\text{ ${e}}`;
const CONTEXT = [
  () => { const n = rnd(3, 15); return ctx(`Een vierkant terras heeft ${n} tegels per zijde. Het aantal tegels is T(n) = n². Hoeveel tegels heb je nodig?`, getal(n * n, { voor: 'T =', na: eenh('tegels') }), [`T(${n}) = ${n}^2 = ${n * n}`]); },
  () => { const n = rnd(4, 12); return ctx(`Een vierkant terras (T(n) = n²) wordt ${n} tegels per zijde in plaats van ${n - 1}. Hoeveel tegels heb je extra nodig?`, getal(2 * n - 1, { voor: '\\text{extra} =', na: eenh('tegels') }), [`T(${n}) - T(${n - 1}) = ${n * n} - ${(n - 1) ** 2} = ${2 * n - 1}`, '\\text{er komen telkens méér tegels bij: toenemende stijging}']); },
  () => { let N; do { N = rnd(20, 150); } while (Number.isInteger(Math.sqrt(N))); const n = Math.floor(Math.sqrt(N)); return ctx(`Jonas heeft ${N} tegels voor een vierkant terras (T(n) = n²). Hoeveel tegels per zijde kan zijn terras maximaal hebben, en hoeveel tegels houdt hij over?`, delen(['\\text{per zijde:}', getal(n)], ['\\text{over:}', getal(N - n * n)]), [`${n}^2 = ${n * n} \\leq ${N} \\text{ maar } ${n + 1}^2 = ${(n + 1) ** 2} > ${N}`, `${N} - ${n * n} = ${N - n * n}`]); },
  () => { const x = kies([-4, -3, -2, -1, 1, 2, 3, 4]); return ctx(`De doorsnede van een halfpipe: h(x) = 0,25x², met x de afstand tot het midden in m (links negatief) en h de hoogte in m. Hoe hoog staat een skater bij x = ${tekst(x)}?`, getal(0.25 * x * x, { voor: 'h =', na: eenh('m') }), [`h(${tg(x)}) = 0{,}25 \\cdot ${h(x)}^2 = ${tg(r10(0.25 * x * x))}`, ...(x < 0 ? [`\\text{symmetrie: even hoog als bij } x = ${tg(-x)}`] : [])]); },
  () => { const v = kies([20, 30, 40, 50, 60, 70, 80, 90, 100, 120]); return ctx(`Vuistregel voor de remweg op een droog wegdek: d(v) = 0,01v², met v in km/u en d in m. Hoe lang is de remweg bij ${v} km/u?`, getal(0.01 * v * v, { voor: 'd =', na: eenh('m') }), [`d(${v}) = 0{,}01 \\cdot ${v}^2 = 0{,}01 \\cdot ${v * v} = ${tg(r10(0.01 * v * v))}`]); },
  () => { const k = rnd(3, 12), d = k * k; return ctx(`Remweg: d(v) = 0,01v² (v in km/u, d in m). Bij welke snelheid is de remweg ${d} m?`, getal(10 * k, { voor: 'v =', na: eenh('km/u') }), [`0{,}01v^2 = ${d} \\iff v^2 = ${d * 100}`, `v = ${10 * k} \\quad (v > 0)`]); },
  () => { const [v1, v2] = kies([[30, 50], [50, 70], [30, 60], [50, 90], [70, 100], [50, 100]]); return ctx(`Remweg: d(v) = 0,01v² (v in km/u, d in m). Hoeveel meter langer is de remweg bij ${v2} km/u dan bij ${v1} km/u?`, getal(0.01 * (v2 * v2 - v1 * v1), { voor: '\\text{verschil} =', na: eenh('m') }), [`d(${v2}) = ${tg(r10(0.01 * v2 * v2))}, \\; d(${v1}) = ${tg(r10(0.01 * v1 * v1))}`, `${tg(r10(0.01 * v2 * v2))} - ${tg(r10(0.01 * v1 * v1))} = ${tg(r10(0.01 * (v2 * v2 - v1 * v1)))}`]); },
  () => { const [k, w] = kies([[2, 'verdubbelt'], [3, 'verdrievoudigt']]), [C, f] = kies([['de remweg van een auto (d(v) = 0,01v²)', 'remweg'], ['de remafstand van een fietser (d(v) = 0,15v²)', 'remafstand'], ['de oppervlakte van een vierkant (A(z) = z²) als de zijde', 'oppervlakte']]);
    return ctx(`Denk aan ${C}. Met welke factor neemt de ${f} toe als ${f === 'oppervlakte' ? 'die' : 'de snelheid'} ${w}?`, getal(k * k, { voor: '\\text{factor} =' }), [`(${k}${f === 'oppervlakte' ? 'z' : 'v'})^2 = ${k * k}${f === 'oppervlakte' ? 'z' : 'v'}^2`, `\\text{${k} keer zo groot} \\Rightarrow \\text{ ${k * k} keer zo groot}`], C + k); },
  () => { const x = kies([10, 20, 30, 40, 50]); return ctx(`De kabel van een hangbrug: y = 0,01x², met x de afstand tot het midden (in m) en y de hoogte boven het laagste punt (in m). Hoe hoog hangt de kabel op ${x} m van het midden?`, getal(0.01 * x * x, { voor: 'y =', na: eenh('m') }), [`y = 0{,}01 \\cdot ${x}^2 = ${tg(r10(0.01 * x * x))}`]); },
  () => { const t = rnd(1, 3); return ctx(`Vrijevaltoren: h(t) = −5t² is de positie van het bakje t.o.v. het startpunt (h in m, t in s, negatief = onder het startpunt). Bereken h(${t}).`, getal(-5 * t * t, { voor: `h(${t}) =`, na: eenh('m') }), [`h(${t}) = -5 \\cdot ${t}^2 = ${-5 * t * t}`, '\\text{negatief: onder het startpunt}']); },
  () => { const t = rnd(1, 3); return ctx(`Vrijevaltoren van 60 m hoog: h(t) = −5t² (positie t.o.v. de top in m, t in s). Op welke hoogte boven de grond zit het bakje na ${t} s?`, getal(60 - 5 * t * t, { na: eenh('m') }), [`h(${t}) = ${-5 * t * t}: \\text{ ${5 * t * t} m onder de top}`, `60 - ${5 * t * t} = ${60 - 5 * t * t}`]); },
  () => { const k = rnd(1, 4), [nm, f] = kies([['De vallende steen: s(t) = 4,9t² is de valafstand in m na t seconden.', 4.9], ['Het bakje van een vrijevaltoren valt h(t) = 5t² meter in t seconden.', 5]]);
    return ctx(`${nm} Hoeveel meter valt hij tijdens de ${k}${k === 1 ? 'ste' : 'de'} seconde?`, getal(f * (2 * k - 1), { na: eenh('m') }), [`${tg(f)} \\cdot ${k}^2 - ${tg(f)} \\cdot ${k - 1}^2 = ${tg(r10(f * k * k))} - ${tg(r10(f * (k - 1) ** 2))} = ${tg(r10(f * (2 * k - 1)))}`, '\\text{elke seconde valt hij meer: toenemende stijging}']); },
  () => { const t = rnd(1, 4); return ctx(`Een steen valt van een brug: s(t) = 4,9t² (s in m, t in s). Hoeveel meter is hij gevallen na ${t} s?`, getal(4.9 * t * t, { voor: 's =', na: eenh('m') }), [`s(${t}) = 4{,}9 \\cdot ${t * t} = ${tg(r10(4.9 * t * t))}`]); },
  () => { const x = kies([1, 2, 3]); return ctx(`Een poort is 8 m breed en 4 m hoog. y = −0,25x² zegt hoeveel de boog lager ligt dan het hoogste punt (x = afstand tot het midden in m). Hoe hoog is de boog boven de grond op ${x} m van het midden?`, getal(4 - 0.25 * x * x, { na: eenh('m') }), [`y = -0{,}25 \\cdot ${x}^2 = ${tg(r10(-0.25 * x * x))}`, `4 - ${tg(r10(0.25 * x * x))} = ${tg(r10(4 - 0.25 * x * x))}`]); },
  () => { let b, hh, top; do { b = kies([2, 3, 4, 5]); hh = kies([2, 2.5, 3, 3.5]); top = 4 - 0.25 * (b / 2) ** 2; } while (Math.abs(top - hh) < 0.2);
    return ctx(`Een poort is 8 m breed en 4 m hoog: de boog ligt y = 0,25x² m lager dan het hoogste punt, op x m van het midden. Een voertuig van ${tekst(b)} m breed en ${tekst(hh)} m hoog rijdt precies door het midden. Past het?`, keuze(kT(['ja, het past', 'nee, het past niet']), top > hh ? 0 : 1),
      [`\\text{randen op } ${tg(b / 2)} \\text{ m van het midden: } 4 - 0{,}25 \\cdot ${h(b / 2)}^2 = ${tg(r10(top))} \\text{ m}`, `${tg(r10(top))} ${top > hh ? '>' : '<'} ${tg(hh)}: \\text{ ${top > hh ? 'past' : 'past niet'}}`]); },
  () => { const b = rnd(2, 9); return ctx(`Een rechthoek heeft breedte b en lengte 2b (in cm). De oppervlakte is A(b) = 2b². Bereken de oppervlakte als b = ${b} cm.`, getal(2 * b * b, { voor: 'A =', na: '\\text{ cm}^2' }), [`A(${b}) = 2 \\cdot ${b}^2 = 2 \\cdot ${b * b} = ${2 * b * b}`]); },
  () => { const [C, opts, j, u] = kies([
      ['De oppervlakte van een vierkant A(z) = z², met z de zijde in cm.', [']0, +\\infty[', '\\mathbb{R}', '[0, 3]'], 0, '\\text{een zijde is altijd positief: } z > 0'],
      ['Een steen valt van een brug: s(t) = 4,9t². Na 3 s raakt hij het water.', ['[0, 3]', ']0, +\\infty[', '\\mathbb{R}'], 0, '\\text{van } t = 0 \\text{ tot } t = 3'],
      ['Het wiskundige domein van f(x) = x², zonder context.', ['\\mathbb{R}', ']0, +\\infty[', '[0, +\\infty['], 0, '\\text{elk reëel getal mag je invullen}'],
      ['Een halfpipe h(x) = 0,25x² is 8 m breed, x is de afstand tot het midden.', ['[-4, 4]', '[0, 8]', '\\mathbb{R}'], 0, '\\text{van de linkerrand } (x = -4) \\text{ tot de rechterrand } (x = 4)'],
      ['Een vrijevaltoren: het bakje valt 3 s vrij, h(t) = −5t².', ['[0, 3]', '[-45, 0]', '\\mathbb{R}'], 0, '\\text{de tijd loopt van 0 tot 3 s}']]);
    const o = schud(opts.map((t, i) => [t, i]));
    return ctx(`${C} Wat is het domein in deze context?`, keuze(kTex(o.map(p => p[0])), o.findIndex(p => p[1] === j)), [u, opts[j]], C); },
  () => { const [zin, w, u] = kies([
      ['Lotte (halfpipe h = 0,25x²): "Op x = −2 staat de skater lager dan op x = 2, want −2 is kleiner dan 2."', false, 'h(-2) = h(2) = 1 \\text{: symmetrie, even hoog}'],
      ['Mehdi (remweg): "Als je dubbel zo snel rijdt, wordt je remweg dubbel zo lang."', false, '(2v)^2 = 4v^2 \\text{: 4 keer zo lang}'],
      ['Sara (vrijevaltoren h = −5t²): "De hoogtes zijn negatief, dus het bakje zakt onder de grond."', false, '\\text{negatief betekent: onder het startpunt, niet onder de grond}'],
      ['Tim (hangbrug y = 0,01x², halfpipe h = 0,25x²): "De kabel is een bredere parabool, want 0,01 is kleiner dan 0,25."', true, '|0{,}01| < |0{,}25| \\text{: breder}'],
      ['Noor (terras T = n²): "Een terras van 6 tegels per zijde heeft 6 · 2 = 12 tegels nodig."', false, '6^2 = 6 \\cdot 6 = 36'],
      ['Ilias (vallende steen): "Elke seconde valt de steen meer meter dan de seconde ervoor."', true, '4{,}9; \\; 14{,}7; \\; 24{,}5; \\ldots \\text{: toenemende stijging}']]);
    return ctx(`Wie heeft gelijk? ${zin}`, keuze(kT(['juist', 'fout']), w ? 0 : 1), [u, `\\text{${w ? 'juist' : 'fout'}}`], zin); },
];
const D8 = {
  nr: 8, titel: 'Toepassingen', kort: 'Tweedegraadsfuncties in herkenbare situaties. Let op de eenheden en het domein.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Van wiskundetaal naar contexttaal</div>
      <p>Voorbeeld: de halfpipe $h(x) = 0{,}25x^2$ ($x$ = afstand tot het midden in m, $h$ = hoogte in m).</p>
      <ul><li><b>dalparabool</b> ($a > 0$): de randen liggen hoger dan het midden.</li>
      <li><b>top</b> $(0, 0)$: het laagste punt, de bodem in het midden.</li>
      <li><b>symmetrie</b>: links en rechts van het midden is de halfpipe even hoog.</li>
      <li><b>toenemende stijging</b>: hoe dichter bij de rand, hoe steiler de wand.</li>
      <li><b>domein in de context</b>: enkel de $x$-waarden die zinvol zijn (van de linker- tot de rechterrand).</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Verdubbelen</div>
      <p>Bij $d(v) = kv^2$ geldt $d(2v) = k(2v)^2 = 4kv^2 = 4 \\cdot d(v)$. Dubbel zo snel: <b>4 keer</b> zo lange remweg. Drie keer zo snel: <b>9 keer</b>.</p></div>
    <div class="kader def"><div class="kader-titel">Domein in de context</div>
      <p>Wiskundig is het domein van $f(x) = ax^2$ altijd $\\mathbb{R}$. In een context is het vaak kleiner: een zijde of een snelheid is positief, een val duurt maar enkele seconden.</p>
      <p class="klein">Vierkant $A(z) = z^2$: domein $]0, +\\infty[$. Steen die na 3 s het water raakt: domein $[0, 3]$.</p></div>`,
  voorbeelden: [
    { tex: 'd(v) = 0{,}01v^2: \\; d(50) \\text{ en } d(100)', stappen: ['d(50) = 0{,}01 \\cdot 2500 = 25 \\text{ m}', 'd(100) = 0{,}01 \\cdot 10\\,000 = 100 \\text{ m}', '\\text{dubbel zo snel: 4 keer zo lang}'] },
  ],
  soorten: {
    context: { naam: 'Contexten', gen() {
      const c = kies(CONTEXT)();
      return { soort: 'context', opdracht: 'Lees goed en los op.', html: opgave(c.tekst), sleutel: c.sleutel, rapport: c.tekst.slice(0, 70), antw: c.antw, uitleg: c.uitleg };
    } },
  },
  oefenMix: [['context', 1]],
  test: [['context', 10]], testSchudden: false,
};

// ---- 9. Eindtest -----------------------------------------------------------------------------------
const D9 = {
  nr: 9, titel: 'Eindtest tweedegraadsfuncties', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van $f(x) = ax^2$ door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>`,
  voorbeelden: [],
  soorten: { tw: mix(D1, 'herken'), fw: mix(D2, 'bereken'), tk: mix(D2, 'tekenen'), sm: mix(D3, 'smal'), kp: mix(D3, 'koppel'), br: mix(D4, 'bereik'), te: mix(D4, 'teken'), vl: mix(D5, 'verloop'), ex: mix(D5, 'extremum'), sy: mix(D6, 'punt'), ei: mix(D7, 'eigen'), ap: mix(D7, 'aPunt'), cx: mix(D8, 'context') },
  oefenMix: [['tw', 1], ['fw', 1], ['tk', 1], ['sm', 1], ['kp', 1], ['br', 1], ['te', 1], ['vl', 1], ['ex', 1], ['sy', 1], ['ei', 1], ['ap', 1], ['cx', 1]],
  test: [['fw', 1], ['tk', 1], ['sm', 1], ['kp', 1], ['br', 1], ['vl', 1], ['sy', 1], ['ei', 1], ['ap', 1], ['cx', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'tweedegraadsfuncties-ax2', titel: 'Tweedegraadsfuncties', ondertitel: 'f(x) = ax² · 4BW-MWW', klas: '4BW-MWW', drempel: 70,
  intro: `<p>Je leert de tweedegraadsfunctie $f(x) = ax^2$ kennen: een tabel van waarden maken en de parabool tekenen, de invloed van de parameter $a$ voorspellen,
    en alle kenmerken bepalen (domein, bereik, nulwaarde, tekenverloop, stijgen en dalen, extremum, symmetrie). Tot slot pas je alles toe in herkenbare situaties.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · De parabool', delen: [1, 2, 3] }, { titel: 'B · Kenmerken', delen: [4, 5, 6, 7] }, { titel: 'C · Toepassingen', delen: [8] }, { titel: 'D · Eindtest', delen: [9] }],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9],
});
})();
