// Programma 'veeltermfuncties-context' — automatisch samengevoegd uit bron/veeltermfuncties-context/ (niet rechtstreeks bewerken)
(() => {
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
// ---------- hoe zeg je "bij x" en "de grootheid" in een situatie?
function xZin(S, x) {
  const t = kg(x);
  return { conc: `${t} uur na inname`, baby: `op dag ${t}`, hart: `na ${t} minuten`, saldo: `${t} maanden na 1 september`, griep: `na ${t} weken`, spoed: `om ${klok(x)}`,
    fontein: `op ${t} m van de spuitmond`, doos: `bij een vierkantje van ${t} cm`, fuif: `bij een ticketprijs van ${t} euro`, bacterie: `${t} uur na het toevoegen`,
    zwembad: `bij ${t} °C`, inwoners: `in ${2000 + x}` }[S.fam];
}
function yWat(S) {
  return { conc: 'de concentratie', baby: 'het gewicht van de baby', hart: 'de hartslag', saldo: 'het saldo', griep: 'het aantal zieke leerlingen', spoed: 'het aantal patiënten in de wachtzaal',
    fontein: 'de hoogte van de straal', doos: 'het volume van de doos', fuif: 'de opbrengst', bacterie: 'het aantal bacteriën (in duizendtallen)', zwembad: 'het aantal bezoekers', inwoners: 'het aantal inwoners' }[S.fam];
}
const tx = (s) => '@@' + s; // gewone tekst in de uitleg (wordt HTML, zodat lange zinnen afbreken)
const naTex = (S) => `\\text{ ${S.ye}}`;

const NAMEN = { begin: 'de beginwaarde (het snijpunt met de verticale as)', nul: 'de nulpunten', max: 'het maximum', min: 'het minimum', dom: 'het domein',
  bereik: 'het bereik', verloop: 'het verloopschema (stijgen en dalen)', teken: 'het tekenschema (positief of negatief)', dal: 'een lokaal minimum', top1: 'een lokaal maximum' };

// ===================================================================
//  0 · WOORDENLIJST: VAN WISKUNDETAAL NAAR CONTEXTTAAL
// ===================================================================
const ALLE = ['conc', 'baby', 'hart', 'saldo', 'griep', 'spoed'];
const sleutels = (S) => Object.keys(S.w).filter(k => S.z[k]);
const D1 = {
  nr: 1, titel: 'Woordenlijst: van wiskundetaal naar contexttaal', kort: 'Wat betekent een kenmerk in een echte situatie?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Kenmerken in context</div>
      <p>Je kan al heel wat kenmerken van een functie aflezen op een grafiek: het domein, het bereik, de nulpunten, het tekenschema en het verloopschema.
      In een situatie moet je diezelfde kenmerken uitleggen in de <b>taal van die situatie</b>: een geneesmiddel in het bloed, de drukte op een spoeddienst, het gewicht van een baby …</p>
      <p>Een nulpunt is dan niet zomaar "een getal waarvoor $f(x) = 0$", maar bijvoorbeeld "het moment waarop het geneesmiddel volledig uitgewerkt is".</p>${WOORDENLIJST}</div>
    ${LET_OP}
    <div class="kader werk"><div class="kader-titel">Uitgewerkt voorbeeld: een griepgolf</div>
      <p>Op een grote scholencampus breekt een griepgolf uit. Het aantal zieke leerlingen $Z$, $w$ weken na het begin van de griepgolf, is $Z(w) = -w^3 + 12w^2$ met $0 \\leq w \\leq 12$.</p>
      ${figuur(rgraf({ x: [0, 12], y: [0, 300], xs: 1, ys: 50, xn: 'w (weken)', yn: 'zieke leerlingen', functies: [{ f: (w) => -(w ** 3) + 12 * w * w, e: '-(x**3)+12*x**2' }], punten: [{ x: 8, y: 256 }] }))}
      <table class="tabel"><tr><th>Kenmerk</th><th>Wiskundig</th><th>In de context</th></tr>
      <tr><td>Domein</td><td>$\\text{dom } Z = [0 \\,;\\, 12]$</td><td>We volgen de griepgolf gedurende 12 weken.</td></tr>
      <tr><td>Bereik</td><td>$\\text{ber } Z = [0 \\,;\\, 256]$</td><td>Het aantal zieke leerlingen schommelt tussen 0 en 256.</td></tr>
      <tr><td>Beginwaarde</td><td>$Z(0) = 0$</td><td>Bij het begin van de griepgolf is nog niemand ziek.</td></tr>
      <tr><td>Nulpunten</td><td>$0$ en $12$</td><td>Bij de start (week 0) en na 12 weken is niemand ziek: de griepgolf is voorbij.</td></tr>
      <tr><td>Maximum</td><td>$256$ voor $w = 8$</td><td>In week 8 zijn er het meeste zieken: 256 leerlingen.</td></tr>
      <tr><td>Verloop</td><td>stijgend op $[0 \\,;\\, 8]$, dalend op $[8 \\,;\\, 12]$</td><td>De eerste 8 weken neemt het aantal zieken toe, daarna neemt het af.</td></tr></table>
      ${schema('w', 'Z(w)', [{ x: '0', y: '0' }, { y: '+' }, { x: '12', y: '0' }])}
      ${schema('w', 'Z(w)', [{ x: '0', y: '0' }, { y: PIJL_OP }, { x: '8', y: '256 max' }, { y: PIJL_NEER }, { x: '12', y: '0' }])}
      <p><b>Het verhaal van de grafiek.</b> Bij het begin van de griepgolf is nog geen enkele leerling ziek. Daarna breidt de griep zich uit: het aantal zieke leerlingen neemt eerst traag toe, daarna steeds sneller.
      In week 8 bereikt de griepgolf haar hoogtepunt met 256 zieke leerlingen. Vanaf dan neemt het aantal zieken af, en vanaf week 10 zelfs heel snel. Na 12 weken is de griepgolf voorbij en is niemand meer ziek.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Pijnstiller: $C(t) = 0{,}05t^3 - 1{,}2t^2 + 7{,}2t$ met $0 \\leq t \\leq 12$ ($C$ in mg/l, $t$ in uur na inname om 8 u).')}<p>Wiskundig: de nulpunten zijn $0$ en $12$. Wat betekent dat?</p>`,
      stappen: ['\\text{Bij de inname (t = 0) zit er nog geen pijnstiller in het bloed.}', '\\text{Na 12 uur (om 20 u) is de pijnstiller volledig uitgewerkt: de concentratie is weer 0.}'] },
    { html: `${opgave('Baby: $G(d) = 6d^2 - 60d + 3500$ met $0 \\leq d \\leq 14$ ($G$ in gram, $d$ in dagen na de geboorte).')}<p>Wiskundig: minimum $3350$ voor $d = 5$. Wat betekent dat?</p>`,
      stappen: ['\\text{Op dag 5 weegt de baby het minst: 3350 gram.}', '\\text{Let op: 3350 is het gewicht (y-waarde), 5 is de dag (x-waarde).}'] },
  ],
  soorten: {
    betekenis: { naam: 'Wiskundetaal → contexttaal', gen() {
      const S = kiesSit(ALLE), k = kies(sleutels(S)), juist = S.z[k];
      const fout = schud(sleutels(S).filter(x => x !== k).map(x => S.z[x])); if (S.zF[k]) fout.unshift(S.zF[k]);
      return { soort: 'betekenis', opdracht: 'Kies de zin die past bij de situatie.', html: `${sitOpgave(S)}<p>In wiskundetaal staat er: $${S.w[k]}$</p>${vraag('Wat betekent dat in de situatie?')}`, sleutel: S.fam + k + juist,
        rapport: `${S.titel}: ${W.platteTekst(S.w[k])}`, antw: zinnen(juist, fout), uitleg: [`\\text{${NAMEN[k]}: } ${S.w[k]}`, tx(juist)] };
    } },
    kenmerk: { naam: 'Welk kenmerk?', gen() {
      const S = kiesSit(ALLE), k = kies(sleutels(S));
      const fout = schud(Object.keys(NAMEN).filter(x => x !== k && !(['max', 'top1'].includes(k) && ['max', 'top1'].includes(x)) && !(['min', 'dal'].includes(k) && ['min', 'dal'].includes(x)))).map(x => NAMEN[x]);
      return { soort: 'kenmerk', opdracht: 'Kies het kenmerk.', html: `${sitOpgave(S)}<p>Iemand schrijft over deze situatie:</p><p class="midden"><i>"${S.z[k]}"</i></p>${vraag('Over welk kenmerk van de functie gaat deze zin?')}`, sleutel: S.fam + k + S.z[k],
        rapport: `${S.titel}: "${S.z[k]}"`, antw: zinnen(NAMEN[k], fout), uitleg: [`\\text{Het gaat over ${NAMEN[k]}: } ${S.w[k]}`] };
    } },
    naarWiskunde: { naam: 'Contexttaal → wiskundetaal', gen() {
      const S = kiesSit(ALLE), ks = sleutels(S), k = kies(ks);
      const opties = schud([k, ...schud(ks.filter(x => x !== k)).slice(0, 3)]);
      return { soort: 'naarWiskunde', opdracht: 'Kies de wiskundige zin.', html: `${sitOpgave(S)}<p>Iemand schrijft over deze situatie:</p><p class="midden"><i>"${S.z[k]}"</i></p>${vraag('Welke wiskundige zin zegt hetzelfde?')}`, sleutel: S.fam + k + S.z[k],
        rapport: `${S.titel}: "${S.z[k]}"`, antw: { soort: 'keuze', opties: opties.map((x, i) => ({ k: String(i), l: S.w[x] })), juist: String(opties.indexOf(k)) },
        uitleg: [`${S.w[k]} \\quad (\\text{${NAMEN[k]}})`] };
    } },
  },
  oefenMix: [['betekenis', 2], ['kenmerk', 1], ['naarWiskunde', 1]],
  test: [['betekenis', 4], ['kenmerk', 3], ['naarWiskunde', 3]], testSchudden: true,
};

