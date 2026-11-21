// Rekenblad: een klein "Excel" in het leerpad. Gegevens staan in kolom A (A1 = titel), in kolom C typt
// de leerling formules zoals in Excel. De website rekent ze uit en kijkt de formule na.
//
// antwoord: { soort: 'rekenblad',
//   titel?: 'lengte (cm)', data?: [ … ]                       kolom A (A2, A3, …)
//   rijen: [{ label: 'gemiddelde', doel: 22.9,                 cel C2, C3, … met de gevraagde formule
//             func?: ['GEMIDDELDE', 'AVERAGE'], bereik?: 'A2:A21', norm?: {m, s, a, b?, kant: 'links'|'rechts'|'tussen'},
//             alt?: [andere waarden die ook juist zijn], formule: 'een juiste formule (voor de verbetering)' }],
//   histogram?: true                                           knop om een histogram van kolom A te tekenen
// }
// Zonder rijen is het rekenblad enkel een hulpmiddel (wordt niet nagekeken).
const RB = (() => {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const T = (s) => W.tex(s);

  // ---------- normale verdeling
  function Phi(z) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989422804014327 * Math.exp(-z * z / 2);
    const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return z > 0 ? 1 - p : p;
  }
  const getallen = (args) => args.flat(Infinity).filter(x => typeof x === 'number');
  const gem = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const FUNC = {
    GEMIDDELDE: (a) => { const x = getallen(a); if (!x.length) throw new Error('#DEEL/0!'); return gem(x); },
    STDEV_S: (a) => { const x = getallen(a); if (x.length < 2) throw new Error('#DEEL/0!'); const m = gem(x); return Math.sqrt(x.reduce((s, v) => s + (v - m) ** 2, 0) / (x.length - 1)); },
    STDEV_P: (a) => { const x = getallen(a); const m = gem(x); return Math.sqrt(x.reduce((s, v) => s + (v - m) ** 2, 0) / x.length); },
    SOM: (a) => getallen(a).reduce((s, v) => s + v, 0),
    AANTAL: (a) => getallen(a).length,
    MIN: (a) => Math.min(...getallen(a)), MAX: (a) => Math.max(...getallen(a)),
    WORTEL: (a) => { const x = getallen(a)[0]; if (x < 0) throw new Error('#GETAL!'); return Math.sqrt(x); },
    AFRONDEN: (a) => { const [x, d] = getallen(a); return W.rond(x, d || 0); },
    NORM_VERD_N: (a) => {
      if (a.length !== 4) throw new Error('NORM.VERD.N heeft 4 argumenten: (x; gemiddelde; standaardafwijking; WAAR)');
      const [x, m, s, c] = a; if (typeof s !== 'number' || s <= 0) throw new Error('#GETAL!: de standaardafwijking moet positief zijn');
      if (c === true || c === 1) return Phi((x - m) / s);
      return Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
    },
  };
  const ALIAS = { AVERAGE: 'GEMIDDELDE', 'STDEV.S': 'STDEV_S', STDEV: 'STDEV_S', 'STDEV.P': 'STDEV_P', SUM: 'SOM', COUNT: 'AANTAL', SQRT: 'WORTEL', ROUND: 'AFRONDEN',
    'NORM.VERD.N': 'NORM_VERD_N', 'NORM.DIST': 'NORM_VERD_N', GEMIDDELDE: 'GEMIDDELDE', SOM: 'SOM', AANTAL: 'AANTAL', MIN: 'MIN', MAX: 'MAX', WORTEL: 'WORTEL', AFRONDEN: 'AFRONDEN', 'STDEV.P': 'STDEV_P' };
  const TOON = { GEMIDDELDE: 'GEMIDDELDE', STDEV_S: 'STDEV.S', STDEV_P: 'STDEV.P', SOM: 'SOM', AANTAL: 'AANTAL', MIN: 'MIN', MAX: 'MAX', WORTEL: 'WORTEL', AFRONDEN: 'AFRONDEN', NORM_VERD_N: 'NORM.VERD.N' };

  // ---------- formule ontleden en uitrekenen
  // NL: argumenten met ; en decimale komma. EN (geen ;): argumenten met , en decimale punt.
  function tokens(f) {
    const s = f.replace(/[−–]/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
    const en = !s.includes(';') && /\b(AVERAGE|SUM|COUNT|SQRT|ROUND|NORM\.DIST|TRUE|FALSE)\b/i.test(s), nl = !en;
    if (nl && !s.includes(';') && /NORM\.VERD\.N|AFRONDEN/i.test(s)) throw new Error('Gebruik een puntkomma (;) tussen de argumenten, bv. =NORM.VERD.N(165; 160,4; 7,4; WAAR).');
    const out = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      const getal = nl ? /^\d+(,\d+)?|^,\d+/ : /^\d+(\.\d+)?|^\.\d+/;
      let m = s.slice(i).match(getal);
      if (m && !/^[A-Za-z]/.test(c)) { out.push({ t: 'n', v: parseFloat(m[0].replace(',', '.')) }); i += m[0].length; continue; }
      m = s.slice(i).match(/^\$?([A-Za-z])\$?(\d+)(:\$?([A-Za-z])\$?(\d+))?/);
      if (m && !/^[A-Za-z]{2}/.test(s.slice(i).replace(/\$/g, '')) ) { out.push({ t: 'ref', a: (m[1] + m[2]).toUpperCase(), b: m[3] ? (m[4] + m[5]).toUpperCase() : null }); i += m[0].length; continue; }
      m = s.slice(i).match(/^[A-Za-z][A-Za-z0-9_.]*/);
      if (m) { out.push({ t: 'naam', v: m[0].toUpperCase() }); i += m[0].length; continue; }
      if ('+-*/^()'.includes(c)) { out.push({ t: c }); i++; continue; }
      if (c === ';' || (c === ',' && !nl)) { out.push({ t: 'sep' }); i++; continue; }
      if (c === ',' && nl) throw new Error('Gebruik een puntkomma (;) tussen de argumenten, bv. =NORM.VERD.N(165; 160,4; 7,4; WAAR).');
      throw new Error(`Dit teken begrijp ik niet: ${c}`);
    }
    return out;
  }
  // ontleden → boom; ook bijhouden welke functies en bereiken gebruikt worden
  function ontleed(formule) {
    let f = String(formule || '').trim();
    if (!f.startsWith('=')) throw new Error('Een formule begint met =');
    const tk = tokens(f.slice(1)); let p = 0;
    const kijk = () => tk[p], neem = (t) => { const x = tk[p]; if (!x || (t && x.t !== t)) throw new Error(t === ')' ? 'Er ontbreekt een haakje )' : 'De formule is niet volledig.'); p++; return x; };
    function som() { let l = prod(); while (kijk() && (kijk().t === '+' || kijk().t === '-')) { const o = neem().t; l = { o, l, r: prod() }; } return l; }
    function prod() { let l = macht(); while (kijk() && (kijk().t === '*' || kijk().t === '/')) { const o = neem().t; l = { o, l, r: macht() }; } return l; }
    function macht() { const l = een(); if (kijk() && kijk().t === '^') { neem(); return { o: '^', l, r: macht() }; } return l; }
    function een() {
      const x = kijk(); if (!x) throw new Error('De formule is niet volledig.');
      if (x.t === '-') { neem(); return { o: 'neg', l: een() }; }
      if (x.t === '+') { neem(); return een(); }
      if (x.t === 'n') { neem(); return { n: x.v }; }
      if (x.t === 'ref') { neem(); return { ref: x.a, tot: x.b }; }
      if (x.t === '(') { neem(); const e = som(); neem(')'); return e; }
      if (x.t === 'naam') {
        neem();
        if (['WAAR', 'TRUE'].includes(x.v)) return { b: true };
        if (['ONWAAR', 'FALSE'].includes(x.v)) return { b: false };
        const fn = ALIAS[x.v]; if (!fn) throw new Error(`De functie ${x.v} ken ik niet. Gebruik bv. GEMIDDELDE, STDEV.S of NORM.VERD.N.`);
        if (!kijk() || kijk().t !== '(') throw new Error(`Na ${x.v} komen haakjes: ${x.v}(…)`);
        neem('('); const args = [];
        if (kijk() && kijk().t !== ')') { args.push(som()); while (kijk() && kijk().t === 'sep') { neem(); args.push(som()); } }
        neem(')');
        return { fn, naam: x.v, args };
      }
      throw new Error('De formule is niet volledig.');
    }
    const boom = som(); if (p < tk.length) throw new Error('Er staat iets te veel in de formule (een haakje of teken?).');
    return boom;
  }
  const kolNr = (c) => c.charCodeAt(0) - 64;
  function bereikCellen(a, b) {
    const [, ca, ra] = a.match(/([A-Z])(\d+)/), [, cb, rb] = b.match(/([A-Z])(\d+)/), out = [];
    for (let c = Math.min(kolNr(ca), kolNr(cb)); c <= Math.max(kolNr(ca), kolNr(cb)); c++)
      for (let r = Math.min(+ra, +rb); r <= Math.max(+ra, +rb); r++) out.push(String.fromCharCode(64 + c) + r);
    return out;
  }
  // blad: functie cel → waarde (getal, tekst of null)
  function reken(boom, blad) {
    const r = (e) => reken(e, blad);
    if ('n' in boom) return boom.n;
    if ('b' in boom) return boom.b;
    if (boom.ref) {
      if (boom.tot) return bereikCellen(boom.ref, boom.tot).map(blad);
      const v = blad(boom.ref); return v === null || v === undefined ? 0 : v;
    }
    if (boom.fn) {
      const args = boom.args.map(x => x.ref && x.tot ? r(x) : r(x));
      return FUNC[boom.fn](args);
    }
    const g = (x) => { const v = r(x); if (Array.isArray(v)) throw new Error('Een bereik (zoals A2:A21) kan je enkel in een functie gebruiken.'); if (typeof v === 'string') throw new Error('#WAARDE!: je rekent met een cel waar tekst in staat.'); if (typeof v === 'boolean') return v ? 1 : 0; return v; };
    if (boom.o === 'neg') return -g(boom.l);
    const l = g(boom.l), rr = g(boom.r);
    if (boom.o === '+') return l + rr; if (boom.o === '-') return l - rr; if (boom.o === '*') return l * rr;
    if (boom.o === '/') { if (rr === 0) throw new Error('#DEEL/0!'); return l / rr; }
    if (boom.o === '^') return l ** rr;
    throw new Error('?');
  }
  // alle functie-aanroepen in een boom
  function aanroepen(boom, lijst = []) {
    if (!boom || typeof boom !== 'object') return lijst;
    if (boom.fn) { lijst.push(boom); boom.args.forEach(x => aanroepen(x, lijst)); }
    if (boom.l) aanroepen(boom.l, lijst); if (boom.r) aanroepen(boom.r, lijst);
    return lijst;
  }
  // het blad van een vraag: kolom A = titel + gegevens, kolom B = labels, kolom C = formules van de leerling
  function bladVan(a, w, bezig = new Set()) {
    const n = (a.data || []).length;
    const blad = (cel) => {
      const [, c, rs] = cel.match(/([A-Z])(\d+)/), r = +rs;
      if (c === 'A') return r === 1 ? (a.titel || null) : r - 2 < n ? a.data[r - 2] : null;
      if (c === 'B') { const i = r - 2; return a.rijen && a.rijen[i] ? a.rijen[i].label : null; }
      if (c === 'C') {
        const i = r - 2, f = w && w.cellen ? w.cellen[i] : null; if (!f) return null;
        const s = String(f).trim(); if (!s.startsWith('=')) { const g = Invoer.getal(s); return g.ok ? g.waarde : s; }
        if (bezig.has(cel)) throw new Error('Kringverwijzing: de cel verwijst naar zichzelf.');
        bezig.add(cel); const v = reken(ontleed(s), blad); bezig.delete(cel);
        if (Array.isArray(v)) throw new Error('Een bereik alleen is geen uitkomst.'); return v;
      }
      return null;
    };
    return blad;
  }
  function waardeVan(a, w, i) {
    const f = String((w.cellen || [])[i] || '').trim();
    if (!f) return { leeg: true };
    if (!f.startsWith('=')) return { getypt: true, tekst: f };
    try { const boom = ontleed(f), v = reken(boom, bladVan(a, w, new Set([`C${i + 2}`]))); if (Array.isArray(v)) return { fout: 'Een bereik alleen is geen uitkomst: gebruik een functie, bv. =GEMIDDELDE(…).' }; return { v, boom }; }
    catch (e) { return { fout: e.message }; }
  }
  const toon = (v) => typeof v === 'boolean' ? (v ? 'WAAR' : 'ONWAAR') : typeof v === 'number' ? W.komma(W.rond(v, Math.abs(v) >= 1000 ? 2 : 6)) : String(v);

  // ---------- nakijken (per rij een tip)
  function nakijkRij(a, w, i) {
    const R = a.rijen[i], x = waardeVan(a, w, i), cel = `C${i + 2}`;
    if (x.leeg) return { status: 'leeg', bericht: `Typ een formule in cel ${cel}.` };
    if (x.getypt) return { status: 'fout', bericht: `In cel ${cel} typte je een getal. Laat het rekenblad rekenen: typ een formule die met = begint.` };
    if (x.fout) return { status: 'ongeldig', bericht: `Cel ${cel}: ${x.fout}` };
    const gelijk = (d) => typeof x.v === 'number' && Math.abs(x.v - d) <= 1e-9 * Math.max(1, Math.abs(d));
    const ok = gelijk(R.doel) || (R.alt || []).some(gelijk);
    if (ok) return { status: 'juist' };
    const calls = aanroepen(x.boom), namen = calls.map(c => c.fn);
    let tip = '';
    if (R.func && !R.func.some(f => namen.includes(ALIAS[f] || f))) tip = `Gebruik de functie ${R.func[0]}.`;
    if (namen.includes('STDEV_P')) tip = 'Gebruik STDEV.S (niet STDEV.P).';
    if (!tip && R.bereik) {
      const c = calls.find(k => !R.func || R.func.some(f => (ALIAS[f] || f) === k.fn)), arg = c && c.args.find(q => q.ref && q.tot);
      if (c && arg && `${arg.ref}:${arg.tot}` !== R.bereik) {
        const [b0, b1] = R.bereik.split(':');
        tip = `Kijk je bereik na: de gegevens staan in ${b0} tot en met ${b1}${arg.tot !== b1 ? ` (jij nam ${arg.ref}:${arg.tot})` : ''}.`;
        if (arg.ref === 'A1' && arg.tot === b1) tip = '';
      }
    }
    if (!tip && R.norm) {
      const N = R.norm, nc = calls.filter(k => k.fn === 'NORM_VERD_N');
      if (!nc.length) tip = 'Gebruik NORM.VERD.N(x; gemiddelde; standaardafwijking; WAAR).';
      else {
        const lit = (q) => q && 'n' in q ? q.n : q && 'b' in q ? q.b : null;
        const fout = nc.find(k => k.args.length === 4 && (lit(k.args[1]) !== N.m || lit(k.args[2]) !== N.s));
        if (nc.some(k => k.args.length === 4 && lit(k.args[3]) === false)) tip = 'Het laatste argument van NORM.VERD.N moet WAAR zijn (de oppervlakte links van x).';
        else if (fout && lit(fout.args[1]) === N.s && lit(fout.args[2]) === N.m) tip = 'De volgorde is NORM.VERD.N(x; gemiddelde; standaardafwijking; WAAR): eerst het gemiddelde, dan de standaardafwijking.';
        else if (fout) tip = `Kijk het gemiddelde (${toon(N.m)}) en de standaardafwijking (${toon(N.s)}) in je formule na.`;
        else {
          const Fa = Phi((N.a - N.m) / N.s), Fb = N.b != null ? Phi((N.b - N.m) / N.s) : null;
          if (N.kant === 'rechts' && Math.abs(x.v - Fa) < 1e-9) tip = 'Dit is de oppervlakte links van de grens. Voor "meer dan" reken je 1 − NORM.VERD.N(…).';
          else if (N.kant === 'links' && Math.abs(x.v - (1 - Fa)) < 1e-9) tip = 'Dit is de oppervlakte rechts van de grens. Voor "minder dan" volstaat NORM.VERD.N(…) zonder 1 −.';
          else if (N.kant === 'tussen' && Math.abs(x.v + (Fb - Fa)) < 1e-9) tip = 'Je trok af in de verkeerde volgorde: NORM.VERD.N(grootste grens; …) − NORM.VERD.N(kleinste grens; …).';
          else if (N.kant === 'tussen' && (Math.abs(x.v - Fb) < 1e-9 || Math.abs(x.v - Fa) < 1e-9)) tip = 'Tussen twee grenzen: NORM.VERD.N(grootste grens; …) − NORM.VERD.N(kleinste grens; …).';
          else tip = 'Kijk de grens (de eerste waarde in NORM.VERD.N) na.';
        }
      }
    }
    return { status: 'fout', bericht: `Cel ${cel} geeft ${toon(x.v)}. ${tip}`.trim() };
  }
  function nakijk(a, w) {
    if (!a.rijen || !a.rijen.length) return { status: 'juist' };
    const r = a.rijen.map((_, i) => nakijkRij(a, w, i));
    const eerst = (s) => r.find(x => x.status === s);
    return eerst('leeg') || eerst('ongeldig') || eerst('fout') || { status: 'juist' };
  }
  const leeg = (a) => ({ cellen: (a.rijen || []).map(() => '') });
  const ingevuld = (a, w) => (a.rijen || []).every((_, i) => String((w.cellen || [])[i] || '').trim());

  // ---------- histogram van kolom A
  function histoSVG(data, start, br) {
    if (!(br > 0) || !data.length) return '';
    const max = Math.max(...data); let k = Math.floor((max - start) / br) + 1; if (k > 30) return '<p class="klein">Te veel klassen: kies een grotere breedte.</p>';
    const f = Array.from({ length: k }, (_, i) => data.filter(x => x >= start + i * br && x < start + (i + 1) * br).length), buiten = data.filter(x => x < start).length;
    const B = Math.min(480, 40 * k + 40), H = 180, ml = 34, mt = 10, bw = (B - ml) / k, fm = Math.max(...f, 1), st = fm <= 6 ? 1 : fm <= 12 ? 2 : fm <= 30 ? 5 : fm <= 60 ? 10 : 20, top = Math.ceil(fm / st) * st;
    const X = (i) => ml + i * bw, Y = (v) => mt + H - v / top * H;
    let g = '';
    for (let y = 0; y <= top; y += st) g += `<line x1="${ml}" y1="${Y(y)}" x2="${B}" y2="${Y(y)}" stroke="#e3e7ee"/><text x="${ml - 4}" y="${Y(y) + 4}" font-size="10" text-anchor="end" fill="#555">${y}</text>`;
    f.forEach((v, i) => { g += `<rect x="${X(i)}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" fill="#aed6f1" stroke="#1c4e8a" stroke-width="1.2"/>`; if (v) g += `<text x="${X(i) + bw / 2}" y="${Y(v) - 3}" font-size="10" text-anchor="middle">${v}</text>`; });
    const stap = k > 12 ? 2 : 1;
    for (let i = 0; i <= k; i += stap) g += `<text x="${X(i)}" y="${Y(0) + 14}" font-size="10" text-anchor="middle">${W.komma(W.rond(start + i * br, 6))}</text>`;
    g += `<line x1="${ml}" y1="${Y(0)}" x2="${B}" y2="${Y(0)}" stroke="#1f2733"/><line x1="${ml}" y1="${Y(0)}" x2="${ml}" y2="${mt}" stroke="#1f2733"/>`;
    return `<svg viewBox="0 0 ${B + 20} ${H + mt + 24}" width="${B + 20}" height="${H + mt + 24}" style="max-width:100%;height:auto;font-family:Verdana,sans-serif">${g}</svg>${buiten ? `<p class="klein">${buiten} gegevens liggen links van ${W.komma(start)} en staan niet in het histogram.</p>` : ''}`;
  }

  // ---------- weergave
  function html(id, a, w, uit) {
    const n = (a.data || []).length, nr = (a.rijen || []).length, rijen = Math.max(n + 1, nr + 1);
    const toonRijen = Math.min(rijen, a.hoog || 14);
    let body = '';
    for (let r = 1; r <= rijen; r++) {
      const A = r === 1 ? (a.titel ? `<b>${esc(a.titel)}</b>` : '') : r - 2 < n ? esc(W.komma(a.data[r - 2])) : '';
      const i = r - 2, R = a.rijen && a.rijen[i];
      const B = r === 1 ? (nr ? '<b>wat?</b>' : '') : R ? esc(R.label) : '';
      let C = r === 1 ? (nr ? '<b>formule</b>' : '') : '';
      if (R) {
        const v = w.cellen[i] || '';
        C = `<input type="text" class="rb-cel" id="${id}-c${i}" data-i="${i}" value="${esc(v)}" placeholder="=…" autocomplete="off" autocapitalize="none" spellcheck="false" ${uit ? 'disabled' : ''}>
          <div class="rb-uit" id="${id}-u${i}">${uitkomstHTML(a, w, i)}</div>`;
      }
      body += nr ? `<tr><th>${r}</th><td class="rb-a">${A}</td><td class="rb-b">${B}</td><td class="rb-c">${C}</td></tr>` : `<tr><th>${r}</th><td class="rb-a">${A}</td></tr>`;
    }
    const histo = a.histogram && !uit ? `<div class="rb-histo"><b>Histogram van kolom A</b> &nbsp; begin bij <input type="text" class="rb-klein" id="${id}-hs" value="${esc(w.hs ?? '')}" placeholder="bv. 0"> klassenbreedte <input type="text" class="rb-klein" id="${id}-hb" value="${esc(w.hb ?? '')}" placeholder="bv. 10">
        <button type="button" class="licht" id="${id}-hk">Maak histogram</button><div id="${id}-hf">${w.hs !== undefined && w.hb ? histoSVG(a.data, +String(w.hs).replace(',', '.'), +String(w.hb).replace(',', '.')) : ''}</div></div>` : '';
    return `<div class="rekenblad" id="${id}"><div class="rb-wrap" style="max-height:${toonRijen * 34 + nr * 26 + 44}px${nr ? '' : ';max-width:260px'}"><table class="rb${nr ? '' : ' rb-smal'}"><tr><th></th><th>A</th>${nr ? '<th>B</th><th>C</th>' : ''}</tr>${body}</table></div>
      ${!uit && nr ? '<p class="klein">Typ in kolom C een formule zoals in Excel, bv. <code>=GEMIDDELDE(A2:A11)</code>. Tussen de argumenten een puntkomma, decimalen met een komma.</p>' : ''}${histo}</div>`;
  }
  function uitkomstHTML(a, w, i) {
    const x = waardeVan(a, w, i);
    if (x.leeg) return '';
    if (x.getypt) return '<span class="rb-fout">typ een formule (=…)</span>';
    if (x.fout) return `<span class="rb-fout">${esc(x.fout)}</span>`;
    return `= ${esc(toon(x.v))}`;
  }
  function koppel(id, a, w, opts = {}) {
    (a.rijen || []).forEach((_, i) => {
      const el = document.getElementById(`${id}-c${i}`); if (!el) return;
      el.addEventListener('input', () => {
        w.cellen[i] = el.value;
        (a.rijen || []).forEach((__, j) => { const u = document.getElementById(`${id}-u${j}`); if (u) u.innerHTML = uitkomstHTML(a, w, j); });
        opts.bijWijziging && opts.bijWijziging();
      });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const nx = document.getElementById(`${id}-c${i + 1}`); if (nx) nx.focus(); } });
    });
    const k = document.getElementById(`${id}-hk`);
    if (k) k.onclick = () => {
      w.hs = document.getElementById(`${id}-hs`).value; w.hb = document.getElementById(`${id}-hb`).value;
      const s = +String(w.hs).replace(',', '.'), b = +String(w.hb).replace(',', '.');
      document.getElementById(`${id}-hf`).innerHTML = Number.isFinite(s) && b > 0 ? histoSVG(a.data, s, b) : '<p class="klein">Vul een begin en een klassenbreedte in.</p>';
    };
  }
  const juistFormule = (R) => R.formule || '';
  function juistHTML(a) {
    if (!a.rijen || !a.rijen.length) return '';
    return a.rijen.map((R, i) => `C${i + 2} (${esc(R.label)}): <code>${esc(juistFormule(R))}</code> = ${esc(toon(R.doel))}`).join('<br>');
  }
  const juistTekst = (a) => (a.rijen || []).map((R, i) => `C${i + 2}: ${juistFormule(R)} = ${toon(R.doel)}`).join(' · ');
  function gegeven(a, w) {
    if (!a.rijen || !a.rijen.length) return { tekst: '(rekenblad)', tex: null };
    const tekst = a.rijen.map((R, i) => { const f = String((w.cellen || [])[i] || '').trim(), x = waardeVan(a, w, i); return `C${i + 2}: ${f || '—'}${x.v !== undefined ? ' → ' + toon(x.v) : ''}`; }).join(' · ');
    return { tekst, tex: null };
  }
  return { leeg, ingevuld, html, koppel, nakijk, juistHTML, juistTekst, gegeven, ontleed, reken, Phi, toon, histoSVG, _waardeVan: waardeVan };
})();
