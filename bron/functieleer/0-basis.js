// ===================================================================
//  FUNCTIELEER (7VJHO) — gedeelde hulpfuncties
// ===================================================================
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x, d = null) => W.texGetal(x, d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kT = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const kTex = (texen) => texen.map((t, i) => ({ k: String(i), l: t }));
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const tekst = (s) => String(s).replace('.', ',');
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;

// ---- breuken: Q = {t, n} met n > 0, vereenvoudigd
const Q = (t, n = 1) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return { t: t / g, n: n / g, v: t / n }; };
const qTex = (q) => q.n === 1 ? tg(q.t) : `${q.t < 0 ? '-' : ''}\\frac{${Math.abs(q.t)}}{${q.n}}`;
const qStr = (q) => q.n === 1 ? String(q.t) : `(${q.t}/${q.n})`;
const qGetal = (q, extra = {}) => getal(q.v, extra);
// ax + b als TeX (a en b als Q of getal)
function linTex(a, b, naam = 'f', vr = 'x') {
  a = typeof a === 'number' ? Q(a) : a; b = typeof b === 'number' ? Q(b) : b;
  let s = '';
  if (a.t !== 0) s = (a.n === 1 && Math.abs(a.t) === 1 ? (a.t < 0 ? '-' : '') : qTex(a)) + vr;
  if (b.t !== 0 || !s) s += s ? ` ${b.t < 0 ? '-' : '+'} ${qTex(Q(Math.abs(b.t), b.n))}` : qTex(b);
  return naam ? `${naam}(${vr}) = ${s}` : s;
}
const linExpr = (a, b) => { a = typeof a === 'number' ? Q(a) : a; b = typeof b === 'number' ? Q(b) : b; return `${qStr(a)}*x+${qStr(b)}`; };
const fAntw = (a, b, naam = 'f') => ({ soort: 'functie', vorm: 'vrij', expr: linExpr(a, b), tex: linTex(a, b, null), voor: `${naam}(x) =`, placeholder: 'bv. 2x + 1' });

// ---- verzamelingen (domein, bereik)
const vzAntw = (stukken, voor) => ({ soort: 'verzameling', stukken, voor });
const vzTex = (st) => VZ.texVan(st);

// ---- functiewaardentabel als TeX
function tabelTex(xs, ys, xn = 'x', yn = 'f(x)') {
  const c = (v) => v === null ? '/' : typeof v === 'string' ? v : tg(v);
  return `\\begin{array}{c|${'c'.repeat(xs.length)}} ${xn} & ${xs.map(c).join(' & ')} \\\\ \\hline ${yn} & ${ys.map(c).join(' & ')} \\end{array}`;
}

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

// waarde van een veelhoekslijn (met doorlopende uiteinden) in x
function lijnWaarde(st, x) {
  const p = st.pts;
  for (let i = 0; i < p.length - 1; i++) if (x >= p[i][0] && x <= p[i + 1][0]) return p[i][1] + (p[i + 1][1] - p[i][1]) * (x - p[i][0]) / (p[i + 1][0] - p[i][0]);
  if (x < p[0][0] && st.begin === 'door') return p[0][1] + (p[1][1] - p[0][1]) * (x - p[0][0]) / (p[1][0] - p[0][0]);
  const n = p.length - 1;
  if (x > p[n][0] && st.eind === 'door') return p[n][1] + (p[n][1] - p[n - 1][1]) * (x - p[n][0]) / (p[n][0] - p[n - 1][0]);
  return null;
}
// domein en bereik van een grafiek uit stukken
function domBer(stukken) {
  const dom = [], ber = [];
  for (const s of stukken) {
    const p = s.pts, n = p.length - 1;
    dom.push({ a: s.begin === 'door' ? -Infinity : p[0][0], ai: s.begin === 'vol', b: s.eind === 'door' ? Infinity : p[n][0], bi: s.eind === 'vol' });
    // kandidaten voor min en max: alle hoekpunten (binnenin: inbegrepen), uiteinden volgens bolletje
    const kand = p.map((q, i) => ({ y: q[1], in: i === 0 ? s.begin === 'vol' : i === n ? s.eind === 'vol' : true, door: (i === 0 && s.begin === 'door') || (i === n && s.eind === 'door') }));
    let lo = Infinity, hi = -Infinity;
    if (s.begin === 'door') { const sl = p[1][1] - p[0][1]; if (sl > 0) lo = -Infinity; if (sl < 0) hi = Infinity; }
    if (s.eind === 'door') { const sl = p[n][1] - p[n - 1][1]; if (sl > 0) hi = Infinity; if (sl < 0) lo = -Infinity; }
    const ys = kand.map(k => k.y);
    const mn = Math.min(...ys), mx = Math.max(...ys);
    const a = lo === -Infinity ? -Infinity : mn, b = hi === Infinity ? Infinity : mx;
    const ai = a !== -Infinity && kand.some(k => k.y === mn && (k.in || k.door));
    const bi = b !== Infinity && kand.some(k => k.y === mx && (k.in || k.door));
    ber.push({ a, ai, b, bi });
  }
  return { dom: VZ.normaliseer(dom), ber: VZ.normaliseer(ber) };
}
