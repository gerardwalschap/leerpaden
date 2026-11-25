// ===================================================================
//  SITUATIES met telkens nieuwe getallen
// ===================================================================
// halfpipe of hangbrugkabel: dalparabool y = a·x², x = afstand tot het midden
function sitHalfpipe() {
  const [a, w] = kies([[0.25, 4], [0.5, 2], [0.125, 4], [0.2, 3]]);
  return { soort: 'halfpipe', a, w, fn: 'h', eenheid: 'm', stap: w <= 3 ? 0.5 : 1, rand: r10(a * w * w),
    tekst: `Dit is de doorsnede van een halfpipe in een skatepark.<br>
      $x$ = de afstand tot het midden (in m). Links van het midden is $x$ negatief, rechts is $x$ positief.<br>
      $h$ = de hoogte boven de bodem (in m).<br>
      De halfpipe is ${kg(2 * w)} m breed. De formule is $${kw('h', 'x', a)}$.`,
    wie: 'een skater', waar: 'staat', hoog: 'hoog' };
}
function sitKabel() {
  const [a, w] = kies([[0.01, 50], [0.02, 40], [0.005, 60], [0.01, 40]]);
  return { soort: 'kabel', a, w, fn: 'y', eenheid: 'm', stap: 10, rand: r10(a * w * w),
    tekst: `De grote kabel van een hangbrug hangt tussen twee pijlers. De pijlers staan ${2 * w} m uit elkaar.<br>
      $x$ = de afstand tot het midden van de brug (in m).<br>
      $y$ = hoe hoog de kabel hangt boven zijn laagste punt (in m).<br>
      De formule is $y = ${aTex(a)}x^2$.`,
    wie: 'de kabel', waar: 'hangt', hoog: 'hoog' };
}
const kiesDal = () => kies([sitHalfpipe, sitKabel])();
const dalGraf = (S, klein) => rgraf({ x: [-S.w, S.w], y: [0, nice(S.rand * 1.1)], xs: S.soort === 'kabel' ? 10 : S.w <= 3 ? 0.5 : 1, xn: 'x (m)', yn: S.soort === 'kabel' ? 'y (m)' : 'h (m)', functies: [{ f: (x) => S.a * x * x }], klein });
const zijde = (x) => x < 0 ? 'links' : 'rechts';
// aantal decimalen van een getal (om "mooie" uitkomsten te kiezen)
const nDec = (v) => { const s = String(r10(Math.abs(v))); return (s.split('.')[1] || '').length; };

// poort: bergparabool y = a·x², y = hoeveel lager dan het hoogste punt
function sitPoort() {
  const [B, H] = kies([[8, 4], [10, 5], [6, 4.5], [12, 9], [8, 6], [10, 6]]);
  const a = r10(-H / ((B / 2) ** 2));
  return { B, H, a, w: B / 2,
    tekst: `Een poort heeft de vorm van een parabool. De poort is ${kg(B)} m breed en ${kg(H)} m hoog.<br>
      $x$ = de afstand tot het midden (in m).<br>
      $y$ = hoeveel de boog lager ligt dan het hoogste punt (in m).<br>
      De formule is $y = ${aTex(a)}x^2$.` };
}
const poortGraf = (P) => rgraf({ x: [-P.w, P.w], y: [-nice(P.H * 1.05), 0], xs: P.w <= 4 ? 0.5 : 1, xn: 'x (m)', yn: 'y (m)', functies: [{ f: (x) => P.a * x * x }] });

// ===================================================================
//  1 · DE HALFPIPE EN DE HANGBRUG: KENMERKEN IN CONTEXT
// ===================================================================
const WOORDENLIJST = `<table class="tabel"><tr><th>Kenmerk</th><th>Wat betekent het wiskundig?</th><th>Wat betekent het in de halfpipe?</th></tr>
  <tr><td>dalparabool / bergparabool</td><td>$a > 0$: opening naar boven · $a < 0$: opening naar onder</td><td>De halfpipe is een dalparabool: de randen liggen hoger dan het midden.</td></tr>
  <tr><td>top (extremum)</td><td>het punt $(0, 0)$: een minimum bij een dalparabool, een maximum bij een bergparabool</td><td>het laagste punt: de bodem, in het midden</td></tr>
  <tr><td>symmetrie t.o.v. de $y$-as</td><td>$f(-x) = f(x)$</td><td>Links en rechts van het midden is de halfpipe even hoog.</td></tr>
  <tr><td>stijgen en dalen</td><td>Waar wordt $f(x)$ groter, waar kleiner?</td><td>Waar rijdt de skater omhoog, waar naar beneden?</td></tr>
  <tr><td>toenemende stijging</td><td>De grafiek wordt steeds steiler.</td><td>Hoe dichter bij de rand, hoe steiler de wand.</td></tr>
  <tr><td>domein in de context</td><td>alle $x$-waarden die zinvol zijn</td><td>van de linkerrand tot de rechterrand</td></tr>
  <tr><td>bereik in de context</td><td>alle $y$-waarden die voorkomen</td><td>van de bodem tot de hoogste rand</td></tr>
  <tr><td>nulwaarde</td><td>de $x$-waarde waarvoor $f(x) = 0$: hier $x = 0$</td><td>In het midden is de hoogte 0 m.</td></tr></table>`;
