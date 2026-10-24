// Programma 'remediering-vergelijkingen' — automatisch samengevoegd uit bron/remediering-vergelijkingen/ (niet rechtstreeks bewerken)
(() => {
// ===== Remediëring eerstegraadsvergelijkingen (4DOF) — hulpmiddelen =====
const { rnd, kies } = W;
const tg = (x) => W.texGetal(x);
const ggd = W.ggd;
const kgv = (a, b) => a / ggd(a, b) * b;
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };

// a·x als (eerste) term, of met teken ervoor
const tx = (c, eerste = true) => { const k = Math.abs(c) === 1 ? 'x' : `${tg(Math.abs(c))}x`; return eerste ? (c < 0 ? `-${k}` : k) : (c < 0 ? ` - ${k}` : ` + ${k}`); };
// constante met teken ervoor (of niets bij 0)
const tc = (c) => c === 0 ? '' : c < 0 ? ` - ${tg(-c)}` : ` + ${tg(c)}`;
// a·x + b
const lin = (a, b) => a === 0 ? tg(b) : `${tx(a)}${tc(b)}`;
// getal + a·x  (bv. 5 - 2x)
const linCx = (b, a) => `${tg(b)}${tx(a, false)}`;

// oplossing x = p/q
const exact2 = (w) => Math.abs(W.rond(w, 2) - w) < 1e-12;
function opl(p, q) {
  if (q < 0) { p = -p; q = -q; }
  const g = ggd(p, q) || 1; p /= g; q /= g;
  const w = p / q;
  return { p, q, w, exact: exact2(w), V: `V = \\{${tg(W.rond(w, 2))}\\}`, antw: { soort: 'V', waarde: w, dec: 2 } };
}
const veilig = (p, q) => q !== 0 && !W.grensgeval(p / q, 2);
// lijnen voor de uitleg: eerste lijn = vergelijking, daarna ⇔ ...
const stap = (tex, hint) => `\\Leftrightarrow\\; ${tex}${hint ? `\\qquad \\text{\\small ${hint}}` : ''}`;
// laatste stappen vanaf  A·x = B  (A, B gehele getallen, A ≠ 0)
function slot(A, B, L, hint = true) {
  const o = opl(B, A);
  if (A === -1) L.push(stap(`x = ${tg(-B)}`, hint ? '(beide leden maal -1)' : ''));
  else if (A !== 1) {
    const uit = o.q === 1 ? ` = ${tg(o.w)}` : ` ${o.exact ? '=' : '\\approx'} ${tg(W.rond(o.w, 2))}`;
    L.push(stap(`x = \\frac{${tg(B)}}{${tg(A)}}${uit}`, hint ? `(beide leden delen door ${A < 0 ? '(' + tg(A) + ')' : tg(A)})` : ''));
  }
  L.push(o.V);
  return o;
}
const vraag = (soort, tex, o, L, extra = {}) => ({ soort, tex, antw: o.antw, uitleg: L, ...extra });
const metSp = (v) => { v.antw = { ...v.antw, metSpeciaal: true }; return v; };

const REGELS = `<div class="kader def"><div class="kader-titel">De twee regels (balansmethode)</div>
  <ul><li>Beide leden mogen met <b>hetzelfde getal of dezelfde term</b> vermeerderd of verminderd worden.</li>
  <li>Beide leden mogen met <b>hetzelfde getal ($\\neq 0$)</b> vermenigvuldigd of gedeeld worden.</li></ul>
  <p class="klein">Wat je links doet, doe je ook rechts. Zo blijft de vergelijking in evenwicht.</p></div>`;
const NOTEER = `<div class="kader"><div class="kader-titel">Zo noteer je je antwoord</div>
  <p>Je schrijft de oplossing altijd als <b>oplossingenverzameling</b>: $V = \\{\\ldots\\}$. Bv. $x = 7$ geeft $V = \\{7\\}$.</p>
  <p>In het vakje tussen de accolades typ je enkel het getal: <code>7</code>, <code>-3</code> of een kommagetal <code>2,33</code>.
  Is de oplossing geen mooi getal? Rond dan <b>juist af op 2 cijfers na de komma</b>.</p></div>`;
const OPDRACHT = 'Los op. Noteer de oplossing als V = {…}.';
// ===================================================================
//  Stap 1 — x + a = b
// ===================================================================
const D1 = {
  nr: 1, titel: 'x + a = b', kort: 'Een getal bij x opgeteld: trek het af in beide leden.', rekenmachine: false, opdracht: OPDRACHT,
  theorie: `${REGELS}
    <div class="kader werk"><div class="kader-titel">Een getal bij x opgeteld</div>
      <p>Staat er $+\\,5$ bij de $x$? Trek dan in beide leden $5$ af. Zo blijft $x$ alleen over.</p>
      <p class="midden">$x + 5 = 12 \\;\\Leftrightarrow\\; x + 5 - 5 = 12 - 5 \\;\\Leftrightarrow\\; x = 7$</p>
      <p>Kort genoteerd: het getal verhuist naar de andere kant en krijgt het <b>tegengestelde teken</b>: $x = 12 - 5 = 7$.</p>
      <p><b>Controle:</b> vul je oplossing in: $7 + 5 = 12$ ✓. &nbsp; Oplossing: $V = \\{7\\}$</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: 'x + 4 = 9', stappen: ['x = 9 - 4 \\qquad \\text{(4 aftrekken in beide leden)}', 'x = 5', '\\text{controle: } 5 + 4 = 9 \\;✓', 'V = \\{5\\}'] },
    { tex: '8 + x = 20', stappen: ['x = 20 - 8', 'x = 12', 'V = \\{12\\}'] },
    { tex: 'x + 6 = 6', stappen: ['x = 6 - 6', 'x = 0', 'V = \\{0\\}'] },
  ],
  soorten: {
    plus: { naam: 'x + a = b', gen() { const x = rnd(0, 20), a = rnd(1, 15), b = x + a; const o = opl(x, 1);
      return vraag('plus', `x + ${a} = ${b}`, o, [`x + ${a} = ${b}`, stap(`x = ${b} - ${a}`, `(${a} aftrekken in beide leden)`), stap(`x = ${x}`), `\\text{controle: } ${x} + ${a} = ${b} \\;✓`, o.V]); } },
    plusvoor: { naam: 'a + x = b', gen() { const x = rnd(0, 20), a = rnd(1, 15), b = x + a; const o = opl(x, 1);
      return vraag('plusvoor', `${a} + x = ${b}`, o, [`${a} + x = ${b}`, stap(`x = ${b} - ${a}`, `(${a} aftrekken in beide leden)`), stap(`x = ${x}`), o.V]); } },
  },
  oefenMix: [['plus', 2], ['plusvoor', 1]],
  test: [['plus', 5], ['plusvoor', 5]], testSchudden: true,
};

// ===================================================================
//  Stap 2 — x − a = b en negatieve oplossingen
// ===================================================================
const D2 = {
  nr: 2, titel: 'x − a = b en negatieve oplossingen', kort: 'Een getal van x afgetrokken: tel het op in beide leden.', rekenmachine: false, opdracht: OPDRACHT,
  theorie: `${REGELS}
    <div class="kader werk"><div class="kader-titel">Een getal van x afgetrokken</div>
      <p>Staat er $-\\,3$ bij de $x$? Tel dan in beide leden $3$ op.</p>
      <p class="midden">$x - 3 = 8 \\;\\Leftrightarrow\\; x = 8 + 3 \\;\\Leftrightarrow\\; x = 11$</p></div>
    <div class="kader eig"><div class="kader-titel">De oplossing mag negatief zijn</div>
      <p class="midden">$x + 9 = 4 \\;\\Leftrightarrow\\; x = 4 - 9 \\;\\Leftrightarrow\\; x = -5$ &nbsp; dus $V = \\{-5\\}$</p>
      <p class="klein">Controle: $-5 + 9 = 4$ ✓. Typ een negatief getal met een minteken: <code>-5</code>.</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: 'x - 7 = 2', stappen: ['x = 2 + 7 \\qquad \\text{(7 optellen in beide leden)}', 'x = 9', 'V = \\{9\\}'] },
    { tex: 'x + 10 = 3', stappen: ['x = 3 - 10', 'x = -7', '\\text{controle: } -7 + 10 = 3 \\;✓', 'V = \\{-7\\}'] },
    { tex: 'x - 4 = -6', stappen: ['x = -6 + 4', 'x = -2', 'V = \\{-2\\}'] },
  ],
  soorten: {
    min: { naam: 'x − a = b', gen() { const x = rnd(-8, 20), a = rnd(1, 15), b = x - a; const o = opl(x, 1);
      return vraag('min', `x - ${a} = ${b}`, o, [`x - ${a} = ${b}`, stap(`x = ${b} + ${a}`, `(${a} optellen in beide leden)`), stap(`x = ${x}`), `\\text{controle: } ${h(x)} - ${a} = ${b} \\;✓`, o.V]); } },
    neg: { naam: 'Negatieve oplossing', gen() { const x = -rnd(1, 15), a = rnd(1, 15), b = x + a; const o = opl(x, 1);
      return vraag('neg', `x + ${a} = ${b}`, o, [`x + ${a} = ${b}`, stap(`x = ${b} - ${a}`, `(${a} aftrekken in beide leden)`), stap(`x = ${x}`), `\\text{controle: } ${x} + ${a} = ${b} \\;✓`, o.V]); } },
  },
  oefenMix: [['min', 1], ['neg', 1]],
  test: [['min', 5], ['neg', 5]], testSchudden: true,
};

