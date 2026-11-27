// Programma 'sinusfunctie' — automatisch samengevoegd uit bron/sinusfunctie/ (niet rechtstreeks bewerken)
(() => {
// ===== Sinusfunctie · Wiskunde 5WW / 5BCW — hulpmiddelen =====
// Leidraad: de cursus "5. Sinusfunctie" en de PWP "5. Sinusfunctie" (G. Walschap).
// Geen GeoGebra nodig: bij de vergelijkingen staat een grafiekvenster (klasse .gvs, eigen luisteraars) met π op de x-as.
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(x, d);
const kg = (x, d = null) => W.komma(x, d);                 // getal als tekst met komma
const M = (t) => W.tex(t);                                  // KaTeX als HTML (voor knoppen)
const BLAUW = '#1c4e8a', ORANJE = '#e8772e', GROEN = '#2e7d4f', GRIJS = '#9aa3b2';
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
// meerkeuze met tekstzinnen (onder elkaar); de juiste staat op plaats 0 en wordt geschud
function zinnen(juist, fout, opt = {}) {
  const alle = schud([juist, ...fout.filter((z, i, a) => z && z !== juist && a.indexOf(z) === i).slice(0, opt.max || 3)]);
  return { soort: 'keuze', lijst: opt.lijst !== false, opties: alle.map((z, i) => ({ k: String(i), l: z, html: true })), juist: String(alle.indexOf(juist)) };
}
// meerkeuze met figuren (SVG)
function figuren(juist, fout) {
  const alle = schud([juist, ...fout].map((l, i) => ({ l, nr: i })));
  return { soort: 'keuze', opties: alle.map((o, i) => ({ k: String(i), l: o.l, html: true, tekst: `grafiek ${'ABCD'[i]}` })), juist: String(alle.findIndex(o => o.nr === 0)) };
}
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const p_ = (t) => `<p>${t}</p>`;
const zin = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- intervallen in de notatie van de werkbundel: [0 ; 24]
const ivTex = (a, b, ai = true, bi = true) => `${ai ? '[' : '{]}'}${a === -Infinity ? '{-\\infty}' : `{${tg(a)}}`} \\,;\\, ${b === Infinity ? '+\\infty' : tg(b)}${bi ? ']' : '{[}'}`;
const ivTekst = (a, b, ai = true, bi = true) => `${ai ? '[' : ']'}${a === -Infinity ? '−∞' : kg(a)} ; ${b === Infinity ? '+∞' : kg(b)}${bi ? ']' : '['}`;
const vz = (stukken, voor) => ({ soort: 'verzameling', stukken, voor });
const I = Infinity;

// ---------- tabellen (tekenschema / verloopschema) als HTML
// kol: lijst cellen; elke cel {x, y} (x = tekst boven, y = tekst onder)
function schema(xn, yn, cellen) {
  return `<table class="tabel tekenschema"><tr><th>$${xn}$</th>${cellen.map(c => `<td>${c.x ?? ''}</td>`).join('')}</tr>
    <tr><th>$${yn}$</th>${cellen.map(c => `<td>${c.y ?? ''}</td>`).join('')}</tr></table>`;
}
const PIJL_OP = '↗', PIJL_NEER = '↘';

// ---------- grafieken (SVG) met eigen schaal op elke as
// opt: { x:[X0,X1], y:[Y0,Y1], xs, ys (stappen), xn, yn (asnamen), functies:[{f, van, tot, kleur}], ha:[getal], va:[getal], breed, hoog, punten:[{x,y,hol}], losse: true (losse punten), klein }
const top = (v) => { const s = nice(v / 5); return Math.ceil(v / s - 1e-9) * s; }; // nette bovengrens voor een as
function nice(v) { const e = 10 ** Math.floor(Math.log10(v)), r = v / e; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * e; }
function rgrafKern(opt) {
  const [X0, X1] = opt.x, [Y0, Y1] = opt.y;
  const B = opt.breed || 360, H = opt.hoog || 230, ml = opt.klein ? 34 : 46, mr = 14, mt = 14, mb = opt.klein ? 26 : 38;
  const w = ml + B + mr, h = mt + H + mb;
  const X = (x) => ml + (x - X0) / (X1 - X0) * B, Y = (y) => mt + (Y1 - y) / (Y1 - Y0) * H;
  const xs = opt.xs || (opt.pi ? Math.PI * nice((X1 - X0) / 6 / Math.PI) : nice((X1 - X0) / 6)), ys = opt.ys || nice((Y1 - Y0) / 6);
  const fs = opt.klein ? 9 : 10, num = (v) => (v < 0 ? '−' : '') + kg(Math.abs(+v.toFixed(6)));
  let g = '';
  for (let k = Math.ceil(X0 / xs) * xs; k <= X1 + 1e-9; k += xs) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/><text x="${X(k)}" y="${Y(Y0) + 13}" font-size="${fs}" text-anchor="middle" fill="#555">${opt.pi ? piLabel(k) : num(k)}</text>`;
  for (let k = Math.ceil(Y0 / ys) * ys; k <= Y1 + 1e-9; k += ys) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/><text x="${X(X0) - 4}" y="${Y(k) + 3}" font-size="${fs}" text-anchor="end" fill="#555">${num(k)}</text>`;
  // assen: x-as op y = 0 als die in beeld is, anders onderaan
  const yAs = Y0 <= 0 && Y1 >= 0 ? Y(0) : Y(Y0), xAs = X0 <= 0 && X1 >= 0 ? X(0) : X(X0);
  g += `<line x1="${X(X0)}" y1="${yAs}" x2="${X(X1)}" y2="${yAs}" stroke="#1f2733" stroke-width="1.2"/><line x1="${xAs}" y1="${Y(Y0)}" x2="${xAs}" y2="${Y(Y1)}" stroke="#1f2733" stroke-width="1.2"/>`;
  if (!opt.klein && opt.xn) g += `<text x="${ml + B / 2}" y="${h - 6}" font-size="11" text-anchor="middle" fill="#333">${opt.xn}</text>`;
  if (!opt.klein && opt.yn) g += `<text x="12" y="${mt + H / 2}" font-size="11" text-anchor="middle" fill="#333" transform="rotate(-90 12 ${mt + H / 2})">${opt.yn}</text>`;
  let k = '';
  for (const a of opt.ha || []) if (a >= Y0 && a <= Y1) k += `<line x1="${X(X0)}" y1="${Y(a)}" x2="${X(X1)}" y2="${Y(a)}" stroke="${ORANJE}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  for (const a of opt.va || []) if (a >= X0 && a <= X1) k += `<line x1="${X(a)}" y1="${Y(Y0)}" x2="${X(a)}" y2="${Y(Y1)}" stroke="${ORANJE}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  const lijn = (f, van, tot, n) => {
    let d = '', aan = false;
    for (let i = 0; i <= n; i++) {
      const x = van + (tot - van) * i / n, y = f(x);
      if (!isFinite(y) || y < Y0 - (Y1 - Y0) || y > Y1 + (Y1 - Y0)) { aan = false; continue; }
      const yy = Math.max(Y0 - (Y1 - Y0) * 0.05, Math.min(Y1 + (Y1 - Y0) * 0.05, y));
      d += `${aan ? 'L' : 'M'}${X(x).toFixed(1)},${Y(yy).toFixed(1)} `; aan = true;
    }
    return d;
  };
  for (const fn of opt.functies || []) {
    const van = Math.max(fn.van ?? X0, X0), tot = Math.min(fn.tot ?? X1, X1);
    // na in- of uitzoomen: de grafiek buiten het praktisch domein lichtgrijs en gestreept (zoals in het grafiekvenster)
    if (opt.buiten) {
      if (fn.van != null && fn.van > X0) k += `<path d="${lijn(fn.f, X0, Math.min(fn.van, X1), 400)}" fill="none" stroke="#b9c2cf" stroke-width="1.6" stroke-dasharray="4 4"/>`;
      if (fn.tot != null && fn.tot < X1) k += `<path d="${lijn(fn.f, Math.max(fn.tot, X0), X1, 400)}" fill="none" stroke="#b9c2cf" stroke-width="1.6" stroke-dasharray="4 4"/>`;
    }
    if (van >= tot) continue;
    if (opt.losse || fn.losse) {
      const st = Math.max(fn.stap || 1, Math.ceil((tot - van) / 160));
      for (let x = Math.ceil(van); x <= tot; x += st) { const y = fn.f(x); if (y >= Y0 && y <= Y1) k += `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="1.8" fill="${fn.kleur || BLAUW}"/>`; }
      continue;
    }
    k += `<path d="${lijn(fn.f, van, tot, 600)}" fill="none" stroke="${fn.kleur || BLAUW}" stroke-width="${opt.klein ? 2 : 2.4}"/>`;
  }
  for (const p of opt.punten || []) if (p.x >= X0 && p.x <= X1 && p.y >= Y0 && p.y <= Y1) k += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4" fill="${p.hol ? '#fff' : BLAUW}" stroke="${BLAUW}" stroke-width="2"/>`;
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif;max-width:100%;height:auto">
    <defs><clipPath id="${id}"><rect x="${ml}" y="${mt - 2}" width="${B}" height="${H + 4}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${k}</g></svg>`;
}
// ---------- zoombare grafiek: elke functie heeft ook een formule e (bv. '1200*x/(x+8)') zodat de pagina
// de grafiek zelf opnieuw kan tekenen bij in- en uitzoomen (ook na herladen of bij een bekeken test).
// Kleine grafiekjes (klein: true, bv. in meerkeuzevragen) blijven gewoon vast.
const rgFormule = (e) => { const body = String(e).replace(/\^/g, '**'); if (!/^[0-9a-z+\-*/(). ]*$/i.test(body)) return () => NaN;
  const fn = new Function('x', `"use strict"; return (${body});`); return (x) => { const y = fn(x); return isFinite(y) ? y : NaN; }; };
const ZOOM_KNOPPEN = (soort) => `<div class="zoom-tools"><button type="button" class="zoom-knop" data-zoom="in" data-zs="${soort}" title="Inzoomen">＋ Inzoomen</button><button type="button" class="zoom-knop" data-zoom="uit" data-zs="${soort}" title="Uitzoomen">− Uitzoomen</button><button type="button" class="zoom-knop licht" data-zoom="terug" data-zs="${soort}" title="Terug naar het beginbeeld">⟲ Beginbeeld</button><span class="zoom-hulp">sleep om te verschuiven</span></div>`;
function rgraf(opt) {
  const zoombaar = false;
  if (!zoombaar) return rgrafKern(opt);
  const spec = { ...opt, functies: opt.functies.map(({ f, ...rest }) => rest) };
  return `<div class="rg" data-rg='${String(JSON.stringify(spec)).replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}'>${rgrafKern(opt)}${ZOOM_KNOPPEN('rg')}</div>`;
}
const figuur = (svg) => `<div class="figuur">${svg}</div>`;

// ---------- π-labels: 3π/2, −π/4, 2π …
function piLabel(v) {
  const q = v / Math.PI; if (Math.abs(q) < 1e-9) return '0';
  for (const d of [1, 2, 3, 4, 6, 12]) { const n = Math.round(q * d); if (Math.abs(q * d - n) < 1e-6) { const g = W.ggd(n, d) || 1, t = n / g, nn = d / g; return `${t < 0 ? '−' : ''}${Math.abs(t) === 1 ? '' : Math.abs(t)}π${nn > 1 ? '/' + nn : ''}`; } }
  return kg(W.rond(v, 2));
}

function extrema(f, a, b, N = 3000) {
  const xs = []; for (let i = 0; i <= N; i++) xs.push(a + (b - a) * i / N);
  const ys = xs.map(f), lokMax = [], lokMin = [];
  const fijn = (i, max) => { let lo = xs[i - 1], hi = xs[i + 1]; for (let k = 0; k < 100; k++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if ((f(m1) < f(m2)) === max) lo = m1; else hi = m2; } const x = (lo + hi) / 2; return { x, y: f(x) }; };
  for (let i = 1; i < N; i++) {
    if (ys[i] > ys[i - 1] && ys[i] >= ys[i + 1]) lokMax.push(fijn(i, true));
    if (ys[i] < ys[i - 1] && ys[i] <= ys[i + 1]) lokMin.push(fijn(i, false));
  }
  const kand = [{ x: a, y: f(a) }, { x: b, y: f(b) }, ...lokMax, ...lokMin];
  const absMax = kand.reduce((p, q) => q.y > p.y ? q : p), absMin = kand.reduce((p, q) => q.y < p.y ? q : p);
  return { lokMax, lokMin, absMax, absMin };
}
function nulpunten(f, a, b, c = 0) {
  const N = 4000, uit = []; let vx = a, vy = f(a) - c;
  if (Math.abs(vy) < 1e-9) uit.push(a);
  for (let i = 1; i <= N; i++) {
    const x = a + (b - a) * i / N, y = f(x) - c;
    if (Math.abs(y) < 1e-9) { if (!uit.length || Math.abs(uit[uit.length - 1] - x) > (b - a) / N * 2) uit.push(x); }
    else if (vy * y < 0 && Math.abs(vy) > 1e-9) { let lo = vx, hi = x; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if ((f(lo) - c) * (f(m) - c) <= 0) hi = m; else lo = m; } uit.push((lo + hi) / 2); }
    vx = x; vy = y;
  }
  return uit;
}
const r0 = (x) => W.rond(x, 0), r1 = (x) => W.rond(x, 1), r2 = (x) => W.rond(x, 2);