// x kiezen zodat de hoogte een "mooie" uitkomst heeft (hoogstens 2 decimalen)
function xKies(S) {
  const st = S.stap, n = Math.round(S.w / st);
  let x; do { x = r10(kies([-1, 1]) * rnd(1, n) * st); } while (nDec(S.a * x * x) > 2);
  return x;
}
function vraagHoogte() {
  const S = kiesDal(), x = xKies(S), y = r10(S.a * x * x);
  return { soort: 'hoogte', opdracht: 'Tip: lees eerst af op de grafiek. Reken daarna na met de formule.', html: `${gegeven(S.tekst)}${figuur(dalGraf(S))}${vraag(`Hoe hoog ${S.waar} ${S.wie} op ${kg(Math.abs(x))} m ${zijde(x)} van het midden?`)}`,
    sleutel: S.soort + S.a + x, rapport: `${S.soort}: hoogte op x = ${kg(x)}`, antw: getal(y, { dec: 2, voor: `${S.fn}(${tg(x)}) =`, na: '\\text{ m}' }),
    uitleg: [`${S.fn}(${tg(x)}) = ${tg(S.a)} \\cdot ${x < 0 ? `(${tg(x)})` : tg(x)}^2 = ${tg(S.a)} \\cdot ${tg(x * x)} = ${tg(y)} \\text{ m}`] };
}
function vraagSymmetrie() {
  const S = kiesDal(), k = Math.abs(xKies(S)), y = r10(S.a * k * k);
  return { soort: 'sym', opdracht: 'Tip: je hoeft niet te rekenen. Denk aan een eigenschap van de grafiek.', html: `${gegeven(S.tekst)}<p>Op ${kg(k)} m <b>rechts</b> van het midden is de hoogte ${kg(y)} m.</p>${vraag(`Hoe hoog is het op ${kg(k)} m <b>links</b> van het midden (dus bij $x = ${tg(-k)}$)?`)}`,
    sleutel: S.soort + S.a + k + 's', rapport: `${S.soort}: symmetrie x = ${kg(-k)}`,
    antw: delen([`${S.fn}(${tg(-k)}) =`, getal(y, { dec: 2, voor: '', na: '\\text{ m}' })], ['\\text{Welke eigenschap helpt je?}', zinnen('De grafiek is symmetrisch ten opzichte van de y-as: links en rechts van het midden is de hoogte gelijk.',
      ['Links van het midden is x negatief, dus de hoogte is ook negatief.', 'De grafiek is stijgend: links is de hoogte kleiner.', 'De top ligt links van het midden.'])]),
    uitleg: [`${S.fn}(${tg(-k)}) = ${S.fn}(${tg(k)}) = ${tg(y)} \\text{ m}`, tx('De grafiek is symmetrisch ten opzichte van de y-as.')] };
}
// kenmerken met hun betekenis; g = groep: zinnen uit dezelfde groep lijken te veel op elkaar en zijn nooit samen keuzes
const BETEKENIS = [
  { k: 'het minimum is de top (0, 0)', g: 'laag', halfpipe: 'het laagste punt is de bodem, precies in het midden', kabel: 'in het midden hangt de kabel het laagst' },
  { k: 'dalend op [−{W} ; 0] en stijgend op [0 ; {W}]', g: 'verloop', halfpipe: 'van de linkerrand naar het midden rijd je naar beneden, daarna weer naar boven', kabel: 'van de linkerpijler naar het midden gaat de kabel naar beneden, daarna weer naar boven' },
  { k: 'de stijging is toenemend', g: 'steil', halfpipe: 'hoe dichter bij de rand, hoe steiler de wand', kabel: 'hoe dichter bij een pijler, hoe steiler de kabel' },
  { k: 'de grafiek is symmetrisch ten opzichte van de y-as', g: 'sym', halfpipe: 'links en rechts van het midden is de halfpipe even hoog', kabel: 'links en rechts van het midden hangt de kabel even hoog' },
  { k: 'de nulwaarde is x = 0', g: 'laag', halfpipe: 'in het midden is de hoogte 0 m', kabel: 'in het midden is y = 0 m: daar is het laagste punt' },
  { k: 'het is een dalparabool (a > 0)', g: 'laag', halfpipe: 'de randen liggen hoger dan het midden', kabel: 'bij de pijlers hangt de kabel hoger dan in het midden' },
];
function vraagBetekenis() {
  const S = kiesDal(), i = rnd(0, BETEKENIS.length - 1), b = BETEKENIS[i];
  const kenm = b.k.replace(/\{W\}/g, kg(S.w));
  return { soort: 'betekenis', opdracht: 'Tip: kies de zin die hetzelfde zegt, maar in de taal van de situatie.', html: `${gegeven(S.tekst)}<p>In wiskundetaal: <b>${kenm}</b>.</p>${vraag(`Wat betekent dat ${S.soort === 'kabel' ? 'voor de kabel' : 'in de halfpipe'}?`)}`,
    sleutel: S.soort + i, rapport: `${S.soort}: ${kenm}`, antw: zinnen(zin(b[S.soort]) + '.', BETEKENIS.filter(x => x.g !== b.g).map(x => zin(x[S.soort]) + '.')), uitleg: [tx(`${zin(kenm)}: ${b[S.soort]}.`)] };
}
function vraagDomBereik() {
  const S = kiesDal();
  return { soort: 'domber', opdracht: 'Tip: het domein gaat van rand tot rand. Het bereik gaat van de laagste tot de hoogste waarde.', html: `${gegeven(S.tekst)}${figuur(dalGraf(S))}<p>${S.soort === 'kabel' ? 'De kabel hangt van pijler tot pijler.' : 'De halfpipe loopt van de linkerrand tot de rechterrand.'}</p>${vraag('Wat is het domein en wat is het bereik in deze situatie? Schrijf ze als interval.')}`,
    sleutel: S.soort + S.a + S.w + 'db', rapport: `${S.soort}: domein en bereik`,
    antw: delen(['\\text{domein:}', vz(iv(-S.w, S.w), '\\text{dom} =')], ['\\text{bereik:}', vz(iv(0, S.rand), '\\text{ber} =')]),
    uitleg: [`\\text{domein: van } -${tg(S.w)} \\text{ tot } ${tg(S.w)}: [-${tg(S.w)} ; ${tg(S.w)}]`, `${S.fn}(${tg(S.w)}) = ${tg(S.a)} \\cdot ${tg(S.w * S.w)} = ${tg(S.rand)}: \\text{ bereik } [0 ; ${tg(S.rand)}]`] };
}
function vraagSteilst() {
  const S = sitHalfpipe(), w = S.w, d0 = r10(S.a), d1 = r10(S.a * (w * w - (w - 1) ** 2));
  return { soort: 'steilst', opdracht: 'Tip: bereken de hoogte op beide plaatsen en trek af.', html: `${gegeven(S.tekst)}${vragen('Hoeveel stijgt de hoogte van $x = 0$ tot $x = 1$?', `Hoeveel stijgt de hoogte van $x = ${tg(w - 1)}$ tot $x = ${tg(w)}$?`, 'Waar is de wand het steilst?')}`,
    sleutel: 'st' + S.a + w, rapport: `halfpipe: toename en steilheid`,
    antw: delen(['1. \\text{ van } 0 \\text{ tot } 1:', getal(d0, { dec: 3, voor: '', na: '\\text{ m}' })], [`2. \\text{ van } ${tg(w - 1)} \\text{ tot } ${tg(w)}:`, getal(d1, { dec: 3, voor: '', na: '\\text{ m}' })],
      ['3. \\text{ Waar is de wand het steilst?}', zinnen('Aan de rand: de stijging is toenemend.', ['In het midden: daar is de halfpipe het laagst.', 'Overal even steil: de stijging is gelijkmatig.'])]),
    uitleg: [`h(1) - h(0) = ${tg(d0)}`, `h(${tg(w)}) - h(${tg(w - 1)}) = ${tg(S.a * w * w)} - ${tg(S.a * (w - 1) ** 2)} = ${tg(d1)}`, tx('Aan de rand is de wand het steilst: de stijging is toenemend.')] };
}
// uitbreiding
function vraagWiskDom() {
  const S = kiesDal(), juist = `Wiskundig: ℝ · in de situatie: [−${kg(S.w)} ; ${kg(S.w)}]`;
  return { soort: 'wiskdom', opdracht: 'Tip: welke getallen mag je invullen in de formule? En welke zijn zinvol in de situatie?', html: `${gegeven(S.tekst)}${vraag(`Wat is het wiskundige domein van $${S.fn === 'h' ? kw('h', 'x', S.a) : 'y = ' + aTex(S.a) + 'x^2'}$? En wat is het domein in deze situatie?`)}`,
    sleutel: S.soort + S.w + 'wd', rapport: `${S.soort}: wiskundig domein en context`,
    antw: zinnen(juist, [`Wiskundig: [−${kg(S.w)} ; ${kg(S.w)}] · in de situatie: ℝ`, `Wiskundig: [0 ; +∞[ · in de situatie: [0 ; ${kg(S.w)}]`, `Wiskundig: ℝ · in de situatie: [0 ; ${kg(S.rand)}]`]),
    uitleg: [tx(`In ax² mag je elk reëel getal invullen: het wiskundige domein is ℝ. In de situatie zijn enkel de waarden van rand tot rand zinvol: [−${kg(S.w)} ; ${kg(S.w)}].`)] };
}
function vraagToenameTabel() {
  const S = sitHalfpipe(), xs = [1, 2, 3, 4].filter(x => x <= S.w + 1e-9), t = xs.map(x => r10(S.a * (x * x - (x - 1) ** 2)));
  return { soort: 'toename', opdracht: 'Tip: bereken telkens h(x) en trek de vorige hoogte af.', html: `${gegeven(S.tekst)}${vraag('Hoeveel stijgt de hoogte telkens als $x$ 1 m groter wordt? Is de stijging gelijkmatig of toenemend?')}`,
    sleutel: 'tn' + S.a + S.w, rapport: 'halfpipe: toename per meter',
    antw: delen(...xs.map((x, i) => [`\\text{van } ${x - 1} \\text{ tot } ${x}:`, getal(t[i], { dec: 3, voor: '', na: '\\text{ m}' })]), ['\\text{De stijging is}', zinnen('toenemend: de toename wordt telkens groter.', ['gelijkmatig: de toename blijft gelijk.', 'afnemend: de toename wordt telkens kleiner.'], { lijst: false })]),
    uitleg: [xs.map((x, i) => `+${tg(t[i])}`).join(', \\; '), tx('De toename wordt telkens groter: de stijging is toenemend.')] };
}
const D1 = {
  nr: 1, titel: 'De halfpipe en de hangbrug', kort: 'Aflezen, symmetrie, top, stijgen en dalen, domein en bereik in de situatie.', rekenmachine: true,
  theorie: `${AFSPRAKEN}<div class="kader def"><div class="kader-titel">Van wiskundetaal naar de taal van de situatie</div>
      <p>In dit leerpad zie je functies $f(x) = ax^2$ in echte situaties. Je leest af, je rekent en je legt uit wat een kenmerk betekent in de situatie. <b>Noteer altijd de eenheid.</b>
      Ons voorbeeld is de doorsnede van een halfpipe in een skatepark.</p>${WOORDENLIJST}</div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: de halfpipe $h(x) = 0{,}25x^2$</div>
      ${figuur(rgraf({ x: [-4, 4], y: [0, 5], xs: 1, ys: 1, xn: 'x (m)', yn: 'h (m)', functies: [{ f: (x) => 0.25 * x * x }] }))}
      <ul><li>Op 2 m rechts van het midden: $h(2) = 0{,}25 \\cdot 4 = 1$ m. Op 2 m links ook 1 m: de grafiek is symmetrisch t.o.v. de $y$-as.</li>
      <li>Het laagste punt ligt in het midden: de top $(0, 0)$ is een minimum.</li>
      <li>De halfpipe is 8 m breed en de randen zijn 4 m hoog: domein $[-4 ; 4]$, bereik $[0 ; 4]$.</li>
      <li>Van $x = -4$ tot $x = 0$ rijdt de skater naar beneden (dalend). Van $0$ tot $4$ rijdt hij naar boven (stijgend).</li>
      <li>Van $x = 0$ tot $1$ stijgt de hoogte $0{,}25$ m. Van $3$ tot $4$ stijgt ze al $1{,}75$ m. Aan de rand is de wand het steilst: de stijging is toenemend.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Wiskundig domein en domein in de situatie</div>
      <p>In $f(x) = ax^2$ mag je elk reëel getal invullen: het <b>wiskundige domein</b> is $\\mathbb{R}$. In een situatie zijn alleen de zinvolle waarden het <b>domein in de situatie</b>, bv. van de linkerrand tot de rechterrand.</p></div>`,
  voorbeelden: [
    { html: `${gegeven('Hangbrug: $y = 0{,}01x^2$. De pijlers staan 100 m uit elkaar.')}${vraag('Hoe hoog hangt de kabel boven zijn laagste punt op 20 m van het midden? En bij de pijlers?')}`,
      stappen: ['y = 0{,}01 \\cdot 20^2 = 0{,}01 \\cdot 400 = 4 \\text{ m}', '\\text{De pijlers staan 50 m van het midden: } 0{,}01 \\cdot 2500 = 25 \\text{ m}'] },
    { html: `${gegeven('Hangbrug: $y = 0{,}01x^2$.')}${vraag('Hoe hoog hangt de kabel op 30 m links van het midden? Leg uit zonder te rekenen.')}`,
      stappen: ['\\text{Even hoog als op 30 m rechts: 9 m.}', '\\text{De grafiek is symmetrisch ten opzichte van de } y\\text{-as.}'] },
  ],
  soorten: {
    hoogte: { naam: 'Hoogte aflezen en berekenen', gen: vraagHoogte },
    sym: { naam: 'Symmetrie', gen: vraagSymmetrie },
    betekenis: { naam: 'Wat betekent het kenmerk?', gen: vraagBetekenis },
    domber: { naam: 'Domein en bereik in de situatie', gen: vraagDomBereik },
    steilst: { naam: 'Waar is de wand het steilst?', gen: vraagSteilst },
    wiskdom: { naam: 'Wiskundig domein of domein in de situatie', gen: vraagWiskDom },
    toename: { naam: 'Toename per meter', gen: vraagToenameTabel },
  },
  oefenMix: [['hoogte', 2], ['sym', 1], ['betekenis', 2], ['domber', 1], ['steilst', 1], ['wiskdom', 1], ['toename', 1]],
  test: [['hoogte', 1], ['sym', 1], ['betekenis', 1], ['domber', 1], ['steilst', 1]], testSchudden: true,
};

