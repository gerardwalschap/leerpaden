// thema-motor.js — gedeelde motor voor de themaspelen van 7VJHO (functieleer, telproblemen/kansen, statistiek).
//
// Een themaspel bestaat uit LEVELS (zalen, kramen, opdrachten …). Een level telt n opdrachten;
// haal je er minstens `nodig` juist, dan is het level gehaald en gaat het volgende open.
// Sterren: ★ = gehaald · ★★ = hoogstens 1 fout · ★★★ = alles juist.
//
// Een opdracht komt ofwel RECHTSTREEKS uit het leerpad (zelfde vragen, invoer en verbetering):
//     bron: [[deelnr, 'soort', gewicht], …]
// ofwel uit een eigen, interactieve opdracht van het spel:
//     maak: () => ({ render(el, klaar) })   — klaar(true/false) na "Volgende".
//
// Elk spel (spel.js, na dit script) zet window.THEMA en roept TM.start() op:
//   window.THEMA = { programma: 'functieleer', sleutel: 'rechtenschieter-v1', titel, ondertitel, icoon,
//                    intro: '<p>…</p>', woord: { level: 'level', levels: 'levels' }, levels: [ … ] };
// Per level: { id, naam, kort, uitleg?, n, nodig, tijd? (seconden per vraag: tijdsbonus), bron? | maak? }
window.TM = (() => {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = (s, d) => W.tex(s, d);
  // Getal uit invoer: komma of punt, ook een breuk a/b. NaN als het geen getal is.
  function getal(s) {
    s = String(s ?? '').trim().replace(/\s+/g, '').replace(/,/g, '.').replace(/−/g, '-');
    if (!s) return NaN;
    const m = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (m) return +m[2] === 0 ? NaN : +m[1] / +m[2];
    return /^-?\d*\.?\d+$/.test(s) ? +s : NaN;
  }
  const komma = (x, d = 2) => { const r = Math.round(x * 10 ** d) / 10 ** d; return String(r).replace('.', ','); };
  // Feedbackblok + knop Volgende onder een eigen opdracht.
  function feedback(el, ok, html, verder, kop) {
    const div = document.createElement('div');
    div.innerHTML = `<div class="feedback ${ok ? 'j' : 'f'}"><div class="kop">${ok ? '✓ ' + (kop || W.kies(['Juist!', 'Knap!', 'Sterk!', 'Raak!'])) : '✗ ' + (kop || 'Niet juist.')}</div>${html || ''}</div>
      <div class="knoppen"><button class="btn" type="button">Volgende ›</button></div>`;
    el.appendChild(div); W.renderIn(div);
    const b = div.querySelector('button'); b.focus({ preventScroll: true });
    b.onclick = () => verder(ok);
  }
  return { $, esc, T, getal, komma, feedback };
})();

