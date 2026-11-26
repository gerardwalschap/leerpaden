// ===================================================================
//  REKENEN IN ℝ + — de tien delen
// ===================================================================

// ---------------------------------------------------------------
// 1. De reële getallen +
// ---------------------------------------------------------------
const nietKw = (a, b) => tot(() => { const n = rnd(a, b); return isKwadraat(n) ? null : n; });
const QOFR_PLUS = [
  () => { const n = rnd(2, 9), t = tot(() => { const x = rnd(1, n - 1); return ggd(x, n) === 1 ? x : null; }); return [`\\sqrt{\\dfrac{${t * t}}{${n * n}}}`, 'Q', `= \\dfrac{${t}}{${n}} \\text{: een breuk, dus rationaal}`]; },
  () => { const n = rnd(2, 9), t = nietKw(2, 20); return [`\\sqrt{\\dfrac{${t}}{${n * n}}}`, 'RQ', `= \\dfrac{\\sqrt{${t}}}{${n}} = ${afgekapt(Math.sqrt(t) / n, 6)} \\text{: irrationaal}`]; },
  () => { const k = rnd(1, 9); return [`\\sqrt{${tg(k * k / 100)}}`, 'Q', `= ${tg(k / 10)} \\text{: begrensd, dus rationaal}`]; },
  () => { const k = kies([4, 9, 16, 25, 36, 49, 64, 81].map(x => x / 10)); return [`\\sqrt{${tg(k)}}`, 'RQ', `= ${afgekapt(Math.sqrt(k), 6)} \\text{: niet begrensd en niet repeterend}`]; },
  () => { const b = kies(KW), k = rnd(2, 5); return [`\\sqrt{${b}} \\cdot \\sqrt{${b * k * k}}`, 'Q', `= \\sqrt{${b * b * k * k}} = ${b * k} \\text{: rationaal}`]; },
  () => { const a = kies(KW), b = kies(KW.filter(x => x !== a && !isKwadraat(x * a))); return [`\\sqrt{${a}} \\cdot \\sqrt{${b}}`, 'RQ', `= \\sqrt{${a * b}} = ${afgekapt(Math.sqrt(a * b), 5)} \\text{: irrationaal}`]; },
  () => { const n = nietKw(2, 30); return [`\\left(\\sqrt{${n}}\\right)^2`, 'Q', `= ${n} \\text{: rationaal}`]; },
  () => { const n = nietKw(2, 30); return [`\\sqrt{${n}} + \\sqrt{${n}}`, 'RQ', `= 2\\sqrt{${n}} = ${afgekapt(2 * Math.sqrt(n), 5)} \\text{: irrationaal}`]; },
  () => { const n = nietKw(2, 30); return [`\\sqrt{${n}} - \\sqrt{${n}}`, 'Q', '= 0 \\text{: rationaal}']; },
  () => [`0{,}1010010001000010\\ldots`, 'RQ', '\\text{er komt telkens een 0 meer bij: geen periode, dus irrationaal}'],
  () => [`\\dfrac{22}{7}`, 'Q', '\\dfrac{22}{7} = 3{,}142857142857\\ldots \\text{ is repeterend: rationaal (en dus niet gelijk aan } \\pi)'],
  () => { const k = rnd(2, 5); return [kies([`${k}\\pi`, `\\dfrac{\\pi}{${k}}`, `\\pi + ${k}`]), 'RQ', '\\text{met } \\pi \\text{ blijft het getal niet begrensd en niet repeterend: irrationaal}']; },
  () => { const t = rnd(1, 4), n = t + rnd(1, 3); return [`\\sqrt[3]{-\\dfrac{${t ** 3}}{${n ** 3}}}`, 'Q', `= -\\dfrac{${t}}{${n}} \\text{: rationaal}`]; },
  () => { const n = tot(() => { const x = rnd(2, 30); return isDerde(x) ? null : x; }); return [`\\sqrt[3]{${n}}`, 'RQ', `= ${afgekapt(Math.cbrt(n), 6)} \\text{: irrationaal}`]; },
];
const DIAGRAM_PLUS = [
  () => { const k = rnd(2, 9); return [`-\\dfrac{\\sqrt{${k * k}}}{${k}}`, 'Z', `= -\\dfrac{${k}}{${k}} = -1`]; },
  () => { const b = kies(KW), k = rnd(2, 6); return [`\\dfrac{\\sqrt{${b * k * k}}}{\\sqrt{${b}}}`, 'N', `= \\sqrt{${k * k}} = ${k}`]; },
  () => { const n = nietKw(2, 20); return [`\\left(\\sqrt{${n}}\\right)^2`, 'N', `= ${n}`]; },
  () => { const k = rnd(2, 9), m = rnd(2, 6); return kies([[`\\dfrac{${k * m}}{${m}}`, 'N', `= ${k}`], [`-\\dfrac{${k * m}}{${m}}`, 'Z', `= -${k}`]]); },
  () => { const k = rnd(1, 9); return [`\\sqrt{${tg(k * k / 100)}}`, 'Q', `= ${tg(k / 10)}`]; },
  () => { const a = kies([2, 3, 4, 5]); return [`${a}^{-1}`, 'Q', `= \\dfrac{1}{${a}}`]; },
  () => { const k = rnd(2, 6); return [`\\sqrt[3]{-${k ** 3}}`, 'Z', `= -${k}`]; },
  () => { const k = rnd(2, 4); return [`\\pi - ${k}`, 'RQ', `\\pi - ${k} = ${afgekapt(Math.PI - k, 5)} \\text{ is irrationaal}`]; },
  () => { const b = kies(KW); return [`-\\sqrt{${b}} \\cdot \\sqrt{${b}}`, 'Z', `= -${b}`]; },
  () => { const b = kies(KW); return [`\\dfrac{\\sqrt{${b}}}{2}`, 'RQ', `= ${afgekapt(Math.sqrt(b) / 2, 5)} \\text{ is irrationaal}`]; },
  () => { const k = rnd(2, 9); return [`\\sqrt{${k * k}} - ${k}`, 'N', '= 0 \\quad (0 \\in \\mathbb{N})']; },
];
const WAAR_PLUS = [
  ['De som van twee irrationale getallen is altijd irrationaal.', 'nw', '\\sqrt{2} + (-\\sqrt{2}) = 0 \\in \\mathbb{Q}'],
  ['Het product van twee irrationale getallen kan rationaal zijn.', 'w', '\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4'],
  ['Een getal met oneindig veel decimalen is altijd irrationaal.', 'nw', '\\frac{1}{3} = 0{,}333\\ldots \\text{ heeft oneindig veel decimalen, maar is repeterend: rationaal}'],
  ['Tussen 1 en 2 liggen oneindig veel reële getallen.', 'w', '1{,}1;\\ 1{,}01;\\ 1{,}001;\\ \\ldots \\text{ en ook } \\sqrt{2}, \\sqrt{3}, \\ldots'],
  ['0 is een natuurlijk getal.', 'w', '0 \\in \\mathbb{N}'],
  ['√(−4) is een reëel getal.', 'nw', '\\text{geen enkel reëel getal in het kwadraat is negatief}'],
  ['∛(−8) is een geheel getal.', 'w', '\\sqrt[3]{-8} = -2 \\in \\mathbb{Z}'],
  ['22/7 is gelijk aan π.', 'nw', '\\frac{22}{7} = 3{,}142857\\ldots \\text{ is rationaal, } \\pi = 3{,}141592\\ldots \\text{ is irrationaal}'],
  ['Elk geheel getal is een rationaal getal.', 'w', '\\mathbb{Z} \\subset \\mathbb{Q}, \\text{ bv. } -5 = \\frac{-5}{1}'],
  ['√2 + √2 is een rationaal getal.', 'nw', '\\sqrt{2} + \\sqrt{2} = 2\\sqrt{2} \\text{ is irrationaal}'],
  ['De wortel uit een natuurlijk getal is rationaal of irrationaal, nooit allebei.', 'w', '\\text{elk reëel getal hoort bij } \\mathbb{Q} \\text{ of bij } \\mathbb{R}\\setminus\\mathbb{Q}'],
  ['Een irrationaal getal kan je exact schrijven met een wortelteken.', 'w', '\\sqrt{2} \\text{ is exact; enkel de decimale vorm is een benadering}'],
];
const D1 = {
  nr: 1, titel: 'De reële getallen +', kort: 'Valstrikken: wortels van breuken en kommagetallen, producten en sommen van wortels.', rekenmachine: true,
  opdracht: 'Is het getal rationaal of irrationaal?',
  theorie: theorieVan(1, `<p><b>Reken eerst uit, beslis dan.</b> Een wortelteken maakt een getal niet vanzelf irrationaal:</p>
      <p class="midden">$\\sqrt{\\frac{4}{9}} = \\frac{2}{3} \\in \\mathbb{Q}$ &nbsp;·&nbsp; $\\sqrt{0{,}04} = 0{,}2 \\in \\mathbb{Q}$, maar $\\sqrt{0{,}4} = 0{,}6324\\ldots \\in \\mathbb{R}\\setminus\\mathbb{Q}$</p>
      <p class="midden">$\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4 \\in \\mathbb{Q}$ &nbsp;·&nbsp; $\\sqrt{3} - \\sqrt{3} = 0 \\in \\mathbb{Q}$, maar $\\sqrt{3} + \\sqrt{3} = 2\\sqrt{3} \\in \\mathbb{R}\\setminus\\mathbb{Q}$</p>
      <p><b>Oneindig veel decimalen</b> is niet genoeg om irrationaal te zijn: ook de <b>periode</b> moet ontbreken. $0{,}1010010001\\ldots$ heeft een patroon, maar geen periode: irrationaal.</p>`),
  voorbeelden: [
    { tex: '\\sqrt{3} \\cdot \\sqrt{12}', stappen: ['= \\sqrt{36} = 6', '6 \\in \\mathbb{Q}'] },
    { tex: '\\sqrt{0{,}9}', stappen: ['= 0{,}948683\\ldots', '\\text{niet begrensd en niet repeterend: } \\mathbb{R}\\setminus\\mathbb{Q}'] },
    { tex: '\\dfrac{\\sqrt{50}}{\\sqrt{2}} \\quad \\text{(plaats in het diagram)}', stappen: ['= \\sqrt{25} = 5', '\\text{het kleinste deel is } \\mathbb{N}'] },
  ],
  soorten: {
    qofr: { naam: 'Rationaal of irrationaal? (valstrikken)', gen() { const [tex, j, u] = kies(QOFR_PLUS)(); return { soort: 'qofr', tex, antw: keuze(QR, j), uitleg: [u, j === 'Q' ? '\\text{rationaal: } \\mathbb{Q}' : '\\text{irrationaal: } \\mathbb{R}\\setminus\\mathbb{Q}'] }; } },
    diagram: { naam: 'Plaats in het diagram (eerst uitrekenen)', gen() { const [tex, j, u] = kies(DIAGRAM_PLUS)();
      return { soort: 'diagram', opdracht: 'In welk deel van het diagram plaats je dit getal? Reken eerst uit en kies het kleinste deel.', tex, antw: keuze(NZQR, j), uitleg: [u, `\\text{kleinste deel: } ${NZQR.find(x => x.k === j).l}`] }; } },
    waarniet: { naam: 'Waar of niet waar?', gen() { const [zin, j, u] = kies(WAAR_PLUS);
      return { soort: 'waarniet', opdracht: 'Waar of niet waar?', html: `<div class="tekstopgave">${W.esc(zin)}</div>`, rapport: zin, sleutel: zin, antw: keuze(WAAR, j), uitleg: [u] }; } },
  },
  oefenMix: [['qofr', 4], ['diagram', 3], ['waarniet', 2]],
  test: [['qofr', 4], ['diagram', 3], ['waarniet', 3]],
};