// ===================================================================
//  1 · KENMERKEN AFLEZEN EN INTERPRETEREN IN CONTEXT
// ===================================================================
function vraagWaarde() {
  const S = kiesSit(['conc', 'baby', 'hart', 'saldo', 'griep', 'spoed']), [a, b] = S.dom, d = S.dec;
  let x; do { x = rnd(Math.ceil(a) + (S.fam === 'spoed' ? 0 : 1), Math.floor(b) - 1); } while (d < 2 && W.grensgeval(S.f(x), d));
  const y = S.f(x);
  return { soort: 'waarde', opdracht: 'Tip: typ de waarde bij "Bereken" in het grafiekvenster (of gebruik je rekenmachine).', html: `${sitOpgave(S)}${vraag(`Hoe groot is ${yWat(S)} ${xZin(S, x)}?`)}${sitVenster(S, { t: 'vf' })}`, sleutel: S.e + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: getal(y, { dec: d, voor: `${S.fn}(${tg(x)}) =`, na: naTex(S) }),
    uitleg: [`${S.fn}(${tg(x)}) \\approx ${tg(W.rond(y, d))}${naTex(S)}`, tx(`${zin(xZin(S, x))} is ${yWat(S)} ongeveer ${kg(W.rond(y, d))} ${S.ye}.`)] };
}
function vraagHoeLang() {
  const S = kiesSit(['conc', 'hart', 'griep', 'baby']);
  let c, vr, antw, uitl;
  if (S.fam === 'baby') {
    vr = `Vroedvrouwen zeggen: "Na ongeveer tien dagen zit een baby terug op zijn geboortegewicht." Op welke dag zit deze baby terug op ${S.G0} gram?`;
    antw = getal(S.terug, { voor: 'd =', na: '\\text{ dagen}' });
    uitl = [`\\text{Snijpunt met } y = ${S.G0}: d = 0 \\text{ en } d = ${S.terug}`, tx(`Op dag ${S.terug} weegt de baby opnieuw ${S.G0} gram.`)];
  } else {
    const [a, b] = S.dom, top = S.max.y;
    if (S.fam === 'conc') c = kies([0.5, 0.6, 0.7, 0.75].map(p => r0(p * top)).filter(v => v > 0));
    if (S.fam === 'hart') c = r0((S.H0 + S.Hmax) / 2 + kies([0, 5, 10]));
    if (S.fam === 'griep') c = Math.round(kies([0.5, 0.6, 0.75]) * top / 10) * 10;
    const xs = nulpunten(S.f, a, b, c), duur = xs[1] - xs[0];
    vr = { conc: () => `${zin(S.ding)} werkt pas als de concentratie minstens ${c} mg/l is. Hoe lang werkt ${S.ding}?`, hart: () => `Hoe lang is de hartslag van ${S.naam} hoger dan ${c} slagen per minuut?`,
      griep: () => `Hoeveel weken zijn er meer dan ${c} leerlingen ziek?` }[S.fam]();
    antw = getal(duur, { dec: 1, na: `\\text{ ${S.xe}}` });
    uitl = [`\\text{Snijpunt met } y = ${c}: \\; ${S.x} \\approx ${tg(r2(xs[0]))} \\text{ en } ${S.x} \\approx ${tg(r2(xs[1]))}`, `${tg(r2(xs[1]))} - ${tg(r2(xs[0]))} \\approx ${tg(r1(duur))} \\text{ ${S.xe}}`];
    if (S.fam === 'conc') uitl.push(tx(`${zin(S.ding)} werkt van ongeveer ${klok(S.uur + xs[0])} tot ${klok(S.uur + xs[1])}.`));
  }
  return { soort: 'hoelang', opdracht: 'Tip: typ de waarde bij "Snijpunt" in het grafiekvenster (y = …).', html: `${sitOpgave(S)}${vraag(vr)}${sitVenster(S, { t: 'vs' })}`, sleutel: S.e + c,
    rapport: `${S.titel}: ${W.platteTekst(vr)}`, antw, uitleg: uitl };
}
function vraagMax() {
  const S = kiesSit(['conc', 'hart', 'griep']);
  const vr = { conc: 'Wanneer is de concentratie het hoogst, en hoe hoog is ze dan?', hart: `Wanneer is de hartslag van ${S.naam} het hoogst, en hoeveel bedraagt hij dan?`, griep: 'Wanneer zijn er het meeste zieke leerlingen, en hoeveel?' }[S.fam];
  const d = [[`\\text{Wanneer? } ${S.x} =`, getal(S.max.x, { na: `\\text{ ${S.xe}}` })], [`\\text{Hoeveel? } ${S.fn} =`, getal(S.max.y, { dec: S.dec, na: naTex(S) })]];
  if (S.fam === 'conc') d.push(['\\text{Om hoe laat is dat? Om}', getal(S.uur + S.tm, { na: '\\text{ u}' })]);
  return { soort: 'max', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag(vr)}${sitVenster(S, { t: 'vm' })}`), sleutel: S.e,
    rapport: `${S.titel}: maximum`, antw: delen(...d), uitleg: [`\\text{Hoogste punt: } (${tg(S.max.x)} \\,;\\, ${tg(S.max.y)})`, tx(S.z.max)] };
}
function vraagMinBaby() {
  const S = sitBaby(), verlies = S.G0 - S.q, pct = verlies / S.G0 * 100;
  return { soort: 'min', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag('Op welke dag weegt de baby het minst? Hoeveel gram verliest de baby in totaal? Hoeveel procent van het geboortegewicht is dat?')}${sitVenster(S, { t: 'vfm' })}`), sleutel: S.e,
    rapport: `${S.titel}: minimum en verlies`, antw: delen(['\\text{dag: } d =', getal(S.p)], ['\\text{verlies:}', getal(verlies, { na: '\\text{ gram}' })], ['\\text{in procent:}', getal(pct, { dec: 1, na: '\\,\\%' })]),
    uitleg: [`\\text{Laagste punt: } (${S.p} \\,;\\, ${S.q})`, `${S.G0} - ${S.q} = ${verlies} \\text{ gram}`,
      `\\text{verhoudingstabel: } ${S.G0} \\text{ g} \\to 100\\,\\% \\quad\\Rightarrow\\quad 1 \\text{ g} \\to \\dfrac{100}{${S.G0}}\\,\\% \\quad\\Rightarrow\\quad ${verlies} \\text{ g} \\to \\dfrac{${verlies} \\cdot 100}{${S.G0}} \\approx ${tg(r1(pct))}\\,\\%`] };
}
function vraagRood() {
  const S = sitSaldo();
  const fout = [S.zF.nul, `Op 1 ${MAANDEN[S.q1]} en op 1 ${MAANDEN[S.q2]} heeft de jeugdbeweging het meeste geld.`, `Van 1 ${MAANDEN[S.q1]} tot 1 ${MAANDEN[S.q2]} heeft de jeugdbeweging het meeste geld.`];
  return { soort: 'rood', opdracht: 'Tip: de nulpunten vind je met "Snijpunt" en y = 0.', html: sitOpgave(S, `${vraag('Wat zijn de nulpunten van S? In welke periode staat de rekening in het rood?')}${sitVenster(S, { t: 'vs' })}`), sleutel: S.e,
    rapport: `${S.titel}: nulpunten en tekenschema`, antw: delen(['\\text{eerste nulpunt: } m =', getal(S.q1)], ['\\text{tweede nulpunt: } m =', getal(S.q2)], ['\\text{betekenis:}', zinnen(S.z.teken, [S.zF.teken, ...fout])]),
    uitleg: [`S(${S.q1}) = 0 \\text{ en } S(${S.q2}) = 0`, `\\text{tekenschema: } S(m) < 0 \\text{ op } {]}${S.q1} \\,;\\, ${S.q2}{[}`, tx(S.z.teken)] };
}
function vraagSaldoMax() {
  const S = sitSaldo();
  const vr = kies(['schuld', 'meeste']);
  if (vr === 'schuld') return { soort: 'saldomax', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag('Hoe groot is de grootste schuld (in euro)? Rond af op 0,1.')}${sitVenster(S, { t: 'vm' })}`), sleutel: S.e + vr,
    rapport: `${S.titel}: grootste schuld`, antw: getal(-S.min.y, { dec: 1, na: '\\text{ euro}' }), uitleg: [`\\text{Laagste punt: } (${tg(r1(S.min.x))} \\,;\\, ${tg(r1(S.min.y))})`, tx(`De grootste schuld is ongeveer ${kg(r1(-S.min.y))} euro.`)] };
  const juist = `Op 1 september: dan staat er ${S.S0} euro op de rekening. De top van de grafiek op het einde van het jaar is lager (ongeveer ${kg(r0(Math.max(S.lokMax.y, S.S12)))} euro).`;
  return { soort: 'saldomax', opdracht: 'Let goed op: het absolute maximum kan ook aan de rand van het domein liggen.', html: sitOpgave(S, `${vraag('Wanneer heeft de jeugdbeweging het meeste geld op de rekening tijdens dit werkjaar?')}${sitVenster(S, { t: 'vfm' })}`), sleutel: S.e + vr,
    rapport: `${S.titel}: absoluut maximum`, antw: zinnen(juist, [`Ongeveer ${kg(r1(S.lokMax.x))} maanden na 1 september: daar ligt de top van de grafiek.`, `Op 1 ${MAANDEN[S.q2]}: dan is de schuld afbetaald.`, `Na 12 maanden: dan is het werkjaar voorbij.`]),
    uitleg: [`S(0) = ${S.S0} \\text{ is groter dan het lokaal maximum } \\approx ${tg(r0(S.lokMax.y))}`, tx('Het absolute maximum ligt hier aan de rand van het domein: op 1 september.')] };
}
function vraagSpoed() {
  const S = sitSpoed(), s = kies(['drukst', 'dal']);
  if (s === 'drukst') return { soort: 'spoed', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag('Om hoe laat is het het drukst in de wachtzaal? Hoeveel patiënten zitten er dan?')}${sitVenster(S, { t: 'vm' })}`), sleutel: S.e + s,
    rapport: `${S.titel}: drukste moment`, antw: delen(['\\text{om}', getal(S.t3, { na: '\\text{ u}' })], ['\\text{aantal patiënten:}', getal(S.max.y)]), uitleg: [`\\text{Hoogste punt: } (${S.t3} \\,;\\, ${S.max.y})`, tx(S.z.max)] };
  const minRand = Math.min(S.W6, S.W22), rustiger = minRand < S.dal.y;
  const juist = rustiger ? `Neen: om ${S.W6 < S.W22 ? '6 u' : '22 u'} zitten er minder patiënten (ongeveer ${kg(r0(minRand))}). Om ${S.t2} u is het enkel rustiger dan de uren ervoor en erna.` : `Ja: nergens op de dag zitten er minder patiënten dan om ${S.t2} u.`;
  const fout = rustiger ? [`Ja: een dal van de grafiek is altijd het rustigste moment.`, `Neen: om ${S.t3} u zitten er minder patiënten.`, `Ja: om ${S.t2} u zitten er 0 patiënten.`]
    : [`Neen: om 6 u zitten er minder patiënten.`, `Neen: om ${S.t3} u zitten er minder patiënten.`, `Ja: om ${S.t2} u zitten er 0 patiënten.`];
  return { soort: 'spoed', opdracht: 'Let op: een lokaal minimum is niet altijd de kleinste waarde van de hele dag.', html: sitOpgave(S, `${vraag(`Om ${S.t2} u heeft de grafiek een "dal". Is dat het rustigste moment van de dag?`)}${sitVenster(S, { t: 'vfm' })}`), sleutel: S.e + s,
    rapport: `${S.titel}: lokaal minimum`, antw: zinnen(juist, fout), uitleg: [`W(${S.t2}) = ${S.dal.y}, \\quad W(6) \\approx ${tg(r0(S.W6))}, \\quad W(22) \\approx ${tg(r0(S.W22))}`, tx(juist)] };
}
function vraagGemVerandering() {
  const S = kies([sitBaby, sitHart])();
  let a, b, vr, eenh;
  if (S.fam === 'baby') { a = 10; b = 14; vr = 'Hoeveel gram komt de baby gemiddeld per dag bij tussen dag 10 en dag 14?'; eenh = 'gram per dag'; }
  else { a = kies([0, 2, 4]); b = a + 2; vr = `Hoeveel slagen per minuut stijgt de hartslag gemiddeld per minuut tussen minuut ${a} en minuut ${b}?`; eenh = 'slagen per minuut per minuut'; }
  const g = (S.f(b) - S.f(a)) / (b - a);
  return { soort: 'gemV', opdracht: 'Tip: bereken eerst de twee functiewaarden. Deel het verschil door de lengte van het interval.', html: `${sitOpgave(S)}${vraag(vr)}${sitVenster(S, { t: 'vf' })}`, sleutel: S.e + a,
    rapport: `${S.titel}: gemiddelde verandering [${a}, ${b}]`, antw: getal(g, { dec: 1, na: `\\text{ ${eenh}}` }),
    uitleg: [`${S.fn}(${a}) = ${tg(r2(S.f(a)))}, \\quad ${S.fn}(${b}) = ${tg(r2(S.f(b)))}`, `\\dfrac{${tg(r2(S.f(b)))} - ${tg(r2(S.f(a)))}}{${b} - ${a}} \\approx ${tg(r1(g))}`] };
}
const D2 = {
  nr: 2, titel: 'Kenmerken aflezen en interpreteren', kort: 'Functiewaarden, maximum en minimum, nulpunten en tekenschema in context.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Lees af én interpreteer</div>
      <p>Je bepaalt een kenmerk in het grafiekvenster. Je stopt niet bij het getal: je legt ook uit wat het betekent in de situatie, <b>in een volledige zin, met eenheden</b>.</p>
      <ul><li><b>Functiewaarde</b> $f(a)$: hoe groot is de grootheid bij $x = a$?</li>
      <li><b>Wanneer is $f(x) = c$?</b> Snijd de grafiek met de horizontale rechte $y = c$ (grafiekvenster: <i>Snijpunt</i>). Bij een berg krijg je twee snijpunten: het verschil is hoe lang de grootheid boven $c$ ligt.</li>
      <li><b>Maximum en minimum</b>: grafiekvenster <i>Hoogste en laagste punt</i>. Noteer wanneer (de $x$-waarde) én hoe groot (de $y$-waarde). Het absolute maximum kan aan de rand van het domein liggen!</li>
      <li><b>Nulpunten en tekenschema</b>: waar is de grootheid 0, positief of negatief (bv. de rekening staat in het rood)?</li>
      <li><b>Gemiddelde verandering</b> tussen $a$ en $b$: $\\dfrac{f(b) - f(a)}{b - a}$.</li></ul></div>${GEOGEBRA}
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een pijnstiller in het bloed</div>
      <p>$C(t) = 0{,}05t^3 - 1{,}2t^2 + 7{,}2t$ met $0 \\leq t \\leq 12$ ($C$ in mg/l, $t$ in uur na inname om 8 u).</p>
      ${figuur(rgraf({ x: [0, 12], y: [0, 15], xs: 1, ys: 2, xn: 't (uur)', yn: 'concentratie (mg/l)', functies: [{ f: (t) => 0.05 * t ** 3 - 1.2 * t * t + 7.2 * t, e: '0.05*x**3-1.2*x**2+7.2*x' }], punten: [{ x: 4, y: 12.8 }] }))}
      <ul><li>Nulpunten $0$ en $12$: bij inname en na 12 uur (om 20 u) zit er geen pijnstiller in het bloed.</li>
      <li>Maximum $(4 \\,;\\, 12{,}8)$: na 4 uur, om 12 u, is de concentratie het hoogst: 12,8 mg/l.</li>
      <li>Verloopschema: $C$ stijgt op $[0 \\,;\\, 4]$ en daalt op $[4 \\,;\\, 12]$.</li>
      <li>$C(t) \\geq 10$ tussen $t \\approx 2{,}16$ en $t \\approx 6{,}24$: de pijnstiller werkt ongeveer 4,1 uur.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: het budget van de jeugdbeweging</div>
      <p>$S(m) = -5m^3 + 120m^2 - 780m + 1120$ met $0 \\leq m \\leq 12$ ($S$ in euro, $m$ in maanden na 1 september).</p>
      <p>Nulpunten $2$ en $8$: de rekening staat in het rood van 1 november tot 1 mei (tekenschema: $-$ tussen 2 en 8).
      <b>Let goed op:</b> het meeste geld staat er op 1 september (1120 euro), niet op de top op het einde van het jaar. Het absolute maximum ligt hier aan de rand van het domein.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Hartslag: $H(t) = -0{,}8t^2 + 16t + 70$ met $0 \\leq t \\leq 20$ ($H$ in slagen per minuut).')}<p>Wanneer is de hartslag het hoogst en hoeveel bedraagt die dan?</p>`,
      stappen: ['\\text{Hoogste punt: } (10 \\,;\\, 150)', '\\text{Na 10 minuten is de hartslag het hoogst: 150 slagen per minuut.}'] },
    { html: `${opgave('Baby: $G(d) = 6d^2 - 60d + 3500$ met $0 \\leq d \\leq 14$.')}<p>Hoeveel gram komt de baby gemiddeld per dag bij tussen dag 10 en dag 14?</p>`,
      stappen: ['G(10) = 3500, \\quad G(14) = 3836', '\\dfrac{3836 - 3500}{14 - 10} = 84 \\text{ gram per dag}'] },
  ],
  soorten: {
    waarde: { naam: 'Functiewaarde in context', gen: vraagWaarde },
    hoelang: { naam: 'Hoe lang? / Wanneer opnieuw?', gen: vraagHoeLang },
    max: { naam: 'Maximum in context', gen: vraagMax },
    min: { naam: 'Minimum: het gewicht van de baby', gen: vraagMinBaby },
    rood: { naam: 'Nulpunten en tekenschema: in het rood', gen: vraagRood },
    saldomax: { naam: 'Grootste schuld en meeste geld', gen: vraagSaldoMax },
    spoed: { naam: 'Toppen en dalen: de spoeddienst', gen: vraagSpoed },
    gemV: { naam: 'Gemiddelde verandering', gen: vraagGemVerandering },
  },
  oefenMix: [['waarde', 2], ['hoelang', 1], ['max', 1], ['min', 1], ['rood', 1], ['saldomax', 1], ['spoed', 1], ['gemV', 1]],
  test: [['waarde', 2], ['hoelang', 1], ['max', 1], ['min', 1], ['rood', 1], ['saldomax', 1], ['spoed', 2], ['gemV', 1]], testSchudden: true,
};

