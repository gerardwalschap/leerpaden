// ===================================================================
//  PROEFTOETS GETALLENLEER 7VJHO — afsluiter van Rekenen in ℕ, ℤ, ℚ en ℝ
//  Een samenvoegsel van (ongeveer) alle soorten oefeningen uit de getallenleer-leerpaden.
//  De toets is opgesplitst in 5 stukken (delen) die allemaal openstaan: leerlingen mogen
//  ze over verschillende dagen spreiden. Eén stuk maak je wel in één keer (± 20 à 30 min).
//
//  De vragen komen rechtstreeks uit de bestaande leerpaden (Rekenen in ℕ, ℤ, ℚ en De reële
//  getallen): dezelfde afspraken, notaties en verbeteringen. Er staat dus niets nieuws in.
//  Dit bestand moet NA die leerpaden geladen worden (zie index.html).
// ===================================================================

// [leerpad, deel in dat leerpad, soort, korte naam]
const STUKKEN = [
  { nr: 1, titel: 'Rekenen in ℕ', teken: 'ℕ', leerpad: 'getallenleer-n', rekenmachine: false, vragen: [
    [1, 'basis', 'Haakjes, machten en volgorde'], [1, 'wortel', 'Volgorde met wortels'], [1, 'log', 'Volgorde met logaritmen'],
    [2, 'vereenvoudig', 'Eentermen vereenvoudigen'], [2, 'getalwaarde', 'Getalwaarde'], [2, 'eerstVereenvoudig', 'Eerst vereenvoudigen, dan berekenen'],
    [3, 'vergelijk', 'Vergelijken'], [3, 'opsommen', 'Oplossingen in ℕ opsommen'], [3, 'aflezen', 'Aflezen op de getallenas'],
    [4, 'van', 'x% van een getal'], [4, 'vraagstuk', 'Vraagstuk met procenten'],
    [5, 'soortVerband', 'Recht of omgekeerd evenredig?'], [5, 'recht', 'Rechte evenredigheid'], [5, 'omgekeerd', 'Omgekeerde evenredigheid'],
  ] },
  { nr: 2, titel: 'Rekenen in ℤ', teken: 'ℤ', leerpad: 'getallenleer-z', rekenmachine: false, vragen: [
    [1, 'plus', 'Optellen'], [1, 'min', 'Aftrekken'], [2, 'ketting', 'Vermenigvuldigen en delen'],
    [3, 'haakjes', 'Machten (−a)ⁿ'], [3, 'zonder', 'Machten −aⁿ en −(−a)ⁿ'], [3, 'bijzonder', '(−1)ⁿ en a⁰'],
    [4, 'vierkant', 'Vierkantswortels'], [4, 'derde', 'Derdemachtswortels'], [4, 'log', 'Logaritmen'],
    [5, 'gemengd', 'Volgorde van de bewerkingen'],
    [6, 'vergelijk', 'Vergelijken'], [6, 'coord', 'Coördinaten aflezen'],
    [7, 'vereenvoudig', 'Eentermen vereenvoudigen'], [7, 'getalwaarde', 'Getalwaarde'],
    [8, 'regels', 'Rekenregels met machten'], [8, 'uitwerken', 'Uitwerken en vereenvoudigen'],
    [9, 'verband', 'Verband in een tabel'],
  ] },
  { nr: 3, titel: 'Rekenen in ℚ', teken: 'ℚ', leerpad: 'getallenleer-q', rekenmachine: false, vragen: [
    [1, 'vorm', 'Decimale vorm herkennen'], [2, 'repeterend', 'Afronden'],
    [3, 'vereenvoudig', 'Breuk vereenvoudigen'], [3, 'ordenen', 'Kleinste of grootste breuk'],
    [4, 'naarBreuk', 'Percentage → breuk'], [4, 'naarProcent', 'Breuk → percentage'],
    [5, 'aflezen', 'Breuk op de getallenas'], [6, 'som', 'Breuken optellen en aftrekken'],
    [7, 'maal', 'Breuken vermenigvuldigen'], [7, 'deel', 'Breuken delen'],
    [8, 'macht', 'Machten van breuken'], [8, 'wortel', 'Wortels van breuken'], [8, 'regels', 'Rekenregels met machten'],
    [9, 'gemengd', 'Volgorde van de bewerkingen'], [10, 'gemengd', 'Decimaal getal → breuk'],
  ] },
  { nr: 4, titel: 'Rekenen in ℝ zonder rekenmachine', teken: 'ℝ', leerpad: 'reele-getallen', rekenmachine: false, vragen: [
    [1, 'qofr', 'Rationaal of irrationaal?'], [1, 'diagram', 'Plaats in het diagram'], [1, 'waarniet', 'Waar of niet waar?'],
    [2, 'derde', 'Derdemachtswortel'],
    [3, 'vereenvoudig', 'Wortel vereenvoudigen'], [3, 'vermenigvuldig', 'Wortels vermenigvuldigen'], [3, 'optellen', 'Wortels optellen en aftrekken'],
    [3, 'eerstvereenv', 'Eerst vereenvoudigen, dan optellen'], [3, 'wortelvrij', 'Noemer wortelvrij maken'],
    [4, 'naarongelijkheid', 'Interval → ongelijkheid'], [4, 'naarinterval', 'Ongelijkheid → interval'], [4, 'hoortbij', 'Hoort het getal bij het interval?'],
    [4, 'tekenen', 'Welke getallenas hoort erbij?'], [4, 'leesaf', 'Interval aflezen op de getallenas'],
  ] },
  { nr: 5, titel: 'Rekenen in ℝ met rekenmachine', teken: 'ℝ', leerpad: 'reele-getallen', rekenmachine: true, vragen: [
    [2, 'tussen', 'Wortel benaderen tussen twee gehele getallen'], [2, 'vijfdec', 'Wortels op 5 decimalen'], [2, 'tussenres', 'Op 2 decimalen (tussenresultaten)'],
    [5, 'wortelvorm', 'Macht → wortelvorm'], [5, 'machtsvorm', 'Wortel → macht'], [5, 'eenmacht', 'Schrijf als één macht en reken uit'],
    [6, 'bereken', 'Logaritme berekenen'], [6, 'omzetten', 'Macht ↔ logaritme'],
    [7, 'combineer', 'Rekenregels met logaritmen'], [7, 'berekenx', 'Bereken x'],
    [8, 'zijde', 'Pythagoras: ontbrekende zijde'], [8, 'afstand', 'Afstand tussen twee punten'], [8, 'vraagstuk', 'Pythagoras: vraagstuk'],
    [9, 'lineair', 'Eenvoudige vergelijking'], [9, 'haakjes', 'Vergelijking met haakjes'], [9, 'noemer', 'Vergelijking met een noemer'], [9, 'evenredigheid', 'Evenredigheid'],
    [10, 'omvormen', 'Formule omvormen'],
  ] },
];

