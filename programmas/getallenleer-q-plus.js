// Programma 'getallenleer-q-plus' — automatisch samengevoegd uit bron/getallenleer-q-plus/ (niet rechtstreeks bewerken)
(() => {
// ===================================================================
//  REKENEN IN ℚ +  (7VJHO, gevorderden: ≥ 70/100 op de instaptoets) — slaagdrempel 70%
//  Zelfde dertien delen als "Rekenen in ℚ", maar met moeilijkere oefeningen en tests.
//  Leidraad (niets nieuws: alles volgt uit de theorie van Rekenen in ℚ, ℤ + en ℕ +):
//    OneDrive › Vakken › WISKUNDE 7VJHO › 1. GETALLENLEER › Rekenen in Q (werkbundel "Rationale getallen")
//    - decimale vormen, afronden, vereenvoudigen en ordenen, percentages, breuken op de getallenas,
//      de vier bewerkingen, machten en wortels (ook negatieve exponenten), volgorde van de bewerkingen,
//      decimaal getal naar breuk, vraagstukken met procenten en evenredigheden (met rekentoestel).
//  Procenten en evenredigheden: altijd met een verhoudingstabel (wat je boven doet, doe je ook onder).
// ===================================================================
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x, d = null) => W.texGetal(x, d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const kgv = (a, b) => a / ggd(a, b) * b;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kTekst = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const br = (t, n, extra = {}) => { const g = ggd(t, n); return { soort: 'breuk', t: t / g * Math.sign(n), n: Math.abs(n / g), ...extra }; };
const fr = (t, n) => { const g = ggd(t, n); t = t / g * Math.sign(n); n = Math.abs(n / g); return n === 1 ? tg(t) : `${t < 0 ? '-' : ''}\\dfrac{${Math.abs(t)}}{${n}}`; };
const frRaw = (t, n) => `${t < 0 ? '-' : ''}\\dfrac{${Math.abs(t)}}{${n}}`;
const VERGELIJK = [{ k: '<', l: '<' }, { k: '>', l: '>' }, { k: '=', l: '=' }];
const naarTekst = (x) => String(x).replace('.', ',');
const vul = (t, o) => t.replace(/\{(\w)\}/g, (_, k) => o[k]);
const tot = (f) => { for (let i = 0; i < 4000; i++) { const r = f(); if (r) return r; } throw new Error('geen geldige vraag gevonden'); };
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });

// ---- kleine breukenrekenkern: [t, n] met n > 0, vereenvoudigd
const R = (t, n = 1) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return [t / g, n / g]; };
const Rplus = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const Rmin = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const Rmaal = (a, b) => R(a[0] * b[0], a[1] * b[1]);
const Rdeel = (a, b) => R(a[0] * b[1], a[1] * b[0]);
const Rmacht = (a, e) => e >= 0 ? R(a[0] ** e, a[1] ** e) : R(a[1] ** -e, a[0] ** -e);
const Rtex = (a) => fr(a[0], a[1]);
const Rh = (a) => a[0] < 0 ? `\\left(${Rtex(a)}\\right)` : Rtex(a);
const Rhm = (a) => a[1] === 1 ? Rh(a) : `\\left(${Rtex(a)}\\right)`; // altijd haakjes rond een breuk (voor machten)
const Rbr = (a, extra) => br(a[0], a[1], extra);
const Rw = (a) => a[0] / a[1];
const Rteller = (n) => { let t; do { t = rnd(1, n - 1); } while (ggd(t, n) !== 1); return t; };
const Rwil = (nmax = 9, neg = true) => { const n = rnd(2, nmax), t = Rteller(n); return R(neg && kies([true, false]) ? -t : t, n); };
const Rnoemer = (lijst, neg = true) => { const n = kies(lijst), t = Rteller(n) * (Math.random() < 0.3 ? rnd(1, 2) : 1); const a = R(t, n); return neg && Math.random() < 0.5 ? R(-a[0], a[1]) : a; };
const klein = (a, m = 200) => Math.abs(a[0]) <= m && a[1] <= m;
const BREUK_TYPEN = `<div class="kader"><div class="kader-titel">Zo typ je</div><p>Een breuk typ je met <code>/</code>: <code>-7/12</code> geeft $-\\frac{7}{12}$. Geef het antwoord altijd <b>onvereenvoudigbaar</b>; is het een geheel getal, typ dan gewoon dat getal.</p></div>`;
const PLUS_KADER = (tekst) => `<div class="kader werk"><div class="kader-titel">ℚ + · Extra uitdaging</div>${tekst}</div>`;
const VOLGORDE = `<div class="kader def"><div class="kader-titel">Volgorde van de bewerkingen</div>
  <ol><li><b>Haakjes</b>, van binnen naar buiten: eerst $( \\; )$, dan $[ \\; ]$.</li><li><b>Machten en wortels.</b></li><li><b>Vermenigvuldigen en delen</b>, van links naar rechts.</li><li><b>Optellen en aftrekken</b>, van links naar rechts.</li></ol></div>`;

// ---- decimale vorm van t/n
function decimaleVorm(t, n) {
  const neg = t < 0; t = Math.abs(t);
  const geheel = Math.floor(t / n); let rest = t % n; const cijfers = [], gezien = new Map(); let start = -1;
  while (rest !== 0 && cijfers.length < 40) {
    if (gezien.has(rest)) { start = gezien.get(rest); break; }
    gezien.set(rest, cijfers.length); rest *= 10; cijfers.push(Math.floor(rest / n)); rest %= n;
  }
  const voor = start < 0 ? cijfers.join('') : cijfers.slice(0, start).join(''), per = start < 0 ? '' : cijfers.slice(start).join('');
  const tex = `${neg ? '-' : ''}${geheel}${cijfers.length ? '{,}' + voor + (per ? `\\overline{${per}}` : '') : ''}`;
  const soort = start < 0 ? 'B' : voor === '' ? 'ZR' : 'GR';
  return { tex, soort, voor, per };
}
const VORMEN = [{ k: 'B', l: '\\text{begrensd}' }, { k: 'ZR', l: '\\text{zuiver repeterend}' }, { k: 'GR', l: '\\text{gemengd repeterend}' }];
const VORM_NAAM = { B: 'begrensd', ZR: 'zuiver repeterend', GR: 'gemengd repeterend' };
const factorTex = (n) => { const f = []; let m = n; for (let p = 2; m > 1; p++) while (m % p === 0) { f.push(p); m /= p; } return f.join(' \\cdot '); };

// ---- verhoudingstabel (HTML) en als TeX
function verhoudingstabel(namen, kolommen, bewerking) {
  return `<table class="tabel verhouding"><tr><th>${namen[0]}</th>${kolommen.map(c => `<td>${c[0]}</td>`).join('')}</tr>
    <tr><th>${namen[1]}</th>${kolommen.map(c => `<td>${c[1]}</td>`).join('')}</tr></table>${bewerking ? `<p class="klein midden">${bewerking}</p>` : ''}`;
}
const vtNaam = (x) => x.includes('^') ? `\\text{${x.split('^')[0]}}^{${x.split('^')[1]}}` : `\\text{${x.replace(/%/g, '\\%')}}`;
const vtTex = (namen, kolommen) => `\\begin{array}{l|${'c'.repeat(kolommen.length)}} ${vtNaam(namen[0])} & ${kolommen.map(c => c[0]).join(' & ')} \\\\ \\hline ${vtNaam(namen[1])} & ${kolommen.map(c => c[1]).join(' & ')} \\end{array}`;

// ---- getallenas met punten (SVG), elke eenheid in 'deel' stukjes
function getallenas(punten, min, max, opt = {}) {
  const deel = opt.deel || 1, u = opt.u || (deel > 1 ? Math.max(14, Math.round(300 / ((max - min) * deel))) * deel : 40), x0 = 24;
  const w = x0 * 2 + (max - min) * u, hh = 64, y = 34;
  const X = (v) => x0 + (v - min) * u;
  let s = `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas" style="font-family:Verdana,sans-serif;max-width:100%">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let v = min; v <= max; v++) {
    s += `<line x1="${X(v)}" y1="${y - 7}" x2="${X(v)}" y2="${y + 7}" stroke="#555" stroke-width="1.4"/>`;
    s += `<text x="${X(v)}" y="${y + 24}" font-size="13" text-anchor="middle" fill="#333">${v < 0 ? '−' + (-v) : v}</text>`;
    if (deel > 1 && v < max) for (let k = 1; k < deel; k++) s += `<line x1="${X(v + k / deel)}" y1="${y - 4}" x2="${X(v + k / deel)}" y2="${y + 4}" stroke="#888"/>`;
  }
  for (const p of punten) s += `<circle cx="${X(p.x)}" cy="${y}" r="5" fill="#e8772e"/><text x="${X(p.x)}" y="${y - 12}" font-size="14" font-weight="bold" text-anchor="middle" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}
// ===================================================================
//  REKENEN IN ℚ + — de dertien delen
// ===================================================================

