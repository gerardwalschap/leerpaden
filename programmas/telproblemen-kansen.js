// Programma 'telproblemen-kansen' — automatisch samengevoegd uit bron/telproblemen-kansen/ (niet rechtstreeks bewerken)
(() => {
// ===================================================================
//  TELPROBLEMEN EN KANSREKENEN (7VJHO) — gedeelde hulpfuncties
//  Leidraad: PWP 3.1.1 Telproblemen en PWP 3.1.2 Kansen bepalen (G. Walschap)
//  met de werkbladen 3.1.1 en 3.1.2. De oefeningen in het leerpad zijn andere
//  situaties dan in de werkbladen (het werkblad blijft de klasoefening).
//  Afspraak: een kans schrijf je als vereenvoudigde breuk; enkel waar het
//  gevraagd wordt als percentage; relatieve frequenties op 3 decimalen.
// ===================================================================
const { rnd, kies, schud } = W;
const tg = (x, d = null) => W.texGetal(x, d);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const fac = (n) => n <= 1 ? 1 : n * fac(n - 1);
const comb = (n, k) => k < 0 || k > n ? 0 : fac(n) / (fac(k) * fac(n - k));
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const aantal = (waarde, voor = '') => getal(waarde, { voor });
const keuze = (opties, juist, extra = {}) => ({ soort: 'keuze', opties, juist: String(juist), ...extra });
const kT = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const kTex = (texen) => texen.map((t, i) => ({ k: String(i), l: t }));
const kZin = (zinnen) => zinnen.map((t, i) => ({ k: String(i), l: t, html: true }));
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tekst = (x) => String(x).replace('.', ',');
const duiz = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');          // 10 000 (gewone tekst)
const tgd = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');          // 10\,000 (TeX)
// meerkeuze met unieke opties, juiste antwoord willekeurig geplaatst
function uniekKeuze(juist, fout, maak = kTex, n = 4) {
  const u = [juist]; for (const f of fout) if (!u.includes(f) && u.length < n) u.push(f);
  const s = schud(u); return keuze(maak(s), s.indexOf(juist));
}
const zinKeuze = (juist, fout) => { const k = uniekKeuze(juist, fout, kZin); k.lijst = true; return k; };

// ---- kansen als breuk -------------------------------------------------------------
// een kans: echte breuk in de formule-editor, moet vereenvoudigd zijn
const kans = (t, n, voor = 'P =') => { const g = ggd(t, n); return { soort: 'breuk', t: t / g, n: n / g, voor, editor: true, placeholder: '' }; };
const fr = (t, n) => { const g = ggd(t, n); t /= g; n /= g; return n === 1 ? tg(t) : `\\frac{${t}}{${n}}`; };   // vereenvoudigd
const frR = (t, n) => `\\frac{${t}}{${n}}`;                                                                       // zoals hij staat
const frS = (t, n) => ggd(t, n) > 1 && t !== 0 ? `${frR(t, n)} = ${fr(t, n)}` : fr(t, n);                     // met vereenvoudiging
const pct = (waarde, voor = 'P =') => getal(waarde, { voor, na: '\\%' });
const PT = (s) => `P(\\text{${s}})`;

// ---- tabel (HTML) ---------------------------------------------------------------------
function htmlTabel(rijen, kop = true) {
  return `<div class="tabelwrap" style="display:flex;justify-content:center"><table class="tabel">${rijen.map((r, i) => `<tr>${r.map((c, j) => (i === 0 && kop) || j === 0 ? `<th class="midden">${c}</th>` : `<td class="midden">${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
}
const ROOD = '#c0392b', BLAUW = '#1c4e8a', ORANJE = '#e8772e', GROEN = '#2e7d4f', PAARS = '#8e44ad', GRIJS = '#555';
const svgOpen = (w, h, label) => `<div class="figuur"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="font-family:Verdana,sans-serif;max-width:100%;height:auto">`;
const svgDicht = '</svg></div>';
const xmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---- boomdiagram (SVG) --------------------------------------------------------------------
// knoop: { l: 'R', p: '3/5' (kans bij de tak, optioneel), kids: [...] }; wortel: { kids: [...] }
// opt.uitkomst: eindpunten benoemen (RR, RB, …) · opt.eindkans: product van de kansen erachter · opt.dx, opt.dy
function boom(wortel, opt = {}) {
  const metKans = JSON.stringify(wortel).includes('"p":"'), dx = opt.dx || (metKans ? 104 : 78), dy = opt.dy || (metKans ? 40 : 26), m = metKans ? 20 : 14;
  let blad = 0, diepte = 0;
  (function plaats(k, d) {
    k.d = d; diepte = Math.max(diepte, d);
    if (!k.kids || !k.kids.length) { k.y = m + 8 + blad * dy; blad++; return; }
    k.kids.forEach(c => plaats(c, d + 1));
    k.y = (k.kids[0].y + k.kids[k.kids.length - 1].y) / 2;
  })(wortel, 0);
  const X = (d) => 16 + d * dx;
  const extra = (opt.uitkomst ? 54 : 0) + (opt.eindkans ? 60 : 0);
  const B = X(diepte) + 22 + extra, H = blad * dy + 2 * m;
  let lijnen = '', labels = '', eind = '';
  const breukSVG = (s, x, y, kl) => {
    const [t, n] = String(s).split('/');
    if (n === undefined) return `<text x="${x}" y="${y + 4}" font-size="11" text-anchor="middle" fill="${kl}">${xmlEsc(t)}</text>`;
    const w = Math.max(t.length, n.length) * 6.5 + 2;
    return `<rect x="${x - w / 2 - 1}" y="${y - 12}" width="${w + 2}" height="25" fill="#fff" opacity="0.85"/><text x="${x}" y="${y - 2}" font-size="10.5" text-anchor="middle" fill="${kl}">${xmlEsc(t)}</text>`
      + `<line x1="${x - w / 2}" y1="${y + 1}" x2="${x + w / 2}" y2="${y + 1}" stroke="${kl}" stroke-width="1"/><text x="${x}" y="${y + 11}" font-size="10.5" text-anchor="middle" fill="${kl}">${xmlEsc(n)}</text>`;
  };
  (function teken(k, pad, kansen) {
    const x = X(k.d);
    if (k.d === 0) labels += `<circle cx="${x}" cy="${k.y}" r="3.5" fill="#1f2733"/>`;
    for (const c of k.kids || []) {
      const cx = X(c.d);
      lijnen += `<line x1="${x + (k.d ? 9 : 3)}" y1="${k.y}" x2="${cx - 10}" y2="${c.y}" stroke="#7a8597" stroke-width="1.4"/>`;
      if (c.p != null) labels += breukSVG(c.p, (x + cx) / 2 - 4, (k.y + c.y) / 2 + (c.y < k.y ? -10 : c.y > k.y ? 12 : -12), ORANJE);
      const kl = c.kleur || (c.l === 'R' ? ROOD : c.l === 'B' ? BLAUW : c.l === 'G' ? GROEN : '#1f2733');
      labels += `<text x="${cx}" y="${c.y + 5}" font-size="14" font-weight="bold" text-anchor="middle" fill="${kl}">${xmlEsc(c.l)}</text>`;
      teken(c, pad + c.l, c.p != null ? kansen.concat([c.p]) : kansen);
    }
    if ((!k.kids || !k.kids.length) && k.d > 0) {
      let ex = X(k.d) + 20;
      if (opt.uitkomst) { eind += `<text x="${ex}" y="${k.y + 5}" font-size="12.5" fill="#1f2733">${xmlEsc(opt.uitkomstTekst ? opt.uitkomstTekst(pad) : pad)}</text>`; ex += 54; }
      if (opt.eindkans && kansen.length) {
        const t = kansen.map(s => +s.split('/')[0]).reduce((a, b) => a * b, 1), n = kansen.map(s => +(s.split('/')[1] || 1)).reduce((a, b) => a * b, 1);
        eind += breukSVG(`${t}/${n}`, ex + 14, k.y + 1, PAARS);
      }
    }
  })(wortel, '', []);
  return `${svgOpen(B, H, 'boomdiagram')}${lijnen}${labels}${eind}${svgDicht}`;
}
// boom met dezelfde keuzes op elk niveau: niveaus = [['K','M'], ['K','M'], …]
function boomVan(niveaus, kansen = null) {
  const bouw = (d) => d >= niveaus.length ? [] : niveaus[d].map((l, i) => ({ l, p: kansen ? kansen[d][i] : null, kids: bouw(d + 1) }));
  return { kids: bouw(0) };
}
// zonder terugleggen: alle kleurvolgordes als je k knikkers neemt uit een zakje {R: 2, B: 1, …}
function boomZakje(zak, k, metKans = false) {
  const tot = (z) => Object.values(z).reduce((a, b) => a + b, 0);
  const bouw = (z, d) => d >= k ? [] : Object.keys(z).filter(c => z[c] > 0).map(c => {
    const z2 = { ...z, [c]: z[c] - 1 };
    return { l: c, p: metKans ? `${z[c]}/${tot(z)}` : null, kids: bouw(z2, d + 1) };
  });
  return { kids: bouw(zak, 0) };
}
const bladeren = (k) => !k.kids || !k.kids.length ? 1 : k.kids.reduce((s, c) => s + bladeren(c), 0);
function paden(k, pad = '') { if (!k.kids || !k.kids.length) return [pad]; return k.kids.flatMap(c => paden(c, pad + c.l)); }

// ---- venndiagrammen (SVG) -----------------------------------------------------------------
// r = {a, ab, b, u} (enkel A, A én B, enkel B, buiten) — een waarde null of '?' toont een vraagteken, '' toont niets
function venn2(r, namen = ['A', 'B'], opt = {}) {
  const w = 300, h = 190, c1 = 118, c2 = 182, cy = 98, R = 62;
  const t = (x, y, v, kl = '#1f2733') => v === '' || v === undefined ? '' : `<text x="${x}" y="${y}" font-size="16" font-weight="bold" text-anchor="middle" fill="${v === null || v === '?' ? ORANJE : kl}">${v === null ? '?' : v}</text>`;
  return `${svgOpen(w, h, 'venndiagram')}<rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="6" fill="#fbfcfe" stroke="#1f2733" stroke-width="1.4"/>
    <text x="16" y="26" font-size="13" font-style="italic">${opt.U || 'U'}</text>
    <circle cx="${c1}" cy="${cy}" r="${R}" fill="${BLAUW}" fill-opacity="0.10" stroke="${BLAUW}" stroke-width="2"/>
    <circle cx="${c2}" cy="${cy}" r="${R}" fill="${ORANJE}" fill-opacity="0.10" stroke="${ORANJE}" stroke-width="2"/>
    <text x="${c1 - 52}" y="${cy - 52}" font-size="15" font-weight="bold" fill="${BLAUW}">${namen[0]}</text>
    <text x="${c2 + 44}" y="${cy - 52}" font-size="15" font-weight="bold" fill="${ORANJE}">${namen[1]}</text>
    ${t(c1 - 28, cy + 6, r.a)}${t(150, cy + 6, r.ab)}${t(c2 + 28, cy + 6, r.b)}${t(w - 34, h - 20, r.u)}${svgDicht}`;
}
// r = {a, b, c, ab, bc, ac, abc, u}: a = enkel A, ab = A en B maar niet C, …
function venn3(r, namen = ['A', 'B', 'C']) {
  const w = 320, h = 270, R = 66, A = [124, 104], B = [196, 104], C = [160, 166];
  const t = (p, v) => v === '' || v === undefined ? '' : `<text x="${p[0]}" y="${p[1]}" font-size="15" font-weight="bold" text-anchor="middle" fill="${v === null || v === '?' ? ORANJE : '#1f2733'}">${v === null ? '?' : v}</text>`;
  const cirkel = (p, kl) => `<circle cx="${p[0]}" cy="${p[1]}" r="${R}" fill="${kl}" fill-opacity="0.09" stroke="${kl}" stroke-width="2"/>`;
  return `${svgOpen(w, h, 'venndiagram met drie verzamelingen')}<rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="6" fill="#fbfcfe" stroke="#1f2733" stroke-width="1.4"/>
    <text x="16" y="26" font-size="13" font-style="italic">U</text>${cirkel(A, BLAUW)}${cirkel(B, ORANJE)}${cirkel(C, GROEN)}
    <text x="${A[0] - 62}" y="${A[1] - 50}" font-size="15" font-weight="bold" fill="${BLAUW}">${namen[0]}</text>
    <text x="${B[0] + 50}" y="${B[1] - 50}" font-size="15" font-weight="bold" fill="${ORANJE}">${namen[1]}</text>
    <text x="${C[0] + 62}" y="${C[1] + 62}" font-size="15" font-weight="bold" fill="${GROEN}">${namen[2]}</text>
    ${t([A[0] - 30, A[1] - 8], r.a)}${t([B[0] + 30, B[1] - 8], r.b)}${t([C[0], C[1] + 38], r.c)}
    ${t([160, 82], r.ab)}${t([196 + 4, 152], r.bc)}${t([124 - 4, 152], r.ac)}${t([160, 128], r.abc)}${t([w - 30, h - 18], r.u)}${svgDicht}`;
}

// ---- wegenkaart (SVG): punten en een aantal wegen ertussen -------------------------------------
// punten: {A: [x, y], …} · wegen: [['A', 'B', 3], …]
function wegen(punten, lijst, opt = {}) {
  const w = opt.w || 360, h = opt.h || 170;
  let g = '';
  for (const [p, q, n] of lijst) {
    const [x1, y1] = punten[p], [x2, y2] = punten[q], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 22;
      g += `<path d="M${x1},${y1} Q${mx + nx * off * 1.6},${my + ny * off * 1.6} ${x2},${y2}" fill="none" stroke="${opt.kleur || '#7a8597'}" stroke-width="2"/>`;
    }
  }
  for (const [nm, [x, y]] of Object.entries(punten))
    g += `<circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="${BLAUW}" stroke-width="2.2"/><text x="${x}" y="${y + 5}" font-size="14" font-weight="bold" text-anchor="middle" fill="${BLAUW}">${xmlEsc(opt.namen && opt.namen[nm] ? opt.namen[nm] : nm)}</text>`;
  return `${svgOpen(w, h, 'wegenkaart')}${g}${svgDicht}`;
}

// ---- rad met gelijke (of ongelijke) vakken (SVG) ---------------------------------------------------
// vakken: [{l: '1', kl: '#…', g: 1 (grootte)}]
const RADKLEUR = ['#f5b7b1', '#aed6f1', '#abebc6', '#f9e79f', '#d7bde2', '#fad7a0', '#a3e4d7', '#d5dbdb'];
function rad(vakken) {
  const w = 220, c = 110, R = 92, tot = vakken.reduce((s, v) => s + (v.g || 1), 0);
  let a = -Math.PI / 2, g = '';
  vakken.forEach((v, i) => {
    const da = 2 * Math.PI * (v.g || 1) / tot, b = a + da;
    const p = (t, r = R) => [c + r * Math.cos(t), c + r * Math.sin(t)];
    const [x1, y1] = p(a), [x2, y2] = p(b), [tx, ty] = p(a + da / 2, R * 0.66);
    g += `<path d="M${c},${c} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${da > Math.PI ? 1 : 0} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${v.kl || RADKLEUR[i % RADKLEUR.length]}" stroke="#1f2733" stroke-width="1.3"/>`;
    g += `<text x="${tx.toFixed(1)}" y="${(ty + 6).toFixed(1)}" font-size="${v.l.length > 2 ? 12 : 17}" font-weight="bold" text-anchor="middle" fill="#1f2733">${xmlEsc(v.l)}</text>`;
    a = b;
  });
  g += `<path d="M${c - 8},4 L${c + 8},4 L${c},22 Z" fill="#1f2733"/><circle cx="${c}" cy="${c}" r="5" fill="#1f2733"/>`;
  return `${svgOpen(w, w, 'rad')}${g}${svgDicht}`;
}

// ---- kansschaal (SVG) ------------------------------------------------------------------------
function kansschaal(merk = []) { // merk: [{v: 0..1, l: 'A'}]
  const w = 420, x0 = 30, x1 = 390, y = 40, X = (v) => x0 + (x1 - x0) * v;
  let g = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#1f2733" stroke-width="2"/>`;
  [[0, '0', 'onmogelijk'], [0.5, '1/2', 'even veel kans'], [1, '1', 'zeker']].forEach(([v, s, t]) => {
    g += `<line x1="${X(v)}" y1="${y - 7}" x2="${X(v)}" y2="${y + 7}" stroke="#1f2733" stroke-width="2"/><text x="${X(v)}" y="${y + 24}" font-size="12" text-anchor="middle">${s}</text><text x="${X(v)}" y="${y + 40}" font-size="11" text-anchor="middle" fill="${GRIJS}">${t}</text>`;
  });
  g += `<text x="${X(0.25)}" y="${y + 40}" font-size="11" text-anchor="middle" fill="${GRIJS}">weinig kans</text><text x="${X(0.75)}" y="${y + 40}" font-size="11" text-anchor="middle" fill="${GRIJS}">veel kans</text>`;
  for (const m of merk) g += `<circle cx="${X(m.v)}" cy="${y}" r="5" fill="${ORANJE}"/><text x="${X(m.v)}" y="${y - 12}" font-size="13" font-weight="bold" text-anchor="middle" fill="${ORANJE}">${m.l}</text>`;
  return `${svgOpen(w, 92, 'kansschaal')}${g}${svgDicht}`;
}

// ---- som van twee dobbelstenen (HTML-tabel) -------------------------------------------------------
function somTabel(markeer = () => false) {
  const rijen = [['+', 1, 2, 3, 4, 5, 6]];
  for (let a = 1; a <= 6; a++) rijen.push([a, ...[1, 2, 3, 4, 5, 6].map(b => markeer(a, b) ? `<b style="color:${ORANJE}">${a + b}</b>` : a + b)]);
  return htmlTabel(rijen);
}
const somAantal = (s) => [1, 2, 3, 4, 5, 6].reduce((n, a) => n + ([1, 2, 3, 4, 5, 6].includes(s - a) ? 1 : 0), 0);

// mix-soort voor de eindtest of gemengde delen
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
// ===================================================================
//  A · TELPROBLEMEN (delen 1–6)
// ===================================================================

// ---- 1. Boomdiagrammen ------------------------------------------------------------------
const KEUZESITUATIES = [
  { t: 'Bij de broodjeszaak kies je', st: [['wit', 'bruin'], ['kaas', 'hesp', 'kip'], ['met groentjes', 'zonder groentjes']], afk: [['W', 'B'], ['K', 'H', 'C'], ['+', '−']] },
  { t: 'Voor een verjaardagstaart kies je', st: [['rond', 'vierkant'], ['chocolade', 'vanille', 'mokka'], ['met kaarsjes', 'zonder kaarsjes']], afk: [['R', 'V'], ['C', 'V', 'M'], ['+', '−']] },
  { t: 'Bij de frituur kies je', st: [['klein', 'middel', 'groot'], ['mayonaise', 'ketchup']], afk: [['K', 'M', 'G'], ['M', 'K']] },
  { t: 'In de koffiebar kies je', st: [['espresso', 'cappuccino', 'latte', 'thee'], ['klein', 'groot']], afk: [['E', 'C', 'L', 'T'], ['K', 'G']] },
  { t: 'Voor een uitstap kies je', st: [['zee', 'Ardennen'], ['trein', 'bus', 'auto'], ['zaterdag', 'zondag']], afk: [['Z', 'A'], ['T', 'B', 'A'], ['Za', 'Zo']] },
  { t: 'Voor een nieuwe gsm kies je', st: [['zwart', 'wit', 'blauw'], ['128 GB', '256 GB']], afk: [['Z', 'W', 'B'], ['128', '256']] },
  { t: 'Bij de pizzeria kies je', st: [['dunne bodem', 'dikke bodem'], ['margherita', 'funghi', 'hawaï', 'vegetaria']], afk: [['D', 'K'], ['Ma', 'F', 'H', 'V']] },
  { t: 'In de sporthal kies je', st: [['zaal 1', 'zaal 2'], ['badminton', 'volleybal', 'basket'], ['1 uur', '2 uur']], afk: [['1', '2'], ['Ba', 'V', 'Bk'], ['1u', '2u']] },
];
const ZAKJES = [
  { zak: { R: 2, B: 1 }, k: 3, n: 'rode', o: 'blauwe' }, { zak: { R: 3, B: 1 }, k: 2 }, { zak: { R: 1, B: 1, G: 1 }, k: 2 },
  { zak: { R: 2, B: 2 }, k: 2 }, { zak: { R: 2, B: 1, G: 1 }, k: 2 }, { zak: { R: 1, B: 2 }, k: 2 }, { zak: { R: 2, B: 2 }, k: 3 },
  { zak: { R: 3, B: 1 }, k: 3 }, { zak: { R: 1, B: 1, G: 1 }, k: 3 }, { zak: { R: 1, B: 3 }, k: 3 },
];
const KLEURNAAM = { R: 'rode', B: 'blauwe', G: 'groene' };
const zakTekst = (zak) => Object.entries(zak).map(([c, n]) => `${n} ${KLEURNAAM[c]} (${c})`).join(', ').replace(/, ([^,]*)$/, ' en $1');
const MATCHES = [
  ['Sofie', 'Lien', 'een pingpongmatch', 'sets'], ['Arno', 'Bram', 'een tennismatch', 'sets'], ['Lore', 'Hanne', 'een tafelvoetbalmatch', 'potjes'],
  ['Yara', 'Mats', 'een partijtje schaak', 'partijen'], ['Ilias', 'Jens', 'een badmintonmatch', 'sets'], ['Noor', 'Emma', 'een potje dammen', 'partijen'],
];
const D1 = {
  nr: 1, titel: 'Boomdiagrammen', kort: 'Elk pad is één mogelijkheid: tel de eindpunten.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een boomdiagram</div>
      <ul><li>Elke <b>tak</b> is een keuze.</li><li>Elk <b>pad</b> van begin tot eind is <b>één mogelijkheid</b>.</li><li>Aantal mogelijkheden = <b>aantal eindpunten</b>.</li>
      <li>Handig als het aantal keuzes <b>afhangt van de vorige keuze</b>.</li></ul>
      <p class="klein">Voorgerecht soep (S) of salade (L), daarna pasta (P), vol-au-vent (V) of vis (F): 6 paden, dus 6 menu's.</p>
      ${boom(boomVan([['S', 'L'], ['P', 'V', 'F']]), { uitkomst: true, dy: 22 })}</div>
    <div class="kader eig"><div class="kader-titel">Niet elke tak splitst even veel</div>
      <p>In een zakje zitten 2 rode (R) en 1 blauwe (B) knikker. Je neemt er 2 uit zonder terug te leggen.
      Na B kan er enkel nog R volgen: er zijn maar <b>3</b> kleurencombinaties (RR, RB, BR).</p>
      ${boom(boomZakje({ R: 2, B: 1 }, 2), { uitkomst: true })}</div>`,
  voorbeelden: [
    { html: `${opgave('Je gooit 3 keer met een muntstuk: kop (K) of munt (M). Bij hoeveel uitkomsten gooi je precies 2 keer kop?')}${boom(boomVan([['K', 'M'], ['K', 'M'], ['K', 'M']]), { uitkomst: true, dy: 22 })}`,
      stappen: ['\\text{8 eindpunten, dus 8 uitkomsten}', '\\text{precies 2 keer kop: KKM, KMK en MKK}', '\\text{3 uitkomsten}'] },
    { html: `${opgave('Mila en Tom spelen een match. Wie eerst 2 sets wint, wint de match. Hoeveel verlopen zijn er?')}${boom(matchBoom('M', 'T'), { uitkomst: true })}`,
      stappen: ['\\text{na MM of TT is de match al gedaan: daar splitst de boom niet meer}', '\\text{eindpunten: MM, MTM, MTT, TMM, TMT, TT}', '\\text{6 verlopen}'] },
  ],
  soorten: {
    keuzes: { naam: 'Keuzes na elkaar', gen() {
      const S = kies(KEUZESITUATIES), st = S.st, tot = st.reduce((p, s) => p * s.length, 1);
      const zin = `${S.t} ${st.map(s => s.length === 2 ? `${s[0]} of ${s[1]}` : `${s.slice(0, -1).join(', ')} of ${s[s.length - 1]}`).join(', daarna ')}.`;
      const toon = tot <= 12, v = kies(st.length === 3 ? ['tot', 'met', 'zonder'] : ['tot', 'met']);
      const fig = toon ? boom(boomVan(S.afk), { dy: 20, dx: 70 }) : '';
      if (v === 'tot') return { soort: 'keuzes', opdracht: 'Hoeveel mogelijkheden zijn er?', html: opgave(zin) + fig, sleutel: zin + v, rapport: zin,
        antw: aantal(tot), uitleg: [`\\text{aantal eindpunten: } ${st.map(s => s.length).join(' \\cdot ')} = ${tot}`] };
      const i = rnd(0, st.length - 1), j = rnd(0, st[i].length - 1), w = st[i][j], r = tot / st[i].length;
      if (v === 'met') return { soort: 'keuzes', opdracht: `Hoeveel mogelijkheden zijn er met ${w}?`, html: opgave(zin) + fig, sleutel: zin + w, rapport: `${zin} (met ${w})`,
        antw: aantal(r), uitleg: [`\\text{${w} ligt vast: tel enkel de paden met ${w}}`, st.length > 2 ? `${st.filter((_, k) => k !== i).map(s => s.length).join(' \\cdot ')} = ${r}` : `\\text{${r} paden}`] };
      const i2 = (i + 1) % st.length, w2 = st[i2][rnd(0, st[i2].length - 1)], r2 = tot / st[i].length / st[i2].length;
      return { soort: 'keuzes', opdracht: `Je kiest zeker ${i < i2 ? w : w2} en ${i < i2 ? w2 : w}. Hoeveel keuzes heb je nog?`, html: opgave(zin) + fig, sleutel: zin + w + w2, rapport: `${zin} (${w}, ${w2})`,
        antw: aantal(r2), uitleg: [`\\text{twee keuzes liggen vast}`, `\\text{er blijven ${r2} paden over}`] };
    } },
    munt: { naam: 'Muntstuk of kinderen', gen() {
      const ctx = kies([
        { t: 'Je gooit {n} keer met een muntstuk: kop (K) of munt (M).', a: 'K', b: 'M', u: 'uitkomsten', pr: (k) => `gooi je precies ${k} keer kop`, mi: 'gooi je minstens één keer munt' },
        { t: 'Een gezin krijgt {n} kinderen: een jongen (J) of een meisje (M). We letten op de volgorde.', a: 'J', b: 'M', u: 'volgordes', pr: (k) => `zijn er precies ${k} ${k === 1 ? 'jongen' : 'jongens'}`, mi: 'is er minstens één meisje' },
        { t: 'Je beantwoordt {n} waar-of-niet-waarvragen met waar (W) of niet waar (N).', a: 'W', b: 'N', u: 'manieren', pr: (k) => `antwoord je precies ${k} keer waar`, mi: 'antwoord je minstens één keer niet waar' },
      ]);
      const n = kies([2, 3, 3]), zin = ctx.t.replace('{n}', n), fig = boom(boomVan(Array(n).fill([ctx.a, ctx.b])), { uitkomst: true, dy: 20 });
      const v = kies(n === 2 ? ['tot', 'precies', 'minstens'] : ['tot', 'precies', 'precies', 'minstens', 'afwisselend']);
      const p = paden(boomVan(Array(n).fill([ctx.a, ctx.b])));
      const tel = (f) => p.filter(f).length, cnt = (s) => s.split('').filter(c => c === ctx.a).length;
      if (v === 'tot') return { soort: 'munt', opdracht: `Hoeveel ${ctx.u} zijn er?`, html: opgave(zin) + fig, sleutel: zin + v, rapport: zin, antw: aantal(2 ** n), uitleg: [`\\text{tel de eindpunten: } ${Array(n).fill(2).join(' \\cdot ')} = ${2 ** n}`] };
      if (v === 'precies') { const k = rnd(1, n - 1), m = p.filter(s => cnt(s) === k);
        return { soort: 'munt', opdracht: `Bij hoeveel ${ctx.u} ${ctx.pr(k)}?`, html: opgave(zin) + fig, sleutel: zin + v + k, rapport: `${zin} ${ctx.pr(k)}`, antw: aantal(m.length), uitleg: [`\\text{${m.join(', ')}}`, `\\text{${m.length} ${ctx.u}}`] }; }
      if (v === 'minstens') { const m = p.filter(s => s.includes(ctx.b));
        return { soort: 'munt', opdracht: `Bij hoeveel ${ctx.u} ${ctx.mi}?`, html: opgave(zin) + fig, sleutel: zin + v, rapport: `${zin} ${ctx.mi}`, antw: aantal(m.length), uitleg: [`\\text{enkel ${ctx.a.repeat(n)} valt weg}`, `${2 ** n} - 1 = ${m.length}`] }; }
      const m = p.filter(s => [...s].every((c, i) => !i || c !== s[i - 1]));
      return { soort: 'munt', opdracht: `Bij hoeveel ${ctx.u} zijn twee opeenvolgende nooit gelijk?`, html: opgave(zin) + fig, sleutel: zin + v, rapport: `${zin} afwisselend`, antw: aantal(tel(s => m.includes(s))), uitleg: [`\\text{${m.join(' en ')}}`, `\\text{${m.length} ${ctx.u}}`] };
    } },
    zakje: { naam: 'Knikkers zonder terugleggen', gen() {
      const Z = kies(ZAKJES), B = boomZakje(Z.zak, Z.k), p = paden(B), tot = Object.values(Z.zak).reduce((a, b) => a + b, 0);
      const alle = Z.k === tot;
      const zin = `In een zakje zitten ${zakTekst(Z.zak)} knikker${tot > 1 ? 's' : ''}. Je neemt er ${alle ? 'alle ' + tot : Z.k} na elkaar uit, zonder terug te leggen.`;
      const v = kies(['aantal', 'aantal', 'waarom', 'kleur']);
      if (v === 'waarom') {
        const k = Object.keys(Z.zak).length;
        return { soort: 'zakje', opdracht: `Waarom mag je het aantal kleurvolgordes hier niet berekenen als ${Array(Z.k).fill(k).join(' · ')}?`, html: opgave(zin), sleutel: zin + v, rapport: zin + ' (waarom)',
          antw: zinKeuze('Wat je al genomen hebt, zit niet meer in het zakje: het aantal keuzes hangt af van de vorige keuze.',
            ['Omdat je bij elke trekking altijd evenveel keuzes hebt.', 'Omdat je dan moet optellen in plaats van vermenigvuldigen.', 'Omdat de volgorde van de kleuren geen rol speelt.']),
          uitleg: ['\\text{zonder terugleggen: een kleur die op is, kan niet meer volgen}', `\\text{teken een boomdiagram: er zijn maar ${p.length} kleurvolgordes}`] };
      }
      if (v === 'kleur') {
        const c = kies(Object.keys(Z.zak)), m = p.filter(s => s[0] === c);
        return { soort: 'zakje', opdracht: `Hoeveel kleurvolgordes beginnen met een ${KLEURNAAM[c]} knikker (${c})?`, html: opgave(zin) + boom(B, { uitkomst: true, dy: 20 }), sleutel: zin + v + c, rapport: zin + ' begint met ' + c,
          antw: aantal(m.length), uitleg: [`\\text{${m.join(', ')}}`, `\\text{${m.length} kleurvolgordes}`] };
      }
      return { soort: 'zakje', opdracht: 'Hoeveel kleurvolgordes zijn er? Teken eerst een boomdiagram.', html: opgave(zin), sleutel: zin + v, rapport: zin,
        antw: aantal(p.length), uitleg: [`\\text{eindpunten: ${p.join(', ')}}`, `\\text{${p.length} kleurvolgordes}`], uitlegHtml: boom(B, { uitkomst: true, dy: 20 }) };
    } },
    match: { naam: 'Een match tot 2 gewonnen sets', gen() {
      const [a, b, wat, sets] = kies(MATCHES), A = a.replace(/^de /, '')[0].toUpperCase(), Bk = b.replace(/^de /, '')[0].toUpperCase() === A ? 'X' : b.replace(/^de /, '')[0].toUpperCase();
      const zin = `${a[0].toUpperCase() + a.slice(1)} (${A}) en ${b} (${Bk}) spelen ${wat}. Wie eerst 2 ${sets} wint, wint. Er wordt dus niet altijd een derde gespeeld.`;
      const B = matchBoom(A, Bk), p = paden(B), v = kies(['tot', 'wint', 'drie', 'twee']);
      const vraag = { tot: ['Hoeveel verlopen zijn er?', p], wint: [`In hoeveel verlopen wint ${a}?`, p.filter(s => s.split('').filter(c => c === A).length === 2)],
        drie: [`In hoeveel verlopen worden er 3 ${sets} gespeeld?`, p.filter(s => s.length === 3)], twee: [`In hoeveel verlopen is het na 2 ${sets} al gedaan?`, p.filter(s => s.length === 2)] }[v];
      return { soort: 'match', opdracht: vraag[0] + ' Teken een boomdiagram.', html: opgave(zin), sleutel: zin + v, rapport: zin + ' ' + v,
        antw: aantal(vraag[1].length), uitleg: [`\\text{alle verlopen: ${p.join(', ')}}`, `\\text{${vraag[0].replace('?', '')}: ${vraag[1].join(', ')} → ${vraag[1].length}}`], uitlegHtml: boom(B, { uitkomst: true }) };
    } },
  },
  oefenMix: [['keuzes', 2], ['munt', 2], ['zakje', 2], ['match', 1]],
  test: [['keuzes', 3], ['munt', 3], ['zakje', 2], ['match', 2]], testSchudden: true,
};
function matchBoom(A, B) {
  const bouw = (s) => { const a = s.split('').filter(c => c === A).length, b = s.length - a; if (a === 2 || b === 2) return []; return [A, B].map(l => ({ l, kids: bouw(s + l) })); };
  return { kids: bouw('') };
}

// ---- 2. De productregel ---------------------------------------------------------------------
const OUTFITS = [
  ['Lars', 'pulls', 'jeansbroeken', 'paar sneakers', 'pull'], ['Amira', 'kleedjes', 'jasjes', 'paar sandalen', 'kleedje'], ['Kobe', 'petten', 'T-shirts', 'shorts', 'pet'],
  ['Elif', 'sjaals', 'mutsen', 'paar handschoenen', 'sjaal'], ['Wout', 'hemden', 'dassen', 'kostuums', 'hemd'],
];
const MENU3 = [
  ['In het schoolrestaurant kies je', 'soepen', 'hoofdgerechten', 'desserts'], ['Bij de pitazaak kies je', 'soorten brood', 'soorten vlees', 'sauzen'],
  ['In de ijssalon kies je', 'soorten bekers', 'smaken', 'toppings'], ['Voor een ontbijtpakket kies je', 'koffiekoeken', 'soorten brood', 'soorten sap'],
];
const D2 = {
  nr: 2, titel: 'De productregel', kort: 'Na elkaar kiezen (EN) → vermenigvuldigen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Productregel</div>
      <p>Kies je na elkaar uit $a$ mogelijkheden <b>EN</b> daarna uit $b$ mogelijkheden (EN uit $c$ …), dan zijn er $$a \\cdot b \\cdot c \\cdot \\ldots$$ mogelijkheden.</p>
      <p class="midden"><b>Woordje EN → vermenigvuldigen</b></p>
      <p class="klein">Lili kiest een frisdrank (3 soorten), een hamburger (5 soorten) en een frietsaus (4 soorten): $3 \\cdot 5 \\cdot 4 = 60$ mogelijkheden.</p></div>
    <div class="kader eig"><div class="kader-titel">Herhaling of niet?</div>
      <p>Een pincode van 4 cijfers (0 tot en met 9): $10 \\cdot 10 \\cdot 10 \\cdot 10 = 10\\,000$ pincodes.</p>
      <p>Moeten alle cijfers <b>verschillend</b> zijn? Een cijfer dat al gebruikt is, valt weg: elke stap één keuze minder. $10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040$.</p></div>
    <div class="kader"><div class="kader-titel">Werkwijze</div>
      <ol><li>Hoeveel keuzes (plaatsen, stappen) maak je na elkaar?</li><li>Hoeveel mogelijkheden heb je bij elke keuze? Let op: mag iets twee keer?</li><li>Vermenigvuldig.</li></ol></div>`,
  voorbeelden: [
    { tex: '\\text{Een fietsslot heeft 3 ringen met de cijfers 0 tot en met 9. Hoeveel codes?}', stappen: ['10 \\cdot 10 \\cdot 10', '= 1000 \\text{ codes}'] },
    { tex: '\\text{12 leerlingen. Op hoeveel manieren kies je een klasverantwoordelijke en een vervanger?}', stappen: ['\\text{eerst 12 keuzes, daarna nog 11 (niet dezelfde persoon)}', '12 \\cdot 11 = 132'] },
    { html: `${opgave('Van Brugge naar Gent zijn er 3 wegen, van Gent naar Antwerpen 4. Op hoeveel manieren rij je van Brugge naar Antwerpen (langs Gent)?')}${wegen({ Br: [40, 85], G: [180, 85], A: [320, 85] }, [['Br', 'G', 3], ['G', 'A', 4]])}`,
      stappen: ['\\text{Brugge → Gent EN Gent → Antwerpen}', '3 \\cdot 4 = 12 \\text{ manieren}'] },
  ],
  soorten: {
    outfit: { naam: 'Samenstellen', gen() {
      if (kies([true, false])) {
        const [n, a, b, c, enk] = kies(OUTFITS), x = rnd(3, 7), y = rnd(2, 5), z = rnd(2, 4), was = kies([true, false]);
        const zin = `${n} heeft ${x} ${a}, ${y} ${b} en ${z} ${c}.`;
        if (!was) return { soort: 'outfit', opdracht: 'Hoeveel verschillende combinaties kan je samenstellen?', html: opgave(zin), sleutel: zin, rapport: zin, antw: aantal(x * y * z), uitleg: [`${x} \\cdot ${y} \\cdot ${z} = ${x * y * z}`] };
        const k = rnd(1, Math.min(2, x - 1));
        return { soort: 'outfit', opdracht: `${k === 1 ? `Eén ${enk} is` : `${k} ${a} zijn`} kwijt. Hoeveel combinaties zijn er nog?`, html: opgave(zin), sleutel: zin + k, rapport: zin + ` (${k} kwijt)`, antw: aantal((x - k) * y * z), uitleg: [`\\text{nog ${x - k} ${a}}`, `${x - k} \\cdot ${y} \\cdot ${z} = ${(x - k) * y * z}`] };
      }
      const [t, a, b, c] = kies(MENU3), x = rnd(2, 5), y = rnd(3, 8), z = rnd(2, 6), zin = `${t} uit ${x} ${a}, ${y} ${b} en ${z} ${c}. Je neemt van elk één.`;
      return { soort: 'outfit', opdracht: 'Hoeveel mogelijkheden zijn er?', html: opgave(zin), sleutel: zin, rapport: zin, antw: aantal(x * y * z), uitleg: [`${x} \\cdot ${y} \\cdot ${z} = ${x * y * z}`] };
    } },
    code: { naam: 'Codes', gen() {
      const C = kies([
        () => { const n = kies([3, 4, 5]); return { zin: `Een cijferslot heeft ${n} ringen met de cijfers 0 tot en met 9.`, pl: Array(n).fill(10), dif: Array.from({ length: n }, (_, i) => 10 - i), w: 'codes' }; },
        () => ({ zin: 'Een lockercode bestaat uit 2 letters (26 mogelijkheden) gevolgd door 2 cijfers, bv. KM38.', pl: [26, 26, 10, 10], dif: [26, 25, 10, 9], w: 'codes' }),
        () => ({ zin: 'Een wifi-code bestaat uit 1 letter (26 mogelijkheden) gevolgd door 3 cijfers, bv. Q507.', pl: [26, 10, 10, 10], dif: [26, 10, 9, 8], w: 'codes' }),
        () => { const k = kies([4, 5, 6]), n = 3, L = 'ABCDEF'.slice(0, k).split('').join(', '); return { zin: `Je maakt een code van ${n} letters met de letters ${L}.`, pl: Array(n).fill(k), dif: Array.from({ length: n }, (_, i) => k - i), w: 'codes' }; },
        () => { const k = kies([3, 4]), n = kies([3, 4]); return { zin: `Een lampje kan ${k} kleuren geven. Een signaal bestaat uit ${n} flitsen na elkaar.`, pl: Array(n).fill(k), dif: n <= k ? Array.from({ length: n }, (_, i) => k - i) : null, w: 'signalen', tv: 'alle flitsen een andere kleur hebben' }; },
      ])();
      const p = (a) => a.reduce((x, y) => x * y, 1), verschil = C.dif && kies([true, false]);
      if (!verschil) return { soort: 'code', opdracht: `Hoeveel ${C.w} zijn er mogelijk?`, html: opgave(C.zin), sleutel: C.zin, rapport: C.zin, antw: aantal(p(C.pl)), uitleg: [`${C.pl.join(' \\cdot ')} = ${tgd(p(C.pl))}`] };
      const tekstV = C.tv ? C.tv : C.pl.length === 4 && C.pl[0] === 26 && C.pl[1] === 26 ? 'de 2 letters verschillend zijn en de 2 cijfers ook' : C.pl[0] === 26 ? 'de 3 cijfers verschillend moeten zijn' : 'alle tekens verschillend moeten zijn';
      return { soort: 'code', opdracht: `Hoeveel ${C.w} zijn er als ${tekstV}?`, html: opgave(C.zin), sleutel: C.zin + 'v', rapport: C.zin + ' (verschillend)', antw: aantal(p(C.dif)),
        uitleg: ['\\text{wat al gebruikt is, valt weg: elke stap één keuze minder}', `${C.dif.join(' \\cdot ')} = ${tgd(p(C.dif))}`] };
    } },
    rangschik: { naam: 'Plaatsen en functies verdelen', gen() {
      const C = kies([
        () => { const n = rnd(6, 12); return { zin: `${n} zwemmers zwemmen een finale. Er zijn medailles voor goud, zilver en brons.`, n, k: 3, w: 'Op hoeveel manieren kan het podium eruitzien?', vast: 'Je weet al dat Lotte goud wint.' }; },
        () => { const n = rnd(8, 15); return { zin: `In een jeugdbeweging met ${n} leiders kies je een hoofdleider, een kassier en een secretaris (drie verschillende personen).`, n, k: 3, w: 'Op hoeveel manieren kan dat?', vast: 'Ruben wordt zeker hoofdleider.' }; },
        () => { const n = rnd(5, 9); return { zin: `${n} vrienden gaan naar de cinema. Er is nog een rij met ${Math.min(n, 4)} vrije stoelen.`, n, k: Math.min(n, 4), w: `Op hoeveel manieren kunnen ${Math.min(n, 4)} van hen op die stoelen gaan zitten?`, vast: 'Jana zit zeker op de eerste stoel.' }; },
        () => { const n = rnd(4, 6); return { zin: `${n} boeken worden naast elkaar op een plank gezet.`, n, k: n, w: 'Op hoeveel manieren kan dat?', vast: 'Het woordenboek staat zeker helemaal links.' }; },
        () => { const n = rnd(10, 20); return { zin: `In een quiz met ${n} ploegen krijgen de 1ste en de 2de plaats een prijs.`, n, k: 2, w: 'Op hoeveel manieren kunnen de prijzen verdeeld worden?', vast: 'Ploeg De Slimmeriken wordt zeker eerste.' }; },
      ])();
      const f = Array.from({ length: C.k }, (_, i) => C.n - i), p = f.reduce((a, b) => a * b, 1), v = kies([true, true, false]);
      if (v) return { soort: 'rangschik', opdracht: C.w, html: opgave(C.zin), sleutel: C.zin, rapport: C.zin, antw: aantal(p), uitleg: ['\\text{wie al gekozen is, valt weg}', `${f.join(' \\cdot ')} = ${tgd(p)}`] };
      const g = f.slice(1).map(x => x), q = g.reduce((a, b) => a * b, 1);
      return { soort: 'rangschik', opdracht: `${C.vast} ${C.w}`, html: opgave(C.zin), sleutel: C.zin + 'vast', rapport: C.zin + ' (één ligt vast)', antw: aantal(q),
        uitleg: ['\\text{de eerste plaats ligt vast: 1 keuze}', `1 \\cdot ${g.join(' \\cdot ')} = ${tgd(q)}`] };
    } },
    route: { naam: 'Routes', gen() {
      const [p1, p2, p3] = kies([['thuis', 'station', 'school'], ['Lier', 'Mechelen', 'Leuven'], ['camping', 'dorp', 'strand'], ['hotel', 'markt', 'museum']]);
      const a = rnd(2, 4), b = rnd(2, 4), A = p1[0].toUpperCase(), B = p2[0].toUpperCase() === A ? p2.slice(0, 2).toUpperCase() : p2[0].toUpperCase(), C = p3[0].toUpperCase() === A || p3[0].toUpperCase() === B ? p3.slice(0, 2).toUpperCase() : p3[0].toUpperCase();
      const fig = wegen({ [A]: [40, 85], [B]: [180, 85], [C]: [320, 85] }, [[A, B, a], [B, C, b]]);
      const zin = `Van ${p1} (${A}) naar ${p3} (${C}) ga je altijd langs ${p2} (${B}). Je ziet hoeveel wegen er zijn.`;
      const v = kies(['heen', 'heenterug', 'anders']), r = a * b;
      if (v === 'heen') return { soort: 'route', opdracht: `Op hoeveel manieren ga je van ${p1} naar ${p3}?`, html: opgave(zin) + fig, sleutel: zin + v + a + b, rapport: zin, antw: aantal(r), uitleg: [`${a} \\cdot ${b} = ${r}`] };
      if (v === 'heenterug') return { soort: 'route', opdracht: 'Op hoeveel manieren ga je heen en terug?', html: opgave(zin) + fig, sleutel: zin + v + a + b, rapport: zin + ' heen en terug', antw: aantal(r * r), uitleg: [`\\text{heen: } ${a} \\cdot ${b} = ${r}`, `\\text{heen EN terug: } ${r} \\cdot ${r} = ${r * r}`] };
      return { soort: 'route', opdracht: 'Op hoeveel manieren ga je heen en terug, als je terug een andere route wil nemen dan heen?', html: opgave(zin) + fig, sleutel: zin + v + a + b, rapport: zin + ' andere route terug', antw: aantal(r * (r - 1)),
        uitleg: [`\\text{heen: } ${a} \\cdot ${b} = ${r} \\text{ routes}`, `\\text{terug: één route minder, dus } ${r - 1}`, `${r} \\cdot ${r - 1} = ${r * (r - 1)}`] };
    } },
    getallen: { naam: 'Getallen maken', gen() {
      const k = rnd(4, 7), d = kies([2, 3]), cij = Array.from({ length: k }, (_, i) => i + 1);
      const zin = `Met de cijfers 1 tot en met ${k} maak je een getal van ${d} cijfers.`;
      const v = kies(['herh', 'versch', 'even']);
      if (v === 'herh') return { soort: 'getallen', opdracht: 'Hoeveel getallen kan je maken als een cijfer meer dan één keer mag voorkomen?', html: opgave(zin), sleutel: zin + v, rapport: zin + ' (herhaling)', antw: aantal(k ** d), uitleg: [`${Array(d).fill(k).join(' \\cdot ')} = ${k ** d}`] };
      const f = Array.from({ length: d }, (_, i) => k - i);
      if (v === 'versch') return { soort: 'getallen', opdracht: 'Hoeveel getallen met allemaal verschillende cijfers kan je maken?', html: opgave(zin), sleutel: zin + v, rapport: zin + ' (verschillend)', antw: aantal(f.reduce((a, b) => a * b, 1)), uitleg: [`${f.join(' \\cdot ')} = ${f.reduce((a, b) => a * b, 1)}`] };
      const ev = cij.filter(c => c % 2 === 0), rest = Array.from({ length: d - 1 }, (_, i) => k - 1 - i), r = ev.length * rest.reduce((a, b) => a * b, 1);
      return { soort: 'getallen', opdracht: 'Hoeveel even getallen met verschillende cijfers kan je maken?', html: opgave(zin), sleutel: zin + v, rapport: zin + ' (even)', antw: aantal(r),
        uitleg: [`\\text{begin bij het laatste cijfer: ${ev.join(' of ')}, dus ${ev.length} keuzes}`, `\\text{daarna voor de andere plaatsen: } ${rest.join(' \\cdot ')}`, `${ev.length} \\cdot ${rest.join(' \\cdot ')} = ${r}`] };
    } },
  },
  oefenMix: [['outfit', 2], ['code', 2], ['rangschik', 2], ['route', 1], ['getallen', 1]],
  test: [['outfit', 2], ['code', 3], ['rangschik', 2], ['route', 2], ['getallen', 1]], testSchudden: true,
};

// ---- 3. De somregel ------------------------------------------------------------------------
const OFKEUZES = [
  ['In de bib kies je één film: een van de {a} Nederlandstalige of een van de {b} Engelstalige films.'],
  ['Op de kermis koop je één ticket: voor een van de {a} snelle attracties of een van de {b} rustige attracties.'],
  ['Je kiest één sport: een van de {a} balsporten of een van de {b} vechtsporten.'],
  ['Als dessert neem je één ding: een van de {a} soorten ijs of een van de {b} soorten taart.'],
  ['Voor je project kies je één onderwerp: een van de {a} onderwerpen over natuur of een van de {b} onderwerpen over geschiedenis.'],
  ['Je kiest één reis: een van de {a} citytrips, een van de {b} strandvakanties of een van de {c} wandelvakanties.'],
  ['In de jeugdbeweging kies je één workshop: een van de {a} creatieve, een van de {b} sportieve of een van de {c} muzikale workshops.'],
];
function routeOf() { // A → B → D en A → C → D, eventueel rechtstreeks
  const a = rnd(2, 4), b = rnd(1, 3), c = rnd(1, 4), d = rnd(1, 3), direct = kies([0, 0, 1, 2]);
  const lijst = [['A', 'B', a], ['B', 'D', b], ['A', 'C', c], ['C', 'D', d]];
  if (direct) lijst.push(['A', 'D', direct]);
  return { a, b, c, d, direct, fig: wegen({ A: [40, 110], B: [180, 34], C: [180, 186], D: [320, 110] }, lijst, { h: 220 }) };
}
const D3 = {
  nr: 3, titel: 'De somregel', kort: 'Het ene OF het andere (zonder overlap) → optellen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Somregel</div>
      <p>Kan iets op $a$ manieren <b>OF</b> op $b$ manieren (zonder overlap), dan zijn er $$a + b$$ mogelijkheden.</p>
      <p class="midden"><b>Woordje OF → optellen</b></p></div>
    <div class="kader eig"><div class="kader-titel">Van A naar C: langs B of langs D</div>
      ${wegen({ A: [40, 110], B: [180, 34], D: [180, 186], C: [320, 110] }, [['A', 'B', 3], ['B', 'C', 4], ['A', 'D', 2], ['D', 'C', 3]], { h: 220 })}
      <p>Langs B: $3 \\cdot 4 = 12$ &nbsp; (EN: productregel) &nbsp;&nbsp; Langs D: $2 \\cdot 3 = 6$</p>
      <p>Langs B <b>OF</b> langs D: $12 + 6 = 18$ manieren.</p></div>
    <div class="kader"><div class="kader-titel">EN of OF?</div>
      <p><b>EN</b>: je maakt alle keuzes na elkaar (een broodje <b>en</b> een drankje) → vermenigvuldigen.<br><b>OF</b>: je maakt maar één keuze uit verschillende groepen (een broodje <b>of</b> een slaatje) → optellen.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Je kiest één boek: een van de 8 strips of een van de 5 jeugdromans.}', stappen: ['\\text{strip OF roman, geen overlap}', '8 + 5 = 13 \\text{ keuzes}'] },
    { tex: '\\text{Lunch: een warme schotel (4 soorten) of een broodje (3 broden en 5 soorten beleg).}', stappen: ['\\text{broodje: brood EN beleg: } 3 \\cdot 5 = 15', '\\text{schotel OF broodje: } 4 + 15 = 19'] },
  ],
  soorten: {
    of: { naam: 'Eén keuze uit groepen', gen() {
      const [s] = kies(OFKEUZES), a = rnd(3, 15), b = rnd(2, 12), c = rnd(2, 9), drie = s.includes('{c}');
      const zin = s.replace('{a}', a).replace('{b}', b).replace('{c}', c), r = a + b + (drie ? c : 0);
      return { soort: 'of', opdracht: 'Hoeveel keuzes heb je?', html: opgave(zin), sleutel: zin, rapport: zin, antw: aantal(r), uitleg: ['\\text{het ene OF het andere, geen overlap: optellen}', `${a} + ${b}${drie ? ' + ' + c : ''} = ${r}`] };
    } },
    routes: { naam: 'Routes langs verschillende wegen', gen() {
      const R = routeOf(), v = R.direct ? kies(['alles', 'langsB']) : kies(['alles', 'alles', 'langsB', 'extra']);
      const lb = R.a * R.b, lc = R.c * R.d, zin = 'Bekijk de wegenkaart.';
      if (v === 'langsB') return { soort: 'routes', opdracht: 'Op hoeveel manieren ga je van A naar D langs B?', html: opgave(zin) + R.fig, sleutel: JSON.stringify(R) + v, rapport: `A→D langs B (${R.a}, ${R.b})`, antw: aantal(lb), uitleg: [`${R.a} \\cdot ${R.b} = ${lb}`] };
      if (v === 'extra') return { soort: 'routes', opdracht: 'Er komt ook één rechtstreekse weg van A naar D bij. Op hoeveel manieren ga je nu van A naar D?', html: opgave(zin) + R.fig, sleutel: JSON.stringify(R) + v, rapport: 'A→D met extra weg', antw: aantal(lb + lc + 1),
        uitleg: [`\\text{langs B: } ${R.a} \\cdot ${R.b} = ${lb} \\qquad \\text{langs C: } ${R.c} \\cdot ${R.d} = ${lc}`, `${lb} + ${lc} + 1 = ${lb + lc + 1}`] };
      const r = lb + lc + R.direct;
      return { soort: 'routes', opdracht: 'Op hoeveel manieren ga je van A naar D?', html: opgave(zin) + R.fig, sleutel: JSON.stringify(R) + v, rapport: 'A→D', antw: aantal(r),
        uitleg: [`\\text{langs B: } ${R.a} \\cdot ${R.b} = ${lb} \\qquad \\text{langs C: } ${R.c} \\cdot ${R.d} = ${lc}`, `${R.direct ? `\\text{rechtstreeks: } ${R.direct} \\qquad ` : ''}${lb} + ${lc}${R.direct ? ' + ' + R.direct : ''} = ${r}`] };
    } },
    combi: { naam: 'EN en OF samen', gen() {
      const C = kies([
        () => { const s = rnd(2, 6), b = rnd(2, 4), l = rnd(3, 6); return { zin: `Als lunch neem je een warme schotel (${s} soorten) of een broodje: je kiest dan een soort brood (${b} soorten) en een beleg (${l} soorten).`, r: s + b * l, u: [`\\text{broodje: } ${b} \\cdot ${l} = ${b * l}`, `\\text{schotel OF broodje: } ${s} + ${b * l} = ${s + b * l}`] }; },
        () => { const t = rnd(2, 5), sm = rnd(3, 6), p = rnd(2, 6); return { zin: `In de ijssalon neem je een milkshake (${p} smaken) of een ijsje: je kiest dan een hoorntje of een potje (2 mogelijkheden) en één bol uit ${sm} smaken. Bovendien kan je ${t} soorten sorbet nemen.`, r: p + 2 * sm + t, u: [`\\text{ijsje: } 2 \\cdot ${sm} = ${2 * sm}`, `${p} + ${2 * sm} + ${t} = ${p + 2 * sm + t}`] }; },
        () => { const tr = rnd(2, 4), bu = rnd(2, 5), fi = rnd(2, 3); return { zin: `Je gaat naar een festival. Je kan de trein nemen (${tr} treinen) of eerst de bus naar het station (${bu} bussen) en daarna een deelfiets (${fi} fietspunten).`, r: tr + bu * fi, u: [`\\text{bus EN fiets: } ${bu} \\cdot ${fi} = ${bu * fi}`, `\\text{trein OF bus+fiets: } ${tr} + ${bu * fi} = ${tr + bu * fi}`] }; },
        () => { const a = rnd(3, 6), b = rnd(3, 6); return { zin: `Een code is ofwel 1 letter uit A, B, C, D, E gevolgd door 1 cijfer (0 tot en met 9), ofwel een getal van 2 cijfers met de cijfers 1 tot en met ${a}.`, r: 50 + a * a, u: [`\\text{letter EN cijfer: } 5 \\cdot 10 = 50`, `\\text{twee cijfers: } ${a} \\cdot ${a} = ${a * a}`, `50 + ${a * a} = ${50 + a * a}`] }; },
      ])();
      return { soort: 'combi', opdracht: 'Hoeveel mogelijkheden zijn er?', html: opgave(C.zin), sleutel: C.zin, rapport: C.zin, antw: aantal(C.r), uitleg: C.u };
    } },
    regel: { naam: 'Optellen of vermenigvuldigen?', gen() {
      const a = rnd(3, 9), b = rnd(2, 8);
      const S = kies([
        [`Je kiest een jas (${a} jassen) en een sjaal (${b} sjaals).`, 1], [`Je kiest één jas: een van de ${a} winterjassen of een van de ${b} regenjassen.`, 0],
        [`Je kiest een voorgerecht (${a} soorten) en een hoofdgerecht (${b} soorten).`, 1], [`Je kiest één gerecht: een van de ${a} vegetarische of een van de ${b} visgerechten.`, 0],
        [`Je koopt een ticket voor één concert: een van de ${a} concerten op zaterdag of een van de ${b} op zondag.`, 0], [`Je kiest een concert op zaterdag (${a} concerten) en een concert op zondag (${b} concerten).`, 1],
      ]);
      const r = S[1] ? a * b : a + b;
      return { soort: 'regel', opdracht: 'Welke regel gebruik je en hoeveel mogelijkheden zijn er?', html: opgave(S[0]), sleutel: S[0], rapport: S[0],
        antw: delen(['\\text{regel:}', keuze(kT(['somregel (optellen)', 'productregel (vermenigvuldigen)']), S[1])], ['\\text{aantal:}', aantal(r)]),
        uitleg: [S[1] ? '\\text{het ene EN het andere: productregel}' : '\\text{het ene OF het andere: somregel}', S[1] ? `${a} \\cdot ${b} = ${r}` : `${a} + ${b} = ${r}`] };
    } },
  },
  oefenMix: [['of', 1], ['routes', 2], ['combi', 2], ['regel', 2]],
  test: [['of', 2], ['regel', 2], ['routes', 4], ['combi', 2]], testSchudden: true,
};

// ---- 4. Tellen met een venndiagram -----------------------------------------------------------
const VENN2 = [
  { t: 'In een klas van {N} leerlingen hebben er {A} een fiets (F) en {B} een step (S). {AB} leerlingen hebben een fiets én een step.', n: ['F', 'S'], wd: ['fiets', 'step'], g: 'leerlingen', ea: 'hebben enkel een fiets', eb: 'hebben enkel een step', nb: 'hebben geen step' },
  { t: 'Van de {N} medewerkers van een bedrijf drinken er {A} koffie (K) en {B} thee (T). {AB} drinken allebei.', n: ['K', 'T'], wd: ['koffie', 'thee'], g: 'medewerkers', ea: 'drinken enkel koffie', eb: 'drinken enkel thee', nb: 'drinken geen thee' },
  { t: 'In een jeugdclub van {N} jongeren zitten er {A} op Instagram (I) en {B} op TikTok (T). {AB} zitten op allebei.', n: ['I', 'T'], wd: ['Instagram', 'TikTok'], g: 'jongeren', ea: 'zitten enkel op Instagram', eb: 'zitten enkel op TikTok', nb: 'zitten niet op TikTok' },
  { t: 'In een straat wonen {N} gezinnen. {A} gezinnen hebben een tuin (T) en {B} een garage (G). {AB} hebben een tuin én een garage.', n: ['T', 'G'], wd: ['tuin', 'garage'], g: 'gezinnen', ea: 'hebben enkel een tuin', eb: 'hebben enkel een garage', nb: 'hebben geen garage' },
  { t: 'Op een feest zijn {N} gasten. {A} gasten eten vlees (V) en {B} eten vis (F). {AB} eten allebei.', n: ['V', 'F'], wd: ['vlees', 'vis'], g: 'gasten', ea: 'eten enkel vlees', eb: 'eten enkel vis', nb: 'eten geen vis' },
  { t: 'Van de {N} leerlingen van het 7de jaar hebben er {A} een rijbewijs (R) en {B} een studentenjob (J). {AB} hebben allebei.', n: ['R', 'J'], wd: ['rijbewijs', 'studentenjob'], g: 'leerlingen', ea: 'hebben enkel een rijbewijs', eb: 'hebben enkel een studentenjob', nb: 'hebben geen studentenjob' },
];
function venn2Getallen() { const ab = rnd(2, 8), a = rnd(3, 14), b = rnd(2, 12), u = rnd(1, 9); return { a, ab, b, u, A: a + ab, B: b + ab, N: a + ab + b + u }; }
const V3CTX = [
  { t: 'Van de {N} leerlingen van een school spelen er {A} gitaar (G), {B} piano (P) en {C} drum (D). {AB} spelen gitaar en piano, {BC} piano en drum, {AC} gitaar en drum. {ABC} spelen alle drie.', n: ['G', 'P', 'D'], w: ['gitaar', 'piano', 'drum'], g: 'leerlingen', d: 'spelen' },
  { t: 'Een enquête bij {N} gezinnen: {A} hebben een hond (H), {B} een kat (K) en {C} vissen (V). {AB} hebben een hond en een kat, {BC} een kat en vissen, {AC} een hond en vissen. {ABC} hebben alle drie.', n: ['H', 'K', 'V'], w: ['een hond', 'een kat', 'vissen'], g: 'gezinnen', d: 'hebben' },
  { t: 'In een sportclub met {N} leden doen er {A} aan tennis (T), {B} aan zwemmen (Z) en {C} aan fitness (F). {AB} doen tennis en zwemmen, {BC} zwemmen en fitness, {AC} tennis en fitness. {ABC} doen alle drie.', n: ['T', 'Z', 'F'], w: ['tennis', 'zwemmen', 'fitness'], g: 'leden', d: 'doen' },
  { t: 'Van de {N} studenten volgen er {A} Engels (E), {B} Frans (F) en {C} Spaans (S). {AB} volgen Engels en Frans, {BC} Frans en Spaans, {AC} Engels en Spaans. {ABC} volgen alle drie.', n: ['E', 'F', 'S'], w: ['Engels', 'Frans', 'Spaans'], g: 'studenten', d: 'volgen' },
];
function venn3Getallen() {
  const r = { abc: rnd(2, 5), ab: rnd(1, 7), bc: rnd(1, 7), ac: rnd(1, 7), a: rnd(2, 14), b: rnd(2, 14), c: rnd(2, 14), u: rnd(1, 12) };
  return { ...r, A: r.a + r.ab + r.ac + r.abc, B: r.b + r.ab + r.bc + r.abc, C: r.c + r.ac + r.bc + r.abc, AB: r.ab + r.abc, BC: r.bc + r.abc, AC: r.ac + r.abc, ABC: r.abc,
    N: r.a + r.b + r.c + r.ab + r.bc + r.ac + r.abc + r.u };
}
const vulIn = (t, g) => t.replace(/\{(\w+)\}/g, (m, k) => g[k]);
const D4 = {
  nr: 4, titel: 'Tellen met een venndiagram', kort: 'Wat in beide zit, tel je maar één keer.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Notaties</div>
      <p>$U$ = alle elementen waarover het gaat &nbsp;&nbsp; $\\#A$ = aantal elementen van $A$</p>
      <ul><li><b>unie</b> $A \\cup B$: in $A$ <b>of</b> in $B$ (minstens in één van beide)</li><li><b>doorsnede</b> $A \\cap B$: in $A$ <b>én</b> in $B$</li>
      <li><b>verschil</b> $A \\setminus B$: in $A$, niet in $B$</li><li><b>complement</b> $\\overline{A}$: niet in $A$</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Voetbal en muziek</div>
      <p>Klas van 24: 14 spelen voetbal (V), 9 bespelen een instrument (M), 5 doen allebei.</p>
      ${venn2({ a: 9, ab: 5, b: 4, u: 6 }, ['V', 'M'])}
      <p>Enkel voetbal: $14 - 5 = 9$ &nbsp; Enkel muziek: $9 - 5 = 4$ &nbsp; Minstens één: $9 + 5 + 4 = 18$ &nbsp; Geen van beide: $24 - 18 = 6$</p>
      <p class="klein">$14 + 9 = 23$ is fout: de 5 tel je dan twee keer!</p></div>
    <div class="kader def"><div class="kader-titel">Somregel bij overlap</div>
      <p class="midden">$\\#(A \\cup B) = \\#A + \\#B - \\#(A \\cap B)$</p><p>Wat in beide zit, mag je maar één keer tellen.</p></div>
    <div class="kader eig"><div class="kader-titel">Drie verzamelingen: stappenplan</div>
      <ol><li>begin in het <b>midden</b> (alle drie)</li><li>dan de stukken met <b>twee</b> (trek het midden af)</li><li>dan de stukken met <b>één</b> (trek alles wat al in die cirkel staat af)</li><li>vergeet de <b>buitenkant</b> niet (totaal − alles in de cirkels)</li></ol></div>`,
  voorbeelden: [
    { html: `${opgave('150 leerlingen: 50 hebben een laptop (L), 65 een computer (C), 60 een tablet (T). 25 hebben L en C, 20 C en T, 15 L en T. 10 hebben alle drie.')}${venn3({ a: 20, b: 30, c: 35, ab: 15, bc: 10, ac: 5, abc: 10, u: 25 }, ['L', 'C', 'T'])}`,
      stappen: ['\\text{midden: 10}', '\\text{L en C: } 25 - 10 = 15 \\quad \\text{C en T: } 20 - 10 = 10 \\quad \\text{L en T: } 15 - 10 = 5', '\\text{enkel L: } 50 - 15 - 5 - 10 = 20 \\quad \\text{enkel C: } 30 \\quad \\text{enkel T: } 35',
        '\\text{in de cirkels: } 20 + 30 + 35 + 15 + 10 + 5 + 10 = 125', '\\text{buiten: } 150 - 125 = 25', '\\text{juist 2 toestellen: } 15 + 10 + 5 = 30'] },
    { tex: '\\text{30 leerlingen, 18 spreken Frans, 20 Engels, iedereen minstens één. Hoeveel spreken beide?}', stappen: ['18 + 20 = 38 \\text{, maar er zijn maar 30 leerlingen}', '38 - 30 = 8 \\text{ werden dubbel geteld: 8 spreken beide talen}'] },
  ],
  soorten: {
    symbool: { naam: 'Aflezen met symbolen', gen() {
      const g = venn2Getallen(), [P, Q] = kies([['A', 'B'], ['V', 'W'], ['K', 'L']]);
      const v = kies(['A', 'B', 'unie', 'door', 'verschil', 'verschilB', 'comp', 'U']);
      const V = { A: [`\\#${P}`, g.A, `${g.a} + ${g.ab}`], B: [`\\#${Q}`, g.B, `${g.ab} + ${g.b}`], unie: [`\\#(${P} \\cup ${Q})`, g.a + g.ab + g.b, `${g.a} + ${g.ab} + ${g.b}`], door: [`\\#(${P} \\cap ${Q})`, g.ab, '\\text{het stuk in het midden}'],
        verschil: [`\\#(${P} \\setminus ${Q})`, g.a, `\\text{in } ${P}\\text{, niet in } ${Q}`], verschilB: [`\\#(${Q} \\setminus ${P})`, g.b, `\\text{in } ${Q}\\text{, niet in } ${P}`], comp: [`\\#\\overline{${P}}`, g.b + g.u, `${g.b} + ${g.u}`], U: ['\\#U', g.N, `${g.a} + ${g.ab} + ${g.b} + ${g.u}`] }[v];
      return { soort: 'symbool', opdracht: 'Lees af uit het venndiagram.', html: venn2(g, [P, Q]), sleutel: JSON.stringify(g) + v, rapport: `${V[0]} uit venndiagram`,
        antw: aantal(V[1], `${V[0]} =`), uitleg: [`${V[0]} = ${V[2]} = ${V[1]}`] };
    } },
    context: { naam: 'Twee groepen die overlappen', gen() {
      const C = kies(VENN2), g = venn2Getallen(), zin = vulIn(C.t, { ...g, AB: g.ab });
      const v = kies(['enkelA', 'enkelB', 'minstens', 'geen', 'nietB']);
      const V = { enkelA: [`Hoeveel ${C.g} ${C.ea}?`, g.a, [`${g.A} - ${g.ab} = ${g.a}`]],
        enkelB: [`Hoeveel ${C.g} ${C.eb}?`, g.b, [`${g.B} - ${g.ab} = ${g.b}`]],
        minstens: [`Hoeveel ${C.g} vallen in minstens één van beide groepen?`, g.a + g.ab + g.b, [`${g.a} + ${g.ab} + ${g.b} = ${g.a + g.ab + g.b}`, `\\text{of: } ${g.A} + ${g.B} - ${g.ab} = ${g.a + g.ab + g.b}`]],
        geen: [`Hoeveel ${C.g} vallen in geen van beide groepen?`, g.u, [`\\text{minstens één: } ${g.a} + ${g.ab} + ${g.b} = ${g.a + g.ab + g.b}`, `${g.N} - ${g.a + g.ab + g.b} = ${g.u}`]],
        nietB: [`Hoeveel ${C.g} ${C.nb}?`, g.N - g.B, [`${g.N} - ${g.B} = ${g.N - g.B}`]] }[v];
      return { soort: 'context', opdracht: V[0] + ' Vul eerst het venndiagram in.', html: opgave(zin) + venn2({ a: null, ab: null, b: null, u: null }, C.n), sleutel: zin + v, rapport: zin + ' ' + v,
        antw: aantal(V[1]), uitleg: [`\\text{midden: } ${g.ab} \\qquad \\text{enkel } ${C.n[0]}: ${g.A} - ${g.ab} = ${g.a} \\qquad \\text{enkel } ${C.n[1]}: ${g.B} - ${g.ab} = ${g.b}`, ...V[2]],
        uitlegHtml: venn2(g, C.n) };
    } },
    beide: { naam: 'Hoeveel in beide?', gen() {
      const C = kies([
        ['In een groep van {N} toeristen bezochten er {A} het Rubenshuis en {B} het MAS. Iedereen bezocht minstens één van beide.', 'Hoeveel toeristen bezochten beide?'],
        ['Op een avond kijken {N} mensen naar de match of naar de quiz. {A} kijken naar de match en {B} naar de quiz (zappen mag).', 'Hoeveel mensen keken naar beide?'],
        ['Van de {N} leerlingen hebben er {A} een smartwatch en {B} oortjes. Iedereen heeft minstens één van beide.', 'Hoeveel leerlingen hebben beide?'],
        ['In een klas van {N} leerlingen zijn er {A} geslaagd voor wiskunde en {B} voor Nederlands. Niemand is voor beide gebuisd.', 'Hoeveel leerlingen zijn voor beide geslaagd?'],
      ]);
      const ab = rnd(3, 12), a = rnd(4, 15), b = rnd(4, 15), N = a + b + ab, zin = vulIn(C[0], { N, A: a + ab, B: b + ab });
      return { soort: 'beide', opdracht: C[1], html: opgave(zin), sleutel: zin, rapport: zin, antw: aantal(ab),
        uitleg: [`${a + ab} + ${b + ab} = ${a + b + 2 * ab} \\text{, maar er zijn maar ${N}}`, `${a + b + 2 * ab} - ${N} = ${ab} \\text{ werden dubbel geteld}`] };
    } },
    drie: { naam: 'Drie verzamelingen', gen() {
      const C = kies(V3CTX), g = venn3Getallen(), zin = vulIn(C.t, g), [X, Y, Z] = C.n;
      const v = kies(['enkelC', 'enkelA', 'precies2', 'geen', 'nietA', 'minstens1']);
      const ken = (s) => s === 'enkelC' ? [`Hoeveel ${C.g} ${C.d} enkel ${C.w[2]}?`, g.c, `${g.C} - ${g.ac} - ${g.bc} - ${g.abc} = ${g.c}`]
        : s === 'enkelA' ? [`Hoeveel ${C.g} ${C.d} enkel ${C.w[0]}?`, g.a, `${g.A} - ${g.ab} - ${g.ac} - ${g.abc} = ${g.a}`]
        : s === 'precies2' ? [`Hoeveel ${C.g} ${C.d} er precies 2?`, g.ab + g.bc + g.ac, `${g.ab} + ${g.bc} + ${g.ac} = ${g.ab + g.bc + g.ac}`]
        : s === 'geen' ? [`Hoeveel ${C.g} ${C.d} er geen enkele?`, g.u, `\\text{in de cirkels: } ${g.N - g.u} \\qquad ${g.N} - ${g.N - g.u} = ${g.u}`]
        : s === 'nietA' ? [`Hoeveel ${C.g} ${C.d} geen ${C.w[0].replace(/^een /, '')}?`, g.N - g.A, `${g.N} - ${g.A} = ${g.N - g.A}`]
        : [`Hoeveel ${C.g} ${C.d} er minstens één?`, g.N - g.u, `${g.a} + ${g.b} + ${g.c} + ${g.ab} + ${g.bc} + ${g.ac} + ${g.abc} = ${g.N - g.u}`];
      const [vr, r, uit] = ken(v);
      return { soort: 'drie', opdracht: vr + ' Vul eerst het venndiagram in: begin in het midden!', html: opgave(zin) + venn3({}, C.n), sleutel: zin + v, rapport: zin + ' ' + v, antw: aantal(r),
        uitleg: [`\\text{midden: } ${g.abc}`, `${X}${Y}: ${g.AB} - ${g.abc} = ${g.ab} \\quad ${Y}${Z}: ${g.BC} - ${g.abc} = ${g.bc} \\quad ${X}${Z}: ${g.AC} - ${g.abc} = ${g.ac}`,
          `\\text{enkel } ${X}: ${g.a} \\quad \\text{enkel } ${Y}: ${g.b} \\quad \\text{enkel } ${Z}: ${g.c} \\quad \\text{buiten: } ${g.u}`, uit], uitlegHtml: venn3(g, C.n) };
    } },
  },
  oefenMix: [['symbool', 2], ['context', 2], ['beide', 1], ['drie', 2]],
  test: [['symbool', 2], ['context', 3], ['beide', 1], ['drie', 4]], testSchudden: false,
};

