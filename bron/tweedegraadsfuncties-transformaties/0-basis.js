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
