// Programma 'rationale-functies-context' — automatisch samengevoegd uit bron/rationale-functies-context/ (niet rechtstreeks bewerken)
(() => {
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
// ---------- hoe zeg je "bij x" en "de grootheid" in een situatie?
function xZin(S, x) {
  const t = kg(x);
  return { groei: `na ${t} ${S.xe}`, temp: `na ${t} minuten`, kost: `bij ${t} ${S.xe}`, winst: `bij ${t} verkochte ${S.stuks}`, verdeel: `bij ${t} kinderen`,
    wacht: `bij een bezettingsgraad van ${t} %`, conc: `${t} uur na inname`, terug: `bij een besparing van ${t} euro per jaar`, rit: `bij een gemiddelde snelheid van ${t} km/h`,
    verdun: `als ze ${t} ml water toevoegt`, reval: `na ${t} weken`, web: `op dag ${t}` }[S.fam];
}
function yWat(S) {
  return { groei: S.grootheid, temp: `de temperatuur van ${S.ding}`, kost: `de gemiddelde kost per ${S.per}`, winst: `de gemiddelde winst per ${S.stuk}`, verdeel: 'het bedrag per kind',
    wacht: 'de gemiddelde wachttijd', conc: 'de concentratie', terug: 'de terugverdientijd', rit: 'de rijtijd', verdun: 'de concentratie', reval: 'de afstand die de patiënt kan wandelen',
    web: 'het aantal bezoekers per dag' }[S.fam];
}
const tx = (s) => '@@' + s; // gewone tekst in de uitleg (wordt HTML, zodat lange zinnen afbreken)
const naTex = (S) => S.ye === '%' ? '\\%' : `\\text{ ${S.ye}}`;
const decVan = (S) => (S.fam === 'groei' || S.fam === 'web') ? 0 : S.fam === 'conc' || S.fam === 'verdun' ? 2 : 1;

const NAMEN = { begin: 'de beginwaarde (het snijpunt met de verticale as)', ha: 'de horizontale asymptoot', va: 'de verticale asymptoot', nul: 'de nulwaarde', dom: 'het praktisch domein',
  bereik: 'het bereik', verloop: 'het verloopschema (stijgen en dalen)', teken: 'het tekenschema', max: 'het maximum' };

// ===================================================================
//  0 · WOORDENLIJST: VAN WISKUNDETAAL NAAR CONTEXTTAAL
// ===================================================================
const ALLE = ['groei', 'temp', 'kost', 'winst', 'verdeel', 'wacht', 'conc', 'rit', 'verdun'];
const sleutels = (S, z = true) => Object.keys(S.w).filter(k => (!z || S.z[k]) && k !== 'haF');
const D1 = {
  nr: 1, titel: 'Woordenlijst: van wiskundetaal naar contexttaal', kort: 'Wat betekent een kenmerk in een echte situatie?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Kenmerken in context</div>
      <p>In de cursus leerde je de kenmerken van een rationale functie aflezen: domein, nulwaarden, snijpunt met de $y$-as, asymptoten, perforatie, tekenschema, verloopschema en bereik.
      In een situatie moet je diezelfde kenmerken uitleggen in de <b>taal van die situatie</b>: een geneesmiddel in het bloed, de kost van een uitstap, een babyflesje in de flessenwarmer …</p>${WOORDENLIJST}</div>
    ${LET_OP}
    <div class="kader werk"><div class="kader-titel">Uitgewerkt voorbeeld: taalcursus voor nieuwkomers</div>
      <p>Het aantal woorden $W$ dat een nieuwkomer kent, $w$ weken na de start van een taalcursus, is $W(w) = \\dfrac{1200w}{w + 8}$ met $0 \\leq w \\leq 52$.</p>
      ${figuur(rgraf({ x: [0, 52], y: [0, 1400], xs: 4, ys: 200, xn: 'w (weken)', yn: 'aantal woorden', functies: [{ f: (w) => 1200 * w / (w + 8) }], ha: [1200] }))}
      <table class="tabel"><tr><th>Kenmerk</th><th>Wiskundig</th><th>In de context</th></tr>
      <tr><td>Domein</td><td>$\\text{dom } W = [0 \\,;\\, 52]$</td><td>We volgen de nieuwkomer gedurende één jaar (52 weken).</td></tr>
      <tr><td>Bereik</td><td>$\\text{ber } W = [0 \\,;\\, 1040]$</td><td>Het aantal gekende woorden ligt tussen 0 en 1040.</td></tr>
      <tr><td>Beginwaarde</td><td>$W(0) = 0$</td><td>Bij de start kent hij nog geen woorden Nederlands.</td></tr>
      <tr><td>Horizontale asymptoot</td><td>$y = 1200$</td><td>Volgens het model nadert zijn woordenschat 1200 woorden, maar komt hij daar nooit aan.</td></tr>
      <tr><td>Verticale asymptoot</td><td>$x = -8$</td><td>Ligt buiten het domein: in deze situatie heeft ze geen betekenis.</td></tr>
      <tr><td>Verloop</td><td>stijgend op $[0 \\,;\\, 52]$</td><td>Hij leert elke week woorden bij, maar steeds minder per week.</td></tr></table>
      <p><b>Het verhaal van de grafiek.</b> Bij de start kent de nieuwkomer nog geen woorden Nederlands. In de eerste weken leert hij heel snel bij: na 8 weken kent hij al 600 woorden.
      Daarna gaat het steeds trager. Na een jaar kent hij ongeveer 1040 woorden. Volgens het model komt hij nooit boven de 1200 woorden: dat is de grenswaarde.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Flessenwarmer: $T(t) = \\dfrac{40t + 20}{t + 2}$ met $0 \\leq t \\leq 30$ ($T$ in °C, $t$ in minuten).')}<p>Wiskundig: de horizontale asymptoot is $y = 40$. Wat betekent dat?</p>`,
      stappen: ['\\text{Een horizontale asymptoot is een grenswaarde: de melk nadert 40 °C.}', '\\text{Ze bereikt die temperatuur niet: 40 °C is de temperatuur van de flessenwarmer.}', '\\text{Fout: "na een tijd is de melk 40 °C".}'] },
    { html: `${opgave('Sociale werkplaats: $W(n) = \\dfrac{12n - 900}{n}$ ($W$ = gemiddelde winst per stuk in euro, $n$ = aantal verkochte stuks).')}<p>Wiskundig: de nulwaarde is $n = 75$. Wat betekent dat?</p>`,
      stappen: ['W(75) = 0: \\text{ bij 75 stuks is de gemiddelde winst 0 euro.}', '\\text{De investering van 900 euro is dan precies terugverdiend: vanaf 75 stuks maakt de werkplaats winst.}'] },
  ],
  soorten: {
    betekenis: { naam: 'Wiskundetaal → contexttaal', gen() {
      const S = kiesSit(ALLE), k = kies(sleutels(S)), juist = S.z[k];
      const fout = schud(sleutels(S).filter(x => x !== k).map(x => S.z[x])); if (k === 'ha' || k === 'va') fout.unshift(S.z.haF);
      return { soort: 'betekenis', opdracht: 'Wat betekent dit kenmerk in de situatie?', html: `${sitOpgave(S)}<p>Wiskundig: $${S.w[k]}$</p>`, sleutel: S.fam + k + juist,
        rapport: `${S.titel}: ${W.platteTekst(S.w[k])}`, antw: zinnen(juist, fout), uitleg: [`\\text{${NAMEN[k]}: } ${S.w[k]}`, tx(juist)] };
    } },
    kenmerk: { naam: 'Welk kenmerk?', gen() {
      const S = kiesSit(ALLE), k = kies(sleutels(S));
      const fout = schud(Object.keys(NAMEN).filter(x => x !== k && !(k === 'begin' && x === 'max'))).map(x => NAMEN[x]);
      return { soort: 'kenmerk', opdracht: 'Over welk kenmerk van de functie gaat deze zin?', html: `${sitOpgave(S)}<p class="midden"><i>"${S.z[k]}"</i></p>`, sleutel: S.fam + k + S.z[k],
        rapport: `${S.titel}: "${S.z[k]}"`, antw: zinnen(NAMEN[k], fout), uitleg: [`\\text{Het gaat over ${NAMEN[k]}: } ${S.w[k]}`] };
    } },
    naarWiskunde: { naam: 'Contexttaal → wiskundetaal', gen() {
      const S = kiesSit(ALLE), ks = sleutels(S), k = kies(ks);
      const opties = schud([k, ...schud(ks.filter(x => x !== k)).slice(0, 3)]);
      return { soort: 'naarWiskunde', opdracht: 'Welke wiskundige uitspraak hoort bij deze zin?', html: `${sitOpgave(S)}<p class="midden"><i>"${S.z[k]}"</i></p>`, sleutel: S.fam + k + S.z[k],
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
  const S = kiesSit(['groei', 'temp', 'kost', 'winst', 'wacht', 'conc']), [a, b] = S.dom;
  const top = S.fam === 'wacht' ? 95 : b;
  let x; do { x = S.losse ? rnd(a, top) : kies([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 45, 50, 60, 70, 75, 80, 90].filter(v => v >= a && v <= top)); } while (W.grensgeval(S.f(x), decVan(S)));
  const d = decVan(S), y = S.f(x);
  return { soort: 'waarde', opdracht: 'Bereken met GeoGebra (of je rekenmachine).', html: `${sitOpgave(S)}<p>Hoe groot is ${yWat(S)} ${xZin(S, x)}?</p>`, sleutel: S.tex + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: getal(y, { dec: d, voor: `${S.fn}(${tg(x)}) =`, na: naTex(S) }),
    uitleg: [`${S.fn}(${tg(x)}) = ${tg(y, d)}${naTex(S)}`, `\\text{${zin(xZin(S, x))} is ${yWat(S)} ongeveer ${kg(y, d)} ${S.ye}.}`] };
}
function vraagWanneer() {
  const S = kiesSit(['groei', 'temp', 'kost', 'winst', 'wacht']);
  const [a, b] = S.dom, f = S.f;
  let c, vr, x, antw, uitl;
  if (S.fam === 'kost') { // hoogstens G euro per deelnemer
    let n; do { const G = rnd(Math.ceil(f(b)) + 1, Math.floor(f(a)) - 1); c = G; n = Math.ceil(S.v / (G - S.p) - 1e-9); } while (n < a || n > b);
    x = n; vr = `${zin(S.wat)} mag hoogstens ${c} euro per ${S.per} kosten. Hoeveel ${S.xe} zijn er minstens nodig?`;
    antw = getal(n, { voor: 'n =', na: `\\text{ ${S.xe}}` });
    uitl = [`${S.fn}(n) = ${c} \\text{ bij } n = ${tg(S.v / (c - S.p), 2)} \\text{ (GeoGebra: Snijpunt)}`, `K \\text{ daalt, dus } K(n) \\leq ${c} \\text{ vanaf } n = ${n} \\text{ (een aantal is een natuurlijk getal: naar boven afronden)}`];
  } else if (S.fam === 'winst') {
    let n; do { c = rnd(1, S.p - 1); n = Math.ceil(S.v / (S.p - c) - 1e-9); } while (n < a || n > b);
    x = n; vr = `Hoeveel ${S.stuks} moet ${S.wat} minstens verkopen om gemiddeld minstens ${c} euro winst per ${S.stuk} te maken?`;
    antw = getal(n, { voor: 'n =', na: `\\text{ ${S.stuks}}` });
    uitl = [`W(n) = ${c} \\text{ bij } n = ${tg(S.v / (S.p - c), 2)}`, `W \\text{ stijgt, dus } W(n) \\geq ${c} \\text{ vanaf } n = ${n}`];
  } else {
    if (S.fam === 'temp') c = S.op ? Math.floor(f(rnd(6, 18))) : kies([40, 45, 50, 55, 60].filter(v => v < S.T0 - 5 && v > S.eind + 1));
    if (S.fam === 'groei') c = Math.round(kies([0.5, 0.6, 0.75, 0.8]) * S.A);
    if (S.fam === 'wacht') c = kies([10, 15, 20, 30, 45, 60].filter(v => v > S.c / 100 + 2));
    if (c === undefined) c = S.T0 - 10;
    x = los(f, c, a, S.fam === 'wacht' ? 99.99 : b);
    const d = S.fam === 'groei' ? 1 : 1;
    vr = { temp: `Na hoeveel minuten is ${S.ding} ${c} °C?`, groei: `Na hoeveel ${S.xe} is ${S.grootheid} ${kg(c)}?`, wacht: `Bij welke bezettingsgraad wacht je gemiddeld ${c} minuten?` }[S.fam];
    antw = getal(x, { dec: d, voor: `${S.x} =`, na: S.fam === 'wacht' ? '\\%' : `\\text{ ${S.xe}}` });
    uitl = [`\\text{GeoGebra: Snijpunt(${S.fn}, y = ${kg(c)})}`, `${S.fn}(${S.x}) = ${tg(c)} \\text{ voor } ${S.x} \\approx ${tg(x, d)}`];
  }
  return { soort: 'wanneer', opdracht: 'Gebruik GeoGebra: snijd de grafiek met een horizontale rechte.', html: `${sitOpgave(S)}<p>${vr}</p>`, sleutel: S.tex + c,
    rapport: `${S.titel}: ${W.platteTekst(vr)}`, antw, uitleg: uitl };
}
function vraagHA() {
  const S = kiesSit(['groei', 'temp', 'kost', 'winst', 'conc']);
  const fout = [S.z.haF, S.fam === 'conc' ? `Na ${S.tm} uur is ${S.ding} volledig uitgewerkt.` : `${zin(yWat(S))} wordt na een tijd 0.`, `${zin(yWat(S))} wordt onbeperkt groot.`];
  return { soort: 'ha', opdracht: 'Bepaal de horizontale asymptoot en leg uit wat ze betekent.', html: sitOpgave(S, figuur(sitGraf(S))), sleutel: S.tex + 'ha',
    rapport: `${S.titel}: horizontale asymptoot`, antw: delen(['\\text{horizontale asymptoot: } y =', getal(S.ha)], ['\\text{betekenis:}', zinnen(S.z.ha, fout)]),
    uitleg: [`y = ${S.ha}`, tx(S.z.ha)] };
}
function vraagMax() {
  const S = sitConc();
  return { soort: 'max', opdracht: 'Bepaal het maximum met GeoGebra: Extremum(C, 0, 24).', html: sitOpgave(S, figuur(sitGraf(S))), sleutel: S.tex,
    rapport: `${S.titel}: maximum`, antw: delen(['\\text{Na hoeveel uur is de concentratie het hoogst? } t =', getal(S.tm, { na: '\\text{ uur}' })],
      ['\\text{Hoe groot is ze dan? } C =', getal(S.Mx, { dec: 2, na: '\\text{ mg/l}' })], ['\\text{Om hoe laat is dat? Om}', getal(S.uur + S.tm, { na: '\\text{ u}' })]),
    uitleg: [`\\text{Extremum: } (${S.tm} \\,;\\, ${S.Mx})`, `\\text{Na ${S.tm} uur is de concentratie het hoogst: ${S.Mx} mg/l. Dat is om ${S.uur} u + ${S.tm} uur = ${S.uur + S.tm} u.}`] };
}
function vraagNul() {
  const S = sitWinst();
  const fout = [`Bij ${S.nul} ${S.stuks} is de gemiddelde winst per ${S.stuk} het grootst.`, `Na ${S.nul} ${S.stuks} verdient ${S.wat} niets meer.`, `Vanaf ${S.nul} ${S.stuks} verdient ${S.wat} ${S.p} euro per ${S.stuk}.`];
  return { soort: 'nul', opdracht: 'Bepaal de nulwaarde en leg uit wat ze betekent.', html: sitOpgave(S, figuur(sitGraf(S))), sleutel: S.tex,
    rapport: `${S.titel}: nulwaarde`, antw: delen(['\\text{nulwaarde: } n =', getal(S.nul)], ['\\text{betekenis:}', zinnen(S.z.nul, fout)]),
    uitleg: [`${S.p}n - ${S.v} = 0 \\Leftrightarrow n = ${S.nul}`, tx(S.z.nul)] };
}
function vraagGemVerandering() {
  const S = sitTemp(kies(['flesje', 'koffie', 'soep', 'maaltijd'])), t1 = kies([0, 0, 5]), t2 = t1 + 5;
  const g = (S.f(t2) - S.f(t1)) / 5;
  return { soort: 'gemV', opdracht: 'Bereken met GeoGebra.', html: `${sitOpgave(S)}<p>Hoeveel graden ${S.op ? 'stijgt' : 'daalt'} de temperatuur gemiddeld per minuut tussen minuut ${t1} en minuut ${t2}?</p>`, sleutel: S.tex + t1,
    rapport: `${S.titel}: gemiddelde verandering [${t1}, ${t2}]`, antw: getal(Math.abs(g), { dec: 1, na: '\\text{ °C per minuut}' }),
    uitleg: [`${S.fn}(${t1}) = ${tg(S.f(t1), 2)}, \\quad ${S.fn}(${t2}) = ${tg(S.f(t2), 2)}`, `\\dfrac{${tg(S.f(t2), 2)} - ${tg(S.f(t1), 2)}}{5} \\approx ${tg(g, 1)}`, '\\text{In het begin is de grafiek steil, later bijna vlak: de verandering gaat steeds trager.}'] };
}
const D2 = {
  nr: 2, titel: 'Kenmerken aflezen en interpreteren', kort: 'Functiewaarden, snijpunten, asymptoten, maximum en nulwaarde in context.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Lees af én interpreteer</div>
      <p>Je bepaalt een kenmerk (op de grafiek of met GeoGebra), maar je stopt niet bij het getal: je legt telkens uit wat het betekent in de situatie, <b>in een volledige zin, met eenheden</b>.</p>
      <ul><li><b>Functiewaarde</b> $f(a)$: hoe groot is de grootheid bij $x = a$?</li>
      <li><b>Wanneer is $f(x) = c$?</b> Snijd de grafiek met de horizontale rechte $y = c$ (GeoGebra: <code>Snijpunt(f, y = c)</code>).
        Bij een <b>aantal</b> (deelnemers, stuks …) rond je af naar het juiste natuurlijke getal: vraag je af of je naar boven of naar onder moet afronden.</li>
      <li><b>Maximum</b>: GeoGebra <code>Extremum(f, 0, 24)</code>. Noteer wanneer (de $x$-waarde) én hoe groot (de $y$-waarde).</li>
      <li><b>Horizontale asymptoot</b>: de grenswaarde. <b>Nulwaarde</b>: het moment waarop de grootheid nul is (bv. omslagpunt van verlies naar winst).</li>
      <li><b>Gemiddelde verandering</b> tussen $a$ en $b$: $\\dfrac{f(b) - f(a)}{b - a}$.</li></ul></div>${GEOGEBRA}
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een pijnstiller in het bloed</div>
      <p>$C(t) = \\dfrac{30t}{t^2 + 9}$ met $0 \\leq t \\leq 24$ ($C$ in mg/l, $t$ in uur na inname om 8 u).</p>
      ${figuur(rgraf({ x: [0, 24], y: [0, 6], xs: 2, ys: 1, xn: 't (uur)', yn: 'concentratie (mg/l)', functies: [{ f: (t) => 30 * t / (t * t + 9) }] }))}
      <ul><li>Beginwaarde $C(0) = 0$: bij inname zit er nog geen pijnstiller in het bloed.</li>
      <li>Maximum $(3 \\,;\\, 5)$: na 3 uur, om 11 u, is de concentratie het hoogst: 5 mg/l.</li>
      <li>$C(t) \\geq 3$ voor $1 \\leq t \\leq 9$: de pijnstiller werkt van 9 u tot 17 u, dus 8 uur lang.</li>
      <li>Horizontale asymptoot $y = 0$: op lange termijn verdwijnt de pijnstiller uit het bloed.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: de kost van een daguitstap</div>
      <p>$K(n) = \\dfrac{600 + 25n}{n}$ met $5 \\leq n \\leq 60$ (gemiddelde kost per deelnemer in euro).</p>
      <p>Hoogstens 40 euro per deelnemer? $K(n) = 40$ bij $n = 40$. $K$ daalt, dus er zijn <b>minstens 40 deelnemers</b> nodig.
      Horizontale asymptoot $y = 25$: elke deelnemer betaalt sowieso 25 euro voor inkom en lunch; het busgeld wordt over steeds meer mensen verdeeld, maar verdwijnt nooit helemaal.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Wachttijd aan het onthaal: $W(b) = \\dfrac{300}{100 - b}$ met $0 \\leq b < 100$ ($W$ in minuten, $b$ = bezettingsgraad in %).')}<p>De directie wil dat bezoekers hoogstens een halfuur wachten. Welke bezettingsgraad mogen de medewerkers hoogstens hebben?</p>`,
      stappen: ['\\text{Snijpunt(W, y = 30): } b = 90', 'W \\text{ stijgt, dus } W(b) \\leq 30 \\text{ als } b \\leq 90', '\\text{De bezettingsgraad mag hoogstens 90 \\% zijn.}'] },
    { html: `${opgave('Babyflesje: $T(t) = \\dfrac{40t + 20}{t + 2}$ met $0 \\leq t \\leq 30$.')}<p>Hoeveel graden stijgt de temperatuur gemiddeld per minuut in de eerste 5 minuten?</p>`,
      stappen: ['T(0) = 10, \\quad T(5) \\approx 31{,}43', '\\dfrac{31{,}43 - 10}{5} \\approx 4{,}3 \\text{ °C per minuut}'] },
  ],
  soorten: {
    waarde: { naam: 'Functiewaarde in context', gen: vraagWaarde },
    wanneer: { naam: 'Wanneer bereikt de grootheid een waarde?', gen: vraagWanneer },
    ha: { naam: 'Horizontale asymptoot en betekenis', gen: vraagHA },
    max: { naam: 'Maximum van een concentratie', gen: vraagMax },
    nul: { naam: 'Nulwaarde: van verlies naar winst', gen: vraagNul },
    gemV: { naam: 'Gemiddelde verandering', gen: vraagGemVerandering },
  },
  oefenMix: [['waarde', 2], ['wanneer', 2], ['ha', 2], ['max', 1], ['nul', 1], ['gemV', 1]],
  test: [['waarde', 2], ['wanneer', 3], ['ha', 2], ['max', 1], ['nul', 1], ['gemV', 1]], testSchudden: true,
};

// ===================================================================
//  2 · WISKUNDIG DOMEIN EN PRAKTISCH DOMEIN
// ===================================================================
const zonder = (a) => [{ a: -I, ai: false, b: a, bi: false }, { a, ai: false, b: I, bi: false }];
function vraagWiskDom() {
  const S = kiesSit(['groei', 'temp', 'kost', 'winst', 'verdeel', 'wacht', 'terug', 'rit', 'verdun']);
  return { soort: 'wiskdom', opdracht: 'Bepaal het wiskundig domein (alle reële getallen waarvoor het voorschrift bestaat).', html: `${opgave(S.verhaal)}<p class="midden">$${S.tex}$</p>`, sleutel: S.tex,
    rapport: `${S.titel}: wiskundig domein`, antw: vz(zonder(S.va), `\\text{dom } ${S.fn} =`),
    uitleg: [`\\text{De noemer wordt nul voor } ${S.x} = ${tg(S.va)}`, `\\text{dom } ${S.fn} = \\mathbb{R} \\setminus \\{${tg(S.va)}\\}`, '\\text{Dat is het wiskundig domein: in de situatie hebben lang niet al die waarden zin.}'] };
}
function vraagPraktDom() {
  const S = kiesSit(['verdeel', 'temp', 'verdun', 'wacht', 'conc']);
  let juist, fout, info = '';
  if (S.fam === 'verdeel') { juist = `$\\{1, 2, 3, \\ldots, ${S.N}\\}$`; fout = [`$[0 \\,;\\, ${S.N}]$`, '$\\mathbb{R} \\setminus \\{0\\}$', `$${ivTex(0, I, false, false)}$`]; }
  if (S.fam === 'temp') { juist = `$${ivTex(0, S.dom[1])}$`; fout = [`$\\mathbb{R} \\setminus \\{${-S.b}\\}$`, `$${ivTex(-S.b, S.dom[1], false, true)}$`, `$${ivTex(0, I, true, false)}$`]; info = S.z.dom; }
  if (S.fam === 'verdun') { juist = `$${ivTex(0, S.dom[1])}$`; fout = [`$${ivTex(0, 250)}$`, `$${ivTex(-S.V0, I, false, false)}$`, `$${ivTex(-S.V0, S.dom[1], false, true)}$`]; }
  if (S.fam === 'wacht') { juist = `$${ivTex(0, 100, true, false)}$`; fout = [`$${ivTex(0, 100)}$`, `$${ivTex(-I, 100, false, false)}$`, `$${ivTex(0, I, true, false)}$`]; info = 'Een bezettingsgraad ligt tussen 0 % en 100 %.'; }
  if (S.fam === 'conc') { juist = `$${ivTex(0, 24)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(-24, 24)}$`, `$${ivTex(0, I, true, false)}$`]; info = 'We volgen de concentratie tijdens het eerste etmaal na inname.'; }
  const r = (s) => s.replace(/\$([^$]+)\$/g, (m, t) => M(t));
  const uit = { verdeel: `Er doet minstens 1 kind mee en er zijn maximaal ${S.N} plaatsen. Het aantal kinderen is een natuurlijk getal: het praktisch domein is geen interval.`,
    temp: `De tijd is niet negatief en we volgen ${S.ding} ${S.dom[1]} minuten.`, verdun: `Je kan geen negatieve hoeveelheid water toevoegen, en er past nog 250 − ${S.V0} = ${S.dom[1]} ml bij.`,
    wacht: 'Een bezettingsgraad ligt tussen 0 % en 100 %, en bij 100 % ligt de verticale asymptoot: 100 hoort er niet bij.', conc: 'De tijd is niet negatief en we volgen één etmaal (24 uur).' }[S.fam];
  return { soort: 'praktdom', opdracht: 'Welk praktisch domein past bij de situatie?', html: `${opgave(S.verhaal)}<p class="midden">$${S.tex}$</p>${info ? p_(info) : ''}`, sleutel: S.tex,
    rapport: `${S.titel}: praktisch domein`, antw: zinnen(r(juist), fout.map(r), { lijst: false }), uitleg: [tx(uit)] };
}
function vraagLosse() {
  const S = kiesSit(['kost', 'winst', 'verdeel', 'temp', 'conc', 'rit', 'groei']);
  const aantal = S.losse;
  const wat = { kost: S.xe, winst: S.stuks, verdeel: 'kinderen' }[S.fam];
  const juist = aantal ? `Losse punten: het aantal ${wat} is een natuurlijk getal.` : `Een doorlopende lijn: ${S.fam === 'rit' ? 'de snelheid' : 'de tijd'} kan elke waarde aannemen.`;
  const fout = aantal ? ['Een doorlopende lijn: de functie is een rationale functie.', `Een doorlopende lijn: het aantal ${wat} kan elke waarde aannemen.`, 'Losse punten: er is een verticale asymptoot.']
    : ['Losse punten: je kan enkel gehele getallen invullen.', 'Losse punten: er is een verticale asymptoot.', 'Een doorlopende lijn: elke functie heeft een doorlopende grafiek.'];
  return { soort: 'losse', opdracht: 'Hoe ziet de grafiek er in werkelijkheid uit?', html: `${opgave(S.verhaal)}<p class="midden">$${S.tex}$</p>`, sleutel: S.tex + 'l',
    rapport: `${S.titel}: losse punten of lijn`, antw: zinnen(juist, fout), uitleg: [tx(juist)] };
}
function vraagBereikPrakt() {
  const S = kiesSit(['rit', 'verdun', 'wacht']);
  let st, uit;
  if (S.fam === 'wacht') { st = [{ a: S.c / 100, ai: true, b: I, bi: false }]; uit = [`W(0) = ${tg(S.c / 100)} \\text{ en } W \\text{ stijgt naar } +\\infty \\text{ bij } b = 100`]; }
  else { const [lo, hi] = S.bereik; st = [{ a: lo, ai: true, b: hi, bi: true }]; uit = S.fam === 'rit' ? [`R(120) = ${tg(lo)}, \\; R(20) = ${tg(hi)} \\; (R \\text{ daalt})`] : [`C(${S.dom[1]}) = ${tg(lo)}, \\; C(0) = ${tg(hi)} \\; (C \\text{ daalt})`]; }
  uit.push(`\\text{ber } ${S.fn} = ${VZ.texVan(st)}`);
  return { soort: 'bereik', opdracht: 'Bepaal het bereik op het praktisch domein.', html: sitOpgave(S, figuur(sitGraf(S))), sleutel: S.tex + 'b',
    rapport: `${S.titel}: bereik`, antw: vz(st, `\\text{ber } ${S.fn} =`), uitleg: uit };
}
function vraagVABinnen() {
  const S = kiesSit(['wacht', 'terug', 'temp', 'groei', 'verdun', 'kost', 'rit']);
  const binnen = S.vaBinnen;
  const juist = binnen ? `Ja, ze ligt aan de rand van het praktisch domein: ${S.z.va.charAt(0).toLowerCase() + S.z.va.slice(1)}` : `Neen, ze ligt buiten het praktisch domein: ze heeft in deze situatie geen betekenis.`;
  const fout = binnen ? ['Neen, ze ligt buiten het praktisch domein: ze heeft in deze situatie geen betekenis.', `Ja: daar is ${yWat(S)} precies 0.`, `Neen: een verticale asymptoot heeft nooit betekenis in een situatie.`]
    : [`Ja: daar wordt ${yWat(S)} onbeperkt groot.`, `Ja: daar is ${yWat(S)} precies 0.`, 'Neen, want een rationale functie heeft geen verticale asymptoot.'];
  return { soort: 'vabinnen', opdracht: `De verticale asymptoot is $${S.x} = ${tg(S.va)}$. Speelt ze een rol in de situatie?`, html: sitOpgave(S), sleutel: S.tex + 'va',
    rapport: `${S.titel}: verticale asymptoot ${S.x} = ${kg(S.va)}`, antw: zinnen(juist, fout), uitleg: [tx(juist)] };
}
function vraagGrens() {
  const S = kiesSit(['rit', 'terug', 'verdun']);
  let vr, antw, uit;
  if (S.fam === 'rit') {
    const T = kies([15, 18, 20, 24, 30].filter(t => 60 * S.d / t <= 120 && 60 * S.d / t >= 30)), v = 60 * S.d / T;
    vr = `De ziekenwagen moet binnen ${T} minuten aankomen. Hoe snel moet hij gemiddeld minstens rijden?`; antw = getal(v, { dec: 1, voor: 'v =', na: '\\text{ km/h}' });
    uit = [`R(v) = ${T} \\Leftrightarrow \\dfrac{${60 * S.d}}{v} = ${T} \\Leftrightarrow v = ${tg(v, 1)}`, `R \\text{ daalt: } R(v) \\leq ${T} \\text{ als } v \\geq ${tg(v, 1)} \\text{ km/h}`];
  } else if (S.fam === 'terug') {
    const J = kies([10, 15, 20, 25]), b = S.o + S.I0 / J;
    vr = `Een warmtepomp gaat ongeveer ${J} jaar mee. Hoeveel moet het centrum minstens besparen per jaar om de pomp terug te verdienen?`; antw = getal(b, { dec: 2, voor: 'b =', na: '\\text{ euro per jaar}' });
    uit = [`T(b) = ${J} \\Leftrightarrow b - ${S.o} = \\dfrac{${S.I0}}{${J}} \\Leftrightarrow b = ${tg(b, 2)}`, `T \\text{ daalt: } T(b) \\leq ${J} \\text{ als } b \\geq ${tg(b, 2)}`];
  } else {
    let c, w; do { c = kies([2, 2.5, 4, 5, 8, 10]); w = S.m / c - S.V0; } while (w <= 0 || w > S.dom[1]);
    vr = `Hoeveel water moet ze toevoegen om een concentratie van ${kg(c)} mg/ml te krijgen?`; antw = getal(w, { dec: 1, voor: 'w =', na: '\\text{ ml}' });
    uit = [`\\text{Snijpunt(C, y = ${kg(c)}): } w = ${tg(w, 1)}`];
  }
  return { soort: 'grens', opdracht: 'Gebruik GeoGebra of los op.', html: sitOpgave(S), sleutel: S.tex + vr, rapport: `${S.titel}: ${vr}`, antw, uitleg: uit };
}
const D3 = {
  nr: 3, titel: 'Wiskundig domein en praktisch domein', kort: 'Voor welke waarden is het model zinvol? Losse punten of een lijn?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Wiskundig domein en praktisch domein</div>
      <p>Het <b>wiskundig domein</b> van een rationale functie bestaat uit alle reële getallen, behalve de nulwaarden van de noemer: daar kan je niet delen.</p>
      <p>In een situatie hebben niet alle waarden zin. Een tijd, een snelheid of een prijs is meestal niet negatief, en een aantal is een natuurlijk getal.
      Het <b>praktisch domein</b> is het deel van het domein waarvoor het model zinvol is. Het bereik bepaal je dan op het praktisch domein.</p></div>
    <div class="kader eig"><div class="kader-titel">Stappenplan</div>
      <ol><li>Teken de grafiek in GeoGebra.</li><li>Bepaal het wiskundig domein: waar wordt de noemer nul?</li>
      <li>Welke waarden kan de onafhankelijke veranderlijke ($x$, $t$, $n$ …) in werkelijkheid aannemen?</li>
      <li>Waar geeft het model onmogelijke uitkomsten (negatieve aantallen …)?</li>
      <li>Noteer het praktisch domein als interval (of als verzameling) en verklaar de grenzen.</li><li>Bepaal het bereik op dat praktisch domein.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een zomerkamp</div>
      <p>Een gemeente verdeelt 4800 euro onder de kinderen van een zomerkamp met maximaal 120 plaatsen: $B(n) = \\dfrac{4800}{n}$.</p>
      <ul><li>Wiskundig domein: $\\mathbb{R} \\setminus \\{0\\}$.</li>
      <li>Praktisch domein: $\\{1, 2, 3, \\ldots, 120\\}$: minstens 1 kind, maximaal 120, en een aantal is een natuurlijk getal. Dat is <b>geen interval</b>: de grafiek bestaat uit <b>losse punten</b>.</li>
      <li>Het bedrag ligt tussen 40 euro (bij 120 kinderen) en 4800 euro (bij 1 kind).</li>
      <li>Horizontale asymptoot $y = 0$: het bedrag per kind nadert 0, maar wordt nooit 0.</li></ul>
      ${figuur(rgraf({ x: [0, 120], y: [0, 500], xs: 20, ys: 100, xn: 'n (kinderen)', yn: 'bedrag per kind (euro)', functies: [{ f: (n) => 4800 / n, van: 10, losse: true, stap: 2 }] }))}
      <p class="klein midden">(enkel de punten vanaf 10 kinderen getekend)</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een geneesmiddel verdunnen</div>
      <p>500 mg in 20 ml water, daarna $w$ ml water erbij, het flesje kan 250 ml bevatten: $C(w) = \\dfrac{500}{w + 20}$.</p>
      <p>Wiskundig domein $\\mathbb{R} \\setminus \\{-20\\}$. Praktisch domein $[0 \\,;\\, 230]$: geen negatieve hoeveelheid water, en er past nog $250 - 20 = 230$ ml bij.
      De verticale asymptoot $w = -20$ ligt buiten het praktisch domein: ze heeft hier geen betekenis. Bereik: $[2 \\,;\\, 25]$.</p></div>
    <div class="kader"><div class="kader-titel">Zo vul je in</div><p>Wiskundig domein: <code>ℝ \\ {-20}</code> (met de knoppen ℝ en \\). Een interval: <code>[2 ; 25]</code> of <code>[3 ; +∞[</code>.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Een ziekenwagen rijdt 30 km: $R(v) = \\dfrac{1800}{v}$ ($R$ in minuten, $v$ in km/h). Praktisch domein $[20 \\,;\\, 120]$.')}<p>Bepaal het bereik op het praktisch domein.</p>`,
      stappen: ['R(120) = 15, \\quad R(20) = 90', 'R \\text{ daalt: } \\text{ber } R = [15 \\,;\\, 90]', '\\text{De rit duurt tussen 15 en 90 minuten.}'] },
    { html: `${opgave('Warmtepomp: $T(b) = \\dfrac{6000}{b - 200}$ ($T$ in jaar, $b$ = besparing in euro per jaar).')}<p>Speelt de verticale asymptoot $b = 200$ een rol?</p>`,
      stappen: ['\\text{Ja: als de besparing bijna gelijk is aan de onderhoudskost (200 euro), blijft er bijna niets over.}', '\\text{De terugverdientijd wordt dan onbeperkt groot.}'] },
  ],
  soorten: {
    wiskdom: { naam: 'Wiskundig domein', gen: vraagWiskDom },
    praktdom: { naam: 'Praktisch domein kiezen', gen: vraagPraktDom },
    losse: { naam: 'Losse punten of een lijn?', gen: vraagLosse },
    bereik: { naam: 'Bereik op het praktisch domein', gen: vraagBereikPrakt },
    vabinnen: { naam: 'Speelt de verticale asymptoot een rol?', gen: vraagVABinnen },
    grens: { naam: 'Een grens berekenen', gen: vraagGrens },
  },
  oefenMix: [['wiskdom', 1], ['praktdom', 2], ['losse', 1], ['bereik', 1], ['vabinnen', 1], ['grens', 1]],
  test: [['wiskdom', 2], ['praktdom', 2], ['losse', 1], ['bereik', 2], ['vabinnen', 1], ['grens', 2]], testSchudden: true,
};

// ===================================================================
//  3 · KRITISCH KIJKEN NAAR EEN MODEL
// ===================================================================
function vraagExtrapoleer() {
  const keuzeS = kies(['groei', 'conc', 'wacht']);
  let S, x, d, vr, juist, fout;
  if (keuzeS === 'groei') {
    S = sitGroei('woorden'); x = kies([104, 260, 520]); d = 0;
    vr = `Hoeveel woorden kent de nieuwkomer volgens het model na ${x / 52} jaar? Een volwassene die vlot Nederlands spreekt, kent er minstens 10 000.`;
    juist = `Het model breekt op lange termijn: in werkelijkheid is er geen grens van ${S.A} woorden. Het is enkel bruikbaar tijdens de taalcursus.`;
    fout = [`Het model klopt: de nieuwkomer leert nooit meer dan ${S.A} woorden.`, 'Het model klopt, want de grafiek blijft stijgen.', 'Het model is fout, want een rationale functie kan geen woordenschat beschrijven.'];
  } else if (keuzeS === 'conc') {
    S = sitConc(); x = kies([48, 72, 100]); d = 2;
    vr = `Wat voorspelt het model ${x} uur na inname? In werkelijkheid is ${S.ding} na een tijd volledig uit het lichaam verdwenen.`;
    juist = 'Op lange termijn klopt het model niet meer: volgens het model wordt de concentratie nooit 0. Het is enkel bruikbaar op een beperkt tijdsinterval.';
    fout = ['Het model klopt: er blijft altijd een beetje geneesmiddel in het bloed.', 'Het model klopt, want de horizontale asymptoot is y = 0.', `Het model voorspelt dat ${S.ding} na ${x} uur volledig uitgewerkt is.`];
  } else {
    S = sitWacht(); x = kies([99, 99.5, 99.9]); d = 0;
    vr = `Hoeveel minuten zou je volgens het model wachten bij een bezettingsgraad van ${kg(x)} %?`;
    juist = 'Dat is niet realistisch: in werkelijkheid gaan bezoekers weg of komen ze later terug, en wordt er extra personeel ingeschakeld.';
    fout = ['Dat is realistisch: bij een drukke dienst wacht je zo lang.', 'Dat kan niet, want de wachttijd kan nooit meer dan 100 minuten zijn.', 'Het model klopt, want de verticale asymptoot ligt bij b = 100.'];
  }
  const y = S.f(x);
  return { soort: 'extra', opdracht: 'Bereken met GeoGebra en kijk kritisch naar het model.', html: `${sitOpgave(S)}<p>${vr}</p>`, sleutel: S.tex + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: delen([`${S.fn}(${tg(x)}) =`, getal(y, { dec: d, voor: '', na: naTex(S) })], ['\\text{Wat besluit je?}', zinnen(juist, fout)]),
    uitleg: [`${S.fn}(${tg(x)}) \\approx ${tg(y, d)}`, tx(juist)] };
}
function vraagBuiten() {
  const kz = kies(['groei', 'wacht', 'terug']);
  let S, x, juist, fout;
  if (kz === 'groei') { S = sitGroei('woorden'); x = -kies([2, 3, 4, 5, 6].filter(v => v !== S.b));
    juist = `Een negatief aantal woorden, ${-x} weken vóór de start: dat heeft geen zin, want ${x} ligt buiten het praktisch domein.`;
    fout = ['Vóór de start van de cursus kende hij al woorden.', `Dat is het aantal woorden dat hij ${-x} weken vóór de start vergeten is.`, 'Dat is de verticale asymptoot.']; }
  else if (kz === 'wacht') { S = sitWacht(); x = kies([105, 110, 120]);
    juist = `Een negatieve wachttijd: dat kan niet, want een bezettingsgraad boven 100 % bestaat niet.`;
    fout = ['Bij zo een bezetting moet je niet wachten: je bent meteen aan de beurt.', 'De medewerkers werken dan overuren, dus je wacht minder.', 'Dat is de horizontale asymptoot.']; }
  else { S = sitTerug(); x = kies([50, 80, 100].filter(v => v < S.o));
    juist = `Een negatieve terugverdientijd: in werkelijkheid kost het onderhoud dan meer dan de besparing oplevert, en wordt de pomp nooit terugverdiend.`;
    fout = ['De pomp was al terugverdiend vóór ze geïnstalleerd werd.', 'De pomp wordt heel snel terugverdiend.', 'Dat is de verticale asymptoot.']; }
  const y = S.f(x);
  return { soort: 'buiten', opdracht: 'Bereken met GeoGebra en leg uit.', html: `${opgave(S.verhaal)}<p class="midden">$${S.tex}$</p><p>Bereken $${S.fn}(${tg(x)})$. Wat zou dit betekenen?</p>`, sleutel: S.tex + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: delen([`${S.fn}(${tg(x)}) =`, getal(y, { dec: 1, voor: '' })], ['\\text{Betekenis:}', zinnen(juist, fout)]),
    uitleg: [`${S.fn}(${tg(x)}) \\approx ${tg(y, 1)}`, tx(juist)] };
}
function vraagInterExtra() {
  const t0 = 0, t1 = kies([8, 9, 10, 12]), t = kies([rnd(1, t1 - 1), rnd(1, t1 - 1), t1 + kies([5, 10, 20, 50])]), inter = t < t1;
  const wat = kies([{ w: 'de temperatuur van een flesje melk', e: 'minuten' }, { w: 'de concentratie van een geneesmiddel', e: 'uur' }, { w: 'het aantal vrijwilligers', e: 'weken' }]);
  const juist = inter ? `Interpoleren: ${t} ${wat.e} ligt binnen het gebied van de metingen.` : `Extrapoleren: ${t} ${wat.e} ligt buiten het gebied van de metingen. Opgelet: dat is gevaarlijk!`;
  const fout = inter ? [`Extrapoleren: ${t} ${wat.e} ligt buiten het gebied van de metingen.`, 'Extrapoleren: elke voorspelling met een model is extrapoleren.', 'Interpoleren: elke voorspelling met een model is interpoleren.']
    : [`Interpoleren: ${t} ${wat.e} ligt binnen het gebied van de metingen.`, 'Interpoleren: het model heeft een horizontale asymptoot, dus het is altijd betrouwbaar.', 'Extrapoleren: elke voorspelling met een model is extrapoleren.'];
  return { soort: 'interextra', opdracht: 'Interpoleren of extrapoleren?', html: opgave(`Men meet ${wat.w} van ${t0} tot ${t1} ${wat.e} en maakt een model bij die metingen. Met het model voorspelt men ${wat.w} na ${t} ${wat.e}.`),
    sleutel: `${wat.w}${t1}${t}`, rapport: `metingen ${t0}–${t1}, voorspelling ${t}`, antw: zinnen(juist, fout), uitleg: ['\\text{Binnen de metingen: interpoleren. Erbuiten: extrapoleren.}'] };
}
const MA = (t) => (42 * t + 30) / (t + 3), MB = (t) => -0.2 * t * t + 4.7 * t + 10.3;
const METINGEN = [[0, 10], [1, 16.5], [2, 21.6], [3, 25.6], [4, 28.7], [5, 31.1], [6, 33], [7, 34.5], [8, 35.6], [9, 36.5], [10, 37.2]];
const TWEE_MODELLEN = `<p>In de kinderopvang meet men de temperatuur van een flesje melk in een flessenwarmer, $t$ minuten na het inschakelen:</p>
  <table class="tabel"><tr><th>$t$ (min)</th>${METINGEN.map(m => `<td>${m[0]}</td>`).join('')}</tr><tr><th>$T$ (°C)</th>${METINGEN.map(m => `<td>${kg(m[1], 1, true)}</td>`).join('')}</tr></table>
  <p>Twee leerlingen stellen een model voor: &nbsp; $A(t) = \\dfrac{42t + 30}{t + 3}$ &nbsp; (rationaal) &nbsp; en &nbsp; $B(t) = -0{,}2t^2 + 4{,}7t + 10{,}3$ &nbsp; (tweedegraads).</p>`;
function vraagTweeModellen() {
  const s = kies(['waarde', 'waarde', 'top', 'welk']);
  if (s === 'waarde') {
    const t = kies([20, 30, 45, 60]), m = kies(['A', 'B']), y = (m === 'A' ? MA : MB)(t);
    return { soort: 'twee', opdracht: 'Bereken met GeoGebra.', html: `${TWEE_MODELLEN}<p>Wat voorspelt model ${m} na ${t} minuten?</p>`, sleutel: m + t, rapport: `twee modellen: ${m}(${t})`,
      antw: getal(y, { dec: 1, voor: `${m}(${t}) =`, na: '\\text{ °C}' }), uitleg: [`${m}(${t}) \\approx ${tg(y, 1)} \\text{ °C}`, m === 'A' ? '\\text{Model A nadert 42 °C: realistisch voor een flessenwarmer.}' : '\\text{Model B daalt na de top: dat is extrapoleren met een parabool, niet realistisch.}'] };
  }
  if (s === 'top') return { soort: 'twee', opdracht: 'Bepaal met GeoGebra (Extremum).', html: `${TWEE_MODELLEN}<p>Volgens model B koelt de melk na een tijd weer af. Vanaf hoeveel minuten?</p>`, sleutel: 'top',
    rapport: 'twee modellen: top van B', antw: getal(11.75, { dec: 2, voor: 't =', na: '\\text{ min}' }), uitleg: ['t = -\\dfrac{4{,}7}{2 \\cdot (-0{,}2)} = 11{,}75', '\\text{Niet logisch: de flessenwarmer blijft aanstaan.}'] };
  return { soort: 'twee', opdracht: 'Welk model is het meest realistisch op lange termijn?', html: TWEE_MODELLEN, sleutel: 'welk', rapport: 'twee modellen: welk model?',
    antw: zinnen('Model A: het heeft een horizontale asymptoot y = 42, zodat de melk de temperatuur van de flessenwarmer nadert.',
      ['Model B: het past op het einde van de metingen het best.', 'Model B: een parabool heeft een top, dus de melk wordt nooit te warm.', 'Beide modellen zijn even goed, want ze passen allebei bij de metingen.']),
    uitleg: ['\\text{Binnen de metingen passen beide modellen redelijk.}', '\\text{Daarbuiten geven ze totaal verschillende voorspellingen: kies een model waarvan de vorm past bij de werkelijkheid.}'] };
}
const D4 = {
  nr: 4, titel: 'Kritisch kijken naar een model', kort: 'Waar "breekt" het model? Interpoleren en extrapoleren.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een model is een vereenvoudiging</div>
      <p>Een functie die een situatie beschrijft, noemen we een <b>model</b>. Een model is nooit perfect: het is een vereenvoudiging van de werkelijkheid.</p>
      <p>Bij een rationale functie kijk je vooral kritisch naar de asymptoten. Komt de grootheid in werkelijkheid echt nooit aan de grenswaarde? Wordt ze echt onbeperkt groot bij de verticale asymptoot? Stel je daarom drie vragen:</p>
      <ol><li>Voor welke waarden geeft het model zinvolle resultaten?</li><li>Waar "breekt" het model: waar geeft het onmogelijke of onrealistische uitkomsten?</li><li>Wat zou er in werkelijkheid gebeuren?</li></ol>
      <p>Een voorspelling <b>binnen</b> het gebied van de gemeten gegevens heet <b>interpoleren</b>. Een voorspelling <b>erbuiten</b> heet <b>extrapoleren</b>. Extrapoleren is gevaarlijk!</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: de nieuwkomer leert verder</div>
      <p>$W(w) = \\dfrac{1200w}{w + 8}$: $W(104) \\approx 1114$ woorden na 2 jaar en $W(520) \\approx 1182$ woorden na 10 jaar.
      Volgens het model leert hij nooit meer dan 1200 woorden, terwijl een volwassene die vlot Nederlands spreekt er minstens 10 000 kent. Het model "breekt" op lange termijn: het is enkel bruikbaar tijdens de taalcursus.</p>
      <p>$W(-4) = -1200$: een negatief aantal woorden, vier weken vóór de start. Dat heeft geen zin: $-4$ ligt buiten het praktisch domein.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: twee modellen, één werkelijkheid</div>${TWEE_MODELLEN}
      ${figuur(rgraf({ x: [0, 30], y: [0, 50], xs: 5, ys: 10, xn: 't (minuten)', yn: 'temperatuur (°C)', functies: [{ f: MA }, { f: MB, kleur: GROEN }], ha: [42], punten: METINGEN.map(([x, y]) => ({ x, y })) }))}
      <p class="klein midden">blauw: model A (rationaal) · groen: model B (parabool) · oranje: asymptoot $y = 42$</p>
      <p>Binnen de metingen passen beide modellen redelijk. Maar na 30 minuten voorspelt A ongeveer 39,1 °C en B ongeveer −28,7 °C! Model B daalt na zijn top (bij 11,75 minuten), ook al blijft de flessenwarmer aanstaan.
      Model A heeft een horizontale asymptoot: de melk nadert de temperatuur van de flessenwarmer. Twee modellen die goed passen bij de metingen, kunnen daarbuiten totaal verschillende voorspellingen geven.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Wachttijd: $W(b) = \\dfrac{300}{100 - b}$.')}<p>Bereken $W(99)$ en $W(110)$. Wat besluit je?</p>`,
      stappen: ['W(99) = 300 \\text{ minuten} = 5 \\text{ uur: niet realistisch, bezoekers gaan weg en er komt extra personeel.}', 'W(110) = -30: \\text{ een negatieve wachttijd, en een bezetting boven 100 \\% bestaat niet.}'] },
    { html: `${opgave('Pijnstiller: $C(t) = \\dfrac{30t}{t^2 + 9}$.')}<p>Bereken $C(48)$. Is de pijnstiller ooit uitgewerkt volgens het model?</p>`,
      stappen: ['C(48) \\approx 0{,}62 \\text{ mg/l}', '\\text{Horizontale asymptoot } y = 0: \\text{ de concentratie nadert 0, maar wordt nooit 0.}', '\\text{In werkelijkheid is de pijnstiller na een tijd weg: het model klopt enkel op een beperkt tijdsinterval.}'] },
  ],
  soorten: {
    extra: { naam: 'Ver buiten de metingen', gen: vraagExtrapoleer },
    buiten: { naam: 'Buiten het praktisch domein', gen: vraagBuiten },
    interextra: { naam: 'Interpoleren of extrapoleren?', gen: vraagInterExtra },
    twee: { naam: 'Twee modellen vergelijken', gen: vraagTweeModellen },
  },
  oefenMix: [['extra', 2], ['buiten', 1], ['interextra', 1], ['twee', 2]],
  test: [['extra', 3], ['buiten', 2], ['interextra', 2], ['twee', 3]], testSchudden: true,
};

