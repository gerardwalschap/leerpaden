// Functie of niet? — flitsquiz tegen de klok bij functieleer 1–4 (7VJHO).
// Alle vragen komen rechtstreeks uit het leerpad Functieleer (delen 1–4): zelfde opgaven, invoer en verbetering.
window.THEMA = {
  programma: 'functieleer', sleutel: 'functie-of-niet-v1', icoon: '⚡',
  titel: 'Functie of niet?', ondertitel: 'Functieleer · delen 1 tot 4',
  intro: `<p class="muted">Een flitsquiz tegen de klok over wat een functie is, functiewaarden, domein en bereik, tekentabel en verloopschema.
    Hoe sneller je juist antwoordt, hoe meer bonuspunten (is de tijdsbalk leeg, dan mag je nog rustig verder denken). Drie juist na elkaar? Extra punten!</p>`,
  levels: [
    { id: 'f1', naam: 'Functie of niet?', kort: 'Verticale-rechte-test en tabellen', n: 8, nodig: 6, tijd: 25,
      uitleg: 'Bij elke $x$ hoort <b>hoogstens één</b> $y$. Grafiek: snijdt elke verticale rechte de grafiek hoogstens één keer?',
      bron: [[1, 'grafiek', 3], [1, 'tabel', 2], [1, 'machine', 1]] },
    { id: 'f2', naam: 'Invoer en uitvoer', kort: 'Voorspellen · onafhankelijk of afhankelijk · gemeten of berekend', n: 6, nodig: 5, tijd: 25,
      bron: [[1, 'voorspel', 1], [1, 'veranderlijke', 1], [1, 'empirisch', 1]] },
    { id: 'f3', naam: 'Functiewaarden', kort: 'Berekenen, aflezen en opzoeken in een tabel', n: 6, nodig: 5, tijd: 50,
      uitleg: 'Vervang $x$ door het getal en reken uit. Een negatief getal zet je <b>tussen haakjes</b>.',
      bron: [[2, 'bereken', 2], [2, 'aflezen', 2], [2, 'tabel', 1]] },
    { id: 'f4', naam: 'Voor welke x?', kort: 'Omgekeerd: zoek de x bij een gegeven functiewaarde', n: 6, nodig: 5, tijd: 50,
      bron: [[2, 'omgekeerd', 2], [2, 'aflezen', 1]] },
    { id: 'f5', naam: 'Domein en bereik', kort: 'De schaduw op de x-as en op de y-as', n: 6, nodig: 5, tijd: 60,
      uitleg: 'Domein: alle $x$-waarden van de grafiek. Bereik: alle $y$-waarden. Typ bv. <code>[-3, 4[</code> of gebruik de knoppen.',
      bron: [[3, 'lees', 2], [3, 'domein', 1], [3, 'bereik', 1]] },
    { id: 'f6', naam: 'Tekentabel en verloopschema', kort: 'Kies de juiste samenvatting van de grafiek', n: 6, nodig: 5, tijd: 40,
      bron: [[4, 'tekentabel', 1], [4, 'verloop', 1]] },
    { id: 'f7', naam: 'Nulwaarden en extrema', kort: 'Waar snijdt de grafiek de x-as? Waar ligt een max of min?', n: 6, nodig: 5, tijd: 50,
      bron: [[4, 'nulwaarden', 1], [4, 'extremum', 1]] },
  ],
};
TM.start();