// ---------------------------------------------------------------
// 2. Bewerkingen in ℝ + (rekenmachine)
// ---------------------------------------------------------------
const r4 = (x) => W.rond(x, 4);
const D2 = {
  nr: 2, titel: 'Bewerkingen in ℝ +', kort: 'Derdemachtswortels van kommagetallen, negatieve en grote wortels benaderen, zelf splitsen, lange berekeningen.', rekenmachine: true,
  opdracht: 'Bereken.',
  theorie: theorieVan(2, `<p><b>Derdemachtswortel van een kommagetal</b>: $\\sqrt[3]{-0{,}008} = -0{,}2$ want $(-0{,}2)^3 = -0{,}008$ (3 decimalen worden 1 decimaal).</p>
      <p><b>Negatieve derdemachtswortels benaderen</b>: $-64 < -50 < -27$, dus $-4 < \\sqrt[3]{-50} < -3$ (let op: $-4$ is het kleinste getal).</p>
      <p><b>Zelf splitsen</b>: zoek het grootste gekende kwadraat dat in het getal zit: $\\sqrt{180} = \\sqrt{36 \\cdot 5} = 6\\sqrt{5} \\approx 13{,}42$.</p>
      <p><b>Lange berekeningen</b>: ook hier tussenresultaten met 4 decimalen: $(\\sqrt{2} + \\sqrt{3}) \\cdot \\sqrt{5} \\approx (1{,}4142 + 1{,}7321) \\cdot 2{,}2361 \\approx 7{,}04$.</p>`),
  voorbeelden: [
    { tex: '\\sqrt[3]{0{,}125}', stappen: ['0{,}5^3 = 0{,}125', '= 0{,}5'] },
    { tex: '\\sqrt[3]{-90} \\text{ benaderen}', stappen: ['-125 < -90 < -64', '-5 < \\sqrt[3]{-90} < -4', '\\approx -4{,}48'] },
    { tex: '\\sqrt{245}', stappen: ['245 = 49 \\cdot 5', '= 7\\sqrt{5} \\approx 15{,}65'] },
  ],
  soorten: {
    derde: { naam: 'Derdemachtswortel van een kommagetal', gen() {
      const k = rnd(1, 9), d = kies([1, 1, 2]), s = Math.random() < 0.5 ? -1 : 1, w = s * k / 10 ** d, x = +(w ** 3).toFixed(3 * d);
      return { soort: 'derde', opdracht: 'Bereken zonder rekenmachine.', tex: `\\sqrt[3]{${tg(x)}}`, antw: getal(w), uitleg: [`${h(w)}^3 = ${tg(x)}`, `\\sqrt[3]{${tg(x)}} = ${tg(w)}`] };
    } },
    tussen: { naam: 'Grote en negatieve wortels benaderen', gen() {
      return tot(() => {
        const v = rnd(0, 2); let n, w, wt, m;
        if (v === 0) { n = rnd(101, 399); if (isKwadraat(n)) return null; w = Math.sqrt(n); wt = `\\sqrt{${n}}`; m = 2; }
        else if (v === 1) { n = -rnd(2, 999); if (isDerde(-n)) return null; w = Math.cbrt(n); wt = `\\sqrt[3]{${n}}`; m = 3; }
        else { n = rnd(126, 999); if (isDerde(n)) return null; w = Math.cbrt(n); wt = `\\sqrt[3]{${n}}`; m = 3; }
        if (!zekerRond(w, 2)) return null; const g = Math.floor(w);
        return { soort: 'tussen', opdracht: 'Tussen welke twee gehele getallen ligt de wortel? Controleer daarna met je rekenmachine (2 decimalen).', tex: wt,
          antw: { soort: 'delen', delen: [
            { label: '\\text{ligt tussen}', antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { tex: `< ${wt} <` }, { veld: 1 }], velden: [veldE(String(g)), veldE(String(g + 1))] } },
            { label: '\\text{rekenmachine}', antw: getal(w, 2, { voor: `${wt} \\approx` }) }] },
          uitleg: [`${tg(g ** m)} < ${n} < ${tg((g + 1) ** m)} \\quad (${tg(g ** m)} = ${h(g)}^${m},\\ ${tg((g + 1) ** m)} = ${h(g + 1)}^${m})`, `${g} < ${wt} < ${g + 1}`, `${wt} \\approx ${tg(w, 2)}`] };
      });
    } },
    splits: { naam: 'Zelf splitsen en uitrekenen', gen() {
      return tot(() => {
        const k = rnd(2, 15), b = kies(KW), N = k * k * b; if (N > 1500) return null; const w = k * Math.sqrt(b); if (!zekerRond(w, 2)) return null;
        return { soort: 'splits', opdracht: 'Splits in een gekend kwadraat en een kleiner getal. Rond daarna af op 2 decimalen.', tex: `\\sqrt{${N}}`,
          antw: { soort: 'delen', delen: [{ label: '\\text{gesplitst}', antw: expr(wE(k, b), ['vereenvoudigd'], { voor: '=' }) }, { label: '\\text{resultaat}', antw: getal(w, 2, { voor: '\\approx' }) }] },
          uitleg: [`${N} = ${k * k} \\cdot ${b} \\quad (${k * k} \\text{ is het grootste kwadraat})`, `\\sqrt{${N}} = \\sqrt{${k * k}} \\cdot \\sqrt{${b}} = ${wTex(k, b)} \\approx ${tg(w, 2)}`] };
      });
    } },
    lang: { naam: 'Lange berekeningen (tussenresultaten)', gen() {
      return tot(() => {
        const vorm = kies(['sommaal', 'deel', 'mix', 'pi']);
        const a = nietKw(2, 40), b = nietKw(2, 40), c = nietKw(2, 40); if (a === b) return null;
        let tex, exact, benad, tus;
        if (vorm === 'sommaal') { tex = `(\\sqrt{${a}} + \\sqrt{${b}}) \\cdot \\sqrt{${c}}`; exact = (Math.sqrt(a) + Math.sqrt(b)) * Math.sqrt(c); benad = (r4(Math.sqrt(a)) + r4(Math.sqrt(b))) * r4(Math.sqrt(c)); tus = `(${tg(r4(Math.sqrt(a)), 4)} + ${tg(r4(Math.sqrt(b)), 4)}) \\cdot ${tg(r4(Math.sqrt(c)), 4)}`; }
        if (vorm === 'deel') { tex = `\\dfrac{\\sqrt{${a}} + ${c}}{\\sqrt{${b}}}`; exact = (Math.sqrt(a) + c) / Math.sqrt(b); benad = (r4(Math.sqrt(a)) + c) / r4(Math.sqrt(b)); tus = `(${tg(r4(Math.sqrt(a)), 4)} + ${c}) : ${tg(r4(Math.sqrt(b)), 4)}`; }
        if (vorm === 'mix') { if (isDerde(b)) return null; tex = `\\sqrt{${a}} \\cdot \\sqrt[3]{${b}} - ${c}`; exact = Math.sqrt(a) * Math.cbrt(b) - c; benad = r4(Math.sqrt(a)) * r4(Math.cbrt(b)) - c; tus = `${tg(r4(Math.sqrt(a)), 4)} \\cdot ${tg(r4(Math.cbrt(b)), 4)} - ${c}`; }
        if (vorm === 'pi') { tex = `\\pi \\cdot \\sqrt{${a}} + \\sqrt{${b}}`; exact = Math.PI * Math.sqrt(a) + Math.sqrt(b); benad = r4(Math.PI) * r4(Math.sqrt(a)) + r4(Math.sqrt(b)); tus = `${tg(r4(Math.PI), 4)} \\cdot ${tg(r4(Math.sqrt(a)), 4)} + ${tg(r4(Math.sqrt(b)), 4)}`; }
        if (!zekerRond(exact, 2) || W.rond(exact, 2) !== W.rond(benad, 2)) return null;
        return { soort: 'lang', opdracht: 'Bereken op 2 decimalen. Noteer de tussenresultaten (op je kladblad) met 4 decimalen.', tex, antw: getal(exact, 2, { voor: '\\approx' }),
          uitleg: [`\\text{tussenresultaten met 4 decimalen: } ${tus}`, `= ${afgekapt(benad, 4)} \\approx ${tg(exact, 2)}`] };
      });
    } },
  },
  oefenMix: [['derde', 1], ['tussen', 2], ['splits', 2], ['lang', 2]],
  test: [['derde', 2], ['tussen', 2], ['splits', 3], ['lang', 3]],
};