// ===================================================================
//  4 · KOPPEL DE GRAFIEK AAN DE SITUATIE
// ===================================================================
const VORM = (S) => ({ verdeel: 'd0', rit: 'd0', kost: 'dp', temp: S.op ? 'op' : 'dp', groei: 's0', winst: 'w', wacht: 'va', conc: 'max' }[S.fam]);
function korteSit(S) {
  const K = {
    groei: () => `${zin(S.grootheid)}, ${S.x} ${S.xe} na de start.`,
    temp: () => S.op ? `De temperatuur van ${S.ding} die opwarmt, ${S.x} minuten nadat ze erin gezet werd.` : `De temperatuur van ${S.ding} die afkoelt, ${S.x} minuten na het ${S.variant === 'koffie' ? 'inschenken' : 'opscheppen'}.`,
    kost: () => `De gemiddelde kost per ${S.per} van ${S.wat}, met vaste kosten van ${S.v} euro.`,
    winst: () => `De gemiddelde winst per ${S.stuk} bij n verkochte ${S.stuks}. Er was eerst een startkost.`,
    verdeel: () => `Het bedrag per kind als een gemeente ${S.S} euro verdeelt onder de deelnemers van een kamp.`,
    wacht: () => 'De gemiddelde wachttijd aan een loket, in functie van de bezettingsgraad (in %) van de medewerkers.',
    conc: () => 'De concentratie van een geneesmiddel in het bloed (in mg/l) tijdens het eerste etmaal na inname.',
    rit: () => `De rijtijd (in minuten) van een ziekenwagen voor een rit van ${S.d} km, in functie van de gemiddelde snelheid.`,
  };
  return K[S.fam]();
}
const KOPPEL = ['groei', 'temp', 'kost', 'winst', 'verdeel', 'wacht', 'conc', 'rit'];
function andereSits(S, n) {
  const uit = [], vormen = new Set([VORM(S)]);
  for (const fam of schud(KOPPEL)) { if (uit.length >= n) break; const T = SITUATIES[fam](); if (vormen.has(VORM(T))) continue; vormen.add(VORM(T)); uit.push(T); }
  return uit;
}
const kaal = (S, klein) => rgraf({ x: S.graf.x, y: S.graf.y, functies: [{ f: S.f, van: S.dom[0], tot: S.fam === 'wacht' ? 99.6 : S.dom[1] }], klein, breed: klein ? 260 : 360, hoog: klein ? 160 : 230 });
function vraagGrafNaarSit() {
  const S = kiesSit(KOPPEL), A = andereSits(S, 3);
  const fout = A.map(korteSit); if (Math.random() < 0.3) fout[2] = 'De lichaamstemperatuur van een gezonde persoon, die de hele dag 37 °C blijft.';
  return { soort: 'grafsit', opdracht: 'Welke situatie past bij de grafiek? Redeneer met de vorm en de getallen.', html: figuur(kaal(S)), sleutel: S.tex,
    rapport: `grafiek → situatie (${S.titel})`, antw: zinnen(korteSit(S), fout), uitleg: [tx(korteSit(S)), `\\text{Model: } ${S.tex}`] };
}
function vraagSitNaarGraf() {
  const S = kiesSit(KOPPEL), A = andereSits(S, 3);
  return { soort: 'sitgraf', opdracht: 'Welke grafiek past bij de situatie?', html: `${opgave(S.verhaal)}<p class="midden">$${S.tex}$</p>`, sleutel: S.tex,
    rapport: `situatie → grafiek (${S.titel})`, antw: figuren(kaal(S, true), A.map(T => kaal(T, true))), uitleg: [`\\text{Kijk naar de beginwaarde, stijgen of dalen, en de grenswaarde.}`] };
}
function vraagHALezen() {
  const S = kiesSit(['groei', 'temp', 'kost', 'winst']);
  const opties = schud([S.ha, S.ha * 2, Math.round(S.ha / 2), S.fam === 'temp' ? S.T0 : S.fam === 'groei' ? Math.round(S.A / 2 + S.A / 4) : S.v].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4));
  return { soort: 'haLezen', opdracht: 'Welke grenswaarde (horizontale asymptoot) lees je af?', html: `${opgave(korteSit(S))}${figuur(sitGraf(S))}`, sleutel: S.tex + 'hal',
    rapport: `${S.titel}: grenswaarde aflezen`, antw: { soort: 'keuze', opties: opties.map((v, i) => ({ k: String(i), l: `y = ${tg(v)}` })), juist: String(opties.indexOf(S.ha)) },
    uitleg: [`y = ${S.ha}`, tx(S.z.ha)] };
}
const D5 = {
  nr: 5, titel: 'Koppel de grafiek aan de situatie', kort: 'Grafieken en situaties aan elkaar koppelen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Grafiek en situatie koppelen</div>
      <p>Bij een grafiek zonder namen bij de assen redeneer je met de <b>vorm</b> en de <b>getallen</b>:</p>
      <ul><li><b>Beginwaarde:</b> start de grafiek bij 0 (geen woorden, nog geen geneesmiddel …) of bij een andere waarde (melk uit de koelkast: 10 °C)?</li>
      <li><b>Stijgen of dalen:</b> neemt de grootheid toe (opwarmen, woorden bijleren) of af (afkoelen, kost per deelnemer)? Eerst stijgen en dan dalen (concentratie)?</li>
      <li><b>Grenswaarde:</b> welke waarde nadert de grafiek (de temperatuur van de flessenwarmer, de kost per deelnemer zonder busgeld, 0)?</li>
      <li><b>Verticale asymptoot binnen het gebied:</b> de grootheid loopt uit de hand (wachttijd bij 100 % bezetting).</li>
      <li><b>Negatieve waarden en een nulwaarde:</b> verlies en winst.</li>
      <li><b>Domein:</b> waar begint de grafiek (vanaf 5 deelnemers, vanaf 20 km/h …)?</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden uit de werkbundel</div>
      <table class="tabel"><tr><th>Grafiek</th><th>Situatie</th><th>Doorslaggevend kenmerk</th></tr>
      <tr><td>${rgraf({ x: [0, 60], y: [0, 160], xs: 10, ys: 40, functies: [{ f: (n) => (600 + 25 * n) / n, van: 5 }], klein: true, breed: 200, hoog: 110 })}</td><td>gemiddelde kost per deelnemer van een daguitstap</td><td>dalend naar een grenswaarde 25, begint bij 145 voor $n = 5$</td></tr>
      <tr><td>${rgraf({ x: [0, 100], y: [0, 160], xs: 20, ys: 40, functies: [{ f: (b) => 300 / (100 - b), tot: 99.6 }], klein: true, breed: 200, hoog: 110 })}</td><td>wachttijd in functie van de bezettingsgraad</td><td>verticale asymptoot bij 100</td></tr>
      <tr><td>${rgraf({ x: [0, 300], y: [-35, 15], xs: 50, ys: 10, functies: [{ f: (n) => (12 * n - 900) / n, van: 20 }], klein: true, breed: 200, hoog: 110 })}</td><td>gemiddelde winst per stuk</td><td>eerst negatief, nulwaarde 75, grenswaarde 12</td></tr></table>
      <p>Een constante temperatuur van 37 °C past bij geen enkele van die grafieken: daar hoort een horizontale rechte bij (geen rationale functie).</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: figuur(rgraf({ x: [0, 30], y: [0, 45], xs: 5, ys: 5, functies: [{ f: (t) => (40 * t + 20) / (t + 2) }] })),
      stappen: ['\\text{Begint bij 10 en stijgt naar een grenswaarde 40.}', '\\text{Past bij: de temperatuur van een babyflesje in een flessenwarmer.}'] },
    { html: figuur(rgraf({ x: [0, 24], y: [0, 6], xs: 4, ys: 1, functies: [{ f: (t) => 30 * t / (t * t + 9) }] })),
      stappen: ['\\text{Begint bij 0, stijgt snel tot een maximum en daalt langzaam naar 0.}', '\\text{Past bij: de concentratie van een geneesmiddel in het bloed.}'] },
  ],
  soorten: {
    grafsit: { naam: 'Grafiek → situatie', gen: vraagGrafNaarSit },
    sitgraf: { naam: 'Situatie → grafiek', gen: vraagSitNaarGraf },
    haLezen: { naam: 'Grenswaarde aflezen', gen: vraagHALezen },
  },
  oefenMix: [['grafsit', 2], ['sitgraf', 2], ['haLezen', 1]],
  test: [['grafsit', 4], ['sitgraf', 4], ['haLezen', 2]], testSchudden: true,
};
// ===================================================================
//  5 · VAN SITUATIE NAAR SCHETS
// ===================================================================
function verhaalSit() {
  const fam = kies(['temp', 'groei', 'conc', 'wacht', 'kost']);
  const S = fam === 'temp' ? sitTemp('koffie') : fam === 'groei' ? sitGroei('vrijwilligers') : fam === 'wacht' ? sitWacht('loket') : fam === 'kost' ? sitKost('restaurant') : sitConc('geneesmiddel');
  let v, kenm;
  if (fam === 'temp') { v = `In de leraarskamer wordt een kop koffie van ${S.T0} °C ingeschonken. De kamer is ${S.k} °C warm. De koffie koelt eerst snel af, daarna steeds trager. Na 10 minuten is de koffie ongeveer ${kg(S.f(10), 0)} °C. We volgen de koffie een uur lang.`;
    kenm = { as: ['\\text{horizontale asymptoot: } y =', S.k], dom: [0, 60, true, true] }; }
  if (fam === 'groei') { v = `Een nieuw buurtproject zoekt vrijwilligers. Bij de start (week 0) zijn er nog geen vrijwilligers. De eerste weken schrijven er veel mensen in, daarna steeds minder. Na ${S.b} weken zijn er ${S.A / 2} vrijwilligers. De organisatoren verwachten dat er nooit meer dan ${S.A} vrijwilligers zullen zijn. We volgen het project 20 weken.`;
    kenm = { as: ['\\text{horizontale asymptoot: } y =', S.A], dom: [0, 20, true, true] }; }
  if (fam === 'conc') { v = `Een patiënt krijgt om ${S.uur} u een geneesmiddel. De concentratie in het bloed stijgt eerst snel en bereikt na ${S.tm} uur een maximum van ${S.Mx} mg/l. Daarna daalt ze geleidelijk. Volgens de apotheker wordt de concentratie nooit helemaal nul. We volgen de patiënt 24 uur.`;
    kenm = { as: ['\\text{horizontale asymptoot: } y =', 0], dom: [0, 24, true, true] }; }
  if (fam === 'wacht') { v = `Aan het loket van het OCMW hangt de wachttijd af van de bezettingsgraad van de medewerkers. Bij een bezetting van 0 % wacht je gemiddeld ${kg(S.c / 100)} minuten. Bij 50 % is dat ${kg(S.c / 50)} minuten. Hoe dichter de bezetting bij 100 % komt, hoe sneller de wachttijd oploopt: bij 100 % zou de wachtrij eindeloos worden.`;
    kenm = { as: ['\\text{verticale asymptoot: } b =', 100], dom: [0, 100, true, false] }; }
  if (fam === 'kost') { v = `Een sociaal restaurant heeft per maand ${S.v} euro vaste kosten (huur, energie). Per maaltijd komt daar ${S.p} euro aan ingrediënten bij. Bij 100 maaltijden per maand kost een maaltijd gemiddeld ${kg(S.f(100))} euro. Hoe meer maaltijden, hoe goedkoper per maaltijd, maar nooit goedkoper dan de ingrediënten. We bekijken 100 tot 1500 maaltijden per maand.`;
    kenm = { as: ['\\text{horizontale asymptoot: } y =', S.p], dom: [100, 1500, true, true] }; }
  return { S, v, kenm };
}
// foute modellen voor de grafiekkeuze
function fouteModellen(S) {
  if (S.fam === 'temp') { const { k, T0, b } = S; return [(t) => ((k + 15) * t + T0 * b) / (t + b), (t) => T0 - (T0 - k) * t / 30, (t) => (T0 * t + k * b) / (t + b)]; }
  if (S.fam === 'groei') { const { A, b } = S; return [(w) => 0.6 * A * w / (w + b), (w) => A * b / (w + b), (w) => (A * w + A / 2 * b) / (w + b)]; }
  if (S.fam === 'conc') { const { a, b, tm, Mx } = S; const b2 = (tm + 4) ** 2; return [(t) => 2 * Mx * (tm + 4) * t / (t * t + b2), (t) => 1.6 * a * t / (t * t + b), (t) => Mx * t / (t + tm)]; }
  if (S.fam === 'wacht') { const c = S.c; return [(x) => c / 100 + 3 * c / 100 * x / (x + 20), (x) => c / (x + 25), (x) => c * 0.8 / (80 - x)]; }
  const { v, p } = S; return [(n) => v / n, (n) => (v + 2 * p * n) / n, (n) => p + 30 - v / n / 3];
}
function schetsGraf(S, f, Y1, klein = true) {
  const tot = S.fam === 'wacht' ? 99.6 : S.dom[1];
  return rgraf({ x: S.fam === 'kost' ? [0, 1500] : S.graf.x, y: [0, Y1], functies: [{ f, van: S.dom[0], tot }], klein, breed: 260, hoog: 160 });
}
function vraagVerhaalGraf() {
  const { S, v } = verhaalSit(), F = fouteModellen(S);
  const Y1 = S.fam === 'wacht' ? top(S.c / 4) : S.fam === 'kost' ? top(S.f(100) * 1.4) : S.fam === 'conc' ? top(S.Mx * 1.8) : top(S.graf.y[1] * 1.3);
  return { soort: 'vgraf', opdracht: 'Welke grafiek past bij het verhaal? Controleer alle gegevens.', html: opgave(v), sleutel: v,
    rapport: `verhaal → grafiek (${S.titel})`, antw: figuren(schetsGraf(S, S.f, Y1), F.map(f => schetsGraf(S, f, Y1))),
    uitleg: [tx('Controleer de beginwaarde, de gegeven punten, stijgen of dalen en de asymptoot.'), `\\text{Een passend model: } ${S.tex}`] };
}
function vraagVerhaalKenm() {
  const { S, v, kenm } = verhaalSit();
  const [a, b, ai, bi] = kenm.dom;
  return { soort: 'vkenm', opdracht: 'Noteer de asymptoot en het domein van je schets.', html: opgave(v), sleutel: v + 'k',
    rapport: `verhaal → kenmerken (${S.titel})`, antw: delen([kenm.as[0], getal(kenm.as[1])], ['\\text{domein:}', vz([{ a, ai, b, bi }], `\\text{dom} =`)]),
    uitleg: [`${kenm.as[0]} ${kenm.as[1]}`, `\\text{dom} = ${ivTex(a, b, ai, bi)}`] };
}
function vraagVoorschrift() {
  const { S, v } = verhaalSit();
  let goed, fout;
  if (S.fam === 'temp') { const { k, T0, b } = S; goed = `\\dfrac{${k}t + ${T0 * b}}{t + ${b}}`;
    fout = [`\\dfrac{${k + 10}t + ${T0 * b}}{t + ${b}}`, `\\dfrac{${k}t + ${T0 * (b + 10)}}{t + ${b + 10}}`, `\\dfrac{${T0}t + ${k * b}}{t + ${b}}`]; }
  if (S.fam === 'groei') { const { A, b } = S; goed = `\\dfrac{${A}w}{w + ${b}}`; fout = [`\\dfrac{${2 * A}w}{w + ${b}}`, `\\dfrac{${A}w}{w + ${2 * b}}`, `\\dfrac{${A * b}}{w + ${b}}`]; }
  if (S.fam === 'conc') { const { a, b } = S; goed = `\\dfrac{${a}t}{t^2 + ${b}}`; fout = [`\\dfrac{${a}t}{t^2 + ${(Math.sqrt(b) + 2) ** 2}}`, `\\dfrac{${2 * a}t}{t^2 + ${b}}`, `\\dfrac{${a}t}{t + ${b}}`]; }
  if (S.fam === 'wacht') { const { c } = S; goed = `\\dfrac{${c}}{100 - b}`; fout = [`\\dfrac{${c}}{100 + b}`, `\\dfrac{${c / 2}}{50 - b}`, `\\dfrac{${c}b}{100 - b}`]; }
  if (S.fam === 'kost') { const { v: vv, p } = S; goed = `\\dfrac{${vv} + ${p}n}{n}`; fout = [`\\dfrac{${p} + ${vv}n}{n}`, `\\dfrac{${vv} - ${p}n}{n}`, `\\dfrac{${vv}}{n}`]; }
  const opties = schud([goed, ...fout]);
  return { soort: 'vvoorschrift', opdracht: 'Welk voorschrift past bij het verhaal? Controleer in GeoGebra alle gegevens.', html: opgave(v), sleutel: v + 'v',
    rapport: `verhaal → voorschrift (${S.titel})`, antw: { soort: 'keuze', opties: opties.map((t, i) => ({ k: String(i), l: `${S.fn}(${S.x}) = ${t}` })), juist: String(opties.indexOf(goed)) },
    uitleg: [`${S.fn}(${S.x}) = ${goed}`, tx('Dit voorschrift klopt met de beginwaarde, het gegeven punt en de asymptoot uit het verhaal.')] };
}
const D6 = {
  nr: 6, titel: 'Van situatie naar schets', kort: 'Bij een verhaal de passende grafiek, asymptoot en voorschrift vinden.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een verhaal omzetten in een grafiek</div>
      <p>Nu draaien we het om: je krijgt een verhaal en zoekt de grafiek. Er is niet altijd één juiste schets, maar je schets moet wel kloppen met <b>alle gegevens</b> uit het verhaal.</p></div>
    <div class="kader eig"><div class="kader-titel">Stappenplan: een schets maken bij een situatie</div>
      <ol><li>Welke grootheid staat op de horizontale as, welke op de verticale as? Met welke eenheden?</li>
      <li>Bepaal het praktisch domein.</li><li>Duid alle gegeven punten aan: beginwaarde, eindwaarde, nulwaarden …</li>
      <li>Is er een grenswaarde die de grootheid op lange termijn nadert? Teken die horizontale asymptoot als stippellijn.</li>
      <li>Is er een waarde waarbij de grootheid onbeperkt groot wordt? Teken die verticale asymptoot als stippellijn.</li>
      <li>Bepaal waar de grafiek stijgt en daalt. Gebeurt dat snel (steil) of traag (vlak)?</li>
      <li>Verbind de punten met een vloeiende lijn die de asymptoten nadert, maar niet raakt.</li>
      <li>Controle: vertel het verhaal terug met je grafiek. Klopt alles?</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een kop koffie</div>
      <p>Een kop koffie van 80 °C wordt ingeschonken in een kamer van 20 °C. De koffie koelt eerst snel af, daarna steeds trager. Na 10 minuten is de koffie 50 °C. We volgen de koffie een uur lang.</p>
      ${figuur(rgraf({ x: [0, 60], y: [0, 90], xs: 10, ys: 10, xn: 't (minuten)', yn: 'temperatuur (°C)', functies: [{ f: (t) => (20 * t + 800) / (t + 10) }], ha: [20], punten: [{ x: 0, y: 80 }, { x: 10, y: 50 }] }))}
      <p>Domein $[0 \\,;\\, 60]$, bereik ongeveer $[29 \\,;\\, 80]$, horizontale asymptoot $y = 20$: de koffie nadert de temperatuur van de kamer. Ze wordt nooit kouder dan 20 °C: de grafiek blijft boven de stippellijn.</p>
      <p><b>Welk voorschrift past?</b> Controleer alle gegevens: $T_1(t) = \\dfrac{20t + 800}{t + 10}$ geeft $T_1(0) = 80$, $T_1(10) = 50$ en asymptoot $y = 20$: alles klopt.
      $T_2(t) = \\dfrac{30t + 800}{t + 10}$ heeft asymptoot $y = 30$ (fout). $T_3(t) = \\dfrac{20t + 400}{t + 5}$ geeft $T_3(10) = 40$ in plaats van 50 (fout).</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Aan een loket wacht je bij 0 % bezetting gemiddeld 4 minuten, bij 50 % is dat 8 minuten. Bij 100 % zou de wachtrij eindeloos worden.'),
      stappen: ['\\text{Punten: } (0 \\,;\\, 4) \\text{ en } (50 \\,;\\, 8)', '\\text{"Eindeloos bij 100 \\%": verticale asymptoot } b = 100', '\\text{dom} = [0 \\,;\\, 100[, \\quad \\text{ber} = [4 \\,;\\, +\\infty{[}', '\\text{Past bij } W(b) = \\dfrac{400}{100 - b}'] },
    { html: opgave('Bij de start zijn er geen vrijwilligers. Na 4 weken zijn er 100. Er komen er nooit meer dan 200.'),
      stappen: ['\\text{Punten: } (0 \\,;\\, 0) \\text{ en } (4 \\,;\\, 100)', '\\text{"Nooit meer dan 200": horizontale asymptoot } y = 200', '\\text{Stijgend, eerst snel en daarna steeds trager.}'] },
  ],
  soorten: {
    vgraf: { naam: 'Verhaal → grafiek', gen: vraagVerhaalGraf },
    vkenm: { naam: 'Verhaal → asymptoot en domein', gen: vraagVerhaalKenm },
    vvoorschrift: { naam: 'Welk voorschrift past?', gen: vraagVoorschrift },
  },
  oefenMix: [['vgraf', 2], ['vkenm', 1], ['vvoorschrift', 1]],
  test: [['vgraf', 4], ['vkenm', 3], ['vvoorschrift', 3]], testSchudden: true,
};