// ===================================================================
//  2 · WISKUNDIG DOMEIN EN PRAKTISCH DOMEIN
// ===================================================================
const PRAKT = ['fontein', 'doos', 'fuif', 'bacterie', 'zwembad'];
const venW = (S, t) => sitVenster(S, { t, buiten: true }); // venster met de hele grafiek (praktisch domein in blauw)
function vraagWiskDom() {
  const S = kiesSit(PRAKT);
  return { soort: 'wiskdom', opdracht: 'Kies het juiste antwoord.', html: sitKort(S, vraag('Wat is het wiskundig domein? Dat zijn alle getallen die je in de formule kan invullen, ook getallen die in de situatie geen zin hebben.')), sleutel: S.e,
    rapport: `${S.titel}: wiskundig domein`, antw: zinnen('ℝ: in een veeltermfunctie kan je elk reëel getal invullen.', [`$${ivTex(S.dom[0], r2(S.dom[1]))}$: dat is het praktisch domein.`, '$\\mathbb{R}^+$: negatieve getallen kan je niet invullen.', `$\\mathbb{R} \\setminus \\{0\\}$: je mag niet delen door nul.`].map(z => z.replace(/\$([^$]+)\$/g, (m, t) => M(t)))),
    uitleg: ['\\text{dom } ' + S.fn + ' = \\mathbb{R}', tx('Het wiskundig domein van een veeltermfunctie is altijd ℝ. In de situatie hebben lang niet al die waarden zin: daarvoor dient het praktisch domein.')] };
}
function vraagPraktDom() {
  const S = kiesSit(PRAKT), [a, b] = S.dom, B = r2(b);
  const r = (s) => s.replace(/\$([^$]+)\$/g, (m, t) => M(t));
  let juist, fout, uit;
  if (S.fam === 'fontein') { juist = `$${ivTex(0, S.L)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(0, S.H)}$`, `$${ivTex(0, S.L / 2)}$`]; uit = `De straal begint aan de spuitmond (x = 0) en komt ${S.L} m verder neer: daar is h(x) = 0. Daarbuiten zou de hoogte negatief zijn.`; }
  if (S.fam === 'doos') { juist = `$${ivTex(0, S.B / 2, false, false)}$`; fout = [`$${ivTex(0, S.A / 2)}$`, `$${ivTex(0, S.B / 2)}$`, `$${ivTex(0, S.B, false, false)}$`]; uit = `Het vierkantje moet groter zijn dan 0 (anders zijn er geen randen) en kleiner dan ${kg(S.B / 2)} cm (de helft van de breedte ${S.B} cm). In 0 en ${kg(S.B / 2)} is het volume 0: geen doos, dus de randen horen er niet bij.`; }
  if (S.fam === 'fuif') { juist = `$${ivTex(0, S.pnul)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(0, S.pmax)}$`, `$${ivTex(0, S.N)}$`]; uit = `De prijs is niet negatief, en bij ${kg(S.pnul)} euro worden er ${S.N} − ${S.k} · ${kg(S.pnul)} = 0 tickets verkocht. Een hogere prijs geeft een negatief aantal tickets.`; }
  if (S.fam === 'bacterie') { juist = `$${ivTex(0, B)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(0, I, true, false)}$`, `$${ivTex(-3, B)}$`]; uit = `We starten bij het toevoegen van het antibioticum (t = 0) en stoppen als er geen bacteriën meer zijn: B(t) = 0 voor t ≈ ${kg(B)}.`; }
  if (S.fam === 'zwembad') { juist = `$${ivTex(S.q1, S.q2)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(0, S.q2)}$`, `$${ivTex(0, I, true, false)}$`]; uit = `Volgens het model komen er enkel bezoekers als Z(T) ≥ 0: tussen ${S.q1} °C en ${S.q2} °C. (In België is een kleiner interval, bv. [15 ; 35], realistischer.)`; }
  return { soort: 'praktdom', opdracht: 'Kies het praktisch domein.', html: sitKort(S, `${vraag(`Welke waarden van $${S.x}$ zijn mogelijk in de situatie? Kies het praktisch domein.`)}${venW(S, 'vfs')}`), sleutel: S.e,
    rapport: `${S.titel}: praktisch domein`, antw: zinnen(r(juist), fout.map(r), { lijst: false }), uitleg: [tx(uit)] };
}
function vraagBereikPrakt() {
  const S = kiesSit(['fontein', 'fuif', 'zwembad']);
  const top = S.max.y, st = [{ a: 0, ai: true, b: top, bi: true }];
  return { soort: 'bereik', opdracht: 'Tip: zoek de kleinste en de grootste waarde (knop "Hoogste en laagste punt").', html: sitOpgave(S, `${vraag(`Welke waarden kan ${yWat(S)} hebben op het praktisch domein? Geef het bereik.`)}${venW(S, 'vfm')}`), sleutel: S.e + 'b',
    rapport: `${S.titel}: bereik`, antw: vz(st, `\\text{ber } ${S.fn} =`), uitleg: [`\\text{kleinste waarde } 0 \\text{ (aan de randen), grootste waarde } ${tg(top)} \\text{ (de top)}`, `\\text{ber } ${S.fn} = ${ivTex(0, top)}`] };
}
function vraagMaxPrakt() {
  const S = kiesSit(['doos', 'bacterie', 'fuif']);
  const d = S.dec, vr = { doos: 'Bij welke x is het volume maximaal? Hoe groot is dat volume?', bacterie: 'Wanneer zijn er het meeste bacteriën? Hoeveel (in duizendtallen) zijn het er dan?', fuif: 'Bij welke ticketprijs is de opbrengst maximaal? Hoeveel bedraagt ze?' }[S.fam];
  const delenL = [[`${S.x} =`, getal(S.max.x, { dec: S.fam === 'fuif' ? 2 : d, na: `\\text{ ${S.xe}}` })], [`${S.fn} =`, getal(S.max.y, { dec: d, na: naTex(S) })]];
  if (S.fam === 'fuif') delenL.push(['\\text{aantal verkochte tickets:}', getal(S.N - S.k * S.pmax)]);
  const extra = S.fam === 'bacterie' ? [tx(`${kg(r2(S.max.x))} uur is ongeveer ${Math.floor(S.max.x)} uur en ${Math.round((S.max.x % 1) * 60)} minuten.`)] : [];
  return { soort: 'maxprakt', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag(vr)}${venW(S, 'vfm')}`), sleutel: S.e + 'm',
    rapport: `${S.titel}: maximum`, antw: delen(...delenL), uitleg: [`\\text{Hoogste punt: } (${tg(W.rond(S.max.x, 2))} \\,;\\, ${tg(W.rond(S.max.y, d))})`, tx(S.z.max), ...extra] };
}
function vraagGrens() {
  const S = kiesSit(['fontein', 'fuif']);
  let c, vr;
  if (S.fam === 'fontein') { c = kies([0.4, 0.5, 0.6, 0.75]).toFixed(2) * S.H; c = r1(c); vr = `Een bewoner van ${kg(c)} m groot wil onder de straal door wandelen zonder nat te worden. Tussen welke afstanden van de spuitmond kan dat?`; }
  else { c = Math.round(kies([0.5, 0.6, 0.75]) * S.Rmax / 100) * 100; vr = `De leerlingenraad wil minstens ${c} euro opbrengen. Welke ticketprijzen zijn mogelijk?`; }
  const xs = nulpunten(S.f, S.dom[0], S.dom[1], c);
  return { soort: 'grens', opdracht: 'Tip: typ de waarde bij "Snijpunt" in het grafiekvenster (y = …). Rond af op 0,01.', html: sitOpgave(S, `${vraag(vr)}${venW(S, 'vs')}`), sleutel: S.e + c, rapport: `${S.titel}: ${vr}`,
    antw: delen([`\\text{van } ${S.x} =`, getal(xs[0], { dec: 2, na: `\\text{ ${S.xe}}` })], [`\\text{tot } ${S.x} =`, getal(xs[1], { dec: 2, na: `\\text{ ${S.xe}}` })]),
    uitleg: [`\\text{Snijpunt met } y = ${tg(c)}: \\; ${S.x} \\approx ${tg(r2(xs[0]))} \\text{ en } ${S.x} \\approx ${tg(r2(xs[1]))}`, tx(S.fam === 'fontein' ? 'Tussen die twee afstanden is de straal hoger dan de bewoner.' : 'Tussen die twee prijzen is de opbrengst minstens zo groot.')] };
}
function vraagZinloos() {
  const S = kiesSit(['doos', 'fuif', 'bacterie']);
  let x, juist, fout;
  if (S.fam === 'doos') { x = S.B / 2 + kies([1, 2, 3]); juist = `Bij een vierkantje van ${kg(x)} cm is het karton te smal: ${S.B} − 2 · ${kg(x)} is negatief. Er is dan geen doos, ook al is de uitkomst positief.`;
    fout = ['Dat is het grootste volume.', 'Dat kan: dan is de doos heel hoog.', 'Dat is een nulpunt van V.']; }
  else if (S.fam === 'fuif') { x = S.pnul + kies([2, 5, 10]); juist = `Bij een prijs van ${kg(x)} euro zou het aantal tickets negatief zijn. Dat kan niet: de prijs ligt buiten het praktisch domein.`;
    fout = ['De leerlingenraad moet dan geld bijbetalen.', 'Dat is het maximum van de opbrengst.', 'Er komen dan heel veel leerlingen.']; }
  else { x = -kies([1, 2, 3]); juist = `${-x} uur vóór het toevoegen gold het model nog niet: het antibioticum zat er toen nog niet in. Het model beschrijft enkel wat er na het toevoegen gebeurt.`;
    fout = [`${-x} uur vóór het toevoegen waren er precies zoveel bacteriën.`, 'Het model klopt ook voor negatieve tijden.', 'Dat is het maximum van het aantal bacteriën.']; }
  const y = S.f(x), d = S.dec;
  return { soort: 'zinloos', opdracht: 'Tip: bereken de waarde met "Bereken" in het grafiekvenster.', html: sitKort(S, `${vraag(`Bereken $${S.fn}(${tg(x)})$. Wat besluit je?`)}${venW(S, 'vf')}`), sleutel: S.e + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: delen([`${S.fn}(${tg(x)}) =`, getal(y, { dec: d })], ['\\text{Wat besluit je?}', zinnen(juist, fout)]), uitleg: [`${S.fn}(${tg(x)}) \\approx ${tg(W.rond(y, d))}`, tx(juist)] };
}
const D3 = {
  nr: 3, titel: 'Wiskundig domein en praktisch domein', kort: 'Voor welke waarden is het model zinvol? Bereik en maximum op het praktisch domein.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Wiskundig domein en praktisch domein</div>
      <p>Het <b>wiskundig domein</b> van een veeltermfunctie is altijd $\\mathbb{R}$: je kan elk reëel getal invullen in het voorschrift.</p>
      <p>In een situatie hebben niet alle waarden zin. Een tijd, een lengte of een prijs is bijvoorbeeld meestal niet negatief, en een aantal kan niet negatief worden.
      Het <b>praktisch domein</b> is het deel van het domein waarvoor het model zinvol is. Het bereik bepaal je dan op het praktisch domein.</p></div>
    <div class="kader eig"><div class="kader-titel">Stappenplan</div>
      <ol><li>Bekijk de grafiek in het grafiekvenster.</li><li>Vraag je af: welke waarden kan de onafhankelijke veranderlijke ($x$, $t$, $p$ …) in werkelijkheid aannemen?</li>
      <li>Vraag je af: waar geeft het model onmogelijke uitkomsten (negatieve aantallen, een negatieve hoogte …)?</li>
      <li>Noteer het praktisch domein als interval en verklaar de grenzen.</li><li>Bepaal het bereik op dat praktisch domein.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een fontein</div>
      <p>$h(x) = -0{,}25x^2 + 2x$ ($h$ = hoogte van de straal in m, $x$ = afstand tot de spuitmond in m).</p>
      ${figuur(rgraf({ x: [-2, 10], y: [-2, 5], xs: 1, ys: 1, xn: 'x (m)', yn: 'hoogte (m)', functies: [{ f: (x) => -0.25 * x * x + 2 * x, e: '-0.25*x**2+2*x', van: 0, tot: 8 }], buiten: true, punten: [{ x: 4, y: 4 }] }))}
      <ul><li>Wiskundig domein: $\\mathbb{R}$.</li><li>Praktisch domein: $[0 \\,;\\, 8]$: de straal start aan de spuitmond en komt 8 m verder neer ($h(8) = 0$). Daarbuiten zou de hoogte negatief zijn.</li>
      <li>Maximum $(4 \\,;\\, 4)$: 4 m van de spuitmond is de straal het hoogst, 4 m. Bereik op het praktisch domein: $[0 \\,;\\, 4]$.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een doos uit karton</div>
      <p>Karton van 30 cm op 20 cm, in elke hoek een vierkantje met zijde $x$ wegknippen: $V(x) = x(30 - 2x)(20 - 2x)$.</p>
      <p>Lengte $30 - 2x$, breedte $20 - 2x$, hoogte $x$. Praktisch domein ${M('{]}0 \\,;\\, 10{[}')}$: de randen horen er niet bij (bij $x = 0$ en $x = 10$ is er geen doos).
      Het volume is maximaal bij $x \\approx 3{,}9$ cm: ongeveer $1056{,}3$ cm³. Volgens de formule is $V(16)$ positief, maar bij $x = 16$ is het karton te smal: die waarde heeft geen betekenis.</p></div>
    <div class="kader"><div class="kader-titel">Zo vul je in</div><p>Een interval: <code>[0 ; 4]</code> of <code>]0 ; 10[</code>.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Benefietfuif: bij een prijs van $p$ euro worden er $400 - 20p$ tickets verkocht. Opbrengst $R(p) = p(400 - 20p)$.')}<p>Bepaal het praktisch domein en de maximale opbrengst.</p>`,
      stappen: ['400 - 20p = 0 \\Leftrightarrow p = 20: \\text{ bij 20 euro koopt niemand een ticket}', '\\text{praktisch domein } [0 \\,;\\, 20]', '\\text{Hoogste punt } (10 \\,;\\, 2000): \\text{ bij 10 euro is de opbrengst maximaal, 2000 euro (200 tickets).}'] },
  ],
  soorten: {
    wiskdom: { naam: 'Wiskundig domein', gen: vraagWiskDom },
    praktdom: { naam: 'Praktisch domein kiezen', gen: vraagPraktDom },
    bereik: { naam: 'Bereik op het praktisch domein', gen: vraagBereikPrakt },
    maxprakt: { naam: 'Maximum op het praktisch domein', gen: vraagMaxPrakt },
    grens: { naam: 'Tussen welke waarden?', gen: vraagGrens },
    zinloos: { naam: 'Een waarde zonder betekenis', gen: vraagZinloos },
  },
  oefenMix: [['wiskdom', 1], ['praktdom', 2], ['bereik', 1], ['maxprakt', 1], ['grens', 1], ['zinloos', 1]],
  test: [['wiskdom', 1], ['praktdom', 3], ['bereik', 1], ['maxprakt', 2], ['grens', 2], ['zinloos', 1]], testSchudden: true,
};

// ===================================================================
//  3 · KRITISCH KIJKEN NAAR EEN MODEL
// ===================================================================
function vraagExtrapoleer() {
  const k = kies(['baby', 'inwoners', 'conc']);
  let S, x, vr, juist, fout, info = '', Xv, Yv;
  if (k === 'baby') {
    S = sitBaby(); x = 60; vr = 'Hoeveel zou de baby volgens het model wegen na twee maanden (60 dagen)?'; info = 'Een baby van twee maanden weegt in werkelijkheid ongeveer 5 kg (5000 gram).';
    juist = 'Het model klopt enkel de eerste twee weken. Daarna groeit een baby veel trager dan het model voorspelt.'; fout = ['Het model klopt: de baby weegt na twee maanden zoveel.', 'Het model klopt, want een tweedegraadsfunctie stijgt altijd.', 'Het model is fout, want de baby verliest gewicht.'];
    Xv = [0, 65]; Yv = [0, top(S.f(60) * 1.1)];
  } else if (k === 'inwoners') {
    S = sitInwoners(); x = kies([50, -30]); vr = `Hoeveel inwoners heeft de gemeente volgens het model in ${2000 + x}?`; info = 'Het model werd gemaakt met de gegevens van 2000 tot 2025.';
    juist = `${2000 + x} ligt ver buiten de periode van de gegevens: dat is extrapoleren. De uitkomst is niet betrouwbaar.`; fout = [`Het model past goed bij de gegevens, dus de voorspelling voor ${2000 + x} klopt zeker.`, 'Dat is interpoleren: de uitkomst is betrouwbaar.', 'Het model is altijd fout.'];
    Xv = [-35, 55]; Yv = [0, top(Math.max(S.f(50), S.f(-30)) * 1.1)];
  } else {
    S = sitConc(); x = S.T + kies([2, 3, 4]); vr = `Hoe groot is de concentratie volgens het model ${x} uur na de inname?`;
    juist = `Volgens het model stijgt de concentratie weer na ${S.T} uur, zonder nieuwe dosis. Dat kan niet: het model klopt enkel tot ${S.ding} uitgewerkt is.`; fout = ['Het model klopt: de concentratie stijgt na een tijd weer vanzelf.', `Na ${x} uur is de concentratie negatief.`, `${zin(S.ding)} werkt na ${x} uur het best.`];
    Xv = [0, S.T + 5]; Yv = [0, top(Math.max(S.Mx, S.f(S.T + 5)) * 1.15)];
  }
  const y = S.f(x), d = S.dec;
  return { soort: 'extra', opdracht: 'Tip: bereken de waarde met "Bereken" in het grafiekvenster. Denk dan na: kan dat echt?', html: `${sitOpgave(S)}${info ? p_(info) : ''}${vraag(vr)}${sitVenster(S, { t: 'f', X: Xv, Y: Yv, buiten: true })}`, sleutel: S.e + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: delen([`${S.fn}(${tg(x)}) =`, getal(y, { dec: d, na: naTex(S) })], ['\\text{Wat besluit je?}', zinnen(juist, fout)]),
    uitleg: [`${S.fn}(${tg(x)}) \\approx ${tg(W.rond(y, d))}`, tx(juist)] };
}
function vraagInterExtra() {
  const t0 = 0, t1 = kies([8, 9, 10, 12]), t = kies([rnd(1, t1 - 1), rnd(1, t1 - 1), t1 + kies([5, 10, 20, 50])]), inter = t < t1;
  const wat = kies([{ w: 'het gewicht van een baby', e: 'dagen' }, { w: 'de concentratie van een geneesmiddel', e: 'uur' }, { w: 'het aantal 65-plussers in een gemeente', e: 'jaar' }]);
  const juist = inter ? `Interpoleren: ${t} ${wat.e} ligt binnen het gebied van de metingen.` : `Extrapoleren: ${t} ${wat.e} ligt buiten het gebied van de metingen. Opgelet: dat is gevaarlijk!`;
  const fout = inter ? [`Extrapoleren: ${t} ${wat.e} ligt buiten het gebied van de metingen.`, 'Extrapoleren: elke voorspelling met een model is extrapoleren.', 'Interpoleren: elke voorspelling met een model is interpoleren.']
    : [`Interpoleren: ${t} ${wat.e} ligt binnen het gebied van de metingen.`, 'Interpoleren: het model is een veeltermfunctie, dus het is altijd betrouwbaar.', 'Extrapoleren: elke voorspelling met een model is extrapoleren.'];
  return { soort: 'interextra', opdracht: 'Kies het juiste antwoord.', html: opgave(`Men meet ${wat.w} van ${t0} tot ${t1} ${wat.e}. Met die metingen maakt men een model. Met het model voorspelt men ${wat.w} na ${t} ${wat.e}.`) + vraag('Is dat interpoleren of extrapoleren?'),
    sleutel: `${wat.w}${t1}${t}`, rapport: `metingen ${t0}–${t1}, voorspelling ${t}`, antw: zinnen(juist, fout), uitleg: ['\\text{Binnen de metingen: interpoleren. Erbuiten: extrapoleren.}'] };
}
const MA = (j) => 0.02 * j * j + 0.3 * j + 5, MB = (j) => -0.004 * j ** 3 + 0.08 * j * j + 0.1 * j + 5;
const METINGEN = [[0, 5], [1, 5.4], [2, 5.6], [3, 6.1], [4, 6.4], [5, 7], [6, 7.6], [7, 8.2], [8, 8.7], [9, 9.4], [10, 10]];
const TWEE_MODELLEN = `<p>In een gemeente telde men het aantal 65-plussers (in duizendtallen), $j$ jaren na 2015:</p>
  <table class="tabel"><tr><th>$j$</th>${METINGEN.map(m => `<td>${m[0]}</td>`).join('')}</tr><tr><th>aantal (×1000)</th>${METINGEN.map(m => `<td>${kg(m[1], 1, true)}</td>`).join('')}</tr></table>
  <p>Twee leerlingen stellen elk een model voor: &nbsp; $A(j) = 0{,}02j^2 + 0{,}3j + 5$ &nbsp; en &nbsp; $B(j) = -0{,}004j^3 + 0{,}08j^2 + 0{,}1j + 5$.</p>`;
const TWEE_VENSTER = () => venster({ fs: [{ e: '0.02*x*x+0.3*x+5', n: 'A' }, { e: '-0.004*x**3+0.08*x*x+0.1*x+5', n: 'B', k: GROEN }], X: [0, 25], Y: [0, 25], a: 0, b: 25, xv: 'j', xe: 'jaar na 2015', ye: 'duizend 65-plussers',
  xn: 'j (jaren na 2015)', yn: '65-plussers (× 1000)', t: 'vfm', pts: METINGEN.map(([x, y]) => ({ x, y })), buiten: false, geenDomein: true });
