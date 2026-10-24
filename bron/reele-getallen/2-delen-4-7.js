// ===================================================================
//  DEEL 4 — Intervallen en halfrechten
// ===================================================================
function willekeurigInterval(opt = {}) {
  const { min = -5, max = 6, geheel = true } = opt;
  const soort = kies(['begrensd', 'begrensd', 'rechts', 'links']);
  const g = () => geheel || Math.random() < 0.8 ? rnd(min, max) : rnd(min * 2, max * 2) / 2;
  if (soort === 'begrensd') { let a, b; do { a = g(); b = g(); } while (b - a < 2); return { a, ai: Math.random() < 0.5, b, bi: Math.random() < 0.5 }; }
  const n = g();
  return soort === 'rechts' ? { a: n, ai: Math.random() < 0.5, b: null, bi: false } : { a: null, ai: false, b: n, bi: Math.random() < 0.5 };
}
const ivOpg = (r) => ({ soort: 'interval', a: r.a, ai: r.ai, b: r.b, bi: r.bi });
const ogOpg = (r) => ({ soort: 'ongelijkheid', a: r.a, ai: r.ai, b: r.b, bi: r.bi });
function ivUitleg(r) {
  const u = [];
  if (r.a !== null) u.push(`${tg(r.a)} ${r.ai ? '\\text{ hoort erbij: } [ \\text{ en } \\leq' : '\\text{ hoort er niet bij: } ] \\text{ en } <'}`);
  else u.push('\\text{links: } -\\infty \\text{, het haakje staat altijd naar buiten}');
  if (r.b !== null) u.push(`${tg(r.b)} ${r.bi ? '\\text{ hoort erbij: } ] \\text{ en } \\leq' : '\\text{ hoort er niet bij: } [ \\text{ en } <'}`);
  else u.push('\\text{rechts: } +\\infty \\text{, het haakje staat altijd naar buiten}');
  return u;
}
const behoort = (x, r) => (r.a === null || x > r.a || (r.ai && x === r.a)) && (r.b === null || x < r.b || (r.bi && x === r.b));

