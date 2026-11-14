// ===================================================================
//  STELSELS VAN VERGELIJKINGEN — de delen
// ===================================================================
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
const qOf = (s, k) => s[k + 'q'] || Q(s[k]);
const ctrl = (v, x, y) => `${tg(v.a)} \\cdot ${qHaak(x)} ${v.b < 0 ? '-' : '+'} ${Math.abs(v.b)} \\cdot ${qHaak(y)} = ${tg(v.c)} \\;\\checkmark`;
const STAPPEN_TYPEN = `<div class="kader"><div class="kader-titel">Zo vul je in</div>
  <p>Werk op papier en vul bij elke stap je tussenresultaat in. Een breuk maak je met de toets <code>/</code> of met de knop <span class="tk-breuk" style="display:inline-flex"><span>a</span><span>b</span></span>: je ziet dan meteen een echte breuk. Met de pijltjestoetsen ga je van teller naar noemer en weer uit de breuk.</p></div>`;

// ---- 1. Wat is een stelsel? ---------------------------------------------------------
const D1 = {
  nr: 1, titel: 'Wat is een 2×2 stelsel?', kort: 'Twee vergelijkingen, twee onbekenden: een koppel (x, y) dat aan beide voldoet.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Instap: twee vrienden aan de kassa</div>
      <p>Jonas koopt 3 broodjes en 4 drankjes en betaalt 54 euro. Sara koopt 1 broodje en 5 drankjes en betaalt 40 euro. Met $x$ de prijs van een broodje en $y$ de prijs van een drankje:</p>
      <p class="midden">$${stelselTex({ a: 3, b: 4, c: 54 }, { a: 1, b: 5, c: 40 })}$</p></div>
    <div class="kader def"><div class="kader-titel">Definitie</div>
      <p>Een <b>2×2 stelsel van vergelijkingen</b> bestaat uit 2 eerstegraadsvergelijkingen met 2 onbekenden, die samen als één geheel moeten worden opgelost.</p>
      <p>Een <b>oplossing</b> is een koppel reële getallen $(x, y)$ dat aan <b>beide</b> vergelijkingen tegelijk voldoet. De oplossingsverzameling noteer je als $V$, bv. $V = \\{(10, 6)\\}$.</p></div>
    <div class="kader eig"><div class="kader-titel">Controleren</div>
      <p>Vul het koppel in in <b>beide</b> vergelijkingen. Kloppen ze allebei? Dan is het een oplossing. Klopt er maar één? Dan niet!</p>
      <p class="klein">$(10, 6)$: &nbsp; $3 \\cdot 10 + 4 \\cdot 6 = 54 \\;\\checkmark$ &nbsp; en &nbsp; $10 + 5 \\cdot 6 = 40 \\;\\checkmark$</p></div>`,
  voorbeelden: [
    { tex: `${stelselTex({ a: -1, b: 1, c: -3 }, { a: -2, b: 1, c: -8 })} \\quad (5, 2)?`, stappen: ['-5 + 2 = -3 \\;\\checkmark', '-2 \\cdot 5 + 2 = -8 \\;\\checkmark', '\\text{ja: } V = \\{(5, 2)\\}'] },
    { tex: `${stelselTex({ a: 2, b: 1, c: 11 }, { a: 1, b: -1, c: 1 })} \\quad (3, 5)?`, stappen: ['2 \\cdot 3 + 5 = 11 \\;\\checkmark', '3 - 5 = -2 \\neq 1', '\\text{nee: niet aan beide vergelijkingen voldaan}'] },
  ],
  soorten: {
    oplossing: { naam: 'Is het koppel een oplossing?', gen() {
      const s = stelsel(), ok = kies([true, false]);
      let px = s.x, py = s.y;
      if (!ok) { do { px = s.x + rnd(-2, 2); py = s.y + rnd(-2, 2); } while ((px === s.x && py === s.y)); }
      const w1 = s.v1.a * px + s.v1.b * py, w2 = s.v2.a * px + s.v2.b * py;
      const zin = (v, w) => `${tg(v.a)} \\cdot ${h(px)} ${v.b < 0 ? '-' : '+'} ${Math.abs(v.b)} \\cdot ${h(py)} = ${tg(w)} ${w === v.c ? '\\;\\checkmark' : `\\neq ${tg(v.c)}`}`;
      return { soort: 'oplossing', opdracht: `Is het koppel (${px}, ${py}) een oplossing van het stelsel?`.replace(/-/g, '−'), tex: `${stelselTex(s.v1, s.v2)} \\qquad (${tg(px)}, ${tg(py)})`,
        antw: keuze(kT(['ja', 'nee']), ok ? 0 : 1), uitleg: [zin(s.v1, w1), zin(s.v2, w2), ok ? '\\text{ja: beide vergelijkingen kloppen}' : '\\text{nee: niet beide vergelijkingen kloppen}'] };
    } },
    welk: { naam: 'Welk koppel is de oplossing?', gen() {
      const s = stelsel(), opts = [[s.x, s.y], [s.y, s.x], [s.x, -s.y || 1], [-s.x, s.y], [s.x + 1, s.y - 1]];
      const uniek = []; for (const o of opts) if (!uniek.some(u => u[0] === o[0] && u[1] === o[1])) uniek.push(o);
      const kz = schud(uniek.slice(0, 4)), j = kz.findIndex(o => o[0] === s.x && o[1] === s.y);
      return { soort: 'welk', opdracht: 'Welk koppel is de oplossing van het stelsel? Controleer in beide vergelijkingen.', tex: stelselTex(s.v1, s.v2),
        antw: keuze(kTex(kz.map(o => `(${tg(o[0])}, ${tg(o[1])})`)), j), uitleg: [ctrl(s.v1, Q(s.x), Q(s.y)), ctrl(s.v2, Q(s.x), Q(s.y)), VTex(s.x, s.y)] };
    } },
  },
  oefenMix: [['oplossing', 2], ['welk', 1]],
  test: [['oplossing', 6], ['welk', 4]], testSchudden: true,
};

// ---- 2. Grafisch oplossen -----------------------------------------------------------
// stelsel waarbij herleiden naar y gehele m en q geeft en de oplossing in het rooster ligt
function grafStelsel() {
  for (;;) {
    const x0 = rnd(-5, 5), y0 = rnd(-5, 5);
    const ms = schud([1, -1, 2, -2, 3, -3, 0.5, -0.5]).slice(0, 2); if (ms[0] === ms[1]) continue;
    const r = ms.map(m => ({ m, q: y0 - m * x0 }));
    if (r.some(l => !Number.isInteger(l.q) || Math.abs(l.q) > 7)) continue;
    // vergelijking ax + by = c met y-coëfficiënt 1, −1, 2 of −2
    const v = r.map(l => { const b = Number.isInteger(l.m) ? kies([1, -1, 1, 2]) : kies([2, -2]); return { a: -l.m * b, b, c: l.q * b }; });
    if (v.some(e => !Number.isInteger(e.a))) continue;
    // tabel: twee x-waarden met y binnen het rooster
    const tab = r.map(l => { const xs = schud([-4, -3, -2, -1, 0, 1, 2, 3, 4]).filter(x => Number.isInteger(l.m * x + l.q) && Math.abs(l.m * x + l.q) <= 7).slice(0, 2).sort((a, b) => a - b); return xs; });
    if (tab.some(t => t.length < 2)) continue;
    return { x: x0, y: y0, r, v, tab };
  }
}
const rechteRL = (l) => lid([[Q(l.m * 2, 2), 'x'], [l.q, '']]);
const rechteTex = (l) => `y = ${rechteRL(l)}`;
const D2 = {
  nr: 2, titel: 'Grafisch oplossen', kort: 'Herleid naar y, maak een tabel, teken beide rechten en lees het snijpunt af.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div>
      <p>Elke eerstegraadsvergelijking stelt een <b>rechte</b> voor. Het <b>snijpunt</b> van beide rechten is de oplossing van het stelsel.</p>
      <ol><li>Herleid beide vergelijkingen naar $y$.</li><li>Bepaal voor elke rechte twee punten met een tabel en teken beide rechten in hetzelfde assenstelsel.</li>
      <li>Lees het snijpunt af: dat koppel $(x, y)$ is de oplossing.</li><li>Controleer door in te vullen in beide oorspronkelijke vergelijkingen.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$${stelselTex({ a: -1, b: 1, c: -3 }, { a: -2, b: 1, c: -8 })}$</p>
      <p>$-x + y = -3 \\iff y = -3 + x$ &nbsp; met tabel $x = 1: y = -2$ en $x = 2: y = -1$</p>
      <p>$-2x + y = -8 \\iff y = -8 + 2x$ &nbsp; met tabel $x = 2: y = -4$ en $x = 3: y = -2$</p>
      ${fgraf({ rechten: [{ a: 1, b: -3, kleur: '#1c4e8a' }, { a: 2, b: -8, kleur: '#e8772e' }], punten: [{ x: 5, y: 2, label: '(5, 2)' }], breed: 260 })}
      <p class="midden">Snijpunt $(5, 2)$, dus $V = \\{(5, 2)\\}$. Controle: $-5 + 2 = -3 \\;\\checkmark$ en $-10 + 2 = -8 \\;\\checkmark$</p></div>
    <div class="kader eig"><div class="kader-titel">Op de computer</div>
      <p>Kies in het rooster een rechte (de gekleurde knop), en klik de twee punten uit je tabel aan. De rechte wordt erdoor getrokken. Een fout punt? Klik erop om het weg te halen.</p></div>${STAPPEN_TYPEN}`,
  voorbeelden: [],
  soorten: {
    volledig: { naam: 'Volledig grafisch oplossen', gen() {
      const g = grafStelsel(), [l1, l2] = g.r;
      const tabel = (l, i) => g.tab[i].map(x => [`\\text{vgl. ${i + 1}: } x = ${tg(x)} \\Rightarrow y =`, getal(l.m * x + l.q)]);
      return { soort: 'volledig', opdracht: 'Los grafisch op. Vul elke stap in.', tex: stelselTex(g.v[0], g.v[1]),
        antw: delen(['\\text{1. vgl. 1: } y =', uitdr(`${l1.m}*x+${l1.q}`, rechteRL(l1))], ['\\text{1. vgl. 2: } y =', uitdr(`${l2.m}*x+${l2.q}`, rechteRL(l2))],
          ...tabel(l1, 0), ...tabel(l2, 1),
          ['\\text{3. teken beide rechten}', { soort: 'teken', rechten: [{ a: l1.m, b: l1.q, tex: '\\text{rechte 1}' }, { a: l2.m, b: l2.q, tex: '\\text{rechte 2}' }] }],
          ['\\text{4. snijpunt: } x =', getal(g.x)], ['y =', getal(g.y)]),
        uitleg: [`${vglTex(g.v[0])} \\iff ${rechteTex(l1)}`, `${vglTex(g.v[1])} \\iff ${rechteTex(l2)}`, `\\text{snijpunt } (${tg(g.x)}, ${tg(g.y)})`, VTex(g.x, g.y)] };
    } },
    herleid: { naam: 'Herleiden naar y', gen() {
      const g = grafStelsel(), i = rnd(0, 1), l = g.r[i], v = g.v[i];
      return { soort: 'herleid', opdracht: 'Herleid de vergelijking naar y.', tex: vglTex(v), antw: uitdr(`${l.m}*x+${l.q}`, rechteRL(l), 'y ='),
        uitleg: [`${lid([[v.b, 'y']])} = ${lid([[-v.a, 'x'], [v.c, '']])}`, rechteTex(l)] };
    } },
    teken: { naam: 'Tekenen en snijpunt aflezen', gen() {
      const g = grafStelsel(), [l1, l2] = g.r;
      return { soort: 'teken', opdracht: 'Teken beide rechten en lees het snijpunt af.', tex: `\\left\\{\\begin{array}{l} ${rechteTex(l1)} \\\\ ${rechteTex(l2)} \\end{array}\\right.`,
        antw: delen(['', { soort: 'teken', rechten: [{ a: l1.m, b: l1.q, tex: rechteTex(l1) }, { a: l2.m, b: l2.q, tex: rechteTex(l2) }] }], ['x =', getal(g.x)], ['y =', getal(g.y)]),
        uitleg: [`\\text{snijpunt } (${tg(g.x)}, ${tg(g.y)})`, VTex(g.x, g.y)] };
    } },
    aflezen: { naam: 'Snijpunt aflezen', gen() {
      const g = grafStelsel(), [l1, l2] = g.r;
      return { soort: 'aflezen', opdracht: 'Lees de oplossing van het stelsel af op de grafiek.', tex: stelselTex(g.v[0], g.v[1]),
        html: fgraf({ rechten: [{ a: l1.m, b: l1.q, kleur: '#1c4e8a' }, { a: l2.m, b: l2.q, kleur: '#e8772e' }], x: [-8, 8], y: [-8, 8] }), sleutel: JSON.stringify(g.v), rapport: VTex(g.x, g.y),
        antw: delen(['x =', getal(g.x)], ['y =', getal(g.y)]), uitleg: [`\\text{snijpunt } (${tg(g.x)}, ${tg(g.y)})`, ctrl(g.v[0], Q(g.x), Q(g.y)), ctrl(g.v[1], Q(g.x), Q(g.y))] };
    } },
  },
  oefenMix: [['volledig', 2], ['herleid', 1], ['teken', 1], ['aflezen', 1]],
  test: [['volledig', 3], ['herleid', 2], ['teken', 2], ['aflezen', 3]], testSchudden: true,
};

