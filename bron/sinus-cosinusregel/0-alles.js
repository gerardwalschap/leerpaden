// ===== Sinus- en cosinusregel · Toegepaste wiskunde 5BCW =====
// Leidraad: cursus TWiskunde 5BCW hoofdstuk 4 en de PWP/werkbundel "4. Sinus- en cosinusregel" (G. Walschap).
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(d === null ? x : W.rond(x, d));
const kg = (x) => String(x).replace('.', ',');
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: opties.map(o => ({ k: String(o), l: `\\text{${o}}` })), juist: String(juist) });
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const RAD = Math.PI / 180, sin = (g) => Math.sin(g * RAD), cos = (g) => Math.cos(g * RAD), asin = (v) => Math.asin(v) / RAD, acos = (v) => Math.acos(v) / RAD;
const r2 = (x) => W.rond(x, 2);
const zijde = (w) => getal(w, { dec: 2 }), hoek = (w) => getal(w, { dec: 2, na: '°' });
const LET = { a: 'a', b: 'b', c: 'c', α: '\\alpha', β: '\\beta', γ: '\\gamma' };

// ---------- driehoek tekenen: hoeken α (bij A), β (bij B), γ (bij C); zijden a = |BC|, b = |CA|, c = |AB|
function driehoekSVG(D, toon = {}) {
  const sc = 220 / Math.max(D.a, D.b, D.c), A = [0, 0], B = [D.c * sc, 0], C = [D.b * sc * cos(D.α), D.b * sc * sin(D.α)];
  const xs = [A[0], B[0], C[0]], ys = [A[1], B[1], C[1]], minx = Math.min(...xs) - 40, maxx = Math.max(...xs) + 40, maxy = Math.max(...ys) + 34;
  const P = ([x, y]) => [x - minx, maxy - y + 6];
  const [pa, pb, pc] = [P(A), P(B), P(C)];
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const lab = (t, [x, y], kl = '#1f2733', vet = false) => `<text x="${x}" y="${y}" font-size="14" text-anchor="middle" fill="${kl}" ${vet ? 'font-weight="bold"' : ''} font-style="italic">${t}</text>`;
  const naar = (p, q, d) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [p[0] + dx / l * d, p[1] + dy / l * d]; };
  const zw = (k, waarde) => (waarde === undefined ? '' : waarde === '?' ? '?' : waarde);
  let g = `<polygon points="${pa} ${pb} ${pc}" fill="#eef3fa" stroke="#1c4e8a" stroke-width="2.2"/>`;
  const zc = (k, p, q, ander) => { const m = mid(p, q), uit = naar(m, ander, -16); const t = toon[k]; if (t === undefined) return ''; return lab(`${k}${t === '?' ? ' = ?' : ` = ${t}`}`, [uit[0], uit[1] + 5], t === '?' ? '#c2561a' : '#1c4e8a', t === '?'); };
  g += zc('a', pb, pc, pa) + zc('b', pc, pa, pb) + zc('c', pa, pb, pc);
  const hc = (k, p, q, r) => { const t = toon[k]; const binnen = naar(p, mid(q, r), 30); let s = lab(k === 'α' ? 'A' : k === 'β' ? 'B' : 'C', naar(p, mid(q, r), -14).map((v, i) => v + (i ? 5 : 0)), '#4e6577'); if (t !== undefined) s += lab(`${k}${t === '?' ? ' = ?' : ` = ${t}°`}`, [binnen[0], binnen[1] + 5], t === '?' ? '#c2561a' : '#e8772e', true); return s; };
  g += hc('α', pa, pb, pc) + hc('β', pb, pc, pa) + hc('γ', pc, pa, pb);
  const w = maxx - minx, h = maxy + 40;
  return `<div class="figuur"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="driehoek" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}
// willekeurige driehoek met mooie hoeken en één gegeven zijde
function maakDriehoek() {
  for (;;) {
    const α = rnd(25, 110), β = rnd(25, 110), γ = 180 - α - β;
    if (γ < 20) continue;
    const k = rnd(6, 20) / sin(α), a = r2(k * sin(α));
    const D = { α, β, γ, a, b: k * sin(β), c: k * sin(γ) };
    return D;
  }
}

const VUIST = `<div class="kader eig"><div class="kader-titel">Vuistregel: welke regel?</div>
  <ul><li>Je kent <b>twee hoeken en een zijde</b>, of <b>twee zijden en een tegenoverliggende hoek</b>? Gebruik de <b>sinusregel</b>.</li>
  <li>Je kent <b>drie zijden</b>, of <b>twee zijden met de ingesloten hoek</b>? Gebruik de <b>cosinusregel</b>.</li></ul>
  <p class="klein">Teken bij elke oefening eerst de driehoek met de gegeven waarden erbij.</p></div>`;
const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraken</div><ul><li>Zet je rekenmachine in <b>graden</b> (DEG).</li><li>Rond zijden en hoeken af op <b>0,01</b>. Reken verder met de niet-afgeronde waarden.</li></ul></div>`;
const NOTATIE = `<p>In een driehoek $ABC$ liggen de zijden $a$, $b$, $c$ tegenover de hoeken $\\alpha$, $\\beta$, $\\gamma$.</p>`;

