// ===== Afgeleiden · Wiskunde 5WW / 5BCW =====
// Leidraad: de cursus "6. Afgeleiden" en de PWP "6. Afgeleiden" (G. Walschap).
// Alles grafisch en conceptueel: er worden nergens afgeleiden met rekenregels berekend.
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(x, d);
const kg = (x, d = null) => W.komma(x, d);
const BLAUW = '#1c4e8a', ORANJE = '#e8772e', GROEN = '#2e7d4f', GRIJS = '#9aa3b2';
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
function zinnen(juist, fout, opt = {}) {
  const alle = schud([juist, ...fout.filter((z, i, a) => z && z !== juist && a.indexOf(z) === i).slice(0, opt.max || 3)]);
  return { soort: 'keuze', lijst: opt.lijst !== false, opties: alle.map((z, i) => ({ k: String(i), l: z, html: true })), juist: String(alle.indexOf(juist)) };
}
function figuren(juist, fout) {
  const alle = schud([juist, ...fout].map((l, i) => ({ l, nr: i })));
  return { soort: 'keuze', opties: alle.map((o, i) => ({ k: String(i), l: o.l, html: true, tekst: `grafiek ${'ABCD'[i]}` })), juist: String(alle.findIndex(o => o.nr === 0)) };
}
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: opties.map(o => ({ k: o, l: `\\text{${o}}` })), juist });
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const tx = (s) => '@@' + s;
const r1 = (x) => W.rond(x, 1), r2 = (x) => W.rond(x, 2);
const nul = (v) => (Math.abs(v) < 1e-9 ? 0 : v);
const mk = (v) => (v < 0 ? '−' + kg(-v) : kg(v)); // getal in gewone tekst, met een echt minteken
const exact2 = (w) => Math.abs(w * 100 - Math.round(w * 100)) < 1e-6; // komt exact uit op 2 decimalen?
const gAntw = (w, extra = {}) => exact2(w) ? getal(r2(w), extra) : getal(w, { dec: 2, ...extra });

