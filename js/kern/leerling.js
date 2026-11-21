// Leerlingenapp: aanmelden, programma kiezen, leerpad, theorie, voorbeelden, oefenen, test.
(() => {
  const app = document.getElementById('app');
  const esc = W.esc, T = (s, d) => W.tex(s, d);
  const urlProg = new URLSearchParams(location.search).get('p');

  const S = {
    token: API.sessie.get('ll-token'),
    leerling: null, progs: [], prog: null, P: null,
    status: null, view: 'login', vak: null, deel: null, tab: 'theorie',
    oef: {}, test: null, fout: '', bezig: false,
  };
  const DELEN = () => S.P.delen;
  const deelVan = (nr) => DELEN().find(x => x.nr === nr);

  // ---------- algemene hulp
  function info(nr) {
    const st = S.status, d = deelVan(nr);
    const geslaagd = st.geslaagd.includes(nr);
    const open = nr === 1 || st.geslaagd.includes(nr - 1) || st.vrijgegeven.includes(nr);
    const testen = st.testen.filter(t => t.deel === nr);
    const bezig = testen.find(t => t.status === 'bezig');
    const ingediend = testen.filter(t => t.status === 'ingediend');
    // Niet geslaagd? De test gaat automatisch opnieuw open (nieuwe vragen); elke poging telt.
    const over = geslaagd ? 0 : Infinity;
    const oef = st.oefeningen[nr] || { aantal: 0, juist: 0 };
    const beste = ingediend.reduce((b, t) => (!b || t.score > b.score ? t : b), null);
    return { d, geslaagd, open, testen, bezig, ingediend, over, oef, beste, laatste: ingediend[ingediend.length - 1] };
  }
  const nodig = (max) => Math.ceil(S.status.drempel * max / 100);
  const datum = (iso) => iso ? new Date(iso).toLocaleString('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
  const bestandsnaam = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');

  async function roep(fn, params) {
    try { return await API.call(fn, { p_token: S.token, ...params }); }
    catch (e) {
      if (e.code === 'SESSIE_VERLOPEN') { afmelden(true); }
      throw e;
    }
  }
  function afmelden(verlopen) {
    if (!verlopen && S.token) API.call('ll_logout', { p_token: S.token }).catch(() => {});
    API.sessie.del('ll-token'); API.sessie.del('ll-prog');
    Object.assign(S, { token: null, leerling: null, progs: [], prog: null, P: null, vak: null, status: null, view: 'login', test: null, oef: {}, fout: verlopen ? 'Je sessie is verlopen. Meld je opnieuw aan.' : '' });
    render();
  }

  function modaal(titel, html, knoppen) {
    return new Promise(res => {
      const m = document.createElement('div');
      m.className = 'modaal-achter';
      m.innerHTML = `<div class="modaal" role="dialog" aria-modal="true"><h2>${titel}</h2>${html}<div class="knoppen" style="justify-content:flex-end"></div></div>`;
      const k = m.querySelector('.knoppen');
      knoppen.forEach(([tekst, waarde, klasse]) => {
        const b = document.createElement('button'); b.textContent = tekst; if (klasse) b.className = klasse;
        b.onclick = () => { m.remove(); res(waarde); }; k.appendChild(b);
      });
      document.body.appendChild(m); W.renderIn(m);
      k.lastChild.focus();
    });
  }

  // ---------- programma's
  function beschikbaar() { return S.progs.filter(p => Leerpaden.vind(p.code)); }
  async function openProgramma(code) {
    const P = Leerpaden.vind(code);
    if (!P) return;
    S.status = await roep('ll_status', { p_programma: code });
    Object.assign(S, { prog: code, P, view: 'pad', oef: {}, test: null });
    API.sessie.set('ll-prog', code);
    document.title = P.titel;
  }
  async function naLogin() {
    const lijst = beschikbaar();
    const voorkeur = urlProg || API.sessie.get('ll-prog');
    const keuze = lijst.find(p => p.code === voorkeur) || (lijst.length === 1 ? lijst[0] : null);
    if (keuze) await openProgramma(keuze.code);
    else S.view = 'kies';
  }

  // ---------- weergave
  function kop() {
    const naam = S.leerling ? `${esc(S.leerling.voornaam)} ${esc(S.leerling.naam)}` : '';
    const titel = S.P ? S.P.titel : (CONFIG.TITEL || 'Leerpaden');
    const onder = S.P ? (S.P.ondertitel || '') : (CONFIG.ONDERTITEL || '');
    return `${API.DEMO ? '<div class="demo-band">DEMO — gegevens blijven enkel in deze browser · leerling: demo / demo · <a href="leerkracht.html">naar de leerkrachtpagina</a></div>' : ''}
      <header class="balk"><div class="schoollogo" role="img" aria-label="De Resonant"></div>
        <div class="logo">${esc(titel)}<small>${esc(onder)}</small></div>
        ${S.leerling ? `<div class="rechts"><span>${naam}</span>
          ${S.view === 'deel' ? '<button class="licht" data-a="pad">Leerpad</button>' : ''}
          ${S.P && beschikbaar().length > 1 ? '<button class="licht" data-a="kies">Andere leerpaden</button>' : ''}
          <button class="licht" data-a="afmelden">Afmelden</button></div>` : ''}
      </header>`;
  }

  function render() {
    let inhoud = '';
    if (S.view === 'login') inhoud = vLogin();
    else if (S.view === 'kies') inhoud = vKies();
    else if (S.view === 'pad') inhoud = vPad();
    else if (S.view === 'deel') inhoud = vDeel();
    app.innerHTML = kop() + `<main>${inhoud}</main>`;
    W.renderIn(app);
    koppel();
  }

  function vLogin() {
    return `<div class="login kaart">
      <h1>Aanmelden</h1>
      <p class="klein midden">Gebruik de gebruikersnaam en het wachtwoord dat je van je leerkracht kreeg.</p>
      ${S.fout ? `<div class="melding fout">${esc(S.fout)}</div>` : ''}
      <form id="loginform">
        <label for="gn">Gebruikersnaam</label><input type="text" id="gn" autocomplete="username" autocapitalize="none" spellcheck="false" required>
        <label for="pw">Wachtwoord</label><input type="password" id="pw" autocomplete="current-password" required>
        <div style="margin-top:16px"><button type="submit" style="width:100%" ${S.bezig ? 'disabled' : ''}>Aanmelden</button></div>
      </form></div>`;
  }

  // Leerpaden van de leerling, gegroepeerd per vak (volgens de catalogus).
  function perVak() {
    const kl = S.leerling ? S.leerling.klas : '';
    const groepen = new Map();
    for (const p of beschikbaar()) {
      const pl = window.Catalogus ? Catalogus.plaatsVoor(p.code, kl) : null;
      const sleutel = pl ? pl.vak : '_overig';
      if (!groepen.has(sleutel)) groepen.set(sleutel, { vak: sleutel, naam: pl ? pl.V.naam : 'Andere leerpaden', items: [] });
      groepen.get(sleutel).items.push({ p, P: Leerpaden.vind(p.code), h: pl ? pl.h : null });
    }
    const lijst = [...groepen.values()];
    // Twee vakken met dezelfde naam (bv. "Wiskunde"): toon de map erbij.
    lijst.forEach(g => { const dubbel = lijst.filter(x => x.naam === g.naam).length > 1; g.titel = dubbel && g.vak !== '_overig' ? `${g.naam} ${Catalogus.klassenMetVak(g.vak).join(' · ')}` : g.naam; });
    lijst.forEach(g => g.items.sort((a, b) => (a.h ? a.h.nr : 99) - (b.h ? b.h.nr : 99)));
    return lijst;
  }
  function leerpadKnop({ p, P, h }) {
    return `<button class="stap open" data-a="prog" data-code="${esc(p.code)}"><div class="nr">→</div>
      <div><div class="titel">${esc(P.titel)}</div><div class="sub">${h ? `Hoofdstuk ${h.nr}: ${esc(h.titel)}` : esc(P.ondertitel || '')}</div></div><span></span></button>`;
  }
  function vKies() {
    const groepen = perVak();
    const kl = window.Catalogus && S.leerling ? Catalogus.klasVan(S.leerling.klas) : null;
    const klasTekst = S.leerling && S.leerling.klas ? ` <span class="klein">· klas ${esc(S.leerling.klas)}</span>` : '';
    if (!groepen.length) return `<h1>Dag ${esc(S.leerling.voornaam)}!${klasTekst}</h1>
      <div class="kaart"><p>Je bent nog aan geen enkel leerpad gekoppeld. Vraag aan je leerkracht om je toe te voegen.</p></div>`;
    const g = groepen.length === 1 ? groepen[0] : groepen.find(x => x.vak === S.vak);
    if (!g) return `<h1>Dag ${esc(S.leerling.voornaam)}!${klasTekst}</h1><p>Kies een vak.</p>
      <div class="tegels">${groepen.map(x => `<button class="tegel" data-a="vak" data-vak="${esc(x.vak)}">
        <div class="tegel-titel">${esc(x.titel)}</div><div class="klein">${x.items.length} leerpad${x.items.length === 1 ? '' : 'en'}</div></button>`).join('')}</div>`;
    return `${groepen.length > 1 ? '<p class="klein"><button class="link" data-a="vak" data-vak="">← Alle vakken</button></p>' : ''}
      <h1>${groepen.length > 1 ? esc(g.titel) : `Dag ${esc(S.leerling.voornaam)}!`}${klasTekst}</h1>
      <p>Kies een leerpad${groepen.length > 1 ? '' : ` · ${esc(g.titel)}`}.</p>
      <div class="pad">${g.items.map(leerpadKnop).join('')}</div>`;
  }

  function stapKnop(d) {
    const i = info(d.nr);
    let klasse = 'dicht', etiket = '<span class="etiket grijs">🔒 Vergrendeld</span>', klik = false;
    if (!d.klaar) { etiket = '<span class="etiket grijs">Binnenkort</span>'; }
    else if (i.geslaagd) { klasse = 'geslaagd'; etiket = `<span class="etiket groen">✓ Geslaagd ${i.beste ? i.beste.score + '/' + i.beste.max : ''}</span>`; klik = true; }
    else if (i.open) {
      klasse = 'open'; klik = true;
      if (i.bezig) etiket = '<span class="etiket oranje">Test bezig</span>';
      else if (i.over <= 0) etiket = '<span class="etiket rood">Oefen verder</span>';
      else etiket = '<span class="etiket oranje">Nu aan de beurt</span>';
    }
    const binnen = `<div class="nr">${i.geslaagd ? '✓' : d.nr}</div>
      <div><div class="titel">Deel ${d.nr}: ${esc(d.titel)}</div><div class="sub">${esc(d.kort)}</div></div>${etiket}`;
    return klik && d.klaar ? `<button class="stap ${klasse}" data-a="deel" data-nr="${d.nr}">${binnen}</button>` : `<div class="stap ${klasse}">${binnen}</div>`;
  }

  function vPad() {
    const st = S.status, P = S.P;
    const totaal = DELEN().filter(d => d.klaar).length;
    const groepen = P.groepen || [{ titel: '', delen: DELEN().map(d => d.nr) }];
    return `<h1>Dag ${esc(S.leerling.voornaam)}!</h1>
      ${P.intro || `<p>Werk de delen één voor één af: lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test.
      Haal je <b>${st.drempel}%</b>, dan gaat het volgende deel open.</p>`}
      ${P.afspraken || ''}
      <p class="klein">Geslaagd: ${st.geslaagd.length} van ${DELEN().length} delen${totaal < DELEN().length ? ' · nog niet alle delen zijn beschikbaar' : ''}.</p>
      ${groepen.map(g => `${g.titel ? `<div class="groep-titel">${esc(g.titel)}</div>` : ''}
        <div class="pad">${g.delen.map(nr => deelVan(nr)).filter(Boolean).map(stapKnop).join('')}</div>`).join('')}`;
  }

  function vDeel() {
    const d = deelVan(S.deel);
    const tabs = [['theorie', 'Theorie'], ['voorbeelden', 'Voorbeelden'], ['oefenen', 'Oefenen'], ['test', 'Test']];
    let inhoud = '';
    if (S.tab === 'theorie') inhoud = d.theorie + (S.P.invoerhulp ? S.P.invoerhulp(d) : '') + `<div class="knoppen"><button data-a="tab" data-tab="voorbeelden">Verder naar de voorbeelden →</button></div>`;
    if (S.tab === 'voorbeelden') inhoud = vVoorbeelden(d);
    if (S.tab === 'oefenen') inhoud = vOefenen(d);
    if (S.tab === 'test') inhoud = vTest(d);
    return `<p class="klein"><button class="link" data-a="pad">← Leerpad</button></p>
      <h1>Deel ${d.nr}: ${esc(d.titel)}</h1>
      ${d.rekenmachine === true || d.rekenmachine === false ? `<div class="rekenmachine ${d.rekenmachine ? 'ja' : 'nee'}">${d.rekenmachine ? '🧮 Rekenmachine toegestaan' : '✏️ Zonder rekenmachine'}</div>` : ''}
      <div class="tabs">${tabs.map(([k, l], i) => `<button class="tab ${S.tab === k ? 'actief' : ''}" data-a="tab" data-tab="${k}"><span class="stapnr">${i + 1}</span>${l}</button>`).join('')}</div>
      ${inhoud}`;
  }

  // ---------- voorbeelden
  const vbStap = {};
  function vVoorbeelden(d) {
    return `<p>Probeer elk voorbeeld eerst zelf. Klik daarna stap voor stap door de oplossing.</p>` +
      d.voorbeelden.map((v, i) => {
        const k = S.prog + '-' + d.nr + '-' + i, n = vbStap[k] || 0;
        const stap = (s) => typeof s === 'object' ? s.html : T(s);
        return `<div class="vb"><div class="opgave"><b>Voorbeeld ${i + 1}.</b> &nbsp; ${W.opgave(v)}</div>
          <div class="stappen">${v.stappen.slice(0, n).map(s => `<div>${stap(s)}</div>`).join('')}</div>
          ${n < v.stappen.length ? `<div style="margin-top:8px"><button class="licht" data-a="vbstap" data-k="${k}">${n === 0 ? 'Toon de oplossing' : 'Volgende stap'}</button>
            ${n === 0 && v.stappen.length > 1 ? `<button class="link klein" data-a="vballes" data-k="${k}" data-n="${v.stappen.length}">alles tonen</button>` : ''}</div>` : ''}
        </div>`;
      }).join('') + `<div class="knoppen"><button data-a="tab" data-tab="oefenen">Zelf oefenen →</button></div>`;
  }

  // ---------- oefenen
  function oefState(d) {
    if (!S.oef[d.nr]) S.oef[d.nr] = { soort: 'alles', vraag: null, w: null, nagekeken: null, n: 0, j: 0, reeks: [], melding: '' };
    const o = S.oef[d.nr];
    if (!o.vraag) nieuweVraag(d, o);
    return o;
  }
  function nieuweVraag(d, o) {
    let v, i = 0;
    // de laatste 6 opgaven niet meteen opnieuw geven (minder herhaling bij het oefenen)
    const sl = (x) => x.sleutel || x.tex || x.html;
    o.recent = (o.recent || []);
    if (o.vraag) { o.recent.push(sl(o.vraag)); o.recent = o.recent.slice(-6); }
    do { v = d.soorten[o.soort === 'alles' ? W.gewogen(d.oefenMix) : o.soort].gen(); }
    while (o.recent.includes(sl(v)) && i++ < 30);
    Object.assign(o, { vraag: v, w: Antwoord.leeg(v.antw), nagekeken: null, melding: '' });
  }
  const opdracht = (d, v) => v.opdracht || d.opdracht || 'Bereken.';
  const opgave = (v) => W.opgave(v);
  const uitlegHTML = (v) => (v.uitlegHtml || '') + [].concat(v.uitleg || []).map(u => `<div class="uitlegregel">${T(u)}</div>`).join('');

  function vOefenen(d) {
    const o = oefState(d), i = info(d.nr), v = o.vraag;
    const laatste10 = o.reeks.slice(-10);
    const klaarVoorTest = laatste10.length >= 10 && laatste10.filter(Boolean).length >= 8 && !i.geslaagd && (i.over > 0 || i.bezig);
    let fb = '';
    const n = o.nagekeken;
    if (n) {
      const juist = Antwoord.juistHTML(v.antw);
      if (n.status === 'juist') fb = `<div class="feedback j"><div class="kop">✓ Juist!</div>${uitlegHTML(v)}</div>`;
      else if (n.status === 'vorm') fb = `<div class="feedback f"><div class="kop">✗ Bijna. ${esc(n.bericht)}</div><div>Juiste antwoord: ${juist}</div>${uitlegHTML(v)}</div>`;
      else fb = `<div class="feedback f"><div class="kop">✗ Niet juist.${n.bericht ? ' ' + esc(n.bericht) : ''}</div><div>Juiste antwoord: ${juist}</div>${uitlegHTML(v)}</div>`;
    }
    const kbd = !n && Antwoord.heeftToetsenbord(v.antw);
    return `<div class="oef-boven">
        <div><label for="soort">Soort oefeningen</label>
          <select id="soort">${[['alles', 'Alles door elkaar'], ...Object.entries(d.soorten).filter(([, s]) => !s.verborgen).map(([k, s]) => [k, s.naam])].map(([k, l]) => `<option value="${k}" ${o.soort === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
        <div class="teller"><span>Deze keer: <b>${o.j}</b> juist van <b>${o.n}</b></span>
          <span class="bolletjes" title="Je laatste 10 oefeningen">${Array.from({ length: 10 }, (_, k) => { const r = laatste10[k]; return `<span class="bol ${r === true ? 'j' : r === false ? 'f' : ''}"></span>`; }).join('')}</span></div>
      </div>
      ${klaarVoorTest ? `<div class="melding ok">Je had 8 of meer van je laatste 10 oefeningen juist. Je lijkt klaar voor de test! <button class="link" data-a="tab" data-tab="test">Naar de test →</button></div>` : ''}
      <div class="kaart">
        <div class="klein midden opdracht">${esc(opdracht(d, v))}</div>
        <div class="opgave-groot">${opgave(v)}</div>
        ${Antwoord.html('oefin', v.antw, o.w, !!n)}
        ${kbd ? Antwoord.toetsenbord(Antwoord.toetsen(v.antw)) : ''}
        ${o.melding ? `<div class="melding let midden">${esc(o.melding)}</div>` : ''}
        ${fb}
        <div class="knoppen">${n ? '<button class="oranje" data-a="volgende" id="volgende">Volgende oefening →</button>' : '<button data-a="controleer">Controleer</button>'}</div>
      </div>
      <p class="klein midden">Je hebt in totaal al ${i.oef.aantal} oefeningen van dit deel gemaakt.</p>`;
  }

  async function controleer() {
    const d = deelVan(S.deel), o = S.oef[d.nr], v = o.vraag;
    Antwoord.lees('oefin', v.antw, o.w);
    const r = Antwoord.nakijk(v.antw, o.w);
    if (r.status === 'leeg' || r.status === 'ongeldig') { o.melding = r.bericht; return render(); }
    const juist = r.status === 'juist';
    o.nagekeken = r; o.melding = ''; o.n++; if (juist) o.j++; o.reeks.push(juist);
    const oe = (S.status.oefeningen[d.nr] ||= { aantal: 0, juist: 0 }); oe.aantal++; if (juist) oe.juist++;
    render();
    const knop = document.getElementById('volgende'); if (knop) knop.focus({ preventScroll: true });
    roep('ll_oefening', { p_programma: S.prog, p_deel: d.nr, p_soort: v.soort, p_juist: juist }).catch(() => {});
  }

  // ---------- test
  // Lijst van de ingediende pogingen, met verbetering en PDF.
  function lijstIngediend(i) {
    if (!i.ingediend.length) return '';
    return `<h2>Mijn ingediende testen</h2>
      <div class="kaart">${i.ingediend.map((t, k) => `<div class="testvraag ${t.geslaagd ? 'j' : 'f'}" style="grid-template-columns:34px 1fr auto">
          <div class="vnr">${t.geslaagd ? '✓' : '✗'}</div>
          <div><b>Poging ${k + 1}</b> · ${t.score}/${t.max} <span class="klein">· ingediend op ${esc(datum(t.ingediend))}</span></div>
          <div><button class="licht" data-a="bekijk" data-id="${t.id}">Bekijk verbetering</button></div></div>`).join('')}</div>`;
  }

  function vTest(d) {
    const i = info(d.nr);
    const t = S.test && S.test.deel === d.nr ? S.test : null;
    if (t && t.resultaat) return vResultaat(d, t);
    if (t) return vTestBezig(d, t);
    if (i.geslaagd) {
      const volgende = deelVan(d.nr + 1);
      return `<div class="kaart midden"><div class="score-groot j">${i.beste.score}/${i.beste.max}</div>
        <p>Je bent geslaagd voor de test van dit deel. Goed gedaan!</p>
        ${volgende && volgende.klaar ? `<button data-a="deel" data-nr="${volgende.nr}">Naar deel ${volgende.nr} →</button>` : volgende ? '<p class="klein">Het volgende deel komt binnenkort online.</p>' : '<p><b>Je hebt het hele leerpad afgewerkt!</b></p>'}</div>
        ${lijstIngediend(i)}`;
    }
    if (i.bezig) {
      return `<div class="kaart"><h2>Je test is nog bezig</h2><p>Je bent deze test al gestart. Ga verder waar je gebleven was.</p>
        <div class="knoppen"><button class="oranje" data-a="teststart">Ga verder met de test</button></div></div>`;
    }
    if (i.over <= 0) {
      const l = i.laatste;
      return `<div class="kaart"><h2>Test gemaakt</h2>
        <p>Je behaalde <b>${l.score}/${l.max}</b>. Je hebt minstens <b>${nodig(l.max)}/${l.max}</b> nodig.</p>
        <div class="melding let">Oefen verder op dit deel. Als je klaar bent, vraag je aan je leerkracht om de test opnieuw open te zetten.</div>
        <div class="knoppen"><button data-a="tab" data-tab="oefenen">Verder oefenen</button></div></div>
        ${lijstIngediend(i)}`;
    }
    const aantal = d.test.reduce((s, x) => s + x[1], 0);
    return `<div class="kaart"><h2>Test deel ${d.nr}</h2>
      <ul class="regels">
        <li>De test bestaat uit <b>${aantal} vragen</b>.</li>
        <li>Je hebt minstens <b>${nodig(aantal)}/${aantal}</b> (${S.status.drempel}%) nodig om naar het volgende deel te gaan.</li>
        <li>Zodra je start, telt je poging, ook als je de pagina sluit. <b>Elke poging telt mee</b> voor je punten.</li>
        <li>Niet geslaagd? Bekijk je fouten, oefen verder en probeer de test daarna opnieuw (met nieuwe vragen).</li>
        <li>${d.rekenmachine === true ? 'Je mag je <b>rekenmachine</b> gebruiken. ' : d.rekenmachine === false ? 'Gebruik <b>geen rekenmachine</b>. ' : ''}Neem een kladblad om je tussenstappen te noteren.</li>
        ${(d.testRegels || []).map(r => `<li>${r}</li>`).join('')}
        <li>Een antwoord dat klopt maar niet in de gevraagde vorm staat (bv. niet vereenvoudigd of niet afgerond zoals gevraagd), telt als fout.</li>
      </ul>
      ${i.ingediend.length ? `<p class="klein">Dit wordt je <b>poging ${i.ingediend.length + 1}</b>. Vorige score: ${i.laatste.score}/${i.laatste.max}.</p>` : ''}
      <div class="melding info">Twijfel je nog? <button class="link" data-a="tab" data-tab="oefenen">Oefen eerst nog wat</button>.</div>
      <div class="knoppen"><button class="oranje" data-a="teststart">Start de test</button></div></div>
      ${lijstIngediend(i)}`;
  }

  function vTestBezig(d, t) {
    const beantwoord = t.vragen.filter((v, k) => Antwoord.isIngevuld(v.antw, t.antw[k])).length;
    const sets = new Set(); t.vragen.forEach(v => Antwoord.toetsen(v.antw, sets));
    let vorige = '';
    return `<div class="melding info" id="testteller">Test deel ${d.nr} · ${beantwoord} van ${t.vragen.length} vragen beantwoord. Je antwoorden worden bijgehouden tot je indient.</div>
      <div class="kaart">
      ${t.vragen.map((v, k) => {
        const o = opdracht(d, v), toon = o !== vorige; vorige = o;
        return `<div class="testvraag blok"><div class="vnr">${k + 1}.</div>
          <div class="inhoud-blok">${toon ? `<div class="klein">${esc(o)}</div>` : ''}
            <div class="opg">${opgave(v)}</div>${Antwoord.html('t' + k, v.antw, t.antw[k], false)}</div></div>`;
      }).join('')}
      ${sets.size ? `<div class="toetsenbord-plakker">${Antwoord.toetsenbord(sets)}</div>` : ''}
      <div class="knoppen"><button class="oranje" data-a="indienen">Test indienen</button></div></div>`;
  }

  function verbeteringHTML(d, t) {
    const r = t.resultaat;
    return `<div class="kaart">${t.vragen.map((v, k) => {
        const a = (r.details || [])[k] || {};
        const jouw = a.g ? Antwoord.gegevenHTML(a.g) : (a.gegeven ? `<b>${esc(a.gegeven)}</b>` : '—');
        return `<div class="testvraag blok ${a.juist ? 'j' : 'f'}"><div class="vnr">${a.juist ? '✓' : '✗'}</div>
          <div class="inhoud-blok"><div class="klein">${k + 1}. ${esc(opdracht(d, v))}</div><div class="opg">${opgave(v)}</div>
          <div>Juiste antwoord: ${Antwoord.juistHTML(v.antw)}</div>
          <div class="klein">Jouw antwoord: ${jouw}${a.bericht ? ` · <i>${esc(a.bericht)}</i>` : ''}</div>
          ${a.juist ? '' : `<div class="klein">${uitlegHTML(v)}</div>`}</div></div>`;
      }).join('')}</div>`;
  }

  function vResultaat(d, t) {
    const r = t.resultaat;
    const volgende = deelVan(d.nr + 1);
    const pdfKnop = `<button class="licht" data-a="pdf">⬇ Download als PDF</button>`;
    if (r.oud) {
      return `<div class="kaart midden">
          <p class="klein">Poging ${r.poging} · ingediend op ${esc(datum(r.ingediend))}</p>
          <div class="score-groot ${r.geslaagd ? 'j' : 'f'}">${r.score}/${r.max}</div>
          <div class="knoppen" style="justify-content:center"><button class="licht" data-a="terugtest">← Terug</button>${pdfKnop}</div>
        </div>
        <h2>Verbetering</h2>${verbeteringHTML(d, t)}`;
    }
    return `<div class="kaart midden">
        <div class="score-groot ${r.geslaagd ? 'j' : 'f'}">${r.score}/${r.max}</div>
        ${r.geslaagd
          ? `<p><b>Proficiat, je bent geslaagd!</b> ${volgende ? `Deel ${volgende.nr} is nu open.` : 'Je hebt het hele leerpad afgewerkt!'}</p>
             <div class="knoppen" style="justify-content:center">${volgende && volgende.klaar ? `<button data-a="deel" data-nr="${volgende.nr}">Naar deel ${volgende.nr} →</button>` : ''}${pdfKnop}</div>`
          : `<p>Je had minstens ${nodig(r.max)}/${r.max} nodig. Bekijk hieronder je fouten en oefen verder. Daarna kan je de test opnieuw maken, met nieuwe vragen.</p>
             <div class="knoppen" style="justify-content:center"><button data-a="tab" data-tab="oefenen">Verder oefenen</button>${pdfKnop}</div>`}
        <p class="klein">Je kan deze verbetering later altijd terugvinden onder het tabblad Test.</p>
      </div>
      <h2>Verbetering</h2>${verbeteringHTML(d, t)}`;
  }

  // Een eerder ingediende test opnieuw bekijken
  async function bekijk(id) {
    const r = await roep('ll_test_bekijken', { p_test: id });
    const d = deelVan(r.deel);
    if (!d) return;
    const poging = info(r.deel).ingediend.findIndex(t => t.id === r.id) + 1;
    S.view = 'deel'; S.deel = r.deel; S.tab = 'test';
    S.test = { id: r.id, deel: r.deel, vragen: r.vragen,
      resultaat: { oud: true, poging: poging || 1, score: r.score, max: r.max, geslaagd: r.geslaagd, ingediend: r.ingediend, details: r.antwoorden || [] } };
    render(); window.scrollTo(0, 0);
  }

  // De PDF-maker tekent de SVG's van KaTeX (wortels, breukstrepen, pijlen) niet goed:
  // zet ze om naar afbeeldingen met een vaste maat.
  function svgNaarAfbeelding(el) {
    el.querySelectorAll('.katex svg').forEach(svg => {
      const ouder = svg.parentElement, r = svg.getBoundingClientRect();
      const b = Math.min(r.width || 0, ouder.getBoundingClientRect().width || r.width), h = r.height;
      if (!b || !h) return;
      const kopie = svg.cloneNode(true);
      kopie.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      kopie.setAttribute('width', b); kopie.setAttribute('height', h);
      kopie.setAttribute('fill', getComputedStyle(svg).color || '#000');
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(kopie.outerHTML.replace(/currentColor/g, getComputedStyle(svg).color || '#000'));
      img.style.cssText = `display:block;width:${b}px;height:${h}px;position:${getComputedStyle(svg).position};left:0;top:0`;
      svg.replaceWith(img);
    });
  }

  // De verbetering als PDF downloaden (zelfde opmaak als op het scherm)
  async function downloadPDF(knop) {
    const t = S.test; if (!t || !t.resultaat) return;
    const d = deelVan(t.deel), r = t.resultaat, l = S.leerling || {};
    const wanneer = r.ingediend || new Date().toISOString();
    const logo = new URL((location.pathname.includes('/test/') ? '../' : '') + 'img/logo-deresonant.png', location.href).href;
    const houder = document.createElement('div');
    houder.style.cssText = 'position:fixed;left:-10000px;top:0;background:#fff';
    houder.innerHTML = `<div class="pdf-verbetering" style="width:680px;background:#fff;padding:4px;color:#1f2733">
        <style>.pdf-verbetering .kaart { box-shadow: none; border: 1px solid #ccd3dd; padding: 6px 12px; margin: 0; }
          .pdf-verbetering .testvraag.j { background: #eef7f1; border-left: 4px solid #2e7d4f; }
          .pdf-verbetering .testvraag.f { background: #fbefed; border-left: 4px solid #b83a2e; }
          .pdf-verbetering .testvraag { padding: 8px 6px; }</style>
        <div style="display:flex;align-items:center;gap:14px;border-bottom:3px solid #1c4e8a;padding-bottom:6px;margin-bottom:10px">
          <img src="${logo}" alt="De Resonant" style="height:34px">
          <div style="flex:1"><div style="font-size:20px;font-weight:bold;color:#1c4e8a">Verbetering test deel ${d.nr}: ${esc(d.titel)}</div>
            <div class="klein">${esc(S.P.titel)} · ${esc(l.voornaam || '')} ${esc(l.naam || '')}${l.klas ? ' · ' + esc(l.klas) : ''}</div></div>
          <div style="text-align:right"><div style="font-size:24px;font-weight:bold;color:${r.geslaagd ? '#2e7d4f' : '#b83a2e'}">${r.score}/${r.max}</div>
            <div class="klein">${esc(datum(wanneer))}</div></div>
        </div>
        ${verbeteringHTML(d, t)}</div>`;
    document.body.appendChild(houder); W.renderIn(houder);
    svgNaarAfbeelding(houder);
    const tekst = knop ? knop.textContent : '';
    if (knop) { knop.disabled = true; knop.textContent = 'PDF maken…'; }
    const sx = window.scrollX, sy = window.scrollY; window.scrollTo(0, 0);
    try {
      if (!window.html2pdf) throw new Error('De PDF-maker is niet geladen. Controleer je internetverbinding en herlaad de pagina.');
      await html2pdf().set({
        margin: [12, 12, 12, 12],
        filename: `Verbetering_${bestandsnaam(S.P.titel)}_deel${d.nr}_${bestandsnaam((l.naam || '') + '_' + (l.voornaam || ''))}_${new Date(wanneer).toLocaleDateString('sv-SE')}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.testvraag'] },
      }).from(houder.firstElementChild).save();
    } finally {
      houder.remove(); window.scrollTo(sx, sy);
      if (knop) { knop.disabled = false; knop.textContent = tekst; }
    }
  }

  const testSleutel = (id) => `test-${S.prog}-${id}`;
  function testOpslaan() { if (S.test && !S.test.resultaat) API.sessie.set(testSleutel(S.test.id), JSONX.stringify(S.test.antw)); }
  function leesTestInvoer() {
    if (!S.test || S.test.resultaat || S.tab !== 'test' || S.view !== 'deel') return;
    S.test.vragen.forEach((v, k) => Antwoord.lees('t' + k, v.antw, S.test.antw[k]));
    testOpslaan();
  }

  async function testStart() {
    const d = deelVan(S.deel), i = info(d.nr);
    if (!i.bezig) {
      const ok = await modaal('Test starten?', '<p>Zodra je start, telt je poging (ook als je de pagina sluit). Elke poging telt mee voor je punten.</p>', [['Nog niet', false, 'licht'], ['Start de test', true, 'oranje']]);
      if (!ok) return;
    }
    try {
      const r = await roep('ll_test_start', { p_programma: S.prog, p_deel: d.nr, p_vragen: Leerpaden.maakTest(d) });
      let antw = null;
      try { antw = JSONX.parse(API.sessie.get(testSleutel(r.id))); } catch (e) { }
      if (!Array.isArray(antw) || antw.length !== r.vragen.length) antw = r.vragen.map(v => Antwoord.leeg(v.antw));
      S.test = { id: r.id, deel: d.nr, vragen: r.vragen, antw };
      S.tab = 'test';
      S.status = await roep('ll_status', { p_programma: S.prog });
      render(); window.scrollTo(0, 0);
    } catch (e) {
      await modaal('Dat lukte niet', `<p>${esc(e.message)}</p>`, [['OK', true]]);
      S.status = await roep('ll_status', { p_programma: S.prog }).catch(() => S.status); render();
    }
  }

  async function indienen() {
    leesTestInvoer();
    const t = S.test;
    const resultaten = t.vragen.map((v, k) => Antwoord.nakijk(v.antw, t.antw[k]));
    const open = t.vragen.filter((v, k) => !Antwoord.isIngevuld(v.antw, t.antw[k])).length;
    const ongeldig = resultaten.filter(r => r.status === 'ongeldig').length;
    let waarschuwing = '';
    if (open) waarschuwing += `<div class="melding let">Je hebt nog <b>${open}</b> ${open === 1 ? 'vraag' : 'vragen'} niet (volledig) beantwoord.</div>`;
    if (ongeldig) waarschuwing += `<div class="melding let"><b>${ongeldig}</b> ${ongeldig === 1 ? 'antwoord kan' : 'antwoorden kunnen'} niet gelezen worden en ${ongeldig === 1 ? 'telt' : 'tellen'} als fout. Kijk naar de tekst onder het invulvak.</div>`;
    const ok = await modaal('Test indienen?', `${waarschuwing}<p>Na het indienen kan je niets meer veranderen.</p>`, [['Terug naar de test', false, 'licht'], ['Indienen', true, 'oranje']]);
    if (!ok) return;
    const details = t.vragen.map((v, k) => {
      const g = Antwoord.gegeven(v.antw, t.antw[k]), r = resultaten[k];
      const d = { gegeven: g.tekst, g, juist: r.status === 'juist' };
      if ((r.status === 'vorm' || r.status === 'ongeldig' || r.status === 'fout') && r.bericht) d.bericht = r.bericht;
      return d;
    });
    const score = details.filter(x => x.juist).length;
    try {
      const r = await roep('ll_test_indienen', { p_test: t.id, p_antwoorden: details, p_score: score });
      API.sessie.del(testSleutel(t.id));
      t.resultaat = { score: r.score, max: r.max, geslaagd: r.geslaagd, details };
      S.status = r.status;
      render(); window.scrollTo(0, 0);
    } catch (e) { await modaal('Indienen mislukt', `<p>${esc(e.message)}</p><p>Je antwoorden zijn bewaard. Probeer opnieuw.</p>`, [['OK', true]]); }
  }

  // ---------- events
  function koppel() {
    const f = document.getElementById('loginform');
    if (f) f.onsubmit = async (e) => {
      e.preventDefault();
      S.bezig = true; S.fout = ''; const knop = f.querySelector('button'); if (knop) knop.disabled = true;
      try {
        const r = await API.call('ll_login', { p_gebruikersnaam: document.getElementById('gn').value, p_wachtwoord: document.getElementById('pw').value });
        S.token = r.token; S.leerling = r.leerling; S.progs = r.programmas || []; API.sessie.set('ll-token', r.token);
        await naLogin();
      } catch (err) { S.fout = err.message; }
      S.bezig = false; render();
      if (S.view === 'login') document.getElementById('gn').focus();
    };

    const sel = document.getElementById('soort');
    if (sel) sel.onchange = () => { const d = deelVan(S.deel), o = S.oef[d.nr]; o.soort = sel.value; nieuweVraag(d, o); render(); };

    const d = S.view === 'deel' ? deelVan(S.deel) : null;
    if (d && S.tab === 'oefenen' && S.oef[d.nr] && !S.oef[d.nr].nagekeken) {
      const o = S.oef[d.nr];
      const velden = Antwoord.koppel('oefin', o.vraag.antw, o.w, { bijEnter: controleer });
      if (velden[0] && !velden[0].disabled && window.innerWidth > 700) velden[0].focus({ preventScroll: true });
    }
    Antwoord.koppelToetsenbord(app);
    const vk = document.getElementById('volgende');
    if (vk) vk.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); vk.click(); } };

    if (S.test && !S.test.resultaat && S.tab === 'test' && S.view === 'deel') {
      const t = S.test;
      const telBij = () => {
        const n = t.vragen.filter((v, k) => Antwoord.isIngevuld(v.antw, t.antw[k])).length;
        const el = document.getElementById('testteller');
        if (el) el.textContent = `Test deel ${t.deel} · ${n} van ${t.vragen.length} vragen beantwoord. Je antwoorden worden bijgehouden tot je indient.`;
        testOpslaan();
      };
      const alle = [];
      t.vragen.forEach((v, k) => alle.push(Antwoord.koppel('t' + k, v.antw, t.antw[k], { bijWijziging: telBij, bijEnter: () => {} })));
      // Enter springt naar het eerste veld van de volgende vraag
      alle.forEach((velden, k) => { const laatste = velden[velden.length - 1]; if (laatste) laatste.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const n = alle.slice(k + 1).find(x => x.length); if (n) n[0].focus(); } }); });
    }

    app.querySelectorAll('[data-a]').forEach(el => el.onclick = async () => {
      const a = el.dataset.a;
      try {
        if (a === 'afmelden') return afmelden(false);
        if (a === 'kies') { leesTestInvoer(); S.view = 'kies'; S.test = null; S.P = null; S.prog = null; API.sessie.del('ll-prog'); document.title = CONFIG.TITEL || 'Leerpaden'; return render(); }
        if (a === 'prog') { await openProgramma(el.dataset.code); return render(); }
        if (a === 'vak') { S.vak = el.dataset.vak || null; return render(); }
        if (a === 'pad') { leesTestInvoer(); S.view = 'pad'; if (S.test && S.test.resultaat) S.test = null; render(); return window.scrollTo(0, 0); }
        if (a === 'deel') { leesTestInvoer(); S.view = 'deel'; S.deel = +el.dataset.nr; S.tab = 'theorie'; if (S.test && (S.test.resultaat || S.test.deel !== S.deel)) S.test = null; render(); return window.scrollTo(0, 0); }
        if (a === 'tab') {
          leesTestInvoer(); S.tab = el.dataset.tab;
          if (S.tab === 'test' && !S.test && info(S.deel).bezig) { return testStart(); }
          if (S.tab !== 'test' && S.test && S.test.resultaat) S.test = null;
          render(); return window.scrollTo(0, 0);
        }
        if (a === 'vbstap') { vbStap[el.dataset.k] = (vbStap[el.dataset.k] || 0) + 1; return render(); }
        if (a === 'vballes') { vbStap[el.dataset.k] = +el.dataset.n; return render(); }
        if (a === 'controleer') return controleer();
        if (a === 'volgende') { const d = deelVan(S.deel); nieuweVraag(d, S.oef[d.nr]); render(); const k = document.querySelector('.kaart'); if (k && k.getBoundingClientRect().top < 0) k.scrollIntoView(); return; }
        if (a === 'teststart') return testStart();
        if (a === 'indienen') return indienen();
        if (a === 'bekijk') return await bekijk(+el.dataset.id);
        if (a === 'terugtest') { S.test = null; render(); return window.scrollTo(0, 0); }
        if (a === 'pdf') return await downloadPDF(el);
      } catch (e) { if (e.code !== 'SESSIE_VERLOPEN') modaal('Dat lukte niet', `<p>${esc(e.message)}</p>`, [['OK', true]]); }
    });
  }

  // ---------- start
  (async () => {
    if (S.token) {
      try {
        const r = await API.call('ll_programmas', { p_token: S.token });
        S.leerling = r.leerling; S.progs = r.programmas || [];
        await naLogin();
      } catch (e) { API.sessie.del('ll-token'); S.token = null; S.view = 'login'; }
    }
    render();
  })();
})();
