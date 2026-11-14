// Logicakern: waarheidstabellen invullen ('wt') en schakelingen bouwen met IEC-poorten ('schakeling').
// Alles is serialiseerbaar (antwoorden en toestand worden als JSON bewaard).
const LG = (() => {
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // ---------- poorten
  const POORT = {
    NOT: { n: 1, lab: '1', neg: true, f: (a) => 1 - a },
    AND: { n: 2, lab: '&', f: (a, b) => a & b },
    OR: { n: 2, lab: '≥1', f: (a, b) => a | b },
    XOR: { n: 2, lab: '=1', f: (a, b) => a ^ b },
    NAND: { n: 2, lab: '&', neg: true, f: (a, b) => 1 - (a & b) },
    NOR: { n: 2, lab: '≥1', neg: true, f: (a, b) => 1 - (a | b) },
    XNOR: { n: 2, lab: '=1', neg: true, f: (a, b) => 1 - (a ^ b) },
  };
  // rijen van een waarheidstabel: eerst alles 1, dan aftellen (zoals in de cursus)
  const rijen = (n) => Array.from({ length: 2 ** n }, (_, r) => { const v = 2 ** n - 1 - r; return Array.from({ length: n }, (_, i) => (v >> (n - 1 - i)) & 1); });

  // ---------- waarheidstabel invullen
  // a = {soort:'wt', vars:['p','q'], kolommen:[{kop:'p \\wedge q', uit:[…]}], vast:[{kop, uit}]?}
  function wtHTML(id, a, w, uit, T) {
    const R = rijen(a.vars.length), vast = a.vast || [];
    const kop = [...a.vars.map(v => `<th>${T(v)}</th>`), ...vast.map(k => `<th>${T(k.kop)}</th>`), ...a.kolommen.map(k => `<th class="wt-uit">${T(k.kop)}</th>`)].join('');
    const lijn = R.map((r, i) => `<tr>${r.map(v => `<td>${v}</td>`).join('')}${vast.map(k => `<td>${k.uit[i]}</td>`).join('')}${a.kolommen.map((k, j) => {
      const v = w.cel[j][i];
      return `<td class="wt-uit"><button type="button" class="wt-knop ${v === '' ? 'leeg' : ''}" data-wid="${id}" data-k="${j}" data-r="${i}" ${uit ? 'disabled' : ''}>${v === '' ? '·' : v}</button></td>`;
    }).join('')}</tr>`).join('');
    return `<div class="wt-blok" id="${id}"><table class="wt">${'<tr>' + kop + '</tr>'}${lijn}</table>${uit ? '' : '<p class="klein">Klik op een vakje: · → 1 → 0.</p>'}</div>`;
  }
  const wtLeeg = (a) => ({ cel: a.kolommen.map(k => k.uit.map(() => '')) });
  const wtIngevuld = (a, w) => w.cel.every(c => c.every(x => x !== ''));
  function wtKoppel(id, a, w, opts) {
    document.querySelectorAll(`button.wt-knop[data-wid="${id}"]`).forEach(b => {
      b.onclick = () => {
        const j = +b.dataset.k, i = +b.dataset.r, v = w.cel[j][i];
        w.cel[j][i] = v === '' ? '1' : v === '1' ? '0' : '1';
        b.textContent = w.cel[j][i]; b.classList.remove('leeg');
        opts.bijWijziging && opts.bijWijziging();
      };
    });
  }
  function wtNakijk(a, w) {
    if (!wtIngevuld(a, w)) return { status: 'leeg', bericht: 'Vul alle vakjes van de tabel in.' };
    let fout = 0; a.kolommen.forEach((k, j) => k.uit.forEach((u, i) => { if (String(u) !== w.cel[j][i]) fout++; }));
    return fout ? { status: 'fout', bericht: `${fout} ${fout === 1 ? 'vakje is' : 'vakjes zijn'} niet juist.` } : { status: 'juist' };
  }
  function wtTex(a, metUit = true, w = null) {
    const R = rijen(a.vars.length), vast = a.vast || [];
    const kol = a.vars.length + vast.length + a.kolommen.length;
    const kop = [...a.vars, ...vast.map(k => k.kop), ...a.kolommen.map(k => k.kop)].join(' & ');
    const body = R.map((r, i) => [...r, ...vast.map(k => k.uit[i]), ...a.kolommen.map((k, j) => w ? (w.cel[j][i] || '\\cdot') : k.uit[i])].join(' & ')).join(' \\\\ ');
    return `\\begin{array}{${'c'.repeat(a.vars.length + vast.length)}|${'c'.repeat(a.kolommen.length)}} ${kop} \\\\ \\hline ${body} \\end{array}`;
  }

  // ---------- schakelingen tekenen en evalueren
  // toestand: {poorten:[{id,t,x,y}], draden:[{van:'i0'|'g3', naar:'g3:0'|'o'}], test:[0,1,…]}
  const BW = 600, BH = 360, GW = 50, GH = 50, INX = 46, OUTX = 548;
  const inY = (n, i) => BH / (n + 1) * (i + 1);
  function pinPos(a, w, sleutel) {
    if (sleutel[0] === 'i') { const i = +sleutel.slice(1); return [INX + 30, inY(a.ingangen.length, i)]; }
    if (sleutel === 'o') return [OUTX - 6, BH / 2];
    const [gid, pin] = sleutel.split(':'), g = w.poorten.find(p => p.id === gid); if (!g) return null;
    const P = POORT[g.t];
    if (pin === undefined) return [g.x + GW + (P.neg ? 12 : 4), g.y + GH / 2];
    return [g.x - 4, P.n === 1 ? g.y + GH / 2 : g.y + (pin === '0' ? 14 : GH - 14)];
  }
  function evalueer(a, w, ins) {
    const memo = {}, bezig = {};
    const bron = (naar) => { const d = w.draden.find(x => x.naar === naar); return d ? d.van : null; };
    function val(van) {
      if (van[0] === 'i') return ins[+van.slice(1)];
      if (van in memo) return memo[van];
      if (bezig[van]) throw new Error('lus');
      bezig[van] = true;
      const g = w.poorten.find(p => p.id === van); if (!g) throw new Error('los');
      const P = POORT[g.t], args = [];
      for (let k = 0; k < P.n; k++) { const b = bron(`${g.id}:${k}`); if (!b) throw new Error('open'); args.push(val(b)); }
      bezig[van] = false;
      return (memo[van] = P.f(...args));
    }
    const b = bron('o'); if (!b) throw new Error('uitgang');
    return val(b);
  }
  function tabelVan(a, w) { return rijen(a.ingangen.length).map(r => evalueer(a, w, r)); }
  // logische functie van de getekende schakeling als tekst (voor het rapport)
  function functieVan(a, w) {
    const bron = (naar) => { const d = w.draden.find(x => x.naar === naar); return d ? d.van : null; };
    const OP = { AND: '·', OR: '+', XOR: '⊕' };
    const f = (van, d = 0) => {
      if (!van) return '?'; if (d > 12) return '…';
      if (van[0] === 'i') return a.ingangen[+van.slice(1)];
      const g = w.poorten.find(p => p.id === van); if (!g) return '?';
      const x = f(bron(`${g.id}:0`), d + 1);
      if (g.t === 'NOT') return `¬${/^\w+$/.test(x) ? x : '(' + x + ')'}`;
      const y = f(bron(`${g.id}:1`), d + 1);
      const op = OP[{ NAND: 'AND', NOR: 'OR', XNOR: 'XOR' }[g.t] || g.t];
      const s = `${x} ${op} ${y}`;
      return POORT[g.t].neg ? `¬(${s})` : (d ? `(${s})` : s);
    };
    return f(bron('o'));
  }
  function poortSVG(g, extra = '') {
    const P = POORT[g.t], x = g.x, y = g.y;
    let s = `<g class="lg-poort" data-gid="${g.id}" ${extra}><rect x="${x}" y="${y}" width="${GW}" height="${GH}" rx="3" fill="#fff" stroke="#1f2733" stroke-width="1.6"/>
      <text x="${x + GW / 2}" y="${y + GH / 2 + 6}" text-anchor="middle" font-size="17" font-family="Verdana">${P.lab}</text>`;
    if (P.neg) s += `<circle cx="${x + GW + 4}" cy="${y + GH / 2}" r="4" fill="#fff" stroke="#1f2733" stroke-width="1.6"/>`;
    s += '</g>';
    return s;
  }
  function schakelingSVG(a, w, o = {}) {
    const n = a.ingangen.length, test = w.test || a.ingangen.map(() => 0);
    let waarde = {}; try { const memo = {}; w.poorten.forEach(g => { try { memo[g.id] = evalueerDeel(a, w, test, g.id); } catch (e) { /* open */ } }); waarde = memo; } catch (e) { /* */ }
    const draadKleur = (van) => o.live ? ((van[0] === 'i' ? test[+van.slice(1)] : waarde[van]) === 1 ? '#e8772e' : (van[0] === 'i' || waarde[van] === 0) ? '#8a94a6' : '#c3c9d4') : '#1f2733';
    let s = '';
    // draden
    for (const d of w.draden) {
      const p = pinPos(a, w, d.van), q = pinPos(a, w, d.naar); if (!p || !q) continue;
      const mx = Math.max(p[0] + 10, Math.min(q[0] - 10, (p[0] + q[0]) / 2));
      s += `<polyline class="lg-draad" data-naar="${d.naar}" points="${p[0]},${p[1]} ${mx},${p[1]} ${mx},${q[1]} ${q[0]},${q[1]}" fill="none" stroke="${draadKleur(d.van)}" stroke-width="${o.live ? 2.6 : 2}"/>`;
    }
    // ingangen
    a.ingangen.forEach((nm, i) => {
      const y = inY(n, i), v = test[i];
      s += `<g class="lg-in" data-i="${i}" style="${o.interactief ? 'cursor:pointer' : ''}"><rect x="${INX - 40}" y="${y - 15}" width="64" height="30" rx="6" fill="${o.live && v ? '#fde6d6' : '#f3f5f8'}" stroke="#1c4e8a" stroke-width="1.5"/>
        <text x="${INX - 22}" y="${y + 5}" font-size="13" font-family="Verdana" font-weight="bold" text-anchor="middle">${esc(nm)}</text>${o.live ? `<text x="${INX + 10}" y="${y + 5}" font-size="13" font-family="Verdana" text-anchor="middle" fill="${v ? '#e8772e' : '#667'}">${v}</text>` : ''}</g>`;
      if (o.interactief) s += `<circle class="lg-pin uit" data-pin="i${i}" cx="${INX + 30}" cy="${y}" r="7" fill="${o.kies === 'i' + i ? '#e8772e' : '#1c4e8a'}"/>`;
    });
    // uitgang
    let uitV = null; if (o.live) { try { uitV = evalueer(a, w, test); } catch (e) { uitV = null; } }
    s += `<g><rect x="${OUTX - 6}" y="${BH / 2 - 18}" width="${BW - OUTX}" height="36" rx="6" fill="${uitV === 1 ? '#ffe9a8' : '#f3f5f8'}" stroke="#1c4e8a" stroke-width="1.5"/>
      <text x="${OUTX + (BW - OUTX) / 2 - 3}" y="${BH / 2 + 5}" font-size="12" font-family="Verdana" font-weight="bold" text-anchor="middle">${esc(a.uitgang)}${o.live ? (uitV === null ? ' ?' : ' ' + uitV) : ''}</text></g>`;
    if (o.interactief) s += `<circle class="lg-pin in" data-pin="o" cx="${OUTX - 6}" cy="${BH / 2}" r="7" fill="${w.draden.some(d => d.naar === 'o') ? '#1c4e8a' : '#fff'}" stroke="#1c4e8a" stroke-width="2"/>`;
    // poorten
    for (const g of w.poorten) {
      s += poortSVG(g, o.interactief ? 'style="cursor:move"' : '');
      if (o.interactief) {
        const P = POORT[g.t];
        for (let k = 0; k < P.n; k++) { const [px, py] = pinPos(a, w, `${g.id}:${k}`); s += `<circle class="lg-pin in" data-pin="${g.id}:${k}" cx="${px}" cy="${py}" r="6.5" fill="${w.draden.some(d => d.naar === `${g.id}:${k}`) ? '#1c4e8a' : '#fff'}" stroke="#1c4e8a" stroke-width="2"/>`; }
        const [ox, oy] = pinPos(a, w, g.id); s += `<circle class="lg-pin uit" data-pin="${g.id}" cx="${ox}" cy="${oy}" r="6.5" fill="${o.kies === g.id ? '#e8772e' : '#1c4e8a'}"/>`;
        s += `<g class="lg-weg" data-gid="${g.id}" style="cursor:pointer"><circle cx="${g.x + GW}" cy="${g.y}" r="8" fill="#b83a2e"/><text x="${g.x + GW}" y="${g.y + 4}" font-size="11" fill="#fff" text-anchor="middle" font-family="Verdana">✕</text></g>`;
      }
    }
    return `<svg viewBox="0 0 ${BW} ${BH}" width="${BW}" height="${BH}" class="lg-svg" style="max-width:100%;height:auto;touch-action:none;user-select:none;background:#fff;border:1px solid #d8dee8;border-radius:10px">${s}</svg>`;
  }
  function evalueerDeel(a, w, ins, gid) { // waarde aan de uitgang van één poort
    const w2 = { ...w, draden: [...w.draden.filter(d => d.naar !== 'o'), { van: gid, naar: 'o' }] };
    return evalueer(a, w2, ins);
  }

  // ---------- vaste schakeling (voor opgaven): boom → netlijst met automatische schikking
  // boom: 'A' (index van ingang als getal) of {t:'AND', a:[boom, boom]}
  function uitBoom(a, boom) {
    const poorten = [], draden = []; let teller = 0;
    const diepte = (b) => typeof b === 'number' ? 0 : 1 + Math.max(...b.a.map(diepte));
    const D = diepte(boom), perNiveau = {};
    function bouw(b, d) {
      if (typeof b === 'number') return 'i' + b;
      const id = 'g' + (teller++), niv = D - d; (perNiveau[niv] ||= []).push(id);
      poorten.push({ id, t: b.t, x: 0, y: 0, niv });
      b.a.forEach((k, i) => draden.push({ van: bouw(k, d + 1), naar: `${id}:${i}` }));
      return id;
    }
    draden.push({ van: bouw(boom, 0), naar: 'o' });
    const stap = D > 1 ? (OUTX - 80 - GW - 140) / (D - 1) : 0;
    for (const [niv, ids] of Object.entries(perNiveau)) ids.forEach((id, k) => {
      const g = poorten.find(p => p.id === id);
      g.x = D > 1 ? 140 + (+niv - 1) * stap : (140 + OUTX - 80 - GW) / 2;
      g.y = BH / (ids.length + 1) * (k + 1) - GH / 2;
    });
    return { poorten, draden };
  }
  function vastSVG(a, boom) { return schakelingSVG(a, uitBoom(a, boom), {}); }
  const boomEval = (b, ins) => typeof b === 'number' ? ins[b] : POORT[b.t].f(...b.a.map(k => boomEval(k, ins)));
  const boomTabel = (n, boom) => rijen(n).map(r => boomEval(boom, r));

  // ---------- de bouwer (interactief)
  function bouwHTML(id, a, w, uit) {
    const pal = (a.poorten || Object.keys(POORT)).map(t => `<div class="lg-pal-item" data-t="${t}" data-bid="${id}" title="${t}"><svg viewBox="-6 -4 70 58" width="58" height="48">${poortSVG({ id: '', t, x: 0, y: 0 })}</svg><span>${t}</span></div>`).join('');
    return `<div class="lg-bouwer" id="${id}">
      <div class="lg-werk"><div class="lg-doek" id="${id}-doek">${schakelingSVG(a, w, { interactief: !uit, live: true })}</div>
        ${uit ? '' : `<div class="lg-palet"><div class="klein"><b>Poorten</b><br>sleep naar het werkblad</div>${pal}</div>`}</div>
      ${uit ? '' : `<p class="klein">Sleep poorten naar het werkblad. Verbind: klik op een <b>uitgang</b> (blauw bolletje rechts) en dan op een <b>ingang</b> (wit bolletje links). Klik op een ingang om de draad weg te halen, op ✕ om een poort te verwijderen.
        <b>Uitproberen:</b> klik op ${a.ingangen.map(esc).join(', ')} om 0/1 te wisselen. <button type="button" class="link lg-wis" data-bid="${id}">alles wissen</button></p>`}</div>`;
  }
  const bouwLeeg = (a) => ({ poorten: [], draden: [], test: a.ingangen.map(() => 0), nr: 0 });
  const bouwIngevuld = (a, w) => w.draden.some(d => d.naar === 'o');
  function bouwKoppel(id, a, w, opts) {
    const doek = document.getElementById(`${id}-doek`), root = document.getElementById(id); if (!doek) return;
    let kies = null;
    const teken = () => { doek.innerHTML = schakelingSVG(a, w, { interactief: true, live: true, kies }); opts.bijWijziging && opts.bijWijziging(); };
    const svgPunt = (e) => { const svg = doek.querySelector('svg'), m = svg.getScreenCTM().inverse(), p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const r = p.matrixTransform(m); return [r.x, r.y]; };
    const binnen = ([x, y]) => x > 0 && x < BW && y > 0 && y < BH;
    const klem = (g) => { g.x = Math.max(90, Math.min(OUTX - GW - 30, g.x)); g.y = Math.max(6, Math.min(BH - GH - 6, g.y)); };
    // poort verslepen, pinnen verbinden, ingangen wisselen
    doek.onpointerdown = (e) => {
      const t = e.target.closest('[data-pin], .lg-weg, .lg-poort, .lg-in'); if (!t) { kies = null; return teken(); }
      if (t.classList.contains('lg-weg')) { const gid = t.dataset.gid; w.poorten = w.poorten.filter(p => p.id !== gid); w.draden = w.draden.filter(d => d.van !== gid && !d.naar.startsWith(gid + ':')); kies = null; return teken(); }
      if (t.dataset.pin) {
        const pin = t.dataset.pin;
        if (t.classList.contains('uit')) { kies = kies === pin ? null : pin; return teken(); }
        if (kies) { if (kies === pin.split(':')[0]) return; w.draden = w.draden.filter(d => d.naar !== pin); w.draden.push({ van: kies, naar: pin }); kies = null; return teken(); }
        w.draden = w.draden.filter(d => d.naar !== pin); return teken();
      }
      if (t.classList.contains('lg-in')) { const i = +t.dataset.i; w.test = w.test || a.ingangen.map(() => 0); w.test[i] = 1 - w.test[i]; return teken(); }
      // poort verslepen
      const g = w.poorten.find(p => p.id === t.dataset.gid); if (!g) return;
      e.preventDefault();
      const [sx, sy] = svgPunt(e), ox = g.x, oy = g.y;
      const mv = (ev) => { const [x, y] = svgPunt(ev); g.x = ox + x - sx; g.y = oy + y - sy; klem(g); doek.innerHTML = schakelingSVG(a, w, { interactief: true, live: true, kies }); };
      const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); teken(); };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    };
    // slepen vanuit het palet
    root.querySelectorAll(`.lg-pal-item[data-bid="${id}"]`).forEach(it => {
      it.onpointerdown = (e) => {
        e.preventDefault();
        const geest = it.cloneNode(true); geest.classList.add('lg-geest'); document.body.appendChild(geest);
        const zet = (ev) => { geest.style.left = (ev.clientX - 29) + 'px'; geest.style.top = (ev.clientY - 24) + 'px'; };
        zet(e);
        const mv = (ev) => zet(ev);
        const up = (ev) => {
          window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); geest.remove();
          const p = svgPunt(ev);
          const g = { id: 'g' + (w.nr = (w.nr || 0) + 1), t: it.dataset.t, x: p[0] - GW / 2, y: p[1] - GH / 2 };
          if (!binnen(p)) { // gewoon geklikt of naast het werkblad losgelaten: zet de poort op een vrije plaats
            g.x = 120 + (w.poorten.length % 4) * 100; g.y = 30 + Math.floor(w.poorten.length / 4) * 90 + (w.poorten.length % 2) * 40;
          }
          klem(g); w.poorten.push(g); teken();
        };
        window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
      };
    });
    const wis = root.querySelector(`.lg-wis[data-bid="${id}"]`);
    if (wis) wis.onclick = () => { w.poorten = []; w.draden = []; kies = null; teken(); };
  }
  function bouwNakijk(a, w) {
    if (!bouwIngevuld(a, w)) return { status: 'leeg', bericht: 'Verbind je schakeling met de uitgang ' + a.uitgang + '.' };
    let t;
    try { t = tabelVan(a, w); } catch (e) {
      return { status: 'ongeldig', bericht: e.message === 'lus' ? 'Je schakeling bevat een lus: een draad loopt terug naar een eerdere poort.' : 'Niet alle ingangen van je poorten zijn verbonden.' };
    }
    const fout = t.map((v, i) => v !== a.doel[i] ? i : -1).filter(i => i >= 0);
    if (!fout.length) return { status: 'juist' };
    const r = rijen(a.ingangen.length)[fout[0]];
    return { status: 'fout', bericht: `Probeer eens ${a.ingangen.map((nm, i) => `${nm} = ${r[i]}`).join(', ')}: dan moet ${a.uitgang} = ${a.doel[fout[0]]} zijn, maar jouw schakeling geeft ${t[fout[0]]}.` };
  }

  return { uitBoom, POORT, rijen, wtHTML, wtLeeg, wtIngevuld, wtKoppel, wtNakijk, wtTex, bouwHTML, bouwLeeg, bouwIngevuld, bouwKoppel, bouwNakijk, functieVan, tabelVan, vastSVG, boomTabel, boomEval, poortSVG };
})();
if (typeof module !== 'undefined') module.exports = LG;
