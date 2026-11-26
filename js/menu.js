// ====================================================================
//  MENU — wat een leerling ziet na het aanmelden (per vak).
//
//  Niveau 1: grote tegels (bv. 1. Instaptoets, 2. Getallenleer, …)
//  Niveau 2: de knoppen binnen een tegel
//  Niveau 3: achter een knop: het leerpad (of één groep ervan) + de spellen
//
//  Een leerling ziet ENKEL tegels en knoppen waaraan hij gekoppeld is
//  (koppelen doe je zoals altijd op de leerkrachtpagina).
//
//  Een knop:
//    { leerpad: 'code',                 // het leerpad achter de knop
//      groep: 0,                        // (optioneel) enkel groep A (0), B (1), … van dat leerpad
//      titel: '…', sub: '…',            // (optioneel) anders: titel van het leerpad
//      plus: true / ster: true,         // (optioneel) +-versie of ★-knop
//      spellen: ['spel-…'] }            // spellen bij deze knop (mag leeg: later aan te vullen)
//  Een tegel met  direct: 'code'  heeft geen knoppen: klikken = meteen starten.
//
//  Een nieuw spel bij een onderwerp? Zet de code (zie js/spellen.js) bij de juiste knop.
// ====================================================================
window.MENUS = {

  'wisk-7vjho': {
    tegels: [
      { id: 'instaptoets', nr: 1, icoon: '🚀', titel: 'Instaptoets', sub: 'Bepaal je niveau in getallenleer',
        direct: 'instaptoets-7vjho' },

      { id: 'getallenleer', nr: 2, icoon: '🔢', titel: 'Getallenleer', sub: 'Rekenen in ℕ, ℤ, ℚ en ℝ',
        knoppen: [
          { leerpad: 'getallenleer-n',      teken: 'ℕ', spellen: ['spel-codekraker', 'spel-getallenshow'] },
          { leerpad: 'getallenleer-n-plus', teken: 'ℕ', plus: true, spellen: [] },
          { leerpad: 'getallenleer-z',      teken: 'ℤ', spellen: ['spel-expeditie-z', 'spel-getallenshow'] },
          { leerpad: 'getallenleer-z-plus', teken: 'ℤ', plus: true, spellen: [] },
          { leerpad: 'getallenleer-q',      teken: 'ℚ', spellen: ['spel-expeditie-q', 'spel-oefenarena-q'] },
          { leerpad: 'getallenleer-q-plus', teken: 'ℚ', plus: true, spellen: [] },
          { leerpad: 'reele-getallen',      teken: 'ℝ', spellen: ['spel-expeditie-r', 'spel-oefenarena-r'] },
          { leerpad: 'reele-getallen-plus', teken: 'ℝ', plus: true, spellen: [] },
          { leerpad: 'proeftoets-getallenleer', ster: true, sub: 'Afsluiter · alle soorten oefeningen · over meerdere dagen', spellen: [] },
        ] },

      { id: 'functieleer', nr: 3, icoon: '📈', titel: 'Functieleer', sub: 'Functies · ax + b · Exponentiële functies',
        knoppen: [
          { leerpad: 'functieleer', groep: 0, titel: 'Wat is een functie?', sub: 'Functiewaarden · Domein en bereik · Tekentabel en verloop', spellen: [] },
          { leerpad: 'functieleer', groep: 1, titel: 'Eerstegraadsfuncties', sub: 'f(x) = ax + b · Voorschrift opstellen · Grafisch oplossen · Helling', spellen: [] },
          { leerpad: 'functieleer', groep: 2, titel: 'Exponentiële functies', sub: 'Lineair of exponentieel', spellen: [] },
          { leerpad: 'functieleer', groep: 3, titel: 'Eindtest functieleer', sub: 'Alles door elkaar', ster: true, spellen: [] },
        ] },

      { id: 'kansrekenen', nr: 4, icoon: '🎲', titel: 'Telproblemen en kansrekenen', sub: 'Tellen · Kansen bepalen',
        knoppen: [
          { leerpad: 'telproblemen-kansen', groep: 0, titel: 'Telproblemen', sub: 'Boomdiagram · Product-, som- en complementregel · Venndiagram', spellen: [] },
          { leerpad: 'telproblemen-kansen', groep: 1, titel: 'Kansrekenen', sub: 'Wet van Laplace · Kansboom', spellen: [] },
          { leerpad: 'telproblemen-kansen', groep: 2, titel: 'Eindtest', sub: 'Alles door elkaar', ster: true, spellen: [] },
        ] },

      { id: 'statistiek', nr: 5, icoon: '📊', titel: 'Statistiek', sub: 'Steekproeven · Gegevens verwerken · Normale verdeling',
        knoppen: [
          { leerpad: 'statistiek', groep: 0, titel: 'Steekproeven', spellen: [] },
          { leerpad: 'statistiek', groep: 1, titel: 'Gegevens verwerken', sub: 'Frequentietabel · Histogram · Gemiddelde en standaardafwijking', spellen: [] },
          { leerpad: 'statistiek', groep: 2, titel: 'De normale verdeling', spellen: [] },
          { leerpad: 'statistiek', groep: 3, titel: 'Eindtest', sub: 'Alles door elkaar', ster: true, spellen: [] },
        ] },
    ],
  },
};
