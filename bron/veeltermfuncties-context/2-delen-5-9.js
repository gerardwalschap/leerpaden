// ===================================================================
//  5 · VAN SITUATIE NAAR SCHETS
// ===================================================================
// verhalen met een passend model en drie foute modellen
function verhaalSit() {
  const fam = kies(['conc', 'open', 'fontein', 'griep', 'baby']);
  if (fam === 'conc') {
    const S = sitConc('geneesmiddel'), { T, tm, Mx, uur, a } = S;
    const v = `Een patiënt krijgt om ${uur} u een geneesmiddel. De concentratie in het bloed stijgt eerst snel en bereikt na ${tm} uur een maximum van ${kg(Mx)} mg/l. Daarna daalt ze geleidelijk, tot het middel na ${T} uur volledig uitgewerkt is.`;
    const fout = [(t) => a * 1.6 * t * (t - T) ** 2, (t) => { const T2 = T * 0.75; return 27 * Mx / (4 * T2 ** 3) * t * (t - T2) ** 2; }, (t) => Mx * t * (T - t) / (T * T / 4)];
    return { S, v, fout, X: [0, T], Y: [0, top(Mx * 1.8)], max: Mx, dom: [0, T], goedTex: `C(t) = ${a}t(t - ${T})^2`, foutTex: [`C(t) = ${r2(a * 1.6)}t(t - ${T})^2`, `C(t) = ${a}t(t - ${T + 3})^2`, `C(t) = ${r2(a * 2)}t(t - ${T / 2})^2`] };
  }
  if (fam === 'open') {
    const B = kies([200, 240, 300, 320]), a = B / 16, f = (t) => -a * (t - 10) * (t - 18), e = `-${a}*(x-10)*(x-18)`;
    const S = { fam: 'open', titel: 'Opendeurdag', f, e, fn: 'V', x: 't', xe: 'uur', ye: 'bezoekers', yn: 'bezoekers', dom: [10, 18], graf: { x: [10, 18], y: [0, top(B * 1.4)] }, tex: `V(t) = -${tg(a)}(t - 10)(t - 18)` };
    const v = `Een zorginstelling houdt een opendeurdag. De deuren gaan open om 10 u en sluiten om 18 u. Bij de opening en bij de sluiting is er niemand binnen. Om 14 u is het het drukst, met ${B} bezoekers. De drukte neemt even snel toe als af.`;
    const fout = [(t) => -a * (t - 10) * (t - 20) * 0.8, (t) => -a * 0.6 * (t - 10) * (t - 18), (t) => B * (1 - ((t - 12) / 2) ** 2) * (t <= 14 ? 1 : 1)];
    return { S, v, fout, X: [10, 18], Y: [0, top(B * 1.4)], max: B, dom: [10, 18], goedTex: `V(t) = ${vtTex([-a, 28 * a, -180 * a], 't')}`,
      foutTex: [`V(t) = ${vtTex([-a, 30 * a, -200 * a], 't')}`, `V(t) = ${vtTex([-a * 0.6, 28 * a * 0.6, -180 * a * 0.6].map(r2), 't')}`, `V(t) = ${vtTex([-a, 26 * a, -160 * a], 't')}`] };
  }
  if (fam === 'fontein') {
    const S = sitFontein(), { L, H, a } = S;
    const v = `De straal van een fontein komt uit een spuitmond op de grond. ${kg(L / 2)} m verder is de straal het hoogst: ${kg(H)} m. De straal komt ${L} m van de spuitmond weer op de grond.`;
    const fout = [(x) => -a * 2 * x * (x - L), (x) => -4 * H / (L + 4) ** 2 * x * (x - L - 4), (x) => -a * x * (x - L) + H / 2];
    return { S, v, fout, X: [0, L + 4], Y: [0, top(H * 2.2)], max: H, dom: [0, L], goedTex: `h(x) = ${vtTex([-a, a * L, 0])}`, foutTex: [`h(x) = ${vtTex([-2 * a, 2 * a * L, 0])}`, `h(x) = ${vtTex([-a, a * (L + 4), 0])}`, `h(x) = ${vtTex([-a, a * L, H / 2])}`] };
  }
  if (fam === 'griep') {
    const S = sitGriep(), { L, wm, Mx } = S, k = -S.c[0];
    const v = `Op een scholencampus breekt een griepgolf uit. Bij de start is niemand ziek. Het aantal zieke leerlingen stijgt tot ${Mx} in week ${wm}. Daarna daalt het, en na ${L} weken is de griepgolf voorbij.`;
    const fout = [(w) => k * 1.5 * w * w * (L - w), (w) => { const L2 = L - 3; return 27 * Mx / (4 * L2 ** 3) * w * w * (L2 - w); }, (w) => 4 * Mx / (L * L) * w * (L - w)];
    return { S, v, fout, X: [0, L], Y: [0, top(Mx * 1.7)], max: Mx, dom: [0, L], goedTex: `Z(w) = ${vtTex([-k, k * L, 0, 0], 'w')}`, foutTex: [`Z(w) = ${vtTex([-k * 1.5, k * 1.5 * L, 0, 0], 'w')}`, `Z(w) = ${vtTex([-k, k * (L - 3), 0, 0], 'w')}`, `Z(w) = ${vtTex([-k, k * L, 0], 'w')}`] };
  }
  const S = sitBaby(), { G0, p, q, a } = S;
  const v = `Een baby weegt bij de geboorte ${G0} gram. De eerste dagen verliest de baby gewicht: op dag ${p} weegt de baby het minst, ${q} gram. Daarna komt de baby weer bij. We volgen de baby 14 dagen.`;
  const fout = [(d) => a * (d - p - 3) ** 2 + q, (d) => -a * (d - p) ** 2 + G0 + a * p * p, (d) => a * 2 * (d - p) ** 2 + q];
  return { S, v, fout, X: [0, 14], Y: S.graf.y, max: q, dom: [0, 14], min: true, goedTex: `G(d) = ${a}(d - ${p})^2 + ${q}`, foutTex: [`G(d) = ${a}(d - ${p + 3})^2 + ${q}`, `G(d) = -${a}(d - ${p})^2 + ${G0 + a * p * p}`, `G(d) = ${a}(d - ${p})^2 + ${G0}`] };
}
const schetsGraf = (V, f) => rgraf({ x: V.X, y: V.Y, functies: [{ f, van: V.dom[0], tot: V.dom[1] }], klein: true, breed: 260, hoog: 160 });
function vraagVerhaalGraf() {
  const V = verhaalSit();
  return { soort: 'vgraf', opdracht: 'Controleer alle gegevens: de beginwaarde, het hoogste of laagste punt en waar de grafiek eindigt.', html: opgave(V.v) + vraag('Welke grafiek past bij dit verhaal?'), sleutel: V.v,
    rapport: `verhaal → grafiek (${V.S.titel})`, antw: figuren(schetsGraf(V, V.S.f), V.fout.map(f => schetsGraf(V, f))), uitleg: [tx('Controleer de beginwaarde, de top of het dal, en de nulpunten of de eindwaarde.'), `\\text{Een passend model: } ${V.goedTex}`] };
}
function vraagVerhaalKenm() {
  const V = verhaalSit(), [a, b] = V.dom;
  return { soort: 'vkenm', opdracht: 'Denk aan een schets bij het verhaal.', html: opgave(V.v) + vraag(`Wat is het ${V.min ? 'minimum' : 'maximum'} en wat is het domein?`), sleutel: V.v + 'k',
    rapport: `verhaal → kenmerken (${V.S.titel})`, antw: delen([`\\text{${V.min ? 'minimum' : 'maximum'}:}`, getal(V.max)], ['\\text{domein:}', vz([{ a, ai: true, b, bi: true }], '\\text{dom} =')]),
    uitleg: [`\\text{${V.min ? 'minimum' : 'maximum'}: } ${tg(V.max)}`, `\\text{dom} = ${ivTex(a, b)}`, tx(V.min ? 'Het minimum is de y-waarde van het laagste punt.' : 'Het maximum is de y-waarde van het hoogste punt.')] };
}
function vraagVoorschrift() {
  const V = verhaalSit(), opties = schud([V.goedTex, ...V.foutTex]);
  return { soort: 'vvoorschrift', opdracht: 'Tip: controleer met je rekenmachine de beginwaarde, het gegeven punt en de nulpunten.', html: opgave(V.v) + vraag('Welk voorschrift past bij dit verhaal?'), sleutel: V.v + 'v',
    rapport: `verhaal → voorschrift (${V.S.titel})`, antw: { soort: 'keuze', opties: opties.map((t, i) => ({ k: String(i), l: t })), juist: String(opties.indexOf(V.goedTex)) },
    uitleg: [V.goedTex, tx('Dit voorschrift klopt met alle gegevens uit het verhaal. Bij de andere klopt de top, het dal of een nulpunt niet.')] };
}
const D6 = {
  nr: 6, titel: 'Van situatie naar schets', kort: 'Bij een verhaal de passende grafiek, kenmerken en voorschrift vinden.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een verhaal omzetten in een grafiek</div>
      <p>Tot nu toe kreeg je de grafiek en zocht je de betekenis. Nu draaien we het om: je krijgt een verhaal en zoekt de grafiek. Er is niet altijd één juiste schets, maar je schets moet wel kloppen met <b>alle gegevens</b> uit het verhaal.</p></div>
    <div class="kader eig"><div class="kader-titel">Stappenplan: een schets maken bij een situatie</div>
      <ol><li>Welke grootheid staat op de horizontale as, welke op de verticale as? Met welke eenheden?</li><li>Bepaal het praktisch domein.</li>
      <li>Duid alle gegeven punten aan: beginwaarde, eindwaarde, maximum, minimum, nulpunten …</li><li>Bepaal waar de grafiek stijgt en daalt. Gebeurt dat snel (steil) of traag (vlak)?</li>
      <li>Verbind de punten met een vloeiende lijn (geen hoeken!).</li><li>Controle: vertel het verhaal terug met je eigen grafiek. Klopt alles?</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: opendeurdag</div>
      <p>De deuren gaan open om 10 u en sluiten om 18 u. Bij de opening en de sluiting is er niemand binnen. Om 14 u is het het drukst, met 300 bezoekers. De drukte neemt even snel toe als af.</p>
      ${figuur(rgraf({ x: [10, 18], y: [0, 350], xs: 1, ys: 50, xn: 't (uur)', yn: 'bezoekers', functies: [{ f: (t) => -18.75 * (t - 10) * (t - 18), e: '-18.75*(x-10)*(x-18)' }], punten: [{ x: 10, y: 0 }, { x: 14, y: 300 }, { x: 18, y: 0 }] }))}
      <p>Domein $[10 \\,;\\, 18]$, bereik $[0 \\,;\\, 300]$, verloop: stijgend op $[10 \\,;\\, 14]$, dalend op $[14 \\,;\\, 18]$.</p>
      <p><b>Welk voorschrift past?</b> Controleer alle gegevens. $V_1(t) = -18{,}75t^2 + 525t - 3375$ geeft $V_1(10) = 0$, $V_1(14) = 300$ en $V_1(18) = 0$: alles klopt.
      $V_2(t) = -12t^2 + 336t - 2160$ heeft wel nulpunten 10 en 18, maar het maximum is maar 192. $V_3(t) = -18{,}75t^2 + 562{,}5t - 3750$ heeft de top om 15 u en nulpunten 10 en 20.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Een patiënt krijgt om 8 u een geneesmiddel. De concentratie stijgt eerst snel en bereikt na 2 uur een maximum van 6 mg/l. Daarna daalt ze geleidelijk, tot het middel na 10 uur volledig uitgewerkt is.'),
      stappen: ['\\text{Punten: } (0 \\,;\\, 0), \\; (2 \\,;\\, 6) \\text{ (maximum) en } (10 \\,;\\, 0)', '\\text{dom} = [0 \\,;\\, 10], \\quad \\text{ber} = [0 \\,;\\, 6]', '\\text{Na het maximum is de grafiek minder steil: het middel verdwijnt trager dan het in het bloed kwam.}'] },
  ],
  soorten: {
    vgraf: { naam: 'Verhaal → grafiek', gen: vraagVerhaalGraf },
    vkenm: { naam: 'Verhaal → maximum en domein', gen: vraagVerhaalKenm },
    vvoorschrift: { naam: 'Welk voorschrift past?', gen: vraagVoorschrift },
  },
  oefenMix: [['vgraf', 2], ['vkenm', 1], ['vvoorschrift', 1]],
  test: [['vgraf', 4], ['vkenm', 3], ['vvoorschrift', 3]], testSchudden: true,
};