// ---- 3. Gelijkstelling --------------------------------------------------------------
const D3 = {
  nr: 3, titel: 'Oplossen door gelijkstelling', kort: 'Beide vergelijkingen naar y, gelijkstellen, x berekenen, y berekenen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Door gelijkstelling</div>
      <ol><li>Vorm beide vergelijkingen om naar $y$.</li><li>Stel beide uitdrukkingen voor $y$ aan elkaar gelijk.</li>
      <li>Werk de gelijkstelling uit (kruislings vermenigvuldigen of beide leden met de noemers vermenigvuldigen) en bereken $x$.</li>
      <li>Vul $x$ in om $y$ te berekenen. Doe dit in beide vergelijkingen als controle.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$${stelselTex({ a: 3, b: 4, c: 54 }, { a: 1, b: 5, c: 40 })}$</p>
      <p>$3x + 4y = 54 \\iff y = \\frac{54 - 3x}{4}$ &nbsp; en &nbsp; $x + 5y = 40 \\iff y = \\frac{40 - x}{5}$</p>
      <p>$\\frac{54 - 3x}{4} = \\frac{40 - x}{5} \\iff 5(54 - 3x) = 4(40 - x) \\iff 270 - 15x = 160 - 4x \\iff -11x = -110 \\iff x = 10$</p>
      <p>$y = \\frac{54 - 30}{4} = 6$ &nbsp; en controle $y = \\frac{40 - 10}{5} = 6$ &nbsp; $\\Rightarrow V = \\{(10, 6)\\}$</p></div>${STAPPEN_TYPEN}`,
  voorbeelden: [
    { tex: stelselTex({ a: 2, b: 1, c: 11 }, { a: 1, b: -1, c: 1 }), stappen: ['y = 11 - 2x \\quad \\text{en} \\quad y = x - 1', '11 - 2x = x - 1', '-3x = -12 \\iff x = 4', 'y = 4 - 1 = 3', 'V = \\{(4, 3)\\}'] },
    { tex: stelselTex(`\\frac{1}{2}x + y = 5`, 'x - y = 1'), stappen: ['y = 5 - \\frac{1}{2}x \\quad \\text{en} \\quad y = x - 1', '5 - \\frac{1}{2}x = x - 1 \\quad (\\text{beide leden} \\cdot 2)', '10 - x = 2x - 2 \\iff 12 = 3x \\iff x = 4', 'y = 4 - 1 = 3', 'V = \\{(4, 3)\\}'] },
  ],
  soorten: {
    volledig: { naam: 'Gelijkstelling: alle stappen', gen() {
      const s = stelselQ(0.25), y1 = naarY(s.v1), y2 = naarY(s.v2);
      return { soort: 'volledig', opdracht: 'Los op door gelijkstelling. Vul elke stap in.', tex: stelselTex(s.v1, s.v2),
        antw: delen(['\\text{1. vgl. 1: } y =', uitdr(y1.expr, y1.tex)], ['\\text{1. vgl. 2: } y =', uitdr(y2.expr, y2.tex)], ...xyAntw(s).map(([l, a], i) => [i === 0 ? '\\text{2–3. } x =' : '\\text{4. } y =', a])),
        uitleg: [`y = ${y1.tex} \\quad \\text{en} \\quad y = ${y2.tex}`, `${y1.tex} = ${y2.tex}`, `x = ${qTex(qOf(s, 'x'))}`, `y = ${qTex(qOf(s, 'y'))}`, VTex(qOf(s, 'x'), qOf(s, 'y'))] };
    } },
    breuken: { naam: 'Gelijkstelling met breuken', gen() {
      for (;;) {
        const x0 = 2 * rnd(-4, 4) || 4, y0 = rnd(-5, 5), n = kies([2, 3, 4]), t = nz(-3, 3);
        const a1 = Q(t, n); if (a1.n === 1) continue;
        const c1 = Q(a1.t * x0, a1.n).v + y0; if (!Number.isInteger(c1) || x0 % a1.n) continue;
        const v2 = { a: kies([1, -1, 2]), b: kies([1, -1]) }; v2.c = v2.a * x0 + v2.b * y0;
        const e1 = `${lid([[a1, 'x'], [1, 'y']])} = ${tg(c1)}`;
        const y2 = naarY(v2);
        return { soort: 'breuken', opdracht: 'Los op door gelijkstelling. Vul elke stap in.', tex: stelselTex(e1, vglTex(v2)),
          antw: delen(['\\text{1. vgl. 1: } y =', uitdr(`${c1}-(${a1.t}/${a1.n})*x`, lid([[c1, ''], [Q(-a1.t, a1.n), 'x']]))], ['\\text{1. vgl. 2: } y =', uitdr(y2.expr, y2.tex)], ['\\text{2–3. } x =', getal(x0)], ['\\text{4. } y =', getal(y0)]),
          uitleg: [`y = ${lid([[c1, ''], [Q(-a1.t, a1.n), 'x']])} \\quad \\text{en} \\quad y = ${y2.tex}`, `\\text{gelijkstellen, beide leden} \\cdot ${a1.n}`, `x = ${tg(x0)}, \\; y = ${tg(y0)}`, VTex(x0, y0)] };
      }
    } },
  },
  oefenMix: [['volledig', 2], ['breuken', 1]],
  test: [['volledig', 7], ['breuken', 3]], testSchudden: true,
};

// ---- 4. Substitutie -----------------------------------------------------------------
const D4 = {
  nr: 4, titel: 'Oplossen door substitutie', kort: 'Eén vergelijking naar x (of y), invullen in de andere.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Door substitutie</div>
      <ol><li>Vorm één van de vergelijkingen om naar $x$ (of $y$), naar vrije keuze. Kies de onbekende met coëfficiënt $1$ of $-1$: dat rekent het makkelijkst.</li>
      <li>Vervang $x$ in de <b>andere</b> vergelijking door deze uitdrukking (substitueer) en bereken $y$.</li>
      <li>Vul $y$ in in de omgevormde vergelijking om $x$ te vinden.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$${stelselTex({ a: 1, b: -3, c: 5 }, { a: 2, b: 5, c: -1 })}$</p>
      <p>$x - 3y = 5 \\iff x = 5 + 3y$</p>
      <p>$2(5 + 3y) + 5y = -1 \\iff 10 + 6y + 5y = -1 \\iff 11y = -11 \\iff y = -1$</p>
      <p>$x = 5 + 3 \\cdot (-1) = 2$ &nbsp; $\\Rightarrow V = \\{(2, -1)\\}$</p></div>${STAPPEN_TYPEN}`,
  voorbeelden: [
    { tex: stelselTex('y = 2x - 1', '3x + 2y = 19'), stappen: ['\\text{vgl. 1 staat al naar } y', '3x + 2(2x - 1) = 19 \\iff 7x - 2 = 19 \\iff x = 3', 'y = 2 \\cdot 3 - 1 = 5', 'V = \\{(3, 5)\\}'] },
  ],
  soorten: {
    volledig: { naam: 'Substitutie: alle stappen', gen() {
      const s = stelsel({ een: true }), naarXv = Math.abs(s.v1.a) === 1 ? 1 : Math.abs(s.v2.a) === 1 ? 2 : 0;
      if (!naarXv) { // y afzonderen uit de vergelijking met b = ±1
        const i = Math.abs(s.v1.b) === 1 ? 1 : Math.abs(s.v2.b) === 1 ? 2 : 0; if (!i) return this.gen();
        const v = i === 1 ? s.v1 : s.v2, y = naarY(v);
        return { soort: 'volledig', opdracht: `Los op door substitutie. Zonder y af uit vergelijking ${i}.`, tex: stelselTex(s.v1, s.v2),
          antw: delen([`\\text{1. uit vgl. ${i}: } y =`, uitdr(y.expr, y.tex)], ['\\text{2. } x =', getal(s.x)], ['\\text{3. } y =', getal(s.y)]),
          uitleg: [`y = ${y.tex}`, `\\text{invullen in vgl. ${3 - i}} \\Rightarrow x = ${tg(s.x)}`, `y = ${tg(s.y)}`, VTex(s.x, s.y)] };
      }
      const v = naarXv === 1 ? s.v1 : s.v2, x = naarX(v);
      return { soort: 'volledig', opdracht: `Los op door substitutie. Zonder x af uit vergelijking ${naarXv}.`, tex: stelselTex(s.v1, s.v2),
        antw: delen([`\\text{1. uit vgl. ${naarXv}: } x =`, uitdr(x.expr, x.tex)], ['\\text{2. } y =', getal(s.y)], ['\\text{3. } x =', getal(s.x)]),
        uitleg: [`x = ${x.tex}`, `\\text{invullen in vgl. ${3 - naarXv}} \\Rightarrow y = ${tg(s.y)}`, `x = ${tg(s.x)}`, VTex(s.x, s.y)] };
    } },
    staatAl: { naam: 'Eén vergelijking staat al naar y', gen() {
      for (;;) {
        const x0 = nz(-5, 5), y0 = rnd(-6, 6), m = nz(-4, 4), q = y0 - m * x0; if (Math.abs(q) > 12) continue;
        const v2 = { a: nz(-5, 5), b: nz(-4, 4) }; if (v2.a + v2.b * m === 0) continue; v2.c = v2.a * x0 + v2.b * y0;
        const e1 = `y = ${lid([[m, 'x'], [q, '']])}`;
        return { soort: 'staatAl', opdracht: 'Los op door substitutie.', tex: stelselTex(e1, vglTex(v2)), antw: delen(['x =', getal(x0)], ['y =', getal(y0)]),
          uitleg: [`${lid([[v2.a, 'x']])} ${v2.b < 0 ? '-' : '+'} ${Math.abs(v2.b)}(${lid([[m, 'x'], [q, '']])}) = ${tg(v2.c)}`, `x = ${tg(x0)}`, `y = ${tg(m)} \\cdot ${h(x0)} ${q < 0 ? '-' : '+'} ${Math.abs(q)} = ${tg(y0)}`, VTex(x0, y0)] };
      }
    } },
  },
  oefenMix: [['volledig', 2], ['staatAl', 1]],
  test: [['volledig', 7], ['staatAl', 3]], testSchudden: true,
};

