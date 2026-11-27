// ===== Sinus- en cosinusregel · Toegepaste wiskunde 4BW =====
// Leidraad: cursus TWiskunde 4BW hoofdstuk 8 "Sinus- en cosinusregel" (G. Walschap). Notatie zoals in de cursus: hoeken A, B, C; zijde a ligt tegenover hoek A.
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(d === null ? x : W.rond(x, d));
const kg = (x) => String(x).replace('.', ',');
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud(opties.map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const RAD = Math.PI / 180, sin = (g) => Math.sin(g * RAD), cos = (g) => Math.cos(g * RAD), asin = (v) => Math.asin(v) / RAD, acos = (v) => Math.acos(v) / RAD;
const r2 = (x) => W.rond(x, 2);
const zijde = (w) => getal(w, { dec: 2 }), hoek = (w) => getal(w, { dec: 2, na: '°' });
const LET = { α: 'A', β: 'B', γ: 'C' };
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
  const hc = (k, p, q, r) => { const t = toon[k]; const binnen = naar(p, mid(q, r), 30); let s = lab(k === 'α' ? 'A' : k === 'β' ? 'B' : 'C', naar(p, mid(q, r), -14).map((v, i) => v + (i ? 5 : 0)), '#4e6577'); if (t !== undefined) s += lab(t === "?" ? "?" : `${t}°`, [binnen[0], binnen[1] + 5], t === '?' ? '#c2561a' : '#e8772e', true); return s; };
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


const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraken</div><ul><li>Zet je rekenmachine in <b>graden</b> (DEG).</li><li>Rond zijden en hoeken af op <b>0,01</b>. Reken verder met de niet-afgeronde waarden.</li></ul></div>`;
const NOTATIE = `<p>In een driehoek $ABC$ ligt zijde $a$ tegenover hoek $A$ (dus $a = |BC|$), zijde $b$ tegenover hoek $B$ ($b = |AC|$) en zijde $c$ tegenover hoek $C$ ($c = |AB|$).</p>`;
const TABEL = `<table class="tabel"><tr><th>gegeven</th><th>gebruik</th><th>berekent</th></tr>
  <tr><td>2 hoeken + 1 zijde</td><td>sinusregel</td><td>een andere zijde</td></tr>
  <tr><td>2 zijden + hoek tegenover een gekende zijde</td><td>sinusregel</td><td>een hoek (dubbelzinnig!)</td></tr>
  <tr><td>2 zijden + de ingesloten hoek</td><td>cosinusregel</td><td>de derde zijde</td></tr>
  <tr><td>3 zijden</td><td>cosinusregel</td><td>een hoek</td></tr></table>`;
const SINUS = `<p class="midden">$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}$</p>`;
const COSINUS = `<p class="midden">$a^2 = b^2 + c^2 - 2bc \\cdot \\cos A$</p>`;

// ===================================================================
const D1 = {
  nr: 1, titel: 'De sinusregel: een zijde', kort: 'a / sin A = b / sin B = c / sin C', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Van rechthoekige naar willekeurige driehoeken</div><p>SOS-CAS-TOA werkt enkel in een <b>rechthoekige</b> driehoek. Voor een willekeurige driehoek gebruik je de <b>sinusregel</b> en de <b>cosinusregel</b>.</p>${NOTATIE}</div>
    <div class="kader def"><div class="kader-titel">Sinusregel</div><p>In elke driehoek $ABC$ geldt:</p>${SINUS}
      <p>In woorden: de verhouding van een zijde tot de sinus van de <b>tegenoverliggende</b> hoek is voor de drie zijden dezelfde.</p>
      <p>Je gebruikt ze als je minstens één <b>zijde met de hoek ertegenover</b> kent, plus één extra gegeven. Bij <b>2 hoeken + 1 zijde</b> bereken je zo een andere zijde.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p>Hoek $A = 35°$, hoek $B = 80°$, $a = 6$ cm. Bereken $b$.</p>
      <p class="midden">$\\dfrac{6}{\\sin 35°} = \\dfrac{b}{\\sin 80°} \\quad\\Longleftrightarrow\\quad b = \\dfrac{6 \\cdot \\sin 80°}{\\sin 35°} \\approx 10{,}30 \\text{ cm}$</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'A = 50°, \\quad B = 60°, \\quad a = 9 \\text{ cm. Bereken } c.', stappen: ['C = 180° - 50° - 60° = 70°', '\\frac{9}{\\sin 50°} = \\frac{c}{\\sin 70°}', 'c = \\frac{9 \\cdot \\sin 70°}{\\sin 50°} \\approx 11{,}04 \\text{ cm}'] },
  ],
  soorten: {
    tegenover: { naam: 'Welke zijde ligt tegenover?', gen() {
      const h = kies(['A', 'B', 'C']), juist = { A: 'a = |BC|', B: 'b = |AC|', C: 'c = |AB|' }[h];
      return { soort: 'tegenover', html: vraag(`Welke zijde ligt tegenover hoek ${h} in driehoek ABC?`), sleutel: `t${h}`, antw: tekstKeuze(['a = |BC|', 'b = |AC|', 'c = |AB|'], juist), uitleg: [tx(`De zijde tegenover hoek ${h} verbindt de twee andere hoekpunten: ${juist}.`)] };
    } },
    zijde: { naam: 'Twee hoeken en de tegenoverliggende zijde', gen() {
      const D = maakDriehoek(), b = D.a * sin(D.β) / sin(D.α);
      return { soort: 'zijde', opdracht: 'Stel de sinusregel op met het gekende paar a en A.', html: driehoekSVG(D, { α: D.α, β: D.β, a: kg(D.a), b: '?' }) + opgave(`Gegeven: hoek A = ${D.α}°, hoek B = ${D.β}°, a = ${kg(D.a)} cm.`) + vraag('Bereken b.'), sleutel: `${D.α}${D.β}${D.a}`,
        antw: zijde(b), uitleg: [`\\frac{${tg(D.a)}}{\\sin ${D.α}°} = \\frac{b}{\\sin ${D.β}°}`, `b = \\frac{${tg(D.a)} \\cdot \\sin ${D.β}°}{\\sin ${D.α}°} \\approx ${tg(b, 2)} \\text{ cm}`] };
    } },
    derde: { naam: 'Eerst de derde hoek', gen() {
      const D = maakDriehoek(), c = D.a * sin(D.γ) / sin(D.α);
      return { soort: 'derde', opdracht: 'Bereken eerst hoek C (som van de hoeken is 180°).', html: driehoekSVG(D, { α: D.α, β: D.β, a: kg(D.a), c: '?' }) + opgave(`Gegeven: hoek A = ${D.α}°, hoek B = ${D.β}°, a = ${kg(D.a)} cm.`), sleutel: `d${D.α}${D.β}${D.a}`,
        antw: { soort: 'delen', delen: [{ label: 'C =', antw: getal(D.γ, { na: '°' }) }, { label: 'c =', antw: zijde(c) }] },
        uitleg: [`C = 180° - ${D.α}° - ${D.β}° = ${D.γ}°`, `c = \\frac{${tg(D.a)} \\cdot \\sin ${D.γ}°}{\\sin ${D.α}°} \\approx ${tg(c, 2)} \\text{ cm}`] };
    } },
  },
  oefenMix: [['tegenover', 1], ['zijde', 2], ['derde', 2]],
  test: [['tegenover', 2], ['zijde', 4], ['derde', 4]], testSchudden: true,
};

// twee zijden a, b en hoek A (tegenover a); twee: b > a (twee oplossingen), anders één
function maakSSA(twee) {
  for (;;) {
    const A = rnd(20, 60), a = rnd(5, 14), b = twee ? rnd(a + 1, a + 8) : rnd(4, a - 1);
    const s = b * sin(A) / a; if (s >= 0.97 || b < 3) continue;
    const B1 = asin(s), B2 = 180 - B1;
    return { A, a, b, s, B1, B2, geldig2: A + B2 < 180 };
  }
}
const D2 = {
  nr: 2, titel: 'De sinusregel: een hoek en het dubbelzinnige geval', kort: 'sin B = … heeft twee oplossingen tussen 0° en 180°.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een hoek berekenen</div><p>Ken je <b>2 zijden en de hoek tegenover één ervan</b>, dan geeft de sinusregel de sinus van een andere hoek:</p>
      <p class="midden">$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} \\quad\\Longleftrightarrow\\quad \\sin B = \\dfrac{b \\cdot \\sin A}{a}$</p></div>
    <div class="kader eig"><div class="kader-titel">Het dubbelzinnige geval</div><p>$\\sin B = s$ heeft <b>twee oplossingen</b> tussen 0° en 180°: $B_1 = \\sin^{-1}(s)$ en $B_2 = 180° - B_1$, want $\\sin(180° - B) = \\sin B$.</p>
      <p>Controleer bij elke oplossing of de som van de hoeken <b>kleiner dan 180°</b> is. Zijn beide geldig, dan kan je zonder extra informatie (bv. "B is stomp") niet kiezen.</p>
      <p>Dit gebeurt enkel als je de hoek <b>tegenover</b> een gekende zijde kent, niet de ingesloten hoek.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'a = 8, \\quad A = 35°, \\quad b = 12. \\text{ Bereken } B.', stappen: ['\\sin B = \\frac{12 \\cdot \\sin 35°}{8} \\approx 0{,}8604', 'B_1 \\approx 59{,}36° \\quad \\text{of} \\quad B_2 = 180° - 59{,}36° = 120{,}64°', '35° + 120{,}64° < 180°: \\text{ beide geldig}'] },
    { tex: 'a = 12, \\quad A = 70°, \\quad b = 9. \\text{ Bereken } B.', stappen: ['\\sin B = \\frac{9 \\cdot \\sin 70°}{12} \\approx 0{,}7048', 'B_1 \\approx 44{,}81° \\quad \\text{of} \\quad B_2 \\approx 135{,}19°', '70° + 135{,}19° > 180°: B_2 \\text{ vervalt, dus } B \\approx 44{,}81°'] },
  ],
  soorten: {
    sinb: { naam: 'sin B berekenen', gen() {
      const T = maakSSA(kies([true, false]));
      return { soort: 'sinb', html: opgave(`Gegeven: a = ${T.a}, hoek A = ${T.A}°, b = ${T.b}.`) + vraag('Bereken sin B (afgerond op 0,0001).'), sleutel: `sb${T.a}${T.A}${T.b}`,
        antw: getal(W.rond(T.s, 4), { dec: 4 }), uitleg: [`\\sin B = \\frac{${T.b} \\cdot \\sin ${T.A}°}{${T.a}} \\approx ${tg(T.s, 4)}`] };
    } },
    beide: { naam: 'Twee oplossingen', gen() {
      const T = maakSSA(true);
      return { soort: 'beide', opdracht: 'Bereken beide mogelijke hoeken.', html: opgave(`Gegeven: a = ${T.a}, hoek A = ${T.A}°, b = ${T.b}.`) + vraag('Bereken de twee mogelijke waarden van hoek B.'), sleutel: `be${T.a}${T.A}${T.b}`,
        antw: { soort: 'delen', delen: [{ label: 'B_1 =', antw: hoek(T.B1) }, { label: 'B_2 =', antw: hoek(T.B2) }] },
        uitleg: [`\\sin B = \\frac{${T.b} \\cdot \\sin ${T.A}°}{${T.a}} \\approx ${tg(T.s, 4)}`, `B_1 \\approx ${tg(T.B1, 2)}°`, `B_2 = 180° - ${tg(T.B1, 2)}° \\approx ${tg(T.B2, 2)}°`, `${T.A}° + ${tg(T.B2, 2)}° < 180°: \\text{ beide geldig}`] };
    } },
    aantal: { naam: 'Hoeveel driehoeken?', gen() {
      const T = maakSSA(kies([true, false])), n = T.geldig2 ? '2' : '1';
      return { soort: 'aantal', opdracht: 'Controleer of A + B₂ kleiner is dan 180°.', html: opgave(`Gegeven: a = ${T.a}, hoek A = ${T.A}°, b = ${T.b}.`) + vraag('Hoeveel driehoeken voldoen hieraan?'), sleutel: `aa${T.a}${T.A}${T.b}`,
        antw: tekstKeuze(['1', '2'], n), uitleg: [`B_1 \\approx ${tg(T.B1, 2)}°, \\quad B_2 \\approx ${tg(T.B2, 2)}°`, `${T.A}° + ${tg(T.B2, 2)}° ${T.geldig2 ? '< 180°: \\text{ twee driehoeken}' : '> 180°: \\text{ enkel } B_1, \\text{ één driehoek}'}`] };
    } },
    stomp: { naam: 'Met extra informatie', gen() {
      const T = maakSSA(true), w = kies(['scherp', 'stomp']);
      return { soort: 'stomp', html: opgave(`Gegeven: a = ${T.a}, hoek A = ${T.A}°, b = ${T.b}. Je weet bovendien dat hoek B ${w} is.`) + vraag('Bereken hoek B.'), sleutel: `st${T.a}${T.A}${T.b}${w}`,
        antw: hoek(w === 'scherp' ? T.B1 : T.B2), uitleg: [`B_1 \\approx ${tg(T.B1, 2)}° \\text{ of } B_2 \\approx ${tg(T.B2, 2)}°`, tx(`B is ${w}: B ≈ ${kg(r2(w === 'scherp' ? T.B1 : T.B2))}°`)] };
    } },
  },
  oefenMix: [['sinb', 1], ['beide', 2], ['aantal', 1], ['stomp', 1]],
  test: [['sinb', 2], ['beide', 3], ['aantal', 3], ['stomp', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'De cosinusregel: een zijde', kort: 'Twee zijden en de ingesloten hoek.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Cosinusregel</div><p>In elke driehoek $ABC$ geldt:</p>${COSINUS}
      <p>en analoog $b^2 = a^2 + c^2 - 2ac \\cdot \\cos B$ en $c^2 = a^2 + b^2 - 2ab \\cdot \\cos C$.</p>
      <p>Je gebruikt ze bij <b>2 zijden + de ingesloten hoek</b> (de hoek tussen die twee zijden): zo bereken je de derde zijde.</p></div>
    <div class="kader eig"><div class="kader-titel">Veralgemening van Pythagoras</div><p>Is $A = 90°$, dan is $\\cos A = 0$ en krijg je $a^2 = b^2 + c^2$: de stelling van Pythagoras.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'b = 5, \\quad c = 9, \\quad A = 62°. \\text{ Bereken } a.', stappen: ['a^2 = 5^2 + 9^2 - 2 \\cdot 5 \\cdot 9 \\cdot \\cos 62°', 'a^2 = 25 + 81 - 90 \\cdot 0{,}4695 \\approx 63{,}75', 'a = \\sqrt{63{,}75} \\approx 7{,}98'] },
  ],
  soorten: {
    derde: { naam: 'De derde zijde', gen() {
      const α = rnd(25, 85), b = rnd(4, 15), c = rnd(4, 15), a = Math.sqrt(b * b + c * c - 2 * b * c * cos(α)), β = acos((a * a + c * c - b * b) / (2 * a * c)), D = { α, β, γ: 180 - α - β, a, b, c };
      return { soort: 'derde', opdracht: 'Cosinusregel met de ingesloten hoek A.', html: driehoekSVG(D, { b, c, α, a: '?' }) + opgave(`Gegeven: b = ${b}, c = ${c}, hoek A = ${α}°.`) + vraag('Bereken a.'), sleutel: `${α}${b}${c}`,
        antw: zijde(a), uitleg: [`a^2 = ${b}^2 + ${c}^2 - 2 \\cdot ${b} \\cdot ${c} \\cdot \\cos ${α}° \\approx ${tg(a * a, 2)}`, `a = \\sqrt{${tg(a * a, 2)}} \\approx ${tg(a, 2)}`] };
    } },
    andere: { naam: 'Een andere zijde', gen() {
      const γ = rnd(30, 130), a = rnd(4, 15), b = rnd(4, 15), c = Math.sqrt(a * a + b * b - 2 * a * b * cos(γ)), α = acos((b * b + c * c - a * a) / (2 * b * c)), D = { α, β: 180 - α - γ, γ, a, b, c };
      return { soort: 'andere', opdracht: 'Welke hoek ligt tussen a en b?', html: driehoekSVG(D, { a, b, γ, c: '?' }) + opgave(`Gegeven: a = ${a}, b = ${b}, hoek C = ${γ}°.`) + vraag('Bereken c.'), sleutel: `o${γ}${a}${b}`,
        antw: zijde(c), uitleg: [`c^2 = ${a}^2 + ${b}^2 - 2 \\cdot ${a} \\cdot ${b} \\cdot \\cos ${γ}° \\approx ${tg(c * c, 2)}`, `c \\approx ${tg(c, 2)}`] };
    } },
    pyth: { naam: 'Cosinusregel en Pythagoras', gen() {
      const [v, j] = kies([['Wat wordt de cosinusregel a² = b² + c² − 2bc · cos A als A = 90°?', 'a² = b² + c²'], ['Hoeveel is cos 90°?', '0'], ['Van welke stelling is de cosinusregel een veralgemening?', 'Pythagoras']]);
      const opt = { 'a² = b² + c²': ['a² = b² + c²', 'a² = b² − c²', 'a² = b² + c² − 2bc', 'a = b + c'], '0': ['0', '1', '−1', '0,5'], Pythagoras: ['Pythagoras', 'Thales', 'de sinusregel', 'de grondformule'] }[j];
      return { soort: 'pyth', html: vraag(v), sleutel: `p${j}`, antw: tekstKeuze(opt, j), uitleg: [tx('Als A = 90°, dan is cos A = 0 en blijft a² = b² + c² over: de stelling van Pythagoras.')] };
    } },
  },
  oefenMix: [['derde', 2], ['andere', 2], ['pyth', 1]],
  test: [['derde', 4], ['andere', 4], ['pyth', 2]], testSchudden: true,
};

function drieZijden() { let a, b, c; do { a = rnd(4, 15); b = rnd(4, 15); c = rnd(4, 15); } while (a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1); return [a, b, c]; }
const D4 = {
  nr: 4, titel: 'De cosinusregel: een hoek', kort: 'Drie zijden gegeven: de cosinusregel omvormen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een hoek uit drie zijden</div><p>Ken je de <b>drie zijden</b>, vorm dan de cosinusregel om naar de cosinus van de gevraagde hoek:</p>
      <p class="midden">$c^2 = a^2 + b^2 - 2ab \\cdot \\cos C \\quad\\Longleftrightarrow\\quad \\cos C = \\dfrac{a^2 + b^2 - c^2}{2ab}$</p>
      <p>Daarna $C = \\cos^{-1}(\\ldots)$. Is $\\cos C$ negatief, dan is $C$ stomp. Hier is er <b>geen</b> dubbelzinnig geval.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { tex: 'a = 4, \\quad b = 7, \\quad c = 9. \\text{ Bereken } C.', stappen: ['\\cos C = \\frac{4^2 + 7^2 - 9^2}{2 \\cdot 4 \\cdot 7} = \\frac{16 + 49 - 81}{56} \\approx -0{,}2857', 'C = \\cos^{-1}(-0{,}2857) \\approx 106{,}60°'] },
  ],
  soorten: {
    hoek: { naam: 'Hoek uit drie zijden', gen() {
      const [a, b, c] = drieZijden(), welk = kies(['α', 'β', 'γ']), [x, y, z] = welk === 'α' ? [b, c, a] : welk === 'β' ? [a, c, b] : [a, b, c], cw = (x * x + y * y - z * z) / (2 * x * y), w = acos(cw);
      const α = acos((b * b + c * c - a * a) / (2 * b * c)), β = acos((a * a + c * c - b * b) / (2 * a * c));
      return { soort: 'hoek', opdracht: 'Vorm de cosinusregel om naar de cosinus van de gevraagde hoek.', html: driehoekSVG({ a, b, c, α, β, γ: 180 - α - β }, { a, b, c, [welk]: '?' }) + opgave(`Gegeven: a = ${a}, b = ${b}, c = ${c}.`) + vraag(`Bereken hoek ${LET[welk]}.`), sleutel: `${a}${b}${c}${welk}`,
        antw: hoek(w), uitleg: [`\\cos ${LET[welk]} = \\frac{${x}^2 + ${y}^2 - ${z}^2}{2 \\cdot ${x} \\cdot ${y}} \\approx ${tg(cw, 4)}`, `${LET[welk]} \\approx ${tg(w, 2)}°`] };
    } },
    grootste: { naam: 'Grootste hoek', gen() {
      let a, b, c; do { [a, b, c] = drieZijden(); } while (new Set([a, b, c]).size < 3);
      const z = Math.max(a, b, c), [x, y] = [a, b, c].filter(v => v !== z), w = acos((x * x + y * y - z * z) / (2 * x * y)), stomp = w > 90;
      return { soort: 'grootste', opdracht: 'De grootste hoek ligt tegenover de grootste zijde.', html: opgave(`Een driehoek heeft zijden ${a}, ${b} en ${c}.`) + vraag('Bereken de grootste hoek. Is hij stomp?'), sleutel: `g${a}${b}${c}`,
        antw: { soort: 'delen', delen: [{ label: '\\text{grootste hoek}', antw: hoek(w) }, { label: '\\text{stomp?}', antw: tekstKeuze(['ja', 'nee'], stomp ? 'ja' : 'nee') }] },
        uitleg: [`\\cos \\varphi = \\frac{${x}^2 + ${y}^2 - ${z}^2}{2 \\cdot ${x} \\cdot ${y}} \\approx ${tg(Math.cos(w * RAD), 4)}`, `\\varphi \\approx ${tg(w, 2)}° \\quad ${stomp ? '> 90°: \\text{ stomp}' : '< 90°: \\text{ niet stomp}'}`] };
    } },
  },
  oefenMix: [['hoek', 3], ['grootste', 2]],
  test: [['hoek', 6], ['grootste', 4]], testSchudden: true,
};

const TYPES = ['2 hoeken + 1 zijde', '2 zijden + hoek tegenover een gekende zijde', '2 zijden + de ingesloten hoek', '3 zijden'];
const SITS = [
  ['hoek A = 40°, hoek B = 75°, a = 9', 0], ['a = 5, b = 7, c = 9', 3], ['b = 6, c = 10, hoek A = 48°', 2], ['a = 12, b = 9, hoek A = 70°', 1], ['hoek B = 35°, hoek C = 100°, b = 14', 0],
  ['a = 8, c = 11, hoek B = 120°', 2], ['a = 7, b = 7, c = 10', 3], ['hoek A = 55°, hoek C = 65°, c = 20', 0], ['b = 15, c = 11, hoek C = 40°', 1], ['a = 6, b = 13, hoek C = 30°', 2],
];
const REGEL = (t) => (t < 2 ? 'sinusregel' : 'cosinusregel');
const D5 = {
  nr: 5, titel: 'Welke regel gebruik je?', kort: 'Sinusregel of cosinusregel kiezen.', rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Welke regel?</div>${TABEL}
      <p>Onthoud: <b>sinusregel</b> bij een zijde-hoek-paar dat tegenover elkaar ligt; <b>cosinusregel</b> bij de ingesloten hoek of bij drie zijden.</p>
      <p>Met enkel drie zijden ken je geen enkele hoek, dus ook geen paar: de sinusregel helpt dan niet.</p></div>`,
  voorbeelden: [
    { tex: 'a = 8, \\quad b = 10, \\quad C = 55°', stappen: ['C \\text{ ligt tussen } a \\text{ en } b: \\text{ ingesloten hoek}', '\\text{cosinusregel: } c^2 = a^2 + b^2 - 2ab \\cos C'] },
  ],
  soorten: {
    welke: { naam: 'Sinus- of cosinusregel?', gen() {
      const [g, t] = kies(SITS);
      return { soort: 'welke', html: opgave(`Gegeven: ${g}.`) + vraag('Welke regel gebruik je eerst?'), sleutel: g, antw: tekstKeuze(['sinusregel', 'cosinusregel'], REGEL(t)), uitleg: [tx(`${TYPES[t]}: ${REGEL(t)}`)] };
    } },
    type: { naam: 'Welk soort gegevens?', gen() {
      const [g, t] = kies(SITS);
      return { soort: 'type', html: opgave(`Gegeven: ${g}.`) + vraag('Wat voor gegevens heb je?'), sleutel: 'w' + g, antw: tekstKeuze(TYPES, TYPES[t]), uitleg: [tx(`${TYPES[t]}: ${REGEL(t)}`)] };
    } },
    ingesloten: { naam: 'Ingesloten of niet?', gen() {
      const [z, h, ok] = kies([['b en c', 'A', true], ['a en c', 'B', true], ['a en b', 'C', true], ['a en b', 'A', false], ['b en c', 'B', false], ['a en c', 'C', false], ['a en c', 'A', false]]);
      return { soort: 'ingesloten', html: vraag(`Je kent de zijden ${z} en hoek ${h}. Is hoek ${h} de ingesloten hoek?`), sleutel: `i${z}${h}`, antw: tekstKeuze(['ja: cosinusregel', 'nee: sinusregel'], ok ? 'ja: cosinusregel' : 'nee: sinusregel'),
        uitleg: [tx(ok ? `Hoek ${h} ligt tussen de zijden ${z}.` : `Hoek ${h} ligt tegenover een van die zijden: je kent een paar, dus sinusregel.`)] };
    } },
  },
  oefenMix: [['welke', 2], ['type', 2], ['ingesloten', 1]],
  test: [['welke', 4], ['type', 3], ['ingesloten', 3]], testSchudden: true,
};