// ===================================================================
//  Stap 3 — a·x = b
// ===================================================================
const D3 = {
  nr: 3, titel: 'a · x = b', kort: 'Een getal maal x: deel beide leden door dat getal.', rekenmachine: false, opdracht: OPDRACHT,
  theorie: `${REGELS}
    <div class="kader werk"><div class="kader-titel">Een getal maal x</div>
      <p>$3x$ betekent $3 \\cdot x$. Om $x$ alleen te krijgen, <b>deel</b> je beide leden door $3$.</p>
      <p class="midden">$3x = 12 \\;\\Leftrightarrow\\; x = \\frac{12}{3} \\;\\Leftrightarrow\\; x = 4$</p></div>
    <div class="kader eig"><div class="kader-titel">Let op het teken</div>
      <p>$-2x = 10 \\;\\Leftrightarrow\\; x = \\frac{10}{-2} = -5$ &nbsp;·&nbsp; $-x = 6 \\;\\Leftrightarrow\\; x = -6$ &nbsp;<span class="klein">($-x$ betekent $-1 \\cdot x$)</span></p>
      <p class="klein">Tekenregel: plus gedeeld door min = min, min gedeeld door min = plus.</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '5x = 35', stappen: ['x = \\frac{35}{5} \\qquad \\text{(beide leden delen door 5)}', 'x = 7', 'V = \\{7\\}'] },
    { tex: '4x = -24', stappen: ['x = \\frac{-24}{4}', 'x = -6', 'V = \\{-6\\}'] },
    { tex: '-3x = -15', stappen: ['x = \\frac{-15}{-3}', 'x = 5', 'V = \\{5\\}'] },
    { tex: '-x = 8', stappen: ['x = -8 \\qquad \\text{(beide leden delen door } -1)', 'V = \\{-8\\}'] },
  ],
  soorten: {
    maal: { naam: 'a · x = b', gen() { const a = rnd(2, 10), x = nz(-10, 12), b = a * x; const L = [`${a}x = ${b}`]; const o = slot(a, b, L); return vraag('maal', `${a}x = ${b}`, o, L); } },
    neg: { naam: 'Negatief getal voor x', gen() { const a = -rnd(1, 9), x = nz(-10, 10), b = a * x; const L = [`${tx(a)} = ${b}`]; const o = slot(a, b, L); return vraag('neg', `${tx(a)} = ${b}`, o, L); } },
  },
  oefenMix: [['maal', 3], ['neg', 2]],
  test: [['maal', 6], ['neg', 4]], testSchudden: true,
};

// ===================================================================
//  Stap 4 — a·x = b met een kommagetal als oplossing
// ===================================================================
const D4 = {
  nr: 4, titel: 'a · x = b met een kommagetal', kort: 'De deling gaat niet op: kommagetal, juist afgerond op 2 decimalen.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `<div class="kader werk"><div class="kader-titel">De deling gaat niet op</div>
      <p>$4x = 10 \\;\\Leftrightarrow\\; x = \\frac{10}{4} = 2{,}5$ &nbsp; dus $V = \\{2{,}5\\}$</p>
      <p>$3x = 7 \\;\\Leftrightarrow\\; x = \\frac{7}{3} = 2{,}3333\\ldots \\approx 2{,}33$ &nbsp; dus $V = \\{2{,}33\\}$</p></div>
    <div class="kader eig"><div class="kader-titel">Juist afronden op 2 cijfers na de komma</div>
      <p>Kijk naar het <b>derde</b> cijfer na de komma: is dat 5 of meer, dan verhoog je het tweede cijfer met 1.</p>
      <p>$2{,}333\\ldots \\approx 2{,}33$ &nbsp;·&nbsp; $1{,}666\\ldots \\approx 1{,}67$ &nbsp;·&nbsp; $-0{,}8571\\ldots \\approx -0{,}86$</p>
      <p class="klein">Typ een kommagetal met een komma: <code>2,33</code>. Een breuk zoals <code>7/3</code> wordt ook goedgekeurd.</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '2x = 9', stappen: ['x = \\frac{9}{2}', 'x = 4{,}5', 'V = \\{4{,}5\\}'] },
    { tex: '6x = 5', stappen: ['x = \\frac{5}{6} = 0{,}8333\\ldots', 'x \\approx 0{,}83 \\qquad \\text{(derde cijfer is 3: niet verhogen)}', 'V = \\{0{,}83\\}'] },
    { tex: '-7x = 12', stappen: ['x = \\frac{12}{-7} = -1{,}714\\ldots', 'x \\approx -1{,}71', 'V = \\{-1{,}71\\}'] },
  ],
  soorten: {
    exact: { naam: 'Deling met kommagetal', gen() { for (;;) { const a = kies([2, 4, 5, 10, 20, 25]) * (Math.random() < 0.25 ? -1 : 1), b = nz(-60, 90); if (b % a === 0 || !exact2(b / a)) continue;
      const L = [`${tx(a)} = ${b}`]; const o = slot(a, b, L); return vraag('exact', `${tx(a)} = ${b}`, o, L); } } },
    afronden: { naam: 'Afronden op 2 decimalen', gen() { for (;;) { const a = kies([3, 6, 7, 9, 11, 12, 13, 15]) * (Math.random() < 0.25 ? -1 : 1), b = nz(-50, 80); if (b % a === 0 || exact2(b / a) || !veilig(b, a)) continue;
      const L = [`${tx(a)} = ${b}`]; const o = slot(a, b, L); return vraag('afronden', `${tx(a)} = ${b}`, o, L); } } },
  },
  oefenMix: [['exact', 1], ['afronden', 1]],
  test: [['exact', 5], ['afronden', 5]], testSchudden: true,
};

