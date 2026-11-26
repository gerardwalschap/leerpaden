// =====================================================================
//  PI'S GETALLENAVONTUUR — kern (spellen/galaxie)
//  Gedeeld door alle werelden: canvas, invoer, geluid, deeltjes, vragen,
//  levens/munten/score, HUD, vraagpaneel, verhaalschermen en opslag.
//  Werelden: w1-platform.js · w2-race.js · w3-puzzel.js · w4-doolhof.js · w5-ruimte.js
// =====================================================================
const K = (() => {
  const BW = 960, BH = 600;
  const doek = document.getElementById('doek'), ctx = doek.getContext('2d');
  const laag = document.getElementById('laag'), paneel = document.getElementById('paneel');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  doek.width = BW * DPR; doek.height = BH * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const esc = W.esc;
  const rand = (a, b) => a + Math.random() * (b - a), kies = W.kies, schud = W.schud;
  const klem = (x, a, b) => Math.max(a, Math.min(b, x));

  // ------------------------------------------------------------ opslag
  const KEY = 'galaxie-v1'; // zelfde sleutel als vroeger: voortgang per leerling via spel-volg.js
  const nieuw = () => ({ versie: 2, naam: '', wereld: 1, levens: 5, munten: 0, score: 0, best: 0, voltooid: 0, runs: 0, geluid: true, werelden: {} });
  let S = nieuw();
  try { const r = JSON.parse(localStorage.getItem(KEY) || 'null'); if (r && r.versie === 2) S = Object.assign(nieuw(), r); else if (r && r.naam) S.naam = r.naam; } catch (e) { /* nieuw */ }
  const bewaar = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* niets */ } };

  // ------------------------------------------------------------ geluid
  let AC = null;
  function toon(f, duur = 0.1, type = 'square', vol = 0.04, naar = null, start = 0) {
    if (!S.geluid) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t = AC.currentTime + start, o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); if (naar) o.frequency.exponentialRampToValueAtTime(naar, t + duur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + duur);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + duur + 0.02);
    } catch (e) { /* geen geluid */ }
  }
  function ruis(duur = 0.3, vol = 0.06) {
    if (!S.geluid) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const n = Math.floor(AC.sampleRate * duur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
      const s = AC.createBufferSource(), g = AC.createGain(); s.buffer = buf; g.gain.value = vol; s.connect(g); g.connect(AC.destination); s.start();
    } catch (e) { /* geen geluid */ }
  }
  const SFX = {
    sprong: () => toon(320, 0.15, 'square', 0.03, 640),
    munt: () => { toon(988, 0.06, 'square', 0.03); toon(1319, 0.12, 'square', 0.03, null, 0.06); },
    goed: () => { toon(523, 0.1, 'triangle', 0.06); toon(659, 0.1, 'triangle', 0.06, null, 0.09); toon(784, 0.1, 'triangle', 0.06, null, 0.18); toon(1047, 0.25, 'triangle', 0.06, null, 0.27); },
    fout: () => { toon(220, 0.3, 'sawtooth', 0.05, 110); },
    au: () => { toon(400, 0.25, 'square', 0.04, 120); ruis(0.15, 0.04); },
    boem: () => { ruis(0.4, 0.07); toon(110, 0.35, 'sine', 0.08, 40); },
    plof: () => { toon(180, 0.08, 'square', 0.04, 90); },
    leven: () => [523, 659, 784, 1047, 1319].forEach((f, i) => toon(f, 0.1, 'square', 0.035, null, i * 0.07)),
    schot: () => toon(760, 0.08, 'square', 0.025, 260),
    deur: () => { toon(150, 0.4, 'sawtooth', 0.04, 300); },
    duw: () => toon(140, 0.05, 'triangle', 0.03),
    klaar: () => [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => toon(f, 0.14, 'square', 0.035, null, i * 0.12)),
  };

  // ------------------------------------------------------------ invoer
  const toets = {}, nieuwGedrukt = new Set();
  const naam = (e) => e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const SPEL = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
  let verderActie = null;
  addEventListener('keydown', (e) => {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    const k = naam(e);
    if (SPEL.includes(e.key)) e.preventDefault();
    if (!toets[k]) nieuwGedrukt.add(k);
    toets[k] = true;
    if ((k === 'Enter' || k === ' ') && verderActie) { const f = verderActie; verderActie = null; f(); return; }
    if (k === 'm') { S.geluid = !S.geluid; bewaar(); melding(S.geluid ? '🔊 geluid aan' : '🔇 geluid uit'); }
    if ((k === 'p' || k === 'Escape') && actief) pauzeer();
  });
  addEventListener('keyup', (e) => { toets[naam(e)] = false; });
  addEventListener('blur', () => { for (const k in toets) toets[k] = false; if (actief && !pauze) pauzeer(); });
  const links = () => toets.ArrowLeft || toets.a || toets.q, rechts = () => toets.ArrowRight || toets.d;
  const op = () => toets.ArrowUp || toets.w || toets.z, neer = () => toets.ArrowDown || toets.s;
  const gedrukt = (...ks) => ks.some(k => nieuwGedrukt.has(k));

  // ------------------------------------------------------------ deeltjes en tekstjes (in wereldcoördinaten)
  let deeltjes = [], popups = [];
  function explosie(x, y, kleur, n = 24, kracht = 200, groot = 3, zwaarte = 0) {
    for (let i = 0; i < n; i++) { const h = rand(0, 6.283), v = rand(0.2, 1) * kracht; deeltjes.push({ x, y, vx: Math.cos(h) * v, vy: Math.sin(h) * v, t: rand(0.4, 0.9), t0: 0.9, r: rand(1, groot), k: kleur, g: zwaarte }); }
  }
  const popup = (x, y, tekst, kleur = '#fff', groot = 22) => popups.push({ x, y, tekst, kleur, t: 1.2, groot });
  function updDeeltjes(dt) {
    for (const p of deeltjes) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.vx *= 0.97; p.vy *= 0.97; p.t -= dt; }
    deeltjes = deeltjes.filter(p => p.t > 0);
    for (const p of popups) { p.y -= 45 * dt; p.t -= dt; }
    popups = popups.filter(p => p.t > 0);
  }
  function tekenDeeltjes() {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of deeltjes) { ctx.globalAlpha = Math.max(0, p.t / p.t0); ctx.fillStyle = p.k; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
    ctx.restore(); ctx.globalAlpha = 1; ctx.textAlign = 'center';
    for (const p of popups) {
      ctx.globalAlpha = Math.min(1, p.t * 2); ctx.font = `900 ${p.groot}px "Lilita One", "Arial Rounded MT Bold", sans-serif`;
      ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(0,0,0,.65)'; ctx.strokeText(p.tekst, p.x, p.y); ctx.fillStyle = p.kleur; ctx.fillText(p.tekst, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }
  const wisDeeltjes = () => { deeltjes = []; popups = []; };

  // ------------------------------------------------------------ tekenhulp
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  // Antwoordbordje. Een breuk "a/b" wordt als echte breuk getekend.
  function bordje(x, y, tekst, opt = {}) {
    const groot = opt.groot || 22, kleur = opt.kleur || '#ffd23f', achter = opt.achter || 'rgba(20,24,48,.92)';
    const m = String(tekst).match(/^(−?)(\d+)\/(\d+)$/);
    ctx.font = `700 ${groot}px "Atkinson Hyperlegible", "Segoe UI", sans-serif`;
    let w, h;
    if (m) { const kg = groot * 0.85; ctx.font = `700 ${kg}px "Atkinson Hyperlegible", sans-serif`; w = Math.max(ctx.measureText(m[2]).width, ctx.measureText(m[3]).width) + (m[1] ? 18 : 0) + 22; h = kg * 2 + 16; }
    else { w = Math.max(opt.minB || 46, ctx.measureText(tekst).width + 22); h = groot + 16; }
    rr(x - w / 2, y - h / 2, w, h, 10); ctx.fillStyle = achter; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = kleur; ctx.stroke();
    ctx.fillStyle = opt.tekst || '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (m) {
      const kg = groot * 0.85, bx = x + (m[1] ? 7 : 0), bw = Math.max(ctx.measureText(m[2]).width, ctx.measureText(m[3]).width) + 6;
      if (m[1]) ctx.fillText('−', x - bw / 2 - 4, y);
      ctx.fillText(m[2], bx, y - kg * 0.55); ctx.fillText(m[3], bx, y + kg * 0.6);
      ctx.fillRect(bx - bw / 2, y - 1, bw, 2.5);
    } else ctx.fillText(tekst, x, y + 1);
    ctx.textBaseline = 'alphabetic';
    return { w, h };
  }
  // Pi, de hoofdfiguur (zijaanzicht naar rechts; kijk = -1 voor links). Grootte ≈ 40×44 bij schaal 1.
  function tekenPi(x, y, schaal = 1, kijk = 1, stap = 0, opties = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(schaal * kijk, schaal);
    const benen = Math.sin(stap) * 6;
    ctx.strokeStyle = '#2b3a67'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-6, 8); ctx.lineTo(-6 - benen * 0.6, 20); ctx.moveTo(6, 8); ctx.lineTo(6 + benen * 0.6, 20); ctx.stroke();
    ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(-6 - benen * 0.6, 21, 6, 3, 0, 0, 7); ctx.ellipse(6 + benen * 0.6, 21, 6, 3, 0, 0, 7); ctx.fill();
    // lijf
    const g = ctx.createLinearGradient(0, -8, 0, 12); g.addColorStop(0, '#5fd0ff'); g.addColorStop(1, '#2a7fd6');
    ctx.fillStyle = g; rr(-13, -8, 26, 20, 7); ctx.fill(); ctx.strokeStyle = '#173a7a'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#ffd23f'; ctx.font = '900 13px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('π', 0, 7);
    // arm
    ctx.strokeStyle = '#2b3a67'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(4, -2); ctx.lineTo(14, 4 - benen * 0.4); ctx.stroke();
    // hoofd
    const hg = ctx.createLinearGradient(0, -34, 0, -10); hg.addColorStop(0, '#e9f6ff'); hg.addColorStop(1, '#9cc9ea');
    ctx.fillStyle = hg; rr(-15, -34, 30, 25, 10); ctx.fill(); ctx.strokeStyle = '#173a7a'; ctx.stroke();
    ctx.fillStyle = '#10203f'; rr(-8, -28, 22, 13, 6); ctx.fill();
    ctx.fillStyle = opties.ogen || '#6ff7ff'; ctx.beginPath(); ctx.arc(1, -21.5, 3, 0, 7); ctx.arc(9, -21.5, 3, 0, 7); ctx.fill();
    // antenne
    ctx.strokeStyle = '#173a7a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-4, -34); ctx.lineTo(-7, -43); ctx.stroke();
    ctx.fillStyle = '#ff5d8f'; ctx.beginPath(); ctx.arc(-7, -44, 3.5, 0, 7); ctx.fill();
    ctx.restore();
  }
  function tekenHart(x, y, s = 1, kleur = '#ff4d6d') {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = kleur;
    ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-14, -4, -8, -14, 0, -7); ctx.bezierCurveTo(8, -14, 14, -4, 0, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(-5, -6, 2.2, 0, 7); ctx.fill(); ctx.restore();
  }
  function tekenMunt(x, y, t, r = 10) {
    const b = Math.abs(Math.cos(t * 4)) * r;
    ctx.fillStyle = '#ffcf33'; ctx.beginPath(); ctx.ellipse(x, y, Math.max(2, b), r, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 2; ctx.stroke();
    if (b > 5) { ctx.fillStyle = '#b8860b'; ctx.font = `900 ${r}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('π', x, y + 1); ctx.textBaseline = 'alphabetic'; }
  }

  // ------------------------------------------------------------ vragen (makkelijke soorten uit de gewone leerpaden)
  // Snelle werelden (platform, race, shooters): korte opgaven die je snel uitrekent.
  // Het puzzelkasteel (ℚ): daar heb je tijd, dus mag het wat moeilijker.
  const BRON = {
    1: ['getallenleer-n', [[3, 'vergelijk'], [3, 'aflezen'], [4, 'van'], [1, 'log']]],
    2: ['getallenleer-z', [[1, 'plus'], [1, 'min'], [2, 'maal'], [2, 'deel'], [3, 'haakjes'], [3, 'zonder']]],
    3: ['getallenleer-q', [[3, 'vereenvoudig'], [4, 'naarProcent'], [4, 'naarBreuk'], [6, 'som'], [7, 'maal'], [7, 'deel'], [8, 'macht']]],
    4: ['reele-getallen', [[2, 'derde'], [3, 'vereenvoudig'], [3, 'vermenigvuldig'], [6, 'bereken']]],
    5: ['mix', [1, 2, 4]],
  };
  const plat = (t) => W.platteTekst(String(t).replace(/\\dfrac/g, '\\frac')).replace(/\s+/g, ' ').trim();
  const fmt = (x) => W.komma(x).replace(/^-/, '−');
  function fouteGetallen(w, n = 2) {
    const geheel = Number.isInteger(w), c = new Set();
    const kand = geheel ? [w + 1, w - 1, -w, w + 2, w - 2, w + 10, w * 2, w - 10] : [w + 1, w - 1, W.rond(w * 10, 4), W.rond(w / 10, 4), -w];
    for (const k of schud(kand)) { if (k === w || !isFinite(k) || (w >= 0 && k < 0 && !negOk)) continue; c.add(fmt(k)); if (c.size >= n) break; }
    let e = 3; while (c.size < n) { c.add(fmt(w + e)); e += 2; }
    return [...c];
  }
  function fouteBreuken(t, n, aantal = 2) {
    const c = new Set(), juist = brTekst(t, n);
    for (const [a, b] of schud([[t + 1, n], [t, n + 1], [n, t], [-t, n], [t - 1, n], [t * 2, n], [t, n * 2]])) {
      if (!b || b < 0) continue; const s = brTekst(a, b); if (s !== juist) c.add(s); if (c.size >= aantal) break;
    }
    return [...c];
  }
  function brTekst(t, n) { const g = W.ggd(t, n) || 1; t /= g; n /= g; if (n < 0) { t = -t; n = -n; } return n === 1 ? fmt(t) : `${t < 0 ? '−' : ''}${Math.abs(t)}/${n}`; }
  function fouteTeksten(s, aantal = 2) {
    const c = new Set(), toks = [...s.matchAll(/\d+(,\d+)?/g)];
    for (let p = 0; p < 50 && c.size < aantal; p++) {
      if (!toks.length) break;
      const t = kies(toks), g = +t[0].replace(',', '.'), nieuw = kies([g + 1, g - 1, g + 2, g * 2]);
      if (nieuw < 0 || nieuw === g) continue;
      const v = s.slice(0, t.index) + fmt(nieuw) + s.slice(t.index + t[0].length); if (v !== s) c.add(v);
    }
    while (c.size < aantal) c.add(s + ' + 1');
    return [...c];
  }
  function opties(v) {
    const a = v.antw; if (!a) return null;
    let juist, fout;
    if (a.soort === 'getal' && typeof a.waarde === 'number') { const w = a.dec != null ? W.rond(a.waarde, a.dec) : a.waarde; juist = fmt(w); fout = fouteGetallen(w); if (a.na && /%/.test(a.na)) { juist += '%'; fout = fout.map(x => x + '%'); } }
    else if (a.soort === 'V' && typeof a.waarde === 'number') { juist = 'x = ' + fmt(a.waarde); fout = fouteGetallen(a.waarde).map(x => 'x = ' + x); }
    else if (a.soort === 'breuk') { juist = brTekst(a.t, a.n); fout = fouteBreuken(a.t, a.n); }
    else if (a.soort === 'expr') { juist = a.tex ? plat(a.tex) : String(a.expr).replace(/√\((\d+)\)/g, '√$1').replace(/\*/g, '·'); fout = /^\d+$/.test(juist) ? fouteGetallen(+juist) : fouteTeksten(juist); }
    else if (a.soort === 'keuze') {
      const ops = a.opties.map(o => ({ t: plat(o.l), goed: String(o.k) === String(a.juist) }));
      const g = ops.find(o => o.goed); if (!g) return null;
      return schud([g, ...schud(ops.filter(o => !o.goed)).slice(0, 2)]);
    } else return null;
    if (!juist || fout.length < 2 || fout.includes(juist)) return null;
    return schud([{ t: juist, goed: true }, ...fout.slice(0, 2).map(t => ({ t, goed: false }))]);
  }
  const recent = []; let negOk = false;
  function vraag(wereld) {
    let [code, lijst] = BRON[wereld];
    for (let p = 0; p < 80; p++) {
      let c = code, l = lijst;
      negOk = wereld === 2 || wereld === 4;
      if (code === 'mix') { const w = kies(lijst); [c, l] = BRON[w]; negOk = w !== 1; }
      const P = Leerpaden.vind(c); if (!P) continue;
      const [nr, soort] = kies(l), d = P.delen.find(x => x.nr === nr); if (!d || !d.soorten[soort]) continue;
      let v; try { v = d.soorten[soort].gen(); } catch (e) { continue; }
      const sl = v.sleutel || v.tex || v.html; if (recent.includes(sl) && p < 40) continue;
      const o = opties(v); if (!o) continue;
      recent.push(sl); if (recent.length > 30) recent.shift();
      return { v, opdracht: v.opdracht || d.opdracht || 'Bereken.', opties: o };
    }
    return { v: { tex: '2 + 2' }, opdracht: 'Bereken.', opties: schud([{ t: '4', goed: true }, { t: '5', goed: false }, { t: '3', goed: false }]) };
  }
  // Moederschip (finale): een berekening uit ℕ deel 1 met tussenstappen
  function baasVraag() {
    negOk = false;
    const P = Leerpaden.vind('getallenleer-n'), d = P.delen[0];
    for (let p = 0; p < 80; p++) {
      const v = d.soorten.basis.gen(); if (!v.antw || v.antw.soort !== 'getal') continue;
      const st = [].concat(v.uitleg || []).filter(s => typeof s === 'string' && /^\s*=/.test(s) && !/\\text|&/.test(s)).map(s => plat(s.replace(/^\s*=/, '').split('\\quad')[0]));
      if (st.length < 2 || st.length > 4) continue;
      return { tex: v.tex.replace(/=\s*\\;\?\s*$/, ''), stappen: st.map(s => { const juist = s; const fout = /^\d+$/.test(s) ? fouteGetallen(+s) : fouteTeksten(s); return schud([{ t: juist, goed: true }, ...fout.map(t => ({ t, goed: false }))]); }) };
    }
    return null;
  }

  // ------------------------------------------------------------ vraagpaneel
  function toonVraag(q, doel = '') {
    paneel.hidden = false;
    paneel.innerHTML = `<div class="p-icoon">❓</div><div class="p-inhoud"><div class="p-opdracht">${esc(q.opdracht)}</div><div class="p-opgave">${W.opgave(q.v)}</div></div><div class="p-doel">${doel}</div>`;
    W.renderIn(paneel); paneel.classList.remove('flits-goed', 'flits-fout');
  }
  function infoPaneel(icoon, titel, tekst) {
    paneel.hidden = false;
    paneel.innerHTML = `<div class="p-icoon">${icoon}</div><div class="p-inhoud"><div class="p-opdracht">${esc(titel)}</div><div class="p-opgave p-info">${tekst}</div></div>`;
  }
  function flits(goed) { paneel.classList.remove('flits-goed', 'flits-fout'); void paneel.offsetWidth; paneel.classList.add(goed ? 'flits-goed' : 'flits-fout'); }
  let mT = null;
  function melding(t) { let m = document.getElementById('melding'); if (!m) { m = document.createElement('div'); m.id = 'melding'; document.body.appendChild(m); } m.textContent = t; m.hidden = false; clearTimeout(mT); mT = setTimeout(() => { m.hidden = true; }, 1400); }

  // ------------------------------------------------------------ levens, munten, score
  let actief = false, pauze = false, wereldObj = null, schud_ = 0, rood = 0, onkwetsbaar = 0, gameOverBezig = false;
  function munt(x, y) {
    S.munten++; S.score += 10; SFX.munt();
    if (S.munten % 50 === 0) { extraLeven(x, y, '50 MUNTEN: 1UP!'); }
  }
  function extraLeven(x, y, tekst = '+1 LEVEN') { S.levens++; SFX.leven(); if (x != null) popup(x, y - 20, tekst, '#ff7aa2', 24); bewaar(); }
  function goed(x, y, punten = 100) { S.score += punten; SFX.goed(); flits(true); if (x != null) { popup(x, y - 30, '+' + punten, '#4dff9a', 28); explosie(x, y, '#4dff9a', 30, 240); } bewaar(); }
  function verliesLeven() {
    S.levens--; schud_ = 0.35; rood = 0.5; bewaar();
    if (S.levens <= 0 && !gameOverBezig) { gameOverBezig = true; setTimeout(gameOver, 900); return true; }
    return false;
  }
  function fout(x, y) { SFX.fout(); flits(false); if (x != null) { popup(x, y - 30, '−1 ❤', '#ff4d6d', 28); explosie(x, y, '#ff4d6d', 24, 200); } return verliesLeven(); }
  function raak(x, y) { // botsing met een gevaar
    if (onkwetsbaar > 0) return false;
    onkwetsbaar = 1.6; SFX.au(); if (x != null) popup(x, y - 30, '−1 ❤', '#ff4d6d', 26);
    return verliesLeven();
  }

  // ------------------------------------------------------------ HUD (op het canvas)
  const WERELDNAMEN = { 1: 'Wereld ℕ · Natuurland', 2: 'Wereld ℤ · IJsrace', 3: 'Wereld ℚ · Breukenkasteel', 4: 'Wereld ℝ · Robotfabriek', 5: 'Finale · De ruimte' };
  function tekenHUD() {
    ctx.save();
    rr(10, 10, 300, 38, 19); ctx.fillStyle = 'rgba(10,14,34,.6)'; ctx.fill();
    tekenHart(32, 30, 1.1); ctx.font = '900 20px "Lilita One", sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText('× ' + S.levens, 46, 37);
    tekenMunt(110, 29, 0, 10); ctx.font = '900 20px "Lilita One", sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.fillText('× ' + S.munten, 126, 37);
    ctx.fillStyle = '#ffd23f'; ctx.fillText(S.score.toLocaleString('nl-BE'), 200, 37);
    const n = WERELDNAMEN[S.wereld] || ''; ctx.font = '900 17px "Lilita One", sans-serif'; const w = ctx.measureText(n).width + 30;
    rr(BW - 10 - w, 10, w, 38, 19); ctx.fillStyle = 'rgba(10,14,34,.6)'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(n, BW - 10 - w / 2, 35);
    ctx.restore();
    if (rood > 0) { ctx.fillStyle = `rgba(255,40,70,${rood * 0.45})`; ctx.fillRect(0, 0, BW, BH); }
  }

  // ------------------------------------------------------------ schermen
  const PI_SVG = (s = 110) => `<svg width="${s}" height="${s * 1.1}" viewBox="-30 -50 60 72" aria-hidden="true"><g stroke="#173a7a" stroke-width="2">
    <line x1="-4" y1="-34" x2="-7" y2="-43"/><circle cx="-7" cy="-44" r="3.5" fill="#ff5d8f"/>
    <rect x="-15" y="-34" width="30" height="25" rx="10" fill="#d9eefc"/><rect x="-10" y="-28" width="20" height="13" rx="6" fill="#10203f" stroke="none"/>
    <circle cx="-4" cy="-21.5" r="3" fill="#6ff7ff" stroke="none"/><circle cx="4" cy="-21.5" r="3" fill="#6ff7ff" stroke="none"/>
    <rect x="-13" y="-8" width="26" height="20" rx="7" fill="#3aa8ef"/><text x="0" y="7" font-size="13" font-weight="900" fill="#ffd23f" stroke="none" text-anchor="middle">π</text>
    <line x1="-6" y1="12" x2="-7" y2="20" stroke="#2b3a67" stroke-width="5" stroke-linecap="round"/><line x1="6" y1="12" x2="7" y2="20" stroke="#2b3a67" stroke-width="5" stroke-linecap="round"/></g></svg>`;
  const SCHURK_SVG = (s = 110) => `<svg width="${s}" height="${s * 1.1}" viewBox="-30 -50 60 72" aria-hidden="true"><g stroke="#2a0a1a" stroke-width="2">
    <path d="M-22 20 L-16 -10 L16 -10 L22 20 Z" fill="#5a1030"/><rect x="-14" y="-38" width="28" height="28" rx="5" fill="#3b3f4f"/>
    <rect x="-11" y="-30" width="22" height="9" rx="3" fill="#ff2d55" stroke="none"/><path d="M-14 -38 L-8 -48 L0 -40 L8 -48 L14 -38 Z" fill="#ffd23f"/>
    <text x="0" y="8" font-size="14" font-weight="900" fill="#ffd23f" stroke="none" text-anchor="middle">∅</text></g></svg>`;
  function scherm(html, verder) {
    laag.innerHTML = `<div class="scherm">${html}</div>`; W.renderIn(laag);
    const el = laag.firstElementChild;
    if (verder) { const b = el.querySelector('[data-verder]'); if (b) b.onclick = () => { verderActie = null; verder(); }; setTimeout(() => { verderActie = verder; }, 350); }
    return el;
  }
  const wisScherm = () => { laag.innerHTML = ''; verderActie = null; };

  const VERHAAL = {
    intro: { wie: 'schurk', titel: 'Het Grote Getallenkristal is gebroken!', tekst: 'De Chaosgeneraal heeft het Getallenkristal in vier stukken geslagen: <b>ℕ</b>, <b>ℤ</b>, <b>ℚ</b> en <b>ℝ</b>. Zonder kristal valt alle wiskunde in het heelal uit elkaar…<br><br><b>Pi</b>, het kleine onderzoeksrobotje, springt in de teleporter. Help Pi de vier stukken terug te vinden!' },
    1: { wie: 'pi', titel: 'Wereld ℕ — Natuurland', tekst: 'Pi belandt in een groene wereld vol natuurlijke getallen. Loop, spring en verzamel munten. <b>Muren met een ?</b> gaan open als je <b>tegen het blok met het juiste antwoord springt</b> (van onderen!). Spring op de slijmpjes om ze plat te drukken.', besturing: '<kbd>←</kbd> <kbd>→</kbd> lopen · <kbd>spatie</kbd> of <kbd>↑</kbd> springen' },
    2: { wie: 'pi', titel: 'Wereld ℤ — De IJsrace', tekst: 'Het stuk ℤ ligt aan het einde van een bevroren racecircuit. Rijd met de racewagen door de <b>poort met het juiste antwoord</b>. Ontwijk de ijsblokken en pak de munten!', besturing: '<kbd>←</kbd> <kbd>→</kbd> sturen · <kbd>↓</kbd> remmen (meer tijd om na te denken)' },
    3: { wie: 'pi', titel: 'Wereld ℚ — Het Breukenkasteel', tekst: 'In het kasteel zitten de deuren op slot. <b>Duw het blok met het juiste antwoord op het gouden slot</b>, dan gaat de deur open. Zit een blok vast? Druk op <kbd>R</kbd> om de kamer opnieuw te beginnen.', besturing: '<kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> lopen en duwen · <kbd>R</kbd> kamer herstarten' },
    4: { wie: 'pi', titel: 'Wereld ℝ — De Robotfabriek', tekst: 'Het laatste stuk ligt diep in de robotfabriek van de Chaosgeneraal. Een deur gaat open als je <b>de robot met het juiste antwoord</b> uitschakelt. Pas op voor de rondvliegende <b>bugs</b>: schiet ze neer voor munten!', besturing: '<kbd>←</kbd> <kbd>→</kbd> draaien · <kbd>↑</kbd> <kbd>↓</kbd> wandelen · <kbd>spatie</kbd> schieten' },
    5: { wie: 'schurk', titel: 'Finale — De Chaosgeneraal vlucht!', tekst: 'Pi heeft alle vier de stukken! Maar de Chaosgeneraal ontsnapt met zijn moederschip. Pi springt in een ruimteschip… <b>Schiet het juiste antwoord</b> en kraak daarna het schild van het moederschip <b>stap voor stap</b>.', besturing: '<kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> vliegen · <kbd>spatie</kbd> schieten' },
  };
  const KRISTAL = { 1: ['ℕ', '#3ddc84'], 2: ['ℤ', '#5bc8ff'], 3: ['ℚ', '#ffb020'], 4: ['ℝ', '#b07cff'] };

  function verhaal(sleutel, verder) {
    const v = VERHAAL[sleutel];
    paneel.hidden = true;
    scherm(`<div class="verhaal"><div class="figuur">${v.wie === 'schurk' ? SCHURK_SVG(120) : PI_SVG(120)}</div><div>
      <h2>${v.titel}</h2><p>${v.tekst}</p>${v.besturing ? `<p class="besturing">${v.besturing}</p>` : ''}
      <button class="knop" data-verder>${sleutel === 'intro' ? 'Op avontuur! ▶' : 'Start ▶'}</button> <span class="hint"><kbd>Enter</kbd></span></div></div>`, verder);
  }

  // ------------------------------------------------------------ werelden en spelverloop
  const WERELDEN = {}; // gevuld door w1…w5: { start(K), update(dt), teken(), stop() }
  function startWereld(n) {
    S.wereld = n; bewaar(); wisDeeltjes(); gameOverBezig = false; onkwetsbaar = 0;
    verhaal(n, () => {
      wisScherm(); actief = true; pauze = false;
      wereldObj = WERELDEN[n]; wereldObj.start();
    });
  }
  function wereldKlaar() {
    if (!actief) return;
    actief = false; SFX.klaar(); S.werelden[S.wereld] = true; S.score += 500 + S.levens * 50; bewaar();
    if (window.SpelVolg) SpelVolg.resultaat({ juist: 1, totaal: 1, wereld: S.wereld, levens: S.levens, munten: S.munten, score: S.score });
    paneel.hidden = true;
    const n = S.wereld, kr = KRISTAL[n];
    setTimeout(() => {
      if (n === 5) return einde();
      scherm(`<div style="text-align:center"><div class="kristal" style="--k:${kr[1]}">${kr[0]}</div>
        <h2>Kristalstuk ${kr[0]} gevonden!</h2><p>${['', 'Natuurland', 'De IJsrace', 'Het Breukenkasteel', 'De Robotfabriek'][n]} is gered. Bonus: <b>+${500 + S.levens * 50}</b> punten.</p>
        <div class="kristallen">${[1, 2, 3, 4].map(i => `<span class="${S.werelden[i] ? 'aan' : ''}" style="--k:${KRISTAL[i][1]}">${KRISTAL[i][0]}</span>`).join('')}</div>
        <button class="knop" data-verder>Verder naar ${n < 4 ? 'wereld ' + KRISTAL[n + 1][0] : 'de finale'} ▶</button></div>`, () => { wisScherm(); startWereld(n + 1); });
    }, 1200);
  }
  function gameOver() {
    actief = false; if (wereldObj && wereldObj.stop) wereldObj.stop(); paneel.hidden = true;
    S.levens = 5; bewaar();
    scherm(`<div style="text-align:center"><div style="font-size:64px">😵</div><h2>Game over…</h2>
      <p>Geen nood: Pi krijgt <b>5 nieuwe levens</b> en begint opnieuw aan ${esc(WERELDNAMEN[S.wereld])}. Je munten en score blijven bewaard.</p>
      <button class="knop" data-verder>Opnieuw proberen ▶</button></div>`, () => { wisScherm(); startWereld(S.wereld); });
  }
  function einde() {
    S.voltooid++; if (S.score > S.best) S.best = S.score; bewaar();
    scherm(`<div style="text-align:center"><div class="kristallen groot">${[1, 2, 3, 4].map(i => `<span class="aan" style="--k:${KRISTAL[i][1]}">${KRISTAL[i][0]}</span>`).join('')}</div>
      <h2>Het Getallenkristal is hersteld! 🎉</h2><p>Proficiat, <b>${esc(S.naam)}</b>! Pi en de wiskunde van het heelal zijn gered.</p>
      <p>Score: <b>${S.score.toLocaleString('nl-BE')}</b> · munten: <b>${S.munten}</b> · record: <b>${S.best.toLocaleString('nl-BE')}</b></p>
      <button class="knop" data-verder>Opnieuw spelen ▶</button></div>`, () => { S.wereld = 1; S.levens = 5; S.munten = 0; S.score = 0; S.werelden = {}; bewaar(); wisScherm(); startScherm(); });
    for (let i = 0; i < 10; i++) setTimeout(() => explosie(rand(100, BW - 100), rand(80, BH - 160), kies(['#3ddc84', '#5bc8ff', '#ffb020', '#b07cff', '#ff5d8f']), 40, 260), i * 300);
  }
  function startScherm() {
    actief = false; wereldObj = null; paneel.hidden = true;
    const bezig = S.naam && (S.wereld > 1 || Object.keys(S.werelden).length);
    const el = scherm(`<div class="start"><div class="figuur zweef">${PI_SVG(130)}</div><div>
      <div class="logo">Pi's Getallen&shy;avontuur</div>
      <p class="sub">Vier werelden · één kristal · wiskunde 7VJHO</p>
      <div class="veld"><label for="nm"><b>Hoe heet je?</b></label><input id="nm" maxlength="20" value="${esc(S.naam)}" placeholder="Je voornaam" autocomplete="off"></div>
      <div class="rij"><button class="knop" id="go">${bezig ? `Verder spelen (${esc(WERELDNAMEN[S.wereld].split(' · ')[0])}) ▶` : 'Start ▶'}</button>${bezig ? '<button class="knop licht" id="opnieuw">Opnieuw beginnen</button>' : ''}</div>
      <p class="hint" id="warn"></p>${S.best ? `<p class="hint">Record: ${S.best.toLocaleString('nl-BE')} punten · ${S.voltooid}× uitgespeeld</p>` : ''}</div></div>`);
    const inp = el.querySelector('#nm'); setTimeout(() => inp.focus(), 50);
    const ga = (vanaf) => {
      const n = inp.value.trim(); if (!n) { el.querySelector('#warn').textContent = 'Typ eerst je naam.'; inp.focus(); return; }
      S.naam = n; S.runs++;
      if (vanaf === 1) { S.wereld = 1; S.levens = 5; S.munten = 0; S.score = 0; S.werelden = {}; }
      if (S.levens <= 0) S.levens = 5;
      bewaar(); wisScherm();
      if (vanaf === 1 || !bezig) verhaal('intro', () => startWereld(1)); else startWereld(S.wereld);
    };
    el.querySelector('#go').onclick = () => ga(bezig ? 0 : 1);
    if (bezig) el.querySelector('#opnieuw').onclick = () => ga(1);
    inp.onkeydown = (e) => { if (e.key === 'Enter') ga(bezig ? 0 : 1); };
  }
  function pauzeer() {
    if (!actief || pauze) return; pauze = true;
    scherm(`<div style="text-align:center"><h2>⏸ Pauze</h2><p class="hint"><kbd>P</kbd> of <kbd>Enter</kbd> om verder te spelen · <kbd>M</kbd> geluid ${S.geluid ? 'uit' : 'aan'}</p>
      <button class="knop" data-verder>Verder ▶</button></div>`, hervat);
  }
  function hervat() { wisScherm(); pauze = false; }
  addEventListener('keydown', (e) => { if ((e.key === 'p' || e.key === 'P') && pauze && laag.innerHTML.includes('Pauze') && verderActie === null) hervat(); });

  // ------------------------------------------------------------ hoofdlus
  let vorige = performance.now(), tijd = 0;
  function lus(nu) {
    const dt = Math.min(0.033, (nu - vorige) / 1000); vorige = nu;
    requestAnimationFrame(lus); // eerst: een fout in één beeldje mag het spel nooit laten bevriezen
    try {
      if (actief && !pauze && wereldObj) { tijd += dt; onkwetsbaar = Math.max(0, onkwetsbaar - dt); wereldObj.update(dt); updDeeltjes(dt); }
      else updDeeltjes(dt);
    } catch (e) { console.error('update', e); }
    schud_ = Math.max(0, schud_ - dt); rood = Math.max(0, rood - dt);
    ctx.save();
    try {
      if (schud_ > 0) ctx.translate(rand(-5, 5) * schud_ * 3, rand(-5, 5) * schud_ * 3);
      if (wereldObj) wereldObj.teken(); else achtergrondStart(dt);
    } catch (e) { console.error('teken', e); }
    ctx.restore();
    if (wereldObj) tekenHUD();
    else tekenDeeltjesScherm();
    nieuwGedrukt.clear();
  }
  // achtergrond van het startscherm: sterrenhemel met vallende getallen
  const zw = Array.from({ length: 40 }, () => ({ x: rand(0, BW), y: rand(0, BH), v: rand(15, 50), t: kies(['ℕ', 'ℤ', 'ℚ', 'ℝ', 'π', '√', '%', '½', '∞', '7', '3', '−2', '¾']), r: rand(14, 30), a: rand(0.1, 0.35) }));
  function achtergrondStart(dt) {
    const g = ctx.createLinearGradient(0, 0, 0, BH); g.addColorStop(0, '#1a1050'); g.addColorStop(1, '#3a1a6a'); ctx.fillStyle = g; ctx.fillRect(0, 0, BW, BH);
    ctx.textAlign = 'center';
    for (const z of zw) { z.y += z.v * dt; if (z.y > BH + 30) { z.y = -30; z.x = rand(0, BW); } ctx.globalAlpha = z.a; ctx.fillStyle = '#fff'; ctx.font = `900 ${z.r}px "Lilita One", sans-serif`; ctx.fillText(z.t, z.x, z.y); }
    ctx.globalAlpha = 1;
  }
  function tekenDeeltjesScherm() { tekenDeeltjes(); }

  function begin() { startScherm(); requestAnimationFrame(lus); }

  return {
    BW, BH, ctx, rand, kies, schud, klem, rr, bordje, tekenPi, tekenHart, tekenMunt, explosie, popup, tekenDeeltjes, wisDeeltjes,
    toets, links, rechts, op, neer, gedrukt, SFX, vraag, baasVraag, toonVraag, infoPaneel, melding,
    munt, extraLeven, goed, fout, raak, wereldKlaar, WERELDEN, begin,
    get onkwetsbaar() { return onkwetsbaar; }, set onkwetsbaar(v) { onkwetsbaar = v; },
    get actief() { return actief; }, get S() { return S; }, schud: (t) => { schud_ = Math.max(schud_, t); }, schudLijst: schud,
    _test: { startWereld, get wereld() { return wereldObj; } },
  };
})();
