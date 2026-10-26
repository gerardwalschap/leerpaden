// Programma 'merkwaardige-producten-ontbinden' — automatisch samengevoegd uit bron/merkwaardige-producten-ontbinden/ (niet rechtstreeks bewerken)
(() => {
// ===== Remediëring merkwaardige producten, ontbinden en discriminant (4DOF) — hulpmiddelen =====
// Leidraad: cursus TWiskunde 4BW, hoofdstuk 1 Tweedegraadsvergelijkingen (G. Walschap).
const { rnd, kies } = W;
const ggd = W.ggd;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const teken = () => kies([-1, 1]);
const isKw = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));

// ---- veeltermen als tekst (zoals een leerling ze typt) en als TeX
// monoom: c·letters, bv. mono(3, 'x^2y') = '3x^2y', mono(-1, 'x') = '-x', mono(5) = '5'
const mono = (c, l = '') => l ? (c === 1 ? '' : c === -1 ? '-' : String(c)) + l : String(c);
// som van termen (tekst): ['x^2', '-3x', '5'] -> 'x^2 - 3x + 5'
const som = (ts) => ts.filter(t => t !== '0' && t !== '').map((t, i) => i ? (t[0] === '-' ? ` - ${t.slice(1)}` : ` + ${t}`) : t).join('');
// x + c  (c geheel getal)
const lin = (v, c) => c === 0 ? v : c > 0 ? `${v} + ${c}` : `${v} - ${-c}`;
const etx = (s) => VT.texVan(s);           // TeX zoals geschreven
const vtx = (s) => VT.uitgewerktTex(s);    // TeX van de uitgewerkte en herleide vorm
// TeX van een term in een formule: tussen haakjes als het geen enkele letter of getal is
const P = (s) => /^([a-z]|\d+)$/.test(s) ? s : `\\left(${etx(s)}\\right)`;
const tg = (x) => W.texGetal(x);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const bt = (p, q) => W.breukTex(p, q);

// ---- vragen
const uitwerk = (soort, s, uitleg, extra = {}) => ({ soort, tex: etx(s), antw: { soort: 'veelterm', expr: s, vorm: 'uitgewerkt', tex: vtx(s) }, uitleg, ...extra });
// f = de volledig ontbonden vorm (tekst); opg = TeX van de opgave (standaard: uitgewerkt)
const ontbind = (soort, f, uitleg, opg = null, extra = {}) => ({ soort, tex: opg || vtx(f), antw: { soort: 'veelterm', expr: f, vorm: 'ontbonden', tex: etx(f) }, uitleg, ...extra });

// ---- letters en monomen om mee te werken
const LETTER = () => kies(['x', 'x', 'x', 'a', 'y', 'p']);
const TWEE = () => kies([['x', 'y'], ['a', 'b'], ['p', 'q'], ['x', 'y']]);

const OPDR_MP = 'Werk uit met een merkwaardig product.';
const OPDR_ONT = 'Ontbind volledig in factoren.';
const OPDR_D = 'Los op met de discriminantmethode.';

const FORMULES = `<div class="kader def"><div class="kader-titel">De merkwaardige producten</div>
  <table class="tabel"><tr><td>kwadraat van een som</td><td>$(a+b)^2 = a^2 + 2ab + b^2$</td></tr>
  <tr><td>kwadraat van een verschil</td><td>$(a-b)^2 = a^2 - 2ab + b^2$</td></tr>
  <tr><td>product van een som en een verschil</td><td>$(a+b)(a-b) = a^2 - b^2$</td></tr>
  <tr><td>derde macht van een som</td><td>$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$</td></tr>
  <tr><td>derde macht van een verschil</td><td>$(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$</td></tr></table></div>`;

const STAPPENPLAN = `<div class="kader werk"><div class="kader-titel">Stappenplan om te ontbinden</div>
  <ol><li>Kijk eerst of er een <b>gemeenschappelijke factor</b> buiten haakjes kan.</li>
  <li>Controleer daarna of je een <b>merkwaardig product</b> herkent.</li>
  <li>Herken je geen merkwaardig product, gebruik dan de <b>product-som methode</b>.</li>
  <li>Heeft de veelterm <b>vier termen</b>, probeer dan te <b>groeperen</b>.</li></ol></div>`;

const DISCR = `<div class="kader def"><div class="kader-titel">De discriminantmethode</div>
  <p>Schrijf de vergelijking in de standaardvorm $ax^2 + bx + c = 0$ (met $a \\neq 0$) en bereken de <b>discriminant</b>:</p>
  <p class="midden">$D = b^2 - 4ac$</p>
  <table class="tabel"><tr><th>Discriminant</th><th>Aantal oplossingen</th><th>Notatie</th></tr>
  <tr><td>$D > 0$</td><td>2 verschillende oplossingen</td><td>$V = \\{x_1 ; x_2\\}$</td></tr>
  <tr><td>$D = 0$</td><td>1 oplossing (dubbele wortel)</td><td>$V = \\{x\\}$</td></tr>
  <tr><td>$D < 0$</td><td>geen oplossingen in $\\mathbb{R}$</td><td>$V = \\varnothing$</td></tr></table>
  <p>Als $D > 0$: $\\;x_1 = \\dfrac{-b + \\sqrt{D}}{2a}\\;$ en $\\;x_2 = \\dfrac{-b - \\sqrt{D}}{2a}$. &nbsp; Als $D = 0$: $\\;x = \\dfrac{-b}{2a}$.</p></div>`;

const INTYPEN = `<div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
  <ul><li>Een macht typ je met <code>^</code> of met de knop: <code>x^2</code> of <code>x²</code>.</li>
  <li>Een maalteken mag je weglaten: <code>3x(x - 4)</code> betekent $3x \\cdot (x-4)$.</li>
  <li>Onder het vakje zie je hoe je antwoord gelezen wordt. Kijk dat even na.</li></ul></div>`;
const INTYPEN_V = `<div class="kader"><div class="kader-titel">Zo noteer je de oplossingen</div>
  <p>In het vakje tussen de accolades typ je de oplossingen, met een <b>puntkomma</b> ertussen: <code>2 ; -3</code>.
  Een breuk mag: <code>-1/3</code>. Is een oplossing geen mooi getal, rond dan af op <b>2 cijfers na de komma</b>: <code>3,41</code>.
  Geen oplossingen? Klik op de knop $V = \\varnothing$.</p></div>`;

// ---- discriminant: vergelijking ax² + bx + c = 0 en de volledige uitwerking
function vgl(a, b, c, rechts = '0') { return `${etx(som([mono(a, 'x^2'), mono(b, 'x'), String(c)].filter((t, i) => [a, b, c][i] !== 0)))} = ${rechts}`; }
function discrUitleg(a, b, c) {
  const D = b * b - 4 * a * c;
  const L = [`a = ${tg(a)},\\; b = ${tg(b)},\\; c = ${tg(c)}`,
    `D = b^2 - 4ac = ${h(b)}^2 - 4 \\cdot ${h(a)} \\cdot ${h(c)} = ${tg(D)}`];
  let waarden = [], tex = [];
  if (D < 0) { L.push('D < 0 \\;\\Rightarrow\\; \\text{geen oplossingen}', 'V = \\varnothing'); return { D, L, waarden, tex }; }
  if (D === 0) {
    const t = bt(-b, 2 * a); waarden = [-b / (2 * a)]; tex = [t];
    L.push('D = 0 \\;\\Rightarrow\\; \\text{1 oplossing}', `x = \\dfrac{-b}{2a} = \\dfrac{${tg(-b)}}{${tg(2 * a)}} = ${t}`, `V = \\{${t}\\}`);
    return { D, L, waarden, tex };
  }
  L.push('D > 0 \\;\\Rightarrow\\; \\text{2 oplossingen}');
  const w = Math.sqrt(D), mooi = isKw(D);
  const xs = [(-b + w) / (2 * a), (-b - w) / (2 * a)];
  ['+', '-'].forEach((op, i) => {
    const t = mooi ? bt(op === '+' ? -b + w : -b - w, 2 * a) : W.texGetal(W.rond(xs[i], 2));
    tex.push(t);
    L.push(`x_${i + 1} = \\dfrac{${tg(-b)} ${op} ${mooi ? tg(w) : `\\sqrt{${tg(D)}}`}}{${tg(2 * a)}} ${mooi ? '=' : '\\approx'} ${t}`);
  });
  if (xs[0] > xs[1]) { xs.reverse(); tex.reverse(); }
  waarden = xs;
  L.push(`V = \\{${tex.join('\\,;\\,')}\\}`);
  return { D, L, waarden, tex };
}
const Vantw = (r) => r.waarden.length ? { soort: 'Vmeer', waarden: r.waarden, tex: r.tex, dec: 2 } : { soort: 'Vmeer', waarden: [], leeg: true };
// ===================================================================
//  A · MERKWAARDIGE PRODUCTEN
// ===================================================================

// (A + B)² of (A − B)²  — A en B zijn monomen als tekst (zonder minteken)
function kwadraat(soort, A, B, op) {
  const s = `(${A} ${op} ${B})^2`;
  return uitwerk(soort, s, [`${etx(s)} = ${P(A)}^2 ${op} 2 \\cdot ${etx(A)} \\cdot ${etx(B)} + ${P(B)}^2`, `= ${vtx(s)}`]);
}
const GETAL = () => rnd(1, 12);

