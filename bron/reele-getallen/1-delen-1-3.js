// ===================================================================
//  DEEL 1 — De reële getallen
// ===================================================================
// decimale vorm van p/q (q > 0): {voor, periode, geheel, teken}
function decimaal(p, q) {
  const teken = p < 0 ? '-' : ''; p = Math.abs(p);
  const geheel = Math.floor(p / q); let rest = p % q;
  const cijfers = [], gezien = new Map();
  while (rest !== 0 && !gezien.has(rest)) { gezien.set(rest, cijfers.length); rest *= 10; cijfers.push(Math.floor(rest / q)); rest %= q; }
  if (rest === 0) return { teken, geheel, voor: cijfers.join(''), periode: '' };
  const s = gezien.get(rest);
  return { teken, geheel, voor: cijfers.slice(0, s).join(''), periode: cijfers.slice(s).join('') };
}
const decTex = (d) => `${d.teken}${d.geheel}${d.voor || d.periode ? '{,}' + d.voor + d.periode + (d.periode ? d.periode + '\\ldots' : '') : ''}`;
const decSoort = (d) => !d.periode ? 'begrensd' : d.voor ? 'gemengd repeterend' : 'zuiver repeterend';

// willekeurig rationaal decimaal getal in een bepaalde vorm
function rationaalDecimaal(vorm) {
  if (vorm === 'begrensd') {
    const n = kies([1, 2, 3]), x = (Math.random() < 0.3 ? -1 : 1) * rnd(1, 10 ** n * kies([1, 1, 3, 6])) / 10 ** n;
    if (Number.isInteger(x)) return rationaalDecimaal(vorm);
    return { tex: tg(x), soort: 'begrensd' };
  }
  const g = rnd(0, 6);
  let per; if (Math.random() < 0.4) per = String(rnd(1, 8)); else { const x = rnd(1, 9); let y; do { y = rnd(0, 9); } while (y === x); per = `${x}${y}`; }
  const herhaal = per.length === 1 ? per.repeat(3) : per.repeat(2);
  if (vorm === 'zuiver') return { tex: `${g}{,}${herhaal}\\ldots`, soort: 'zuiver repeterend' };
  let v; do { v = String(rnd(0, 9)) + (Math.random() < 0.3 ? String(rnd(0, 9)) : ''); } while (v[v.length - 1] === per[per.length - 1]);
  return { tex: `${g}{,}${v}${herhaal}\\ldots`, soort: 'gemengd repeterend' };
}

const VENN = `<div class="venn"><span class="vlab">$\\mathbb{R}$</span>
  <div class="vgebied"><span class="vlab">$\\mathbb{Q}$</span>
    <div class="vgebied"><span class="vlab">$\\mathbb{Z}$</span>
      <div class="vgebied" style="max-width:60%"><span class="vlab">$\\mathbb{N}$</span><span class="ex">$0$</span><span class="ex">$5$</span></div>
      <span class="ex">$-3$</span></div>
    <span class="ex">$\\frac{1}{3}$</span><span class="ex">$0{,}75$</span></div>
  <div class="vgebied irr"><span class="vlab">$\\mathbb{R}\\setminus\\mathbb{Q}$</span><span class="ex">$\\pi$</span><br><span class="ex">$\\sqrt{2}$</span></div>
</div>`;