// ===================================================================
//  2 · HET TERRAS EN DE OPPERVLAKTE VAN EEN VIERKANT
// ===================================================================
const TERRAS = 'Een vierkant terras heeft $n$ tegels aan elke zijde.<br>Het aantal tegels dat je nodig hebt, is $T(n) = n^2$.';
function vraagTegels() {
  const n = rnd(6, 20);
  return { soort: 'tegels', opdracht: 'Tip: vul n in de formule in.', html: `${gegeven(TERRAS)}${vraag(`Hoeveel tegels heb je nodig voor een terras met ${n} tegels aan elke zijde?`)}`, sleutel: 'tg' + n, rapport: `T(${n})`,
    antw: getal(n * n, { voor: `T(${n}) =`, na: '\\text{ tegels}' }), uitleg: [`T(${n}) = ${n}^2 = ${n} \\cdot ${n} = ${n * n}`] };
}
function vraagExtra() {
  const n = rnd(3, 15);
  return { soort: 'extra', opdracht: 'Tip: bereken het aantal tegels voor en na, en trek af.', html: `${gegeven(TERRAS)}<p>Het terras wordt één tegel breder: van ${n} naar ${n + 1} tegels aan elke zijde.</p>${vraag('Hoeveel tegels heb je extra nodig?')}`, sleutel: 'ex' + n, rapport: `extra tegels ${n} → ${n + 1}`,
    antw: getal(2 * n + 1, { voor: '', na: '\\text{ tegels extra}' }), uitleg: [`T(${n + 1}) - T(${n}) = ${(n + 1) ** 2} - ${n * n} = ${2 * n + 1}`, tx('Er komen steeds meer tegels bij: de stijging is toenemend.')] };
}
function vraagJonas() {
  let N; do { N = rnd(20, 200); } while (Number.isInteger(Math.sqrt(N)));
  const n = Math.floor(Math.sqrt(N)), naam = kies(['Jonas', 'Yasmina', 'Ilias', 'Fien', 'Bram']);
  return { soort: 'jonas', opdracht: 'Tip: zoek het grootste kwadraat dat niet groter is dan het aantal tegels.', html: `${gegeven(TERRAS)}<p>${naam} heeft ${N} tegels.</p>${vragen('Hoeveel tegels aan elke zijde kan het vierkante terras maximaal hebben?', `Hoeveel tegels houdt ${naam} dan over?`)}`,
    sleutel: 'jn' + N, rapport: `max terras met ${N} tegels`, antw: delen(['1. \\text{ tegels aan elke zijde:}', getal(n)], ['2. \\text{ over:}', getal(N - n * n, { na: '\\text{ tegels}' })]),
    uitleg: [`${n}^2 = ${n * n} \\leq ${N} \\text{ en } ${n + 1}^2 = ${(n + 1) ** 2} > ${N}`, `\\text{Maximaal } ${n} \\text{ tegels aan elke zijde; over: } ${N} - ${n * n} = ${N - n * n}`] };
}
function vraagDubbel() {
  const n = rnd(3, 12), naam = kies(['Lien', 'Mila', 'Senne', 'Amir']);
  return { soort: 'dubbel', opdracht: 'Tip: bereken het aantal tegels voor beide terrassen.', html: `${gegeven(TERRAS)}<p>${naam} legt een terras met ${2 * n} tegels aan elke zijde. De buurman legt een terras met ${n} tegels aan elke zijde.<br>${naam} zegt: "Mijn terras is dubbel zo breed, dus ik heb dubbel zoveel tegels nodig."</p>${vraag(`Hoeveel keer zoveel tegels heeft ${naam} echt nodig?`)}`,
    sleutel: 'db' + n, rapport: `dubbel zo breed (${n})`, antw: delen([`T(${2 * n}) =`, getal(4 * n * n)], [`T(${n}) =`, getal(n * n)], ['\\text{Hoeveel keer zoveel tegels?}', getal(4, { voor: '', na: '\\text{ keer}' })]),
    uitleg: [`T(${2 * n}) = ${4 * n * n}, \\quad T(${n}) = ${n * n}`, tx(`${naam} heeft 4 keer zoveel tegels nodig, niet 2 keer.`)] };
}
function vraagLosse() {
  const juist = 'Het aantal tegels aan een zijde is een natuurlijk getal (1, 2, 3 …): niet negatief en geen halve tegels. Daarom tekenen we losse punten rechts van de y-as.';
  return { soort: 'losse', opdracht: 'Tip: welke waarden kan n hebben in deze situatie?', html: `${gegeven(TERRAS)}${figuur(rgraf({ x: [-1, 7], y: [0, 40], xs: 1, ys: 5, xn: 'n (tegels aan een zijde)', yn: 'T (tegels)', functies: [{ f: (n) => n * n, van: 1, tot: 6, losse: true }] }))}
    ${vraag('Waarom staan er geen punten links van de $y$-as? En waarom verbinden we de punten niet met een lijn?')}`, sleutel: 'losse', rapport: 'terras: losse punten',
    antw: zinnen(juist, ['Links van de y-as is de grafiek negatief, en een parabool teken je altijd met losse punten.', 'De grafiek is een bergparabool, dus links van de y-as daalt ze onder de x-as.', 'We verbinden de punten niet omdat de stijging toenemend is.']), uitleg: [tx(juist)] };
}
function vraagMeer() {
  return { soort: 'meer', opdracht: 'Tip: kijk hoeveel tegels er telkens bijkomen.', html: `${gegeven(TERRAS)}${tabel('van … naar …', ['1→2', '2→3', '3→4', '4→5', '5→6'], 'extra tegels', ['3', '5', '7', '9', '11'])}${vraag('Komen er telkens evenveel tegels bij, of steeds meer? Wat betekent dat voor de grafiek?')}`,
    sleutel: 'meer' + rnd(1, 3), rapport: 'terras: toenemende stijging',
    antw: zinnen('Er komen steeds meer tegels bij: de stijging is toenemend, de grafiek wordt steeds steiler.', ['Er komen telkens evenveel tegels bij: de grafiek is een rechte.', 'Er komen steeds minder tegels bij: de grafiek wordt steeds vlakker.', 'Er komen steeds meer tegels bij: de grafiek wordt steeds vlakker.']),
    uitleg: [tx('3, 5, 7, 9, 11: telkens 2 meer. De stijging is toenemend.')] };
}
// uitbreiding
function vraagFactorVierkant() {
  const z = rnd(2, 9), k = kies([2, 3, 4]);
  return { soort: 'factorvk', opdracht: 'Tip: bereken de oppervlakte voor en na, en deel.', html: `${gegeven('De oppervlakte $A$ (in cm²) van een vierkant met zijde $z$ (in cm) is $A(z) = z^2$.')}<p>Een vierkant heeft een zijde van ${z} cm. De zijde wordt ${k === 2 ? 'verdubbeld' : k === 3 ? 'verdrievoudigd' : '4 keer zo groot'}.</p>${vragen('Hoe groot is de nieuwe oppervlakte?', 'Hoeveel keer zo groot is de oppervlakte geworden?')}`,
    sleutel: 'fv' + z + k, rapport: `vierkant z = ${z}, factor ${k}`, antw: delen([`1. \\; A(${k * z}) =`, getal(k * k * z * z, { voor: '', na: '\\text{ cm}^2' })], ['2. \\text{ factor:}', getal(k * k, { voor: '', na: '\\text{ keer}' })]),
    uitleg: [`A(${k * z}) = ${k * z}^2 = ${k * k * z * z}, \\quad A(${z}) = ${z * z}`, `A(${k}z) = (${k}z)^2 = ${k * k}z^2 = ${k * k} \\cdot A(z)`] };
}
function vraagRechthoek() {
  const b = rnd(2, 12), s = kies(['waarde', 'breedte']);
  const g = gegeven('Een rechthoek heeft breedte $b$ (in cm) en lengte $2b$.<br>De oppervlakte is $A(b) = 2b^2$.');
  if (s === 'waarde') return { soort: 'rechthoek', opdracht: 'Tip: vul b in de formule in.', html: `${g}${vraag(`Hoe groot is de oppervlakte als de breedte ${b} cm is?`)}`, sleutel: 'rh' + b, rapport: `A(${b}) = 2b²`,
    antw: getal(2 * b * b, { voor: `A(${b}) =`, na: '\\text{ cm}^2' }), uitleg: [`A(${b}) = 2 \\cdot ${b}^2 = 2 \\cdot ${b * b} = ${2 * b * b}`] };
  return { soort: 'rechthoek', opdracht: 'Tip: deel eerst door 2. Zoek dan het getal dat in het kwadraat die uitkomst geeft.', html: `${g}<p>De oppervlakte is ${2 * b * b} cm².</p>${vraag('Hoe breed is de rechthoek?')}`, sleutel: 'rhb' + b, rapport: `2b² = ${2 * b * b}`,
    antw: getal(b, { voor: 'b =', na: '\\text{ cm}' }), uitleg: [`2b^2 = ${2 * b * b} \\Rightarrow b^2 = ${b * b} \\Rightarrow b = ${b} \\text{ (een breedte is positief)}`] };
}
function vraagZijde() {
  const z = rnd(3, 15);
  return { soort: 'zijde', opdracht: 'Tip: welk getal geeft in het kwadraat deze oppervlakte?', html: `${gegeven('De oppervlakte $A$ (in cm²) van een vierkant met zijde $z$ (in cm) is $A(z) = z^2$.')}${vraag(`Hoe lang is de zijde als de oppervlakte ${z * z} cm² is?`)}`, sleutel: 'zd' + z, rapport: `z² = ${z * z}`,
    antw: getal(z, { voor: 'z =', na: '\\text{ cm}' }), uitleg: [`z^2 = ${z * z} \\Rightarrow z = ${z}, \\text{ want } ${z}^2 = ${z * z} \\text{ (een zijde is positief)}`] };
}
const D2 = {
  nr: 2, titel: 'Het terras en het vierkant', kort: 'Kwadraten tellen: tegels, oppervlakte, dubbel zo breed.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een terras met tegels</div>
      <p>Een vierkant terras met $n$ tegels aan elke zijde heeft $T(n) = n^2$ tegels nodig.</p>
      ${tabel('$n$', [1, 2, 3, 4, 5, 6], '$T$', [1, 4, 9, 16, 25, 36])}
      <p>Telkens één tegel breder: $+3, +5, +7, +9, +11$. Er komen <b>steeds meer</b> tegels bij: de stijging is <b>toenemend</b>. De grafiek wordt steeds steiler.</p>
      ${figuur(rgraf({ x: [-1, 7], y: [0, 40], xs: 1, ys: 5, xn: 'n (tegels aan een zijde)', yn: 'T (tegels)', functies: [{ f: (n) => n * n, van: 1, tot: 6, losse: true }] }))}
      <p>Het aantal tegels aan een zijde is een natuurlijk getal: niet negatief en geen halve tegels. Daarom tekenen we <b>losse punten</b> rechts van de $y$-as.</p></div>
    <div class="kader eig"><div class="kader-titel">Dubbel zo breed = vier keer zoveel</div>
      <p>$T(10) = 100$ en $T(5) = 25$: een terras dat dubbel zo breed is, heeft <b>4 keer</b> zoveel tegels nodig, niet 2 keer.</p>
      <p>Bij een vierkant met oppervlakte $A(z) = z^2$ geldt altijd: $A(2z) = (2z)^2 = 4z^2 = 4 \\cdot A(z)$ en $A(3z) = (3z)^2 = 9 \\cdot A(z)$.</p>
      <p>Een rechthoek met breedte $b$ en lengte $2b$ heeft oppervlakte $A(b) = 2b \\cdot b = 2b^2$.</p></div>`,
  voorbeelden: [
    { html: `${gegeven(TERRAS)}<p>Jonas heeft 50 tegels.</p>${vraag('Hoeveel tegels aan elke zijde kan zijn terras maximaal hebben? Hoeveel tegels houdt hij over?')}`,
      stappen: ['7^2 = 49 \\leq 50 \\text{ en } 8^2 = 64 > 50', '\\text{Maximaal 7 tegels aan elke zijde; hij houdt 1 tegel over.}'] },
    { html: `${gegeven('$A(z) = z^2$')}<p>Een vierkant heeft een zijde van 3 cm. De zijde wordt verdubbeld.</p>${vraag('Hoeveel keer zo groot wordt de oppervlakte?')}`,
      stappen: ['A(6) = 36, \\quad A(3) = 9', '36 : 9 = 4: \\text{ de oppervlakte wordt 4 keer zo groot.}'] },
  ],
  soorten: {
    tegels: { naam: 'Aantal tegels', gen: vraagTegels }, extra: { naam: 'Extra tegels', gen: vraagExtra }, jonas: { naam: 'Hoe groot kan het terras?', gen: vraagJonas },
    dubbel: { naam: 'Dubbel zo breed', gen: vraagDubbel }, losse: { naam: 'Losse punten', gen: vraagLosse }, meer: { naam: 'Steeds meer tegels erbij', gen: vraagMeer },
    factorvk: { naam: 'Zijde vergroten: factor', gen: vraagFactorVierkant }, rechthoek: { naam: 'Rechthoek A(b) = 2b²', gen: vraagRechthoek }, zijde: { naam: 'Zijde bij een oppervlakte', gen: vraagZijde },
  },
  oefenMix: [['tegels', 1], ['extra', 1], ['jonas', 1], ['dubbel', 1], ['losse', 1], ['meer', 1], ['factorvk', 1], ['rechthoek', 1], ['zijde', 1]],
  test: [['tegels', 1], ['jonas', 1], ['dubbel', 1], ['losse', 1], ['factorvk', 1]], testSchudden: true,
};

// ===================================================================
//  3 · DE REMWEG
// ===================================================================
// Vuistregel d = 0,01v²; die geldt ook op een nat wegdek. Op een droog wegdek: ongeveer 0,005v².
const VUISTREGEL = 'De vuistregel uit de rijschool: deel de snelheid door 10 en neem het kwadraat.<br>Als formule: $d(v) = 0{,}01v^2$.<br>$v$ = de snelheid (in km/u), $d$ = de remweg (in m).';
const remGraf = () => figuur(rgraf({ x: [0, 130], y: [0, 180], xs: 10, ys: 20, xn: 'v (km/u)', yn: 'd (m)', functies: [{ f: (v) => 0.01 * v * v }] }));
const DROOGNAT = 'Op een <b>droog</b> wegdek remt een auto beter: daar is de remweg ongeveer $d(v) = 0{,}005v^2$.<br>Op een <b>nat</b> wegdek geldt de vuistregel: $d(v) = 0{,}01v^2$.<br>($v$ in km/u, $d$ in m)';
function vraagRemweg() {
  const v = kies([20, 30, 40, 60, 70, 80, 90, 110, 120, 130]);
  return { soort: 'remweg', opdracht: 'Tip: deel de snelheid door 10 en neem het kwadraat.', html: `${gegeven(VUISTREGEL)}${remGraf()}${vraag(`Hoe lang is de remweg bij ${v} km/u?`)}`, sleutel: 'rw' + v, rapport: `d(${v})`,
    antw: getal(0.01 * v * v, { voor: `d(${v}) =`, na: '\\text{ m}' }), uitleg: [`${v} : 10 = ${v / 10} \\text{ en } ${v / 10} \\cdot ${v / 10} = ${r10(0.01 * v * v)} \\text{ m}`] };
}
function vraagSnelheid() {
  const k = rnd(2, 13), d = k * k;
  return { soort: 'snelheid', opdracht: 'Tip: lees af op de grafiek. Controleer met de vuistregel.', html: `${gegeven(VUISTREGEL)}${remGraf()}${vraag(`Bij welke snelheid is de remweg ${d} m?`)}`, sleutel: 'sn' + d, rapport: `d(v) = ${d}`,
    antw: getal(10 * k, { voor: 'v =', na: '\\text{ km/u}' }), uitleg: [`${10 * k} : 10 = ${k} \\text{ en } ${k} \\cdot ${k} = ${d} \\text{ m}`] };
}
function vraagVerschil() {
  const [zone, v2, waar] = kies([[30, kies([40, 50, 60]), 'In de zone 30 aan een school'], [50, kies([60, 70, 80]), 'In het centrum van een stad (zone 50)'], [70, kies([80, 90, 100]), 'Op een gewestweg (70 km/u)'], [120, kies([130, 140, 150]), 'Op de autosnelweg (120 km/u)']]);
  return { soort: 'verschil', opdracht: 'Tip: bereken beide remwegen en trek af.', html: `${gegeven(VUISTREGEL)}<p>${waar} rijdt een auto ${v2} km/u.</p>${vraag(`Hoeveel meter langer is zijn remweg dan bij ${zone} km/u?`)}`, sleutel: 'vs' + zone + v2, rapport: `d(${v2}) − d(${zone})`,
    antw: getal(0.01 * (v2 * v2 - zone * zone), { voor: '', na: '\\text{ m langer}' }), uitleg: [`d(${v2}) - d(${zone}) = ${r10(0.01 * v2 * v2)} - ${r10(0.01 * zone * zone)} = ${r10(0.01 * (v2 * v2 - zone * zone))} \\text{ m}`] };
}
function vraagDubbelSnel() {
  const v = kies([20, 30, 40, 50, 60]);
  return { soort: 'dubbelsnel', opdracht: 'Tip: bereken beide remwegen en deel.', html: `${gegeven(VUISTREGEL)}${vraag(`Hoeveel keer zo lang is de remweg bij ${2 * v} km/u als bij ${v} km/u?`)}`, sleutel: 'ds' + v, rapport: `d(${2 * v}) : d(${v})`,
    antw: delen([`d(${v}) =`, getal(0.01 * v * v, { voor: '', na: '\\text{ m}' })], [`d(${2 * v}) =`, getal(0.04 * v * v, { voor: '', na: '\\text{ m}' })], ['\\text{Hoeveel keer zo lang?}', getal(4, { voor: '', na: '\\text{ keer}' })]),
    uitleg: [`${r10(0.04 * v * v)} : ${r10(0.01 * v * v)} = 4`, tx('Rijd je dubbel zo snel, dan wordt je remweg 4 keer zo lang.')] };
}
function vraagNulRem() {
  return { soort: 'nulrem', opdracht: 'Tip: vul v = 0 in. Denk aan wat een snelheid in het echt kan zijn.', html: `${gegeven(VUISTREGEL)}${vraag('Hoe lang is de remweg bij 0 km/u? En waarom vul je geen negatieve snelheden in?')}`, sleutel: 'nr' + rnd(1, 3), rapport: 'remweg bij v = 0',
    antw: zinnen('d(0) = 0 m: een auto die stilstaat, heeft geen remweg (de nulwaarde). Een snelheid op de teller is nooit negatief, dus enkel v ≥ 0 is zinvol.',
      ['d(0) = 0,01 m: elke auto heeft een kleine remweg. Negatieve snelheden geven een negatieve remweg.', 'd(0) bestaat niet, want je kan niet delen door 0.', 'd(0) = 0 m. Negatieve snelheden mag je wel invullen: dan rijdt de auto achteruit.']),
    uitleg: [tx('d(0) = 0: v = 0 is de nulwaarde. Enkel v ≥ 0 is zinvol.')] };
}
// uitbreiding
function vraagDroog() {
  const v = kies([30, 50, 70, 90, 120, 60, 80, 100]);
  return { soort: 'droog', opdracht: 'Tip: gebruik de formule voor een droog wegdek.', html: `${gegeven(DROOGNAT)}${vraag(`Hoe lang is de remweg bij ${v} km/u op een droog wegdek?`)}`,
    sleutel: 'dr' + v, rapport: `0,005·${v}²`, antw: getal(0.005 * v * v, { dec: 1, voor: `d(${v}) =`, na: '\\text{ m}' }), uitleg: [`d(${v}) = 0{,}005 \\cdot ${v * v} = ${tg(0.005 * v * v)} \\text{ m}`] };
}
function vraagNat() {
  const v = kies([30, 50, 70, 90, 120]);
  return { soort: 'nat', opdracht: 'Tip: bereken de remweg op het natte wegdek en vergelijk met het droge.', html: `${gegeven(DROOGNAT)}${vragen(`Hoe lang is de remweg bij ${v} km/u op een nat wegdek?`, 'Hoeveel keer zo lang is dat als op een droog wegdek?')}`,
    sleutel: 'nt' + v, rapport: `nat vs droog ${v}`, antw: delen(['1. \\text{ nat:}', getal(0.01 * v * v, { dec: 1, voor: '', na: '\\text{ m}' })], ['2. \\text{ Hoeveel keer zo lang?}', getal(2, { voor: '', na: '\\text{ keer}' })]),
    uitleg: [`0{,}01 \\cdot ${v * v} = ${tg(0.01 * v * v)} \\text{ m}`, '0{,}01 = 2 \\cdot 0{,}005, \\text{ dus } 0{,}01v^2 = 2 \\cdot 0{,}005v^2: \\text{ 2 keer zo lang}'] };
}
function vraagFietser() {
  const v = kies([5, 10, 15]), k = kies([2, 3].filter(f => f * v <= 30));
  return { soort: 'fietser', opdracht: 'Tip: bereken beide remafstanden en deel.', html: `${gegeven('De remafstand van een fietser is ongeveer $d(v) = 0{,}015v^2$.<br>($d$ in m, $v$ in km/u)')}${vragen(`Hoe lang is de remafstand bij ${v} km/u?`, `Hoe lang is de remafstand bij ${k * v} km/u?`, 'Hoeveel keer zo groot is de remafstand geworden?')}`,
    sleutel: 'fs' + v + k, rapport: `fietser ${v} en ${k * v} km/u`,
    antw: delen([`1. \\; d(${v}) =`, getal(0.015 * v * v, { dec: 3, voor: '', na: '\\text{ m}' })], [`2. \\; d(${k * v}) =`, getal(0.015 * k * k * v * v, { dec: 3, voor: '', na: '\\text{ m}' })], ['3. \\text{ factor:}', getal(k * k, { voor: '', na: '\\text{ keer}' })]),
    uitleg: [`d(${v}) = 0{,}015 \\cdot ${v * v} = ${tg(0.015 * v * v)}, \\quad d(${k * v}) = 0{,}015 \\cdot ${k * k * v * v} = ${tg(0.015 * k * k * v * v)}`, `\\text{De snelheid wordt ${k === 2 ? 'verdubbeld' : 'verdrievoudigd'}: } d(${k}v) = ${k * k} \\cdot d(v)`] };
}
const D3 = {
  nr: 3, titel: 'De remweg', kort: 'De vuistregel d(v) = 0,01v², droog en nat wegdek, de fietser.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">De vuistregel voor de remweg</div>
      <p>In de rijschool leer je een vuistregel voor de remweg: <b>deel de snelheid door 10 en neem het kwadraat</b>. Bij 50 km/u is de remweg dus $5 \\cdot 5 = 25$ m.
      Als formule: $d(v) = 0{,}01v^2$. Hier is $v$ de snelheid (in km/u) en $d$ de remweg (in m).</p>
      ${tabel('$v$ (km/u)', [10, 20, 30, 50, 70, 100], '$d$ (m)', [1, 4, 9, 25, 49, 100])}${remGraf()}</div>
    <div class="kader eig"><div class="kader-titel">Dubbel zo snel = vier keer zo lang</div>
      <p>30 km/u → 9 m en 60 km/u → 36 m: 4 keer zo lang. Altijd geldt: $d(2v) = k \\cdot (2v)^2 = 4 \\cdot kv^2 = 4 \\cdot d(v)$. Drie keer zo snel: $d(3v) = 9 \\cdot d(v)$.</p>
      <p>$d(0) = 0$: een auto die stilstaat, heeft geen remweg ($v = 0$ is de nulwaarde). Negatieve snelheden hebben geen zin.</p></div>
    <div class="kader"><div class="kader-titel">Droog en nat wegdek</div>
      <p>De vuistregel is veilig: hij klopt ook op een <b>nat</b> wegdek. Op een <b>droog</b> wegdek remt een auto beter. Daar is de remweg ongeveer de helft: $d(v) = 0{,}005v^2$.</p>
      <p>Omdat $0{,}01 = 2 \\cdot 0{,}005$, is de remweg op een nat wegdek 2 keer zo lang. Die parabool is smaller (steiler).</p></div>`,
  voorbeelden: [
    { html: `${gegeven(VUISTREGEL)}${vraag('Bij welke snelheid is de remweg 36 m?')}`, stappen: ['6 \\cdot 6 = 36, \\text{ dus } v : 10 = 6', 'v = 60 \\text{ km/u}'] },
    { html: `${gegeven('Fietser: $d(v) = 0{,}015v^2$.')}${vraag('Hoe lang is de remafstand bij 10 km/u en bij 20 km/u?')}`, stappen: ['d(10) = 0{,}015 \\cdot 100 = 1{,}5 \\text{ m}', 'd(20) = 0{,}015 \\cdot 400 = 6 \\text{ m}: \\text{ 4 keer zo groot, want de snelheid verdubbelt}'] },
  ],
  soorten: {
    remweg: { naam: 'Remweg berekenen', gen: vraagRemweg }, snelheid: { naam: 'Snelheid bij een remweg', gen: vraagSnelheid }, verschil: { naam: 'Hoeveel langer?', gen: vraagVerschil },
    dubbelsnel: { naam: 'Dubbel zo snel', gen: vraagDubbelSnel }, nulrem: { naam: 'Remweg bij 0 km/u', gen: vraagNulRem },
    droog: { naam: 'Droog wegdek d(v) = 0,005v²', gen: vraagDroog }, nat: { naam: 'Nat en droog wegdek', gen: vraagNat }, fietser: { naam: 'De fietser', gen: vraagFietser },
  },
  oefenMix: [['remweg', 2], ['snelheid', 1], ['verschil', 1], ['dubbelsnel', 1], ['nulrem', 1], ['droog', 1], ['nat', 1], ['fietser', 1]],
  test: [['remweg', 1], ['snelheid', 1], ['verschil', 1], ['dubbelsnel', 1], ['nat', 1]], testSchudden: true,
};

