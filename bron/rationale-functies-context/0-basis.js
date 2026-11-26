// ===== Rationale functies in context · Wiskunde 5WW / 5BCW — hulpmiddelen =====
// Leidraad: de werkbundel "Rationale functies in context" (hoofdstuk 0 tot 9) en de oplossingen (G. Walschap).
// Enkel individueel werk: geen duo- of groepsopdrachten, geen hoofdstuk 10 (poster in groep).
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
//  SITUATIES — elke situatie is een model met telkens nieuwe getallen.
//  Een situatie S heeft: titel, verhaal, f, tex (voorschrift), fn, x, xe (eenheid x), ye (eenheid y),
//  dom [a, b] (praktisch domein), losse (aantallen: losse punten), ha, va, vaBinnen, nul, verloop,
//  w (wiskundetaal) en z (contexttaal) per kenmerk, en grafiekinstellingen.
// =====================================================================
const r1 = (x) => W.rond(x, 1), r2 = (x) => W.rond(x, 2);
const breukTex = (t, n) => `\\dfrac{${t}}{${n}}`;
const lin = (a, b, v) => `${a === 1 ? '' : a}${v}${b ? (b < 0 ? ' - ' : ' + ') + Math.abs(b) : ''}`; // a·v + b als TeX

// 1. groei naar een grens: A·x/(x + b)
function sitGroei(variant = kies(['woorden', 'vrijwilligers', 'inschrijvingen'])) {
  const V = {
    woorden: { A: kies([900, 1000, 1200, 1500]), b: kies([4, 5, 6, 8, 10]), fn: 'W', x: 'w', tot: 52, xe: 'weken', ye: 'woorden', yn: 'aantal woorden',
      verhaal: () => `Een nieuwkomer volgt een taalcursus Nederlands. Hij leert elke week nieuwe woorden. De formule geeft het aantal woorden $W$ dat hij kent:`,
      xBet: 'het aantal weken na de start van de cursus', yBet: 'het aantal woorden dat hij kent', vraagC: (c) => `Na hoeveel weken kent hij ${c} woorden?`,
      begin: 'Bij de start kent hij nog geen woorden Nederlands.', ha: (A) => `Zijn woordenschat nadert ${A} woorden, maar komt daar volgens het model nooit aan.`,
      haF: (A) => `Na een jaar kent hij precies ${A} woorden.`, wie: 'de nieuwkomer', grootheid: 'zijn woordenschat' },
    vrijwilligers: { A: kies([150, 200, 250, 300]), b: kies([2, 3, 4, 5]), fn: 'V', x: 'w', tot: 20, xe: 'weken', ye: 'vrijwilligers', yn: 'aantal vrijwilligers',
      verhaal: () => `Een buurtproject zoekt vrijwilligers. Elke week komen er mensen bij. De formule geeft het aantal vrijwilligers $V$:`,
      xBet: 'het aantal weken na de start van de oproep', yBet: 'het aantal vrijwilligers', vraagC: (c) => `Na hoeveel weken zijn er ${c} vrijwilligers?`,
      begin: 'Bij de start zijn er nog geen vrijwilligers.', ha: (A) => `Het aantal vrijwilligers nadert ${A}, maar komt er nooit boven.`,
      haF: (A) => `Na 20 weken zijn er precies ${A} vrijwilligers.`, wie: 'het buurtproject', grootheid: 'het aantal vrijwilligers' },
    inschrijvingen: { A: kies([120, 160, 240, 400]), b: kies([3, 4, 5, 6]), fn: 'N', x: 'd', tot: 30, xe: 'dagen', ye: 'inschrijvingen', yn: 'aantal inschrijvingen',
      verhaal: () => `Een jeugdhuis organiseert een nieuwe workshop. Jongeren kunnen zich inschrijven. De formule geeft het aantal inschrijvingen $N$:`,
      xBet: 'het aantal dagen na de start van de inschrijvingen', yBet: 'het aantal inschrijvingen', vraagC: (c) => `Na hoeveel dagen zijn er ${c} inschrijvingen?`,
      begin: 'Bij de start heeft nog niemand ingeschreven.', ha: (A) => `Het aantal inschrijvingen nadert ${A}, maar bereikt dat aantal niet.`,
      haF: (A) => `Na een maand zijn er precies ${A} inschrijvingen.`, wie: 'het jeugdhuis', grootheid: 'het aantal inschrijvingen' },
  }[variant];
  const { A, b } = V, f = (x) => A * x / (x + b), eind = f(V.tot);
  return {
    fam: 'groei', variant, titel: { woorden: 'Taalcursus', vrijwilligers: 'Vrijwilligers', inschrijvingen: 'Inschrijvingen workshop' }[variant],
    verhaal: V.verhaal(A, b), f, tex: `${V.fn}(${V.x}) = ${breukTex(A + V.x, lin(1, b, V.x))}`, fn: V.fn, x: V.x, xe: V.xe, ye: V.ye, yn: V.yn,
    dom: [0, V.tot], losse: false, ha: A, va: -b, vaBinnen: false, nul: 0, verloop: 'stijgend', A, b, eind,
    w: { begin: `${V.fn}(0) = 0`, ha: `y = ${A}`, va: `${V.x} = ${-b}`, dom: `\\text{dom } ${V.fn} = ${ivTex(0, V.tot)}`, verloop: `${V.fn} \\text{ is stijgend op } ${ivTex(0, V.tot)}` },
    z: { begin: V.begin, ha: V.ha(A), haF: V.haF(A), va: `De verticale asymptoot ligt bij een negatieve tijd: ze heeft in deze situatie geen betekenis.`,
      dom: `We volgen de situatie ${V.tot} ${V.xe} lang.`, verloop: `${zin(V.grootheid)} neemt steeds toe, maar steeds trager.` },
    graf: { x: [0, V.tot], y: [0, top(A * 1.05)] }, wie: V.wie, grootheid: V.grootheid,
    e: `${A}*x/(x+${b})`, xBet: V.xBet, yBet: V.yBet, vraagC: V.vraagC,
  };
}