const D1 = {
  nr: 1, titel: 'Kwadraat van een som: (x + a)²', kort: 'Het kwadraat van een som met een letter en een getal.', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat van een som</div>
      <p class="midden">$(a+b)^2 = (a+b)(a+b) = a^2 + 2ab + b^2$</p>
      <p>Het kwadraat van een som is het <b>kwadraat van de eerste term</b>, plus <b>twee keer het product</b> van beide termen, plus het <b>kwadraat van de tweede term</b>.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$(x+7)^2 = x^2 + 2 \\cdot x \\cdot 7 + 7^2 = x^2 + 14x + 49$</p>
      <p class="klein">Toepassing: $52^2 = (50+2)^2 = 2500 + 200 + 4 = 2704$.</p>
      <p class="let-op">Let op: $(x+7)^2$ is <b>niet</b> $x^2 + 49$. De middelste term $2ab$ mag je niet vergeten!</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(x+3)^2', stappen: ['= x^2 + 2 \\cdot x \\cdot 3 + 3^2', '= x^2 + 6x + 9'] },
    { tex: '(a+8)^2', stappen: ['= a^2 + 2 \\cdot a \\cdot 8 + 8^2', '= a^2 + 16a + 64'] },
    { tex: '(5+y)^2', stappen: ['= 5^2 + 2 \\cdot 5 \\cdot y + y^2', '= 25 + 10y + y^2 = y^2 + 10y + 25'] },
  ],
  soorten: {
    som: { naam: '(x + a)²', gen() { return kwadraat('som', LETTER(), String(GETAL()), '+'); } },
    voor: { naam: '(a + x)²', gen() { return kwadraat('voor', String(GETAL()), LETTER(), '+'); } },
  },
  oefenMix: [['som', 3], ['voor', 1]],
  test: [['som', 7], ['voor', 3]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Kwadraat van een som: (ax + by)²', kort: 'Ook met een getal voor de letter, twee letters of een macht.', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat van een som</div>
      <p class="midden">$(a+b)^2 = a^2 + 2ab + b^2$</p>
      <p>De letters $a$ en $b$ in de formule mogen ook <b>termen</b> zijn zoals $2x$, $3y$ of $x^2$.
      Zet zo'n term tussen haakjes als je hem kwadrateert: $(2x)^2 = 4x^2$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(2x+5)^2 = (2x)^2 + 2 \\cdot 2x \\cdot 5 + 5^2 = 4x^2 + 20x + 25$</p>
      <p class="midden">$(3a+2b)^2 = (3a)^2 + 2 \\cdot 3a \\cdot 2b + (2b)^2 = 9a^2 + 12ab + 4b^2$</p>
      <p class="midden">$(x^2+4)^2 = (x^2)^2 + 2 \\cdot x^2 \\cdot 4 + 4^2 = x^4 + 8x^2 + 16$</p>
      <p class="let-op">Let op: $(2x)^2 = 2x \\cdot 2x = 4x^2$, niet $2x^2$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(2x+3)^2', stappen: ['= (2x)^2 + 2 \\cdot 2x \\cdot 3 + 3^2', '= 4x^2 + 12x + 9'] },
    { tex: '(4x+11)^2', stappen: ['= (4x)^2 + 2 \\cdot 4x \\cdot 11 + 11^2', '= 16x^2 + 88x + 121'] },
    { tex: '(p+2q)^2', stappen: ['= p^2 + 2 \\cdot p \\cdot 2q + (2q)^2', '= p^2 + 4pq + 4q^2'] },
    { tex: '(x^2+1)^2', stappen: ['= (x^2)^2 + 2 \\cdot x^2 \\cdot 1 + 1^2', '= x^4 + 2x^2 + 1'] },
  ],
  soorten: {
    coef: { naam: '(ax + b)²', gen() { return kwadraat('coef', mono(rnd(2, 9), LETTER()), String(rnd(1, 12)), '+'); } },
    twee: { naam: '(ax + by)²', gen() { const [u, v] = TWEE(); return kwadraat('twee', mono(rnd(1, 6), u), mono(rnd(1, 7), v), '+'); } },
    macht: { naam: '(x² + b)²', gen() { return kwadraat('macht', mono(rnd(1, 3), kies(['x^2', 'x^2', 'x^3', 'a^2'])), String(rnd(1, 9)), '+'); } },
  },
  oefenMix: [['coef', 3], ['twee', 2], ['macht', 1]],
  test: [['coef', 5], ['twee', 3], ['macht', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Kwadraat van een verschil: (a − b)²', kort: 'Zelfde werkwijze, maar de middelste term krijgt een minteken.', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat van een verschil</div>
      <p class="midden">$(a-b)^2 = (a-b)(a-b) = a^2 - 2ab + b^2$</p>
      <p>Alleen de <b>middelste term</b> krijgt een minteken. Het laatste kwadraat $b^2$ is altijd positief.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(x-4)^2 = x^2 - 2 \\cdot x \\cdot 4 + 4^2 = x^2 - 8x + 16$</p>
      <p class="midden">$(3x-4)^2 = (3x)^2 - 2 \\cdot 3x \\cdot 4 + 4^2 = 9x^2 - 24x + 16$</p>
      <p class="midden">$(7-2x)^2 = 7^2 - 2 \\cdot 7 \\cdot 2x + (2x)^2 = 49 - 28x + 4x^2$</p>
      <p class="klein">Toepassing: $49^2 = (50-1)^2 = 2500 - 100 + 1 = 2401$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(x-1)^2', stappen: ['= x^2 - 2 \\cdot x \\cdot 1 + 1^2', '= x^2 - 2x + 1'] },
    { tex: '(5x-12)^2', stappen: ['= (5x)^2 - 2 \\cdot 5x \\cdot 12 + 12^2', '= 25x^2 - 120x + 144'] },
    { tex: '(2a-3b)^2', stappen: ['= (2a)^2 - 2 \\cdot 2a \\cdot 3b + (3b)^2', '= 4a^2 - 12ab + 9b^2'] },
  ],
  soorten: {
    basis: { naam: '(x − a)²', gen() { return kwadraat('basis', LETTER(), String(GETAL()), '-'); } },
    coef: { naam: '(ax − b)²', gen() { return kwadraat('coef', mono(rnd(2, 9), LETTER()), String(rnd(1, 12)), '-'); } },
    twee: { naam: '(ax − by)²', gen() { const [u, v] = TWEE(); return kwadraat('twee', mono(rnd(1, 6), u), mono(rnd(1, 7), v), '-'); } },
    getalvoor: { naam: '(a − bx)²', gen() { return kwadraat('getalvoor', String(rnd(1, 9)), mono(rnd(1, 6), LETTER()), '-'); } },
  },
  oefenMix: [['basis', 2], ['coef', 2], ['twee', 2], ['getalvoor', 1]],
  test: [['basis', 3], ['coef', 3], ['twee', 2], ['getalvoor', 2]], testSchudden: true,
};

// (−A − B)² = (A + B)²   en   (−A + B)² = (A − B)²
function minKwadraat(soort, A, B, op) {
  const s = `(-${A} ${op} ${B})^2`;
  const zelfde = op === '-' ? `(${A} + ${B})^2` : `(${A} - ${B})^2`;
  const o2 = op === '-' ? '+' : '-';
  return uitwerk(soort, s, [
    `${etx(s)} = ${etx(zelfde)} \\qquad \\text{(kwadraat van het tegengestelde)}`,
    `= ${P(A)}^2 ${o2} 2 \\cdot ${etx(A)} \\cdot ${etx(B)} + ${P(B)}^2`, `= ${vtx(s)}`]);
}
const D4 = {
  nr: 4, titel: 'Mintekens: (−a − b)² en (−a + b)²', kort: 'Een minteken voor de eerste term: kijk goed naar de tekens.', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader eig"><div class="kader-titel">Het kwadraat van het tegengestelde</div>
      <p>Een getal en zijn tegengestelde hebben hetzelfde kwadraat: $(-5)^2 = 5^2 = 25$. Dat geldt ook voor veeltermen:</p>
      <p class="midden">$(-a-b)^2 = (a+b)^2 \\qquad (-a+b)^2 = (a-b)^2$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(-x-6)^2 = (x+6)^2 = x^2 + 12x + 36$</p>
      <p class="midden">$(-x+5)^2 = (x-5)^2 = x^2 - 10x + 25$</p>
      <p class="klein">Je mag ook gewoon de formule toepassen met $a = -x$: $(-x)^2 + 2 \\cdot (-x) \\cdot 5 + 5^2 = x^2 - 10x + 25$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(-x-3)^2', stappen: ['= (x+3)^2', '= x^2 + 2 \\cdot x \\cdot 3 + 3^2', '= x^2 + 6x + 9'] },
    { tex: '(-a+8)^2', stappen: ['= (a-8)^2', '= a^2 - 2 \\cdot a \\cdot 8 + 8^2', '= a^2 - 16a + 64'] },
    { tex: '(-3a-2b)^2', stappen: ['= (3a+2b)^2', '= (3a)^2 + 2 \\cdot 3a \\cdot 2b + (2b)^2', '= 9a^2 + 12ab + 4b^2'] },
  ],
  soorten: {
    minmin: { naam: '(−x − a)²', gen() { return minKwadraat('minmin', kies([LETTER(), mono(rnd(2, 6), LETTER())]), String(GETAL()), '-'); } },
    minplus: { naam: '(−x + a)²', gen() { return minKwadraat('minplus', kies([LETTER(), mono(rnd(2, 6), LETTER())]), String(GETAL()), '+'); } },
    twee: { naam: '(−ax ± by)²', gen() { const [u, v] = TWEE(); return minKwadraat('twee', mono(rnd(1, 5), u), mono(rnd(1, 6), v), kies(['+', '-'])); } },
  },
  oefenMix: [['minmin', 2], ['minplus', 2], ['twee', 1]],
  test: [['minmin', 4], ['minplus', 4], ['twee', 2]], testSchudden: true,
};