// ===================================================================
//  Stap 5 — a·x + b = c
// ===================================================================
const D5 = {
  nr: 5, titel: 'a · x + b = c', kort: 'Eerst het getal weg, dan delen.', rekenmachine: false, opdracht: OPDRACHT,
  theorie: `${REGELS}
    <div class="kader werk"><div class="kader-titel">Werkwijze in 2 stappen</div>
      <ol><li>Werk eerst het <b>getal zonder x</b> weg (optellen of aftrekken in beide leden).</li><li>Deel daarna beide leden door het <b>getal voor x</b>.</li></ol>
      <p class="midden">$2x + 3 = 11 \\;\\Leftrightarrow\\; 2x = 11 - 3 \\;\\Leftrightarrow\\; 2x = 8 \\;\\Leftrightarrow\\; x = \\frac{8}{2} = 4$</p>
      <p><b>Controle:</b> $2 \\cdot 4 + 3 = 11$ ✓ &nbsp; dus $V = \\{4\\}$</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '3x + 5 = 20', stappen: ['3x = 20 - 5 \\qquad \\text{(5 aftrekken)}', '3x = 15', 'x = \\frac{15}{3} = 5 \\qquad \\text{(delen door 3)}', '\\text{controle: } 3 \\cdot 5 + 5 = 20 \\;✓', 'V = \\{5\\}'] },
    { tex: '4x - 7 = 13', stappen: ['4x = 13 + 7', '4x = 20', 'x = \\frac{20}{4} = 5', 'V = \\{5\\}'] },
  ],
  soorten: {
    plus: { naam: 'a · x + b = c', gen() { const a = rnd(2, 9), x = rnd(1, 10), b = rnd(1, 20), c = a * x + b; const L = [`${a}x + ${b} = ${c}`, stap(`${a}x = ${c} - ${b}`, `(${b} aftrekken)`), stap(`${a}x = ${a * x}`)]; const o = slot(a, a * x, L);
      L.splice(L.length - 1, 0, `\\text{controle: } ${a} \\cdot ${x} + ${b} = ${c} \\;✓`); return vraag('plus', `${a}x + ${b} = ${c}`, o, L); } },
    min: { naam: 'a · x − b = c', gen() { const a = rnd(2, 9), x = rnd(1, 10), b = rnd(1, 20), c = a * x - b; const L = [`${a}x - ${b} = ${c}`, stap(`${a}x = ${c} + ${b}`, `(${b} optellen)`), stap(`${a}x = ${a * x}`)]; const o = slot(a, a * x, L);
      return vraag('min', `${a}x - ${b} = ${c}`, o, L); } },
  },
  oefenMix: [['plus', 1], ['min', 1]],
  test: [['plus', 5], ['min', 5]], testSchudden: true,
};

// ===================================================================
//  Stap 6 — a·x + b = c met negatieve getallen
// ===================================================================
const D6 = {
  nr: 6, titel: 'a · x + b = c met negatieve getallen', kort: 'Negatieve oplossingen, getal voor de x-term, minteken voor x.', rekenmachine: false, opdracht: OPDRACHT,
  theorie: `<div class="kader werk"><div class="kader-titel">Dezelfde 2 stappen, ook met negatieve getallen</div>
      <p>$5x + 12 = 2 \\;\\Leftrightarrow\\; 5x = 2 - 12 \\;\\Leftrightarrow\\; 5x = -10 \\;\\Leftrightarrow\\; x = -2$</p>
      <p>Staat het getal vóór de x-term? Dat verandert niets: $7 - 2x = 1 \\;\\Leftrightarrow\\; -2x = 1 - 7 \\;\\Leftrightarrow\\; -2x = -6 \\;\\Leftrightarrow\\; x = 3$</p>
      <p class="let-op">Let op: in $7 - 2x$ hoort het minteken bij de $2x$. Je deelt dus door $-2$.</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '3x + 20 = 8', stappen: ['3x = 8 - 20', '3x = -12', 'x = \\frac{-12}{3} = -4', 'V = \\{-4\\}'] },
    { tex: '10 - 4x = 2', stappen: ['-4x = 2 - 10 \\qquad \\text{(10 aftrekken)}', '-4x = -8', 'x = \\frac{-8}{-4} = 2', 'V = \\{2\\}'] },
    { tex: '-5x + 3 = 18', stappen: ['-5x = 18 - 3', '-5x = 15', 'x = \\frac{15}{-5} = -3', 'V = \\{-3\\}'] },
  ],
  soorten: {
    negopl: { naam: 'Negatieve oplossing', gen() { const a = rnd(2, 9), x = -rnd(1, 9), b = nz(-15, 25), c = a * x + b; const L = [`${lin(a, b)} = ${c}`, stap(`${a}x = ${c}${tc(-b)}`, `(${b > 0 ? b + ' aftrekken' : -b + ' optellen'})`), stap(`${a}x = ${a * x}`)]; const o = slot(a, a * x, L); return vraag('negopl', `${lin(a, b)} = ${c}`, o, L); } },
    voor: { naam: 'Getal vóór de x-term', gen() { const a = rnd(2, 9), x = nz(-8, 10), b = rnd(1, 30), c = b - a * x; const L = [`${linCx(b, -a)} = ${c}`, stap(`-${a}x = ${c} - ${b}`, `(${b} aftrekken)`), stap(`-${a}x = ${c - b}`)]; const o = slot(-a, c - b, L); return vraag('voor', `${linCx(b, -a)} = ${c}`, o, L); } },
    negcoef: { naam: 'Minteken voor x', gen() { const a = rnd(1, 9), x = nz(-8, 10), b = nz(-15, 15), c = -a * x + b; const L = [`${lin(-a, b)} = ${c}`, stap(`${tx(-a)} = ${c}${tc(-b)}`), stap(`${tx(-a)} = ${c - b}`)]; const o = slot(-a, c - b, L); return vraag('negcoef', `${lin(-a, b)} = ${c}`, o, L); } },
  },
  oefenMix: [['negopl', 1], ['voor', 1], ['negcoef', 1]],
  test: [['negopl', 4], ['voor', 3], ['negcoef', 3]], testSchudden: true,
};

