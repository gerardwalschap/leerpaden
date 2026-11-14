// Rekenkern voor complexe getallen: leest antwoorden zoals  3 − 2i · −1/2 + i · 2√2 + 2√2 i · √3i · 4(cos…) niet.
// ontleed(s) → { ok, re, im, tex, cartesisch, decimalen } of { ok:false, fout, leeg? }
//   cartesisch = true als het antwoord in de vorm a + bi staat (hoogstens één reële en één imaginaire term,
//                i niet in een noemer, niet in haakjes, geen macht van i).
const CX = (() => {
  class Fout extends Error {}
  const norm = (s) => String(s ?? '')
    .replace(/[−–—]/g, '-').replace(/[×*]/g, '·').replace(/÷|:/g, '/').replace(/\s+/g, ' ').replace(/I/g, 'i')
    .replace(/√\s*\(/g, '√(').trim();

  // ---------- tokens
  function tokens(s) {
    const t = []; let k = 0;
    while (k < s.length) {
      const c = s[k];
      if (c === ' ') { k++; continue; }
      const m = s.slice(k).match(/^\d+(?:[.,]\d+)?/);
      if (m) { t.push({ t: 'n', v: parseFloat(m[0].replace(',', '.')), s: m[0], dec: (m[0].split(/[.,]/)[1] || '').length }); k += m[0].length; continue; }
      if ('+-·/()^²³√i±'.includes(c)) { t.push({ t: c }); k++; continue; }
      if (/[a-hj-z]/i.test(c)) throw new Fout(`De letter "${c}" ken ik niet. Gebruik enkel getallen en i.`);
      throw new Fout(`Het teken "${c}" kan ik niet lezen.`);
    }
    return t;
  }

  // ---------- ontleden tot een boom
  function boom(s) {
    const t = tokens(s); let p = 0;
    const kijk = () => t[p], neem = (x) => { if (t[p] && t[p].t === x) { p++; return true; } return false; };
    function som() {
      const termen = [];
      let teken = 1;
      if (neem('-')) teken = -1; else neem('+');
      termen.push({ teken, k: product() });
      while (kijk() && (kijk().t === '+' || kijk().t === '-')) {
        const tk = t[p++].t === '-' ? -1 : 1;
        termen.push({ teken: tk, k: product() });
      }
      return termen.length === 1 && termen[0].teken === 1 ? termen[0].k : { op: 'som', termen };
    }
    function product() {
      const f = [{ deel: false, k: macht() }];
      for (;;) {
        const x = kijk();
        if (!x) break;
        if (x.t === '·') { p++; f.push({ deel: false, k: macht() }); continue; }
        if (x.t === '/') { p++; f.push({ deel: true, k: macht() }); continue; }
        if (x.t === 'n' || x.t === 'i' || x.t === '(' || x.t === '√') { f.push({ deel: false, k: macht(), impl: true }); continue; }
        break;
      }
      return f.length === 1 ? f[0].k : { op: 'prod', f };
    }
    function macht() {
      let b = primair();
      for (;;) {
        if (neem('²')) b = { op: 'macht', b, e: 2 };
        else if (neem('³')) b = { op: 'macht', b, e: 3 };
        else if (neem('^')) {
          let e;
          if (neem('(')) { const neg = neem('-'); const x = t[p++]; if (!x || x.t !== 'n' || x.dec) throw new Fout('Een exponent moet een geheel getal zijn.'); if (!neem(')')) throw new Fout('Er ontbreekt een haakje.'); e = neg ? -x.v : x.v; }
          else { const x = t[p++]; if (!x || x.t !== 'n' || x.dec) throw new Fout('Een exponent moet een geheel getal zijn.'); e = x.v; }
          b = { op: 'macht', b, e };
        } else break;
      }
      return b;
    }
    function primair() {
      const x = t[p++];
      if (!x) throw new Fout('Je antwoord is onvolledig.');
      if (x.t === 'n') return { op: 'getal', v: x.v, s: x.s, dec: x.dec };
      if (x.t === 'i') return { op: 'i' };
      if (x.t === '(') { const k = som(); if (!neem(')')) throw new Fout('Er ontbreekt een haakje ).'); return { op: 'haak', k }; }
      if (x.t === '√') { const k = primair(); return { op: 'wortel', k }; }
      if (x.t === '-') return { op: 'neg', k: macht() };
      if (x.t === ')') throw new Fout('Er staat een haakje ) te veel.');
      throw new Fout('Je antwoord is onvolledig of er staat een teken te veel.');
    }
    const r = som();
    if (p < t.length) throw new Fout(t[p].t === ')' ? 'Er staat een haakje ) te veel.' : 'Dit kan ik niet lezen. Typ bv. 3 - 2i.');
    return r;
  }

  // ---------- rekenen
  const C = (re, im = 0) => ({ re, im });
  const mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const div = (a, b) => { const n = b.re * b.re + b.im * b.im; if (n < 1e-15) throw new Fout('Je deelt door nul.'); return C((a.re * b.re + a.im * b.im) / n, (a.im * b.re - a.re * b.im) / n); };
  function waarde(k) {
    switch (k.op) {
      case 'getal': return C(k.v);
      case 'i': return C(0, 1);
      case 'haak': return waarde(k.k);
      case 'neg': { const w = waarde(k.k); return C(-w.re, -w.im); }
      case 'wortel': { const w = waarde(k.k); if (Math.abs(w.im) > 1e-12 || w.re < 0) throw new Fout('Onder een wortel moet een positief getal staan.'); return C(Math.sqrt(w.re)); }
      case 'macht': { let r = C(1), b = waarde(k.b); const n = Math.abs(k.e); for (let j = 0; j < n; j++) r = mul(r, b); return k.e < 0 ? div(C(1), r) : r; }
      case 'som': return k.termen.reduce((a, x) => { const w = waarde(x.k); return C(a.re + x.teken * w.re, a.im + x.teken * w.im); }, C(0));
      case 'prod': return k.f.reduce((a, x, j) => j === 0 ? waarde(x.k) : x.deel ? div(a, waarde(x.k)) : mul(a, waarde(x.k)), null);
    }
    throw new Fout('Dit kan ik niet lezen.');
  }

  // ---------- staat het in de vorm a + bi?
  const heeftI = (k) => k.op === 'i' || (k.k && heeftI(k.k)) || (k.b && heeftI(k.b)) || (k.f && k.f.some(x => heeftI(x.k))) || (k.termen && k.termen.some(x => heeftI(x.k)));
  function aantalI(k) { // aantal i-factoren rechtstreeks in een product (niet in haakjes/noemer)
    if (k.op === 'i') return 1;
    if (k.op === 'neg') return aantalI(k.k);
    if (k.op === 'prod') { let n = 0; for (const x of k.f) { if (x.deel) { if (heeftI(x.k)) return 99; } else if (x.k.op === 'i') n++; else if (heeftI(x.k)) return 99; } return n; }
    if (heeftI(k)) return 99;
    return 0;
  }
  function cartesisch(k) {
    const termen = k.op === 'som' ? k.termen.map(x => x.k) : [k];
    let reeel = 0, imag = 0;
    for (const x of termen) {
      const n = aantalI(x);
      if (n === 0) reeel++; else if (n === 1) imag++; else return false;
    }
    return reeel <= 1 && imag <= 1;
  }
  function maxDec(k) {
    if (k.op === 'getal') return k.dec;
    return Math.max(0, ...[k.k, k.b].filter(Boolean).map(maxDec), ...(k.f || []).map(x => maxDec(x.k)), ...(k.termen || []).map(x => maxDec(x.k)));
  }

  // ---------- TeX
  const g = (v, s) => String(s).replace('.', ',').replace(',', '{,}');
  function tex(k) {
    switch (k.op) {
      case 'getal': return g(k.v, k.s);
      case 'i': return 'i';
      case 'haak': return `\\left(${tex(k.k)}\\right)`;
      case 'neg': return `-${tex(k.k)}`;
      case 'wortel': return `\\sqrt{${k.k.op === 'haak' ? tex(k.k.k) : tex(k.k)}}`;
      case 'macht': return `${tex(k.b)}^{${k.e}}`;
      case 'som': return k.termen.map((x, j) => (x.teken < 0 ? '-' : j ? '+' : '') + tex(x.k)).join(' ');
      case 'prod': {
        let uit = '';
        k.f.forEach((x, j) => {
          if (j === 0) { uit = tex(x.k); return; }
          if (x.deel) { const n = x.k.op === 'haak' ? tex(x.k.k) : tex(x.k); uit = `\\dfrac{${uit}}{${n}}`; return; }
          const tx = tex(x.k), vorig = k.f[j - 1].k;
          const punt = !x.impl || (x.k.op === 'getal' && (vorig.op === 'getal' || vorig.op === 'macht' || vorig.op === 'wortel'));
          uit += punt ? ` \\cdot ${tx}` : (x.k.op === 'i' && vorig.op === 'wortel' ? `\\,${tx}` : tx);
        });
        return uit;
      }
    }
    return '';
  }

  function ontleed(invoer) {
    const s = norm(invoer);
    if (!s) return { ok: false, leeg: true, fout: 'Vul eerst een antwoord in.' };
    if (/[,.]\s*$/.test(s)) return { ok: false, fout: 'Je getal is onvolledig.' };
    try {
      const k = boom(s), w = waarde(k);
      return { ok: true, re: w.re, im: w.im, tex: tex(k), cartesisch: cartesisch(k), decimalen: maxDec(k) };
    } catch (e) {
      if (e instanceof Fout) return { ok: false, fout: e.message };
      return { ok: false, fout: 'Dit kan ik niet lezen. Typ bv. 3 - 2i.' };
    }
  }

  // ---------- nakijken van één complex getal
  // a = { re, im, dec? (standaard 2), exact?: true → afgeronde decimalen zijn 'vorm', vorm?: 'cartesisch' | 'vrij' }
  const dicht = (x, y) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(y));
  function vergelijk(a, r) {
    const dec = a.dec ?? 2;
    if (dicht(r.re, a.re) && dicht(r.im, a.im)) return 'exact';
    const rd = (x) => W.rond(x, dec);
    const okRond = (v, e) => dicht(v, e) || Math.abs(v - rd(e)) < 1e-9;
    if (okRond(r.re, a.re) && okRond(r.im, a.im)) return 'afgerond';
    const teVeel = (v, e) => Math.abs(rd(v) - rd(e)) < 1e-9;
    if (r.decimalen > dec && teVeel(r.re, a.re) && teVeel(r.im, a.im)) return 'teveel';
    return null;
  }
  function controleer(invoer, a) {
    const r = ontleed(invoer);
    if (r.leeg) return { status: 'leeg', bericht: r.fout };
    if (!r.ok) return { status: 'ongeldig', bericht: r.fout };
    const v = vergelijk(a, r);
    if (!v) return { status: 'fout' };
    const dec = a.dec ?? 2;
    if (v === 'teveel') return { status: 'vorm', bericht: `Rond af op ${dec} ${dec === 1 ? 'decimaal' : 'decimalen'}.` };
    if (a.vorm !== 'vrij' && !r.cartesisch) return { status: 'vorm', bericht: 'Je antwoord is juist, maar werk het verder uit tot de vorm a + bi.' };
    if (v === 'afgerond' && a.exact) return { status: 'vorm', bericht: 'Geef de exacte waarde (met √ of een breuk), niet afgerond.' };
    return { status: 'juist' };
  }

  // ---------- V = { z₁ ; z₂ } (volgorde vrij, ± mag)
  function splitsV(invoer) {
    let s = String(invoer ?? '').replace(/^\s*V\s*=\s*/i, '').replace(/^\s*\{\s*|\s*\}\s*$/g, '').trim();
    const delen = s.split(/;|\bof\b/i).map(x => x.replace(/^\s*[xz]\s*[₁₂12]?\s*=\s*/i, '').trim()).filter(Boolean);
    const uit = [];
    for (const d of delen) {
      if (d.includes('±')) { const n = norm(d); uit.push(n.replace('±', '+'), n.replace('±', '-')); } else uit.push(d);
    }
    return uit;
  }
  function controleerV(invoer, a) {
    if (!String(invoer ?? '').trim()) return { status: 'leeg', bericht: 'Vul de oplossingen in.' };
    if (/\d\s*,\s+-?\d|\d\s+,\s*-?\d|i\s*,\s*-?\d/.test(invoer)) return { status: 'ongeldig', bericht: 'Zet een puntkomma ; tussen de oplossingen (de komma is voor decimalen).' };
    const delen = splitsV(invoer), rs = [];
    for (const d of delen) { const r = ontleed(d); if (!r.ok) return { status: 'ongeldig', bericht: r.fout }; rs.push(r); }
    const uniek = rs.filter((x, j) => rs.findIndex(y => dicht(y.re, x.re) && dicht(y.im, x.im)) === j);
    if (uniek.length !== a.waarden.length) return { status: 'fout' };
    const vrij = a.waarden.slice(); let bericht = null;
    for (const r of uniek) {
      const j = vrij.findIndex(w => vergelijk({ ...w, dec: a.dec }, r));
      if (j < 0) return { status: 'fout' };
      const v = vergelijk({ ...vrij[j], dec: a.dec }, r); vrij.splice(j, 1);
      if (v === 'teveel') bericht = `Rond af op ${a.dec ?? 2} decimalen.`;
      else if (!r.cartesisch) bericht = 'Je oplossingen zijn juist, maar schrijf ze in de vorm a + bi.';
      else if (v === 'afgerond' && a.exact) bericht = 'Geef de exacte oplossingen, niet afgerond.';
    }
    return bericht ? { status: 'vorm', bericht } : { status: 'juist' };
  }
  function texV(invoer) {
    const ds = splitsV(invoer).map(d => ontleed(d));
    return ds.length && ds.every(x => x.ok) ? `V = \\{${ds.map(x => x.tex).join('\\,;\\,')}\\}` : null;
  }

  // ---------- hoek in graden (gelijkwaardig op een veelvoud van 360° na)
  const zonderGraden = (s) => String(s ?? '').replace(/[°º˚]|graden|deg/gi, '').replace(/^\s*θ\s*=\s*/i, '').trim();

  // ---------- TeX van a + bi (getallen of {tex})
  function texAbi(re, im, reT, imT) {
    const reTx = reT ?? W.texGetal(re), imTx = imT ?? W.texGetal(Math.abs(im));
    if (Math.abs(im) < 1e-12) return reTx;
    const imDeel = (Math.abs(Math.abs(im) - 1) < 1e-12 && imT === undefined) ? 'i' : `${imTx}${/sqrt/.test(imTx) ? '\\,' : ''}i`;
    if (Math.abs(re) < 1e-12 && reT === undefined) return `${im < 0 ? '-' : ''}${imDeel}`;
    return `${reTx} ${im < 0 ? '-' : '+'} ${imDeel}`;
  }

  return { ontleed, controleer, controleerV, texV, splitsV, zonderGraden, texAbi, norm };
})();