function vraagTweeModellen() {
  const s = kies(['waarde', 'waarde', 'daal', 'welk']);
  if (s === 'waarde') {
    const jaar = kies([2030, 2035]), j = jaar - 2015, m = kies(['A', 'B']), y = (m === 'A' ? MA : MB)(j);
    return { soort: 'twee', opdracht: `Tip: kies grafiek ${m} in het grafiekvenster en gebruik "Bereken".`, html: `${TWEE_MODELLEN}${vraag(`Hoeveel 65-plussers (in duizendtallen) voorspelt model ${m} voor ${jaar}?`)}${TWEE_VENSTER()}`, sleutel: m + j, rapport: `twee modellen: ${m}(${j})`,
      antw: getal(y, { dec: 2, voor: `${m}(${j}) =`, na: '\\text{ duizend}' }), uitleg: [`${jaar} - 2015 = ${j}`, `${m}(${j}) \\approx ${tg(r2(y))}`] };
  }
  if (s === 'daal') return { soort: 'twee', opdracht: 'Tip: kies grafiek B in het grafiekvenster en zoek het hoogste punt.', html: `${TWEE_MODELLEN}${vraag('Volgens model B daalt het aantal 65-plussers na een tijd. In welk jaar begint die daling?')}${TWEE_VENSTER()}`, sleutel: 'daal',
    rapport: 'twee modellen: top van B', antw: getal(2029, { voor: '\\text{in}' }), uitleg: ['\\text{Hoogste punt van B: } j \\approx 13{,}93', '2015 + 13{,}93 \\approx 2029', tx('Dat is niet logisch: de bevolking in België vergrijst, het aantal 65-plussers blijft stijgen.')] };
  return { soort: 'twee', opdracht: 'Kies het juiste antwoord.', html: TWEE_MODELLEN + vraag('Wat leer je uit deze twee modellen?') + TWEE_VENSTER(), sleutel: 'welk', rapport: 'twee modellen: wat leer je?',
    antw: zinnen('Beide modellen passen goed bij de metingen, maar daarbuiten geven ze heel verschillende voorspellingen. Extrapoleren is gevaarlijk.',
      ['Model B is het beste, want het heeft een derde graad.', 'Beide modellen geven dezelfde voorspelling voor 2035.', 'Een model dat goed past bij de metingen, voorspelt de toekomst altijd juist.']),
    uitleg: ['\\text{Binnen de metingen (2015–2025) passen beide modellen goed.}', '\\text{In 2035: } A(20) = 19 \\text{ duizend, } B(20) = 7 \\text{ duizend.}'] };
}
const D4 = {
  nr: 4, titel: 'Kritisch kijken naar een model', kort: 'Waar "breekt" het model? Interpoleren en extrapoleren.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een model is een vereenvoudiging</div>
      <p>Een functie die een situatie beschrijft, noemen we een <b>model</b>. Een model is nooit perfect: het is een vereenvoudiging van de werkelijkheid.</p>
      <p>De grafiek van een veeltermfunctie loopt altijd verder, naar links en naar rechts. De werkelijkheid doet dat niet. Daarom stel je je bij elk model drie vragen:</p>
      <ol><li>Voor welke waarden geeft het model zinvolle resultaten?</li><li>Waar "breekt" het model: waar geeft het onmogelijke of onrealistische uitkomsten?</li><li>Wat zou er in werkelijkheid gebeuren?</li></ol>
      <p>Een voorspelling <b>binnen</b> het gebied van de gemeten gegevens heet <b>interpoleren</b>. Een voorspelling <b>erbuiten</b> heet <b>extrapoleren</b>. Extrapoleren is gevaarlijk!</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: de baby wordt groter</div>
      <p>$G(d) = 6d^2 - 60d + 3500$: $G(60) = 21\\,500$ gram, dus ongeveer 21,5 kg na twee maanden! Een baby van twee maanden weegt in werkelijkheid ongeveer 5 kg.
      Het model "breekt" na de eerste twee weken: in werkelijkheid groeit een baby daarna veel trager. Je kan het model enkel vertrouwen op $[0 \\,;\\, 14]$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: twee modellen, één werkelijkheid</div>${TWEE_MODELLEN}
      ${figuur(rgraf({ x: [0, 25], y: [0, 25], xs: 5, ys: 5, xn: 'j (jaren na 2015)', yn: '65-plussers (× 1000)', functies: [{ f: MA }, { f: MB, kleur: GROEN }], punten: METINGEN.map(([x, y]) => ({ x, y })) }))}
      <p class="klein midden">blauw: model A · groen: model B · bolletjes: metingen</p>
      <p>Tussen 2015 en 2025 passen beide modellen goed. Maar voor 2035 voorspelt A ongeveer 19 000 en B ongeveer 7 000 65-plussers! Volgens model B daalt het aantal vanaf 2029, terwijl de bevolking vergrijst.
      Twee modellen die goed passen bij de metingen, kunnen daarbuiten totaal verschillende voorspellingen geven.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Inwoners: $P(j) = 8j^2 - 160j + 12\\,000$, met $j$ het aantal jaren na 2000 (gegevens van 2000 tot 2025).')}<p>Bereken $P(-30)$ (het jaar 1970). In werkelijkheid waren er toen 9500 inwoners. Wat besluit je?</p>`,
      stappen: ['P(-30) = 7200 + 4800 + 12\\,000 = 24\\,000', '\\text{Dat klopt helemaal niet met 9500: 1970 ligt ver buiten de gegevens (extrapoleren).}'] },
  ],
  soorten: {
    extra: { naam: 'Ver buiten de metingen', gen: vraagExtrapoleer },
    interextra: { naam: 'Interpoleren of extrapoleren?', gen: vraagInterExtra },
    twee: { naam: 'Twee modellen vergelijken', gen: vraagTweeModellen },
  },
  oefenMix: [['extra', 2], ['interextra', 1], ['twee', 2]],
  test: [['extra', 4], ['interextra', 2], ['twee', 4]], testSchudden: true,
};

// ===================================================================
//  4 · KOPPEL DE GRAFIEK AAN DE SITUATIE
// ===================================================================
// kleine "situaties" zonder model van de werkbundel: een gsm die leegloopt en een constante temperatuur
const sitGsm = () => ({ fam: 'gsm', titel: 'Batterij van een gsm', f: (t) => 100 - 12.5 * t, e: '100-12.5*x', dom: [0, 8], graf: { x: [0, 8], y: [0, 110] }, tex: 'B(t) = 100 - 12{,}5t' });
const sitTemp37 = () => ({ fam: 'temp37', titel: 'Lichaamstemperatuur', f: () => 37, e: '37+0*x', dom: [0, 24], graf: { x: [0, 24], y: [0, 40] }, tex: 'T(t) = 37' });
const VORM = (S) => ({ conc: 'berg0', griep: 'berg0', baby: 'dal', hart: 'berg', saldo: 'golf', spoed: 'twee', fontein: 'berg0', gsm: 'lin', temp37: 'const' }[S.fam]);
function korteSit(S) {
  return { conc: 'De concentratie van een geneesmiddel in het bloed (in mg/l) tijdens de eerste uren na inname.', griep: 'Het aantal zieke leerlingen tijdens een griepgolf.',
    baby: 'Het gewicht van een baby (in gram) tijdens de eerste twee weken na de geboorte.', hart: 'De hartslag tijdens een looptest: eerst steeds sneller lopen, daarna steeds trager.',
    saldo: 'Het saldo van een jeugdbeweging, dat een tijd in het rood staat.', spoed: 'Het aantal patiënten in de wachtzaal van een spoeddienst tussen 6 u en 22 u.',
    fontein: 'De hoogte (in meter) van een waterstraal, van de spuitmond tot hij neerkomt.', gsm: 'Het batterijpercentage van een gsm die volledig opgeladen is en in 8 uur gelijkmatig leegloopt.',
    temp37: 'De lichaamstemperatuur van een gezonde persoon, die de hele dag 37 °C blijft.' }[S.fam];
}
const KOPPEL = { conc: sitConc, baby: sitBaby, hart: sitHart, saldo: sitSaldo, spoed: sitSpoed, griep: sitGriep, fontein: sitFontein, gsm: sitGsm, temp37: sitTemp37 };
function andereSits(S, n) {
  const uit = [], vormen = new Set([VORM(S)]);
  for (const fam of schud(Object.keys(KOPPEL))) { if (uit.length >= n) break; const T = KOPPEL[fam](); if (vormen.has(VORM(T))) continue; vormen.add(VORM(T)); uit.push(T); }
  return uit;
}
const kaal = (S, klein) => rgraf({ x: S.graf.x, y: S.graf.y, functies: [{ f: S.f, e: S.e, van: S.dom[0], tot: S.dom[1] }], klein, breed: klein ? 260 : 360, hoog: klein ? 160 : 230 });
const kiesKoppel = () => KOPPEL[kies(['conc', 'baby', 'hart', 'saldo', 'spoed', 'griep', 'fontein'])]();
function vraagGrafNaarSit() {
  const S = kiesKoppel(), A = andereSits(S, 3);
  return { soort: 'grafsit', opdracht: 'Kijk naar de vorm en de getallen van de grafiek.', html: figuur(kaal(S)) + vraag('Welke situatie past bij deze grafiek?'), sleutel: S.e,
    rapport: `grafiek → situatie (${S.titel})`, antw: zinnen(korteSit(S), A.map(korteSit)), uitleg: [tx(korteSit(S)), `\\text{Model: } ${S.tex}`] };
}
function vraagSitNaarGraf() {
  const S = kiesKoppel(), A = andereSits(S, 3);
  return { soort: 'sitgraf', opdracht: 'Kijk naar de beginwaarde, stijgen of dalen, toppen en dalen, en nulpunten.', html: opgave(korteSit(S)) + vraag('Welke grafiek past bij deze situatie?'), sleutel: S.e,
    rapport: `situatie → grafiek (${S.titel})`, antw: figuren(kaal(S, true), A.map(T => kaal(T, true))), uitleg: [tx('Kijk naar de beginwaarde, stijgen of dalen, toppen en dalen, en nulpunten.')] };
}
function vraagDoorslag() {
  const S = KOPPEL[kies(['conc', 'baby', 'saldo', 'spoed', 'hart'])]();
  const K = { conc: 'Start bij 0, stijgt tot een top en daalt weer tot 0: het geneesmiddel komt in het bloed en is daarna uitgewerkt.', baby: 'Start hoog, daalt eerst een beetje (een dal) en stijgt daarna: de baby verliest eerst gewicht en komt dan bij.',
    saldo: 'De grafiek komt onder de x-as: het saldo wordt negatief (in het rood).', spoed: 'De grafiek heeft twee toppen: twee drukke momenten op de dag.', hart: 'Start bij een waarde groter dan 0, stijgt tot een top en daalt weer: de hartslag in rust, dan inspanning, dan rustiger.' };
  return { soort: 'doorslag', opdracht: 'Kies het kenmerk dat de doorslag geeft.', html: `${figuur(kaal(S))}${opgave(korteSit(S))}${vraag('Welk kenmerk van de grafiek toont het best dat ze bij deze situatie hoort?')}`, sleutel: S.e + 'd',
    rapport: `doorslaggevend kenmerk (${S.titel})`, antw: zinnen(K[S.fam], Object.keys(K).filter(k => k !== S.fam).map(k => K[k])), uitleg: [tx(K[S.fam])] };
}
const D5 = {
  nr: 5, titel: 'Koppel de grafiek aan de situatie', kort: 'Grafieken en situaties aan elkaar koppelen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Grafiek en situatie koppelen</div>
      <p>Bij een grafiek zonder namen bij de assen redeneer je met de <b>vorm</b> en de <b>getallen</b>:</p>
      <ul><li><b>Beginwaarde:</b> start de grafiek bij 0 (nog geen geneesmiddel, nog niemand ziek) of bij een andere waarde (hartslag in rust, geboortegewicht)?</li>
      <li><b>Stijgen en dalen:</b> één top (berg), één dal, twee toppen (twee drukke momenten), of overal dalend (gsm-batterij)?</li>
      <li><b>Nulpunten:</b> komt de grafiek op 0 (uitgewerkt, de straal komt neer) of zelfs eronder (schuld)?</li>
      <li><b>Constant:</b> een horizontale rechte (de temperatuur blijft 37 °C).</li>
      <li><b>Domein:</b> waar begint en eindigt de grafiek (van 6 u tot 22 u, de eerste 14 dagen …)?</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden uit de werkbundel</div>
      <table class="tabel"><tr><th>Grafiek</th><th>Situatie</th><th>Doorslaggevend kenmerk</th></tr>
      <tr><td>${rgraf({ x: [0, 14], y: [3200, 3900], xs: 2, ys: 100, functies: [{ f: (d) => 6 * d * d - 60 * d + 3500 }], klein: true, breed: 200, hoog: 110 })}</td><td>gewicht van een baby de eerste twee weken</td><td>start hoog, een dal op dag 5, daarna stijgend</td></tr>
      <tr><td>${rgraf({ x: [0, 12], y: [-600, 1200], xs: 2, ys: 300, functies: [{ f: (m) => -5 * m ** 3 + 120 * m * m - 780 * m + 1120 }], klein: true, breed: 200, hoog: 110 })}</td><td>saldo van een jeugdbeweging</td><td>de grafiek komt onder de $x$-as (in het rood)</td></tr>
      <tr><td>${rgraf({ x: [0, 8], y: [0, 110], xs: 1, ys: 20, functies: [{ f: (t) => 100 - 12.5 * t }], klein: true, breed: 200, hoog: 110 })}</td><td>batterij van een gsm die gelijkmatig leegloopt</td><td>een dalende rechte</td></tr></table></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: figuur(rgraf({ x: [0, 20], y: [0, 170], xs: 2, ys: 20, functies: [{ f: (t) => -0.8 * t * t + 16 * t + 70, e: '-0.8*x**2+16*x+70' }] })),
      stappen: ['\\text{Start bij 70 (niet bij 0), stijgt tot een top van 150 en daalt weer tot 70.}', '\\text{Past bij: de hartslag tijdens een looptest.}'] },
  ],
  soorten: {
    grafsit: { naam: 'Grafiek → situatie', gen: vraagGrafNaarSit },
    sitgraf: { naam: 'Situatie → grafiek', gen: vraagSitNaarGraf },
    doorslag: { naam: 'Welk kenmerk geeft de doorslag?', gen: vraagDoorslag },
  },
  oefenMix: [['grafsit', 2], ['sitgraf', 2], ['doorslag', 1]],
  test: [['grafsit', 4], ['sitgraf', 4], ['doorslag', 2]], testSchudden: true,
};
// ===================================================================
//  5 · VAN SITUATIE NAAR SCHETS
// ===================================================================
// verhalen met een passend model en drie foute modellen
function verhaalSit() {
  const fam = kies(['conc', 'open', 'fontein', 'griep', 'baby']);
  if (fam === 'conc') {
    const S = sitConc('geneesmiddel'), { T, tm, Mx, uur, a } = S;
    const v = `Een patiënt krijgt om ${uur} u een geneesmiddel. De concentratie in het bloed stijgt eerst snel en bereikt na ${tm} uur een maximum van ${kg(Mx)} mg/l. Daarna daalt ze geleidelijk, tot het middel na ${T} uur volledig uitgewerkt is.`;
    const fout = [(t) => a * 1.6 * t * (t - T) ** 2, (t) => { const T2 = T * 0.75; return 27 * Mx / (4 * T2 ** 3) * t * (t - T2) ** 2; }, (t) => Mx * t * (T - t) / (T * T / 4)];
    return { S, v, fout, X: [0, T], Y: [0, top(Mx * 1.8)], max: Mx, dom: [0, T], goedTex: `C(t) = ${a}t(t - ${T})^2`, foutTex: [`C(t) = ${r2(a * 1.6)}t(t - ${T})^2`, `C(t) = ${a}t(t - ${T + 3})^2`, `C(t) = ${r2(a * 2)}t(t - ${T / 2})^2`] };
  }
  if (fam === 'open') {
    const B = kies([200, 240, 300, 320]), a = B / 16, f = (t) => -a * (t - 10) * (t - 18), e = `-${a}*(x-10)*(x-18)`;
    const S = { fam: 'open', titel: 'Opendeurdag', f, e, fn: 'V', x: 't', xe: 'uur', ye: 'bezoekers', yn: 'bezoekers', dom: [10, 18], graf: { x: [10, 18], y: [0, top(B * 1.4)] }, tex: `V(t) = -${tg(a)}(t - 10)(t - 18)` };
    const v = `Een zorginstelling houdt een opendeurdag. De deuren gaan open om 10 u en sluiten om 18 u. Bij de opening en bij de sluiting is er niemand binnen. Om 14 u is het het drukst, met ${B} bezoekers. De drukte neemt even snel toe als af.`;
    const fout = [(t) => -a * (t - 10) * (t - 20) * 0.8, (t) => -a * 0.6 * (t - 10) * (t - 18), (t) => B * (1 - ((t - 12) / 2) ** 2) * (t <= 14 ? 1 : 1)];
    return { S, v, fout, X: [10, 18], Y: [0, top(B * 1.4)], max: B, dom: [10, 18], goedTex: `V(t) = ${vtTex([-a, 28 * a, -180 * a], 't')}`,
      foutTex: [`V(t) = ${vtTex([-a, 30 * a, -200 * a], 't')}`, `V(t) = ${vtTex([-a * 0.6, 28 * a * 0.6, -180 * a * 0.6].map(r2), 't')}`, `V(t) = ${vtTex([-a, 26 * a, -160 * a], 't')}`] };
  }
  if (fam === 'fontein') {
    const S = sitFontein(), { L, H, a } = S;
    const v = `De straal van een fontein komt uit een spuitmond op de grond. ${kg(L / 2)} m verder is de straal het hoogst: ${kg(H)} m. De straal komt ${L} m van de spuitmond weer op de grond.`;
    const fout = [(x) => -a * 2 * x * (x - L), (x) => -4 * H / (L + 4) ** 2 * x * (x - L - 4), (x) => -a * x * (x - L) + H / 2];
    return { S, v, fout, X: [0, L + 4], Y: [0, top(H * 2.2)], max: H, dom: [0, L], goedTex: `h(x) = ${vtTex([-a, a * L, 0])}`, foutTex: [`h(x) = ${vtTex([-2 * a, 2 * a * L, 0])}`, `h(x) = ${vtTex([-a, a * (L + 4), 0])}`, `h(x) = ${vtTex([-a, a * L, H / 2])}`] };
  }
  if (fam === 'griep') {
    const S = sitGriep(), { L, wm, Mx } = S, k = -S.c[0];
    const v = `Op een scholencampus breekt een griepgolf uit. Bij de start is niemand ziek. Het aantal zieke leerlingen stijgt tot ${Mx} in week ${wm}. Daarna daalt het, en na ${L} weken is de griepgolf voorbij.`;
    const fout = [(w) => k * 1.5 * w * w * (L - w), (w) => { const L2 = L - 3; return 27 * Mx / (4 * L2 ** 3) * w * w * (L2 - w); }, (w) => 4 * Mx / (L * L) * w * (L - w)];
    return { S, v, fout, X: [0, L], Y: [0, top(Mx * 1.7)], max: Mx, dom: [0, L], goedTex: `Z(w) = ${vtTex([-k, k * L, 0, 0], 'w')}`, foutTex: [`Z(w) = ${vtTex([-k * 1.5, k * 1.5 * L, 0, 0], 'w')}`, `Z(w) = ${vtTex([-k, k * (L - 3), 0, 0], 'w')}`, `Z(w) = ${vtTex([-k, k * L, 0], 'w')}`] };
  }
  const S = sitBaby(), { G0, p, q, a } = S;
  const v = `Een baby weegt bij de geboorte ${G0} gram. De eerste dagen verliest de baby gewicht: op dag ${p} weegt de baby het minst, ${q} gram. Daarna komt de baby weer bij. We volgen de baby 14 dagen.`;
  const fout = [(d) => a * (d - p - 3) ** 2 + q, (d) => -a * (d - p) ** 2 + G0 + a * p * p, (d) => a * 2 * (d - p) ** 2 + q];
  return { S, v, fout, X: [0, 14], Y: S.graf.y, max: q, dom: [0, 14], min: true, goedTex: `G(d) = ${a}(d - ${p})^2 + ${q}`, foutTex: [`G(d) = ${a}(d - ${p + 3})^2 + ${q}`, `G(d) = -${a}(d - ${p})^2 + ${G0 + a * p * p}`, `G(d) = ${a}(d - ${p})^2 + ${G0}`] };
}
const schetsGraf = (V, f) => rgraf({ x: V.X, y: V.Y, functies: [{ f, van: V.dom[0], tot: V.dom[1] }], klein: true, breed: 260, hoog: 160 });
function vraagVerhaalGraf() {
  const V = verhaalSit();
  return { soort: 'vgraf', opdracht: 'Controleer alle gegevens: de beginwaarde, het hoogste of laagste punt en waar de grafiek eindigt.', html: opgave(V.v) + vraag('Welke grafiek past bij dit verhaal?'), sleutel: V.v,
    rapport: `verhaal → grafiek (${V.S.titel})`, antw: figuren(schetsGraf(V, V.S.f), V.fout.map(f => schetsGraf(V, f))), uitleg: [tx('Controleer de beginwaarde, de top of het dal, en de nulpunten of de eindwaarde.'), `\\text{Een passend model: } ${V.goedTex}`] };
}
function vraagVerhaalKenm() {
  const V = verhaalSit(), [a, b] = V.dom;
  return { soort: 'vkenm', opdracht: 'Denk aan een schets bij het verhaal.', html: opgave(V.v) + vraag(`Wat is het ${V.min ? 'minimum' : 'maximum'} en wat is het domein?`), sleutel: V.v + 'k',
    rapport: `verhaal → kenmerken (${V.S.titel})`, antw: delen([`\\text{${V.min ? 'minimum' : 'maximum'}:}`, getal(V.max)], ['\\text{domein:}', vz([{ a, ai: true, b, bi: true }], '\\text{dom} =')]),
    uitleg: [`\\text{${V.min ? 'minimum' : 'maximum'}: } ${tg(V.max)}`, `\\text{dom} = ${ivTex(a, b)}`, tx(V.min ? 'Het minimum is de y-waarde van het laagste punt.' : 'Het maximum is de y-waarde van het hoogste punt.')] };
}
function vraagVoorschrift() {
  const V = verhaalSit(), opties = schud([V.goedTex, ...V.foutTex]);
  return { soort: 'vvoorschrift', opdracht: 'Tip: controleer met je rekenmachine de beginwaarde, het gegeven punt en de nulpunten.', html: opgave(V.v) + vraag('Welk voorschrift past bij dit verhaal?'), sleutel: V.v + 'v',
    rapport: `verhaal → voorschrift (${V.S.titel})`, antw: { soort: 'keuze', opties: opties.map((t, i) => ({ k: String(i), l: t })), juist: String(opties.indexOf(V.goedTex)) },
    uitleg: [V.goedTex, tx('Dit voorschrift klopt met alle gegevens uit het verhaal. Bij de andere klopt de top, het dal of een nulpunt niet.')] };
}
const D6 = {
  nr: 6, titel: 'Van situatie naar schets', kort: 'Bij een verhaal de passende grafiek, kenmerken en voorschrift vinden.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een verhaal omzetten in een grafiek</div>
      <p>Tot nu toe kreeg je de grafiek en zocht je de betekenis. Nu draaien we het om: je krijgt een verhaal en zoekt de grafiek. Er is niet altijd één juiste schets, maar je schets moet wel kloppen met <b>alle gegevens</b> uit het verhaal.</p></div>
    <div class="kader eig"><div class="kader-titel">Stappenplan: een schets maken bij een situatie</div>
      <ol><li>Welke grootheid staat op de horizontale as, welke op de verticale as? Met welke eenheden?</li><li>Bepaal het praktisch domein.</li>
      <li>Duid alle gegeven punten aan: beginwaarde, eindwaarde, maximum, minimum, nulpunten …</li><li>Bepaal waar de grafiek stijgt en daalt. Gebeurt dat snel (steil) of traag (vlak)?</li>
      <li>Verbind de punten met een vloeiende lijn (geen hoeken!).</li><li>Controle: vertel het verhaal terug met je eigen grafiek. Klopt alles?</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: opendeurdag</div>
      <p>De deuren gaan open om 10 u en sluiten om 18 u. Bij de opening en de sluiting is er niemand binnen. Om 14 u is het het drukst, met 300 bezoekers. De drukte neemt even snel toe als af.</p>
      ${figuur(rgraf({ x: [10, 18], y: [0, 350], xs: 1, ys: 50, xn: 't (uur)', yn: 'bezoekers', functies: [{ f: (t) => -18.75 * (t - 10) * (t - 18), e: '-18.75*(x-10)*(x-18)' }], punten: [{ x: 10, y: 0 }, { x: 14, y: 300 }, { x: 18, y: 0 }] }))}
      <p>Domein $[10 \\,;\\, 18]$, bereik $[0 \\,;\\, 300]$, verloop: stijgend op $[10 \\,;\\, 14]$, dalend op $[14 \\,;\\, 18]$.</p>
      <p><b>Welk voorschrift past?</b> Controleer alle gegevens. $V_1(t) = -18{,}75t^2 + 525t - 3375$ geeft $V_1(10) = 0$, $V_1(14) = 300$ en $V_1(18) = 0$: alles klopt.
      $V_2(t) = -12t^2 + 336t - 2160$ heeft wel nulpunten 10 en 18, maar het maximum is maar 192. $V_3(t) = -18{,}75t^2 + 562{,}5t - 3750$ heeft de top om 15 u en nulpunten 10 en 20.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Een patiënt krijgt om 8 u een geneesmiddel. De concentratie stijgt eerst snel en bereikt na 2 uur een maximum van 6 mg/l. Daarna daalt ze geleidelijk, tot het middel na 10 uur volledig uitgewerkt is.'),
      stappen: ['\\text{Punten: } (0 \\,;\\, 0), \\; (2 \\,;\\, 6) \\text{ (maximum) en } (10 \\,;\\, 0)', '\\text{dom} = [0 \\,;\\, 10], \\quad \\text{ber} = [0 \\,;\\, 6]', '\\text{Na het maximum is de grafiek minder steil: het middel verdwijnt trager dan het in het bloed kwam.}'] },
  ],
  soorten: {
    vgraf: { naam: 'Verhaal → grafiek', gen: vraagVerhaalGraf },
    vkenm: { naam: 'Verhaal → maximum en domein', gen: vraagVerhaalKenm },
    vvoorschrift: { naam: 'Welk voorschrift past?', gen: vraagVoorschrift },
  },
  oefenMix: [['vgraf', 2], ['vkenm', 1], ['vvoorschrift', 1]],
  test: [['vgraf', 4], ['vkenm', 3], ['vvoorschrift', 3]], testSchudden: true,
};