// ---------------------------------------------------------------
// 3. Bewerkingen in ℝ zonder rekenmachine +
// ---------------------------------------------------------------
const somTex = (ts) => ts.map((t, i) => i === 0 ? t : t.startsWith('-') ? `- ${t.slice(1)}` : `+ ${t}`).join(' ');
const D3 = {
  nr: 3, titel: 'Bewerkingen in ℝ zonder rekenmachine +', kort: 'Grote getallen vereenvoudigen, producten die je nog vereenvoudigt, drie termen, noemers met een te grote wortel.', rekenmachine: false,
  opdracht: 'Vereenvoudig.',
  theorie: theorieVan(3, `<p><b>Een getal vóór de wortel</b> vermenigvuldig je mee: $3\\sqrt{72} = 3 \\cdot 6\\sqrt{2} = 18\\sqrt{2}$.</p>
      <p><b>Na het vermenigvuldigen nog vereenvoudigen</b>: $3\\sqrt{6} \\cdot 2\\sqrt{15} = 6\\sqrt{90} = 6 \\cdot 3\\sqrt{10} = 18\\sqrt{10}$ &nbsp;·&nbsp; $(2\\sqrt{3})^2 = 4 \\cdot 3 = 12$</p>
      <p><b>Delen</b> gaat net als vermenigvuldigen: getallen met getallen, wortels met wortels: $12\\sqrt{30} : 4\\sqrt{5} = 3\\sqrt{6}$.</p>
      <p><b>Drie termen</b>: vereenvoudig elke wortel: $2\\sqrt{8} - 3\\sqrt{18} + \\sqrt{50} = 4\\sqrt{2} - 9\\sqrt{2} + 5\\sqrt{2} = 0$.</p>
      <p><b>Wortel in de noemer die je eerst vereenvoudigt</b>: $\\dfrac{6}{\\sqrt{12}} = \\dfrac{6}{2\\sqrt{3}} = \\dfrac{6\\sqrt{3}}{6} = \\sqrt{3}$.</p>
`),
  voorbeelden: [
    { tex: '-2\\sqrt{75}', stappen: ['= -2 \\cdot 5\\sqrt{3}', '= -10\\sqrt{3}'] },
    { tex: '\\sqrt{12} + \\sqrt{27} - \\sqrt{75}', stappen: ['= 2\\sqrt{3} + 3\\sqrt{3} - 5\\sqrt{3}', '= 0'] },
    { tex: '10\\sqrt{42} : 5\\sqrt{6}', stappen: ['= (10 : 5) \\cdot \\sqrt{42 : 6}', '= 2\\sqrt{7}'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Vereenvoudigen (grote getallen, getal vóór de wortel)', gen() {
      return tot(() => { const k = rnd(2, 12), m = kies(KW), c = kies([1, 1, 2, 3, -2, -3, 4]), N = k * k * m; if (N > 600) return null;
        return { soort: 'vereenvoudig', tex: `${coefTex(c)}\\sqrt{${N}}`, antw: expr(wE(c * k, m), ['vereenvoudigd']),
          uitleg: [`${N} = ${k * k} \\cdot ${m}`, c === 1 ? `\\sqrt{${N}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${wTex(k, m)}` : `${coefTex(c)}\\sqrt{${N}} = ${tg(c)} \\cdot ${wTex(k, m)} = ${wTex(c * k, m)}`] }; });
    } },
    vermenigvuldig: { naam: 'Vermenigvuldigen en nog vereenvoudigen', gen() {
      return tot(() => {
        const v = rnd(0, 3);
        if (v === 0) { const p = rnd(2, 6), a = kies(KW); return { soort: 'vermenigvuldig', tex: `(${p}\\sqrt{${a}})^2`, antw: expr(String(p * p * a), ['vereenvoudigd']), uitleg: [`= ${p}^2 \\cdot (\\sqrt{${a}})^2 = ${p * p} \\cdot ${a}`, `= ${p * p * a}`] }; }
        if (v === 1) { const a = kies([2, 3, 5, 6, 10, 15, 14, 21]), b = kies([3, 5, 6, 10, 15, 14, 21, 35]); const { k, m } = haalUit(a * b); if (k === 1 || m === 1 || a === b) return null; const p = rnd(2, 5), q = rnd(2, 5);
          return { soort: 'vermenigvuldig', tex: `${p}\\sqrt{${a}} \\cdot ${q}\\sqrt{${b}}`, antw: expr(wE(p * q * k, m), ['vereenvoudigd']), uitleg: [`= ${p * q}\\sqrt{${a * b}}`, `= ${p * q} \\cdot ${wTex(k, m)} = ${wTex(p * q * k, m)}`] }; }
        if (v === 2) { const a = kies(KW), b = kies(KW.filter(x => x !== a && haalUit(x * a).k === 1)), q = rnd(2, 5), p = q * rnd(2, 6) * (Math.random() < 0.3 ? -1 : 1);
          return { soort: 'vermenigvuldig', tex: `${p}\\sqrt{${a * b}} : ${q}\\sqrt{${a}}`, antw: expr(wE(p / q, b), ['vereenvoudigd']), uitleg: [`= (${tg(p)} : ${q}) \\cdot \\sqrt{${a * b} : ${a}}`, `= ${wTex(p / q, b)}`] }; }
        const a = kies([2, 3, 5, 6]), b = kies([2, 3, 6, 10]), c = kies([3, 5, 6, 15]); const { k, m } = haalUit(a * b * c); if (k === 1) return null;
        return { soort: 'vermenigvuldig', tex: `\\sqrt{${a}} \\cdot \\sqrt{${b}} \\cdot \\sqrt{${c}}`, antw: expr(wE(k, m), ['vereenvoudigd']), uitleg: [`= \\sqrt{${a * b * c}}`, `= ${wTex(k, m)}`] };
      });
    } },
    optellen: { naam: 'Drie termen: eerst vereenvoudigen', gen() {
      return tot(() => {
        const m = kies([2, 3, 5, 6, 7]), ks = [rnd(1, 6), rnd(1, 6), rnd(1, 6)], cs = [kies([1, 1, 2, 3]), kies([1, 2, 3]), kies([1, 1, 2])], sg = [1, kies([1, -1]), kies([1, -1])];
        if (ks.some(k => k * k * m > 300) || ks.filter(k => k > 1).length < 2) return null;
        const termen = ks.map((k, i) => `${sg[i] * cs[i] === 1 ? '' : sg[i] * cs[i] === -1 ? '-' : sg[i] * cs[i]}\\sqrt{${k * k * m}}`), vereenv = ks.map((k, i) => sg[i] * cs[i] * k);
        const som = vereenv.reduce((s, x) => s + x, 0);
        return { soort: 'optellen', opdracht: 'Vereenvoudig eerst en tel dan op of trek af.', tex: somTex(termen), antw: expr(wE(som, m), ['vereenvoudigd']),
          uitleg: [`= ${somTex(vereenv.map(c => wTex(c, m)))}`, `= ${wTex(som, m)}`] };
      });
    } },
    wortelvrij: { naam: 'Noemer wortelvrij maken (eerst vereenvoudigen)', gen() {
      return tot(() => {
        const b = kies(KW), k = rnd(2, 5), N = k * k * b, a = rnd(1, 30); if (N > 200) return null;
        // a / √N = a / (k√b) = a√b / (k·b)
        const g = ggd(a, k * b), p = a / g, q = k * b / g;
        const ant = q === 1 ? wE(p, b) : `${p === 1 ? '' : p}√(${b})/${q}`, at = q === 1 ? wTex(p, b) : `\\dfrac{${coefTex(p)}\\sqrt{${b}}}{${q}}`;
        return { soort: 'wortelvrij', opdracht: 'Maak de noemer wortelvrij. Vereenvoudig eerst de wortel in de noemer.', tex: `\\dfrac{${a}}{\\sqrt{${N}}}`, antw: expr(ant, ['wortelvrij'], { tex: at }),
          uitleg: [`= \\dfrac{${a}}{${k}\\sqrt{${b}}}`, `= \\dfrac{${a} \\cdot \\sqrt{${b}}}{${k}\\sqrt{${b}} \\cdot \\sqrt{${b}}} = \\dfrac{${coefTex(a)}\\sqrt{${b}}}{${k * b}}`, ...(g > 1 ? [`= ${at}`] : [])] };
      });
    } },
  },
  oefenMix: [['vereenvoudig', 2], ['vermenigvuldig', 2], ['optellen', 2], ['wortelvrij', 2]],
  test: [['vereenvoudig', 2], ['vermenigvuldig', 3], ['optellen', 3], ['wortelvrij', 2]],
};

// ---------------------------------------------------------------
// 4. Intervallen en halfrechten +
// ---------------------------------------------------------------
const halfOfHeel = () => Math.random() < 0.6 ? rnd(-8, 8) + 0.5 : rnd(-8, 8);
function intervalPlus(begrensd = null) {
  const soort = begrensd === true ? 'begrensd' : begrensd === false ? kies(['rechts', 'links']) : kies(['begrensd', 'begrensd', 'rechts', 'links']);
  if (soort === 'begrensd') { let a, b; do { a = halfOfHeel(); b = halfOfHeel(); } while (b - a < 2 || b - a > 9); return { a, ai: Math.random() < 0.5, b, bi: Math.random() < 0.5 }; }
  const n = halfOfHeel();
  return soort === 'rechts' ? { a: n, ai: Math.random() < 0.5, b: null, bi: false } : { a: null, ai: false, b: n, bi: Math.random() < 0.5 };
}
const gehelenIn = (r) => { const lo = Number.isInteger(r.a) ? (r.ai ? r.a : r.a + 1) : Math.ceil(r.a), hi = Number.isInteger(r.b) ? (r.bi ? r.b : r.b - 1) : Math.floor(r.b); return { lo, hi, n: Math.max(0, hi - lo + 1) }; };
const D4 = {
  nr: 4, titel: 'Intervallen en halfrechten +', kort: 'Ongelijkheden in omgekeerde volgorde, gehele getallen in een interval, wortels in een interval.', rekenmachine: false,
  opdracht: 'Schrijf als interval.',
  theorie: theorieVan(4, `<p><b>Omgekeerde volgorde</b>: lees de ongelijkheid eerst opnieuw van klein naar groot. $5 > x \\geq -2$ betekent $-2 \\leq x < 5$, dus $[-2\\,;\\,5[$. &nbsp; $3 \\leq x$ betekent $x \\geq 3$.</p>
      <p><b>Gehele getallen in een interval</b>: $]-3{,}5\\,;\\,2]$ bevat $-3, -2, -1, 0, 1, 2$: dat zijn er $6$. Bij $]-3\\,;\\,2[$ horen $-3$ en $2$ er <b>niet</b> bij: $-2, -1, 0, 1$.</p>
      <p><b>Een wortel in een interval</b>: vergelijk met kwadraten. $9 < 10 < 16$, dus $3 < \\sqrt{10} < 4$ en $\\sqrt{10} \\in\\, ]3\\,;\\,4[$.</p>`),
  voorbeelden: [
    { tex: '4 \\geq x > -1{,}5', stappen: ['-1{,}5 < x \\leq 4', ']-1{,}5\\,;\\,4]'] },
    { tex: '\\text{Kleinste geheel getal in } ]-2{,}5\\,;\\,+\\infty[', stappen: ['-2{,}5 \\text{ hoort er niet bij, het volgende geheel getal is } -2', '-2'] },
    { tex: '\\sqrt{30} \\in [5\\,;\\,6[\\,?', stappen: ['25 < 30 < 36', '5 < \\sqrt{30} < 6', '\\text{ja}'] },
  ],
  soorten: {
    omgekeerd: { naam: 'Ongelijkheid in omgekeerde volgorde → interval', gen() {
      const r = intervalPlus();
      let tex;
      if (r.a !== null && r.b !== null) tex = `${tg(r.b)} ${r.bi ? '\\geq' : '>'} x ${r.ai ? '\\geq' : '>'} ${tg(r.a)}`;
      else if (r.b === null) tex = `${tg(r.a)} ${r.ai ? '\\leq' : '<'} x`;
      else tex = `${tg(r.b)} ${r.bi ? '\\geq' : '>'} x`;
      return { soort: 'omgekeerd', opdracht: 'Schrijf als interval.', tex, antw: ivOpg(r), uitleg: [`\\text{van klein naar groot: } ${ogTex(r)}`, ivTex(r)] };
    } },
    gehelen: { naam: 'Hoeveel gehele getallen?', gen() {
      return tot(() => { const r = intervalPlus(true), g = gehelenIn(r); if (g.n < 1) return null;
        return { soort: 'gehelen', opdracht: 'Hoeveel gehele getallen horen bij het interval?', tex: ivTex(r), antw: getal(g.n),
          uitleg: [`\\text{van } ${tg(g.lo)} \\text{ tot en met } ${tg(g.hi)}`, `${tg(g.hi)} - ${h(g.lo)} + 1 = ${g.n}`] }; });
    } },
    kleinste: { naam: 'Kleinste of grootste geheel getal', gen() {
      const r = intervalPlus(false), g = gehelenIn({ a: r.a === null ? -1e6 : r.a, ai: r.ai, b: r.b === null ? 1e6 : r.b, bi: r.bi });
      const klein = r.a !== null, w = klein ? g.lo : g.hi, grens = klein ? r.a : r.b, erbij = klein ? r.ai : r.bi;
      return { soort: 'kleinste', opdracht: `Wat is het ${klein ? 'kleinste' : 'grootste'} gehele getal in het interval?`, tex: ivTex(r), antw: getal(w),
        uitleg: [`${tg(grens)} ${Number.isInteger(grens) ? (erbij ? '\\text{ hoort erbij}' : '\\text{ hoort er niet bij}') : '\\text{ is geen geheel getal}'}`, `\\text{${klein ? 'kleinste' : 'grootste'}: } ${tg(w)}`] };
    } },
    wortel: { naam: 'Hoort de wortel bij het interval?', gen() {
      return tot(() => {
        const n = rnd(2, 99), w = Math.sqrt(n), g = Math.floor(w), kw = isKwadraat(n);
        let r; const v = rnd(0, 3);
        if (v === 0) r = { a: g, ai: kies([true, false]), b: g + 1, bi: kies([true, false]) };
        else if (v === 1) r = { a: g + 1, ai: kies([true, false]), b: g + rnd(2, 4), bi: true };
        else if (v === 2) r = kw ? { a: w, ai: kies([true, false]), b: w + 2, bi: true } : { a: g - 2, ai: true, b: g, bi: kies([true, false]) };
        else r = { a: null, ai: false, b: g + (kw ? 0 : 1), bi: kies([true, false]) };
        const ja = (r.a === null || w > r.a + 1e-12 || (r.ai && Math.abs(w - r.a) < 1e-12)) && (r.b === null || w < r.b - 1e-12 || (r.bi && Math.abs(w - r.b) < 1e-12));
        return { soort: 'wortel', opdracht: 'Hoort het getal bij het interval? Vergelijk met kwadraten.', tex: `\\sqrt{${n}} \\;\\in\\; ${ivTex(r)} \\;?`, antw: keuze(JANEE, ja ? 'ja' : 'nee'),
          uitleg: [kw ? `\\sqrt{${n}} = ${w}` : `${g * g} < ${n} < ${(g + 1) ** 2} \\Rightarrow ${g} < \\sqrt{${n}} < ${g + 1}`, `\\text{${ja ? 'ja' : 'nee'}}`] };
      });
    } },
    leesaf: { naam: 'Lees af (ook halve getallen)', gen() {
      const r = intervalPlus(); [r.a, r.b] = [r.a === null ? null : Math.max(-4.5, Math.min(5.5, r.a)), r.b === null ? null : Math.max(-4.5, Math.min(5.5, r.b))];
      if (r.a !== null && r.b !== null && r.b - r.a < 1) return this.gen();
      return { soort: 'leesaf', opdracht: 'Lees af. Schrijf als interval en als ongelijkheid. (De kleine streepjes staan bij de halve getallen.)', html: `<div class="figuur">${getallenas(r, -5, 6)}</div>`, sleutel: 'as' + ivTex(r), rapport: 'getallenas: ' + ivTekst(r),
        antw: { soort: 'delen', delen: [{ label: '\\text{interval}', antw: ivOpg(r) }, { label: '\\text{ongelijkheid}', antw: ogOpg(r) }] }, uitleg: [ivTex(r), ogTex(r)] };
    } },
  },
  oefenMix: [['omgekeerd', 2], ['gehelen', 2], ['kleinste', 1], ['wortel', 2], ['leesaf', 1]],
  test: [['omgekeerd', 2], ['gehelen', 2], ['kleinste', 2], ['wortel', 2], ['leesaf', 2]],
};

