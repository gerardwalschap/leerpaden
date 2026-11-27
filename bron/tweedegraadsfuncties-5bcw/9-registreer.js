// ======================= samenstellen =======================
{
  const { T, M, O } = EXT;
  const reeks = [T.DF, T.D5, T.D6, T.DA, T.D9, T.D11, M.D13, M.D15, M.D16, M.D17, O.D4, O.D5];
  const delen = reeks.map((D, i) => ({ ...D, nr: i + 1 }));
  const mixE = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'E' + D.nr + s, opdracht: v.opdracht || D.opdracht }; } });
  const kiesSoort = (D, i = 0) => Object.keys(D.soorten)[i];
  const E = [[delen[0], 'geheel', 'Topvorm met formules'], [delen[1], kiesSoort(delen[1]), 'Kwadraat afsplitsen (a = 1)'], [delen[2], kiesSoort(delen[2]), 'Kwadraat afsplitsen (a ≠ 1)'],
    [delen[3], 'groter', 'Topvorm → algemene vorm'], [delen[4], 'teken', 'Tekenverloop'], [delen[5], kiesSoort(delen[5], 3), 'Functieoverzicht'], [delen[6], 'gemengd', 'Product-som methode'],
    [delen[8], kiesSoort(delen[8]), 'Oplossen met de discriminant'], [delen[10], kiesSoort(delen[10]), 'Ongelijkheid (D > 0)'], [delen[11], kiesSoort(delen[11]), 'Ongelijkheid (D = 0 of D < 0)']];
  const soorten = {}; E.forEach(([D, s, naam], i) => { soorten['e' + (i + 1)] = mixE(D, s, naam); });
  delen.push({ nr: delen.length + 1, titel: 'Eindtest tweedegraadsfuncties', kort: 'Alles door elkaar.', rekenmachine: false,
    theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p>
      <ul><li>Topvorm $f(x) = a(x - p)^2 + q$, top $S(p; q)$, met $p = -\\frac{b}{2a}$ en $q = f(p)$.</li><li>$D = b^2 - 4ac$ en $x = \\frac{-b \\pm \\sqrt{D}}{2a}$.</li>
      <li>Tekenregel: buiten de nulwaarden het teken van $a$, ertussen het tegengestelde teken.</li></ul></div>`,
    voorbeelden: [], soorten, oefenMix: Object.keys(soorten).map(k => [k, 1]), test: Object.keys(soorten).map(k => [k, 1]), testSchudden: true });
  Leerpaden.registreer({
    code: 'tweedegraadsfuncties-5bcw',
    titel: 'Tweedegraadsfuncties',
    ondertitel: 'Toegepaste wiskunde · 5BCW',
    klas: '5BCW',
    drempel: 70,
    intro: `<p>Je herhaalt de tweedegraadsfunctie uit het 4de jaar en gaat verder: van algemene vorm naar <b>topvorm</b> (met de formules of door kwadraat af te splitsen) en terug, de <b>kenmerken</b>,
      <b>ontbinden</b> met de product-som methode, de <b>discriminant</b> en de abc-formule, en <b>tweedegraadsongelijkheden</b> algebraïsch oplossen. Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
      <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
    groepen: [
      { titel: 'A · Topvorm en algemene vorm', delen: [1, 2, 3, 4] },
      { titel: 'B · Kenmerken', delen: [5, 6] },
      { titel: 'C · Vergelijkingen: ontbinden en discriminant', delen: [7, 8, 9, 10] },
      { titel: 'D · Ongelijkheden', delen: [11, 12] },
      { titel: 'E · Eindtest', delen: [13] },
    ],
    delen,
  });
}
