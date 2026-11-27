// Rekenkern voor functievoorschriften in x: leest  2(x − 1)² + 5 · −x² · 1/4 x² + 3 · √(x − 3) · 1/(x + 2) · x³ − 1 · sin x · cos(2x) · 1/cos²x
// ontleed(s) → { ok, boom, tex, topvorm } ;  controleer(invoer, a) met a = { expr, vorm?: 'topvorm' | 'vrij' }
const FX = (() => {
  class Fout extends Error {}
  const norm = (s) => String(s ?? '')
    .replace(/[−–—]/g, '-').replace(/[×*]/g, '·').replace(/÷|:/g, '/').replace(/X/g, 'x')
    .replace(/^\s*[a-z]\s*\(\s*x\s*\)\s*=\s*/i, '').replace(/^\s*y\s*=\s*/i, '')
    .replace(/\s+/g, ' ').trim();

  function tokens(s) {
    const t = []; let k = 0;
    while (k < s.length) {
      const c = s[k];
      if (c === ' ') { k++; continue; }
      const m = s.slice(k).match(/^\d+(?:[.,]\d+)?/);
      if (m) { t.push({ t: 'n', v: parseFloat(m[0].replace(',', '.')), s: m[0] }); k += m[0].length; continue; }
      const fn = s.slice(k).match(/^(sin|cos|tan|tg|ln)/i);
      if (fn) { t.push({ t: 'fn', naam: fn[1].toLowerCase() === 'tg' ? 'tan' : fn[1].toLowerCase() }); k += fn[1].length; continue; }
      if (c === 'e') { t.push({ t: 'n', v: Math.E, s: 'e' }); k++; continue; }   // het getal e
      if ('+-·/()^²³√x'.includes(c)) { t.push({ t: c }); k++; continue; }
      if (/[a-z]/i.test(c)) throw new Fout(`De letter "${c}" ken ik niet. Gebruik enkel x (en e, sin, cos, tan, ln).`);
      throw new Fout(`Het teken "${c}" kan ik niet lezen.`);
    }
    return t;
  }
  function boom(s) {
    const t = tokens(s); let p = 0;
    const kijk = () => t[p], neem = (x) => { if (t[p] && t[p].t === x) { p++; return true; } return false; };
    function som() {
      const termen = []; let teken = 1;
      if (neem('-')) teken = -1; else neem('+');
      termen.push({ teken, k: product() });
      while (kijk() && (kijk().t === '+' || kijk().t === '-')) { const tk = t[p++].t === '-' ? -1 : 1; termen.push({ teken: tk, k: product() }); }
      return termen.length === 1 && termen[0].teken === 1 ? termen[0].k : { op: 'som', termen };
    }
    function product() {
      const f = [{ deel: false, k: macht() }];
      for (;;) {
        const x = kijk(); if (!x) break;
        if (x.t === '·') { p++; f.push({ deel: false, k: macht() }); continue; }
        if (x.t === '/') { p++; f.push({ deel: true, k: macht() }); continue; }
        if (x.t === 'n' || x.t === 'x' || x.t === '(' || x.t === '√' || x.t === 'fn') { f.push({ deel: false, k: macht(), impl: true }); continue; }
        break;
      }
      return f.length === 1 ? f[0].k : { op: 'prod', f };
    }
    function macht() {
      let b = primair();
      for (;;) {
        if (neem('²')) b = { op: 'macht', b, e: 2 };
        else if (neem('³')) b = { op: 'macht', b, e: 3 };
        else if (neem('^')) {   // geheel getal, of een willekeurige exponent: x^(1/2), 2^x, e^(3x), x^-1
          const x = kijk(); if (!x) throw new Fout('Na ^ hoort een exponent.');
          if (x.t === 'n' && Number.isInteger(x.v) && x.s !== 'e') { p++; b = { op: 'macht', b, e: x.v }; }
          else b = { op: 'macht', b, ek: primair() };
        }
        else break;
      }
      return b;
    }
    function primair() {
      const x = t[p++];
      if (!x) throw new Fout('Je antwoord is onvolledig.');
      if (x.t === 'n') return { op: 'getal', v: x.v, s: x.s };
      if (x.t === 'x') return { op: 'x' };
      if (x.t === '(') { const k = som(); if (!neem(')')) throw new Fout('Er ontbreekt een haakje ).'); return { op: 'haak', k }; }
      if (x.t === '√') return { op: 'wortel', k: primair() };
      if (x.t === 'fn') {   // sin x · sin(2x) · sin 2x · sin²x · cos^2 x · sin x²
        let e = 1;
        if (neem('²')) e = 2; else if (neem('³')) e = 3; else if (kijk() && kijk().t === '^' && t[p + 1] && t[p + 1].t === 'n') { p++; e = t[p++].v; }
        let arg;
        if (kijk() && kijk().t === '(') arg = primair();
        else {   // zonder haakjes: een getal en/of x (met exponent), bv. sin 2x, sin x²
          const f = [];
          if (kijk() && kijk().t === 'n') f.push({ deel: false, k: primair() });
          if (kijk() && kijk().t === 'x') f.push({ deel: false, k: macht(), impl: f.length > 0 });
          if (!f.length) throw new Fout(`Na ${x.naam} hoort een argument, bv. ${x.naam} x of ${x.naam}(2x).`);
          arg = f.length === 1 ? f[0].k : { op: 'prod', f };
        }
        const fk = { op: 'fn', naam: x.naam, k: arg };
        return e === 1 ? fk : { op: 'macht', b: fk, e };
      }
      if (x.t === '-') return { op: 'neg', k: macht() };
      if (x.t === ')') throw new Fout('Er staat een haakje ) te veel.');
      throw new Fout('Je antwoord is onvolledig of er staat een teken te veel.');
    }
    const r = som();
    if (p < t.length) throw new Fout(t[p].t === ')' ? 'Er staat een haakje ) te veel.' : 'Dit kan ik niet lezen. Typ bv. 2(x - 1)^2 + 5.');
    return r;
  }
  function waarde(k, x) {
    switch (k.op) {
      case 'getal': return k.v;
      case 'x': return x;
      case 'haak': return waarde(k.k, x);
      case 'neg': return -waarde(k.k, x);
      case 'wortel': { const w = waarde(k.k, x); return w < -1e-12 ? NaN : Math.sqrt(Math.max(0, w)); }
      case 'fn': { const w = waarde(k.k, x); if (k.naam === 'ln') return w > 1e-12 ? Math.log(w) : NaN; return k.naam === 'sin' ? Math.sin(w) : k.naam === 'cos' ? Math.cos(w) : Math.abs(Math.cos(w)) < 1e-9 ? NaN : Math.tan(w); }
      case 'macht': return Math.pow(waarde(k.b, x), k.ek ? waarde(k.ek, x) : k.e);
      case 'som': return k.termen.reduce((a, t) => a + t.teken * waarde(t.k, x), 0);
      case 'prod': return k.f.reduce((a, f, j) => { const w = waarde(f.k, x); if (j === 0) return w; if (f.deel) return Math.abs(w) < 1e-12 ? NaN : a / w; return a * w; }, 0);
    }
    return NaN;
  }
  const heeftX = (k) => k.op === 'x' || (k.k && heeftX(k.k)) || (k.b && heeftX(k.b)) || (k.ek && heeftX(k.ek)) || (k.f && k.f.some(f => heeftX(f.k))) || (k.termen && k.termen.some(t => heeftX(t.k)));

  // staat het voorschrift in de topvorm a(x − h)² + k ?
  function isKwadraatterm(k) {
    // constante factoren × (x of (x ± c))²  — x mag niet in een noemer
    const factoren = k.op === 'prod' ? k.f : [{ deel: false, k }];
    let kw = 0;
    for (const f of factoren) {
      let kk = f.k; while (kk.op === 'neg') kk = kk.k;
      if (!heeftX(kk)) continue;
      if (f.deel) return false;
      if (kk.op !== 'macht' || kk.e !== 2) return false;
      const b = kk.b.op === 'haak' ? kk.b.k : kk.b;
      if (b.op === 'x') { kw++; continue; }
      if (b.op !== 'som' || b.termen.length !== 2) return false;
      const xs = b.termen.filter(t => t.k.op === 'x' && t.teken === 1), cs = b.termen.filter(t => !heeftX(t.k));
      if (xs.length !== 1 || cs.length !== 1) return false;
      kw++;
    }
    return kw === 1;
  }
  function topvorm(k) {
    const termen = k.op === 'som' ? k.termen.map(t => t.k) : [k];
    let kw = 0, cte = 0;
    for (let t of termen) { while (t.op === 'neg') t = t.k; if (heeftX(t)) { if (!isKwadraatterm(t)) return false; kw++; } else cte++; }
    return kw === 1 && cte <= 1;
  }

  const g = (s) => String(s).replace('.', '{,}').replace(',', '{,}');
  function tex(k) {
    switch (k.op) {
      case 'getal': return g(k.s);
      case 'x': return 'x';
      case 'haak': return `\\left(${tex(k.k)}\\right)`;
      case 'neg': return `-${tex(k.k)}`;
      case 'wortel': return `\\sqrt{${k.k.op === 'haak' ? tex(k.k.k) : tex(k.k)}}`;
      case 'fn': return `\\${k.naam}${k.k.op === 'haak' ? tex(k.k) : ' ' + tex(k.k)}`;
      case 'macht': if (k.ek) return `${tex(k.b)}^{${(k.ek.op === 'haak' ? tex(k.ek.k) : tex(k.ek)).replace(/\\dfrac/g, '\\frac')}}`;
        return k.b.op === 'fn' ? `\\${k.b.naam}^{${k.e}}${k.b.k.op === 'haak' ? tex(k.b.k) : ' ' + tex(k.b.k)}` : `${tex(k.b)}^{${k.e}}`;
      case 'som': return k.termen.map((x, j) => (x.teken < 0 ? '-' : j ? '+' : '') + tex(x.k)).join(' ');
      case 'prod': {
        let uit = '';
        k.f.forEach((x, j) => {
          if (j === 0) { uit = tex(x.k); return; }
          if (x.deel) { uit = `\\dfrac{${uit}}{${x.k.op === 'haak' ? tex(x.k.k) : tex(x.k)}}`; return; }
          const vorig = k.f[j - 1].k;
          const punt = !x.impl || (x.k.op === 'getal' && ['getal', 'macht', 'wortel'].includes(vorig.op));
          uit += punt ? ` \\cdot ${tex(x.k)}` : tex(x.k);
        });
        return uit;
      }
    }
    return '';
  }

  function ontleed(invoer) {
    const s = norm(invoer);
    if (!s) return { ok: false, leeg: true, fout: 'Vul eerst een antwoord in.' };
    try { const k = boom(s); return { ok: true, boom: k, tex: tex(k), topvorm: topvorm(k) }; }
    catch (e) { return { ok: false, fout: e instanceof Fout ? e.message : 'Dit kan ik niet lezen. Typ bv. 2(x - 1)^2 + 5.' }; }
  }
  const PUNTEN = [-7.3, -5.7, -4.1, -3.3, -2.6, -1.9, -1.2, -0.45, 0.35, 0.8, 1.7, 2.45, 3.15, 3.9, 4.6, 5.35, 6.2, 7.7, 9.1, 11.3];
  function gelijk(k1, k2) {
    let samen = 0;
    for (const x of PUNTEN) {
      const a = waarde(k1, x), b = waarde(k2, x), da = Number.isFinite(a), db = Number.isFinite(b);
      if (da !== db) return false;
      if (!da) continue;
      if (Math.abs(a - b) > 1e-7 * Math.max(1, Math.abs(b))) return false;
      samen++;
    }
    return samen >= 3;
  }
  function controleer(invoer, a) {
    const r = ontleed(invoer);
    if (r.leeg) return { status: 'leeg', bericht: r.fout };
    if (!r.ok) return { status: 'ongeldig', bericht: r.fout };
    if (!heeftX(r.boom)) return { status: 'fout' };
    const d = ontleed(a.expr);
    if (!d.ok) return { status: 'fout' };
    if (!gelijk(r.boom, d.boom)) return { status: 'fout' };
    if (a.vorm === 'topvorm' && !r.topvorm) return { status: 'vorm', bericht: 'Je voorschrift klopt, maar schrijf het in de topvorm a(x − h)² + k.' };
    return { status: 'juist' };
  }
  const texVan = (expr) => { const r = ontleed(expr); return r.ok ? r.tex : expr; };

  // ---------- TeX van een topvorm a(x − h)² + k met getallen (breuken toegestaan via W.breukTex indien beschikbaar)
  return { ontleed, controleer, texVan, waarde: (expr, x) => { const r = ontleed(expr); return r.ok ? waarde(r.boom, x) : NaN; } };
})();