// ---------- grafieken (SVG): functies, lijnstukken (raaklijnen, secansen) en benoemde punten
function nice(v) { const e = 10 ** Math.floor(Math.log10(v)), r = v / e; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * e; }
function agraf(opt) {
  const [X0, X1] = opt.x, [Y0, Y1] = opt.y;
  const B = opt.breed || 380, H = opt.hoog || 240, ml = opt.klein ? 30 : 44, mr = 14, mt = 14, mb = opt.klein ? 18 : 36;
  const w = ml + B + mr, h = mt + H + mb;
  const X = (x) => ml + (x - X0) / (X1 - X0) * B, Y = (y) => mt + (Y1 - y) / (Y1 - Y0) * H;
  const xs = opt.xs || nice((X1 - X0) / 8), ys = opt.ys || nice((Y1 - Y0) / 7);
  const fs = opt.klein ? 9 : 10, num = (v) => (v < -1e-9 ? '−' : '') + kg(Math.abs(+v.toFixed(6)));
  let g = '';
  for (let k = Math.ceil(X0 / xs - 1e-9) * xs; k <= X1 + 1e-9; k += xs) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>` + (opt.klein && opt.geenX ? '' : `<text x="${X(k)}" y="${Y(Y0) + 13}" font-size="${fs}" text-anchor="middle" fill="#555">${num(k)}</text>`);
  for (let k = Math.ceil(Y0 / ys - 1e-9) * ys; k <= Y1 + 1e-9; k += ys) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>` + (opt.klein ? '' : `<text x="${X(X0) - 4}" y="${Y(k) + 3}" font-size="${fs}" text-anchor="end" fill="#555">${num(k)}</text>`);
  const yAs = Y0 <= 0 && Y1 >= 0 ? Y(0) : Y(Y0), xAs = X0 <= 0 && X1 >= 0 ? X(0) : X(X0);
  g += `<line x1="${X(X0)}" y1="${yAs}" x2="${X(X1)}" y2="${yAs}" stroke="#1f2733" stroke-width="1.2"/><line x1="${xAs}" y1="${Y(Y0)}" x2="${xAs}" y2="${Y(Y1)}" stroke="#1f2733" stroke-width="1.2"/>`;
  if (!opt.klein && opt.xn) g += `<text x="${ml + B / 2}" y="${h - 5}" font-size="11" text-anchor="middle" fill="#333">${opt.xn}</text>`;
  if (!opt.klein && opt.yn) g += `<text x="11" y="${mt + H / 2}" font-size="11" text-anchor="middle" fill="#333" transform="rotate(-90 11 ${mt + H / 2})">${opt.yn}</text>`;
  if (opt.klein && opt.label) g += `<text x="${ml + 4}" y="${mt + 10}" font-size="11" font-style="italic" fill="#333">${opt.label}</text>`;
  let k = '';
  const pad = (f, van, tot, n) => {
    let d = '', aan = false;
    for (let i = 0; i <= n; i++) {
      const x = van + (tot - van) * i / n, y = f(x);
      if (!isFinite(y) || y < Y0 - (Y1 - Y0) || y > Y1 + (Y1 - Y0)) { aan = false; continue; }
      d += `${aan ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)} `; aan = true;
    }
    return d;
  };
  for (const fn of opt.functies || []) k += `<path d="${pad(fn.f, Math.max(fn.van ?? X0, X0), Math.min(fn.tot ?? X1, X1), 500)}" fill="none" stroke="${fn.kleur || BLAUW}" stroke-width="${fn.dun ? 1.6 : opt.klein ? 2 : 2.5}"${fn.streep ? ' stroke-dasharray="6 5"' : ''}/>`;
  for (const s of opt.segs || []) k += `<line x1="${X(s.x1)}" y1="${Y(s.y1)}" x2="${X(s.x2)}" y2="${Y(s.y2)}" stroke="${s.kleur || ORANJE}" stroke-width="${s.dik || 2}"${s.streep ? ' stroke-dasharray="5 4"' : ''}/>`;
  for (const p of opt.punten || []) {
    if (p.x < X0 || p.x > X1 || p.y < Y0 || p.y > Y1) continue;
    const kl = p.kleur || ORANJE;
    k += p.vierkant ? `<rect x="${X(p.x) - 3.5}" y="${Y(p.y) - 3.5}" width="7" height="7" fill="${kl}"/>` : `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4.2" fill="${kl}"/>`;
    if (p.lab) k += `<text x="${X(p.x) + (p.dx ?? 7)}" y="${Y(p.y) + (p.dy ?? -8)}" font-size="13" font-weight="bold" fill="${kl}">${p.lab}</text>`;
  }
  const id = 'a' + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif;max-width:100%;height:auto">
    <defs><clipPath id="${id}"><rect x="${ml}" y="${mt - 2}" width="${B}" height="${H + 4}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${k}</g></svg>`;
}
const figuur = (svg) => `<div class="figuur">${svg}</div>`;
// raaklijn (lijnstuk) in a met rico m, halve lengte d (horizontaal)
const raak = (f, a, m, d = 1.2, kleur = ORANJE) => ({ x1: a - d, y1: f(a) - m * d, x2: a + d, y2: f(a) + m * d, kleur });
// y-bereik van een functie op [a, b], met wat marge
function yBereik(fs, a, b, marge = 0.15) {
  let lo = Infinity, hi = -Infinity;
  for (const f of fs) for (let i = 0; i <= 300; i++) { const y = f(a + (b - a) * i / 300); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
  const m = Math.max((hi - lo) * marge, 0.5);
  return [Math.floor(Math.min(lo - m, -0.5)), Math.ceil(Math.max(hi + m, 0.5))];
}

// ---------- tekenschema's als HTML (rijen: x, f ', f …)
function schema(rijen) {
  return `<table class="tabel tekenschema">${rijen.map(([kop, ...c]) => `<tr><th>${kop}</th>${c.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
}
const OP = '↗', NEER = '↘';
const tk = (v) => (v > 0 ? '+' : v < 0 ? '−' : '0');

// ---------- veeltermen met extrema in gehele getallen
// derdegraads: f '(x) = c(x − u)(x − v), f(x) = c(x³/3 − (u+v)x²/2 + uvx) + d
function kubiek(opt = {}) {
  const u = opt.u ?? rnd(-3, 0), v = u + (opt.dv ?? kies([2, 3, 4])), c = opt.c ?? kies([0.5, 1, -0.5, -1, 0.75, -0.75]);
  const F0 = (x) => c * (x ** 3 / 3 - (u + v) * x ** 2 / 2 + u * v * x);
  const d = opt.d ?? Math.round(-(F0(u) + F0(v)) / 2 + rnd(-1, 1));
  const f = (x) => F0(x) + d, df = (x) => c * (x - u) * (x - v);
  const X = [u - 2, v + 2];
  return { u, v, c, d, f, df, X, Y: yBereik([f], X[0], X[1]), max: c > 0 ? u : v, min: c > 0 ? v : u };
}
// tweedegraads: f(x) = a(x − h)² + k, f '(x) = 2a(x − h)
function kwadr(opt = {}) {
  const a = opt.a ?? kies([0.5, 1, -0.5, -1]), h = opt.h ?? rnd(-2, 2), k = opt.k ?? rnd(-2, 3);
  return { a, h, k, f: (x) => a * (x - h) ** 2 + k, df: (x) => 2 * a * (x - h), X: [h - 4, h + 4] };
}
const kaal = (f, X, Y, label, kleur) => agraf({ x: X, y: Y, functies: [{ f, kleur }], klein: true, breed: 230, hoog: 150, xs: 1, ys: nice((Y[1] - Y[0]) / 6), label });

// ---------- woorden met uitleg (oranje stippellijn)
const WOORDEN = [
  ['differentiequotiënt', 'De gemiddelde veranderingssnelheid Δf : Δx tussen twee punten.'],
  ['veranderingssnelheid', 'Hoe snel een grootheid verandert (bv. in °C per uur).'],
  ['secans', 'Een rechte door twee punten van een grafiek.'],
  ['raaklijn', 'De rechte die de grafiek in één punt raakt: de grensstand van de secans.'],
  ['richtingscoëfficiënt', 'De rico van een rechte: hoeveel y verandert als x met 1 toeneemt.'],
  ['ogenblikkelijke', 'Op één bepaald moment, niet gemiddeld over een periode.'],
  ['limiet', 'De waarde waar een grootheid naartoe nadert.'],
  ['extremum', 'Een top (maximum) of een dal (minimum) van de grafiek.'],
  ['extrema', 'Toppen en dalen van de grafiek.'],
  ['verloopschema', 'Een schema dat toont waar een functie stijgt, daalt en een extremum heeft.'],
  ['mindfulnesssessie', 'Een oefensessie om tot rust te komen en bewust aandacht te geven.'],
  ['concentratie', 'Hoeveel van een stof in een bepaalde hoeveelheid bloed zit (hier in mg/l).'],
  ['verpleegkundige', 'Iemand die zieke mensen verzorgt.'],
  ['dagcentrum', 'Een centrum waar mensen overdag opvang en begeleiding krijgen.'],
  ['begeleider', 'Iemand die mensen ondersteunt en opvolgt.'],
].sort((p, q) => q[0].length - p[0].length);
function woorden(html) {
  if (!html || typeof html !== 'string' || html.includes('class="woord"')) return html;
  const gebruikt = new Set(), tokens = [];
  const stukken = html.split(/(<svg[\s\S]*?<\/svg>|<code>[\s\S]*?<\/code>|<table class="tabel tekenschema"[\s\S]*?<\/table>|<span class="woord"[\s\S]*?<\/span><\/span>|<[^>]+>|\$\$[\s\S]*?\$\$|\$[^$]*\$)/);
  const vervang = (tekst) => {
    for (const [w, uitleg] of WOORDEN) {
      if (gebruikt.has(uitleg)) continue;
      const re = new RegExp(`(^|[^\\p{L}])(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![\\p{L}])`, 'iu');
      const m = tekst.match(re); if (!m) continue;
      gebruikt.add(uitleg);
      tokens.push(`<span class="woord" tabindex="0">${m[2]}<span class="woord-uitleg">${uitleg}</span></span>`);
      tekst = tekst.slice(0, m.index) + m[1] + `\u0001${tokens.length - 1}\u0002` + tekst.slice(m.index + m[0].length);
    }
    return tekst;
  };
  return stukken.map((s, i) => (i % 2 ? s : vervang(s))).join('').replace(/\u0001(\d+)\u0002/g, (m, k) => tokens[+k]);
}
const STIJL = `
.woord{border-bottom:2px dotted #e8772e;cursor:help;position:relative;outline:none}
.woord .woord-uitleg{display:none;position:absolute;left:0;top:1.5em;z-index:30;width:250px;background:#fffbe6;border:1px solid #e8c36a;border-radius:6px;padding:6px 8px;font-size:13px;line-height:1.4;color:#1f2733;font-weight:normal;font-style:normal;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.woord:hover .woord-uitleg,.woord:focus .woord-uitleg{display:block}
.vraagzin{margin-top:12px;font-size:16px}
.tekenschema td,.tekenschema th{text-align:center;min-width:44px}
`;
if (typeof document !== 'undefined' && document.head && !document.getElementById('afg-stijl')) { const st = document.createElement('style'); st.id = 'afg-stijl'; st.textContent = STIJL; document.head.appendChild(st); }

const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraken in dit leerpad</div>
  <ul><li>Je moet in dit hoofdstuk <b>nooit</b> een afgeleide met een formule berekenen: je werkt met grafieken, raaklijnen en de betekenis.</li>
  <li>Kommagetallen typ je met een komma: <code>0,45</code>. Een negatief getal met een minteken: <code>-2</code>.</li>
  <li>Een woord met een <span style="border-bottom:2px dotted #e8772e">oranje stippellijn</span> eronder is een moeilijk woord: raak het aan voor de uitleg.</li></ul></div>`;
const VERBAND = `<div class="kader eig"><div class="kader-titel">Het verband tussen f en f '</div>
  <table class="tabel"><tr><th>Verloop van f</th><th>Teken van f '</th><th>Raaklijn</th></tr>
  <tr><td>f stijgt ${OP}</td><td>$f'(x) > 0$</td><td>rico positief</td></tr>
  <tr><td>f daalt ${NEER}</td><td>$f'(x) < 0$</td><td>rico negatief</td></tr>
  <tr><td>f heeft een extremum (top of dal)</td><td>$f'(x) = 0$</td><td>rico 0 (horizontaal)</td></tr></table>
  <p>Waar de grafiek van $f'$ <b>boven</b> de x-as ligt, stijgt f. Waar ze <b>onder</b> de x-as ligt, daalt f. Waar ze de x-as <b>snijdt</b> (van teken wisselt), heeft f een extremum.</p></div>`;

// ===================================================================
//  DEEL 1 · HET DIFFERENTIEQUOTIËNT
// ===================================================================
const ONTSP = (t) => 2 + 0.9 * t - 0.025 * t * t;
const FC = (x) => 0.15 * (x + 3) * (x - 1) * (x - 4), DFC = (x) => 0.15 * (3 * x * x - 4 * x - 11);
function sitGemiddeld() {
  const s = kies(['koorts', 'medicijn', 'wacht', 'baby', 'stappen']);
  if (s === 'koorts') {
    const t1 = kies([6, 7, 8, 9]), dt = kies([2, 3, 4]), T1 = r1(kies([37.6, 38, 38.2, 38.4])), d = kies([0.3, 0.4, 0.5, -0.2, -0.3, -0.4]), T2 = r1(T1 + d * dt);
    return { tekst: `Een verpleegkundige meet de temperatuur van een patiënt: ${kg(T1)} °C om ${t1} u en ${kg(T2)} °C om ${t1 + dt} u.`, vr: `Bereken de gemiddelde veranderingssnelheid van de temperatuur tussen ${t1} u en ${t1 + dt} u.`,
      a: [t1, T1], b: [t1 + dt, T2], w: d, eenh: '°C per uur', gr: 'temperatuur', tE: 'u' };
  }
  if (s === 'medicijn') {
    const t1 = kies([2, 3]), dt = kies([2, 4]), C1 = kies([8, 9, 10, 12]), d = kies([-0.5, -1, -1.5]), C2 = r1(C1 + d * dt);
    return { tekst: `De concentratie van een medicijn in het bloed is ${kg(C1)} mg/l na ${t1} uur en ${kg(C2)} mg/l na ${t1 + dt} uur.`, vr: `Bereken de gemiddelde veranderingssnelheid van de concentratie tussen ${t1} en ${t1 + dt} uur.`,
      a: [t1, C1], b: [t1 + dt, C2], w: d, eenh: 'mg/l per uur', gr: 'concentratie', tE: 'uur' };
  }
  if (s === 'wacht') {
    const m1 = kies([1, 2, 3]), dm = kies([3, 4, 5, 6]), N1 = kies([40, 48, 60, 72]), d = kies([2, 3, 4, -2, -3]), N2 = N1 + d * dm;
    const mnd = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september'];
    return { tekst: `Op de wachtlijst van een dagcentrum staan in ${mnd[m1 - 1]} ${N1} cliënten en ${dm} maanden later ${N2} cliënten.`, vr: 'Bereken de gemiddelde veranderingssnelheid van de wachtlijst over die periode.',
      a: [m1, N1], b: [m1 + dm, N2], w: d, eenh: 'cliënten per maand', gr: 'wachtlijst', tE: 'maand' };
  }
  if (s === 'baby') {
    const w1 = kies([3.2, 3.4, 3.5, 3.6]), dw = kies([2, 4, 5]), d = kies([0.15, 0.2, 0.25]), w2 = r2(w1 + d * dw);
    return { tekst: `Een baby weegt bij de geboorte ${kg(w1)} kg. Na ${dw} weken weegt de baby ${kg(w2)} kg.`, vr: 'Bereken de gemiddelde veranderingssnelheid van het gewicht.',
      a: [0, w1], b: [dw, w2], w: d, eenh: 'kg per week', gr: 'gewicht', tE: 'week' };
  }
  const d1 = kies([2, 3, 4]), s1 = kies([3200, 4000, 4800]), d = kies([400, 500, 600, -300, -400]), s2 = s1 + d * d1;
  return { tekst: `Een revalidatiepatiënt zet op dag 1 ${s1} stappen en op dag ${1 + d1} ${s2} stappen.`, vr: 'Bereken de gemiddelde veranderingssnelheid van het aantal stappen.',
    a: [1, s1], b: [1 + d1, s2], w: d, eenh: 'stappen per dag', gr: 'aantal stappen', tE: 'dag' };
}
const D1 = {
  nr: 1, titel: 'Het differentiequotiënt', kort: 'De gemiddelde veranderingssnelheid tussen twee punten, op een grafiek en in een situatie.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Instap: hoe snel verandert de ontspanning?</div>
      <p>Tijdens een mindfulnesssessie van 30 minuten meet een begeleider het ontspanningsniveau van een deelnemer.</p>
      ${figuur(agraf({ x: [0, 30], y: [0, 11], xs: 5, ys: 2, functies: [{ f: ONTSP }], xn: 'tijd (min)', yn: 'ontspanning', breed: 400, hoog: 210 }))}
      <p>In het begin stijgt het niveau het snelst (daar is de grafiek het steilst). Rond 18 minuten verandert het even niet (de top). <b>Hoe snel</b> iets verandert op één moment is iets anders dan <b>hoeveel</b> het in totaal veranderd is.</p></div>
    <div class="kader def"><div class="kader-titel">Gemiddelde veranderingssnelheid = differentiequotiënt</div>
      <p>De gemiddelde veranderingssnelheid van f tussen $A(x_1, f(x_1))$ en $B(x_2, f(x_2))$ is</p>
      <p class="midden">$\\dfrac{\\Delta f}{\\Delta x} = \\dfrac{f(x_2) - f(x_1)}{x_2 - x_1}$</p>
      <p>Dat is de <b>richtingscoëfficiënt van de rechte door A en B</b>. Die rechte heet een <b>secans</b>.</p>
      ${figuur(agraf({ x: [-4, 5], y: [-3, 4.5], xs: 1, ys: 1, functies: [{ f: FC }], segs: [{ x1: -4, y1: -1.5, x2: 1, y2: 6 }, { x1: -3, y1: 0, x2: -1, y2: 0, kleur: GROEN, streep: true }, { x1: -1, y1: 0, x2: -1, y2: 3, kleur: GROEN, streep: true }], punten: [{ x: -3, y: 0, lab: 'A', dx: -16 }, { x: -1, y: 3, lab: 'B' }] }))}
      <p class="midden">Hier: $\\Delta f : \\Delta x = 3 : 2 = 1{,}5$</p>
      <p>Het differentiequotiënt geeft de <b>gemiddelde</b> verandering over het hele interval $[x_1, x_2]$, niet wat er op elk moment daarbinnen gebeurt. De <b>eenheid</b> is: eenheid van f <b>per</b> eenheid van x (bv. °C per uur).</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'A(2, 5) \\text{ en } B(6, 13)', stappen: ['\\Delta f = 13 - 5 = 8', '\\Delta x = 6 - 2 = 4', '\\Delta f : \\Delta x = 8 : 4 = 2', '\\text{f stijgt gemiddeld met 2 per eenheid}'] },
    { html: opgave('Grafiek van f(x) = 0,15(x + 3)(x − 1)(x − 4): tussen C(1, 0) en D(4, 0).'), stappen: ['\\Delta f : \\Delta x = (0 - 0) : (4 - 1) = 0', '\\text{Gemiddeld nul, maar f is daar niet constant: ze daalt eerst en stijgt dan.}'] },
    { html: opgave('Een patiënt heeft 38,2 °C om 8 u en 39,4 °C om 11 u.'), stappen: ['(39{,}4 - 38{,}2) : (11 - 8) = 1{,}2 : 3 = 0{,}4', '\\text{gemiddeld } 0{,}4\\text{ °C per uur}'] },
  ],
  soorten: {
    tweePunten: { naam: 'Twee punten gegeven', gen() {
      const x1 = rnd(-3, 3), dx = kies([1, 2, 3, 4, 5]), m = kies([-3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3, 4]), y1 = rnd(-4, 6), y2 = y1 + m * dx;
      if (!Number.isInteger(y2)) return this.gen();
      return { soort: 'tweePunten', opdracht: 'Bereken Δf : Δx.', tex: `A(${tg(x1)}, ${tg(y1)}) \\text{ en } B(${tg(x1 + dx)}, ${tg(y2)})`, html: vraag('Wat is de gemiddelde veranderingssnelheid van f tussen A en B?'), sleutel: `${x1}${dx}${y1}${m}`,
        antw: getal(m, { voor: '\\Delta f : \\Delta x =' }), uitleg: [`\\Delta f = ${tg(y2)} - ${y1 < 0 ? `(${tg(y1)})` : tg(y1)} = ${tg(y2 - y1)}`, `\\Delta x = ${tg(x1 + dx)} - ${x1 < 0 ? `(${tg(x1)})` : tg(x1)} = ${dx}`, `${tg(y2 - y1)} : ${dx} = ${tg(m)}`] };
    } },
    graf: { naam: 'Op een grafiek', gen() {
      let Q, x1, x2, y1, y2;
      for (let i = 0; i < 50; i++) {
        Q = kwadr(); x1 = rnd(Q.h - 3, Q.h + 1); x2 = x1 + kies([2, 3, 4]); y1 = Q.f(x1); y2 = Q.f(x2);
        if (Number.isInteger(y1) && Number.isInteger(y2) && x2 <= Q.h + 3 && Math.abs(Q.a) * 9 <= 9.1) break;
      }
      if (!Number.isInteger(y1) || !Number.isInteger(y2)) return this.gen();
      const XX = [Math.min(x1, Q.h) - 1, Math.max(x2, Q.h) + 1], Y = yBereik([Q.f], XX[0], XX[1], 0.1), m = (y2 - y1) / (x2 - x1);
      return { soort: 'graf', opdracht: 'Lees de coördinaten van A en B af. Bereken dan Δf : Δx.',
        html: figuur(agraf({ x: XX, y: Y, xs: 1, ys: 1, hoog: 260, functies: [{ f: Q.f }], segs: [{ x1, y1, x2, y2 }], punten: [{ x: x1, y: y1, lab: 'A' }, { x: x2, y: y2, lab: 'B' }] })) + vraag('Wat is de gemiddelde veranderingssnelheid van f tussen A en B?'),
        sleutel: `${Q.a}${Q.h}${Q.k}${x1}${x2}`, antw: gAntw(m, { voor: '\\Delta f : \\Delta x =' }),
        uitleg: [`A(${tg(x1)}, ${tg(y1)}) \\text{ en } B(${tg(x2)}, ${tg(y2)})`, `\\Delta f : \\Delta x = ${tg(y2 - y1)} : ${tg(x2 - x1)} ${Number.isInteger(m * 100) ? '=' : '\\approx'} ${tg(r2(m))}`] };
    } },
    context: { naam: 'In een situatie', gen() {
      const S = sitGemiddeld();
      return { soort: 'context', opdracht: 'Gemiddelde veranderingssnelheid = verandering van de grootheid : verandering van de tijd.', html: opgave(S.tekst) + vraag(S.vr), sleutel: S.tekst,
        antw: gAntw(S.w, { na: `\\text{ ${S.eenh}}` }), uitleg: [`(${tg(S.b[1])} - ${tg(S.a[1])}) : (${tg(S.b[0])} - ${tg(S.a[0])}) = ${tg(r2(S.b[1] - S.a[1]))} : ${tg(S.b[0] - S.a[0])} = ${tg(S.w)}`, tx(`De ${S.gr} ${S.w > 0 ? 'stijgt' : 'daalt'} gemiddeld met ${kg(Math.abs(S.w))} ${S.eenh}.`)] };
    } },
    betekenis: { naam: 'Wat betekent het?', gen() {
      const S = sitGemiddeld(), juist = `De ${S.gr} ${S.w > 0 ? 'stijgt' : 'daalt'} gemiddeld met ${kg(Math.abs(S.w))} ${S.eenh}.`;
      const fout = [`De ${S.gr} ${S.w > 0 ? 'daalt' : 'stijgt'} gemiddeld met ${kg(Math.abs(S.w))} ${S.eenh}.`, `De ${S.gr} is in totaal met ${kg(Math.abs(S.w))} ${S.w > 0 ? 'gestegen' : 'gedaald'}.`, `De ${S.gr} ${S.w > 0 ? 'stijgt' : 'daalt'} op elk moment precies met ${kg(Math.abs(S.w))} ${S.eenh}.`];
      return { soort: 'betekenis', opdracht: 'Kies de juiste interpretatie.', html: opgave(S.tekst) + `<p class="midden">De gemiddelde veranderingssnelheid is $${tg(S.w)}$ ${S.eenh}.</p>` + vraag('Wat betekent dat?'), sleutel: S.tekst + 'b', antw: zinnen(juist, fout),
        uitleg: [tx('Het teken zegt of het gemiddeld stijgt (+) of daalt (−); het gaat om een gemiddelde over de hele periode, niet om elk moment apart.')] };
    } },
    inzicht: { naam: 'Waar of niet waar?', gen() {
      const T = kies([
        ['Het differentiequotiënt is de rico van de secans door A en B.', true, 'De secans is de rechte door A en B; Δf : Δx is haar rico.'],
        ['Als het differentiequotiënt 0 is, dan is f constant tussen A en B.', false, 'f(x₁) = f(x₂), maar daartussen kan f stijgen en dalen.'],
        ['Een negatief differentiequotiënt betekent dat f gemiddeld daalt tussen A en B.', true, 'Δf is negatief: f(x₂) is kleiner dan f(x₁).'],
        ['Het differentiequotiënt vertelt hoe snel f verandert op elk moment binnen het interval.', false, 'Het is een gemiddelde over het hele interval.'],
        ['De eenheid van de veranderingssnelheid van een temperatuur in de tijd is °C per uur.', true, 'Eenheid van f per eenheid van x.'],
        ['Δf : Δx = (x₂ − x₁) : (f(x₂) − f(x₁))', false, 'Het is omgekeerd: Δf : Δx = (f(x₂) − f(x₁)) : (x₂ − x₁).'],
      ]);
      return { soort: 'inzicht', opdracht: 'Denk aan de definitie.', html: opgave(T[0]) + vraag('Waar of niet waar?'), sleutel: T[0], antw: tekstKeuze(['waar', 'niet waar'], T[1] ? 'waar' : 'niet waar'), uitleg: [tx(T[2])] };
    } },
  },
  oefenMix: [['tweePunten', 2], ['graf', 2], ['context', 2], ['betekenis', 1], ['inzicht', 1]],
  test: [['tweePunten', 2], ['graf', 2], ['context', 3], ['betekenis', 2], ['inzicht', 1]], testSchudden: true,
};

