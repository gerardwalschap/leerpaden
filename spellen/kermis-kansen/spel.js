// Kermis van de kansen — themaspel bij Kansrekenen (7VJHO, deel 3.1.2).
// Kramen 1, 3, 5 en 6: vragen rechtstreeks uit het leerpad Telproblemen en kansrekenen (delen 7–12).
// Kramen 2 en 4 zijn interactief: zelf draaien/gooien (relatieve frequentie) en dan de kans exact bepalen (wet van Laplace).
// Afspraak (zoals in het leerpad): een kans schrijf je als vereenvoudigde breuk; een relatieve frequentie op 1 decimaal in %.
(() => {
  const { esc, T, feedback } = TM;
  const rnd = W.rnd, kies = W.kies;
  const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const bTex = (t, n) => { const g = ggd(t, n); t /= g; n /= g; return n === 1 ? String(t) : `\\frac{${t}}{${n}}`; };
  const pct = (x) => (Math.round(1000 * x) / 10).toString().replace('.', ',') + ' %';
  const pctTex = (x) => (Math.round(1000 * x) / 10).toString().replace('.', '{,}') + '\\,\\%';
  const regel = (s) => `<div class="uitlegregel">${T(s)}</div>`;
  const stijl = document.createElement('style');
  stijl.textContent = `.breukin{display:inline-flex;flex-direction:column;align-items:center;gap:4px;vertical-align:middle}
    .breukin input{width:80px;font:inherit;text-align:center;padding:6px;border-radius:8px;border:2px solid var(--line);background:var(--bg)}
    .breukin .streep{width:90px;height:3px;background:var(--ink);border-radius:2px}
    .sim{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:8px 0}
    .sim button{border:2px solid var(--line);background:var(--card);border-radius:10px;padding:7px 12px;font-weight:700}
    .teller{text-align:center;font-size:.98rem;margin:4px 0}
    .rad{transition:transform 1.1s cubic-bezier(.2,.8,.2,1)}
    .dobbel{display:inline-grid;place-items:center;width:54px;height:54px;border-radius:10px;background:#fff;border:3px solid var(--ink);font-size:30px;margin:0 6px}
    table.ft.som36{width:auto}table.som36 td,table.som36 th{width:32px;height:26px;padding:2px;font-size:.9rem}table.som36 td.g{background:var(--pos-bg);font-weight:700}`;
  document.head.appendChild(stijl);

  // Breuk-invoer + nakijken: juist = gelijk én vereenvoudigd.
  const breukHTML = () => `<div class="invul"><span><b>P = </b></span><span class="breukin"><input id="bt" inputmode="numeric" autocomplete="off" aria-label="teller"><span class="streep"></span><input id="bn" inputmode="numeric" autocomplete="off" aria-label="noemer"></span></div>`;
  function leesBreuk(el, t, n) {
    const a = parseInt(el.querySelector('#bt').value, 10), b = parseInt(el.querySelector('#bn').value, 10);
    if (isNaN(a) || isNaN(b) || b <= 0) return { leeg: true };
    const gelijk = a * n === b * t, eenvoudig = ggd(a, b) === 1 || (a === 0 && b === 1);
    return { ok: gelijk && eenvoudig, gelijk, eenvoudig, a, b };
  }

  // ---------- kraam 2: het rad van fortuin
  const KLEUREN = [['rood', '#d2424f'], ['blauw', '#2f6fd0'], ['geel', '#f2b316'], ['groen', '#2b8f5c']];
  function opdrachtRad() {
    const N = kies([6, 8, 10, 12]);
    const nk = kies([2, 3, 3, 4]), vakken = [];
    let rest = N; for (let k = 0; k < nk; k++) { const c = k === nk - 1 ? rest : rnd(1, rest - (nk - 1 - k)); vakken.push(c); rest -= c; }
    const sectoren = W.schud(vakken.flatMap((c, k) => Array(c).fill(k)));
    const doelK = rnd(0, nk - 1), [naam, kleur] = KLEUREN[doelK], gunstig = vakken[doelK];
    const R = 110, cx = 120, cy = 120;
    const svg = () => {
      let s = '';
      sectoren.forEach((k, i) => {
        const a1 = 2 * Math.PI * i / N - Math.PI / 2, a2 = 2 * Math.PI * (i + 1) / N - Math.PI / 2;
        s += `<path d="M${cx},${cy} L${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} A${R},${R} 0 0 1 ${cx + R * Math.cos(a2)},${cy + R * Math.sin(a2)} Z" fill="${KLEUREN[k][1]}" stroke="#fff" stroke-width="2"/>`;
      });
      return `<svg viewBox="0 0 240 250" width="240" height="250"><g class="rad" id="rad" style="transform-origin:${cx}px ${cy}px">${s}<circle cx="${cx}" cy="${cy}" r="10" fill="#fff" stroke="#333" stroke-width="2"/></g>
        <polygon points="${cx - 10},2 ${cx + 10},2 ${cx},24" fill="#222"/></svg>`;
    };
    return { render(el, klaar) {
      let n = 0, treffer = 0, hoek = 0;
      el.innerHTML = `<div class="scenario">Aan deze kraam win je als het rad op <b style="color:${kleur}">${naam}</b> stopt. Alle ${N} vakjes zijn even groot.
          Draai eerst een paar keer (of heel vaak!) en kijk naar de relatieve frequentie. Bepaal daarna de <b>kans</b> op ${naam} als vereenvoudigde breuk.</div>
        <div class="svgwrap">${svg()}</div>
        <div class="sim"><button type="button" data-n="1">Draai 1×</button><button type="button" data-n="10">10×</button><button type="button" data-n="100">100×</button><button type="button" data-n="1000">1000×</button></div>
        <div class="teller" id="tel">Nog niet gedraaid.</div>
        ${breukHTML()}<div id="msg"></div><div class="knoppen"><button class="btn" id="check" type="button">Controleer</button></div>`;
      const tel = el.querySelector('#tel');
      el.querySelectorAll('.sim button').forEach(b => b.onclick = () => {
        const m = +b.dataset.n; let laatste = 0;
        for (let i = 0; i < m; i++) { laatste = rnd(0, N - 1); if (sectoren[laatste] === doelK) treffer++; }
        n += m;
        hoek += 720 + (360 - (laatste + 0.5) * 360 / N) - (hoek % 360);
        el.querySelector('#rad').style.transform = `rotate(${hoek}deg)`;
        tel.innerHTML = `Gedraaid: <b>${n}</b> keer · ${naam}: <b>${treffer}</b> keer · relatieve frequentie: <b>${pct(treffer / n)}</b>`;
      });
      el.querySelector('#check').onclick = () => {
        const r = leesBreuk(el, gunstig, N);
        if (r.leeg) { el.querySelector('#msg').innerHTML = '<p class="melding let midden">Vul de teller en de noemer in.</p>'; return; }
        el.querySelectorAll('input,.sim button').forEach(x => { x.disabled = true; }); el.querySelector('#check').remove(); el.querySelector('#msg').innerHTML = '';
        feedback(el, r.ok, regel(`P(\\text{${naam}}) = \\frac{\\text{gunstige uitkomsten}}{\\text{mogelijke uitkomsten}} = \\frac{${gunstig}}{${N}}${ggd(gunstig, N) > 1 ? ' = ' + bTex(gunstig, N) : ''} ${Math.abs(1000 * gunstig / N - Math.round(1000 * gunstig / N)) < 1e-9 ? '=' : '\\approx'} ${pctTex(gunstig / N)}`)
          + (n ? `<p class="klein">Na ${n} keer draaien was de relatieve frequentie ${pct(treffer / n)}. Hoe vaker je draait, hoe beter de relatieve frequentie de kans benadert.</p>` : '<p class="klein">Tip: draai de volgende keer eens 1000 keer en vergelijk de relatieve frequentie met de kans.</p>'),
          klaar, r.ok ? undefined : r.gelijk && !r.eenvoudig ? 'Bijna: vereenvoudig je breuk!' : undefined);
      };
    } };
  }

  // ---------- kraam 4: dubbel of niks (twee dobbelstenen)
  const OGEN = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  function opdrachtDobbel() {
    const soort = kies(['som', 'som', 'min', 'max', 'dubbel']);
    let s, test, zin;
    if (soort === 'som') { s = rnd(2, 12); test = (a, b) => a + b === s; zin = `de som van de ogen <b>${s}</b> is`; }
    else if (soort === 'min') { s = rnd(4, 10); test = (a, b) => a + b >= s; zin = `de som van de ogen <b>minstens ${s}</b> is`; }
    else if (soort === 'max') { s = rnd(4, 9); test = (a, b) => a + b < s; zin = `de som van de ogen <b>kleiner dan ${s}</b> is`; }
    else { test = (a, b) => a === b; zin = `je <b>dubbel</b> gooit (twee keer hetzelfde aantal ogen)`; }
    let gunstig = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (test(a, b)) gunstig++;
    return { render(el, klaar) {
      let n = 0, treffer = 0;
      el.innerHTML = `<div class="scenario">Je gooit met <b>twee dobbelstenen</b> en wint als ${zin}. Gooi gerust een paar keer, en bepaal dan de <b>kans</b> om te winnen als vereenvoudigde breuk.</div>
        <div class="midden" style="margin:8px 0"><span class="dobbel" id="d1">⚀</span><span class="dobbel" id="d2">⚀</span></div>
        <div class="sim"><button type="button" data-n="1">Gooi 1×</button><button type="button" data-n="100">100×</button><button type="button" data-n="1000">1000×</button></div>
        <div class="teller" id="tel">Nog niet gegooid.</div>
        ${breukHTML()}<div id="msg"></div><div class="knoppen"><button class="btn" id="check" type="button">Controleer</button></div>`;
      el.querySelectorAll('.sim button').forEach(b => b.onclick = () => {
        let a = 1, c = 1;
        for (let i = 0; i < +b.dataset.n; i++) { a = rnd(1, 6); c = rnd(1, 6); if (test(a, c)) treffer++; n++; }
        el.querySelector('#d1').textContent = OGEN[a]; el.querySelector('#d2').textContent = OGEN[c];
        el.querySelector('#tel').innerHTML = `Gegooid: <b>${n}</b> keer · gewonnen: <b>${treffer}</b> keer · relatieve frequentie: <b>${pct(treffer / n)}</b>`;
      });
      el.querySelector('#check').onclick = () => {
        const r = leesBreuk(el, gunstig, 36);
        if (r.leeg) { el.querySelector('#msg').innerHTML = '<p class="melding let midden">Vul de teller en de noemer in.</p>'; return; }
        el.querySelectorAll('input,.sim button').forEach(x => { x.disabled = true; }); el.querySelector('#check').remove(); el.querySelector('#msg').innerHTML = '';
        let tab = '<table class="ft som36"><tr><th>+</th>' + [1, 2, 3, 4, 5, 6].map(b => `<th>${b}</th>`).join('') + '</tr>';
        for (let a = 1; a <= 6; a++) tab += `<tr><th>${a}</th>` + [1, 2, 3, 4, 5, 6].map(b => `<td class="${test(a, b) ? 'g' : ''}">${a + b}</td>`).join('') + '</tr>';
        tab += '</table>';
        feedback(el, r.ok, `<p>Er zijn 6 · 6 = 36 even waarschijnlijke uitkomsten. De gunstige zijn groen:</p>${tab}`
          + regel(`P = \\frac{${gunstig}}{36}${ggd(gunstig, 36) > 1 ? ' = ' + bTex(gunstig, 36) : ''}`)
          + (n ? `<p class="klein">Jouw relatieve frequentie na ${n} worpen: ${pct(treffer / n)} (de kans is ongeveer ${pct(gunstig / 36)}).</p>` : ''),
          klaar, r.ok ? undefined : r.gelijk && !r.eenvoudig ? 'Bijna: vereenvoudig je breuk!' : undefined);
      };
    } };
  }

  window.THEMA = {
    programma: 'telproblemen-kansen', sleutel: 'kermis-kansen-v1', icoon: '🎡',
    titel: 'Kermis van de kansen', ondertitel: 'Kansrekenen',
    woord: { level: 'kraam', levels: 'kramen', Level: 'Kraam' },
    intro: `<p class="muted">Welkom op de kermis! Aan elke kraam bereken je kansen. Aan sommige kramen mag je zelf draaien of gooien:
      vergelijk de relatieve frequentie met de kans die je berekent. Een kans schrijf je als <b>vereenvoudigde breuk</b>.</p>`,
    levels: [
      { id: 'm1', naam: 'Kraam 1 · Zeker of onmogelijk?', kort: 'Kansexperiment, uitkomsten, gebeurtenis en kansschaal', n: 6, nodig: 5,
        bron: [[7, 'experiment', 1], [7, 'U', 1], [7, 'gebeurtenis', 1], [7, 'zeker', 1], [7, 'complement', 1], [7, 'schaal', 1]] },
      { id: 'm2', naam: 'Kraam 2 · Het rad van fortuin', kort: 'Zelf draaien: relatieve frequentie en kans', n: 5, nodig: 4, maak: opdrachtRad,
        uitleg: `Wet van Laplace (alle uitkomsten even waarschijnlijk): ${T('P(A) = \\frac{\\text{aantal gunstige uitkomsten}}{\\text{aantal mogelijke uitkomsten}}')}` },
      { id: 'm3', naam: 'Kraam 3 · De grijpbak', kort: 'Wet van Laplace en relatieve frequentie', n: 6, nodig: 5,
        bron: [[8, 'rf', 1], [8, 'schat', 1], [8, 'verwacht', 1], [9, 'een', 1], [9, 'knikkers', 2], [9, 'kaarten', 1], [9, 'laplace', 1], [9, 'ongelijk', 1], [9, 'venn', 1]] },
      { id: 'm4', naam: 'Kraam 4 · Dubbel of niks', kort: 'Twee dobbelstenen: 36 uitkomsten', n: 5, nodig: 4, maak: opdrachtDobbel,
        uitleg: 'Met twee dobbelstenen zijn er 6 · 6 = 36 even waarschijnlijke uitkomsten. De sommen zijn <b>niet</b> even waarschijnlijk!' },
      { id: 'm5', naam: 'Kraam 5 · De kansboom', kort: 'Langs een pad vermenigvuldigen, paden optellen', n: 6, nodig: 5,
        bron: [[11, 'munt', 1], [11, 'met', 1], [11, 'zonder', 2], [11, 'procent', 1], [11, 'gokken', 1], [11, 'vergelijk', 1]] },
      { id: 'm6', naam: 'De hoofdprijs', kort: 'Tellen en kansen door elkaar', n: 8, nodig: 6,
        bron: [[12, 'bm', 1], [12, 'cd', 1], [12, 'rt', 1], [12, 'v3', 1], [12, 'mi', 1], [12, 'rf', 1], [12, 'kn', 1], [12, 'ka', 1], [12, 'sm', 1], [12, 'zo', 1], [12, 'pr', 1], [12, 'me', 1]] },
    ],
  };
  TM.start();
})();
