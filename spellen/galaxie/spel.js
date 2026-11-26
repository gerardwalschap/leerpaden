// =====================================================================
//  GALAXIE ℝ — ruimteshooter door de getallenleer (7VJHO)
//  Vragen: spellen/galaxie/vragen.js (rechtstreeks uit de leerpaden).
//  Toestand: localStorage 'galaxie-v1' (via spel-volg.js per leerling in de databank).
// =====================================================================
(() => {
  const BW = 960, BH = 600;
  const doek = document.getElementById('doek'), ctx = doek.getContext('2d');
  const laag = document.getElementById('laag'), hud = document.getElementById('hud'), paneel = document.getElementById('paneel');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  doek.width = BW * DPR; doek.height = BH * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const esc = W.esc, T = (s) => W.tex(s);
  const rand = (a, b) => a + Math.random() * (b - a), kies = W.kies, schud = W.schud;
  const klem = (x, a, b) => Math.max(a, Math.min(b, x));

  // ------------------------------------------------------------------ toestand
  const KEY = 'galaxie-v1';
  const nieuw = () => ({ naam: '', modus: 'normaal', kristallen: 0, upg: { schild: 0, vuur: 0, snel: 0, magneet: 0 }, vg: { normaal: {}, plus: {} }, best: 0, runs: 0, overwinningen: 0, geluid: false });
  let S = nieuw();
  try { const r = localStorage.getItem(KEY); if (r) S = Object.assign(nieuw(), JSON.parse(r)); } catch (e) { /* nieuw */ }
  S.upg = Object.assign({ schild: 0, vuur: 0, snel: 0, magneet: 0 }, S.upg); S.vg = Object.assign({ normaal: {}, plus: {} }, S.vg);
  const bewaar = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* niets */ } };

  const UPG = {
    schild: { naam: 'Schildgenerator', icoon: '🛡️', uitleg: 'Meer schildpunten bij de start van een sector.', prijs: [40, 90, 160] },
    vuur: { naam: 'Lasercanon', icoon: '🔫', uitleg: 'Sneller na elkaar schieten.', prijs: [30, 70, 130] },
    snel: { naam: 'Ionenmotor', icoon: '🚀', uitleg: 'Je schip vliegt sneller.', prijs: [30, 70, 130] },
    magneet: { naam: 'Kristalmagneet', icoon: '🧲', uitleg: 'Trekt kristallen van ver naar je toe.', prijs: [50, 120] },
  };
  const maxSchild = () => 5 + S.upg.schild, vuurTijd = () => 0.26 - 0.05 * S.upg.vuur, snelheid = () => 330 + 55 * S.upg.snel, magneet = () => [0, 130, 230][S.upg.magneet];

  // ------------------------------------------------------------------ geluid (WebAudio, standaard uit)
  let AC = null;
  function toon(f, duur = 0.1, type = 'square', vol = 0.05, naar = null, start = 0) {
    if (!S.geluid) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t = AC.currentTime + start, o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); if (naar) o.frequency.exponentialRampToValueAtTime(naar, t + duur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + duur);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + duur + 0.02);
    } catch (e) { /* geen geluid */ }
  }
  function ruis(duur = 0.3, vol = 0.08) {
    if (!S.geluid) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const n = AC.sampleRate * duur, buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
      const s = AC.createBufferSource(), g = AC.createGain(); s.buffer = buf; g.gain.value = vol; s.connect(g); g.connect(AC.destination); s.start();
    } catch (e) { /* geen geluid */ }
  }
  const SFX = {
    schot: () => toon(880, 0.06, 'square', 0.02, 440),
    goed: () => { toon(660, 0.09, 'triangle', 0.06); toon(990, 0.14, 'triangle', 0.06, null, 0.08); toon(1320, 0.2, 'triangle', 0.05, null, 0.16); },
    fout: () => { toon(200, 0.25, 'sawtooth', 0.06, 90); ruis(0.2, 0.05); },
    boem: () => { ruis(0.35, 0.07); toon(120, 0.3, 'sine', 0.08, 40); },
    klein: () => ruis(0.12, 0.03),
    kristal: () => toon(1500 + Math.random() * 400, 0.05, 'sine', 0.025),
    power: () => { toon(500, 0.1, 'triangle', 0.05, 1000); toon(1000, 0.15, 'triangle', 0.05, 1600, 0.1); },
    baas: () => { ruis(0.6, 0.1); toon(80, 0.7, 'sawtooth', 0.07, 30); },
  };

  // ------------------------------------------------------------------ invoer
  const toets = {};
  const SPELTOETS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar'];
  addEventListener('keydown', (e) => {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (G && G.actief && SPELTOETS.includes(e.key)) e.preventDefault();
    toets[k] = true;
    if (k === 'p' || k === 'Escape') { if (G && G.actief && !G.pauze) pauzeer(); else if (G && G.pauze && G.pauzeScherm) hervat(); }
    if (k === 'm') { S.geluid = !S.geluid; bewaar(); melding(S.geluid ? '🔊 geluid aan' : '🔇 geluid uit'); }
    if ((k === 'Enter' || k === ' ') && verderActie) { e.preventDefault(); const f = verderActie; verderActie = null; f(); }
  });
  addEventListener('keyup', (e) => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; toets[k] = false; });
  addEventListener('blur', () => { for (const k in toets) toets[k] = false; if (G && G.actief && !G.pauze) pauzeer(); });
  let verderActie = null; // Enter/spatie op een tussenscherm

  // ------------------------------------------------------------------ achtergrond: sterren in lagen + nevels
  const sterren = [0, 1, 2].map(l => Array.from({ length: [90, 50, 22][l] }, () => ({ x: Math.random() * BW, y: Math.random() * BH, r: [0.7, 1.2, 1.9][l], v: [12, 28, 60][l], f: Math.random() * 6 })));
  const nevel = document.createElement('canvas'); nevel.width = BW; nevel.height = BH * 2;
  (function tekenNevel() {
    const n = nevel.getContext('2d');
    for (let i = 0; i < 9; i++) {
      const x = rand(0, BW), y = rand(0, BH * 2), r = rand(160, 340), kl = kies(['56,225,255', '180,140,255', '255,79,163', '60,90,255']);
      const g = n.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${kl},.13)`); g.addColorStop(1, 'rgba(0,0,0,0)');
      n.fillStyle = g; n.fillRect(0, 0, BW, BH * 2);
    }
  })();
  let nevelY = 0, warp = 0;
  function tekenAchtergrond(dt) {
    ctx.fillStyle = '#03040b'; ctx.fillRect(0, 0, BW, BH);
    nevelY = (nevelY + dt * 8 * (1 + warp * 6)) % (BH * 2);
    ctx.drawImage(nevel, 0, nevelY - BH * 2); ctx.drawImage(nevel, 0, nevelY);
    for (const laagS of sterren) for (const s of laagS) {
      s.y += s.v * dt * (1 + warp * 14); if (s.y > BH) { s.y -= BH; s.x = Math.random() * BW; }
      s.f += dt * 3; const a = 0.55 + 0.45 * Math.sin(s.f);
      ctx.fillStyle = `rgba(220,235,255,${a})`;
      if (warp > 0.05) { ctx.fillRect(s.x, s.y, s.r, s.r + warp * s.v * 0.5); } else { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); }
    }
  }

  // ------------------------------------------------------------------ deeltjes en tekstjes
  let deeltjes = [], popups = [];
  function explosie(x, y, kleur, n = 26, kracht = 220, groot = 3) {
    for (let i = 0; i < n; i++) { const h = rand(0, Math.PI * 2), v = rand(0.2, 1) * kracht; deeltjes.push({ x, y, vx: Math.cos(h) * v, vy: Math.sin(h) * v, t: rand(0.4, 0.9), t0: 0.9, r: rand(1, groot), k: kleur }); }
    deeltjes.push({ x, y, vx: 0, vy: 0, t: 0.35, t0: 0.35, r: 0, k: kleur, ring: true, R: kracht * 0.35 });
  }
  const popup = (x, y, tekst, kleur = '#fff', groot = 22) => popups.push({ x, y, tekst, kleur, t: 1.1, groot });
  function updDeeltjes(dt) {
    for (const p of deeltjes) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; p.t -= dt; }
    deeltjes = deeltjes.filter(p => p.t > 0);
    for (const p of popups) { p.y -= 40 * dt; p.t -= dt; }
    popups = popups.filter(p => p.t > 0);
  }
  function tekenDeeltjes() {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of deeltjes) {
      const a = Math.max(0, p.t / p.t0);
      if (p.ring) { ctx.strokeStyle = p.k; ctx.globalAlpha = a; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, p.R * (1 - a) + 6, 0, 7); ctx.stroke(); continue; }
      ctx.globalAlpha = a; ctx.fillStyle = p.k; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.5 + a), 0, 7); ctx.fill();
    }
    ctx.restore(); ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    for (const p of popups) {
      ctx.globalAlpha = Math.min(1, p.t * 2); ctx.font = `900 ${p.groot}px Orbitron, sans-serif`;
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.strokeText(p.tekst, p.x, p.y); ctx.fillStyle = p.kleur; ctx.fillText(p.tekst, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }

  // ------------------------------------------------------------------ tekenfuncties
  function rondeRechthoek(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function plaatje(x, y, tekst, kleur = '#38e1ff', groot = 20) {
    ctx.font = `700 ${groot}px "Atkinson Hyperlegible", "Segoe UI", sans-serif`;
    const w = Math.max(44, ctx.measureText(tekst).width + 20), h = groot + 14;
    rondeRechthoek(x - w / 2, y - h / 2, w, h, 9);
    ctx.fillStyle = 'rgba(4,8,24,.88)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = kleur; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tekst, x, y + 1); ctx.textBaseline = 'alphabetic';
    return w;
  }
  function vormRots(r) { const n = 11, pts = []; for (let i = 0; i < n; i++) { const h = i / n * Math.PI * 2, d = r * rand(0.78, 1.08); pts.push([Math.cos(h) * d, Math.sin(h) * d]); } return pts; }
  function tekenRots(o, kleurRand = '#5b6ea8', vulling = ['#3a3f5c', '#151827']) {
    ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot);
    const g = ctx.createRadialGradient(-o.r * 0.3, -o.r * 0.3, o.r * 0.1, 0, 0, o.r * 1.1); g.addColorStop(0, vulling[0]); g.addColorStop(1, vulling[1]);
    ctx.beginPath(); o.vorm.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = kleurRand; ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; for (const [cx, cy, cr] of o.kraters) { ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  function tekenSchip(s, tijd) {
    const flits = s.inv > 0 && Math.floor(tijd * 14) % 2 === 0;
    if (flits) return;
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(klem(s.vx / 2200, -0.25, 0.25));
    // motorvlam
    ctx.globalCompositeOperation = 'lighter';
    const fl = 22 + Math.sin(tijd * 40) * 5 + (s.vy < 0 ? 10 : 0);
    for (const dx of [-9, 9]) {
      const g = ctx.createLinearGradient(0, 12, 0, 12 + fl); g.addColorStop(0, 'rgba(255,240,180,.95)'); g.addColorStop(0.4, 'rgba(56,225,255,.8)'); g.addColorStop(1, 'rgba(56,225,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(dx - 5, 12); ctx.lineTo(dx + 5, 12); ctx.lineTo(dx, 12 + fl); ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    // romp
    const g = ctx.createLinearGradient(-24, 0, 24, 0); g.addColorStop(0, '#5b6bd6'); g.addColorStop(0.5, '#e8f4ff'); g.addColorStop(1, '#5b6bd6');
    ctx.fillStyle = g; ctx.strokeStyle = '#9ff8ff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(9, -6); ctx.lineTo(26, 10); ctx.lineTo(22, 16); ctx.lineTo(8, 12); ctx.lineTo(0, 16); ctx.lineTo(-8, 12); ctx.lineTo(-22, 16); ctx.lineTo(-26, 10); ctx.lineTo(-9, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff4fa3'; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(-22, 16); ctx.lineTo(-17, 13); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(26, 10); ctx.lineTo(22, 16); ctx.lineTo(17, 13); ctx.closePath(); ctx.fill();
    const kg = ctx.createLinearGradient(0, -20, 0, 0); kg.addColorStop(0, '#7ff6ff'); kg.addColorStop(1, '#1b3a8a');
    ctx.fillStyle = kg; ctx.beginPath(); ctx.ellipse(0, -8, 4.5, 10, 0, 0, 7); ctx.fill();
    if (G && G.pu.schild > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(61,255,160,${0.5 + 0.3 * Math.sin(tijd * 8)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 38, 0, 7); ctx.stroke(); }
    ctx.restore();
  }

  // ------------------------------------------------------------------ spelronde
  let G = null;
  const SECTOR_PLAN = { gewoon: ['v', 'v', 'r', 'v', 'v', 'r', 'v', 'v'], baas: ['v', 'v', 'r', 'v', 'v', 'B'] };

  function startSector(stelsel, nr) {
    const P = Vragen.leerpad(stelsel, S.modus); if (!P) return;
    const deel = P.delen[nr - 1], baas = nr === P.delen.length;
    S.runs++; bewaar();
    G = {
      stelsel, P, nr, deel, baas, plan: SECTOR_PLAN[baas ? 'baas' : 'gewoon'].slice(), stap: -1, actief: true, pauze: false, tijd: 0,
      schip: { x: BW / 2, y: BH - 80, vx: 0, vy: 0, inv: 0, koel: 0 }, schild: maxSchild(), kogels: [], rotsen: [], meteoren: [], kristallen: [], capsules: [], vijandKogels: [],
      poort: null, eindbaas: null, uitdaging: null, wachtrij: [], opg: null, fouten: 0, foutOpg: 0, combo: 0, maxCombo: 0, score: 0, kristal: 0,
      pu: { dubbel: 0, traag: 0, schild: 0 }, schud: 0, regen: 0, regenT: 0, intro: 2.4, juist: 0, vragen: SECTOR_PLAN[baas ? 'baas' : 'gewoon'].filter(x => x === 'v').length,
    };
    deeltjes = []; popups = []; warp = 1;
    laag.innerHTML = ''; hud.hidden = false; paneel.hidden = false;
    zetPaneel('🛰️', 'Sector ' + nr, `<b>${esc(deel.titel)}</b>`, deel.rekenmachine ? '' : 'zonder rekentoestel');
    SFX.power();
  }
  function volgendeStap() {
    G.stap++;
    if (G.stap >= G.plan.length) return sectorKlaar();
    const s = G.plan[G.stap];
    if (s === 'v') startVraag();
    else if (s === 'r') startRegen();
    else if (s === 'B') startBaas();
  }
  // -- vraag uit het leerpad (in de baassector: uit de eindtest = alles door elkaar)
  function startVraag() {
    const o = Vragen.opgave(G.deel); if (!o) return volgendeStap();
    G.opg = o; G.foutOpg = 0; G.wachtrij = o.uitdagingen.slice(); volgendeUitdaging();
  }
  function volgendeUitdaging() {
    const u = G.wachtrij.shift(); G.uitdaging = u; G.rotsen = []; G.poort = null;
    if (!u) return vraagKlaar();
    const nVraag = G.plan.slice(0, G.stap + 1).filter(x => x === 'v').length;
    const doel = u.type === 'poort' ? '🚪 vlieg door de juiste poort' : u.type === 'set' ? `🎯 schiet ALLE oplossingen (nog ${u.leden.length})` : '🎯 schiet het juiste antwoord';
    zetPaneel(u.type === 'poort' ? '🚪' : '☄️', G.opg.opdracht, W.opgave(G.opg.v) + (u.label ? `<div class="p-opdracht" style="margin-top:4px">${esc(u.label)}</div>` : ''), `${doel}<br><span style="color:#8f9cc8">vraag ${nVraag}/${G.vragen}</span>`);
    const tempo = 24 + G.nr * 3 + (S.modus === 'plus' ? 4 : 0);
    if (u.type === 'ast') {
      const labels = schud([{ t: u.juist, goed: true }, ...u.fout.map(t => ({ t, goed: false }))]);
      const n = labels.length, vak = (BW - 120) / n;
      labels.forEach((l, i) => G.rotsen.push(maakRots(60 + vak * (i + 0.5) + rand(-vak * 0.2, vak * 0.2), rand(60, 150), l.t, l.goed, tempo)));
    } else if (u.type === 'set') {
      const lo = Math.max(0, Math.min(...u.leden) - 3), hi = Math.max(...u.leden) + 3, getallen = schud(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i));
      u.over = new Set(u.leden);
      const kol = Math.min(7, getallen.length);
      getallen.forEach((g, i) => G.rotsen.push(maakRots(70 + (i % kol) * (BW - 140) / Math.max(1, kol - 1) + rand(-18, 18), 130 - Math.floor(i / kol) * 95 + rand(-12, 12), String(g), u.leden.includes(g), tempo - 4, 26)));
    } else if (u.type === 'poort') {
      G.poort = { y: 125, volgorde: schud(u.opties.map((_, i) => i)), vy: 40 + G.nr * 4, flits: 0 };
    }
  }
  function maakRots(x, y, label, goed, vy, r = 34) {
    return { x, y, r, label, goed, vy: vy * rand(0.85, 1.15), fase: rand(0, 6), rot: rand(0, 6), spin: rand(-0.6, 0.6), vorm: vormRots(r), kraters: Array.from({ length: 3 }, () => [rand(-r / 2, r / 2), rand(-r / 2, r / 2), rand(3, r / 5)]), weg: 0 };
  }
  function uitdagingGeslaagd(x, y) {
    G.combo++; G.maxCombo = Math.max(G.maxCombo, G.combo);
    const punten = 100 + 25 * (G.combo - 1);
    G.score += punten; popup(x, y - 30, '+' + punten, '#3dffa0', 26);
    if (G.combo >= 2) popup(x, y - 58, `COMBO ×${G.combo}`, '#ffc547', 18);
    strooiKristallen(x, y, 3 + Math.min(4, G.combo));
    if (G.combo % 3 === 0) G.capsules.push({ x, y, vy: 70, type: kies(['dubbel', 'traag', 'schild']), t: 0 });
    SFX.goed(); flitsPaneel(true);
    for (const r of G.rotsen) if (!r.weg) { r.weg = 0.4; }
    G.uitdaging = null;
    setTimeout(() => { if (G && G.actief) volgendeUitdaging(); }, 700);
  }
  function fout(x, y, tekst = 'FOUT') {
    G.fouten++; G.foutOpg++; G.combo = 0; popup(x, y - 20, tekst, '#ff4d5e', 24); SFX.fout(); flitsPaneel(false); schade(1, true);
  }
  function vraagKlaar() {
    G.juist += G.foutOpg ? 0 : 1;
    if (G.foutOpg) { toonUitleg(G.opg, () => volgendeStap()); }
    else volgendeStap();
  }
  // -- meteorenregen
  function startRegen() {
    G.regen = 7 + Math.min(3, G.nr * 0.5); G.regenT = 0; G.uitdaging = null;
    zetPaneel('☄️', 'Meteorenregen!', '<b>Ontwijk de meteoren</b> of schiet ze kapot voor kristallen 💎', `overleef ${Math.round(7 + Math.min(3, G.nr * 0.5))} seconden`);
    popup(BW / 2, BH / 2 - 40, '⚠ METEORENREGEN ⚠', '#ff4fa3', 30);
  }
  // -- eindbaas: het moederschip
  function startBaas() {
    const opgaven = [Vragen.baasOpgave(G.P), Vragen.baasOpgave(G.P)].filter(Boolean);
    if (!opgaven.length) return sectorKlaar();
    const lagen = opgaven.reduce((s, o) => s + o.stappen.length, 0);
    G.eindbaas = { x: BW / 2, y: -140, doelY: 150, t: 0, opgaven, oi: 0, si: 0, lagen, over: lagen, vuur: 2, raak: 0, dood: 0, kernen: [] };
    popup(BW / 2, BH / 2, '⚠ HET MOEDERSCHIP NADERT ⚠', '#ff4fa3', 30); SFX.baas(); G.schud = 0.6;
    baasStap();
  }
  function baasStap() {
    const B = G.eindbaas, o = B.opgaven[B.oi], st = o.stappen[B.si];
    const gedaan = o.stappen.slice(0, B.si).map(s => s.juist);
    zetPaneel('👾', `Moederschip — berekening ${B.oi + 1}/${B.opgaven.length} · kraak het schild stap voor stap`,
      T('\\displaystyle ' + o.tex) + gedaan.map(s => ` <span style="color:#3dffa0">= ${esc(s)}</span>`).join('') + ' <span style="color:#ffc547">= ?</span>',
      `🎯 schiet de volgende stap<br><span style="color:#8f9cc8">schild ${B.over}/${B.lagen}</span>`);
    const labels = schud([{ t: st.juist, goed: true }, ...st.fout.slice(0, 3).map(t => ({ t, goed: false }))]);
    B.kernen = labels.map((l, i) => ({ ...l, i, n: labels.length, x: 0, y: 0, weg: 0 }));
  }
  function baasKern(k, x, y) {
    const B = G.eindbaas;
    if (!k.goed) { k.weg = 0.4; explosie(x, y, '#ff4d5e', 18, 160); return fout(x, y); }
    k.weg = 0.4; B.kernen.forEach(q => { q.weg = q.weg || 0.4; });
    B.over--; B.raak = 0.5; G.schud = 0.35; explosie(B.x, B.y + 20, '#ff4fa3', 50, 320, 4); SFX.boem();
    G.combo++; G.maxCombo = Math.max(G.maxCombo, G.combo); G.score += 300; popup(B.x, B.y + 80, '+300 SCHILD GEBROKEN', '#ffc547', 22);
    strooiKristallen(x, y, 4);
    const o = B.opgaven[B.oi]; B.si++;
    if (B.si >= o.stappen.length) { B.oi++; B.si = 0; }
    if (B.oi >= B.opgaven.length) { B.dood = 2.4; B.kernen = []; SFX.baas(); return; }
    setTimeout(() => { if (G && G.eindbaas && !G.eindbaas.dood) baasStap(); }, 600);
  }

  function schade(n, gedwongen) {
    if (!gedwongen && (G.schip.inv > 0)) return;
    if (G.pu.schild > 0 && !gedwongen) { G.pu.schild = 0; explosie(G.schip.x, G.schip.y, '#3dffa0', 20, 180); G.schip.inv = 0.8; return; }
    G.schild -= n; G.schip.inv = 1.3; G.schud = 0.4; explosie(G.schip.x, G.schip.y, '#ff4d5e', 20, 200);
    if (G.schild <= 0) { G.schild = 0; explosie(G.schip.x, G.schip.y, '#ffc547', 80, 380, 4); SFX.boem(); G.actief = false; setTimeout(gameOver, 1300); }
  }
  function strooiKristallen(x, y, n) { for (let i = 0; i < n; i++) G.kristallen.push({ x: x + rand(-14, 14), y: y + rand(-14, 14), vx: rand(-90, 90), vy: rand(-140, -20), t: 0 }); }

  // ------------------------------------------------------------------ update
  function update(dt) {
    G.tijd += dt;
    const traag = G.pu.traag > 0 ? 0.45 : 1;
    for (const k of ['dubbel', 'traag', 'schild']) if (k !== 'schild') G.pu[k] = Math.max(0, G.pu[k] - dt);
    G.schud = Math.max(0, G.schud - dt); warp = Math.max(0, warp - dt * 0.7);
    if (G.intro > 0) { G.intro -= dt; if (G.intro <= 0) volgendeStap(); }

    // schip
    const s = G.schip, v = snelheid();
    const dx = (toets.ArrowRight || toets.d ? 1 : 0) - (toets.ArrowLeft || toets.a || toets.q ? 1 : 0);
    const dy = (toets.ArrowDown || toets.s ? 1 : 0) - (toets.ArrowUp || toets.w || toets.z ? 1 : 0);
    s.vx += (dx * v - s.vx) * Math.min(1, dt * 12); s.vy += (dy * v - s.vy) * Math.min(1, dt * 12);
    s.x = klem(s.x + s.vx * dt, 28, BW - 28); s.y = klem(s.y + s.vy * dt, BH * 0.38, BH - 34);
    s.inv = Math.max(0, s.inv - dt); s.koel -= dt;
    if ((toets[' '] || toets.Spacebar) && s.koel <= 0 && G.actief) {
      s.koel = vuurTijd();
      const dub = G.pu.dubbel > 0;
      (dub ? [-12, 12] : [0]).forEach(o => G.kogels.push({ x: s.x + o, y: s.y - 30, vy: -720 }));
      if (dub) { G.kogels.push({ x: s.x - 16, y: s.y - 20, vy: -680, vx: -110 }); G.kogels.push({ x: s.x + 16, y: s.y - 20, vy: -680, vx: 110 }); }
      SFX.schot();
    }
    for (const k of G.kogels) { k.y += k.vy * dt; k.x += (k.vx || 0) * dt; }
    G.kogels = G.kogels.filter(k => k.y > -20 && !k.weg);

    // antwoord-asteroïden
    for (const r of G.rotsen) {
      if (r.weg) { r.weg -= dt; continue; }
      r.y += r.vy * dt * traag; r.x += Math.sin(G.tijd * 0.9 + r.fase) * 14 * dt; r.rot += r.spin * dt;
      if (r.y - r.r > BH) { r.y = -r.r - rand(0, 80); r.x = rand(60, BW - 60); }
      for (const k of G.kogels) if (!k.weg && Math.hypot(k.x - r.x, k.y - r.y) < r.r + 6) {
        k.weg = true;
        if (!G.uitdaging) break;
        if (G.uitdaging.type === 'set') {
          r.weg = 0.01;
          if (r.goed) { explosie(r.x, r.y, '#3dffa0', 22, 180); G.score += 40; popup(r.x, r.y, '✓ ' + r.label, '#3dffa0'); SFX.goed(); G.uitdaging.over.delete(+r.label);
            const rest = G.uitdaging.over.size;
            paneel.querySelector('.p-doel').innerHTML = `🎯 schiet ALLE oplossingen (nog ${rest})`;
            if (!rest) { uitdagingGeslaagd(r.x, r.y); } }
          else { explosie(r.x, r.y, '#ff4d5e', 22, 180); fout(r.x, r.y, r.label + ' hoort er niet bij'); }
        } else if (r.goed) { r.weg = 0.01; explosie(r.x, r.y, '#3dffa0', 40, 260, 4); uitdagingGeslaagd(r.x, r.y); }
        else { r.weg = 0.01; explosie(r.x, r.y, '#ff4d5e', 26, 200); fout(r.x, r.y); }
        break;
      }
    }
    G.rotsen = G.rotsen.filter(r => !(r.weg && r.weg <= 0));

    // poort
    const p = G.poort;
    if (p && G.uitdaging && G.uitdaging.type === 'poort') {
      p.y += p.vy * dt * traag; p.flits = Math.max(0, p.flits - dt);
      if (p.y >= s.y - 8) {
        const n = p.volgorde.length, idx = p.volgorde[Math.floor(s.x / (BW / n))];
        if (idx === G.uitdaging.juist) { explosie(s.x, p.y, '#3dffa0', 40, 260); G.poort = null; uitdagingGeslaagd(s.x, s.y - 40); }
        else { fout(s.x, s.y - 30); p.y = 110; p.volgorde = schud(p.volgorde); }
      }
    }

    // meteorenregen
    if (G.regen > 0) {
      G.regen -= dt; G.regenT -= dt;
      if (G.regenT <= 0 && G.regen > 0.8) { G.regenT = rand(0.3, 0.55) - G.nr * 0.03 - (S.modus === 'plus' ? 0.05 : 0); const r = rand(13, 32); const m = maakRots(rand(20, BW - 20), -40, '', false, rand(140, 240) + G.nr * 10, r); m.vx = rand(-40, 40); m.hp = r > 24 ? 2 : 1; m.spin = rand(-2, 2); G.meteoren.push(m); }
      if (G.regen <= 0) { G.regen = 0; G.score += 150; const herstel = G.schild < maxSchild(); if (herstel) G.schild++; popup(BW / 2, BH / 2, 'OVERLEEFD! +150' + (herstel ? ' · +1 SCHILD' : ''), '#3dffa0', 26); setTimeout(() => { if (G && G.actief) volgendeStap(); }, 900); }
    }
    for (const m of G.meteoren) {
      m.y += m.vy * dt * traag; m.x += m.vx * dt * traag; m.rot += m.spin * dt;
      for (const k of G.kogels) if (!k.weg && Math.hypot(k.x - m.x, k.y - m.y) < m.r + 4) { k.weg = true; m.hp--; explosie(k.x, k.y, '#ffb36b', 6, 90, 2); if (m.hp <= 0) { m.dood = true; explosie(m.x, m.y, '#ffb36b', 20, 180); strooiKristallen(m.x, m.y, m.r > 24 ? 2 : 1); G.score += 10; SFX.klein(); } break; }
      if (!m.dood && Math.hypot(s.x - m.x, s.y - m.y) < m.r + 16) { m.dood = true; explosie(m.x, m.y, '#ffb36b', 20, 180); schade(1); }
    }
    G.meteoren = G.meteoren.filter(m => !m.dood && m.y < BH + 60);

    // eindbaas
    const B = G.eindbaas;
    if (B) {
      B.t += dt; B.raak = Math.max(0, B.raak - dt);
      B.y += (B.doelY - B.y) * Math.min(1, dt * 1.5);
      B.x = BW / 2 + Math.sin(B.t * 0.5) * (BW / 2 - 290);
      B.kernen.forEach((k, i) => { const h = B.t * 0.9 + i / k.n * Math.PI * 2; k.x = klem(B.x + Math.cos(h) * 190, 90, BW - 90); k.y = B.y + 120 + Math.sin(h) * 45; });
      if (B.dood) {
        B.dood -= dt; if (Math.random() < 0.5) explosie(B.x + rand(-130, 130), B.y + rand(-50, 50), kies(['#ff4fa3', '#ffc547', '#38e1ff']), 16, 200, 3);
        G.schud = 0.3;
        if (B.dood <= 0) { explosie(B.x, B.y, '#ffffff', 120, 520, 5); SFX.baas(); G.score += 1000; popup(B.x, B.y, 'MOEDERSCHIP VERNIETIGD! +1000', '#ffc547', 26); strooiKristallen(B.x, B.y, 20); G.eindbaas = null; setTimeout(() => { if (G && G.actief) volgendeStap(); }, 1600); }
      } else {
        B.vuur -= dt * traag;
        if (B.vuur <= 0 && B.y > 60) {
          B.vuur = Math.max(0.6, 1.3 - (B.lagen - B.over) * 0.07) + rand(0, 0.4);
          const h = Math.atan2(s.y - (B.y + 40), s.x - B.x), spreid = (B.lagen - B.over) > B.lagen / 2 ? [-0.25, 0, 0.25] : [0];
          for (const d of spreid) G.vijandKogels.push({ x: B.x, y: B.y + 40, vx: Math.cos(h + d) * 230, vy: Math.sin(h + d) * 230 });
        }
        for (const k of G.kogels) {
          if (k.weg) continue;
          const kern = B.kernen.find(q => !q.weg && Math.hypot(k.x - q.x, k.y - q.y) < 30);
          if (kern) { k.weg = true; baasKern(kern, kern.x, kern.y); break; }
          if (Math.abs(k.x - B.x) < 150 && Math.abs(k.y - B.y) < 50) { k.weg = true; explosie(k.x, k.y, '#7ff6ff', 5, 80, 1.5); }
        }
      }
      B.kernen.forEach(k => { if (k.weg) k.weg -= dt; });
    }
    for (const k of G.vijandKogels) { k.x += k.vx * dt * traag; k.y += k.vy * dt * traag; if (Math.hypot(k.x - s.x, k.y - s.y) < 16) { k.weg = true; schade(1); } }
    G.vijandKogels = G.vijandKogels.filter(k => !k.weg && k.y < BH + 20 && k.y > -40 && k.x > -20 && k.x < BW + 20);

    // kristallen en capsules
    const mag = magneet();
    for (const c of G.kristallen) {
      c.t += dt; const d = Math.hypot(s.x - c.x, s.y - c.y);
      if (mag && d < mag) { c.vx += (s.x - c.x) / d * 900 * dt; c.vy += (s.y - c.y) / d * 900 * dt; }
      else { c.vy += 120 * dt; c.vx *= 0.98; }
      c.x += c.vx * dt; c.y += c.vy * dt;
      if (d < 30) { c.weg = true; G.kristal++; SFX.kristal(); }
    }
    G.kristallen = G.kristallen.filter(c => !c.weg && c.y < BH + 20);
    for (const c of G.capsules) {
      c.y += c.vy * dt; c.t += dt;
      if (Math.hypot(s.x - c.x, s.y - c.y) < 34) {
        c.weg = true; SFX.power();
        if (c.type === 'dubbel') { G.pu.dubbel = 10; popup(c.x, c.y, 'DUBBEL VUUR!', '#38e1ff'); }
        if (c.type === 'traag') { G.pu.traag = 8; popup(c.x, c.y, 'TIJD VERTRAAGD!', '#b48cff'); }
        if (c.type === 'schild') { if (G.schild < maxSchild()) { G.schild++; popup(c.x, c.y, '+1 SCHILD', '#3dffa0'); } else { G.pu.schild = 1; popup(c.x, c.y, 'EXTRA BUBBEL!', '#3dffa0'); } }
      }
    }
    G.capsules = G.capsules.filter(c => !c.weg && c.y < BH + 30);
    updDeeltjes(dt);
  }

  // ------------------------------------------------------------------ tekenen
  const PU = { dubbel: ['⚡', '#38e1ff'], traag: ['⏳', '#b48cff'], schild: ['🛡', '#3dffa0'] };
  function teken(dt) {
    ctx.save();
    if (G && G.schud > 0) ctx.translate(rand(-6, 6) * G.schud * 2, rand(-6, 6) * G.schud * 2);
    tekenAchtergrond(dt);
    if (!G) { ctx.restore(); return; }
    const t = G.tijd;
    // poort
    const p = G.poort;
    if (p && G.uitdaging) {
      const n = p.volgorde.length, bw = BW / n, kleuren = ['#38e1ff', '#ff4fa3', '#ffc547', '#b48cff'];
      for (let i = 0; i < n; i++) {
        const x = i * bw, kl = kleuren[i % 4];
        const g = ctx.createLinearGradient(0, p.y - 26, 0, p.y + 26); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, kl + '55'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(x + 6, p.y - 26, bw - 12, 52);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = kl; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 6, p.y); ctx.lineTo(x + bw - 6, p.y); ctx.stroke(); ctx.restore();
        ctx.fillStyle = '#9fb0e0'; ctx.fillRect(x - 4, p.y - 34, 8, 68);
        plaatje(x + bw / 2, p.y - 46, G.uitdaging.opties[p.volgorde[i]], kl, 26);
      }
    }
    // antwoord-asteroïden
    for (const r of G.rotsen) {
      if (r.weg) { ctx.globalAlpha = Math.max(0, r.weg / 0.4); }
      tekenRots(r, '#6f84d6'); plaatje(r.x, r.y, r.label, r.weg ? '#666' : '#38e1ff', r.r > 30 ? 21 : 19);
      ctx.globalAlpha = 1;
    }
    // meteoren
    for (const m of G.meteoren) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(m.x, m.y - m.r * 3, m.x, m.y); g.addColorStop(0, 'rgba(255,120,40,0)'); g.addColorStop(1, 'rgba(255,140,60,.45)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(m.x - m.r * 0.8, m.y); ctx.lineTo(m.x + m.r * 0.8, m.y); ctx.lineTo(m.x - m.vx * 0.3, m.y - m.r * 3.2); ctx.closePath(); ctx.fill(); ctx.restore();
      tekenRots(m, '#ff9a5a', ['#6a3a2a', '#1e110c']);
    }
    // eindbaas
    const B = G.eindbaas;
    if (B) tekenBaas(B, t);
    // kristallen
    for (const c of G.kristallen) {
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.t * 3); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = '#7ff6ff'; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(5, 0); ctx.lineTo(0, 7); ctx.lineTo(-5, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(127,246,255,.25)'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, 7); ctx.fill(); ctx.restore();
    }
    // capsules
    for (const c of G.capsules) {
      const [ic, kl] = PU[c.type]; ctx.save(); ctx.translate(c.x, c.y);
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = kl; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 18 + Math.sin(c.t * 8) * 2, 0, 7); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over'; ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ic, 0, 1); ctx.restore();
    }
    // kogels
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const k of G.kogels) { const g = ctx.createLinearGradient(k.x, k.y, k.x, k.y + 22); g.addColorStop(0, '#ffffff'); g.addColorStop(0.3, '#38e1ff'); g.addColorStop(1, 'rgba(56,225,255,0)'); ctx.strokeStyle = g; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(k.x, k.y); ctx.lineTo(k.x - (k.vx || 0) * 0.03, k.y + 22); ctx.stroke(); }
    for (const k of G.vijandKogels) { ctx.fillStyle = '#ff4fa3'; ctx.beginPath(); ctx.arc(k.x, k.y, 6, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,79,163,.3)'; ctx.beginPath(); ctx.arc(k.x, k.y, 12, 0, 7); ctx.fill(); }
    ctx.restore();
    if (G.schild > 0) tekenSchip(G.schip, t);
    tekenDeeltjes();
    // traag-filter
    if (G.pu.traag > 0) { ctx.fillStyle = 'rgba(120,80,255,.08)'; ctx.fillRect(0, 0, BW, BH); }
    // sector-intro
    if (G.intro > 0) {
      const a = Math.min(1, G.intro, (2.4 - G.intro) * 3);
      ctx.globalAlpha = a; ctx.textAlign = 'center';
      ctx.font = '700 16px Orbitron, sans-serif'; ctx.fillStyle = G.stelsel.kleur; ctx.fillText(`${G.stelsel.naam.toUpperCase()}${S.modus === 'plus' ? ' +' : ''} · SECTOR ${G.nr}`, BW / 2, BH / 2 - 40);
      ctx.font = '900 38px Orbitron, sans-serif'; ctx.fillStyle = '#fff'; ctx.fillText(G.baas ? 'EINDBAAS' : G.deel.titel.replace(/ \+$/, ''), BW / 2, BH / 2 + 6);
      ctx.font = '700 15px "Atkinson Hyperlegible", sans-serif'; ctx.fillStyle = '#8f9cc8'; ctx.fillText(G.baas ? 'Alles door elkaar — en dan het moederschip…' : (G.deel.kort || ''), BW / 2, BH / 2 + 40);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    tekenHUD();
  }
  function tekenBaas(B, t) {
    ctx.save(); ctx.translate(B.x, B.y);
    const sch = B.over / B.lagen;
    // schildringen
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < B.over; i++) { ctx.strokeStyle = `rgba(255,79,163,${0.18 + 0.1 * Math.sin(t * 3 + i)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 175 + i * 7, 70 + i * 4, 0, 0, 7); ctx.stroke(); }
    ctx.restore();
    // romp
    const g = ctx.createLinearGradient(0, -60, 0, 60); g.addColorStop(0, '#4b2a7a'); g.addColorStop(0.5, '#1b1033'); g.addColorStop(1, '#0a0614');
    ctx.fillStyle = g; ctx.strokeStyle = B.raak > 0 ? '#ffffff' : '#ff4fa3'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-160, 0); ctx.lineTo(-110, -40); ctx.lineTo(-40, -55); ctx.lineTo(40, -55); ctx.lineTo(110, -40); ctx.lineTo(160, 0); ctx.lineTo(120, 30); ctx.lineTo(60, 52); ctx.lineTo(-60, 52); ctx.lineTo(-120, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,79,163,.4)'; ctx.lineWidth = 1; for (const x of [-90, -45, 45, 90]) { ctx.beginPath(); ctx.moveTo(x, -45); ctx.lineTo(x * 0.8, 45); ctx.stroke(); }
    // kanonnen
    ctx.fillStyle = '#2a1650'; for (const x of [-120, 120]) { ctx.fillRect(x - 10, 20, 20, 30); ctx.fillStyle = '#ff4fa3'; ctx.fillRect(x - 4, 46, 8, 8); ctx.fillStyle = '#2a1650'; }
    // kern
    ctx.globalCompositeOperation = 'lighter';
    const kr = 26 + Math.sin(t * 6) * 3, kg = ctx.createRadialGradient(0, 8, 2, 0, 8, kr * 1.8); kg.addColorStop(0, '#fff'); kg.addColorStop(0.3, '#ff4fa3'); kg.addColorStop(1, 'rgba(255,79,163,0)');
    ctx.fillStyle = kg; ctx.beginPath(); ctx.arc(0, 8, kr * 1.8, 0, 7); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // levensbalk
    rondeRechthoek(-120, -78, 240, 10, 5); ctx.fillStyle = '#1d0f33'; ctx.fill();
    rondeRechthoek(-120, -78, 240 * sch, 10, 5); ctx.fillStyle = '#ff4fa3'; ctx.fill();
    ctx.restore();
    // antwoordkernen (rond het moederschip)
    for (const k of B.kernen) {
      if (k.weg && k.weg <= 0) continue;
      ctx.globalAlpha = k.weg ? Math.max(0, k.weg / 0.4) : 1;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,197,71,.18)'; ctx.beginPath(); ctx.arc(k.x, k.y, 30 + Math.sin(t * 5 + k.i) * 3, 0, 7); ctx.fill(); ctx.restore();
      plaatje(k.x, k.y, k.t, '#ffc547', 19);
      ctx.globalAlpha = 1;
    }
  }
  let hudOud = '';
  function tekenHUD() {
    if (!G) return;
    const n = G.plan.length, klaar = Math.max(0, G.stap) / n;
    const pu = ['dubbel', 'traag'].filter(k => G.pu[k] > 0).map(k => `${PU[k][0]} ${Math.ceil(G.pu[k])}s`).join(' ');
    const h = `<div class="blok"><div><div class="klein">SCHILD</div><div class="schild">${Array.from({ length: maxSchild() }, (_, i) => `<i class="${i < G.schild ? 'aan' : ''}"></i>`).join('')}${G.pu.schild ? ' 🫧' : ''}</div></div>
        <div><div class="klein">KRISTALLEN</div><div class="waarde kristal">💎 ${S.kristallen + G.kristal}</div></div></div>
      <div class="blok"><div><div class="klein">SECTOR ${G.nr}${S.modus === 'plus' ? ' · +' : ''}</div><div class="voortgang"><i style="width:${Math.round(klaar * 100)}%"></i></div></div>${pu ? `<div class="pu">${pu}</div>` : ''}</div>
      <div class="blok"><div><div class="klein">SCORE</div><div class="waarde">${G.score.toLocaleString('nl-BE')}</div></div>${G.combo >= 2 ? `<div class="waarde combo">×${G.combo}</div>` : ''}<div class="klein">${S.geluid ? '🔊' : '🔇'}</div></div>`;
    if (h !== hudOud) { hud.innerHTML = h; hudOud = h; }
  }

  // ------------------------------------------------------------------ vraagpaneel
  function zetPaneel(icoon, opdracht, opgave, doel) {
    paneel.innerHTML = `<div class="p-icoon">${icoon}</div><div class="p-inhoud"><div class="p-opdracht">${esc(opdracht)}</div><div class="p-opgave">${opgave}</div></div><div class="p-doel">${doel || ''}</div>`;
    W.renderIn(paneel);
  }
  function flitsPaneel(goed) { paneel.classList.remove('flits-goed', 'flits-fout'); void paneel.offsetWidth; paneel.classList.add(goed ? 'flits-goed' : 'flits-fout'); }
  let meldT = null;
  function melding(t) { const m = document.createElement('div'); m.textContent = t; m.style.cssText = 'position:fixed;left:50%;top:16px;transform:translateX(-50%);background:#0d1430;border:1px solid #2a3a7a;color:#fff;padding:8px 16px;border-radius:99px;font:700 14px Orbitron,sans-serif;z-index:99'; document.body.appendChild(m); clearTimeout(meldT); meldT = setTimeout(() => m.remove(), 1300); }

  // ------------------------------------------------------------------ schermen
  function scherm(html) { laag.innerHTML = `<div class="scherm">${html}</div>`; W.renderIn(laag); return laag.firstElementChild; }
  const sterHTML = (n, max = 3) => `<span class="sterren">${'★'.repeat(n)}<span class="uit">${'★'.repeat(max - n)}</span></span>`;
  const vg = (st) => (S.vg[S.modus][st.id] ||= {});

  function startScherm() {
    stopRonde(); paneel.hidden = true; hud.hidden = true;
    const totS = Object.values(S.vg.normaal).reduce((a, x) => a + Object.values(x).reduce((b, y) => b + (y || 0), 0), 0) + Object.values(S.vg.plus).reduce((a, x) => a + Object.values(x).reduce((b, y) => b + (y || 0), 0), 0);
    const el = scherm(`<div class="rij tussen" style="align-items:flex-start"><div><div class="logo">GALAXIE <span class="r">ℝ</span></div>
        <p class="sub">Een ruimtereis door de getallenleer · Wiskunde 7VJHO</p></div><div style="font-size:54px;filter:drop-shadow(0 0 14px #38e1ff)">🚀</div></div>
      <p style="margin:16px 0 0;max-width:60ch;line-height:1.5">Vlieg door vier sterrenstelsels: <b style="color:#38e1ff">ℕ</b>, <b style="color:#ff6b8a">ℤ</b>, <b style="color:#ffc547">ℚ</b> en <b style="color:#b48cff">ℝ</b>.
        Schiet de <b>juiste antwoorden</b> uit de ruimte, vlieg door de <b>juiste poort</b>, overleef de <b>meteorenregen</b> en versla het <b>moederschip</b>.
        Maar opgelet: een fout antwoord raken kost je schild!</p>
      <div class="veld"><label for="nm"><b>Naam van de piloot</b></label><input id="nm" maxlength="20" value="${esc(S.naam)}" placeholder="Je voornaam" autocomplete="off"></div>
      <div class="rij" style="gap:16px"><span class="hint">Niveau:</span><div class="modus"><button data-m="normaal" class="${S.modus === 'normaal' ? 'aan' : ''}">NORMAAL</button><button data-m="plus" class="${S.modus === 'plus' ? 'aan' : ''}">+ GEVORDERD</button></div></div>
      <div class="rij" style="margin-top:20px"><button class="knop" id="go">▶ VERTREKKEN</button><button class="knop licht" id="hangar">🛠️ HANGAR</button><button class="knop licht" id="snd">${S.geluid ? '🔊 GELUID AAN' : '🔇 GELUID UIT'}</button></div>
      <div class="stats"><span>💎 <b>${S.kristallen}</b> kristallen</span><span>★ <b>${totS}</b> sterren</span><span>🏆 record <b>${(S.best || 0).toLocaleString('nl-BE')}</b></span><span>🛸 <b>${S.overwinningen || 0}</b> moederschepen verslagen</span></div>`);
    const naam = () => { S.naam = el.querySelector('#nm').value.trim(); bewaar(); };
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { S.modus = b.dataset.m; bewaar(); startScherm(); });
    el.querySelector('#go').onclick = () => { naam(); kaartScherm(); };
    el.querySelector('#hangar').onclick = () => { naam(); hangarScherm(startScherm); };
    el.querySelector('#snd').onclick = () => { S.geluid = !S.geluid; bewaar(); naam(); startScherm(); if (S.geluid) SFX.power(); };
    verderActie = () => { naam(); kaartScherm(); };
  }

  function kaartScherm() {
    stopRonde(); paneel.hidden = true; hud.hidden = true;
    const el = scherm(`<div class="rij tussen"><div><h2>🌌 STERRENKAART</h2><p class="sub">Kies een stelsel${S.modus === 'plus' ? ' · niveau <b style="color:#ff4fa3">+ gevorderd</b>' : ''}.</p></div>
        <div class="rij"><span class="kristal">💎 ${S.kristallen}</span><button class="knop licht" id="hangar">🛠️ HANGAR</button><button class="knop licht" id="terug">← START</button></div></div>
      <div class="stelsels">${Vragen.STELSELS.map(st => {
        const P = Vragen.leerpad(st, S.modus), v = S.vg[S.modus][st.id] || {}, n = P ? P.delen.length : 0;
        const gehaald = Object.values(v).filter(x => x > 0).length, ster = Object.values(v).reduce((a, x) => a + (x || 0), 0);
        return `<button class="stelsel" data-st="${st.id}" ${P ? '' : 'disabled'}>${P ? '' : '<span class="slot">🔒 binnenkort</span>'}
          <div class="planeet" style="background:radial-gradient(circle at 35% 30%,#fff,${st.kleur} 45%,#111 120%);box-shadow:0 0 30px ${st.kleur}66">${st.teken}</div>
          <b>${esc(st.naam)}</b><small>${esc(st.sub)}</small>
          ${P ? `<div style="margin-top:6px"><small>${gehaald}/${n} sectoren</small><br>${sterHTML(Math.min(3, Math.round(ster / Math.max(1, n))))} <small>${ster}/${n * 3}</small></div>` : ''}</button>`;
      }).join('')}</div>
      <p class="hint" style="margin-top:14px">De stelsels ℤ, ℚ en ℝ worden binnenkort ontgrendeld.</p>`);
    el.querySelectorAll('[data-st]').forEach(b => b.onclick = () => sectorScherm(Vragen.STELSELS.find(s => s.id === b.dataset.st)));
    el.querySelector('#hangar').onclick = () => hangarScherm(kaartScherm);
    el.querySelector('#terug').onclick = startScherm;
    verderActie = () => sectorScherm(Vragen.STELSELS[0]);
  }

  function sectorScherm(st) {
    stopRonde(); paneel.hidden = true; hud.hidden = true;
    const P = Vragen.leerpad(st, S.modus), v = vg(st);
    const open = (nr) => nr === 1 || (v[nr - 1] || 0) > 0;
    const eerste = P.delen.map(d => d.nr).find(nr => open(nr) && !v[nr]) || 1;
    const el = scherm(`<div class="rij tussen"><div><h2 style="color:${st.kleur}">${st.teken} ${esc(st.naam.toUpperCase())}${S.modus === 'plus' ? ' +' : ''}</h2><p class="sub">${esc(P.titel)} · haal een sector om de volgende te ontgrendelen</p></div>
        <button class="knop licht" id="terug">← STERRENKAART</button></div>
      <div class="sectoren">${P.delen.map(d => {
        const baas = d.nr === P.delen.length;
        return `<button class="sector${baas ? ' baas' : ''}" data-nr="${d.nr}" ${open(d.nr) ? '' : 'disabled'}><div class="nr">${baas ? '👾' : d.nr}</div>
          <div class="t"><b>${baas ? 'Eindbaas — het moederschip' : esc(d.titel.replace(/ \+$/, ''))}</b><small>${esc(baas ? 'Alles door elkaar, daarna kraak je het moederschip stap voor stap.' : d.kort || '')}${d.rekenmachine ? ' · 🧮 rekentoestel mag' : ''}</small></div>
          ${open(d.nr) ? sterHTML(v[d.nr] || 0) : '🔒'}</button>`;
      }).join('')}</div>
      <p class="hint" style="margin-top:12px"><kbd>Enter</kbd> start sector ${eerste}.</p>`);
    el.querySelectorAll('[data-nr]').forEach(b => b.onclick = () => startSector(st, +b.dataset.nr));
    el.querySelector('#terug').onclick = kaartScherm;
    verderActie = () => startSector(st, eerste);
  }

  function hangarScherm(terug) {
    const el = scherm(`<div class="rij tussen"><div><h2>🛠️ HANGAR</h2><p class="sub">Verbeter je schip met je kristallen.</p></div><div class="rij"><span class="kristal" style="font-size:20px">💎 ${S.kristallen}</span><button class="knop licht" id="terug">← TERUG</button></div></div>
      <div class="upgrades">${Object.entries(UPG).map(([k, u]) => {
        const lv = S.upg[k], max = u.prijs.length, prijs = u.prijs[lv];
        return `<div class="upgrade"><b>${u.icoon} ${esc(u.naam)}</b><p>${esc(u.uitleg)}</p><div class="niveaus">${u.prijs.map((_, i) => `<i class="${i < lv ? 'aan' : ''}"></i>`).join('')}</div>
          ${lv >= max ? '<span class="hint">✓ maximum bereikt</span>' : `<button class="knop ${S.kristallen >= prijs ? 'goud' : 'licht'}" data-k="${k}" ${S.kristallen >= prijs ? '' : 'disabled'}>KOPEN · 💎 ${prijs}</button>`}</div>`;
      }).join('')}</div>
      <p class="hint" style="margin-top:12px">Kristallen verdien je met juiste antwoorden (meer bij een combo), door meteoren kapot te schieten en door sectoren te halen.</p>`);
    el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = b.dataset.k, pr = UPG[k].prijs[S.upg[k]]; if (S.kristallen >= pr) { S.kristallen -= pr; S.upg[k]++; bewaar(); SFX.power(); hangarScherm(terug); } });
    el.querySelector('#terug').onclick = terug;
    verderActie = terug;
  }

  function toonUitleg(opg, verder) {
    G.pauze = true; G.pauzeScherm = false;
    const v = opg.v;
    const juist = opg.uitdagingen.map(u => u.type === 'poort' ? u.opties[u.juist] : u.type === 'set' ? '{' + u.leden.join(' ; ') + '}' : u.juist).join(' · ');
    const el = scherm(`<h3 style="color:#ffc547">💡 EVEN UITLEG</h3><p class="sub">Je raakte een fout antwoord. Zo moest het:</p>
      <div style="margin-top:10px;font-size:19px">${W.opgave(v)}</div>
      <div class="uitleg">${(v.uitlegHtml || '') + [].concat(v.uitleg || []).map(u => `<div class="uitlegregel">${T(u)}</div>`).join('')}</div>
      <p style="margin-top:10px">Juiste antwoord: <b class="goed">${esc(juist)}</b></p>
      <div class="rij" style="margin-top:14px"><button class="knop" id="v">VERDER ▶</button><span class="hint"><kbd>Enter</kbd></span></div>`);
    const ga = () => { verderActie = null; laag.innerHTML = ''; G.pauze = false; verder(); };
    el.querySelector('#v').onclick = ga;
    setTimeout(() => { verderActie = ga; }, 400); // niet per ongeluk wegklikken met de spatiebalk
  }

  function pauzeer() {
    if (!G || !G.actief || G.pauze) return;
    G.pauze = true; G.pauzeScherm = true;
    const el = scherm(`<h2>⏸ PAUZE</h2><p class="sub">${esc(G.stelsel.naam)} · sector ${G.nr}</p>
      <div class="rij" style="margin-top:16px"><button class="knop" id="v">▶ VERDER</button><button class="knop licht" id="snd">${S.geluid ? '🔊 GELUID AAN' : '🔇 GELUID UIT'}</button><button class="knop roze" id="stop">✖ SECTOR STOPPEN</button></div>
      <p class="hint" style="margin-top:12px"><kbd>P</kbd> of <kbd>Esc</kbd> om verder te spelen.</p>`);
    el.querySelector('#v').onclick = hervat;
    el.querySelector('#snd').onclick = () => { S.geluid = !S.geluid; bewaar(); hervat(); pauzeer(); };
    el.querySelector('#stop').onclick = () => { const st = G.stelsel; S.kristallen += G.kristal; bewaar(); sectorScherm(st); };
  }
  function hervat() { if (!G) return; laag.innerHTML = ''; G.pauze = false; G.pauzeScherm = false; }
  function stopRonde() { if (G) G.actief = false; G = null; verderActie = null; }

  function sectorKlaar() {
    G.actief = false;
    const sterren = G.fouten === 0 ? 3 : G.fouten <= 2 ? 2 : 1, st = G.stelsel, v = vg(st);
    const bonus = G.schild * 50 + sterren * 200; G.score += bonus;
    const nieuwRecord = G.score > (S.best || 0);
    const kr = G.kristal + sterren * 10;
    S.kristallen += kr; v[G.nr] = Math.max(v[G.nr] || 0, sterren); if (nieuwRecord) S.best = G.score; if (G.baas) S.overwinningen = (S.overwinningen || 0) + 1;
    bewaar();
    if (window.SpelVolg) SpelVolg.resultaat({ juist: G.juist, totaal: G.vragen, stelsel: st.id, sector: G.nr, modus: S.modus, sterren, score: G.score });
    const P = G.P, volgende = G.nr < P.delen.length ? G.nr + 1 : null, nr = G.nr, baas = G.baas;
    paneel.hidden = true;
    const el = scherm(`<div style="text-align:center"><div class="hint">${esc(st.naam.toUpperCase())}${S.modus === 'plus' ? ' +' : ''} · SECTOR ${nr}</div>
      <div class="groot goed">${baas ? 'STELSEL BEVRIJD!' : 'SECTOR GEHAALD!'}</div>
      <div style="margin:6px 0"><span style="display:inline-block;transform:scale(3);transform-origin:center;margin:14px 0">${sterHTML(sterren)}</span></div>
      <p class="sub">${G.fouten === 0 ? 'Foutloos! Perfecte vlucht. 🌟' : `${G.fouten} fout${G.fouten === 1 ? '' : 'en'} · ${sterren === 2 ? 'net geen 3 sterren' : 'speel opnieuw voor meer sterren'}`}</p>
      <div class="stats" style="justify-content:center"><span>score <b>${G.score.toLocaleString('nl-BE')}</b>${nieuwRecord ? ' 🏆 nieuw record!' : ''}</span><span>schildbonus <b>+${G.schild * 50}</b></span><span>beste combo <b>×${G.maxCombo}</b></span><span>💎 <b>+${kr}</b></span></div>
      <div class="rij" style="justify-content:center;margin-top:18px">${volgende ? `<button class="knop goud" id="vlg">VOLGENDE SECTOR ▶</button>` : ''}<button class="knop licht" id="opn">↻ OPNIEUW</button><button class="knop licht" id="hangar">🛠️ HANGAR</button><button class="knop licht" id="kaart">STERRENKAART</button></div></div>`);
    for (let i = 0; i < 6; i++) setTimeout(() => explosie(rand(150, BW - 150), rand(100, BH - 200), kies(['#38e1ff', '#ffc547', '#ff4fa3', '#3dffa0']), 40, 260), i * 250);
    if (volgende) el.querySelector('#vlg').onclick = () => startSector(st, volgende);
    el.querySelector('#opn').onclick = () => startSector(st, nr);
    el.querySelector('#hangar').onclick = () => hangarScherm(() => sectorScherm(st));
    el.querySelector('#kaart').onclick = kaartScherm;
    verderActie = volgende ? () => startSector(st, volgende) : () => sectorScherm(st);
    G.eindAnimatie = true;
  }
  function gameOver() {
    if (!G) return;
    const st = G.stelsel, nr = G.nr; S.kristallen += G.kristal; bewaar(); paneel.hidden = true;
    if (window.SpelVolg) SpelVolg.resultaat({ juist: G.juist, totaal: G.vragen, stelsel: st.id, sector: nr, modus: S.modus, sterren: 0, score: G.score });
    const el = scherm(`<div style="text-align:center"><div class="groot slecht">SCHIP VERNIETIGD</div>
      <p class="sub">Je schild is op. Je houdt wel je 💎 ${G.kristal} kristallen — misschien eerst een upgrade in de hangar?</p>
      <div class="stats" style="justify-content:center"><span>score <b>${G.score.toLocaleString('nl-BE')}</b></span><span>fouten <b>${G.fouten}</b></span></div>
      <div class="rij" style="justify-content:center;margin-top:18px"><button class="knop goud" id="opn">↻ OPNIEUW</button><button class="knop licht" id="hangar">🛠️ HANGAR</button><button class="knop licht" id="kaart">STERRENKAART</button></div></div>`);
    el.querySelector('#opn').onclick = () => startSector(st, nr);
    el.querySelector('#hangar').onclick = () => hangarScherm(() => sectorScherm(st));
    el.querySelector('#kaart').onclick = kaartScherm;
    verderActie = () => startSector(st, nr);
  }

  // ------------------------------------------------------------------ hoofdlus
  let vorige = performance.now();
  function lus(nu) {
    const dt = Math.min(0.05, (nu - vorige) / 1000); vorige = nu;
    if (G && !G.pauze && (G.actief || G.eindAnimatie || G.schild <= 0)) { if (G.actief) update(dt); else { updDeeltjes(dt); G.tijd += dt; G.schud = Math.max(0, G.schud - dt); } }
    else if (!G) updDeeltjes(dt);
    teken(G && G.pauze ? 0 : dt);
    requestAnimationFrame(lus);
  if (/[?&]test=1/.test(location.search)) window.__galaxie = { G: () => G, S: () => S, startSector, Vragen }; // enkel voor automatische tests
  }
  requestAnimationFrame(lus);
  // eerste scherm (wacht op de toestand uit de databank als het spel via de leerpaden opent)
  startScherm();
})();