// ===================================================================
//  6 · VAN KENMERKEN NAAR SCHETS
// ===================================================================
const mk = (v) => kg(v).replace('-', '−');
// veelterm met gehele nulpunten: k(x − a)(x − b)(x − c) (of met twee nulpunten)
function poly(n = kies([2, 3])) {
  for (;;) {
    const ns = schud([-4, -3, -2, -1, 0, 1, 2, 3, 4]).slice(0, n).sort((p, q) => p - q);
    if (ns[n - 1] - ns[0] > 7) continue;
    const k = kies(n === 2 ? [1, -1, 0.5, -0.5] : [0.5, -0.5, 0.25, -0.25]);
    const f = (x) => k * ns.reduce((s, r) => s * (x - r), 1);
    const E = extrema(f, ns[0] - 2, ns[n - 1] + 2);
    const ys = [...E.lokMax, ...E.lokMin].map(p => Math.abs(p.y));
    if (Math.max(...ys) > 9 || Math.max(...ys) < 1.5) continue;
    return { ns, k, f, n, E, e: `${k}*${ns.map(r => `(x-(${r}))`).join('*')}` };
  }
}
const pGraf = (P, klein = false, f = P.f) => rgraf({ x: [P.ns[0] - 3, P.ns[P.n - 1] + 3], y: [-10, 10], xs: 1, ys: 2, functies: [{ f, e: f === P.f ? P.e : undefined }], klein, breed: klein ? 230 : 320, hoog: klein ? 200 : 280 });
function tekenCellen(ns, f) {
  const c = [{ y: f(ns[0] - 1) > 0 ? '+' : '−' }];
  ns.forEach((r, i) => { c.push({ x: mk(r), y: '0' }); const m = i < ns.length - 1 ? (r + ns[i + 1]) / 2 : r + 1; c.push({ y: f(m) > 0 ? '+' : '−' }); });
  return c;
}
const tekenOptie = (cellen) => `<table class="tabel tekenschema"><tr><th>x</th>${cellen.map(c => `<td>${c.x ?? ''}</td>`).join('')}</tr><tr><th>f(x)</th>${cellen.map(c => `<td>${c.y ?? ''}</td>`).join('')}</tr></table>`;
function vraagTeken() {
  const P = poly(), goed = tekenCellen(P.ns, P.f), om = goed.map(c => c.y === '+' ? { ...c, y: '−' } : c.y === '−' ? { ...c, y: '+' } : c);
  const verschoven = tekenCellen(P.ns.map(r => r + 1), (x) => P.f(x - 1)), gelijk = goed.map(c => c.y === '−' ? { ...c, y: '+' } : c);
  const opties = schud([goed, om, verschoven, gelijk].map((c, i) => ({ c, i })));
  return { soort: 'teken', opdracht: 'Boven de x-as: +, onder de x-as: −, op de x-as: 0.', html: figuur(pGraf(P)) + vraag('Welk tekenschema hoort bij deze grafiek?'), sleutel: P.e, rapport: 'grafiek → tekenschema',
    antw: { soort: 'keuze', opties: opties.map((o, k) => ({ k: String(k), l: tekenOptie(o.c), html: true, tekst: `schema ${k + 1}` })), juist: String(opties.findIndex(o => o.i === 0)) },
    uitleg: [`\\text{nulpunten: } ${P.ns.map(tg).join(', ')}`, tx('Boven de x-as: +, onder de x-as: −.')] };
}
function vraagGraad() {
  const P = poly(kies([2, 3, 3])), cel = tekenCellen(P.ns, P.f);
  return { soort: 'graad', opdracht: 'Tel de nulpunten.', html: `<p>Van een veeltermfunctie $f$ is het tekenschema gegeven:</p>${tekenOptie(cel)}${vraag('Van welke graad is f minstens?')}`, sleutel: P.e + 'g',
    rapport: 'tekenschema: minimale graad', antw: getal(P.n, { voor: '\\text{graad}' }), uitleg: [tx(`f heeft ${P.n} nulpunten. Een veeltermfunctie van graad n heeft hoogstens n nulpunten.`), `\\text{Dus de graad is minstens } ${P.n}.`] };
}
function vraagNulInterval() {
  const x1 = rnd(-3, 0), x2 = x1 + rnd(2, 4), soort = kies(['drie', 'links', 'rechts']);
  const M = soort === 'rechts' ? -rnd(1, 4) : rnd(2, 6), m = soort === 'links' ? rnd(1, 3) : -rnd(2, 6);
  const verloop = schema('x', 'f(x)', [{ y: PIJL_OP }, { x: mk(x1), y: `${mk(M)} max` }, { y: PIJL_NEER }, { x: mk(x2), y: `${mk(m)} min` }, { y: PIJL_OP }]);
  const L = `]−∞ ; ${mk(x1)}[`, Mi = `]${mk(x1)} ; ${mk(x2)}[`, R = `]${mk(x2)} ; +∞[`;
  const juist = { drie: `Drie nulpunten: één in ${L}, één in ${Mi} en één in ${R}.`, links: `Eén nulpunt, in ${L}.`, rechts: `Eén nulpunt, in ${R}.` }[soort];
  const fout = [`Drie nulpunten: één in ${L}, één in ${Mi} en één in ${R}.`, `Eén nulpunt, in ${L}.`, `Eén nulpunt, in ${R}.`, `Twee nulpunten: één in ${L} en één in ${R}.`, 'Geen nulpunten.'].filter(z => z !== juist);
  const uit = { drie: `Het maximum ${mk(M)} ligt boven de x-as en het minimum ${mk(m)} eronder: de grafiek snijdt de x-as drie keer.`, links: `Het minimum ${mk(m)} ligt boven de x-as: de grafiek snijdt de x-as enkel links van x = ${mk(x1)}.`,
    rechts: `Het maximum ${mk(M)} ligt onder de x-as: de grafiek snijdt de x-as enkel rechts van x = ${mk(x2)}.` }[soort];
  return { soort: 'nulint', opdracht: 'Kijk of de toppen boven of onder de x-as liggen.', html: `<p>Van een veeltermfunctie $f$ is het verloopschema gegeven:</p>${verloop}${vraag('Hoeveel nulpunten heeft f, en in welke intervallen liggen ze?')}`, sleutel: `${x1}${x2}${M}${m}`,
    rapport: 'verloopschema: nulpunten', antw: zinnen(juist, fout, { lijst: true }), uitleg: [tx(uit)] };
}
function vraagGrafKenm() {
  const P = poly(), E = extrema(P.f, P.ns[0], P.ns[P.n - 1]);
  const lijst = `<ul><li>$\\text{dom } f = \\mathbb{R}$</li><li>nulpunten: $${P.ns.map(tg).join(' \\,;\\, ')}$</li>
    <li>snijpunt met de $y$-as: $(0 \\,;\\, ${tg(r2(P.f(0)))})$</li>${[...E.lokMax.map(p => `<li>lokaal maximum $${tg(r1(p.y))}$ voor $x \\approx ${tg(r1(p.x))}$</li>`), ...E.lokMin.map(p => `<li>lokaal minimum $${tg(r1(p.y))}$ voor $x \\approx ${tg(r1(p.x))}$</li>`)].join('')}</ul>`;
  const g1 = (x) => -P.f(x), g2 = (x) => P.f(x - 1), g3 = (x) => P.f(x) * 1.8 + 1;
  return { soort: 'grafkenm', opdracht: 'Controleer elk kenmerk.', html: `<p>Een veeltermfunctie $f$ heeft deze kenmerken:</p>${lijst}${vraag('Welke grafiek past bij al deze kenmerken?')}`, sleutel: P.e + 'k', rapport: 'kenmerken → grafiek',
    antw: figuren(pGraf(P, true), [pGraf(P, true, g1), pGraf(P, true, g2), pGraf(P, true, g3)]), uitleg: [tx('Controleer telkens: nulpunten, snijpunt met de y-as, toppen en dalen.')] };
}
function vraagKanDit() {
  const a = rnd(-2, 2), b = a + rnd(2, 5), c = rnd(1, 5);
  const T = kies([
    { g: `Een veeltermfunctie $f$ heeft de nulpunten ${a} en ${b} en is overal dalend.`, kan: false, r: `Als f overal daalt, kan de grafiek de x-as maar één keer snijden. Twee nulpunten kan dus niet.` },
    { g: `Een veeltermfunctie $f$ van de tweede graad heeft geen nulpunten en heeft een maximum ${c}.`, kan: false, r: `Een tweedegraadsfunctie met een maximum is een bergparabool. Als de top (${c}) boven de x-as ligt, snijdt ze de x-as twee keer.` },
    { g: `Een veeltermfunctie $f$ van de tweede graad heeft geen nulpunten en heeft een minimum ${c}.`, kan: true, r: `Een dalparabool met de top boven de x-as snijdt de x-as nooit: dat kan.` },
    { g: `Een veeltermfunctie $f$ van de derde graad heeft geen nulpunten.`, kan: false, r: 'Een derdegraadsfunctie gaat aan de ene kant naar +∞ en aan de andere kant naar −∞: ze snijdt de x-as minstens één keer.' },
    { g: `Een veeltermfunctie $f$ van de tweede graad heeft de nulpunten ${a} en ${b} en een minimum $-${c}$.`, kan: true, r: 'Een dalparabool met de top onder de x-as snijdt de x-as twee keer: dat kan.' },
    { g: `Een veeltermfunctie $f$ heeft drie nulpunten en maar één top (één extremum).`, kan: false, r: 'Tussen twee nulpunten ligt altijd een top of een dal. Bij drie nulpunten zijn er dus minstens twee extrema.' },
    { g: `Het tekenschema van een veeltermfunctie $f$ is: $+$ $0$ $+$ (bij $x = ${a}$).`, kan: true, r: `Dat kan: de grafiek raakt de x-as in x = ${a} zonder van teken te veranderen (bv. f(x) = (x − ${a})²).` },
  ]);
  const juist = T.kan ? 'Dit kan.' : 'Dit kan niet.';
  return { soort: 'kandit', opdracht: 'Probeer in gedachten een grafiek te schetsen.', html: `<p>${T.g}</p>${vraag('Kan dit?')}`, sleutel: T.g, rapport: W.platteTekst(T.g),
    antw: { soort: 'keuze', opties: [{ k: 'ja', l: '\\text{Dit kan.}' }, { k: 'nee', l: '\\text{Dit kan niet.}' }], juist: T.kan ? 'ja' : 'nee' }, uitleg: [tx(juist), tx(T.r)] };
}
function vraagRaakt() {
  const n1 = rnd(-3, 0), n2 = n1 + rnd(2, 3), n3 = n2 + rnd(2, 3), dub = kies([n1, n2, n3]);
  const tek = [n1, n2, n3].map(r => r === dub);
  let s = '+'; const cel = [];
  const start = kies(['+', '−']); s = start; cel.push({ y: s });
  [n1, n2, n3].forEach((r, i) => { cel.push({ x: mk(r), y: '0' }); if (!tek[i]) s = s === '+' ? '−' : '+'; cel.push({ y: s }); });
  const juist = `In x = ${mk(dub)} raakt de grafiek de x-as: het teken verandert daar niet.`;
  return { soort: 'raakt', opdracht: 'Kijk naar de tekens links en rechts van elk nulpunt.', html: `<p>Van een veeltermfunctie $f$ is het tekenschema gegeven:</p>${tekenOptie(cel)}${vraag('Wat valt op? Hoe ziet de grafiek eruit bij de nulpunten?')}`, sleutel: `${n1}${n2}${n3}${dub}${start}`,
    rapport: 'tekenschema: raakpunt', antw: zinnen(juist, [n1, n2, n3].filter(r => r !== dub).map(r => `In x = ${mk(r)} raakt de grafiek de x-as: het teken verandert daar niet.`).concat(['De grafiek snijdt de x-as in alle drie de nulpunten.'])),
    uitleg: [tx(juist), tx('Bij de andere nulpunten verandert het teken: daar snijdt de grafiek de x-as.')] };
}
const D7 = {
  nr: 7, titel: 'Van kenmerken naar schets', kort: 'Teken- en verloopschema, nulpunten, graad: welke grafiek past? Kan dit wel?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Uit kenmerken een grafiek afleiden</div>
      <p>Nu krijg je geen verhaal, maar enkel kenmerken: nulpunten, een teken- of verloopschema, extrema … Een passende grafiek moet aan <b>alle</b> gegevens voldoen. Soms zijn er meerdere mogelijkheden, soms is het onmogelijk!</p>
      <ul><li>Een veeltermfunctie van graad $n$ heeft <b>hoogstens $n$ nulpunten</b>. Heeft $f$ drie nulpunten, dan is $f$ minstens van de derde graad.</li>
      <li>Tussen twee nulpunten ligt altijd een top of een dal (een extremum).</li>
      <li>In het <b>verloopschema</b> zie je of de toppen boven of onder de $x$-as liggen. Zo vind je hoeveel nulpunten er zijn en in welke intervallen.</li>
      <li>In het <b>tekenschema</b>: verandert het teken bij een nulpunt, dan <b>snijdt</b> de grafiek de $x$-as. Verandert het teken niet (bv. $-$ $0$ $-$), dan <b>raakt</b> de grafiek de $x$-as.</li>
      <li>Een derdegraadsfunctie snijdt de $x$-as altijd minstens één keer.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een verloopschema</div>
      ${schema('x', 'f(x)', [{ y: PIJL_OP }, { x: '−1', y: '4 max' }, { y: PIJL_NEER }, { x: '2', y: '−5 min' }, { y: PIJL_OP }])}
      <p>Het maximum 4 ligt boven de $x$-as en het minimum $-5$ eronder. De grafiek snijdt de $x$-as dus drie keer: in ${M('{]}{-\\infty} \\,;\\, -1{[}')}, in ${M('{]}-1 \\,;\\, 2{[}')} en in ${M('{]}2 \\,;\\, +\\infty{[}')}.</p>
      ${figuur(rgraf({ x: [-4, 5], y: [-7, 6], xs: 1, ys: 1, xn: 'x', yn: 'y', functies: [{ f: (x) => 2 * (x ** 3 / 3 - x * x / 2 - 2 * x) + 5 / 3, e: '2*(x**3/3-x**2/2-2*x)+5/3' }], punten: [{ x: -1, y: 4 }, { x: 2, y: -5 }] }))}</div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: kan dit?</div>
      <p>Een veeltermfunctie heeft de nulpunten 1 en 5 en is overal dalend. <b>Dat kan niet:</b> een dalende grafiek snijdt de $x$-as hoogstens één keer.</p>
      <p>Een tweedegraadsfunctie heeft geen nulpunten en een maximum 3. <b>Dat kan niet:</b> een bergparabool met de top boven de $x$-as snijdt de $x$-as twee keer. Verander je "maximum" in "minimum", dan kan het wel.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `<p>Tekenschema:</p>${tekenOptie([{ y: '+' }, { x: '−1', y: '0' }, { y: '−' }, { x: '2', y: '0' }, { y: '−' }, { x: '4', y: '0' }, { y: '+' }])}<p>Wat valt op aan het nulpunt 2?</p>`,
      stappen: ['\\text{Links en rechts van 2 staat } -: \\text{ het teken verandert niet.}', '\\text{De grafiek raakt de } x\\text{-as in } x = 2 \\text{ (een top op de } x\\text{-as).}'] },
  ],
  soorten: {
    teken: { naam: 'Grafiek → tekenschema', gen: vraagTeken },
    graad: { naam: 'Minimale graad', gen: vraagGraad },
    nulint: { naam: 'Hoeveel nulpunten, en waar?', gen: vraagNulInterval },
    grafkenm: { naam: 'Kenmerken → grafiek', gen: vraagGrafKenm },
    kandit: { naam: 'Kan dit?', gen: vraagKanDit },
    raakt: { naam: 'Snijden of raken?', gen: vraagRaakt },
  },
  oefenMix: [['teken', 1], ['graad', 1], ['nulint', 1], ['grafkenm', 1], ['kandit', 1], ['raakt', 1]],
  test: [['teken', 2], ['graad', 1], ['nulint', 2], ['grafkenm', 2], ['kandit', 2], ['raakt', 1]], testSchudden: true,
};

