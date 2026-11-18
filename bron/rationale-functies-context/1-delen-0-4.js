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
