// Leest antwoorden die geen 'wortelvorm' zijn: getallen (met afronding), intervallen,
// ongelijkheden en formules (hoofdlettergevoelig, met π en ρ).
const Invoer = (() => {
  class Fout extends Error { constructor(m) { super(m); this.ongeldig = true; } }
  const norm = (s) => String(s ?? '').replace(/[−–—]/g, '-').replace(/ /g, ' ').trim();

  // ---------- getallen ------------------------------------------------
  // "3,5"  "-0,25"  "16 807"  "1/8"  "-2/3"  -> {ok, waarde, decimalen}
  function getal(invoer) {
    let s = norm(invoer).replace(/\s+/g, '');
    if (!s) return { ok: false, leeg: true, fout: 'Vul eerst een antwoord in.' };
    s = s.replace(/^\+/, '');
    let m = s.match(/^(-?)(\d+)(?:[.,](\d+))?$/);
    if (m) return { ok: true, waarde: (m[1] ? -1 : 1) * parseFloat(m[2] + '.' + (m[3] || '0')), decimalen: (m[3] || '').length };
    m = s.match(/^(-?)(\d+)\/(-?)(\d+)$/);
    if (m && +m[4] !== 0) return { ok: true, waarde: ((m[1] ? -1 : 1) * (m[3] ? -1 : 1) * +m[2]) / +m[4], decimalen: 0, breuk: true };
    if (/^-?\d+[.,]\d+[.,]\d+$/.test(s)) return { ok: false, fout: 'Gebruik één decimaalteken (een komma).' };
    if (/[a-z]/i.test(s)) return { ok: false, fout: 'Typ enkel een getal (bv. 4,47 of -3).' };
    return { ok: false, fout: 'Dit getal kan ik niet lezen. Typ bv. 4,47 of -3 of 1/8.' };
  }

  // ---------- intervallen ---------------------------------------------
  // grenzen: a = null betekent −∞, b = null betekent +∞; ai/bi = grensgetal hoort erbij
  function grens(t) {
    t = t.replace(/\s+/g, '');
    if (/^-(∞|oo|inf)$/i.test(t)) return -Infinity;
    if (/^\+?(∞|oo|inf)$/i.test(t)) return Infinity;
    const g = getal(t);
    if (!g.ok) throw new Fout(`De grens "${t}" kan ik niet lezen.`);
    return g.waarde;
  }
  function interval(invoer) {
    const s = norm(invoer).replace(/\s+/g, ' ');
    if (!s) return { ok: false, leeg: true, fout: 'Vul eerst een antwoord in.' };
    try {
      const m = s.match(/^([\[\]])(.*)([\[\]])$/);
      if (!m) throw new Fout('Begin en eindig met een haakje: [ of ].');
      const binnen = m[2];
      if (!binnen.includes(';')) throw new Fout(binnen.includes(',') ? 'Zet een puntkomma ; tussen de twee grenzen (de komma is voor decimalen).' : 'Zet een puntkomma ; tussen de twee grenzen.');
      const delen = binnen.split(';');
      if (delen.length !== 2) throw new Fout('Er hoort precies één puntkomma tussen de grenzen.');
      const a = grens(delen[0]), b = grens(delen[1]);
      if (a === Infinity || b === -Infinity) throw new Fout('Links staat −∞ (of een getal), rechts +∞ (of een getal).');
      if (a > b) throw new Fout('De kleinste grens komt eerst.');
      const r = { ok: true, a: a === -Infinity ? null : a, ai: m[1] === '[', b: b === Infinity ? null : b, bi: m[3] === ']' };
      r.oneindigBinnen = (r.a === null && r.ai) || (r.b === null && r.bi);
      return r;
    } catch (e) { if (e.ongeldig) return { ok: false, fout: e.message }; throw e; }
  }

  // ---------- ongelijkheden -------------------------------------------
  function ongelijkheid(invoer) {
    let s = norm(invoer).replace(/\s+/g, '').replace(/<=|=</g, '≤').replace(/>=|=>/g, '≥').replace(/X/g, 'x');
    if (!s) return { ok: false, leeg: true, fout: 'Vul eerst een antwoord in.' };
    try {
      const d = s.split(/(≤|≥|<|>)/);
      const isX = (t) => t === 'x';
      const g = (t) => { const r = getal(t); if (!r.ok) throw new Fout(`"${t}" kan ik niet lezen.`); return r.waarde; };
      const klein = (op) => op === '<' || op === '≤';
      if (d.length === 3) {
        let [l, op, r] = d;
        if (isX(r) && !isX(l)) { [l, r] = [r, l]; op = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[op]; }
        if (!isX(l)) throw new Fout('Gebruik de letter x, bv. x ≥ 2.');
        const n = g(r);
        return klein(op) ? { ok: true, a: null, ai: false, b: n, bi: op === '≤' } : { ok: true, a: n, ai: op === '≥', b: null, bi: false };
      }
      if (d.length === 5) {
        const [n1, o1, x, o2, n2] = d;
        if (!isX(x)) throw new Fout('Zet x in het midden, bv. −1 < x < 6.');
        const p = g(n1), q = g(n2);
        if (klein(o1) && klein(o2)) { if (p > q) throw new Fout('Het kleinste getal staat links.'); return { ok: true, a: p, ai: o1 === '≤', b: q, bi: o2 === '≤' }; }
        if (!klein(o1) && !klein(o2)) { if (q > p) throw new Fout('Controleer de volgorde van de getallen.'); return { ok: true, a: q, ai: o2 === '≥', b: p, bi: o1 === '≥' }; }
        throw new Fout('Gebruik twee keer < (of ≤), bv. −1 < x ≤ 6.');
      }
      throw new Fout('Schrijf bv. x ≥ 2 of −1 < x < 6.');
    } catch (e) { if (e.ongeldig) return { ok: false, fout: e.message }; throw e; }
  }

  const gelijkeGrenzen = (p, q) => (p.a === null ? q.a === null : q.a !== null && Math.abs(p.a - q.a) < 1e-9)
    && (p.b === null ? q.b === null : q.b !== null && Math.abs(p.b - q.b) < 1e-9)
    && (p.a === null || p.ai === q.ai) && (p.b === null || p.bi === q.bi);

  const tg = (x) => W.texGetal(x);
  function intervalTex(r) {
    const L = r.ai && r.a !== null ? '[' : ']', R = r.bi && r.b !== null ? ']' : '[';
    return `\\mathopen{${L}}{${r.a === null ? '-\\infty' : tg(r.a)}}\\,;\\,{${r.b === null ? '+\\infty' : tg(r.b)}}\\mathclose{${R}}`;
  }
  function ongelijkheidTex(r) {
    if (r.a === null && r.b === null) return 'x \\in \\mathbb{R}';
    if (r.a === null) return `x ${r.bi ? '\\leq' : '<'} ${tg(r.b)}`;
    if (r.b === null) return `x ${r.ai ? '\\geq' : '>'} ${tg(r.a)}`;
    return `${tg(r.a)} ${r.ai ? '\\leq' : '<'} x ${r.bi ? '\\leq' : '<'} ${tg(r.b)}`;
  }

  // ---------- formules ------------------------------------------------
  // grammatica: som -> term (+|- term)* ; term -> factor ((*|/|impliciet) factor)* ; factor -> -factor | macht
  // macht -> primair (^ exponent | ² | ³)? ; primair -> getal | letter | (som) | √ primair | ∛ primair
  const SUP = { '²': 2, '³': 3 };
  function tokens(invoer) {
    const s = norm(invoer).replace(/[×·•∙*]/g, '*').replace(/:/g, '/').replace(/(\d),(\d)/g, '$1.$2').replace(/\s+/g, '');
    const t = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) { const m = s.slice(i).match(/^\d*\.?\d+/); if (!m) throw new Fout('Onverwacht punt.'); t.push({ t: 'num', v: +m[0], s: m[0] }); i += m[0].length; continue; }
      if (s.startsWith('pi', i) && !/[a-zA-Z]/.test(s[i + 2] || '')) { t.push({ t: 'let', v: 'π' }); i += 2; continue; }
      if (/[a-zA-Zρπ]/.test(c)) { t.push({ t: 'let', v: c }); i++; continue; }
      if (c === '√') { t.push({ t: 'wortel', n: 2 }); i++; continue; }
      if (c === '∛') { t.push({ t: 'wortel', n: 3 }); i++; continue; }
      if (SUP[c]) { t.push({ t: 'sup', v: SUP[c] }); i++; continue; }
      if ('()^*/+-='.includes(c)) { t.push({ t: c }); i++; continue; }
      throw new Fout(`Het teken "${c}" begrijp ik niet.`);
    }
    return t;
  }
  function leesFormule(invoer) {
    const t = tokens(invoer); let i = 0;
    const kijk = () => t[i] && t[i].t, neem = () => t[i++];
    const verwacht = (x) => { if (kijk() !== x) throw new Fout(x === ')' ? 'Er ontbreekt een haakje ")".' : `Ik verwacht "${x}".`); i++; };
    const begint = () => ['num', 'let', '(', 'wortel'].includes(kijk());
    function som() { const ts = [term()]; while (kijk() === '+' || kijk() === '-') { const op = neem().t; const x = term(); ts.push(op === '-' ? { t: 'neg', x } : x); } return ts.length === 1 ? ts[0] : { t: 'som', ts }; }
    function term() {
      let a = factor();
      for (;;) {
        if (kijk() === '*') { neem(); a = { t: 'maal', a, b: factor(), punt: true }; }
        else if (kijk() === '/') { neem(); a = { t: 'deel', a, b: factor() }; }
        else if (begint()) a = { t: 'maal', a, b: factor() };
        else return a;
      }
    }
    function factor() { if (kijk() === '-') { neem(); return { t: 'neg', x: factor() }; } if (kijk() === '+') { neem(); return factor(); } return macht(); }
    function macht() {
      const b = primair();
      if (kijk() === '^') { neem(); let e; if (kijk() === '(') { neem(); e = som(); verwacht(')'); e = { t: 'haak', x: e }; } else if (kijk() === '-') { neem(); e = { t: 'neg', x: primair() }; } else e = primair(); return { t: 'macht', b, e }; }
      if (kijk() === 'sup') return { t: 'macht', b, e: { t: 'num', v: neem().v, s: '' } };
      return b;
    }
    function primair() {
      const k = kijk();
      if (k === 'num') { const x = neem(); return { t: 'num', v: x.v, s: x.s }; }
      if (k === 'let') return { t: 'let', v: neem().v };
      if (k === '(') { neem(); const x = som(); verwacht(')'); return { t: 'haak', x }; }
      if (k === 'wortel') { const n = neem().n; return { t: 'wortel', n, x: macht() }; }
      if (k === '=') throw new Fout('Schrijf enkel wat na het =-teken komt.');
      if (k === undefined) throw new Fout('Je antwoord is onvolledig.');
      throw new Fout(`Op deze plaats verwacht ik geen "${k === 'sup' ? 'exponent' : k}".`);
    }
    if (!t.length) throw new Fout('Leeg antwoord.');
    const boom = som();
    if (i < t.length) throw new Fout(kijk() === ')' ? 'Er staat een haakje ")" te veel.' : kijk() === '=' ? 'Schrijf maar één =-teken.' : 'Ik begrijp je antwoord niet helemaal.');
    return boom;
  }
  function eval_(k, env) {
    switch (k.t) {
      case 'num': return k.v;
      case 'let': if (k.v === 'π') return Math.PI; if (!(k.v in env)) throw new Fout(`De letter ${k.v} komt niet voor in de formule.`); return env[k.v];
      case 'haak': return eval_(k.x, env);
      case 'neg': return -eval_(k.x, env);
      case 'som': return k.ts.reduce((s, x) => s + eval_(x, env), 0);
      case 'maal': return eval_(k.a, env) * eval_(k.b, env);
      case 'deel': return eval_(k.a, env) / eval_(k.b, env);
      case 'macht': return Math.pow(eval_(k.b, env), eval_(k.e, env));
      case 'wortel': { const x = eval_(k.x, env); return k.n === 3 ? Math.cbrt(x) : Math.sqrt(x); }
    }
    return NaN;
  }
  const letters = (k, s = new Set()) => { if (!k || typeof k !== 'object') return s; if (k.t === 'let') s.add(k.v); ['x', 'a', 'b', 'e'].forEach(p => letters(k[p], s)); (k.ts || []).forEach(x => letters(x, s)); return s; };
  function ftex(k) {
    const zonder = (x) => x.t === 'haak' ? x.x : x;
    switch (k.t) {
      case 'num': return String(k.s || k.v).replace('.', '{,}');
      case 'let': return k.v === 'π' ? '\\pi' : k.v === 'ρ' ? '\\rho' : k.v;
      case 'haak': return `\\left(${ftex(k.x)}\\right)`;
      case 'neg': return `-${ftex(k.x)}`;
      case 'som': return k.ts.map((x, i) => x.t === 'neg' && i ? `- ${ftex(x.x)}` : (i ? '+ ' : '') + ftex(x)).join(' ');
      case 'maal': return `${ftex(k.a)}${k.punt || k.b.t === 'num' ? ' \\cdot ' : ' '}${ftex(k.b)}`;
      case 'deel': return `\\frac{${ftex(zonder(k.a))}}{${ftex(zonder(k.b))}}`;
      case 'macht': return `${['num', 'let', 'haak'].includes(k.b.t) ? ftex(k.b) : `\\left(${ftex(k.b)}\\right)`}^{${ftex(zonder(k.e))}}`;
      case 'wortel': return k.n === 2 ? `\\sqrt{${ftex(zonder(k.x))}}` : `\\sqrt[3]{${ftex(zonder(k.x))}}`;
    }
    return '';
  }
  function zonderDoel(invoer, doel) {
    let s = norm(invoer);
    if (doel) { const re = new RegExp('^\\s*' + doel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*='); s = s.replace(re, ''); }
    return s;
  }
  function formule(invoer, doel) {
    const s = zonderDoel(invoer, doel);
    if (!s.trim()) return { ok: false, leeg: true, fout: 'Vul eerst een antwoord in.' };
    try { const boom = leesFormule(s); return { ok: true, boom, tex: ftex(boom), letters: letters(boom) }; }
    catch (e) { if (e.ongeldig) return { ok: false, fout: e.message }; throw e; }
  }
  // {status, bericht}
  function controleerFormule(invoer, a) {
    const s = formule(invoer, a.doel);
    if (s.leeg) return { status: 'leeg', bericht: s.fout };
    if (!s.ok) return { status: 'ongeldig', bericht: s.fout };
    const v = formule(a.expr, a.doel);
    if (!v.ok) throw new Error('Oplossing onleesbaar: ' + a.expr);
    for (const l of s.letters) {
      if (l === 'π') continue;
      if (l === a.doel) return { status: 'fout', bericht: `${l} mag niet meer in je antwoord staan: je zoekt een formule voor ${l}.` };
      if (!a.vars.includes(l)) {
        const ander = a.vars.find(x => x.toLowerCase() === l.toLowerCase());
        return { status: 'ongeldig', bericht: ander ? `Let op hoofdletters: ${ander} en ${l} zijn verschillende grootheden.` : `De letter ${l} komt niet voor in de formule.` };
      }
    }
    for (let p = 0; p < 4; p++) {
      const env = {}; a.vars.forEach(x => { env[x] = 1.3 + Math.random() * 6; });
      let x, y;
      try { x = eval_(s.boom, env); y = eval_(v.boom, env); } catch (e) { return { status: 'ongeldig', bericht: e.message }; }
      if (!isFinite(x) || Math.abs(x - y) > 1e-7 * Math.max(1, Math.abs(y))) return { status: 'fout' };
    }
    return { status: 'juist' };
  }
  const formuleTex = (invoer, doel) => { const s = formule(invoer, doel); return s.ok ? s.tex : null; };

  return { getal, interval, ongelijkheid, gelijkeGrenzen, intervalTex, ongelijkheidTex, formule, controleerFormule, formuleTex };
})();
if (typeof module !== 'undefined') module.exports = Invoer;