const DEEL1 = {
  nr: 1, titel: 'De reële getallen', kort: 'Rationaal of irrationaal? ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.',
  rekenmachine: true,
  opdracht: 'Is het getal rationaal of irrationaal?',
  theorie: `
    <div class="kader">
      <div class="kader-titel">Herhaling: decimale vormen</div>
      <p>In $\\mathbb{Q}$ kwamen we drie soorten decimale getallen tegen.</p>
      <table class="tabel"><tr><th>begrensd</th><th>zuiver repeterend</th><th>gemengd repeterend</th></tr>
        <tr><td>$\\frac{3}{4} = 0{,}75$</td><td>$\\frac{1}{3} = 0{,}33\\ldots$</td><td>$\\frac{1}{6} = 0{,}166\\ldots$</td></tr>
        <tr><td class="klein">De deling stopt: de rest wordt 0.</td><td class="klein">De periode begint meteen na de komma.</td><td class="klein">Eerst een vast deel, dan pas de periode.</td></tr></table>
      <p>Al deze getallen zijn <b>rationaal</b>: je kan ze schrijven als breuk. Maar er bestaan ook decimale getallen die <b>nooit</b> stoppen en <b>nooit</b> herhalen …</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Irrationale getallen ($\\mathbb{R}\\setminus\\mathbb{Q}$)</div>
      <p>Decimale getallen die <b>niet begrensd</b> en <b>niet repeterend</b> zijn.</p>
      <p>$\\pi = 3{,}14159265358979\\ldots$ &nbsp; <span class="klein">de cijfers lopen eindeloos door, zonder periode</span></p>
      <p>$\\sqrt{2} = 1{,}41421356237309\\ldots$ &nbsp; <span class="klein">ook hier vind je nooit een periode</span></p>
      <p class="let-op">Een irrationaal getal kan je nooit exact als breuk schrijven. Je rekenmachine toont altijd een benadering.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Reële getallen</div>
      <p class="midden">$\\mathbb{R} = \\mathbb{Q} \\cup (\\mathbb{R}\\setminus\\mathbb{Q})$</p>
      <p>Alle rationale én irrationale getallen samen vormen de <b>reële getallen</b>.</p>
      <p>$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$ &nbsp;·&nbsp; $\\mathbb{R}\\setminus\\mathbb{Q}$ = de irrationale getallen.</p>
      ${VENN}
      <p class="klein">Elk getal dat je in dit schooljaar tegenkomt, is een reëel getal.</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Werkwijze: rationaal of irrationaal?</div>
      <ol>
        <li>Schrijf het getal decimaal (gebruik je rekenmachine bij een breuk of een wortel). Schrijf minstens 6 decimalen of de periode tweemaal.</li>
        <li><b>Begrensd</b> of <b>repeterend</b>? Dan is het getal rationaal: $\\mathbb{Q}$.</li>
        <li><b>Niet begrensd én niet repeterend</b>? Dan is het getal irrationaal: $\\mathbb{R}\\setminus\\mathbb{Q}$.</li>
      </ol>
      <p class="klein">Let op: $\\sqrt{16} = 4$ en $\\sqrt{0{,}25} = 0{,}5$ zijn gewoon rationale getallen.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">In welk deel van het diagram?</div>
      <p>Zet een getal altijd in het <b>kleinste</b> deel waar het in past: $9 \\in \\mathbb{N}$, $-4 \\in \\mathbb{Z}$, $0{,}5 \\in \\mathbb{Q}$, $\\pi \\in \\mathbb{R}\\setminus\\mathbb{Q}$.</p>
    </div>`,
  voorbeelden: [
    { tex: '0{,}75', stappen: ['\\text{begrensd: de deling stopt}', '0{,}75 \\in \\mathbb{Q}'] },
    { tex: '2{,}333\\ldots', stappen: ['\\text{zuiver repeterend: de periode 3 begint meteen na de komma}', '2{,}333\\ldots \\in \\mathbb{Q}'] },
    { tex: '\\pi = 3{,}14159\\ldots', stappen: ['\\text{niet begrensd en niet repeterend}', '\\pi \\in \\mathbb{R}\\setminus\\mathbb{Q}'] },
    { tex: '0{,}1666\\ldots', stappen: ['\\text{gemengd repeterend: eerst 1, dan de periode 6}', '0{,}1666\\ldots \\in \\mathbb{Q}'] },
    { tex: '\\sqrt{2} = 1{,}41421\\ldots', stappen: ['\\text{niet begrensd en niet repeterend}', '\\sqrt{2} \\in \\mathbb{R}\\setminus\\mathbb{Q}'] },
    { tex: '\\frac{5}{11}', stappen: ['\\text{rekenmachine: } \\frac{5}{11} = 0{,}4545\\ldots', '\\text{zuiver repeterend, dus } \\frac{5}{11} \\in \\mathbb{Q}'] },
    { tex: '\\sqrt{25} \\quad \\text{(plaats in het diagram)}', stappen: ['\\sqrt{25} = 5', '5 \\text{ is een natuurlijk getal: het kleinste deel is } \\mathbb{N}'] },
  ],
  soorten: {
    qofr: { naam: 'Rationaal of irrationaal?', gen() {
      const r = Math.random();
      if (r < 0.2) { const d = rationaalDecimaal('begrensd'); return { soort: 'qofr', tex: d.tex, antw: keuze(QR, 'Q'), uitleg: [`${d.tex} \\text{ is begrensd, dus rationaal: } \\mathbb{Q}`] }; }
      if (r < 0.35) { const d = rationaalDecimaal('zuiver'); return { soort: 'qofr', tex: d.tex, antw: keuze(QR, 'Q'), uitleg: [`${d.tex} \\text{ is zuiver repeterend, dus rationaal: } \\mathbb{Q}`] }; }
      if (r < 0.5) { const d = rationaalDecimaal('gemengd'); return { soort: 'qofr', tex: d.tex, antw: keuze(QR, 'Q'), uitleg: [`${d.tex} \\text{ is gemengd repeterend, dus rationaal: } \\mathbb{Q}`] }; }
      if (r < 0.58) { const z = rnd(-12, 30); return { soort: 'qofr', tex: `${z}`, antw: keuze(QR, 'Q'), uitleg: [`${z} \\text{ is een geheel getal en dus ook rationaal: } ${z} = \\frac{${z}}{1}`] }; }
      if (r < 0.68) { return { soort: 'qofr', tex: `\\pi = 3{,}14159265\\ldots`, antw: keuze(QR, 'RQ'), sleutel: 'pi' + rnd(1, 3), uitleg: ['\\pi \\text{ is niet begrensd en niet repeterend: } \\mathbb{R}\\setminus\\mathbb{Q}'] }; }
      let n; do { n = rnd(2, 60); } while (isKwadraat(n));
      const t = `\\sqrt{${n}} = ${afgekapt(Math.sqrt(n), 8)}`;
      return { soort: 'qofr', tex: t, antw: keuze(QR, 'RQ'), uitleg: [`\\sqrt{${n}} \\text{ is niet begrensd en niet repeterend: } \\mathbb{R}\\setminus\\mathbb{Q}`] };
    } },
    rekenmachine: { naam: 'Reken uit en kies', gen() {
      const r = Math.random();
      if (r < 0.45) {
        const q = kies([3, 4, 5, 6, 8, 9, 11, 12, 15, 20, 25]); let p; do { p = rnd(1, 2 * q); } while (p % q === 0);
        const g = ggd(p, q); if (g > 1 && Math.random() < 0.6) return this.gen();
        const d = decimaal(p, q), dt = decTex(d), s = decSoort(d);
        return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Is het getal rationaal of irrationaal?', tex: `\\frac{${p}}{${q}}`, antw: keuze(QR, 'Q'),
          uitleg: [`\\frac{${p}}{${q}} = ${dt}`, `\\text{${s}, dus } \\mathbb{Q}`] };
      }
      if (r < 0.7) {
        const k = rnd(2, 15), dec = Math.random() < 0.35;
        const n = dec ? kies([0.25, 0.49, 0.09, 0.36, 0.64, 0.81, 1.44, 2.25, 0.16]) : k * k, w = Math.sqrt(n);
        return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Is het getal rationaal of irrationaal?', tex: `\\sqrt{${tg(n)}}`, antw: keuze(QR, 'Q'),
          uitleg: [`\\sqrt{${tg(n)}} = ${tg(+w.toFixed(4))}`, `\\text{begrensd, dus } \\mathbb{Q}`] };
      }
      const dec = Math.random() < 0.2;
      let n; do { n = rnd(2, 99); } while (dec ? isKwadraat(10 * n) || n % 10 === 0 : isKwadraat(n));
      if (dec) n = n / 10;
      return { soort: 'rekenmachine', opdracht: 'Reken uit met je rekenmachine. Is het getal rationaal of irrationaal?', tex: `\\sqrt{${tg(n)}}`, antw: keuze(QR, 'RQ'),
        uitleg: [`\\sqrt{${tg(n)}} = ${afgekapt(Math.sqrt(n), 6)}`, `\\text{niet begrensd en niet repeterend, dus } \\mathbb{R}\\setminus\\mathbb{Q}`] };
    } },
    diagram: { naam: 'Plaats in het diagram', gen() {
      const r = Math.random(); let tex, juist, uitleg;
      if (r < 0.17) { const n = rnd(0, 25); tex = `${n}`; juist = 'N'; uitleg = `${n} \\text{ is een natuurlijk getal: } \\mathbb{N}`; }
      else if (r < 0.3) { const n = -rnd(1, 25); tex = `${n}`; juist = 'Z'; uitleg = `${n} \\text{ is een negatief geheel getal: } \\mathbb{Z}`; }
      else if (r < 0.4) { const k = rnd(2, 12); tex = `\\sqrt{${k * k}}`; juist = 'N'; uitleg = `\\sqrt{${k * k}} = ${k} \\text{, een natuurlijk getal: } \\mathbb{N}`; }
      else if (r < 0.46) { const k = rnd(2, 10); tex = `-\\sqrt{${k * k}}`; juist = 'Z'; uitleg = `-\\sqrt{${k * k}} = -${k} \\text{, een geheel getal: } \\mathbb{Z}`; }
      else if (r < 0.58) { let p, q; do { q = rnd(2, 9); p = rnd(1, 3 * q); } while (p % q === 0); const t = W.breukTex(Math.random() < 0.3 ? -p : p, q); tex = t; juist = 'Q';
        uitleg = `${t} \\text{ is een breuk (geen geheel getal): } \\mathbb{Q}`; }
      else if (r < 0.7) { const d = rationaalDecimaal(kies(['begrensd', 'begrensd', 'zuiver'])); tex = d.tex; juist = 'Q'; uitleg = `${d.tex} \\text{ is ${d.soort}: } \\mathbb{Q}`; }
      else if (r < 0.78) { tex = '\\pi'; juist = 'RQ'; uitleg = '\\pi \\text{ is irrationaal: } \\mathbb{R}\\setminus\\mathbb{Q}'; }
      else { let n; do { n = rnd(2, 60); } while (isKwadraat(n)); tex = (Math.random() < 0.2 ? '-' : '') + `\\sqrt{${n}}`; juist = 'RQ'; uitleg = `${tex} = ${tex.startsWith('-') ? '-' : ''}${afgekapt(Math.sqrt(n), 5)} \\text{ is irrationaal: } \\mathbb{R}\\setminus\\mathbb{Q}`; }
      return { soort: 'diagram', opdracht: 'In welk deel van het diagram plaats je dit getal? Kies het kleinste deel.', tex, antw: keuze(NZQR, juist), uitleg: [uitleg] };
    } },
    waarniet: { naam: 'Waar of niet waar?', gen() {
      const lijst = [
        () => ['Elk natuurlijk getal is een reëel getal.', 'w', '\\mathbb{N} \\subset \\mathbb{R}'],
        () => ['Elk reëel getal is een rationaal getal.', 'nw', '\\pi \\text{ en } \\sqrt{2} \\text{ zijn reëel maar niet rationaal.}'],
        () => ['Elk rationaal getal is een reëel getal.', 'w', '\\mathbb{Q} \\subset \\mathbb{R}'],
        () => ['Elk geheel getal is een natuurlijk getal.', 'nw', '-3 \\in \\mathbb{Z}, \\text{ maar } -3 \\notin \\mathbb{N}'],
        () => ['Elk natuurlijk getal is een geheel getal.', 'w', '\\mathbb{N} \\subset \\mathbb{Z}'],
        () => ['π kan je exact als breuk schrijven.', 'nw', '\\pi \\text{ is irrationaal: dat kan je nooit exact als breuk schrijven.}'],
        () => ['Je rekenmachine toont de exacte waarde van √2.', 'nw', '\\sqrt{2} \\text{ is irrationaal: je rekenmachine toont een benadering.}'],
        () => ['Een irrationaal getal is begrensd of repeterend.', 'nw', '\\text{Een irrationaal getal is niet begrensd en niet repeterend.}'],
        () => { const k = rnd(2, 12), sq = Math.random() < 0.5, n = sq ? k * k : (() => { let m; do { m = rnd(2, 80); } while (isKwadraat(m)); return m; })();
          return [`√${n} is een rationaal getal.`, sq ? 'w' : 'nw', sq ? `\\sqrt{${n}} = ${k} \\in \\mathbb{Q}` : `\\sqrt{${n}} = ${afgekapt(Math.sqrt(n), 5)} \\text{ is irrationaal}`]; },
        () => { const d = rationaalDecimaal(kies(['zuiver', 'gemengd'])); return [`${W.platteTekst(d.tex)} is een irrationaal getal.`, 'nw', `${d.tex} \\text{ is ${d.soort}, dus rationaal.}`]; },
        () => { const z = -rnd(1, 20); return [`${kg(z).replace('-', '−')} behoort tot ℤ en tot ℝ.`, 'w', `${z} \\in \\mathbb{Z} \\text{ en } \\mathbb{Z} \\subset \\mathbb{R}`]; },
        () => { const x = -rnd(11, 99) / 10; return [`${kg(x).replace('-', '−')} behoort tot ℤ.`, 'nw', `${tg(x)} \\text{ is geen geheel getal: } ${tg(x)} \\in \\mathbb{Q}`]; },
        () => { let n; do { n = rnd(2, 50); } while (isKwadraat(n)); return [`√${n} behoort tot ℝ \\ ℚ.`, 'w', `\\sqrt{${n}} \\text{ is irrationaal.}`]; },
        () => ['ℚ ⊂ ℤ', 'nw', '\\text{Andersom: } \\mathbb{Z} \\subset \\mathbb{Q}. \\text{ Bv. } \\frac{1}{3} \\in \\mathbb{Q} \\text{ maar } \\frac{1}{3} \\notin \\mathbb{Z}'],
      ];
      const [zin, juist, u] = kies(lijst)();
      return { soort: 'waarniet', opdracht: 'Waar of niet waar?', html: `<div class="tekstopgave">${W.esc(zin)}</div>`, rapport: zin, sleutel: zin, antw: keuze(WAAR, juist), uitleg: [u] };
    } },
  },
  oefenMix: [['qofr', 3], ['rekenmachine', 2], ['diagram', 3], ['waarniet', 2]],
  test: [['qofr', 3], ['rekenmachine', 2], ['diagram', 3], ['waarniet', 2]],
};

