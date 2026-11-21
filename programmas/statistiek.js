// Programma 'statistiek' — automatisch samengevoegd uit bron/statistiek/ (niet rechtstreeks bewerken)
(() => {
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
      <p>Bij sommige vragen krijg je een <b>rekenblad</b>. De gegevens staan al in kolom A (in A1 staat de titel). In kolom C typ je een formule die met <b>=</b> begint.
      Onder de cel zie je meteen de uitkomst. De website kijkt je formule na.</p>
      <p class="klein">Tussen de argumenten zet je een puntkomma (;), decimalen schrijf je met een komma. De Engelse namen (AVERAGE, NORM.DIST, TRUE, met komma's en punten) werken ook.</p></div>`;

const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
// ===================================================================
//  A · STEEKPROEVEN (delen 1–3)
// ===================================================================
// [situatie, populatie, steekproef, foute populaties, foute steekproeven]
const ONDERZOEKEN = [
  ['Een gemeente wil weten hoeveel inwoners een elektrische auto hebben. Ze stuurt een vragenlijst naar {n} inwoners.', 'alle inwoners van de gemeente', 'de {n} aangeschreven inwoners', ['alle Belgen met een elektrische auto', 'alle elektrische auto’s'], ['alle inwoners met een elektrische auto', 'de inwoners die een auto hebben']],
  ['Een koekjesfabriek wil weten of de pakjes van één week genoeg wegen. Ze weegt {n} pakjes uit de productie van die week.', 'alle pakjes koekjes van die week', 'de {n} gewogen pakjes', ['alle koekjesfabrieken', 'alle pakjes die te weinig wegen'], ['de pakjes die te weinig wegen', 'alle pakjes van die week']],
  ['Een sportclub wil weten of haar leden een nieuwe kantine willen. {n} leden vullen de vragenlijst in.', 'alle leden van de sportclub', 'de {n} leden die de vragenlijst invulden', ['alle sporters van België', 'de leden die een nieuwe kantine willen'], ['alle leden van de sportclub', 'de leden die een nieuwe kantine willen']],
  ['Een onderzoeker wil weten hoe lang Belgische jongeren per nacht slapen. Hij bevraagt {n} jongeren.', 'alle Belgische jongeren', 'de {n} bevraagde jongeren', ['alle Belgen', 'alle jongeren die weinig slapen'], ['alle Belgische jongeren', 'de jongeren die weinig slapen']],
  ['Een appelteler wil weten hoeveel zijn appels van dit jaar wegen. Hij weegt {n} appels uit zijn oogst.', 'alle appels van zijn oogst van dit jaar', 'de {n} gewogen appels', ['alle appels van België', 'de zwaarste appels'], ['alle appels van zijn oogst', 'de appels aan één boom']],
  ['Een tv-zender wil weten hoeveel Vlaamse gezinnen naar een programma keken. Bij {n} gezinnen staat een meetkastje.', 'alle Vlaamse gezinnen', 'de {n} gezinnen met een meetkastje', ['alle kijkers van die zender', 'alle gezinnen die naar het programma keken'], ['alle Vlaamse gezinnen', 'de gezinnen die naar het programma keken']],
  ['Een lampenfabriek test {n} lampen uit de productie van één dag: ze laten ze branden tot ze stuk zijn.', 'alle lampen van die dag', 'de {n} geteste lampen', ['alle lampen die stukgaan', 'alle lampenfabrieken'], ['alle lampen van die dag', 'de lampen die stukgingen']],
  ['De directie wil weten hoeveel leerlingen van de school een studentenjob hebben. De computer kiest lukraak {n} leerlingen uit de leerlingenlijst.', 'alle leerlingen van de school', 'de {n} gekozen leerlingen', ['alle leerlingen met een studentenjob', 'alle Vlaamse leerlingen'], ['alle leerlingen van de school', 'de leerlingen met een studentenjob']],
  ['Een supermarktketen wil weten wat haar klanten van de nieuwe kassa’s vinden. Op één zaterdag worden {n} klanten bevraagd.', 'alle klanten van de supermarktketen', 'de {n} bevraagde klanten', ['alle Belgen', 'de klanten op zaterdag'], ['alle klanten van de supermarktketen', 'alle klanten op zaterdag']],
];
const WAAROM = [
  ['Een lampenfabriek wil weten hoe lang haar lampen branden. Waarom test ze niet alle lampen?', 'Dat is onmogelijk: een geteste lamp brandt tot ze stuk is, en dan heb je niets meer om te verkopen.'],
  ['Een onderzoeker wil weten hoeveel uur Belgen per dag op hun gsm zitten. Waarom bevraagt hij niet alle Belgen?', 'Iedereen bevragen kost veel te veel tijd en geld (en is eigenlijk onmogelijk).'],
  ['Een wijnboer proeft enkele flessen om te weten of de wijn van dit jaar goed is. Waarom proeft hij niet alle flessen?', 'Dan zou hij alle flessen openmaken: er blijft niets over om te verkopen.'],
  ['Een stad wil weten wat de inwoners van de fietspaden vinden. Waarom bevraagt ze niet alle inwoners?', 'Alle inwoners bevragen kost te veel tijd en geld.'],
];
const D1 = {
  nr: 1, titel: 'Populatie en steekproef', kort: 'De volledige groep en het deel dat je echt onderzoekt.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Populatie en steekproef</div>
      <ul><li>De <b>populatie</b> is de volledige groep waarover je iets wil te weten komen.</li><li>Een <b>steekproef</b> is het deel van de populatie dat je echt onderzoekt.</li></ul>
      <p><b>Waarom?</b> Iedereen onderzoeken kost te veel tijd of geld, of het is onmogelijk (je kan niet elke Belg bevragen, en een lamp die je test tot ze stuk is, kan je niet meer verkopen).
      Met een steekproef wil je een besluit trekken over de hele populatie.</p></div>
    <div class="kader eig"><div class="kader-titel">Hoe komen we naar school?</div>
      <p>De leerlingenraad bevraagt aan de balie de leerlingen die 's morgens te laat komen.</p>
      ${htmlTabel([['onderzoeksvraag', 'Met welk vervoermiddel komen de leerlingen naar school?'], ['populatie', 'alle leerlingen van de school'], ['steekproef', 'de leerlingen die ’s morgens te laat komen']], false)}
      <p>Goed beeld? <b>Nee</b>: laatkomers komen vaker met de bus of de tram. Fietsers en voetgangers zitten er te weinig in.</p></div>`,
  voorbeelden: [
    { tex: '\\text{De stad bevraagt 500 inwoners over de nieuwe fietspaden.}', stappen: ['\\text{populatie: alle inwoners van de stad}', '\\text{steekproef: de 500 bevraagde inwoners}'] },
    { tex: '\\text{Een fabriek test 50 lampen uit de productie van één dag.}', stappen: ['\\text{populatie: alle lampen van die dag}', '\\text{steekproef: de 50 geteste lampen}'] },
  ],
  soorten: {
    populatie: { naam: 'Wat is de populatie?', gen() {
      const [s, p, st, fp] = kies(ONDERZOEKEN), n = kies([50, 80, 100, 150, 200, 300, 500, 600, 1000]), zin = s.replace('{n}', n);
      return { soort: 'populatie', opdracht: 'Wat is de populatie?', html: opgave(zin), sleutel: zin + 'p', rapport: zin + ' (populatie)',
        antw: zinKeuze(p, [st.replace('{n}', n), ...fp]), uitleg: [`\\text{populatie: ${p}}`, `\\text{steekproef: ${st.replace('{n}', n)}}`] };
    } },
    steekproef: { naam: 'Wat is de steekproef?', gen() {
      const [s, p, st, , fs] = kies(ONDERZOEKEN), n = kies([50, 80, 100, 150, 200, 300, 500, 600, 1000]), zin = s.replace('{n}', n);
      return { soort: 'steekproef', opdracht: 'Wat is de steekproef?', html: opgave(zin), sleutel: zin + 's', rapport: zin + ' (steekproef)',
        antw: zinKeuze(st.replace('{n}', n), fs), uitleg: [`\\text{populatie: ${p}}`, `\\text{steekproef: ${st.replace('{n}', n)}}`] };
    } },
    waarom: { naam: 'Waarom een steekproef?', gen() {
      const [v, j] = kies(WAAROM);
      return { soort: 'waarom', opdracht: 'Kies het beste antwoord.', html: opgave(v), sleutel: v, rapport: v,
        antw: zinKeuze(j, ['Met een steekproef krijg je altijd precies hetzelfde resultaat als bij de hele populatie.', 'Een steekproef is altijd betrouwbaarder dan iedereen onderzoeken.', 'Een populatie kan je nooit tellen.'].concat(WAAROM.filter(w => w[1] !== j).map(w => w[1]).slice(0, 1))),
        uitleg: ['\\text{iedereen onderzoeken kost te veel tijd of geld, of is onmogelijk}'] };
    } },
  },
  oefenMix: [['populatie', 2], ['steekproef', 2], ['waarom', 1]],
  test: [['populatie', 4], ['steekproef', 4], ['waarom', 2]], testSchudden: true,
};

// ---- 2. Een goede steekproef ---------------------------------------------------------------------------
// [situatie, probleem: 0 = niet aselect, 1 = te klein, 2 = te veel non-respons, 3 = goede steekproef, uitleg]
const STEEKPROEVEN = [
  ['De stad wil weten wat de inwoners van de sportvoorzieningen vinden en bevraagt de bezoekers van het jeugdhuis.', 0, 'Enkel jongeren, en vooral jongeren die naar het jeugdhuis gaan: niet iedereen heeft evenveel kans.'],
  ['Een onderzoeksbureau belt overdag naar vaste telefoonnummers om te weten wat Belgen van het openbaar vervoer vinden.', 0, 'Wie overdag werkt of geen vaste lijn heeft (veel jongeren), wordt niet bereikt.'],
  ['Om te weten of de leerlingen van de school een later startuur willen, bevraag je alleen je eigen klas.', 0, 'Eén klas, één leeftijd, één richting: niet aselect en niet representatief.'],
  ['Een krant vraagt haar lezers online hoeveel uur ze per dag sporten. Wie wil, vult de vragenlijst in.', 0, 'Enkel lezers van die krant, en ze kiezen zelf of ze meedoen: niet aselect.'],
  ['Een autowebsite houdt een online poll over een lagere snelheidslimiet. 25 000 bezoekers stemmen. De website besluit iets over alle Belgen.', 0, 'Groot is niet genoeg: enkel bezoekers van een autowebsite, en ze kiezen zelf of ze stemmen.'],
  ['Om te weten hoe de leerlingen naar school komen, bevraag je de leerlingen in de fietsenstalling.', 0, 'Enkel fietsers: wie met de bus, tram of te voet komt, zit er niet in.'],
  ['Om te weten wat de leerlingen van de schoolmaaltijden vinden, bevraag je de leerlingen die in de refter eten.', 0, 'Wie zijn boterhammen meebrengt of naar huis gaat, wordt niet bevraagd.'],
  ['Lien bevraagt 5 lukraak gekozen leerlingen van de school over een langere middagpauze.', 1, 'Aselect, maar veel te klein: met 5 leerlingen bepaalt het toeval het resultaat.'],
  ['Om te weten wat de 1200 inwoners van een dorp van een nieuw plein vinden, kiest de computer lukraak 4 inwoners uit het bevolkingsregister.', 1, 'Aselect, maar veel te klein: 4 inwoners zeggen bijna niets over het hele dorp.'],
  ['De school stuurt een enquête over de schoolmaaltijden naar 800 ouders. Er komen 120 antwoorden terug, vooral van ontevreden ouders.', 2, 'Grote non-respons: de meeste ouders antwoorden niet, en wie antwoordt is vooral ontevreden.'],
  ['Een gemeente kiest lukraak 1000 inwoners en stuurt hen een vragenlijst over afval. Slechts 90 inwoners sturen ze terug, vooral wie boos is over de afvalophaling.', 2, 'Aselect gekozen, maar te veel non-respons: de antwoorden komen vooral uit één groep.'],
  ['Een computer kiest lukraak 200 namen uit de volledige lijst van alle inwoners van de stad, en ze antwoorden allemaal.', 3, 'Aselect uit de volledige populatie, groot genoeg en geen non-respons.'],
  ['De computer kiest uit de volledige leerlingenlijst lukraak 100 leerlingen uit alle jaren en richtingen. Ze vullen de vragenlijst allemaal in tijdens een lesuur.', 3, 'Aselect, groot genoeg en geen non-respons: een goede steekproef.'],
  ['Een fabriek kiest lukraak 60 pakken suiker uit de volledige productie van een dag en weegt ze allemaal.', 3, 'Aselect uit de hele dagproductie, groot genoeg en alle pakken worden gewogen.'],
];
const PROBLEEM = ['niet aselect: niet iedereen heeft evenveel kans', 'te klein: het toeval bepaalt het resultaat', 'te veel non-respons', 'goede steekproef: representatief'];
const D2 = {
  nr: 2, titel: 'Een goede steekproef', kort: 'Representatief: aselect, groot genoeg en weinig non-respons.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een goede steekproef</div>
      <p>Een goede steekproef is <b>representatief</b>: een goede afspiegeling van de populatie. Alle deelgroepen zitten er in de juiste verhouding in. Daarvoor let je op:</p>
      <ul><li><b>aselect</b> kiezen: elk element van de populatie heeft evenveel kans om gekozen te worden (bv. lukraak door een computer uit een volledige lijst);</li>
      <li><b>voldoende groot</b>: een te kleine steekproef geeft toevallige resultaten;</li>
      <li>weinig <b>non-respons</b>: als veel gekozen mensen niet antwoorden, en dat zijn vooral mensen uit één groep, wordt het resultaat scheef.</li></ul>
      <p class="midden"><b>Groot ≠ goed: eerst representatief, dan groot genoeg!</b></p>
      <p class="klein">10 000 antwoorden van alleen maar fietsers zeggen niets over alle leerlingen.</p></div>
    <div class="kader eig"><div class="kader-titel">Lessen pas om 9u00?</div>
      ${htmlTabel([['steekproef', 'probleem'], ['alleen je eigen klas bevragen', 'één klas, één leeftijd: niet representatief'], ['leerlingen die tijdens de examens vroeg vertrekken', 'enkel bepaalde graden: niet representatief'],
        ['laatkomers tussen 8u30 en 10u10', 'zijn waarschijnlijk vaker voor: niet representatief'], ['computer kiest lukraak 100 leerlingen uit de volledige lijst, iedereen antwoordt', '<b>goede steekproef</b>']])}</div>`,
  voorbeelden: [
    { tex: '\\text{Enquête naar 800 ouders, 120 antwoorden. Hoeveel procent antwoordde?}', stappen: ['800 \\text{ ouders is } 100\\,\\%', '\\text{dus 8 ouders is } 1\\,\\% \\text{ en 120 ouders is } 15\\,\\%', '\\text{85\\,\\% antwoordde niet: grote non-respons}'] },
  ],
  soorten: {
    goed: { naam: 'Representatief of niet?', gen() {
      const [s, p, u] = kies(STEEKPROEVEN), ok = p === 3;
      const fout = ok ? ['Niet representatief: de steekproef is te klein.', 'Niet representatief: een computer kan niet eerlijk kiezen.', 'Niet representatief: je moet altijd iedereen bevragen.']
        : ['Wel representatief: de steekproef is groot genoeg.', 'Wel representatief: iedereen die gekozen werd, heeft geantwoord.', 'Wel representatief: elke steekproef geeft een goed beeld.'];
      return { soort: 'goed', opdracht: 'Is de steekproef representatief? Kies de juiste uitleg.', html: opgave(s), sleutel: s, rapport: s,
        antw: zinKeuze(`${ok ? 'Wel' : 'Niet'} representatief. ${u}`, fout), uitleg: [`\\text{${PROBLEEM[p]}}`] };
    } },
    probleem: { naam: 'Wat is het probleem?', gen() {
      const [s, p, u] = kies(STEEKPROEVEN);
      return { soort: 'probleem', opdracht: 'Wat is er met deze steekproef (niet) in orde?', html: opgave(s), sleutel: s + 'p', rapport: s + ' (probleem)',
        antw: keuze(kT(PROBLEEM), p, { lijst: true }), uitleg: [`\\text{${u.replace(/’/g, "'")}}`] };
    } },
    nonrespons: { naam: 'Non-respons in procent', gen() {
      const C = kies([['De school stuurt een enquête naar {N} ouders. Er komen {k} antwoorden terug.', 'ouders'], ['Een gemeente stuurt een vragenlijst naar {N} lukraak gekozen inwoners. {k} inwoners sturen hem terug.', 'inwoners'],
        ['Een jeugdbeweging mailt een vragenlijst naar {N} leden. {k} leden antwoorden.', 'leden'], ['Een bedrijf vraagt {N} klanten per mail om een score te geven. {k} klanten doen dat.', 'klanten']]);
      let N, k; do { N = kies([200, 400, 500, 800, 1000, 1200, 1500, 2000, 250, 50]); k = Math.round(N * rnd(8, 60) / 100); } while (!ex(100 * k / N) || k < 5);
      const zin = C[0].replace('{N}', N).replace('{k}', k), v = kies(['wel', 'niet']), p = v === 'wel' ? 100 * k / N : 100 - 100 * k / N;
      return { soort: 'nonrespons', opdracht: `Hoeveel procent ${v === 'wel' ? 'heeft geantwoord' : 'heeft niet geantwoord (de non-respons)'}?`, html: opgave(zin), sleutel: zin + v, rapport: zin + ` (${v})`,
        antw: pct(r1(p), { dec: 1 }), uitleg: v === 'wel' ? pctUitleg(k, N, C[1]) : [...pctUitleg(k, N, C[1]), `\\text{niet geantwoord: } 100\\,\\% - ${tg(r1(100 * k / N))}\\,\\% = ${tg(r1(p))}\\,\\%`] };
    } },
  },
  oefenMix: [['goed', 2], ['probleem', 2], ['nonrespons', 1]],
  test: [['goed', 4], ['probleem', 4], ['nonrespons', 2]], testSchudden: true,
};

// ---- 3. Besluiten over de populatie ------------------------------------------------------------------------
const BESLUITEN = [
  { ond: 'Uit de volledige leerlingenlijst van onze school kiest de computer lukraak {N} leerlingen. Ze antwoorden allemaal. {k} van hen komen met de bus naar school.', pop: 'de leerlingen van onze school', wat: 'komt met de bus naar school', wb: 'met de bus naar school komt', ruim: ['alle Antwerpse leerlingen', 'alle Vlaamse leerlingen'] },
  { ond: 'Uit de volledige leerlingenlijst van onze school kiest de computer lukraak {N} leerlingen. Ze antwoorden allemaal. {k} van hen zijn voor een later startuur.', pop: 'de leerlingen van onze school', wat: 'is voor een later startuur', wb: 'voor een later startuur is', ruim: ['alle Vlaamse leerlingen', 'alle leerlingen van België'] },
  { ond: 'Een gemeente kiest lukraak {N} inwoners uit het bevolkingsregister. Ze antwoorden allemaal. {k} van hen hebben een zonnepaneel.', pop: 'de inwoners van de gemeente', wat: 'heeft zonnepanelen', wb: 'zonnepanelen heeft', ruim: ['alle Belgen', 'alle inwoners van de provincie'] },
  { ond: 'Een sportclub kiest lukraak {N} leden uit de ledenlijst. Ze antwoorden allemaal. {k} van hen willen op zondag trainen.', pop: 'de leden van de sportclub', wat: 'wil op zondag trainen', wb: 'op zondag wil trainen', ruim: ['alle Belgische sporters', 'alle sportclubs'] },
  { ond: 'Een appelteler weegt {N} lukraak gekozen appels uit zijn oogst. {k} appels wegen meer dan 150 g.', pop: 'de appels van zijn oogst', wat: 'weegt meer dan 150 g', wb: 'meer dan 150 g weegt', ruim: ['alle Belgische appels', 'alle appels van de wereld'] },
];
function besluitGetallen() { let N, k; do { N = kies([50, 80, 100, 120, 150, 200, 250, 300, 400, 500]); k = Math.round(N * rnd(12, 78) / 100); } while (!Number.isInteger(100 * k / N)); return { N, k, p: 100 * k / N }; }
const D3 = {
  nr: 3, titel: 'Besluiten over de populatie', kort: 'Een besluit geldt enkel voor de populatie, als schatting: "ongeveer …".', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een besluit formuleren</div>
      <p>Met het resultaat van een steekproef doe je een uitspraak over de populatie. Dat mag alleen als de steekproef <b>representatief</b> is, en dan nog blijft het een <b>schatting</b>.</p>
      <p class="midden"><b>Een besluit geldt alleen voor de populatie waaruit je koos, en alleen als de steekproef representatief is. Formuleer het als schatting: "ongeveer …".</b></p></div>
    <div class="kader eig"><div class="kader-titel">Een later startuur?</div>
      <p>120 lukraak gekozen leerlingen van onze school: 78 zijn voor een later startuur.</p>
      ${htmlTabel([['aantal leerlingen', '120', '6', '78'], ['procent', '100 %', '5 %', '65 %']])}<p class="klein midden">120 : 20 = 6, dus 100 % : 20 = 5 %; 6 · 13 = 78, dus 5 % · 13 = 65 %</p>
      <p><b>Goed:</b> "Ongeveer 65 % van de leerlingen van onze school is voor."<br><b>Fout:</b> "65 % van alle Vlaamse leerlingen is voor." De populatie is onze school, niet heel Vlaanderen.</p></div>`,
  voorbeelden: [
    { tex: '\\text{200 lukraak gekozen leerlingen, 46 komen met de bus. Hoeveel procent?}', stappen: ['200 \\text{ is } 100\\,\\%', '\\text{dus 2 is } 1\\,\\% \\text{ en 46 is } 23\\,\\%', '\\text{besluit: ongeveer 23\\,\\% van de leerlingen van onze school komt met de bus}'] },
  ],
  soorten: {
    procent: { naam: 'Procent van de steekproef', gen() {
      const B = kies(BESLUITEN), g = besluitGetallen(), zin = B.ond.replace('{N}', g.N).replace('{k}', g.k);
      return { soort: 'procent', opdracht: 'Hoeveel procent van de steekproef is dat?', html: opgave(zin), sleutel: zin, rapport: zin, antw: pct(g.p), uitleg: pctUitleg(g.k, g.N) };
    } },
    besluit: { naam: 'Een correct besluit', gen() {
      const B = kies(BESLUITEN), g = besluitGetallen(), zin = B.ond.replace('{N}', g.N).replace('{k}', g.k), P = tekst(g.p);
      return { soort: 'besluit', opdracht: 'Welk besluit is correct?', html: opgave(zin), sleutel: zin + 'b', rapport: zin + ' (besluit)',
        antw: zinKeuze(`Ongeveer ${P} % van ${B.pop} ${B.wat}.`, [`Ongeveer ${P} % van ${B.ruim[0]} ${B.wat}.`, `Precies ${P} % van ${B.pop} ${B.wat}, niet meer en niet minder.`, `${P} % van ${B.ruim[1]} ${B.wat}.`]),
        uitleg: [`\\text{${g.k} van de ${g.N} is ${P}\\,\\%}`, `\\text{het besluit geldt enkel voor ${B.pop}, als schatting (ongeveer)}`] };
    } },
    mag: { naam: 'Mag je dat besluiten?', gen() {
      const B = kies(BESLUITEN), g = besluitGetallen(), zin = B.ond.replace('{N}', g.N).replace('{k}', g.k), P = tekst(g.p), r = kies(B.ruim);
      const v = kies(['ruim', 'klein', 'ok']);
      if (v === 'ruim') return { soort: 'mag', opdracht: `Mag je besluiten dat ongeveer ${P} % van ${r} ${B.wb}?`, html: opgave(zin), sleutel: zin + r, rapport: zin + ' (veralgemenen)',
        antw: zinKeuze(`Nee: de populatie is ${B.pop}. Over ${r} zegt deze steekproef niets.`, ['Ja: de steekproef is aselect, dus het besluit geldt overal.', `Ja: ${g.N} is een grote steekproef.`, 'Nee: je mag nooit iets besluiten uit een steekproef.']),
        uitleg: ['\\text{een besluit geldt alleen voor de populatie waaruit de steekproef gekozen werd}'] };
      if (v === 'klein') {
        const n = kies([4, 5, 6, 8, 10]), k = rnd(1, n - 1), p = r1(100 * k / n), nm = kies(['Lien', 'Arne', 'Sofia', 'Daan']);
        const z2 = `${nm} kiest lukraak ${n} leerlingen van de school. ${k} van hen willen een langere middagpauze. ${nm} besluit: "${tekst(p)} % van de leerlingen van onze school wil een langere middagpauze."`;
        return { soort: 'mag', opdracht: 'Wat vind je van dat besluit?', html: opgave(z2), sleutel: z2, rapport: z2,
          antw: zinKeuze(`Niet betrouwbaar: de steekproef is aselect, maar met ${n} leerlingen veel te klein. Het toeval bepaalt het resultaat.`, ['Correct: de leerlingen werden lukraak gekozen.', 'Niet betrouwbaar: je mag nooit lukraak kiezen.', 'Correct, maar je moet het percentage afronden.']),
          uitleg: ['\\text{eerst representatief, dan groot genoeg}', `\\text{${n} leerlingen is veel te weinig}`] };
      }
      return { soort: 'mag', opdracht: `Mag je besluiten dat ongeveer ${P} % van ${B.pop} ${B.wb}?`, html: opgave(zin), sleutel: zin + 'ok', rapport: zin + ' (besluit ok)',
        antw: zinKeuze('Ja: de steekproef is aselect gekozen uit die populatie, groot genoeg en zonder non-respons. Het blijft wel een schatting.', [`Nee: je moet ${B.pop.replace(/^de /, 'alle ')} onderzoeken.`, 'Nee: een besluit mag je enkel over de steekproef zelf maken.', `Ja, en het geldt ook voor ${r}.`]),
        uitleg: ['\\text{representatieve steekproef uit die populatie: het besluit mag, als schatting}'] };
    } },
  },
  oefenMix: [['procent', 2], ['besluit', 2], ['mag', 2]],
  test: [['procent', 3], ['besluit', 4], ['mag', 3]], testSchudden: true,
};
// ===================================================================
//  B · GEGEVENS VERWERKEN (delen 4–5)
// ===================================================================
// gegevensreeksen: k klassen van breedte w vanaf g0
const REEKSEN = [
  { t: '{N} leerlingen noteren hoeveel minuten ze nodig hebben om naar school te komen.', g0: 0, w: 10, k: 5, m: 23, s: 10, e: 'min', xn: 'tijd (min)' },
  { t: 'De lengte (in cm) van {N} leerlingen.', g0: 150, w: 10, k: 4, m: 171, s: 8, e: 'cm', xn: 'lengte (cm)' },
  { t: '{N} leerlingen maken een toets op 40. Dit zijn hun punten.', g0: 10, w: 5, k: 6, m: 26, s: 6, e: 'punten', xn: 'punten op 40' },
  { t: '{N} jongeren noteren hoeveel minuten ze gisteren op hun gsm zaten.', g0: 0, w: 60, k: 5, m: 150, s: 55, e: 'min', xn: 'schermtijd (min)' },
  { t: 'Het gewicht (in kg) van de boekentas van {N} leerlingen.', g0: 2, w: 2, k: 5, m: 7, s: 2, e: 'kg', xn: 'gewicht (kg)' },
  { t: 'De leeftijd van {N} bezoekers van een fietsenwinkel op zaterdag.', g0: 10, w: 10, k: 6, m: 38, s: 12, e: 'jaar', xn: 'leeftijd (jaar)' },
];
function maakReeks(N = kies([20, 24, 25, 30])) {
  const R = kies(REEKSEN), lo = R.g0, hi = R.g0 + R.w * R.k - 1, data = [];
  while (data.length < N) { const x = Math.round(normRnd(R.m, R.s)); if (x >= lo && x <= hi) data.push(x); }
  data.sort((a, b) => a - b);
  const f = telKlassen(data, R.g0, R.w, R.k), grenzen = Array.from({ length: R.k + 1 }, (_, i) => R.g0 + i * R.w);
  return { R, N, data, f, grenzen, zin: R.t.replace('{N}', N), toon: schud(data.slice()) };
}
const freqTabelHTML = (Q, rel = false) => htmlTabel([[Q.R.xn, 'absolute frequentie', ...(rel ? ['relatieve frequentie'] : [])],
  ...Q.f.map((x, i) => [klasTekst(Q.grenzen[i], Q.grenzen[i + 1]), x, ...(rel ? [tekst(r1(100 * x / Q.N)) + ' %'] : [])]), ['totaal', Q.N, ...(rel ? ['100 %'] : [])]]);
const D4 = {
  nr: 4, titel: 'Frequentietabel en histogram', kort: 'Gegevens groeperen in klassen, absolute en relatieve frequentie.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Gegroepeerde frequentietabel</div>
      <p>Bij veel verschillende waarden groepeer je de gegevens in <b>klassen</b> van even brede intervallen. Een klasse noteer je als half-open interval:
      $[160;\\, 170[$ bevat 160 wel, maar 170 niet.</p>
      <ul><li>De <b>absolute frequentie</b> van een klasse is het aantal gegevens in die klasse.</li><li>De <b>relatieve frequentie</b> is dat aantal in verhouding tot het totaal, meestal in %.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Lengte van 24 leerlingen</div>
      ${gegevensTabel([152, 158, 161, 163, 165, 166, 168, 169, 170, 171, 172, 172, 173, 174, 175, 176, 177, 178, 180, 181, 183, 185, 167, 164], 12)}
      ${htmlTabel([['lengte (cm)', 'absolute frequentie', 'relatieve frequentie'], ['[150; 160[', 2, '8,3 %'], ['[160; 170[', 8, '33,3 %'], ['[170; 180[', 10, '41,7 %'], ['[180; 190[', 4, '16,7 %'], ['totaal', 24, '100 %']])}
      <p>Relatieve frequentie met een verhoudingstabel: 24 leerlingen is 100 %. Voor 8 leerlingen deel je door 3 (24 → 8), dus ook 100 % : 3 ≈ 33,3 %.</p></div>
    <div class="kader def"><div class="kader-titel">Het histogram</div>
      <p>Bij gegroepeerde gegevens teken je een <b>histogram</b>: de staven raken elkaar, want de klassen sluiten op elkaar aan.</p>
      ${histogram([150, 160, 170, 180, 190], [2, 8, 10, 4], { xn: 'lengte (cm)', waarden: true, breed: 300, hoog: 150 })}
      <p class="klein"><b>Met het rekenblad in het leerpad:</b> de gegevens staan in kolom A. Vul onder het rekenblad het begin van de eerste klasse en de klassenbreedte in en klik op <b>Maak histogram</b>.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Klassen } [0;\\,10[,\\ [10;\\,20[,\\ [20;\\,30[,\\ \\ldots \\text{ In welke klasse hoort 30? En 29,9?}', stappen: ['30 \\in [30;\\, 40[ \\quad (\\text{30 hoort niet meer bij } [20;\\, 30[)', '29{,}9 \\in [20;\\, 30['] },
    { tex: '\\text{20 leerlingen, 5 in de klasse } [10;\\,20[. \\text{ Relatieve frequentie?}', stappen: ['20 \\text{ is } 100\\,\\%', '20 : 4 = 5 \\text{, dus } 100\\,\\% : 4 = 25\\,\\%'] },
  ],
  soorten: {
    abs: { naam: 'Absolute frequentie tellen', gen() {
      const Q = maakReeks(), i = rnd(0, Q.R.k - 1), a = Q.grenzen[i], b = Q.grenzen[i + 1], in_ = Q.data.filter(x => x >= a && x < b);
      return { soort: 'abs', opdracht: `Wat is de absolute frequentie van de klasse ${klasTekst(a, b)}?`, html: opgave(Q.zin) + gegevensTabel(Q.toon), sleutel: Q.toon.join() + i, rapport: `${Q.R.xn}: abs. freq. ${klasTekst(a, b)}`,
        antw: getal(in_.length, { voor: '\\text{absolute frequentie} =' }), uitleg: [`\\text{in } ${klasTex(a, b)}: ${in_.length ? in_.map(x => tg(x)).join(',\\ ') : '\\text{geen enkel gegeven}'}`, `\\text{${a} hoort erbij, ${b} niet}`, `\\text{absolute frequentie: } ${in_.length}`] };
    } },
    rel: { naam: 'Relatieve frequentie', gen() {
      const Q = maakReeks(), i = rnd(0, Q.R.k - 1), a = Q.grenzen[i], b = Q.grenzen[i + 1], n = Q.f[i]; if (!n) return this.gen();
      const p = 100 * n / Q.N; if (W.grensgeval(p, 1)) return this.gen();
      return { soort: 'rel', opdracht: `Bereken de relatieve frequentie van de klasse ${klasTekst(a, b)} (in %).`, html: opgave(Q.zin) + freqTabelHTML(Q), sleutel: Q.toon.join() + i + 'r', rapport: `${Q.R.xn}: rel. freq. ${klasTekst(a, b)}`,
        antw: pct(p, { dec: 1, voor: '\\text{relatieve frequentie} =' }), uitleg: pctUitleg(n, Q.N) };
    } },
    klasse: { naam: 'In welke klasse?', gen() {
      const R = kies(REEKSEN), gr = Array.from({ length: R.k + 1 }, (_, i) => R.g0 + i * R.w), i = rnd(1, R.k - 1);
      const v = kies([gr[i], gr[i] - (R.w >= 10 ? 0.1 : 0.5), gr[i] + (R.w >= 10 ? kies([1, 2, 5]) : 1), gr[0]]), j = gr.findIndex((g, k) => k < R.k && v >= g && v < gr[k + 1]);
      const opties = gr.slice(0, -1).map((g, k) => `[${tg(g)};\\, ${tg(gr[k + 1])}[`);
      return { soort: 'klasse', opdracht: `Je werkt met de klassen ${opties.slice(0, 3).map((o, k) => klasTekst(gr[k], gr[k + 1])).join(', ')}, … In welke klasse hoort ${tekst(v)}?`, sleutel: R.xn + v, rapport: `klasse van ${tekst(v)}`,
        tex: `${tg(v)} \\in \\;?`, antw: keuze(kTex(opties), j), uitleg: [`${klasTex(gr[j], gr[j + 1])} \\text{ bevat ${tekst(gr[j])} wel, maar ${tekst(gr[j + 1])} niet}`, `${tg(v)} \\in ${klasTex(gr[j], gr[j + 1])}`] };
    } },
    histo: { naam: 'Een histogram lezen', gen() {
      const Q = maakReeks(kies([20, 25, 40, 50])), v = kies(['meest', 'aantal', 'minder', 'minstens']), fig = histogram(Q.grenzen, Q.f, { xn: Q.R.xn });
      const kl = Q.grenzen.slice(0, -1).map((g, k) => `[${tg(g)};\\, ${tg(Q.grenzen[k + 1])}[`);
      if (v === 'meest') { const mx = Math.max(...Q.f); if (Q.f.filter(x => x === mx).length > 1) return this.gen(); const j = Q.f.indexOf(mx);
        return { soort: 'histo', opdracht: 'In welke klasse liggen de meeste gegevens?', html: opgave(Q.zin) + fig, sleutel: Q.toon.join() + v, rapport: `${Q.R.xn}: meeste gegevens`, antw: keuze(kTex(kl), j), uitleg: [`\\text{de hoogste staaf: } ${kl[j]} \\text{ met ${mx} gegevens}`] }; }
      const i = rnd(1, Q.R.k - 1), g = Q.grenzen[i];
      if (v === 'aantal') return { soort: 'histo', opdracht: `Hoeveel gegevens zijn kleiner dan ${tekst(g)}?`, html: opgave(Q.zin) + fig, sleutel: Q.toon.join() + v + i, rapport: `${Q.R.xn}: aantal < ${g}`,
        antw: getal(som(Q.f.slice(0, i))), uitleg: [`${Q.f.slice(0, i).join(' + ')} = ${som(Q.f.slice(0, i))}`] };
      const n = v === 'minder' ? som(Q.f.slice(0, i)) : som(Q.f.slice(i)), p = 100 * n / Q.N; if (W.grensgeval(p, 1)) return this.gen();
      return { soort: 'histo', opdracht: `Hoeveel procent van de gegevens is ${v === 'minder' ? 'kleiner dan' : 'minstens'} ${tekst(g)}?`, html: opgave(Q.zin) + fig, sleutel: Q.toon.join() + v + i, rapport: `${Q.R.xn}: % ${v} ${g}`,
        antw: pct(p, { dec: 1 }), uitleg: [`\\text{aantal: } ${(v === 'minder' ? Q.f.slice(0, i) : Q.f.slice(i)).join(' + ')} = ${n} \\text{ van de } ${Q.N}`, ...pctUitleg(n, Q.N)] };
    } },
    tabel: { naam: 'Met de frequentietabel', gen() {
      const Q = maakReeks(kies([20, 25, 50])), i = rnd(1, Q.R.k - 1), g = Q.grenzen[i], v = kies(['minder', 'minstens']);
      const rel = Q.f.map(x => 100 * x / Q.N), deel = v === 'minder' ? rel.slice(0, i) : rel.slice(i), p = W.rond(som(deel), 6);
      return { soort: 'tabel', opdracht: `Hoeveel procent van de gegevens is ${v === 'minder' ? 'kleiner dan' : 'minstens'} ${tekst(g)}?`, html: opgave(Q.zin) + freqTabelHTML(Q, true), sleutel: Q.toon.join() + v + i + 't', rapport: `${Q.R.xn}: % ${v} ${g} (tabel)`,
        antw: pct(p, { dec: 1 }), uitleg: [`\\text{tel de relatieve frequenties op: } ${deel.map(x => tg(r1(x)) + '\\,\\%').join(' + ')} = ${tg(r1(p))}\\,\\%`] };
    } },
    rekenhisto: { naam: 'Histogram met het rekenblad', gen() {
      const Q = maakReeks(kies([40, 50, 60])), v = kies(['meest', 'klasse']), g0 = Q.R.g0, w = Q.R.w;
      const kl = Q.grenzen.slice(0, -1).map((g, k) => `[${tg(g)};\\, ${tg(Q.grenzen[k + 1])}[`);
      const zin = Q.zin + ` De gegevens staan in het rekenblad (kolom A). Maak een histogram met klassen van breedte ${tekst(w)}, beginnend bij ${tekst(g0)}.`;
      const rb = rekenblad(Q.R.xn, Q.toon, [], { histogram: true, hoog: 10 });
      if (v === 'meest') { const mx = Math.max(...Q.f); if (Q.f.filter(x => x === mx).length > 1) return this.gen(); const j = Q.f.indexOf(mx);
        return { soort: 'rekenhisto', opdracht: 'In welke klasse liggen de meeste gegevens?', html: opgave(zin), sleutel: Q.toon.join() + v, rapport: `${Q.R.xn} (${Q.N}): meeste gegevens via histogram`,
          antw: delen(['\\text{rekenblad}', rb], ['\\text{klasse}', keuze(kTex(kl), j)]), uitleg: [`\\text{begin } ${tg(g0)}, \\text{ breedte } ${tg(w)}`, `\\text{de hoogste staaf: } ${kl[j]} \\text{ met ${mx} gegevens}`], uitlegHtml: histogram(Q.grenzen, Q.f, { xn: Q.R.xn, waarden: true }) }; }
      const i = rnd(0, Q.R.k - 1);
      return { soort: 'rekenhisto', opdracht: `Hoeveel gegevens liggen in de klasse ${klasTekst(Q.grenzen[i], Q.grenzen[i + 1])}?`, html: opgave(zin), sleutel: Q.toon.join() + v + i, rapport: `${Q.R.xn} (${Q.N}): abs. freq. via histogram`,
        antw: delen(['\\text{rekenblad}', rb], ['\\text{aantal}', getal(Q.f[i])]), uitleg: [`\\text{begin } ${tg(g0)}, \\text{ breedte } ${tg(w)}`, `\\text{staaf boven } ${kl[i]}: ${Q.f[i]}`], uitlegHtml: histogram(Q.grenzen, Q.f, { xn: Q.R.xn, waarden: true }) };
    } },
  },
  oefenMix: [['abs', 2], ['rel', 2], ['klasse', 1], ['histo', 2], ['tabel', 1], ['rekenhisto', 2]],
  test: [['klasse', 1], ['abs', 2], ['rel', 2], ['histo', 2], ['tabel', 1], ['rekenhisto', 2]], testSchudden: false,
};

// ---- 5. Gemiddelde en standaardafwijking -------------------------------------------------------------------
const KLEINE_REEKSEN = [
  ['De punten op 20 van {n} leerlingen.', 4, 20, 'punten'], ['Het aantal doelpunten van een voetbalploeg in {n} matchen.', 0, 6, 'doelpunten'],
  ['De temperatuur (in °C) om 12 uur op {n} dagen.', 8, 24, '°C'], ['Het aantal minuten dat {n} leerlingen nodig hebben om naar school te fietsen.', 6, 35, 'min'],
  ['De prijs (in euro) van {n} tweedehandsfietsen.', 60, 240, 'euro'], ['Het gewicht (in kg) van {n} valiezen op de luchthaven.', 12, 26, 'kg'],
];
function kleineReeks() {
  const [t, a, b, e] = kies(KLEINE_REEKSEN), n = rnd(6, 10), data = Array.from({ length: n }, () => rnd(a, b));
  return { zin: t.replace('{n}', n), data, n, e };
}
function zelfdeGemiddelde() { // twee reeksen van 14 punten op 20 met hetzelfde gemiddelde, één smal en één breed
  const m = rnd(10, 14), smal = [], breed = [];
  for (let i = 0; i < 7; i++) { const d1 = rnd(0, 2), d2 = rnd(1, 6); smal.push(m - d1, m + d1); breed.push(m - d2, m + d2); }
  return { m, smal, breed };
}
const D5 = {
  nr: 5, titel: 'Gemiddelde en standaardafwijking', kort: 'x̄: de som gedeeld door het aantal. s: hoe ver de gegevens van x̄ liggen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Gemiddelde en standaardafwijking</div>
      <ul><li>Het (rekenkundig) <b>gemiddelde</b> $\\bar{x}$ is de som van alle gegevens gedeeld door het aantal gegevens.</li>
      <li>De <b>standaardafwijking</b> $s$ geeft aan hoe ver de gegevens gemiddeld van het gemiddelde liggen.<br><b>kleine $s$</b>: de gegevens liggen dicht bij elkaar &nbsp;·&nbsp; <b>grote $s$</b>: de gegevens liggen ver uit elkaar.</li></ul>
      <p>De formule voor $s$ hoef je niet te kennen: je laat het rekenblad rekenen. Rond af op 1 decimaal.</p></div>
    <div class="kader eig"><div class="kader-titel">De formules in het rekenblad</div>
      ${htmlTabel([['', 'Nederlands', 'Engels'], ['gemiddelde', '<code>=GEMIDDELDE(A2:A25)</code>', '<code>=AVERAGE(A2:A25)</code>'], ['standaardafwijking', '<code>=STDEV.S(A2:A25)</code>', '<code>=STDEV.S(A2:A25)</code>']])}
      <p class="klein">De gegevens staan in A2 tot en met A25 (in A1 staat de titel). Lengte van de 24 leerlingen: $\\bar{x} \\approx 170{,}8$ cm en $s \\approx 8{,}1$ cm.
      Let op: <b>STDEV.S</b>, niet STDEV.P. Rond pas op het einde af op 1 decimaal.</p></div>
    ${RB_UITLEG}
    <div class="kader"><div class="kader-titel">Wat zegt s?</div>
      <p>Klas P en klas Q maken dezelfde toets, allebei met gemiddeld 14 op 20. Klas P: $s = 1{,}2$, klas Q: $s = 3{,}5$.
      In klas Q liggen de punten veel verder uit elkaar: er zijn zowel heel lage als heel hoge scores.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Punten: } 12,\\ 15,\\ 9,\\ 14,\\ 10. \\text{ Gemiddelde?}', stappen: ['\\bar{x} = \\frac{12 + 15 + 9 + 14 + 10}{5} = \\frac{60}{5} = 12'] },
    { tex: '\\text{Bakkerij A en B: broden van gemiddeld 800 g. A: } s = 5 \\text{ g, B: } s = 25 \\text{ g.}', stappen: ['\\text{bij A wegen bijna alle broden ongeveer 800 g}', '\\text{bij A weet je beter wat je krijgt}'] },
  ],
  soorten: {
    gemiddelde: { naam: 'Het gemiddelde berekenen', gen() {
      const Q = kleineReeks(), m = gem(Q.data); if (W.grensgeval(m, 1)) return this.gen();
      return { soort: 'gemiddelde', opdracht: 'Bereken het gemiddelde. Rond af op 1 decimaal.', html: opgave(Q.zin) + gegevensTabel(Q.data), sleutel: Q.data.join(), rapport: `${Q.zin} gemiddelde`,
        antw: getal(m, { dec: 1, voor: '\\bar{x} =' }), uitleg: [`\\bar{x} = \\frac{${Q.data.join(' + ')}}{${Q.n}} = \\frac{${som(Q.data)}}{${Q.n}} ${ongeveer(m)} ${tg(r1(m))}`] };
    } },
    stdev: { naam: 'De standaardafwijking', gen() {
      const Q = kleineReeks(), s = stdevS(Q.data); if (W.grensgeval(s, 1) || s === 0) return this.gen();
      return { soort: 'stdev', opdracht: 'Bereken de standaardafwijking met een formule in het rekenblad. Rond af op 1 decimaal.', html: opgave(Q.zin), sleutel: Q.data.join() + 's', rapport: `${Q.zin} standaardafwijking`,
        antw: delen(['\\text{rekenblad}', rekenblad(Q.e, Q.data, [{ ...rijStdev(Q.n), doel: s }])], ['s =', getal(s, { dec: 1 })]), uitleg: [`\\text{de gegevens staan in A2 tot en met A${Q.n + 1}}`, `\\text{=STDEV.S(A2:A${Q.n + 1})} \\approx ${tg(W.rond(s, 3))}`, `s \\approx ${tg(r1(s))}`] };
    } },
    groot: { naam: 'x̄ en s met het rekenblad', gen() {
      const Q = maakReeks(kies([24, 30, 40, 50])), n = Q.N, m = gem(Q.toon), sd = stdevS(Q.toon); if (W.grensgeval(m, 1) || W.grensgeval(sd, 1)) return this.gen();
      return { soort: 'groot', opdracht: 'Bereken het gemiddelde en de standaardafwijking met formules in het rekenblad. Rond af op 1 decimaal.', html: opgave(Q.zin), sleutel: Q.toon.join() + 'g', rapport: `${Q.R.xn} (${n}): x̄ en s met rekenblad`,
        antw: delen(['\\text{rekenblad}', rekenblad(Q.R.xn, Q.toon, [{ ...rijGem(n), doel: m }, { ...rijStdev(n), doel: sd }])], ['\\bar{x} =', getal(m, { dec: 1 })], ['s =', getal(sd, { dec: 1 })]),
        uitleg: [`\\text{C2: =GEMIDDELDE(A2:A${n + 1})} \\approx ${tg(W.rond(m, 3))} \\rightarrow \\bar{x} \\approx ${tg(r1(m))}`, `\\text{C3: =STDEV.S(A2:A${n + 1})} \\approx ${tg(W.rond(sd, 3))} \\rightarrow s \\approx ${tg(r1(sd))}`] };
    } },
    excel: { naam: 'De juiste formule', gen() {
      const n = rnd(15, 40), wat = kies(['gemiddelde', 'standaardafwijking']), e = n + 1;
      const juist = wat === 'gemiddelde' ? `=GEMIDDELDE(A2:A${e})` : `=STDEV.S(A2:A${e})`;
      const fout = wat === 'gemiddelde' ? [`=GEMIDDELDE(A3:A${e})`, `=SOM(A2:A${e})`, `=STDEV.S(A2:A${e})`, `=GEMIDDELDE(A2:A${n})`] : [`=STDEV.S(A3:A${e})`, `=GEMIDDELDE(A2:A${e})`, `=STDEV.P(A2:A${e})`, `=STDEV.S(A2:A${n})`];
      const zin = `In cel A1 staat de titel. De ${n} gegevens staan in A2 tot en met A${e}. Met welke formule bereken je ${wat === 'gemiddelde' ? 'het' : 'de'} ${wat}?`;
      const k = uniekKeuze(`<code>${juist}</code>`, fout.map(f => `<code>${f}</code>`), kZin);
      return { soort: 'excel', opdracht: 'Kies de juiste formule.', html: opgave(zin), sleutel: zin, rapport: `formule ${wat} (${n})`, antw: k,
        uitleg: [`\\text{${juist}}`, `\\text{${wat === 'gemiddelde' ? 'GEMIDDELDE (Engels: AVERAGE)' : 'STDEV.S'}, van A2 (zonder de titel) tot A${e}}`] };
    } },
    vergelijk: { naam: 'Welke s is groter?', gen() {
      const Z = zelfdeGemiddelde(), PQ = kies([true, false]), P = PQ ? Z.smal : Z.breed, Qd = PQ ? Z.breed : Z.smal;
      const sP = r1(stdevS(P)), sQ = r1(stdevS(Qd)), v = kies(['groot', 'koppel', 'tekort']);
      const hist = (d, t) => histogram(Array.from({ length: 21 }, (_, i) => i), Array.from({ length: 20 }, (_, i) => d.filter(x => x === i || (i === 19 && x === 20)).length), { xn: 'punten op 20', titel: t, elkeTweede: true, breed: 320, hoog: 120 });
      const fig = `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px">${hist(P, `Klas P (gemiddelde ${Z.m})`)}${hist(Qd, `Klas Q (gemiddelde ${Z.m})`)}</div>`, grootQ = !PQ;
      if (v === 'groot') return { soort: 'vergelijk', opdracht: 'Beide klassen hebben hetzelfde gemiddelde. Welke klas heeft de grootste standaardafwijking?', html: fig, sleutel: P.join() + Qd.join() + v, rapport: 'grootste s (stippendiagram)',
        antw: keuze(kT(['klas P', 'klas Q']), grootQ ? 1 : 0), uitleg: [`\\text{in klas ${grootQ ? 'Q' : 'P'} liggen de punten veel verder uit elkaar}`] };
      if (v === 'koppel') { const lo = Math.min(sP, sQ), hi = Math.max(sP, sQ); if (lo === hi) return this.gen();
        return { soort: 'vergelijk', opdracht: `De standaardafwijkingen zijn ${tekst(lo)} en ${tekst(hi)}. Welke hoort bij klas P?`, html: fig, sleutel: P.join() + Qd.join() + v, rapport: 's koppelen (stippendiagram)',
          antw: keuze(kTex([`s = ${tg(lo)}`, `s = ${tg(hi)}`]), grootQ ? 0 : 1), uitleg: [`\\text{de klas waarin de punten het verst uit elkaar liggen, heeft de grootste } s`, `\\text{klas P: } s = ${tg(sP)} \\qquad \\text{klas Q: } s = ${tg(sQ)}`] }; }
      const tP = P.filter(x => x < 10).length, tQ = Qd.filter(x => x < 10).length; if (tP === tQ) return this.gen();
      return { soort: 'vergelijk', opdracht: 'In welke klas zijn er meer leerlingen met een tekort (minder dan 10)?', html: fig, sleutel: P.join() + Qd.join() + v, rapport: 'tekorten (stippendiagram)',
        antw: keuze(kT(['klas P', 'klas Q']), tQ > tP ? 1 : 0), uitleg: [`\\text{klas P: ${tP} tekort${tP === 1 ? '' : 'en'}, klas Q: ${tQ} tekort${tQ === 1 ? '' : 'en'}}`, '\\text{meestal de klas met de grootste } s'] };
    } },
    betekenis: { naam: 'Wat betekent s?', gen() {
      const C = kies([
        ['Bakkerij A en bakkerij B verkopen allebei broden van gemiddeld {m} g. Bij bakkerij A is s = {s1} g, bij bakkerij B is s = {s2} g.', 800, 'Bij welke bakkerij weet je beter wat je krijgt?', 'bakkerij', 'bijna alle broden ongeveer {m} g wegen'],
        ['Bus A en bus B hebben allebei een gemiddelde rijtijd van {m} minuten. Bij bus A is s = {s1} min, bij bus B is s = {s2} min.', 35, 'Op welke bus kan je het best rekenen om op tijd te komen?', 'bus', 'de rijtijd bijna altijd ongeveer {m} minuten is'],
        ['Twee machines vullen flessen met gemiddeld {m} ml. Bij machine A is s = {s1} ml, bij machine B is s = {s2} ml.', 500, 'Welke machine vult de flessen het gelijkmatigst?', 'machine', 'bijna alle flessen ongeveer {m} ml bevatten'],
      ]);
      const s1 = kies([2, 3, 4, 5]), s2 = s1 * kies([4, 5, 6]), omg = kies([true, false]), sa = omg ? s2 : s1, sb = omg ? s1 : s2, best = omg ? 'B' : 'A';
      const zin = C[0].replace('{m}', C[1]).replace('{s1}', sa).replace('{s2}', sb);
      return { soort: 'betekenis', opdracht: C[2], html: opgave(zin), sleutel: zin, rapport: zin,
        antw: zinKeuze(`${C[3][0].toUpperCase() + C[3].slice(1)} ${best}: de kleine standaardafwijking betekent dat ${C[4].replace('{m}', C[1])}.`, [`${C[3][0].toUpperCase() + C[3].slice(1)} ${best === 'A' ? 'B' : 'A'}: een grote standaardafwijking betekent dat alles dichter bij het gemiddelde ligt.`, 'Er is geen verschil: het gemiddelde is hetzelfde.', `${C[3][0].toUpperCase() + C[3].slice(1)} ${best === 'A' ? 'B' : 'A'}: de standaardafwijking zegt niets over de spreiding.`]),
        uitleg: ['\\text{kleine } s \\text{: de gegevens liggen dicht bij het gemiddelde}', `\\text{${C[3]} ${best} heeft de kleinste } s`] };
    } },
  },
  oefenMix: [['gemiddelde', 2], ['stdev', 2], ['groot', 2], ['excel', 1], ['vergelijk', 2], ['betekenis', 1]],
  test: [['gemiddelde', 2], ['stdev', 1], ['groot', 2], ['excel', 1], ['vergelijk', 3], ['betekenis', 1]], testSchudden: true,
};
// ===================================================================
//  C · DE NORMALE VERDELING (delen 6–8) en D · EINDTEST (deel 9)
// ===================================================================
const NORMCTX = [
  { t: 'De lengte van volwassen vrouwen', m: () => rnd(158, 168), s: () => kies([6, 7, 8]), e: 'cm', wie: 'vrouwen', een: 'vrouw', v: (r) => `is ${r} groot`, b: (r) => `${r} groot is` },
  { t: 'De lengte van volwassen mannen', m: () => rnd(175, 183), s: () => kies([6, 7, 8]), e: 'cm', wie: 'mannen', een: 'man', v: (r) => `is ${r} groot`, b: (r) => `${r} groot is` },
  { t: 'Het IQ', m: () => 100, s: () => 15, e: '', wie: 'mensen', een: 'persoon', v: (r) => `heeft een IQ van ${r}`, b: (r) => `een IQ van ${r} heeft` },
  { t: 'De levensduur van een batterij', m: () => kies([400, 450, 500, 550, 600]), s: () => kies([20, 25, 40, 50]), e: 'uur', wie: 'batterijen', een: 'batterij', v: (r) => `gaat ${r} mee`, b: (r) => `${r} meegaat` },
  { t: 'Het gewicht van appels uit een boomgaard', m: () => kies([140, 145, 150, 155, 160]), s: () => kies([10, 15, 20]), e: 'g', wie: 'appels', een: 'appel', v: (r) => `weegt ${r}`, b: (r) => `${r} weegt` },
  { t: 'De inhoud van de flessen die een machine vult', m: () => kies([330, 500, 750]), s: () => kies([2, 3, 4, 5]), e: 'ml', wie: 'flessen', een: 'fles', v: (r) => `bevat ${r}`, b: (r) => `${r} bevat` },
  { t: 'Het geboortegewicht van baby’s', m: () => kies([3300, 3400, 3500]), s: () => kies([400, 450, 500]), e: 'g', wie: 'baby’s', een: 'baby', v: (r) => `weegt bij de geboorte ${r}`, b: (r) => `bij de geboorte ${r} weegt` },
  { t: 'De reactietijd van deelnemers aan een test', m: () => kies([250, 260, 270, 280]), s: () => kies([20, 25, 30]), e: 'ms', wie: 'deelnemers', een: 'deelnemer', v: (r) => `heeft een reactietijd van ${r}`, b: (r) => `een reactietijd van ${r} heeft` },
  { t: 'Het gewicht van pakken suiker', m: () => 1000, s: () => kies([4, 5, 8]), e: 'g', wie: 'pakken', een: 'pak', v: (r) => `weegt ${r}`, b: (r) => `${r} weegt` },
];
function normCtx() { const C = kies(NORMCTX), m = C.m(), s = C.s(); return { ...C, m, s, eh: C.e ? ' ' + C.e : '', zin: `${C.t} is normaal verdeeld met x̄ = ${tekst(m)}${C.e ? ' ' + C.e : ''} en s = ${tekst(s)}${C.e ? ' ' + C.e : ''}.` }; }
const waardeTekst = (C, x) => `${tekst(W.rond(x, 6))}${C.eh}`;

// ---- 6. De normale kromme ----------------------------------------------------------------------------------
const VORMEN = {
  normaal: (k) => { const c = (k - 1) / 2; return Array.from({ length: k }, (_, i) => Math.round(40 * Math.exp(-((i - c) ** 2) / (2 * (k / 6) ** 2))) + rnd(0, 2)); },
  scheef: (k) => Array.from({ length: k }, (_, i) => Math.max(1, Math.round(42 * Math.exp(-0.45 * Math.max(0, i - 1)) * (i === 0 ? 0.65 : 1)) + rnd(0, 2))),
  tweetoppen: (k) => Array.from({ length: k }, (_, i) => Math.round(30 * Math.exp(-((i - k * 0.22) ** 2) / 2.2) + 24 * Math.exp(-((i - k * 0.72) ** 2) / 2.6)) + rnd(1, 2)),
};
const MODELCTX = [
  ['normaal', 'De lengte van 300 leerlingen van het 6de jaar (cm).', 150, 4], ['normaal', 'Het gewicht van 300 appels (g).', 100, 10], ['normaal', 'De punten van 250 leerlingen op een grote toets.', 0, 2],
  ['scheef', 'De wachttijd aan een loket (min).', 0, 2], ['scheef', 'Het aantal uren dat 200 jongeren per week gamen.', 0, 3],
  ['tweetoppen', 'De leeftijd van alle bezoekers van een kinderfuif: kinderen en hun ouders (jaar).', 0, 5], ['tweetoppen', 'De lengte van 200 mensen: kinderen van 6 jaar en hun ouders (cm).', 100, 8],
];
const D6 = {
  nr: 6, titel: 'De normale kromme', kort: 'Klokvormig en symmetrisch: top bij x̄, buigpunten bij x̄ − s en x̄ + s.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Van histogram naar Gausskromme</div>
      <p>Het histogram van de lengte van 2050 vrouwen is hoog in het midden, symmetrisch, en naar links en rechts steeds lager. Een vloeiende kromme die het histogram volgt, heet een <b>Gausskromme</b> of <b>normale kromme</b>.</p>
      ${kromme([{ m: 160.4, s: 7.4 }], { ticks: [140, 150, 160, 170, 180].map(v => ({ v })), as: [134, 187], hoog: 130, hist: 3 })}
      <p class="midden">$\\bar{x} = 160{,}4$ cm &nbsp; $s = 7{,}4$ cm &nbsp; → &nbsp; $N(160{,}4;\\, 7{,}4)$</p></div>
    <div class="kader def"><div class="kader-titel">Normaal verdeelde gegevens</div>
      <ul><li>klokvormig en <b>symmetrisch</b> rond het gemiddelde;</li><li>de meeste gegevens liggen dicht bij $\\bar{x}$; hoe verder van $\\bar{x}$, hoe minder gegevens;</li>
      <li>notatie: $N(\\bar{x};\\, s)$. De kromme is een continu model: ze beschrijft de gegevens benaderend.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Top en buigpunten</div>
      ${kromme([{ m: 0, s: 1 }], { buig: true, top: true, ticks: [{ v: -1, l: 'x̄ − s' }, { v: 0, l: 'x̄' }, { v: 1, l: 'x̄ + s' }], hoog: 130 })}
      <p>De <b>top</b> ligt bij $\\bar{x}$. De <b>buigpunten</b> (waar de kromme van "bol" naar "hol" gaat) liggen bij $\\bar{x} - s$ en $\\bar{x} + s$.</p></div>
    <div class="kader eig"><div class="kader-titel">x̄ en s veranderen</div>
      ${kromme([{ m: 20, s: 2, label: 'A' }, { m: 30, s: 2, label: 'B', kleur: ORANJE }, { m: 20, s: 4, label: 'C', kleur: GROEN }], { as: [6, 40], ticks: [10, 20, 30].map(v => ({ v })), hoog: 130 })}
      <ul><li>Groter gemiddelde (A → B): de kromme <b>schuift naar rechts</b>, zelfde vorm.</li><li>Grotere $s$ (A → C): de kromme wordt <b>breder en lager</b> (de oppervlakte blijft 100 %).</li></ul></div>
`,
  voorbeelden: [
    { html: `${opgave('Lees het gemiddelde en de standaardafwijking af. De buigpunten zijn aangeduid.')}${kromme([{ m: 50, s: 4 }], { buig: true, ticks: [38, 42, 46, 50, 54, 58, 62].map(v => ({ v })) })}`,
      stappen: ['\\text{top bij 50: } \\bar{x} = 50', '\\text{buigpunten bij 46 en 54: } s = 54 - 50 = 4', 'N(50;\\, 4)'] },
  ],
  soorten: {
    aflezen: { naam: 'x̄ en s aflezen', gen() {
      const s = kies([2, 3, 4, 5, 10, 15, 20]), m = s * rnd(5, 30), stap = s, ts = [-3, -2, -1, 0, 1, 2, 3].map(k => ({ v: m + k * stap }));
      const fig = kromme([{ m, s }], { buig: true, ticks: ts }), v = kies(['beide', 'notatie']);
      if (v === 'notatie') return { soort: 'aflezen', opdracht: 'De buigpunten zijn aangeduid. Welke normale verdeling is dit?', html: fig, sleutel: `${m},${s}n`, rapport: `N(${m}; ${s}) herkennen`,
        antw: uniekKeuze(`N(${m};\\, ${s})`, [`N(${s};\\, ${m})`, `N(${m};\\, ${2 * s})`, `N(${m + s};\\, ${s})`, `N(${m};\\, ${3 * s})`]), uitleg: [`\\text{top: } \\bar{x} = ${m}`, `\\text{buigpunt bij } ${m + s}: s = ${m + s} - ${m} = ${s}`] };
      return { soort: 'aflezen', opdracht: 'Lees het gemiddelde en de standaardafwijking af. De buigpunten zijn aangeduid.', html: fig, sleutel: `${m},${s}`, rapport: `x̄ en s aflezen (N(${m}; ${s}))`,
        antw: delen(['\\bar{x} =', getal(m)], ['s =', getal(s)]), uitleg: [`\\text{top: } \\bar{x} = ${m}`, `\\text{buigpunten bij } ${m - s} \\text{ en } ${m + s}: s = ${s}`] };
    } },
    koppel: { naam: 'Welke kromme?', gen() {
      const s = kies([2, 3, 4, 5]), m = s * rnd(4, 8), d = s * kies([3, 4, 5]), s2 = s * kies([2, 3]);
      const K = schud([{ m, s }, { m, s: s2 }, { m: m + d, s }]), L = ['A', 'B', 'C'], kl = [BLAUW, ORANJE, GROEN];
      K.forEach((c, i) => { c.label = L[i]; c.kleur = kl[i]; });
      const A0 = m - 3.2 * s2, A1 = Math.max(m + d + 3.5 * s, m + 3.2 * s2), stap = s * (A1 - A0 > 24 * s ? 4 : 2), ts = [];
      for (let v = Math.ceil(A0 / stap) * stap; v <= A1; v += stap) ts.push({ v });
      const doel = kies(K), i = K.indexOf(doel);
      return { soort: 'koppel', opdracht: `Welke kromme hoort bij N(${doel.m}; ${doel.s})?`, html: kromme(K, { as: [A0, A1], ticks: ts }), sleutel: JSON.stringify(K.map(c => [c.m, c.s])) + i, rapport: `kromme bij N(${doel.m}; ${doel.s})`,
        antw: keuze(kT(L), i), uitleg: [`\\text{top bij } ${doel.m}`, doel.s === s2 ? '\\text{de grootste } s \\text{: de breedste en laagste kromme}' : `\\text{kleine } s = ${s} \\text{: smal en hoog}`, `\\text{kromme ${L[i]}}`] };
    } },
    verander: { naam: 'x̄ en s veranderen', gen() {
      const V = kies([
        ['Het gemiddelde wordt groter, de standaardafwijking blijft gelijk. Wat gebeurt er met de normale kromme?', 'De kromme schuift naar rechts en houdt dezelfde vorm.', ['De kromme wordt breder en lager.', 'De kromme wordt smaller en hoger.', 'De kromme schuift naar links.']],
        ['Het gemiddelde wordt kleiner, de standaardafwijking blijft gelijk. Wat gebeurt er met de normale kromme?', 'De kromme schuift naar links en houdt dezelfde vorm.', ['De kromme wordt breder en lager.', 'De kromme schuift naar rechts.', 'De kromme wordt smaller en hoger.']],
        ['De standaardafwijking wordt groter, het gemiddelde blijft gelijk. Wat gebeurt er met de normale kromme?', 'De kromme wordt breder en lager; de top blijft op dezelfde plaats.', ['De kromme schuift naar rechts.', 'De kromme wordt smaller en hoger.', 'De kromme wordt breder en hoger.']],
        ['De standaardafwijking wordt kleiner, het gemiddelde blijft gelijk. Wat gebeurt er met de normale kromme?', 'De kromme wordt smaller en hoger; de top blijft op dezelfde plaats.', ['De kromme wordt breder en lager.', 'De kromme schuift naar links.', 'De kromme wordt smaller en lager.']],
        ['Waar liggen de buigpunten van een normale kromme?', 'Bij x̄ − s en x̄ + s.', ['Bij x̄ − 2s en x̄ + 2s.', 'Bij de top.', 'Bij x̄ − 3s en x̄ + 3s.']],
        ['Welke uitspraak over normaal verdeelde gegevens is juist?', 'De meeste gegevens liggen dicht bij het gemiddelde; hoe verder weg, hoe minder gegevens.', ['De gegevens liggen overal even vaak.', 'De meeste gegevens liggen ver van het gemiddelde.', 'De kromme heeft altijd twee toppen.']],
        ['Welke uitspraak over de normale kromme is juist?', 'Ze is symmetrisch rond het gemiddelde.', ['Ze heeft een lange staart naar rechts.', 'Ze is symmetrisch rond x̄ + s.', 'De top ligt bij x̄ + s.']],
      ]);
      return { soort: 'verander', opdracht: V[0], sleutel: V[0], rapport: V[0], antw: zinKeuze(V[1], V[2]), uitleg: [`\\text{${V[1]}}`] };
    } },
    model: { naam: 'Past het normale model?', verborgen: true, gen() {
      const [vorm, t, g0, w] = kies(MODELCTX), k = 10, f = VORMEN[vorm](k), gr = Array.from({ length: k + 1 }, (_, i) => g0 + i * w);
      const ok = vorm === 'normaal';
      const juist = ok ? 'Ja: het histogram is klokvormig en ongeveer symmetrisch rond het gemiddelde.' : vorm === 'scheef' ? 'Nee: het histogram is scheef, met een lange staart naar rechts.' : 'Nee: het histogram heeft twee toppen. Het gemiddelde ligt waar bijna geen gegevens zijn.';
      return { soort: 'model', opdracht: 'Kan je deze gegevens benaderen met een normale verdeling?', html: opgave(t) + histogram(gr, f, { elkeTweede: true }), sleutel: t + f.join(), rapport: t,
        antw: zinKeuze(juist, ['Ja: elk histogram kan je benaderen met een normale verdeling.', ok ? 'Nee: de gegevens liggen niet allemaal even dicht bij het gemiddelde.' : 'Ja: er zijn genoeg gegevens.', ok ? 'Nee: het histogram heeft twee toppen.' : 'Ja: het histogram is symmetrisch.']),
        uitleg: ['\\text{normaal model: klokvormig en symmetrisch rond het gemiddelde}', `\\text{${ok ? 'dat is hier zo' : vorm === 'scheef' ? 'hier scheef (lange staart rechts)' : 'hier twee toppen'}}`] };
    } },
  },
  oefenMix: [['aflezen', 2], ['koppel', 2], ['verander', 2]],
  test: [['aflezen', 4], ['koppel', 4], ['verander', 2]], testSchudden: true,
};

// ---- 7. De 68-95-99,7-regel -------------------------------------------------------------------------------
const kTekst = (C, k) => waardeTekst(C, C.m + k * C.s);
function regelVraag(C) { // willekeurig gebied: [ka, kb] in veelvouden van s (−4 = −∞, 4 = +∞)
  for (;;) {
    const v = kies(['links', 'rechts', 'tussen', 'tussen']);
    if (v === 'links') { const kb = rnd(-3, 3); return { ka: -4, kb, r: `minder dan ${kTekst(C, kb)}` }; }
    if (v === 'rechts') { const ka = rnd(-3, 3); return { ka, kb: 4, r: `meer dan ${kTekst(C, ka)}` }; }
    const ka = rnd(-3, 2), kb = rnd(ka + 1, 3); if (ka === -kb && kies([true, false])) continue;
    return { ka, kb, r: `tussen ${kTekst(C, ka)} en ${kTekst(C, kb)}` };
  }
}
const symb = (k) => k === 0 ? '\\bar{x}' : `\\bar{x} ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}s`;
function regelUitleg(ka, kb) {
  const delenP = []; for (let k = ka; k < kb; k++) delenP.push(GEBIED[String(k)]);
  const grens = (k) => k === -4 ? '-\\infty' : k === 4 ? '+\\infty' : symb(k);
  const p = regelPct(ka, kb);
  const lijst = [`\\text{van } ${grens(ka)} \\text{ tot } ${grens(kb)}`];
  if (ka === -4 && kb === 0 || ka === 0 && kb === 4) lijst.push('\\text{de helft: } 50\\,\\%');
  else if (delenP.length === 1) lijst.push(`${tg(p)}\\,\\%`);
  else lijst.push(`${delenP.map(x => tg(x) + '\\,\\%').join(' + ')} = ${tg(p)}\\,\\%`);
  return lijst;
}
const schets = (C, kleur) => kromme([{ m: C.m, s: C.s }], { ticks: [-3, -2, -1, 0, 1, 2, 3].map(k => ({ v: C.m + k * C.s, l: k === 0 ? 'x̄' : `x̄ ${k < 0 ? '−' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}s` })), kleur, hoog: 150 });
const D7 = {
  nr: 7, titel: 'De 68-95-99,7-regel en het normale model', kort: 'Percentages tussen x̄ ± s, x̄ ± 2s en x̄ ± 3s. Past het model?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">De 68-95-99,7-regel</div>
      <p>De oppervlakte onder de kromme stelt het percentage van de gegevens voor. De totale oppervlakte is 100 %. Bij elke normale verdeling geldt:</p>
      <ul><li>ongeveer <b>68 %</b> ligt tussen $\\bar{x} - s$ en $\\bar{x} + s$;</li><li>ongeveer <b>95 %</b> ligt tussen $\\bar{x} - 2s$ en $\\bar{x} + 2s$;</li><li>ongeveer <b>99,7 %</b> ligt tussen $\\bar{x} - 3s$ en $\\bar{x} + 3s$.</li></ul>
      ${kromme([{ m: 0, s: 1 }], { ticks: [-3, -2, -1, 0, 1, 2, 3].map(k => ({ v: k, l: k === 0 ? 'x̄' : `x̄ ${k < 0 ? '−' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}s` })),
        procenten: [{ x: -0.5, y: 0.12, t: '34 %' }, { x: 0.5, y: 0.12, t: '34 %' }, { x: -1.5, y: 0.04, t: '13,5 %' }, { x: 1.5, y: 0.04, t: '13,5 %' }, { x: -2.5, t: '2,35 %' }, { x: 2.5, t: '2,35 %' }, { x: -3.3, y: 0.06, t: '0,15 %' }, { x: 3.3, y: 0.06, t: '0,15 %' }] })}
      <p>Gebruik de <b>symmetrie</b>: tussen $\\bar{x}$ en $\\bar{x} + s$ ligt $68\\,\\% : 2 = 34\\,\\%$. Tussen $\\bar{x} + s$ en $\\bar{x} + 2s$ ligt $(95\\,\\% - 68\\,\\%) : 2 = 13{,}5\\,\\%$.
      Links (en rechts) van $\\bar{x}$ ligt 50 %. Kies je lukraak een element, dan is het percentage ook de <b>kans</b>.</p></div>
    <div class="kader"><div class="kader-titel">Past het normale model?</div>
      <p>Is het histogram ongeveer <b>klokvormig en symmetrisch</b> rond het gemiddelde? Dan mag je de normale verdeling met $\\bar{x}$ en $s$ uit de gegevens als model gebruiken.
      <b>Niet</b> bij een scheef histogram (lange staart naar één kant) of bij twee toppen.</p></div>
    <div class="kader eig"><div class="kader-titel">Werkwijze</div>
      <ol><li>Maak een schets en zet $\\bar{x} - 3s$ tot en met $\\bar{x} + 3s$ op de as (met de waarden).</li><li>Kleur het gevraagde gebied.</li><li>Tel de percentages van de stukken op.</li></ol></div>`,
  voorbeelden: [
    { html: `${opgave('De koffieautomaat: de hoeveelheid koffie is N(92,5; 2,5) in bekertjes van maximaal 100 ml.')}${kromme([{ m: 92.5, s: 2.5 }], { ticks: ticks7(92.5, 2.5) })}`,
      stappen: ['\\text{68\\,\\% ligt tussen } 92{,}5 - 2{,}5 = 90 \\text{ ml en } 92{,}5 + 2{,}5 = 95 \\text{ ml}', '\\text{minder dan 90 ml: } 50\\,\\% - 34\\,\\% = 16\\,\\%', '\\text{overlopen: } 100 = \\bar{x} + 3s \\text{, dus } 0{,}15\\,\\%', '\\text{tussen 87,5 en 95 ml: } 13{,}5\\,\\% + 34\\,\\% + 34\\,\\% = 81{,}5\\,\\%'] },
  ],
  soorten: {
    model: mix(D6, 'model'),
    procent: { naam: 'Percentage met de regel', gen() {
      const C = normCtx(), Q = regelVraag(C), p = regelPct(Q.ka, Q.kb);
      return { soort: 'procent', opdracht: `Hoeveel procent van de ${C.wie} ${C.v(Q.r)}? Maak eerst een schets.`, html: opgave(C.zin) + schets(C), sleutel: C.zin + Q.r, rapport: `${C.t}: ${Q.r}`,
        antw: pct(p), uitleg: [`${[-3, -2, -1, 0, 1, 2, 3].map(k => tg(W.rond(C.m + k * C.s, 6))).join(' \\quad ')}`, ...regelUitleg(Q.ka, Q.kb)] };
    } },
    kans: { naam: 'Kans met de regel', gen() {
      const C = normCtx(), Q = regelVraag(C), p = regelPct(Q.ka, Q.kb);
      return { soort: 'kans', opdracht: `Je kiest lukraak één van de ${C.wie}. Hoe groot is de kans dat die ${C.een} ${C.b(Q.r)}? Antwoord in procent.`, html: opgave(C.zin) + schets(C), sleutel: C.zin + Q.r + 'k', rapport: `${C.t}: kans ${Q.r}`,
        antw: pct(p, { voor: 'P =' }), uitleg: [`${[-3, -2, -1, 0, 1, 2, 3].map(k => tg(W.rond(C.m + k * C.s, 6))).join(' \\quad ')}`, ...regelUitleg(Q.ka, Q.kb), '\\text{het percentage is ook de kans}'] };
    } },
    grenzen: { naam: 'Tussen welke waarden?', gen() {
      const C = normCtx(), k = kies([1, 2, 3]), p = ['68', '95', '99,7'][k - 1];
      return { soort: 'grenzen', opdracht: `Tussen welke twee waarden ligt de middelste ${p} % van de ${C.wie}?`, html: opgave(C.zin), sleutel: C.zin + k, rapport: `${C.t}: middelste ${p} %`,
        antw: delen(['\\text{van}', getal(W.rond(C.m - k * C.s, 6), { na: C.e ? `\\text{ ${C.e}}` : undefined })], ['\\text{tot}', getal(W.rond(C.m + k * C.s, 6), { na: C.e ? `\\text{ ${C.e}}` : undefined })]),
        uitleg: [`\\text{${p}\\,\\% ligt tussen } ${symb(-k)} \\text{ en } ${symb(k)}`, `${tg(C.m)} - ${k === 1 ? '' : k + ' \\cdot '}${tg(C.s)} = ${tg(W.rond(C.m - k * C.s, 6))} \\qquad ${tg(C.m)} + ${k === 1 ? '' : k + ' \\cdot '}${tg(C.s)} = ${tg(W.rond(C.m + k * C.s, 6))}`] };
    } },
    aantal: { naam: 'Hoeveel stuks?', gen() {
      for (;;) {
        const C = normCtx(), Q = regelVraag(C), p = regelPct(Q.ka, Q.kb), N = kies([200, 400, 500, 1000, 2000, 4000, 10000]), n = W.rond(N * p / 100, 6);
        if (!Number.isInteger(n) || n === 0 || n === N) continue;
        const zin = `${C.zin} Er zijn ${String(N).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${C.wie}.`;
        return { soort: 'aantal', opdracht: `Ongeveer hoeveel ${C.wie} ${C.v(Q.r).replace(/^is /, 'zijn ').replace(/^heeft /, 'hebben ').replace(/^gaat /, 'gaan ').replace(/^weegt /, 'wegen ').replace(/^bevat /, 'bevatten ')}?`, html: opgave(zin) + schets(C), sleutel: zin + Q.r, rapport: `${C.t}: aantal ${Q.r} van ${N}`,
          antw: getal(n), uitleg: [...regelUitleg(Q.ka, Q.kb), `${tg(p)}\\,\\% \\text{ van } ${tg(N).replace(/(\d)(?=(\d{3})+$)/g, '$1\\,')} = ${tg(n)}`] };
      }
    } },
  },
  oefenMix: [['procent', 3], ['kans', 1], ['grenzen', 1], ['aantal', 1], ['model', 1]],
  test: [['grenzen', 2], ['procent', 3], ['model', 2], ['kans', 1], ['aantal', 2]], testSchudden: false,
};

// ---- 8. Kansen met Excel --------------------------------------------------------------------------------------
const xl = (a, C) => `NORM.VERD.N(${tekst(a)}; ${tekst(C.m)}; ${tekst(C.s)}; WAAR)`;
function excelVraag() {
  for (let n = 0; n < 200; n++) {
    const C = normCtx(), v = kies(['links', 'rechts', 'tussen']), stap = C.s >= 100 ? 50 : C.s >= 10 ? 5 : C.s >= 4 ? 1 : 0.5;
    const kies1 = () => { const x = C.m + (Math.random() * 5 - 2.5) * C.s; return W.rond(Math.round(x / stap) * stap, 6); };
    let a = kies1(), b = kies1(); if (a > b) [a, b] = [b, a];
    const isK = (x) => Math.abs((x - C.m) / C.s - Math.round((x - C.m) / C.s)) < 1e-9; // valt op x̄ ± k·s: dan is de regel genoeg
    if (isK(a) || (v === 'tussen' && (isK(b) || b - a < C.s / 2))) continue;
    const Fa = normVerd(a, C.m, C.s), Fb = normVerd(b, C.m, C.s), Fa3 = W.rond(Fa, 3), Fb3 = W.rond(Fb, 3);
    const p = v === 'links' ? Fa : v === 'rechts' ? 1 - Fa : Fb - Fa, p3 = v === 'links' ? Fa3 : v === 'rechts' ? 1 - Fa3 : Fb3 - Fa3;
    if (W.grensgeval(100 * p, 1) || W.rond(100 * p, 1) !== W.rond(100 * p3, 1) || p < 0.005 || p > 0.995) continue;
    const r = v === 'links' ? `minder dan ${waardeTekst(C, a)}` : v === 'rechts' ? `meer dan ${waardeTekst(C, a)}` : `tussen ${waardeTekst(C, a)} en ${waardeTekst(C, b)}`;
    const formule = v === 'links' ? `=${xl(a, C)}` : v === 'rechts' ? `=1 − ${xl(a, C)}` : `=${xl(b, C)} − ${xl(a, C)}`;
    const rek = v === 'links' ? `${tg(Fa3)}` : v === 'rechts' ? `1 - ${tg(Fa3)} = ${tg(W.rond(1 - Fa3, 3))}` : `${tg(Fb3)} - ${tg(Fa3)} = ${tg(W.rond(Fb3 - Fa3, 3))}`;
    return { C, v, a, b, p, r, formule, rek };
  }
}
const D8 = {
  nr: 8, titel: 'Kansen met het rekenblad', kort: 'P(X < a) = NORM.VERD.N(a; x̄; s; WAAR) in het rekenblad.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Kansen met het rekenblad</div>
      <p>Valt een grens niet op $\\bar{x} \\pm s$, $\\bar{x} \\pm 2s$ of $\\bar{x} \\pm 3s$, dan laat je het rekenblad de oppervlakte berekenen. $P(X < a)$ is de oppervlakte <b>links</b> van $a$:</p>
      <p class="midden"><code>=NORM.VERD.N(a; x̄; s; WAAR)</code> &nbsp;&nbsp; Engelstalig: <code>=NORM.DIST(a, x̄, s, TRUE)</code></p>
      <ul><li><b>rechts</b> van $a$: <code>=1 − NORM.VERD.N(a; x̄; s; WAAR)</code></li><li><b>tussen</b> $a$ en $b$: <code>=NORM.VERD.N(b; …) − NORM.VERD.N(a; …)</code></li></ul>
      <p class="klein">Het rekenblad geeft een kommagetal (bv. 0,733). Antwoord in procent op 0,1 % nauwkeurig: 73,3 %.</p></div>
    <div class="kader eig"><div class="kader-titel">De formules in het rekenblad</div>
      ${htmlTabel([['', 'Nederlands', 'Engels'], ['links van a', '<code>=NORM.VERD.N(a; x̄; s; WAAR)</code>', '<code>=NORM.DIST(a, x̄, s, TRUE)</code>'],
        ['rechts van a', '<code>=1-NORM.VERD.N(a; x̄; s; WAAR)</code>', '<code>=1-NORM.DIST(a, x̄, s, TRUE)</code>'], ['tussen a en b', '<code>=NORM.VERD.N(b; x̄; s; WAAR)-NORM.VERD.N(a; x̄; s; WAAR)</code>', '<code>=NORM.DIST(b, …)-NORM.DIST(a, …)</code>']])}
      <p class="klein">Vul voor x̄ en s de getallen in, bv. <code>=NORM.VERD.N(165; 160,4; 7,4; WAAR)</code>. In een rekenblad met gegevens mag je ook naar de cellen met het gemiddelde en de standaardafwijking verwijzen, bv. <code>=NORM.VERD.N(140; C2; C3; WAAR)</code>.</p></div>
    ${RB_UITLEG}
    <div class="kader eig"><div class="kader-titel">Lengte van vrouwen: N(160,4; 7,4)</div>
      ${kromme([{ m: 160.4, s: 7.4 }], { ticks: [{ v: 150 }, { v: 160.4, l: '160,4' }, { v: 165 }, { v: 170 }], kleur: [100, 165], hoog: 130 })}
      <p>Kleiner dan 165 cm: <code>=NORM.VERD.N(165; 160,4; 7,4; WAAR)</code> = 0,733 → <b>73,3 %</b></p>
      <p>Groter dan 170 cm: 1 − 0,903 = 0,097 → <b>9,7 %</b> &nbsp;·&nbsp; Tussen 150 en 170 cm: 0,903 − 0,080 = 0,823 → <b>82,3 %</b></p>
      <p class="klein">Controle met de schets: 170 ligt iets boven $\\bar{x} + s = 167{,}8$. Boven 167,8 cm ligt 16 %, dus boven 170 cm iets minder: 9,7 % is logisch.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Appels: } N(150;\\, 20). \\text{ Lichter dan 140 g?}', stappen: ['\\text{=NORM.VERD.N(140; 150; 20; WAAR)} = 0{,}309', '30{,}9\\,\\%'] },
    { tex: '\\text{Appels: } N(150;\\, 20). \\text{ Zwaarder dan 185 g?}', stappen: ['\\text{=1 − NORM.VERD.N(185; 150; 20; WAAR)} = 1 - 0{,}960 = 0{,}040', '4{,}0\\,\\%'] },
  ],
  soorten: {
    bereken: { naam: 'Een kans met het rekenblad', gen() {
      const Q = excelVraag(), C = Q.C;
      const rij = { label: 'kans', doel: Q.p, norm: { m: C.m, s: C.s, a: Q.a, b: Q.b, kant: Q.v }, formule: Q.formule.replace(/−/g, '-').replace(/ - /g, '-') };
      return { soort: 'bereken', opdracht: `Hoeveel procent van de ${C.wie} ${C.v(Q.r)}? Typ de formule in het rekenblad en antwoord in procent op 0,1 % nauwkeurig.`, html: opgave(C.zin), sleutel: C.zin + Q.r, rapport: `${C.t}: ${Q.r} (rekenblad)`,
        antw: delen(['\\text{rekenblad}', rekenblad('', [], [rij])], ['\\text{percentage:}', pct(100 * Q.p, { dec: 1 })]), uitleg: [`\\text{${Q.formule}}`, Q.rek, `\\approx ${tg(W.rond(100 * Q.p, 1))}\\,\\%`] };
    } },
    model: { naam: 'Van gegevens naar model', gen() {
      const C = kies([{ t: 'het gewicht (g) van {n} appels uit een boomgaard', x: 'gewicht (g)', m: () => kies([145, 150, 155]), s: () => kies([15, 18, 20]), wie: 'appels', v: 'weegt' },
        { t: 'de lengte (cm) van {n} leerlingen van het 6de jaar', x: 'lengte (cm)', m: () => kies([168, 172, 175]), s: () => kies([7, 8, 9]), wie: 'leerlingen', v: 'is' },
        { t: 'de reactietijd (ms) van {n} deelnemers aan een test', x: 'reactietijd (ms)', m: () => kies([250, 270]), s: () => kies([20, 25]), wie: 'deelnemers', v: 'heeft' }]);
      const n = kies([100, 150, 200]), M = C.m(), S = C.s(), data = Array.from({ length: n }, () => Math.round(normRnd(M, S)));
      const m = gem(data), sd = stdevS(data), a = Math.round(M - S * kies([0.5, 0.7, 1.2])), k = data.filter(x => x < a).length;
      const pm = normVerd(a, m, sd), pr = normVerd(a, r1(m), r1(sd));
      if ([m, sd].some(x => W.grensgeval(x, 1)) || W.grensgeval(100 * pm, 1) || W.rond(100 * pm, 1) !== W.rond(100 * pr, 1) || !ex(100 * k / n)) return this.gen();
      const zin = `In het rekenblad staat ${C.t.replace('{n}', n)}. Het histogram is ongeveer klokvormig en symmetrisch: je gebruikt het model N(x̄; s). In de gegevens zijn er ${k} ${C.wie} met een waarde kleiner dan ${a}.`;
      const rb = rekenblad(C.x, data, [{ ...rijGem(n), doel: m }, { ...rijStdev(n), doel: sd }, { label: `model: kleiner dan ${a}`, doel: pm, alt: [pr], norm: { m, s: sd, a, kant: 'links' }, formule: `=NORM.VERD.N(${a}; C2; C3; WAAR)` }], { histogram: true, hoog: 10 });
      return { soort: 'model', opdracht: 'Bereken x̄ en s, gebruik het model en vergelijk met de gegevens.', html: opgave(zin), sleutel: data.join() + a, rapport: `${C.x} (${n}): model vs gegevens`,
        antw: delen(['\\text{rekenblad}', rb], ['\\bar{x} =', getal(m, { dec: 1 })], ['s =', getal(sd, { dec: 1 })], [`\\text{model: \\% kleiner dan ${a}}`, pct(100 * pm, { dec: 1 })], [`\\text{gegevens: \\% kleiner dan ${a}}`, pct(100 * k / n, { dec: 1 })]),
        uitleg: [`\\bar{x} \\approx ${tg(r1(m))} \\qquad s \\approx ${tg(r1(sd))}`, `\\text{=NORM.VERD.N(${a}; ${tekst(r1(m))}; ${tekst(r1(sd))}; WAAR)} \\approx ${tg(W.rond(pm, 3))} \\rightarrow ${tg(W.rond(100 * pm, 1))}\\,\\%`,
          ...pctUitleg(k, n, C.wie), `\\text{${Math.abs(100 * pm - 100 * k / n) < 3 ? 'dat ligt dicht bij elkaar: het model past goed' : 'het verschil is wat groter, maar het model is nog bruikbaar'}}`] };
    } },
    formule: { naam: 'De juiste formule', gen() {
      const Q = excelVraag(), C = Q.C, a = Q.a, b = Q.b;
      const alle = [`=${xl(a, C)}`, `=1 − ${xl(a, C)}`, `=${xl(b, C)} − ${xl(a, C)}`, `=NORM.VERD.N(${tekst(C.m)}; ${tekst(a)}; ${tekst(C.s)}; WAAR)`, `=1 − ${xl(b, C)}`];
      return { soort: 'formule', opdracht: `Met welke formule bereken je de kans dat een lukraak gekozen ${C.een} ${C.b(Q.r)}?`, html: opgave(C.zin), sleutel: C.zin + Q.r + 'f', rapport: `${C.t}: formule ${Q.r}`,
        antw: uniekKeuze(`<code>${Q.formule}</code>`, alle.map(f => `<code>${f}</code>`), kZin), uitleg: [Q.v === 'links' ? '\\text{links van } a \\text{: NORM.VERD.N(a; x̄; s; WAAR)}' : Q.v === 'rechts' ? '\\text{rechts van } a \\text{: 1 − NORM.VERD.N(a; …)}' : '\\text{tussen } a \\text{ en } b \\text{: NORM.VERD.N(b; …) − NORM.VERD.N(a; …)}', `\\text{${Q.formule}}`] };
    } },
    schat: { naam: 'Schatten met de schets', gen() {
      const Q = excelVraag(), C = Q.C; if (Q.v === 'tussen') return this.gen();
      const p = 100 * Q.p, gr = [0.15, 2.5, 16, 50, 84, 97.5, 99.85], lab = ['minder dan 0,15 %', 'tussen 0,15 % en 2,5 %', 'tussen 2,5 % en 16 %', 'tussen 16 % en 50 %', 'tussen 50 % en 84 %', 'tussen 84 % en 97,5 %', 'tussen 97,5 % en 99,85 %', 'meer dan 99,85 %'];
      const i = gr.findIndex(g => p < g), j = i === -1 ? 7 : i;
      const kz = uniekKeuze(lab[j], [j - 1, j + 1, j - 2, j + 2, j - 3, j + 3].filter(x => x >= 0 && x <= 7).map(x => lab[x]), kT);
      return { soort: 'schat', opdracht: `Zonder rekenblad: hoeveel procent van de ${C.wie} ${C.v(Q.r)}? Kies met een schets.`, html: opgave(C.zin) + schets(C), sleutel: C.zin + Q.r + 's', rapport: `${C.t}: schatting ${Q.r}`,
        antw: kz, uitleg: [`${[-3, -2, -1, 0, 1, 2, 3].map(k => tg(W.rond(C.m + k * C.s, 6))).join(' \\quad ')}`, `\\text{${tekst(Q.a)} ligt tussen twee van die grenzen: ${lab[j]}}`, `\\text{(met het rekenblad: } ${tg(W.rond(p, 1))}\\,\\%\\text{)}`] };
    } },
  },
  oefenMix: [['bereken', 3], ['formule', 1], ['schat', 1], ['model', 1]],
  test: [['bereken', 5], ['formule', 1], ['schat', 2], ['model', 2]], testSchudden: true,
};

// ---- 9. Eindtest ------------------------------------------------------------------------------------------
const D9 = {
  nr: 9, titel: 'Eindtest statistiek', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van statistiek door elkaar: steekproeven, gegevens verwerken en de normale verdeling.
      Herhaal gerust de theorie van een vorig deel. Je mag het rekenblad en je rekenmachine gebruiken.</p></div>`,
  voorbeelden: [],
  soorten: { pp: mix(D1, 'populatie'), gd: mix(D2, 'goed'), bs: mix(D3, 'besluit'), rl: mix(D4, 'rel'), hi: mix(D4, 'histo'), sd: mix(D5, 'stdev'), vg: mix(D5, 'vergelijk'), kp: mix(D6, 'koppel'), rg: mix(D7, 'procent'), xl: mix(D8, 'bereken') },
  oefenMix: [['pp', 1], ['gd', 1], ['bs', 1], ['rl', 1], ['hi', 1], ['sd', 1], ['vg', 1], ['kp', 1], ['rg', 1], ['xl', 1]],
  test: [['pp', 1], ['gd', 1], ['bs', 1], ['rl', 1], ['hi', 1], ['sd', 1], ['vg', 1], ['kp', 1], ['rg', 1], ['xl', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'statistiek', titel: 'Statistiek', ondertitel: 'Statistiek · 7VJHO', klas: '7VJHO', drempel: 70,
  intro: `<p>Je leert wanneer een steekproef een goed beeld geeft van de populatie, hoe je gegevens samenvat in een frequentietabel, een histogram, een gemiddelde en een standaardafwijking,
    en hoe je met de normale verdeling kansen bepaalt: met de 68-95-99,7-regel en met het rekenblad.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p class="klein"><b>Afspraken:</b> procenten, gemiddelden en standaardafwijkingen rond je af op <b>1 decimaal</b> (komt het exact uit, dan schrijf je het gewoon zo).
    Procenten bereken je met een verhoudingstabel. Formules typ je in het <b>rekenblad</b> in het leerpad; je mag ook je rekenmachine gebruiken.</p>`,
  groepen: [{ titel: 'A · Steekproeven', delen: [1, 2, 3] }, { titel: 'B · Gegevens verwerken', delen: [4, 5] }, { titel: 'C · De normale verdeling', delen: [6, 7, 8] }, { titel: 'D · Eindtest', delen: [9] }],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9],
});
})();