// ===================================================================
const D1 = {
  nr: 1, titel: 'De sinusregel', kort: 'a / sin α = b / sin β = c / sin γ', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Sinusregel</div>${NOTATIE}
      <p class="midden">$\\dfrac{a}{\\sin \\alpha} = \\dfrac{b}{\\sin \\beta} = \\dfrac{c}{\\sin \\gamma}$</p>
      <p>Bruikbaar als je een <b>hoek-zijde-paar</b> kent (een hoek en de zijde ertegenover), plus één extra gegeven.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$\\alpha = 40°$, $\\beta = 65°$, $a = 12$ cm. Bereken $b$ en $c$.</p>
      <p class="midden">$\\gamma = 180° - 40° - 65° = 75° \\qquad b = a \\cdot \\dfrac{\\sin \\beta}{\\sin \\alpha} = 12 \\cdot \\dfrac{\\sin 65°}{\\sin 40°} \\approx 16{,}92 \\text{ cm} \\qquad c = 12 \\cdot \\dfrac{\\sin 75°}{\\sin 40°} \\approx 18{,}03 \\text{ cm}$</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: '\\alpha = 45°, \\; \\beta = 70°, \\; a = 9 \\text{ cm}', stappen: ['\\gamma = 180° - 45° - 70° = 65°', 'b = 9 \\cdot \\frac{\\sin 70°}{\\sin 45°} \\approx 11{,}96 \\text{ cm}', 'c = 9 \\cdot \\frac{\\sin 65°}{\\sin 45°} \\approx 11{,}54 \\text{ cm}'] },
  ],
  soorten: {
    zijde: { naam: 'Twee hoeken en een zijde', gen() {
      const D = maakDriehoek(), b = D.a * sin(D.β) / sin(D.α), c = D.a * sin(D.γ) / sin(D.α);
      return { soort: 'zijde', opdracht: 'Bereken eerst de derde hoek, dan de zijden met de sinusregel.', html: driehoekSVG(D, { α: D.α, β: D.β, a: kg(D.a), b: '?', c: '?' }) + opgave(`Gegeven: α = ${D.α}°, β = ${D.β}°, a = ${kg(D.a)} cm.`), sleutel: `${D.α}${D.β}${D.a}`,
        antw: { soort: 'delen', delen: [{ label: '\\gamma =', antw: getal(D.γ, { na: '°' }) }, { label: 'b =', antw: zijde(b) }, { label: 'c =', antw: zijde(c) }] },
        uitleg: [`\\gamma = 180° - ${D.α}° - ${D.β}° = ${D.γ}°`, `b = ${tg(D.a)} \\cdot \\frac{\\sin ${D.β}°}{\\sin ${D.α}°} \\approx ${tg(b, 2)}`, `c = ${tg(D.a)} \\cdot \\frac{\\sin ${D.γ}°}{\\sin ${D.α}°} \\approx ${tg(c, 2)}`] };
    } },
    andere: { naam: 'Andere hoek-zijde-paren', gen() {
      const D = maakDriehoek(), c = r2(D.c), a = c * sin(D.α) / sin(D.γ);
      return { soort: 'andere', opdracht: 'Zoek het gekende hoek-zijde-paar.', html: driehoekSVG(D, { α: D.α, γ: D.γ, c: kg(c), a: '?' }) + opgave(`Gegeven: α = ${D.α}°, γ = ${D.γ}°, c = ${kg(c)} cm.`) + vraag('Bereken a.'), sleutel: `o${D.α}${D.γ}${c}`,
        antw: zijde(a), uitleg: [`\\frac{a}{\\sin ${D.α}°} = \\frac{${tg(c)}}{\\sin ${D.γ}°}`, `a = ${tg(c)} \\cdot \\frac{\\sin ${D.α}°}{\\sin ${D.γ}°} \\approx ${tg(a, 2)}`] };
    } },
    hoek: { naam: 'Een hoek berekenen', gen() {
      // twee zijden en een tegenoverliggende hoek; de gegeven hoek ligt tegenover de grootste gegeven zijde → één oplossing
      let D; do { D = maakDriehoek(); } while (!(D.a > D.b));
      const b = r2(D.b), β = asin(b * sin(D.α) / D.a);
      return { soort: 'hoek', opdracht: 'Sinusregel, dan de inverse sinus (sin⁻¹).', html: driehoekSVG(D, { α: D.α, a: kg(D.a), b: kg(b), β: '?' }) + opgave(`Gegeven: α = ${D.α}°, a = ${kg(D.a)} cm, b = ${kg(b)} cm.`) + vraag('Bereken β.'), sleutel: `h${D.α}${D.a}${b}`,
        antw: hoek(β), uitleg: [`\\sin \\beta = \\frac{${tg(b)} \\cdot \\sin ${D.α}°}{${tg(D.a)}} \\approx ${tg(sin(β), 4)}`, `\\beta \\approx ${tg(β, 2)}°`] };
    } },
  },
  oefenMix: [['zijde', 2], ['andere', 1], ['hoek', 1]],
  test: [['zijde', 4], ['andere', 3], ['hoek', 3]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Cosinusregel: de derde zijde', kort: 'Twee zijden en de ingesloten hoek.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Cosinusregel</div>${NOTATIE}
      <p class="midden">$a^2 = b^2 + c^2 - 2bc \\cdot \\cos \\alpha$</p>
      <p>en cyclisch: $b^2 = a^2 + c^2 - 2ac \\cdot \\cos \\beta$ en $c^2 = a^2 + b^2 - 2ab \\cdot \\cos \\gamma$.</p>
      <p>Bruikbaar als je <b>twee zijden met de ingesloten hoek</b> kent (of drie zijden: deel 3).</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>$a = 8$, $b = 10$, $\\gamma = 55°$. Bereken $c$.</p>
      <p class="midden">$c^2 = 8^2 + 10^2 - 2 \\cdot 8 \\cdot 10 \\cdot \\cos 55° \\approx 72{,}23 \\;\\Rightarrow\\; c \\approx 8{,}50$</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'a = 6, \\; b = 9, \\; \\gamma = 50°', stappen: ['c^2 = 36 + 81 - 2 \\cdot 6 \\cdot 9 \\cdot \\cos 50° \\approx 47{,}58', 'c \\approx 6{,}90'] },
  ],
  soorten: {
    derde: { naam: 'Derde zijde', gen() {
      const D = maakDriehoek(), a = r2(D.a), b = r2(D.b), c = Math.sqrt(a * a + b * b - 2 * a * b * cos(D.γ));
      return { soort: 'derde', opdracht: 'Cosinusregel met de ingesloten hoek γ.', html: driehoekSVG(D, { a: kg(a), b: kg(b), γ: D.γ, c: '?' }) + opgave(`Gegeven: a = ${kg(a)}, b = ${kg(b)}, γ = ${D.γ}°.`) + vraag('Bereken c.'), sleutel: `${a}${b}${D.γ}`,
        antw: zijde(c), uitleg: [`c^2 = ${tg(a)}^2 + ${tg(b)}^2 - 2 \\cdot ${tg(a)} \\cdot ${tg(b)} \\cdot \\cos ${D.γ}° \\approx ${tg(c * c, 2)}`, `c \\approx ${tg(c, 2)}`] };
    } },
    stomp: { naam: 'Met een stompe hoek', gen() {
      const α = rnd(95, 140), b = rnd(5, 15), c = rnd(5, 15), a = Math.sqrt(b * b + c * c - 2 * b * c * cos(α)), β = asin(b * sin(α) / a), D = { α, β, γ: 180 - α - β, a, b, c };
      return { soort: 'stomp', opdracht: 'Let op: cos van een stompe hoek is negatief.', html: driehoekSVG(D, { b, c, α, a: '?' }) + opgave(`Gegeven: b = ${b}, c = ${c}, α = ${α}°.`) + vraag('Bereken a.'), sleutel: `s${α}${b}${c}`,
        antw: zijde(a), uitleg: [`a^2 = ${b}^2 + ${c}^2 - 2 \\cdot ${b} \\cdot ${c} \\cdot \\cos ${α}° \\approx ${tg(a * a, 2)}`, `a \\approx ${tg(a, 2)}`] };
    } },
  },
  oefenMix: [['derde', 2], ['stomp', 1]],
  test: [['derde', 6], ['stomp', 4]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Cosinusregel: een hoek', kort: 'Drie zijden gegeven: de cosinusregel omvormen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een hoek uit drie zijden</div>
      <p>Ken je de drie zijden, vorm dan de cosinusregel om naar de cosinus van de gevraagde hoek:</p>
      <p class="midden">$c^2 = a^2 + b^2 - 2ab \\cos \\gamma \\;\\Longrightarrow\\; \\cos \\gamma = \\dfrac{a^2 + b^2 - c^2}{2ab}$</p>
      <p>Daarna de inverse cosinus ($\\cos^{-1}$). Is $\\cos \\gamma$ negatief, dan is $\\gamma$ stomp.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p>$a = 6$, $b = 9$, $c = 11$: $\\cos \\gamma = \\dfrac{36 + 81 - 121}{108} \\approx -0{,}0370$, dus $\\gamma \\approx 92{,}12°$.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'a = b = 5, \\; c = 8', stappen: ['\\cos \\gamma = \\frac{25 + 25 - 64}{2 \\cdot 5 \\cdot 5} = -0{,}28', '\\gamma \\approx 106{,}26°, \\quad \\alpha = \\beta \\approx 36{,}87° \\text{ (gelijkbenig)}'] },
  ],
  soorten: {
    hoek: { naam: 'Hoek uit drie zijden', gen() {
      let a, b, c; do { a = rnd(4, 15); b = rnd(4, 15); c = rnd(4, 15); } while (a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1);
      const welk = kies(['α', 'β', 'γ']), [x, y, z] = welk === 'α' ? [b, c, a] : welk === 'β' ? [a, c, b] : [a, b, c], cw = (x * x + y * y - z * z) / (2 * x * y), w = acos(cw);
      const α = acos((b * b + c * c - a * a) / (2 * b * c)), β = acos((a * a + c * c - b * b) / (2 * a * c));
      return { soort: 'hoek', opdracht: 'Vorm de cosinusregel om naar de cosinus van de gevraagde hoek.', html: driehoekSVG({ a, b, c, α, β, γ: 180 - α - β }, { a, b, c, [welk]: '?' }) + opgave(`Gegeven: a = ${a}, b = ${b}, c = ${c}.`) + vraag(`Bereken ${welk}.`), sleutel: `${a}${b}${c}${welk}`,
        antw: hoek(w), uitleg: [`\\cos ${LET[welk]} = \\frac{${x}^2 + ${y}^2 - ${z}^2}{2 \\cdot ${x} \\cdot ${y}} \\approx ${tg(cw, 4)}`, `${LET[welk]} \\approx ${tg(w, 2)}°`] };
    } },
    grootste: { naam: 'Grootste hoek', gen() {
      let a, b, c; do { a = rnd(4, 15); b = rnd(4, 15); c = rnd(4, 15); } while (a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1 || new Set([a, b, c]).size < 3);
      const z = Math.max(a, b, c), [x, y] = [a, b, c].filter(v => v !== z), w = acos((x * x + y * y - z * z) / (2 * x * y)), stomp = w > 90;
      return { soort: 'grootste', opdracht: 'De grootste hoek ligt tegenover de grootste zijde.', html: opgave(`Een driehoek heeft zijden ${a}, ${b} en ${c}.`) + vraag('Bereken de grootste hoek. Is de driehoek stomphoekig?'), sleutel: `g${a}${b}${c}`,
        antw: { soort: 'delen', delen: [{ label: '\\text{grootste hoek}', antw: hoek(w) }, { label: '\\text{stomphoekig?}', antw: tekstKeuze(['ja', 'nee'], stomp ? 'ja' : 'nee') }] },
        uitleg: [`\\cos \\varphi = \\frac{${x}^2 + ${y}^2 - ${z}^2}{2 \\cdot ${x} \\cdot ${y}} \\approx ${tg(Math.cos(w * RAD), 4)}`, `\\varphi \\approx ${tg(w, 2)}° \\; ${stomp ? '> 90°: \\text{ stomphoekig}' : '< 90°: \\text{ niet stomphoekig}'}`] };
    } },
  },
  oefenMix: [['hoek', 2], ['grootste', 1]],
  test: [['hoek', 6], ['grootste', 4]], testSchudden: true,
};