// ===================================================================
//  6 · VAN KENMERKEN NAAR SCHETS
// ===================================================================
function hyper() { // f(x) = c + d/(x − a) met gehele nulwaarde z
  for (;;) {
    const a = rnd(-3, 3), c = kies([-2, -1, 1, 2, 3]), z = a + kies([-4, -3, -2, -1, 1, 2, 3, 4]), d = c * (a - z);
    if (Math.abs(d) > 8 || z === 0) continue;
    const f = (x) => c + d / (x - a);
    if (Math.abs(f(0) - c) > 6 || a === 0) continue;
    return { a, c, d, z, f, daalt: d > 0, y0: f(0) };
  }
}
const mk = (v) => kg(v).replace('-', '−');
const pmTekst = (v) => v === I ? '+∞' : v === -I ? '−∞' : mk(v);
function verloopHTML(h) {
  const pijl = h.daalt ? PIJL_NEER : PIJL_OP, links = h.daalt ? -I : I, rechts = h.daalt ? I : -I;
  return schema('x', 'f(x)', [{ x: '−∞', y: mk(h.c) }, { y: pijl }, { x: mk(h.a), y: `${pmTekst(links)} ‖ ${pmTekst(rechts)}` }, { y: pijl }, { x: '+∞', y: mk(h.c) }]);
}
function tekenCellen(h, wissel = false) {
  const s = (x) => (h.f(x) > 0) !== wissel ? '+' : '−';
  const [p, q] = h.z < h.a ? [h.z, h.a] : [h.a, h.z];
  const tk = (v) => v === h.z ? '0' : '×';
  return [{ y: s(p - 1) }, { x: mk(p), y: tk(p) }, { y: s((p + q) / 2) }, { x: mk(q), y: tk(q) }, { y: s(q + 1) }];
}
const tekenHTML = (h, wissel) => schema('x', 'f(x)', tekenCellen(h, wissel));
const tekenOptie = (cellen) => `<table class="tabel tekenschema"><tr><th>x</th>${cellen.map(c => `<td>${c.x ?? ''}</td>`).join('')}</tr><tr><th>f(x)</th>${cellen.map(c => `<td>${c.y ?? ''}</td>`).join('')}</tr></table>`;
const hGraf = (h, klein = false, extra = {}) => rgraf({ x: [h.a - 7, h.a + 7], y: [h.c - 7, h.c + 7], xs: 1, ys: 1, functies: [{ f: h.f, kleur: extra.kleur }], ha: [h.c], va: [h.a], klein, breed: klein ? 230 : 320, hoog: klein ? 230 : 320 });
function hTex(h) { const t = h.c, n = h.d - h.c * h.a; return `f(x) = \\dfrac{${t === 1 ? '' : t === -1 ? '-' : t}x${n ? ` ${n < 0 ? '-' : '+'} ${Math.abs(n)}` : ''}}{x ${h.a < 0 ? '+' : '-'} ${Math.abs(h.a)}}`; }
function vraagAsymp() {
  const h = hyper();
  return { soort: 'asymp', opdracht: 'Lees de asymptoten af uit het verloopschema.', html: `<p>Van een rationale functie $f$ is het verloopschema gegeven:</p>${verloopHTML(h)}`, sleutel: `${h.a}${h.c}${h.d}`,
    rapport: `verloopschema: asymptoten (x = ${h.a}, y = ${h.c})`, antw: delen(['\\text{verticale asymptoot: } x =', getal(h.a)], ['\\text{horizontale asymptoot: } y =', getal(h.c)]),
    uitleg: [`\\text{Bij } x = ${tg(h.a)} \\text{ gaan de functiewaarden naar } \\pm\\infty: x = ${tg(h.a)}`, `\\text{Op } \\pm\\infty \\text{ nadert } f(x) \\text{ naar } ${tg(h.c)}: y = ${tg(h.c)}`] };
}
function vraagNulInterval() {
  const h = hyper();
  const L = `]−∞ ; ${kg(h.a)}[`, R = `]${kg(h.a)} ; +∞[`;
  const juist = `Eén nulwaarde, in ${h.z < h.a ? L : R}.`;
  const tak = h.z < h.a ? 'De linkertak' : 'De rechtertak';
  return { soort: 'nulint', opdracht: 'Hoeveel nulwaarden heeft f, en waar liggen ze?', html: `<p>Van een rationale functie $f$ is het verloopschema gegeven:</p>${verloopHTML(h)}`, sleutel: `${h.a}${h.c}${h.d}n`,
    rapport: `verloopschema: nulwaarden`, antw: zinnen(juist, [`Eén nulwaarde, in ${h.z < h.a ? R : L}.`, 'Geen nulwaarden.', `Twee nulwaarden: één in ${L} en één in ${R}.`], { lijst: false }),
    uitleg: [tx(`${tak} snijdt de x-as één keer, in x = ${kg(h.z)}.`), tx('De andere tak blijft aan één kant van de x-as.')] };
}
function vraagTeken() {
  const h = hyper();
  const goed = tekenCellen(h), wissel = tekenCellen(h, true);
  const omgekeerd = goed.map(c => c.y === '0' ? { ...c, y: '×' } : c.y === '×' ? { ...c, y: '0' } : c);
  const zonderX = goed.map(c => c.y === '×' ? { ...c, y: '0' } : c);
  const opties = schud([goed, wissel, omgekeerd, zonderX].map((c, i) => ({ c, i })));
  return { soort: 'teken', opdracht: 'Welk tekenschema hoort bij de grafiek?', html: figuur(hGraf(h)), sleutel: `${h.a}${h.c}${h.d}t`, rapport: 'grafiek → tekenschema',
    antw: { soort: 'keuze', opties: opties.map((o, k) => ({ k: String(k), l: tekenOptie(o.c), html: true, tekst: `schema ${k + 1}` })), juist: String(opties.findIndex(o => o.i === 0)) },
    uitleg: [`\\text{nulwaarde: } x = ${tg(h.z)} \\; (0), \\quad \\text{verticale asymptoot: } x = ${tg(h.a)} \\; (\\times)`, tx('Boven de x-as: +, onder de x-as: −.')] };
}
function vraagGrafKenm() {
  const h = hyper();
  const lijst = `<ul><li>$\\text{dom } f = \\mathbb{R} \\setminus \\{${tg(h.a)}\\}$</li><li>verticale asymptoot $x = ${tg(h.a)}$ en horizontale asymptoot $y = ${tg(h.c)}$</li>
    <li>nulwaarde: $${tg(h.z)}$</li><li>snijpunt met de $y$-as: $(0 \\,;\\, ${tg(W.rond(h.y0, 2))})$</li><li>$f$ is ${h.daalt ? 'dalend' : 'stijgend'} op $${ivTex(-I, h.a, false, false)}$ en op $${ivTex(h.a, I, false, false)}$</li></ul>`;
  const g1 = { ...h, c: -h.c, f: (x) => -h.c + h.d / (x - h.a) };          // verkeerde horizontale asymptoot
  const g2 = { ...h, f: (x) => h.c - h.d / (x - h.a) };                    // stijgen en dalen omgewisseld
  const a3 = h.a + kies([-2, 2]), g3 = { ...h, f: (x) => h.c + h.d / (x - a3) }; // verticale asymptoot verschoven
  const teken = (g, va, ha) => rgraf({ x: [h.a - 7, h.a + 7], y: [h.c - 7, h.c + 7], xs: 1, ys: 1, functies: [{ f: g.f }], ha: [ha], va: [va], klein: true, breed: 230, hoog: 230 });
  return { soort: 'grafkenm', opdracht: 'Welke grafiek voldoet aan alle gegevens?', html: `<p>Een rationale functie $f$ heeft deze kenmerken:</p>${lijst}`, sleutel: `${h.a}${h.c}${h.d}g`, rapport: 'kenmerken → grafiek',
    antw: figuren(teken(h, h.a, h.c), [teken(g1, h.a, -h.c), teken(g2, h.a, h.c), teken(g3, a3, h.c)]), uitleg: [`\\text{Bijvoorbeeld } ${hTex(h)}`, tx('Controleer telkens: asymptoten, nulwaarde, snijpunt met de y-as en stijgen/dalen.')] };
}
function vraagBereikH() {
  const h = hyper();
  return { soort: 'bereikh', opdracht: 'Bepaal het bereik van f.', html: `<p>Van een rationale functie $f$ is het verloopschema gegeven:</p>${verloopHTML(h)}`, sleutel: `${h.a}${h.c}${h.d}b`,
    rapport: 'verloopschema: bereik', antw: vz(zonder(h.c), '\\text{ber } f ='), uitleg: [tx(`De ene tak neemt alle waarden boven ${kg(h.c)} aan, de andere alle waarden eronder.`), `\\text{ber } f = \\mathbb{R} \\setminus \\{${tg(h.c)}\\}`] };
}
function vraagKanDit() {
  const a = rnd(-3, 4), c = kies([-2, 1, 2, 3]);
  const T = kies([
    { g: `$f$ heeft in $x = ${a}$ een perforatie én een verticale asymptoot.`, kan: false, r: 'Een verticale asymptoot ontstaat waar de noemer nul wordt maar de teller niet; een perforatie waar teller én noemer nul worden. In hetzelfde punt kan dat niet allebei.' },
    { g: `$f$ heeft een horizontale asymptoot $y = ${c}$ en een verticale asymptoot $x = ${a}$. $f$ is stijgend op $${ivTex(-I, a, false, false)}$ en $\\lim\\limits_{x \\to ${a}^-} f(x) = -\\infty$.`, kan: false, r: `Als f stijgt op ]−∞ ; ${a}[, worden de functiewaarden groter als x naar ${a} gaat: ze kunnen dan niet naar −∞ gaan.` },
    { g: `$f$ heeft een horizontale asymptoot $y = ${c}$ en een verticale asymptoot $x = ${a}$. $f$ is dalend op $${ivTex(-I, a, false, false)}$ en $\\lim\\limits_{x \\to ${a}^-} f(x) = -\\infty$.`, kan: true, r: `Vertrekkend van de asymptoot y = ${c} daalt de linkertak naar −∞ bij x = ${a}: dat kan.` },
    { g: `Het tekenschema van $f$ heeft een kruisje bij $x = ${a}$ en een $+$ aan beide kanten.`, kan: true, r: `Dat kan: de limiet is dan aan beide kanten +∞, zoals bij de functie 1/x² (verschoven).` },
    { g: `$f$ heeft een verticale asymptoot $x = ${a}$ en $f(${a}) = ${c}$.`, kan: false, r: `Waar een verticale asymptoot ligt, bestaat f niet: ${a} hoort niet bij het domein.` },
    { g: `De grafiek van $f$ snijdt haar horizontale asymptoot $y = ${c}$.`, kan: true, r: 'Dat kan: een grafiek mag haar horizontale asymptoot snijden. Enkel op ±∞ nadert ze de asymptoot (zoals de concentratie C(t) die in t = 0 de asymptoot y = 0 raakt).' },
  ]);
  const juist = T.kan ? 'Dit kan.' : 'Dit kan niet.';
  return { soort: 'kandit', opdracht: 'Kan dit? Denk na voor je kiest.', html: `<p>${T.g}</p>`, sleutel: T.g, rapport: W.platteTekst(T.g.replace(/\\lim\\limits_\{([^}]*)\}/g, 'lim($1)')),
    antw: { soort: 'keuze', opties: [{ k: 'ja', l: '\\text{Dit kan.}' }, { k: 'nee', l: '\\text{Dit kan niet.}' }], juist: T.kan ? 'ja' : 'nee' }, uitleg: [tx(juist), tx(T.r)] };
}
function vraagLimiet() {
  const h = hyper(), kant = kies(['-', '+']);
  const L = kant === '-' ? (h.daalt ? -I : I) : (h.daalt ? I : -I);
  const opties = schud(['+\\infty', '-\\infty', tg(h.c), '0'].filter((v, i, a) => a.indexOf(v) === i));
  const juist = L === I ? '+\\infty' : '-\\infty';
  return { soort: 'limiet', opdracht: 'Lees de limiet af op de grafiek.', html: `${figuur(hGraf(h))}<p class="midden">$\\lim\\limits_{x \\to ${tg(h.a)}^${kant}} f(x) = \\;?$</p>`, sleutel: `${h.a}${h.c}${h.d}${kant}`,
    rapport: `limiet x → ${kg(h.a)}${kant}`, antw: { soort: 'keuze', opties: opties.map((o, i) => ({ k: String(i), l: o })), juist: String(opties.indexOf(juist)) },
    uitleg: [`\\lim\\limits_{x \\to ${tg(h.a)}^${kant}} f(x) = ${juist}`, tx(kant === '-' ? 'Links van de verticale asymptoot: kijk naar de linkertak.' : 'Rechts van de verticale asymptoot: kijk naar de rechtertak.')] };
}
const D7 = {
  nr: 7, titel: 'Van kenmerken naar schets', kort: 'Teken- en verloopschema, asymptoten, limieten: welke grafiek past? Kan dit wel?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Uit kenmerken een grafiek afleiden</div>
      <p>Nu krijg je geen verhaal, maar enkel kenmerken: nulwaarden, asymptoten, een teken- of verloopschema … Een passende grafiek moet aan <b>alle</b> gegevens voldoen. Soms zijn er meerdere mogelijkheden, soms is het onmogelijk!</p>
      <ul><li>In het <b>tekenschema</b> betekent $0$ een nulwaarde en $\\times$ een waarde waar $f$ niet bestaat (verticale asymptoot of perforatie).
        Verandert het teken bij een kruisje, dan ligt daar zeker een verticale asymptoot.</li>
      <li>In het <b>verloopschema</b> lees je de asymptoten af: bij $x = a$ gaan de functiewaarden naar $\\pm\\infty$ (verticale asymptoot), op $\\pm\\infty$ nadert $f(x)$ een getal $c$ (horizontale asymptoot $y = c$).</li>
      <li>Een tak die van $c$ naar $-\\infty$ <b>daalt</b>, snijdt de $x$-as als $c > 0$. Zo vind je hoeveel nulwaarden er zijn en in welk interval.</li>
      <li>Bij een verticale asymptoot $x = a$ bestaat $f(a)$ niet. Een perforatie en een verticale asymptoot in hetzelfde punt kan niet.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$\\text{dom } f = \\mathbb{R} \\setminus \\{2\\}$, verticale asymptoot $x = 2$, horizontale asymptoot $y = 1$, nulwaarde $-1$, snijpunt met de $y$-as $(0 \\,;\\, -0{,}5)$, $f$ dalend op beide takken.
      Een passende functie is $f(x) = \\dfrac{x + 1}{x - 2}$.</p>
      ${figuur(rgraf({ x: [-6, 9], y: [-5, 7], xs: 1, ys: 1, xn: 'x', yn: 'y', functies: [{ f: (x) => (x + 1) / (x - 2) }], ha: [1], va: [2], punten: [{ x: -1, y: 0 }, { x: 0, y: -0.5 }] }))}
      ${schema('x', 'f(x)', [{ y: '+' }, { x: '−1', y: '0' }, { y: '−' }, { x: '2', y: '×' }, { y: '+' }])}
      ${schema('x', 'f(x)', [{ x: '−∞', y: '1' }, { y: PIJL_NEER }, { x: '2', y: '−∞ ‖ +∞' }, { y: PIJL_NEER }, { x: '+∞', y: '1' }])}
      <p>$\\lim\\limits_{x \\to 2^-} f(x) = -\\infty$, &nbsp; $\\lim\\limits_{x \\to 2^+} f(x) = +\\infty$, &nbsp; $\\lim\\limits_{x \\to \\pm\\infty} f(x) = 1$. &nbsp; Bereik: $\\mathbb{R} \\setminus \\{1\\}$.</p></div>
    <div class="kader"><div class="kader-titel">Zo vul je in</div><p>Bereik zoals $\\mathbb{R} \\setminus \\{1\\}$: typ <code>ℝ \\ {1}</code> met de knoppen.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `<p>Verloopschema:</p>${schema('x', 'f(x)', [{ x: '−∞', y: '2' }, { y: PIJL_NEER }, { x: '1', y: '−∞ ‖ +∞' }, { y: PIJL_NEER }, { x: '+∞', y: '2' }])}<p>Hoeveel nulwaarden heeft $f$?</p>`,
      stappen: ['\\text{Asymptoten: } x = 1 \\text{ en } y = 2', '\\text{Linkertak: daalt van 2 naar } -\\infty \\text{: snijdt de } x\\text{-as één keer.}', '\\text{Rechtertak: daalt van } +\\infty \\text{ naar 2: blijft boven 2.}', '\\text{Eén nulwaarde, in } {]}{-\\infty} \\,;\\, 1['] },
    { html: '<p>$f$ heeft een horizontale asymptoot $y = 2$, een verticale asymptoot $x = 1$, is stijgend op ${]}{-\\infty} \\,;\\, 1[$ en $\\lim\\limits_{x \\to 1^-} f(x) = -\\infty$. Kan dit?</p>',
      stappen: ['\\text{Neen: als } f \\text{ stijgt naar } x = 1, \\text{ worden de functiewaarden groter.}', '\\text{Ze kunnen dan niet naar } -\\infty \\text{ gaan.}'] },
  ],
  soorten: {
    asymp: { naam: 'Asymptoten uit het verloopschema', gen: vraagAsymp },
    nulint: { naam: 'Hoeveel nulwaarden, en waar?', gen: vraagNulInterval },
    teken: { naam: 'Grafiek → tekenschema', gen: vraagTeken },
    grafkenm: { naam: 'Kenmerken → grafiek', gen: vraagGrafKenm },
    bereikh: { naam: 'Bereik uit het verloopschema', gen: vraagBereikH },
    kandit: { naam: 'Kan dit?', gen: vraagKanDit },
    limiet: { naam: 'Limieten aflezen', gen: vraagLimiet },
  },
  oefenMix: [['asymp', 1], ['nulint', 1], ['teken', 1], ['grafkenm', 1], ['bereikh', 1], ['kandit', 1], ['limiet', 1]],
  test: [['asymp', 2], ['nulint', 1], ['teken', 2], ['grafkenm', 2], ['bereikh', 1], ['kandit', 1], ['limiet', 1]], testSchudden: true,
};