// ===================================================================
//  6 · VAN KENMERKEN NAAR SCHETS
// ===================================================================
const mk = (v) => kg(v).replace('-', '−');
// veelterm met gehele nulpunten: k(x − a)(x − b)(x − c) (of met twee nulpunten)
function poly(n = kies([2, 3])) {
  for (;;) {
    const ns = schud([-4, -3, -2, -1, 0, 1, 2, 3, 4]).slice(0, n).sort((p, q) => p - q);
    if (ns[n - 1] - ns[0] > 7) continue;
    const k = kies(n === 2 ? [1, -1, 0.5, -0.5] : [0.5, -0.5, 0.25, -0.25]);
    const f = (x) => k * ns.reduce((s, r) => s * (x - r), 1);
    const E = extrema(f, ns[0] - 2, ns[n - 1] + 2);
    const ys = [...E.lokMax, ...E.lokMin].map(p => Math.abs(p.y));
    if (Math.max(...ys) > 9 || Math.max(...ys) < 1.5) continue;
    return { ns, k, f, n, E, e: `${k}*${ns.map(r => `(x-(${r}))`).join('*')}` };
  }
}
const pGraf = (P, klein = false, f = P.f) => rgraf({ x: [P.ns[0] - 3, P.ns[P.n - 1] + 3], y: [-10, 10], xs: 1, ys: 2, functies: [{ f, e: f === P.f ? P.e : undefined }], klein, breed: klein ? 230 : 320, hoog: klein ? 200 : 280 });
function tekenCellen(ns, f) {
  const c = [{ y: f(ns[0] - 1) > 0 ? '+' : '−' }];
  ns.forEach((r, i) => { c.push({ x: mk(r), y: '0' }); const m = i < ns.length - 1 ? (r + ns[i + 1]) / 2 : r + 1; c.push({ y: f(m) > 0 ? '+' : '−' }); });
  return c;
}
const tekenOptie = (cellen) => `<table class="tabel tekenschema"><tr><th>x</th>${cellen.map(c => `<td>${c.x ?? ''}</td>`).join('')}</tr><tr><th>f(x)</th>${cellen.map(c => `<td>${c.y ?? ''}</td>`).join('')}</tr></table>`;
function vraagTeken() {
  const P = poly(), goed = tekenCellen(P.ns, P.f), om = goed.map(c => c.y === '+' ? { ...c, y: '−' } : c.y === '−' ? { ...c, y: '+' } : c);
  const verschoven = tekenCellen(P.ns.map(r => r + 1), (x) => P.f(x - 1)), gelijk = goed.map(c => c.y === '−' ? { ...c, y: '+' } : c);
  const opties = schud([goed, om, verschoven, gelijk].map((c, i) => ({ c, i })));
  return { soort: 'teken', opdracht: 'Boven de x-as: +, onder de x-as: −, op de x-as: 0.', html: figuur(pGraf(P)) + vraag('Welk tekenschema hoort bij deze grafiek?'), sleutel: P.e, rapport: 'grafiek → tekenschema',
    antw: { soort: 'keuze', opties: opties.map((o, k) => ({ k: String(k), l: tekenOptie(o.c), html: true, tekst: `schema ${k + 1}` })), juist: String(opties.findIndex(o => o.i === 0)) },
    uitleg: [`\\text{nulpunten: } ${P.ns.map(tg).join(', ')}`, tx('Boven de x-as: +, onder de x-as: −.')] };
}
function vraagGraad() {
  const P = poly(kies([2, 3, 3])), cel = tekenCellen(P.ns, P.f);
  return { soort: 'graad', opdracht: 'Tel de nulpunten.', html: `<p>Van een veeltermfunctie $f$ is het tekenschema gegeven:</p>${tekenOptie(cel)}${vraag('Van welke graad is f minstens?')}`, sleutel: P.e + 'g',
    rapport: 'tekenschema: minimale graad', antw: getal(P.n, { voor: '\\text{graad}' }), uitleg: [tx(`f heeft ${P.n} nulpunten. Een veeltermfunctie van graad n heeft hoogstens n nulpunten.`), `\\text{Dus de graad is minstens } ${P.n}.`] };
}
function vraagNulInterval() {
  const x1 = rnd(-3, 0), x2 = x1 + rnd(2, 4), soort = kies(['drie', 'links', 'rechts']);
  const M = soort === 'rechts' ? -rnd(1, 4) : rnd(2, 6), m = soort === 'links' ? rnd(1, 3) : -rnd(2, 6);
  const verloop = schema('x', 'f(x)', [{ y: PIJL_OP }, { x: mk(x1), y: `${mk(M)} max` }, { y: PIJL_NEER }, { x: mk(x2), y: `${mk(m)} min` }, { y: PIJL_OP }]);
  const L = `]−∞ ; ${mk(x1)}[`, Mi = `]${mk(x1)} ; ${mk(x2)}[`, R = `]${mk(x2)} ; +∞[`;
  const juist = { drie: `Drie nulpunten: één in ${L}, één in ${Mi} en één in ${R}.`, links: `Eén nulpunt, in ${L}.`, rechts: `Eén nulpunt, in ${R}.` }[soort];
  const fout = [`Drie nulpunten: één in ${L}, één in ${Mi} en één in ${R}.`, `Eén nulpunt, in ${L}.`, `Eén nulpunt, in ${R}.`, `Twee nulpunten: één in ${L} en één in ${R}.`, 'Geen nulpunten.'].filter(z => z !== juist);
  const uit = { drie: `Het maximum ${mk(M)} ligt boven de x-as en het minimum ${mk(m)} eronder: de grafiek snijdt de x-as drie keer.`, links: `Het minimum ${mk(m)} ligt boven de x-as: de grafiek snijdt de x-as enkel links van x = ${mk(x1)}.`,
    rechts: `Het maximum ${mk(M)} ligt onder de x-as: de grafiek snijdt de x-as enkel rechts van x = ${mk(x2)}.` }[soort];
  return { soort: 'nulint', opdracht: 'Kijk of de toppen boven of onder de x-as liggen.', html: `<p>Van een veeltermfunctie $f$ is het verloopschema gegeven:</p>${verloop}${vraag('Hoeveel nulpunten heeft f, en in welke intervallen liggen ze?')}`, sleutel: `${x1}${x2}${M}${m}`,
    rapport: 'verloopschema: nulpunten', antw: zinnen(juist, fout, { lijst: true }), uitleg: [tx(uit)] };
}
function vraagGrafKenm() {
  const P = poly(), E = extrema(P.f, P.ns[0], P.ns[P.n - 1]);
  const lijst = `<ul><li>$\\text{dom } f = \\mathbb{R}$</li><li>nulpunten: $${P.ns.map(tg).join(' \\,;\\, ')}$</li>
    <li>snijpunt met de $y$-as: $(0 \\,;\\, ${tg(r2(P.f(0)))})$</li>${[...E.lokMax.map(p => `<li>lokaal maximum $${tg(r1(p.y))}$ voor $x \\approx ${tg(r1(p.x))}$</li>`), ...E.lokMin.map(p => `<li>lokaal minimum $${tg(r1(p.y))}$ voor $x \\approx ${tg(r1(p.x))}$</li>`)].join('')}</ul>`;
  const g1 = (x) => -P.f(x), g2 = (x) => P.f(x - 1), g3 = (x) => P.f(x) * 1.8 + 1;
  return { soort: 'grafkenm', opdracht: 'Controleer elk kenmerk.', html: `<p>Een veeltermfunctie $f$ heeft deze kenmerken:</p>${lijst}${vraag('Welke grafiek past bij al deze kenmerken?')}`, sleutel: P.e + 'k', rapport: 'kenmerken → grafiek',
    antw: figuren(pGraf(P, true), [pGraf(P, true, g1), pGraf(P, true, g2), pGraf(P, true, g3)]), uitleg: [tx('Controleer telkens: nulpunten, snijpunt met de y-as, toppen en dalen.')] };
}
function vraagKanDit() {
  const a = rnd(-2, 2), b = a + rnd(2, 5), c = rnd(1, 5);
  const T = kies([
    { g: `Een veeltermfunctie $f$ heeft de nulpunten ${a} en ${b} en is overal dalend.`, kan: false, r: `Als f overal daalt, kan de grafiek de x-as maar één keer snijden. Twee nulpunten kan dus niet.` },
    { g: `Een veeltermfunctie $f$ van de tweede graad heeft geen nulpunten en heeft een maximum ${c}.`, kan: false, r: `Een tweedegraadsfunctie met een maximum is een bergparabool. Als de top (${c}) boven de x-as ligt, snijdt ze de x-as twee keer.` },
    { g: `Een veeltermfunctie $f$ van de tweede graad heeft geen nulpunten en heeft een minimum ${c}.`, kan: true, r: `Een dalparabool met de top boven de x-as snijdt de x-as nooit: dat kan.` },
    { g: `Een veeltermfunctie $f$ van de derde graad heeft geen nulpunten.`, kan: false, r: 'Een derdegraadsfunctie gaat aan de ene kant naar +∞ en aan de andere kant naar −∞: ze snijdt de x-as minstens één keer.' },
    { g: `Een veeltermfunctie $f$ van de tweede graad heeft de nulpunten ${a} en ${b} en een minimum $-${c}$.`, kan: true, r: 'Een dalparabool met de top onder de x-as snijdt de x-as twee keer: dat kan.' },
    { g: `Een veeltermfunctie $f$ heeft drie nulpunten en maar één top (één extremum).`, kan: false, r: 'Tussen twee nulpunten ligt altijd een top of een dal. Bij drie nulpunten zijn er dus minstens twee extrema.' },
    { g: `Het tekenschema van een veeltermfunctie $f$ is: $+$ $0$ $+$ (bij $x = ${a}$).`, kan: true, r: `Dat kan: de grafiek raakt de x-as in x = ${a} zonder van teken te veranderen (bv. f(x) = (x − ${a})²).` },
  ]);
  const juist = T.kan ? 'Dit kan.' : 'Dit kan niet.';
  return { soort: 'kandit', opdracht: 'Probeer in gedachten een grafiek te schetsen.', html: `<p>${T.g}</p>${vraag('Kan dit?')}`, sleutel: T.g, rapport: W.platteTekst(T.g),
    antw: { soort: 'keuze', opties: [{ k: 'ja', l: '\\text{Dit kan.}' }, { k: 'nee', l: '\\text{Dit kan niet.}' }], juist: T.kan ? 'ja' : 'nee' }, uitleg: [tx(juist), tx(T.r)] };
}
function vraagRaakt() {
  const n1 = rnd(-3, 0), n2 = n1 + rnd(2, 3), n3 = n2 + rnd(2, 3), dub = kies([n1, n2, n3]);
  const tek = [n1, n2, n3].map(r => r === dub);
  let s = '+'; const cel = [];
  const start = kies(['+', '−']); s = start; cel.push({ y: s });
  [n1, n2, n3].forEach((r, i) => { cel.push({ x: mk(r), y: '0' }); if (!tek[i]) s = s === '+' ? '−' : '+'; cel.push({ y: s }); });
  const juist = `In x = ${mk(dub)} raakt de grafiek de x-as: het teken verandert daar niet.`;
  return { soort: 'raakt', opdracht: 'Kijk naar de tekens links en rechts van elk nulpunt.', html: `<p>Van een veeltermfunctie $f$ is het tekenschema gegeven:</p>${tekenOptie(cel)}${vraag('Wat valt op? Hoe ziet de grafiek eruit bij de nulpunten?')}`, sleutel: `${n1}${n2}${n3}${dub}${start}`,
    rapport: 'tekenschema: raakpunt', antw: zinnen(juist, [n1, n2, n3].filter(r => r !== dub).map(r => `In x = ${mk(r)} raakt de grafiek de x-as: het teken verandert daar niet.`).concat(['De grafiek snijdt de x-as in alle drie de nulpunten.'])),
    uitleg: [tx(juist), tx('Bij de andere nulpunten verandert het teken: daar snijdt de grafiek de x-as.')] };
}
const D7 = {
  nr: 7, titel: 'Van kenmerken naar schets', kort: 'Teken- en verloopschema, nulpunten, graad: welke grafiek past? Kan dit wel?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Uit kenmerken een grafiek afleiden</div>
      <p>Nu krijg je geen verhaal, maar enkel kenmerken: nulpunten, een teken- of verloopschema, extrema … Een passende grafiek moet aan <b>alle</b> gegevens voldoen. Soms zijn er meerdere mogelijkheden, soms is het onmogelijk!</p>
      <ul><li>Een veeltermfunctie van graad $n$ heeft <b>hoogstens $n$ nulpunten</b>. Heeft $f$ drie nulpunten, dan is $f$ minstens van de derde graad.</li>
      <li>Tussen twee nulpunten ligt altijd een top of een dal (een extremum).</li>
      <li>In het <b>verloopschema</b> zie je of de toppen boven of onder de $x$-as liggen. Zo vind je hoeveel nulpunten er zijn en in welke intervallen.</li>
      <li>In het <b>tekenschema</b>: verandert het teken bij een nulpunt, dan <b>snijdt</b> de grafiek de $x$-as. Verandert het teken niet (bv. $-$ $0$ $-$), dan <b>raakt</b> de grafiek de $x$-as.</li>
      <li>Een derdegraadsfunctie snijdt de $x$-as altijd minstens één keer.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een verloopschema</div>
      ${schema('x', 'f(x)', [{ y: PIJL_OP }, { x: '−1', y: '4 max' }, { y: PIJL_NEER }, { x: '2', y: '−5 min' }, { y: PIJL_OP }])}
      <p>Het maximum 4 ligt boven de $x$-as en het minimum $-5$ eronder. De grafiek snijdt de $x$-as dus drie keer: in ${M('{]}{-\\infty} \\,;\\, -1{[}')}, in ${M('{]}-1 \\,;\\, 2{[}')} en in ${M('{]}2 \\,;\\, +\\infty{[}')}.</p>
      ${figuur(rgraf({ x: [-4, 5], y: [-7, 6], xs: 1, ys: 1, xn: 'x', yn: 'y', functies: [{ f: (x) => 2 * (x ** 3 / 3 - x * x / 2 - 2 * x) + 5 / 3, e: '2*(x**3/3-x**2/2-2*x)+5/3' }], punten: [{ x: -1, y: 4 }, { x: 2, y: -5 }] }))}</div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: kan dit?</div>
      <p>Een veeltermfunctie heeft de nulpunten 1 en 5 en is overal dalend. <b>Dat kan niet:</b> een dalende grafiek snijdt de $x$-as hoogstens één keer.</p>
      <p>Een tweedegraadsfunctie heeft geen nulpunten en een maximum 3. <b>Dat kan niet:</b> een bergparabool met de top boven de $x$-as snijdt de $x$-as twee keer. Verander je "maximum" in "minimum", dan kan het wel.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `<p>Tekenschema:</p>${tekenOptie([{ y: '+' }, { x: '−1', y: '0' }, { y: '−' }, { x: '2', y: '0' }, { y: '−' }, { x: '4', y: '0' }, { y: '+' }])}<p>Wat valt op aan het nulpunt 2?</p>`,
      stappen: ['\\text{Links en rechts van 2 staat } -: \\text{ het teken verandert niet.}', '\\text{De grafiek raakt de } x\\text{-as in } x = 2 \\text{ (een top op de } x\\text{-as).}'] },
  ],
  soorten: {
    teken: { naam: 'Grafiek → tekenschema', gen: vraagTeken },
    graad: { naam: 'Minimale graad', gen: vraagGraad },
    nulint: { naam: 'Hoeveel nulpunten, en waar?', gen: vraagNulInterval },
    grafkenm: { naam: 'Kenmerken → grafiek', gen: vraagGrafKenm },
    kandit: { naam: 'Kan dit?', gen: vraagKanDit },
    raakt: { naam: 'Snijden of raken?', gen: vraagRaakt },
  },
  oefenMix: [['teken', 1], ['graad', 1], ['nulint', 1], ['grafkenm', 1], ['kandit', 1], ['raakt', 1]],
  test: [['teken', 2], ['graad', 1], ['nulint', 2], ['grafkenm', 2], ['kandit', 2], ['raakt', 1]], testSchudden: true,
};

