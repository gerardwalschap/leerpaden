// ===== Matrices en stelsels · Toegepaste wiskunde 5BCW =====
// Leidraad: cursus, PWP en werkbundel TWiskunde 5BCW hoofdstuk 3 (G. Walschap).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x) => W.texGetal(x);
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: opties.map(o => ({ k: String(o), l: `\\text{${o}}` })), juist: String(juist) });
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const tx = (s) => '@@' + s;

// ---------- matrices
const mtex = (M) => `\\begin{pmatrix} ${M.map(r => r.map(tg).join(' & ')).join(' \\\\ ')} \\end{pmatrix}`;
const utex = (M, k) => `\\left(\\begin{array}{${'r'.repeat(k)}|r} ${M.map(r => r.map(tg).join(' & ')).join(' \\\\ ')} \\end{array}\\right)`; // uitgebreide matrix
const matAntw = (M, voor = '') => ({ soort: 'delen', rooster: M[0].length, voor, delen: M.flat().map(v => ({ label: '', antw: getal(W.rond(v, 6)) })) });
const rndM = (m, n, a = -5, b = 6) => Array.from({ length: m }, () => Array.from({ length: n }, () => rnd(a, b)));
const plus = (A, B, s = 1) => A.map((r, i) => r.map((v, j) => v + s * B[i][j]));
const maal = (k, A) => A.map(r => r.map(v => k * v));
const prod = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const transp = (A) => A[0].map((_, j) => A.map(r => r[j]));
const dimT = (A) => `${A.length} \\times ${A[0].length}`;
const elemUitleg = (A, B, i, j) => `c_{${i + 1}${j + 1}} = ${A[i].map((v, k) => `${tg(v)} \\cdot ${B[k][j] < 0 ? `(${tg(B[k][j])})` : tg(B[k][j])}`).join(' + ')} = ${tg(prod(A, B)[i][j])}`;

// ---------- woorden met uitleg
const WOORDEN = [
  ['getransponeerde', 'De matrix Aᵀ: rijen en kolommen van A zijn omgewisseld.'],
  ['overgangsmatrix', 'Een matrix die aangeeft hoe een systeem van de ene toestand naar de andere evolueert.'],
  ['adjacentiematrix', 'De matrix van een graaf: 1 als twee knopen verbonden zijn, 0 als niet.'],
  ['uitgebreide matrix', 'De matrix van de coëfficiënten van een stelsel, met de rechterleden als extra kolom.'],
  ['scalair', 'Een gewoon getal waarmee je een matrix vermenigvuldigt.'],
  ['graaf', 'Een netwerk van knopen en verbindingen.'],
  ['identiteitsmatrix', 'Een vierkante matrix met 1 op de diagonaal en 0 elders.'],
].sort((p, q) => q[0].length - p[0].length);
function woorden(html) {
  if (!html || typeof html !== 'string' || html.includes('class="woord"')) return html;
  const gebruikt = new Set(), tokens = [];
  const stukken = html.split(/(<svg[\s\S]*?<\/svg>|<span class="woord"[\s\S]*?<\/span><\/span>|<[^>]+>|\$\$[\s\S]*?\$\$|\$[^$]*\$)/);
  const vervang = (tekst) => {
    for (const [w, uitleg] of WOORDEN) {
      if (gebruikt.has(uitleg)) continue;
      const re = new RegExp(`(^|[^\\p{L}])(${w})(?![\\p{L}])`, 'iu');
      const m = tekst.match(re); if (!m) continue;
      gebruikt.add(uitleg);
      tokens.push(`<span class="woord" tabindex="0">${m[2]}<span class="woord-uitleg">${uitleg}</span></span>`);
      tekst = tekst.slice(0, m.index) + m[1] + `\u0001${tokens.length - 1}\u0002` + tekst.slice(m.index + m[0].length);
    }
    return tekst;
  };
  return stukken.map((s, i) => (i % 2 ? s : vervang(s))).join('').replace(/\u0001(\d+)\u0002/g, (m, k) => tokens[+k]);
}
const STIJL = `.woord{border-bottom:2px dotted #e8772e;cursor:help;position:relative;outline:none}
.woord .woord-uitleg{display:none;position:absolute;left:0;top:1.5em;z-index:30;width:250px;background:#fffbe6;border:1px solid #e8c36a;border-radius:6px;padding:6px 8px;font-size:13px;line-height:1.4;color:#1f2733;font-weight:normal;font-style:normal;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.woord:hover .woord-uitleg,.woord:focus .woord-uitleg{display:block}
.vraagzin{margin-top:12px;font-size:16px}`;
if (typeof document !== 'undefined' && document.head && !document.getElementById('mat-stijl')) { const st = document.createElement('style'); st.id = 'mat-stijl'; st.textContent = STIJL; document.head.appendChild(st); }

const INVUL = `<div class="kader"><div class="kader-titel">Zo vul je een matrix in</div>
  <ul><li>Je krijgt een rooster met vakjes: vul elk element in op zijn plaats (rij per rij).</li><li>Kommagetallen typ je met een komma: <code>0,5</code>. Een negatief getal met een minteken: <code>-3</code>.</li></ul></div>`;

// ---------- grafen (SVG)
const KNOOP = ['A', 'B', 'C', 'D', 'E'];
function graafSVG(n, M) {
  const R = 85, cx = 120, cy = 110, pos = Array.from({ length: n }, (_, i) => [cx + R * Math.cos(-Math.PI / 2 + 2 * Math.PI * i / n), cy + R * Math.sin(-Math.PI / 2 + 2 * Math.PI * i / n)]);
  let g = '';
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (M[i][j]) g += `<line x1="${pos[i][0]}" y1="${pos[i][1]}" x2="${pos[j][0]}" y2="${pos[j][1]}" stroke="#1c4e8a" stroke-width="2.5"/>`;
  pos.forEach(([x, y], i) => { g += `<circle cx="${x}" cy="${y}" r="16" fill="#fff4ec" stroke="#e8772e" stroke-width="2"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="15" font-weight="bold" fill="#c2561a">${KNOOP[i]}</text>`; });
  return `<div class="figuur"><svg viewBox="0 0 240 220" width="240" height="220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="graaf" style="font-family:Verdana,sans-serif">${g}</svg></div>`;
}
function rndGraaf(n) {
  for (;;) {
    const M = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.random() < 0.55) { M[i][j] = 1; M[j][i] = 1; }
    if (M.every(r => r.some(v => v))) return M;
  }
}

