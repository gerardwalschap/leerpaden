// ===================================================================
//  STELSELS VAN VERGELIJKINGEN (4BW-MWW) — gedeelde hulpfuncties
// ===================================================================
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x, d = null) => W.texGetal(x, d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kT = (t) => t.map((x, i) => ({ k: String(i), l: `\\text{${x}}` }));
const kTex = (t) => t.map((x, i) => ({ k: String(i), l: x }));
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
// breuken {t, n}
const Q = (t, n = 1) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return { t: t / g, n: n / g, v: t / n }; };
const qTex = (q) => q.n === 1 ? tg(q.t) : `${q.t < 0 ? '-' : ''}\\frac{${Math.abs(q.t)}}{${q.n}}`;
const qHaak = (q) => q.v < 0 ? `\\left(${qTex(q)}\\right)` : qTex(q);
// antwoorden met formule-editor (echte breuken)
const getal = (q, voor = '') => ({ soort: 'getal', waarde: typeof q === 'number' ? q : q.v, voor, editor: true, placeholder: '', ...(typeof q !== 'number' && q.n !== 1 ? { tex: qTex(q) } : {}) });
const uitdr = (expr, tex, voor = '') => ({ soort: 'veelterm', expr, tex, voor, editor: true, placeholder: '' });

// ---- vergelijkingen ax + by = c als TeX
function term(c, l, eerst) {
  const a = typeof c === 'number' ? Q(c) : c;
  if (a.t === 0) return '';
  const abs = Q(Math.abs(a.t), a.n), co = l && abs.n === 1 && abs.t === 1 ? '' : qTex(abs);
  return eerst ? `${a.t < 0 ? '-' : ''}${co}${l}` : `${a.t < 0 ? '-' : '+'} ${co}${l}`;
}
function lid(termen) { const t = termen.filter(([c]) => (typeof c === 'number' ? c : c.t) !== 0); if (!t.length) return '0'; return t.map(([c, l], i) => term(c, l, i === 0)).join(' ').replace(/\+ -/g, '-'); }
const vglTex = (v) => `${lid([[v.a, 'x'], [v.b, 'y']])} = ${qTex(typeof v.c === 'number' ? Q(v.c) : v.c)}`;
const stelselTex = (v1, v2) => `\\left\\{\\begin{array}{l} ${typeof v1 === 'string' ? v1 : vglTex(v1)} \\\\ ${typeof v2 === 'string' ? v2 : vglTex(v2)} \\end{array}\\right.`;
const VTex = (x, y) => `V = \\{(${qTex(typeof x === 'number' ? Q(x) : x)},\\, ${qTex(typeof y === 'number' ? Q(y) : y)})\\}`;
// willekeurig stelsel met oplossing (x0, y0): coëfficiënten geheel, determinant ≠ 0
function stelsel(opt = {}) {
  for (;;) {
    const x0 = opt.x0 ?? nz(-6, 6), y0 = opt.y0 ?? rnd(-6, 6);
    const A = () => (opt.een && kies([true, false]) ? kies([1, -1]) : nz(-5, 5));
    const v1 = { a: A(), b: nz(-5, 5) }, v2 = { a: nz(-5, 5), b: opt.een ? kies([1, -1, nz(-4, 4)]) : nz(-5, 5) };
    if (v1.a * v2.b - v2.a * v1.b === 0) continue;
    if (opt.filter && !opt.filter(v1, v2)) continue;
    v1.c = v1.a * x0 + v1.b * y0; v2.c = v2.a * x0 + v2.b * y0;
    return { v1, v2, x: x0, y: y0 };
  }
}
// stelsel met (mogelijk) een breuk als oplossing
function stelselQ(kans = 0.3) {
  if (Math.random() > kans) return { ...stelsel(), xq: null };
  for (;;) {
    const v1 = { a: nz(-5, 5), b: nz(-5, 5), c: rnd(-12, 12) }, v2 = { a: nz(-5, 5), b: nz(-5, 5), c: rnd(-12, 12) };
    const D = v1.a * v2.b - v2.a * v1.b; if (!D) continue;
    const x = Q(v1.c * v2.b - v2.c * v1.b, D), y = Q(v1.a * v2.c - v2.a * v1.c, D);
    if (x.n === 1 && y.n === 1) continue;
    if (x.n > 6 || y.n > 6 || Math.abs(x.v) > 8 || Math.abs(y.v) > 8) continue;
    return { v1, v2, x: x.v, y: y.v, xq: x, yq: y };
  }
}
// y = (c − ax)/b als uitdrukking en TeX
function naarY(v) {
  const m = Q(-v.a, v.b), q = Q(v.c, v.b);
  const expr = `(${v.c}-(${v.a})*x)/(${v.b})`;
  const tex = (v.b === 1 || v.b === -1 || (v.a % v.b === 0 && v.c % v.b === 0)) ? lid([[m, 'x'], [q, '']]) : (v.b < 0 ? `\\frac{${lid([[-v.c, ''], [v.a, 'x']])}}{${-v.b}}` : `\\frac{${lid([[v.c, ''], [-v.a, 'x']])}}{${v.b}}`);
  return { m, q, expr, tex };
}
function naarX(v) { // x = (c − by)/a
  const expr = `(${v.c}-(${v.b})*y)/(${v.a})`;
  const tex = (v.a === 1 || v.a === -1 || (v.b % v.a === 0 && v.c % v.a === 0)) ? lid([[Q(-v.b, v.a), 'y'], [Q(v.c, v.a), '']]) : (v.a < 0 ? `\\frac{${lid([[-v.c, ''], [v.b, 'y']])}}{${-v.a}}` : `\\frac{${lid([[v.c, ''], [-v.b, 'y']])}}{${v.a}}`);
  return { expr, tex };
}
const xyAntw = (s) => [['x =', getal(s.xq || s.x)], ['y =', getal(s.yq || s.y)]];

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
