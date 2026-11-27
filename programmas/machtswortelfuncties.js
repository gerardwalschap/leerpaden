// Programma 'machtswortelfuncties' — automatisch samengevoegd uit bron/machtswortelfuncties/ (niet rechtstreeks bewerken)
(() => {
// ===== Machtswortelfuncties · Wiskunde 5BCW / 5WW — hulpmiddelen =====
// Leidraad: de cursus "4. Machtswortelfuncties" en de PWP "4. Machtswortelfuncties" (G. Walschap).
// Enkel wat in de cursus/PWP staat: f(x) = ⁿ√x (n ≥ 2), even/oneven, domein, bereik, gedrag op oneindig,
// nulwaarde, geen horizontale asymptoot, vergelijking met rationale functies, interpretatie in zorg en welzijn.
// Eenvoudige taal (ook voor OKAN-leerlingen).
const { rnd, kies, schud } = W;
const tg = (x) => W.texGetal(x);
const wt = (n, a = 'x') => W.wortel(n, a);
const I = Infinity;
const BLAUW = '#1c4e8a', ORANJE = '#e8772e';
const NAMEN = ['f', 'g', 'h', 'k'];
const isEven = (n) => n % 2 === 0;
const EVEN_N = [2, 4, 6, 8, 10, 12], ONEVEN_N = [3, 5, 7, 9, 11];
const rt = (n) => (x) => isEven(n) ? (x >= 0 ? Math.pow(x, 1 / n) : NaN) : Math.sign(x) * Math.pow(Math.abs(x), 1 / n);
const vTex = (naam, n) => `${naam}(x) = ${wt(n)}`;
const nTekst = (n) => `n = ${n} \\text{ is ${isEven(n) ? 'even' : 'oneven'}}`;

// ---------- antwoorden
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const vz = (stukken, voor) => ({ soort: 'verzameling', stukken, voor });
const POS = [{ a: 0, ai: true, b: I, bi: false }];      // [0, +∞[
const ALLE = [{ a: -I, ai: false, b: I, bi: false }];   // ℝ
const POS_TEX = '[0, +\\infty{[}', R_TEX = '\\mathbb{R}';
// meerkeuze met TeX-opties; de juiste staat op plaats 0
function keuzeTex(juist, fout) {
  const alle = schud([juist, ...fout.filter((z, i, a) => z !== juist && a.indexOf(z) === i).slice(0, 3)]);
  return { soort: 'keuze', opties: alle.map((l, i) => ({ k: String(i), l })), juist: String(alle.indexOf(juist)) };
}
// meerkeuze met zinnen onder elkaar; de juiste staat op plaats 0
function zinnen(juist, fout, max = 3) {
  const alle = schud([juist, ...schud(fout.filter((z, i, a) => z !== juist && a.indexOf(z) === i)).slice(0, max)]);
  return { soort: 'keuze', lijst: true, opties: alle.map((z, i) => ({ k: String(i), l: z, html: true, tekst: z })), juist: String(alle.indexOf(juist)) };
}
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const LIM = (pijl, n) => `\\lim\\limits_{x \\to ${pijl}} ${wt(n)}`;

// ---------- grafiek van een of meer machtswortelfuncties (SVG)
// functies: [{n, kleur, label}] · opt: {x:[x0,x1], y:[y0,y1], punten:[{x,y}], naam: true}
function graf(functies, opt = {}) {
  const [X0, X1] = opt.x || [-8, 8], [Y0, Y1] = opt.y || [-3, 3];
  const B = opt.klein ? 220 : 320, sc = B / (X1 - X0), m = 18, H = (Y1 - Y0) * sc;
  const X = (x) => m + (x - X0) * sc, Y = (y) => m + (Y1 - y) * sc;
  let g = '';
  for (let k = Math.ceil(X0); k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>`;
  for (let k = Math.ceil(Y0); k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>`;
  g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1) + 6}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.4" marker-end="url(#mwp)"/>`;
  g += `<line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1) - 6}" stroke="#1f2733" stroke-width="1.4" marker-end="url(#mwp)"/>`;
  g += `<text x="${X(X1) + 2}" y="${Y(0) - 6}" font-size="12" text-anchor="end" font-style="italic">x</text><text x="${X(0) + 6}" y="${Y(Y1) + 6}" font-size="12" font-style="italic">y</text>`;
  for (let k = Math.ceil(X0); k < X1; k++) if (k !== 0 && (X1 - X0 <= 12 || k % 2 === 0)) g += `<text x="${X(k)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle" fill="#555">${k < 0 ? '−' + (-k) : k}</text>`;
  for (let k = Math.ceil(Y0); k < Y1; k++) if (k !== 0) g += `<text x="${X(0) - 5}" y="${Y(k) + 4}" font-size="10" text-anchor="end" fill="#555">${k < 0 ? '−' + (-k) : k}</text>`;
  for (const fu of functies) {
    const f = rt(fu.n);
    let d = '', aan = false;
    for (let i = 0; i <= 1600; i++) {
      // dichter bij 0 (waar de grafiek steil is) meer punten
      const t = -1 + 2 * i / 1600, x = t < 0 ? -Math.abs(X0) * t * t : X1 * t * t;
      const y = f(x);
      if (!Number.isFinite(y) || y < Y0 - 1 || y > Y1 + 1 || x < X0 || x > X1) { aan = false; continue; }
      d += `${aan ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)} `; aan = true;
    }
    g += `<path d="${d}" fill="none" stroke="${fu.kleur || BLAUW}" stroke-width="2.6"/>`;
    if (fu.label) { const lx = X1 - 1.6, ly = f(lx); g += `<text x="${X(lx)}" y="${Y(ly) - 9}" font-size="13" font-weight="bold" fill="${fu.kleur || BLAUW}" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="4">${fu.label}</text>`; }
  }
  for (const p of opt.punten || []) g += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4.2" fill="${ORANJE}"/>`;
  const w = B + 2 * m, hh = H + 2 * m;
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif">
    <defs><marker id="mwp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f2733"/></marker></defs>${g}</svg></div>`;
}
// label in de grafiek, bv. "⁴√x"
const SUPC = { 2: '', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰', 11: '¹¹', 12: '¹²' };
const wLabel = (n, naam) => `${naam ? naam + '(x) = ' : ''}${SUPC[n]}√x`;
const grafEven = (n, naam) => graf([{ n, label: wLabel(n, naam) }], { x: [-2, 10], y: [-2, 4] });
const grafOneven = (n, naam) => graf([{ n, label: wLabel(n, naam) }], { x: [-9, 9], y: [-3, 3] });

// ---------- grafiek van een situatie: y = c·√t  (t = 0 … 40, rooster per 4 en per c)
function grafContext(ctx) {
  const X1 = 40, Y1 = ctx.c * 7, B = 340, H = 230, mL = 46, mB = 40, mT = 14, mR = 16;
  const X = (x) => mL + x / X1 * B, Y = (y) => mT + (Y1 - y) / Y1 * H;
  let g = '';
  for (let k = 0; k <= X1; k += 4) g += `<line x1="${X(k)}" y1="${Y(0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/><text x="${X(k)}" y="${Y(0) + 14}" font-size="10" text-anchor="middle" fill="#555">${k}</text>`;
  for (let k = 0; k <= Y1; k += ctx.c) g += `<line x1="${X(0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/><text x="${X(0) - 5}" y="${Y(k) + 4}" font-size="10" text-anchor="end" fill="#555">${k}</text>`;
  g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(X1) + 6}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.4" marker-end="url(#mwc)"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(Y1) - 6}" stroke="#1f2733" stroke-width="1.4" marker-end="url(#mwc)"/>`;
  g += `<text x="${X(X1 / 2)}" y="${Y(0) + 32}" font-size="11.5" text-anchor="middle">${ctx.xas}</text>`;
  g += `<text x="${12}" y="${Y(Y1 / 2)}" font-size="11.5" text-anchor="middle" transform="rotate(-90 12 ${Y(Y1 / 2)})">${ctx.yas}</text>`;
  let d = '';
  for (let i = 0; i <= 400; i++) { const t = X1 * (i / 400) ** 2; d += `${i ? 'L' : 'M'}${X(t).toFixed(1)},${Y(ctx.c * Math.sqrt(t)).toFixed(1)} `; }
  g += `<path d="${d}" fill="none" stroke="${BLAUW}" stroke-width="2.6"/>`;
  const w = mL + B + mR, hh = mT + H + mB;
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek van de situatie" style="font-family:Verdana,sans-serif">
    <defs><marker id="mwc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f2733"/></marker></defs>${g}</svg></div>`;
}
// situaties uit de zorg en welzijn (grootheid steeds ≥ 0, stijgt steeds trager)
const CONTEXTEN = [
  { titel: 'De ontwikkelingsscore van een kind', xas: 'leeftijd (maanden)', yas: 'ontwikkelingsscore', c: 10, x: 'de leeftijd', y: 'de score', xe: 'maanden', ye: 'punten', na: (t) => `na ${t} maanden` },
  { titel: 'Woorden leren bij de logopedist', xas: 'aantal weken logopedie', yas: 'aantal woorden', c: 25, x: 'het aantal weken', y: 'het aantal woorden', xe: 'weken', ye: 'woorden', na: (t) => `na ${t} weken` },
  { titel: 'Herstel na een operatie', xas: 'aantal therapiesessies', yas: 'herstelscore', c: 5, x: 'het aantal sessies', y: 'de herstelscore', xe: 'sessies', ye: 'punten', na: (t) => `na ${t} sessies` },
  { titel: 'Zelfstandig leren eten in de zorgvoorziening', xas: 'aantal dagen oefenen', yas: 'zelfstandigheidsscore', c: 4, x: 'het aantal dagen', y: 'de score', xe: 'dagen', ye: 'punten', na: (t) => `na ${t} dagen` },
];
// "Y is evenredig met de vierkantswortel van X"
const EVENREDIG = [
  { y: 'de herstelscore van een patiënt', x: 'het aantal therapiesessies' },
  { y: 'de aanbevolen dosis van een medicijn (in mg)', x: 'het lichaamsgewicht (in kg)' },
  { y: 'het aantal woorden dat een kind kent', x: 'het aantal weken logopedie' },
  { y: 'de conditiescore van een bewoner in het woonzorgcentrum', x: 'het aantal weken beweegtraining' },
];

// ---------- vaste theorieblokken
const DEF = `<div class="kader def"><div class="kader-titel">Wat is een machtswortelfunctie?</div>
  <p>Een <b>machtswortelfunctie</b> is een functie van de vorm $f(x) = ${wt('n')}$, met $n \\in \\mathbb{N}$ en $n \\geq 2$.</p>
  <ul><li>$n$ is <b>even</b> ($2, 4, 6, \\ldots$): een <b>even machtswortelfunctie</b>, bv. $\\sqrt{x}$, $\\sqrt[4]{x}$, $\\sqrt[6]{x}$</li>
  <li>$n$ is <b>oneven</b> ($3, 5, 7, \\ldots$): een <b>oneven machtswortelfunctie</b>, bv. $\\sqrt[3]{x}$, $\\sqrt[5]{x}$, $\\sqrt[7]{x}$</li></ul>
  <p class="klein">Bij $\\sqrt{x}$ is $n = 2$: de 2 schrijf je meestal niet.</p></div>`;
const SAMENVATTING = `<div class="kader eig"><div class="kader-titel">Samenvatting: even versus oneven</div>
  <table class="tabel"><tr><th></th><th>even ($n = 2, 4, 6, \\ldots$)</th><th>oneven ($n = 3, 5, 7, \\ldots$)</th></tr>
  <tr><th>domein</th><td>$${POS_TEX}$</td><td>$\\mathbb{R}$</td></tr>
  <tr><th>bereik</th><td>$${POS_TEX}$</td><td>$\\mathbb{R}$</td></tr>
  <tr><th>gedrag op oneindig</th><td>stijgt naar $+\\infty$<br>(geen horizontale asymptoot)</td><td>stijgt naar $+\\infty$ en daalt naar $-\\infty$<br>(geen horizontale asymptoot)</td></tr>
  <tr><th>verloop</th><td>steeds stijgend</td><td>steeds stijgend</td></tr></table>
  <p><b>Onthoud:</b> kan ik hier ook een <b>negatief getal</b> invullen? <b>Nee</b> → even (domein begint bij 0). <b>Ja</b> → oneven (domein is heel $\\mathbb{R}$).</p></div>`;
const INTYPEN = `<div class="kader"><div class="kader-titel">Zo typ je een domein of bereik</div>
  <ul><li>Van 0 tot oneindig: <code>[0, +∞[</code> (gebruik de knop ∞). Het haakje bij $+\\infty$ staat altijd naar buiten.</li>
  <li>Alle reële getallen: de knop <code>ℝ</code>.</li></ul></div>`;
// ===================================================================
//  DEEL 1 · MACHTSWORTELS EN MACHTSWORTELFUNCTIES
// ===================================================================
const D1 = {
  nr: 1, titel: 'Machtswortels en machtswortelfuncties', kort: 'Even of oneven? Machtswortels berekenen, let op het teken.', rekenmachine: false,
  theorie: `${DEF}
    <div class="kader eig"><div class="kader-titel">Machtswortels berekenen</div>
      <p>$${wt('n', 'a')} = b$ betekent: $b^n = a$.</p>
      <ul><li><b>Even</b> machtswortel: uit een negatief getal <b>kan niet</b> (bestaat niet in $\\mathbb{R}$). De uitkomst is nooit negatief.</li>
      <li><b>Oneven</b> machtswortel: kan <b>altijd</b>. Uit een negatief getal komt een negatief getal.</li></ul>
      <p class="klein">Waarom? Een getal tot een even macht is nooit negatief: $(-2)^4 = 16$. Een getal tot een oneven macht houdt zijn teken: $(-2)^3 = -8$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p>$\\sqrt{49} = 7$, want $7^2 = 49$ &nbsp;·&nbsp; $\\sqrt[3]{64} = 4$, want $4^3 = 64$ &nbsp;·&nbsp; $\\sqrt[3]{-8} = -2$, want $(-2)^3 = -8$</p>
      <p>$\\sqrt[4]{81} = 3$, want $3^4 = 81$ &nbsp;·&nbsp; $\\sqrt[5]{-32} = -2$, want $(-2)^5 = -32$ &nbsp;·&nbsp; $\\sqrt[4]{-16}$ bestaat niet in $\\mathbb{R}$</p></div>`,
  voorbeelden: [
    { tex: 'g(x) = \\sqrt[9]{x}', stappen: ['n = 9 \\text{ is oneven}', '\\Rightarrow g \\text{ is een oneven machtswortelfunctie}'] },
    { tex: '\\sqrt[3]{-27}', stappen: ['(-3)^3 = -27', '\\Rightarrow \\sqrt[3]{-27} = -3'] },
    { tex: '\\sqrt[6]{-64}', stappen: ['n = 6 \\text{ is even en } -64 \\text{ is negatief}', '\\Rightarrow \\sqrt[6]{-64} \\text{ bestaat niet in } \\mathbb{R}'] },
  ],
  soorten: {
    evenOneven: { naam: 'Even of oneven (voorschrift)', gen() {
      const n = rnd(2, 12), naam = kies(NAMEN);
      return { soort: 'evenOneven', opdracht: 'Is dit een even of een oneven machtswortelfunctie?', tex: vTex(naam, n), sleutel: 'eo' + n,
        antw: { soort: 'keuze', opties: [{ k: 'e', l: '\\text{even}' }, { k: 'o', l: '\\text{oneven}' }], juist: isEven(n) ? 'e' : 'o' },
        uitleg: [`${nTekst(n)}`, `\\Rightarrow \\text{een ${isEven(n) ? 'even' : 'oneven'} machtswortelfunctie}`] };
    } },
    welke: { naam: 'Welke functie is even/oneven?', gen() {
      const zoekEven = kies([true, false]);
      const juistN = kies(zoekEven ? EVEN_N : ONEVEN_N), fout = schud(zoekEven ? ONEVEN_N : EVEN_N).slice(0, 3);
      const a = keuzeTex(wt(juistN), fout.map(n => wt(n)));
      return { soort: 'welke', opdracht: `Welke functie is een ${zoekEven ? 'EVEN' : 'ONEVEN'} machtswortelfunctie? Kies het juiste voorschrift.`, sleutel: 'w' + juistN + zoekEven,
        antw: a, uitleg: [`${wt(juistN)}: ${nTekst(juistN)}`, `\\text{De andere hebben een ${zoekEven ? 'oneven' : 'even'} } n.`] };
    } },
    reken: { naam: 'Machtswortel berekenen', gen() {
      const n = kies([2, 2, 3, 3, 4, 5]);
      const b = n === 2 ? rnd(2, 12) : n === 3 ? rnd(1, 6) * kies([1, -1]) : n === 4 ? rnd(1, 4) : rnd(1, 3) * kies([1, -1]);
      const a = b ** n;
      return { soort: 'reken', opdracht: 'Bereken zonder rekenmachine. Let op het teken.', tex: wt(n, tg(a)), sleutel: 'r' + n + '_' + a,
        antw: getal(b), uitleg: [`${W.haakjes(b)}^{${n}} = ${tg(a)}`, `\\Rightarrow ${wt(n, tg(a))} = ${tg(b)}`] };
    } },
    bestaat: { naam: 'Machtswortel uit een negatief getal', gen() {
      const n = kies([2, 3, 4, 5, 6, 3, 5]), b = n === 2 ? rnd(2, 10) : n <= 4 ? rnd(2, 4) : 2, a = -(b ** n);
      const juist = isEven(n) ? '\\text{bestaat niet in } \\mathbb{R}' : tg(-b);
      const ant = keuzeTex(juist, [tg(-b), tg(b), '\\text{bestaat niet in } \\mathbb{R}', `\\pm ${tg(b)}`]);
      return { soort: 'bestaat', opdracht: 'Welke uitkomst is juist?', tex: wt(n, tg(a)), sleutel: 'b' + n + '_' + a, antw: ant,
        uitleg: isEven(n) ? [`${nTekst(n)}: \\text{een getal tot de } ${n}\\text{de macht is nooit negatief}`, `\\Rightarrow ${wt(n, tg(a))} \\text{ bestaat niet in } \\mathbb{R}`]
          : [`${nTekst(n)}: (${tg(-b)})^{${n}} = ${tg(a)}`, `\\Rightarrow ${wt(n, tg(a))} = ${tg(-b)}`] };
    } },
  },
  oefenMix: [['evenOneven', 1], ['welke', 1], ['reken', 2], ['bestaat', 2]],
  test: [['evenOneven', 2], ['welke', 2], ['reken', 3], ['bestaat', 3]], testSchudden: true,
};

// ===================================================================
//  gemeenschappelijke vraagsoorten voor deel 2, 3 en 4
// ===================================================================
function domeinVraag(soort, n, metGraf = false) {
  const naam = kies(NAMEN), ev = isEven(n);
  return { soort, opdracht: metGraf ? `Lees het domein af uit de grafiek van ${naam}.` : `Bepaal het domein van ${naam}.`, tex: vTex(naam, n),
    html: metGraf ? (ev ? grafEven(n, naam) : grafOneven(n, naam)) : undefined, sleutel: soort + n + metGraf,
    antw: vz(ev ? POS : ALLE, `\\text{dom } ${naam} =`),
    uitleg: [nTekst(n), ev ? '\\text{enkel } x \\geq 0 \\text{ is toegelaten (geen even machtswortel uit een negatief getal)}' : '\\text{elk reëel getal is toegelaten}', `\\text{dom } ${naam} = ${ev ? POS_TEX : R_TEX}`] };
}
function bereikVraag(soort, n, metGraf = false) {
  const naam = kies(NAMEN), ev = isEven(n);
  return { soort, opdracht: metGraf ? `Lees het bereik af uit de grafiek van ${naam}.` : `Bepaal het bereik van ${naam}.`, tex: vTex(naam, n),
    html: metGraf ? (ev ? grafEven(n, naam) : grafOneven(n, naam)) : undefined, sleutel: soort + n + metGraf,
    antw: vz(ev ? POS : ALLE, `\\text{ber } ${naam} =`),
    uitleg: [nTekst(n), ev ? '\\text{de functiewaarden zijn nooit negatief}' : '\\text{de functiewaarden doorlopen alle reële getallen}', `\\text{ber } ${naam} = ${ev ? POS_TEX : R_TEX}`] };
}
const KAN_NIET = '\\text{kan niet: } x \\text{ kan niet naar } -\\infty';
function limietVraag(soort, n, pijl) {
  const ev = isEven(n);
  const juist = pijl === '+\\infty' ? '+\\infty' : (ev ? KAN_NIET : '-\\infty');
  const fout = pijl === '+\\infty' ? ['-\\infty', '0', '1'] : ev ? ['-\\infty', '0', '+\\infty'] : ['+\\infty', '0', KAN_NIET];
  const uitleg = pijl === '+\\infty' ? [`${nTekst(n)}`, `${wt(n)} \\text{ stijgt voortdurend, maar steeds trager: } ${LIM('+\\infty', n)} = +\\infty`]
    : ev ? [nTekst(n), '\\text{dom} = [0, +\\infty{[}: \\text{ negatieve } x \\text{ zijn niet toegelaten, dus } x \\text{ kan niet naar } -\\infty']
      : [nTekst(n), `\\text{dom} = \\mathbb{R}: \\; ${LIM('-\\infty', n)} = -\\infty`];
  return { soort, opdracht: 'Wat is het gedrag op oneindig?', tex: `${LIM(pijl, n)} = \\; ?`, sleutel: soort + n + pijl, antw: keuzeTex(juist, fout), uitleg };
}
const ASYMP_JUIST = 'Nee: de functie blijft stijgen (steeds trager), ze nadert geen vaste waarde.';
const ASYMP_FOUT = ['Ja: de horizontale asymptoot is y = 0.', 'Ja: de horizontale asymptoot is y = 1.', 'Ja: als x heel groot wordt, nadert de functie een vaste waarde.', 'Ja: de horizontale asymptoot is y = 2.'];
function asymptootVraag(soort, n) {
  const naam = kies(NAMEN);
  return { soort, opdracht: `Heeft ${naam} een horizontale asymptoot?`, tex: vTex(naam, n), sleutel: soort + n, antw: zinnen(ASYMP_JUIST, ASYMP_FOUT),
    uitleg: [`${LIM('+\\infty', n)} = +\\infty`, '\\text{Een machtswortelfunctie heeft nooit een horizontale asymptoot.}'] };
}
const UITSPRAAK = {
  evenJuist: ['De functiewaarden zijn nooit negatief.', 'De nulwaarde is x = 0.', 'De functie is steeds stijgend.', 'De functie heeft geen horizontale asymptoot.', 'Je kan geen negatief getal invullen.', 'De grafiek begint in de oorsprong.'],
  evenFout: ['De functie heeft een horizontale asymptoot.', 'Het domein is ℝ.', 'Het bereik is ℝ.', 'De functiewaarden kunnen negatief zijn.', 'De functie is dalend.', 'Je kan x = −16 invullen.', 'De grafiek ligt ook links van de y-as.'],
  onevenJuist: ['Het domein is ℝ.', 'Het bereik is ℝ.', 'De functie is steeds stijgend.', 'Je kan ook negatieve getallen invullen.', 'De functie heeft geen horizontale asymptoot.', 'De nulwaarde is x = 0.', 'De grafiek ligt links én rechts van de y-as.'],
  onevenFout: ['Het domein is [0, +∞[.', 'De functiewaarden zijn nooit negatief.', 'De functie heeft een horizontale asymptoot.', 'De functie is dalend.', 'Je kan geen negatief getal invullen.', 'De grafiek ligt enkel rechts van de y-as.', 'De grafiek begint in de oorsprong.'],
};
function uitspraakVraag(soort, n) {
  const naam = kies(NAMEN), ev = isEven(n), juist = kies(ev ? UITSPRAAK.evenJuist : UITSPRAAK.onevenJuist);
  return { soort, opdracht: `Welke uitspraak over ${naam} is juist?`, tex: vTex(naam, n), sleutel: soort + n + juist,
    antw: zinnen(juist, ev ? UITSPRAAK.evenFout : UITSPRAAK.onevenFout),
    uitleg: [nTekst(n), ev ? `\\text{dom} = \\text{ber} = ${POS_TEX} \\text{, nulwaarde } x = 0 \\text{, steeds stijgend, geen horizontale asymptoot}`
      : `\\text{dom} = \\text{ber} = \\mathbb{R} \\text{, nulwaarde } x = 0 \\text{, steeds stijgend, geen horizontale asymptoot}`] };
}

// ===================================================================
//  DEEL 2 · EVEN MACHTSWORTELFUNCTIES
// ===================================================================
const D2 = {
  nr: 2, titel: 'Even machtswortelfuncties', kort: '√x, ⁴√x, ⁶√x …: domein, bereik, gedrag op oneindig, nulwaarde.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Even machtswortelfuncties ($n = 2, 4, 6, \\ldots$)</div>
      <p>Bij een even machtswortelfunctie bestaat $${wt('n')}$ <b>enkel voor $x \\geq 0$</b>: je kan geen even machtswortel trekken uit een negatief getal.</p>
      ${graf([{ n: 2, label: 'f(x) = √x' }], { x: [-2, 10], y: [-2, 4], punten: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 4, y: 2 }, { x: 9, y: 3 }] })}
      <ul><li><b>Domein:</b> $\\text{dom } f = ${POS_TEX}$ (enkel $x \\geq 0$ is toegelaten)</li>
      <li><b>Bereik:</b> $\\text{ber } f = ${POS_TEX}$ (de functiewaarden zijn nooit negatief)</li>
      <li><b>Gedrag op oneindig:</b> $${LIM('+\\infty', 2)} = +\\infty$. De functie stijgt voortdurend, maar steeds trager: <b>geen horizontale asymptoot</b>.</li>
      <li><b>Nulwaarde:</b> $\\sqrt{0} = 0$, dus $x = 0$. De grafiek begint in de oorsprong.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Dit geldt voor elke even machtswortelfunctie</div>
      ${graf([{ n: 2, label: '√x' }, { n: 4, label: '⁴√x', kleur: ORANJE }], { x: [-2, 10], y: [-2, 4] })}
      <p>$\\sqrt{x}$, $\\sqrt[4]{x}$, $\\sqrt[6]{x}$, …: zelfde domein, bereik en gedrag op oneindig. Enkel de <b>kromming</b> verschilt lichtjes.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = \\sqrt[6]{x}', html: grafEven(6, 'f'), stappen: ['n = 6 \\text{ is even}', `\\text{dom } f = ${POS_TEX} \\quad \\text{ber } f = ${POS_TEX}`, `${LIM('+\\infty', 6)} = +\\infty \\text{ (geen horizontale asymptoot)}`, '\\text{nulwaarde: } x = 0 \\text{; steeds stijgend}'] },
    { tex: '\\lim\\limits_{x \\to -\\infty} \\sqrt[4]{x}', stappen: ['n = 4 \\text{ is even: dom} = [0, +\\infty{[}', '\\text{kan niet: } x \\text{ kan niet naar } -\\infty'] },
  ],
  soorten: {
    domein: { naam: 'Domein (voorschrift)', gen() { return domeinVraag('domein', kies(EVEN_N)); } },
    domGraf: { naam: 'Domein (grafiek)', gen() { return domeinVraag('domGraf', kies([2, 4, 6]), true); } },
    bereik: { naam: 'Bereik', gen() { return bereikVraag('bereik', kies(EVEN_N), kies([true, false])); } },
    limiet: { naam: 'Gedrag op oneindig', gen() { return limietVraag('limiet', kies(EVEN_N), kies(['+\\infty', '+\\infty', '-\\infty'])); } },
    asymptoot: { naam: 'Horizontale asymptoot?', gen() { return asymptootVraag('asymptoot', kies(EVEN_N)); } },
    uitspraak: { naam: 'Welke uitspraak is juist?', gen() { return uitspraakVraag('uitspraak', kies(EVEN_N)); } },
  },
  oefenMix: [['domein', 1], ['domGraf', 1], ['bereik', 1], ['limiet', 1], ['asymptoot', 1], ['uitspraak', 1]],
  test: [['domein', 2], ['domGraf', 1], ['bereik', 2], ['limiet', 2], ['asymptoot', 1], ['uitspraak', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 3 · ONEVEN MACHTSWORTELFUNCTIES
// ===================================================================
function grafiekVraag(soort) {
  const ev = kies([true, false]), n = ev ? kies([2, 4, 6]) : kies([3, 5, 7]);
  return { soort, opdracht: 'Hoort deze grafiek bij een even of bij een oneven machtswortelfunctie?', html: graf([{ n }], { x: [-8, 8], y: [-3, 3] }), sleutel: soort + n,
    antw: { soort: 'keuze', opties: [{ k: 'e', l: '\\text{even}' }, { k: 'o', l: '\\text{oneven}' }], juist: ev ? 'e' : 'o' },
    uitleg: ev ? ['\\text{De grafiek begint in de oorsprong en ligt enkel rechts van de } y\\text{-as.}', `\\text{dom} = ${POS_TEX} \\Rightarrow \\text{even}`]
      : ['\\text{De grafiek ligt ook links van de } y\\text{-as.}', '\\text{dom} = \\mathbb{R} \\Rightarrow \\text{oneven}'] };
}
const D3 = {
  nr: 3, titel: 'Oneven machtswortelfuncties', kort: '∛x, ⁵√x, ⁷√x …: domein, bereik, gedrag op oneindig. Even of oneven aan de grafiek.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Oneven machtswortelfuncties ($n = 3, 5, 7, \\ldots$)</div>
      <p>Bij een oneven machtswortelfunctie bestaat $${wt('n')}$ <b>voor elke reële $x$</b>, ook voor negatieve. Bijvoorbeeld $\\sqrt[3]{-8} = -2$, want $(-2)^3 = -8$.</p>
      ${graf([{ n: 3, label: 'f(x) = ∛x' }], { x: [-9, 9], y: [-3, 3], punten: [{ x: -8, y: -2 }, { x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 8, y: 2 }] })}
      <ul><li><b>Domein:</b> $\\text{dom } f = \\mathbb{R}$ (elk reëel getal is toegelaten)</li>
      <li><b>Bereik:</b> $\\text{ber } f = \\mathbb{R}$ (de functiewaarden doorlopen alle reële getallen)</li>
      <li><b>Gedrag op oneindig:</b> $${LIM('+\\infty', 3)} = +\\infty$ en $${LIM('-\\infty', 3)} = -\\infty$. Steeds stijgend: <b>geen horizontale asymptoot</b>.</li>
      <li><b>Nulwaarde:</b> $\\sqrt[3]{0} = 0$, dus $x = 0$.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Dit geldt voor elke oneven machtswortelfunctie</div>
      ${graf([{ n: 3, label: '∛x' }, { n: 5, label: '⁵√x', kleur: ORANJE }], { x: [-9, 9], y: [-3, 3] })}
      <p>$\\sqrt[3]{x}$, $\\sqrt[5]{x}$, $\\sqrt[7]{x}$, …: zelfde domein, bereik en gedrag op oneindig. Enkel de kromming verschilt lichtjes.</p></div>
    <div class="kader"><div class="kader-titel">Even of oneven aan de grafiek?</div>
      <p>Ligt de grafiek ook <b>links van de $y$-as</b>? Dan is het domein $\\mathbb{R}$: <b>oneven</b>. Begint de grafiek in de oorsprong en ligt ze enkel rechts van de $y$-as? Dan is het domein $${POS_TEX}$: <b>even</b>.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'g(x) = \\sqrt[7]{x}', html: grafOneven(7, 'g'), stappen: ['n = 7 \\text{ is oneven}', '\\text{dom } g = \\mathbb{R} \\quad \\text{ber } g = \\mathbb{R}', `${LIM('+\\infty', 7)} = +\\infty \\quad ${LIM('-\\infty', 7)} = -\\infty`, '\\text{geen horizontale asymptoot; nulwaarde } x = 0'] },
    { html: graf([{ n: 4 }], { x: [-8, 8], y: [-3, 3] }), stappen: ['\\text{De grafiek begint in de oorsprong, enkel rechts van de } y\\text{-as}', `\\text{dom} = ${POS_TEX} \\Rightarrow \\text{even machtswortelfunctie}`] },
  ],
  soorten: {
    domein: { naam: 'Domein', gen() { return domeinVraag('domein', kies(ONEVEN_N), kies([true, false])); } },
    bereik: { naam: 'Bereik', gen() { return bereikVraag('bereik', kies(ONEVEN_N), kies([true, false])); } },
    limPlus: { naam: 'Gedrag naar +∞', gen() { return limietVraag('limPlus', kies(ONEVEN_N), '+\\infty'); } },
    limMin: { naam: 'Gedrag naar −∞', gen() { return limietVraag('limMin', kies(ONEVEN_N), '-\\infty'); } },
    grafiek: { naam: 'Even of oneven (grafiek)', gen() { return grafiekVraag('grafiek'); } },
    uitspraak: { naam: 'Welke uitspraak is juist?', gen() { return uitspraakVraag('uitspraak', kies(ONEVEN_N)); } },
  },
  oefenMix: [['domein', 1], ['bereik', 1], ['limPlus', 1], ['limMin', 1], ['grafiek', 1], ['uitspraak', 1]],
  test: [['domein', 2], ['bereik', 2], ['limPlus', 1], ['limMin', 2], ['grafiek', 2], ['uitspraak', 1]], testSchudden: true,
};

// ===================================================================
//  DEEL 4 · EVEN VERSUS ONEVEN
// ===================================================================
const alleN = () => rnd(2, 12);
const D4 = {
  nr: 4, titel: 'Even versus oneven', kort: 'Alles samen: domein zonder grafiek, negatieve getallen invullen, vergelijken met rationale functies.', rekenmachine: false,
  theorie: `${SAMENVATTING}
    <div class="kader werk"><div class="kader-titel">Het domein zonder grafiek</div>
      <p>Kijk enkel naar $n$: $\\sqrt[8]{x}$: $n = 8$ even → $${POS_TEX}$ &nbsp;·&nbsp; $\\sqrt[11]{x}$: $n = 11$ oneven → $\\mathbb{R}$ &nbsp;·&nbsp; $\\sqrt{x}$: $n = 2$ even → $${POS_TEX}$</p></div>
    <div class="kader def"><div class="kader-titel">Vergelijk met de rationale functies (vorig hoofdstuk)</div>
      <ul><li>Een <b>rationale functie</b> kan een <b>horizontale asymptoot</b> hebben: als $x$ heel groot wordt, nadert $f(x)$ een vaste waarde.</li>
      <li>Een <b>machtswortelfunctie</b> heeft <b>nooit</b> een horizontale asymptoot: als $x$ heel groot wordt, wordt $f(x)$ ook heel groot ($+\\infty$), alleen stijgt ze steeds trager.</li></ul></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'f(x) = \\sqrt[12]{x}: \\; \\text{kan je } x = -5 \\text{ invullen?}', stappen: ['n = 12 \\text{ is even}', '\\text{Nee: geen even machtswortel uit een negatief getal; dom } f = [0, +\\infty{[}'] },
    { tex: 'g(x) = \\sqrt[5]{x}', stappen: ['n = 5 \\text{ is oneven}', '\\text{dom } g = \\mathbb{R}, \\; \\text{ber } g = \\mathbb{R}', `${LIM('-\\infty', 5)} = -\\infty`] },
  ],
  soorten: {
    domein: { naam: 'Domein', gen() { return domeinVraag('domein', alleN()); } },
    bereik: { naam: 'Bereik', gen() { return bereikVraag('bereik', alleN()); } },
    negatief: { naam: 'Negatief getal invullen?', gen() {
      const n = alleN(), naam = kies(NAMEN), a = rnd(2, 30), ev = isEven(n);
      const J = 'Ja: bij een oneven machtswortel mag je elk reëel getal invullen.', N = 'Nee: je kan geen even machtswortel trekken uit een negatief getal.';
      const extra = ['Ja: je mag altijd elk getal invullen.', 'Nee: je kan nooit een negatief getal invullen in een machtswortelfunctie.'];
      return { soort: 'negatief', opdracht: `Kan je in ${naam} het getal x = −${a} invullen?`, tex: vTex(naam, n), sleutel: 'neg' + n,
        antw: zinnen(ev ? N : J, [ev ? J : N, ...extra]),
        uitleg: [nTekst(n), ev ? `\\text{dom } ${naam} = ${POS_TEX}: \\; -${a} \\text{ is niet toegelaten}` : `\\text{dom } ${naam} = \\mathbb{R}: \\; ${wt(n, '-' + a)} \\text{ bestaat}`] };
    } },
    limMin: { naam: 'Gedrag naar −∞', gen() { return limietVraag('limMin', alleN(), '-\\infty'); } },
    kenmerken: { naam: 'Welke kenmerken horen erbij?', gen() {
      const n = alleN(), naam = kies(NAMEN), ev = isEven(n);
      const K = [
        'dom = [0, +∞[ · ber = [0, +∞[ · geen horizontale asymptoot',
        'dom = ℝ · ber = ℝ · geen horizontale asymptoot',
        'dom = [0, +∞[ · ber = ℝ · geen horizontale asymptoot',
        'dom = ℝ · ber = [0, +∞[ · horizontale asymptoot y = 0',
        'dom = [0, +∞[ · ber = [0, +∞[ · horizontale asymptoot y = 1'];
      return { soort: 'kenmerken', opdracht: `Welke kenmerken horen bij ${naam}?`, tex: vTex(naam, n), sleutel: 'ken' + n,
        antw: zinnen(K[ev ? 0 : 1], K.filter((_, i) => i !== (ev ? 0 : 1))),
        uitleg: [nTekst(n), ev ? `\\text{dom} = \\text{ber} = ${POS_TEX}` : '\\text{dom} = \\text{ber} = \\mathbb{R}', '\\text{een machtswortelfunctie heeft nooit een horizontale asymptoot}'] };
    } },
    vergelijk: { naam: 'Vergelijken met rationale functies', gen() {
      const vraag = kies([
        { o: 'Wat is het belangrijkste verschil tussen een machtswortelfunctie en een rationale functie (vorig hoofdstuk), als x heel groot wordt?',
          j: 'Een rationale functie kan een vaste waarde naderen (horizontale asymptoot), een machtswortelfunctie blijft stijgen.',
          f: ['Een machtswortelfunctie nadert een vaste waarde, een rationale functie nooit.', 'Beide hebben altijd een horizontale asymptoot.', 'Beide blijven altijd stijgen naar +∞.', 'Een machtswortelfunctie daalt, een rationale functie stijgt.'] },
        { o: 'Een grafiek stijgt steeds trager en nadert de waarde 50 als x heel groot wordt. Welke functie past?',
          j: 'een rationale functie met horizontale asymptoot y = 50',
          f: ['een even machtswortelfunctie', 'een oneven machtswortelfunctie', 'een machtswortelfunctie met horizontale asymptoot y = 50'] },
        { o: 'Een grafiek stijgt steeds trager, maar blijft stijgen zonder ooit een vaste waarde te naderen. Welke functie past?',
          j: 'een machtswortelfunctie',
          f: ['een rationale functie met een horizontale asymptoot', 'een functie met horizontale asymptoot y = 0', 'een dalende functie'] }]);
      return { soort: 'vergelijk', opdracht: 'Kies het juiste antwoord.', html: opgave(vraag.o), sleutel: 'verg' + vraag.j.slice(0, 12), antw: zinnen(vraag.j, vraag.f),
        uitleg: ['\\text{Rationale functie: kan een horizontale asymptoot hebben (nadert een vaste waarde).}', '\\text{Machtswortelfunctie: nooit een horizontale asymptoot, blijft stijgen naar } +\\infty.'] };
    } },
  },
  oefenMix: [['domein', 1], ['bereik', 1], ['negatief', 1], ['limMin', 1], ['kenmerken', 1], ['vergelijk', 1]],
  test: [['domein', 2], ['bereik', 1], ['negatief', 2], ['limMin', 2], ['kenmerken', 2], ['vergelijk', 1]], testSchudden: true,
};

// ===================================================================
//  DEEL 5 · IN DE ZORG EN HET WELZIJN
// ===================================================================
const LEES_T = [4, 16, 36];
const D5 = {
  nr: 5, titel: 'In de zorg en welzijn', kort: 'Grafieken aflezen, kenmerken uitleggen in een situatie, het juiste model kiezen.', rekenmachine: false,
  theorie: `<div class="kader werk"><div class="kader-titel">Voorbeeld: de ontwikkelingsscore van een kind</div>
      ${grafContext(CONTEXTEN[0])}
      <ul><li>Na 4 maanden is de score 20, na 16 maanden 40, na 36 maanden 60.</li>
      <li>Tussen 0 en 4 maanden stijgt de score met 20, tussen 16 en 36 maanden (5 keer zo lang!) ook maar met 20: de score stijgt <b>steeds trager</b>. In het begin is de grafiek <b>steiler</b>.</li>
      <li>De leeftijd wordt 4 keer zo groot (4 → 16)? Dan wordt de score maar <b>2 keer</b> zo groot (20 → 40).</li>
      <li>Een negatieve leeftijd of score is niet zinvol: een <b>even</b> machtswortelfunctie past (domein $${POS_TEX}$).</li>
      <li>De score blijft stijgen, ze nadert geen vaste waarde: <b>geen horizontale asymptoot</b>.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">"Evenredig met de vierkantswortel"</div>
      <p>Is een grootheid evenredig met de <b>vierkantswortel</b> van een andere grootheid, kijk dan naar de vierkantswortels:</p>
      <table class="tabel"><tr><th>aantal sessies</th><td>4</td><td>8</td><td>16</td><td>36</td></tr><tr><th>$\\sqrt{\\text{aantal sessies}}$</th><td>2</td><td>2,83</td><td>4</td><td>6</td></tr></table>
      <ul><li>2 keer zoveel sessies (4 → 8): de score wordt maar ongeveer <b>1,41 keer</b> zo groot (minder dan verdubbeld).</li>
      <li>4 keer zoveel sessies (4 → 16): de score wordt <b>2 keer</b> zo groot. 9 keer zoveel (4 → 36): <b>3 keer</b> zo groot.</li></ul></div>
    <div class="kader def"><div class="kader-titel">Welk model past?</div>
      <ul><li>Een grootheid die <b>nooit negatief</b> is en <b>steeds trager stijgt</b> (een leeftijd, een gewicht, een score …): een <b>even</b> machtswortelfunctie.</li>
      <li>Een <b>oneven</b> machtswortelfunctie past daar niet: domein en bereik zijn $\\mathbb{R}$, dus ook negatieve waarden. Een negatief gewicht of een negatieve leeftijd is niet zinvol.</li>
      <li>Nadert de grootheid een <b>vaste waarde</b>? Dan past eerder een rationale functie met een horizontale asymptoot.</li></ul></div>`,
  voorbeelden: [
    { html: grafContext(CONTEXTEN[2]) + opgave('Hoeveel stijgt de herstelscore tussen 4 en 16 sessies?'), stappen: ['\\text{na 4 sessies: } 10, \\quad \\text{na 16 sessies: } 20', '\\text{stijging: } 20 - 10 = 10 \\text{ punten}'] },
    { html: opgave('De dosis van een medicijn is evenredig met de vierkantswortel van het lichaamsgewicht. Het gewicht verdubbelt. Verdubbelt de dosis ook?'), stappen: ['\\sqrt{2} \\approx 1{,}41', '\\text{Nee: de dosis wordt maar ongeveer 1,41 keer zo groot.}'] },
  ],
  soorten: {
    aflezen: { naam: 'Waarde aflezen', gen() {
      const ctx = kies(CONTEXTEN), t = kies(LEES_T), y = ctx.c * Math.sqrt(t);
      return { soort: 'aflezen', opdracht: `${ctx.titel}. Lees af uit de grafiek.`, html: grafContext(ctx) + opgave(`Hoe groot is ${ctx.y} ${ctx.na(t)}?`), sleutel: 'afl' + ctx.c + t,
        antw: getal(y), uitleg: [`\\text{Ga bij ${t} ${ctx.xe} verticaal naar de grafiek en dan horizontaal naar de } y\\text{-as.}`, `\\text{${ctx.na(t)}: } ${y} \\text{ ${ctx.ye}}`] };
    } },
    stijging: { naam: 'Stijging aflezen', gen() {
      const ctx = kies(CONTEXTEN), paren = [[0, 4], [0, 16], [4, 16], [16, 36], [4, 36], [0, 36]], [a, b] = kies(paren);
      const ya = ctx.c * Math.sqrt(a), yb = ctx.c * Math.sqrt(b);
      return { soort: 'stijging', opdracht: `${ctx.titel}. Lees af uit de grafiek.`, html: grafContext(ctx) + opgave(`Hoeveel stijgt ${ctx.y} tussen ${a} en ${b} ${ctx.xe}?`), sleutel: 'st' + ctx.c + a + b,
        antw: getal(yb - ya), uitleg: [`\\text{bij ${a}: } ${ya}, \\quad \\text{bij ${b}: } ${yb}`, `\\text{stijging: } ${yb} - ${ya} = ${yb - ya} \\text{ ${ctx.ye}}`] };
    } },
    sneller: { naam: 'Waar stijgt het sneller?', gen() {
      const ctx = kies(CONTEXTEN), L = kies([4, 8]), b2 = 36, a2 = b2 - L;
      const A = `tussen 0 en ${L} ${ctx.xe}`, B = `tussen ${a2} en ${b2} ${ctx.xe}`;
      return { soort: 'sneller', opdracht: `${ctx.titel}. Wanneer stijgt ${ctx.y} het snelst?`, html: grafContext(ctx), sleutel: 'sn' + ctx.c + L,
        antw: zinnen(`${A}: daar is de grafiek het steilst`, [`${B}: daar is de grafiek het steilst`, 'Overal even snel: de stijging is overal gelijk', `${B}: daar is ${ctx.y} het grootst`]),
        uitleg: ['\\text{Een machtswortelfunctie stijgt steeds trager: in het begin is de grafiek het steilst.}'] };
    } },
    verdubbel: { naam: 'Evenredig met de vierkantswortel', gen() {
      const e = kies(EVENREDIG), k = kies([2, 4, 9]);
      const zin = (f) => `${e.y.charAt(0).toUpperCase() + e.y.slice(1)} wordt ${f}.`;
      const opties = { 2: zin('ongeveer 1,41 keer zo groot (minder dan verdubbeld)'), 4: zin('2 keer zo groot'), 9: zin('3 keer zo groot') };
      const fout = { 2: [zin('2 keer zo groot (verdubbeld)'), zin('4 keer zo groot'), zin('ongeveer 0,71 keer zo groot (kleiner)')],
        4: [zin('4 keer zo groot'), zin('16 keer zo groot'), zin('ongeveer 1,41 keer zo groot')], 9: [zin('9 keer zo groot'), zin('81 keer zo groot'), zin('4,5 keer zo groot')] };
      const kTekst = { 2: '2 keer zo groot (verdubbelt)', 4: '4 keer zo groot', 9: '9 keer zo groot' }[k];
      return { soort: 'verdubbel', opdracht: `${e.y.charAt(0).toUpperCase() + e.y.slice(1)} is evenredig met de vierkantswortel van ${e.x}.`, html: opgave(`${e.x.charAt(0).toUpperCase() + e.x.slice(1)} wordt ${kTekst}. Wat gebeurt er?`), sleutel: 'vd' + e.x + k,
        antw: zinnen(opties[k], fout[k]), uitleg: [`\\sqrt{${k}} ${k === 2 ? '\\approx 1{,}41' : '= ' + Math.sqrt(k)}`, `\\text{De grootheid wordt ${k === 2 ? 'ongeveer 1,41' : Math.sqrt(k)} keer zo groot.}`] };
    } },
    model: { naam: 'Welk model past?', gen() {
      const sit = kies([
        { s: 'Het aantal woorden dat een kind kent, stijgt met de leeftijd. Het aantal woorden is nooit negatief en stijgt steeds trager, zonder vaste eindwaarde.', j: 'een even machtswortelfunctie' },
        { s: 'De herstelscore van een patiënt stijgt met het aantal therapiesessies: steeds trager, maar ze blijft stijgen. Een negatieve score bestaat niet.', j: 'een even machtswortelfunctie' },
        { s: 'De conditie van een bewoner stijgt met het aantal weken training: elke week een beetje minder, maar ze blijft stijgen. Negatieve weken zijn niet zinvol.', j: 'een even machtswortelfunctie' },
        { s: 'De concentratie van een medicijn in het bloed stijgt steeds trager en nadert 8 mg/l als de tijd heel groot wordt.', j: 'een rationale functie met horizontale asymptoot' },
        { s: 'Het aantal deelnemers aan een activiteit in het dienstencentrum stijgt steeds trager en nadert 40 als het aantal weken heel groot wordt.', j: 'een rationale functie met horizontale asymptoot' }]);
      const alle = ['een even machtswortelfunctie', 'een oneven machtswortelfunctie', 'een rationale functie met horizontale asymptoot', 'een dalende functie'];
      return { soort: 'model', opdracht: 'Welk model past het best bij deze situatie?', html: opgave(sit.s), sleutel: 'mod' + sit.s.slice(0, 15), antw: zinnen(sit.j, alle),
        uitleg: sit.j.startsWith('een even') ? ['\\text{nooit negatief en steeds trager stijgend, geen vaste eindwaarde}', `\\Rightarrow \\text{even machtswortelfunctie (domein en bereik } ${POS_TEX})`]
          : ['\\text{nadert een vaste waarde als } x \\text{ heel groot wordt}', '\\Rightarrow \\text{horizontale asymptoot: een machtswortelfunctie past niet, een rationale functie wel}'] };
    } },
    waarom: { naam: 'Waarom niet oneven?', gen() {
      const g = kies(['een lichaamsgewicht', 'een leeftijd', 'een ontwikkelingsscore', 'een aantal therapiesessies', 'de lengte van een kind']);
      return { soort: 'waarom', opdracht: `Waarom is een oneven machtswortelfunctie geen goed model voor ${g}?`, html: opgave('Denk aan het domein en het bereik.'), sleutel: 'wa' + g,
        antw: zinnen('Domein en bereik zijn ℝ: het model laat ook negatieve waarden toe, en die zijn hier niet zinvol.',
          ['Een oneven machtswortelfunctie heeft een horizontale asymptoot.', 'Een oneven machtswortelfunctie is dalend.', 'Het domein van een oneven machtswortelfunctie is [0, +∞[.', 'Een oneven machtswortelfunctie heeft geen nulwaarde.']),
        uitleg: ['\\text{oneven: dom} = \\text{ber} = \\mathbb{R} \\text{ (ook negatieve waarden)}', `\\text{${g} kan niet negatief zijn} \\Rightarrow \\text{even machtswortelfunctie past beter}`] };
    } },
  },
  oefenMix: [['aflezen', 1], ['stijging', 1], ['sneller', 1], ['verdubbel', 1], ['model', 1], ['waarom', 1]],
  test: [['aflezen', 2], ['stijging', 2], ['sneller', 1], ['verdubbel', 2], ['model', 2], ['waarom', 1]], testSchudden: true,
};

// ===================================================================
//  DEEL 6 · EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D6 = {
  nr: 6, titel: 'Eindtest machtswortelfuncties', kort: 'Alle soorten vragen door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>
    ${DEF}${SAMENVATTING}${INTYPEN}`,
  voorbeelden: [],
  soorten: {
    eo: mix(D1, 'evenOneven', 'Even of oneven'), reken: mix(D1, 'reken', 'Machtswortel berekenen'), bestaat: mix(D1, 'bestaat', 'Machtswortel uit een negatief getal'),
    domein: mix(D4, 'domein', 'Domein'), bereik: mix(D4, 'bereik', 'Bereik'), limMin: mix(D4, 'limMin', 'Gedrag naar −∞'), grafiek: mix(D3, 'grafiek', 'Even of oneven (grafiek)'),
    vergelijk: mix(D4, 'vergelijk', 'Vergelijken met rationale functies'), aflezen: mix(D5, 'aflezen', 'Grafiek aflezen'), verdubbel: mix(D5, 'verdubbel', 'Evenredig met de vierkantswortel'), model: mix(D5, 'model', 'Welk model past?'),
  },
  oefenMix: [['eo', 1], ['reken', 1], ['bestaat', 1], ['domein', 1], ['bereik', 1], ['limMin', 1], ['grafiek', 1], ['vergelijk', 1], ['aflezen', 1], ['verdubbel', 1], ['model', 1]],
  test: [['reken', 1], ['bestaat', 1], ['domein', 1], ['bereik', 1], ['limMin', 1], ['grafiek', 1], ['vergelijk', 1], ['aflezen', 1], ['verdubbel', 1], ['model', 1]], testSchudden: true,
};

Leerpaden.registreer({
  code: 'machtswortelfuncties',
  titel: 'Machtswortelfuncties',
  ondertitel: 'Wiskunde · 5WW / 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert machtswortelfuncties $f(x) = ${wt('n')}$ kennen: het verschil tussen <b>even</b> en <b>oneven</b>, het <b>domein</b>, het <b>bereik</b> en het <b>gedrag op oneindig</b>,
    en wat dat betekent in een situatie uit de <b>zorg en welzijn</b>. Alles volgt de PowerPoint uit de les.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open. Je werkt <b>zonder rekenmachine</b>.</p>`,
  groepen: [
    { titel: 'A · Wat is een machtswortelfunctie?', delen: [1] },
    { titel: 'B · Even en oneven machtswortelfuncties', delen: [2, 3] },
    { titel: 'C · Vergelijken en toepassen', delen: [4, 5] },
    { titel: 'D · Eindtest', delen: [6] },
  ],
  delen: [D1, D2, D3, D4, D5, D6],
});
})();
