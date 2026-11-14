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
