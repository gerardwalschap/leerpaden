// ===================================================================
//  REKENEN IN ℚ (7VJHO) — slaagdrempel 70%
// ===================================================================
// ---- kleine breukenrekenkern: [t, n] met n > 0, vereenvoudigd
const R = (t, n = 1) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return [t / g, n / g]; };
const Rplus = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const Rmin = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const Rmaal = (a, b) => R(a[0] * b[0], a[1] * b[1]);
const Rdeel = (a, b) => R(a[0] * b[1], a[1] * b[0]);
const Rmacht = (a, e) => e >= 0 ? R(a[0] ** e, a[1] ** e) : R(a[1] ** -e, a[0] ** -e);
const Rtex = (a) => fr(a[0], a[1]);
const Rh = (a) => a[0] < 0 ? `\\left(${Rtex(a)}\\right)` : Rtex(a);
const Rbr = (a, extra) => br(a[0], a[1], extra);
const Rteller = (n) => { let t; do { t = rnd(1, n - 1); } while (ggd(t, n) !== 1); return t; };
const Rwil = (nmax = 9, neg = true) => { const n = rnd(2, nmax), t = Rteller(n); return R(neg && kies([true, false]) ? -t : t, n); };
const BREUK_TYPEN = `<div class="kader"><div class="kader-titel">Zo typ je</div><p>Een breuk typ je met <code>/</code>: <code>-7/12</code> geeft $-\\frac{7}{12}$. Geef het antwoord altijd <b>onvereenvoudigbaar</b>; is het een geheel getal, typ dan gewoon dat getal.</p></div>`;