// =====================================================================
//  GRAFIEKVENSTER — de grafiek staat klaar met de formule al ingevuld.
//  Leerlingen moeten niets overtypen in GeoGebra: bewegen over de grafiek,
//  een functiewaarde berekenen, snijden met een horizontale rechte, het
//  hoogste/laagste punt zoeken, of zelf parameters invullen (deel 10).
//  De vensters werken via één set luisteraars op het document, zodat ze ook
//  werken na elke nieuwe weergave van de pagina (en in bekeken toetsen).
// =====================================================================
const GV_STIJL = `
.gvs{border:1px solid #c9d3e3;border-radius:10px;padding:10px 12px;margin:12px 0;background:#f6f9fd;text-align:left}
.gv-kop{font-weight:bold;color:#1c4e8a;margin-bottom:6px;font-size:14px}
.gv-kop span{font-weight:normal;color:#555;font-size:12.5px}
.gvs svg{touch-action:none;cursor:crosshair;display:block;margin:0 auto;max-width:100%;height:auto;background:#fff;border-radius:6px;border:1px solid #e3e7ee}
.gv-uit{min-height:1.5em;font-size:14px;color:#1f2733;margin:6px 0 8px;text-align:center}
.gv-tools{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;justify-content:center;font-size:14px}
.gv-tool{display:flex;align-items:center;gap:6px;white-space:nowrap}
.gv-in{width:80px;padding:4px 6px;font-size:14px;border:1px solid #b8c4d6;border-radius:5px}
.gvs .gv-knop{padding:5px 10px;font-size:13px;border-radius:6px;border:1px solid #1c4e8a;background:#1c4e8a;color:#fff;cursor:pointer}
.gvs .gv-knop.licht{background:#fff;color:#1c4e8a}
.gvs select{padding:4px;font-size:14px}
.gv-res{font-size:14.5px;margin-top:8px;text-align:center;color:#1f2733;line-height:1.6}
.gv-res b{color:#1c4e8a}
.gv-let{color:#b85c00}
.gv-leg{font-size:12px;color:#555;text-align:center;margin-top:4px}
.gv-leg i{font-style:normal;display:inline-block;width:16px;height:3px;vertical-align:middle;margin:0 4px 0 10px}
.zoom-tools{display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;margin:6px 0 4px;font-size:13px}
.zoom-knop{padding:4px 10px;font-size:13px;border-radius:6px;border:1px solid #1c4e8a;background:#1c4e8a;color:#fff;cursor:pointer}
.zoom-knop.licht{background:#fff;color:#1c4e8a}
.zoom-hulp{color:#667;font-size:12px}
.rg{display:inline-block;max-width:100%}
.rg svg{touch-action:none;cursor:grab;display:block;margin:0 auto}
.rg svg:active{cursor:grabbing}
.legende{color:#38414f;margin:2px 0 8px;font-size:14px}
.vraagzin{margin-top:12px;font-size:16px}
.woord{border-bottom:2px dotted #e8772e;cursor:help;position:relative;outline:none}
.woord .woord-uitleg{display:none;position:absolute;left:0;top:1.5em;z-index:30;width:250px;background:#fffbe6;border:1px solid #e8c36a;border-radius:6px;padding:6px 8px;font-size:13px;line-height:1.4;color:#1f2733;font-weight:normal;font-style:normal;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.woord:hover .woord-uitleg,.woord:focus .woord-uitleg{display:block}
`;
const GV_KLEUR = ['#1c4e8a', '#2e7d4f', '#8e44ad', '#c0392b'];
const gvLees = (s) => {
  let t = String(s ?? '').trim().replace(/\s/g, '').replace(/,/g, '.').replace(/[−–]/g, '-').replace(/pi/gi, 'π');
  if (t === '') return NaN;
  if (!t.includes('π')) return Number(t);
  t = t.replace(/(\d)π/g, '$1*π').replace(/π(\d)/g, 'π*$1').replace(/π/g, '(' + Math.PI + ')');
  if (!/^[0-9.()+\-*/]+$/.test(t)) return NaN;
  try { const v = new Function(`"use strict"; return (${t});`)(); return typeof v === 'number' ? v : NaN; } catch (e) { return NaN; }
};
// getal netjes met komma: maximaal d decimalen, geen overbodige nullen
function gvGetal(v, d = 2) {
  if (!isFinite(v)) return '?';
  let r = Number(v.toFixed(d)); if (Object.is(r, -0)) r = 0;
  return (r < 0 ? '−' : '') + String(Math.abs(r)).replace('.', ',');
}
const gvAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function gvFuncties(sp, root) {
  const pars = (sp.par || []).map(p => {
    const el = root && root.querySelector(`.gv-par[data-n="${p.n}"]`);
    const v = el ? gvLees(el.value) : p.w;
    return [p.n, isFinite(v) ? v : p.w];
  });
  return sp.fs.map(F => {
    const body = String(F.e).replace(/\^/g, '**');
    if (!/^[0-9a-z+\-*/(). ]*$/i.test(body)) return () => NaN;
    const fn = new Function('x', ...pars.map(p => p[0]), `"use strict"; return (${body});`);
    return (x) => { const y = fn(x, ...pars.map(p => p[1])); return isFinite(y) ? y : NaN; };
  });
}
// afmetingen van het venster
const GV_M = { ml: 52, mr: 16, mt: 14, mb: 40, B: 440, H: 270 };
function gvSvg(sp, fs) {
  const { ml, mr, mt, mb, B, H } = GV_M, [X0, X1] = sp.X, [Y0, Y1] = sp.Y;
  const w = ml + B + mr, h = mt + H + mb;
  const X = (x) => ml + (x - X0) / (X1 - X0) * B, Y = (y) => mt + (Y1 - y) / (Y1 - Y0) * H;
  const xs = sp.xs || (sp.pi ? Math.PI * nice((X1 - X0) / 7 / Math.PI) : nice((X1 - X0) / 7)), ys = sp.ys || nice((Y1 - Y0) / 6);
  const num = (v) => gvGetal(+v.toFixed(6), 4);
  let g = '';
  for (let k = Math.ceil(X0 / xs - 1e-9) * xs; k <= X1 + 1e-9; k += xs) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/><text x="${X(k)}" y="${Y(Y0) + 14}" font-size="10" text-anchor="middle" fill="#555">${sp.pi ? piLabel(k) : num(k)}</text>`;
  for (let k = Math.ceil(Y0 / ys - 1e-9) * ys; k <= Y1 + 1e-9; k += ys) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/><text x="${X(X0) - 4}" y="${Y(k) + 3}" font-size="10" text-anchor="end" fill="#555">${num(k)}</text>`;
  const yAs = Y0 <= 0 && Y1 >= 0 ? Y(0) : Y(Y0), xAs = X0 <= 0 && X1 >= 0 ? X(0) : X(X0);
  g += `<line x1="${X(X0)}" y1="${yAs}" x2="${X(X1)}" y2="${yAs}" stroke="#1f2733" stroke-width="1.2"/><line x1="${xAs}" y1="${Y(Y0)}" x2="${xAs}" y2="${Y(Y1)}" stroke="#1f2733" stroke-width="1.2"/>`;
  if (sp.xn) g += `<text x="${ml + B / 2}" y="${h - 6}" font-size="11.5" text-anchor="middle" fill="#333">${gvAttr(sp.xn)}</text>`;
  if (sp.yn) g += `<text x="13" y="${mt + H / 2}" font-size="11.5" text-anchor="middle" fill="#333" transform="rotate(-90 13 ${mt + H / 2})">${gvAttr(sp.yn)}</text>`;
  let k = '';
  if (sp.asym) {
    for (const a of sp.ha || []) if (a >= Y0 && a <= Y1) k += `<line x1="${X(X0)}" y1="${Y(a)}" x2="${X(X1)}" y2="${Y(a)}" stroke="${ORANJE}" stroke-width="1.5" stroke-dasharray="6 5"/>`;
    for (const a of sp.va || []) if (a >= X0 && a <= X1) k += `<line x1="${X(a)}" y1="${Y(Y0)}" x2="${X(a)}" y2="${Y(Y1)}" stroke="${ORANJE}" stroke-width="1.5" stroke-dasharray="6 5"/>`;
  }
  const pad = (f, van, tot, n) => {
    let d = '', aan = false;
    for (let i = 0; i <= n; i++) {
      const x = van + (tot - van) * i / n, y = f(x);
      if (!isFinite(y) || y < Y0 - (Y1 - Y0) || y > Y1 + (Y1 - Y0)) { aan = false; continue; }
      const yy = Math.max(Y0 - (Y1 - Y0) * 0.05, Math.min(Y1 + (Y1 - Y0) * 0.05, y));
      d += `${aan ? 'L' : 'M'}${X(x).toFixed(1)},${Y(yy).toFixed(1)} `; aan = true;
    }
    return d;
  };
  const a = sp.a ?? X0, b = sp.b ?? X1;
  fs.forEach((f, i) => {
    const kl = sp.fs[i].k || GV_KLEUR[i % GV_KLEUR.length];
    // buiten het praktisch domein: lichtgrijs en gestreept (de wiskundige grafiek)
    if (sp.buiten !== false) {
      if (a > X0) k += `<path d="${pad(f, X0, a, 300)}" fill="none" stroke="#b9c2cf" stroke-width="1.6" stroke-dasharray="4 4"/>`;
      if (b < X1) k += `<path d="${pad(f, b, X1, 300)}" fill="none" stroke="#b9c2cf" stroke-width="1.6" stroke-dasharray="4 4"/>`;
    }
    if (sp.losse) {
      const st = Math.max(1, Math.ceil((b - a) / 160));
      for (let x = Math.ceil(a); x <= b; x += st) { const y = f(x); if (isFinite(y) && y >= Y0 && y <= Y1) k += `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="2" fill="${kl}"/>`; }
    } else {
      const eps = (b - a) * 1e-4;
      k += `<path class="gv-kromme" d="${pad(f, a + (sp.ao ? eps : 0), b - (sp.bo ? eps : 0), 700)}" fill="none" stroke="${kl}" stroke-width="2.6"/>`;
      if (!sp.ao && isFinite(f(a)) && f(a) >= Y0 && f(a) <= Y1 && a > X0) k += `<circle cx="${X(a)}" cy="${Y(f(a))}" r="3.5" fill="${kl}"/>`;
      if (!sp.bo && isFinite(f(b)) && f(b) >= Y0 && f(b) <= Y1 && b < X1) k += `<circle cx="${X(b)}" cy="${Y(f(b))}" r="3.5" fill="${kl}"/>`;
    }
  });
  for (const p of sp.pts || []) k += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="none" stroke="${ORANJE}" stroke-width="2.4"/><circle cx="${X(p.x)}" cy="${Y(p.y)}" r="2" fill="${ORANJE}"/>`;
  const id = 'gv' + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiekvenster" style="font-family:Verdana,sans-serif">
    <defs><clipPath id="${id}"><rect x="${ml}" y="${mt - 2}" width="${B}" height="${H + 4}"/></clipPath></defs>${g}<g class="gv-krommen" clip-path="url(#${id})">${k}</g><g class="gv-laag" clip-path="url(#${id})"></g></svg>`;
}
// het venster als HTML. spec: { fs:[{e, n, k?}], X, Y, a, b, ao, bo, losse, xv, xe, ye, xn, yn, t (gereedschap: v f s m p), par:[{n, w}], pts, ha, va, asym, buiten }
function venster(sp) {
  const t = sp.t || 'vfsm', fs = gvFuncties(sp, null), meer = sp.fs.length > 1;
  const kies = meer ? `<label class="gv-tool">grafiek <select class="gv-kies">${sp.fs.map((F, i) => `<option value="${i}">${F.n}</option>`).join('')}</select></label>` : '';
  const tools = [];
  if (t.includes('p')) tools.push(...sp.par.map(p => `<label class="gv-tool">${p.n} = <input class="gv-in gv-par" data-n="${p.n}" data-gv-enter="t" value="${gvGetal(p.w, 4)}" inputmode="decimal" autocomplete="off"></label>`), '<button type="button" class="gv-knop" data-gv-actie="t">Teken</button>');
  if (t.includes('f')) tools.push(`<span class="gv-tool">${sp.xv} = <input class="gv-in gv-x" data-gv-enter="f" inputmode="decimal" autocomplete="off"><button type="button" class="gv-knop" data-gv-actie="f">Bereken</button></span>`);
  if (t.includes('s')) tools.push(`<span class="gv-tool">y = <input class="gv-in gv-y" data-gv-enter="s" inputmode="decimal" autocomplete="off"><button type="button" class="gv-knop" data-gv-actie="s">Snijpunt</button></span>`);
  if (t.includes('m')) tools.push(`<button type="button" class="gv-knop licht" data-gv-actie="m">Hoogste en laagste punt</button>`);
  const leg = meer || (sp.pts && sp.pts.length) ? `<div class="gv-leg">${meer ? sp.fs.map((F, i) => `<i style="background:${F.k || GV_KLEUR[i]}"></i>${F.n}`).join('') : ''}${sp.pts && sp.pts.length ? `<i style="background:${ORANJE};height:8px;width:8px;border-radius:50%"></i>gegeven punt${sp.pts.length > 1 ? 'en' : ''}` : ''}</div>` : '';
  const hulp = t.includes('v') ? 'Beweeg over de grafiek (of tik erop) om de waarden te zien.' : '';
  return `<!--gv--><div class="gvs" data-gv='${gvAttr(JSON.stringify(sp))}'>
    <div class="gv-kop">📈 Grafiekvenster <span>· de formule staat er al in${sp.a != null && !sp.geenDomein ? ' · blauw = praktisch domein' : ''}</span></div>
    ${gvSvg(sp, fs)}${ZOOM_KNOPPEN('gv')}${leg}<div class="gv-uit">${hulp}</div><div class="gv-tools">${kies}${tools.join('')}</div><div class="gv-res"></div></div><!--/gv-->`;
}
// ---------- de luisteraars (één keer per pagina)
(() => {
  if (typeof document === 'undefined' || window.__gvsKlaar) return;
  window.__gvsKlaar = true;
  const st = document.createElement('style'); st.textContent = GV_STIJL; document.head.appendChild(st);
  const spec = (root) => { try { return JSON.parse(root.dataset.gv); } catch (e) { return null; } };
  const keuze = (root) => { const s = root.querySelector('.gv-kies'); return s ? +s.value : 0; };
  const geom = (sp) => { const { ml, mt, B, H } = GV_M, [X0, X1] = sp.X, [Y0, Y1] = sp.Y; return { X: (x) => ml + (x - X0) / (X1 - X0) * B, Y: (y) => mt + (Y1 - y) / (Y1 - Y0) * H, x: (px) => X0 + (px - ml) / B * (X1 - X0), X0, X1, Y0, Y1 }; };
  const inDom = (sp, x) => { const a = sp.a ?? -Infinity, b = sp.b ?? Infinity; return (sp.ao ? x > a : x >= a - 1e-9) && (sp.bo ? x < b : x <= b + 1e-9); };
  const naam = (sp, i) => sp.fs[i].n;
  const eenheid = (u) => u ? ' ' + u : '';
  const punt = (G, x, y, kleur = '#c0392b', r = 4.5) => `<circle cx="${G.X(x)}" cy="${G.Y(y)}" r="${r}" fill="${kleur}" stroke="#fff" stroke-width="1.5"/>`;
  const zichtbaar = (G, x, y) => x >= G.X0 && x <= G.X1 && y >= G.Y0 && y <= G.Y1;
  function laag(root, html) { const g = root.querySelector('.gv-laag'); if (g) g.innerHTML = html; }
  function res(root, html) { const r = root.querySelector('.gv-res'); if (r) r.innerHTML = html; }
  function volg(svg, e) {
    const root = svg.closest('.gvs'), sp = spec(root); if (!sp || !(sp.t || 'vfsm').includes('v')) return;
    const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, px = (e.clientX - r.left) * vb.width / r.width;
    const G = geom(sp); let x = G.x(px);
    const uit = root.querySelector('.gv-uit');
    if (x < G.X0 || x > G.X1) return;
    if (sp.losse) x = Math.round(x);
    if (!inDom(sp, x)) { laag(root, ''); if (uit) uit.innerHTML = '<span class="gv-let">Hier ben je buiten het praktisch domein.</span>'; return; }
    const i = keuze(root), f = gvFuncties(sp, root)[i], y = f(x);
    if (!isFinite(y)) { laag(root, ''); if (uit) uit.textContent = `Voor ${sp.xv} = ${gvGetal(x)} bestaat ${naam(sp, i)} niet.`; return; }
    const yy = Math.max(G.Y0, Math.min(G.Y1, y));
    laag(root, `<line x1="${G.X(x)}" y1="${G.Y(Math.max(G.Y0, Math.min(G.Y1, 0)))}" x2="${G.X(x)}" y2="${G.Y(yy)}" stroke="#c0392b" stroke-dasharray="3 3"/>` +
      `<line x1="${G.X(G.X0 > 0 ? G.X0 : Math.min(0, G.X1))}" y1="${G.Y(yy)}" x2="${G.X(x)}" y2="${G.Y(yy)}" stroke="#c0392b" stroke-dasharray="3 3"/>` + (zichtbaar(G, x, y) ? punt(G, x, y) : ''));
    const d = sp.losse ? 0 : 2;
    if (uit) uit.innerHTML = `<b>${sp.xv} = ${gvGetal(x, d)}</b>${eenheid(sp.xe)} &nbsp;→&nbsp; <b>${naam(sp, i)} ≈ ${gvGetal(y, 2)}</b>${eenheid(sp.ye)}`;
  }
  function wortels(f, c, a, b, ao, bo) {
    const N = 4000, uit = []; const lo0 = a + (ao ? (b - a) * 1e-6 : 0), hi0 = b - (bo ? (b - a) * 1e-6 : 0);
    let vx = lo0, vy = f(lo0) - c;
    for (let i = 1; i <= N; i++) {
      const x = lo0 + (hi0 - lo0) * i / N, y = f(x) - c;
      if (isFinite(vy) && Math.abs(vy) < 1e-12) { uit.push(vx); }
      else if (isFinite(vy) && isFinite(y) && vy * y < 0) {
        let lo = vx, hi = x;
        for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2, fm = f(m) - c; if ((f(lo) - c) * fm <= 0) hi = m; else lo = m; }
        const m = (lo + hi) / 2;
        if (Math.abs(f(m) - c) < 1e-6 * (1 + Math.abs(c))) uit.push(m); // geen sprong over een verticale asymptoot
      }
      vx = x; vy = y;
    }
    if (isFinite(vy) && Math.abs(vy) < 1e-12) uit.push(vx);
    return uit.filter((x, i, l) => i === 0 || Math.abs(x - l[i - 1]) > (hi0 - lo0) * 1e-6);
  }
  function uitersten(f, sp) {
    const a = sp.a ?? sp.X[0], b = sp.b ?? sp.X[1];
    let xs = [];
    if (sp.losse) { for (let x = Math.ceil(a - 1e-9); x <= b + 1e-9; x++) xs.push(x); }
    else { const N = 3000, lo = a + (sp.ao ? (b - a) * 1e-5 : 0), hi = b - (sp.bo ? (b - a) * 1e-5 : 0); for (let i = 0; i <= N; i++) xs.push(lo + (hi - lo) * i / N); }
    let iM = -1, im = -1;
    xs.forEach((x, i) => { const y = f(x); if (!isFinite(y)) return; if (iM < 0 || y > f(xs[iM])) iM = i; if (im < 0 || y < f(xs[im])) im = i; });
    const fijn = (i, max) => {
      if (sp.losse || i <= 0 || i >= xs.length - 1) return xs[i];
      let lo = xs[i - 1], hi = xs[i + 1];
      for (let k = 0; k < 100; k++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if ((f(m1) < f(m2)) === max) lo = m1; else hi = m2; }
      return (lo + hi) / 2;
    };
    const rand = (i) => i === 0 || i === xs.length - 1;
    const open = (i) => (i === 0 && sp.ao) || (i === xs.length - 1 && sp.bo);
    return { max: iM < 0 ? null : { x: fijn(iM, true), rand: rand(iM), open: open(iM) }, min: im < 0 ? null : { x: fijn(im, false), rand: rand(im), open: open(im) } };
  }
  function actie(root, wat) {
    const sp = spec(root); if (!sp) return;
    const G = geom(sp), i = keuze(root), fs = gvFuncties(sp, root), f = fs[i], n = naam(sp, i);
    if (wat === 't') { // parameters aangepast: opnieuw tekenen
      const nieuw = document.createElement('div'); nieuw.innerHTML = gvSvg(sp, fs);
      const oud = root.querySelector('svg'); if (oud) oud.replaceWith(nieuw.firstElementChild);
      const pars = (sp.par || []).map(p => `${p.n} = ${gvGetal(gvLees(root.querySelector(`.gv-par[data-n="${p.n}"]`).value), 4)}`).join(', ');
      res(root, `Getekend met ${pars}. Gaat de grafiek door de oranje punten?`);
      return;
    }
    if (wat === 'f') {
      const x = gvLees(root.querySelector('.gv-x').value);
      if (!isFinite(x)) return res(root, '<span class="gv-let">Typ eerst een getal bij ' + sp.xv + '.</span>');
      const y = f(x);
      if (!isFinite(y)) { laag(root, ''); return res(root, `Voor ${sp.xv} = ${gvGetal(x, 4)} bestaat ${n} niet.`); }
      laag(root, zichtbaar(G, x, y) ? `<line x1="${G.X(x)}" y1="${G.Y(Math.max(G.Y0, Math.min(G.Y1, 0)))}" x2="${G.X(x)}" y2="${G.Y(y)}" stroke="#c0392b" stroke-dasharray="3 3"/>` + punt(G, x, y) : '');
      const buiten = !inDom(sp, x) ? `<br><span class="gv-let">Let op: ${sp.xv} = ${gvGetal(x, 4)} ligt buiten het praktisch domein.</span>` : '';
      return res(root, `<b>${n}(${gvGetal(x, 4)}) = ${gvGetal(y, 4)}</b>${eenheid(sp.ye)}${buiten}`);
    }
    if (wat === 's') {
      const c = gvLees(root.querySelector('.gv-y').value);
      if (!isFinite(c)) return res(root, '<span class="gv-let">Typ eerst een getal bij y.</span>');
      const a = sp.a ?? G.X0, b = sp.b ?? G.X1, xs = wortels(f, c, a, b, sp.ao, sp.bo);
      let l = c >= G.Y0 && c <= G.Y1 ? `<line x1="${G.X(G.X0)}" y1="${G.Y(c)}" x2="${G.X(G.X1)}" y2="${G.Y(c)}" stroke="#2e7d4f" stroke-width="1.6" stroke-dasharray="7 4"/>` : '';
      xs.forEach(x => { if (zichtbaar(G, x, c)) l += punt(G, x, c, '#2e7d4f'); });
      laag(root, l);
      if (!xs.length) return res(root, `Geen snijpunt met y = ${gvGetal(c, 4)} op het praktisch domein.`);
      return res(root, xs.slice(0, 4).map(x => `<b>${n}(${sp.xv}) = ${gvGetal(c, 4)}</b> voor <b>${sp.xv} ≈ ${gvGetal(x, 3)}</b>${eenheid(sp.xe)}`).join('<br>') + (sp.losse ? '<br><span class="gv-let">Een aantal is een geheel getal: denk na of je naar boven of naar onder afrondt.</span>' : ''));
    }
    if (wat === 'm') {
      const u = uitersten(f, sp); let l = '', t = [];
      for (const [k, lab] of [['max', 'Hoogste punt'], ['min', 'Laagste punt']]) {
        const p = u[k]; if (!p) continue;
        if (p.open) { t.push(`${lab}: geen (de grafiek ${k === 'max' ? 'stijgt' : 'daalt'} onbeperkt tot aan de rand van het domein)`); continue; }
        const y = f(p.x); if (zichtbaar(G, p.x, y)) l += punt(G, p.x, y, k === 'max' ? '#c0392b' : '#8e44ad');
        t.push(`${lab}: <b>(${gvGetal(p.x, 2)} ; ${gvGetal(y, 2)})</b>${p.rand ? ' <span class="klein">(aan de rand van het domein)</span>' : ''}`);
      }
      laag(root, l); return res(root, t.join('<br>'));
    }
  }
  // ---------- in- en uitzoomen, verschuiven (grafiekvenster .gv en zoombare grafiek .rg)
  const rgSpec = (root) => { try { return JSON.parse(root.dataset.rg); } catch (e) { return null; } };
  function beeld(root) { // huidig beeld {x:[..], y:[..]} en het beginbeeld
    if (root.classList.contains('gvs')) { const sp = spec(root); if (!root.dataset.gv0) root.dataset.gv0 = JSON.stringify({ x: sp.X, y: sp.Y }); return { nu: { x: sp.X, y: sp.Y }, begin: JSON.parse(root.dataset.gv0) }; }
    const sp = rgSpec(root); const begin = { x: sp.x, y: sp.y };
    return { nu: root.dataset.beeld ? JSON.parse(root.dataset.beeld) : begin, begin };
  }
  function tekenBeeld(root, b) {
    if (root.classList.contains('gvs')) {
      const sp = spec(root); sp.X = b.x; sp.Y = b.y; delete sp.xs; delete sp.ys;
      root.dataset.gv = JSON.stringify(sp);
      const nieuw = document.createElement('div'); nieuw.innerHTML = gvSvg(sp, gvFuncties(sp, root));
      const oud = root.querySelector('svg'); if (oud) oud.replaceWith(nieuw.firstElementChild);
      return;
    }
    const sp = rgSpec(root), begin = sp.x[0] === b.x[0] && sp.x[1] === b.x[1] && sp.y[0] === b.y[0] && sp.y[1] === b.y[1];
    root.dataset.beeld = JSON.stringify(b);
    const opt = { ...sp, x: b.x, y: b.y, buiten: !begin, functies: sp.functies.map(fn => ({ ...fn, f: rgFormule(fn.e) })) };
    if (!begin) { delete opt.xs; delete opt.ys; }
    const nieuw = document.createElement('div'); nieuw.innerHTML = rgrafKern(opt);
    const oud = root.querySelector('svg'); if (oud) oud.replaceWith(nieuw.firstElementChild);
  }
  function zoom(root, wat) {
    const { nu, begin } = beeld(root);
    if (wat === 'terug') { tekenBeeld(root, begin); }
    else {
      const k = wat === 'in' ? 0.5 : 2, cx = (nu.x[0] + nu.x[1]) / 2, cy = (nu.y[0] + nu.y[1]) / 2, hx = (nu.x[1] - nu.x[0]) / 2 * k, hy = (nu.y[1] - nu.y[0]) / 2 * k;
      if (hx < 1e-6 || hx > 1e7) return;
      // uitzoomen vanuit een beeld dat op 0 begint: 0 blijft links/onderaan staan (zo zie je verder naar rechts en naar boven)
      const x0 = wat === 'uit' && Math.abs(nu.x[0]) < 1e-9 ? 0 : cx - hx, y0 = wat === 'uit' && Math.abs(nu.y[0]) < 1e-9 ? 0 : cy - hy;
      tekenBeeld(root, { x: [x0, x0 + 2 * hx], y: [y0, y0 + 2 * hy] });
    }
    if (root.classList.contains('gvs')) { laag(root, ''); res(root, ''); }
  }
  let sleep = null; // { root, x, y, beeld, bewogen }
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-zoom]'); if (!b) return; e.preventDefault(); e.stopPropagation(); const root = b.closest('.gvs'); if (root) zoom(root, b.dataset.zoom); }, true);
  document.addEventListener('pointerdown', (e) => {
    const s = e.target.closest && e.target.closest('.gvs svg'); if (!s) return;
    const root = s.closest('.gvs'), r = s.getBoundingClientRect(), vb = s.viewBox.baseVal;
    // schaal nu vastleggen: tijdens het slepen wordt de svg telkens vervangen
    sleep = { root, sx: vb.width / r.width, sy: vb.height / r.height, x: e.clientX, y: e.clientY, beeld: beeld(root).nu, bewogen: false };
  });
  document.addEventListener('pointermove', (e) => {
    if (!sleep || !(e.buttons & 1)) { sleep = sleep && (e.buttons & 1) ? sleep : null; return; }
    const dx = e.clientX - sleep.x, dy = e.clientY - sleep.y;
    if (!sleep.bewogen && Math.hypot(dx, dy) < 5) return;
    sleep.bewogen = true; e.preventDefault();
    const gv = sleep.root.classList.contains('gvs');
    const sp = gv ? null : rgSpec(sleep.root);
    const B = gv ? GV_M.B : (sp.breed || 360), H = gv ? GV_M.H : (sp.hoog || 230);
    const b = sleep.beeld, ex = dx * sleep.sx / B * (b.x[1] - b.x[0]), ey = dy * sleep.sy / H * (b.y[1] - b.y[0]);
    if (!isFinite(ex) || !isFinite(ey)) return;
    if (sleep.wacht) return; sleep.wacht = true;
    requestAnimationFrame(() => { if (!sleep) return; sleep.wacht = false; tekenBeeld(sleep.root, { x: [b.x[0] - ex, b.x[1] - ex], y: [b.y[0] + ey, b.y[1] + ey] }); if (gv) laag(sleep.root, ''); });
  }, { passive: false });
  document.addEventListener('pointerup', () => { sleep = null; });
  document.addEventListener('pointercancel', () => { sleep = null; });

  document.addEventListener('pointermove', (e) => { if (sleep && sleep.bewogen) return; const s = e.target.closest && e.target.closest('.gvs svg'); if (s) volg(s, e); });
  document.addEventListener('pointerdown', (e) => { const s = e.target.closest && e.target.closest('.gvs svg'); if (s) volg(s, e); });
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('.gvs [data-gv-actie]'); if (!b) return; e.preventDefault(); actie(b.closest('.gvs'), b.dataset.gvActie); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return; const i = e.target.closest && e.target.closest('.gvs input'); if (!i) return;
    e.preventDefault(); e.stopPropagation(); if (i.dataset.gvEnter) actie(i.closest('.gvs'), i.dataset.gvEnter);
  }, true);
  document.addEventListener('input', (e) => { const i = e.target.closest && e.target.closest('.gvs .gv-par'); if (i && isFinite(gvLees(i.value))) actie(i.closest('.gvs'), 't'); });
  document.addEventListener('change', (e) => { const s = e.target.closest && e.target.closest('.gvs .gv-kies'); if (s) { const root = s.closest('.gvs'); laag(root, ''); res(root, ''); } });
})();

