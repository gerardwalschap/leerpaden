// Demo-modus: dezelfde functies als de echte databank, maar opgeslagen in deze browser.
// Demo-logins: leerkracht wachtwoord "demo", leerling "demo" / "demo".
const Demo = (() => {
  const SLEUTEL = 'leerpaden-demo-v1';
  let geheugen = null;

  function nieuw() {
    const LP = typeof Leerpaden !== 'undefined' ? Leerpaden.lijst : [];
    const eerste = LP[0] ? LP[0].code : 'demo';
    return {
      lk: 'demo', programmas: LP.map(p => ({ code: p.code, titel: p.titel, drempel: 80, eenmalig: !!p.eenmalig, aangemaakt: new Date().toISOString() })),
      leerlingen: [{ id: 'd1', gebruikersnaam: 'demo', voornaam: 'Demo', naam: 'Leerling', klas: '7VJHO', pw: 'demo', actief: true, aangemaakt: new Date().toISOString(), laatst_actief: null }],
      inschrijvingen: [{ ll: 'd1', prog: eerste, sinds: new Date().toISOString() }],
      sessies: [], oefeningen: [], testen: [], toegang: [], volg: 1,
    };
  }
  function laad() {
    try { const s = localStorage.getItem(SLEUTEL); if (s) geheugen = JSONX.parse(s); }
    catch (e) { /* opslag geblokkeerd: verder in geheugen */ }
    if (!geheugen) geheugen = nieuw();
    return geheugen;
  }
  function bewaar() { try { localStorage.setItem(SLEUTEL, JSONX.stringify(geheugen)); } catch (e) { /* enkel in geheugen */ } }
  const nu = () => new Date().toISOString();
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  const fout = (c) => { throw new Error(c); };

  function leerling(db, token) {
    const s = db.sessies.find(s => s.token === token && !s.lk);
    const l = s && db.leerlingen.find(l => l.id === s.ll && l.actief);
    if (!l) fout('SESSIE_VERLOPEN');
    l.laatst_actief = nu(); return l;
  }
  function leerkracht(db, token) { if (!db.sessies.find(s => s.token === token && s.lk)) fout('SESSIE_VERLOPEN'); }
  const ingeschreven = (db, ll, p) => { if (!db.inschrijvingen.some(i => i.ll === ll && i.prog === p)) fout('NIET_INGESCHREVEN'); };
  const deelOpen = (db, ll, p, d) => d === 1 || db.testen.some(t => t.ll === ll && t.prog === p && t.deel === d - 1 && t.geslaagd) || db.toegang.some(t => t.ll === ll && t.prog === p && t.deel === d && t.vrijgegeven);
  const wachtwoord = () => { const a = 'abcdefghjkmnpqrstuvwxyz', c = '23456789'; let r = ''; for (let i = 0; i < 4; i++) r += a[Math.floor(Math.random() * a.length)]; for (let i = 0; i < 3; i++) r += c[Math.floor(Math.random() * c.length)]; return r; };
  const llInfo = (l) => ({ voornaam: l.voornaam, naam: l.naam, klas: l.klas, gebruikersnaam: l.gebruikersnaam });
  const progsVan = (db, ll) => db.inschrijvingen.filter(i => i.ll === ll).map(i => db.programmas.find(p => p.code === i.prog)).filter(Boolean).map(p => ({ code: p.code, titel: p.titel }));

  function status(db, ll, p) {
    const l = db.leerlingen.find(x => x.id === ll);
    const oef = {};
    db.oefeningen.filter(o => o.ll === ll && o.prog === p).forEach(o => { oef[o.deel] ??= { aantal: 0, juist: 0 }; oef[o.deel].aantal++; if (o.juist) oef[o.deel].juist++; });
    const toeg = {}; db.toegang.filter(t => t.ll === ll && t.prog === p).forEach(t => toeg[t.deel] = t.pogingen);
    const pr = db.programmas.find(x => x.code === p);
    return {
      programma: p, leerling: llInfo(l), drempel: pr ? pr.drempel : 80,
      geslaagd: [...new Set(db.testen.filter(t => t.ll === ll && t.prog === p && t.geslaagd).map(t => t.deel))],
      vrijgegeven: db.toegang.filter(t => t.ll === ll && t.prog === p && t.vrijgegeven).map(t => t.deel),
      toegestaan: toeg,
      testen: db.testen.filter(t => t.ll === ll && t.prog === p).map(t => ({ id: t.id, deel: t.deel, status: t.status, score: t.score, max: t.max_score, geslaagd: t.geslaagd, gestart: t.gestart, ingediend: t.ingediend })),
      oefeningen: oef,
    };
  }
  function toegang(db, ll, p, deel) {
    let t = db.toegang.find(t => t.ll === ll && t.prog === p && t.deel === deel);
    if (!t) { t = { ll, prog: p, deel, pogingen: 1, vrijgegeven: false }; db.toegang.push(t); }
    return t;
  }

  const F = {
    ll_login(db, { p_gebruikersnaam, p_wachtwoord }) {
      const l = db.leerlingen.find(l => l.gebruikersnaam === String(p_gebruikersnaam).trim().toLowerCase() && l.actief);
      if (!l || l.pw !== p_wachtwoord) fout('FOUTE_LOGIN');
      const token = uid(); db.sessies.push({ token, ll: l.id }); l.laatst_actief = nu();
      return { token, leerling: llInfo(l), programmas: progsVan(db, l.id) };
    },
    ll_logout(db, { p_token }) { db.sessies = db.sessies.filter(s => s.token !== p_token); },
    ll_programmas(db, { p_token }) { const l = leerling(db, p_token); return { leerling: llInfo(l), programmas: progsVan(db, l.id) }; },
    ll_status(db, { p_token, p_programma }) { const l = leerling(db, p_token); ingeschreven(db, l.id, p_programma); return status(db, l.id, p_programma); },
    ll_oefening(db, { p_token, p_programma, p_deel, p_soort, p_juist }) {
      const l = leerling(db, p_token); ingeschreven(db, l.id, p_programma);
      if (!deelOpen(db, l.id, p_programma, p_deel)) fout('DEEL_GESLOTEN');
      db.oefeningen.push({ ll: l.id, prog: p_programma, deel: p_deel, soort: p_soort, juist: !!p_juist, tijd: nu() });
    },
    ll_test_start(db, { p_token, p_programma, p_deel, p_vragen }) {
      const l = leerling(db, p_token); ingeschreven(db, l.id, p_programma);
      const bezig = db.testen.find(t => t.ll === l.id && t.prog === p_programma && t.deel === p_deel && t.status === 'bezig');
      if (bezig) return { id: bezig.id, vragen: bezig.vragen, gestart: bezig.gestart };
      if (!deelOpen(db, l.id, p_programma, p_deel)) fout('DEEL_GESLOTEN');
      const pr = db.programmas.find(x => x.code === p_programma);
      if (pr && pr.eenmalig) { // één poging, tenzij de leerkracht er een extra gaf
        const gebruikt = db.testen.filter(t => t.ll === l.id && t.prog === p_programma && t.deel === p_deel).length;
        const tg = db.toegang.find(t => t.ll === l.id && t.prog === p_programma && t.deel === p_deel);
        if (gebruikt >= (tg ? tg.pogingen : 1)) fout('AL_GEMAAKT');
      } else if (db.testen.some(t => t.ll === l.id && t.prog === p_programma && t.deel === p_deel && t.geslaagd)) fout('AL_GESLAAGD');
      const t = { id: db.volg++, ll: l.id, prog: p_programma, deel: p_deel, vragen: p_vragen, antwoorden: null, score: null, max_score: null, geslaagd: null, status: 'bezig', gestart: nu(), ingediend: null };
      db.testen.push(t); return { id: t.id, vragen: t.vragen, gestart: t.gestart };
    },
    ll_test_indienen(db, { p_token, p_test, p_antwoorden, p_score }) {
      const l = leerling(db, p_token);
      const t = db.testen.find(t => t.id === p_test && t.ll === l.id);
      if (!t) fout('ONBEKENDE_TEST'); if (t.status !== 'bezig') fout('AL_INGEDIEND');
      const mx = t.vragen.length, sc = Math.max(0, Math.min(p_score, mx));
      const pr = db.programmas.find(x => x.code === t.prog), d = pr ? pr.drempel : 80;
      Object.assign(t, { antwoorden: p_antwoorden, score: sc, max_score: mx, geslaagd: sc * 100 >= d * mx, status: 'ingediend', ingediend: nu() });
      return { score: sc, max: mx, geslaagd: t.geslaagd, status: status(db, l.id, t.prog) };
    },
    ll_test_bekijken(db, { p_token, p_test }) {
      const l = leerling(db, p_token);
      const t = db.testen.find(t => t.id === p_test && t.ll === l.id);
      if (!t) fout('ONBEKENDE_TEST'); if (t.status !== 'ingediend') fout('NOG_NIET_INGEDIEND');
      return { id: t.id, programma: t.prog, deel: t.deel, vragen: t.vragen, antwoorden: t.antwoorden, score: t.score, max: t.max_score, geslaagd: t.geslaagd, ingediend: t.ingediend };
    },
    lk_login(db, { p_wachtwoord }) {
      if (p_wachtwoord !== db.lk) fout('FOUTE_LOGIN');
      const token = uid(); db.sessies.push({ token, lk: true }); return { token };
    },
    lk_logout(db, { p_token }) { db.sessies = db.sessies.filter(s => s.token !== p_token); },
    lk_programmas(db, { p_token, p_lijst }) {
      leerkracht(db, p_token);
      (p_lijst || []).forEach(r => { const p = db.programmas.find(x => x.code === r.code); if (p) { p.titel = r.titel; p.eenmalig = !!r.eenmalig; } else db.programmas.push({ code: r.code, titel: r.titel, drempel: 80, eenmalig: !!r.eenmalig, aangemaakt: nu() }); });
      return db.programmas.map(p => ({ code: p.code, titel: p.titel, drempel: p.drempel, eenmalig: !!p.eenmalig, leerlingen: db.inschrijvingen.filter(i => i.prog === p.code).length }));
    },
    lk_drempel(db, { p_token, p_programma, p_drempel }) {
      leerkracht(db, p_token); if (!(p_drempel >= 1 && p_drempel <= 100)) fout('ONGELDIGE_DREMPEL');
      const p = db.programmas.find(x => x.code === p_programma); if (p) p.drempel = p_drempel;
    },
    lk_leerlingen_toevoegen(db, { p_token, p_lijst, p_programma }) {
      leerkracht(db, p_token);
      if (p_programma && !db.programmas.some(p => p.code === p_programma)) fout('ONBEKEND_PROGRAMMA');
      return p_lijst.map(r => {
        let basis = String(r.gebruikersnaam || '').toLowerCase().replace(/[^a-z0-9.]/g, '') || 'leerling', gn = basis, i = 1;
        while (db.leerlingen.some(l => l.gebruikersnaam === gn)) gn = basis + (++i);
        const pw = wachtwoord(), id = uid();
        db.leerlingen.push({ id, gebruikersnaam: gn, voornaam: r.voornaam.trim(), naam: (r.naam || '').trim(), klas: (r.klas || '').trim(), pw, actief: true, aangemaakt: nu(), laatst_actief: null });
        if (p_programma) db.inschrijvingen.push({ ll: id, prog: p_programma, sinds: nu() });
        return { id, voornaam: r.voornaam.trim(), naam: (r.naam || '').trim(), klas: (r.klas || '').trim(), gebruikersnaam: gn, wachtwoord: pw };
      });
    },
    lk_inschrijven(db, { p_token, p_ids, p_programma, p_aan }) {
      leerkracht(db, p_token);
      if (!db.programmas.some(p => p.code === p_programma)) fout('ONBEKEND_PROGRAMMA');
      p_ids.forEach(id => {
        const er = db.inschrijvingen.some(i => i.ll === id && i.prog === p_programma);
        if (p_aan && !er && db.leerlingen.some(l => l.id === id)) db.inschrijvingen.push({ ll: id, prog: p_programma, sinds: nu() });
        if (!p_aan) db.inschrijvingen = db.inschrijvingen.filter(i => !(i.ll === id && i.prog === p_programma));
      });
    },
    // ---------- spellen: toestand per leerling en actieve speeltijd per dag
    ll_spel_start(db, { p_token, p_spel }) {
      const l = leerling(db, p_token); ingeschreven(db, l.id, p_spel);
      db.spelstaat ||= []; db.speltijd ||= [];
      const st = db.spelstaat.find(x => x.ll === l.id && x.spel === p_spel), dag = new Date().toLocaleDateString('sv-SE');
      const t = db.speltijd.find(x => x.ll === l.id && x.spel === p_spel && x.dag === dag);
      return { staat: st ? st.staat : {}, vandaag: t ? t.seconden : 0, voornaam: l.voornaam };
    },
    ll_spel_bewaar(db, { p_token, p_spel, p_seconden, p_staat, p_samenvatting }) {
      const l = leerling(db, p_token); ingeschreven(db, l.id, p_spel);
      db.spelstaat ||= []; db.speltijd ||= [];
      const s = Math.max(0, Math.min(300, Math.round(p_seconden || 0))), dag = new Date().toLocaleDateString('sv-SE');
      if (s) {
        let t = db.speltijd.find(x => x.ll === l.id && x.spel === p_spel && x.dag === dag);
        if (!t) { t = { ll: l.id, spel: p_spel, dag, seconden: 0 }; db.speltijd.push(t); }
        t.seconden += s;
      }
      let st = db.spelstaat.find(x => x.ll === l.id && x.spel === p_spel);
      if (!st) { st = { ll: l.id, spel: p_spel, staat: {}, samenvatting: null, bijgewerkt: null }; db.spelstaat.push(st); }
      if (p_staat) { st.staat = p_staat; st.samenvatting = p_samenvatting || null; }
      st.bijgewerkt = nu();
    },
    lk_spellen(db, { p_token }) {
      leerkracht(db, p_token);
      const d = new Date(), dag = d.toLocaleDateString('sv-SE');
      const ma = new Date(d); ma.setDate(d.getDate() - ((d.getDay() + 6) % 7)); const week = ma.toLocaleDateString('sv-SE');
      const rijen = new Map(), rij = (ll, spel) => { const k = ll + '|' + spel; if (!rijen.has(k)) rijen.set(k, { leerling: ll, spel, vandaag: 0, week: 0, totaal: 0, dagen: 0, samenvatting: null, laatst: null }); return rijen.get(k); };
      (db.speltijd || []).forEach(t => { const r = rij(t.ll, t.spel); r.totaal += t.seconden; r.dagen++; if (t.dag === dag) r.vandaag += t.seconden; if (t.dag >= week) r.week += t.seconden; });
      (db.spelstaat || []).forEach(s => { const r = rij(s.ll, s.spel); r.samenvatting = s.samenvatting; r.laatst = s.bijgewerkt; });
      return [...rijen.values()];
    },
    lk_spel_dagen(db, { p_token, p_id, p_spel }) {
      leerkracht(db, p_token);
      return (db.speltijd || []).filter(t => t.ll === p_id && t.spel === p_spel).map(t => ({ dag: t.dag, seconden: t.seconden })).sort((a, b) => b.dag.localeCompare(a.dag));
    },
    lk_spel_wissen(db, { p_token, p_id, p_spel }) {
      leerkracht(db, p_token);
      db.spelstaat = (db.spelstaat || []).filter(s => !(s.ll === p_id && s.spel === p_spel));
    },
    lk_backup(db, { p_token }) {
      leerkracht(db, p_token);
      const { sessies, ...rest } = db; void sessies;
      return { soort: 'leerpaden-backup', versie: 1, gemaakt: new Date().toISOString(), demo: true, ...JSON.parse(JSON.stringify(rest)) };
    },
    lk_alle_leerlingen(db, { p_token }) {
      leerkracht(db, p_token);
      return db.leerlingen.slice().sort((a, b) => (a.klas + a.naam + a.voornaam).localeCompare(b.klas + b.naam + b.voornaam))
        .map(l => ({ id: l.id, gebruikersnaam: l.gebruikersnaam, voornaam: l.voornaam, naam: l.naam, klas: l.klas, actief: l.actief, aangemaakt: l.aangemaakt, laatst_actief: l.laatst_actief, programmas: db.inschrijvingen.filter(i => i.ll === l.id).map(i => i.prog) }));
    },
    lk_overzicht(db, { p_token, p_programma }) {
      leerkracht(db, p_token);
      const ids = new Set(db.inschrijvingen.filter(i => i.prog === p_programma).map(i => i.ll));
      const ll = db.leerlingen.filter(l => ids.has(l.id)).sort((a, b) => (a.klas + a.naam + a.voornaam).localeCompare(b.klas + b.naam + b.voornaam));
      const pr = db.programmas.find(x => x.code === p_programma);
      return { drempel: pr ? pr.drempel : 80, leerlingen: ll.map(l => ({ id: l.id, gebruikersnaam: l.gebruikersnaam, voornaam: l.voornaam, naam: l.naam, klas: l.klas, actief: l.actief, aangemaakt: l.aangemaakt, laatst_actief: l.laatst_actief, status: status(db, l.id, p_programma) })) };
    },
    lk_leerling(db, { p_token, p_id, p_programma }) {
      leerkracht(db, p_token);
      const l = db.leerlingen.find(l => l.id === p_id); if (!l) fout('ONBEKEND');
      const oef = db.oefeningen.filter(o => o.ll === p_id && o.prog === p_programma);
      const soort = {}, dag = {};
      oef.forEach(o => {
        const k = o.deel + '|' + o.soort; soort[k] ??= { deel: o.deel, soort: o.soort, aantal: 0, juist: 0 }; soort[k].aantal++; if (o.juist) soort[k].juist++;
        const d = new Date(o.tijd).toLocaleDateString('sv-SE') + '|' + o.deel; dag[d] ??= { dag: d.split('|')[0], deel: o.deel, aantal: 0, juist: 0 }; dag[d].aantal++; if (o.juist) dag[d].juist++;
      });
      return {
        leerling: { id: l.id, gebruikersnaam: l.gebruikersnaam, voornaam: l.voornaam, naam: l.naam, klas: l.klas, actief: l.actief, aangemaakt: l.aangemaakt, laatst_actief: l.laatst_actief, programmas: db.inschrijvingen.filter(i => i.ll === l.id).map(i => i.prog) },
        status: status(db, p_id, p_programma),
        testen: db.testen.filter(t => t.ll === p_id && t.prog === p_programma).map(({ ll, prog, ...t }) => ({ ...t, programma: prog })),
        per_soort: Object.values(soort), per_dag: Object.values(dag),
        recent: oef.slice(-500).map(o => ({ deel: o.deel, soort: o.soort, juist: o.juist, tijd: o.tijd })),
      };
    },
    lk_instaptoets(db, { p_token, p_programma }) {
      leerkracht(db, p_token);
      return db.testen.filter(t => t.prog === p_programma && t.status === 'ingediend').sort((a, b) => String(a.ingediend).localeCompare(String(b.ingediend)))
        .map(t => ({ leerling: t.ll, id: t.id, score: t.score, max: t.max_score, geslaagd: t.geslaagd, gestart: t.gestart, ingediend: t.ingediend,
          items: t.vragen.map((v, k) => ({ d: v.domein, n: v.niveau, j: !!((t.antwoorden || [])[k] || {}).juist })) }));
    },
    lk_test_heropenen(db, { p_token, p_id, p_programma, p_deel }) {
      leerkracht(db, p_token);
      const gebruikt = db.testen.filter(t => t.ll === p_id && t.prog === p_programma && t.deel === p_deel).length;
      const t = toegang(db, p_id, p_programma, p_deel); t.pogingen = Math.max(t.pogingen, gebruikt + 1);
      return status(db, p_id, p_programma);
    },
    lk_test_annuleren(db, { p_token, p_test }) { leerkracht(db, p_token); db.testen = db.testen.filter(t => !(t.id === p_test && t.status === 'bezig')); },
    lk_deel_vrijgeven(db, { p_token, p_id, p_programma, p_deel, p_aan }) {
      leerkracht(db, p_token); toegang(db, p_id, p_programma, p_deel).vrijgegeven = !!p_aan; return status(db, p_id, p_programma);
    },
    lk_wachtwoord_reset(db, { p_token, p_id }) {
      leerkracht(db, p_token); const l = db.leerlingen.find(l => l.id === p_id); l.pw = wachtwoord();
      db.sessies = db.sessies.filter(s => s.ll !== p_id); return { wachtwoord: l.pw };
    },
    lk_leerling_bewerken(db, { p_token, p_id, p_voornaam, p_naam, p_klas }) {
      leerkracht(db, p_token); if (!String(p_voornaam || '').trim()) fout('VOORNAAM_NODIG');
      Object.assign(db.leerlingen.find(l => l.id === p_id), { voornaam: p_voornaam.trim(), naam: (p_naam || '').trim(), klas: (p_klas || '').trim() });
    },
    lk_leerling_wijzigen(db, { p_token, p_id, p_actief, p_verwijderen }) {
      leerkracht(db, p_token);
      if (p_verwijderen) {
        db.leerlingen = db.leerlingen.filter(l => l.id !== p_id);
        ['oefeningen', 'testen', 'toegang', 'inschrijvingen'].forEach(k => db[k] = db[k].filter(x => x.ll !== p_id));
      } else { db.leerlingen.find(l => l.id === p_id).actief = !!p_actief; }
      db.sessies = db.sessies.filter(s => s.ll !== p_id || p_actief);
    },
  };

  async function call(fn, params) {
    const db = laad();
    if (!F[fn]) fout('ONBEKENDE_FUNCTIE');
    const r = F[fn](db, JSONX.parse(JSONX.stringify(params)));
    bewaar();
    return r === undefined ? null : JSONX.parse(JSONX.stringify(r));
  }
  function wis() { geheugen = nieuw(); bewaar(); }
  return { call, wis };
})();
