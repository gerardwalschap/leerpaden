// ===== Veeltermfuncties in context · Wiskunde 5WW / 5BCW — hulpmiddelen =====
// Leidraad: de werkbundel "Veeltermfuncties in context" (hoofdstuk 0 tot 9) (G. Walschap).
// Enkel individueel werk: geen duo- of groepsopdrachten, geen hoofdstuk 10 (poster in groep).
// Geen GeoGebra nodig: bij elke rekenvraag staat een grafiekvenster met de formule al ingevuld.
// Het grafiekvenster, de zoombare grafieken en de woordenuitleg zijn overgenomen uit het leerpad rationale functies in context.
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
  const xs = opt.xs || nice((X1 - X0) / 6), ys = opt.ys || nice((Y1 - Y0) / 6);
  const fs = opt.klein ? 9 : 10, num = (v) => (v < 0 ? '−' : '') + kg(Math.abs(+v.toFixed(6)));
  let g = '';
  for (let k = Math.ceil(X0 / xs) * xs; k <= X1 + 1e-9; k += xs) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/><text x="${X(k)}" y="${Y(Y0) + 13}" font-size="${fs}" text-anchor="middle" fill="#555">${num(k)}</text>`;
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
  const zoombaar = !opt.klein && (opt.functies || []).length && (opt.functies || []).every(fn => fn.e);
  if (!zoombaar) return rgrafKern(opt);
  const spec = { ...opt, functies: opt.functies.map(({ f, ...rest }) => rest) };
  return `<div class="rg" data-rg='${String(JSON.stringify(spec)).replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}'>${rgrafKern(opt)}${ZOOM_KNOPPEN('rg')}</div>`;
}
const figuur = (svg) => `<div class="figuur">${svg}</div>`;

// =====================================================================
//  REKENHULP voor veeltermen: extrema en nulpunten op een interval
// =====================================================================
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
// veelterm als TeX en als formule (voor het grafiekvenster): coëfficiënten van de hoogste graad naar de constante
function vtTex(c, v = 'x') {
  const n = c.length - 1, t = [];
  c.forEach((a, i) => {
    if (!a) return; const g = n - i, abs = Math.abs(a), teken = a < 0 ? '-' : '+';
    const coef = g > 0 && abs === 1 ? '' : tg(abs), macht = g === 0 ? '' : g === 1 ? v : `${v}^${g}`;
    t.push(`${t.length ? ` ${teken} ` : a < 0 ? '-' : ''}${coef}${macht}`);
  });
  return t.join('') || '0';
}
const vtE = (c) => c.map((a, i) => `(${a})*x**${c.length - 1 - i}`).join('+');
const vtF = (c) => (x) => c.reduce((s, a) => s * x + a, 0);
const klok = (u) => { const h = Math.floor(u + 1e-9), m = Math.round((u - h) * 60); return m === 60 ? `${(h + 1) % 24} u` : m ? `${h % 24} u ${String(m).padStart(2, '0')}` : `${h % 24} u`; };
const MAANDEN = ['september', 'oktober', 'november', 'december', 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september'];
const datum = (m) => { const k = Math.floor(m + 1e-9), dag = Math.round((m - k) * 30) + 1; return dag <= 1 ? `1 ${MAANDEN[k]}` : `${Math.min(dag, 30)} ${MAANDEN[k]}`; };

// =====================================================================
//  SITUATIES — elke situatie is een veeltermmodel met telkens nieuwe getallen.
//  S: titel, verhaal, f, e (formule), tex, fn, x, xe, ye, yn, dom, nul, max/min,
//  w (wiskundetaal) en z (contexttaal) per kenmerk, zF (foute zinnen), graf (venster).
// =====================================================================

// 1. concentratie van een geneesmiddel: C(t) = a·t·(t − T)²  (werkbundel 1.1, 3.1, 9.1)
function sitConc(variant = kies(['pijnstiller', 'geneesmiddel'])) {
  const [T, a] = kies([[12, 0.05], [12, 0.04], [12, 0.06], [9, 0.1], [9, 0.08], [15, 0.02], [15, 0.024]]);
  const tm = T / 3, Mx = r2(4 * a * T ** 3 / 27), uur = kies([7, 8, 9]);
  const c = [a, -2 * a * T, a * T * T, 0], f = vtF(c), ding = variant === 'pijnstiller' ? 'de pijnstiller' : 'het geneesmiddel';
  return {
    fam: 'conc', variant, titel: variant === 'pijnstiller' ? 'Pijnstiller in het bloed' : 'Geneesmiddel in het bloed',
    verhaal: `Een patiënt neemt om ${uur} u ${ding} in. Het komt in het bloed. De formule geeft de concentratie $C$: hoeveel milligram er in één liter bloed zit.`,
    xBet: 'het aantal uur na de inname', yBet: 'de concentratie (in mg per liter bloed)', e: vtE(c), c,
    f, tex: `C(t) = ${vtTex(c, 't')}`, fn: 'C', x: 't', xe: 'uur', ye: 'mg/l', yn: 'concentratie (mg/l)',
    dom: [0, T], nul: [0, T], max: { x: tm, y: Mx }, T, a, tm, Mx, uur, ding, dec: 2,
    w: { begin: 'C(0) = 0', nul: `\\text{nulpunten: } 0 \\text{ en } ${T}`, max: `\\text{maximum } ${tg(Mx)} \\text{ voor } t = ${tm}`, dom: `\\text{dom } C = ${ivTex(0, T)}`,
      bereik: `\\text{ber } C = ${ivTex(0, Mx)}`, verloop: `C \\text{ stijgt op } ${ivTex(0, tm)} \\text{ en daalt op } ${ivTex(tm, T)}` },
    z: { begin: `Op het moment van inname zit er nog geen ${variant === 'pijnstiller' ? 'pijnstiller' : 'geneesmiddel'} in het bloed.`,
      nul: `Bij de inname en na ${T} uur zit er geen ${variant === 'pijnstiller' ? 'pijnstiller' : 'geneesmiddel'} in het bloed: na ${T} uur is ${ding} volledig uitgewerkt.`,
      max: `Om ${klok(uur + tm)} (${tm} uur na inname) is de concentratie het hoogst: ${kg(Mx)} mg/l.`, dom: `We volgen de concentratie ${T} uur lang, vanaf de inname.`,
      bereik: `De concentratie ligt tussen 0 en ${kg(Mx)} mg/l.`, verloop: `De concentratie stijgt de eerste ${tm} uur en daalt daarna tot ${ding} uitgewerkt is.` },
    zF: { max: `Na ${kg(Mx)} uur is de concentratie het hoogst: ${tm} mg/l.`, nul: `Na ${T} uur is de concentratie het hoogst.`, begin: `Bij de inname zit er al ${kg(Mx)} mg/l in het bloed.` },
    graf: { x: [0, T], y: [0, top(Mx * 1.15)] },
  };
}

// 2. gewicht van een pasgeboren baby: G(d) = a(d − p)² + q  (werkbundel 1.3, 3.2, 9.3)
function sitBaby() {
  const G0 = kies([3200, 3400, 3500, 3600, 3800]), p = kies([4, 5]), a = kies([6, 8, 10]), q = G0 - a * p * p;
  const c = [a, -2 * a * p, a * p * p + q], f = vtF(c), G14 = f(14);
  return {
    fam: 'baby', variant: 'baby', titel: 'Het gewicht van een pasgeboren baby',
    verhaal: 'Een pasgeboren baby verliest de eerste dagen wat gewicht. Daarna komt de baby weer bij. De formule geeft het gewicht $G$ (in gram):',
    xBet: 'het aantal dagen na de geboorte', yBet: 'het gewicht van de baby (in gram)', e: vtE(c), c,
    f, tex: `G(d) = ${vtTex(c, 'd')}`, fn: 'G', x: 'd', xe: 'dagen', ye: 'gram', yn: 'gewicht (gram)',
    dom: [0, 14], nul: [], min: { x: p, y: q }, G0, p, a, q, G14, terug: 2 * p, dec: 0,
    w: { begin: `G(0) = ${G0}`, min: `\\text{minimum } ${q} \\text{ voor } d = ${p}`, dom: '\\text{dom } G = [0 \\,;\\, 14]', bereik: `\\text{ber } G = ${ivTex(q, G14)}`,
      verloop: `G \\text{ daalt op } ${ivTex(0, p)} \\text{ en stijgt op } ${ivTex(p, 14)}`, nul: '\\text{G heeft geen nulpunten}' },
    z: { begin: `Bij de geboorte weegt de baby ${G0} gram.`, min: `Op dag ${p} weegt de baby het minst: ${q} gram.`, dom: 'We volgen het gewicht de eerste twee weken (14 dagen).',
      bereik: `Het gewicht ligt tussen ${q} en ${G14} gram.`, verloop: `De eerste ${p} dagen verliest de baby gewicht, daarna komt de baby weer bij.`, nul: 'Het gewicht van een baby is nooit 0 gram.' },
    zF: { min: `Op dag ${q} weegt de baby het minst: ${p} gram.`, begin: `Bij de geboorte weegt de baby ${q} gram.`, verloop: 'De baby komt elke dag evenveel bij.' },
    graf: { x: [0, 14], y: [Math.floor((q - 200) / 100) * 100, Math.ceil((G14 + 200) / 100) * 100] },
  };
}

// 3. hartslag tijdens een looptest: H(t) = −a t² + b t + c  (werkbundel 1.4)
function sitHart() {
  const [tm, Hmax, H0] = kies([[10, 150, 70], [10, 160, 75], [10, 170, 70], [8, 150, 70], [8, 166, 70], [12, 160, 70], [12, 178, 70]]);
  const a = (Hmax - H0) / tm / tm, c = [-a, 2 * a * tm, H0], f = vtF(c), naam = kies(['Yasmine', 'Mohamed', 'Lina', 'Jonas']), lft = kies([16, 17, 18]);
  return {
    fam: 'hart', variant: 'hart', titel: 'Hartslag tijdens een looptest',
    verhaal: `Tijdens de les LO loopt ${naam} (${lft} jaar) een looptest van ${2 * tm} minuten: eerst steeds sneller, daarna steeds trager. De formule geeft de hartslag $H$ (in slagen per minuut):`,
    xBet: 'het aantal minuten na de start', yBet: 'de hartslag (in slagen per minuut)', e: vtE(c), c, naam, lft,
    f, tex: `H(t) = ${vtTex(c, 't')}`, fn: 'H', x: 't', xe: 'minuten', ye: 'slagen per minuut', yn: 'hartslag (slagen/min)',
    dom: [0, 2 * tm], nul: [], max: { x: tm, y: Hmax }, tm, Hmax, H0, a, dec: 0,
    w: { begin: `H(0) = ${H0}`, max: `\\text{maximum } ${Hmax} \\text{ voor } t = ${tm}`, dom: `\\text{dom } H = ${ivTex(0, 2 * tm)}`, bereik: `\\text{ber } H = ${ivTex(H0, Hmax)}`,
      verloop: `H \\text{ stijgt op } ${ivTex(0, tm)} \\text{ en daalt op } ${ivTex(tm, 2 * tm)}` },
    z: { begin: `Bij de start van de test is de hartslag van ${naam} ${H0} slagen per minuut (in rust).`, max: `Na ${tm} minuten is de hartslag het hoogst: ${Hmax} slagen per minuut.`,
      dom: `De looptest duurt ${2 * tm} minuten.`, bereik: `De hartslag ligt tussen ${H0} en ${Hmax} slagen per minuut.`, verloop: `De eerste ${tm} minuten stijgt de hartslag, daarna daalt hij weer.` },
    zF: { max: `Na ${Hmax} minuten is de hartslag het hoogst: ${tm} slagen per minuut.`, begin: `Bij de start is de hartslag ${Hmax} slagen per minuut.`, verloop: 'De hartslag stijgt de hele test.' },
    graf: { x: [0, 2 * tm], y: [0, top(Hmax * 1.1)] },
  };
}

// 4. saldo van een jeugdbeweging: S(m) = −k(m − r1)(m − r2)(m − r3)  (werkbundel 1.5)
function sitSaldo() {
  for (;;) {
    const k = kies([4, 5, 6]), q1 = kies([2, 3]), q2 = kies([7, 8]), q3 = kies([14, 15]);
    const c = [-k, k * (q1 + q2 + q3), -k * (q1 * q2 + q1 * q3 + q2 * q3), k * q1 * q2 * q3], f = vtF(c);
    const E = extrema(f, 0, 12), mn = E.lokMin[0], mxL = E.lokMax[0];
    if (!mn || !mxL) continue;
    const S0 = f(0), S12 = f(12), absMax = E.absMax;
    return {
      fam: 'saldo', variant: 'jeugdbeweging', titel: 'Het budget van de jeugdbeweging',
      verhaal: 'Een jeugdbeweging houdt het saldo $S$ (in euro) op haar rekening bij. Het saldo kan ook negatief worden: dan staat de rekening "in het rood". De formule geeft het saldo:',
      xBet: 'het aantal maanden na 1 september', yBet: 'het saldo (in euro)', e: vtE(c), c,
      f, tex: `S(m) = ${vtTex(c, 'm')}`, fn: 'S', x: 'm', xe: 'maanden', ye: 'euro', yn: 'saldo (euro)',
      dom: [0, 12], nul: [q1, q2], min: { x: mn.x, y: mn.y }, lokMax: { x: mxL.x, y: mxL.y }, absMax, S0, S12, q1, q2, k, dec: 1,
      w: { begin: `S(0) = ${S0}`, nul: `\\text{nulpunten: } ${q1} \\text{ en } ${q2}`, teken: `S(m) < 0 \\text{ voor } m \\in {]}${q1} \\,;\\, ${q2}{[}`,
        min: `\\text{minimum } ${tg(r1(mn.y))} \\text{ voor } m \\approx ${tg(r1(mn.x))}`, dom: '\\text{dom } S = [0 \\,;\\, 12]' },
      z: { begin: `Op 1 september staat er ${S0} euro op de rekening.`, nul: `Op 1 ${MAANDEN[q1]} en op 1 ${MAANDEN[q2]} staat er precies 0 euro op de rekening.`,
        teken: `Van 1 ${MAANDEN[q1]} tot 1 ${MAANDEN[q2]} staat de rekening in het rood.`, min: `De grootste schuld is ongeveer ${kg(-r1(mn.y))} euro, ongeveer ${kg(r1(mn.x))} maanden na 1 september.`,
        dom: 'We volgen het saldo één jaar lang, vanaf 1 september.' },
      zF: { teken: `Van 1 september tot 1 ${MAANDEN[q1]} staat de rekening in het rood.`, nul: `Op 1 ${MAANDEN[q1]} en op 1 ${MAANDEN[q2]} is de rekening leeg en wordt ze gesloten.`, min: `De grootste schuld is ${S0} euro.` },
      graf: { x: [0, 12], y: [Math.floor(mn.y * 1.4 / 100) * 100, Math.ceil(Math.max(S0, S12, mxL.y) * 1.15 / 100) * 100] },
    };
  }
}

// 5. griepgolf: Z(w) = k·w²·(L − w)  (werkbundel hoofdstuk 0)
function sitGriep() {
  const [L, k] = kies([[12, 1], [9, 2], [15, 0.5], [12, 0.5], [9, 3]]);
  const c = [-k, k * L, 0, 0], f = vtF(c), wm = 2 * L / 3, Mx = r0(f(wm));
  return {
    fam: 'griep', variant: 'griep', titel: 'Een griepgolf op de scholencampus',
    verhaal: 'Op een grote scholencampus breekt een griepgolf uit. De formule geeft het aantal zieke leerlingen $Z$:',
    xBet: 'het aantal weken na het begin van de griepgolf', yBet: 'het aantal zieke leerlingen', e: vtE(c), c,
    f, tex: `Z(w) = ${vtTex(c, 'w')}`, fn: 'Z', x: 'w', xe: 'weken', ye: 'leerlingen', yn: 'zieke leerlingen',
    dom: [0, L], nul: [0, L], max: { x: wm, y: Mx }, L, wm, Mx, dec: 0,
    w: { begin: 'Z(0) = 0', nul: `\\text{nulpunten: } 0 \\text{ en } ${L}`, max: `\\text{maximum } ${Mx} \\text{ voor } w = ${wm}`, dom: `\\text{dom } Z = ${ivTex(0, L)}`,
      bereik: `\\text{ber } Z = ${ivTex(0, Mx)}`, verloop: `Z \\text{ stijgt op } ${ivTex(0, wm)} \\text{ en daalt op } ${ivTex(wm, L)}` },
    z: { begin: 'Bij het begin van de griepgolf is nog niemand ziek.', nul: `Bij de start en na ${L} weken is niemand ziek: dan is de griepgolf voorbij.`,
      max: `In week ${wm} zijn er het meeste zieken: ${Mx} leerlingen.`, dom: `We volgen de griepgolf ${L} weken.`, bereik: `Het aantal zieke leerlingen ligt tussen 0 en ${Mx}.`,
      verloop: `De eerste ${wm} weken worden er steeds meer leerlingen ziek, daarna steeds minder.` },
    zF: { max: `In week ${Mx} zijn er het meeste zieken: ${wm} leerlingen.`, nul: `Na ${L} weken zijn alle leerlingen ziek.`, begin: `Bij het begin zijn er al ${Mx} leerlingen ziek.` },
    graf: { x: [0, L], y: [0, top(Mx * 1.12)] },
  };
}

// 6. drukte op de spoeddienst: een vierdegraadsfunctie met twee toppen (werkbundel 1.2)
function sitSpoed() {
  for (;;) {
    const t1 = kies([9, 10]), t2 = kies([13, 14]), t3 = kies([18, 19]), D = kies([12, 14, 15, 16]), Tp = kies([26, 28, 30]);
    const s1 = t1 + t2 + t3, s2 = t1 * t2 + t1 * t3 + t2 * t3, s3 = t1 * t2 * t3;
    const P = (t) => t ** 4 / 4 - s1 * t ** 3 / 3 + s2 * t * t / 2 - s3 * t;
    const a = (Tp - D) / (P(t2) - P(t3)), C = D + a * P(t2);
    const c = [-a / 4, a * s1 / 3, -a * s2 / 2, a * s3, C], f = vtF(c);
    const W6 = f(6), W22 = f(22), top1 = f(t1);
    if (W6 < 2 || W22 < 2 || top1 < D + 3 || top1 > Tp - 2) continue;
    return {
      fam: 'spoed', variant: 'spoed', titel: 'Drukte op de spoeddienst',
      verhaal: 'De grafiek toont het aantal patiënten $W$ in de wachtzaal van een spoeddienst op een zaterdag. In het grafiekvenster zit de formule van de grafiek al klaar.',
      xBet: 'het uur van de dag (aantal uur na middernacht)', yBet: 'het aantal patiënten in de wachtzaal', e: vtE(c), c,
      f, tex: `W(t) = ${vtTex(c.map(v => r2(v) === 0 ? v : +v.toPrecision(4)), 't')}`, fn: 'W', x: 't', xe: 'uur', ye: 'patiënten', yn: 'patiënten in de wachtzaal',
      dom: [6, 22], geenFormule: true, nul: [], max: { x: t3, y: Tp }, top1: { x: t1, y: top1 }, dal: { x: t2, y: D }, W6, W22, t1, t2, t3, dec: 0, klokx: true,
      w: { max: `\\text{maximum } ${Tp} \\text{ voor } t = ${t3}`, dal: `\\text{lokaal minimum } ${D} \\text{ voor } t = ${t2}`, dom: '\\text{dom } W = [6 \\,;\\, 22]', nul: '\\text{W heeft geen nulpunten}',
        top1: `\\text{lokaal maximum } ${r0(top1)} \\text{ voor } t = ${t1}` },
      z: { max: `Om ${t3} u is het het drukst van de dag: ${Tp} patiënten in de wachtzaal.`, dal: `Om ${t2} u is het rustiger: ${D} patiënten. Dat is rustig in vergelijking met de uren ervoor en erna, maar niet het rustigste moment van de dag.`,
        dom: 'We volgen de wachtzaal van 6 u tot 22 u.', nul: 'De wachtzaal is nooit helemaal leeg.', top1: `Om ${t1} u is er een eerste drukke piek: ongeveer ${r0(top1)} patiënten.` },
      zF: { dal: `Om ${t2} u is het rustigste moment van de dag.`, max: `Om ${Tp} u is het het drukst: ${t3} patiënten.`, nul: 'Om 6 u en om 22 u is de wachtzaal leeg.' },
      graf: { x: [6, 22], y: [0, top(Tp * 1.15)] },
    };
  }
}

// ---------- situaties voor het praktisch domein (hoofdstuk 2)
// 7. fontein: h(x) = −a·x·(x − L)
function sitFontein() {
  const [L, H] = kies([[8, 4], [10, 5], [10, 4], [8, 2], [6, 2.25], [12, 4.5], [12, 3]]);
  const a = 4 * H / L / L, c = [-a, a * L, 0], f = vtF(c);
  return {
    fam: 'fontein', variant: 'fontein', titel: 'Een fontein in de tuin van het woonzorgcentrum',
    verhaal: 'In de tuin van een woonzorgcentrum staat een fontein. De straal komt uit een spuitmond op de grond. De formule geeft de hoogte $h$ (in m) van de straal:',
    xBet: 'de horizontale afstand tot de spuitmond (in m)', yBet: 'de hoogte van de straal (in m)', e: vtE(c), c,
    f, tex: `h(x) = ${vtTex(c)}`, fn: 'h', x: 'x', xe: 'm', ye: 'm', yn: 'hoogte (m)',
    dom: [0, L], nul: [0, L], max: { x: L / 2, y: H }, L, H, a, dec: 2,
    w: { nul: `\\text{nulpunten: } 0 \\text{ en } ${L}`, max: `\\text{maximum } ${tg(H)} \\text{ voor } x = ${tg(L / 2)}`, dom: `\\text{praktisch domein } ${ivTex(0, L)}`, bereik: `\\text{ber } h = ${ivTex(0, H)}` },
    z: { nul: `De straal komt uit de spuitmond (x = 0) en komt ${L} m verder weer op de grond.`, max: `${kg(L / 2)} m van de spuitmond is de straal het hoogst: ${kg(H)} m.`,
      dom: `De straal bestaat enkel tussen de spuitmond en de plaats waar hij neerkomt: ${L} m verder.`, bereik: `De straal is tussen 0 en ${kg(H)} m hoog.` },
    zF: {}, graf: { x: [-2, L + 2], y: [-2, top(H * 1.3)] }, wisk: true,
  };
}
// 8. doos uit een stuk karton: V(x) = x(A − 2x)(B − 2x)
function sitDoos() {
  const [A, B] = kies([[30, 20], [24, 16], [40, 30], [20, 16], [36, 24]]);
  const c = [4, -2 * (A + B), A * B, 0], f = vtF(c), E = extrema(f, 0, B / 2), M = E.lokMax[0];
  return {
    fam: 'doos', variant: 'doos', titel: 'Een doos voor het knutselatelier',
    verhaal: `In de kinderopvang maken de kinderen doosjes uit een stuk karton van ${A} cm op ${B} cm. In elke hoek knippen ze een vierkantje met zijde $x$ cm weg. Daarna plooien ze de randen omhoog tot een open doos. De formule geeft het volume $V$ (in cm³):`,
    xBet: 'de zijde van het weggeknipte vierkantje (in cm)', yBet: 'het volume van de doos (in cm³)', e: vtE(c), c,
    f, tex: `V(x) = x(${A} - 2x)(${B} - 2x)`, fn: 'V', x: 'x', xe: 'cm', ye: 'cm³', yn: 'volume (cm³)',
    dom: [0, B / 2], domOpen: true, nul: [0, B / 2, A / 2], max: { x: M.x, y: M.y }, A, B, dec: 1,
    w: { dom: `\\text{praktisch domein } ${ivTex(0, B / 2, false, false)}`, max: `\\text{maximum } ${tg(r1(M.y))} \\text{ voor } x \\approx ${tg(r1(M.x))}` },
    z: { dom: `Het vierkantje moet groter zijn dan 0 cm en kleiner dan ${kg(B / 2)} cm (de helft van de breedte), anders is er geen doos.`, max: `Bij een vierkantje van ongeveer ${kg(r1(M.x))} cm is het volume het grootst: ongeveer ${kg(r1(M.y))} cm³.` },
    zF: {}, graf: { x: [-2, A / 2 + 2], y: [-top(M.y * 0.6), top(M.y * 1.3)] }, wisk: true,
  };
}
// 9. benefietfuif: R(p) = p(N − k·p)
function sitFuif() {
  const [N, k] = kies([[400, 20], [500, 25], [600, 30], [600, 20], [450, 15]]);
  const c = [-k, N, 0], f = vtF(c), pmax = N / (2 * k), Rmax = f(pmax), pnul = N / k;
  return {
    fam: 'fuif', variant: 'fuif', titel: 'Een benefietfuif',
    verhaal: `De leerlingenraad organiseert een fuif voor een goed doel. Bij een ticketprijs van $p$ euro verkopen ze ongeveer ${N} − ${k}p tickets. De formule geeft de opbrengst $R$ (in euro):`,
    xBet: 'de ticketprijs (in euro)', yBet: 'de opbrengst (in euro)', e: vtE(c), c,
    f, tex: `R(p) = p(${N} - ${k}p)`, fn: 'R', x: 'p', xe: 'euro', ye: 'euro', yn: 'opbrengst (euro)',
    dom: [0, pnul], nul: [0, pnul], max: { x: pmax, y: Rmax }, N, k, pmax, Rmax, pnul, dec: 2,
    w: { dom: `\\text{praktisch domein } ${ivTex(0, pnul)}`, max: `\\text{maximum } ${tg(Rmax)} \\text{ voor } p = ${tg(pmax)}`, nul: `\\text{nulpunten: } 0 \\text{ en } ${tg(pnul)}` },
    z: { dom: `De prijs is niet negatief, en vanaf ${kg(pnul)} euro koopt niemand nog een ticket.`, max: `Bij een ticketprijs van ${kg(pmax)} euro is de opbrengst het grootst: ${kg(Rmax)} euro.`,
      nul: `Bij een gratis fuif (0 euro) en bij een prijs van ${kg(pnul)} euro (dan koopt niemand een ticket) is de opbrengst 0 euro.` },
    zF: {}, graf: { x: [-5, pnul + 5], y: [-top(Rmax * 0.5), top(Rmax * 1.2)] }, wisk: true,
  };
}
// 10. bacteriën in het labo: B(t) = −t³ + a t² + b t + c
function sitBacterie() {
  const a = kies([4, 5, 6]), b = kies([20, 30]), c0 = kies([80, 100, 120]), c = [-1, a, b, c0], f = vtF(c);
  const nul = nulpunten(f, 0, 20)[0], M = extrema(f, 0, nul).lokMax[0];
  return {
    fam: 'bacterie', variant: 'bacterie', titel: 'Bacteriën in het labo',
    verhaal: 'In een labo groeit een bacteriecultuur. Op $t = 0$ voegt men een antibioticum toe dat pas na enige tijd werkt. De formule geeft het aantal bacteriën $B$ (in duizendtallen):',
    xBet: 'het aantal uur na het toevoegen', yBet: 'het aantal bacteriën (in duizendtallen)', e: vtE(c), c,
    f, tex: `B(t) = ${vtTex(c, 't')}`, fn: 'B', x: 't', xe: 'uur', ye: 'duizend bacteriën', yn: 'bacteriën (× 1000)',
    dom: [0, nul], nul: [nul], max: { x: M.x, y: M.y }, c0, tnul: nul, dec: 2,
    w: { begin: `B(0) = ${c0}`, dom: `\\text{praktisch domein } ${ivTex(0, r2(nul))}`, max: `\\text{maximum } ${tg(r2(M.y))} \\text{ voor } t \\approx ${tg(r2(M.x))}` },
    z: { begin: `Bij het toevoegen van het antibioticum zijn er ${c0} 000 bacteriën.`, dom: `Vanaf het toevoegen tot er geen bacteriën meer zijn (na ongeveer ${kg(r2(nul))} uur).`,
      max: `Na ongeveer ${kg(r2(M.x))} uur zijn er het meeste bacteriën: ongeveer ${kg(r2(M.y))} duizend.` },
    zF: {}, graf: { x: [-3, Math.ceil(nul) + 3], y: [-top(M.y * 0.6), top(M.y * 1.2)] }, wisk: true,
  };
}
// 11. bezoekers van een openluchtzwembad: Z(T) = −k(T − r1)(T − r2)
function sitZwembad() {
  const q1 = kies([8, 10, 12]), q2 = kies([48, 50, 52]), k = kies([1, 2]), c = [-k, k * (q1 + q2), -k * q1 * q2], f = vtF(c), Tm = (q1 + q2) / 2, Zm = f(Tm);
  return {
    fam: 'zwembad', variant: 'zwembad', titel: 'Bezoekers in het openluchtzwembad',
    verhaal: 'Het aantal bezoekers $Z$ van een openluchtzwembad hangt af van de maximumtemperatuur $T$ (in °C) van die dag:',
    xBet: 'de maximumtemperatuur (in °C)', yBet: 'het aantal bezoekers', e: vtE(c), c,
    f, tex: `Z(T) = ${vtTex(c, 'T')}`, fn: 'Z', x: 'T', xe: '°C', ye: 'bezoekers', yn: 'bezoekers',
    dom: [q1, q2], nul: [q1, q2], max: { x: Tm, y: Zm }, q1, q2, Tm, Zm, dec: 0,
    w: { nul: `\\text{nulpunten: } ${q1} \\text{ en } ${q2}`, max: `\\text{maximum } ${Zm} \\text{ voor } T = ${Tm}` },
    z: { nul: `Bij ${q1} °C en bij ${q2} °C komen er volgens het model geen bezoekers.`, max: `Bij ${Tm} °C komen er het meeste bezoekers: ${Zm}.` },
    zF: {}, graf: { x: [0, 60], y: [-top(Zm * 0.5), top(Zm * 1.2)] }, wisk: true,
  };
}
// 12. aantal inwoners van een gemeente: P(j) = a j² − 2·a·p j + c  (werkbundel 3.3)
function sitInwoners() {
  const a = kies([6, 8, 10]), p = kies([8, 10, 12]), P0 = kies([10000, 12000, 15000]), c = [a, -2 * a * p, P0], f = vtF(c);
  return {
    fam: 'inwoners', variant: 'inwoners', titel: 'Het aantal inwoners van een gemeente',
    verhaal: `Een gemeente beschrijft haar aantal inwoners tussen 2000 en 2025 met een model. Het model past goed bij de gegevens uit die periode. De formule geeft het aantal inwoners $P$:`,
    xBet: 'het aantal jaren na 2000', yBet: 'het aantal inwoners', e: vtE(c), c,
    f, tex: `P(j) = ${vtTex(c, 'j')}`, fn: 'P', x: 'j', xe: 'jaar', ye: 'inwoners', yn: 'inwoners', dom: [0, 25], nul: [], a, p, P0, dec: 0,
    w: {}, z: {}, zF: {}, graf: { x: [0, 25], y: [0, top(Math.max(P0, f(25)) * 1.15)] },
  };
}

const SITUATIES = { conc: sitConc, baby: sitBaby, hart: sitHart, saldo: sitSaldo, griep: sitGriep, spoed: sitSpoed, fontein: sitFontein, doos: sitDoos, fuif: sitFuif, bacterie: sitBacterie, zwembad: sitZwembad, inwoners: sitInwoners };
const kiesSit = (fams) => SITUATIES[kies(fams)]();

// grafiek van een situatie (op het praktisch domein)
function sitGraf(S, opt = {}) {
  const [a, b] = S.dom;
  return rgraf({ x: opt.x || S.graf.x, y: opt.y || S.graf.y, xn: `${S.x} (${S.xe})`, yn: S.yn, functies: [{ f: S.f, e: S.e, van: opt.heel ? undefined : a, tot: opt.heel ? undefined : b }],
    klein: opt.klein, breed: opt.breed, hoog: opt.hoog, punten: opt.punten });
}
const domTekst = (S) => S.domOpen ? `${S.dom[0]} \\lt ${S.x} \\lt ${tg(S.dom[1])}` : `${S.dom[0]} \\leq ${S.x} \\leq ${tg(r2(S.dom[1]))}`;
const legende = (S) => S.xBet ? `<p class="legende">Hierin is $${S.x}$ ${S.xBet} en $${S.fn}$ ${S.yBet}.</p>` : '';
const sitOpgave = (S, extra = '') => `${opgave(S.verhaal)}<p class="midden">${S.geenFormule ? '' : `$${S.tex}$ &nbsp; met &nbsp; `}$${domTekst(S)}$</p>${legende(S)}${extra}`;
const sitKort = (S, extra = '') => `${opgave(S.verhaal)}${S.geenFormule ? '' : `<p class="midden">$${S.tex}$</p>`}${legende(S)}${extra}`; // zonder praktisch domein
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
// =====================================================================
//  GRAFIEKVENSTER — de grafiek staat klaar met de formule al ingevuld.
//  Leerlingen moeten niets overtypen in GeoGebra: bewegen over de grafiek,
//  een functiewaarde berekenen, snijden met een horizontale rechte, het
//  hoogste/laagste punt zoeken, of zelf parameters invullen (deel 10).
//  De vensters werken via één set luisteraars op het document, zodat ze ook
//  werken na elke nieuwe weergave van de pagina (en in bekeken toetsen).
// =====================================================================
const GV_STIJL = `
.gv{border:1px solid #c9d3e3;border-radius:10px;padding:10px 12px;margin:12px 0;background:#f6f9fd;text-align:left}
.gv-kop{font-weight:bold;color:#1c4e8a;margin-bottom:6px;font-size:14px}
.gv-kop span{font-weight:normal;color:#555;font-size:12.5px}
.gv svg{touch-action:none;cursor:crosshair;display:block;margin:0 auto;max-width:100%;height:auto;background:#fff;border-radius:6px;border:1px solid #e3e7ee}
.gv-uit{min-height:1.5em;font-size:14px;color:#1f2733;margin:6px 0 8px;text-align:center}
.gv-tools{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;justify-content:center;font-size:14px}
.gv-tool{display:flex;align-items:center;gap:6px;white-space:nowrap}
.gv-in{width:80px;padding:4px 6px;font-size:14px;border:1px solid #b8c4d6;border-radius:5px}
.gv .gv-knop{padding:5px 10px;font-size:13px;border-radius:6px;border:1px solid #1c4e8a;background:#1c4e8a;color:#fff;cursor:pointer}
.gv .gv-knop.licht{background:#fff;color:#1c4e8a}
.gv select{padding:4px;font-size:14px}
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
const gvLees = (s) => { const t = String(s ?? '').trim().replace(/\s/g, '').replace(',', '.').replace('−', '-'); return t === '' ? NaN : Number(t); };
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
  const xs = sp.xs || nice((X1 - X0) / 7), ys = sp.ys || nice((Y1 - Y0) / 6);
  const num = (v) => gvGetal(+v.toFixed(6), 4);
  let g = '';
  for (let k = Math.ceil(X0 / xs - 1e-9) * xs; k <= X1 + 1e-9; k += xs) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/><text x="${X(k)}" y="${Y(Y0) + 14}" font-size="10" text-anchor="middle" fill="#555">${num(k)}</text>`;
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
  return `<!--gv--><div class="gv" data-gv='${gvAttr(JSON.stringify(sp))}'>
    <div class="gv-kop">📈 Grafiekvenster <span>· de formule staat er al in${sp.a != null && !sp.geenDomein ? ' · blauw = praktisch domein' : ''}</span></div>
    ${gvSvg(sp, fs)}${ZOOM_KNOPPEN('gv')}${leg}<div class="gv-uit">${hulp}</div><div class="gv-tools">${kies}${tools.join('')}</div><div class="gv-res"></div></div><!--/gv-->`;
}
// ---------- de luisteraars (één keer per pagina)
(() => {
  if (typeof document === 'undefined' || window.__gvKlaar) return;
  window.__gvKlaar = true;
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
    const root = svg.closest('.gv'), sp = spec(root); if (!sp || !(sp.t || 'vfsm').includes('v')) return;
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
      if (!isFinite(y)) { laag(root, ''); return res(root, `Voor ${sp.xv} = ${gvGetal(x, 4)} bestaat ${n} niet: je deelt door 0.`); }
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
    if (root.classList.contains('gv')) { const sp = spec(root); if (!root.dataset.gv0) root.dataset.gv0 = JSON.stringify({ x: sp.X, y: sp.Y }); return { nu: { x: sp.X, y: sp.Y }, begin: JSON.parse(root.dataset.gv0) }; }
    const sp = rgSpec(root); const begin = { x: sp.x, y: sp.y };
    return { nu: root.dataset.beeld ? JSON.parse(root.dataset.beeld) : begin, begin };
  }
  function tekenBeeld(root, b) {
    if (root.classList.contains('gv')) {
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
    if (root.classList.contains('gv')) { laag(root, ''); res(root, ''); }
  }
  let sleep = null; // { root, x, y, beeld, bewogen }
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-zoom]'); if (!b) return; e.preventDefault(); e.stopPropagation(); const root = b.closest('.gv, .rg'); if (root) zoom(root, b.dataset.zoom); }, true);
  document.addEventListener('pointerdown', (e) => {
    const s = e.target.closest && e.target.closest('.gv svg, .rg svg'); if (!s) return;
    const root = s.closest('.gv, .rg'), r = s.getBoundingClientRect(), vb = s.viewBox.baseVal;
    // schaal nu vastleggen: tijdens het slepen wordt de svg telkens vervangen
    sleep = { root, sx: vb.width / r.width, sy: vb.height / r.height, x: e.clientX, y: e.clientY, beeld: beeld(root).nu, bewogen: false };
  });
  document.addEventListener('pointermove', (e) => {
    if (!sleep || !(e.buttons & 1)) { sleep = sleep && (e.buttons & 1) ? sleep : null; return; }
    const dx = e.clientX - sleep.x, dy = e.clientY - sleep.y;
    if (!sleep.bewogen && Math.hypot(dx, dy) < 5) return;
    sleep.bewogen = true; e.preventDefault();
    const gv = sleep.root.classList.contains('gv');
    const sp = gv ? null : rgSpec(sleep.root);
    const B = gv ? GV_M.B : (sp.breed || 360), H = gv ? GV_M.H : (sp.hoog || 230);
    const b = sleep.beeld, ex = dx * sleep.sx / B * (b.x[1] - b.x[0]), ey = dy * sleep.sy / H * (b.y[1] - b.y[0]);
    if (!isFinite(ex) || !isFinite(ey)) return;
    if (sleep.wacht) return; sleep.wacht = true;
    requestAnimationFrame(() => { if (!sleep) return; sleep.wacht = false; tekenBeeld(sleep.root, { x: [b.x[0] - ex, b.x[1] - ex], y: [b.y[0] + ey, b.y[1] + ey] }); if (gv) laag(sleep.root, ''); });
  }, { passive: false });
  document.addEventListener('pointerup', () => { sleep = null; });
  document.addEventListener('pointercancel', () => { sleep = null; });

  document.addEventListener('pointermove', (e) => { if (sleep && sleep.bewogen) return; const s = e.target.closest && e.target.closest('.gv svg'); if (s) volg(s, e); });
  document.addEventListener('pointerdown', (e) => { const s = e.target.closest && e.target.closest('.gv svg'); if (s) volg(s, e); });
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('.gv [data-gv-actie]'); if (!b) return; e.preventDefault(); actie(b.closest('.gv'), b.dataset.gvActie); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return; const i = e.target.closest && e.target.closest('.gv input'); if (!i) return;
    e.preventDefault(); e.stopPropagation(); if (i.dataset.gvEnter) actie(i.closest('.gv'), i.dataset.gvEnter);
  }, true);
  document.addEventListener('input', (e) => { const i = e.target.closest && e.target.closest('.gv .gv-par'); if (i && isFinite(gvLees(i.value))) actie(i.closest('.gv'), 't'); });
  document.addEventListener('change', (e) => { const s = e.target.closest && e.target.closest('.gv .gv-kies'); if (s) { const root = s.closest('.gv'); laag(root, ''); res(root, ''); } });
})();

// ---------- moeilijke woorden: onderlijnd, met uitleg bij aanraken of muis erover
const WOORDEN = [
  ['concentratie', 'Hoeveel van een stof er in een bepaalde hoeveelheid vloeistof zit (bv. mg per liter).'],
  ['pijnstiller', 'Een geneesmiddel tegen pijn.'],
  ['geneesmiddel', 'Een medicijn.'],
  ['inname', 'Het innemen (slikken) van een geneesmiddel.'],
  ['uitgewerkt', 'Het geneesmiddel werkt niet meer.'],
  ['verpleegkundige', 'Iemand die zieke mensen verzorgt.'],
  ['apotheker', 'Iemand die geneesmiddelen maakt en verkoopt.'],
  ['spoeddienst', 'De afdeling van het ziekenhuis voor dringende hulp.'],
  ['wachtzaal', 'De zaal waar je wacht tot je aan de beurt bent.'],
  ['pasgeboren', 'Net geboren.'],
  ['geboortegewicht', 'Hoeveel de baby woog bij de geboorte.'],
  ['vroedvrouw', 'Iemand die helpt bij een bevalling en de eerste dagen voor moeder en baby zorgt.'],
  ['hartslag', 'Hoe vaak je hart per minuut klopt.'],
  ['looptest', 'Een test waarbij je een tijd loopt (bv. in de les LO).'],
  ['jeugdbeweging', 'Een vereniging waar kinderen en jongeren samen spelen en op kamp gaan.'],
  ['saldo', 'Hoeveel geld er op de rekening staat.'],
  ['in het rood', 'Er staat minder dan 0 euro op de rekening: je hebt een schuld bij de bank.'],
  ['schuld', 'Geld dat je nog moet betalen.'],
  ['griepgolf', 'Een periode waarin veel mensen tegelijk griep krijgen.'],
  ['scholencampus', 'Een grote plaats met verschillende scholen samen.'],
  ['woonzorgcentrum', 'Een huis waar oudere mensen wonen en zorg krijgen.'],
  ['fontein', 'Een toestel dat water in de lucht spuit.'],
  ['spuitmond', 'De opening waar het water uit komt.'],
  ['kinderopvang', 'Een plaats waar jonge kinderen overdag verzorgd worden.'],
  ['knutselatelier', 'Een lokaal waar kinderen dingen maken met papier, karton, lijm …'],
  ['karton', 'Dik, stevig papier.'],
  ['volume', 'Hoeveel er in iets past (bv. in cm³).'],
  ['leerlingenraad', 'Een groep leerlingen die de andere leerlingen vertegenwoordigt.'],
  ['benefietfuif', 'Een feest waarvan de winst naar een goed doel gaat.'],
  ['goed doel', 'Een organisatie die mensen of dieren helpt; het geld gaat naar hen.'],
  ['opbrengst', 'Het geld dat je ontvangt (bv. uit de verkoop van tickets).'],
  ['bacteriecultuur', 'Een groep bacteriën die in een labo gekweekt wordt.'],
  ['bacteriën', 'Heel kleine levende wezens; sommige maken je ziek.'],
  ['antibioticum', 'Een geneesmiddel dat bacteriën doodt.'],
  ['openluchtzwembad', 'Een zwembad buiten, zonder dak.'],
  ['maximumtemperatuur', 'De hoogste temperatuur van de dag.'],
  ['inwoners', 'De mensen die in een gemeente wonen.'],
  ['65-plussers', 'Mensen van 65 jaar of ouder.'],
  ['vergrijst', 'Er komen steeds meer oudere mensen bij.'],
  ['opendeurdag', 'Een dag waarop iedereen een gebouw mag komen bekijken.'],
  ['zorginstelling', 'Een plaats waar mensen zorg krijgen, zoals een ziekenhuis of een woonzorgcentrum.'],
  ['revalidatie', 'Oefenen om na een ziekte of operatie weer sterker te worden.'],
  ['diëtist', 'Iemand die advies geeft over gezond eten.'],
  ['patiëntendossier', 'Het dossier met alle informatie over een patiënt.'],
  ['tentoonstelling', 'Een plaats waar je dingen kan bekijken, zoals in een museum.'],
  ['parameter', 'Een letter in een formule die je zelf een waarde geeft (bv. a of b).'],
  ['praktisch domein', 'De waarden van x die in de echte situatie mogelijk zijn.'],
  ['wiskundig domein', 'Alle getallen die je in de formule kan invullen.'],
  ['beginwaarde', 'De waarde bij de start (als x = 0).'],
  ['extrapoleren', 'Een voorspelling maken buiten de gemeten waarden.'],
  ['interpoleren', 'Een voorspelling maken tussen de gemeten waarden.'],
  ['model', 'Een formule die een echte situatie beschrijft.'],
  ['grootheid', 'Iets wat je kan meten of tellen, zoals een temperatuur, een tijd of een aantal.'],
  ['gemiddeld', 'Alles samen gedeeld door het aantal.'],
  ['lokaal maximum', 'Een top van de grafiek: de grootste waarde in de buurt.'],
  ['lokaal minimum', 'Een dal van de grafiek: de kleinste waarde in de buurt.'],
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

// grafiekvenster bij een situatie (praktisch domein in kleur)
function sitVenster(S, opt = {}) {
  const [a, b] = S.dom;
  return venster({ fs: [{ e: S.e, n: S.fn }], X: opt.X || S.graf.x, Y: opt.Y || S.graf.y, a, b, ao: !!S.domOpen, bo: !!S.domOpen, losse: false,
    xv: S.x, xe: S.xe, ye: S.ye, xn: `${S.x} (${S.xe})`, yn: S.yn, t: opt.t || 'vfsm', buiten: opt.buiten });
}

// ---------- vaste theorieblokken
const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraken in dit leerpad</div>
  <ul><li>Je hebt <b>geen GeoGebra</b> nodig. Bij de vragen staat een <b>grafiekvenster</b> met de formule al ingevuld. Je moet dus niets overtypen. Je rekenmachine mag ook.</li>
  <li>Een woord met een <span style="border-bottom:2px dotted #e8772e">oranje stippellijn</span> eronder is een moeilijk woord. Raak het aan (of ga erover met de muis): dan zie je wat het betekent.</li>
  <li>Bij elke rekenvraag staat <b>op hoeveel decimalen je afrondt</b>. Komt de uitkomst exact uit (bv. 75 of 2,5), dan schrijf je ze gewoon zo.</li>
  <li>Kommagetallen typ je met een komma: <code>38,1</code>.</li>
  <li>Een interval typ je zoals in de werkbundel, met een puntkomma: <code>[0 ; 12]</code> of <code>]0 ; 10[</code> (een komma tussen de grenzen mag ook).</li>
  <li>Bij meerkeuzevragen kies je de zin die het best past bij de situatie.</li></ul></div>`;
const GEOGEBRA = `<div class="kader eig"><div class="kader-titel">Zo werk je met het grafiekvenster</div>
  <ul><li><b>Beweeg</b> over de grafiek (of tik erop): je ziet $x$ en de functiewaarde.</li>
  <li><b>Bereken</b>: typ een $x$-waarde en klik op <i>Bereken</i>. Je krijgt bv. $C(5)$.</li>
  <li><b>Snijpunt</b>: typ een $y$-waarde en klik op <i>Snijpunt</i>. Je krijgt waar bv. $C(t) = 10$. Voor een nulpunt typ je $y = 0$.</li>
  <li><b>Hoogste en laagste punt</b> op het praktisch domein: één klik.</li>
  <li>Met <b>＋ Inzoomen</b> en <b>− Uitzoomen</b> zie je meer of minder van de grafiek; sleep om te verschuiven.</li>
  <li>Blauw is het praktisch domein. Grijs en gestreept is de rest van de grafiek: die hoort niet bij de situatie.</li></ul></div>`;
const WOORDENLIJST = `<table class="tabel"><tr><th>Kenmerk</th><th>Wiskundig</th><th>In de context</th></tr>
  <tr><td>Domein</td><td>alle $x$-waarden waarvoor de functie bestaat</td><td>alle waarden van de onafhankelijke veranderlijke (vaak de tijd) die we bekijken</td></tr>
  <tr><td>Bereik</td><td>alle $y$-waarden (functiewaarden) die de functie aanneemt</td><td>alle uitkomsten die in de situatie voorkomen: van de kleinste tot de grootste</td></tr>
  <tr><td>Snijpunt met de $y$-as</td><td>het punt $(0 ; f(0))$</td><td>de <b>beginwaarde</b>: de toestand bij de start</td></tr>
  <tr><td>Nulpunt</td><td>een $x$-waarde waarvoor $f(x) = 0$</td><td>het moment (of de waarde) waarop de grootheid nul is</td></tr>
  <tr><td>Tekenschema</td><td>waar is $f(x)$ positief, nul of negatief?</td><td>waar is de grootheid positief (bv. winst) of negatief (bv. schuld, tekort)?</td></tr>
  <tr><td>Verloopschema</td><td>waar is $f$ stijgend, dalend of constant?</td><td>wanneer neemt de grootheid toe, af of blijft ze gelijk?</td></tr>
  <tr><td>Maximum / minimum</td><td>de grootste / kleinste functiewaarde en de $x$-waarde waar die bereikt wordt</td><td>de grootste / kleinste waarde van de grootheid én wanneer (of waar) dat gebeurt</td></tr></table>`;
const LET_OP = `<div class="kader eig"><div class="kader-titel">Let op!</div>
  <ul><li>Een maximum is een <b>y-waarde</b>: de grootste functiewaarde. De bijbehorende <b>x-waarde</b> zegt wanneer of waar dat maximum bereikt wordt. Vermeld in een context altijd allebei, met de juiste eenheden.</li>
  <li>Een <b>lokaal maximum</b> is de grootste waarde in de buurt (een "top" van de grafiek). Het <b>absolute maximum</b> is de grootste waarde op het hele domein. Dat kan ook aan de rand van het domein liggen!</li></ul></div>`;
