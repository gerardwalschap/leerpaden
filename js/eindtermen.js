// ====================================================================
//  EINDTERMEN — overzicht: welke wiskundedoelen komen in welk leerpad aan bod?
//
//  Welke doelen bij welke knop horen, staat in js/menu.js (doelen: [...]).
//  Hier staan de volledige omschrijvingen van de doelen en de weergave:
//  een tabel (doelen × leerpaden) in een venster, met een knop om er een PDF van te maken.
//
//  Een knop met  data-eindtermen="wisk-7vjho"  opent het overzicht van dat vak
//  (enkel op de leerkrachtpagina; leerlingen zien dit overzicht niet).
// ====================================================================
window.Eindtermen = (() => {
  // Bron: 7_wiskundedoelen_VJHO.xlsx (basisvorming wiskunde BV3 — Voorbereidend Jaar Hoger Onderwijs)
  const DOELEN = {
    'wisk-7vjho': {
      titel: 'Wiskundedoelen 7VJHO', bron: 'Basisvorming wiskunde (BV3) — Voorbereidend Jaar Hoger Onderwijs',
      lijst: [
        ['BV3_06.01', 'De leerlingen rekenen met reële getallen.', 'Optelling, aftrekking, vermenigvuldiging, deling, machtsverheffing met gehele exponenten, vierkantsworteltrekking m.i.v. rekenregels en eigenschappen; voorstelling van vierkantsworteltrekking als machtsverheffing met exponent 1/2; schatting grootteorde, afronding'],
        ['BV3_06.02', 'De leerlingen passen de stelling van Pythagoras toe om meetkundige problemen op te lossen in het vlak.'],
        ['BV3_06.03', 'De leerlingen herkennen functies en leggen het verband tussen verschillende representaties van een functie: verwoording, tabel, grafiek en voorschrift.'],
        ['BV3_06.04', 'De leerlingen brengen met behulp van de grafiek, kenmerken van een functie in verband met de betekenisvolle situatie die door de functie beschreven wordt.'],
        ['BV3_06.05', 'De leerlingen bepalen het voorschrift, de grafiek, de tabel en de verwoording van een eerstegraadsfunctie als één van de andere representaties gegeven is.', 'Richtingscoëfficiënt; snijpunt met de y-as'],
        ['BV3_06.06', 'De leerlingen analyseren kenmerken van eerstegraadsfuncties: nulwaarden, tekenverloop, stijgen/dalen.'],
        ['BV3_06.07', 'De leerlingen lossen eerstegraadsvergelijkingen en -ongelijkheden in één onbekende grafisch op.'],
        ['BV3_06.08', 'De leerlingen lossen eerstegraadsvergelijkingen in één onbekende algebraïsch op.'],
        ['BV3_06.09', 'De leerlingen gebruiken modellen voor exponentiële groei.', 'Beginwaarde, groeifactor'],
        ['BV3_06.10', 'De leerlingen lossen telproblemen op met behulp van boomdiagrammen en venndiagrammen.', 'Somregel, productregel, complementregel'],
        ['BV3_06.11', 'De leerlingen bepalen kansen met behulp van boomdiagrammen en de wet van Laplace.', 'Verband tussen relatieve frequentie en kans'],
        ['BV3_06.12', 'De leerlingen verklaren het belang van representativiteit bij steekproeven voor het formuleren van statistische besluiten over een populatie.'],
        ['BV3_06.13', 'De leerlingen gebruiken de normale verdeling als continu model bij gegeven data.', 'Grafische beoordeling van de toepasbaarheid van het model; rekenkundig gemiddelde en standaardafwijking als schatting voor de parameters; grafische betekenis van gemiddelde en standaardafwijking in termen van de Gausskromme; histogram'],
        ['BV3_06.14', 'De leerlingen berekenen kansen bij een normaal verdeelde kansvariabele.'],
        ['BV3_06.15', 'De leerlingen beschrijven fenomenen uit de realiteit aan de hand van wiskundige concepten uit het zevende leerjaar gericht op het hoger onderwijs.'],
        ['BV3_06.16', 'De leerlingen lossen vraagstukken en problemen op door te mathematiseren en demathematiseren en door gebruik te maken van heuristieken.', 'Rekening houdend met concepten uit het zevende leerjaar gericht op het hoger onderwijs.'],
        ['BV3_06.17', 'De leerlingen gebruiken ICT om berekeningen uit te voeren en grafische voorstellingen te maken.', 'Rekening houdend met concepten uit het zevende leerjaar gericht op het hoger onderwijs.'],
      ],
    },
    // Bron: 5_en_6_wiskundedoelen_biotechnologische_en_chemische_wetenschappen.xlsx — enkel de doelen van het 5de jaar
    // (de andere doelen volgen in het 6de jaar). Kolommen = de leerpaden per hoofdstuk uit js/catalogus.js;
    // welke doelen bij welk leerpad horen, staat hieronder in perLeerpad (sleutel = leerpadcode of de titel van een externe link).
    'wisk-5bcw-ww': {
      titel: 'Wiskundedoelen 5BCW · 5WW — wiskunde', bron: 'Basisvorming wiskunde (BV3) — 3de graad doorstroom · doelen van het 5de jaar',
      lijst: [
        ["BV3_06.01", "De leerlingen rekenen met reële getallen.", "Machten met rationale exponent, n-de machtswortels en logaritmen met willekeurig grondtal m.i.v. rekenregels en eigenschappen met symbolen"],
        ["BV3_06.02", "De leerlingen brengen met behulp van de grafiek, kenmerken van een functie in verband met de betekenisvolle situatie die door de functie beschreven wordt."],
        ["BV3_06.03", "De leerlingen interpreteren de afgeleide als limiet van een differentiequotiënt en als richtingscoëfficiënt van de raaklijn aan de grafiek."],
        ["BV3_06.04", "De leerlingen leggen grafisch het verband tussen een functie en haar afgeleide functie."],
        ["BV3_06.08", "De leerlingen tekenen de grafiek van de functie f(x)=sin x vanuit de goniometrische cirkel."],
        ["BV3_06.09", "De leerlingen gebruiken transformaties van de vorm f(x)+k, f(x-k), f(x/k) en k·f(x) om de grafiek van een algemene sinusfunctie f(x)=a·sin[b(x-c)]+d op te bouwen vanuit de grafiek van f(x)=sin x."],
        ["BV3_06.10", "De leerlingen analyseren kenmerken van een algemene sinusfunctie aan de hand van de grafiek: domein, bereik, nulwaarden, tekenverloop, stijgen/dalen, extrema, symmetrie, periodiciteit en amplitude."],
        ["BV3_06.11", "De leerlingen lossen vergelijkingen grafisch op met behulp van ICT."],
        ["BV3_06.14", "De leerlingen verklaren het belang van randomisatie en representativiteit bij steekproeven voor het formuleren van statistische besluiten over een populatie.", "Variabiliteit van steekproeven; aselecte steekproef"],
        ["BV3_06.15", "De leerlingen leggen in concrete situaties het verschil uit tussen samenhang en causaliteit."],
        ["BV3_06.18", "De leerlingen beschrijven fenomenen uit de realiteit aan de hand van wiskundige concepten uit de derde graad."],
        ["BV3_06.19", "De leerlingen beargumenteren wiskundige redeneringen.", "Rekening houdend met concepten van de derde graad."],
        ["BV3_06.20", "De leerlingen lossen vraagstukken en problemen op door te mathematiseren en demathematiseren en door gebruik te maken van heuristieken.", "Rekening houdend met concepten van de derde graad."],
        ["BV3_06.21", "De leerlingen gebruiken ICT om berekeningen uit te voeren en grafische voorstellingen te maken.", "Rekening houdend met concepten van de derde graad."],
      ],
      perLeerpad: {
        'Remediëring machten en wortels': ['BV3_06.01', 'BV3_06.21'],
        'veeltermfuncties-context': ['BV3_06.02', 'BV3_06.18', 'BV3_06.19', 'BV3_06.20', 'BV3_06.21'],
        'rationale-functies-context': ['BV3_06.02', 'BV3_06.18', 'BV3_06.19', 'BV3_06.20', 'BV3_06.21'],
        'machtswortelfuncties': ['BV3_06.01', 'BV3_06.02', 'BV3_06.18', 'BV3_06.20'],
        'sinusfunctie': ['BV3_06.02', 'BV3_06.08', 'BV3_06.09', 'BV3_06.10', 'BV3_06.11', 'BV3_06.18', 'BV3_06.21'],
        'afgeleiden': ['BV3_06.03', 'BV3_06.04', 'BV3_06.18', 'BV3_06.20'],
        'statistiek-gegroepeerd': ['BV3_06.18', 'BV3_06.21'],
        'steekproeven-samenhang': ['BV3_06.14', 'BV3_06.15', 'BV3_06.18', 'BV3_06.19'],
      },
    },
    'twisk-5bcw': {
      titel: 'Wiskundedoelen 5BCW — toegepaste wiskunde', bron: 'Uitbreiding wiskunde (WD3) — Biotechnologische & Chemische Wetenschappen · doelen van het 5de jaar',
      lijst: [
        ["WD3_06.04.01", "De leerlingen stellen complexe getallen voor in het vlak."],
        ["WD3_06.04.02", "De leerlingen voeren bewerkingen met complexe getallen in cartesische vorm uit: optelling, aftrekking, vermenigvuldiging en deling."],
        ["WD3_06.04.03", "De leerlingen zetten complexe getallen in cartesische vorm om naar goniometrische vorm en omgekeerd."],
        ["WD3_06.04.04", "De leerlingen voeren de vermenigvuldiging, de deling en de machtsverheffing van complexe getallen in goniometrische vorm uit.", "Goniometrische formules: somformules, verschilformules, verdubbelingsformules; formule van de Moivre; meetkundige betekenis van de complexe vermenigvuldiging"],
        ["WD3_06.04.05", "De leerlingen lossen tweedegraadsvergelijkingen met reële coëfficiënten in één onbekende op in de verzameling van de complexe getallen."],
        ["WD3_06.04.06", "De leerlingen voeren bewerkingen uit met matrices: optelling, scalaire vermenigvuldiging, matrixvermenigvuldiging, machtsverheffing en transpositie."],
        ["WD3_06.04.07", "De leerlingen gebruiken matrixmodellen om evoluties te beschrijven.", "Matrixvoorstelling van een graaf"],
        ["WD3_06.04.08", "De leerlingen lossen stelsels van eerstegraadsvergelijkingen op met behulp van de methode van Gauss-Jordan."],
        ["WD3_06.04.17", "De leerlingen definiëren afgeleide in een punt en afgeleide functie.", "Verband tussen continuïteit en afleidbaarheid"],
        ["WD3_06.04.18", "De leerlingen berekenen de afgeleide functie van functies die zijn opgebouwd uit veeltermfuncties, rationale functies, elementaire irrationale functies, exponentiële functies, logaritmische functies en goniometrische functies.", "Rekenregels: afgeleide van een som, product, quotiënt van functies en afgeleide van een samengestelde functie (kettingregel)"],
        ["WD3_06.04.30", "De leerlingen bepalen het voorschrift of de grafiek van een tweedegraadsfunctie als de andere representatie gegeven is.", "Voorschrift f(x)=a(x-p)²+q; voorschrift f(x)=ax²+bx+c"],
        ["WD3_06.04.31", "De leerlingen analyseren kenmerken van tweedegraadsfuncties: domein, bereik, nulwaarden, tekenverloop, stijgen/dalen, extremum, toenemende/afnemende stijging/daling en symmetrie ten opzichte van een verticale rechte."],
        ["WD3_06.04.32", "De leerlingen lossen tweedegraadsvergelijkingen in één onbekende in de verzamelingen van de reële getallen algebraïsch en grafisch op.", "Ontbinding in factoren; discriminant"],
        ["WD3_06.04.33", "De leerlingen lossen tweedegraadsongelijkheden in één onbekende algebraïsch op."],
        ["WD3_06.04.34", "De leerlingen gebruiken de sinus- en cosinusregel om meetkundige problemen op te lossen."],
      ],
      perLeerpad: {
        'tweedegraadsfuncties-5bcw': ['WD3_06.04.30', 'WD3_06.04.31', 'WD3_06.04.32', 'WD3_06.04.33'],
        'complexe-getallen': ['WD3_06.04.01', 'WD3_06.04.02', 'WD3_06.04.03', 'WD3_06.04.04', 'WD3_06.04.05'],
        'matrices-stelsels': ['WD3_06.04.06', 'WD3_06.04.07', 'WD3_06.04.08'],
        'sinus-cosinusregel': ['WD3_06.04.34'],
        'afgeleiden-rekenregels': ['WD3_06.04.17', 'WD3_06.04.18'],
      },
    },
    // Bron: 3en4_wiskundedoelen_biotechnologische_wetenschappen.xlsx — basisvorming BV2, enkel de doelen die in het 4de jaar aan bod komen
    // (de andere BV2-doelen kwamen in het 3de jaar aan bod).
    'wisk-4bw-mww': {
      titel: 'Wiskundedoelen 4BW · 4MWW — wiskunde', bron: 'Basisvorming wiskunde (BV2) — 2de graad doorstroom · doelen van het 4de jaar',
      lijst: [
        ["BV2_06.04", "De leerlingen bepalen de onderlinge ligging van twee rechten, twee vlakken en een rechte en een vlak in ruimtelijke situaties."],
        ["BV2_06.09", "De leerlingen tekenen in het vlak de som van vectoren en de vermenigvuldiging van een vector met een getal."],
        ["BV2_06.10", "De leerlingen lossen eerstegraadsvergelijkingen en -ongelijkheden in één onbekende algebraïsch en grafisch op."],
        ["BV2_06.15", "De leerlingen analyseren kenmerken van tweedegraadsfuncties van de vorm f(x)=ax²: domein, bereik, nulwaarden, tekenverloop, stijgen/dalen, extremum, toenemende/afnemende stijging/daling en symmetrie ten opzichte van een verticale rechte."],
        ["BV2_06.16", "De leerlingen lossen stelsels van twee eerstegraadsvergelijkingen in twee onbekenden algebraïsch en grafisch op."],
        ["BV2_06.17", "De leerlingen lossen telproblemen op met behulp van boomdiagrammen en venndiagrammen."],
        ["BV2_06.18", "De leerlingen analyseren statistische gegevens aan de hand van voorstellingswijzen en centrum- en spreidingsmaten."],
        ["BV2_06.19", "De leerlingen bepalen de waarheidswaarde van logische uitspraken met behulp van waarheidstabellen."],
        ["BV2_06.20", "De leerlingen beargumenteren wiskundige redeneringen en maken daarbij ook gebruik van eigenschappen of van een tegenvoorbeeld."],
        ["BV2_06.21", "De leerlingen beschrijven fenomenen uit de realiteit aan de hand van wiskundige concepten uit de tweede graad."],
        ["BV2_06.22", "De leerlingen lossen vraagstukken en problemen op door te mathematiseren en demathematiseren en door gebruik te maken van heuristieken."],
        ["BV2_06.23", "De leerlingen gebruiken ICT om berekeningen uit te voeren en grafische voorstellingen te maken."],
      ],
      perLeerpad: {
        'logica': ['BV2_06.19', 'BV2_06.20'],
        'stelsels': ['BV2_06.16', 'BV2_06.21', 'BV2_06.22'],
        'remediering-vergelijkingen': ['BV2_06.10'],
        'tweedegraadsfuncties-ax2': ['BV2_06.15', 'BV2_06.21'],
        'tweedegraadsfuncties-contexten': ['BV2_06.15', 'BV2_06.21', 'BV2_06.22'],
        'tweedegraadsfuncties-contexten-plus': ['BV2_06.15', 'BV2_06.20', 'BV2_06.21', 'BV2_06.22'],
        'vectoren': ['BV2_06.09', 'BV2_06.21'],
        'telproblemen': ['BV2_06.17', 'BV2_06.22'],
        'ruimtemeetkunde': ['BV2_06.04', 'BV2_06.20'],
        'statistiek-gegroepeerd': ['BV2_06.18', 'BV2_06.23'],
        'steekproeven-samenhang': ['BV2_06.18', 'BV2_06.20', 'BV2_06.21'],
      },
    },
    // Bron: 3en4_wiskundedoelen_biotechnologische_wetenschappen.xlsx — uitbreiding WD2 (specifiek Biotechnologische Wetenschappen)
    'twisk-4bw': {
      titel: 'Wiskundedoelen 4BW — toegepaste wiskunde', bron: 'Uitbreiding wiskunde (WD2) — Biotechnologische Wetenschappen',
      lijst: [
        ["WD2_06.04.01", "De leerlingen bepalen het beeld van een vlakke figuur onder een homothetie."],
        ["WD2_06.04.02", "De leerlingen gebruiken de stelling van Thales om meetkundige problemen op te lossen."],
        ["WD2_06.04.03", "De leerlingen gebruiken goniometrische formules om uitdrukkingen te vereenvoudigen."],
        ["WD2_06.04.04", "De leerlingen gebruiken de sinus- en cosinusregel om meetkundige problemen op te lossen."],
        ["WD2_06.04.05", "De leerlingen rekenen met vectoren in het vlak."],
        ["WD2_06.04.06", "De leerlingen voeren meetkundige constructies uit met passer en lineaal."],
        ["WD2_06.04.07", "De leerlingen lossen tweedegraadsvergelijkingen in één onbekende in de verzameling van de reële getallen algebraïsch en grafisch op."],
        ["WD2_06.04.08", "De leerlingen lossen tweedegraadsongelijkheden in één onbekende algebraïsch en grafisch op."],
        ["WD2_06.04.09", "De leerlingen gebruiken transformaties f(x)+k, f(x+k) en k·f(x) om grafieken op te bouwen vanuit de grafieken van f(x)=x², f(x)=1/x, f(x)=√x en f(x)=x³."],
        ["WD2_06.04.10", "De leerlingen bepalen het voorschrift of de grafiek van een tweedegraadsfunctie als de andere representatie gegeven is."],
        ["WD2_06.04.11", "De leerlingen analyseren kenmerken van tweedegraadsfuncties: domein, bereik, nulwaarden, tekenverloop, stijgen/dalen, extremum, toenemende/afnemende stijging/daling en symmetrie ten opzichte van een verticale rechte."],
        ["WD2_06.04.12", "De leerlingen leggen het verband tussen de grafiek van de functie f(x)=c/x en haar kenmerken: domein, bereik, nulwaarden, tekenverloop, stijgen/dalen, toenemende/afnemende stijging/daling, symmetrie, horizontaal en verticaal asymptotisch gedrag."],
        ["WD2_06.04.13", "De leerlingen analyseren het verband tussen twee numerieke grootheden in een dataset met behulp van een spreidingsdiagram."],
      ],
      perLeerpad: {
        'merkwaardige-producten-ontbinden': ['WD2_06.04.07'],
        'tweedegraadsongelijkheden': ['WD2_06.04.08'],
        'tweedegraadsfuncties-transformaties': ['WD2_06.04.09', 'WD2_06.04.10', 'WD2_06.04.11'],
        'functie-c-op-x': ['WD2_06.04.09', 'WD2_06.04.12'],
        'homothetie': ['WD2_06.04.01'],
        'thales': ['WD2_06.04.02'],
        'goniometrische-formules': ['WD2_06.04.03'],
        'sinus-cosinusregel-4bw': ['WD2_06.04.04'],
        'vectoren-coordinaten': ['WD2_06.04.05'],
        'meetkundige-constructies': ['WD2_06.04.06'],
        'spreidingsdiagrammen': ['WD2_06.04.13'],
      },
    },
  };
  // Korte kolomkoppen (de tegel staat erboven); volledige naam bij aanwijzen.
  const KORT = { 'proeftoets getallenleer': 'Proef\u00adtoets', 'wat is een functie?': 'Functies', 'eerstegraadsfuncties': 'Eerste\u00adgraads', 'exponentiële functies': 'Expo\u00adnentieel',
    'eindtest functieleer': 'Test', 'wat zijn reële functies?': 'Functies', 'functiewaarden en functiewaardentabel': 'Functie\u00adwaarden', 'domein en bereik': 'Domein', 'tekentabel en verloopschema': 'Teken/\u00adverloop', 'de functies f(x) = c en f(x) = ax': 'c en ax', 'de functie f(x) = ax + b': 'ax + b', 'functievoorschrift opstellen': 'Voor\u00adschrift', 'vergelijkingen en ongelijkheden grafisch oplossen': 'Grafisch oplossen', 'differentiecoëfficiënt en hellingshoek': 'Helling', 'eindtest': 'Test', 'telproblemen': 'Tellen', 'kansrekenen': 'Kansen', 'steekproeven': 'Steek\u00adproef', 'gegevens verwerken': 'Gege\u00advens', 'de normale verdeling': 'Normaal' };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const heeft = (vak) => !!(DOELEN[vak] && ((window.MENUS && window.MENUS[vak]) || (DOELEN[vak].perLeerpad && window.CATALOGUS && window.CATALOGUS.vakken[vak])));

  // Kolommen: de knoppen van het menu (per tegel) met doelen; +-versies hebben dezelfde doelen als het gewone leerpad.
  function kolommen(vak) {
    if (!(window.MENUS && window.MENUS[vak])) return kolommenCatalogus(vak);
    const groepen = [];
    for (const T of (window.MENUS[vak].tegels || [])) {
      const kn = (T.knoppen || []).filter(k => (k.doelen || []).length && !k.plus);
      if (!kn.length) continue;
      groepen.push({ titel: `${T.nr}. ${T.titel}`, kol: kn.map(k => {
        const P = k.leerpad && typeof Leerpaden !== 'undefined' ? Leerpaden.vind(k.leerpad) : null;
        let naam = k.titel || (P ? P.titel : k.leerpad);
        if (k.teken && !k.titel) naam = `In ${k.teken}`;
        naam = KORT[String(naam).toLowerCase()] || naam;
        return { naam: (k.ster ? '★ ' : '') + naam, volledig: k.titel || (P ? P.titel : ''), doelen: k.doelen, plus: (T.knoppen || []).some(x => x.plus && x.teken && x.teken === k.teken) };
      }) });
    }
    return groepen;
  }

  // Korte kolomkoppen voor leerpaden uit de catalogus (volledige titel bij aanwijzen).
  const KORTL = { 'merkwaardige-producten-ontbinden': 'Verge\u00adlijkingen', 'tweedegraadsongelijkheden': 'Onge\u00adlijkheden', 'tweedegraadsfuncties-transformaties': 'Trans\u00adformaties',
    'functie-c-op-x': 'f(x) = c/x', 'homothetie': 'Homo\u00adthetie', 'thales': 'Thales', 'goniometrische-formules': 'Gonio\u00adformules', 'sinus-cosinusregel-4bw': 'Sinus- en cosinus\u00adregel',
    'vectoren-coordinaten': 'Vectoren', 'meetkundige-constructies': 'Construc\u00adties', 'spreidingsdiagrammen': 'Sprei\u00addings\u00addiagram',
    'logica': 'Logica', 'stelsels': 'Stelsels', 'remediering-vergelijkingen': 'Remedi\u00adëring verge\u00adlijkingen', 'tweedegraadsfuncties-ax2': 'f(x) = ax²',
    'tweedegraadsfuncties-contexten': 'Con\u00adtexten', 'tweedegraadsfuncties-contexten-plus': 'Con\u00adtexten', 'vectoren': 'Vectoren', 'telproblemen': 'Tel\u00adproblemen',
    'ruimtemeetkunde': 'Ruimte\u00admeet\u00adkunde', 'statistiek-gegroepeerd': 'Gegroe\u00adpeerde gegevens', 'steekproeven-samenhang': 'Steek\u00adproeven',
    'veeltermfuncties-context': 'Veelterm\u00adfuncties', 'rationale-functies-context': 'Rationale functies', 'machtswortelfuncties': 'Machts\u00adwortel\u00adfuncties', 'sinusfunctie': 'Sinus\u00adfuncties' };

  // Kolommen voor een vak zonder menu: per hoofdstuk (catalogus) de leerpaden en externe links met doelen.
  function kolommenCatalogus(vak) {
    const D = DOELEN[vak], V = window.CATALOGUS.vakken[vak], kol = [];
    for (const h of V.hoofdstukken) {
      const items = [...(h.extern || []).map(e => ({ sleutel: e.titel, naam: e.titel })),
        ...(h.leerpaden || []).map(c => { const P = typeof Leerpaden !== 'undefined' ? Leerpaden.vind(c) : null; return { sleutel: c, naam: P ? P.titel : c }; })];
      for (const it of items) {
        const doelen = D.perLeerpad[it.sleutel];
        if (doelen && doelen.length) kol.push({ naam: `${h.nr}. ${KORTL[it.sleutel] || (items.length > 1 ? it.naam : h.titel)}`, volledig: it.naam, doelen, plus: /-plus$/.test(it.sleutel) });
      }
    }
    return [{ titel: 'Leerpaden per hoofdstuk', kol }];
  }

  // De tabel (ook gebruikt voor de PDF). voorPdf: vaste breedte en eigen stijl.
  function tabel(vak, voorPdf) {
    const D = DOELEN[vak], G = kolommen(vak), alle = G.flatMap(g => g.kol);
    // 'v' = doel komt aan bod, 'd' = gedeeltelijk (code met * in perLeerpad), '' = niet
    const zit = (k, c) => k.doelen.includes(c) ? 'v' : k.doelen.includes(c + '*') ? 'd' : '';
    const telDoel = (c) => alle.filter(k => zit(k, c)).length;
    const breedCode = D.lijst.some(([c]) => c.length > 10);
    return `<div class="et-wrap${voorPdf ? ' et-pdf' : ''}">
      <style>
        .et-wrap{font-family:Arial,Helvetica,sans-serif;color:#1c2b3a}
        .et-wrap h2{margin:0 0 2px;color:#1c4e8a;font-size:20px}
        .et-wrap .et-sub{font-size:12px;color:#5b6b7d;margin:0 0 12px}
        .et-scroll{overflow-x:auto}
        .et-tabel{border-collapse:collapse;width:100%;font-size:12px;table-layout:fixed}
        .et-tabel th,.et-tabel td{border:1px solid #cfd8e3;padding:5px 6px;vertical-align:middle}
        .et-tabel thead th{background:#1c4e8a;color:#fff;font-weight:bold;text-align:center}
        .et-tabel thead tr.et-kol th{background:#e8eef6;color:#1c4e8a;font-size:10.5px;line-height:1.2;padding:4px 2px;hyphens:manual;overflow-wrap:normal;word-break:normal}
        .et-tabel thead tr.et-kol th.plus::after{content:" +";color:#e8731a;font-weight:bold}
        .et-tabel thead th.et-doel{text-align:left;background:#1c4e8a}
        .et-tabel td.et-code{font-weight:bold;white-space:nowrap;color:#1c4e8a}
        .et-tabel td.et-tekst{line-height:1.3}
        .et-tabel td.et-tekst small{display:block;color:#6b7a8c;font-size:10.5px;margin-top:2px}
        .et-tabel td.et-v{text-align:center;font-size:15px;font-weight:bold;color:#2e7d4f}
        .et-tabel td.et-v.leeg{color:#c6ced8}
        .et-tabel td.et-v.deels{color:#e8731a;font-size:12px}
        .et-tabel tr:nth-child(even) td{background:#f7f9fc}
        .et-tabel td.et-n{text-align:center;color:#5b6b7d}
        .et-tabel td.et-n.nul{color:#b83a2e;font-weight:bold}
        .et-tabel th.et-rand,.et-tabel td.et-rand{border-left:2px solid #1c4e8a}
        .et-leg{font-size:11px;color:#5b6b7d;margin-top:8px}
        .et-pdf{width:1120px;padding:4px}
        .et-pdf .et-tabel{font-size:10px}.et-pdf .et-tabel thead tr.et-kol th{font-size:9.5px}.et-pdf .et-tabel td.et-tekst small{font-size:9px}.et-pdf .et-tabel th,.et-pdf .et-tabel td{padding:3px 4px}
                .et-pdf .et-tabel tr{page-break-inside:avoid}
      </style>
      <h2>🎯 ${esc(D.titel)} — welk doel in welk leerpad?</h2>
      <p class="et-sub">${esc(D.bron)} · G. Walschap · De Resonant${voorPdf ? ' · afgedrukt op ' + new Date().toLocaleDateString('nl-BE') : ''}</p>
      <div class="et-scroll"><table class="et-tabel" style="min-width:${voorPdf ? 0 : 1000}px">
        <colgroup><col style="width:${breedCode ? (voorPdf ? 92 : 104) : (voorPdf ? 74 : 82)}px"><col style="width:${voorPdf ? 300 : 290}px">${alle.map(() => '<col>').join('')}<col style="width:52px"></colgroup>
        <thead>
          <tr><th class="et-doel" colspan="2" rowspan="2">Wiskundedoel</th>${G.map(g => `<th class="et-rand" colspan="${g.kol.length}">${esc(g.titel)}</th>`).join('')}<th rowspan="2" class="et-rand" title="aantal leerpaden">#</th></tr>
          <tr class="et-kol">${G.map(g => g.kol.map((k, i) => `<th class="${i === 0 ? 'et-rand' : ''}${k.plus ? ' plus' : ''}" title="${esc(k.volledig)}">${esc(k.naam)}</th>`).join('')).join('')}</tr>
        </thead>
        <tbody>${D.lijst.map(([c, t, a]) => { const n = telDoel(c); return `<tr><td class="et-code">${esc(c)}</td>
            <td class="et-tekst">${esc(t)}${a ? `<small>${esc(a)}</small>` : ''}</td>
            ${G.map(g => g.kol.map((k, i) => `<td class="et-v${zit(k, c) ? '' : ' leeg'}${zit(k, c) === 'd' ? ' deels' : ''}${i === 0 ? ' et-rand' : ''}"${zit(k, c) === 'd' ? ' title="gedeeltelijk: de rest volgt in het 6de jaar"' : ''}>${zit(k, c) === 'v' ? '✓' : zit(k, c) === 'd' ? '(✓)' : '·'}</td>`).join('')).join('')}
            <td class="et-n et-rand${n ? '' : ' nul'}">${n}</td></tr>`; }).join('')}</tbody>
      </table></div>
      <p class="et-leg">✓ = het doel komt aan bod in dit leerpad.${D.lijst.some(([c]) => alle.some(k => zit(k, c) === 'd')) ? ' <b style="color:#e8731a">(✓)</b> = gedeeltelijk: de rest van het doel volgt in het 6de jaar.' : ''}${G.some(g => g.kol.some(k => k.plus)) ? ' <b style="color:#e8731a">+</b> = geldt ook voor de +-versie voor gevorderden (zelfde doelen, moeilijkere oefeningen).' : ''}</p>
    </div>`;
  }

  function sluit() { const m = document.getElementById('et-venster'); if (m) m.remove(); document.removeEventListener('keydown', esc_); }
  function esc_(e) { if (e.key === 'Escape') sluit(); }

  // Naam van een vak voor de keuzeknoppen, bv. "Wiskunde 5BCW · 5WW" of "Toegepaste wiskunde 5BCW".
  function vakNaam(vak) {
    const V = window.CATALOGUS && window.CATALOGUS.vakken[vak];
    const kl = window.CATALOGUS ? window.CATALOGUS.klassen.filter(k => k.vakken.includes(vak)).map(k => k.code) : [];
    return `${V ? V.naam : vak} ${kl.join(' · ')}`.trim();
  }
  function keuze(actief) {
    return `<div class="et-keuze" style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
      <span class="klein" style="margin-right:4px">Klas en vak:</span>${vakken().map(v => `<button class="${v === actief ? 'oranje' : 'licht'}" data-et-vak="${esc(v)}">${esc(vakNaam(v))}</button>`).join('')}</div>`;
  }

  // vak leeg = eerst kiezen (één knop 🎯 Eindtermen op de leerkrachtpagina)
  function toon(vak) {
    if (vak && !heeft(vak)) return;
    sluit();
    const m = document.createElement('div');
    m.id = 'et-venster'; m.className = 'modaal-achter';
    m.innerHTML = `<div class="modaal" role="dialog" aria-modal="true" aria-label="Eindtermen" style="max-width:1200px;max-height:92vh;overflow:auto">
        <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-bottom:8px">
          ${vak ? '<button class="oranje" data-et="pdf">📄 PDF maken</button>' : ''}<button class="licht" data-et="sluit">Sluiten</button></div>
        ${vak ? '' : '<h2 style="margin:0 0 6px;color:#1c4e8a">🎯 Eindtermen</h2><p class="klein">Van welke klas wil je zien welke wiskundedoelen in welk leerpad aan bod komen?</p>'}
        ${!vak || /leerkracht/.test(location.pathname) ? keuze(vak) : ''}${vak ? tabel(vak, false) : ''}</div>`;
    m.addEventListener('click', (e) => { if (e.target === m) sluit(); });
    m.querySelector('[data-et=sluit]').onclick = sluit;
    m.querySelectorAll('[data-et-vak]').forEach(b => { b.onclick = () => toon(b.dataset.etVak); });
    const knop = m.querySelector('[data-et=pdf]');
    if (knop) knop.onclick = async () => {
      const oud = knop.textContent; knop.disabled = true; knop.textContent = 'PDF wordt gemaakt…';
      try { await pdf(vak); } catch (e) { alert(e.message); }
      knop.disabled = false; knop.textContent = oud;
    };
    document.body.appendChild(m);
    document.addEventListener('keydown', esc_);
  }

  async function pdf(vak) {
    if (!window.html2pdf) throw new Error('De PDF-maker is niet geladen. Controleer je internetverbinding en herlaad de pagina.');
    const houder = document.createElement('div');
    houder.style.cssText = 'position:fixed;left:-10000px;top:0;background:#fff';
    houder.innerHTML = tabel(vak, true); document.body.appendChild(houder);
    const sx = window.scrollX, sy = window.scrollY; window.scrollTo(0, 0);
    try {
      await html2pdf().set({
        margin: [8, 8, 8, 8], filename: `Eindtermen_${vak}_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0, windowWidth: 1300 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['tr'] },
      }).from(houder.firstElementChild).save();
    } finally { houder.remove(); window.scrollTo(sx, sy); }
  }

  // Knoppen met data-eindtermen="vak" (overal op de pagina)
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-eindtermen]');
    if (b) { e.preventDefault(); e.stopPropagation(); toon(b.dataset.eindtermen); }
  }, true);

  const vakken = () => Object.keys(DOELEN).filter(heeft);
  return { toon, pdf, tabel, heeft, vakken };
})();