// ---------------------------------------------------------------
// 5. Machten met rationale exponenten +
// ---------------------------------------------------------------
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const wortelE = (n, x) => (n === 2 ? '√' : n === 3 ? '∛' : n === 4 ? '∜' : String(n).split('').map(c => SUPS[+c]).join('') + '√') + `(${x})`;
const wortelT = (n, x) => n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`;
const frT = (p, q) => `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
const machtT = (a, p, q) => q === 1 ? `${a}^{${p}}` : `${a}^{${frT(p, q)}}`;
const red = (p, q) => { const g = ggd(p, q) || 1; return [p / g, q / g]; };
const D5 = {
  nr: 5, titel: 'Machten met rationale exponenten +', kort: 'Drie machten tot één macht, een wortel in een wortel, wortels met een verschillende wortelexponent.', rekenmachine: true,
  opdracht: 'Schrijf als één macht en reken uit.',
  theorie: theorieVan(5, `<p><b>Drie machten</b>: tel op en trek af in één keer, met gelijknamige breuken: $2^{\\frac{1}{2}} \\cdot 2^{\\frac{2}{3}} : 2^{\\frac{1}{6}} = 2^{\\frac{3}{6} + \\frac{4}{6} - \\frac{1}{6}} = 2^{1} = 2$</p>
      <p><b>Een wortel in een wortel</b>: schrijf elke wortel als macht. $\\sqrt{\\sqrt[3]{5}} = \\left(5^{\\frac{1}{3}}\\right)^{\\frac{1}{2}} = 5^{\\frac{1}{6}} = \\sqrt[6]{5}$</p>
      <p><b>Verschillende wortelexponenten</b>: $\\sqrt{7} \\cdot \\sqrt[3]{7} = 7^{\\frac{1}{2} + \\frac{1}{3}} = 7^{\\frac{5}{6}} = \\sqrt[6]{7^5}$</p>`),
  voorbeelden: [
    { tex: '\\sqrt[3]{\\sqrt{3^4}}', stappen: ['= \\left(3^{\\frac{4}{2}}\\right)^{\\frac{1}{3}} = 3^{\\frac{4}{6}}', '= 3^{\\frac{2}{3}} = \\sqrt[3]{3^2}'] },
    { tex: '\\sqrt[3]{5^2} : \\sqrt{5}', stappen: ['= 5^{\\frac{2}{3} - \\frac{1}{2}} = 5^{\\frac{4}{6} - \\frac{3}{6}}', '= 5^{\\frac{1}{6}} = \\sqrt[6]{5}'] },
  ],
  soorten: {
    drie: { naam: 'Drie machten tot één macht', gen() {
      return tot(() => {
        const a = kies([2, 3, 5, 6, 7]), q = [kies([2, 3, 4, 6]), kies([2, 3, 4, 6]), kies([2, 3, 4, 6])], p = q.map(n => rnd(1, n + 2)), ops = [kies(['\\cdot', ':']), kies(['\\cdot', ':'])];
        if (p.some((x, i) => x % q[i] === 0)) return null;
        const L = q.reduce((m, x) => kgv(m, x), 1); let P = p[0] * L / q[0];
        P += (ops[0] === ':' ? -1 : 1) * p[1] * L / q[1]; P += (ops[1] === ':' ? -1 : 1) * p[2] * L / q[2];
        const [pp, qq] = red(P, L); if (pp <= 0) return null;
        const w = a ** (pp / qq); if (w > 20000 || (qq > 1 && !zekerRond(w, 4))) return null;
        const tex = `${machtT(a, p[0], q[0])} ${ops[0]} ${machtT(a, p[1], q[1])} ${ops[1]} ${machtT(a, p[2], q[2])}`;
        const expS = `${frT(p[0] * L / q[0], L)} ${ops[0] === ':' ? '-' : '+'} ${frT(p[1] * L / q[1], L)} ${ops[1] === ':' ? '-' : '+'} ${frT(p[2] * L / q[2], L)}`;
        const res = qq === 1 ? `${a}^{${pp}}` : machtT(a, pp, qq);
        return { soort: 'drie', opdracht: 'Schrijf als één macht en reken uit. Rond af op 4 decimalen waar nodig.', tex,
          antw: { soort: 'delen', delen: [{ label: '\\text{als één macht}', antw: expr(`${a}^(${pp}/${qq})`, ['een_macht'], { tex: res, voor: '=' }) }, { label: '\\text{uitkomst}', antw: getal(w, 4, { voor: qq === 1 ? '=' : '\\approx' }) }] },
          uitleg: [`= ${a}^{${expS}}`, `= ${res} ${qq === 1 ? '=' : '\\approx'} ${qq === 1 ? w : tg(w, 4)}`] };
      });
    } },
    nest: { naam: 'Een wortel in een wortel', gen() {
      return tot(() => {
        const a = kies([2, 3, 5, 6, 7, 10]), n1 = kies([2, 3]), n2 = kies([2, 3, 4]), m = rnd(1, 5); if ((n1 === 2 && n2 === 2 && Math.random() < 0.6) || m % n2 === 0) return null;
        const [p, q] = red(m, n1 * n2); if (q === 1 || p > 7) return null;
        const binnen = wortelT(n2, m === 1 ? `${a}` : `${a}^{${m}}`), tex = wortelT(n1, binnen);
        const at = wortelT(q, p === 1 ? `${a}` : `${a}^{${p}}`), ant = wortelE(q, p === 1 ? `${a}` : `${a}^${p}`);
        return { soort: 'nest', opdracht: 'Schrijf als één wortel (zonder wortel in de wortel). Vereenvoudig de exponent.', tex, antw: expr(ant, ['wortel' + q], { tex: at, toetsen: ['wortel'] }),
          uitleg: [`= \\left(${machtT(a, m, n2)}\\right)^{\\frac{1}{${n1}}} = ${machtT(a, m, n1 * n2)}`, ...(p !== m ? [`= ${machtT(a, p, q)}`] : []), `= ${at}`] };
      });
    } },
    verschillend: { naam: 'Wortels met een verschillende wortelexponent', gen() {
      return tot(() => {
        const a = kies([2, 3, 5, 6, 7]), n1 = kies([2, 3, 4]), n2 = kies([2, 3, 4, 5]), m1 = rnd(1, 3), m2 = rnd(1, 3), deel = Math.random() < 0.4; if (n1 === n2) return null;
        const L = kgv(n1, n2), P = m1 * L / n1 + (deel ? -1 : 1) * m2 * L / n2; const [p, q] = red(P, L); if (p <= 0 || q === 1 || p > 11 || q > 12) return null;
        const t1 = wortelT(n1, m1 === 1 ? `${a}` : `${a}^{${m1}}`), t2 = wortelT(n2, m2 === 1 ? `${a}` : `${a}^{${m2}}`);
        const at = wortelT(q, p === 1 ? `${a}` : `${a}^{${p}}`), ant = wortelE(q, p === 1 ? `${a}` : `${a}^${p}`);
        return { soort: 'verschillend', opdracht: 'Schrijf als één wortel. Werk via machten.', tex: `${t1} ${deel ? ':' : '\\cdot'} ${t2}`, antw: expr(ant, ['wortel' + q], { tex: at, toetsen: ['wortel'] }),
          uitleg: [`= ${machtT(a, m1, n1)} ${deel ? ':' : '\\cdot'} ${machtT(a, m2, n2)}`, `= ${a}^{${frT(m1 * L / n1, L)} ${deel ? '-' : '+'} ${frT(m2 * L / n2, L)}} = ${machtT(a, p, q)}`, `= ${at}`] };
      });
    } },
    rekenmachine: { naam: 'Reken uit met de rekenmachine (kommagetallen)', gen() {
      return tot(() => {
        const a = kies([1.5, 2.5, 0.8, 1.2, 3.5, 0.5, 4.5]), q = rnd(2, 7), [p, qq] = red(rnd(1, 9), q); if (qq === 1) return null;
        const c = Math.random() < 0.4 ? rnd(2, 12) : 1, w = c * a ** (p / qq); if (!zekerRond(w, 4)) return null;
        const tex = `${c > 1 ? c + ' \\cdot ' : ''}${tg(a)}^{${frT(p, qq)}}`;
        return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Rond af op 4 decimalen.', tex, antw: getal(w, 4, { voor: '\\approx' }),
          uitleg: [`= ${c > 1 ? c + ' \\cdot ' : ''}${wortelT(qq, p === 1 ? tg(a) : `${tg(a)}^{${p}}`)}`, `\\approx ${tg(w, 4)}`] };
      });
    } },
  },
  oefenMix: [['drie', 2], ['nest', 2], ['verschillend', 2], ['rekenmachine', 1]],
  test: [['drie', 3], ['nest', 3], ['verschillend', 2], ['rekenmachine', 2]],
};

