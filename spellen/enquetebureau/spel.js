// Enquêtebureau — themaspel bij Statistiek (7VJHO, deel 3.2).
// Opdrachten 1–3, 5 en 6: vragen rechtstreeks uit het leerpad Statistiek (delen 1–7).
// Opdracht 4 is interactief: zelf een gegroepeerde frequentietabel invullen; daarna verschijnt het histogram.
// Klassen als half-open interval [a; b[ (zoals in het leerpad en de PWP).
(() => {
  const { esc, T, feedback } = TM;
  const rnd = W.rnd, kies = W.kies;

  const CONTEXT = [
    { zin: 'De lengte (in cm) van 20 leerlingen van het zesde jaar:', eenh: 'lengte (cm)', van: 150, w: 10, k: 5 },
    { zin: 'De wachttijd (in minuten) van 20 klanten aan de kassa:', eenh: 'wachttijd (min)', van: 0, w: 2, k: 5 },
    { zin: 'De score (op 50) van 20 leerlingen op een toets:', eenh: 'score', van: 10, w: 10, k: 4 },
    { zin: 'Het aantal uren schermtijd per week van 20 jongeren:', eenh: 'uren per week', van: 0, w: 5, k: 5 },
    { zin: 'Het gewicht (in kg) van 20 pakjes bij een koerierdienst:', eenh: 'gewicht (kg)', van: 0, w: 4, k: 4 },
  ];
  // Histogram als SVG (staven raken elkaar).
  function histogram(grenzen, f, xn) {
    const B = 340, H = 170, m = 30, max = Math.max(...f, 1), bw = (B - 2 * m) / f.length;
    let s = '';
    f.forEach((v, i) => {
      const h = (H - 40) * v / max, x = m + i * bw, y = H - 20 - h;
      s += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="color-mix(in srgb,var(--accent) 70%,#fff)" stroke="var(--ink)" stroke-width="1"/>
        <text x="${x + bw / 2}" y="${y - 4}" text-anchor="middle" font-size="12" font-weight="700">${v}</text>`;
    });
    grenzen.forEach((g, i) => { s += `<text x="${m + i * bw}" y="${H - 5}" text-anchor="middle" font-size="11">${g}</text>`; });
    return `<svg viewBox="0 0 ${B} ${H + 16}" width="${B}" height="${H + 16}">${s}<line x1="${m}" y1="${H - 20}" x2="${B - m + 6}" y2="${H - 20}" stroke="var(--ink)"/>
      <text x="${B / 2}" y="${H + 12}" text-anchor="middle" font-size="12" fill="#555">${esc(xn)}</text></svg>`;
  }
  function opdrachtTabel() {
    const C = kies(CONTEXT), grenzen = Array.from({ length: C.k + 1 }, (_, i) => C.van + i * C.w);
    // frequenties kiezen (som 20, elke klasse minstens 1), dan waarden trekken; enkele waarden precies op een klassengrens
    let f; do { f = grenzen.slice(0, -1).map(() => rnd(1, 8)); } while (f.reduce((a, b) => a + b, 0) !== 20);
    const data = [];
    f.forEach((n, i) => { for (let j = 0; j < n; j++) data.push(j === 0 && i > 0 && Math.random() < 0.6 ? grenzen[i] : rnd(grenzen[i], grenzen[i + 1] - 1)); });
    const lijst = W.schud(data);
    return { render(el, klaar) {
      el.innerHTML = `<div class="scenario"><p>${esc(C.zin)}</p><p style="font-size:1.1rem;letter-spacing:.02em;margin-top:6px"><b>${lijst.join(' &nbsp; ')}</b></p></div>
        <p class="midden">Vul de <b>absolute frequentie</b> van elke klasse in. Let op: ${T(`[${grenzen[0]};\\, ${grenzen[1]}[`)} bevat ${grenzen[0]} wel, maar ${grenzen[1]} niet.</p>
        <table class="ft"><tr><th>${esc(C.eenh)}</th><th>absolute frequentie</th></tr>
          ${f.map((_, i) => `<tr><td>${T(`[${grenzen[i]};\\, ${grenzen[i + 1]}[`)}</td><td><input data-i="${i}" inputmode="numeric" autocomplete="off" aria-label="frequentie klasse ${i + 1}"></td></tr>`).join('')}
          <tr><th>totaal</th><th id="tot">0</th></tr></table>
        <div id="msg"></div><div class="knoppen"><button class="btn" id="check" type="button">Controleer</button></div>`;
      W.renderIn(el);
      const inp = [...el.querySelectorAll('table input')];
      const som = () => { el.querySelector('#tot').textContent = inp.reduce((a, i) => a + (parseInt(i.value, 10) || 0), 0); };
      inp.forEach((i, k) => { i.oninput = som; i.onkeydown = (e) => { if (e.key === 'Enter') (inp[k + 1] || el.querySelector('#check')).focus(); }; });
      if (window.innerWidth > 700) inp[0].focus({ preventScroll: true });
      el.querySelector('#check').onclick = () => {
        const w = inp.map(i => parseInt(i.value, 10));
        if (w.some(isNaN)) { el.querySelector('#msg').innerHTML = '<p class="melding let midden">Vul elke klasse in (ook 0 is een antwoord).</p>'; return; }
        const ok = w.every((v, i) => v === f[i]);
        inp.forEach((i, k) => { i.disabled = true; i.style.borderColor = w[k] === f[k] ? 'var(--pos)' : 'var(--neg)'; });
        el.querySelector('#check').remove(); el.querySelector('#msg').innerHTML = '';
        const fout = f.map((v, i) => w[i] !== v ? `${T(`[${grenzen[i]};\\, ${grenzen[i + 1]}[`)}: ${v} (jij: ${w[i]})` : '').filter(Boolean);
        feedback(el, ok, `${fout.length ? `<p>Juiste frequenties: ${fout.join(' · ')}</p>` : ''}<p>Het histogram bij deze tabel (de staven raken elkaar):</p>
          <div class="svgwrap">${histogram(grenzen, f, C.eenh)}</div><p class="klein">Controle: het totaal moet altijd ${data.length} zijn.</p>`, klaar);
      };
    } };
  }

  window.THEMA = {
    programma: 'statistiek', sleutel: 'enquetebureau-v1', icoon: '📋',
    titel: 'Enquêtebureau', ondertitel: 'Statistiek',
    woord: { level: 'opdracht', levels: 'opdrachten', Level: 'Opdracht' },
    intro: `<p class="muted">Je begint als stagiair bij een enquêtebureau. Elke opdracht van een klant brengt je een stap verder:
      eerst een goede steekproef kiezen, dan de gegevens verwerken en tot slot het normale model gebruiken. Haal alle opdrachten en word hoofdonderzoeker!
      Afspraak: gemiddelde, standaardafwijking en procenten rond je af op <b>1 decimaal</b>.</p>`,
    levels: [
      { id: 'e1', naam: 'Wie onderzoek je?', kort: 'Populatie en steekproef', n: 5, nodig: 4,
        bron: [[1, 'populatie', 1], [1, 'steekproef', 1], [1, 'waarom', 1]] },
      { id: 'e2', naam: 'Een goede steekproef', kort: 'Representatief: aselect, groot genoeg, weinig non-respons', n: 6, nodig: 5,
        bron: [[2, 'goed', 2], [2, 'probleem', 2], [2, 'nonrespons', 1]] },
      { id: 'e3', naam: 'Wat mag je besluiten?', kort: 'Van de steekproef naar de populatie', n: 5, nodig: 4,
        bron: [[3, 'procent', 1], [3, 'besluit', 1], [3, 'mag', 1]] },
      { id: 'e4', naam: 'De frequentietabel', kort: 'Zelf de gegevens groeperen in klassen', n: 4, nodig: 3, maak: opdrachtTabel,
        uitleg: `Een klasse is een half-open interval: ${T('[160;\\, 170[')} bevat 160 wel, maar 170 niet. Tel elk gegeven precies één keer.` },
      { id: 'e5', naam: 'Gemiddelde en spreiding', kort: 'x̄ en s met het rekenblad', n: 5, nodig: 4,
        bron: [[5, 'gemiddelde', 2], [5, 'stdev', 1], [5, 'vergelijk', 1], [5, 'betekenis', 1]] },
      { id: 'e6', naam: 'De klokvorm', kort: 'Normale kromme en de 68-95-99,7-regel', n: 6, nodig: 5,
        bron: [[6, 'koppel', 1], [6, 'aflezen', 1], [6, 'verander', 1], [7, 'procent', 2], [7, 'grenzen', 1], [7, 'aantal', 1]] },
    ],
  };
  TM.start();
})();