TM.start = () => {
  const C = window.THEMA, P = C.programma ? Leerpaden.vind(C.programma) : null;
  const app = document.getElementById('app');
  const { $, esc, T } = TM;
  const L = C.levels, woord = Object.assign({ level: 'level', levels: 'levels', Level: 'Level' }, C.woord || {});
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* niets */ } },
  };
  let S = store.get(C.sleutel, { naam: '', levels: {}, runs: 0, best: 0 });
  S.levels = S.levels || {};
  const save = () => store.set(C.sleutel, S);
  const sterren = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);
  const open = (i) => i === 0 || !!(S.levels[L[i - 1].id] && S.levels[L[i - 1].id].stars);

  // ---------- vraag uit het leerpad
  const recent = [];
  function leerpadVraag(lv) {
    let v, i = 0, b;
    do {
      b = W.gewogen(lv.bron.map(([nr, soort, g]) => [[nr, soort], g || 1]));
      const d = P.delen.find(x => x.nr === b[0]);
      v = d.soorten[b[1]].gen(); v.__deel = d;
    } while (recent.includes(v.sleutel || v.tex || v.html) && i++ < 40);
    recent.push(v.sleutel || v.tex || v.html); if (recent.length > 30) recent.shift();
    return v;
  }
  const uitlegHTML = (v) => (v.uitlegHtml || '') + [].concat(v.uitleg || []).map(u => `<div class="uitlegregel">${T(u)}</div>`).join('');
  function stelLeerpadVraag(el, v, klaar) {
    const d = v.__deel, w = Antwoord.leeg(v.antw);
    let n = null, melding = '';
    function teken() {
      const kbd = !n && Antwoord.heeftToetsenbord(v.antw);
      let fb = '';
      if (n) fb = n.status === 'juist'
        ? `<div class="feedback j"><div class="kop">✓ ${W.kies(['Juist!', 'Knap!', 'Sterk!', 'Helemaal goed!'])}</div>${uitlegHTML(v)}</div>`
        : `<div class="feedback f"><div class="kop">✗ ${n.status === 'vorm' ? 'Bijna. ' + esc(n.bericht) : n.status === 'tijd' ? 'De tijd is om!' : 'Niet juist.' + (n.bericht ? ' ' + esc(n.bericht) : '')}</div><div>Juiste antwoord: ${Antwoord.juistHTML(v.antw)}</div>${uitlegHTML(v)}</div>`;
      el.innerHTML = `<div class="klein midden opdracht">${esc(v.opdracht || d.opdracht || 'Bereken.')}</div>
        <div class="opgave-groot">${W.opgave(v)}</div>
        ${Antwoord.html('tm', v.antw, w, !!n)}
        ${kbd ? Antwoord.toetsenbord(Antwoord.toetsen(v.antw)) : ''}
        ${melding ? `<div class="melding let midden">${esc(melding)}</div>` : ''}${fb}
        <div class="knoppen">${n ? '<button class="btn" id="volgende" type="button">Volgende ›</button>' : '<button class="btn" id="controleer" type="button">Controleer</button>'}</div>`;
      W.renderIn(el); Antwoord.koppelToetsenbord(el);
      if (!n) {
        const velden = Antwoord.koppel('tm', v.antw, w, { bijEnter: controleer });
        $('#controleer', el).onclick = controleer;
        if (velden[0] && !velden[0].disabled && window.innerWidth > 700) velden[0].focus({ preventScroll: true });
      } else {
        const vk = $('#volgende', el); vk.focus({ preventScroll: true });
        vk.onclick = () => klaar(n.status === 'juist');
      }
    }
    function controleer() {
      if (n) return;
      Antwoord.lees('tm', v.antw, w);
      const r = Antwoord.nakijk(v.antw, w);
      if (r.status === 'leeg' || r.status === 'ongeldig') { melding = r.bericht; return teken(); }
      n = r; melding = ''; el.dispatchEvent(new Event('tm-nagekeken')); teken();
    }
    teken();
    return { teLaat() { if (!n) { n = { status: 'tijd' }; teken(); } } };
  }

  // ---------- startscherm met alle levels
  function start() {
    const tot = L.reduce((a, lv) => a + ((S.levels[lv.id] || {}).stars || 0), 0);
    app.innerHTML = `<div class="hero card"><div class="eyebrow">Wiskunde 7VJHO · ${esc(C.ondertitel || '')}</div>
        <h1>${C.icoon || ''} ${esc(C.titel)}</h1>${C.intro || ''}
        <div class="field" style="margin-top:12px"><label for="nm"><b>Jouw naam</b></label><input id="nm" maxlength="30" value="${esc(S.naam)}" placeholder="Voornaam"></div>
        <p class="muted" style="margin-top:8px">Sterren: <b>${tot} / ${3 * L.length}</b> · record: <b>${S.best || 0} punten</b></p></div>
      <div class="card"><div class="eyebrow">Kies een ${esc(woord.level)}</div>
        <div class="levels">${L.map((lv, i) => {
          const r = S.levels[lv.id] || {}, ok = open(i);
          return `<button class="lvl${ok ? '' : ' dicht'}${r.stars ? ' af' : ''}" data-i="${i}" ${ok ? '' : 'disabled'} type="button">
            <span class="lvl-nr">${ok ? i + 1 : '🔒'}</span>
            <span class="lvl-tekst"><b>${esc(lv.naam)}</b><small>${esc(lv.kort || '')}</small></span>
            <span class="lvl-ster" title="${r.stars || 0} sterren">${sterren(r.stars || 0)}</span></button>`;
        }).join('')}</div>
        <p class="klein muted" style="margin-top:10px">Haal minstens het gevraagde aantal juist om het volgende ${esc(woord.level)} te openen. ★★★ = alles juist.</p></div>`;
    app.querySelectorAll('.lvl').forEach(b => b.onclick = () => { S.naam = $('#nm').value.trim(); save(); intro(+b.dataset.i); });
  }
  function intro(i) {
    const lv = L[i];
    app.innerHTML = `<div class="card"><div class="eyebrow">${esc(woord.Level)} ${i + 1} van ${L.length}</div><h2>${esc(lv.naam)}</h2>
        <p class="muted" style="margin:6px 0 10px">${esc(lv.kort || '')}</p>
        ${lv.uitleg ? `<div class="tipbox">${lv.uitleg}</div>` : ''}
        <p style="margin-top:10px">${lv.n} opdrachten · minstens <b>${lv.nodig}</b> juist${lv.tijd ? ` · snel antwoorden geeft bonuspunten (${lv.tijd} s)` : ''}.</p>
        <div class="row" style="margin-top:14px"><button class="btn gold" id="go" type="button">Start</button><button class="btn ghost" id="terug" type="button">Terug</button></div></div>`;
    W.renderIn(app);
    $('#go').onclick = () => spelen(i); $('#terug').onclick = start; $('#go').focus();
  }
  function spelen(i) {
    const lv = L[i];
    S.runs = (S.runs || 0) + 1; save();
    const run = { i: 0, ok: 0, punten: 0, reeks: 0, marks: [] };
    function volgende() {
      if (run.i >= lv.n) return einde();
      app.innerHTML = `<div class="card"><div class="row tussen"><b>${esc(lv.naam)}</b>
          <div class="row"><span class="pill">🔥 ${run.reeks}</span><span class="pill">⭐ ${run.punten}</span>
          <div class="dots">${Array.from({ length: lv.n }, (_, k) => `<span class="${run.marks[k] === undefined ? '' : run.marks[k] ? 'ok' : 'no'}"></span>`).join('')}</div></div></div>
          ${lv.tijd ? '<div class="tijd"><div id="tijdbalk"></div></div>' : ''}</div>
        <div class="card vraagkaart"><div class="eyebrow">Opdracht ${run.i + 1} van ${lv.n}</div><div id="qa"></div></div>`;
      const el = $('#qa'), t0 = Date.now();
      let timer = null, bonus = 0, ctl = null;
      const klaar = (ok) => {
        clearInterval(timer);
        run.marks.push(ok);
        if (ok) { run.ok++; run.reeks++; run.punten += 10 + bonus + (run.reeks % 3 === 0 ? 10 : 0); } else run.reeks = 0;
        run.i++; window.scrollTo(0, 0); volgende();
      };
      if (lv.tijd) {
        const balk = $('#tijdbalk');
        timer = setInterval(() => {
          const rest = Math.max(0, 1 - (Date.now() - t0) / (lv.tijd * 1000));
          balk.style.width = (100 * rest) + '%'; balk.classList.toggle('laag', rest < 0.25);
          if (rest <= 0) clearInterval(timer); // tijd om: geen bonus meer, maar je mag nog rustig antwoorden
        }, 100);
        el.addEventListener('tm-nagekeken', () => {
          clearInterval(timer);
          bonus = Math.round(10 * Math.max(0, 1 - (Date.now() - t0) / (lv.tijd * 1000)));
        });
      }
      if (lv.bron) ctl = stelLeerpadVraag(el, leerpadVraag(lv), klaar);
      else ctl = lv.maak().render(el, klaar) || null;
    }
    function einde() {
      const r = S.levels[lv.id] || { stars: 0, best: 0 };
      const gehaald = run.ok >= lv.nodig, st = !gehaald ? 0 : run.ok === lv.n ? 3 : run.ok >= lv.n - 1 ? 2 : 1;
      r.stars = Math.max(r.stars || 0, st); r.best = Math.max(r.best || 0, run.punten);
      S.levels[lv.id] = r;
      const totaal = Object.values(S.levels).reduce((a, x) => a + (x.best || 0), 0);
      S.best = Math.max(S.best || 0, totaal); save();
      if (window.SpelVolg) SpelVolg.resultaat({ juist: run.ok, totaal: lv.n, punten: run.punten, per: { [lv.id]: { ok: run.ok, tot: lv.n } } });
      const volgendeOpen = i + 1 < L.length && open(i + 1);
      const alles = L.every(x => (S.levels[x.id] || {}).stars);
      app.innerHTML = `<div class="card hero"><div class="eyebrow">${esc(lv.naam)}</div>
          <h1>${gehaald ? (alles && i === L.length - 1 ? 'Alles gehaald! 🏆' : 'Gehaald! 🎉') : 'Net niet …'}</h1>
          <p class="sterren-groot">${sterren(st)}</p>
          <p style="margin:8px 0">${run.ok} van de ${lv.n} juist · ⭐ ${run.punten} punten${gehaald ? '' : ` · je hebt er minstens ${lv.nodig} nodig`}.</p>
          ${alles && gehaald && i === L.length - 1 ? `<p>Proficiat${S.naam ? ', ' + esc(S.naam) : ''}! Je hebt alle ${esc(woord.levels)} van ${esc(C.titel)} gehaald. Toon dit scherm aan je leerkracht.</p>` : ''}
          <div class="row" style="margin-top:14px">
            ${gehaald && volgendeOpen ? '<button class="btn gold" id="verder" type="button">Volgende ' + esc(woord.level) + ' ›</button>' : ''}
            <button class="btn" id="opnieuw" type="button">${gehaald ? 'Nog eens (meer sterren?)' : 'Opnieuw proberen'}</button>
            <button class="btn ghost" id="home" type="button">Alle ${esc(woord.levels)}</button></div></div>`;
      if ($('#verder')) $('#verder').onclick = () => intro(i + 1);
      $('#opnieuw').onclick = () => spelen(i); $('#home').onclick = start;
      ($('#verder') || $('#opnieuw')).focus();
    }
    volgende();
  }
  start();
};
