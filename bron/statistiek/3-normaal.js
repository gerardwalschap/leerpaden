// ===================================================================
//  C · DE NORMALE VERDELING (delen 6–8) en D · EINDTEST (deel 9)
// ===================================================================
const NORMCTX = [
  { t: 'De lengte van volwassen vrouwen', m: () => rnd(158, 168), s: () => kies([6, 7, 8]), e: 'cm', wie: 'vrouwen', een: 'vrouw', v: (r) => `is ${r} groot`, b: (r) => `${r} groot is` },
  { t: 'De lengte van volwassen mannen', m: () => rnd(175, 183), s: () => kies([6, 7, 8]), e: 'cm', wie: 'mannen', een: 'man', v: (r) => `is ${r} groot`, b: (r) => `${r} groot is` },
  { t: 'Het IQ', m: () => 100, s: () => 15, e: '', wie: 'mensen', een: 'persoon', v: (r) => `heeft een IQ van ${r}`, b: (r) => `een IQ van ${r} heeft` },
  { t: 'De levensduur van een batterij', m: () => kies([400, 450, 500, 550, 600]), s: () => kies([20, 25, 40, 50]), e: 'uur', wie: 'batterijen', een: 'batterij', v: (r) => `gaat ${r} mee`, b: (r) => `${r} meegaat` },
  { t: 'Het gewicht van appels uit een boomgaard', m: () => kies([140, 145, 150, 155, 160]), s: () => kies([10, 15, 20]), e: 'g', wie: 'appels', een: 'appel', v: (r) => `weegt ${r}`, b: (r) => `${r} weegt` },
  { t: 'De inhoud van de flessen die een machine vult', m: () => kies([330, 500, 750]), s: () => kies([2, 3, 4, 5]), e: 'ml', wie: 'flessen', een: 'fles', v: (r) => `bevat ${r}`, b: (r) => `${r} bevat` },
  { t: 'Het geboortegewicht van baby’s', m: () => kies([3300, 3400, 3500]), s: () => kies([400, 450, 500]), e: 'g', wie: 'baby’s', een: 'baby', v: (r) => `weegt bij de geboorte ${r}`, b: (r) => `bij de geboorte ${r} weegt` },
  { t: 'De reactietijd van deelnemers aan een test', m: () => kies([250, 260, 270, 280]), s: () => kies([20, 25, 30]), e: 'ms', wie: 'deelnemers', een: 'deelnemer', v: (r) => `heeft een reactietijd van ${r}`, b: (r) => `een reactietijd van ${r} heeft` },
  { t: 'Het gewicht van pakken suiker', m: () => 1000, s: () => kies([4, 5, 8]), e: 'g', wie: 'pakken', een: 'pak', v: (r) => `weegt ${r}`, b: (r) => `${r} weegt` },
];
function normCtx() { const C = kies(NORMCTX), m = C.m(), s = C.s(); return { ...C, m, s, eh: C.e ? ' ' + C.e : '', zin: `${C.t} is normaal verdeeld met x̄ = ${tekst(m)}${C.e ? ' ' + C.e : ''} en s = ${tekst(s)}${C.e ? ' ' + C.e : ''}.` }; }
const waardeTekst = (C, x) => `${tekst(W.rond(x, 6))}${C.eh}`;