// ===================================================================
//  4 · VALLEN: DE VRIJEVALTOREN EN DE STEEN
// ===================================================================
// torens van minstens 60 m vallen 3 s, lagere torens 2 s (genoeg ruimte om af te remmen)
function sitToren() { const H = kies([50, 55, 60, 65, 70, 80]), T = H >= 60 ? 3 : 2; return { H, T,
  tekst: `In een pretpark staat een vrijevaltoren van ${H} m hoog. Het bakje start bovenaan en valt ${T} seconden vrij naar beneden. Daarna wordt het afgeremd.<br>
    $t$ = de tijd (in s).<br>$h$ = de plaats van het bakje ten opzichte van het startpunt (in m). Een negatief getal betekent: onder het startpunt.<br>
    De formule is $h(t) = -5t^2$.` }; }
function vraagToren() {
  const S = sitToren(), t = kies([1, 2, 1.5, 0.5, 2.5, 3].filter(x => x <= S.T));
  return { soort: 'toren', opdracht: 'Tip: vul t in de formule in. Het antwoord is negatief.', html: `${gegeven(S.tekst)}${vraag(`Bereken $h(${tg(t)})$. Hoeveel meter onder het startpunt zit het bakje dan?`)}`, sleutel: 'to' + S.H + t, rapport: `h(${kg(t)}) = −5t²`,
    antw: getal(-5 * t * t, { dec: 2, voor: `h(${tg(t)}) =`, na: '\\text{ m}' }), uitleg: [`h(${tg(t)}) = -5 \\cdot ${tg(t * t)} = ${tg(-5 * t * t)}`, tx(`Na ${kg(t)} s zit het bakje ${kg(5 * t * t)} m onder het startpunt.`)] };
}
function vraagSeconde() {
  const S = sitToren(), n = rnd(1, S.T);
  return { soort: 'seconde', opdracht: 'Tip: bereken h aan het begin en aan het einde van die seconde, en trek af.', html: `${gegeven(S.tekst)}${vraag(`Hoeveel meter valt het bakje tijdens de ${n === 1 ? '1ste' : n + 'de'} seconde (van $t = ${n - 1}$ tot $t = ${n}$)?`)}`, sleutel: 'sc' + n + S.H, rapport: `gevallen in seconde ${n}`,
    antw: getal(5 * (2 * n - 1), { voor: '', na: '\\text{ m}' }), uitleg: [`h(${n - 1}) - h(${n}) = ${-5 * (n - 1) ** 2} - (${-5 * n * n}) = ${5 * (2 * n - 1)} \\text{ m}`, tx('Elke seconde valt het bakje meer meter: het gaat steeds sneller.')] };
}
function vraagBovenGrond() {
  const S = sitToren(), t = kies([1, 2, 3, 1.5, 2.5].filter(x => x <= S.T));
  return { soort: 'grond', opdracht: 'Tip: bereken eerst hoeveel meter het bakje onder het startpunt zit. Trek dat af van de hoogte van de toren.', html: `${gegeven(S.tekst)}${vraag(`Hoe hoog boven de grond zit het bakje na ${kg(t)} ${t === 1 ? 'seconde' : 'seconden'}?`)}`, sleutel: 'gr' + S.H + t, rapport: `hoogte boven grond na ${kg(t)} s`,
    antw: getal(S.H - 5 * t * t, { dec: 2, voor: '', na: '\\text{ m boven de grond}' }), uitleg: [`h(${tg(t)}) = ${tg(-5 * t * t)}: \\text{ ${tg(5 * t * t)} m onder het startpunt}`, `${S.H} - ${tg(5 * t * t)} = ${tg(S.H - 5 * t * t)} \\text{ m}`] };
}
function vraagBergDal() {
  const S = sitToren();
  return { soort: 'bergdal', opdracht: 'Tip: kijk naar het teken van a.', html: `${gegeven(S.tekst)}${vraag('Is de grafiek een stuk van een dalparabool of van een bergparabool? En wat betekent een negatieve waarde van $h$?')}`, sleutel: 'bd' + S.H, rapport: 'vrijevaltoren: berg of dal',
    antw: zinnen('Een bergparabool, want a = −5 < 0. Negatief betekent onder het startpunt, niet onder de grond.',
      ['Een dalparabool, want het bakje gaat naar beneden. Negatief betekent onder de grond.', 'Een bergparabool, want a = −5 < 0. Negatief betekent dat het bakje onder de grond zakt.', 'Een dalparabool, want a = 5 > 0. Negatief betekent onder het startpunt.']),
    uitleg: [tx('a = −5 < 0: een bergparabool. Een negatieve waarde betekent: onder het startpunt.')] };
}
function vraagTorenDom() {
  const S = sitToren(), lo = -5 * S.T * S.T;
  return { soort: 'torendom', opdracht: 'Tip: het domein is de tijd van de vrije val. Het bereik zijn de waarden van h in die tijd.', html: `${gegeven(S.tekst)}${vraag('Wat is het domein en wat is het bereik in deze situatie? Schrijf ze als interval.')}`, sleutel: 'tdb' + S.H + S.T, rapport: 'vrijevaltoren: domein en bereik',
    antw: delen(['\\text{domein:}', vz(iv(0, S.T), '\\text{dom} =')], ['\\text{bereik:}', vz(iv(lo, 0), '\\text{ber} =')]),
    uitleg: [`\\text{domein } [0 ; ${S.T}]: \\text{ de ${S.T} seconden vrije val}`, `h(${S.T}) = ${lo}: \\text{ bereik } [${lo} ; 0]`, tx('Het maximum ligt in de top (0, 0): bij de start zit het bakje op zijn hoogste punt.')] };
}
// uitbreiding
const STEEN = 'Een steen valt van een brug.<br>De valafstand $s$ (in m) na $t$ seconden is $s(t) = 4{,}9t^2$.';
function vraagSteen() {
  const t = kies([1, 2, 3, 4, 1.5, 2.5]);
  return { soort: 'steen', opdracht: 'Tip: vul t in de formule in.', html: `${gegeven(STEEN)}${vraag(`Hoeveel meter is de steen gevallen na ${kg(t)} ${t === 1 ? 'seconde' : 'seconden'}?`)}`, sleutel: 'st' + t, rapport: `s(${kg(t)})`,
    antw: getal(4.9 * t * t, { dec: 2, voor: `s(${tg(t)}) =`, na: '\\text{ m}' }), uitleg: [`s(${tg(t)}) = 4{,}9 \\cdot ${tg(t * t)} = ${tg(4.9 * t * t)} \\text{ m}`] };
}
function vraagSteenDubbel() {
  const t = kies([1, 2]), s = r10(4.9 * t * t);
  return { soort: 'steendubbel', opdracht: 'Tip: de tijd wordt dubbel zo lang. Wat gebeurt er dan met een kwadraat?', html: `${gegeven(STEEN)}<p>Na ${kg(t)} ${t === 1 ? 'seconde' : 'seconden'} is de steen ${kg(s)} m gevallen.</p>${vraag(`Hoeveel meter is de steen gevallen na ${kg(2 * t)} seconden?`)}`, sleutel: 'sd' + t, rapport: `s(${kg(2 * t)}) uit s(${kg(t)})`,
    antw: getal(4 * s, { dec: 2, voor: `s(${tg(2 * t)}) =`, na: '\\text{ m}' }), uitleg: [tx('De tijd verdubbelt, dus de valafstand wordt 4 keer zo groot.'), `4 \\cdot ${tg(s)} = ${tg(4 * s)} \\text{ m}`] };
}
function vraagSteenSeconde() {
  const n = rnd(1, 4);
  return { soort: 'steensec', opdracht: 'Tip: bereken s aan het einde en aan het begin van die seconde, en trek af.', html: `${gegeven(STEEN)}${vraag(`Hoeveel meter valt de steen tijdens de ${n === 1 ? '1ste' : n + 'de'} seconde?`)}`, sleutel: 'ss' + n, rapport: `steen: seconde ${n}`,
    antw: getal(4.9 * (2 * n - 1), { dec: 2, voor: '', na: '\\text{ m}' }), uitleg: [`s(${n}) - s(${n - 1}) = ${tg(4.9 * n * n)} - ${tg(4.9 * (n - 1) ** 2)} = ${tg(4.9 * (2 * n - 1))} \\text{ m}`, tx('De steen valt elke seconde 9,8 m meer: de stijging is toenemend.')] };
}
const D4 = {
  nr: 4, titel: 'Vallen: de vrijevaltoren en de steen', kort: 'h(t) = −5t² en s(t) = 4,9t²: steeds sneller naar beneden.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">De vrijevaltoren</div>
      <p>Een bakje valt vanaf de top van een toren van 60 m. De plaats ten opzichte van het startpunt is $h(t) = -5t^2$ ($t$ in s, $h$ in m). Een <b>negatief</b> getal betekent: <b>onder het startpunt</b>, niet onder de grond.</p>
      ${tabel('$t$ (s)', [0, 1, 2, 3], '$h$ (m)', [0, '−5', '−20', '−45'])}
      ${figuur(rgraf({ x: [0, 3], y: [-50, 0], xs: 0.5, ys: 10, xn: 't (s)', yn: 'h (m)', functies: [{ f: (t) => -5 * t * t }] }))}
      <ul><li>$a = -5 < 0$: een stuk van een <b>bergparabool</b>. Het maximum ligt in de top $(0, 0)$: bij de start.</li>
      <li>Tijdens de 1ste, 2de en 3de seconde valt het bakje 5 m, 15 m en 25 m: elke seconde meer (het gaat steeds sneller).</li>
      <li>Na 3 s zit het bakje 45 m onder het startpunt, dus $60 - 45 = 15$ m boven de grond.</li>
      <li>Domein $[0 ; 3]$, bereik $[-45 ; 0]$.</li></ul></div>
    <div class="kader"><div class="kader-titel">Een vallende steen</div>
      <p>De valafstand van een steen is $s(t) = 4{,}9t^2$ ($s$ in m, $t$ in s). Na 2 s is hij 19,6 m gevallen. Na 4 s (dubbel zo lang) is dat $4 \\cdot 19{,}6 = 78{,}4$ m. Elke seconde valt hij 9,8 m meer dan de seconde ervoor.</p></div>`,
  voorbeelden: [
    { html: `${gegeven('Vrijevaltoren van 60 m: $h(t) = -5t^2$.')}${vraag('Hoe hoog boven de grond zit het bakje na 2 s?')}`, stappen: ['h(2) = -5 \\cdot 4 = -20: \\text{ 20 m onder het startpunt}', '60 - 20 = 40 \\text{ m boven de grond}'] },
    { html: `${gegeven(STEEN)}${vraag('Hoeveel meter valt de steen tijdens de 3de seconde?')}`, stappen: ['s(3) - s(2) = 44{,}1 - 19{,}6 = 24{,}5 \\text{ m}'] },
  ],
  soorten: {
    toren: { naam: 'Plaats h(t)', gen: vraagToren }, seconde: { naam: 'Gevallen per seconde', gen: vraagSeconde }, grond: { naam: 'Hoogte boven de grond', gen: vraagBovenGrond },
    bergdal: { naam: 'Bergparabool en minteken', gen: vraagBergDal }, torendom: { naam: 'Domein en bereik', gen: vraagTorenDom },
    steen: { naam: 'Vallende steen', gen: vraagSteen }, steendubbel: { naam: 'Steen: dubbel zo lang', gen: vraagSteenDubbel }, steensec: { naam: 'Steen: per seconde', gen: vraagSteenSeconde },
  },
  oefenMix: [['toren', 1], ['seconde', 1], ['grond', 1], ['bergdal', 1], ['torendom', 1], ['steen', 1], ['steendubbel', 1], ['steensec', 1]],
  test: [['toren', 1], ['seconde', 1], ['grond', 1], ['bergdal', 1], ['steen', 1]], testSchudden: true,
};

// ===================================================================
//  5 · DE BOOG VAN EEN POORT
// ===================================================================
function vraagLager() {
  let P, x, y;
  do { P = sitPoort(); x = r10(kies([-1, 1]) * kies([1, 2, 0.5, 1.5, 3, 4].filter(v => v < P.w))); y = r10(P.a * x * x); } while (nDec(y) > 2);
  return { soort: 'lager', opdracht: 'Tip: vul x in de formule in. Trek daarna af van de hoogte van de poort.', html: `${gegeven(P.tekst)}${figuur(poortGraf(P))}${vragen(`Hoeveel ligt de boog lager dan het hoogste punt, op ${kg(Math.abs(x))} m van het midden?`, 'Hoe hoog is de boog daar boven de grond?')}`,
    sleutel: 'lg' + P.B + P.H + x, rapport: `poort: x = ${kg(x)}`, antw: delen(['1. \\text{ lager dan het hoogste punt:}', getal(-y, { dec: 2, voor: '', na: '\\text{ m}' })], ['2. \\text{ boven de grond:}', getal(P.H + y, { dec: 2, voor: '', na: '\\text{ m}' })]),
    uitleg: [`y = ${tg(P.a)} \\cdot ${tg(x * x)} = ${tg(y)}: \\text{ ${tg(-y)} m lager}`, `${tg(P.H)} - ${tg(-y)} = ${tg(P.H + y)} \\text{ m boven de grond}`] };
}
// echte voertuigen: [naam, breedte, hoogte]
const VOERTUIGEN = [['Een personenwagen', 1.8, 1.5], ['Een busje', 2, 2.5], ['Een bestelwagen', 2, 2.8], ['Een camper', 2.3, 3], ['Een bus', 2.5, 3.2],
  ['Een vrachtwagen', 2.5, 4], ['Een tractor met een kar hooi', 2.5, 3.5], ['Een verhuiswagen', 2.4, 3.6], ['Een kraanwagen', 2.5, 3.8]];
function vraagPast() {
  const wil = kies([true, false]); // de helft van de keren past het, de helft niet
  let P, V, boog, n = 0;
  do { P = sitPoort(); V = kies(VOERTUIGEN); boog = r10(P.H + P.a * (V[1] / 2) ** 2); n++; }
  while (n < 2000 && (V[2] >= P.H || Math.abs(boog - V[2]) < 0.1 || (boog > V[2]) !== wil));
  const [wat, bw, hv] = V, past = boog > hv;
  return { soort: 'past', opdracht: 'Tip: deel de breedte van het voertuig door 2. Op die afstand van het midden zitten zijn randen. Bereken daar de hoogte van de boog.', html: `${gegeven(P.tekst)}<p>${wat} is ${kg(bw)} m breed en ${kg(hv)} m hoog. Het voertuig rijdt precies door het midden van de poort.</p>${vragen(`Hoe hoog is de boog boven de randen van het voertuig (op ${kg(bw / 2)} m van het midden)?`, 'Past het voertuig door de poort?')}`,
    sleutel: 'ps' + P.B + bw + hv, rapport: `poort ${P.B}×${P.H}: ${kg(bw)} m breed, ${kg(hv)} m hoog`,
    antw: delen(['1. \\text{ hoogte van de boog boven de randen:}', getal(boog, { dec: 2, voor: '', na: '\\text{ m}' })], ['2. \\text{ Past het?}', jaNee(past, 'het past', 'het past niet')]),
    uitleg: [`y = ${tg(P.a)} \\cdot ${tg((bw / 2) ** 2)} = ${tg(P.a * (bw / 2) ** 2)} \\Rightarrow ${tg(P.H)} - ${tg(-P.a * (bw / 2) ** 2)} = ${tg(boog)} \\text{ m}`, tx(`${kg(boog)} m ${past ? '>' : '<'} ${kg(hv)} m: het past${past ? '' : ' niet'}.`)] };
}
function vraagSpiegel() {
  const P = sitPoort(), a = -P.a;
  return { soort: 'spiegel', opdracht: 'Tip: vergelijk de getallen voor x².', html: `${gegeven(P.tekst)}<p>Een halfpipe heeft de formule $h = ${aTex(a)}x^2$.</p>${vraag(`Wat merk je op als je de grafiek van de poort ($y = ${aTex(P.a)}x^2$) vergelijkt met die van de halfpipe?`)}`, sleutel: 'sp' + P.a, rapport: 'poort en halfpipe vergelijken',
    antw: zinnen('Enkel het teken van a verschilt: de grafieken zijn elkaars spiegelbeeld ten opzichte van de x-as. De poort is een bergparabool, de halfpipe een dalparabool.',
      ['De grafieken zijn dezelfde: het getal voor x² is even groot.', 'De poort is breder dan de halfpipe, want a is negatief.', 'De grafieken zijn elkaars spiegelbeeld ten opzichte van de y-as.']),
    uitleg: [tx(`${kg(P.a)} en ${kg(a)}: enkel het teken verschilt. Ze zijn elkaars spiegelbeeld ten opzichte van de x-as.`)] };
}
function vraagPoortDom() {
  const P = sitPoort();
  return { soort: 'poortdom', opdracht: 'Tip: het domein gaat van rand tot rand. Aan de rand ligt de boog het laagst.', html: `${gegeven(P.tekst)}${figuur(poortGraf(P))}${vraag('Wat is het domein en wat is het bereik in deze situatie? Schrijf ze als interval.')}`, sleutel: 'pd' + P.B + P.H, rapport: 'poort: domein en bereik',
    antw: delen(['\\text{domein:}', vz(iv(-P.w, P.w), '\\text{dom} =')], ['\\text{bereik:}', vz(iv(-P.H, 0), '\\text{ber} =')]),
    uitleg: [`\\text{van rand tot rand: } [-${tg(P.w)} ; ${tg(P.w)}]`, `\\text{aan de rand ligt de boog } ${tg(P.H)} \\text{ m lager: bereik } [-${tg(P.H)} ; 0]`] };
}
const D5 = {
  nr: 5, titel: 'De boog van een poort', kort: 'Een bergparabool: hoeveel lager dan de top? Past het voertuig?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">De boog van een poort</div>
      <p>Een poort heeft de vorm van een parabool. Ze is 8 m breed en 4 m hoog. $x$ is de afstand tot het midden (in m). $y$ zegt hoeveel de boog <b>lager</b> ligt dan het hoogste punt (in m): $y = -0{,}25x^2$.</p>
      ${figuur(rgraf({ x: [-4, 4], y: [-5, 0], xs: 1, ys: 1, xn: 'x (m)', yn: 'y (m)', functies: [{ f: (x) => -0.25 * x * x }] }))}
      <ul><li>Op 2 m van het midden: $y = -0{,}25 \\cdot 4 = -1$, dus 1 m lager dan het hoogste punt. Boven de grond: $4 - 1 = 3$ m.</li>
      <li>Een busje van 2 m breed en 2,5 m hoog: de randen zitten op 1 m van het midden. Daar is de boog $4 - 0{,}25 = 3{,}75$ m hoog. Het busje past.</li>
      <li>Een camper van 2,3 m breed en 3 m hoog: de randen zitten op 1,15 m van het midden. Daar is de boog $4 - 0{,}25 \\cdot 1{,}3225 \\approx 3{,}67$ m hoog. De camper past.</li>
      <li>De halfpipe $h = 0{,}25x^2$ en de poort $y = -0{,}25x^2$ verschillen enkel in het teken van $a$: ze zijn elkaars spiegelbeeld t.o.v. de $x$-as.</li></ul></div>`,
  voorbeelden: [
    { html: `${gegeven('Poort van 10 m breed en 5 m hoog: $y = -0{,}2x^2$.')}${vraag('Hoe hoog is de boog boven de grond op 3 m van het midden?')}`, stappen: ['y = -0{,}2 \\cdot 9 = -1{,}8: \\text{ 1,8 m lager dan de top}', '5 - 1{,}8 = 3{,}2 \\text{ m}'] },
  ],
  soorten: {
    lager: { naam: 'Hoeveel lager? Hoe hoog?', gen: vraagLager }, past: { naam: 'Past het voertuig?', gen: vraagPast },
    spiegel: { naam: 'Poort en halfpipe vergelijken', gen: vraagSpiegel }, poortdom: { naam: 'Domein en bereik', gen: vraagPoortDom },
  },
  oefenMix: [['lager', 2], ['past', 2], ['spiegel', 1], ['poortdom', 1]],
  test: [['lager', 2], ['past', 2], ['poortdom', 1]], testSchudden: true,
};

