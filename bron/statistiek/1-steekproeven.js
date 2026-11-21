// ===================================================================
//  A · STEEKPROEVEN (delen 1–3)
// ===================================================================
// [situatie, populatie, steekproef, foute populaties, foute steekproeven]
const ONDERZOEKEN = [
  ['Een gemeente wil weten hoeveel inwoners een elektrische auto hebben. Ze stuurt een vragenlijst naar {n} inwoners.', 'alle inwoners van de gemeente', 'de {n} aangeschreven inwoners', ['alle Belgen met een elektrische auto', 'alle elektrische auto’s'], ['alle inwoners met een elektrische auto', 'de inwoners die een auto hebben']],
  ['Een koekjesfabriek wil weten of de pakjes van één week genoeg wegen. Ze weegt {n} pakjes uit de productie van die week.', 'alle pakjes koekjes van die week', 'de {n} gewogen pakjes', ['alle koekjesfabrieken', 'alle pakjes die te weinig wegen'], ['de pakjes die te weinig wegen', 'alle pakjes van die week']],
  ['Een sportclub wil weten of haar leden een nieuwe kantine willen. {n} leden vullen de vragenlijst in.', 'alle leden van de sportclub', 'de {n} leden die de vragenlijst invulden', ['alle sporters van België', 'de leden die een nieuwe kantine willen'], ['alle leden van de sportclub', 'de leden die een nieuwe kantine willen']],
  ['Een onderzoeker wil weten hoe lang Belgische jongeren per nacht slapen. Hij bevraagt {n} jongeren.', 'alle Belgische jongeren', 'de {n} bevraagde jongeren', ['alle Belgen', 'alle jongeren die weinig slapen'], ['alle Belgische jongeren', 'de jongeren die weinig slapen']],
  ['Een appelteler wil weten hoeveel zijn appels van dit jaar wegen. Hij weegt {n} appels uit zijn oogst.', 'alle appels van zijn oogst van dit jaar', 'de {n} gewogen appels', ['alle appels van België', 'de zwaarste appels'], ['alle appels van zijn oogst', 'de appels aan één boom']],
  ['Een tv-zender wil weten hoeveel Vlaamse gezinnen naar een programma keken. Bij {n} gezinnen staat een meetkastje.', 'alle Vlaamse gezinnen', 'de {n} gezinnen met een meetkastje', ['alle kijkers van die zender', 'alle gezinnen die naar het programma keken'], ['alle Vlaamse gezinnen', 'de gezinnen die naar het programma keken']],
  ['Een lampenfabriek test {n} lampen uit de productie van één dag: ze laten ze branden tot ze stuk zijn.', 'alle lampen van die dag', 'de {n} geteste lampen', ['alle lampen die stukgaan', 'alle lampenfabrieken'], ['alle lampen van die dag', 'de lampen die stukgingen']],
  ['De directie wil weten hoeveel leerlingen van de school een studentenjob hebben. De computer kiest lukraak {n} leerlingen uit de leerlingenlijst.', 'alle leerlingen van de school', 'de {n} gekozen leerlingen', ['alle leerlingen met een studentenjob', 'alle Vlaamse leerlingen'], ['alle leerlingen van de school', 'de leerlingen met een studentenjob']],
  ['Een supermarktketen wil weten wat haar klanten van de nieuwe kassa’s vinden. Op één zaterdag worden {n} klanten bevraagd.', 'alle klanten van de supermarktketen', 'de {n} bevraagde klanten', ['alle Belgen', 'de klanten op zaterdag'], ['alle klanten van de supermarktketen', 'alle klanten op zaterdag']],
];
const WAAROM = [
  ['Een lampenfabriek wil weten hoe lang haar lampen branden. Waarom test ze niet alle lampen?', 'Dat is onmogelijk: een geteste lamp brandt tot ze stuk is, en dan heb je niets meer om te verkopen.'],
  ['Een onderzoeker wil weten hoeveel uur Belgen per dag op hun gsm zitten. Waarom bevraagt hij niet alle Belgen?', 'Iedereen bevragen kost veel te veel tijd en geld (en is eigenlijk onmogelijk).'],
  ['Een wijnboer proeft enkele flessen om te weten of de wijn van dit jaar goed is. Waarom proeft hij niet alle flessen?', 'Dan zou hij alle flessen openmaken: er blijft niets over om te verkopen.'],
  ['Een stad wil weten wat de inwoners van de fietspaden vinden. Waarom bevraagt ze niet alle inwoners?', 'Alle inwoners bevragen kost te veel tijd en geld.'],
];
const D1 = {
  nr: 1, titel: 'Populatie en steekproef', kort: 'De volledige groep en het deel dat je echt onderzoekt.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Populatie en steekproef</div>
      <ul><li>De <b>populatie</b> is de volledige groep waarover je iets wil te weten komen.</li><li>Een <b>steekproef</b> is het deel van de populatie dat je echt onderzoekt.</li></ul>
      <p><b>Waarom?</b> Iedereen onderzoeken kost te veel tijd of geld, of het is onmogelijk (je kan niet elke Belg bevragen, en een lamp die je test tot ze stuk is, kan je niet meer verkopen).
      Met een steekproef wil je een besluit trekken over de hele populatie.</p></div>
    <div class="kader eig"><div class="kader-titel">Hoe komen we naar school?</div>
      <p>De leerlingenraad bevraagt aan de balie de leerlingen die 's morgens te laat komen.</p>
      ${htmlTabel([['onderzoeksvraag', 'Met welk vervoermiddel komen de leerlingen naar school?'], ['populatie', 'alle leerlingen van de school'], ['steekproef', 'de leerlingen die ’s morgens te laat komen']], false)}
      <p>Goed beeld? <b>Nee</b>: laatkomers komen vaker met de bus of de tram. Fietsers en voetgangers zitten er te weinig in.</p></div>`,
  voorbeelden: [
    { tex: '\\text{De stad bevraagt 500 inwoners over de nieuwe fietspaden.}', stappen: ['\\text{populatie: alle inwoners van de stad}', '\\text{steekproef: de 500 bevraagde inwoners}'] },
    { tex: '\\text{Een fabriek test 50 lampen uit de productie van één dag.}', stappen: ['\\text{populatie: alle lampen van die dag}', '\\text{steekproef: de 50 geteste lampen}'] },
  ],
  soorten: {
    populatie: { naam: 'Wat is de populatie?', gen() {
      const [s, p, st, fp] = kies(ONDERZOEKEN), n = kies([50, 80, 100, 150, 200, 300, 500, 600, 1000]), zin = s.replace('{n}', n);
      return { soort: 'populatie', opdracht: 'Wat is de populatie?', html: opgave(zin), sleutel: zin + 'p', rapport: zin + ' (populatie)',
        antw: zinKeuze(p, [st.replace('{n}', n), ...fp]), uitleg: [`\\text{populatie: ${p}}`, `\\text{steekproef: ${st.replace('{n}', n)}}`] };
    } },
    steekproef: { naam: 'Wat is de steekproef?', gen() {
      const [s, p, st, , fs] = kies(ONDERZOEKEN), n = kies([50, 80, 100, 150, 200, 300, 500, 600, 1000]), zin = s.replace('{n}', n);
      return { soort: 'steekproef', opdracht: 'Wat is de steekproef?', html: opgave(zin), sleutel: zin + 's', rapport: zin + ' (steekproef)',
        antw: zinKeuze(st.replace('{n}', n), fs), uitleg: [`\\text{populatie: ${p}}`, `\\text{steekproef: ${st.replace('{n}', n)}}`] };
    } },
    waarom: { naam: 'Waarom een steekproef?', gen() {
      const [v, j] = kies(WAAROM);
      return { soort: 'waarom', opdracht: 'Kies het beste antwoord.', html: opgave(v), sleutel: v, rapport: v,
        antw: zinKeuze(j, ['Met een steekproef krijg je altijd precies hetzelfde resultaat als bij de hele populatie.', 'Een steekproef is altijd betrouwbaarder dan iedereen onderzoeken.', 'Een populatie kan je nooit tellen.'].concat(WAAROM.filter(w => w[1] !== j).map(w => w[1]).slice(0, 1))),
        uitleg: ['\\text{iedereen onderzoeken kost te veel tijd of geld, of is onmogelijk}'] };
    } },
  },
  oefenMix: [['populatie', 2], ['steekproef', 2], ['waarom', 1]],
  test: [['populatie', 4], ['steekproef', 4], ['waarom', 2]], testSchudden: true,
};

// ---- 2. Een goede steekproef ---------------------------------------------------------------------------
// [situatie, probleem: 0 = niet aselect, 1 = te klein, 2 = te veel non-respons, 3 = goede steekproef, uitleg]
const STEEKPROEVEN = [
  ['De stad wil weten wat de inwoners van de sportvoorzieningen vinden en bevraagt de bezoekers van het jeugdhuis.', 0, 'Enkel jongeren, en vooral jongeren die naar het jeugdhuis gaan: niet iedereen heeft evenveel kans.'],
  ['Een onderzoeksbureau belt overdag naar vaste telefoonnummers om te weten wat Belgen van het openbaar vervoer vinden.', 0, 'Wie overdag werkt of geen vaste lijn heeft (veel jongeren), wordt niet bereikt.'],
  ['Om te weten of de leerlingen van de school een later startuur willen, bevraag je alleen je eigen klas.', 0, 'Eén klas, één leeftijd, één richting: niet aselect en niet representatief.'],
  ['Een krant vraagt haar lezers online hoeveel uur ze per dag sporten. Wie wil, vult de vragenlijst in.', 0, 'Enkel lezers van die krant, en ze kiezen zelf of ze meedoen: niet aselect.'],
  ['Een autowebsite houdt een online poll over een lagere snelheidslimiet. 25 000 bezoekers stemmen. De website besluit iets over alle Belgen.', 0, 'Groot is niet genoeg: enkel bezoekers van een autowebsite, en ze kiezen zelf of ze stemmen.'],
  ['Om te weten hoe de leerlingen naar school komen, bevraag je de leerlingen in de fietsenstalling.', 0, 'Enkel fietsers: wie met de bus, tram of te voet komt, zit er niet in.'],
  ['Om te weten wat de leerlingen van de schoolmaaltijden vinden, bevraag je de leerlingen die in de refter eten.', 0, 'Wie zijn boterhammen meebrengt of naar huis gaat, wordt niet bevraagd.'],
  ['Lien bevraagt 5 lukraak gekozen leerlingen van de school over een langere middagpauze.', 1, 'Aselect, maar veel te klein: met 5 leerlingen bepaalt het toeval het resultaat.'],
  ['Om te weten wat de 1200 inwoners van een dorp van een nieuw plein vinden, kiest de computer lukraak 4 inwoners uit het bevolkingsregister.', 1, 'Aselect, maar veel te klein: 4 inwoners zeggen bijna niets over het hele dorp.'],
  ['De school stuurt een enquête over de schoolmaaltijden naar 800 ouders. Er komen 120 antwoorden terug, vooral van ontevreden ouders.', 2, 'Grote non-respons: de meeste ouders antwoorden niet, en wie antwoordt is vooral ontevreden.'],
  ['Een gemeente kiest lukraak 1000 inwoners en stuurt hen een vragenlijst over afval. Slechts 90 inwoners sturen ze terug, vooral wie boos is over de afvalophaling.', 2, 'Aselect gekozen, maar te veel non-respons: de antwoorden komen vooral uit één groep.'],
  ['Een computer kiest lukraak 200 namen uit de volledige lijst van alle inwoners van de stad, en ze antwoorden allemaal.', 3, 'Aselect uit de volledige populatie, groot genoeg en geen non-respons.'],
  ['De computer kiest uit de volledige leerlingenlijst lukraak 100 leerlingen uit alle jaren en richtingen. Ze vullen de vragenlijst allemaal in tijdens een lesuur.', 3, 'Aselect, groot genoeg en geen non-respons: een goede steekproef.'],
  ['Een fabriek kiest lukraak 60 pakken suiker uit de volledige productie van een dag en weegt ze allemaal.', 3, 'Aselect uit de hele dagproductie, groot genoeg en alle pakken worden gewogen.'],
];
const PROBLEEM = ['niet aselect: niet iedereen heeft evenveel kans', 'te klein: het toeval bepaalt het resultaat', 'te veel non-respons', 'goede steekproef: representatief'];
const D2 = {
  nr: 2, titel: 'Een goede steekproef', kort: 'Representatief: aselect, groot genoeg en weinig non-respons.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een goede steekproef</div>
      <p>Een goede steekproef is <b>representatief</b>: een goede afspiegeling van de populatie. Alle deelgroepen zitten er in de juiste verhouding in. Daarvoor let je op:</p>
      <ul><li><b>aselect</b> kiezen: elk element van de populatie heeft evenveel kans om gekozen te worden (bv. lukraak door een computer uit een volledige lijst);</li>
      <li><b>voldoende groot</b>: een te kleine steekproef geeft toevallige resultaten;</li>
      <li>weinig <b>non-respons</b>: als veel gekozen mensen niet antwoorden, en dat zijn vooral mensen uit één groep, wordt het resultaat scheef.</li></ul>
      <p class="midden"><b>Groot ≠ goed: eerst representatief, dan groot genoeg!</b></p>
      <p class="klein">10 000 antwoorden van alleen maar fietsers zeggen niets over alle leerlingen.</p></div>
    <div class="kader eig"><div class="kader-titel">Lessen pas om 9u00?</div>
      ${htmlTabel([['steekproef', 'probleem'], ['alleen je eigen klas bevragen', 'één klas, één leeftijd: niet representatief'], ['leerlingen die tijdens de examens vroeg vertrekken', 'enkel bepaalde graden: niet representatief'],
        ['laatkomers tussen 8u30 en 10u10', 'zijn waarschijnlijk vaker voor: niet representatief'], ['computer kiest lukraak 100 leerlingen uit de volledige lijst, iedereen antwoordt', '<b>goede steekproef</b>']])}</div>`,
  voorbeelden: [
    { tex: '\\text{Enquête naar 800 ouders, 120 antwoorden. Hoeveel procent antwoordde?}', stappen: ['800 \\text{ ouders is } 100\\,\\%', '\\text{dus 8 ouders is } 1\\,\\% \\text{ en 120 ouders is } 15\\,\\%', '\\text{85\\,\\% antwoordde niet: grote non-respons}'] },
  ],
  soorten: {
    goed: { naam: 'Representatief of niet?', gen() {
      const [s, p, u] = kies(STEEKPROEVEN), ok = p === 3;
      const fout = ok ? ['Niet representatief: de steekproef is te klein.', 'Niet representatief: een computer kan niet eerlijk kiezen.', 'Niet representatief: je moet altijd iedereen bevragen.']
        : ['Wel representatief: de steekproef is groot genoeg.', 'Wel representatief: iedereen die gekozen werd, heeft geantwoord.', 'Wel representatief: elke steekproef geeft een goed beeld.'];
      return { soort: 'goed', opdracht: 'Is de steekproef representatief? Kies de juiste uitleg.', html: opgave(s), sleutel: s, rapport: s,
        antw: zinKeuze(`${ok ? 'Wel' : 'Niet'} representatief. ${u}`, fout), uitleg: [`\\text{${PROBLEEM[p]}}`] };
    } },
    probleem: { naam: 'Wat is het probleem?', gen() {
      const [s, p, u] = kies(STEEKPROEVEN);
      return { soort: 'probleem', opdracht: 'Wat is er met deze steekproef (niet) in orde?', html: opgave(s), sleutel: s + 'p', rapport: s + ' (probleem)',
        antw: keuze(kT(PROBLEEM), p, { lijst: true }), uitleg: [`\\text{${u.replace(/’/g, "'")}}`] };
    } },
    nonrespons: { naam: 'Non-respons in procent', gen() {
      const C = kies([['De school stuurt een enquête naar {N} ouders. Er komen {k} antwoorden terug.', 'ouders'], ['Een gemeente stuurt een vragenlijst naar {N} lukraak gekozen inwoners. {k} inwoners sturen hem terug.', 'inwoners'],
        ['Een jeugdbeweging mailt een vragenlijst naar {N} leden. {k} leden antwoorden.', 'leden'], ['Een bedrijf vraagt {N} klanten per mail om een score te geven. {k} klanten doen dat.', 'klanten']]);
      let N, k; do { N = kies([200, 400, 500, 800, 1000, 1200, 1500, 2000, 250, 50]); k = Math.round(N * rnd(8, 60) / 100); } while (!ex(100 * k / N) || k < 5);
      const zin = C[0].replace('{N}', N).replace('{k}', k), v = kies(['wel', 'niet']), p = v === 'wel' ? 100 * k / N : 100 - 100 * k / N;
      return { soort: 'nonrespons', opdracht: `Hoeveel procent ${v === 'wel' ? 'heeft geantwoord' : 'heeft niet geantwoord (de non-respons)'}?`, html: opgave(zin), sleutel: zin + v, rapport: zin + ` (${v})`,
        antw: pct(r1(p), { dec: 1 }), uitleg: v === 'wel' ? pctUitleg(k, N, C[1]) : [...pctUitleg(k, N, C[1]), `\\text{niet geantwoord: } 100\\,\\% - ${tg(r1(100 * k / N))}\\,\\% = ${tg(r1(p))}\\,\\%`] };
    } },
  },
  oefenMix: [['goed', 2], ['probleem', 2], ['nonrespons', 1]],
  test: [['goed', 4], ['probleem', 4], ['nonrespons', 2]], testSchudden: true,
};