// ===================================================================
//  Stap 7 — a·x + b = c met een kommagetal als oplossing
// ===================================================================
const D7 = {
  nr: 7, titel: 'a · x + b = c met een kommagetal', kort: 'Zelfde werkwijze, oplossing juist afgerond.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `<div class="kader werk"><div class="kader-titel">Zelfde werkwijze, rond pas op het einde af</div>
      <p>$3x + 4 = 12 \\;\\Leftrightarrow\\; 3x = 8 \\;\\Leftrightarrow\\; x = \\frac{8}{3} = 2{,}666\\ldots \\approx 2{,}67$ &nbsp; dus $V = \\{2{,}67\\}$</p>
      <p class="klein">Rond enkel de oplossing af, niet de tussenstappen.</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '4x - 3 = 7', stappen: ['4x = 10', 'x = \\frac{10}{4} = 2{,}5', 'V = \\{2{,}5\\}'] },
    { tex: '7x + 2 = -3', stappen: ['7x = -5', 'x = \\frac{-5}{7} = -0{,}714\\ldots \\approx -0{,}71', 'V = \\{-0{,}71\\}'] },
  ],
  soorten: {
    komma: { naam: 'Oplossing is een kommagetal', gen() { for (;;) { const a = rnd(2, 9), b = nz(-20, 20), c = nz(-30, 40), B = c - b; if (B % a === 0 || !veilig(B, a)) continue;
      const L = [`${lin(a, b)} = ${c}`, stap(`${a}x = ${c}${tc(-b)}`), stap(`${a}x = ${B}`)]; const o = slot(a, B, L); return vraag('komma', `${lin(a, b)} = ${c}`, o, L); } } },
    kommaneg: { naam: 'Kommagetal met minteken voor x', gen() { for (;;) { const a = rnd(2, 9), b = rnd(1, 30), c = nz(-20, 30), B = c - b; if (B % a === 0 || !veilig(B, -a)) continue;
      const L = [`${linCx(b, -a)} = ${c}`, stap(`-${a}x = ${c} - ${b}`), stap(`-${a}x = ${B}`)]; const o = slot(-a, B, L); return vraag('kommaneg', `${linCx(b, -a)} = ${c}`, o, L); } } },
  },
  oefenMix: [['komma', 2], ['kommaneg', 1]],
  test: [['komma', 6], ['kommaneg', 4]], testSchudden: true,
};

// ===================================================================
//  Stap 8 — x in beide leden (1)
// ===================================================================
const D8 = {
  nr: 8, titel: 'x in beide leden', kort: 'Termen met x naar links, getallen naar rechts.', rekenmachine: false, opdracht: OPDRACHT,
  theorie: `${REGELS}
    <div class="kader werk"><div class="kader-titel">Werkwijze</div>
      <ol><li>Breng alle <b>termen met x naar het linkerlid</b> en alle <b>getallen naar het rechterlid</b>. Wat van kant verandert, krijgt het tegengestelde teken.</li>
        <li>Neem samen: $5x - 2x = 3x$.</li><li>Deel door het getal voor x.</li></ol>
      <p class="midden">$5x + 4 = 2x + 19 \\;\\Leftrightarrow\\; 5x - 2x = 19 - 4 \\;\\Leftrightarrow\\; 3x = 15 \\;\\Leftrightarrow\\; x = 5$</p>
      <p><b>Controle:</b> links $5 \\cdot 5 + 4 = 29$, rechts $2 \\cdot 5 + 19 = 29$ ✓</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '6x + 1 = 4x + 9', stappen: ['6x - 4x = 9 - 1 \\qquad \\text{(4x naar links, 1 naar rechts)}', '2x = 8', 'x = 4', 'V = \\{4\\}'] },
    { tex: '7x = 3x + 20', stappen: ['7x - 3x = 20', '4x = 20', 'x = 5', 'V = \\{5\\}'] },
    { tex: '9x - 5 = 4x + 10', stappen: ['9x - 4x = 10 + 5', '5x = 15', 'x = 3', 'V = \\{3\\}'] },
  ],
  soorten: {
    beide: { naam: 'ax + b = cx + d', gen() { const c = rnd(1, 6), a = c + rnd(1, 6), x = rnd(1, 10), b = nz(-12, 15), d = (a - c) * x + b;
      const L = [`${lin(a, b)} = ${lin(c, d)}`, stap(`${tx(a)}${tx(-c, false)} = ${tg(d)}${tc(-b)}`, `(${tx(c)} naar links${b ? ', ' + tg(Math.abs(b)) + ' naar rechts' : ''})`), stap(`${tx(a - c)} = ${d - b}`)];
      const o = slot(a - c, d - b, L); return vraag('beide', `${lin(a, b)} = ${lin(c, d)}`, o, L); } },
    zonder: { naam: 'Eén lid zonder getal', gen() { const c = rnd(1, 6), a = c + rnd(1, 6), x = rnd(1, 10), d = (a - c) * x;
      if (Math.random() < 0.5) { const L = [`${a}x = ${lin(c, d)}`, stap(`${tx(a)}${tx(-c, false)} = ${d}`), stap(`${tx(a - c)} = ${d}`)]; const o = slot(a - c, d, L); return vraag('zonder', `${a}x = ${lin(c, d)}`, o, L); }
      const b = -d; const L = [`${lin(a, b)} = ${tx(c)}`, stap(`${tx(a)}${tx(-c, false)} = ${tg(-b)}`), stap(`${tx(a - c)} = ${-b}`)]; const o = slot(a - c, -b, L); return vraag('zonder', `${lin(a, b)} = ${tx(c)}`, o, L); } },
  },
  oefenMix: [['beide', 2], ['zonder', 1]],
  test: [['beide', 6], ['zonder', 4]], testSchudden: true,
};

// ===================================================================
//  Stap 9 — x in beide leden (2)
// ===================================================================
function beideAlg(opts = {}) {
  for (;;) {
    const a = nz(-8, 9), c = nz(-8, 9); if (a === c) continue;
    const b = nz(-20, 20); let d, x, B = 0;
    if (opts.komma) { d = nz(-30, 30); B = d - b; if (B % (a - c) === 0 || !veilig(B, a - c)) continue; }
    else { x = nz(-9, 10); d = (a - c) * x + b; B = d - b; }
    if (opts.neg && a - c > 0) continue;
    const L = [`${lin(a, b)} = ${lin(c, d)}`, stap(`${tx(a)}${tx(-c, false)} = ${tg(d)}${tc(-b)}`), stap(`${tx(a - c)} = ${B}`)];
    const o = slot(a - c, B, L);
    return { tex: `${lin(a, b)} = ${lin(c, d)}`, o, L };
  }
}
const D9 = {
  nr: 9, titel: 'x in beide leden met negatieve getallen', kort: 'Ook als het getal voor x negatief wordt.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `<div class="kader werk"><div class="kader-titel">Dezelfde werkwijze</div>
      <p>$2x + 7 = 5x - 8 \\;\\Leftrightarrow\\; 2x - 5x = -8 - 7 \\;\\Leftrightarrow\\; -3x = -15 \\;\\Leftrightarrow\\; x = 5$</p>
      <p>$-4x + 1 = 2x + 4 \\;\\Leftrightarrow\\; -4x - 2x = 4 - 1 \\;\\Leftrightarrow\\; -6x = 3 \\;\\Leftrightarrow\\; x = \\frac{3}{-6} = -0{,}5$</p>
      <p class="klein">Een negatief getal voor x is geen probleem: deel er gewoon door (en let op het teken).</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: 'x + 12 = 4x', stappen: ['x - 4x = -12', '-3x = -12', 'x = \\frac{-12}{-3} = 4', 'V = \\{4\\}'] },
    { tex: '3x - 2 = 7x + 10', stappen: ['3x - 7x = 10 + 2', '-4x = 12', 'x = \\frac{12}{-4} = -3', 'V = \\{-3\\}'] },
    { tex: '5x + 1 = 2x - 6', stappen: ['5x - 2x = -6 - 1', '3x = -7', 'x = \\frac{-7}{3} \\approx -2{,}33', 'V = \\{-2{,}33\\}'] },
  ],
  soorten: {
    negatief: { naam: 'Negatief getal voor x', gen() { const r = beideAlg({ neg: true }); return vraag('negatief', r.tex, r.o, r.L); } },
    gemengd: { naam: 'Gemengde tekens', gen() { const r = beideAlg(); return vraag('gemengd', r.tex, r.o, r.L); } },
    komma: { naam: 'Oplossing is een kommagetal', gen() { const r = beideAlg({ komma: true }); return vraag('komma', r.tex, r.o, r.L); } },
  },
  oefenMix: [['negatief', 1], ['gemengd', 1], ['komma', 1]],
  test: [['negatief', 3], ['gemengd', 4], ['komma', 3]], testSchudden: true,
};