// 2. opwarmen of afkoelen naar de omgevingstemperatuur: (k·t + T0·b)/(t + b)
function sitTemp(variant = kies(['flesje', 'koffie', 'soep', 'maaltijd'])) {
  const V = {
    flesje: { k: kies([38, 40, 42]), T0: kies([4, 6, 8, 10]), b: kies([2, 3, 4]), tot: 30, fn: 'T', op: true, ding: 'de melk',
      verhaal: 'In de kinderopvang komt een flesje melk uit de koelkast. Het flesje gaat in een flessenwarmer. De melk wordt warmer. De formule geeft de temperatuur $T$ van de melk:',
      xBet: 'het aantal minuten na het inschakelen', yBet: 'de temperatuur van de melk (in °C)',
      omg: 'de temperatuur van de flessenwarmer', start: 'uit de koelkast' },
    maaltijd: { k: kies([60, 65, 70]), T0: kies([4, 5, 6]), b: kies([5, 6, 8]), tot: 60, fn: 'T', op: true, ding: 'de maaltijd',
      verhaal: 'Een maaltijd komt uit de koelkast. De maaltijd gaat in een warmhoudkast. Ze wordt warmer. De formule geeft de temperatuur $T$ van de maaltijd:',
      xBet: 'het aantal minuten in de warmhoudkast', yBet: 'de temperatuur van de maaltijd (in °C)',
      omg: 'de temperatuur van de warmhoudkast', start: 'uit de koelkast' },
    koffie: { k: kies([18, 20, 22]), T0: kies([75, 80, 85, 90]), b: kies([10, 15, 20]), tot: 60, fn: 'T', op: false, ding: 'de koffie',
      verhaal: 'In de leraarskamer schenkt iemand een kop koffie in. De koffie koelt af. De formule geeft de temperatuur $T$ van de koffie:',
      xBet: 'het aantal minuten na het inschenken', yBet: 'de temperatuur van de koffie (in °C)',
      omg: 'de temperatuur van de kamer', start: 'net ingeschonken' },
    soep: { k: kies([18, 20, 22]), T0: kies([85, 90, 95]), b: kies([15, 20, 25]), tot: 60, fn: 'S', op: false, ding: 'de soep',
      verhaal: 'In een woonzorgcentrum schept iemand soep op. De soep koelt af. De formule geeft de temperatuur $S$ van de soep:',
      xBet: 'het aantal minuten na het opscheppen', yBet: 'de temperatuur van de soep (in °C)',
      omg: 'de temperatuur van de eetzaal', start: 'net opgeschept' },
  }[variant];
  const { k, T0, b } = V, f = (t) => (k * t + T0 * b) / (t + b), eind = f(V.tot), fn = V.fn;
  const lo = Math.min(T0, eind), hi = Math.max(T0, eind);
  return {
    fam: 'temp', variant, titel: { flesje: 'Babyflesje', maaltijd: 'Warmhoudkast', koffie: 'Kop koffie', soep: 'Soep' }[variant],
    verhaal: V.verhaal, f, tex: `${fn}(t) = ${breukTex(`${k}t + ${T0 * b}`, `t + ${b}`)}`, fn, x: 't', xe: 'minuten', ye: '°C', yn: 'temperatuur (°C)',
    dom: [0, V.tot], losse: false, ha: k, va: -b, vaBinnen: false, nul: null, verloop: V.op ? 'stijgend' : 'dalend', k, T0, b, eind, op: V.op,
    bereik: [r1(lo), r1(hi)],
    w: { begin: `${fn}(0) = ${T0}`, ha: `y = ${k}`, va: `t = ${-b}`, dom: `\\text{dom } ${fn} = ${ivTex(0, V.tot)}`,
      verloop: `${fn} \\text{ is ${V.op ? 'stijgend' : 'dalend'} op } ${ivTex(0, V.tot)}`, bereik: `\\text{ber } ${fn} \\approx ${ivTex(r1(lo), r1(hi))}` },
    z: { begin: `Bij de start is ${V.ding} ${T0} °C (${V.start}).`, ha: `${zin(V.ding)} nadert ${k} °C, ${V.omg}, maar bereikt die temperatuur niet.`,
      haF: `Na een tijd is ${V.ding} precies ${k} °C en blijft ze zo.`, va: 'De verticale asymptoot ligt bij een negatieve tijd: ze heeft in deze situatie geen betekenis.',
      dom: `We volgen ${V.ding} ${V.tot} minuten lang.`, verloop: `${zin(V.ding)} ${V.op ? 'warmt' : 'koelt'} steeds ${V.op ? 'op' : 'af'}, eerst snel en daarna steeds trager.`,
      bereik: `Tijdens die ${V.tot} minuten ligt de temperatuur tussen ${kg(r1(lo))} °C en ${kg(r1(hi))} °C.` },
    graf: { x: [0, V.tot], y: [0, top(Math.max(k, T0) * 1.1)] }, ding: V.ding, omg: V.omg,
    e: `(${k}*x+${T0 * b})/(x+${b})`, xBet: V.xBet, yBet: V.yBet,
  };
}

