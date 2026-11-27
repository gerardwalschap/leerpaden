// ===== Spreidingsdiagrammen · Toegepaste wiskunde 4BW =====
// Leidraad: cursus TWiskunde 4BW hoofdstuk 11 "Spreidingsdiagrammen" (G. Walschap).
const { rnd, kies, schud } = W;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud([...new Set(opties)].map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const lijstKeuze = (opties, juist) => { const o = schud([...new Set(opties)]); return { soort: 'keuze', lijst: true, opties: o.map((t, i) => ({ k: String(i), l: t, html: true })), juist: String(o.indexOf(juist)) }; };
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const kg = (x) => String(x).replace('.', ',');
const ruis = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; // ongeveer normaal in [-1, 1]

// ---------- spreidingsdiagram als SVG
// opt: x [x0, x1, stap], y [y0, y1, stap], punten [[x, y, label?]], lijn [[xa, ya], [xb, yb]], xn, yn (aslabels)
function diagram(opt, w = 340, h = 250) {
  const [x0, x1, sx] = opt.x, [y0, y1, sy] = opt.y, L = 46, B = 36, T = 12, R = 14;
  const X = (x) => L + (x - x0) / (x1 - x0) * (w - L - R), Y = (y) => h - B - (y - y0) / (y1 - y0) * (h - B - T);
  let g = '';
  for (let x = x0; x <= x1 + 1e-9; x += sx) g += `<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" stroke="#e3e7ee"/><text x="${X(x)}" y="${Y(y0) + 14}" font-size="10" text-anchor="middle" fill="#555">${kg(W.rond(x, 2))}</text>`;
  for (let y = y0; y <= y1 + 1e-9; y += sy) g += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="#e3e7ee"/><text x="${X(x0) - 5}" y="${Y(y) + 4}" font-size="10" text-anchor="end" fill="#555">${kg(W.rond(y, 2))}</text>`;
  g += `<line x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x1)}" y2="${Y(y0)}" stroke="#1f2733" stroke-width="1.3"/><line x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x0)}" y2="${Y(y1)}" stroke="#1f2733" stroke-width="1.3"/>`;
  if (opt.xn) g += `<text x="${(X(x0) + X(x1)) / 2}" y="${h - 4}" font-size="11" text-anchor="middle" fill="#1f2733">${opt.xn}</text>`;
  if (opt.yn) g += `<text x="12" y="${(Y(y0) + Y(y1)) / 2}" font-size="11" text-anchor="middle" fill="#1f2733" transform="rotate(-90 12 ${(Y(y0) + Y(y1)) / 2})">${opt.yn}</text>`;
  if (opt.lijn) { const [[a, b], [c, d]] = opt.lijn; g += `<line x1="${X(a)}" y1="${Y(b)}" x2="${X(c)}" y2="${Y(d)}" stroke="#e8772e" stroke-width="2.4"/>`; }
  for (const [x, y, n, kl] of opt.punten) g += `<circle cx="${X(x)}" cy="${Y(y)}" r="4" fill="${kl || '#1c4e8a'}" fill-opacity="0.85"/>` + (n ? `<text x="${X(x) + 6}" y="${Y(y) - 6}" font-size="12" font-weight="bold" fill="#c2561a">${n}</text>` : '');
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="spreidingsdiagram" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}
// puntenwolk op [0,10] x [0,10]: soort 'pos' | 'neg' | 'geen' | 'krom'; s = spreiding
function wolk(soort, s = 1, n = 18) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const x = 0.5 + Math.random() * 9;
    let y = soort === 'pos' ? 1 + 0.8 * x : soort === 'neg' ? 9 - 0.8 * x : soort === 'krom' ? 0.6 + 0.1 * x * x : 1.5 + Math.random() * 7;
    if (soort !== 'geen') y += s * ruis();
    p.push([W.rond(x, 2), W.rond(Math.min(9.8, Math.max(0.2, y)), 2)]);
  }
  return p;
}
const ASSEN = { x: [0, 10, 2], y: [0, 10, 2] };
const def = (t, html) => `<div class="kader def"><div class="kader-titel">${t}</div>${html}</div>`;
const kader = (t, html, kl = '') => `<div class="kader ${kl}"><div class="kader-titel">${t}</div>${html}</div>`;

