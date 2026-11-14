// Programma 'functieleer' — automatisch samengevoegd uit bron/functieleer/ (niet rechtstreeks bewerken)
(() => {
// ===================================================================
//  FUNCTIELEER (7VJHO) — gedeelde hulpfuncties
// ===================================================================
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x, d = null) => W.texGetal(x, d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kT = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const kTex = (texen) => texen.map((t, i) => ({ k: String(i), l: t }));
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const tekst = (s) => String(s).replace('.', ',');
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;

// ---- breuken: Q = {t, n} met n > 0, vereenvoudigd
const Q = (t, n = 1) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return { t: t / g, n: n / g, v: t / n }; };
const qTex = (q) => q.n === 1 ? tg(q.t) : `${q.t < 0 ? '-' : ''}\\frac{${Math.abs(q.t)}}{${q.n}}`;
const qStr = (q) => q.n === 1 ? String(q.t) : `(${q.t}/${q.n})`;
const qGetal = (q, extra = {}) => getal(q.v, extra);
// ax + b als TeX (a en b als Q of getal)
function linTex(a, b, naam = 'f', vr = 'x') {
  a = typeof a === 'number' ? Q(a) : a; b = typeof b === 'number' ? Q(b) : b;
  let s = '';
  if (a.t !== 0) s = (a.n === 1 && Math.abs(a.t) === 1 ? (a.t < 0 ? '-' : '') : qTex(a)) + vr;
  if (b.t !== 0 || !s) s += s ? ` ${b.t < 0 ? '-' : '+'} ${qTex(Q(Math.abs(b.t), b.n))}` : qTex(b);
  return naam ? `${naam}(${vr}) = ${s}` : s;
}
const linExpr = (a, b) => { a = typeof a === 'number' ? Q(a) : a; b = typeof b === 'number' ? Q(b) : b; return `${qStr(a)}*x+${qStr(b)}`; };
const fAntw = (a, b, naam = 'f') => ({ soort: 'functie', vorm: 'vrij', expr: linExpr(a, b), tex: linTex(a, b, null), voor: `${naam}(x) =`, placeholder: 'bv. 2x + 1' });

// ---- verzamelingen (domein, bereik)
const vzAntw = (stukken, voor) => ({ soort: 'verzameling', stukken, voor });
const vzTex = (st) => VZ.texVan(st);

// ---- functiewaardentabel als TeX
function tabelTex(xs, ys, xn = 'x', yn = 'f(x)') {
  const c = (v) => v === null ? '/' : typeof v === 'string' ? v : tg(v);
  return `\\begin{array}{c|${'c'.repeat(xs.length)}} ${xn} & ${xs.map(c).join(' & ')} \\\\ \\hline ${yn} & ${ys.map(c).join(' & ')} \\end{array}`;
}

// ---- grafieken (SVG) ---------------------------------------------------------------
// opt.stukken: [{pts:[[x,y],…] (x stijgend), begin/eind: 'vol'|'hol'|'door'}]  — veelhoekslijnen
// opt.rechten: [{a, b, label?, kleur?}] · opt.krommen: [{pts, kleur?}] · opt.functies: [{f, kleur?}] · opt.punten: [{x, y, label?, hol?}]
const BLAUW = '#1c4e8a', ORANJE = '#e8772e';
function fgraf(opt = {}) {
  const [X0, X1] = opt.x || [-7, 7], [Y0, Y1] = opt.y || [-6, 6];
  const B = opt.breed || 320, sc = B / (X1 - X0), scY = opt.hoog ? opt.hoog / (Y1 - Y0) : sc, H = (Y1 - Y0) * scY, m = 20;
  const X = (x) => m + (x - X0) * sc, Y = (y) => m + (Y1 - y) * scY;
  const stap = opt.stap || 1, ys = opt.ystap || 1;
  let g = '';
  for (let k = Math.ceil(X0); k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>`;
  for (let k = Math.ceil(Y0); k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>`;
  g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1) + 8}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.3" marker-end="url(#fp)"/>`;
  g += `<line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1) - 8}" stroke="#1f2733" stroke-width="1.3" marker-end="url(#fp)"/>`;
  g += `<text x="${X(X1) + 4}" y="${Y(0) - 6}" font-size="12" text-anchor="end" font-style="italic">${opt.xn || 'x'}</text><text x="${X(0) + 6}" y="${Y(Y1) + 4}" font-size="12" font-style="italic">${opt.yn || 'y'}</text>`;
  const num = (v) => v < 0 ? '−' + (-v) : String(v);
  for (let k = Math.ceil(X0 / stap) * stap; k < X1; k += stap) if (k) g += `<text x="${X(k)}" y="${Y(0) + 12}" font-size="9" text-anchor="middle" fill="#555">${num(k)}</text>`;
  for (let k = Math.ceil(Y0 / ys) * ys; k < Y1; k += ys) if (k) g += `<text x="${X(0) - 3}" y="${Y(k) + 3}" font-size="9" text-anchor="end" fill="#555">${num(k)}</text>`;
  g += `<text x="${X(0) - 3}" y="${Y(0) + 11}" font-size="9" text-anchor="end" fill="#555">0</text>`;
  // verlengen tot de rand van de figuur
  const rand = (p, q) => { // van p in de richting p→q… verder dan q tot de rand
    const dx = q[0] - p[0], dy = q[1] - p[1]; let t = Infinity;
    if (dx > 0) t = Math.min(t, (X1 - q[0]) / dx); if (dx < 0) t = Math.min(t, (X0 - q[0]) / dx);
    if (dy > 0) t = Math.min(t, (Y1 - q[1]) / dy); if (dy < 0) t = Math.min(t, (Y0 - q[1]) / dy);
    return [q[0] + dx * t, q[1] + dy * t];
  };
  const pad = (pts, kleur, dik = 2.4) => `<path d="${pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ')}" fill="none" stroke="${kleur}" stroke-width="${dik}" stroke-linejoin="round"/>`;
  const bol = (x, y, hol, kleur = BLAUW) => `<circle cx="${X(x)}" cy="${Y(y)}" r="4.2" fill="${hol ? '#fff' : kleur}" stroke="${kleur}" stroke-width="1.8"/>`;
  for (const s of opt.stukken || []) {
    let pts = s.pts.slice();
    if (s.begin === 'door') pts.unshift(rand(pts[1], pts[0]));
    if (s.eind === 'door') pts.push(rand(pts[pts.length - 2], pts[pts.length - 1]));
    g += pad(pts, s.kleur || BLAUW);
    if (s.begin !== 'door') g += bol(...s.pts[0], s.begin === 'hol', s.kleur || BLAUW);
    if (s.eind !== 'door') g += bol(...s.pts[s.pts.length - 1], s.eind === 'hol', s.kleur || BLAUW);
  }
  for (const k of opt.krommen || []) g += pad(k.pts.filter(p => p[0] >= X0 - 1 && p[0] <= X1 + 1 && p[1] >= Y0 - 1 && p[1] <= Y1 + 1), k.kleur || BLAUW);
  for (const fu of opt.functies || []) {
    const pts = []; for (let i = 0; i <= 400; i++) { const x = (fu.van ?? X0) + ((fu.tot ?? X1) - (fu.van ?? X0)) * i / 400, y = fu.f(x); if (Number.isFinite(y) && y >= Y0 && y <= Y1) pts.push([x, y]); }
    if (pts.length > 1) g += pad(pts, fu.kleur || BLAUW);
  }
  for (const r of opt.rechten || []) {
    const kl = r.kleur || BLAUW, f = (x) => r.a * x + r.b;
    const p = [X0, f(X0)], q = [X1, f(X1)];
    const knip = (u) => { if (u[1] > Y1) return [(Y1 - r.b) / r.a, Y1]; if (u[1] < Y0) return [(Y0 - r.b) / r.a, Y0]; return u; };
    const P = r.a ? knip(p) : p, Qp = r.a ? knip(q) : q;
    g += pad([P, Qp], kl, 2.2);
    if (r.label) {
      const lx = r.lx ?? (Qp[0] - (Qp[0] - P[0]) * 0.12), ly = f(lx);
      g += `<text x="${X(lx) + 5}" y="${Y(ly) - 5}" font-size="14" font-weight="bold" fill="${kl}">${r.label}</text>`;
    }
  }
  for (const p of opt.punten || []) {
    g += bol(p.x, p.y, p.hol, p.kleur || ORANJE);
    if (p.label) g += `<text x="${X(p.x) + 7}" y="${Y(p.y) - 7}" font-size="12" font-weight="bold" fill="${p.kleur || ORANJE}">${p.label}</text>`;
  }
  const w = B + 2 * m, hh = H + 2 * m;
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif;max-width:100%;height:auto">
    <defs><marker id="fp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f2733"/></marker></defs>${g}</svg></div>`;
}
const KLEUREN = ['#1c4e8a', '#e8772e', '#2e7d4f', '#8e44ad', '#b83a2e'];

// waarde van een veelhoekslijn (met doorlopende uiteinden) in x
function lijnWaarde(st, x) {
  const p = st.pts;
  for (let i = 0; i < p.length - 1; i++) if (x >= p[i][0] && x <= p[i + 1][0]) return p[i][1] + (p[i + 1][1] - p[i][1]) * (x - p[i][0]) / (p[i + 1][0] - p[i][0]);
  if (x < p[0][0] && st.begin === 'door') return p[0][1] + (p[1][1] - p[0][1]) * (x - p[0][0]) / (p[1][0] - p[0][0]);
  const n = p.length - 1;
  if (x > p[n][0] && st.eind === 'door') return p[n][1] + (p[n][1] - p[n - 1][1]) * (x - p[n][0]) / (p[n][0] - p[n - 1][0]);
  return null;
}
// domein en bereik van een grafiek uit stukken
function domBer(stukken) {
  const dom = [], ber = [];
  for (const s of stukken) {
    const p = s.pts, n = p.length - 1;
    dom.push({ a: s.begin === 'door' ? -Infinity : p[0][0], ai: s.begin === 'vol', b: s.eind === 'door' ? Infinity : p[n][0], bi: s.eind === 'vol' });
    // kandidaten voor min en max: alle hoekpunten (binnenin: inbegrepen), uiteinden volgens bolletje
    const kand = p.map((q, i) => ({ y: q[1], in: i === 0 ? s.begin === 'vol' : i === n ? s.eind === 'vol' : true, door: (i === 0 && s.begin === 'door') || (i === n && s.eind === 'door') }));
    let lo = Infinity, hi = -Infinity;
    if (s.begin === 'door') { const sl = p[1][1] - p[0][1]; if (sl > 0) lo = -Infinity; if (sl < 0) hi = Infinity; }
    if (s.eind === 'door') { const sl = p[n][1] - p[n - 1][1]; if (sl > 0) hi = Infinity; if (sl < 0) lo = -Infinity; }
    const ys = kand.map(k => k.y);
    const mn = Math.min(...ys), mx = Math.max(...ys);
    const a = lo === -Infinity ? -Infinity : mn, b = hi === Infinity ? Infinity : mx;
    const ai = a !== -Infinity && kand.some(k => k.y === mn && (k.in || k.door));
    const bi = b !== Infinity && kand.some(k => k.y === mx && (k.in || k.door));
    ber.push({ a, ai, b, bi });
  }
  return { dom: VZ.normaliseer(dom), ber: VZ.normaliseer(ber) };
}
// ===================================================================
//  FUNCTIELEER 7VJHO — de delen
// ===================================================================
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });

// ---- 1. Wat zijn reële functies? -------------------------------------------------------
const VOORSPEL = [
  ['iemands geboortedatum', 'de leeftijd', true], ['iemands leeftijd', 'de geboortedatum', false],
  ['het aantal concerttickets (€ 25 per stuk)', 'de prijs', true], ['iemands lengte', 'de schoenmaat', false],
  ['de zijde van een vierkant', 'de omtrek', true], ['de temperatuur buiten', 'het uur', false],
  ['het aantal liter benzine (€ 1,80 per liter)', 'de prijs', true], ['iemands schoenmaat', 'de lengte', false],
  ['de zijde van een gelijkzijdige driehoek', 'de omtrek', true], ['de maand', 'de temperatuur buiten', false],
  ['het aantal uren dat je werkt (€ 12 per uur)', 'je loon', true], ['iemands leeftijd in jaren', 'de lengte', false],
];
const VERANDERLIJKE = [
  ['De omtrek van een vierkant hangt af van de lengte van de zijde.', 'de zijde', 'de omtrek'],
  ['Tijdens het gamen loopt je gsm-batterij leeg.', 'de speeltijd', 'het batterijpercentage'],
  ['Een bakker berekent de prijs van een aantal pistolets.', 'het aantal pistolets', 'de prijs'],
  ['Een taxirit kost € 4 instap en € 2 per gereden kilometer.', 'het aantal km', 'de prijs'],
  ['Een kaars van 24 cm brandt elk uur 3 cm op.', 'de tijd (uur)', 'de lengte van de kaars'],
  ['Ahmed rijdt aan 100 km/h. Hoe ver is hij na een aantal uur?', 'de tijd', 'de afgelegde afstand'],
  ['Een schilder berekent hoeveel liter verf hij nodig heeft voor een muur.', 'de oppervlakte van de muur', 'het aantal liter verf'],
  ['De kostprijs van tegels hangt af van de oppervlakte van de vloer.', 'de oppervlakte', 'de kostprijs'],
];
const EMPIRISCH = [
  ['Elke week wordt een baby gewogen op de weegschaal.', 0], ['De oppervlakte van een vierkant met zijde z: A = z².', 1],
  ['Het aantal auto’s dat elk kwartier over de Antwerpse Ring rijdt.', 0], ['De prijs van x liter benzine aan € 1,80 per liter.', 1],
  ['De waterhoogte van de Schelde, elk uur afgelezen op een meetlat.', 0], ['De omtrek van een gelijkzijdige driehoek met zijde z: O = 3z.', 1],
  ['Noah meet elke 5 minuten de temperatuur van een ijsje uit de diepvries.', 0], ['Een concertticket kost € 25: f(x) = 25x.', 1],
  ['Lotte noteert een dag lang elk uur de temperatuur in de tuin.', 0], ['Een fiets huren kost € 5 plus € 2 per uur: f(x) = 5 + 2x.', 1],
];
const MACHINES = [
  () => { const a = rnd(2, 5), b = nz(-5, 5); return { f: (x) => a * x + b, regel: `\\cdot ${a}, \\text{ dan } ${b < 0 ? '-' : '+'} ${Math.abs(b)}` }; },
  () => ({ f: (x) => x * x, regel: '\\text{kwadrateer}' }),
  () => { const a = rnd(2, 9); return { f: (x) => x + a, regel: `+ ${a}` }; },
  () => { const a = rnd(2, 6); return { f: (x) => a * x, regel: `\\cdot ${a}` }; },
  () => { const a = rnd(2, 9); return { f: (x) => x - a, regel: `- ${a}` }; },
];
// krommen voor de verticale-rechte-test
function krommeGraf() {
  const P = (f, van, tot, n = 200) => Array.from({ length: n + 1 }, (_, i) => { const t = van + (tot - van) * i / n; return f(t); });
  const types = [
    () => { const a = kies([1, 2, -1, 0.5, -2]), b = rnd(-3, 3); return { ok: true, k: P(t => [t, a * t + b], -7, 7), naam: 'een schuine rechte' }; },
    () => { const c = rnd(-3, 3), s = kies([1, -1]); return { ok: true, k: P(t => [t, s * (t * t / 2) + c], -6, 6), naam: 'een parabool' }; },
    () => { const c = rnd(-3, 3); return { ok: true, k: [[-7, 7 + c], [0, c], [7, 7 + c]], naam: 'een V-vorm' }; },
    () => { const c = rnd(-4, 4); return { ok: true, k: [[-7, c], [7, c]], naam: 'een horizontale rechte' }; },
    () => ({ ok: true, k: P(t => [t, t * t * t / 12 - t], -7, 7), naam: 'een golvende kromme' }),
    () => { const r = rnd(2, 4); return { ok: false, k: P(t => [r * Math.cos(t), r * Math.sin(t)], 0, 2 * Math.PI), naam: 'een cirkel' }; },
    () => { const c = rnd(-4, 4); return { ok: false, k: [[c, -7], [c, 7]], naam: 'een verticale rechte' }; },
    () => { const c = rnd(-3, 0); return { ok: false, k: P(t => [t * t / 2 + c, t], -4, 4), naam: 'een liggende parabool' }; },
    () => ({ ok: false, k: P(t => [5 * Math.cos(t), 3 * Math.sin(t)], 0, 2 * Math.PI), naam: 'een ellips' }),
    () => ({ ok: false, k: P(t => [t * t * t / 8 - 2 * t, t], -5, 5), naam: 'een S-vormige kromme' }),
  ];
  return kies(types)();
}
const D1 = {
  nr: 1, titel: 'Wat zijn reële functies?', kort: 'Bij elke invoer hoort hoogstens één uitvoer.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Onafhankelijk en afhankelijk veranderlijke</div>
      <p>Wat je eerst moet weten, is de <b>onafhankelijk veranderlijke</b> (de <i>x</i>-waarde of invoerwaarde, op de horizontale as). Wat daaruit volgt, is de <b>afhankelijk veranderlijke</b> (de <i>y</i>-waarde of uitvoerwaarde, op de verticale as).</p>
      <p class="klein">Concerttickets van € 25: het aantal tickets is de onafhankelijk veranderlijke, de prijs de afhankelijk veranderlijke. $f(x) = 25x$ en $f(3) = 75$: "f van 3 is 75".</p></div>
    <div class="kader def"><div class="kader-titel">Definitie</div>
      <p>Een <b>functie</b> is een verband tussen twee veranderlijken waarbij bij elke waarde van de onafhankelijk veranderlijke <b>hoogstens één</b> waarde van de afhankelijk veranderlijke hoort.</p>
      <p>Hoogstens één = ofwel precies één, ofwel géén (in een tabel noteer je dan "/"). Meer dan één = geen functie.</p>
      <p class="klein">Opgelet: twee verschillende invoerwaarden mogen wél dezelfde uitvoer hebben ($(-2)^2 = 2^2 = 4$). Dat is nog altijd een functie.</p></div>
    <div class="kader eig"><div class="kader-titel">Functie in een grafiek? De verticale-rechte-test</div>
      <p>Snijdt <b>elke verticale rechte</b> de grafiek hoogstens 1 keer? Dan is het een functie. Schuif in gedachten een verticale rechte over de grafiek.</p></div>
    <div class="kader"><div class="kader-titel">Eén functie, vier voorstellingen</div>
      <p>woorden ↔ tabel ↔ voorschrift ↔ grafiek. Fietsverhuur: € 5 vaste huur en € 2 per uur, dus $f(x) = 5 + 2x$.</p>
      <p><b>Empirische functie:</b> de uitvoer wordt <b>gemeten</b>. <b>Wiskundige functie:</b> de uitvoer wordt <b>berekend</b> met een voorschrift.</p></div>`,
  voorbeelden: [
    { tex: tabelTex([2, 4, 4, 6, 8], [1, 2, 3, 4, 5]), stappen: ['\\text{bij } x = 4 \\text{ horen twee uitvoerwaarden (2 en 3)}', '\\text{geen functie}'] },
    { tex: tabelTex([6, 4, 3, 1, 0], [2, 3, 4, 12, null]), stappen: ['\\text{bij } x = 0 \\text{ hoort geen uitvoer: dat mag (hoogstens één)}', '\\text{functie}'] },
  ],
  soorten: {
    voorspel: { naam: 'Kan je het voorspellen?', gen() {
      const [a, b, ok] = kies(VOORSPEL);
      return { soort: 'voorspel', opdracht: 'Kan je het voorspellen?', html: opgave(`Ik ken ${a}. Ken ik dan ${b}?`), sleutel: a + b, rapport: `${a} → ${b}`,
        antw: keuze(kT(['ja', 'nee']), ok ? 0 : 1), uitleg: [ok ? '\\text{JA: bij één gegeven hoort precies één antwoord.}' : '\\text{NEE: bij één gegeven horen meerdere antwoorden.}'] };
    } },
    veranderlijke: { naam: 'Onafhankelijk of afhankelijk?', gen() {
      const [s, o, a] = kies(VERANDERLIJKE), vraagO = kies([true, false]), opts = schud([o, a]);
      return { soort: 'veranderlijke', opdracht: `Wat is de ${vraagO ? 'onafhankelijk' : 'afhankelijk'} veranderlijke?`, html: opgave(s), sleutel: s + vraagO, rapport: s,
        antw: keuze(kT(opts), opts.indexOf(vraagO ? o : a)), uitleg: [`\\text{onafhankelijk: ${o}} \\quad \\text{afhankelijk: ${a}}`, '\\text{wat je eerst moet weten, is de onafhankelijk veranderlijke}'] };
    } },
    tabel: { naam: 'Functie in een tabel?', gen() {
      let xs = schud([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 5).sort((a, b) => a - b), ys = xs.map(() => rnd(-5, 9));
      const geen = kies([true, false]); let reden;
      if (geen) { const i = rnd(1, 3); xs[i + 1] = xs[i]; let y; do { y = rnd(-5, 9); } while (y === ys[i]); ys[i + 1] = y; reden = `\\text{bij } x = ${tg(xs[i])} \\text{ horen twee uitvoerwaarden}`; }
      else {
        const v = kies(['gelijk', 'streep', 'gewoon']);
        if (v === 'gelijk') { ys[3] = ys[1]; reden = '\\text{twee invoerwaarden met dezelfde uitvoer: dat mag}'; }
        else if (v === 'streep') { ys[rnd(0, 4)] = null; reden = '\\text{een invoer zonder uitvoer (/): dat mag, hoogstens één}'; }
        else reden = '\\text{elke invoer heeft precies één uitvoer}';
      }
      return { soort: 'tabel', opdracht: 'Stelt deze tabel een functie voor?', tex: tabelTex(xs, ys), antw: keuze(kT(['functie', 'geen functie']), geen ? 1 : 0), uitleg: [reden, `\\text{${geen ? 'geen functie' : 'functie'}}`] };
    } },
    grafiek: { naam: 'Functie in een grafiek?', gen() {
      const k = krommeGraf();
      return { soort: 'grafiek', opdracht: 'Is dit de grafiek van een functie? Gebruik de verticale-rechte-test.', html: fgraf({ krommen: [{ pts: k.k }] }), sleutel: k.naam + JSON.stringify(k.k.slice(0, 2)), rapport: k.naam,
        antw: keuze(kT(['functie', 'geen functie']), k.ok ? 0 : 1), uitleg: [k.ok ? '\\text{elke verticale rechte snijdt de grafiek hoogstens 1 keer}' : '\\text{er is een verticale rechte die de grafiek meer dan 1 keer snijdt}', `\\text{${k.ok ? 'functie' : 'geen functie'}}`] };
    } },
    machine: { naam: 'De functiemachine', gen() {
      const M = kies(MACHINES)(), inv = schud([-3, -2, -1, 1, 2, 3, 4, 5, 10]).slice(0, 4), q = inv.pop();
      return { soort: 'machine', opdracht: 'Raad de regel van de machine. Wat komt eruit bij de laatste invoer?', tex: tabelTex([...inv, q], [...inv.map(M.f), '?'], '\\text{invoer}', '\\text{uitvoer}'),
        antw: getal(M.f(q), { voor: '\\text{uitvoer} =' }), uitleg: [`\\text{regel: } ${M.regel}`, `${h(q)} \\rightarrow ${tg(M.f(q))}`] };
    } },
    empirisch: { naam: 'Gemeten of berekend?', gen() {
      const [s, w] = kies(EMPIRISCH);
      return { soort: 'empirisch', opdracht: 'Is de uitvoer gemeten of berekend?', html: opgave(s), sleutel: s, rapport: s,
        antw: keuze(kT(['gemeten: empirische functie', 'berekend: wiskundige functie']), w), uitleg: [w ? '\\text{de uitvoer wordt berekend met een voorschrift}' : '\\text{de uitvoer wordt gemeten (waarneming)}'] };
    } },
  },
  oefenMix: [['voorspel', 1], ['veranderlijke', 1], ['tabel', 2], ['grafiek', 2], ['machine', 1], ['empirisch', 1]],
  test: [['voorspel', 1], ['veranderlijke', 1], ['tabel', 2], ['grafiek', 3], ['machine', 2], ['empirisch', 1]], testSchudden: true,
};

// ---- 2. Functiewaarden en functiewaardentabel -----------------------------------------------
function voorschrift() {
  return kies([
    () => { const a = nz(-5, 5), b = nz(-9, 9); return { tex: linTex(a, b), f: (x) => a * x + b, s: (x) => `${a === 1 ? '' : a === -1 ? '-' : tg(a) + ' \\cdot '}${h(x)} ${b < 0 ? '-' : '+'} ${Math.abs(b)}` }; },
    () => { const c = nz(-9, 9); return { tex: `f(x) = x^2 ${c < 0 ? '-' : '+'} ${Math.abs(c)}`, f: (x) => x * x + c, s: (x) => `${h(x)}^2 ${c < 0 ? '-' : '+'} ${Math.abs(c)}` }; },
    () => { const c = rnd(1, 9); return { tex: `f(x) = -x^2 + ${c}`, f: (x) => -x * x + c, s: (x) => `-${h(x)}^2 + ${c}` }; },
    () => { const a = kies([2, 3, -2]); return { tex: `f(x) = ${tg(a)}x^2`, f: (x) => a * x * x, s: (x) => `${tg(a)} \\cdot ${h(x)}^2` }; },
  ])();
}
function grafiekLijn(vol = false) { // veelhoekslijn met gehele hoekpunten
  for (;;) {
    let x = rnd(-6, -3); const pts = [];
    while (x <= 6) { pts.push([x, rnd(-5, 5)]); x += rnd(2, 3); }
    if (pts.length < 3) continue;
    if (pts.some((p, i) => i && p[1] === pts[i - 1][1])) continue;
    return { pts, begin: vol ? 'vol' : 'door', eind: vol ? 'vol' : 'door' };
  }
}
const D2 = {
  nr: 2, titel: 'Functiewaarden en functiewaardentabel', kort: 'Vervang x door het getal en reken uit. Negatief? Tussen haakjes!', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Functiewaarden</div>
      <p>De uitvoerwaarden noemen we <b>functiewaarden</b>. $f(-3)$ is de functiewaarde voor $x = -3$ in de functie $f$. Elk koppel $(x, y)$ is een punt van de grafiek.</p></div>
    <div class="kader eig"><div class="kader-titel">Zo bereken je een functiewaarde</div>
      <p>Vervang in het voorschrift $x$ door het getal tussen de haakjes en reken alles uit. <b>Negatief getal? Zet het tussen haakjes!</b></p>
      <p class="midden">$f(x) = 2x + 3$: &nbsp; $f(-2) = 2 \\cdot (-2) + 3 = -1$</p></div>
    <div class="kader eig"><div class="kader-titel">Aflezen uit een grafiek</div>
      <p>Zoek $x$ op de $x$-as, ga verticaal naar de grafiek en dan horizontaal naar de $y$-as.</p>
      ${fgraf({ stukken: [{ pts: [[-4, 1], [-2, 2], [0, 3], [4, 5]], begin: 'door', eind: 'door' }], punten: [{ x: 4, y: 5, label: 'f(4) = 5' }], x: [-6, 6], y: [-2, 7], breed: 260 })}</div>
    <div class="kader"><div class="kader-titel">De functiewaardentabel</div>
      <p>Bovenaan de $x$-waarden (van klein naar groot: enkele negatieve, nul en enkele positieve), onderaan de functiewaarden. Geen functiewaarde? Zet een schuine streep (/).</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = -3x + 5: \\quad f(-1) = \\;?', stappen: ['= -3 \\cdot (-1) + 5', '= 3 + 5 = 8'] },
    { tex: 'g(x) = x^2 - 4: \\quad g(-2) = \\;?', stappen: ['= (-2)^2 - 4', '= 4 - 4 = 0'] },
    { tex: 'f(x) = 2x - 5: \\text{ voor welke } x \\text{ is } f(x) = 7?', stappen: ['2x - 5 = 7', '2x = 12', 'x = 6'] },
  ],
  soorten: {
    bereken: { naam: 'Functiewaarden berekenen', gen() {
      const V = voorschrift(), x = rnd(-5, 5);
      return { soort: 'bereken', opdracht: 'Bereken de functiewaarde.', tex: `${V.tex} \\qquad f(${tg(x)}) = \\;?`, antw: getal(V.f(x), { voor: `f(${tg(x)}) =` }), uitleg: [`f(${tg(x)}) = ${V.s(x)}`, `= ${tg(V.f(x))}`] };
    } },
    aflezen: { naam: 'Aflezen uit een grafiek', gen() {
      const st = grafiekLijn(), p = kies(st.pts);
      return { soort: 'aflezen', opdracht: `Lees af uit de grafiek: f(${tekst(p[0])}) = ?`, html: fgraf({ stukken: [st] }), sleutel: JSON.stringify(st.pts) + p[0], rapport: `f(${p[0]}) uit grafiek`,
        antw: getal(p[1], { voor: `f(${tg(p[0])}) =` }), uitleg: [`\\text{ga bij } x = ${tg(p[0])} \\text{ verticaal naar de grafiek, dan horizontaal naar de } y\\text{-as}`, `f(${tg(p[0])}) = ${tg(p[1])}`] };
    } },
    omgekeerd: { naam: 'Voor welke x?', gen() {
      const a = nz(-4, 5), b = nz(-9, 9), x = rnd(-6, 6), v = a * x + b;
      return { soort: 'omgekeerd', opdracht: `Voor welke x is f(x) = ${tekst(v)}?`, tex: linTex(a, b), antw: getal(x, { voor: 'x =' }),
        uitleg: [`${linTex(a, b, null)} = ${tg(v)}`, `${a === 1 ? '' : a === -1 ? '-' : tg(a)}x = ${tg(v - b)}`, `x = ${tg(x)}`] };
    } },
    tabel: { naam: 'Zoek in de tabel', gen() {
      const V = voorschrift(), xs = schud([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 6).sort((a, b) => a - b), ys = xs.map(V.f);
      const uniek = xs.filter((x, i) => ys.filter(y => y === ys[i]).length === 1);
      if (kies([true, false]) && uniek.length) {
        const x = kies(uniek), y = V.f(x);
        return { soort: 'tabel', opdracht: `Voor welke x-waarde is f(x) = ${tekst(y)}?`, tex: tabelTex(xs, ys), antw: getal(x, { voor: 'x =' }), uitleg: [`\\text{zoek } ${tg(y)} \\text{ in de onderste rij}`, `x = ${tg(x)}`] };
      }
      const x = kies(xs);
      return { soort: 'tabel', opdracht: `Lees af: f(${tekst(x)}) = ?`, tex: tabelTex(xs, ys), antw: getal(V.f(x), { voor: `f(${tg(x)}) =` }), uitleg: [`\\text{zoek } x = ${tg(x)} \\text{ in de bovenste rij}`, `f(${tg(x)}) = ${tg(V.f(x))}`] };
    } },
  },
  oefenMix: [['bereken', 2], ['aflezen', 2], ['omgekeerd', 1], ['tabel', 1]],
  test: [['bereken', 4], ['aflezen', 3], ['omgekeerd', 2], ['tabel', 1]], testSchudden: true,
};

// ---- 3. Domein en bereik ------------------------------------------------------------------
function stukGen(x0, x1, eindKeuzes) {
  for (;;) {
    let x = rnd(x0, x0 + 1); const pts = [];
    while (x <= x1) { pts.push([x, rnd(-5, 5)]); x += rnd(1, 3); }
    if (pts.length < 2) continue;
    const b = kies(eindKeuzes), e = kies(eindKeuzes);
    if (b === 'door' && pts[1][1] === pts[0][1]) continue;
    if (e === 'door' && pts[pts.length - 1][1] === pts[pts.length - 2][1]) continue;
    return { pts, begin: b, eind: e };
  }
}
function domBerGrafiek() {
  const v = kies(['een', 'een', 'een', 'twee', 'constant']);
  if (v === 'constant') { const c = nz(-4, 4); return [{ pts: [[-3, c], [3, c]], begin: 'door', eind: 'door' }]; }
  if (v === 'een') return [stukGen(-6, 6, ['vol', 'hol', 'door', 'vol'])];
  const L = stukGen(-6, -1, ['vol', 'hol', 'door']), R = stukGen(1, 6, ['vol', 'hol', 'door']);
  if (L.eind === 'door') L.eind = kies(['vol', 'hol']); if (R.begin === 'door') R.begin = kies(['vol', 'hol']);  // anders overlappen de stukken
  return [L, R].map((s, i) => i === 0 ? { ...s, pts: s.pts.filter(p => p[0] <= -1) } : s).filter(s => s.pts.length >= 2);
}
const D3 = {
  nr: 3, titel: 'Domein en bereik', kort: 'De schaduw van de grafiek op de x-as en op de y-as.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Definities</div>
      <p>Het <b>domein</b> is de verzameling van alle $x$-waarden waarvoor een $y$-waarde bestaat: de "schaduw" van de grafiek op de $x$-as. Notatie: $\\text{dom}\\, f$.</p>
      <p>Het <b>bereik</b> is de verzameling van alle $y$-waarden die bij de functie horen: de "schaduw" op de $y$-as. Notatie: $\\text{ber}\\, f$.</p></div>
    <div class="kader eig"><div class="kader-titel">Afspraken</div>
      <ul><li>Zie je geen duidelijk einde (geen bolletje)? Dan loopt de grafiek door buiten de figuur.</li>
      <li><b>Vol bolletje</b> ●: het punt hoort erbij → haak naar het getal toe: $[-3$. <b>Hol bolletje</b> ○: het punt hoort er niet bij → haak van het getal weg: $4[$.</li>
      <li>Noteer van klein naar groot; bij $-\\infty$ en $+\\infty$ staat het haakje altijd naar buiten. $\\mathbb{R}^+ = [0, +\\infty[$ en $\\mathbb{R}^- = ]-\\infty, 0]$.</li>
      <li>Meerdere stukken? Gebruik $\\cup$. Eén enkele $y$-waarde: $\\{3\\}$.</li></ul>
      ${fgraf({ stukken: [{ pts: [[-3, -2], [1, 3], [4, 0]], begin: 'vol', eind: 'hol' }], x: [-5, 6], y: [-4, 5], breed: 260 })}
      <p class="klein midden">$\\text{dom}\\, f = [-3, 4[$ &nbsp; en &nbsp; $\\text{ber}\\, f = [-2, 3]$</p></div>
    <div class="kader"><div class="kader-titel">Zo typ je</div><p><code>[-3, 4[</code> · <code>]-∞, 2] ∪ [3, +∞[</code> · <code>R</code> · <code>{3}</code> — of gebruik de knoppen.</p>
      <p class="klein">Tip: kijk eerst naar de uiteinden (vol of hol?). Het bereik vind je niet altijd aan de uiteinden: zoek ook het laagste en het hoogste punt!</p></div>`,
  voorbeelden: [
    { html: fgraf({ stukken: [{ pts: [[-5, 1], [-2, -3], [2, 4], [5, 2]], begin: 'door', eind: 'hol' }], breed: 260 }), stappen: ['\\text{links loopt de grafiek door, rechts een hol bolletje}', '\\text{dom}\\, f = {]}-\\infty, 5{[}', '\\text{links stijgt de grafiek naar boven (naar links toe): } +\\infty', '\\text{laagste punt: } -3 \\Rightarrow \\text{ber}\\, f = [-3, +\\infty['] },
  ],
  soorten: {
    lees: { naam: 'Domein en bereik aflezen', gen() {
      const st = domBerGrafiek(), { dom, ber } = domBer(st);
      return { soort: 'lees', opdracht: 'Lees het domein en het bereik af. Let op de bolletjes!', html: fgraf({ stukken: st }), sleutel: JSON.stringify(st), rapport: `dom ${vzTex(dom)} · ber ${vzTex(ber)}`,
        antw: delen(['\\text{dom}\\, f =', vzAntw(dom, '')], ['\\text{ber}\\, f =', vzAntw(ber, '')]), uitleg: [`\\text{dom}\\, f = ${vzTex(dom)}`, `\\text{ber}\\, f = ${vzTex(ber)}`] };
    } },
    domein: { naam: 'Enkel het domein', gen() {
      const st = domBerGrafiek(), { dom } = domBer(st);
      return { soort: 'domein', opdracht: 'Lees het domein af.', html: fgraf({ stukken: st }), sleutel: 'd' + JSON.stringify(st), rapport: `dom ${vzTex(dom)}`, antw: vzAntw(dom, '\\text{dom}\\, f ='), uitleg: ['\\text{schaduw op de } x\\text{-as}', `\\text{dom}\\, f = ${vzTex(dom)}`] };
    } },
    bereik: { naam: 'Enkel het bereik', gen() {
      const st = domBerGrafiek(), { ber } = domBer(st);
      return { soort: 'bereik', opdracht: 'Lees het bereik af.', html: fgraf({ stukken: st }), sleutel: 'b' + JSON.stringify(st), rapport: `ber ${vzTex(ber)}`, antw: vzAntw(ber, '\\text{ber}\\, f ='), uitleg: ['\\text{schaduw op de } y\\text{-as: zoek het laagste en het hoogste punt}', `\\text{ber}\\, f = ${vzTex(ber)}`] };
    } },
  },
  oefenMix: [['lees', 2], ['domein', 1], ['bereik', 1]],
  test: [['lees', 6], ['domein', 2], ['bereik', 2]], testSchudden: true,
};

// ---- 4. Tekentabel en verloopschema --------------------------------------------------------
function tekenGrafiek(nTop) {
  // toppen wisselen af tussen een positief maximum en een negatief minimum; de afstand tussen twee toppen = |y₁| + |y₂|,
  // zodat elke nulwaarde geheel is. De uiteinden lopen door (van de x-as weg).
  for (let poging = 0; poging < 2000; poging++) {
    const eerst = kies([1, -1]), m = nTop === 3 ? 3 : 4;
    const ys = Array.from({ length: nTop }, (_, i) => ((i % 2 === 0) === (eerst === 1) ? 1 : -1) * rnd(1, m));
    const xs = [0]; for (let i = 1; i < nTop; i++) xs.push(xs[i - 1] + Math.abs(ys[i - 1]) + Math.abs(ys[i]));
    const d = (y) => { const dl = [1, 2, 3].filter(k => Math.abs(y) % k === 0); return kies(dl); };
    const k0 = d(ys[0]), kN = d(ys[nTop - 1]);           // helling van de uiteinden (in absolute waarde)
    const z0 = -Math.abs(ys[0]) / k0, zN = xs[nTop - 1] + Math.abs(ys[nTop - 1]) / kN;
    const sh = -Math.round((z0 + zN) / 2) + rnd(-1, 1);
    if (z0 + sh < -6 || zN + sh > 6) continue;
    const pts = xs.map((x, i) => [x + sh, ys[i]]);
    const L = [pts[0][0] + z0 - 1 - 0, 0], R = [zN + sh + 1, 0];
    L[1] = ys[0] - Math.sign(ys[0]) * k0 * (pts[0][0] - L[0]); R[1] = ys[nTop - 1] - Math.sign(ys[nTop - 1]) * kN * (R[0] - pts[nTop - 1][0]);
    const st = { pts: [L, ...pts, R], begin: 'door', eind: 'door' };
    const nul = [z0 + sh]; for (let i = 0; i < nTop - 1; i++) nul.push(pts[i][0] + Math.abs(ys[i])); nul.push(zN + sh);
    if (!nul.every(Number.isInteger)) continue;
    const tops = pts.map(([x, y]) => ({ x, y, max: y > 0 }));
    const teken = [...nul.map((z, i) => lijnWaarde(st, i === 0 ? z - 0.5 : (nul[i - 1] + z) / 2)), lijnWaarde(st, nul[nul.length - 1] + 0.5)].map(v => v > 0 ? '+' : '-');
    return { st, nul, tops, teken, eerst };
  }
  return null;
}
function tekenTex(nul, teken) {
  return `\\begin{array}{c|${'c'.repeat(2 * nul.length + 1)}} x & ${nul.map(z => ` & ${tg(z)}`).join(' & ')} & \\\\ \\hline f(x) & ${teken.map((t, i) => (t === '+' ? '+' : '-') + (i < nul.length ? ' & 0' : '')).join(' & ')} \\end{array}`;
}
function verloopTex(tops, eerst) {
  const pijl = (i) => ((i % 2 === 0) === (eerst === 1)) ? '\\nearrow' : '\\searrow';
  return `\\begin{array}{c|${'c'.repeat(2 * tops.length + 1)}} x & ${tops.map(t => ` & ${tg(t.x)}`).join(' & ')} & \\\\ \\hline f(x) & ${tops.map((t, i) => `${pijl(i)} & ${tg(t.y)}`).join(' & ')} & ${pijl(tops.length)} \\\\ & ${tops.map(t => ` & \\text{${t.max ? 'max' : 'min'}}`).join(' & ')} & \\end{array}`;
}
function drieOpties(juist, fouten) {
  const uniek = [...new Set(fouten)].filter(f => f !== juist).slice(0, 2);
  const opts = schud([juist, ...uniek]);
  return keuze(kTex(opts), opts.indexOf(juist));
}
const D4 = {
  nr: 4, titel: 'Tekentabel en verloopschema', kort: 'Waar is f positief of negatief? Waar stijgt of daalt f?', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Het verloopschema</div>
      <p>In een verloopschema vat je samen waar de functie <b>stijgt</b> ($\\nearrow$) en <b>daalt</b> ($\\searrow$). Zoek de $x$-waarden waar de grafiek omkeert: daar ligt een <b>maximum</b> (het hoogst in de buurt) of een <b>minimum</b> (het laagst in de buurt).</p></div>
    <div class="kader def"><div class="kader-titel">De tekentabel</div>
      <p>In een tekentabel vat je samen waar de functie <b>positief</b> (+), <b>negatief</b> (−) of <b>nul</b> (0) is: ligt de grafiek boven of onder de $x$-as?</p>
      <p><b>Nulwaarden:</b> de $x$-waarden waarvoor de functiewaarde 0 is ($x = \\ldots$). <b>Nulpunten:</b> de snijpunten met de $x$-as, bv. $(2, 0)$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      ${fgraf({ stukken: [{ pts: [[-4, -4], [-2, 4], [2, -4], [4, 4]], begin: 'door', eind: 'door' }], breed: 260, y: [-6, 6] })}
      <p class="midden">$${verloopTex([{ x: -2, y: 4, max: true }, { x: 2, y: -4, max: false }], 1)}$</p>
      <p class="midden">$${tekenTex([-3, 0, 3], ['-', '+', '-', '+'])}$</p>
      <p class="klein midden">De grafiek loopt links en rechts door: er staat geen "/". Max in $(-2, 4)$, min in $(2, -4)$; nulwaarden $x = -3$, $x = 0$, $x = 3$.</p></div>`,
  voorbeelden: [],
  soorten: {
    nulwaarden: { naam: 'Nulwaarden aflezen', gen() {
      const g = tekenGrafiek(rnd(1, 3));
      return { soort: 'nulwaarden', opdracht: 'Geef alle nulwaarden. Typ ze met een puntkomma ertussen, bv. −3 ; 2.', html: fgraf({ stukken: [g.st] }), sleutel: 'n' + JSON.stringify(g.st.pts), rapport: `nulwaarden ${g.nul.join(', ')}`,
        antw: { soort: 'Vmeer', voor: 'x \\in', waarden: g.nul, dec: 0 }, uitleg: ['\\text{zoek de snijpunten met de } x\\text{-as}', `\\text{nulwaarden: } ${g.nul.map(z => 'x = ' + tg(z)).join(', \\; ')}`, `\\text{nulpunten: } ${g.nul.map(z => `(${tg(z)}, 0)`).join(', \\; ')}`] };
    } },
    tekentabel: { naam: 'De juiste tekentabel', gen() {
      const g = tekenGrafiek(rnd(1, 3)), j = tekenTex(g.nul, g.teken);
      const fout = [tekenTex(g.nul, g.teken.map(t => t === '+' ? '-' : '+')), tekenTex(g.nul.map((z, i) => i === 0 ? z - 1 : z), g.teken), tekenTex(g.nul.map(z => -z).sort((a, b) => a - b), g.teken), tekenTex(g.nul.map((z, i) => i === g.nul.length - 1 ? z + 1 : z), g.teken)];
      return { soort: 'tekentabel', opdracht: 'Welke tekentabel hoort bij de grafiek?', html: fgraf({ stukken: [g.st] }), sleutel: 't' + JSON.stringify(g.st.pts), rapport: 'tekentabel bij grafiek',
        antw: drieOpties(j, fout), uitleg: ['\\text{boven de } x\\text{-as: } + \\text{, onder de } x\\text{-as: } - \\text{, op de } x\\text{-as: } 0', j] };
    } },
    verloop: { naam: 'Het juiste verloopschema', gen() {
      const g = tekenGrafiek(rnd(1, 3)), j = verloopTex(g.tops, g.eerst);
      const fout = [verloopTex(g.tops.map(t => ({ ...t, max: !t.max })), -g.eerst), verloopTex(g.tops.map(t => ({ ...t, y: t.x, x: t.y })), g.eerst), verloopTex(g.tops.map(t => ({ ...t, y: -t.y })), g.eerst)];
      return { soort: 'verloop', opdracht: 'Welk verloopschema hoort bij de grafiek?', html: fgraf({ stukken: [g.st] }), sleutel: 'v' + JSON.stringify(g.st.pts), rapport: 'verloopschema bij grafiek',
        antw: drieOpties(j, fout), uitleg: ['\\text{zoek waar de grafiek omkeert: van stijgen naar dalen (max) of omgekeerd (min)}', j] };
    } },
    extremum: { naam: 'Maximum en minimum', gen() {
      const g = tekenGrafiek(2), t = kies(g.tops);
      return { soort: 'extremum', opdracht: `Geef de coördinaat van het ${t.max ? 'maximum' : 'minimum'}.`, html: fgraf({ stukken: [g.st] }), sleutel: 'e' + JSON.stringify(g.st.pts) + t.max, rapport: `${t.max ? 'max' : 'min'} (${t.x}, ${t.y})`,
        antw: delen(['x =', getal(t.x)], ['y =', getal(t.y)]), uitleg: [`\\text{de grafiek keert om in } (${tg(t.x)}, ${tg(t.y)})`, `\\text{${t.max ? 'max' : 'min'} in } (${tg(t.x)}, ${tg(t.y)})`] };
    } },
  },
  oefenMix: [['nulwaarden', 1], ['tekentabel', 1], ['verloop', 1], ['extremum', 1]],
  test: [['nulwaarden', 2], ['tekentabel', 3], ['verloop', 3], ['extremum', 2]], testSchudden: true,
};
D4.voorbeelden = [{ html: fgraf({ stukken: [{ pts: [[-1, -4], [2, 2], [4, -2]], begin: 'door', eind: 'door' }], breed: 260 }), stappen: ['\\text{de grafiek stijgt tot } x = 2 \\text{ en daalt daarna}', verloopTex([{ x: 2, y: 2, max: true }], 1), '\\text{snijpunten met de } x\\text{-as: } x = 1 \\text{ en } x = 3', tekenTex([1, 3], ['-', '+', '-'])] }];

// ---- 5. De functies f(x) = c en f(x) = ax -------------------------------------------------
const A_WAARDEN = [Q(1), Q(2), Q(3), Q(-1), Q(-2), Q(-3), Q(1, 2), Q(-1, 2), Q(4), Q(-4)];
const aTekst = (a) => a.n === 1 ? (a.t === 1 ? '' : a.t === -1 ? '-' : tg(a.t)) : tg(a.v);
function tekenAx(a, c = null) { // tekentabel en verloopschema van ax of c
  if (c !== null) return { teken: `\\begin{array}{c|c} x & \\\\ \\hline f(x) & ${c > 0 ? '+' : '-'} \\end{array}`, verloop: '\\begin{array}{c|c} x & \\\\ \\hline f(x) & \\rightarrow \\\\ & \\text{constant} \\end{array}' };
  return { teken: `\\begin{array}{c|ccc} x & & 0 & \\\\ \\hline f(x) & ${a > 0 ? '-' : '+'} & 0 & ${a > 0 ? '+' : '-'} \\end{array}`, verloop: `\\begin{array}{c|c} x & \\\\ \\hline f(x) & ${a > 0 ? '\\nearrow' : '\\searrow'} \\end{array}` };
}
function rechtenVraag(metB) {
  for (;;) {
    const lijnen = [];
    const as = schud(metB ? [1, 2, 3, -1, -2, -3, 0.5, -0.5] : [1, 2, 3, -1, -2, -3, 0.5, -0.5, 0]).slice(0, 4);
    for (const a of as) lijnen.push(a === 0 ? { a: 0, b: nz(-4, 4) } : { a, b: metB ? nz(-4, 4) : 0 });
    if (!metB && lijnen.filter(l => l.a === 0).length === 0 && kies([true, false])) lijnen[3] = { a: 0, b: nz(-4, 4) };
    const labels = ['A', 'B', 'C', 'D'];
    lijnen.forEach((l, i) => {
      l.label = labels[i]; l.kleur = KLEUREN[i];
      const uit = l.a > 0 ? Math.min(6.4, (5.4 - l.b) / l.a) : l.a < 0 ? Math.min(6.4, (-5.4 - l.b) / l.a) : 6.2;
      l.lx = uit - 0.4;
    });
    const pos = lijnen.map(l => [l.lx, l.a * l.lx + l.b]);
    if (pos.some((p, i) => pos.some((q, k) => k > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 1.6)) || pos.some(p => p[0] < -6)) continue;
    const j = rnd(0, 3), L = lijnen[j];
    return { lijnen, j, tex: L.a === 0 ? `f(x) = ${tg(L.b)}` : linTex(Q(L.a * 2, 2), L.b) };
  }
}
const D5 = {
  nr: 5, titel: 'De functies f(x) = c en f(x) = ax', kort: 'Horizontale rechte of rechte door de oorsprong.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De constante functie $f(x) = c$</div>
      <ul><li>De grafiek is een <b>horizontale rechte</b> op hoogte $c$. De functiewaarde is altijd $c$.</li>
      <li>$\\text{dom}\\, f = \\mathbb{R}$ en $\\text{ber}\\, f = \\{c\\}$. De functie stijgt niet en daalt niet: ze is <b>constant</b>.</li>
      <li>In de tekentabel staat enkel het teken van $c$.</li></ul></div>
    <div class="kader def"><div class="kader-titel">De functie $f(x) = ax$ met $a \\neq 0$</div>
      <ul><li>Een <b>eerstegraadsfunctie</b>: de grafiek is altijd een <b>rechte door de oorsprong</b> $(0, 0)$.</li>
      <li>$a > 0$: overal <b>stijgend</b>. $a < 0$: overal <b>dalend</b>. Hoe groter $|a|$, hoe <b>steiler</b>.</li>
      <li>$a$ is het <b>toenamegetal</b> of de <b>richtingscoëfficiënt</b>. Bij $a = 0$ valt de $x$ weg: dan is het geen eerstegraadsfunctie meer.</li>
      <li>$\\text{dom}\\, f = \\mathbb{R}$, $\\text{ber}\\, f = \\mathbb{R}$, nulwaarde $x = 0$, nulpunt $(0, 0)$.</li></ul>
      <p class="midden">$a > 0: \\; ${tekenAx(1).teken} \\qquad a < 0: \\; ${tekenAx(-1).teken}$</p></div>`,
  voorbeelden: [
    { tex: 'g(x) = -2x', stappen: ['\\text{eerste graad, } a = -2 < 0', '\\text{dalend}'] },
    { tex: '\\text{Een rechte door de oorsprong gaat door } (4, -2). \\; a = ?', stappen: ['a \\cdot 4 = -2', 'a = -0{,}5'] },
  ],
  soorten: {
    soort: { naam: 'Constant of eerste graad?', gen() {
      const c = kies([true, false]), a = kies(A_WAARDEN), k = nz(-6, 6), naam = kies(['f', 'g', 'h', 'k']);
      const tex = c ? `${naam}(x) = ${tg(k)}` : `${naam}(x) = ${aTekst(a)}x`;
      return { soort: 'soort', opdracht: 'Wat voor functie is dit en hoe verloopt ze?', tex, antw: delen(['\\text{soort:}', keuze(kT(['constant', 'eerste graad']), c ? 0 : 1)], ['\\text{verloop:}', keuze(kT(['stijgend', 'dalend', 'constant']), c ? 2 : a.v > 0 ? 0 : 1)]),
        uitleg: [c ? '\\text{geen } x\\text{: constante functie, horizontale rechte}' : `\\text{eerste graad met } a = ${tg(a.v)} ${a.v > 0 ? '> 0: \\text{ stijgend}' : '< 0: \\text{ dalend}'}`] };
    } },
    rechte: { naam: 'Welke rechte hoort erbij?', gen() {
      const r = rechtenVraag(false);
      return { soort: 'rechte', opdracht: 'Welke rechte hoort bij het voorschrift?', tex: r.tex, html: fgraf({ rechten: r.lijnen }), sleutel: JSON.stringify(r.lijnen.map(l => [l.a, l.b])) + r.j, rapport: r.tex,
        antw: keuze(kT(['A', 'B', 'C', 'D']), r.j), uitleg: [r.lijnen[r.j].a === 0 ? '\\text{horizontale rechte op de juiste hoogte}' : `\\text{door de oorsprong, } a = ${tg(r.lijnen[r.j].a)}: ${r.lijnen[r.j].a > 0 ? '\\text{stijgend}' : '\\text{dalend}'}`, `\\text{rechte } ${r.lijnen[r.j].label}`] };
    } },
    tabel: { naam: 'Tekentabel en verloopschema', gen() {
      const c = kies([true, false, false]), a = kies(A_WAARDEN), k = nz(-6, 6), wat = kies(['teken', 'verloop']);
      const T = c ? tekenAx(0, k) : tekenAx(a.v), tex = c ? `f(x) = ${tg(k)}` : `f(x) = ${aTekst(a)}x`;
      const alle = [tekenAx(1).teken, tekenAx(-1).teken, tekenAx(0, 3).teken, tekenAx(0, -3).teken, tekenAx(1).verloop, tekenAx(-1).verloop, tekenAx(0, 1).verloop];
      const pool = alle.filter(x => wat === 'teken' ? x.includes('+') || x.includes('-') && !x.includes('arrow') : x.includes('arrow'));
      return { soort: 'tabel', opdracht: `Welk${wat === 'teken' ? 'e tekentabel' : ' verloopschema'} hoort bij de functie?`, tex, antw: drieOpties(T[wat], pool),
        uitleg: [c ? `\\text{constante functie: altijd } ${tg(k)}` : `a = ${tg(a.v)} ${a.v > 0 ? '> 0' : '< 0'}, \\text{ nulwaarde } x = 0`, T[wat]] };
    } },
    zoeka: { naam: 'Zoek a', gen() {
      const a = kies([Q(2), Q(3), Q(-2), Q(-1, 2), Q(1, 2), Q(-3), Q(4), Q(3, 2), Q(-2, 3)]), p = a.n * nz(-3, 3), q = a.v * p;
      return { soort: 'zoeka', opdracht: `De grafiek van f(x) = ax gaat door het punt (${tekst(p)}, ${tekst(q)}). Bereken a.`, tex: `f(x) = ax \\text{ door } (${tg(p)}, ${tg(q)})`, antw: getal(a.v, { voor: 'a =' }),
        uitleg: [`a \\cdot ${h(p)} = ${tg(q)}`, `a = ${tg(q)} : ${h(p)} = ${qTex(a)}`] };
    } },
  },
  oefenMix: [['soort', 1], ['rechte', 1], ['tabel', 1], ['zoeka', 1]],
  test: [['soort', 3], ['rechte', 3], ['tabel', 2], ['zoeka', 2]], testSchudden: true,
};

// ---- 6. De functie f(x) = ax + b ----------------------------------------------------------
const D6 = {
  nr: 6, titel: 'De functie f(x) = ax + b', kort: 'a: richting en steilheid. b: snijpunt met de y-as.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De invloed van $a$ en $b$</div>
      <ul><li>$a$ is het toenamegetal of de richtingscoëfficiënt: $a > 0$ stijgend, $a < 0$ dalend, hoe groter $|a|$ hoe steiler.</li>
      <li>$b$ verschuift de rechte van $f(x) = ax$: $b > 0$: $|b|$ eenheden naar <b>boven</b>; $b < 0$: $|b|$ eenheden naar <b>beneden</b>.</li>
      <li>De rechte snijdt de $y$-as in het punt $(0, b)$.</li>
      <li><b>Dezelfde $a$, verschillende $b$ → de rechten zijn evenwijdig.</b></li></ul></div>
    <div class="kader eig"><div class="kader-titel">Nulwaarde en nulpunt</div>
      <p>In het nulpunt is de functiewaarde 0: los $ax + b = 0$ op. &nbsp; $x = -\\frac{b}{a}$ &nbsp; en het nulpunt is $\\left(-\\frac{b}{a}, 0\\right)$.</p>
      <p class="midden">$2x + 4 = 0 \\;\\Rightarrow\\; 2x = -4 \\;\\Rightarrow\\; x = -2$, nulpunt $(-2, 0)$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: $f(x) = x + 6$</div>
      <p>$\\text{dom}\\, f = \\mathbb{R}$, $\\text{ber}\\, f = \\mathbb{R}$, nulwaarde $x = -6$, snijpunt $y$-as $(0, 6)$, $a = 1 > 0$: overal stijgend.</p>
      <p class="midden">$\\begin{array}{c|ccc} x & & -6 & \\\\ \\hline f(x) & - & 0 & + \\end{array}$</p></div>
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Een voorschrift typ je zonder "f(x) =": <code>-3x + 4</code>. Een breuk mag: <code>1/2x - 3</code> of <code>x/2 - 3</code>.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Welke grafieken zijn evenwijdig met } f(x) = -3x + 8?', stappen: ['\\text{dezelfde } a = -3', 'g(x) = -3x \\text{ en } h(x) = -3x - 2 \\text{ wel; } k(x) = 3x + 8 \\text{ niet}'] },
    { tex: 'f(x) = -x + 3: \\text{ nulwaarde?}', stappen: ['-x + 3 = 0', '-x = -3', 'x = 3 \\quad \\text{nulpunt } (3, 0)'] },
  ],
  soorten: {
    aflezen: { naam: 'Lees af uit het voorschrift', gen() {
      const a = kies([...A_WAARDEN, Q(5), Q(-5)]), b = nz(-9, 9), naam = kies(['f', 'g', 'h', 'm']);
      return { soort: 'aflezen', opdracht: 'Lees af uit het voorschrift.', tex: linTex(a, b, naam), antw: delen(['a =', qGetal(a)], ['b =', getal(b)], ['\\text{verloop:}', keuze(kT(['stijgend', 'dalend']), a.v > 0 ? 0 : 1)]),
        uitleg: [`a = ${qTex(a)}, \\; b = ${tg(b)}`, `\\text{snijpunt } y\\text{-as: } (0, ${tg(b)})`, `a ${a.v > 0 ? '> 0: \\text{ stijgend}' : '< 0: \\text{ dalend}'}`] };
    } },
    nulwaarde: { naam: 'Nulwaarde berekenen', gen() {
      const a = nz(-5, 5), b = nz(-12, 12), z = Q(-b, a);
      return { soort: 'nulwaarde', opdracht: 'Bereken de nulwaarde.', tex: linTex(a, b), antw: qGetal(z, { voor: 'x =' }),
        uitleg: [`${linTex(a, b, null)} = 0`, `${a === 1 ? '' : a === -1 ? '-' : tg(a)}x = ${tg(-b)}`, `x = ${qTex(z)} \\quad \\text{nulpunt } (${qTex(z)}, 0)`] };
    } },
    evenwijdig: { naam: 'Evenwijdig?', gen() {
      const a = nz(-5, 5), b = nz(-8, 8), naam = ['g', 'h', 'k', 'm'];
      const j = { a, b: nz(-8, 8) }; while (j.b === b) j.b = nz(-8, 8);
      const fout = schud([{ a: -a, b }, { a: a + (a > 0 ? 1 : -1), b: j.b }, { a: -a, b: j.b }, { a: 1 / a === Math.round(1 / a) ? 2 * a : a * 3, b }]).slice(0, 3);
      const opts = schud([j, ...fout]);
      return { soort: 'evenwijdig', opdracht: `Welke grafiek is evenwijdig met die van f?`, tex: linTex(a, b), antw: keuze(kTex(opts.map((o, i) => linTex(o.a, o.b, naam[i]))), opts.indexOf(j)),
        uitleg: ['\\text{evenwijdig = dezelfde } a', `a = ${tg(a)}`] };
    } },
    verschuiven: { naam: 'Verschuiven', gen() {
      const a = nz(-4, 4), b = rnd(-5, 5), k = nz(-6, 6);
      return { soort: 'verschuiven', opdracht: `Verschuif de grafiek ${Math.abs(k)} ${Math.abs(k) === 1 ? 'eenheid' : 'eenheden'} naar ${k > 0 ? 'boven' : 'beneden'}. Geef het nieuwe voorschrift.`, tex: linTex(a, b), antw: fAntw(a, b + k, 'g'),
        uitleg: [`b: ${tg(b)} ${k > 0 ? '+' : '-'} ${Math.abs(k)} = ${tg(b + k)}`, linTex(a, b + k, 'g')] };
    } },
    rechte: { naam: 'Welke rechte hoort erbij?', gen() {
      const r = rechtenVraag(true), L = r.lijnen[r.j];
      return { soort: 'rechte', opdracht: 'Welke rechte hoort bij het voorschrift?', tex: r.tex, html: fgraf({ rechten: r.lijnen }), sleutel: JSON.stringify(r.lijnen.map(l => [l.a, l.b])) + r.j, rapport: r.tex,
        antw: keuze(kT(['A', 'B', 'C', 'D']), r.j), uitleg: [`\\text{snijpunt } y\\text{-as: } (0, ${tg(L.b)}), \\; a = ${tg(L.a)}`, `\\text{rechte } ${L.label}`] };
    } },
    tekentabel: { naam: 'Tekentabel', gen() {
      const z = rnd(-5, 5), a = nz(-3, 3), b = -a * z;
      const t = (s) => `\\begin{array}{c|ccc} x & & ${tg(s.z)} & \\\\ \\hline f(x) & ${s.l} & 0 & ${s.r} \\end{array}`;
      const j = t({ z, l: a > 0 ? '-' : '+', r: a > 0 ? '+' : '-' });
      const fout = [t({ z, l: a > 0 ? '+' : '-', r: a > 0 ? '-' : '+' }), t({ z: -z || 1, l: a > 0 ? '-' : '+', r: a > 0 ? '+' : '-' }), t({ z: b || 2, l: a > 0 ? '-' : '+', r: a > 0 ? '+' : '-' }), t({ z: z + 1, l: a > 0 ? '-' : '+', r: a > 0 ? '+' : '-' })];
      return { soort: 'tekentabel', opdracht: 'Welke tekentabel hoort bij de functie?', tex: linTex(a, b), antw: drieOpties(j, fout),
        uitleg: [`\\text{nulwaarde: } ${linTex(a, b, null)} = 0 \\Rightarrow x = ${tg(z)}`, `a = ${tg(a)} ${a > 0 ? '> 0: \\text{ eerst } - \\text{, dan } +' : '< 0: \\text{ eerst } + \\text{, dan } -'}`, j] };
    } },
  },
  oefenMix: [['aflezen', 1], ['nulwaarde', 1], ['evenwijdig', 1], ['verschuiven', 1], ['rechte', 1], ['tekentabel', 1]],
  test: [['aflezen', 2], ['nulwaarde', 2], ['evenwijdig', 1], ['verschuiven', 2], ['rechte', 2], ['tekentabel', 1]], testSchudden: true,
};

// ---- 7. Functievoorschrift opstellen -------------------------------------------------------
const delta = (A, B) => ({ dx: B[0] - A[0], dy: B[1] - A[1], a: Q(B[1] - A[1], B[0] - A[0]) });
const puntTex = (n, P) => `${n}(${tg(P[0])}, ${tg(P[1])})`;
function lijnDoor() { // a (Q) en b (geheel) met twee gehele punten
  const a = kies([Q(1), Q(2), Q(3), Q(-1), Q(-2), Q(-3), Q(1, 2), Q(-1, 2), Q(1, 3), Q(-1, 3), Q(2, 3), Q(-2, 3), Q(3, 2), Q(-3, 2)]);
  for (;;) {
    const b = rnd(-5, 5), x1 = a.n * rnd(-3, 0), x2 = x1 + (a.n === 1 ? rnd(2, 4) : a.n * rnd(1, 2));
    const A = [x1, a.v * x1 + b], B = [x2, a.v * x2 + b];
    if ([A, B].every(P => Math.abs(P[0]) <= 6 && Math.abs(P[1]) <= 6 && Number.isInteger(P[1]))) return { a, b, A, B };
  }
}
function methode2Uitleg(A, B) {
  const d = delta(A, B), b = Q(A[1] * d.a.n - d.a.t * A[0], d.a.n);
  return [`a = \\frac{\\Delta y}{\\Delta x} = \\frac{${tg(B[1])} - ${h(A[1])}}{${tg(B[0])} - ${h(A[0])}} = \\frac{${tg(d.dy)}}{${tg(d.dx)}} = ${qTex(d.a)}`,
    `y - ${h(A[1])} = ${qTex(d.a)}(x - ${h(A[0])})`, linTex(d.a, b), `\\text{controle: vul } B(${tg(B[0])}, ${tg(B[1])}) \\text{ in}`];
}
const D7 = {
  nr: 7, titel: 'Functievoorschrift opstellen', kort: 'a = Δy : Δx, daarna y − y_A = a(x − x_A).', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Het toenamegetal $a$</div>
      <p class="midden">$a = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{y_B - y_A}{x_B - x_A}$</p>
      <p>Kies 2 punten die je goed kan aflezen. $\\Delta x$: stappen naar rechts (naar links = negatief). $\\Delta y$: stappen naar boven (naar beneden = negatief). De volgorde van A en B mag je omwisselen, maar boven en onder in dezelfde volgorde!</p>
      <p class="klein">In een functiewaardentabel van een eerstegraadsfunctie is de toename van $x$ overal dezelfde en de toename van $y$ ook. Is dat niet zo, dan hoort de tabel <b>niet</b> bij een eerstegraadsfunctie.</p></div>
    <div class="kader eig"><div class="kader-titel">Methode 1: gegeven $a$ en één punt A</div>
      <p class="midden">$y - y_A = a(x - x_A)$</p>
      <p>Vul in, werk de haakjes uit en breng $y_A$ naar het rechterlid. &nbsp; $a = 4$, $A(3, 5)$: $y - 5 = 4(x - 3) \\Rightarrow y = 4x - 12 + 5 \\Rightarrow f(x) = 4x - 7$</p></div>
    <div class="kader eig"><div class="kader-titel">Methode 2: gegeven twee punten A en B</div>
      <p class="midden">$y - y_A = \\dfrac{y_B - y_A}{x_B - x_A}(x - x_A)$</p>
      <p>Bereken eerst $a$, gebruik dan methode 1. Controle: vul B in, je moet $y_B$ uitkomen.</p>
      <p class="klein">Uit een grafiek: $b$ = snijpunt met de $y$-as, $a$ met twee duidelijke punten.</p></div>
    <div class="kader"><div class="kader-titel">Zo typ je</div><p>Typ enkel het rechterlid: <code>2x + 1</code> of <code>7/5x + 19/5</code>.</p></div>`,
  voorbeelden: [
    { tex: 'A(-1, 3) \\text{ en } B(3, -5)', stappen: ['a = \\frac{-5 - 3}{3 - (-1)} = \\frac{-8}{4} = -2', 'y - 3 = -2(x + 1)', 'y = -2x - 2 + 3', 'f(x) = -2x + 1', '\\text{controle: } -2 \\cdot 3 + 1 = -5 \\;\\checkmark'] },
    { tex: tabelTex([-10, -6, -2, 2, 6], [9, 7, 5, 3, 1]), stappen: ['\\Delta x = +4, \\; \\Delta y = -2 \\text{ (overal)}', 'a = \\frac{-2}{4} = -0{,}5'] },
  ],
  soorten: {
    a: { naam: 'Toenamegetal uit twee punten', gen() {
      const L = lijnDoor(), d = delta(L.A, L.B);
      return { soort: 'a', opdracht: 'Bereken het toenamegetal a.', tex: `${puntTex('A', L.A)} \\text{ en } ${puntTex('B', L.B)}`, antw: qGetal(d.a, { voor: 'a =' }),
        uitleg: [`\\Delta x = ${tg(L.B[0])} - ${h(L.A[0])} = ${tg(d.dx)}`, `\\Delta y = ${tg(L.B[1])} - ${h(L.A[1])} = ${tg(d.dy)}`, `a = \\frac{${tg(d.dy)}}{${tg(d.dx)}} = ${qTex(d.a)}`] };
    } },
    methode1: { naam: 'Methode 1: a en één punt', gen() {
      const a = nz(-5, 5), A = [rnd(-9, 9), rnd(-10, 10)], b = A[1] - a * A[0];
      return { soort: 'methode1', opdracht: 'Stel het functievoorschrift op.', tex: `a = ${tg(a)} \\text{ en } ${puntTex('A', A)}`, antw: fAntw(a, b),
        uitleg: [`y - ${h(A[1])} = ${tg(a)}(x - ${h(A[0])})`, `y - ${h(A[1])} = ${tg(a)}x ${-a * A[0] < 0 ? '-' : '+'} ${Math.abs(a * A[0])}`, linTex(a, b)] };
    } },
    methode2: { naam: 'Methode 2: twee punten', gen() {
      const a = kies([Q(nz(-5, 5)), Q(nz(-5, 5)), kies([Q(1, 2), Q(-3, 2), Q(2, 3), Q(-1, 3), Q(7, 5)])]);
      for (;;) {
        const x1 = rnd(-6, 4), x2 = x1 + a.n * rnd(1, 3), b = Q(rnd(-12, 12) * 1, 1); const y1 = a.v * x1 + b.v, y2 = a.v * x2 + b.v;
        if (!Number.isInteger(y1) || !Number.isInteger(y2) || Math.abs(y1) > 15 || Math.abs(y2) > 15 || x2 > 10) continue;
        const A = [x1, y1], B = [x2, y2];
        return { soort: 'methode2', opdracht: 'Stel het functievoorschrift op.', tex: `${puntTex('A', A)} \\text{ en } ${puntTex('B', B)}`, antw: fAntw(a, b), uitleg: methode2Uitleg(A, B) };
      }
    } },
    grafiek: { naam: 'Voorschrift uit een grafiek', gen() {
      const L = lijnDoor();
      return { soort: 'grafiek', opdracht: 'Bepaal het voorschrift f(x) = ax + b met de aangeduide punten.', html: fgraf({ rechten: [{ a: L.a.v, b: L.b }], punten: [{ x: L.A[0], y: L.A[1], label: 'A' }, { x: L.B[0], y: L.B[1], label: 'B' }] }), sleutel: `${L.a.v},${L.b},${L.A}`, rapport: linTex(L.a, L.b),
        antw: fAntw(L.a, L.b), uitleg: [`b = ${tg(L.b)} \\quad (\\text{snijpunt } y\\text{-as})`, ...methode2Uitleg(L.A, L.B).slice(0, 1), linTex(L.a, L.b)] };
    } },
    tabel: { naam: 'Voorschrift uit een tabel', gen() {
      const dx = kies([1, 2, 3, 4]), dy = nz(-6, 6), x0 = rnd(-6, 0), b0 = rnd(-10, 10);
      const xs = Array.from({ length: 6 }, (_, i) => x0 + i * dx), a = Q(dy, dx);
      // y = a(x − x0) + y0, met y0 zodat alles geheel is
      const y0 = b0, ys = xs.map((x, i) => y0 + i * dy), b = Q(y0 * dx - dy * x0, dx);
      return { soort: 'tabel', opdracht: 'Deze tabel hoort bij een eerstegraadsfunctie. Geef het voorschrift.', tex: tabelTex(xs, ys), antw: fAntw(a, b),
        uitleg: [`\\Delta x = +${dx}, \\; \\Delta y = ${dy > 0 ? '+' : ''}${tg(dy)}`, `a = ${qTex(a)}`, `y - ${h(ys[0])} = ${qTex(a)}(x - ${h(xs[0])})`, linTex(a, b)] };
    } },
    herken: { naam: 'Eerstegraadsfunctie of niet?', gen() {
      const dx = kies([1, 2, 3, 5]), dy = nz(-6, 6), x0 = rnd(-6, 0), y0 = rnd(-10, 10), ok = kies([true, false]);
      let xs = Array.from({ length: 6 }, (_, i) => x0 + i * dx), ys = xs.map((_, i) => y0 + i * dy), reden;
      if (!ok) {
        if (kies([true, false])) { const i = rnd(2, 4); ys = ys.map((y, k) => k >= i ? y + kies([1, -1]) : y); reden = '\\text{de toename van } y \\text{ is niet overal dezelfde}'; }
        else { const i = rnd(2, 4); xs = xs.map((x, k) => k >= i ? x + 1 : x); reden = '\\text{de toename van } x \\text{ is niet overal dezelfde}'; }
      } else reden = `\\Delta x = +${dx} \\text{ en } \\Delta y = ${tg(dy)} \\text{ overal}`;
      return { soort: 'herken', opdracht: 'Hoort deze tabel bij een eerstegraadsfunctie?', tex: tabelTex(xs, ys), antw: keuze(kT(['ja', 'nee']), ok ? 0 : 1), uitleg: [reden, `\\text{${ok ? 'ja' : 'nee'}}`] };
    } },
  },
  oefenMix: [['a', 1], ['methode1', 1], ['methode2', 2], ['grafiek', 1], ['tabel', 1], ['herken', 1]],
  test: [['a', 1], ['methode1', 2], ['methode2', 3], ['grafiek', 2], ['tabel', 1], ['herken', 1]], testSchudden: true,
};

// ---- 8. Differentiecoëfficiënt en hellingshoek ----------------------------------------------
const graden = (r) => r * 180 / Math.PI;
const D8 = {
  nr: 8, titel: 'Differentiecoëfficiënt en hellingshoek', kort: 'dq = Δy : Δx · a = tan α en α = tan⁻¹ a.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">De differentiecoëfficiënt</div>
      <p>De differentiecoëfficiënt geeft de <b>gemiddelde verandering</b> weer in een interval $[x_A, x_B]$:</p>
      <p class="midden">$\\text{dq} = \\dfrac{y_B - y_A}{x_B - x_A}$</p>
      <p>$\\text{dq} > 0$: de functie stijgt $\\nearrow$ &nbsp; · &nbsp; $\\text{dq} < 0$: de functie daalt $\\searrow$ &nbsp; · &nbsp; $\\text{dq} = 0$: constant $\\rightarrow$</p></div>
    <div class="kader def"><div class="kader-titel">De hellingshoek van een rechte</div>
      <p>Enkel bij eerstegraadsfuncties (rechten). De hellingshoek $\\alpha$ is de hoek tussen de $x$-as en de rechte.</p>
      <p class="midden">$a = \\tan \\alpha \\qquad \\alpha = \\tan^{-1} a$</p>
      <p>$a > 0$: rechte stijgt, $\\alpha > 0$ &nbsp; · &nbsp; $a < 0$: rechte daalt, $\\alpha < 0$</p></div>
    <div class="kader eig"><div class="kader-titel">Opgelet: rekenmachine!</div>
      <ol><li>Zet je rekenmachine in graden (DEG of D op het scherm).</li><li>$\\tan^{-1}$ vind je meestal met SHIFT (of 2nd) + tan.</li>
      <li>Zet breuken en negatieve getallen tussen haakjes: $\\tan^{-1}(-8/5)$.</li><li>Rond af op 2 decimalen.</li></ol></div>`,
  voorbeelden: [
    { tex: 'B(2, 6), \\; C(3, 13): \\; \\text{dq}_{[2, 3]}', stappen: ['= \\frac{13 - 6}{3 - 2} = 7', '\\text{dq} > 0: \\text{ stijgend}'] },
    { tex: 'f(x) = -6{,}5x - 7: \\; \\alpha = ?', stappen: ['\\alpha = \\tan^{-1}(-6{,}5)', '\\approx -81{,}25^\\circ'] },
    { tex: '\\alpha = 33^\\circ: \\; a = ?', stappen: ['a = \\tan(33^\\circ)', '\\approx 0{,}65'] },
  ],
  soorten: {
    dq: { naam: 'Differentiecoëfficiënt uit een tabel', gen() {
      const xs = schud([-5, -4, -3, -1, 0, 1, 2, 4, 5, 7, 8]).slice(0, 6).sort((a, b) => a - b), ys = xs.map(() => rnd(-10, 25));
      let i = rnd(0, 4), j = rnd(i + 1, 5);
      if (kies([true, false, false, false])) ys[j] = ys[i];
      const dqv = (ys[j] - ys[i]) / (xs[j] - xs[i]), exact = Number.isInteger(dqv * 100);
      return { soort: 'dq', opdracht: `Bereken de differentiecoëfficiënt over [${tekst(xs[i])}, ${tekst(xs[j])}]${exact ? '' : ' (rond af op 2 decimalen)'} en zeg hoe de functie verandert.`, tex: tabelTex(xs, ys),
        antw: delen([`\\text{dq} =`, getal(dqv, exact ? {} : { dec: 2 })], ['\\text{de functie is}', keuze(kT(['stijgend', 'dalend', 'constant']), dqv > 0 ? 0 : dqv < 0 ? 1 : 2)]),
        uitleg: [`\\text{dq} = \\frac{${tg(ys[j])} - ${h(ys[i])}}{${tg(xs[j])} - ${h(xs[i])}} = \\frac{${tg(ys[j] - ys[i])}}{${tg(xs[j] - xs[i])}} ${exact ? '=' : '\\approx'} ${tg(exact ? dqv : W.rond(dqv, 2))}`, `\\text{dq} ${dqv > 0 ? '> 0: \\text{ stijgend}' : dqv < 0 ? '< 0: \\text{ dalend}' : '= 0: \\text{ constant}'}`] };
    } },
    hoek: { naam: 'Hellingshoek berekenen', gen() {
      const a = kies([Q(nz(-7, 7)), Q(nz(-7, 7)), Q(1, 3), Q(-8, 5), Q(3, 4), Q(-2, 3), Q(5, 2), Q(nz(-13, 13), 2)]), b = rnd(-9, 9), al = graden(Math.atan(a.v));
      if (W.grensgeval(al, 2)) return this.gen();
      return { soort: 'hoek', opdracht: 'Bereken de hellingshoek α (rond af op 2 decimalen).', tex: linTex(a, b), antw: { soort: 'hoek', waarde: al, dec: 2, voor: '\\alpha \\approx' },
        uitleg: [`a = ${qTex(a)}`, `\\alpha = \\tan^{-1}\\left(${qTex(a)}\\right) ${Number.isInteger(al) ? '=' : '\\approx'} ${tg(W.rond(al, 2))}^\\circ`] };
    } },
    rico: { naam: 'Richtingscoëfficiënt berekenen', gen() {
      const al = kies([rnd(-85, 85), rnd(-8500, 8500) / 100]); if (!al) return this.gen();
      const a = Math.tan(al * Math.PI / 180); if (W.grensgeval(a, 2)) return this.gen();
      return { soort: 'rico', opdracht: 'Bereken de richtingscoëfficiënt a (rond af op 2 decimalen).', tex: `\\alpha = ${tg(al)}^\\circ`, antw: getal(a, { dec: 2, voor: 'a \\approx' }),
        uitleg: [`a = \\tan(${tg(al)}^\\circ)`, `\\approx ${tg(W.rond(a, 2))}`, `\\alpha ${al > 0 ? '> 0 \\Rightarrow a > 0' : '< 0 \\Rightarrow a < 0'}`] };
    } },
  },
  oefenMix: [['dq', 2], ['hoek', 1], ['rico', 1]],
  test: [['dq', 4], ['hoek', 3], ['rico', 3]], testSchudden: true,
};

// ---- 9. Exponentiële functies ----------------------------------------------------------
const pTekst = (p) => `${p > 0 ? '+' : '−'} ${tekst(Math.abs(p))} %`;
const CONTEXT = [
  () => { const b = kies([500, 200, 1000, 300]); return { tekst: `Een kolonie telt ${b} bacteriën. Het aantal verdubbelt elk uur. Hoeveel bacteriën zijn er na {t} uur?`, b, g: 2, dec: 0, t: rnd(3, 8), eenh: 'bacteriën' }; },
  () => { const b = kies([1000, 2000, 2500, 5000]), p = kies([2, 3, 1.5, 4]); return { tekst: `Je zet € ${b} op een spaarrekening met ${tekst(p)} % intrest per jaar. Hoeveel staat er na {t} jaar op? Rond af op de cent.`, b, g: 1 + p / 100, dec: 2, t: rnd(3, 12), eenh: 'euro' }; },
  () => { const b = kies([80, 120, 60]), p = kies([20, 25, 10, 30]); return { tekst: `Er zit ${b} mg van een medicijn in het bloed. Elk uur verdwijnt ${p} %. Hoeveel mg is er na {t} uur nog? Rond af op 2 decimalen.`, b, g: 1 - p / 100, dec: 2, t: rnd(2, 8), eenh: 'mg' }; },
  () => { const b = kies([900, 1200, 800]), p = kies([25, 20, 15]); return { tekst: `Een smartphone kost € ${b} en verliest elk jaar ${p} % van zijn waarde. Wat is hij na {t} jaar nog waard? Rond af op de cent.`, b, g: 1 - p / 100, dec: 2, t: rnd(2, 5), eenh: 'euro' }; },
  () => { const b = kies([20000, 15000, 30000]), p = kies([3, 2, 4]); return { tekst: `Een stad telt ${b} inwoners. Het aantal inwoners groeit met ${p} % per jaar. Hoeveel inwoners na {t} jaar? Rond af op een geheel getal.`, b, g: 1 + p / 100, dec: 0, t: rnd(5, 15), eenh: 'inwoners' }; },
  () => { const b = kies([30000, 25000, 20000]), p = kies([15, 10, 20]); return { tekst: `Een nieuwe auto kost € ${b}. Hij verliest elk jaar ${p} % van zijn waarde. Wat is hij na {t} jaar nog waard? Rond af op de cent.`, b, g: 1 - p / 100, dec: 2, t: rnd(2, 8), eenh: 'euro' }; },
];
function groeiTabel(soort) {
  const ts = [0, 1, 2, 3, 4];
  if (soort === 'lin') { const b = rnd(2, 20) * 5, k = nz(-4, 6) * 5; return { ts, ns: ts.map(t => b + k * t), b, k }; }
  if (soort === 'exp') { const [b, g] = kies([[100, 1.2], [50, 2], [80, 0.5], [1000, 1.1], [64, 1.5], [200, 0.5], [3, 3], [625, 0.8]]); return { ts, ns: ts.map(t => W.rond(b * g ** t, 4)), b, g }; }
  const b = rnd(1, 9), p = rnd(1, 3); return { ts, ns: ts.map(t => b + p * t * (t + 1) / 2 * 1), b };
}
const D9 = {
  nr: 9, titel: 'Exponentiële functies', kort: 'Lineair: telkens + hetzelfde. Exponentieel: telkens × hetzelfde.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Lineaire of exponentiële groei?</div>
      <p><b>Lineaire groei:</b> bij een gelijke toename van $t$ hoort telkens een gelijke toename of afname van $N(t)$: we tellen telkens hetzelfde getal op. De grafiek is een rechte.</p>
      <p><b>Exponentiële groei:</b> bij een gelijke toename van $t$ wordt $N(t)$ telkens met eenzelfde factor vermenigvuldigd. De grafiek is een kromme die steeds sneller stijgt.</p>
      <p class="midden">$${tabelTex([0, 1, 2, 3], [100, 120, 144, '172{,}8'], 't', 'N(t)')} \\qquad \\frac{120}{100} = \\frac{144}{120} = 1{,}2$</p></div>
    <div class="kader def"><div class="kader-titel">Het exponentiële model</div>
      <p class="midden">$N(t) = b \\cdot g^t$</p>
      <p>$b$ = <b>beginwaarde</b> (de waarde bij $t = 0$) · $g$ = <b>groeifactor</b> (waarmee je elke tijdseenheid vermenigvuldigt) · $t$ = aantal tijdseenheden.</p>
      <p>$g > 1$: groei &nbsp; · &nbsp; $0 < g < 1$: daling (afname)</p></div>
    <div class="kader eig"><div class="kader-titel">Van procent naar groeifactor en terug</div>
      <p>Vertrek altijd van 100 % en tel erbij of trek af: $+15\\,\\% \\to 115\\,\\% \\to g = 1{,}15$ &nbsp; · &nbsp; $-20\\,\\% \\to 80\\,\\% \\to g = 0{,}8$ &nbsp; · &nbsp; $+100\\,\\%$: $g = 2$ (verdubbelen)</p>
      <p>Omgekeerd: $g = 0{,}75 \\to 75\\,\\% \\to -25\\,\\%$ per tijdseenheid.</p></div>
    <div class="kader werk"><div class="kader-titel">Rekenen met het model</div>
      <p>Een stad telt 20 000 inwoners en groeit met 3 % per jaar: $N(t) = 20\\,000 \\cdot 1{,}03^t$ en $N(10) = 20\\,000 \\cdot 1{,}03^{10} \\approx 26\\,878$ inwoners. Rekenmachine: de macht met ^ (of $x^y$).</p></div>`,
  voorbeelden: [
    { tex: 'W(t) = 30\\,000 \\cdot 0{,}85^t', stappen: ['b = 30\\,000, \\; g = 0{,}85', '\\text{daling, want } g < 1 \\; (-15\\,\\%)', 'W(5) = 30\\,000 \\cdot 0{,}85^5 \\approx 13\\,311{,}16'] },
  ],
  soorten: {
    herken: { naam: 'Lineair, exponentieel of geen van beide?', gen() {
      const s = kies(['lin', 'exp', 'geen']), T = groeiTabel(s);
      return { soort: 'herken', opdracht: 'Is de groei lineair, exponentieel of geen van beide?', tex: tabelTex(T.ts, T.ns, 't', 'N(t)'), antw: keuze(kT(['lineair', 'exponentieel', 'geen van beide']), ['lin', 'exp', 'geen'].indexOf(s)),
        uitleg: [s === 'lin' ? `\\text{telkens } ${T.k > 0 ? '+' : '-'} ${Math.abs(T.k)}` : s === 'exp' ? `\\text{telkens } \\times ${tg(T.g)}` : '\\text{geen vaste toename en geen vaste factor}', `\\text{${s === 'lin' ? 'lineair' : s === 'exp' ? 'exponentieel' : 'geen van beide'}}`] };
    } },
    procent: { naam: 'Procent en groeifactor', gen() {
      const p = kies([7, 15, 3, 150, 100, 2.5, 12, -30, -20, -15, -8, -50, -25, -2]), g = W.rond(1 + p / 100, 4);
      if (kies([true, false])) return { soort: 'procent', opdracht: `Geef de groeifactor bij ${pTekst(p)} per tijdseenheid.`, tex: `${p > 0 ? '+' : '-'}${tg(Math.abs(p))}\\,\\%`, antw: getal(g, { voor: 'g =' }),
        uitleg: [`100\\,\\% ${p > 0 ? '+' : '-'} ${tg(Math.abs(p))}\\,\\% = ${tg(100 + p)}\\,\\%`, `g = ${tg(g)}`] };
      return { soort: 'procent', opdracht: 'Met hoeveel procent per tijdseenheid stijgt of daalt de waarde? Gebruik een minteken bij een daling.', tex: `g = ${tg(g)}`, antw: getal(p, { voor: '', na: '\\%' }),
        uitleg: [`g = ${tg(g)} \\to ${tg(100 + p)}\\,\\%`, `${tg(100 + p)}\\,\\% - 100\\,\\% = ${p > 0 ? '+' : ''}${tg(p)}\\,\\%`] };
    } },
    model: { naam: 'Lees het model af', gen() {
      const b = kies([250, 100, 50, 2000, 80, 1500, 12]), g = kies([1.15, 0.8, 1.03, 0.9, 2, 0.5, 1.25, 0.95]);
      return { soort: 'model', opdracht: 'Lees af uit het model.', tex: `N(t) = ${tg(b)} \\cdot ${tg(g)}^t`, antw: delen(['b =', getal(b)], ['g =', getal(g)], ['\\text{dit is}', keuze(kT(['groei', 'daling']), g > 1 ? 0 : 1)]),
        uitleg: [`b = ${tg(b)} \\text{ (beginwaarde)}, \\; g = ${tg(g)}`, `\\text{${g > 1 ? 'groei, want g > 1' : 'daling, want g < 1'}} \\; (${g > 1 ? '+' : '-'}${tg(W.rond(Math.abs(g - 1) * 100, 2))}\\,\\%)`] };
    } },
    bereken: { naam: 'Modellen gebruiken', gen() {
      const C = kies(CONTEXT)(), w = C.b * C.g ** C.t; if (W.grensgeval(w, C.dec)) return this.gen();
      const t = C.tekst.replace('{t}', C.t);
      return { soort: 'bereken', opdracht: 'Stel het model op en bereken.', html: opgave(t), sleutel: t, rapport: t, antw: getal(w, { dec: C.dec, na: `\\text{ ${C.eenh}}` }),
        uitleg: [`b = ${tg(C.b)}, \\; g = ${tg(C.g)}`, `N(t) = ${tg(C.b)} \\cdot ${tg(C.g)}^t`, `N(${C.t}) = ${tg(C.b)} \\cdot ${tg(C.g)}^{${C.t}} \\approx ${tg(W.rond(w, C.dec), C.dec)}`] };
    } },
    tabelmodel: { naam: 'Model uit een tabel', gen() {
      const T = groeiTabel('exp');
      return { soort: 'tabelmodel', opdracht: 'Deze tabel toont exponentiële groei of daling. Bepaal b en g van het model N(t) = b · gᵗ.', tex: tabelTex(T.ts, T.ns, 't', 'N(t)'), antw: delen(['b =', getal(T.b)], ['g =', getal(T.g)]),
        uitleg: [`b = N(0) = ${tg(T.b)}`, `g = \\frac{${tg(T.ns[1])}}{${tg(T.ns[0])}} = ${tg(T.g)}`, `N(t) = ${tg(T.b)} \\cdot ${tg(T.g)}^t`] };
    } },
    grafiek: { naam: 'Model uit een grafiek', gen() {
      const [b, g] = kies([[5, 2], [2, 2], [8, 0.5], [16, 0.5], [3, 2], [4, 1.5]]), ys = [0, 1, 2].map(t => b * g ** t), ymax = Math.max(...ys) + 2;
      return { soort: 'grafiek', opdracht: 'Stel het model N(t) = b · gᵗ op. Gebruik de aangeduide punten.', html: fgraf({ functies: [{ f: (t) => b * g ** t, van: -0.5, tot: 4.5 }], punten: [0, 1, 2].map(t => ({ x: t, y: b * g ** t })), x: [-1, 5], y: [-1, ymax], xn: 't', yn: 'N', breed: 300, hoog: 300, ystap: ymax > 14 ? 2 : 1 }),
        sleutel: `${b},${g}`, rapport: `N(t) = ${b}·${g}^t`, antw: delen(['b =', getal(b)], ['g =', getal(g)]),
        uitleg: [`b = N(0) = ${tg(b)}`, `g = \\frac{${tg(ys[1])}}{${tg(ys[0])}} = ${tg(g)}`, `N(t) = ${tg(b)} \\cdot ${tg(g)}^t`] };
    } },
  },
  oefenMix: [['herken', 1], ['procent', 1], ['model', 1], ['bereken', 1], ['tabelmodel', 1], ['grafiek', 1]],
  test: [['herken', 2], ['procent', 2], ['model', 1], ['bereken', 3], ['tabelmodel', 1], ['grafiek', 1]], testSchudden: true,
};

const D10 = {
  nr: 10, titel: 'Eindtest functieleer', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van functieleer door elkaar. Herhaal gerust de theorie van een vorig deel. Je mag je rekenmachine gebruiken.</p></div>`,
  voorbeelden: [],
  soorten: { gr: mix(D1, 'grafiek'), fw: mix(D2, 'bereken'), db: mix(D3, 'lees'), tk: mix(D4, 'tekentabel'), vl: mix(D4, 'verloop'), so: mix(D5, 'soort'), nw: mix(D6, 'nulwaarde'), m2: mix(D7, 'methode2'), gf: mix(D7, 'grafiek'), dq: mix(D8, 'dq'), hk: mix(D8, 'hoek'), ex: mix(D9, 'bereken'), pr: mix(D9, 'procent') },
  oefenMix: [['gr', 1], ['fw', 1], ['db', 1], ['tk', 1], ['vl', 1], ['so', 1], ['nw', 1], ['m2', 1], ['gf', 1], ['dq', 1], ['hk', 1], ['ex', 1], ['pr', 1]],
  test: [['gr', 1], ['fw', 1], ['db', 1], ['vl', 1], ['nw', 1], ['m2', 1], ['gf', 1], ['dq', 1], ['hk', 1], ['ex', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'functieleer', titel: 'Functieleer', ondertitel: 'Functieleer · 7VJHO', klas: '7VJHO', drempel: 70,
  intro: `<p>Je leert wat een functie is, hoe je functiewaarden berekent en afleest, domein en bereik bepaalt, en een grafiek samenvat in een tekentabel en een verloopschema.
    Daarna werk je met eerstegraadsfuncties $f(x) = ax + b$: voorschriften opstellen, differentiecoëfficiënt en hellingshoek. Tot slot vergelijk je lineaire en exponentiële groei.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Wat is een functie?', delen: [1, 2, 3, 4] }, { titel: 'B · Eerstegraadsfuncties', delen: [5, 6, 7, 8] }, { titel: 'C · Exponentiële functies', delen: [9] }, { titel: 'D · Eindtest', delen: [10] }],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10],
});
})();
