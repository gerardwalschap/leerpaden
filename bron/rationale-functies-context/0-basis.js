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
function rgraf(opt) {
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
  for (const fn of opt.functies || []) {
    const van = Math.max(fn.van ?? X0, X0), tot = Math.min(fn.tot ?? X1, X1);
    if (opt.losse || fn.losse) {
      const st = fn.stap || 1;
      for (let x = Math.ceil(van); x <= tot; x += st) { const y = fn.f(x); if (y >= Y0 && y <= Y1) k += `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="1.8" fill="${fn.kleur || BLAUW}"/>`; }
      continue;
    }
    let d = '', aan = false;
    for (let i = 0; i <= 600; i++) {
      const x = van + (tot - van) * i / 600, y = fn.f(x);
      if (!isFinite(y) || y < Y0 - (Y1 - Y0) || y > Y1 + (Y1 - Y0)) { aan = false; continue; }
      const yy = Math.max(Y0 - (Y1 - Y0) * 0.05, Math.min(Y1 + (Y1 - Y0) * 0.05, y));
      d += `${aan ? 'L' : 'M'}${X(x).toFixed(1)},${Y(yy).toFixed(1)} `; aan = true;
    }
    k += `<path d="${d}" fill="none" stroke="${fn.kleur || BLAUW}" stroke-width="${opt.klein ? 2 : 2.4}"/>`;
  }
  for (const p of opt.punten || []) k += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4" fill="${p.hol ? '#fff' : BLAUW}" stroke="${BLAUW}" stroke-width="2"/>`;
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif;max-width:100%;height:auto">
    <defs><clipPath id="${id}"><rect x="${ml}" y="${mt - 2}" width="${B}" height="${H + 4}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${k}</g></svg>`;
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
      verhaal: (A, b) => `Een nieuwkomer volgt een intensieve taalcursus Nederlands. Het aantal woorden $W$ dat hij kent, $w$ weken na de start, is`,
      begin: 'Bij de start kent hij nog geen woorden Nederlands.', ha: (A) => `Zijn woordenschat nadert ${A} woorden, maar komt daar volgens het model nooit aan.`,
      haF: (A) => `Na een jaar kent hij precies ${A} woorden.`, wie: 'de nieuwkomer', grootheid: 'zijn woordenschat' },
    vrijwilligers: { A: kies([150, 200, 250, 300]), b: kies([2, 3, 4, 5]), fn: 'V', x: 'w', tot: 20, xe: 'weken', ye: 'vrijwilligers', yn: 'aantal vrijwilligers',
      verhaal: () => `Een buurtproject zoekt vrijwilligers. Het aantal vrijwilligers $V$, $w$ weken na de start van de oproep, is`,
      begin: 'Bij de start zijn er nog geen vrijwilligers.', ha: (A) => `Het aantal vrijwilligers nadert ${A}, maar komt er nooit boven.`,
      haF: (A) => `Na 20 weken zijn er precies ${A} vrijwilligers.`, wie: 'het buurtproject', grootheid: 'het aantal vrijwilligers' },
    inschrijvingen: { A: kies([120, 160, 240, 400]), b: kies([3, 4, 5, 6]), fn: 'N', x: 'd', tot: 30, xe: 'dagen', ye: 'inschrijvingen', yn: 'aantal inschrijvingen',
      verhaal: () => `Een jeugdhuis opent de inschrijvingen voor een nieuwe workshop. Het aantal inschrijvingen $N$, $d$ dagen na de start, is`,
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
  };
}

