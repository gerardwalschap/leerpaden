// Spellen (7VJHO) — register van de oefenspellen die in de map spellen/ staan.
// Een spel is voor de databank een "programma" (code spel-…): de leerkracht koppelt leerlingen
// eraan zoals aan een leerpad. Het spel zelf bewaart zijn toestand via spellen/spel-volg.js in de
// databank (per leerling) en houdt de actieve speeltijd bij.
// voortgang(staat): staat = { localStorage-sleutel: tekst } van het spel → { tekst, pct (0–100) }.
const Spellen = (() => {
  const lees = (st, k, d) => { try { const v = st && st[k]; return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const RES = '__spelvolg_resultaten'; // door spel-volg.js bijgehouden lijst van afgewerkte rondes
  const rondes = (st) => lees(st, RES, []);
  const procent = (j, n) => n ? Math.round(100 * j / n) : 0;

  // Oefenarena: per ronde { juist, totaal, per: { onderdeel: { ok, tot } } }
  function arena(st, nOnderdelen) {
    const r = rondes(st);
    if (!r.length) return { tekst: 'nog geen ronde afgewerkt', pct: 0 };
    const j = r.reduce((a, x) => a + (x.juist || 0), 0), n = r.reduce((a, x) => a + (x.totaal || 0), 0);
    const geoefend = new Set(r.flatMap(x => Object.keys(x.per || {}).filter(k => x.per[k].tot)));
    const laatste = r[r.length - 1];
    return { tekst: `${r.length} ronde${r.length === 1 ? '' : 's'} · ${n} vragen · ${procent(j, n)}% juist · ${geoefend.size}/${nOnderdelen} onderdelen geoefend · laatste ronde ${laatste.juist}/${laatste.totaal}`,
      pct: Math.round(100 * geoefend.size / nOnderdelen) };
  }
  function expeditie(st, sleutel, n) {
    const S = lees(st, sleutel, null);
    if (!S || !S.runs) return { tekst: 'nog niet gestart', pct: 0 };
    const best = Math.min(S.best || 0, n);
    return { tekst: `${best === n ? `volledige expeditie voltooid (${S.wins}×) 🏆` : best ? `verste deel: ${best}/${n}` : 'nog geen deel gehaald'} · ${S.runs} poging${S.runs === 1 ? '' : 'en'}`,
      pct: Math.round(100 * best / n) };
  }

  const lijst = [
    { code: 'spel-codekraker', map: 'codekraker', titel: 'Codekraker ℕ', sub: 'Kraak de kluis · rekenen in ℕ', icoon: '🔐',
      voortgang(st) {
        const S = lees(st, 'codekraker-n-v1', null), zalen = ['A', 'B', 'C', 'D', 'E', 'K'];
        if (!S) return { tekst: 'nog niet gestart', pct: 0 };
        const R = S.rooms || {}, af = zalen.filter(z => R[z] && R[z].stars), sterren = zalen.reduce((a, z) => a + ((R[z] && R[z].stars) || 0), 0);
        return { tekst: `${af.length}/6 zalen · ${sterren}/18 ★${R.K && R.K.stars ? ' · kluis gekraakt 🏆' : ''}`, pct: Math.round(100 * af.length / 6) };
      } },
    { code: 'spel-getallenshow-n', map: 'getallenshow-n', titel: 'Getallenshow ℕ', sub: 'Quizshow met 5 rubrieken over ℕ', icoon: '🎤',
      voortgang(st) {
        const S = lees(st, 'getallenshow-n-v1', null);
        if (!S) return { tekst: 'nog niet gestart', pct: 0 };
        const stats = Object.values(S.stats || {}).filter(x => x && x.n), n = stats.reduce((a, x) => a + x.n, 0), j = stats.reduce((a, x) => a + x.ok, 0);
        if (!n) return { tekst: 'nog geen vraag beantwoord', pct: 0 };
        return { tekst: `${S.shows || 0} show${S.shows === 1 ? '' : 's'} · record ${S.best || 0} punten · ${stats.length}/5 rubrieken · ${n} vragen, ${procent(j, n)}% juist`,
          pct: Math.round(100 * stats.length / 5) };
      } },
    { code: 'spel-expeditie-z', map: 'expeditie-z', titel: 'Expeditie ℤ', sub: 'Verken eiland ℤ · 12 zones', icoon: '🏝️',
      voortgang(st) {
        const S = lees(st, 'expeditie-z-v1', null);
        if (!S) return { tekst: 'nog niet gestart', pct: 0 };
        const Z = S.zones || {}, ids = Array.from({ length: 12 }, (_, i) => i + 1);
        const af = ids.filter(i => Z[i] && Z[i].stars).length, sterren = ids.reduce((a, i) => a + ((Z[i] && Z[i].stars) || 0), 0);
        return { tekst: `${af}/12 zones · ${sterren}/36 ★ · ${S.coins || 0} munten${af === 12 ? ' 🏆' : ''}`, pct: Math.round(100 * af / 12) };
      } },
    { code: 'spel-getallenshow', map: 'getallenshow', titel: 'Getallenshow ℤ', sub: 'Quizshow met 17 rubrieken over ℕ en ℤ', icoon: '🎤',
      voortgang(st) {
        const S = lees(st, 'getallenshow-v1', null);
        if (!S) return { tekst: 'nog niet gestart', pct: 0 };
        const stats = Object.values(S.stats || {}).filter(x => x && x.n), n = stats.reduce((a, x) => a + x.n, 0), j = stats.reduce((a, x) => a + x.ok, 0);
        if (!n) return { tekst: 'nog geen vraag beantwoord', pct: 0 };
        return { tekst: `${S.shows || 0} show${S.shows === 1 ? '' : 's'} · record ${S.best || 0} punten · ${stats.length}/17 rubrieken · ${n} vragen, ${procent(j, n)}% juist`,
          pct: Math.round(100 * stats.length / 17) };
      } },
    { code: 'spel-expeditie-q', map: 'expeditie-q', titel: 'Expeditie ℚ', sub: '13 delen in één tocht', icoon: '🧭',
      voortgang: (st) => expeditie(st, 'expeditie-q-v1', 13) },
    { code: 'spel-oefenarena-q', map: 'oefenarena-q', titel: 'Oefenarena ℚ', sub: 'Zelf onderdelen kiezen en oefenen', icoon: '🏋️',
      voortgang: (st) => arena(st, 13) },
    { code: 'spel-expeditie-r', map: 'expeditie-r', titel: 'Expeditie ℝ', sub: '10 delen in één tocht', icoon: '⛰️',
      voortgang: (st) => expeditie(st, 'expeditie-r-v1', 10) },
    { code: 'spel-oefenarena-r', map: 'oefenarena-r', titel: 'Oefenarena ℝ', sub: 'Zelf onderdelen kiezen en oefenen', icoon: '🏋️',
      voortgang: (st) => arena(st, 10) },
    // +-versie ℕ (gevorderden): vragen rechtstreeks uit het leerpad Rekenen in ℕ + (spellen/plus-motor.js)
    { code: 'spel-expeditie-n-plus', map: 'expeditie-n-plus', titel: 'Expeditie ℕ +', sub: '6 delen in één tocht · gevorderden', icoon: '🏔️',
      voortgang: (st) => expeditie(st, 'expeditie-n-plus-v1', 6) },
    { code: 'spel-oefenarena-n-plus', map: 'oefenarena-n-plus', titel: 'Oefenarena ℕ +', sub: 'Zelf delen kiezen · gevorderden', icoon: '💪',
      voortgang: (st) => arena(st, 6) },
    // +-versie ℤ (gevorderden): vragen rechtstreeks uit het leerpad Rekenen in ℤ + (spellen/plus-motor.js)
    { code: 'spel-expeditie-z-plus', map: 'expeditie-z-plus', titel: 'Expeditie ℤ +', sub: '10 delen in één tocht · gevorderden', icoon: '🏔️',
      voortgang: (st) => expeditie(st, 'expeditie-z-plus-v1', 10) },
    { code: 'spel-oefenarena-z-plus', map: 'oefenarena-z-plus', titel: 'Oefenarena ℤ +', sub: 'Zelf delen kiezen · gevorderden', icoon: '💪',
      voortgang: (st) => arena(st, 10) },
    // +-versie ℚ (gevorderden): vragen rechtstreeks uit het leerpad Rekenen in ℚ + (spellen/plus-motor.js)
    { code: 'spel-expeditie-q-plus', map: 'expeditie-q-plus', titel: 'Expeditie ℚ +', sub: '13 delen in één tocht · gevorderden', icoon: '🏔️',
      voortgang: (st) => expeditie(st, 'expeditie-q-plus-v1', 13) },
    { code: 'spel-oefenarena-q-plus', map: 'oefenarena-q-plus', titel: 'Oefenarena ℚ +', sub: 'Zelf delen kiezen · gevorderden', icoon: '💪',
      voortgang: (st) => arena(st, 13) },
    // +-versie ℝ (gevorderden): vragen rechtstreeks uit het leerpad Rekenen in ℝ + (spellen/plus-motor.js)
    { code: 'spel-expeditie-r-plus', map: 'expeditie-r-plus', titel: 'Expeditie ℝ +', sub: '10 delen in één tocht · gevorderden', icoon: '🏔️',
      voortgang: (st) => expeditie(st, 'expeditie-r-plus-v1', 10) },
    { code: 'spel-oefenarena-r-plus', map: 'oefenarena-r-plus', titel: 'Oefenarena ℝ +', sub: 'Zelf delen kiezen · gevorderden', icoon: '💪',
      voortgang: (st) => arena(st, 10) },
    // Grafiekdetective: hoort bij het 5de jaar, komt later in een andere klas (map spellen/grafiekdetective blijft staan).
    /*
    { code: 'spel-grafiekdetective', map: 'grafiekdetective', titel: 'Grafiekdetective', sub: 'Grafieken lezen en interpreteren', icoon: '🔎',
      voortgang(st) {
        const r = rondes(st), best = +(st && st['gd-best']) || 0;
        if (!r.length) return { tekst: best ? `record ${best} punten` : 'nog geen onderzoek afgewerkt', pct: 0 };
        const j = r.reduce((a, x) => a + (x.juist || 0), 0), n = r.reduce((a, x) => a + (x.totaal || 0), 0), l = r[r.length - 1];
        return { tekst: `${r.length} onderzoek${r.length === 1 ? '' : 'en'} · record ${best} punten · ${procent(j, n)}% juist · laatste ${l.juist}/${l.totaal}`, pct: procent(j, n) };
      } },
    */
  ];
  const vind = (code) => lijst.find(s => s.code === code) || null;
  return { lijst, vind, RES };
})();