// ---- 5. Combinatie ------------------------------------------------------------------
const D5 = {
  nr: 5, titel: 'Oplossen door combinatie', kort: 'Maak de x-termen tegengesteld en tel op.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Door combinatie</div>
      <ol><li>Zorg dat beide vergelijkingen in de standaardvorm $ux + vy = w$ staan, netjes onder elkaar.</li>
      <li>Vermenigvuldig één of beide vergelijkingen zodat de coëfficiënten van $x$ (of $y$) <b>tegengesteld</b> worden, en tel de vergelijkingen op: die onbekende valt weg.</li>
      <li>Bereken de andere onbekende. Werk analoog de andere onbekende weg, of vul in.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$${stelselTex({ a: 3, b: 4, c: 54 }, { a: 1, b: 5, c: 40 })}$</p>
      <p>Om de $x$-termen weg te werken, vermenigvuldig je de tweede vergelijking met $-3$ (de eerste met $1$):</p>
      <p class="midden">$${stelselTex({ a: 3, b: 4, c: 54 }, { a: -3, b: -15, c: -120 })}$ &nbsp; opgeteld: $-11y = -66 \\iff y = 6$</p>
      <p>Analoog voor $x$ (eerste $\\cdot 5$, tweede $\\cdot (-4)$): $11x = 110 \\iff x = 10$ &nbsp; $\\Rightarrow V = \\{(10, 6)\\}$</p></div>
    <div class="kader eig"><div class="kader-titel">Welke getallen kies je?</div>
      <p>Er zijn meerdere goede keuzes. Bij $3x$ en $x$: vgl. 1 $\\cdot 1$ en vgl. 2 $\\cdot (-3)$, maar ook vgl. 1 $\\cdot (-1)$ en vgl. 2 $\\cdot 3$. Bij $4x$ en $6x$: $\\cdot 3$ en $\\cdot (-2)$. Zijn de termen al tegengesteld? Dan vermenigvuldig je beide met $1$.</p></div>${STAPPEN_TYPEN}`,
  voorbeelden: [
    { tex: stelselTex({ a: 5, b: -3, c: 11 }, { a: 2, b: 3, c: 17 }), stappen: ['\\text{de } y\\text{-termen zijn al tegengesteld: tel op}', '7x = 28 \\iff x = 4', '2 \\cdot 4 + 3y = 17 \\iff y = 3', 'V = \\{(4, 3)\\}'] },
  ],
  soorten: {
    volledig: { naam: 'Combinatie: alle stappen', gen() {
      const s = stelselQ(0.25), wegX = kies([true, false]), L = wegX ? 'x' : 'y';
      const c1 = wegX ? s.v1.a : s.v1.b, c2 = wegX ? s.v2.a : s.v2.b;
      const g = ggd(c1, c2), p = c2 / g, q = -c1 / g;
      const rest = wegX ? qOf(s, 'y') : qOf(s, 'x'), ander = wegX ? qOf(s, 'x') : qOf(s, 'y'), A = wegX ? 'y' : 'x';
      return { soort: 'volledig', opdracht: `Los op door combinatie. Werk eerst de ${L}-termen weg.`, tex: stelselTex(s.v1, s.v2),
        antw: delen([`\\text{1. zodat de } ${L}\\text{-termen wegvallen:}`, { soort: 'combi', c1, c2, letter: L }], [`\\text{2. } ${A} =`, getal(rest)], [`\\text{3. } ${L} =`, getal(ander)]),
        uitleg: [`\\text{bv. vgl. 1} \\cdot ${h(p)} \\text{ en vgl. 2} \\cdot ${h(q)}: \\; ${tg(c1 * p)}${L} \\text{ en } ${tg(c2 * q)}${L} \\text{ vallen weg}`, `${A} = ${qTex(rest)}`, `${L} = ${qTex(ander)}`, VTex(qOf(s, 'x'), qOf(s, 'y'))] };
    } },
    tegengesteld: { naam: 'Termen al tegengesteld', gen() {
      for (;;) {
        const x0 = nz(-6, 6), y0 = rnd(-6, 6), b = nz(-5, 5), a1 = nz(-5, 5), a2 = nz(-5, 5); if (a1 + a2 === 0) continue;
        const v1 = { a: a1, b, c: a1 * x0 + b * y0 }, v2 = { a: a2, b: -b, c: a2 * x0 - b * y0 };
        return { soort: 'tegengesteld', opdracht: 'Los op door combinatie.', tex: stelselTex(v1, v2), antw: delen(['x =', getal(x0)], ['y =', getal(y0)]),
          uitleg: ['\\text{de } y\\text{-termen zijn tegengesteld: tel op}', `${tg(a1 + a2)}x = ${tg(v1.c + v2.c)} \\iff x = ${tg(x0)}`, `y = ${tg(y0)}`, VTex(x0, y0)] };
      }
    } },
  },
  oefenMix: [['volledig', 2], ['tegengesteld', 1]],
  test: [['volledig', 7], ['tegengesteld', 3]], testSchudden: true,
};

// ---- 6. Vals en onbepaald stelsel ------------------------------------------------------
function bijzonder() {
  const soort = kies(['bepaald', 'vals', 'onbepaald']);
  if (soort === 'bepaald') { const s = stelsel(); return { soort, v1: s.v1, v2: s.v2, x: s.x, y: s.y }; }
  const v1 = { a: nz(-4, 4), b: nz(-4, 4), c: rnd(-9, 9) }, k = kies([2, 3, -1, -2, 5, 10]);
  const v2 = { a: v1.a * k, b: v1.b * k, c: soort === 'onbepaald' ? v1.c * k : v1.c * k + nz(-6, 6) };
  return { soort, v1, v2, k };
}
const VOnbepaald = (v) => `V = \\{(x,\\, ${naarY(v).tex}) \\mid x \\in \\mathbb{R}\\}`;
const D6 = {
  nr: 6, titel: 'Vals en onbepaald stelsel', kort: 'Eén oplossing, geen oplossing of oneindig veel?', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Aantal oplossingen</div>
      <table class="tabel"><tr><th>aantal oplossingen</th><th>naam</th><th>notatie</th><th>grafisch</th></tr>
      <tr><td>juist 1</td><td><b>bepaald</b> stelsel</td><td>$V = \\{(x, y)\\}$</td><td>de rechten snijden elkaar</td></tr>
      <tr><td>geen</td><td><b>vals</b> stelsel</td><td>$V = \\varnothing$</td><td>evenwijdige (verschillende) rechten</td></tr>
      <tr><td>oneindig veel</td><td><b>onbepaald</b> stelsel</td><td>$V = \\{(x, ax + b) \\mid x \\in \\mathbb{R}\\}$</td><td>de rechten vallen samen</td></tr></table></div>
    <div class="kader werk"><div class="kader-titel">Herkennen</div>
      <p>$${stelselTex({ a: 1, b: 1, c: 7 }, { a: 10, b: 10, c: -20 })}$ &nbsp; eerste $\\cdot (-10)$ en optellen: $0x = -90$: onmogelijk → <b>vals</b>, $V = \\varnothing$.</p>
      <p>$${stelselTex({ a: 1, b: 1, c: 7 }, { a: 10, b: 10, c: 70 })}$ &nbsp; zo krijg je $0x = 0$: klopt altijd → <b>onbepaald</b>, $V = \\{(x, 7 - x) \\mid x \\in \\mathbb{R}\\}$.</p>
      <p class="klein">Tip: is het linkerlid van de tweede vergelijking een veelvoud van het eerste? Dan is het stelsel vals (rechterlid geen veelvoud) of onbepaald (rechterlid ook een veelvoud).</p></div>`,
  voorbeelden: [
    { tex: stelselTex({ a: 2, b: 4, c: 10 }, { a: 1, b: 2, c: 5 }), stappen: ['\\text{vgl. 1 = vgl. 2} \\cdot 2 \\text{ (ook het rechterlid)}', '\\text{onbepaald: } V = \\{(x,\\, \\frac{5 - x}{2}) \\mid x \\in \\mathbb{R}\\}'] },
  ],
  soorten: {
    soort: { naam: 'Bepaald, vals of onbepaald?', gen() {
      const b = bijzonder();
      return { soort: 'soort', opdracht: 'Is het stelsel bepaald, vals of onbepaald?', tex: stelselTex(b.v1, b.v2), antw: keuze(kT(['bepaald', 'vals', 'onbepaald']), ['bepaald', 'vals', 'onbepaald'].indexOf(b.soort)),
        uitleg: [b.soort === 'bepaald' ? '\\text{de linkerleden zijn geen veelvouden: de rechten snijden}' : `\\text{linkerlid vgl. 2 = linkerlid vgl. 1} \\cdot ${h(b.k)}`, b.soort === 'vals' ? '\\text{rechterlid niet: } 0x = \\text{getal} \\neq 0 \\Rightarrow V = \\varnothing' : b.soort === 'onbepaald' ? '\\text{rechterlid ook: } 0x = 0 \\Rightarrow \\text{oneindig veel oplossingen}' : VTex(b.x, b.y)] };
    } },
    notatie: { naam: 'De juiste oplossingsverzameling', gen() {
      const b = bijzonder(), Vb = b.soort === 'bepaald' ? VTex(b.x, b.y) : b.soort === 'vals' ? 'V = \\varnothing' : VOnbepaald(b.v1);
      const s2 = stelsel(), opties = [Vb, 'V = \\varnothing', VOnbepaald(b.v1), b.soort === 'bepaald' ? VTex(b.y, b.x) : VTex(s2.x, s2.y)];
      const u = [...new Set(opties)], kz = schud(u);
      return { soort: 'notatie', opdracht: 'Welke oplossingsverzameling hoort bij het stelsel?', tex: stelselTex(b.v1, b.v2), antw: keuze(kTex(kz), kz.indexOf(Vb)),
        uitleg: [`\\text{${b.soort} stelsel}`, Vb] };
    } },
  },
  oefenMix: [['soort', 2], ['notatie', 1]],
  test: [['soort', 6], ['notatie', 4]], testSchudden: true,
};