// ===================================================================
//  7 · EEN GRAFIEK VERTELLEN
// ===================================================================
function sitReval() {
  const E = kies([800, 850, 900]), M0 = kies([40, 50, 60]), b = kies([3, 4, 5]), a = (E - M0) * b, f = (w) => E - a / (w + b);
  const m26 = Math.round(f(26) / 10) * 10, m4 = Math.round(f(4) / 10) * 10;
  return { fam: 'reval', titel: 'Revalidatie na een operatie', f, fn: 'M', x: 'w', xe: 'weken', ye: 'meter', yn: 'afstand (meter)', dom: [0, 26], ha: E, E, M0, b, m26, m4,
    verhaal: 'De grafiek toont de afstand $M$ (in meter) die een patiënt zonder pauze kan wandelen, $w$ weken na een heupoperatie.',
    graf: { x: [0, 26], y: [0, top(E * 1.05)] },
    w: { begin: `M(0) = ${M0}`, ha: `y = ${E}`, verloop: 'M \\text{ is stijgend op } [0 \\,;\\, 26]', lim: `\\lim\\limits_{w \\to +\\infty} M(w) = ${E}`, eind: `M(26) \\approx ${m26}` },
    z: { begin: `Bij de start van de revalidatie kan de patiënt ${M0} m zonder pauze wandelen.`, ha: `Volgens het verloop haalt de patiënt nooit meer dan ${E} m zonder pauze.`,
      haF: `Na een halfjaar wandelt de patiënt precies ${E} m zonder pauze.`, verloop: 'De patiënt gaat elke week vooruit, eerst snel en daarna steeds trager.',
      lim: `Hoe langer de revalidatie duurt, hoe dichter de afstand bij ${E} m komt.`, eind: `Na een halfjaar (26 weken) wandelt de patiënt ongeveer ${m26} m.`,
      beginF: `Bij de start kan de patiënt nog niet wandelen.`, verloopF: 'De patiënt gaat elke week evenveel vooruit.' } };
}
function sitWeb() {
  const dm = kies([4, 5, 6]), Bm = kies([150, 200, 250]), b = dm * dm, a = 2 * Bm * dm, f = (d) => a * d / (d * d + b);
  const d60 = Math.round(f(60));
  return { fam: 'web', titel: 'Een nieuwe website', f, fn: 'B', x: 'd', xe: 'dagen', ye: 'bezoekers', yn: 'bezoekers per dag', dom: [0, 60], ha: 0, dm, Bm, d60,
    verhaal: 'De grafiek toont het aantal bezoekers $B$ per dag van de website van een nieuw buurtproject, $d$ dagen na de lancering.',
    graf: { x: [0, 60], y: [0, top(Bm * 1.1)] },
    w: { begin: 'B(0) = 0', max: `\\text{maximum } (${dm} \\,;\\, ${Bm})`, ha: 'y = 0', verloop: `B \\text{ stijgt op } [0 \\,;\\, ${dm}] \\text{ en daalt op } [${dm} \\,;\\, 60]`, lim: '\\lim\\limits_{d \\to +\\infty} B(d) = 0', eind: `B(60) \\approx ${d60}` },
    z: { begin: 'Bij de lancering heeft de website nog geen bezoekers.', max: `Op dag ${dm} bereikt de website een hoogtepunt van ${Bm} bezoekers per dag.`,
      ha: 'Op lange termijn wordt het aantal bezoekers per dag steeds kleiner, maar het wordt niet 0.', haF: 'Na twee maanden heeft de website geen enkele bezoeker meer.',
      verloop: `Het aantal bezoekers stijgt snel tot dag ${dm} en daalt daarna geleidelijk.`, lim: 'Hoe langer na de lancering, hoe dichter het aantal bezoekers per dag bij 0 komt.',
      eind: `Na twee maanden zijn er nog ongeveer ${d60} bezoekers per dag.`, beginF: `Bij de lancering heeft de website al ${Bm} bezoekers per dag.`,
      verloopF: `Het aantal bezoekers daalt vanaf de eerste dag.` } };
}
function sitSoep() {
  const S = sitTemp('soep'), t60 = S.b * (S.T0 - 60) / (60 - S.k);
  Object.assign(S.w, { lim: `\\lim\\limits_{t \\to +\\infty} S(t) = ${S.k}`, eind: `S(60) \\approx ${tg(S.eind, 1)}` });
  Object.assign(S.z, { lim: `Hoe langer je wacht, hoe dichter de soep bij ${S.k} °C komt.`, eind: `Na een uur is de soep nog ongeveer ${kg(S.eind, 1)} °C.`,
    beginF: `De soep wordt opgeschept op ${S.k} °C.`, verloopF: 'De soep koelt elke minuut evenveel af.' });
  S.t60 = t60;
  S.verhaal = 'De grafiek toont de temperatuur $S$ (in °C) van een kom soep in een woonzorgcentrum, $t$ minuten nadat ze opgeschept werd. De eetzaal is ' + S.k + ' °C warm.';
  return S;
}
const kiesVerhaal = () => kies([sitSoep, sitReval, sitWeb])();
const verhaalGraf = (S) => figuur(rgraf({ x: S.graf.x, y: S.graf.y, xn: `${S.x} (${S.xe}${S.fam === 'web' ? ' na de lancering' : S.fam === 'reval' ? ' na de operatie' : ' na het opscheppen'})`, yn: S.yn, functies: [{ f: S.f, van: S.dom[0], tot: S.dom[1] }] }));
function vraagVertaal() {
  const S = kiesVerhaal(), ks = Object.keys(S.w).filter(k => S.z[k]), k = kies(ks);
  const fout = schud(ks.filter(x => x !== k && !(k === 'ha' && x === 'lim') && !(k === 'lim' && x === 'ha')).map(x => S.z[x])); if (k === 'ha' || k === 'lim') fout.unshift(S.z.haF);
  return { soort: 'vertaal', opdracht: 'Vertaal naar de taal van de situatie.', html: `${opgave(S.verhaal)}${verhaalGraf(S)}<p class="midden">Wiskundetaal: $${S.w[k]}$</p>`, sleutel: S.titel + k + S.z[k],
    rapport: `${S.titel}: ${W.platteTekst(S.w[k])}`, antw: zinnen(S.z[k], fout), uitleg: [S.w[k], tx(S.z[k])] };
}
function vraagVerslag() {
  const S = kiesVerhaal(), z = S.z;
  const extra = S.fam === 'web' ? z.max : z.eind;
  const goed = [z.begin, z.verloop, extra, z.ha].join(' ');
  const fout = [[z.begin, z.verloop, extra, z.haF].join(' '), [z.beginF, z.verloop, extra, z.ha].join(' '), [z.begin, z.verloopF, extra, z.ha].join(' ')];
  return { soort: 'verslag', opdracht: 'Welk verslag past bij de grafiek? In de andere verslagen staat een fout.', html: `${opgave(S.verhaal)}${verhaalGraf(S)}`, sleutel: S.titel + goed,
    rapport: `${S.titel}: juiste verslag kiezen`, antw: zinnen(goed, fout), uitleg: [tx(goed)] };
}
function vraagAflezenV() {
  const S = kiesVerhaal();
  let vr, juist, fout, na;
  if (S.fam === 'temp') { const t = Math.round(S.t60); vr = 'Bewoners mogen pas soep krijgen als ze hoogstens 60 °C is. Na hoeveel minuten is dat ongeveer?'; juist = t; fout = [t + 10, Math.max(1, t - 8), t + 25]; na = 'minuten'; }
  else if (S.fam === 'reval') { vr = 'Hoeveel meter kan de patiënt ongeveer zonder pauze wandelen na 4 weken?'; juist = S.m4; fout = [S.m4 + 150, S.m4 - 150, S.E]; na = 'm'; }
  else { vr = 'Op welke dag heeft de website de meeste bezoekers?'; juist = S.dm; fout = [S.dm + 5, S.dm * 3, 1]; na = ''; }
  const opties = schud([juist, ...fout].filter((v, i, a) => a.indexOf(v) === i));
  return { soort: 'aflezenv', opdracht: 'Lees af op de grafiek.', html: `${opgave(S.verhaal)}${verhaalGraf(S)}<p>${vr}</p>`, sleutel: S.titel + vr + juist,
    rapport: `${S.titel}: ${vr}`, antw: { soort: 'keuze', opties: opties.map((v, i) => ({ k: String(i), l: `\\text{${S.fam === 'web' ? 'dag ' : 'ongeveer '}${kg(v)}${na ? ' ' + na : ''}}` })), juist: String(opties.indexOf(juist)) },
    uitleg: [tx(`Ongeveer ${kg(juist)} ${na}`)] };
}
function vraagContexttaal() {
  const S = kiesVerhaal();
  const juist = kies([S.z.verloop, S.z.lim, S.z.begin]);
  const fn = S.fn;
  const fout = schud([`De functie ${fn} is stijgend op het begin en nadert dan de asymptoot.`, `De horizontale asymptoot van de grafiek is y = ${S.ha}.`, `${fn}(0) is de beginwaarde van de functie.`, `De grafiek is eerst steil en daarna vlak.`, `De nulwaarde van ${fn} ligt in ${S.x} = 0.`]).slice(0, 3);
  return { soort: 'context', opdracht: 'Welke zin is volledig in de taal van de situatie geschreven (zonder woorden als functie, asymptoot, nulwaarde, grafiek)?', html: `${opgave(S.verhaal)}${verhaalGraf(S)}`, sleutel: S.titel + juist,
    rapport: `${S.titel}: contexttaal`, antw: zinnen(juist, fout), uitleg: [tx(juist), tx('De andere zinnen gebruiken wiskundige vaktaal.')] };
}
const D8 = {
  nr: 8, titel: 'Een grafiek vertellen', kort: 'Een grafiek omzetten in een verhaal in de taal van de situatie.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een goede grafiek vertelt een verhaal</div>
      <p>In dit hoofdstuk vertaal je een grafiek naar een verhaal, <b>zonder wiskundige vaktaal</b>. Zo toon je dat je echt begrijpt wat de grafiek zegt.</p></div>
    <div class="kader eig"><div class="kader-titel">Checklist voor een goed verhaal</div>
      <ul><li>Ik vermeld de beginwaarde (met eenheid).</li><li>Ik vermeld wanneer de grootheid toeneemt en afneemt.</li>
      <li>Ik vermeld de hoogste en laagste waarde(n) én wanneer ze bereikt worden.</li>
      <li>Ik vermeld de grenswaarde op lange termijn (horizontale asymptoot) en leg uit wat ze betekent.</li>
      <li>Ik vermeld nulwaarden (of leg uit waarom er geen zijn).</li><li>Ik zeg iets over de snelheid van de verandering (snel/traag).</li><li>Ik vermeld de eindwaarde.</li>
      <li>Ik gebruik de taal van de situatie, géén woorden als "functie", "nulwaarde", "stijgend" of "asymptoot".</li><li>Mijn verhaal is logisch: het kan echt zo gebeurd zijn.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: soep in het woonzorgcentrum</div>
      ${figuur(rgraf({ x: [0, 60], y: [0, 100], xs: 5, ys: 10, xn: 't (minuten na het opscheppen)', yn: 'temperatuur (°C)', functies: [{ f: (t) => 20 + 1400 / (t + 20) }] }))}
      <p>De soep wordt opgeschept op 90 °C. In de eerste minuten koelt ze snel af: na een kwartier is ze 60 °C en mag ze naar de bewoners. Daarna gaat het afkoelen steeds trager.
      Na een halfuur is de soep ongeveer 48 °C en na een uur nog ongeveer 37,5 °C. De soep wordt nooit kouder dan de eetzaal: ze komt steeds dichter bij 20 °C, maar bereikt die temperatuur niet.</p>
      <table class="tabel"><tr><th>Wiskundetaal</th><th>Contexttaal</th></tr>
      <tr><td>$S(0) = 90$</td><td>Bij het opscheppen is de soep 90 °C.</td></tr>
      <tr><td>$S$ is dalend op $[0 \\,;\\, 60]$.</td><td>Gedurende het hele uur koelt de soep af.</td></tr>
      <tr><td>$S(15) = 60$</td><td>Na 15 minuten is de soep 60 °C: ze mag opgediend worden.</td></tr>
      <tr><td>De horizontale asymptoot is $y = 20$.</td><td>De soep koelt af tot ze de temperatuur van de eetzaal (20 °C) nadert.</td></tr>
      <tr><td>$\\lim\\limits_{t \\to +\\infty} S(t) = 20$</td><td>Hoe langer je wacht, hoe dichter de soep bij 20 °C komt.</td></tr>
      <tr><td>$\\text{ber } S = [37{,}5 \\,;\\, 90]$</td><td>Tijdens het uur ligt de temperatuur van de soep tussen 37,5 °C en 90 °C.</td></tr></table></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${figuur(rgraf({ x: [0, 26], y: [0, 900], xs: 2, ys: 100, xn: 'w (weken na de operatie)', yn: 'afstand (meter)', functies: [{ f: (w) => 850 - 3200 / (w + 4) }] }))}<p>Vertel de grafiek.</p>`,
      stappen: ['\\text{Bij de start kan de patiënt 50 m zonder pauze wandelen.}', '\\text{De eerste weken gaat hij snel vooruit: na 4 weken haalt hij 450 m. Daarna gaat het steeds trager.}', '\\text{Na een halfjaar wandelt hij ongeveer 740 m. Hij haalt nooit meer dan ongeveer 850 m.}'] },
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
// uitspraken over een model: {t, ok, r (uitleg), c? {vraag, antw}}
function uitspraken() {
  const fam = kies(['conc', 'kost', 'temp', 'winst', 'wacht']);
  const S = SITUATIES[fam](), L = [];
  if (fam === 'conc') {
    const { tm, Mx, b, eind } = S;
    L.push({ t: `dom C = ℝ \\ {0}, want je mag niet delen door nul.`, ok: false, r: `De noemer t² + ${b} is nooit nul: het wiskundig domein is ℝ. Het praktisch domein is [0 ; 24].` });
    L.push({ t: `Het maximum is ${tm} mg/l.`, ok: false, r: `${tm} is de x-waarde (de tijd). Het maximum is ${Mx} mg/l, na ${tm} uur.`, c: { vraag: 'Hoe groot is het maximum?', antw: getal(Mx, { voor: 'C_{max} =', na: '\\text{ mg/l}' }) } });
    L.push({ t: 'C is stijgend op [0 ; 24].', ok: false, r: `C stijgt op [0 ; ${tm}] en daalt op [${tm} ; 24].`, c: { vraag: 'Tot hoeveel uur na inname stijgt de concentratie?', antw: getal(tm, { voor: 't =', na: '\\text{ uur}' }) } });
    L.push({ t: `De horizontale asymptoot is y = 0, dus na 24 uur is ${S.ding} volledig uitgewerkt.`, ok: false, r: `De concentratie nadert 0, maar bereikt die waarde niet. Na 24 uur is er nog ongeveer ${kg(eind, 2)} mg/l.`,
      c: { vraag: 'Hoeveel mg/l is er na 24 uur nog?', antw: getal(eind, { dec: 2, voor: 'C(24) =', na: '\\text{ mg/l}' }) } });
    L.push({ t: `De concentratie is het hoogst na ${tm} uur: ${Mx} mg/l.`, ok: true, r: `Extremum: (${tm} ; ${Mx}).` });
    L.push({ t: 'De horizontale asymptoot is y = 0: op lange termijn nadert de concentratie 0 mg/l.', ok: true, r: 'Juist: een grenswaarde wordt genaderd.' });
    L.push({ t: 'C(0) = 0: bij inname zit er nog niets in het bloed.', ok: true, r: 'Juist.' });
    L.push({ t: `Na 24 uur is er nog ongeveer ${kg(eind, 2)} mg/l.`, ok: true, r: `C(24) ≈ ${kg(eind, 2)}.` });
  }
  if (fam === 'kost') {
    const { v, p, per, xe } = S, [a, b] = S.dom, n1 = rnd(a + 1, b - 1), n2 = rnd(a + 1, b - 1);
    L.push({ t: `De horizontale asymptoot is y = ${v}, want dat is de vaste kost.`, ok: false, r: `De horizontale asymptoot is y = ${p}: de kost per ${per} nadert ${p} euro.`, c: { vraag: 'Wat is de juiste horizontale asymptoot?', antw: getal(p, { voor: 'y =' }) } });
    L.push({ t: `Bij ${n1} ${xe} is de gemiddelde kost ${p} euro per ${per}.`, ok: false, r: `K(${n1}) ≈ ${kg(S.f(n1), 2)} euro. ${p} euro is de grenswaarde, die nooit bereikt wordt.`,
      c: { vraag: `Wat is de juiste gemiddelde kost bij ${n1} ${xe}?`, antw: getal(S.f(n1), { dec: 2, voor: `K(${n1}) =`, na: '\\text{ euro}' }) } });
    L.push({ t: 'K heeft een nulwaarde bij n = 0, want daar is er geen kost.', ok: false, r: `De teller ${v} + ${p}n is nooit 0 voor positieve n: K heeft geen nulwaarde. In n = 0 bestaat K niet (verticale asymptoot).` });
    L.push({ t: `Bij heel veel ${xe} kost het precies ${p} euro per ${per}.`, ok: false, r: `De kost nadert ${p} euro, maar wordt nooit ${p} euro: de vaste kost blijft altijd een (klein) deel.` });
    L.push({ t: `De horizontale asymptoot is y = ${p}: de kost per ${per} nadert ${p} euro.`, ok: true, r: 'Juist.' });
    L.push({ t: `Bij ${n2} ${xe} is de gemiddelde kost ongeveer ${kg(S.f(n2), 2)} euro per ${per}.`, ok: true, r: `K(${n2}) ≈ ${kg(S.f(n2), 2)}.` });
    L.push({ t: 'K heeft geen nulwaarden: het is nooit gratis.', ok: true, r: 'Juist: de teller is nooit 0.' });
    L.push({ t: `K is dalend: hoe meer ${xe}, hoe goedkoper per ${per}.`, ok: true, r: 'Juist.' });
  }
  if (fam === 'temp') {
    const { k, T0, b, ding, eind } = S, tot = S.dom[1];
    L.push({ t: `De begintemperatuur is ${k} °C.`, ok: false, r: `${S.fn}(0) = ${T0}: de begintemperatuur is ${T0} °C. ${k} °C is de grenswaarde.`, c: { vraag: 'Wat is de juiste begintemperatuur?', antw: getal(T0, { voor: `${S.fn}(0) =`, na: '\\text{ °C}' }) } });
    L.push({ t: `Na ${tot} minuten is ${ding} ${k} °C, want dat is de horizontale asymptoot.`, ok: false, r: `${zin(ding)} nadert ${k} °C, maar bereikt die temperatuur niet. Na ${tot} minuten is ze ongeveer ${kg(eind, 1)} °C.`,
      c: { vraag: `Hoe warm is ${ding} na ${tot} minuten?`, antw: getal(eind, { dec: 1, voor: `${S.fn}(${tot}) =`, na: '\\text{ °C}' }) } });
    L.push({ t: `De verticale asymptoot is t = ${-b}: ${b} minuten vóór de start was ${ding} oneindig ${S.op ? 'koud' : 'warm'}.`, ok: false, r: `De verticale asymptoot t = ${-b} ligt buiten het praktisch domein: ze heeft hier geen betekenis.` });
    L.push({ t: `Het bereik is ]−∞ ; ${k}[.`, ok: false, r: `Op het praktisch domein ligt de temperatuur tussen ${kg(S.bereik[0])} en ${kg(S.bereik[1])} °C.` });
    L.push({ t: `De begintemperatuur is ${T0} °C.`, ok: true, r: `${S.fn}(0) = ${T0}.` });
    L.push({ t: `${zin(ding)} nadert ${k} °C, maar bereikt die temperatuur niet.`, ok: true, r: 'Juist: dat is de grenswaarde.' });
    L.push({ t: `Na 10 minuten is ${ding} ongeveer ${kg(S.f(10), 1)} °C.`, ok: true, r: `${S.fn}(10) ≈ ${kg(S.f(10), 1)}.` });
    L.push({ t: `De verticale asymptoot t = ${-b} ligt buiten het praktisch domein.`, ok: true, r: 'Juist: een negatieve tijd heeft hier geen betekenis.' });
  }
  if (fam === 'winst') {
    const { p, v, nul, stuks, stuk, wat } = S, n2 = kies([100, 120, 150, 200].filter(n => n <= S.dom[1]));
    L.push({ t: `De nulwaarde is n = ${p}: vanaf ${p} ${stuks} maakt ${wat} winst.`, ok: false, r: `${p}n − ${v} = 0 geeft n = ${nul}: vanaf ${nul} ${stuks} is er winst.`, c: { vraag: 'Wat is de juiste nulwaarde?', antw: getal(nul, { voor: 'n =' }) } });
    L.push({ t: `De verticale asymptoot is n = 0, dus bij 0 ${stuks} is de winst oneindig groot.`, ok: false, r: `n = 0 ligt buiten het praktisch domein. Bovendien gaan de functiewaarden daar naar −∞ (verlies), niet naar +∞.` });
    L.push({ t: `Vanaf ${nul} ${stuks} verdient ${wat} ${p} euro per ${stuk}.`, ok: false, r: `De gemiddelde winst per ${stuk} nadert ${p} euro, maar bereikt die waarde nooit. Vanaf ${nul} ${stuks} is de winst positief.` });
    L.push({ t: `Bij ${n2} ${stuks} is de gemiddelde winst ${kg(p)} euro per ${stuk}.`, ok: false, r: `W(${n2}) = ${kg(S.f(n2), 2)} euro.`, c: { vraag: `Hoe groot is de gemiddelde winst bij ${n2} ${stuks}?`, antw: getal(S.f(n2), { dec: 2, voor: `W(${n2}) =`, na: '\\text{ euro}' }) } });
    L.push({ t: `De nulwaarde is n = ${nul}.`, ok: true, r: `${p}n − ${v} = 0 ⇔ n = ${nul}.` });
    L.push({ t: `Bij minder dan ${nul} ${stuks} maakt ${wat} verlies.`, ok: true, r: 'Juist: daar is W negatief.' });
    L.push({ t: `De gemiddelde winst per ${stuk} nadert ${p} euro.`, ok: true, r: 'Juist: horizontale asymptoot y = ' + p + '.' });
    L.push({ t: `W is stijgend: hoe meer ${stuks}, hoe groter de gemiddelde winst per ${stuk}.`, ok: true, r: 'Juist.' });
  }
  if (fam === 'wacht') {
    const { c } = S, b1 = kies([50, 75, 80, 90]), b2 = kies([60, 70, 95]);
    L.push({ t: 'W is stijgend op [0 ; 100].', ok: false, r: 'In b = 100 bestaat W niet: W is stijgend op [0 ; 100[.' });
    L.push({ t: `Bij een bezettingsgraad van 100 % is de wachttijd ${c} minuten.`, ok: false, r: 'Bij 100 % ligt de verticale asymptoot: de wachttijd wordt onbeperkt groot.' });
    L.push({ t: 'De horizontale asymptoot is y = 100: je wacht nooit langer dan 100 minuten.', ok: false, r: 'Er is geen horizontale asymptoot y = 100. De asymptoot is verticaal: b = 100. De wachttijd kan dus wel langer zijn dan 100 minuten.' });
    L.push({ t: `Bij ${b1} % bezetting wacht je ${kg(S.f(b1) * 2)} minuten.`, ok: false, r: `W(${b1}) = ${kg(S.f(b1), 1)} minuten.`, c: { vraag: `Hoe lang wacht je bij ${b1} % bezetting?`, antw: getal(S.f(b1), { dec: 1, voor: `W(${b1}) =`, na: '\\text{ minuten}' }) } });
    L.push({ t: 'De verticale asymptoot is b = 100.', ok: true, r: 'Juist: daar wordt de noemer nul.' });
    L.push({ t: `Bij ${b2} % bezetting wacht je gemiddeld ${kg(S.f(b2), 1)} minuten.`, ok: true, r: `W(${b2}) ≈ ${kg(S.f(b2), 1)}.` });
    L.push({ t: `Als de medewerkers bijna niets te doen hebben, wacht je ${kg(c / 100)} minuten.`, ok: true, r: `W(0) = ${kg(c / 100)}.` });
    L.push({ t: 'Hoe dichter de bezetting bij 100 %, hoe sneller de wachttijd stijgt.', ok: true, r: 'Juist: vlak bij de verticale asymptoot wordt de grafiek steeds steiler.' });
  }
  return { S, L };
}
function vraagJuistFout() {
  const { S, L } = uitspraken(), u = kies(L);
  return { soort: 'juistfout', opdracht: 'Een leerling schreef deze zin. Is ze juist of fout?', html: `${sitOpgave(S)}<p class="midden"><i>"${u.t}"</i></p>`, sleutel: S.tex + u.t,
    rapport: `${S.titel}: "${u.t}"`, antw: { soort: 'keuze', opties: [{ k: 'j', l: '\\text{juist}' }, { k: 'f', l: '\\text{fout}' }], juist: u.ok ? 'j' : 'f' }, uitleg: [tx(u.ok ? 'Juist.' : 'Fout.'), tx(u.r)] };
}
function vraagWelkeFout() {
  const { S, L } = uitspraken(), f = kies(L.filter(u => !u.ok)), j = schud(L.filter(u => u.ok)).slice(0, 3);
  const naam = kies(['Ruben', 'Amina', 'Lotte', 'Jonas', 'Sem', 'Noor', 'Yassin', 'Elif']);
  return { soort: 'welkefout', opdracht: `In het antwoord van ${naam} staat één fout. Welke zin is fout?`, html: sitOpgave(S), sleutel: S.tex + f.t,
    rapport: `${S.titel}: fout zoeken`, antw: zinnen(f.t, j.map(u => u.t)), uitleg: [tx(`Fout: "${f.t}"`), tx(f.r)] };
}
function vraagVerbeter() {
  let S, u; do { const r = uitspraken(); S = r.S; u = kies(r.L.filter(x => x.c)); } while (!u);
  return { soort: 'verbeter', opdracht: 'Deze zin van een leerling is fout. Verbeter.', html: `${sitOpgave(S)}<p class="midden"><i>"${u.t}"</i></p><p>${u.c.vraag}</p>`, sleutel: S.tex + u.t,
    rapport: `${S.titel}: verbeter "${u.t}"`, antw: u.c.antw, uitleg: [tx(u.r)] };
}
const D9 = {
  nr: 9, titel: 'Foutenanalyse', kort: 'Fouten van leerlingen opsporen en verbeteren.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Typische fouten</div>
      <p>In de werkbundel beantwoordden Ruben, Amina, Lotte, Jonas en Sem vragen over de situaties uit hoofdstuk 1. In hun antwoorden zitten fouten die vaak gemaakt worden:</p>
      <ul><li><b>x-waarde en y-waarde verwisselen</b>: "het maximum is 3 mg/l" terwijl 3 de tijd is (het maximum is 5 mg/l, na 3 uur).</li>
      <li><b>"Wordt" in plaats van "nadert"</b>: een horizontale asymptoot is een grenswaarde die niet bereikt wordt. "Na 24 uur is de pijnstiller volledig uitgewerkt" is fout.</li>
      <li><b>De verkeerde asymptoot</b>: bij $K(n) = \\dfrac{600 + 25n}{n}$ is de horizontale asymptoot $y = 25$ (de kost per deelnemer), niet $y = 600$ (de vaste kost).</li>
      <li><b>Wiskundig domein vergeten</b>: bij $C(t) = \\dfrac{30t}{t^2 + 9}$ wordt de noemer nooit nul, dus het domein is niet $\\mathbb{R} \\setminus \\{0\\}$.</li>
      <li><b>Een verticale asymptoot buiten het praktisch domein interpreteren</b>: "twee minuten vóór de start was de melk oneindig warm" heeft geen zin.</li>
      <li><b>Een grens meenemen die er niet bij hoort</b>: bij een verticale asymptoot $b = 100$ is $W$ stijgend op $[0 \\,;\\, 100[$, niet op $[0 \\,;\\, 100]$.</li>
      <li><b>Een nulwaarde verkeerd lezen</b>: bij $W(n) = \\dfrac{12n - 900}{n}$ is de nulwaarde $n = 75$, niet $n = 12$.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: Ruben en de pijnstiller</div>
      <p>$C(t) = \\dfrac{30t}{t^2 + 9}$ met $0 \\leq t \\leq 24$. Ruben schreef:</p>
      <ul><li><i>"dom C = ℝ \\ {0}, want je mag niet delen door nul."</i> → De noemer $t^2 + 9$ is nooit nul: het wiskundig domein is $\\mathbb{R}$. Het praktisch domein is $[0 \\,;\\, 24]$.</li>
      <li><i>"Het maximum is 3 mg/l."</i> → Het maximum is 5 mg/l (na 3 uur): 3 is de $x$-waarde.</li>
      <li><i>"C is stijgend op [0 ; 24]."</i> → $C$ stijgt op $[0 \\,;\\, 3]$ en daalt op $[3 \\,;\\, 24]$.</li>
      <li><i>"De horizontale asymptoot is y = 0, dus na 24 uur is de pijnstiller volledig uitgewerkt."</i> → De concentratie nadert 0, maar bereikt die waarde niet. Na 24 uur is er nog ongeveer 1,23 mg/l.</li></ul></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Daguitstap: $K(n) = \\dfrac{600 + 25n}{n}$ met $5 \\leq n \\leq 60$.')}<p>Amina: <i>"Bij 60 deelnemers is de gemiddelde kost 25 euro."</i></p>`,
      stappen: ['K(60) = \\dfrac{600 + 1500}{60} = 35', '\\text{Fout: bij 60 deelnemers is de gemiddelde kost 35 euro. 25 euro is de grenswaarde.}'] },
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
//  9 · MODELLEN AANPASSEN MET GEOGEBRA
// ===================================================================
function vraagKoffieModel() {
  const terras = Math.random() < 0.35, k = terras ? kies([5, 8, 10, 12]) : kies([18, 20, 22]), T0 = kies([75, 80, 85, 90]), a = (T0 - k) * 10;
  const v = terras ? `Een kop koffie van ${T0} °C wordt buiten op het terras gedronken, waar het ${k} °C is.` : `Een kop koffie van ${T0} °C wordt ingeschonken in een kamer van ${k} °C.`;
  return { soort: 'koffie', opdracht: 'Bepaal de parameters (controleer met schuifknoppen in GeoGebra).', html: `${opgave(`${v} We schrijven het model als`)}<p class="midden">$T(t) = k + \\dfrac{a}{t + 10}$</p>`, sleutel: v,
    rapport: `koffie: k en a (T0 = ${T0}, omgeving ${k})`, antw: delen(['k =', getal(k)], ['a =', getal(a)]),
    uitleg: [`k \\text{ is de horizontale asymptoot: de omgevingstemperatuur, dus } k = ${k}`, `T(0) = ${k} + \\dfrac{a}{10} = ${T0} \\Rightarrow a = (${T0} - ${k}) \\cdot 10 = ${a}`] };
}
function vraagKostModel() {
  const S = sitKost(), vorm = Math.random() < 0.5;
  const html = vorm ? `${opgave('Schrijf dit model in de vorm $K(n) = p + \\dfrac{v}{n}$.')}<p class="midden">$${S.tex}$</p>` : `${opgave(S.verhaal.replace(/ is$/, '') + '. Schrijf dat model in de vorm')}<p class="midden">$K(n) = p + \\dfrac{v}{n}$</p>`;
  return { soort: 'kost', opdracht: 'Bepaal p en v.', html, sleutel: S.tex + vorm, rapport: `${S.titel}: p en v`, antw: delen(['p =', getal(S.p)], ['v =', getal(S.v)]),
    uitleg: [`K(n) = \\dfrac{${S.v} + ${S.p}n}{n} = \\dfrac{${S.v}}{n} + \\dfrac{${S.p}n}{n} = ${S.p} + \\dfrac{${S.v}}{n}`, `p = ${S.p} \\text{ (kost per ${S.per}, de horizontale asymptoot)}, \\quad v = ${S.v} \\text{ (vaste kost)}`] };
}
function vraagGroeiModel() {
  const A = kies([150, 200, 240, 300, 400]), h = kies([2, 3, 4, 5, 6]), wat = kies([{ w: 'vrijwilligers', t: 'Een buurtproject zoekt vrijwilligers' }, { w: 'inschrijvingen', t: 'Een sportclub opent de inschrijvingen voor een nieuwe ploeg' }]);
  return { soort: 'groei', opdracht: 'Bepaal a en b (controleer met schuifknoppen in GeoGebra).', html: `${opgave(`${wat.t}. Bij de start zijn er nog geen ${wat.w}. Op lange termijn nadert het aantal ${wat.w} ${A}. Na ${h} weken zijn er ${A / 2}. Het model is`)}<p class="midden">$f(w) = \\dfrac{a \\cdot w}{w + b}$</p>`,
    sleutel: `${A}${h}${wat.w}`, rapport: `groeimodel: a en b (grens ${A}, helft na ${h})`, antw: delen(['a =', getal(A)], ['b =', getal(h)]),
    uitleg: [`\\text{Horizontale asymptoot } y = a, \\text{ dus } a = ${A}`, `f(${h}) = \\dfrac{${A} \\cdot ${h}}{${h} + b} = ${A / 2} \\Rightarrow ${h} + b = ${2 * h} \\Rightarrow b = ${h}`, tx('Na b weken is de helft van de grenswaarde bereikt.')] };
}
function vraagConcModel() {
  const tm = kies([2, 3, 4, 5]), Mx = kies([4, 5, 6, 8, 10]), b = tm * tm, a = 2 * Mx * tm;
  return { soort: 'conc', opdracht: 'Bepaal a en b (zoek met schuifknoppen in GeoGebra, of gebruik de tip in de theorie).', html: `${opgave(`Een apotheker beschrijft de concentratie van een geneesmiddel (in mg/l) met het model hieronder. De concentratie moet na ${tm} uur maximaal zijn, en dat maximum moet ${Mx} mg/l bedragen.`)}<p class="midden">$C(t) = \\dfrac{a \\cdot t}{t^2 + b}$</p>`,
    sleutel: `${tm}${Mx}`, rapport: `concentratiemodel: a en b (max ${Mx} na ${tm} uur)`, antw: delen(['b =', getal(b)], ['a =', getal(a)]),
    uitleg: [`\\text{Het maximum ligt bij } t = \\sqrt{b} = ${tm} \\Rightarrow b = ${b}`, `\\text{Het maximum is } \\dfrac{a}{2\\sqrt{b}} = \\dfrac{a}{${2 * tm}} = ${Mx} \\Rightarrow a = ${a}`] };
}
function vraagRol() {
  const T = kies([
    { m: 'T(t) = k + \\dfrac{a}{t + 10}', v: 'Welke parameter bepaalt de horizontale asymptoot?', j: 'k: de horizontale asymptoot is y = k (de omgevingstemperatuur).', f: ['a: de horizontale asymptoot is y = a.', '10: de horizontale asymptoot is y = 10.', 'Geen enkele: de horizontale asymptoot is altijd y = 0.'] },
    { m: 'K(n) = p + \\dfrac{v}{n}', v: 'Wat betekent v in de situatie?', j: 'v is de vaste kost (bv. het busgeld), die over n deelnemers verdeeld wordt.', f: ['v is de kost per deelnemer.', 'v is de horizontale asymptoot.', 'v is het aantal deelnemers.'] },
    { m: 'K(n) = p + \\dfrac{v}{n}', v: 'Wat is de horizontale asymptoot?', j: 'y = p: bij heel veel deelnemers nadert de kost de kost per deelnemer.', f: ['y = v: de vaste kost.', 'y = 0: de kost per deelnemer nadert 0.', 'Er is geen horizontale asymptoot, enkel n = 0.'] },
    { m: 'C(t) = \\dfrac{a \\cdot t}{t^2 + b}', v: 'Verandert de horizontale asymptoot als je a of b aanpast?', j: 'Neen: ze blijft y = 0. Op lange termijn verdwijnt het geneesmiddel altijd uit het bloed.', f: ['Ja: de horizontale asymptoot is y = a.', 'Ja: de horizontale asymptoot is y = b.', 'Ja: de horizontale asymptoot is y = a/b.'] },
    { m: 'C(t) = \\dfrac{a \\cdot t}{t^2 + b}', v: 'Welke parameter bepaalt wanneer het maximum bereikt wordt?', j: 'b: het maximum ligt bij t = √b.', f: ['a: het maximum ligt bij t = a.', 'a en b samen: het maximum ligt bij t = a/b.', 'Geen enkele: het maximum ligt altijd bij t = 1.'] },
    { m: 'f(w) = \\dfrac{a \\cdot w}{w + b}', v: 'Wat betekent b in de situatie?', j: 'Na b weken is de helft van de grenswaarde bereikt.', f: ['b is de grenswaarde.', 'b is de beginwaarde.', 'Na b weken is de grenswaarde bereikt.'] },
    { m: 'K(n) = \\dfrac{600 + 25n}{n} = 25 + \\dfrac{600}{n}', v: 'In welke vorm zie je de horizontale asymptoot meteen?', j: 'In de tweede vorm: 25 + 600/n toont meteen y = 25 (de kost per deelnemer).', f: ['In de eerste vorm: daar staat 600 in de teller.', 'In geen van beide: je moet altijd GeoGebra gebruiken.', 'In de eerste vorm: de horizontale asymptoot is y = 600.'] },
  ]);
  return { soort: 'rol', opdracht: 'Wat doet de parameter?', html: `<p class="midden">$${T.m}$</p><p>${T.v}</p>`, sleutel: T.m + T.v, rapport: `${W.platteTekst(T.m)}: ${T.v}`, antw: zinnen(T.j, T.f), uitleg: [tx(T.j)] };
}
const D10 = {
  nr: 10, titel: 'Modellen aanpassen met GeoGebra', kort: 'Parameters met een betekenis: een model op maat maken.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een model op maat</div>
      <p>Tot nu toe kreeg je een kant-en-klaar voorschrift. Nu maak je zelf een model op maat, met <b>parameters</b>. Kies een vorm waarin je de betekenis van de parameters meteen ziet:</p>
      <table class="tabel"><tr><th>Model</th><th>Betekenis van de parameters</th></tr>
      <tr><td>$T(t) = k + \\dfrac{a}{t + 10}$</td><td>$k$ = horizontale asymptoot (omgevingstemperatuur); $a$ volgt uit de beginwaarde: $T(0) = k + \\dfrac{a}{10}$</td></tr>
      <tr><td>$K(n) = p + \\dfrac{v}{n}$</td><td>$p$ = kost per deelnemer (horizontale asymptoot $y = p$); $v$ = vaste kost</td></tr>
      <tr><td>$f(w) = \\dfrac{a \\cdot w}{w + b}$</td><td>$a$ = grenswaarde (horizontale asymptoot $y = a$); na $b$ weken is de helft van de grenswaarde bereikt</td></tr>
      <tr><td>$C(t) = \\dfrac{a \\cdot t}{t^2 + b}$</td><td>horizontale asymptoot altijd $y = 0$; maximum na $\\sqrt{b}$ uur; het maximum is $\\dfrac{a}{2\\sqrt{b}}$</td></tr></table></div>
    <div class="kader eig"><div class="kader-titel">Zo werk je met schuifknoppen in GeoGebra</div>
      <ol><li>Typ in de invoerbalk <code>a = 1</code> en druk op Enter. Klik op het bolletje vóór a: er verschijnt een schuifknop.</li>
      <li>Via de instellingen van de schuifknop kies je het minimum, het maximum en de stapgrootte.</li>
      <li>Typ het voorschrift met de parameter erin, bv. <code>f(x) = a*x/(x^2 + b)</code>.</li><li>Versleep de schuifknop en kijk hoe de grafiek verandert.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: de kop koffie</div>
      <p>Kamer 20 °C, koffie start bij 80 °C, model $T(t) = k + \\dfrac{a}{t + 10}$.</p>
      <p>$k = 20$ (de kamertemperatuur). $T(0) = 20 + \\dfrac{a}{10} = 80 \\Rightarrow a = 600$. Dus $T(t) = 20 + \\dfrac{600}{t + 10}$: dat is precies $T_1(t) = \\dfrac{20t + 800}{t + 10}$ (zet op gelijke noemer).</p>
      <p>Op het terras van 8 °C: $k = 8$ en $8 + \\dfrac{a}{10} = 80 \\Rightarrow a = 720$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een geneesmiddel op maat</div>
      <p>$C(t) = \\dfrac{a \\cdot t}{t^2 + b}$; maximum na 2 uur, en dat maximum is 6 mg/l. &nbsp; $\\sqrt{b} = 2 \\Rightarrow b = 4$. &nbsp; $\\dfrac{a}{2 \\cdot 2} = 6 \\Rightarrow a = 24$.</p>
      ${figuur(rgraf({ x: [0, 24], y: [0, 7], xs: 2, ys: 1, xn: 't (uur)', yn: 'concentratie (mg/l)', functies: [{ f: (t) => 24 * t / (t * t + 4) }], punten: [{ x: 2, y: 6 }] }))}</div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Sociaal restaurant: 3000 euro vaste kosten per maand en 4 euro ingrediënten per maaltijd.')}<p>Schrijf het model als $K(n) = p + \\dfrac{v}{n}$.</p>`,
      stappen: ['p = 4 \\text{ (per maaltijd)}, \\quad v = 3000 \\text{ (vaste kost)}', 'K(n) = 4 + \\dfrac{3000}{n}', 'K(n) < 7 \\Leftrightarrow \\dfrac{3000}{n} < 3 \\Leftrightarrow n > 1000'] },
    { html: `${opgave('Vrijwilligers: V(0) = 0, op lange termijn nadert het aantal 200, na 4 weken zijn er 100.')}<p>Bepaal $a$ en $b$ in $V(w) = \\dfrac{a \\cdot w}{w + b}$.</p>`,
      stappen: ['a = 200 \\text{ (grenswaarde)}', 'V(4) = \\dfrac{200 \\cdot 4}{4 + b} = 100 \\Rightarrow b = 4', '\\text{Na } b \\text{ weken is de helft van de grenswaarde bereikt.}'] },
  ],
  soorten: {
    koffie: { naam: 'Afkoelen: k en a', gen: vraagKoffieModel },
    kost: { naam: 'Kost: p en v', gen: vraagKostModel },
    groei: { naam: 'Groei naar een grens: a en b', gen: vraagGroeiModel },
    conc: { naam: 'Concentratie: a en b', gen: vraagConcModel },
    rol: { naam: 'Wat doet de parameter?', gen: vraagRol },
  },
  oefenMix: [['koffie', 1], ['kost', 1], ['groei', 1], ['conc', 1], ['rol', 1]],
  test: [['koffie', 2], ['kost', 2], ['groei', 2], ['conc', 2], ['rol', 2]], testSchudden: true,
};