// ===================================================================
//  7 · EEN GRAFIEK VERTELLEN
// ===================================================================
function verhaalVan(S) {
  const z = S.z;
  if (S.fam === 'conc') return { goed: [z.begin, z.verloop, z.max, z.nul], fout: [[z.begin, z.verloop, S.zF.max, z.nul], [S.zF.begin, z.verloop, z.max, z.nul], [z.begin, 'De concentratie stijgt de hele tijd.', z.max, z.nul]] };
  if (S.fam === 'baby') return { goed: [z.begin, z.verloop, z.min, `Na 14 dagen weegt de baby ${S.G14} gram.`], fout: [[z.begin, z.verloop, S.zF.min, `Na 14 dagen weegt de baby ${S.G14} gram.`], [S.zF.begin, z.verloop, z.min, `Na 14 dagen weegt de baby ${S.G14} gram.`], [z.begin, S.zF.verloop, z.min, `Na 14 dagen weegt de baby ${S.G14} gram.`]] };
  if (S.fam === 'hart') return { goed: [z.begin, z.verloop, z.max, `Op het einde van de test is de hartslag weer ${S.H0} slagen per minuut.`], fout: [[z.begin, z.verloop, S.zF.max, `Op het einde van de test is de hartslag weer ${S.H0} slagen per minuut.`], [S.zF.begin, z.verloop, z.max, `Op het einde is de hartslag weer ${S.H0}.`], [z.begin, S.zF.verloop, z.max, `Op het einde van de test is de hartslag weer ${S.H0} slagen per minuut.`]] };
  return { goed: [z.begin, z.verloop, z.max, z.nul], fout: [[z.begin, z.verloop, S.zF.max, z.nul], [S.zF.begin, z.verloop, z.max, z.nul], [z.begin, z.verloop, z.max, S.zF.nul]] };
}
const kiesVerhaal = () => kies([sitConc, sitBaby, sitHart, sitGriep])();
const verhaalGraf = (S) => figuur(sitGraf(S));
function vraagVertaal() {
  const S = kiesVerhaal(), ks = Object.keys(S.w).filter(k => S.z[k]), k = kies(ks);
  const fout = schud(ks.filter(x => x !== k).map(x => S.z[x])); if (S.zF[k]) fout.unshift(S.zF[k]);
  return { soort: 'vertaal', opdracht: 'Kies de zin die past bij de situatie.', html: `${opgave(S.verhaal.replace(/ De formule geeft.*$/, ''))} De grafiek toont ${yWat(S)}.${verhaalGraf(S)}<p class="midden">In wiskundetaal: $${S.w[k]}$</p>${vraag('Wat betekent dat in de situatie?')}`, sleutel: S.titel + k + S.z[k],
    rapport: `${S.titel}: ${W.platteTekst(S.w[k])}`, antw: zinnen(S.z[k], fout), uitleg: [S.w[k], tx(S.z[k])] };
}
function vraagVerslag() {
  const S = kiesVerhaal(), V = verhaalVan(S), goed = V.goed.join(' ');
  return { soort: 'verslag', opdracht: 'In de andere verslagen staat één fout.', html: `${opgave(S.verhaal.replace(/ De formule geeft.*$/, ''))} De grafiek toont ${yWat(S)}.${verhaalGraf(S)}${vraag('Welk verslag past bij de grafiek?')}`, sleutel: S.titel + goed,
    rapport: `${S.titel}: juiste verslag kiezen`, antw: zinnen(goed, V.fout.map(f => f.join(' '))), uitleg: [tx(goed)] };
}
function vraagAflezenV() {
  const S = kiesVerhaal(), [a, b] = S.dom;
  const x = rnd(Math.ceil(a) + 1, Math.floor(b) - 1), y = S.f(x), d = S.fam === 'conc' ? 1 : 0;
  const stap = S.fam === 'baby' ? 50 : S.fam === 'conc' ? 1 : S.fam === 'hart' ? 10 : 20;
  const juist = W.rond(y, d), opties = schud([juist, W.rond(juist + stap * 2, d), W.rond(juist - stap * 2, d), W.rond(S.f(x + 2 <= b ? x + 2 : x - 2) + stap * 3, d)].filter((v, i, l) => l.indexOf(v) === i));
  return { soort: 'aflezenv', opdracht: 'Lees af op de grafiek.', html: `${opgave(S.verhaal.replace(/ De formule geeft.*$/, ''))} De grafiek toont ${yWat(S)}.${verhaalGraf(S)}${vraag(`Hoe groot is ${yWat(S)} ongeveer ${xZin(S, x)}?`)}`, sleutel: S.titel + x,
    rapport: `${S.titel}: aflezen bij ${S.x} = ${x}`, antw: { soort: 'keuze', opties: opties.map((v, i) => ({ k: String(i), l: `\\text{ongeveer ${kg(v)} ${S.ye}}` })), juist: String(opties.indexOf(juist)) },
    uitleg: [`${S.fn}(${x}) \\approx ${tg(juist)}`] };
}
function vraagContexttaal() {
  const S = kiesVerhaal(), juist = kies([S.z.verloop, S.z.begin, S.z.max || S.z.min]), fn = S.fn;
  const fout = schud([`De functie ${fn} is eerst stijgend en daarna dalend.`, `Het maximum van ${fn} ligt bij ${S.x} = ${tg(S.max ? S.max.x : S.min.x)}.`, `${fn}(0) is de beginwaarde van de functie.`, `De grafiek heeft een top en is daarna dalend.`, `De nulpunten van ${fn} liggen op de x-as.`]).slice(0, 3);
  return { soort: 'context', opdracht: 'Wiskundewoorden zijn bv. functie, maximum, nulpunt, stijgend, grafiek.', html: `${opgave(S.verhaal.replace(/ De formule geeft.*$/, ''))} De grafiek toont ${yWat(S)}.${verhaalGraf(S)}${vraag('Welke zin gebruikt alleen woorden uit de situatie, en geen wiskundewoorden?')}`, sleutel: S.titel + juist,
    rapport: `${S.titel}: contexttaal`, antw: zinnen(juist, fout), uitleg: [tx(juist), tx('De andere zinnen gebruiken wiskundige vaktaal.')] };
}
const D8 = {
  nr: 8, titel: 'Een grafiek vertellen', kort: 'Een grafiek omzetten in een verhaal in de taal van de situatie.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een goede grafiek vertelt een verhaal</div>
      <p>In dit hoofdstuk vertaal je een grafiek naar een verhaal, <b>zonder wiskundige vaktaal</b>. Zo toon je dat je echt begrijpt wat de grafiek zegt.</p></div>
    <div class="kader eig"><div class="kader-titel">Checklist voor een goed verhaal</div>
      <ul><li>Ik vermeld de beginwaarde (met eenheid).</li><li>Ik vermeld wanneer de grootheid toeneemt en afneemt.</li>
      <li>Ik vermeld de hoogste en laagste waarde(n) én wanneer ze bereikt worden.</li><li>Ik vermeld nulpunten (of leg uit waarom er geen zijn).</li>
      <li>Ik zeg iets over de snelheid van de verandering (snel/traag).</li><li>Ik vermeld de eindwaarde.</li>
      <li>Ik gebruik de taal van de situatie, géén woorden als "functie", "nulpunt", "stijgend" of "maximum".</li><li>Mijn verhaal is logisch: het kan echt zo gebeurd zijn.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: vertaal naar contexttaal</div>
      <p>Het aantal bezoekers $J$ in een jeugdhuis op een zaterdag, $t$ uur na 14 u:</p>
      <table class="tabel"><tr><th>Wiskundetaal</th><th>Contexttaal</th></tr>
      <tr><td>$J(0) = 8$</td><td>Om 14 u zijn er 8 bezoekers in het jeugdhuis.</td></tr>
      <tr><td>$J$ is stijgend op $[0 \\,;\\, 2{,}5]$.</td><td>Tot half vijf komen er steeds meer bezoekers bij.</td></tr>
      <tr><td>$J$ heeft een lokaal minimum 12 voor $t = 5{,}5$.</td><td>Om half acht is het even rustig: 12 bezoekers. Daarna wordt het weer drukker.</td></tr>
      <tr><td>Het maximum van $J$ is ongeveer 63.</td><td>Op het drukste moment van de avond zijn er ongeveer 63 bezoekers.</td></tr>
      <tr><td>$J(12) = 0$</td><td>Om 2 u 's nachts is iedereen naar huis.</td></tr>
      <tr><td>$\\text{ber } J = [0 \\,;\\, 63]$</td><td>Het aantal bezoekers ligt tussen 0 en 63.</td></tr></table></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: de griepgolf vertellen</div>
      <p>Bij het begin van de griepgolf is nog geen enkele leerling ziek. Daarna breidt de griep zich uit: het aantal zieke leerlingen neemt eerst traag toe, daarna steeds sneller.
      In week 8 bereikt de griepgolf haar hoogtepunt met 256 zieke leerlingen. Vanaf dan neemt het aantal zieken af, en vanaf week 10 zelfs heel snel. Na 12 weken is de griepgolf voorbij.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${figuur(rgraf({ x: [0, 14], y: [3200, 3900], xs: 1, ys: 100, xn: 'd (dagen na de geboorte)', yn: 'gewicht (gram)', functies: [{ f: (d) => 6 * d * d - 60 * d + 3500, e: '6*x**2-60*x+3500' }] }))}<p>Vertel de grafiek.</p>`,
      stappen: ['\\text{Bij de geboorte weegt de baby 3500 gram.}', '\\text{De eerste 5 dagen verliest de baby gewicht: op dag 5 weegt de baby het minst, 3350 gram.}', '\\text{Daarna komt de baby steeds sneller bij: op dag 10 weegt de baby weer 3500 gram, op dag 14 al 3836 gram.}'] },
  ],
  soorten: {
    vertaal: { naam: 'Wiskundetaal → contexttaal', gen: vraagVertaal },
    verslag: { naam: 'Het juiste verslag kiezen', gen: vraagVerslag },
    aflezenv: { naam: 'Aflezen op de grafiek', gen: vraagAflezenV },
    context: { naam: 'Welke zin is in contexttaal?', gen: vraagContexttaal },
  },
  oefenMix: [['vertaal', 2], ['verslag', 1], ['aflezenv', 1], ['context', 1]],
  test: [['vertaal', 4], ['verslag', 3], ['aflezenv', 2], ['context', 1]], testSchudden: true,
};

// ===================================================================
//  8 · FOUTENANALYSE
// ===================================================================
function uitspraken() {
  const fam = kies(['conc', 'saldo', 'baby', 'doos', 'spoed']);
  const S = SITUATIES[fam](), L = [];
  if (fam === 'conc') {
    const { T, tm, Mx } = S;
    L.push({ t: `dom C = ℝ en ber C = [0 ; ${T}]`, ok: false, r: `Het praktisch domein is [0 ; ${T}] en het bereik is [0 ; ${kg(Mx)}]: ${T} is een x-waarde.` });
    L.push({ t: `Het maximum is ${tm}.`, ok: false, r: `${tm} is de x-waarde (de tijd). Het maximum is ${kg(Mx)} mg/l, na ${tm} uur.`, c: { vraag: 'Hoe groot is het maximum?', antw: getal(Mx, { dec: 2, voor: 'C_{max} =', na: '\\text{ mg/l}' }) } });
    L.push({ t: `C is stijgend op [0 ; ${T}].`, ok: false, r: `C stijgt op [0 ; ${tm}] en daalt op [${tm} ; ${T}].`, c: { vraag: 'Tot hoeveel uur na inname stijgt de concentratie?', antw: getal(tm, { voor: 't =', na: '\\text{ uur}' }) } });
    L.push({ t: `Na ${T} uur wordt de concentratie negatief.`, ok: false, r: `Na ${T} uur stijgt de formule weer (geen negatieve waarden), maar dat ligt buiten het praktisch domein: ${S.ding} is dan uitgewerkt.` });
    L.push({ t: `De concentratie is het hoogst na ${tm} uur: ${kg(Mx)} mg/l.`, ok: true, r: `Hoogste punt: (${tm} ; ${kg(Mx)}).` });
    L.push({ t: `Na ${T} uur is ${S.ding} uitgewerkt.`, ok: true, r: `C(${T}) = 0.` });
    L.push({ t: 'C(0) = 0: bij inname zit er nog niets in het bloed.', ok: true, r: 'Juist.' });
  }
  if (fam === 'saldo') {
    const { q1, q2, S0 } = S;
    L.push({ t: `S is positief op [0 ; ${q1}] en negatief op [${q1} ; 12].`, ok: false, r: `S is negatief tussen ${q1} en ${q2} en daarna weer positief.`, c: { vraag: 'Tot hoeveel maanden na 1 september staat de rekening in het rood?', antw: getal(q2, { voor: 'm =' }) } });
    L.push({ t: `De jeugdbeweging staat in het rood vanaf 1 ${MAANDEN[q1 + 2]}.`, ok: false, r: `S(${q1}) = 0: in het rood vanaf 1 ${MAANDEN[q1]} (${q1} maanden na 1 september).` });
    L.push({ t: `Het meeste geld heeft de jeugdbeweging na ongeveer ${kg(r1(S.lokMax.x))} maanden: ${kg(r1(S.lokMax.y))} euro.`, ok: false, r: `Dat is een lokaal maximum. Het absolute maximum is S(0) = ${S0} euro, op 1 september.`, c: { vraag: 'Hoeveel geld heeft de jeugdbeweging op het moment dat ze het meeste geld heeft?', antw: getal(S0, { na: '\\text{ euro}' }) } });
    L.push({ t: `Op 1 september staat er ${S0} euro op de rekening.`, ok: true, r: `S(0) = ${S0}.` });
    L.push({ t: `Van 1 ${MAANDEN[q1]} tot 1 ${MAANDEN[q2]} staat de rekening in het rood.`, ok: true, r: 'Juist: daar is S negatief.' });
    L.push({ t: `De grootste schuld is ongeveer ${kg(r0(-S.min.y))} euro.`, ok: true, r: `Laagste punt ≈ (${kg(r1(S.min.x))} ; ${kg(r1(S.min.y))}).` });
  }
  if (fam === 'baby') {
    const { p, q, G0 } = S;
    L.push({ t: `Het minimum is ${p}.`, ok: false, r: `${p} is de dag (x-waarde). Het minimum is ${q} gram.`, c: { vraag: 'Hoe groot is het minimum?', antw: getal(q, { na: '\\text{ gram}' }) } });
    L.push({ t: `De baby verliest dus ${p} gram.`, ok: false, r: `De baby verliest ${G0} − ${q} = ${G0 - q} gram.`, c: { vraag: 'Hoeveel gram verliest de baby?', antw: getal(G0 - q, { na: '\\text{ gram}' }) } });
    L.push({ t: `Na dag ${p} neemt het gewicht verder af.`, ok: false, r: `Na dag ${p} neemt het gewicht toe: G stijgt op [${p} ; 14].` });
    L.push({ t: 'Er zijn geen nulpunten, dus de functie bestaat niet op de x-as.', ok: false, r: 'Geen nulpunten betekent dat het gewicht nooit 0 gram is. De functie bestaat wel voor elke x.' });
    L.push({ t: `Op dag ${p} weegt de baby het minst: ${q} gram.`, ok: true, r: `Laagste punt (${p} ; ${q}).` });
    L.push({ t: `Op dag ${2 * p} weegt de baby opnieuw ${G0} gram.`, ok: true, r: `G(${2 * p}) = ${G0}.` });
    L.push({ t: 'Het gewicht is nooit 0 gram: G heeft geen nulpunten.', ok: true, r: 'Juist.' });
  }
  if (fam === 'doos') {
    const { A, B } = S;
    L.push({ t: `Het praktisch domein is [0 ; ${A / 2}], want V(${A / 2}) = 0.`, ok: false, r: `Het vierkantje moet kleiner zijn dan de helft van de breedte: praktisch domein ]0 ; ${kg(B / 2)}[.` });
    L.push({ t: 'Het bereik is ℝ, want V is een veeltermfunctie van de derde graad.', ok: false, r: `Op het praktisch domein ligt het volume tussen 0 en ongeveer ${kg(r1(S.max.y))} cm³: ber V = ]0 ; ${kg(r1(S.max.y))}].` });
    L.push({ t: `De doos is het grootst bij x = ${kg(r1(S.max.y))} cm.`, ok: false, r: `${kg(r1(S.max.y))} is het volume (y-waarde). Het volume is het grootst bij x ≈ ${kg(r1(S.max.x))} cm.`, c: { vraag: 'Bij welke x is de doos het grootst?', antw: getal(S.max.x, { dec: 1, voor: 'x =', na: '\\text{ cm}' }) } });
    L.push({ t: `Het praktisch domein is ]0 ; ${kg(B / 2)}[.`, ok: true, r: 'Juist.' });
    L.push({ t: `Het grootste volume is ongeveer ${kg(r1(S.max.y))} cm³.`, ok: true, r: `Hoogste punt ≈ (${kg(r1(S.max.x))} ; ${kg(r1(S.max.y))}).` });
    L.push({ t: 'Het wiskundig domein is ℝ.', ok: true, r: 'Juist: in een veeltermfunctie kan je elk getal invullen.' });
  }
  if (fam === 'spoed') {
    const { t1, t2, t3 } = S;
    L.push({ t: `W stijgt op ]6 ; ${t1}[ en daalt op [${t2} ; ${t3}].`, ok: false, r: `W stijgt op [6 ; ${t1}] en op [${t2} ; ${t3}], en daalt op [${t1} ; ${t2}] en op [${t3} ; 22].` });
    L.push({ t: `Om ${t2} u zitten er het minst patiënten van de hele dag in de wachtzaal.`, ok: false, r: `${t2} u is een lokaal minimum. Om 6 u of om 22 u zijn er minder patiënten (W(6) ≈ ${kg(r0(S.W6))}, W(22) ≈ ${kg(r0(S.W22))}).` });
    L.push({ t: `Het drukste moment is om ${S.max.y} u.`, ok: false, r: `${S.max.y} is het aantal patiënten. Het drukste moment is om ${t3} u.`, c: { vraag: 'Om hoe laat is het drukste moment?', antw: getal(t3, { voor: '\\text{om}', na: '\\text{ u}' }) } });
    L.push({ t: `Om ${t3} u is het het drukst: ${S.max.y} patiënten.`, ok: true, r: 'Juist.' });
    L.push({ t: 'De wachtzaal is nooit helemaal leeg tussen 6 u en 22 u.', ok: true, r: 'Juist: W heeft geen nulpunten.' });
    L.push({ t: `Tussen ${t1} u en ${t2} u neemt het aantal patiënten af.`, ok: true, r: 'Juist.' });
  }
  if (S.min && S.min.y < 0 && W.grensgeval(-S.min.y, 0)) S.min.y += 0.01;
  return { S, L };
}
function vraagJuistFout() {
  const { S, L } = uitspraken(), u = kies(L);
  return { soort: 'juistfout', opdracht: 'Tip: controleer met het grafiekvenster.', html: `${sitOpgave(S)}<p>Een leerling schrijft:</p><p class="midden"><i>"${u.t}"</i></p>${vraag('Is die zin juist of fout?')}${sitVenster(S, { t: 'vfsm', buiten: true })}`, sleutel: S.e + u.t,
    rapport: `${S.titel}: "${u.t}"`, antw: { soort: 'keuze', opties: [{ k: 'j', l: '\\text{juist}' }, { k: 'f', l: '\\text{fout}' }], juist: u.ok ? 'j' : 'f' }, uitleg: [tx(u.ok ? 'Juist.' : 'Fout.'), tx(u.r)] };
}
function vraagWelkeFout() {
  const { S, L } = uitspraken(), f = kies(L.filter(u => !u.ok)), j = schud(L.filter(u => u.ok)).slice(0, 3);
  const naam = kies(['Ruben', 'Amina', 'Lotte', 'Jonas', 'Sem', 'Noor', 'Yassin', 'Elif']);
  return { soort: 'welkefout', opdracht: 'Tip: controleer met het grafiekvenster.', html: sitOpgave(S, `${vraag(`${naam} schreef vier zinnen over deze situatie. Eén zin is fout. Welke?`)}${sitVenster(S, { t: 'vfsm', buiten: true })}`), sleutel: S.e + f.t,
    rapport: `${S.titel}: fout zoeken`, antw: zinnen(f.t, j.map(u => u.t)), uitleg: [tx(`Fout: "${f.t}"`), tx(f.r)] };
}
function vraagVerbeter() {
  let S, u; do { const r = uitspraken(); S = r.S; u = kies(r.L.filter(x => x.c)); } while (!u);
  return { soort: 'verbeter', opdracht: 'Tip: controleer met het grafiekvenster.', html: `${sitOpgave(S)}<p>Een leerling schrijft deze zin. De zin is fout:</p><p class="midden"><i>"${u.t}"</i></p>${vraag(u.c.vraag)}${sitVenster(S, { t: 'vfsm', buiten: true })}`, sleutel: S.e + u.t,
    rapport: `${S.titel}: verbeter "${u.t}"`, antw: u.c.antw, uitleg: [tx(u.r)] };
}
const D9 = {
  nr: 9, titel: 'Foutenanalyse', kort: 'Fouten van leerlingen opsporen en verbeteren.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Typische fouten</div>
      <p>In de werkbundel beantwoordden Ruben, Amina, Lotte, Jonas en Sem vragen over de situaties uit hoofdstuk 1 en 2. In hun antwoorden zitten fouten die vaak gemaakt worden:</p>
      <ul><li><b>x-waarde en y-waarde verwisselen</b>: "het maximum is 4" terwijl 4 de tijd is (het maximum is 12,8 mg/l, na 4 uur).</li>
      <li><b>Domein en bereik verwarren</b>: het bereik gaat over de $y$-waarden, het domein over de $x$-waarden.</li>
      <li><b>Een lokaal maximum of minimum verwarren met het absolute</b>: een dal is niet altijd het rustigste moment van de dag; het meeste geld kan aan de rand van het domein staan.</li>
      <li><b>Het praktisch domein vergeten</b>: wat de formule geeft buiten het praktisch domein, heeft geen betekenis (V(16) bij de doos).</li>
      <li><b>Tekenschema en verloopschema verwarren</b>: "in het rood" gaat over het teken, "het saldo daalt" over het verloop.</li>
      <li><b>Haakjes bij de grenzen</b>: $W$ stijgt op $[6 \\,;\\, 9]$, niet op ${M('{]}6 \\,;\\, 9{[}')}$.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: Ruben en de pijnstiller</div>
      <p>$C(t) = 0{,}05t^3 - 1{,}2t^2 + 7{,}2t$ met $0 \\leq t \\leq 12$. Ruben schreef:</p>
      <ul><li><i>"dom C = ℝ en ber C = [0 ; 12]"</i> → Het praktisch domein is $[0 \\,;\\, 12]$ en het bereik is $[0 \\,;\\, 12{,}8]$: 12 is een $x$-waarde.</li>
      <li><i>"Het maximum is 4."</i> → Het maximum is 12,8 mg/l (na 4 uur): 4 is de $x$-waarde.</li>
      <li><i>"C is stijgend op [0 ; 12,8]."</i> → $C$ stijgt op $[0 \\,;\\, 4]$ en daalt op $[4 \\,;\\, 12]$.</li>
      <li><i>"Na 12 uur wordt de concentratie negatief."</i> → Na 12 uur is de pijnstiller uitgewerkt; wat de formule daarna geeft, ligt buiten het praktisch domein.</li></ul></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Baby: $G(d) = 6d^2 - 60d + 3500$ met $0 \\leq d \\leq 14$.')}<p>Lotte: <i>"Het minimum is 5. De baby verliest dus 5 gram."</i></p>`,
      stappen: ['\\text{Fout: 5 is de dag (x-waarde). Het minimum is } G(5) = 3350 \\text{ gram.}', '\\text{De baby verliest } 3500 - 3350 = 150 \\text{ gram.}'] },
  ],
  soorten: {
    juistfout: { naam: 'Juist of fout?', gen: vraagJuistFout },
    welkefout: { naam: 'Welke zin is fout?', gen: vraagWelkeFout },
    verbeter: { naam: 'Verbeter de fout', gen: vraagVerbeter },
  },
  oefenMix: [['juistfout', 2], ['welkefout', 1], ['verbeter', 1]],
  test: [['juistfout', 4], ['welkefout', 3], ['verbeter', 3]], testSchudden: true,
};