// ---------------------------------------------------------------
// 6. De logaritme +
// ---------------------------------------------------------------
const logT = (a, r) => a === 10 ? `\\log ${r}` : `\\log_{${a}} ${r}`;
// [grondtal, getal (TeX), exponent als breuk [p, q], uitleg]
const LOGFR = [
  () => { const a = kies([2, 3, 5, 7, 10]), n = kies([2, 3]), m = rnd(1, n + 2); if (m % n === 0) return null; const [p, q] = red(m, n);
    return [a, wortelT(n, m === 1 ? a : `${a}^{${m}}`), [p, q], `${wortelT(n, m === 1 ? a : `${a}^{${m}}`)} = ${machtT(a, m, n)}`]; },
  () => { const a = kies([2, 3, 5, 10]), n = kies([2, 3]); return [a, `\\left(\\dfrac{1}{${wortelT(n, a)}}\\right)`, [-1, n], `\\dfrac{1}{${wortelT(n, a)}} = ${a}^{-\\frac{1}{${n}}}`]; },
  () => { const a = kies([2, 3, 5]), k = rnd(1, 3); return [a, `${a ** k}\\sqrt{${a}}`, [2 * k + 1, 2], `${a ** k}\\sqrt{${a}} = ${a}^{${k}} \\cdot ${a}^{\\frac{1}{2}} = ${machtT(a, 2 * k + 1, 2)}`]; },
  () => { const [a, r, p, q, b] = kies([[4, 8, 3, 2, 2], [8, 2, 1, 3, 2], [8, 4, 2, 3, 2], [9, 27, 3, 2, 3], [27, 9, 2, 3, 3], [4, 32, 5, 2, 2], [16, 8, 3, 4, 2], [25, 125, 3, 2, 5], [16, 2, 1, 4, 2], [27, 3, 1, 3, 3], [4, 2, 1, 2, 2], [9, 3, 1, 2, 3]]);
    const ea = Math.round(Math.log(a) / Math.log(b)), er = Math.round(Math.log(r) / Math.log(b));
    return [a, String(r), [p, q], `${a} = ${b}^{${ea}} \\text{ en } ${r} = ${b}^{${er}}, \\text{ dus } ${a}^{${frT(p, q)}} = ${b}^{${ea} \\cdot ${frT(p, q)}} = ${b}^{${er}} = ${r}`]; },
  () => { const k = rnd(1, 3), n = kies([2, 3]); return [10, `${wortelT(n, `10^{${k}}`)}`, red(k, n), `${wortelT(n, `10^{${k}}`)} = ${machtT(10, k, n)}`]; },
];
const D6 = {
  nr: 6, titel: 'De logaritme +', kort: 'Logaritmen met een breuk als uitkomst, macht ↔ logaritme met rationale exponenten, moeilijker schatten.', rekenmachine: true,
  opdracht: 'Bereken.',
  theorie: theorieVan(6, `<p><b>De uitkomst kan een breuk zijn.</b> Schrijf het getal als een macht van het grondtal, ook met een rationale exponent:</p>
      <p class="midden">$\\log_2 \\sqrt{2} = \\log_2 2^{\\frac{1}{2}} = \\frac{1}{2}$ &nbsp;·&nbsp; $\\log_3 \\sqrt[3]{9} = \\log_3 3^{\\frac{2}{3}} = \\frac{2}{3}$ &nbsp;·&nbsp; $\\log_5 \\dfrac{1}{\\sqrt{5}} = -\\frac{1}{2}$</p>
      <p><b>Grondtal en getal zijn machten van hetzelfde getal</b>: $\\log_4 8 = \\frac{3}{2}$ want $4 = 2^2$, $8 = 2^3$ en $4^{\\frac{3}{2}} = 2^{3} = 8$.</p>
      <p class="klein">Typ een breuk met een schuine streep: <code>3/2</code>, <code>-1/2</code>.</p>`),
  voorbeelden: [
    { tex: '\\log_9 27', stappen: ['9 = 3^2, \\; 27 = 3^3', '9^{\\frac{3}{2}} = 3^3 = 27', '\\log_9 27 = \\frac{3}{2}'] },
    { tex: '\\log_2 (4\\sqrt{2})', stappen: ['4\\sqrt{2} = 2^2 \\cdot 2^{\\frac{1}{2}} = 2^{\\frac{5}{2}}', '= \\frac{5}{2}'] },
  ],
  soorten: {
    bereken: { naam: 'Bereken (ook breuken als uitkomst)', gen() {
      const [a, r, [p, q], u] = tot(() => kies(LOGFR)());
      return { soort: 'bereken', opdracht: 'Bereken. Schrijf het getal als een macht van het grondtal. Geef een geheel getal of een breuk.', tex: logT(a, r), antw: breuk(p, q), uitleg: [u, `${logT(a, r)} = ${brTex(p, q)}`] };
    } },
    omzetten: { naam: 'Macht ↔ logaritme (rationale exponent)', gen() {
      return tot(() => {
        const [a, r, p, q] = kies([[8, 4, 2, 3], [4, 8, 3, 2], [9, 27, 3, 2], [27, 9, 2, 3], [16, 8, 3, 4], [25, 125, 3, 2], [8, 2, 1, 3], [4, 2, 1, 2], [32, 8, 3, 5], [16, 4, 1, 2], [81, 27, 3, 4], [64, 16, 2, 3]]);
        if (Math.random() < 0.5) return { soort: 'omzetten', opdracht: 'Schrijf de macht als logaritme.', tex: `${a}^{${frT(p, q)}} = ${r}`,
          antw: { soort: 'vakjes', sjabloon: [{ tex: '\\log' }, { veld: 0, sub: true }, { veld: 1 }, { tex: '=' }, { veld: 2 }], velden: [veldE(`${a}`), veldE(`${r}`), veldE(`${p}/${q}`)] },
          uitleg: ['a^n = r \\;\\Leftrightarrow\\; \\log_a r = n', `\\log_{${a}} ${r} = ${frT(p, q)}`] };
        return { soort: 'omzetten', opdracht: 'Schrijf de logaritme als macht.', tex: `${logT(a, r)} = ${frT(p, q)}`,
          antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { veld: 1, sup: true }, { tex: '=' }, { veld: 2 }], velden: [veldE(`${a}`), veldE(`${p}/${q}`), veldE(`${r}`)] },
          uitleg: ['\\log_a r = n \\;\\Leftrightarrow\\; a^n = r', `${a}^{${frT(p, q)}} = ${r}`] };
      });
    } },
    tussen: { naam: 'Schat intuïtief (getallen kleiner dan 1, andere grondtallen)', gen() {
      return tot(() => { const v = BD(6).soorten.tussen.gen(); return /0\{,\}|log_\{[345]\}/.test(v.tex) ? { ...v, soort: 'tussen' } : null; });
    } },
  },
  oefenMix: [['bereken', 3], ['omzetten', 2], ['tussen', 2]],
  test: [['bereken', 4], ['omzetten', 3], ['tussen', 3]],
};

// ---------------------------------------------------------------
// 7. Rekenregels met logaritmen +
// ---------------------------------------------------------------
const COMB_PLUS = [
  () => { // c·log b + log n − log p met b^c·n/p = a^k
    const a = kies([2, 3, 5, 10]), b = kies([2, 3, 4, 5, 6].filter(x => x !== a)), c = kies([2, 3]), k = rnd(1, 3), r = rnd(2, 5), n = a ** k * r, p = b ** c * r;
    if (n > 3000 || p > 3000 || n === p) return null;
    return { tex: `${c} \\cdot ${logT(a, b)} + ${logT(a, n)} - ${logT(a, p)}`, w: [k, 1], L: [`= ${logT(a, `${b}^{${c}}`)} + ${logT(a, n)} - ${logT(a, p)}`, `= ${logT(a, `\\left(\\frac{${b ** c} \\cdot ${n}}{${p}}\\right)`)} = ${logT(a, a ** k)} = ${k}`] };
  },
  () => { // p·log x + q·log y = k (grondtal 10)
    const [p, x, q, y, k] = kies([[2, 2, 2, 5, 2], [3, 2, 3, 5, 3], [1, 4, 2, 5, 2], [1, 8, 3, 5, 3], [2, 20, 1, 2.5, 3], [1, 50, 1, 2, 2], [2, 4, 2, 2.5, 2], [1, 25, 2, 2, 2], [3, 5, 1, 8, 3], [2, 5, 1, 4, 2]]);
    return { tex: `${p === 1 ? '' : p + ' \\cdot '}\\log ${tg(x)} + ${q === 1 ? '' : q + ' \\cdot '}\\log ${tg(y)}`, w: [k, 1], L: [`= \\log ${p === 1 ? tg(x) : `${tg(x)}^{${p}}`} + \\log ${q === 1 ? tg(y) : `${tg(y)}^{${q}}`}`, `= \\log (${tg(x ** p)} \\cdot ${tg(+(y ** q).toFixed(6))}) = \\log ${tg(10 ** k)} = ${k}`] };
  },
  () => { // log_a √(a^m) of ∛
    const a = kies([2, 3, 5, 10]), n = kies([2, 3]), m = rnd(1, 7); if (m % n === 0) return null; const [p, q] = red(m, n);
    return { tex: logT(a, wortelT(n, `${a}^{${m}}`)), w: [p, q], L: [`= ${logT(a, machtT(a, m, n))}`, `= ${frT(m, n)} \\cdot ${logT(a, a)} = ${brTex(p, q)}`] };
  },
  () => { // log m − c·log b met m = a^k·b^c
    const a = kies([2, 3, 10]), b = kies([2, 3, 5].filter(x => x !== a)), c = kies([2, 3]), k = rnd(1, 3), m = a ** k * b ** c; if (m > 5000) return null;
    return { tex: `${logT(a, m)} - ${c} \\cdot ${logT(a, b)}`, w: [k, 1], L: [`= ${logT(a, m)} - ${logT(a, `${b}^{${c}}`)}`, `= ${logT(a, `\\left(\\frac{${m}}{${b ** c}}\\right)`)} = ${logT(a, a ** k)} = ${k}`] };
  },
  () => { // ½·log a^(2k) + log (1/a)
    const a = kies([2, 3, 5]), k = a === 5 ? 2 : rnd(2, 3), w = k - 1;
    return { tex: `\\frac{1}{2} \\cdot ${logT(a, a ** (2 * k))} + ${logT(a, `\\left(\\frac{1}{${a}}\\right)`)}`, w: [w, 1], L: [`= \\frac{1}{2} \\cdot ${2 * k} + (-1)`, `= ${k} - 1 = ${w}`] };
  },
];
const D7 = {
  nr: 7, titel: 'Rekenregels met logaritmen +', kort: 'Rekenregels met coëfficiënten combineren, x in de exponent met een som of product.', rekenmachine: true,
  opdracht: 'Bereken met de rekenregels.',
  theorie: theorieVan(7, `<p><b>Een getal vóór de logaritme</b> breng je eerst als exponent naar binnen: $2 \\cdot \\log 5 = \\log 5^2 = \\log 25$. Daarna combineer je: $2 \\cdot \\log 5 + 2 \\cdot \\log 2 = \\log (25 \\cdot 4) = \\log 100 = 2$.</p>
      <p><b>x in een som in de exponent</b>: $2^{x + 3} = 64$ geeft $x + 3 = \\log_2 64 = 6$, dus $x = 3$. &nbsp; $3^{2x} = 81$ geeft $2x = 4$, dus $x = 2$.</p>
      <p><b>Eerst de macht alleen</b>: $5 \\cdot 2^x = 40$ geeft $2^x = 8$, dus $x = 3$.</p>`),
  voorbeelden: [
    { tex: '3 \\cdot \\log_2 4 + \\log_2 12 - \\log_2 48', stappen: ['= \\log_2 4^3 + \\log_2 12 - \\log_2 48', '= \\log_2 \\left(\\frac{64 \\cdot 12}{48}\\right) = \\log_2 16 = 4'] },
    { tex: '3^{x - 1} = 50', stappen: ['x - 1 = \\log_3 50 \\approx 3{,}561', 'x \\approx 4{,}561 \\approx 4{,}6'] },
  ],
  soorten: {
    combineer: { naam: 'Rekenregels met coëfficiënten combineren', gen() {
      const r = tot(() => kies(COMB_PLUS)());
      return { soort: 'combineer', opdracht: 'Combineer de rekenregels. Geef een geheel getal of een breuk.', tex: r.tex, antw: breuk(r.w[0], r.w[1]), uitleg: r.L };
    } },
    berekenx: { naam: 'Bereken x (som of product in de exponent)', gen() {
      return tot(() => {
        const a = kies([2, 3, 5]), v = rnd(0, 3), o = 'Bereken x. Rond af op 1 decimaal waar nodig.';
        if (v === 0) { const n = rnd(2, a === 2 ? 8 : 4), p = nz(-4, 4), x = n - p; return { soort: 'berekenx', opdracht: o, tex: `${a}^{x ${p < 0 ? '-' : '+'} ${Math.abs(p)}} = ${a ** n}`, antw: getal(x, 1, { voor: 'x =' }),
          uitleg: [`x ${p < 0 ? '-' : '+'} ${Math.abs(p)} = ${logT(a, a ** n)} = ${n}`, `x = ${x}`] }; }
        if (v === 1) { const c = kies([2, 3]), n = rnd(2, a === 2 ? 8 : 4); const [pp, qq] = red(n, c);
          return { soort: 'berekenx', opdracht: 'Bereken x. Geef een geheel getal of een breuk.', tex: `${a}^{${c}x} = ${a ** n}`, antw: breuk(n, c, { voor: 'x =' }), uitleg: [`${c}x = ${logT(a, a ** n)} = ${n}`, `x = ${brTex(pp, qq)}`] }; }
        if (v === 2) { const c = rnd(2, 9), n = rnd(1, a === 2 ? 7 : 4); return { soort: 'berekenx', opdracht: o, tex: `${c} \\cdot ${a}^x = ${c * a ** n}`, antw: getal(n, 1, { voor: 'x =' }),
          uitleg: [`${a}^x = ${c * a ** n} : ${c} = ${a ** n}`, `x = ${logT(a, a ** n)} = ${n}`] }; }
        const g = rnd(5, 300), p = rnd(1, 4); if (Number.isInteger(+(Math.log(g) / Math.log(a)).toFixed(9))) return null; const x = Math.log(g) / Math.log(a) + p; if (!zekerRond(x, 1)) return null;
        return { soort: 'berekenx', opdracht: o, tex: `${a}^{x - ${p}} = ${g}`, antw: getal(x, 1, { voor: 'x \\approx' }), uitleg: [`x - ${p} = ${logT(a, g)} \\approx ${tg(x - p, 3)}`, `x \\approx ${tg(x, 3)} \\approx ${tg(x, 1)}`] };
      });
    } },
  },
  oefenMix: [['combineer', 3], ['berekenx', 3]],
  test: [['combineer', 5], ['berekenx', 5]],
};

