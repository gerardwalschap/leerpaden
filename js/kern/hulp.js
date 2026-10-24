// Hulpfuncties: toeval, getallen met komma, afronden, KaTeX, tekst voor rapporten.
const W = (() => {
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const kies = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const schud = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gewogen = (lijst) => { // [[waarde, gewicht], ...]
    const tot = lijst.reduce((s, x) => s + x[1], 0); let r = Math.random() * tot;
    for (const [w, g] of lijst) { if ((r -= g) < 0) return w; } return lijst[lijst.length - 1][0];
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---- getallen
  // afronden op d decimalen (correct voor halve waarden: 2,675 -> 2,68)
  function rond(x, d) {
    const f = 10 ** d, y = x * f;
    const r = Math.round(y + Math.sign(y) * Math.max(1e-12, Math.abs(y) * 1e-14));
    return (Math.sign(r) === -1 || Object.is(r, -0)) && r === 0 ? 0 : r / f;
  }
  // ligt x (bijna) op een afrondingsgrens? Dan liever een ander getal kiezen.
  function grensgeval(x, d) { const y = Math.abs(x) * 10 ** d; const fr = y - Math.floor(y); return Math.abs(fr - 0.5) < 2e-4; }
  // tekst met komma, zonder overbodige nullen ('vast' = altijd d decimalen)
  function komma(x, d = null, vast = false) {
    let s;
    if (d === null) { s = String(+(+x).toPrecision(12)); if (/e/.test(s)) s = (+x).toFixed(10).replace(/0+$/, '').replace(/\.$/, ''); }
    else { s = rond(x, d).toFixed(d); if (!vast && s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); }
    if (s === '-0') s = '0';
    return s.replace('.', ',');
  }
  const texGetal = (x, d = null, vast = false) => komma(x, d, vast).replace(',', '{,}').replace(/^-/, '-');
  const duizend = (s) => String(s).replace(/^(-?\d+)(\d{3})$/, '$1\\,$2').replace(/^(-?\d+)(\d{3})\\,(\d{3})$/, '$1\\,$2\\,$3');
  const haakjes = (x) => x < 0 ? `(${texGetal(x)})` : texGetal(x);
  const wortel = (n, a) => n === 2 ? `\\sqrt{${a}}` : `\\sqrt[${n}]{${a}}`;
  const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  // breuk p/q als TeX, vereenvoudigd
  function breukTex(p, q) {
    if (q < 0) { p = -p; q = -q; } const g = ggd(p, q) || 1; p /= g; q /= g;
    if (q === 1) return `${p}`;
    return p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
  }

  // ---- KaTeX
  function tex(s, display = false) {
    try { return katex.renderToString(String(s), { throwOnError: false, displayMode: display }); }
    catch (e) { return esc(s); }
  }
  function renderIn(el) {
    if (window.renderMathInElement) {
      renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false,
        ignoredClasses: ['geen-tex'] });
    }
  }

  // ---- TeX -> gewone tekst (voor PDF-rapporten en Excel)
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', '/': 'ᐟ' };
  const sup = (s) => String(s).split('').map(c => SUP[c] ?? c).join('');
  const SUBM = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', a: 'ₐ', x: 'ₓ' };
  const sub = (s) => String(s).split('').map(c => SUBM[c] ?? c).join('');
  function platteTekst(t) {
    let s = String(t ?? '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\$/g, '')
      .replace(/\\math(?:open|close)\{([^{}]*)\}/g, '$1').replace(/\\displaystyle/g, '').replace(/\\dfrac|\\tfrac/g, '\\frac').replace(/\\Rightarrow|\\rightarrow/g, '→').replace(/\\left|\\right|\\big|\\Big/g, '')
      .replace(/\{,\}/g, ',').replace(/\\log\s*_\s*\{([^{}]*)\}/g, (m, g) => 'log' + sub(g)).replace(/\\log_(\w)/g, (m, g) => 'log' + sub(g))
      .replace(/\\log/g, 'log').replace(/\\Leftrightarrow|\\iff/g, '⇔').replace(/\\Rightarrow|\\to|\\rightarrow/g, '→').replace(/\\square/g, '□')
      .replace(/\\mathbb\{([NZQR])\}/g, (m, l) => ({ N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ' }[l])).replace(/\\setminus/g, '\\').replace(/\\infty/g, '∞').replace(/\\varnothing|\\emptyset/g, '∅')
      .replace(/\\pi/g, 'π').replace(/\\rho/g, 'ρ').replace(/\\approx/g, '≈').replace(/\\neq/g, '≠').replace(/\\cup/g, '∪').replace(/\\subset/g, '⊂')
      .replace(/\\in\b/g, '∈').replace(/\\notin/g, '∉').replace(/\\ldots|\\dots/g, '…').replace(/\\\{/g, '⦃').replace(/\\\}/g, '⦄').replace(/\\%/g, '%').replace(/\\text(?:bf|it)?\{/g, '\\text{');
    for (let i = 0; i < 6; i++) {
      const enkel = (x) => /^[\wπρ.,−-]+$/.test(x.trim()) ? x.trim() : '(' + x + ')';
      s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => enkel(a) + '/' + enkel(b))
           .replace(/\\sqrt\[(\d+)\]\{([^{}]*)\}/g, (m, n, x) => (n === '3' ? '∛' : n === '4' ? '∜' : sup(n) + '√') + (/^[\w.,]+$/.test(x) ? x : '(' + x + ')'))
           .replace(/\\sqrt\{([^{}]*)\}/g, (m, x) => '√' + (/^[\w.,]+$/.test(x) ? x : '(' + x + ')'))
           .replace(/\^\{([-\d]+)\}/g, (m, e) => sup(e)).replace(/\^\{([^{}]*)\}/g, '^($1)').replace(/\^(\d)/g, (m, e) => sup(e))
           .replace(/_\{([^{}]*)\}/g, (m, e) => sub(e))
           .replace(/\\text\{([^{}]*)\}/g, '$1').replace(/\\mathrm\{([^{}]*)\}/g, '$1');
    }
    return s.replace(/\\(quad|qquad)/g, '  ').replace(/\\[,;: !]/g, ' ').replace(/\\geq?/g, '≥').replace(/\\leq?/g, '≤')
            .replace(/\\cdot/g, '·').replace(/\\colon/g, ':').replace(/\\times/g, '×').replace(/(^|[^\w])-/g, '$1−').replace(/[{}]/g, '').replace(/⦃/g, '{').replace(/⦄/g, '}').replace(/\s+/g, ' ').trim();
  }

  return { rnd, kies, schud, gewogen, esc, rond, grensgeval, komma, texGetal, duizend, haakjes, wortel, ggd, breukTex, tex, renderIn, platteTekst, sup, sub };
})();