// ===================================================================
const DATA = [ // [x-naam, y-naam, punten]
  ['studietijd (uur)', 'examencijfer (op 20)', [[1, 8], [2, 9], [2, 11], [3, 10], [4, 12], [4, 14], [5, 13], [6, 15], [7, 16], [8, 17]], { x: [0, 10, 2], y: [0, 20, 4] }],
  ['leeftijd auto (jaar)', 'prijs (× 1000 euro)', [[1, 18], [2, 16], [3, 14], [3, 15], [5, 11], [6, 10], [7, 8], [8, 7], [9, 6], [10, 4]], { x: [0, 10, 2], y: [0, 20, 4] }],
  ['temperatuur (°C)', 'verkochte ijsjes', [[12, 20], [14, 30], [16, 35], [18, 50], [20, 55], [22, 70], [24, 75], [26, 90], [28, 95], [30, 110]], { x: [10, 30, 5], y: [0, 120, 20] }],
];
const D1 = {
  nr: 1, titel: 'Een spreidingsdiagram aflezen', kort: 'Elk element is een punt (x, y).', rekenmachine: false,
  theorie: `${kader('Van één naar twee veranderlijken', '<p>Tot nu toe werkte je met <b>één</b> veranderlijke (frequentietabel, histogram, gemiddelde, standaardafwijking). Wil je weten of twee veranderlijken <b>samenhangen</b>, dan gebruik je een spreidingsdiagram.</p>')}
    ${def('Spreidingsdiagram', '<p>Een grafiek waarin elk element van een dataset wordt voorgesteld door een <b>punt $(x, y)$</b>: $x$ is de waarde van de eerste veranderlijke, $y$ de waarde van de tweede.</p>')}`,
  voorbeelden: [{ html: diagram({ ...DATA[0][3], punten: DATA[0][2].map(([x, y]) => [x, y]), xn: DATA[0][0], yn: DATA[0][1] }), stappen: ['\\text{elk punt is één leerling: bv. } (6, 15): 6 \\text{ uur gestudeerd, 15 op 20}'] }],
  soorten: {
    lees: { naam: 'Een punt aflezen', gen() { const [xn, yn, P, as] = kies(DATA), i = rnd(0, P.length - 1), [x, y] = P[i], wat = kies(['x', 'y']);
      const pts = P.map(([a, b], j) => [a, b, j === i ? 'P' : '', j === i ? '#e8772e' : undefined]);
      return { soort: 'lees', html: diagram({ ...as, punten: pts, xn, yn }) + vraag(wat === 'x' ? `Wat is de waarde van “${xn}” bij het punt P?` : `Wat is de waarde van “${yn}” bij het punt P?`), sleutel: `l${xn}${i}${wat}`,
        antw: getal(wat === 'x' ? x : y), uitleg: [`P(${x}, ${y})`] }; } },
    tel: { naam: 'Punten tellen', gen() { const [xn, yn, P, as] = kies(DATA), gr = kies(P.map(p => p[1]).slice(2, 8)), n = P.filter(p => p[1] > gr).length;
      return { soort: 'tel', html: diagram({ ...as, punten: P, xn, yn }) + vraag(`Bij hoeveel punten is “${yn}” groter dan ${gr}?`), sleutel: `t${xn}${gr}`, antw: getal(n), uitleg: [tx(`Tel de punten boven de hoogte ${gr}: ${n}.`)] }; } },
    begrip: { naam: 'Wat stelt een punt voor?', gen() { const [v, j, f, u] = kies([
      ['Wat stelt één punt in een spreidingsdiagram voor?', 'één element van de dataset met zijn twee waarden', ['het gemiddelde van de dataset', 'een klasse van een histogram', 'de trendlijn'], 'Elk element (bv. één leerling) wordt één punt (x, y).'],
      ['Hoeveel veranderlijken toon je in een spreidingsdiagram?', 'twee', ['één', 'drie', 'zoveel als je wil'], 'Een spreidingsdiagram onderzoekt het verband tussen twee veranderlijken.'],
      ['Waarvoor gebruik je een spreidingsdiagram?', 'om te onderzoeken of twee veranderlijken samenhangen', ['om een frequentie te tellen', 'om het gemiddelde te berekenen', 'om één veranderlijke voor te stellen'], 'Je bekijkt of er een verband is tussen x en y.']]);
      return { soort: 'begrip', html: vraag(v), sleutel: `b${v}`, antw: lijstKeuze([j, ...f], j), uitleg: [tx(u)] }; } },
  },
  oefenMix: [['lees', 2], ['tel', 2], ['begrip', 1]],
  test: [['lees', 4], ['tel', 4], ['begrip', 2]], testSchudden: true,
};