// 3. gemiddelde kost per deelnemer: (v + p·n)/n
function sitKost(variant = kies(['uitstap', 'restaurant', 'kamp'])) {
  const V = {
    uitstap: { v: kies([400, 500, 600, 750, 800]), p: kies([15, 20, 25, 30]), dom: [5, 60], fn: 'K', per: 'deelnemer', wat: 'de daguitstap',
      verhaal: (v, p) => `Een woonzorgcentrum organiseert een daguitstap. De bus kost samen ${v} euro. Daarbovenop kost elke deelnemer ${p} euro (inkom en lunch). De formule geeft de gemiddelde kost $K$ per deelnemer:`,
      xBet: 'het aantal deelnemers', yBet: 'de gemiddelde kost per deelnemer (in euro)',
      vast: 'het busgeld', var: 'inkom en lunch' },
    kamp: { v: kies([900, 1200, 1500]), p: kies([60, 75, 90]), dom: [10, 50], fn: 'K', per: 'kind', wat: 'het kamp',
      verhaal: (v, p) => `Een jeugdbeweging gaat op kamp. Ze huurt een hoeve voor ${v} euro. Eten en activiteiten kosten ${p} euro per kind. De formule geeft de gemiddelde kost $K$ per kind:`,
      xBet: 'het aantal kinderen', yBet: 'de gemiddelde kost per kind (in euro)',
      vast: 'de huur van de hoeve', var: 'eten en activiteiten' },
    restaurant: { v: kies([2400, 3000, 3600]), p: kies([3, 4, 5]), dom: [100, 1500], fn: 'K', per: 'maaltijd', wat: 'het sociaal restaurant',
      verhaal: (v, p) => `Een sociaal restaurant heeft elke maand ${v} euro vaste kosten (huur en energie). Elke maaltijd kost daarbovenop ${p} euro aan ingrediënten. De formule geeft de gemiddelde kost $K$ per maaltijd:`,
      xBet: 'het aantal maaltijden per maand', yBet: 'de gemiddelde kost per maaltijd (in euro)',
      vast: 'de vaste kosten', var: 'de ingrediënten' },
  }[variant];
  const { v, p } = V, f = (n) => (v + p * n) / n, [a, b] = V.dom;
  return {
    fam: 'kost', variant, titel: { uitstap: 'Daguitstap', kamp: 'Kamp', restaurant: 'Sociaal restaurant' }[variant],
    verhaal: V.verhaal(v, p), f, tex: `K(n) = ${breukTex(`${v} + ${p}n`, 'n')}`, fn: 'K', x: 'n', xe: V.per === 'maaltijd' ? 'maaltijden' : V.per === 'kind' ? 'kinderen' : 'deelnemers', ye: 'euro', yn: `kost per ${V.per} (euro)`,
    dom: V.dom, losse: true, ha: p, va: 0, vaBinnen: false, nul: null, verloop: 'dalend', v, p, per: V.per, wat: V.wat, bereik: [f(b), f(a)],
    w: { ha: `y = ${p}`, va: `n = 0`, dom: `\\text{dom } K = ${ivTex(a, b)}`, verloop: `K \\text{ is dalend op } ${ivTex(a, b)}`, bereik: `\\text{ber } K = ${ivTex(r2(f(b)), r2(f(a)))}`, nul: '\\text{K heeft geen nulwaarden}' },
    z: { ha: `De kost per ${V.per} nadert ${p} euro (${V.var}), maar zakt er nooit onder: ${V.vast} wordt over steeds meer ${V.per === 'maaltijd' ? 'maaltijden' : 'mensen'} verdeeld.`,
      haF: `Bij heel veel ${V.per === 'maaltijd' ? 'maaltijden' : 'deelnemers'} kost het precies ${v} euro per ${V.per}.`,
      va: `Bij heel weinig ${V.per === 'maaltijd' ? 'maaltijden' : 'deelnemers'} zou de kost per ${V.per} onbeperkt groot worden; bij 0 gaat het niet door.`,
      nul: `${zin(V.wat)} is nooit gratis: de kost per ${V.per} is altijd positief.`, dom: `Er zijn minstens ${a} en hoogstens ${b} ${V.per === 'maaltijd' ? 'maaltijden' : V.per === 'kind' ? 'kinderen' : 'deelnemers'}.`,
      verloop: `Hoe meer ${V.per === 'maaltijd' ? 'maaltijden' : 'deelnemers'}, hoe goedkoper per ${V.per}.`,
      bereik: `Afhankelijk van het aantal kost het tussen ${kg(r2(f(b)))} en ${kg(r2(f(a)))} euro per ${V.per}.` },
    graf: { x: [0, b], y: [0, top(f(a) * 1.05)] },
    e: `(${v}+${p}*x)/x`, xBet: V.xBet, yBet: V.yBet,
  };
}

