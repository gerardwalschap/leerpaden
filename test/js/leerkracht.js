// Leerkrachtenpagina: programma's, leerlingen beheren en koppelen, testen opvolgen, rapporten downloaden.
(() => {
  const app = document.getElementById('app');
  const esc = W.esc, T = (s) => W.tex(s);

  const S = {
    token: API.sessie.get('lk-token'), view: 'login',
    dbProgs: [], prog: API.sessie.get('lk-prog'), P: null,
    data: null, detail: null, alle: null, nieuw: null, fout: '', melding: '',
    klas: API.sessie.get('lk-klas') || '', zoek: '', selectie: new Set(), lpFilter: '',
    boomKlas: API.sessie.get('lk-boomklas') || null, boomVak: API.sessie.get('lk-boomvak') || null,
    boomMenu: API.sessie.get('lk-boommenu') || null, // tegel uit js/menu.js (bv. 'getallenleer')
  };
  const MENUS = () => window.MENUS || {};
  const KLAAR = () => S.P.delen.filter(d => d.klaar);
  const DELEN = () => S.P.delen;

  // ---------- hulp
  const datum = (iso, metUur = true) => iso ? new Date(iso).toLocaleString('nl-BE', metUur ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
  const pct = (j, n) => n ? Math.round(100 * j / n) + '%' : '—';
  const vandaag = () => new Date().toLocaleDateString('sv-SE');
  const bestandsnaam = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const gebruikersnaamVoor = (vn, n) => (n ? vn + '.' + n : vn).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  const SPELLEN = () => typeof Spellen !== 'undefined' ? Spellen.lijst : [];
  const spelVind = (code) => typeof Spellen !== 'undefined' ? Spellen.vind(code) : null;
  const progTitel = (code) => { const P = Leerpaden.vind(code) || spelVind(code); const d = S.dbProgs.find(x => x.code === code); return P ? (P.icoon ? P.icoon + ' ' : '') + P.titel : d ? d.titel : code; };

  function info(st, nr) {
    const geslaagd = st.geslaagd.includes(nr);
    const viaTest = nr === 1 || st.geslaagd.includes(nr - 1);
    const vrij = st.vrijgegeven.includes(nr);
    const open = viaTest || vrij;
    const testen = st.testen.filter(t => t.deel === nr);
    const bezig = testen.find(t => t.status === 'bezig');
    const ingediend = testen.filter(t => t.status === 'ingediend');
    // Niet geslaagd? De test gaat automatisch opnieuw open; er wordt nooit meer gewacht op de leerkracht.
    const over = geslaagd ? 0 : Infinity;
    const oef = st.oefeningen[nr] || { aantal: 0, juist: 0 };
    const beste = ingediend.reduce((b, t) => (!b || t.score > b.score ? t : b), null);
    const wacht = false;
    return { geslaagd, open, viaTest, vrij, testen, bezig, ingediend, over, oef, beste, wacht, laatste: ingediend[ingediend.length - 1] };
  }
  function huidig(st) {
    for (const d of KLAAR()) { const i = info(st, d.nr); if (!i.geslaagd) return i.open ? d : null; }
    return 'klaar';
  }
  function totaalOef(st) { return Object.values(st.oefeningen).reduce((a, o) => ({ aantal: a.aantal + o.aantal, juist: a.juist + o.juist }), { aantal: 0, juist: 0 }); }
  function statusLabel(i, d) {
    if (!d.klaar) return '<span class="etiket grijs">Nog niet online</span>';
    if (S.P && S.P.instaptoets) {
      if (i.bezig) return '<span class="etiket oranje">Instaptoets bezig</span>';
      if (!i.laatste) return '<span class="etiket grijs">Nog niet gemaakt</span>';
      const u = Instap.uitslag(S.P, i.laatste.score, i.laatste.max);
      return `<span class="etiket ${u.kleur}">${esc(u.naam)} (${Instap.punten(i.laatste.score, i.laatste.max)}/100)</span>`;
    }
    if (i.geslaagd) return `<span class="etiket groen">✓ Geslaagd (${i.beste.score}/${i.beste.max})</span>`;
    if (!i.open) return '<span class="etiket grijs">Vergrendeld</span>';
    if (i.bezig) return '<span class="etiket oranje">Test bezig</span>';
    if (i.ingediend.length) return `<span class="etiket oranje">Open – ${i.ingediend.length}× niet geslaagd, mag opnieuw</span>`;
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
      <header class="balk"><div class="schoollogo" role="img" aria-label="De Resonant"></div>
        <div class="logo">${esc(CONFIG.TITEL || 'Leerpaden')}<small>Leerkracht${S.P && !['alle', 'boom', 'afdruk', 'spellen', 'spel'].includes(S.view) ? ' · ' + esc(S.P.titel) : ''}</small></div>
        <div class="auteur" title="Gerard Walschap"><span class="auteur-foto" role="img" aria-label="Gerard Walschap"></span><span class="auteur-naam">Gerard Walschap</span></div>
        ${S.token ? `<div class="rechts"><button class="licht" data-a="afmelden">Afmelden</button></div>` : ''}
      </header>
      ${S.token && S.view !== 'login' ? `<nav class="progtabs">
        <button class="ptab ${S.view === 'boom' ? 'actief' : ''}" data-a="boom" data-niveau="${S.boomVak ? 'vak' : S.boomKlas ? 'klas' : 'klassen'}" data-klas="${esc(S.boomKlas || '')}" data-vak="${esc(S.boomVak || '')}">🏫 Klassen en leerpaden</button>
        ${S.P && !['boom', 'alle', 'afdruk', 'spellen', 'spel'].includes(S.view) ? `<button class="ptab actief" data-a="overzicht">${esc(S.P.titel)}</button>` : ''}
        ${S.view === 'spel' && spelVind(S.spel) ? `<button class="ptab actief" data-a="openspel" data-code="${esc(S.spel)}">${esc(progTitel(S.spel))}</button>` : ''}
        <button class="ptab ${S.view === 'alle' ? 'actief' : ''}" data-a="alle">👥 Alle leerlingen</button>
        ${SPELLEN().length ? `<button class="ptab ${S.view === 'spellen' ? 'actief' : ''}" data-a="spellen">🎮 Spellen</button>` : ''}
        <button class="ptab ${S.view === 'afdruk' ? 'actief' : ''}" data-a="afdruk">🖨️ Afdrukcentrum</button>
        ${window.Eindtermen ? Eindtermen.vakken().map(v => `<button class="ptab" data-eindtermen="${esc(v)}" title="Welke wiskundedoelen komen in welk leerpad aan bod?">🎯 Eindtermen ${esc((Catalogus.C.klassen.find(k => k.vakken.includes(v)) || {}).code || '')}</button>`).join('') : ''}</nav>` : ''}`;
  }
  function render() {
    let h = '';
    if (S.view === 'login') h = vLogin();
    if (S.view === 'overzicht') h = vOverzicht();
    if (S.view === 'leerling') h = vLeerling();
    if (S.view === 'toevoegen') h = vToevoegen();
    if (S.view === 'alle') h = vAlle();
    if (S.view === 'boom') h = vBoom();
    if (S.view === 'afdruk') h = vAfdruk();
    if (S.view === 'spellen') h = vSpellen();
    if (S.view === 'spel') h = vSpel();
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
    if (S.P.instaptoets) return vInstapOverzicht();
    const alle = S.data.leerlingen, ll = filter(alle);
    const db = S.dbProgs.find(p => p.code === S.prog);
    return `${kruimel()}<div class="werkbalk"><h1 class="vul" style="margin:0">${esc(S.P.titel)} <span class="klein">(${alle.length} leerlingen)</span></h1>
        <button data-a="toevoegen">+ Nieuwe leerlingen</button>
        <button class="licht" data-a="alle">Bestaande leerlingen koppelen</button>
        <button class="licht" data-a="vernieuw">Vernieuwen</button></div>
      <p class="klein">Link voor de leerlingen: <b>${esc(leerlingLink(S.prog))}</b> · slaagdrempel <b>${db ? db.drempel : 80}%</b> <button class="link" data-a="drempel">wijzigen</button></p>
      ${alle.length ? filterbalk(alle) : ''}
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
            <td>${h === 'klaar' ? '<span class="etiket groen">Alles geslaagd</span>' : h ? `Deel ${h.nr}${info(st, h.nr).bezig ? ' <span class="etiket oranje">test bezig</span>' : ''}${(n => n ? ` <span class="etiket rood" title="aantal niet-geslaagde pogingen voor dit deel">${n}× niet geslaagd</span>` : '')(info(st, h.nr).ingediend.filter(t => !t.geslaagd).length)}` : '—'}</td>
            <td>${tot.aantal} <span class="klein">(${pct(tot.juist, tot.aantal)} juist)</span></td>
            <td class="klein">${datum(l.laatst_actief)}</td>
            <td><button class="licht" data-a="rapport" data-id="${l.id}">Rapport</button></td></tr>`;
        }).join('')}
      </table></div>
      <p class="klein legende"><span class="voortgang"><span class="g"></span></span> geslaagd
        <span class="voortgang"><span class="b"></span></span> open
        <span class="voortgang"><span></span></span> vergrendeld</p>`}`;
  }

  // ---------- instaptoets: resultatenoverzicht (score op 100, niveau, per getallenverzameling)
  // Per leerling de laatste ingediende poging (normaal is er maar één).
  function instapRijen() {
    const P = S.P, alle = S.data.leerlingen;
    return filter(alle).map(l => {
      const pogingen = (S.instap || []).filter(t => t.leerling === l.id);
      const t = pogingen[pogingen.length - 1] || null;
      const bezig = l.status.testen.some(x => x.status === 'bezig');
      const tel = t ? Instap.telling(P, t.items) : null;
      return { l, t, n: pogingen.length, bezig, tel, u: t ? Instap.uitslag(P, t.score, t.max) : null, p: t ? Instap.pct(t.score, t.max) : null };
    });
  }
  function instapSorteer(rijen) {
    const r = rijen.slice();
    if (S.instapSort === 'score') r.sort((a, b) => (b.p ?? -1) - (a.p ?? -1) || (a.l.naam + a.l.voornaam).localeCompare(b.l.naam + b.l.voornaam));
    return r;
  }
  function instapCellen(x) {
    const P = S.P, D = P.instaptoets.domeinen, N = P.instaptoets.niveaus;
    if (!x.tel) return null;
    const { T, niv, n } = x.tel;
    return {
      dom: D.map(d => Instap.deelPunten(T[d.k].tot.j, n)),
      niv: N.map(k => Instap.deelPunten(niv[k.k].j, n)),
      domMax: D.map(d => Instap.deelPunten(T[d.k].tot.n, n)), nivMax: N.map(k => Instap.deelPunten(niv[k.k].n, n)),
    };
  }
  function vInstapOverzicht() {
    const P = S.P, alle = S.data.leerlingen, rijen = instapSorteer(instapRijen());
    const D = P.instaptoets.domeinen, N = P.instaptoets.niveaus, U = P.instaptoets.uitslag;
    const gemaakt = rijen.filter(x => x.t), nog = rijen.filter(x => !x.t && !x.bezig).length, bezig = rijen.filter(x => !x.t && x.bezig).length;
    const voorbeeld = gemaakt.map(instapCellen).find(Boolean);
    return `${kruimel()}<div class="werkbalk"><h1 class="vul" style="margin:0">${esc(P.titel)} <span class="klein">(${alle.length} leerlingen)</span></h1>
        <button data-a="toevoegen">+ Nieuwe leerlingen</button>
        <button class="licht" data-a="alle">Bestaande leerlingen koppelen</button>
        <button class="licht" data-a="vernieuw">Vernieuwen</button></div>
      <p class="klein">Link voor de leerlingen: <b>${esc(leerlingLink(S.prog))}</b> · ${U.map((u, k) => `<b>${esc(u.naam)}</b>: ${k ? `vanaf ${u.min}/100` : `minder dan ${U[1].min}/100`}`).join(' · ')}
        · één poging per leerling (nieuwe poging geven: klik op de leerling)</p>
      ${alle.length ? filterbalk(alle) : ''}
      ${alle.length === 0 ? '<div class="kaart"><p>Nog geen leerlingen gekoppeld aan de instaptoets. Klik op <b>+ Nieuwe leerlingen</b> om accounts te maken, of op <b>Bestaande leerlingen koppelen</b>.</p></div>' : `
      <div class="cijfers">
        <div class="cijfer"><div class="w">${gemaakt.length}/${rijen.length}</div><div class="l">gemaakt</div></div>
        ${U.map(u => `<div class="cijfer"><div class="w">${gemaakt.filter(x => x.u.naam === u.naam).length}</div><div class="l">${esc(u.naam.toLowerCase())}</div></div>`).join('')}
        <div class="cijfer"><div class="w">${bezig}</div><div class="l">nu bezig</div></div>
        <div class="cijfer"><div class="w">${nog}</div><div class="l">nog niet gestart</div></div>
        <div class="cijfer"><div class="w">${gemaakt.length ? Instap.komma(gemaakt.reduce((s, x) => s + x.p, 0) / gemaakt.length) : '—'}</div><div class="l">gemiddelde /100</div></div>
      </div>
      <div class="werkbalk"><span class="klein vul">${rijen.length} getoond ·
          sorteer op <select id="instapsort" aria-label="Sorteer"><option value="naam" ${S.instapSort !== 'score' ? 'selected' : ''}>klas en naam</option><option value="score" ${S.instapSort === 'score' ? 'selected' : ''}>score (hoog → laag)</option></select></span>
        <button class="licht" data-a="csv">Resultaten (Excel)</button>
        <button class="licht" data-a="instappdf">Resultaten (PDF)</button>
        <button class="licht" data-a="klasrapport">Verbeteringen van deze ${rijen.length} (PDF)</button></div>
      <div class="kaart tabelwrap"><table class="lijst instap-tabel">
        <tr><th>Leerling</th><th class="sc">Score</th><th class="sc">Niveau</th>
          ${D.map((d, k) => `<th class="sc" title="${esc(d.naam)}">${d.teken}${voorbeeld ? `<div class="klein">/${voorbeeld.domMax[k]}</div>` : ''}</th>`).join('')}
          ${N.map((x, k) => `<th class="sc">${esc(x.kort)}${voorbeeld ? `<div class="klein">/${voorbeeld.nivMax[k]}</div>` : ''}</th>`).join('')}
          <th>Ingediend</th><th></th></tr>
        ${rijen.map(x => {
          const c = instapCellen(x), l = x.l;
          return `<tr class="klik" data-a="leerling" data-id="${l.id}">
            <td><b>${esc(l.naam)} ${esc(l.voornaam)}</b><div class="klein">${esc(l.klas)} · ${esc(l.gebruikersnaam)}${l.actief ? '' : ' · <span class="etiket grijs">gedeactiveerd</span>'}</div></td>
            ${c ? `<td class="sc"><b>${Instap.komma(x.p)}</b>/100${x.n > 1 ? `<div class="klein">poging ${x.n}</div>` : ''}</td>
              <td class="sc"><span class="etiket ${x.u.kleur}">${esc(x.u.naam)}</span></td>
              ${c.dom.map(v => `<td class="sc">${v}</td>`).join('')}${c.niv.map(v => `<td class="sc">${v}</td>`).join('')}
              <td class="klein">${datum(x.t.ingediend)}</td>`
            : `<td class="sc">—</td><td class="sc">${x.bezig ? '<span class="etiket oranje">bezig</span>' : '<span class="etiket grijs">nog niet gemaakt</span>'}</td>
              ${D.map(() => '<td class="sc">—</td>').join('')}${N.map(() => '<td class="sc">—</td>').join('')}<td class="klein">—</td>`}
            <td><button class="licht" data-a="rapport" data-id="${l.id}">Verbetering</button></td></tr>`;
        }).join('')}
      </table></div>
      <p class="klein legende">Punten op 100: elke vraag telt even zwaar. Per getallenverzameling en per deel (basis/uitdagend) zie je hoeveel punten de leerling daar haalde.
        Na de instaptoets koppel je de leerlingen zelf aan het juiste leerpad (bij <button class="link" data-a="alle">Alle leerlingen</button>).</p>`}`;
  }
  function instapCSV() {
    const P = S.P, D = P.instaptoets.domeinen, N = P.instaptoets.niveaus;
    const rijen = instapSorteer(instapRijen());
    const kop = ['Klas', 'Naam', 'Voornaam', 'Gebruikersnaam', 'Score /100', 'Niveau', ...D.map(d => `${d.teken} ${d.naam}`), ...N.map(x => x.kort), 'Juist', 'Vragen', 'Poging', 'Ingediend'];
    const lijnen = rijen.map(x => { const c = instapCellen(x), l = x.l;
      return [l.klas, l.naam, l.voornaam, l.gebruikersnaam, c ? Instap.komma(x.p) : '', c ? x.u.naam : (x.bezig ? 'bezig' : 'nog niet gemaakt'),
        ...(c ? c.dom : D.map(() => '')), ...(c ? c.niv : N.map(() => '')), x.t ? x.t.score : '', x.t ? x.t.max : '', x.t ? x.n : '', x.t ? datum(x.t.ingediend) : '']; });
    return csv([kop, ...lijnen]);
  }
  function instapPDF() {
    const P = S.P, D = P.instaptoets.domeinen, N = P.instaptoets.niveaus, rijen = instapSorteer(instapRijen());
    const gemaakt = rijen.filter(x => x.t);
    return `<div class="rapport">${RAPPORTSTIJL}${AFDSTIJL}
      ${afdKop(`Resultaten ${esc(P.titel)}`, `${esc(S.klas || [...new Set(rijen.map(x => x.l.klas))].join(', '))} · ${gemaakt.length} van ${rijen.length} leerlingen gemaakt · ${P.instaptoets.uitslag.map(u => `${esc(u.naam)}: ${gemaakt.filter(x => x.u.naam === u.naam).length}`).join(' · ')}`)}
      <table><tr><th>Klas</th><th>Leerling</th><th class="sc">Score /100</th><th class="sc">Niveau</th>${D.map(d => `<th class="sc">${d.teken}</th>`).join('')}${N.map(x => `<th class="sc">${esc(x.kort)}</th>`).join('')}</tr>
      ${rijen.map(x => { const c = instapCellen(x);
        return `<tr><td>${esc(x.l.klas)}</td><td>${esc(x.l.naam)} ${esc(x.l.voornaam)}</td>${c ? `<td class="sc"><b>${Instap.komma(x.p)}</b></td><td class="sc">${esc(x.u.naam)}</td>${c.dom.map(v => `<td class="sc">${v}</td>`).join('')}${c.niv.map(v => `<td class="sc">${v}</td>`).join('')}`
          : `<td class="sc">—</td><td class="sc">${x.bezig ? 'bezig' : 'niet gemaakt'}</td>${D.map(() => '<td class="sc">—</td>').join('')}${N.map(() => '<td class="sc">—</td>').join('')}`}</tr>`; }).join('')}</table>
      ${gemaakt.length ? (() => { const c = instapCellen(gemaakt[0]); return `<p class="klein">Maximum per kolom: ${D.map((d, k) => `${d.teken} ${c.domMax[k]}`).join(' · ')} · ${N.map((x, k) => `${x.kort} ${c.nivMax[k]}`).join(' · ')}</p>`; })() : ''}</div>`;
  }
  // Rapport per leerling voor de instaptoets: score, niveau, tabel per getallenverzameling, (volledig) alle antwoorden.
  function instapRapportBlok(det, volledig) {
    const P = S.P, l = det.leerling;
    const ingediend = det.testen.filter(t => t.status === 'ingediend');
    const rij = (cellen, th) => `<tr>${cellen.map(c => `<${th ? 'th' : 'td'}>${c}</${th ? 'th' : 'td'}>`).join('')}</tr>`;
    const opg = (v) => esc(v.rapport || W.platteTekst(v.tex || v.html || ''));
    const kopband = `<div class="kopband"><div><h1>${esc(P.titel)}</h1>
        <div><b>${esc(l.voornaam)} ${esc(l.naam)}</b> · ${esc(l.klas)} · gebruikersnaam ${esc(l.gebruikersnaam)}</div></div>
        <div style="text-align:right"><img src="${LOGO}" alt="${esc(CONFIG.SCHOOL || 'De Resonant')}" style="height:28px"><br>${datum(new Date().toISOString())}</div></div>`;
    if (!ingediend.length) return kopband + '<p>De instaptoets is nog niet ingediend.</p>';
    return kopband + ingediend.map((t, k) => { const u = Instap.uitslag(P, t.score, t.max_score);
      return `<div class="blok"><h2>${ingediend.length > 1 ? `Poging ${k + 1} · ` : ''}Ingediend op ${datum(t.ingediend)} · <b>${Instap.punten(t.score, t.max_score)}/100</b> · niveau <b>${esc(u.naam)}</b></h2>
        ${Instap.tabel(P, t.vragen, t.antwoorden || []).replace('class="kaart tabelwrap"', '').replace(/<h2[^>]*>Per getallenverzameling<\/h2>/, '')}
        ${volledig ? `<table>${rij(['', 'Opgave', 'Juiste antwoord', 'Antwoord leerling'], true)}
        ${t.vragen.map((v, q) => { const a = (t.antwoorden || [])[q] || {}; return rij([a.juist ? '<span class="g">✓</span>' : '<span class="r">✗</span>', `<span class="wis">${q + 1}. ${opg(v)}</span>`, `<span class="wis">${esc(Antwoord.juistTekst(v.antw))}</span>`, `<span class="wis">${esc(a.gegeven ?? '—')}</span>` + (a.bericht ? `<br><i>${esc(a.bericht)}</i>` : '')]); }).join('')}</table>` : ''}</div>`; }).join('');
  }

  // ---------- Klassen en leerpaden (klas → vak → hoofdstuk)
  const CAT = () => Catalogus.C;
  function vakTitel(vak) {
    const V = CAT().vakken[vak], zelfde = Object.values(CAT().vakken).filter(x => x.naam === V.naam).length > 1;
    return zelfde ? `${esc(V.naam)} <span class="klein">(${esc(V.map)})</span>` : esc(V.naam);
  }
  // Broodkruimel boven het overzicht van een leerpad.
  function kruimel() {
    const pl = Catalogus.plaatsenVan(S.prog);
    const p = pl.find(x => x.vak === S.boomVak) || pl[0];
    if (!p) return `<p class="klein"><button class="link" data-a="boom" data-niveau="klassen">🏫 Klassen</button> › <i>dit leerpad staat nog niet in de catalogus</i></p>`;
    const kls = Catalogus.klassenMetVak(p.vak);
    const kl = kls.includes(S.boomKlas) ? S.boomKlas : kls[0];
    const M = MENUS()[p.vak];
    if (M) {
      const T = M.tegels.find(t => t.id === S.boomMenu && (t.direct === S.prog || (t.knoppen || []).some(k => k.leerpad === S.prog)))
        || M.tegels.find(t => t.direct === S.prog || (t.knoppen || []).some(k => k.leerpad === S.prog));
      if (T) return `<p class="klein"><button class="link" data-a="boom" data-niveau="klassen">🏫 Klassen</button> ›
        <button class="link" data-a="boom" data-niveau="klas" data-klas="${esc(kl)}">${esc(kl)}</button> ›
        <button class="link" data-a="boom" data-niveau="vak" data-klas="${esc(kl)}" data-vak="${esc(p.vak)}">${vakTitel(p.vak)}</button> ›
        ${T.direct ? esc(T.titel) : `<button class="link" data-a="boom" data-niveau="vak" data-klas="${esc(kl)}" data-vak="${esc(p.vak)}" data-menu="${esc(T.id)}">${T.nr}. ${esc(T.titel)}</button> › ${esc(S.P ? S.P.titel : '')}`}</p>`;
    }
    return `<p class="klein"><button class="link" data-a="boom" data-niveau="klassen">🏫 Klassen</button> ›
      <button class="link" data-a="boom" data-niveau="klas" data-klas="${esc(kl)}">${esc(kl)}</button> ›
      <button class="link" data-a="boom" data-niveau="vak" data-klas="${esc(kl)}" data-vak="${esc(p.vak)}">${vakTitel(p.vak)}</button> ›
      ${p.h.nr && !p.h.ster ? `Hoofdstuk ${p.h.nr}: ` : ''}${esc(p.h.titel)}</p>`;
  }
  // Leerlingen (actieve accounts) van een klas, en hoeveel daarvan aan een leerpad gekoppeld zijn.
  const leerlingenVanKlas = (k) => (S.alle || []).filter(l => l.actief && Catalogus.inKlas(l.klas, k));
  const gekoppeld = (code, lijst) => lijst.filter(l => l.programmas.includes(code)).length;
  const bestaat = (code) => !!Leerpaden.vind(code);

  function vBoom() {
    const C = CAT();
    const klas = C.klassen.find(k => k.code === S.boomKlas);
    const vak = klas && klas.vakken.includes(S.boomVak) ? S.boomVak : null;

    // Niveau 1: klassen
    if (!klas) {
      const zonderKlas = (S.alle || []).filter(l => l.actief && !Catalogus.klasVan(l.klas));
      return `<h1>Klassen</h1><p class="klein">Kies een klas, dan een vak. Leerlingen zien enkel de leerpaden waaraan je ze koppelt.</p>
        <div class="tegels">${C.klassen.map(k => {
          const lp = k.vakken.flatMap(v => C.vakken[v].hoofdstukken.flatMap(h => (h.leerpaden || []).filter(bestaat)));
          const n = leerlingenVanKlas(k.code).length;
          return `<button class="tegel" data-a="boom" data-niveau="klas" data-klas="${esc(k.code)}">
            <div class="tegel-titel">${esc(k.code)}</div>
            <div class="klein">${k.vakken.length} vak${k.vakken.length === 1 ? '' : 'ken'} · ${lp.length} leerpad${lp.length === 1 ? '' : 'en'}</div>
            <div class="klein">${n} leerling${n === 1 ? '' : 'en'} met een account</div></button>`;
        }).join('')}</div>
        ${zonderKlas.length ? `<div class="melding let klein">${zonderKlas.length} account(s) hebben een klasnaam die bij geen enkele klas hoort
          (${[...new Set(zonderKlas.map(l => l.klas || '— geen —'))].map(esc).join(', ')}). Pas de klas aan bij <button class="link" data-a="alle">Alle leerlingen</button> → leerling → <i>Naam of klas wijzigen</i>.</div>` : ''}`;
    }

    // Niveau 2: vakken van de klas
    if (!vak) {
      return `<p class="klein"><button class="link" data-a="boom" data-niveau="klassen">🏫 Klassen</button> › ${esc(klas.code)}</p>
        <h1>${esc(klas.code)}</h1><p>Kies een vak.</p>
        <div class="tegels">${klas.vakken.map(v => {
          const V = C.vakken[v], hs = V.hoofdstukken, met = hs.filter(h => (h.leerpaden || []).some(bestaat) || (h.extern || []).length || (h.spellen || []).some(spelVind)).length;
          return `<button class="tegel" data-a="boom" data-niveau="vak" data-klas="${esc(klas.code)}" data-vak="${esc(v)}">
            <div class="tegel-titel">${esc(V.naam)}</div><div class="klein">map ${esc(V.map)}</div>
            <div class="klein">${hs.length} hoofdstukken · ${met} met leerpad</div></button>`;
        }).join('')}</div>`;
    }

    // Niveau 3: vak met een menu (js/menu.js) → dezelfde tegels en knoppen als de leerlingen
    if (MENUS()[vak]) return vBoomMenu(klas, vak);

    // Niveau 3: hoofdstukken van het vak
    const V = C.vakken[vak], ll = leerlingenVanKlas(klas.code);
    const andere = Catalogus.klassenMetVak(vak).filter(k => k !== klas.code);
    return `<p class="klein"><button class="link" data-a="boom" data-niveau="klassen">🏫 Klassen</button> ›
        <button class="link" data-a="boom" data-niveau="klas" data-klas="${esc(klas.code)}">${esc(klas.code)}</button> › ${esc(V.naam)}</p>
      <h1>${esc(V.naam)} · ${esc(klas.code)}</h1>
      <p class="klein">Map <b>${esc(V.map)}</b>${andere.length ? ` · dit vak en zijn leerpaden gelden ook voor ${andere.map(esc).join(', ')}` : ''} · ${ll.length} leerling(en) van ${esc(klas.code)} met een account</p>
      <div class="pad">${V.hoofdstukken.map(h => {
        const regels = [
          ...(h.leerpaden || []).map(code => {
            const P = Leerpaden.vind(code);
            if (!P) return `<div class="lp-regel"><span class="etiket grijs">Bestand ontbreekt</span> <span class="klein">${esc(code)}</span></div>`;
            const g = gekoppeld(code, ll), tot = (S.alle || []).filter(l => l.programmas.includes(code)).length;
            return `<div class="lp-regel">
              <button class="link vet" data-a="openlp" data-code="${esc(code)}" data-klas="${esc(klas.code)}" data-vak="${esc(vak)}">${esc(P.titel)}</button>
              <span class="etiket ${g ? 'groen' : 'grijs'}">${g ? `${g}/${ll.length} van ${esc(klas.code)} gekoppeld` : `niemand van ${esc(klas.code)} gekoppeld`}</span>
              ${tot > g ? `<span class="klein">(${tot} in totaal)</span>` : ''}
              <span class="vul"></span>
              ${ll.length && g < ll.length ? `<button class="licht klein-knop" data-a="klaskoppel" data-code="${esc(code)}" data-klas="${esc(klas.code)}">Hele ${esc(klas.code)} koppelen</button>` : ''}
              <button class="licht klein-knop" data-a="openlp" data-code="${esc(code)}" data-klas="${esc(klas.code)}" data-vak="${esc(vak)}">Opvolgen →</button></div>`;
          }),
          ...(h.spellen || []).filter(spelVind).map(code => {
            const SP = spelVind(code), g = gekoppeld(code, ll), tot = (S.alle || []).filter(l => l.programmas.includes(code)).length;
            return `<div class="lp-regel">
              <button class="link vet" data-a="openspel" data-code="${esc(code)}">${SP.icoon} ${esc(SP.titel)}</button>
              <span class="etiket ${g ? 'groen' : 'grijs'}">${g ? `${g}/${ll.length} van ${esc(klas.code)} gekoppeld` : `niemand van ${esc(klas.code)} gekoppeld`}</span>
              ${tot > g ? `<span class="klein">(${tot} in totaal)</span>` : ''}
              <span class="vul"></span>
              ${ll.length && g < ll.length ? `<button class="licht klein-knop" data-a="klaskoppel" data-code="${esc(code)}" data-klas="${esc(klas.code)}">Hele ${esc(klas.code)} koppelen</button>` : ''}
              <button class="licht klein-knop" data-a="openspel" data-code="${esc(code)}">Speeltijd →</button></div>`;
          }),
          ...(h.extern || []).map(e => `<div class="lp-regel"><a href="${esc(e.url)}" target="_blank" rel="noopener" class="vet">${esc(e.titel)}</a>
              <span class="etiket oranje">oud platform</span> <span class="klein">${esc(e.opm || '')}</span></div>`),
        ];
        const leeg = !regels.length;
        return `<div class="stap hoofdstuk ${leeg ? 'dicht' : 'open'}"><div class="nr">${h.ster ? '★' : h.nr || '★'}</div>
          <div class="vul"><div class="titel">${esc(h.titel)}</div>${h.sub ? `<div class="sub">${esc(h.sub)}</div>` : ''}
            ${leeg ? '' : `<div class="lp-lijst">${regels.join('')}</div>`}</div>
          ${leeg ? '<span class="etiket grijs">Nog te maken</span>' : ''}</div>`;
      }).join('')}</div>
      <p class="klein legende">Hoofdstukken met <span class="etiket grijs">Nog te maken</span> ziet enkel jij. Een leerpad ziet een leerling pas als je hem eraan koppelt:
        in één keer met <i>Hele klas koppelen</i>, of per leerling bij <button class="link" data-a="alle">Alle leerlingen</button> (bv. enkel wie remediëring nodig heeft).</p>`;
  }

  // Regel met koppelen/opvolgen voor één leerpad of spel (klas k, vak v).
  function lpRegel(code, k, v, ll) {
    const P = Leerpaden.vind(code);
    if (!P) return `<div class="lp-regel"><span class="etiket grijs">Bestand ontbreekt</span> <span class="klein">${esc(code)}</span></div>`;
    const g = gekoppeld(code, ll), tot = (S.alle || []).filter(l => l.programmas.includes(code)).length;
    return `<div class="lp-regel">
      <button class="link vet" data-a="openlp" data-code="${esc(code)}" data-klas="${esc(k)}" data-vak="${esc(v)}">📘 ${esc(P.titel)}</button>
      <span class="etiket ${g ? 'groen' : 'grijs'}">${g ? `${g}/${ll.length} van ${esc(k)} gekoppeld` : `niemand van ${esc(k)} gekoppeld`}</span>
      ${tot > g ? `<span class="klein">(${tot} in totaal)</span>` : ''}
      <span class="vul"></span>
      ${ll.length && g < ll.length ? `<button class="licht klein-knop" data-a="klaskoppel" data-code="${esc(code)}" data-klas="${esc(k)}">Hele ${esc(k)} koppelen</button>` : ''}
      <button class="licht klein-knop" data-a="openlp" data-code="${esc(code)}" data-klas="${esc(k)}" data-vak="${esc(v)}">Opvolgen →</button></div>`;
  }
  function spelRegel(code, k, ll) {
    const SP = spelVind(code); if (!SP) return '';
    const g = gekoppeld(code, ll), tot = (S.alle || []).filter(l => l.programmas.includes(code)).length;
    return `<div class="lp-regel">
      <button class="link vet" data-a="openspel" data-code="${esc(code)}">${SP.icoon} ${esc(SP.titel)}</button>
      <span class="etiket ${g ? 'groen' : 'grijs'}">${g ? `${g}/${ll.length} van ${esc(k)} gekoppeld` : `niemand van ${esc(k)} gekoppeld`}</span>
      ${tot > g ? `<span class="klein">(${tot} in totaal)</span>` : ''}
      <span class="vul"></span>
      ${ll.length && g < ll.length ? `<button class="licht klein-knop" data-a="klaskoppel" data-code="${esc(code)}" data-klas="${esc(k)}">Hele ${esc(k)} koppelen</button>` : ''}
      <button class="licht klein-knop" data-a="openspel" data-code="${esc(code)}">Speeltijd →</button></div>`;
  }
  // Vak met menu: niveau A = tegels, niveau B = knoppen van één tegel (zoals de leerling het ziet).
  function vBoomMenu(klas, vak) {
    const C = CAT(), V = C.vakken[vak], M = MENUS()[vak], ll = leerlingenVanKlas(klas.code);
    const andere = Catalogus.klassenMetVak(vak).filter(k => k !== klas.code);
    const basis = `<button class="link" data-a="boom" data-niveau="klassen">🏫 Klassen</button> ›
        <button class="link" data-a="boom" data-niveau="klas" data-klas="${esc(klas.code)}">${esc(klas.code)}</button> ›`;
    const codesVan = (T) => T.direct ? [T.direct] : [...new Set(T.knoppen.flatMap(k => [k.leerpad, ...(k.spellen || [])]).filter(Boolean))];
    const T = M.tegels.find(t => t.id === S.boomMenu && !t.direct);
    if (!T) {
      return `<p class="klein">${basis} ${esc(V.naam)}</p>
        <h1>${esc(V.naam)} · ${esc(klas.code)}</h1>
        <p class="klein">Map <b>${esc(V.map)}</b>${andere.length ? ` · ook voor ${andere.map(esc).join(', ')}` : ''} · ${ll.length} leerling(en) van ${esc(klas.code)} met een account ·
          zelfde indeling als de leerlingen zien (js/menu.js)</p>
        <div class="menu-tegels">${M.tegels.map(t => {
          const codes = codesVan(t), nlp = codes.filter(c => Leerpaden.vind(c)).length, nsp = codes.filter(c => spelVind(c)).length;
          const metLL = new Set(ll.filter(l => codes.some(c => l.programmas.includes(c))).map(l => l.id)).size;
          const knop = t.direct ? `data-a="openlp" data-code="${esc(t.direct)}" data-klas="${esc(klas.code)}" data-vak="${esc(vak)}" data-menu="${esc(t.id)}"`
                                : `data-a="boom" data-niveau="vak" data-klas="${esc(klas.code)}" data-vak="${esc(vak)}" data-menu="${esc(t.id)}"`;
          return `<button class="menu-tegel" ${knop}>
            <div class="menu-nr">${t.nr}</div><div class="menu-icoon">${t.icoon || ''}</div>
            <div class="menu-titel">${esc(t.titel)}</div>
            <div class="klein">${[nlp ? `${nlp} leerpad${nlp === 1 ? '' : 'en'}` : '', nsp ? `${nsp} spel${nsp === 1 ? '' : 'len'}` : ''].filter(Boolean).join(' · ') || 'nog leeg'}</div>
            <div class="menu-etiket"><span class="etiket ${metLL ? 'groen' : 'grijs'}">${metLL ? `${metLL}/${ll.length} leerlingen gekoppeld` : 'nog niemand gekoppeld'}</span></div></button>`;
        }).join('')}</div>
        <p class="klein legende">Een leerling ziet enkel de tegels en knoppen waaraan je hem koppelt. Bij de instaptoets kom je meteen in het overzicht van de resultaten.</p>`;
    }
    const gezien = new Set();
    return `<p class="klein">${basis} <button class="link" data-a="boom" data-niveau="vak" data-klas="${esc(klas.code)}" data-vak="${esc(vak)}" data-menu="">${esc(V.naam)}</button> › ${T.nr}. ${esc(T.titel)}</p>
      <h1><span class="menu-h-nr">${T.nr}</span> ${esc(T.titel)} · ${esc(klas.code)}</h1>
      <p class="klein">${esc(T.sub || '')}</p>
      <div class="pad">${T.knoppen.map((k, i) => {
        const P = k.leerpad ? Leerpaden.vind(k.leerpad) : null;
        const titel = k.titel || (P ? P.titel : k.leerpad);
        const delen = P && k.delen ? k.delen : P && k.groep != null ? ((P.groepen || [])[k.groep] || { delen: [] }).delen : null;
        const regels = [];
        if (k.leerpad) {
          if (!gezien.has(k.leerpad)) { gezien.add(k.leerpad); regels.push(lpRegel(k.leerpad, klas.code, vak, ll)); }
          else regels.push(`<div class="klein">📘 deel ${delen && delen.length ? (delen.length > 1 ? `${delen[0]}–${delen[delen.length - 1]}` : delen[0]) : ''} van <b>${esc(P ? P.titel : k.leerpad)}</b> (koppelen en opvolgen: zie hierboven)</div>`);
        }
        (k.spellen || []).forEach(c => regels.push(spelRegel(c, klas.code, ll)));
        if (!(k.spellen || []).length) regels.push('<div class="klein grijs-tekst">🎮 nog geen spellen</div>');
        const nr = k.ster ? '★' : k.plus ? '+' : k.teken ? esc(k.teken) : String.fromCharCode(65 + (k.groep != null ? k.groep : i));
        return `<div class="stap hoofdstuk open${k.plus ? ' menu-knop plus' : ''}"><div class="nr">${nr}</div>
          <div class="vul"><div class="titel">${esc(titel)}${delen && delen.length ? ` <span class="klein">· deel ${delen.length > 1 ? `${delen[0]}–${delen[delen.length - 1]}` : delen[0]}</span>` : ''}</div>
            ${k.sub ? `<div class="sub">${esc(k.sub)}</div>` : ''}<div class="lp-lijst">${regels.join('')}</div></div></div>`;
      }).join('')}</div>
      <p class="klein legende">Een spel bij een onderwerp zetten of de indeling wijzigen: <code>js/menu.js</code>.</p>`;
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
      ${S.P.instaptoets ? (() => { const i = info(st, 1), u = i.laatste ? Instap.uitslag(S.P, i.laatste.score, i.laatste.max) : null;
        return `<div class="cijfers"><div class="cijfer"><div class="w">${i.laatste ? Instap.punten(i.laatste.score, i.laatste.max) + '/100' : '—'}</div><div class="l">score instaptoets</div></div>
          <div class="cijfer"><div class="w">${u ? esc(u.naam) : i.bezig ? 'bezig' : '—'}</div><div class="l">niveau</div></div>
          <div class="cijfer"><div class="w">${i.ingediend.length}</div><div class="l">poging(en)</div></div>
          <div class="cijfer"><div class="w" style="font-size:15px">${datum(l.laatst_actief)}</div><div class="l">laatst actief</div></div></div>`; })() : `<div class="cijfers">
        <div class="cijfer"><div class="w">${st.geslaagd.length}/${DELEN().length}</div><div class="l">delen geslaagd</div></div>
        <div class="cijfer"><div class="w">${h === 'klaar' ? '✓ klaar' : h ? 'Deel ' + h.nr : '—'}</div><div class="l">nu bezig met</div></div>
        <div class="cijfer"><div class="w">${tot.aantal}</div><div class="l">oefeningen (${pct(tot.juist, tot.aantal)} juist)</div></div>
        <div class="cijfer"><div class="w" style="font-size:15px">${datum(l.laatst_actief)}</div><div class="l">laatst actief</div></div>
      </div>`}
      <h2>${S.P.instaptoets ? 'Instaptoets' : 'Per deel'}</h2>
      ${delen.map(d => {
        const i = info(st, d.nr), sinds = sindsLaatsteTest(det, d.nr);
        const soorten = det.per_soort.filter(s => s.deel === d.nr);
        return `<div class="deelblok"><div class="kop"><b>Deel ${d.nr}: ${esc(d.titel)}</b>${statusLabel(i, d)}</div>
          ${S.P.instaptoets ? '' : `<p class="klein">Oefeningen: <b>${i.oef.aantal}</b> (${pct(i.oef.juist, i.oef.aantal)} juist)
            ${sinds ? ` · sinds de laatste test: <b>${sinds.aantal}</b> (${pct(sinds.juist, sinds.aantal)} juist)` : ''}
            ${soorten.length ? ' · ' + soorten.map(s => `${esc(soortNaam(d.nr, s.soort))}: ${s.juist}/${s.aantal}`).join(' · ') : ''}</p>`}
          ${i.testen.length ? `<table class="lijst"><tr><th>Poging</th><th>Gestart</th><th>Score</th><th>Resultaat</th><th></th></tr>
            ${i.testen.map((t, k) => {
              const vol = det.testen.find(x => x.id === t.id);
              return `<tr><td>${k + 1}</td><td class="klein">${datum(t.gestart)}</td><td>${t.status === 'bezig' ? '—' : S.P.instaptoets ? `${Instap.punten(t.score, t.max)}/100 <span class="klein">(${t.score}/${t.max} juist)</span>` : `${t.score}/${t.max}`}</td>
                <td>${t.status === 'bezig' ? '<span class="etiket oranje">bezig</span>' : S.P.instaptoets ? (u => `<span class="etiket ${u.kleur}">${esc(u.naam)}</span>`)(Instap.uitslag(S.P, t.score, t.max)) : t.geslaagd ? '<span class="etiket groen">geslaagd</span>' : '<span class="etiket rood">niet geslaagd</span>'}</td>
                <td>${t.status === 'ingediend' ? `<button class="link" data-a="toontest" data-id="${t.id}">antwoorden</button>` : `<button class="link" data-a="annuleer" data-id="${t.id}" data-deel="${d.nr}">laten vallen</button>`}</td></tr>
                <tr class="verborgen" id="test-${t.id}"><td colspan="5">${vol ? testDetail(vol, d) : ''}</td></tr>`;
            }).join('')}</table>` : '<p class="klein">Nog geen test gemaakt.</p>'}
          ${S.P.instaptoets && i.laatste ? Instap.tabel(S.P, (det.testen.find(x => x.id === i.laatste.id) || {}).vragen || [], (det.testen.find(x => x.id === i.laatste.id) || {}).antwoorden || []) : ''}
          <div class="knoppen" style="justify-content:flex-start">
            ${S.P.eenmalig && !i.bezig && i.ingediend.length >= ((st.toegestaan || {})[d.nr] || 1) ? `<button class="licht" data-a="heropen" data-deel="${d.nr}">Nieuwe poging geven</button>` : ''}
            ${S.P.eenmalig && !i.bezig && i.ingediend.length < ((st.toegestaan || {})[d.nr] || 1) && i.ingediend.length ? '<span class="etiket oranje">Nieuwe poging gegeven, nog niet gestart</span>' : ''}
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
      return `<div class="klein testregel">${a.juist ? '✓' : '✗'} <span class="opg-klein">${W.opgave(v)}</span> &nbsp;→ juist: ${Antwoord.juistHTML(v.antw)} &nbsp;· leerling: ${a.g ? Antwoord.gegevenHTML(a.g) : `<b>${esc(a.gegeven)}</b>`}${a.bericht ? ` <i>(${esc(a.bericht)})</i>` : ''}</div>`;
    }).join('')}</div>`;
  }

  function vToevoegen() {
    if (S.nieuw) {
      return `<h1>Nieuwe accounts</h1>
        <div class="melding let">Bewaar of druk deze lijst nu af: wachtwoorden zijn later <b>niet meer te zien</b> (je kan ze wel opnieuw instellen).</div>
        <div class="werkbalk"><button data-a="kaartjes">Inlogbrieven (PDF)</button><button class="licht" data-a="kaartjes" data-rv="1" title="Na elke brief een lege bladzijde: zo heeft elke leerling een eigen blad als je recto-verso afdrukt">Inlogbrieven voor recto-verso (PDF)</button><button class="licht" data-a="nieuwcsv">Lijst (Excel)</button>
          <span class="vul"></span><button class="licht" data-a="${S.nieuw.terug || 'overzicht'}">Klaar</button></div>
        <p class="klein">Elke leerling krijgt een eigen blad met zijn login én de handleiding. Druk je recto-verso af, kies dan <b>Inlogbrieven voor recto-verso</b>: de achterkant van elk blad blijft dan leeg.</p>
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

  // Leerpaden gegroepeerd per vak (volgens de catalogus), eventueel eerst de vakken van één klas.
  // ---------- spellen: speeltijd en voortgang
  const spelData = () => S.spelData || [];
  const spelRij = (id, code) => spelData().find(r => r.leerling === id && r.spel === code) || null;
  const tijd = (sec) => { sec = sec || 0; if (sec < 60) return sec ? '< 1 min' : '—'; const m = Math.round(sec / 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} u ${String(m % 60).padStart(2, '0')}`; };
  const balk = (pct) => `<span class="spelbalk" title="${pct}%"><i style="width:${Math.max(0, Math.min(100, pct || 0))}%"></i></span>`;
  // leerlingen die aan het spel gekoppeld zijn, of er (vroeger) gegevens in hebben
  const spelLeerlingen = (code) => (S.alle || []).filter(l => l.programmas.includes(code) || spelRij(l.id, code));
  async function laadSpellen() { await laadAlle(); S.spelData = await roep('lk_spellen', {}); }
  const SPELSTIJL = `<style>.spelbalk{display:inline-block;width:70px;height:8px;border-radius:4px;background:#e3e8ef;vertical-align:middle;overflow:hidden;margin-right:6px}
    .spelbalk i{display:block;height:100%;background:var(--groen)} table.spelmatrix td.cel{cursor:pointer;white-space:nowrap} table.spelmatrix td.cel:hover{background:#f1f5fa}
    table.spelmatrix th button.link{white-space:normal;text-align:left} a.knop.licht{background:transparent;color:var(--blauw);text-decoration:none}</style>`;

  function vSpellen() {
    const codes = SPELLEN().map(x => x.code);
    const alle = (S.alle || []).filter(l => codes.some(c => l.programmas.includes(c) || spelRij(l.id, c)));
    const ll = filter(alle);
    const kol = SPELLEN().filter(x => ll.some(l => l.programmas.includes(x.code) || spelRij(l.id, x.code)));
    const wk = (l) => kol.reduce((a, x) => a + ((spelRij(l.id, x.code) || {}).week || 0), 0);
    const tt = (l) => kol.reduce((a, x) => a + ((spelRij(l.id, x.code) || {}).totaal || 0), 0);
    return `${SPELSTIJL}<div class="werkbalk"><h1 class="vul" style="margin:0">🎮 Spellen <span class="klein">(${alle.length} leerlingen gekoppeld)</span></h1>
        <button class="licht" data-a="alle">Leerlingen koppelen</button>
        <button class="licht" data-a="spellen">Vernieuwen</button>
        ${ll.length ? '<button class="licht" data-a="spelcsv">Overzicht (Excel)</button>' : ''}</div>
      <p class="klein">Actieve speeltijd: enkel de tijd waarin het spel op het scherm staat én de leerling iets doet (na 2 minuten niets doen stopt de klok).
        Per cel: speeltijd <b>deze week</b> / <b>totaal</b> en hoever de leerling geraakt is. Klik op een cel voor de details per dag, of op een spel voor de volledige lijst.
        Koppelen doe je bij <button class="link" data-a="boom" data-niveau="klassen">Klassen en leerpaden</button> (7VJHO › Wiskunde › Spellen) of bij <button class="link" data-a="alle">Alle leerlingen</button>.</p>
      ${alle.length ? filterbalk(alle) : ''}
      ${!alle.length ? '<div class="kaart"><p>Nog niemand is aan een spel gekoppeld.</p></div>' : !ll.length ? '<div class="kaart"><p>Geen leerlingen voor deze filter.</p></div>' : `
      <div class="kaart tabelwrap"><table class="lijst spelmatrix">
        <tr><th>Leerling</th>${kol.map(x => `<th><button class="link vet" data-a="openspel" data-code="${esc(x.code)}">${x.icoon} ${esc(x.titel)}</button></th>`).join('')}<th>Samen<div class="klein">week / totaal</div></th></tr>
        ${ll.map(l => `<tr><td><b>${esc(l.naam)} ${esc(l.voornaam)}</b><div class="klein">${esc(l.klas)}</div></td>
          ${kol.map(x => {
            const r = spelRij(l.id, x.code), gk = l.programmas.includes(x.code);
            if (!gk && !r) return '<td class="klein">—</td>';
            const sv = r && r.samenvatting;
            return `<td class="cel" data-a="speldagen" data-id="${l.id}" data-code="${esc(x.code)}" title="${esc(sv ? sv.tekst : 'nog niet gespeeld')}">
              <b>${tijd(r && r.week)}</b> / ${tijd(r && r.totaal)}${gk ? '' : ' <span class="etiket grijs">ontkoppeld</span>'}<br>${balk(sv ? sv.pct : 0)}<span class="klein">${sv ? sv.pct + '%' : 'niet gespeeld'}</span></td>`;
          }).join('')}
          <td><b>${tijd(wk(l))}</b> / ${tijd(tt(l))}</td></tr>`).join('')}
      </table></div>
      <p class="klein legende">${balk(60)} = hoever de leerling geraakt is in het spel (zalen, zones of delen gehaald; bij de oefenarena's: aandeel onderdelen geoefend; bij de grafiekdetective: % juist).</p>`}`;
  }

  function vSpel() {
    const SP = spelVind(S.spel); if (!SP) return '<p>Onbekend spel.</p>';
    const alle = spelLeerlingen(S.spel), ll = filter(alle);
    const som = (k) => ll.reduce((a, l) => a + ((spelRij(l.id, S.spel) || {})[k] || 0), 0);
    return `${SPELSTIJL}<p class="klein"><button class="link" data-a="spellen">🎮 Spellen</button> › ${esc(SP.titel)}</p>
      <div class="werkbalk"><h1 class="vul" style="margin:0">${SP.icoon} ${esc(SP.titel)} <span class="klein">(${alle.length} leerlingen)</span></h1>
        <a class="knop licht" href="${esc(new URL((location.pathname.includes('/test/') ? '../' : '') + 'spellen/' + SP.map + '/?bekijk=1', location.href).href)}" target="_blank" rel="noopener">Spel bekijken ↗</a>
        <button class="licht" data-a="alle">Leerlingen koppelen</button>
        <button class="licht" data-a="openspel" data-code="${esc(S.spel)}">Vernieuwen</button>
        ${ll.length ? '<button class="licht" data-a="spelcsv" data-code="' + esc(S.spel) + '">Overzicht (Excel)</button>' : ''}</div>
      <p class="klein">${esc(SP.sub)}. Speeltijd = actieve tijd (spel op het scherm en de leerling doet iets). Deze week = vanaf maandag.</p>
      ${alle.length ? filterbalk(alle) : ''}
      ${!alle.length ? `<div class="kaart"><p>Nog niemand is aan dit spel gekoppeld. Koppel bij <button class="link" data-a="alle">Alle leerlingen</button> (+ leerpad → Spellen) of via Klassen en leerpaden → 7VJHO → Wiskunde → <i>Hele klas koppelen</i>.</p></div>` : `
      <div class="kaart tabelwrap"><table class="lijst">
        <tr><th>Leerling</th><th>Vandaag</th><th>Deze week</th><th>Totaal</th><th>Dagen</th><th>Hoever geraakt</th><th>Laatst gespeeld</th><th></th></tr>
        ${ll.map(l => {
          const r = spelRij(l.id, S.spel) || {}, sv = r.samenvatting, gk = l.programmas.includes(S.spel);
          return `<tr class="klik" data-a="speldagen" data-id="${l.id}" data-code="${esc(S.spel)}">
            <td><b>${esc(l.naam)} ${esc(l.voornaam)}</b><div class="klein">${esc(l.klas)}${gk ? '' : ' · <span class="etiket grijs">ontkoppeld</span>'}</div></td>
            <td>${tijd(r.vandaag)}</td><td>${tijd(r.week)}</td><td><b>${tijd(r.totaal)}</b></td><td>${r.dagen || 0}</td>
            <td>${sv ? `${balk(sv.pct)}<span class="klein">${esc(sv.tekst)}</span>` : '<span class="klein">nog niet gespeeld</span>'}</td>
            <td class="klein">${datum(r.laatst)}</td>
            <td><button class="licht klein-knop" data-a="speldagen" data-id="${l.id}" data-code="${esc(S.spel)}">Per dag</button></td></tr>`;
        }).join('')}
        <tr><td><b>Samen</b> <span class="klein">(${ll.length})</span></td><td>${tijd(som('vandaag'))}</td><td>${tijd(som('week'))}</td><td><b>${tijd(som('totaal'))}</b></td><td colspan="4"></td></tr>
      </table></div>`}`;
  }

  async function spelDagen(id, code) {
    const l = (S.alle || []).find(x => x.id === id), SP = spelVind(code); if (!l || !SP) return;
    const dagen = await roep('lk_spel_dagen', { p_id: id, p_spel: code }), r = spelRij(id, code) || {}, sv = r.samenvatting;
    const dg = (d) => new Date(d + 'T12:00:00').toLocaleDateString('nl-BE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    const wis = await modaal(`${esc(l.voornaam)} ${esc(l.naam)} · ${SP.icoon} ${esc(SP.titel)}`, `${SPELSTIJL}
      <p><b>Hoever geraakt:</b> ${sv ? `${balk(sv.pct)}${esc(sv.tekst)}` : 'nog niet gespeeld'}</p>
      <p><b>Speeltijd:</b> vandaag ${tijd(r.vandaag)} · deze week ${tijd(r.week)} · totaal ${tijd(r.totaal)}${r.laatst ? ` · laatst gespeeld ${datum(r.laatst)}` : ''}</p>
      ${dagen.length ? `<div class="tabelwrap" style="max-height:300px;overflow:auto"><table class="lijst"><tr><th>Dag</th><th>Speeltijd</th></tr>
        ${dagen.map(d => `<tr><td>${dg(d.dag)}</td><td>${tijd(d.seconden)}</td></tr>`).join('')}</table></div>` : '<p class="klein">Nog geen speeltijd.</p>'}`,
      [...(sv ? [['Voortgang wissen…', 'wis', 'licht']] : []), ['Sluiten', null]]);
    if (wis !== 'wis') return;
    const zeker = await modaal('Voortgang wissen?', `<p>De voortgang van <b>${esc(l.voornaam)} ${esc(l.naam)}</b> in <b>${esc(SP.titel)}</b> wordt gewist: de leerling begint opnieuw. De speeltijd blijft bewaard. Dit kan je niet ongedaan maken.</p>`,
      [['Annuleren', 0, 'licht'], ['Wissen', 1, 'rood']]);
    if (!zeker) return;
    await roep('lk_spel_wissen', { p_id: id, p_spel: code });
    await laadSpellen(); S.melding = `Voortgang van ${esc(l.voornaam)} ${esc(l.naam)} in ${esc(SP.titel)} gewist.`; render();
  }
  function spelCSV(code) {
    const lijst = code ? [spelVind(code)] : SPELLEN();
    const codes = lijst.map(x => x.code);
    const ll = filter((S.alle || []).filter(l => codes.some(c => l.programmas.includes(c) || spelRij(l.id, c))));
    const min = (s) => String(Math.round((s || 0) / 6) / 10).replace('.', ',');
    const kop = ['Klas', 'Naam', 'Voornaam', ...lijst.flatMap(x => [`${x.titel}: min vandaag`, `${x.titel}: min deze week`, `${x.titel}: min totaal`, `${x.titel}: hoever (%)`, `${x.titel}: voortgang`])];
    const rijen = ll.map(l => [l.klas, l.naam, l.voornaam, ...lijst.flatMap(x => {
      const r = spelRij(l.id, x.code); if (!r && !l.programmas.includes(x.code)) return ['', '', '', '', ''];
      const sv = r && r.samenvatting; return [min(r && r.vandaag), min(r && r.week), min(r && r.totaal), sv ? sv.pct : '', sv ? sv.tekst : 'nog niet gespeeld'];
    })]);
    download(`Speeltijd_${code ? bestandsnaam(lijst[0].titel) : 'spellen'}_${bestandsnaam(S.klas || 'alle')}_${vandaag()}.csv`, csv([kop, ...rijen]), 'text/csv;charset=utf-8');
  }

  function lpGroepen(klasnaam) {
    const C = Catalogus.C, kl = klasnaamKlas(klasnaam), gezien = new Set(), groepen = [];
    const vakken = Object.keys(C.vakken).sort((x, y) => (kl && kl.vakken.includes(y) ? 1 : 0) - (kl && kl.vakken.includes(x) ? 1 : 0));
    for (const vak of vakken) {
      const V = C.vakken[vak], codes = [];
      for (const h of V.hoofdstukken) for (const c of (h.leerpaden || [])) if (!gezien.has(c) && Leerpaden.vind(c)) { gezien.add(c); codes.push(c); }
      if (codes.length) groepen.push({ titel: `${V.naam} · ${Catalogus.klassenMetVak(vak).join(' · ')}`, eigen: !!(kl && kl.vakken.includes(vak)), codes });
      const sp = [];
      for (const h of V.hoofdstukken) for (const c of (h.spellen || [])) if (!gezien.has(c) && spelVind(c)) { gezien.add(c); sp.push(c); }
      if (sp.length) groepen.push({ titel: `🎮 Spellen · ${Catalogus.klassenMetVak(vak).join(' · ')}`, eigen: !!(kl && kl.vakken.includes(vak)), codes: sp });
    }
    const rest = [...Leerpaden.lijst, ...SPELLEN()].map(p => p.code).filter(c => !gezien.has(c));
    if (rest.length) groepen.push({ titel: 'Overige leerpaden', eigen: false, codes: rest });
    return groepen;
  }
  const klasnaamKlas = (k) => (k && typeof Catalogus !== 'undefined') ? Catalogus.klasVan(k) : null;
  const filterAlle = (lijst) => filter(lijst).filter(l => !S.lpFilter || (S.lpFilter === '-' ? !l.programmas.length : l.programmas.includes(S.lpFilter)));
  const lpOpties = (gekozen, metGeen) => lpGroepen(S.klas).map(g => `<optgroup label="${esc(g.titel)}">${g.codes.map(c => `<option value="${esc(c)}" ${c === gekozen ? 'selected' : ''}>${esc(progTitel(c))}</option>`).join('')}</optgroup>`).join('')
    + (metGeen ? `<option value="-" ${gekozen === '-' ? 'selected' : ''}>— aan geen enkel leerpad gekoppeld —</option>` : '');

  function vAlle() {
    const alle = S.alle, ll = filterAlle(alle);
    const sel = [...S.selectie].filter(id => alle.some(l => l.id === id));
    const chips = (l) => {
      const volg = lpGroepen(l.klas).flatMap(g => g.codes);
      return l.programmas.slice().sort((x, y) => volg.indexOf(x) - volg.indexOf(y)).map(c => `<span class="lpchip${c === S.lpFilter ? ' aan' : ''}">${esc(progTitel(c))}<button type="button" data-a="ontkoppel" data-id="${l.id}" data-code="${esc(c)}" title="Ontkoppelen (resultaten blijven bewaard)" aria-label="${esc(progTitel(c))} ontkoppelen">×</button></span>`).join('');
    };
    return `<div class="werkbalk"><h1 class="vul" style="margin:0">Alle leerlingen <span class="klein">(${alle.length} accounts)</span></h1>
        <button data-a="toevoegen">+ Nieuwe leerlingen</button></div>
      <p class="klein">Eén account per leerling, voor alle leerpaden. Bij elke leerling zie je de leerpaden waaraan hij gekoppeld is. Klik op <b>+ leerpad</b> om te koppelen, op <b>×</b> om te ontkoppelen. Ontkoppelen wist geen resultaten: koppel je later opnieuw, dan staat alles er nog.</p>
      ${alle.length ? `<div class="filters">${filterbalk(alle).replace(/^<div class="filters">|<\/div>\s*$/g, '')}
        <select id="lpfilter" aria-label="Leerpad"><option value="">Alle leerpaden</option>${lpOpties(S.lpFilter, true)}</select></div>` : '<div class="kaart"><p>Nog geen accounts.</p></div>'}
      ${alle.length ? `<div class="werkbalk bulk">
        <span class="klein">${sel.length} geselecteerd</span>
        <select id="bulkprog">${lpOpties(S.bulkProg || (S.lpFilter && S.lpFilter !== '-' ? S.lpFilter : S.prog))}</select>
        <button class="licht" data-a="bulk" data-aan="1" ${sel.length ? '' : 'disabled'}>Koppelen</button>
        <button class="licht" data-a="bulk" data-aan="0" ${sel.length ? '' : 'disabled'}>Ontkoppelen</button>
        <button class="licht" data-a="bulkreset" ${sel.length ? '' : 'disabled'}>Nieuwe wachtwoorden + inlogbrieven</button>
        <button class="licht" data-a="allecsv">Lijst (Excel)</button>
        <button class="licht" data-a="backup" title="Alle accounts, koppelingen en resultaten van alle leerpaden in één bestand">💾 Backup databank</button>
      </div>
      <div class="kaart tabelwrap"><table class="lijst alle-ll">
        <tr><th><input type="checkbox" id="allesel" aria-label="alles selecteren" ${ll.length && ll.every(l => S.selectie.has(l.id)) ? 'checked' : ''}></th><th></th><th>Leerling</th><th>Klas</th><th>Gebruikersnaam</th><th>Gekoppelde leerpaden</th><th>Laatst actief</th></tr>
        ${ll.length ? ll.map(l => `<tr>
          <td><input type="checkbox" class="sel" data-id="${l.id}" ${S.selectie.has(l.id) ? 'checked' : ''} aria-label="selecteer"></td>
          <td><button class="licht klein-knop rood-knop icoon-knop" data-a="verwijderrij" data-id="${l.id}" title="Leerling verwijderen uit de databank" aria-label="${esc(l.voornaam)} ${esc(l.naam)} verwijderen">🗑</button></td>
          <td><b>${esc(l.naam)} ${esc(l.voornaam)}</b>${l.actief ? '' : ' <span class="etiket grijs">gedeactiveerd</span>'}</td>
          <td>${esc(l.klas)}</td><td class="klein">${esc(l.gebruikersnaam)}</td>
          <td><div class="lpchips">${chips(l)}<button type="button" class="lpplus" data-a="lpplus" data-id="${l.id}">+ leerpad</button></div></td>
          <td class="klein">${datum(l.laatst_actief)}</td></tr>`).join('') : `<tr><td colspan="7" class="klein">Geen leerlingen voor deze filter.</td></tr>`}
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
    if (S.P.instaptoets) return instapRapportBlok(det, volledig);
    const l = det.leerling, st = det.status, tot = totaalOef(st), h = huidig(st);
    const rij = (cellen, th) => `<tr>${cellen.map(c => `<${th ? 'th' : 'td'}>${c}</${th ? 'th' : 'td'}>`).join('')}</tr>`;
    const delen = DELEN().filter(d => d.klaar || info(st, d.nr).oef.aantal || info(st, d.nr).testen.length);
    const kaal = (s) => s.replace(/<[^>]+>/g, '');
    const opg = (v) => esc(v.rapport || W.platteTekst(v.tex || v.html || ''));
    return `<div class="kopband"><div><h1>Rapport ${esc(S.P.soort || 'leerpad')}: ${esc(S.P.titel)}</h1>
        <div><b>${esc(l.voornaam)} ${esc(l.naam)}</b> · ${esc(l.klas)} · gebruikersnaam ${esc(l.gebruikersnaam)}</div></div>
        <div style="text-align:right"><img src="${LOGO}" alt="${esc(CONFIG.SCHOOL || 'De Resonant')}" style="height:28px"><br>${datum(new Date().toISOString())}</div></div>
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
    const sx = window.scrollX, sy = window.scrollY; window.scrollTo(0, 0);
    try {
      if (!window.html2pdf) throw new Error('PDF-bibliotheek niet geladen. Controleer je internetverbinding.');
      await html2pdf().set({
        margin: [12, 12, 12, 12], filename: naam,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.nieuwe-pagina', avoid: ['tr', '.blok', '.kaartje'] }, ...opties,
      }).from(houder.firstElementChild).save();
    } finally { houder.remove(); window.scrollTo(sx, sy); }
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

  // ---------- afdrukcentrum: puntenlijsten en syntheses over klassen en leerpaden heen
  const LOGO = new URL((location.pathname.includes('/test/') ? '../' : '') + 'img/logo-deresonant.png', location.href).href;
  const AFD = () => (S.afd ||= { klassen: new Set(), progs: new Set(), geslaagdKol: false, enkelGemaakt: true, totaal: false, totaalOp: 50, soort: null, data: null, bezig: '' });
  const afdKlassen = () => klassenVan(S.alle || []);
  const afdLeerlingen = () => (S.alle || []).filter(l => AFD().klassen.has(l.klas));
  function afdProgs() { // leerpaden met minstens één gekoppelde leerling in de gekozen klassen
    const ll = afdLeerlingen();
    return Leerpaden.lijst.filter(P => !P.instaptoets).map(P => ({ P, n: ll.filter(l => l.programmas.includes(P.code)).length })).filter(x => x.n > 0); // instaptoets: eigen resultatenlijst, telt niet voor Skore
  }
  const klaarDelen = (P) => P.delen.filter(d => d.klaar);
  const ingediendVan = (st, nr) => st.testen.filter(t => t.deel === nr && t.status === 'ingediend').sort((a, b) => String(a.ingediend).localeCompare(String(b.ingediend)));
  const OP = 5; // alle testen herrekend naar 5 punten
  const op5 = (t) => String(Math.round(10 * OP * t.score / t.max) / 10).replace('.', ',');
  const AFDSTIJL = `<style>
      .rapport .afdkop { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid #1c4e8a; padding-bottom: 6px; margin-bottom: 10px; }
      .rapport .afdkop img { height: 34px; } .rapport .afdkop .vul { flex: 1; } .rapport .afdkop h1 { margin: 0; }
      .rapport td.sc, .rapport th.sc { text-align: center; white-space: nowrap; }
      .rapport .lpkop { color: #1c4e8a; font-weight: bold; font-size: 12px; margin: 12px 0 4px; }
      .rapport .synth p { margin: 2px 0 6px; } .rapport .synth .naam { font-weight: bold; font-size: 12px; color: #1c4e8a; margin-top: 8px; }
    </style>`;
  const afdKop = (titel, onder) => `<div class="afdkop"><img src="${LOGO}" alt="De Resonant"><div class="vul"><h1>${titel}</h1><div class="klein">${onder}</div></div><div class="klein" style="text-align:right">${datum(new Date().toISOString(), false)}</div></div>`;

  async function afdLaadPunten() {
    const A = AFD(), uit = [];
    for (const { P } of afdProgs().filter(x => A.progs.has(x.P.code))) {
      A.bezig = `Punten ophalen: ${P.titel}…`; render();
      const ov = await roep('lk_overzicht', { p_programma: P.code });
      uit.push({ P, drempel: ov.drempel, leerlingen: ov.leerlingen.filter(l => A.klassen.has(l.klas)) });
    }
    return uit;
  }
  // Totaalscore (optie in het afdrukcentrum, op een zelfgekozen aantal punten): alle pogingen van alle getoonde leerpaden samen.
  // Elke poging telt mee (op 5); een deel zonder poging telt als één test met 0 (dus een leerpad niet gemaakt = 0).
  // Leerpaden waaraan de leerling niet gekoppeld is, tellen niet mee.
  const komma1 = (x) => String(Math.round(10 * x) / 10).replace('.', ',');
  function totaalTabel(k, tot, data, rij) {
    const A = AFD(), TOTAAL_OP = A.totaalOp;
    if (!A.totaal || !tot.size) return '';
    const progs = data.map(x => x.P).filter(P => !P.buitenTotaal && [...tot.values()].some(x => x.lp[P.code])); // buitenTotaal: bv. de proeftoets telt niet mee
    if (!progs.length) return '';
    const rijen = [...tot.values()].sort((a, b) => a.naam.localeCompare(b.naam)).map(x => {
      const S_ = progs.reduce((a, P) => a + (x.lp[P.code] ? x.lp[P.code].s : 0), 0), M = progs.reduce((a, P) => a + (x.lp[P.code] ? x.lp[P.code].m : 0), 0);
      return rij([x.naam, ...progs.map(P => ({ k: 'sc', t: x.lp[P.code] ? `${komma1(x.lp[P.code].s)}/${x.lp[P.code].m}` : '—' })),
        { k: 'sc', t: M ? `<b>${komma1(TOTAAL_OP * S_ / M)}</b>` : '—' }]);
    }).join('');
    return `<div class="blok"><div class="lpkop">Totaalscore <span class="klein">· alle pogingen van alle leerpaden samen, herrekend naar ${TOTAAL_OP}</span></div>
      <table>${rij(['Leerling', ...progs.map(P => ({ k: 'sc', t: esc(P.titel) })), { k: 'sc', t: `Totaal /${TOTAAL_OP}` }], true)}${rijen}</table>
      <p class="klein">Per leerpad: behaalde punten / maximum (elke poging telt op ${OP}; een deel zonder poging telt als 0/${OP}). — = niet gekoppeld aan dat leerpad, telt niet mee.${data.some(x => x.P.buitenTotaal) ? ` Niet in de totaalscore: ${data.filter(x => x.P.buitenTotaal).map(x => esc(x.P.titel)).join(', ')}.` : ''}</p></div>`;
  }
  function puntenHTML(data, metStijl) {
    const A = AFD(), rij = (c, th) => `<tr>${c.map(x => typeof x === 'object' ? `<${th ? 'th' : 'td'} class="${x.k}">${x.t}</${th ? 'th' : 'td'}>` : `<${th ? 'th' : 'td'}>${x}</${th ? 'th' : 'td'}>`).join('')}</tr>`;
    const klassen = [...A.klassen].sort();
    const blokken = klassen.map((k, ki) => {
      const tot = new Map(); // 7VJHO: per leerling { naam, per leerpad { s, m } }
      const tabellen = data.map(({ P, drempel, leerlingen }) => {
        const ll = leerlingen.filter(l => l.klas === k);
        if (!ll.length) return '';
        let delen = klaarDelen(P);
        if (A.enkelGemaakt) delen = delen.filter(d => ll.some(l => ingediendVan(l.status, d.nr).length));
        if (!delen.length) return `<div class="blok"><div class="lpkop">${esc(P.titel)}</div><p class="klein">Nog geen testen afgelegd.</p></div>`;
        // totaalscore: elke poging telt (op 5); een deel zonder poging telt als één test met 0
        ll.forEach(l => {
          const x = tot.get(l.id) || { naam: `${esc(l.naam)} ${esc(l.voornaam)}`, lp: {} }; let sc = 0, mx = 0;
          delen.forEach(d => { const ts = ingediendVan(l.status, d.nr); mx += OP * Math.max(1, ts.length); ts.forEach(t => { sc += OP * t.score / t.max; }); });
          x.lp[P.code] = { s: sc, m: mx }; tot.set(l.id, x);
        });
        // elke afgelegde test (elke poging) krijgt een eigen kolom, in volgorde van indienen
        const kol = delen.flatMap(d => { const n = Math.max(...ll.map(l => ingediendVan(l.status, d.nr).length), 1); return Array.from({ length: n }, (_, i) => ({ d, i, n })); });
        const cel = (l, c) => { const t = ingediendVan(l.status, c.d.nr)[c.i]; return t ? `<span class="${t.geslaagd ? '' : 'r'}">${op5(t)}</span>` : ''; };
        return `<div class="blok"><div class="lpkop">${esc(P.titel)} <span class="klein">· slaagdrempel ${drempel}% · scores op ${OP}</span></div>
          <table>${rij(['Leerling', ...kol.map(c => ({ k: 'sc', t: `<span title="${esc(c.d.titel)}">D${c.d.nr}${c.n > 1 ? ` <small>(${c.i + 1})</small>` : ''}</span>` })), ...(A.geslaagdKol ? [{ k: 'sc', t: 'Geslaagd' }] : [])], true)}
          ${ll.map(l => rij([`${esc(l.naam)} ${esc(l.voornaam)}`, ...kol.map(c => ({ k: 'sc', t: cel(l, c) })),
            ...(A.geslaagdKol ? [{ k: 'sc', t: `${l.status.geslaagd.length}/${klaarDelen(P).length}` }] : [])])).join('')}</table>
          <p class="klein">${delen.map(d => `D${d.nr} = ${esc(d.titel)}`).join(' · ')}</p></div>`;
      }).join('');
      return `<div class="${ki ? 'nieuwe-pagina' : ''}">${afdKop(`Puntenlijst ${esc(k)}`, `alle afgelegde testen, herrekend naar ${OP} punten · (1), (2), … = 1ste, 2de poging · rood = niet geslaagd`)}${tabellen || '<p>Geen gegevens.</p>'}${totaalTabel(k, tot, data, rij)}</div>`;
    }).join('');
    return `<div class="rapport" style="width:1010px">${RAPPORTSTIJL + AFDSTIJL}${blokken}</div>`;
  }

  // Synthese: korte, feitelijke bespreking per leerling per leerpad (voor de rapportcommentaar)
  const lijstTekst = (xs) => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' en ' + xs[xs.length - 1];
  const kortTitel = (t) => t.replace(/\s+in\s+[ℕℤℚℝ]$/, '').toLowerCase();
  function syntheseTekst(P, det) {
    const vn = det.leerling.voornaam, st = det.status, delen = klaarDelen(P), N = delen.length;
    const ingediend = det.testen.filter(t => t.status === 'ingediend');
    const oef = Object.values(st.oefeningen).reduce((a, o) => ({ n: a.n + o.aantal, j: a.j + o.juist }), { n: 0, j: 0 });
    if (!ingediend.length && !oef.n) return `${vn} is nog niet gestart met ${P.titel}.`;
    const g = st.geslaagd.filter(nr => delen.some(d => d.nr === nr)).length;
    const beste = delen.map(d => { const ts = ingediend.filter(t => t.deel === d.nr); return ts.length ? { d, n: ts.length, b: ts.reduce((x, t) => (t.score / t.max_score > x.score / x.max_score ? t : x)), ok: st.geslaagd.includes(d.nr) } : null; }).filter(Boolean);
    const gem = ingediend.length ? Math.round(100 * ingediend.reduce((s, t) => s + t.score / t.max_score, 0) / ingediend.length) : null;
    const extra = [gem !== null ? `gemiddelde over ${ingediend.length} ${ingediend.length === 1 ? 'test' : 'testen'}: ${gem}%` : '', oef.n ? `${oef.n} oefeningen, ${Math.round(100 * oef.j / oef.n)}% juist` : ''].filter(Boolean).join('; ');
    const zinnen = [`${vn} ${g === N ? `rondde alle ${N} delen af` : `slaagde voor ${g} van de ${N} delen`}${extra ? ` (${extra})` : ''}.`];
    const moeite = beste.filter(x => x.ok && x.n > 1), niet = beste.filter(x => !x.ok);
    if (moeite.length) zinnen.push(`Meerdere pogingen nodig voor ${lijstTekst(moeite.slice(0, 3).map(x => kortTitel(x.d.titel)))}.`);
    if (niet.length) zinnen.push(`Nog niet geslaagd voor ${lijstTekst(niet.slice(0, 3).map(x => `${kortTitel(x.d.titel)} (${x.b.score}/${x.b.max_score})`))}.`);
    const soortNm = (s) => { const d = P.delen.find(x => x.nr === s.deel); return d && d.soorten && d.soorten[s.soort] ? d.soorten[s.soort].naam.toLowerCase() : null; };
    const sterk = [...new Set(det.per_soort.filter(s => s.aantal >= 5 && s.juist / s.aantal >= 0.85).sort((a, b) => b.juist / b.aantal - a.juist / a.aantal).map(soortNm).filter(Boolean))];
    const zwak = [...new Set(det.per_soort.filter(s => s.aantal >= 4 && s.juist / s.aantal < 0.6).sort((a, b) => a.juist / a.aantal - b.juist / b.aantal).map(soortNm).filter(Boolean))];
    if (sterk.length) zinnen.push(`Sterk in ${lijstTekst(sterk.slice(0, 2))}.`);
    if (zwak.length) zinnen.push(`Werkpunt: ${lijstTekst(zwak.slice(0, 2))}.`);
    if (g < N && !niet.length) { const open = delen.find(d => !st.geslaagd.includes(d.nr)); if (open) zinnen.push(`Volgende stap: ${kortTitel(open.titel)}.`); }
    return zinnen.join(' ');
  }
  async function afdLaadSynthese() {
    const A = AFD(), progs = afdProgs().filter(x => A.progs.has(x.P.code)).map(x => x.P);
    const ll = afdLeerlingen().filter(l => progs.some(P => l.programmas.includes(P.code)));
    const taken = ll.flatMap(l => progs.filter(P => l.programmas.includes(P.code)).map(P => ({ l, P })));
    const uit = new Map();
    for (let i = 0; i < taken.length; i++) {
      const { l, P } = taken[i]; A.bezig = `Synthese maken… ${i + 1}/${taken.length}`; render();
      const det = await roep('lk_leerling', { p_id: l.id, p_programma: P.code });
      if (!uit.has(l.id)) uit.set(l.id, { l, delen: [] });
      uit.get(l.id).delen.push({ P, tekst: syntheseTekst(P, det) });
    }
    return [...uit.values()].sort((a, b) => (a.l.klas + a.l.naam + a.l.voornaam).localeCompare(b.l.klas + b.l.naam + b.l.voornaam));
  }
  function syntheseHTML(data, voorPDF) {
    const klassen = [...new Set(data.map(x => x.l.klas))].sort();
    return `<div class="rapport">${RAPPORTSTIJL + AFDSTIJL}${klassen.map((k, ki) => `<div class="${ki ? 'nieuwe-pagina' : ''}">${afdKop(`Synthese ${esc(k)}`, 'korte bespreking van het geleverde werk per leerpad')}
      ${data.filter(x => x.l.klas === k).map(x => `<div class="blok synth${voorPDF ? '' : ' synth-ll'}">${voorPDF ? `<div class="naam">${esc(x.l.naam)} ${esc(x.l.voornaam)}</div>` :
        `<div class="werkbalk"><b class="vul">${esc(x.l.naam)} ${esc(x.l.voornaam)}</b><button class="licht klein-knop" data-a="afdkopieer" data-id="${x.l.id}">Kopiëren</button></div>`}
        ${x.delen.map(d => `<p>${x.delen.length > 1 ? `<b>${esc(d.P.titel)}:</b> ` : ''}${esc(d.tekst)}</p>`).join('')}</div>`).join('')}</div>`).join('')}</div>`;
  }
  function vAfdruk() {
    const A = AFD(), kl = afdKlassen(), progs = afdProgs();
    for (const c of [...A.progs]) if (!progs.some(x => x.P.code === c)) A.progs.delete(c);
    const kies = A.klassen.size && A.progs.size;
    return `<h1>🖨️ Afdrukcentrum</h1>
      <div class="afd-blok"><h2>1. Klassen</h2>
        ${kl.length ? `<div class="chips">${kl.map(k => `<label class="chip ${A.klassen.has(k) ? 'aan' : ''}"><input type="checkbox" class="afk" value="${esc(k)}" ${A.klassen.has(k) ? 'checked' : ''}>${esc(k)} <small>(${(S.alle || []).filter(l => l.klas === k).length})</small></label>`).join('')}</div>` : '<p class="klein">Nog geen leerlingen.</p>'}</div>
      <div class="afd-blok"><h2>2. Leerpaden</h2>
        ${!A.klassen.size ? '<p class="klein">Kies eerst één of meer klassen.</p>' : progs.length ? `<div class="chips">${progs.map(({ P, n }) => `<label class="chip ${A.progs.has(P.code) ? 'aan' : ''}"><input type="checkbox" class="afp" value="${esc(P.code)}" ${A.progs.has(P.code) ? 'checked' : ''}>${esc(P.titel)} <small>${esc(P.klas || '')} · ${n} ll.</small></label>`).join('')}</div>
          <p class="klein" style="margin-top:8px"><button class="link" data-a="afdalle">alles selecteren</button></p>` : '<p class="klein">Geen leerlingen van deze klassen gekoppeld aan een leerpad.</p>'}</div>
      <div class="afd-blok"><h2>3. Afdrukken</h2>
        <div class="chips" style="margin-bottom:10px">
          <label class="chip"><input type="checkbox" id="afdgemaakt" ${A.enkelGemaakt ? 'checked' : ''}> enkel delen met afgelegde testen</label>
          <label class="chip ${A.totaal ? 'aan' : ''}"><input type="checkbox" id="afdtot" ${A.totaal ? 'checked' : ''}> totaalscore op
            <input type="number" id="afdtotop" min="1" max="1000" step="1" value="${A.totaalOp}" style="width:64px;padding:2px 6px;margin:0 4px" aria-label="totaalscore op hoeveel punten"> punten</label></div>
        <div class="werkbalk"><button data-a="afdpunten" ${kies ? '' : 'disabled'}>📋 Puntenlijst</button><button data-a="afdsynth" ${kies ? '' : 'disabled'}>📝 Synthese</button>
          ${A.bezig ? `<span class="klein">${esc(A.bezig)}</span>` : ''}</div></div>
      ${A.soort && A.data ? `<div class="werkbalk"><h2 class="vul" style="margin:0">${A.soort === 'punten' ? 'Puntenlijst' : 'Synthese'}</h2>
          <button data-a="afdpdf">Download PDF</button></div>
        <div class="afd-voorbeeld">${A.soort === 'punten' ? puntenHTML(A.data, true) : syntheseHTML(A.data, false)}</div>` : ''}`;
  }
  async function afdActie(a, el) {
    const A = AFD();
    if (a === 'afdruk') { if (!S.alle) await laadAlle(); S.view = 'afdruk'; return render(); }
    if (a === 'afdalle') { afdProgs().forEach(x => A.progs.add(x.P.code)); A.data = null; return render(); }
    if (a === 'afdpunten' || a === 'afdsynth') {
      el.disabled = true;
      try { A.data = a === 'afdpunten' ? await afdLaadPunten() : await afdLaadSynthese(); A.soort = a === 'afdpunten' ? 'punten' : 'synth'; }
      finally { A.bezig = ''; }
      render(); return document.querySelector('.afd-voorbeeld')?.scrollIntoView({ behavior: 'smooth' });
    }
    if (a === 'afdpdf') {
      const t = el.textContent; el.disabled = true; el.textContent = 'PDF maken…';
      const kl = [...A.klassen].sort().join('_');
      try {
        if (A.soort === 'punten') await maakPDF(puntenHTML(A.data, true), `Puntenlijst_${bestandsnaam(kl)}_${vandaag()}.pdf`, { jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } });
        else await maakPDF(syntheseHTML(A.data, true), `Synthese_${bestandsnaam(kl)}_${vandaag()}.pdf`);
      } finally { el.disabled = false; el.textContent = t; }
      return;
    }
    if (a === 'afdkopieer') {
      const x = A.data.find(y => y.l.id === el.dataset.id);
      const tekst = x.delen.map(d => (x.delen.length > 1 ? d.P.titel + ': ' : '') + d.tekst).join('\n');
      try { await navigator.clipboard.writeText(tekst); el.textContent = '✓ Gekopieerd'; } catch (e) { modaal('Kopiëren', `<textarea style="width:100%;height:160px">${esc(tekst)}</textarea>`, [['OK', 1]]); }
      return;
    }
  }
  function koppelAfdruk() {
    const A = AFD();
    app.querySelectorAll('input.afk').forEach(c => c.onchange = () => { c.checked ? A.klassen.add(c.value) : A.klassen.delete(c.value); A.data = null; render(); });
    app.querySelectorAll('input.afp').forEach(c => c.onchange = () => { c.checked ? A.progs.add(c.value) : A.progs.delete(c.value); A.data = null; render(); });
    const g = document.getElementById('afdgemaakt'); if (g) g.onchange = () => { A.enkelGemaakt = g.checked; render(); };
    const k = document.getElementById('afdgesl'); if (k) k.onchange = () => { A.geslaagdKol = k.checked; render(); };
    const tt = document.getElementById('afdtot'); if (tt) tt.onchange = () => { A.totaal = tt.checked; render(); };
    const to = document.getElementById('afdtotop');
    if (to) { to.onclick = (e) => e.stopPropagation(); to.onchange = () => { const v = Math.round(+String(to.value).replace(',', '.')); if (v >= 1 && v <= 1000) { A.totaalOp = v; A.totaal = true; } render(); }; }
  }

  // Inlogbrieven: per leerling één A4 met de login én de handleiding.
  // rectoVerso = true: na elke brief een lege bladzijde, zodat bij recto-verso afdrukken elke leerling een eigen blad heeft.
  function kaartjesHTML(lijst, code, rectoVerso = false) {
    const P = code ? Leerpaden.vind(code) : null;
    const db = code ? S.dbProgs.find(x => x.code === code) : null;
    const drempel = db ? db.drempel : null;
    const link = leerlingLink(null);
    const blauw = '#1c4e8a', oranje = '#e8772e';
    const stap = (nr, titel, tekst) => `<div style="display:flex;gap:10px;margin:7px 0"><div style="flex:0 0 24px;height:24px;border-radius:50%;background:${oranje};color:#fff;font-weight:bold;text-align:center;line-height:24px;font-size:13px">${nr}</div>
      <div><b style="color:${blauw}">${titel}</b><br>${tekst}</div></div>`;
    const brief = (n, k) => `<div class="${k ? 'nieuwe-pagina' : ''}" style="font-family:Verdana,sans-serif;color:#1f2733;background:#fff;width:680px;font-size:12.5px;line-height:1.55">
      <div style="border-bottom:3px solid ${oranje};padding-bottom:6px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end">
        <div><div style="font-size:20px;font-weight:bold;color:${blauw}">${esc(CONFIG.TITEL || 'Leerpaden')}</div><div style="color:#6b7280">${esc(CONFIG.ONDERTITEL || '')}</div></div>
        <div style="text-align:right;color:#6b7280;font-size:11px">${CONFIG.SCHOOL && !String(CONFIG.ONDERTITEL || '').includes(CONFIG.SCHOOL) ? esc(CONFIG.SCHOOL) : ''}</div></div>
      <div style="font-size:16px;margin-bottom:10px">Inloggegevens voor <b>${esc(n.voornaam)} ${esc(n.naam)}</b>${n.klas ? ` <span style="color:#6b7280">(${esc(n.klas)})</span>` : ''}</div>
      <div style="border:2px solid ${blauw};border-radius:10px;padding:14px 18px;background:#e8f0fa;margin-bottom:8px">
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Website</td><td style="padding:4px 0"><b>${esc(link)}</b></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Gebruikersnaam</td><td style="padding:4px 0"><b style="font-family:'Courier New',monospace;font-size:18px">${esc(n.gebruikersnaam)}</b></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Wachtwoord</td><td style="padding:4px 0"><b style="font-family:'Courier New',monospace;font-size:18px">${esc(n.wachtwoord)}</b></td></tr>
          ${P ? `<tr><td style="padding:4px 16px 4px 0;color:#6b7280">Leerpad</td><td style="padding:4px 0">${esc(P.titel)}${P.ondertitel ? ' · ' + esc(P.ondertitel) : ''}</td></tr>` : ''}
        </table></div>
      <div style="font-size:11px;color:#b83a2e;margin-bottom:16px">Bewaar dit blad goed. Je wachtwoord is persoonlijk: geef het aan niemand door.</div>
      <div style="font-size:16px;font-weight:bold;color:${blauw};margin-bottom:4px">Handleiding</div>
      ${stap(1, 'Aanmelden', `Surf naar <b>${esc(link)}</b> (op je computer, laptop of gsm). Typ je gebruikersnaam en je wachtwoord precies zoals hierboven, en klik op <i>Aanmelden</i>. Tip: bewaar de website als bladwijzer.`)}
      ${stap(2, 'Kies je leerpad', 'Je ziet enkel de leerpaden die je leerkracht voor jou heeft opengezet. Heb je er meer dan één, kies dan eerst het vak en daarna het leerpad. Heb je er maar één, dan kom je er meteen in.')}
      ${P && P.instaptoets ? `
      ${stap(3, 'De instaptoets', `Je maakt één toets van ${P.delen[0].test.length} vragen over getallenleer, <b>zonder rekenmachine</b>. Eerst een deel basisvragen, daarna een deel uitdagende vragen. Neem een kladblad en een pen. Je hebt ongeveer 50 à 60 minuten nodig.`)}
      ${stap(4, 'Eén kans', 'Zodra je de toets start, telt je poging. Sluit je per ongeluk de pagina, meld je dan opnieuw aan: je kan verdergaan, je antwoorden blijven bewaard tot je indient. Weet je een vraag niet, ga dan gewoon verder.')}
      ${stap(5, 'Na het indienen', 'Je ziet meteen je score op 100 en je verbetering. Je leerkracht kiest daarna het leerpad dat bij jou past.')}
      ${stap(6, 'Antwoorden typen', 'Een kommagetal typ je met een komma (<b>2,5</b>), een breuk met een schuine streep (<b>3/4</b>), een macht met <b>^</b>. De knoppen onder het vakje helpen je (√, x², …). Onder het vakje zie je hoe je antwoord gelezen wordt: kijk dat na.')}
      ${stap(7, 'Afmelden en hulp', 'Klik op <i>Afmelden</i> als je klaar bent, zeker op een gedeelde computer. Wachtwoord vergeten of een probleem? Vraag het aan je leerkracht.')}` : `
      ${stap(3, 'Werk deel per deel', 'Een leerpad bestaat uit delen. Elk deel heeft vier stappen: <b>Theorie</b> (lees aandachtig), <b>Voorbeelden</b> (probeer eerst zelf, klik dan stap voor stap door de oplossing), <b>Oefenen</b> en <b>Test</b>.')}
      ${stap(4, 'Oefenen', 'Je mag zoveel oefenen als je wil. Na elke oefening zie je meteen of je antwoord juist is, met de volledige uitwerking. Oefen tot het vlot gaat, pas dan maak je de test.')}
      ${stap(5, 'De test', `Een test heeft 10 vragen. Je poging telt vanaf het moment dat je hem start: de pagina herladen of sluiten helpt niet. Elke poging telt mee voor je punten. Haal je ${drempel ? `<b>${drempel}%</b>` : 'de slaagdrempel'}, dan gaat het volgende deel open. Niet geslaagd? Bekijk je fouten, oefen verder en maak de test opnieuw (met nieuwe vragen).`)}
      ${stap(6, 'Antwoorden typen', 'Een kommagetal typ je met een komma (<b>2,5</b>), een breuk met een schuine streep (<b>3/4</b>), een macht met <b>^</b>. De knoppen onder het vakje helpen je (√, x², …). Onder het vakje zie je hoe je antwoord gelezen wordt: kijk dat na vóór je op <i>Controleer</i> klikt.')}
      ${stap(7, 'Afmelden en hulp', 'Klik op <i>Afmelden</i> als je klaar bent, zeker op een gedeelde computer. Je voortgang wordt automatisch bewaard. Wachtwoord vergeten of een probleem? Vraag het aan je leerkracht.')}`}
      </div>`;
    const leeg = `<div class="nieuwe-pagina" style="font-family:Verdana,sans-serif;background:#fff;width:680px;height:40px;color:#bbb;font-size:9px;text-align:center">(achterkant: bewust leeg gelaten)</div>`;
    return `<div>${lijst.map((n, k) => brief(n, k) + (rectoVerso ? leeg : '')).join('')}</div>`;
  }


  // ---------- laden
  async function laadProgrammas() {
    S.dbProgs = await roep('lk_programmas', { p_lijst: [...Leerpaden.lijst.map(p => ({ code: p.code, titel: p.titel, eenmalig: !!p.eenmalig })),
      ...SPELLEN().map(p => ({ code: p.code, titel: 'Spel: ' + p.titel, eenmalig: false }))] });
    // Standaard-slaagdrempel van een nieuw leerpad (bv. drempel: 70 in het programmabestand), zolang er nog geen leerlingen gekoppeld zijn.
    for (const P of Leerpaden.lijst.filter(p => p.drempel)) {
      const db = S.dbProgs.find(x => x.code === P.code);
      if (db && db.drempel !== P.drempel && !db.leerlingen) { await roep('lk_drempel', { p_programma: P.code, p_drempel: P.drempel }); db.drempel = P.drempel; }
    }
    if (!Leerpaden.vind(S.prog)) S.prog = Leerpaden.lijst[0] && Leerpaden.lijst[0].code;
    S.P = Leerpaden.vind(S.prog);
  }
  async function laadOverzicht() { S.data = await roep('lk_overzicht', { p_programma: S.prog }); S.instap = S.P && S.P.instaptoets ? await roep('lk_instaptoets', { p_programma: S.prog }) : null; }
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
          await laadProgrammas(); await laadAlle(); S.view = 'boom';
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
    const is = document.getElementById('instapsort');
    if (is) is.onchange = () => { S.instapSort = is.value; render(); };
    const zk = document.getElementById('zoek');
    if (zk) zk.oninput = () => { S.zoek = zk.value; const pos = zk.selectionStart; render(); const z = document.getElementById('zoek'); z.focus(); z.setSelectionRange(pos, pos); };

    koppelAfdruk();
    // Alle leerlingen: selectie en inschrijvingen
    app.querySelectorAll('input.sel').forEach(c => c.onchange = () => { c.checked ? S.selectie.add(c.dataset.id) : S.selectie.delete(c.dataset.id); render(); });
    const as = document.getElementById('allesel');
    if (as) as.onchange = () => { filterAlle(S.alle).forEach(l => as.checked ? S.selectie.add(l.id) : S.selectie.delete(l.id)); render(); };
    const lf = document.getElementById('lpfilter');
    if (lf) lf.onchange = () => { S.lpFilter = lf.value; render(); };
    const bp = document.getElementById('bulkprog');
    if (bp) bp.onchange = () => { S.bulkProg = bp.value; }; // keuze onthouden: anders springt de lijst terug bij elk vinkje
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
        if (a === 'boom') {
          const n = el.dataset.niveau;
          S.boomKlas = n === 'klassen' ? null : (el.dataset.klas || S.boomKlas);
          S.boomVak = n === 'vak' ? el.dataset.vak : null;
          S.boomMenu = n === 'vak' && el.dataset.menu !== undefined ? (el.dataset.menu || null) : n === 'vak' && S.boomVak === API.sessie.get('lk-boomvak') ? S.boomMenu : null;
          API.sessie.set('lk-boomklas', S.boomKlas || ''); API.sessie.set('lk-boomvak', S.boomVak || ''); API.sessie.set('lk-boommenu', S.boomMenu || '');
          await laadAlle(); S.view = 'boom'; S.detail = null; S.nieuw = null; render(); return window.scrollTo(0, 0);
        }
        if (a === 'openlp') {
          S.boomKlas = el.dataset.klas; S.boomVak = el.dataset.vak;
          if (el.dataset.menu !== undefined) S.boomMenu = el.dataset.menu || null;
          API.sessie.set('lk-boomklas', S.boomKlas); API.sessie.set('lk-boomvak', S.boomVak); API.sessie.set('lk-boommenu', S.boomMenu || '');
          S.prog = el.dataset.code; S.P = Leerpaden.vind(S.prog); API.sessie.set('lk-prog', S.prog);
          await naarOverzicht(); render(); return window.scrollTo(0, 0);
        }
        if (a === 'klaskoppel') {
          const code = el.dataset.code, k = el.dataset.klas;
          const nieuw = leerlingenVanKlas(k).filter(l => !l.programmas.includes(code));
          if (!nieuw.length) return;
          const ok = await modaal('Hele klas koppelen?', `<p>${nieuw.length} leerling(en) van <b>${esc(k)}</b> worden gekoppeld aan <b>${esc(progTitel(code))}</b> en zien dit leerpad vanaf nu.</p>
            <p class="klein">${nieuw.map(l => esc(l.voornaam + ' ' + l.naam) + ' (' + esc(l.klas) + ')').join(', ')}</p>
            <p class="klein">Ontkoppelen kan later per leerling; resultaten blijven dan bewaard.</p>`, [['Annuleren', 0, 'licht'], ['Koppelen', 1]]);
          if (!ok) return;
          await roep('lk_inschrijven', { p_ids: nieuw.map(l => l.id), p_programma: code, p_aan: true });
          await laadAlle(); S.melding = `${nieuw.length} leerling(en) van ${esc(k)} gekoppeld aan ${esc(progTitel(code))}.`; return render();
        }
        if (a.startsWith('afd')) return afdActie(a, el);
        if (a === 'spellen') { await laadSpellen(); S.view = 'spellen'; render(); return window.scrollTo(0, 0); }
        if (a === 'openspel') { S.spel = el.dataset.code; API.sessie.set('lk-spel', S.spel); await laadSpellen(); S.view = 'spel'; render(); return window.scrollTo(0, 0); }
        if (a === 'speldagen') return await spelDagen(el.dataset.id, el.dataset.code);
        if (a === 'spelcsv') return spelCSV(el.dataset.code || null);
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
        if (a === 'csv' && S.P.instaptoets) return download(`Resultaten_${bestandsnaam(S.P.titel)}_${S.klas ? bestandsnaam(S.klas) + '_' : ''}${vandaag()}.csv`, instapCSV(), 'text/csv;charset=utf-8');
        if (a === 'instappdf') { const t = el.textContent; el.disabled = true; el.textContent = 'Bezig…'; try { await maakPDF(instapPDF(), `Resultaten_${bestandsnaam(S.P.titel)}_${S.klas ? bestandsnaam(S.klas) + '_' : ''}${vandaag()}.pdf`); } finally { el.disabled = false; el.textContent = t; } return; }
        if (a === 'csv') {
          const kop = ['Klas', 'Naam', 'Voornaam', 'Gebruikersnaam', 'Actief', 'Delen geslaagd', 'Nu bezig met', 'Oefeningen', '% juist', ...KLAAR().map(d => `Test deel ${d.nr}`), 'Laatst actief'];
          const rijen = filter(S.data.leerlingen).map(l => {
            const st = l.status, h = huidig(st), tot = totaalOef(st);
            return [l.klas, l.naam, l.voornaam, l.gebruikersnaam, l.actief ? 'ja' : 'nee', st.geslaagd.length, h === 'klaar' ? 'alles geslaagd' : h ? 'deel ' + h.nr : '', tot.aantal, tot.aantal ? Math.round(100 * tot.juist / tot.aantal) : '',
              ...KLAAR().map(d => info(st, d.nr).ingediend.map(t => `${t.score}/${t.max}`).join(' | ')), datum(l.laatst_actief)];
          });
          return download(`Overzicht_${bestandsnaam(S.P.titel)}_${S.klas ? bestandsnaam(S.klas) + '_' : ''}${vandaag()}.csv`, csv([kop, ...rijen]), 'text/csv;charset=utf-8');
        }
        if (a === 'backup') {
          el.disabled = true; el.textContent = 'Backup wordt gemaakt…';
          try {
            const b = await roep('lk_backup', {});
            const tekst = JSON.stringify(b);
            download(`Backup_leerpaden_${vandaag()}.json`, tekst, 'application/json');
            S.melding = `Backup gedownload: ${(b.leerlingen || []).length} accounts, ${(b.testen || []).length} testen, ${(b.oefeningen || []).length} oefeningen (${Math.max(1, Math.round(tekst.length / 1024))} kB). Bewaar het bestand in je OneDrive-map <i>Backups leerpaden</i>.`;
          } catch (e) {
            if (/lk_backup|function|404|PGRST202/i.test(e.message || '')) return modaal('Backup nog niet ingesteld', '<p>Voer eerst eenmalig <code>supabase/update-backup.sql</code> uit in Supabase → SQL Editor. Daarna werkt deze knop.</p>', [['OK', 1]]);
            throw e;
          }
          return render();
        }
        if (a === 'allecsv') {
          const progs = Leerpaden.lijst;
          return download(`Accounts_${vandaag()}.csv`, csv([['Klas', 'Naam', 'Voornaam', 'Gebruikersnaam', 'Actief', ...progs.map(p => p.titel), 'Laatst actief'],
            ...filterAlle(S.alle).map(l => [l.klas, l.naam, l.voornaam, l.gebruikersnaam, l.actief ? 'ja' : 'nee', ...progs.map(p => l.programmas.includes(p.code) ? 'ja' : ''), datum(l.laatst_actief)])]), 'text/csv;charset=utf-8');
        }
        if (a === 'maak') {
          const lijst = leesNamen();
          if (!lijst.length) return modaal('Geen namen', '<p>Typ minstens één naam.</p>', [['OK', 1]]);
          const koppelNu = document.getElementById('koppelnu').checked;
          const r = await roep('lk_leerlingen_toevoegen', { p_lijst: lijst, p_programma: koppelNu ? S.prog : null });
          S.nieuw = { lijst: r, code: koppelNu ? S.prog : null, terug: S.terugNa === 'alle' ? 'alle' : 'overzicht' };
          return render();
        }
        if (a === 'kaartjes') { const rv = el.dataset.rv === '1', t = el.textContent; el.disabled = true; el.textContent = 'Bezig…'; try { await maakPDF(kaartjesHTML(S.nieuw.lijst, S.nieuw.code, rv), `Inlogbrieven_${rv ? 'recto-verso_' : ''}${vandaag()}.pdf`); } finally { el.disabled = false; el.textContent = t; } return; }
        if (a === 'nieuwcsv') return download(`Logins_${vandaag()}.csv`, csv([['Klas', 'Naam', 'Voornaam', 'Gebruikersnaam', 'Wachtwoord'], ...S.nieuw.lijst.map(n => [n.klas, n.naam, n.voornaam, n.gebruikersnaam, n.wachtwoord])]), 'text/csv;charset=utf-8');
        if (a === 'ontkoppel') {
          const l = S.alle.find(x => x.id === el.dataset.id), code = el.dataset.code; if (!l) return;
          await roep('lk_inschrijven', { p_ids: [l.id], p_programma: code, p_aan: false });
          l.programmas = l.programmas.filter(x => x !== code);
          S.melding = `${esc(l.voornaam)} ${esc(l.naam)} is ontkoppeld van ${esc(progTitel(code))} (resultaten blijven bewaard).`; return render();
        }
        if (a === 'lpplus') {
          const l = S.alle.find(x => x.id === el.dataset.id); if (!l) return;
          const groepen = lpGroepen(l.klas), heeft = new Set(l.programmas);
          const blok = (g) => `<div class="lpgroep"><div class="lpgroep-titel">${esc(g.titel)}</div>${g.codes.map(c => `<label class="lpkeuze"><input type="checkbox" value="${esc(c)}" ${heeft.has(c) ? 'checked' : ''}> ${esc(progTitel(c))}</label>`).join('')}</div>`;
          const eigen = groepen.filter(g => g.eigen), andere = groepen.filter(g => !g.eigen);
          const keuze = await modaal(`Leerpaden van ${esc(l.voornaam)} ${esc(l.naam)}`, `<p class="klein">${esc(l.klas)} · vink aan om te koppelen, uit om te ontkoppelen (resultaten blijven bewaard).</p>
            <div class="lpkeuzes">${eigen.map(blok).join('')}
            ${andere.length ? (eigen.length ? `<details ${andere.some(g => g.codes.some(c => heeft.has(c))) ? 'open' : ''}><summary>Leerpaden van andere klassen</summary>${andere.map(blok).join('')}</details>` : andere.map(blok).join('')) : ''}</div>`,
            [['Annuleren', null, 'licht'], ['Opslaan', (m) => [...m.querySelectorAll('.lpkeuzes input')].filter(i => i.checked).map(i => i.value)]]);
          if (!keuze) return;
          const nieuw = new Set(keuze), aan = keuze.filter(c => !heeft.has(c)), uit = l.programmas.filter(c => !nieuw.has(c));
          for (const c of aan) await roep('lk_inschrijven', { p_ids: [l.id], p_programma: c, p_aan: true });
          for (const c of uit) await roep('lk_inschrijven', { p_ids: [l.id], p_programma: c, p_aan: false });
          if (aan.length || uit.length) { await laadAlle(); S.melding = `${esc(l.voornaam)} ${esc(l.naam)}: ${[aan.length ? `gekoppeld aan ${aan.map(c => esc(progTitel(c))).join(', ')}` : '', uit.length ? `ontkoppeld van ${uit.map(c => esc(progTitel(c))).join(', ')}` : ''].filter(Boolean).join(' · ')}.`; }
          return render();
        }
        if (a === 'bulk') {
          const ids = [...S.selectie].filter(id => S.alle.some(l => l.id === id)), code = document.getElementById('bulkprog').value, aan = el.dataset.aan === '1';
          await roep('lk_inschrijven', { p_ids: ids, p_programma: code, p_aan: aan });
          await laadAlle(); S.melding = `${ids.length} leerling(en) ${aan ? 'gekoppeld aan' : 'ontkoppeld van'} ${esc(progTitel(code))}.`; return render();
        }
        if (a === 'bulkreset') {
          const ll = S.alle.filter(l => S.selectie.has(l.id));
          if (!await modaal('Nieuwe wachtwoorden?', `<p>${ll.length} leerling(en) krijgen een nieuw wachtwoord. Hun oude wachtwoord werkt daarna niet meer. Je krijgt meteen nieuwe inlogbrieven.</p>`, [['Annuleren', 0, 'licht'], ['Nieuwe wachtwoorden', 1, 'oranje']])) return;
          const uit = [];
          for (const l of ll) { const r = await roep('lk_wachtwoord_reset', { p_id: l.id }); uit.push({ ...l, wachtwoord: r.wachtwoord }); }
          const code = document.getElementById('bulkprog') ? document.getElementById('bulkprog').value : S.prog;
          S.nieuw = { lijst: uit, code, terug: 'alle' }; S.view = 'toevoegen'; return render();
        }

        if (a === 'verwijderrij') {
          const x = S.alle.find(y => y.id === el.dataset.id);
          if (!x) return;
          const lp = x.programmas.map(progTitel);
          if (!await modaal('Leerling verwijderen?', `<p>Het account van <b>${esc(x.voornaam)} ${esc(x.naam)}</b> (${esc(x.klas)} · ${esc(x.gebruikersnaam)}) en <b>alle</b> resultaten worden definitief gewist${lp.length ? `, in alle leerpaden: ${lp.map(esc).join(', ')}` : ''}.</p>
            <p class="klein">Dit kan niet ongedaan gemaakt worden. Wil je de resultaten bewaren, download dan eerst het rapport in het leerpad.</p>`, [['Annuleren', 0, 'licht'], ['Definitief verwijderen', 1, 'rood']])) return;
          await roep('lk_leerling_wijzigen', { p_id: x.id, p_actief: false, p_verwijderen: true });
          S.selectie.delete(x.id); await laadAlle(); S.melding = `${esc(x.voornaam)} ${esc(x.naam)} is verwijderd.`; return render();
        }
        const l = S.detail && S.detail.leerling;
        if (a === 'heropen') {
          const nr = +el.dataset.deel, sinds = sindsLaatsteTest(S.detail, nr);
          const ok = await modaal('Test opnieuw openzetten?', `<p>${esc(l.voornaam)} krijgt <b>één nieuwe poging</b> voor ${S.P.instaptoets ? 'de instaptoets' : `de test van deel ${nr}`}, met nieuwe vragen.${S.P.instaptoets ? ' De vorige poging blijft bewaard; in het overzicht telt de laatste.' : ''}</p>
            ${sinds ? `<p class="klein">Sinds de vorige test: ${sinds.aantal} oefeningen, ${pct(sinds.juist, sinds.aantal)} juist.</p>` : ''}`, [['Annuleren', 0, 'licht'], ['Openzetten', 1, 'oranje']]);
          if (!ok) return;
          await roep('lk_test_heropenen', { p_id: l.id, p_programma: S.prog, p_deel: nr }); await laadDetail(l.id);
          S.melding = `${S.P.instaptoets ? 'De instaptoets' : `De test van deel ${nr}`} staat opnieuw open voor ${esc(l.voornaam)}.`; return render();
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
          const keuze = await modaal('Nieuw wachtwoord', `<p>${esc(l.voornaam)} ${esc(l.naam)}<br>Gebruikersnaam: <b>${esc(l.gebruikersnaam)}</b><br>Wachtwoord: <b style="font-family:monospace;font-size:18px">${esc(r.wachtwoord)}</b></p>`, [['Inlogbrief (PDF)', 'pdf', 'licht'], ['OK', 1]]);
          if (keuze === 'pdf') await maakPDF(kaartjesHTML([{ ...l, wachtwoord: r.wachtwoord }], S.prog), `Inlogbrief_${bestandsnaam(l.voornaam + '_' + l.naam)}.pdf`);
          return;
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
    if (S.token) { try { await laadProgrammas(); await laadAlle(); S.view = 'boom'; } catch (e) { S.token = null; S.view = 'login'; } }
    render();
  })();
})();