const SOORT = { pos: 'positief verband', neg: 'negatief verband', geen: 'geen verband' };
const CONTEXT = [
  ['studietijd en examencijfer', 'positief verband'], ['leeftijd van een auto en verkoopprijs', 'negatief verband'], ['schoenmaat en resultaat op een wiskundetoets', 'geen verband'],
  ['buitentemperatuur en verkoop van warme chocolademelk', 'negatief verband'], ['lengte van een leerling en zijn huisnummer', 'geen verband'], ['trainingsuren en prestatie bij een sprint', 'positief verband'],
  ['aantal uren tv per dag en uren slaap', 'negatief verband'], ['buitentemperatuur en verkochte ijsjes', 'positief verband'], ['geboortemaand en lichaamslengte', 'geen verband'],
];
const D2 = {
  nr: 2, titel: 'Soorten verbanden', kort: 'Positief, negatief of geen verband.', rekenmachine: false,
  theorie: `${def('Positief verband', '<p>$y$ <b>stijgt</b> als $x$ stijgt: de wolk loopt van <b>linksonder naar rechtsboven</b>. Bv. meer studietijd, meestal een hoger cijfer.</p>')}
    ${def('Negatief verband', '<p>$y$ <b>daalt</b> als $x$ stijgt: de wolk loopt van <b>linksboven naar rechtsonder</b>. Bv. hoe ouder een auto, hoe lager meestal de prijs.</p>')}
    ${def('Geen verband', '<p>De punten liggen <b>willekeurig verspreid</b>, zonder stijgende of dalende tendens. Bv. schoenmaat en toetsresultaat.</p>')}`,
  voorbeelden: [{ html: diagram({ ...ASSEN, punten: wolk('neg', 0.8) }), stappen: ['\\text{van linksboven naar rechtsonder: negatief verband}'] }],
  soorten: {
    figuur: { naam: 'Welk verband zie je?', gen() { const s = kies(['pos', 'neg', 'geen']);
      return { soort: 'figuur', html: diagram({ ...ASSEN, punten: wolk(s, 0.9) }) + vraag('Welk soort verband toont dit spreidingsdiagram?'), sleutel: `f${s}${Math.random()}`, antw: tekstKeuze(Object.values(SOORT), SOORT[s]),
        uitleg: [tx({ pos: 'Van linksonder naar rechtsboven: y stijgt als x stijgt.', neg: 'Van linksboven naar rechtsonder: y daalt als x stijgt.', geen: 'Geen stijgende of dalende tendens.' }[s])] }; } },
    context: { naam: 'Wat verwacht je?', gen() { const [c, j] = kies(CONTEXT);
      return { soort: 'context', html: vraag(`Welk verband verwacht je tussen ${c}?`), sleutel: `c${c}`, antw: tekstKeuze(Object.values(SOORT), j), uitleg: [tx(j === 'geen verband' ? 'Er is geen reden om een samenhang te verwachten.' : j === 'positief verband' ? 'Als het ene stijgt, stijgt het andere meestal ook.' : 'Als het ene stijgt, daalt het andere meestal.')] }; } },
  },
  oefenMix: [['figuur', 3], ['context', 2]],
  test: [['figuur', 5], ['context', 5]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Vorm en sterkte van een verband', kort: 'Lineair of kromlijnig · sterk of zwak.', rekenmachine: false,
  theorie: `${def('Lineair versus niet-lineair', '<p>Volgen de punten ongeveer een <b>rechte</b>: <b>lineair</b> verband. Volgen ze een <b>curve</b> (bv. een parabool): <b>niet-lineair</b> of <b>kromlijnig</b> verband. Bv. de remafstand groeit kwadratisch met de snelheid (denk aan $f(x) = c \\cdot x^2$).</p>')}
    ${def('Sterkte van een verband', '<p>Hoe <b>dichter</b> de punten bij een denkbeeldige rechte (of curve) liggen, hoe <b>sterker</b> het verband. Liggen ze sterk verspreid, dan is het verband <b>zwak</b>, ook al is er een stijgende of dalende tendens.</p>')}
    ${kader('Werkwijze', '<p>Kijk eerst naar de <b>richting</b> (stijgend, dalend, geen), dan naar de <b>vorm</b> (recht of gebogen), dan naar de <b>spreiding</b> (sterk of zwak).</p>', 'eig')}`,
  voorbeelden: [{ html: diagram({ ...ASSEN, punten: wolk('krom', 0.3) }), stappen: ['\\text{stijgend, maar gebogen: kromlijnig verband}'] }],
  soorten: {
    vorm: { naam: 'Lineair of kromlijnig?', gen() { const k = kies([true, false]);
      return { soort: 'vorm', html: diagram({ ...ASSEN, punten: wolk(k ? 'krom' : kies(['pos', 'neg']), 0.3) }) + vraag('Is dit verband lineair of niet-lineair (kromlijnig)?'), sleutel: `v${k}${Math.random()}`, antw: tekstKeuze(['lineair', 'niet-lineair (kromlijnig)'], k ? 'niet-lineair (kromlijnig)' : 'lineair'),
        uitleg: [tx(k ? 'De punten volgen een curve.' : 'De punten volgen ongeveer een rechte.')] }; } },
    sterk: { naam: 'Sterk of zwak?', gen() { const r = kies(['pos', 'neg']), st = kies([true, false]);
      return { soort: 'sterk', html: diagram({ ...ASSEN, punten: wolk(r, st ? 0.35 : 2.1) }) + vraag('Is dit verband sterk of zwak?'), sleutel: `s${r}${st}${Math.random()}`, antw: tekstKeuze(['sterk', 'zwak'], st ? 'sterk' : 'zwak'),
        uitleg: [tx(st ? 'De punten liggen dicht bij een rechte: sterk verband.' : 'De punten liggen sterk verspreid rond de tendens: zwak verband.')] }; } },
    vergelijk: { naam: 'Welk is het sterkst?', gen() { const r = kies(['pos', 'neg']), eerst = kies([true, false]), sA = eerst ? 0.35 : 1.9, sB = eerst ? 1.9 : 0.35;
      return { soort: 'vergelijk', html: '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">' + diagram({ ...ASSEN, punten: wolk(r, sA) }, 260, 200).replace('<div class="figuur">', '<div class="figuur"><b>A</b>') + diagram({ ...ASSEN, punten: wolk(r, sB) }, 260, 200).replace('<div class="figuur">', '<div class="figuur"><b>B</b>') + '</div>' + vraag('Welk diagram toont het sterkste verband?'), sleutel: `g${r}${eerst}${Math.random()}`,
        antw: tekstKeuze(['A', 'B'], eerst ? 'A' : 'B'), uitleg: [tx('Het sterkste verband heeft de punten het dichtst bij een rechte.')] }; } },
  },
  oefenMix: [['vorm', 2], ['sterk', 2], ['vergelijk', 1]],
  test: [['vorm', 3], ['sterk', 4], ['vergelijk', 3]], testSchudden: true,
};

// trendlijn y = a + b x met mooie waarden
function trendData() {
  for (;;) { const b = kies([0.5, 1, 1.5, 2, -0.5, -1, -1.5]), a = b > 0 ? kies([1, 2, 3]) : kies([14, 16, 18]); const y = (x) => a + b * x;
    if (y(10) < 0.5 || y(10) > 19.5) continue;
    const P = [...Array(12)].map(() => { const x = W.rond(0.5 + Math.random() * 9, 1); return [x, W.rond(y(x) + 1.3 * ruis(), 1)]; });
    return { a, b, y, P }; }
}
const D4 = {
  nr: 4, titel: 'De trendlijn', kort: 'Voorspellen door af te lezen op de trendlijn.', rekenmachine: false,
  theorie: `${def('Trendlijn', '<p>De <b>trendlijn</b> is de rechte die het best bij de puntenwolk past. Je tekent ze <b>met het oog</b>: ongeveer <b>even veel punten boven als onder</b> de rechte, zo dicht mogelijk bij alle punten. Je houdt rekening met <b>alle</b> punten, niet enkel met het eerste en het laatste.</p>')}
    ${def('Voorspellen', '<p>Op de trendlijn lees je de $y$-waarde af die bij een $x$-waarde past. Ligt die $x$ <b>binnen</b> het bereik van je data, dan <b>interpoleer</b> je; ligt ze <b>buiten</b> het bereik, dan <b>extrapoleer</b> je.</p>')}
    ${kader('Let op', '<p>Een trendlijn geeft een <b>schatting</b>, geen exact resultaat. Extrapoleren ver buiten je data is extra onzeker.</p>', 'eig')}`,
  voorbeelden: [{ html: diagram({ x: [0, 10, 2], y: [0, 20, 4], punten: DATA[0][2], lijn: [[0, 7], [10, 19]], xn: 'studietijd (uur)', yn: 'examencijfer' }), stappen: ['\\text{bij 5 uur lees je op de trendlijn af: ongeveer } 13'] }],
  soorten: {
    aflezen: { naam: 'Aflezen op de trendlijn', gen() { const T = trendData(), x = kies([2, 4, 6, 8].filter(v => Number.isInteger(T.y(v)))) ?? 4; if (!Number.isInteger(T.y(x))) return this.gen();
      return { soort: 'aflezen', html: diagram({ x: [0, 10, 2], y: [0, 20, 2], punten: T.P, lijn: [[0, T.y(0)], [10, T.y(10)]] }) + vraag(`Lees op de trendlijn af: welke y-waarde past bij x = ${x}?`), sleutel: `a${T.a}${T.b}${x}`,
        antw: getal(T.y(x)), uitleg: [tx(`Ga verticaal omhoog vanaf x = ${x} tot de trendlijn, en dan horizontaal naar de y-as: ${T.y(x)}.`)] }; } },
    inter: { naam: 'Interpoleren of extrapoleren?', gen() { const x0 = kies([1, 2]), x1 = kies([8, 9]), x = kies([4, 5, 6, 12, 15, 20, 0.5 * x0]), binnen = x >= x0 && x <= x1;
      return { soort: 'inter', html: opgave(`Een dataset heeft x-waarden van ${x0} tot ${x1}. Je voorspelt met de trendlijn de y-waarde bij x = ${kg(x)}.`) + vraag('Interpoleer of extrapoleer je?'), sleutel: `i${x0}${x1}${x}`,
        antw: tekstKeuze(['interpoleren', 'extrapoleren'], binnen ? 'interpoleren' : 'extrapoleren'), uitleg: [tx(binnen ? 'x ligt binnen het bereik van de data.' : 'x ligt buiten het bereik van de data: extra onzeker.')] }; } },
    goed: { naam: 'Een goede trendlijn', gen() { const [v, j, f, u] = kies([
      ['Hoe teken je een trendlijn?', 'met ongeveer even veel punten boven als onder de rechte', ['door het eerste en het laatste punt', 'door zoveel mogelijk punten', 'altijd door de oorsprong'], 'De trendlijn volgt de algemene tendens van álle punten.'],
      ['Waarom gebruik je niet enkel het eerste en het laatste punt?', 'die twee punten kunnen toevallig afwijken van de tendens', ['dat mag wel', 'omdat die altijd uitschieters zijn', 'omdat de trendlijn horizontaal moet zijn'], 'Alle punten samen bepalen de tendens.'],
      ['Wat geeft een voorspelling met een trendlijn?', 'een schatting', ['een exact resultaat', 'altijd een geheel getal', 'de juiste meetwaarde'], 'De punten liggen niet precies op de lijn: je voorspelling is een schatting.'],
      ['Wat is het meest onzeker?', 'extrapoleren ver buiten het bereik van de data', ['interpoleren', 'aflezen bij een gemeten punt', 'een punt tekenen'], 'Buiten je data weet je niet of de tendens zich voortzet.']]);
      return { soort: 'goed', html: vraag(v), sleutel: `g${v}`, antw: lijstKeuze([j, ...f], j), uitleg: [tx(u)] }; } },
  },
  oefenMix: [['aflezen', 2], ['inter', 2], ['goed', 1]],
  test: [['aflezen', 4], ['inter', 3], ['goed', 3]], testSchudden: true,
};

const CAUS = [
  ['In de zomer stijgen de verkoop van zonnecrème en het aantal verkochte barbecues.', 'het warme weer'],
  ['Kinderen met grotere voeten kunnen gemiddeld beter lezen.', 'de leeftijd van de kinderen'],
  ['Hoe meer brandweerlieden bij een brand, hoe groter de schade.', 'de grootte van de brand'],
  ['Gemeenten met meer bibliotheken hebben meer verkeersongevallen.', 'het aantal inwoners'],
  ['In weken met meer verkochte paraplu’s zijn er meer files.', 'het regenweer'],
];
const DERDE = ['het warme weer', 'de leeftijd van de kinderen', 'de grootte van de brand', 'het aantal inwoners', 'het regenweer'];
const D5 = {
  nr: 5, titel: 'Uitschieters en correlatie versus causaliteit', kort: 'Een punt buiten de tendens · samenhang is geen oorzaak.', rekenmachine: false,
  theorie: `${def('Uitschieter', '<p>Een punt dat <b>duidelijk buiten de algemene tendens</b> van de andere punten valt. Het kan wijzen op een meetfout, een uitzonderlijk geval of toeval. Negeer het niet zomaar: ga na of er een goede verklaring is.</p>')}
    ${def('Correlatie is geen oorzakelijk verband', '<p>Een <b>correlatie</b> toont enkel dat twee veranderlijken samenhangen. Dat betekent niet dat de ene de andere <b>veroorzaakt</b> (<b>causaliteit</b>). Vaak hangen beide samen met een <b>derde factor</b>. Voor een oorzakelijk verband heb je bijkomend (vaak experimenteel) bewijs nodig.</p>')}`,
  voorbeelden: [{ tex: '\\text{meer verkochte ijsjes en meer zonnebrillen}', stappen: ['\\text{correlatie: beide stijgen samen}', '\\text{geen oorzaak: beide hangen af van het zonnige weer}'] }],
  soorten: {
    uitschieter: { naam: 'Welk punt is de uitschieter?', gen() { const r = kies(['pos', 'neg']), P = [...Array(12)].map((_, i) => { const x = W.rond(0.6 + i * 0.8 + 0.2 * Math.random(), 2), y = r === 'pos' ? 1 + 0.8 * x : 9 - 0.8 * x; return [x, W.rond(y + 0.45 * ruis(), 2)]; }), lab = 'ABCDE', idx = [1, 3, 5, 8, 10], u = kies([...Array(5).keys()]);
      const i = idx[u], [x] = P[i], yt = r === 'pos' ? 1 + 0.8 * x : 9 - 0.8 * x; P[i] = [x, W.rond(yt > 5 ? yt - 4.5 : yt + 4.5, 2)];
      const pts = P.map((p, j) => [p[0], p[1], idx.includes(j) ? lab[idx.indexOf(j)] : '']);
      return { soort: 'uitschieter', html: diagram({ ...ASSEN, punten: pts }) + vraag('Welk punt is een uitschieter?'), sleutel: `u${Math.random()}`, antw: tekstKeuze([...lab], lab[u]), uitleg: [tx(`Punt ${lab[u]} ligt duidelijk buiten de tendens van de andere punten.`)] }; } },
    derde: { naam: 'Welke derde factor?', gen() { const [z, j] = kies(CAUS);
      return { soort: 'derde', html: opgave(z) + vraag('Welke derde factor verklaart deze correlatie het best?'), sleutel: `d${z}`, antw: lijstKeuze([j, ...schud(DERDE.filter(d => d !== j)).slice(0, 3)], j), uitleg: [tx(`Beide hangen samen met ${j}: dat is geen oorzakelijk verband.`)] }; } },
    besluit: { naam: 'Correct besluit?', gen() { const [v, j, f, u] = kies([
      ['Scholen met meer computers per leerling halen gemiddeld hogere toetsresultaten. Mag je besluiten dat computers betere resultaten veroorzaken?', 'nee, een correlatie is geen bewijs van een oorzaak', ['ja, het verband is duidelijk', 'ja, als het verband sterk is', 'nee, want het verband is negatief'], 'Er kunnen andere factoren meespelen, bv. het budget van de school.'],
      ['Wat heb je nodig om te besluiten dat x de oorzaak is van y?', 'bijkomend, vaak experimenteel bewijs', ['enkel een sterk verband', 'een trendlijn', 'een uitschieter'], 'Een correlatie alleen volstaat niet.'],
      ['Wat is een correlatie?', 'een samenhang tussen twee veranderlijken', ['een oorzakelijk verband', 'een meetfout', 'een uitschieter'], 'Correlatie = samenhang, causaliteit = oorzaak.'],
      ['Wat doe je met een uitschieter?', 'nagaan of er een goede verklaring voor is', ['hem altijd schrappen', 'hem altijd behouden zonder nadenken', 'de trendlijn erdoor tekenen'], 'Een uitschieter kan een meetfout zijn, maar ook belangrijke informatie.']]);
      return { soort: 'besluit', html: vraag(v), sleutel: `b${v}`, antw: lijstKeuze([j, ...f], j), uitleg: [tx(u)] }; } },
  },
  oefenMix: [['uitschieter', 2], ['derde', 2], ['besluit', 1]],
  test: [['uitschieter', 3], ['derde', 4], ['besluit', 3]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D6 = {
  nr: 6, titel: 'Eindtest spreidingsdiagrammen', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `${kader('Alles samen', '<ul><li>elk element is een punt $(x, y)$</li><li>richting: positief, negatief of geen verband</li><li>vorm: lineair of kromlijnig</li><li>sterkte: hoe dichter bij de trendlijn, hoe sterker</li><li>trendlijn: interpoleren en (voorzichtig) extrapoleren</li><li>uitschieters · correlatie is geen causaliteit</li></ul>')}`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'lees', 'Aflezen'), e2: mix(D2, 'figuur', 'Soort verband'), e3: mix(D2, 'context', 'Verwacht verband'), e4: mix(D3, 'vorm', 'Vorm'), e5: mix(D3, 'sterk', 'Sterkte'),
    e6: mix(D4, 'aflezen', 'Trendlijn'), e7: mix(D4, 'inter', 'Interpoleren'), e8: mix(D5, 'uitschieter', 'Uitschieter'), e9: mix(D5, 'derde', 'Derde factor'), e10: mix(D5, 'besluit', 'Correlatie') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6]) {
  for (const s of Object.values(D.soorten)) {
    if (s._ingepakt) continue; s._ingepakt = true;
    const g = s.gen.bind(s);
    s.gen = () => {
      const v = { ...g() };
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
}

Leerpaden.registreer({
  code: 'spreidingsdiagrammen',
  titel: 'Spreidingsdiagrammen',
  ondertitel: 'Toegepaste wiskunde · 4BW',
  klas: '4BW',
  drempel: 70,
  intro: `<p>Je onderzoekt het verband tussen <b>twee veranderlijken</b> met een spreidingsdiagram: positief, negatief of geen verband, lineair of kromlijnig, sterk of zwak. Je leest af op een <b>trendlijn</b>, herkent <b>uitschieters</b> en leert dat <b>correlatie geen oorzakelijk verband</b> is.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [
    { titel: 'A · Spreidingsdiagrammen lezen', delen: [1, 2, 3] },
    { titel: 'B · Trendlijn en kritisch kijken', delen: [4, 5] },
    { titel: 'C · Eindtest', delen: [6] },
  ],
  delen: [D1, D2, D3, D4, D5, D6],
});
