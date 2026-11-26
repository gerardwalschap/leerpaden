// plus-motor.js — gedeelde motor voor de spellen bij de +-leerpaden (7VJHO, gevorderden).
//
// De vragen komen RECHTSTREEKS uit het +-leerpad zelf (programmas/…-plus.js): dezelfde soorten
// oefeningen, dezelfde invoer (breuken, formule-editor, keuzeknoppen …) en dezelfde verbetering.
// Zo blijft een spel altijd binnen de leerstof van het leerpad.
//
// Elk spel (map spellen/<naam>/index.html) zet vóór dit script:
//   window.PLUSSPEL = { programma: 'getallenleer-q-plus', modus: 'expeditie' | 'arena',
//                       teken: 'ℚ', naam: 'rationale getallen', sleutel: 'expeditie-q-plus-v1' };
//
// Expeditie +  : alle delen in de volgorde van het leerpad (de eindtest is de top). Per deel PER vragen,
//                minstens NODIG juist om verder te gaan; mis je een deel, dan start je opnieuw bij deel 1.
// Oefenarena + : zelf delen kiezen en een ronde van 10, 15 of 20 vragen spelen (met reeks-bonus).
(() => {
  const C = window.PLUSSPEL, P = Leerpaden.vind(C.programma);
  const app = document.getElementById('app');
  const esc = W.esc, T = (s, d) => W.tex(s, d);
  if (!P) { app.innerHTML = '<div class="card"><h2>Spel niet gevonden</h2><p>Het leerpad van dit spel kon niet geladen worden.</p></div>'; return; }

  const DELEN = P.delen, N = DELEN.length;
  const PER = 5, NODIG = 4;
  const isTop = (d) => /eindtest/i.test(d.titel);
  const kortTitel = (d) => d.titel.replace(/\s*\+$/, '').replace(/^Eindtest.*/i, 'Eindtest');
  const rekentoestel = (d) => d.rekenmachine === true ? '🧮 rekentoestel toegestaan' : d.rekenmachine === false ? '✏️ zonder rekentoestel' : '';

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* niets */ } },
  };
  const $ = (s, el = document) => el.querySelector(s);

  // ---------- vragen uit het leerpad
  const recent = [];
  const sleutel = (v) => v.sleutel || v.tex || v.html || JSON.stringify(v.antw);
  function maakVraag(d) {
    let v, i = 0;
    do { v = d.soorten[W.gewogen(d.oefenMix)].gen(); } while (recent.includes(sleutel(v)) && i++ < 40);
    recent.push(sleutel(v)); if (recent.length > 30) recent.shift();
    return v;
  }
  const uitlegHTML = (v) => (v.uitlegHtml || '') + [].concat(v.uitleg || []).map(u => `<div class="uitlegregel">${T(u)}</div>`).join('');

  // Toont vraag v van deel d in el; roept klaar(juist) op na "Volgende".
  function stelVraag(el, d, v, kop, klaar) {
    const w = Antwoord.leeg(v.antw);
    let nagekeken = null, melding = '';
    function teken() {
      const n = nagekeken, kbd = !n && Antwoord.heeftToetsenbord(v.antw);
      let fb = '';
      if (n) {
        const juist = Antwoord.juistHTML(v.antw);
        fb = n.status === 'juist'
          ? `<div class="feedback j"><div class="kop">✓ ${W.kies(['Juist!', 'Knap!', 'Sterk!', 'Helemaal goed!'])}</div>${uitlegHTML(v)}</div>`
          : `<div class="feedback f"><div class="kop">✗ ${n.status === 'vorm' ? 'Bijna. ' + esc(n.bericht) : 'Niet juist.' + (n.bericht ? ' ' + esc(n.bericht) : '')}</div><div>Juiste antwoord: ${juist}</div>${uitlegHTML(v)}</div>`;
      }
      el.innerHTML = `<div class="card vraagkaart">
          <div class="row tussen"><div class="eyebrow">${kop}</div>${rekentoestel(d) ? `<div class="eyebrow">${rekentoestel(d)}</div>` : ''}</div>
          <div class="klein midden opdracht">${esc(v.opdracht || d.opdracht || 'Bereken.')}</div>
          <div class="opgave-groot">${W.opgave(v)}</div>
          ${Antwoord.html('sp', v.antw, w, !!n)}
          ${kbd ? Antwoord.toetsenbord(Antwoord.toetsen(v.antw)) : ''}
          ${melding ? `<div class="melding let midden">${esc(melding)}</div>` : ''}
          ${fb}
          <div class="knoppen">${n ? '<button class="btn" id="volgende" type="button">Volgende ›</button>' : '<button class="btn" id="controleer" type="button">Controleer</button>'}</div>
        </div>`;
      W.renderIn(el);
      Antwoord.koppelToetsenbord(el);
      if (!n) {
        const velden = Antwoord.koppel('sp', v.antw, w, { bijEnter: controleer });
        $('#controleer', el).onclick = controleer;
        if (velden[0] && !velden[0].disabled && window.innerWidth > 700) velden[0].focus({ preventScroll: true });
      } else {
        const vk = $('#volgende', el); vk.focus({ preventScroll: true });
        vk.onclick = () => klaar(n.status === 'juist');
        vk.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); vk.click(); } };
      }
    }
    function controleer() {
      Antwoord.lees('sp', v.antw, w);
      const r = Antwoord.nakijk(v.antw, w);
      if (r.status === 'leeg' || r.status === 'ongeldig') { melding = r.bericht; return teken(); }
      nagekeken = r; melding = ''; teken();
    }
    teken();
  }

  const theorieBlok = (d) => d.theorie ? `<details class="theorie"><summary>📖 Theorie van dit deel bekijken</summary><div class="theorie-inhoud">${d.theorie}</div></details>` : '';
  const kopHero = (sub) => `<div class="eyebrow">Wiskunde 7VJHO · ${esc(P.titel)} · gevorderden</div>
      <h1>${C.modus === 'expeditie' ? 'Expeditie' : 'Oefenarena'} <span class="q">${C.teken}</span><span class="plus">+</span></h1>${sub}`;

  // =================================================================== EXPEDITIE +
  function expeditie() {
    let S = store.get(C.sleutel, { name: '', best: 0, runs: 0, wins: 0 });
    const save = () => store.set(C.sleutel, S);
    let run = null;

    const pad = (cur) => `<div class="path" style="grid-template-columns:repeat(${N},1fr)">${DELEN.map((d, i) => {
      const nr = i + 1, st = nr < cur ? 'done' : nr === cur ? 'cur' : 'lock';
      return `<div class="step ${st}${isTop(d) ? ' top' : ''}" title="${esc(d.titel)}"><span>${isTop(d) ? '★' : nr}</span><small>${esc(kortTitel(d))}</small></div>`;
    }).join('')}</div>`;

    function start() {
      app.innerHTML = `<div class="hero card">${kopHero(`<p class="muted">De expeditie voor gevorderden: alle ${N} delen van <b>${esc(P.titel)}</b>, in de volgorde van het leerpad, met de moeilijkere oefeningen van de +-versie.
          De laatste etappe (★) is de top: alles door elkaar. Per deel krijg je ${PER} vragen: haal er minstens ${NODIG} juist om door te gaan.
          <b>Mis je een deel, dan start je opnieuw bij deel 1.</b></p>`)}
          <div class="field"><label for="nm"><b>Jouw naam</b></label><input id="nm" maxlength="30" value="${esc(S.name)}" placeholder="Voornaam"></div>
          <div class="row"><button class="btn gold" id="go" type="button">Start de expeditie</button></div>
          <p class="muted">Record: <b>${S.best >= N ? 'top bereikt 🏆' : S.best ? 'deel ' + S.best + ' gehaald' : 'nog geen'}</b> · pogingen: ${S.runs} · voltooid: ${S.wins}</p></div>
        <div class="card"><div class="eyebrow">Het parcours</div>${pad(0)}</div>`;
      $('#go').onclick = () => { S.name = $('#nm').value.trim(); S.runs++; save(); intro(1); };
    }
    function intro(nr) {
      const d = DELEN[nr - 1];
      app.innerHTML = `<div class="card"><div class="row tussen"><div class="eyebrow">${esc(S.name || 'Klimmer')} · ${isTop(d) ? 'de top' : `deel ${nr} van ${N}`}</div><div class="eyebrow">record: deel ${S.best}</div></div>${pad(nr)}</div>
        <div class="card"><div class="eyebrow">${isTop(d) ? '★ De top' : 'Deel ' + nr}</div><h2>${esc(d.titel)}</h2>
          <p class="muted" style="margin:6px 0 10px">${esc(d.kort || '')}</p>
          ${rekentoestel(d) ? `<p class="klein">${rekentoestel(d)}</p>` : ''}
          ${theorieBlok(d)}
          <div class="row" style="margin-top:14px"><button class="btn" id="go" type="button">Start ${isTop(d) ? 'de top' : 'deel ' + nr}</button></div></div>`;
      W.renderIn(app);
      $('#go').onclick = () => { run = { nr, i: 0, goed: 0, marks: [] }; volgende(); };
      $('#go').focus();
    }
    function volgende() {
      if (run.i >= PER) return uitslag();
      const d = DELEN[run.nr - 1];
      app.innerHTML = `<div class="card"><div class="row tussen"><b>${isTop(d) ? '★ ' : 'Deel ' + run.nr + ': '}${esc(kortTitel(d))}</b>
          <div class="dots">${Array.from({ length: PER }, (_, i) => `<span class="${run.marks[i] === undefined ? '' : run.marks[i] ? 'ok' : 'no'}"></span>`).join('')}</div></div></div><div id="qa"></div>`;
      stelVraag($('#qa'), d, maakVraag(d), `Vraag ${run.i + 1} van ${PER}`, (ok) => {
        run.marks.push(ok); if (ok) run.goed++; run.i++;
        if (run.i - run.goed > PER - NODIG) return uitslag();
        volgende(); window.scrollTo(0, 0);
      });
    }
    function uitslag() {
      const L = run.nr, d = DELEN[L - 1];
      window.scrollTo(0, 0);
      if (run.goed >= NODIG) {
        if (L > S.best) S.best = L; save();
        if (L === N) return top();
        const nd = DELEN[L];
        app.innerHTML = `<div class="card"><h2>${esc(kortTitel(d))}: geslaagd! 🎉</h2><p style="margin:8px 0 14px">Je had ${run.goed} van de ${run.i} juist. Op naar ${isTop(nd) ? 'de top' : 'deel ' + (L + 1)}: <b>${esc(nd.titel)}</b>.</p>
          <button class="btn" id="go" type="button">Verder ›</button></div><div class="card">${pad(L + 1)}</div>`;
        $('#go').onclick = () => intro(L + 1); $('#go').focus();
      } else {
        app.innerHTML = `<div class="card"><h2>Terug naar deel 1 …</h2><p style="margin:8px 0 6px">Je had ${run.goed} juist in ${isTop(d) ? 'de top' : 'deel ' + L} (${esc(kortTitel(d))}). Je hebt er minstens ${NODIG} van de ${PER} nodig.</p>
          <p class="muted" style="margin-bottom:14px">Tip: open bij het begin van een deel de theorie (kader <b>Extra uitdaging</b>). Je verste deel tot nu toe: deel ${S.best || 0}.</p>
          <div class="row"><button class="btn gold" id="go" type="button">Opnieuw vanaf deel 1</button><button class="btn ghost" id="home" type="button">Naar het begin</button></div></div>`;
        $('#go').onclick = () => { S.runs++; save(); intro(1); }; $('#home').onclick = start; $('#go').focus();
      }
    }
    function top() {
      S.wins++; S.best = N; save();
      app.innerHTML = `<div class="card hero"><div class="eyebrow">Expeditie + voltooid</div><h1>Proficiat${S.name ? ', ' + esc(S.name) : ''}! 🏆</h1>
          <p style="margin:10px 0">Je hebt alle ${N} delen van ${esc(P.titel)} in één tocht gehaald, tot en met de top. Toon dit scherm aan je leerkracht.</p>
          <p class="muted">${new Date().toLocaleString('nl-BE')}</p>
          <div class="row" style="margin-top:14px"><button class="btn" id="go" type="button">Nog een expeditie</button></div></div>
        <div class="card">${pad(N + 1)}</div>`;
      $('#go').onclick = () => { S.runs++; save(); intro(1); };
    }
    start();
  }

  // =================================================================== OEFENARENA +
  function arena() {
    let S = store.get(C.sleutel, { sel: [], n: 10, best: 0 });
    const save = () => store.set(C.sleutel, S);
    let game = null;

    function start() {
      app.innerHTML = `<div class="hero card">${kopHero(`<p class="muted">Kies zelf welke delen van <b>${esc(P.titel)}</b> je wil oefenen, met de moeilijkere oefeningen van de +-versie.
          Bij een fout zie je meteen de juiste oplossing en de uitleg. Elke reeks van 3 juiste antwoorden na elkaar geeft bonuspunten.</p>`)}
          <p class="muted">Record: <b>${S.best || 0} punten</b></p></div>
        <div class="card"><div class="row tussen"><div class="eyebrow">Delen</div>
            <div class="row"><button class="btn ghost" id="all" type="button">Alles</button><button class="btn ghost" id="none" type="button">Niets</button></div></div>
          <div class="topics">${DELEN.map((d, i) => `<label class="topic"><input type="checkbox" value="${i + 1}" ${S.sel.includes(i + 1) ? 'checked' : ''}>
              <span><b>${isTop(d) ? '★' : i + 1}. ${esc(kortTitel(d))}</b><small>${esc(isTop(d) ? 'Alles door elkaar' : d.kort || '')}</small></span></label>`).join('')}</div>
          <div class="row" style="margin-top:16px"><span><b>Aantal vragen:</b></span>
            ${[10, 15, 20].map(n => `<label class="aantal"><input type="radio" name="n" value="${n}" ${S.n === n ? 'checked' : ''}> ${n}</label>`).join('')}</div>
          <p class="hint" id="warn" style="margin-top:8px"></p>
          <div class="row" style="margin-top:12px"><button class="btn gold" id="go" type="button">Start de ronde</button></div></div>`;
      const boxes = [...app.querySelectorAll('.topic input')];
      $('#all').onclick = () => boxes.forEach(b => { b.checked = true; });
      $('#none').onclick = () => boxes.forEach(b => { b.checked = false; });
      $('#go').onclick = () => {
        const sel = boxes.filter(b => b.checked).map(b => +b.value);
        if (!sel.length) { $('#warn').innerHTML = '<b style="color:var(--neg)">Kies minstens één deel.</b>'; return; }
        S.sel = sel; S.n = +(app.querySelector('input[name=n]:checked') || { value: 10 }).value; save();
        // de delen zo eerlijk mogelijk verdelen over de ronde
        const volg = []; while (volg.length < S.n) volg.push(...W.schud(sel));
        game = { sel, volg: volg.slice(0, S.n), i: 0, ok: 0, punten: 0, reeks: 0, score: Object.fromEntries(sel.map(s => [s, { ok: 0, tot: 0 }])) };
        volgende();
      };
    }
    function volgende() {
      if (game.i >= game.volg.length) return einde();
      const nr = game.volg[game.i], d = DELEN[nr - 1];
      app.innerHTML = `<div class="card"><div class="row tussen"><b>${isTop(d) ? '★ ' : nr + '. '}${esc(kortTitel(d))}</b>
          <div class="row"><span class="pill">🔥 reeks ${game.reeks}</span><span class="pill">⭐ ${game.punten}</span></div></div>
          <div class="progress" style="margin-top:10px"><div style="width:${100 * game.i / game.volg.length}%"></div></div></div><div id="qa"></div>`;
      stelVraag($('#qa'), d, maakVraag(d), `Vraag ${game.i + 1} van ${game.volg.length}`, (ok) => {
        const sc = game.score[nr]; sc.tot++;
        if (ok) { sc.ok++; game.ok++; game.reeks++; game.punten += 10 + (game.reeks % 3 === 0 ? 15 : 0); }
        else game.reeks = 0;
        game.i++; volgende(); window.scrollTo(0, 0);
      });
    }
    function einde() {
      const tot = game.volg.length, ok = game.ok;
      if (window.SpelVolg) SpelVolg.resultaat({ juist: ok, totaal: tot, punten: game.punten, per: game.score }); // leerpaden: ronde bewaren
      const record = game.punten > (S.best || 0); if (record) { S.best = game.punten; save(); }
      const zwak = game.sel.filter(s => game.score[s].tot && game.score[s].ok / game.score[s].tot < 0.75);
      app.innerHTML = `<div class="card hero"><div class="eyebrow">Resultaat</div><h1>${ok} / ${tot}</h1>
          <p class="muted" style="margin-top:6px">⭐ ${game.punten} punten${record ? ' · <b>nieuw record!</b> 🏆' : ''} · ${ok / tot >= .8 ? 'Sterk gedaan! 💪' : ok / tot >= .5 ? 'Goed bezig, oefen nog wat verder.' : 'Blijf oefenen, je komt er wel!'}</p></div>
        <div class="card"><table><tr><th>Deel</th><th>Juist</th></tr>
          ${game.sel.map(s => `<tr><td>${isTop(DELEN[s - 1]) ? '★' : s}. ${esc(kortTitel(DELEN[s - 1]))}</td><td>${game.score[s].ok} / ${game.score[s].tot}</td></tr>`).join('')}</table>
          ${zwak.length ? `<p class="tipbox" style="margin-top:12px"><b>Oefen nog wat extra:</b> ${zwak.map(s => esc(kortTitel(DELEN[s - 1]))).join(', ')}. Bekijk gerust nog eens de theorie in het leerpad.</p>` : ''}
          <div class="row" style="margin-top:14px"><button class="btn" id="again" type="button">Nog een ronde</button>${zwak.length ? '<button class="btn gold" id="weak" type="button">Enkel mijn zwakke delen</button>' : ''}<button class="btn ghost" id="home" type="button">Delen kiezen</button></div></div>`;
      $('#again').onclick = () => { $('#home').onclick(); $('#go').onclick(); };
      $('#home').onclick = start;
      if (zwak.length) $('#weak').onclick = () => { S.sel = zwak; save(); start(); $('#go').onclick(); };
    }
    start();
  }

  (C.modus === 'expeditie' ? expeditie : arena)();
})();