// ===================================================================
//  9 · MODELLEN AANPASSEN
// ===================================================================
function vraagConcModel() {
  const [T, Mx] = kies([[10, 8], [12, 12.8], [9, 10.8], [12, 16], [15, 10], [6, 4]]), tm = T / 3, a = 27 * Mx / (4 * T ** 3);
  const pv = venster({ fs: [{ e: 'a*x*(x-b)**2', n: 'C' }], par: [{ n: 'a', w: 0.01 }, { n: 'b', w: 5 }], X: [0, T + 3], Y: [0, top(Mx * 1.6)], a: 0, b: T + 3, xv: 't', xe: 'uur', ye: 'mg/l', xn: 't (uur)', yn: 'concentratie (mg/l)', t: 'pvm', pts: [{ x: tm, y: Mx }, { x: T, y: 0 }], buiten: false, geenDomein: true });
  return { soort: 'conc', opdracht: 'Tip: vul in het grafiekvenster waarden in voor a en b. Gaat de grafiek door de oranje punten?', html: `${opgave(`Een apotheker beschrijft de concentratie van een nieuw geneesmiddel (in mg/l) met het model hieronder. Het middel moet na ${T} uur volledig uitgewerkt zijn. De maximale concentratie moet ${kg(Mx)} mg/l zijn.`)}<p class="midden">$C(t) = a \\cdot t \\cdot (t - b)^2$</p>${vraag('Welke waarden hebben b en a? Rond a af op 0,001.')}${pv}`,
    sleutel: `${T}${Mx}`, rapport: `concentratiemodel: a en b (uitgewerkt na ${T} uur, max ${kg(Mx)})`, antw: delen(['b =', getal(T)], ['a =', getal(a, { dec: 3 })]),
    uitleg: [`C(b) = 0: \\text{ het middel is uitgewerkt na } b \\text{ uur, dus } b = ${T}`, `\\text{Het maximum ligt bij } t = \\dfrac{b}{3} = ${tg(tm)}: \\; a \\cdot ${tg(tm)} \\cdot ${tg(tm - T)}^2 = ${tg(Mx)} \\Rightarrow a \\approx ${tg(W.rond(a, 3))}`] };
}
function vraagFonteinModel() {
  const [L, H] = kies([[6, 3], [8, 4], [10, 5], [8, 2], [12, 3], [10, 4]]), a = -4 * H / L / L;
  const pv = venster({ fs: [{ e: 'a*x*(x-b)', n: 'h' }], par: [{ n: 'a', w: -0.1 }, { n: 'b', w: 4 }], X: [0, L + 3], Y: [0, top(H * 1.6)], a: 0, b: L + 3, xv: 'x', xe: 'm', ye: 'm', xn: 'x (m)', yn: 'hoogte (m)', t: 'pvm', pts: [{ x: L / 2, y: H }, { x: L, y: 0 }], buiten: false, geenDomein: true });
  return { soort: 'fontein', opdracht: 'Tip: vul in het grafiekvenster waarden in voor a en b. Let op: a is negatief.', html: `${opgave(`Een tuinarchitect ontwerpt een fontein met het model hieronder (x en h in meter). De straal moet ${L} m verder neerkomen en maximaal ${kg(H)} m hoog zijn.`)}<p class="midden">$h(x) = a \\cdot x \\cdot (x - b)$</p>${vraag('Welke waarden hebben b en a? Rond a af op 0,001.')}${pv}`,
    sleutel: `${L}${H}`, rapport: `fonteinmodel: a en b (${L} m, ${kg(H)} m hoog)`, antw: delen(['b =', getal(L)], ['a =', getal(a, { dec: 3 })]),
    uitleg: [`h(b) = 0: \\text{ de straal komt neer bij } x = b, \\text{ dus } b = ${L}`, `\\text{De top ligt in het midden, bij } x = ${tg(L / 2)}: \\; a \\cdot ${tg(L / 2)} \\cdot (${tg(L / 2)} - ${L}) = ${tg(H)} \\Rightarrow a = ${tg(W.rond(a, 3))}`] };
}
function vraagBabyModel() {
  const G0 = kies([3000, 3500, 4000]), pct = kies([5, 8, 10]), p = kies([4, 5]), q = G0 * (1 - pct / 100), a = (G0 - q) / p / p;
  const pv = venster({ fs: [{ e: 'a*(x-p)**2+q', n: 'G' }], par: [{ n: 'a', w: 1 }, { n: 'p', w: 1 }, { n: 'q', w: 3000 }], X: [0, 14], Y: [Math.floor((q - 300) / 100) * 100, Math.ceil((G0 + 500) / 100) * 100], a: 0, b: 14, xv: 'd', xe: 'dagen', ye: 'gram', xn: 'd (dagen)', yn: 'gewicht (gram)', t: 'pvm', pts: [{ x: 0, y: G0 }, { x: p, y: q }], buiten: false, geenDomein: true });
  const naam = kies(['Noor', 'Lina', 'Adam', 'Milan']);
  return { soort: 'baby', opdracht: 'Tip: p en q lees je meteen af uit het laagste punt. Zoek daarna a.', html: `${opgave(`Baby ${naam} weegt bij de geboorte ${G0} gram. ${naam} verliest ${pct} % van het geboortegewicht en weegt het minst op dag ${p}. We gebruiken het model`)}<p class="midden">$G(d) = a(d - p)^2 + q$</p>${vraag('Welke waarden hebben p, q en a?')}${pv}`,
    sleutel: `${G0}${pct}${p}`, rapport: `babymodel (${G0} g, ${pct} %, dag ${p})`, antw: delen(['p =', getal(p)], ['q =', getal(q)], ['a =', getal(a, { dec: 2 })]),
    uitleg: [`\\text{Laagste punt } (p \\,;\\, q) = (${p} \\,;\\, ${tg(q)}), \\text{ want } ${pct}\\,\\% \\text{ van } ${G0} = ${tg(G0 - q)} \\text{ en } ${G0} - ${tg(G0 - q)} = ${tg(q)}`,
      `G(0) = a \\cdot ${p}^2 + ${tg(q)} = ${G0} \\Rightarrow a = \\dfrac{${tg(G0 - q)}}{${p * p}} \\approx ${tg(W.rond(a, 2))}`, tx(`${naam} zit terug op het geboortegewicht op dag ${2 * p}.`)] };
}
function vraagRol() {
  const T = kies([
    { m: 'C(t) = a \\cdot t \\cdot (t - b)^2', v: 'Welke parameter bepaalt wanneer het geneesmiddel uitgewerkt is?', j: 'b: na b uur is de concentratie weer 0.', f: ['a: na a uur is de concentratie 0.', 'a en b samen: na a · b uur.', 'Geen enkele: het middel is altijd na 12 uur uitgewerkt.'] },
    { m: 'C(t) = a \\cdot t \\cdot (t - b)^2', v: 'Wat gebeurt er als je a groter maakt (b blijft gelijk)?', j: 'De concentratie wordt overal groter, maar het middel is op hetzelfde moment uitgewerkt.', f: ['Het middel is later uitgewerkt.', 'Het maximum valt vroeger.', 'De grafiek wordt een dalparabool.'] },
    { m: 'C(t) = a \\cdot t \\cdot (t - b)^2', v: 'Wanneer valt het maximum?', j: 'Altijd op een derde van b: bij t = b/3. Het maximum valt dus vroeger als het middel vroeger uitgewerkt is.', f: ['Altijd in het midden: bij t = b/2.', 'Altijd bij t = a.', 'Het maximum valt altijd na 4 uur.'] },
    { m: 'h(x) = a \\cdot x \\cdot (x - b)', v: 'Wat gebeurt er met de straal als je a dichter bij 0 brengt (bij dezelfde b)?', j: 'De straal wordt minder hoog, maar komt op dezelfde plaats neer.', f: ['De straal komt verder neer.', 'De straal wordt hoger.', 'De straal komt dichter bij de spuitmond neer.'] },
    { m: 'h(x) = a \\cdot x \\cdot (x - b)', v: 'Wat gebeurt er met de straal als je b groter maakt (bij dezelfde a)?', j: 'De straal komt verder neer en wordt ook hoger.', f: ['De straal komt verder neer, maar wordt lager.', 'Er verandert niets.', 'De straal komt dichter bij de spuitmond neer.'] },
    { m: 'G(d) = a(d - p)^2 + q', v: 'Wat betekenen p en q in de situatie?', j: 'Op dag p weegt de baby het minst: q gram.', f: ['Op dag q weegt de baby het minst: p gram.', 'p is het geboortegewicht en q de dag.', 'p en q zijn de nulpunten.'] },
    { m: 'C(t) = 0{,}05t^3 - 1{,}2t^2 + 7{,}2t = 0{,}05 \\cdot t \\cdot (t - 12)^2', v: 'In welke vorm zie je meteen wanneer het middel uitgewerkt is?', j: 'In de tweede vorm: 0,05 · t · (t − 12)² toont meteen de nulpunten 0 en 12.', f: ['In de eerste vorm: daar staan alle coëfficiënten.', 'In geen van beide: je moet altijd het grafiekvenster gebruiken.', 'In de eerste vorm: het nulpunt is 7,2.'] },
  ]);
  return { soort: 'rol', opdracht: 'Kies het juiste antwoord.', html: `<p class="midden">$${T.m}$</p>${vraag(T.v)}`, sleutel: T.m + T.v, rapport: `${W.platteTekst(T.m)}: ${T.v}`, antw: zinnen(T.j, T.f), uitleg: [tx(T.j)] };
}
const D10 = {
  nr: 10, titel: 'Modellen op maat', kort: 'Parameters met een betekenis: een model op maat maken.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een model op maat</div>
      <p>Tot nu toe kreeg je een kant-en-klaar voorschrift. Nu maak je zelf een model op maat, met <b>parameters</b>. Kies een vorm waarin je de betekenis van de parameters meteen ziet:</p>
      <table class="tabel"><tr><th>Model</th><th>Betekenis van de parameters</th></tr>
      <tr><td>$C(t) = a \\cdot t \\cdot (t - b)^2$</td><td>nulpunten $0$ en $b$: na $b$ uur is het middel uitgewerkt; het maximum ligt bij $t = \\dfrac{b}{3}$; $a$ bepaalt hoe hoog het maximum is</td></tr>
      <tr><td>$h(x) = a \\cdot x \\cdot (x - b)$</td><td>nulpunten $0$ en $b$: de straal komt neer bij $x = b$; de top ligt in het midden; $a < 0$ (bergparabool) bepaalt hoe hoog</td></tr>
      <tr><td>$G(d) = a(d - p)^2 + q$</td><td>top (laagste punt) $(p \\,;\\, q)$: op dag $p$ weegt de baby het minst, $q$ gram; $a$ volgt uit het geboortegewicht $G(0)$</td></tr></table></div>
    <div class="kader eig"><div class="kader-titel">Zo probeer je een model uit in het grafiekvenster</div>
      <ol><li>In het grafiekvenster staat het model al klaar, met vakjes voor de parameters (bv. <i>a</i> en <i>b</i>).</li>
      <li>Typ een waarde in een vakje. De grafiek verandert meteen.</li>
      <li>De <b>oranje punten</b> zijn de gegevens uit het verhaal. Pas de parameters aan tot de grafiek door die punten gaat.</li>
      <li>Zoek eerst de parameter die je meteen ziet (bv. het nulpunt $b$), en daarna de andere.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een geneesmiddel op maat</div>
      <p>$C(t) = a \\cdot t \\cdot (t - b)^2$; het middel is na 10 uur uitgewerkt en het maximum is 8 mg/l.</p>
      <p>$b = 10$ (het nulpunt). Het maximum ligt bij $t = \\dfrac{10}{3} \\approx 3{,}33$ uur (3 uur en 20 minuten): $a \\cdot \\dfrac{10}{3} \\cdot \\left(\\dfrac{10}{3} - 10\\right)^2 = 8 \\Rightarrow a = 0{,}054$.</p>
      ${figuur(rgraf({ x: [0, 12], y: [0, 10], xs: 1, ys: 1, xn: 't (uur)', yn: 'concentratie (mg/l)', functies: [{ f: (t) => 0.054 * t * (t - 10) ** 2, e: '0.054*x*(x-10)**2', van: 0, tot: 10 }], punten: [{ x: 10 / 3, y: 8 }, { x: 10, y: 0 }] }))}
      <p>Verander je $b$, dan verschuift ook het maximum (altijd op een derde van $b$). Het maximum vroeger laten vallen zonder het tijdstip van uitwerken te veranderen, kan dus niet met dit model.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: babygewicht</div>
      <p>$G(d) = 6d^2 - 60d + 3500 = 6(d - 5)^2 + 3350$: op dag $p = 5$ weegt de baby het minst, $q = 3350$ gram. Werk uit ter controle: $6(d^2 - 10d + 25) + 3350 = 6d^2 - 60d + 3500$.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Fontein: $h(x) = a \\cdot x \\cdot (x - b)$. De straal moet 6 m verder neerkomen en maximaal 3 m hoog zijn.')}<p>Bepaal $a$ en $b$.</p>`,
      stappen: ['b = 6 \\text{ (de straal komt neer bij } x = 6)', '\\text{top in het midden: } h(3) = a \\cdot 3 \\cdot (3 - 6) = -9a = 3 \\Rightarrow a = -\\dfrac{1}{3} \\approx -0{,}333'] },
  ],
  soorten: {
    conc: { naam: 'Geneesmiddel: a en b', gen: vraagConcModel },
    fontein: { naam: 'Fontein: a en b', gen: vraagFonteinModel },
    baby: { naam: 'Babygewicht: p, q en a', gen: vraagBabyModel },
    rol: { naam: 'Wat doet de parameter?', gen: vraagRol },
  },
  oefenMix: [['conc', 1], ['fontein', 1], ['baby', 1], ['rol', 1]],
  test: [['conc', 2], ['fontein', 2], ['baby', 3], ['rol', 3]], testSchudden: true,
};

