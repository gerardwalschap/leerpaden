// Programma 'vectoren-coordinaten' — automatisch samengevoegd uit bron/vectoren-coordinaten/ (niet rechtstreeks bewerken)
(() => {
// ===== Vectoren: rekenen in het vlak · Toegepaste wiskunde 4BW =====
// Leidraad: cursus TWiskunde 4BW hoofdstuk 9 "Vectoren: rekenen in het vlak" (G. Walschap).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(W.rond(x, 4));
const kg = (x) => String(x).replace('.', ',').replace('-', '−');
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud(opties.map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const P = (x, y) => (Number.isInteger(x) && Number.isInteger(y) ? `(${tg(x)}, \\, ${tg(y)})` : `(${tg(x)}; \\, ${tg(y)})`);
const Pt = (x, y) => `(${kg(x)}, ${kg(y)})`;
const comp = (x, y, n) => ({ soort: 'delen', delen: [{ label: `${n}: \\quad x =`, antw: getal(x) }, { label: 'y =', antw: getal(y) }] });
const r2 = (x) => W.rond(x, 2);
function rooster(opt) {
  const [X0, X1] = opt.x || [-6, 6], [Y0, Y1] = opt.y || [-6, 6], e = opt.e || 22, m = 16;
  const X = (x) => m + (x - X0) * e, Y = (y) => m + (Y1 - y) * e, W_ = (X1 - X0) * e + 2 * m, H = (Y1 - Y0) * e + 2 * m;
  let g = '';
  for (let k = X0; k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>` + (k && k % 2 === 0 ? `<text x="${X(k)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle" fill="#555">${k < 0 ? '−' + -k : k}</text>` : '');
  for (let k = Y0; k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>` + (k && k % 2 === 0 ? `<text x="${X(0) - 5}" y="${Y(k) + 4}" font-size="10" text-anchor="end" fill="#555">${k < 0 ? '−' + -k : k}</text>` : '');
  if (opt.assen !== false) g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1)}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.2"/><line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1)}" stroke="#1f2733" stroke-width="1.2"/>`;
  for (const [pts, kl, streep] of opt.veelhoeken || []) g += `<polygon points="${pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" fill="${kl}22" stroke="${kl}" stroke-width="2.2" ${streep ? 'stroke-dasharray="6 4"' : ''}/>`;
  for (const [[a, b], [c, d]] of opt.lijnen || []) g += `<line x1="${X(a)}" y1="${Y(b)}" x2="${X(c)}" y2="${Y(d)}" stroke="#7a8b99" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  for (const [[a, b], [c, d], n, kl] of opt.pijlen || []) { const k = kl || '#e8772e', L = Math.hypot(X(c) - X(a), Y(d) - Y(b)), ux = (X(c) - X(a)) / L, uy = (Y(d) - Y(b)) / L, px = X(c) - ux * 11, py = Y(d) - uy * 11;
    g += `<line x1="${X(a)}" y1="${Y(b)}" x2="${px}" y2="${py}" stroke="${k}" stroke-width="2.6"/><polygon points="${X(c)},${Y(d)} ${px - uy * 5},${py + ux * 5} ${px + uy * 5},${py - ux * 5}" fill="${k}"/>` + (n ? `<text x="${(X(a) + X(c)) / 2 - uy * 14}" y="${(Y(b) + Y(d)) / 2 + ux * 14 + 4}" font-size="13" font-weight="bold" fill="${k}" text-anchor="middle" font-style="italic">${n}</text>` : ''); }
  for (const [x, y, n, kl] of opt.punten || []) g += `<circle cx="${X(x)}" cy="${Y(y)}" r="4.5" fill="${kl || '#1c4e8a'}"/><text x="${X(x) + 7}" y="${Y(y) - 7}" font-size="13" font-weight="bold" fill="${kl || '#1c4e8a'}" font-style="italic">${n}</text>`;
  return `<div class="figuur"><svg viewBox="0 0 ${W_} ${H}" width="${W_}" height="${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rooster" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}

// ===================================================================
const D1 = {
  nr: 1, titel: 'Componenten van een vector', kort: 'AB(xB − xA, yB − yA): eindpunt min beginpunt.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Herhaling</div><p>Een vector heeft een <b>grootte</b>, een <b>richting</b> en een <b>zin</b> en wordt voorgesteld door een pijl. Gelijke vectoren hebben dezelfde grootte, richting en zin; de plaats in het vlak speelt geen rol.</p></div>
    <div class="kader def"><div class="kader-titel">Componenten van $\\vec{AB}$</div><p>Voor $A(x_A, y_A)$ en $B(x_B, y_B)$:</p><p class="midden">$\\vec{AB}(x_B - x_A, \\quad y_B - y_A)$</p>
      <p>Altijd <b>eindpunt − beginpunt</b>. De componenten zeggen hoeveel eenheden je horizontaal en verticaal verplaatst om van $A$ naar $B$ te gaan.</p></div>`,
  voorbeelden: [
    { tex: 'A(-1, 4), \\quad B(3, 1)', stappen: ['\\vec{AB}(3 - (-1), \\quad 1 - 4)', '\\vec{AB}(4, -3)', '\\text{4 eenheden naar rechts, 3 naar beneden}'] },
  ],
  soorten: {
    ab: { naam: 'Componenten berekenen', gen() {
      const xa = rnd(-6, 6), ya = rnd(-6, 6); let xb, yb; do { xb = rnd(-6, 6); yb = rnd(-6, 6); } while (xb === xa && yb === ya);
      const [n1, n2] = kies([['A', 'B'], ['P', 'Q'], ['C', 'D']]);
      return { soort: 'ab', tex: `${n1}${P(xa, ya)}, \\quad ${n2}${P(xb, yb)}`, html: vraag(`Bereken de componenten van de vector ${n1}${n2}.`), sleutel: `ab${xa}${ya}${xb}${yb}${n1}`,
        antw: comp(xb - xa, yb - ya, `\\vec{${n1}${n2}}`), uitleg: [`\\vec{${n1}${n2}}(${tg(xb)} - ${h(xa)}, \\quad ${tg(yb)} - ${h(ya)}) = \\vec{${n1}${n2}}${P(xb - xa, yb - ya)}`] };
    } },
    rooster: { naam: 'Aflezen op een rooster', gen() {
      const xa = rnd(-5, 1), ya = rnd(-5, 1), xb = rnd(-1, 5), yb = rnd(-1, 5);
      if (xa === xb && ya === yb) return this.gen();
      return { soort: 'rooster', html: rooster({ x: [-6, 6], y: [-6, 6], pijlen: [[[xa, ya], [xb, yb]]], punten: [[xa, ya, 'A'], [xb, yb, 'B']] }) + vraag('Lees de coördinaten van A en B af en bereken de componenten van de vector AB.'), sleutel: `ro${xa}${ya}${xb}${yb}`,
        antw: comp(xb - xa, yb - ya, '\\vec{AB}'), uitleg: [`A${P(xa, ya)}, \\quad B${P(xb, yb)}`, `\\vec{AB}${P(xb - xa, yb - ya)}`] };
    } },
    omgekeerd: { naam: 'BA of AB?', gen() {
      const xa = rnd(-5, 5), ya = rnd(-5, 5), xb = rnd(-5, 5), yb = rnd(-5, 5); if (xa === xb && ya === yb) return this.gen();
      return { soort: 'omgekeerd', tex: `A${P(xa, ya)}, \\quad B${P(xb, yb)}`, html: vraag('Bereken de componenten van de vector BA.'), sleutel: `ba${xa}${ya}${xb}${yb}`,
        antw: comp(xa - xb, ya - yb, '\\vec{BA}'), uitleg: [`\\vec{BA}(x_A - x_B, \\quad y_A - y_B) = (${tg(xa)} - ${h(xb)}, \\quad ${tg(ya)} - ${h(yb)}) = ${P(xa - xb, ya - yb)}`, tx('BA is de tegengestelde vector van AB.')] };
    } },
  },
  oefenMix: [['ab', 3], ['rooster', 1], ['omgekeerd', 1]],
  test: [['ab', 5], ['rooster', 3], ['omgekeerd', 2]], testSchudden: true,
};

const MOOI = [[3, 4], [6, 8], [5, 12], [8, 6], [-3, 4], [4, -3], [-6, -8], [12, 5], [-5, 12], [0, 7], [-9, 0], [8, 15], [9, 12]];
const D2 = {
  nr: 2, titel: 'De lengte (norm) van een vector', kort: '‖v‖ = √(x² + y²)', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Norm van een vector</div><p>Voor $\\vec{v}(x, y)$ is de lengte of norm</p><p class="midden">$\\|\\vec{v}\\| = \\sqrt{x^2 + y^2}$</p>
      <p>Dat is de <b>stelling van Pythagoras</b>: de componenten zijn de rechthoekszijden, de vector is de schuine zijde.</p></div>
    <div class="kader"><div class="kader-titel">Afspraak</div><p>Is het resultaat geen geheel getal, rond dan af op <b>0,01</b>.</p></div>`,
  voorbeelden: [
    { tex: '\\vec{v}(-6, 8)', stappen: ['\\|\\vec{v}\\| = \\sqrt{(-6)^2 + 8^2}', '= \\sqrt{36 + 64} = \\sqrt{100} = 10'] },
    { tex: 'A(1, 2), \\quad B(4, -2)', stappen: ['\\vec{AB}(3, -4)', '\\|\\vec{AB}\\| = \\sqrt{9 + 16} = 5'] },
  ],
  soorten: {
    norm: { naam: 'Lengte van een vector', gen() {
      const [x, y] = kies([...MOOI, [nz(-7, 7), nz(-7, 7)], [nz(-7, 7), nz(-7, 7)]]), n = Math.sqrt(x * x + y * y);
      return { soort: 'norm', tex: `\\vec{v}${P(x, y)}`, html: vraag('Bereken de lengte van de vector (afgerond op 0,01).'), sleutel: `no${x}${y}`,
        antw: getal(r2(n), { dec: 2 }), uitleg: [`\\|\\vec{v}\\| = \\sqrt{${h(x)}^2 + ${h(y)}^2} = \\sqrt{${x * x + y * y}} ${Number.isInteger(n) ? '=' : '\\approx'} ${tg(r2(n))}`] };
    } },
    afstand: { naam: 'Lengte van AB', gen() {
      const xa = rnd(-5, 5), ya = rnd(-5, 5), [dx, dy] = kies([...MOOI, [nz(-6, 6), nz(-6, 6)]]), xb = xa + dx, yb = ya + dy, n = Math.sqrt(dx * dx + dy * dy);
      return { soort: 'afstand', tex: `A${P(xa, ya)}, \\quad B${P(xb, yb)}`, html: vraag('Bereken de lengte van de vector AB (afgerond op 0,01).'), sleutel: `af${xa}${ya}${xb}${yb}`,
        antw: getal(r2(n), { dec: 2 }), uitleg: [`\\vec{AB}${P(dx, dy)}`, `\\|\\vec{AB}\\| = \\sqrt{${dx * dx} + ${dy * dy}} ${Number.isInteger(n) ? '=' : '\\approx'} ${tg(r2(n))}`] };
    } },
    pyth: { naam: 'Waarom Pythagoras?', gen() {
      const [v, j, o] = kies([['Welke stelling gebruik je om de lengte van een vector te berekenen?', 'Pythagoras', ['Pythagoras', 'Thales', 'de sinusregel', 'de grondformule']], ['Wat zijn de componenten in de rechthoekige driehoek?', 'de rechthoekszijden', ['de rechthoekszijden', 'de schuine zijde', 'de hoeken', 'de hoogtes']], ['Hebben v(3, 4) en w(4, 3) dezelfde lengte?', 'ja, allebei 5', ['ja, allebei 5', 'nee', 'ja, allebei 7', 'enkel als ze evenwijdig zijn']]]);
      return { soort: 'pyth', html: vraag(v), sleutel: `py${j}`, antw: tekstKeuze(o, j), uitleg: [tx('De componenten zijn de rechthoekszijden, de vector de schuine zijde: ‖v‖ = √(x² + y²).')] };
    } },
  },
  oefenMix: [['norm', 2], ['afstand', 2], ['pyth', 1]],
  test: [['norm', 4], ['afstand', 4], ['pyth', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Rekenen met vectoren', kort: 'Som, verschil en vermenigvuldiging met een getal.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Rekenregels met coördinaten</div><p>Voor $\\vec{u}(u_1, u_2)$, $\\vec{v}(v_1, v_2)$ en $k \\in \\mathbb{R}$:</p>
      <ul><li>som: $\\vec{u} + \\vec{v}\\,(u_1 + v_1, \\quad u_2 + v_2)$</li><li>verschil: $\\vec{u} - \\vec{v}\\,(u_1 - v_1, \\quad u_2 - v_2)$</li><li>vermenigvuldiging met een getal: $k \\cdot \\vec{u}\\,(k \\cdot u_1, \\quad k \\cdot u_2)$</li></ul></div>
    <div class="kader"><div class="kader-titel">Verband met tekenen</div><p>Met de kop-staartmethode teken je $\\vec{v}$ vanaf het eindpunt van $\\vec{u}$. Met coördinaten bereken je dat eindpunt exact, zonder te tekenen. $k \\cdot \\vec{u}$ heeft dezelfde richting; is $k < 0$, dan keert de zin om.</p></div>`,
  voorbeelden: [
    { tex: '\\vec{u}(5, -2), \\quad \\vec{v}(-3, 6)', stappen: ['\\vec{u} + \\vec{v} = (5 + (-3), \\quad -2 + 6) = (2, 4)', '\\vec{u} - \\vec{v} = (5 - (-3), \\quad -2 - 6) = (8, -8)', '3\\vec{u} = (15, -6)'] },
    { tex: '2\\vec{u} - \\vec{v} \\text{ met } \\vec{u}(1, 4), \\quad \\vec{v}(5, -1)', stappen: ['2\\vec{u} = (2, 8)', '2\\vec{u} - \\vec{v} = (2 - 5, \\quad 8 - (-1)) = (-3, 9)'] },
  ],
  soorten: {
    som: { naam: 'Som', gen() { const a = nz(-8, 8), b = nz(-8, 8), c = nz(-8, 8), d = nz(-8, 8);
      return { soort: 'som', tex: `\\vec{u}${P(a, b)}, \\quad \\vec{v}${P(c, d)}`, html: vraag('Bereken u + v.'), sleutel: `s${a}${b}${c}${d}`, antw: comp(a + c, b + d, '\\vec{u} + \\vec{v}'), uitleg: [`(${tg(a)} + ${h(c)}, \\quad ${tg(b)} + ${h(d)}) = ${P(a + c, b + d)}`] }; } },
    verschil: { naam: 'Verschil', gen() { const a = nz(-8, 8), b = nz(-8, 8), c = nz(-8, 8), d = nz(-8, 8);
      return { soort: 'verschil', tex: `\\vec{u}${P(a, b)}, \\quad \\vec{v}${P(c, d)}`, html: vraag('Bereken u − v.'), sleutel: `v${a}${b}${c}${d}`, antw: comp(a - c, b - d, '\\vec{u} - \\vec{v}'), uitleg: [`(${tg(a)} - ${h(c)}, \\quad ${tg(b)} - ${h(d)}) = ${P(a - c, b - d)}`] }; } },
    keer: { naam: 'Vermenigvuldigen met een getal', gen() { const a = nz(-8, 8), b = nz(-8, 8), k = kies([2, 3, -1, -2, -3, 0.5, -0.5, 4]);
      return { soort: 'keer', tex: `\\vec{u}${P(a, b)}`, html: vraag(`Bereken ${kg(k)} · u.`), sleutel: `k${a}${b}${k}`, antw: comp(k * a, k * b, `${tg(k)}\\vec{u}`), uitleg: [`(${tg(k)} \\cdot ${h(a)}, \\quad ${tg(k)} \\cdot ${h(b)}) = ${P(k * a, k * b)}`] }; } },
    combi: { naam: 'Combinatie', gen() { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6), d = nz(-6, 6), k = kies([2, 3]), m = kies([1, 2]), t = kies(['+', '-']), s = t === '+' ? 1 : -1;
      const x = k * a + s * m * c, y = k * b + s * m * d, L = `${k}\\vec{u} ${t} ${m === 1 ? '' : m}\\vec{v}`;
      return { soort: 'combi', tex: `\\vec{u}${P(a, b)}, \\quad \\vec{v}${P(c, d)}`, html: vraag(`Bereken ${k}u ${t === '+' ? '+' : '−'} ${m === 1 ? '' : m}v.`), sleutel: `c${a}${b}${c}${d}${k}${m}${t}`, antw: comp(x, y, L),
        uitleg: [`${k}\\vec{u} = ${P(k * a, k * b)}, \\quad ${m === 1 ? '' : m}\\vec{v} = ${P(m * c, m * d)}`, `${L} = ${P(x, y)}`] }; } },
  },
  oefenMix: [['som', 1], ['verschil', 2], ['keer', 1], ['combi', 1]],
  test: [['som', 2], ['verschil', 3], ['keer', 2], ['combi', 3]], testSchudden: true,
};

const D4 = {
  nr: 4, titel: 'Het midden van een lijnstuk', kort: 'M((xA + xB)/2, (yA + yB)/2)', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Midden van een lijnstuk</div><p>Het midden $M$ van $[AB]$ vind je via $M = A + \\tfrac{1}{2}\\vec{AB}$. Met coördinaten:</p>
      <p class="midden">$M\\left(\\dfrac{x_A + x_B}{2}, \\quad \\dfrac{y_A + y_B}{2}\\right)$</p></div>
    <div class="kader"><div class="kader-titel">Hetzelfde idee</div><p>Op dezelfde manier ligt het punt $P = A + \\tfrac{1}{4}\\vec{AB}$ op een vierde van $A$ naar $B$.</p></div>`,
  voorbeelden: [
    { tex: 'A(-3, 5), \\quad B(7, 2)', stappen: ['M\\left(\\frac{-3 + 7}{2}, \\quad \\frac{5 + 2}{2}\\right)', 'M(2; \\, 3{,}5)'] },
    { tex: 'P = A + \\tfrac{1}{3}\\vec{AB} \\text{ met } A(1, 2), \\quad B(10, -4)', stappen: ['\\vec{AB}(9, -6), \\quad \\tfrac{1}{3}\\vec{AB} = (3, -2)', 'P(1 + 3, \\quad 2 + (-2)) = P(4, 0)'] },
  ],
  soorten: {
    midden: { naam: 'Midden berekenen', gen() { const xa = rnd(-8, 8), ya = rnd(-8, 8), xb = rnd(-8, 8), yb = rnd(-8, 8); if (xa === xb && ya === yb) return this.gen();
      return { soort: 'midden', tex: `A${P(xa, ya)}, \\quad B${P(xb, yb)}`, html: vraag('Bereken het midden M van [AB].'), sleutel: `m${xa}${ya}${xb}${yb}`, antw: comp((xa + xb) / 2, (ya + yb) / 2, 'M'),
        uitleg: [`M\\left(\\frac{${tg(xa)} + ${h(xb)}}{2}, \\quad \\frac{${tg(ya)} + ${h(yb)}}{2}\\right) = M${P((xa + xb) / 2, (ya + yb) / 2)}`] }; } },
    deel: { naam: 'Punt op een deel van AB', gen() { const n = kies([3, 4]), xa = rnd(-6, 6), ya = rnd(-6, 6), dx = n * nz(-3, 3), dy = n * nz(-3, 3);
      return { soort: 'deel', tex: `A${P(xa, ya)}, \\quad B${P(xa + dx, ya + dy)}`, html: vraag(`Bereken het punt P = A + 1/${n} · AB (op een ${n === 3 ? 'derde' : 'vierde'} van A naar B).`), sleutel: `d${n}${xa}${ya}${dx}${dy}`,
        antw: comp(xa + dx / n, ya + dy / n, 'P'), uitleg: [`\\vec{AB}${P(dx, dy)}, \\quad \\tfrac{1}{${n}}\\vec{AB} = ${P(dx / n, dy / n)}`, `P(${tg(xa)} + ${h(dx / n)}, \\quad ${tg(ya)} + ${h(dy / n)}) = P${P(xa + dx / n, ya + dy / n)}`] }; } },
  },
  oefenMix: [['midden', 3], ['deel', 2]],
  test: [['midden', 7], ['deel', 3]], testSchudden: true,
};

const D5 = {
  nr: 5, titel: 'Evenwijdige vectoren', kort: 'u1 · v2 − u2 · v1 = 0', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Evenwijdige vectoren</div><p>$\\vec{u}(u_1, u_2)$ en $\\vec{v}(v_1, v_2)$ zijn evenwijdig als en slechts als</p><p class="midden">$u_1 \\cdot v_2 - u_2 \\cdot v_1 = 0$</p>
      <p>Dat betekent dat de componenten <b>evenredig</b> zijn. De kruislingse vorm werkt ook als een component 0 is: je deelt niet.</p></div>`,
  voorbeelden: [
    { tex: '\\vec{u}(-2, 5), \\quad \\vec{v}(6, -15)', stappen: ['(-2) \\cdot (-15) - 5 \\cdot 6 = 30 - 30 = 0', '\\text{evenwijdig } (\\vec{v} = -3\\vec{u})'] },
    { tex: '\\vec{u}(3, 7), \\quad \\vec{w}(6, 15)', stappen: ['3 \\cdot 15 - 7 \\cdot 6 = 45 - 42 = 3 \\neq 0', '\\text{niet evenwijdig}'] },
  ],
  soorten: {
    evw: { naam: 'Evenwijdig of niet?', gen() { const a = nz(-6, 6), b = nz(-6, 6), ja = kies([true, false]), k = kies([2, 3, -1, -2, 0.5, -3]);
      let c = k * a, d = k * b; if (!ja) d += kies([1, -1, 2]); if (!Number.isInteger(c) || !Number.isInteger(d)) return this.gen(); const w = a * d - b * c;
      return { soort: 'evw', tex: `\\vec{u}${P(a, b)}, \\quad \\vec{v}${P(c, d)}`, html: vraag('Zijn u en v evenwijdig?'), sleutel: `e${a}${b}${c}${d}`, antw: tekstKeuze(['evenwijdig', 'niet evenwijdig'], w === 0 ? 'evenwijdig' : 'niet evenwijdig'),
        uitleg: [`${h(a)} \\cdot ${h(d)} - ${h(b)} \\cdot ${h(c)} = ${tg(a * d)} - ${h(b * c)} = ${tg(w)}`, w === 0 ? '= 0: \\text{ evenwijdig}' : '\\neq 0: \\text{ niet evenwijdig}'] }; } },
    getal: { naam: 'Bereken u1 · v2 − u2 · v1', gen() { const a = nz(-7, 7), b = nz(-7, 7), c = nz(-7, 7), d = nz(-7, 7), w = a * d - b * c;
      return { soort: 'getal', tex: `\\vec{u}${P(a, b)}, \\quad \\vec{v}${P(c, d)}`, html: vraag('Bereken u₁ · v₂ − u₂ · v₁.'), sleutel: `g${a}${b}${c}${d}`, antw: getal(w), uitleg: [`${h(a)} \\cdot ${h(d)} - ${h(b)} \\cdot ${h(c)} = ${tg(w)}`] }; } },
    nul: { naam: 'Met een component 0', gen() { const b = nz(-6, 6), d = nz(-6, 6), c = kies([0, nz(-4, 4)]), w = 0 * d - b * c;
      return { soort: 'nul', tex: `\\vec{u}(0, ${tg(b)}), \\quad \\vec{v}(${tg(c)}, ${tg(d)})`, html: vraag('Zijn u en v evenwijdig?'), sleutel: `n${b}${c}${d}`, antw: tekstKeuze(['evenwijdig', 'niet evenwijdig'], w === 0 ? 'evenwijdig' : 'niet evenwijdig'),
        uitleg: [`0 \\cdot ${h(d)} - ${h(b)} \\cdot ${h(c)} = ${tg(w)}`, w === 0 ? '= 0: \\text{ evenwijdig (beide verticaal)}' : '\\neq 0: \\text{ niet evenwijdig}'] }; } },
  },
  oefenMix: [['evw', 3], ['getal', 1], ['nul', 1]],
  test: [['evw', 5], ['getal', 3], ['nul', 2]], testSchudden: true,
};

const D6 = {
  nr: 6, titel: 'Toepassingen', kort: 'Vierde hoekpunt van een parallellogram · collineaire punten.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Het vierde hoekpunt van een parallellogram</div><p>In parallellogram $ABCD$ is $\\vec{AB} = \\vec{DC}$, dus $D = C - \\vec{AB}$.</p></div>
    <div class="kader def"><div class="kader-titel">Collineaire punten</div><p>$A$, $B$ en $C$ liggen op één rechte (zijn <b>collineair</b>) als $\\vec{AB}$ en $\\vec{AC}$ evenwijdig zijn: ze hebben het punt $A$ gemeenschappelijk.</p></div>`,
  voorbeelden: [
    { tex: 'A(-2, 0), \\quad B(3, 1), \\quad C(5, 4). \\text{ Bereken } D.', stappen: ['\\vec{AB}(5, 1)', 'D = C - \\vec{AB} = (5 - 5, \\quad 4 - 1) = D(0, 3)'] },
    { tex: 'A(0, 1), \\quad B(2, 4), \\quad C(6, 10)', stappen: ['\\vec{AB}(2, 3), \\quad \\vec{AC}(6, 9)', '2 \\cdot 9 - 3 \\cdot 6 = 0: \\text{ collineair}'] },
  ],
  soorten: {
    para: { naam: 'Vierde hoekpunt', gen() { const xa = rnd(-5, 2), ya = rnd(-5, 1), ux = rnd(2, 5), uy = rnd(-2, 2), vx = rnd(-2, 2), vy = rnd(2, 5); if (ux * vy - uy * vx === 0) return this.gen();
      const B = [xa + ux, ya + uy], C = [B[0] + vx, B[1] + vy], D = [xa + vx, ya + vy];
      return { soort: 'para', html: rooster({ x: [-7, 8], y: [-6, 8], veelhoeken: [[[[xa, ya], B, C, D], '#7a8b99', true]], punten: [[xa, ya, 'A'], [B[0], B[1], 'B'], [C[0], C[1], 'C']] }) + opgave(`A${Pt(xa, ya)}, B${Pt(...B)} en C${Pt(...C)}. ABCD is een parallellogram.`) + vraag('Bereken D.'), sleutel: `p${xa}${ya}${ux}${uy}${vx}${vy}`,
        antw: comp(D[0], D[1], 'D'), uitleg: [`\\vec{AB}${P(ux, uy)}`, `D = C - \\vec{AB} = (${tg(C[0])} - ${h(ux)}, \\quad ${tg(C[1])} - ${h(uy)}) = D${P(...D)}`] }; } },
    col: { naam: 'Collineair?', gen() { const xa = rnd(-5, 3), ya = rnd(-5, 3), ux = nz(-3, 3), uy = nz(-3, 3), k = kies([2, 3, -1]), ja = kies([true, false]);
      const B = [xa + ux, ya + uy], C = [xa + k * ux, ya + k * uy + (ja ? 0 : kies([1, -1]))], acx = C[0] - xa, acy = C[1] - ya, w = ux * acy - uy * acx;
      return { soort: 'col', tex: `A${P(xa, ya)}, \\quad B${P(...B)}, \\quad C${P(...C)}`, html: vraag('Liggen A, B en C op één rechte?'), sleutel: `c${xa}${ya}${ux}${uy}${k}${ja}`, antw: tekstKeuze(['ja, collineair', 'nee, niet collineair'], w === 0 ? 'ja, collineair' : 'nee, niet collineair'),
        uitleg: [`\\vec{AB}${P(ux, uy)}, \\quad \\vec{AC}${P(acx, acy)}`, `${h(ux)} \\cdot ${h(acy)} - ${h(uy)} \\cdot ${h(acx)} = ${tg(w)}`] }; } },
  },
  oefenMix: [['para', 2], ['col', 2]],
  test: [['para', 5], ['col', 5]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht }; } });
const D7 = {
  nr: 7, titel: 'Eindtest vectoren', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><ul><li>$\\vec{AB}(x_B - x_A, \\quad y_B - y_A)$</li><li>$\\|\\vec{v}\\| = \\sqrt{x^2 + y^2}$</li><li>som, verschil, $k\\vec{u}$: per component</li>
    <li>$M\\left(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2}\\right)$</li><li>evenwijdig: $u_1 v_2 - u_2 v_1 = 0$</li><li>parallellogram: $D = C - \\vec{AB}$</li></ul></div>`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'ab', 'Componenten'), e2: mix(D2, 'afstand', 'Lengte'), e3: mix(D3, 'verschil', 'Verschil'), e4: mix(D3, 'combi', 'Combinatie'), e5: mix(D3, 'keer', 'k · u'),
    e6: mix(D4, 'midden', 'Midden'), e7: mix(D5, 'evw', 'Evenwijdig'), e8: mix(D6, 'para', 'Parallellogram'), e9: mix(D6, 'col', 'Collineair'), e10: mix(D4, 'deel', 'Punt op AB') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6, D7]) {
  for (const s of Object.values(D.soorten)) {
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
  code: 'vectoren-coordinaten',
  titel: 'Vectoren: rekenen in het vlak',
  ondertitel: 'Toegepaste wiskunde · 4BW',
  klas: '4BW',
  drempel: 70,
  intro: `<p>Wat je in de basisvorming <b>tekenend</b> deed met vectoren, doe je nu <b>exact met coördinaten</b>: componenten, lengte, som, verschil, vermenigvuldigen met een getal, het midden van een lijnstuk, evenwijdige vectoren en toepassingen.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [
    { titel: 'A · Vectoren met coördinaten', delen: [1, 2] },
    { titel: 'B · Rekenen met vectoren', delen: [3, 4, 5] },
    { titel: 'C · Toepassingen', delen: [6] },
    { titel: 'D · Eindtest', delen: [7] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7],
});
})();
