// ===== De homothetie · Toegepaste wiskunde 4BW =====
// Leidraad: cursus TWiskunde 4BW hoofdstuk 5 "Homothetie" en de PWP/werkbundel (G. Walschap).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(x);
const kg = (x) => String(x).replace('.', ',').replace('-', '−');
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud(opties.map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const P = (x, y) => `(${tg(x)}, ${tg(y)})`;
const punt = (x, y, n = "P'") => ({ soort: 'delen', delen: [{ label: `${n}: \\; x =`, antw: getal(x) }, { label: 'y =', antw: getal(y) }] });
const KF = [2, 3, 0.5, -1, -2, 1.5, -0.5, -3];

// ---------- rooster met punten, optioneel lijnen en veelhoeken
function rooster(opt) {
  const [X0, X1] = opt.x || [-6, 6], [Y0, Y1] = opt.y || [-6, 6], e = opt.e || 22, m = 16;
  const X = (x) => m + (x - X0) * e, Y = (y) => m + (Y1 - y) * e, W_ = (X1 - X0) * e + 2 * m, H = (Y1 - Y0) * e + 2 * m;
  let g = '';
  for (let k = X0; k <= X1; k++) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/>` + (k && k % 2 === 0 ? `<text x="${X(k)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle" fill="#555">${k < 0 ? '−' + -k : k}</text>` : '');
  for (let k = Y0; k <= Y1; k++) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/>` + (k && k % 2 === 0 ? `<text x="${X(0) - 5}" y="${Y(k) + 4}" font-size="10" text-anchor="end" fill="#555">${k < 0 ? '−' + -k : k}</text>` : '');
  if (opt.assen !== false) g += `<line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1)}" y2="${Y(0)}" stroke="#1f2733" stroke-width="1.2"/><line x1="${X(0)}" y1="${Y(Y0)}" x2="${X(0)}" y2="${Y(Y1)}" stroke="#1f2733" stroke-width="1.2"/>`;
  for (const [pts, kl, streep] of opt.veelhoeken || []) g += `<polygon points="${pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" fill="${kl}22" stroke="${kl}" stroke-width="2.2" ${streep ? 'stroke-dasharray="6 4"' : ''}/>`;
  for (const [[a, b], [c, d]] of opt.lijnen || []) g += `<line x1="${X(a)}" y1="${Y(b)}" x2="${X(c)}" y2="${Y(d)}" stroke="#7a8b99" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  for (const [x, y, n, kl] of opt.punten || []) g += `<circle cx="${X(x)}" cy="${Y(y)}" r="4.5" fill="${kl || '#1c4e8a'}"/><text x="${X(x) + 7}" y="${Y(y) - 7}" font-size="13" font-weight="bold" fill="${kl || '#1c4e8a'}" font-style="italic">${n}</text>`;
  return `<div class="figuur"><svg viewBox="0 0 ${W_} ${H}" width="${W_}" height="${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rooster" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}
const STIJL = `.vraagzin{margin-top:12px;font-size:16px}`;
if (typeof document !== 'undefined' && document.head && !document.getElementById('hom-stijl')) { const st = document.createElement('style'); st.id = 'hom-stijl'; st.textContent = STIJL; document.head.appendChild(st); }
const DEF = `<div class="kader def"><div class="kader-titel">Homothetie</div>
  <p>Een <b>homothetie</b> met centrum $Z$ en factor $k$ ($k \\in \\mathbb{R}_0$) beeldt elk punt $P$ af op het punt $P'$ op de rechte $ZP$ waarvoor $\\overrightarrow{ZP'} = k \\cdot \\overrightarrow{ZP}$.</p>
  <p>Het centrum $Z$ is het enige punt dat op zichzelf wordt afgebeeld. De vorm blijft dezelfde, enkel de grootte (en eventueel de kant) verandert.</p></div>`;
const EIG = `<table class="tabel"><tr><th>Eigenschap</th><th>Betekenis</th></tr>
  <tr><td>evenwijdigheid</td><td>het beeld van een rechte is een evenwijdige rechte (of dezelfde rechte als ze door $Z$ gaat)</td></tr>
  <tr><td>hoeken</td><td>hoeken blijven behouden: het beeld is gelijkvormig met het origineel</td></tr>
  <tr><td>afstanden</td><td>$|A'B'| = |k| \\cdot |AB|$</td></tr><tr><td>oppervlaktes</td><td>oppervlakte beeld $= k^2 \\cdot$ oppervlakte origineel</td></tr></table>`;
const INTYPEN = `<div class="kader"><div class="kader-titel">Zo vul je in</div><p>Een coördinaat typ je als getal, ook negatief of met een komma: <code>-4</code>, <code>2,5</code>.</p></div>`;

// ===================================================================
const D1 = {
  nr: 1, titel: 'Wat is een homothetie?', kort: 'Centrum Z en factor k: ZP′ = k · ZP.', rekenmachine: false,
  theorie: `${DEF}
    <div class="kader eig"><div class="kader-titel">De factor k</div>
      <ul><li>$k > 0$: $P'$ ligt aan <b>dezelfde kant</b> van $Z$ als $P$.</li><li>$k < 0$: $P'$ ligt aan de <b>andere kant</b> van $Z$ ($Z$ ligt tussen $P$ en $P'$).</li>
      <li>$|k| > 1$: het beeld is <b>groter</b> (vergroting); $|k| < 1$: het beeld is <b>kleiner</b> (verkleining).</li></ul>
      <p><b>Speciale gevallen:</b> $k = 1$ geeft de identieke afbeelding (elk punt blijft onveranderd). $k = -1$ geeft de <b>puntspiegeling</b> ten opzichte van $Z$.</p></div>`,
  voorbeelden: [
    { tex: 'k = 3', stappen: ["P' \\text{ ligt aan dezelfde kant van } Z, \\text{ drie keer zo ver: } |ZP'| = 3 \\cdot |ZP|"] },
    { tex: 'k = -0{,}5', stappen: ["P' \\text{ ligt aan de andere kant van } Z, \\text{ half zo ver: } |ZP'| = 0{,}5 \\cdot |ZP|"] },
  ],
  soorten: {
    kant: { naam: 'Dezelfde kant of de andere kant?', gen() { const k = kies(KF.filter(x => x !== -1)); return { soort: 'kant', tex: `k = ${tg(k)}`, html: vraag("Waar ligt P' ten opzichte van Z?"), sleutel: `ka${k}`,
      antw: tekstKeuze(['aan dezelfde kant als P', 'aan de andere kant dan P'], k > 0 ? 'aan dezelfde kant als P' : 'aan de andere kant dan P'), uitleg: [`k ${k > 0 ? '> 0' : '< 0'}`, tx(k > 0 ? 'aan dezelfde kant als P' : 'aan de andere kant dan P')] }; } },
    groot: { naam: 'Vergroting of verkleining?', gen() { const k = kies([2, 3, 0.5, -2, -0.5, 1.5, -1.5, 0.25, -3]); const j = Math.abs(k) > 1 ? 'een vergroting' : 'een verkleining'; return { soort: 'groot', tex: `k = ${tg(k)}`, html: vraag('Is het beeld een vergroting of een verkleining?'), sleutel: `gr${k}`,
      antw: tekstKeuze(['een vergroting', 'een verkleining', 'even groot'], j), uitleg: [`|k| = ${tg(Math.abs(k))} ${Math.abs(k) > 1 ? '> 1' : '< 1'}`, tx(j)] }; } },
    afstand: { naam: 'Afstand tot het centrum', gen() { const k = kies(KF), d = kies([2, 3, 4, 5, 6]); return { soort: 'afstand', html: vraag(`|ZP| = ${d} cm en k = ${kg(k)}. Hoe ver ligt P' van Z?`), sleutel: `af${k}${d}`,
      antw: getal(Math.abs(k) * d, { voor: "|ZP'| =", na: '\\text{ cm}' }), uitleg: [`|ZP'| = |k| \\cdot |ZP| = ${tg(Math.abs(k))} \\cdot ${d} = ${tg(Math.abs(k) * d)} \\text{ cm}`] }; } },
    speciaal: { naam: 'Speciale gevallen', gen() { const k = kies([1, -1]); const j = k === 1 ? 'de identieke afbeelding' : 'de puntspiegeling t.o.v. Z'; return { soort: 'speciaal', tex: `k = ${tg(k)}`, html: vraag('Welke transformatie is dit?'), sleutel: `sp${k}`,
      antw: tekstKeuze(['de identieke afbeelding', 'de puntspiegeling t.o.v. Z', 'een verschuiving', 'een vergroting met factor 2'], j), uitleg: [tx(j)] }; } },
  },
  oefenMix: [['kant', 2], ['groot', 2], ['afstand', 2], ['speciaal', 1]],
  test: [['kant', 3], ['groot', 2], ['afstand', 3], ['speciaal', 2]], testSchudden: true,
};

// beeld van een punt op een rooster (Z willekeurig, kleine getallen)
function maakPZ(kopties) {
  for (;;) { const k = kies(kopties), Z = [rnd(-3, 3), rnd(-3, 3)], P = [Z[0] + nz(-3, 3), Z[1] + nz(-3, 3)], Q = [Z[0] + k * (P[0] - Z[0]), Z[1] + k * (P[1] - Z[1])];
    if ([...P, ...Q].every(v => Math.abs(v) <= 8 && Number.isInteger(v))) return { k, Z, P, Q }; }
}
const D2 = {
  nr: 2, titel: 'Het beeld van een punt construeren', kort: 'Op de rechte ZP: |ZP′| = |k| · |ZP|.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div>
      <p>Teken de rechte $ZP$ en breng op die rechte het punt $P'$ aan met $|ZP'| = |k| \\cdot |ZP|$: aan dezelfde kant als $k > 0$, aan de andere kant als $k < 0$.</p>
      <p>Op een rooster gaat dat snel: van $Z$ naar $P$ ga je bv. 2 hokjes naar rechts en 1 omhoog. Bij $k = 3$ ga je van $Z$ uit <b>3 keer</b> zo ver: 6 naar rechts en 3 omhoog.</p></div>
    ${rooster({ x: [-2, 8], y: [-2, 5], punten: [[0, 0, 'Z', '#2e7d4f'], [2, 1, 'P'], [6, 3, "P'", '#e8772e']], lijnen: [[[0, 0], [7, 3.5]]] })}
    <div class="kader eig"><div class="kader-titel">Negatieve factor</div><p>Bij $k = -2$ ga je van $Z$ uit twee keer zo ver, maar in de <b>tegengestelde</b> richting: 4 naar links en 2 omlaag.</p></div>`,
  voorbeelden: [{ tex: "Z(1, 1), \\; P(3, 2), \\; k = -2", stappen: ['\\text{van } Z \\text{ naar } P: \\; 2 \\text{ naar rechts}, \\; 1 \\text{ omhoog}', '\\text{maal } -2: \\; 4 \\text{ naar links}, \\; 2 \\text{ omlaag}', "P' = (1 - 4, 1 - 2) = (-3, -1)"] }],
  soorten: {
    rooster: { naam: 'Beeld aflezen op een rooster', gen() { const { k, Z, P: Pp, Q } = maakPZ([2, 3, -1, -2, 0.5, 1.5].filter(Boolean));
      return { soort: 'rooster', opdracht: "Construeer het beeld P' en geef de coördinaat.", html: rooster({ x: [-8, 8], y: [-8, 8], e: 16, punten: [[...Z, 'Z', '#2e7d4f'], [...Pp, 'P']] }) + vraag(`Homothetie met centrum Z en factor k = ${kg(k)}. Wat is P'?`), sleutel: `ro${k}${Z}${Pp}`,
        antw: punt(...Q), uitleg: [`Z ${P(...Z)} \\to P ${P(...Pp)}: \\; ${h(Pp[0] - Z[0])} \\text{ horizontaal}, \\; ${h(Pp[1] - Z[1])} \\text{ verticaal}`, `\\text{maal } ${h(k)}: \\; ${h(k * (Pp[0] - Z[0]))} \\text{ en } ${h(k * (Pp[1] - Z[1]))}`, `P' = ${P(...Q)}`] }; } },
    stappen: { naam: 'Met stappen vanuit Z', gen() { const { k, Z, P: Pp, Q } = maakPZ([2, 3, -1, -2, -3]); const dx = Pp[0] - Z[0], dy = Pp[1] - Z[1];
      return { soort: 'stappen', opdracht: 'Werk met de stappen van Z naar P.', tex: `Z${P(...Z)}, \\; P${P(...Pp)}, \\; k = ${tg(k)}`, html: vraag("Bereken de coördinaat van het beeld P'."), sleutel: `st${k}${Z}${Pp}`,
        antw: punt(...Q), uitleg: [`Z \\to P: \\; (${tg(dx)}, ${tg(dy)})`, `\\text{maal } ${h(k)}: \\; (${tg(k * dx)}, ${tg(k * dy)})`, `P' = (${tg(Z[0])} + ${h(k * dx)}, \\; ${tg(Z[1])} + ${h(k * dy)}) = ${P(...Q)}`] }; } },
    welkk: { naam: 'Welk punt is het beeld?', gen() { const { k, Z, P: Pp, Q } = maakPZ([2, -1, -2, 3]); const fout1 = [Z[0] - k * (Pp[0] - Z[0]), Z[1] - k * (Pp[1] - Z[1])], fout2 = [k * Pp[0], k * Pp[1]];
      const opts = [...new Set([P(...Q), P(...fout1), P(...fout2), P(Pp[0] + k, Pp[1] + k)])];
      return { soort: 'welkk', tex: `Z${P(...Z)}, \\; P${P(...Pp)}, \\; k = ${tg(k)}`, html: vraag("Welk punt is het beeld P'?"), sleutel: `wk${k}${Z}${Pp}`,
        antw: { soort: 'keuze', opties: schud(opts.map(o => ({ k: o, l: o }))), juist: P(...Q) }, uitleg: [`P' = ${P(...Q)}`] }; } },
  },
  oefenMix: [['rooster', 3], ['stappen', 3], ['welkk', 2]],
  test: [['rooster', 4], ['stappen', 4], ['welkk', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Eigenschappen van een homothetie', kort: 'Evenwijdig · hoeken gelijk · |A′B′| = |k|·|AB| · opp. × k².', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Eigenschappen</div>${EIG}</div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p>Een rechthoek van 3 cm bij 2 cm (oppervlakte 6 cm²) wordt afgebeeld met $k = -3$.</p>
      <p class="midden">$\\text{zijden: } 3 \\cdot 3 = 9 \\text{ cm en } 3 \\cdot 2 = 6 \\text{ cm} \\qquad \\text{oppervlakte: } (-3)^2 \\cdot 6 = 54 \\text{ cm}^2$</p>
      <p class="klein">Een <b>negatieve</b> factor: $|k| = 3$ bij afstanden, maar $k^2 = 9$ bij oppervlaktes is altijd positief.</p></div>`,
  voorbeelden: [{ tex: '|AB| = 5 \\text{ cm}, \\; k = -2', stappen: ["|A'B'| = |-2| \\cdot 5 = 10 \\text{ cm}"] }],
  soorten: {
    lengte: { naam: 'Afstanden', gen() { const k = kies(KF.concat([4, -1.5])), d = kies([2, 3, 4, 5, 6, 8, 10]); return { soort: 'lengte', tex: `|AB| = ${d} \\text{ cm}, \\; k = ${tg(k)}`, html: vraag("Bereken |A'B'|."), sleutel: `le${k}${d}`,
      antw: getal(Math.abs(k) * d, { voor: "|A'B'| =", na: '\\text{ cm}' }), uitleg: [`|A'B'| = |k| \\cdot |AB| = ${tg(Math.abs(k))} \\cdot ${d} = ${tg(Math.abs(k) * d)} \\text{ cm}`] }; } },
    opp: { naam: 'Oppervlaktes', gen() { const k = kies([2, 3, -2, -3, 0.5, -0.5, 4]), A = kies([4, 6, 8, 10, 12, 20]); return { soort: 'opp', tex: `\\text{oppervlakte} = ${A} \\text{ cm}^2, \\; k = ${tg(k)}`, html: vraag('Bereken de oppervlakte van het beeld.'), sleutel: `op${k}${A}`,
      antw: getal(k * k * A, { na: '\\text{ cm}^2' }), uitleg: [`k^2 \\cdot ${A} = ${h(k)}^2 \\cdot ${A} = ${tg(k * k)} \\cdot ${A} = ${tg(k * k * A)} \\text{ cm}^2`] }; } },
    hoek: { naam: 'Hoeken', gen() { const a = kies([35, 48, 60, 72, 90, 110]), k = kies(KF); return { soort: 'hoek', tex: `\\hat{A} = ${a}°, \\; k = ${tg(k)}`, html: vraag("Hoe groot is hoek A' in het beeld?"), sleutel: `ho${a}${k}`,
      antw: getal(a, { na: '°' }), uitleg: ['\\text{hoeken blijven behouden: het beeld is gelijkvormig}', `\\hat{A'} = ${a}°`] }; } },
    eig: { naam: 'Juist of fout?', gen() { const L = [["Het beeld van een rechte is een evenwijdige rechte (of dezelfde als ze door Z gaat).", true], ["Bij k = 2 wordt de oppervlakte 2 keer zo groot.", false], ["Bij k = −3 worden afstanden 3 keer zo groot.", true], ["Een homothetie verandert de hoeken van een figuur.", false], ["Bij k = −2 wordt de oppervlakte 4 keer zo groot.", true], ["Het centrum Z wordt op zichzelf afgebeeld.", true]];
      const [t, w] = kies(L); return { soort: 'eig', html: vraag(t), sleutel: `ei${t}`, antw: tekstKeuze(['juist', 'fout'], w ? 'juist' : 'fout'), uitleg: [tx(w ? 'juist' : 'fout'), tx('Afstanden × |k|, oppervlaktes × k², hoeken blijven gelijk, rechten blijven evenwijdig.')] }; } },
  },
  oefenMix: [['lengte', 2], ['opp', 2], ['hoek', 1], ['eig', 2]],
  test: [['lengte', 3], ['opp', 3], ['hoek', 1], ['eig', 3]], testSchudden: true,
};

const D4 = {
  nr: 4, titel: 'Het beeld van een vlakke figuur', kort: 'Beeld van elk hoekpunt, dan verbinden.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div><p>Construeer het beeld van <b>elk hoekpunt</b> afzonderlijk en verbind de beeldpunten in dezelfde volgorde.</p></div>
    ${rooster({ x: [-1, 9], y: [-1, 7], punten: [[0, 0, 'Z', '#2e7d4f'], [2, 1, 'A'], [4, 1, 'B'], [2, 3, 'C'], [4, 2, "A'", '#e8772e'], [8, 2, "B'", '#e8772e'], [4, 6, "C'", '#e8772e']], veelhoeken: [[[[2, 1], [4, 1], [2, 3]], '#1c4e8a'], [[[4, 2], [8, 2], [4, 6]], '#e8772e', true]] })}
    <p class="klein midden">Driehoek $ABC$ met centrum $Z$ en $k = 2$: het beeld is twee keer zo groot en gelijkvormig, met evenwijdige zijden.</p>
    <div class="kader eig"><div class="kader-titel">Negatieve factor</div><p>Bij $k < 0$ ligt het beeld "omgekeerd" ten opzichte van $Z$: elke zijde is evenwijdig met de overeenkomstige zijde, maar in tegengestelde richting.</p></div>`,
  voorbeelden: [{ tex: 'Z(0, 0), \\; A(1, 2), B(3, 2), C(1, 4), \\; k = -1', stappen: ["A'(-1, -2), \\; B'(-3, -2), \\; C'(-1, -4)", '\\text{puntspiegeling t.o.v. } Z'] }],
  soorten: {
    hoekpunt: { naam: 'Beeld van een hoekpunt', gen() {
      for (;;) { const k = kies([2, -1, -2, 0.5]), Z = [0, 0], A = [nz(-3, 3), nz(-3, 3)], B = [A[0] + nz(1, 3), A[1]], C = [A[0], A[1] + nz(1, 3)], n = kies(['A', 'B', 'C']), Q = { A, B, C }[n], R = [k * Q[0], k * Q[1]];
        if (![...A, ...B, ...C].map(v => v * k).every(v => Math.abs(v) <= 8 && Number.isInteger(v))) continue;
        return { soort: 'hoekpunt', opdracht: 'Centrum Z is de oorsprong.', html: rooster({ x: [-8, 8], y: [-8, 8], e: 16, punten: [[0, 0, 'Z', '#2e7d4f'], [...A, 'A'], [...B, 'B'], [...C, 'C']], veelhoeken: [[[A, B, C], '#1c4e8a']] }) + vraag(`Homothetie met centrum Z en k = ${kg(k)}. Geef het beeld ${n}'.`), sleutel: `hp${k}${A}${B}${C}${n}`,
          antw: punt(R[0], R[1], `${n}'`), uitleg: [`${n}${P(...Q)} \\to ${n}'(${tg(k)} \\cdot ${h(Q[0])}, \\; ${tg(k)} \\cdot ${h(Q[1])}) = ${P(...R)}`] }; } } },
    omtrek: { naam: 'Omtrek en oppervlakte van het beeld', gen() { const a = kies([3, 4, 5, 6]), b = kies([2, 3, 4]), k = kies([2, 3, -2, 0.5, -0.5]), wat = kies(['omtrek', 'oppervlakte']);
      const o = 2 * (a + b), A = a * b, w = wat === 'omtrek' ? Math.abs(k) * o : k * k * A;
      return { soort: 'omtrek', html: vraag(`Een rechthoek van ${a} cm bij ${b} cm wordt afgebeeld met k = ${kg(k)}. Bereken de ${wat} van het beeld.`), sleutel: `om${a}${b}${k}${wat}`,
        antw: getal(w, { na: wat === 'omtrek' ? '\\text{ cm}' : '\\text{ cm}^2' }), uitleg: wat === 'omtrek' ? [`\\text{zijden } ${tg(Math.abs(k) * a)} \\text{ en } ${tg(Math.abs(k) * b)} \\text{ cm}`, `\\text{omtrek} = 2 \\cdot (${tg(Math.abs(k) * a)} + ${tg(Math.abs(k) * b)}) = ${tg(w)} \\text{ cm}`] : [`\\text{oppervlakte origineel } = ${A} \\text{ cm}^2`, `${h(k)}^2 \\cdot ${A} = ${tg(w)} \\text{ cm}^2`] }; } },
    ligging: { naam: 'Hoe ligt het beeld?', gen() { const k = kies([2, 3, -2, -0.5, 0.5, -1]); const j = k > 0 ? 'aan dezelfde kant van Z, niet omgekeerd' : 'aan de andere kant van Z, omgekeerd';
      return { soort: 'ligging', html: vraag(`Een driehoek wordt afgebeeld met k = ${kg(k)}. Hoe ligt het beeld?`), sleutel: `li${k}`, antw: tekstKeuze(['aan dezelfde kant van Z, niet omgekeerd', 'aan de andere kant van Z, omgekeerd'], j), uitleg: [`k ${k > 0 ? '> 0' : '< 0'}`, tx(j)] }; } },
  },
  oefenMix: [['hoekpunt', 3], ['omtrek', 2], ['ligging', 1]],
  test: [['hoekpunt', 5], ['omtrek', 3], ['ligging', 2]], testSchudden: true,
};