// (A + B)(A − B) in verschillende volgordes
function somVerschil(soort, A, B, vorm = 0) {
  const vormen = [`(${A} + ${B})(${A} - ${B})`, `(${A} - ${B})(${A} + ${B})`, `(${B} + ${A})(${B} - ${A})`, `(-${A} + ${B})(${A} + ${B})`];
  const s = vormen[vorm];
  const L = [];
  if (vorm === 3) L.push(`${etx(s)} = ${etx(`(${B} - ${A})(${B} + ${A})`)} \\qquad \\text{(herschikken)}`, `= ${P(B)}^2 - ${P(A)}^2`);
  else if (vorm === 2) L.push(`${etx(s)} = ${P(B)}^2 - ${P(A)}^2`);
  else L.push(`${etx(s)} = ${P(A)}^2 - ${P(B)}^2`);
  L.push(`= ${vtx(s)}`);
  return uitwerk(soort, s, L);
}
const D5 = {
  nr: 5, titel: 'Product van een som en een verschil', kort: '(a + b)(a − b) = a² − b²', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Product van een som en een verschil</div>
      <p class="midden">$(a+b)(a-b) = a^2 - b^2$</p>
      <p>Het kwadraat van de term die in beide factoren <b>hetzelfde teken</b> heeft, min het kwadraat van de term met <b>tegengestelde tekens</b>.
      De middelste termen vallen weg: $-ab + ab = 0$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden</div>
      <p class="midden">$(x+4)(x-4) = x^2 - 4^2 = x^2 - 16$</p>
      <p class="midden">$(2x+5y)(2x-5y) = (2x)^2 - (5y)^2 = 4x^2 - 25y^2$</p>
      <p class="midden">$(-3x+8)(3x+8) = (8-3x)(8+3x) = 8^2 - (3x)^2 = 64 - 9x^2$</p>
      <p class="klein">Toepassing: $21 \\times 19 = (20+1)(20-1) = 400 - 1 = 399$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(x+3)(x-3)', stappen: ['= x^2 - 3^2', '= x^2 - 9'] },
    { tex: '(3x+5)(3x-5)', stappen: ['= (3x)^2 - 5^2', '= 9x^2 - 25'] },
    { tex: '(x^2+3)(x^2-3)', stappen: ['= (x^2)^2 - 3^2', '= x^4 - 9'] },
    { tex: '(-x+3)(x+3)', stappen: ['= (3-x)(3+x)', '= 3^2 - x^2', '= 9 - x^2'] },
  ],
  soorten: {
    basis: { naam: '(x + a)(x − a)', gen() { return somVerschil('basis', LETTER(), String(GETAL()), rnd(0, 1)); } },
    coef: { naam: '(ax + b)(ax − b)', gen() { return somVerschil('coef', mono(rnd(2, 9), LETTER()), String(rnd(1, 12)), rnd(0, 1)); } },
    twee: { naam: '(ax + by)(ax − by)', gen() { const [u, v] = TWEE(); return somVerschil('twee', mono(rnd(1, 9), u), mono(rnd(1, 7), v), rnd(0, 1)); } },
    volgorde: { naam: 'Andere volgorde', gen() { return somVerschil('volgorde', mono(rnd(1, 7), 'x'), String(rnd(1, 9)), kies([2, 3])); } },
    macht: { naam: '(x² + a)(x² − a)', gen() { return somVerschil('macht', mono(rnd(1, 3), 'x^2'), String(rnd(1, 9)), rnd(0, 1)); } },
  },
  oefenMix: [['basis', 2], ['coef', 2], ['twee', 2], ['volgorde', 1], ['macht', 1]],
  test: [['basis', 2], ['coef', 3], ['twee', 2], ['volgorde', 2], ['macht', 1]], testSchudden: true,
};

function derde(soort, A, B, op) {
  const s = `(${A} ${op} ${B})^3`;
  return uitwerk(soort, s, [`${etx(s)} = ${P(A)}^3 ${op} 3 \\cdot ${P(A)}^2 \\cdot ${etx(B)} + 3 \\cdot ${etx(A)} \\cdot ${P(B)}^2 ${op} ${P(B)}^3`, `= ${vtx(s)}`]);
}
const D6 = {
  nr: 6, titel: 'Derde macht van een som of verschil', kort: '(a ± b)³ = a³ ± 3a²b + 3ab² ± b³', rekenmachine: false, opdracht: OPDR_MP,
  theorie: `<div class="kader def"><div class="kader-titel">Derde macht van een som en van een verschil</div>
      <p class="midden">$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$</p>
      <p class="midden">$(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$</p>
      <p>Deze twee regels moet je herkennen. Bij een verschil wisselen de tekens af: $+\\;-\\;+\\;-$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$(2x-1)^3 = (2x)^3 - 3 \\cdot (2x)^2 \\cdot 1 + 3 \\cdot 2x \\cdot 1^2 - 1^3 = 8x^3 - 12x^2 + 6x - 1$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '(x+2)^3', stappen: ['= x^3 + 3 \\cdot x^2 \\cdot 2 + 3 \\cdot x \\cdot 2^2 + 2^3', '= x^3 + 6x^2 + 12x + 8'] },
    { tex: '(x-3)^3', stappen: ['= x^3 - 3 \\cdot x^2 \\cdot 3 + 3 \\cdot x \\cdot 3^2 - 3^3', '= x^3 - 9x^2 + 27x - 27'] },
    { tex: '(2a+1)^3', stappen: ['= (2a)^3 + 3 \\cdot (2a)^2 \\cdot 1 + 3 \\cdot 2a \\cdot 1^2 + 1^3', '= 8a^3 + 12a^2 + 6a + 1'] },
  ],
  soorten: {
    som: { naam: '(x + a)³', gen() { return derde('som', LETTER(), String(rnd(1, 5)), '+'); } },
    verschil: { naam: '(x − a)³', gen() { return derde('verschil', LETTER(), String(rnd(1, 5)), '-'); } },
    coef: { naam: '(ax ± b)³', gen() { return derde('coef', mono(rnd(2, 3), LETTER()), String(rnd(1, 3)), kies(['+', '-'])); } },
  },
  oefenMix: [['som', 2], ['verschil', 2], ['coef', 1]],
  test: [['som', 4], ['verschil', 4], ['coef', 2]], testSchudden: true,
};

// getal ervoor: k(A ± B)²  of  k(A + B)(A − B)
function metFactor(soort) {
  const k = kies([2, 3, 4, 5, -2, -3, -4, -5, -10]);
  const kx = kies(['', '', 'x']);
  const K = kx ? mono(k, 'x') : String(k);
  const A = kies(['x^2', 'x', mono(rnd(2, 4), 'x')]), B = String(rnd(1, 6));
  const r = rnd(0, 2), op = r === 0 ? '+' : '-';
  const bin = r < 2 ? `(${A} ${op} ${B})^2` : `(${A} + ${B})(${A} - ${B})`;
  const s = `${K}${bin}`;
  return uitwerk(soort, s, [`\\text{eerst } ${etx(bin)} = ${vtx(bin)}`, `${etx(s)} = ${etx(K)} \\cdot \\left(${vtx(bin)}\\right)`, `= ${vtx(s)}`]);
}
// (A ± B)² − (C + D)(C − D)  of  (A + B)² + (A − B)²
function verschilVanTwee(soort) {
  const a = rnd(1, 3), b = rnd(1, 6), c = rnd(1, 2), d = rnd(1, 6);
  const A = mono(a, 'x'), C = mono(c, 'x');
  const op = kies(['+', '-']);
  const p1 = `(${A} ${op} ${b})^2`, p2 = `(${C} + ${d})(${C} - ${d})`;
  const s = `${p1} - ${p2}`;
  const neg = vtx(`-(${p2})`);
  return uitwerk(soort, s, [`${etx(s)} = \\left(${vtx(p1)}\\right) - \\left(${vtx(p2)}\\right)`,
    `= ${vtx(p1)} ${neg.startsWith('-') ? neg : '+ ' + neg} \\qquad \\text{(minteken voor de haakjes!)}`,
    `= ${vtx(s)}`]);
}
const D7 = {
  nr: 7, titel: 'Werk uit en herleid', kort: 'Een factor voor het merkwaardig product, of twee producten na elkaar.', rekenmachine: false, opdracht: 'Werk de haakjes weg en herleid. Gebruik daarbij een merkwaardig product.',
  theorie: `${FORMULES}
    <div class="kader werk"><div class="kader-titel">Staat er een factor voor?</div>
      <p>Werk <b>eerst</b> het merkwaardig product uit. Vermenigvuldig daarna elke term met de factor ervoor.</p>
      <p class="midden">$-2(x^2+3)^2 = -2(x^4 + 6x^2 + 9) = -2x^4 - 12x^2 - 18$</p>
      <p class="midden">$-4x(x^2-2x)^2 = -4x(x^4 - 4x^3 + 4x^2) = -4x^5 + 16x^4 - 16x^3$</p></div>
    <div class="kader eig"><div class="kader-titel">Minteken voor een product</div>
      <p>Werk beide producten uit en zet het tweede tussen haakjes. Een minteken voor de haakjes verandert <b>alle</b> tekens:</p>
      <p class="midden">$(2x-3)^2 - (x+4)(x-4) = (4x^2 - 12x + 9) - (x^2 - 16) = 4x^2 - 12x + 9 - x^2 + 16 = 3x^2 - 12x + 25$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '5(x^2+1)^2', stappen: ['= 5(x^4 + 2x^2 + 1)', '= 5x^4 + 10x^2 + 5'] },
    { tex: '-3(x+2)(x-2)', stappen: ['= -3(x^2 - 4)', '= -3x^2 + 12'] },
    { tex: '(x+5)^2 - (x+1)(x-1)', stappen: ['= (x^2 + 10x + 25) - (x^2 - 1)', '= x^2 + 10x + 25 - x^2 + 1', '= 10x + 26'] },
  ],
  soorten: {
    factor: { naam: 'Factor ervoor', gen() { return metFactor('factor'); } },
    twee: { naam: 'Twee producten', gen() { return verschilVanTwee('twee'); } },
  },
  oefenMix: [['factor', 2], ['twee', 1]],
  test: [['factor', 6], ['twee', 4]], testSchudden: true,
};