// 4. gemiddelde winst per stuk: (p·n − v)/n
function sitWinst(variant = kies(['werkplaats', 'kaarsen', 'tickets'])) {
  const V = {
    werkplaats: { p: kies([8, 10, 12, 15]), m: kies([50, 60, 75, 80]), dom: [20, 300], wat: 'de werkplaats', stuk: 'stuk', stuks: 'stuks',
      verhaal: (p, v) => `Een sociale werkplaats maakt houten speelgoed. Eerst koopt ze materiaal en machines voor ${v} euro. Daarna verdient ze ${p} euro per verkocht stuk. De formule geeft de gemiddelde winst $W$ per stuk:`,
      xBet: 'het aantal verkochte stuks', yBet: 'de gemiddelde winst per stuk (in euro)' },
    kaarsen: { p: kies([2, 3, 4]), m: kies([40, 50, 60]), dom: [10, 300], wat: 'de klas', stuk: 'kaars', stuks: 'kaarsen',
      verhaal: (p, v) => `Een klas maakt kaarsen en verkoopt ze voor een goed doel. Het materiaal kostte samen ${v} euro. Per verkochte kaars krijgt de klas ${p} euro. De formule geeft de gemiddelde winst $W$ per kaars:`,
      xBet: 'het aantal verkochte kaarsen', yBet: 'de gemiddelde winst per kaars (in euro)' },
    tickets: { p: kies([10, 12, 15]), m: kies([40, 50, 60]), dom: [10, 250], wat: 'het comité', stuk: 'ticket', stuks: 'tickets',
      verhaal: (p, v) => `Een comité organiseert een benefietavond. De zaal kost ${v} euro. Per verkocht ticket blijft er ${p} euro over. De formule geeft de gemiddelde winst $W$ per ticket:`,
      xBet: 'het aantal verkochte tickets', yBet: 'de gemiddelde winst per ticket (in euro)' },
  }[variant];
  const p = V.p, v = p * V.m, f = (n) => (p * n - v) / n, [a, b] = V.dom, nul = V.m;
  return {
    fam: 'winst', variant, titel: { werkplaats: 'Sociale werkplaats', kaarsen: 'Kaarsen voor het goede doel', tickets: 'Benefietavond' }[variant],
    verhaal: V.verhaal(p, v), f, tex: `W(n) = ${breukTex(`${p}n - ${v}`, 'n')}`, fn: 'W', x: 'n', xe: V.stuks, ye: 'euro', yn: `winst per ${V.stuk} (euro)`,
    dom: V.dom, losse: true, ha: p, va: 0, vaBinnen: false, nul, verloop: 'stijgend', p, v, stuk: V.stuk, stuks: V.stuks, wat: V.wat, bereik: [f(a), f(b)],
    w: { ha: `y = ${p}`, va: 'n = 0', nul: `n = ${nul}`, dom: `\\text{dom } W = ${ivTex(a, b)}`, verloop: `W \\text{ is stijgend op } ${ivTex(a, b)}`,
      teken: `W(n) < 0 \\text{ voor } n < ${nul}`, bereik: `\\text{ber } W = ${ivTex(r2(f(a)), r2(f(b)))}` },
    z: { nul: `Bij ${nul} ${V.stuks} is de startkost van ${v} euro precies terugverdiend: vanaf dan is er winst.`,
      ha: `De gemiddelde winst per ${V.stuk} nadert ${p} euro, maar wordt nooit ${p} euro: de startkost neemt altijd een (steeds kleiner) deel weg.`,
      haF: `Vanaf ${nul} ${V.stuks} verdient ${V.wat} precies ${p} euro per ${V.stuk}.`,
      va: `Bij 0 ${V.stuks} kan je niet delen door het aantal: de gemiddelde winst per ${V.stuk} bestaat dan niet.`,
      teken: `Bij minder dan ${nul} ${V.stuks} maakt ${V.wat} verlies.`, dom: `We bekijken ${a} tot ${b} verkochte ${V.stuks}.`,
      verloop: `Hoe meer ${V.stuks} verkocht, hoe groter de gemiddelde winst per ${V.stuk}.`,
      bereik: `De gemiddelde winst per ${V.stuk} ligt tussen ${kg(r2(f(a)))} en ${kg(r2(f(b)))} euro.` },
    graf: { x: [0, b], y: [top(-f(a) * 1.05) * -1, top(p * 1.1)] },
    e: `(${p}*x-${v})/x`, xBet: V.xBet, yBet: V.yBet,
  };
}

// 5. een vast bedrag verdelen: S/n
function sitVerdeel() {
  const S = kies([3600, 4800, 6000, 7200]), N = kies([60, 80, 100, 120].filter(n => S % n === 0)), f = (n) => S / n;
  return {
    fam: 'verdeel', variant: 'kamp', titel: 'Subsidie voor een zomerkamp',
    verhaal: `Een gemeente geeft ${S} euro subsidie aan een zomerkamp. Elk kind krijgt hetzelfde bedrag. Er is plaats voor maximaal ${N} kinderen. De formule geeft het bedrag $B$ per kind:`,
    xBet: 'het aantal kinderen', yBet: 'het bedrag per kind (in euro)', e: `${S}/x`,
    f, tex: `B(n) = ${breukTex(S, 'n')}`, fn: 'B', x: 'n', xe: 'kinderen', ye: 'euro', yn: 'bedrag per kind (euro)',
    dom: [1, N], losse: true, ha: 0, va: 0, vaBinnen: false, nul: null, verloop: 'dalend', S, N, bereik: [S / N, S],
    w: { ha: 'y = 0', va: 'n = 0', dom: `\\text{dom } B = \\{1, 2, 3, \\ldots, ${N}\\}`, verloop: 'B \\text{ is dalend}', nul: '\\text{B heeft geen nulwaarden}' },
    z: { ha: 'Hoe meer kinderen, hoe dichter het bedrag per kind bij 0 euro komt, maar het wordt nooit 0.', haF: `Bij ${N} kinderen krijgt elk kind 0 euro.`,
      va: 'Zonder kinderen kan je het bedrag niet verdelen.', dom: `Er doen 1 tot ${N} kinderen mee, en het aantal is een natuurlijk getal.`,
      nul: `De ${S} euro wordt altijd volledig verdeeld: elk kind krijgt iets.`, verloop: 'Hoe meer kinderen, hoe kleiner het bedrag per kind.' },
    graf: { x: [0, N], y: [0, top(S / 10 * 1.05)] },
  };
}

// 6. wachttijd bij een bezettingsgraad: c/(100 − b)
function sitWacht(variant = kies(['onthaal', 'loket', 'spoed'])) {
  const c = kies([200, 300, 400, 500]), f = (b) => c / (100 - b);
  const plaats = { onthaal: 'aan het onthaal van een ziekenhuis', loket: 'aan het loket van het OCMW', spoed: 'op een spoeddienst' }[variant];
  return {
    fam: 'wacht', variant, titel: { onthaal: 'Wachten aan het onthaal', loket: 'Wachten aan het loket', spoed: 'Wachten op de spoed' }[variant],
    verhaal: `Je wacht ${plaats}. Hoe drukker de medewerkers zijn, hoe langer je wacht. De bezettingsgraad $b$ zegt hoeveel procent van de tijd de medewerkers bezig zijn. De formule geeft de gemiddelde wachttijd $W$:`,
    xBet: 'de bezettingsgraad (in %)', yBet: 'de gemiddelde wachttijd (in minuten)', e: `${c}/(100-x)`,
    f, tex: `W(b) = ${breukTex(c, '100 - b')}`, fn: 'W', x: 'b', xe: '%', ye: 'minuten', yn: 'wachttijd (minuten)',
    dom: [0, 100], domOpen: true, losse: false, ha: 0, va: 100, vaBinnen: true, nul: null, verloop: 'stijgend', c, plaats,
    w: { begin: `W(0) = ${kg(c / 100)}`, va: 'b = 100', dom: `\\text{dom } W = ${ivTex(0, 100, true, false)}`, verloop: `W \\text{ is stijgend op } ${ivTex(0, 100, true, false)}`,
      bereik: `\\text{ber } W = ${ivTex(c / 100, I, true, false)}` },
    z: { begin: `Als de medewerkers bijna niets te doen hebben, wacht je gemiddeld ${kg(c / 100)} minuten.`,
      va: 'Hoe dichter de bezetting bij 100 % komt, hoe sneller de wachttijd oploopt: bij volle bezetting raakt de wachtrij nooit meer weg.',
      haF: 'Je wacht nooit langer dan 100 minuten.', dom: 'De bezettingsgraad ligt tussen 0 % en (net niet) 100 %.',
      verloop: 'Hoe drukker de medewerkers, hoe langer je wacht, en vlak bij 100 % gaat het heel snel.', bereik: `Je wacht minstens ${kg(c / 100)} minuten, en de wachttijd kan onbeperkt oplopen.` },
    graf: { x: [0, 100], y: [0, top(c / 4)] },
  };
}