const D5 = {
  nr: 5, titel: 'Werken met coördinaten', kort: "Z = O: P′(k·x, k·y) · Z(a, b): P′(a + k(x − a), b + k(y − b)).", rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Centrum in de oorsprong</div><p class="midden">$P(x, y) \\;\\to\\; P'(k \\cdot x, \\; k \\cdot y)$</p></div>
    <div class="kader def"><div class="kader-titel">Centrum in Z(a, b)</div><p class="midden">$P'\\big(a + k(x - a), \\; b + k(y - b)\\big)$</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p>$Z(2, -1)$, $k = 3$, $P(4, 1)$:</p><p class="midden">$P' = (2 + 3(4 - 2), \\; -1 + 3(1 - (-1))) = (2 + 6, \\; -1 + 6) = (8, 5)$</p></div>${INTYPEN}`,
  voorbeelden: [{ tex: 'Z(0, 0), \\; k = -4, \\; P(2, -3)', stappen: ["P'(-4 \\cdot 2, \\; -4 \\cdot (-3)) = (-8, 12)"] }],
  soorten: {
    oorsprong: { naam: 'Centrum in de oorsprong', gen() { const k = kies([2, 3, 4, -2, -3, 0.5, -0.5, 1.5]), x = nz(-9, 9), y = nz(-9, 9);
      return { soort: 'oorsprong', tex: `Z(0, 0), \\; k = ${tg(k)}, \\; P${P(x, y)}`, html: vraag("Bereken P'."), sleutel: `oo${k}${x}${y}`, antw: punt(k * x, k * y), uitleg: [`P'(${tg(k)} \\cdot ${h(x)}, \\; ${tg(k)} \\cdot ${h(y)}) = ${P(k * x, k * y)}`] }; } },
    centrum: { naam: 'Centrum Z(a, b)', gen() { const k = kies([2, 3, -2, -1, 0.5, -3]), a = nz(-4, 4), b = nz(-4, 4), x = nz(-6, 6), y = nz(-6, 6), X = a + k * (x - a), Y = b + k * (y - b);
      return { soort: 'centrum', tex: `Z${P(a, b)}, \\; k = ${tg(k)}, \\; P${P(x, y)}`, html: vraag("Bereken P'."), sleutel: `ce${k}${a}${b}${x}${y}`, antw: punt(X, Y),
        uitleg: [`P' = (${tg(a)} + ${tg(k)} \\cdot (${tg(x)} - ${h(a)}), \\; ${tg(b)} + ${tg(k)} \\cdot (${tg(y)} - ${h(b)}))`, `= (${tg(a)} + ${h(k * (x - a))}, \\; ${tg(b)} + ${h(k * (y - b))}) = ${P(X, Y)}`] }; } },
    terug: { naam: 'Origineel uit het beeld', gen() { const k = kies([2, 3, -2, 4, -4]), x = nz(-5, 5), y = nz(-5, 5);
      return { soort: 'terug', tex: `Z(0, 0), \\; k = ${tg(k)}, \\; P'${P(k * x, k * y)}`, html: vraag('Wat was het originele punt P?'), sleutel: `te${k}${x}${y}`, antw: punt(x, y, 'P'), uitleg: [`P = \\left(\\dfrac{${tg(k * x)}}{${tg(k)}}, \\; \\dfrac{${tg(k * y)}}{${tg(k)}}\\right) = ${P(x, y)}`] }; } },
  },
  oefenMix: [['oorsprong', 3], ['centrum', 3], ['terug', 2]],
  test: [['oorsprong', 4], ['centrum', 4], ['terug', 2]], testSchudden: true,
};

