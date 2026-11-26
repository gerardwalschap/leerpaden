// Wereld ℕ — Natuurland: platformspel. Muren met een "?" gaan open als je van onderen
// tegen het blok met het juiste antwoord springt.
K.WERELDEN[1] = (() => {
  const { BW, BH, ctx, rand, klem } = K;
  const TS = 40, RIJEN = 15, GROND = 13; // grond = rij 13 en 14
  const VRAGEN = 4;
  let L, kaart, munten, harten, slijm, blokken, poorten, vlag, pi, cam, cp, t, wolken;

  function bouw() {
    const cols = [], zet = (c, r, v) => { cols[c] = cols[c] || []; cols[c][r] = v; };
    munten = []; harten = []; slijm = []; blokken = []; poorten = [];
    let c = 0;
    const vlak = (n, metMunten) => { for (let i = 0; i < n; i++, c++) { zet(c, GROND, '#'); zet(c, GROND + 1, '#'); if (metMunten && i % 2 === 0 && i > 0 && i < n - 1) munten.push({ x: c * TS + 20, y: (GROND - 2) * TS + 10 - Math.sin(i / n * Math.PI) * 50 }); } };
    const CHUNKS = {
      gat() { vlak(2); const w = rand(0, 1) < 0.5 ? 2 : 3; for (let i = 0; i < 3; i++) munten.push({ x: (c + w / 2) * TS + (i - 1) * 26, y: (GROND - 4) * TS }); c += w; vlak(3); },
      platform() { const st = c; vlak(8, false); const n = 4, r = GROND - 4; for (let i = 0; i < n; i++) { zet(st + 2 + i, r, 'B'); munten.push({ x: (st + 2 + i) * TS + 20, y: (r - 1) * TS + 18 }); } },
      trap() { const st = c; vlak(9); for (let i = 0; i < 3; i++) for (let h = 0; h <= i; h++) { zet(st + 2 + i, GROND - 1 - h, '#'); zet(st + 7 - i, GROND - 1 - h, '#'); } munten.push({ x: (st + 4.5) * TS + 20, y: (GROND - 6) * TS }); },
      vijand() { const st = c; vlak(10, true); slijm.push({ x: (st + 6) * TS, y: GROND * TS - 24, vx: -55, dood: 0 }); },
      pijp() { const st = c; vlak(7); for (const r of [GROND - 1, GROND - 2]) { zet(st + 3, r, 'P'); zet(st + 4, r, 'P'); } munten.push({ x: (st + 4) * TS, y: (GROND - 4) * TS }); },
      dubbelGat() { vlak(2); c += 2; vlak(1); zet(c - 1, GROND - 3, 'B'); c += 2; vlak(3); munten.push({ x: (c - 4) * TS + 20, y: (GROND - 5) * TS }); },
    };
    vlak(10);
    const namen = Object.keys(CHUNKS);
    for (let p = 0; p < VRAGEN; p++) {
      const n = 3 + Math.min(2, p);
      for (let i = 0; i < n; i++) CHUNKS[K.kies(namen)]();
      if (p === 1 || p === 3) { harten.push({ x: c * TS - 60, y: (GROND - 5) * TS }); }
      if (p >= 1) slijm.push({ x: (c - 3) * TS, y: GROND * TS - 24, vx: 50, dood: 0 });
      // vraagpoort: 12 vlakke tegels, 3 blokken, dan een muur tot boven
      const st = c; vlak(13);
      const muur = st + 11, poort = { col: muur, open: false, actief: false, q: null, nr: p };
      for (let r = 0; r < GROND; r++) zet(muur, r, 'W');
      [st + 2, st + 5, st + 8].forEach(bc => blokken.push({ x: bc * TS - 12, y: (GROND - 4) * TS - 40, w: 64, h: 40, tekst: '?', goed: false, poort, weg: 0, bots: 0 }));
      poorten.push(poort);
      vlak(3);
    }
    CHUNKS.trap(); vlak(6, true);
    vlag = { x: c * TS, y: (GROND - 8) * TS }; vlak(14);
    L = c;
    kaart = cols;
  }
  const tegel = (c, r) => (kaart[c] && kaart[c][r]) || '';
  function vast(c, r) {
    if (c < 0) return true; if (c >= L) return true; if (r < 0) return false;
    const v = tegel(c, r); if (v === 'W') { const p = poorten.find(q => q.col === c); return !(p && p.open); }
    return v === '#' || v === 'B' || v === 'P';
  }
  const raakt = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  function start() {
    bouw(); t = 0;
    pi = { x: 3 * TS, y: GROND * TS - 42, w: 24, h: 42, vx: 0, vy: 0, grond: false, kijk: 1, stap: 0, coyote: 0, buffer: 0 };
    cp = { x: pi.x, y: pi.y }; cam = 0;
    wolken = Array.from({ length: 10 }, () => ({ x: rand(0, L * TS), y: rand(30, 200), s: rand(0.6, 1.4) }));
    K.infoPaneel('🌳', 'Wereld ℕ — Natuurland', 'Loop naar rechts. Bij een <b>muur met ?</b> verschijnt een opgave: spring van onderen tegen het blok met het juiste antwoord.');
  }

  function activeer(p) {
    p.actief = true; p.q = K.vraag(1);
    const bl = blokken.filter(b => b.poort === p);
    bl.forEach((b, i) => { b.tekst = p.q.opties[i].t; b.goed = p.q.opties[i].goed; b.weg = 0; });
    K.toonVraag(p.q, '↑ Spring tegen het juiste blok');
  }
  function bots(b) {
    b.bots = 0.2; const p = b.poort;
    if (!p.actief || p.open || b.weg) { K.SFX.plof(); return; }
    if (b.goed) {
      p.open = true; K.goed(b.x + b.w / 2, b.y, 100); K.SFX.deur();
      for (let r = 0; r < GROND; r++) K.explosie(p.col * TS + 20, r * TS + 20, '#c78bff', 4, 140, 3, 300);
      blokken.filter(x => x.poort === p && x !== b).forEach(x => { x.weg = 0.5; });
      b.klaar = true; cp = { x: p.col * TS + 60, y: GROND * TS - 42 };
      K.infoPaneel('🌳', 'Wereld ℕ — Natuurland', p.nr < VRAGEN - 1 ? 'Goed zo! Loop verder naar rechts.' : 'Alle muren zijn open! Op naar de vlag 🚩');
    } else {
      b.weg = 0.5; K.fout(b.x + b.w / 2, b.y);
    }
  }

  function update(dt) {
    t += dt;
    const P = pi, MAX = 250;
    const dx = (K.rechts() ? 1 : 0) - (K.links() ? 1 : 0);
    if (dx) { P.vx += dx * 1900 * dt; P.kijk = dx; } else P.vx *= Math.pow(0.0005, dt);
    P.vx = klem(P.vx, -MAX, MAX);
    P.coyote = P.grond ? 0.1 : Math.max(0, P.coyote - dt);
    if (K.gedrukt(' ', 'ArrowUp', 'w', 'z')) P.buffer = 0.14; else P.buffer = Math.max(0, P.buffer - dt);
    if (P.buffer > 0 && P.coyote > 0) { P.vy = -700; P.buffer = 0; P.coyote = 0; K.SFX.sprong(); }
    const houd = K.toets[' '] || K.toets.ArrowUp || K.toets.w || K.toets.z;
    P.vy += (P.vy < 0 && !houd ? 3600 : 1800) * dt; P.vy = Math.min(P.vy, 900);
    // x-beweging
    P.x += P.vx * dt;
    botsTegels(P, true);
    for (const b of blokken) if (!b.weg && raakt(P, b)) { if (P.vx > 0) P.x = b.x - P.w; else if (P.vx < 0) P.x = b.x + b.w; P.vx = 0; }
    // y-beweging
    P.y += P.vy * dt; P.grond = false;
    botsTegels(P, false);
    for (const b of blokken) if (!b.weg && raakt(P, b)) {
      if (P.vy > 0) { P.y = b.y - P.h; P.vy = 0; P.grond = true; }
      else if (P.vy < 0) { P.y = b.y + b.h; P.vy = 60; bots(b); }
    }
    if (Math.abs(P.vx) > 20 && P.grond) P.stap += dt * 14;
    // in een gat gevallen
    if (P.y > BH + 80) { K.onkwetsbaar = 0; if (!K.raak(P.x, BH - 60)) { P.x = cp.x; P.y = cp.y; P.vx = 0; P.vy = 0; } else { P.y = BH + 80; P.vy = 0; } }
    // poorten activeren
    for (const p of poorten) if (!p.actief && !p.open && P.x > (p.col - 14) * TS) { if (!poorten.some(q => q.actief && !q.open)) activeer(p); }
    // munten, harten
    for (const m of munten) if (!m.weg && Math.abs(P.x + P.w / 2 - m.x) < 22 && Math.abs(P.y + P.h / 2 - m.y) < 28) { m.weg = true; K.munt(m.x, m.y); K.explosie(m.x, m.y, '#ffd23f', 8, 90); }
    for (const h of harten) if (!h.weg && Math.abs(P.x + P.w / 2 - h.x) < 24 && Math.abs(P.y + P.h / 2 - h.y) < 30) { h.weg = true; K.extraLeven(h.x, h.y); K.explosie(h.x, h.y, '#ff7aa2', 20, 150); }
    // slijmpjes
    for (const s of slijm) {
      if (s.dood) { s.dood -= dt; continue; }
      if (Math.abs(s.x - P.x) > BW * 1.2) continue;
      s.vy = (s.vy || 0) + 1800 * dt; s.y += s.vy * dt;
      const r = Math.floor((s.y + 24) / TS); if (vast(Math.floor((s.x + 16) / TS), r)) { s.y = r * TS - 24; s.vy = 0; }
      const voor = s.vx > 0 ? s.x + 34 : s.x - 2, c = Math.floor(voor / TS), rr = Math.floor((s.y + 12) / TS);
      if (vast(c, rr) || !vast(c, Math.floor((s.y + 30) / TS))) s.vx = -s.vx;
      s.x += s.vx * dt;
      if (s.y > BH + 100) { s.dood = 0.01; continue; }
      const sb = { x: s.x + 2, y: s.y + 4, w: 28, h: 20 };
      if (raakt(P, sb)) {
        if (P.vy > 50 && P.y + P.h - s.y < 18) { s.dood = 0.6; s.plat = true; P.vy = -480; K.SFX.plof(); K.S.score += 50; K.popup(s.x + 16, s.y, '+50', '#fff'); K.explosie(s.x + 16, s.y + 12, '#7dff6a', 14, 140); }
        else if (K.onkwetsbaar <= 0) { K.raak(P.x, P.y); P.vx = (P.x < s.x ? -1 : 1) * 320; P.vy = -360; }
      }
    }
    // vlag
    if (vlag && !vlag.gehaald && P.x + P.w > vlag.x) { vlag.gehaald = true; K.wereldKlaar(); vlag = { ...vlag, x: -9999, gehaald: true, oud: vlag.x }; }
    blokken.forEach(b => { if (b.weg) b.weg = Math.max(0, b.weg - dt) || (b.weg > 0 ? b.weg : 0); b.bots = Math.max(0, b.bots - dt); });
    blokken.forEach(b => { if (b.weg !== 0 && b.weg < 0.02) b.weg = -1; });
    cam += (klem(P.x - BW * 0.38, 0, L * TS - BW) - cam) * Math.min(1, dt * 8);
  }
  function botsTegels(P, opX) {
    const c0 = Math.floor(P.x / TS), c1 = Math.floor((P.x + P.w - 0.01) / TS), r0 = Math.floor(P.y / TS), r1 = Math.floor((P.y + P.h - 0.01) / TS);
    for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) {
      if (!vast(c, r)) continue;
      if (opX) { if (P.vx > 0) P.x = c * TS - P.w; else if (P.vx < 0) P.x = (c + 1) * TS; P.vx = 0; }
      else { if (P.vy > 0) { P.y = r * TS - P.h; P.vy = 0; P.grond = true; } else if (P.vy < 0) { P.y = (r + 1) * TS; P.vy = 0; } }
      return botsTegels(P, opX);
    }
  }

  // ------------------------------------------------------------ tekenen
  function heuvels(par, kleur, hoogte, golf) {
    ctx.fillStyle = kleur; ctx.beginPath(); ctx.moveTo(0, BH);
    for (let x = 0; x <= BW; x += 16) { const w = (x + cam * par); ctx.lineTo(x, BH - hoogte - Math.sin(w / golf) * 40 - Math.sin(w / (golf * 0.37)) * 18); }
    ctx.lineTo(BW, BH); ctx.closePath(); ctx.fill();
  }
  function teken() {
    const g = ctx.createLinearGradient(0, 0, 0, BH); g.addColorStop(0, '#5ec8ff'); g.addColorStop(0.7, '#bdf0ff'); g.addColorStop(1, '#e8fbff');
    ctx.fillStyle = g; ctx.fillRect(0, 0, BW, BH);
    ctx.fillStyle = 'rgba(255,240,150,.9)'; ctx.beginPath(); ctx.arc(BW - 140, 110, 46, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,150,.25)'; ctx.beginPath(); ctx.arc(BW - 140, 110, 70, 0, 7); ctx.fill();
    for (const w of wolken) { const x = ((w.x - cam * 0.3) % (L * TS)) ; if (x < -150 || x > BW + 150) continue; ctx.fillStyle = 'rgba(255,255,255,.9)'; for (const [dx, dy, r] of [[0, 0, 26], [28, -10, 32], [58, 0, 24], [30, 8, 26]]) { ctx.beginPath(); ctx.arc(x + dx * w.s, w.y + dy * w.s, r * w.s, 0, 7); ctx.fill(); } }
    heuvels(0.15, '#9ad9a8', 230, 180); heuvels(0.35, '#6cc47e', 150, 120);
    ctx.save(); ctx.translate(-Math.round(cam), 0);
    const c0 = Math.max(0, Math.floor(cam / TS) - 1), c1 = Math.min(L, c0 + Math.ceil(BW / TS) + 2);
    for (let c = c0; c < c1; c++) for (let r = 0; r < RIJEN; r++) {
      const v = tegel(c, r), x = c * TS, y = r * TS; if (!v) continue;
      if (v === '#') {
        ctx.fillStyle = '#9b6a3c'; ctx.fillRect(x, y, TS, TS);
        ctx.fillStyle = '#86592f'; ctx.fillRect(x + 6, y + 14, 6, 6); ctx.fillRect(x + 24, y + 26, 7, 5);
        if (!vast(c, r - 1)) { ctx.fillStyle = '#4fc94f'; ctx.fillRect(x, y, TS, 11); ctx.fillStyle = '#3aa63a'; for (let i = 0; i < 5; i++) ctx.fillRect(x + i * 8 + 2, y + 9, 4, 4); }
      } else if (v === 'B') {
        ctx.fillStyle = '#e0763a'; ctx.fillRect(x, y, TS, TS); ctx.strokeStyle = '#8a3c16'; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, TS - 2, TS - 2);
        ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x + TS, y + 20); ctx.moveTo(x + 20, y); ctx.lineTo(x + 20, y + 20); ctx.moveTo(x + 10, y + 20); ctx.lineTo(x + 10, y + 40); ctx.moveTo(x + 30, y + 20); ctx.lineTo(x + 30, y + 40); ctx.stroke();
      } else if (v === 'P') {
        ctx.fillStyle = '#35b04a'; ctx.fillRect(x, y, TS, TS); ctx.fillStyle = '#5be06f'; ctx.fillRect(x + 6, y, 8, TS);
      } else if (v === 'W') {
        const p = poorten.find(q => q.col === c); if (p && p.open) continue;
        const a = 0.55 + 0.25 * Math.sin(t * 5 + r);
        ctx.fillStyle = `rgba(150,80,255,${a})`; ctx.fillRect(x + 6, y, TS - 12, TS);
        ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x + 18, y, 4, TS);
        if (r % 3 === 1) { ctx.fillStyle = '#fff'; ctx.font = '900 22px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('?', x + 20, y + 28); }
      }
    }
    // blokken
    for (const b of blokken) {
      if (b.weg < 0) continue;
      const o = b.bots > 0 ? -Math.sin(b.bots / 0.2 * Math.PI) * 10 : 0;
      ctx.globalAlpha = b.weg > 0 ? b.weg / 0.5 : 1;
      const kleur = b.klaar ? '#4dff9a' : b.poort.actief ? '#ffd23f' : '#c9a24a';
      ctx.fillStyle = b.klaar ? '#2f8f5a' : '#d9a23a'; K.rr(b.x, b.y + o, b.w, b.h, 6); ctx.fill(); ctx.strokeStyle = '#7a4f10'; ctx.lineWidth = 3; ctx.stroke();
      if (b.tekst === '?') { ctx.fillStyle = '#fff6c8'; ctx.font = '900 26px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('?', b.x + b.w / 2, b.y + o + 30); }
      else K.bordje(b.x + b.w / 2, b.y + o + b.h / 2, b.tekst, { kleur, groot: 20, minB: b.w });
      ctx.globalAlpha = 1;
    }
    for (const m of munten) if (!m.weg && m.x > cam - 40 && m.x < cam + BW + 40) K.tekenMunt(m.x, m.y, t + m.x * 0.01, 11);
    for (const h of harten) if (!h.weg) K.tekenHart(h.x, h.y + Math.sin(t * 3) * 5, 1.6);
    for (const s of slijm) {
      if (s.dood < 0) continue;
      if (s.dood > 0 && !s.plat) continue;
      const pl = s.plat ? 0.35 : 1 + Math.sin(t * 8 + s.x) * 0.08;
      ctx.save(); ctx.translate(s.x + 16, s.y + 24); ctx.scale(1, pl);
      ctx.fillStyle = '#7b3fe4'; ctx.beginPath(); ctx.ellipse(0, -12, 17, 13, 0, Math.PI, 0); ctx.lineTo(17, 0); ctx.lineTo(-17, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-6, -14, 4, 0, 7); ctx.arc(6, -14, 4, 0, 7); ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-6 + Math.sign(s.vx) * 1.5, -14, 2, 0, 7); ctx.arc(6 + Math.sign(s.vx) * 1.5, -14, 2, 0, 7); ctx.fill();
      ctx.restore();
    }
    // vlag
    const vx = vlag && !vlag.gehaald ? vlag.x : vlag && vlag.oud;
    if (vx) { ctx.fillStyle = '#ddd'; ctx.fillRect(vx + 8, vlag.y, 6, (GROND * TS) - vlag.y); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(vx + 11, vlag.y, 8, 0, 7); ctx.fill();
      ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); ctx.moveTo(vx + 14, vlag.y + 10); ctx.lineTo(vx + 70, vlag.y + 30 + Math.sin(t * 6) * 4); ctx.lineTo(vx + 14, vlag.y + 50); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '900 18px "Lilita One"'; ctx.textAlign = 'center'; ctx.fillText('ℕ', vx + 36, vlag.y + 36); }
    // Pi
    if (!(K.onkwetsbaar > 0 && Math.floor(t * 12) % 2)) K.tekenPi(pi.x + pi.w / 2, pi.y + pi.h - 21, 0.95, pi.kijk, pi.grond ? pi.stap : 1.2);
    K.tekenDeeltjes();
    ctx.restore();
  }
  return { start, update, teken, _pi: () => pi, _blokken: () => blokken, _poorten: () => poorten };
})();
