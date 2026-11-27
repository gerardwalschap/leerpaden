// Programma 'functie-c-op-x' — automatisch samengevoegd uit bron/functie-c-op-x/ (niet rechtstreeks bewerken)
(() => {
// ===== De functie f(x) = c/x · Toegepaste wiskunde 4BW =====
// Leidraad: cursus TWiskunde 4BW hoofdstuk 4 "De functie f(x) = c/x" en de PWP/werkbundel (G. Walschap).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(x);
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud(opties.map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const texKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud(opties.map(o => ({ k: o, l: o }))), juist });
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const fr = (c) => `\\dfrac{${c}}{x}`;                         // c/x in TeX
const ftex = (c, n = 'f') => `${n}(x) = ${c < 0 ? '-' : ''}\\dfrac{${Math.abs(c)}}{x}`;
const deler = (c) => { const d = []; for (let k = 1; k <= Math.abs(c); k++) if (c % k === 0) d.push(k); return d; };
const kg = (x) => String(x).replace('.', ',').replace('-', '−');

// ---------- grafiek van één of meer hyperbolen (twee takken, met de asymptoten als assen)
function hyperbool(cs, opt = {}) {
  const R = opt.r || 8, B = 300, m = 18, X = (x) => m + (x + R) / (2 * R) * B, Y = (y) => m + (R - y) / (2 * R) * B;
  let g = '';
  for (let k = -R; k <= R; k++) g += `<line x1="${X(k)}" y1="${Y(-R)}" x2="${X(k)}" y2="${Y(R)}" stroke="#e3e7ee"/><line x1="${X(-R)}" y1="${Y(k)}" x2="${X(R)}" y2="${Y(k)}" stroke="#e3e7ee"/>`;
  for (let k = -R + 2; k < R; k += 2) if (k) g += `<text x="${X(k)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle" fill="#555">${k < 0 ? '−' + -k : k}</text><text x="${X(0) - 5}" y="${Y(k) + 4}" font-size="10" text-anchor="end" fill="#555">${k < 0 ? '−' + -k : k}</text>`;
  g += `<line x1="${X(-R)}" y1="${Y(0)}" x2="${X(R)}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.3"/><line x1="${X(0)}" y1="${Y(-R)}" x2="${X(0)}" y2="${Y(R)}" stroke="#1f2733" stroke-width="1.3"/>`;
  g += `<text x="${X(R) - 4}" y="${Y(0) - 6}" font-size="12" text-anchor="end" font-style="italic">x</text><text x="${X(0) + 6}" y="${Y(R) + 12}" font-size="12" font-style="italic">y</text>`;
  const kl = ['#1c4e8a', '#e8772e', '#2e7d4f'];
  cs.forEach((c, j) => {
    for (const s of [-1, 1]) {
      let d = '', eerst = true;
      for (let i = 0; i <= 300; i++) {
        const x = s * (0.05 + (R - 0.05) * i / 300), y = c / x;
        if (Math.abs(y) > R + 1) { eerst = true; continue; }
        d += `${eerst ? 'M' : 'L'}${X(x).toFixed(1)},${Y(y).toFixed(1)} `; eerst = false;
      }
      g += `<path d="${d}" fill="none" stroke="${kl[j]}" stroke-width="2.6"/>`;
    }
    if (opt.namen) { const x = R * 0.72 * (c > 0 ? 1 : -1), y = c / x; g += `<text x="${X(x) + 4}" y="${Y(y) - 8}" font-size="13" font-weight="bold" fill="${kl[j]}" font-style="italic">${opt.namen[j]}</text>`; }
  });
  for (const [x, y] of opt.punten || []) g += `<circle cx="${X(x)}" cy="${Y(y)}" r="4.5" fill="#e8772e"/><text x="${X(x) + 7}" y="${Y(y) - 7}" font-size="11" fill="#c2561a">(${kg(x)}, ${kg(y)})</text>`;
  return `<div class="figuur"><svg viewBox="0 0 ${B + 2 * m} ${B + 2 * m}" width="${B + 2 * m}" height="${B + 2 * m}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek van een hyperbool" style="font-family:Verdana,sans-serif;max-width:100%"><defs><clipPath id="hb${cs.join('_').replace(/-/g, 'm')}"><rect x="${m}" y="${m}" width="${B}" height="${B}"/></clipPath></defs><g clip-path="url(#hb${cs.join('_').replace(/-/g, 'm')})">${g}</g></svg></div>`;
}
const tabelHTML = (rijen) => `<table class="tabel" style="margin:8px auto">${rijen.map((r, i) => `<tr>${r.map(c => i === 0 && false ? `<th>${c}</th>` : `<td style="text-align:center;min-width:44px">${c}</td>`).join('')}</tr>`).join('')}</table>`;

const STIJL = `.vraagzin{margin-top:12px;font-size:16px}`;
if (typeof document !== 'undefined' && document.head && !document.getElementById('cx-stijl')) { const st = document.createElement('style'); st.id = 'cx-stijl'; st.textContent = STIJL; document.head.appendChild(st); }
const DEF = `<div class="kader def"><div class="kader-titel">Omgekeerd evenredig verband</div>
  <p>Twee grootheden $x$ en $y$ zijn <b>omgekeerd evenredig</b> als hun product constant is: $x \\cdot y = c$, ofwel $y = \\dfrac{c}{x}$, met $c \\in \\mathbb{R}_0$.</p>
  <p>De functie $f(x) = \\dfrac{c}{x}$ heet een <b>hyperbool</b>; $c$ is de <b>evenredigheidsfactor</b>.</p></div>`;
const OVERZICHT = `<table class="tabel"><tr><th>Kenmerk</th><th>$c > 0$</th><th>$c < 0$</th></tr>
  <tr><td>domein</td><td>$\\mathbb{R}_0$</td><td>$\\mathbb{R}_0$</td></tr><tr><td>bereik</td><td>$\\mathbb{R}_0$</td><td>$\\mathbb{R}_0$</td></tr>
  <tr><td>nulwaarden</td><td>geen</td><td>geen</td></tr><tr><td>tekenverloop</td><td>$+$ voor $x > 0$, $-$ voor $x < 0$</td><td>$-$ voor $x > 0$, $+$ voor $x < 0$</td></tr>
  <tr><td>stijgen/dalen</td><td>dalend op $]-\\infty, 0[$ en op $]0, +\\infty[$</td><td>stijgend op $]-\\infty, 0[$ en op $]0, +\\infty[$</td></tr>
  <tr><td>symmetrie</td><td colspan="2">puntsymmetrisch t.o.v. de oorsprong</td></tr><tr><td>asymptoten</td><td colspan="2">$x = 0$ (verticaal) en $y = 0$ (horizontaal)</td></tr></table>`;
const cWaarden = [2, 3, 4, 5, 6, 8, 10, 12, 16, 18, 20, 24, 30, 36];
const kiesC = (neg = true) => kies(cWaarden) * (neg && Math.random() < 0.45 ? -1 : 1);

// ===================================================================
//  A · OMGEKEERD EVENREDIG
// ===================================================================
const D1 = {
  nr: 1, titel: 'Omgekeerd evenredig verband', kort: 'x · y = c, dus y = c/x.', rekenmachine: false,
  theorie: `${DEF}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>Je verdeelt een budget van 24 euro eerlijk onder $x$ personen. Elke persoon krijgt $\\dfrac{24}{x}$ euro.</p>
      <p>Verdubbel je het aantal personen, dan <b>halveert</b> het bedrag per persoon: $x \\cdot y = 24$ blijft constant.</p></div>
    <div class="kader eig"><div class="kader-titel">Recht of omgekeerd evenredig?</div>
      <p>Recht evenredig ($y = ax$): het <b>quotiënt</b> $y : x$ is constant. Omgekeerd evenredig ($y = \\frac{c}{x}$): het <b>product</b> $x \\cdot y$ is constant.</p></div>`,
  voorbeelden: [
    { tex: '\\begin{array}{c|ccc} x & 2 & 4 & 8 \\\\ \\hline y & 12 & 6 & 3 \\end{array}', stappen: ['2 \\cdot 12 = 24, \\; 4 \\cdot 6 = 24, \\; 8 \\cdot 3 = 24', '\\text{het product is constant: omgekeerd evenredig met } c = 24'] },
  ],
  soorten: {
    herken: { naam: 'Omgekeerd evenredig of niet?', gen() {
      const c = kies([12, 18, 24, 30, 36, 48, 60]), xs = schud(deler(c).filter(d => d > 1 && d < c)).slice(0, 3).sort((a, b) => a - b), soort = kies(['omg', 'omg', 'recht', 'geen']);
      const ys = xs.map(x => soort === 'omg' ? c / x : soort === 'recht' ? 2 * x : c / x + 1);
      const ja = soort === 'omg';
      return { soort: 'herken', opdracht: 'Bekijk de tabel.', tex: `\\begin{array}{c|ccc} x & ${xs.join(' & ')} \\\\ \\hline y & ${ys.map(tg).join(' & ')} \\end{array}`, html: vraag('Zijn x en y omgekeerd evenredig?'), sleutel: `${c}${soort}${xs}`,
        antw: tekstKeuze(['ja', 'nee'], ja ? 'ja' : 'nee'), uitleg: [`${xs.map((x, i) => `${x} \\cdot ${tg(ys[i])} = ${tg(x * ys[i])}`).join(', \\; ')}`, ja ? '\\text{het product is constant: omgekeerd evenredig}' : '\\text{het product is niet constant: niet omgekeerd evenredig}'] };
    } },
    c: { naam: 'De evenredigheidsfactor c', gen() {
      const c = kiesC(), x = kies(deler(Math.abs(c)).filter(d => d > 1)) * kies([1, -1]), y = c / x;
      return { soort: 'c', opdracht: 'x en y zijn omgekeerd evenredig.', html: vraag(`Voor x = ${kg(x)} is y = ${kg(y)}. Bepaal de evenredigheidsfactor c.`), sleutel: `c${c}${x}`,
        antw: getal(c, { voor: 'c =' }), uitleg: [`c = x \\cdot y = ${tg(x)} \\cdot ${y < 0 ? `(${tg(y)})` : tg(y)} = ${tg(c)}`] };
    } },
    ontbrekend: { naam: 'Ontbrekende waarden', gen() {
      const c = kies([12, 18, 24, 30, 36, 48, 60, 72]), ds = schud(deler(c).filter(d => d > 1 && d < c)).slice(0, 3).sort((a, b) => a - b);
      return { soort: 'ontbrekend', opdracht: 'x en y zijn omgekeerd evenredig. Vul de tabel aan.', tex: `\\begin{array}{c|ccc} x & ${ds[0]} & ${ds[1]} & ${ds[2]} \\\\ \\hline y & ${c / ds[0]} & \\ldots & \\ldots \\end{array}`, sleutel: `o${c}${ds}`,
        antw: { soort: 'delen', delen: [{ label: `x = ${ds[1]}: \\; y =`, antw: getal(c / ds[1]) }, { label: `x = ${ds[2]}: \\; y =`, antw: getal(c / ds[2]) }] },
        uitleg: [`c = ${ds[0]} \\cdot ${c / ds[0]} = ${c}`, `y = \\dfrac{${c}}{${ds[1]}} = ${c / ds[1]} \\qquad y = \\dfrac{${c}}{${ds[2]}} = ${c / ds[2]}`] };
    } },
    context: { naam: 'In een situatie', gen() {
      const t = kies(['budget', 'werk', 'stapels']);
      if (t === 'budget') { const c = kies([36, 48, 60, 72, 90, 120]), x = kies(deler(c).filter(d => d > 2 && d < 13)); return { soort: 'context', html: opgave(`Een budget van ${c} euro wordt eerlijk verdeeld onder x personen.`) + vraag(`Hoeveel euro krijgt elke persoon als er ${x} personen zijn?`), sleutel: `b${c}${x}`, antw: getal(c / x, { na: '\\text{ euro}' }), uitleg: [`y = \\dfrac{${c}}{${x}} = ${tg(c / x)} \\text{ euro}`] }; }
      if (t === 'werk') { const p = kies([2, 3, 4]), d = kies([6, 8, 12, 15]), c = p * d, q = kies(deler(c).filter(k => k > 1 && k !== p && k < c)); return { soort: 'context', html: opgave(`${p} schilders hebben ${d} dagen nodig om een gebouw te schilderen. Het aantal dagen is omgekeerd evenredig met het aantal schilders.`) + vraag(`Hoeveel dagen hebben ${q} schilders nodig?`), sleutel: `w${p}${d}${q}`, antw: getal(c / q, { na: '\\text{ dagen}' }), uitleg: [`c = ${p} \\cdot ${d} = ${c}`, `\\text{dagen} = \\dfrac{${c}}{${q}} = ${tg(c / q)}`] }; }
      const n = kies([24, 36, 48, 60]), h = kies(deler(n).filter(k => k > 1 && k < n)), h2 = kies(deler(n).filter(k => k > 1 && k < n && k !== h));
      return { soort: 'context', html: opgave(`Je stapelt ${n} dozen in ${h} gelijke stapels. Elke stapel telt dan ${n / h} dozen.`) + vraag(`Hoeveel dozen telt elke stapel als je ${h2} gelijke stapels maakt?`), sleutel: `s${n}${h}${h2}`, antw: getal(n / h2, { na: '\\text{ dozen}' }), uitleg: [`c = ${h} \\cdot ${n / h} = ${n}`, `\\dfrac{${n}}{${h2}} = ${n / h2}`] };
    } },
  },
  oefenMix: [['herken', 2], ['c', 2], ['ontbrekend', 2], ['context', 2]],
  test: [['herken', 3], ['c', 2], ['ontbrekend', 2], ['context', 3]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'De grafiek tekenen', kort: 'Een tabel van waarden en de hyperbool.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Tabel van waarden</div>
      <p>Om de grafiek te tekenen, stel je een <b>tabel van waarden</b> op. $x = 0$ mag nooit: delen door 0 kan niet.</p>
      <p class="midden">$f(x) = \\dfrac{6}{x}: \\qquad \\begin{array}{c|cccccccc} x & -6 & -3 & -2 & -1 & 1 & 2 & 3 & 6 \\\\ \\hline f(x) & -1 & -2 & -3 & -6 & 6 & 3 & 2 & 1 \\end{array}$</p></div>
    ${hyperbool([6], { punten: [[1, 6], [2, 3], [3, 2], [6, 1], [-2, -3]] })}
    <div class="kader eig"><div class="kader-titel">De hyperbool</div><p>De grafiek bestaat uit <b>twee gescheiden takken</b>. Ze nadert de $x$-as en de $y$-as, maar raakt ze nooit.</p></div>`,
  voorbeelden: [
    { tex: 'f(x) = \\dfrac{8}{x}, \\; f(-4) = ?', stappen: ['f(-4) = \\dfrac{8}{-4} = -2'] },
    { tex: 'f(x) = \\dfrac{12}{x}: \\text{ voor welke } x \\text{ is } f(x) = 3?', stappen: ['\\dfrac{12}{x} = 3 \\Rightarrow x = \\dfrac{12}{3} = 4'] },
  ],
  soorten: {
    waarde: { naam: 'Functiewaarde berekenen', gen() {
      const c = kiesC(), a = kies(deler(Math.abs(c))) * kies([1, -1]);
      return { soort: 'waarde', opdracht: 'Bereken de functiewaarde.', tex: `${ftex(c)}, \\quad f(${tg(a)}) = \\; ?`, sleutel: `w${c}${a}`, antw: getal(c / a, { voor: `f(${kg(a)}) =` }), uitleg: [`f(${tg(a)}) = \\dfrac{${tg(c)}}{${a < 0 ? `(${tg(a)})` : tg(a)}} = ${tg(c / a)}`] };
    } },
    tabel: { naam: 'Tabel van waarden', gen() {
      const c = kies([6, 8, 12, 18, 24, -6, -8, -12]), ds = schud(deler(Math.abs(c))).slice(0, 3).map((d, i) => i === 1 ? -d : d);
      return { soort: 'tabel', opdracht: 'Vul de tabel van waarden aan.', tex: `${ftex(c)}: \\qquad \\begin{array}{c|ccc} x & ${ds.map(tg).join(' & ')} \\\\ \\hline f(x) & \\ldots & \\ldots & \\ldots \\end{array}`, sleutel: `t${c}${ds}`,
        antw: { soort: 'delen', delen: ds.map(d => ({ label: `f(${kg(d)}) =`, antw: getal(c / d) })) }, uitleg: ds.map(d => `f(${tg(d)}) = \\dfrac{${tg(c)}}{${d < 0 ? `(${tg(d)})` : tg(d)}} = ${tg(c / d)}`) };
    } },
    aflezen: { naam: 'c aflezen uit de grafiek', gen() {
      const c = kies([2, 3, 4, 6, 8, 12, -2, -3, -4, -6, -8, -12]), x = kies(deler(Math.abs(c)).filter(d => Math.abs(c / d) <= 7 && d <= 7)) * kies([1, -1]);
      return { soort: 'aflezen', opdracht: 'Het punt ligt op de grafiek van f(x) = c/x.', html: hyperbool([c], { punten: [[x, c / x]] }) + vraag('Bepaal c.'), sleutel: `a${c}${x}`, antw: getal(c, { voor: 'c =' }), uitleg: [`c = x \\cdot y = ${tg(x)} \\cdot ${c / x < 0 ? `(${tg(c / x)})` : tg(c / x)} = ${tg(c)}`] };
    } },
    zoekx: { naam: 'x zoeken bij een functiewaarde', gen() {
      const c = kiesC(), k = kies(deler(Math.abs(c))) * kies([1, -1]);
      return { soort: 'zoekx', opdracht: 'Los op.', tex: `${ftex(c)}: \\text{ voor welke } x \\text{ is } f(x) = ${tg(k)}?`, sleutel: `z${c}${k}`, antw: getal(c / k, { voor: 'x =' }), uitleg: [`\\dfrac{${tg(c)}}{x} = ${tg(k)} \\Rightarrow x = \\dfrac{${tg(c)}}{${k < 0 ? `(${tg(k)})` : tg(k)}} = ${tg(c / k)}`] };
    } },
  },
  oefenMix: [['waarde', 2], ['tabel', 2], ['aflezen', 2], ['zoekx', 2]],
  test: [['waarde', 3], ['tabel', 2], ['aflezen', 3], ['zoekx', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Invloed van c', kort: 'Het teken van c (kwadranten) en de grootte van |c|.', rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Het teken van c</div>
      <p>$c > 0$: de takken liggen in <b>kwadrant I en III</b>. &nbsp; $c < 0$: de takken liggen in <b>kwadrant II en IV</b>.</p></div>
    ${hyperbool([4, -4], { namen: ['c = 4', 'c = −4'] })}
    <div class="kader eig"><div class="kader-titel">De grootte van |c|</div>
      <p>Hoe <b>groter</b> $|c|$, hoe <b>verder</b> de takken van de oorsprong liggen. Hoe kleiner $|c|$, hoe dichter bij de oorsprong (en dus ook dichter bij de assen).</p></div>
    ${hyperbool([1, 4, 12], { namen: ['c = 1', 'c = 4', 'c = 12'] })}`,
  voorbeelden: [
    { tex: 'f(x) = -\\dfrac{5}{x}', stappen: ['c = -5 < 0', '\\text{de takken liggen in kwadrant II en IV}'] },
    { tex: 'f(x) = \\dfrac{3}{x} \\text{ en } g(x) = \\dfrac{15}{x}', stappen: ['|3| < |15|', '\\text{de takken van } f \\text{ liggen dichter bij de oorsprong}'] },
  ],
  soorten: {
    kwadrant: { naam: 'In welke kwadranten?', gen() {
      const c = kiesC();
      return { soort: 'kwadrant', opdracht: 'Zonder te tekenen.', tex: ftex(c), html: vraag('In welke kwadranten liggen de takken van de grafiek?'), sleutel: `k${c}`,
        antw: tekstKeuze(['kwadrant I en III', 'kwadrant II en IV', 'kwadrant I en II', 'kwadrant III en IV'], c > 0 ? 'kwadrant I en III' : 'kwadrant II en IV'), uitleg: [`c = ${tg(c)} ${c > 0 ? '> 0' : '< 0'}`, tx(c > 0 ? 'kwadrant I en III' : 'kwadrant II en IV')] };
    } },
    dichter: { naam: 'Dichter bij de oorsprong?', gen() {
      let a = kiesC(), b; do { b = kiesC(); } while (Math.abs(b) === Math.abs(a));
      const j = Math.abs(a) < Math.abs(b) ? 'f' : 'g';
      return { soort: 'dichter', opdracht: 'Zonder te tekenen.', tex: `${ftex(a)} \\qquad ${ftex(b, 'g')}`, html: vraag('Van welke functie liggen de takken dichter bij de oorsprong?'), sleutel: `d${a}${b}`,
        antw: tekstKeuze(['f', 'g'], j), uitleg: [`|${tg(a)}| = ${Math.abs(a)} \\text{ en } |${tg(b)}| = ${Math.abs(b)}`, `\\text{kleinere } |c| \\Rightarrow \\text{dichter bij de oorsprong: } ${j}`] };
    } },
    welke: { naam: 'Welk voorschrift hoort bij de grafiek?', gen() {
      const c = kies([2, 4, 8, -2, -4, -8]), opties = [c, -c, c * 4, -c * 4].map(fr2 => ftex(fr2).replace('f(x) = ', ''));
      return { soort: 'welke', opdracht: 'Bekijk de grafiek.', html: hyperbool([c]) + vraag('Welk voorschrift hoort bij deze grafiek?'), sleutel: `g${c}`,
        antw: texKeuze(opties, opties[0]), uitleg: [`\\text{kwadranten } ${c > 0 ? '\\text{I en III} \\Rightarrow c > 0' : '\\text{II en IV} \\Rightarrow c < 0'}`, `\\text{punt } (2, ${tg(c / 2)}) \\text{ ligt op de grafiek: } c = 2 \\cdot ${c < 0 ? `(${tg(c / 2)})` : tg(c / 2)} = ${tg(c)}`] };
    } },
  },
  oefenMix: [['kwadrant', 2], ['dichter', 2], ['welke', 2]],
  test: [['kwadrant', 4], ['dichter', 3], ['welke', 3]], testSchudden: true,
};

// ===================================================================
//  B · KENMERKEN
// ===================================================================
const VERZ = ['\\mathbb{R}', '\\mathbb{R}_0', '\\mathbb{R}^+', '\\mathbb{R}^-'];
const D4 = {
  nr: 4, titel: 'Domein, bereik en nulwaarden', kort: 'dom f = ber f = ℝ₀ · geen nulwaarden.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Domein en bereik</div>
      <p>$x = 0$ mag niet (delen door 0): het <b>domein</b> is $\\mathbb{R}_0 = \\mathbb{R} \\setminus \\{0\\}$.</p>
      <p>$f(x) = \\frac{c}{x}$ kan nooit 0 worden (een breuk met teller $c \\neq 0$ is nooit 0): het <b>bereik</b> is ook $\\mathbb{R}_0$.</p></div>
    <div class="kader def"><div class="kader-titel">Nulwaarden</div>
      <p>$f(x) = \\frac{c}{x}$ heeft <b>geen nulwaarden</b>: $\\frac{c}{x} = 0$ heeft geen oplossing, want een breuk is enkel 0 als de teller 0 is, en $c \\neq 0$.</p></div>`,
  voorbeelden: [{ tex: 'f(x) = \\dfrac{10}{x}', stappen: ['\\text{dom } f = \\mathbb{R}_0', '\\text{ber } f = \\mathbb{R}_0', '\\text{geen nulwaarden}'] }],
  soorten: {
    domein: { naam: 'Domein', gen() { const c = kiesC(); return { soort: 'domein', tex: ftex(c), html: vraag('Wat is het domein van f?'), sleutel: `do${c}`, antw: texKeuze(VERZ.map(v => `\\text{dom } f = ${v}`), '\\text{dom } f = \\mathbb{R}_0'), uitleg: ['x = 0 \\text{ mag niet (delen door 0)}', '\\text{dom } f = \\mathbb{R}_0'] }; } },
    bereik: { naam: 'Bereik', gen() { const c = kiesC(); return { soort: 'bereik', tex: ftex(c), html: vraag('Wat is het bereik van f?'), sleutel: `be${c}`, antw: texKeuze(VERZ.map(v => `\\text{ber } f = ${v}`), '\\text{ber } f = \\mathbb{R}_0'), uitleg: [`\\dfrac{${tg(c)}}{x} \\text{ wordt nooit 0}`, '\\text{ber } f = \\mathbb{R}_0'] }; } },
    nul: { naam: 'Nulwaarden', gen() { const c = kiesC(); return { soort: 'nul', tex: ftex(c), html: vraag('Hoeveel nulwaarden heeft f?'), sleutel: `nu${c}`, antw: tekstKeuze(['geen', 'één: x = 0', `één: x = ${kg(c)}`, 'twee'], 'geen'), uitleg: [`\\dfrac{${tg(c)}}{x} = 0 \\text{ heeft geen oplossing: de teller } ${tg(c)} \\neq 0`, tx('geen')] }; } },
    snijpunt: { naam: 'Snijpunten met de assen', gen() { const c = kiesC(), as = kies(['x', 'y']); return { soort: 'snijpunt', tex: ftex(c), html: vraag(`Snijdt de grafiek de ${as}-as?`), sleutel: `sn${c}${as}`,
      antw: tekstKeuze(['nee', 'ja, in de oorsprong', `ja, in één punt`], 'nee'), uitleg: [as === 'x' ? '\\text{snijpunt met de } x\\text{-as} \\Leftrightarrow f(x) = 0: \\text{ geen nulwaarden}' : '\\text{snijpunt met de } y\\text{-as} \\Leftrightarrow x = 0: \\text{ niet in het domein}', tx('nee')] }; } },
  },
  oefenMix: [['domein', 2], ['bereik', 2], ['nul', 2], ['snijpunt', 2]],
  test: [['domein', 3], ['bereik', 2], ['nul', 3], ['snijpunt', 2]], testSchudden: true,
};

const STIJG = { daal: 'dalend op ]−∞, 0[ en op ]0, +∞[', stijg: 'stijgend op ]−∞, 0[ en op ]0, +∞[', overal: 'dalend over heel ℝ', stijgDaal: 'stijgend op ]−∞, 0[ en dalend op ]0, +∞[' };
const D5 = {
  nr: 5, titel: 'Tekenverloop, stijgen en dalen', kort: 'Teken volgens c · stijgen/dalen per deelinterval · afnemend.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Tekenverloop</div>
      <p>Bij $c > 0$ volgt het teken van $f(x)$ het teken van $x$: $f(x) > 0$ voor $x > 0$ en $f(x) < 0$ voor $x < 0$. Bij $c < 0$ is dit net omgekeerd.</p></div>
    <div class="kader def"><div class="kader-titel">Stijgen en dalen</div>
      <p>$c > 0$: <b>dalend</b> op $]-\\infty, 0[$ en op $]0, +\\infty[$. &nbsp; $c < 0$: <b>stijgend</b> op $]-\\infty, 0[$ en op $]0, +\\infty[$.</p>
      <p class="klein">Let op: je spreekt over stijgen/dalen <b>per deelinterval</b>. Het domein bestaat uit twee gescheiden stukken door de onderbreking in $x = 0$.</p></div>
    <div class="kader eig"><div class="kader-titel">Afnemende stijging/daling</div>
      <p>Hoe verder $x$ van 0, hoe trager $f(x)$ verandert: de daling/stijging is <b>afnemend</b>. Bij een tweedegraadsfunctie was dat net toenemend.</p></div>`,
  voorbeelden: [{ tex: 'f(x) = -\\dfrac{3}{x}', stappen: ['c = -3 < 0', 'f(x) > 0 \\text{ voor } x < 0 \\text{ en } f(x) < 0 \\text{ voor } x > 0', '\\text{stijgend op } ]-\\infty, 0[ \\text{ en op } ]0, +\\infty['] }],
  soorten: {
    teken: { naam: 'Positief of negatief?', gen() { const c = kiesC(), a = nz(-9, 9), pos = c / a > 0; return { soort: 'teken', tex: `${ftex(c)}, \\quad x = ${tg(a)}`, html: vraag(`Is f(${kg(a)}) positief of negatief?`), sleutel: `te${c}${a}`,
      antw: tekstKeuze(['positief', 'negatief'], pos ? 'positief' : 'negatief'), uitleg: [`f(${tg(a)}) = \\dfrac{${tg(c)}}{${a < 0 ? `(${tg(a)})` : tg(a)}}: \\text{ ${pos ? 'zelfde' : 'verschillend'} teken}`, tx(pos ? 'positief' : 'negatief')] }; } },
    positief: { naam: 'Waar is f(x) > 0?', gen() { const c = kiesC(), groter = kies([true, false]), juist = (c > 0) === groter ? 'voor x > 0' : 'voor x < 0';
      return { soort: 'positief', tex: ftex(c), html: vraag(`Voor welke x is f(x) ${groter ? '> 0' : '< 0'}?`), sleutel: `po${c}${groter}`, antw: tekstKeuze(['voor x > 0', 'voor x < 0', 'voor alle x verschillend van 0', 'voor geen enkele x'], juist),
        uitleg: [`c = ${tg(c)} ${c > 0 ? '> 0: \\text{ teken van } f(x) = \\text{ teken van } x' : '< 0: \\text{ teken van } f(x) \\text{ is omgekeerd}'}`, tx(juist)] }; } },
    stijgen: { naam: 'Stijgen of dalen', gen() { const c = kiesC(), j = c > 0 ? STIJG.daal : STIJG.stijg;
      return { soort: 'stijgen', tex: ftex(c), html: vraag('Waar stijgt of daalt f?'), sleutel: `st${c}`, antw: tekstKeuze(Object.values(STIJG), j), uitleg: [`c = ${tg(c)} ${c > 0 ? '> 0' : '< 0'}`, tx(j)] }; } },
    afname: { naam: 'Toenemend of afnemend?', gen() { const c = kies([12, 24, 36, -12, -24]), [a, b, d] = [1, 2, 3];
      const v1 = c / b - c / a, v2 = c / d - c / b;
      return { soort: 'afname', tex: ftex(c), html: vraag(`f verandert van x = 1 naar x = 2 met ${kg(v1)}, en van x = 2 naar x = 3 met ${kg(W.rond(v2, 2))}. Is de ${c > 0 ? 'daling' : 'stijging'} toenemend of afnemend?`), sleutel: `af${c}`,
        antw: tekstKeuze(['toenemend', 'afnemend'], 'afnemend'), uitleg: [`|${tg(v1)}| > |${tg(W.rond(v2, 2))}|: f \\text{ verandert steeds trager}`, tx('afnemend')] }; } },
  },
  oefenMix: [['teken', 2], ['positief', 2], ['stijgen', 2], ['afname', 1]],
  test: [['teken', 3], ['positief', 3], ['stijgen', 3], ['afname', 1]], testSchudden: true,
};

const D6 = {
  nr: 6, titel: 'Symmetrie en asymptoten', kort: 'Puntsymmetrisch t.o.v. de oorsprong · asymptoten x = 0 en y = 0.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Symmetrie</div>
      <p>De grafiek is <b>puntsymmetrisch</b> ten opzichte van de oorsprong: $f(-x) = \\dfrac{c}{-x} = -\\dfrac{c}{x} = -f(x)$.</p>
      <p>Ligt $(a, b)$ op de grafiek, dan ligt ook $(-a, -b)$ erop. Draai je de grafiek 180° rond de oorsprong, dan krijg je dezelfde grafiek.</p></div>
    <div class="kader def"><div class="kader-titel">Asymptoten</div>
      <p>Komt $x$ dichter bij 0, dan wordt $|f(x)|$ onbeperkt groot: de grafiek nadert de rechte $x = 0$ (de $y$-as). Dat is de <b>verticale asymptoot</b>.</p>
      <p>Wordt $|x|$ onbeperkt groot, dan komt $f(x)$ steeds dichter bij 0: de grafiek nadert de rechte $y = 0$ (de $x$-as). Dat is de <b>horizontale asymptoot</b>.</p></div>`,
  voorbeelden: [{ tex: 'f(x) = \\dfrac{6}{x}: \\; f(2) = 3', stappen: ['f(-2) = -f(2) = -3', '(2, 3) \\text{ en } (-2, -3) \\text{ liggen op de grafiek}'] }],
  soorten: {
    sym: { naam: 'Puntsymmetrie gebruiken', gen() { const c = kiesC(), a = kies(deler(Math.abs(c))); return { soort: 'sym', tex: `${ftex(c)}: \\; f(${a}) = ${tg(c / a)}`, html: vraag(`Bepaal f(−${a}) zonder de formule in te vullen.`), sleutel: `sy${c}${a}`,
      antw: getal(-c / a, { voor: `f(−${a}) =` }), uitleg: [`f(-${a}) = -f(${a}) = ${tg(-c / a)}`] }; } },
    punt: { naam: 'Welk punt ligt zeker ook op de grafiek?', gen() { const a = nz(-6, 6), b = nz(-6, 6), P = (x, y) => `(${tg(x)}, ${tg(y)})`;
      return { soort: 'punt', opdracht: 'De grafiek van een functie f(x) = c/x gaat door het gegeven punt.', tex: `\\text{punt } ${P(a, b)}`, html: vraag('Welk punt ligt zeker ook op de grafiek?'), sleutel: `pu${a}${b}`,
        antw: texKeuze([...new Set([P(-a, -b), P(-a, b), P(a, -b), P(b, a), P(0, 0)])].slice(0, 4), P(-a, -b)), uitleg: ['\\text{puntsymmetrisch t.o.v. de oorsprong: } (a, b) \\rightarrow (-a, -b)', `${P(-a, -b)}`] }; } },
    asym: { naam: 'Asymptoten', gen() { const c = kiesC(); return { soort: 'asym', tex: ftex(c), html: vraag('Geef de vergelijkingen van de asymptoten.'), sleutel: `as${c}`,
      antw: { soort: 'delen', delen: [{ label: '\\text{verticaal: } x =', antw: getal(0) }, { label: '\\text{horizontaal: } y =', antw: getal(0) }] }, uitleg: ['\\text{verticale asymptoot } x = 0 \\text{ (de } y\\text{-as)}', '\\text{horizontale asymptoot } y = 0 \\text{ (de } x\\text{-as)}'] }; } },
    gedrag: { naam: 'Gedrag bij de asymptoten', gen() { const c = kies([6, 12, 24]), x = kies([0.01, 0.001, 1000, 10000]), y = c / x;
      return { soort: 'gedrag', tex: `${ftex(c)}, \\quad f(${tg(x)})`, html: vraag(`Bereken f(${kg(x)}). Welke asymptoot zie je hier?`), sleutel: `ge${c}${x}`,
        antw: { soort: 'delen', delen: [{ label: `f(${kg(x)}) =`, antw: getal(y) }] }, uitleg: [`f(${tg(x)}) = ${tg(y)}`, x < 1 ? '\\text{x dicht bij 0: } |f(x)| \\text{ wordt heel groot (verticale asymptoot } x = 0)' : '|x| \\text{ heel groot: } f(x) \\text{ komt dicht bij 0 (horizontale asymptoot } y = 0)'] }; } },
  },
  oefenMix: [['sym', 2], ['punt', 2], ['asym', 1], ['gedrag', 2]],
  test: [['sym', 3], ['punt', 3], ['asym', 2], ['gedrag', 2]], testSchudden: true,
};

// functieoverzicht: één kenmerk per vraag, voor dezelfde functie
const D7 = {
  nr: 7, titel: 'Functieoverzicht opstellen', kort: 'Alle kenmerken van f(x) = c/x samen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Functieoverzicht van f(x) = c/x</div>${OVERZICHT}</div>
    <div class="kader eig"><div class="kader-titel">Let op</div><p>"Dalend <b>op elk deelinterval</b>" is iets anders dan "dalend over heel het domein": vergelijk $f(-1) = -6$ en $f(1) = 6$ bij $f(x) = \\frac{6}{x}$: van $x = -1$ naar $x = 1$ <b>stijgt</b> de functiewaarde.</p></div>`,
  voorbeelden: [{ tex: 'f(x) = -\\dfrac{4}{x}', stappen: ['\\text{dom } f = \\text{ber } f = \\mathbb{R}_0, \\text{ geen nulwaarden}', '- \\text{ voor } x > 0, \\; + \\text{ voor } x < 0', '\\text{stijgend op elk deelinterval, puntsymmetrisch, asymptoten } x = 0 \\text{ en } y = 0'] }],
  soorten: {
    mix: { naam: 'Een kenmerk uit het overzicht', gen() {
      const s = kies(['domein', 'bereik', 'nul', 'positief', 'stijgen', 'asym', 'sym']), D = { domein: D4, bereik: D4, nul: D4, positief: D5, stijgen: D5, asym: D6, sym: D6 }[s];
      const v = D.soorten[s].gen(); return { ...v, soort: 'mix' + s, opdracht: 'Functieoverzicht: bepaal dit kenmerk.' };
    } },
    uitspraak: { naam: 'Klopt de uitspraak?', gen() {
      const c = kiesC(), L = [
        [`f(x) = ${kg(c)}/x is dalend over heel het domein.`, false], [`De grafiek van f(x) = ${kg(c)}/x gaat door de oorsprong.`, false], [`f(x) = ${kg(c)}/x heeft geen nulwaarden.`, true],
        [`De grafiek van f(x) = ${kg(c)}/x is puntsymmetrisch ten opzichte van de oorsprong.`, true], [`Het domein van f(x) = ${kg(c)}/x is ℝ.`, false], [`De rechte y = 0 is een asymptoot van f(x) = ${kg(c)}/x.`, true]];
      const [t, w] = kies(L);
      return { soort: 'uitspraak', html: vraag(`Een klasgenoot beweert: "${t}" Klopt dat?`), sleutel: `ui${t}`, antw: tekstKeuze(['juist', 'fout'], w ? 'juist' : 'fout'), uitleg: [tx(w ? 'juist' : 'fout'), tx('Vergelijk met het functieoverzicht in de theorie.')] };
    } },
  },
  oefenMix: [['mix', 5], ['uitspraak', 3]],
  test: [['mix', 7], ['uitspraak', 3]], testSchudden: true,
};

// ===================================================================
//  C · TOEPASSINGEN
// ===================================================================
const D8 = {
  nr: 8, titel: 'Toepassingen', kort: 'Snelheid en tijd · wet van Boyle · kostenverdeling.', rekenmachine: true,
  theorie: `<div class="kader werk"><div class="kader-titel">Omgekeerd evenredig in het dagelijks leven</div>
      <p><b>Snelheid en tijd:</b> voor een vaste afstand van 120 km geldt $t(v) = \\dfrac{120}{v}$ ($t$ in uur, $v$ in km/u). Hoe hoger de snelheid, hoe korter de rit.</p>
      <p><b>Druk en volume (wet van Boyle):</b> bij een vaste temperatuur geldt $p \\cdot V = $ constant, dus $p(V) = \\dfrac{c}{V}$. Pers je het volume samen, dan stijgt de druk.</p>
      <p><b>Kostenverdeling:</b> verdeel je een vaste kost van $c$ euro onder $x$ personen, dan betaalt elke persoon $\\dfrac{c}{x}$ euro.</p></div>`,
  voorbeelden: [{ tex: '\\text{huis van 840 euro, } x \\text{ personen}', stappen: ['k(x) = \\dfrac{840}{x}', 'k(4) = 210, \\; k(6) = 140, \\; k(8) = 105 \\text{ euro}', '\\text{dalende functie: meer personen, minder kost per persoon}'] }],
  soorten: {
    rit: { naam: 'Snelheid en tijd', gen() { const s = kies([60, 90, 120, 150, 180, 240]), v = kies([30, 40, 45, 60, 80, 90, 100, 120].filter(v => (s / v * 60) % 1 === 0));
      return { soort: 'rit', html: opgave(`Een afstand van ${s} km wordt afgelegd met een constante snelheid van v km/u.`) + vraag(`Hoe lang duurt de rit (in uur) bij ${v} km/u?`), sleutel: `r${s}${v}`, antw: getal(W.rond(s / v, 2), { dec: 2, na: '\\text{ uur}' }), uitleg: [`t(v) = \\dfrac{${s}}{v}`, `t(${v}) = \\dfrac{${s}}{${v}} = ${tg(W.rond(s / v, 2))} \\text{ uur}`] }; } },
    boyle: { naam: 'Wet van Boyle', gen() { const p = kies([1, 2, 3, 4]), V = kies([6, 8, 12, 24]), c = p * V, V2 = kies(deler(c).filter(k => k !== V && k > 1 && k <= 24));
      return { soort: 'boyle', html: opgave(`Een gas heeft bij een vaste temperatuur een druk van ${p} bar bij een volume van ${V} liter. Er geldt p · V = constant.`) + vraag(`Wat is de druk als het volume ${V2} liter wordt?`), sleutel: `b${p}${V}${V2}`, antw: getal(c / V2, { na: '\\text{ bar}' }), uitleg: [`c = ${p} \\cdot ${V} = ${c}`, `p = \\dfrac{${c}}{${V2}} = ${tg(c / V2)} \\text{ bar}`] }; } },
    kost: { naam: 'Kostenverdeling', gen() { const c = kies([480, 600, 720, 840, 960, 1200]), x = kies(deler(c).filter(k => k >= 3 && k <= 12));
      return { soort: 'kost', html: opgave(`Een groep vrienden huurt samen een vakantiehuis van ${c} euro en verdeelt de kost eerlijk.`) + vraag(`Hoeveel betaalt elke persoon met ${x} personen?`), sleutel: `k${c}${x}`, antw: getal(c / x, { na: '\\text{ euro}' }), uitleg: [`k(x) = \\dfrac{${c}}{x}`, `k(${x}) = ${tg(c / x)} \\text{ euro}`] }; } },
    verband: { naam: 'Stijgend of dalend?', gen() { const L = [['de reistijd als functie van de snelheid (vaste afstand)', 'dalend'], ['de druk van een gas als functie van het volume (wet van Boyle)', 'dalend'], ['de kost per persoon als functie van het aantal personen', 'dalend']], [t, w] = kies(L);
      return { soort: 'verband', html: vraag(`Is ${t} een stijgende of een dalende functie?`), sleutel: `v${t}`, antw: tekstKeuze(['stijgend', 'dalend'], w), uitleg: [tx('Omgekeerd evenredig met c > 0: als x groter wordt, wordt y kleiner.'), tx(w)] }; } },
  },
  oefenMix: [['rit', 2], ['boyle', 2], ['kost', 2], ['verband', 1]],
  test: [['rit', 3], ['boyle', 3], ['kost', 2], ['verband', 2]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
const D9 = {
  nr: 9, titel: 'Eindtest de functie c/x', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${DEF}<div class="kader def"><div class="kader-titel">Functieoverzicht</div>${OVERZICHT}</div>`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'c', 'Evenredigheidsfactor'), e2: mix(D1, 'context', 'Omgekeerd evenredig in een situatie'), e3: mix(D2, 'tabel', 'Tabel van waarden'), e4: mix(D2, 'aflezen', 'c aflezen'), e5: mix(D3, 'kwadrant', 'Kwadranten'),
    e6: mix(D3, 'dichter', 'Grootte van |c|'), e7: mix(D4, 'nul', 'Nulwaarden'), e8: mix(D5, 'stijgen', 'Stijgen en dalen'), e9: mix(D6, 'sym', 'Symmetrie'), e10: mix(D8, 'boyle', 'Toepassing') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6, D7, D8, D9]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen.bind(s);
    s.gen = () => {
      const v = { ...g() };
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && `\\text{${u.slice(2)}}` === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
}

Leerpaden.registreer({
  code: 'functie-c-op-x',
  titel: 'De functie f(x) = c/x',
  ondertitel: 'Toegepaste wiskunde · 4BW',
  klas: '4BW',
  drempel: 70,
  intro: `<p>Je leert wat een <b>omgekeerd evenredig verband</b> is, je tekent de <b>hyperbool</b> $f(x) = \\frac{c}{x}$, je onderzoekt de invloed van $c$ en je stelt een volledig <b>functieoverzicht</b> op.
    Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [
    { titel: 'A · Het verband en de grafiek', delen: [1, 2, 3] },
    { titel: 'B · Kenmerken', delen: [4, 5, 6, 7] },
    { titel: 'C · Toepassingen', delen: [8] },
    { titel: 'D · Eindtest', delen: [9] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9],
});
})();