const D6 = {
  nr: 6, titel: 'De homothetiefactor bepalen', kort: 'k = ZP′ / ZP, met het juiste teken.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">De factor bepalen</div><p class="midden">$|k| = \\dfrac{|ZP'|}{|ZP|}$</p>
      <p>Let op het <b>teken</b>: $k > 0$ als $P$ en $P'$ aan dezelfde kant van $Z$ liggen, $k < 0$ als $Z$ tussen $P$ en $P'$ ligt.</p></div>
    <div class="kader werk"><div class="kader-titel">Met coördinaten (Z in de oorsprong)</div><p>$P(4, -2)$ en $P'(-6, 3)$: $k = \\dfrac{-6}{4} = \\dfrac{3}{-2} = -1{,}5$.</p></div>`,
  voorbeelden: [{ tex: "|ZP| = 4 \\text{ cm}, \\; |ZP'| = 10 \\text{ cm}, \\text{ zelfde kant}", stappen: ['k = \\dfrac{10}{4} = 2{,}5'] }],
  soorten: {
    afst: { naam: 'Uit de afstanden', gen() { const d = kies([2, 3, 4, 5, 6, 8]), k = kies([1.5, 2, 2.5, 3, 0.5, 0.25]) * kies([1, -1]), zelfde = k > 0;
      return { soort: 'afst', html: vraag(`|ZP| = ${d} cm en |ZP'| = ${kg(Math.abs(k) * d)} cm. P en P' liggen ${zelfde ? 'aan dezelfde kant van Z' : 'aan weerszijden van Z'}. Bepaal k.`), sleutel: `as${d}${k}`,
        antw: getal(k, { voor: 'k =' }), uitleg: [`|k| = \\dfrac{${tg(Math.abs(k) * d)}}{${d}} = ${tg(Math.abs(k))}`, `${zelfde ? '\\text{zelfde kant: } k > 0' : '\\text{weerszijden: } k < 0'} \\Rightarrow k = ${tg(k)}`] }; } },
    coord: { naam: 'Uit de coördinaten', gen() { const k = kies([2, 3, -2, -3, 0.5, -1.5, 2.5]), x = nz(-4, 4) * 2, y = nz(-4, 4) * 2;
      return { soort: 'coord', opdracht: 'Het centrum is de oorsprong.', tex: `P${P(x, y)} \\to P'${P(k * x, k * y)}`, html: vraag('Bepaal de factor k.'), sleutel: `co${k}${x}${y}`, antw: getal(k, { voor: 'k =' }), uitleg: [`k = \\dfrac{${tg(k * x)}}{${tg(x)}} = ${tg(k)}`] }; } },
    figuur: { naam: 'Uit een figuur en haar beeld', gen() { const a = kies([2, 3, 4, 5]), k = kies([2, 3, 1.5, 0.5]) * kies([1, -1]);
      return { soort: 'figuur', html: vraag(`Een driehoek heeft een zijde van ${a} cm. In het beeld is die zijde ${kg(Math.abs(k) * a)} cm, en het beeld ligt ${k > 0 ? 'aan dezelfde kant van Z (niet omgekeerd)' : 'omgekeerd, aan de andere kant van Z'}. Bepaal k.`), sleutel: `fi${a}${k}`,
        antw: getal(k, { voor: 'k =' }), uitleg: [`|k| = \\dfrac{${tg(Math.abs(k) * a)}}{${a}} = ${tg(Math.abs(k))}`, `k = ${tg(k)}`] }; } },
  },
  oefenMix: [['afst', 3], ['coord', 3], ['figuur', 2]],
  test: [['afst', 4], ['coord', 4], ['figuur', 2]], testSchudden: true,
};

