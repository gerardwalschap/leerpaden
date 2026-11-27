// ====================================================================
//  EINDTERMEN — overzicht: welke wiskundedoelen komen in welk leerpad aan bod?
//
//  Welke doelen bij welke knop horen, staat in js/menu.js (doelen: [...]).
//  Hier staan de volledige omschrijvingen van de doelen en de weergave:
//  een tabel (doelen × leerpaden) in een venster, met een knop om er een PDF van te maken.
//
//  Een knop met  data-eindtermen="wisk-7vjho"  opent het overzicht van dat vak
//  (werkt op de leerlingen- én de leerkrachtpagina).
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
  };
  // Korte kolomkoppen (de tegel staat erboven); volledige naam bij aanwijzen.
  const KORT = { 'proeftoets getallenleer': 'Proef\u00adtoets', 'wat is een functie?': 'Functies', 'eerstegraadsfuncties': 'Eerste\u00adgraads', 'exponentiële functies': 'Expo\u00adnentieel',
    'eindtest functieleer': 'Test', 'wat zijn reële functies?': 'Functies', 'functiewaarden en functiewaardentabel': 'Functie\u00adwaarden', 'domein en bereik': 'Domein', 'tekentabel en verloopschema': 'Teken/\u00adverloop', 'de functies f(x) = c en f(x) = ax': 'c en ax', 'de functie f(x) = ax + b': 'ax + b', 'functievoorschrift opstellen': 'Voor\u00adschrift', 'vergelijkingen en ongelijkheden grafisch oplossen': 'Grafisch oplossen', 'differentiecoëfficiënt en hellingshoek': 'Helling', 'eindtest': 'Test', 'telproblemen': 'Tellen', 'kansrekenen': 'Kansen', 'steekproeven': 'Steek\u00adproef', 'gegevens verwerken': 'Gege\u00advens', 'de normale verdeling': 'Normaal' };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const heeft = (vak) => !!(DOELEN[vak] && window.MENUS && window.MENUS[vak]);

  // Kolommen: de knoppen van het menu (per tegel) met doelen; +-versies hebben dezelfde doelen als het gewone leerpad.
  function kolommen(vak) {
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

  // De tabel (ook gebruikt voor de PDF). voorPdf: vaste breedte en eigen stijl.
  function tabel(vak, voorPdf) {
    const D = DOELEN[vak], G = kolommen(vak), alle = G.flatMap(g => g.kol);
    const telDoel = (c) => alle.filter(k => k.doelen.includes(c)).length;
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
        <colgroup><col style="width:${voorPdf ? 74 : 82}px"><col style="width:${voorPdf ? 300 : 290}px">${alle.map(() => '<col>').join('')}<col style="width:52px"></colgroup>
        <thead>
          <tr><th class="et-doel" colspan="2" rowspan="2">Wiskundedoel</th>${G.map(g => `<th class="et-rand" colspan="${g.kol.length}">${esc(g.titel)}</th>`).join('')}<th rowspan="2" class="et-rand" title="aantal leerpaden">#</th></tr>
          <tr class="et-kol">${G.map(g => g.kol.map((k, i) => `<th class="${i === 0 ? 'et-rand' : ''}${k.plus ? ' plus' : ''}" title="${esc(k.volledig)}">${esc(k.naam)}</th>`).join('')).join('')}</tr>
        </thead>
        <tbody>${D.lijst.map(([c, t, a]) => { const n = telDoel(c); return `<tr><td class="et-code">${esc(c)}</td>
            <td class="et-tekst">${esc(t)}${a ? `<small>${esc(a)}</small>` : ''}</td>
            ${G.map(g => g.kol.map((k, i) => `<td class="et-v${k.doelen.includes(c) ? '' : ' leeg'}${i === 0 ? ' et-rand' : ''}">${k.doelen.includes(c) ? '✓' : '·'}</td>`).join('')).join('')}
            <td class="et-n et-rand${n ? '' : ' nul'}">${n}</td></tr>`; }).join('')}</tbody>
      </table></div>
      <p class="et-leg">✓ = het doel komt aan bod in dit leerpad. <b style="color:#e8731a">+</b> = geldt ook voor de +-versie voor gevorderden (zelfde doelen, moeilijkere oefeningen).</p>
    </div>`;
  }

  function sluit() { const m = document.getElementById('et-venster'); if (m) m.remove(); document.removeEventListener('keydown', esc_); }
  function esc_(e) { if (e.key === 'Escape') sluit(); }

  function toon(vak) {
    if (!heeft(vak)) return;
    sluit();
    const m = document.createElement('div');
    m.id = 'et-venster'; m.className = 'modaal-achter';
    m.innerHTML = `<div class="modaal" role="dialog" aria-modal="true" aria-label="Eindtermen" style="max-width:1200px;max-height:92vh;overflow:auto">
        <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-bottom:8px">
          <button class="oranje" data-et="pdf">📄 PDF maken</button><button class="licht" data-et="sluit">Sluiten</button></div>
        ${tabel(vak, false)}</div>`;
    m.addEventListener('click', (e) => { if (e.target === m) sluit(); });
    m.querySelector('[data-et=sluit]').onclick = sluit;
    const knop = m.querySelector('[data-et=pdf]');
    knop.onclick = async () => {
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