// ---------------------------------------------------------------
// 1. Decimale vormen +
// ---------------------------------------------------------------
const VORM_N = [4, 5, 8, 16, 20, 25, 40, 3, 7, 9, 11, 27, 33, 6, 12, 15, 18, 22, 30, 35, 45];
// een factor die het type "verbergt": na vereenvoudigen verdwijnt hij
function verstopt() {
  return tot(() => {
    const n = kies(VORM_N), t = Rteller(n), soort = decimaleVorm(t, n).soort;
    const k = soort === 'B' ? kies([3, 7, 9, 11]) : kies([2, 4, 5, 10, 3, 7]);
    const N = n * k; if (N > 250) return null;
    const schijn = decimaleVorm(1, N).soort; if (schijn === soort) return null; // anders geen valstrik
    return { t, n, k, soort };
  });
}
const Q1 = {
  nr: 1, titel: 'Decimale vormen van breuken +', kort: 'Valstrikken: eerst vereenvoudigen! Welke breuk heeft de gevraagde vorm?', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Drie decimale vormen</div>
      <table class="tabel"><tr><th>vorm</th><th>voorbeeld</th><th>noemer (onvereenvoudigbaar) bevat</th></tr>
      <tr><td><b>begrensd</b></td><td>$\\frac{3}{8} = 0{,}375$</td><td>enkel factoren $2$ en/of $5$</td></tr>
      <tr><td><b>zuiver repeterend</b></td><td>$\\frac{5}{11} = 0{,}\\overline{45}$</td><td>geen factor $2$ of $5$</td></tr>
      <tr><td><b>gemengd repeterend</b></td><td>$\\frac{1}{6} = 0{,}1\\overline{6}$</td><td>een factor $2$ of $5$ én een andere factor</td></tr></table></div>
    ${PLUS_KADER(`<p><b>Eerst vereenvoudigen!</b> De noemer van $\\frac{21}{35}$ bevat een $7$, maar $\\frac{21}{35} = \\frac{3}{5}$: <b>begrensd</b> ($0{,}6$).
      En $\\frac{9}{12} = \\frac{3}{4}$ is begrensd, hoewel $12$ een factor $3$ heeft.</p>
      <p>Omgekeerd: $\\frac{10}{66} = \\frac{5}{33}$ en $33 = 3 \\cdot 11$: <b>zuiver repeterend</b>, hoewel $66$ een factor $2$ heeft.</p>`)}`,
  voorbeelden: [
    { tex: '\\frac{14}{42}', stappen: ['= \\frac{1}{3}', '3: \\text{ geen 2 of 5: zuiver repeterend}', '= 0{,}\\overline{3}'] },
    { tex: '\\frac{33}{60}', stappen: ['= \\frac{11}{20}', '20 = 2 \\cdot 2 \\cdot 5: \\text{ begrensd}', '= 0{,}55'] },
  ],
  soorten: {
    valstrik: { naam: 'Decimale vorm: eerst vereenvoudigen', gen() {
      const v = Math.random() < 0.25 ? (() => { const n = kies([6, 12, 15, 18, 22, 30, 35, 45]), t = Rteller(n); return { t, n, k: kies([2, 3, 5, 7]), soort: 'GR' }; })() : verstopt(), d = decimaleVorm(v.t, v.n);
      return { soort: 'valstrik', opdracht: 'Welke decimale vorm heeft deze breuk?', tex: frRaw(v.t * v.k, v.n * v.k), antw: keuze(VORMEN, v.soort),
        uitleg: [`= ${fr(v.t, v.n)} \\quad \\text{(vereenvoudigen)}`, factorTex(v.n).includes('cdot') ? `${v.n} = ${factorTex(v.n)}` : `${v.n} \\text{ is een priemgetal}`, `\\text{${VORM_NAAM[v.soort]}: } ${fr(v.t, v.n)} = ${d.tex}`] };
    } },
    welke: { naam: 'Welke breuk heeft deze vorm?', gen() {
      return tot(() => {
        const doel = kies(['B', 'ZR', 'GR']), lijst = [];
        const maak = (moet) => tot(() => { const v = Math.random() < 0.6 ? verstopt() : (() => { const n = kies(VORM_N), t = Rteller(n); return { t, n, k: 1, soort: decimaleVorm(t, n).soort }; })();
          return moet(v.soort) ? v : null; });
        lijst.push(maak(s => s === doel)); for (let i = 0; i < 3; i++) lijst.push(maak(s => s !== doel));
        const texen = lijst.map(v => frRaw(v.t * v.k, v.n * v.k)); if (new Set(texen).size < 4) return null;
        const s = schud([0, 1, 2, 3]);
        return { soort: 'welke', opdracht: `Welke breuk heeft een ${{ B: 'begrensde', ZR: 'zuiver repeterende', GR: 'gemengd repeterende' }[doel]} decimale vorm?`, tex: s.map(i => texen[i]).join(' \\qquad '), sleutel: texen.join('|') + doel,
          antw: keuze(s.map((i, j) => ({ k: String(j), l: texen[i] })), s.indexOf(0)),
          uitleg: s.map(i => `${texen[i]}${lijst[i].k > 1 ? ` = ${fr(lijst[i].t, lijst[i].n)}` : ''}: \\text{ ${VORM_NAAM[lijst[i].soort]}}`) };
      });
    } },
  },
  oefenMix: [['valstrik', 2], ['welke', 1]],
  test: [['valstrik', 6], ['welke', 4]], testSchudden: true,
};

// ---------------------------------------------------------------
// 2. Afronden +
// ---------------------------------------------------------------
const decTekst = (d) => d === 0 ? 'een geheel getal' : d === 1 ? '1 decimaal' : d + ' decimalen';
const Q2 = {
  nr: 2, titel: 'Afronden +', kort: 'Afronden met een 9 die verspringt, negatieve getallen, breuken en lange perioden.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Afronden</div>
      <p>Kijk naar het cijfer <b>na</b> de laatste decimaal die je wil behouden: $0$ tot $4$ naar beneden, $5$ tot $9$ naar boven.</p></div>
    ${PLUS_KADER(`<p><b>Een 9 die verspringt</b>: $3{,}3974 \\approx 3{,}40$ (op 2 decimalen): de $9$ wordt $10$, dus ook het cijfer ervoor verspringt.
      Schrijf de nul achteraan: $3{,}40$ vertelt dat je op 2 decimalen hebt afgerond.</p>
      <p><b>Negatieve getallen</b> rond je af zoals het getal zonder minteken: $-2{,}46 \\approx -2{,}5$.</p>
      <p><b>Breuken</b>: deel tot je één decimaal meer hebt dan gevraagd: $-\\frac{5}{7} = -0{,}7142\\ldots \\approx -0{,}714$.</p>`)}`,
  voorbeelden: [
    { tex: '\\text{Rond } 19{,}96 \\text{ af op 1 decimaal.}', stappen: ['\\text{2de decimaal: 6, naar boven}', '19{,}9 + 0{,}1 = 20{,}0', '\\approx 20{,}0'] },
    { tex: '\\text{Rond } -1{,}\\overline{285714} \\text{ af op 4 decimalen.}', stappen: ['= -1{,}28571\\ldots', '\\approx -1{,}2857'] },
  ],
  soorten: {
    negen: { naam: 'Afronden met een 9 die verspringt', gen() {
      const d = rnd(0, 3), I = rnd(0, 49), pre = Array.from({ length: Math.max(0, d - 1) }, () => rnd(0, 9)).join('');
      const s = d === 0 ? `${I * 10 + 9}.${rnd(5, 9)}${rnd(0, 9)}` : `${I}.${pre}9${rnd(5, 9)}${rnd(0, 9)}${rnd(1, 9)}`;
      const x = (Math.random() < 0.35 ? -1 : 1) * Number(s); if (W.grensgeval(x, d)) return this.gen();
      return { soort: 'negen', opdracht: `Rond af op ${decTekst(d)}.`, tex: tg(x), antw: getal(x, { dec: d, voor: '\\approx', vast: true }), uitleg: [`\\text{het volgende cijfer is 5 of meer: naar boven}`, `\\approx ${W.texGetal(W.rond(x, d), d, true)}`] };
    } },
    breuk: { naam: 'Breuken en lange perioden afronden', gen() {
      const n = kies([7, 11, 13, 9, 12, 14, 15, 21, 22, 27, 37]), t = (Rteller(n) + n * rnd(0, 4)) * (Math.random() < 0.4 ? -1 : 1), d = rnd(2, 4), v = decimaleVorm(t, n), x = t / n;
      if (W.grensgeval(x, d)) return this.gen();
      const alsBreuk = Math.random() < 0.55;
      return { soort: 'breuk', opdracht: `Rond af op ${decTekst(d)}.`, tex: alsBreuk ? fr(t, n) : v.tex, antw: getal(x, { dec: d, voor: '\\approx', vast: true }),
        uitleg: [`= ${(x < 0 ? '-' : '') + Math.abs(x).toFixed(d + 2).replace('.', '{,}')}\\ldots`, `\\approx ${W.texGetal(W.rond(x, d), d, true)}`] };
    } },
  },
  oefenMix: [['negen', 1], ['breuk', 1]],
  test: [['negen', 5], ['breuk', 5]], testSchudden: true,
};