// ===================================================================
//  7 · EEN GRAFIEK VERTELLEN
// ===================================================================
function verhaalVan(S) {
  const z = S.z;
  if (S.fam === 'conc') return { goed: [z.begin, z.verloop, z.max, z.nul], fout: [[z.begin, z.verloop, S.zF.max, z.nul], [S.zF.begin, z.verloop, z.max, z.nul], [z.begin, 'De concentratie stijgt de hele tijd.', z.max, z.nul]] };
  if (S.fam === 'baby') return { goed: [z.begin, z.verloop, z.min, `Na 14 dagen weegt de baby ${S.G14} gram.`], fout: [[z.begin, z.verloop, S.zF.min, `Na 14 dagen weegt de baby ${S.G14} gram.`], [S.zF.begin, z.verloop, z.min, `Na 14 dagen weegt de baby ${S.G14} gram.`], [z.begin, S.zF.verloop, z.min, `Na 14 dagen weegt de baby ${S.G14} gram.`]] };
  if (S.fam === 'hart') return { goed: [z.begin, z.verloop, z.max, `Op het einde van de test is de hartslag weer ${S.H0} slagen per minuut.`], fout: [[z.begin, z.verloop, S.zF.max, `Op het einde van de test is de hartslag weer ${S.H0} slagen per minuut.`], [S.zF.begin, z.verloop, z.max, `Op het einde is de hartslag weer ${S.H0}.`], [z.begin, S.zF.verloop, z.max, `Op het einde van de test is de hartslag weer ${S.H0} slagen per minuut.`]] };
  return { goed: [z.begin, z.verloop, z.max, z.nul], fout: [[z.begin, z.verloop, S.zF.max, z.nul], [S.zF.begin, z.verloop, z.max, z.nul], [z.begin, z.verloop, z.max, S.zF.nul]] };
}
const kiesVerhaal = () => kies([sitConc, sitBaby, sitHart, sitGriep])();
const verhaalGraf = (S) => figuur(sitGraf(S));
function vraagVertaal() {
  const S = kiesVerhaal(), ks = Object.keys(S.w).filter(k => S.z[k]), k = kies(ks);
  const fout = schud(ks.filter(x => x !== k).map(x => S.z[x])); if (S.zF[k]) fout.unshift(S.zF[k]);
  return { soort: 'vertaal', opdracht: 'Kies de zin die past bij de situatie.', html: `${opgave(S.verhaal.replace(/ De formule geeft.*$/, ''))} De grafiek toont ${yWat(S)}.${verhaalGraf(S)}<p class="midden">In wiskundetaal: $${S.w[k]}$</p>${vraag('Wat betekent dat in de situatie?')}`, sleutel: S.titel + k + S.z[k],
    rapport: `${S.titel}: ${W.platteTekst(S.w[k])}`, antw: zinnen(S.z[k], fout), uitleg: [S.w[k], tx(S.z[k])] };
}
function vraagVerslag() {
  const S = kiesVerhaal(), V = verhaalVan(S), goed = V.goed.join(' ');
  return { soort: 'verslag', opdracht: 'In de andere verslagen staat één fout.', html: `${opgave(S.verhaal.replace(/ De formule geeft.*$/, ''))} De grafiek toont ${yWat(S)}.${verhaalGraf(S)}${vraag('Welk verslag past bij de grafiek?')}`, sleutel: S.titel + goed,
    rapport: `${S.titel}: juiste verslag kiezen`, antw: zinnen(goed, V.fout.map(f => f.join(' '))), uitleg: [tx(goed)] };
}
function vraagAflezenV() {
  const S = kiesVerhaal(), [a, b] = S.dom;
  const x = rnd(Math.ceil(a) + 1, Math.floor(b) - 1), y = S.f(x), d = S.fam === 'conc' ? 1 : 0;
  const stap = S.fam === 'baby' ? 50 : S.fam === 'conc' ? 1 : S.fam === 'hart' ? 10 : 20;
  const juist = W.rond(y, d), opties = schud([juist, W.rond(juist + stap * 2, d), W.rond(juist - stap * 2, d), W.rond(S.f(x + 2 <= b ? x + 2 : x - 2) + stap * 3, d)].filter((v, i, l) => l.indexOf(v) === i));
  return { soort: 'aflezenv', opdracht: 'Lees af op de grafiek.', html: `${opgave(S.verhaal.replace(/ De formule geeft.*$/, ''))} De grafiek toont ${yWat(S)}.${verhaalGraf(S)}${vraag(`Hoe groot is ${yWat(S)} ongeveer ${xZin(S, x)}?`)}`, sleutel: S.titel + x,
    rapport: `${S.titel}: aflezen bij ${S.x} = ${x}`, antw: { soort: 'keuze', opties: opties.map((v, i) => ({ k: String(i), l: `\\text{ongeveer ${kg(v)} ${S.ye}}` })), juist: String(opties.indexOf(juist)) },
    uitleg: [`${S.fn}(${x}) \\approx ${tg(juist)}`] };
}
function vraagContexttaal() {
  const S = kiesVerhaal(), juist = kies([S.z.verloop, S.z.begin, S.z.max || S.z.min]), fn = S.fn;
  const fout = schud([`De functie ${fn} is eerst stijgend en daarna dalend.`, `Het maximum van ${fn} ligt bij ${S.x} = ${tg(S.max ? S.max.x : S.min.x)}.`, `${fn}(0) is de beginwaarde van de functie.`, `De grafiek heeft een top en is daarna dalend.`, `De nulpunten van ${fn} liggen op de x-as.`]).slice(0, 3);
  return { soort: 'context', opdracht: 'Wiskundewoorden zijn bv. functie, maximum, nulpunt, stijgend, grafiek.', html: `${opgave(S.verhaal.replace(/ De formule geeft.*$/, ''))} De grafiek toont ${yWat(S)}.${verhaalGraf(S)}${vraag('Welke zin gebruikt alleen woorden uit de situatie, en geen wiskundewoorden?')}`, sleutel: S.titel + juist,
    rapport: `${S.titel}: contexttaal`, antw: zinnen(juist, fout), uitleg: [tx(juist), tx('De andere zinnen gebruiken wiskundige vaktaal.')] };
}
const D8 = {
  nr: 8, titel: 'Een grafiek vertellen', kort: 'Een grafiek omzetten in een verhaal in de taal van de situatie.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een goede grafiek vertelt een verhaal</div>
      <p>In dit hoofdstuk vertaal je een grafiek naar een verhaal, <b>zonder wiskundige vaktaal</b>. Zo toon je dat je echt begrijpt wat de grafiek zegt.</p></div>
    <div class="kader eig"><div class="kader-titel">Checklist voor een goed verhaal</div>
      <ul><li>Ik vermeld de beginwaarde (met eenheid).</li><li>Ik vermeld wanneer de grootheid toeneemt en afneemt.</li>
      <li>Ik vermeld de hoogste en laagste waarde(n) én wanneer ze bereikt worden.</li><li>Ik vermeld nulpunten (of leg uit waarom er geen zijn).</li>
      <li>Ik zeg iets over de snelheid van de verandering (snel/traag).</li><li>Ik vermeld de eindwaarde.</li>
      <li>Ik gebruik de taal van de situatie, géén woorden als "functie", "nulpunt", "stijgend" of "maximum".</li><li>Mijn verhaal is logisch: het kan echt zo gebeurd zijn.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: vertaal naar contexttaal</div>
      <p>Het aantal bezoekers $J$ in een jeugdhuis op een zaterdag, $t$ uur na 14 u:</p>
      <table class="tabel"><tr><th>Wiskundetaal</th><th>Contexttaal</th></tr>
      <tr><td>$J(0) = 8$</td><td>Om 14 u zijn er 8 bezoekers in het jeugdhuis.</td></tr>
      <tr><td>$J$ is stijgend op $[0 \\,;\\, 2{,}5]$.</td><td>Tot half vijf komen er steeds meer bezoekers bij.</td></tr>
      <tr><td>$J$ heeft een lokaal minimum 12 voor $t = 5{,}5$.</td><td>Om half acht is het even rustig: 12 bezoekers. Daarna wordt het weer drukker.</td></tr>
      <tr><td>Het maximum van $J$ is ongeveer 63.</td><td>Op het drukste moment van de avond zijn er ongeveer 63 bezoekers.</td></tr>
      <tr><td>$J(12) = 0$</td><td>Om 2 u 's nachts is iedereen naar huis.</td></tr>
      <tr><td>$\\text{ber } J = [0 \\,;\\, 63]$</td><td>Het aantal bezoekers ligt tussen 0 en 63.</td></tr></table></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: de griepgolf vertellen</div>
      <p>Bij het begin van de griepgolf is nog geen enkele leerling ziek. Daarna breidt de griep zich uit: het aantal zieke leerlingen neemt eerst traag toe, daarna steeds sneller.
      In week 8 bereikt de griepgolf haar hoogtepunt met 256 zieke leerlingen. Vanaf dan neemt het aantal zieken af, en vanaf week 10 zelfs heel snel. Na 12 weken is de griepgolf voorbij.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${figuur(rgraf({ x: [0, 14], y: [3200, 3900], xs: 1, ys: 100, xn: 'd (dagen na de geboorte)', yn: 'gewicht (gram)', functies: [{ f: (d) => 6 * d * d - 60 * d + 3500, e: '6*x**2-60*x+3500' }] }))}<p>Vertel de grafiek.</p>`,
      stappen: ['\\text{Bij de geboorte weegt de baby 3500 gram.}', '\\text{De eerste 5 dagen verliest de baby gewicht: op dag 5 weegt de baby het minst, 3350 gram.}', '\\text{Daarna komt de baby steeds sneller bij: op dag 10 weegt de baby weer 3500 gram, op dag 14 al 3836 gram.}'] },
  ],
  soorten: {
    vertaal: { naam: 'Wiskundetaal → contexttaal', gen: vraagVertaal },
    verslag: { naam: 'Het juiste verslag kiezen', gen: vraagVerslag },
    aflezenv: { naam: 'Aflezen op de grafiek', gen: vraagAflezenV },
    context: { naam: 'Welke zin is in contexttaal?', gen: vraagContexttaal },
  },
  oefenMix: [['vertaal', 2], ['verslag', 1], ['aflezenv', 1], ['context', 1]],
  test: [['vertaal', 4], ['verslag', 3], ['aflezenv', 2], ['context', 1]], testSchudden: true,
};

// ===================================================================
//  8 · FOUTENANALYSE
// ===================================================================
function uitspraken() {
  const fam = kies(['conc', 'saldo', 'baby', 'doos', 'spoed']);
  const S = SITUATIES[fam](), L = [];
  if (fam === 'conc') {
    const { T, tm, Mx } = S;
    L.push({ t: `dom C = ℝ en ber C = [0 ; ${T}]`, ok: false, r: `Het praktisch domein is [0 ; ${T}] en het bereik is [0 ; ${kg(Mx)}]: ${T} is een x-waarde.` });
    L.push({ t: `Het maximum is ${tm}.`, ok: false, r: `${tm} is de x-waarde (de tijd). Het maximum is ${kg(Mx)} mg/l, na ${tm} uur.`, c: { vraag: 'Hoe groot is het maximum?', antw: getal(Mx, { dec: 2, voor: 'C_{max} =', na: '\\text{ mg/l}' }) } });
    L.push({ t: `C is stijgend op [0 ; ${T}].`, ok: false, r: `C stijgt op [0 ; ${tm}] en daalt op [${tm} ; ${T}].`, c: { vraag: 'Tot hoeveel uur na inname stijgt de concentratie?', antw: getal(tm, { voor: 't =', na: '\\text{ uur}' }) } });
    L.push({ t: `Na ${T} uur wordt de concentratie negatief.`, ok: false, r: `Na ${T} uur stijgt de formule weer (geen negatieve waarden), maar dat ligt buiten het praktisch domein: ${S.ding} is dan uitgewerkt.` });
    L.push({ t: `De concentratie is het hoogst na ${tm} uur: ${kg(Mx)} mg/l.`, ok: true, r: `Hoogste punt: (${tm} ; ${kg(Mx)}).` });
    L.push({ t: `Na ${T} uur is ${S.ding} uitgewerkt.`, ok: true, r: `C(${T}) = 0.` });
    L.push({ t: 'C(0) = 0: bij inname zit er nog niets in het bloed.', ok: true, r: 'Juist.' });
  }
  if (fam === 'saldo') {
    const { q1, q2, S0 } = S;
    L.push({ t: `S is positief op [0 ; ${q1}] en negatief op [${q1} ; 12].`, ok: false, r: `S is negatief tussen ${q1} en ${q2} en daarna weer positief.`, c: { vraag: 'Tot hoeveel maanden na 1 september staat de rekening in het rood?', antw: getal(q2, { voor: 'm =' }) } });
    L.push({ t: `De jeugdbeweging staat in het rood vanaf 1 ${MAANDEN[q1 + 2]}.`, ok: false, r: `S(${q1}) = 0: in het rood vanaf 1 ${MAANDEN[q1]} (${q1} maanden na 1 september).` });
    L.push({ t: `Het meeste geld heeft de jeugdbeweging na ongeveer ${kg(r1(S.lokMax.x))} maanden: ${kg(r1(S.lokMax.y))} euro.`, ok: false, r: `Dat is een lokaal maximum. Het absolute maximum is S(0) = ${S0} euro, op 1 september.`, c: { vraag: 'Hoeveel geld heeft de jeugdbeweging op het moment dat ze het meeste geld heeft?', antw: getal(S0, { na: '\\text{ euro}' }) } });
    L.push({ t: `Op 1 september staat er ${S0} euro op de rekening.`, ok: true, r: `S(0) = ${S0}.` });
    L.push({ t: `Van 1 ${MAANDEN[q1]} tot 1 ${MAANDEN[q2]} staat de rekening in het rood.`, ok: true, r: 'Juist: daar is S negatief.' });
    L.push({ t: `De grootste schuld is ongeveer ${kg(r0(-S.min.y))} euro.`, ok: true, r: `Laagste punt ≈ (${kg(r1(S.min.x))} ; ${kg(r1(S.min.y))}).` });
  }
  if (fam === 'baby') {
    const { p, q, G0 } = S;
    L.push({ t: `Het minimum is ${p}.`, ok: false, r: `${p} is de dag (x-waarde). Het minimum is ${q} gram.`, c: { vraag: 'Hoe groot is het minimum?', antw: getal(q, { na: '\\text{ gram}' }) } });
    L.push({ t: `De baby verliest dus ${p} gram.`, ok: false, r: `De baby verliest ${G0} − ${q} = ${G0 - q} gram.`, c: { vraag: 'Hoeveel gram verliest de baby?', antw: getal(G0 - q, { na: '\\text{ gram}' }) } });
    L.push({ t: `Na dag ${p} neemt het gewicht verder af.`, ok: false, r: `Na dag ${p} neemt het gewicht toe: G stijgt op [${p} ; 14].` });
    L.push({ t: 'Er zijn geen nulpunten, dus de functie bestaat niet op de x-as.', ok: false, r: 'Geen nulpunten betekent dat het gewicht nooit 0 gram is. De functie bestaat wel voor elke x.' });
    L.push({ t: `Op dag ${p} weegt de baby het minst: ${q} gram.`, ok: true, r: `Laagste punt (${p} ; ${q}).` });
    L.push({ t: `Op dag ${2 * p} weegt de baby opnieuw ${G0} gram.`, ok: true, r: `G(${2 * p}) = ${G0}.` });
    L.push({ t: 'Het gewicht is nooit 0 gram: G heeft geen nulpunten.', ok: true, r: 'Juist.' });
  }
  if (fam === 'doos') {
    const { A, B } = S;
    L.push({ t: `Het praktisch domein is [0 ; ${A / 2}], want V(${A / 2}) = 0.`, ok: false, r: `Het vierkantje moet kleiner zijn dan de helft van de breedte: praktisch domein ]0 ; ${kg(B / 2)}[.` });
    L.push({ t: 'Het bereik is ℝ, want V is een veeltermfunctie van de derde graad.', ok: false, r: `Op het praktisch domein ligt het volume tussen 0 en ongeveer ${kg(r1(S.max.y))} cm³: ber V = ]0 ; ${kg(r1(S.max.y))}].` });
    L.push({ t: `De doos is het grootst bij x = ${kg(r1(S.max.y))} cm.`, ok: false, r: `${kg(r1(S.max.y))} is het volume (y-waarde). Het volume is het grootst bij x ≈ ${kg(r1(S.max.x))} cm.`, c: { vraag: 'Bij welke x is de doos het grootst?', antw: getal(S.max.x, { dec: 1, voor: 'x =', na: '\\text{ cm}' }) } });
    L.push({ t: `Het praktisch domein is ]0 ; ${kg(B / 2)}[.`, ok: true, r: 'Juist.' });
    L.push({ t: `Het grootste volume is ongeveer ${kg(r1(S.max.y))} cm³.`, ok: true, r: `Hoogste punt ≈ (${kg(r1(S.max.x))} ; ${kg(r1(S.max.y))}).` });
    L.push({ t: 'Het wiskundig domein is ℝ.', ok: true, r: 'Juist: in een veeltermfunctie kan je elk getal invullen.' });
  }
  if (fam === 'spoed') {
    const { t1, t2, t3 } = S;
    L.push({ t: `W stijgt op ]6 ; ${t1}[ en daalt op [${t2} ; ${t3}].`, ok: false, r: `W stijgt op [6 ; ${t1}] en op [${t2} ; ${t3}], en daalt op [${t1} ; ${t2}] en op [${t3} ; 22].` });
    L.push({ t: `Om ${t2} u zitten er het minst patiënten van de hele dag in de wachtzaal.`, ok: false, r: `${t2} u is een lokaal minimum. Om 6 u of om 22 u zijn er minder patiënten (W(6) ≈ ${kg(r0(S.W6))}, W(22) ≈ ${kg(r0(S.W22))}).` });
    L.push({ t: `Het drukste moment is om ${S.max.y} u.`, ok: false, r: `${S.max.y} is het aantal patiënten. Het drukste moment is om ${t3} u.`, c: { vraag: 'Om hoe laat is het drukste moment?', antw: getal(t3, { voor: '\\text{om}', na: '\\text{ u}' }) } });
    L.push({ t: `Om ${t3} u is het het drukst: ${S.max.y} patiënten.`, ok: true, r: 'Juist.' });
    L.push({ t: 'De wachtzaal is nooit helemaal leeg tussen 6 u en 22 u.', ok: true, r: 'Juist: W heeft geen nulpunten.' });
    L.push({ t: `Tussen ${t1} u en ${t2} u neemt het aantal patiënten af.`, ok: true, r: 'Juist.' });
  }
  if (S.min && S.min.y < 0 && W.grensgeval(-S.min.y, 0)) S.min.y += 0.01;
  return { S, L };
}
function vraagJuistFout() {
  const { S, L } = uitspraken(), u = kies(L);
  return { soort: 'juistfout', opdracht: 'Tip: controleer met het grafiekvenster.', html: `${sitOpgave(S)}<p>Een leerling schrijft:</p><p class="midden"><i>"${u.t}"</i></p>${vraag('Is die zin juist of fout?')}${sitVenster(S, { t: 'vfsm', buiten: true })}`, sleutel: S.e + u.t,
    rapport: `${S.titel}: "${u.t}"`, antw: { soort: 'keuze', opties: [{ k: 'j', l: '\\text{juist}' }, { k: 'f', l: '\\text{fout}' }], juist: u.ok ? 'j' : 'f' }, uitleg: [tx(u.ok ? 'Juist.' : 'Fout.'), tx(u.r)] };
}
function vraagWelkeFout() {
  const { S, L } = uitspraken(), f = kies(L.filter(u => !u.ok)), j = schud(L.filter(u => u.ok)).slice(0, 3);
  const naam = kies(['Ruben', 'Amina', 'Lotte', 'Jonas', 'Sem', 'Noor', 'Yassin', 'Elif']);
  return { soort: 'welkefout', opdracht: 'Tip: controleer met het grafiekvenster.', html: sitOpgave(S, `${vraag(`${naam} schreef vier zinnen over deze situatie. Eén zin is fout. Welke?`)}${sitVenster(S, { t: 'vfsm', buiten: true })}`), sleutel: S.e + f.t,
    rapport: `${S.titel}: fout zoeken`, antw: zinnen(f.t, j.map(u => u.t)), uitleg: [tx(`Fout: "${f.t}"`), tx(f.r)] };
}
function vraagVerbeter() {
  let S, u; do { const r = uitspraken(); S = r.S; u = kies(r.L.filter(x => x.c)); } while (!u);
  return { soort: 'verbeter', opdracht: 'Tip: controleer met het grafiekvenster.', html: `${sitOpgave(S)}<p>Een leerling schrijft deze zin. De zin is fout:</p><p class="midden"><i>"${u.t}"</i></p>${vraag(u.c.vraag)}${sitVenster(S, { t: 'vfsm', buiten: true })}`, sleutel: S.e + u.t,
    rapport: `${S.titel}: verbeter "${u.t}"`, antw: u.c.antw, uitleg: [tx(u.r)] };
}
const D9 = {
  nr: 9, titel: 'Foutenanalyse', kort: 'Fouten van leerlingen opsporen en verbeteren.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Typische fouten</div>
      <p>In de werkbundel beantwoordden Ruben, Amina, Lotte, Jonas en Sem vragen over de situaties uit hoofdstuk 1 en 2. In hun antwoorden zitten fouten die vaak gemaakt worden:</p>
      <ul><li><b>x-waarde en y-waarde verwisselen</b>: "het maximum is 4" terwijl 4 de tijd is (het maximum is 12,8 mg/l, na 4 uur).</li>
      <li><b>Domein en bereik verwarren</b>: het bereik gaat over de $y$-waarden, het domein over de $x$-waarden.</li>
      <li><b>Een lokaal maximum of minimum verwarren met het absolute</b>: een dal is niet altijd het rustigste moment van de dag; het meeste geld kan aan de rand van het domein staan.</li>
      <li><b>Het praktisch domein vergeten</b>: wat de formule geeft buiten het praktisch domein, heeft geen betekenis (V(16) bij de doos).</li>
      <li><b>Tekenschema en verloopschema verwarren</b>: "in het rood" gaat over het teken, "het saldo daalt" over het verloop.</li>
      <li><b>Haakjes bij de grenzen</b>: $W$ stijgt op $[6 \\,;\\, 9]$, niet op ${M('{]}6 \\,;\\, 9{[}')}$.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: Ruben en de pijnstiller</div>
      <p>$C(t) = 0{,}05t^3 - 1{,}2t^2 + 7{,}2t$ met $0 \\leq t \\leq 12$. Ruben schreef:</p>
      <ul><li><i>"dom C = ℝ en ber C = [0 ; 12]"</i> → Het praktisch domein is $[0 \\,;\\, 12]$ en het bereik is $[0 \\,;\\, 12{,}8]$: 12 is een $x$-waarde.</li>
      <li><i>"Het maximum is 4."</i> → Het maximum is 12,8 mg/l (na 4 uur): 4 is de $x$-waarde.</li>
      <li><i>"C is stijgend op [0 ; 12,8]."</i> → $C$ stijgt op $[0 \\,;\\, 4]$ en daalt op $[4 \\,;\\, 12]$.</li>
      <li><i>"Na 12 uur wordt de concentratie negatief."</i> → Na 12 uur is de pijnstiller uitgewerkt; wat de formule daarna geeft, ligt buiten het praktisch domein.</li></ul></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Baby: $G(d) = 6d^2 - 60d + 3500$ met $0 \\leq d \\leq 14$.')}<p>Lotte: <i>"Het minimum is 5. De baby verliest dus 5 gram."</i></p>`,
      stappen: ['\\text{Fout: 5 is de dag (x-waarde). Het minimum is } G(5) = 3350 \\text{ gram.}', '\\text{De baby verliest } 3500 - 3350 = 150 \\text{ gram.}'] },
  ],
  soorten: {
    juistfout: { naam: 'Juist of fout?', gen: vraagJuistFout },
    welkefout: { naam: 'Welke zin is fout?', gen: vraagWelkeFout },
    verbeter: { naam: 'Verbeter de fout', gen: vraagVerbeter },
  },
  oefenMix: [['juistfout', 2], ['welkefout', 1], ['verbeter', 1]],
  test: [['juistfout', 4], ['welkefout', 3], ['verbeter', 3]], testSchudden: true,
};

