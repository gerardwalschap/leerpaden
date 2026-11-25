// ===================================================================
//  5 · VAN SITUATIE NAAR SCHETS
// ===================================================================
function verhaalSit() {
  const fam = kies(['temp', 'groei', 'conc', 'wacht', 'kost']);
  const S = fam === 'temp' ? sitTemp('koffie') : fam === 'groei' ? sitGroei('vrijwilligers') : fam === 'wacht' ? sitWacht('loket') : fam === 'kost' ? sitKost('restaurant') : sitConc('geneesmiddel');
  let v, kenm;
  if (fam === 'temp') { v = `In de leraarskamer schenkt iemand een kop koffie in. De koffie is ${S.T0} °C. De kamer is ${S.k} °C warm. De koffie koelt eerst snel af, daarna steeds trager. Na 10 minuten is de koffie ongeveer ${kg(S.f(10), 0)} °C. We volgen de koffie een uur lang.`;
    kenm = { as: ['\\text{horizontale asymptoot: } y =', S.k], dom: [0, 60, true, true] }; }
  if (fam === 'groei') { v = `Een nieuw buurtproject zoekt vrijwilligers. Bij de start (week 0) zijn er nog geen vrijwilligers. In de eerste weken komen er veel mensen bij, daarna steeds minder. Na ${S.b} weken zijn er ${S.A / 2} vrijwilligers. Er komen er nooit meer dan ${S.A}. We volgen het project 20 weken.`;
    kenm = { as: ['\\text{horizontale asymptoot: } y =', S.A], dom: [0, 20, true, true] }; }
  if (fam === 'conc') { v = `Een patiënt krijgt om ${S.uur} u een geneesmiddel. De concentratie in het bloed stijgt eerst snel. Na ${S.tm} uur is ze het hoogst: ${S.Mx} mg/l. Daarna daalt ze langzaam. Volgens de apotheker wordt de concentratie nooit helemaal 0. We volgen de patiënt 24 uur.`;
    kenm = { as: ['\\text{horizontale asymptoot: } y =', 0], dom: [0, 24, true, true] }; }
  if (fam === 'wacht') { v = `Aan het loket van het OCMW hangt de wachttijd af van de bezettingsgraad van de medewerkers. Bij 0 % bezetting wacht je gemiddeld ${kg(S.c / 100)} minuten. Bij 50 % is dat ${kg(S.c / 50)} minuten. Hoe dichter de bezetting bij 100 % komt, hoe sneller de wachttijd stijgt. Bij 100 % zou de wachtrij nooit meer korter worden.`;
    kenm = { as: ['\\text{verticale asymptoot: } b =', 100], dom: [0, 100, true, false] }; }
  if (fam === 'kost') { v = `Een sociaal restaurant heeft elke maand ${S.v} euro vaste kosten (huur en energie). Elke maaltijd kost daarbovenop ${S.p} euro aan ingrediënten. Bij 100 maaltijden per maand kost een maaltijd gemiddeld ${kg(S.f(100))} euro. Hoe meer maaltijden, hoe goedkoper per maaltijd. Maar een maaltijd is nooit goedkoper dan de ingrediënten. We bekijken 100 tot 1500 maaltijden per maand.`;
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
  return { soort: 'vgraf', opdracht: 'Controleer alle gegevens: de beginwaarde, de gegeven punten en de grenswaarde.', html: opgave(v) + vraag('Welke grafiek past bij dit verhaal?'), sleutel: v,
    rapport: `verhaal → grafiek (${S.titel})`, antw: figuren(schetsGraf(S, S.f, Y1), F.map(f => schetsGraf(S, f, Y1))),
    uitleg: [tx('Controleer de beginwaarde, de gegeven punten, stijgen of dalen en de asymptoot.'), `\\text{Een passend model: } ${S.tex}`] };
}
function vraagVerhaalKenm() {
  const { S, v, kenm } = verhaalSit();
  const [a, b, ai, bi] = kenm.dom;
  return { soort: 'vkenm', opdracht: 'Denk aan een schets bij het verhaal.', html: opgave(v) + vraag('Welke asymptoot en welk domein horen bij dit verhaal?'), sleutel: v + 'k',
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
  return { soort: 'vvoorschrift', opdracht: 'Tip: controleer met je rekenmachine de beginwaarde, het gegeven punt en de asymptoot.', html: opgave(v) + vraag('Welk voorschrift past bij dit verhaal?'), sleutel: v + 'v',
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
  return { soort: 'asymp', opdracht: 'Lees af uit het verloopschema.', html: `<p>Van een rationale functie $f$ is het verloopschema gegeven:</p>${verloopHTML(h)}${vraag('Wat zijn de verticale en de horizontale asymptoot?')}`, sleutel: `${h.a}${h.c}${h.d}`,
    rapport: `verloopschema: asymptoten (x = ${h.a}, y = ${h.c})`, antw: delen(['\\text{verticale asymptoot: } x =', getal(h.a)], ['\\text{horizontale asymptoot: } y =', getal(h.c)]),
    uitleg: [`\\text{Bij } x = ${tg(h.a)} \\text{ gaan de functiewaarden naar } \\pm\\infty: x = ${tg(h.a)}`, `\\text{Op } \\pm\\infty \\text{ nadert } f(x) \\text{ naar } ${tg(h.c)}: y = ${tg(h.c)}`] };
}
function vraagNulInterval() {
  const h = hyper();
  const L = `]−∞ ; ${kg(h.a)}[`, R = `]${kg(h.a)} ; +∞[`;
  const juist = `Eén nulwaarde, in ${h.z < h.a ? L : R}.`;
  const tak = h.z < h.a ? 'De linkertak' : 'De rechtertak';
  return { soort: 'nulint', opdracht: 'Kijk bij elke tak of hij de x-as snijdt.', html: `<p>Van een rationale functie $f$ is het verloopschema gegeven:</p>${verloopHTML(h)}${vraag('Hoeveel nulwaarden heeft f, en waar liggen ze?')}`, sleutel: `${h.a}${h.c}${h.d}n`,
    rapport: `verloopschema: nulwaarden`, antw: zinnen(juist, [`Eén nulwaarde, in ${h.z < h.a ? R : L}.`, 'Geen nulwaarden.', `Twee nulwaarden: één in ${L} en één in ${R}.`], { lijst: false }),
    uitleg: [tx(`${tak} snijdt de x-as één keer, in x = ${kg(h.z)}.`), tx('De andere tak blijft aan één kant van de x-as.')] };
}
function vraagTeken() {
  const h = hyper();
  const goed = tekenCellen(h), wissel = tekenCellen(h, true);
  const omgekeerd = goed.map(c => c.y === '0' ? { ...c, y: '×' } : c.y === '×' ? { ...c, y: '0' } : c);
  const zonderX = goed.map(c => c.y === '×' ? { ...c, y: '0' } : c);
  const opties = schud([goed, wissel, omgekeerd, zonderX].map((c, i) => ({ c, i })));
  return { soort: 'teken', opdracht: 'Boven de x-as: +, onder de x-as: −.', html: figuur(hGraf(h)) + vraag('Welk tekenschema hoort bij deze grafiek?'), sleutel: `${h.a}${h.c}${h.d}t`, rapport: 'grafiek → tekenschema',
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
  return { soort: 'grafkenm', opdracht: 'Controleer elk kenmerk.', html: `<p>Een rationale functie $f$ heeft deze kenmerken:</p>${lijst}${vraag('Welke grafiek past bij al deze kenmerken?')}`, sleutel: `${h.a}${h.c}${h.d}g`, rapport: 'kenmerken → grafiek',
    antw: figuren(teken(h, h.a, h.c), [teken(g1, h.a, -h.c), teken(g2, h.a, h.c), teken(g3, a3, h.c)]), uitleg: [`\\text{Bijvoorbeeld } ${hTex(h)}`, tx('Controleer telkens: asymptoten, nulwaarde, snijpunt met de y-as en stijgen/dalen.')] };
}
function vraagBereikH() {
  const h = hyper();
  return { soort: 'bereikh', opdracht: 'Lees af uit het verloopschema.', html: `<p>Van een rationale functie $f$ is het verloopschema gegeven:</p>${verloopHTML(h)}${vraag('Wat is het bereik van f?')}`, sleutel: `${h.a}${h.c}${h.d}b`,
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
    { g: `De grafiek van $f$ snijdt haar horizontale asymptoot $y = ${c}$.`, kan: true, r: 'Dat kan: een grafiek mag haar horizontale asymptoot snijden. De asymptoot zegt alleen wat er gebeurt als x heel groot (of heel klein) wordt. Voorbeeld: de concentratie C(t) = 30t/(t² + 9) is 0 bij t = 0, en toch is y = 0 de horizontale asymptoot.' },
  ]);
  const juist = T.kan ? 'Dit kan.' : 'Dit kan niet.';
  return { soort: 'kandit', opdracht: 'Denk na voor je kiest.', html: `<p>${T.g}</p>${vraag('Kan dit?')}`, sleutel: T.g, rapport: W.platteTekst(T.g.replace(/\\lim\\limits_\{([^}]*)\}/g, 'lim($1)')),
    antw: { soort: 'keuze', opties: [{ k: 'ja', l: '\\text{Dit kan.}' }, { k: 'nee', l: '\\text{Dit kan niet.}' }], juist: T.kan ? 'ja' : 'nee' }, uitleg: [tx(juist), tx(T.r)] };
}
function vraagLimiet() {
  const h = hyper(), kant = kies(['-', '+']);
  const L = kant === '-' ? (h.daalt ? -I : I) : (h.daalt ? I : -I);
  const opties = schud(['+\\infty', '-\\infty', tg(h.c), '0'].filter((v, i, a) => a.indexOf(v) === i));
  const juist = L === I ? '+\\infty' : '-\\infty';
  return { soort: 'limiet', opdracht: 'Lees af op de grafiek.', html: `${figuur(hGraf(h))}${vraag('Wat is deze limiet?')}<p class="midden">$\\lim\\limits_{x \\to ${tg(h.a)}^${kant}} f(x) = \\;?$</p>`, sleutel: `${h.a}${h.c}${h.d}${kant}`,
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
  return { soort: 'vertaal', opdracht: 'Kies de zin die past bij de situatie.', html: `${opgave(S.verhaal)}${verhaalGraf(S)}<p class="midden">In wiskundetaal: $${S.w[k]}$</p>${vraag('Wat betekent dat in de situatie?')}`, sleutel: S.titel + k + S.z[k],
    rapport: `${S.titel}: ${W.platteTekst(S.w[k])}`, antw: zinnen(S.z[k], fout), uitleg: [S.w[k], tx(S.z[k])] };
}
function vraagVerslag() {
  const S = kiesVerhaal(), z = S.z;
  const extra = S.fam === 'web' ? z.max : z.eind;
  const goed = [z.begin, z.verloop, extra, z.ha].join(' ');
  const fout = [[z.begin, z.verloop, extra, z.haF].join(' '), [z.beginF, z.verloop, extra, z.ha].join(' '), [z.begin, z.verloopF, extra, z.ha].join(' ')];
  return { soort: 'verslag', opdracht: 'In de andere verslagen staat één fout.', html: `${opgave(S.verhaal)}${verhaalGraf(S)}${vraag('Welk verslag past bij de grafiek?')}`, sleutel: S.titel + goed,
    rapport: `${S.titel}: juiste verslag kiezen`, antw: zinnen(goed, fout), uitleg: [tx(goed)] };
}
function vraagAflezenV() {
  const S = kiesVerhaal();
  let vr, juist, fout, na;
  if (S.fam === 'temp') { const t = Math.round(S.t60); vr = 'Bewoners mogen pas soep krijgen als ze hoogstens 60 °C is. Na hoeveel minuten is dat ongeveer?'; juist = t; fout = [t + 10, Math.max(1, t - 8), t + 25]; na = 'minuten'; }
  else if (S.fam === 'reval') { vr = 'Hoeveel meter kan de patiënt ongeveer zonder pauze wandelen na 4 weken?'; juist = S.m4; fout = [S.m4 + 150, S.m4 - 150, S.E]; na = 'm'; }
  else { vr = 'Op welke dag heeft de website de meeste bezoekers?'; juist = S.dm; fout = [S.dm + 5, S.dm * 3, 1]; na = ''; }
  const opties = schud([juist, ...fout].filter((v, i, a) => a.indexOf(v) === i));
  return { soort: 'aflezenv', opdracht: 'Lees af op de grafiek.', html: `${opgave(S.verhaal)}${verhaalGraf(S)}${vraag(vr)}`, sleutel: S.titel + vr + juist,
    rapport: `${S.titel}: ${vr}`, antw: { soort: 'keuze', opties: opties.map((v, i) => ({ k: String(i), l: `\\text{${S.fam === 'web' ? 'dag ' : 'ongeveer '}${kg(v)}${na ? ' ' + na : ''}}` })), juist: String(opties.indexOf(juist)) },
    uitleg: [tx(`Ongeveer ${kg(juist)} ${na}`)] };
}
function vraagContexttaal() {
  const S = kiesVerhaal();
  const juist = kies([S.z.verloop, S.z.lim, S.z.begin]);
  const fn = S.fn;
  const fout = schud([`De functie ${fn} is stijgend op het begin en nadert dan de asymptoot.`, `De horizontale asymptoot van de grafiek is y = ${S.ha}.`, `${fn}(0) is de beginwaarde van de functie.`, `De grafiek is eerst steil en daarna vlak.`, `De nulwaarde van ${fn} ligt in ${S.x} = 0.`]).slice(0, 3);
  return { soort: 'context', opdracht: 'Wiskundewoorden zijn bv. functie, asymptoot, nulwaarde, grafiek.', html: `${opgave(S.verhaal)}${verhaalGraf(S)}${vraag('Welke zin gebruikt alleen woorden uit de situatie, en geen wiskundewoorden?')}`, sleutel: S.titel + juist,
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
  return { soort: 'juistfout', opdracht: 'Tip: controleer met het grafiekvenster.', html: `${sitOpgave(S)}<p>Een leerling schrijft:</p><p class="midden"><i>"${u.t}"</i></p>${vraag('Is die zin juist of fout?')}${sitVenster(S, { t: 'vfsm' })}`, sleutel: S.tex + u.t,
    rapport: `${S.titel}: "${u.t}"`, antw: { soort: 'keuze', opties: [{ k: 'j', l: '\\text{juist}' }, { k: 'f', l: '\\text{fout}' }], juist: u.ok ? 'j' : 'f' }, uitleg: [tx(u.ok ? 'Juist.' : 'Fout.'), tx(u.r)] };
}
function vraagWelkeFout() {
  const { S, L } = uitspraken(), f = kies(L.filter(u => !u.ok)), j = schud(L.filter(u => u.ok)).slice(0, 3);
  const naam = kies(['Ruben', 'Amina', 'Lotte', 'Jonas', 'Sem', 'Noor', 'Yassin', 'Elif']);
  return { soort: 'welkefout', opdracht: 'Tip: controleer met het grafiekvenster.', html: sitOpgave(S, `${vraag(`${naam} schreef vier zinnen over deze situatie. Eén zin is fout. Welke?`)}${sitVenster(S, { t: 'vfsm' })}`), sleutel: S.tex + f.t,
    rapport: `${S.titel}: fout zoeken`, antw: zinnen(f.t, j.map(u => u.t)), uitleg: [tx(`Fout: "${f.t}"`), tx(f.r)] };
}
function vraagVerbeter() {
  let S, u; do { const r = uitspraken(); S = r.S; u = kies(r.L.filter(x => x.c)); } while (!u);
  return { soort: 'verbeter', opdracht: 'Tip: controleer met het grafiekvenster.', html: `${sitOpgave(S)}<p>Een leerling schrijft deze zin. De zin is fout:</p><p class="midden"><i>"${u.t}"</i></p>${vraag(u.c.vraag)}${sitVenster(S, { t: 'vfsm' })}`, sleutel: S.tex + u.t,
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
  const pv = venster({ fs: [{ e: 'k+a/(x+10)', n: 'T' }], par: [{ n: 'k', w: 0 }, { n: 'a', w: 100 }], X: [0, 60], Y: [0, 100], a: 0, b: 60, xv: 't', xe: 'minuten', ye: '°C', xn: 't (minuten)', yn: 'temperatuur (°C)', t: 'pvf', pts: [{ x: 0, y: T0 }], buiten: false, geenDomein: true });
  return { soort: 'koffie', opdracht: 'Tip: vul in het grafiekvenster waarden in voor k en a. Klopt de grafiek met het verhaal?', html: `${opgave(`${v} We schrijven het model als`)}<p class="midden">$T(t) = k + \\dfrac{a}{t + 10}$</p>${vraag('Welke waarden hebben k en a?')}${pv}`, sleutel: v,
    rapport: `koffie: k en a (T0 = ${T0}, omgeving ${k})`, antw: delen(['k =', getal(k)], ['a =', getal(a)]),
    uitleg: [`k \\text{ is de horizontale asymptoot: de omgevingstemperatuur, dus } k = ${k}`, `T(0) = ${k} + \\dfrac{a}{10} = ${T0} \\Rightarrow a = (${T0} - ${k}) \\cdot 10 = ${a}`] };
}
function vraagKostModel() {
  const S = sitKost(), vorm = Math.random() < 0.5;
  const html = vorm ? `${opgave('Je krijgt dit model:')}<p class="midden">$${S.tex}$</p>${vraag('Schrijf het in de vorm $K(n) = p + \\dfrac{v}{n}$. Wat zijn p en v?')}`
    : `${opgave(S.verhaal.replace(/ De formule geeft[\s\S]*$/, ''))}${vraag(`Schrijf de gemiddelde kost per ${S.per} in de vorm $K(n) = p + \\dfrac{v}{n}$. Wat zijn p en v?`)}`;
  return { soort: 'kost', opdracht: 'Tip: splits de breuk in twee breuken met noemer n.', html, sleutel: S.tex + vorm, rapport: `${S.titel}: p en v`, antw: delen(['p =', getal(S.p)], ['v =', getal(S.v)]),
    uitleg: [`K(n) = \\dfrac{${S.v} + ${S.p}n}{n} = \\dfrac{${S.v}}{n} + \\dfrac{${S.p}n}{n} = ${S.p} + \\dfrac{${S.v}}{n}`, `p = ${S.p} \\text{ (kost per ${S.per}, de horizontale asymptoot)}, \\quad v = ${S.v} \\text{ (vaste kost)}`] };
}
function vraagGroeiModel() {
  const A = kies([150, 200, 240, 300, 400]), h = kies([2, 3, 4, 5, 6]), wat = kies([{ w: 'vrijwilligers', t: 'Een buurtproject zoekt vrijwilligers' }, { w: 'inschrijvingen', t: 'Een sportclub opent de inschrijvingen voor een nieuwe ploeg' }]);
  const pv = venster({ fs: [{ e: 'a*x/(x+b)', n: 'f' }], par: [{ n: 'a', w: 100 }, { n: 'b', w: 1 }], X: [0, 30], Y: [0, top(A * 1.15)], a: 0, b: 30, xv: 'w', xe: 'weken', ye: wat.w, xn: 'w (weken)', yn: `aantal ${wat.w}`, t: 'pvf', pts: [{ x: 0, y: 0 }, { x: h, y: A / 2 }], buiten: false, geenDomein: true });
  return { soort: 'groei', opdracht: 'Tip: vul in het grafiekvenster waarden in voor a en b. Gaat de grafiek door de oranje punten?', html: `${opgave(`${wat.t}. Bij de start zijn er nog geen ${wat.w}. Op lange termijn nadert het aantal ${wat.w} ${A}. Na ${h} weken zijn er ${A / 2}. Het model is`)}<p class="midden">$f(w) = \\dfrac{a \\cdot w}{w + b}$</p>${vraag('Welke waarden hebben a en b?')}${pv}`,
    sleutel: `${A}${h}${wat.w}`, rapport: `groeimodel: a en b (grens ${A}, helft na ${h})`, antw: delen(['a =', getal(A)], ['b =', getal(h)]),
    uitleg: [`\\text{Horizontale asymptoot } y = a, \\text{ dus } a = ${A}`, `f(${h}) = \\dfrac{${A} \\cdot ${h}}{${h} + b} = ${A / 2} \\Rightarrow ${h} + b = ${2 * h} \\Rightarrow b = ${h}`, tx('Na b weken is de helft van de grenswaarde bereikt.')] };
}
function vraagConcModel() {
  const tm = kies([2, 3, 4, 5]), Mx = kies([4, 5, 6, 8, 10]), b = tm * tm, a = 2 * Mx * tm;
  const pv = venster({ fs: [{ e: 'a*x/(x*x+b)', n: 'C' }], par: [{ n: 'a', w: 10 }, { n: 'b', w: 1 }], X: [0, 24], Y: [0, top(Mx * 1.6)], a: 0, b: 24, xv: 't', xe: 'uur', ye: 'mg/l', xn: 't (uur)', yn: 'concentratie (mg/l)', t: 'pvm', pts: [{ x: tm, y: Mx }], buiten: false, geenDomein: true });
  return { soort: 'conc', opdracht: 'Tip: gebruik de regel in de theorie, of probeer waarden uit in het grafiekvenster.', html: `${opgave(`Een apotheker beschrijft de concentratie van een geneesmiddel (in mg/l) met het model hieronder. De concentratie moet na ${tm} uur het hoogst zijn. Dat hoogste punt moet ${Mx} mg/l zijn.`)}<p class="midden">$C(t) = \\dfrac{a \\cdot t}{t^2 + b}$</p>${vraag('Welke waarden hebben a en b?')}${pv}`,
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
  return { soort: 'rol', opdracht: 'Kies het juiste antwoord.', html: `<p class="midden">$${T.m}$</p>${vraag(T.v)}`, sleutel: T.m + T.v, rapport: `${W.platteTekst(T.m)}: ${T.v}`, antw: zinnen(T.j, T.f), uitleg: [tx(T.j)] };
}
const D10 = {
  nr: 10, titel: 'Modellen op maat', kort: 'Parameters met een betekenis: een model op maat maken.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een model op maat</div>
      <p>Tot nu toe kreeg je een kant-en-klaar voorschrift. Nu maak je zelf een model op maat, met <b>parameters</b>. Kies een vorm waarin je de betekenis van de parameters meteen ziet:</p>
      <table class="tabel"><tr><th>Model</th><th>Betekenis van de parameters</th></tr>
      <tr><td>$T(t) = k + \\dfrac{a}{t + 10}$</td><td>$k$ = horizontale asymptoot (omgevingstemperatuur); $a$ volgt uit de beginwaarde: $T(0) = k + \\dfrac{a}{10}$</td></tr>
      <tr><td>$K(n) = p + \\dfrac{v}{n}$</td><td>$p$ = kost per deelnemer (horizontale asymptoot $y = p$); $v$ = vaste kost</td></tr>
      <tr><td>$f(w) = \\dfrac{a \\cdot w}{w + b}$</td><td>$a$ = grenswaarde (horizontale asymptoot $y = a$); na $b$ weken is de helft van de grenswaarde bereikt</td></tr>
      <tr><td>$C(t) = \\dfrac{a \\cdot t}{t^2 + b}$</td><td>horizontale asymptoot altijd $y = 0$; maximum na $\\sqrt{b}$ uur; het maximum is $\\dfrac{a}{2\\sqrt{b}}$</td></tr></table></div>
    <div class="kader eig"><div class="kader-titel">Zo probeer je een model uit in het grafiekvenster</div>
      <ol><li>In het grafiekvenster staat het model al klaar, met vakjes voor de parameters (bv. <i>a</i> en <i>b</i>).</li>
      <li>Typ een waarde in een vakje. De grafiek verandert meteen.</li>
      <li>De <b>oranje punten</b> zijn de gegevens uit het verhaal. Pas de parameters aan tot de grafiek door die punten gaat.</li>
      <li>Zoek eerst de parameter die je meteen ziet (bv. de grenswaarde), en daarna de andere.</li></ol>
      <p class="klein">In GeoGebra kan het ook met schuifknoppen: typ <code>a = 1</code>, klik op het bolletje vóór a, en typ <code>f(x) = a*x/(x^2 + b)</code>.</p></div>
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
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest krijg je uit elk hoofdstuk één vraag. Herhaal gerust de theorie van een vorig deel.</p></div>${LET_OP}${GEOGEBRA}${AFSPRAAK}`,
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
      if (v.html) v.html = woorden(v.html); // moeilijke woorden krijgen een uitleg
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

// moeilijke woorden ook in de theorie en de voorbeelden
for (const D of [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11]) {
  D.theorie = woorden(D.theorie);
  for (const vb of D.voorbeelden || []) if (vb.html) vb.html = woorden(vb.html);
}

Leerpaden.registreer({
  code: 'rationale-functies-context',
  titel: 'Rationale functies in context',
  ondertitel: 'Wiskunde · 5WW / 5BCW',
  klas: '5BCW',
  drempel: 70,
  allesOpen: true, // alle delen staan open: oefenen en testen mag in elke volgorde (enkel in dit leerpad)
  intro: `<p>Je leert wat de kenmerken van een rationale functie (domein, bereik, beginwaarde, nulwaarde, asymptoten, teken- en verloopschema) <b>betekenen in een echte situatie</b>:
    een geneesmiddel in het bloed, de kost van een uitstap, een babyflesje in de flessenwarmer, de wachttijd aan een loket … Elk deel volgt een hoofdstuk van de werkbundel.</p>
    <p><b>Alle delen staan open.</b> Je kiest zelf welk deel je oefent. Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen (je hebt <b>7 op 10</b> nodig om te slagen).</p>
    <p><b>Grafiekvenster:</b> bij de rekenvragen staat de grafiek al klaar, met de formule erin. Je moet niets overtypen in GeoGebra.
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
