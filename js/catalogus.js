// ====================================================================
//  CATALOGUS — de structuur van het platform: klas → vak → hoofdstuk.
//
//  Hier staat GEEN leerinhoud en niets over leerlingen; enkel waar elk
//  leerpad thuishoort. Welke leerling een leerpad ziet, bepaal je nog
//  altijd zelf op de leerkrachtpagina (koppelen).
//
//  Een nieuw leerpad toevoegen:
//    1. het programmabestand in programmas/ (zoals vroeger);
//    2. de code van het leerpad bij het juiste hoofdstuk zetten, bv.
//         leerpaden: ['remediering-vergelijkingen']
//  Hoofdstukken zonder leerpad ziet enkel de leerkracht ("nog te maken").
// ====================================================================
window.CATALOGUS = {

  // Klassen. Een leerling hoort bij een klas als zijn klasnaam ermee begint
  // (bv. "7VJHOa" en "7VJHOb" horen bij 7VJHO).
  klassen: [
    { code: '4BW',   vakken: ['twisk-4bw', 'wisk-4bw-mww'] },
    { code: '4MWW',  vakken: ['wisk-4bw-mww'] },
    { code: '5BCW',  vakken: ['twisk-5bcw', 'wisk-5bcw-ww'] },
    { code: '5WW',   vakken: ['wisk-5bcw-ww'] },
    { code: '7VJHO', vakken: ['wisk-7vjho'] },
  ],

  // Vakken = de wiskundemappen in OneDrive > Vakken.
  vakken: {
    'twisk-4bw': {
      naam: 'Toegepaste wiskunde', map: 'TWISKUNDE 4BW',
      hoofdstukken: [
        { nr: 1, titel: 'Tweedegraadsvergelijkingen', sub: 'Merkwaardige producten · Ontbinden in factoren · Discriminant',
          leerpaden: ['merkwaardige-producten-ontbinden'] },
        { nr: 2, titel: 'Tweedegraadsongelijkheden', sub: 'Grafisch oplossen · Tekenschema · Algebraïsch oplossen',
          leerpaden: ['tweedegraadsongelijkheden'] },
        { nr: 3, titel: 'Tweedegraadsfuncties: transformaties en kenmerken', sub: 'Verschuiven · Rek en spiegeling · Topvorm · Kwadraat afsplitsen · Functieoverzicht',
          leerpaden: ['tweedegraadsfuncties-transformaties'] },
        { nr: 4, titel: 'De functie c/x' },
        { nr: 5, titel: 'De homothetie' },
        { nr: 6, titel: 'De stelling van Thales' },
        { nr: 7, titel: 'Goniometrische formules' },
        { nr: 8, titel: 'Sinus- en cosinusregel' },
        { nr: 9, titel: 'Vectoren (uitdieping)' },
        { nr: 10, titel: 'Meetkundige constructies' },
        { nr: 11, titel: 'Statistiek (uitdieping)' },
      ],
    },
    'wisk-4bw-mww': {
      naam: 'Wiskunde', map: 'WISKUNDE 4BW_MWW',
      hoofdstukken: [
        { nr: 1, titel: 'Logica', sub: 'Herhaling · Logische poorten · Schakelingen · Domotica',
          leerpaden: ['logica'] },
        { nr: 2, titel: 'Stelsels van vergelijkingen', sub: 'Grafisch · Gelijkstelling · Substitutie · Combinatie · Vraagstukken',
          leerpaden: ['stelsels', 'remediering-vergelijkingen'] },
        { nr: 3, titel: 'Tweedegraadsfuncties', sub: 'f(x) = ax² · Invloed van a · Kenmerken · Toepassingen',
          leerpaden: ['tweedegraadsfuncties-ax2'] },
        { nr: 4, titel: 'Vectoren', sub: 'Gelijke en tegengestelde vectoren · Som · k·a · Verschil · Verschuivingen · Context',
          leerpaden: ['vectoren'] },
        { nr: 5, titel: 'Telproblemen' },
        { nr: 6, titel: 'Ruimtemeetkunde' },
        { nr: 7, titel: 'Statistiek' },
      ],
    },
    'twisk-5bcw': {
      naam: 'Toegepaste wiskunde', map: 'TWISKUNDE 5BCW',
      hoofdstukken: [
        { nr: 1, titel: 'Tweedegraadsfuncties' },
        { nr: 2, titel: 'Complexe getallen', sub: 'Complexe vlak · Cartesische en goniometrische vorm · De Moivre · Vergelijkingen',
          leerpaden: ['complexe-getallen'] },
        { nr: 3, titel: 'Matrices en stelsels' },
        { nr: 4, titel: 'Sinus- en cosinusregel' },
        { nr: 5, titel: 'Afgeleiden' },
      ],
    },
    'wisk-5bcw-ww': {
      naam: 'Wiskunde', map: 'WISKUNDE 5BCW_WW',
      hoofdstukken: [
        { nr: 1, titel: 'Reële getallen', sub: 'n-de machtswortels · Logaritmen',
          extern: [{ titel: 'Remediëring machten en wortels', url: 'https://gerardwalschap.github.io/remediering-wortels/',
                     opm: 'staat nog op het oude platform (eigen databank) — later te verhuizen' }] },
        { nr: 2, titel: 'Veeltermfuncties' },
        { nr: 3, titel: 'Rationale functies', sub: 'In context: kenmerken interpreteren · Praktisch domein · Kritisch kijken · Schetsen · Modellen aanpassen',
          leerpaden: ['rationale-functies-context'] },
        { nr: 4, titel: 'Machtswortelfuncties' },
        { nr: 5, titel: 'Sinusfuncties' },
        { nr: 6, titel: 'Afgeleiden' },
        { nr: 7, titel: 'Statistiek' },
      ],
    },
    'wisk-7vjho': {
      naam: 'Wiskunde', map: 'WISKUNDE 7VJHO',
      hoofdstukken: [
        { nr: 1, titel: 'Getallenleer', sub: 'Rekenen in ℕ, ℤ, ℚ en ℝ',
          leerpaden: ['getallenleer-n', 'getallenleer-z', 'getallenleer-q', 'reele-getallen'] },
        { nr: 2, titel: 'Functieleer', sub: 'Functies · Domein en bereik · ax + b · Exponentiële functies',
          leerpaden: ['functieleer'] },
        { nr: 3, titel: 'Kansrekenen en statistiek' },
      ],
    },
  },
};