// ---- 5. De complementregel ---------------------------------------------------------------------
function minstensCtx() {
  return kies([
    () => { const n = kies([3, 4, 5]), c = rnd(0, 9); return { zin: `Een cijferslot heeft ${n} ringen met de cijfers 0 tot en met 9.`, b: 10, n, g: 1, w: `de code bevat minstens één ${c}`, zonder: `zonder ${c}`, eenh: 'codes' }; },
    () => { const n = kies([2, 3, 4]), o = rnd(1, 6); return { zin: `Je gooit ${n} keer met een dobbelsteen en noteert de uitkomsten in volgorde.`, b: 6, n, g: 1, w: `je gooit minstens één keer een ${o}`, zonder: `zonder ${o}`, eenh: 'uitkomsten' }; },
    () => { const n = kies([3, 4]); return { zin: `Een pincode bestaat uit ${n} cijfers (0 tot en met 9).`, b: 10, n, g: 5, w: 'de code bevat minstens één even cijfer (0, 2, 4, 6 of 8)', zonder: 'enkel oneven cijfers', eenh: 'pincodes' }; },
    () => { const n = 3; return { zin: `Je maakt een code van ${n} letters met de letters A, B, C, D en E (een letter mag meer keren voorkomen).`, b: 5, n, g: 2, w: 'de code bevat minstens één klinker (A of E)', zonder: 'zonder klinker', eenh: 'codes' }; },
    () => { const n = kies([3, 4]); return { zin: `Je beantwoordt ${n} meerkeuzevragen, elk met de antwoorden a, b, c en d.`, b: 4, n, g: 1, w: 'je kiest minstens één keer antwoord a', zonder: 'nooit a', eenh: 'manieren' }; },
    () => { const n = kies([2, 3]); return { zin: `Je draait ${n} keer aan een rad met 8 gelijke vakken, genummerd van 1 tot en met 8.`, b: 8, n, g: 1, w: 'je draait minstens één keer een 8', zonder: 'zonder 8', eenh: 'uitkomsten' }; },
  ])();
}
const D5 = {
  nr: 5, titel: 'De complementregel', kort: 'Tel wat je niet wil en trek dat af van het totaal.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Complementregel</div>
      <p class="midden">$\\#\\overline{A} = \\#U - \\#A$</p>
      <p>Tel wat je <b>niet</b> wil, en trek dat af van het totaal. Handig bij <b>niet</b>, <b>geen</b> en <b>minstens één</b>.</p></div>
    <div class="kader eig"><div class="kader-titel">Minstens één 7</div>
      <p>Hoeveel pincodes van 4 cijfers bevatten minstens één 7?</p>
      <ul><li>alle pincodes: $10 \\cdot 10 \\cdot 10 \\cdot 10 = 10\\,000$</li><li>zonder 7: $9 \\cdot 9 \\cdot 9 \\cdot 9 = 6561$</li><li>minstens één 7: $10\\,000 - 6561 = 3439$</li></ul>
      <p class="klein">"Minstens één 7" rechtstreeks tellen is veel werk (één 7, twee 7's, drie …). Het omgekeerde, "geen enkele 7", is gemakkelijk.</p></div>`,
  voorbeelden: [
    { tex: '\\text{In een klas van 24 leerlingen hebben er 5 geen huisdier. Hoeveel wel?}', stappen: ['24 - 5 = 19'] },
    { tex: '\\text{Je gooit 2 keer met een dobbelsteen. Bij hoeveel uitkomsten gooi je minstens één 1?}', stappen: ['\\text{alle uitkomsten: } 6 \\cdot 6 = 36', '\\text{zonder 1: } 5 \\cdot 5 = 25', '\\text{minstens één 1: } 36 - 25 = 11'] },
    { tex: '\\text{Code van 3 letters met A, B en C. Hoeveel codes zijn niet allemaal dezelfde letter?}', stappen: ['\\text{alle codes: } 3 \\cdot 3 \\cdot 3 = 27', '\\text{allemaal dezelfde: AAA, BBB, CCC} \\rightarrow 3', '27 - 3 = 24'] },
  ],
  soorten: {
    niet: { naam: 'Niet en geen', gen() {
      const N = rnd(18, 32), k = rnd(2, 12);
      const S = kies([
        [`In een klas van ${N} leerlingen hebben er ${k} geen gsm.`, 'Hoeveel leerlingen hebben er wel een?'], [`Van de ${N} deelnemers aan een loopwedstrijd haalden er ${k} de finish niet.`, 'Hoeveel deelnemers haalden de finish wel?'],
        [`Van de ${N} appels in een kist zijn er ${k} rot.`, 'Hoeveel appels zijn niet rot?'], [`Een bus vervoert ${N} reizigers. ${k} reizigers hebben geen abonnement.`, 'Hoeveel reizigers hebben wel een abonnement?'],
        [`Van de ${N} examenvragen kon Hanne er ${k} niet oplossen.`, 'Hoeveel vragen kon ze wel oplossen?'],
      ]);
      return { soort: 'niet', opdracht: S[1], html: opgave(S[0]), sleutel: S[0], rapport: S[0], antw: aantal(N - k), uitleg: ['\\text{totaal − wat je niet wil}', `${N} - ${k} = ${N - k}`] };
    } },
    minstens: { naam: 'Minstens één', gen() {
      const C = minstensCtx(), tot = C.b ** C.n, z = (C.b - C.g) ** C.n;
      return { soort: 'minstens', opdracht: `Bij hoeveel ${C.eenh} geldt: ${C.w}?`, html: opgave(C.zin), sleutel: C.zin + C.w, rapport: `${C.zin} ${C.w}`, antw: aantal(tot - z),
        uitleg: [`\\text{alle ${C.eenh}: } ${Array(C.n).fill(C.b).join(' \\cdot ')} = ${tgd(tot)}`, `\\text{${C.zonder}: } ${Array(C.n).fill(C.b - C.g).join(' \\cdot ')} = ${tgd(z)}`, `${tgd(tot)} - ${tgd(z)} = ${tgd(tot - z)}`] };
    } },
    stappen: { naam: 'Alle, zonder en minstens één', gen() {
      const C = minstensCtx(), tot = C.b ** C.n, z = (C.b - C.g) ** C.n;
      return { soort: 'stappen', opdracht: 'Werk in drie stappen.', html: opgave(C.zin), sleutel: C.zin + C.w + 's', rapport: `${C.zin} (3 stappen)`,
        antw: delen([`\\text{a) aantal ${C.eenh} in totaal:}`, aantal(tot)], [`\\text{b) aantal ${C.eenh} ${C.zonder}:}`, aantal(z)], [`\\text{c) ${C.w}:}`, aantal(tot - z)]),
        uitleg: [`${Array(C.n).fill(C.b).join(' \\cdot ')} = ${tgd(tot)}`, `${Array(C.n).fill(C.b - C.g).join(' \\cdot ')} = ${tgd(z)}`, `${tgd(tot)} - ${tgd(z)} = ${tgd(tot - z)}`] };
    } },
    verschillend: { naam: 'Niet allemaal hetzelfde', gen() {
      const C = kies([
        () => { const k = rnd(3, 5), n = kies([3, 4]), L = 'ABCDE'.slice(0, k).split(''); return { zin: `Je maakt een code van ${n} letters met de letters ${L.join(', ')}. Een letter mag meer keren voorkomen.`, b: k, n, ex: L.map(l => l.repeat(n)).join(', '), w: 'codes bevatten minstens 2 verschillende letters' }; },
        () => { const n = kies([2, 3]); return { zin: `Je gooit ${n} keer met een dobbelsteen en noteert de uitkomsten in volgorde.`, b: 6, n, ex: [1, 2, 3, 4, 5, 6].map(x => String(x).repeat(n)).join(', '), w: 'uitkomsten zijn niet allemaal gelijk' }; },
        () => { const n = kies([3, 4]); return { zin: `Een lampje kan rood (R), groen (G) of blauw (B) flitsen. Een signaal bestaat uit ${n} flitsen na elkaar.`, b: 3, n, ex: ['R', 'G', 'B'].map(x => x.repeat(n)).join(', '), w: 'signalen gebruiken minstens 2 kleuren' }; },
      ])();
      const tot = C.b ** C.n;
      return { soort: 'verschillend', opdracht: `Hoeveel ${C.w}?`, html: opgave(C.zin), sleutel: C.zin, rapport: C.zin, antw: aantal(tot - C.b),
        uitleg: [`\\text{alle: } ${Array(C.n).fill(C.b).join(' \\cdot ')} = ${tot}`, `\\text{allemaal hetzelfde: ${C.ex}} \\rightarrow ${C.b}`, `${tot} - ${C.b} = ${tot - C.b}`] };
    } },
  },
  oefenMix: [['niet', 1], ['minstens', 2], ['stappen', 1], ['verschillend', 1]],
  test: [['niet', 2], ['stappen', 2], ['minstens', 4], ['verschillend', 2]], testSchudden: true,
};

// ---- 6. Welke regel? ----------------------------------------------------------------------------
const REGELS = ['productregel', 'somregel', 'venndiagram', 'complementregel', 'boomdiagram'];
const D6 = {
  nr: 6, titel: 'Welke regel? (alles samen)', kort: 'Lees goed: EN, OF, overlap, niet/minstens één, afhankelijke keuzes.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Welke regel?</div>
      <div class="tabelwrap"><table class="tabel"><tr><th>Je leest …</th><th>Regel</th><th>Je doet …</th></tr>
      <tr><td>na elkaar kiezen, <b>EN</b></td><td>productregel</td><td>vermenigvuldigen</td></tr>
      <tr><td>het ene <b>OF</b> het andere</td><td>somregel</td><td>optellen</td></tr>
      <tr><td>groepen die <b>overlappen</b></td><td>venndiagram</td><td>$\\#A + \\#B - \\#(A \\cap B)$</td></tr>
      <tr><td><b>niet</b>, <b>geen</b>, <b>minstens één</b></td><td>complementregel</td><td>totaal − wat je niet wil</td></tr>
      <tr><td>keuzes <b>hangen van elkaar af</b></td><td>boomdiagram</td><td>paden tekenen en tellen</td></tr></table></div></div>
    <div class="kader"><div class="kader-titel">Dit deel</div><p>Hier komt alles van telproblemen door elkaar. Zoek eerst welke regel past en reken dan.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Uit 6 vrienden kies je een kapitein en een vice-kapitein.}', stappen: ['\\text{na elkaar kiezen: productregel}', '6 \\cdot 5 = 30'] },
    { tex: '\\text{Je kiest één drankje: een van de 5 frisdranken of een van de 3 sappen.}', stappen: ['\\text{het ene OF het andere: somregel}', '5 + 3 = 8'] },
  ],
  soorten: {
    welke: { naam: 'Welke regel past?', gen() {
      const a = rnd(3, 8), b = rnd(2, 6), N = rnd(20, 30), k = rnd(3, 9);
      const S = kies([
        [`Je kiest één hoofdgerecht: een van de ${a} pastagerechten of een van de ${b} wokgerechten.`, 1, a + b, `${a} + ${b} = ${a + b}`],
        [`Je kiest een pasta (${a} soorten) en een saus (${b} soorten).`, 0, a * b, `${a} \\cdot ${b} = ${a * b}`],
        [`Uit ${a + 2} kandidaten kies je een voorzitter en een penningmeester (niet dezelfde persoon).`, 0, (a + 2) * (a + 1), `${a + 2} \\cdot ${a + 1} = ${(a + 2) * (a + 1)}`],
        [`In een klas van ${N} leerlingen sporten er ${k} niet. Hoeveel sporten er wel?`, 3, N - k, `${N} - ${k} = ${N - k}`],
        [`Je gooit 2 keer met een dobbelsteen. Bij hoeveel uitkomsten gooi je minstens één 5?`, 3, 11, '36 - 25 = 11'],
        [`Van ${N} leerlingen spelen er ${k + 6} voetbal en ${k + 3} basket. ${k} spelen allebei. Hoeveel spelen minstens één van beide?`, 2, 9 + k, `${k + 6} + ${k + 3} - ${k} = ${k + 9}`],
        ['Je neemt 2 knikkers uit een zakje met 2 rode en 1 blauwe knikker, zonder terugleggen. Hoeveel kleurvolgordes zijn er?', 4, 3, '\\text{RR, RB, BR} \\rightarrow 3'],
        ['Wie eerst 2 sets wint, wint de match. Hoeveel verlopen kan de match hebben?', 4, 6, '\\text{6 paden in de boom}'],
      ]);
      return { soort: 'welke', opdracht: 'Welke regel gebruik je? Bereken het aantal.', html: opgave(S[0]), sleutel: S[0], rapport: S[0],
        antw: delen(['\\text{regel:}', keuze(kT(REGELS), S[1])], ['\\text{aantal:}', aantal(S[2])]), uitleg: [`\\text{${REGELS[S[1]]}}`, S[3]] };
    } },
    bm: mix(D1, 'zakje'), mu: mix(D1, 'munt'), cd: mix(D2, 'code'), rg: mix(D2, 'rangschik'), rt: mix(D3, 'routes'), cb: mix(D3, 'combi'), vn: mix(D4, 'context'), v3: mix(D4, 'drie'), mi: mix(D5, 'minstens'),
  },
  oefenMix: [['welke', 3], ['bm', 1], ['mu', 1], ['cd', 1], ['rg', 1], ['rt', 1], ['cb', 1], ['vn', 1], ['v3', 1], ['mi', 1]],
  test: [['welke', 3], ['bm', 1], ['cd', 1], ['rg', 1], ['rt', 1], ['vn', 1], ['v3', 1], ['mi', 1]], testSchudden: true,
};
// ===================================================================
//  B · KANSEN BEPALEN (delen 7–11) en C · EINDTEST (deel 12)
// ===================================================================
const setTex = (arr) => arr.length ? `\\{${arr.join(', ')}\\}` : '\\varnothing';
const reeks = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// gebeurtenissen bij kaartjes 1..n (of een dobbelsteen: n = 6)
function gebeurtenis(n) {
  const U = reeks(1, n), m = rnd(2, n - 1), k = kies([2, 3, 4, 5].filter(x => x < n));
  return kies([
    { w: 'een even getal', f: (x) => x % 2 === 0, comp: 'een oneven getal' },
    { w: 'een oneven getal', f: (x) => x % 2 === 1, comp: 'een even getal' },
    { w: `een veelvoud van ${k}`, f: (x) => x % k === 0, comp: `geen veelvoud van ${k}` },
    { w: `een getal groter dan ${m}`, f: (x) => x > m, comp: `een getal kleiner dan of gelijk aan ${m}` },
    { w: `een getal kleiner dan ${m}`, f: (x) => x < m, comp: `een getal groter dan of gelijk aan ${m}` },
    { w: `minstens ${m}`, f: (x) => x >= m, comp: `minder dan ${m}` },
    { w: `hoogstens ${m}`, f: (x) => x <= m, comp: `meer dan ${m}` },
  ]);
}
function kaartjesCtx() {
  return kies([
    () => { const n = rnd(8, 15); return { n, zin: `Je trekt blind één kaartje uit ${n} kaartjes met de getallen 1 tot en met ${n}.`, kort: `kaartjes 1–${n}` }; },
    () => ({ n: 6, zin: 'Je gooit één keer met een (eerlijke) dobbelsteen.', kort: 'dobbelsteen' }),
    () => { const n = kies([8, 10, 12]); return { n, zin: `Je draait één keer aan een rad met ${n} gelijke vakken, genummerd van 1 tot en met ${n}.`, kort: `rad 1–${n}` }; },
    () => { const n = rnd(20, 30); return { n, zin: `In een klas krijgt elke leerling een nummer van 1 tot en met ${n}. De leerkracht duidt blind één nummer aan.`, kort: `nummers 1–${n}` }; },
  ])();
}