// ===================================================================
//  B · ONTBINDEN IN FACTOREN
// ===================================================================

// k·(inner): inner = lijst termen (tekst) met ggd 1
function gemFactor(soort, G, inner) {
  const f = `${G}(${som(inner)})`;
  return ontbind(soort, f, [`\\text{gemeenschappelijke factor: } ${etx(G)}`, `${vtx(f)} = ${etx(f)}`, `\\text{controle: } ${etx(f)} = ${vtx(f)} \\;✓`]);
}
// twee coëfficiënten met ggd 1
function coprime(maxA, maxB) { for (;;) { const a = rnd(1, maxA), b = rnd(1, maxB); if (ggd(a, b) === 1) return [a, b]; } }
function coprime2(maxA, maxB) { for (;;) { const a = rnd(2, maxA), b = rnd(1, maxB); if (ggd(a, b) === 1) return [a, b]; } }
const D8 = {
  nr: 8, titel: 'Gemeenschappelijke factor: een getal', kort: 'Breng het grootste gemeenschappelijke getal buiten haakjes.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader def"><div class="kader-titel">Ontbinden in factoren</div>
      <p>Ontbinden in factoren is het <b>omgekeerde</b> van een product uitwerken: je herschrijft een veelterm als een <b>product</b> van eenvoudigere factoren.</p></div>
    <div class="kader werk"><div class="kader-titel">Gemeenschappelijke factor buiten haakjes brengen</div>
      <p class="midden">$ac + bc = c(a+b)$</p>
      <p>Zoek de <b>grootste</b> factor die in elke term zit. Zet die voor de haakjes en deel elke term erdoor.</p>
      <p class="midden">$4a - 20 = 4(a-5) \\qquad 6a - 18 = 6(a-3)$</p>
      <p>Zijn alle termen negatief, breng dan ook het minteken buiten haakjes: $-2a - 2b = -2(a+b)$.</p>
      <p class="klein"><b>Controle:</b> werk je antwoord terug uit. Je moet de opgave terugvinden.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '5x + 5y', stappen: ['\\text{gemeenschappelijke factor: } 5', '= 5(x + y)'] },
    { tex: '7x + 14', stappen: ['\\text{gemeenschappelijke factor: } 7', '= 7(x + 2) \\qquad (14 = 7 \\cdot 2)'] },
    { tex: '12x - 18', stappen: ['\\text{gemeenschappelijke factor: } 6 \\;\\text{(niet 2 of 3: neem de grootste)}', '= 6(2x - 3)'] },
    { tex: '-5x + 15', stappen: ['\\text{gemeenschappelijke factor: } -5', '= -5(x - 3)'] },
  ],
  soorten: {
    getal: { naam: 'ax + b', gen() { const k = rnd(2, 9), [a, b] = coprime(5, 9); const v = LETTER(); return gemFactor('getal', String(k), [mono(a, v), String(teken() * b)]); } },
    letters: { naam: 'ax + ay', gen() { const k = rnd(2, 9), [u, v] = TWEE(); return gemFactor('letters', String(k), [u, kies(['', '-']) + v]); } },
    drie: { naam: 'Drie termen', gen() { const k = rnd(2, 6); let a, b, c; do { a = rnd(1, 5); b = rnd(1, 5); c = rnd(1, 5); } while (ggd(ggd(a, b), c) !== 1); return gemFactor('drie', mono(k, 'x'), [mono(a, 'a'), mono(teken() * b, 'b'), mono(teken() * c, 'c')]); } },
    min: { naam: 'Minteken buiten haakjes', gen() { const k = rnd(2, 9), [a, b] = coprime(5, 9); const v = LETTER(); return gemFactor('min', String(-k), [mono(a, v), String(teken() * b)]); } },
  },
  oefenMix: [['getal', 3], ['letters', 1], ['drie', 1], ['min', 1]],
  test: [['getal', 4], ['letters', 2], ['drie', 2], ['min', 2]], testSchudden: true,
};

const D9 = {
  nr: 9, titel: 'Gemeenschappelijke factor: met letters', kort: 'Ook letters en machten kunnen gemeenschappelijk zijn.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader werk"><div class="kader-titel">Gemeenschappelijke factor met letters</div>
      <p>Kijk naar het <b>getal</b> én naar de <b>letters</b>. Een letter is gemeenschappelijk als ze in elke term staat; neem ze met de <b>kleinste exponent</b>.</p>
      <p class="midden">$6x^2 + 9x = 3x(2x + 3)$</p>
      <p class="midden">$15x^2y - 10xy^2 = 5xy(3x - 2y)$</p>
      <p class="midden">$-6a^3 + 9a^2 - 12a = -3a(2a^2 - 3a + 4)$</p></div>
    <div class="kader eig"><div class="kader-titel">Ook een veelterm kan gemeenschappelijk zijn</div>
      <p class="midden">$2x(a-4) + 5(a-4) = (a-4)(2x+5)$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '4x^2 - 8x', stappen: ['\\text{gemeenschappelijke factor: } 4x', '= 4x(x - 2)'] },
    { tex: '12a^2b - 18ab^2', stappen: ['\\text{gemeenschappelijke factor: } 6ab', '= 6ab(2a - 3b)'] },
    { tex: '3x^3 - 6x^2 + 9x', stappen: ['\\text{gemeenschappelijke factor: } 3x', '= 3x(x^2 - 2x + 3)'] },
    { tex: 'x(a-3) - y(a-3)', stappen: ['\\text{gemeenschappelijke factor: } (a - 3)', '= (a - 3)(x - y)'] },
  ],
  soorten: {
    eenletter: { naam: 'ax² + bx', gen() {
      const k = rnd(1, 6), [a, b] = coprime(5, 9), v = LETTER(), e = rnd(1, 2);
      const G = mono(k, e === 1 ? v : `${v}^2`);
      return gemFactor('eenletter', G, [mono(a, v), String(teken() * b)]);
    } },
    tweeletters: { naam: 'Met twee letters', gen() {
      const k = rnd(1, 6), [u, v] = TWEE();
      const G = mono(k, `${u}${v}`);
      const [a, b] = coprime(5, 7);
      return gemFactor('tweeletters', G, [mono(a, u), mono(teken() * b, v)]);
    } },
    drieterm: { naam: 'Drie termen', gen() {
      let a, b, c; do { a = rnd(1, 4); b = nz(-6, 6); c = nz(-9, 9); } while (ggd(ggd(a, b), c) !== 1 || isKw(b * b - 4 * a * c));
      const k = teken() * rnd(1, 5), v = kies(['x', 'a']);
      return gemFactor('drieterm', mono(k, v), [mono(a, `${v}^2`), mono(b, v), String(c)]);
    } },
    veelterm: { naam: 'Gemeenschappelijke veelterm', gen() {
      const v = kies(['x', 'a']), p = nz(-6, 6), [m, n] = coprime(4, 6), w = kies(['y', 'b']);
      const F = `(${lin(v, p)})`, A = mono(m, w), B = String(teken() * n);
      const opg = `${etx(A)}${etx(F)} ${B[0] === '-' ? '-' : '+'} ${B.replace('-', '')}${etx(F)}`;
      const f = `${F}(${som([A, B])})`;
      return ontbind('veelterm', f, [`\\text{gemeenschappelijke factor: } ${etx(F)}`, `= ${etx(f)}`], opg);
    } },
  },
  oefenMix: [['eenletter', 2], ['tweeletters', 2], ['drieterm', 1], ['veelterm', 1]],
  test: [['eenletter', 3], ['tweeletters', 3], ['drieterm', 2], ['veelterm', 2]], testSchudden: true,
};

