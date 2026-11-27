// Programma 'telproblemen' — automatisch samengevoegd uit bron/telproblemen/ (niet rechtstreeks bewerken)
(() => {
// ===== Telproblemen · Wiskunde 4BW-MWW =====
// Leidraad: cursus Wiskunde 4BW-4MWW hoofdstuk 5 "Telproblemen" (G. Walschap): boomdiagram, vermenigvuldigingsregel, venndiagram met 2 en 3 verzamelingen.
const { rnd, kies, schud } = W;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud([...new Set(opties)].map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const lijstKeuze = (opties, juist) => { const o = schud([...new Set(opties)]); return { soort: 'keuze', lijst: true, opties: o.map((t, i) => ({ k: String(i), l: t, html: true })), juist: String(o.indexOf(juist)) }; };
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const def = (t, html) => `<div class="kader def"><div class="kader-titel">${t}</div>${html}</div>`;
const kader = (t, html, kl = '') => `<div class="kader ${kl}"><div class="kader-titel">${t}</div>${html}</div>`;
const svg = (w, h, g, label) => `<div class="figuur"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="font-family:Verdana,sans-serif;max-width:100%">${g}</svg></div>`;
const T = (x, y, t, o = '') => `<text x="${x}" y="${y}" font-size="13" text-anchor="middle" ${o}>${t}</text>`;

// ---------- boomdiagram: stappen = [[naam, opties...], ...]
function boom(stappen) {
  const n = stappen.reduce((a, s) => a * (s.length - 1), 1), rij = 22, H = Math.max(n * rij + 20, 80), kol = 130, Wd = 40 + kol * stappen.length + 90;
  let g = '';
  const teken = (niveau, y0, y1, xOuder, yOuder) => {
    if (niveau === stappen.length) return;
    const opts = stappen[niveau].slice(1), h = (y1 - y0) / opts.length;
    opts.forEach((o, i) => { const y = y0 + h * (i + 0.5), x = 40 + kol * (niveau + 1) - 30;
      g += `<line x1="${xOuder}" y1="${yOuder}" x2="${x - 4}" y2="${y}" stroke="#7a8b99" stroke-width="1.3"/>` + `<text x="${x}" y="${y + 4}" font-size="11.5" fill="#1c4e8a">${o}</text>`;
      teken(niveau + 1, y0 + h * i, y0 + h * (i + 1), x + o.length * 7 + 6, y); });
  };
  teken(0, 10, H - 10, 20, H / 2);
  g += `<circle cx="20" cy="${H / 2}" r="4" fill="#1f2733"/>` + stappen.map((s, i) => `<text x="${40 + kol * (i + 1) - 30}" y="${H - 1}" font-size="10" fill="#7a8b99">${s[0]}</text>`).join('');
  return svg(Wd, H + 4, g, 'boomdiagram');
}
// ---------- venndiagram met 2 of 3 verzamelingen; w = {A, B, AB, geen} of {A, B, C, AB, AC, BC, ABC, geen}; null toont '?' of leeg
function venn2(w, namen = ['A', 'B']) {
  const v = (x) => (x === null ? '' : x === '?' ? '<tspan fill="#c2561a" font-weight="bold">?</tspan>' : x);
  return svg(320, 200, `<rect x="5" y="5" width="310" height="190" rx="8" fill="#f7f9fc" stroke="#1f2733"/><circle cx="125" cy="105" r="70" fill="#1c4e8a" fill-opacity="0.12" stroke="#1c4e8a" stroke-width="2"/><circle cx="195" cy="105" r="70" fill="#e8772e" fill-opacity="0.12" stroke="#e8772e" stroke-width="2"/>`
    + T(85, 30, namen[0], 'font-weight="bold" fill="#1c4e8a"') + T(235, 30, namen[1], 'font-weight="bold" fill="#c2561a"') + T(95, 110, v(w.A)) + T(160, 110, v(w.AB)) + T(225, 110, v(w.B)) + T(290, 185, v(w.geen)), 'venndiagram met twee verzamelingen');
}
function venn3(w, namen = ['A', 'B', 'C']) {
  const v = (x) => (x === null ? '' : x === '?' ? '<tspan fill="#c2561a" font-weight="bold">?</tspan>' : x);
  return svg(320, 270, `<rect x="5" y="5" width="310" height="260" rx="8" fill="#f7f9fc" stroke="#1f2733"/><circle cx="125" cy="105" r="70" fill="#1c4e8a" fill-opacity="0.1" stroke="#1c4e8a" stroke-width="2"/><circle cx="195" cy="105" r="70" fill="#e8772e" fill-opacity="0.1" stroke="#e8772e" stroke-width="2"/><circle cx="160" cy="165" r="70" fill="#2e7d4f" fill-opacity="0.1" stroke="#2e7d4f" stroke-width="2"/>`
    + T(70, 32, namen[0], 'font-weight="bold" fill="#1c4e8a"') + T(250, 32, namen[1], 'font-weight="bold" fill="#c2561a"') + T(160, 252, namen[2], 'font-weight="bold" fill="#2e7d4f"')
    + T(100, 90, v(w.A)) + T(220, 90, v(w.B)) + T(160, 205, v(w.C)) + T(160, 80, v(w.AB)) + T(118, 150, v(w.AC)) + T(202, 150, v(w.BC)) + T(160, 128, v(w.ABC)) + T(290, 255, v(w.geen)), 'venndiagram met drie verzamelingen');
}

// ===================================================================
const KEUZES = [
  ['een broek', ['jeans', 'short', 'chino', 'joggingbroek', 'cargobroek']], ['een T-shirt', ['wit', 'zwart', 'blauw', 'rood', 'groen', 'geel']], ['schoenen', ['sneakers', 'sandalen', 'laarzen', 'loafers']],
  ['een voorgerecht', ['soep', 'salade', 'kroket', 'carpaccio']], ['een hoofdgerecht', ['vol-au-vent', 'pasta', 'vis', 'stoofvlees', 'veggieburger']], ['een dessert', ['ijs', 'mousse', 'fruit', 'taart']],
];
const D1 = {
  nr: 1, titel: 'Boomdiagram en vermenigvuldigingsregel', kort: 'Opeenvolgende stappen: n₁ × n₂ × n₃ × …', rekenmachine: false,
  theorie: `${def('Telprobleem', '<p>Een vraagstuk waarbij je het <b>aantal mogelijkheden</b> bepaalt: op hoeveel manieren kan iets gebeuren, gekozen of samengesteld worden?</p>')}
    ${def('Boomdiagram', '<p>Je bouwt het stap voor stap op: bij elke stap een nieuwe laag vertakkingen, één tak per mogelijkheid. Het aantal combinaties is het aantal <b>eindtakken</b> (helemaal rechts).</p>')}
    ${def('Vermenigvuldigingsregel', '<p>Bestaat een keuzeproces uit opeenvolgende stappen met $n_1, n_2, n_3, \\ldots$ mogelijkheden, dan is het totaal aantal combinaties $n_1 \\times n_2 \\times n_3 \\times \\ldots$</p>')}`,
  voorbeelden: [{ html: boom([['vervoer', 'fiets', 'bus'], ['route', 'kort', 'mooi', 'veilig']]), stappen: ['2 \\text{ takken, telkens } 3 \\text{ verder}: \\quad 2 \\times 3 = 6 \\text{ eindtakken}'] },
    { tex: '\\text{4 keer een muntstuk opgooien}', stappen: ['2 \\times 2 \\times 2 \\times 2 = 16 \\text{ uitkomsten}'] }],
  soorten: {
    boom: { naam: 'Eindtakken tellen', gen() { const k = kies([2, 3]), st = schud(KEUZES.map((x, i) => i)).slice(0, k).map(i => { const [n, o] = KEUZES[i]; return [n, ...schud(o).slice(0, rnd(2, 3))]; }), n = st.reduce((a, s) => a * (s.length - 1), 1);
      return { soort: 'boom', html: boom(st) + vraag('Hoeveel mogelijke combinaties zijn er?'), sleutel: `b${st.map(s => s.length).join('')}${st.map(s => s[0]).join()}`, antw: getal(n), uitleg: [`${st.map(s => s.length - 1).join(' \\times ')} = ${n}`] }; } },
    regel: { naam: 'Met de vermenigvuldigingsregel', gen() { const k = kies([2, 3, 3, 4]), st = schud(KEUZES.map((x, i) => i)).slice(0, k).map(i => [KEUZES[i][0], rnd(2, 6)]), n = st.reduce((a, s) => a * s[1], 1);
      return { soort: 'regel', html: opgave(`Je kiest ${st.map(([nm, a]) => `${nm} uit ${a} mogelijkheden`).join(', ').replace(/, ([^,]*)$/, ' en $1')}.`) + vraag('Hoeveel combinaties zijn er?'), sleutel: `r${st.flat().join()}`, antw: getal(n), uitleg: [`${st.map(s => s[1]).join(' \\times ')} = ${n}`] }; } },
    code: { naam: 'Codes en uitkomsten', gen() { const t = kies([['Een fietsslot heeft $n wieltjes met elk de cijfers 0 tot en met 9.', 'codes', 10, [3, 4]], ['Je gooit $n keer met een muntstuk (kop of munt).', 'uitkomsten', 2, [3, 4, 5]], ['Je gooit $n keer met een dobbelsteen.', 'uitkomsten', 6, [2, 3]], ['Een code bestaat uit $n letters, gekozen uit A, B en C (herhaling mag).', 'codes', 3, [2, 3, 4]]]);
      const n = kies(t[3]), r = t[2] ** n;
      return { soort: 'code', html: opgave(t[0].replace('$n', n)) + vraag(`Hoeveel verschillende ${t[1]} zijn er mogelijk?`), sleutel: `c${t[0]}${n}`, antw: getal(r), uitleg: [`${Array(n).fill(t[2]).join(' \\times ')} = ${r}`] }; } },
  },
  oefenMix: [['boom', 2], ['regel', 2], ['code', 1]],
  test: [['boom', 3], ['regel', 4], ['code', 3]], testSchudden: true,
};

const GROEP2 = [['leerlingen', 'een fiets', 'een step', 'Fiets', 'Step'], ['leerlingen', 'Frans', 'Spaans', 'Frans', 'Spaans'], ['jongeren', 'een hond', 'een kat', 'Hond', 'Kat'], ['klanten', 'koffie', 'een koek', 'Koffie', 'Koek'], ['leerlingen', 'aan voetbal', 'aan muziek', 'Voetbal', 'Muziek']];
function data2() { const ab = rnd(2, 9), a = rnd(3, 15), b = rnd(3, 15), geen = rnd(0, 8); return { AB: ab, A: a, B: b, geen, nA: a + ab, nB: b + ab, tot: a + b + ab + geen }; }
const D2 = {
  nr: 2, titel: 'Venndiagram met 2 verzamelingen', kort: 'Overlappende eigenschappen binnen één groep.', rekenmachine: false,
  theorie: `${def('Venndiagram', '<p>Gebruik je bij <b>overlappende eigenschappen</b> binnen één groep. Elke verzameling is een cirkel; de overlapping (de <b>doorsnede</b>) bevat wie tot beide behoort.</p>')}
    ${kader('Werkwijze: van binnen naar buiten', '<ol><li>Vul eerst de <b>doorsnede</b> in (beide).</li><li>Enkel A = aantal in A − doorsnede; enkel B = aantal in B − doorsnede.</li><li>Geen van beide = totaal − (enkel A + doorsnede + enkel B).</li></ol><p class="midden">totaal = enkel A + enkel B + (A én B) + geen van beide</p>', 'werk')}`,
  voorbeelden: [{ html: opgave('In een groep van 32 jongeren hebben 18 een hond en 14 een kat; 6 hebben beide.') + venn2({ A: 12, AB: 6, B: 8, geen: 6 }, ['Hond', 'Kat']), stappen: ['\\text{enkel hond: } 18 - 6 = 12, \\quad \\text{enkel kat: } 14 - 6 = 8', '\\text{minstens één: } 12 + 6 + 8 = 26, \\quad \\text{geen: } 32 - 26 = 6'] }],
  soorten: {
    geen: { naam: 'Geen van beide', gen() { const d = data2(), [gr, p, q, P, Q] = kies(GROEP2);
      return { soort: 'geen', html: opgave(`Van ${d.tot} ${gr} hebben/doen ${d.nA} ${p} en ${d.nB} ${q}; ${d.AB} ${p} én ${q}.`) + venn2({ A: null, AB: d.AB, B: null, geen: '?' }, [P, Q]) + vraag(`Hoeveel ${gr} hebben/doen geen van beide?`), sleutel: `g${d.tot}${d.nA}${d.nB}${d.AB}${P}`,
        antw: getal(d.geen), uitleg: [`\\text{enkel ${P}: } ${d.nA} - ${d.AB} = ${d.A}, \\quad \\text{enkel ${Q}: } ${d.nB} - ${d.AB} = ${d.B}`, `${d.tot} - (${d.A} + ${d.AB} + ${d.B}) = ${d.geen}`] }; } },
    enkel: { naam: 'Enkel A', gen() { const d = data2(), [gr, p, q, P, Q] = kies(GROEP2);
      return { soort: 'enkel', html: opgave(`${d.nA} ${gr} hebben/doen ${p}, ${d.nB} ${q}, en ${d.AB} beide.`) + vraag(`Hoeveel ${gr} hebben/doen enkel ${p}?`), sleutel: `e${d.nA}${d.nB}${d.AB}${P}`, antw: getal(d.A), uitleg: [`${d.nA} - ${d.AB} = ${d.A}`] }; } },
    doorsnede: { naam: 'De doorsnede zoeken', gen() { const d = data2(), [gr, p, q, P, Q] = kies(GROEP2);
      return { soort: 'doorsnede', html: opgave(`In een groep van ${d.tot} ${gr} hebben/doen ${d.nA} ${p} en ${d.nB} ${q}. ${d.geen} ${gr} hebben/doen geen van beide.`) + vraag('Hoeveel hebben/doen beide?'), sleutel: `d${d.tot}${d.nA}${d.nB}${d.geen}${P}`,
        antw: getal(d.AB), uitleg: [`\\text{minstens één: } ${d.tot} - ${d.geen} = ${d.tot - d.geen}`, `${d.nA} + ${d.nB} - ${d.tot - d.geen} = ${d.AB} \\text{ (zij werden dubbel geteld)}`] }; } },
    aflezen: { naam: 'Uit het diagram', gen() { const d = data2(), [gr, , , P, Q] = kies(GROEP2), w = kies([['minstens één van beide', d.A + d.AB + d.B], [`in ${P} (in totaal)`, d.nA], [`in ${Q} (in totaal)`, d.nB], ['in totaal', d.tot]]);
      return { soort: 'aflezen', html: venn2({ A: d.A, AB: d.AB, B: d.B, geen: d.geen }, [P, Q]) + vraag(`Hoeveel ${gr} zitten ${w[0]}?`), sleutel: `a${d.A}${d.AB}${d.B}${d.geen}${w[0]}`, antw: getal(w[1]), uitleg: [tx(`Tel de juiste gebieden op: ${w[1]}.`)] }; } },
  },
  oefenMix: [['geen', 2], ['enkel', 1], ['doorsnede', 1], ['aflezen', 1]],
  test: [['geen', 3], ['enkel', 2], ['doorsnede', 2], ['aflezen', 3]], testSchudden: true,
};

function data3() { const w = { ABC: rnd(1, 4), AB: rnd(1, 6), AC: rnd(1, 6), BC: rnd(1, 6), A: rnd(2, 10), B: rnd(2, 10), C: rnd(2, 10), geen: rnd(0, 8) };
  w.nA = w.A + w.AB + w.AC + w.ABC; w.nB = w.B + w.AB + w.BC + w.ABC; w.nC = w.C + w.AC + w.BC + w.ABC; w.min1 = w.A + w.B + w.C + w.AB + w.AC + w.BC + w.ABC; w.tot = w.min1 + w.geen; return w; }
const SPORT = [['Voetbal', 'Zwemmen', 'Tennis'], ['Frans', 'Engels', 'Duits'], ['Netflix', 'Disney+', 'Streamz'], ['Fiets', 'Bus', 'Tram']];
const D3 = {
  nr: 3, titel: 'Venndiagram met 3 verzamelingen', kort: '7 gebieden binnen de cirkels, 1 erbuiten.', rekenmachine: false,
  theorie: `${def('Drie verzamelingen', '<p>Drie cirkels die elkaar overlappen geven <b>7 gebieden</b> binnen de cirkels: 3 “enkel”-gebieden, 3 gebieden met telkens 2 verzamelingen en 1 gebied met alle 3. Daarnaast is er het gebied <b>buiten</b> alle cirkels.</p>')}
    ${kader('Werkwijze: van binnen naar buiten', '<ol><li>Begin met het middelste gebied (alle drie).</li><li>Dan de gebieden met twee: “A én B” min “alle drie”.</li><li>Dan de “enkel”-gebieden: totaal in A min de drie andere gebieden in A.</li><li>Minstens één = som van de 7 gebieden; geen = totaal − minstens één.</li></ol>', 'werk')}`,
  voorbeelden: [{ html: opgave('Van 40 leerlingen volgen er 20 Frans, 18 Engels en 15 Duits. 7 volgen Frans én Engels, 5 Frans én Duits, 6 Engels én Duits, en 3 volgen alle drie.') + venn3({ ABC: 3, AB: 4, AC: 2, BC: 3, A: 11, B: 8, C: 7, geen: 2 }, ['Frans', 'Engels', 'Duits']),
    stappen: ['\\text{midden: } 3; \\quad F \\cap E: 7 - 3 = 4, \\quad F \\cap D: 5 - 3 = 2, \\quad E \\cap D: 6 - 3 = 3', '\\text{enkel F: } 20 - 4 - 2 - 3 = 11, \\quad \\text{enkel E: } 18 - 4 - 3 - 3 = 8, \\quad \\text{enkel D: } 15 - 2 - 3 - 3 = 7', '\\text{minstens één: } 38, \\quad \\text{geen: } 40 - 38 = 2'] }],
  soorten: {
    som: { naam: 'Minstens één / totaal', gen() { const w = data3(), n = kies(SPORT), tot = kies([true, false]);
      return { soort: 'som', html: venn3(w, n) + vraag(tot ? 'Hoeveel personen telt de hele groep?' : 'Hoeveel personen behoren tot minstens één van de drie?'), sleutel: `s${JSON.stringify(w)}${tot}`, antw: getal(tot ? w.tot : w.min1),
        uitleg: [`${w.A} + ${w.B} + ${w.C} + ${w.AB} + ${w.AC} + ${w.BC} + ${w.ABC} = ${w.min1}`, ...(tot ? [`${w.min1} + ${w.geen} = ${w.tot}`] : [])] }; } },
    gebied: { naam: 'Een gebied invullen', gen() { const w = data3(), n = kies(SPORT), [a, b] = kies([['A', 'B'], ['A', 'C'], ['B', 'C']]), i = { A: 0, B: 1, C: 2 }, k = a + b, enkel = kies([true, false]);
      if (enkel) { const t = kies(['A', 'B', 'C']), andere = { A: ['AB', 'AC'], B: ['AB', 'BC'], C: ['AC', 'BC'] }[t];
        return { soort: 'gebied', html: opgave(`In totaal zitten ${w['n' + t]} personen in ${n[i[t]]}. Alle drie: ${w.ABC}; ${n[i[t]]} met een andere: ${w[andere[0]] + w.ABC} en ${w[andere[1]] + w.ABC} (die drie meegeteld).`) + vraag(`Hoeveel personen zitten enkel in ${n[i[t]]}?`), sleutel: `ge${JSON.stringify(w)}${t}`,
          antw: getal(w[t]), uitleg: [`\\text{twee-gebieden: } ${w[andere[0]] + w.ABC} - ${w.ABC} = ${w[andere[0]]}, \\quad ${w[andere[1]] + w.ABC} - ${w.ABC} = ${w[andere[1]]}`, `${w['n' + t]} - ${w[andere[0]]} - ${w[andere[1]]} - ${w.ABC} = ${w[t]}`] }; }
      return { soort: 'gebied', html: opgave(`${w[k] + w.ABC} personen zitten in ${n[i[a]]} én ${n[i[b]]}. ${w.ABC} zitten in alle drie.`) + vraag(`Hoeveel zitten in ${n[i[a]]} én ${n[i[b]]}, maar niet in de derde?`), sleutel: `gk${JSON.stringify(w)}${k}`, antw: getal(w[k]), uitleg: [`${w[k] + w.ABC} - ${w.ABC} = ${w[k]}`] }; } },
    geen: { naam: 'Geen van de drie', gen() { const w = data3(), n = kies(SPORT);
      return { soort: 'geen', html: opgave(`Een groep telt ${w.tot} personen.`) + venn3({ ...w, geen: '?' }, n) + vraag('Hoeveel personen behoren tot geen van de drie?'), sleutel: `n${JSON.stringify(w)}`, antw: getal(w.geen), uitleg: [`\\text{minstens één: } ${w.min1}`, `${w.tot} - ${w.min1} = ${w.geen}`] }; } },
  },
  oefenMix: [['som', 2], ['gebied', 2], ['geen', 1]],
  test: [['som', 3], ['gebied', 4], ['geen', 3]], testSchudden: true,
};

const SIT = [['Je stelt een outfit samen uit een broek, een trui en schoenen.', 'boomdiagram'], ['Hoeveel leerlingen volgen Frans, Engels of beide?', 'venndiagram'], ['Hoeveel codes kan je maken met 4 cijferwieltjes?', 'boomdiagram'],
  ['Hoeveel klanten kochten brood, melk of allebei?', 'venndiagram'], ['Je kiest een voorgerecht, een hoofdgerecht en een dessert.', 'boomdiagram'], ['Hoeveel jongeren sporten, bespelen een instrument of doen allebei?', 'venndiagram'], ['Je gooit drie keer met een muntstuk.', 'boomdiagram'], ['Hoeveel gezinnen hebben een hond, een kat en/of een konijn?', 'venndiagram']];
const D4 = {
  nr: 4, titel: 'Boomdiagram of venndiagram?', kort: 'Opeenvolgende stappen of overlappende eigenschappen.', rekenmachine: false,
  theorie: `${kader('Welke methode kies je?', '<table class="tabel"><tr><th>situatie</th><th>methode</th></tr><tr><td><b>opeenvolgende</b>, onafhankelijke keuzestappen (menu, kledingcombinaties, codes)</td><td>boomdiagram / vermenigvuldigingsregel</td></tr><tr><td><b>overlappende</b> eigenschappen binnen één groep (talen, sporten, hobby’s)</td><td>venndiagram</td></tr></table>', 'eig')}
    <p>Vraag jezelf eerst af: gaat het over <b>opeenvolgende stappen</b> of over <b>overlappende eigenschappen</b>?</p>`,
  voorbeelden: [{ tex: '\\text{5 broeken, 4 truien, 3 paar schoenen}', stappen: ['\\text{opeenvolgende keuzes: boomdiagram of vermenigvuldigingsregel}', '5 \\times 4 \\times 3 = 60'] }],
  soorten: {
    welke: { naam: 'Welke methode?', gen() { const [s, j] = kies(SIT); return { soort: 'welke', html: opgave(s) + vraag('Welke methode is het meest geschikt?'), sleutel: `w${s}`, antw: tekstKeuze(['boomdiagram', 'venndiagram'], j), uitleg: [tx(j === 'boomdiagram' ? 'Opeenvolgende keuzestappen.' : 'Overlappende eigenschappen binnen één groep.')] }; } },
    inzicht: { naam: 'Inzicht', gen() { const [v, j, f, u] = kies([
      ['In een klas van 30 doen 20 aan sport en 15 aan muziek. Kan de doorsnede groter zijn dan 15?', 'nee, want er zijn maar 15 muzikanten', ['ja, tot 20', 'ja, tot 30', 'dat kan je niet weten'], 'De doorsnede is een deel van elke verzameling, dus hoogstens 15.'],
      ['In een klas van 30 doen 20 aan sport en 15 aan muziek. Hoeveel doen er minstens allebei?', '5', ['0', '15', '35'], '20 + 15 = 35 > 30: minstens 5 werden dubbel geteld.'],
      ['Hoe controleer je een ingevuld venndiagram?', 'de som van alle gebieden moet het totaal geven', ['de doorsnede moet het grootst zijn', 'elke cirkel moet even veel bevatten', 'het buitengebied moet 0 zijn'], 'Alle gebieden samen vormen de hele groep.'],
      ['Waarmee begin je bij het invullen van een venndiagram?', 'met de doorsnede (van binnen naar buiten)', ['met het buitengebied', 'met de grootste cirkel', 'met het totaal'], 'Eerst de doorsnede(s), dan de enkel-gebieden.'],
      ['Hoeveel gebieden liggen binnen de cirkels van een venndiagram met 3 verzamelingen?', '7', ['3', '6', '8'], '3 enkel-gebieden, 3 gebieden met twee en 1 met alle drie.']]);
      return { soort: 'inzicht', html: vraag(v), sleutel: `i${v}`, antw: lijstKeuze([j, ...f], j), uitleg: [tx(u)] }; } },
  },
  oefenMix: [['welke', 3], ['inzicht', 2]],
  test: [['welke', 5], ['inzicht', 5]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D5 = {
  nr: 5, titel: 'Eindtest telproblemen', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: kader('Alles samen', '<ul><li>boomdiagram: tel de eindtakken</li><li>vermenigvuldigingsregel: $n_1 \\times n_2 \\times \\ldots$</li><li>venndiagram: van binnen naar buiten invullen</li><li>stappen → boom · overlappende eigenschappen → venn</li></ul>'),
  voorbeelden: [],
  soorten: { e1: mix(D1, 'boom', 'Boomdiagram'), e2: mix(D1, 'regel', 'Vermenigvuldigingsregel'), e3: mix(D1, 'code', 'Codes'), e4: mix(D2, 'geen', 'Venn 2: geen'), e5: mix(D2, 'doorsnede', 'Venn 2: doorsnede'),
    e6: mix(D3, 'som', 'Venn 3'), e7: mix(D3, 'gebied', 'Venn 3: gebied'), e8: mix(D3, 'geen', 'Venn 3: geen'), e9: mix(D4, 'welke', 'Welke methode?'), e10: mix(D4, 'inzicht', 'Inzicht') },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5]) {
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
  code: 'telproblemen', titel: 'Telproblemen', ondertitel: 'Wiskunde · 4BW-MWW', klas: '4BW-MWW', drempel: 70,
  intro: `<p>Op hoeveel manieren kan iets gebeuren? Je telt systematisch met een <b>boomdiagram</b> en de <b>vermenigvuldigingsregel</b>, en met een <b>venndiagram</b> met 2 of 3 verzamelingen. Je leert ook kiezen welke methode past.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Boomdiagram', delen: [1] }, { titel: 'B · Venndiagram', delen: [2, 3] }, { titel: 'C · Kiezen', delen: [4] }, { titel: 'D · Eindtest', delen: [5] }],
  delen: [D1, D2, D3, D4, D5],
});
})();
