// Wereld ℤ — De IJsrace: racespel in pseudo-3D. Rijd door de poort met het juiste antwoord.
K.WERELDEN[2] = (() => {
  const { BW, BH, ctx, rand, klem } = K;
  const SEG = 200, ZICHT = 160, WEG = 2000, CAMH = 1000, DIEPTE = 1 / Math.tan((100 / 2) * Math.PI / 180);
  const SPELERZ = CAMH * DIEPTE, MAX = 3400, VRAGEN = 4, LANES = [-0.66, 0, 0.66];
  let segs, N, LENGTE, pos, snelheid, x, stuur, t, objecten, poortNr, opgelost, lucht, finish, poortActief;

  function bouw() {
    segs = [];
    const voeg = (n, bocht) => { for (let i = 0; i < n; i++) segs.push({ i: segs.length, bocht, p1: {}, p2: {}, kleur: Math.floor(segs.length / 3) % 2 }); };
    const bochtStuk = (n, b) => { for (let i = 0; i < n; i++) { const f = i < n / 4 ? i / (n / 4) : i > n * 0.75 ? (n - i) / (n / 4) : 1; voeg(1, b * f); } };
    voeg(60, 0);
    for (let k = 0; k < 14; k++) { bochtStuk(K.kies([80, 120, 160]), K.kies([-2.5, -1.5, 1.5, 2.5, 0])); voeg(K.kies([40, 80]), 0); }
    voeg(200, 0);
    N = segs.length; LENGTE = N * SEG;
  }
  const segVan = (z) => segs[Math.floor(z / SEG) % N];

  function plaatsObjecten() {
    objecten = [];
    // munten en ijsblokken tussen de poorten; geen obstakels vlak voor een poort
    for (let z = 4000; z < LENGTE - 8000; z += rand(1400, 2600)) {
      const lane = K.kies([0, 1, 2]);
      if (Math.random() < 0.55) for (let k = 0; k < 3; k++) objecten.push({ z: z + k * 400, lane, soort: 'munt' });
      else objecten.push({ z, lane, soort: 'ijs' });
    }
    objecten.push({ z: LENGTE * 0.45, lane: 1, soort: 'hart' });
  }
  // De opgave als gewone tekst (voor in het spelveld): (−3)², −19 − 11, …
  const opgaveTekst = (q) => W.platteTekst(String(q.v.tex || '').replace(/\\dfrac/g, '\\frac')).replace(/\s*=\s*\?\s*$/, '').trim() + ' = ?';
  function nieuwePoort(z, q) {
    // geen obstakels rond de poort
    objecten = objecten.filter(o => !(o.soort === 'ijs' && Math.abs(o.z - z) < 4500));
    const p = { z, soort: 'poort', q, opties: q.opties.slice(), tekst: opgaveTekst(q) };
    objecten.push(p); poortActief = p;
    K.toonVraag(q, '🏎️ Rijd door de juiste poort');
  }

  function start() {
    bouw(); plaatsObjecten(); t = 0; pos = 0; snelheid = 0; x = 0; stuur = 0; lucht = 0; poortNr = 0; opgelost = 0; finish = null;
    nieuwePoort(16000, K.vraag(2));
  }
  function update(dt) {
    t += dt;
    const doel = K.neer() ? MAX * 0.45 : MAX;
    snelheid += (doel - snelheid) * Math.min(1, dt * (snelheid > doel ? 3 : 0.9));
    const sp = snelheid / MAX, s = segVan(pos + SPELERZ);
    const dx = dt * 2.4 * sp;
    if (K.links()) { x -= dx; stuur = Math.max(-1, stuur - dt * 6); } else if (K.rechts()) { x += dx; stuur = Math.min(1, stuur + dt * 6); } else stuur *= Math.pow(0.001, dt);
    x -= dx * sp * s.bocht * 0.16; // middelpuntvliedende kracht (zacht)
    if (Math.abs(x) > 1.05) snelheid *= Math.pow(0.35, dt);
    x = klem(x, -1.4, 1.4);
    lucht -= s.bocht * sp * dt * 0.06;
    const vorig = pos; pos += snelheid * dt;
    const a = vorig + SPELERZ, b = pos + SPELERZ;
    for (const o of objecten) {
      if (o.weg || o.z < a || o.z >= b) continue;
      if (o.soort === 'poort') {
        const lane = LANES.reduce((best, l, i) => Math.abs(l - x) < Math.abs(LANES[best] - x) ? i : best, 0);
        const op = o.opties[lane];
        o.weg = true;
        if (op && op.goed) {
          K.goed(BW / 2, BH - 160, 100); snelheid = MAX * 1.1; opgelost++;
          if (opgelost >= VRAGEN) { poortActief = null; finish = { z: pos + 14000, soort: 'finish' }; objecten.push(finish); K.infoPaneel('🏁', 'Wereld ℤ — De IJsrace', 'Alle poorten gehaald! Rijd door naar de <b>finish</b> 🏁'); }
          else nieuwePoort(pos + 30000, K.vraag(2));
        } else if (op) {
          K.fout(BW / 2, BH - 160); snelheid *= 0.5;
          const rest = o.opties.map(q => (q === op ? null : q));
          const p = { z: pos + 24000, soort: 'poort', q: o.q, opties: rest, tekst: o.tekst }; objecten.push(p); poortActief = p;
        } else {
          // door een lege doorgang: de poort komt terug
          K.popup(BW / 2, BH - 180, 'Gemist! Nog eens…', '#fff', 22);
          const p = { z: pos + 24000, soort: 'poort', q: o.q, opties: o.opties, tekst: o.tekst }; objecten.push(p); poortActief = p;
        }
      } else if (Math.abs(LANES[o.lane] - x) < 0.36) {
        if (o.soort === 'munt') { o.weg = true; K.munt(BW / 2, BH - 140); }
        else if (o.soort === 'hart') { o.weg = true; K.extraLeven(BW / 2, BH - 160); }
        else if (o.soort === 'ijs' && K.onkwetsbaar <= 0) { o.weg = true; K.raak(BW / 2, BH - 150); snelheid *= 0.25; K.explosie(BW / 2, BH - 120, '#bdf2ff', 30, 260, 4); K.schud(0.3); }
      } else if (o.soort === 'finish') { o.weg = true; K.wereldKlaar(); }
      if (o.soort === 'finish' && !o.weg) { o.weg = true; K.wereldKlaar(); }
    }
    if (pos >= LENGTE - 20000) { pos -= LENGTE - 40000; for (const o of objecten) o.z -= LENGTE - 40000; } // nooit zonder weg vallen
  }

  // ------------------------------------------------------------ projectie en tekenen
  function project(p, cx, cy, cz) {
    p.cx = (p.wx || 0) - cx; p.cy = 0 - cy; p.cz = p.wz - cz;
    p.s = DIEPTE / p.cz; p.x = Math.round(BW / 2 + p.s * p.cx * BW / 2); p.y = Math.round(BH / 2 - p.s * p.cy * BH / 2); p.w = Math.round(p.s * WEG * BW / 2);
  }
  function veelhoek(x1, y1, x2, y2, x3, y3, x4, y4, kleur) { ctx.fillStyle = kleur; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath(); ctx.fill(); }
  function teken() {
    // lucht en bergen
    const g = ctx.createLinearGradient(0, 0, 0, BH / 2); g.addColorStop(0, '#2b6fd6'); g.addColorStop(1, '#bfe6ff');
    ctx.fillStyle = g; ctx.fillRect(0, 0, BW, BH / 2 + 2);
    for (const [par, kleur, h, w] of [[0.3, '#9cc3e6', 150, 260], [0.6, '#d8ecfb', 90, 170]]) {
      ctx.fillStyle = kleur; ctx.beginPath(); ctx.moveTo(0, BH / 2 + 1);
      for (let px = -40; px <= BW + 40; px += 20) { const u = px + lucht * 900 * par; const y = BH / 2 - h * (0.55 + 0.45 * Math.abs(Math.sin(u / w))) * (0.7 + 0.3 * Math.sin(u / (w * 2.3))); ctx.lineTo(px, y); }
      ctx.lineTo(BW, BH / 2 + 1); ctx.closePath(); ctx.fill();
    }
    const basis = segVan(pos), bp = (pos % SEG) / SEG;
    let dx = -(basis.bocht * bp), cx = 0, maxY = BH;
    const lijst = [];
    for (let n = 0; n < ZICHT; n++) {
      const s = segs[(basis.i + n) % N], lus = s.i < basis.i ? LENGTE : 0;
      s.p1.wz = s.i * SEG + lus; s.p2.wz = (s.i + 1) * SEG + lus;
      project(s.p1, x * WEG - cx, CAMH, pos); project(s.p2, x * WEG - cx - dx, CAMH, pos);
      cx += dx; dx += s.bocht; s.clip = maxY;
      if (s.p1.cz <= DIEPTE || s.p2.y >= s.p1.y || s.p2.y >= maxY) continue;
      const { p1, p2 } = s, r1 = p1.w / 6, r2 = p2.w / 6;
      ctx.fillStyle = s.kleur ? '#f4fbff' : '#dcefff'; ctx.fillRect(0, p2.y, BW, p1.y - p2.y + 1);
      veelhoek(p1.x - p1.w - r1, p1.y, p1.x - p1.w, p1.y, p2.x - p2.w, p2.y, p2.x - p2.w - r2, p2.y, s.kleur ? '#ff4d6d' : '#ffffff');
      veelhoek(p1.x + p1.w + r1, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x + p2.w + r2, p2.y, s.kleur ? '#ff4d6d' : '#ffffff');
      veelhoek(p1.x - p1.w, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x - p2.w, p2.y, s.kleur ? '#6f8fb3' : '#7a9bc0');
      if (s.kleur) for (const l of [-0.33, 0.33]) { const w1 = p1.w / 40, w2 = p2.w / 40; veelhoek(p1.x + l * 2 * p1.w - w1, p1.y, p1.x + l * 2 * p1.w + w1, p1.y, p2.x + l * 2 * p2.w + w2, p2.y, p2.x + l * 2 * p2.w - w2, p2.y, '#e8f6ff'); }
      maxY = p1.y; lijst.push(s);
    }
    // objecten (van ver naar dichtbij)
    const zicht = objecten.filter(o => !o.weg && o.z > pos + SPELERZ * 0.6 && o.z < pos + ZICHT * SEG).sort((a, b) => b.z - a.z);
    for (const o of zicht) {
      const s = segVan(o.z), p = s.p1; if (!p.s || p.cz <= 0) continue;
      const sc = p.s * BW / 2;
      if (o.soort === 'poort' || o.soort === 'finish') {
        const by = p.y, hw = p.w;
        if (o.soort === 'finish') {
          ctx.fillStyle = '#333'; ctx.fillRect(p.x - hw * 1.1, by - sc * 900, sc * 60, sc * 900); ctx.fillRect(p.x + hw * 1.1 - sc * 60, by - sc * 900, sc * 60, sc * 900);
          const bh = sc * 200; for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) { ctx.fillStyle = (i + j) % 2 ? '#111' : '#fff'; ctx.fillRect(p.x - hw * 1.1 + i * hw * 2.2 / 16, by - sc * 900 + j * bh / 2, hw * 2.2 / 16 + 1, bh / 2 + 1); }
          continue;
        }
        if (o.tekst && sc > 0.04) { const top = by - sc * 1150; ctx.save(); ctx.translate(p.x, top); const f = Math.min(2, sc * 5.5); ctx.scale(f, f); K.bordje(0, 0, o.tekst, { kleur: '#7b3fe4', groot: 22, achter: 'rgba(255,253,245,.97)', tekst: '#1b1f3b' }); ctx.restore();
          ctx.fillStyle = '#2b3a67'; ctx.fillRect(p.x - hw * 0.02, top + sc * 60, hw * 0.04, sc * 300); }
        LANES.forEach((l, i) => {
          const op = o.opties[i], cxp = p.x + l * hw, bw = hw * 0.55, top = by - sc * 700;
          if (!op) { ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(cxp - bw, top, bw * 2, sc * 40); return; }
          ctx.fillStyle = '#2b3a67'; ctx.fillRect(cxp - bw, top, sc * 50, by - top); ctx.fillRect(cxp + bw - sc * 50, top, sc * 50, by - top);
          ctx.fillStyle = ['#ff7b00', '#7b3fe4', '#00a86b'][i]; ctx.fillRect(cxp - bw, top - sc * 60, bw * 2, sc * 190);
          if (sc > 0.02) { ctx.save(); ctx.translate(cxp, top + sc * 35); const f = Math.max(0.35, Math.min(2.2, sc * 7)); ctx.scale(f, f); K.bordje(0, 0, op.t, { kleur: '#fff', groot: 20, achter: 'rgba(15,20,45,.95)' }); ctx.restore(); }
        });
        continue;
      }
      const ox = p.x + LANES[o.lane] * p.w;
      if (o.soort === 'munt') { const r = sc * 120; if (r > 1.5) K.tekenMunt(ox, p.y - sc * 200, t + o.z, r); }
      else if (o.soort === 'hart') { K.tekenHart(ox, p.y - sc * 260, sc * 18); }
      else if (o.soort === 'ijs') {
        const w = sc * 420, h = sc * 380;
        ctx.fillStyle = 'rgba(150,220,255,.9)'; K.rr(ox - w / 2, p.y - h, w, h, Math.max(1, sc * 40)); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(1, sc * 20); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(ox - w * 0.3, p.y - h * 0.85, w * 0.15, h * 0.5);
      }
    }
    // de opgave groot in beeld, in de lucht boven de weg
    if (poortActief && poortActief.tekst) {
      const tk = poortActief.tekst, afst = Math.max(0, poortActief.z - (pos + SPELERZ));
      ctx.font = '900 40px "Lilita One", sans-serif'; const w = Math.max(260, ctx.measureText(tk).width + 60);
      K.rr(BW / 2 - w / 2, 64, w, 70, 18); ctx.fillStyle = 'rgba(255,253,245,.96)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#7b3fe4'; ctx.stroke();
      ctx.fillStyle = '#1b1f3b'; ctx.textAlign = 'center'; ctx.fillText(tk, BW / 2, 113);
      // de drie antwoorden in de kleur van hun poort (links · midden · rechts)
      const KL = ['#ff7b00', '#7b3fe4', '#00a86b'], NM = ['links', 'midden', 'rechts'];
      LANES.forEach((l, i) => { const op = poortActief.opties[i], cx = BW / 2 + (i - 1) * 150;
        K.rr(cx - 66, 146, 132, 50, 12); ctx.fillStyle = op ? KL[i] : 'rgba(255,255,255,.25)'; ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '700 11px "Atkinson Hyperlegible", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(NM[i], cx, 160);
        ctx.fillStyle = '#fff'; ctx.font = '900 24px "Lilita One", sans-serif'; ctx.fillText(op ? op.t : '✖', cx, 188); });
      ctx.font = '700 15px "Atkinson Hyperlegible", sans-serif'; ctx.fillStyle = '#fff';
      ctx.fillText(afst > 9000 ? 'Reken uit en kies je rijstrook' : 'Poort in zicht: stuur naar het juiste antwoord!', BW / 2, 220);
    }
    // de racewagen met Pi
    tekenWagen(BW / 2 + stuur * 8, BH - 70);
    // snelheid
    ctx.fillStyle = 'rgba(10,14,34,.6)'; K.rr(BW - 170, BH - 50, 160, 38, 19); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '900 18px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${Math.round(snelheid / MAX * 110)} km/u`, BW - 90, BH - 24);
    ctx.fillStyle = 'rgba(10,14,34,.6)'; K.rr(10, BH - 50, 190, 38, 19); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(`🏁 poort ${Math.min(VRAGEN, opgelost + 1)}/${VRAGEN}`, 105, BH - 24);
    K.tekenDeeltjes();
  }
  function tekenWagen(cx, cy) {
    const knipper = K.onkwetsbaar > 0 && Math.floor(t * 12) % 2; if (knipper) return;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(stuur * 0.05);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 36, 100, 14, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#1b1b2b'; for (const sx of [-78, 78]) K.rr(sx - 18, 4, 36, 34, 8), ctx.fill();
    const g = ctx.createLinearGradient(0, -30, 0, 30); g.addColorStop(0, '#ff5a5f'); g.addColorStop(1, '#b3122e');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-90, 24); ctx.lineTo(-70, -6); ctx.lineTo(70, -6); ctx.lineTo(90, 24); ctx.lineTo(80, 34); ctx.lineTo(-80, 34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(-60, 10, 120, 6);
    ctx.fillStyle = '#222'; K.rr(-100, -22, 200, 14, 4); ctx.fill(); ctx.fillStyle = '#ff5a5f'; ctx.fillRect(-90, -20, 180, 4);
    ctx.fillStyle = '#ffe9a0'; ctx.fillRect(-82, 18, 16, 8); ctx.fillRect(66, 18, 16, 8);
    // Pi's hoofd met helm
    ctx.fillStyle = '#d9eefc'; K.rr(-20, -46, 40, 34, 13); ctx.fill(); ctx.strokeStyle = '#173a7a'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#ffd23f'; K.rr(-22, -50, 44, 14, 7); ctx.fill();
    ctx.fillStyle = '#ff5d8f'; ctx.beginPath(); ctx.arc(-6, -56, 4, 0, 7); ctx.fill();
    ctx.restore();
  }
  return { start, update, teken, _staat: () => ({ pos, x, objecten, poortActief, opgelost, LANES, SPELERZ }) };
})();
