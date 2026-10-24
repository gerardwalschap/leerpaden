// Leerkrachtenpagina: programma's, leerlingen beheren en koppelen, testen heropenen, rapporten downloaden.
(() => {
  const app = document.getElementById('app');
  const esc = W.esc, T = (s) => W.tex(s);

  const S = {
    token: API.sessie.get('lk-token'), view: 'login',
    dbProgs: [], prog: API.sessie.get('lk-prog'), P: null,
    data: null, detail: null, alle: null, nieuw: null, fout: '', melding: '',
    klas: API.sessie.get('lk-klas') || '', zoek: '', selectie: new Set(),
  };
  const KLAAR = () => S.P.delen.filter(d => d.klaar);
  const DELEN = () => S.P.delen;

  // ---------- hulp
  const datum = (iso, metUur = true) => iso ? new Date(iso).toLocaleString('nl-BE', metUur ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
  const pct = (j, n) => n ? Math.round(100 * j / n) + '%' : '—';
  const vandaag = () => new Date().toLocaleDateString('sv-SE');
  const bestandsnaam = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const gebruikersnaamVoor = (vn, n) => (n ? vn + '.' + n : vn).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  const progTitel = (code) => { const P = Leerpaden.vind(code); const d = S.dbProgs.find(x => x.code === code); return P ? P.titel : d ? d.titel : code; };

  function info(st, nr) {
    const geslaagd = st.geslaagd.includes(nr);
    const viaTest = nr === 1 || st.geslaagd.includes(nr - 1);
    const vrij = st.vrijgegeven.includes(nr);
    const open = viaTest || vrij;
    const testen = st.testen.filter(t => t.deel === nr);
    const bezig = testen.find(t => t.status === 'bezig');
    const ingediend = testen.filter(t => t.status === 'ingediend');
    const over = (st.toegestaan[nr] || 1) - testen.length;
    const oef = st.oefeningen[nr] || { aantal: 0, juist: 0 };
    const beste = ingediend.reduce((b, t) => (!b || t.score > b.score ? t : b), null);
    const wacht = open && !geslaagd && !bezig && over <= 0;
    return { geslaagd, open, viaTest, vrij, testen, bezig, ingediend, over, oef, beste, wacht, laatste: ingediend[ingediend.length - 1] };
  }
  function huidig(st) {
    for (const d of KLAAR()) { const i = info(st, d.nr); if (!i.geslaagd) return i.open ? d : null; }
    return 'klaar';
  }
  function totaalOef(st) { return Object.values(st.oefeningen).reduce((a, o) => ({ aantal: a.aantal + o.aantal, juist: a.juist + o.juist }), { aantal: 0, juist: 0 }); }
  function statusLabel(i, d) {
    if (!d.klaar) return '<span class="etiket grijs">Nog niet online</span>';
    if (i.geslaagd) return `<span class="etiket groen">✓ Geslaagd (${i.beste.score}/${i.beste.max})</span>`;
    if (!i.open) return '<span class="etiket grijs">Vergrendeld</span>';
    if (i.bezig) return '<span class="etiket oranje">Test bezig</span>';
    if (i.wacht) return '<span class="etiket rood">Test niet geslaagd – wacht op heropenen</span>';
    return `<span class="etiket oranje">Open${i.vrij && !i.viaTest ? ' (door jou vrijgegeven)' : ''}</span>`;
  }
  const soortNaam = (deelnr, soort) => { const d = DELEN().find(x => x.nr === deelnr); return d && d.soorten && d.soorten[soort] ? d.soorten[soort].naam : soort; };

  async function roep(fn, params) {
    try { return await API.call(fn, { p_token: S.token, ...params }); }
    catch (e) { if (e.code === 'SESSIE_VERLOPEN') { API.sessie.del('lk-token'); S.token = null; S.view = 'login'; S.fout = 'Je sessie is verlopen. Meld je opnieuw aan.'; render(); } throw e; }
  }
  function modaal(titel, html, knoppen) {
    return new Promise(res => {
      const m = document.createElement('div'); m.className = 'modaal-achter';
      m.innerHTML = `<div class="modaal"><h2>${titel}</h2>${html}<div class="knoppen" style="justify-content:flex-end"></div></div>`;
      const k = m.querySelector('.knoppen');
      knoppen.forEach(([t, w, c]) => { const b = document.createElement('button'); b.textContent = t; if (c) b.className = c; b.onclick = () => { const v = typeof w === 'function' ? w(m) : w; m.remove(); res(v); }; k.appendChild(b); });
      document.body.appendChild(m); W.renderIn(m);
      const eerste = m.querySelector('input'); (eerste || k.lastChild).focus();
    });
  }
  function download(naam, inhoud, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([inhoud], { type }));
    a.download = naam; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csv(rijen) {
    const cel = (x) => { const s = String(x ?? ''); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    return '﻿' + rijen.map(r => r.map(cel).join(';')).join('\r\n');
  }
  function leerlingLink(code) { const u = new URL('index.html', location.href).href.replace(/index\.html$/, ''); return code && Leerpaden.lijst.length > 1 ? `${u}?p=${code}` : u; }

  // ---------- weergave
  function kop() {
    const progs = Leerpaden.lijst;
    return `${API.DEMO ? '<div class="demo-band">DEMO — gegevens blijven enkel in deze browser · leerkracht-wachtwoord: demo · <a href="index.html">naar de leerlingenpagina</a></div>' : ''}
      <header class="balk"><div class="streep"></div>
        <div class="logo">${esc(CONFIG.TITEL || 'Leerpaden')}<small>Leerkracht${S.P && S.view !== 'alle' ? ' · ' + esc(S.P.titel) : ''}</small></div>
        ${S.token ? `<div class="rechts"><button class="licht" data-a="afmelden">Afmelden</button></div>` : ''}
      </header>
      ${S.token && S.view !== 'login' ? `<nav class="progtabs">${progs.map(p => `<button class="ptab ${S.view !== 'alle' && S.prog === p.code ? 'actief' : ''}" data-a="prog" data-code="${esc(p.code)}">${esc(p.titel)}</button>`).join('')}
        <button class="ptab ${S.view === 'alle' ? 'actief' : ''}" data-a="alle">👥 Alle leerlingen</button></nav>` : ''}`;
  }
  function render() {
    let h = '';
    if (S.view === 'login') h = vLogin();
    if (S.view === 'overzicht') h = vOverzicht();
    if (S.view === 'leerling') h = vLeerling();
    if (S.view === 'toevoegen') h = vToevoegen();
    if (S.view === 'alle') h = vAlle();
    app.innerHTML = kop() + `<main class="breed">${S.melding ? `<div class="melding ok">${S.melding}</div>` : ''}${h}</main>`;
    S.melding = '';
    W.renderIn(app);
    koppel();
  }

  function vLogin() {
    return `<div class="login kaart"><h1>Leerkracht</h1>
      ${S.fout ? `<div class="melding fout">${esc(S.fout)}</div>` : ''}
      <form id="loginform"><label for="pw">Wachtwoord</label><input type="password" id="pw" autocomplete="current-password" required>
      <div style="margin-top:16px"><button type="submit" style="width:100%">Aanmelden</button></div></form></div>`;
  }

  const klassenVan = (lijst) => [...new Set(lijst.map(l => l.klas).filter(Boolean))].sort();
  function filter(lijst) {
    const z = S.zoek.trim().toLowerCase();
    return lijst.filter(l => (!S.klas || l.klas === S.klas) && (!z || `${l.voornaam} ${l.naam} ${l.gebruikersnaam}`.toLowerCase().includes(z)));
  }
  function filterbalk(lijst) {
    const kl = klassenVan(lijst);
    return `<div class="filters">
      <select id="klasfilter" aria-label="Klas"><option value="">Alle klassen</option>${kl.map(k => `<option ${S.klas === k ? 'selected' : ''}>${esc(k)}</option>`).join('')}</select>
      <input type="text" id="zoek" placeholder="Zoek op naam…" value="${esc(S.zoek)}" aria-label="Zoek">
    </div>`;
  }

  function vOverzicht() {
    const alle = S.data.leerlingen, ll = filter(alle);
    const wachten = ll.filter(l => l.actief && KLAAR().some(d => info(l.status, d.nr).wacht));
    const db = S.dbProgs.find(p => p.code === S.prog);
    return `<div class="werkbalk"><h1 class="vul" style="margin:0">${esc(S.P.titel)} <span class="klein">(${alle.length} leerlingen)</span></h1>
        <button data-a="toevoegen">+ Nieuwe leerlingen</button>
        <button class="licht" data-a="alle">Bestaande leerlingen koppelen</button>
        <button class="licht" data-a="vernieuw">Vernieuwen</button></div>
      <p class="klein">Link voor de leerlingen: <b>${esc(leerlingLink(S.prog))}</b> · slaagdrempel <b>${db ? db.drempel : 80}%</b> <button class="link" data-a="drempel">wijzigen</button></p>
      ${alle.length ? filterbalk(alle) : ''}
      ${wachten.length ? `<div class="melding let"><b>Wachten op heropenen:</b> ${wachten.map(l => {
        const d = KLAAR().find(d => info(l.status, d.nr).wacht);
        return `<button class="link" data-a="leerling" data-id="${l.id}">${esc(l.voornaam)} ${esc(l.naam)}</button> (deel ${d.nr})`;
      }).join(', ')}</div>` : ''}
      ${alle.length === 0 ? '<div class="kaart"><p>Nog geen leerlingen in dit leerpad. Klik op <b>+ Nieuwe leerlingen</b> om accounts te maken, of op <b>Bestaande leerlingen koppelen</b> als ze al een account hebben.</p></div>' : `
      <div class="werkbalk"><span class="klein vul">${ll.length} getoond</span>
        <button class="licht" data-a="csv">Overzicht (Excel)</button>
        <button class="licht" data-a="klasrapport">Rapporten van deze ${ll.length} (PDF)</button></div>
      <div class="kaart tabelwrap"><table class="lijst">
        <tr><th>Leerling</th><th>Voortgang</th><th>Nu bezig met</th><th>Oefeningen</th><th>Laatst actief</th><th></th></tr>
        ${ll.map(l => {
          const st = l.status, h = huidig(st), tot = totaalOef(st);
          return `<tr class="klik" data-a="leerling" data-id="${l.id}">
            <td><b>${esc(l.naam)} ${esc(l.voornaam)}</b><div class="klein">${esc(l.klas)} · ${esc(l.gebruikersnaam)}${l.actief ? '' : ' · <span class="etiket grijs">gedeactiveerd</span>'}</div></td>
            <td><div class="voortgang">${DELEN().map(d => { const i = info(st, d.nr); return `<span class="${i.geslaagd ? 'g' : i.wacht ? 'w' : (i.open && d.klaar) ? 'b' : ''}" title="Deel ${d.nr}: ${esc(d.titel)}">${d.nr}</span>`; }).join('')}</div></td>
            <td>${h === 'klaar' ? '<span class="etiket groen">Alles geslaagd</span>' : h ? `Deel ${h.nr}${info(st, h.nr).wacht ? ' <span class="etiket rood">wacht</span>' : info(st, h.nr).bezig ? ' <span class="etiket oranje">test bezig</span>' : ''}` : '—'}</td>
            <td>${tot.aantal} <span class="klein">(${pct(tot.juist, tot.aantal)} juist)</span></td>
            <td class="klein">${datum(l.laatst_actief)}</td>
            <td><button class="licht" data-a="rapport" data-id="${l.id}">Rapport</button></td></tr>`;
        }).join('')}
      </table></div>
      <p class="klein legende"><span class="voortgang"><span class="g"></span></span> geslaagd
        <span class="voortgang"><span class="b"></span></span> open
        <span class="voortgang"><span class="w"></span></span> test niet geslaagd, wacht op heropenen
        <span class="voortgang"><span></span></span> vergrendeld</p>`}`;
  }

  function sindsLaatsteTest(det, nr) {
    const i = info(det.status, nr);
    if (!i.laatste) return null;
    const na = det.recent.filter(o => o.deel === nr && new Date(o.tijd) > new Date(i.laatste.ingediend));
    return { aantal: na.length, juist: na.filter(o => o.juist).length };
  }

  function vLeerling() {
    const det = S.detail, l = det.leerling, st = det.status, tot = totaalOef(st), h = huidig(st);
    const delen = DELEN().filter(d => d.klaar || info(st, d.nr).oef.aantal || info(st, d.nr).testen.length);
    return `<p class="klein"><button class="link" data-a="overzicht">← Alle leerlingen van ${esc(S.P.titel)}</button></p>
      <div class="werkbalk"><h1 class="vul" style="margin:0">${esc(l.voornaam)} ${esc(l.naam)}</h1>
        <button data-a="rapport" data-id="${l.id}">Rapport downloaden (PDF)</button></div>
      <p class="klein">${esc(l.klas)} · gebruikersnaam <b>${esc(l.gebruikersnaam)}</b> · account sinds ${datum(l.aangemaakt, false)}${l.actief ? '' : ' · <b>gedeactiveerd</b>'}</p>
      <div class="cijfers">
        <div class="cijfer"><div class="w">${st.geslaagd.length}/${DELEN().length}</div><div class="l">delen geslaagd</div></div>
        <div class="cijfer"><div class="w">${h === 'klaar' ? '✓ klaar' : h ? 'Deel ' + h.nr : '—'}</div><div class="l">nu bezig met</div></div>
        <div class="cijfer"><div class="w">${tot.aantal}</div><div class="l">oefeningen (${pct(tot.juist, tot.aantal)} juist)</div></div>
        <div class="cijfer"><div class="w" style="font-size:15px">${datum(l.laatst_actief)}</div><div class="l">laatst actief</div></div>
      </div>
      <h2>Per deel</h2>
      ${delen.map(d => {
        const i = info(st, d.nr), sinds = sindsLaatsteTest(det, d.nr);
        const soorten = det.per_soort.filter(s => s.deel === d.nr);
        return `<div class="deelblok"><div class="kop"><b>Deel ${d.nr}: ${esc(d.titel)}</b>${statusLabel(i, d)}</div>
          <p class="klein">Oefeningen: <b>${i.oef.aantal}</b> (${pct(i.oef.juist, i.oef.aantal)} juist)
            ${sinds ? ` · sinds de laatste test: <b>${sinds.aantal}</b> (${pct(sinds.juist, sinds.aantal)} juist)` : ''}
            ${soorten.length ? ' · ' + soorten.map(s => `${esc(soortNaam(d.nr, s.soort))}: ${s.juist}/${s.aantal}`).join(' · ') : ''}</p>
          ${i.testen.length ? `<table class="lijst"><tr><th>Poging</th><th>Gestart</th><th>Score</th><th>Resultaat</th><th></th></tr>
            ${i.testen.map((t, k) => {
              const vol = det.testen.find(x => x.id === t.id);
              return `<tr><td>${k + 1}</td><td class="klein">${datum(t.gestart)}</td><td>${t.status === 'bezig' ? '—' : `${t.score}/${t.max}`}</td>
                <td>${t.status === 'bezig' ? '<span class="etiket oranje">bezig</span>' : t.geslaagd ? '<span class="etiket groen">geslaagd</span>' : '<span class="etiket rood">niet geslaagd</span>'}</td>
                <td>${t.status === 'ingediend' ? `<button class="link" data-a="toontest" data-id="${t.id}">antwoorden</button>` : `<button class="link" data-a="annuleer" data-id="${t.id}" data-deel="${d.nr}">laten vallen</button>`}</td></tr>
                <tr class="verborgen" id="test-${t.id}"><td colspan="5">${vol ? testDetail(vol, d) : ''}</td></tr>`;
            }).join('')}</table>` : '<p class="klein">Nog geen test gemaakt.</p>'}
          <div class="knoppen" style="justify-content:flex-start">
            ${d.klaar && i.open && !i.geslaagd && !i.bezig && i.over <= 0 ? `<button class="oranje" data-a="heropen" data-deel="${d.nr}">Test opnieuw openzetten</button>` : ''}
            ${d.klaar && d.nr > 1 && !i.viaTest ? (i.vrij ? `<button class="licht" data-a="vrij" data-deel="${d.nr}" data-aan="0">Vrijgave intrekken</button>` : `<button class="licht" data-a="vrij" data-deel="${d.nr}" data-aan="1">Deel vrijgeven zonder test</button>`) : ''}
          </div></div>`;
      }).join('')}
      ${det.per_dag.length ? `<h2>Activiteit per dag</h2><div class="kaart tabelwrap"><table class="lijst"><tr><th>Dag</th><th>Deel</th><th>Oefeningen</th><th>Juist</th></tr>
        ${det.per_dag.slice().reverse().map(r => `<tr><td>${datum(r.dag, false)}</td><td>${r.deel}</td><td>${r.aantal}</td><td>${pct(r.juist, r.aantal)}</td></tr>`).join('')}</table></div>` : ''}
      <h2>Account</h2>
      <p class="klein">Gekoppeld aan: ${(l.programmas || []).map(c => `<span class="etiket oranje">${esc(progTitel(c))}</span>`).join(' ') || '—'}
        · beheer dit bij <button class="link" data-a="alle">Alle leerlingen</button></p>
      <div class="knoppen" style="justify-content:flex-start">
        <button class="licht" data-a="bewerk">Naam of klas wijzigen</button>
        <button class="licht" data-a="reset">Nieuw wachtwoord</button>
        <button class="licht" data-a="ontkoppel">Uit dit leerpad halen</button>
        <button class="licht" data-a="actief" data-aan="${l.actief ? 0 : 1}">${l.actief ? 'Deactiveren' : 'Opnieuw activeren'}</button>
        <button class="rood" data-a="verwijder">Verwijderen</button>
      </div>`;
  }

  function testDetail(t, d) {
    if (!t.antwoorden) return '';
    return `<div style="padding:6px 0">${t.vragen.map((v, k) => {
      const a = t.antwoorden[k] || {};
      return `<div class="klein testregel">${a.juist ? '✓' : '✗'} <span class="opg-klein">${v.html || T('\\displaystyle ' + v.tex)}</span> &nbsp;→ juist: ${Antwoord.juistHTML(v.antw)} &nbsp;· leerling: ${a.g ? Antwoord.gegevenHTML(a.g) : `<b>${esc(a.gegeven)}</b>`}${a.bericht ? ` <i>(${esc(a.bericht)})</i>` : ''}</div>`;
    }).join('')}</div>`;
  }

  function vToevoegen() {
    if (S.nieuw) {
      return `<h1>Nieuwe accounts</h1>
        <div class="melding let">Bewaar of druk deze lijst nu af: wachtwoorden zijn later <b>niet meer te zien</b> (je kan ze wel opnieuw instellen).</div>
        <div class="werkbalk"><button data-a="kaartjes">Inlogkaartjes (PDF)</button><button class="licht" data-a="nieuwcsv">Lijst (Excel)</button>
          <span class="vul"></span><button class="licht" data-a="${S.nieuw.terug || 'overzicht'}">Klaar</button></div>
        <div class="kaart tabelwrap"><table class="lijst logins"><tr><th>Naam</th><th>Klas</th><th>Gebruikersnaam</th><th>Wachtwoord</th></tr>
          ${S.nieuw.lijst.map(n => `<tr><td>${esc(n.voornaam)} ${esc(n.naam)}</td><td>${esc(n.klas)}</td><td>${esc(n.gebruikersnaam)}</td><td>${esc(n.wachtwoord)}</td></tr>`).join('')}</table></div>`;
    }
    return `<p class="klein"><button class="link" data-a="overzicht">← Terug</button></p>
      <h1>Nieuwe leerlingen</h1>
      <div class="kaart">
        <label for="klas">Klas</label><input type="text" id="klas" value="${esc(S.klas || S.P.klas || '')}" style="max-width:200px">
        <label for="namen">Eén leerling per lijn: <b>Voornaam Naam</b> (of <b>Naam, Voornaam</b>, of geplakt uit Excel: voornaam en naam in twee kolommen)</label>
        <textarea id="namen" rows="10" placeholder="Jan Peeters&#10;Fatima El Amrani&#10;Vermeulen, Lotte"></textarea>
        <div id="voorbeeld" class="klein" style="margin-top:8px"></div>
        <label class="vink"><input type="checkbox" id="koppelnu" checked> Meteen koppelen aan <b>${esc(S.P.titel)}</b></label>
        <p class="klein">Heeft een leerling al een account (bv. van een ander leerpad)? Maak dan geen nieuw account, maar koppel het bestaande via <button class="link" data-a="alle">Alle leerlingen</button>.</p>
        <div class="knoppen" style="justify-content:flex-start"><button data-a="maak">Accounts aanmaken</button></div>
      </div>`;
  }

  function vAlle() {
    const alle = S.alle, ll = filter(alle), progs = Leerpaden.lijst;
    const sel = [...S.selectie].filter(id => alle.some(l => l.id === id));
    return `<div class="werkbalk"><h1 class="vul" style="margin:0">Alle leerlingen <span class="klein">(${alle.length} accounts)</span></h1>
        <button data-a="toevoegen">+ Nieuwe leerlingen</button></div>
      <p class="klein">Eén account per leerling, voor alle leerpaden. Vink een leerpad aan om de leerling eraan te koppelen. Ontkoppelen wist geen resultaten: koppel je later opnieuw, dan staat alles er nog.</p>
      ${alle.length ? filterbalk(alle) : '<div class="kaart"><p>Nog geen accounts.</p></div>'}
      ${alle.length ? `<div class="werkbalk bulk">
        <span class="klein">${sel.length} geselecteerd</span>
        <select id="bulkprog">${progs.map(p => `<option value="${esc(p.code)}" ${p.code === S.prog ? 'selected' : ''}>${esc(p.titel)}</option>`).join('')}</select>
        <button class="licht" data-a="bulk" data-aan="1" ${sel.length ? '' : 'disabled'}>Koppelen</button>
        <button class="licht" data-a="bulk" data-aan="0" ${sel.length ? '' : 'disabled'}>Ontkoppelen</button>
        <button class="licht" data-a="bulkreset" ${sel.length ? '' : 'disabled'}>Nieuwe wachtwoorden + kaartjes</button>
        <button class="licht" data-a="allecsv">Lijst (Excel)</button>
      </div>
      <div class="kaart tabelwrap"><table class="lijst">
        <tr><th><input type="checkbox" id="allesel" aria-label="alles selecteren" ${ll.length && ll.every(l => S.selectie.has(l.id)) ? 'checked' : ''}></th><th>Leerling</th><th>Klas</th><th>Gebruikersnaam</th>${progs.map(p => `<th class="midden">${esc(p.titel)}</th>`).join('')}<th>Laatst actief</th></tr>
        ${ll.map(l => `<tr>
          <td><input type="checkbox" class="sel" data-id="${l.id}" ${S.selectie.has(l.id) ? 'checked' : ''} aria-label="selecteer"></td>
          <td><b>${esc(l.naam)} ${esc(l.voornaam)}</b>${l.actief ? '' : ' <span class="etiket grijs">gedeactiveerd</span>'}</td>
          <td>${esc(l.klas)}</td><td class="klein">${esc(l.gebruikersnaam)}</td>
          ${progs.map(p => `<td class="midden"><input type="checkbox" class="insch" data-id="${l.id}" data-code="${esc(p.code)}" ${l.programmas.includes(p.code) ? 'checked' : ''} aria-label="${esc(p.titel)}"></td>`).join('')}
          <td class="klein">${datum(l.laatst_actief)}</td></tr>`).join('')}
      </table></div>` : ''}`;
  }

  function leesNamen() {
    const klas = document.getElementById('klas').value.trim();
    return document.getElementById('namen').value.split(/\r?\n/).map(r => r.trim()).filter(Boolean).map(r => {
      let vn, n;
      if (r.includes('\t')) { [vn, n] = r.split('\t').map(x => x.trim()); }
      else if (r.includes(',')) { [n, vn] = r.split(',').map(x => x.trim()); }
      else { const p = r.split(/\s+/); vn = p.shift(); n = p.join(' '); }
      return { voornaam: vn || '', naam: n || '', klas, gebruikersnaam: gebruikersnaamVoor(vn || '', n || '') };
    }).filter(x => x.voornaam);
  }

  // ---------- rapport (PDF)
  const RAPPORTSTIJL = `<style>
        .rapport { font-family: Verdana, sans-serif; color: #1f2733; background: #fff; font-size: 11px; line-height: 1.5; width: 680px; padding: 4px; }
        .rapport .wis { font-family: 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif; font-size: 13px; }
        .rapport h1 { color: #1c4e8a; font-size: 18px; margin: 0 0 2px; }
        .rapport h2 { color: #1c4e8a; font-size: 13px; margin: 16px 0 6px; border-bottom: 2px solid #e8772e; padding-bottom: 2px; }
        .rapport table { border-collapse: collapse; width: 100%; }
        .rapport th { background: #e8f0fa; text-align: left; }
        .rapport th, .rapport td { border: 1px solid #ccd3dd; padding: 3px 6px; vertical-align: top; }
        .rapport .kopband { display: flex; justify-content: space-between; border-bottom: 3px solid #1c4e8a; padding-bottom: 6px; margin-bottom: 8px; }
        .rapport .g { color: #2e7d4f; font-weight: bold; } .rapport .r { color: #b83a2e; font-weight: bold; }
        .rapport tr, .rapport .blok { page-break-inside: avoid; }
        .rapport .nieuwe-pagina { page-break-before: always; }
        .rapport .klein { font-size: 10px; color: #555; } .rapport p { margin: 4px 0; }
      </style>`;
  // Samenvatting van het traject (bewijs van opvolging/remediëring)
  function samenvatting(det) {
    const st = det.status, tot = totaalOef(st);
    const dag = (iso) => new Date(iso).toLocaleDateString('sv-SE');
    const dagen = new Set(det.per_dag.map(r => String(r.dag).slice(0, 10)));
    det.testen.forEach(t => { dagen.add(dag(t.gestart)); if (t.ingediend) dagen.add(dag(t.ingediend)); });
    const lijst = [...dagen].sort();
    const ingediend = det.testen.filter(t => t.status === 'ingediend');
    const geslaagd = DELEN().map(d => { const t = ingediend.filter(x => x.deel === d.nr && x.geslaagd)[0]; return t ? { d, t } : null; }).filter(Boolean);
    if (!lijst.length) return `<h2>Samenvatting</h2><p>Nog geen activiteit.</p>`;
    const dt = (s) => new Date(s + 'T12:00:00').toLocaleDateString('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `<h2>Samenvatting</h2>
      <p>${esc(det.leerling.voornaam)} ${esc(det.leerling.naam)} werkte <b>van ${dt(lijst[0])} tot ${dt(lijst[lijst.length - 1])}</b> op <b>${lijst.length} ${lijst.length === 1 ? 'dag' : 'verschillende dagen'}</b> aan dit ${esc(S.P.soort || 'leerpad')}:
        <b>${tot.aantal}</b> oefeningen (${pct(tot.juist, tot.aantal)} juist), <b>${ingediend.length}</b> ${ingediend.length === 1 ? 'test' : 'testen'} ingediend,
        <b>${st.geslaagd.length} van de ${DELEN().length}</b> delen geslaagd.</p>
      ${geslaagd.length ? `<p class="klein">Geslaagd: ${geslaagd.map(({ d, t }) => `deel ${d.nr} op ${datum(t.ingediend, false)} (${t.score}/${t.max_score})`).join(' · ')}</p>` : ''}
      <p class="klein">Dagen met activiteit: ${lijst.map(dt).join(', ')}</p>`;
  }
  function rapportBlok(det, volledig = true) {
    const l = det.leerling, st = det.status, tot = totaalOef(st), h = huidig(st);
    const rij = (cellen, th) => `<tr>${cellen.map(c => `<${th ? 'th' : 'td'}>${c}</${th ? 'th' : 'td'}>`).join('')}</tr>`;
    const delen = DELEN().filter(d => d.klaar || info(st, d.nr).oef.aantal || info(st, d.nr).testen.length);
    const kaal = (s) => s.replace(/<[^>]+>/g, '');
    const opg = (v) => esc(v.rapport || W.platteTekst(v.tex || v.html || ''));
    return `<div class="kopband"><div><h1>Rapport ${esc(S.P.soort || 'leerpad')}: ${esc(S.P.titel)}</h1>
        <div><b>${esc(l.voornaam)} ${esc(l.naam)}</b> · ${esc(l.klas)} · gebruikersnaam ${esc(l.gebruikersnaam)}</div></div>
        <div style="text-align:right">${esc(CONFIG.SCHOOL || 'De Resonant')}<br>${datum(new Date().toISOString())}</div></div>
      <table>${rij(['Delen geslaagd', 'Nu bezig met', 'Oefeningen', 'Laatst actief'], true)}
        ${rij([`${st.geslaagd.length} / ${DELEN().length}`, h === 'klaar' ? 'alle delen geslaagd' : h ? `deel ${h.nr}` : '—', `${tot.aantal} (${pct(tot.juist, tot.aantal)} juist)`, datum(l.laatst_actief)])}</table>
      ${samenvatting(det)}
      <h2>Voortgang per deel</h2>
      <table>${rij(['Deel', 'Status', 'Oefeningen', 'Testpogingen'], true)}
        ${delen.map(d => { const i = info(st, d.nr); return rij([`${d.nr}. ${esc(d.titel)}`, kaal(statusLabel(i, d)), `${i.oef.aantal} (${pct(i.oef.juist, i.oef.aantal)} juist)`,
          i.testen.map(t => t.status === 'bezig' ? `${datum(t.gestart)}: bezig` : `${datum(t.ingediend)}: <span class="${t.geslaagd ? 'g' : 'r'}">${t.score}/${t.max}</span>`).join('<br>') || '—']); }).join('')}</table>
      ${volledig && det.per_soort.length ? `<h2>Oefeningen per soort</h2><table>${rij(['Deel', 'Soort', 'Aantal', 'Juist'], true)}
        ${det.per_soort.map(s => rij([s.deel, esc(soortNaam(s.deel, s.soort)), s.aantal, `${s.juist} (${pct(s.juist, s.aantal)})`])).join('')}</table>` : ''}
      ${volledig && det.per_dag.length ? `<h2>Activiteit per dag</h2><table>${rij(['Dag', 'Deel', 'Oefeningen', 'Juist'], true)}
        ${det.per_dag.map(r => rij([datum(r.dag, false), r.deel, r.aantal, pct(r.juist, r.aantal)])).join('')}</table>` : ''}
      ${volledig ? det.testen.filter(t => t.status === 'ingediend').map(t => `<div class="blok"><h2>Test deel ${t.deel} · ${datum(t.ingediend)} · <span class="${t.geslaagd ? 'g' : 'r'}">${t.score}/${t.max_score}</span></h2>
        <table>${rij(['', 'Opgave', 'Juiste antwoord', 'Antwoord leerling'], true)}
        ${t.vragen.map((v, k) => { const a = (t.antwoorden || [])[k] || {}; return rij([a.juist ? '<span class="g">✓</span>' : '<span class="r">✗</span>', `<span class="wis">${opg(v)}</span>`, `<span class="wis">${esc(Antwoord.juistTekst(v.antw))}</span>`, `<span class="wis">${esc(a.gegeven ?? '—')}</span>` + (a.bericht ? `<br><i>${esc(a.bericht)}</i>` : '')]); }).join('')}</table></div>`).join('') : ''}`;
  }
  const rapportHTML = (det) => `<div class="rapport">${RAPPORTSTIJL}${rapportBlok(det)}</div>`;

  async function maakPDF(html, naam, opties = {}) {
    const houder = document.createElement('div');
    houder.style.cssText = 'position:fixed;left:-10000px;top:0;background:#fff';
    houder.innerHTML = html; document.body.appendChild(houder);
    try {
      if (!window.html2pdf) throw new Error('PDF-bibliotheek niet geladen. Controleer je internetverbinding.');
      await html2pdf().set({
        margin: [12, 12, 12, 12], filename: naam,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.nieuwe-pagina', avoid: ['tr', '.blok', '.kaartje'] }, ...opties,
      }).from(houder.firstElementChild).save();
    } finally { houder.remove(); }
  }

  async function rapport(id) {
    try {
      const det = (S.detail && S.detail.leerling.id === id) ? S.detail : await roep('lk_leerling', { p_id: id, p_programma: S.prog });
      await maakPDF(rapportHTML(det), `Rapport_${bestandsnaam(S.P.titel)}_${bestandsnaam(det.leerling.naam + '_' + det.leerling.voornaam)}_${vandaag()}.pdf`);
    } catch (e) { modaal('Rapport mislukt', `<p>${esc(e.message)}</p>`, [['OK', 1]]); }
  }
  async function klasrapport(knop) {
    const ll = filter(S.data.leerlingen);
    if (!ll.length) return;
    const volledig = await modaal('Rapporten downloaden', `<p>Eén PDF met ${ll.length} leerlingen, elk op een nieuwe pagina.</p>
      <label class="vink"><input type="checkbox" id="metdetails"> Met alle testantwoorden en activiteit per dag (dikker document)</label>`,
      [['Annuleren', null, 'licht'], ['Downloaden', (m) => m.querySelector('#metdetails').checked]]);
    if (volledig === null) return;
    knop.disabled = true;
    try {
      const dets = [];
      for (let i = 0; i < ll.length; i++) { knop.textContent = `Bezig… ${i + 1}/${ll.length}`; dets.push(await roep('lk_leerling', { p_id: ll[i].id, p_programma: S.prog })); }
      knop.textContent = 'PDF maken…';
      const html = `<div class="rapport">${RAPPORTSTIJL}${dets.map((d, i) => `<div class="${i ? 'nieuwe-pagina' : ''}">${rapportBlok(d, volledig)}</div>`).join('')}</div>`;
      await maakPDF(html, `Rapporten_${bestandsnaam(S.P.titel)}_${bestandsnaam(S.klas || 'alle')}_${vandaag()}.pdf`);
    } catch (e) { modaal('Rapport mislukt', `<p>${esc(e.message)}</p>`, [['OK', 1]]); }
    knop.disabled = false; knop.textContent = `Rapporten van deze ${ll.length} (PDF)`;
  }

  function kaartjesHTML(lijst, code) {
    const P = code ? Leerpaden.vind(code) : null;
    const link = leerlingLink(code);
    return `<div style="font-family:Verdana,sans-serif;color:#1f2733;background:#fff;width:680px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${lijst.map(n => `<div class="kaartje" style="border:1px dashed #888;border-radius:6px;padding:10px 12px;font-size:12px;line-height:1.6">
        <div style="color:#1c4e8a;font-weight:bold;border-bottom:2px solid #e8772e;margin-bottom:4px">${esc(P ? P.titel + (P.ondertitel ? ' · ' + P.ondertitel : '') : (CONFIG.TITEL || 'Leerpaden'))}</div>
        <div><b>${esc(n.voornaam)} ${esc(n.naam)}</b> (${esc(n.klas)})</div>
        <div>Website: ${esc(link)}</div>
        <div>Gebruikersnaam: <b style="font-family:'Courier New',monospace;font-size:14px">${esc(n.gebruikersnaam)}</b></div>
        <div>Wachtwoord: <b style="font-family:'Courier New',monospace;font-size:14px">${esc(n.wachtwoord)}</b></div></div>`).join('')}</div>`;
  }

  // ---------- laden
  async function laadProgrammas() {
    S.dbProgs = await roep('lk_programmas', { p_lijst: Leerpaden.lijst.map(p => ({ code: p.code, titel: p.titel })) });
    if (!Leerpaden.vind(S.prog)) S.prog = Leerpaden.lijst[0] && Leerpaden.lijst[0].code;
    S.P = Leerpaden.vind(S.prog);
  }
  async function laadOverzicht() { S.data = await roep('lk_overzicht', { p_programma: S.prog }); }
  async function laadDetail(id) { S.detail = await roep('lk_leerling', { p_id: id, p_programma: S.prog }); }
  async function laadAlle() { S.alle = await roep('lk_alle_leerlingen', {}); }
  async function naarOverzicht() { await laadOverzicht(); S.view = 'overzicht'; S.nieuw = null; S.detail = null; }

  function koppel() {
    const f = document.getElementById('loginform');
    if (f) {
      document.getElementById('pw').focus();
      f.onsubmit = async (e) => {
        e.preventDefault();
        try {
          const r = await API.call('lk_login', { p_wachtwoord: document.getElementById('pw').value });
          S.token = r.token; API.sessie.set('lk-token', r.token); S.fout = '';
          await laadProgrammas(); await naarOverzicht();
        } catch (err) { S.fout = err.message; }
        render();
      };
    }
    const namen = document.getElementById('namen');
    if (namen) namen.oninput = () => {
      const l = leesNamen();
      document.getElementById('voorbeeld').innerHTML = l.length ? `${l.length} leerling(en): ` + l.map(x => `<b>${esc(x.voornaam)}</b> ${esc(x.naam)} → ${esc(x.gebruikersnaam)}`).join(' · ') : '';
    };
    const kf = document.getElementById('klasfilter');
    if (kf) kf.onchange = () => { S.klas = kf.value; API.sessie.set('lk-klas', S.klas); render(); };
    const zk = document.getElementById('zoek');
    if (zk) zk.oninput = () => { S.zoek = zk.value; const pos = zk.selectionStart; render(); const z = document.getElementById('zoek'); z.focus(); z.setSelectionRange(pos, pos); };

    // Alle leerlingen: selectie en inschrijvingen
    app.querySelectorAll('input.sel').forEach(c => c.onchange = () => { c.checked ? S.selectie.add(c.dataset.id) : S.selectie.delete(c.dataset.id); render(); });
    const as = document.getElementById('allesel');
    if (as) as.onchange = () => { filter(S.alle).forEach(l => as.checked ? S.selectie.add(l.id) : S.selectie.delete(l.id)); render(); };
    app.querySelectorAll('input.insch').forEach(c => c.onchange = async () => {
      c.disabled = true;
      try {
        await roep('lk_inschrijven', { p_ids: [c.dataset.id], p_programma: c.dataset.code, p_aan: c.checked });
        const l = S.alle.find(x => x.id === c.dataset.id);
        if (l) l.programmas = c.checked ? [...new Set([...l.programmas, c.dataset.code])] : l.programmas.filter(x => x !== c.dataset.code);
      } catch (e) { c.checked = !c.checked; if (e.code !== 'SESSIE_VERLOPEN') modaal('Dat lukte niet', `<p>${esc(e.message)}</p>`, [['OK', 1]]); }
      c.disabled = false;
    });

    app.querySelectorAll('[data-a]').forEach(el => el.onclick = async (ev) => {
      ev.stopPropagation();
      const a = el.dataset.a;
      try {
        if (a === 'afmelden') { API.call('lk_logout', { p_token: S.token }).catch(() => {}); API.sessie.del('lk-token'); S.token = null; S.view = 'login'; return render(); }
        if (a === 'prog') { S.prog = el.dataset.code; S.P = Leerpaden.vind(S.prog); API.sessie.set('lk-prog', S.prog); await naarOverzicht(); return render(); }
        if (a === 'overzicht') { await naarOverzicht(); return render(); }
        if (a === 'alle') { await laadAlle(); S.view = 'alle'; S.nieuw = null; return render(); }
        if (a === 'vernieuw') { await laadOverzicht(); return render(); }
        if (a === 'leerling') { await laadDetail(el.dataset.id); S.view = 'leerling'; render(); return window.scrollTo(0, 0); }
        if (a === 'toevoegen') { S.terugNa = S.view === 'alle' ? 'alle' : 'overzicht'; S.view = 'toevoegen'; S.nieuw = null; return render(); }
        if (a === 'rapport') { const t = el.textContent; el.disabled = true; el.textContent = 'Bezig…'; await rapport(el.dataset.id); el.disabled = false; el.textContent = t; return; }
        if (a === 'klasrapport') return klasrapport(el);
        if (a === 'toontest') { document.getElementById('test-' + el.dataset.id).classList.toggle('verborgen'); return; }
        if (a === 'drempel') {
          const db = S.dbProgs.find(p => p.code === S.prog);
          const w = await modaal('Slaagdrempel', `<p>Hoeveel procent moet een leerling halen om naar het volgende deel te gaan? Dit geldt voor alle tests van <b>${esc(S.P.titel)}</b> die vanaf nu ingediend worden.</p>
            <input type="text" id="dr" value="${db ? db.drempel : 80}" inputmode="numeric" style="max-width:100px"> %`, [['Annuleren', null, 'licht'], ['Opslaan', (m) => m.querySelector('#dr').value]]);
          if (w === null) return;
          await roep('lk_drempel', { p_programma: S.prog, p_drempel: parseInt(w, 10) || 0 });
          await laadProgrammas(); S.melding = 'Slaagdrempel aangepast.'; return render();
        }
        if (a === 'csv') {
          const kop = ['Klas', 'Naam', 'Voornaam', 'Gebruikersnaam', 'Actief', 'Delen geslaagd', 'Nu bezig met', 'Oefeningen', '% juist', ...KLAAR().map(d => `Test deel ${d.nr}`), 'Laatst actief'];
          const rijen = filter(S.data.leerlingen).map(l => {
            const st = l.status, h = huidig(st), tot = totaalOef(st);
            return [l.klas, l.naam, l.voornaam, l.gebruikersnaam, l.actief ? 'ja' : 'nee', st.geslaagd.length, h === 'klaar' ? 'alles geslaagd' : h ? 'deel ' + h.nr : '', tot.aantal, tot.aantal ? Math.round(100 * tot.juist / tot.aantal) : '',
              ...KLAAR().map(d => info(st, d.nr).ingediend.map(t => `${t.score}/${t.max}`).join(' | ')), datum(l.laatst_actief)];
          });
          return download(`Overzicht_${bestandsnaam(S.P.titel)}_${S.klas ? bestandsnaam(S.klas) + '_' : ''}${vandaag()}.csv`, csv([kop, ...rijen]), 'text/csv;charset=utf-8');
        }
        if (a === 'allecsv') {
          const progs = Leerpaden.lijst;
          return download(`Accounts_${vandaag()}.csv`, csv([['Klas', 'Naam', 'Voornaam', 'Gebruikersnaam', 'Actief', ...progs.map(p => p.titel), 'Laatst actief'],
            ...filter(S.alle).map(l => [l.klas, l.naam, l.voornaam, l.gebruikersnaam, l.actief ? 'ja' : 'nee', ...progs.map(p => l.programmas.includes(p.code) ? 'ja' : ''), datum(l.laatst_actief)])]), 'text/csv;charset=utf-8');
        }
        if (a === 'maak') {
          const lijst = leesNamen();
          if (!lijst.length) return modaal('Geen namen', '<p>Typ minstens één naam.</p>', [['OK', 1]]);
          const koppelNu = document.getElementById('koppelnu').checked;
          const r = await roep('lk_leerlingen_toevoegen', { p_lijst: lijst, p_programma: koppelNu ? S.prog : null });
          S.nieuw = { lijst: r, code: koppelNu ? S.prog : null, terug: S.terugNa === 'alle' ? 'alle' : 'overzicht' };
          return render();
        }
        if (a === 'kaartjes') { el.disabled = true; try { await maakPDF(kaartjesHTML(S.nieuw.lijst, S.nieuw.code), `Inlogkaartjes_${vandaag()}.pdf`); } finally { el.disabled = false; } return; }
        if (a === 'nieuwcsv') return download(`Logins_${vandaag()}.csv`, csv([['Klas', 'Naam', 'Voornaam', 'Gebruikersnaam', 'Wachtwoord'], ...S.nieuw.lijst.map(n => [n.klas, n.naam, n.voornaam, n.gebruikersnaam, n.wachtwoord])]), 'text/csv;charset=utf-8');
        if (a === 'bulk') {
          const ids = [...S.selectie].filter(id => S.alle.some(l => l.id === id)), code = document.getElementById('bulkprog').value, aan = el.dataset.aan === '1';
          await roep('lk_inschrijven', { p_ids: ids, p_programma: code, p_aan: aan });
          await laadAlle(); S.melding = `${ids.length} leerling(en) ${aan ? 'gekoppeld aan' : 'ontkoppeld van'} ${esc(progTitel(code))}.`; return render();
        }
        if (a === 'bulkreset') {
          const ll = S.alle.filter(l => S.selectie.has(l.id));
          if (!await modaal('Nieuwe wachtwoorden?', `<p>${ll.length} leerling(en) krijgen een nieuw wachtwoord. Hun oude wachtwoord werkt daarna niet meer. Je krijgt meteen nieuwe inlogkaartjes.</p>`, [['Annuleren', 0, 'licht'], ['Nieuwe wachtwoorden', 1, 'oranje']])) return;
          const uit = [];
          for (const l of ll) { const r = await roep('lk_wachtwoord_reset', { p_id: l.id }); uit.push({ ...l, wachtwoord: r.wachtwoord }); }
          const code = document.getElementById('bulkprog') ? document.getElementById('bulkprog').value : S.prog;
          S.nieuw = { lijst: uit, code, terug: 'alle' }; S.view = 'toevoegen'; return render();
        }

        const l = S.detail && S.detail.leerling;
        if (a === 'heropen') {
          const nr = +el.dataset.deel, sinds = sindsLaatsteTest(S.detail, nr);
          const ok = await modaal('Test opnieuw openzetten?', `<p>${esc(l.voornaam)} krijgt <b>één nieuwe poging</b> voor de test van deel ${nr}, met nieuwe vragen.</p>
            ${sinds ? `<p class="klein">Sinds de vorige test: ${sinds.aantal} oefeningen, ${pct(sinds.juist, sinds.aantal)} juist.</p>` : ''}`, [['Annuleren', 0, 'licht'], ['Openzetten', 1, 'oranje']]);
          if (!ok) return;
          await roep('lk_test_heropenen', { p_id: l.id, p_programma: S.prog, p_deel: nr }); await laadDetail(l.id);
          S.melding = `De test van deel ${nr} staat opnieuw open voor ${esc(l.voornaam)}.`; return render();
        }
        if (a === 'annuleer') {
          const ok = await modaal('Lopende test laten vallen?', `<p>De test van deel ${el.dataset.deel} die ${esc(l.voornaam)} gestart heeft, wordt gewist en telt <b>niet</b> als poging. De leerling kan daarna een nieuwe test starten (met nieuwe vragen).</p>`, [['Annuleren', 0, 'licht'], ['Laten vallen', 1, 'oranje']]);
          if (!ok) return;
          await roep('lk_test_annuleren', { p_test: +el.dataset.id }); await laadDetail(l.id); S.melding = 'De lopende test is gewist.'; return render();
        }
        if (a === 'vrij') {
          await roep('lk_deel_vrijgeven', { p_id: l.id, p_programma: S.prog, p_deel: +el.dataset.deel, p_aan: el.dataset.aan === '1' }); await laadDetail(l.id); return render();
        }
        if (a === 'bewerk') {
          const r = await modaal('Naam of klas wijzigen', `<label>Voornaam</label><input type="text" id="bvn" value="${esc(l.voornaam)}">
            <label>Naam</label><input type="text" id="bn" value="${esc(l.naam)}"><label>Klas</label><input type="text" id="bk" value="${esc(l.klas)}">
            <p class="klein">De gebruikersnaam blijft dezelfde.</p>`,
            [['Annuleren', null, 'licht'], ['Opslaan', (m) => ({ vn: m.querySelector('#bvn').value, n: m.querySelector('#bn').value, k: m.querySelector('#bk').value })]]);
          if (!r) return;
          await roep('lk_leerling_bewerken', { p_id: l.id, p_voornaam: r.vn, p_naam: r.n, p_klas: r.k }); await laadDetail(l.id); return render();
        }
        if (a === 'reset') {
          if (!await modaal('Nieuw wachtwoord?', `<p>Het oude wachtwoord van ${esc(l.voornaam)} werkt daarna niet meer.</p>`, [['Annuleren', 0, 'licht'], ['Nieuw wachtwoord', 1]])) return;
          const r = await roep('lk_wachtwoord_reset', { p_id: l.id });
          return modaal('Nieuw wachtwoord', `<p>${esc(l.voornaam)} ${esc(l.naam)}<br>Gebruikersnaam: <b>${esc(l.gebruikersnaam)}</b><br>Wachtwoord: <b style="font-family:monospace;font-size:18px">${esc(r.wachtwoord)}</b></p>`, [['OK', 1]]);
        }
        if (a === 'ontkoppel') {
          if (!await modaal('Uit dit leerpad halen?', `<p>${esc(l.voornaam)} ziet <b>${esc(S.P.titel)}</b> niet meer. Resultaten blijven bewaard: koppel je later opnieuw, dan staat alles er nog. Het account zelf blijft bestaan.</p>`, [['Annuleren', 0, 'licht'], ['Uit leerpad halen', 1, 'oranje']])) return;
          await roep('lk_inschrijven', { p_ids: [l.id], p_programma: S.prog, p_aan: false });
          await naarOverzicht(); S.melding = `${esc(l.voornaam)} ${esc(l.naam)} is uit dit leerpad gehaald.`; return render();
        }
        if (a === 'actief') {
          await roep('lk_leerling_wijzigen', { p_id: l.id, p_actief: el.dataset.aan === '1', p_verwijderen: false }); await laadDetail(l.id); return render();
        }
        if (a === 'verwijder') {
          if (!await modaal('Leerling verwijderen?', `<p>Het account van <b>${esc(l.voornaam)} ${esc(l.naam)}</b> en <b>alle</b> gegevens (in alle leerpaden) worden definitief gewist. Download eerst het rapport als je het wil bewaren.</p>`, [['Annuleren', 0, 'licht'], ['Definitief verwijderen', 1, 'rood']])) return;
          await roep('lk_leerling_wijzigen', { p_id: l.id, p_actief: false, p_verwijderen: true });
          await naarOverzicht(); S.melding = 'Leerling verwijderd.'; return render();
        }
      } catch (e) { if (e.code !== 'SESSIE_VERLOPEN') modaal('Dat lukte niet', `<p>${esc(e.message)}</p>`, [['OK', 1]]); }
    });
  }

  (async () => {
    if (S.token) { try { await laadProgrammas(); await naarOverzicht(); } catch (e) { S.token = null; S.view = 'login'; } }
    render();
  })();
})();