// 7. concentratie van een geneesmiddel: a·t/(t² + b)
function sitConc(variant = kies(['pijnstiller', 'geneesmiddel'])) {
  const tm = kies([2, 3, 4]), Mx = kies([4, 5, 6, 8]), b = tm * tm, a = 2 * Mx * tm, f = (t) => a * t / (t * t + b), uur = kies([7, 8, 9, 10]);
  const ding = variant === 'pijnstiller' ? 'de pijnstiller' : 'het geneesmiddel';
  return {
    fam: 'conc', variant, titel: variant === 'pijnstiller' ? 'Pijnstiller in het bloed' : 'Geneesmiddel in het bloed',
    verhaal: `Een patiënt neemt om ${uur} u ${ding} in. Het komt in het bloed. De formule geeft de concentratie $C$: hoeveel milligram er in één liter bloed zit.`,
    xBet: 'het aantal uur na de inname', yBet: 'de concentratie (in mg per liter bloed)', e: `${a}*x/(x*x+${b})`,
    f, tex: `C(t) = ${breukTex(a + 't', `t^2 + ${b}`)}`, fn: 'C', x: 't', xe: 'uur', ye: 'mg/l', yn: 'concentratie (mg/l)',
    dom: [0, 24], losse: false, ha: 0, va: null, vaBinnen: false, nul: 0, verloop: 'maxdan', a, b, tm, Mx, uur, ding, eind: f(24),
    w: { begin: 'C(0) = 0', ha: 'y = 0', dom: `\\text{dom } C = ${ivTex(0, 24)}`, verloop: `C \\text{ stijgt op } ${ivTex(0, tm)} \\text{ en daalt op } ${ivTex(tm, 24)}`,
      bereik: `\\text{ber } C = ${ivTex(0, Mx)}`, max: `\\text{maximum } ${Mx} \\text{ voor } t = ${tm}` },
    z: { begin: `Op het moment van inname zit er nog geen ${variant === 'pijnstiller' ? 'pijnstiller' : 'geneesmiddel'} in het bloed.`,
      ha: `Op lange termijn verdwijnt ${ding} uit het bloed: de concentratie nadert 0 mg/l.`, haF: `Na 24 uur is ${ding} volledig uitgewerkt: de concentratie is dan 0 mg/l.`,
      dom: 'We volgen de concentratie gedurende 24 uur na inname.', bereik: `De concentratie schommelt tussen 0 en ${Mx} mg/l.`,
      verloop: `De concentratie stijgt eerst snel tot ${Mx} mg/l na ${tm} uur en daalt daarna langzaam.`, max: `Om ${uur + tm} u is de concentratie het hoogst: ${Mx} mg/l.` },
    graf: { x: [0, 24], y: [0, top(Mx * 1.15)] },
  };
}

// 8. terugverdientijd: I/(b − o)
function sitTerug() {
  const I0 = kies([4000, 5000, 6000, 8000]), o = kies([100, 150, 200, 250]), f = (b) => I0 / (b - o);
  return {
    fam: 'terug', variant: 'warmtepomp', titel: 'Een warmtepomp',
    verhaal: `Een woonzorgcentrum koopt een warmtepomp van ${I0} euro. Het onderhoud kost ${o} euro per jaar. Met de warmtepomp betaalt het centrum minder voor energie: het bespaart $b$ euro per jaar. De formule geeft de terugverdientijd $T$: na hoeveel jaar is de warmtepomp terugverdiend?`,
    xBet: 'de besparing per jaar (in euro)', yBet: 'de terugverdientijd (in jaar)', e: `${I0}/(x-${o})`,
    f, tex: `T(b) = ${breukTex(I0, `b - ${o}`)}`, fn: 'T', x: 'b', xe: 'euro per jaar', ye: 'jaar', yn: 'terugverdientijd (jaar)',
    dom: [o, 2000], domOpen: true, domTex: `${o} \\lt b \\leq 2000`, losse: false, ha: 0, va: o, vaBinnen: true, nul: null, verloop: 'dalend', I0, o,
    w: { va: `b = ${o}`, ha: 'y = 0' },
    z: { va: `Als de besparing bijna gelijk is aan de onderhoudskost (${o} euro), blijft er bijna niets over: de terugverdientijd wordt onbeperkt groot.`,
      ha: 'Hoe groter de besparing, hoe korter de terugverdientijd, maar die wordt nooit 0 jaar.', haF: 'Bij een heel grote besparing is de pomp meteen terugverdiend.' },
    graf: { x: [0, 2000], y: [0, 60] },
  };
}