// ===================================================================
//  6 · KOPPELEN EN VERGELIJKEN
// ===================================================================
function vierSituaties() {
  const k = kies([0.25, 0.2, 0.5]), K = kies([2, 3, 1.5]);
  return [
    { s: 'de doorsnede van een brede, ondiepe halfpipe voor beginners', a: k },
    { s: 'de doorsnede van een smalle, diepe kom', a: K },
    { s: 'een brede, lage boog boven een fietspad (hoeveel lager dan de top)', a: -k },
    { s: 'een smalle, spitse boog van een kerkraam (hoeveel lager dan de top)', a: -K },
  ];
}
const vTex = (a) => `y = ${aTex(a)}x^2`;
const pGraf = (a) => rgraf({ x: [-4, 4], y: [-6, 6], xs: 1, ys: 2, functies: [{ f: (x) => a * x * x }], klein: true, breed: 230, hoog: 200 });
function vraagSitVoor() {
  const L = vierSituaties(), i = rnd(0, 3), s = L[i];
  return { soort: 'sitvoor', opdracht: 'Tip: dal of berg? Dat zegt het teken van a. Breed of smal? Dat zegt de grootte van a.', html: `<p>Situatie: <b>${s.s}</b>.</p>${vraag('Welke formule hoort bij deze situatie?')}`, sleutel: 'sv' + i + s.a,
    rapport: `situatie → voorschrift (${s.s})`, antw: texKeuze(vTex(s.a), L.filter((_, j) => j !== i).map(x => vTex(x.a))),
    uitleg: [tx(`${s.a > 0 ? 'Een dalparabool (a > 0)' : 'Een bergparabool (a < 0)'}; ${Math.abs(s.a) >= 1.5 ? 'smal: a ligt ver van 0' : 'breed: a ligt dicht bij 0'}.`), vTex(s.a)] };
}
function vraagGrafVoor() {
  const L = vierSituaties(), i = rnd(0, 3);
  return { soort: 'grafvoor', opdracht: 'Tip: alle grafieken staan op dezelfde schaal. Dal of berg? Breed of smal?', html: `${figuur(pGraf(L[i].a))}${vraag('Welke formule hoort bij deze grafiek?')}`, sleutel: 'gv' + L[i].a, rapport: `grafiek → voorschrift ${kg(L[i].a)}`,
    antw: texKeuze(vTex(L[i].a), L.filter((_, j) => j !== i).map(x => vTex(x.a))), uitleg: [tx(`${L[i].a > 0 ? 'Dalparabool' : 'Bergparabool'}, ${Math.abs(L[i].a) >= 1.5 ? 'smal' : 'breed'}.`), vTex(L[i].a)] };
}
function vraagBreedst() {
  const A = sitHalfpipe(), B = sitKabel(), x = Math.min(4, A.w);
  return { soort: 'breedst', opdracht: 'Tip: hoe dichter a bij 0 ligt, hoe breder de parabool.', html: `<p>De kabel van een hangbrug: $y = ${aTex(B.a)}x^2$.<br>Een halfpipe: $h = ${aTex(A.a)}x^2$.</p>${vragen('Welke parabool is het breedst?', `Hoe hoog is de kabel op ${x} m van het midden?`, `Hoe hoog is de halfpipe op ${x} m van het midden?`)}`,
    sleutel: 'br' + A.a + B.a, rapport: 'kabel en halfpipe vergelijken',
    antw: delen(['1. \\text{ breedste parabool:}', zinnen(`de kabel: hoe kleiner a (dichter bij 0), hoe breder de parabool`, ['de halfpipe: hoe groter a, hoe breder de parabool', 'ze zijn even breed: het zijn allebei dalparabolen'], { lijst: true })],
      [`2. \\text{ kabel op ${x} m:}`, getal(B.a * x * x, { dec: 3, voor: '', na: '\\text{ m}' })], [`3. \\text{ halfpipe op ${x} m:}`, getal(A.a * x * x, { dec: 2, voor: '', na: '\\text{ m}' })]),
    uitleg: [`${tg(B.a)} < ${tg(A.a)}: \\text{ de kabel is breder}`, `${tg(B.a)} \\cdot ${x * x} = ${tg(B.a * x * x)}, \\quad ${tg(A.a)} \\cdot ${x * x} = ${tg(A.a * x * x)}`] };
}
function vraagGrafBreed() {
  const L = vierSituaties(), i = rnd(0, 3);
  return { soort: 'grafbreed', opdracht: 'Tip: alle grafieken staan op dezelfde schaal. Dal of berg? Breed of smal?', html: `<p class="midden">$${vTex(L[i].a)}$</p>${vraag('Welke grafiek hoort bij deze formule?')}`, sleutel: 'gb' + L[i].a, rapport: `voorschrift → grafiek ${kg(L[i].a)}`,
    antw: figuren(pGraf(L[i].a), L.filter((_, j) => j !== i).map(x => pGraf(x.a))), uitleg: [tx(`${L[i].a > 0 ? 'Dalparabool' : 'Bergparabool'}, ${Math.abs(L[i].a) >= 1.5 ? 'smal' : 'breed'}.`)] };
}
// uitbreiding
function vraagSnelst() {
  return { soort: 'snelst', opdracht: 'Tip: vergelijk de getallen voor het kwadraat.', html: `<p>De oppervlakte van een vierkant: $A(z) = z^2$.<br>De oppervlakte van een rechthoek waarvan de lengte 2 keer de breedte is: $A(b) = 2b^2$.</p>${vraag('Welke grafiek stijgt het snelst? Leg uit met de parameter $a$.')}`, sleutel: 'sn' + rnd(1, 3), rapport: 'z² en 2b² vergelijken',
    antw: zinnen('A(b) = 2b²: a = 2 > 1, dus die parabool is smaller (steiler).', ['A(z) = z²: a = 1 is kleiner, dus die stijgt sneller.', 'Ze stijgen even snel: het zijn allebei kwadraten.', 'A(b) = 2b², want die parabool is breder.']), uitleg: [tx('a = 2 > 1: smaller en steiler, dus 2b² stijgt het snelst.')] };
}
function vraagNatParabool() {
  return { soort: 'natpar', opdracht: 'Tip: hoe groter a, hoe smaller de parabool.', html: `<p>Droog wegdek: $d(v) = 0{,}005v^2$. Nat wegdek: $d(v) = 0{,}01v^2$.<br>Je tekent beide grafieken in hetzelfde assenstelsel.</p>${vraag('Wat is het verschil tussen de twee parabolen?')}`, sleutel: 'np' + rnd(1, 3), rapport: 'nat/droog parabool',
    antw: zinnen('De parabool van het natte wegdek is smaller (steiler): a = 0,01 is groter dan 0,005.', ['De parabool van het natte wegdek is breder: a = 0,01 is groter.', 'De parabool van het natte wegdek ligt 0,005 hoger.', 'Er is geen verschil: beide zijn dalparabolen met top (0, 0).']), uitleg: [tx('Hoe groter a, hoe smaller (steiler) de parabool.')] };
}
const D6 = {
  nr: 6, titel: 'Koppelen en vergelijken', kort: 'Situatie, formule en grafiek: berg of dal, breed of smal.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Situatie, formule en grafiek koppelen</div>
      <ul><li><b>Dalparabool</b> ($a > 0$): een halfpipe, een kom, een kabel. <b>Bergparabool</b> ($a < 0$): een boog, een poort ("hoeveel lager dan de top").</li>
      <li><b>Breed</b>: $a$ ligt dicht bij 0 (bv. $0{,}25$). <b>Smal</b>: $a$ ligt ver van 0 (bv. $2$ of $-2$).</li></ul>
      <table class="tabel"><tr><th>Situatie</th><th>Formule</th><th>Grafiek</th></tr>
      <tr><td>brede, ondiepe halfpipe voor beginners</td><td>$y = 0{,}25x^2$</td><td>${pGraf(0.25)}</td></tr>
      <tr><td>smalle, diepe kom</td><td>$y = 2x^2$</td><td>${pGraf(2)}</td></tr>
      <tr><td>brede, lage boog boven een fietspad</td><td>$y = -0{,}25x^2$</td><td>${pGraf(-0.25)}</td></tr>
      <tr><td>smalle, spitse boog van een kerkraam</td><td>$y = -2x^2$</td><td>${pGraf(-2)}</td></tr></table></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: kabel en halfpipe</div>
      <p>Kabel $y = 0{,}01x^2$, halfpipe $h = 0{,}25x^2$. De kabel is de breedste parabool: hoe dichter $a$ bij 0, hoe breder. Op 4 m: kabel $0{,}01 \\cdot 16 = 0{,}16$ m, halfpipe $0{,}25 \\cdot 16 = 4$ m.</p></div>`,
  voorbeelden: [
    { html: `<p>Situatie: de doorsnede van een smalle, diepe kom.</p>${vraag('Welke formule hoort erbij: $y = 2x^2$, $y = -0{,}25x^2$, $y = 0{,}25x^2$ of $y = -2x^2$?')}`, stappen: ['\\text{Een kom is een dalparabool: } a > 0', '\\text{Smal en diep: } a \\text{ ligt ver van 0} \\Rightarrow y = 2x^2'] },
  ],
  soorten: {
    sitvoor: { naam: 'Situatie → formule', gen: vraagSitVoor }, grafvoor: { naam: 'Grafiek → formule', gen: vraagGrafVoor }, grafbreed: { naam: 'Formule → grafiek', gen: vraagGrafBreed },
    breedst: { naam: 'Welke parabool is het breedst?', gen: vraagBreedst }, snelst: { naam: 'z² of 2b²: welke stijgt het snelst?', gen: vraagSnelst }, natpar: { naam: 'Nat en droog: welke parabool?', gen: vraagNatParabool },
  },
  oefenMix: [['sitvoor', 2], ['grafvoor', 1], ['grafbreed', 1], ['breedst', 1], ['snelst', 1], ['natpar', 1]],
  test: [['sitvoor', 1], ['grafvoor', 1], ['grafbreed', 1], ['breedst', 1], ['natpar', 1]], testSchudden: true,
};

// ===================================================================
//  7 · WIE HEEFT GELIJK?
// ===================================================================
function uitspraak() {
  const naam = kies(['Lotte', 'Mehdi', 'Sara', 'Tim', 'Noor', 'Ayoub', 'Lena', 'Jules']);
  const T = kies([
    () => { const k = kies([1, 2, 3]); return { t: `(halfpipe $h = 0{,}25x^2$) "Op $x = ${-k}$ staat de skater lager dan op $x = ${k}$, want $${-k}$ is kleiner dan $${k}$."`, ok: false, r: `Door de symmetrie is h(−${k}) = h(${k}) = ${kg(0.25 * k * k)} m: de skater staat even hoog.`, c: { v: `Hoe hoog staat de skater op x = −${k}?`, a: getal(0.25 * k * k, { dec: 2, voor: `h(-${k}) =`, na: '\\text{ m}' }) } }; },
    () => ({ t: '(remweg) "Als je dubbel zo snel rijdt, wordt je remweg dubbel zo lang."', ok: false, r: 'Dubbel zo snel geeft een 4 keer zo lange remweg (bv. 30 km/u → 9 m, 60 km/u → 36 m).', c: { v: 'Hoeveel keer zo lang wordt de remweg als je dubbel zo snel rijdt?', a: getal(4, { voor: '', na: '\\text{ keer}' }) } }),
    () => ({ t: '(remweg) "Als je dubbel zo snel rijdt, wordt je remweg 4 keer zo lang."', ok: true, r: 'Juist: d(2v) = 4 · d(v).' }),
    () => { const H = kies([60, 70, 80]); return { t: `(vrijevaltoren van ${H} m, $h(t) = -5t^2$, 3 s vrije val) "De hoogtes zijn negatief, dus het bakje zakt onder de grond."`, ok: false, r: `Negatief betekent onder het startpunt. Na 3 s zit het bakje nog ${H - 45} m boven de grond.`, c: { v: 'Hoeveel meter boven de grond zit het bakje na 3 s?', a: getal(H - 45, { voor: '', na: '\\text{ m}' }) } }; },
    () => ({ t: '(hangbrug $y = 0{,}01x^2$, halfpipe $h = 0{,}25x^2$) "De kabel is een bredere parabool dan de halfpipe, want 0,01 is kleiner dan 0,25."', ok: true, r: 'Juist: hoe dichter a bij 0, hoe breder de parabool.' }),
    () => ({ t: '(hangbrug $y = 0{,}01x^2$, halfpipe $h = 0{,}25x^2$) "De halfpipe is een bredere parabool dan de kabel, want 0,25 is groter dan 0,01."', ok: false, r: 'Hoe dichter a bij 0, hoe breder: de kabel is breder.' }),
    () => { const n = rnd(4, 12); return { t: `(terras $T(n) = n^2$) "Een terras met ${n} tegels aan elke zijde heeft ${n} · 2 = ${2 * n} tegels nodig."`, ok: false, r: `T(${n}) = ${n}² = ${n} · ${n} = ${n * n} tegels. Een kwadraat is niet maal 2.`, c: { v: `Hoeveel tegels zijn er nodig?`, a: getal(n * n, { voor: `T(${n}) =`, na: '\\text{ tegels}' }) } }; },
    () => { const n = rnd(4, 12); return { t: `(terras $T(n) = n^2$) "Een terras met ${n} tegels aan elke zijde heeft ${n * n} tegels nodig."`, ok: true, r: `T(${n}) = ${n}² = ${n * n}.` }; },
    () => ({ t: '(poort van 8 m breed en 4 m hoog, $y = -0{,}25x^2$) "Een busje van 2 m breed en 2,5 m hoog past door de poort als het door het midden rijdt."', ok: true, r: 'Op 1 m van het midden is de boog 4 − 0,25 = 3,75 m hoog: het busje past.' }),
    () => ({ t: '(poort van 8 m breed en 4 m hoog, $y = -0{,}25x^2$) "Een vrachtwagen van 2,5 m breed en 3,8 m hoog past, want de poort is 4 m hoog."', ok: false, r: 'Op 1,25 m van het midden is de boog maar 4 − 0,39 = 3,61 m hoog: de vrachtwagen past niet.', c: { v: 'Hoe hoog is de boog op 1,25 m van het midden?', a: getal(4 - 0.25 * 1.5625, { dec: 2, voor: '', na: '\\text{ m}' }) } }),
  ])();
  return { ...T, naam };
}
function uitspraakU() {
  const naam = kies(['Lotte', 'Mehdi', 'Sara', 'Tim', 'Noor', 'Ayoub']);
  return { naam, ...kies([
    { t: '(vierkant $A(z) = z^2$) "Als je de zijde verdubbelt, wordt de oppervlakte dubbel zo groot."', ok: false, r: 'A(2z) = (2z)² = 4z² = 4 · A(z): 4 keer zo groot.' },
    { t: '(vierkant $A(z) = z^2$) "Als je de zijde verdrievoudigt, wordt de oppervlakte 9 keer zo groot."', ok: true, r: 'A(3z) = (3z)² = 9z².' },
    { t: '(steen $s(t) = 4{,}9t^2$) "In dubbel zoveel tijd valt de steen dubbel zo ver."', ok: false, r: 'De tijd verdubbelt, dus de valafstand wordt 4 keer zo groot.' },
    { t: '(droog $0{,}005v^2$, nat $0{,}01v^2$) "Op een nat wegdek is de remweg 2 keer zo lang."', ok: true, r: '0,01 = 2 · 0,005.' },
    { t: '(fietser $d(v) = 0{,}015v^2$) "Rijdt de fietser 3 keer zo snel, dan is de remafstand 9 keer zo groot."', ok: true, r: 'd(3v) = 9 · d(v).' },
    { t: '(rechthoek $A(b) = 2b^2$) "De grafiek van 2b² is breder dan die van z², want er staat een 2 voor."', ok: false, r: 'a = 2 > 1: de parabool is smaller (steiler).' },
  ]) };
}
// "(situatie) \"uitspraak\"" -> situatie apart, daarna wie wat zegt
function uitspraakHtml(u) {
  const m = u.t.match(/^\((.*)\) (".*")$/s);
  return m ? `<p>Situatie: ${m[1]}.</p><p><b>${u.naam}</b> zegt: <i>${m[2]}</i></p>` : `<p><b>${u.naam}</b> zegt: ${u.t}</p>`;
}
function vraagJuistFout(U = false) {
  const u = U ? uitspraakU() : uitspraak();
  return { soort: U ? 'jfU' : 'jf', opdracht: 'Tip: reken de uitspraak na met een voorbeeld.', html: `${uitspraakHtml(u)}${vraag('Is deze uitspraak juist of fout?')}`, sleutel: u.t, rapport: W.platteTekst(u.t),
    antw: jaNee(u.ok), uitleg: [tx(u.ok ? 'Juist.' : 'Fout.'), tx(u.r)] };
}
function vraagVerbeter() {
  let u; do { u = uitspraak(); } while (!u.c);
  return { soort: 'verbeter', opdracht: 'Tip: deze uitspraak is fout. Reken zelf het juiste antwoord uit.', html: `${uitspraakHtml(u)}${vraag(u.c.v)}`, sleutel: u.t + 'v', rapport: 'verbeter: ' + W.platteTekst(u.t), antw: u.c.a, uitleg: [tx(u.r)] };
}
const D7 = {
  nr: 7, titel: 'Wie heeft gelijk?', kort: 'Uitspraken over de situaties: juist of fout? Verbeter.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Typische denkfouten</div>
      <ul><li><b>Symmetrie vergeten:</b> op $x = -2$ en $x = 2$ is de halfpipe even hoog.</li>
      <li><b>Dubbel is niet dubbel:</b> bij een kwadraat geeft dubbel zo snel (breed, lang) een 4 keer zo grote uitkomst. Drie keer zo groot geeft 9 keer zo groot.</li>
      <li><b>Een minteken lezen:</b> bij de vrijevaltoren betekent negatief "onder het startpunt", niet "onder de grond".</li>
      <li><b>Breed of smal:</b> hoe dichter $a$ bij 0, hoe breder de parabool.</li>
      <li><b>Kwadraat is niet maal 2:</b> $6^2 = 6 \\cdot 6 = 36$, niet $6 \\cdot 2 = 12$.</li>
      <li><b>Past het?</b> Kijk naar de hoogte van de boog boven de <b>randen</b> van het voertuig, niet naar de top.</li></ul></div>`,
  voorbeelden: [
    { html: `<p>Situatie: de remweg.</p><p><b>Mehdi</b> zegt: <i>"Als je dubbel zo snel rijdt, wordt je remweg dubbel zo lang."</i></p>${vraag('Is deze uitspraak juist of fout?')}`, stappen: ['30 \\text{ km/u} \\to 9 \\text{ m}, \\quad 60 \\text{ km/u} \\to 36 \\text{ m}', '\\text{Fout: 4 keer zo lang.}'] },
  ],
  soorten: {
    jf: { naam: 'Juist of fout?', gen: () => vraagJuistFout(false) }, verbeter: { naam: 'Verbeter de fout', gen: vraagVerbeter }, jfU: { naam: 'Juist of fout? (oppervlakte, steen, remafstand)', gen: () => vraagJuistFout(true) },
  },
  oefenMix: [['jf', 2], ['verbeter', 1], ['jfU', 1]],
  test: [['jf', 3], ['verbeter', 1], ['jfU', 1]], testSchudden: true,
};