const WOORDEN = [
  ['radiaal', 'Een eenheid voor hoeken: de hoek waarbij de booglengte op de eenheidscirkel gelijk is aan de straal.'],
  ['radialen', 'Een eenheid voor hoeken. 180° = π radialen.'],
  ['goniometrische cirkel', 'De eenheidscirkel (straal 1), gebruikt om hoeken en hun sinus voor te stellen.'],
  ['eenheidscirkel', 'Een cirkel met straal 1 en middelpunt in de oorsprong.'],
  ['omwenteling', 'Eén keer helemaal rond draaien (360°).'],
  ['periodiek', 'Wat zich telkens op dezelfde manier herhaalt.'],
  ['periode', 'De lengte van het interval waarna een periodieke functie zich exact herhaalt.'],
  ['amplitude', 'De maximale uitwijking t.o.v. de evenwichtslijn.'],
  ['evenwichtslijn', 'De horizontale rechte waarrond een sinusfunctie schommelt.'],
  ['faseverschuiving', 'De horizontale verschuiving van een sinusfunctie t.o.v. sin x.'],
  ['circadiaans ritme', 'Het dagritme van het lichaam (ongeveer 24 uur).'],
  ['bioritme', 'Een ritme in het lichaam dat zich steeds herhaalt.'],
  ['bloeddruk', 'De druk van het bloed in de bloedvaten (in mmHg).'],
  ['pasgeborene', 'Een baby die net geboren is.'],
  ['slaapcoach', 'Iemand die mensen helpt om beter te slapen.'],
  ['cliënt', 'Iemand die hulp krijgt van een zorgverlener.'],
  ['verpleegkundige', 'Iemand die zieke mensen verzorgt.'],
  ['jeugdhuis', 'Een plaats waar jongeren elkaar ontmoeten.'],
  ['schommelt', 'Gaat op en neer.'],
].sort((p, q) => q[0].length - p[0].length);
function woorden(html) {
  if (!html || typeof html !== 'string' || html.includes('class="woord"')) return html;
  const gebruikt = new Set(), tokens = [];
  const stukken = html.split(/(<!--gv-->[\s\S]*?<!--\/gv-->|<svg[\s\S]*?<\/svg>|<code>[\s\S]*?<\/code>|<(?:table class="tabel tekenschema")[\s\S]*?<\/table>|<span class="woord"[\s\S]*?<\/span><\/span>|<[^>]+>|\$\$[\s\S]*?\$\$|\$[^$]*\$)/);
  const vervang = (tekst) => {
    for (const [w, uitleg] of WOORDEN) {
      if (gebruikt.has(uitleg)) continue;
      const re = new RegExp(`(^|[^\\p{L}])(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![\\p{L}])`, 'iu');
      const m = tekst.match(re); if (!m) continue;
      gebruikt.add(uitleg);
      tokens.push(`<span class="woord" tabindex="0">${m[2]}<span class="woord-uitleg">${uitleg}</span></span>`);
      tekst = tekst.slice(0, m.index) + m[1] + `\u0001${tokens.length - 1}\u0002` + tekst.slice(m.index + m[0].length);
    }
    return tekst;
  };
  return stukken.map((s, i) => (i % 2 ? s : vervang(s))).join('').replace(/\u0001(\d+)\u0002/g, (m, k) => tokens[+k]);
}