// ===================================================================
//  DEEL 2 — Bewerkingen in ℝ (met rekenmachine)
// ===================================================================
const DEEL2 = {
  nr: 2, titel: 'Bewerkingen in ℝ', kort: 'Derdemachtswortels, afronden, wortels benaderen en splitsen.',
  rekenmachine: true,
  opdracht: 'Bereken.',
  theorie: `
    <div class="kader werk">
      <div class="kader-titel">Afspraken</div>
      <p><b>1.</b> Gebruik <b>extra haakjes</b> waar nodig: $\\sqrt[3]{20} = 20^{\\frac{1}{3}}$ → tik <code>20 ^ ( 1 ÷ 3 )</code>.</p>
      <p><b>2.</b> Schrijf tussenresultaten op met <b>minstens 2 extra decimalen</b>. Moet je antwoord op 2 decimalen? Noteer tussenresultaten dan met minstens 4 decimalen. Pas op het einde rond je af.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Waarom 2 extra decimalen?</div>
      <p>Bereken $\\sqrt{2} \\cdot \\sqrt{8}$ op 2 decimalen.</p>
      <p><span class="rood"><b>Fout:</b> eerst afronden op 2 decimalen</span><br>$1{,}41 \\cdot 2{,}83 = 3{,}9903 \\approx 3{,}99$</p>
      <p><span class="groen"><b>Juist:</b> tussenresultaten met 4 decimalen</span><br>$1{,}4142 \\cdot 2{,}8284 = 3{,}99992\\ldots \\approx 4{,}00$</p>
      <p class="klein">Controle: $\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4$. Wie te vroeg afrondt, krijgt een fout antwoord.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Derdemachtswortels</div>
      <p>De <b>derdemachtswortel</b> van een getal is het getal dat je <b>tot de derde macht</b> moet verheffen om dat getal te krijgen.</p>
      <table class="tabel"><tr><td>$\\sqrt[3]{1} = 1$</td><td>want $1^3 = 1$</td></tr><tr><td>$\\sqrt[3]{8} = 2$</td><td>want $2^3 = 2 \\cdot 2 \\cdot 2 = 8$</td></tr>
        <tr><td>$\\sqrt[3]{27} = 3$</td><td>want $3^3 = 3 \\cdot 3 \\cdot 3 = 27$</td></tr><tr><td>$\\sqrt[3]{-8} = -2$</td><td>want $(-2)^3 = (-2) \\cdot (-2) \\cdot (-2) = -8$</td></tr></table>
      <p class="let-op">De derdemachtswortel van een negatief getal bestaat wél: het resultaat is negatief.</p>
      <p class="klein">Gekende derdemachten: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Op de rekenmachine</div>
      <p>Een derdemachtswortel kan je schrijven als een macht: $\\sqrt[3]{x} = x^{\\frac{1}{3}}$</p>
      <ul><li>gebruik de toets voor de derdemachtswortel, <b>of</b></li><li>tik <code>x ^ ( 1 ÷ 3 )</code> (vergeet de haakjes niet!)</li></ul>
      <p>$\\sqrt[3]{27} = 27^{\\frac{1}{3}} = 3$ &nbsp; want $3^3 = 27$</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Bereken op 5 decimalen</div>
      <p>$\\sqrt[3]{2020} \\approx 12{,}64107$ <span class="klein">— controle: het ligt tussen 12 en 13, want $12^3 = 1728$ en $13^3 = 2197$.</span></p>
      <p>$\\sqrt[3]{-17} \\approx -2{,}57128$ <span class="klein">— controle: het ligt tussen −3 en −2, want $(-3)^3 = -27$ en $(-2)^3 = -8$.</span></p>
      <p class="blauwtekst">Zesde decimaal ≥ 5? Dan verhoog je de vijfde decimaal met 1.</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Benaderen van wortels</div>
      <p>Zoek het gekende <b>kwadraat</b> (bij $\\sqrt{\\phantom{x}}$) of de gekende <b>derdemacht</b> (bij $\\sqrt[3]{\\phantom{x}}$) die net kleiner en net groter is.</p>
      <table class="tabel"><tr><th>kwadraten</th><td>1 &nbsp; 4 &nbsp; 9 &nbsp; 16 &nbsp; 25 &nbsp; 36 &nbsp; 49 &nbsp; 64 &nbsp; 81 &nbsp; 100</td></tr>
        <tr><th>derdemachten</th><td>1 &nbsp; 8 &nbsp; 27 &nbsp; 64 &nbsp; 125</td></tr></table>
      <p>$\\sqrt{20}$: &nbsp; $16 < 20 < 25 \\;\\rightarrow\\; 4 < \\sqrt{20} < 5$ &nbsp; en met de rekenmachine $\\sqrt{20} \\approx 4{,}47$</p>
      <p>$\\sqrt[3]{20}$: &nbsp; $8 < 20 < 27 \\;\\rightarrow\\; 2 < \\sqrt[3]{20} < 3$ &nbsp; en met de rekenmachine $\\sqrt[3]{20} \\approx 2{,}71$</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Wortel van een product</div>
      <p class="midden">$\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}$</p>
      <p>$\\sqrt{9 \\cdot 7} = \\sqrt{9} \\cdot \\sqrt{7} = 3 \\cdot \\sqrt{7} \\approx 7{,}94$ &nbsp; <span class="klein">($\\sqrt{9} = 3$ is een gekende wortel)</span></p>
      <p>$\\sqrt{7{,}3^2} = 7{,}3$ &nbsp; <span class="klein">De vierkantswortel en het kwadraat heffen elkaar op (bij een positief getal).</span></p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <p>Typ een kommagetal met een komma: <code>12,64107</code>. Een negatief getal: <code>-2,57128</code>. Bij het splitsen van een wortel typ je bv. <code>3√7</code> (knop √).</p></div>`,
  voorbeelden: [
    { tex: '\\sqrt[3]{125}', stappen: ['5^3 = 125', '\\sqrt[3]{125} = 5'] },
    { tex: '\\sqrt[3]{-64}', stappen: ['(-4)^3 = -64', '\\sqrt[3]{-64} = -4'] },
    { tex: '\\sqrt[3]{2020} \\text{ op 5 decimalen}', stappen: ['\\text{rekenmachine: } 2020^{\\frac{1}{3}} = 12{,}641071\\ldots', '\\text{zesde decimaal is 1: niet verhogen}', '\\sqrt[3]{2020} \\approx 12{,}64107', '\\text{controle: } 12^3 = 1728 < 2020 < 2197 = 13^3'] },
    { tex: '\\sqrt{20} \\text{ benaderen}', stappen: ['16 < 20 < 25', '4 < \\sqrt{20} < 5', '\\text{rekenmachine: } \\sqrt{20} \\approx 4{,}47'] },
    { tex: '\\sqrt[3]{23} \\text{ benaderen}', stappen: ['8 < 23 < 27 \\quad (8 = 2^3,\\ 27 = 3^3)', '2 < \\sqrt[3]{23} < 3', '\\text{rekenmachine: } \\sqrt[3]{23} \\approx 2{,}84'] },
    { tex: '\\sqrt{9 \\cdot 7}', stappen: ['\\sqrt{9 \\cdot 7} = \\sqrt{9} \\cdot \\sqrt{7}', '= 3 \\cdot \\sqrt{7}', '\\approx 7{,}94'] },
    { tex: '\\sqrt{2} \\cdot \\sqrt{8} \\text{ op 2 decimalen}', stappen: ['\\text{tussenresultaten met 4 decimalen: } 1{,}4142 \\cdot 2{,}8284', '= 3{,}99992\\ldots', '\\approx 4{,}00'] },
  ],
  soorten: {
    derde: { naam: 'Derdemachtswortel zonder rekenmachine', gen() {
      const k = rnd(1, 10), t = Math.random() < 0.4 ? -1 : 1, a = t * k ** 3, w = t * k;
      return { soort: 'derde', opdracht: 'Bereken zonder rekenmachine.', tex: `\\sqrt[3]{${a}}`, antw: getal(w), uitleg: [`\\sqrt[3]{${a}} = ${w} \\quad \\text{want} \\quad ${h(w)}^3 = ${a}`] };
    } },
    vijfdec: { naam: 'Op 5 decimalen', gen() {
      for (;;) {
        let n, tex, w, uit;
        if (Math.random() < 0.65) {
          n = Math.random() < 0.15 ? kies([0.5, 0.2, 0.7, 1.5, 2.5]) : (Math.random() < 0.3 ? -1 : 1) * rnd(2, 2999);
          if (Number.isInteger(n) && isDerde(Math.abs(n))) continue;
          tex = `\\sqrt[3]{${tg(n)}}`; w = Math.cbrt(n);
          const g = Math.floor(w);
          uit = Number.isInteger(n) && Math.abs(n) > 1 ? [`\\text{rekenmachine: } ${h(n)}^{\\frac{1}{3}} = ${afgekapt(w, 6)}`, `\\text{controle: } ${h(g)}^3 = ${g ** 3} < ${n} < ${(g + 1) ** 3} = ${h(g + 1)}^3`] : [`\\text{rekenmachine: } ${h(n)}^{\\frac{1}{3}} = ${afgekapt(w, 6)}`];
        } else {
          n = rnd(2, 999); if (isKwadraat(n)) continue;
          tex = `\\sqrt{${n}}`; w = Math.sqrt(n); uit = [`\\text{rekenmachine: } \\sqrt{${n}} = ${afgekapt(w, 6)}`];
        }
        if (!zekerRond(w, 5)) continue;
        uit.push(`${tex} \\approx ${tg(w, 5)}`);
        return { soort: 'vijfdec', opdracht: 'Bereken met je rekenmachine op 5 decimalen.', tex, antw: getal(w, 5, { voor: '\\approx' }), uitleg: uit };
      }
    } },
    tussen: { naam: 'Benader tussen twee gekende wortels', gen() {
      for (;;) {
        const derde = Math.random() < 0.4;
        const n = derde ? rnd(2, 124) : rnd(2, 99);
        if (derde ? isDerde(n) : isKwadraat(n)) continue;
        const w = derde ? Math.cbrt(n) : Math.sqrt(n), g = Math.floor(w);
        if (!zekerRond(w, 2)) continue;
        const wt = derde ? `\\sqrt[3]{${n}}` : `\\sqrt{${n}}`, m = derde ? 3 : 2;
        return { soort: 'tussen', opdracht: 'Tussen welke twee gehele getallen ligt de wortel? Controleer daarna met je rekenmachine (2 decimalen).', tex: wt,
          antw: { soort: 'delen', delen: [
            { label: '\\text{ligt tussen}', antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { tex: `< ${wt} <` }, { veld: 1 }], velden: [veldE(String(g)), veldE(String(g + 1))] } },
            { label: '\\text{rekenmachine}', antw: getal(w, 2, { voor: `${wt} \\approx` }) }] },
          uitleg: [`${g ** m} < ${n} < ${(g + 1) ** m} \\quad (${g ** m} = ${g}^${m},\\ ${(g + 1) ** m} = ${g + 1}^${m})`, `${g} < ${wt} < ${g + 1}`, `${wt} \\approx ${tg(w, 2)}`] };
      }
    } },
    product: { naam: 'Wortel van een product splitsen', gen() {
      if (Math.random() < 0.25) {
        const c = rnd(11, 99) / 10;
        return { soort: 'product', opdracht: 'Bereken. Rond af op 2 decimalen waar nodig.', tex: `\\sqrt{${tg(c)}^2}`, antw: getal(c, 2, { voor: '=' }),
          uitleg: [`\\sqrt{${tg(c)}^2} = ${tg(c)} \\quad \\text{(wortel en kwadraat heffen elkaar op)}`] };
      }
      for (;;) {
        const k = rnd(2, 10), b = kies(KW), w = k * Math.sqrt(b);
        if (!zekerRond(w, 2)) continue;
        const vorm = Math.random() < 0.5 ? `${k * k} \\cdot ${b}` : `${b} \\cdot ${k * k}`;
        return { soort: 'product', opdracht: 'Splits de wortel van het product. Rond af op 2 decimalen.', tex: `\\sqrt{${vorm}}`,
          antw: { soort: 'delen', delen: [
            { label: '\\text{uitwerking}', antw: expr(`${k}√(${b})`, ['vereenvoudigd'], { voor: '=' }) },
            { label: '\\text{resultaat}', antw: getal(w, 2, { voor: '\\approx' }) }] },
          uitleg: [`\\sqrt{${vorm}} = \\sqrt{${k * k}} \\cdot \\sqrt{${b}} = ${k} \\cdot \\sqrt{${b}} \\approx ${tg(w, 2)}`] };
      }
    } },
    tussenres: { naam: 'Bereken op 2 decimalen (tussenresultaten)', gen() {
      for (;;) {
        const vorm = kies(['maal', 'maal', 'plus', 'pi', 'min']);
        let a = rnd(2, 30), b = rnd(2, 30);
        if (isKwadraat(a) || (vorm !== 'pi' && isKwadraat(b))) continue;
        const wa = Math.sqrt(a), wb = vorm === 'pi' ? Math.PI : Math.sqrt(b);
        const r4 = (x) => W.rond(x, 4);
        let tex, exact, benad, tus;
        if (vorm === 'maal') { tex = `\\sqrt{${a}} \\cdot \\sqrt{${b}}`; exact = wa * wb; benad = r4(wa) * r4(wb); tus = `${tg(r4(wa), 4)} \\cdot ${tg(r4(wb), 4)}`; }
        if (vorm === 'plus') { tex = `\\sqrt{${a}} + \\sqrt{${b}}`; exact = wa + wb; benad = r4(wa) + r4(wb); tus = `${tg(r4(wa), 4)} + ${tg(r4(wb), 4)}`; }
        if (vorm === 'min') { if (a <= b) continue; tex = `\\sqrt{${a}} - \\sqrt{${b}}`; exact = wa - wb; benad = r4(wa) - r4(wb); tus = `${tg(r4(wa), 4)} - ${tg(r4(wb), 4)}`; }
        if (vorm === 'pi') { tex = `\\pi \\cdot \\sqrt{${a}}`; exact = Math.PI * wa; benad = r4(Math.PI) * r4(wa); tus = `${tg(r4(Math.PI), 4)} \\cdot ${tg(r4(wa), 4)}`; }
        if (!zekerRond(exact, 2) || W.rond(exact, 2) !== W.rond(benad, 2)) continue;
        const uitleg = [`\\text{tussenresultaten met 4 decimalen: } ${tus}`, `= ${afgekapt(benad, 4)} \\approx ${tg(exact, 2)}`];
        if (vorm === 'maal' && isKwadraat(a * b)) uitleg.push(`\\text{controle: } \\sqrt{${a}} \\cdot \\sqrt{${b}} = \\sqrt{${a * b}} = ${Math.sqrt(a * b)}`);
        return { soort: 'tussenres', opdracht: 'Bereken op 2 decimalen. Noteer de tussenresultaten (op je kladblad) met 4 decimalen.', tex, antw: getal(exact, 2, { voor: '\\approx' }), uitleg };
      }
    } },
  },
  oefenMix: [['derde', 2], ['vijfdec', 3], ['tussen', 2], ['product', 2], ['tussenres', 2]],
  test: [['derde', 2], ['vijfdec', 3], ['tussen', 2], ['product', 1], ['tussenres', 2]],
};