// ===================================================================
//  9 · MODELLEN AANPASSEN
// ===================================================================
function vraagConcModel() {
  const [T, Mx] = kies([[10, 8], [12, 12.8], [9, 10.8], [12, 16], [15, 10], [6, 4]]), tm = T / 3, a = 27 * Mx / (4 * T ** 3);
  const pv = venster({ fs: [{ e: 'a*x*(x-b)**2', n: 'C' }], par: [{ n: 'a', w: 0.01 }, { n: 'b', w: 5 }], X: [0, T + 3], Y: [0, top(Mx * 1.6)], a: 0, b: T + 3, xv: 't', xe: 'uur', ye: 'mg/l', xn: 't (uur)', yn: 'concentratie (mg/l)', t: 'pvm', pts: [{ x: tm, y: Mx }, { x: T, y: 0 }], buiten: false, geenDomein: true });
  return { soort: 'conc', opdracht: 'Tip: vul in het grafiekvenster waarden in voor a en b. Gaat de grafiek door de oranje punten?', html: `${opgave(`Een apotheker beschrijft de concentratie van een nieuw geneesmiddel (in mg/l) met het model hieronder. Het middel moet na ${T} uur volledig uitgewerkt zijn. De maximale concentratie moet ${kg(Mx)} mg/l zijn.`)}<p class="midden">$C(t) = a \\cdot t \\cdot (t - b)^2$</p>${vraag('Welke waarden hebben b en a? Rond a af op 0,001.')}${pv}`,
    sleutel: `${T}${Mx}`, rapport: `concentratiemodel: a en b (uitgewerkt na ${T} uur, max ${kg(Mx)})`, antw: delen(['b =', getal(T)], ['a =', getal(a, { dec: 3 })]),
    uitleg: [`C(b) = 0: \\text{ het middel is uitgewerkt na } b \\text{ uur, dus } b = ${T}`, `\\text{Het maximum ligt bij } t = \\dfrac{b}{3} = ${tg(tm)}: \\; a \\cdot ${tg(tm)} \\cdot ${tg(tm - T)}^2 = ${tg(Mx)} \\Rightarrow a \\approx ${tg(W.rond(a, 3))}`] };
}
function vraagFonteinModel() {
  const [L, H] = kies([[6, 3], [8, 4], [10, 5], [8, 2], [12, 3], [10, 4]]), a = -4 * H / L / L;
  const pv = venster({ fs: [{ e: 'a*x*(x-b)', n: 'h' }], par: [{ n: 'a', w: -0.1 }, { n: 'b', w: 4 }], X: [0, L + 3], Y: [0, top(H * 1.6)], a: 0, b: L + 3, xv: 'x', xe: 'm', ye: 'm', xn: 'x (m)', yn: 'hoogte (m)', t: 'pvm', pts: [{ x: L / 2, y: H }, { x: L, y: 0 }], buiten: false, geenDomein: true });
  return { soort: 'fontein', opdracht: 'Tip: vul in het grafiekvenster waarden in voor a en b. Let op: a is negatief.', html: `${opgave(`Een tuinarchitect ontwerpt een fontein met het model hieronder (x en h in meter). De straal moet ${L} m verder neerkomen en maximaal ${kg(H)} m hoog zijn.`)}<p class="midden">$h(x) = a \\cdot x \\cdot (x - b)$</p>${vraag('Welke waarden hebben b en a? Rond a af op 0,001.')}${pv}`,
    sleutel: `${L}${H}`, rapport: `fonteinmodel: a en b (${L} m, ${kg(H)} m hoog)`, antw: delen(['b =', getal(L)], ['a =', getal(a, { dec: 3 })]),
    uitleg: [`h(b) = 0: \\text{ de straal komt neer bij } x = b, \\text{ dus } b = ${L}`, `\\text{De top ligt in het midden, bij } x = ${tg(L / 2)}: \\; a \\cdot ${tg(L / 2)} \\cdot (${tg(L / 2)} - ${L}) = ${tg(H)} \\Rightarrow a = ${tg(W.rond(a, 3))}`] };
}
function vraagBabyModel() {
  const G0 = kies([3000, 3500, 4000]), pct = kies([5, 8, 10]), p = kies([4, 5]), q = G0 * (1 - pct / 100), a = (G0 - q) / p / p;
  const pv = venster({ fs: [{ e: 'a*(x-p)**2+q', n: 'G' }], par: [{ n: 'a', w: 1 }, { n: 'p', w: 1 }, { n: 'q', w: 3000 }], X: [0, 14], Y: [Math.floor((q - 300) / 100) * 100, Math.ceil((G0 + 500) / 100) * 100], a: 0, b: 14, xv: 'd', xe: 'dagen', ye: 'gram', xn: 'd (dagen)', yn: 'gewicht (gram)', t: 'pvm', pts: [{ x: 0, y: G0 }, { x: p, y: q }], buiten: false, geenDomein: true });
  const naam = kies(['Noor', 'Lina', 'Adam', 'Milan']);
  return { soort: 'baby', opdracht: 'Tip: p en q lees je meteen af uit het laagste punt. Zoek daarna a.', html: `${opgave(`Baby ${naam} weegt bij de geboorte ${G0} gram. ${naam} verliest ${pct} % van het geboortegewicht en weegt het minst op dag ${p}. We gebruiken het model`)}<p class="midden">$G(d) = a(d - p)^2 + q$</p>${vraag('Welke waarden hebben p, q en a?')}${pv}`,
    sleutel: `${G0}${pct}${p}`, rapport: `babymodel (${G0} g, ${pct} %, dag ${p})`, antw: delen(['p =', getal(p)], ['q =', getal(q)], ['a =', getal(a, { dec: 2 })]),
    uitleg: [`\\text{Laagste punt } (p \\,;\\, q) = (${p} \\,;\\, ${tg(q)}), \\text{ want } ${pct}\\,\\% \\text{ van } ${G0} = ${tg(G0 - q)} \\text{ en } ${G0} - ${tg(G0 - q)} = ${tg(q)}`,
      `G(0) = a \\cdot ${p}^2 + ${tg(q)} = ${G0} \\Rightarrow a = \\dfrac{${tg(G0 - q)}}{${p * p}} \\approx ${tg(W.rond(a, 2))}`, tx(`${naam} zit terug op het geboortegewicht op dag ${2 * p}.`)] };
}
function vraagRol() {
  const T = kies([
    { m: 'C(t) = a \\cdot t \\cdot (t - b)^2', v: 'Welke parameter bepaalt wanneer het geneesmiddel uitgewerkt is?', j: 'b: na b uur is de concentratie weer 0.', f: ['a: na a uur is de concentratie 0.', 'a en b samen: na a · b uur.', 'Geen enkele: het middel is altijd na 12 uur uitgewerkt.'] },
    { m: 'C(t) = a \\cdot t \\cdot (t - b)^2', v: 'Wat gebeurt er als je a groter maakt (b blijft gelijk)?', j: 'De concentratie wordt overal groter, maar het middel is op hetzelfde moment uitgewerkt.', f: ['Het middel is later uitgewerkt.', 'Het maximum valt vroeger.', 'De grafiek wordt een dalparabool.'] },
    { m: 'C(t) = a \\cdot t \\cdot (t - b)^2', v: 'Wanneer valt het maximum?', j: 'Altijd op een derde van b: bij t = b/3. Het maximum valt dus vroeger als het middel vroeger uitgewerkt is.', f: ['Altijd in het midden: bij t = b/2.', 'Altijd bij t = a.', 'Het maximum valt altijd na 4 uur.'] },
    { m: 'h(x) = a \\cdot x \\cdot (x - b)', v: 'Wat gebeurt er met de straal als je a dichter bij 0 brengt (bij dezelfde b)?', j: 'De straal wordt minder hoog, maar komt op dezelfde plaats neer.', f: ['De straal komt verder neer.', 'De straal wordt hoger.', 'De straal komt dichter bij de spuitmond neer.'] },
    { m: 'h(x) = a \\cdot x \\cdot (x - b)', v: 'Wat gebeurt er met de straal als je b groter maakt (bij dezelfde a)?', j: 'De straal komt verder neer en wordt ook hoger.', f: ['De straal komt verder neer, maar wordt lager.', 'Er verandert niets.', 'De straal komt dichter bij de spuitmond neer.'] },
    { m: 'G(d) = a(d - p)^2 + q', v: 'Wat betekenen p en q in de situatie?', j: 'Op dag p weegt de baby het minst: q gram.', f: ['Op dag q weegt de baby het minst: p gram.', 'p is het geboortegewicht en q de dag.', 'p en q zijn de nulpunten.'] },
    { m: 'C(t) = 0{,}05t^3 - 1{,}2t^2 + 7{,}2t = 0{,}05 \\cdot t \\cdot (t - 12)^2', v: 'In welke vorm zie je meteen wanneer het middel uitgewerkt is?', j: 'In de tweede vorm: 0,05 · t · (t − 12)² toont meteen de nulpunten 0 en 12.', f: ['In de eerste vorm: daar staan alle coëfficiënten.', 'In geen van beide: je moet altijd het grafiekvenster gebruiken.', 'In de eerste vorm: het nulpunt is 7,2.'] },
  ]);
  return { soort: 'rol', opdracht: 'Kies het juiste antwoord.', html: `<p class="midden">$${T.m}$</p>${vraag(T.v)}`, sleutel: T.m + T.v, rapport: `${W.platteTekst(T.m)}: ${T.v}`, antw: zinnen(T.j, T.f), uitleg: [tx(T.j)] };
}
const D10 = {
  nr: 10, titel: 'Modellen op maat', kort: 'Parameters met een betekenis: een model op maat maken.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een model op maat</div>
      <p>Tot nu toe kreeg je een kant-en-klaar voorschrift. Nu maak je zelf een model op maat, met <b>parameters</b>. Kies een vorm waarin je de betekenis van de parameters meteen ziet:</p>
      <table class="tabel"><tr><th>Model</th><th>Betekenis van de parameters</th></tr>
      <tr><td>$C(t) = a \\cdot t \\cdot (t - b)^2$</td><td>nulpunten $0$ en $b$: na $b$ uur is het middel uitgewerkt; het maximum ligt bij $t = \\dfrac{b}{3}$; $a$ bepaalt hoe hoog het maximum is</td></tr>
      <tr><td>$h(x) = a \\cdot x \\cdot (x - b)$</td><td>nulpunten $0$ en $b$: de straal komt neer bij $x = b$; de top ligt in het midden; $a < 0$ (bergparabool) bepaalt hoe hoog</td></tr>
      <tr><td>$G(d) = a(d - p)^2 + q$</td><td>top (laagste punt) $(p \\,;\\, q)$: op dag $p$ weegt de baby het minst, $q$ gram; $a$ volgt uit het geboortegewicht $G(0)$</td></tr></table></div>
    <div class="kader eig"><div class="kader-titel">Zo probeer je een model uit in het grafiekvenster</div>
      <ol><li>In het grafiekvenster staat het model al klaar, met vakjes voor de parameters (bv. <i>a</i> en <i>b</i>).</li>
      <li>Typ een waarde in een vakje. De grafiek verandert meteen.</li>
      <li>De <b>oranje punten</b> zijn de gegevens uit het verhaal. Pas de parameters aan tot de grafiek door die punten gaat.</li>
      <li>Zoek eerst de parameter die je meteen ziet (bv. het nulpunt $b$), en daarna de andere.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een geneesmiddel op maat</div>
      <p>$C(t) = a \\cdot t \\cdot (t - b)^2$; het middel is na 10 uur uitgewerkt en het maximum is 8 mg/l.</p>
      <p>$b = 10$ (het nulpunt). Het maximum ligt bij $t = \\dfrac{10}{3} \\approx 3{,}33$ uur (3 uur en 20 minuten): $a \\cdot \\dfrac{10}{3} \\cdot \\left(\\dfrac{10}{3} - 10\\right)^2 = 8 \\Rightarrow a = 0{,}054$.</p>
      ${figuur(rgraf({ x: [0, 12], y: [0, 10], xs: 1, ys: 1, xn: 't (uur)', yn: 'concentratie (mg/l)', functies: [{ f: (t) => 0.054 * t * (t - 10) ** 2, e: '0.054*x*(x-10)**2', van: 0, tot: 10 }], punten: [{ x: 10 / 3, y: 8 }, { x: 10, y: 0 }] }))}
      <p>Verander je $b$, dan verschuift ook het maximum (altijd op een derde van $b$). Het maximum vroeger laten vallen zonder het tijdstip van uitwerken te veranderen, kan dus niet met dit model.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: babygewicht</div>
      <p>$G(d) = 6d^2 - 60d + 3500 = 6(d - 5)^2 + 3350$: op dag $p = 5$ weegt de baby het minst, $q = 3350$ gram. Werk uit ter controle: $6(d^2 - 10d + 25) + 3350 = 6d^2 - 60d + 3500$.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Fontein: $h(x) = a \\cdot x \\cdot (x - b)$. De straal moet 6 m verder neerkomen en maximaal 3 m hoog zijn.')}<p>Bepaal $a$ en $b$.</p>`,
      stappen: ['b = 6 \\text{ (de straal komt neer bij } x = 6)', '\\text{top in het midden: } h(3) = a \\cdot 3 \\cdot (3 - 6) = -9a = 3 \\Rightarrow a = -\\dfrac{1}{3} \\approx -0{,}333'] },
  ],
  soorten: {
    conc: { naam: 'Geneesmiddel: a en b', gen: vraagConcModel },
    fontein: { naam: 'Fontein: a en b', gen: vraagFonteinModel },
    baby: { naam: 'Babygewicht: p, q en a', gen: vraagBabyModel },
    rol: { naam: 'Wat doet de parameter?', gen: vraagRol },
  },
  oefenMix: [['conc', 1], ['fontein', 1], ['baby', 1], ['rol', 1]],
  test: [['conc', 2], ['fontein', 2], ['baby', 3], ['rol', 3]], testSchudden: true,
};