// =====================================================================
//  SINUS — hulpmiddelen
// =====================================================================
const PI = Math.PI;
const piTex = (t, n = 1) => { const g = W.ggd(t, n) || 1; t /= g; n /= g; if (t === 0) return '0'; const s = t < 0 ? '-' : '', a = Math.abs(t); return n === 1 ? `${s}${a === 1 ? '' : a}\\pi` : `${s}\\frac{${a === 1 ? '' : a}\\pi}{${n}}`; };
const piAntw = (t, n, voor) => { const g = W.ggd(t, n) || 1; return { soort: 'breuk', t: t / g, n: n / g, voor, na: '\\cdot \\pi', editor: true, placeholder: '' }; };
// voorschrift a·sin(b(x − p)) + k als TeX (p = pt/pn · π)
function sinTex(naam, a, b, pt, pn, k) {
  const A = a === 1 ? '' : a === -1 ? '-' : `${tg(a)} \\cdot `;
  const B = b === 1 ? '' : Number.isInteger(b) ? `${b}` : `\\frac{1}{${Math.round(1 / b)}}`;
  let arg = 'x';
  if (pt) { const pp = piTex(Math.abs(pt), pn); arg = B ? `${B}\\left(x ${pt > 0 ? '-' : '+'} ${pp}\\right)` : `x ${pt > 0 ? '-' : '+'} ${pp}`; }
  else if (B) arg = `${B}x`;
  return `${naam}(x) = ${A}\\sin(${arg})${k ? ` ${k < 0 ? '-' : '+'} ${tg(Math.abs(k))}` : ''}`;
}
const sinE = (a, b, p, k) => `${a}*Math.sin(${b}*(x-(${p})))+(${k})`;
const sinF = (a, b, p, k) => (x) => a * Math.sin(b * (x - p)) + k;
const NAMEN = ['f', 'g', 'h', 'k'];
const opgave2 = (t) => `<p class="opgave-tekst">${t}</p>`;
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const tx = (s) => '@@' + s;
// grafiek met π op de x-as
const sgraf = (functies, opt = {}) => figuur(rgraf({ pi: true, x: opt.x || [0, 2 * PI], y: opt.y || [-1.5, 1.5], ys: opt.ys || 0.5, functies, punten: opt.punten, ha: opt.ha, klein: opt.klein, breed: opt.breed || (opt.klein ? 250 : 380), hoog: opt.hoog || (opt.klein ? 150 : 220), xn: opt.xn, yn: opt.yn, buiten: opt.buiten }));
const kaalS = (f, opt = {}) => rgraf({ pi: true, x: opt.x || [0, 2 * PI], y: opt.y, ys: opt.ys || 1, functies: [{ f }], klein: true, breed: 250, hoog: 150 });

