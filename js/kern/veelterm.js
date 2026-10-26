// Veeltermkern: leest antwoorden zoals  x^2 + 6x + 9 · 3x(x - 4) · (2a - 5b)² · -2x⁴ - 12x² - 18
// en controleert (1) of ze gelijk zijn aan de oplossing (beide worden volledig uitgewerkt) en
// (2) of ze in de gevraagde vorm staan: 'uitgewerkt' (herleide som van termen) of
// 'ontbonden' (product van factoren dat niet verder te ontbinden is).
// Gebruikt de lezer van de rekenkern E (E.lees) en diens breuken (E.Q).
const VT = (() => {
  const Q = E.Q;
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  class Fout extends Error { constructor(m) { super(m); this.ongeldig = true; } }

  // ---------- veeltermen: Map  monoomsleutel -> Q   (sleutel bv. "a1|x2", constante = "")
  const sleutel = (m) => Object.keys(m).filter(k => m[k]).sort().map(k => k + m[k]).join('|');
  const ontleedSleutel = (s) => { const m = {}; if (s) s.split('|').forEach(p => { m[p[0]] = +p.slice(1); }); return m; };
  const graad = (s) => s ? s.split('|').reduce((t, p) => t + +p.slice(1), 0) : 0;
  const nieuw = () => new Map();
  const cst = (q) => { const p = nieuw(); if (q.n !== 0) p.set('', q); return p; };
  const letter = (v) => new Map([[`${v}1`, new Q(1)]]);
  function plus(a, b) {
    const p = new Map(a);
    for (const [k, c] of b) { const s = (p.get(k) || new Q(0)).add(c); if (s.n === 0) p.delete(k); else p.set(k, s); }
    return p;
  }
  function maal(a, b) {
    let p = nieuw();
    for (const [k1, c1] of a) for (const [k2, c2] of b) {
      const m = ontleedSleutel(k1), m2 = ontleedSleutel(k2);
      for (const [v, e] of Object.entries(m2)) m[v] = (m[v] || 0) + e;
      p = plus(p, new Map([[sleutel(m), c1.mul(c2)]]));
    }
    return p;
  }
  const tegen = (a) => maal(a, cst(new Q(-1)));
  function macht(a, n) { let p = cst(new Q(1)); for (let i = 0; i < n; i++) p = maal(p, a); return p; }
  const isConst = (p) => p.size === 0 || (p.size === 1 && p.has(''));
  const constWaarde = (p) => p.size === 0 ? new Q(0) : p.get('');
  function gelijk(a, b) {
    if (a.size !== b.size) return false;
    for (const [k, c] of a) { const d = b.get(k); if (!d || !d.eq(c)) return false; }
    return true;
  }
  // termen in een vaste volgorde: hoogste graad eerst, dan alfabetisch
  function lexDalend(x, y) { // x²y vóór xy², a² vóór b²
    const mx = ontleedSleutel(x), my = ontleedSleutel(y);
    const ls = [...new Set([...Object.keys(mx), ...Object.keys(my)])].sort();
    for (const l of ls) { const d = (my[l] || 0) - (mx[l] || 0); if (d) return d; }
    return 0;
  }
  const volgorde = (p) => [...p.keys()].sort((x, y) => graad(y) - graad(x) || lexDalend(x, y));

  // ---------- boom (van E.lees) -> veelterm
  function eval_(k) {
    switch (k.t) {
      case 'num': {
        const s = k.s;
        if (s.includes('.')) { const [a, b] = s.split('.'); return cst(new Q(+(a + b), 10 ** b.length)); }
        if (s.length > 9) throw new Fout('Dat getal is te groot.');
        return cst(new Q(+s));
      }
      case 'let': return letter(k.v);
      case 'haak': return eval_(k.x);
      case 'neg': return tegen(eval_(k.x));
      case 'som': return k.ts.map(eval_).reduce(plus);
      case 'maal': return k.fs.map(eval_).reduce(maal);
      case 'deel': {
        const b = eval_(k.b);
        if (!isConst(b)) throw new Fout('Deel enkel door een getal.');
        const q = constWaarde(b); if (q.n === 0) throw new Fout('Je deelt door nul.');
        return maal(eval_(k.a), cst(new Q(q.d, q.n)));
      }
      case 'macht': {
        const e = eval_(k.e);
        if (!isConst(e)) throw new Fout('Een exponent moet een getal zijn.');
        const q = constWaarde(e);
        if (q.d !== 1 || q.n < 0) throw new Fout('Gebruik enkel exponenten 0, 1, 2, 3, …');
        if (q.n > 12) throw new Fout('Die exponent is te groot.');
        return macht(eval_(k.b), q.n);
      }
      case 'wortel': throw new Fout('Hier hoort geen wortelteken in je antwoord.');
    }
    throw new Fout('Ik begrijp je antwoord niet.');
  }

  // ---------- TeX van een veelterm (uitgewerkt)
  function qTex(q) { return q.d === 1 ? String(Math.abs(q.n)) : `\\frac{${Math.abs(q.n)}}{${q.d}}`; }
  function monoTex(k) {
    if (!k) return '';
    return k.split('|').map(p => p[0] + (+p.slice(1) > 1 ? `^{${p.slice(1)}}` : '')).join('');
  }
  function tex(p) {
    if (!p.size) return '0';
    return volgorde(p).map((k, i) => {
      const c = p.get(k), neg = c.n < 0, abs = new Q(Math.abs(c.n), c.d);
      const getal = k && abs.n === 1 && abs.d === 1 ? '' : qTex(abs);
      return (i ? (neg ? ' - ' : ' + ') : (neg ? '-' : '')) + getal + monoTex(k);
    }).join('');
  }

  // ---------- factoren van een (product)boom
  // geeft { cst: Q, fs: [veelterm, ...] } met elke niet-constante factor apart (x² -> x, x)
  function factoren(k, uit = { cst: new Q(1), fs: [] }) {
    switch (k.t) {
      case 'haak': return factoren(k.x, uit);
      case 'neg': uit.cst = uit.cst.neg(); return factoren(k.x, uit);
      case 'maal': k.fs.forEach(f => factoren(f, uit)); return uit;
      case 'deel': {
        const b = eval_(k.b); if (!isConst(b)) throw new Fout('Deel enkel door een getal.');
        const q = constWaarde(b); uit.cst = uit.cst.mul(new Q(q.d, q.n)); return factoren(k.a, uit);
      }
      case 'macht': {
        const e = constWaarde(eval_(k.e));
        for (let i = 0; i < e.n; i++) factoren(k.b, uit);
        return uit;
      }
      case 'let': uit.fs.push(letter(k.v)); return uit;
      case 'num': uit.cst = uit.cst.mul(constWaarde(eval_(k))); return uit;
      case 'som': {
        const p = eval_(k);
        if (isConst(p)) { uit.cst = uit.cst.mul(constWaarde(p)); return uit; }
        uit.fs.push(p); return uit;
      }
    }
    throw new Fout('Ik begrijp je antwoord niet.');
  }
  // inhoud van een veelterm: ggd van de coëfficiënten (gehele getallen) en gemeenschappelijke letters
  function inhoud(p) {
    const ks = [...p.keys()];
    let g = 0, l = 1;
    for (const c of p.values()) { g = gcd(g, c.n); l = l / gcd(l, c.d) * c.d; }
    const gem = {};
    const eerste = ontleedSleutel(ks[0]);
    for (const [v, e] of Object.entries(eerste)) gem[v] = Math.min(e, ...ks.map(s => ontleedSleutel(s)[v] || 0));
    Object.keys(gem).forEach(v => { if (!gem[v]) delete gem[v]; });
    return { getal: new Q(g, l), letters: gem };
  }
  // normaalvorm van een factor: primitief (inhoud 1) en eerste coëfficiënt positief
  function normaal(p) {
    const i = inhoud(p);
    let q = maal(p, cst(new Q(i.getal.d, i.getal.n)));
    const eerste = volgorde(q)[0];
    if (q.get(eerste).n < 0) q = tegen(q);
    return volgorde(q).map(k => `${q.get(k).n}/${q.get(k).d}*${k}`).join(' ');
  }
  // splits een veelterm-factor in letters (monoom) en primitieve rest
  function splitFactor(p) {
    if (p.size === 1) { // monoom: letters apart
      const [k] = p.keys(); const m = ontleedSleutel(k), uit = [];
      for (const [v, e] of Object.entries(m)) for (let i = 0; i < e; i++) uit.push(letter(v));
      return { cst: p.get(k), fs: uit };
    }
    return null;
  }

  // ---------- vormcontrole
  const zonderMin = (k) => { while (k.t === 'neg' || k.t === 'haak') k = k.x; return k; };
  function bevat(k, test) {
    if (!k || typeof k !== 'object') return false;
    if (test(k)) return true;
    return ['x', 'a', 'b', 'e'].some(p => bevat(k[p], test)) || (k.fs || k.ts || []).some(x => bevat(x, test));
  }
  const isSomKnoop = (k) => zonderMin(k).t === 'som';

  function vormUitgewerkt(boom) {
    const z = zonderMin(boom);
    const termen = z.t === 'som' ? z.ts : [boom];
    const gezien = new Set();
    for (const t of termen) {
      if (bevat(t, x => x.t === 'som')) return 'Werk alle haakjes nog uit.';
      const p = eval_(t);
      if (p.size > 1) return 'Werk alle haakjes nog uit.';
      if (p.size === 1) {
        const [k] = p.keys();
        if (gezien.has(k)) return 'Neem gelijksoortige termen nog samen.';
        gezien.add(k);
      }
    }
    return null;
  }

  function vormOntbonden(boom, verwachtBoom) {
    const z = zonderMin(boom);
    if (z.t === 'som') return 'Schrijf je antwoord als een product van factoren.';
    const s = factoren(boom), v = factoren(verwachtBoom);
    const plat = (r) => { const fs = []; let c = r.cst; for (const f of r.fs) { const m = splitFactor(f); if (m) { c = c.mul(m.cst); fs.push(...m.fs); } else fs.push(f); } return { cst: c, fs }; };
    const S = plat(s), V = plat(v);
    // een factor met nog een gemeenschappelijke factor?
    for (const f of S.fs) {
      if (f.size < 2) continue;
      const i = inhoud(f);
      if (Object.keys(i.letters).length || (i.getal.d === 1 && i.getal.n > 1)) return 'Er kan nog een gemeenschappelijke factor buiten de haakjes.';
    }
    const tel = (lijst) => { const m = new Map(); lijst.forEach(f => { const k = normaal(f); m.set(k, (m.get(k) || 0) + 1); }); return m; };
    const a = tel(S.fs), b = tel(V.fs);
    const zelfde = a.size === b.size && [...a].every(([k, n]) => b.get(k) === n);
    if (!zelfde) return 'Je kan nog verder ontbinden.';
    return null;
  }

  // ---------- publieke functies
  function ontleed(invoer) { // {ok, boom, p, tex} of {ok:false, fout}
    try {
      if (/[√∛∜]/.test(String(invoer))) throw new Fout('Hier hoort geen wortelteken in je antwoord.');
      const boom = E.lees(invoer);
      const p = eval_(boom);
      return { ok: true, boom, p, tex: E.tex(boom).replace(/\\right\) \\cdot \\left\(/g, '\\right)\\left(') };
    } catch (e) { if (e.ongeldig) return { ok: false, fout: e.message }; throw e; }
  }
  // resultaat: {status: 'juist' | 'fout' | 'vorm' | 'ongeldig' | 'leeg', bericht}
  function controleer(invoer, verwacht, vorm) {
    if (!String(invoer ?? '').trim()) return { status: 'leeg', bericht: 'Vul eerst een antwoord in.' };
    const s = ontleed(invoer);
    if (!s.ok) return { status: 'ongeldig', bericht: s.fout };
    const v = ontleed(verwacht);
    if (!v.ok) throw new Error('Oplossing onleesbaar: ' + verwacht + ' — ' + v.fout);
    if (!gelijk(s.p, v.p)) return { status: 'fout' };
    const m = vorm === 'uitgewerkt' ? vormUitgewerkt(s.boom) : vorm === 'ontbonden' ? vormOntbonden(s.boom, v.boom) : null;
    if (m) return { status: 'vorm', bericht: m };
    return { status: 'juist' };
  }
  const texVan = (invoer) => { const s = ontleed(invoer); return s.ok ? s.tex : null; };
  const uitgewerktTex = (invoer) => { const s = ontleed(invoer); return s.ok ? tex(s.p) : null; };
  // uitgewerkte vorm als typbare tekst, bv. '4x^2 - 12x + 9'
  const uitgewerktTekst = (invoer) => { const s = ontleed(invoer); if (!s.ok) return null;
    return tex(s.p).replace(/\^\{(\d+)\}/g, '^$1').replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2'); };

  return { ontleed, controleer, texVan, uitgewerktTex, uitgewerktTekst, Fout };
})();
if (typeof module !== 'undefined') module.exports = VT;