const DEEL4 = {
  nr: 4, titel: 'Intervallen en halfrechten', kort: 'Haakjes, ongelijkheden en de getallenas.',
  rekenmachine: false,
  opdracht: 'Schrijf als interval.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">Wat is een interval?</div>
      <p>Een <b>interval</b> stelt alle reële getallen voor tussen bepaalde grenzen.</p>
      <div class="twee">
        <div class="kader"><b>haakje <span class="rood">naar binnen</span> &nbsp; [ &nbsp; ]</b><br>het grensgetal <b>hoort erbij</b> ($\\leq$ of $\\geq$)<div class="figuur">${getallenas({ a: 0, ai: true, b: 3, bi: true }, -1, 4)}</div></div>
        <div class="kader"><b>haakje <span class="rood">naar buiten</span> &nbsp; ] &nbsp; [</b><br>het grensgetal hoort er <b>niet</b> bij ($<$ of $>$)<div class="figuur">${getallenas({ a: 0, ai: false, b: 3, bi: false }, -1, 4)}</div></div>
      </div>
      <p>Eén haakje naar binnen en één naar buiten kan ook, bijvoorbeeld $[-4\\,;\\,3[$. Tussen de twee grenzen schrijf je een <b>puntkomma</b>.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Begrensde intervallen</div>
      <table class="tabel"><tr><th>interval</th><th>ongelijkheid</th><th>getallenas</th></tr>
        ${[[true, true], [true, false], [false, true], [false, false]].map(([ai, bi]) => { const r = { a: -4, ai, b: 3, bi }; return `<tr><td>$${ivTex(r)}$</td><td>$${ogTex(r)}$</td><td>${getallenas(r, -5, 4, 26)}</td></tr>`; }).join('')}
      </table>
    </div>
    <div class="kader">
      <div class="kader-titel">Halfrechten</div>
      <p>Bij een halfrecht gaat het interval eindeloos door: tot $+\\infty$ of $-\\infty$ (oneindig). Oneindig bereik je nooit: <b class="rood">het haakje staat daar altijd naar buiten</b>.</p>
      <table class="tabel"><tr><th>interval</th><th>ongelijkheid</th><th>getallenas</th></tr>
        ${[{ a: 1, ai: true, b: null, bi: false }, { a: 1, ai: false, b: null, bi: false }, { a: null, ai: false, b: 1, bi: true }, { a: null, ai: false, b: 1, bi: false }].map(r => `<tr><td>$${ivTex(r)}$</td><td>$${ogTex(r)}$</td><td>${getallenas(r, -3, 4, 26)}</td></tr>`).join('')}
      </table>
      <p class="klein">$\\leq$ of $\\geq$ → haakje naar binnen. &nbsp; $<$ of $>$ → haakje naar buiten.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$[-4\\,;\\,3[$</td><td><code>[-4 ; 3[</code></td></tr>
        <tr><td>$]-\\infty\\,;\\,1]$</td><td><code>]-∞ ; 1]</code> &nbsp;(knop −∞)</td></tr>
        <tr><td>$-4 \\leq x < 3$</td><td><code>-4 ≤ x < 3</code> &nbsp;(knop ≤, of typ <code>&lt;=</code>)</td></tr>
        <tr><td>$x \\geq 2$</td><td><code>x ≥ 2</code> &nbsp;(of <code>x &gt;= 2</code>)</td></tr></table>
      <p class="klein">Kommagetallen typ je met een komma: <code>[2,5 ; 3[</code>. Daarom moet er tussen de grenzen een puntkomma staan.</p></div>`,
  voorbeelden: [
    { tex: '-2 < x \\leq 5', stappen: ['-2 \\text{ hoort er niet bij: haakje naar buiten } ]', '5 \\text{ hoort erbij: haakje naar binnen } ]', ']-2\\,;\\,5]'] },
    { tex: 'x \\geq -3', stappen: ['-3 \\text{ hoort erbij: } [', '\\text{naar rechts tot } +\\infty \\text{, haakje naar buiten}', '[-3\\,;\\,+\\infty['] },
    { tex: 'x < 0', stappen: ['\\text{naar links tot } -\\infty', ']-\\infty\\,;\\,0['] },
    { html: `Lees af: <div class="figuur">${getallenas({ a: -1, ai: true, b: 4, bi: false }, -3, 6)}</div>`, stappen: ['-1 \\text{: haakje naar binnen, } 4 \\text{: haakje naar buiten}', '[-1\\,;\\,4[', '-1 \\leq x < 4'] },
    { tex: '\\text{Hoort } 3 \\text{ bij } [-2\\,;\\,3[\\,?', stappen: ['\\text{het haakje bij 3 staat naar buiten: 3 hoort er niet bij}', '\\text{nee}'] },
  ],
  soorten: {
    naarongelijkheid: { naam: 'Interval → ongelijkheid', gen() {
      const r = willekeurigInterval({ min: -8, max: 9, geheel: false });
      return { soort: 'naarongelijkheid', opdracht: 'Schrijf als ongelijkheid.', tex: ivTex(r), antw: ogOpg(r), uitleg: [...ivUitleg(r), `${ivTex(r)} \\quad \\Leftrightarrow \\quad ${ogTex(r)}`] };
    } },
    naarinterval: { naam: 'Ongelijkheid → interval', gen() {
      const r = willekeurigInterval({ min: -8, max: 9, geheel: false });
      return { soort: 'naarinterval', opdracht: 'Schrijf als interval.', tex: ogTex(r), antw: ivOpg(r), uitleg: [...ivUitleg(r), `${ogTex(r)} \\quad \\Leftrightarrow \\quad ${ivTex(r)}`] };
    } },
    hoortbij: { naam: 'Hoort het getal bij het interval?', gen() {
      const r = willekeurigInterval({ min: -6, max: 8 });
      const grenzen = [r.a, r.b].filter(x => x !== null);
      let x; const k = Math.random();
      if (k < 0.5) x = kies(grenzen);
      else if (k < 0.7) x = kies(grenzen) + kies([-0.1, 0.1, -0.5, 0.5]);
      else x = rnd(-10, 12) + (Math.random() < 0.3 ? 0.5 : 0);
      x = Math.round(x * 10) / 10;
      const ja = behoort(x, r);
      let reden;
      if (r.a !== null && x === r.a) reden = `${tg(x)} \\text{ is de linkergrens; het haakje staat ${r.ai ? 'naar binnen: het hoort erbij' : 'naar buiten: het hoort er niet bij'}}`;
      else if (r.b !== null && x === r.b) reden = `${tg(x)} \\text{ is de rechtergrens; het haakje staat ${r.bi ? 'naar binnen: het hoort erbij' : 'naar buiten: het hoort er niet bij'}}`;
      else reden = `${ogTex(r).replace(/x/, tg(x))} \\text{ ${ja ? 'klopt' : 'klopt niet'}}`;
      return { soort: 'hoortbij', opdracht: 'Hoort het getal bij het interval?', tex: `${tg(x)} \\;\\in\\; ${ivTex(r)} \\;?`, antw: keuze(JANEE, ja ? 'ja' : 'nee'), uitleg: [reden] };
    } },
    leesaf: { naam: 'Lees af op de getallenas', gen() {
      const r = willekeurigInterval({ min: -4, max: 5 });
      return { soort: 'leesaf', opdracht: 'Lees af. Schrijf als interval en als ongelijkheid.', html: `<div class="figuur">${getallenas(r, -5, 6)}</div>`, sleutel: 'as' + ivTex(r), rapport: 'getallenas: ' + ivTekst(r),
        antw: { soort: 'delen', delen: [{ label: '\\text{interval}', antw: ivOpg(r) }, { label: '\\text{ongelijkheid}', antw: ogOpg(r) }] }, uitleg: ivUitleg(r) };
    } },
    tekenen: { naam: 'Welke getallenas hoort erbij?', gen() {
      const r = willekeurigInterval({ min: -4, max: 5 });
      let varianten;
      if (r.a !== null && r.b !== null) varianten = [[true, true], [true, false], [false, true], [false, false]].map(([ai, bi]) => ({ ...r, ai, bi }));
      else if (r.b === null) varianten = [{ ...r, ai: true }, { ...r, ai: false }, { a: null, ai: false, b: r.a, bi: true }, { a: null, ai: false, b: r.a, bi: false }];
      else varianten = [{ ...r, bi: true }, { ...r, bi: false }, { a: r.b, ai: true, b: null, bi: false }, { a: r.b, ai: false, b: null, bi: false }];
      const opties = schud(varianten).map((v, i) => ({ k: 'abcd'[i], l: getallenas(v, -5, 6, 26), html: true, tekst: ivTekst(v), _v: v }));
      const juist = opties.find(o => Invoer.gelijkeGrenzen(o._v, r)).k;
      opties.forEach(o => delete o._v);
      return { soort: 'tekenen', opdracht: 'Welke getallenas stelt dit interval voor?', tex: ivTex(r), antw: keuze(opties, juist), uitleg: ivUitleg(r) };
    } },
  },
  oefenMix: [['naarongelijkheid', 2], ['naarinterval', 2], ['hoortbij', 2], ['leesaf', 2], ['tekenen', 2]],
  test: [['naarongelijkheid', 2], ['naarinterval', 2], ['hoortbij', 2], ['tekenen', 2], ['leesaf', 2]],
};

// ===================================================================
//  DEEL 5 — Machten met rationale exponenten
// ===================================================================
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const wortelE = (n, x) => (n === 2 ? '√' : n === 3 ? '∛' : n === 4 ? '∜' : String(n).split('').map(c => SUPS[+c]).join('') + '√') + `(${x})`;
const wortelT = (n, x) => n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`;
const fr = (p, q) => `\\frac{${p}}{${q}}`;
const machtT = (a, p, q) => q === 1 ? `${a}^{${p}}` : `${a}^{${fr(p, q)}}`;
function red(p, q) { const g = ggd(p, q); return [p / g, q / g]; }
const BASIS = [2, 3, 5, 6, 7, 10, 11];

const DEEL5 = {
  nr: 5, titel: 'Machten met rationale exponenten', kort: 'Van macht naar wortelvorm en terug, rekenregels.',
  rekenmachine: true,
  opdracht: 'Schrijf in wortelvorm.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">De definitie</div>
      <p class="midden" style="font-size:20px">$x^{\\frac{m}{n}} = \\sqrt[n]{x^m}$</p>
      <ul><li>de <b>noemer $n$</b> wordt de wortelexponent</li><li>de <b>teller $m$</b> wordt de exponent onder het wortelteken</li>
        <li>bij $n = 2$ schrijf je de 2 niet: een gewone vierkantswortel, $x^{\\frac{3}{2}} = \\sqrt{x^3}$</li></ul>
      <p>Andersom: van wortelvorm naar machtsvorm: $\\sqrt[3]{7^2} = 7^{\\frac{2}{3}}$</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Voorbeeld</div>
      <p>$5^{\\frac{3}{2}} = \\sqrt{5^3} = \\sqrt{125} \\approx 11{,}1803$</p>
      <ol><li>noemer 2 → vierkantswortel, teller 3 → exponent 3</li><li>reken de macht uit: $5^3 = 125$</li><li>rekenmachine, rond af op 4 decimalen</li></ol>
      <p class="klein">Op de rekenmachine kan je ook rechtstreeks <code>5 ^ ( 3 ÷ 2 )</code> intikken.</p>
      <p>$16^{\\frac{7}{3}} = \\sqrt[3]{16^7} \\approx 645{,}0796$ &nbsp;·&nbsp; $3^{\\frac{2}{5}} = \\sqrt[5]{3^2} \\approx 1{,}5518$</p>
      <p>$23^{\\frac{4}{6}} = 23^{\\frac{2}{3}} = \\sqrt[3]{23^2} \\approx 8{,}0876$ &nbsp;·&nbsp; $9 \\cdot 3^{\\frac{2}{7}} = 9 \\cdot \\sqrt[7]{3^2} \\approx 12{,}3186$</p>
      <p class="blauwtekst">Tip: vereenvoudig eerst de breuk in de exponent: $\\frac{4}{6} = \\frac{2}{3}$.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Rekenregels met machten</div>
      <p>De rekenregels die je kent uit $\\mathbb{Z}$ en $\\mathbb{Q}$ gelden ook voor <b>rationale exponenten</b>.</p>
      <table class="tabel"><tr><td>$a^m \\cdot a^n = a^{m+n}$</td><td class="klein">zelfde grondtal vermenigvuldigen → exponenten optellen</td></tr>
        <tr><td>$a^m : a^n = a^{m-n}$</td><td class="klein">zelfde grondtal delen → exponenten aftrekken</td></tr>
        <tr><td>$(a^m)^n = a^{m \\cdot n}$</td><td class="klein">macht van een macht → exponenten vermenigvuldigen</td></tr></table>
      <p>$5^{\\frac{3}{2}} \\cdot 5^{\\frac{1}{2}} = 5^{\\frac{3}{2} + \\frac{1}{2}} = 5^{\\frac{4}{2}} = 5^2 = 25$</p>
      <p>$5^{\\frac{3}{2}} : 5^{\\frac{1}{2}} = 5^{\\frac{3}{2} - \\frac{1}{2}} = 5^{\\frac{2}{2}} = 5^1 = 5$</p>
      <p>$\\left(5^{\\frac{3}{2}}\\right)^2 = 5^{\\frac{3}{2} \\cdot 2} = 5^3 = 125$</p>
      <p>$5^{\\frac{3}{6}} \\cdot 5^{\\frac{8}{2}} = 5^{\\frac{3}{6} + \\frac{24}{6}} = 5^{\\frac{27}{6}} = 5^{\\frac{9}{2}} \\approx 1397{,}5425$</p>
      <p>$\\left(5^{\\frac{8}{2}}\\right)^{\\frac{1}{3}} = 5^{\\frac{8}{2} \\cdot \\frac{1}{3}} = 5^{\\frac{8}{6}} = 5^{\\frac{4}{3}} = \\sqrt[3]{5^4} \\approx 8{,}5499$</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$\\sqrt{7^3}$</td><td><code>√(7^3)</code> (knop √, dan knop xⁿ)</td></tr>
        <tr><td>$\\sqrt[3]{5^2}$</td><td><code>∛(5^2)</code> (knop ∛)</td></tr>
        <tr><td>$\\sqrt[5]{2^7}$</td><td>kies 5 bij knop ⁿ√, dan <code>(2^7)</code></td></tr>
        <tr><td>$11^{\\frac{1}{2}}$</td><td><code>11^(1/2)</code> (knop x<sup>p/q</sup>)</td></tr>
        <tr><td>$1397{,}5425$</td><td><code>1397,5425</code></td></tr></table>
      <p class="klein">Onder het invulvak zie je meteen hoe je antwoord gelezen wordt.</p></div>`,
  voorbeelden: [
    { tex: '7^{\\frac{1}{2}}', stappen: ['\\text{noemer 2: vierkantswortel, teller 1}', '7^{\\frac{1}{2}} = \\sqrt{7}'] },
    { tex: '3^{\\frac{4}{6}}', stappen: ['\\text{vereenvoudig eerst: } \\frac{4}{6} = \\frac{2}{3}', '3^{\\frac{2}{3}} = \\sqrt[3]{3^2}'] },
    { tex: '\\sqrt[5]{2^7}', stappen: ['\\text{wortelexponent 5 wordt de noemer, exponent 7 de teller}', '\\sqrt[5]{2^7} = 2^{\\frac{7}{5}}'] },
    { tex: '16^{\\frac{3}{4}}', stappen: ['16^{\\frac{3}{4}} = \\sqrt[4]{16^3} = \\sqrt[4]{4096}', '= 8 \\quad \\text{(rekenmachine)}'] },
    { tex: '6^{\\frac{1}{2}} \\cdot 6^{\\frac{1}{3}}', stappen: ['6^{\\frac{1}{2} + \\frac{1}{3}} = 6^{\\frac{3}{6} + \\frac{2}{6}}', '= 6^{\\frac{5}{6}}', '\\approx 4{,}4413'] },
    { tex: '\\left(3^{\\frac{2}{3}}\\right)^3', stappen: ['3^{\\frac{2}{3} \\cdot 3} = 3^2', '= 9'] },
  ],
  soorten: {
    wortelvorm: { naam: 'Schrijf in wortelvorm', gen() {
      for (;;) {
        const a = kies(BASIS.concat([4, 9, 12])), n0 = rnd(2, 7), m0 = rnd(1, 7), f = Math.random() < 0.25 ? 2 : 1;
        const [m, n] = red(m0, n0); if (n === 1 || m > 7) continue;
        const p = m * f, q = n * f; if (q > 12) continue;
        const binnen = m === 1 ? `${a}` : `${a}^${m}`;
        const ant = wortelE(n, m === 1 ? `${a}` : `${a}^${m}`), at = wortelT(n, m === 1 ? `${a}` : `${a}^{${m}}`);
        const uit = f > 1 ? [`\\text{vereenvoudig eerst: } ${fr(p, q)} = ${fr(m, n)}`] : [];
        uit.push(`${machtT(a, m, n)} = ${at}`);
        return { soort: 'wortelvorm', opdracht: 'Schrijf in wortelvorm. Vereenvoudig eerst de breuk in de exponent als het kan.', tex: machtT(a, p, q), antw: expr(ant, ['wortel' + n], { tex: at, toetsen: ['wortel'] }), uitleg: uit };
      }
    } },
    machtsvorm: { naam: 'Schrijf als macht', gen() {
      for (;;) {
        const a = kies(BASIS.concat([4, 9])), n = rnd(2, 7), m = Math.random() < 0.3 ? 1 : rnd(2, 7);
        if (m % n === 0) continue;
        const [p, q] = red(m, n);
        const tex = wortelT(n, m === 1 ? `${a}` : `${a}^{${m}}`);
        const uit = [`\\text{wortelexponent ${n}} \\rightarrow \\text{noemer, exponent ${m}} \\rightarrow \\text{teller}`, `${tex} = ${machtT(a, m, n)}`];
        if (p !== m) uit.push(`= ${machtT(a, p, q)} \\quad \\text{(vereenvoudig de breuk)}`);
        return { soort: 'machtsvorm', opdracht: 'Schrijf als macht met een rationale exponent.', tex, antw: expr(`${a}^(${p}/${q})`, ['een_macht'], { tex: machtT(a, p, q) }), uitleg: uit };
      }
    } },
    rekenmachine: { naam: 'Reken uit met de rekenmachine', gen() {
      for (;;) {
        if (Math.random() < 0.25) {
          const [a, p, q, w] = kies([[8, 2, 3, 4], [9, 1, 2, 3], [9, 3, 2, 27], [27, 2, 3, 9], [16, 3, 4, 8], [4, 3, 2, 8], [32, 2, 5, 4], [25, 3, 2, 125], [64, 5, 6, 32], [81, 3, 4, 27]]);
          return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Rond af op 4 decimalen waar nodig.', tex: machtT(a, p, q), antw: getal(w, 4, { voor: '=' }), uitleg: [`${machtT(a, p, q)} = ${wortelT(q, `${a}^{${p}}`)} = ${w}`] };
        }
        const a = kies(BASIS.concat([4, 8, 9, 12, 15, 20])), q = rnd(2, 7), p0 = rnd(1, 8); const [p, qq] = red(p0, q); if (qq === 1) continue;
        const c = Math.random() < 0.2 ? rnd(2, 9) : 1;
        const w = c * a ** (p / qq); if (!zekerRond(w, 4) || w > 20000) continue;
        const tex = `${c > 1 ? c + ' \\cdot ' : ''}${machtT(a, p, qq)}`;
        return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Rond af op 4 decimalen waar nodig.', tex, antw: getal(w, 4, { voor: '\\approx' }),
          uitleg: [`${tex} = ${c > 1 ? c + ' \\cdot ' : ''}${wortelT(qq, p === 1 ? `${a}` : `${a}^{${p}}`)} \\approx ${tg(w, 4)}`] };
      }
    } },
    eenmacht: { naam: 'Schrijf als één macht en reken uit', gen() {
      for (;;) {
        const a = kies([2, 3, 5, 6, 7, 10]), regel = kies(['maal', 'maal', 'deel', 'macht', 'macht']);
        const b1 = kies([2, 3, 4, 5, 6]), b2 = kies([2, 3, 4, 5, 6]);
        const t1 = rnd(1, 5), t2 = rnd(1, 5);
        let tex, P, Q, stap;
        if (regel === 'maal') { tex = `${machtT(a, t1, b1)} \\cdot ${machtT(a, t2, b2)}`; P = t1 * b2 + t2 * b1; Q = b1 * b2; stap = `${a}^{${fr(t1, b1)} + ${fr(t2, b2)}}`; }
        else if (regel === 'deel') { if (t1 * b2 <= t2 * b1) continue; tex = `${machtT(a, t1, b1)} : ${machtT(a, t2, b2)}`; P = t1 * b2 - t2 * b1; Q = b1 * b2; stap = `${a}^{${fr(t1, b1)} - ${fr(t2, b2)}}`; }
        else { const geheel = Math.random() < 0.5; if (geheel) { const n = rnd(2, 4); tex = `\\left(${machtT(a, t1, b1)}\\right)^{${n}}`; P = t1 * n; Q = b1; stap = `${a}^{${fr(t1, b1)} \\cdot ${n}}`; } else { tex = `\\left(${machtT(a, t1, b1)}\\right)^{${fr(t2, b2)}}`; P = t1 * t2; Q = b1 * b2; stap = `${a}^{${fr(t1, b1)} \\cdot ${fr(t2, b2)}}`; } }
        const [p, q] = red(P, Q); if (p === 0) continue;
        const w = a ** (p / q); if (w > 20000 || (q > 1 && !zekerRond(w, 4))) continue;
        if (ggd(t1, b1) > 1 && Math.random() < 0.7) continue;
        const res = q === 1 ? `${a}^{${p}}` : machtT(a, p, q);
        return { soort: 'eenmacht', opdracht: 'Schrijf als één macht en reken uit. Rond af op 4 decimalen waar nodig.', tex,
          antw: { soort: 'delen', delen: [
            { label: '\\text{als één macht}', antw: expr(`${a}^(${p}/${q})`, ['een_macht'], { tex: res, voor: '=' }) },
            { label: '\\text{uitkomst}', antw: getal(w, 4, { voor: q === 1 ? '=' : '\\approx' }) }] },
          uitleg: [`${tex} = ${stap} = ${res} ${q === 1 ? '=' : '\\approx'} ${q === 1 ? w : tg(w, 4)}`] };
      }
    } },
  },
  oefenMix: [['wortelvorm', 2], ['machtsvorm', 2], ['rekenmachine', 2], ['eenmacht', 3]],
  test: [['wortelvorm', 2], ['machtsvorm', 2], ['rekenmachine', 3], ['eenmacht', 3]],
};

// ===================================================================
//  DEEL 6 — De logaritme
// ===================================================================
const logT = (a, r) => a === 10 ? `\\log ${r}` : `\\log_{${a}} ${r}`;
// r = a^n als TeX: breuk of decimaal getal bij negatieve n
function machtGetal(a, n) {
  if (n >= 0) return { tex: W.duizend(String(a ** n)), e: String(a ** n), waarde: a ** n };
  const nm = a ** -n;
  if ([2, 5, 10].includes(a) && (a === 10 || nm <= 125) && Math.random() < 0.55) { const x = 1 / nm; return { tex: tg(+x.toPrecision(10)), e: kg(+x.toPrecision(10)), waarde: x }; }
  return { tex: `\\left(\\frac{1}{${nm}}\\right)`, e: `1/${nm}`, waarde: 1 / nm, breuk: true };
}
const DEEL6 = {
  nr: 6, titel: 'De logaritme', kort: 'Definitie, berekenen en intuïtief schatten.',
  rekenmachine: true,
  opdracht: 'Bereken.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">De definitie</div>
      <p class="midden" style="font-size:20px">$\\log_a r = n \\quad \\text{als} \\quad a^n = r$</p>
      <p>De logaritme is de <b>omgekeerde bewerking</b> van machtsverheffen.</p>
      <p>$\\log_a r$: hoeveel keer moet je $a$ met zichzelf vermenigvuldigen om $r$ te krijgen?</p>
      <p>$\\log_2 8 = 3 \\quad \\text{want} \\quad 2^3 = 2 \\cdot 2 \\cdot 2 = 8$</p>
      <p class="let-op">Geen grondtal geschreven? Dan is het grondtal 10: $\\log 1000 = \\log_{10} 1000 = 3$</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Berekenen: schrijf het getal als een macht van het grondtal</div>
      <p>$\\log_3 27 = \\log_3 3^3 = 3$ &nbsp;·&nbsp; $\\log_5 25 = \\log_5 5^2 = 2$ &nbsp;·&nbsp; $\\log_4 \\left(\\frac{1}{4}\\right) = \\log_4 4^{-1} = -1$</p>
      <p>$\\log 1\\,000\\,000 = \\log 10^6 = 6$ &nbsp;·&nbsp; $\\log 0{,}01 = \\log 10^{-2} = -2$ &nbsp;·&nbsp; $\\log_2 0{,}25 = \\log_2 \\left(\\frac{1}{4}\\right) = \\log_2 2^{-2} = -2$</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Intuïtief rekenen</div>
      <p>$\\log_4 64 = ?$ &nbsp; Begin bij 1 en vermenigvuldig telkens met 4: $1 \\xrightarrow{\\cdot 4} 4 \\xrightarrow{\\cdot 4} 16 \\xrightarrow{\\cdot 4} 64$. &nbsp; 3 keer, dus $64 = 4^3$ en $\\log_4 64 = 3$.</p>
      <p>$\\log 800 \\approx ?$ &nbsp; $1 \\xrightarrow{\\cdot 10} 10 \\xrightarrow{\\cdot 10} 100 \\xrightarrow{\\cdot 10} 1000$. &nbsp; 2 keer is te weinig (100), 3 keer is te veel (1000).<br>
        $100 < 800 < 1000 \\;\\rightarrow\\; 2 < \\log 800 < 3$ &nbsp; en met de rekenmachine $\\log 800 \\approx 2{,}90$</p>
      <p>$\\log_4 0{,}18 \\approx ?$ &nbsp; 0,18 is kleiner dan 1: <b>deel</b> telkens door 4: $1 \\xrightarrow{:4} 0{,}25 \\xrightarrow{:4} 0{,}0625$.<br>
        $0{,}0625 < 0{,}18 < 0{,}25 \\;\\rightarrow\\; -2 < \\log_4 0{,}18 < -1$ &nbsp; en $\\log_4 0{,}18 \\approx -1{,}24$ &nbsp; <span class="klein">(delen → negatieve exponent)</span></p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <p>Typ een getal: <code>3</code>, <code>-2</code>, <code>2,90</code>. Breuken typ je met een schuine streep: <code>1/8</code>. In de vakjes $\\log_{\\square} \\square = \\square$ typ je in elk vakje één getal.</p></div>`,
  voorbeelden: [
    { tex: '\\log_2 32', stappen: ['32 = 2^5', '\\log_2 32 = \\log_2 2^5 = 5'] },
    { tex: '\\log_3 \\left(\\frac{1}{9}\\right)', stappen: ['\\frac{1}{9} = \\frac{1}{3^2} = 3^{-2}', '\\log_3 \\left(\\frac{1}{9}\\right) = -2'] },
    { tex: '\\log 0{,}001', stappen: ['0{,}001 = 10^{-3}', '\\log 0{,}001 = -3'] },
    { tex: '2^5 = 32 \\text{ als logaritme}', stappen: ['a^n = r \\;\\Leftrightarrow\\; \\log_a r = n', '\\log_2 32 = 5'] },
    { tex: '\\log_2 20 \\approx ?', stappen: ['1 \\xrightarrow{\\cdot 2} 2 \\xrightarrow{\\cdot 2} 4 \\xrightarrow{\\cdot 2} 8 \\xrightarrow{\\cdot 2} 16 \\xrightarrow{\\cdot 2} 32', '16 < 20 < 32 \\;\\rightarrow\\; 4 < \\log_2 20 < 5', '\\text{rekenmachine: } \\log_2 20 \\approx 4{,}32'] },
  ],
  soorten: {
    bereken: { naam: 'Bereken', gen() {
      for (;;) {
        const a = kies([2, 2, 3, 4, 5, 6, 7, 10, 10]), n = Math.random() < 0.06 ? 1 : rnd(-3, 6);
        if (n === 0 || Math.abs(a ** n) > 100000 || (n < 0 && a ** -n > 1000)) continue;
        const m = machtGetal(a, n);
        const tex = logT(a, m.tex);
        const stap = n < 0 && m.breuk ? `${logT(a, m.tex)} = ${logT(a, `${a}^{${n}}`)}` : n < 0 ? `${m.tex} = \\frac{1}{${a ** -n}} = ${a}^{${n}}` : `${m.tex} = ${a}^{${n}}`;
        return { soort: 'bereken', opdracht: 'Bereken. Schrijf het getal als een macht van het grondtal.', tex, antw: getal(n), uitleg: [stap, `${tex} = ${n}`] };
      }
    } },
    omzetten: { naam: 'Macht ↔ logaritme', gen() {
      for (;;) {
        const a = kies([2, 3, 4, 5, 6, 10]), n = rnd(-3, 5); if (n === 0 || a ** n > 10000) continue;
        const m = machtGetal(a, n), rt = m.breuk ? `\\frac{1}{${a ** -n}}` : m.tex;
        if (Math.random() < 0.5) {
          return { soort: 'omzetten', opdracht: 'Schrijf de macht als logaritme.', tex: `${a}^{${n}} = ${rt}`,
            antw: { soort: 'vakjes', sjabloon: [{ tex: '\\log' }, { veld: 0, sub: true }, { veld: 1 }, { tex: '=' }, { veld: 2 }], velden: [veldE(`${a}`), veldE(m.e.replace(/\s/g, '')), veldE(`${n}`)] },
            uitleg: [`a^n = r \\;\\Leftrightarrow\\; \\log_a r = n`, `\\log_{${a}} ${m.breuk ? `\\left(${rt}\\right)` : rt} = ${n}`] };
        }
        return { soort: 'omzetten', opdracht: 'Schrijf de logaritme als macht.', tex: `${logT(a, m.tex)} = ${n}`,
          antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { veld: 1, sup: true }, { tex: '=' }, { veld: 2 }], velden: [veldE(`${a}`), veldE(`${n}`), veldE(m.e.replace(/\s/g, ''))] },
          uitleg: [`\\log_a r = n \\;\\Leftrightarrow\\; a^n = r`, `${a}^{${n}} = ${rt}`] };
      }
    } },
    tussen: { naam: 'Schat intuïtief', gen() {
      for (;;) {
        const a = kies([2, 3, 4, 5, 10]); let r;
        if (Math.random() < 0.7) r = a === 10 ? rnd(11, 9999) : rnd(3, a ** (a === 2 ? 9 : a === 3 ? 6 : 4));
        else r = kies([0.3, 0.05, 0.2, 0.7, 0.15, 0.04, 0.6, 0.008, 0.45]);
        const w = Math.log(r) / Math.log(a), g = Math.floor(w);
        if (Math.abs(w - Math.round(w)) < 1e-9 || !zekerRond(w, 2)) continue;
        const lo = a ** g, hi = a ** (g + 1);
        const tl = (x) => tg(+x.toPrecision(8));
        const keten = r >= 1 ? `1 \\xrightarrow{\\cdot ${a}} ${Array.from({ length: g + 1 }, (_, i) => tl(a ** (i + 1))).join(` \\xrightarrow{\\cdot ${a}} `)}`
          : `1 \\xrightarrow{:${a}} ${Array.from({ length: -g }, (_, i) => tl(a ** (-i - 1))).join(` \\xrightarrow{:${a}} `)}`;
        const lt = logT(a, tg(r));
        return { soort: 'tussen', opdracht: r >= 1 ? 'Tussen welke twee gehele getallen ligt de logaritme? Vermenigvuldig telkens met het grondtal. Controleer met je rekenmachine (2 decimalen).' : 'Tussen welke twee gehele getallen ligt de logaritme? Deel telkens door het grondtal. Controleer met je rekenmachine (2 decimalen).', tex: lt,
          antw: { soort: 'delen', delen: [
            { label: '\\text{ligt tussen}', antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { tex: `< ${lt} <` }, { veld: 1 }], velden: [veldE(String(g)), veldE(String(g + 1))] } },
            { label: '\\text{rekenmachine}', antw: getal(w, 2, { voor: `${lt} \\approx` }) }] },
          uitleg: [keten, `${tl(lo)} < ${tg(r)} < ${tl(hi)} \\;\\rightarrow\\; ${g} < ${lt} < ${g + 1}`, `${lt} \\approx ${tg(w, 2)}`] };
      }
    } },
  },
  oefenMix: [['bereken', 4], ['omzetten', 3], ['tussen', 3]],
  test: [['bereken', 4], ['omzetten', 3], ['tussen', 3]],
};

// ===================================================================
//  DEEL 7 — Rekenregels met logaritmen
// ===================================================================
const delers = (n) => { const d = []; for (let i = 2; i < n; i++) if (n % i === 0) d.push(i); return d; };
const DEEL7 = {
  nr: 7, titel: 'Rekenregels met logaritmen', kort: 'Product, quotiënt, macht en x berekenen.',
  rekenmachine: true,
  opdracht: 'Bereken met een rekenregel.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">De rekenregels</div>
      <table class="tabel">
        <tr><td>$\\log_x 1 = 0$</td><td class="klein">want $x^0 = 1$</td></tr>
        <tr><td>$\\log_x x = 1$</td><td class="klein">want $x^1 = x$</td></tr>
        <tr><td>$\\log_x (m \\cdot n) = \\log_x m + \\log_x n$</td><td class="klein">product → som</td></tr>
        <tr><td>$\\log_x \\left(\\frac{m}{n}\\right) = \\log_x m - \\log_x n$</td><td class="klein">quotiënt → verschil</td></tr>
        <tr><td>$\\log_x m^n = n \\cdot \\log_x m$</td><td class="klein">exponent komt vooraan</td></tr>
        <tr><td>$\\log_x \\left(\\frac{1}{n}\\right) = -\\log_x n$</td><td class="klein">omgekeerde → tegengestelde</td></tr></table>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Voorbeelden</div>
      <p>$\\log_2 4 + \\log_2 2 = \\log_2 (4 \\cdot 2) = \\log_2 8 = 3$</p>
      <p>$\\log 20 + \\log 50 = \\log (20 \\cdot 50) = \\log 1000 = 3$</p>
      <p>$\\log_4 32 - \\log_4 2 = \\log_4 \\left(\\frac{32}{2}\\right) = \\log_4 16 = 2$</p>
      <p>$\\log_3 9^4 = 4 \\cdot \\log_3 9 = 4 \\cdot 2 = 8$ &nbsp;·&nbsp; $\\log_4 \\left(\\frac{1}{16}\\right) = -\\log_4 16 = -2$</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Bereken x: gebruik de definitie</div>
      <p class="midden">$a^n = r \\;\\Leftrightarrow\\; \\log_a r = n$</p>
      <p>$7^x = 16\\,807 \\;\\rightarrow\\; x = \\log_7 16\\,807 = 5$ &nbsp; <span class="klein">(controle: $7^5 = 16\\,807$)</span></p>
      <p>$5 = 7^x \\;\\rightarrow\\; x = \\log_7 5 \\approx 0{,}8$ &nbsp; <span class="klein">(rekenmachine: $\\log_7 5 \\approx 0{,}827 \\approx 0{,}8$ op 1 decimaal)</span></p>
      <p>$3 = \\log_x 81 \\;\\rightarrow\\; x^3 = 81 \\;\\rightarrow\\; x = \\sqrt[3]{81} \\approx 4{,}3$ &nbsp; <span class="klein">Het grondtal is nu de onbekende: neem de derdemachtswortel ($\\sqrt[3]{81} \\approx 4{,}327$).</span></p>
    </div>`,
  voorbeelden: [
    { tex: '\\log_6 4 + \\log_6 9', stappen: ['= \\log_6 (4 \\cdot 9) = \\log_6 36', '= 2 \\quad (6^2 = 36)'] },
    { tex: '\\log_2 40 - \\log_2 5', stappen: ['= \\log_2 \\left(\\frac{40}{5}\\right) = \\log_2 8', '= 3'] },
    { tex: '\\log 100^3', stappen: ['= 3 \\cdot \\log 100', '= 3 \\cdot 2 = 6'] },
    { tex: '\\log_2 8 + \\log_2 4 - \\log_2 2', stappen: ['= \\log_2 \\left(\\frac{8 \\cdot 4}{2}\\right) = \\log_2 16', '= 4'] },
    { tex: '2^x = 64', stappen: ['x = \\log_2 64', '= 6 \\quad (2^6 = 64)'] },
    { tex: '4^x = 20', stappen: ['x = \\log_4 20', '\\approx 2{,}16 \\approx 2{,}2 \\quad \\text{(1 decimaal)}'] },
    { tex: '2 = \\log_x 49', stappen: ['x^2 = 49', 'x = \\sqrt{49} = 7'] },
  ],
  soorten: {
    regel: { naam: 'Eén rekenregel', gen() {
      for (;;) {
        const a = kies([2, 3, 4, 5, 6, 10]), soort = kies(['som', 'som', 'verschil', 'verschil', 'macht', 'macht', 'omgekeerd', 'nul', 'een']);
        if (soort === 'som') { const k = rnd(2, a === 2 ? 6 : a === 10 ? 4 : 3), n = a ** k, d = delers(n).filter(x => x !== a ** (k / 2) || k % 2); if (!d.length) continue; const m = kies(d), q = n / m;
          return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: `${logT(a, m)} + ${logT(a, q)}`, antw: getal(k), uitleg: [`${logT(a, `(${m} \\cdot ${q})`)} = ${logT(a, W.duizend(n))} = ${k} \\quad (${a}^{${k}} = ${W.duizend(n)})`] }; }
        if (soort === 'verschil') { const k = rnd(1, 3), q = rnd(2, 9), m = q * a ** k; if (m > 2000) continue;
          return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: `${logT(a, m)} - ${logT(a, q)}`, antw: getal(k), uitleg: [`${logT(a, `\\left(\\frac{${m}}{${q}}\\right)`)} = ${logT(a, a ** k)} = ${k}`] }; }
        if (soort === 'macht') { const j = rnd(1, 3), b = a ** j, e = rnd(2, 6); if (b > 1000) continue;
          return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: logT(a, `${b}^{${e}}`), antw: getal(j * e), uitleg: [`= ${e} \\cdot ${logT(a, b)} = ${e} \\cdot ${j} = ${j * e}`] }; }
        if (soort === 'omgekeerd') { const k = rnd(1, 4), n = a ** k; if (n > 1000) continue;
          return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: logT(a, `\\left(\\frac{1}{${n}}\\right)`), antw: getal(-k), uitleg: [`= -${logT(a, n)} = -${k}`] }; }
        const b = rnd(2, 9);
        if (soort === 'nul') return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: logT(b, 1), antw: getal(0), uitleg: [`${logT(b, 1)} = 0 \\quad \\text{want } ${b}^0 = 1`] };
        return { soort: 'regel', opdracht: 'Bereken met een rekenregel.', tex: logT(b, b), antw: getal(1), uitleg: [`${logT(b, b)} = 1 \\quad \\text{want } ${b}^1 = ${b}`] };
      }
    } },
    combineer: { naam: 'Rekenregels combineren', gen() {
      for (;;) {
        const a = kies([2, 3, 4, 5, 10]), vorm = kies(['drie', 'drie', 'macht1', 'coef', 'eenmin']);
        if (vorm === 'drie') { // log p + log q − log r = log(pq/r) = k
          const k = rnd(1, a === 2 ? 5 : 3), r = rnd(2, 9), n = r * a ** k, d = delers(n); if (!d.length || n > 5000) continue; const p = kies(d), q = n / p; if (q < 2 || q === r || p === r) continue;
          return { soort: 'combineer', opdracht: 'Combineer de rekenregels.', tex: `${logT(a, p)} + ${logT(a, q)} - ${logT(a, r)}`, antw: getal(k),
            uitleg: [`= ${logT(a, `\\left(\\frac{${p} \\cdot ${q}}{${r}}\\right)`)} = ${logT(a, a ** k)} = ${k}`] };
        }
        if (vorm === 'macht1') { const k = rnd(2, 6), b = rnd(2, 9), aa = kies([2, 3, 5]);
          return { soort: 'combineer', opdracht: 'Combineer de rekenregels.', tex: `${logT(aa, `${aa}^{${k}}`)} + ${logT(b, 1)}`, antw: getal(k), uitleg: [`= ${k} \\cdot ${logT(aa, aa)} + 0 = ${k} \\cdot 1 + 0 = ${k}`] }; }
        if (vorm === 'coef') { const c = rnd(2, 5), j = rnd(1, 3), b = a ** j; if (b > 1000) continue;
          return { soort: 'combineer', opdracht: 'Combineer de rekenregels.', tex: `${c} \\cdot ${logT(a, b)}`, antw: getal(c * j), uitleg: [`= ${c} \\cdot ${j} = ${c * j} \\quad \\text{of} \\quad ${logT(a, `${b}^{${c}}`)} = ${logT(a, `${a}^{${c * j}}`)} = ${c * j}`] }; }
        // log p + log q − log 1
        const k = rnd(1, 3), n = a ** k, d = delers(n); if (!d.length || n > 2000) continue; const p = kies(d), q = n / p;
        return { soort: 'combineer', opdracht: 'Combineer de rekenregels.', tex: `${logT(a, p)} + ${logT(a, q)} - ${logT(a, 1)}`, antw: getal(k), uitleg: [`= ${logT(a, `(${p} \\cdot ${q})`)} - 0 = ${logT(a, n)} = ${k}`] };
      }
    } },
    berekenx: { naam: 'Bereken x', gen() {
      for (;;) {
        const vorm = kies(['macht', 'macht', 'grondtal']);
        if (vorm === 'macht') {
          const a = kies([2, 3, 4, 5, 6, 7, 10]); let r, exact = Math.random() < 0.45, x;
          if (exact) { const n = rnd(-2, 6); if (n === 0 || a ** n > 20000) continue; const m = machtGetal(a, n); r = m.breuk ? `\\frac{1}{${a ** -n}}` : m.tex; x = n; }
          else { const g = rnd(2, 900); if (Number.isInteger(Math.log(g) / Math.log(a))) continue; r = W.duizend(g); x = Math.log(g) / Math.log(a); if (!zekerRond(x, 1)) continue; }
          const links = Math.random() < 0.7;
          const tex = links ? `${a}^x = ${r}` : `${r} = ${a}^x`;
          return { soort: 'berekenx', opdracht: 'Bereken x. Gebruik de definitie. Rond af op 1 decimaal waar nodig.', tex, antw: getal(x, 1, { voor: exact ? 'x =' : 'x \\approx' }),
            uitleg: [`x = ${logT(a, r)}`, exact ? `= ${x}` : `\\approx ${tg(x, 3)} \\approx ${tg(x, 1)}`] };
        }
        const n = kies([2, 2, 3]); let r, x, exact = Math.random() < 0.5;
        if (exact) { x = rnd(2, n === 2 ? 15 : 7); r = x ** n; } else { r = rnd(5, 300); x = r ** (1 / n); if (Number.isInteger(+x.toFixed(9)) || !zekerRond(x, 1)) continue; }
        return { soort: 'berekenx', opdracht: 'Bereken x. Gebruik de definitie. Rond af op 1 decimaal waar nodig.', tex: `${n} = \\log_x ${r}`, antw: getal(x, 1, { voor: exact ? 'x =' : 'x \\approx' }),
          uitleg: [`x^${n} = ${r}`, `x = ${n === 2 ? `\\sqrt{${r}}` : `\\sqrt[3]{${r}}`} ${exact ? `= ${x}` : `\\approx ${tg(x, 3)} \\approx ${tg(x, 1)}`}`] };
      }
    } },
  },
  oefenMix: [['regel', 4], ['combineer', 3], ['berekenx', 3]],
  test: [['regel', 4], ['combineer', 3], ['berekenx', 3]],
};