// ===================================================================
//  Stap 10 — haakjes (1)
// ===================================================================
const haak = (a, inhoud) => `${a === -1 ? '-' : a === 1 ? '' : tg(a)}(${inhoud})`;
const D10 = {
  nr: 10, titel: 'Haakjes wegwerken', kort: 'a(x + b) = c: eerst de haakjes weg.', rekenmachine: false, opdracht: OPDRACHT,
  theorie: `<div class="kader def"><div class="kader-titel">Haakjes wegwerken (distributiviteit)</div>
      <p class="midden">$a(x + b) = a \\cdot x + a \\cdot b$</p>
      <p>Vermenigvuldig het getal voor de haakjes met <b>elke</b> term tussen de haakjes: $3(x + 4) = 3x + 12$ &nbsp;·&nbsp; $2(x - 5) = 2x - 10$</p></div>
    <div class="kader werk"><div class="kader-titel">Werkwijze</div>
      <ol><li>Werk eerst de haakjes weg.</li><li>Los daarna op zoals je al kan.</li></ol>
      <p class="midden">$3(x + 4) = 27 \\;\\Leftrightarrow\\; 3x + 12 = 27 \\;\\Leftrightarrow\\; 3x = 15 \\;\\Leftrightarrow\\; x = 5$</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '2(x + 6) = 20', stappen: ['2x + 12 = 20 \\qquad \\text{(haakjes weg: } 2 \\cdot x + 2 \\cdot 6)', '2x = 8', 'x = 4', 'V = \\{4\\}'] },
    { tex: '5(x - 3) = 10', stappen: ['5x - 15 = 10', '5x = 25', 'x = 5', 'V = \\{5\\}'] },
    { tex: '4(2x + 1) = 36', stappen: ['8x + 4 = 36', '8x = 32', 'x = 4', 'V = \\{4\\}'] },
  ],
  soorten: {
    plus: { naam: 'a(x + b) = c', gen() { const a = rnd(2, 9), b = nz(-9, 9), x = nz(-6, 10), c = a * (x + b);
      const L = [`${haak(a, lin(1, b))} = ${c}`, stap(`${lin(a, a * b)} = ${c}`, '(haakjes weg)'), stap(`${a}x = ${c - a * b}`)]; const o = slot(a, c - a * b, L); return vraag('plus', `${haak(a, lin(1, b))} = ${c}`, o, L); } },
    binnen: { naam: 'a(bx + c) = d', gen() { const a = rnd(2, 6), b = rnd(2, 5), c = nz(-8, 8), x = nz(-5, 8), d = a * (b * x + c);
      const L = [`${haak(a, lin(b, c))} = ${d}`, stap(`${lin(a * b, a * c)} = ${d}`, '(haakjes weg)'), stap(`${a * b}x = ${d - a * c}`)]; const o = slot(a * b, d - a * c, L); return vraag('binnen', `${haak(a, lin(b, c))} = ${d}`, o, L); } },
  },
  oefenMix: [['plus', 2], ['binnen', 1]],
  test: [['plus', 6], ['binnen', 4]], testSchudden: true,
};

// ===================================================================
//  Stap 11 — haakjes (2)
// ===================================================================
const D11 = {
  nr: 11, titel: 'Haakjes en x in beide leden', kort: 'a(x + b) + c = d en a(x + b) = cx + d.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `<div class="kader werk"><div class="kader-titel">Stappenplan</div>
      <ol><li>Haakjes wegwerken.</li><li>Termen met x naar links, getallen naar rechts.</li><li>Samennemen.</li><li>Delen door het getal voor x.</li></ol>
      <p>$2(x + 3) + 4 = 18 \\;\\Leftrightarrow\\; 2x + 6 + 4 = 18 \\;\\Leftrightarrow\\; 2x = 18 - 10 \\;\\Leftrightarrow\\; 2x = 8 \\;\\Leftrightarrow\\; x = 4$</p>
      <p>$3(x - 2) = x + 8 \\;\\Leftrightarrow\\; 3x - 6 = x + 8 \\;\\Leftrightarrow\\; 3x - x = 8 + 6 \\;\\Leftrightarrow\\; 2x = 14 \\;\\Leftrightarrow\\; x = 7$</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '4(x - 1) + 3 = 15', stappen: ['4x - 4 + 3 = 15', '4x - 1 = 15', '4x = 16', 'x = 4', 'V = \\{4\\}'] },
    { tex: '2(x + 5) = 3x + 4', stappen: ['2x + 10 = 3x + 4', '2x - 3x = 4 - 10', '-x = -6', 'x = 6', 'V = \\{6\\}'] },
  ],
  soorten: {
    plusc: { naam: 'a(x + b) + c = d', gen() { const a = rnd(2, 7), b = nz(-8, 8), c = nz(-12, 12), x = nz(-6, 9), d = a * (x + b) + c;
      const L = [`${haak(a, lin(1, b))}${tc(c)} = ${d}`, stap(`${lin(a, a * b)}${tc(c)} = ${d}`, '(haakjes weg)'), stap(`${lin(a, a * b + c)} = ${d}`), stap(`${a}x = ${d - a * b - c}`)];
      const o = slot(a, d - a * b - c, L); return vraag('plusc', `${haak(a, lin(1, b))}${tc(c)} = ${d}`, o, L); } },
    beide: { naam: 'a(x + b) = cx + d', gen() { for (;;) { const a = rnd(2, 7), b = nz(-8, 8), c = nz(-5, 8); if (c === a) continue; const komma = Math.random() < 0.3;
      let d; if (komma) { d = nz(-20, 30); const B = d - a * b; if (B % (a - c) === 0 || !veilig(B, a - c)) continue; } else { const x = nz(-8, 9); d = a * (x + b) - c * x; }
      const B = d - a * b;
      const L = [`${haak(a, lin(1, b))} = ${lin(c, d)}`, stap(`${lin(a, a * b)} = ${lin(c, d)}`, '(haakjes weg)'), stap(`${tx(a)}${tx(-c, false)} = ${tg(d)}${tc(-a * b)}`), stap(`${tx(a - c)} = ${B}`)];
      const o = slot(a - c, B, L); return vraag('beide', `${haak(a, lin(1, b))} = ${lin(c, d)}`, o, L); } } },
  },
  oefenMix: [['plusc', 1], ['beide', 1]],
  test: [['plusc', 5], ['beide', 5]], testSchudden: true,
};