// ---- 6. De normale kromme ----------------------------------------------------------------------------------
const VORMEN = {
  normaal: (k) => { const c = (k - 1) / 2; return Array.from({ length: k }, (_, i) => Math.round(40 * Math.exp(-((i - c) ** 2) / (2 * (k / 6) ** 2))) + rnd(0, 2)); },
  scheef: (k) => Array.from({ length: k }, (_, i) => Math.max(1, Math.round(42 * Math.exp(-0.45 * Math.max(0, i - 1)) * (i === 0 ? 0.65 : 1)) + rnd(0, 2))),
  tweetoppen: (k) => Array.from({ length: k }, (_, i) => Math.round(30 * Math.exp(-((i - k * 0.22) ** 2) / 2.2) + 24 * Math.exp(-((i - k * 0.72) ** 2) / 2.6)) + rnd(1, 2)),
};
const MODELCTX = [
  ['normaal', 'De lengte van 300 leerlingen van het 6de jaar (cm).', 150, 4], ['normaal', 'Het gewicht van 300 appels (g).', 100, 10], ['normaal', 'De punten van 250 leerlingen op een grote toets.', 0, 2],
  ['scheef', 'De wachttijd aan een loket (min).', 0, 2], ['scheef', 'Het aantal uren dat 200 jongeren per week gamen.', 0, 3],
  ['tweetoppen', 'De leeftijd van alle bezoekers van een kinderfuif: kinderen en hun ouders (jaar).', 0, 5], ['tweetoppen', 'De lengte van 200 mensen: kinderen van 6 jaar en hun ouders (cm).', 100, 8],
];
const D6 = {
  nr: 6, titel: 'De normale kromme', kort: 'Klokvormig en symmetrisch: top bij x̄, buigpunten bij x̄ − s en x̄ + s.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Van histogram naar Gausskromme</div>
      <p>Het histogram van de lengte van 2050 vrouwen is hoog in het midden, symmetrisch, en naar links en rechts steeds lager. Een vloeiende kromme die het histogram volgt, heet een <b>Gausskromme</b> of <b>normale kromme</b>.</p>
      ${kromme([{ m: 160.4, s: 7.4 }], { ticks: [140, 150, 160, 170, 180].map(v => ({ v })), as: [134, 187], hoog: 130, hist: 3 })}
      <p class="midden">$\\bar{x} = 160{,}4$ cm &nbsp; $s = 7{,}4$ cm &nbsp; → &nbsp; $N(160{,}4;\\, 7{,}4)$</p></div>
    <div class="kader def"><div class="kader-titel">Normaal verdeelde gegevens</div>
      <ul><li>klokvormig en <b>symmetrisch</b> rond het gemiddelde;</li><li>de meeste gegevens liggen dicht bij $\\bar{x}$; hoe verder van $\\bar{x}$, hoe minder gegevens;</li>
      <li>notatie: $N(\\bar{x};\\, s)$. De kromme is een continu model: ze beschrijft de gegevens benaderend.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Top en buigpunten</div>
      ${kromme([{ m: 0, s: 1 }], { buig: true, top: true, ticks: [{ v: -1, l: 'x̄ − s' }, { v: 0, l: 'x̄' }, { v: 1, l: 'x̄ + s' }], hoog: 130 })}
      <p>De <b>top</b> ligt bij $\\bar{x}$. De <b>buigpunten</b> (waar de kromme van "bol" naar "hol" gaat) liggen bij $\\bar{x} - s$ en $\\bar{x} + s$.</p></div>
    <div class="kader eig"><div class="kader-titel">x̄ en s veranderen</div>
      ${kromme([{ m: 20, s: 2, label: 'A' }, { m: 30, s: 2, label: 'B', kleur: ORANJE }, { m: 20, s: 4, label: 'C', kleur: GROEN }], { as: [6, 40], ticks: [10, 20, 30].map(v => ({ v })), hoog: 130 })}
      <ul><li>Groter gemiddelde (A → B): de kromme <b>schuift naar rechts</b>, zelfde vorm.</li><li>Grotere $s$ (A → C): de kromme wordt <b>breder en lager</b> (de oppervlakte blijft 100 %).</li></ul></div>
`,
  voorbeelden: [
    { html: `${opgave('Lees het gemiddelde en de standaardafwijking af. De buigpunten zijn aangeduid.')}${kromme([{ m: 50, s: 4 }], { buig: true, ticks: [38, 42, 46, 50, 54, 58, 62].map(v => ({ v })) })}`,
      stappen: ['\\text{top bij 50: } \\bar{x} = 50', '\\text{buigpunten bij 46 en 54: } s = 54 - 50 = 4', 'N(50;\\, 4)'] },
  ],
  soorten: {
    aflezen: { naam: 'x̄ en s aflezen', gen() {
      const s = kies([2, 3, 4, 5, 10, 15, 20]), m = s * rnd(5, 30), stap = s, ts = [-3, -2, -1, 0, 1, 2, 3].map(k => ({ v: m + k * stap }));
      const fig = kromme([{ m, s }], { buig: true, ticks: ts }), v = kies(['beide', 'notatie']);
      if (v === 'notatie') return { soort: 'aflezen', opdracht: 'De buigpunten zijn aangeduid. Welke normale verdeling is dit?', html: fig, sleutel: `${m},${s}n`, rapport: `N(${m}; ${s}) herkennen`,
        antw: uniekKeuze(`N(${m};\\, ${s})`, [`N(${s};\\, ${m})`, `N(${m};\\, ${2 * s})`, `N(${m + s};\\, ${s})`, `N(${m};\\, ${3 * s})`]), uitleg: [`\\text{top: } \\bar{x} = ${m}`, `\\text{buigpunt bij } ${m + s}: s = ${m + s} - ${m} = ${s}`] };
      return { soort: 'aflezen', opdracht: 'Lees het gemiddelde en de standaardafwijking af. De buigpunten zijn aangeduid.', html: fig, sleutel: `${m},${s}`, rapport: `x̄ en s aflezen (N(${m}; ${s}))`,
        antw: delen(['\\bar{x} =', getal(m)], ['s =', getal(s)]), uitleg: [`\\text{top: } \\bar{x} = ${m}`, `\\text{buigpunten bij } ${m - s} \\text{ en } ${m + s}: s = ${s}`] };
    } },
    koppel: { naam: 'Welke kromme?', gen() {
      const s = kies([2, 3, 4, 5]), m = s * rnd(4, 8), d = s * kies([3, 4, 5]), s2 = s * kies([2, 3]);
      const K = schud([{ m, s }, { m, s: s2 }, { m: m + d, s }]), L = ['A', 'B', 'C'], kl = [BLAUW, ORANJE, GROEN];
      K.forEach((c, i) => { c.label = L[i]; c.kleur = kl[i]; });
      const A0 = m - 3.2 * s2, A1 = Math.max(m + d + 3.5 * s, m + 3.2 * s2), stap = s * (A1 - A0 > 24 * s ? 4 : 2), ts = [];
      for (let v = Math.ceil(A0 / stap) * stap; v <= A1; v += stap) ts.push({ v });
      const doel = kies(K), i = K.indexOf(doel);
      return { soort: 'koppel', opdracht: `Welke kromme hoort bij N(${doel.m}; ${doel.s})?`, html: kromme(K, { as: [A0, A1], ticks: ts }), sleutel: JSON.stringify(K.map(c => [c.m, c.s])) + i, rapport: `kromme bij N(${doel.m}; ${doel.s})`,
        antw: keuze(kT(L), i), uitleg: [`\\text{top bij } ${doel.m}`, doel.s === s2 ? '\\text{de grootste } s \\text{: de breedste en laagste kromme}' : `\\text{kleine } s = ${s} \\text{: smal en hoog}`, `\\text{kromme ${L[i]}}`] };
    } },
    verander: { naam: 'x̄ en s veranderen', gen() {
      const V = kies([
        ['Het gemiddelde wordt groter, de standaardafwijking blijft gelijk. Wat gebeurt er met de normale kromme?', 'De kromme schuift naar rechts en houdt dezelfde vorm.', ['De kromme wordt breder en lager.', 'De kromme wordt smaller en hoger.', 'De kromme schuift naar links.']],
        ['Het gemiddelde wordt kleiner, de standaardafwijking blijft gelijk. Wat gebeurt er met de normale kromme?', 'De kromme schuift naar links en houdt dezelfde vorm.', ['De kromme wordt breder en lager.', 'De kromme schuift naar rechts.', 'De kromme wordt smaller en hoger.']],
        ['De standaardafwijking wordt groter, het gemiddelde blijft gelijk. Wat gebeurt er met de normale kromme?', 'De kromme wordt breder en lager; de top blijft op dezelfde plaats.', ['De kromme schuift naar rechts.', 'De kromme wordt smaller en hoger.', 'De kromme wordt breder en hoger.']],
        ['De standaardafwijking wordt kleiner, het gemiddelde blijft gelijk. Wat gebeurt er met de normale kromme?', 'De kromme wordt smaller en hoger; de top blijft op dezelfde plaats.', ['De kromme wordt breder en lager.', 'De kromme schuift naar links.', 'De kromme wordt smaller en lager.']],
        ['Waar liggen de buigpunten van een normale kromme?', 'Bij x̄ − s en x̄ + s.', ['Bij x̄ − 2s en x̄ + 2s.', 'Bij de top.', 'Bij x̄ − 3s en x̄ + 3s.']],
        ['Welke uitspraak over normaal verdeelde gegevens is juist?', 'De meeste gegevens liggen dicht bij het gemiddelde; hoe verder weg, hoe minder gegevens.', ['De gegevens liggen overal even vaak.', 'De meeste gegevens liggen ver van het gemiddelde.', 'De kromme heeft altijd twee toppen.']],
        ['Welke uitspraak over de normale kromme is juist?', 'Ze is symmetrisch rond het gemiddelde.', ['Ze heeft een lange staart naar rechts.', 'Ze is symmetrisch rond x̄ + s.', 'De top ligt bij x̄ + s.']],
      ]);
      return { soort: 'verander', opdracht: V[0], sleutel: V[0], rapport: V[0], antw: zinKeuze(V[1], V[2]), uitleg: [`\\text{${V[1]}}`] };
    } },
    model: { naam: 'Past het normale model?', verborgen: true, gen() {
      const [vorm, t, g0, w] = kies(MODELCTX), k = 10, f = VORMEN[vorm](k), gr = Array.from({ length: k + 1 }, (_, i) => g0 + i * w);
      const ok = vorm === 'normaal';
      const juist = ok ? 'Ja: het histogram is klokvormig en ongeveer symmetrisch rond het gemiddelde.' : vorm === 'scheef' ? 'Nee: het histogram is scheef, met een lange staart naar rechts.' : 'Nee: het histogram heeft twee toppen. Het gemiddelde ligt waar bijna geen gegevens zijn.';
      return { soort: 'model', opdracht: 'Kan je deze gegevens benaderen met een normale verdeling?', html: opgave(t) + histogram(gr, f, { elkeTweede: true }), sleutel: t + f.join(), rapport: t,
        antw: zinKeuze(juist, ['Ja: elk histogram kan je benaderen met een normale verdeling.', ok ? 'Nee: de gegevens liggen niet allemaal even dicht bij het gemiddelde.' : 'Ja: er zijn genoeg gegevens.', ok ? 'Nee: het histogram heeft twee toppen.' : 'Ja: het histogram is symmetrisch.']),
        uitleg: ['\\text{normaal model: klokvormig en symmetrisch rond het gemiddelde}', `\\text{${ok ? 'dat is hier zo' : vorm === 'scheef' ? 'hier scheef (lange staart rechts)' : 'hier twee toppen'}}`] };
    } },
  },
  oefenMix: [['aflezen', 2], ['koppel', 2], ['verander', 2]],
  test: [['aflezen', 4], ['koppel', 4], ['verander', 2]], testSchudden: true,
};

// ---- 7. De 68-95-99,7-regel -------------------------------------------------------------------------------
const kTekst = (C, k) => waardeTekst(C, C.m + k * C.s);
function regelVraag(C) { // willekeurig gebied: [ka, kb] in veelvouden van s (−4 = −∞, 4 = +∞)
  for (;;) {
    const v = kies(['links', 'rechts', 'tussen', 'tussen']);
    if (v === 'links') { const kb = rnd(-3, 3); return { ka: -4, kb, r: `minder dan ${kTekst(C, kb)}` }; }
    if (v === 'rechts') { const ka = rnd(-3, 3); return { ka, kb: 4, r: `meer dan ${kTekst(C, ka)}` }; }
    const ka = rnd(-3, 2), kb = rnd(ka + 1, 3); if (ka === -kb && kies([true, false])) continue;
    return { ka, kb, r: `tussen ${kTekst(C, ka)} en ${kTekst(C, kb)}` };
  }
}
const symb = (k) => k === 0 ? '\\bar{x}' : `\\bar{x} ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}s`;
function regelUitleg(ka, kb) {
  const delenP = []; for (let k = ka; k < kb; k++) delenP.push(GEBIED[String(k)]);
  const grens = (k) => k === -4 ? '-\\infty' : k === 4 ? '+\\infty' : symb(k);
  const p = regelPct(ka, kb);
  const lijst = [`\\text{van } ${grens(ka)} \\text{ tot } ${grens(kb)}`];
  if (ka === -4 && kb === 0 || ka === 0 && kb === 4) lijst.push('\\text{de helft: } 50\\,\\%');
  else if (delenP.length === 1) lijst.push(`${tg(p)}\\,\\%`);
  else lijst.push(`${delenP.map(x => tg(x) + '\\,\\%').join(' + ')} = ${tg(p)}\\,\\%`);
  return lijst;
}
const schets = (C, kleur) => kromme([{ m: C.m, s: C.s }], { ticks: [-3, -2, -1, 0, 1, 2, 3].map(k => ({ v: C.m + k * C.s, l: k === 0 ? 'x̄' : `x̄ ${k < 0 ? '−' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}s` })), kleur, hoog: 150 });
const D7 = {
  nr: 7, titel: 'De 68-95-99,7-regel en het normale model', kort: 'Percentages tussen x̄ ± s, x̄ ± 2s en x̄ ± 3s. Past het model?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">De 68-95-99,7-regel</div>
      <p>De oppervlakte onder de kromme stelt het percentage van de gegevens voor. De totale oppervlakte is 100 %. Bij elke normale verdeling geldt:</p>
      <ul><li>ongeveer <b>68 %</b> ligt tussen $\\bar{x} - s$ en $\\bar{x} + s$;</li><li>ongeveer <b>95 %</b> ligt tussen $\\bar{x} - 2s$ en $\\bar{x} + 2s$;</li><li>ongeveer <b>99,7 %</b> ligt tussen $\\bar{x} - 3s$ en $\\bar{x} + 3s$.</li></ul>
      ${kromme([{ m: 0, s: 1 }], { ticks: [-3, -2, -1, 0, 1, 2, 3].map(k => ({ v: k, l: k === 0 ? 'x̄' : `x̄ ${k < 0 ? '−' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}s` })),
        procenten: [{ x: -0.5, y: 0.12, t: '34 %' }, { x: 0.5, y: 0.12, t: '34 %' }, { x: -1.5, y: 0.04, t: '13,5 %' }, { x: 1.5, y: 0.04, t: '13,5 %' }, { x: -2.5, t: '2,35 %' }, { x: 2.5, t: '2,35 %' }, { x: -3.3, y: 0.06, t: '0,15 %' }, { x: 3.3, y: 0.06, t: '0,15 %' }] })}
      <p>Gebruik de <b>symmetrie</b>: tussen $\\bar{x}$ en $\\bar{x} + s$ ligt $68\\,\\% : 2 = 34\\,\\%$. Tussen $\\bar{x} + s$ en $\\bar{x} + 2s$ ligt $(95\\,\\% - 68\\,\\%) : 2 = 13{,}5\\,\\%$.
      Links (en rechts) van $\\bar{x}$ ligt 50 %. Kies je lukraak een element, dan is het percentage ook de <b>kans</b>.</p></div>
    <div class="kader"><div class="kader-titel">Past het normale model?</div>
      <p>Is het histogram ongeveer <b>klokvormig en symmetrisch</b> rond het gemiddelde? Dan mag je de normale verdeling met $\\bar{x}$ en $s$ uit de gegevens als model gebruiken.
      <b>Niet</b> bij een scheef histogram (lange staart naar één kant) of bij twee toppen.</p></div>
    <div class="kader eig"><div class="kader-titel">Werkwijze</div>
      <ol><li>Maak een schets en zet $\\bar{x} - 3s$ tot en met $\\bar{x} + 3s$ op de as (met de waarden).</li><li>Kleur het gevraagde gebied.</li><li>Tel de percentages van de stukken op.</li></ol></div>`,
  voorbeelden: [
    { html: `${opgave('De koffieautomaat: de hoeveelheid koffie is N(92,5; 2,5) in bekertjes van maximaal 100 ml.')}${kromme([{ m: 92.5, s: 2.5 }], { ticks: ticks7(92.5, 2.5) })}`,
      stappen: ['\\text{68\\,\\% ligt tussen } 92{,}5 - 2{,}5 = 90 \\text{ ml en } 92{,}5 + 2{,}5 = 95 \\text{ ml}', '\\text{minder dan 90 ml: } 50\\,\\% - 34\\,\\% = 16\\,\\%', '\\text{overlopen: } 100 = \\bar{x} + 3s \\text{, dus } 0{,}15\\,\\%', '\\text{tussen 87,5 en 95 ml: } 13{,}5\\,\\% + 34\\,\\% + 34\\,\\% = 81{,}5\\,\\%'] },
  ],
  soorten: {
    model: mix(D6, 'model'),
    procent: { naam: 'Percentage met de regel', gen() {
      const C = normCtx(), Q = regelVraag(C), p = regelPct(Q.ka, Q.kb);
      return { soort: 'procent', opdracht: `Hoeveel procent van de ${C.wie} ${C.v(Q.r)}? Maak eerst een schets.`, html: opgave(C.zin) + schets(C), sleutel: C.zin + Q.r, rapport: `${C.t}: ${Q.r}`,
        antw: pct(p), uitleg: [`${[-3, -2, -1, 0, 1, 2, 3].map(k => tg(W.rond(C.m + k * C.s, 6))).join(' \\quad ')}`, ...regelUitleg(Q.ka, Q.kb)] };
    } },
    kans: { naam: 'Kans met de regel', gen() {
      const C = normCtx(), Q = regelVraag(C), p = regelPct(Q.ka, Q.kb);
      return { soort: 'kans', opdracht: `Je kiest lukraak één van de ${C.wie}. Hoe groot is de kans dat die ${C.een} ${C.b(Q.r)}? Antwoord in procent.`, html: opgave(C.zin) + schets(C), sleutel: C.zin + Q.r + 'k', rapport: `${C.t}: kans ${Q.r}`,
        antw: pct(p, { voor: 'P =' }), uitleg: [`${[-3, -2, -1, 0, 1, 2, 3].map(k => tg(W.rond(C.m + k * C.s, 6))).join(' \\quad ')}`, ...regelUitleg(Q.ka, Q.kb), '\\text{het percentage is ook de kans}'] };
    } },
    grenzen: { naam: 'Tussen welke waarden?', gen() {
      const C = normCtx(), k = kies([1, 2, 3]), p = ['68', '95', '99,7'][k - 1];
      return { soort: 'grenzen', opdracht: `Tussen welke twee waarden ligt de middelste ${p} % van de ${C.wie}?`, html: opgave(C.zin), sleutel: C.zin + k, rapport: `${C.t}: middelste ${p} %`,
        antw: delen(['\\text{van}', getal(W.rond(C.m - k * C.s, 6), { na: C.e ? `\\text{ ${C.e}}` : undefined })], ['\\text{tot}', getal(W.rond(C.m + k * C.s, 6), { na: C.e ? `\\text{ ${C.e}}` : undefined })]),
        uitleg: [`\\text{${p}\\,\\% ligt tussen } ${symb(-k)} \\text{ en } ${symb(k)}`, `${tg(C.m)} - ${k === 1 ? '' : k + ' \\cdot '}${tg(C.s)} = ${tg(W.rond(C.m - k * C.s, 6))} \\qquad ${tg(C.m)} + ${k === 1 ? '' : k + ' \\cdot '}${tg(C.s)} = ${tg(W.rond(C.m + k * C.s, 6))}`] };
    } },
    aantal: { naam: 'Hoeveel stuks?', gen() {
      for (;;) {
        const C = normCtx(), Q = regelVraag(C), p = regelPct(Q.ka, Q.kb), N = kies([200, 400, 500, 1000, 2000, 4000, 10000]), n = W.rond(N * p / 100, 6);
        if (!Number.isInteger(n) || n === 0 || n === N) continue;
        const zin = `${C.zin} Er zijn ${String(N).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${C.wie}.`;
        return { soort: 'aantal', opdracht: `Ongeveer hoeveel ${C.wie} ${C.v(Q.r).replace(/^is /, 'zijn ').replace(/^heeft /, 'hebben ').replace(/^gaat /, 'gaan ').replace(/^weegt /, 'wegen ').replace(/^bevat /, 'bevatten ')}?`, html: opgave(zin) + schets(C), sleutel: zin + Q.r, rapport: `${C.t}: aantal ${Q.r} van ${N}`,
          antw: getal(n), uitleg: [...regelUitleg(Q.ka, Q.kb), `${tg(p)}\\,\\% \\text{ van } ${tg(N).replace(/(\d)(?=(\d{3})+$)/g, '$1\\,')} = ${tg(n)}`] };
      }
    } },
  },
  oefenMix: [['procent', 3], ['kans', 1], ['grenzen', 1], ['aantal', 1], ['model', 1]],
  test: [['grenzen', 2], ['procent', 3], ['model', 2], ['kans', 1], ['aantal', 2]], testSchudden: false,
};