const TITELS = { 'getallenleer-n': 'Rekenen in ℕ', 'getallenleer-z': 'Rekenen in ℤ', 'getallenleer-q': 'Rekenen in ℚ', 'reele-getallen': 'De reële getallen' };

const PROEF_DELEN = STUKKEN.map((S) => {
  const soorten = {}, samenstelling = [];
  S.vragen.forEach(([deelnr, soort, naam], i) => {
    const sleutel = S.teken + String(i + 1).padStart(2, '0');
    soorten[sleutel] = {
      naam,
      gen() {
        const P = Leerpaden.vind(S.leerpad);
        const deel = P && P.delen.find(d => d.nr === deelnr);
        const G = deel && deel.soorten[soort];
        if (!G) throw new Error(`Proeftoets: vraag ${sleutel} niet gevonden (${S.leerpad}, deel ${deelnr}, ${soort})`);
        const v = G.gen();
        return { ...v, soort: sleutel, opdracht: v.opdracht || G.opdracht || deel.opdracht || 'Bereken.', kop: `${deel.titel}` };
      },
    };
    samenstelling.push([sleutel, 1]);
  });
  // Theorie: waar herhaal je wat?
  const perDeel = [];
  for (const [deelnr, , naam] of S.vragen) {
    let r = perDeel.find(x => x.nr === deelnr);
    if (!r) perDeel.push(r = { nr: deelnr, namen: [] });
    if (!r.namen.includes(naam)) r.namen.push(naam);
  }
  const P = () => Leerpaden.vind(S.leerpad);
  const theorie = () => `<div class="kader"><div class="kader-titel">Wat zit er in dit stuk?</div>
      <p>Dit stuk heeft <b>${S.vragen.length} vragen</b>, telkens één vraag van elke soort oefening uit het leerpad <b>${TITELS[S.leerpad]}</b>.
      ${S.rekenmachine ? 'Je mag je <b>rekenmachine</b> gebruiken.' : 'Je werkt <b>zonder rekenmachine</b>.'}</p>
      <table class="tabel"><tr><th>Deel in ${TITELS[S.leerpad]}</th><th>Soorten vragen</th></tr>
      ${perDeel.map(r => { const d = P() && P().delen.find(x => x.nr === r.nr); return `<tr><td>${r.nr}. ${d ? d.titel : ''}</td><td>${r.namen.join(' · ')}</td></tr>`; }).join('')}</table>
      <p>Twijfel je nog? Herhaal dan de theorie en de voorbeelden in dat deel van het leerpad, of oefen hier eerst in het tabblad <i>Oefenen</i>.</p></div>`;
  const D = {
    nr: S.nr, titel: S.titel, kort: `${S.vragen.length} vragen · ${S.rekenmachine ? 'met' : 'zonder'} rekenmachine`, rekenmachine: S.rekenmachine,
    theorie: '', voorbeelden: [],
    soorten, oefenMix: samenstelling, test: samenstelling, testSchudden: false,
  };
  // de theorie pas opbouwen als alle leerpaden geladen zijn (titels van de delen)
  Object.defineProperty(D, 'theorie', { get: theorie, enumerable: true });
  return D;
});

