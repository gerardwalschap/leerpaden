// Rekenkern voor oplossingsverzamelingen in ℝ: intervallen, unies, ℝ, ∅, ℝ \ {a} en {a}.
// Leest bv.  ]−∞, 2[ ∪ ]3, +∞[  ·  [−1 ; 3]  ·  ℝ  ·  R \ {3}  ·  ∅  ·  {3}
// Een verzameling = lijst stukken {a, ai, b, bi} (a/b = −∞/+∞ als getal Infinity), genormaliseerd (gesorteerd, samengevoegd).
const VZ = (() => {
  class Fout extends Error {}
  const norm = (s) => String(s ?? '')
    .replace(/[−–—]/g, '-').replace(/∞|oneindig|inf\b|oo/gi, '∞').replace(/ℝ/g, 'R').replace(/⁺|₊/g, '+').replace(/⁻|₋/g, '-').replace(/[Øø∅]|\{\s*\}/g, '∅')
    .replace(/\s+/g, ' ').replace(/^\s*V\s*=\s*/i, '').trim();

  function getal(t) {
    t = t.replace(/\s+/g, '');
    if (/^-∞$/.test(t)) return -Infinity;
    if (/^\+?∞$/.test(t)) return Infinity;
    const g = Invoer.getal(t);
    if (!g.ok) throw new Fout(`Het getal "${t}" kan ik niet lezen.`);
    return g.waarde;
  }
  // splits "a , b" of "a ; b" in twee grenzen (een komma kan ook een decimaalteken zijn)
  function tweeGrenzen(binnen) {
    if (binnen.includes(';')) { const d = binnen.split(';'); if (d.length !== 2) throw new Fout('Een interval heeft twee grenzen.'); return [getal(d[0]), getal(d[1])]; }
    const opties = [];
    for (let i = 0; i < binnen.length; i++) if (binnen[i] === ',') {
      try { opties.push([getal(binnen.slice(0, i)), getal(binnen.slice(i + 1))]); } catch (e) { /* geen geldige splitsing */ }
    }
    if (opties.length === 1) return opties[0];
    if (opties.length > 1) throw new Fout('Ik weet niet welke komma de grenzen scheidt. Gebruik een puntkomma: [−2,5 ; 3[.');
    throw new Fout('Schrijf een interval met twee grenzen, bv. ]−1, 3].');
  }
  function stuk(s) {
    s = s.trim();
    if (!s) throw new Fout('Er ontbreekt een deel van je antwoord.');
    if (/x/i.test(s)) throw new Fout('Schrijf de oplossingsverzameling met intervallen, bv. ]−∞, 2[ ∪ ]3, +∞[.');
    if (/^R$/i.test(s)) return [{ a: -Infinity, ai: false, b: Infinity, bi: false }];
    if (/^R\s*\+$/i.test(s)) return [{ a: 0, ai: true, b: Infinity, bi: false }];
    if (/^R\s*-$/i.test(s)) return [{ a: -Infinity, ai: false, b: 0, bi: true }];
    if (s === '∅') return [];
    let m = s.match(/^R\s*\\\s*\{(.+)\}$/i);
    if (m) {
      const pts = m[1].split(';').map(getal).sort((p, q) => p - q);
      const uit = []; let a = -Infinity;
      for (const p of pts) { uit.push({ a, ai: false, b: p, bi: false }); a = p; }
      uit.push({ a, ai: false, b: Infinity, bi: false });
      return uit;
    }
    m = s.match(/^\{(.+)\}$/);
    if (m) return m[1].split(';').map(getal).map(p => ({ a: p, ai: true, b: p, bi: true }));
    m = s.match(/^([\[\]])(.+)([\[\]])$/);
    if (!m) throw new Fout('Begin en eindig een interval met een haakje: [ of ].');
    const [a, b] = tweeGrenzen(m[2]);
    if (a > b) throw new Fout('De kleinste grens staat links in een interval.');
    const ai = m[1] === '[', bi = m[3] === ']';
    const fouteOneindig = (a === -Infinity && ai) || (b === Infinity && bi);
    return [{ a, ai: a === -Infinity ? false : ai, b, bi: b === Infinity ? false : bi, fouteOneindig }];
  }
  function normaliseer(stukken) {
    const s = stukken.filter(x => x.a < x.b || (x.a === x.b && x.ai && x.bi)).map(x => ({ ...x })).sort((p, q) => p.a - q.a || (q.ai - p.ai));
    const uit = [];
    for (const x of s) {
      const l = uit[uit.length - 1];
      if (l && (x.a < l.b || (x.a === l.b && (l.bi || x.ai)))) {
        if (x.b > l.b || (x.b === l.b && x.bi)) { l.b = x.b; l.bi = x.bi; }
      } else uit.push({ a: x.a, ai: x.ai, b: x.b, bi: x.bi });
    }
    return uit;
  }
  function ontleed(invoer) {
    const s = norm(invoer);
    if (!s) return { ok: false, leeg: true, fout: 'Vul eerst een antwoord in.' };
    try {
      const delen = s.split(/∪|\bU\b|\bu\b|\bof\b/);
      let stukken = [], fouteOneindig = false;
      for (const d of delen) { const st = stuk(d); if (st.some(x => x.fouteOneindig)) fouteOneindig = true; stukken = stukken.concat(st); }
      return { ok: true, stukken: normaliseer(stukken), fouteOneindig, tex: texVan(stukken) };
    } catch (e) { return { ok: false, fout: e instanceof Fout ? e.message : 'Dit kan ik niet lezen. Typ bv. ]−∞, 2[ ∪ ]3, +∞[.' }; }
  }
  const tg = (x) => x === -Infinity ? '-\\infty' : x === Infinity ? '+\\infty' : W.texGetal(x);
  // TeX van een (genormaliseerde) verzameling, in de notatie van de cursus
  function texVan(st) {
    if (!st.length) return '\\varnothing';
    if (st.length === 1 && st[0].a === -Infinity && st[0].b === Infinity) return '\\mathbb{R}';
    if (st.every(x => x.a === x.b)) return `\\{${st.map(x => tg(x.a)).join('\\,;\\,')}\\}`;
    // ℝ \ {p}: twee open stukken ]−∞, p[ ∪ ]p, +∞[
    if (st.length === 2 && st[0].a === -Infinity && st[1].b === Infinity && st[0].b === st[1].a && !st[0].bi && !st[1].ai) return `\\mathbb{R} \\setminus \\{${tg(st[0].b)}\\}`;
    return st.map(x => x.a === x.b ? `\\{${tg(x.a)}\\}` : `{${x.ai ? '[' : ']'}}${tg(x.a)}, ${tg(x.b)}{${x.bi ? ']' : '['}}`).join(' \\cup ');
  }
  const zelfde = (x, y) => x === y || Math.abs(x - y) < 1e-9;
  const gelijk = (p, q) => p.length === q.length && p.every((x, i) => zelfde(x.a, q[i].a) && zelfde(x.b, q[i].b)
    && (x.a === -Infinity || x.ai === q[i].ai) && (x.b === Infinity || x.bi === q[i].bi));
  // a = { stukken: [...] }
  function controleer(invoer, a) {
    const r = ontleed(invoer);
    if (r.leeg) return { status: 'leeg', bericht: r.fout };
    if (!r.ok) return { status: 'ongeldig', bericht: r.fout };
    if (!gelijk(r.stukken, normaliseer(a.stukken))) return { status: 'fout' };
    if (r.fouteOneindig) return { status: 'vorm', bericht: 'Bij −∞ en +∞ staat het haakje altijd naar buiten: ]−∞ en +∞[.' };
    return { status: 'juist' };
  }
  return { ontleed, controleer, texVan: (st) => texVan(normaliseer(st)), normaliseer };
})();
