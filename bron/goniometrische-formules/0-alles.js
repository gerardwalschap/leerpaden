// ===== Goniometrische formules · Toegepaste wiskunde 4BW =====
// Leidraad: cursus TWiskunde 4BW hoofdstuk 7 "Goniometrische formules" en de PWP/werkbundel (G. Walschap).
const { rnd, kies, schud } = W;
const tg = (x) => W.texGetal(W.rond(x, 4));
const kg = (x) => String(x).replace('.', ',').replace('-', '−');
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud(opties.map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const texKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud([...new Set(opties)].map(o => ({ k: o, l: o }))), juist });
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const tx = (s) => '@@' + s;
const RAD = Math.PI / 180, sin = (g) => Math.sin(g * RAD), cos = (g) => Math.cos(g * RAD);
const r2 = (x) => W.rond(x, 2);
const kwadrantVan = (a) => { const b = ((a % 360) + 360) % 360; return b < 90 ? 'I' : b < 180 ? 'II' : b < 270 ? 'III' : 'IV'; };
const hoekNiet0 = () => { let a; do { a = rnd(1, 359); } while (a % 90 === 0); return a; };

// ---------- goniometrische cirkel met een hoek
function cirkel(a, opt = {}) {
  const R = 110, c = 140, X = (x) => c + x * R, Y = (y) => c - y * R;
  let g = `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="#1f2733" stroke-width="1.6"/>`;
  g += `<line x1="${c - R - 20}" y1="${c}" x2="${c + R + 20}" y2="${c}" stroke="#1f2733"/><line x1="${c}" y1="${c - R - 20}" x2="${c}" y2="${c + R + 20}" stroke="#1f2733"/>`;
  if (opt.kwadranten) [['I', 1, 1], ['II', -1, 1], ['III', -1, -1], ['IV', 1, -1]].forEach(([t, sx, sy]) => g += `<text x="${X(sx * 0.95)}" y="${Y(sy * 0.95)}" font-size="16" font-weight="bold" fill="#7a8b99" text-anchor="middle">${t}</text>`);
  if (a !== null && a !== undefined) {
    const px = cos(a), py = sin(a), b = ((a % 360) + 360) % 360, ccw = a >= 0, r0 = 26;
    g += `<line x1="${c}" y1="${c}" x2="${X(px)}" y2="${Y(py)}" stroke="#1c4e8a" stroke-width="2.4"/><circle cx="${X(px)}" cy="${Y(py)}" r="5" fill="#e8772e"/><text x="${X(px * 1.12)}" y="${Y(py * 1.12) + 5}" font-size="14" font-weight="bold" fill="#e8772e" text-anchor="middle">P</text>`;
    const eind = ccw ? Math.min(a, 359.5) : Math.max(a, -359.5), groot = Math.abs(eind) > 180 ? 1 : 0, sweep = ccw ? 0 : 1;
    g += `<path d="M ${c + r0} ${c} A ${r0} ${r0} 0 ${groot} ${sweep} ${c + r0 * cos(eind)} ${c - r0 * sin(eind)}" fill="none" stroke="#e8772e" stroke-width="2"/>`;
    if (opt.label !== false) g += `<text x="${c + 34}" y="${c - 34 * (ccw ? 1 : -1) + (ccw ? 0 : 10)}" font-size="13" fill="#c2561a">${kg(a)}°</text>`;
    if (opt.proj) g += `<line x1="${X(px)}" y1="${Y(py)}" x2="${X(px)}" y2="${c}" stroke="#2e7d4f" stroke-dasharray="4 3" stroke-width="1.6"/><line x1="${X(px)}" y1="${Y(py)}" x2="${c}" y2="${Y(py)}" stroke="#2e7d4f" stroke-dasharray="4 3" stroke-width="1.6"/>`;
  }
  return `<div class="figuur"><svg viewBox="0 0 280 280" width="280" height="280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="goniometrische cirkel" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}
const STIJL = `.vraagzin{margin-top:12px;font-size:16px}`;
if (typeof document !== 'undefined' && document.head && !document.getElementById('gf-stijl')) { const st = document.createElement('style'); st.id = 'gf-stijl'; st.textContent = STIJL; document.head.appendChild(st); }
const TEKENS = `<table class="tabel"><tr><th>kwadrant</th><th>$\\cos \\alpha$</th><th>$\\sin \\alpha$</th><th>$\\tan \\alpha$</th></tr>
  <tr><td>I (0° tot 90°)</td><td>+</td><td>+</td><td>+</td></tr><tr><td>II (90° tot 180°)</td><td>−</td><td>+</td><td>−</td></tr>
  <tr><td>III (180° tot 270°)</td><td>−</td><td>−</td><td>+</td></tr><tr><td>IV (270° tot 360°)</td><td>+</td><td>−</td><td>−</td></tr></table>`;
const VERWANT = `<table class="tabel"><tr><th>verwante hoek</th><th>sin</th><th>cos</th><th>tan</th></tr>
  <tr><td>$-\\alpha$</td><td>$-\\sin \\alpha$</td><td>$\\cos \\alpha$</td><td>$-\\tan \\alpha$</td></tr>
  <tr><td>$180° - \\alpha$</td><td>$\\sin \\alpha$</td><td>$-\\cos \\alpha$</td><td>$-\\tan \\alpha$</td></tr>
  <tr><td>$180° + \\alpha$</td><td>$-\\sin \\alpha$</td><td>$-\\cos \\alpha$</td><td>$\\tan \\alpha$</td></tr>
  <tr><td>$90° - \\alpha$</td><td>$\\cos \\alpha$</td><td>$\\sin \\alpha$</td><td>—</td></tr></table>`;
const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraak</div><p>Zet je rekenmachine in <b>graden</b> (DEG). Rond af op <b>0,01</b> tenzij anders gevraagd.</p></div>`;

// ===================================================================
const D1 = {
  nr: 1, titel: 'De goniometrische cirkel', kort: 'P(cos α, sin α) · positieve en negatieve hoeken.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Goniometrische cirkel</div>
      <p>Een cirkel met middelpunt de oorsprong $O$ en straal 1. Voor een hoek $\\alpha$ teken je vanuit $O$ een straal die een hoek $\\alpha$ maakt met de positieve $x$-as (het <b>beginbeen</b>). Het snijpunt $P$ met de cirkel heeft als coördinaten</p>
      <p class="midden">$P(\\cos \\alpha, \\; \\sin \\alpha)$</p>
      <p>De tangens lees je af op de verticale raaklijn in $(1, 0)$: verleng $OP$ tot ze die raaklijn snijdt in $T$; de $y$-coördinaat van $T$ is $\\tan \\alpha$.</p></div>
    ${cirkel(130, { proj: true })}
    <div class="kader eig"><div class="kader-titel">Positieve en negatieve hoeken</div><p><b>Positieve hoek:</b> je draait <b>tegen</b> de wijzers van de klok in. <b>Negatieve hoek:</b> je draait <b>met</b> de wijzers van de klok mee.</p></div>${AFSPRAAK}`,
  voorbeelden: [{ tex: '\\alpha = 130°', stappen: ['P(\\cos 130°, \\; \\sin 130°) \\approx (-0{,}64; \\; 0{,}77)', '\\text{P ligt links boven: kwadrant II}'] }],
  soorten: {
    punt: { naam: 'Coördinaten van P', gen() { const a = kies([rnd(10, 350), -rnd(10, 170)]); return { soort: 'punt', html: cirkel(a) + vraag(`Bereken de coördinaten van het punt P bij α = ${kg(a)}° (afgerond op 0,01).`), sleutel: `pu${a}`,
      antw: { soort: 'delen', delen: [{ label: 'x = \\cos \\alpha =', antw: getal(r2(cos(a)), { dec: 2 }) }, { label: 'y = \\sin \\alpha =', antw: getal(r2(sin(a)), { dec: 2 }) }] }, uitleg: [`\\cos(${a}°) \\approx ${tg(r2(cos(a)))}, \\quad \\sin(${a}°) \\approx ${tg(r2(sin(a)))}`] }; } },
    draai: { naam: 'Positief of negatief?', gen() { const a = kies([rnd(20, 330), -rnd(20, 330)]); return { soort: 'draai', html: cirkel(a, { label: false }) + vraag('Is de getekende hoek positief of negatief? (Kijk naar de draaizin van de boog.)'), sleutel: `dr${a}`,
      antw: tekstKeuze(['positief (tegenwijzerzin)', 'negatief (wijzerzin)'], a > 0 ? 'positief (tegenwijzerzin)' : 'negatief (wijzerzin)'), uitleg: [tx(a > 0 ? 'Tegen de wijzers van de klok in: positief.' : 'Met de wijzers van de klok mee: negatief.'), `\\alpha = ${a}°`] }; } },
    aflezen: { naam: 'Welke coördinaat is sin α?', gen() { const w = kies(['sin', 'cos']); return { soort: 'aflezen', html: vraag(`Welke coördinaat van P op de goniometrische cirkel is ${w} α?`), sleutel: `af${w}`, antw: tekstKeuze(['de x-coördinaat', 'de y-coördinaat'], w === 'cos' ? 'de x-coördinaat' : 'de y-coördinaat'), uitleg: ['P(\\cos \\alpha, \\; \\sin \\alpha)'] }; } },
  },
  oefenMix: [['punt', 3], ['draai', 2], ['aflezen', 2]],
  test: [['punt', 5], ['draai', 3], ['aflezen', 2]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'De kwadranten en de tekens', kort: 'Het teken van sin, cos en tan per kwadrant.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadranten</div><p>De assen verdelen de cirkel in vier kwadranten, tegen de wijzers van de klok in genummerd: I, II, III en IV.</p>${TEKENS}
    <p>$\\tan \\alpha = \\dfrac{\\sin \\alpha}{\\cos \\alpha}$: gelijke tekens geven $+$, verschillende tekens geven $-$.</p></div>${cirkel(null, { kwadranten: true })}`,
  voorbeelden: [{ tex: '\\alpha = 230°', stappen: ['230° \\text{ ligt tussen } 180° \\text{ en } 270°: \\text{ kwadrant III}', '\\cos \\alpha < 0, \\; \\sin \\alpha < 0, \\; \\tan \\alpha > 0'] }],
  soorten: {
    kwadrant: { naam: 'In welk kwadrant?', gen() { const a = hoekNiet0(); return { soort: 'kwadrant', tex: `\\alpha = ${a}°`, html: vraag('In welk kwadrant ligt het beeldpunt P?'), sleutel: `kw${a}`, antw: tekstKeuze(['I', 'II', 'III', 'IV'], kwadrantVan(a)), uitleg: [tx(`kwadrant ${kwadrantVan(a)}`)] }; } },
    teken: { naam: 'Teken van sin, cos of tan', gen() { const a = hoekNiet0(), f = kies(['sin', 'cos', 'tan']), w = f === 'sin' ? sin(a) : f === 'cos' ? cos(a) : sin(a) / cos(a);
      return { soort: 'teken', tex: `\\${f} ${a}°`, html: vraag('Is dit positief of negatief? (zonder rekenmachine)'), sleutel: `te${a}${f}`, antw: tekstKeuze(['positief', 'negatief'], w > 0 ? 'positief' : 'negatief'), uitleg: [`${a}° \\text{ ligt in kwadrant ${kwadrantVan(a)}}`, tx(w > 0 ? 'positief' : 'negatief')] }; } },
    terug: { naam: 'Kwadrant uit de tekens', gen() { const k = kies(['I', 'II', 'III', 'IV']), T = { I: ['+', '+'], II: ['−', '+'], III: ['−', '−'], IV: ['+', '−'] }[k];
      return { soort: 'terug', html: vraag(`cos α is ${T[0] === '+' ? 'positief' : 'negatief'} en sin α is ${T[1] === '+' ? 'positief' : 'negatief'}. In welk kwadrant ligt α?`), sleutel: `tr${k}`, antw: tekstKeuze(['I', 'II', 'III', 'IV'], k), uitleg: [tx(`kwadrant ${k}`)] }; } },
  },
  oefenMix: [['kwadrant', 2], ['teken', 3], ['terug', 2]],
  test: [['kwadrant', 3], ['teken', 4], ['terug', 3]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Hoeken groter dan 360° en negatieve hoeken', kort: 'sin(α + k·360°) = sin α.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Hoeken met hetzelfde eindbeen</div><p>Draai je een volledige omwenteling (360°) meer of minder, dan kom je in hetzelfde punt $P$ uit. Voor elk geheel getal $k$:</p>
    <p class="midden">$\\sin(\\alpha + k \\cdot 360°) = \\sin \\alpha \\qquad \\cos(\\alpha + k \\cdot 360°) = \\cos \\alpha \\qquad \\tan(\\alpha + k \\cdot 360°) = \\tan \\alpha$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div><p>$500° = 140° + 360°$, dus $\\sin 500° = \\sin 140°$. &nbsp; $-70° = 290° - 360°$, dus $\\cos(-70°) = \\cos 290°$.</p></div>`,
  voorbeelden: [{ tex: '\\alpha = 780°', stappen: ['780° - 2 \\cdot 360° = 60°', '\\sin 780° = \\sin 60°'] }],
  soorten: {
    herleid: { naam: 'Herleid naar 0° tot 360°', gen() { const b = rnd(1, 359), k = kies([1, 2, 3, -1, -2]), a = b + k * 360; return { soort: 'herleid', tex: `\\alpha = ${a}°`, html: vraag('Welke hoek tussen 0° en 360° heeft hetzelfde eindbeen?'), sleutel: `he${a}`,
      antw: getal(b, { na: '°' }), uitleg: [`${a}° ${k > 0 ? '-' : '+'} ${Math.abs(k)} \\cdot 360° = ${b}°`] }; } },
    kwadrant: { naam: 'Kwadrant van een grote of negatieve hoek', gen() { let b; do { b = rnd(1, 359); } while (b % 90 === 0); const a = b + kies([1, 2, -1]) * 360; return { soort: 'kwadrant', tex: `\\alpha = ${a}°`, html: vraag('In welk kwadrant ligt P?'), sleutel: `kq${a}`,
      antw: tekstKeuze(['I', 'II', 'III', 'IV'], kwadrantVan(a)), uitleg: [`${a}° \\to ${b}°`, tx(`kwadrant ${kwadrantVan(a)}`)] }; } },
    gelijk: { naam: 'Gelijke goniometrische getallen', gen() { const b = kies([20, 35, 50, 75, 110, 160, 200, 250, 300]), f = kies(['sin', 'cos', 'tan']), juist = b + 360;
      return { soort: 'gelijk', tex: `\\${f} ${b}° = \\${f} \\; ?`, html: vraag('Welke hoek geeft zeker dezelfde waarde?'), sleutel: `ge${b}${f}`, antw: texKeuze([`${juist}°`, `${b + 90}°`, `${b + 270}°`, `${360 - b === b ? b + 45 : 360 - b}°`], `${juist}°`), uitleg: [`${juist}° = ${b}° + 360°: \\text{ hetzelfde eindbeen}`] }; } },
  },
  oefenMix: [['herleid', 3], ['kwadrant', 2], ['gelijk', 2]],
  test: [['herleid', 4], ['kwadrant', 3], ['gelijk', 3]], testSchudden: true,
};

const D4 = {
  nr: 4, titel: 'De grondformule', kort: 'sin²α + cos²α = 1 · tan α = sin α / cos α.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Grondformule</div><p>$P(\\cos \\alpha, \\sin \\alpha)$ ligt op een cirkel met straal 1. Met Pythagoras volgt voor élke hoek:</p><p class="midden">$\\sin^2 \\alpha + \\cos^2 \\alpha = 1$</p>
    <p>En ook: $\\tan \\alpha = \\dfrac{\\sin \\alpha}{\\cos \\alpha}$ (met $\\cos \\alpha \\neq 0$).</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p>$\\sin \\alpha = 0{,}8$ met $\\alpha$ scherp: $\\cos^2 \\alpha = 1 - 0{,}64 = 0{,}36$, dus $\\cos \\alpha = 0{,}6$ (positief, want kwadrant I). Dan $\\tan \\alpha = \\dfrac{0{,}8}{0{,}6} \\approx 1{,}33$.</p></div>${AFSPRAAK}`,
  voorbeelden: [{ tex: '\\cos \\alpha = 0{,}28, \\; \\alpha \\text{ scherp}', stappen: ['\\sin^2 \\alpha = 1 - 0{,}28^2 = 0{,}9216', '\\sin \\alpha = 0{,}96'] }],
  soorten: {
    cos: { naam: 'cos α uit sin α (of omgekeerd)', gen() { const [p, q] = kies([[0.6, 0.8], [0.8, 0.6], [0.28, 0.96], [0.96, 0.28], [0.5, 0.87], [0.3, 0.95], [0.45, 0.89]]), wat = kies(['sin', 'cos']), gegeven = wat === 'sin' ? 'cos' : 'sin', w = r2(Math.sqrt(1 - p * p));
      return { soort: 'cos', tex: `\\${gegeven} \\alpha = ${tg(p)}, \\; \\alpha \\text{ scherp}`, html: vraag(`Bereken ${wat} α met de grondformule (afgerond op 0,01).`), sleutel: `co${p}${wat}`,
        antw: getal(w, { dec: 2, voor: `\\${wat} \\alpha =` }), uitleg: [`\\${wat}^2 \\alpha = 1 - ${tg(p)}^2 = ${tg(1 - p * p)}`, `\\${wat} \\alpha = \\sqrt{${tg(1 - p * p)}} \\approx ${tg(w)} \\text{ (positief: kwadrant I)}`] }; } },
    tan: { naam: 'tan α uit sin α en cos α', gen() { const [s, c] = kies([[0.6, 0.8], [0.8, 0.6], [0.28, 0.96], [0.96, 0.28], [0.6, -0.8], [-0.8, 0.6], [-0.28, -0.96]]); return { soort: 'tan', tex: `\\sin \\alpha = ${tg(s)}, \\; \\cos \\alpha = ${tg(c)}`, html: vraag('Bereken tan α (afgerond op 0,01).'), sleutel: `ta${s}${c}`,
      antw: getal(r2(s / c), { dec: 2, voor: '\\tan \\alpha =' }), uitleg: [`\\tan \\alpha = \\dfrac{${tg(s)}}{${tg(c)}} \\approx ${tg(r2(s / c))}`] }; } },
    kan: { naam: 'Kan dit?', gen() { const L = [[0.6, 0.8, true], [0.5, 0.5, false], [0.7, 0.7, false], [0.28, 0.96, true], [0.9, 0.3, false], [-0.6, 0.8, true]]; const [s, c, ok] = kies(L);
      return { soort: 'kan', tex: `\\sin \\alpha = ${tg(s)} \\text{ en } \\cos \\alpha = ${tg(c)}`, html: vraag('Kan dit voor eenzelfde hoek α? (Controleer met de grondformule.)'), sleutel: `ka${s}${c}`, antw: tekstKeuze(['ja', 'nee'], ok ? 'ja' : 'nee'), uitleg: [`${tg(s)}^2 + ${tg(c)}^2 = ${tg(s * s + c * c)}`, ok ? '= 1: \\text{ dat kan}' : '\\neq 1: \\text{ dat kan niet}'] }; } },
  },
  oefenMix: [['cos', 3], ['tan', 2], ['kan', 2]],
  test: [['cos', 4], ['tan', 3], ['kan', 3]], testSchudden: true,
};

const VERW = { '-': { sin: '-\\sin \\alpha', cos: '\\cos \\alpha', tan: '-\\tan \\alpha' }, '180-': { sin: '\\sin \\alpha', cos: '-\\cos \\alpha', tan: '-\\tan \\alpha' }, '180+': { sin: '-\\sin \\alpha', cos: '-\\cos \\alpha', tan: '\\tan \\alpha' }, '90-': { sin: '\\cos \\alpha', cos: '\\sin \\alpha' } };
const VTEX = { '-': '-\\alpha', '180-': '180° - \\alpha', '180+': '180° + \\alpha', '90-': '90° - \\alpha' };
const SPIEGEL = { '-': 'spiegeling t.o.v. de x-as', '180-': 'spiegeling t.o.v. de y-as', '180+': 'puntspiegeling t.o.v. de oorsprong', '90-': 'spiegeling t.o.v. de rechte y = x' };
const D5 = {
  nr: 5, titel: 'Verwante hoeken', kort: '−α, 180° − α, 180° + α en 90° − α.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Formules voor verwante hoeken</div>${VERWANT}</div>
    <div class="kader eig"><div class="kader-titel">Geheugensteun</div><ul>
      <li>$-\\alpha$: spiegeling t.o.v. de $x$-as (zelfde $x$, tegengestelde $y$)</li><li>$180° - \\alpha$: spiegeling t.o.v. de $y$-as (tegengestelde $x$, zelfde $y$)</li>
      <li>$180° + \\alpha$: puntspiegeling t.o.v. de oorsprong (beide tegengesteld)</li><li>$90° - \\alpha$: spiegeling t.o.v. de rechte $y = x$ ($x$ en $y$ wisselen)</li></ul>
      <p>Teken altijd de goniometrische cirkel erbij: de spiegeling vertelt je het teken.</p></div>`,
  voorbeelden: [{ tex: '\\cos(180° + \\alpha)', stappen: ['\\text{puntspiegeling t.o.v. de oorsprong: beide coördinaten tegengesteld}', '\\cos(180° + \\alpha) = -\\cos \\alpha'] }],
  soorten: {
    formule: { naam: 'Schrijf in functie van α', gen() { const v = kies(Object.keys(VERW)), f = kies(Object.keys(VERW[v])), juist = VERW[v][f];
      return { soort: 'formule', tex: `\\${f}(${VTEX[v]}) = \\; ?`, html: vraag('Schrijf in functie van sin α, cos α of tan α.'), sleutel: `fo${v}${f}`, antw: texKeuze([juist, ...schud(['\\sin \\alpha', '-\\sin \\alpha', '\\cos \\alpha', '-\\cos \\alpha', '\\tan \\alpha', '-\\tan \\alpha'].filter(o => o !== juist)).slice(0, 3)], juist),
        uitleg: [`\\text{${SPIEGEL[v]}}`, `\\${f}(${VTEX[v]}) = ${juist}`] }; } },
    getal: { naam: 'Met een concrete hoek', gen() { const b = kies([20, 25, 35, 40, 55, 70]), v = kies(['-', '180-', '180+']), f = kies(['sin', 'cos']), hoek = v === '-' ? -b : v === '180-' ? 180 - b : 180 + b, juist = VERW[v][f].replace('\\alpha', `${b}°`);
      return { soort: 'getal', tex: `\\${f} ${hoek}° = \\; ?`, html: vraag(`Schrijf als ± sin of ± cos van ${b}°.`), sleutel: `ge${b}${v}${f}`, antw: texKeuze([`\\sin ${b}°`, `-\\sin ${b}°`, `\\cos ${b}°`, `-\\cos ${b}°`], juist),
        uitleg: [`${hoek}° = ${VTEX[v].replace('\\alpha', `${b}°`)}`, `\\${f} ${hoek}° = ${juist}`] }; } },
    welke: { naam: 'Welke spiegeling?', gen() { const v = kies(Object.keys(VERW)); return { soort: 'welke', tex: `\\alpha \\text{ en } ${VTEX[v]}`, html: vraag('Hoe liggen de beeldpunten van deze twee hoeken ten opzichte van elkaar?'), sleutel: `we${v}`,
      antw: tekstKeuze(Object.values(SPIEGEL), SPIEGEL[v]), uitleg: [tx(SPIEGEL[v])] }; } },
  },
  oefenMix: [['formule', 3], ['getal', 2], ['welke', 2]],
  test: [['formule', 5], ['getal', 3], ['welke', 2]], testSchudden: true,
};

// uitdrukkingen vereenvoudigen: [uitdrukking, resultaat, uitleg]
const VEREENV = [
  ['\\sin(180° - \\alpha) + \\sin(-\\alpha)', '0', ['= \\sin \\alpha - \\sin \\alpha = 0']],
  ['\\cos(-\\alpha) + \\cos(180° - \\alpha)', '0', ['= \\cos \\alpha - \\cos \\alpha = 0']],
  ['\\cos(90° - \\alpha) + \\sin(180° + \\alpha)', '0', ['= \\sin \\alpha - \\sin \\alpha = 0']],
  ['\\sin(180° - \\alpha) + \\cos(90° - \\alpha)', '2\\sin \\alpha', ['= \\sin \\alpha + \\sin \\alpha = 2\\sin \\alpha']],
  ['\\cos(180° + \\alpha) - \\cos(-\\alpha)', '-2\\cos \\alpha', ['= -\\cos \\alpha - \\cos \\alpha = -2\\cos \\alpha']],
  ['\\tan \\alpha \\cdot \\cos \\alpha', '\\sin \\alpha', ['= \\dfrac{\\sin \\alpha}{\\cos \\alpha} \\cdot \\cos \\alpha = \\sin \\alpha']],
  ['\\dfrac{\\sin \\alpha}{\\tan \\alpha}', '\\cos \\alpha', ['= \\sin \\alpha \\cdot \\dfrac{\\cos \\alpha}{\\sin \\alpha} = \\cos \\alpha']],
  ['\\dfrac{1 - \\cos^2 \\alpha}{\\sin \\alpha}', '\\sin \\alpha', ['= \\dfrac{\\sin^2 \\alpha}{\\sin \\alpha}', '= \\sin \\alpha']],
  ['\\cos^3 \\alpha + \\cos \\alpha \\cdot \\sin^2 \\alpha', '\\cos \\alpha', ['= \\cos \\alpha (\\cos^2 \\alpha + \\sin^2 \\alpha)', '= \\cos \\alpha \\cdot 1 = \\cos \\alpha']],
  ['\\sin^2(-\\alpha) + \\cos^2(180° - \\alpha)', '1', ['= \\sin^2 \\alpha + \\cos^2 \\alpha', '= 1']],
  ['(\\cos \\alpha + \\sin \\alpha)^2 - 2\\sin \\alpha \\cos \\alpha', '1', ['= \\cos^2 \\alpha + 2\\sin \\alpha \\cos \\alpha + \\sin^2 \\alpha - 2\\sin \\alpha \\cos \\alpha', '= 1']],
  ['1 - \\cos^2 \\alpha', '\\sin^2 \\alpha', ['\\text{uit de grondformule: } 1 - \\cos^2 \\alpha = \\sin^2 \\alpha']],
  ['\\sin(90° - \\alpha) \\cdot \\cos(-\\alpha) + \\sin^2 \\alpha', '1', ['= \\cos \\alpha \\cdot \\cos \\alpha + \\sin^2 \\alpha', '= \\cos^2 \\alpha + \\sin^2 \\alpha = 1']],
  ['\\tan(180° + \\alpha) \\cdot \\cos(-\\alpha)', '\\sin \\alpha', ['= \\tan \\alpha \\cdot \\cos \\alpha', '= \\sin \\alpha']],
];
const UITK = ['0', '1', '2', '\\sin \\alpha', '\\cos \\alpha', '2\\sin \\alpha', '-2\\cos \\alpha', '\\sin^2 \\alpha', '\\cos^2 \\alpha', '-\\sin \\alpha', '\\tan \\alpha'];
const D6 = {
  nr: 6, titel: 'Uitdrukkingen vereenvoudigen', kort: 'Verwante hoeken, tan = sin/cos, grondformule, ontbinden.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Vaste volgorde</div><ol><li>Vervang alle <b>verwante hoeken</b> door hun uitdrukking in $\\alpha$.</li><li>Schrijf $\\tan \\alpha$ eventueel als $\\dfrac{\\sin \\alpha}{\\cos \\alpha}$.</li>
      <li>Kijk of je kan <b>ontbinden</b> (gemeenschappelijke factor) of een <b>merkwaardig product</b> herkent.</li><li>Pas de <b>grondformule</b> toe: $\\sin^2 \\alpha + \\cos^2 \\alpha = 1$.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p>$\\cos(-\\alpha) - \\cos(180° + \\alpha) = \\cos \\alpha + \\cos \\alpha = 2\\cos \\alpha$</p>
      <p>$(1 - \\cos \\alpha)(1 + \\cos \\alpha) = 1 - \\cos^2 \\alpha = \\sin^2 \\alpha$</p>
      <p>$\\sin^3 \\alpha + \\sin \\alpha \\cos^2 \\alpha = \\sin \\alpha(\\sin^2 \\alpha + \\cos^2 \\alpha) = \\sin \\alpha$</p></div>
    <div class="kader eig"><div class="kader-titel">Controle</div><p>Vul een concrete hoek in (bv. 30°) in de opgave en in je resultaat: je moet hetzelfde getal krijgen.</p></div>`,
  voorbeelden: [{ tex: '\\sin^2(180° + \\alpha) + \\cos^2 \\alpha', stappen: ['= (-\\sin \\alpha)^2 + \\cos^2 \\alpha', '= \\sin^2 \\alpha + \\cos^2 \\alpha = 1'] }],
  soorten: {
    vereenv: { naam: 'Vereenvoudig', gen() { const [e, r, u] = kies(VEREENV); return { soort: 'vereenv', tex: e, html: vraag('Vereenvoudig zo ver mogelijk.'), sleutel: `ve${e}`,
      antw: texKeuze([r, ...schud(UITK.filter(x => x !== r)).slice(0, 3)], r), uitleg: [e, ...u] }; } },
    controle: { naam: 'Controle met een hoek', gen() { const a = kies([20, 30, 40, 50]), [e, r] = kies([['(1 - \\cos \\alpha)(1 + \\cos \\alpha)', '\\sin^2 \\alpha'], ['\\tan \\alpha \\cdot \\cos \\alpha', '\\sin \\alpha'], ['\\cos^3 \\alpha + \\cos \\alpha \\sin^2 \\alpha', '\\cos \\alpha']]);
      const w = r === '\\sin^2 \\alpha' ? sin(a) ** 2 : r === '\\sin \\alpha' ? sin(a) : cos(a);
      return { soort: 'controle', tex: `${e} = ${r}`, html: vraag(`Controleer met α = ${a}°: bereken de waarde (afgerond op 0,01).`), sleutel: `ct${a}${e}`, antw: getal(r2(w), { dec: 2 }), uitleg: [`${r.replace(/\\alpha/g, `${a}°`)} \\approx ${tg(r2(w))}`, '\\text{de opgave geeft hetzelfde getal}'] }; } },
  },
  oefenMix: [['vereenv', 5], ['controle', 2]],
  test: [['vereenv', 8], ['controle', 2]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
const D7 = {
  nr: 7, titel: 'Eindtest goniometrische formules', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar.</p></div><div class="kader def"><div class="kader-titel">Tekens</div>${TEKENS}</div><div class="kader def"><div class="kader-titel">Verwante hoeken</div>${VERWANT}</div>`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'punt', 'Coördinaten van P'), e2: mix(D2, 'teken', 'Tekens'), e3: mix(D2, 'kwadrant', 'Kwadrant'), e4: mix(D3, 'herleid', 'Grote hoeken'), e5: mix(D4, 'cos', 'Grondformule'),
    e6: mix(D4, 'tan', 'tan α'), e7: mix(D5, 'formule', 'Verwante hoeken'), e8: mix(D5, 'getal', 'Verwante hoeken met getallen'), e9: mix(D6, 'vereenv', 'Vereenvoudigen'), e10: mix(D6, 'vereenv', 'Vereenvoudigen') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6, D7]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen.bind(s);
    s.gen = () => {
      const v = { ...g() };
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && `\\text{${u.slice(2)}}` === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
}

Leerpaden.registreer({
  code: 'goniometrische-formules',
  titel: 'Goniometrische formules',
  ondertitel: 'Toegepaste wiskunde · 4BW',
  klas: '4BW',
  drempel: 70,
  intro: `<p>Je werkt met de <b>goniometrische cirkel</b>, de <b>kwadranten</b>, de <b>grondformule</b> en de formules voor <b>verwante hoeken</b>, en je leert goniometrische uitdrukkingen <b>vereenvoudigen</b>.
    Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open. Zet je rekenmachine in graden.</p>`,
  groepen: [
    { titel: 'A · De goniometrische cirkel', delen: [1, 2, 3] },
    { titel: 'B · Formules', delen: [4, 5] },
    { titel: 'C · Vereenvoudigen', delen: [6] },
    { titel: 'D · Eindtest', delen: [7] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7],
});