// ===================================================================
//  EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D11 = {
  nr: 11, titel: 'Eindtest veeltermfuncties in context', kort: 'Uit elk hoofdstuk één vraag.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest krijg je uit elk hoofdstuk één vraag. Herhaal gerust de theorie van een vorig deel.</p></div>${LET_OP}${GEOGEBRA}${AFSPRAAK}`,
  voorbeelden: [],
  soorten: {
    e1: mix(D1, 'betekenis', 'Woordenlijst'), e2: mix(D2, 'max', 'Aflezen en interpreteren'), e3: mix(D3, 'praktdom', 'Praktisch domein'),
    e4: mix(D4, 'extra', 'Kritisch kijken'), e5: mix(D5, 'grafsit', 'Koppelen'), e6: mix(D6, 'vgraf', 'Van situatie naar schets'),
    e7: mix(D7, 'nulint', 'Van kenmerken naar schets'), e8: mix(D8, 'vertaal', 'Een grafiek vertellen'), e9: mix(D9, 'welkefout', 'Foutenanalyse'), e10: mix(D10, 'fontein', 'Modellen aanpassen'),
  },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: false,
};

// alle opgaven met tekst links uitgelijnd in gewone tekstgrootte
for (const D of [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen;
    s.gen = () => {
      const v = { ...g() };
      if (v.html) v.html = woorden(v.html);
      if (v.html && !/^<div class="tekstopgave">/.test(v.html)) v.html = `<div class="tekstopgave">${v.html}</div>`;
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
for (const D of [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11]) {
  D.theorie = woorden(D.theorie);
  for (const vb of D.voorbeelden || []) if (vb.html) vb.html = woorden(vb.html);
}

Leerpaden.registreer({
  code: 'veeltermfuncties-context',
  titel: 'Veeltermfuncties in context',
  ondertitel: 'Wiskunde · 5WW / 5BCW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert wat de kenmerken van een veeltermfunctie (domein, bereik, beginwaarde, nulpunten, teken- en verloopschema, maximum en minimum) <b>betekenen in een echte situatie</b>:
    een geneesmiddel in het bloed, de drukte op een spoeddienst, het gewicht van een pasgeboren baby, het budget van een jeugdbeweging … Elk deel volgt een hoofdstuk van de werkbundel.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p><b>Geen GeoGebra nodig:</b> bij de rekenvragen staat de grafiek al klaar in een grafiekvenster, met de formule erin.
    <b>Moeilijke woorden</b> hebben een oranje stippellijn: raak ze aan voor de uitleg. <b>Afronden:</b> bij elke rekenvraag staat op hoeveel decimalen je afrondt.</p>`,
  groepen: [
    { titel: 'A · Kenmerken in context (hoofdstuk 0–1)', delen: [1, 2] },
    { titel: 'B · Domein en kritisch kijken (hoofdstuk 2–3)', delen: [3, 4] },
    { titel: 'C · Grafiek en situatie (hoofdstuk 4–7)', delen: [5, 6, 7, 8] },
    { titel: 'D · Fouten en modellen (hoofdstuk 8–9)', delen: [9, 10] },
    { titel: 'E · Eindtest', delen: [11] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11],
});