// ---------- vaste theorieblokken
const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraken in dit leerpad</div>
  <ul><li><b>Een hoek in radialen</b> typ je als het getal vóór π. Voor $\\frac{3\\pi}{4}$ typ je de breuk <code>3/4</code> (met de breukknop), voor $2\\pi$ typ je <code>2</code>, voor $\\pi$ typ je <code>1</code>. Vereenvoudig de breuk.</li>
  <li>Kommagetallen typ je met een komma: <code>0,5</code>. Een interval met de knoppen: <code>[-1, 3]</code>.</li>
  <li>Je hebt <b>geen GeoGebra</b> nodig: bij de vergelijkingen staat een grafiekvenster klaar. In het grafiekvenster mag je ook <code>π</code> of <code>pi</code> typen (bv. <code>3π/2</code>).</li>
  <li>Een woord met een <span style="border-bottom:2px dotted #e8772e">oranje stippellijn</span> eronder is een moeilijk woord: raak het aan voor de uitleg.</li></ul></div>`;
const OMZET = `<div class="kader eig"><div class="kader-titel">Graden en radialen</div>
  <p class="midden">$360° = 2\\pi$ radialen $\\Leftrightarrow 180° = \\pi$ radialen</p>
  <ul><li>van graden naar radialen: <b>radialen = graden × π : 180</b></li><li>van radialen naar graden: <b>graden = radialen × 180 : π</b> (vervang π door 180°)</li></ul>
  <table class="tabel"><tr><th>graden</th><td>0°</td><td>30°</td><td>45°</td><td>60°</td><td>90°</td><td>180°</td><td>270°</td><td>360°</td></tr>
  <tr><th>radialen</th><td>$0$</td><td>$\\frac{\\pi}{6}$</td><td>$\\frac{\\pi}{4}$</td><td>$\\frac{\\pi}{3}$</td><td>$\\frac{\\pi}{2}$</td><td>$\\pi$</td><td>$\\frac{3\\pi}{2}$</td><td>$2\\pi$</td></tr></table></div>`;
const KENMERKEN = `<div class="kader eig"><div class="kader-titel">Kenmerken van $f(x) = a \\cdot \\sin(b(x - p)) + k$</div>
  <ul><li><b>Domein:</b> $\\mathbb{R}$ &nbsp;·&nbsp; <b>Amplitude:</b> $|a|$ &nbsp;·&nbsp; <b>Evenwichtslijn:</b> $y = k$</li>
  <li><b>Bereik:</b> $[k - |a|, k + |a|]$ &nbsp;·&nbsp; <b>Periode:</b> $2\\pi : |b|$</li>
  <li><b>Faseverschuiving:</b> $p$ (naar rechts als $p > 0$, naar links als $p < 0$). Let op: $x + \\frac{\\pi}{3} = x - \\left(-\\frac{\\pi}{3}\\right)$, dus $p = -\\frac{\\pi}{3}$: naar links.</li></ul>
  <p><b>Uit een grafiek:</b> de evenwichtslijn ligt halverwege tussen het hoogste en het laagste punt; de amplitude is de afstand van de evenwichtslijn tot een top; de periode is de afstand tussen twee opeenvolgende toppen.</p></div>`;

// ===================================================================
//  DEEL 1 · GRADEN EN RADIALEN
// ===================================================================
const GR = [15, 20, 30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360, 450, 540, 720];
const D1 = {
  nr: 1, titel: 'Graden en radialen', kort: 'Hoeken omzetten van graden naar radialen en omgekeerd.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De radiaal</div>
      <p>Een <b>radiaal</b> is de hoek waarbij de booglengte op de eenheidscirkel (straal 1) gelijk is aan de straal. Een volledige omwenteling (360°) komt overeen met de volledige omtrek van de eenheidscirkel: $2\\pi$.</p></div>
    ${OMZET}
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p>$135° = 135 \\cdot \\pi : 180 = \\frac{135\\pi}{180} = \\frac{3\\pi}{4}$ &nbsp;·&nbsp; $240° = \\frac{4\\pi}{3}$ &nbsp;·&nbsp; $20° = \\frac{\\pi}{9}$</p>
      <p>$\\frac{5\\pi}{4} = 5 \\cdot 180° : 4 = 225°$ &nbsp;·&nbsp; $\\frac{7\\pi}{6} = 210°$ &nbsp;·&nbsp; $\\frac{\\pi}{10} = 18°$</p>
      <p>Een rad draait twee en een kwart omwenteling: $2 \\cdot 360° + 90° = 810°$ $= 4\\pi + \\frac{\\pi}{2} = \\frac{9\\pi}{2}$.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: '330° = \\; ? \\text{ rad}', stappen: ['330 \\cdot \\pi : 180 = \\dfrac{330\\pi}{180}', '= \\dfrac{11\\pi}{6} \\quad (\\text{deel teller en noemer door 30})'] },
    { tex: '\\dfrac{3\\pi}{2} = \\; ? \\; °', stappen: ['\\text{vervang } \\pi \\text{ door } 180°: \\; 3 \\cdot 180° : 2', '= 270°'] },
  ],
  soorten: {
    gr2rad: { naam: 'Graden → radialen', gen() {
      const g = kies(GR);
      return { soort: 'gr2rad', opdracht: 'Zet om naar radialen. Typ het getal vóór π (een vereenvoudigde breuk).', tex: `${g}° = \\; ?`, sleutel: 'gr' + g,
        antw: piAntw(g, 180, `${g}° =`), uitleg: [`${g} \\cdot \\pi : 180 = \\dfrac{${g}\\pi}{180} = ${piTex(g, 180)}`] };
    } },
    rad2gr: { naam: 'Radialen → graden', gen() {
      const g = kies(GR), gg = W.ggd(g, 180), t = g / gg, n = 180 / gg;
      return { soort: 'rad2gr', opdracht: 'Zet om naar graden.', tex: `${piTex(t, n)} = \\; ? \\; °`, sleutel: 'rg' + g,
        antw: getal(g, { voor: `${piTex(t, n)} =`, na: '°' }), uitleg: [`\\text{vervang } \\pi \\text{ door } 180°: \\; ${t === 1 ? '' : t + ' \\cdot '}180° ${n > 1 ? ': ' + n : ''} = ${g}°`] };
    } },
    std: { naam: 'Veelgebruikte hoeken', gen() {
      const L = [[30, 1, 6], [45, 1, 4], [60, 1, 3], [90, 1, 2], [180, 1, 1], [270, 3, 2], [360, 2, 1]];
      const [g, t, n] = kies(L), naarRad = kies([true, false]);
      const andere = schud(L.filter(x => x[0] !== g)).slice(0, 3);
      const opties = naarRad ? schud([[t, n], ...andere.map(x => [x[1], x[2]])]).map(([a, b]) => piTex(a, b)) : schud([g, ...andere.map(x => x[0])]).map(v => `${v}°`);
      const juist = naarRad ? piTex(t, n) : `${g}°`;
      return { soort: 'std', opdracht: 'Kies het juiste antwoord.', tex: naarRad ? `${g}° = \\; ?` : `${piTex(t, n)} = \\; ?`, sleutel: 'std' + g + naarRad,
        antw: { soort: 'keuze', opties: opties.map((l, i) => ({ k: String(i), l })), juist: String(opties.indexOf(juist)) }, uitleg: [`${g}° = ${piTex(t, n)} \\quad (180° = \\pi)`] };
    } },
    omw: { naam: 'Omwentelingen', gen() {
      const [q, tekst] = kies([[0.25, 'een kwart'], [0.5, 'een halve'], [0.75, 'driekwart'], [1.5, 'anderhalve'], [2, 'twee'], [2.25, 'twee en een kwart'], [2.5, 'twee en een halve'], [3, 'drie']]);
      const g = q * 360;
      return { soort: 'omw', opdracht: 'Druk de hoek uit in radialen. Typ het getal vóór π.', html: opgave2(`Tijdens een groepsactiviteit in een jeugdhuis draait iemand aan een rad van fortuin. Het rad maakt <b>${tekst}</b> omwenteling.`), sleutel: 'omw' + q,
        antw: piAntw(g, 180, '\\text{hoek} ='), uitleg: [`${kg(q)} \\cdot 360° = ${g}°`, `${g}° = ${piTex(g, 180)} \\quad (\\text{of: } ${kg(q)} \\cdot 2\\pi)`] };
    } },
  },
  oefenMix: [['gr2rad', 2], ['rad2gr', 2], ['std', 1], ['omw', 1]],
  test: [['gr2rad', 3], ['rad2gr', 3], ['std', 2], ['omw', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 2 · DE GRAFIEK VAN sin x
// ===================================================================
const SINW = [[0, 1, 0], [1, 6, 0.5], [1, 2, 1], [5, 6, 0.5], [1, 1, 0], [3, 2, -1], [2, 1, 0], [5, 2, 1], [13, 6, 0.5], [3, 1, 0], [-1, 2, -1], [-1, 1, 0]];
const D2 = {
  nr: 2, titel: 'De grafiek van sin x', kort: 'Goniometrische cirkel, sinuswaarden, basiskenmerken en aflezen op de grafiek.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De goniometrische cirkel</div>
      <p>Op de goniometrische cirkel (de eenheidscirkel) hoort bij elke hoek $x$ een punt. De <b>sinus</b> van $x$ is de <b>y-coördinaat</b> van dat punt.</p>
      <table class="tabel"><tr><th>$x$</th><td>$0$</td><td>$\\frac{\\pi}{6}$</td><td>$\\frac{\\pi}{2}$</td><td>$\\frac{5\\pi}{6}$</td><td>$\\pi$</td><td>$\\frac{3\\pi}{2}$</td><td>$2\\pi$</td></tr>
      <tr><th>$\\sin x$</th><td>0</td><td>0,5</td><td>1</td><td>0,5</td><td>0</td><td>−1</td><td>0</td></tr></table></div>
    <div class="kader eig"><div class="kader-titel">De grafiek van $f(x) = \\sin x$</div>
      ${sgraf([{ f: Math.sin }], { x: [-2 * PI, 2 * PI], breed: 460, punten: [{ x: PI / 2, y: 1 }, { x: 3 * PI / 2, y: -1 }] })}
      <ul><li><b>Domein:</b> $\\mathbb{R}$ &nbsp;·&nbsp; <b>Bereik:</b> $[-1, 1]$</li><li><b>Periode:</b> $2\\pi$ (na elke $2\\pi$ herhaalt de grafiek zich exact)</li><li><b>Evenwichtslijn:</b> $y = 0$</li>
      <li>Nulwaarden in $[0, 2\\pi]$: $0$, $\\pi$ en $2\\pi$. Top: $\\sin\\frac{\\pi}{2} = 1$. Dal: $\\sin\\frac{3\\pi}{2} = -1$.</li></ul></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: '\\sin\\left(\\frac{5\\pi}{2}\\right)', stappen: ['\\frac{5\\pi}{2} = \\frac{\\pi}{2} + 2\\pi: \\text{ één periode verder}', '\\sin\\left(\\frac{5\\pi}{2}\\right) = \\sin\\left(\\frac{\\pi}{2}\\right) = 1'] },
    { tex: '\\sin x = 1{,}5', stappen: ['\\text{Het bereik van } \\sin x \\text{ is } [-1, 1]', '\\text{Dat kan dus niet.}'] },
  ],
  soorten: {
    waarde: { naam: 'Sinuswaarde', gen() {
      const [t, n, v] = kies(SINW);
      return { soort: 'waarde', opdracht: 'Gebruik de goniometrische cirkel of de grafiek.', html: sgraf([{ f: Math.sin }], { x: [-PI, 3 * PI], breed: 420 }), tex: `\\sin\\left(${piTex(t, n)}\\right) = \\; ?`, sleutel: 'w' + t + n,
        antw: getal(v, { voor: `\\sin\\left(${piTex(t, n)}\\right) =` }), uitleg: [`\\sin\\left(${piTex(t, n)}\\right) = ${tg(v)}`, tx('De sinus is de y-coördinaat op de goniometrische cirkel; na elke 2π herhaalt alles zich.')] };
    } },
    kenmerk: { naam: 'Basiskenmerken', gen() {
      const s = kies(['bereik', 'periode', 'ev', 'domein']);
      if (s === 'bereik') return { soort: 'kenmerk', opdracht: 'Geef het bereik.', tex: 'f(x) = \\sin x', html: sgraf([{ f: Math.sin }], { x: [-2 * PI, 2 * PI], breed: 420 }), sleutel: 'k' + s, antw: vz([{ a: -1, ai: true, b: 1, bi: true }], '\\text{ber } f ='), uitleg: ['\\text{ber } f = [-1, 1]'] };
      if (s === 'periode') return { soort: 'kenmerk', opdracht: 'Geef de periode. Typ het getal vóór π.', tex: 'f(x) = \\sin x', html: sgraf([{ f: Math.sin }], { x: [-2 * PI, 2 * PI], breed: 420 }), sleutel: 'k' + s, antw: piAntw(2, 1, '\\text{periode} ='), uitleg: ['\\text{De grafiek herhaalt zich na } 2\\pi'] };
      if (s === 'ev') return { soort: 'kenmerk', opdracht: 'Geef de evenwichtslijn.', tex: 'f(x) = \\sin x', html: sgraf([{ f: Math.sin }], { x: [-2 * PI, 2 * PI], breed: 420 }), sleutel: 'k' + s, antw: getal(0, { voor: 'y =' }), uitleg: ['\\text{evenwichtslijn } y = 0'] };
      return { soort: 'kenmerk', opdracht: 'Kies het domein.', tex: 'f(x) = \\sin x', sleutel: 'k' + s, antw: { soort: 'keuze', opties: [{ k: '0', l: '\\mathbb{R}' }, { k: '1', l: '[-1, 1]' }, { k: '2', l: '[0, 2\\pi]' }, { k: '3', l: '\\mathbb{R}^+' }], juist: '0' }, uitleg: ['\\text{Je kan elke hoek invullen: dom } f = \\mathbb{R}'] };
    } },
    nul: { naam: 'Nulwaarden, toppen en dalen', gen() {
      const s = kies(['nul', 'top', 'dal']);
      const opties = { nul: ['0, \\; \\pi \\text{ en } 2\\pi', '\\frac{\\pi}{2} \\text{ en } \\frac{3\\pi}{2}', '0 \\text{ en } 2\\pi', '\\pi'], top: ['\\frac{\\pi}{2}', '\\pi', '\\frac{3\\pi}{2}', '0'], dal: ['\\frac{3\\pi}{2}', '\\pi', '\\frac{\\pi}{2}', '2\\pi'] }[s];
      const vr = { nul: 'Wat zijn de nulwaarden van sin x in [0, 2π]?', top: 'Voor welke x in [0, 2π] heeft sin x een top (waarde 1)?', dal: 'Voor welke x in [0, 2π] heeft sin x een dal (waarde −1)?' }[s];
      const sch = schud(opties.map((l, i) => ({ l, i })));
      return { soort: 'nul', opdracht: 'Lees af op de grafiek.', html: sgraf([{ f: Math.sin }], { x: [0, 2 * PI], breed: 420 }) + vraag(vr), sleutel: 'n' + s,
        antw: { soort: 'keuze', opties: sch.map((o, k) => ({ k: String(k), l: o.l })), juist: String(sch.findIndex(o => o.i === 0)) }, uitleg: [opties[0]] };
    } },
    kan: { naam: 'Kan dit?', gen() {
      const c = kies([1.5, -2, 0.7, -1, 1.2, 0.3, -0.9, 2, 1]);
      const kan = Math.abs(c) <= 1;
      return { soort: 'kan', opdracht: 'Denk aan het bereik.', tex: `\\sin x = ${tg(c)}`, html: vraag('Bestaat er een x waarvoor dit klopt?'), sleutel: 'kan' + c,
        antw: { soort: 'keuze', opties: [{ k: 'j', l: '\\text{ja}' }, { k: 'n', l: '\\text{nee}' }], juist: kan ? 'j' : 'n' }, uitleg: [`\\text{Het bereik van } \\sin x \\text{ is } [-1, 1]: \\; ${tg(c)} ${kan ? '\\in' : '\\notin'} [-1, 1]`] };
    } },
  },
  oefenMix: [['waarde', 2], ['kenmerk', 2], ['nul', 1], ['kan', 1]],
  test: [['waarde', 4], ['kenmerk', 2], ['nul', 2], ['kan', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 3 · TRANSFORMATIES
// ===================================================================
const PS = [[0, 1], [1, 2], [-1, 2], [1, 3], [-1, 3], [1, 4], [-1, 4], [1, 6], [-1, 6]];
function randSin(opt = {}) {
  const a = kies(opt.a || [1, 2, 3, 0.5, -2, 4]), b = kies(opt.b || [1, 2, 3, 0.5]), [pt, pn] = opt.p === false ? [0, 1] : kies(PS), k = kies(opt.k || [0, 1, -1, 2, -2, 0.5]);
  return { a, b, pt, pn, p: pt * PI / pn, k };
}
const D3 = {
  nr: 3, titel: 'Transformaties', kort: 'Wat doen a, b, k en p met de grafiek van sin x?', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De algemene sinusfunctie</div>
      <p class="midden">$f(x) = a \\cdot \\sin(b(x - p)) + k$</p>
      <table class="tabel"><tr><th>parameter</th><th>effect</th></tr>
      <tr><td>$a$</td><td><b>amplitude:</b> $|a|$ is de maximale uitwijking t.o.v. de evenwichtslijn</td></tr>
      <tr><td>$k$</td><td><b>verticale verschuiving:</b> de evenwichtslijn ligt op $y = k$</td></tr>
      <tr><td>$b$</td><td><b>periode:</b> de nieuwe periode is $2\\pi : |b|$</td></tr>
      <tr><td>$p$</td><td><b>faseverschuiving:</b> de grafiek schuift $p$ eenheden naar rechts (naar links als $p < 0$)</td></tr></table></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <table class="tabel"><tr><td>${kaalS((x) => 2 * Math.sin(x), { y: [-2.5, 2.5] })}<br>$2 \\cdot \\sin x$: amplitude 2</td><td>${kaalS((x) => Math.sin(x) + 1.5, { y: [-1.5, 3] })}<br>$\\sin x + 1{,}5$: evenwichtslijn $y = 1{,}5$</td></tr>
      <tr><td>${kaalS((x) => Math.sin(2 * x), { y: [-1.5, 1.5] })}<br>$\\sin(2x)$: periode $\\pi$</td><td>${kaalS((x) => Math.sin(x - PI / 2), { y: [-1.5, 1.5] })}<br>$\\sin\\left(x - \\frac{\\pi}{2}\\right)$: $\\frac{\\pi}{2}$ naar rechts</td></tr></table>
      <p>$\\sin\\left(x + \\frac{\\pi}{3}\\right)$: $\\frac{\\pi}{3}$ naar <b>links</b> ($p = -\\frac{\\pi}{3}$). &nbsp; $\\sin\\left(\\frac{x}{2}\\right)$: periode $2\\pi : \\frac{1}{2} = 4\\pi$ (uitgerekt).</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'h(x) = \\sin(3x)', stappen: ['b = 3', '\\text{periode } 2\\pi : 3 = \\frac{2\\pi}{3}: \\text{ de grafiek wordt samengedrukt}'] },
    { tex: 'g(x) = \\sin x - 3', stappen: ['k = -3', '\\text{de grafiek schuift 3 omlaag: evenwichtslijn } y = -3'] },
  ],
  soorten: {
    param: { naam: 'Welke parameter?', gen() {
      const T = kies([['De grafiek schuift omhoog of omlaag.', 'k'], ['De evenwichtslijn verandert.', 'k'], ['De grafiek wijkt verder uit boven en onder de evenwichtslijn.', 'a'], ['De amplitude verandert.', 'a'],
        ['De grafiek wordt horizontaal samengedrukt of uitgerekt.', 'b'], ['De periode verandert.', 'b'], ['De grafiek schuift naar links of naar rechts.', 'p'], ['Er is een faseverschuiving.', 'p']]);
      return { soort: 'param', opdracht: 'Kies de parameter.', tex: 'f(x) = a \\cdot \\sin(b(x - p)) + k', html: opgave2(T[0]) + vraag('Welke parameter zorgt daarvoor?'), sleutel: T[0],
        antw: { soort: 'keuze', opties: ['a', 'b', 'k', 'p'].map(l => ({ k: l, l })), juist: T[1] }, uitleg: [tx({ a: 'a bepaalt de amplitude |a|.', b: 'b bepaalt de periode 2π : |b|.', k: 'k bepaalt de evenwichtslijn y = k.', p: 'p bepaalt de faseverschuiving.' }[T[1]])] };
    } },
    effect: { naam: 'Wat verandert er?', gen() {
      const naam = kies(NAMEN), T = kies([
        () => { const a = kies([2, 3, 4, 0.5]); return [sinTex(naam, a, 1, 0, 1, 0), `De amplitude wordt ${kg(a)}: bereik [−${kg(a)}, ${kg(a)}].`]; },
        () => { const k = kies([1, 2, 3, -1, -2, -3]); return [sinTex(naam, 1, 1, 0, 1, k), `De grafiek schuift ${Math.abs(k)} ${k > 0 ? 'omhoog' : 'omlaag'}: evenwichtslijn y = ${k}.`]; },
        () => { const b = kies([2, 3, 4]); return [sinTex(naam, 1, b, 0, 1, 0), `De periode wordt 2π : ${b}${b === 2 ? ' = π' : ` = 2π/${b}`}: de grafiek wordt samengedrukt.`]; },
        () => { const [pt, pn] = kies(PS.slice(1)); return [sinTex(naam, 1, 1, pt, pn, 0), `De grafiek schuift ${pn === 1 ? '' : 'π/' + pn}${pn === 1 ? 'π' : ''} naar ${pt > 0 ? 'rechts' : 'links'}.`]; },
      ])();
      const fout = ['De amplitude wordt 2: bereik [−2, 2].', 'De grafiek schuift 2 omhoog: evenwichtslijn y = 2.', 'De periode wordt 2π : 2 = π: de grafiek wordt samengedrukt.', 'De grafiek schuift π/3 naar rechts.', 'De grafiek schuift π/4 naar links.', 'De grafiek schuift 3 omlaag: evenwichtslijn y = −3.', 'De amplitude wordt 3: bereik [−3, 3].'];
      return { soort: 'effect', opdracht: 'Vergelijk met sin x.', tex: T[0], html: vraag('Wat verandert er ten opzichte van de grafiek van sin x?'), sleutel: T[0], antw: zinnen(T[1], schud(fout)), uitleg: [tx(T[1])] };
    } },
    welkeGraf: { naam: 'Welke grafiek hoort bij het voorschrift?', gen() {
      const S = randSin({ a: [1, 2, 3], b: [1, 2], k: [0, 1, -1, 2] }), naam = kies(NAMEN), f = sinF(S.a, S.b, S.p, S.k);
      const ymax = Math.max(3, Math.abs(S.k) + Math.abs(S.a) + 1), Y = [-ymax, ymax];
      const fouten = [sinF(S.a, S.b, S.p, -S.k || 1.5), sinF(S.a === 1 ? 2 : 1, S.b, S.p, S.k), sinF(S.a, S.b === 1 ? 2 : 1, S.p, S.k), sinF(S.a, S.b, S.p + PI / 2, S.k)];
      const drie = schud(fouten).slice(0, 3);
      return { soort: 'welkeGraf', opdracht: 'Controleer de evenwichtslijn, de amplitude, de periode en de verschuiving.', tex: sinTex(naam, S.a, S.b, S.pt, S.pn, S.k), html: vraag('Welke grafiek hoort bij dit voorschrift?'), sleutel: `${S.a}${S.b}${S.pt}${S.pn}${S.k}`,
        antw: figuren(kaalS(f, { y: Y, x: [-PI, 2 * PI] }), drie.map(g => kaalS(g, { y: Y, x: [-PI, 2 * PI] }))), uitleg: [`\\text{amplitude } ${tg(Math.abs(S.a))}, \\; \\text{evenwichtslijn } y = ${tg(S.k)}, \\; \\text{periode } ${piTex(2, 1)} : ${S.b}`] };
    } },
  },
  oefenMix: [['param', 1], ['effect', 2], ['welkeGraf', 2]],
  test: [['param', 3], ['effect', 4], ['welkeGraf', 3]], testSchudden: true,
};

// ===================================================================
//  DEEL 4 · KENMERKEN ANALYSEREN
// ===================================================================
function periodeAntw(b) { // 2π : b als breuk vóór π
  if (Number.isInteger(b)) return [2, b]; const n = Math.round(1 / b); return [2 * n, 1];
}
const D4 = {
  nr: 4, titel: 'Kenmerken analyseren', kort: 'Amplitude, evenwichtslijn, bereik, periode en faseverschuiving uit voorschrift en grafiek.', rekenmachine: false,
  theorie: `${KENMERKEN}
    <div class="kader werk"><div class="kader-titel">Voorbeeld: $f(x) = 4 \\cdot \\sin\\left(2\\left(x - \\frac{\\pi}{6}\\right)\\right) - 1$</div>
      <p>$a = 4$, $b = 2$, $p = \\frac{\\pi}{6}$, $k = -1$. Amplitude 4, evenwichtslijn $y = -1$, bereik $[-5, 3]$, periode $2\\pi : 2 = \\pi$, faseverschuiving $\\frac{\\pi}{6}$ naar rechts.</p>
      <p>$g(x) = -2 \\cdot \\sin\\left(\\frac{x}{2}\\right) + 3$: amplitude $|-2| = 2$ (nooit negatief), bereik $[1, 5]$, periode $2\\pi : \\frac{1}{2} = 4\\pi$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: uit de grafiek</div>
      ${sgraf([{ f: (x) => 1.5 * Math.sin(2 * x) + 2 }], { y: [-0.5, 4], ha: [2], punten: [{ x: PI / 4, y: 3.5 }, { x: 5 * PI / 4, y: 3.5 }, { x: 3 * PI / 4, y: 0.5 }] })}
      <p>Hoogste punt 3,5, laagste punt 0,5: evenwichtslijn $y = 2$, amplitude 1,5, bereik $[0{,}5 \\,;\\, 3{,}5]$. Toppen bij $\\frac{\\pi}{4}$ en $\\frac{5\\pi}{4}$: periode $\\pi$.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'f(x) = 3 \\cdot \\sin\\left(x + \\frac{\\pi}{4}\\right) - 2', stappen: ['\\text{amplitude } 3, \\; \\text{evenwichtslijn } y = -2', '\\text{bereik } [-2 - 3, -2 + 3] = [-5, 1]', 'x + \\frac{\\pi}{4} = x - \\left(-\\frac{\\pi}{4}\\right): \\; \\frac{\\pi}{4} \\text{ naar links}'] },
  ],
  soorten: {
    ampEv: { naam: 'Amplitude en evenwichtslijn', gen() {
      const S = randSin(), naam = kies(NAMEN);
      return { soort: 'ampEv', opdracht: 'Lees af uit het voorschrift.', tex: sinTex(naam, S.a, S.b, S.pt, S.pn, S.k), sleutel: `ae${S.a}${S.b}${S.pt}${S.pn}${S.k}`,
        antw: delen(['\\text{amplitude} =', getal(Math.abs(S.a))], ['\\text{evenwichtslijn: } y =', getal(S.k)]), uitleg: [`a = ${tg(S.a)} \\Rightarrow \\text{amplitude } |${tg(S.a)}| = ${tg(Math.abs(S.a))}`, `k = ${tg(S.k)} \\Rightarrow y = ${tg(S.k)}`] };
    } },
    bereik: { naam: 'Bereik', gen() {
      const S = randSin(), naam = kies(NAMEN), A = Math.abs(S.a);
      return { soort: 'bereik', opdracht: 'Bepaal het bereik.', tex: sinTex(naam, S.a, S.b, S.pt, S.pn, S.k), sleutel: `b${S.a}${S.b}${S.pt}${S.pn}${S.k}`,
        antw: vz([{ a: S.k - A, ai: true, b: S.k + A, bi: true }], `\\text{ber } ${naam} =`), uitleg: [`[k - |a|, k + |a|] = [${tg(S.k)} - ${tg(A)}, ${tg(S.k)} + ${tg(A)}] = [${tg(S.k - A)}, ${tg(S.k + A)}]`] };
    } },
    periode: { naam: 'Periode', gen() {
      const S = randSin({ b: [2, 3, 4, 0.5, 6] }), naam = kies(NAMEN), [t, n] = periodeAntw(S.b);
      return { soort: 'periode', opdracht: 'Bepaal de periode. Typ het getal vóór π.', tex: sinTex(naam, S.a, S.b, S.pt, S.pn, S.k), sleutel: `p${S.a}${S.b}${S.pt}${S.pn}${S.k}`,
        antw: piAntw(t, n, '\\text{periode} ='), uitleg: [`b = ${Number.isInteger(S.b) ? S.b : '\\frac{1}{' + Math.round(1 / S.b) + '}'} \\Rightarrow 2\\pi : ${Number.isInteger(S.b) ? S.b : '\\frac{1}{' + Math.round(1 / S.b) + '}'} = ${piTex(t, n)}`] };
    } },
    fase: { naam: 'Faseverschuiving', gen() {
      const S = randSin({ b: [1], p: true }); if (!S.pt) { S.pt = 1; S.pn = kies([3, 4, 6]); S.p = PI / S.pn; }
      const naam = kies(NAMEN), q = piTex(1, S.pn), juist = `${q} \\text{ naar ${S.pt > 0 ? 'rechts' : 'links'}}`;
      const opties = schud([juist, `${q} \\text{ naar ${S.pt > 0 ? 'links' : 'rechts'}}`, `${tg(S.pn)} \\text{ naar ${S.pt > 0 ? 'rechts' : 'links'}}`, `${q} \\text{ omhoog}`]);
      return { soort: 'fase', opdracht: 'Let op het teken: x − p.', tex: sinTex(naam, S.a, S.b, S.pt, S.pn, S.k), html: vraag('Wat is de faseverschuiving ten opzichte van sin x?'), sleutel: `f${S.a}${S.pt}${S.pn}${S.k}`,
        antw: { soort: 'keuze', opties: opties.map((l, i) => ({ k: String(i), l })), juist: String(opties.indexOf(juist)) }, uitleg: [S.pt > 0 ? `x - ${q}: \\; p = ${q} > 0 \\Rightarrow \\text{naar rechts}` : `x + ${q} = x - \\left(-${q}\\right): \\; p = -${q} < 0 \\Rightarrow \\text{naar links}`] };
    } },
    graf: { naam: 'Kenmerken uit de grafiek', gen() {
      const a = kies([1, 1.5, 2, 3, 0.5]), b = kies([1, 2, 0.5]), k = kies([0, 1, 2, -1, 1.5]), f = sinF(a, b, 0, k), [t, n] = periodeAntw(b);
      const X = b === 0.5 ? [0, 4 * PI] : [0, 2 * PI], Y = [Math.floor(k - a - 1), Math.ceil(k + a + 1)];
      return { soort: 'graf', opdracht: 'Lees af: hoogste en laagste punt, afstand tussen twee toppen.', html: sgraf([{ f }], { x: X, y: Y, ys: a < 1 ? 0.5 : 1, breed: 420, hoog: 240 }) + vraag('Lees af: de amplitude, de evenwichtslijn en de periode.'), sleutel: `g${a}${b}${k}`,
        antw: delen(['\\text{amplitude} =', getal(a)], ['\\text{evenwichtslijn: } y =', getal(k)], ['\\text{periode} =', piAntw(t, n, '')]),
        uitleg: [`\\text{hoogste } ${tg(k + a)}, \\text{ laagste } ${tg(k - a)}: \\; y = \\frac{${tg(k + a)} + ${tg(k - a)}}{2} = ${tg(k)}, \\; \\text{amplitude } ${tg(a)}`, `\\text{afstand tussen twee toppen: } ${piTex(t, n)}`] };
    } },
  },
  oefenMix: [['ampEv', 1], ['bereik', 1], ['periode', 1], ['fase', 1], ['graf', 1]],
  test: [['ampEv', 2], ['bereik', 2], ['periode', 2], ['fase', 2], ['graf', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 5 · VERGELIJKINGEN GRAFISCH OPLOSSEN
// ===================================================================
function vglSit() {
  for (;;) {
    const a = kies([1, 1, 2, 3]), k = kies([0, 0, 1, -1]), c = r2(k + a * kies([0.3, 0.4, 0.5, 0.6, 0.8, -0.2, -0.3, -0.5, -0.7, 0.9, 1.2, -1.3]));
    if (c === k) continue;
    const f = (x) => a * Math.sin(x) + k, xs = nulpunten(f, 0, 2 * PI, c).filter((x, i, l) => i === 0 || x - l[i - 1] > 1e-3);
    return { a, k, c, f, xs, tex: `${a === 1 ? '' : a + ' \\cdot '}\\sin x${k ? (k > 0 ? ' + ' : ' - ') + Math.abs(k) : ''} = ${tg(c)}`, e: sinE(a, 1, 0, k) };
  }
}
const sinVenster = (V) => venster({ fs: [{ e: V.e, n: 'f' }], X: [0, 2 * PI], Y: [Math.floor(V.k - V.a - 1), Math.ceil(V.k + V.a + 1)], a: 0, b: 2 * PI, xv: 'x', xe: '', ye: '', xn: 'x (radialen)', yn: 'y', t: 'vfs', pi: true, buiten: false });
const D5 = {
  nr: 5, titel: 'Vergelijkingen grafisch oplossen', kort: 'Met het grafiekvenster de snijpunten zoeken in [0, 2π].', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div>
      <p>Een vergelijking zoals $\\sin x = 0{,}5$ los je <b>grafisch</b> op met ICT. In dit leerpad gebruik je het grafiekvenster (in plaats van GeoGebra):</p>
      <ol><li>De grafiek van het linkerlid staat al klaar.</li><li>Typ het rechterlid bij <i>Snijpunt</i> ($y = \\ldots$) en klik.</li><li>De <b>x-waarden</b> van de snijpunten zijn de oplossingen. Rond af op 0,01.</li></ol>
      <p>Let op het <b>interval</b>: in $[0, 2\\pi]$ zijn er meestal twee oplossingen. Ligt het rechterlid buiten het bereik, dan zijn er <b>geen</b> oplossingen.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: $\\sin x = 0{,}8$ op $[0, 2\\pi]$</div>
      ${sgraf([{ f: Math.sin }], { punten: [{ x: Math.asin(0.8), y: 0.8 }, { x: PI - Math.asin(0.8), y: 0.8 }], ha: [0.8] })}
      <p>Twee snijpunten: $x \\approx 0{,}93$ en $x \\approx 2{,}21$. &nbsp; $2 \\cdot \\sin x - 1 = -2$: $x \\approx 3{,}67$ en $x \\approx 5{,}76$. &nbsp; $\\sin x = 1{,}5$: geen oplossingen (bereik $[-1, 1]$).</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: '\\sin x = -0{,}5 \\text{ op } [0, 2\\pi]', stappen: ['\\text{Snijpunt met } y = -0{,}5', 'x \\approx 3{,}67 \\text{ en } x \\approx 5{,}76 \\quad (\\text{twee oplossingen})'] },
  ],
  soorten: {
    los: { naam: 'Los op in [0, 2π]', gen() {
      let V; do { V = vglSit(); } while (V.xs.length !== 2);
      return { soort: 'los', opdracht: 'Tip: typ het rechterlid bij "Snijpunt" in het grafiekvenster. Rond af op 0,01.', tex: `${V.tex} \\quad \\text{op } [0, 2\\pi]`, html: sinVenster(V), sleutel: V.tex,
        antw: delen(['\\text{kleinste oplossing: } x =', getal(V.xs[0], { dec: 2 })], ['\\text{grootste oplossing: } x =', getal(V.xs[1], { dec: 2 })]),
        uitleg: [`\\text{Snijpunt met } y = ${tg(V.c)}: \\; x \\approx ${tg(r2(V.xs[0]))} \\text{ en } x \\approx ${tg(r2(V.xs[1]))}`] };
    } },
    aantal: { naam: 'Hoeveel oplossingen?', gen() {
      const V = vglSit();
      return { soort: 'aantal', opdracht: 'Tip: kijk hoeveel keer de rechte y = … de grafiek snijdt.', tex: `${V.tex} \\quad \\text{op } [0, 2\\pi]`, html: sinVenster(V) + vraag('Hoeveel oplossingen heeft deze vergelijking in [0, 2π]?'), sleutel: V.tex + 'n',
        antw: getal(V.xs.length, { voor: '\\text{aantal oplossingen:}' }), uitleg: [V.xs.length ? `\\text{${V.xs.length} snijpunt${V.xs.length > 1 ? 'en' : ''}}` : `\\text{geen: } ${tg(V.c)} \\text{ ligt buiten het bereik } [${tg(V.k - V.a)}, ${tg(V.k + V.a)}]`] };
    } },
    geen: { naam: 'Waarom geen oplossing?', gen() {
      const a = kies([1, 2, 3]), k = kies([0, 1, -1]), c = k + a + kies([0.5, 1, 1.5]) * kies([1, -1]) * 1, cc = c > k ? k + a + 0.5 : k - a - 0.5;
      const tex = `${a === 1 ? '' : a + ' \\cdot '}\\sin x${k ? (k > 0 ? ' + ' : ' - ') + Math.abs(k) : ''} = ${tg(cc)}`;
      return { soort: 'geen', opdracht: 'Kies de juiste verklaring.', tex, html: vraag('Deze vergelijking heeft geen oplossingen. Waarom?'), sleutel: tex,
        antw: zinnen(`Het bereik van het linkerlid is [${kg(k - a)}, ${kg(k + a)}]: ${kg(cc)} ligt daarbuiten, dus de rechte snijdt de grafiek niet.`,
          ['Een sinusfunctie heeft nooit oplossingen.', 'De periode is te klein.', 'Je moet eerst omzetten naar graden.']), uitleg: [`\\text{ber} = [${tg(k - a)}, ${tg(k + a)}], \\quad ${tg(cc)} \\notin \\text{ber}`] };
    } },
  },
  oefenMix: [['los', 2], ['aantal', 1], ['geen', 1]],
  test: [['los', 5], ['aantal', 3], ['geen', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 6 · EEN BEPERKT INTERVAL
// ===================================================================
const INTERVALLEN = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [0, 3], [3, 4], [1, 4]]; // in stappen van π/2
function beperkt() {
  const [i, j] = kies(INTERVALLEN), a = kies([1, 1, 2, 3]), k = kies([0, 0, 1, -1, 2]), van = i * PI / 2, tot = j * PI / 2, f = sinF(a, 1, 0, k);
  const E = extrema(f, van, tot), lo = r2(E.absMin.y), hi = r2(E.absMax.y);
  return { i, j, a, k, van, tot, f, lo, hi, E, tex: `${a === 1 ? '' : a + ' \\cdot '}\\sin x${k ? (k > 0 ? ' + ' : ' - ') + Math.abs(k) : ''}`, ivT: `[${piTex(i, 2)}, ${piTex(j, 2)}]` };
}
const D6 = {
  nr: 6, titel: 'Een beperkt interval', kort: 'Nulwaarden, maximum en bereik van een sinusfunctie op een opgegeven interval.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Een sinusfunctie op een beperkt interval</div>
      <p>Net zoals bij de vorige functietypes kan je een sinusfunctie ook enkel op een beperkt interval bekijken. Controleer dan altijd <b>welk deel van de periode</b> je ziet: het bereik kan kleiner zijn dan $[k - |a|, k + |a|]$, maar nooit groter.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: $h(x) = \\sin x$ op $[\\pi, 2\\pi]$</div>
      ${sgraf([{ f: Math.sin, van: PI, tot: 2 * PI }], { punten: [{ x: PI, y: 0 }, { x: 2 * PI, y: 0 }, { x: 3 * PI / 2, y: -1 }], buiten: true })}
      <p>Domein $[\\pi, 2\\pi]$, nulwaarden $\\pi$ en $2\\pi$, minimum $-1$ in $x = \\frac{3\\pi}{2}$, bereik $[-1, 0]$ (niet $[-1, 1]$!).</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: $k(x) = 2 \\cdot \\sin x + 1$ op $\\left[0, \\frac{\\pi}{2}\\right]$</div>
      <p>Volledig bereik $[-1, 3]$, maar op $\\left[0, \\frac{\\pi}{2}\\right]$ stijgt $k$ van $k(0) = 1$ tot $k\\left(\\frac{\\pi}{2}\\right) = 3$: bereik $[1, 3]$.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'g(x) = \\sin x \\text{ op } [0, \\pi]', stappen: ['\\text{nulwaarden } 0 \\text{ en } \\pi', '\\text{maximum } 1 \\text{ in } x = \\frac{\\pi}{2}', '\\text{bereik } [0, 1]'] },
  ],
  soorten: {
    bereik: { naam: 'Bereik op het interval', gen() {
      const B = beperkt();
      return { soort: 'bereik', opdracht: 'Kijk welk deel van de grafiek je ziet.', tex: `f(x) = ${B.tex} \\quad \\text{op } ${B.ivT}`, html: sgraf([{ f: B.f, van: B.van, tot: B.tot }], { y: [B.k - B.a - 1, B.k + B.a + 1], buiten: true }) + vraag('Wat is het bereik op dit interval?'), sleutel: `${B.tex}${B.i}${B.j}`,
        antw: vz([{ a: B.lo, ai: true, b: B.hi, bi: true }], '\\text{ber } f ='), uitleg: [`\\text{kleinste waarde } ${tg(B.lo)}, \\; \\text{grootste waarde } ${tg(B.hi)}`, `\\text{ber } f = [${tg(B.lo)}, ${tg(B.hi)}]`] };
    } },
    max: { naam: 'Maximum of minimum', gen() {
      const B = beperkt(), mx = kies([true, false]), p = mx ? B.E.absMax : B.E.absMin;
      return { soort: 'max', opdracht: 'Lees af op de grafiek.', tex: `f(x) = ${B.tex} \\quad \\text{op } ${B.ivT}`, html: sgraf([{ f: B.f, van: B.van, tot: B.tot }], { y: [B.k - B.a - 1, B.k + B.a + 1], buiten: true }) + vraag(`Wat is het ${mx ? 'maximum' : 'minimum'} van f op dit interval?`), sleutel: `${B.tex}${B.i}${B.j}${mx}`,
        antw: getal(r2(p.y), { voor: `\\text{${mx ? 'maximum' : 'minimum'}} =` }), uitleg: [`\\text{${mx ? 'hoogste' : 'laagste'} punt: } (${piLabel(p.x).replace('π', '\\pi')} \\,;\\, ${tg(r2(p.y))})`] };
    } },
    nul: { naam: 'Nulwaarden op het interval', gen() {
      const [i, j] = kies(INTERVALLEN), van = i * PI / 2, tot = j * PI / 2;
      const nul = [0, 1, 2, 3, 4].filter(m => m % 2 === 0 && m >= i && m <= j).map(m => m / 2);
      const juist = nul.length ? nul.map(m => piTex(m, 1)).join(' \\text{ en } ') : '\\text{geen}';
      const alle = ['0', '\\pi', '2\\pi', '0 \\text{ en } \\pi', '\\pi \\text{ en } 2\\pi', '0, \\; \\pi \\text{ en } 2\\pi', '\\text{geen}', '\\frac{\\pi}{2}'];
      const opties = schud([juist, ...schud(alle.filter(x => x !== juist)).slice(0, 3)]);
      return { soort: 'nul', opdracht: 'Lees af op de grafiek.', tex: `f(x) = \\sin x \\quad \\text{op } [${piTex(i, 2)}, ${piTex(j, 2)}]`, html: sgraf([{ f: Math.sin, van, tot }], { buiten: true }) + vraag('Wat zijn de nulwaarden op dit interval?'), sleutel: `n${i}${j}`,
        antw: { soort: 'keuze', opties: opties.map((l, k) => ({ k: String(k), l })), juist: String(opties.indexOf(juist)) }, uitleg: [`\\text{nulwaarden: } ${juist}`] };
    } },
  },
  oefenMix: [['bereik', 2], ['max', 1], ['nul', 1]],
  test: [['bereik', 4], ['max', 3], ['nul', 3]], testSchudden: true,
};

