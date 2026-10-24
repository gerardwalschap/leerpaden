// Verbinding met de databank (Supabase). Zonder SUPABASE_URL draait alles in demo-modus in de browser.
const API = (() => {
  const DEMO = !(window.CONFIG && CONFIG.SUPABASE_URL);

  const FOUTEN = {
    FOUTE_LOGIN: 'Gebruikersnaam of wachtwoord klopt niet.',
    SESSIE_VERLOPEN: 'Je bent afgemeld. Meld je opnieuw aan.',
    NIET_INGESCHREVEN: 'Je bent (nog) niet gekoppeld aan dit leerpad. Vraag het aan je leerkracht.',
    DEEL_GESLOTEN: 'Dit deel is nog niet open.',
    AL_GESLAAGD: 'Je bent al geslaagd voor deze test.',
    GEEN_POGINGEN: 'Je hebt deze test al gemaakt. Enkel je leerkracht kan hem opnieuw openzetten.',
    AL_INGEDIEND: 'Deze test is al ingediend.',
    ONBEKEND_PROGRAMMA: 'Dit programma bestaat nog niet in de databank. Meld je opnieuw aan als leerkracht.',
    ONGELDIGE_DREMPEL: 'Kies een slaagdrempel tussen 1 en 100.',
    VOORNAAM_NODIG: 'Vul minstens een voornaam in.',
    NETWERK: 'Geen verbinding met de server. Controleer je internet en probeer opnieuw.',
  };

  class Fout extends Error {
    constructor(code) { super(FOUTEN[code] || code); this.code = code; }
  }

  async function call(fn, params = {}) {
    if (DEMO) {
      try { return await Demo.call(fn, params); }
      catch (e) { throw new Fout(e.message); }
    }
    let r;
    try {
      r = await fetch(`${CONFIG.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        // nieuwe 'sb_publishable_'-sleutels gaan enkel in de apikey-header; oude JWT-sleutels ook als Bearer
        headers: Object.assign({ 'Content-Type': 'application/json', apikey: CONFIG.SUPABASE_ANON_KEY },
          String(CONFIG.SUPABASE_ANON_KEY).startsWith('eyJ') ? { Authorization: 'Bearer ' + CONFIG.SUPABASE_ANON_KEY } : {}),
        body: JSON.stringify(params),
      });
    } catch (e) { throw new Fout('NETWERK'); }
    const txt = await r.text();
    let data = null;
    try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
    if (!r.ok) throw new Fout((data && data.message) || 'NETWERK');
    return data;
  }

  // Kleine opslag die nooit crasht (privévenster, geblokkeerde opslag, …)
  const mem = {};
  const sessie = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return mem[k] ?? null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) { delete mem[k]; } },
  };

  return { call, DEMO, Fout, sessie };
})();

// Register van de programma's (leerpaden). Elk programmabestand roept Leerpaden.registreer({...}) op.
const Leerpaden = (() => {
  const lijst = [];
  function registreer(p) {
    if (!/^[a-z0-9-]{2,40}$/.test(p.code)) throw new Error('Ongeldige programmacode: ' + p.code);
    p.delen.forEach(d => { d.klaar = d.klaar !== false; });
    lijst.push(p);
  }
  const vind = (code) => lijst.find(p => p.code === code) || null;

  // Unieke reeks testvragen volgens de samenstelling van het deel.
  // De vragen staan in de volgorde van de samenstelling (van eenvoudig naar moeilijker);
  // met 'testSchudden: true' worden ze door elkaar gezet.
  function maakTest(deel) {
    const vragen = [], gezien = new Set();
    for (const [soort, aantal] of deel.test) {
      let n = 0, pogingen = 0;
      while (n < aantal && pogingen++ < 500) {
        const v = deel.soorten[soort].gen();
        const sleutel = v.sleutel || v.tex || v.html;
        if (gezien.has(sleutel)) continue;
        gezien.add(sleutel); vragen.push(v); n++;
      }
    }
    return deel.testSchudden ? W.schud(vragen) : vragen;
  }
  return { registreer, vind, lijst, maakTest };
})();
