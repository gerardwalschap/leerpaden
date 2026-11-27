// Programma 'thales' — automatisch samengevoegd uit bron/thales/ (niet rechtstreeks bewerken)
(() => {
// ===== De stelling van Thales · Toegepaste wiskunde 4BW =====
// Leidraad: cursus TWiskunde 4BW hoofdstuk 6 "De stelling van Thales" en de PWP/werkbundel (G. Walschap).
const { rnd, kies, schud } = W;
const tg = (x) => W.texGetal(W.rond(x, 2));
const kg = (x) => String(W.rond(x, 2)).replace('.', ',');
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde: W.rond(waarde, 2), voor: '', dec: 2, ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud(opties.map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const texKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud(opties.map(o => ({ k: o, l: o }))), juist });
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;

// ---------- figuren. Driehoeksvorm: Z links, A en B rechts, C op ZA en D op ZB (CD // AB).
function driehoeksvorm(lab = {}, f = 0.45, n = { A: 'A', B: 'B', C: 'C', D: 'D' }) {
  const Z = [30, 150], A = [330, 40], B = [330, 230], C = [Z[0] + f * (A[0] - Z[0]), Z[1] + f * (A[1] - Z[1])], D = [Z[0] + f * (B[0] - Z[0]), Z[1] + f * (B[1] - Z[1])];
  const t = (p, s, dx = 0, dy = 0, kl = '#1f2733') => `<text x="${p[0] + dx}" y="${p[1] + dy}" font-size="14" font-weight="bold" font-style="italic" fill="${kl}" text-anchor="middle">${s}</text>`;
  const m = (p, q, s, dx, dy) => s === undefined ? '' : `<text x="${(p[0] + q[0]) / 2 + dx}" y="${(p[1] + q[1]) / 2 + dy}" font-size="13" fill="${s === '?' ? '#c2561a' : '#1c4e8a'}" font-weight="${s === '?' ? 'bold' : 'normal'}" text-anchor="middle">${s}</text>`;
  let g = `<line x1="${Z[0]}" y1="${Z[1]}" x2="${A[0] + 20}" y2="${A[1] - 7}" stroke="#1f2733" stroke-width="1.8"/><line x1="${Z[0]}" y1="${Z[1]}" x2="${B[0] + 20}" y2="${B[1] + 7}" stroke="#1f2733" stroke-width="1.8"/>`;
  g += `<line x1="${C[0]}" y1="${C[1]}" x2="${D[0]}" y2="${D[1]}" stroke="#e8772e" stroke-width="2.6"/><line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="#e8772e" stroke-width="2.6"/>`;
  g += t(Z, 'Z', -12, 5) + t(A, n.A, 4, -10) + t(B, n.B, 4, 22) + t(C, n.C, -4, -10) + t(D, n.D, -4, 22);
  g += m(Z, C, lab.ZC, -6, -14) + m(Z, A, lab.ZA, 18, -34) + m(Z, D, lab.ZD, -6, 26) + m(Z, B, lab.ZB, 18, 44) + m(C, D, lab.CD, 22, 4) + m(A, B, lab.AB, 26, 4);
  return `<div class="figuur"><svg viewBox="0 0 380 270" width="380" height="270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thales in driehoeksvorm" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}
// Vlindervorm: A en B links, Z in het midden, A' en B' rechts (AB // A'B').
function vlindervorm(lab = {}, f = 1.6) {
  const Z = [170, 135], A = [70, 60], B = [70, 210], Ap = [Z[0] + f * (Z[0] - A[0]) * 0.6, Z[1] + f * (Z[1] - A[1]) * 0.6], Bp = [Z[0] + f * (Z[0] - B[0]) * 0.6, Z[1] + f * (Z[1] - B[1]) * 0.6];
  const t = (p, s, dx = 0, dy = 0) => `<text x="${p[0] + dx}" y="${p[1] + dy}" font-size="14" font-weight="bold" font-style="italic" fill="#1f2733" text-anchor="middle">${s}</text>`;
  const m = (p, q, s, dx, dy) => s === undefined ? '' : `<text x="${(p[0] + q[0]) / 2 + dx}" y="${(p[1] + q[1]) / 2 + dy}" font-size="13" fill="${s === '?' ? '#c2561a' : '#1c4e8a'}" font-weight="${s === '?' ? 'bold' : 'normal'}" text-anchor="middle">${s}</text>`;
  let g = `<line x1="${A[0]}" y1="${A[1]}" x2="${Ap[0]}" y2="${Ap[1]}" stroke="#1f2733" stroke-width="1.8"/><line x1="${B[0]}" y1="${B[1]}" x2="${Bp[0]}" y2="${Bp[1]}" stroke="#1f2733" stroke-width="1.8"/>`;
  g += `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="#e8772e" stroke-width="2.6"/><line x1="${Ap[0]}" y1="${Ap[1]}" x2="${Bp[0]}" y2="${Bp[1]}" stroke="#e8772e" stroke-width="2.6"/>`;
  g += t(Z, 'Z', 0, -12) + t(A, 'A', -12, 0) + t(B, 'B', -12, 10) + t(Ap, "A'", 14, 14) + t(Bp, "B'", 14, -2);
  g += m(Z, A, lab.ZA, 8, -12) + m(Z, B, lab.ZB, 8, 24) + m(Z, Ap, lab.ZAp, 8, 26) + m(Z, Bp, lab.ZBp, 8, -12) + m(A, B, lab.AB, -24, 4) + m(Ap, Bp, lab.ApBp, 28, 4);
  return `<div class="figuur"><svg viewBox="0 0 400 290" width="400" height="290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thales in vlindervorm" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}
const STIJL = `.vraagzin{margin-top:12px;font-size:16px}`;
if (typeof document !== 'undefined' && document.head && !document.getElementById('th-stijl')) { const st = document.createElement('style'); st.id = 'th-stijl'; st.textContent = STIJL; document.head.appendChild(st); }
const STELLING = `<div class="kader def"><div class="kader-titel">Stelling van Thales</div>
  <p>Als $C$ op $ZA$ ligt, $D$ op $ZB$ ligt en $CD \\parallel AB$, dan geldt:</p>
  <p class="midden">$\\dfrac{|ZC|}{|ZA|} = \\dfrac{|ZD|}{|ZB|} = \\dfrac{|CD|}{|AB|}$</p></div>`;
const AANPAK = `<div class="kader eig"><div class="kader-titel">Aanpak</div><ol><li>Welke twee lijnstukken zijn evenwijdig?</li><li>Bepaal het gemeenschappelijke snijpunt $Z$.</li><li>Stel de evenredigheid op met de vier lengtes <b>vanaf $Z$</b>.</li><li>Los op naar de onbekende.</li></ol></div>`;
const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraak</div><p>Rond af op <b>0,01</b> waar nodig. Een kommagetal typ je met een komma: <code>3,6</code>.</p></div>`;
const r2 = (x) => W.rond(x, 2);
// mooie getallen: ZC = a, ZA = b (b > a), ZB = c, ZD = a·c/b
function kiesThales() { for (;;) { const a = rnd(2, 9), b = a + rnd(1, 8), c = rnd(3, 14), d = a * c / b; if (Math.abs(d * 10 - Math.round(d * 10)) < 1e-9) return { a, b, c, d }; } }

// ===================================================================
const D1 = {
  nr: 1, titel: 'De stelling van Thales', kort: 'ZC/ZA = ZD/ZB = CD/AB · verband met homothetie.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">De configuratie</div><p>Twee rechten gaan door een punt $Z$. Twee <b>evenwijdige</b> rechten snijden deze twee rechten, telkens in twee punten.</p></div>
    ${driehoeksvorm({ ZC: '|ZC|', ZA: '|ZA|', ZD: '|ZD|', ZB: '|ZB|' })}${STELLING}
    <p>Deze vorm (met $Z$ als "top" en de evenwijdige lijnstukken $CD$ en $AB$) heet de <b>driehoeksvorm</b>.</p>
    <div class="kader eig"><div class="kader-titel">Verband met de homothetie</div><p>$C$ is het beeld van $A$ en $D$ het beeld van $B$ onder de homothetie met centrum $Z$ en factor $k = \\dfrac{|ZC|}{|ZA|}$. De stelling van Thales is dus een eigenschap van een homothetie.</p></div>`,
  voorbeelden: [{ tex: '|ZC| = 2, \\; |ZA| = 8', stappen: ['k = \\dfrac{2}{8} = 0{,}25', '\\text{alle verhoudingen zijn } 0{,}25: \\; |ZD| = 0{,}25 \\cdot |ZB| \\text{ en } |CD| = 0{,}25 \\cdot |AB|'] }],
  soorten: {
    verhouding: { naam: 'Welke verhouding is gelijk?', gen() {
      const g = kies([['\\dfrac{|ZC|}{|ZA|}', '\\dfrac{|ZD|}{|ZB|}'], ['\\dfrac{|ZD|}{|ZB|}', '\\dfrac{|CD|}{|AB|}'], ['\\dfrac{|CD|}{|AB|}', '\\dfrac{|ZC|}{|ZA|}']]);
      const fout = ['\\dfrac{|ZC|}{|CA|}', '\\dfrac{|ZA|}{|ZD|}', '\\dfrac{|AB|}{|ZB|}', '\\dfrac{|ZC|}{|ZB|}'];
      return { soort: 'verhouding', opdracht: 'CD // AB.', html: driehoeksvorm({}) + vraag(`Welke verhouding is gelijk aan $${g[0]}$?`), sleutel: `vh${g[0]}`, antw: texKeuze([g[1], ...schud(fout).slice(0, 3)], g[1]), uitleg: [`\\dfrac{|ZC|}{|ZA|} = \\dfrac{|ZD|}{|ZB|} = \\dfrac{|CD|}{|AB|}`] };
    } },
    factor: { naam: 'De homothetiefactor', gen() { const { a, b } = kiesThales(); return { soort: 'factor', opdracht: 'CD // AB. C is het beeld van A onder een homothetie met centrum Z.', html: driehoeksvorm({ ZC: kg(a), ZA: kg(b) }, a / b) + vraag('Bepaal de factor k van die homothetie (afgerond op 0,01).'), sleutel: `fa${a}${b}`,
      antw: getal(a / b, { voor: 'k =' }), uitleg: [`k = \\dfrac{|ZC|}{|ZA|} = \\dfrac{${a}}{${b}} \\approx ${tg(a / b)}`] }; } },
    voorwaarde: { naam: 'Wanneer mag je Thales gebruiken?', gen() { const L = [['CD en AB zijn evenwijdig', true], ['CD en AB zijn even lang', false], ['C ligt op ZA en D ligt op ZB', true], ['ZA en ZB zijn even lang', false], ['de hoek bij Z is recht', false]]; const [t, w] = kies(L);
      return { soort: 'voorwaarde', html: vraag(`Is dit een voorwaarde van de stelling van Thales: "${t}"?`), sleutel: `vw${t}`, antw: tekstKeuze(['ja', 'nee'], w ? 'ja' : 'nee'), uitleg: [tx('Voorwaarden: C op ZA, D op ZB en CD // AB.')] }; } },
  },
  oefenMix: [['verhouding', 3], ['factor', 2], ['voorwaarde', 2]],
  test: [['verhouding', 4], ['factor', 3], ['voorwaarde', 3]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Een lengte berekenen (driehoeksvorm)', kort: 'Evenredigheid vanaf Z opstellen en oplossen.', rekenmachine: true,
  theorie: `${STELLING}<div class="kader werk"><div class="kader-titel">Voorbeeld</div><p>$|ZC| = 3$, $|ZA| = 12$, $|ZB| = 8$ en $CD \\parallel AB$. Bereken $|ZD|$.</p>
    <p class="midden">$\\dfrac{|ZC|}{|ZA|} = \\dfrac{|ZD|}{|ZB|} \\iff \\dfrac{3}{12} = \\dfrac{|ZD|}{8} \\iff |ZD| = \\dfrac{3 \\cdot 8}{12} = 2$</p></div>${AANPAK}${AFSPRAAK}`,
  voorbeelden: [{ tex: '|ZD| = 3, \\; |ZB| = 9, \\; |AB| = 12. \\; |CD| = ?', stappen: ['\\dfrac{|ZD|}{|ZB|} = \\dfrac{|CD|}{|AB|} \\iff \\dfrac{3}{9} = \\dfrac{|CD|}{12}', '|CD| = \\dfrac{3 \\cdot 12}{9} = 4'] }],
  soorten: {
    ZD: { naam: 'Een stuk vanaf Z', gen() { const { a, b, c, d } = kiesThales(); return { soort: 'ZD', opdracht: 'CD // AB.', html: driehoeksvorm({ ZC: kg(a), ZA: kg(b), ZB: kg(c), ZD: '?' }, a / b) + vraag('Bereken |ZD|.'), sleutel: `zd${a}${b}${c}`,
      antw: getal(d, { voor: '|ZD| =' }), uitleg: [`\\dfrac{${a}}{${b}} = \\dfrac{|ZD|}{${c}}`, `|ZD| = \\dfrac{${a} \\cdot ${c}}{${b}} = ${tg(d)}`] }; } },
    ZB: { naam: 'Het hele stuk vanaf Z', gen() { const { a, b, c, d } = kiesThales(); return { soort: 'ZB', opdracht: 'CD // AB.', html: driehoeksvorm({ ZC: kg(a), ZA: kg(b), ZD: kg(d), ZB: '?' }, a / b) + vraag('Bereken |ZB|.'), sleutel: `zb${a}${b}${c}`,
      antw: getal(c, { voor: '|ZB| =' }), uitleg: [`\\dfrac{${a}}{${b}} = \\dfrac{${tg(d)}}{|ZB|}`, `|ZB| = \\dfrac{${b} \\cdot ${tg(d)}}{${a}} = ${tg(c)}`] }; } },
    CD: { naam: 'Het evenwijdige stuk', gen() { const { a, b } = kiesThales(), AB = rnd(4, 15), cd = a * AB / b; return { soort: 'CD', opdracht: 'CD // AB.', html: driehoeksvorm({ ZC: kg(a), ZA: kg(b), AB: kg(AB), CD: '?' }, a / b) + vraag('Bereken |CD| (afgerond op 0,01).'), sleutel: `cd${a}${b}${AB}`,
      antw: getal(cd, { voor: '|CD| =' }), uitleg: [`\\dfrac{|ZC|}{|ZA|} = \\dfrac{|CD|}{|AB|} \\iff \\dfrac{${a}}{${b}} = \\dfrac{|CD|}{${AB}}`, `|CD| = \\dfrac{${a} \\cdot ${AB}}{${b}} \\approx ${tg(cd)}`] }; } },
    CA: { naam: 'Let op: een stuk niet vanaf Z', gen() { const { a, b, c, d } = kiesThales(); return { soort: 'CA', opdracht: 'CD // AB. Let op: |CA| is geen stuk vanaf Z!', tex: `|ZC| = ${a}, \\; |CA| = ${b - a}, \\; |ZB| = ${c}`, html: driehoeksvorm({}, a / b) + vraag('Bereken |ZD|.'), sleutel: `ca${a}${b}${c}`,
      antw: getal(d, { voor: '|ZD| =' }), uitleg: [`|ZA| = |ZC| + |CA| = ${a} + ${b - a} = ${b}`, `|ZD| = \\dfrac{${a} \\cdot ${c}}{${b}} = ${tg(d)}`] }; } },
  },
  oefenMix: [['ZD', 2], ['ZB', 2], ['CD', 2], ['CA', 2]],
  test: [['ZD', 3], ['ZB', 2], ['CD', 3], ['CA', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'De vlindervorm', kort: 'Z ligt tussen de gegeven punten (zandloper).', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Vlindervorm</div><p>Soms snijden de twee rechten elkaar <b>tussen</b> de gegeven punten: de figuur lijkt op een vlinder of zandloper. Ook dan geldt de stelling van Thales, met $Z$ als snijpunt:</p>
    <p class="midden">$AB \\parallel A'B' \\Rightarrow \\dfrac{|ZA|}{|ZA'|} = \\dfrac{|ZB|}{|ZB'|} = \\dfrac{|AB|}{|A'B'|}$</p></div>
    ${vlindervorm({ ZA: '|ZA|', ZB: '|ZB|', ZAp: "|ZA'|", ZBp: "|ZB'|" })}
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p>$|ZA| = 4$, $|ZB| = 5$, $|ZA'| = 6$, $AB \\parallel A'B'$. Dan $\\dfrac{4}{6} = \\dfrac{5}{|ZB'|}$, dus $|ZB'| = \\dfrac{5 \\cdot 6}{4} = 7{,}5$.</p></div>${AFSPRAAK}`,
  voorbeelden: [{ tex: "|ZA| = 3, \\; |ZA'| = 6, \\; |AB| = 2{,}5", stappen: ["\\dfrac{|ZA|}{|ZA'|} = \\dfrac{|AB|}{|A'B'|} \\iff \\dfrac{3}{6} = \\dfrac{2{,}5}{|A'B'|}", "|A'B'| = \\dfrac{2{,}5 \\cdot 6}{3} = 5"] }],
  soorten: {
    ZBp: { naam: "Een stuk aan de andere kant", gen() { const { a, b, c, d } = kiesThales(); return { soort: 'ZBp', opdracht: "AB // A'B'.", html: vlindervorm({ ZA: kg(a), ZAp: kg(b), ZB: kg(d), ZBp: '?' }) + vraag("Bereken |ZB'|."), sleutel: `vb${a}${b}${c}`,
      antw: getal(c, { voor: "|ZB'| =" }), uitleg: [`\\dfrac{|ZA|}{|ZA'|} = \\dfrac{|ZB|}{|ZB'|} \\iff \\dfrac{${a}}{${b}} = \\dfrac{${tg(d)}}{|ZB'|}`, `|ZB'| = \\dfrac{${b} \\cdot ${tg(d)}}{${a}} = ${tg(c)}`] }; } },
    ZB: { naam: 'Een stuk aan deze kant', gen() { const { a, b, c, d } = kiesThales(); return { soort: 'ZB', opdracht: "AB // A'B'.", html: vlindervorm({ ZA: kg(a), ZAp: kg(b), ZBp: kg(c), ZB: '?' }) + vraag('Bereken |ZB|.'), sleutel: `vz${a}${b}${c}`,
      antw: getal(d, { voor: '|ZB| =' }), uitleg: [`\\dfrac{${a}}{${b}} = \\dfrac{|ZB|}{${c}}`, `|ZB| = \\dfrac{${a} \\cdot ${c}}{${b}} = ${tg(d)}`] }; } },
    evenw: { naam: 'Het evenwijdige stuk', gen() { const { a, b } = kiesThales(), AB = rnd(3, 12), x = b * AB / a; return { soort: 'evenw', opdracht: "AB // A'B'.", html: vlindervorm({ ZA: kg(a), ZAp: kg(b), AB: kg(AB), ApBp: '?' }) + vraag("Bereken |A'B'| (afgerond op 0,01)."), sleutel: `ve${a}${b}${AB}`,
      antw: getal(x, { voor: "|A'B'| =" }), uitleg: [`\\dfrac{${a}}{${b}} = \\dfrac{${AB}}{|A'B'|}`, `|A'B'| = \\dfrac{${AB} \\cdot ${b}}{${a}} \\approx ${tg(x)}`] }; } },
    vorm: { naam: 'Driehoeksvorm of vlindervorm?', gen() { const v = kies([true, false]); return { soort: 'vorm', html: (v ? vlindervorm({}) : driehoeksvorm({})) + vraag('Welke vorm van de stelling van Thales zie je?'), sleutel: `vo${v}`,
      antw: tekstKeuze(['driehoeksvorm', 'vlindervorm'], v ? 'vlindervorm' : 'driehoeksvorm'), uitleg: [tx(v ? 'Z ligt tussen de gegeven punten: vlindervorm.' : 'Z ligt buiten de evenwijdige stukken, als een top: driehoeksvorm.')] }; } },
  },
  oefenMix: [['ZBp', 2], ['ZB', 2], ['evenw', 2], ['vorm', 1]],
  test: [['ZBp', 3], ['ZB', 3], ['evenw', 2], ['vorm', 2]], testSchudden: true,
};

const D4 = {
  nr: 4, titel: 'De omgekeerde stelling van Thales', kort: 'Gelijke verhoudingen ⟹ evenwijdig.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Omgekeerde stelling van Thales</div><p>Als $C$ op $ZA$ ligt, $D$ op $ZB$ ligt en $\\dfrac{|ZC|}{|ZA|} = \\dfrac{|ZD|}{|ZB|}$, dan is $CD \\parallel AB$.</p>
    <p>Zo bewijs je evenwijdigheid <b>zonder hoeken te meten</b>. "Het ziet er evenwijdig uit" is geen bewijs: je moet de verhoudingen berekenen en vergelijken.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div><p>$|ZC| = 2$, $|ZA| = 5$, $|ZD| = 3$, $|ZB| = 7{,}5$:</p><p class="midden">$\\dfrac{2}{5} = 0{,}4 \\qquad \\dfrac{3}{7{,}5} = 0{,}4$</p><p>De verhoudingen zijn gelijk, dus $CD \\parallel AB$.</p></div>`,
  voorbeelden: [{ tex: '|ZC| = 3, \\; |ZA| = 9, \\; |ZD| = 4, \\; |ZB| = 10', stappen: ['\\dfrac{3}{9} \\approx 0{,}33 \\qquad \\dfrac{4}{10} = 0{,}4', '\\text{niet gelijk: } CD \\text{ is niet evenwijdig met } AB'] }],
  soorten: {
    evenwijdig: { naam: 'Evenwijdig of niet?', gen() { const { a, b, c, d } = kiesThales(), ok = kies([true, false]), dd = ok ? d : W.rond(d + kies([0.5, 1, -0.5]), 1);
      return { soort: 'evenwijdig', html: driehoeksvorm({ ZC: kg(a), ZA: kg(b), ZD: kg(dd), ZB: kg(c) }, a / b) + vraag('Is CD evenwijdig met AB?'), sleutel: `ev${a}${b}${c}${dd}`,
        antw: tekstKeuze(['ja', 'nee'], ok ? 'ja' : 'nee'), uitleg: [`\\dfrac{${a}}{${b}} \\approx ${tg(a / b)} \\qquad \\dfrac{${tg(dd)}}{${c}} \\approx ${tg(dd / c)}`, ok ? '\\text{gelijk: } CD \\parallel AB' : '\\text{niet gelijk: niet evenwijdig}'] }; } },
    maak: { naam: 'Zorg voor evenwijdigheid', gen() { const { a, b, c, d } = kiesThales(); return { soort: 'maak', html: vraag(`Op ZA (|ZA| = ${kg(b)}) ligt C met |ZC| = ${kg(a)}. Op ZB ligt D, met |ZB| = ${kg(c)}. Hoe groot moet |ZD| zijn opdat CD // AB?`), sleutel: `mk${a}${b}${c}`,
      antw: getal(d, { voor: '|ZD| =' }), uitleg: [`\\dfrac{${a}}{${b}} = \\dfrac{|ZD|}{${c}} \\Rightarrow |ZD| = ${tg(d)}`] }; } },
    bewijs: { naam: 'Wat is een geldig bewijs?', gen() { const L = [['Ik meet dat de twee verhoudingen gelijk zijn.', true], ['Op de tekening ziet het er evenwijdig uit.', false], ['De twee lijnstukken zijn even lang.', false], ['ZC/ZA = ZD/ZB, met C op ZA en D op ZB.', true]]; const [t, w] = kies(L);
      return { soort: 'bewijs', html: vraag(`Is dit een geldige reden om te besluiten dat CD // AB? "${t}"`), sleutel: `bw${t}`, antw: tekstKeuze(['ja', 'nee'], w ? 'ja' : 'nee'), uitleg: [tx('Enkel gelijke verhoudingen (omgekeerde stelling van Thales) bewijzen evenwijdigheid.')] }; } },
  },
  oefenMix: [['evenwijdig', 3], ['maak', 2], ['bewijs', 2]],
  test: [['evenwijdig', 5], ['maak', 3], ['bewijs', 2]], testSchudden: true,
};