// ===================================================================
//  DEEL 2 · DE AFGELEIDE ALS LIMIET
// ===================================================================
const BEGRIP = [
  ["Wat is f '(a)?", 'de ogenblikkelijke veranderingssnelheid van f in a', ['de gemiddelde veranderingssnelheid van f over een interval', 'de functiewaarde van f in a', 'het verschil f(x₂) − f(x₁)']],
  ['Wat gebeurt er met de secans als B steeds dichter naar A schuift?', 'ze nadert de raaklijn in A', ['ze wordt horizontaal', 'ze wordt verticaal', 'ze verdwijnt']],
  ["f '(a) is de limiet van …", 'het differentiequotiënt (f(x) − f(a)) : (x − a) als x nadert naar a', ['f(x) als x nadert naar a', 'de functiewaarden f(a)', 'het differentiequotiënt als x heel groot wordt']],
  ['Hoeveel punten heb je nodig voor een differentiequotiënt?', 'twee punten: A en B', ['één punt', 'drie punten', 'geen enkel punt']],
  ["Welke rechte hoort bij de afgeleide f '(a)?", 'de raaklijn in (a, f(a))', ['de secans door twee punten', 'de x-as', 'de rechte y = f(a)']],
  ['Moet je in deze cursus de limiet van het differentiequotiënt symbolisch berekenen?', 'nee: je moet vooral begrijpen wat ze betekent', ['ja, altijd', 'enkel bij veeltermen', 'enkel als f stijgt']],
];
const GEMOG = [
  ['Tussen 8 u en 11 u steeg de koorts met 0,4 °C per uur.', 'gemiddeld'], ['Om 10 u stijgt de koorts met 0,5 °C per uur.', 'ogenblikkelijk'],
  ['De bus reed van Antwerpen naar Gent aan 70 km/h.', 'gemiddeld'], ['De snelheidsmeter van de bus toont nu 50 km/h.', 'ogenblikkelijk'],
  ['In het eerste kwartaal groeide de wachtlijst met 3 cliënten per maand.', 'gemiddeld'], ['Precies op t = 10 min neemt de ontspanning toe met 0,4 punten per minuut.', 'ogenblikkelijk'],
  ['Tussen 2 u en 6 u na inname daalde de concentratie met 1,1 mg/l per uur.', 'gemiddeld'], ['Op het moment van de meting daalt de bloeddruk met 2 mmHg per seconde.', 'ogenblikkelijk'],
];
const D2 = {
  nr: 2, titel: 'De afgeleide als limiet', kort: 'Van gemiddelde naar ogenblikkelijke veranderingssnelheid.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Van secans naar raaklijn</div>
      <p>Om de veranderingssnelheid op een <b>precies moment</b> te kennen, laat je punt B steeds dichter naar punt A schuiven. De secans draait daarbij mee en nadert een grensstand: de <b>raaklijn</b> in A.</p>
      ${figuur(agraf({ x: [-4, 5], y: [-3, 4.5], xs: 1, ys: 1, functies: [{ f: FC }], segs: [...[1, 0, -1].map(b => { const m = (FC(b) - FC(-2)) / (b + 2); return { x1: -3.6, y1: FC(-2) + m * (-1.6), x2: 1.6, y2: FC(-2) + m * 3.6, kleur: GRIJS, dik: 1.2 }; }), raak(FC, -2, DFC(-2), 1.6)], punten: [{ x: -2, y: FC(-2), lab: 'A', dx: -18 }, ...[1, 0, -1].map(b => ({ x: b, y: FC(b), kleur: GRIJS }))] }))}</div>
    <div class="kader eig"><div class="kader-titel">De afgeleide</div>
      <p>De <b>afgeleide</b> van f in a, genoteerd $f'(a)$, is de <b>limiet</b> van het differentiequotiënt als x steeds dichter bij a komt:</p>
      <p class="midden">$f'(a) = \\lim\\limits_{x \\to a} \\dfrac{f(x) - f(a)}{x - a}$</p>
      <p>Je hoeft deze limiet nooit zelf symbolisch te berekenen. Belangrijk is wat ze betekent: $f'(a)$ is de <b>ogenblikkelijke veranderingssnelheid</b> van f in a.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: $f(x) = x^2$ in $a = 1$</div>
      <table class="tabel"><tr><th>x</th><td>2</td><td>1,5</td><td>1,1</td><td>1,01</td></tr><tr><th>Δf : Δx</th><td>3</td><td>2,5</td><td>2,1</td><td>2,01</td></tr></table>
      <p>Het differentiequotiënt nadert naar <b>2</b>: $f'(1) = 2$.</p></div>
    <div class="kader"><div class="kader-titel">Gemiddeld of ogenblikkelijk?</div>
      <table class="tabel"><tr><th>Differentiequotiënt</th><th>Afgeleide $f'(a)$</th></tr><tr><td>gemiddeld, over een interval</td><td>ogenblikkelijk, in één punt</td></tr><tr><td>twee punten A en B</td><td>B schuift naar A: limiet</td></tr><tr><td>rico van de secans</td><td>rico van de raaklijn</td></tr></table>
      <p>Vergelijk: de gemiddelde snelheid van een busrit tegenover wat de snelheidsmeter op één moment aangeeft.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Mindfulnesssessie: hoe snel neemt de ontspanning toe op t = 10 min? Maak het interval steeds kleiner.'), stappen: ['[10, 20]: 0{,}15 \\qquad [10, 15]: 0{,}275', '[10, 11]: 0{,}375 \\qquad [10;\\, 10{,}1]: 0{,}3975', "\\text{nadert naar } 0{,}4: \\; N'(10) = 0{,}4 \\text{ punten per minuut}"] },
  ],
  soorten: {
    nadert: { naam: 'Waar nadert het naar?', gen() {
      const c = kies([1, 2, 0.5, 3]), a = kies([-2, -1, 1, 2, 3]), f = (x) => c * x * x;
      const hs = [1, 0.5, 0.1, 0.01], rij = hs.map(h => r2((f(a + h) - f(a)) / h * 100) / 100);
      const fTex = `f(x) = ${c === 1 ? '' : tg(c)}x^2`;
      return { soort: 'nadert', opdracht: 'Bekijk de tabel: x komt steeds dichter bij a.', tex: `${fTex}, \\quad a = ${a}`,
        html: `<table class="tabel"><tr><th>x</th>${hs.map(h => `<td>${kg(r2(a + h))}</td>`).join('')}</tr><tr><th>Δf : Δx</th>${hs.map(h => `<td>${kg(W.rond((f(a + h) - f(a)) / h, 4))}</td>`).join('')}</tr></table>` + vraag(`Naar welk getal nadert het differentiequotiënt? Dat is f '(${a}).`),
        sleutel: `${c}${a}`, antw: getal(2 * c * a, { voor: `f'(${a}) =` }), uitleg: [`\\text{De waarden naderen naar } ${tg(2 * c * a)}`, `f'(${a}) = ${tg(2 * c * a)}`] };
    } },
    bereken: { naam: 'Een differentiequotiënt berekenen', gen() {
      const a = kies([1, 2, 3, -1, -2]), h = kies([1, 0.5, 0.1]), f = (x) => x * x, w = W.rond((f(a + h) - f(a)) / h, 4);
      return { soort: 'bereken', opdracht: 'Gebruik je rekenmachine.', tex: `f(x) = x^2`, html: vraag(`Bereken het differentiequotiënt van f tussen ${a} en ${kg(a + h)}.`), sleutel: `${a}${h}`,
        antw: getal(w, { voor: '\\Delta f : \\Delta x =' }), uitleg: [`f(${tg(a + h)}) = ${tg(W.rond(f(a + h), 4))}, \\; f(${a}) = ${f(a)}`, `(${tg(W.rond(f(a + h), 4))} - ${f(a)}) : ${tg(h)} = ${tg(w)}`] };
    } },
    begrip: { naam: 'Begrippen', gen() {
      const [vr, j, f] = kies(BEGRIP);
      return { soort: 'begrip', opdracht: 'Kies het juiste antwoord.', html: vraag(vr), sleutel: vr, antw: zinnen(j, f), uitleg: [tx(j)] };
    } },
    gemOgenbl: { naam: 'Gemiddeld of ogenblikkelijk?', gen() {
      const [z, j] = kies(GEMOG);
      return { soort: 'gemOgenbl', opdracht: 'Gaat het over een interval of over één moment?', html: opgave(z) + vraag('Is dit een gemiddelde of een ogenblikkelijke veranderingssnelheid?'), sleutel: z,
        antw: tekstKeuze(['gemiddeld', 'ogenblikkelijk'], j), uitleg: [tx(j === 'gemiddeld' ? 'Het gaat over een periode (een interval): gemiddeld, een differentiequotiënt.' : 'Het gaat over één moment: ogenblikkelijk, een afgeleide.')] };
    } },
  },
  oefenMix: [['nadert', 2], ['bereken', 1], ['begrip', 2], ['gemOgenbl', 2]],
  test: [['nadert', 3], ['bereken', 2], ['begrip', 3], ['gemOgenbl', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 3 · DE AFGELEIDE ALS RICO VAN DE RAAKLIJN
// ===================================================================
const G05 = (x) => 0.5 * x * x;
const D3 = {
  nr: 3, titel: 'De rico van de raaklijn', kort: "Het teken en de grootte van f '(a) aflezen uit een grafiek met raaklijnen.", rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De afgeleide is de rico van de raaklijn</div>
      <p>$f'(a)$ is de <b>richtingscoëfficiënt (rico) van de raaklijn</b> aan de grafiek van f in het punt $(a, f(a))$.</p>
      <ul><li>$f'(a)$ groot en positief: de grafiek stijgt daar <b>sterk</b>.</li><li>$f'(a)$ klein en positief: de grafiek stijgt daar <b>zwak</b>.</li><li>$f'(a)$ negatief: de grafiek <b>daalt</b> daar.</li><li>$f'(a) = 0$: de raaklijn is <b>horizontaal</b>.</li></ul>
      ${figuur(agraf({ x: [-4, 5], y: [-3, 4.5], xs: 1, ys: 1, functies: [{ f: FC }], segs: [[-2.8, 0.45], [(4 - Math.sqrt(148)) / 6, 1], [0, 1], [(4 + Math.sqrt(148)) / 6, 1], [4.2, 0.45]].map(([a, d]) => raak(FC, a, DFC(a), d)), punten: [[-2.8, 'A'], [(4 - Math.sqrt(148)) / 6, 'B'], [0, 'C'], [(4 + Math.sqrt(148)) / 6, 'D'], [4.2, 'E']].map(([a, l]) => ({ x: a, y: FC(a), lab: l })) }))}
      <p>A en E: $f'$ groot en positief · B en D: $f' = 0$ (top en dal) · C: $f'$ negatief.</p></div>
    <div class="kader werk"><div class="kader-titel">De rico van een raaklijn aflezen</div>
      ${figuur(agraf({ x: [-1, 4.5], y: [-2, 6], xs: 1, ys: 1, functies: [{ f: G05 }], segs: [{ x1: 0, y1: -2, x2: 4, y2: 6 }, { x1: 1, y1: 0, x2: 3, y2: 0, kleur: GROEN, streep: true }, { x1: 3, y1: 0, x2: 3, y2: 4, kleur: GROEN, streep: true }], punten: [{ x: 2, y: 2, lab: 'P', dx: -20 }, { x: 1, y: 0, kleur: GROEN, vierkant: true }, { x: 3, y: 4, kleur: GROEN, vierkant: true }], breed: 340 }))}
      <p>Raaklijn aan $g(x) = 0{,}5x^2$ in $P(2, 2)$. Kies twee <b>roosterpunten</b> op de raaklijn: $(1, 0)$ en $(3, 4)$. Rico $= \\Delta y : \\Delta x = 4 : 2 = 2$, dus $g'(2) = 2$.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave("Mindfulnesssessie: op t ≈ 18 min is de raaklijn aan de grafiek horizontaal."), stappen: ["N'(18) = 0", '\\text{Het ontspanningsniveau verandert even niet: het is maximaal.}'] },
    { tex: "f'(3) = -2", stappen: ['\\text{rico van de raaklijn negatief}', '\\text{de grafiek daalt in } x = 3'] },
  ],
  soorten: {
    teken: { naam: "Teken van f '(a)", gen() {
      const K = kubiek(), type = kies(['pos', 'neg', 'nul']);
      const a = type === 'nul' ? kies([K.u, K.v]) : type === 'pos' ? (K.c > 0 ? kies([K.u - 1, K.v + 1]) : (K.u + K.v) / 2) : (K.c > 0 ? (K.u + K.v) / 2 : kies([K.u - 1, K.v + 1]));
      const m = nul(K.df(a)), juist = m > 0 ? 'positief' : m < 0 ? 'negatief' : 'nul';
      return { soort: 'teken', opdracht: 'Kijk naar de raaklijn in P.', html: figuur(agraf({ x: K.X, y: K.Y, xs: 1, functies: [{ f: K.f }], segs: [raak(K.f, a, m, Math.abs(m) > 3 ? 0.5 : 1)], punten: [{ x: a, y: K.f(a), lab: 'P' }] })) + vraag(`Is f '(${mk(a)}) positief, negatief of nul?`),
        sleutel: `${K.u}${K.v}${K.c}${a}`, antw: tekstKeuze(['positief', 'negatief', 'nul'], juist), uitleg: [tx(juist === 'nul' ? 'De raaklijn is horizontaal (top of dal): rico 0.' : juist === 'positief' ? 'De raaklijn stijgt: rico positief, f stijgt daar.' : 'De raaklijn daalt: rico negatief, f daalt daar.')] };
    } },
    aflezen: { naam: 'Rico van de raaklijn aflezen', gen() {
      let Q, x0, m;
      for (let i = 0; i < 50; i++) { Q = kwadr({ a: kies([0.5, 1, -0.5, -1]), h: rnd(-1, 1), k: rnd(-1, 2) }); x0 = Q.h + kies([-2, -1, 1, 2]); m = Q.df(x0); if (Number.isInteger(Q.f(x0)) && Math.abs(m) <= 2) break; }
      if (!Number.isInteger(Q.f(x0))) return this.gen();
      const y0 = Q.f(x0), x1 = x0 + 1, y1 = y0 + m, Rr = Math.max(4, 2 * Math.abs(m) + 2);
      return { soort: 'aflezen', opdracht: 'Kies twee roosterpunten op de raaklijn (de vierkantjes) en bereken Δy : Δx.',
        html: figuur(agraf({ x: [x0 - 3, x0 + 3], y: [y0 - Rr, y0 + Rr], xs: 1, ys: 1, hoog: 260, functies: [{ f: Q.f }], segs: [raak(Q.f, x0, m, 2.2)], punten: [{ x: x0, y: y0, lab: 'P', dx: -20 }, { x: x0 - 1, y: y0 - m, kleur: GROEN, vierkant: true }, { x: x1, y: y1, kleur: GROEN, vierkant: true }] })) + vraag(`Hoeveel is f '(${mk(x0)})?`),
        sleutel: `${Q.a}${Q.h}${Q.k}${x0}`, antw: getal(m, { voor: `f'(${x0}) =` }), uitleg: [`(${tg(x0 - 1)}, ${tg(y0 - m)}) \\text{ en } (${tg(x1)}, ${tg(y1)})`, `\\Delta y : \\Delta x = ${tg(2 * m)} : 2 = ${tg(m)}`] };
    } },
    vergelijk: { naam: 'In welk punt?', gen() {
      const K = kubiek(), xs = schud([K.c > 0 ? K.u - 1 : K.v + 1, (K.u + K.v) / 2, kies([K.u, K.v])]), labs = ['A', 'B', 'C'];
      const vr = kies([['positief', (m) => m > 0], ['negatief', (m) => m < 0], ['gelijk aan 0', (m) => m === 0]]);
      const ms = xs.map(a => nul(K.df(a))), j = ms.findIndex(vr[1]);
      return { soort: 'vergelijk', opdracht: 'Kijk naar de raaklijnen.', html: figuur(agraf({ x: K.X, y: K.Y, xs: 1, functies: [{ f: K.f }], segs: xs.map((a, i) => raak(K.f, a, ms[i], Math.abs(ms[i]) > 3 ? 0.45 : 0.9)), punten: xs.map((a, i) => ({ x: a, y: K.f(a), lab: labs[i] })) })) + vraag(`In welk punt is de afgeleide ${vr[0]}?`),
        sleutel: `${K.u}${K.v}${K.c}${xs}${vr[0]}`, antw: tekstKeuze(labs, labs[j]), uitleg: [tx(`In ${labs[j]} ${vr[0] === 'gelijk aan 0' ? 'is de raaklijn horizontaal' : vr[0] === 'positief' ? 'stijgt de raaklijn' : 'daalt de raaklijn'}.`)] };
    } },
    eigenschap: { naam: 'Wat zegt de afgeleide?', gen() {
      const a = rnd(-3, 4), A = mk(a), T = kies([[kies([4, 5, 6, 8]), 'De grafiek van f stijgt sterk in x = ' + A + '.'], [kies([0.1, 0.2, 0.3]), 'De grafiek van f stijgt zwak in x = ' + A + '.'], [kies([-1, -2, -3, -0.5]), 'De grafiek van f daalt in x = ' + A + '.'], [0, 'De raaklijn in x = ' + A + ' is horizontaal.']]);
      const alle = ['De grafiek van f stijgt sterk in x = ' + A + '.', 'De grafiek van f stijgt zwak in x = ' + A + '.', 'De grafiek van f daalt in x = ' + A + '.', 'De raaklijn in x = ' + A + ' is horizontaal.'];
      return { soort: 'eigenschap', opdracht: "f '(a) is de rico van de raaklijn in a.", tex: `f'(${a}) = ${tg(T[0])}`, html: vraag('Wat weet je dan over de grafiek van f?'), sleutel: `${a}${T[0]}`, antw: zinnen(T[1], alle), uitleg: [tx(T[1])] };
    } },
  },
  oefenMix: [['teken', 2], ['aflezen', 2], ['vergelijk', 1], ['eigenschap', 1]],
  test: [['teken', 3], ['aflezen', 3], ['vergelijk', 2], ['eigenschap', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 4 · HET GRAFISCH VERBAND TUSSEN f EN f '
// ===================================================================
// tekenschema van f ' + verloop van f voor een kubiek met extrema u < v
const kubSchema = (u, v, c, naam = 'f') => schema([['$x$', '', `$${tg(u)}$`, '', `$${tg(v)}$`, ''], [`$${naam}'$`, c > 0 ? '+' : '−', '0', c > 0 ? '−' : '+', '0', c > 0 ? '+' : '−'], [`$${naam}$`, c > 0 ? OP : NEER, c > 0 ? 'max' : 'min', c > 0 ? NEER : OP, c > 0 ? 'min' : 'max', c > 0 ? OP : NEER]]);
const lijnSchema = (z, m, naam = 'f') => schema([['$x$', '', `$${tg(z)}$`, ''], [`$${naam}'$`, m > 0 ? '−' : '+', '0', m > 0 ? '+' : '−'], [`$${naam}$`, m > 0 ? NEER : OP, m > 0 ? 'min' : 'max', m > 0 ? OP : NEER]]);
const D4 = {
  nr: 4, titel: "Het verband tussen f en f '", kort: "Van f naar het teken van f ', en van de grafiek van f ' naar het verloop van f.", rekenmachine: false,
  theorie: `${VERBAND}
    <div class="kader werk"><div class="kader-titel">Voorbeeld A: van f naar f '</div>
      <p>$f(x) = 0{,}15(x + 3)(x - 1)(x - 4)$ met horizontale raaklijnen in de extrema, en daaronder de grafiek van $f'$.</p>
      ${figuur(agraf({ x: [-4, 5], y: [-3, 4.5], xs: 1, ys: 1, functies: [{ f: FC }], segs: [(4 - Math.sqrt(148)) / 6, (4 + Math.sqrt(148)) / 6].map(a => raak(FC, a, 0, 0.8)), punten: [(4 - Math.sqrt(148)) / 6, (4 + Math.sqrt(148)) / 6].map(a => ({ x: a, y: FC(a) })), hoog: 190 }))}
      ${figuur(agraf({ x: [-4, 5], y: [-2.5, 6], xs: 1, ys: 2, functies: [{ f: DFC, kleur: GROEN }], punten: [(4 - Math.sqrt(148)) / 6, (4 + Math.sqrt(148)) / 6].map(a => ({ x: a, y: 0, kleur: GROEN })), hoog: 170, yn: "f '" }))}
      ${schema([['$x$', '', '$-1{,}36$', '', '$2{,}69$', ''], ["$f'$", '+', '0', '−', '0', '+'], ['$f$', OP, 'max', NEER, 'min', OP]])}</div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld B: van f ' naar f</div>
      ${figuur(agraf({ x: [-2, 4], y: [-3, 3], xs: 1, ys: 1, functies: [{ f: (x) => x - 1, kleur: GROEN }], punten: [{ x: 1, y: 0, kleur: GROEN }], breed: 300, hoog: 170, yn: "f '" }))}
      <p>$f'(x) < 0$ voor $x < 1$, $f'(1) = 0$ en $f'(x) > 0$ voor $x > 1$: f daalt, heeft een lokaal minimum in $x = 1$ en stijgt daarna.</p>
      ${figuur(agraf({ x: [-2, 4], y: [-2, 7], xs: 1, ys: 1, functies: [{ f: (x) => 0.5 * (x - 1) ** 2 - 1, kleur: GRIJS, dun: true }, { f: (x) => 0.5 * (x - 1) ** 2 + 1 }, { f: (x) => 0.5 * (x - 1) ** 2 + 3, kleur: GRIJS, dun: true }], breed: 300, hoog: 170 }))}
      <p><b>Let op:</b> er zijn oneindig veel functies f die bij dezelfde $f'$ passen (ze zijn verticaal verschoven), maar het <b>verloop</b> (stijgend, dalend, extremum) ligt wel volledig vast.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'f(x) = -x^2 + 4x \\quad (\\text{top in } (2, 4))', stappen: ["x < 2: f \\text{ stijgt, dus } f'(x) > 0", "f'(2) = 0 \\text{ (horizontale raaklijn)}", "x > 2: f \\text{ daalt, dus } f'(x) < 0"] },
    { html: opgave("De grafiek van k ' is een dalparabool met nulwaarden −1 en 2 (boven de x-as links van −1 en rechts van 2)."), stappen: ["k' > 0 \\text{ voor } x < -1: \\; k \\text{ stijgt}", "k' < 0 \\text{ tussen } -1 \\text{ en } 2: \\; k \\text{ daalt}", '\\text{lokaal maximum in } x = -1, \\text{ lokaal minimum in } x = 2'] },
  ],
  soorten: {
    fNaarTeken: { naam: "Van f naar het teken van f '", gen() {
      const K = kubiek(), j = kubSchema(K.u, K.v, K.c);
      const fout = [kubSchema(K.u, K.v, -K.c), kubSchema(K.u - 1, K.v + 1, K.c), schema([['$x$', '', `$${tg(K.u)}$`, '', `$${tg(K.v)}$`, ''], ["$f'$", '+', '0', '+', '0', '+'], ['$f$', OP, '', OP, '', OP]])];
      return { soort: 'fNaarTeken', opdracht: 'Bepaal waar f stijgt, daalt en een extremum heeft.', html: figuur(agraf({ x: K.X, y: K.Y, xs: 1, functies: [{ f: K.f }] })) + vraag("Welk schema hoort bij deze grafiek van f?"), sleutel: `${K.u}${K.v}${K.c}${K.d}`,
        antw: zinnen(j, fout, { lijst: false }), uitleg: [tx(`Extrema in x = ${mk(K.u)} en x = ${mk(K.v)}. Waar f stijgt is f ' > 0, waar f daalt is f ' < 0, in de extrema is f ' = 0.`)] };
    } },
    verloop: { naam: "Van f ' naar het verloop van f", gen() {
      if (Math.random() < 0.4) {
        const z = rnd(-2, 2), m = kies([1, 2, -1, -2, 0.5, -0.5]), g = (x) => m * (x - z);
        return { soort: 'verloop', opdracht: "Lees het teken van f ' af: boven of onder de x-as?", html: figuur(agraf({ x: [z - 3, z + 3], y: yBereik([g], z - 3, z + 3, 0.05), xs: 1, functies: [{ f: g, kleur: GROEN }], yn: "f '" })) + vraag("Hierboven staat de grafiek van f '. Welk schema geeft het verloop van f?"), sleutel: `l${z}${m}`,
          antw: zinnen(lijnSchema(z, m), [lijnSchema(z, -m), lijnSchema(z + 1, m), schema([['$x$', '', `$${tg(z)}$`, ''], ["$f'$", '+', '0', '+'], ['$f$', OP, '', OP]])], { lijst: false }), uitleg: [tx(`f ' wisselt van teken in x = ${mk(z)}: f heeft daar een lokaal ${m > 0 ? 'minimum' : 'maximum'}.`)] };
      }
      const K = kubiek(), Y = yBereik([K.df], K.X[0], K.X[1], 0.05);
      return { soort: 'verloop', opdracht: "Lees het teken van f ' af: boven of onder de x-as?", html: figuur(agraf({ x: K.X, y: Y, xs: 1, functies: [{ f: K.df, kleur: GROEN }], punten: [{ x: K.u, y: 0, kleur: GROEN }, { x: K.v, y: 0, kleur: GROEN }], yn: "f '" })) + vraag("Hierboven staat de grafiek van f '. Welk schema geeft het verloop van f?"), sleutel: `k${K.u}${K.v}${K.c}`,
        antw: zinnen(kubSchema(K.u, K.v, K.c), [kubSchema(K.u, K.v, -K.c), kubSchema(K.u - 1, K.v + 1, K.c), schema([['$x$', '', `$${tg(K.u)}$`, '', `$${tg(K.v)}$`, ''], ["$f'$", '0', '+', '0', '−', '0'], ['$f$', '', OP, '', NEER, '']])], { lijst: false }),
        uitleg: [tx(`f ' is ${K.c > 0 ? 'positief' : 'negatief'} voor x < ${mk(K.u)}, ${K.c > 0 ? 'negatief' : 'positief'} tussen ${mk(K.u)} en ${mk(K.v)} en ${K.c > 0 ? 'positief' : 'negatief'} voor x > ${mk(K.v)}.`)] };
    } },
    extremum: { naam: "Extremum uit de grafiek van f '", gen() {
      const K = kubiek(), soort = kies(['maximum', 'minimum']), Y = yBereik([K.df], K.X[0], K.X[1], 0.05), w = soort === 'maximum' ? K.max : K.min;
      return { soort: 'extremum', opdracht: "Waar wisselt f ' van teken? Van + naar − geeft een top, van − naar + een dal.", html: figuur(agraf({ x: K.X, y: Y, xs: 1, functies: [{ f: K.df, kleur: GROEN }], yn: "f '" })) + vraag(`Hierboven staat de grafiek van f '. In welke x heeft f een lokaal ${soort}?`),
        sleutel: `${K.u}${K.v}${K.c}${soort}`, antw: getal(w, { voor: 'x =' }), uitleg: [tx(`In x = ${mk(w)} gaat f ' van ${soort === 'maximum' ? '+ naar −' : '− naar +'}: f ${soort === 'maximum' ? 'stijgt en daalt dan' : 'daalt en stijgt dan'}.`)] };
    } },
    welkeF: { naam: "Welke f past bij f '?", gen() {
      const K = kubiek({ dv: kies([2, 3]) }), Yd = yBereik([K.df], K.X[0], K.X[1], 0.05);
      const sp = (G) => kaal(G.f, K.X, yBereik([G.f], K.X[0], K.X[1]), 'f');
      const fout = [kubiek({ u: K.u, dv: K.v - K.u, c: -K.c }), kubiek({ u: K.u + 1, dv: K.v - K.u, c: K.c }), kubiek({ u: K.u - 1, dv: K.v - K.u + 2, c: K.c })];
      return { soort: 'welkeF', opdracht: "Waar f ' boven de x-as ligt, stijgt f.", html: figuur(agraf({ x: K.X, y: Yd, xs: 1, functies: [{ f: K.df, kleur: GROEN }], yn: "f '" })) + vraag("Hierboven staat de grafiek van f '. Welke grafiek kan de grafiek van f zijn?"), sleutel: `${K.u}${K.v}${K.c}`,
        antw: figuren(sp(K), fout.map(sp)), uitleg: [tx(`f ' wisselt van teken in x = ${mk(K.u)} en x = ${mk(K.v)}: daar liggen de extrema van f (max in ${mk(K.max)}, min in ${mk(K.min)}).`)] };
    } },
    welkeAfg: { naam: "Welke f ' past bij f?", gen() {
      const K = kubiek({ dv: kies([2, 3]) }), Y = yBereik([K.f], K.X[0], K.X[1]);
      const g = (h) => kaal(h, K.X, yBereik([h], K.X[0], K.X[1], 0.05), "f '", GROEN);
      const fout = [(x) => -K.df(x), (x) => K.df(x - 1), (x) => K.c * (x - K.u + 1) * (x - K.v - 1)];
      return { soort: 'welkeAfg', opdracht: "In de extrema van f snijdt de grafiek van f ' de x-as.", html: figuur(agraf({ x: K.X, y: Y, xs: 1, functies: [{ f: K.f }] })) + vraag("Hierboven staat de grafiek van f. Welke grafiek is de grafiek van f '?"), sleutel: `${K.u}${K.v}${K.c}${K.d}`,
        antw: figuren(g(K.df), fout.map(g)), uitleg: [tx(`f heeft extrema in x = ${mk(K.u)} en x = ${mk(K.v)}: daar is f ' = 0. Waar f stijgt, ligt f ' boven de x-as.`)] };
    } },
  },
  oefenMix: [['fNaarTeken', 1], ['verloop', 2], ['extremum', 1], ['welkeF', 1], ['welkeAfg', 1]],
  test: [['fNaarTeken', 2], ['verloop', 2], ['extremum', 2], ['welkeF', 2], ['welkeAfg', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 5 · IN DE ZORG EN WELZIJN
// ===================================================================
function ctxKoorts() {
  const p = kies([6, 8, 10]), A = kies([2, 2.5, 3]), f = (t) => 37 + A * (t / p) * Math.exp(1 - t / p);
  return { naam: 'koorts', f, top: p, X: [0, 24], Y: [36.5, Math.ceil(37 + A + 0.5)], xs: 2, ys: 0.5, xn: 'tijd (uur)', yn: 'T (°C)', F: 'T', gr: 'de temperatuur', eenh: '°C', te: 'uur',
    tekst: 'De grafiek toont de temperatuur T (in °C) van een patiënt met koorts, in de 24 uur na de opname.', topZin: `bereikt de koorts haar hoogste waarde (ongeveer ${kg(r1(37 + A))} °C)`, stijg: 'stijgt de koorts', daal: 'zakt de koorts' };
}
function ctxMedicijn() {
  const p = kies([1, 2, 3]), Cm = kies([6, 8, 10]), f = (t) => Cm * (t / p) * Math.exp(1 - t / p);
  return { naam: 'medicijn', f, top: p, X: [0, 12], Y: [0, Cm + 2], xs: 1, ys: 2, xn: 'tijd (uur)', yn: 'C (mg/l)', F: 'C', gr: 'de concentratie', eenh: 'mg/l', te: 'uur',
    tekst: 'De grafiek toont de concentratie C (in mg/l) van een medicijn in het bloed, na de inname van een tablet.', topZin: `is de concentratie maximaal (${Cm} mg/l)`, stijg: 'neemt het lichaam het medicijn op: de concentratie stijgt', daal: 'breekt het lichaam het medicijn af: de concentratie daalt' };
}
function ctxOntsp() {
  const T = kies([15, 18, 20]), top = kies([9, 10]), n0 = 2, f = (t) => n0 + (top - n0) * (1 - (1 - t / T) ** 2);
  return { naam: 'ontsp', f, top: T, X: [0, 30], Y: [0, 12], xs: 5, ys: 2, xn: 'tijd (min)', yn: 'ontspanning', F: 'N', gr: 'het ontspanningsniveau', eenh: 'punten', te: 'minuut',
    tekst: 'De grafiek toont het ontspanningsniveau N van een deelnemer tijdens een mindfulnesssessie van 30 minuten.', topZin: 'is het ontspanningsniveau maximaal en verandert het even niet', stijg: 'ontspant de deelnemer steeds meer', daal: 'neemt het ontspanningsniveau af' };
}
const kiesCtx = () => kies([ctxKoorts, ctxMedicijn, ctxOntsp])();
const cGraf = (C, extra = {}) => figuur(agraf({ x: C.X, y: C.Y, xs: C.xs, ys: C.ys, functies: [{ f: C.f }], xn: C.xn, yn: C.yn, breed: 420, hoog: 220, ...extra }));
const D5 = {
  nr: 5, titel: 'In de zorg en welzijn', kort: 'Het differentiequotiënt en het teken van de afgeleide interpreteren in een situatie, met eenheden.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">De afgeleide in een situatie</div>
      <ul><li>De afgeleide vertelt <b>hoe snel</b> een grootheid op een bepaald moment verandert. De eenheid is: eenheid van de grootheid <b>per</b> eenheid van de tijd.</li>
      <li>Afgeleide <b>positief</b>: de grootheid stijgt · <b>negatief</b>: ze daalt · <b>nul</b>: ze verandert even niet (top of dal).</li>
      <li>Hoe groter de afgeleide (in absolute waarde), hoe <b>sneller</b> de verandering.</li>
      <li>Formuleer je interpretatie altijd in een <b>volledige zin</b>, met de grootheid, het tijdstip en de eenheid.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: het verloop van koorts</div>
      ${figuur(agraf({ x: [0, 24], y: [36.5, 40], xs: 2, ys: 0.5, functies: [{ f: (t) => 37 + 2.5 * (t / 8) * Math.exp(1 - t / 8) }], punten: [{ x: 8, y: 39.5 }], xn: 'tijd (uur)', yn: 'T (°C)', breed: 420, hoog: 210 }))}
      <p>$T'(8) = 0$: na 8 uur bereikt de koorts een piek van 39,5 °C. De eerste 8 uur is $T' > 0$ (de koorts stijgt, het snelst bij de opname), daarna is $T' < 0$ (de koorts zakt).</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: dezelfde waarde, een andere afgeleide</div>
      <p>Twee patiënten hebben allebei 38,5 °C. Bij patiënt 1 is $T'$ sterk positief, bij patiënt 2 is $T' < 0$. Patiënt 1 vraagt de meeste aandacht: zijn koorts loopt snel op.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('De concentratie van een medicijn is ongeveer 7,4 mg/l na 2 uur en 3,0 mg/l na 6 uur.'), stappen: ['(3{,}0 - 7{,}4) : (6 - 2) = -4{,}4 : 4 = -1{,}1', '\\text{gemiddeld daalt de concentratie met 1,1 mg/l per uur}'] },
    { tex: "C'(2) = 0", stappen: ['\\text{Na 2 uur is de concentratie maximaal.}'] },
  ],
  soorten: {
    gemiddeld: { naam: 'Gemiddelde verandering', gen() {
      const C = kiesCtx(), st = C.naam === 'ontsp' ? 5 : C.naam === 'koorts' ? 2 : 1;
      const t1 = st * rnd(0, Math.floor((C.X[1] * 0.6) / st)), t2 = t1 + st * kies([2, 3, 4]);
      if (t2 > C.X[1]) return this.gen();
      const v1 = r1(C.f(t1)), v2 = r1(C.f(t2)), w = (v2 - v1) / (t2 - t1);
      return { soort: 'gemiddeld', opdracht: 'Gebruik de afgelezen waarden. Rond af op 2 decimalen.', html: opgave(C.tekst) + cGraf(C, { punten: [{ x: t1, y: C.f(t1) }, { x: t2, y: C.f(t2) }], segs: [{ x1: t1, y1: C.f(t1), x2: t2, y2: C.f(t2) }] }) + opgave(`Afgelezen: ${C.F}(${t1}) ≈ ${kg(v1)} en ${C.F}(${t2}) ≈ ${kg(v2)}.`) + vraag(`Bereken de gemiddelde veranderingssnelheid van ${C.gr} tussen t = ${t1} en t = ${t2}.`),
        sleutel: C.tekst + t1 + t2 + C.top, antw: getal(w, { dec: 2, na: `\\text{ ${C.eenh} per ${C.te}}` }), uitleg: [`(${tg(v2)} - ${tg(v1)}) : (${t2} - ${t1}) \\approx ${tg(r2(w))}`] };
    } },
    nul: { naam: 'Wanneer is de afgeleide 0?', gen() {
      const C = kiesCtx();
      return { soort: 'nul', opdracht: 'Waar is de raaklijn horizontaal?', html: opgave(C.tekst) + cGraf(C) + vraag(`Op welk tijdstip t is ${C.F} '(t) = 0?`), sleutel: C.tekst + C.top + C.Y[1],
        antw: getal(C.top, { voor: 't =', na: `\\text{ ${C.te === 'minuut' ? 'min' : 'uur'}}` }), uitleg: [tx(`Op t = ${C.top} ${C.topZin}.`)] };
    } },
    teken: { naam: 'Teken van de afgeleide', gen() {
      const C = kiesCtx(), t = r1(kies([C.top * 0.4, C.top + (C.X[1] - C.top) * 0.4, C.top])), m = (C.f(t + 1e-4) - C.f(t - 1e-4));
      const j = Math.abs(t - C.top) < 1e-9 ? 'nul' : m > 0 ? 'positief' : 'negatief';
      return { soort: 'teken', opdracht: 'Stijgt of daalt de grafiek op dat moment?', html: opgave(C.tekst) + cGraf(C, { punten: [{ x: t, y: C.f(t) }] }) + vraag(`Is ${C.F} '(${kg(t)}) positief, negatief of nul?`), sleutel: C.tekst + t + C.top,
        antw: tekstKeuze(['positief', 'negatief', 'nul'], j), uitleg: [tx(j === 'nul' ? `Op t = ${kg(t)} ligt de top: daar ${C.topZin}.` : j === 'positief' ? `De grafiek stijgt: op t = ${kg(t)} ${C.stijg}.` : `De grafiek daalt: op t = ${kg(t)} ${C.daal}.`)] };
    } },
    betekenis: { naam: 'Wat betekent het?', gen() {
      const C = kiesCtx(), s = kies(['nul', 'pos', 'neg']), t = s === 'nul' ? C.top : s === 'pos' ? r1(C.top / 2) : r1(C.top + (C.X[1] - C.top) * 0.4);
      const T = kg(t), Z = { nul: `Op t = ${T} ${C.topZin}.`, pos: `Op t = ${T} ${C.stijg}.`, neg: `Op t = ${T} ${C.daal}.` };
      const formule = { nul: `${C.F}'(${tg(t)}) = 0`, pos: `${C.F}'(${tg(t)}) > 0`, neg: `${C.F}'(${tg(t)}) < 0` }[s];
      return { soort: 'betekenis', opdracht: 'Kies de juiste interpretatie.', html: opgave(C.tekst) + cGraf(C) + `<p class="midden">$${formule}$</p>` + vraag('Wat betekent dat in deze situatie?'), sleutel: C.tekst + s + C.top,
        antw: zinnen(Z[s], Object.values(Z).filter(z => z !== Z[s]).concat([`Op t = ${T} is ${C.gr} gelijk aan 0.`])), uitleg: [tx(Z[s])] };
    } },
    eenheid: { naam: 'De eenheid', gen() {
      const T = kies([['T(t) is de temperatuur in °C, t de tijd in uur.', "T '(t)", '°C per uur', ['uur per °C', '°C', 'uur']], ['C(t) is de concentratie in mg/l, t de tijd in uur.', "C '(t)", 'mg/l per uur', ['uur per mg/l', 'mg/l', 'mg']],
        ['N(t) is het aantal cliënten op de wachtlijst, t de tijd in maanden.', "N '(t)", 'cliënten per maand', ['maanden per cliënt', 'cliënten', 'maanden']], ['G(t) is het gewicht van een baby in kg, t de tijd in weken.', "G '(t)", 'kg per week', ['weken per kg', 'kg', 'weken']],
        ['P(t) is de bloeddruk in mmHg, t de tijd in seconden.', "P '(t)", 'mmHg per seconde', ['seconden per mmHg', 'mmHg', 'seconden']]]);
      return { soort: 'eenheid', opdracht: 'Eenheid van de grootheid per eenheid van de tijd.', html: opgave(T[0]) + vraag(`Wat is de eenheid van ${T[1]}?`), sleutel: T[0], antw: zinnen(T[2], T[3]), uitleg: [tx(T[2])] };
    } },
  },
  oefenMix: [['gemiddeld', 2], ['nul', 1], ['teken', 2], ['betekenis', 2], ['eenheid', 1]],
  test: [['gemiddeld', 2], ['nul', 2], ['teken', 2], ['betekenis', 3], ['eenheid', 1]], testSchudden: true,
};

// ===================================================================
//  DEEL 6 · EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D6 = {
  nr: 6, titel: 'Eindtest afgeleiden', kort: 'Alle soorten vragen door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p>
    <ul><li><b>Differentiequotiënt</b> = gemiddelde veranderingssnelheid = $\\Delta f : \\Delta x$ = rico van de secans.</li>
    <li><b>Afgeleide</b> $f'(a)$ = ogenblikkelijke veranderingssnelheid = limiet van het differentiequotiënt = rico van de raaklijn.</li></ul></div>${VERBAND}${AFSPRAAK}`,
  voorbeelden: [],
  soorten: {
    e1: mix(D1, 'tweePunten', 'Differentiequotiënt'), e2: mix(D1, 'context', 'Differentiequotiënt in een situatie'), e3: mix(D2, 'nadert', 'De limiet'), e4: mix(D2, 'gemOgenbl', 'Gemiddeld of ogenblikkelijk'),
    e5: mix(D3, 'teken', "Teken van f '(a)"), e6: mix(D3, 'aflezen', 'Rico aflezen'), e7: mix(D4, 'verloop', "Van f ' naar f"), e8: mix(D4, 'welkeAfg', "Welke f '?"), e9: mix(D5, 'betekenis', 'Betekenis in context'), e10: mix(D5, 'gemiddeld', 'Gemiddelde verandering in context'),
  },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen.bind({ gen: () => g() });
    s.gen = () => {
      const v = { ...g() };
      if (v.html) v.html = woorden(v.html);
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
  D.theorie = woorden(D.theorie);
}

Leerpaden.registreer({
  code: 'afgeleiden',
  titel: 'Afgeleiden',
  ondertitel: 'Wiskunde · 5WW / 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert wat de <b>gemiddelde veranderingssnelheid</b> (het differentiequotiënt) is, hoe je daaruit de <b>afgeleide</b> krijgt als limiet, dat de afgeleide de <b>rico van de raaklijn</b> is,
    hoe de grafiek van f en het teken van $f'$ samenhangen, en wat dat betekent in de <b>zorg en welzijn</b>. Alles volgt de PowerPoint uit de les.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p>Je moet nergens een afgeleide met een formule berekenen: je werkt met grafieken, raaklijnen en de betekenis.</p>`,
  groepen: [
    { titel: 'A · Van gemiddeld naar ogenblikkelijk', delen: [1, 2] },
    { titel: "B · De afgeleide en de grafiek", delen: [3, 4] },
    { titel: 'C · Toepassen', delen: [5] },
    { titel: 'D · Eindtest', delen: [6] },
  ],
  delen: [D1, D2, D3, D4, D5, D6],
});