// ===================================================================
//  DEEL 7 · IN DE ZORG EN WELZIJN
// ===================================================================
function sitTemp() {
  const lo = kies([36.4, 36.5, 36.6]), hi = r1(lo + kies([0.8, 1, 1.2])), tmin = kies([3, 4, 5]), ev = r2((lo + hi) / 2), A = r2((hi - lo) / 2);
  const f = (t) => ev + A * Math.sin(PI / 12 * (t - tmin - 6));
  return { naam: 'temp', lo, hi, tmin, tmax: tmin + 12, ev, A, f, e: `${ev}+${A}*Math.sin(${PI / 12}*(x-${tmin + 6}))`, per: 24, eenh: '°C', te: 'uur', titel: 'Bioritme van de lichaamstemperatuur',
    tekst: `De lichaamstemperatuur van een patiënt schommelt elke dag volgens een vast ritme. Om ${tmin} u is ze het laagst (${kg(lo)} °C), om ${tmin + 12} u het hoogst (${kg(hi)} °C). Het patroon herhaalt zich elke dag.`,
    X: [0, 24], Y: [r1(lo - 0.3), r1(hi + 0.3)], xn: 'tijdstip (uur)', yn: 'temperatuur (°C)' };
}
function sitDruk() {
  const lo = kies([70, 75, 80]), hi = kies([115, 120, 125, 130]), per = kies([0.75, 0.8, 1, 0.6]), ev = (lo + hi) / 2, A = (hi - lo) / 2;
  return { naam: 'druk', lo, hi, per, ev, A, f: (t) => ev + A * Math.sin(2 * PI * t / per), e: `${ev}+${A}*Math.sin(${2 * PI / per}*x)`, eenh: 'mmHg', te: 's', titel: 'Bloeddruk tijdens een hartslag',
    tekst: `De bloeddruk van een patiënt schommelt tussen ${lo} en ${hi} mmHg. Elke hartslag duurt ${kg(per)} seconden.`, X: [0, 3 * per], Y: [lo - 10, hi + 10], xn: 'tijd (s)', yn: 'bloeddruk (mmHg)' };
}
function sitBaby() {
  const lo = kies([105, 110, 115]), hi = lo + kies([20, 24, 30]), per = kies([30, 40, 50]), ev = (lo + hi) / 2, A = (hi - lo) / 2;
  return { naam: 'baby', lo, hi, per, ev, A, f: (t) => ev + A * Math.sin(2 * PI * t / per), e: `${ev}+${A}*Math.sin(${2 * PI / per}*x)`, eenh: 'slagen per minuut', te: 's', titel: 'Hartslag van een slapende baby',
    tekst: `De hartslag van een pasgeborene schommelt tijdens de slaap tussen ${lo} en ${hi} slagen per minuut, met een periode van ongeveer ${per} seconden.`, X: [0, 3 * per], Y: [lo - 10, hi + 10], xn: 'tijd (s)', yn: 'hartslag (slagen/min)' };
}
const kiesCtx = () => kies([sitTemp, sitDruk, sitBaby])();
const ctxGraf = (C) => figuur(rgraf({ x: C.X, y: C.Y, functies: [{ f: C.f }], xn: C.xn, yn: C.yn, breed: 420, hoog: 220 }));
const D7 = {
  nr: 7, titel: 'In de zorg en welzijn', kort: 'Amplitude, evenwichtslijn en periode in een situatie, met eenheden.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Periodieke fenomenen</div>
      <p>Veel fenomenen in het menselijk lichaam en in de zorgpraktijk herhalen zich volgens een vast patroon: ze zijn <b>periodiek</b>. Een sinusfunctie beschrijft ze goed.</p>
      <ul><li><b>Evenwichtslijn</b> = (hoogste waarde + laagste waarde) : 2</li><li><b>Amplitude</b> = (hoogste waarde − laagste waarde) : 2</li><li><b>Periode</b> = de tijd van één volledige cyclus = totale tijd : aantal volledige cycli</li>
      <li>Vermeld altijd de <b>eenheden</b> (°C, mmHg, uur, minuten …).</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: het bioritme van je lichaamstemperatuur</div>
      ${figuur(rgraf({ x: [0, 24], y: [36.2, 37.8], xs: 2, ys: 0.2, xn: 'tijdstip (uur)', yn: 'temperatuur (°C)', functies: [{ f: (t) => 37 + 0.5 * Math.sin(PI / 12 * (t - 10)) }], punten: [{ x: 4, y: 36.5 }, { x: 16, y: 37.5 }] }))}
      <p>Laagst om 4 u (36,5 °C), hoogst om 16 u (37,5 °C). Evenwichtslijn 37 °C, amplitude 0,5 °C, periode 24 uur.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p><b>Bloeddruk</b> tussen 80 en 120 mmHg, elke hartslag 0,8 s: evenwichtslijn 100 mmHg, amplitude 20 mmHg, periode 0,8 s, dus $60 : 0{,}8 = 75$ slagen per minuut.</p>
      <p><b>Slaapcycli:</b> 5 volledige cycli in 7,5 uur: periode $7{,}5 : 5 = 1{,}5$ uur $= 90$ minuten.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave2('De hartslag van een pasgeborene schommelt tijdens de slaap tussen 110 en 130 slagen per minuut.'), stappen: ['\\text{evenwichtslijn: } (130 + 110) : 2 = 120', '\\text{amplitude: } (130 - 110) : 2 = 10 \\text{ slagen per minuut}'] },
  ],
  soorten: {
    ampEv: { naam: 'Evenwichtslijn en amplitude', gen() {
      const C = kiesCtx();
      return { soort: 'ampEv', opdracht: 'Gebruik de hoogste en de laagste waarde.', html: opgave2(C.tekst) + ctxGraf(C), sleutel: C.tekst,
        antw: delen(['\\text{evenwichtslijn: } y =', getal(C.ev, { na: `\\text{ ${C.eenh}}` })], ['\\text{amplitude} =', getal(C.A, { na: `\\text{ ${C.eenh}}` })]),
        uitleg: [`(${tg(C.hi)} + ${tg(C.lo)}) : 2 = ${tg(C.ev)}`, `(${tg(C.hi)} - ${tg(C.lo)}) : 2 = ${tg(C.A)}`] };
    } },
    periode: { naam: 'Periode in een situatie', gen() {
      const s = kies(['slaap', 'temp', 'adem']);
      if (s === 'slaap') { const n = kies([4, 5, 6]), dur = kies([1.5, 1.25, 1.75]), tot = n * dur;
        return { soort: 'periode', opdracht: 'Periode = totale tijd : aantal volledige cycli.', html: opgave2(`Een slaapcoach toont een cliënt een grafiek van de slaapdiepte tijdens één nacht van ${kg(tot)} uur, met daarin ${n} volledige cycli.`) + vraag('Wat is de periode in uren? En in minuten?'), sleutel: `sl${n}${dur}`,
          antw: delen(['\\text{periode} =', getal(dur, { na: '\\text{ uur}' })], ['\\text{periode} =', getal(dur * 60, { na: '\\text{ minuten}' })]), uitleg: [`${tg(tot)} : ${n} = ${tg(dur)} \\text{ uur}`, `${tg(dur)} \\cdot 60 = ${tg(dur * 60)} \\text{ minuten}`] }; }
      if (s === 'adem') { const n = kies([12, 15, 20]), per = 60 / n;
        return { soort: 'periode', opdracht: 'Periode = totale tijd : aantal volledige cycli.', html: opgave2(`Een verpleegkundige telt bij een patiënt in rust ${n} ademhalingen per minuut. De hoeveelheid lucht in de longen is een sinusfunctie van de tijd.`) + vraag('Wat is de periode in seconden?'), sleutel: `ad${n}`,
          antw: getal(per, { dec: 1, na: '\\text{ s}' }), uitleg: [`60 \\text{ s} : ${n} = ${tg(per)} \\text{ s}`] }; }
      const C = sitTemp();
      return { soort: 'periode', opdracht: 'Na hoeveel uur herhaalt het patroon zich?', html: opgave2(C.tekst) + ctxGraf(C) + vraag('Wat is de periode (in uur)?'), sleutel: C.tekst + 'p', antw: getal(24, { na: '\\text{ uur}' }), uitleg: ['\\text{Het patroon herhaalt zich elke dag: periode 24 uur}'] };
    } },
    waarde: { naam: 'Een waarde berekenen', gen() {
      const C = kiesCtx(), x = C.naam === 'temp' ? kies([0, 2, 6, 8, 10, 12, 14, 18, 20, 22]) : r2(C.per * kies([0.1, 0.2, 0.4, 0.6, 0.8, 1.1, 1.3]));
      const v = C.f(x), d = C.naam === 'temp' ? 2 : 1;
      const vr = C.naam === 'temp' ? `Hoe hoog is de temperatuur om ${x} u?` : `Hoe groot is de ${C.naam === 'druk' ? 'bloeddruk' : 'hartslag'} na ${kg(x)} s?`;
      const v2 = venster({ fs: [{ e: C.e, n: C.naam === 'temp' ? 'T' : C.naam === 'druk' ? 'P' : 'H' }], X: C.X, Y: C.Y, a: C.X[0], b: C.X[1], xv: 't', xe: C.te, ye: C.eenh, xn: C.xn, yn: C.yn, t: 'vf', buiten: false });
      return { soort: 'waarde', opdracht: 'Tip: typ de tijd bij "Bereken" in het grafiekvenster.', html: opgave2(C.tekst) + vraag(vr) + v2, sleutel: C.tekst + x,
        antw: getal(v, { dec: d, na: `\\text{ ${C.eenh}}` }), uitleg: [`\\approx ${tg(W.rond(v, d))} \\text{ ${C.eenh}}`] };
    } },
    betekenis: { naam: 'Wat betekent het?', gen() {
      const C = kiesCtx(), k = kies(['ev', 'A', 'per']);
      const Z = { ev: `De ${C.naam === 'temp' ? 'temperatuur' : C.naam === 'druk' ? 'bloeddruk' : 'hartslag'} schommelt rond ${kg(C.ev)} ${C.eenh}.`, A: `De ${C.naam === 'temp' ? 'temperatuur' : C.naam === 'druk' ? 'bloeddruk' : 'hartslag'} gaat tot ${kg(C.A)} ${C.eenh} boven en onder die middenwaarde.`,
        per: C.naam === 'temp' ? 'Het patroon herhaalt zich elke 24 uur.' : `Het patroon herhaalt zich elke ${kg(C.per)} seconden.` };
      const W2 = { ev: `\\text{evenwichtslijn } y = ${tg(C.ev)}`, A: `\\text{amplitude } ${tg(C.A)}`, per: `\\text{periode } ${C.naam === 'temp' ? 24 : tg(C.per)}` };
      const fout = Object.keys(Z).filter(x => x !== k).map(x => Z[x]).concat([`De ${C.naam === 'temp' ? 'temperatuur' : 'waarde'} wordt nooit hoger dan ${kg(C.ev)} ${C.eenh}.`]);
      return { soort: 'betekenis', opdracht: 'Kies de zin die past bij de situatie.', html: opgave2(C.tekst) + `<p class="midden">$${W2[k]}$</p>` + vraag('Wat betekent dat in de situatie?'), sleutel: C.tekst + k, antw: zinnen(Z[k], fout), uitleg: [tx(Z[k])] };
    } },
  },
  oefenMix: [['ampEv', 2], ['periode', 1], ['waarde', 1], ['betekenis', 1]],
  test: [['ampEv', 3], ['periode', 3], ['waarde', 2], ['betekenis', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 8 · EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D8 = {
  nr: 8, titel: 'Eindtest sinusfunctie', kort: 'Alle soorten vragen door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${OMZET}${KENMERKEN}${AFSPRAAK}`,
  voorbeelden: [],
  soorten: {
    e1: mix(D1, 'gr2rad', 'Graden → radialen'), e2: mix(D1, 'rad2gr', 'Radialen → graden'), e3: mix(D2, 'waarde', 'Sinuswaarde'), e4: mix(D3, 'welkeGraf', 'Voorschrift → grafiek'),
    e5: mix(D4, 'bereik', 'Bereik'), e6: mix(D4, 'periode', 'Periode'), e7: mix(D4, 'graf', 'Kenmerken uit de grafiek'), e8: mix(D5, 'los', 'Vergelijking'), e9: mix(D6, 'bereik', 'Beperkt interval'), e10: mix(D7, 'ampEv', 'In context'),
  },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6, D7, D8]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen;
    s.gen = () => {
      const v = { ...g() };
      if (v.html) v.html = woorden(v.html);
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
  D.theorie = woorden(D.theorie);
}

Leerpaden.registreer({
  code: 'sinusfunctie',
  titel: 'Sinusfunctie',
  ondertitel: 'Wiskunde · 5WW / 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert werken met <b>radialen</b>, de grafiek van $\\sin x$, de <b>transformaties</b> van de algemene sinusfunctie $f(x) = a \\cdot \\sin(b(x - p)) + k$,
    de <b>kenmerken</b> (amplitude, evenwichtslijn, bereik, periode, faseverschuiving), <b>vergelijkingen grafisch oplossen</b> en wat dat betekent in de <b>zorg en welzijn</b>. Alles volgt de PowerPoint uit de les.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p><b>Radialen typen:</b> typ het getal vóór π (voor $\\frac{3\\pi}{4}$ typ je <code>3/4</code>). <b>Geen GeoGebra nodig:</b> bij de vergelijkingen staat een grafiekvenster klaar.</p>`,
  groepen: [
    { titel: 'A · Radialen en de grafiek van sin x', delen: [1, 2] },
    { titel: 'B · De algemene sinusfunctie', delen: [3, 4] },
    { titel: 'C · Toepassen', delen: [5, 6, 7] },
    { titel: 'D · Eindtest', delen: [8] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8],
});
})();