// ===================================================================
//  EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D11 = {
  nr: 11, titel: 'Eindtest veeltermfuncties in context', kort: 'Uit elk hoofdstuk één vraag.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest krijg je uit elk hoofdstuk één vraag. Herhaal gerust de theorie van een vorig deel.</p></div>${LET_OP}${GEOGEBRA}${AFSPRAAK}`,
  voorbeelden: [],
  soorten: {
    e1: mix(D1, 'betekenis', 'Woordenlijst'), e2: mix(D2, 'max', 'Aflezen en interpreteren'), e3: mix(D3, 'praktdom', 'Praktisch domein'),
    e4: mix(D4, 'extra', 'Kritisch kijken'), e5: mix(D5, 'grafsit', 'Koppelen'), e6: mix(D6, 'vgraf', 'Van situatie naar schets'),
    e7: mix(D7, 'nulint', 'Van kenmerken naar schets'), e8: mix(D8, 'vertaal', 'Een grafiek vertellen'), e9: mix(D9, 'welkefout', 'Foutenanalyse'), e10: mix(D10, 'fontein', 'Modellen aanpassen'),
  },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: false,
};

// alle opgaven met tekst links uitgelijnd in gewone tekstgrootte
for (const D of [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen;
    s.gen = () => {
      const v = { ...g() };
      if (v.html) v.html = woorden(v.html);
      if (v.html && !/^<div class="tekstopgave">/.test(v.html)) v.html = `<div class="tekstopgave">${v.html}</div>`;
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
}
for (const D of [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11]) {
  D.theorie = woorden(D.theorie);
  for (const vb of D.voorbeelden || []) if (vb.html) vb.html = woorden(vb.html);
}

Leerpaden.registreer({
  code: 'veeltermfuncties-context',
  titel: 'Veeltermfuncties in context',
  ondertitel: 'Wiskunde · 5WW / 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert wat de kenmerken van een veeltermfunctie (domein, bereik, beginwaarde, nulpunten, teken- en verloopschema, maximum en minimum) <b>betekenen in een echte situatie</b>:
    een geneesmiddel in het bloed, de drukte op een spoeddienst, het gewicht van een pasgeboren baby, het budget van een jeugdbeweging … Elk deel volgt een hoofdstuk van de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p><b>Geen GeoGebra nodig:</b> bij de rekenvragen staat de grafiek al klaar in een grafiekvenster, met de formule erin.
    <b>Moeilijke woorden</b> hebben een oranje stippellijn: raak ze aan voor de uitleg. <b>Afronden:</b> bij elke rekenvraag staat op hoeveel decimalen je afrondt.</p>`,
  groepen: [
    { titel: 'A · Kenmerken in context (hoofdstuk 0–1)', delen: [1, 2] },
    { titel: 'B · Domein en kritisch kijken (hoofdstuk 2–3)', delen: [3, 4] },
    { titel: 'C · Grafiek en situatie (hoofdstuk 4–7)', delen: [5, 6, 7, 8] },
    { titel: 'D · Fouten en modellen (hoofdstuk 8–9)', delen: [9, 10] },
    { titel: 'E · Eindtest', delen: [11] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11],
});
})();