Leerpaden.registreer({
  code: 'proeftoets-getallenleer', titel: 'Proeftoets getallenleer', ondertitel: 'Rekenen in ℕ, ℤ, ℚ en ℝ · 7VJHO', klas: '7VJHO',
  drempel: 50,
  buitenTotaal: true, // telt niet mee in de totaalscore van het afdrukcentrum
  allesOpen: true, // alle stukken staan open: in elke volgorde, over verschillende dagen
  herhaalbaar: true, // ook na slagen mag een stuk opnieuw gemaakt worden (met nieuwe vragen)
  intro: `<p>Dit is de <b>grote proeftoets</b> van getallenleer: rekenen in ℕ, ℤ, ℚ en ℝ. Je krijgt van elke soort oefening die je in de leerpaden gemaakt hebt één vraag.</p>
    <p>De proeftoets bestaat uit <b>5 stukken</b>. <b>Alle stukken staan open</b> en je mag ze <b>over verschillende dagen spreiden</b>, in de volgorde die jij wil.
    Eén stuk maak je wel <b>in één keer</b> (reken op 20 à 30 minuten): eens je een stuk start, telt je poging.</p>
    <ul><li>Stuk 1 tot 4: <b>zonder rekenmachine</b>. Stuk 5: <b>met rekenmachine</b>.</li>
    <li>Bij elk stuk zie je in het tabblad <i>Theorie</i> welke delen van de leerpaden erin zitten. In <i>Oefenen</i> kan je eerst proberen.</li>
    <li>Na het indienen zie je je verbetering. Zo weet je wat je nog moet herhalen.</li></ul>`,
  groepen: [{ titel: 'Proeftoets in 5 stukken', delen: [1, 2, 3, 4, 5] }],
  delen: PROEF_DELEN,
});