const D5 = {
  nr: 5, titel: 'De middenparallel', kort: 'MN // AB en |MN| = ½ · |AB|.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Middenparallel</div><p>Zijn $M$ en $N$ de middens van de zijden $AC$ en $BC$ van driehoek $ABC$, dan is</p><p class="midden">$MN \\parallel AB \\qquad \\text{en} \\qquad |MN| = \\tfrac{1}{2} \\cdot |AB|$</p>
    <p>Dit volgt uit Thales: $\\dfrac{|CM|}{|CA|} = \\dfrac{|CN|}{|CB|} = \\dfrac{1}{2}$, dus $MN \\parallel AB$ en $\\dfrac{|MN|}{|AB|} = \\dfrac{1}{2}$.</p></div>
    ${driehoeksvorm({ CD: '|MN|', AB: '|AB|' }, 0.5, { A: 'A', B: 'B', C: 'M', D: 'N' }).replace('>Z<', '>C<')}`,
  voorbeelden: [{ tex: '|AB| = 9 \\text{ cm}', stappen: ['|MN| = \\tfrac{1}{2} \\cdot 9 = 4{,}5 \\text{ cm}'] }],
  soorten: {
    MN: { naam: 'De middenparallel berekenen', gen() { const ab = rnd(5, 24); return { soort: 'MN', opdracht: 'M en N zijn de middens van AC en BC.', html: vraag(`|AB| = ${ab} cm. Bereken |MN|.`), sleutel: `mn${ab}`, antw: getal(ab / 2, { voor: '|MN| =', na: '\\text{ cm}' }), uitleg: [`|MN| = \\tfrac{1}{2} \\cdot ${ab} = ${tg(ab / 2)} \\text{ cm}`] }; } },
    AB: { naam: 'De derde zijde', gen() { const mn = rnd(3, 15) / (Math.random() < 0.3 ? 2 : 1); return { soort: 'AB', opdracht: 'M en N zijn de middens van AC en BC.', html: vraag(`|MN| = ${kg(mn)} cm. Bereken |AB|.`), sleutel: `ab${mn}`, antw: getal(2 * mn, { voor: '|AB| =', na: '\\text{ cm}' }), uitleg: [`|AB| = 2 \\cdot |MN| = 2 \\cdot ${tg(mn)} = ${tg(2 * mn)} \\text{ cm}`] }; } },
    omtrek: { naam: 'Driehoek van de middens', gen() { const [a, b, c] = [rnd(6, 14), rnd(6, 14), rnd(6, 14)].sort((p, q) => p - q); if (a + b <= c) return D5.soorten.omtrek.gen();
      return { soort: 'omtrek', html: vraag(`Een driehoek heeft zijden van ${a} cm, ${b} cm en ${c} cm. Je verbindt de middens van de drie zijden. Wat is de omtrek van de nieuwe driehoek?`), sleutel: `om${a}${b}${c}`, antw: getal((a + b + c) / 2, { na: '\\text{ cm}' }), uitleg: ['\\text{elke zijde van de nieuwe driehoek is een middenparallel: de helft van een zijde}', `\\tfrac{1}{2} \\cdot (${a} + ${b} + ${c}) = ${tg((a + b + c) / 2)} \\text{ cm}`] }; } },
  },
  oefenMix: [['MN', 2], ['AB', 2], ['omtrek', 2]],
  test: [['MN', 4], ['AB', 3], ['omtrek', 3]], testSchudden: true,
};

const D6 = {
  nr: 6, titel: 'Toepassingen', kort: 'Hoogte via schaduwen · straten en blokken.', rekenmachine: true,
  theorie: `<div class="kader werk"><div class="kader-titel">Hoogte meten met schaduwen</div><p>Op een zonnige dag staan jij (of een paal) en een boom loodrecht op de grond: ze zijn evenwijdig. De zonnestralen spelen de rol van de snijlijnen. Zo geldt:</p>
      <p class="midden">$\\dfrac{\\text{hoogte paal}}{\\text{schaduw paal}} = \\dfrac{\\text{hoogte boom}}{\\text{schaduw boom}}$</p></div>
    <div class="kader werk"><div class="kader-titel">Straten en blokken</div><p>Evenwijdige straten die door twee niet-evenwijdige straten gesneden worden (die elkaar snijden in $Z$), geven Thales-verhoudingen tussen de blokken, gemeten vanaf $Z$.</p></div>${AFSPRAAK}`,
  voorbeelden: [{ tex: '\\text{paal } 1{,}5 \\text{ m, schaduw } 2 \\text{ m; schaduw boom } 14 \\text{ m}', stappen: ['\\dfrac{1{,}5}{2} = \\dfrac{h}{14}', 'h = \\dfrac{1{,}5 \\cdot 14}{2} = 10{,}5 \\text{ m}'] }],
  soorten: {
    schaduw: { naam: 'Hoogte via de schaduw', gen() { const p = kies([1, 1.5, 2, 1.8]), s = kies([1.2, 2, 2.5, 3, 4]), sb = kies([9, 12, 15, 16, 20, 24]), hb = p * sb / s;
      return { soort: 'schaduw', html: opgave(`Een paal van ${kg(p)} m werpt een schaduw van ${kg(s)} m. Op hetzelfde moment werpt een gebouw een schaduw van ${sb} m.`) + vraag('Hoe hoog is het gebouw (afgerond op 0,01 m)?'), sleutel: `sc${p}${s}${sb}`,
        antw: getal(hb, { na: '\\text{ m}' }), uitleg: [`\\dfrac{${tg(p)}}{${tg(s)}} = \\dfrac{h}{${sb}}`, `h = \\dfrac{${tg(p)} \\cdot ${sb}}{${tg(s)}} \\approx ${tg(hb)} \\text{ m}`] }; } },
    persoon: { naam: 'Je eigen schaduw', gen() { const l = kies([1.6, 1.7, 1.75, 1.8]), s = kies([2, 2.4, 3]), h = kies([8, 10, 12, 15]), sb = h * s / l;
      return { soort: 'persoon', html: opgave(`Je bent ${kg(l)} m groot en je schaduw is ${kg(s)} m lang. Een boom van ${h} m hoog staat vlakbij.`) + vraag('Hoe lang is de schaduw van de boom (afgerond op 0,01 m)?'), sleutel: `pe${l}${s}${h}`,
        antw: getal(sb, { na: '\\text{ m}' }), uitleg: [`\\dfrac{${tg(l)}}{${tg(s)}} = \\dfrac{${h}}{x}`, `x = \\dfrac{${h} \\cdot ${tg(s)}}{${tg(l)}} \\approx ${tg(sb)} \\text{ m}`] }; } },
    straat: { naam: 'Straten en blokken', gen() { const a = kies([80, 100, 150, 200]), b = a * kies([2, 2.5, 3]), c = kies([60, 90, 120]), d = c * b / a;
      return { soort: 'straat', html: opgave(`Twee evenwijdige straten worden gesneden door twee straten die elkaar snijden in Z. Langs de ene straat liggen de kruispunten op ${a} m en ${b} m van Z. Langs de andere straat ligt het eerste kruispunt op ${c} m van Z.`) + vraag('Op hoeveel meter van Z ligt het tweede kruispunt langs die andere straat?'), sleutel: `st${a}${b}${c}`,
        antw: getal(d, { na: '\\text{ m}' }), uitleg: [`\\dfrac{${a}}{${b}} = \\dfrac{${c}}{x}`, `x = \\dfrac{${b} \\cdot ${c}}{${a}} = ${tg(d)} \\text{ m}`] }; } },
  },
  oefenMix: [['schaduw', 3], ['persoon', 2], ['straat', 2]],
  test: [['schaduw', 4], ['persoon', 3], ['straat', 3]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
const D7 = {
  nr: 7, titel: 'Eindtest stelling van Thales', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>${STELLING}${AANPAK}`,
  voorbeelden: [],
  soorten: { e1: mix(D1, 'factor', 'Homothetiefactor'), e2: mix(D2, 'ZD', 'Driehoeksvorm'), e3: mix(D2, 'CD', 'Evenwijdig stuk'), e4: mix(D2, 'CA', 'Stuk niet vanaf Z'), e5: mix(D3, 'ZBp', 'Vlindervorm'),
    e6: mix(D3, 'evenw', 'Vlindervorm, evenwijdig stuk'), e7: mix(D4, 'evenwijdig', 'Omgekeerde stelling'), e8: mix(D5, 'MN', 'Middenparallel'), e9: mix(D6, 'schaduw', 'Schaduw'), e10: mix(D6, 'straat', 'Straten') },
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
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && `\\text{${u.slice(2)}}` === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
}

Leerpaden.registreer({
  code: 'thales',
  titel: 'De stelling van Thales',
  ondertitel: 'Toegepaste wiskunde · 4BW',
  klas: '4BW',
  drempel: 70,
  intro: `<p>Je leert de <b>stelling van Thales</b> (driehoeksvorm en vlindervorm), het verband met de homothetie, de <b>omgekeerde stelling</b> en de <b>middenparallel</b>, en je lost vraagstukken op.
    Alles volgt de cursus, de PowerPoint en de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [
    { titel: 'A · De stelling', delen: [1, 2, 3] },
    { titel: 'B · Omgekeerde stelling en middenparallel', delen: [4, 5] },
    { titel: 'C · Toepassingen', delen: [6] },
    { titel: 'D · Eindtest', delen: [7] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7],
});
})();