// ===================================================================
//  EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D11 = {
  nr: 11, titel: 'Eindtest rationale functies in context', kort: 'Uit elk hoofdstuk één vraag.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest krijg je uit elk hoofdstuk één vraag, door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${LET_OP}${GEOGEBRA}${AFSPRAAK}`,
  voorbeelden: [],
  soorten: {
    e1: mix(D1, 'betekenis', 'Woordenlijst'), e2: mix(D2, 'wanneer', 'Aflezen en interpreteren'), e3: mix(D3, 'praktdom', 'Praktisch domein'),
    e4: mix(D4, 'extra', 'Kritisch kijken'), e5: mix(D5, 'grafsit', 'Koppelen'), e6: mix(D6, 'vgraf', 'Van situatie naar schets'),
    e7: mix(D7, 'grafkenm', 'Van kenmerken naar schets'), e8: mix(D8, 'vertaal', 'Een grafiek vertellen'), e9: mix(D9, 'welkefout', 'Foutenanalyse'), e10: mix(D10, 'koffie', 'Modellen aanpassen'),
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
      if (v.html && !/^<div class="tekstopgave">/.test(v.html)) v.html = `<div class="tekstopgave">${v.html}</div>`;
      if (v.uitleg && v.uitleg.length) { // uitleg als HTML: tekstregels breken af; herhaal het juiste antwoord niet
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
}

Leerpaden.registreer({
  code: 'rationale-functies-context',
  titel: 'Rationale functies in context',
  ondertitel: 'Wiskunde · 5WW / 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert wat de kenmerken van een rationale functie (domein, bereik, beginwaarde, nulwaarde, asymptoten, teken- en verloopschema) <b>betekenen in een echte situatie</b>:
    een geneesmiddel in het bloed, de kost van een uitstap, een babyflesje in de flessenwarmer, de wachttijd aan een loket … Elk deel volgt een hoofdstuk van de werkbundel.
    Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p><b>Afronden:</b> bij elke rekenvraag staat op hoeveel decimalen je afrondt. Houd <b>GeoGebra</b> bij de hand.</p>`,
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