// ---------------------------------------------------------------
// 3. Vereenvoudigen en ordenen +
// ---------------------------------------------------------------
const ORDEN_N = [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15];
const Q3 = {
  nr: 3, titel: 'Vereenvoudigen en ordenen +', kort: 'Grote tellers en noemers, vier breuken (ook negatief) ordenen, een breuk tussen twee breuken.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Vereenvoudigen en vergelijken</div>
      <p>Deel teller en noemer door hun <b>ggd</b>: $\\frac{24}{36} = \\frac{2}{3}$. Vergelijken doe je na <b>gelijknamig maken</b> (kgv van de noemers).</p>
      <p class="klein">Bij negatieve breuken: $-\\frac{3}{4} > -\\frac{5}{6}$ (hoe verder naar links, hoe kleiner).</p></div>
    ${PLUS_KADER(`<p><b>Grote getallen</b>: ontbind teller en noemer in priemfactoren, of deel in stapjes: $\\frac{84}{126} = \\frac{42}{63} = \\frac{14}{21} = \\frac{2}{3}$.</p>
      <p><b>Positief en negatief door elkaar</b>: elke negatieve breuk is kleiner dan elke positieve. Vergelijk daarna binnen de negatieve en binnen de positieve breuken.</p>
      <p><b>Een breuk tussen twee breuken</b>: maak gelijknamig. Ligt er geen teller tussen, maak de noemer dan nog eens dubbel zo groot: $\\frac{2}{5} = \\frac{8}{20}$ en $\\frac{1}{2} = \\frac{10}{20}$, dus $\\frac{9}{20}$ ligt ertussen.</p>`)}${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\frac{-126}{210}', stappen: ['\\text{ggd}(126, 210) = 42', '= -\\frac{3}{5}'] },
    { tex: '\\text{Kleinste van } -\\frac{2}{3}, \\; \\frac{1}{4}, \\; -\\frac{5}{8}, \\; -\\frac{3}{4}', stappen: ['\\text{kgv} = 24: \\; -\\frac{16}{24}, \\; \\frac{6}{24}, \\; -\\frac{15}{24}, \\; -\\frac{18}{24}', '\\text{kleinste: } -\\frac{3}{4}'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Vereenvoudigen met grote getallen', gen() {
      const a = Rwil(15), k = kies([12, 14, 15, 16, 18, 21, 24, 26, 27, 28, 33, 35, 42]); if (Math.abs(a[0]) * k > 600 || a[1] * k > 600) return this.gen();
      return { soort: 'vereenvoudig', opdracht: 'Vereenvoudig tot een onvereenvoudigbare breuk.', tex: frRaw(a[0] * k, a[1] * k), antw: Rbr(a), uitleg: [`\\text{ggd}(${Math.abs(a[0] * k)}, ${a[1] * k}) = ${k}`, `= ${Rtex(a)}`] };
    } },
    ordenen: { naam: 'Vier breuken ordenen', gen() {
      return tot(() => {
        const b4 = [0, 1, 2, 3].map(() => { const n = kies(ORDEN_N); return R((Math.random() < 0.6 ? -1 : 1) * Rteller(n), n); });
        const w = b4.map(Rw); if (new Set(w).size < 4 || !w.some(x => x < 0) || Math.max(...w) - Math.min(...w) > 1.2) return null;
        const L = b4.reduce((m, b) => kgv(m, b[1]), 1); if (L > 120) return null;
        const groot = kies([true, false]), j = w.indexOf(groot ? Math.max(...w) : Math.min(...w));
        return { soort: 'ordenen', opdracht: `Welke breuk is het ${groot ? 'grootst' : 'kleinst'}?`, tex: b4.map(Rtex).join(', \\quad '), antw: keuze(b4.map((b, i) => ({ k: String(i), l: Rtex(b) })), j),
          uitleg: [`\\text{kgv van de noemers: } ${L}`, b4.map(b => frRaw(b[0] * L / b[1], L)).join(', \\; '), `\\text{${groot ? 'grootste' : 'kleinste'}: } ${Rtex(b4[j])}`] };
      });
    } },
    tussen: { naam: 'Een breuk tussen twee breuken', gen() {
      return tot(() => {
        const p = Rwil(9), q = Rwil(9); if (Rw(p) >= Rw(q) || Rw(q) - Rw(p) > 0.5) return null;
        const L = kgv(p[1], q[1]) * 2, m = R(p[0] * L / p[1] + 1, L); if (Rw(m) >= Rw(q)) return null; // een breuk net boven p
        const buiten = [Rmin(p, R(1, L)), Rplus(q, R(1, L)), Rmin(R(0), m), Rplus(q, R(1, q[1]))].filter(x => Rw(x) < Rw(p) || Rw(x) > Rw(q));
        const opties = [m, ...schud(buiten)].filter((x, i, a) => a.findIndex(y => Rtex(y) === Rtex(x)) === i).slice(0, 4); if (opties.length < 4) return null;
        const s = schud(opties);
        return { soort: 'tussen', opdracht: 'Welke breuk ligt tussen de twee gegeven breuken?', tex: `${Rtex(p)} < \\; ? \\; < ${Rtex(q)}`,
          antw: keuze(s.map((x, i) => ({ k: String(i), l: Rtex(x) })), s.indexOf(m)),
          uitleg: [`\\text{noemer } ${L}: \\; ${frRaw(p[0] * L / p[1], L)} \\text{ en } ${frRaw(q[0] * L / q[1], L)}`, `${Rtex(m)} \\text{ ligt ertussen}`] };
      });
    } },
  },
  oefenMix: [['vereenvoudig', 1], ['ordenen', 1], ['tussen', 1]],
  test: [['vereenvoudig', 3], ['ordenen', 4], ['tussen', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 4. Breuken en percentages +
// ---------------------------------------------------------------
const Q4 = {
  nr: 4, titel: 'Breuken en percentages +', kort: 'Percentages met een komma of boven 100 %, noemers zoals 8, 16 en 40.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Percentages</div>
      <p>$p\\% = \\frac{p}{100}$. &nbsp; $35\\% = \\frac{35}{100} = \\frac{7}{20}$ &nbsp; · &nbsp; $\\frac{3}{4} = \\frac{75}{100} = 75\\%$</p></div>
    ${PLUS_KADER(`<p><b>Een percentage met een komma</b>: maak eerst de teller geheel. $12{,}5\\% = \\frac{12{,}5}{100} = \\frac{125}{1000} = \\frac{1}{8}$ &nbsp; · &nbsp; $0{,}4\\% = \\frac{4}{1000} = \\frac{1}{250}$</p>
      <p><b>Meer dan 100 %</b>: $175\\% = \\frac{175}{100} = \\frac{7}{4}$.</p>
      <p><b>Breuk naar percentage</b> als de noemer geen deler van 100 is: maak de noemer $1000$ of deel: $\\frac{3}{8} = 3 : 8 = 0{,}375 = 37{,}5\\%$.</p>`)}${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\text{Schrijf } 2{,}5\\% \\text{ als breuk.}', stappen: ['= \\frac{2{,}5}{100} = \\frac{25}{1000}', '= \\frac{1}{40}'] },
    { tex: '\\text{Hoeveel procent is 21 van 24?}', stappen: ['\\frac{21}{24} = \\frac{7}{8}', '= 7 : 8 = 0{,}875', '= 87{,}5\\%'] },
  ],
  soorten: {
    naarBreuk: { naam: 'Percentage met komma → breuk', gen() {
      const p = kies([12.5, 37.5, 62.5, 87.5, 2.5, 7.5, 17.5, 0.5, 0.4, 0.8, 1.5, 4.5, 0.25, 120, 175, 250, 112.5, 0.2, 22.5]), a = R(Math.round(p * 1000), 100000);
      const kom = !Number.isInteger(p), dec = kom ? String(p).split('.')[1].length : 0, f = 10 ** dec;
      return { soort: 'naarBreuk', opdracht: 'Schrijf als onvereenvoudigbare breuk.', tex: `${tg(p)}\\%`, antw: Rbr(a),
        uitleg: [`= \\dfrac{${tg(p)}}{100}`, ...(kom ? [`= \\dfrac{${Math.round(p * f)}}{${100 * f}}`] : []), `= ${Rtex(a)}`] };
    } },
    naarProcent: { naam: 'Breuk → percentage (ook met komma)', gen() {
      const n = kies([8, 16, 40, 80, 200, 400, 125, 250, 32]), t = Rteller(n) * (Math.random() < 0.2 ? 3 : 1), p = t * 100 / n; if (p > 300 || !Number.isInteger(p * 1000)) return this.gen();
      return { soort: 'naarProcent', opdracht: 'Schrijf als percentage.', tex: frRaw(t, n), antw: getal(p, { na: '\\%' }), uitleg: [`= ${t} : ${n} = ${tg(t / n)}`, `= ${tg(p)}\\%`] };
    } },
    hoeveel: { naam: 'Hoeveel procent? (ook met komma)', gen() {
      const n = kies([8, 16, 40, 80, 200, 5, 20, 25]), t = rnd(1, 2 * n), m = rnd(2, 9), p = t * 100 / n; if (t === n || !Number.isInteger(p * 1000)) return this.gen();
      return { soort: 'hoeveel', opdracht: 'Hoeveel procent is het eerste getal van het tweede?', tex: `${t * m} \\text{ van } ${n * m}`, antw: getal(p, { na: '\\%' }),
        uitleg: [`\\dfrac{${t * m}}{${n * m}} = ${fr(t, n)}`, `= ${tg(t / n)} = ${tg(p)}\\%`] };
    } },
  },
  oefenMix: [['naarBreuk', 1], ['naarProcent', 1], ['hoeveel', 1]],
  test: [['naarBreuk', 4], ['naarProcent', 3], ['hoeveel', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 5. Breuken op de getallenas +
// ---------------------------------------------------------------
const Q5 = {
  nr: 5, titel: 'Breuken op de getallenas +', kort: 'Fijnere verdelingen (vereenvoudigen!) en het midden tussen twee punten.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Breuken op de getallenas</div>
      <p>De noemer zegt in hoeveel gelijke stukjes elke eenheid verdeeld is.</p>
      ${getallenas([{ x: -5 / 4, label: 'A' }, { x: 3 / 4, label: 'B' }], -2, 2, { deel: 4 })}
      <p class="klein midden">$A = -\\frac{5}{4}$ &nbsp; · &nbsp; $B = \\frac{3}{4}$</p></div>
    ${PLUS_KADER(`<p><b>Tel goed en vereenvoudig</b>: bij $8$ stukjes per eenheid is $6$ stukjes $\\frac{6}{8} = \\frac{3}{4}$.</p>
      <p><b>Het midden</b> $M$ van $A$ en $B$: tel $A$ en $B$ op en deel door $2$. &nbsp; $A = -\\frac{1}{2}$, $B = \\frac{5}{4}$: &nbsp; $M = \\left(-\\frac{2}{4} + \\frac{5}{4}\\right) : 2 = \\frac{3}{4} : 2 = \\frac{3}{8}$</p>`)}${BREUK_TYPEN}`,
  voorbeelden: [
    { html: getallenas([{ x: -10 / 6, label: 'A' }], -2, 2, { deel: 6 }), stappen: ['\\text{eenheid in 6 stukjes, 10 stukjes links van 0}', 'A = -\\frac{10}{6} = -\\frac{5}{3}'] },
  ],
  soorten: {
    aflezen: { naam: 'Breuk aflezen (vereenvoudigen)', gen() {
      const d = kies([4, 6, 8, 9, 10, 12]); let k; do { k = rnd(-3 * d + 1, 3 * d - 1); } while (k === 0 || k % d === 0 || (ggd(k, d) === 1 && Math.random() < 0.5));
      const a = R(k, d);
      return { soort: 'aflezen', opdracht: 'Welke breuk stelt het punt A voor? Vereenvoudig.', html: getallenas([{ x: k / d, label: 'A' }], -3, 3, { deel: d }), sleutel: `q${k}/${d}`, rapport: `A op ${k}/${d}`, antw: Rbr(a, { voor: 'A =' }),
        uitleg: [`\\text{eenheid in ${d} stukjes, ${Math.abs(k)} stukjes ${k < 0 ? 'links' : 'rechts'} van 0}`, `A = ${frRaw(k, d)}${ggd(k, d) > 1 ? ` = ${Rtex(a)}` : ''}`] };
    } },
    midden: { naam: 'Het midden van twee punten', gen() {
      return tot(() => {
        const d = kies([2, 3, 4, 5, 6]), k1 = rnd(-2 * d, 2 * d), k2 = rnd(-2 * d, 2 * d); if (k1 === k2 || Math.abs(k1 - k2) < 2) return null;
        const A = R(k1, d), B = R(k2, d), M = Rdeel(Rplus(A, B), R(2)); if (A[1] === 1 && B[1] === 1) return null;
        return { soort: 'midden', opdracht: 'Lees A en B af. Welke breuk stelt het midden M van A en B voor?', html: getallenas([{ x: k1 / d, label: 'A' }, { x: k2 / d, label: 'B' }], -2, 2, { deel: d }),
          sleutel: `m${k1}/${k2}/${d}`, rapport: `A = ${k1}/${d}, B = ${k2}/${d}`, antw: Rbr(M, { voor: 'M =' }),
          uitleg: [`A = ${Rtex(A)}, \\; B = ${Rtex(B)}`, `M = \\left(${Rtex(A)} + ${Rh(B)}\\right) : 2`, `= ${Rh(Rplus(A, B))} : 2 = ${Rtex(M)}`] };
      });
    } },
  },
  oefenMix: [['aflezen', 1], ['midden', 1]],
  test: [['aflezen', 6], ['midden', 4]], testSchudden: true,
};

// ---------------------------------------------------------------
// 6. Breuken optellen en aftrekken +
// ---------------------------------------------------------------
const SOM_N = [4, 6, 8, 9, 10, 12, 15, 16, 18, 20];
// termen: [[teken, breuk], …] (teken van de eerste term = '+')
function somUitleg(termen) {
  const L = termen.reduce((m, [, b]) => kgv(m, b[1]), 1);
  const omgezet = termen.map(([s, b], i) => { const t = frRaw(b[0] * L / b[1], L); return i === 0 ? t : `${s} ${b[0] < 0 ? `\\left(${t}\\right)` : t}`; }).join(' ');
  const som = termen.reduce((acc, [s, b], i) => acc + (i === 0 || s === '+' ? 1 : -1) * b[0] * L / b[1], 0), w = R(som, L);
  const alGelijk = termen.every(([, b]) => b[1] === L);
  return { L, w, stappen: [...(alGelijk ? [] : [`= ${omgezet} \\quad (\\text{kgv} = ${L})`]), `= ${frRaw(som, L)}`, ...(w[1] === L ? [] : [`= ${Rtex(w)}`])] };
}
const Q6 = {
  nr: 6, titel: 'Breuken optellen en aftrekken +', kort: 'Drie breuken, haakjes, moeilijke noemers en de ontbrekende breuk.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Optellen en aftrekken</div>
      <ol><li>Maak de breuken <b>gelijknamig</b> (kgv van de noemers).</li><li>Tel de tellers op (of trek af), de noemer blijft.</li><li>Vereenvoudig.</li></ol></div>
    ${PLUS_KADER(`<p><b>Drie breuken</b>: zoek het kgv van <b>alle</b> noemers: $\\frac{5}{6} - \\frac{3}{8} + \\frac{7}{12} = \\frac{20}{24} - \\frac{9}{24} + \\frac{14}{24} = \\frac{25}{24}$</p>
      <p><b>Haakjes</b>: eerst wat tussen de haakjes staat, of werk de haakjes weg met de tekenregels.</p>
      <p><b>De ontbrekende breuk</b>: denk aan de omgekeerde bewerking. $\\square + \\frac{2}{3} = -\\frac{1}{4}$ geeft $\\square = -\\frac{1}{4} - \\frac{2}{3} = -\\frac{11}{12}$.</p>`)}${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '-\\frac{4}{9} + \\frac{5}{6} - \\left(-\\frac{7}{12}\\right)', stappen: ['= -\\frac{16}{36} + \\frac{30}{36} + \\frac{21}{36}', '= \\frac{35}{36}'] },
    { tex: '\\frac{3}{10} - \\square = \\frac{4}{5}', stappen: ['\\square = \\frac{3}{10} - \\frac{4}{5}', '= \\frac{3}{10} - \\frac{8}{10}', '= -\\frac{1}{2}'] },
  ],
  soorten: {
    drie: { naam: 'Drie breuken', gen() {
      return tot(() => {
        const t = [['+', Rnoemer(SOM_N)], [kies(['+', '-']), Rnoemer(SOM_N)], [kies(['+', '-']), Math.random() < 0.2 ? R(nz(-3, 3)) : Rnoemer(SOM_N)]];
        const u = somUitleg(t); if (u.L > 144 || !klein(u.w) || new Set(t.map(x => Rtex(x[1]))).size < 3) return null;
        return { soort: 'drie', tex: t.map(([s, b], i) => i === 0 ? Rtex(b) : `${s} ${Rh(b)}`).join(' '), antw: Rbr(u.w), uitleg: u.stappen };
      });
    } },
    haakjes: { naam: 'Met haakjes', gen() {
      return tot(() => {
        const a = Rnoemer(SOM_N), b = Rnoemer(SOM_N), c = Rnoemer(SOM_N), s1 = kies(['+', '-']), s2 = kies(['+', '-']);
        const binnen = s2 === '+' ? Rplus(b, c) : Rmin(b, c), w = s1 === '+' ? Rplus(a, binnen) : Rmin(a, binnen); if (!binnen[0] || !klein(w)) return null;
        const Lb = kgv(b[1], c[1]); if (Lb > 72) return null;
        return { soort: 'haakjes', tex: `${Rtex(a)} ${s1} \\left(${Rtex(b)} ${s2} ${Rh(c)}\\right)`, antw: Rbr(w),
          uitleg: [`= ${Rtex(a)} ${s1} \\left(${frRaw(b[0] * Lb / b[1], Lb)} ${s2} ${c[0] < 0 ? `\\left(${frRaw(c[0] * Lb / c[1], Lb)}\\right)` : frRaw(c[0] * Lb / c[1], Lb)}\\right)`, `= ${Rtex(a)} ${s1} ${Rh(binnen)}`, ...somUitleg([['+', a], [s1, binnen]]).stappen] };
      });
    } },
    ontbrekend: { naam: 'De ontbrekende breuk', gen() {
      return tot(() => {
        const a = Rnoemer(SOM_N), b = Rnoemer(SOM_N), v = rnd(0, 2);
        if (v === 0) { const c = Rplus(a, b); if (!c[0]) return null; return { soort: 'ontbrekend', opdracht: 'Welke breuk hoort op de plaats van het vakje?', tex: `\\square + ${Rh(b)} = ${Rtex(c)}`, antw: Rbr(a, { voor: '\\square =' }), uitleg: [`\\square = ${Rtex(c)} - ${Rh(b)}`, ...somUitleg([['+', c], ['-', b]]).stappen] }; }
        if (v === 1) { const c = Rmin(a, b); if (!c[0]) return null; return { soort: 'ontbrekend', opdracht: 'Welke breuk hoort op de plaats van het vakje?', tex: `${Rtex(a)} - \\square = ${Rtex(c)}`, antw: Rbr(b, { voor: '\\square =' }), uitleg: [`\\square = ${Rtex(a)} - ${Rh(c)}`, ...somUitleg([['+', a], ['-', c]]).stappen] }; }
        const c = Rmin(a, b); if (!c[0]) return null; return { soort: 'ontbrekend', opdracht: 'Welke breuk hoort op de plaats van het vakje?', tex: `\\square - ${Rh(b)} = ${Rtex(c)}`, antw: Rbr(a, { voor: '\\square =' }), uitleg: [`\\square = ${Rtex(c)} + ${Rh(b)}`, ...somUitleg([['+', c], ['+', b]]).stappen] };
      });
    } },
  },
  oefenMix: [['drie', 2], ['haakjes', 1], ['ontbrekend', 1]],
  test: [['drie', 4], ['haakjes', 3], ['ontbrekend', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 7. Breuken vermenigvuldigen en delen +
// ---------------------------------------------------------------
const Q7 = {
  nr: 7, titel: 'Breuken vermenigvuldigen en delen +', kort: 'Ketens met · en :, kruiselings vereenvoudigen met grote getallen, de ontbrekende breuk.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Vermenigvuldigen en delen</div>
      <p>$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$ &nbsp; · &nbsp; delen door een breuk = vermenigvuldigen met het <b>omgekeerde</b>: $\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$</p></div>
    ${PLUS_KADER(`<p><b>Vereenvoudig vóór je vermenigvuldigt</b> (ook kruiselings): $-\\frac{14}{15} \\cdot \\frac{25}{28} = -\\frac{\\cancel{14}^{\\,1} \\cdot \\cancel{25}^{\\,5}}{\\cancel{15}_{\\,3} \\cdot \\cancel{28}_{\\,2}} = -\\frac{5}{6}$</p>
      <p><b>Ketens</b>: van links naar rechts, en elke deling wordt een vermenigvuldiging met het omgekeerde: $\\frac{3}{4} : \\frac{9}{8} \\cdot \\left(-\\frac{3}{2}\\right) = \\frac{3}{4} \\cdot \\frac{8}{9} \\cdot \\left(-\\frac{3}{2}\\right) = -1$</p>
      <p><b>De ontbrekende breuk</b>: $\\square \\cdot \\left(-\\frac{3}{4}\\right) = \\frac{9}{8}$ geeft $\\square = \\frac{9}{8} : \\left(-\\frac{3}{4}\\right) = -\\frac{3}{2}$.</p>`)}${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '-\\frac{10}{21} : \\frac{25}{14} \\cdot \\left(-\\frac{9}{4}\\right)', stappen: ['= -\\frac{10}{21} \\cdot \\frac{14}{25} \\cdot \\left(-\\frac{9}{4}\\right)', '= -\\frac{4}{15} \\cdot \\left(-\\frac{9}{4}\\right)', '= \\frac{3}{5}'] },
  ],
  soorten: {
    ketting: { naam: 'Ketens met · en :', gen() {
      return tot(() => {
        const a = Rwil(9), b = Rwil(9), c = Rwil(9), op1 = kies(['\\cdot', ':']), op2 = kies(['\\cdot', ':']); if (op1 === '\\cdot' && op2 === '\\cdot') return null;
        const doe = (x, op, y) => op === ':' ? Rdeel(x, y) : Rmaal(x, y), s1 = doe(a, op1, b), w = doe(s1, op2, c); if (!klein(w, 120)) return null;
        const om = (op, y) => op === ':' ? Rh(R(y[1], y[0])) : Rh(y);
        return { soort: 'ketting', tex: `${Rtex(a)} ${op1} ${Rh(b)} ${op2} ${Rh(c)}`, antw: Rbr(w),
          uitleg: [`= ${Rtex(a)} \\cdot ${om(op1, b)} \\cdot ${om(op2, c)} \\quad \\text{(delen = maal het omgekeerde)}`, `= ${Rtex(s1)} \\cdot ${om(op2, c)}`, `= ${Rtex(w)}`] };
      });
    } },
    kruis: { naam: 'Kruiselings vereenvoudigen (grote getallen)', gen() {
      return tot(() => {
        const g1 = rnd(2, 9), g2 = rnd(2, 9), u = rnd(1, 9), v = rnd(1, 9), s = rnd(1, 9), r = rnd(1, 9);
        const t1 = g1 * u, n1 = g2 * s, t2 = g2 * r, n2 = g1 * v; if (ggd(t1, n1) > 1 || ggd(t2, n2) > 1 || t1 > 99 || t2 > 99 || n1 > 99 || n2 > 99 || n1 < 2 || n2 < 2) return null;
        const a = [kies([1, -1]) * t1, n1], b = [kies([1, -1]) * t2, n2], deel = Math.random() < 0.4;
        const bb = deel ? R(b[1], b[0]) : b, w = Rmaal(a, bb); if (deel && Math.abs(bb[0]) === 1 && bb[1] === 1) return null;
        const tx = deel ? `${frRaw(a[0], a[1])} : ${Rh(R(b[1], b[0]))}` : `${frRaw(a[0], a[1])} \\cdot ${Rh(b)}`;
        return { soort: 'kruis', tex: tx, antw: Rbr(w),
          uitleg: [...(deel ? [`= ${frRaw(a[0], a[1])} \\cdot ${Rh(b)}`] : []), `\\text{ggd}(${t1}, ${n2}) = ${g1}, \\quad \\text{ggd}(${t2}, ${n1}) = ${g2}`, `= ${Rtex(w)}`] };
      });
    } },
    ontbrekend: { naam: 'De ontbrekende breuk', gen() {
      return tot(() => {
        const a = Rwil(9), b = Rwil(9), v = rnd(0, 2), o = 'Welke breuk hoort op de plaats van het vakje?';
        if (v === 0) { const c = Rmaal(a, b); return { soort: 'ontbrekend', opdracht: o, tex: `\\square \\cdot ${Rh(b)} = ${Rtex(c)}`, antw: Rbr(a, { voor: '\\square =' }), uitleg: [`\\square = ${Rtex(c)} : ${Rh(b)}`, `= ${Rtex(c)} \\cdot ${Rh(R(b[1], b[0]))}`, `= ${Rtex(a)}`] }; }
        if (v === 1) { const c = Rdeel(a, b); if (Rtex(c) === Rtex(a)) return null; return { soort: 'ontbrekend', opdracht: o, tex: `${Rtex(a)} : \\square = ${Rtex(c)}`, antw: Rbr(b, { voor: '\\square =' }), uitleg: [`\\square = ${Rtex(a)} : ${Rh(c)}`, `= ${Rtex(a)} \\cdot ${Rh(R(c[1], c[0]))}`, `= ${Rtex(b)}`] }; }
        const c = Rdeel(a, b); return { soort: 'ontbrekend', opdracht: o, tex: `\\square : ${Rh(b)} = ${Rtex(c)}`, antw: Rbr(a, { voor: '\\square =' }), uitleg: [`\\square = ${Rtex(c)} \\cdot ${Rh(b)}`, `= ${Rtex(a)}`] };
      });
    } },
  },
  oefenMix: [['ketting', 2], ['kruis', 1], ['ontbrekend', 1]],
  test: [['ketting', 4], ['kruis', 3], ['ontbrekend', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 8. Machten en wortels van breuken +
// ---------------------------------------------------------------
const kleineBreuk = () => { const n = rnd(2, 5), t = Rteller(n); return R(kies([1, -1]) * t, n); };
const MACHT_COMBI = [
  () => { const a = kleineBreuk(), b = kleineBreuk(), m = kies([-2, -1, 2, 3]), n = kies([-2, 2, -1]); const A = Rmacht(a, m), B = Rmacht(b, n), w = Rmaal(A, B);
    return { tex: `${Rhm(a)}^{${m}} \\cdot ${Rhm(b)}^{${n}}`, w, L: [`= ${Rtex(A)} \\cdot ${Rh(B)}`] }; },
  () => { const p = kies([2, 3, 4, 5]), q = kies([2, 3, 4, 5]), m = p === 2 ? rnd(1, 4) : rnd(1, 2), n = q === 2 ? rnd(1, 4) : rnd(1, 2), s = kies(['+', '-']); const A = Rmacht(R(p), -m), B = Rmacht(R(q), -n), w = s === '+' ? Rplus(A, B) : Rmin(A, B);
    return { tex: `${p}^{-${m}} ${s} ${q}^{-${n}}`, w, L: [`= ${Rtex(A)} ${s} ${Rtex(B)}`] }; },
  () => { const a = kleineBreuk(), e = kies([-3, -2, 3]); const A = Rmacht(a, e), w = R(-A[0], A[1]);
    return { tex: `-${Rhm(a)}^{${e}}`, w, L: [...(e < 0 ? [`= -${Rhm(R(a[1], a[0]))}^{${-e}}`] : []), `= -${Rh(A)}`] }; },
  () => { const a = kleineBreuk(), m = rnd(2, 5), k = rnd(-3, -1); const e = m + k; if (e < -3 || e > 3) return null; const w = Rmacht(a, e);
    return { tex: `${Rhm(a)}^{${m}} : ${Rhm(a)}^{${m - e}}`, w, L: [`\\text{exponent: } ${m} - ${h(m - e)} = ${e}`, `= ${Rhm(a)}^{${e}}`] }; },
  () => { const a = kleineBreuk(), p = kies([2, -2, 3, -1]), q = kies([-1, 2, -2]), k = rnd(-3, 3); const e = p * q + k; if (Math.abs(e) > 3 || k === 0) return null; const w = Rmacht(a, e);
    return { tex: `\\left(${Rhm(a)}^{${p}}\\right)^{${q}} \\cdot ${Rhm(a)}^{${k}}`, w, L: [`\\text{exponent: } ${p} \\cdot ${h(q)} + ${h(k)} = ${e}`, `= ${Rhm(a)}^{${e}}`] }; },
];
const WORTEL_Q = [
  () => { const n = rnd(2, 9), t = Rteller(n), k = kies([2, 3, 5, 6]); return { tex: `\\sqrt{\\dfrac{${t * t * k}}{${n * n * k}}}`, w: R(t, n), L: [`= \\sqrt{${fr(t * t, n * n)}} \\quad \\text{(eerst vereenvoudigen)}`] }; },
  () => { const n = rnd(3, 10), t = Rteller(n), inner = R(n * n - t * t, n * n); return { tex: `\\sqrt{1 - ${Rtex(inner)}}`, w: R(t, n), L: [`= \\sqrt{${frRaw(n * n, n * n)} - ${frRaw(n * n - t * t, n * n)}}`, `= \\sqrt{${frRaw(t * t, n * n)}}`] }; },
  () => { const n = rnd(2, 5), t = Rteller(n), k = kies([2, 3]); return { tex: `\\sqrt[3]{-\\dfrac{${t ** 3 * k}}{${n ** 3 * k}}}`, w: R(-t, n), L: [`= \\sqrt[3]{-${fr(t ** 3, n ** 3)}} \\quad \\text{(eerst vereenvoudigen)}`] }; },
  () => { const t = rnd(1, 9), d = kies([10, 100]); if (t % 10 === 0) return null; const x = (t * t) / (d * d); return { tex: `\\sqrt{${tg(x)}}`, w: R(t, d), L: [`= \\sqrt{${frRaw(t * t, d * d)}}`] }; },
  () => { const n = rnd(2, 9), t = Rteller(n); return { tex: `\\sqrt{\\left(-${frRaw(t, n)}\\right)^2}`, w: R(t, n), L: [`= \\sqrt{${frRaw(t * t, n * n)}}`] }; },
];
const Q8 = {
  nr: 8, titel: 'Machten en wortels van breuken +', kort: 'Negatieve exponenten combineren, rekenregels na elkaar, wortels die je eerst vereenvoudigt.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Machten en wortels van breuken</div>
      <p>$\\left(-\\frac{2}{3}\\right)^3 = -\\frac{8}{27}$ &nbsp; · &nbsp; <b>negatieve exponent</b>: het omgekeerde: $\\left(\\frac{2}{5}\\right)^{-2} = \\frac{25}{4}$, $3^{-2} = \\frac{1}{9}$</p>
      <p>$\\sqrt{\\frac{9}{16}} = \\frac{3}{4}$ &nbsp; · &nbsp; $\\sqrt[3]{-\\frac{8}{27}} = -\\frac{2}{3}$ &nbsp; · &nbsp; de rekenregels van machten gelden ook in ℚ.</p></div>
    ${PLUS_KADER(`<p><b>Negatieve exponenten optellen</b>: $2^{-3} + 4^{-1} = \\frac{1}{8} + \\frac{1}{4} = \\frac{3}{8}$.</p>
      <p><b>Rekenregels na elkaar</b>: reken eerst de exponent uit. $\\left(\\left(\\frac{2}{3}\\right)^{2}\\right)^{-1} \\cdot \\left(\\frac{2}{3}\\right)^{3} = \\left(\\frac{2}{3}\\right)^{-2 + 3} = \\frac{2}{3}$</p>
      <p><b>Wortels</b>: vereenvoudig eerst onder de wortel of reken eerst uit: $\\sqrt{\\frac{18}{50}} = \\sqrt{\\frac{9}{25}} = \\frac{3}{5}$ &nbsp; · &nbsp; $\\sqrt{1 - \\frac{7}{16}} = \\sqrt{\\frac{9}{16}} = \\frac{3}{4}$ &nbsp; · &nbsp; $\\sqrt{0{,}09} = \\sqrt{\\frac{9}{100}} = \\frac{3}{10}$</p>`)}${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\left(-\\frac{2}{3}\\right)^{-2} \\cdot \\left(\\frac{1}{3}\\right)^{2}', stappen: ['= \\frac{9}{4} \\cdot \\frac{1}{9}', '= \\frac{1}{4}'] },
    { tex: '\\sqrt[3]{-\\frac{16}{54}}', stappen: ['= \\sqrt[3]{-\\frac{8}{27}}', '= -\\frac{2}{3}'] },
  ],
  soorten: {
    macht: { naam: 'Machten en negatieve exponenten combineren', gen() {
      const r = tot(() => { const x = kies(MACHT_COMBI)(); return x && klein(x.w, 300) ? x : null; });
      return { soort: 'macht', tex: r.tex, antw: Rbr(r.w), uitleg: [...r.L, `= ${Rtex(r.w)}`] };
    } },
    wortel: { naam: 'Wortels: eerst vereenvoudigen of uitrekenen', gen() {
      const r = tot(() => kies(WORTEL_Q)());
      return { soort: 'wortel', tex: r.tex, antw: Rbr(r.w), uitleg: [...r.L, `= ${Rtex(r.w)}`] };
    } },
  },
  oefenMix: [['macht', 2], ['wortel', 1]],
  test: [['macht', 6], ['wortel', 4]], testSchudden: true,
};

// ---------------------------------------------------------------
// 9. Volgorde van de bewerkingen in ℚ +
// ---------------------------------------------------------------
const QVP = [
  () => { // [a − b·c] : d
    const a = Rwil(6), b = Rwil(6), c = Rwil(6), d = Rwil(5), bc = Rmaal(b, c), s = Rmin(a, bc); if (!s[0]) return null;
    return { tex: `\\left[${Rtex(a)} - ${Rh(b)} \\cdot ${Rh(c)}\\right] : ${Rh(d)}`, w: Rdeel(s, d), L: [`= \\left[${Rtex(a)} - ${Rh(bc)}\\right] : ${Rh(d)}`, `= ${Rh(s)} : ${Rh(d)}`, `= ${Rh(s)} \\cdot ${Rh(R(d[1], d[0]))}`] };
  },
  () => { // (a + b)² − c : d
    const a = Rwil(5), b = Rwil(5), c = Rwil(6), d = Rwil(6), s = Rplus(a, b), k = Rmacht(s, 2), q = Rdeel(c, d); if (!s[0] || !klein(k, 100)) return null;
    return { tex: `\\left(${Rtex(a)} + ${Rh(b)}\\right)^2 - ${Rh(c)} : ${Rh(d)}`, w: Rmin(k, q), L: [`= ${Rhm(s)}^2 - ${Rh(c)} : ${Rh(d)}`, `= ${Rtex(k)} - ${Rh(q)}`] };
  },
  () => { // a − [b − (c − d)]·e
    const a = Rwil(6), b = Rwil(6), c = Rwil(6), d = Rwil(6), e = R(nz(-4, 4)), cd = Rmin(c, d), bin = Rmin(b, cd), p = Rmaal(bin, e); if (!cd[0] || !bin[0]) return null;
    return { tex: `${Rtex(a)} - \\left[${Rtex(b)} - \\left(${Rtex(c)} - ${Rh(d)}\\right)\\right] \\cdot ${Rh(e)}`, w: Rmin(a, p), L: [`= ${Rtex(a)} - \\left[${Rtex(b)} - ${Rh(cd)}\\right] \\cdot ${Rh(e)}`, `= ${Rtex(a)} - ${Rh(bin)} \\cdot ${Rh(e)}`, `= ${Rtex(a)} - ${Rh(p)}`] };
  },
  () => { // √(t²/n²) · b − c⁻¹
    const n = rnd(2, 9), t = Rteller(n), r = R(t, n), b = Rwil(6), c = Rwil(6), p = Rmaal(r, b), ci = R(c[1], c[0]);
    return { tex: `\\sqrt{\\dfrac{${t * t}}{${n * n}}} \\cdot ${Rh(b)} - ${Rhm(c)}^{-1}`, w: Rmin(p, ci), L: [`= ${Rtex(r)} \\cdot ${Rh(b)} - ${Rh(ci)}`, `= ${Rtex(p)} - ${Rh(ci)}`] };
  },
  () => { // (1 − a)^(−2) · b
    const a = Rwil(6), b = Rwil(6), s = Rmin(R(1), a); if (!s[0]) return null; const k = Rmacht(s, -2);
    return { tex: `\\left(1 - ${Rh(a)}\\right)^{-2} \\cdot ${Rh(b)}`, w: Rmaal(k, b), L: [`= ${Rhm(s)}^{-2} \\cdot ${Rh(b)}`, `= ${Rtex(k)} \\cdot ${Rh(b)}`] };
  },
  () => { // a : [b + c·(d − 1)]
    const a = Rwil(6), b = Rwil(6), c = Rwil(5), d = Rwil(5), dm = Rmin(d, R(1)), cp = Rmaal(c, dm), bin = Rplus(b, cp); if (!bin[0]) return null;
    return { tex: `${Rtex(a)} : \\left[${Rtex(b)} + ${Rh(c)} \\cdot \\left(${Rtex(d)} - 1\\right)\\right]`, w: Rdeel(a, bin), L: [`= ${Rtex(a)} : \\left[${Rtex(b)} + ${Rh(c)} \\cdot ${Rh(dm)}\\right]`, `= ${Rtex(a)} : \\left[${Rtex(b)} + ${Rh(cp)}\\right]`, `= ${Rtex(a)} : ${Rh(bin)}`] };
  },
];
const Q9 = {
  nr: 9, titel: 'Volgorde van de bewerkingen in ℚ +', kort: 'Vierkante haakjes, machten met negatieve exponent en wortels door elkaar.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig. Werk stap voor stap.',
  theorie: `${VOLGORDE}
    ${PLUS_KADER(`<p>Werk <b>van binnen naar buiten</b> en schrijf na elke stap de hele uitdrukking opnieuw. Vereenvoudig tussenuitkomsten meteen: dan blijven de getallen klein.</p>
      <p class="midden">$\\left[\\frac{1}{2} - \\frac{3}{4} \\cdot \\left(-\\frac{2}{3}\\right)\\right] : \\frac{5}{6} = \\left[\\frac{1}{2} + \\frac{1}{2}\\right] : \\frac{5}{6} = 1 \\cdot \\frac{6}{5} = \\frac{6}{5}$</p>`)}${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\left(1 - \\frac{1}{3}\\right)^{-2} \\cdot \\left(-\\frac{8}{9}\\right)', stappen: ['= \\left(\\frac{2}{3}\\right)^{-2} \\cdot \\left(-\\frac{8}{9}\\right)', '= \\frac{9}{4} \\cdot \\left(-\\frac{8}{9}\\right)', '= -2'] },
  ],
  soorten: {
    gemengd: { naam: 'Bewerkingen met volgorde', gen() {
      const r = tot(() => { const x = kies(QVP)(); return x && klein(x.w, 150) ? x : null; });
      return { soort: 'gemengd', tex: r.tex, antw: Rbr(r.w), uitleg: [...r.L, `= ${Rtex(r.w)}`] };
    } },
  },
  oefenMix: [['gemengd', 1]],
  test: [['gemengd', 10]], testSchudden: true,
};

// ---------------------------------------------------------------
// 10. Van decimaal getal naar breuk +
// ---------------------------------------------------------------
const Q10 = {
  nr: 10, titel: 'Van decimaal getal naar breuk +', kort: 'Negatieve getallen, een geheel deel en twee cijfers vóór de periode.', rekenmachine: false,
  opdracht: 'Schrijf als onvereenvoudigbare breuk.',
  theorie: `<div class="kader def"><div class="kader-titel">Decimaal getal naar breuk</div>
      <p><b>Begrensd:</b> $0{,}35 = \\frac{35}{100} = \\frac{7}{20}$ &nbsp; · &nbsp; <b>zuiver repeterend:</b> $0{,}\\overline{27} = \\frac{27}{99} = \\frac{3}{11}$</p>
      <p><b>Gemengd repeterend:</b> teller: cijfers tot en met de eerste periode min de cijfers vóór de periode; noemer: een 9 per cijfer van de periode, een 0 per cijfer vóór de periode. &nbsp; $0{,}1\\overline{6} = \\frac{16 - 1}{90} = \\frac{1}{6}$</p></div>
    ${PLUS_KADER(`<p><b>Twee cijfers vóór de periode</b>: $0{,}12\\overline{3} = \\frac{123 - 12}{900} = \\frac{111}{900} = \\frac{37}{300}$ (twee nullen in de noemer).</p>
      <p><b>Een geheel deel</b>: $2{,}\\overline{3} = 2 + \\frac{3}{9} = 2 + \\frac{1}{3} = \\frac{7}{3}$.</p>
      <p><b>Negatief</b>: zet het minteken vóór de breuk: $-1{,}25 = -\\frac{125}{100} = -\\frac{5}{4}$.</p>`)}${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '-3{,}1\\overline{6}', stappen: ['0{,}1\\overline{6} = \\frac{16 - 1}{90} = \\frac{1}{6}', '-3{,}1\\overline{6} = -\\left(3 + \\frac{1}{6}\\right)', '= -\\frac{19}{6}'] },
  ],
  soorten: {
    begrensd: { naam: 'Begrensd met een geheel deel (ook negatief)', gen() {
      const d = rnd(2, 3), x = rnd(10 ** d + 1, 5 * 10 ** d) * kies([1, -1]); if (x % 10 === 0) return this.gen(); const a = R(x, 10 ** d);
      return { soort: 'begrensd', tex: tg(x / 10 ** d), antw: Rbr(a), uitleg: [`= ${frRaw(x, 10 ** d)}`, `= ${Rtex(a)}`] };
    } },
    zuiver: { naam: 'Zuiver repeterend met een geheel deel', gen() {
      const l = kies([1, 2, 2, 3]), q = 10 ** l - 1, g = rnd(1, 4), neg = Math.random() < 0.4; let p; do { p = rnd(1, q - 1); } while (l > 1 && new Set(String(p).padStart(l, '0')).size === 1);
      const ps = String(p).padStart(l, '0'), f = R(p, q), a0 = Rplus(R(g), f), a = neg ? R(-a0[0], a0[1]) : a0;
      return { soort: 'zuiver', tex: `${neg ? '-' : ''}${g}{,}\\overline{${ps}}`, antw: Rbr(a),
        uitleg: [`0{,}\\overline{${ps}} = \\dfrac{${p}}{${q}}${f[1] === q ? '' : ` = ${Rtex(f)}`}`, `${neg ? '-\\left(' : ''}${g} + ${Rtex(f)}${neg ? '\\right)' : ''}`, `= ${Rtex(a)}`] };
    } },
    gemengd: { naam: 'Gemengd repeterend (ook twee cijfers vóór de periode)', gen() {
      return tot(() => {
        const nv = kies([1, 2, 2]), v = String(rnd(nv === 1 ? 1 : 10, nv === 1 ? 9 : 99)), l = kies([1, 1, 2]), q = 10 ** l - 1; const p = rnd(1, q - 1), ps = String(p).padStart(l, '0');
        if (l > 1 && ps[0] === ps[1]) return null; if (ps[l - 1] === v[v.length - 1]) return null;
        const g = Math.random() < 0.4 ? rnd(1, 3) : 0, neg = Math.random() < 0.35;
        const teller = Number(v + ps) - Number(v), noemer = q * 10 ** nv, f = R(teller, noemer), a0 = Rplus(R(g), f), a = neg ? R(-a0[0], a0[1]) : a0;
        return { soort: 'gemengd', tex: `${neg ? '-' : ''}${g}{,}${v}\\overline{${ps}}`, antw: Rbr(a),
          uitleg: [`\\text{teller: } ${v}${ps} - ${v} = ${teller}, \\quad \\text{noemer: } ${noemer}`, `0{,}${v}\\overline{${ps}} = \\dfrac{${teller}}{${noemer}} = ${Rtex(f)}`, ...(g ? [`${neg ? '-\\left(' : ''}${g} + ${Rtex(f)}${neg ? '\\right)' : ''} = ${Rtex(a)}`] : neg ? [`-${Rtex(f)}`] : [])] };
      });
    } },
  },
  oefenMix: [['begrensd', 1], ['zuiver', 1], ['gemengd', 1]],
  test: [['begrensd', 2], ['zuiver', 3], ['gemengd', 5]], testSchudden: true,
};

// ---------------------------------------------------------------
// 11. Vraagstukken met procenten + (rekentoestel)
// ---------------------------------------------------------------
const cent = (x) => Math.round(x * 100) / 100;
const PROCENTEN = `<div class="kader def"><div class="kader-titel">Procenten met een verhoudingstabel</div>
  <p>Zet de gegevens in een <b>verhoudingstabel</b>: <b>wat je boven doet, doe je ook onder</b>.</p>
  <ul><li>$21\\%$ erbij = $121\\%$ van de prijs: vermenigvuldig met $1{,}21$. &nbsp; $15\\%$ korting = je betaalt $85\\%$: vermenigvuldig met $0{,}85$.</li>
  <li>Oorspronkelijke prijs: deel door het percentage en vermenigvuldig met $100$.</li></ul></div>`;
const QPP = [
  () => { const p = cent(rnd(2000, 40000) / 100), k = kies([10, 15, 20, 25, 30]), na = cent(p * (100 - k) / 100), w = cent(na * 1.21);
    return { tekst: `Een fiets kost € ${naarTekst(p)} zonder btw. Je krijgt eerst ${k}% korting, daarna komt er 21% btw bij. Hoeveel betaal je? Rond af op de cent.`, w, dec: 2, na: '\\text{ euro}',
      L: [`\\text{na korting: } ${tg(p)} \\cdot ${tg((100 - k) / 100)} = ${tg(na)} \\text{ euro}`, `\\text{met btw: } ${tg(na)} \\cdot 1{,}21 \\approx ${tg(w, 2)} \\text{ euro}`] }; },
  () => { const a = kies([10, 20, 25, 30, 40, 50]), b = kies([10, 20, 25, 50]), w = 100 - (100 - a) * (100 - b) / 100;
    return { tekst: `Een winkel geeft ${a}% korting. Aan de kassa krijg je op die nieuwe prijs nog eens ${b}% extra korting. Hoeveel procent korting krijg je in totaal?`, w, dec: 2, na: '\\%',
      L: [`\\text{neem 100 euro: } 100 \\cdot ${tg((100 - a) / 100)} = ${100 - a} \\text{ euro}`, `${100 - a} \\cdot ${tg((100 - b) / 100)} = ${tg((100 - a) * (100 - b) / 100)} \\text{ euro}`, `\\text{korting: } 100 - ${tg((100 - a) * (100 - b) / 100)} = ${tg(w)}\\% \\quad (\\text{niet } ${a + b}\\%)`] }; },
  () => { const T = cent(rnd(3000, 60000) / 100), b = kies([6, 21]), w = cent(T / (1 + b / 100));
    return { tekst: `Met ${b}% btw betaal je € ${naarTekst(T)}. Hoeveel kost het zonder btw? Rond af op de cent.`, w, dec: 2, na: '\\text{ euro}',
      L: [`${tg(T)} \\text{ euro is } ${100 + b}\\%`, vtTex(['%', 'euro'], [[String(100 + b), tg(T)], ['100', `${tg(T)} : ${100 + b} \\cdot 100`]]), `\\approx ${tg(w, 2)} \\text{ euro}`] }; },
  () => { const oud = rnd(60, 900), nieuw = oud - rnd(3, Math.round(oud / 2)), w = (oud - nieuw) / oud * 100;
    return { tekst: `Het aantal bezoekers van een museum daalt van ${oud} naar ${nieuw} per week. Met hoeveel procent is het aantal gedaald? Rond af op 1 decimaal.`, w, dec: 1, na: '\\%',
      L: [`\\text{daling: } ${oud} - ${nieuw} = ${oud - nieuw}`, vtTex(['bezoekers', '%'], [[oud, '100'], [oud - nieuw, `\\frac{${oud - nieuw}}{${oud}} \\cdot 100`]]), `\\approx ${tg(W.rond(w, 1), 1)}\\%`] }; },
  () => { const p = cent(rnd(4000, 30000) / 100), s = kies([10, 20, 25]), d = s, na1 = cent(p * (100 + s) / 100), w = cent(na1 * (100 - d) / 100);
    return { tekst: `Een gsm kost € ${naarTekst(p)}. De prijs stijgt eerst met ${s}% en daalt daarna met ${d}%. Wat is de nieuwe prijs? Rond af op de cent.`, w, dec: 2, na: '\\text{ euro}',
      L: [`${tg(p)} \\cdot ${tg((100 + s) / 100)} = ${tg(na1)} \\text{ euro}`, `${tg(na1)} \\cdot ${tg((100 - d) / 100)} \\approx ${tg(w, 2)} \\text{ euro}`, '\\text{goedkoper dan eerst: de daling rekent met de nieuwe, hogere prijs}'] }; },
];
const Q11 = {
  nr: 11, titel: 'Vraagstukken met procenten +', kort: 'Procenten na elkaar, totale korting, terugrekenen met btw, procentuele daling.', rekenmachine: true,
  opdracht: 'Los op met een verhoudingstabel. Je mag je rekentoestel gebruiken.',
  theorie: `${PROCENTEN}
    ${PLUS_KADER(`<p><b>Procenten na elkaar</b>: de tweede keer reken je met de <b>nieuwe</b> prijs. $20\\%$ korting en daarna nog $10\\%$ is <b>geen</b> $30\\%$:
      $100 \\cdot 0{,}8 = 80$ en $80 \\cdot 0{,}9 = 72$, dus $28\\%$ korting.</p>
      <p><b>Terugrekenen met btw</b>: de prijs met $21\\%$ btw is $121\\%$. Deel door $121$ en vermenigvuldig met $100$ (of deel door $1{,}21$).</p>`)}`,
  voorbeelden: [
    { tex: '\\text{€ 250 zonder btw, eerst 20\\% korting, dan 21\\% btw}', stappen: ['250 \\cdot 0{,}8 = 200 \\text{ euro}', '200 \\cdot 1{,}21 = 242 \\text{ euro}'] },
  ],
  soorten: {
    vraagstuk: { naam: 'Vraagstukken met procenten', gen() { const r = kies(QPP)(); if (W.grensgeval(r.w, r.dec)) return this.gen();
      return { soort: 'vraagstuk', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { dec: r.dec, na: r.na, vast: r.dec === 2 }), uitleg: r.L }; } },
  },
  oefenMix: [['vraagstuk', 1]],
  test: [['vraagstuk', 10]], testSchudden: true,
};

// ---------------------------------------------------------------
// 12. Evenredigheden + (rekentoestel)
// ---------------------------------------------------------------
const EVENREDIG = `<div class="kader def"><div class="kader-titel">Recht of omgekeerd?</div>
    <p><b>Recht evenredig</b>: hoe meer, hoe meer. Wat je boven doet, doe je ook onder.</p>
    <p><b>Omgekeerd evenredig</b>: hoe meer, hoe minder. Doe je boven maal, dan doe je onder gedeeld door (en omgekeerd).</p></div>`;
const ER = [
  { t: '{a} liter verf is genoeg voor {b} m² muur. Voor hoeveel m² is {c} liter genoeg?', n: ['liter', 'm^2'], e: 'm²', etex: '\\text{ m}^2', recht: true },
  { t: 'Een auto verbruikt {b} liter brandstof voor {a} km. Hoeveel liter verbruikt hij voor {c} km?', n: ['km', 'liter'], e: 'liter', recht: true },
  { t: '{a} kg appelen kost € {b}. Hoeveel kost {c} kg?', n: ['kg', 'euro'], e: 'euro', recht: true },
  { t: '{a} pompen maken een kelder leeg in {b} uur. Hoeveel uur hebben {c} pompen nodig?', n: ['pompen', 'uur'], e: 'uur', recht: false },
  { t: 'Bij {a} km/u duurt een rit {b} uur. Hoeveel uur duurt dezelfde rit bij {c} km/u?', n: ['km/u', 'uur'], e: 'uur', recht: false },
  { t: '{a} vrijwilligers pakken alle pakjes in in {b} uur. Hoeveel uur hebben {c} vrijwilligers nodig?', n: ['vrijwilligers', 'uur'], e: 'uur', recht: false },
];
function erVraag(recht) {
  const ctx = kies(ER.filter(x => recht === undefined || x.recht === recht));
  return tot(() => {
    let a, b, c;
    if (ctx.n[0] === 'km') { a = rnd(10, 60) * 10; b = cent(rnd(150, 600) / 10); c = rnd(5, 90) * 10; }
    else if (ctx.n[0] === 'km/u') { a = kies([50, 60, 70, 80, 90, 100, 120]); b = cent(rnd(10, 60) / 10); c = kies([50, 60, 70, 80, 90, 100, 110, 120]); }
    else if (ctx.n[0] === 'liter') { a = rnd(4, 20) / 2; b = cent(a * rnd(60, 120) / 10); c = rnd(3, 30) / 2; }
    else if (ctx.n[0] === 'kg') { a = cent(rnd(15, 60) / 10); b = cent(rnd(200, 1500) / 100); c = cent(rnd(10, 90) / 10); }
    else { a = rnd(2, 12); b = cent(rnd(15, 120) / 10); c = rnd(2, 15); }
    if (a === c) return null;
    const w = ctx.recht ? b / a * c : a * b / c, dec = 2; if (W.grensgeval(w, dec)) return null;
    const L = ctx.recht
      ? ['\\text{recht evenredig (hoe meer, hoe meer)}', vtTex(ctx.n, [[tg(a), tg(b)], ['1', `${tg(b)} : ${tg(a)}`], [tg(c), `${tg(b)} : ${tg(a)} \\cdot ${tg(c)}`]]), `\\approx ${tg(W.rond(w, dec), dec)} ${ctx.etex || `\\text{ ${ctx.e}}`}`]
      : ['\\text{omgekeerd evenredig (hoe meer, hoe minder)}', vtTex(ctx.n, [[tg(a), tg(b)], ['1', `${tg(b)} \\cdot ${tg(a)}`], [tg(c), `${tg(b)} \\cdot ${tg(a)} : ${tg(c)}`]]), `\\approx ${tg(W.rond(w, dec), dec)} ${ctx.etex || `\\text{ ${ctx.e}}`}`];
    return { ctx, tekst: vul(ctx.t, { a: naarTekst(a), b: naarTekst(b), c: naarTekst(c) }) + ' Rond af op 2 decimalen.', w, dec, L };
  });
}
const Q12 = {
  nr: 12, titel: 'Evenredigheden +', kort: 'Kommagetallen, recht of omgekeerd herkennen, vraagstukken in twee stappen.', rekenmachine: true,
  theorie: `${EVENREDIG}
    ${PLUS_KADER(`<p><b>Met kommagetallen</b> werk je via <b>1</b>: 2,5 kg kost € 6,40. Dan kost 1 kg $6{,}40 : 2{,}5 = 2{,}56$ euro, en 3,8 kg $2{,}56 \\cdot 3{,}8 = 9{,}728 \\approx 9{,}73$ euro.</p>
      <p><b>Omgekeerd via 1</b>: 6 pompen werken 4,5 uur. Eén pomp werkt $4{,}5 \\cdot 6 = 27$ uur, 8 pompen $27 : 8 = 3{,}375$ uur.</p>
      <p><b>In twee stappen</b>: 6 schilders zouden 20 dagen werken. Na 5 dagen komen er 3 bij. Er blijft werk voor 6 schilders gedurende 15 dagen; met 9 schilders duurt het $15 \\cdot 6 : 9 = 10$ dagen.</p>`)}`,
  voorbeelden: [
    { tex: '\\text{4,5 liter verf is genoeg voor 36 m}^2. \\text{ Voor hoeveel m}^2 \\text{ is 7,2 liter genoeg?}', stappen: ['\\text{recht evenredig}', '36 : 4{,}5 = 8 \\text{ m}^2 \\text{ per liter}', '8 \\cdot 7{,}2 = 57{,}6 \\text{ m}^2'] },
  ],
  soorten: {
    recht: { naam: 'Rechte evenredigheid met kommagetallen', gen() { const r = erVraag(true); return { soort: 'recht', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { dec: r.dec, na: r.ctx.etex || `\\text{ ${r.ctx.e}}` }), uitleg: r.L }; } },
    omgekeerd: { naam: 'Omgekeerde evenredigheid met kommagetallen', gen() { const r = erVraag(false); return { soort: 'omgekeerd', opdracht: 'Los op met een verhoudingstabel.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { dec: r.dec, na: r.ctx.etex || `\\text{ ${r.ctx.e}}` }), uitleg: r.L }; } },
    soortVerband: { naam: 'Recht of omgekeerd?', gen() {
      const r = erVraag();
      return { soort: 'soortVerband', opdracht: 'Is dit een rechte of een omgekeerde evenredigheid? Los daarna op.', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: 's' + r.tekst, rapport: r.tekst,
        antw: { soort: 'delen', delen: [{ label: '\\text{evenredigheid:}', antw: keuze(kTekst(['recht', 'omgekeerd']), r.ctx.recht ? 0 : 1) }, { label: '\\text{antwoord:}', antw: getal(r.w, { voor: '', dec: r.dec, na: r.ctx.etex || `\\text{ ${r.ctx.e}}` }) }] }, uitleg: r.L };
    } },
    tweestaps: { naam: 'Vraagstukken in twee stappen', gen() {
      return tot(() => {
        const ctx = kies([
          { t: '{a} schilders zouden een gebouw schilderen in {b} dagen. Na {d} dagen komen er {e} schilders bij. Hoeveel dagen duurt het werk dan nog?', bij: true, wie: 'schilders' },
          { t: '{a} schilders zouden een gebouw schilderen in {b} dagen. Na {d} dagen worden er {e} ziek. Hoeveel dagen duurt het werk dan nog?', bij: false, wie: 'schilders' },
          { t: 'Een voorraad voer is genoeg voor {a} paarden gedurende {b} dagen. Na {d} dagen worden er {e} paarden verkocht. Hoeveel dagen is het voer dan nog genoeg?', bij: false, wie: 'paarden' },
          { t: 'Een voorraad voer is genoeg voor {a} paarden gedurende {b} dagen. Na {d} dagen komen er {e} paarden bij. Hoeveel dagen is het voer dan nog genoeg?', bij: true, wie: 'paarden' },
        ]);
        const a = rnd(4, 15), b = rnd(10, 40), d = rnd(2, b - 4), e = rnd(2, ctx.bij ? 10 : a - 2), rest = b - d, nieuw = ctx.bij ? a + e : a - e;
        if (nieuw < 2 || (a * rest) % nieuw) return null; const w = a * rest / nieuw; if (w === rest) return null;
        const tekst = vul(ctx.t, { a, b, d, e });
        return { soort: 'tweestaps', opdracht: 'Los op in twee stappen.', html: `<p class="opgave-tekst">${tekst}</p>`, sleutel: tekst, rapport: tekst,
          antw: { soort: 'delen', delen: [{ label: `\\text{stap 1: wat overblijft, is voor ${a} ${ctx.wie} goed voor}`, antw: getal(rest, { voor: '', na: '\\text{ dagen}' }) },
            { label: `\\text{stap 2: met ${nieuw} ${ctx.wie} duurt het nog}`, antw: getal(w, { voor: '', na: '\\text{ dagen}' }) }] },
          uitleg: [`\\text{stap 1: } ${b} - ${d} = ${rest} \\text{ dagen voor ${a} ${ctx.wie}}`, `\\text{nu: } ${a} ${ctx.bij ? '+' : '-'} ${e} = ${nieuw} \\text{ ${ctx.wie} (omgekeerd evenredig)}`, `${rest} \\cdot ${a} : ${nieuw} = ${w} \\text{ dagen}`] };
      });
    } },
  },
  oefenMix: [['recht', 1], ['omgekeerd', 1], ['soortVerband', 1], ['tweestaps', 1]],
  test: [['recht', 2], ['omgekeerd', 2], ['soortVerband', 3], ['tweestaps', 3]], testSchudden: true,
};

// ---------------------------------------------------------------
// 13. Eindtest
// ---------------------------------------------------------------
const Q13 = {
  nr: 13, titel: 'Eindtest rekenen in ℚ +', kort: 'Alles door elkaar, op het niveau van ℚ +.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van ℚ + door elkaar, zonder rekentoestel. Herhaal gerust de theorie van een vorig deel.</p></div>${VOLGORDE}${BREUK_TYPEN}`,
  voorbeelden: [],
  soorten: { vo: mix(Q1, 'valstrik'), af: mix(Q2, 'breuk'), or: mix(Q3, 'ordenen'), pc: mix(Q4, 'naarBreuk'), md: mix(Q5, 'midden'), dr: mix(Q6, 'drie'), ke: mix(Q7, 'ketting'),
    mc: mix(Q8, 'macht'), wo: mix(Q8, 'wortel'), vg: mix(Q9, 'gemengd'), db: mix(Q10, 'gemengd') },
  oefenMix: [['vo', 1], ['af', 1], ['or', 1], ['pc', 1], ['md', 1], ['dr', 1], ['ke', 1], ['mc', 1], ['wo', 1], ['vg', 1], ['db', 1]],
  test: [['vo', 1], ['or', 1], ['pc', 1], ['md', 1], ['dr', 1], ['ke', 1], ['mc', 1], ['wo', 1], ['vg', 1], ['db', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'getallenleer-q-plus', titel: 'Rekenen in ℚ +', ondertitel: 'Getallenleer · 7VJHO · gevorderden', klas: '7VJHO', drempel: 70,
  intro: `<p>Je haalde een sterk resultaat op de instaptoets. Daarom werk je met de <b>+-versie</b>: dezelfde leerstof als Rekenen in ℚ, maar met moeilijkere oefeningen —
    valstrikken bij decimale vormen, drie breuken en ketens, negatieve exponenten, vierkante haakjes, procenten na elkaar en evenredigheden met kommagetallen.
    Enkel bij de delen over procenten en evenredigheden mag je je rekentoestel gebruiken.</p>
    <p>Lees de theorie (kijk zeker naar het kader <b>Extra uitdaging</b>), bekijk de voorbeelden, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Breuken en decimale getallen', delen: [1, 2, 3, 4, 5] }, { titel: 'B · Bewerkingen met breuken', delen: [6, 7, 8, 9, 10] }, { titel: 'C · Procenten en evenredigheden', delen: [11, 12] }, { titel: 'D · Eindtest', delen: [13] }],
  delen: [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13],
});
})();
