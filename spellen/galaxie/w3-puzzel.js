// Wereld ℚ — Het Breukenkasteel: duwpuzzel. Duw het blok met het juiste antwoord op het gouden slot.
K.WERELDEN[3] = (() => {
  const { BW, BH, ctx } = K;
  const TS = 56, KAMERS = [
    ['#############',
     '#...........#',
     '#..A.....c..#',
     '#...........#',
     '#.P..B...S..D',
     '#...........#',
     '#..C.....h..#',
     '#...........#',
     '#############'],
    ['#############',
     '#.....#.....#',
     '#..A..#..c..#',
     '#...........#',
     '#P..B.....S.D',
     '#...........#',
     '#..C..#.....#',
     '#.....#..c..#',
     '#############'],
    ['#############',
     '#c.........c#',
     '#.##.....##.#',
     '#..A..B..C..#',
     '#.....P.....#',
     '#...........#',
     '#.##..S..##.#',
     '#.....h.....D',
     '#############'],
    ['#############',
     '#c....#....c#',
     '#...........#',
     '#.A...B...C.#',
     '#....#.#....#',
     '#.....S.....#',
     '#..#.....#..#',
     '#.....P.....D',
     '#############'],
  ];
  const OX = (BW - 13 * TS) / 2, OY = 70;
  let k, kamer, muren, slot, deur, pi, blokken, items, q, t, open, overgang, fakkels;

  function laad(n) {
    k = n; const K0 = KAMERS[n]; muren = new Set(); blokken = []; items = []; open = false;
    const plekken = {};
    K0.forEach((rij, y) => [...rij].forEach((ch, x) => {
      if (ch === '#') muren.add(x + ',' + y);
      if (ch === 'S') slot = { x, y };
      if (ch === 'D') deur = { x, y };
      if (ch === 'P') pi = { x, y, px: x, py: y, t: 0, kijk: 1, stap: 0 };
      if ('ABC'.includes(ch)) plekken[ch] = { x, y };
      if (ch === 'c' || ch === 'h') items.push({ x, y, soort: ch });
    }));
    q = K.vraag(3);
    ['A', 'B', 'C'].forEach((l, i) => blokken.push({ x: plekken[l].x, y: plekken[l].y, sx: plekken[l].x, sy: plekken[l].y, px: plekken[l].x, py: plekken[l].y, t: 0, tekst: q.opties[i].t, goed: q.opties[i].goed }));
    K.toonVraag(q, `🧩 Kamer ${n + 1}/4 · duw het juiste blok op het gouden slot<br><span style="opacity:.8">vast? druk <b>R</b></span>`);
    fakkels = [[3, 0], [9, 0], [0, 2], [12, 6]];
  }
  function herstart() {
    blokken.forEach(b => { if (!b.weg && !b.klaar) { b.x = b.sx; b.y = b.sy; b.px = b.x; b.py = b.y; b.t = 0; } });
    const P = KAMERS[k].findIndex(r => r.includes('P')); pi.x = KAMERS[k][P].indexOf('P'); pi.y = P; pi.px = pi.x; pi.py = pi.y; pi.t = 0;
    K.SFX.plof();
  }
  const vrij = (x, y) => x >= 0 && x <= 12 && y >= 0 && y <= 8 && !muren.has(x + ',' + y) && !(deur && x === deur.x && y === deur.y && !open) && !blokken.some(b => !b.weg && b.x === x && b.y === y);
  function start() { t = 0; overgang = 0; laad(0); }

  function update(dt) {
    t += dt;
    if (overgang > 0) { overgang -= dt; if (overgang <= 0) { if (k + 1 >= KAMERS.length) K.wereldKlaar(); else laad(k + 1); } return; }
    if (K.gedrukt('r')) herstart();
    if (open && pi.x === deur.x && pi.y === deur.y) { if (pi.t === 0 && overgang <= 0) { overgang = 0.6; K.SFX.deur(); } pi.t = Math.max(0, pi.t - dt / 0.14); return; }
    pi.t = Math.max(0, pi.t - dt / 0.14); blokken.forEach(b => { b.t = Math.max(0, b.t - dt / 0.14); });
    if (pi.t === 0) {
      let dx = 0, dy = 0;
      if (K.links()) dx = -1; else if (K.rechts()) dx = 1; else if (K.op()) dy = -1; else if (K.neer()) dy = 1;
      if (dx || dy) {
        if (dx) pi.kijk = dx;
        const nx = pi.x + dx, ny = pi.y + dy, b = blokken.find(b => !b.weg && b.x === nx && b.y === ny);
        if (b) {
          if (!b.klaar && vrij(nx + dx, ny + dy) && !(deur && nx + dx === deur.x && ny + dy === deur.y)) { b.px = b.x; b.py = b.y; b.x += dx; b.y += dy; b.t = 1; zet(nx, ny); K.SFX.duw(); if (b.x === slot.x && b.y === slot.y) opSlot(b); }
        } else if (vrij(nx, ny)) zet(nx, ny);
      }
    }
    for (const it of items) if (!it.weg && it.x === pi.x && it.y === pi.y) { it.weg = true; const sx = OX + it.x * TS + TS / 2, sy = OY + it.y * TS + TS / 2; if (it.soort === 'c') K.munt(sx, sy); else K.extraLeven(sx, sy); K.explosie(sx, sy, it.soort === 'c' ? '#ffd23f' : '#ff7aa2', 14, 120); }
  }
  function zet(x, y) { pi.px = pi.x; pi.py = pi.y; pi.x = x; pi.y = y; pi.t = 1; pi.stap += 1.6; }
  function opSlot(b) {
    const sx = OX + b.x * TS + TS / 2, sy = OY + b.y * TS + TS / 2;
    if (b.goed) { b.klaar = true; open = true; K.goed(sx, sy, 150); K.SFX.deur(); K.infoPaneel('🏰', 'Wereld ℚ — Het Breukenkasteel', `Juist! De deur is open — loop naar de uitgang ${k + 1 < KAMERS.length ? '(kamer ' + (k + 2) + '/4)' : ''} ➜`); }
    else { b.weg = true; K.fout(sx, sy); K.explosie(sx, sy, '#b98a5a', 30, 220, 4); }
  }

  // ------------------------------------------------------------ tekenen
  const lerp = (a, b, f) => a + (b - a) * f;
  function teken() {
    ctx.fillStyle = '#1b1530'; ctx.fillRect(0, 0, BW, BH);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 13; x++) {
      const X = OX + x * TS, Y = OY + y * TS;
      if (muren.has(x + ',' + y)) continue;
      ctx.fillStyle = (x + y) % 2 ? '#5a4e7a' : '#64588a'; ctx.fillRect(X, Y, TS, TS);
      ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.strokeRect(X + 0.5, Y + 0.5, TS - 1, TS - 1);
    }
    // slot
    const SX = OX + slot.x * TS + TS / 2, SY = OY + slot.y * TS + TS / 2, gl = 0.6 + 0.4 * Math.sin(t * 4);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,200,60,${0.25 * gl})`; ctx.beginPath(); ctx.arc(SX, SY, 34, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 4; ctx.setLineDash([8, 6]); ctx.strokeRect(SX - 24, SY - 24, 48, 48); ctx.setLineDash([]);
    ctx.fillStyle = '#ffd23f'; ctx.font = '900 22px "Lilita One"'; ctx.textAlign = 'center'; ctx.fillText('🔑', SX, SY + 8);
    // muren (met voorkant voor wat diepte)
    for (let y = 0; y < 9; y++) for (let x = 0; x < 13; x++) {
      if (!muren.has(x + ',' + y)) continue;
      const X = OX + x * TS, Y = OY + y * TS;
      ctx.fillStyle = '#2c2447'; ctx.fillRect(X, Y, TS, TS);
      ctx.fillStyle = '#3d3363'; ctx.fillRect(X, Y, TS, TS - 12);
      ctx.strokeStyle = '#241d3b'; ctx.lineWidth = 2;
      for (let r = 0; r < 3; r++) { ctx.beginPath(); ctx.moveTo(X, Y + r * 15 + 15); ctx.lineTo(X + TS, Y + r * 15 + 15); ctx.stroke(); const o = r % 2 ? TS / 2 : TS / 4; ctx.beginPath(); ctx.moveTo(X + o, Y + r * 15); ctx.lineTo(X + o, Y + r * 15 + 15); ctx.stroke(); }
    }
    for (const [fx, fy] of fakkels) { if (!muren.has(fx + ',' + fy)) continue; const X = OX + fx * TS + TS / 2, Y = OY + fy * TS + 18, f = Math.sin(t * 20 + fx) * 2;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(X, Y, 2, X, Y, 70); g.addColorStop(0, 'rgba(255,170,60,.5)'); g.addColorStop(1, 'rgba(255,120,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, 70, 0, 7); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.ellipse(X, Y - 4 + f * 0.3, 6, 10 + f, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#7a4a1a'; ctx.fillRect(X - 3, Y + 4, 6, 12); }
    // deur
    const DX = OX + deur.x * TS, DY = OY + deur.y * TS;
    ctx.fillStyle = open ? '#0d0a18' : '#6b3e1f'; ctx.fillRect(DX + 4, DY + 2, TS - 8, TS - 4);
    if (!open) { ctx.strokeStyle = '#3a200f'; ctx.lineWidth = 3; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(DX + 4 + i * 12, DY + 2); ctx.lineTo(DX + 4 + i * 12, DY + TS - 2); ctx.stroke(); } ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(DX + TS / 2, DY + TS / 2, 5, 0, 7); ctx.fill(); }
    else { ctx.fillStyle = '#4dff9a'; ctx.font = '900 26px "Lilita One"'; ctx.textAlign = 'center'; ctx.fillText('➜', DX + TS / 2, DY + TS / 2 + 9); }
    // items
    for (const it of items) if (!it.weg) { const X = OX + it.x * TS + TS / 2, Y = OY + it.y * TS + TS / 2 + Math.sin(t * 3 + it.x) * 3; if (it.soort === 'c') K.tekenMunt(X, Y, t + it.x, 12); else K.tekenHart(X, Y, 1.5); }
    // blokken (kisten met een antwoord)
    for (const b of blokken) {
      if (b.weg) continue;
      const f = 1 - b.t, X = OX + lerp(b.px, b.x, f) * TS, Y = OY + lerp(b.py, b.y, f) * TS;
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(X + 6, Y + 10, TS - 6, TS - 6);
      ctx.fillStyle = b.klaar ? '#2f9d63' : '#b98a5a'; K.rr(X + 3, Y + 3, TS - 6, TS - 6, 6); ctx.fill();
      ctx.strokeStyle = b.klaar ? '#1c6b40' : '#7a5530'; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X + 6, Y + 6); ctx.lineTo(X + TS - 6, Y + TS - 6); ctx.moveTo(X + TS - 6, Y + 6); ctx.lineTo(X + 6, Y + TS - 6); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.stroke();
      K.bordje(X + TS / 2, Y + TS / 2, b.tekst, { groot: 18, kleur: b.klaar ? '#4dff9a' : '#ffd23f', minB: 40 });
    }
    // Pi
    const f = 1 - pi.t, PX = OX + lerp(pi.px, pi.x, f) * TS + TS / 2, PY = OY + lerp(pi.py, pi.y, f) * TS + TS / 2;
    K.tekenPi(PX, PY + 4, 0.8, pi.kijk, pi.t > 0 ? pi.stap + f * 3 : 0);
    if (overgang > 0) { ctx.fillStyle = `rgba(0,0,0,${1 - overgang / 0.6})`; ctx.fillRect(0, 0, BW, BH); }
    K.tekenDeeltjes();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '700 14px "Atkinson Hyperlegible", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`Kamer ${k + 1} van ${KAMERS.length} · pijltjes: lopen en duwen · R: kamer herstarten`, BW / 2, BH - 8);
  }
  return { start, update, teken, _staat: () => ({ pi, blokken, slot, deur, open, k }) };
})();