// ---- 1. decimale vormen
function decimaleVorm(t, n) { // t/n met n > 0, 0 < |t| < n niet vereist
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
const Q1 = {
  nr: 1, titel: 'Decimale vormen van breuken', kort: 'Begrensd, zuiver repeterend of gemengd repeterend?', rekenmachine: false,
  opdracht: 'Welke decimale vorm heeft deze breuk?',
  theorie: `<div class="kader def"><div class="kader-titel">Drie decimale vormen</div>
      <table class="tabel"><tr><th>vorm</th><th>voorbeeld</th><th>noemer (onvereenvoudigbaar) bevat</th></tr>
      <tr><td><b>begrensd</b></td><td>$\\frac{3}{8} = 0{,}375$</td><td>enkel factoren $2$ en/of $5$</td></tr>
      <tr><td><b>zuiver repeterend</b></td><td>$\\frac{5}{11} = 0{,}\\overline{45}$</td><td>geen factor $2$ of $5$</td></tr>
      <tr><td><b>gemengd repeterend</b></td><td>$\\frac{1}{6} = 0{,}1\\overline{6}$</td><td>een factor $2$ of $5$ én een andere factor</td></tr></table>
      <p>De streep staat boven de <b>periode</b>: de cijfers die zich steeds herhalen.</p></div>
    <div class="kader eig"><div class="kader-titel">Werkwijze</div>
      <ol><li>Vereenvoudig de breuk eerst.</li><li>Ontbind de noemer in priemfactoren.</li><li>Kijk welke factoren er zijn.</li></ol>
      <p class="klein">$\\frac{9}{12} = \\frac{3}{4}$ en $4 = 2 \\cdot 2$: begrensd ($0{,}75$).</p></div>`,
  voorbeelden: [
    { tex: '\\frac{7}{20}', stappen: ['20 = 2 \\cdot 2 \\cdot 5', '\\text{enkel 2 en 5: begrensd}', '= 0{,}35'] },
    { tex: '\\frac{4}{15}', stappen: ['15 = 3 \\cdot 5', '\\text{5 én 3: gemengd repeterend}', '= 0{,}2\\overline{6}'] },
  ],
  soorten: {
    vorm: { naam: 'Decimale vorm herkennen', gen() {
      const n = kies([4, 5, 8, 20, 25, 40, 3, 7, 9, 11, 27, 33, 6, 12, 15, 18, 22, 30, 35, 45]), t = Rteller(n), k = kies([1, 1, 2, 3]);
      const d = decimaleVorm(t, n);
      return { soort: 'vorm', tex: `${frRaw(t * k, n * k)}`, antw: keuze(VORMEN, d.soort),
        uitleg: [k > 1 ? `= ${fr(t, n)}` : `\\text{onvereenvoudigbaar}`, `${n} = ${factorTex(n)}`, `\\text{${VORM_NAAM[d.soort]}: } ${fr(t, n)} = ${d.tex}`] };
    } },
  },
  oefenMix: [['vorm', 1]],
  test: [['vorm', 10]], testSchudden: true,
};

// ---- 2. afronden
const Q2 = {
  nr: 2, titel: 'Afronden', kort: 'Kijk naar het eerstvolgende cijfer: 5 of meer, dan naar boven.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Afronden</div>
      <p>Kijk naar het cijfer <b>na</b> de laatste decimaal die je wil behouden.</p>
      <ul><li>$0, 1, 2, 3$ of $4$: naar beneden afronden (het cijfer blijft).</li><li>$5, 6, 7, 8$ of $9$: naar boven afronden (het cijfer wordt 1 groter).</li></ul>
      <p class="klein">$3{,}14159 \\approx 3{,}14$ (op 2 decimalen) &nbsp; · &nbsp; $2{,}7\\overline{6} = 2{,}7666\\ldots \\approx 2{,}777$ (op 3 decimalen) &nbsp; · &nbsp; $-1{,}4\\overline{9} \\approx -1{,}5$ (op 1 decimaal)</p></div>`,
  voorbeelden: [
    { tex: '\\text{Rond } 0{,}\\overline{36} \\text{ af op 3 decimalen.}', stappen: ['0{,}\\overline{36} = 0{,}36363\\ldots', '\\text{4de decimaal: 6, naar boven}', '\\approx 0{,}364'] },
    { tex: '\\text{Rond } \\frac{2}{7} \\text{ af op 2 decimalen.}', stappen: ['\\frac{2}{7} = 0{,}2857\\ldots', '\\approx 0{,}29'] },
  ],
  soorten: {
    decimaal: { naam: 'Een decimaal getal afronden', gen() {
      const d = rnd(0, 3), x = (kies([1, -1]) * rnd(1, 999999)) / 10 ** rnd(d + 2, 6); if (W.grensgeval(x, d)) return this.gen();
      return { soort: 'decimaal', opdracht: `Rond af op ${d === 0 ? 'een geheel getal' : d === 1 ? '1 decimaal' : d + ' decimalen'}.`, tex: `${tg(x)}`, antw: getal(x, { dec: d, voor: '\\approx' }), uitleg: [`\\approx ${tg(W.rond(x, d), d)}`] };
    } },
    repeterend: { naam: 'Een repeterend getal of breuk afronden', gen() {
      const n = kies([3, 6, 7, 9, 11, 12, 13, 15, 18, 22]), t = Rteller(n) + n * rnd(0, 3), d = rnd(1, 3), v = decimaleVorm(t, n);
      const alsBreuk = kies([true, false]), x = t / n;
      return { soort: 'repeterend', opdracht: `Rond af op ${d === 1 ? '1 decimaal' : d + ' decimalen'}.`, tex: alsBreuk ? fr(t, n) : v.tex, antw: getal(x, { dec: d, voor: '\\approx' }),
        uitleg: [`= ${x.toFixed(d + 3).replace('.', '{,}')}\\ldots`, `\\approx ${tg(W.rond(x, d), d)}`] };
    } },
  },
  oefenMix: [['decimaal', 1], ['repeterend', 1]],
  test: [['decimaal', 5], ['repeterend', 5]], testSchudden: true,
};

// ---- 3. vereenvoudigen, gelijknamig maken, ordenen
const Q3 = {
  nr: 3, titel: 'Vereenvoudigen en ordenen', kort: 'Teller en noemer delen door de ggd; gelijknamig maken om te vergelijken.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Vereenvoudigen</div>
      <p>Deel teller en noemer door hun <b>grootste gemeenschappelijke deler</b> (ggd): $\\frac{24}{36} = \\frac{24 : 12}{36 : 12} = \\frac{2}{3}$.</p>
      <p>Een breuk is <b>onvereenvoudigbaar</b> als de ggd van teller en noemer $1$ is.</p></div>
    <div class="kader def"><div class="kader-titel">Gelijknamig maken en vergelijken</div>
      <p>Zoek het <b>kleinste gemeenschappelijk veelvoud</b> (kgv) van de noemers: $\\frac{3}{4}$ en $\\frac{5}{6}$ &nbsp; → &nbsp; kgv$(4, 6) = 12$ &nbsp; → &nbsp; $\\frac{9}{12}$ en $\\frac{10}{12}$. Dus $\\frac{3}{4} < \\frac{5}{6}$.</p>
      <p class="klein">Bij negatieve breuken: $-\\frac{3}{4} > -\\frac{5}{6}$ (hoe verder naar links, hoe kleiner).</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\frac{-45}{60}', stappen: ['\\text{ggd}(45, 60) = 15', '= -\\frac{3}{4}'] },
    { tex: '\\text{Grootste van } \\frac{2}{3}, \\; \\frac{5}{8}, \\; \\frac{7}{12}', stappen: ['\\text{kgv}(3, 8, 12) = 24', '\\frac{16}{24}, \\; \\frac{15}{24}, \\; \\frac{14}{24}', '\\text{grootste: } \\frac{2}{3}'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Vereenvoudigen', gen() {
      const a = Rwil(12), k = rnd(2, 12);
      return { soort: 'vereenvoudig', opdracht: 'Vereenvoudig tot een onvereenvoudigbare breuk.', tex: frRaw(a[0] * k, a[1] * k), antw: Rbr(a), uitleg: [`\\text{ggd}(${Math.abs(a[0] * k)}, ${a[1] * k}) = ${ggd(a[0] * k, a[1] * k)}`, `= ${Rtex(a)}`] };
    } },
    ordenen: { naam: 'Kleinste of grootste breuk', gen() {
      const neg = kies([true, false]); let br3;
      do { br3 = [0, 1, 2].map(() => { const n = kies([2, 3, 4, 5, 6, 8, 9, 10, 12]); return R((neg ? -1 : 1) * Rteller(n), n); }); }
      while (new Set(br3.map(b => b[0] / b[1])).size < 3);
      const groot = kies([true, false]), w = br3.map(b => b[0] / b[1]), j = w.indexOf(groot ? Math.max(...w) : Math.min(...w));
      const L = br3.reduce((m, b) => kgv(m, b[1]), 1);
      return { soort: 'ordenen', opdracht: `Welke breuk is het ${groot ? 'grootst' : 'kleinst'}?`, tex: br3.map(Rtex).join(', \\quad '),
        antw: keuze(br3.map((b, i) => ({ k: String(i), l: Rtex(b) })), j),
        uitleg: [`\\text{kgv van de noemers: } ${L}`, br3.map(b => frRaw(b[0] * L / b[1], L)).join(', \\; '), `\\text{${groot ? 'grootste' : 'kleinste'}: } ${Rtex(br3[j])}`] };
    } },
  },
  oefenMix: [['vereenvoudig', 1], ['ordenen', 1]],
  test: [['vereenvoudig', 5], ['ordenen', 5]], testSchudden: true,
};

// ---- 4. breuken, decimale getallen en percentages
const Q4 = {
  nr: 4, titel: 'Breuken en percentages', kort: 'Procent betekent "per honderd".', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Percentages</div>
      <p>$p\\% = \\frac{p}{100}$. &nbsp; $35\\% = \\frac{35}{100} = \\frac{7}{20} = 0{,}35$</p>
      <p><b>Breuk naar percentage:</b> maak de noemer $100$: $\\frac{3}{4} = \\frac{75}{100} = 75\\%$ &nbsp; of reken: $3 : 4 = 0{,}75 = 75\\%$.</p>
      <p><b>Hoeveel procent is 12 van 48?</b> &nbsp; $\\frac{12}{48} = \\frac{1}{4} = 25\\%$</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\text{Schrijf } 45\\% \\text{ als breuk.}', stappen: ['= \\frac{45}{100}', '= \\frac{9}{20}'] },
    { tex: '\\text{Schrijf } \\frac{7}{25} \\text{ als percentage.}', stappen: ['= \\frac{28}{100}', '= 28\\%'] },
  ],
  soorten: {
    naarBreuk: { naam: 'Percentage → breuk', gen() { const p = kies([5, 15, 35, 45, 55, 65, 85, 95, 2, 4, 6, 8, 12, 16, 24, 28, 32, 36, 44, 48, 52, 64, 72, 75, 125, 150]); const a = R(p, 100);
      return { soort: 'naarBreuk', opdracht: 'Schrijf als onvereenvoudigbare breuk.', tex: `${p}\\%`, antw: Rbr(a), uitleg: [`= \\dfrac{${p}}{100}`, `= ${Rtex(a)}`] }; } },
    naarProcent: { naam: 'Breuk → percentage', gen() { const n = kies([2, 4, 5, 10, 20, 25, 50]), t = rnd(1, n * 3 / 2 | 0), p = t * 100 / n;
      return { soort: 'naarProcent', opdracht: 'Schrijf als percentage.', tex: frRaw(t, n), antw: getal(p, { na: '\\%' }), uitleg: [`= \\dfrac{${p}}{100}`, `= ${tg(p)}\\%`] }; } },
    hoeveel: { naam: 'Hoeveel procent?', gen() { const n = kies([2, 4, 5, 10, 20, 25, 50]), t = Rteller(n), m = rnd(2, 12), p = t * 100 / n;
      return { soort: 'hoeveel', opdracht: 'Hoeveel procent is het eerste getal van het tweede?', tex: `${t * m} \\text{ van } ${n * m}`, antw: getal(p, { na: '\\%' }), uitleg: [`\\dfrac{${t * m}}{${n * m}} = ${fr(t, n)}`, `= \\frac{${p}}{100} = ${tg(p)}\\%`] }; } },
  },
  oefenMix: [['naarBreuk', 1], ['naarProcent', 1], ['hoeveel', 1]],
  test: [['naarBreuk', 4], ['naarProcent', 3], ['hoeveel', 3]], testSchudden: true,
};

// ---- 5. getallenas in ℚ
const Q5 = {
  nr: 5, titel: 'Breuken op de getallenas', kort: 'Verdeel elke eenheid in evenveel gelijke stukjes.', rekenmachine: false,
  opdracht: 'Welke breuk stelt het punt A voor?',
  theorie: `<div class="kader def"><div class="kader-titel">Breuken op de getallenas</div>
      <p>De noemer zegt in hoeveel gelijke stukjes elke eenheid verdeeld is. Hieronder is elke eenheid in $4$ stukjes verdeeld.</p>
      ${getallenas([{ x: -5 / 4, label: 'A' }, { x: 3 / 4, label: 'B' }], -2, 2, { deel: 4 })}
      <p class="klein midden">$A = -\\frac{5}{4}$ (5 stukjes links van $0$) &nbsp; · &nbsp; $B = \\frac{3}{4}$</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { html: getallenas([{ x: 4 / 3, label: 'A' }], -2, 2, { deel: 3 }), stappen: ['\\text{eenheid in 3 stukjes}', '\\text{4 stukjes rechts van 0}', 'A = \\frac{4}{3}'] },
  ],
  soorten: {
    aflezen: { naam: 'Breuk aflezen', gen() {
      const d = kies([2, 3, 4, 5, 6]); let k; do { k = rnd(-2 * d + 1, 2 * d - 1); } while (k === 0 || k % d === 0);
      return { soort: 'aflezen', html: getallenas([{ x: k / d, label: 'A' }], -2, 2, { deel: d }), sleutel: `q${k}/${d}`, rapport: `A op ${k}/${d}`, antw: br(k, d, { voor: 'A =' }),
        uitleg: [`\\text{eenheid in ${d} stukjes, ${Math.abs(k)} stukjes ${k < 0 ? 'links' : 'rechts'} van 0}`, `A = ${frRaw(k, d)}${ggd(k, d) > 1 ? ` = ${fr(k, d)}` : ''}`] };
    } },
  },
  oefenMix: [['aflezen', 1]],
  test: [['aflezen', 10]], testSchudden: true,
};

