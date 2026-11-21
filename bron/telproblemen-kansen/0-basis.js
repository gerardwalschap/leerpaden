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
