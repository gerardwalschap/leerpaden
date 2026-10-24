// Antwoordvelden. Elk antwoord (v.antw) heeft een soort:
//   keuze        {opties:[{k, l, html?}], juist}               knoppen (ℚ / ℝ\ℚ, waar / niet waar, getallenassen …)
//   getal        {waarde, dec?, voor?, na?}                    getal; met dec = afronden op dec decimalen
//   expr         {expr, vormen?, voor?}                        wortelvormen, machten (rekenkern E)
//   formule      {expr, doel, vars}                            formule omvormen (hoofdlettergevoelig)
//   interval     {a, ai, b, bi}                                 [−2 ; 5[   (a/b = null betekent ∓∞)
//   ongelijkheid {a, ai, b, bi}                                 −2 ≤ x < 5
//   vakjes       {sjabloon:[{tex}|{veld, sub?, sup?, breed?}], velden:[{expr, vormen?}]}
//   delen        {delen:[{label, antw}]}                        meerdere antwoorden bij één vraag
const Antwoord = (() => {
  const esc = W.esc, T = (s) => W.tex(s);
  let laatste = null; // id van het laatst gebruikte tekstveld

  // ---------- toestand
  function leeg(a) {
    if (a.soort === 'keuze') return { keuze: null };
    if (a.soort === 'vakjes') return { vakjes: a.velden.map(() => '') };
    if (a.soort === 'delen') return { delen: a.delen.map(d => leeg(d.antw)) };
    return { invoer: '' };
  }

  // ---------- lezen voor de voorbeeldweergave
  function lezing(a, invoer) {
    const s = String(invoer || '');
    if (!s.trim()) return { leeg: true };
    if (a.soort === 'expr') { const r = E.ontleed(s); return r.ok ? { tex: r.tex } : { fout: r.fout }; }
    if (a.soort === 'formule') { const r = Invoer.formule(s, a.doel); return r.ok ? { tex: `${a.doel} = ${r.tex}` } : { fout: r.fout }; }
    if (a.soort === 'interval') { const r = Invoer.interval(s); return r.ok ? { tex: Invoer.intervalTex(r) } : { fout: r.fout }; }
    if (a.soort === 'ongelijkheid') { const r = Invoer.ongelijkheid(s); return r.ok ? { tex: Invoer.ongelijkheidTex(r) } : { fout: r.fout }; }
    return null;
  }
  const metVoorbeeld = (a) => ['expr', 'formule', 'interval', 'ongelijkheid'].includes(a.soort);
  function voorbeeld(a, invoer) {
    const l = lezing(a, invoer);
    if (!l || l.leeg) return '<span class="klein">Je antwoord verschijnt hier.</span>';
    return l.tex ? `<span class="klein">Gelezen als:</span> ${T(l.tex)}` : `<span class="klein fouttekst">${esc(l.fout)}</span>`;
  }

  // ---------- HTML
  const PLACEHOLDER = { getal: 'antwoord', expr: 'antwoord', formule: 'formule', interval: 'bv. [−2 ; 5[', ongelijkheid: 'bv. −2 ≤ x < 5' };
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
    const breed = a.soort !== 'getal' ? ' expr' : '';
    return `<div class="antwoordrij">${a.voor !== '' ? `<span class="is">${T(a.voor || (a.soort === 'formule' ? a.doel + ' =' : '='))}</span>` : ''}
        <input type="text" class="veld${breed}" id="${id}" value="${esc(w.invoer)}" placeholder="${PLACEHOLDER[a.soort] || ''}" autocomplete="off" autocapitalize="none" spellcheck="false" ${dis}>
        ${a.na ? `<span class="na">${T(a.na)}</span>` : ''}</div>
      ${metVoorbeeld(a) && !uit ? `<div class="voorbeeld" id="${id}-vb">${voorbeeld(a, w.invoer)}</div>` : ''}`;
  }

  // ---------- toetsenbord
  function toetsen(a, set = new Set()) {
    if (a.soort === 'expr') set.add('wortel');
    if (a.soort === 'formule') set.add('formule');
    if (a.soort === 'interval') set.add('interval');
    if (a.soort === 'ongelijkheid') set.add('ongelijkheid');
    if (a.soort === 'delen') a.delen.forEach(d => toetsen(d.antw, set));
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
    if (s.has('formule')) h += (s.has('wortel') ? '' : k('√()', '√', 'vierkantswortel') + k('∛()', '∛', 'derdemachtswortel') + k('/', '/', 'breukstreep') + k('()', '( )', 'haakjes') + k('·', '·', 'maal') + k('^()', 'xⁿ', 'exponent'))
      + k('²', 'x²', 'kwadraat') + k('π', 'π', 'pi') + k('ρ', 'ρ', 'rho (massadichtheid)');
    if (s.has('interval')) h += k('[', '[', 'haakje') + k(']', ']', 'haakje') + k(' ; ', ';', 'puntkomma') + k('-∞', '−∞', 'min oneindig') + k('+∞', '+∞', 'plus oneindig');
    if (s.has('ongelijkheid')) h += k('x', 'x', 'x') + k(' < ', '<', 'kleiner dan') + k(' ≤ ', '≤', 'kleiner dan of gelijk aan') + k(' > ', '>', 'groter dan') + k(' ≥ ', '≥', 'groter dan of gelijk aan');
    if (!h) return '';
    return `<div class="toetsenbord" role="toolbar" aria-label="Wiskundige tekens">${h}${k('⌫', '⌫', 'wis laatste teken')}</div>`;
  }
  function voegIn(el, txt) {
    const begin = el.selectionStart ?? el.value.length, eind = el.selectionEnd ?? el.value.length;
    if (txt === '⌫') {
      const b = begin === eind ? Math.max(0, begin - 1) : begin;
      el.value = el.value.slice(0, b) + el.value.slice(eind); el.setSelectionRange(b, b);
    } else {
      el.value = el.value.slice(0, begin) + txt + el.value.slice(eind);
      let pos = begin + txt.length;
      if (txt.endsWith('()')) pos -= 1; else if (txt === '^(/)') pos -= 2;
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
          const doel = el && !el.disabled && root.contains(el) ? el : root.querySelector('input.veld:not([disabled]), input.vak:not([disabled])');
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
      if (a.soort === 'vakjes') { a.velden.forEach((_, i) => { const el = document.getElementById(`${id}-${i}`); if (el) velden.push({ el, zet: (v) => { w.vakjes[i] = v; }, a }); }); return; }
      const el = document.getElementById(id);
      if (el) velden.push({ el, zet: (v) => { w.invoer = v; }, a, vb: document.getElementById(`${id}-vb`) });
    })(id, a, w);
    velden.forEach((v, n) => {
      v.el.addEventListener('focus', () => { laatste = v.el.id; });
      v.el.addEventListener('input', () => {
        v.zet(v.el.value);
        if (v.vb) v.vb.innerHTML = voorbeeld(v.a, v.el.value);
        opts.bijWijziging && opts.bijWijziging();
      });
      v.el.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const volgende = velden[n + 1] && velden[n + 1].el;
        if (volgende && !volgende.disabled) volgende.focus(); else opts.bijEnter && opts.bijEnter();
      });
    });
    return velden.map(v => v.el);
  }

  function lees(id, a, w) {
    if (a.soort === 'keuze') return;
    if (a.soort === 'delen') return a.delen.forEach((d, i) => lees(`${id}-d${i}`, d.antw, w.delen[i]));
    if (a.soort === 'vakjes') return a.velden.forEach((_, i) => { const el = document.getElementById(`${id}-${i}`); if (el) w.vakjes[i] = el.value; });
    const el = document.getElementById(id); if (el) w.invoer = el.value;
  }

  function isIngevuld(a, w) {
    if (a.soort === 'keuze') return w.keuze !== null && w.keuze !== undefined;
    if (a.soort === 'vakjes') return w.vakjes.every(x => String(x).trim());
    if (a.soort === 'delen') return a.delen.every((d, i) => isIngevuld(d.antw, w.delen[i]));
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
  function nakijk(a, w) {
    switch (a.soort) {
      case 'keuze':
        if (w.keuze === null || w.keuze === undefined) return { status: 'leeg', bericht: 'Kies een antwoord.' };
        return { status: String(w.keuze) === String(a.juist) ? 'juist' : 'fout' };
      case 'getal': return nakijkGetal(a, w.invoer);
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
      case 'expr': return a.tex || E.texVan(a.expr);
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

  return { juistTex, leeg, html, toetsen, heeftToetsenbord, toetsenbord, koppelToetsenbord, koppel, lees, isIngevuld, nakijk, juistHTML, juistTekst, gegeven, gegevenHTML };
})();
