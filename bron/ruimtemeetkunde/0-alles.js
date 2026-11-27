// ===== Ruimtemeetkunde · Wiskunde 4BW-MWW =====
// Leidraad: cursus Wiskunde 4BW-4MWW hoofdstuk 6 "Ruimtemeetkunde" (G. Walschap): onderlinge ligging van rechten en vlakken op de kubus ABCD-EFGH.
// De liggingen worden berekend uit de coördinaten van de kubus, zodat elke vraag gegarandeerd juist is.
const { rnd, kies, schud } = W;
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud([...new Set(opties)].map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const lijstKeuze = (opties, juist) => { const o = schud([...new Set(opties)]); return { soort: 'keuze', lijst: true, opties: o.map((t, i) => ({ k: String(i), l: t, html: true })), juist: String(o.indexOf(juist)) }; };
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const def = (t, html) => `<div class="kader def"><div class="kader-titel">${t}</div>${html}</div>`;
const kader = (t, html, kl = '') => `<div class="kader ${kl}"><div class="kader-titel">${t}</div>${html}</div>`;

// ---------- kubus ABCD-EFGH (ABCD grondvlak, E boven A, …)
const K = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
const sub = (p, q) => p.map((x, i) => x - q[i]), kruis = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const nul = (u) => u.every(x => Math.abs(x) < 1e-9);
const P = (n) => K[n];
// rechte = 'AB'; vlak = 'ABCD'
function ligRR(r, s) { const u = sub(P(r[1]), P(r[0])), v = sub(P(s[1]), P(s[0])), w = sub(P(s[0]), P(r[0]));
  if (nul(kruis(u, v))) return nul(kruis(u, w)) ? 'samenvallend' : 'evenwijdig';
  return Math.abs(dot(kruis(u, v), w)) < 1e-9 ? 'snijdend' : 'kruisend'; }
const normaal = (vl) => kruis(sub(P(vl[1]), P(vl[0])), sub(P(vl[2]), P(vl[0])));
const inVlak = (p, vl) => Math.abs(dot(normaal(vl), sub(p, P(vl[0])))) < 1e-9;
function ligRV(r, vl) { const u = sub(P(r[1]), P(r[0])); if (inVlak(P(r[0]), vl) && inVlak(P(r[1]), vl)) return 'ligt in het vlak'; return Math.abs(dot(u, normaal(vl))) < 1e-9 ? 'evenwijdig met het vlak' : 'snijdt het vlak'; }
function ligVV(a, b) { if (nul(kruis(normaal(a), normaal(b)))) return inVlak(P(b[0]), a) ? 'samenvallend' : 'evenwijdig'; return 'snijdend'; }
// snijpunt rechte-rechte (enkel bij snijdend) en snijlijn vlak-vlak als ribbe/lijnstuk door hoekpunten
function snijlijn(a, b) { const gem = Object.keys(K).filter(n => inVlak(P(n), a) && inVlak(P(n), b)); return gem.length >= 2 ? gem.join('') : null; }
const RIBBEN = ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG', 'DH'];
const DIAG = ['AC', 'BD', 'EG', 'FH', 'AF', 'BE', 'CH', 'DG', 'AH', 'DE', 'BG', 'CF'];
const RUIMTE = ['AG', 'BH', 'CE', 'DF'];
const ZIJVLAKKEN = ['ABCD', 'EFGH', 'ABFE', 'DCGH', 'ADHE', 'BCGF'];
const DIAGVLAKKEN = ['ACGE', 'BDHF', 'ABGH', 'DCFE', 'ADGF', 'BCHE'];

// ---------- tekening van de kubus in cavalièreperspectief, met gemarkeerde rechten en vlakken
function kubus(opt = {}) {
  const s = 130, ox = 60, oy = 215, dx = 0.5 * s * Math.cos(Math.PI / 4), dy = 0.5 * s * Math.sin(Math.PI / 4);
  const Q = (n) => { const [x, y, z] = K[n]; return [ox + x * s + y * dx, oy - z * s - y * dy]; };
  const verborgen = new Set(['DA', 'DC', 'DH', 'AD', 'CD', 'HD']);
  let g = '';
  for (const vl of opt.vlakken || []) g += `<polygon points="${[...vl.n].map(n => Q(n).join(',')).join(' ')}" fill="${vl.kl}" fill-opacity="0.22" stroke="none"/>`;
  for (const r of RIBBEN) { const [p, q] = [Q(r[0]), Q(r[1])]; g += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#1f2733" stroke-width="1.6" ${verborgen.has(r) ? 'stroke-dasharray="5 4"' : ''}/>`; }
  for (const r of opt.rechten || []) { const [p, q] = [Q(r.n[0]), Q(r.n[1])], ex = (q[0] - p[0]) * 0.18, ey = (q[1] - p[1]) * 0.18;
    g += `<line x1="${p[0] - ex}" y1="${p[1] - ey}" x2="${q[0] + ex}" y2="${q[1] + ey}" stroke="${r.kl}" stroke-width="3.2" stroke-linecap="round"/>`; }
  for (const n of Object.keys(K)) { const [x, y] = Q(n), [lx, ly] = { A: [-14, 16], B: [6, 16], C: [8, 14], D: [-16, -4], E: [-16, -4], F: [6, 16], G: [8, -6], H: [-14, -6] }[n]; g += `<circle cx="${x}" cy="${y}" r="2.6" fill="#1f2733"/><text x="${x + lx}" y="${y + ly}" font-size="14" font-weight="bold" font-style="italic" fill="#1f2733">${n}</text>`; }
  return `<div class="figuur"><svg viewBox="0 0 280 250" width="280" height="250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="kubus ABCD-EFGH" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
}
const BL = '#1c4e8a', OR = '#e8772e', GN = '#2e7d4f';
const REF = `<p>Referentiefiguur: de kubus $ABCD$-$EFGH$ met grondvlak $ABCD$ en bovenvlak $EFGH$ (recht boven $ABCD$). Verborgen ribben zijn gestreept.</p>`;

// ===================================================================
const D1 = {
  nr: 1, titel: 'Twee rechten in de ruimte', kort: 'Snijdend, evenwijdig of kruisend.', rekenmachine: false,
  theorie: `${kader('Punten, rechten en vlakken', `<p>In de ruimte komt bij punten en rechten een derde soort object: het <b>vlak</b>.</p>${REF}${kubus()}`)}
    ${def('Twee rechten', '<ul><li><b>snijdend</b>: precies één gemeenschappelijk punt (bv. $AB$ en $BC$ in $B$)</li><li><b>evenwijdig</b>: dezelfde richting, geen gemeenschappelijk punt (bv. $AB$ en $DC$)</li><li><b>kruisend</b>: geen gemeenschappelijk punt en niet evenwijdig: ze liggen <b>niet in eenzelfde vlak</b> (bv. $AB$ en $CG$). Dit bestaat enkel in de ruimte.</li></ul>')}
    ${kader('Tip', '<p>Twijfel je tussen evenwijdig en kruisend? Ga eerst na of de twee rechten in hetzelfde vlak liggen: enkel dan kunnen ze evenwijdig zijn.</p>', 'eig')}`,
  voorbeelden: [{ html: kubus({ rechten: [{ n: 'EH', kl: BL }, { n: 'BC', kl: OR }] }), stappen: ['EH \\text{ en } BC: \\text{ dezelfde richting, liggen samen in vlak } BCHE', '\\text{evenwijdig}'] },
    { html: kubus({ rechten: [{ n: 'EF', kl: BL }, { n: 'DH', kl: OR }] }), stappen: ['\\text{geen gemeenschappelijk punt, niet evenwijdig, niet in één vlak}', '\\text{kruisend}'] }],
  soorten: {
    ribben: { naam: 'Twee ribben', gen() { let r, s; do { [r, s] = schud(RIBBEN).slice(0, 2); } while (ligRR(r, s) === 'samenvallend'); const l = ligRR(r, s);
      return { soort: 'ribben', html: kubus({ rechten: [{ n: r, kl: BL }, { n: s, kl: OR }] }) + vraag(`Wat is de onderlinge ligging van de rechten ${r} en ${s}?`), sleutel: `r${r}${s}`, antw: tekstKeuze(['snijdend', 'evenwijdig', 'kruisend'], l),
        uitleg: [tx(l === 'snijdend' ? 'Ze hebben precies één gemeenschappelijk punt.' : l === 'evenwijdig' ? 'Ze hebben dezelfde richting en liggen in eenzelfde vlak, zonder gemeenschappelijk punt.' : 'Geen gemeenschappelijk punt en niet evenwijdig: ze liggen niet in eenzelfde vlak.')] }; } },
    diag: { naam: 'Ook diagonalen', gen() { const L = [...RIBBEN, ...DIAG, ...RUIMTE]; let r, s; do { [r, s] = schud(L).slice(0, 2); } while (ligRR(r, s) === 'samenvallend'); const l = ligRR(r, s);
      return { soort: 'diag', html: kubus({ rechten: [{ n: r, kl: BL }, { n: s, kl: OR }] }) + vraag(`Wat is de onderlinge ligging van de rechten ${r} en ${s}?`), sleutel: `d${r}${s}`, antw: tekstKeuze(['snijdend', 'evenwijdig', 'kruisend'], l),
        uitleg: [tx(l === 'snijdend' ? 'Ze snijden elkaar in precies één punt.' : l === 'evenwijdig' ? 'Ze hebben dezelfde richting.' : 'Ze liggen niet in eenzelfde vlak en hebben geen gemeenschappelijk punt.')] }; } },
    begrip: { naam: 'Begrippen', gen() { const [v, j, f, u] = kies([
      ['Wat zijn kruisende rechten?', 'rechten zonder gemeenschappelijk punt die niet evenwijdig zijn', ['rechten die elkaar loodrecht snijden', 'rechten met dezelfde richting', 'rechten die samenvallen'], 'Kruisende rechten liggen niet in eenzelfde vlak.'],
      ['Waarom bestaan kruisende rechten niet in een plat vlak?', 'twee rechten in een vlak snijden elkaar altijd of zijn evenwijdig', ['omdat een vlak te klein is', 'omdat rechten in een vlak altijd samenvallen', 'dat bestaat wel'], 'In het vlak zijn er enkel snijdende of evenwijdige rechten.'],
      ['Hoeveel gemeenschappelijke punten hebben twee snijdende rechten?', 'precies één', ['geen', 'twee', 'oneindig veel'], 'Snijdend: precies één gemeenschappelijk punt.'],
      ['Twee rechten hebben geen gemeenschappelijk punt. Wat kan je besluiten?', 'ze zijn evenwijdig of kruisend', ['ze zijn evenwijdig', 'ze zijn kruisend', 'ze snijden elkaar'], 'Je moet nog nagaan of ze in eenzelfde vlak liggen.']]);
      return { soort: 'begrip', html: vraag(v), sleutel: `b${v}`, antw: lijstKeuze([j, ...f], j), uitleg: [tx(u)] }; } },
  },
  oefenMix: [['ribben', 3], ['diag', 1], ['begrip', 1]],
  test: [['ribben', 5], ['diag', 3], ['begrip', 2]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Twee vlakken in de ruimte', kort: 'Snijdend (met een snijlijn) of evenwijdig.', rekenmachine: false,
  theorie: `${def('Twee vlakken', '<ul><li><b>snijdend</b>: ze hebben een gemeenschappelijke rechte, de <b>snijlijn</b> (bv. $ABCD$ en $ABFE$ met snijlijn $AB$)</li><li><b>evenwijdig</b>: geen enkel gemeenschappelijk punt (bv. $ABCD$ en $EFGH$)</li></ul>')}${REF}`,
  voorbeelden: [{ html: kubus({ vlakken: [{ n: 'ADHE', kl: BL }, { n: 'EFGH', kl: OR }] }), stappen: ['\\text{gemeenschappelijke punten: } E \\text{ en } H', '\\text{snijdend, snijlijn } EH'] }],
  soorten: {
    ligging: { naam: 'Snijdend of evenwijdig?', gen() { const [a, b] = schud(ZIJVLAKKEN).slice(0, 2), l = ligVV(a, b);
      return { soort: 'ligging', html: kubus({ vlakken: [{ n: a, kl: BL }, { n: b, kl: OR }] }) + vraag(`Wat is de onderlinge ligging van de vlakken ${a} en ${b}?`), sleutel: `v${a}${b}`, antw: tekstKeuze(['snijdend', 'evenwijdig'], l),
        uitleg: [tx(l === 'snijdend' ? `Ze hebben de snijlijn ${snijlijn(a, b)} gemeen.` : 'Ze hebben geen enkel gemeenschappelijk punt.')] }; } },
    snijlijn: { naam: 'De snijlijn', gen() { let a, b; do { [a, b] = schud([...ZIJVLAKKEN, ...DIAGVLAKKEN]).slice(0, 2); } while (ligVV(a, b) !== 'snijdend' || !snijlijn(a, b) || snijlijn(a, b).length !== 2); const sl = snijlijn(a, b);
      const ander = schud([...RIBBEN, ...DIAG].filter(x => x !== sl && x !== sl[1] + sl[0])).slice(0, 3);
      return { soort: 'snijlijn', html: kubus({ vlakken: [{ n: a, kl: BL }, { n: b, kl: OR }] }) + vraag(`Wat is de snijlijn van de vlakken ${a} en ${b}?`), sleutel: `s${a}${b}`, antw: tekstKeuze([sl, ...ander], sl), uitleg: [tx(`De punten ${sl[0]} en ${sl[1]} liggen in beide vlakken: de snijlijn is ${sl}.`)] }; } },
    omgeving: { naam: 'In het klaslokaal', gen() { const [v, j] = kies([['de vloer en het plafond', 'evenwijdig'], ['de vloer en een muur', 'snijdend'], ['twee muren die in een hoek samenkomen', 'snijdend'], ['de voorste en de achterste muur', 'evenwijdig'], ['het plafond en het bord aan de muur', 'snijdend']]);
      return { soort: 'omgeving', html: vraag(`Welke onderlinge ligging hebben ${v} (als vlakken)?`), sleutel: `o${v}`, antw: tekstKeuze(['snijdend', 'evenwijdig'], j), uitleg: [tx(j === 'snijdend' ? 'Ze hebben een gemeenschappelijke rand: de snijlijn.' : 'Ze hebben geen gemeenschappelijk punt.')] }; } },
  },
  oefenMix: [['ligging', 2], ['snijlijn', 2], ['omgeving', 1]],
  test: [['ligging', 4], ['snijlijn', 4], ['omgeving', 2]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Een rechte en een vlak', kort: 'In het vlak, snijdend of evenwijdig.', rekenmachine: false,
  theorie: `${def('Een rechte en een vlak', '<ul><li>de rechte <b>ligt in het vlak</b> (bv. $AB$ in $ABCD$)</li><li>de rechte <b>snijdt het vlak</b>: precies één gemeenschappelijk punt (bv. $AG$ snijdt $BCGF$ in $G$)</li><li>de rechte is <b>evenwijdig met het vlak</b>: geen gemeenschappelijk punt (bv. $AB$ en $EFGH$, want $AB$ is evenwijdig met $EF$ en $EF$ ligt in $EFGH$)</li></ul>')}
    ${kader('Tip', '<p>Een rechte is evenwijdig met een vlak als ze evenwijdig is met een rechte <b>in</b> dat vlak (en er zelf niet in ligt).</p>', 'eig')}`,
  voorbeelden: [{ html: kubus({ rechten: [{ n: 'CG', kl: OR }], vlakken: [{ n: 'ABFE', kl: BL }] }), stappen: ['CG \\parallel BF \\text{ en } BF \\text{ ligt in } ABFE', '\\text{evenwijdig met het vlak}'] }],
  soorten: {
    ligging: { naam: 'Rechte en vlak', gen() { const r = kies([...RIBBEN, ...RIBBEN, ...DIAG, ...RUIMTE]), vl = kies(ZIJVLAKKEN), l = ligRV(r, vl);
      return { soort: 'ligging', html: kubus({ rechten: [{ n: r, kl: OR }], vlakken: [{ n: vl, kl: BL }] }) + vraag(`Wat is de onderlinge ligging van de rechte ${r} en het vlak ${vl}?`), sleutel: `l${r}${vl}`, antw: tekstKeuze(['ligt in het vlak', 'snijdt het vlak', 'evenwijdig met het vlak'], l),
        uitleg: [tx(l === 'ligt in het vlak' ? 'Beide punten van de rechte liggen in het vlak.' : l === 'snijdt het vlak' ? 'De rechte heeft precies één punt gemeen met het vlak.' : 'De rechte is evenwijdig met een rechte in het vlak en ligt er zelf niet in.')] }; } },
    begrip: { naam: 'Begrippen', gen() { const [v, j, f, u] = kies([
      ['Kan een rechte meer dan één punt gemeen hebben met een vlak zonder erin te liggen?', 'nee: twee gemeenschappelijke punten betekenen dat de rechte in het vlak ligt', ['ja, twee punten', 'ja, als ze schuin staat', 'enkel bij een kubus'], 'Door twee punten van het vlak gaat juist één rechte, en die ligt in het vlak.'],
      ['Een rechte en een vlak hebben geen gemeenschappelijk punt. Wat besluit je?', 'de rechte is evenwijdig met het vlak', ['de rechte ligt in het vlak', 'de rechte snijdt het vlak', 'de rechte is kruisend met het vlak'], 'Geen gemeenschappelijk punt: evenwijdig.'],
      ['Wanneer is een rechte evenwijdig met een vlak?', 'als ze evenwijdig is met een rechte in dat vlak en er zelf niet in ligt', ['als ze het vlak in één punt snijdt', 'als ze loodrecht op het vlak staat', 'als ze in het vlak ligt'], 'Dat is het criterium uit de cursus.']]);
      return { soort: 'begrip', html: vraag(v), sleutel: `b${v}`, antw: lijstKeuze([j, ...f], j), uitleg: [tx(u)] }; } },
  },
  oefenMix: [['ligging', 4], ['begrip', 1]],
  test: [['ligging', 8], ['begrip', 2]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D4 = {
  nr: 4, titel: 'Eindtest ruimtemeetkunde', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: kader('Overzicht', '<table class="tabel"><tr><th>objecten</th><th>mogelijke liggingen</th></tr><tr><td>twee rechten</td><td>snijdend · evenwijdig · kruisend</td></tr><tr><td>twee vlakken</td><td>snijdend (snijlijn) · evenwijdig</td></tr><tr><td>rechte en vlak</td><td>in het vlak · snijdend · evenwijdig</td></tr></table>'),
  voorbeelden: [],
  soorten: { e1: mix(D1, 'ribben', 'Twee rechten'), e2: mix(D1, 'diag', 'Twee rechten'), e3: mix(D1, 'begrip', 'Begrippen'), e4: mix(D2, 'ligging', 'Twee vlakken'), e5: mix(D2, 'snijlijn', 'Snijlijn'), e6: mix(D3, 'ligging', 'Rechte en vlak'), e7: mix(D3, 'begrip', 'Begrippen') },
  oefenMix: [['e1', 2], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 3], ['e7', 1]],
  test: [['e1', 2], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 2], ['e6', 2], ['e7', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4]) {
  for (const s of Object.values(D.soorten)) {
    if (s._ingepakt) continue; s._ingepakt = true;
    const g = s.gen.bind(s);
    s.gen = () => {
      const v = { ...g() };
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
}

Leerpaden.registreer({
  code: 'ruimtemeetkunde', titel: 'Ruimtemeetkunde', ondertitel: 'Wiskunde · 4BW-MWW', klas: '4BW-MWW', drempel: 70,
  intro: `<p>Op de kubus $ABCD$-$EFGH$ onderzoek je de <b>onderlinge ligging</b> van twee rechten (snijdend, evenwijdig, kruisend), van twee vlakken (snijdend of evenwijdig) en van een rechte en een vlak.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Rechten', delen: [1] }, { titel: 'B · Vlakken', delen: [2, 3] }, { titel: 'C · Eindtest', delen: [4] }],
  delen: [D1, D2, D3, D4],
});