// ---- 8. Kansen met Excel --------------------------------------------------------------------------------------
const xl = (a, C) => `NORM.VERD.N(${tekst(a)}; ${tekst(C.m)}; ${tekst(C.s)}; WAAR)`;
function excelVraag() {
  for (let n = 0; n < 200; n++) {
    const C = normCtx(), v = kies(['links', 'rechts', 'tussen']), stap = C.s >= 100 ? 50 : C.s >= 10 ? 5 : C.s >= 4 ? 1 : 0.5;
    const kies1 = () => { const x = C.m + (Math.random() * 5 - 2.5) * C.s; return W.rond(Math.round(x / stap) * stap, 6); };
    let a = kies1(), b = kies1(); if (a > b) [a, b] = [b, a];
    const isK = (x) => Math.abs((x - C.m) / C.s - Math.round((x - C.m) / C.s)) < 1e-9; // valt op x̄ ± k·s: dan is de regel genoeg
    if (isK(a) || (v === 'tussen' && (isK(b) || b - a < C.s / 2))) continue;
    const Fa = normVerd(a, C.m, C.s), Fb = normVerd(b, C.m, C.s), Fa3 = W.rond(Fa, 3), Fb3 = W.rond(Fb, 3);
    const p = v === 'links' ? Fa : v === 'rechts' ? 1 - Fa : Fb - Fa, p3 = v === 'links' ? Fa3 : v === 'rechts' ? 1 - Fa3 : Fb3 - Fa3;
    if (W.grensgeval(100 * p, 1) || W.rond(100 * p, 1) !== W.rond(100 * p3, 1) || p < 0.005 || p > 0.995) continue;
    const r = v === 'links' ? `minder dan ${waardeTekst(C, a)}` : v === 'rechts' ? `meer dan ${waardeTekst(C, a)}` : `tussen ${waardeTekst(C, a)} en ${waardeTekst(C, b)}`;
    const formule = v === 'links' ? `=${xl(a, C)}` : v === 'rechts' ? `=1 − ${xl(a, C)}` : `=${xl(b, C)} − ${xl(a, C)}`;
    const rek = v === 'links' ? `${tg(Fa3)}` : v === 'rechts' ? `1 - ${tg(Fa3)} = ${tg(W.rond(1 - Fa3, 3))}` : `${tg(Fb3)} - ${tg(Fa3)} = ${tg(W.rond(Fb3 - Fa3, 3))}`;
    return { C, v, a, b, p, r, formule, rek };
  }
}
const D8 = {
  nr: 8, titel: 'Kansen met het rekenblad', kort: 'P(X < a) = NORM.VERD.N(a; x̄; s; WAAR) in het rekenblad.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Kansen met het rekenblad</div>
      <p>Valt een grens niet op $\\bar{x} \\pm s$, $\\bar{x} \\pm 2s$ of $\\bar{x} \\pm 3s$, dan laat je het rekenblad de oppervlakte berekenen. $P(X < a)$ is de oppervlakte <b>links</b> van $a$:</p>
      <p class="midden"><code>=NORM.VERD.N(a; x̄; s; WAAR)</code> &nbsp;&nbsp; Engelstalig: <code>=NORM.DIST(a, x̄, s, TRUE)</code></p>
      <ul><li><b>rechts</b> van $a$: <code>=1 − NORM.VERD.N(a; x̄; s; WAAR)</code></li><li><b>tussen</b> $a$ en $b$: <code>=NORM.VERD.N(b; …) − NORM.VERD.N(a; …)</code></li></ul>
      <p class="klein">Het rekenblad geeft een kommagetal (bv. 0,733). Antwoord in procent op 0,1 % nauwkeurig: 73,3 %.</p></div>
    <div class="kader eig"><div class="kader-titel">De formules in het rekenblad</div>
      ${htmlTabel([['', 'Nederlands', 'Engels'], ['links van a', '<code>=NORM.VERD.N(a; x̄; s; WAAR)</code>', '<code>=NORM.DIST(a, x̄, s, TRUE)</code>'],
        ['rechts van a', '<code>=1-NORM.VERD.N(a; x̄; s; WAAR)</code>', '<code>=1-NORM.DIST(a, x̄, s, TRUE)</code>'], ['tussen a en b', '<code>=NORM.VERD.N(b; x̄; s; WAAR)-NORM.VERD.N(a; x̄; s; WAAR)</code>', '<code>=NORM.DIST(b, …)-NORM.DIST(a, …)</code>']])}
      <p class="klein">Vul voor x̄ en s de getallen in, bv. <code>=NORM.VERD.N(165; 160,4; 7,4; WAAR)</code>. In een rekenblad met gegevens mag je ook naar de cellen met het gemiddelde en de standaardafwijking verwijzen, bv. <code>=NORM.VERD.N(140; C2; C3; WAAR)</code>.</p></div>
    ${RB_UITLEG}
    <div class="kader eig"><div class="kader-titel">Lengte van vrouwen: N(160,4; 7,4)</div>
      ${kromme([{ m: 160.4, s: 7.4 }], { ticks: [{ v: 150 }, { v: 160.4, l: '160,4' }, { v: 165 }, { v: 170 }], kleur: [100, 165], hoog: 130 })}
      <p>Kleiner dan 165 cm: <code>=NORM.VERD.N(165; 160,4; 7,4; WAAR)</code> = 0,733 → <b>73,3 %</b></p>
      <p>Groter dan 170 cm: 1 − 0,903 = 0,097 → <b>9,7 %</b> &nbsp;·&nbsp; Tussen 150 en 170 cm: 0,903 − 0,080 = 0,823 → <b>82,3 %</b></p>
      <p class="klein">Controle met de schets: 170 ligt iets boven $\\bar{x} + s = 167{,}8$. Boven 167,8 cm ligt 16 %, dus boven 170 cm iets minder: 9,7 % is logisch.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Appels: } N(150;\\, 20). \\text{ Lichter dan 140 g?}', stappen: ['\\text{=NORM.VERD.N(140; 150; 20; WAAR)} = 0{,}309', '30{,}9\\,\\%'] },
    { tex: '\\text{Appels: } N(150;\\, 20). \\text{ Zwaarder dan 185 g?}', stappen: ['\\text{=1 − NORM.VERD.N(185; 150; 20; WAAR)} = 1 - 0{,}960 = 0{,}040', '4{,}0\\,\\%'] },
  ],
  soorten: {
    bereken: { naam: 'Een kans met het rekenblad', gen() {
      const Q = excelVraag(), C = Q.C;
      const rij = { label: 'kans', doel: Q.p, norm: { m: C.m, s: C.s, a: Q.a, b: Q.b, kant: Q.v }, formule: Q.formule.replace(/−/g, '-').replace(/ - /g, '-') };
      return { soort: 'bereken', opdracht: `Hoeveel procent van de ${C.wie} ${C.v(Q.r)}? Typ de formule in het rekenblad en antwoord in procent op 0,1 % nauwkeurig.`, html: opgave(C.zin), sleutel: C.zin + Q.r, rapport: `${C.t}: ${Q.r} (rekenblad)`,
        antw: delen(['\\text{rekenblad}', rekenblad('', [], [rij])], ['\\text{percentage:}', pct(100 * Q.p, { dec: 1 })]), uitleg: [`\\text{${Q.formule}}`, Q.rek, `\\approx ${tg(W.rond(100 * Q.p, 1))}\\,\\%`] };
    } },
    model: { naam: 'Van gegevens naar model', gen() {
      const C = kies([{ t: 'het gewicht (g) van {n} appels uit een boomgaard', x: 'gewicht (g)', m: () => kies([145, 150, 155]), s: () => kies([15, 18, 20]), wie: 'appels', v: 'weegt' },
        { t: 'de lengte (cm) van {n} leerlingen van het 6de jaar', x: 'lengte (cm)', m: () => kies([168, 172, 175]), s: () => kies([7, 8, 9]), wie: 'leerlingen', v: 'is' },
        { t: 'de reactietijd (ms) van {n} deelnemers aan een test', x: 'reactietijd (ms)', m: () => kies([250, 270]), s: () => kies([20, 25]), wie: 'deelnemers', v: 'heeft' }]);
      const n = kies([100, 150, 200]), M = C.m(), S = C.s(), data = Array.from({ length: n }, () => Math.round(normRnd(M, S)));
      const m = gem(data), sd = stdevS(data), a = Math.round(M - S * kies([0.5, 0.7, 1.2])), k = data.filter(x => x < a).length;
      const pm = normVerd(a, m, sd), pr = normVerd(a, r1(m), r1(sd));
      if ([m, sd].some(x => W.grensgeval(x, 1)) || W.grensgeval(100 * pm, 1) || W.rond(100 * pm, 1) !== W.rond(100 * pr, 1) || !ex(100 * k / n)) return this.gen();
      const zin = `In het rekenblad staat ${C.t.replace('{n}', n)}. Het histogram is ongeveer klokvormig en symmetrisch: je gebruikt het model N(x̄; s). In de gegevens zijn er ${k} ${C.wie} met een waarde kleiner dan ${a}.`;
      const rb = rekenblad(C.x, data, [{ ...rijGem(n), doel: m }, { ...rijStdev(n), doel: sd }, { label: `model: kleiner dan ${a}`, doel: pm, alt: [pr], norm: { m, s: sd, a, kant: 'links' }, formule: `=NORM.VERD.N(${a}; C2; C3; WAAR)` }], { histogram: true, hoog: 10 });
      return { soort: 'model', opdracht: 'Bereken x̄ en s, gebruik het model en vergelijk met de gegevens.', html: opgave(zin), sleutel: data.join() + a, rapport: `${C.x} (${n}): model vs gegevens`,
        antw: delen(['\\text{rekenblad}', rb], ['\\bar{x} =', getal(m, { dec: 1 })], ['s =', getal(sd, { dec: 1 })], [`\\text{model: \\% kleiner dan ${a}}`, pct(100 * pm, { dec: 1 })], [`\\text{gegevens: \\% kleiner dan ${a}}`, pct(100 * k / n, { dec: 1 })]),
        uitleg: [`\\bar{x} \\approx ${tg(r1(m))} \\qquad s \\approx ${tg(r1(sd))}`, `\\text{=NORM.VERD.N(${a}; ${tekst(r1(m))}; ${tekst(r1(sd))}; WAAR)} \\approx ${tg(W.rond(pm, 3))} \\rightarrow ${tg(W.rond(100 * pm, 1))}\\,\\%`,
          ...pctUitleg(k, n, C.wie), `\\text{${Math.abs(100 * pm - 100 * k / n) < 3 ? 'dat ligt dicht bij elkaar: het model past goed' : 'het verschil is wat groter, maar het model is nog bruikbaar'}}`] };
    } },
    formule: { naam: 'De juiste formule', gen() {
      const Q = excelVraag(), C = Q.C, a = Q.a, b = Q.b;
      const alle = [`=${xl(a, C)}`, `=1 − ${xl(a, C)}`, `=${xl(b, C)} − ${xl(a, C)}`, `=NORM.VERD.N(${tekst(C.m)}; ${tekst(a)}; ${tekst(C.s)}; WAAR)`, `=1 − ${xl(b, C)}`];
      return { soort: 'formule', opdracht: `Met welke formule bereken je de kans dat een lukraak gekozen ${C.een} ${C.b(Q.r)}?`, html: opgave(C.zin), sleutel: C.zin + Q.r + 'f', rapport: `${C.t}: formule ${Q.r}`,
        antw: uniekKeuze(`<code>${Q.formule}</code>`, alle.map(f => `<code>${f}</code>`), kZin), uitleg: [Q.v === 'links' ? '\\text{links van } a \\text{: NORM.VERD.N(a; x̄; s; WAAR)}' : Q.v === 'rechts' ? '\\text{rechts van } a \\text{: 1 − NORM.VERD.N(a; …)}' : '\\text{tussen } a \\text{ en } b \\text{: NORM.VERD.N(b; …) − NORM.VERD.N(a; …)}', `\\text{${Q.formule}}`] };
    } },
    schat: { naam: 'Schatten met de schets', gen() {
      const Q = excelVraag(), C = Q.C; if (Q.v === 'tussen') return this.gen();
      const p = 100 * Q.p, gr = [0.15, 2.5, 16, 50, 84, 97.5, 99.85], lab = ['minder dan 0,15 %', 'tussen 0,15 % en 2,5 %', 'tussen 2,5 % en 16 %', 'tussen 16 % en 50 %', 'tussen 50 % en 84 %', 'tussen 84 % en 97,5 %', 'tussen 97,5 % en 99,85 %', 'meer dan 99,85 %'];
      const i = gr.findIndex(g => p < g), j = i === -1 ? 7 : i;
      const kz = uniekKeuze(lab[j], [j - 1, j + 1, j - 2, j + 2, j - 3, j + 3].filter(x => x >= 0 && x <= 7).map(x => lab[x]), kT);
      return { soort: 'schat', opdracht: `Zonder rekenblad: hoeveel procent van de ${C.wie} ${C.v(Q.r)}? Kies met een schets.`, html: opgave(C.zin) + schets(C), sleutel: C.zin + Q.r + 's', rapport: `${C.t}: schatting ${Q.r}`,
        antw: kz, uitleg: [`${[-3, -2, -1, 0, 1, 2, 3].map(k => tg(W.rond(C.m + k * C.s, 6))).join(' \\quad ')}`, `\\text{${tekst(Q.a)} ligt tussen twee van die grenzen: ${lab[j]}}`, `\\text{(met het rekenblad: } ${tg(W.rond(p, 1))}\\,\\%\\text{)}`] };
    } },
  },
  oefenMix: [['bereken', 3], ['formule', 1], ['schat', 1], ['model', 1]],
  test: [['bereken', 5], ['formule', 1], ['schat', 2], ['model', 2]], testSchudden: true,
};