const SITS = [
  ['α = 40°, β = 75°, a = 9', 'sinusregel', 'twee hoeken en een zijde'], ['a = 5, b = 7, c = 9', 'cosinusregel', 'drie zijden'], ['b = 6, c = 10, α = 48°', 'cosinusregel', 'twee zijden met de ingesloten hoek'],
  ['a = 12, b = 9, α = 70°', 'sinusregel', 'twee zijden en een tegenoverliggende hoek'], ['β = 35°, γ = 100°, b = 14', 'sinusregel', 'twee hoeken en een zijde'], ['a = 8, c = 11, β = 120°', 'cosinusregel', 'twee zijden met de ingesloten hoek'],
  ['a = 7, b = 7, c = 10', 'cosinusregel', 'drie zijden'], ['α = 55°, γ = 65°, c = 20', 'sinusregel', 'twee hoeken en een zijde'], ['b = 15, c = 11, γ = 40°', 'sinusregel', 'twee zijden en een tegenoverliggende hoek'],
];
const D4 = {
  nr: 4, titel: 'Welke regel gebruik je?', kort: 'De vuistregel toepassen.', rekenmachine: false,
  theorie: `${VUIST}
    <div class="kader"><div class="kader-titel">Waarom niet de cosinusregel bij een niet-ingesloten hoek?</div><p>Bij twee zijden en een hoek die <b>niet</b> tussen die zijden ligt, ken je een hoek-zijde-paar: dan geeft de sinusregel meteen een vergelijking met één onbekende.</p></div>`,
  voorbeelden: [
    { tex: 'a = 8, \\; b = 10, \\; \\gamma = 55°', stappen: ['\\gamma \\text{ ligt tussen } a \\text{ en } b: \\text{ ingesloten hoek}', '\\text{cosinusregel}'] },
  ],
  soorten: {
    welke: { naam: 'Sinus- of cosinusregel?', gen() {
      const [g, j] = kies(SITS);
      return { soort: 'welke', opdracht: 'Kijk welke gegevens je hebt.', html: opgave(`Gegeven: ${g}.`) + vraag('Welke regel gebruik je eerst?'), sleutel: g, antw: tekstKeuze(['sinusregel', 'cosinusregel'], j), uitleg: [tx(`${SITS.find(s => s[0] === g)[2]}: ${j}`)] };
    } },
    waarom: { naam: 'Welk soort gegevens?', gen() {
      const [g, , soort] = kies(SITS), alle = ['twee hoeken en een zijde', 'drie zijden', 'twee zijden met de ingesloten hoek', 'twee zijden en een tegenoverliggende hoek'];
      const opties = schud(alle);
      return { soort: 'waarom', opdracht: 'Herken het type gegevens.', html: opgave(`Gegeven: ${g}.`) + vraag('Wat voor gegevens heb je?'), sleutel: 'w' + g,
        antw: { soort: 'keuze', lijst: true, opties: opties.map((o, i) => ({ k: String(i), l: o, html: true })), juist: String(opties.indexOf(soort)) }, uitleg: [tx(soort)] };
    } },
  },
  oefenMix: [['welke', 3], ['waarom', 2]],
  test: [['welke', 6], ['waarom', 4]], testSchudden: true,
};