// ---- 7. Vraagstukken ---------------------------------------------------------------
const VRAAG = [
  () => { const x = rnd(15, 40), y = rnd(5, x - 3); return { tekst: `De som van twee getallen is ${x + y}. Het verschil van die twee getallen is ${x - y}. Bepaal beide getallen.`, ox: 'het grootste getal', oy: 'het kleinste getal', x, y,
    S: [`x + y = ${x + y}`, `x - y = ${x - y}`], F: [[`x + y = ${x - y}`, `x - y = ${x + y}`], [`x \\cdot y = ${x + y}`, `x - y = ${x - y}`]], zin: `De getallen zijn ${x} en ${y}.` }; },
  () => { const x = rnd(8, 15), y = rnd(4, 7), a1 = 2, b1 = 3, a2 = 1, b2 = 2; return { tekst: `Een gezin met ${a1} volwassenen en ${b1} kinderen betaalt ${a1 * x + b1 * y} euro voor de bioscoop. Een papa die met zijn ${b2} kinderen gaat, betaalt ${a2 * x + b2 * y} euro. Hoeveel kost een ticket voor een volwassene en hoeveel voor een kind?`, ox: 'prijs ticket volwassene (euro)', oy: 'prijs ticket kind (euro)', x, y,
    S: [`${a1}x + ${b1}y = ${a1 * x + b1 * y}`, `x + ${b2}y = ${a2 * x + b2 * y}`], F: [[`${b1}x + ${a1}y = ${a1 * x + b1 * y}`, `${b2}x + y = ${a2 * x + b2 * y}`], [`x + y = ${a1 * x + b1 * y}`, `x + y = ${a2 * x + b2 * y}`]], zin: `Een ticket voor een volwassene kost ${x} euro, voor een kind ${y} euro.` }; },
  () => { const x = rnd(10, 30), y = rnd(5, 20); return { tekst: `Op een boerderij lopen kippen en konijnen rond. Samen tel je ${x + y} koppen en ${2 * x + 4 * y} poten. Hoeveel kippen en hoeveel konijnen zijn er?`, ox: 'aantal kippen', oy: 'aantal konijnen', x, y,
    S: [`x + y = ${x + y}`, `2x + 4y = ${2 * x + 4 * y}`], F: [[`x + y = ${x + y}`, `4x + 2y = ${2 * x + 4 * y}`], [`2x + 4y = ${x + y}`, `x + y = ${2 * x + 4 * y}`]], zin: `Er zijn ${x} kippen en ${y} konijnen.` }; },
  () => { const x = rnd(4, 15), y = rnd(4, 15); return { tekst: `In je spaarpot zitten ${x + y} muntstukken: alleen stukken van 1 euro en stukken van 2 euro. Samen is dat ${x + 2 * y} euro. Hoeveel muntstukken van elke soort zitten er in de spaarpot?`, ox: 'aantal stukken van 1 euro', oy: 'aantal stukken van 2 euro', x, y,
    S: [`x + y = ${x + y}`, `x + 2y = ${x + 2 * y}`], F: [[`x + y = ${x + y}`, `2x + y = ${x + 2 * y}`], [`x + 2y = ${x + y}`, `x + y = ${x + 2 * y}`]], zin: `Er zitten ${x} stukken van 1 euro en ${y} stukken van 2 euro in.` }; },
  () => { const y = rnd(4, 12), d = rnd(2, 8), x = y + d; return { tekst: `Een rechthoek heeft een omtrek van ${2 * x + 2 * y} cm. De lengte is ${d} cm groter dan de breedte. Bereken de lengte en de breedte.`, ox: 'lengte (cm)', oy: 'breedte (cm)', x, y,
    S: [`2x + 2y = ${2 * x + 2 * y}`, `x = y + ${d}`], F: [[`x + y = ${2 * x + 2 * y}`, `x = y + ${d}`], [`2x + 2y = ${2 * x + 2 * y}`, `y = x + ${d}`]], zin: `De lengte is ${x} cm en de breedte is ${y} cm.` }; },
  () => { const z = rnd(6, 14), n = z; /* x = 3y en x + n = 2(y + n) geeft y = n */ return { tekst: `Een vader is nu drie keer zo oud als zijn zoon. Over ${n} jaar is hij nog maar twee keer zo oud als zijn zoon. Hoe oud zijn vader en zoon nu?`, ox: 'leeftijd vader', oy: 'leeftijd zoon', x: 3 * z, y: z,
    S: ['x = 3y', `x + ${n} = 2(y + ${n})`], F: [['y = 3x', `x + ${n} = 2(y + ${n})`], ['x = 3y', `x + ${n} = 2y + ${n}`]], zin: `De vader is ${3 * z} jaar, de zoon ${z} jaar.` }; },
  () => { const x = kies([1, 1.5, 2, 0.5, 2.5]), y = kies([2, 1.5, 2.5, 3, 1]), a = [4, 3, 2, 5]; return { tekst: `Lotte koopt ${a[0]} pennen en ${a[1]} schriften en betaalt ${String(a[0] * x + a[1] * y).replace('.', ',')} euro. Bram koopt ${a[2]} pennen en ${a[3]} schriften en betaalt ${String(a[2] * x + a[3] * y).replace('.', ',')} euro. Wat kost één pen en wat kost één schrift?`, ox: 'prijs van een pen (euro)', oy: 'prijs van een schrift (euro)', x, y,
    S: [`${a[0]}x + ${a[1]}y = ${tg(a[0] * x + a[1] * y)}`, `${a[2]}x + ${a[3]}y = ${tg(a[2] * x + a[3] * y)}`], F: [[`${a[1]}x + ${a[0]}y = ${tg(a[0] * x + a[1] * y)}`, `${a[3]}x + ${a[2]}y = ${tg(a[2] * x + a[3] * y)}`], [`${a[0]}x + ${a[2]}y = ${tg(a[0] * x + a[1] * y)}`, `${a[1]}x + ${a[3]}y = ${tg(a[2] * x + a[3] * y)}`]], zin: `Een pen kost ${tg(x)} euro, een schrift ${tg(y)} euro.`.replace(/\./g, ',').replace(/,$/, '.') }; },
  () => { const n = 20, x = rnd(10, 19), y = n - x, p = 3 * x - y; return { tekst: `Een quiz telt ${n} vragen. Elk juist antwoord levert 3 punten op, elk fout antwoord kost 1 punt. Sarah beantwoordt alle vragen en haalt ${p} punten. Hoeveel vragen had ze juist en hoeveel fout?`, ox: 'aantal juiste antwoorden', oy: 'aantal foute antwoorden', x, y,
    S: [`x + y = ${n}`, `3x - y = ${p}`], F: [[`x + y = ${n}`, `3x + y = ${p}`], [`x - y = ${n}`, `3x - y = ${p}`]], zin: `Ze had ${x} vragen juist en ${y} fout.` }; },
  () => { const y = rnd(20, 70), x = 2 * y + kies([0, 30, 15, 60]) - 0; const s = x + y; return { tekst: `Twee hoeken zijn samen ${s}°. De ene hoek is ${x - 2 * y === 0 ? 'het dubbel van' : `${x - 2 * y}° groter dan het dubbel van`} de andere hoek. Bereken beide hoeken.`, ox: 'de grootste hoek (°)', oy: 'de kleinste hoek (°)', x, y,
    S: [`x + y = ${s}`, x - 2 * y ? `x = 2y + ${x - 2 * y}` : 'x = 2y'], F: [[`x + y = ${s}`, x - 2 * y ? `y = 2x + ${x - 2 * y}` : 'y = 2x'], [`x - y = ${s}`, x - 2 * y ? `x = 2y + ${x - 2 * y}` : 'x = 2y']], zin: `De hoeken zijn ${x}° en ${y}°.` }; },
];
const D7 = {
  nr: 7, titel: 'Vraagstukken met stelsels', kort: 'Onbekenden kiezen, stelsel opstellen, oplossen, controleren, antwoordzin.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div>
      <table class="tabel"><tr><th>stap</th><th>werkwijze</th></tr><tr><td>1</td><td>Lees het vraagstuk aandachtig. Definieer de onbekenden.</td></tr>
      <tr><td>2</td><td>Zet het vraagstuk om in 2 vergelijkingen.</td></tr><tr><td>3</td><td>Los het 2×2 stelsel op.</td></tr>
      <tr><td>4</td><td>Controleer de oplossing.</td></tr><tr><td>5</td><td>Formuleer een antwoordzin.</td></tr></table></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>Een rit met de achtbaan kost evenveel als een rit met de botsauto's plus 2 euro. 5 ritten achtbaan en 3 ritten botsauto's kosten samen 46 euro.</p>
      <p>Onbekenden: $x$ = prijs van 1 rit achtbaan, $y$ = prijs van 1 rit botsauto's (in euro).</p>
      <p class="midden">$${stelselTex('x = y + 2', '5x + 3y = 46')}$ &nbsp; substitutie: $5(y + 2) + 3y = 46 \\iff 8y = 36 \\iff y = 4{,}5$ en $x = 6{,}5$</p>
      <p>Controle: $5 \\cdot 6{,}5 + 3 \\cdot 4{,}5 = 46 \\;\\checkmark$ &nbsp; Antwoord: een rit achtbaan kost 6,5 euro, een rit botsauto's 4,5 euro.</p></div>`,
  voorbeelden: [],
  soorten: {
    vraagstuk: { naam: 'Vraagstukken', gen() {
      const V = kies(VRAAG)(), J = stelselTex(V.S[0], V.S[1]), opts = schud([J, ...V.F.map(f => stelselTex(f[0], f[1]))]);
      return { soort: 'vraagstuk', opdracht: 'Kies het juiste stelsel en los het op.', html: opgave(V.tekst) + `<p class="klein">Onbekenden: $x$ = ${V.ox}, $y$ = ${V.oy}.</p>`, sleutel: V.tekst, rapport: V.tekst,
        antw: delen(['\\text{stelsel:}', keuze(kTex(opts), opts.indexOf(J))], ['x =', getal(V.x)], ['y =', getal(V.y)]),
        uitleg: [J, `x = ${tg(V.x)}, \\; y = ${tg(V.y)}`, `\\text{${V.zin}}`] };
    } },
  },
  oefenMix: [['vraagstuk', 1]],
  test: [['vraagstuk', 10]], testSchudden: true,
};