// ---- 6. optellen en aftrekken
const Q6 = {
  nr: 6, titel: 'Breuken optellen en aftrekken', kort: 'Eerst gelijknamig maken, dan de tellers optellen.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Optellen en aftrekken</div>
      <ol><li>Maak de breuken <b>gelijknamig</b> (kgv van de noemers).</li><li>Tel de tellers op (of trek af), de noemer blijft.</li><li>Vereenvoudig.</li></ol>
      <p class="midden">$\\frac{5}{6} - \\frac{3}{4} = \\frac{10}{12} - \\frac{9}{12} = \\frac{1}{12}$</p>
      <p class="klein">De tekenregels van ℤ blijven gelden: $-\\frac{2}{3} - \\frac{1}{6} = -\\frac{4}{6} - \\frac{1}{6} = -\\frac{5}{6}$</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\frac{3}{8} + \\left(-\\frac{5}{6}\\right)', stappen: ['= \\frac{9}{24} - \\frac{20}{24}', '= -\\frac{11}{24}'] },
    { tex: '2 - \\frac{3}{5}', stappen: ['= \\frac{10}{5} - \\frac{3}{5}', '= \\frac{7}{5}'] },
  ],
  soorten: {
    som: { naam: 'Optellen en aftrekken', gen() {
      const a = kies([true, false, false]) ? R(z(-3, 3)) : Rwil(10), b = Rwil(12), plus = kies([true, false]), w = plus ? Rplus(a, b) : Rmin(a, b), L = kgv(a[1], b[1]);
      return { soort: 'som', tex: `${Rtex(a)} ${plus ? '+' : '-'} ${Rh(b)}`, antw: Rbr(w),
        uitleg: [`= ${frRaw(a[0] * L / a[1], L)} ${plus ? '+' : '-'} ${b[0] < 0 ? `\\left(${frRaw(b[0] * L / b[1], L)}\\right)` : frRaw(b[0] * L / b[1], L)}`, `= ${frRaw(a[0] * L / a[1] + (plus ? 1 : -1) * b[0] * L / b[1], L)}`, ...(w[1] === L ? [] : [`= ${Rtex(w)}`])] };
    } },
  },
  oefenMix: [['som', 1]],
  test: [['som', 10]], testSchudden: true,
};

