// Finale — De ruimte: schiet de asteroïde met het juiste antwoord, ontwijk meteoren
// en kraak daarna het schild van het moederschip stap voor stap.
K.WERELDEN[5] = (() => {
  const { BW, BH, ctx, rand, klem } = K;
  let schip, kogels, rotsen, meteoren, vkogels, baas, sterren, t, fase, plan, stap, regenT, regenTot, vraag, harten;

  function start() {
    t = 0; kogels = []; rotsen = []; meteoren = []; vkogels = []; harten = []; baas = null;
    schip = { x: BW / 2, y: BH - 90, vx: 0, vy: 0, koel: 0 };
    sterren = Array.from({ length: 120 }, () => ({ x: rand(0, BW), y: rand(0, BH), v: rand(20, 140), r: rand(0.6, 2) }));
    plan = ['v', 'r', 'v', 'v', 'r', 'B']; stap = -1; volgende();
  }
  function volgende() {
    stap++; const s = plan[stap];
    if (s === 'v') { vraag = K.vraag(5); K.toonVraag(vraag, '🚀 Schiet de juiste asteroïde'); rotsen = vraag.opties.map((o, i) => maakRots(160 + i * 320 + rand(-60, 60), rand(90, 150), o)); }
    else if (s === 'r') { fase = 'regen'; regenTot = 7; regenT = 0; K.infoPaneel('☄️', 'Meteorenregen!', 'Ontwijk de meteoren of schiet ze kapot. Pak het <b>hartje</b> als het voorbijvliegt!'); harten.push({ x: rand(120, BW - 120), y: -30 }); }
    else if (s === 'B') startBaas();
    else K.wereldKlaar();
    if (s === 'v') fase = 'vraag';
  }
  function maakRots(x, y, o) {
    const pts = []; for (let i = 0; i < 11; i++) { const h = i / 11 * 6.283, d = 38 * rand(0.8, 1.08); pts.push([Math.cos(h) * d, Math.sin(h) * d]); }
    return { x, y, r: 38, o, vy: 18, fase: rand(0, 6), rot: 0, pts };
  }
  function startBaas() {
    fase = 'baas'; const opg = [K.baasVraag(), K.baasVraag()].filter(Boolean);
    const lagen = opg.reduce((s, o) => s + o.stappen.length, 0);
    baas = { x: BW / 2, y: -120, t: 0, opg, oi: 0, si: 0, lagen, over: lagen, vuur: 2.5, raak: 0, dood: 0, kernen: [] };
    K.popup(BW / 2, BH / 2, 'HET MOEDERSCHIP!', '#ff5d8f', 34); K.SFX.boem(); K.schud(0.5);
    baasStap();
  }
  function baasStap() {
    const o = baas.opg[baas.oi], st = o.stappen[baas.si];
    const gedaan = o.stappen.slice(0, baas.si).map(s => s.find(x => x.goed).t);
    K.toonVraag({ opdracht: `Moederschip · berekening ${baas.oi + 1}/${baas.opg.length} · kraak het schild stap voor stap`, v: { tex: o.tex + gedaan.map(s => ` = \\text{${s.replace(/[{}\\]/g, '')}}`).join('') + ' = \\;?' } }, `🎯 schiet de volgende stap<br><span style="opacity:.8">schild ${baas.over}/${baas.lagen}</span>`);
    baas.kernen = st.map((o, i) => ({ ...o, i, x: 0, y: 0, weg: 0 }));
  }
  function update(dt) {
    t += dt;
    const S = schip, v = 360;
    const dx = (K.rechts() ? 1 : 0) - (K.links() ? 1 : 0), dy = (K.neer() ? 1 : 0) - (K.op() ? 1 : 0);
    S.vx += (dx * v - S.vx) * Math.min(1, dt * 12); S.vy += (dy * v - S.vy) * Math.min(1, dt * 12);
    S.x = klem(S.x + S.vx * dt, 30, BW - 30); S.y = klem(S.y + S.vy * dt, BH * 0.45, BH - 40);
    S.koel -= dt;
    if (K.toets[' '] && S.koel <= 0) { S.koel = 0.22; kogels.push({ x: S.x, y: S.y - 30 }); K.SFX.schot(); }
    kogels.forEach(k => { k.y -= 700 * dt; }); kogels = kogels.filter(k => k.y > -20 && !k.weg);
    for (const s of sterren) { s.y += s.v * dt; if (s.y > BH) { s.y = 0; s.x = rand(0, BW); } }
    // antwoord-asteroïden
    for (const r of rotsen) {
      r.y += r.vy * dt; r.x += Math.sin(t + r.fase) * 20 * dt; r.rot += dt * 0.4;
      if (r.y > BH + 50) r.y = -40;
      for (const k of kogels) if (!k.weg && Math.hypot(k.x - r.x, k.y - r.y) < r.r) {
        k.weg = true; r.weg = true;
        if (r.o.goed) { K.goed(r.x, r.y, 150); K.explosie(r.x, r.y, '#4dff9a', 40, 280, 4); rotsen.forEach(x => { x.weg = true; }); setTimeout(volgende, 600); }
        else { K.fout(r.x, r.y); K.explosie(r.x, r.y, '#ff6b6b', 30, 240, 3); }
        break;
      }
    }
    rotsen = rotsen.filter(r => !r.weg);
    // meteorenregen
    if (fase === 'regen') {
      regenTot -= dt; regenT -= dt;
      if (regenT <= 0 && regenTot > 1) { regenT = rand(0.35, 0.6); meteoren.push({ x: rand(20, BW - 20), y: -30, r: rand(14, 28), vy: rand(150, 230), vx: rand(-40, 40) }); }
      if (regenTot <= 0) { fase = 'x'; K.popup(BW / 2, BH / 2, 'OVERLEEFD!', '#4dff9a', 30); setTimeout(volgende, 800); }
    }
    for (const m of meteoren) {
      m.y += m.vy * dt; m.x += m.vx * dt;
      for (const k of kogels) if (!k.weg && Math.hypot(k.x - m.x, k.y - m.y) < m.r + 4) { k.weg = true; m.weg = true; K.explosie(m.x, m.y, '#ffb36b', 16, 160); K.S.score += 10; }
      if (!m.weg && Math.hypot(S.x - m.x, S.y - m.y) < m.r + 16) { m.weg = true; K.raak(S.x, S.y); K.explosie(m.x, m.y, '#ffb36b', 16, 160); }
    }
    meteoren = meteoren.filter(m => !m.weg && m.y < BH + 40);
    for (const h of harten) { h.y += 90 * dt; if (!h.weg && Math.hypot(S.x - h.x, S.y - h.y) < 32) { h.weg = true; K.extraLeven(h.x, h.y); } }
    harten = harten.filter(h => !h.weg && h.y < BH + 30);
    // moederschip
    if (baas) {
      const B = baas; B.t += dt; B.raak = Math.max(0, B.raak - dt);
      B.y += (130 - B.y) * Math.min(1, dt * 1.5); B.x = BW / 2 + Math.sin(B.t * 0.45) * (BW / 2 - 300);
      B.kernen.forEach((k, i) => { const h = B.t * 0.8 + i / 3 * 6.283; k.x = klem(B.x + Math.cos(h) * 190, 90, BW - 90); k.y = B.y + 125 + Math.sin(h) * 40; if (k.weg) k.weg -= dt; });
      if (B.dood) {
        B.dood -= dt; if (Math.random() < 0.5) K.explosie(B.x + rand(-130, 130), B.y + rand(-40, 40), K.kies(['#ff5d8f', '#ffd23f', '#5bc8ff']), 14, 200);
        if (B.dood <= 0) { K.explosie(B.x, B.y, '#fff', 120, 500, 5); K.SFX.boem(); K.S.score += 1000; K.popup(B.x, B.y, 'GEWONNEN! +1000', '#ffd23f', 34); baas = null; setTimeout(() => K.wereldKlaar(), 1500); }
      } else {
        B.vuur -= dt;
        if (B.vuur <= 0 && B.y > 60) { B.vuur = rand(1.5, 2.2); const h = Math.atan2(S.y - B.y - 40, S.x - B.x); vkogels.push({ x: B.x, y: B.y + 40, vx: Math.cos(h) * 190, vy: Math.sin(h) * 190 }); }
        for (const k of kogels) {
          if (k.weg) continue;
          const kern = B.kernen.find(q => !q.weg && Math.hypot(k.x - q.x, k.y - q.y) < 32);
          if (kern) { k.weg = true; raakKern(kern); break; }
          if (Math.abs(k.x - B.x) < 150 && Math.abs(k.y - B.y) < 50) { k.weg = true; K.explosie(k.x, k.y, '#7ff6ff', 5, 80, 1.5); }
        }
      }
    }
    for (const k of vkogels) { k.x += k.vx * dt; k.y += k.vy * dt; if (Math.hypot(k.x - S.x, k.y - S.y) < 16) { k.weg = true; K.raak(S.x, S.y); } }
    vkogels = vkogels.filter(k => !k.weg && k.y < BH + 20 && k.y > -40);
  }
  function raakKern(k) {
    const B = baas;
    if (!k.goed) { k.weg = 0.4; K.fout(k.x, k.y); return; }
    B.kernen.forEach(q => { q.weg = 0.4; }); B.over--; B.raak = 0.5; K.schud(0.3); K.goed(k.x, k.y, 200); K.explosie(B.x, B.y + 20, '#ff5d8f', 50, 320, 4);
    B.si++; if (B.si >= B.opg[B.oi].stappen.length) { B.oi++; B.si = 0; }
    if (B.oi >= B.opg.length) { B.dood = 2.2; B.kernen = []; return; }
    setTimeout(() => { if (baas && !baas.dood) baasStap(); }, 500);
  }

  function teken() {
    ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, BW, BH);
    const g = ctx.createRadialGradient(BW * 0.7, BH * 0.3, 10, BW * 0.7, BH * 0.3, 420); g.addColorStop(0, 'rgba(120,60,200,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, BW, BH);
    for (const s of sterren) { ctx.fillStyle = `rgba(220,235,255,${0.4 + s.r / 3})`; ctx.fillRect(s.x, s.y, s.r, s.r + s.v / 60); }
    for (const r of rotsen) {
      ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot); ctx.fillStyle = '#3a3f5c'; ctx.strokeStyle = '#7f8fd6'; ctx.lineWidth = 2;
      ctx.beginPath(); r.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      K.bordje(r.x, r.y, r.o.t, { kleur: '#5bc8ff', groot: 22 });
    }
    for (const m of meteoren) { ctx.fillStyle = '#7a4a2a'; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,140,60,.35)'; ctx.beginPath(); ctx.moveTo(m.x - m.r * 0.7, m.y); ctx.lineTo(m.x + m.r * 0.7, m.y); ctx.lineTo(m.x, m.y - m.r * 3); ctx.fill(); ctx.restore(); }
    for (const h of harten) K.tekenHart(h.x, h.y, 1.6);
    if (baas) tekenBaas();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const k of kogels) { ctx.fillStyle = '#7ff6ff'; ctx.fillRect(k.x - 2, k.y, 4, 18); }
    for (const k of vkogels) { ctx.fillStyle = '#ff5d8f'; ctx.beginPath(); ctx.arc(k.x, k.y, 7, 0, 7); ctx.fill(); }
    ctx.restore();
    if (!(K.onkwetsbaar > 0 && Math.floor(t * 12) % 2)) tekenSchip(schip.x, schip.y);
    K.tekenDeeltjes();
  }
  function tekenSchip(x, y) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(klem(schip.vx / 2500, -0.2, 0.2));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fl = 20 + Math.sin(t * 40) * 5; ctx.fillStyle = 'rgba(120,220,255,.8)'; ctx.beginPath(); ctx.moveTo(-8, 18); ctx.lineTo(8, 18); ctx.lineTo(0, 18 + fl); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#e9f6ff'; ctx.strokeStyle = '#3a6fd6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(12, -4); ctx.lineTo(30, 14); ctx.lineTo(10, 18); ctx.lineTo(-10, 18); ctx.lineTo(-30, 14); ctx.lineTo(-12, -4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5d8f'; ctx.fillRect(-28, 10, 8, 6); ctx.fillRect(20, 10, 8, 6);
    ctx.restore();
    K.tekenPi(x, y + 2, 0.42, 1, 0);
  }
  function tekenBaas() {
    const B = baas; ctx.save(); ctx.translate(B.x, B.y);
    for (let i = 0; i < B.over; i++) { ctx.strokeStyle = `rgba(255,93,143,${0.2 + 0.1 * Math.sin(t * 3 + i)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 175 + i * 7, 70 + i * 4, 0, 0, 7); ctx.stroke(); }
    const g = ctx.createLinearGradient(0, -60, 0, 60); g.addColorStop(0, '#5a1030'); g.addColorStop(1, '#1b0510');
    ctx.fillStyle = g; ctx.strokeStyle = B.raak > 0 ? '#fff' : '#ff5d8f'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-160, 0); ctx.lineTo(-110, -40); ctx.lineTo(-40, -55); ctx.lineTo(40, -55); ctx.lineTo(110, -40); ctx.lineTo(160, 0); ctx.lineTo(120, 30); ctx.lineTo(60, 52); ctx.lineTo(-60, 52); ctx.lineTo(-120, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3b3f4f'; K.rr(-22, -44, 44, 40, 8); ctx.fill(); ctx.fillStyle = '#ff2d55'; ctx.fillRect(-16, -32, 32, 10);
    ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(-22, -44); ctx.lineTo(-14, -58); ctx.lineTo(0, -48); ctx.lineTo(14, -58); ctx.lineTo(22, -44); ctx.fill();
    K.rr(-120, -78, 240, 10, 5); ctx.fillStyle = '#2a0a1a'; ctx.fill(); K.rr(-120, -78, 240 * B.over / B.lagen, 10, 5); ctx.fillStyle = '#ff5d8f'; ctx.fill();
    ctx.restore();
    for (const k of B.kernen) { if (k.weg < 0) continue; ctx.globalAlpha = k.weg > 0 ? Math.max(0, k.weg / 0.4) : 1; K.bordje(k.x, k.y, k.t, { kleur: '#ffd23f', groot: 19 }); ctx.globalAlpha = 1; }
  }
  return { start, update, teken, _staat: () => ({ rotsen, baas, fase, schip, stap }) };
})();