const D7 = {
  nr: 7, titel: 'Toepassingen', kort: 'Kaarten en schaal · foto en beamer · bouwplannen.', rekenmachine: true,
  theorie: `<div class="kader werk"><div class="kader-titel">Homothetieën in het dagelijks leven</div>
      <p><b>Kaarten en schaal:</b> een kaart met schaal 1 : 50 000 is een homothetie met een heel kleine factor van het echte terrein: 1 cm op de kaart is 50 000 cm = 500 m in werkelijkheid.</p>
      <p><b>Fotografie en beamers:</b> inzoomen of een beeld projecteren: verhoudingen en hoeken blijven behouden.</p>
      <p><b>Technisch tekenen:</b> bouwplannen worden verkleind getekend volgens een vaste schaalfactor.</p></div>
    <div class="kader eig"><div class="kader-titel">Eenheden</div><p class="midden">$1 \\text{ km} = 1000 \\text{ m} = 100\\,000 \\text{ cm}$</p></div>`,
  voorbeelden: [{ tex: '\\text{schaal } 1 : 20\\,000, \\; 6 \\text{ cm op de kaart}', stappen: ['6 \\cdot 20\\,000 = 120\\,000 \\text{ cm} = 1{,}2 \\text{ km}'] }],
  soorten: {
    kaart: { naam: 'Kaart en schaal', gen() { const s = kies([10000, 20000, 25000, 50000, 100000]), d = kies([2, 3, 4, 5, 6, 7, 8, 12]), km = d * s / 100000;
      return { soort: 'kaart', html: opgave(`Een kaart heeft schaal 1 : ${s.toLocaleString('nl-BE')}.`) + vraag(`Twee plaatsen liggen op de kaart ${d} cm uit elkaar. Hoe ver is dat in werkelijkheid (in km)?`), sleutel: `ka${s}${d}`,
        antw: getal(km, { na: '\\text{ km}' }), uitleg: [`${d} \\cdot ${s} = ${tg(d * s)} \\text{ cm}`, `= ${tg(km)} \\text{ km}`] }; } },
    foto: { naam: 'Foto vergroten', gen() { const b = kies([10, 12, 15]), hh = kies([8, 10]), k = kies([1.5, 2, 2.5, 3]), wat = kies(['breedte', 'oppervlakte']);
      const w = wat === 'breedte' ? k * b : k * k * b * hh;
      return { soort: 'foto', html: opgave(`Een foto van ${b} cm op ${hh} cm wordt vergroot met factor ${kg(k)}.`) + vraag(`Bereken de ${wat} van de vergroting.`), sleutel: `fo${b}${hh}${k}${wat}`,
        antw: getal(w, { na: wat === 'breedte' ? '\\text{ cm}' : '\\text{ cm}^2' }), uitleg: wat === 'breedte' ? [`${tg(k)} \\cdot ${b} = ${tg(w)} \\text{ cm}`] : [`${b} \\cdot ${hh} = ${b * hh} \\text{ cm}^2`, `${tg(k)}^2 \\cdot ${b * hh} = ${tg(w)} \\text{ cm}^2`] }; } },
    plan: { naam: 'Bouwplan', gen() { const s = kies([50, 100, 200]), d = kies([3, 4, 5, 6, 8, 12]), m = d * s / 100;
      return { soort: 'plan', html: opgave(`Een bouwplan is getekend op schaal 1 : ${s}.`) + vraag(`Een muur is op het plan ${d} cm lang. Hoe lang is ze in werkelijkheid (in m)?`), sleutel: `pl${s}${d}`, antw: getal(m, { na: '\\text{ m}' }), uitleg: [`${d} \\cdot ${s} = ${d * s} \\text{ cm} = ${tg(m)} \\text{ m}`] }; } },
  },
  oefenMix: [['kaart', 3], ['foto', 3], ['plan', 2]],
  test: [['kaart', 4], ['foto', 3], ['plan', 3]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
const D8 = {
  nr: 8, titel: 'Eindtest homothetie', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${DEF}<div class="kader def"><div class="kader-titel">Eigenschappen</div>${EIG}</div>`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'kant', 'Dezelfde of andere kant'), e2: mix(D1, 'afstand', 'Afstand tot Z'), e3: mix(D2, 'rooster', 'Beeld op een rooster'), e4: mix(D3, 'lengte', 'Afstanden'), e5: mix(D3, 'opp', 'Oppervlaktes'),
    e6: mix(D4, 'hoekpunt', 'Beeld van een figuur'), e7: mix(D5, 'oorsprong', 'Coördinaten, Z = O'), e8: mix(D5, 'centrum', 'Coördinaten, Z(a, b)'), e9: mix(D6, 'coord', 'Factor bepalen'), e10: mix(D7, 'kaart', 'Schaal') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6, D7, D8]) {
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
  code: 'homothetie',
  titel: 'De homothetie',
  ondertitel: 'Toegepaste wiskunde · 4BW',
  klas: '4BW',
  drempel: 70,
  intro: `<p>Je leert wat een <b>homothetie</b> is (centrum en factor), je construeert beelden van punten en figuren, je gebruikt de <b>eigenschappen</b> en je rekent met <b>coördinaten</b>.
    Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [
    { titel: 'A · Wat is een homothetie?', delen: [1, 2] },
    { titel: 'B · Eigenschappen en figuren', delen: [3, 4] },
    { titel: 'C · Rekenen', delen: [5, 6, 7] },
    { titel: 'D · Eindtest', delen: [8] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8],
});