// ---- 7. vermenigvuldigen en delen
const Q7 = {
  nr: 7, titel: 'Breuken vermenigvuldigen en delen', kort: 'Teller maal teller, noemer maal noemer. Delen = vermenigvuldigen met het omgekeerde.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Vermenigvuldigen</div>
      <p>$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$ &nbsp; · &nbsp; vereenvoudig liefst al vóór je vermenigvuldigt: $\\frac{4}{9} \\cdot \\frac{3}{8} = \\frac{\\cancel{4} \\cdot \\cancel{3}}{\\cancel{9} \\cdot \\cancel{8}} = \\frac{1}{6}$</p></div>
    <div class="kader def"><div class="kader-titel">Delen</div>
      <p>Delen door een breuk = vermenigvuldigen met het <b>omgekeerde</b>: $\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$</p>
      <p class="klein">$-\\frac{2}{5} : \\frac{4}{15} = -\\frac{2}{5} \\cdot \\frac{15}{4} = -\\frac{30}{20} = -\\frac{3}{2}$ &nbsp; (tekenregel van ℤ!)</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '-\\frac{6}{7} \\cdot \\left(-\\frac{14}{9}\\right)', stappen: ['= \\frac{6 \\cdot 14}{7 \\cdot 9}', '= \\frac{84}{63}', '= \\frac{4}{3}'] },
    { tex: '3 : \\frac{9}{4}', stappen: ['= 3 \\cdot \\frac{4}{9}', '= \\frac{12}{9} = \\frac{4}{3}'] },
  ],
  soorten: {
    maal: { naam: 'Vermenigvuldigen', gen() { const a = Rwil(10), b = Rwil(12), w = Rmaal(a, b);
      return { soort: 'maal', tex: `${Rtex(a)} \\cdot ${Rh(b)}`, antw: Rbr(w), uitleg: [`= ${frRaw(a[0] * b[0], a[1] * b[1])}`, `= ${Rtex(w)}`] }; } },
    deel: { naam: 'Delen', gen() { const a = kies([true, false, false]) ? R(z(-6, 6)) : Rwil(10), b = Rwil(10), w = Rdeel(a, b), o = R(b[1], b[0]);
      return { soort: 'deel', tex: `${Rtex(a)} : ${Rh(b)}`, antw: Rbr(w), uitleg: [`= ${Rtex(a)} \\cdot ${Rh(o)}`, `= ${frRaw(a[0] * o[0], a[1] * o[1])}`, `= ${Rtex(w)}`] }; } },
  },
  oefenMix: [['maal', 1], ['deel', 1]],
  test: [['maal', 5], ['deel', 5]], testSchudden: true,
};