// ===================================================================
//  DEEL 3 — Bewerkingen in ℝ zonder rekenmachine
// ===================================================================
// k·√n vereenvoudigen
function vereenv(k, n) { const r = haalUit(n); return { k: k * r.k, m: r.m }; }
const DEEL3 = {
  nr: 3, titel: 'Bewerkingen in ℝ zonder rekenmachine', kort: 'Wortels vereenvoudigen, vermenigvuldigen, optellen, noemer wortelvrij maken.',
  rekenmachine: false,
  opdracht: 'Vereenvoudig.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">Wortels vereenvoudigen</div>
      <p>Schrijf het getal onder de wortel als een product met een <b>gekend kwadraat</b> (4, 9, 16, 25, 36, 49, …). Haal de wortel van dat kwadraat <b>buiten</b> de wortel.</p>
      <p>$\\sqrt{12} = \\sqrt{4 \\cdot 3} = \\sqrt{4} \\cdot \\sqrt{3} = 2\\sqrt{3}$</p>
      <p>$\\sqrt{50} = \\sqrt{25 \\cdot 2} = \\sqrt{25} \\cdot \\sqrt{2} = 5\\sqrt{2}$</p>
      <p>$\\sqrt{72} = \\sqrt{36 \\cdot 2} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$</p>
      <p class="let-op">Kies het grootste kwadraat: $\\sqrt{72} = \\sqrt{4 \\cdot 18}$ kan ook, maar dan ben je nog niet klaar.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Wortels vermenigvuldigen</div>
      <p class="midden">$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{a \\cdot b} \\qquad \\sqrt{a} \\cdot \\sqrt{a} = a$</p>
      <p>$\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4$ &nbsp;·&nbsp; $\\sqrt{5} \\cdot \\sqrt{5} = 5$</p>
      <p>$2\\sqrt{3} \\cdot 5\\sqrt{3} = 2 \\cdot 5 \\cdot \\sqrt{3} \\cdot \\sqrt{3} = 10 \\cdot 3 = 30$</p>
      <p>$3\\sqrt{2} \\cdot 4\\sqrt{5} = 3 \\cdot 4 \\cdot \\sqrt{2 \\cdot 5} = 12\\sqrt{10}$</p>
      <p class="klein">Getallen voor de wortel vermenigvuldig je met elkaar, wortels met elkaar.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Wortels optellen en aftrekken</div>
      <p>Je kan enkel <b>gelijksoortige wortels</b> optellen of aftrekken: wortels met hetzelfde getal onder het wortelteken. Net zoals bij eentermen: $3x + 5x = 8x$.</p>
      <p>$3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$ &nbsp;·&nbsp; $7\\sqrt{3} - 2\\sqrt{3} = 5\\sqrt{3}$ &nbsp;·&nbsp; $4\\sqrt{5} + \\sqrt{5} - 6\\sqrt{5} = -\\sqrt{5}$ <span class="klein">($\\sqrt{5} = 1 \\cdot \\sqrt{5}$)</span></p>
      <p class="let-op">$\\sqrt{2} + \\sqrt{3} \\neq \\sqrt{5}$: niet gelijksoortig, dit kan je niet samennemen.</p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Eerst vereenvoudigen</div>
      <p>Soms zie je pas na het vereenvoudigen dat de wortels gelijksoortig zijn.</p>
      <p>$\\sqrt{12} + \\sqrt{3} = 2\\sqrt{3} + \\sqrt{3} = 3\\sqrt{3}$ &nbsp;·&nbsp; $\\sqrt{50} - \\sqrt{8} = 5\\sqrt{2} - 2\\sqrt{2} = 3\\sqrt{2}$</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">Noemer wortelvrij maken</div>
      <p>Staat er een wortel in de noemer? Vermenigvuldig <b>teller én noemer</b> met die wortel. Zo verandert de waarde van de breuk niet, en verdwijnt de wortel uit de noemer.</p>
      <p class="midden">$\\dfrac{a}{\\sqrt{b}} = \\dfrac{a \\cdot \\sqrt{b}}{\\sqrt{b} \\cdot \\sqrt{b}} = \\dfrac{a\\sqrt{b}}{b}$</p>
      <p>$\\dfrac{6}{\\sqrt{3}} = \\dfrac{6 \\cdot \\sqrt{3}}{\\sqrt{3} \\cdot \\sqrt{3}} = \\dfrac{6\\sqrt{3}}{3} = 2\\sqrt{3}$ &nbsp;·&nbsp; $\\dfrac{5}{2\\sqrt{5}} = \\dfrac{5\\sqrt{5}}{10} = \\dfrac{\\sqrt{5}}{2}$</p>
      <p class="klein">Dit werkt omdat $\\sqrt{b} \\cdot \\sqrt{b} = b$. Vereenvoudig op het einde de breuk als het kan.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$6\\sqrt{2}$</td><td><code>6√2</code> (knop √)</td></tr>
        <tr><td>$-\\sqrt{5}$</td><td><code>-√5</code></td></tr>
        <tr><td>$\\dfrac{\\sqrt{5}}{2}$</td><td><code>√5/2</code></td></tr>
        <tr><td>$\\dfrac{2\\sqrt{3}}{3}$</td><td><code>2√3/3</code></td></tr></table>
      <p class="klein">Onder het invulvak zie je meteen hoe je antwoord gelezen wordt. Controleer dat voor je verdergaat.</p></div>`,
  voorbeelden: [
    { tex: '\\sqrt{48}', stappen: ['48 = 16 \\cdot 3 \\quad (16 \\text{ is het grootste kwadraat})', '\\sqrt{48} = \\sqrt{16} \\cdot \\sqrt{3}', '= 4\\sqrt{3}'] },
    { tex: '\\sqrt{6} \\cdot \\sqrt{3}', stappen: ['= \\sqrt{18}', '= \\sqrt{9 \\cdot 2} = 3\\sqrt{2}'] },
    { tex: '2\\sqrt{5} \\cdot 3\\sqrt{5}', stappen: ['= 2 \\cdot 3 \\cdot \\sqrt{5} \\cdot \\sqrt{5}', '= 6 \\cdot 5 = 30'] },
    { tex: '9\\sqrt{7} - 4\\sqrt{7} + \\sqrt{7}', stappen: ['\\text{gelijksoortig: allemaal } \\sqrt{7}', '(9 - 4 + 1)\\sqrt{7} = 6\\sqrt{7}'] },
    { tex: '\\sqrt{18} + \\sqrt{32}', stappen: ['\\sqrt{18} = 3\\sqrt{2} \\quad \\text{en} \\quad \\sqrt{32} = 4\\sqrt{2}', '3\\sqrt{2} + 4\\sqrt{2} = 7\\sqrt{2}'] },
    { tex: '\\dfrac{1}{\\sqrt{2}}', stappen: ['= \\dfrac{1 \\cdot \\sqrt{2}}{\\sqrt{2} \\cdot \\sqrt{2}}', '= \\dfrac{\\sqrt{2}}{2}'] },
    { tex: '\\dfrac{5}{2\\sqrt{5}}', stappen: ['= \\dfrac{5 \\cdot \\sqrt{5}}{2\\sqrt{5} \\cdot \\sqrt{5}} = \\dfrac{5\\sqrt{5}}{10}', '= \\dfrac{\\sqrt{5}}{2} \\quad \\text{(vereenvoudig de breuk)}'] },
  ],
  soorten: {
    vereenvoudig: { naam: 'Vereenvoudigen', gen() {
      let k, m; do { k = rnd(2, 10); m = kies(KW); } while (k * k * m > 300);
      const n = k * k * m;
      return { soort: 'vereenvoudig', opdracht: 'Vereenvoudig.', tex: `\\sqrt{${n}}`, antw: expr(wE(k, m), ['vereenvoudigd']),
        uitleg: [`\\sqrt{${n}} = \\sqrt{${k * k} \\cdot ${m}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${wTex(k, m)}`] };
    } },
    vermenigvuldig: { naam: 'Vermenigvuldigen', gen() {
      const vorm = kies(['ww', 'ww', 'zelfde', 'coefzelfde', 'coef']);
      let tex, k, n, stap;
      if (vorm === 'ww') {
        let a, b; do { a = rnd(2, 12); b = rnd(2, 20); } while (isKwadraat(a) || isKwadraat(b) || a === b);
        tex = `\\sqrt{${a}} \\cdot \\sqrt{${b}}`; ({ k, m: n } = vereenv(1, a * b)); stap = `= \\sqrt{${a * b}}`;
      } else if (vorm === 'zelfde') { const a = kies(KW); tex = `\\sqrt{${a}} \\cdot \\sqrt{${a}}`; k = a; n = 1; stap = ''; }
      else if (vorm === 'coefzelfde') { const a = kies(KW), p = rnd(2, 6), q = Math.random() < 0.3 ? 1 : rnd(2, 6); tex = `${p}\\sqrt{${a}} \\cdot ${coefTex(q)}\\sqrt{${a}}`; k = p * q * a; n = 1; stap = `= ${p} \\cdot ${q} \\cdot \\sqrt{${a}} \\cdot \\sqrt{${a}} = ${p * q} \\cdot ${a}`; }
      else { let a, b; do { a = kies(KW); b = kies(KW); } while (a === b || haalUit(a * b).k > 1); const p = rnd(2, 6), q = rnd(2, 6); tex = `${p}\\sqrt{${a}} \\cdot ${q}\\sqrt{${b}}`; k = p * q; n = a * b; stap = `= ${p} \\cdot ${q} \\cdot \\sqrt{${a} \\cdot ${b}}`; }
      return { soort: 'vermenigvuldig', opdracht: 'Vermenigvuldig. Vereenvoudig je resultaat als het kan.', tex, antw: expr(wE(k, n), ['vereenvoudigd']), uitleg: [stap === `= \\sqrt{${k === 1 ? n : ''}}` || stap === `= \\sqrt{${n}}` && k === 1 ? `${tex} ${stap}` : `${tex} ${stap} = ${wTex(k, n)}`] };
    } },
    optellen: { naam: 'Optellen en aftrekken', gen() {
      const m = kies(KW), n = Math.random() < 0.35 ? 3 : 2;
      const c = Array.from({ length: n }, () => rnd(1, 9)), t = c.map((x, i) => i && Math.random() < 0.45 ? -x : x);
      const som = t.reduce((a, b) => a + b, 0);
      const tex = t.map((x, i) => `${i ? (x < 0 ? '- ' : '+ ') : ''}${coefTex(Math.abs(x))}\\sqrt{${m}}`).join(' ');
      return { soort: 'optellen', opdracht: 'Tel op of trek af.', tex, antw: expr(wE(som, m), ['vereenvoudigd']),
        uitleg: [`\\text{gelijksoortig: } (${t.map((x, i) => i ? (x < 0 ? `- ${-x}` : `+ ${x}`) : x).join(' ')})\\sqrt{${m}} = ${wTex(som, m)}`] };
    } },
    eerstvereenv: { naam: 'Eerst vereenvoudigen, dan optellen', gen() {
      let m, k1, k2; do { m = kies([2, 3, 5, 6, 7]); k1 = rnd(1, 7); k2 = rnd(1, 7); } while (k1 === k2 || (k1 === 1 && k2 === 1) || k1 * k1 * m > 250 || k2 * k2 * m > 250);
      const plus = Math.random() < 0.6, uit = plus ? k1 + k2 : k1 - k2;
      const tex = `\\sqrt{${k1 * k1 * m}} ${plus ? '+' : '-'} \\sqrt{${k2 * k2 * m}}`;
      return { soort: 'eerstvereenv', opdracht: 'Vereenvoudig eerst en tel dan op of trek af.', tex, antw: expr(wE(uit, m), ['vereenvoudigd']),
        uitleg: [`${tex} = ${wTex(k1, m)} ${plus ? '+' : '-'} ${wTex(k2, m)} = ${wTex(uit, m)}`] };
    } },
    wortelvrij: { naam: 'Noemer wortelvrij maken', gen() {
      const b = kies(KW), a = rnd(1, 12), c = Math.random() < 0.35 ? rnd(2, 4) : 1;
      // a / (c√b) = a√b / (c·b)
      const g = ggd(a, c * b), p = a / g, q = c * b / g;
      const noemer = `${c === 1 ? '' : c}\\sqrt{${b}}`, tex = `\\dfrac{${a}}{${noemer}}`;
      let ant, at;
      if (q === 1) { ant = wE(p, b); at = wTex(p, b); }
      else { ant = `${p === 1 ? '' : p}√(${b})/${q}`; at = `\\dfrac{${coefTex(p)}\\sqrt{${b}}}{${q}}`; }
      const stap1 = `\\dfrac{${a} \\cdot \\sqrt{${b}}}{${noemer} \\cdot \\sqrt{${b}}} = \\dfrac{${coefTex(a)}\\sqrt{${b}}}{${c * b}}`;
      return { soort: 'wortelvrij', opdracht: 'Maak de noemer wortelvrij. Vereenvoudig je resultaat als het kan.', tex, antw: expr(ant, ['wortelvrij'], { tex: at }),
        uitleg: [`${tex} = ${stap1}${g > 1 ? ` = ${at}` : ''}`] };
    } },
  },
  oefenMix: [['vereenvoudig', 2], ['vermenigvuldig', 2], ['optellen', 2], ['eerstvereenv', 2], ['wortelvrij', 2]],
  test: [['vereenvoudig', 2], ['vermenigvuldig', 2], ['optellen', 2], ['eerstvereenv', 2], ['wortelvrij', 2]],
};