const D5 = {
  nr: 5, titel: 'Toepassingen', kort: 'Meetkundige problemen oplossen met de sinus- en cosinusregel.', rekenmachine: true,
  theorie: `${VUIST}<div class="kader werk"><div class="kader-titel">Werkwijze bij een vraagstuk</div>
      <ol><li>Teken de driehoek en zet alle gegevens erbij.</li><li>Benoem de gevraagde zijde of hoek.</li><li>Kies de juiste regel (vuistregel).</li><li>Reken uit en antwoord met een eenheid.</li></ol></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Een landmeter wil de afstand PQ meten, maar er staat een gebouw tussen. Vanaf R meet ze: hoek P = 48°, hoek Q = 62° en QR = 120 m.'), stappen: ['\\hat{R} = 180° - 48° - 62° = 70°', '\\frac{PQ}{\\sin 70°} = \\frac{120}{\\sin 48°}', 'PQ = 120 \\cdot \\frac{\\sin 70°}{\\sin 48°} \\approx 151{,}74 \\text{ m}'] },
  ],
  soorten: {
    meer: { naam: 'Afstand over een meer', gen() {
      const p = rnd(60, 300), q = rnd(60, 300), h = rnd(35, 140), d = Math.sqrt(p * p + q * q - 2 * p * q * cos(h));
      return { soort: 'meer', opdracht: 'Twee zijden en de ingesloten hoek.', html: opgave(`Om de breedte van een meer te bepalen, meet een landmeter vanuit punt C de afstanden tot de oevers A en B: CA = ${p} m en CB = ${q} m. De hoek ACB is ${h}°.`) + vraag('Hoe breed is het meer (afstand AB)? Rond af op 0,01 m.'), sleutel: `${p}${q}${h}`,
        antw: getal(d, { dec: 2, na: '\\text{ m}' }), uitleg: [`AB^2 = ${p}^2 + ${q}^2 - 2 \\cdot ${p} \\cdot ${q} \\cdot \\cos ${h}°`, `AB \\approx ${tg(d, 2)} \\text{ m}`] };
    } },
    gebouw: { naam: 'Afstand voorbij een obstakel', gen() {
      const P = rnd(35, 75), Q = rnd(35, 75), QR = rnd(60, 250), R = 180 - P - Q, PQ = QR * sin(R) / sin(P);
      return { soort: 'gebouw', opdracht: 'Twee hoeken en een zijde.', html: opgave(`Tussen twee punten P en Q staat een gebouw. Vanaf een derde punt R meet je: hoek P = ${P}°, hoek Q = ${Q}° en QR = ${QR} m.`) + vraag('Bereken de afstand PQ. Rond af op 0,01 m.'), sleutel: `g${P}${Q}${QR}`,
        antw: getal(PQ, { dec: 2, na: '\\text{ m}' }), uitleg: [`\\hat{R} = 180° - ${P}° - ${Q}° = ${R}°`, `PQ = ${QR} \\cdot \\frac{\\sin ${R}°}{\\sin ${P}°} \\approx ${tg(PQ, 2)} \\text{ m}`] };
    } },
    perceel: { naam: 'Hoek van een driehoekig perceel', gen() {
      let a, b, c; do { a = rnd(20, 90); b = rnd(20, 90); c = rnd(20, 90); } while (a + b <= c + 5 || a + c <= b + 5 || b + c <= a + 5);
      const w = acos((a * a + b * b - c * c) / (2 * a * b));
      return { soort: 'perceel', opdracht: 'Drie zijden.', html: opgave(`Een driehoekig perceel heeft zijden van ${a} m, ${b} m en ${c} m.`) + vraag(`Hoe groot is de hoek tussen de zijden van ${a} m en ${b} m? Rond af op 0,01°.`), sleutel: `p${a}${b}${c}`,
        antw: hoek(w), uitleg: [`\\cos \\varphi = \\frac{${a}^2 + ${b}^2 - ${c}^2}{2 \\cdot ${a} \\cdot ${b}} \\approx ${tg(Math.cos(w * RAD), 4)}`, `\\varphi \\approx ${tg(w, 2)}°`] };
    } },
    molecule: { naam: 'Bindingshoek', gen() {
      const l1 = kies([0.96, 1.01, 1.09, 1.21, 1.43]), l2 = l1, d = kies([1.52, 1.62, 1.78, 2.05].filter(x => x < 1.9 * l1)), w = acos((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2));
      return { soort: 'molecule', opdracht: 'Drie zijden: cosinusregel.', html: opgave(`In een molecule zijn twee atomen elk ${kg(l1)} Å verwijderd van het centrale atoom. De afstand tussen die twee atomen is ${kg(d)} Å.`) + vraag('Bereken de bindingshoek bij het centrale atoom. Rond af op 0,01°.'), sleutel: `m${l1}${d}`,
        antw: hoek(w), uitleg: [`\\cos \\varphi = \\frac{${tg(l1)}^2 + ${tg(l2)}^2 - ${tg(d)}^2}{2 \\cdot ${tg(l1)} \\cdot ${tg(l2)}} \\approx ${tg(Math.cos(w * RAD), 4)}`, `\\varphi \\approx ${tg(w, 2)}°`] };
    } },
  },
  oefenMix: [['meer', 1], ['gebouw', 1], ['perceel', 1], ['molecule', 1]],
  test: [['meer', 3], ['gebouw', 3], ['perceel', 2], ['molecule', 2]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D6 = {
  nr: 6, titel: 'Eindtest sinus- en cosinusregel', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar.</p>
    <p class="midden">$\\dfrac{a}{\\sin \\alpha} = \\dfrac{b}{\\sin \\beta} = \\dfrac{c}{\\sin \\gamma} \\qquad a^2 = b^2 + c^2 - 2bc \\cos \\alpha$</p></div>${VUIST}${AFSPRAAK}`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'zijde', 'Sinusregel'), e2: mix(D1, 'andere', 'Sinusregel'), e3: mix(D1, 'hoek', 'Sinusregel: hoek'), e4: mix(D2, 'derde', 'Cosinusregel: zijde'), e5: mix(D2, 'stomp', 'Cosinusregel: stompe hoek'),
    e6: mix(D3, 'hoek', 'Cosinusregel: hoek'), e7: mix(D4, 'welke', 'Welke regel?'), e8: mix(D5, 'meer', 'Toepassing'), e9: mix(D5, 'gebouw', 'Toepassing'), e10: mix(D5, 'perceel', 'Toepassing') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6]) {
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
  code: 'sinus-cosinusregel',
  titel: 'Sinus- en cosinusregel',
  ondertitel: 'Toegepaste wiskunde · 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je herhaalt de <b>sinusregel</b> en de <b>cosinusregel</b> uit het 4de jaar en gebruikt ze om driehoeken op te lossen en meetkundige problemen aan te pakken. Je leert ook kiezen welke regel je nodig hebt.
    Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open. Zet je rekenmachine in graden.</p>`,
  groepen: [
    { titel: 'A · De sinusregel', delen: [1] },
    { titel: 'B · De cosinusregel', delen: [2, 3] },
    { titel: 'C · Kiezen en toepassen', delen: [4, 5] },
    { titel: 'D · Eindtest', delen: [6] },
  ],
  delen: [D1, D2, D3, D4, D5, D6],
});