// ---- 3. Besluiten over de populatie ------------------------------------------------------------------------
const BESLUITEN = [
  { ond: 'Uit de volledige leerlingenlijst van onze school kiest de computer lukraak {N} leerlingen. Ze antwoorden allemaal. {k} van hen komen met de bus naar school.', pop: 'de leerlingen van onze school', wat: 'komt met de bus naar school', wb: 'met de bus naar school komt', ruim: ['alle Antwerpse leerlingen', 'alle Vlaamse leerlingen'] },
  { ond: 'Uit de volledige leerlingenlijst van onze school kiest de computer lukraak {N} leerlingen. Ze antwoorden allemaal. {k} van hen zijn voor een later startuur.', pop: 'de leerlingen van onze school', wat: 'is voor een later startuur', wb: 'voor een later startuur is', ruim: ['alle Vlaamse leerlingen', 'alle leerlingen van België'] },
  { ond: 'Een gemeente kiest lukraak {N} inwoners uit het bevolkingsregister. Ze antwoorden allemaal. {k} van hen hebben een zonnepaneel.', pop: 'de inwoners van de gemeente', wat: 'heeft zonnepanelen', wb: 'zonnepanelen heeft', ruim: ['alle Belgen', 'alle inwoners van de provincie'] },
  { ond: 'Een sportclub kiest lukraak {N} leden uit de ledenlijst. Ze antwoorden allemaal. {k} van hen willen op zondag trainen.', pop: 'de leden van de sportclub', wat: 'wil op zondag trainen', wb: 'op zondag wil trainen', ruim: ['alle Belgische sporters', 'alle sportclubs'] },
  { ond: 'Een appelteler weegt {N} lukraak gekozen appels uit zijn oogst. {k} appels wegen meer dan 150 g.', pop: 'de appels van zijn oogst', wat: 'weegt meer dan 150 g', wb: 'meer dan 150 g weegt', ruim: ['alle Belgische appels', 'alle appels van de wereld'] },
];
function besluitGetallen() { let N, k; do { N = kies([50, 80, 100, 120, 150, 200, 250, 300, 400, 500]); k = Math.round(N * rnd(12, 78) / 100); } while (!Number.isInteger(100 * k / N)); return { N, k, p: 100 * k / N }; }
const D3 = {
  nr: 3, titel: 'Besluiten over de populatie', kort: 'Een besluit geldt enkel voor de populatie, als schatting: "ongeveer …".', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een besluit formuleren</div>
      <p>Met het resultaat van een steekproef doe je een uitspraak over de populatie. Dat mag alleen als de steekproef <b>representatief</b> is, en dan nog blijft het een <b>schatting</b>.</p>
      <p class="midden"><b>Een besluit geldt alleen voor de populatie waaruit je koos, en alleen als de steekproef representatief is. Formuleer het als schatting: "ongeveer …".</b></p></div>
    <div class="kader eig"><div class="kader-titel">Een later startuur?</div>
      <p>120 lukraak gekozen leerlingen van onze school: 78 zijn voor een later startuur.</p>
      ${htmlTabel([['aantal leerlingen', '120', '6', '78'], ['procent', '100 %', '5 %', '65 %']])}<p class="klein midden">120 : 20 = 6, dus 100 % : 20 = 5 %; 6 · 13 = 78, dus 5 % · 13 = 65 %</p>
      <p><b>Goed:</b> "Ongeveer 65 % van de leerlingen van onze school is voor."<br><b>Fout:</b> "65 % van alle Vlaamse leerlingen is voor." De populatie is onze school, niet heel Vlaanderen.</p></div>`,
  voorbeelden: [
    { tex: '\\text{200 lukraak gekozen leerlingen, 46 komen met de bus. Hoeveel procent?}', stappen: ['200 \\text{ is } 100\\,\\%', '\\text{dus 2 is } 1\\,\\% \\text{ en 46 is } 23\\,\\%', '\\text{besluit: ongeveer 23\\,\\% van de leerlingen van onze school komt met de bus}'] },
  ],
  soorten: {
    procent: { naam: 'Procent van de steekproef', gen() {
      const B = kies(BESLUITEN), g = besluitGetallen(), zin = B.ond.replace('{N}', g.N).replace('{k}', g.k);
      return { soort: 'procent', opdracht: 'Hoeveel procent van de steekproef is dat?', html: opgave(zin), sleutel: zin, rapport: zin, antw: pct(g.p), uitleg: pctUitleg(g.k, g.N) };
    } },
    besluit: { naam: 'Een correct besluit', gen() {
      const B = kies(BESLUITEN), g = besluitGetallen(), zin = B.ond.replace('{N}', g.N).replace('{k}', g.k), P = tekst(g.p);
      return { soort: 'besluit', opdracht: 'Welk besluit is correct?', html: opgave(zin), sleutel: zin + 'b', rapport: zin + ' (besluit)',
        antw: zinKeuze(`Ongeveer ${P} % van ${B.pop} ${B.wat}.`, [`Ongeveer ${P} % van ${B.ruim[0]} ${B.wat}.`, `Precies ${P} % van ${B.pop} ${B.wat}, niet meer en niet minder.`, `${P} % van ${B.ruim[1]} ${B.wat}.`]),
        uitleg: [`\\text{${g.k} van de ${g.N} is ${P}\\,\\%}`, `\\text{het besluit geldt enkel voor ${B.pop}, als schatting (ongeveer)}`] };
    } },
    mag: { naam: 'Mag je dat besluiten?', gen() {
      const B = kies(BESLUITEN), g = besluitGetallen(), zin = B.ond.replace('{N}', g.N).replace('{k}', g.k), P = tekst(g.p), r = kies(B.ruim);
      const v = kies(['ruim', 'klein', 'ok']);
      if (v === 'ruim') return { soort: 'mag', opdracht: `Mag je besluiten dat ongeveer ${P} % van ${r} ${B.wb}?`, html: opgave(zin), sleutel: zin + r, rapport: zin + ' (veralgemenen)',
        antw: zinKeuze(`Nee: de populatie is ${B.pop}. Over ${r} zegt deze steekproef niets.`, ['Ja: de steekproef is aselect, dus het besluit geldt overal.', `Ja: ${g.N} is een grote steekproef.`, 'Nee: je mag nooit iets besluiten uit een steekproef.']),
        uitleg: ['\\text{een besluit geldt alleen voor de populatie waaruit de steekproef gekozen werd}'] };
      if (v === 'klein') {
        const n = kies([4, 5, 6, 8, 10]), k = rnd(1, n - 1), p = r1(100 * k / n), nm = kies(['Lien', 'Arne', 'Sofia', 'Daan']);
        const z2 = `${nm} kiest lukraak ${n} leerlingen van de school. ${k} van hen willen een langere middagpauze. ${nm} besluit: "${tekst(p)} % van de leerlingen van onze school wil een langere middagpauze."`;
        return { soort: 'mag', opdracht: 'Wat vind je van dat besluit?', html: opgave(z2), sleutel: z2, rapport: z2,
          antw: zinKeuze(`Niet betrouwbaar: de steekproef is aselect, maar met ${n} leerlingen veel te klein. Het toeval bepaalt het resultaat.`, ['Correct: de leerlingen werden lukraak gekozen.', 'Niet betrouwbaar: je mag nooit lukraak kiezen.', 'Correct, maar je moet het percentage afronden.']),
          uitleg: ['\\text{eerst representatief, dan groot genoeg}', `\\text{${n} leerlingen is veel te weinig}`] };
      }
      return { soort: 'mag', opdracht: `Mag je besluiten dat ongeveer ${P} % van ${B.pop} ${B.wb}?`, html: opgave(zin), sleutel: zin + 'ok', rapport: zin + ' (besluit ok)',
        antw: zinKeuze('Ja: de steekproef is aselect gekozen uit die populatie, groot genoeg en zonder non-respons. Het blijft wel een schatting.', [`Nee: je moet ${B.pop.replace(/^de /, 'alle ')} onderzoeken.`, 'Nee: een besluit mag je enkel over de steekproef zelf maken.', `Ja, en het geldt ook voor ${r}.`]),
        uitleg: ['\\text{representatieve steekproef uit die populatie: het besluit mag, als schatting}'] };
    } },
  },
  oefenMix: [['procent', 2], ['besluit', 2], ['mag', 2]],
  test: [['procent', 3], ['besluit', 4], ['mag', 3]], testSchudden: true,
};