const D6 = {
  nr: 6, titel: 'Toepassingen', kort: 'Driehoeksmeting: afstanden en hoeken berekenen.', rekenmachine: true,
  theorie: `<div class="kader werk"><div class="kader-titel">Werkwijze bij een vraagstuk</div>
      <ol><li>Teken de driehoek en zet alle gegevens erbij.</li><li>Benoem de gevraagde zijde of hoek.</li><li>Kies de juiste regel (tabel).</li><li>Reken uit en antwoord met een eenheid.</li></ol>
      <p>Controle: de grootste zijde ligt tegenover de grootste hoek, en de som van de hoeken is 180°.</p></div>
    <div class="kader"><div class="kader-titel">Driehoeksmeting (triangulatie)</div><p>Door hoeken en afstanden vanaf gekende punten te meten, bereken je afstanden en posities die je niet rechtstreeks kan meten: landmeten, navigatie, gps.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Vanaf een punt P zie je twee bomen Q en R aan de overkant van een vijver. Je meet PQ = 80 m, PR = 65 m en hoek QPR = 52°. Bereken QR.'), stappen: ['\\text{2 zijden + ingesloten hoek: cosinusregel}', 'QR^2 = 80^2 + 65^2 - 2 \\cdot 80 \\cdot 65 \\cdot \\cos 52° \\approx 4222{,}1', 'QR \\approx 64{,}98 \\text{ m}'] },
  ],
  soorten: {
    vijver: { naam: 'Afstand over water', gen() {
      const p = rnd(60, 300), q = rnd(60, 300), h = rnd(35, 140), d = Math.sqrt(p * p + q * q - 2 * p * q * cos(h));
      return { soort: 'vijver', html: opgave(`Vanaf een uitkijkpunt C zie je twee boeien A en B. Je meet CA = ${p} m, CB = ${q} m en hoek ACB = ${h}°.`) + vraag('Bereken de afstand AB tussen de boeien (op 0,01 m).'), sleutel: `${p}${q}${h}`,
        antw: getal(d, { dec: 2, na: '\\text{ m}' }), uitleg: [tx('2 zijden + de ingesloten hoek: cosinusregel'), `AB^2 = ${p}^2 + ${q}^2 - 2 \\cdot ${p} \\cdot ${q} \\cdot \\cos ${h}°`, `AB \\approx ${tg(d, 2)} \\text{ m}`] };
    } },
    obstakel: { naam: 'Afstand voorbij een obstakel', gen() {
      const P = rnd(35, 75), Q = rnd(35, 75), QR = rnd(60, 250), R = 180 - P - Q, PQ = QR * sin(R) / sin(P);
      return { soort: 'obstakel', html: opgave(`Tussen twee palen P en Q staat een schuur. Vanaf een punt R meet je: hoek P = ${P}°, hoek Q = ${Q}° en QR = ${QR} m.`) + vraag('Bereken de afstand PQ (op 0,01 m).'), sleutel: `g${P}${Q}${QR}`,
        antw: getal(PQ, { dec: 2, na: '\\text{ m}' }), uitleg: [tx('2 hoeken + 1 zijde: sinusregel'), `R = 180° - ${P}° - ${Q}° = ${R}°`, `PQ = \\frac{${QR} \\cdot \\sin ${R}°}{\\sin ${P}°} \\approx ${tg(PQ, 2)} \\text{ m}`] };
    } },
    perceel: { naam: 'Hoek van een driehoekig terrein', gen() {
      let a, b, c; do { a = rnd(20, 90); b = rnd(20, 90); c = rnd(20, 90); } while (a + b <= c + 5 || a + c <= b + 5 || b + c <= a + 5);
      const w = acos((a * a + b * b - c * c) / (2 * a * b));
      return { soort: 'perceel', html: opgave(`Een driehoekig speelplein heeft zijden van ${a} m, ${b} m en ${c} m.`) + vraag(`Hoe groot is de hoek tussen de zijden van ${a} m en ${b} m (op 0,01°)?`), sleutel: `p${a}${b}${c}`,
        antw: hoek(w), uitleg: [tx('3 zijden: cosinusregel'), `\\cos \\varphi = \\frac{${a}^2 + ${b}^2 - ${c}^2}{2 \\cdot ${a} \\cdot ${b}} \\approx ${tg(Math.cos(w * RAD), 4)}`, `\\varphi \\approx ${tg(w, 2)}°`] };
    } },
    wandeling: { naam: 'Wandelroute', gen() {
      const x = rnd(2, 9), y = rnd(2, 9), h = rnd(40, 150), d = Math.sqrt(x * x + y * y - 2 * x * y * cos(h));
      return { soort: 'wandeling', html: opgave(`Je wandelt ${x} km rechtdoor, draait en wandelt nog ${y} km. De hoek tussen beide stukken (bij het draaipunt) is ${h}°.`) + vraag('Hoe ver ben je nu in vogelvlucht van je vertrekpunt (op 0,01 km)?'), sleutel: `w${x}${y}${h}`,
        antw: getal(d, { dec: 2, na: '\\text{ km}' }), uitleg: [tx('2 zijden + de ingesloten hoek: cosinusregel'), `d^2 = ${x}^2 + ${y}^2 - 2 \\cdot ${x} \\cdot ${y} \\cdot \\cos ${h}° \\approx ${tg(d * d, 2)}`, `d \\approx ${tg(d, 2)} \\text{ km}`] };
    } },
  },
  oefenMix: [['vijver', 1], ['obstakel', 1], ['perceel', 1], ['wandeling', 1]],
  test: [['vijver', 3], ['obstakel', 3], ['perceel', 2], ['wandeling', 2]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht }; } });
const D7 = {
  nr: 7, titel: 'Eindtest sinus- en cosinusregel', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar.</p>${SINUS}${COSINUS}</div><div class="kader eig"><div class="kader-titel">Welke regel?</div>${TABEL}</div>${AFSPRAAK}`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'zijde', 'Sinusregel: zijde'), e2: mix(D1, 'derde', 'Sinusregel: zijde'), e3: mix(D2, 'beide', 'Dubbelzinnig geval'), e4: mix(D2, 'aantal', 'Hoeveel driehoeken?'), e5: mix(D3, 'derde', 'Cosinusregel: zijde'),
    e6: mix(D4, 'hoek', 'Cosinusregel: hoek'), e7: mix(D5, 'welke', 'Welke regel?'), e8: mix(D6, 'vijver', 'Toepassing'), e9: mix(D6, 'obstakel', 'Toepassing'), e10: mix(D6, 'perceel', 'Toepassing') },
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
  code: 'sinus-cosinusregel-4bw',
  titel: 'Sinus- en cosinusregel',
  ondertitel: 'Toegepaste wiskunde · 4BW',
  klas: '4BW',
  drempel: 70,
  intro: `<p>In een willekeurige driehoek werkt SOS-CAS-TOA niet meer. Je leert de <b>sinusregel</b> en de <b>cosinusregel</b> gebruiken om zijden en hoeken te berekenen, het <b>dubbelzinnige geval</b> herkennen, de juiste regel <b>kiezen</b> en vraagstukken oplossen.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open. Zet je rekenmachine in graden.</p>`,
  groepen: [
    { titel: 'A · De sinusregel', delen: [1, 2] },
    { titel: 'B · De cosinusregel', delen: [3, 4] },
    { titel: 'C · Kiezen en toepassen', delen: [5, 6] },
    { titel: 'D · Eindtest', delen: [7] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7],
});
