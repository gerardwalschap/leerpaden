// ===================================================================
//  STATISTIEK (7VJHO) — gedeelde hulpfuncties
//  Leidraad: cursus 3.2 Statistiek, PWP's en werkbladen 3.2.1 Steekproeven,
//  3.2.2 Gegevens verwerken en 3.2.3 De normale verdeling (G. Walschap).
//  Procenten: altijd met een verhoudingstabel (N is 100 %, …).
//  Afspraak: gemiddelde, standaardafwijking en procenten op 1 decimaal.
// ===================================================================
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(x, d);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const keuze = (opties, juist, extra = {}) => ({ soort: 'keuze', opties, juist: String(juist), ...extra });
const kT = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const kTex = (texen) => texen.map((t, i) => ({ k: String(i), l: t }));
const kZin = (zinnen) => zinnen.map((t, i) => ({ k: String(i), l: t, html: true }));
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tekst = (x, d = null) => W.komma(x, d);
function uniekKeuze(juist, fout, maak = kTex, n = 4) {
  const u = [juist]; for (const f of fout) if (!u.includes(f) && u.length < n) u.push(f);
  const s = schud(u); return keuze(maak(s), s.indexOf(juist));
}
const zinKeuze = (juist, fout, n = 4) => { const k = uniekKeuze(juist, fout, kZin, n); k.lijst = true; return k; };
const pct = (waarde, extra = {}) => getal(waarde, { na: '\\%', ...extra });
const r1 = (x) => W.rond(x, 1);
const ex = (x) => Math.abs(W.rond(x, 1) - x) < 1e-9;                    // exact op 1 decimaal?
const ongeveer = (x) => ex(x) ? '=' : '\\approx';

// procent met een verhoudingstabel: k van N
function pctUitleg(k, N, eenh = '') {
  const p = 100 * k / N, e = eenh ? `\\text{ ${eenh}}` : '';
  if (N % k === 0 && N !== k) return [`${N}${e} \\text{ is } 100\\,\\%`, `${N} : ${N / k} = ${k} \\text{, dus } 100\\,\\% : ${N / k} ${ongeveer(p)} ${tg(r1(p))}\\,\\%`];
  if (100 % N === 0) return [`${N}${e} \\text{ is } 100\\,\\%`, `\\text{dus 1 is } ${100 / N}\\,\\% \\text{ en } ${k} \\text{ is } ${k} \\cdot ${100 / N}\\,\\% = ${tg(r1(p))}\\,\\%`];
  if (N % 100 === 0) return [`${N}${e} \\text{ is } 100\\,\\%`, `\\text{dus } ${N / 100} \\text{ is } 1\\,\\% \\text{ en } ${k} \\text{ is } ${k} : ${N / 100} ${ongeveer(p)} ${tg(r1(p))}\\,\\%`];
  return [`${N}${e} \\text{ is } 100\\,\\%`, `\\text{dus 1 is } 100\\,\\% : ${N} \\text{ en } ${k} \\text{ is } ${k} \\cdot (100\\,\\% : ${N}) ${ongeveer(p)} ${tg(r1(p))}\\,\\%`];
}

// ---- statistiek -----------------------------------------------------------------------------------
const som = (a) => a.reduce((x, y) => x + y, 0);
const gem = (a) => som(a) / a.length;
const stdevS = (a) => { const m = gem(a); return Math.sqrt(som(a.map(x => (x - m) ** 2)) / (a.length - 1)); };
// standaardnormale verdelingsfunctie (Abramowitz-Stegun 26.2.17, fout < 1e-7)
function Phi(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989422804014327 * Math.exp(-z * z / 2);
  const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - p : p;
}
const normVerd = (a, m, s) => Phi((a - m) / s);
// normaal verdeeld toevalsgetal (Box-Muller)
const normRnd = (m, s) => { let u = 0; while (!u) u = Math.random(); return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };

// ---- tabellen (HTML) --------------------------------------------------------------------------------
function htmlTabel(rijen, kop = true) {
  return `<div class="tabelwrap" style="display:flex;justify-content:center"><table class="tabel">${rijen.map((r, i) => `<tr>${r.map((c, j) => (i === 0 && kop) ? `<th class="midden">${c}</th>` : `<td class="midden">${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
}
function gegevensTabel(data, perRij = 10) {
  const rijen = []; for (let i = 0; i < data.length; i += perRij) rijen.push(data.slice(i, i + perRij).map(x => tekst(x)));
  return htmlTabel(rijen, false);
}
const klasTekst = (a, b) => `[${tekst(a)}; ${tekst(b)}[`;
const klasTex = (a, b) => `[${tg(a)};\\, ${tg(b)}[`;

const BLAUW = '#1c4e8a', ORANJE = '#e8772e', GROEN = '#2e7d4f', PAARS = '#8e44ad', GRIJS = '#555';
const svgOpen = (w, h, label) => `<div class="figuur"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="font-family:Verdana,sans-serif;max-width:100%;height:auto">`;
const svgDicht = '</svg></div>';
const num = (v) => tekst(v).replace(/^-/, '−');

// ---- histogram (SVG): grenzen [g0, g1, …, gk], freq [f1 … fk] ----------------------------------------------
function histogram(grenzen, freq, opt = {}) {
  const W0 = opt.breed || 380, H0 = opt.hoog || 200, ml = 40, mb = 40, mt = 14, mr = 14;
  const k = freq.length, fmax = Math.max(...freq), ystap = opt.ystap || (fmax <= 6 ? 1 : fmax <= 12 ? 2 : fmax <= 30 ? 5 : fmax <= 60 ? 10 : 20);
  const ytop = Math.ceil(fmax / ystap) * ystap, bw = W0 / k;
  const X = (i) => ml + i * bw, Y = (f) => mt + H0 - (f / ytop) * H0;
  let g = '';
  for (let y = 0; y <= ytop; y += ystap) g += `<line x1="${ml}" y1="${Y(y)}" x2="${ml + W0}" y2="${Y(y)}" stroke="#e3e7ee"/><text x="${ml - 5}" y="${Y(y) + 4}" font-size="11" text-anchor="end" fill="${GRIJS}">${y}</text>`;
  freq.forEach((f, i) => { g += `<rect x="${X(i)}" y="${Y(f)}" width="${bw}" height="${Y(0) - Y(f)}" fill="${opt.kleur || '#aed6f1'}" stroke="${BLAUW}" stroke-width="1.4"/>`; if (opt.waarden) g += `<text x="${X(i) + bw / 2}" y="${Y(f) - 4}" font-size="11" text-anchor="middle" fill="#1f2733">${f}</text>`; });
  if (opt.labels !== false) grenzen.forEach((b, i) => { if (!opt.elkeTweede || i % 2 === 0) g += `<text x="${X(i)}" y="${Y(0) + 15}" font-size="11" text-anchor="middle" fill="#1f2733">${num(b)}</text>`; });
  g += `<line x1="${ml}" y1="${Y(0)}" x2="${ml + W0 + 6}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.3"/><line x1="${ml}" y1="${Y(0)}" x2="${ml}" y2="${mt - 4}" stroke="#1f2733" stroke-width="1.3"/>`;
  if (opt.xn) g += `<text x="${ml + W0 / 2}" y="${Y(0) + 33}" font-size="12" text-anchor="middle" fill="#1f2733">${opt.xn}</text>`;
  if (opt.yn !== false) g += `<text x="12" y="${mt + H0 / 2}" font-size="11" text-anchor="middle" fill="${GRIJS}" transform="rotate(-90 12 ${mt + H0 / 2})">${opt.yn || 'aantal'}</text>`;
  if (opt.titel) g += `<text x="${ml + 4}" y="${mt + 12}" font-size="13" font-weight="bold" fill="${ORANJE}">${opt.titel}</text>`;
  return `${svgOpen(ml + W0 + mr, mt + H0 + mb, 'histogram')}${g}${svgDicht}`;
}
// frequenties van gegevens in klassen [g0 + i·w; g0 + (i+1)·w[
const telKlassen = (data, g0, w, k) => Array.from({ length: k }, (_, i) => data.filter(x => x >= g0 + i * w && x < g0 + (i + 1) * w).length);

// ---- stippendiagram (SVG): punten op 20 -----------------------------------------------------------------
function stippen(data, titel, min = 0, max = 20) {
  const w = 400, x0 = 24, u = (w - 2 * x0) / (max - min), y0 = 112;
  const X = (v) => x0 + (v - min) * u;
  let g = `<line x1="${x0 - 6}" y1="${y0}" x2="${w - x0 + 6}" y2="${y0}" stroke="#1f2733" stroke-width="1.3"/>`;
  for (let v = min; v <= max; v++) g += `<line x1="${X(v)}" y1="${y0}" x2="${X(v)}" y2="${y0 + 5}" stroke="#1f2733"/>${v % 2 === 0 ? `<text x="${X(v)}" y="${y0 + 18}" font-size="10" text-anchor="middle" fill="${GRIJS}">${v}</text>` : ''}`;
  const tel = {};
  for (const v of data) { tel[v] = (tel[v] || 0) + 1; g += `<circle cx="${X(v)}" cy="${y0 - 6 - (tel[v] - 1) * 10}" r="4.2" fill="${BLAUW}"/>`; }
  g += `<text x="${x0}" y="16" font-size="13" font-weight="bold" fill="${ORANJE}">${titel}</text>`;
  return `${svgOpen(w, 128, 'stippendiagram')}${g}${svgDicht}`;
}

// ---- normale kromme(n) (SVG) -----------------------------------------------------------------------------
// krommen: [{m, s, kleur?, label?}] · opt.as: [min, max] · opt.ticks: [{v, l?}] · opt.kleur: [a, b] (gekleurd gebied) · opt.buig: true
function kromme(krommen, opt = {}) {
  const k0 = krommen[0], [A0, A1] = opt.as || [k0.m - 3.6 * k0.s, k0.m + 3.6 * k0.s];
  const w = opt.breed || 440, h = opt.hoog || 190, ml = 16, mr = 16, mt = 18, mb = opt.ticks ? 40 : 24, B = w - ml - mr;
  const X = (x) => ml + (x - A0) / (A1 - A0) * B;
  const pdf = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / s;
  const pmax = Math.max(...krommen.map(c => pdf(c.m, c.m, c.s)));
  const Y = (p) => mt + h - (p / pmax) * h * 0.95;
  let g = '';
  if (opt.hist) { // histogram onder de kromme (klassen van breedte opt.hist), zelfde schaal als de kromme
    const c = k0, w = opt.hist;
    for (let a = Math.ceil(A0 / w) * w; a + w <= A1; a += w) {
      const hgt = (normVerd(a + w, c.m, c.s) - normVerd(a, c.m, c.s)) / w * Math.sqrt(2 * Math.PI);
      g += `<rect x="${X(a).toFixed(1)}" y="${Y(hgt).toFixed(1)}" width="${(X(a + w) - X(a)).toFixed(1)}" height="${(Y(0) - Y(hgt)).toFixed(1)}" fill="#aed6f1" stroke="${BLAUW}" stroke-width="0.8" opacity="0.8"/>`;
    }
  }
  if (opt.kleur) {
    const [a, b] = opt.kleur, c = k0, aa = Math.max(a, A0), bb = Math.min(b, A1), pts = [];
    for (let i = 0; i <= 120; i++) { const x = aa + (bb - aa) * i / 120; pts.push(`${X(x).toFixed(1)},${Y(pdf(x, c.m, c.s)).toFixed(1)}`); }
    g += `<path d="M${X(aa).toFixed(1)},${Y(0)} L${pts.join(' L')} L${X(bb).toFixed(1)},${Y(0)} Z" fill="${ORANJE}" fill-opacity="0.35"/>`;
  }
  for (const c of krommen) {
    const pts = []; for (let i = 0; i <= 240; i++) { const x = A0 + (A1 - A0) * i / 240; pts.push(`${X(x).toFixed(1)},${Y(pdf(x, c.m, c.s)).toFixed(1)}`); }
    g += `<path d="M${pts.join(' L')}" fill="none" stroke="${c.kleur || BLAUW}" stroke-width="2.4"/>`;
    if (c.label) g += `<text x="${X(c.m) + 6}" y="${Y(pdf(c.m, c.m, c.s)) - 4}" font-size="15" font-weight="bold" fill="${c.kleur || BLAUW}">${c.label}</text>`;
    if (opt.buig) for (const x of [c.m - c.s, c.m + c.s]) g += `<circle cx="${X(x)}" cy="${Y(pdf(x, c.m, c.s))}" r="4.5" fill="${ORANJE}"/><line x1="${X(x)}" y1="${Y(pdf(x, c.m, c.s))}" x2="${X(x)}" y2="${Y(0)}" stroke="${ORANJE}" stroke-dasharray="4 3"/>`;
    if (opt.top) g += `<line x1="${X(c.m)}" y1="${Y(pdf(c.m, c.m, c.s))}" x2="${X(c.m)}" y2="${Y(0)}" stroke="${GRIJS}" stroke-dasharray="4 3"/>`;
  }
  g += `<line x1="${ml - 6}" y1="${Y(0)}" x2="${w - mr + 6}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.4"/>`;
  for (const t of opt.ticks || []) {
    g += `<line x1="${X(t.v)}" y1="${Y(0) - 4}" x2="${X(t.v)}" y2="${Y(0) + 4}" stroke="#1f2733" stroke-width="1.4"/><text x="${X(t.v)}" y="${Y(0) + 17}" font-size="11" text-anchor="middle" fill="#1f2733">${t.l ?? num(t.v)}</text>`;
    if (t.l2) g += `<text x="${X(t.v)}" y="${Y(0) + 31}" font-size="10" text-anchor="middle" fill="${GRIJS}">${t.l2}</text>`;
  }
  for (const p of opt.procenten || []) g += `<text x="${X(p.x)}" y="${p.y ? Y(p.y) : Y(0) - 8}" font-size="11" font-weight="bold" text-anchor="middle" fill="${PAARS}">${p.t}</text>`;
  return `${svgOpen(w, mt + h + mb, 'normale kromme')}${g}${svgDicht}`;
}
// ticks x̄ − 3s … x̄ + 3s met waarden
const ticks7 = (m, s, metSymbool = false) => [-3, -2, -1, 0, 1, 2, 3].map(k => ({ v: m + k * s, l: num(W.rond(m + k * s, 6)), l2: metSymbool ? (k === 0 ? 'x̄' : `x̄ ${k < 0 ? '−' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}s`) : undefined }));
// percentages van de 68-95-99,7-regel per gebied tussen −3, −2, −1, 0, 1, 2, 3 (en daarbuiten)
const GEBIED = { '-4': 0.15, '-3': 2.35, '-2': 13.5, '-1': 34, '0': 34, '1': 13.5, '2': 2.35, '3': 0.15 }; // gebied [k, k+1[, -4 = links van −3, 3 = rechts van 3
const regelPct = (ka, kb) => { let p = 0; for (let k = ka; k < kb; k++) p += GEBIED[String(k)]; return W.rond(p, 6); }; // ka, kb ∈ {−4 (= −∞), −3 … 3, 4 (= +∞)}

// ---- rekenblad (js/kern/rekenblad.js) ---------------------------------------------------------------
const rekenblad = (titel, data, rijen, extra = {}) => ({ soort: 'rekenblad', titel, data, rijen, ...extra });
const rijGem = (n) => ({ label: 'gemiddelde', func: ['GEMIDDELDE', 'AVERAGE'], bereik: `A2:A${n + 1}`, formule: `=GEMIDDELDE(A2:A${n + 1})` });
const rijStdev = (n) => ({ label: 'standaardafwijking', func: ['STDEV.S'], bereik: `A2:A${n + 1}`, formule: `=STDEV.S(A2:A${n + 1})` });
const RB_UITLEG = `<div class="kader eig"><div class="kader-titel">Het rekenblad in het leerpad</div>
      <p>Bij sommige vragen krijg je een <b>rekenblad</b> dat werkt zoals Excel. De gegevens staan al in kolom A (in A1 staat de titel). In kolom C typ je een formule die met <b>=</b> begint.
      Onder de cel zie je meteen de uitkomst. De website kijkt je formule na.</p>
      <p class="klein">Tussen de argumenten zet je een puntkomma (;), decimalen schrijf je met een komma. De Engelse namen (AVERAGE, NORM.DIST, TRUE, met komma's en punten) werken ook.
      Dezelfde formules gebruik je in Excel.</p></div>`;

const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