// ===================================================================
//  Stap 12 — minteken voor de haakjes, twee haakjes
// ===================================================================
const D12 = {
  nr: 12, titel: 'Minteken voor de haakjes', kort: '−(x + a), a − b(x + c) en twee keer haakjes.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `<div class="kader def"><div class="kader-titel">Minteken voor de haakjes</div>
      <p>Een minteken voor de haakjes verandert <b>elk teken</b> tussen de haakjes: $-(x + 4) = -x - 4$ &nbsp;·&nbsp; $-(x - 3) = -x + 3$</p>
      <p>Met een getal: $-2(x - 5) = -2x + 10$ &nbsp;<span class="klein">($-2 \\cdot x = -2x$ en $-2 \\cdot (-5) = +10$)</span></p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p>$10 - (x + 3) = 2 \\;\\Leftrightarrow\\; 10 - x - 3 = 2 \\;\\Leftrightarrow\\; -x = 2 - 7 \\;\\Leftrightarrow\\; -x = -5 \\;\\Leftrightarrow\\; x = 5$</p>
      <p>$3(x + 1) = 2(x + 4) \\;\\Leftrightarrow\\; 3x + 3 = 2x + 8 \\;\\Leftrightarrow\\; x = 5$</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '-(x - 6) = 2', stappen: ['-x + 6 = 2', '-x = -4', 'x = 4', 'V = \\{4\\}'] },
    { tex: '20 - 3(x + 2) = 5', stappen: ['20 - 3x - 6 = 5', '-3x + 14 = 5', '-3x = -9', 'x = 3', 'V = \\{3\\}'] },
    { tex: '5(x - 1) = 3(x + 3)', stappen: ['5x - 5 = 3x + 9', '5x - 3x = 9 + 5', '2x = 14', 'x = 7', 'V = \\{7\\}'] },
  ],
  soorten: {
    min: { naam: '−(x + a) = b', gen() { const a = nz(-9, 9), x = nz(-8, 9), b = -(x + a);
      const L = [`-(${lin(1, a)}) = ${b}`, stap(`${lin(-1, -a)} = ${b}`, '(alle tekens omkeren)'), stap(`-x = ${b + a}`)]; const o = slot(-1, b + a, L); return vraag('min', `-(${lin(1, a)}) = ${b}`, o, L); } },
    getalmin: { naam: 'a − b(x + c) = d', gen() { const a = rnd(5, 30), b = rnd(1, 6), c = nz(-6, 6), x = nz(-5, 8), d = a - b * (x + c);
      const inh = lin(1, c), L = [`${a} - ${b === 1 ? '' : b}(${inh}) = ${d}`, stap(`${a}${tx(-b, false)}${tc(-b * c)} = ${d}`, '(haakjes weg)'), stap(`${tx(-b)}${tc(a - b * c)} = ${d}`), stap(`${tx(-b)} = ${d - a + b * c}`)];
      const o = slot(-b, d - a + b * c, L); return vraag('getalmin', `${a} - ${b === 1 ? '' : b}(${inh}) = ${d}`, o, L); } },
    twee: { naam: 'a(x + b) = c(x + d)', gen() { for (;;) { const a = rnd(2, 8), c = rnd(1, 7); if (a === c) continue; const b = nz(-7, 7), d = nz(-7, 7), B = c * d - a * b; if (B % (a - c) !== 0 && !veilig(B, a - c)) continue;
      const L = [`${haak(a, lin(1, b))} = ${haak(c, lin(1, d))}`, stap(`${lin(a, a * b)} = ${lin(c, c * d)}`, '(haakjes weg)'), stap(`${tx(a)}${tx(-c, false)} = ${tg(c * d)}${tc(-a * b)}`), stap(`${tx(a - c)} = ${B}`)];
      const o = slot(a - c, B, L); return vraag('twee', `${haak(a, lin(1, b))} = ${haak(c, lin(1, d))}`, o, L); } } },
  },
  oefenMix: [['min', 1], ['getalmin', 1], ['twee', 1]],
  test: [['min', 3], ['getalmin', 4], ['twee', 3]], testSchudden: true,
};

// ===================================================================
//  Stap 13 — één noemer
// ===================================================================
const fr = (t, n) => `\\dfrac{${t}}{${n}}`;
const D13 = {
  nr: 13, titel: 'Vergelijkingen met een noemer', kort: 'x/a = b en x/a + b = c: maal de noemer.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `${REGELS}
    <div class="kader werk"><div class="kader-titel">Noemer wegwerken</div>
      <p>Vermenigvuldig <b>beide leden</b> (dus <b>elke term</b>) met de noemer.</p>
      <p>$\\dfrac{x}{4} = 3 \\;\\Leftrightarrow\\; x = 3 \\cdot 4 = 12$</p>
      <p>$\\dfrac{x}{3} + 2 = 5 \\;\\Leftrightarrow\\; x + 6 = 15 \\;\\Leftrightarrow\\; x = 9$ &nbsp;<span class="klein">(elke term maal 3: ook de 2 en de 5!)</span></p>
      <p>$\\dfrac{x + 1}{2} = 7 \\;\\Leftrightarrow\\; x + 1 = 14 \\;\\Leftrightarrow\\; x = 13$</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '\\dfrac{x}{5} = -2', stappen: ['x = -2 \\cdot 5 \\qquad \\text{(beide leden maal 5)}', 'x = -10', 'V = \\{-10\\}'] },
    { tex: '\\dfrac{x}{2} - 3 = 4', stappen: ['x - 6 = 8 \\qquad \\text{(elke term maal 2)}', 'x = 14', 'V = \\{14\\}'] },
    { tex: '\\dfrac{2x}{3} = 5', stappen: ['2x = 15', 'x = \\frac{15}{2} = 7{,}5', 'V = \\{7{,}5\\}'] },
  ],
  soorten: {
    deel: { naam: 'x/a = b', gen() { const a = rnd(2, 9), b = nz(-9, 12); const o = opl(a * b, 1); return vraag('deel', `${fr('x', a)} = ${b}`, o, [`${fr('x', a)} = ${b}`, stap(`x = ${h(b)} \\cdot ${a}`, `(beide leden maal ${a})`), stap(`x = ${a * b}`), o.V]); } },
    deelplus: { naam: 'x/a + b = c', gen() { const a = rnd(2, 8), k = nz(-6, 9), b = nz(-9, 9), c = k + b; const o = opl(a * k, 1);
      return vraag('deelplus', `${fr('x', a)}${tc(b)} = ${c}`, o, [`${fr('x', a)}${tc(b)} = ${c}`, stap(`${lin(1, a * b)} = ${a * c}`, `(elke term maal ${a})`), stap(`x = ${a * c}${tc(-a * b)}`), stap(`x = ${a * k}`), o.V]); } },
    teller: { naam: '(x + a)/b = c en ax/b = c', gen() { for (;;) {
      if (Math.random() < 0.5) { const b = rnd(2, 8), a = nz(-9, 9), c = nz(-6, 9); const o = opl(b * c - a, 1);
        return vraag('teller', `${fr(lin(1, a), b)} = ${c}`, o, [`${fr(lin(1, a), b)} = ${c}`, stap(`${lin(1, a)} = ${b * c}`, `(beide leden maal ${b})`), stap(`x = ${b * c - a}`), o.V]); }
      const a = rnd(2, 7), b = rnd(2, 7); if (ggd(a, b) > 1) continue; const c = nz(-9, 12), B = b * c; if (B % a !== 0 && !veilig(B, a)) continue;
      const L = [`${fr(a + 'x', b)} = ${c}`, stap(`${a}x = ${B}`, `(beide leden maal ${b})`)]; const o = slot(a, B, L); return vraag('teller', `${fr(a + 'x', b)} = ${c}`, o, L); } } },
  },
  oefenMix: [['deel', 1], ['deelplus', 1], ['teller', 1]],
  test: [['deel', 3], ['deelplus', 4], ['teller', 3]], testSchudden: true,
};

