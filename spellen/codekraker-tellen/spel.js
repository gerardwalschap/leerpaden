// Codekraker tellen — themaspel bij Telproblemen (7VJHO, deel 3.1.1).
// Zes kluizen, één per telregel uit de PWP. Alle vragen komen rechtstreeks uit het leerpad
// Telproblemen en kansrekenen (delen 1–6): zelfde opgaven, invoer en verbetering.
window.THEMA = {
  programma: 'telproblemen-kansen', sleutel: 'codekraker-tellen-v1', icoon: '🔐',
  titel: 'Codekraker tellen', ondertitel: 'Telproblemen',
  woord: { level: 'kluis', levels: 'kluizen', Level: 'Kluis' },
  intro: `<p class="muted">In het telmuseum staan zes kluizen. Elke kluis gaat open met één telregel.
    Kraak ze één voor één: haal genoeg opdrachten juist en de volgende kluis gaat open. De laatste kluis is de moeilijkste: daar moet je zelf kiezen welke regel past.</p>`,
  levels: [
    { id: 'k1', naam: 'Kluis 1 · Het boomdiagram', kort: 'Elk pad is één mogelijkheid: tel de eindpunten', n: 5, nodig: 4,
      uitleg: 'Teken (in gedachten of op papier) een boomdiagram. Het aantal <b>eindpunten</b> is het aantal mogelijkheden.',
      bron: [[1, 'keuzes', 1], [1, 'munt', 1], [1, 'zakje', 1], [1, 'match', 1]] },
    { id: 'k2', naam: 'Kluis 2 · De productregel', kort: 'Na elkaar kiezen (EN) → vermenigvuldigen', n: 5, nodig: 4,
      uitleg: 'Je maakt <b>na elkaar</b> keuzes: keuze 1 <b>én</b> keuze 2 <b>én</b> … → vermenigvuldig de aantallen.',
      bron: [[2, 'outfit', 1], [2, 'code', 2], [2, 'rangschik', 1], [2, 'route', 1], [2, 'getallen', 1]] },
    { id: 'k3', naam: 'Kluis 3 · De somregel', kort: 'Het ene OF het andere → optellen', n: 5, nodig: 4,
      uitleg: 'Je kiest het ene <b>of</b> het andere (zonder overlap) → tel de aantallen op.',
      bron: [[3, 'of', 1], [3, 'routes', 1], [3, 'combi', 1], [3, 'regel', 1]] },
    { id: 'k4', naam: 'Kluis 4 · Het venndiagram', kort: 'Wat in beide zit, tel je maar één keer', n: 5, nodig: 4,
      bron: [[4, 'symbool', 1], [4, 'context', 2], [4, 'beide', 1], [4, 'drie', 1]] },
    { id: 'k5', naam: 'Kluis 5 · De complementregel', kort: 'Tel wat je niet wil en trek af van het totaal', n: 5, nodig: 4,
      uitleg: '<b>Minstens één</b> …? Tel alle mogelijkheden en trek het aantal mogelijkheden met <b>geen enkele</b> af.',
      bron: [[5, 'niet', 1], [5, 'minstens', 2], [5, 'stappen', 1], [5, 'verschillend', 1]] },
    { id: 'k6', naam: 'Kluis 6 · De hoofdkluis', kort: 'Welke regel? Alles door elkaar', n: 6, nodig: 5,
      uitleg: 'Lees goed: <b>EN</b> (product), <b>OF</b> (som), overlap (venndiagram), <b>niet / minstens één</b> (complement).',
      bron: [[6, 'welke', 2], [6, 'bm', 1], [6, 'mu', 1], [6, 'cd', 1], [6, 'rg', 1], [6, 'rt', 1], [6, 'cb', 1], [6, 'vn', 1], [6, 'v3', 1], [6, 'mi', 1]] },
  ],
};
TM.start();
