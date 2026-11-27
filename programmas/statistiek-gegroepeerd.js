// Programma 'statistiek-gegroepeerd' — automatisch samengevoegd uit bron/statistiek-gegroepeerd/ (niet rechtstreeks bewerken)
(() => {
// ===== Statistiek: gegroepeerde gegevens · Wiskunde 4BW-MWW =====
// Leidraad: cursus Wiskunde 4BW-4MWW hoofdstuk 7 "Statistiek" (G. Walschap): herhaling 3e jaar, aantal klassen (√n naar boven), klassenbreedte,
// gegroepeerde frequentietabel (afi, cafi, rfi, crfi), modale klasse, mediaanklasse, gewogen gemiddelde, standaardafwijking via klassenmiddens, histogram.
const { rnd, kies, schud } = W;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud([...new Set(opties)].map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const lijstKeuze = (opties, juist) => { const o = schud([...new Set(opties)]); return { soort: 'keuze', lijst: true, opties: o.map((t, i) => ({ k: String(i), l: t, html: true })), juist: String(o.indexOf(juist)) }; };
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const kg = (x) => String(x).replace('.', ',');
const tg = (x) => W.texGetal(W.rond(x, 4));
const def = (t, html) => `<div class="kader def"><div class="kader-titel">${t}</div>${html}</div>`;
const kader = (t, html, kl = '') => `<div class="kader ${kl}"><div class="kader-titel">${t}</div>${html}</div>`;
const tabelHtml = (rijen) => `<table class="tabel">${rijen.map((r, i) => `<tr>${r.map(c => i ? `<td>${c}</td>` : `<th>${c}</th>`).join('')}</tr>`).join('')}</table>`;

// ---------- dataset en gegroepeerde tabel volgens de cursus
const CONTEXT = [['reistijden naar school (minuten)', 5, 60], ['toetsresultaten (op 50)', 10, 50], ['lengtes van leerlingen (cm)', 148, 192], ['aantal stappen per dag (× 100)', 20, 140], ['wachttijden aan de kassa (seconden)', 30, 240]];
function dataset() {
  const [naam, lo, hi] = kies(CONTEXT), n = rnd(20, 40), d = [...Array(n)].map(() => rnd(lo, hi)).sort((a, b) => a - b);
  const k = Math.ceil(Math.sqrt(n)), min = d[0], max = d[n - 1], R = max - min, b = Math.ceil(R / k);
  const kl = [...Array(k)].map((_, i) => { const o = min + i * b, bo = o + b, laatst = i === k - 1; return { o, b: bo, laatst, m: (o + bo) / 2, afi: d.filter(x => x >= o && (laatst ? x <= bo : x < bo)).length }; });
  let c = 0; kl.forEach(x => { c += x.afi; x.cafi = c; x.rfi = 100 * x.afi / n; x.crfi = 100 * c / n; });
  const gem = kl.reduce((a, x) => a + x.m * x.afi, 0) / n, sd = Math.sqrt(kl.reduce((a, x) => a + x.afi * (x.m - gem) ** 2, 0) / n);
  return { naam, n, d, k, min, max, R, b, kl, gem, sd };
}
const kn = (x) => `[${x.o}, ${x.b}${x.laatst ? ']' : '['}`;
const tabel = (S, kol = ['afi']) => tabelHtml([['klasse', 'klassenmidden', ...kol], ...S.kl.map(x => [kn(x), kg(x.m), ...kol.map(c => c === 'afi' ? x.afi : c === 'cafi' ? x.cafi : c === 'rfi (%)' ? kg(W.rond(x.rfi, 2)) : kg(W.rond(x.crfi, 2)))])]);
const lijst = (S) => `<p class="opgave-tekst" style="word-spacing:4px">${S.d.join(', ')}</p>`;
function histogram(S, w = 360, h = 230) {
  const L = 40, B = 34, T = 12, R = 10, mx = Math.max(...S.kl.map(x => x.afi)), top = Math.ceil((mx + 1) / 2) * 2;
  const X = (v) => L + (v - S.min) / (S.k * S.b) * (w - L - R), Y = (f) => h - B - f / top * (h - B - T);
  let g = '';
  for (let f = 0; f <= top; f += 2) g += `<line x1="${L}" y1="${Y(f)}" x2="${w - R}" y2="${Y(f)}" stroke="#e3e7ee"/><text x="${L - 5}" y="${Y(f) + 4}" font-size="10" text-anchor="end" fill="#555">${f}</text>`;
  S.kl.forEach(x => { g += `<rect x="${X(x.o)}" y="${Y(x.afi)}" width="${X(x.b) - X(x.o)}" height="${Y(0) - Y(x.afi)}" fill="#1c4e8a" fill-opacity="0.75" stroke="#fff" stroke-width="1"/>`; });
  S.kl.forEach(x => { g += `<text x="${X(x.o)}" y="${h - B + 14}" font-size="10" text-anchor="middle" fill="#555">${x.o}</text>`; });
  g += `<text x="${X(S.kl[S.k - 1].b)}" y="${h - B + 14}" font-size="10" text-anchor="middle" fill="#555">${S.kl[S.k - 1].b}</text>`;
  g += `<line x1="${L}" y1="${Y(0)}" x2="${w - R}" y2="${Y(0)}" stroke="#1f2733"/><line x1="${L}" y1="${Y(0)}" x2="${L}" y2="${T}" stroke="#1f2733"/><text x="${(L + w) / 2}" y="${h - 4}" font-size="11" text-anchor="middle">${S.naam}</text><text x="12" y="${h / 2}" font-size="11" text-anchor="middle" transform="rotate(-90 12 ${h / 2})">afi</text>`;
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="histogram" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}
const VB = { naam: 'metingen', n: 30, d: [12, 15, 17, 18, 19, 21, 22, 24, 25, 27, 29, 30, 32, 34, 35, 37, 38, 40, 42, 44, 45, 47, 49, 50, 52, 54, 55, 57, 59, 60] };

// ===================================================================
const SOORT = [['het aantal broers en zussen', 'discreet'], ['de lengte van een leerling', 'continu'], ['de tijd op de 60 meter', 'continu'], ['het aantal doelpunten in een match', 'discreet'], ['het gewicht van een boekentas', 'continu'], ['het aantal sms’jes per dag', 'discreet'],
  ['je lievelingskleur', 'categorisch'], ['de studierichting', 'categorisch'], ['het merk van je gsm', 'categorisch']];
const D1 = {
  nr: 1, titel: 'Herhaling: begrippen uit het 3e jaar', kort: 'Soorten gegevens, centrum- en spreidingsmaten.', rekenmachine: true,
  theorie: `${def('Soorten gegevens', tabelHtml([['soort', 'betekenis'], ['discreet', 'enkel bepaalde, aftelbare waarden (bv. aantal broers en zussen)'], ['continu', 'elke waarde in een interval (bv. lengte, tijd, gewicht)'], ['numeriek', 'voor te stellen met een getal'], ['categorisch', 'ingedeeld in categorieën, zonder natuurlijke volgorde van getallen']]))}
    ${def('Centrum- en spreidingsmaten', tabelHtml([['maat', 'betekenis'], ['gemiddelde', 'som van alle waarden gedeeld door het aantal'], ['mediaan', 'middelste waarde na rangschikken'], ['modus', 'waarde die het vaakst voorkomt'], ['bereik', 'grootste − kleinste waarde'], ['standaardafwijking', 'hoe ver de gegevens gemiddeld van het gemiddelde liggen']]))}
    <p>De <b>frequentie</b> is hoe vaak een waarde voorkomt; de <b>relatieve frequentie</b> is die frequentie gedeeld door het totaal.</p>`,
  voorbeelden: [{ tex: '3, \; 5, \; 5, \; 6, \; 8, \; 9', stappen: ['\\text{gemiddelde} = 36 : 6 = 6', '\\text{mediaan} = (5 + 6) : 2 = 5{,}5, \\quad \\text{modus} = 5, \\quad \\text{bereik} = 9 - 3 = 6'] }],
  soorten: {
    soort: { naam: 'Soort gegevens', gen() { const [g, j] = kies(SOORT); return { soort: 'soort', html: vraag(`Welk soort gegevens is ${g}?`), sleutel: `s${g}`, antw: tekstKeuze(['discreet', 'continu', 'categorisch'], j), uitleg: [tx(j === 'discreet' ? 'Enkel aftelbare waarden.' : j === 'continu' ? 'Elke waarde in een interval is mogelijk.' : 'Ingedeeld in categorieën.')] }; } },
    maat: { naam: 'Centrummaat of bereik', gen() { const n = kies([5, 6, 7, 8]); let d; do { d = [...Array(n)].map(() => rnd(1, 15)).sort((a, b) => a - b); } while (new Set(d).size > n - 1);
      const tel = {}; d.forEach(x => tel[x] = (tel[x] || 0) + 1); const mx = Math.max(...Object.values(tel)), modi = Object.keys(tel).filter(k => tel[k] === mx); if (modi.length > 1) return this.gen();
      const wat = kies(['gemiddelde', 'mediaan', 'modus', 'bereik']), med = n % 2 ? d[(n - 1) / 2] : (d[n / 2 - 1] + d[n / 2]) / 2, som = d.reduce((a, b) => a + b, 0);
      const w = { gemiddelde: W.rond(som / n, 2), mediaan: med, modus: +modi[0], bereik: d[n - 1] - d[0] }[wat];
      return { soort: 'maat', tex: d.join(', \; '), html: vraag(`Bepaal ${wat === 'bereik' ? 'het bereik' : `de ${wat}`}${wat === 'gemiddelde' ? ' (afgerond op 0,01)' : ''}.`), sleutel: `m${d.join()}${wat}`, antw: getal(w, { dec: 2 }),
        uitleg: [{ gemiddelde: `\\frac{${som}}{${n}} \\approx ${tg(w)}`, mediaan: n % 2 ? `\\text{middelste waarde: } ${med}` : `\\frac{${d[n / 2 - 1]} + ${d[n / 2]}}{2} = ${tg(med)}`, modus: `${w} \\text{ komt het vaakst voor}`, bereik: `${d[n - 1]} - ${d[0]} = ${w}` }[wat]] }; } },
  },
  oefenMix: [['soort', 2], ['maat', 3]],
  test: [['soort', 4], ['maat', 6]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Klassen opstellen', kort: 'Aantal klassen √n · klassenbreedte · klassenmidden.', rekenmachine: true,
  theorie: `${kader('Waarom groeperen?', '<p>Bij veel verschillende waarden is het overzichtelijker om de gegevens in <b>klassen</b> te verdelen.</p>')}
    ${def('Regels uit de cursus', '<ol><li><b>Aantal klassen</b> $= \\sqrt{\\text{aantal metingen}}$, naar boven afgerond.</li><li><b>Variatiebreedte</b> = grootste − kleinste waarde.</li><li><b>Klassenbreedte</b> = variatiebreedte : aantal klassen, naar boven afgerond.</li><li>Start bij de kleinste waarde en tel telkens de klassenbreedte erbij. Elke klasse is <b>halfopen</b> $[\\text{ondergrens}, \\text{bovengrens}[$; enkel de laatste klasse is aan beide zijden gesloten.</li><li><b>Klassenmidden</b> = (ondergrens + bovengrens) : 2.</li></ol>')}`,
  voorbeelden: [{ tex: '30 \\text{ metingen van } 12 \\text{ tot } 60', stappen: ['\\sqrt{30} \\approx 5{,}477 \\Rightarrow 6 \\text{ klassen}', '\\text{variatiebreedte} = 60 - 12 = 48, \\quad \\text{klassenbreedte} = 48 : 6 = 8', '[12, 20[, \; [20, 28[, \; \\ldots, \; [52, 60] \\quad \\text{klassenmidden van } [12, 20[: 16'] }],
  soorten: {
    aantal: { naam: 'Aantal klassen', gen() { const n = rnd(12, 120); if (Number.isInteger(Math.sqrt(n)) && rnd(0, 1)) return this.gen(); const k = Math.ceil(Math.sqrt(n));
      return { soort: 'aantal', html: vraag(`Je hebt ${n} metingen. Hoeveel klassen gebruik je?`), sleutel: `a${n}`, antw: getal(k), uitleg: [`\\sqrt{${n}} \\approx ${tg(W.rond(Math.sqrt(n), 3))} \\Rightarrow ${k} \\text{ (naar boven afgerond)}`] }; } },
    breedte: { naam: 'Klassenbreedte', gen() { const mn = rnd(0, 40), mx = mn + rnd(25, 90), k = rnd(4, 8), R = mx - mn, b = Math.ceil(R / k);
      return { soort: 'breedte', html: opgave(`De kleinste waarde is ${mn}, de grootste ${mx}. Je gebruikt ${k} klassen.`), sleutel: `b${mn}${mx}${k}`,
        antw: { soort: 'delen', delen: [{ label: '\\text{variatiebreedte}', antw: getal(R) }, { label: '\\text{klassenbreedte}', antw: getal(b) }] }, uitleg: [`${mx} - ${mn} = ${R}`, `${R} : ${k} ${R % k ? `\\approx ${tg(W.rond(R / k, 2))} \\Rightarrow ${b}` : `= ${b}`}`] }; } },
    midden: { naam: 'Klassenmidden', gen() { const o = rnd(0, 80), b = kies([4, 5, 6, 8, 10, 12, 15]), m = o + b / 2;
      return { soort: 'midden', html: vraag(`Wat is het klassenmidden van de klasse [${o}, ${o + b}[?`), sleutel: `m${o}${b}`, antw: getal(m, { dec: 1 }), uitleg: [`\\frac{${o} + ${o + b}}{2} = ${tg(m)}`] }; } },
    klasse: { naam: 'In welke klasse?', gen() { const S = dataset(), i = rnd(0, S.k - 1), x = S.kl[i], v = rnd(x.o, x.laatst ? x.b : x.b - 1), grens = rnd(0, 2) === 0 && i > 0 ? x.o : v;
      return { soort: 'klasse', html: opgave(`De klassen zijn ${S.kl.map(kn).join(', ')}.`) + vraag(`In welke klasse komt de waarde ${grens}?`), sleutel: `k${S.min}${S.b}${grens}`, antw: tekstKeuze(S.kl.map(kn), kn(x)),
        uitleg: [tx(grens === x.o ? `${grens} is een ondergrens: die hoort bij de klasse ${kn(x)} (halfopen interval).` : `${grens} ligt in ${kn(x)}.`)] }; } },
  },
  oefenMix: [['aantal', 1], ['breedte', 2], ['midden', 1], ['klasse', 1]],
  test: [['aantal', 2], ['breedte', 3], ['midden', 2], ['klasse', 3]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'De gegroepeerde frequentietabel', kort: 'afi, cafi, rfi en crfi per klasse.', rekenmachine: true,
  theorie: `${def('De tabel afwerken', '<ul><li><b>afi</b>: absolute frequentie, het aantal waarden in de klasse</li><li><b>cafi</b>: cumulatieve frequentie, de afi’s opgeteld tot en met die klasse</li><li><b>rfi</b>: relatieve frequentie $= \\dfrac{\\text{afi}}{n} \\cdot 100\\%$</li><li><b>crfi</b>: cumulatieve relatieve frequentie</li></ul><p>Controle: de som van alle afi en de laatste cafi zijn gelijk aan $n$; de laatste crfi is 100 %.</p>')}
    ${kader('Excel-tip', '<p>AANTALARG (aantal metingen), WORTEL en AFRONDEN.BOVEN (aantal klassen), MAX en MIN (variatiebreedte), en AANTALLEN.ALS(gegevens;"&gt;="&amp;ondergrens;gegevens;"&lt;"&amp;bovengrens) voor de afi.</p>', 'eig')}`,
  voorbeelden: [{ html: tabelHtml([['klasse', 'afi', 'cafi', 'rfi (%)', 'crfi (%)'], ['[12, 20[', '5', '5', '16,67', '16,67'], ['[20, 28[', '5', '10', '16,67', '33,33'], ['[28, 36[', '5', '15', '16,67', '50,00'], ['[36, 44[', '4', '19', '13,33', '63,33'], ['[44, 52[', '5', '24', '16,67', '80,00'], ['[52, 60]', '6', '30', '20,00', '100,00']]), stappen: ['\\text{rfi van } [36, 44[: \; \\frac{4}{30} \\cdot 100\\% \\approx 13{,}33\\%'] }],
  soorten: {
    afi: { naam: 'afi tellen', gen() { const S = dataset(), i = rnd(0, S.k - 1), x = S.kl[i];
      return { soort: 'afi', html: opgave(`${S.n} ${S.naam}, gerangschikt:`) + lijst(S) + vraag(`Hoeveel waarden liggen in de klasse ${kn(x)}?`), sleutel: `f${S.d.join()}${i}`, antw: getal(x.afi), uitleg: [tx(`Tel de waarden van ${x.o} tot ${x.laatst ? 'en met' : '(niet met)'} ${x.b}: ${x.afi}.`)] }; } },
    cafi: { naam: 'cafi', gen() { const S = dataset(), i = rnd(1, S.k - 1), x = S.kl[i];
      return { soort: 'cafi', html: tabel(S, ['afi']) + vraag(`Wat is de cafi van de klasse ${kn(x)}?`), sleutel: `c${S.d.join()}${i}`, antw: getal(x.cafi), uitleg: [`${S.kl.slice(0, i + 1).map(y => y.afi).join(' + ')} = ${x.cafi}`] }; } },
    rfi: { naam: 'rfi', gen() { const S = dataset(), i = rnd(0, S.k - 1), x = S.kl[i];
      return { soort: 'rfi', html: tabel(S, ['afi']) + vraag(`Wat is de rfi van de klasse ${kn(x)} in % (afgerond op 0,01)?`), sleutel: `r${S.d.join()}${i}`, antw: getal(W.rond(x.rfi, 2), { dec: 2, na: '\\%' }), uitleg: [`\\frac{${x.afi}}{${S.n}} \\cdot 100\\% \\approx ${tg(W.rond(x.rfi, 2))}\\%`] }; } },
    crfi: { naam: 'Hoeveel procent minder dan …?', gen() { const S = dataset(), i = rnd(0, S.k - 2), x = S.kl[i];
      return { soort: 'crfi', html: tabel(S, ['afi', 'cafi']) + vraag(`Hoeveel procent van de waarden is kleiner dan ${x.b} (afgerond op 0,01)?`), sleutel: `p${S.d.join()}${i}`, antw: getal(W.rond(x.crfi, 2), { dec: 2, na: '\\%' }), uitleg: [`\\text{crfi} = \\frac{${x.cafi}}{${S.n}} \\cdot 100\\% \\approx ${tg(W.rond(x.crfi, 2))}\\%`] }; } },
  },
  oefenMix: [['afi', 1], ['cafi', 2], ['rfi', 1], ['crfi', 1]],
  test: [['afi', 2], ['cafi', 3], ['rfi', 3], ['crfi', 2]], testSchudden: true,
};

const D4 = {
  nr: 4, titel: 'Centrum- en spreidingsmaten van gegroepeerde gegevens', kort: 'Modale klasse, mediaanklasse, gewogen gemiddelde, standaardafwijking.', rekenmachine: true,
  theorie: `${kader('Rekenen met het klassenmidden', '<p>Bij gegroepeerde gegevens ken je de individuele waarden niet meer: je rekent met het <b>klassenmidden</b> als schatting voor alle waarden in die klasse.</p>')}
    ${def('Maten', '<ul><li><b>modale klasse</b>: de klasse met de hoogste afi</li><li><b>mediaanklasse</b>: de klasse waarin de mediaan valt; zoek ze met de cafi</li><li><b>gewogen gemiddelde</b> $= \\dfrac{\\sum (\\text{klassenmidden} \\times \\text{afi})}{n}$</li><li><b>standaardafwijking</b>: vergelijk elk klassenmidden met het gewogen gemiddelde, weeg met de afi en neem de vierkantswortel. Met je rekenmachine: voer de klassenmiddens in met de afi als frequentie.</li></ul>')}
    <p class="klein">Het gewogen gemiddelde ligt dicht bij het echte gemiddelde, maar niet exact: dat is de prijs voor het overzicht.</p>`,
  voorbeelden: [{ tex: '\\text{klassenmiddens } 16, 24, 32, 40, 48, 56 \\text{ met afi } 5, 5, 5, 4, 5, 6', stappen: ['\\text{modale klasse: } [52, 60] \; (\\text{afi} = 6)', '\\text{mediaan tussen de 15de en 16de waarde: cafi 15 en 19} \\Rightarrow [36, 44[', '\\bar{x} = \\frac{80 + 120 + 160 + 160 + 240 + 336}{30} = \\frac{1096}{30} \\approx 36{,}53, \\quad s \\approx 14{,}1'] }],
  soorten: {
    modaal: { naam: 'Modale klasse', gen() { let S; do { S = dataset(); } while (S.kl.filter(x => x.afi === Math.max(...S.kl.map(y => y.afi))).length > 1); const x = S.kl.find(y => y.afi === Math.max(...S.kl.map(z => z.afi)));
      return { soort: 'modaal', html: tabel(S, ['afi']) + vraag('Wat is de modale klasse?'), sleutel: `o${S.d.join()}`, antw: tekstKeuze(S.kl.map(kn), kn(x)), uitleg: [tx(`De hoogste afi is ${x.afi}: ${kn(x)}.`)] }; } },
    mediaan: { naam: 'Mediaanklasse', gen() { const S = dataset(), med = S.n % 2 ? S.d[(S.n - 1) / 2] : (S.d[S.n / 2 - 1] + S.d[S.n / 2]) / 2, x = S.kl.find(y => med >= y.o && (y.laatst ? med <= y.b : med < y.b));
      const pos = S.n % 2 ? `de ${(S.n + 1) / 2}de waarde` : `tussen de ${S.n / 2}de en de ${S.n / 2 + 1}de waarde`;
      return { soort: 'mediaan', html: opgave(`${S.n} ${S.naam}, gerangschikt:`) + lijst(S) + tabel(S, ['afi', 'cafi']) + vraag('Wat is de mediaanklasse?'), sleutel: `md${S.d.join()}`, antw: tekstKeuze(S.kl.map(kn), kn(x)), uitleg: [tx(`De mediaan is ${pos}: ${kg(med)}. Die ligt in ${kn(x)}.`)] }; } },
    gewogen: { naam: 'Gewogen gemiddelde', gen() { const S = dataset();
      return { soort: 'gewogen', html: tabel(S, ['afi']) + vraag(`Bereken het gewogen gemiddelde (n = ${S.n}, afgerond op 0,01).`), sleutel: `g${S.d.join()}`, antw: getal(W.rond(S.gem, 2), { dec: 2 }),
        uitleg: [`\\frac{${S.kl.map(x => `${tg(x.m)} \\cdot ${x.afi}`).join(' + ')}}{${S.n}}`, `= \\frac{${tg(S.kl.reduce((a, x) => a + x.m * x.afi, 0))}}{${S.n}} \\approx ${tg(W.rond(S.gem, 2))}`] }; } },
    sd: { naam: 'Standaardafwijking', gen() { const S = dataset();
      return { soort: 'sd', opdracht: 'Voer de klassenmiddens in met de afi als frequentie in je rekenmachine.', html: tabel(S, ['afi']) + vraag('Bereken de standaardafwijking via de klassenmiddens (afgerond op 0,1).'), sleutel: `sd${S.d.join()}`, antw: getal(W.rond(S.sd, 1), { dec: 1 }),
        uitleg: [`\\bar{x} \\approx ${tg(W.rond(S.gem, 2))}`, `\\sigma = \\sqrt{\\frac{\\sum \\text{afi} \\cdot (\\text{klassenmidden} - \\bar{x})^2}{${S.n}}} \\approx ${tg(W.rond(S.sd, 1))}`] }; } },
  },
  oefenMix: [['modaal', 1], ['mediaan', 2], ['gewogen', 1], ['sd', 1]],
  test: [['modaal', 2], ['mediaan', 3], ['gewogen', 3], ['sd', 2]], testSchudden: true,
};

const D5 = {
  nr: 5, titel: 'Het histogram', kort: 'Klassen op de x-as, afi op de y-as, staven raken elkaar.', rekenmachine: false,
  theorie: `${def('Histogram', '<p>De grafische voorstelling van een gegroepeerde frequentietabel: op de $x$-as de klassen, op de $y$-as de afi (of rfi).</p><p>De staven <b>raken elkaar</b>, omdat de klassen een doorlopende schaal vormen. Bij een <b>staafdiagram</b> (categorische gegevens) staat er wél ruimte tussen de staven.</p>')}`,
  voorbeelden: [{ html: histogram({ ...VB, k: 6, b: 8, min: 12, kl: [[12, 5], [20, 5], [28, 5], [36, 4], [44, 5], [52, 6]].map(([o, f], i) => ({ o, b: o + 8, afi: f, laatst: i === 5 })) }), stappen: ['\\text{hoogste staaf: } [52, 60], \\quad \\text{kleiner dan } 36: 5 + 5 + 5 = 15'] }],
  soorten: {
    lees: { naam: 'Afi aflezen', gen() { const S = dataset(), x = kies(S.kl);
      return { soort: 'lees', html: histogram(S) + vraag(`Hoeveel waarden liggen in de klasse ${kn(x)}?`), sleutel: `h${S.d.join()}${x.o}`, antw: getal(x.afi), uitleg: [tx(`Lees de hoogte van de staaf boven ${kn(x)}: ${x.afi}.`)] }; } },
    kleiner: { naam: 'Kleiner dan …', gen() { const S = dataset(), i = rnd(0, S.k - 2), x = S.kl[i];
      return { soort: 'kleiner', html: histogram(S) + vraag(`Hoeveel waarden zijn kleiner dan ${x.b}?`), sleutel: `kl${S.d.join()}${i}`, antw: getal(x.cafi), uitleg: [`${S.kl.slice(0, i + 1).map(y => y.afi).join(' + ')} = ${x.cafi}`] }; } },
    totaal: { naam: 'Totaal aantal', gen() { const S = dataset(); return { soort: 'totaal', html: histogram(S) + vraag('Hoeveel metingen zijn er in totaal?'), sleutel: `t${S.d.join()}`, antw: getal(S.n), uitleg: [`${S.kl.map(y => y.afi).join(' + ')} = ${S.n}`] }; } },
    begrip: { naam: 'Histogram of staafdiagram?', gen() { const [v, j, f, u] = kies([
      ['Waarom raken de staven van een histogram elkaar?', 'de klassen vormen een doorlopende schaal', ['om plaats te besparen', 'omdat de gegevens categorisch zijn', 'dat is een afspraak zonder reden'], 'Gegroepeerde (continue) gegevens: geen gaten tussen de klassen.'],
      ['Bij welke gegevens gebruik je een staafdiagram met ruimte tussen de staven?', 'categorische gegevens', ['gegroepeerde continue gegevens', 'lengtes in cm', 'reistijden'], 'Categorieën hebben geen doorlopende schaal.'],
      ['Wat staat op de y-as van een histogram?', 'de afi (of de rfi)', ['de klassenmiddens', 'de klassengrenzen', 'het gemiddelde'], 'De hoogte van een staaf is de frequentie van de klasse.']]);
      return { soort: 'begrip', html: vraag(v), sleutel: `bg${v}`, antw: lijstKeuze([j, ...f], j), uitleg: [tx(u)] }; } },
  },
  oefenMix: [['lees', 2], ['kleiner', 1], ['totaal', 1], ['begrip', 1]],
  test: [['lees', 3], ['kleiner', 3], ['totaal', 2], ['begrip', 2]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht }; } });
const D6 = {
  nr: 6, titel: 'Eindtest statistiek', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: kader('Alles samen', '<ul><li>aantal klassen $= \\sqrt{n}$ naar boven; klassenbreedte = variatiebreedte : aantal klassen, naar boven</li><li>klassen $[o, b[$, laatste $[o, b]$; klassenmidden $= (o + b) : 2$</li><li>afi, cafi, rfi, crfi</li><li>modale klasse, mediaanklasse, gewogen gemiddelde via klassenmiddens</li><li>histogram: staven raken elkaar</li></ul>'),
  voorbeelden: [],
  soorten: { e1: mix(D1, 'maat', 'Centrummaat'), e2: mix(D2, 'aantal', 'Aantal klassen'), e3: mix(D2, 'breedte', 'Klassenbreedte'), e4: mix(D2, 'klasse', 'Klasse'), e5: mix(D3, 'cafi', 'cafi'),
    e6: mix(D3, 'rfi', 'rfi'), e7: mix(D4, 'mediaan', 'Mediaanklasse'), e8: mix(D4, 'gewogen', 'Gewogen gemiddelde'), e9: mix(D5, 'kleiner', 'Histogram'), e10: mix(D5, 'begrip', 'Histogram') },
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
  code: 'statistiek-gegroepeerd', titel: 'Statistiek: gegroepeerde gegevens', ondertitel: 'Wiskunde · 4BW-MWW', klas: '4BW-MWW', drempel: 70,
  intro: `<p>Je herhaalt de begrippen uit het 3e jaar en leert werken met <b>gegroepeerde gegevens</b>: klassen opstellen, de frequentietabel afwerken (afi, cafi, rfi, crfi), de modale klasse, de mediaanklasse, het gewogen gemiddelde en de standaardafwijking bepalen, en een <b>histogram</b> lezen.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Herhaling', delen: [1] }, { titel: 'B · Gegroepeerde gegevens', delen: [2, 3, 4] }, { titel: 'C · Histogram', delen: [5] }, { titel: 'D · Eindtest', delen: [6] }],
  delen: [D1, D2, D3, D4, D5, D6],
});
})();