// ===================================================================
const D1 = {
  nr: 1, titel: 'Wat is een matrix?', kort: 'Rijen, kolommen, dimensie en elementen.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Instap: van actieve naar rustende cellen</div>
      <p>In een labo bevindt een celcultuur zich in twee toestanden: actief of rustend. Elk uur gaat 20% van de actieve cellen in rust en wordt 30% van de rustende cellen actief. Op tijdstip 0 zijn er 100 actieve en 50 rustende cellen. Hoeveel zijn er na 1 uur? En na 10 uur? Dat soort evoluties stel je overzichtelijk voor met <b>matrices</b>.</p></div>
    <div class="kader def"><div class="kader-titel">Matrix</div>
      <p>Een <b>matrix</b> is een rechthoekig schema van getallen, gerangschikt in rijen en kolommen. Een matrix met $m$ rijen en $n$ kolommen is een <b>$m \\times n$-matrix</b> (de <b>dimensie</b>). Is $m = n$, dan is het een <b>vierkante matrix</b>.</p>
      <p class="midden">$A = \\begin{pmatrix} 2 & -1 & 0 \\\\ 4 & 3 & 5 \\end{pmatrix}$ is een $2 \\times 3$-matrix.</p>
      <p>Het element op rij $i$ en kolom $j$ noteer je $a_{ij}$. Hier is $a_{12} = -1$ en $a_{23} = 5$.</p></div>${INVUL}`,
  voorbeelden: [
    { tex: 'B = \\begin{pmatrix} 1 & 4 \\\\ 0 & -2 \\\\ 7 & 3 \\end{pmatrix}', stappen: ['\\text{3 rijen, 2 kolommen: } 3 \\times 2\\text{-matrix}', 'b_{31} = 7, \\quad b_{22} = -2'] },
  ],
  soorten: {
    dim: { naam: 'Dimensie', gen() {
      const m = rnd(1, 4), n = rnd(1, 4), A = rndM(m, n);
      return { soort: 'dim', opdracht: 'Eerst het aantal rijen, dan het aantal kolommen.', tex: `A = ${mtex(A)}`, html: vraag('Wat is de dimensie van A?'), sleutel: `${m}${n}${A}`,
        antw: { soort: 'delen', delen: [{ label: '\\text{aantal rijen}', antw: getal(m) }, { label: '\\text{aantal kolommen}', antw: getal(n) }] }, uitleg: [`${m} \\text{ rijen en } ${n} \\text{ kolommen: } ${dimT(A)}\\text{-matrix}`] };
    } },
    elem: { naam: 'Element aflezen', gen() {
      const m = rnd(2, 4), n = rnd(2, 4), A = rndM(m, n, -9, 9), i = rnd(1, m), j = rnd(1, n);
      return { soort: 'elem', opdracht: 'a_ij staat op rij i en kolom j.', tex: `A = ${mtex(A)}`, html: vraag(`Hoeveel is $a_{${i}${j}}$?`), sleutel: `${A}${i}${j}`,
        antw: getal(A[i - 1][j - 1], { voor: `a_{${i}${j}} =` }), uitleg: [`\\text{rij } ${i}, \\text{ kolom } ${j}: \\; a_{${i}${j}} = ${tg(A[i - 1][j - 1])}`] };
    } },
    vierkant: { naam: 'Vierkant of niet?', gen() {
      const m = rnd(1, 4), n = Math.random() < 0.5 ? m : rnd(1, 4), A = rndM(m, n);
      return { soort: 'vierkant', opdracht: 'Een vierkante matrix heeft evenveel rijen als kolommen.', tex: `A = ${mtex(A)}`, html: vraag('Is A een vierkante matrix?'), sleutel: `v${A}`,
        antw: tekstKeuze(['ja', 'nee'], m === n ? 'ja' : 'nee'), uitleg: [`${dimT(A)}: ${m === n ? '\\text{evenveel rijen als kolommen}' : '\\text{niet evenveel rijen als kolommen}'}`] };
    } },
  },
  oefenMix: [['dim', 2], ['elem', 2], ['vierkant', 1]],
  test: [['dim', 4], ['elem', 4], ['vierkant', 2]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Optellen en scalaire vermenigvuldiging', kort: 'Element per element.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Optellen en aftrekken</div>
      <p>Enkel mogelijk bij <b>gelijke dimensies</b>. Je telt <b>element per element</b> op (of trekt af).</p>
      <p class="midden">$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} + \\begin{pmatrix} 5 & 0 \\\\ -1 & 2 \\end{pmatrix} = \\begin{pmatrix} 6 & 2 \\\\ 2 & 6 \\end{pmatrix}$</p></div>
    <div class="kader def"><div class="kader-titel">Scalaire vermenigvuldiging</div>
      <p>Vermenigvuldig <b>elk element</b> met de scalair (het getal).</p>
      <p class="midden">$2 \\cdot \\begin{pmatrix} 1 & -3 \\\\ 0 & 4 \\end{pmatrix} = \\begin{pmatrix} 2 & -6 \\\\ 0 & 8 \\end{pmatrix}$</p></div>${INVUL}`,
  voorbeelden: [
    { tex: '2A - 3B \\text{ met } A = \\begin{pmatrix} 1 & 0 \\\\ 2 & -1 \\end{pmatrix}, B = \\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix}', stappen: ['2A = \\begin{pmatrix} 2 & 0 \\\\ 4 & -2 \\end{pmatrix}, \\quad 3B = \\begin{pmatrix} 9 & 3 \\\\ 0 & 6 \\end{pmatrix}', '2A - 3B = \\begin{pmatrix} -7 & -3 \\\\ 4 & -8 \\end{pmatrix}'] },
  ],
  soorten: {
    som: { naam: 'A + B of A − B', gen() {
      const m = rnd(2, 3), n = rnd(2, 3), A = rndM(m, n), B = rndM(m, n), s = kies([1, -1]), C = plus(A, B, s);
      return { soort: 'som', opdracht: 'Element per element.', tex: `A = ${mtex(A)}, \\quad B = ${mtex(B)}`, html: vraag(`Bereken A ${s > 0 ? '+' : '−'} B.`), sleutel: `${A}${B}${s}`,
        antw: matAntw(C, `A ${s > 0 ? '+' : '-'} B =`), uitleg: [`A ${s > 0 ? '+' : '-'} B = ${mtex(C)}`] };
    } },
    scalair: { naam: 'kA', gen() {
      const m = rnd(2, 3), n = rnd(2, 3), A = rndM(m, n), k = kies([2, 3, 4, 5, -1, -2, -3]), C = maal(k, A);
      return { soort: 'scalair', opdracht: 'Vermenigvuldig elk element met de scalair.', tex: `A = ${mtex(A)}`, html: vraag(`Bereken ${k}A.`), sleutel: `${A}${k}`,
        antw: matAntw(C, `${k}A =`), uitleg: [`${k}A = ${mtex(C)}`] };
    } },
    combi: { naam: 'kA + lB', gen() {
      const A = rndM(2, 2), B = rndM(2, 2), k = kies([2, 3, -1, -2]), l = kies([2, 3, -2, -3]), C = plus(maal(k, A), maal(l, B));
      return { soort: 'combi', opdracht: 'Eerst de scalaire vermenigvuldigingen, dan optellen.', tex: `A = ${mtex(A)}, \\quad B = ${mtex(B)}`, html: vraag(`Bereken ${k}A ${l < 0 ? '−' : '+'} ${Math.abs(l)}B.`), sleutel: `${A}${B}${k}${l}`,
        antw: matAntw(C), uitleg: [`${k}A = ${mtex(maal(k, A))}, \\quad ${l}B = ${mtex(maal(l, B))}`, `= ${mtex(C)}`] };
    } },
    kan: { naam: 'Kan het?', gen() {
      const m = rnd(1, 3), n = rnd(1, 3), zelfde = Math.random() < 0.5, A = rndM(m, n), B = zelfde ? rndM(m, n) : rndM(m === 3 ? 2 : m + 1, n);
      return { soort: 'kan', opdracht: 'Optellen kan enkel bij gelijke dimensies.', tex: `A = ${mtex(A)}, \\quad B = ${mtex(B)}`, html: vraag('Kan je A + B berekenen?'), sleutel: `k${A}${B}`,
        antw: tekstKeuze(['ja', 'nee'], zelfde ? 'ja' : 'nee'), uitleg: [`A: ${dimT(A)}, \\; B: ${dimT(B)} \\Rightarrow ${zelfde ? '\\text{gelijke dimensies}' : '\\text{verschillende dimensies}'}`] };
    } },
  },
  oefenMix: [['som', 2], ['scalair', 1], ['combi', 2], ['kan', 1]],
  test: [['som', 3], ['scalair', 2], ['combi', 3], ['kan', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Matrixvermenigvuldiging', kort: 'Rij van de eerste matrix × kolom van de tweede.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Matrixvermenigvuldiging</div>
      <p>Voor $A$ ($m \\times n$) en $B$ ($n \\times p$) is $A \\cdot B$ een $m \\times p$-matrix. Het element op rij $i$ en kolom $j$ krijg je door <b>rij $i$ van $A$</b> te combineren met <b>kolom $j$ van $B$</b>: vermenigvuldig overeenkomstige elementen en tel op.</p>
      <p>Het kan enkel als het <b>aantal kolommen van $A$ = het aantal rijen van $B$</b>.</p>
      <p class="midden">$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\cdot \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix} = \\begin{pmatrix} 1\\cdot5 + 2\\cdot7 & 1\\cdot6 + 2\\cdot8 \\\\ 3\\cdot5 + 4\\cdot7 & 3\\cdot6 + 4\\cdot8 \\end{pmatrix} = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$</p></div>
    <div class="kader eig"><div class="kader-titel">Let op</div><p>Matrixvermenigvuldiging is <b>niet commutatief</b>: in het algemeen is $A \\cdot B \\neq B \\cdot A$.</p></div>${INVUL}`,
  voorbeelden: [
    { tex: '\\begin{pmatrix} 2 & 0 & 1 \\end{pmatrix} \\cdot \\begin{pmatrix} 3 \\\\ -1 \\\\ 4 \\end{pmatrix}', stappen: ['1 \\times 3 \\text{ maal } 3 \\times 1 \\Rightarrow 1 \\times 1', '2 \\cdot 3 + 0 \\cdot (-1) + 1 \\cdot 4 = 10'] },
  ],
  soorten: {
    p22: { naam: '2×2 maal 2×2', gen() {
      const A = rndM(2, 2, -4, 5), B = rndM(2, 2, -4, 5), C = prod(A, B);
      return { soort: 'p22', opdracht: 'Rij van A maal kolom van B.', tex: `A = ${mtex(A)}, \\quad B = ${mtex(B)}`, html: vraag('Bereken A · B.'), sleutel: `${A}${B}`,
        antw: matAntw(C, 'A \\cdot B ='), uitleg: [elemUitleg(A, B, 0, 0), elemUitleg(A, B, 0, 1), elemUitleg(A, B, 1, 0), elemUitleg(A, B, 1, 1)] };
    } },
    pmn: { naam: 'Andere dimensies', gen() {
      const m = rnd(1, 3), n = rnd(2, 3), p = rnd(1, 2), A = rndM(m, n, -3, 4), B = rndM(n, p, -3, 4), C = prod(A, B);
      return { soort: 'pmn', opdracht: 'Bepaal eerst de dimensie van het product.', tex: `A = ${mtex(A)}, \\quad B = ${mtex(B)}`, html: vraag('Bereken A · B.'), sleutel: `${A}${B}`,
        antw: matAntw(C, 'A \\cdot B ='), uitleg: [`${dimT(A)} \\text{ maal } ${dimT(B)} \\Rightarrow ${dimT(C)}`, elemUitleg(A, B, 0, 0), `A \\cdot B = ${mtex(C)}`] };
    } },
    dim: { naam: 'Kan het? Welke dimensie?', gen() {
      const m = rnd(1, 4), n = rnd(1, 4), n2 = Math.random() < 0.6 ? n : rnd(1, 4), p = rnd(1, 4), kan = n === n2;
      const opties = schud([...new Set([`${m} × ${p}`, `${n} × ${n2}`, `${p} × ${m}`, 'kan niet', `${m} × ${n2}`])]).slice(0, 4);
      const juist = kan ? `${m} × ${p}` : 'kan niet'; if (!opties.includes(juist)) opties[0] = juist;
      return { soort: 'dim', opdracht: 'Aantal kolommen van A = aantal rijen van B?', html: opgave(`A is een ${m} × ${n}-matrix en B is een ${n2} × ${p}-matrix.`) + vraag('Welke dimensie heeft A · B?'), sleutel: `${m}${n}${n2}${p}`,
        antw: tekstKeuze(schud(opties), juist), uitleg: [kan ? `${n} = ${n2}: \\; A \\cdot B \\text{ is een } ${m} \\times ${p}\\text{-matrix}` : `${n} \\neq ${n2}: \\text{ het product bestaat niet}`] };
    } },
    commut: { naam: 'A · B en B · A', gen() {
      let A, B; do { A = rndM(2, 2, -3, 4); B = rndM(2, 2, -3, 4); } while (JSON.stringify(prod(A, B)) === JSON.stringify(prod(B, A)));
      const C = prod(B, A);
      return { soort: 'commut', opdracht: 'Let op de volgorde: rij van de eerste matrix (B) maal kolom van de tweede (A).', tex: `A = ${mtex(A)}, \\quad B = ${mtex(B)}`, html: vraag('Bereken B · A.'), sleutel: `c${A}${B}`,
        antw: matAntw(C, 'B \\cdot A ='), uitleg: [`B \\cdot A = ${mtex(C)}`, `A \\cdot B = ${mtex(prod(A, B))} \\neq B \\cdot A`] };
    } },
  },
  oefenMix: [['p22', 2], ['pmn', 1], ['dim', 1], ['commut', 1]],
  test: [['p22', 3], ['pmn', 3], ['dim', 2], ['commut', 2]], testSchudden: true,
};

const D4 = {
  nr: 4, titel: 'Machten en transponeren', kort: 'A² = A · A en Aᵀ: rijen en kolommen wisselen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Machtsverheffing</div>
      <p>Enkel bij <b>vierkante matrices</b>: $A^2 = A \\cdot A$, $A^3 = A \\cdot A \\cdot A$, enzovoort. Let op: $A^2$ is <b>niet</b> elk element in het kwadraat!</p></div>
    <div class="kader def"><div class="kader-titel">Transponeren</div>
      <p>Bij de <b>getransponeerde</b> matrix $A^T$ worden rijen en kolommen omgewisseld: rij 1 van $A$ wordt kolom 1 van $A^T$.</p>
      <p class="midden">$A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix} \\;\\Rightarrow\\; A^T = \\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}$</p></div>${INVUL}`,
  voorbeelden: [
    { tex: 'A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}, \\; A^2 = ?', stappen: ['A^2 = A \\cdot A = \\begin{pmatrix} 1 \\cdot 1 + 2 \\cdot 0 & 1 \\cdot 2 + 2 \\cdot 3 \\\\ 0 \\cdot 1 + 3 \\cdot 0 & 0 \\cdot 2 + 3 \\cdot 3 \\end{pmatrix}', '= \\begin{pmatrix} 1 & 8 \\\\ 0 & 9 \\end{pmatrix}'] },
  ],
  soorten: {
    kwadraat: { naam: 'A²', gen() {
      const A = rndM(2, 2, -3, 4), C = prod(A, A);
      return { soort: 'kwadraat', opdracht: 'A² = A · A (niet elk element in het kwadraat!).', tex: `A = ${mtex(A)}`, html: vraag('Bereken A².'), sleutel: `${A}`,
        antw: matAntw(C, 'A^2 ='), uitleg: [elemUitleg(A, A, 0, 0), elemUitleg(A, A, 0, 1), elemUitleg(A, A, 1, 0), elemUitleg(A, A, 1, 1)] };
    } },
    transp: { naam: 'Aᵀ', gen() {
      const m = rnd(1, 3), n = rnd(2, 3), A = rndM(m, n, -9, 9), C = transp(A);
      return { soort: 'transp', opdracht: 'Rij 1 van A wordt kolom 1 van Aᵀ.', tex: `A = ${mtex(A)}`, html: vraag('Schrijf de getransponeerde Aᵀ.'), sleutel: `t${A}`,
        antw: matAntw(C, 'A^T ='), uitleg: [`A^T = ${mtex(C)}`] };
    } },
    dimT: { naam: 'Dimensie van Aᵀ', gen() {
      const m = rnd(1, 5), n = rnd(1, 5);
      return { soort: 'dimT', opdracht: 'Rijen en kolommen wisselen.', html: opgave(`A is een ${m} × ${n}-matrix.`) + vraag('Hoeveel rijen en kolommen heeft Aᵀ?'), sleutel: `${m}${n}`,
        antw: { soort: 'delen', delen: [{ label: '\\text{aantal rijen}', antw: getal(n) }, { label: '\\text{aantal kolommen}', antw: getal(m) }] }, uitleg: [`A^T \\text{ is een } ${n} \\times ${m}\\text{-matrix}`] };
    } },
    kanMacht: { naam: 'Kan je A² berekenen?', gen() {
      const m = rnd(1, 3), n = Math.random() < 0.5 ? m : rnd(1, 3), A = rndM(m, n);
      return { soort: 'kanMacht', opdracht: 'Machten bestaan enkel bij vierkante matrices.', tex: `A = ${mtex(A)}`, html: vraag('Kan je A² berekenen?'), sleutel: `km${A}`,
        antw: tekstKeuze(['ja', 'nee'], m === n ? 'ja' : 'nee'), uitleg: [m === n ? '\\text{vierkante matrix: } A \\cdot A \\text{ bestaat}' : `${dimT(A)}: \\text{ geen vierkante matrix}`] };
    } },
  },
  oefenMix: [['kwadraat', 2], ['transp', 2], ['dimT', 1], ['kanMacht', 1]],
  test: [['kwadraat', 4], ['transp', 3], ['dimT', 1], ['kanMacht', 2]], testSchudden: true,
};

// ---------- overgangsmatrices
const SIT = [
  ['actieve', 'rustende', 'cellen', 'actief', 'rustend', 'uur'], ['stadsbewoners', 'plattelandsbewoners', 'inwoners', 'stad', 'platteland', 'jaar'],
  ['gezonde', 'zieke', 'planten', 'gezond', 'ziek', 'week'], ['klanten van winkel X', 'klanten van winkel Y', 'klanten', 'X', 'Y', 'maand'],
];
function overgang() {
  const [n1, n2, wie, t1, t2, per] = kies(SIT), a = kies([5, 10, 15, 20, 25, 30]), b = kies([5, 10, 20, 30, 40, 50]);
  const T = [[1 - a / 100, b / 100], [a / 100, 1 - b / 100]], v0 = [[kies([100, 200, 400, 500, 1000])], [kies([100, 200, 300, 500])]];
  return { n1, n2, wie, t1, t2, per, a, b, T, v0, tekst: `Elk ${per} gaat ${a}% van de ${n1} naar ${t2}, en ${b}% van de ${n2} naar ${t1}. De rest blijft. (Kolom 1 = van ${t1}, kolom 2 = van ${t2}; rij 1 = ${t1}, rij 2 = ${t2}.)` };
}
const D5 = {
  nr: 5, titel: 'Matrixmodellen: overgangsmatrices', kort: 'vₙ₊₁ = T · vₙ', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Overgangsmatrix</div>
      <p>De overgangspercentages uit de instap (20% actief → rustend, 30% rustend → actief) zet je in een <b>overgangsmatrix</b> $T$. Kolom = <b>van</b>, rij = <b>naar</b> (rij/kolom 1 = actief, 2 = rustend):</p>
      <p class="midden">$T = \\begin{pmatrix} 0{,}8 & 0{,}3 \\\\ 0{,}2 & 0{,}7 \\end{pmatrix}$ &nbsp; en de begintoestand &nbsp; $v_0 = \\begin{pmatrix} 100 \\\\ 50 \\end{pmatrix}$</p>
      <p>De som van elke kolom is 1: alle cellen gaan ergens naartoe.</p></div>
    <div class="kader eig"><div class="kader-titel">Evolutie berekenen</div>
      <p class="midden">$v_1 = T \\cdot v_0 = \\begin{pmatrix} 0{,}8 \\cdot 100 + 0{,}3 \\cdot 50 \\\\ 0{,}2 \\cdot 100 + 0{,}7 \\cdot 50 \\end{pmatrix} = \\begin{pmatrix} 95 \\\\ 55 \\end{pmatrix}$</p>
      <p>Na 2 stappen: $v_2 = T \\cdot v_1$ (of rechtstreeks $T^2 \\cdot v_0$).</p></div>${INVUL}`,
  voorbeelden: [
    { tex: 'v_2 = T \\cdot v_1 = \\begin{pmatrix} 0{,}8 & 0{,}3 \\\\ 0{,}2 & 0{,}7 \\end{pmatrix} \\cdot \\begin{pmatrix} 95 \\\\ 55 \\end{pmatrix}', stappen: ['0{,}8 \\cdot 95 + 0{,}3 \\cdot 55 = 92{,}5', '0{,}2 \\cdot 95 + 0{,}7 \\cdot 55 = 57{,}5'] },
  ],
  soorten: {
    opstellen: { naam: 'Overgangsmatrix opstellen', gen() {
      const S = overgang();
      return { soort: 'opstellen', opdracht: 'Kolom = van, rij = naar. Schrijf percentages als kommagetal.', html: opgave(S.tekst) + vraag('Stel de overgangsmatrix T op.'), sleutel: S.tekst,
        antw: matAntw(S.T, 'T ='), uitleg: [`T = ${mtex(S.T)}`, '\\text{controle: de som van elke kolom is } 1'] };
    } },
    stap1: { naam: 'v₁ = T · v₀', gen() {
      const S = overgang(), v1 = prod(S.T, S.v0);
      return { soort: 'stap1', opdracht: 'Matrixvermenigvuldiging T · v₀.', html: opgave(S.tekst) + `<p class="midden">$T = ${mtex(S.T)}, \\quad v_0 = ${mtex(S.v0)}$</p>` + vraag(`Bereken de toestand na 1 ${S.per}: v₁ = T · v₀.`), sleutel: 's1' + S.tekst + S.v0,
        antw: matAntw(v1.map(r => r.map(v => W.rond(v, 4))), 'v_1 ='), uitleg: [elemUitleg(S.T, S.v0, 0, 0), elemUitleg(S.T, S.v0, 1, 0)] };
    } },
    stap2: { naam: 'v₂ = T · v₁', gen() {
      const S = overgang(), v1 = prod(S.T, S.v0), v2 = prod(S.T, v1), welk = rnd(0, 1);
      return { soort: 'stap2', opdracht: 'Bereken eerst v₁, dan v₂ = T · v₁. Rond af op 1 decimaal.', html: opgave(S.tekst) + `<p class="midden">$T = ${mtex(S.T)}, \\quad v_0 = ${mtex(S.v0)}$</p>` + vraag(`Hoeveel ${S.wie} zijn er na 2 ${S.per === 'week' ? 'weken' : S.per === 'maand' ? 'maanden' : S.per === 'jaar' ? 'jaar' : 'uur'} in toestand "${welk ? S.t2 : S.t1}"?`), sleutel: 's2' + S.tekst + S.v0 + welk,
        antw: getal(v2[welk][0], { dec: 1 }), uitleg: [`v_1 = ${mtex(v1.map(r => r.map(v => W.rond(v, 2))))}`, `v_2 = T \\cdot v_1 = ${mtex(v2.map(r => r.map(v => W.rond(v, 2))))}`] };
    } },
    kolomsom: { naam: 'Kolomsom', gen() {
      const v = kies([['Waarom is de som van elke kolom van een overgangsmatrix gelijk aan 1?', 'Omdat iedereen uit een toestand ergens naartoe gaat (of blijft): samen 100%.', ['Omdat elke rij 1 moet zijn.', 'Omdat de matrix vierkant is.', 'Omdat de getallen altijd kleiner zijn dan 1.']],
        ['Wat betekent het element op rij 1, kolom 2 van T?', 'Het deel dat van toestand 2 naar toestand 1 gaat.', ['Het deel dat van toestand 1 naar toestand 2 gaat.', 'Het deel dat in toestand 2 blijft.', 'Het aantal in toestand 1.']]]);
      const alle = schud([v[1], ...v[2]]);
      return { soort: 'kolomsom', opdracht: 'Kolom = van, rij = naar.', html: vraag(v[0]), sleutel: v[0], antw: { soort: 'keuze', lijst: true, opties: alle.map((z, i) => ({ k: String(i), l: z, html: true })), juist: String(alle.indexOf(v[1])) }, uitleg: [tx(v[1])] };
    } },
  },
  oefenMix: [['opstellen', 2], ['stap1', 2], ['stap2', 1], ['kolomsom', 1]],
  test: [['opstellen', 3], ['stap1', 4], ['stap2', 2], ['kolomsom', 1]], testSchudden: true,
};

const D6 = {
  nr: 6, titel: 'Grafen en adjacentiematrices', kort: '1 als twee knopen verbonden zijn, 0 als niet.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Matrixvoorstelling van een graaf</div>
      <p>Een <b>graaf</b> is een netwerk van knopen en verbindingen. De <b>adjacentiematrix</b> noteert voor elk paar knopen een <b>1</b> als ze verbonden zijn en een <b>0</b> als niet.</p>
      ${graafSVG(3, [[0, 1, 1], [1, 0, 0], [1, 0, 0]])}
      <p class="midden">$M = \\begin{pmatrix} 0 & 1 & 1 \\\\ 1 & 0 & 0 \\\\ 1 & 0 & 0 \\end{pmatrix}$ &nbsp; (rij/kolom in volgorde A, B, C)</p>
      <p>De 0'en op de diagonaal: een knoop is niet met zichzelf verbonden. De matrix is <b>symmetrisch</b>: is A met B verbonden, dan ook B met A.</p></div>${INVUL}`,
  voorbeelden: [
    { html: opgave('Vier knopen A, B, C, D met de verbindingen A-B, B-C, C-D en D-A.'), stappen: ['M = \\begin{pmatrix} 0 & 1 & 0 & 1 \\\\ 1 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 1 \\\\ 1 & 0 & 1 & 0 \\end{pmatrix}'] },
  ],
  soorten: {
    opstellen: { naam: 'Adjacentiematrix opstellen', gen() {
      const n = kies([3, 4, 4]), M = rndGraaf(n);
      return { soort: 'opstellen', opdracht: `Rij/kolom in volgorde ${KNOOP.slice(0, n).join(', ')}.`, html: graafSVG(n, M) + vraag('Stel de adjacentiematrix op.'), sleutel: `${M}`,
        antw: matAntw(M, 'M ='), uitleg: [`M = ${mtex(M)}`] };
    } },
    lijst: { naam: 'Uit een lijst verbindingen', gen() {
      const n = kies([4, 5]), M = rndGraaf(n), lijst = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (M[i][j]) lijst.push(KNOOP[i] + '-' + KNOOP[j]);
      return { soort: 'lijst', opdracht: `Rij/kolom in volgorde ${KNOOP.slice(0, n).join(', ')}.`, html: opgave(`Een graaf met ${n} knopen heeft de verbindingen ${lijst.join(', ')}.`) + vraag('Stel de adjacentiematrix op.'), sleutel: `l${M}`,
        antw: matAntw(M, 'M ='), uitleg: [`M = ${mtex(M)}`] };
    } },
    lezen: { naam: 'Matrix lezen', gen() {
      const n = 4, M = rndGraaf(n), i = rnd(0, n - 1), aantal = M[i].reduce((s, v) => s + v, 0);
      return { soort: 'lezen', opdracht: `Rij/kolom in volgorde A, B, C, D.`, tex: `M = ${mtex(M)}`, html: vraag(`Met hoeveel knopen is ${KNOOP[i]} verbonden?`), sleutel: `r${M}${i}`,
        antw: getal(aantal), uitleg: [`\\text{tel de 1'en in rij } ${i + 1}: ${aantal}`] };
    } },
  },
  oefenMix: [['opstellen', 2], ['lijst', 1], ['lezen', 1]],
  test: [['opstellen', 4], ['lijst', 3], ['lezen', 3]], testSchudden: true,
};

// ---------- Gauss-Jordan
const GJTEKST = `<div class="kader def"><div class="kader-titel">De methode van Gauss-Jordan</div>
    <p>Stel de <b>uitgebreide matrix</b> op: de coëfficiënten van de onbekenden, met de rechterleden als laatste kolom. Herleid met drie toegelaten <b>rijoperaties</b> tot links de <b>identiteitsmatrix</b> staat:</p>
    <ol><li>twee rijen van plaats wisselen;</li><li>een rij vermenigvuldigen met een getal verschillend van 0;</li><li>een veelvoud van een rij optellen bij een andere rij.</li></ol>
    <p><b>Werkwijze:</b> werk kolom per kolom, van links naar rechts. Maak eerst een 1 op de diagonaal, en gebruik die om alle andere elementen in die kolom op 0 te brengen. Lees dan de oplossing af in de laatste kolom.</p></div>`;
const varn = ['x', 'y', 'z'];
const vglTex = (r) => { let s = ''; r.slice(0, -1).forEach((c, i) => { if (!c) return; const t = Math.abs(c) === 1 ? varn[i] : `${Math.abs(c)}${varn[i]}`; s += s ? ` ${c < 0 ? '-' : '+'} ${t}` : `${c < 0 ? '-' : ''}${t}`; }); return `${s} = ${tg(r[r.length - 1])}`; };
function stelsel(k) {
  for (;;) {
    const sol = Array.from({ length: k }, () => rnd(-4, 5)), A = rndM(k, k, -3, 4); A[0][0] = kies([1, 1, 2, -1]);
    if (k === 2 && A[0][0] * A[1][1] - A[0][1] * A[1][0] === 0) continue;
    if (k === 3) { const d = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]); if (!d) continue; }
    if (A.some(r => r.every(v => !v))) continue;
    const M = A.map(r => [...r, r.reduce((s, v, i) => s + v * sol[i], 0)]);
    return { sol, M, tex: `\\begin{cases} ${M.map(vglTex).join(' \\\\ ')} \\end{cases}` };
  }
}
function gjStappen(M) { // rref met uitleg (breuken als kommagetal)
  const R = M.map(r => r.slice()), k = R.length, L = [];
  for (let c = 0; c < k; c++) {
    let p = c; while (p < k && Math.abs(R[p][c]) < 1e-12) p++;
    if (p !== c) { [R[p], R[c]] = [R[c], R[p]]; L.push(`R_{${c + 1}} \\leftrightarrow R_{${p + 1}}`); }
    const d = R[c][c]; if (Math.abs(d - 1) > 1e-12) { R[c] = R[c].map(v => v / d); L.push(`R_{${c + 1}} \\to \\frac{1}{${tg(W.rond(d, 4))}} R_{${c + 1}}`); }
    for (let r = 0; r < k; r++) if (r !== c && Math.abs(R[r][c]) > 1e-12) { const f = R[r][c]; R[r] = R[r].map((v, j) => v - f * R[c][j]); L.push(`R_{${r + 1}} \\to R_{${r + 1}} ${f > 0 ? '-' : '+'} ${Math.abs(f) === 1 ? '' : tg(W.rond(Math.abs(f), 4))}R_{${c + 1}}`); }
  }
  return { R: R.map(r => r.map(v => W.rond(v, 6))), L };
}
const D7 = {
  nr: 7, titel: 'Gauss-Jordan: de uitgebreide matrix', kort: 'Van stelsel naar matrix, en rijoperaties toepassen.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Stelsels met matrices</div><p>Je loste in vorige jaren al stelsels van twee vergelijkingen in twee onbekenden op. Met de methode van Gauss-Jordan los je stelsels met meer vergelijkingen en onbekenden <b>systematisch</b> op.</p></div>
    ${GJTEKST}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases} \\;\\Rightarrow\\; \\left(\\begin{array}{rrr|r} 1 & 1 & 1 & 6 \\\\ 2 & -1 & 1 & 3 \\\\ 1 & 2 & -1 & 2 \\end{array}\\right)$</p></div>${INVUL}`,
  voorbeelden: [
    { tex: '\\left(\\begin{array}{rr|r} 1 & 2 & 5 \\\\ 3 & -1 & 1 \\end{array}\\right), \\; R_2 \\to R_2 - 3R_1', stappen: ['R_2: \\; 3 - 3 \\cdot 1 = 0, \\; -1 - 3 \\cdot 2 = -7, \\; 1 - 3 \\cdot 5 = -14', '\\left(\\begin{array}{rr|r} 1 & 2 & 5 \\\\ 0 & -7 & -14 \\end{array}\\right)'] },
  ],
  soorten: {
    opstellen: { naam: 'Uitgebreide matrix opstellen', gen() {
      const k = kies([2, 3]), S = stelsel(k);
      return { soort: 'opstellen', opdracht: 'Coëfficiënten van x, y (en z), met het rechterlid in de laatste kolom.', tex: S.tex, html: vraag('Stel de uitgebreide matrix op.'), sleutel: `${S.M}`,
        antw: matAntw(S.M), uitleg: [utex(S.M, k)] };
    } },
    rijop: { naam: 'Een rijoperatie toepassen', gen() {
      const k = kies([2, 3]), S = stelsel(k), M = S.M.map(r => r.slice()); M[0][0] = 1; M[0][k] = M[0].slice(0, k).reduce((s, v, i) => s + v * S.sol[i], 0);
      let r = rnd(2, k), f = M[r - 1][0]; if (!f) { f = nz(-3, 3); M[r - 1][0] = f; M[r - 1][k] = M[r - 1].slice(0, k).reduce((s, v, i) => s + v * S.sol[i], 0); }
      const nieuw = M[r - 1].map((v, j) => v - f * M[0][j]);
      return { soort: 'rijop', opdracht: 'Bereken de nieuwe rij element per element.', tex: `${utex(M, k)}, \\quad R_{${r}} \\to R_{${r}} ${f > 0 ? '-' : '+'} ${Math.abs(f) === 1 ? '' : Math.abs(f)}R_1`, html: vraag(`Wat wordt de nieuwe rij ${r}?`), sleutel: `${M}${r}`,
        antw: matAntw([nieuw], `R_{${r}} =`), uitleg: [`R_{${r}}: ${M[r - 1].map((v, j) => `${tg(v)} ${f > 0 ? '-' : '+'} ${Math.abs(f)} \\cdot ${M[0][j] < 0 ? `(${tg(M[0][j])})` : tg(M[0][j])}`).join(', \\; ')}`, `= ${nieuw.map(tg).join(', \\; ')}`] };
    } },
    terug: { naam: 'Van matrix naar oplossing', gen() {
      const k = kies([2, 3]), sol = Array.from({ length: k }, () => rnd(-6, 7)), M = Array.from({ length: k }, (_, i) => [...Array.from({ length: k }, (_, j) => (i === j ? 1 : 0)), sol[i]]);
      return { soort: 'terug', opdracht: 'Links staat de identiteitsmatrix: lees de oplossing af in de laatste kolom.', tex: utex(M, k), html: vraag('Wat is de oplossing van het stelsel?'), sleutel: `t${sol}`,
        antw: { soort: 'delen', delen: sol.map((v, i) => ({ label: `${varn[i]} =`, antw: getal(v) })) }, uitleg: [sol.map((v, i) => `${varn[i]} = ${tg(v)}`).join(', \\; ')] };
    } },
  },
  oefenMix: [['opstellen', 2], ['rijop', 2], ['terug', 1]],
  test: [['opstellen', 4], ['rijop', 4], ['terug', 2]], testSchudden: true,
};

const D8 = {
  nr: 8, titel: 'Gauss-Jordan: stelsels oplossen', kort: 'Volledig oplossen, met 2 en met 3 onbekenden.', rekenmachine: true,
  theorie: `${GJTEKST}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p class="midden">$\\left(\\begin{array}{rr|r} 1 & 2 & 5 \\\\ 3 & -1 & 1 \\end{array}\\right) \\xrightarrow{R_2 - 3R_1} \\left(\\begin{array}{rr|r} 1 & 2 & 5 \\\\ 0 & -7 & -14 \\end{array}\\right) \\xrightarrow{R_2 : (-7)} \\left(\\begin{array}{rr|r} 1 & 2 & 5 \\\\ 0 & 1 & 2 \\end{array}\\right) \\xrightarrow{R_1 - 2R_2} \\left(\\begin{array}{rr|r} 1 & 0 & 1 \\\\ 0 & 1 & 2 \\end{array}\\right)$</p>
      <p>Oplossing: $x = 1$, $y = 2$. <b>Controle:</b> vul in: $1 + 4 = 5$ ✓ en $3 - 2 = 1$ ✓.</p></div>`,
  voorbeelden: [
    { tex: '\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases}', stappen: ['R_2 \\to R_2 - 2R_1, \\; R_3 \\to R_3 - R_1', '\\left(\\begin{array}{rrr|r} 1 & 1 & 1 & 6 \\\\ 0 & -3 & -1 & -9 \\\\ 0 & 1 & -2 & -4 \\end{array}\\right)', '\\ldots \\text{ verder kolom per kolom}', '\\left(\\begin{array}{rrr|r} 1 & 0 & 0 & 1 \\\\ 0 & 1 & 0 & 2 \\\\ 0 & 0 & 1 & 3 \\end{array}\\right) \\Rightarrow x = 1, y = 2, z = 3'] },
  ],
  soorten: {},
  oefenMix: [['twee', 2], ['drie', 2]],
  test: [['twee', 5], ['drie', 5]], testSchudden: true,
};
const gjVraag = (k, soort) => () => {
  const S = stelsel(k), { L } = gjStappen(S.M);
  return { soort, opdracht: 'Los op met Gauss-Jordan. Controleer je oplossing door in te vullen.', tex: S.tex, sleutel: `${S.M}`,
    antw: { soort: 'delen', delen: S.sol.map((v, i) => ({ label: `${varn[i]} =`, antw: getal(v) })) }, uitleg: [utex(S.M, k), ...L, S.sol.map((v, i) => `${varn[i]} = ${tg(v)}`).join(', \\; ')] };
};
D8.soorten = { twee: { naam: 'Twee onbekenden', gen: gjVraag(2, 'twee') }, drie: { naam: 'Drie onbekenden', gen: gjVraag(3, 'drie') } };

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D9 = {
  nr: 9, titel: 'Eindtest matrices en stelsels', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${INVUL}`,
  voorbeelden: [],
  soorten: { e1: mix(D2, 'combi', 'kA + lB'), e2: mix(D3, 'p22', 'A · B'), e3: mix(D3, 'dim', 'Dimensie van een product'), e4: mix(D4, 'kwadraat', 'A²'), e5: mix(D4, 'transp', 'Aᵀ'),
    e6: mix(D5, 'opstellen', 'Overgangsmatrix'), e7: mix(D5, 'stap1', 'v₁ = T · v₀'), e8: mix(D6, 'opstellen', 'Adjacentiematrix'), e9: mix(D8, 'twee', 'Gauss-Jordan (2)'), e10: mix(D8, 'drie', 'Gauss-Jordan (3)') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6, D7, D8, D9]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen.bind(s);
    s.gen = () => {
      const v = { ...g() };
      if (v.html) v.html = woorden(v.html);
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
  D.theorie = woorden(D.theorie);
  for (const vb of D.voorbeelden) if (vb.html) vb.html = woorden(vb.html);
}

Leerpaden.registreer({
  code: 'matrices-stelsels',
  titel: 'Matrices en stelsels',
  ondertitel: 'Toegepaste wiskunde · 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert rekenen met <b>matrices</b> (optellen, scalaire vermenigvuldiging, matrixvermenigvuldiging, machten en transponeren), matrices gebruiken als <b>model</b> voor evoluties en grafen,
    en <b>stelsels</b> oplossen met de methode van <b>Gauss-Jordan</b>. Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [
    { titel: 'A · Rekenen met matrices', delen: [1, 2, 3, 4] },
    { titel: 'B · Matrixmodellen', delen: [5, 6] },
    { titel: 'C · Stelsels met Gauss-Jordan', delen: [7, 8] },
    { titel: 'D · Eindtest', delen: [9] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9],
});