// ---- 7. Kansexperiment en kansschaal --------------------------------------------------------
const EXPERIMENTEN = [
  ['Je gooit met een dobbelsteen.', true], ['Je trekt blind een kaart uit een kaartspel.', true], ['Je draait aan het rad op de kermis.', true],
  ['Je gooit een muntstuk op.', true], ['Bij de lotto worden 6 balletjes getrokken.', true], ['Je trekt blind een knikker uit een zakje.', true],
  ['Je laat een steen los: valt hij naar beneden?', false], ['Je berekent 25 · 4 op je rekenmachine.', false], ['Je kijkt hoeveel dagen de maand juni telt.', false],
  ['Je meet hoe lang een blad A4 is.', false], ['Je weegt 1 liter water.', false], ['Je telt hoeveel letters het woord KANS heeft.', false],
];
const KANSWOORD = ['onmogelijk', 'weinig kans', 'even veel kans', 'veel kans', 'zeker'];
const D7 = {
  nr: 7, titel: 'Kansexperiment en kansschaal', kort: 'Uitkomstenverzameling, gebeurtenis, zeker, onmogelijk en complement.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Begrippen</div>
      <ul><li><b>Kansexperiment</b>: de uitkomst is niet te voorspellen, de mogelijke uitkomsten ken je wel.</li>
      <li><b>Uitkomstenverzameling</b> $U$: alle mogelijke uitkomsten.</li><li><b>Gebeurtenis</b> $A$: een deel van $U$.</li>
      <li><b>Zeker</b>: $U$ zelf. &nbsp; <b>Onmogelijk</b>: $\\varnothing$.</li><li><b>Complement</b> $\\overline{A}$: "niet $A$", alle uitkomsten van $U$ die niet in $A$ zitten.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Eén keer met een dobbelsteen</div>
      <div class="tabelwrap"><table class="tabel"><tr><th>$U$</th><td>$\\{1, 2, 3, 4, 5, 6\\}$</td></tr><tr><th>$A$ = even</th><td>$\\{2, 4, 6\\}$</td></tr>
      <tr><th>$\\overline{A}$ = niet even</th><td>$\\{1, 3, 5\\}$</td></tr><tr><th>$B$ = meer dan 6</th><td>$\\varnothing$ &nbsp; onmogelijk</td></tr><tr><th>$C$ = minder dan 7</th><td>$U$ &nbsp; zeker</td></tr></table></div></div>
    <div class="kader def"><div class="kader-titel">De kansschaal</div>
      ${kansschaal()}<p>Een kans ligt altijd tussen 0 en 1 (of tussen 0 % en 100 %).</p></div>`,
  voorbeelden: [
    { tex: '\\text{Kaartjes 1 tot en met 10. } A = \\text{"een veelvoud van 3". Geef } A \\text{ en } \\overline{A}.', stappen: ['A = \\{3, 6, 9\\}', '\\overline{A} = \\{1, 2, 4, 5, 7, 8, 10\\}'] },
    { tex: '\\text{Dobbelsteen: waar op de kansschaal ligt "je gooit niet een 6"?}', stappen: ['\\text{5 van de 6 uitkomsten zijn goed}', '\\text{veel kans (dicht bij 1)}'] },
  ],
  soorten: {
    experiment: { naam: 'Kansexperiment of niet?', gen() {
      const [s, ok] = kies(EXPERIMENTEN);
      return { soort: 'experiment', opdracht: 'Is dit een kansexperiment?', html: opgave(s), sleutel: s, rapport: s, antw: keuze(kT(['ja, een kansexperiment', 'nee, de uitkomst ligt vast']), ok ? 0 : 1),
        uitleg: [ok ? '\\text{je kent de mogelijke uitkomsten, maar je kan niet voorspellen welke het wordt}' : '\\text{de uitkomst kan je op voorhand weten: geen kansexperiment}'] };
    } },
    U: { naam: 'De uitkomstenverzameling', gen() {
      const C = kies([
        () => { const n = rnd(5, 9); return { zin: `Je trekt blind één kaartje uit ${n} kaartjes met de getallen 1 tot en met ${n}.`, U: reeks(1, n), fout: [reeks(0, n), reeks(1, n - 1), reeks(2, n)] }; },
        () => ({ zin: 'Je gooit één keer met een dobbelsteen.', U: reeks(1, 6), fout: [reeks(0, 6), reeks(1, 5), [6]] }),
        () => ({ zin: 'Je gooit één keer met een muntstuk: kop (K) of munt (M).', U: ['K', 'M'], fout: [['K'], ['K', 'K', 'M', 'M'], ['KM']] }),
        () => ({ zin: 'Je gooit 2 keer met een muntstuk en noteert kop (K) of munt (M) in volgorde.', U: ['KK', 'KM', 'MK', 'MM'], fout: [['K', 'M'], ['KK', 'KM', 'MM'], ['KK', 'MM']] }),
        () => { const w = kies(['RAD', 'KANS', 'DOEL', 'MUNT']); return { zin: `Je kiest blind één letter uit het woord ${w}.`, U: w.split(''), fout: [w.split('').slice(1), [w], w.split('').concat(['E'])] }; },
        () => ({ zin: 'Je draait aan een rad met een rood, een blauw en een groen vak (R, B, G).', U: ['R', 'B', 'G'], fout: [['R', 'B'], ['RB', 'BG', 'RG'], ['R', 'B', 'G', 'RB']] }),
      ])();
      if (kies([true, false])) return { soort: 'U', opdracht: 'Wat is de uitkomstenverzameling U?', html: opgave(C.zin), sleutel: C.zin, rapport: C.zin,
        antw: uniekKeuze(`U = ${setTex(C.U)}`, C.fout.map(f => `U = ${setTex(f)}`)), uitleg: [`\\text{alle mogelijke uitkomsten: } U = ${setTex(C.U)}`] };
      return { soort: 'U', opdracht: 'Hoeveel elementen heeft U?', html: opgave(C.zin), sleutel: C.zin + '#', rapport: C.zin + ' (#U)', antw: aantal(C.U.length, '\\#U ='), uitleg: [`U = ${setTex(C.U)}`, `\\#U = ${C.U.length}`] };
    } },
    gebeurtenis: { naam: 'Een gebeurtenis als verzameling', gen() {
      const C = kaartjesCtx(); if (C.n > 15) return this.gen();
      const G = gebeurtenis(C.n), U = reeks(1, C.n), A = U.filter(G.f); if (!A.length || A.length === U.length) return this.gen();
      const fout = [U.filter(x => !G.f(x)), A.slice(0, -1), A.length > 1 ? A.slice(1) : U, U.filter(x => G.f(x - 1) && x > 1), U.filter(x => G.f(x + 1))].filter(f => f.length);
      return { soort: 'gebeurtenis', opdracht: `Welke verzameling hoort bij de gebeurtenis A = "${G.w}"?`, html: opgave(C.zin), sleutel: C.zin + G.w, rapport: `${C.kort}: ${G.w}`,
        antw: uniekKeuze(`A = ${setTex(A)}`, fout.map(f => `A = ${setTex(f)}`)), uitleg: [`U = ${setTex(U)}`, `A = ${setTex(A)}`] };
    } },
    zeker: { naam: 'Zeker of onmogelijk?', gen() {
      const C = kaartjesCtx(), v = kies([0, 1, 2, 2]);
      const w = v === 0 ? kies([`een getal groter dan ${C.n}`, 'het getal 0', `een getal groter dan ${C.n + rnd(1, 5)}`, 'een negatief getal'])
        : v === 1 ? kies([`een getal kleiner dan ${C.n + 1}`, `hoogstens ${C.n}`, 'een getal groter dan 0', `minstens 1`]) : gebeurtenis(C.n).w;
      return { soort: 'zeker', opdracht: `Gebeurtenis: "${w}". Is die zeker, onmogelijk of geen van beide?`, html: opgave(C.zin), sleutel: C.zin + w, rapport: `${C.kort}: ${w}`,
        antw: keuze(kT(['onmogelijk (∅)', 'zeker (U)', 'geen van beide']), v),
        uitleg: [v === 0 ? '\\text{geen enkele uitkomst past: } A = \\varnothing' : v === 1 ? '\\text{alle uitkomsten passen: } A = U' : '\\text{sommige uitkomsten passen, andere niet}'] };
    } },
    complement: { naam: 'Het complement', gen() {
      const C = kaartjesCtx(); if (C.n > 15) return this.gen();
      const G = gebeurtenis(C.n), U = reeks(1, C.n), A = U.filter(G.f), Ac = U.filter(x => !G.f(x)); if (!A.length || !Ac.length) return this.gen();
      if (kies([true, false])) return { soort: 'complement', opdracht: `A = "${G.w}". Wat is het complement Ā?`, html: opgave(C.zin), sleutel: C.zin + G.w, rapport: `${C.kort}: complement van ${G.w}`,
        antw: uniekKeuze(`\\overline{A} = ${setTex(Ac)}`, [`\\overline{A} = ${setTex(A)}`, `\\overline{A} = ${setTex(Ac.slice(1))}`, `\\overline{A} = ${setTex(Ac.concat(A.slice(0, 1)).sort((a, b) => a - b))}`, `\\overline{A} = \\varnothing`]),
        uitleg: [`A = ${setTex(A)}`, `\\overline{A} = \\text{alles van } U \\text{ wat niet in } A \\text{ zit} = ${setTex(Ac)}`] };
      const fout = kies([['een oneven getal', 'een even getal'], ['een veelvoud van 3'], ['een getal kleiner dan 3', 'een getal groter dan 3']]);
      return { soort: 'complement', opdracht: `A = "${G.w}". Hoe zeg je Ā in woorden?`, html: opgave(C.zin), sleutel: C.zin + G.w + 'w', rapport: `${C.kort}: Ā in woorden (${G.w})`,
        antw: zinKeuze(`Ā = "${G.comp}"`, [`Ā = "${G.w}"`, ...fout.filter(f => f !== G.comp).map(f => `Ā = "${f}"`), 'Ā = "geen enkel getal"']), uitleg: [`\\overline{A} = \\text{"niet } A \\text{"} = \\text{"${G.comp}"}`] };
    } },
    schaal: { naam: 'Op de kansschaal', gen() {
      const C = kaartjesCtx(), U = reeks(1, C.n);
      let w, idx, deel;
      const v = kies([0, 1, 2, 3, 4]);
      if (v === 0) { w = `een getal groter dan ${C.n}`; idx = 0; deel = 0; }
      else if (v === 4) { w = `hoogstens ${C.n}`; idx = 4; deel = C.n; }
      else {
        const G = (() => { for (let i = 0; i < 50; i++) { const g = gebeurtenis(C.n), a = U.filter(g.f).length; const r = a / C.n; if (v === 1 && a > 0 && r <= 0.3) return g; if (v === 2 && r === 0.5) return g; if (v === 3 && r >= 0.7 && a < C.n) return g; } return null; })();
        if (!G) return this.gen();
        w = G.w; idx = v; deel = U.filter(G.f).length;
      }
      return { soort: 'schaal', opdracht: `Waar ligt de gebeurtenis "${w}" op de kansschaal?`, html: opgave(C.zin) + kansschaal(), sleutel: C.zin + w, rapport: `${C.kort}: ${w} op kansschaal`,
        antw: keuze(kT(KANSWOORD), idx), uitleg: [`\\text{${deel} van de ${C.n} uitkomsten passen}`, `\\text{${KANSWOORD[idx]}}`] };
    } },
  },
  oefenMix: [['experiment', 1], ['U', 2], ['gebeurtenis', 2], ['zeker', 1], ['complement', 2], ['schaal', 1]],
  test: [['experiment', 1], ['U', 2], ['gebeurtenis', 2], ['zeker', 2], ['complement', 2], ['schaal', 1]], testSchudden: true,
};