// ---- 8. machten, wortels en rekenregels in ℚ
const Q8 = {
  nr: 8, titel: 'Machten en wortels van breuken', kort: 'Teller en noemer apart; negatieve exponent = omgekeerde.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `<div class="kader def"><div class="kader-titel">Machten van breuken</div>
      <p>$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$: &nbsp; $\\left(-\\frac{2}{3}\\right)^3 = -\\frac{8}{27}$ &nbsp; · &nbsp; $-\\left(\\frac{3}{4}\\right)^2 = -\\frac{9}{16}$</p>
      <p><b>Negatieve exponent:</b> neem het omgekeerde. &nbsp; $\\left(\\frac{2}{5}\\right)^{-2} = \\left(\\frac{5}{2}\\right)^2 = \\frac{25}{4}$ &nbsp; · &nbsp; $3^{-2} = \\frac{1}{9}$</p></div>
    <div class="kader def"><div class="kader-titel">Wortels van breuken</div>
      <p>$\\sqrt{\\frac{9}{16}} = \\frac{3}{4}$ &nbsp; · &nbsp; $\\sqrt[3]{-\\frac{8}{27}} = -\\frac{2}{3}$</p></div>
    <div class="kader eig"><div class="kader-titel">De rekenregels gelden ook in ℚ</div>
      <p>$\\left(\\frac{2}{3}\\right)^5 \\cdot \\left(\\frac{2}{3}\\right)^{-3} = \\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$ &nbsp; · &nbsp; $\\left(\\left(\\frac{1}{2}\\right)^2\\right)^3 = \\left(\\frac{1}{2}\\right)^6 = \\frac{1}{64}$</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\left(-\\frac{3}{2}\\right)^{-3}', stappen: ['= \\left(-\\frac{2}{3}\\right)^3', '= -\\frac{8}{27}'] },
    { tex: '\\left(\\frac{3}{4}\\right)^7 : \\left(\\frac{3}{4}\\right)^5', stappen: ['= \\left(\\frac{3}{4}\\right)^{7-5} = \\left(\\frac{3}{4}\\right)^2', '= \\frac{9}{16}'] },
  ],
  soorten: {
    macht: { naam: 'Machten', gen() {
      const n = rnd(2, 5), t = Rteller(n) * kies([1, -1]), a = R(t, n), e = Math.abs(t) <= 2 && n <= 4 ? rnd(2, 4) : rnd(2, 3), neg = kies([false, false, true]), voor = kies([false, false, true]);
      const ee = neg ? -e : e, w0 = Rmacht(a, ee), w = voor ? R(-w0[0], w0[1]) : w0;
      return { soort: 'macht', tex: `${voor ? '-' : ''}\\left(${Rtex(a)}\\right)^{${ee}}`, antw: Rbr(w), uitleg: [neg ? `= ${voor ? '-' : ''}\\left(${Rtex(R(a[1], a[0]))}\\right)^{${e}}` : `= ${voor ? '-' : ''}\\dfrac{${h(a[0])}^{${e}}}{${a[1]}^{${e}}}`, `= ${Rtex(w)}`] };
    } },
    wortel: { naam: 'Wortels', gen() {
      const derde = kies([true, false]), n = derde ? rnd(2, 5) : rnd(2, 12), t = Rteller(n), neg = derde && kies([true, false]), a = R(neg ? -t : t, n), p = derde ? 3 : 2;
      return { soort: 'wortel', tex: `${derde ? '\\sqrt[3]' : '\\sqrt'}{${neg ? '-' : ''}\\dfrac{${t ** p}}{${n ** p}}}`, antw: Rbr(a), uitleg: [`${Rh(a)}^${p} = ${fr(a[0] ** p, n ** p)}`, `= ${Rtex(a)}`] };
    } },
    regels: { naam: 'Rekenregels met machten', gen() {
      const n = rnd(2, 5), a = R(Rteller(n) * kies([1, -1]), n);
      const v = kies(['maal', 'deel', 'machtmacht']);
      let tex, e, L;
      if (v === 'maal') { const m = rnd(3, 7), k = kies([-(m - 1), -(m - 2), -(m - 3)].filter(x => m + x >= 1 && m + x <= 3)); e = m + k; tex = `\\left(${Rtex(a)}\\right)^{${m}} \\cdot \\left(${Rtex(a)}\\right)^{${k}}`; L = `${m} + (${k}) = ${e}`; }
      else if (v === 'deel') { const k = rnd(2, 6); e = kies([1, 2, 3, -1, -2]); const m = k + e; tex = `\\left(${Rtex(a)}\\right)^{${m}} : \\left(${Rtex(a)}\\right)^{${k}}`; L = `${m} - ${k} = ${e}`; }
      else { const p = kies([1, 2, 3]), q = p === 1 ? kies([2, 3]) : kies([1, -1, 2].filter(x => Math.abs(p * x) <= (Math.abs(a[0]) <= 2 && n <= 3 ? 6 : 3))); e = p * q; tex = `\\left(\\left(${Rtex(a)}\\right)^{${p}}\\right)^{${q}}`; L = `${p} \\cdot ${h(q)} = ${e}`; }
      const w = Rmacht(a, e);
      return { soort: 'regels', opdracht: 'Bereken met de rekenregels van machten.', tex, antw: Rbr(w), uitleg: [`\\text{exponent: } ${L}`, `= \\left(${Rtex(a)}\\right)^{${e}}`, `= ${Rtex(w)}`] };
    } },
  },
  oefenMix: [['macht', 2], ['wortel', 1], ['regels', 2]],
  test: [['macht', 4], ['wortel', 2], ['regels', 4]], testSchudden: true,
};