// ---------------------------------------------------------------
// 8. De stelling van Pythagoras +
// ---------------------------------------------------------------
const sq = (x) => `${h(x)}^2`;
const DRIETALLEN = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10], [9, 12, 15]];
const D8 = {
  nr: 8, titel: 'De stelling van Pythagoras +', kort: 'Vraagstukken in twee stappen, de omgekeerde stelling met wortels en kommagetallen, rechthoekig in een rooster.', rekenmachine: true,
  opdracht: 'Afspraak: a is de schuine zijde, b en c zijn de rechthoekszijden. Rond af op 2 decimalen waar nodig.',
  theorie: theorieVan(8, `<p><b>Twee stappen</b>: soms heb je eerst een andere zijde nodig. De <b>lichaamsdiagonaal</b> van een balk ($l$, $b$, $h$): eerst de diagonaal van het grondvlak $d = \\sqrt{l^2 + b^2}$, dan $D = \\sqrt{d^2 + h^2}$.</p>
      <p><b>Ruit</b>: de diagonalen snijden elkaar loodrecht middendoor: zijde $= \\sqrt{\\left(\\frac{e}{2}\\right)^2 + \\left(\\frac{f}{2}\\right)^2}$. &nbsp; <b>Gelijkzijdige driehoek</b>: hoogte $= \\sqrt{z^2 - \\left(\\frac{z}{2}\\right)^2}$.</p>
      <p><b>Omgekeerde stelling met wortels</b>: $\\sqrt{5}$, $\\sqrt{11}$ en $4$: &nbsp; $(\\sqrt{5})^2 + (\\sqrt{11})^2 = 5 + 11 = 16 = 4^2$ → rechthoekig.</p>
      <p><b>In een rooster</b>: bereken de kwadraten van de drie afstanden en gebruik de omgekeerde stelling.</p>`),
  voorbeelden: [
    { html: 'Een balk is 4 cm lang, 3 cm breed en 12 cm hoog. Hoe lang is de lichaamsdiagonaal?', stappen: ['d = \\sqrt{4^2 + 3^2} = \\sqrt{25} = 5', 'D = \\sqrt{5^2 + 12^2} = \\sqrt{169} = 13', '\\text{Antwoord: } 13 \\text{ cm}'] },
    { tex: 'A(1, 1),\\ B(4, 2),\\ C(2, 4) \\text{ rechthoekig?}', stappen: ['AB^2 = 9 + 1 = 10,\\ AC^2 = 1 + 9 = 10,\\ BC^2 = 4 + 4 = 8', '10 + 8 \\neq 10, \\; 10 + 10 \\neq 8', '\\text{nee}'] },
  ],
  soorten: {
    vraagstuk: { naam: 'Vraagstukken in twee stappen', gen() {
      return tot(() => {
        const t = kies(['balk', 'ruit', 'gelijkzijdig', 'ladder', 'trapezium', 'kubus']);
        let zin, w, na = '\\text{cm}', uit;
        if (t === 'balk') { const l = rnd(3, 15), b = rnd(2, 12), hh = rnd(2, 20), d2 = l * l + b * b; w = Math.sqrt(d2 + hh * hh);
          zin = `Een balk is ${l} cm lang, ${b} cm breed en ${hh} cm hoog. Hoe lang is de lichaamsdiagonaal?`;
          uit = [`\\text{diagonaal grondvlak: } d = \\sqrt{${l}^2 + ${b}^2} = \\sqrt{${d2}}`, `D = \\sqrt{d^2 + ${hh}^2} = \\sqrt{${d2} + ${hh * hh}} = \\sqrt{${d2 + hh * hh}} ${isGeheel(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'kubus') { const z = rnd(2, 15); w = z * Math.sqrt(3);
          zin = `Een kubus heeft ribben van ${z} cm. Hoe lang is de lichaamsdiagonaal?`;
          uit = [`d = \\sqrt{${z}^2 + ${z}^2} = \\sqrt{${2 * z * z}}`, `D = \\sqrt{${2 * z * z} + ${z * z}} = \\sqrt{${3 * z * z}} \\approx ${tg(w, 2)}`]; }
        if (t === 'ruit') { const e = rnd(3, 15) * 2, f = rnd(2, 12) * 2; w = Math.sqrt((e / 2) ** 2 + (f / 2) ** 2);
          zin = `De diagonalen van een ruit zijn ${e} cm en ${f} cm lang. Hoe lang is een zijde van de ruit?`;
          uit = [`\\text{de diagonalen delen elkaar middendoor: } ${e / 2} \\text{ en } ${f / 2}`, `z = \\sqrt{${e / 2}^2 + ${f / 2}^2} = \\sqrt{${(e / 2) ** 2 + (f / 2) ** 2}} ${isGeheel(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'gelijkzijdig') { const z = rnd(2, 20) * 2; w = Math.sqrt(z * z - (z / 2) ** 2);
          zin = `Een gelijkzijdige driehoek heeft zijden van ${z} cm. Hoe hoog is de driehoek?`;
          uit = [`\\text{de hoogte verdeelt een zijde in twee: } ${z / 2}`, `h = \\sqrt{${z}^2 - ${z / 2}^2} = \\sqrt{${z * z - (z / 2) ** 2}} \\approx ${tg(w, 2)}`]; }
        if (t === 'trapezium') { const b = rnd(4, 15), x = rnd(2, 6), B = b + 2 * x, s = x + rnd(1, 8); w = Math.sqrt(s * s - x * x);
          zin = `Een gelijkbenig trapezium heeft evenwijdige zijden van ${B} cm en ${b} cm. De opstaande zijden zijn ${s} cm lang. Hoe hoog is het trapezium?`;
          uit = [`\\text{aan elke kant steekt } (${B} - ${b}) : 2 = ${x} \\text{ uit}`, `h = \\sqrt{${s}^2 - ${x}^2} = \\sqrt{${s * s - x * x}} ${isGeheel(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'ladder') { const L = rnd(8, 14) / 2, v = rnd(2, 4) / 2, s = rnd(1, 3) / 2; if (v + s >= L - 0.5) return null; const h1 = Math.sqrt(L * L - v * v), h2 = Math.sqrt(L * L - (v + s) ** 2); w = h1 - h2; na = '\\text{m}';
          zin = `Een ladder van ${kg(L)} m staat tegen een muur, met de voet ${kg(v)} m van de muur. De voet schuift ${kg(s)} m verder van de muur weg. Hoeveel zakt de top van de ladder?`;
          uit = [`\\text{eerst: } h_1 = \\sqrt{${sq(L)} - ${sq(v)}} \\approx ${tg(h1, 4)}`, `\\text{daarna: } h_2 = \\sqrt{${sq(L)} - ${sq(v + s)}} \\approx ${tg(h2, 4)}`, `h_1 - h_2 \\approx ${tg(w, 2)}`]; }
        if (!isGeheel(w) && !zekerRond(w, 2)) return null;
        uit.push(`\\text{Antwoord: } ${tg(w, 2)}\\ ${na}`);
        return { soort: 'vraagstuk', opdracht: 'Maak een schets op je kladblad en bereken. Rond af op 2 decimalen.', html: `<div class="tekstopgave">${W.esc(zin)}</div>`, rapport: zin, sleutel: zin, antw: getal(w, 2, { voor: '', na }), uitleg: uit };
      });
    } },
    rechthoekig: { naam: 'Omgekeerde stelling met wortels en kommagetallen', gen() {
      return tot(() => {
        const v = rnd(0, 1), ja = Math.random() < 0.5;
        if (v === 0) { const p = rnd(2, 20), q = rnd(2, 30); let c = p + q; if (!ja) c += kies([-1, 1, 2]); if (isKwadraat(p) || isKwadraat(q) || c <= Math.max(p, q)) return null;
          const ct = isKwadraat(c) ? String(Math.sqrt(c)) : `\\sqrt{${c}}`;
          return { soort: 'rechthoekig', opdracht: 'Is de driehoek rechthoekig? Controleer met de omgekeerde stelling.', tex: `\\sqrt{${p}},\\ \\sqrt{${q}},\\ ${ct}`, antw: keuze(JANEE, p + q === c ? 'ja' : 'nee'),
            uitleg: [`(\\sqrt{${p}})^2 + (\\sqrt{${q}})^2 = ${p} + ${q} = ${p + q} \\qquad (${ct})^2 = ${c}`, p + q === c ? '\\text{gelijk: ja, rechthoekig}' : '\\text{niet gelijk: nee}'] }; }
        const [a, b, c] = kies(DRIETALLEN), f = kies([0.5, 0.1, 1.5, 0.2]); let z = [a * f, b * f, c * f].map(x => +x.toFixed(2)); if (!ja) z[rnd(0, 2)] = +(z[0] + 0.1 * kies([1, -1]) + (z[0] === z[1] ? 0.3 : 0)).toFixed(2), z = z;
        z.sort((x, y) => x - y); const s = +(z[0] ** 2 + z[1] ** 2).toFixed(4), c2 = +(z[2] ** 2).toFixed(4); if (z[0] + z[1] <= z[2] || new Set(z).size < 3) return null;
        return { soort: 'rechthoekig', opdracht: 'Is de driehoek rechthoekig? Controleer met de omgekeerde stelling.', tex: z.map(x => tg(x)).join(',\\ '), antw: keuze(JANEE, s === c2 ? 'ja' : 'nee'),
          uitleg: [`${sq(z[0])} + ${sq(z[1])} = ${tg(+(z[0] ** 2).toFixed(4))} + ${tg(+(z[1] ** 2).toFixed(4))} = ${tg(s)} \\qquad ${sq(z[2])} = ${tg(c2)}`, s === c2 ? '\\text{gelijk: ja, rechthoekig}' : '\\text{niet gelijk: nee}'] };
      });
    } },
    rooster: { naam: 'Is driehoek ABC rechthoekig? (afstandsformule)', gen() {
      return tot(() => {
        const A = [rnd(-5, 5), rnd(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], k = kies([1, 1, 2, -1]);
        const B = [A[0] + u[0], A[1] + u[1]], recht = Math.random() < 0.5, C = recht ? [A[0] - k * u[1], A[1] + k * u[0]] : [A[0] - k * u[1] + kies([1, -1]), A[1] + k * u[0]];
        if ([B, C].some(P => Math.abs(P[0]) > 6 || Math.abs(P[1]) > 6)) return null;
        const d2 = (P, Q) => (P[0] - Q[0]) ** 2 + (P[1] - Q[1]) ** 2, ab = d2(A, B), ac = d2(A, C), bc = d2(B, C); if (!ab || !ac || !bc) return null;
        const z = [['AB', ab], ['AC', ac], ['BC', bc]].sort((p, q) => p[1] - q[1]), ja = z[0][1] + z[1][1] === z[2][1];
        if (ja !== recht && recht) return null;
        const pt = (n, P) => `${n}(${tg(P[0])}, ${tg(P[1])})`;
        return { soort: 'rooster', opdracht: 'Is driehoek ABC rechthoekig? Bereken de kwadraten van de afstanden en gebruik de omgekeerde stelling.', tex: `${pt('A', A)},\\ ${pt('B', B)},\\ ${pt('C', C)}`, antw: keuze(JANEE, ja ? 'ja' : 'nee'),
          uitleg: [`AB^2 = ${ab},\\ AC^2 = ${ac},\\ BC^2 = ${bc}`, `${z[0][0]}^2 + ${z[1][0]}^2 = ${z[0][1] + z[1][1]} \\text{ en } ${z[2][0]}^2 = ${z[2][1]}`, ja ? '\\text{gelijk: ja, rechthoekig}' : '\\text{niet gelijk: nee}'] };
      });
    } },
  },
  oefenMix: [['vraagstuk', 3], ['rechthoekig', 2], ['rooster', 2]],
  test: [['vraagstuk', 5], ['rechthoekig', 2], ['rooster', 3]],
};

// ---------------------------------------------------------------
// 9. Vergelijkingen +
// ---------------------------------------------------------------
const term = (c, x = 'x', eerste = false) => { const k = c === 1 ? x : c === -1 ? `-${x}` : `${c}${x}`; return eerste ? k : (c < 0 ? `- ${k.slice(1)}` : `+ ${k}`); };
const cst = (c) => c === 0 ? '' : c < 0 ? ` - ${-c}` : ` + ${c}`;
const fr9 = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = ggd(Math.abs(p), q) || 1; return { p: p / g, q: q / g }; };
const frTex = ({ p, q }) => q === 1 ? `${p}` : `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
const V9 = (f) => ({ soort: 'V', waarde: f.p / f.q, exact: true, tex: frTex(f), metSpeciaal: 'leeg' });
const V9leeg = () => ({ soort: 'V', speciaal: 'leeg', metSpeciaal: 'leeg' });
const xs = (k) => k === 1 ? 'x' : `${k}x`;
const lin9 = (a, b, nul = false) => a === 0 ? (nul ? `0x${cst(b)}` : `${b}`) : `${term(a, 'x', true)}${cst(b)}`;
const tekenOp = (c) => c < 0 ? '+' : '-';
function losOp(A, B, C, D, L) {
  if (C !== 0) { L.push(`${lin9(A, B)} ${tekenOp(C)} ${xs(Math.abs(C))} = ${lin9(C, D)} ${tekenOp(C)} ${xs(Math.abs(C))}`); A -= C; C = 0; L.push(`${lin9(A, B, true)} = ${D}`); }
  if (B !== 0) { L.push(`${lin9(A, B, true)} ${tekenOp(B)} ${Math.abs(B)} = ${D} ${tekenOp(B)} ${Math.abs(B)}`); D -= B; B = 0; L.push(`${A === 0 ? '0x' : term(A, 'x', true)} = ${D}`); }
  if (A === 0) { L.push(`\\text{Geen enkel getal maal 0 geeft } ${D}\\text{: er is geen oplossing.}`, 'V = \\varnothing'); return V9leeg(); }
  if (A !== 1) L.push(`\\frac{${term(A, 'x', true)}}{${A}} = \\frac{${D}}{${A}}`);
  const f = fr9(D, A); L.push(`x = ${frTex(f)}`, f.q === 1 ? `V = \\{${frTex(f)}\\}` : `V = \\left\\{${frTex(f)}\\right\\}`);
  return V9(f);
}
const kleinF = (f, q = 6, m = 20) => f.q <= q && Math.abs(f.p / f.q) <= m;
const D9B = BD(9);
const D9 = {
  nr: 9, titel: 'Vergelijkingen +', kort: 'Enkel uitdagende vergelijkingen: x in beide leden, haakjes, noemers met haakjes, evenredigheden en wortels.', rekenmachine: null,
  opdracht: 'Los op en maak de proef.',
  theorie: theorieVan(9, `<p><b>Haakjes én noemers</b>: vermenigvuldig beide leden met het kgv van <b>alle</b> noemers; een teller met haakjes blijft tussen haakjes.</p>
      <p class="midden">$\\dfrac{2(x - 1)}{3} - \\dfrac{x + 4}{2} = \\dfrac{x}{6} \\;\\Leftrightarrow\\; 4(x - 1) - 3(x + 4) = x$ &nbsp; <span class="klein">(beide leden maal 6)</span></p>
      <p>Werk daarna stap voor stap verder, telkens met dezelfde bewerking in beide leden. Valt de $x$ weg, dan is er misschien geen oplossing: $V = \\varnothing$.</p>`),
  voorbeelden: [
    { tex: '\\dfrac{2(x - 1)}{3} - \\dfrac{x + 4}{2} = \\dfrac{x}{6}', stappen: ['\\text{beide leden maal 6: } 4(x - 1) - 3(x + 4) = x', '4x - 4 - 3x - 12 = x', 'x - 16 = x', 'x - 16 - x = x - x', '0x - 16 = 0', '0x = 16', '\\text{Geen enkel getal maal 0 geeft 16: } V = \\varnothing'] },
  ],
  soorten: {
    lineairU: D9B.soorten.lineairU, haakjesU: D9B.soorten.haakjesU, noemerU: D9B.soorten.noemerU, evenredigheidU: D9B.soorten.evenredigheidU, wortelU: D9B.soorten.wortelU,
    combi: { naam: '★ Uitdagend: noemers en haakjes samen', gen() {
      return tot(() => {
        const a = kies([2, 3, 4, 5]), b = kies([2, 3, 4, 6]), c = kies([2, 3, 4, 6, 12]); if (a === b) return null;
        const m = rnd(2, 3), p = nz(-6, 6), q2 = rnd(1, 3), q = nz(-8, 8), r = nz(-5, 5);
        const Lk = [a, b, c].reduce((x, y) => kgv(x, y), 1); if (Lk > 24) return null;
        const k1 = Lk / a, k2 = Lk / b, k3 = Lk / c;
        // k1·m(x + p) − k2(q2·x + q) = k3·x + Lk·r
        const A = k1 * m - k2 * q2, B = k1 * m * p - k2 * q, C = k3, D = Lk * r;
        if (A === C && B === D) return null; if (A !== C && !kleinF(fr9(D - B, A - C))) return null;
        const L = [`\\text{beide leden maal ${Lk}: } ${k1 * m}(x${cst(p)}) - ${k2 === 1 ? '' : k2}(${lin9(q2, q)}) = ${xs(k3)}${cst(D)}`,
          `${lin9(k1 * m, k1 * m * p)} ${term(-k2 * q2, 'x')}${cst(-k2 * q)} = ${xs(k3)}${cst(D)}`, `${lin9(A, B)} = ${lin9(C, D)}`];
        const antw = losOp(A, B, C, D, L);
        return { soort: 'combi', opdracht: 'Los op. Werk eerst de noemers weg.', tex: `\\dfrac{${m}(x${cst(p)})}{${a}} - \\dfrac{${lin9(q2, q)}}{${b}} = \\dfrac{x}{${c}}${cst(r)}`, antw, uitleg: L };
      });
    } },
  },
  oefenMix: [['lineairU', 1], ['haakjesU', 2], ['noemerU', 2], ['evenredigheidU', 1], ['wortelU', 2], ['combi', 2]],
  test: [['lineairU', 1], ['haakjesU', 2], ['noemerU', 2], ['evenredigheidU', 1], ['wortelU', 2], ['combi', 2]],
};

// ---------------------------------------------------------------
// 10. Omvormen van formules +
// ---------------------------------------------------------------
const OF = (f, vars, doel, expr, tex, stappen, alt) => ({ f, vars, doel, expr, tex, stappen, alt });
const bl = (s) => `\\quad \\text{(beide leden ${s})}`;
const wis = '\\quad \\text{(leden verwisselen)}';
const OF_PLUS = [
  OF('s = v \\cdot t + \\dfrac{a \\cdot t^2}{2}', ['s', 'v', 't', 'a'], 'a', '2(s-v*t)/t²', '\\dfrac{2(s - v \\cdot t)}{t^2}',
    [`v \\cdot t + \\dfrac{a \\cdot t^2}{2} = s ${wis}`, `\\dfrac{a \\cdot t^2}{2} = s - v \\cdot t ${bl('min } v \\cdot t\\text{')}`, `a \\cdot t^2 = 2(s - v \\cdot t) ${bl('maal 2')}`, `a = \\dfrac{2(s - v \\cdot t)}{t^2} ${bl('delen door } t^2\\text{')}`], '(2s-2v*t)/(t*t)'),
  OF('A = \\pi(R^2 - r^2)', ['A', 'R', 'r'], 'R', '√(A/π+r²)', '\\sqrt{\\dfrac{A}{\\pi} + r^2}',
    [`\\pi(R^2 - r^2) = A ${wis}`, `R^2 - r^2 = \\dfrac{A}{\\pi} ${bl('delen door } \\pi\\text{')}`, `R^2 = \\dfrac{A}{\\pi} + r^2 ${bl('plus } r^2\\text{')}`, 'R = \\sqrt{\\dfrac{A}{\\pi} + r^2} \\quad \\text{(vierkantswortel nemen)}'], '√((A+π*r²)/π)'),
  OF('v = \\sqrt{2 \\cdot g \\cdot h}', ['v', 'g', 'h'], 'h', 'v²/(2g)', '\\dfrac{v^2}{2g}',
    [`\\sqrt{2 \\cdot g \\cdot h} = v ${wis}`, `2 \\cdot g \\cdot h = v^2 \\quad \\text{(beide leden kwadrateren)}`, `h = \\dfrac{v^2}{2g} ${bl('delen door } 2g\\text{')}`], 'v*v/g/2'),
  OF('T = 2\\pi \\sqrt{\\dfrac{l}{g}}', ['T', 'l', 'g'], 'l', 'g*T²/(4π²)', '\\dfrac{g \\cdot T^2}{4\\pi^2}',
    [`2\\pi \\sqrt{\\dfrac{l}{g}} = T ${wis}`, `\\sqrt{\\dfrac{l}{g}} = \\dfrac{T}{2\\pi} ${bl('delen door } 2\\pi\\text{')}`, `\\dfrac{l}{g} = \\dfrac{T^2}{4\\pi^2} \\quad \\text{(beide leden kwadrateren)}`, `l = \\dfrac{g \\cdot T^2}{4\\pi^2} ${bl('maal } g\\text{')}`], 'g*(T/(2π))²'),
  OF('E = m \\cdot g \\cdot h + \\dfrac{m \\cdot v^2}{2}', ['E', 'm', 'g', 'h', 'v'], 'h', '(E-m*v²/2)/(m*g)', '\\dfrac{E - \\frac{m \\cdot v^2}{2}}{m \\cdot g}',
    [`m \\cdot g \\cdot h + \\dfrac{m \\cdot v^2}{2} = E ${wis}`, `m \\cdot g \\cdot h = E - \\dfrac{m \\cdot v^2}{2} ${bl('min } \\frac{m v^2}{2}\\text{')}`, `h = \\dfrac{E - \\frac{m \\cdot v^2}{2}}{m \\cdot g} ${bl('delen door } m \\cdot g\\text{')}`], '(2E-m*v²)/(2m*g)'),
  OF('Z = \\dfrac{a \\cdot x + b}{c}', ['Z', 'a', 'x', 'b', 'c'], 'x', '(c*Z-b)/a', '\\dfrac{c \\cdot Z - b}{a}',
    [`\\dfrac{a \\cdot x + b}{c} = Z ${wis}`, `a \\cdot x + b = c \\cdot Z ${bl('maal } c\\text{')}`, `a \\cdot x = c \\cdot Z - b ${bl('min } b\\text{')}`, `x = \\dfrac{c \\cdot Z - b}{a} ${bl('delen door } a\\text{')}`], 'c*Z/a-b/a'),
  OF('\\rho = \\dfrac{m}{l \\cdot b \\cdot h}', ['ρ', 'm', 'l', 'b', 'h'], 'h', 'm/(ρ*l*b)', '\\dfrac{m}{\\rho \\cdot l \\cdot b}',
    [`\\rho \\cdot l \\cdot b \\cdot h = m ${bl('maal } l \\cdot b \\cdot h\\text{')}`, `h = \\dfrac{m}{\\rho \\cdot l \\cdot b} ${bl('delen door } \\rho \\cdot l \\cdot b\\text{')}`], 'm/ρ/l/b'),
  OF('E = \\dfrac{k \\cdot x^2}{2}', ['E', 'k', 'x'], 'x', '√(2E/k)', '\\sqrt{\\dfrac{2E}{k}}',
    [`\\dfrac{k \\cdot x^2}{2} = E ${wis}`, `k \\cdot x^2 = 2E ${bl('maal 2')}`, `x^2 = \\dfrac{2E}{k} ${bl('delen door } k\\text{')}`, 'x = \\sqrt{\\dfrac{2E}{k}} \\quad \\text{(vierkantswortel nemen)}'], '√(2E)/√k'),
  OF('I = \\dfrac{U}{R + r}', ['I', 'U', 'R', 'r'], 'R', 'U/I-r', '\\dfrac{U}{I} - r',
    [`I \\cdot (R + r) = U ${bl('maal } (R + r)\\text{')}`, `R + r = \\dfrac{U}{I} ${bl('delen door } I\\text{')}`, `R = \\dfrac{U}{I} - r ${bl('min } r\\text{')}`], '(U-I*r)/I'),
  OF('r = \\sqrt{\\dfrac{A}{\\pi}}', ['r', 'A'], 'A', 'π*r²', '\\pi \\cdot r^2',
    [`\\sqrt{\\dfrac{A}{\\pi}} = r ${wis}`, `\\dfrac{A}{\\pi} = r^2 \\quad \\text{(beide leden kwadrateren)}`, `A = \\pi \\cdot r^2 ${bl('maal } \\pi\\text{')}`], 'r*r*π'),
  OF('d = \\sqrt{l^2 + b^2 + h^2}', ['d', 'l', 'b', 'h'], 'h', '√(d²-l²-b²)', '\\sqrt{d^2 - l^2 - b^2}',
    [`\\sqrt{l^2 + b^2 + h^2} = d ${wis}`, `l^2 + b^2 + h^2 = d^2 \\quad \\text{(beide leden kwadrateren)}`, `h^2 = d^2 - l^2 - b^2 ${bl('min } l^2 \\text{ en min } b^2\\text{')}`, 'h = \\sqrt{d^2 - l^2 - b^2} \\quad \\text{(vierkantswortel nemen)}'], '√(d²-(l²+b²))'),
  OF('V = \\dfrac{(a + b) \\cdot h \\cdot l}{2}', ['V', 'a', 'b', 'h', 'l'], 'a', '2V/(h*l)-b', '\\dfrac{2V}{h \\cdot l} - b',
    [`2V = (a + b) \\cdot h \\cdot l ${bl('maal 2')}`, `\\dfrac{2V}{h \\cdot l} = a + b ${bl('delen door } h \\cdot l\\text{')}`, `a = \\dfrac{2V}{h \\cdot l} - b ${bl('min } b \\text{, leden verwisselen')}`], '(2V-b*h*l)/(h*l)'),
];
const D10B = BD(10);
const D10 = {
  nr: 10, titel: 'Omvormen van formules +', kort: 'Enkel uitdagende formules, ook met een wortel of een kwadraat over meerdere grootheden.', rekenmachine: false,
  opdracht: 'Vorm om naar de gevraagde grootheid.',
  theorie: theorieVan(10, `<p><b>Een wortel wegwerken</b>: zet de wortel eerst alleen en kwadrateer dan beide leden: $v = \\sqrt{2gh} \\;\\rightarrow\\; v^2 = 2gh \\;\\rightarrow\\; h = \\dfrac{v^2}{2g}$.</p>
      <p><b>Drie of meer stappen</b>: werk van buiten naar binnen (noemer, term, factor, macht). Schrijf na elke stap de hele formule opnieuw.</p>
      <p class="midden">$s = v \\cdot t + \\dfrac{a \\cdot t^2}{2} \\;\\rightarrow\\; \\dfrac{a t^2}{2} = s - vt \\;\\rightarrow\\; a t^2 = 2(s - vt) \\;\\rightarrow\\; a = \\dfrac{2(s - vt)}{t^2}$</p>`),
  voorbeelden: [
    { tex: 'I = \\dfrac{U}{R + r} \\qquad R = \\,?', stappen: ['I \\cdot (R + r) = U', 'R + r = \\dfrac{U}{I}', 'R = \\dfrac{U}{I} - r'] },
  ],
  soorten: {
    somU: D10B.soorten.somU, breukU: D10B.soorten.breukU, wortelU: D10B.soorten.wortelU,
    plus: { naam: '★★ Extra uitdagend: drie stappen of een wortel wegwerken', gen() {
      const o = kies(OF_PLUS);
      return { soort: 'plus', opdracht: 'Vorm om naar de gevraagde grootheid.', tex: `${o.f} \\qquad ${o.doel === 'ρ' ? '\\rho' : o.doel} = \\,?`, sleutel: o.f + o.doel,
        antw: { soort: 'formule', expr: o.expr, doel: o.doel, vars: o.vars, tex: o.tex }, uitleg: o.stappen,
        controle: () => { const r = Invoer.controleerFormule(o.alt, { expr: o.expr, doel: o.doel, vars: o.vars }); return r.status === 'juist' ? null : `alt ${o.alt} ≠ ${o.expr}: ${r.status} ${r.bericht || ''}`; } };
    } },
  },
  oefenMix: [['somU', 2], ['breukU', 2], ['wortelU', 2], ['plus', 3]],
  test: [['somU', 2], ['breukU', 2], ['wortelU', 2], ['plus', 4]],
};

Leerpaden.registreer({
  code: 'reele-getallen-plus',
  titel: 'Rekenen in ℝ +',
  ondertitel: 'Zelfstudie · 7VJHO · gevorderden',
  klas: '7VJHO',
  soort: 'zelfstudie',
  intro: `<p>Je haalde een sterk resultaat op de instaptoets. Daarom werk je met de <b>+-versie</b>: dezelfde leerstof als Rekenen in ℝ, maar met moeilijkere oefeningen —
    valstrikken bij rationaal en irrationaal, wortels die je zelf splitst, machten met wortels in wortels, logaritmen met een breuk als uitkomst, Pythagoras in twee stappen
    en enkel uitdagende vergelijkingen en formules.</p>
    <p>Lees de theorie (kijk zeker naar het kader <b>Extra uitdaging</b> onderaan), bekijk de voorbeelden, oefen zoveel je wil en maak dan de test.</p>`,
  afspraken: BASIS_R.afspraken,
  groepen: [
    { titel: 'A · Reële getallen en bewerkingen', delen: [1, 2, 3] },
    { titel: 'B · Intervallen', delen: [4] },
    { titel: 'C · Machten en logaritmen', delen: [5, 6, 7] },
    { titel: 'D · Pythagoras, vergelijkingen en formules', delen: [8, 9, 10] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10],
});