// ---- 8. Relatieve frequentie en kans ---------------------------------------------------------------
const PROEVEN = [
  { t: 'Bram gooit een kroonkurk en noteert hoe vaak die met de opening naar boven valt.', u: 'opening boven', p: [0.35, 0.45], wat: 'worpen' },
  { t: 'Yasmine gooit een plastic bekertje en telt hoe vaak het op zijn zijkant landt.', u: 'op de zijkant', p: [0.6, 0.75], wat: 'worpen' },
  { t: 'Een basketter neemt vrije worpen en telt hoeveel er raak zijn.', u: 'raak', p: [0.65, 0.8], wat: 'vrije worpen' },
  { t: 'Een buurtbewoner noteert elke dag of de bus van 7.42 u. te laat is.', u: 'te laat', p: [0.15, 0.3], wat: 'dagen' },
  { t: 'Niels gooit een lucifersdoosje en noteert hoe vaak het op de smalle kant blijft staan.', u: 'op de smalle kant', p: [0.08, 0.2], wat: 'worpen' },
  { t: 'Lotte laat een boterham van tafel vallen en telt hoe vaak die met de choco naar onder landt.', u: 'choco onder', p: [0.55, 0.7], wat: 'keer' },
];
function proefTabel() {
  const P = kies(PROEVEN), p = Math.round((P.p[0] + Math.random() * (P.p[1] - P.p[0])) * 100) / 100, ns = kies([[20, 50, 100, 200, 500], [10, 50, 100, 500, 1000], [25, 50, 100, 250, 500]]);
  let tel = 0, gedaan = 0; const ks = [];
  for (const n of ns) { while (gedaan < n) { if (Math.random() < p) tel++; gedaan++; } ks.push(tel); }
  return { P, p, ns, ks, rf: ns.map((n, i) => ks[i] / n) };
}
const rfTabelHTML = (T, toon = null) => htmlTabel([[`aantal ${T.P.wat}`, ...T.ns], [`aantal keer ${T.P.u}`, ...T.ks], ['relatieve frequentie', ...T.rf.map((r, i) => toon && toon(i) ? tekst(W.komma(r, 3)) : '')]]);
const D8 = {
  nr: 8, titel: 'Relatieve frequentie en kans', kort: 'Hoe vaker je het experiment herhaalt, hoe beter de relatieve frequentie de kans benadert.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Relatieve frequentie</div>
      <p class="midden">$\\text{relatieve frequentie} = \\dfrac{\\text{aantal keer dat } A \\text{ gebeurt}}{\\text{aantal keer dat je het experiment uitvoert}}$</p>
      <p class="klein">Rond af op 3 decimalen als het niet exact uitkomt.</p></div>
    <div class="kader eig"><div class="kader-titel">We gooien heel vaak met een dobbelsteen</div>
      ${htmlTabel([['aantal worpen', 10, 50, 100, 500, 1000, 5000], ['aantal keer 6', 3, 5, 19, 80, 171, 838], ['rel. frequentie', '0,3', '0,1', '0,19', '0,16', '0,171', '0,168']])}
      <p>Hoe meer worpen, hoe meer de relatieve frequentie <b>stabiliseert</b>.</p></div>
    <div class="kader def"><div class="kader-titel">Van relatieve frequentie naar kans</div>
      <p>Herhaal je een experiment heel vaak, dan stabiliseert de relatieve frequentie rond een vast getal: de <b>kans</b> $P(A)$.</p>
      <ul><li>Een <b>schatting</b> van de kans: neem de relatieve frequentie bij het <b>grootste</b> aantal herhalingen.</li>
      <li><b>Verwacht aantal</b>: kans · aantal keer. Kans 0,6 en 1000 worpen: ongeveer $0{,}6 \\cdot 1000 = 600$ keer.</li>
      <li>Weinig herhalingen? Dan schommelt de relatieve frequentie nog sterk: je kan er geen besluit uit trekken.</li></ul></div>`,
  voorbeelden: [
    { tex: '\\text{60 worpen, 14 keer een 6. Relatieve frequentie van een 6?}', stappen: ['\\frac{14}{60} \\approx 0{,}233'] },
    { tex: '\\text{De kans dat een punaise met de punt omhoog valt, is ongeveer } 0{,}6. \\text{ Hoe vaak verwacht je dat bij 250 worpen?}', stappen: ['0{,}6 \\cdot 250 = 150 \\text{ keer}'] },
  ],
  soorten: {
    rf: { naam: 'Relatieve frequentie berekenen', gen() {
      const T = proefTabel(), i = rnd(0, T.ns.length - 1), r = T.rf[i];
      if (W.grensgeval(r, 3)) return this.gen();
      return { soort: 'rf', opdracht: `Bereken de relatieve frequentie van "${T.P.u}" na ${T.ns[i]} ${T.P.wat}.`, html: opgave(T.P.t) + rfTabelHTML(T), sleutel: T.P.t + T.ks.join() + i, rapport: `${T.P.u}: ${T.ks[i]} op ${T.ns[i]}`,
        antw: getal(r, { dec: 3, voor: '\\text{rel. frequentie} =' }), uitleg: [`\\frac{${T.ks[i]}}{${T.ns[i]}} ${Math.abs(W.rond(r, 3) - r) < 1e-12 ? '=' : '\\approx'} ${tg(W.rond(r, 3))}`] };
    } },
    schat: { naam: 'De kans schatten', gen() {
      const T = proefTabel(), last = T.rf[T.rf.length - 1], j = W.rond(last, 2);
      const fout = [W.rond(T.rf[0], 2), W.rond(1 - last, 2), 0.5, W.rond(T.ks[T.ks.length - 1] / T.ns[0] / 10, 2)].filter(x => Math.abs(x - j) > 0.015);
      return { soort: 'schat', opdracht: `Wat is de beste schatting van de kans op "${T.P.u}"?`, html: opgave(T.P.t) + rfTabelHTML(T, () => true), sleutel: T.P.t + T.ks.join() + 's', rapport: `${T.P.u}: kans schatten`,
        antw: uniekKeuze(`\\text{ongeveer } ${tg(j)}`, fout.map(f => `\\text{ongeveer } ${tg(f)}`)), uitleg: ['\\text{neem de relatieve frequentie bij het grootste aantal herhalingen}', `\\frac{${T.ks[T.ks.length - 1]}}{${T.ns[T.ns.length - 1]}} \\approx ${tg(j)}`] };
    } },
    verwacht: { naam: 'Verwacht aantal', gen() {
      const P = kies(PROEVEN), p = kies([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6, 0.65, 0.7, 0.75, 0.8]), N = kies([200, 400, 500, 1000, 1500, 2000, 3000]);
      const zin = `${P.t} Na heel veel ${P.wat} blijkt de kans op "${P.u}" ongeveer ${tekst(p)} te zijn.`;
      return { soort: 'verwacht', opdracht: `Hoeveel keer "${P.u}" verwacht je ongeveer bij ${duiz(N)} ${P.wat}?`, html: opgave(zin), sleutel: zin + N, rapport: `${P.u}: verwacht bij ${N}`,
        antw: aantal(W.rond(p * N, 6), '\\text{ongeveer}'), uitleg: [`${tg(p)} \\cdot ${tgd(N)} = ${tgd(W.rond(p * N, 6))}`] };
    } },
    waarom: { naam: 'Kritisch kijken', gen() {
      if (kies([true, false])) {
        const P = kies(PROEVEN);
        return { soort: 'waarom', opdracht: `Waarom kan je de kans op "${P.u}" niet zomaar berekenen (met de wet van Laplace)?`, html: opgave(P.t), sleutel: P.t, rapport: `${P.u}: waarom niet berekenen`,
          antw: zinKeuze('De mogelijke uitkomsten zijn niet even waarschijnlijk: je moet de kans schatten met een relatieve frequentie.', ['Er zijn te veel mogelijke uitkomsten.', 'Er zijn maar twee uitkomsten, dus is de kans altijd 1/2.', 'Een kans kan je enkel bij een dobbelsteen berekenen.']),
          uitleg: ['\\text{de uitkomsten zijn niet even waarschijnlijk}', '\\text{herhaal het experiment heel vaak en gebruik de relatieve frequentie}'] };
      }
      const N = kies([12, 18, 24, 30, 36]), o = rnd(1, 6), k = Math.round(N / 6) + kies([3, 4, 5, -3, -2]), nm = kies(['Wout', 'Ilse', 'Mehdi', 'Fien']);
      const zin = `${nm} gooit ${N} keer met een dobbelsteen en gooit ${k} keer een ${o}. ${nm} zegt: "Mijn dobbelsteen is vervalst, want de relatieve frequentie is ${tekst(W.komma(k / N, 3))} en dat zou ongeveer 0,167 moeten zijn."`;
      return { soort: 'waarom', opdracht: `Heeft ${nm} gelijk?`, html: opgave(zin), sleutel: zin, rapport: `vervalste dobbelsteen? ${k} op ${N}`,
        antw: zinKeuze(`Niet zeker: ${N} worpen is te weinig, de relatieve frequentie schommelt dan nog sterk. ${nm} moet veel vaker gooien.`, ['Ja: de relatieve frequentie is niet gelijk aan 0,167, dus de dobbelsteen is vervalst.', 'Nee: een dobbelsteen kan nooit vervalst zijn.', `Ja: na ${N} worpen moet elk getal precies ${N / 6} keer gevallen zijn.`]),
        uitleg: ['\\text{bij weinig worpen schommelt de relatieve frequentie nog sterk}', '\\text{pas na heel veel worpen stabiliseert ze rond de kans}'] };
    } },
  },
  oefenMix: [['rf', 2], ['schat', 1], ['verwacht', 1], ['waarom', 1]],
  test: [['rf', 3], ['schat', 2], ['verwacht', 3], ['waarom', 2]], testSchudden: true,
};

// ---- 9. De wet van Laplace --------------------------------------------------------------------
const KN = { r: ['rode', 'rood'], b: ['blauwe', 'blauw'], g: ['groene', 'groen'], w: ['witte', 'wit'], z: ['zwarte', 'zwart'], ge: ['gele', 'geel'] };
const KAARTVRAGEN = [
  ['een harten', 13, '\\text{13 harten}'], ['een aas', 4, '\\text{4 azen}'], ['de harten aas', 1, '\\text{1 harten aas}'], ['een rode kaart (harten of ruiten)', 26, '13 + 13 = 26'],
  ['een prentkaart (boer, dame of heer)', 12, '4 \\cdot 3 = 12'], ['geen schoppen', 39, '52 - 13 = 39'], ['een harten of een aas', 16, '13 + 4 - 1 = 16 \\text{ (de harten aas maar één keer tellen)}'],
  ['een rode kaart of een aas', 28, '26 + 4 - 2 = 28 \\text{ (de twee rode azen maar één keer tellen)}'], ['een klaveren heer', 1, '\\text{1 klaveren heer}'], ['een zwarte prentkaart', 6, '2 \\cdot 3 = 6'],
  ['geen aas', 48, '52 - 4 = 48'], ['een 7 of een 8', 8, '4 + 4 = 8'],
];
const D9 = {
  nr: 9, titel: 'De wet van Laplace', kort: 'P(A) = gunstige uitkomsten / mogelijke uitkomsten (alles even waarschijnlijk!).', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Wet van Laplace</div>
      <p class="midden">$P(A) = \\dfrac{\\text{aantal gunstige uitkomsten}}{\\text{aantal mogelijke uitkomsten}} = \\dfrac{\\#A}{\\#U}$</p>
      <p><b>Voorwaarde: alle uitkomsten zijn even waarschijnlijk!</b></p>
      <p class="midden">$0 \\le P(A) \\le 1 \\qquad P(U) = 1 \\qquad P(\\varnothing) = 0$</p>
      <p class="midden"><b>complementregel:</b> $P(\\overline{A}) = 1 - P(A)$</p>
      <p class="klein">Schrijf een kans als <b>vereenvoudigde breuk</b> (gebruik de breukknop). Een percentage enkel als het gevraagd wordt.</p></div>
    <div class="kader eig"><div class="kader-titel">Eén dobbelsteen</div>
      <p>$P(\\text{een 4}) = \\dfrac{1}{6}$ &nbsp;&nbsp; $P(\\text{even}) = \\dfrac{3}{6} = \\dfrac{1}{2}$ &nbsp;&nbsp; $P(\\text{niet een 6}) = 1 - \\dfrac{1}{6} = \\dfrac{5}{6}$ &nbsp;&nbsp; $P(\\text{een 8}) = 0$</p></div>
    <div class="kader"><div class="kader-titel">Is alles even waarschijnlijk?</div>
      ${rad([{ l: 'panda', g: 2, kl: '#d5dbdb' }, { l: 'leeuw', g: 1, kl: '#f9e79f' }, { l: 'aap', g: 1, kl: '#abebc6' }])}
      <p>Tom: "3 dieren, dus 1 kans op 3 voor de panda." <b>Nee</b>: de vakken zijn niet even groot. Verdeel het rad in 4 gelijke vakken: de panda heeft er 2, dus $P(\\text{panda}) = \\dfrac{2}{4} = \\dfrac{1}{2}$.</p></div>
    <div class="kader"><div class="kader-titel">Een kaartspel</div><p>52 kaarten: 4 kleuren (harten, ruiten, klaveren, schoppen) van elk 13 kaarten (aas, 2 tot en met 10, boer, dame, heer). Harten en ruiten zijn rood, klaveren en schoppen zwart.</p></div>`,
  voorbeelden: [
    { tex: '\\text{4 rode, 5 blauwe en 3 groene knikkers. } P(\\text{rood of groen})?', stappen: ['\\#U = 4 + 5 + 3 = 12', 'P(\\text{rood of groen}) = \\frac{4 + 3}{12} = \\frac{7}{12}'] },
    { tex: '\\text{Kaartspel: } P(\\text{harten of aas})?', stappen: ['13 + 4 - 1 = 16 \\text{ gunstige kaarten (harten aas maar één keer)}', 'P = \\frac{16}{52} = \\frac{4}{13}'] },
  ],
  soorten: {
    een: { naam: 'Kaartjes, dobbelsteen en rad', gen() {
      const C = kaartjesCtx(), U = reeks(1, C.n), v = kies(['geb', 'geb', 'niet', 'nul']);
      if (v === 'nul') { const w = kies([`een getal groter dan ${C.n}`, 'het getal 0']); return { soort: 'een', opdracht: `Bereken P("${w}").`, html: opgave(C.zin), sleutel: C.zin + w, rapport: `${C.kort}: ${w}`, antw: kans(0, 1, `${PT(w)} =`), uitleg: ['\\text{onmogelijke gebeurtenis: } P(\\varnothing) = 0'] }; }
      if (v === 'niet') { const k = rnd(1, C.n); return { soort: 'een', opdracht: `Bereken de kans op "niet ${k}".`, html: opgave(C.zin), sleutel: C.zin + 'niet' + k, rapport: `${C.kort}: niet ${k}`, antw: kans(C.n - 1, C.n, `${PT('niet ' + k)} =`), uitleg: [`P(\\text{niet } ${k}) = 1 - ${frR(1, C.n)} = ${frS(C.n - 1, C.n)}`] }; }
      const G = gebeurtenis(C.n), A = U.filter(G.f); if (!A.length || A.length === C.n) return this.gen();
      return { soort: 'een', opdracht: `Bereken de kans op "${G.w}".`, html: opgave(C.zin), sleutel: C.zin + G.w, rapport: `${C.kort}: ${G.w}`, antw: kans(A.length, C.n, `${PT(G.w)} =`),
        uitleg: [`A = ${setTex(A)} \\qquad \\#U = ${C.n}`, `P(A) = ${frS(A.length, C.n)}`] };
    } },
    knikkers: { naam: 'Knikkers in een zak', gen() {
      const kl = schud(['r', 'b', 'g', 'w', 'z']).slice(0, 3), n = kl.map(() => rnd(2, 9)), tot = n.reduce((a, b) => a + b, 0);
      const zin = `In een zak zitten ${n.map((x, i) => `${x} ${KN[kl[i]][0]}`).join(', ').replace(/, ([^,]*)$/, ' en $1')} knikkers. Je neemt blind één knikker.`;
      const v = kies(['kleur', 'niet', 'of', 'nul', 'erbij']), i = rnd(0, 2), j = (i + 1 + rnd(0, 1)) % 3;
      if (v === 'kleur') return { soort: 'knikkers', opdracht: `Bereken P(${KN[kl[i]][1]}).`, html: opgave(zin), sleutel: zin + v + i, rapport: `${zin} P(${KN[kl[i]][1]})`, antw: kans(n[i], tot, `${PT(KN[kl[i]][1])} =`), uitleg: [`\\#U = ${n.join(' + ')} = ${tot}`, `P = ${frS(n[i], tot)}`] };
      if (v === 'niet') return { soort: 'knikkers', opdracht: `Bereken P(niet ${KN[kl[i]][1]}).`, html: opgave(zin), sleutel: zin + v + i, rapport: `${zin} P(niet ${KN[kl[i]][1]})`, antw: kans(tot - n[i], tot, `${PT('niet ' + KN[kl[i]][1])} =`), uitleg: [`\\#U = ${tot}`, `P = 1 - ${frR(n[i], tot)} = ${frS(tot - n[i], tot)}`] };
      if (v === 'of') return { soort: 'knikkers', opdracht: `Bereken P(${KN[kl[i]][1]} of ${KN[kl[j]][1]}).`, html: opgave(zin), sleutel: zin + v + i + j, rapport: `${zin} P(${KN[kl[i]][1]} of ${KN[kl[j]][1]})`, antw: kans(n[i] + n[j], tot, `${PT(KN[kl[i]][1] + ' of ' + KN[kl[j]][1])} =`), uitleg: [`\\#U = ${tot}`, `P = \\frac{${n[i]} + ${n[j]}}{${tot}} = ${frS(n[i] + n[j], tot)}`] };
      if (v === 'nul') return { soort: 'knikkers', opdracht: 'Bereken P(geel).', html: opgave(zin), sleutel: zin + v, rapport: `${zin} P(geel)`, antw: kans(0, 1, `${PT('geel')} =`), uitleg: ['\\text{er zitten geen gele knikkers in de zak: onmogelijk}', 'P = 0'] };
      const x = rnd(2, 6);
      return { soort: 'knikkers', opdracht: `Je legt er nog ${x} gele knikkers bij. Hoe groot is nu de kans op ${KN[kl[i]][1]}?`, html: opgave(zin), sleutel: zin + v + i + x, rapport: `${zin} +${x} geel, P(${KN[kl[i]][1]})`, antw: kans(n[i], tot + x, `${PT(KN[kl[i]][1])} =`), uitleg: [`\\#U = ${tot} + ${x} = ${tot + x}`, `P = ${frS(n[i], tot + x)}`] };
    } },
    kaarten: { naam: 'Een kaartspel', gen() {
      const [w, g, u] = kies(KAARTVRAGEN);
      return { soort: 'kaarten', opdracht: `Je trekt één kaart uit een volledig kaartspel van 52 kaarten. Bereken de kans op ${w}.`, sleutel: w, rapport: `kaartspel: ${w}`, tex: '\\text{52 kaarten: harten, ruiten (rood), klaveren, schoppen (zwart); elk aas, 2–10, boer, dame, heer}',
        antw: kans(g, 52), uitleg: [`\\text{gunstig: } ${u}`, `P = ${frS(g, 52)}`] };
    } },
    rad: { naam: 'Een rad', gen() {
      const n = kies([6, 8, 8, 10, 12]), waarden = Array.from({ length: n }, () => rnd(1, 5));
      const vakken = waarden.map(x => ({ l: String(x), kl: RADKLEUR[x - 1] })), tel = (f) => waarden.filter(f).length;
      const v = kies(['getal', 'oneven', 'groter', 'nul']), k = kies(waarden), m = rnd(2, 4);
      const vr = { getal: [`P(${k})`, tel(x => x === k), `\\text{vakken met ${k}}`], oneven: ['P(oneven getal)', tel(x => x % 2), '\\text{vakken met 1, 3 of 5}'],
        groter: [`P(groter dan ${m})`, tel(x => x > m), `\\text{vakken met een getal groter dan ${m}}`], nul: ['P(6)', 0, '\\text{geen enkel vak met 6}'] }[v];
      return { soort: 'rad', opdracht: `Je draait één keer aan het rad. Alle vakken zijn even groot. Bereken ${vr[0]}.`, html: rad(vakken), sleutel: waarden.join() + v + k + m, rapport: `rad ${waarden.join(',')}: ${vr[0]}`,
        antw: kans(vr[1], n, `${vr[0].replace(/P\((.*)\)/, (mm, a) => `P(\\text{${a}})`)} =`), uitleg: [`\\#U = ${n} \\text{ gelijke vakken}`, `${vr[2]}: ${vr[1]}`, `P = ${frS(vr[1], n)}`] };
    } },
    ongelijk: { naam: 'Ongelijke vakken', gen() {
      const S = kies([[[2, 1, 1], 4], [[1, 1, 2], 4], [[3, 1], 4], [[2, 2, 1, 1], 6], [[4, 2, 2], 8], [[2, 1, 1, 4], 8], [[3, 3, 2], 8]]);
      const namen = schud(['ster', 'hart', 'maan', 'zon', 'boom']).slice(0, S[0].length), i = rnd(0, S[0].length - 1);
      const vakken = S[0].map((g, j) => ({ l: namen[j], g, kl: RADKLEUR[j] }));
      return { soort: 'ongelijk', opdracht: `De vakken van dit rad zijn niet even groot. Bereken P(${namen[i]}). Tip: verdeel het rad in ${S[1]} gelijke vakken.`, html: rad(vakken), sleutel: S[0].join() + i, rapport: `ongelijk rad ${S[0].join(',')}: ${namen[i]}`,
        antw: kans(S[0][i], S[1], `${PT(namen[i])} =`), uitleg: [`\\text{in ${S[1]} gelijke vakken: ${namen[i]} krijgt er ${S[0][i]}}`, `P = ${frS(S[0][i], S[1])}`] };
    } },
    venn: { naam: 'Kans uit een venndiagram', gen() {
      const N = kies([20, 25, 50]); let g; for (;;) { g = venn2Getallen(); if (g.N <= N - 1) break; } g.u += N - g.N; g.N = N;
      const C = kies(VENN2), v = kies(['beide', 'geen', 'minstens', 'enkelA']);
      const vr = { beide: ['allebei', g.ab], geen: ['geen van beide', g.u], minstens: ['minstens één van beide', g.N - g.u], enkelA: [`enkel ${C.wd[0]}`, g.a] }[v];
      const zin = `Een groep van ${N} ${C.g}: ${C.n[0]} = ${C.wd[0]}, ${C.n[1]} = ${C.wd[1]}. Je kiest blind één van die ${C.g}.`;
      return { soort: 'venn', opdracht: `Bereken P(${vr[0]}) als breuk en als percentage.`, html: opgave(zin) + venn2(g, C.n), sleutel: JSON.stringify(g) + v + C.n.join(), rapport: `venn ${C.n.join('/')}: P(${vr[0]})`,
        antw: delen(['\\text{breuk:}', kans(vr[1], N, `${PT(vr[0])} =`)], ['\\text{percentage:}', pct(W.rond(vr[1] / N * 100, 6), `${PT(vr[0])} =`)]),
        uitleg: [`\\text{gunstig: } ${vr[1]} \\qquad \\#U = ${N}`, `P = ${frS(vr[1], N)} = ${tg(W.rond(vr[1] / N * 100, 6))}\\,\\%`] };
    } },
  },
  oefenMix: [['een', 2], ['knikkers', 2], ['kaarten', 1], ['rad', 1], ['ongelijk', 1], ['venn', 1]],
  test: [['een', 2], ['knikkers', 2], ['kaarten', 2], ['rad', 1], ['ongelijk', 1], ['venn', 2]], testSchudden: true,
};

