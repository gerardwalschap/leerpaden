// Antwoordvelden. Elk antwoord (v.antw) heeft een soort:
//   keuze        {opties:[{k, l, html?}], juist}               knoppen (ℚ / ℝ\ℚ, waar / niet waar, getallenassen …)
//   getal        {waarde, dec?, voor?, na?}                    getal; met dec = afronden op dec decimalen
//   expr         {expr, vormen?, voor?}                        wortelvormen, machten (rekenkern E)
//   formule      {expr, doel, vars}                            formule omvormen (hoofdlettergevoelig)
//   interval     {a, ai, b, bi}                                 [−2 ; 5[   (a/b = null betekent ∓∞)
//   ongelijkheid {a, ai, b, bi}                                 −2 ≤ x < 5
//   vakjes       {sjabloon:[{tex}|{veld, sub?, sup?, breed?}], velden:[{expr, vormen?}]}
//   delen        {delen:[{label, antw}]}                        meerdere antwoorden bij één vraag
//   V            {waarde, dec?, speciaal?: 'leeg'|'R', metSpeciaal?}  oplossingenverzameling V = {…}, V = ∅ of V = ℝ
//   veelterm     {expr, vorm?: 'uitgewerkt'|'ontbonden', voor?, tex?}  veeltermen (veeltermkern VT)
//   Vmeer        {waarden:[…], tex?:[…], dec?, leeg?: true}    V = {x₁ ; x₂} (volgorde vrij) of V = ∅
//   complex      {re, im, tex, dec?, exact?, vorm?: 'vrij'}       complex getal a + bi (rekenkern CX)
//   Vcomplex     {waarden:[{re, im}], tex:[…], dec?, exact?}    V = {z₁ ; z₂} in ℂ (volgorde vrij, ± mag)
//   hoek         {waarde, dec?, tex?}                          hoek in graden; elke gelijkwaardige hoek (± k·360°) is juist
//   functie      {expr, vorm?: 'topvorm'|'vrij', tex?, voor?}  functievoorschrift in x (rekenkern FX); vergeleken op functiewaarden
//   breuk        {t, n, voor?, vrij?}                           breuk t/n; moet onvereenvoudigbaar zijn (vrij: true = mag onvereenvoudigd)
//   verzameling  {stukken:[{a, ai, b, bi}], voor?}              oplossingsverzameling: intervallen, unie ∪, ℝ, ∅, ℝ \ {a}, {a} (rekenkern VZ)
const Antwoord = (() => {
  const esc = W.esc, T = (s) => W.tex(s);
  // ---------- breuken t/n (gehele teller en noemer)
  const ggdB = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  function leesBreuk(invoer) {
    const s = String(invoer ?? '').replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/:/g, '/');
    if (!s) return { leeg: true };
    let m = s.match(/^\(?(-?)\(?(\d+)\)?\/\(?(-?)(\d+)\)?\)?$/);
    if (m) { const t = +m[2] * (m[1] ? -1 : 1) * (m[3] ? -1 : 1), n = +m[4]; if (n === 0) return { fout: 'Je deelt door nul.' }; return { ok: true, t, n, breuk: true, negNoemer: !!m[3] }; }
    m = s.match(/^(-?)(\d+)$/);
    if (m) return { ok: true, t: +m[2] * (m[1] ? -1 : 1), n: 1 };
    const g = Invoer.getal(s);
    if (g.ok) return { ok: true, decimaal: true, waarde: g.waarde };
    return { fout: 'Typ een breuk, bv. 3/4 of -5/2.' };
  }
  const breukTex = (t, n) => n === 1 ? W.texGetal(t) : `${t < 0 ? '-' : ''}\\frac{${Math.abs(t)}}{${n}}`;
  // ---------- formule-editor (MathLive): echte breuken in het invoerveld; tekst blijft de bron van waarheid
  const ML_URL = 'https://cdn.jsdelivr.net/npm/mathlive@0.111.4/mathlive.min.js';
  let mlStatus = null;
  function laadMathLive() {
    if (mlStatus || typeof document === 'undefined') return;
    if (window.customElements && customElements.get('math-field')) { mlStatus = 'ok'; return; }
    mlStatus = 'laden';
    const sc = document.createElement('script'); sc.src = ML_URL; sc.async = true;
    sc.onload = () => { mlStatus = 'ok'; }; sc.onerror = () => { mlStatus = 'fout'; };
    document.head.appendChild(sc);
  }
  function latexNaarTekst(l) {
    let s = String(l || '');
    s = s.replace(/\\left|\\right/g, '').replace(/\\placeholder(\[[^\]]*\])?\{[^}]*\}/g, '').replace(/\\[,;:! ]/g, ' ').replace(/\{,\}/g, ',');
    s = s.replace(/\\cdot|\\times/g, '·').replace(/\\infty/g, '∞').replace(/\\leq?(?![a-z])/g, '≤').replace(/\\geq?(?![a-z])/g, '≥').replace(/\\pi(?![a-z])/g, 'π');
    s = s.replace(/\\[dt]?frac(\d)(\d)/g, '\\frac{$1}{$2}');
    const enk = (x) => /^-?[\w.,]+$/.test(x.trim());
    for (let i = 0; i < 30; i++) {
      const t = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b, off, str) => {
        const voor = off > 0 && /[\w)]/.test(str[off - 1]) ? '·' : '';
        return `${voor}${enk(a) ? a.trim() : '(' + a + ')'}/${enk(b) ? b.trim() : '(' + b + ')'}`;
      }).replace(/\\sqrt\{([^{}]*)\}/g, '√($1)').replace(/\^\{([^{}]*)\}/g, (m, a) => a.length === 1 ? '^' + a : '^(' + a + ')');
      if (t === s) break; s = t;
    }
    return s.replace(/\\mathrm|\\text|\\operatorname/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
  }
  const tekstNaarLatex = (t) => String(t || '').replace(/(-?\d+)\s*\/\s*(\d+)/g, '\\frac{$1}{$2}').replace(/·/g, '\\cdot ');
  const waarde = (el) => el && el.tagName === 'MATH-FIELD' ? latexNaarTekst(el.value) : (el ? el.value : '');

  // ---------- tekenrooster: rechten tekenen door punten aan te klikken
  const TK_KLEUR = ['#1c4e8a', '#e8772e', '#2e7d4f'];
  function tekenSVG(a, w, uit) {
    const [X0, X1] = a.x || [-8, 8], [Y0, Y1] = a.y || [-8, 8], sc = 22, m = 16, B = (X1 - X0) * sc, H = (Y1 - Y0) * sc;
    const X = (x) => m + (x - X0) * sc, Y = (y) => m + (Y1 - y) * sc;
    let g = '';
    for (let k = X0; k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>`;
    for (let k = Y0; k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>`;
    g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1)}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.3"/><line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1)}" stroke="#1f2733" stroke-width="1.3"/>`;
    for (let k = X0 + 1; k < X1; k++) if (k) g += `<text x="${X(k)}" y="${Y(0) + 12}" font-size="9" text-anchor="middle" fill="#555">${k < 0 ? '−' + (-k) : k}</text>`;
    for (let k = Y0 + 1; k < Y1; k++) if (k) g += `<text x="${X(0) - 4}" y="${Y(k) + 3}" font-size="9" text-anchor="end" fill="#555">${k < 0 ? '−' + (-k) : k}</text>`;
    g += `<text x="${X(X1) - 4}" y="${Y(0) - 5}" font-size="12" font-style="italic" text-anchor="end">x</text><text x="${X(0) + 5}" y="${Y(Y1) + 11}" font-size="12" font-style="italic">y</text>`;
    const lijn = (p, q, kl, extra = '') => {
      const dx = q[0] - p[0], dy = q[1] - p[1]; if (!dx && !dy) return '';
      const t = 100, P = [p[0] - dx * t, p[1] - dy * t], Q = [p[0] + dx * t, p[1] + dy * t];
      return `<line x1="${X(P[0])}" y1="${Y(P[1])}" x2="${X(Q[0])}" y2="${Y(Q[1])}" stroke="${kl}" stroke-width="2.4" ${extra}/>`;
    };
    if (uit) a.rechten.forEach((r) => { g += lijn([0, r.b], [1, r.a + r.b], '#9aa3b2', 'stroke-dasharray="6 5" stroke-width="1.6"'); });
    w.punten.forEach((ps, i) => { if (ps.length === 2) g += lijn(ps[0], ps[1], TK_KLEUR[i]); });
    w.punten.forEach((ps, i) => ps.forEach(p => { g += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="5" fill="${TK_KLEUR[i]}" stroke="#fff" stroke-width="1.5"/>`; }));
    return `<svg viewBox="0 0 ${B + 2 * m} ${H + 2 * m}" width="${B + 2 * m}" height="${H + 2 * m}" style="max-width:100%;height:auto;touch-action:manipulation;${uit ? '' : 'cursor:crosshair'};font-family:Verdana,sans-serif" data-x0="${X0}" data-y1="${Y1}" data-sc="${sc}" data-m="${m}" data-b="${B + 2 * m}">
      <defs><clipPath id="tkclip"><rect x="${m}" y="${m}" width="${B}" height="${H}"/></clipPath></defs><g clip-path="url(#tkclip)">${g}</g></svg>`;
  }
  const opRechte = (r, p) => Math.abs(r.a * p[0] + r.b - p[1]) < 1e-9;
  function nakijkTeken(a, w) {
    if (w.punten.some(ps => ps.length < 2)) return { status: 'leeg', bericht: 'Teken elke rechte met twee punten.' };
    const ok = (perm) => perm.every((ri, i) => w.punten[i].every(p => opRechte(a.rechten[ri], p)) && (w.punten[i][0][0] !== w.punten[i][1][0] || w.punten[i][0][1] !== w.punten[i][1][1]));
    const perms = a.rechten.length === 2 ? [[0, 1], [1, 0]] : [[0]];
    if (perms.some(ok)) return { status: 'juist' };
    const fout = w.punten.map((ps, i) => a.rechten.some(r => ps.every(p => opRechte(r, p))) ? null : i + 1).filter(Boolean);
    return { status: 'fout', bericht: fout.length ? `Rechte ${fout.join(' en ')} ligt niet juist: controleer je functiewaardentabel.` : '' };
  }

  // ---------- combinatie: met welke getallen vermenigvuldig je beide vergelijkingen zodat een onbekende wegvalt?
  function nakijkCombi(a, w) {
    const p = Invoer.getal(w.p || ''), q = Invoer.getal(w.q || '');
    if (p.leeg || q.leeg) return { status: 'leeg', bericht: 'Vul beide getallen in.' };
    if (!p.ok || !q.ok) return { status: 'ongeldig', bericht: (p.ok ? q : p).fout };
    if (!p.waarde || !q.waarde) return { status: 'fout', bericht: 'Vermenigvuldigen met 0 mag niet: dan verlies je een vergelijking.' };
    return Math.abs(p.waarde * a.c1 + q.waarde * a.c2) < 1e-9 ? { status: 'juist' } : { status: 'fout', bericht: `Met deze getallen vallen de ${a.letter}-termen niet weg bij het optellen.` };
  }
  function nakijkBreuk(a, invoer) {
    const r = leesBreuk(invoer);
    if (r.leeg) return { status: 'leeg', bericht: 'Vul eerst een antwoord in.' };
    if (r.fout) return { status: 'ongeldig', bericht: r.fout };
    const waarde = a.t / a.n;
    if (r.decimaal) return Math.abs(r.waarde - waarde) < 1e-9 ? { status: 'vorm', bericht: 'Je antwoord is juist, maar schrijf het als breuk.' } : { status: 'fout' };
    if (r.t * a.n !== a.t * r.n) return { status: 'fout' };
    if (!a.vrij && ggdB(r.t, r.n) > 1 && r.n !== 1) return { status: 'vorm', bericht: r.t % r.n === 0 ? 'Je antwoord is juist, maar het is een geheel getal: schrijf het zonder breukstreep.' : 'Je antwoord is juist, maar vereenvoudig de breuk nog.' };
    if (r.negNoemer) return { status: 'vorm', bericht: 'Zet het minteken vóór de breuk, niet in de noemer.' };
    return { status: 'juist' };
  }
  let laatste = null; // id van het laatst gebruikte tekstveld

  // ---------- toestand
  function leeg(a) {
    if (a.soort === 'keuze') return { keuze: null };
    if (a.soort === 'vakjes') return { vakjes: a.velden.map(() => '') };
    if (a.soort === 'delen') return { delen: a.delen.map(d => leeg(d.antw)) };
    if (a.soort === 'V' || a.soort === 'Vmeer') return { invoer: '', speciaal: null };
    if (a.soort === 'teken') return { punten: a.rechten.map(() => []), actief: 0 };
    if (a.soort === 'wt') return LG.wtLeeg(a);
    if (a.soort === 'schakeling') return LG.bouwLeeg(a);
    if (a.soort === 'combi') return { p: '', q: '' };
    return { invoer: '' };
  }

  // ---------- lezen voor de voorbeeldweergave
  function lezing(a, invoer) {
    const s = String(invoer || '');
    if (!s.trim()) return { leeg: true };
    if (a.soort === 'expr') { const r = E.ontleed(s); return r.ok ? { tex: r.tex } : { fout: r.fout }; }
    if (a.soort === 'veelterm') { const r = VT.ontleed(s); return r.ok ? { tex: r.tex } : { fout: r.fout }; }
    if (a.soort === 'formule') { const r = Invoer.formule(s, a.doel); return r.ok ? { tex: `${a.doel} = ${r.tex}` } : { fout: r.fout }; }
    if (a.soort === 'interval') { const r = Invoer.interval(s); return r.ok ? { tex: Invoer.intervalTex(r) } : { fout: r.fout }; }
    if (a.soort === 'ongelijkheid') { const r = Invoer.ongelijkheid(s); return r.ok ? { tex: Invoer.ongelijkheidTex(r) } : { fout: r.fout }; }
    if (a.soort === 'complex') { const r = CX.ontleed(s); return r.ok ? { tex: r.tex } : { fout: r.fout }; }
    if (a.soort === 'breuk') { const r = leesBreuk(s); return r.ok ? { tex: (a.voor ? a.voor + ' ' : '') + (r.decimaal ? W.texGetal(r.waarde) : r.n === 1 ? W.texGetal(r.t) : `${r.t < 0 ? '-' : ''}\\frac{${Math.abs(r.t)}}{${r.n}}`) } : { fout: r.fout }; }
    if (a.soort === 'verzameling') { const r = VZ.ontleed(s); return r.ok ? { tex: (a.voor ? a.voor + ' ' : '') + r.tex } : { fout: r.fout }; }
    if (a.soort === 'functie') { const r = FX.ontleed(s); return r.ok ? { tex: (a.voor ? a.voor + ' ' : '') + r.tex } : { fout: r.fout }; }
    if (a.soort === 'Vcomplex') { const t = CX.texV(s); if (t) return { tex: t }; const f = CX.splitsV(s).map(CX.ontleed).find(x => !x.ok); return { fout: f ? f.fout : 'Dit kan ik niet lezen.' }; }
    return null;
  }
  const metVoorbeeld = (a) => ['expr', 'veelterm', 'formule', 'interval', 'ongelijkheid', 'complex', 'Vcomplex', 'functie', 'verzameling', 'breuk'].includes(a.soort);
  function voorbeeld(a, invoer) {
    const l = lezing(a, invoer);
    if (!l || l.leeg) return '<span class="klein">Je antwoord verschijnt hier.</span>';
    return l.tex ? `<span class="klein">Gelezen als:</span> ${T(l.tex)}` : `<span class="klein fouttekst">${esc(l.fout)}</span>`;
  }

  // ---------- HTML
  const PLACEHOLDER = { getal: 'antwoord', expr: 'antwoord', veelterm: 'antwoord', formule: 'formule', interval: 'bv. [−2 ; 5[', ongelijkheid: 'bv. −2 ≤ x < 5', complex: 'bv. 3 − 2i', functie: 'bv. 2(x − 1)² + 5', verzameling: 'bv. ]−∞, 2[ ∪ ]3, +∞[', breuk: 'bv. 3/4', Vcomplex: 'bv. 3 + 2i ; 3 − 2i', hoek: 'graden' };
  function html(id, a, w, uit) {
    const dis = uit ? 'disabled' : '';
    if (a.soort === 'keuze') {
      return `<div class="keuzes ${a.opties.some(o => o.html && /<svg/.test(o.l)) ? 'groot' : ''}" id="${id}" role="group">${a.opties.map(o =>
        `<button type="button" class="keuze ${w.keuze === o.k ? 'aan' : ''}" data-kid="${id}" data-k="${esc(o.k)}" ${dis} aria-pressed="${w.keuze === o.k}">${o.html ? o.l : T(o.l)}</button>`).join('')}</div>`;
    }
    if (a.soort === 'vakjes') {
      const delen = a.sjabloon.map(s => {
        if (s.tex !== undefined) return `<span class="vt">${T(s.tex)}</span>`;
        return `<input type="text" id="${id}-${s.veld}" data-veld="${s.veld}" class="vak${s.sub ? ' sub' : ''}${s.sup ? ' sup' : ''}${s.breed ? ' breed' : ''}" value="${esc(w.vakjes[s.veld])}" autocomplete="off" autocapitalize="none" spellcheck="false" ${dis} aria-label="vakje ${s.veld + 1}">`;
      }).join('');
      return `<div class="vakjesrij">${delen}</div>`;
    }
    if (a.soort === 'delen') {
      return `<div class="deelvragen">${a.delen.map((d, i) => `<div class="deelvraag"><div class="dlabel">${d.html ? d.label : T(d.label)}</div>
        <div class="dveld">${html(`${id}-d${i}`, d.antw, w.delen[i], uit)}</div></div>`).join('')}</div>`;
    }
    if (a.soort === 'Vmeer') {
      const sp = w.speciaal;
      return `<div class="antwoordrij vrij"><span class="is">${T('V = \\{')}</span>
          <input type="text" class="veld${sp ? ' uitgeschakeld' : ''}" id="${id}" value="${esc(sp ? '' : w.invoer)}" placeholder="${sp ? '' : 'bv. 2 ; -3'}" autocomplete="off" autocapitalize="none" spellcheck="false" inputmode="text" ${dis}>
          <span class="is">${T('\\}')}</span>
          <span class="of">of</span><button type="button" class="keuze vsp ${sp === 'leeg' ? 'aan' : ''}" data-vid="${id}" data-s="leeg" ${dis}>${T('V = \\varnothing')}</button></div>`;
    }
    if (a.soort === 'V') {
      const sp = w.speciaal;
      return `<div class="antwoordrij vrij"><span class="is">${T('V = \\{')}</span>
          <input type="text" class="veld${sp ? ' uitgeschakeld' : ''}" id="${id}" value="${esc(sp ? '' : w.invoer)}" placeholder="${sp ? '' : 'oplossing'}" autocomplete="off" autocapitalize="none" spellcheck="false" inputmode="text" ${dis}>
          <span class="is">${T('\\}')}</span>
          ${a.metSpeciaal ? `<span class="of">of</span><button type="button" class="keuze vsp ${sp === 'leeg' ? 'aan' : ''}" data-vid="${id}" data-s="leeg" ${dis}>${T('V = \\varnothing')}</button><button type="button" class="keuze vsp ${sp === 'R' ? 'aan' : ''}" data-vid="${id}" data-s="R" ${dis}>${T('V = \\mathbb{R}')}</button>` : ''}</div>`;
    }
    if (a.soort === 'teken') {
      return `<div class="tekenrooster" id="${id}">${uit ? '' : `<div class="tk-legende">${a.rechten.map((r, i) => `<button type="button" class="keuze tk-r ${(w.actief || 0) === i ? 'aan' : ''}" data-tid="${id}" data-r="${i}" style="border-color:${TK_KLEUR[i]}"><span style="color:${TK_KLEUR[i]}">●</span> ${T(r.tex)}</button>`).join('')}</div>
        <p class="klein">Kies een rechte en klik twee punten aan. Klik op een punt om het weg te halen.</p>`}
        <div class="tk-svg" id="${id}-svg">${tekenSVG(a, w, uit)}</div></div>`;
    }
    if (a.soort === 'wt') return LG.wtHTML(id, a, w, uit, T);
    if (a.soort === 'schakeling') return LG.bouwHTML(id, a, w, uit);
    if (a.soort === 'combi') {
      const v = (k, lab) => `<span class="is">${T(lab)}</span><input type="text" class="veld" id="${id}-${k}" value="${esc(w[k] || '')}" autocomplete="off" spellcheck="false" ${dis} style="width:80px">`;
      return `<div class="antwoordrij">${v('p', a.label1 || '\\text{vgl. 1} \\;\\cdot')}&nbsp;&nbsp;${v('q', a.label2 || '\\text{vgl. 2} \\;\\cdot')}</div>`;
    }
    if (a.editor) laadMathLive();
    const breed = a.soort !== 'getal' ? ' expr' : '';
    return `<div class="antwoordrij">${a.voor !== '' ? `<span class="is">${T(a.voor || (a.soort === 'formule' ? a.doel + ' =' : '='))}</span>` : ''}
        <input type="text" class="veld${breed}" id="${id}" value="${esc(w.invoer)}" placeholder="${a.placeholder || PLACEHOLDER[a.soort] || ''}" autocomplete="off" autocapitalize="none" spellcheck="false" ${a.editor ? 'data-editor="1"' : ''} ${dis}>
        ${a.na ? `<span class="na">${T(a.na)}</span>` : ''}</div>
      ${metVoorbeeld(a) && !uit && !a.editor ? `<div class="voorbeeld" id="${id}-vb">${voorbeeld(a, w.invoer)}</div>` : ''}`;
  }

  // ---------- toetsenbord
  function toetsen(a, set = new Set()) {
    if (a.soort === 'expr') set.add('wortel');
    if (a.soort === 'veelterm') set.add('veelterm');
    if (a.soort === 'formule') set.add('formule');
    if (a.soort === 'interval') set.add('interval');
    if (a.soort === 'ongelijkheid') set.add('ongelijkheid');
    if (a.soort === 'complex') set.add('complex');
    if (a.soort === 'Vcomplex') { set.add('complex'); set.add('Vcomplex'); }
    if (a.soort === 'hoek') set.add('hoek');
    if (a.soort === 'functie') set.add('functie');
    if (a.soort === 'verzameling') set.add('verzameling');
    if (a.soort === 'breuk') set.add('breuk');
    if (a.soort === 'delen') a.delen.forEach(d => toetsen(d.antw, set));
    if (a.editor) set.add('editor');
    if (a.toetsen) a.toetsen.forEach(t => set.add(t));
    return set;
  }
  const heeftToetsenbord = (a) => toetsen(a).size > 0;
  function toetsenbord(sets) {
    const k = (txt, label, titel) => `<button type="button" class="tk" data-ins="${esc(txt)}" title="${esc(titel || '')}">${label}</button>`;
    const s = sets instanceof Set ? sets : new Set(sets);
    let h = '';
    if (s.has('wortel')) h += k('√()', '√', 'vierkantswortel') + k('∛()', '∛', 'derdemachtswortel') + k('∜()', '∜', 'vierdemachtswortel')
      + `<span class="nwortel"><select class="tk-n" aria-label="wortelexponent">${[5, 6, 7, 8, 9, 10, 12].map(n => `<option value="${n}">${n}</option>`).join('')}</select>${k('N', 'ⁿ√', 'wortel met gekozen exponent')}</span>`
      + k('^()', 'xⁿ', 'exponent') + k('^(/)', 'x<sup>p/q</sup>', 'breuk als exponent') + k('/', '/', 'breukstreep') + k('()', '( )', 'haakjes') + k('·', '·', 'maal');
    if (s.has('veelterm')) h += k('²', 'x²', 'kwadraat') + k('³', 'x³', 'derde macht') + k('^()', 'xⁿ', 'exponent') + k('()', '( )', 'haakjes') + k('·', '·', 'maal') + k('/', '/', 'breukstreep');
    if (s.has('formule')) h += (s.has('wortel') ? '' : k('√()', '√', 'vierkantswortel') + k('∛()', '∛', 'derdemachtswortel') + k('/', '/', 'breukstreep') + k('()', '( )', 'haakjes') + k('·', '·', 'maal') + k('^()', 'xⁿ', 'exponent'))
      + k('²', 'x²', 'kwadraat') + k('π', 'π', 'pi') + k('ρ', 'ρ', 'rho (massadichtheid)');
    if (s.has('interval')) h += k('[', '[', 'haakje') + k(']', ']', 'haakje') + k(' ; ', ';', 'puntkomma') + k('-∞', '−∞', 'min oneindig') + k('+∞', '+∞', 'plus oneindig');
    if (s.has('ongelijkheid')) h += k('x', 'x', 'x') + k(' < ', '<', 'kleiner dan') + k(' ≤ ', '≤', 'kleiner dan of gelijk aan') + k(' > ', '>', 'groter dan') + k(' ≥ ', '≥', 'groter dan of gelijk aan');
    if (s.has('complex')) h += k('i', '<i>i</i>', 'complexe eenheid i') + (s.has('wortel') ? '' : k('√()', '√', 'vierkantswortel') + k('/', '/', 'breukstreep') + k('()', '( )', 'haakjes') + k('·', '·', 'maal')) + k('²', 'x²', 'kwadraat');
    if (s.has('Vcomplex')) h += k(' ; ', ';', 'puntkomma tussen de oplossingen') + k('±', '±', 'plus of min');
    if (s.has('hoek')) h += k('°', '°', 'graden');
    if (s.has('breuk') && !s.has('functie') && !s.has('complex')) h += k('/', '/', 'breukstreep');
    if (s.has('verzameling')) h += k('[', '[', 'haakje [') + k(']', ']', 'haakje ]') + k(', ', ',', 'komma tussen de grenzen') + k(' ∪ ', '∪', 'unie') + k('-∞', '−∞', 'min oneindig') + k('+∞', '+∞', 'plus oneindig')
      + k('ℝ', 'ℝ', 'alle reële getallen') + k('∅', '∅', 'lege verzameling') + k(' \\ ', '\\', 'zonder') + k('{}', '{ }', 'accolades');
    if (s.has('functie')) h += k('x', '<i>x</i>', 'x') + k('²', 'x²', 'kwadraat') + k('³', 'x³', 'derde macht') + k('√()', '√', 'vierkantswortel') + k('()', '( )', 'haakjes') + k('/', '/', 'breukstreep');
    if (s.has('editor')) { const kb = k('/', '<span class="tk-breuk"><span>a</span><span>b</span></span>', 'breuk'); h = h.includes('data-ins="/"') ? h.replace(/<button[^>]*data-ins="\/"[^>]*>[^<]*<\/button>/, kb) : kb + h; }
    if (!h) return '';
    return `<div class="toetsenbord" role="toolbar" aria-label="Wiskundige tekens">${h}${k('⌫', '⌫', 'wis laatste teken')}</div>`;
  }
  function voegIn(el, txt) {
    if (el.tagName === 'MATH-FIELD') {
      const L = { '/': '\\frac{#@}{#?}', '()': '\\left(#0\\right)', '²': '^2', '³': '^3', '^()': '^{#0}', '·': '\\cdot ', '√()': '\\sqrt{#0}' };
      if (txt === '⌫') el.executeCommand('deleteBackward'); else el.executeCommand(['insert', L[txt] ?? txt]);
      el.focus(); return;
    }
    const begin = el.selectionStart ?? el.value.length, eind = el.selectionEnd ?? el.value.length;
    if (txt === '⌫') {
      const b = begin === eind ? Math.max(0, begin - 1) : begin;
      el.value = el.value.slice(0, b) + el.value.slice(eind); el.setSelectionRange(b, b);
    } else {
      el.value = el.value.slice(0, begin) + txt + el.value.slice(eind);
      let pos = begin + txt.length;
      if (txt.endsWith('()') || txt === '{}') pos -= 1; else if (txt === '^(/)') pos -= 2;
      el.setSelectionRange(pos, pos);
    }
    el.focus();
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  const SUPC = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function koppelToetsenbord(root) {
    root.querySelectorAll('.toetsenbord').forEach(tb => {
      tb.querySelectorAll('button.tk').forEach(b => {
        b.onmousedown = (e) => e.preventDefault();
        b.onclick = () => {
          const el = laatste && document.getElementById(laatste);
          const doel = el && !el.disabled && root.contains(el) ? el : root.querySelector('math-field.veld:not([read-only]), input.veld:not([disabled]), input.vak:not([disabled])');
          if (!doel) return;
          let txt = b.dataset.ins;
          if (txt === 'N') txt = String(tb.querySelector('.tk-n').value).split('').map(c => SUPC[+c]).join('') + '√()';
          voegIn(doel, txt);
        };
      });
    });
  }

  // ---------- events
  // geeft de lijst van invoervelden (in volgorde) terug
  function koppel(id, a, w, opts = {}) {
    const velden = [];
    (function rec(id, a, w) {
      if (a.soort === 'keuze') {
        document.querySelectorAll(`button.keuze[data-kid="${id}"]`).forEach(b => {
          b.onclick = () => {
            w.keuze = b.dataset.k;
            document.querySelectorAll(`button.keuze[data-kid="${id}"]`).forEach(x => { x.classList.toggle('aan', x === b); x.setAttribute('aria-pressed', x === b); });
            opts.bijWijziging && opts.bijWijziging();
          };
        });
        return;
      }
      if (a.soort === 'delen') { a.delen.forEach((d, i) => rec(`${id}-d${i}`, d.antw, w.delen[i])); return; }
      if (a.soort === 'teken') {
        const box = document.getElementById(`${id}-svg`); if (!box) return;
        const teken = () => { box.innerHTML = tekenSVG(a, w, false); };
        document.querySelectorAll(`button.tk-r[data-tid="${id}"]`).forEach(b => { b.onclick = () => { w.actief = +b.dataset.r; document.querySelectorAll(`button.tk-r[data-tid="${id}"]`).forEach(x => x.classList.toggle('aan', x === b)); }; });
        box.onclick = (e) => {
          const svg = box.querySelector('svg'); if (!svg) return;
          const r = svg.getBoundingClientRect(), f = +svg.dataset.b / r.width, sc = +svg.dataset.sc, m = +svg.dataset.m;
          const x = Math.round((e.clientX - r.left) * f / sc - m / sc + +svg.dataset.x0), y = Math.round(+svg.dataset.y1 - ((e.clientY - r.top) * f - m) / sc);
          let weg = false;
          w.punten.forEach(ps => { const j = ps.findIndex(p => p[0] === x && p[1] === y); if (j >= 0) { ps.splice(j, 1); weg = true; } });
          if (!weg) {
            const ps = w.punten[w.actief || 0]; ps.push([x, y]); if (ps.length > 2) ps.shift();
            if (ps.length === 2) { const v = w.punten.findIndex(q => q.length < 2); if (v >= 0) { w.actief = v; document.querySelectorAll(`button.tk-r[data-tid="${id}"]`).forEach(xb => xb.classList.toggle('aan', +xb.dataset.r === v)); } }
          }
          teken(); opts.bijWijziging && opts.bijWijziging();
        };
        return;
      }
      if (a.soort === 'combi') { ['p', 'q'].forEach(k => { const el = document.getElementById(`${id}-${k}`); if (el) velden.push({ el, zet: (v) => { w[k] = v; }, a }); }); return; }
      if (a.soort === 'wt') { LG.wtKoppel(id, a, w, opts); return; }
      if (a.soort === 'schakeling') { LG.bouwKoppel(id, a, w, opts); return; }
      if (a.soort === 'vakjes') { a.velden.forEach((_, i) => { const el = document.getElementById(`${id}-${i}`); if (el) velden.push({ el, zet: (v) => { w.vakjes[i] = v; }, a }); }); return; }
      if (a.soort === 'V' || a.soort === 'Vmeer') {
        const el = document.getElementById(id);
        const knoppen = document.querySelectorAll(`button.vsp[data-vid="${id}"]`);
        const toon = () => { knoppen.forEach(x => x.classList.toggle('aan', x.dataset.s === w.speciaal)); if (el) { el.classList.toggle('uitgeschakeld', !!w.speciaal); if (w.speciaal) el.value = ''; } };
        knoppen.forEach(b => { b.onclick = () => { w.speciaal = w.speciaal === b.dataset.s ? null : b.dataset.s; if (w.speciaal) w.invoer = ''; toon(); opts.bijWijziging && opts.bijWijziging(); }; });
        if (el) velden.push({ el, zet: (v) => { w.invoer = v; if (v && w.speciaal) { w.speciaal = null; toon(); } }, a });
        return;
      }
      const el = document.getElementById(id);
      if (el) velden.push({ el, zet: (v) => { w.invoer = v; }, a, vb: document.getElementById(`${id}-vb`) });
    })(id, a, w);
    const bind = (v, n) => {
      v.el.addEventListener('focus', () => { laatste = v.el.id; });
      v.el.addEventListener('input', () => {
        v.zet(waarde(v.el));
        if (v.vb) v.vb.innerHTML = voorbeeld(v.a, waarde(v.el));
        opts.bijWijziging && opts.bijWijziging();
      });
      v.el.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const volgende = velden[n + 1] && velden[n + 1].el;
        if (volgende && !volgende.disabled && !volgende.readOnly) volgende.focus(); else opts.bijEnter && opts.bijEnter();
      });
    };
    // invoerveld vervangen door een formule-editor (echte breuken), zodra MathLive geladen is
    const upgrade = (v, n) => {
      const inp = v.el; if (!inp.isConnected || inp.tagName === 'MATH-FIELD') return;
      const mf = document.createElement('math-field');
      mf.id = inp.id; mf.className = inp.className + ' mf'; mf.setAttribute('math-virtual-keyboard-policy', 'manual');
      if (inp.placeholder) mf.setAttribute('placeholder', '\\text{' + inp.placeholder.replace(/[\\{}]/g, '') + '}');
      const focus = document.activeElement === inp;
      inp.replaceWith(mf);
      try { mf.menuItems = []; mf.smartFence = false; mf.inlineShortcuts = {}; mf.mathModeSpace = '\\,'; } catch (e) { /* oudere versie */ }
      mf.value = tekstNaarLatex(inp.value);
      if (inp.disabled) mf.readOnly = true;
      v.el = mf; bind(v, n);
      if (focus) mf.focus();
    };
    velden.forEach((v, n) => {
      bind(v, n);
      if (v.a && v.a.editor && typeof customElements !== 'undefined') {
        if (customElements.get('math-field')) upgrade(v, n);
        else { laadMathLive(); customElements.whenDefined('math-field').then(() => upgrade(v, n)); }
      }
    });
    return velden.map(v => v.el);
  }

  function lees(id, a, w) {
    if (a.soort === 'keuze') return;
    if (a.soort === 'delen') return a.delen.forEach((d, i) => lees(`${id}-d${i}`, d.antw, w.delen[i]));
    if (a.soort === 'vakjes') return a.velden.forEach((_, i) => { const el = document.getElementById(`${id}-${i}`); if (el) w.vakjes[i] = el.value; });
    if (a.soort === 'teken' || a.soort === 'wt' || a.soort === 'schakeling') return;
    if (a.soort === 'combi') { ['p', 'q'].forEach(k => { const el = document.getElementById(`${id}-${k}`); if (el) w[k] = el.value; }); return; }
    const el = document.getElementById(id); if (el) w.invoer = waarde(el);
  }

  function isIngevuld(a, w) {
    if (a.soort === 'keuze') return w.keuze !== null && w.keuze !== undefined;
    if (a.soort === 'vakjes') return w.vakjes.every(x => String(x).trim());
    if (a.soort === 'delen') return a.delen.every((d, i) => isIngevuld(d.antw, w.delen[i]));
    if (a.soort === 'V' || a.soort === 'Vmeer') return !!w.speciaal || !!String(w.invoer || '').trim();
    if (a.soort === 'teken') return w.punten.every(ps => ps.length === 2);
    if (a.soort === 'wt') return LG.wtIngevuld(a, w);
    if (a.soort === 'schakeling') return LG.bouwIngevuld(a, w);
    if (a.soort === 'combi') return !!String(w.p || '').trim() && !!String(w.q || '').trim();
    return !!String(w.invoer || '').trim();
  }

  // ---------- nakijken: {status: juist | fout | vorm | ongeldig | leeg, bericht}
  function nakijkGetal(a, invoer) {
    const g = Invoer.getal(invoer);
    if (g.leeg) return { status: 'leeg', bericht: g.fout };
    if (!g.ok) return { status: 'ongeldig', bericht: g.fout };
    if (a.dec === undefined || a.dec === null) {
      if (Math.abs(g.waarde - a.waarde) < 1e-9) return { status: 'juist' };
      return { status: 'fout' };
    }
    const doel = W.rond(a.waarde, a.dec);
    if (Math.abs(g.waarde - doel) < 1e-9 && (g.decimalen <= a.dec || W.rond(g.waarde, a.dec) === g.waarde)) return { status: 'juist' };
    if (g.decimalen > a.dec && Math.abs(W.rond(g.waarde, a.dec) - doel) < 1e-9) return { status: 'vorm', bericht: `Rond af op ${a.dec} ${a.dec === 1 ? 'decimaal' : 'decimalen'}.` };
    return { status: 'fout' };
  }
  // V = {…}: exacte waarde (ook als breuk) of juist afgerond op a.dec decimalen
  const zonderV = (s) => String(s ?? '').replace(/^\s*V\s*=\s*/i, '').replace(/^\s*\{\s*|\s*\}\s*$/g, '').replace(/^\s*x\s*=\s*/i, '');
  function nakijkV(a, w) {
    if (w.speciaal) return { status: a.speciaal === w.speciaal ? 'juist' : 'fout' };
    const inv = zonderV(w.invoer);
    if (!inv.trim()) return { status: 'leeg', bericht: a.metSpeciaal ? 'Vul de oplossing in, of kies V = ∅ of V = ℝ.' : 'Vul de oplossing in.' };
    if (/[∅øØ]|leeg|^\s*R\s*$|ℝ/i.test(inv)) return { status: 'ongeldig', bericht: a.metSpeciaal ? 'Klik op de knop V = ∅ of V = ℝ.' : 'Typ één getal.' };
    const g = Invoer.getal(inv);
    if (!g.ok) return { status: 'ongeldig', bericht: g.fout };
    if (a.speciaal) return { status: 'fout' };
    if (Math.abs(g.waarde - a.waarde) < 1e-9) return { status: 'juist' };
    return nakijkGetal({ waarde: a.waarde, dec: a.dec ?? 2 }, inv);
  }
  // V = {x₁ ; x₂}: elke oplossing exact (ook als breuk) of juist afgerond op a.dec decimalen, volgorde vrij
  function nakijkVmeer(a, w) {
    const verwacht = a.leeg ? [] : a.waarden;
    if (w.speciaal) return { status: verwacht.length === 0 ? 'juist' : 'fout' };
    const inv = zonderV(w.invoer);
    if (!inv.trim()) return { status: 'leeg', bericht: 'Vul de oplossing(en) in, of kies V = ∅.' };
    if (/[∅øØ]|leeg/i.test(inv)) return { status: 'ongeldig', bericht: 'Klik op de knop V = ∅.' };
    if (/\d\s*,\s+-?\d|\d\s+,\s*-?\d/.test(inv)) return { status: 'ongeldig', bericht: 'Zet een puntkomma ; tussen de oplossingen (de komma is voor decimalen).' };
    const delen = inv.split(/;|\bof\b/i).map(x => x.replace(/^\s*x\s*[₁₂12]?\s*=\s*/i, '').trim()).filter(Boolean);
    const gs = [];
    for (const d of delen) { const g = Invoer.getal(d); if (!g.ok) return { status: 'ongeldig', bericht: g.fout }; gs.push({ d, g }); }
    const uniek = gs.filter((x, i) => gs.findIndex(y => Math.abs(y.g.waarde - x.g.waarde) < 1e-9) === i);
    if (uniek.length !== verwacht.length) return { status: 'fout' };
    const vrij = verwacht.slice(); let vorm = null;
    for (const x of uniek) {
      const i = vrij.findIndex(v => Math.abs(v - x.g.waarde) < 1e-9 || nakijkGetal({ waarde: v, dec: a.dec ?? 2 }, x.d).status === 'juist');
      if (i >= 0) { vrij.splice(i, 1); continue; }
      const j = vrij.findIndex(v => nakijkGetal({ waarde: v, dec: a.dec ?? 2 }, x.d).status === 'vorm');
      if (j >= 0) { vrij.splice(j, 1); vorm = `Rond af op ${a.dec ?? 2} decimalen.`; continue; }
      return { status: 'fout' };
    }
    return vorm ? { status: 'vorm', bericht: vorm } : { status: 'juist' };
  }
  function nakijk(a, w) {
    switch (a.soort) {
      case 'V': return nakijkV(a, w);
      case 'Vmeer': return nakijkVmeer(a, w);
      case 'veelterm': return VT.controleer(w.invoer, a.expr, a.vorm);
      case 'keuze':
        if (w.keuze === null || w.keuze === undefined) return { status: 'leeg', bericht: 'Kies een antwoord.' };
        return { status: String(w.keuze) === String(a.juist) ? 'juist' : 'fout' };
      case 'getal': return nakijkGetal(a, w.invoer);
      case 'complex': return CX.controleer(w.invoer, a);
      case 'functie': return FX.controleer(w.invoer, a);
      case 'verzameling': return VZ.controleer(w.invoer, a);
      case 'breuk': return nakijkBreuk(a, w.invoer);
      case 'teken': return nakijkTeken(a, w);
      case 'wt': return LG.wtNakijk(a, w);
      case 'schakeling': return LG.bouwNakijk(a, w);
      case 'combi': return nakijkCombi(a, w);
      case 'Vcomplex': return CX.controleerV(w.invoer, a);
      case 'hoek': {
        const t = CX.zonderGraden(w.invoer), gg = Invoer.getal(t);
        if (gg.leeg || !t) return { status: 'leeg', bericht: 'Vul eerst een antwoord in.' };
        if (!gg.ok) return { status: 'ongeldig', bericht: 'Typ de hoek in graden, bv. 53,13 (zonder radialen).' };
        const doel = a.waarde + 360 * Math.round((gg.waarde - a.waarde) / 360);
        return nakijkGetal({ waarde: doel, dec: a.dec ?? 2 }, t);
      }
      case 'expr': return E.controleer(w.invoer, a.expr, a.vormen || []);
      case 'formule': return Invoer.controleerFormule(w.invoer, a);
      case 'interval': case 'ongelijkheid': {
        const r = a.soort === 'interval' ? Invoer.interval(w.invoer) : Invoer.ongelijkheid(w.invoer);
        if (r.leeg) return { status: 'leeg', bericht: r.fout };
        if (!r.ok) return { status: 'ongeldig', bericht: r.fout };
        if (!Invoer.gelijkeGrenzen(a, r)) return { status: 'fout' };
        if (r.oneindigBinnen) return { status: 'vorm', bericht: 'Bij −∞ en +∞ staat het haakje altijd naar buiten.' };
        return { status: 'juist' };
      }
      case 'vakjes': {
        const r = a.velden.map((f, i) => f.getal ? nakijkGetal(f, w.vakjes[i]) : E.controleer(w.vakjes[i], f.expr, f.vormen || []));
        if (r.some(x => x.status === 'leeg')) return { status: 'leeg', bericht: 'Vul alle vakjes in.' };
        const ong = r.findIndex(x => x.status === 'ongeldig');
        if (ong >= 0) return { status: 'ongeldig', bericht: `Vakje ${ong + 1}: ${r[ong].bericht}` };
        if (r.some(x => x.status === 'fout')) return { status: 'fout' };
        const vorm = r.find(x => x.status === 'vorm');
        return vorm ? vorm : { status: 'juist' };
      }
      case 'delen': {
        const r = a.delen.map((d, i) => nakijk(d.antw, w.delen[i]));
        const per = r.map(x => x.status === 'juist');
        if (r.some(x => x.status === 'leeg')) return { status: 'leeg', bericht: 'Vul alle onderdelen in.', per };
        const ong = r.findIndex(x => x.status === 'ongeldig');
        if (ong >= 0) return { status: 'ongeldig', bericht: `${a.delen.length > 1 ? `Onderdeel ${ong + 1}: ` : ''}${r[ong].bericht}`, per };
        if (r.some(x => x.status === 'fout')) { const f = r.find(x => x.status === 'fout' && x.bericht); return { status: 'fout', per, bericht: f && f.bericht }; }
        const vorm = r.find(x => x.status === 'vorm');
        return vorm ? { ...vorm, per } : { status: 'juist', per };
      }
    }
    return { status: 'fout' };
  }

  // ---------- juiste antwoord als TeX / HTML / tekst
  function juistTex(a) {
    const g = (x, d) => W.texGetal(d !== undefined && d !== null ? W.rond(x, d) : x);
    switch (a.soort) {
      case 'getal': return g(a.waarde, a.dec) + (a.na ? '\\ ' + a.na : '');
      case 'V': return a.speciaal === 'leeg' ? 'V = \\varnothing' : a.speciaal === 'R' ? 'V = \\mathbb{R}' : `V = \\{${g(a.waarde, a.dec ?? 2)}\\}`;
      case 'expr': return a.tex || E.texVan(a.expr);
      case 'complex': return a.tex || CX.texAbi(a.re, a.im);
      case 'breuk': return (a.voor ? a.voor + ' ' : '') + breukTex(a.t, a.n);
      case 'teken': return a.rechten.map(r => r.tex).join(' \\quad \\text{en} \\quad ');
      case 'wt': return LG.wtTex(a);
      case 'schakeling': return a.tex;
      case 'combi': { const g0 = ggdB(a.c1, a.c2) || 1; let p = a.c2 / g0, q = -a.c1 / g0; if (p < 0) { p = -p; q = -q; } return `\\text{bv. vgl. 1} \\cdot ${W.texGetal(p)} \\text{ en vgl. 2} \\cdot ${q < 0 ? '(' + W.texGetal(q) + ')' : W.texGetal(q)}`; }
      case 'verzameling': return (a.voor ? a.voor + ' ' : '') + VZ.texVan(a.stukken);
      case 'functie': return (a.voor ? a.voor + ' ' : '') + (a.tex || FX.texVan(a.expr));
      case 'Vcomplex': return `V = \\{${(a.tex || a.waarden.map(z => CX.texAbi(z.re, z.im))).join('\\,;\\,')}\\}`;
      case 'hoek': return (a.tex || g(a.waarde, Number.isInteger(a.waarde) ? undefined : (a.dec ?? 2))) + '^\\circ';
      case 'veelterm': return a.tex || VT.texVan(a.expr);
      case 'Vmeer': {
        if (a.leeg || !a.waarden.length) return 'V = \\varnothing';
        const ts = a.waarden.map((x, i) => a.tex && a.tex[i] ? a.tex[i] : g(x, Number.isInteger(x) ? undefined : (a.dec ?? 2)));
        return `V = \\{${ts.join('\\,;\\,')}\\}`;
      }
      case 'formule': return `${a.doel} = ${a.tex || Invoer.formuleTex(a.expr, a.doel)}`;
      case 'interval': return Invoer.intervalTex(a);
      case 'ongelijkheid': return Invoer.ongelijkheidTex(a);
      case 'vakjes': return a.sjabloon.map(s => {
        if (s.tex !== undefined) return s.tex;
        const f = a.velden[s.veld], t = f.getal ? g(f.waarde, f.dec) : (f.tex || E.texVan(f.expr));
        return s.sub ? `_{${t}}` : s.sup ? `^{${t}}` : ` {${t}} `;
      }).join(' ');
    }
    return null;
  }
  function juistHTML(a) {
    if (a.soort === 'keuze') { const o = a.opties.find(x => String(x.k) === String(a.juist)); return o ? (o.html ? o.l : T(o.l)) : '?'; }
    if (a.soort === 'delen') return a.delen.map(d => `${d.html ? d.label : T(d.label)} ${juistHTML(d.antw)}`).join(' &nbsp;·&nbsp; ');
    if (a.soort === 'schakeling' && a.boom !== undefined) return `${T(a.tex)}<div class="lg-figuur" style="max-width:420px;margin:4px auto">${LG.vastSVG(a, a.boom)}</div>`;
    return T(juistTex(a));
  }
  function juistTekst(a) {
    if (a.soort === 'keuze') { const o = a.opties.find(x => String(x.k) === String(a.juist)); return o ? (o.tekst || W.platteTekst(o.l)) : '?'; }
    if (a.soort === 'delen') return a.delen.map(d => `${W.platteTekst(d.label)} ${juistTekst(d.antw)}`).join(' · ');
    return W.platteTekst(juistTex(a));
  }

  // ---------- wat de leerling ingaf: {tekst, tex}
  function gegeven(a, w) {
    switch (a.soort) {
      case 'keuze': { const o = a.opties.find(x => String(x.k) === String(w.keuze)); return { tekst: o ? (o.tekst || W.platteTekst(o.l)) : '—', html: o ? (o.html ? o.l : null) : null, tex: o && !o.html ? o.l : null }; }
      case 'delen': {
        const d = a.delen.map((x, i) => ({ label: x.label, ...gegeven(x.antw, w.delen[i]) }));
        return { tekst: d.map(x => `${W.platteTekst(x.label)} ${x.tekst}`).join(' · '), delen: d };
      }
      case 'vakjes': {
        if (!w.vakjes.some(x => String(x).trim())) return { tekst: '—', tex: null };
        const tex = a.sjabloon.map(s => {
          if (s.tex !== undefined) return s.tex;
          const x = String(w.vakjes[s.veld]).trim(), t = x ? (E.texVan(x) || `\\text{${x.replace(/[\\{}$&#^_%~]/g, '')}}`) : '\\square';
          return s.sub ? `_{${t}}` : s.sup ? `^{${t}}` : ` {${t}} `;
        }).join(' ');
        return { tekst: w.vakjes.map(x => String(x).trim() || '…').join(' | '), tex };
      }
    }
    if (a.soort === 'wt') return { tekst: w.cel.map(c => c.map(x => x || '·').join('')).join(' | '), tex: LG.wtTex(a, true, w) };
    if (a.soort === 'schakeling') return { tekst: `${a.uitgang} = ${LG.functieVan(a, w)}`, tex: null };
    if (a.soort === 'teken') return { tekst: w.punten.map((ps, i) => `rechte ${i + 1}: ${ps.map(p => `(${p[0]}, ${p[1]})`).join(' ') || '—'}`).join(' · '), tex: null };
    if (a.soort === 'combi') return { tekst: `vgl. 1 · ${w.p || '…'} en vgl. 2 · ${w.q || '…'}`, tex: null };
    if (a.soort === 'Vmeer') {
      if (w.speciaal) return { tekst: 'V = ∅', tex: 'V = \\varnothing' };
      const t = zonderV(w.invoer).trim(); if (!t) return { tekst: '—', tex: null };
      const ds = t.split(/;|\bof\b/i).map(x => x.trim()).filter(Boolean);
      const ts = ds.map(x => Invoer.getal(x).ok ? E.texVan(x) : null);
      return { tekst: `V = {${t}}`, tex: ts.every(Boolean) ? `V = \\{${ts.join('\\,;\\,')}\\}` : null };
    }
    if (a.soort === 'V') {
      if (w.speciaal) return { tekst: w.speciaal === 'leeg' ? 'V = ∅' : 'V = ℝ', tex: w.speciaal === 'leeg' ? 'V = \\varnothing' : 'V = \\mathbb{R}' };
      const t = zonderV(w.invoer).trim(); if (!t) return { tekst: '—', tex: null };
      const g = Invoer.getal(t);
      return { tekst: `V = {${t}}`, tex: g.ok ? `V = \\{${W.texGetal(g.waarde)}\\}` : null };
    }
    const t = String(w.invoer || '').trim();
    if (!t) return { tekst: '—', tex: null };
    const l = lezing(a, t);
    return { tekst: t, tex: l && l.tex ? l.tex : null };
  }
  // weergave van een opgeslagen 'gegeven'
  function gegevenHTML(g) {
    if (!g) return '—';
    if (g.delen) return g.delen.map(d => `${T(d.label)} ${gegevenHTML(d)}`).join(' &nbsp;·&nbsp; ');
    if (g.html) return g.html;
    if (g.tex) return T(g.tex);
    return `<b>${esc(g.tekst)}</b>`;
  }

  return { latexNaarTekst, juistTex, leeg, html, toetsen, heeftToetsenbord, toetsenbord, koppelToetsenbord, koppel, lees, isIngevuld, nakijk, juistHTML, juistTekst, gegeven, gegevenHTML };
})();