// 2. opwarmen of afkoelen naar de omgevingstemperatuur: (k·t + T0·b)/(t + b)
function sitTemp(variant = kies(['flesje', 'koffie', 'soep', 'maaltijd'])) {
  const V = {
    flesje: { k: kies([38, 40, 42]), T0: kies([4, 6, 8, 10]), b: kies([2, 3, 4]), tot: 30, fn: 'T', op: true, ding: 'de melk',
      verhaal: 'In de kinderopvang wordt een flesje melk uit de koelkast in een flessenwarmer gezet. De temperatuur $T$ van de melk (in °C), $t$ minuten na het inschakelen, is',
      omg: 'de temperatuur van de flessenwarmer', start: 'uit de koelkast' },
    maaltijd: { k: kies([60, 65, 70]), T0: kies([4, 5, 6]), b: kies([5, 6, 8]), tot: 60, fn: 'T', op: true, ding: 'de maaltijd',
      verhaal: 'Een maaltijd uit de koelkast wordt in een warmhoudkast gezet. De temperatuur $T$ van de maaltijd (in °C), $t$ minuten later, is',
      omg: 'de temperatuur van de warmhoudkast', start: 'uit de koelkast' },
    koffie: { k: kies([18, 20, 22]), T0: kies([75, 80, 85, 90]), b: kies([10, 15, 20]), tot: 60, fn: 'T', op: false, ding: 'de koffie',
      verhaal: 'In de leraarskamer wordt een kop koffie ingeschonken. De temperatuur $T$ van de koffie (in °C), $t$ minuten na het inschenken, is',
      omg: 'de temperatuur van de kamer', start: 'net ingeschonken' },
    soep: { k: kies([18, 20, 22]), T0: kies([85, 90, 95]), b: kies([15, 20, 25]), tot: 60, fn: 'S', op: false, ding: 'de soep',
      verhaal: 'In een woonzorgcentrum wordt soep opgeschept. De temperatuur $S$ van de soep (in °C), $t$ minuten na het opscheppen, is',
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
  };
}

// 3. gemiddelde kost per deelnemer: (v + p·n)/n
function sitKost(variant = kies(['uitstap', 'restaurant', 'kamp'])) {
  const V = {
    uitstap: { v: kies([400, 500, 600, 750, 800]), p: kies([15, 20, 25, 30]), dom: [5, 60], fn: 'K', per: 'deelnemer', wat: 'de daguitstap',
      verhaal: (v, p) => `Een woonzorgcentrum organiseert een daguitstap. De bus kost ${v} euro, en daarbovenop betaalt het centrum ${p} euro per deelnemer (inkom en lunch). De gemiddelde kost $K$ per deelnemer (in euro) bij $n$ deelnemers is`,
      vast: 'het busgeld', var: 'inkom en lunch' },
    kamp: { v: kies([900, 1200, 1500]), p: kies([60, 75, 90]), dom: [10, 50], fn: 'K', per: 'kind', wat: 'het kamp',
      verhaal: (v, p) => `Een jeugdbeweging huurt voor een kamp een hoeve voor ${v} euro. Eten en activiteiten kosten ${p} euro per kind. De gemiddelde kost $K$ per kind (in euro) bij $n$ kinderen is`,
      vast: 'de huur van de hoeve', var: 'eten en activiteiten' },
    restaurant: { v: kies([2400, 3000, 3600]), p: kies([3, 4, 5]), dom: [100, 1500], fn: 'K', per: 'maaltijd', wat: 'het sociaal restaurant',
      verhaal: (v, p) => `Een sociaal restaurant heeft per maand ${v} euro vaste kosten (huur, energie). Per maaltijd komt daar ${p} euro aan ingrediënten bij. De gemiddelde kost $K$ per maaltijd (in euro) bij $n$ maaltijden per maand is`,
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
  };
}

// 4. gemiddelde winst per stuk: (p·n − v)/n
function sitWinst(variant = kies(['werkplaats', 'kaarsen', 'tickets'])) {
  const V = {
    werkplaats: { p: kies([8, 10, 12, 15]), m: kies([50, 60, 75, 80]), dom: [20, 300], wat: 'de werkplaats', stuk: 'stuk', stuks: 'stuks',
      verhaal: (p, v) => `Een sociale werkplaats maakt houten speelgoed. Om te starten investeert ze ${v} euro in materiaal en machines. Per verkocht stuk verdient ze ${p} euro. De gemiddelde winst $W$ per stuk (in euro) bij $n$ verkochte stuks is` },
    kaarsen: { p: kies([2, 3, 4]), m: kies([40, 50, 60]), dom: [10, 300], wat: 'de klas', stuk: 'kaars', stuks: 'kaarsen',
      verhaal: (p, v) => `Een klas verkoopt zelfgemaakte kaarsen voor een goed doel. Het materiaal kostte samen ${v} euro. Per verkochte kaars krijgt de klas ${p} euro. De gemiddelde winst $W$ per kaars (in euro) bij $n$ verkochte kaarsen is` },
    tickets: { p: kies([10, 12, 15]), m: kies([40, 50, 60]), dom: [10, 250], wat: 'het comité', stuk: 'ticket', stuks: 'tickets',
      verhaal: (p, v) => `Voor een benefietavond huurt een comité een zaal voor ${v} euro. Per verkocht ticket blijft er ${p} euro over. De gemiddelde winst $W$ per ticket (in euro) bij $n$ verkochte tickets is` },
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
  };
}

// 5. een vast bedrag verdelen: S/n
function sitVerdeel() {
  const S = kies([3600, 4800, 6000, 7200]), N = kies([60, 80, 100, 120].filter(n => S % n === 0)), f = (n) => S / n;
  return {
    fam: 'verdeel', variant: 'kamp', titel: 'Subsidie voor een zomerkamp',
    verhaal: `Een gemeente geeft een subsidie van ${S} euro aan een zomerkamp. Het bedrag wordt gelijk verdeeld onder alle deelnemende kinderen. Het kamp heeft plaats voor maximaal ${N} kinderen. Het bedrag $B$ per kind (in euro) bij $n$ kinderen is`,
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
    verhaal: `De gemiddelde wachttijd $W$ (in minuten) ${plaats} hangt af van de bezettingsgraad $b$ van de medewerkers (in %): hoe groter het deel van de tijd dat ze bezig zijn, hoe langer je moet wachten.`,
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
    verhaal: `Een patiënt neemt om ${uur} u ${ding} in. De concentratie $C$ (in mg per liter bloed), $t$ uur na inname, is`,
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
    verhaal: `Een woonzorgcentrum installeert een warmtepomp van ${I0} euro. Het onderhoud kost ${o} euro per jaar. Bespaart het centrum $b$ euro per jaar op energie, dan is de terugverdientijd $T$ (in jaar)`,
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
    verhaal: `Een ziekenwagen moet een patiënt ${d} km verder naar het ziekenhuis brengen. De rijtijd $R$ (in minuten) hangt af van de gemiddelde snelheid $v$ (in km/h):`,
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
    verhaal: `Een verpleegkundige lost ${m} mg van een geneesmiddel op in ${V0} ml water. Daarna voegt ze nog $w$ ml water toe. Het flesje kan in totaal 250 ml bevatten. De concentratie $C$ (in mg/ml) is`,
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
  return rgraf({ x: opt.x || S.graf.x, y: [Y0, Y1], xn: `${S.x} (${S.xe})`, yn: S.yn, functies: [{ f: S.f, van: a, tot, losse: opt.losse }],
    ha: opt.asymptoten ? (S.ha != null ? [S.ha] : []) : [], va: opt.asymptoten && S.va != null ? [S.va] : [], klein: opt.klein, breed: opt.breed, hoog: opt.hoog });
}
const sitOpgave = (S, extra = '') => `${opgave(S.verhaal)}<p class="midden">$${S.tex}$ &nbsp; met &nbsp; $${S.domTex ? S.domTex : S.domOpen ? `${S.dom[0]} \\leq ${S.x} \\lt ${S.dom[1]}` : `${S.dom[0]} \\leq ${S.x} \\leq ${S.dom[1]}`}$</p>${extra}`;

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
  <ul><li>Je mag (en moet soms) <b>GeoGebra</b> gebruiken, net zoals in de werkbundel. Bij elke rekenvraag staat <b>op hoeveel decimalen je afrondt</b>. Komt de uitkomst exact uit (bv. 75 of 2,5), dan schrijf je ze gewoon zo.</li>
  <li>Kommagetallen typ je met een komma: <code>38,1</code>.</li>
  <li>Een interval typ je zoals in de werkbundel, met een puntkomma: <code>[0 ; 24]</code> of <code>[2 ; +∞[</code> (een komma tussen de grenzen mag ook).</li>
  <li>Bij meerkeuzevragen kies je de zin die het best past bij de situatie.</li></ul></div>`;
const GEOGEBRA = `<div class="kader eig"><div class="kader-titel">Handige GeoGebra-commando's</div>
  <ul><li>Typ het voorschrift, bv. <code>T(x) = (40x + 20)/(x + 2)</code>, en daarna <code>T(18)</code> voor een functiewaarde.</li>
  <li><code>Snijpunt(T, y = 37)</code> geeft waar $T(x) = 37$. &nbsp; <code>Nulpunt(T)</code> geeft de nulwaarden. &nbsp; <code>Asymptoot(T)</code> geeft de asymptoten.</li>
  <li><code>Extremum(T, 0, 24)</code> geeft de top tussen 0 en 24.</li></ul></div>`;
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