// ---- 10. Twee dobbelstenen ------------------------------------------------------------------------
const D10 = {
  nr: 10, titel: 'Twee dobbelstenen', kort: '36 even waarschijnlijke uitkomsten — de sommen zijn niet even waarschijnlijk.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Twee dobbelstenen: 6 · 6 = 36 uitkomsten</div>
      <p>Je gooit met twee dobbelstenen (bv. een rode en een blauwe) en telt de ogen op. Elk vakje van de tabel is één uitkomst; de 36 uitkomsten zijn even waarschijnlijk.</p>
      ${somTabel((a, b) => a + b === 7)}
      <p class="midden">$P(\\text{som is 7}) = \\dfrac{6}{36} = \\dfrac{1}{6}$</p></div>
    <div class="kader eig"><div class="kader-titel">Opgelet!</div>
      <p>Er zijn 11 mogelijke sommen (2 tot en met 12). Is de kans op som 7 dan 1 op 11? <b>Nee!</b> De sommen zijn niet even waarschijnlijk:
      een 7 kan op 6 manieren, een 2 maar op 1 manier (1 en 1). Tel dus altijd in de tabel met 36 vakjes.</p></div>`,
  voorbeelden: [
    { tex: 'P(\\text{som is minstens 10})?', stappen: ['\\text{som 10: 3 vakjes, som 11: 2, som 12: 1}', 'P = \\frac{6}{36} = \\frac{1}{6}'] },
    { tex: 'P(\\text{dubbel, bv. 3 en 3})?', stappen: ['\\text{de diagonaal: 6 vakjes}', 'P = \\frac{6}{36} = \\frac{1}{6}'] },
    { tex: 'P(\\text{som is niet 12})?', stappen: ['P = 1 - \\frac{1}{36} = \\frac{35}{36}'] },
  ],
  soorten: {
    som: { naam: 'De som', gen() {
      const v = kies(['is', 'is', 'min', 'max', 'niet', 'even']), s = rnd(2, 12);
      let w, g, u;
      if (v === 'is') { w = `som is ${s}`; g = somAantal(s); u = `\\text{vakjes met som ${s}: ${g}}`; }
      else if (v === 'min') { const m = rnd(8, 11); w = `som is minstens ${m}`; g = reeks(m, 12).reduce((a, x) => a + somAantal(x), 0); u = `${reeks(m, 12).map(somAantal).join(' + ')} = ${g}`; }
      else if (v === 'max') { const m = rnd(3, 6); w = `som is hoogstens ${m}`; g = reeks(2, m).reduce((a, x) => a + somAantal(x), 0); u = `${reeks(2, m).map(somAantal).join(' + ')} = ${g}`; }
      else if (v === 'niet') { w = `som is niet ${s}`; g = 36 - somAantal(s); u = `P = 1 - ${frR(somAantal(s), 36)}`; }
      else { w = kies(['som is even', 'som is oneven']); g = 18; u = '\\text{18 vakjes}'; }
      return { soort: 'som', opdracht: `Je gooit met twee dobbelstenen en telt de ogen op. Bereken P(${w}).`, html: somTabel(), sleutel: w, rapport: `twee dobbelstenen: ${w}`, antw: kans(g, 36, `${PT(w)} =`),
        uitleg: [u, `P = ${frS(g, 36)}`] };
    } },
    ander: { naam: 'Dubbel, zes en even', gen() {
      const V = kies([
        ['je dubbel gooit (twee keer hetzelfde)', 6, '\\text{de diagonaal: 6 vakjes}'], ['je geen dubbel gooit', 30, '36 - 6 = 30'],
        ['je minstens één 6 gooit', 11, '36 - 5 \\cdot 5 = 36 - 25 = 11'], ['je geen enkele 6 gooit', 25, '5 \\cdot 5 = 25'], ['beide dobbelstenen een even getal tonen', 9, '3 \\cdot 3 = 9'],
        ['de rode dobbelsteen meer ogen toont dan de blauwe', 15, '\\text{onder de diagonaal: } (36 - 6) : 2 = 15'], ['je dubbel zes gooit', 1, '\\text{1 vakje}'], ['minstens één dobbelsteen een 1 toont', 11, '36 - 25 = 11'],
      ]);
      return { soort: 'ander', opdracht: `Je gooit met een rode en een blauwe dobbelsteen. Bereken de kans dat ${V[0]}.`, sleutel: V[0], rapport: `twee dobbelstenen: ${V[0]}`, tex: '\\#U = 6 \\cdot 6 = 36',
        antw: kans(V[1], 36), uitleg: [V[2], `P = ${frS(V[1], 36)}`] };
    } },
    fout: { naam: 'Wat is er fout?', gen() {
      const s = kies([2, 3, 11, 12, 7, 6]), nm = kies(['Sara', 'Jonas', 'Ines', 'Milan']), g = somAantal(s);
      const zin = `${nm} zegt: "Er zijn 11 mogelijke sommen, dus de kans op som ${s} is 1 op 11."`;
      return { soort: 'fout', opdracht: 'Wat is er fout?', html: opgave(zin), sleutel: zin, rapport: zin,
        antw: zinKeuze(`De sommen zijn niet even waarschijnlijk. Som ${s} kan op ${g} manier${g > 1 ? 'en' : ''} van de 36: de kans is ${g}/36${ggd(g, 36) > 1 ? ' = ' + fr(g, 36).replace(/\\frac\{(\d+)\}\{(\d+)\}/, '$1/$2') : ''}.`,
          [`Er zijn 12 mogelijke sommen, dus de kans is 1 op 12.`, `Niets: elke som heeft evenveel kans.`, `De kans is 1 op 6, want een dobbelsteen heeft 6 zijden.`]),
        uitleg: ['\\text{de wet van Laplace mag enkel als alle uitkomsten even waarschijnlijk zijn}', `\\text{som ${s}: ${g} van de 36 vakjes}`] };
    } },
  },
  oefenMix: [['som', 3], ['ander', 2], ['fout', 1]],
  test: [['som', 6], ['ander', 3], ['fout', 1]], testSchudden: true,
};

// ---- 11. Kansbomen ------------------------------------------------------------------------------------
function zakSituatie() { const r = rnd(1, 5), b = rnd(2, 5); return { r, b, t: r + b }; }
const D11 = {
  nr: 11, titel: 'Kansen met een kansboom', kort: 'Langs een pad vermenigvuldigen (EN), meerdere paden optellen (OF).', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een kansboom</div>
      <ul><li>Zet bij elke tak de <b>kans</b> (let op: met of zonder terugleggen?).</li><li>Langs een pad: kansen <b>vermenigvuldigen</b> (EN).</li>
      <li>Meerdere paden: kansen <b>optellen</b> (OF).</li><li>Controle: alle eindkansen samen = 1.</li></ul></div>
    <div class="twee"><div class="kader eig"><div class="kader-titel">Met terugleggen</div>
      <p>Zakje met 3 rode (R) en 2 blauwe (B) knikkers. We trekken 2 keer en leggen telkens terug.</p>
      ${boom(boomVan([['R', 'B'], ['R', 'B']], [['3/5', '2/5'], ['3/5', '2/5']]), { uitkomst: true, eindkans: true })}
      <p>$P(\\text{RR}) = \\frac{3}{5} \\cdot \\frac{3}{5} = \\frac{9}{25}$</p></div>
    <div class="kader eig"><div class="kader-titel">Zonder terugleggen</div>
      <p>Hetzelfde zakje, maar de eerste knikker leg je niet terug: bij de tweede trekking zitten er nog 4 in.</p>
      ${boom(boomZakje({ R: 3, B: 2 }, 2, true), { uitkomst: true, eindkans: true })}
      <p>$P(\\text{RR}) = \\frac{3}{5} \\cdot \\frac{2}{4} = \\frac{6}{20} = \\frac{3}{10}$</p></div></div>
    <div class="kader"><div class="kader-titel">Handige tips</div>
      <p>"Twee dezelfde kleur" = RR <b>of</b> BB: tel de paden op. "Minstens één rode" = $1 - P(\\text{geen rode}) = 1 - P(\\text{BB})$.</p></div>`,
  voorbeelden: [
    { tex: '\\text{3 rode en 2 blauwe, 2 keer trekken met terugleggen: } P(\\text{twee dezelfde kleur})?', stappen: ['P(\\text{RR}) + P(\\text{BB}) = \\frac{9}{25} + \\frac{4}{25}', '= \\frac{13}{25}'] },
    { tex: '\\text{Twee lichten: 40\\,\\% en 50\\,\\% kans op groen (los van elkaar). } P(\\text{precies één groen})?', stappen: ['P(\\text{GR}) + P(\\text{RG}) = 0{,}4 \\cdot 0{,}5 + 0{,}6 \\cdot 0{,}5', '= 0{,}2 + 0{,}3 = 0{,}5 = 50\\,\\%'] },
  ],
  soorten: {
    munt: { naam: 'Muntstukken', gen() {
      const n = kies([2, 3]), v = kies(['alle', 'precies', 'minstens']), k = rnd(1, n - 1);
      const zin = `Je gooit ${n} keer met een muntstuk.`, fig = boom(boomVan(Array(n).fill(['K', 'M']), Array(n).fill(['1/2', '1/2'])), { uitkomst: true, eindkans: true });
      if (v === 'alle') return { soort: 'munt', opdracht: `Bereken P(${n} keer kop).`, html: opgave(zin), sleutel: zin + v, rapport: `${zin} P(${n} keer kop)`, antw: kans(1, 2 ** n, `P(\\text{${n} keer kop}) =`), uitleg: [`${Array(n).fill('\\frac{1}{2}').join(' \\cdot ')} = ${frR(1, 2 ** n)}`], uitlegHtml: fig };
      if (v === 'precies') { const c = comb(n, k); return { soort: 'munt', opdracht: `Bereken P(precies ${k} keer kop).`, html: opgave(zin), sleutel: zin + v + k, rapport: `${zin} P(precies ${k} keer kop)`, antw: kans(c, 2 ** n, `P(\\text{precies ${k} keer kop}) =`), uitleg: [`\\text{${c} van de ${2 ** n} even waarschijnlijke paden}`, `P = ${frS(c, 2 ** n)}`], uitlegHtml: fig }; }
      return { soort: 'munt', opdracht: 'Bereken P(minstens 1 keer munt).', html: opgave(zin), sleutel: zin + v, rapport: `${zin} P(minstens 1 keer munt)`, antw: kans(2 ** n - 1, 2 ** n, 'P(\\text{minstens 1 keer munt}) ='),
        uitleg: [`1 - P(\\text{${n} keer kop}) = 1 - ${frR(1, 2 ** n)} = ${frR(2 ** n - 1, 2 ** n)}`], uitlegHtml: fig };
    } },
    met: { naam: 'Met terugleggen', gen() {
      const Z = zakSituatie(), zin = `In een zakje zitten ${Z.r} rode (R) en ${Z.b} blauwe (B) knikkers. Je trekt 2 keer een knikker, <b>met</b> terugleggen.`;
      const fig = boom(boomVan([['R', 'B'], ['R', 'B']], [[`${Z.r}/${Z.t}`, `${Z.b}/${Z.t}`], [`${Z.r}/${Z.t}`, `${Z.b}/${Z.t}`]]), { uitkomst: true, eindkans: true });
      const t2 = Z.t * Z.t, rr = Z.r * Z.r, bb = Z.b * Z.b, rb = Z.r * Z.b, v = kies(['rr', 'bb', 'zelfde', 'minstens', 'precies']);
      const V = { rr: ['twee rode', rr, `${frR(Z.r, Z.t)} \\cdot ${frR(Z.r, Z.t)} = ${frS(rr, t2)}`], bb: ['twee blauwe', bb, `${frR(Z.b, Z.t)} \\cdot ${frR(Z.b, Z.t)} = ${frS(bb, t2)}`],
        zelfde: ['twee dezelfde kleur', rr + bb, `P(\\text{RR}) + P(\\text{BB}) = ${frR(rr, t2)} + ${frR(bb, t2)} = ${frS(rr + bb, t2)}`],
        minstens: ['minstens één rode', t2 - bb, `1 - P(\\text{BB}) = 1 - ${frR(bb, t2)} = ${frS(t2 - bb, t2)}`],
        precies: ['precies één rode', 2 * rb, `P(\\text{RB}) + P(\\text{BR}) = ${frR(rb, t2)} + ${frR(rb, t2)} = ${frS(2 * rb, t2)}`] }[v];
      return { soort: 'met', opdracht: `Maak een kansboom en bereken P(${V[0]}).`, html: opgave(zin), sleutel: zin + v, rapport: `met terugleggen ${Z.r}R ${Z.b}B: ${V[0]}`, antw: kans(V[1], t2, `${PT(V[0])} =`), uitleg: [V[2]], uitlegHtml: fig };
    } },
    zonder: { naam: 'Zonder terugleggen', gen() {
      const Z = zakSituatie(); if (Z.r < 2 && kies([true, false])) return this.gen();
      const zin = `In een zakje zitten ${Z.r} rode (R) en ${Z.b} blauwe (B) knikkers. Je trekt 2 knikkers na elkaar, <b>zonder</b> terugleggen.`;
      const fig = boom(boomZakje({ R: Z.r, B: Z.b }, 2, true), { uitkomst: true, eindkans: true });
      const n2 = Z.t * (Z.t - 1), rr = Z.r * (Z.r - 1), bb = Z.b * (Z.b - 1), rb = Z.r * Z.b, v = kies(Z.r > 1 ? ['rr', 'bb', 'zelfde', 'minstens', 'precies'] : ['bb', 'zelfde', 'minstens', 'precies']);
      const V = { rr: ['twee rode', rr, `${frR(Z.r, Z.t)} \\cdot ${frR(Z.r - 1, Z.t - 1)} = ${frS(rr, n2)}`], bb: ['twee blauwe', bb, `${frR(Z.b, Z.t)} \\cdot ${frR(Z.b - 1, Z.t - 1)} = ${frS(bb, n2)}`],
        zelfde: ['twee dezelfde kleur', rr + bb, `P(\\text{RR}) + P(\\text{BB}) = ${frR(rr, n2)} + ${frR(bb, n2)} = ${frS(rr + bb, n2)}`],
        minstens: ['minstens één rode', n2 - bb, `1 - P(\\text{BB}) = 1 - ${frR(bb, n2)} = ${frS(n2 - bb, n2)}`],
        precies: ['precies één rode', 2 * rb, `P(\\text{RB}) + P(\\text{BR}) = ${frR(rb, n2)} + ${frR(rb, n2)} = ${frS(2 * rb, n2)}`] }[v];
      return { soort: 'zonder', opdracht: `Maak een kansboom en bereken P(${V[0]}).`, html: opgave(zin), sleutel: zin + v, rapport: `zonder terugleggen ${Z.r}R ${Z.b}B: ${V[0]}`, antw: kans(V[1], n2, `${PT(V[0])} =`), uitleg: [`\\text{na de eerste trekking zitten er nog ${Z.t - 1} knikkers in}`, V[2]], uitlegHtml: fig };
    } },
    procent: { naam: 'Kansen in procent', gen() {
      const C = kies([
        { t: 'Op weg naar school passeer je 2 verkeerslichten. Het eerste staat in {a} % van de gevallen op groen, het tweede in {b} %. De lichten werken los van elkaar.', ja: 'groen', w: { beide: 'beide lichten groen zijn', een: 'precies één licht groen is', min: 'je minstens één keer moet stoppen (minstens één rood)', geen: 'geen enkel licht groen is' } },
        { t: 'Een voetballer trapt 2 strafschoppen. De eerste zit erin met een kans van {a} %, de tweede met een kans van {b} %. De strafschoppen zijn los van elkaar.', ja: 'raak', w: { beide: 'beide strafschoppen raak zijn', een: 'precies één strafschop raak is', min: 'minstens één strafschop mis is', geen: 'geen enkele strafschop raak is' } },
        { t: 'De kans op regen is zaterdag {a} % en zondag {b} %. We gaan ervan uit dat het weer van beide dagen los van elkaar staat.', ja: 'regen', w: { beide: 'het beide dagen regent', een: 'het op precies één dag regent', min: 'minstens één dag droog is', geen: 'het geen enkele dag regent' } },
        { t: 'Een machine maakt in {a} % van de gevallen een goed onderdeel, een tweede machine in {b} %. Je neemt van elke machine één onderdeel; ze werken los van elkaar.', ja: 'goed', w: { beide: 'beide onderdelen goed zijn', een: 'precies één onderdeel goed is', min: 'minstens één onderdeel slecht is', geen: 'geen enkel onderdeel goed is' } },
      ]);
      const a = kies([20, 30, 40, 50, 60, 70, 80, 90]), b = kies([20, 30, 40, 50, 60, 70, 80]), zin = C.t.replace('{a}', a).replace('{b}', b), v = kies(['beide', 'een', 'min', 'geen']);
      const pa = a / 100, pb = b / 100, d = (x) => tg(W.rond(x, 4));
      const V = { beide: [a * b / 100, `${d(pa)} \\cdot ${d(pb)} = ${d(pa * pb)}`], een: [(a * (100 - b) + (100 - a) * b) / 100, `${d(pa)} \\cdot ${d(1 - pb)} + ${d(1 - pa)} \\cdot ${d(pb)} = ${d(pa * (1 - pb))} + ${d((1 - pa) * pb)} = ${d(pa * (1 - pb) + (1 - pa) * pb)}`],
        min: [100 - a * b / 100, `1 - P(\\text{beide ${C.ja}}) = 1 - ${d(pa)} \\cdot ${d(pb)} = 1 - ${d(pa * pb)} = ${d(1 - pa * pb)}`], geen: [(100 - a) * (100 - b) / 100, `${d(1 - pa)} \\cdot ${d(1 - pb)} = ${d((1 - pa) * (1 - pb))}`] }[v];
      return { soort: 'procent', opdracht: `Maak een kansboom. Hoe groot is de kans dat ${C.w[v]}? Antwoord in procent.`, html: opgave(zin), sleutel: zin + v, rapport: `${zin.slice(0, 40)}…: ${C.w[v]}`,
        antw: pct(W.rond(V[0], 6)), uitleg: [V[1], `= ${tg(W.rond(V[0], 6))}\\,\\%`] };
    } },
    gokken: { naam: 'Gokken op een meerkeuzetoets', gen() {
      const n = 2, k = kies([3, 4, 5]), nm = kies(['Milan', 'Hajar', 'Senne', 'Elise']), v = kies(['beide', 'geen', 'minstens', 'precies']);
      const zin = `Een toets heeft ${n} meerkeuzevragen met elk ${k} antwoorden, waarvan er telkens 1 juist is. ${nm} kent er niets van en gokt.`, kk = k * k;
      const fig = boom(boomVan([['J', 'F'], ['J', 'F']], [[`1/${k}`, `${k - 1}/${k}`], [`1/${k}`, `${k - 1}/${k}`]]), { uitkomst: true, eindkans: true });
      const V = { beide: ['beide juist', 1, `${frR(1, k)} \\cdot ${frR(1, k)} = ${frR(1, kk)}`], geen: ['geen enkele juist', (k - 1) ** 2, `${frR(k - 1, k)} \\cdot ${frR(k - 1, k)} = ${frS((k - 1) ** 2, kk)}`],
        minstens: ['minstens één juist', kk - (k - 1) ** 2, `1 - P(\\text{FF}) = 1 - ${frR((k - 1) ** 2, kk)} = ${frS(kk - (k - 1) ** 2, kk)}`], precies: ['precies één juist', 2 * (k - 1), `P(\\text{JF}) + P(\\text{FJ}) = ${frR(k - 1, kk)} + ${frR(k - 1, kk)} = ${frS(2 * (k - 1), kk)}`] }[v];
      return { soort: 'gokken', opdracht: `Maak een kansboom (J = juist, F = fout) en bereken P(${V[0]}).`, html: opgave(zin), sleutel: zin + v, rapport: `gokken ${k} antwoorden: ${V[0]}`, antw: kans(V[1], kk, `${PT(V[0])} =`), uitleg: [V[2]], uitlegHtml: fig };
    } },
    vergelijk: { naam: 'Met of zonder terugleggen?', gen() {
      const Z = zakSituatie(); if (Z.r < 2) return this.gen();
      const met = Z.r * Z.r / (Z.t * Z.t), zo = Z.r * (Z.r - 1) / (Z.t * (Z.t - 1));
      const zin = `In een zakje zitten ${Z.r} rode en ${Z.b} blauwe knikkers. Je trekt 2 knikkers. Is P(twee rode) zonder terugleggen groter of kleiner dan met terugleggen?`;
      return { soort: 'vergelijk', opdracht: 'Kies het juiste antwoord.', html: opgave(zin), sleutel: zin, rapport: `vergelijk ${Z.r}R ${Z.b}B`,
        antw: zinKeuze('Kleiner: na een rode zit er een rode minder in het zakje.', ['Groter: na een rode zitten er minder knikkers in het zakje.', 'Even groot: het is hetzelfde zakje.', 'Dat kan je niet weten zonder het experiment uit te voeren.']),
        uitleg: [`\\text{met: } ${frR(Z.r, Z.t)} \\cdot ${frR(Z.r, Z.t)} = ${frS(Z.r * Z.r, Z.t * Z.t)} \\approx ${tg(W.rond(met, 3))}`, `\\text{zonder: } ${frR(Z.r, Z.t)} \\cdot ${frR(Z.r - 1, Z.t - 1)} = ${frS(Z.r * (Z.r - 1), Z.t * (Z.t - 1))} \\approx ${tg(W.rond(zo, 3))}`] };
    } },
  },
  oefenMix: [['munt', 1], ['met', 2], ['zonder', 2], ['procent', 1], ['gokken', 1], ['vergelijk', 1]],
  test: [['munt', 1], ['met', 2], ['zonder', 3], ['procent', 2], ['gokken', 1], ['vergelijk', 1]], testSchudden: true,
};