// 9. rijtijd voor een vaste afstand: 60·d/v
function sitRit() {
  const d = kies([20, 24, 30, 36]), f = (v) => 60 * d / v;
  return {
    fam: 'rit', variant: 'ziekenwagen', titel: 'De rit van een ziekenwagen',
    verhaal: `Een ziekenwagen brengt een patiënt naar het ziekenhuis. Het ziekenhuis ligt ${d} km verder. De formule geeft de rijtijd $R$:`,
    xBet: 'de gemiddelde snelheid (in km/h)', yBet: 'de rijtijd (in minuten)', e: `${60 * d}/x`,
    f, tex: `R(v) = ${breukTex(60 * d, 'v')}`, fn: 'R', x: 'v', xe: 'km/h', ye: 'minuten', yn: 'rijtijd (minuten)',
    dom: [20, 120], losse: false, ha: 0, va: 0, vaBinnen: false, nul: null, verloop: 'dalend', d, bereik: [f(120), f(20)],
    w: { va: 'v = 0', ha: 'y = 0', dom: `\\text{dom } R = ${ivTex(20, 120)}`, verloop: `R \\text{ is dalend op } ${ivTex(20, 120)}`, bereik: `\\text{ber } R = ${ivTex(f(120), f(20))}` },
    z: { va: 'Als de ziekenwagen bijna stilstaat, wordt de rijtijd onbeperkt groot: hij komt nooit aan.', ha: 'Hoe sneller de ziekenwagen rijdt, hoe korter de rit, maar die duurt nooit 0 minuten.',
      haF: 'Bij een heel hoge snelheid duurt de rit 0 minuten.', dom: 'Gemiddeld rijdt een ziekenwagen tussen 20 km/h en 120 km/h.', verloop: 'Hoe sneller, hoe korter de rit.',
      bereik: `De rit duurt tussen ${kg(f(120))} en ${kg(f(20))} minuten.` },
    graf: { x: [0, 130], y: [0, top(f(20) * 1.05)] },
  };
}

// 10. een geneesmiddel verdunnen: m/(w + V0)
function sitVerdun() {
  const m = kies([400, 500, 600]), V0 = kies([10, 20, 25]), tot = 250 - V0, f = (w) => m / (w + V0);
  return {
    fam: 'verdun', variant: 'verdunnen', titel: 'Een geneesmiddel verdunnen',
    verhaal: `Een verpleegkundige lost ${m} mg van een geneesmiddel op in ${V0} ml water. Daarna doet ze nog $w$ ml water extra in het flesje. In het flesje past in totaal 250 ml. De formule geeft de concentratie $C$: hoeveel mg er in 1 ml zit.`,
    xBet: 'het aantal ml extra water', yBet: 'de concentratie (in mg per ml)', e: `${m}/(x+${V0})`,
    f, tex: `C(w) = ${breukTex(m, `w + ${V0}`)}`, fn: 'C', x: 'w', xe: 'ml', ye: 'mg/ml', yn: 'concentratie (mg/ml)',
    dom: [0, tot], losse: false, ha: 0, va: -V0, vaBinnen: false, nul: null, verloop: 'dalend', m, V0, bereik: [f(tot), f(0)],
    w: { begin: `C(0) = ${kg(f(0))}`, va: `w = ${-V0}`, ha: 'y = 0', dom: `\\text{dom } C = ${ivTex(0, tot)}`, bereik: `\\text{ber } C = ${ivTex(f(tot), f(0))}` },
    z: { begin: `Vóór het verdunnen is de concentratie ${kg(f(0))} mg/ml.`, va: 'De verticale asymptoot ligt bij een negatieve hoeveelheid water: ze heeft geen betekenis.',
      ha: 'Hoe meer water, hoe dichter de concentratie bij 0 komt, maar ze wordt nooit 0.', haF: 'Als het flesje vol is, is de concentratie 0 mg/ml.',
      dom: `Ze kan 0 tot ${tot} ml water toevoegen.`, bereik: `De concentratie ligt tussen ${kg(f(tot))} en ${kg(f(0))} mg/ml.` },
    graf: { x: [0, 250], y: [0, top(f(0) * 1.05)] },
  };
}

const SITUATIES = { groei: sitGroei, temp: sitTemp, kost: sitKost, winst: sitWinst, verdeel: sitVerdeel, wacht: sitWacht, conc: sitConc, terug: sitTerug, rit: sitRit, verdun: sitVerdun };
const kiesSit = (fams) => SITUATIES[kies(fams)]();

