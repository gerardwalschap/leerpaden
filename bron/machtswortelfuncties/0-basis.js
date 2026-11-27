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