// ---- 12. Eindtest ---------------------------------------------------------------------------------
const D12 = {
  nr: 12, titel: 'Eindtest telproblemen en kansrekenen', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van telproblemen en kansrekenen door elkaar. Herhaal gerust de theorie van een vorig deel.
      Denk bij elke vraag eerst na: welke regel past? Teken een boom- of venndiagram als dat helpt. Een kans schrijf je als vereenvoudigde breuk.</p></div>`,
  voorbeelden: [],
  soorten: { bm: mix(D1, 'zakje'), cd: mix(D2, 'code'), rt: mix(D3, 'routes'), v3: mix(D4, 'drie'), mi: mix(D5, 'minstens'), rf: mix(D8, 'verwacht'), kn: mix(D9, 'knikkers'), ka: mix(D9, 'kaarten'), sm: mix(D10, 'som'), zo: mix(D11, 'zonder'), pr: mix(D11, 'procent'), me: mix(D11, 'met') },
  oefenMix: [['bm', 1], ['cd', 1], ['rt', 1], ['v3', 1], ['mi', 1], ['rf', 1], ['kn', 1], ['ka', 1], ['sm', 1], ['zo', 1], ['pr', 1], ['me', 1]],
  test: [['bm', 1], ['cd', 1], ['rt', 1], ['v3', 1], ['mi', 1], ['kn', 1], ['sm', 1], ['me', 1], ['zo', 1], ['pr', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'telproblemen-kansen', titel: 'Telproblemen en kansrekenen', ondertitel: 'Telproblemen en kansrekenen · 7VJHO', klas: '7VJHO', drempel: 70,
  intro: `<p>Eerst leer je tellen zonder alles op te schrijven: met een boomdiagram, de productregel, de somregel, een venndiagram en de complementregel.
    Daarna bepaal je kansen: met de relatieve frequentie, de wet van Laplace en een kansboom.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p class="klein"><b>Afspraken:</b> een kans schrijf je als <b>vereenvoudigde breuk</b> (met de breukknop); als percentage enkel als het gevraagd wordt.
    Een relatieve frequentie rond je af op <b>3 decimalen</b>. Je mag je rekenmachine gebruiken.</p>`,
  groepen: [{ titel: 'A · Telproblemen', delen: [1, 2, 3, 4, 5, 6] }, { titel: 'B · Kansen bepalen', delen: [7, 8, 9, 10, 11] }, { titel: 'C · Eindtest', delen: [12] }],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12],
});
})();