const D8 = {
  nr: 8, titel: 'Eindtest stelsels', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles door elkaar: grafisch, gelijkstelling, substitutie, combinatie, bijzondere stelsels en vraagstukken. Herhaal gerust de theorie van een vorig deel.</p></div>${STAPPEN_TYPEN}`,
  voorbeelden: [],
  soorten: { op: mix(D1, 'oplossing'), gv: mix(D2, 'volledig'), ga: mix(D2, 'aflezen'), gl: mix(D3, 'volledig'), su: mix(D4, 'volledig'), co: mix(D5, 'volledig'), bs: mix(D6, 'soort'), vr: mix(D7, 'vraagstuk') },
  oefenMix: [['op', 1], ['gv', 1], ['ga', 1], ['gl', 1], ['su', 1], ['co', 1], ['bs', 1], ['vr', 1]],
  test: [['op', 1], ['gv', 1], ['ga', 1], ['gl', 2], ['su', 1], ['co', 2], ['bs', 1], ['vr', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'stelsels', titel: 'Stelsels van vergelijkingen', ondertitel: 'Wiskunde · 4BW-MWW', klas: '4BW-MWW', drempel: 70,
  intro: `<p>Je leert een 2×2 stelsel van vergelijkingen oplossen: grafisch (zelf tekenen in een rooster), door gelijkstelling, door substitutie en door combinatie.
    Je herkent valse en onbepaalde stelsels en lost eenvoudige vraagstukken op. Bij elke methode vul je de <b>tussenstappen</b> in: zo zie je meteen waar het fout loopt.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Wat is een stelsel?', delen: [1, 2] }, { titel: 'B · Algebraïsch oplossen', delen: [3, 4, 5, 6] }, { titel: 'C · Vraagstukken', delen: [7] }, { titel: 'D · Eindtest', delen: [8] }],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8],
});