// ---- 9. volgorde van de bewerkingen in ℚ
const QV = [
  () => { const a = Rwil(6), b = Rwil(6), c = Rwil(6); return { tex: `${Rtex(a)} + ${Rh(b)} \\cdot ${Rh(c)}`, w: Rplus(a, Rmaal(b, c)), L: [`= ${Rtex(a)} + ${Rh(Rmaal(b, c))}`] }; },
  () => { const a = Rwil(6), b = Rwil(6), c = Rwil(5); const s = Rmin(a, b); if (!s[0]) return null; return { tex: `\\left(${Rtex(a)} - ${Rh(b)}\\right) : ${Rh(c)}`, w: Rdeel(s, c), L: [`= ${Rh(s)} : ${Rh(c)}`] }; },
  () => { const a = Rwil(5), b = Rwil(6); const k = Rmacht(a, 2); return { tex: `\\left(${Rtex(a)}\\right)^2 - ${Rh(b)}`, w: Rmin(k, b), L: [`= ${Rtex(k)} - ${Rh(b)}`] }; },
  () => { const a = Rwil(6), n = rnd(2, 9), t = Rteller(n), r = R(t, n); return { tex: `${Rtex(a)} - \\sqrt{\\dfrac{${t * t}}{${n * n}}}`, w: Rmin(a, r), L: [`= ${Rtex(a)} - ${Rtex(r)}`] }; },
  () => { const a = R(z(-4, 4)), b = Rwil(6), c = Rwil(6); return { tex: `${Rtex(a)} \\cdot ${Rh(b)} - ${Rh(c)}`, w: Rmin(Rmaal(a, b), c), L: [`= ${Rtex(Rmaal(a, b))} - ${Rh(c)}`] }; },
  () => { const a = Rwil(5, false), b = Rwil(5); const s = Rplus(R(1), a); return { tex: `\\left(1 + ${Rtex(a)}\\right)^2 \\cdot ${Rh(b)}`, w: Rmaal(Rmacht(s, 2), b), L: [`= \\left(${Rtex(s)}\\right)^2 \\cdot ${Rh(b)}`, `= ${Rtex(Rmacht(s, 2))} \\cdot ${Rh(b)}`] }; },
];
const Q9 = {
  nr: 9, titel: 'Volgorde van de bewerkingen in ℚ', kort: 'Dezelfde volgorde als in ℕ en ℤ, nu met breuken.', rekenmachine: false,
  opdracht: 'Bereken en vereenvoudig.',
  theorie: `${VOLGORDE}<div class="kader werk"><div class="kader-titel">Voorbeeld</div>
    <p class="midden">$\\frac{1}{2} + \\frac{3}{4} \\cdot \\left(-\\frac{2}{3}\\right) = \\frac{1}{2} + \\left(-\\frac{1}{2}\\right) = 0$</p>
    <p class="klein">Eerst vermenigvuldigen, dan optellen.</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '\\left(\\frac{2}{3} - \\frac{1}{2}\\right) : \\frac{5}{6}', stappen: ['= \\frac{1}{6} : \\frac{5}{6}', '= \\frac{1}{6} \\cdot \\frac{6}{5}', '= \\frac{1}{5}'] },
  ],
  soorten: {
    gemengd: { naam: 'Bewerkingen met volgorde', gen() { for (;;) { const r = kies(QV)(); if (!r || Math.abs(r.w[0]) > 200 || r.w[1] > 200) continue; return { soort: 'gemengd', tex: r.tex, antw: Rbr(r.w), uitleg: [...r.L, `= ${Rtex(r.w)}`] }; } } },
  },
  oefenMix: [['gemengd', 1]],
  test: [['gemengd', 10]], testSchudden: true,
};

// ---- 10. decimaal getal naar breuk
const Q10 = {
  nr: 10, titel: 'Van decimaal getal naar breuk', kort: 'Begrensd: noemer 10, 100, … Repeterend: met 9-en en 0-en.', rekenmachine: false,
  opdracht: 'Schrijf als onvereenvoudigbare breuk.',
  theorie: `<div class="kader def"><div class="kader-titel">Begrensd decimaal getal</div>
      <p>Zoveel decimalen, zoveel nullen in de noemer: $0{,}35 = \\frac{35}{100} = \\frac{7}{20}$ &nbsp; · &nbsp; $1{,}2 = \\frac{12}{10} = \\frac{6}{5}$</p></div>
    <div class="kader def"><div class="kader-titel">Zuiver repeterend</div>
      <p>Teller: de periode. Noemer: zoveel <b>9-en</b> als de periode cijfers heeft.</p>
      <p class="midden">$0{,}\\overline{27} = \\frac{27}{99} = \\frac{3}{11}$</p></div>
    <div class="kader def"><div class="kader-titel">Gemengd repeterend: 3 stappen</div>
      <ol><li><b>Teller:</b> alle cijfers na de komma tot en met de eerste periode, min de cijfers vóór de periode: $0{,}1\\overline{6} \\to 16 - 1 = 15$.</li>
      <li><b>Noemer:</b> een 9 per cijfer van de periode, gevolgd door een 0 per cijfer vóór de periode: $90$.</li>
      <li><b>Vereenvoudig:</b> $\\frac{15}{90} = \\frac{1}{6}$.</li></ol>
      <p class="klein">Staat er een geheel deel vóór de komma (bv. $2{,}\\overline{3}$), schrijf dan $2 + \\frac{3}{9} = \\frac{7}{3}$.</p></div>${BREUK_TYPEN}`,
  voorbeelden: [
    { tex: '0{,}\\overline{6}', stappen: ['= \\frac{6}{9}', '= \\frac{2}{3}'] },
    { tex: '0{,}4\\overline{18}', stappen: ['\\text{teller: } 418 - 4 = 414', '\\text{noemer: } 990', '= \\frac{414}{990} = \\frac{23}{55}'] },
  ],
  soorten: {
    begrensd: { naam: 'Begrensd', gen() { const d = rnd(1, 3), x = rnd(1, 10 ** d * 2) * (kies([1, 1, -1])); if (x % 10 === 0) return this.gen(); const a = R(x, 10 ** d);
      return { soort: 'begrensd', tex: tg(x / 10 ** d), antw: Rbr(a), uitleg: [`= ${frRaw(x, 10 ** d)}`, `= ${Rtex(a)}`] }; } },
    zuiver: { naam: 'Zuiver repeterend', gen() { const l = kies([1, 1, 2, 2, 3]), q = 10 ** l - 1; let p; do { p = rnd(1, q - 1); } while (l > 1 && String(p).padStart(l, '0').split('').every(c => c === String(p).padStart(l, '0')[0]));
      const ps = String(p).padStart(l, '0'), a = R(p, q);
      return { soort: 'zuiver', tex: `0{,}\\overline{${ps}}`, antw: Rbr(a), uitleg: [`= \\dfrac{${p}}{${q}}`, `= ${Rtex(a)}`] }; } },
    gemengd: { naam: 'Gemengd repeterend', gen() { const v = rnd(1, 9), l = kies([1, 1, 2]), q = 10 ** l - 1; let p; do { p = rnd(1, q - 1); } while (l > 1 && String(p).padStart(2, '0')[0] === String(p).padStart(2, '0')[1]);
      const ps = String(p).padStart(l, '0'); if (ps[l - 1] === String(v)) return this.gen();
      const teller = Number(String(v) + ps) - v, noemer = q * 10, a = R(teller, noemer);
      return { soort: 'gemengd', tex: `0{,}${v}\\overline{${ps}}`, antw: Rbr(a), uitleg: [`\\text{teller: } ${v}${ps} - ${v} = ${teller}`, `\\text{noemer: } ${noemer}`, `= \\dfrac{${teller}}{${noemer}} = ${Rtex(a)}`] }; } },
  },
  oefenMix: [['begrensd', 1], ['zuiver', 1], ['gemengd', 1]],
  test: [['begrensd', 3], ['zuiver', 3], ['gemengd', 4]], testSchudden: true,
};

// ---- 11. vraagstukken met procenten (rekentoestel)
const euro = (x) => Math.round(x * 100) / 100;
const QPV = [
  () => { const p = euro(rnd(1000, 30000) / 100), b = kies([6, 21]); const w = euro(p * (1 + b / 100));
    return { tekst: `Een artikel kost € ${naarTekst(p)} zonder btw. Er komt ${b}% btw bij. Wat is de prijs met btw?`, w, dec: 2, na: '\\text{ euro}', L: [vtTex(['%', 'euro'], [['100', tg(p)], [String(100 + b), `${tg(p)} \\cdot ${tg((100 + b) / 100)}`]]), `= ${tg(w, 2)} \\text{ euro}`] }; },
  () => { const p = euro(rnd(2000, 20000) / 100), k = kies([15, 20, 30, 35, 40, 12]); const w = euro(p * (1 - k / 100));
    return { tekst: `Een jas kost € ${naarTekst(p)}. In de solden krijg je ${k}% korting. Hoeveel betaal je?`, w, dec: 2, na: '\\text{ euro}', L: [`\\text{je betaalt } ${100 - k}\\%`, vtTex(['%', 'euro'], [['100', tg(p)], [String(100 - k), `${tg(p)} \\cdot ${tg((100 - k) / 100)}`]]), `= ${tg(w, 2)} \\text{ euro}`] }; },
  () => { const oud = rnd(40, 400), nieuw = oud + rnd(3, Math.round(oud / 2)), w = (nieuw - oud) / oud * 100;
    return { tekst: `De prijs van een abonnement stijgt van € ${oud} naar € ${nieuw}. Met hoeveel procent is de prijs gestegen? Rond af op 1 decimaal.`, w, dec: 1, na: '\\%', L: [`\\text{stijging: } ${nieuw} - ${oud} = ${nieuw - oud} \\text{ euro}`, vtTex(['euro', '%'], [[oud, '100'], [nieuw - oud, `\\frac{${nieuw - oud}}{${oud}} \\cdot 100`]]), `\\approx ${tg(W.rond(w, 1), 1)}\\%`] }; },
  () => { const na = euro(rnd(2000, 30000) / 100), k = kies([10, 20, 25, 40, 50]), w = euro(na / (1 - k / 100));
    return { tekst: `Na ${k}% korting betaal je € ${naarTekst(na)}. Wat was de oorspronkelijke prijs? Rond af op de cent.`, w, dec: 2, na: '\\text{ euro}', L: [`${tg(na)} \\text{ euro is } ${100 - k}\\%`, vtTex(['%', 'euro'], [[String(100 - k), tg(na)], ['1', `${tg(na)} : ${100 - k}`], ['100', `${tg(na)} : ${100 - k} \\cdot 100`]]), `\\approx ${tg(w, 2)} \\text{ euro}`] }; },
  () => { const n = rnd(18, 32), d = rnd(2, n - 4), w = d / n * 100;
    return { tekst: `In een klas van ${n} leerlingen dragen er ${d} een bril. Hoeveel procent is dat? Rond af op 1 decimaal.`, w, dec: 1, na: '\\%', L: [vtTex(['leerlingen', '%'], [[n, '100'], [d, `\\frac{${d}}{${n}} \\cdot 100`]]), `\\approx ${tg(W.rond(w, 1), 1)}\\%`] }; },
];
const Q11 = {
  nr: 11, titel: 'Vraagstukken met procenten', kort: 'Verhoudingstabel en rekentoestel.', rekenmachine: true,
  opdracht: 'Los op met een verhoudingstabel. Je mag je rekentoestel gebruiken.',
  theorie: `${PROCENTEN}<div class="kader eig"><div class="kader-titel">Met het rekentoestel</div>
      <ul><li>$21\\%$ erbij = $121\\%$ van de prijs: vermenigvuldig met $1{,}21$.</li><li>$15\\%$ korting = je betaalt $85\\%$: vermenigvuldig met $0{,}85$.</li>
      <li>Hoeveel procent? &nbsp; $\\frac{\\text{deel}}{\\text{geheel}} \\cdot 100$</li><li>Oorspronkelijke prijs: deel door het percentage en vermenigvuldig met $100$.</li></ul></div>`,
  voorbeelden: [
    { tex: '\\text{84 euro zonder btw, 21\\% btw. Prijs met btw?}', stappen: [vtTex(['%', 'euro'], [['100', '84'], ['121', '84 \\cdot 1{,}21']]), '= 101{,}64 \\text{ euro}'] },
  ],
  soorten: {
    vraagstuk: { naam: 'Vraagstukken met procenten', gen() { const r = kies(QPV)(); if (W.grensgeval(r.w, r.dec)) return this.gen();
      return { soort: 'vraagstuk', html: `<p class="opgave-tekst">${r.tekst}</p>`, sleutel: r.tekst, rapport: r.tekst, antw: getal(r.w, { dec: r.dec, na: r.na }), uitleg: r.L }; } },
  },
  oefenMix: [['vraagstuk', 1]],
  test: [['vraagstuk', 10]], testSchudden: true,
};

// ---- 12. evenredigheden
const Q12 = {
  nr: 12, titel: 'Evenredigheden', kort: 'Recht of omgekeerd evenredig? Los op met een verhoudingstabel.', rekenmachine: true,
  theorie: EVENREDIG,
  voorbeelden: N5.voorbeelden,
  soorten: { soortVerband: N5.soorten.soortVerband, recht: N5.soorten.recht, omgekeerd: N5.soorten.omgekeerd },
  oefenMix: [['recht', 2], ['omgekeerd', 2], ['soortVerband', 1]],
  test: [['recht', 3], ['omgekeerd', 3], ['soortVerband', 4]], testSchudden: true,
};

const Q13 = {
  nr: 13, titel: 'Eindtest rekenen in ℚ', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van ℚ door elkaar, zonder rekentoestel. Herhaal gerust de theorie van een vorig deel.</p></div>${BREUK_TYPEN}`,
  voorbeelden: [],
  soorten: { vo: mix(Q1, 'vorm'), af: mix(Q2, 'repeterend'), ve: mix(Q3, 'vereenvoudig'), or: mix(Q3, 'ordenen'), pc: mix(Q4, 'naarBreuk'), as: mix(Q5, 'aflezen'), so: mix(Q6, 'som'), ma: mix(Q7, 'maal'), de: mix(Q7, 'deel'), mc: mix(Q8, 'macht'), rg: mix(Q8, 'regels'), vg: mix(Q9, 'gemengd'), db: mix(Q10, 'gemengd') },
  oefenMix: [['vo', 1], ['af', 1], ['ve', 1], ['or', 1], ['pc', 1], ['as', 1], ['so', 1], ['ma', 1], ['de', 1], ['mc', 1], ['rg', 1], ['vg', 1], ['db', 1]],
  test: [['vo', 1], ['ve', 1], ['pc', 1], ['as', 1], ['so', 1], ['de', 1], ['mc', 1], ['rg', 1], ['vg', 1], ['db', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'getallenleer-q', titel: 'Rekenen in ℚ', ondertitel: 'Getallenleer · 7VJHO', klas: '7VJHO', drempel: 70,
  intro: `<p>Je leert rekenen met rationale getallen (breuken): decimale vormen, afronden, vereenvoudigen en ordenen, percentages, breuken op de getallenas,
    de vier hoofdbewerkingen, machten en wortels, decimale getallen omzetten naar breuken, en vraagstukken met procenten en evenredigheden.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Breuken en decimale getallen', delen: [1, 2, 3, 4, 5] }, { titel: 'B · Bewerkingen met breuken', delen: [6, 7, 8, 9, 10] }, { titel: 'C · Procenten en evenredigheden', delen: [11, 12] }, { titel: 'D · Eindtest', delen: [13] }],
  delen: [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13],
});