// grafiek van een situatie (op het praktisch domein)
function sitGraf(S, opt = {}) {
  const [a, b] = S.dom;
  const tot = S.domOpen && S.fam === 'wacht' ? 99.6 : b;
  let [Y0, Y1] = S.graf.y;
  return rgraf({ x: opt.x || S.graf.x, y: [Y0, Y1], xn: `${S.x} (${S.xe})`, yn: S.yn, functies: [{ f: S.f, e: S.e, van: a, tot, losse: opt.losse }],
    ha: opt.asymptoten ? (S.ha != null ? [S.ha] : []) : [], va: opt.asymptoten && S.va != null ? [S.va] : [], klein: opt.klein, breed: opt.breed, hoog: opt.hoog });
}
const domTekst = (S) => S.domTex ? S.domTex : S.domOpen ? `${S.dom[0]} \\leq ${S.x} \\lt ${S.dom[1]}` : `${S.dom[0]} \\leq ${S.x} \\leq ${S.dom[1]}`;
// legende: wat betekenen de letters? (korte, vaste zinnen)
const legende = (S) => S.xBet ? `<p class="legende">Hierin is $${S.x}$ ${S.xBet} en $${S.fn}$ ${S.yBet}.</p>` : '';
const sitOpgave = (S, extra = '') => `${opgave(S.verhaal)}<p class="midden">$${S.tex}$ &nbsp; met &nbsp; $${domTekst(S)}$</p>${legende(S)}${extra}`;
const sitKort = (S, extra = '') => `${opgave(S.verhaal)}<p class="midden">$${S.tex}$</p>${legende(S)}${extra}`; // zonder praktisch domein
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
  ['terugverdientijd', 'Hoeveel jaar het duurt tot je met de besparing evenveel geld hebt als je betaald hebt.'],
  ['terugverdienen', 'Evenveel geld terugkrijgen (of besparen) als je betaald hebt.'],
  ['terugverdiend', 'Je hebt evenveel geld terug (of bespaard) als je betaald hebt.'],
  ['warmtepomp', 'Een toestel dat een gebouw verwarmt met warmte uit de lucht of uit de grond.'],
  ['bezettingsgraad', 'Hoeveel procent van de tijd de medewerkers bezig zijn. 100 % = altijd bezig.'],
  ['bezetting', 'Hoeveel procent van de tijd de medewerkers bezig zijn.'],
  ['concentratie', 'Hoeveel van een stof er in een bepaalde hoeveelheid vloeistof zit (bv. mg per liter).'],
  ['onderhoudskost', 'Het geld dat het onderhoud (controle en kleine herstellingen) elk jaar kost.'],
  ['onderhoud', 'De controle en kleine herstellingen die elk jaar nodig zijn.'],
  ['subsidie', 'Geld dat je krijgt van de overheid, bijvoorbeeld van de gemeente.'],
  ['vaste kosten', 'Kosten die altijd even groot zijn, hoeveel je ook maakt of verkoopt.'],
  ['vaste kost', 'Een kost die altijd even groot is, hoeveel je ook maakt of verkoopt.'],
  ['startkost', 'Het geld dat je in het begin één keer uitgeeft.'],
  ['ingrediënten', 'Alles wat je nodig hebt om eten te maken.'],
  ['gemiddelde', 'Alles samen gedeeld door het aantal.'],
  ['gemiddeld', 'Alles samen gedeeld door het aantal.'],
  ['grenswaarde', 'Een waarde waar de grootheid steeds dichter bij komt, maar die ze nooit bereikt.'],
  ['flessenwarmer', 'Een toestel dat een babyflesje opwarmt.'],
  ['warmhoudkast', 'Een kast die eten warm houdt.'],
  ['woonzorgcentrum', 'Een huis waar oudere mensen wonen en zorg krijgen.'],
  ['OCMW', 'De dienst van de gemeente die mensen helpt met geld, wonen en zorg.'],
  ['onthaal', 'De plaats waar je je meldt als je binnenkomt.'],
  ['spoeddienst', 'De afdeling van het ziekenhuis voor dringende hulp.'],
  ['spoed', 'De afdeling van het ziekenhuis voor dringende hulp.'],
  ['vrijwilligers', 'Mensen die helpen zonder ervoor betaald te worden.'],
  ['inschrijvingen', 'Mensen die zich opgeven om mee te doen.'],
  ['jeugdbeweging', 'Een vereniging waar kinderen en jongeren samen spelen en op kamp gaan.'],
  ['jeugdhuis', 'Een plaats waar jongeren elkaar ontmoeten.'],
  ['workshop', 'Een korte les waarin je zelf iets doet of maakt.'],
  ['hoeve', 'Een grote boerderij.'],
  ['sociaal restaurant', 'Een restaurant met goedkope maaltijden voor mensen met weinig geld.'],
  ['sociale werkplaats', 'Een bedrijf waar mensen werken die moeilijk ander werk vinden.'],
  ['benefietavond', 'Een feest waarvan de winst naar een goed doel gaat.'],
  ['goed doel', 'Een organisatie die mensen of dieren helpt; het geld gaat naar hen.'],
  ['comité', 'Een groep mensen die samen iets organiseert.'],
  ['buurtproject', 'Een project van en voor de mensen uit een buurt.'],
  ['revalidatie', 'Oefenen om na een ziekte of operatie weer sterker te worden.'],
  ['heupoperatie', 'Een operatie aan de heup.'],
  ['lancering', 'Het moment waarop iets nieuws voor het eerst online komt.'],
  ['pijnstiller', 'Een geneesmiddel tegen pijn.'],
  ['geneesmiddel', 'Een medicijn.'],
  ['inname', 'Het innemen (slikken) van een geneesmiddel.'],
  ['uitgewerkt', 'Het geneesmiddel werkt niet meer.'],
  ['verpleegkundige', 'Iemand die zieke mensen verzorgt.'],
  ['apotheker', 'Iemand die geneesmiddelen maakt en verkoopt.'],
  ['verdunnen', 'Water toevoegen, zodat iets minder sterk wordt.'],
  ['woordenschat', 'Alle woorden die je kent.'],
  ['nieuwkomer', 'Iemand die nog maar kort in België woont.'],
  ['besparing', 'Het geld dat je minder uitgeeft dan vroeger.'],
  ['bespaart', 'Geeft minder geld uit dan vroeger.'],
  ['besparen', 'Minder geld uitgeven dan vroeger.'],
  ['etmaal', '24 uur.'],
  ['deelnemers', 'Mensen die meedoen.'],
  ['deelnemer', 'Iemand die meedoet.'],
  ['nadert', 'Komt steeds dichterbij.'],
  ['onbeperkt', 'Zonder grens: steeds groter.'],
  ['praktisch domein', 'De waarden van x die in de echte situatie mogelijk zijn.'],
  ['wiskundig domein', 'Alle getallen waarvoor je de formule kan uitrekenen.'],
  ['beginwaarde', 'De waarde bij de start (als x = 0).'],
  ['extrapoleren', 'Een voorspelling maken buiten de gemeten waarden.'],
  ['interpoleren', 'Een voorspelling maken tussen de gemeten waarden.'],
  ['kinderopvang', 'Een plaats waar jonge kinderen overdag verzorgd worden.'],
  ['leraarskamer', 'De kamer voor de leerkrachten op school.'],
  ['eetzaal', 'De zaal waar mensen samen eten.'],
  ['loket', 'Een balie waar je geholpen wordt.'],
  ['verlies', 'Je geeft meer geld uit dan je ontvangt.'],
  ['investeert', 'Geeft geld uit om er later iets mee te verdienen.'],
  ['model', 'Een formule die een echte situatie beschrijft.'],
  ['grootheid', 'Iets wat je kan meten of tellen, zoals een temperatuur, een tijd of een aantal.'],
].sort((p, q) => q[0].length - p[0].length);
function woorden(html) {
  if (!html || typeof html !== 'string' || html.includes('class="woord"')) return html; // al gedaan (bv. vragen in de eindtest)
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
  const [a, b] = S.dom, ao = S.fam === 'terug', bo = !!S.domOpen && S.fam !== 'terug';
  return venster({ fs: [{ e: S.e, n: S.fn }], X: opt.X || S.graf.x, Y: opt.Y || S.graf.y, a, b, ao, bo, losse: !!S.losse,
    xv: S.x, xe: S.xe, ye: S.ye, xn: `${S.x} (${S.xe})`, yn: S.yn, t: opt.t || 'vfsm', ha: S.ha != null ? [S.ha] : [], va: S.va != null ? [S.va] : [], asym: !!opt.asym });
}