// ---------- Hulpfuncties (gebruikt door leerlingen- en leerkrachtpagina)
window.Catalogus = (() => {
  const C = window.CATALOGUS;
  const norm = (s) => String(s || '').replace(/\s+/g, '').toUpperCase();

  // Bij welke klas hoort een leerling met deze klasnaam? (langste overeenkomst wint)
  function klasVan(klasnaam) {
    const k = norm(klasnaam);
    return C.klassen.filter(x => k.startsWith(norm(x.code))).sort((a, b) => b.code.length - a.code.length)[0] || null;
  }
  // Alle plaatsen (vak + hoofdstuk) waar een leerpad staat.
  function plaatsenVan(code) {
    const uit = [];
    for (const [vak, V] of Object.entries(C.vakken))
      for (const h of V.hoofdstukken)
        if ((h.leerpaden || []).includes(code)) uit.push({ vak, V, h });
    return uit;
  }
  // Beste plaats voor een leerling: liefst in een vak van zijn eigen klas.
  function plaatsVoor(code, klasnaam) {
    const p = plaatsenVan(code), kl = klasVan(klasnaam);
    return (kl && p.find(x => kl.vakken.includes(x.vak))) || p[0] || null;
  }
  // Klassen die een vak volgen (voor de titel, bv. "4BW · 4MWW").
  const klassenMetVak = (vak) => C.klassen.filter(k => k.vakken.includes(vak)).map(k => k.code);
  // Hoort een leerling (klasnaam) bij klas k?
  const inKlas = (klasnaam, k) => { const kl = klasVan(klasnaam); return !!kl && kl.code === k; };

  return { C, klasVan, plaatsenVan, plaatsVoor, klassenMetVak, inKlas };
})();