// ---- 9. Eindtest ------------------------------------------------------------------------------------------
const D9 = {
  nr: 9, titel: 'Eindtest statistiek', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles van statistiek door elkaar: steekproeven, gegevens verwerken en de normale verdeling.
      Herhaal gerust de theorie van een vorig deel. Je mag het rekenblad en je rekenmachine gebruiken.</p></div>`,
  voorbeelden: [],
  soorten: { pp: mix(D1, 'populatie'), gd: mix(D2, 'goed'), bs: mix(D3, 'besluit'), rl: mix(D4, 'rel'), hi: mix(D4, 'histo'), sd: mix(D5, 'stdev'), vg: mix(D5, 'vergelijk'), kp: mix(D6, 'koppel'), rg: mix(D7, 'procent'), xl: mix(D8, 'bereken') },
  oefenMix: [['pp', 1], ['gd', 1], ['bs', 1], ['rl', 1], ['hi', 1], ['sd', 1], ['vg', 1], ['kp', 1], ['rg', 1], ['xl', 1]],
  test: [['pp', 1], ['gd', 1], ['bs', 1], ['rl', 1], ['hi', 1], ['sd', 1], ['vg', 1], ['kp', 1], ['rg', 1], ['xl', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'statistiek', titel: 'Statistiek', ondertitel: 'Statistiek · 7VJHO', klas: '7VJHO', drempel: 70,
  intro: `<p>Je leert wanneer een steekproef een goed beeld geeft van de populatie, hoe je gegevens samenvat in een frequentietabel, een histogram, een gemiddelde en een standaardafwijking,
    en hoe je met de normale verdeling kansen bepaalt: met de 68-95-99,7-regel en met het rekenblad.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p class="klein"><b>Afspraken:</b> procenten, gemiddelden en standaardafwijkingen rond je af op <b>1 decimaal</b> (komt het exact uit, dan schrijf je het gewoon zo).
    Procenten bereken je met een verhoudingstabel. Formules typ je in het <b>rekenblad</b> in het leerpad; je mag ook je rekenmachine gebruiken.</p>`,
  groepen: [{ titel: 'A · Steekproeven', delen: [1, 2, 3] }, { titel: 'B · Gegevens verwerken', delen: [4, 5] }, { titel: 'C · De normale verdeling', delen: [6, 7, 8] }, { titel: 'D · Eindtest', delen: [9] }],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9],
});