const D10 = {
  nr: 10, titel: 'Ontbinden door groepering', kort: 'Vier termen: groepeer per twee en zoek een gemeenschappelijke factor.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader werk"><div class="kader-titel">Ontbinden door groepering</div>
      <p>Heeft de veelterm <b>vier termen</b>, maak dan twee groepen van twee. Breng in elke groep de gemeenschappelijke factor buiten haakjes.
      Krijg je in beide groepen dezelfde factor tussen haakjes, dan breng je die op zijn beurt buiten haakjes.</p>
      <p class="midden">$ax + ay + bx + by = a(x+y) + b(x+y) = (x+y)(a+b)$</p>
      <p class="midden">$x^3 + 2x^2 - 5x - 10 = x^2(x+2) - 5(x+2) = (x+2)(x^2-5)$</p>
      <p class="let-op">Let op het minteken bij de tweede groep: $-5x - 10 = -5(x + 2)$.</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'ax + ay + bx + by', stappen: ['= a(x + y) + b(x + y)', '= (x + y)(a + b)'] },
    { tex: '3ax + 6a + bx + 2b', stappen: ['= 3a(x + 2) + b(x + 2)', '= (x + 2)(3a + b)'] },
    { tex: 'x^3 - 3x^2 + 4x - 12', stappen: ['= x^2(x - 3) + 4(x - 3)', '= (x - 3)(x^2 + 4)'] },
  ],
  soorten: {
    letters: { naam: 'ax + ay + bx + by', gen() {
      // (x + p)(m·a + n·b) uitgewerkt in de volgorde  m·a·x + m·p·a + n·b·x + n·p·b
      const p = nz(-7, 7), [m, n] = coprime(4, 5), sn = teken();
      const t = [mono(m, 'ax'), mono(m * p, 'a'), mono(sn * n, 'bx'), mono(sn * n * p, 'b')];
      const f = `(${lin('x', p)})(${som([mono(m, 'a'), mono(sn * n, 'b')])})`;
      const g1 = `${mono(m, 'a')}(${lin('x', p)})`, g2 = `${mono(sn * n, 'b')}(${lin('x', p)})`;
      return ontbind('letters', f, [`= ${etx(g1)} ${sn < 0 ? '' : '+'} ${etx(g2)}`, `= ${etx(f)}`], etx(som(t)));
    } },
    derde: { naam: 'x³ + ax² + bx + ab', gen() {
      // (x + p)(x² + q) = x³ + p·x² + q·x + p·q,  q geen negatief kwadraat (anders verder te ontbinden)
      const p = nz(-6, 6); let q; do { q = nz(-9, 9); } while (q < 0 && isKw(-q));
      const t = [mono(1, 'x^3'), mono(p, 'x^2'), mono(q, 'x'), String(p * q)];
      const f = `(${lin('x', p)})(${som(['x^2', String(q)])})`;
      return ontbind('derde', f, [`= ${etx(`x^2(${lin('x', p)})`)} ${q < 0 ? '-' : '+'} ${etx(`${Math.abs(q)}(${lin('x', p)})`)}`, `= ${etx(f)}`], etx(som(t)));
    } },
  },
  oefenMix: [['letters', 1], ['derde', 1]],
  test: [['letters', 5], ['derde', 5]], testSchudden: true,
};

// A² − B²  = (A − B)(A + B)
function verschilKw(soort, A, B, omgekeerd = false) {
  const f = omgekeerd ? `(${B} - ${A})(${B} + ${A})` : `(${A} - ${B})(${A} + ${B})`;
  const s = omgekeerd ? `${vtx(`(${B})^2`)} - ${vtx(`(${A})^2`)}` : vtx(f);
  return ontbind(soort, f, [`= ${omgekeerd ? `${P(B)}^2 - ${P(A)}^2` : `${P(A)}^2 - ${P(B)}^2`}`, `= ${etx(f)}`], s);
}
const D11 = {
  nr: 11, titel: 'Verschil van twee kwadraten', kort: 'a² − b² = (a + b)(a − b)', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader def"><div class="kader-titel">Verschil van twee kwadraten herkennen</div>
      <p class="midden">$a^2 - b^2 = (a+b)(a-b)$</p>
      <p>Twee termen, allebei een kwadraat, met een <b>min</b> ertussen. Zoek waarvan elke term het kwadraat is.</p>
      <p class="midden">$x^2 - 16 = x^2 - 4^2 = (x+4)(x-4)$</p>
      <p class="midden">$9x^2 - 49 = (3x)^2 - 7^2 = (3x-7)(3x+7)$</p>
      <p class="let-op">Een <b>som</b> van twee kwadraten, zoals $x^2 + 16$, kan je niet ontbinden.</p></div>
    <div class="kader eig"><div class="kader-titel">Soms twee keer</div>
      <p class="midden">$x^4 - 16 = (x^2-4)(x^2+4) = (x-2)(x+2)(x^2+4)$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'x^2 - 9', stappen: ['= x^2 - 3^2', '= (x + 3)(x - 3)'] },
    { tex: '4a^2 - 81b^2', stappen: ['= (2a)^2 - (9b)^2', '= (2a + 9b)(2a - 9b)'] },
    { tex: '100 - x^2', stappen: ['= 10^2 - x^2', '= (10 + x)(10 - x)'] },
    { tex: 'a^4 - b^4', stappen: ['= (a^2)^2 - (b^2)^2 = (a^2 - b^2)(a^2 + b^2)', '= (a - b)(a + b)(a^2 + b^2)'] },
  ],
  soorten: {
    basis: { naam: 'x² − a²', gen() { return verschilKw('basis', LETTER(), String(rnd(1, 12))); } },
    coef: { naam: 'a²x² − b²', gen() { const [a, b] = coprime2(9, 11); return verschilKw('coef', mono(a, LETTER()), String(b)); } },
    twee: { naam: 'a²x² − b²y²', gen() { const [a, b] = coprime(9, 9); const [u, v] = TWEE(); return verschilKw('twee', mono(a, u), mono(b, v)); } },
    getalvoor: { naam: 'a² − x²', gen() { const [b, a] = coprime(12, 5); return verschilKw('getalvoor', mono(a, LETTER()), String(b), true); } },
    vierde: { naam: 'x⁴ − a⁴', gen() {
      const a = rnd(1, 3), v = kies(['x', 'a']);
      const f = `(${lin(v, -a)})(${lin(v, a)})(${v}^2 + ${a * a})`;
      return ontbind('vierde', f, [`= (${v}^2)^2 - ${a * a}^2 = ${etx(`(${v}^2 - ${a * a})(${v}^2 + ${a * a})`)}`, `= ${etx(f)}`]);
    } },
  },
  oefenMix: [['basis', 2], ['coef', 2], ['twee', 2], ['getalvoor', 1], ['vierde', 1]],
  test: [['basis', 2], ['coef', 3], ['twee', 2], ['getalvoor', 2], ['vierde', 1]], testSchudden: true,
};

// A² ± 2AB + B²  = (A ± B)²
function volkomen(soort, A, B, op) {
  const f = `(${A} ${op} ${B})^2`;
  return ontbind(soort, f, [`= ${P(A)}^2 ${op} 2 \\cdot ${etx(A)} \\cdot ${etx(B)} + ${P(B)}^2`, `= ${etx(f)}`]);
}
const D12 = {
  nr: 12, titel: 'Volkomen kwadraat herkennen', kort: 'a² ± 2ab + b² = (a ± b)²', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader def"><div class="kader-titel">Kwadraat van een som of verschil herkennen</div>
      <p class="midden">$a^2 + 2ab + b^2 = (a+b)^2 \\qquad a^2 - 2ab + b^2 = (a-b)^2$</p>
      <p>Drie termen: twee ervan zijn een <b>kwadraat</b> (en positief). Controleer of de derde term gelijk is aan <b>twee keer het product</b>. Het teken van de middelste term bepaalt of het een som of een verschil is.</p>
      <p class="midden">$x^2 + 6x + 9 = x^2 + 2 \\cdot x \\cdot 3 + 3^2 = (x+3)^2$</p>
      <p class="midden">$4x^2 - 20x + 25 = (2x)^2 - 2 \\cdot 2x \\cdot 5 + 5^2 = (2x-5)^2$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'a^2 + 8a + 16', stappen: ['= a^2 + 2 \\cdot a \\cdot 4 + 4^2', '= (a + 4)^2'] },
    { tex: 'p^2 - 10p + 25', stappen: ['= p^2 - 2 \\cdot p \\cdot 5 + 5^2', '= (p - 5)^2'] },
    { tex: '9x^2 + 24xy + 16y^2', stappen: ['= (3x)^2 + 2 \\cdot 3x \\cdot 4y + (4y)^2', '= (3x + 4y)^2'] },
    { tex: 'x^4 + 2x^2 + 1', stappen: ['= (x^2)^2 + 2 \\cdot x^2 \\cdot 1 + 1^2', '= (x^2 + 1)^2'] },
  ],
  soorten: {
    basis: { naam: 'x² ± 2ax + a²', gen() { return volkomen('basis', LETTER(), String(rnd(1, 12)), kies(['+', '-'])); } },
    coef: { naam: 'a²x² ± 2abx + b²', gen() { const [a, b] = coprime2(7, 9); return volkomen('coef', mono(a, LETTER()), String(b), kies(['+', '-'])); } },
    twee: { naam: 'Met twee letters', gen() { const [a, b] = coprime(5, 5); const [u, v] = TWEE(); return volkomen('twee', mono(a, u), mono(b, v), kies(['+', '-'])); } },
    macht: { naam: 'x⁴ ± 2ax² + a²', gen() { const op = kies(['+', '-']); return volkomen('macht', 'x^2', String(op === '+' ? rnd(1, 6) : kies([2, 3, 5, 6])), op); } },
  },
  oefenMix: [['basis', 2], ['coef', 2], ['twee', 1], ['macht', 1]],
  test: [['basis', 3], ['coef', 3], ['twee', 2], ['macht', 2]], testSchudden: true,
};

