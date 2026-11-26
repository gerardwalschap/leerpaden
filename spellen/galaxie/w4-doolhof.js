// Wereld ℝ — De Robotfabriek: 3D-doolhof (raycaster). Schakel de robot met het juiste antwoord uit:
// dan gaat de deur naar de volgende hal open. Schiet de bugs neer voor munten.
K.WERELDEN[4] = (() => {
  const { BW, BH, ctx, rand, klem } = K;
  const KAART = [
    '1111111111111111111111111111111111111',
    '1.....1......2......1......2......E.1',
    '1.c.R.1..R...2...R..1..R...2........1',
    '1P....D...R..D......D....R.D.....h..1',
    '1.....1......2..R...1......2........1',
    '1..R..1..R...2...R..1..R...2...c....1',
    '1.R...1....c.2......1...c..2........1',
    '1111111111111111111111111111111111111',
  ];
  const HALLEN = [[1, 5], [7, 12], [14, 19], [21, 26], [28, 35]]; // kolommen per hal
  const FOV = 1.15, STAP = 2;
  let kaart, W_, H_, deuren, robots, bugs, items, pi, t, zbuf, flits, hal, uitgang, schudG, actieveVraag;

  function start() {
    kaart = KAART.map(r => [...r]); H_ = kaart.length; W_ = kaart[0].length;
    deuren = []; robots = []; bugs = []; items = []; t = 0; flits = 0; schudG = 0; hal = -1; actieveVraag = null;
    kaart.forEach((rij, y) => rij.forEach((ch, x) => {
      if (ch === 'P') { pi = { x: x + 0.5, y: y + 0.5, a: 0, bob: 0 }; kaart[y][x] = '.'; }
      if (ch === 'D') deuren.push({ x, y, open: 0, los: false });
      if (ch === 'R') { robots.push({ x: x + 0.5, y: y + 0.5, hal: HALLEN.findIndex(([a, b]) => x >= a && x <= b), tekst: '?', goed: false, weg: 0, fase: rand(0, 6) }); kaart[y][x] = '.'; }
      if (ch === 'c' || ch === 'h') { items.push({ x: x + 0.5, y: y + 0.5, soort: ch }); kaart[y][x] = '.'; }
      if (ch === 'E') { uitgang = { x: x + 0.5, y: y + 0.5 }; kaart[y][x] = '.'; }
    }));
    deuren.sort((a, b) => a.x - b.x);
    // bugs in hal 2 t.e.m. 4
    for (const [h, n] of [[1, 1], [2, 2], [3, 2]]) for (let i = 0; i < n; i++) { const [a, b] = HALLEN[h]; bugs.push({ x: rand(a + 1, b - 1), y: rand(1.5, 6), hal: h, leeft: true, fase: rand(0, 6) }); }
    zbuf = new Float32Array(Math.ceil(BW / STAP));
    K.infoPaneel('🤖', 'Wereld ℝ — De Robotfabriek', 'Wandel met de pijltjes. Een deur gaat open als je de <b>robot met het juiste antwoord</b> neerschiet (spatie).');
  }
  const muur = (x, y) => {
    const c = kaart[Math.floor(y)] && kaart[Math.floor(y)][Math.floor(x)];
    if (c === undefined) return '1';
    if (c === 'D') { const d = deuren.find(d => d.x === Math.floor(x) && d.y === Math.floor(y)); return d && d.open >= 1 ? null : 'D'; }
    return c === '1' || c === '2' ? c : null;
  };
  function activeerHal(h) {
    hal = h;
    if (h >= HALLEN.length - 1) { K.infoPaneel('🌀', 'Wereld ℝ — De Robotfabriek', 'Alle deuren zijn open! Loop naar het <b>portaal</b> 🌀 achteraan.'); actieveVraag = null; return; }
    const q = K.vraag(4), rs = robots.filter(r => r.hal === h); actieveVraag = q;
    rs.forEach((r, i) => { r.tekst = q.opties[i % 3].t; r.goed = q.opties[i % 3].goed && i < 3; });
    K.toonVraag(q, '🎯 Schiet de robot met het juiste antwoord');
  }

  function update(dt) {
    t += dt; flits = Math.max(0, flits - dt); schudG = Math.max(0, schudG - dt);
    const rot = 2.6, v = 3.1;
    if (K.links()) pi.a -= rot * dt; if (K.rechts()) pi.a += rot * dt;
    let mv = 0; if (K.op()) mv = 1; else if (K.neer()) mv = -0.7;
    if (mv) {
      const nx = pi.x + Math.cos(pi.a) * v * mv * dt, ny = pi.y + Math.sin(pi.a) * v * mv * dt, r = 0.25;
      if (!muur(nx + Math.sign(nx - pi.x) * r, pi.y)) pi.x = nx;
      if (!muur(pi.x, ny + Math.sign(ny - pi.y) * r)) pi.y = ny;
      pi.bob += dt * 10;
    }
    const h = HALLEN.findIndex(([a, b]) => pi.x >= a && pi.x < b + 1);
    if (h > hal) activeerHal(h);
    if (K.gedrukt(' ')) schiet();
    deuren.forEach(d => { if (d.los && d.open < 1) d.open = Math.min(1, d.open + dt * 1.2); });
    robots.forEach(r => { if (r.weg > 0) r.weg = Math.max(0, r.weg - dt); });
    for (const b of bugs) {
      if (!b.leeft) continue;
      const dx = pi.x - b.x, dy = pi.y - b.y, d = Math.hypot(dx, dy);
      b.fase += dt * 6;
      if (b.hal <= hal && d < 7) { const s = 1.05 * dt; const nx = b.x + dx / d * s, ny = b.y + dy / d * s; if (!muur(nx, b.y)) b.x = nx; if (!muur(b.x, ny)) b.y = ny; }
      if (d < 0.55) { if (K.raak(BW / 2, BH / 2)) return; schudG = 0.3; b.x -= dx / d * 1.6; b.y -= dy / d * 1.6; if (muur(b.x, b.y)) { b.x += dx / d * 1.6; b.y += dy / d * 1.6; } }
    }
    for (const it of items) if (!it.weg && Math.hypot(pi.x - it.x, pi.y - it.y) < 0.5) { it.weg = true; if (it.soort === 'c') K.munt(BW / 2, BH / 2); else K.extraLeven(BW / 2, BH / 2); }
    if (uitgang && Math.hypot(pi.x - uitgang.x, pi.y - uitgang.y) < 0.6) { uitgang = null; K.wereldKlaar(); }
  }
  // Wat ligt er in het vizier? (dichtstbijzijnde robot of bug in de kijkrichting, niet achter een muur)
  function schiet() {
    flits = 0.12; K.SFX.schot();
    const muurAfst = straal(pi.a).d;
    let best = null;
    const doelen = [...robots.filter(r => !r.weg && r.hal === hal && r.tekst !== '?').map(r => ({ o: r, s: 'robot', w: 0.32 })), ...bugs.filter(b => b.leeft).map(b => ({ o: b, s: 'bug', w: 0.28 }))];
    for (const d of doelen) {
      const dx = d.o.x - pi.x, dy = d.o.y - pi.y, dist = Math.hypot(dx, dy);
      let hoek = Math.atan2(dy, dx) - pi.a; while (hoek > Math.PI) hoek -= 2 * Math.PI; while (hoek < -Math.PI) hoek += 2 * Math.PI;
      if (Math.abs(hoek) < Math.atan(d.w / dist) + 0.03 && dist < muurAfst + 0.3 && (!best || dist < best.dist)) best = { ...d, dist };
    }
    if (!best) return;
    const [sx, sy] = naarScherm(best.o.x, best.o.y);
    if (best.s === 'bug') { best.o.leeft = false; K.explosie(sx, sy, '#7dff6a', 22, 200); K.munt(sx, sy); K.popup(sx, sy - 40, '+10', '#fff'); return; }
    const r = best.o;
    if (r.goed) {
      r.weg = 0.8; r.dood = true; K.goed(sx, sy - 40, 150); K.explosie(sx, sy, '#ffd23f', 40, 300, 4);
      robots.filter(x => x.hal === hal && x !== r).forEach(x => { x.weg = 0.8; x.dood = true; });
      const d = deuren[hal]; if (d) { d.los = true; K.SFX.deur(); }
      K.infoPaneel('🚪', 'Wereld ℝ — De Robotfabriek', hal < HALLEN.length - 2 ? 'Juist! De deur gaat open — op naar de volgende hal ➜' : 'Juist! Nog één deur… het portaal is vlakbij ➜');
    } else { r.weg = 0.8; r.dood = true; K.fout(sx, sy - 40); K.explosie(sx, sy, '#ff6b6b', 30, 240, 3); }
  }
  function straal(hoek) {
    const dx = Math.cos(hoek), dy = Math.sin(hoek);
    let mx = Math.floor(pi.x), my = Math.floor(pi.y);
    const ddx = Math.abs(1 / dx), ddy = Math.abs(1 / dy);
    let sx, sy, zx, zy;
    if (dx < 0) { sx = -1; zx = (pi.x - mx) * ddx; } else { sx = 1; zx = (mx + 1 - pi.x) * ddx; }
    if (dy < 0) { sy = -1; zy = (pi.y - my) * ddy; } else { sy = 1; zy = (my + 1 - pi.y) * ddy; }
    let kant = 0, soort = null;
    for (let i = 0; i < 64; i++) {
      if (zx < zy) { zx += ddx; mx += sx; kant = 0; } else { zy += ddy; my += sy; kant = 1; }
      soort = muur(mx + 0.5, my + 0.5); if (soort) break;
    }
    const d = kant === 0 ? (mx - pi.x + (1 - sx) / 2) / dx : (my - pi.y + (1 - sy) / 2) / dy;
    const raak = kant === 0 ? pi.y + d * dy : pi.x + d * dx;
    return { d: Math.max(0.05, d), kant, soort, tx: raak - Math.floor(raak), mx, my };
  }
  function naarScherm(x, y) {
    const dx = x - pi.x, dy = y - pi.y; let h = Math.atan2(dy, dx) - pi.a;
    while (h > Math.PI) h -= 2 * Math.PI; while (h < -Math.PI) h += 2 * Math.PI;
    const d = Math.hypot(dx, dy) * Math.cos(h);
    return [BW / 2 + Math.tan(h) / Math.tan(FOV / 2) * BW / 2, BH / 2 + (BH * 0.55) / d * 0.15, d, h];
  }

  function teken() {
    const bob = Math.sin(pi.bob) * 4, hor = BH / 2 + bob;
    ctx.save(); if (schudG > 0) ctx.translate(rand(-6, 6) * schudG * 3, rand(-6, 6) * schudG * 3);
    let g = ctx.createLinearGradient(0, 0, 0, hor); g.addColorStop(0, '#0e1426'); g.addColorStop(1, '#2a3354'); ctx.fillStyle = g; ctx.fillRect(0, 0, BW, hor);
    g = ctx.createLinearGradient(0, hor, 0, BH); g.addColorStop(0, '#2d2a36'); g.addColorStop(1, '#5a5566'); ctx.fillStyle = g; ctx.fillRect(0, hor, BW, BH - hor);
    // muren
    const n = zbuf.length;
    for (let i = 0; i < n; i++) {
      const camx = (i * STAP + STAP / 2) / BW * 2 - 1, hoek = pi.a + Math.atan(camx * Math.tan(FOV / 2));
      const r = straal(hoek), d = r.d * Math.cos(hoek - pi.a); zbuf[i] = d;
      const h = (BH * 0.95) / d, y0 = hor - h / 2;
      const donker = klem(1 - d / 14, 0.18, 1) * (r.kant ? 0.78 : 1);
      let kl;
      if (r.soort === 'D') { const deur = deuren.find(q => q.x === r.mx && q.y === r.my), o = deur ? deur.open : 0; kl = [150 + 60 * Math.sin(t * 4), 70, 230]; if (o > 0 && r.tx < o) continue; }
      else kl = r.soort === '2' ? [70, 140, 170] : [120, 115, 140];
      ctx.fillStyle = `rgb(${kl[0] * donker | 0},${kl[1] * donker | 0},${kl[2] * donker | 0})`;
      ctx.fillRect(i * STAP, y0, STAP, h);
      // eenvoudige textuur: voegen en panelen
      ctx.fillStyle = `rgba(0,0,0,${0.25 * donker})`;
      for (const f of [0.25, 0.5, 0.75]) ctx.fillRect(i * STAP, y0 + h * f, STAP, Math.max(1, h * 0.012));
      if (r.tx < 0.04 || r.tx > 0.96) ctx.fillRect(i * STAP, y0, STAP, h);
      if (r.soort === 'D') { ctx.fillStyle = `rgba(255,255,255,${0.35 * donker})`; if (Math.abs(r.tx - 0.5) < 0.04) ctx.fillRect(i * STAP, y0, STAP, h); }
      if (r.soort === '1' && Math.abs(r.tx - 0.5) < 0.06) { ctx.fillStyle = `rgba(255,200,80,${0.5 * donker})`; ctx.fillRect(i * STAP, y0 + h * 0.08, STAP, h * 0.04); }
    }
    // sprites (van ver naar dichtbij)
    const sprites = [];
    robots.forEach(r => { if (!(r.dood && r.weg <= 0)) sprites.push({ x: r.x, y: r.y, s: 'robot', o: r }); });
    bugs.forEach(b => { if (b.leeft) sprites.push({ x: b.x, y: b.y, s: 'bug', o: b }); });
    items.forEach(it => { if (!it.weg) sprites.push({ x: it.x, y: it.y, s: it.soort, o: it }); });
    if (uitgang) sprites.push({ x: uitgang.x, y: uitgang.y, s: 'poort' });
    sprites.forEach(s => { s.d = Math.hypot(s.x - pi.x, s.y - pi.y); }); sprites.sort((a, b) => b.d - a.d);
    for (const s of sprites) {
      const [sx, , d, h] = naarScherm(s.x, s.y);
      if (d < 0.2 || Math.abs(h) > FOV) continue;
      const kol = Math.floor(sx / STAP); if (kol >= 0 && kol < n && zbuf[kol] < d - 0.2) continue;
      const grootte = (BH * 0.95) / d, voet = hor + grootte / 2;
      ctx.save(); ctx.globalAlpha = klem(1.6 - d / 10, 0.3, 1);
      if (s.s === 'robot') tekenRobot(sx, voet, grootte, s.o);
      else if (s.s === 'bug') tekenBug(sx, hor + Math.sin(s.o.fase) * grootte * 0.08, grootte);
      else if (s.s === 'c') K.tekenMunt(sx, voet - grootte * 0.25, t + s.x, grootte * 0.12);
      else if (s.s === 'h') K.tekenHart(sx, voet - grootte * 0.3, grootte * 0.02);
      else if (s.s === 'poort') tekenPortaal(sx, hor, grootte);
      ctx.restore();
    }
    // wapen en vizier
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(BW / 2 - 12, BH / 2); ctx.lineTo(BW / 2 - 4, BH / 2); ctx.moveTo(BW / 2 + 4, BH / 2); ctx.lineTo(BW / 2 + 12, BH / 2); ctx.moveTo(BW / 2, BH / 2 - 12); ctx.lineTo(BW / 2, BH / 2 - 4); ctx.moveTo(BW / 2, BH / 2 + 4); ctx.lineTo(BW / 2, BH / 2 + 12); ctx.stroke();
    const wx = BW / 2 + 90 + Math.cos(pi.bob * 0.5) * 6, wy = BH - 20 + Math.abs(Math.sin(pi.bob * 0.5)) * 8 + (flits > 0 ? 10 : 0);
    if (flits > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const f = ctx.createRadialGradient(wx - 50, wy - 120, 2, wx - 50, wy - 120, 60); f.addColorStop(0, 'rgba(255,255,200,1)'); f.addColorStop(1, 'rgba(255,180,0,0)'); ctx.fillStyle = f; ctx.beginPath(); ctx.arc(wx - 50, wy - 120, 60, 0, 7); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = '#3aa8ef'; ctx.beginPath(); ctx.moveTo(wx - 70, wy - 110); ctx.lineTo(wx - 30, wy - 120); ctx.lineTo(wx + 40, wy); ctx.lineTo(wx - 40, wy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d9eefc'; K.rr(wx - 80, wy - 130, 48, 26, 8); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.fillRect(wx - 60, wy - 126, 8, 18);
    ctx.restore();
    K.tekenDeeltjes();
    tekenMinikaart();
  }
  function tekenRobot(x, voet, gr, r) {
    const s = gr / 100, w = 46 * s, h = 70 * s, y = voet - h - Math.abs(Math.sin(t * 3 + r.fase)) * 3 * s;
    if (r.dood) { ctx.globalAlpha *= Math.max(0, r.weg / 0.8); }
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(x, voet, w * 0.7, 6 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#8a93a8'; ctx.fillRect(x - w * 0.35, y + h * 0.75, w * 0.2, h * 0.25); ctx.fillRect(x + w * 0.15, y + h * 0.75, w * 0.2, h * 0.25);
    const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#5b6378'); g.addColorStop(0.5, '#a8b2c8'); g.addColorStop(1, '#5b6378');
    ctx.fillStyle = g; K.rr(x - w / 2, y + h * 0.3, w, h * 0.48, 6 * s); ctx.fill();
    ctx.fillStyle = '#c8d0e0'; K.rr(x - w * 0.38, y, w * 0.76, h * 0.32, 8 * s); ctx.fill();
    ctx.fillStyle = '#ff3b5c'; ctx.fillRect(x - w * 0.28, y + h * 0.1, w * 0.56, h * 0.09);
    ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y - 6 * s, 4 * s, 0, 7); ctx.fill();
    if (r.tekst !== '?' && !r.dood && gr > 30) { ctx.save(); const f = klem(s * 1.1, 0.5, 1.8); ctx.translate(x, y - 34 * s - 10); ctx.scale(f, f); K.bordje(0, 0, r.tekst, { groot: 22, kleur: '#ffd23f' }); ctx.restore(); }
  }
  function tekenBug(x, y, gr) {
    const s = gr / 100; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(125,255,106,.25)'; ctx.beginPath(); ctx.arc(x, y, 24 * s, 0, 7); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#2f8f3a'; ctx.beginPath(); ctx.ellipse(x, y, 14 * s, 11 * s, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#7dff6a'; ctx.lineWidth = 2 * s; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + k * 10 * s, y); ctx.lineTo(x + k * 22 * s, y - 8 * s + Math.sin(t * 20) * 4 * s); ctx.stroke(); }
    ctx.fillStyle = '#ff3b5c'; ctx.beginPath(); ctx.arc(x - 4 * s, y - 2 * s, 2.5 * s, 0, 7); ctx.arc(x + 4 * s, y - 2 * s, 2.5 * s, 0, 7); ctx.fill();
  }
  function tekenPortaal(x, y, gr) {
    const s = gr / 100; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) { ctx.strokeStyle = `hsla(${(t * 120 + i * 50) % 360},90%,65%,.8)`; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.ellipse(x, y, (30 - i * 5) * s, (44 - i * 7) * s, t * (i % 2 ? 1 : -1), 0, 7); ctx.stroke(); }
    ctx.restore();
  }
  function tekenMinikaart() {
    const c = 6, ox = BW - W_ * c - 14, oy = BH - H_ * c - 14;
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(ox - 4, oy - 4, W_ * c + 8, H_ * c + 8);
    for (let y = 0; y < H_; y++) for (let x = 0; x < W_; x++) { const m = muur(x + 0.5, y + 0.5); if (m) { ctx.fillStyle = m === 'D' ? '#a25cff' : '#8a8aa0'; ctx.fillRect(ox + x * c, oy + y * c, c, c); } }
    robots.forEach(r => { if (!r.dood && r.hal === hal) { ctx.fillStyle = '#ffd23f'; ctx.fillRect(ox + r.x * c - 2, oy + r.y * c - 2, 4, 4); } });
    ctx.fillStyle = '#4dd2ff'; ctx.beginPath(); ctx.arc(ox + pi.x * c, oy + pi.y * c, 3, 0, 7); ctx.fill();
    ctx.strokeStyle = '#4dd2ff'; ctx.beginPath(); ctx.moveTo(ox + pi.x * c, oy + pi.y * c); ctx.lineTo(ox + (pi.x + Math.cos(pi.a) * 1.6) * c, oy + (pi.y + Math.sin(pi.a) * 1.6) * c); ctx.stroke();
  }
  return { start, update, teken, _staat: () => ({ pi, robots, bugs, deuren, hal }), _naarScherm: naarScherm };
})();
