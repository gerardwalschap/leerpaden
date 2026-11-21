// Programma 'instaptoets-7vjho' — automatisch samengevoegd uit bron/instaptoets-7vjho/ (niet rechtstreeks bewerken)
(() => {
// ===================================================================
//  INSTAPTOETS GETALLENLEER 7VJHO — eerste schooldag
//  Geen theorie, geen oefenen: enkel één toets van 40 vragen, zonder rekenmachine.
//  Deel A (basis, 24 vragen = 60 punten) en deel B (uitdagend, 16 vragen = 40 punten),
//  telkens evenveel vragen over ℕ, ℤ, ℚ en ℝ (10 per getallenverzameling = 25 punten).
//  Elke vraag telt even zwaar (2,5 punten op 100).
//  Niveau: minder dan 70/100 = Beginner, 70/100 of meer = Gevorderd.
//  Met enkel deel A (max. 60) word je dus nooit gevorderd: er moet ook uitdagend werk juist zijn.
//
//  De vragen komen uit de bestaande leerpaden (Rekenen in ℕ, ℤ, ℚ en De reële getallen),
//  zodat de instaptoets exact dezelfde afspraken, notaties en verbeteringen gebruikt.
//  Dit bestand moet dus NA die leerpaden geladen worden (zie index.html).
// ===================================================================

const DOMEINEN = [
  { k: 'N', naam: 'Natuurlijke getallen', teken: 'ℕ', leerpad: 'getallenleer-n' },
  { k: 'Z', naam: 'Gehele getallen', teken: 'ℤ', leerpad: 'getallenleer-z' },
  { k: 'Q', naam: 'Rationale getallen', teken: 'ℚ', leerpad: 'getallenleer-q' },
  { k: 'R', naam: 'Reële getallen', teken: 'ℝ', leerpad: 'reele-getallen' },
];
const NIVEAUS = [
  { k: 'A', naam: 'Deel A · Basis', kort: 'Basis' },
  { k: 'B', naam: 'Deel B · Uitdagend', kort: 'Uitdagend' },
];

// [niveau, domein, leerpad-deel, soort in dat deel, korte naam, (optionele controle)]
// Alles zonder rekenmachine (enkel soorten met eenvoudige getallen).
const VRAGEN = [
  // ---------- Deel A · Basis (24)
  ['A', 'N', 1, 'basis', 'Volgorde van de bewerkingen'],
  ['A', 'N', 1, 'wortel', 'Volgorde met wortels'],
  ['A', 'N', 2, 'vereenvoudig', 'Eentermen vereenvoudigen'],
  ['A', 'N', 2, 'getalwaarde', 'Getalwaarde'],
  ['A', 'N', 3, 'vergelijk', 'Vergelijken'],
  ['A', 'N', 4, 'van', 'x% van een getal'],

  ['A', 'Z', 1, 'plus', 'Optellen in ℤ', (v) => /-/.test(v.tex || '')],
  ['A', 'Z', 1, 'min', 'Aftrekken in ℤ'],
  ['A', 'Z', 2, 'ketting', 'Vermenigvuldigen en delen in ℤ'],
  ['A', 'Z', 3, 'haakjes', 'Machten (−a)ⁿ'],
  ['A', 'Z', 4, 'vierkant', 'Vierkantswortels in ℤ'],
  ['A', 'Z', 7, 'getalwaarde', 'Getalwaarde in ℤ'],

  ['A', 'Q', 2, 'decimaal', 'Afronden'],
  ['A', 'Q', 3, 'vereenvoudig', 'Breuk vereenvoudigen'],
  ['A', 'Q', 4, 'naarBreuk', 'Percentage → breuk'],
  ['A', 'Q', 5, 'aflezen', 'Breuk op de getallenas'],
  ['A', 'Q', 6, 'som', 'Breuken optellen en aftrekken'],
  ['A', 'Q', 7, 'maal', 'Breuken vermenigvuldigen'],

  ['A', 'R', 1, 'qofr', 'Rationaal of irrationaal'],
  ['A', 'R', 2, 'derde', 'Derdemachtswortel'],
  ['A', 'R', 3, 'vereenvoudig', 'Wortel vereenvoudigen'],
  ['A', 'R', 3, 'optellen', 'Wortels optellen'],
  ['A', 'R', 4, 'naarinterval', 'Ongelijkheid → interval'],
  ['A', 'R', 6, 'bereken', 'Logaritme berekenen'],

  // ---------- Deel B · Uitdagend (16)
  ['B', 'N', 1, 'log', 'Volgorde met logaritmen'],
  ['B', 'N', 4, 'vraagstuk', 'Vraagstuk met procenten'],
  ['B', 'N', 5, 'soortVerband', 'Recht of omgekeerd evenredig'],
  ['B', 'N', 5, 'omgekeerd', 'Omgekeerde evenredigheid'],

  ['B', 'Z', 5, 'gemengd', 'Volgorde van de bewerkingen in ℤ'],
  ['B', 'Z', 3, 'zonder', 'Machten −aⁿ'],
  ['B', 'Z', 8, 'regels', 'Rekenregels met machten'],
  ['B', 'Z', 8, 'uitwerken', 'Uitwerken en vereenvoudigen', (v) => !/\^\{1\}|(^|[^0-9])1[a-z]|\+ -/.test(v.tex || '')],

  ['B', 'Q', 7, 'deel', 'Breuken delen'],
  ['B', 'Q', 8, 'macht', 'Machten van breuken (negatieve exponent)'],
  ['B', 'Q', 9, 'gemengd', 'Volgorde van de bewerkingen in ℚ'],
  ['B', 'Q', 10, 'gemengd', 'Repeterend decimaal getal → breuk'],

  ['B', 'R', 3, 'eerstvereenv', 'Eerst vereenvoudigen, dan optellen'],
  ['B', 'R', 3, 'wortelvrij', 'Noemer wortelvrij maken'],
  ['B', 'R', 5, 'machtsvorm', 'Wortel → macht met rationale exponent'],
  ['B', 'R', 9, 'haakjes', 'Vergelijking met haakjes'],
];

// Elke vraag wordt een eigen "soort" (A01 … B16), zodat de test exact deze volgorde krijgt.
const SOORTEN = {}, SAMENSTELLING = [];
VRAGEN.forEach(([niv, dom, deelnr, soort, naam, ok], i) => {
  const D = DOMEINEN.find(x => x.k === dom);
  const sleutel = niv + String(i + 1 - (niv === 'B' ? 24 : 0)).padStart(2, '0');
  SOORTEN[sleutel] = {
    naam: `${D.teken} · ${naam}`,
    gen() {
      const P = Leerpaden.vind(D.leerpad);
      const deel = P && P.delen.find(d => d.nr === deelnr);
      const S = deel && deel.soorten[soort];
      if (!S) throw new Error(`Instaptoets: vraag ${sleutel} niet gevonden (${D.leerpad}, deel ${deelnr}, ${soort})`);
      let v, n = 0;
      do { v = S.gen(); } while (ok && !ok(v) && n++ < 50);
      return { ...v, soort: sleutel, domein: dom, niveau: niv, opdracht: v.opdracht || S.opdracht || deel.opdracht || 'Bereken.',
        kop: `${NIVEAUS.find(x => x.k === niv).naam} — ${D.naam} ${D.teken}` };
    },
  };
  SAMENSTELLING.push([sleutel, 1]);
});

const INSTAP = {
  nr: 1, titel: 'Instaptoets getallenleer', kort: 'Eén toets van 40 vragen over ℕ, ℤ, ℚ en ℝ, zonder rekenmachine.', rekenmachine: false,
  theorie: '', voorbeelden: [],
  soorten: SOORTEN, oefenMix: SAMENSTELLING, test: SAMENSTELLING, testSchudden: false,
};

Leerpaden.registreer({
  code: 'instaptoets-7vjho', titel: 'Instaptoets getallenleer', ondertitel: 'Wiskunde · 7VJHO', klas: '7VJHO',
  drempel: 70,          // 70% of meer = gevorderd
  eenmalig: true,       // één poging; de leerkracht kan een nieuwe poging geven
  instaptoets: {
    domeinen: DOMEINEN, niveaus: NIVEAUS,
    uitslag: [
      { min: 0, naam: 'Beginner', kleur: 'oranje',
        leerling: 'Je start met de leerpaden voor <b>beginners</b>: daar bouwen we alles stap voor stap op, vanaf de basis.' },
      { min: 70, naam: 'Gevorderd', kleur: 'groen',
        leerling: 'Je start met de leerpaden voor <b>gevorderden</b> (de +-leerpaden): die gaan sneller en dieper.' },
    ],
  },
  intro: `<p>Welkom in het 7de jaar! Met deze <b>instaptoets</b> kijken we wat je al kan van getallenleer:
    rekenen met natuurlijke getallen (ℕ), gehele getallen (ℤ), rationale getallen (ℚ) en reële getallen (ℝ).
    Zo kan je leerkracht je het leerpad geven dat bij jou past.</p>
    <p>Het is <b>geen examen</b>: je krijgt er geen punten voor op je rapport. Doe gewoon je best en probeer elke vraag.
    Weet je iets echt niet, ga dan gerust naar de volgende vraag.</p>`,
  delen: [INSTAP],
});
})();