// x² + bx + c = (x + p)(x + q)
function productSom(soort, p, q, v = 'x') {
  const f = `(${lin(v, p)})(${lin(v, q)})`;
  const b = p + q, c = p * q;
  return ontbind(soort, f, [`\\text{zoek twee getallen met som } ${tg(b)} \\text{ en product } ${tg(c)}`, `${h(p)} + ${h(q)} = ${tg(b)} \\quad\\text{en}\\quad ${h(p)} \\cdot ${h(q)} = ${tg(c)}`, `= ${etx(f)}`]);
}
function pqPaar(teken) { // teken: 'pp' beide positief, 'mm' beide negatief, 'pm' verschillend
  for (;;) {
    let p = rnd(1, 12), q = rnd(1, 12);
    if (teken === 'mm') { p = -p; q = -q; }
    if (teken === 'pm') q = -q;
    if (p === q || p + q === 0 || Math.abs(p * q) > 72) continue;
    return [p, q];
  }
}
const D13 = {
  nr: 13, titel: 'Product-som methode', kort: 'x² + bx + c: zoek twee getallen met som b en product c.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `<div class="kader def"><div class="kader-titel">Product-som methode</div>
      <p>Herken je géén merkwaardig product, dan zoek je twee getallen $p$ en $q$ waarvan de <b>som</b> gelijk is aan $b$ en het <b>product</b> gelijk aan $c$.</p>
      <p class="midden">$x^2 + bx + c = (x + p)(x + q)$ &nbsp; met $p + q = b$ en $p \\cdot q = c$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$x^2 + 9x + 14$: twee getallen met som $9$ en product $14$ zijn $2$ en $7$.</p>
      <p class="midden">$x^2 + 9x + 14 = (x+2)(x+7)$</p></div>
    <div class="kader eig"><div class="kader-titel">Opgelet bij mintekens</div>
      <ul><li>Product <b>positief</b>: beide getallen hebben hetzelfde teken als de som. $x^2 - 12x + 27$: som $-12$, product $27$ → $-3$ en $-9$ → $(x-3)(x-9)$.</li>
      <li>Product <b>negatief</b>: één getal is positief, één negatief. $x^2 + x - 30$: som $1$, product $-30$ → $6$ en $-5$ → $(x+6)(x-5)$.</li></ul></div>${INTYPEN}`,
  voorbeelden: [
    { tex: 'x^2 + 5x + 6', stappen: ['\\text{som } 5,\\ \\text{product } 6 \\;\\Rightarrow\\; 2 \\text{ en } 3', '= (x + 2)(x + 3)'] },
    { tex: 'x^2 - 3x - 10', stappen: ['\\text{som } -3,\\ \\text{product } -10 \\;\\Rightarrow\\; -5 \\text{ en } 2', '= (x - 5)(x + 2)'] },
    { tex: 'a^2 - 9a + 20', stappen: ['\\text{som } -9,\\ \\text{product } 20 \\;\\Rightarrow\\; -4 \\text{ en } -5', '= (a - 4)(a - 5)'] },
  ],
  soorten: {
    plus: { naam: 'Beide positief', gen() { const [p, q] = pqPaar('pp'); return productSom('plus', p, q, kies(['x', 'x', 'a', 'p'])); } },
    min: { naam: 'Beide negatief', gen() { const [p, q] = pqPaar('mm'); return productSom('min', p, q, kies(['x', 'x', 'a', 'p'])); } },
    gemengd: { naam: 'Product negatief', gen() { const [p, q] = pqPaar('pm'); return productSom('gemengd', p, q, kies(['x', 'x', 'a', 'p'])); } },
  },
  oefenMix: [['plus', 1], ['min', 1], ['gemengd', 2]],
  test: [['plus', 3], ['min', 3], ['gemengd', 4]], testSchudden: true,
};

const D14soorten = {
  kw: { naam: 'k(x² − a²)', gen() { const k = rnd(2, 6), a = rnd(1, 6); const f = `${k}(${lin('x', -a)})(${lin('x', a)})`;
    return ontbind('kw', f, [`= ${etx(`${k}(x^2 - ${a * a})`)} \\qquad \\text{(gemeenschappelijke factor)}`, `= ${etx(f)} \\qquad \\text{(verschil van kwadraten)}`]); } },
  vk: { naam: 'k(x ± a)²', gen() { const k = rnd(2, 5), a = nz(-6, 6); const f = `${k}(${lin('x', a)})^2`;
    return ontbind('vk', f, [`= ${k}(${vtx(`(${lin('x', a)})^2`)}) \\qquad \\text{(gemeenschappelijke factor)}`, `= ${etx(f)} \\qquad \\text{(volkomen kwadraat)}`]); } },
  x3: { naam: 'x³ − a²x', gen() { const a = rnd(1, 7); const f = `x(${lin('x', -a)})(${lin('x', a)})`;
    return ontbind('x3', f, [`= x(x^2 - ${a * a})`, `= ${etx(f)}`]); } },
  ps: { naam: 'k(x² + bx + c)', gen() { const k = rnd(2, 4); const [p, q] = pqPaar(kies(['pp', 'mm', 'pm'])); const f = `${k}(${lin('x', p)})(${lin('x', q)})`;
    return ontbind('ps', f, [`= ${k}(${vtx(`(${lin('x', p)})(${lin('x', q)})`)}) \\qquad \\text{(gemeenschappelijke factor)}`, `\\text{som } ${tg(p + q)},\\ \\text{product } ${tg(p * q)}`, `= ${etx(f)} \\qquad \\text{(product-som)}`]); } },
  xvk: { naam: 'x³ ± 2ax² + a²x', gen() { const a = nz(-6, 6); const f = `x(${lin('x', a)})^2`;
    return ontbind('xvk', f, [`= x(${vtx(`(${lin('x', a)})^2`)})`, `= ${etx(f)}`]); } },
  min: { naam: '−x² + bx + c', gen() { const [p, q] = pqPaar('pm'); const f = `-(${lin('x', p)})(${lin('x', q)})`;
    return ontbind('min', f, [`= -(${vtx(`(${lin('x', p)})(${lin('x', q)})`)}) \\qquad \\text{(minteken buiten haakjes)}`, `= ${etx(f)}`]); } },
  vierde: { naam: 'x⁴ − bx² + c', gen() { const [p, q] = kies([[1, 2], [1, 3], [2, 3]]); const f = `(x - ${p})(x + ${p})(x - ${q})(x + ${q})`;
    return ontbind('vierde', f, [`\\text{product-som met } x^2:\\ \\text{som } ${-(p * p + q * q)},\\ \\text{product } ${p * p * q * q}`, `= (x^2 - ${p * p})(x^2 - ${q * q})`, `= ${etx(f)}`]); } },
  kwmin: { naam: '(x − a)² − b²', gen() { const a = nz(-5, 5), b = rnd(1, 6); if (b === Math.abs(a)) return D14soorten.kwmin.gen();
    const f = `(${lin('x', a - b)})(${lin('x', a + b)})`;
    return ontbind('kwmin', f, [`= \\left(${etx(lin('x', a))}\\right)^2 - ${b}^2`, `= \\left(${etx(lin('x', a))} - ${b}\\right)\\left(${etx(lin('x', a))} + ${b}\\right)`, `= ${etx(f)}`], `${etx(`(${lin('x', a)})^2`)} - ${b * b}`); } },
};
const D14 = {
  nr: 14, titel: 'Volledig ontbinden (stappenplan)', kort: 'Eerst een gemeenschappelijke factor, dan verder ontbinden.', rekenmachine: false, opdracht: OPDR_ONT,
  theorie: `${STAPPENPLAN}
    <div class="kader werk"><div class="kader-titel">Volledig ontbinden</div>
      <p>Na de eerste stap kan je vaak nog <b>verder</b> ontbinden. Ga door tot geen enkele factor nog te ontbinden is.</p>
      <p class="midden">$3x^2 - 75 = 3(x^2 - 25) = 3(x-5)(x+5)$</p>
      <p class="midden">$2x^3 - 12x^2 + 18x = 2x(x^2 - 6x + 9) = 2x(x-3)^2$</p>
      <p class="midden">$3x^3 - 12x^2 - 36x = 3x(x^2 - 4x - 12) = 3x(x-6)(x+2)$</p>
      <p class="midden">$(x-3)^2 - 16 = (x - 3 - 4)(x - 3 + 4) = (x-7)(x+1)$</p></div>${INTYPEN}`,
  voorbeelden: [
    { tex: '2x^2 - 8', stappen: ['= 2(x^2 - 4)', '= 2(x - 2)(x + 2)'] },
    { tex: 'x^3 - 6x^2 + 9x', stappen: ['= x(x^2 - 6x + 9)', '= x(x - 3)^2'] },
    { tex: '2x^2 + 4x - 30', stappen: ['= 2(x^2 + 2x - 15)', '\\text{som } 2,\\ \\text{product } -15 \\;\\Rightarrow\\; 5 \\text{ en } -3', '= 2(x + 5)(x - 3)'] },
    { tex: 'x^4 - 13x^2 + 36', stappen: ['= (x^2 - 4)(x^2 - 9)', '= (x - 2)(x + 2)(x - 3)(x + 3)'] },
  ],
  soorten: D14soorten,
  oefenMix: [['kw', 2], ['vk', 2], ['x3', 1], ['ps', 2], ['xvk', 1], ['min', 1], ['vierde', 1], ['kwmin', 1]],
  test: [['kw', 2], ['vk', 1], ['x3', 1], ['ps', 2], ['xvk', 1], ['min', 1], ['vierde', 1], ['kwmin', 1]], testSchudden: true,
};

// ===================================================================
//  C · DE DISCRIMINANTMETHODE
// ===================================================================

// vergelijking met D > 0 en mooie (gehele of rationale) oplossingen: (m·x − r)(n·x − s) = 0
function mooieVgl(geheel) {
  for (;;) {
    const m = geheel ? 1 : kies([1, 2, 3]), n = geheel ? kies([1, 1, 2]) : kies([1, 2, 3]);
    const r = nz(-7, 7), s = nz(-7, 7);
    const a = m * n, b = -(m * s + n * r), c = r * s;
    if (b * b - 4 * a * c <= 0 || ggd(ggd(a, b), c) !== 1) continue;
    if (geheel && (r % m || s % n)) continue;
    return [a, b, c];
  }
}
function vglD0() { for (;;) { const m = kies([1, 1, 2, 3]), r = nz(-7, 7), k = kies([1, 1, 2]); if (ggd(m, r) !== 1) continue; return [k * m * m, -2 * k * m * r, k * r * r]; } }
function vglNeg() { for (;;) { const a = kies([1, 1, 2, 3]), b = rnd(-6, 6), c = rnd(1, 12); if (b * b - 4 * a * c < 0) return [a, b, c * (a > 0 ? 1 : -1)]; } }
function vglIrr() { for (;;) { const a = kies([1, 1, 2, 3]), b = rnd(-7, 7), c = nz(-8, 8); const D = b * b - 4 * a * c; if (D > 0 && !isKw(D) && ![0, 1, 2].some(i => W.grensgeval(i === 0 ? (-b + Math.sqrt(D)) / (2 * a) : (-b - Math.sqrt(D)) / (2 * a), 2))) return [a, b, c]; } }

const AANTAL = { soort: 'keuze', opties: [{ k: '2', l: '\\text{2 oplossingen}' }, { k: '1', l: '\\text{1 oplossing}' }, { k: '0', l: '\\text{geen oplossingen}' }] };
function vraagD(soort, [a, b, c]) {
  const r = discrUitleg(a, b, c);
  return { soort, tex: vgl(a, b, c), antw: { soort: 'delen', delen: [
    { label: 'D', antw: { soort: 'getal', waarde: r.D } },
    { label: '<span>Aantal oplossingen</span>', html: true, antw: { ...AANTAL, juist: r.D > 0 ? '2' : r.D === 0 ? '1' : '0' } }] }, uitleg: r.L.slice(0, 3) };
}
function vraagV(soort, [a, b, c], metD = true, opg = null, voorL = []) {
  const r = discrUitleg(a, b, c);
  const delen = [{ label: '<span>Oplossingen</span>', html: true, antw: Vantw(r) }];
  if (metD) delen.unshift({ label: 'D', antw: { soort: 'getal', waarde: r.D } });
  return { soort, tex: opg || vgl(a, b, c), antw: { soort: 'delen', delen }, uitleg: [...voorL, ...r.L] };
}

const D15 = {
  nr: 15, titel: 'De discriminant en het aantal oplossingen', kort: 'Bereken D = b² − 4ac en bepaal hoeveel oplossingen er zijn.', rekenmachine: false, opdracht: 'Bereken de discriminant en bepaal het aantal oplossingen.',
  theorie: `<div class="kader def"><div class="kader-titel">Tweedegraadsvergelijking</div>
      <p>Een tweedegraadsvergelijking (of vierkantsvergelijking) kan je herleiden naar de <b>standaardvorm</b>:</p>
      <p class="midden">$ax^2 + bx + c = 0$ &nbsp; met $a, b, c \\in \\mathbb{R}$ en $a \\neq 0$</p></div>${DISCR}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$x^2 + x - 30 = 0$: $\\;a = 1,\\ b = 1,\\ c = -30$</p>
      <p class="midden">$D = 1^2 - 4 \\cdot 1 \\cdot (-30) = 1 + 120 = 121 > 0$ &nbsp;→ 2 oplossingen</p>
      <p class="let-op">Reken het teken zorgvuldig uit: één tekenfout verandert het aantal oplossingen. Zet negatieve getallen tussen haakjes: $(-4)^2 = 16$.</p></div>`,
  voorbeelden: [
    { tex: 'x^2 - 4x + 4 = 0', stappen: ['a = 1,\\; b = -4,\\; c = 4', 'D = (-4)^2 - 4 \\cdot 1 \\cdot 4 = 16 - 16 = 0', 'D = 0 \\;\\Rightarrow\\; \\text{1 oplossing}'] },
    { tex: 'x^2 + 2x + 5 = 0', stappen: ['a = 1,\\; b = 2,\\; c = 5', 'D = 2^2 - 4 \\cdot 1 \\cdot 5 = 4 - 20 = -16', 'D < 0 \\;\\Rightarrow\\; \\text{geen oplossingen}'] },
    { tex: '2x^2 - 3x - 2 = 0', stappen: ['a = 2,\\; b = -3,\\; c = -2', 'D = (-3)^2 - 4 \\cdot 2 \\cdot (-2) = 9 + 16 = 25', 'D > 0 \\;\\Rightarrow\\; \\text{2 oplossingen}'] },
  ],
  soorten: {
    twee: { naam: 'D > 0', gen() { return vraagD('twee', mooieVgl(false)); } },
    een: { naam: 'D = 0', gen() { return vraagD('een', vglD0()); } },
    geen: { naam: 'D < 0', gen() { return vraagD('geen', vglNeg()); } },
  },
  oefenMix: [['twee', 2], ['een', 1], ['geen', 1]],
  test: [['twee', 4], ['een', 3], ['geen', 3]], testSchudden: true,
};

const D16 = {
  nr: 16, titel: 'Oplossen met de discriminant', kort: 'D is een kwadraat: de oplossingen zijn mooie getallen.', rekenmachine: false, opdracht: OPDR_D,
  theorie: `${DISCR}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$x^2 + x - 30 = 0$: $\\;D = 1^2 - 4 \\cdot 1 \\cdot (-30) = 121$, en $\\sqrt{121} = 11$.</p>
      <p class="midden">$x_1 = \\dfrac{-1 + 11}{2} = 5 \\qquad x_2 = \\dfrac{-1 - 11}{2} = -6 \\qquad V = \\{-6 ; 5\\}$</p>
      <p class="klein">Is de oplossing een breuk, vereenvoudig die dan: $\\dfrac{-2}{6} = -\\dfrac{1}{3}$. Je mag ze ook als kommagetal geven als dat kan: $-\\dfrac{1}{2} = -0{,}5$.</p></div>${INTYPEN_V}`,
  voorbeelden: [
    { tex: 'x^2 - 5x + 6 = 0', stappen: ['D = (-5)^2 - 4 \\cdot 1 \\cdot 6 = 1', 'x_1 = \\dfrac{5 + 1}{2} = 3 \\qquad x_2 = \\dfrac{5 - 1}{2} = 2', 'V = \\{2 ; 3\\}'] },
    { tex: '3x^2 - 2x - 1 = 0', stappen: ['D = (-2)^2 - 4 \\cdot 3 \\cdot (-1) = 16', 'x_1 = \\dfrac{2 + 4}{6} = 1 \\qquad x_2 = \\dfrac{2 - 4}{6} = -\\dfrac{1}{3}', 'V = \\{-\\frac{1}{3} ; 1\\}'] },
    { tex: '2x^2 + 5x + 3 = 0', stappen: ['D = 5^2 - 4 \\cdot 2 \\cdot 3 = 1', 'x_1 = \\dfrac{-5 + 1}{4} = -1 \\qquad x_2 = \\dfrac{-5 - 1}{4} = -\\dfrac{3}{2}', 'V = \\{-\\frac{3}{2} ; -1\\}'] },
  ],
  soorten: {
    geheel: { naam: 'Gehele oplossingen', gen() { return vraagV('geheel', mooieVgl(true)); } },
    breuk: { naam: 'Oplossingen met een breuk', gen() { for (;;) { const v = mooieVgl(false); if (v[0] > 1) return vraagV('breuk', v); } } },
  },
  oefenMix: [['geheel', 2], ['breuk', 1]],
  test: [['geheel', 6], ['breuk', 4]], testSchudden: true,
};

// niet in standaardvorm: a1x² + b1x + c1 = a2x² + b2x + c2
function herleid() {
  const [a, b, c] = kies([mooieVgl(true), mooieVgl(false), vglD0(), vglNeg()]);
  const a2 = nz(-3, 3), b2 = rnd(-6, 6), c2 = rnd(-9, 9);
  const L1 = [mono(a + a2, 'x^2'), mono(b + b2, 'x'), String(c + c2)].filter((t, i) => [a + a2, b + b2, c + c2][i] !== 0);
  const L2 = [mono(a2, 'x^2'), mono(b2, 'x'), String(c2)].filter((t, i) => [a2, b2, c2][i] !== 0);
  if (a + a2 === 0 || !L1.length || !L2.length) return herleid();
  const opg = `${etx(som(L1))} = ${etx(som(L2))}`;
  return vraagV('herleid', [a, b, c], false, opg, [`\\text{alles naar het linkerlid: } ${vgl(a, b, c)}`]);
}
const D17 = {
  nr: 17, titel: 'Discriminant: alle gevallen', kort: 'D = 0, D < 0, D geen kwadraat en eerst herleiden.', rekenmachine: true, opdracht: OPDR_D,
  theorie: `${DISCR}
    <div class="kader werk"><div class="kader-titel">De drie gevallen</div>
      <p><b>D = 0:</b> $4x^2 - 28x + 49 = 0$: $\\;D = (-28)^2 - 4 \\cdot 4 \\cdot 49 = 0$, dus $x = \\dfrac{28}{8} = \\dfrac{7}{2}$ en $V = \\{\\frac{7}{2}\\}$.</p>
      <p><b>D &lt; 0:</b> $x^2 + 4x + 8 = 0$: $\\;D = 16 - 32 = -16 < 0$, dus $V = \\varnothing$.</p>
      <p><b>D geen kwadraat:</b> $x^2 - 4x + 1 = 0$: $\\;D = 12$, $\\;x_1 = \\dfrac{4 + \\sqrt{12}}{2} \\approx 3{,}73$ en $x_2 = \\dfrac{4 - \\sqrt{12}}{2} \\approx 0{,}27$. Gebruik hier je rekenmachine en rond af op 2 decimalen.</p></div>
    <div class="kader eig"><div class="kader-titel">Eerst herleiden naar de standaardvorm</div>
      <p>Breng alle termen naar het linkerlid en herleid: $4x^2 + 3x + 5 = x^2 - 5x + 9 \\;\\Leftrightarrow\\; 3x^2 + 8x - 4 = 0$.</p></div>${INTYPEN_V}`,
  voorbeelden: [
    { tex: 'x^2 + 6x + 9 = 0', stappen: ['D = 6^2 - 4 \\cdot 1 \\cdot 9 = 0', 'x = \\dfrac{-6}{2} = -3', 'V = \\{-3\\}'] },
    { tex: 'x^2 - x + 1 = 0', stappen: ['D = (-1)^2 - 4 \\cdot 1 \\cdot 1 = -3 < 0', 'V = \\varnothing'] },
    { tex: '2x^2 + 3x - 4 = 0', stappen: ['D = 3^2 - 4 \\cdot 2 \\cdot (-4) = 41', 'x_1 = \\dfrac{-3 + \\sqrt{41}}{4} \\approx 0{,}85 \\qquad x_2 = \\dfrac{-3 - \\sqrt{41}}{4} \\approx -2{,}35', 'V = \\{-2{,}35 ; 0{,}85\\}'] },
  ],
  soorten: {
    een: { naam: 'D = 0', gen() { return vraagV('een', vglD0()); } },
    geen: { naam: 'D < 0', gen() { return vraagV('geen', vglNeg()); } },
    irr: { naam: 'D geen kwadraat', gen() { return vraagV('irr', vglIrr()); } },
    herleid: { naam: 'Eerst herleiden', gen() { return herleid(); } },
  },
  oefenMix: [['een', 1], ['geen', 1], ['irr', 2], ['herleid', 1]],
  test: [['een', 2], ['geen', 2], ['irr', 3], ['herleid', 3]], testSchudden: true,
};

// ===================================================================
//  Eindtest
// ===================================================================
const mix = (deel, soort, naam, sleutel, opdracht) => ({ naam, gen() { const v = deel.soorten[soort].gen(); return { ...v, soort: sleutel, opdracht: opdracht || deel.opdracht }; } });
const D18 = {
  nr: 18, titel: 'Eindtest: alles door elkaar', kort: 'Toon dat je alles kan: uitwerken, ontbinden en oplossen.', rekenmachine: true, opdracht: OPDR_ONT,
  theorie: `${FORMULES}${STAPPENPLAN}${DISCR}
    <p>In deze test komt alles door elkaar. Lees bij elke vraag goed of je moet <b>uitwerken</b>, <b>ontbinden</b> of <b>oplossen</b>.</p>${INTYPEN_V}`,
  voorbeelden: [
    { tex: '(3x-4)^2', stappen: ['\\text{uitwerken: } (3x)^2 - 2 \\cdot 3x \\cdot 4 + 4^2', '= 9x^2 - 24x + 16'] },
    { tex: '3x^3 - 12x', stappen: ['\\text{ontbinden: } 3x(x^2 - 4)', '= 3x(x - 2)(x + 2)'] },
    { tex: 'x^2 + 3x - 10 = 0', stappen: ['\\text{oplossen: } D = 3^2 - 4 \\cdot 1 \\cdot (-10) = 49', 'x_1 = \\dfrac{-3 + 7}{2} = 2 \\qquad x_2 = \\dfrac{-3 - 7}{2} = -5', 'V = \\{-5 ; 2\\}'] },
  ],
  soorten: {
    kwadraat: mix(D3, 'coef', 'Kwadraat uitwerken', 'kwadraat'),
    somverschil: mix(D5, 'twee', 'Som × verschil', 'somverschil'),
    derde: mix(D6, 'coef', 'Derde macht', 'derde'),
    herleid: mix(D7, 'twee', 'Werk uit en herleid', 'herleid'),
    gemfactor: mix(D9, 'drieterm', 'Gemeenschappelijke factor', 'gemfactor'),
    groep: mix(D10, 'derde', 'Groeperen', 'groep'),
    verschilkw: mix(D11, 'coef', 'Verschil van kwadraten', 'verschilkw'),
    volkomen: mix(D12, 'coef', 'Volkomen kwadraat', 'volkomen'),
    productsom: mix(D13, 'gemengd', 'Product-som', 'productsom'),
    volledig: mix(D14, 'ps', 'Volledig ontbinden', 'volledig'),
    discr: mix(D16, 'breuk', 'Discriminant', 'discr'),
    discr2: mix(D17, 'irr', 'Discriminant (geen kwadraat)', 'discr2'),
  },
  oefenMix: [['kwadraat', 1], ['somverschil', 1], ['derde', 1], ['herleid', 1], ['gemfactor', 1], ['groep', 1], ['verschilkw', 1], ['volkomen', 1], ['productsom', 1], ['volledig', 1], ['discr', 1], ['discr2', 1]],
  test: [['kwadraat', 1], ['herleid', 1], ['gemfactor', 1], ['groep', 1], ['verschilkw', 1], ['volkomen', 1], ['productsom', 1], ['volledig', 1], ['discr', 1], ['discr2', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'merkwaardige-producten-ontbinden',
  titel: 'Merkwaardige producten en ontbinden',
  ondertitel: 'Remediëring · 4DOF',
  klas: '4DOF',
  soort: 'remediëring',
  intro: `<p>Je werkt stap voor stap: van merkwaardige producten uitwerken, over ontbinden in factoren, tot vergelijkingen oplossen met de discriminant.
    Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test. Haal je <b>8 op 10</b>, dan gaat de volgende stap open.</p>`,
  groepen: [
    { titel: 'A · Merkwaardige producten', delen: [1, 2, 3, 4, 5, 6, 7] },
    { titel: 'B · Ontbinden in factoren', delen: [8, 9, 10, 11, 12, 13, 14] },
    { titel: 'C · De discriminantmethode', delen: [15, 16, 17] },
    { titel: 'D · Eindtest', delen: [18] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15, D16, D17, D18],
});
})();
