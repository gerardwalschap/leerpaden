// Galaxie ℝ — vragen. ALLE opgaven komen rechtstreeks uit de leerpaden (programmas/…):
// dezelfde soorten oefeningen, getallen en uitleg als in het leerpad. Hier worden ze enkel
// omgezet naar "uitdagingen" voor het spel:
//   ast   : asteroïden met antwoorden — schiet het juiste antwoord
//   poort : een wand met poorten (<, >, =, recht/omgekeerd …) — vlieg door de juiste poort
//   set   : getallen-asteroïden — schiet ALLE oplossingen en geen enkele andere
//   baas  : (eindbaas) per schildlaag de juiste volgende stap van een berekening
const Vragen = (() => {
  const { rnd, kies, schud } = W;
  // Stelsels: per stelsel het leerpad (normaal en +) — later aan te vullen met ℤ, ℚ en ℝ.
  const STELSELS = [
    { id: 'N', teken: 'ℕ', naam: 'Stelsel ℕ', sub: 'De natuurlijke getallen', kleur: '#38e1ff', lp: { normaal: 'getallenleer-n', plus: 'getallenleer-n-plus' } },
    { id: 'Z', teken: 'ℤ', naam: 'Stelsel ℤ', sub: 'De gehele getallen', kleur: '#ff6b8a', lp: null },
    { id: 'Q', teken: 'ℚ', naam: 'Stelsel ℚ', sub: 'De rationale getallen', kleur: '#ffc547', lp: null },
    { id: 'R', teken: 'ℝ', naam: 'Stelsel ℝ', sub: 'De reële getallen', kleur: '#b48cff', lp: null },
  ];
  const leerpad = (st, modus) => st.lp && Leerpaden.vind(st.lp[modus]);

  // TeX → tekst voor op een asteroïde (√, ², log₂ …)
  const plat = (t) => W.platteTekst(String(t).replace(/\\dfrac/g, '\\frac')).replace(/\s+/g, ' ').trim();
  const fmt = (x) => W.komma(x);

  // ---- foute antwoorden die op typische fouten lijken
  function fouteGetallen(w, n = 3, negatiefOk = false) {
    const geheel = Number.isInteger(w), c = new Set();
    const kand = geheel
      ? [w + 1, w - 1, w + 2, w - 2, w + 10, w - 10, w * 2, Math.round(w / 2), +String(Math.abs(w)).split('').reverse().join('') * Math.sign(w || 1), w + 4, w - 4, w * 10, w + 100]
      : [w + 1, w - 1, w * 10, w / 10, W.rond(w + 0.1, 3), W.rond(w - 0.1, 3), W.rond(w * 2, 3)];
    for (const k of schud(kand)) {
      if (k === w || !isFinite(k) || (!negatiefOk && k < 0)) continue;
      c.add(fmt(k)); if (c.size >= n) break;
    }
    let extra = 1; while (c.size < n) { c.add(fmt(w + 3 * extra++)); c.delete(fmt(w)); }
    return [...c];
  }
  // Variant van een tekst (bv. "7a + 3b" of "8² − 2³") met één getal veranderd.
  function fouteTeksten(s, n = 3) {
    const c = new Set(), toks = [...s.matchAll(/\d+(,\d+)?/g)];
    for (let p = 0; p < 60 && c.size < n; p++) {
      let v = s;
      if (toks.length) {
        const t = kies(toks), getalT = +t[0].replace(',', '.');
        const nieuw = kies([getalT + 1, getalT - 1, getalT + 2, getalT * 2, getalT + 10, Math.max(0, getalT - 2)]);
        if (nieuw < 0 || nieuw === getalT) continue;
        v = s.slice(0, t.index) + fmt(nieuw) + s.slice(t.index + t[0].length);
      } else v = s.includes('+') ? s.replace('+', '−') : s + ' + 1';
      if (v !== s) c.add(v);
    }
    return [...c];
  }

  // Leerpad-vraag v → lijst uitdagingen (of null als het spel deze soort niet kan tonen)
  function omzetten(v, a = v.antw) {
    if (!a) return null;
    if (a.soort === 'getal') {
      if (typeof a.waarde !== 'number') return null;
      return [{ type: 'ast', juist: fmt(a.waarde), fout: fouteGetallen(a.waarde) }];
    }
    if (a.soort === 'veelterm') { const j = plat(a.tex); return [{ type: 'ast', juist: j, fout: fouteTeksten(j) }]; }
    if (a.soort === 'keuze') {
      const opties = a.opties.map(o => plat(o.l)), i = a.opties.findIndex(o => String(o.k) === String(a.juist));
      if (i < 0 || opties.length < 2 || opties.length > 4) return null;
      return [{ type: 'poort', opties, juist: i }];
    }
    if (a.soort === 'Vmeer') {
      if (!a.waarden || !a.waarden.length || a.waarden.length > 8) return null;
      return [{ type: 'set', leden: a.waarden.slice() }];
    }
    if (a.soort === 'delen') {
      const uit = [];
      for (const d of a.delen) { const u = omzetten(v, d.antw); if (!u) return null; uit.push(...u.map(x => ({ ...x, label: plat(d.label || '') }))); }
      return uit;
    }
    return null;
  }

  // Een opgave uit deel d van het leerpad (met recente opgaven vermeden)
  const recent = [];
  function opgave(d) {
    for (let p = 0; p < 60; p++) {
      const v = d.soorten[W.gewogen(d.oefenMix)].gen(), sl = v.sleutel || v.tex || v.html;
      if (recent.includes(sl) && p < 30) continue;
      const u = omzetten(v); if (!u) continue;
      recent.push(sl); if (recent.length > 40) recent.shift();
      return { v, uitdagingen: u, opdracht: v.opdracht || d.opdracht || 'Bereken.' };
    }
    return null;
  }

  // Eindbaas: een berekening uit deel 1 (volgorde van de bewerkingen) met tussenstappen.
  function baasOpgave(P) {
    const d = P.delen[0];
    for (let p = 0; p < 80; p++) {
      const v = d.soorten[W.gewogen(d.oefenMix)].gen();
      if (!v.antw || v.antw.soort !== 'getal' || !v.tex) continue;
      const stappen = [].concat(v.uitleg || []).filter(s => typeof s === 'string' && /^\s*=/.test(s) && !/\\text|\\begin|&/.test(s))
        .map(s => plat(s.replace(/^\s*=/, '').split('\\quad')[0])).filter(Boolean);
      if (stappen.length < 2 || stappen.length > 5) continue;
      if (stappen[stappen.length - 1] !== fmt(v.antw.waarde)) stappen.push(fmt(v.antw.waarde));
      return { v, tex: v.tex.replace(/=\s*\\;\?\s*$/, ''), stappen: stappen.map((s, i) => ({ juist: s, fout: /^\d+(,\d+)?$/.test(s) ? fouteGetallen(+s.replace(',', '.')) : fouteTeksten(s) })) };
    }
    return null;
  }

  return { STELSELS, leerpad, opgave, baasOpgave, plat };
})();
