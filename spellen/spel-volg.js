// spel-volg.js — koppelt een spel aan de leerpaden (aanmelding, voortgang en speeltijd).
// Wordt in elk spel geladen vóór het eigen script van het spel, na config.js, api.js, demo.js en spellen.js.
//
// * Het spel bewaart zijn toestand zoals altijd in localStorage. Hier wordt localStorage voor het spel
//   omgeleid naar een eigen opslag per leerling: die komt uit de databank (via de leerlingenpagina,
//   die ze in sessionStorage zet) en gaat bij elke wijziging terug naar de databank.
//   Zo zit elke leerling op zijn eigen voortgang, ook op een gedeelde pc, en blijft de vrije versie
//   van het spel (zelfde website) ongemoeid.
// * Speeltijd: enkel tijd waarin het spel zichtbaar is én de leerling iets doet (klik, toets, scroll).
//   Twee minuten niets gedaan = de klok staat stil.
(() => {
  // Vrije link (…/?vrij=1): iedereen mag spelen zonder aanmelding; voortgang enkel in de eigen browser, niets naar de databank.
  if (/[?&]vrij=1\b/.test(location.search)) return;
  const delen = location.pathname.split('/').filter(Boolean);
  if (/\.html?$/.test(delen[delen.length - 1] || '')) delen.pop();
  const map = delen[delen.length - 1];
  const SP = Spellen.lijst.find(s => s.map === map);
  if (!SP) { console.warn('spel-volg: onbekend spel', map); return; }
  const code = SP.code;
  const SLEUTEL = 'spel-staat:' + code;
  const IDLE = 120000, TIK = 5, STUUR = 30;

  const ses = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* niets */ } },
  };
  const token = ses.get('ll-token');
  const terug = ses.get('spel-terug') || new URL('../../index.html', location.href).href;
  let V = {}, vandaag = +(ses.get('spel-vandaag:' + code) || 0), naam = ses.get('spel-naam') || '', afgemeld = false;
  let wacht = false; // true zolang de toestand nog uit de databank komt
  const bewaard = ses.get(SLEUTEL);
  try { V = bewaard ? JSON.parse(bewaard) || {} : {}; } catch (e) { V = {}; }

  // ---------- localStorage omleiden (enkel de sleutels van het spel, niet die van de leerpaden zelf)
  let LS = null; try { LS = window.localStorage; } catch (e) { /* geblokkeerd */ }
  const eigen = (k) => !String(k).startsWith('leerpaden-');
  const P = Storage.prototype, echt = { get: P.getItem, set: P.setItem, del: P.removeItem };
  let vuil = false, sec = 0, laatsteActie = Date.now(), sTimer = null;
  const lokaal = () => ses.set(SLEUTEL, JSON.stringify(V));
  const gewijzigd = () => { vuil = true; lokaal(); clearTimeout(sTimer); sTimer = setTimeout(() => stuur(false), 4000); };
  P.getItem = function (k) { return (this === LS && eigen(k)) ? (Object.prototype.hasOwnProperty.call(V, k) ? V[k] : null) : echt.get.call(this, k); };
  P.setItem = function (k, v) { if (this === LS && eigen(k)) { v = String(v); if (V[k] !== v) { V[k] = v; gewijzigd(); } return; } return echt.set.call(this, k, v); };
  P.removeItem = function (k) { if (this === LS && eigen(k)) { if (k in V) { delete V[k]; gewijzigd(); } return; } return echt.del.call(this, k); };

  // ---------- naar de databank
  function samenvatting() { try { return SP.voortgang(V); } catch (e) { return { tekst: '?', pct: 0 }; } }
  function rpcUrl() { return `${CONFIG.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/ll_spel_bewaar`; }
  function koppen() {
    return Object.assign({ 'Content-Type': 'application/json', apikey: CONFIG.SUPABASE_ANON_KEY },
      String(CONFIG.SUPABASE_ANON_KEY).startsWith('eyJ') ? { Authorization: 'Bearer ' + CONFIG.SUPABASE_ANON_KEY } : {});
  }
  let bezig = false;
  async function stuur(bijAfsluiten) {
    if (!token || afgemeld || wacht) return;
    const s = sec, metStaat = vuil;
    if (!s && !metStaat) return;
    if (bezig && !bijAfsluiten) return;
    sec = 0; vuil = false;
    const params = { p_token: token, p_spel: code, p_seconden: s, p_staat: metStaat ? V : null, p_samenvatting: metStaat ? samenvatting() : null };
    if (bijAfsluiten && !API.DEMO) { // pagina gaat dicht: fetch met keepalive overleeft het sluiten
      const body = JSON.stringify(params);
      try { fetch(rpcUrl(), { method: 'POST', headers: koppen(), body, keepalive: body.length < 60000 }); } catch (e) { /* niets */ }
      return;
    }
    bezig = true;
    try { await API.call('ll_spel_bewaar', params); vandaag += s; badge(); }
    catch (e) {
      sec += s; if (metStaat) vuil = true;
      if (e.code === 'SESSIE_VERLOPEN' || e.code === 'NIET_INGESCHREVEN') toonAfgemeld(e.message);
    }
    bezig = false;
  }

  // ---------- speeltijd
  const actief = () => document.visibilityState === 'visible' && Date.now() - laatsteActie < IDLE;
  ['pointerdown', 'keydown', 'wheel', 'touchstart', 'input'].forEach(t => addEventListener(t, () => { laatsteActie = Date.now(); }, { capture: true, passive: true }));
  let beweeg = 0;
  addEventListener('pointermove', () => { const n = Date.now(); if (n - beweeg > 3000) { beweeg = n; laatsteActie = n; } }, { capture: true, passive: true });
  let tel = 0;
  setInterval(() => {
    if (!token || afgemeld) return;
    if (actief()) { sec += TIK; badge(); }
    if (++tel % (STUUR / TIK) === 0) stuur(false);
  }, TIK * 1000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') stuur(true); else laatsteActie = Date.now(); });
  addEventListener('pagehide', () => stuur(true));

  // ---------- afgewerkte rondes (oefenarena, grafiekdetective): het spel roept SpelVolg.resultaat({...}) op
  function resultaat(r) {
    let lijst = []; try { lijst = JSON.parse(V[Spellen.RES] || '[]'); } catch (e) { lijst = []; }
    lijst.push(Object.assign({ t: new Date().toISOString() }, r));
    V[Spellen.RES] = JSON.stringify(lijst.slice(-200));
    gewijzigd(); clearTimeout(sTimer); stuur(false);
  }
  window.SpelVolg = { resultaat, code };

  // ---------- balkje met naam, speeltijd en terugknop
  const stijl = `#spelvolg{position:fixed;left:10px;bottom:10px;z-index:2147483000;display:flex;gap:8px;align-items:center;
      font:600 13px/1.2 system-ui,Segoe UI,Arial,sans-serif;background:rgba(20,40,70,.88);color:#fff;border-radius:999px;padding:6px 8px 6px 12px;box-shadow:0 2px 8px rgba(0,0,0,.25)}
    #spelvolg a{color:#fff;background:#e8731a;border-radius:999px;padding:4px 10px;text-decoration:none}
    #spelvolg-dek{position:fixed;inset:0;z-index:2147483001;background:rgba(10,20,40,.82);display:flex;align-items:center;justify-content:center;font:16px/1.4 system-ui,Segoe UI,Arial,sans-serif}
    #spelvolg-dek div{background:#fff;color:#1c2b3a;border-radius:14px;padding:24px 28px;max-width:420px;text-align:center}
    #spelvolg-dek a{display:inline-block;margin-top:12px;background:#1c4e8a;color:#fff;border-radius:8px;padding:8px 16px;text-decoration:none;font-weight:700}`;
  const minuten = (s) => s < 60 ? '< 1 min' : Math.floor(s / 60) + ' min';
  function badge() {
    const b = document.getElementById('spelvolg'); if (!b) return;
    b.querySelector('.t').textContent = `${naam ? naam + ' · ' : ''}⏱ vandaag ${minuten(vandaag + sec)}`;
  }
  async function naarLeerpaden(e) {
    e.preventDefault(); clearTimeout(sTimer);
    await Promise.race([stuur(false), new Promise(r => setTimeout(r, 1500))]);
    location.href = terug;
  }
  function dek(html) {
    const d = document.createElement('div'); d.id = 'spelvolg-dek'; d.innerHTML = `<div>${html}<br><a href="${terug}">Naar de leerpaden</a></div>`;
    document.body.appendChild(d);
  }
  function toonAfgemeld(msg) {
    if (afgemeld) return; afgemeld = true;
    dek(`<b>${msg || 'Je bent afgemeld.'}</b><br>Je voortgang wordt nu niet bewaard. Meld je opnieuw aan via de leerpaden.`);
  }
  function opbouw() {
    const s = document.createElement('style'); s.textContent = stijl; document.head.appendChild(s);
    if (!token && /[?&]bekijk=1/.test(location.search)) { // leerkracht bekijkt het spel
      const v = document.createElement('div'); v.id = 'spelvolg'; v.innerHTML = '<span class="t">👀 Voorbeeld voor de leerkracht · er wordt niets bewaard</span>';
      return document.body.appendChild(v);
    }
    if (!token) return dek('<b>Meld je eerst aan.</b><br>Dit spel speel je via de leerpaden, zodat je voortgang en speeltijd bewaard worden.');
    const b = document.createElement('div'); b.id = 'spelvolg';
    b.innerHTML = `<span class="t"></span><a href="${terug}">← Leerpaden</a>`;
    b.querySelector('a').onclick = naarLeerpaden;
    document.body.appendChild(b); badge();
  }
  if (document.body) opbouw(); else document.addEventListener('DOMContentLoaded', opbouw);

  // Spel rechtstreeks geopend (bv. herladen in een nieuw tabblad) zonder toestand: eerst ophalen, dan herladen.
  if (token && bewaard === null) {
    wacht = true;
    API.call('ll_spel_start', { p_token: token, p_spel: code }).then(r => {
      ses.set(SLEUTEL, JSON.stringify((r && r.staat) || {})); ses.set('spel-vandaag:' + code, String((r && r.vandaag) || 0));
      if (r && r.staat && Object.keys(r.staat).length) return location.reload();
      wacht = false;
    }).catch(e => { wacht = false; toonAfgemeld(e.message); });
  }
})();
