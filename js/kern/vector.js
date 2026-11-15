// ====================================================================
//  VECTOREN TEKENEN — antwoordsoort 'vector'
//  De leerling tekent pijlen op geruit papier: klik het startpunt, dan
//  het eindpunt. Nakijken op grootte, richting en zin (aantal vakjes)
//  en eventueel op het startpunt (vast punt, kop van een andere pijl,
//  zelfde startpunt als een andere pijl).
//
//  a = { soort: 'vector',
//        b: 14, h: 9,                               // rooster: 0..b en 0..h vakjes
//        gegeven: [{ van: [x, y], d: [dx, dy], naam: 'a', kleur? }],
//        vormen:  [{ pts: [[x, y], …], namen?: ['A', …], arcering? }],
//        punten:  [{ p: [x, y], naam: 'P' }],
//        teken:   [{ naam: '2a', d: [dx, dy],
//                    van?: [x, y]  | kopVan?: i | startVan?: i,
//                    vb?: [x, y] }],               // vb = startpunt voor de modeloplossing (vrij startpunt)
//        beeld?:  { pijlen: [i, j, k], namen: ["A'", …] },   // veelhoek door de koppen van deze pijlen
//        lijnen?: [{ van, naar, stippel? }] }
//  w = { pijlen: [{ p, q } | null …], actief: 0 }
// ====================================================================
window.VEC = (() => {
  const KLEUR = ['#1c4e8a', '#e8772e', '#2e7d4f', '#8e44ad', '#b03a2e'];
  const GRIJS = '#1f2733';
  const SC = 30, M = 18;
  const gelijk = (p, q) => !!p && !!q && p[0] === q[0] && p[1] === q[1];

  // naam als 'a', '-b', '2a', 'a+b', 'F1', 'AB', "AA'" → SVG-tekst met pijltje erboven
  function naamSVG(x, y, naam, kleur, grootte = 15) {
    const s = String(naam);
    const m = s.match(/^([−\-+]?\s*[0-9½]*\s*)?(.*)$/);
    const voor = (m[1] || '').replace('-', '−'), rest = m[2];
    // splits rest in stukjes "letter(s)[index]" en tekens (+, −, (, ), spatie)
    const stukken = []; let i = 0;
    while (i < rest.length) {
      const c = rest[i];
      if (/[A-Za-z]/.test(c)) {
        let j = i + 1; while (j < rest.length && /[A-Z']/.test(rest[j]) && /[A-Z]/.test(c)) j++;
        let w = rest.slice(i, j), sub = '';
        if (/[0-9]/.test(rest[j] || '')) { sub = rest[j]; j++; }
        stukken.push({ v: w, sub }); i = j;
      } else { stukken.push({ t: c === '-' ? ' − ' : c === '+' ? ' + ' : c }); i++; }
    }
    const bw = grootte * 0.62;
    let tx = 0, svg = '';
    const tekst = (t, x0, it) => `<tspan x="${x0}" ${it ? 'font-style="italic"' : ''}>${t}</tspan>`;
    let inner = '';
    if (voor) { inner += tekst(voor, tx, false); tx += voor.length * bw; }
    for (const st of stukken) {
      if (st.t !== undefined) { inner += tekst(st.t.replace(/ /g, ' '), tx, false); tx += st.t.length * bw * 0.75; continue; }
      const w = st.v.length * bw;
      inner += tekst(st.v, tx, true);
      // pijltje erboven
      const ay = -grootte * 0.92;
      svg += `<path d="M${tx + 1},${ay} L${tx + w + 1},${ay} M${tx + w - 3},${ay - 3} L${tx + w + 1},${ay} L${tx + w - 3},${ay + 3}" stroke="${kleur}" stroke-width="1.2" fill="none"/>`;
      tx += w;
      if (st.sub) { inner += `<tspan x="${tx}" dy="4" font-size="${grootte * 0.7}">${st.sub}</tspan><tspan dy="-4"></tspan>`; tx += grootte * 0.45; }
    }
    return `<g transform="translate(${(x - tx / 2).toFixed(1)},${(y + grootte * 0.35).toFixed(1)})" fill="${kleur}" font-size="${grootte}" font-family="Cambria, 'Times New Roman', serif">
      <rect x="-3" y="${-grootte * 1.25}" width="${tx + 6}" height="${grootte * 1.55}" fill="#fff" opacity="0.85"/>${svg}<text>${inner}</text></g>`;
  }

  function pijlSVG(X, Y, p, q, kleur, opt = {}) {
    if (gelijk(p, q)) return `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="5" fill="${kleur}"/>`;
    const x1 = X(p[0]), y1 = Y(p[1]), x2 = X(q[0]), y2 = Y(q[1]);
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, k = 13, b = 5.5;
    const bx = x2 - ux * k, by = y2 - uy * k;
    const dash = opt.stippel ? 'stroke-dasharray="7 5"' : '';
    return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${kleur}" stroke-width="${opt.dik || 3}" ${dash} stroke-linecap="round"/>
      <path d="M${x2},${y2} L${bx - uy * b},${by + ux * b} L${bx + uy * b},${by - ux * b} Z" fill="${kleur}" ${opt.stippel ? 'opacity="0.75"' : ''}/>`;
  }
  // label naast het midden van een pijl
  function labelBij(X, Y, p, q, naam, kleur) {
    const mx = (X(p[0]) + X(q[0])) / 2, my = (Y(p[1]) + Y(q[1])) / 2;
    const dx = X(q[0]) - X(p[0]), dy = Y(q[1]) - Y(p[1]), L = Math.hypot(dx, dy) || 1;
    let nx = -dy / L, ny = dx / L; if (ny > 0) { nx = -nx; ny = -ny; } // bij voorkeur erboven
    return naamSVG(mx + nx * 16, my + ny * 16, naam, kleur);
  }

  // modeloplossing: startpunten van de te tekenen pijlen
  function oplossing(a, w) {
    const uit = [];
    (a.teken || []).forEach((t, i) => {
      let p;
      if (t.van) p = t.van;
      else if (t.kopVan !== undefined) { const o = uit[t.kopVan]; p = [o.p[0] + o.d[0], o.p[1] + o.d[1]]; }
      else if (t.startVan !== undefined) p = uit[t.startVan].p;
      else p = (w && w.pijlen[i] && w.pijlen[i].p) || t.vb || [1, 1];
      uit.push({ p, d: t.d, q: [p[0] + t.d[0], p[1] + t.d[1]] });
    });
    return uit;
  }

  function svg(a, w, modus) { // modus: 'invul' | 'uit' (leerling + oplossing) | 'oplossing'
    const B = a.b || 14, H = a.h || 9;
    const X = (x) => M + x * SC, Y = (y) => M + (H - y) * SC;
    let g = '';
    for (let k = 0; k <= B; k++) g += `<line x1="${X(k)}" y1="${Y(0)}" x2="${X(k)}" y2="${Y(H)}" stroke="#d9dee6"/>`;
    for (let k = 0; k <= H; k++) g += `<line x1="${X(0)}" y1="${Y(k)}" x2="${X(B)}" y2="${Y(k)}" stroke="#d9dee6"/>`;
    for (const l of a.lijnen || []) g += `<line x1="${X(l.van[0])}" y1="${Y(l.van[1])}" x2="${X(l.naar[0])}" y2="${Y(l.naar[1])}" stroke="${GRIJS}" stroke-width="2" ${l.stippel ? 'stroke-dasharray="5 4"' : ''}/>`;
    for (const v of a.vormen || []) {
      g += `<polygon points="${v.pts.map(p => `${X(p[0])},${Y(p[1])}`).join(' ')}" fill="#dfe3e8" stroke="${GRIJS}" stroke-width="2"/>`;
      (v.namen || []).forEach((n, i) => { const p = v.pts[i], c = v.pts.reduce((s, q) => [s[0] + q[0] / v.pts.length, s[1] + q[1] / v.pts.length], [0, 0]); const dx = p[0] - c[0], dy = p[1] - c[1], L = Math.hypot(dx, dy) || 1; g += `<text x="${X(p[0]) + dx / L * 14}" y="${Y(p[1]) - dy / L * 14 + 5}" font-size="14" text-anchor="middle" fill="${GRIJS}">${n}</text>`; });
    }
    for (const v of a.gegeven || []) {
      const q = [v.van[0] + v.d[0], v.van[1] + v.d[1]];
      g += pijlSVG(X, Y, v.van, q, v.kleur || GRIJS) + labelBij(X, Y, v.van, q, v.naam, v.kleur || GRIJS);
    }
    for (const p of a.punten || []) g += `<circle cx="${X(p.p[0])}" cy="${Y(p.p[1])}" r="4.5" fill="${GRIJS}"/><text x="${X(p.p[0]) + 8}" y="${Y(p.p[1]) - 7}" font-size="14" font-weight="bold" fill="${GRIJS}">${p.naam || ''}</text>`;
    const sol = oplossing(a, w);
    if (modus === 'uit' || modus === 'oplossing') sol.forEach((s, i) => { g += pijlSVG(X, Y, s.p, s.q, '#7d8796', { stippel: true, dik: 2.2 }); if (modus === 'oplossing') g += labelBij(X, Y, s.p, s.q, a.teken[i].naam, '#5d6776'); });
    if ((modus === 'invul' || modus === 'uit') && w) {
      // beeldfiguur door de koppen
      if (a.beeld && a.beeld.pijlen.every(i => w.pijlen[i] && w.pijlen[i].q)) {
        const pts = a.beeld.pijlen.map(i => w.pijlen[i].q);
        g += `<polygon points="${pts.map(p => `${X(p[0])},${Y(p[1])}`).join(' ')}" fill="${KLEUR[1]}" fill-opacity="0.15" stroke="${KLEUR[1]}" stroke-width="2"/>`;
      }
      w.pijlen.forEach((pl, i) => {
        if (!pl) return; const kl = KLEUR[i % KLEUR.length];
        if (pl.q) g += pijlSVG(X, Y, pl.p, pl.q, kl) + labelBij(X, Y, pl.p, pl.q, a.teken[i].naam, kl);
        else g += `<circle cx="${X(pl.p[0])}" cy="${Y(pl.p[1])}" r="6" fill="${kl}" stroke="#fff" stroke-width="2"/>`;
      });
      if (a.beeld && modus === 'invul') a.beeld.pijlen.forEach((pi, k) => { const pl = w.pijlen[pi]; if (pl && pl.q && a.beeld.namen) g += `<text x="${X(pl.q[0]) + 9}" y="${Y(pl.q[1]) - 8}" font-size="14" font-weight="bold" fill="${KLEUR[1]}">${a.beeld.namen[k]}</text>`; });
    }
    if (modus === 'oplossing' && a.beeld) { const pts = a.beeld.pijlen.map(i => sol[i].q); g += `<polygon points="${pts.map(p => `${X(p[0])},${Y(p[1])}`).join(' ')}" fill="#9aa3b2" fill-opacity="0.2" stroke="#7d8796" stroke-width="1.6" stroke-dasharray="6 4"/>`; }
    const BW = B * SC + 2 * M, BH = H * SC + 2 * M;
    return `<svg viewBox="0 0 ${BW} ${BH}" width="${BW}" height="${BH}" style="max-width:100%;height:auto;touch-action:manipulation;${modus === 'invul' ? 'cursor:crosshair;' : ''}font-family:Verdana,sans-serif" data-h="${H}" data-b="${B}" data-bw="${BW}">${g}</svg>`;
  }

  // ---------- antwoord-API
  const leeg = (a) => ({ pijlen: a.teken.map(() => null), actief: 0 });
  const ingevuld = (a, w) => w.pijlen.every(p => p && p.q);

  function html(id, a, w, uit) {
    const knoppen = a.teken.map((t, i) => `<button type="button" class="keuze vk-r ${(w.actief || 0) === i ? 'aan' : ''}" data-vid="${id}" data-r="${i}" style="border-color:${KLEUR[i % KLEUR.length]}">
        <svg width="${18 + String(t.naam).length * 10}" height="26" style="vertical-align:middle">${naamSVG(9 + String(t.naam).length * 5, 15, t.naam, KLEUR[i % KLEUR.length], 15)}</svg></button>`).join('');
    return `<div class="tekenrooster vectorrooster" id="${id}">${uit ? '' : `<div class="tk-legende">${a.teken.length > 1 ? knoppen : ''}<button type="button" class="link klein vk-wis" data-vid="${id}">pijl wissen</button></div>
      <p class="klein">${a.teken.length > 1 ? 'Kies een pijl, klik' : 'Klik'} eerst het <b>startpunt</b> en dan het <b>eindpunt</b> aan (op een roosterpunt). Opnieuw klikken = opnieuw tekenen.</p>`}
      <div class="tk-svg" id="${id}-svg">${svg(a, w, uit ? 'uit' : 'invul')}</div></div>`;
  }

  function koppel(id, a, w, opts = {}) {
    const box = document.getElementById(`${id}-svg`); if (!box) return;
    const knoppen = () => document.querySelectorAll(`button.vk-r[data-vid="${id}"]`);
    const kies = (i) => { w.actief = i; knoppen().forEach(x => x.classList.toggle('aan', +x.dataset.r === i)); };
    const teken = () => { box.innerHTML = svg(a, w, 'invul'); };
    knoppen().forEach(b => { b.onclick = () => kies(+b.dataset.r); });
    document.querySelectorAll(`button.vk-wis[data-vid="${id}"]`).forEach(b => { b.onclick = () => { w.pijlen[w.actief || 0] = null; teken(); opts.bijWijziging && opts.bijWijziging(); }; });
    box.onclick = (e) => {
      const s = box.querySelector('svg'); if (!s) return;
      const r = s.getBoundingClientRect(), f = +s.dataset.bw / r.width, H = +s.dataset.h, B = +s.dataset.b;
      const x = Math.round(((e.clientX - r.left) * f - M) / SC), y = Math.round(H - ((e.clientY - r.top) * f - M) / SC);
      if (x < 0 || y < 0 || x > B || y > H) return;
      const i = w.actief || 0, pl = w.pijlen[i];
      if (!pl || pl.q) w.pijlen[i] = { p: [x, y] };
      else if (gelijk(pl.p, [x, y])) w.pijlen[i] = null;
      else {
        pl.q = [x, y];
        const v = w.pijlen.findIndex(q => !q || !q.q); if (v >= 0) kies(v);
      }
      teken(); opts.bijWijziging && opts.bijWijziging();
    };
  }

  // tekst voor een verplaatsing: "3 naar rechts en 2 omhoog"
  function woorden(d) {
    const h = d[0] ? `${Math.abs(d[0])} ${d[0] > 0 ? 'naar rechts' : 'naar links'}` : '';
    const v = d[1] ? `${Math.abs(d[1])} ${d[1] > 0 ? 'omhoog' : 'omlaag'}` : '';
    return [h, v].filter(Boolean).join(' en ') || 'geen verplaatsing';
  }
  const nm = (t) => String(t.naam).replace(/-/g, '−');

  function nakijk(a, w) {
    if (!ingevuld(a, w)) return { status: 'leeg', bericht: a.teken.length > 1 ? 'Teken alle pijlen: klik telkens het startpunt en dan het eindpunt aan.' : 'Teken de pijl: klik het startpunt en dan het eindpunt aan.' };
    for (let i = 0; i < a.teken.length; i++) {
      const t = a.teken[i], pl = w.pijlen[i], d = [pl.q[0] - pl.p[0], pl.q[1] - pl.p[1]];
      if (d[0] !== t.d[0] || d[1] !== t.d[1]) {
        const kruis = d[0] * t.d[1] - d[1] * t.d[0], dot = d[0] * t.d[0] + d[1] * t.d[1];
        let b;
        if (kruis === 0 && dot < 0) b = `De pijl ${nm(t)} wijst de verkeerde kant op: kijk naar de zin.`;
        else if (kruis === 0) b = `De pijl ${nm(t)} heeft de juiste richting en zin, maar niet de juiste grootte.`;
        else b = `De pijl ${nm(t)} klopt niet: tel nog eens hoeveel vakjes je horizontaal en verticaal moet gaan.`;
        return { status: 'fout', bericht: b };
      }
      if (t.van && !gelijk(pl.p, t.van)) return { status: 'fout', bericht: `De pijl ${nm(t)} heeft de juiste grootte, richting en zin, maar start niet in het juiste punt.` };
      if (t.kopVan !== undefined && !gelijk(pl.p, w.pijlen[t.kopVan].q)) return { status: 'fout', bericht: `Teken ${nm(t)} vanuit de kop (het eindpunt) van ${nm(a.teken[t.kopVan])}.` };
      if (t.startVan !== undefined && !gelijk(pl.p, w.pijlen[t.startVan].p)) return { status: 'fout', bericht: `${nm(t)} moet in hetzelfde startpunt beginnen als ${nm(a.teken[t.startVan])}.` };
    }
    return { status: 'juist' };
  }

  function juistHTML(a) {
    const regels = a.teken.map(t => `<b>${nm(t)}</b>: ${woorden(t.d)}`).join(' &nbsp;·&nbsp; ');
    return `<div>${regels}</div><div class="vk-klein" style="max-width:340px">${svg(a, { pijlen: a.teken.map(() => null) }, 'oplossing')}</div>`;
  }
  const juistTekst = (a) => a.teken.map(t => `${nm(t)}: ${woorden(t.d)}`).join(' · ');
  function gegeven(a, w) {
    const tekst = w.pijlen.map((pl, i) => `${nm(a.teken[i])}: ${pl && pl.q ? `(${pl.p}) → (${pl.q}), ${woorden([pl.q[0] - pl.p[0], pl.q[1] - pl.p[1]])}` : '—'}`).join(' · ');
    return { tekst, tex: null };
  }

  return { leeg, ingevuld, html, koppel, nakijk, juistHTML, juistTekst, gegeven, svg, naamSVG, pijlSVG, woorden };
})();