// ===================================================================
//  EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D8 = {
  nr: 8, titel: 'Eindtest tweedegraadsfuncties in contexten', kort: 'Alle situaties door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest krijg je vragen over alle situaties door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${WOORDENLIJST}`,
  voorbeelden: [],
  soorten: {
    e1: mix(D1, 'hoogte', 'Halfpipe en hangbrug'), e2: mix(D1, 'domber', 'Domein en bereik'), e3: mix(D2, 'jonas', 'Het terras'), e4: mix(D3, 'snelheid', 'De remweg'),
    e5: mix(D4, 'grond', 'De vrijevaltoren'), e6: mix(D5, 'past', 'De poort'), e7: mix(D6, 'sitvoor', 'Koppelen'), e8: mix(D7, 'jf', 'Wie heeft gelijk?'),
  },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1]],
  test: [['e1', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1]], testSchudden: true,
};

// tekst links in gewone grootte; moeilijke woorden met uitleg; uitleg als HTML (lange zinnen breken af, juiste antwoord niet herhalen)
for (const D of [D1, D2, D3, D4, D5, D6, D7, D8]) {
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
// moeilijke woorden ook in de theorie en de voorbeelden
for (const D of [D1, D2, D3, D4, D5, D6, D7, D8]) {
  D.theorie = woorden(D.theorie);
  for (const vb of D.voorbeelden || []) if (vb.html) vb.html = woorden(vb.html);
}

Leerpaden.registreer({
  code: 'tweedegraadsfuncties-contexten',
  titel: 'Tweedegraadsfuncties in contexten',
  ondertitel: 'Wiskunde · 4BW-MWW',
  klas: '4BW-MWW',
  drempel: 70,
  allesOpen: true, // alle delen staan open: oefenen en testen mag in elke volgorde
  intro: `<p>Je gebruikt functies $f(x) = ax^2$ in echte situaties: een halfpipe, een hangbrug, een terras, de remweg van een auto, een vrijevaltoren, de boog van een poort …
    Je leest af, je rekent en je legt uit wat een kenmerk betekent in de situatie.</p>
    <p><b>Alle delen staan open.</b> Je kiest zelf welk deel je doet. Lees de theorie, bekijk de voorbeelden, oefen en maak dan de test.
    Een test heeft <b>5 vragen</b> (de eindtest 6). Je hebt <b>4 op 5</b> nodig om te slagen.</p>
    <p><b>Moeilijke woorden</b> hebben een oranje stippellijn: raak ze aan voor de uitleg. <b>Afronden:</b> bij elke rekenvraag staat op hoeveel decimalen je afrondt.</p>`,
  groepen: [
    { titel: 'A · Dalparabolen in context', delen: [1, 2, 3] },
    { titel: 'B · Bergparabolen in context', delen: [4, 5] },
    { titel: 'C · Vergelijken en redeneren', delen: [6, 7] },
    { titel: 'D · Eindtest', delen: [8] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8],
});