// eenvoudige numerieke oplosser f(x) = c op [a, b] (f monotoon of met één top)
function los(f, c, a, b) {
  const N = 4000; let vx = a, vy = f(a) - c;
  for (let i = 1; i <= N; i++) {
    const x = a + (b - a) * i / N, y = f(x) - c;
    if (vy === 0) return vx;
    if (vy * y <= 0) { let lo = vx, hi = x; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if ((f(lo) - c) * (f(m) - c) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; }
    vx = x; vy = y;
  }
  return null;
}

// ---------- vaste theorieblokken
const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraken in dit leerpad</div>
  <ul><li>Bij de vragen staat een <b>grafiekvenster</b> met de formule al ingevuld. Je moet dus niets overtypen. GeoGebra of je rekenmachine mag ook.</li>
  <li>Een woord met een <span style="border-bottom:2px dotted #e8772e">oranje stippellijn</span> eronder is een moeilijk woord. Raak het aan (of ga erover met de muis): dan zie je wat het betekent.</li>
  <li>Bij elke rekenvraag staat <b>op hoeveel decimalen je afrondt</b>. Komt de uitkomst exact uit (bv. 75 of 2,5), dan schrijf je ze gewoon zo.</li>
  <li>Kommagetallen typ je met een komma: <code>38,1</code>.</li>
  <li>Een interval typ je zoals in de werkbundel, met een puntkomma: <code>[0 ; 24]</code> of <code>[2 ; +∞[</code> (een komma tussen de grenzen mag ook).</li>
  <li>Bij meerkeuzevragen kies je de zin die het best past bij de situatie.</li></ul></div>`;
const GEOGEBRA = `<div class="kader eig"><div class="kader-titel">Zo werk je met het grafiekvenster</div>
  <ul><li><b>Beweeg</b> over de grafiek (of tik erop): je ziet $x$ en de functiewaarde.</li>
  <li><b>Bereken</b>: typ een $x$-waarde en klik op <i>Bereken</i>. Je krijgt bv. $T(18)$.</li>
  <li><b>Snijpunt</b>: typ een $y$-waarde en klik op <i>Snijpunt</i>. Je krijgt waar bv. $T(x) = 37$. Voor een nulwaarde typ je $y = 0$.</li>
  <li><b>Hoogste en laagste punt</b> op het praktisch domein: één klik.</li>
  <li>Blauw is het praktisch domein. Grijs en gestreept is de rest van de grafiek: die hoort niet bij de situatie.</li></ul>
  <p class="klein">Werk je liever met GeoGebra? Dat mag ook: <code>Snijpunt(T, y = 37)</code>, <code>Extremum(T, 0, 24)</code>.</p></div>`;
const WOORDENLIJST = `<table class="tabel"><tr><th>Kenmerk</th><th>Wiskundig</th><th>In de context</th></tr>
  <tr><td>Domein</td><td>alle $x$-waarden waarvoor de functie bestaat</td><td>alle waarden van de onafhankelijke veranderlijke (vaak de tijd of een aantal) die we bekijken</td></tr>
  <tr><td>Bereik</td><td>alle functiewaarden die de functie aanneemt</td><td>alle uitkomsten die in de situatie voorkomen: van de kleinste tot de grootste</td></tr>
  <tr><td>Snijpunt met de $y$-as</td><td>het punt $(0 ; f(0))$</td><td>de <b>beginwaarde</b>: de toestand bij de start</td></tr>
  <tr><td>Nulwaarde</td><td>een $x$-waarde waarvoor $f(x) = 0$</td><td>het moment (of de waarde) waarop de grootheid nul is, bv. het omslagpunt van verlies naar winst</td></tr>
  <tr><td>Tekenschema</td><td>waar is $f(x)$ positief, nul of negatief?</td><td>waar is de grootheid positief (bv. winst) of negatief (bv. verlies)?</td></tr>
  <tr><td>Verloopschema</td><td>waar is $f$ stijgend of dalend?</td><td>wanneer neemt de grootheid toe of af?</td></tr>
  <tr><td>Horizontale asymptoot</td><td>de rechte $y = b$ die de grafiek nadert als $x$ heel groot wordt</td><td>de <b>grenswaarde</b>: de waarde die de grootheid op lange termijn nadert, zonder ze te bereiken</td></tr>
  <tr><td>Verticale asymptoot</td><td>de rechte $x = a$ waarbij de functiewaarden naar $+\\infty$ of $-\\infty$ gaan</td><td>een waarde waarbij de grootheid onbeperkt groot wordt, of een waarde die in de situatie niet kan</td></tr>
  <tr><td>Perforatie</td><td>een ontbrekend punt, door een gemeenschappelijke factor in teller en noemer</td><td>één waarde waarvoor het model niets zegt, terwijl de rest gewoon doorloopt</td></tr></table>`;
const LET_OP = `<div class="kader eig"><div class="kader-titel">Let op!</div>
  <ul><li>Een horizontale asymptoot is een <b>grenswaarde</b>: schrijf niet "de temperatuur <b>wordt</b> 40 °C", maar "de temperatuur <b>nadert</b> 40 °C".</li>
  <li>Een verticale asymptoot ligt vaak <b>buiten</b> het gebied dat in de situatie zinvol is (bv. bij een negatieve tijd). Ligt ze er wel binnen, dan vertelt ze iets belangrijks: daar loopt de grootheid uit de hand.</li>
  <li>Vermeld in een context altijd de juiste <b>eenheden</b>.</li></ul></div>`;