// ===================================================================
//  Stap 14 — meerdere noemers
// ===================================================================
const D14 = {
  nr: 14, titel: 'Meerdere noemers', kort: 'Vermenigvuldig met het kleinste gemeenschappelijk veelvoud.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `<div class="kader werk"><div class="kader-titel">Gemeenschappelijke noemer</div>
      <p>Zoek het <b>kleinste gemeenschappelijk veelvoud (kgv)</b> van de noemers en vermenigvuldig elke term daarmee.</p>
      <p>$\\dfrac{x}{2} + \\dfrac{x}{3} = 10$: &nbsp; kgv$(2, 3) = 6$ &nbsp; $\\Leftrightarrow\\; 3x + 2x = 60 \\;\\Leftrightarrow\\; 5x = 60 \\;\\Leftrightarrow\\; x = 12$</p>
      <p>$\\dfrac{x + 1}{4} = \\dfrac{x - 2}{2}$: &nbsp; maal 4 &nbsp; $\\Leftrightarrow\\; x + 1 = 2(x - 2) \\;\\Leftrightarrow\\; x + 1 = 2x - 4 \\;\\Leftrightarrow\\; -x = -5 \\;\\Leftrightarrow\\; x = 5$</p>
      <p class="let-op">Staat er een som in de teller? Zet die tussen haakjes als je vermenigvuldigt.</p></div>${NOTEER}`,
  voorbeelden: [
    { tex: '\\dfrac{x}{4} + \\dfrac{x}{6} = 5', stappen: ['\\text{kgv}(4, 6) = 12', '3x + 2x = 60', '5x = 60', 'x = 12', 'V = \\{12\\}'] },
    { tex: '\\dfrac{x}{3} - 1 = \\dfrac{x}{5}', stappen: ['\\text{kgv}(3, 5) = 15', '5x - 15 = 3x', '2x = 15', 'x = 7{,}5', 'V = \\{7{,}5\\}'] },
    { tex: '\\dfrac{x + 2}{3} = \\dfrac{x - 1}{2}', stappen: ['\\text{maal 6: } 2(x + 2) = 3(x - 1)', '2x + 4 = 3x - 3', '-x = -7', 'x = 7', 'V = \\{7\\}'] },
  ],
  soorten: {
    som: { naam: 'x/a + x/b = c', gen() { for (;;) { let a = rnd(2, 6), b = rnd(2, 8); if (a === b) continue; const L0 = kgv(a, b), c = nz(-8, 12), A = L0 / a + L0 / b, B = c * L0; if (B % A !== 0 && !veilig(B, A)) continue;
      const tex = `${fr('x', a)} + ${fr('x', b)} = ${c}`; const L = [tex, stap(`${L0 / a}x + ${L0 / b}x = ${B}`, `(elke term maal ${L0})`), stap(`${A}x = ${B}`)]; const o = slot(A, B, L); return vraag('som', tex, o, L); } } },
    xbeide: { naam: 'x/a + b = x/c', gen() { for (;;) { const a = rnd(2, 6), c = rnd(2, 6); if (a === c) continue; const b = nz(-6, 6), L0 = kgv(a, c), A = L0 / a - L0 / c, B = -b * L0; if (B % A !== 0 && !veilig(B, A)) continue;
      const tex = `${fr('x', a)}${tc(b)} = ${fr('x', c)}`; const L = [tex, stap(`${L0 / a}x${tc(b * L0)} = ${L0 / c}x`, `(elke term maal ${L0})`), stap(`${tx(L0 / a)}${tx(-L0 / c, false)} = ${B}`), stap(`${tx(A)} = ${B}`)]; const o = slot(A, B, L); return vraag('xbeide', tex, o, L); } } },
    tellers: { naam: '(x + a)/b = (x + c)/d', gen() { for (;;) { const b = rnd(2, 6), d = rnd(2, 6); if (b === d) continue; const a = nz(-6, 6), c = nz(-6, 6), L0 = kgv(b, d), p = L0 / b, q = L0 / d, A = p - q, B = q * c - p * a; if (A === 0 || (B % A !== 0 && !veilig(B, A))) continue;
      const tex = `${fr(lin(1, a), b)} = ${fr(lin(1, c), d)}`; const L = [tex, stap(`${haak(p, lin(1, a))} = ${haak(q, lin(1, c))}`, `(beide leden maal ${L0})`), stap(`${lin(p, p * a)} = ${lin(q, q * c)}`), stap(`${tx(p)}${tx(-q, false)} = ${tg(q * c)}${tc(-p * a)}`), stap(`${tx(A)} = ${B}`)];
      const o = slot(A, B, L); return vraag('tellers', tex, o, L); } } },
  },
  oefenMix: [['som', 1], ['xbeide', 1], ['tellers', 1]],
  test: [['som', 4], ['xbeide', 3], ['tellers', 3]], testSchudden: true,
};

// ===================================================================
//  Stap 15 — bijzondere gevallen: V = ∅ en V = ℝ
// ===================================================================
function bijzonder(soort) {
  const r = soort === 'leeg' ? kies([0.1, 0.55]) : soort === 'R' ? kies([0.3, 0.7]) : soort === 'gewoon' ? 0.9 : Math.random(), a = rnd(2, 6), b = nz(-8, 8);
  if (r < 0.25) { // a(x + b) = ax + c   (c ≠ ab)  -> geen oplossing
    let c; do { c = nz(-15, 15); } while (c === a * b);
    const tex = `${haak(a, lin(1, b))} = ${lin(a, c)}`;
    return { tex, antw: { soort: 'V', speciaal: 'leeg', metSpeciaal: true }, uitleg: [tex, stap(`${lin(a, a * b)} = ${lin(a, c)}`, '(haakjes weg)'), stap(`${tx(a)}${tx(-a, false)} = ${tg(c)}${tc(-a * b)}`), stap(`0x = ${c - a * b}`), `\\text{Geen enkel getal maal 0 geeft } ${c - a * b}\\text{: geen oplossing}`, 'V = \\varnothing'] };
  }
  if (r < 0.5) { // a(x + b) = ax + ab  -> alle x
    const tex = `${haak(a, lin(1, b))} = ${lin(a, a * b)}`;
    return { tex, antw: { soort: 'V', speciaal: 'R', metSpeciaal: true }, uitleg: [tex, stap(`${lin(a, a * b)} = ${lin(a, a * b)}`, '(haakjes weg)'), stap(`${tx(a)}${tx(-a, false)} = ${tg(a * b)}${tc(-a * b)}`), stap('0x = 0'), '\\text{Elk getal maal 0 geeft 0: elke x is een oplossing}', 'V = \\mathbb{R}'] };
  }
  if (r < 0.65) { // ax + b + cx = (a+c)x + d  met d ≠ b  -> geen oplossing
    const c = rnd(1, 5); let d; do { d = nz(-12, 12); } while (d === b);
    const tex = `${lin(a, b)}${tx(c, false)} = ${lin(a + c, d)}`;
    return { tex, antw: { soort: 'V', speciaal: 'leeg', metSpeciaal: true }, uitleg: [tex, stap(`${tx(a)}${tx(c, false)}${tx(-(a + c), false)} = ${tg(d)}${tc(-b)}`), stap(`0x = ${d - b}`), '\\text{geen oplossing}', 'V = \\varnothing'] };
  }
  if (r < 0.75) { // ax + b = b + ax -> alle x
    const tex = `${lin(a, b)} = ${linCx(b, a)}`;
    return { tex, antw: { soort: 'V', speciaal: 'R', metSpeciaal: true }, uitleg: [tex, stap(`${tx(a)}${tx(-a, false)} = ${tg(b)}${tc(-b)}`), stap('0x = 0'), '\\text{elke x is een oplossing}', 'V = \\mathbb{R}'] };
  }
  // gewone vergelijking (zodat je echt moet nadenken)
  const g = beideAlg(); g.o.antw.metSpeciaal = true;
  return { tex: g.tex, antw: g.o.antw, uitleg: g.L };
}
const D15 = {
  nr: 15, titel: 'Bijzondere gevallen: V = ∅ en V = ℝ', kort: 'Geen oplossing of elk getal is een oplossing.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `<div class="kader def"><div class="kader-titel">Soms valt de x helemaal weg</div>
      <p>Als je alles samenneemt, kan je uitkomen op $0x = \\ldots$ Dan zijn er twee mogelijkheden:</p>
      <div class="twee">
        <div class="kader eig"><div class="kader-titel">$0x = 5$</div><p>Geen enkel getal maal 0 geeft 5. Er is <b>geen oplossing</b>.</p><p class="midden">$V = \\varnothing$ &nbsp;<span class="klein">(lege verzameling)</span></p></div>
        <div class="kader eig"><div class="kader-titel">$0x = 0$</div><p>Elk getal maal 0 geeft 0. <b>Elk reëel getal</b> is een oplossing.</p><p class="midden">$V = \\mathbb{R}$</p></div>
      </div>
      <p>$2(x + 3) = 2x + 1 \\;\\Leftrightarrow\\; 2x + 6 = 2x + 1 \\;\\Leftrightarrow\\; 0x = -5$ &nbsp; dus $V = \\varnothing$</p>
      <p>$3(x - 2) = 3x - 6 \\;\\Leftrightarrow\\; 3x - 6 = 3x - 6 \\;\\Leftrightarrow\\; 0x = 0$ &nbsp; dus $V = \\mathbb{R}$</p></div>
    <div class="kader"><div class="kader-titel">Zo geef je dit in</div>
      <p>Naast het vakje staan de knoppen $V = \\varnothing$ en $V = \\mathbb{R}$. Klik erop als dat de oplossing is. Is er wél één oplossing, typ ze dan gewoon in het vakje.</p>
      <p class="let-op">Let op: niet elke oefening in dit deel is een bijzonder geval!</p></div>`,
  voorbeelden: [
    { tex: '4(x - 1) = 4x + 3', stappen: ['4x - 4 = 4x + 3', '4x - 4x = 3 + 4', '0x = 7', '\\text{geen oplossing}', 'V = \\varnothing'] },
    { tex: '5x + 2 - 2x = 3x + 2', stappen: ['5x - 2x - 3x = 2 - 2', '0x = 0', '\\text{elke x is een oplossing}', 'V = \\mathbb{R}'] },
    { tex: '2(x + 4) = 3x + 1', stappen: ['2x + 8 = 3x + 1', '-x = -7', 'x = 7', 'V = \\{7\\}'] },
  ],
  soorten: {
    bijzonder: { naam: 'Bijzonder geval of niet?', gen() { const r = bijzonder(); return { soort: 'bijzonder', ...r }; } },
    leeg: { naam: 'V = ∅', verborgen: true, gen() { return { soort: 'bijzonder', ...bijzonder('leeg') }; } },
    alle: { naam: 'V = ℝ', verborgen: true, gen() { return { soort: 'bijzonder', ...bijzonder('R') }; } },
    gewoon: { naam: 'Gewone oplossing', verborgen: true, gen() { return { soort: 'bijzonder', ...bijzonder('gewoon') }; } },
  },
  oefenMix: [['bijzonder', 1]],
  test: [['leeg', 3], ['alle', 3], ['gewoon', 4]], testSchudden: true,
};

// ===================================================================
//  Stap 16 — eindtest: alles door elkaar
// ===================================================================
const mix = (deel, soort, naam, sleutel) => ({ naam, gen() { const v = deel.soorten[soort].gen(); return metSp({ ...v, soort: sleutel }); } });
const D16 = {
  nr: 16, titel: 'Eindtest: alles door elkaar', kort: 'Toon dat je alle soorten vergelijkingen kan oplossen.', rekenmachine: true, opdracht: OPDRACHT,
  theorie: `<div class="kader werk"><div class="kader-titel">Stappenplan voor elke eerstegraadsvergelijking</div>
      <ol><li><b>Noemers</b> wegwerken: elke term maal het kgv van de noemers.</li>
        <li><b>Haakjes</b> wegwerken (let op een minteken voor de haakjes).</li>
        <li>Termen met <b>x naar links</b>, <b>getallen naar rechts</b> (tegengesteld teken).</li>
        <li><b>Samennemen</b>.</li>
        <li><b>Delen</b> door het getal voor x. Kom je $0x = \\ldots$ uit? Dan is $V = \\varnothing$ of $V = \\mathbb{R}$.</li>
        <li>Noteer $V = \\{\\ldots\\}$ (afgerond op 2 cijfers na de komma waar nodig) en maak de <b>proef</b>.</li></ol></div>
    <p>In deze test komt alles door elkaar. Bij elke vraag kan je ook $V = \\varnothing$ of $V = \\mathbb{R}$ kiezen.</p>`,
  voorbeelden: [
    { tex: '\\dfrac{x - 1}{2} + 3 = 2(x - 4)', stappen: ['\\text{maal 2: } x - 1 + 6 = 4(x - 4)', 'x + 5 = 4x - 16', 'x - 4x = -16 - 5', '-3x = -21', 'x = 7', 'V = \\{7\\}'] },
  ],
  soorten: {
    beide: mix(D9, 'gemengd', 'x in beide leden', 'beide'),
    haakjes: mix(D11, 'beide', 'Haakjes', 'haakjes'),
    minhaak: mix(D12, 'getalmin', 'Minteken voor de haakjes', 'minhaak'),
    twee: mix(D12, 'twee', 'Twee keer haakjes', 'twee'),
    noemers: mix(D14, 'tellers', 'Noemers', 'noemers'),
    noemer: mix(D13, 'deelplus', 'Eén noemer', 'noemer'),
    bijzonder: { naam: 'Bijzondere gevallen', gen() { for (;;) { const r = bijzonder(); if (r.antw.speciaal) return { soort: 'bijzonder', ...r }; } } },
  },
  oefenMix: [['beide', 1], ['haakjes', 1], ['minhaak', 1], ['twee', 1], ['noemers', 1], ['noemer', 1], ['bijzonder', 1]],
  test: [['noemer', 1], ['beide', 2], ['haakjes', 2], ['minhaak', 1], ['twee', 1], ['noemers', 2], ['bijzonder', 1]], testSchudden: true,
};

Leerpaden.registreer({
  code: 'remediering-vergelijkingen',
  titel: 'Eerstegraadsvergelijkingen',
  ondertitel: 'Remediëring · 4DOF',
  klas: '4DOF',
  soort: 'remediëring',
  intro: `<p>Je werkt stap voor stap: elke stap is maar een klein beetje moeilijker dan de vorige. Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test.
    Haal je <b>8 op 10</b>, dan gaat de volgende stap open. Schrijf je oplossing altijd als $V = \\{\\ldots\\}$.</p>`,
  groepen: [
    { titel: 'A · Eén bewerking', delen: [1, 2, 3, 4] },
    { titel: 'B · Twee bewerkingen', delen: [5, 6, 7] },
    { titel: 'C · x in beide leden', delen: [8, 9] },
    { titel: 'D · Haakjes', delen: [10, 11, 12] },
    { titel: 'E · Noemers', delen: [13, 14] },
    { titel: 'F · Bijzondere gevallen en eindtest', delen: [15, 16] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15, D16],
});
})();
