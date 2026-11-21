// ===================================================================
//  B · GEGEVENS VERWERKEN (delen 4–5)
// ===================================================================
// gegevensreeksen: k klassen van breedte w vanaf g0
const REEKSEN = [
  { t: '{N} leerlingen noteren hoeveel minuten ze nodig hebben om naar school te komen.', g0: 0, w: 10, k: 5, m: 23, s: 10, e: 'min', xn: 'tijd (min)' },
  { t: 'De lengte (in cm) van {N} leerlingen.', g0: 150, w: 10, k: 4, m: 171, s: 8, e: 'cm', xn: 'lengte (cm)' },
  { t: '{N} leerlingen maken een toets op 40. Dit zijn hun punten.', g0: 10, w: 5, k: 6, m: 26, s: 6, e: 'punten', xn: 'punten op 40' },
  { t: '{N} jongeren noteren hoeveel minuten ze gisteren op hun gsm zaten.', g0: 0, w: 60, k: 5, m: 150, s: 55, e: 'min', xn: 'schermtijd (min)' },
  { t: 'Het gewicht (in kg) van de boekentas van {N} leerlingen.', g0: 2, w: 2, k: 5, m: 7, s: 2, e: 'kg', xn: 'gewicht (kg)' },
  { t: 'De leeftijd van {N} bezoekers van een fietsenwinkel op zaterdag.', g0: 10, w: 10, k: 6, m: 38, s: 12, e: 'jaar', xn: 'leeftijd (jaar)' },
];
function maakReeks(N = kies([20, 24, 25, 30])) {
  const R = kies(REEKSEN), lo = R.g0, hi = R.g0 + R.w * R.k - 1, data = [];
  while (data.length < N) { const x = Math.round(normRnd(R.m, R.s)); if (x >= lo && x <= hi) data.push(x); }
  data.sort((a, b) => a - b);
  const f = telKlassen(data, R.g0, R.w, R.k), grenzen = Array.from({ length: R.k + 1 }, (_, i) => R.g0 + i * R.w);
  return { R, N, data, f, grenzen, zin: R.t.replace('{N}', N), toon: schud(data.slice()) };
}
const freqTabelHTML = (Q, rel = false) => htmlTabel([[Q.R.xn, 'absolute frequentie', ...(rel ? ['relatieve frequentie'] : [])],
  ...Q.f.map((x, i) => [klasTekst(Q.grenzen[i], Q.grenzen[i + 1]), x, ...(rel ? [tekst(r1(100 * x / Q.N)) + ' %'] : [])]), ['totaal', Q.N, ...(rel ? ['100 %'] : [])]]);
const D4 = {
  nr: 4, titel: 'Frequentietabel en histogram', kort: 'Gegevens groeperen in klassen, absolute en relatieve frequentie.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Gegroepeerde frequentietabel</div>
      <p>Bij veel verschillende waarden groepeer je de gegevens in <b>klassen</b> van even brede intervallen. Een klasse noteer je als half-open interval:
      $[160;\\, 170[$ bevat 160 wel, maar 170 niet.</p>
      <ul><li>De <b>absolute frequentie</b> van een klasse is het aantal gegevens in die klasse.</li><li>De <b>relatieve frequentie</b> is dat aantal in verhouding tot het totaal, meestal in %.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Lengte van 24 leerlingen</div>
      ${gegevensTabel([152, 158, 161, 163, 165, 166, 168, 169, 170, 171, 172, 172, 173, 174, 175, 176, 177, 178, 180, 181, 183, 185, 167, 164], 12)}
      ${htmlTabel([['lengte (cm)', 'absolute frequentie', 'relatieve frequentie'], ['[150; 160[', 2, '8,3 %'], ['[160; 170[', 8, '33,3 %'], ['[170; 180[', 10, '41,7 %'], ['[180; 190[', 4, '16,7 %'], ['totaal', 24, '100 %']])}
      <p>Relatieve frequentie met een verhoudingstabel: 24 leerlingen is 100 %. Voor 8 leerlingen deel je door 3 (24 → 8), dus ook 100 % : 3 ≈ 33,3 %.</p></div>
    <div class="kader def"><div class="kader-titel">Het histogram</div>
      <p>Bij gegroepeerde gegevens teken je een <b>histogram</b>: de staven raken elkaar, want de klassen sluiten op elkaar aan.</p>
      ${histogram([150, 160, 170, 180, 190], [2, 8, 10, 4], { xn: 'lengte (cm)', waarden: true, breed: 300, hoog: 150 })}
      <p class="klein"><b>Met het rekenblad in het leerpad:</b> de gegevens staan in kolom A. Vul onder het rekenblad het begin van de eerste klasse en de klassenbreedte in en klik op <b>Maak histogram</b>.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Klassen } [0;\\,10[,\\ [10;\\,20[,\\ [20;\\,30[,\\ \\ldots \\text{ In welke klasse hoort 30? En 29,9?}', stappen: ['30 \\in [30;\\, 40[ \\quad (\\text{30 hoort niet meer bij } [20;\\, 30[)', '29{,}9 \\in [20;\\, 30['] },
    { tex: '\\text{20 leerlingen, 5 in de klasse } [10;\\,20[. \\text{ Relatieve frequentie?}', stappen: ['20 \\text{ is } 100\\,\\%', '20 : 4 = 5 \\text{, dus } 100\\,\\% : 4 = 25\\,\\%'] },
  ],
  soorten: {
    abs: { naam: 'Absolute frequentie tellen', gen() {
      const Q = maakReeks(), i = rnd(0, Q.R.k - 1), a = Q.grenzen[i], b = Q.grenzen[i + 1], in_ = Q.data.filter(x => x >= a && x < b);
      return { soort: 'abs', opdracht: `Wat is de absolute frequentie van de klasse ${klasTekst(a, b)}?`, html: opgave(Q.zin) + gegevensTabel(Q.toon), sleutel: Q.toon.join() + i, rapport: `${Q.R.xn}: abs. freq. ${klasTekst(a, b)}`,
        antw: getal(in_.length, { voor: '\\text{absolute frequentie} =' }), uitleg: [`\\text{in } ${klasTex(a, b)}: ${in_.length ? in_.map(x => tg(x)).join(',\\ ') : '\\text{geen enkel gegeven}'}`, `\\text{${a} hoort erbij, ${b} niet}`, `\\text{absolute frequentie: } ${in_.length}`] };
    } },
    rel: { naam: 'Relatieve frequentie', gen() {
      const Q = maakReeks(), i = rnd(0, Q.R.k - 1), a = Q.grenzen[i], b = Q.grenzen[i + 1], n = Q.f[i]; if (!n) return this.gen();
      const p = 100 * n / Q.N; if (W.grensgeval(p, 1)) return this.gen();
      return { soort: 'rel', opdracht: `Bereken de relatieve frequentie van de klasse ${klasTekst(a, b)} (in %).`, html: opgave(Q.zin) + freqTabelHTML(Q), sleutel: Q.toon.join() + i + 'r', rapport: `${Q.R.xn}: rel. freq. ${klasTekst(a, b)}`,
        antw: pct(p, { dec: 1, voor: '\\text{relatieve frequentie} =' }), uitleg: pctUitleg(n, Q.N) };
    } },
    klasse: { naam: 'In welke klasse?', gen() {
      const R = kies(REEKSEN), gr = Array.from({ length: R.k + 1 }, (_, i) => R.g0 + i * R.w), i = rnd(1, R.k - 1);
      const v = kies([gr[i], gr[i] - (R.w >= 10 ? 0.1 : 0.5), gr[i] + (R.w >= 10 ? kies([1, 2, 5]) : 1), gr[0]]), j = gr.findIndex((g, k) => k < R.k && v >= g && v < gr[k + 1]);
      const opties = gr.slice(0, -1).map((g, k) => `[${tg(g)};\\, ${tg(gr[k + 1])}[`);
      return { soort: 'klasse', opdracht: `Je werkt met de klassen ${opties.slice(0, 3).map((o, k) => klasTekst(gr[k], gr[k + 1])).join(', ')}, … In welke klasse hoort ${tekst(v)}?`, sleutel: R.xn + v, rapport: `klasse van ${tekst(v)}`,
        tex: `${tg(v)} \\in \\;?`, antw: keuze(kTex(opties), j), uitleg: [`${klasTex(gr[j], gr[j + 1])} \\text{ bevat ${tekst(gr[j])} wel, maar ${tekst(gr[j + 1])} niet}`, `${tg(v)} \\in ${klasTex(gr[j], gr[j + 1])}`] };
    } },
    histo: { naam: 'Een histogram lezen', gen() {
      const Q = maakReeks(kies([20, 25, 40, 50])), v = kies(['meest', 'aantal', 'minder', 'minstens']), fig = histogram(Q.grenzen, Q.f, { xn: Q.R.xn });
      const kl = Q.grenzen.slice(0, -1).map((g, k) => `[${tg(g)};\\, ${tg(Q.grenzen[k + 1])}[`);
      if (v === 'meest') { const mx = Math.max(...Q.f); if (Q.f.filter(x => x === mx).length > 1) return this.gen(); const j = Q.f.indexOf(mx);
        return { soort: 'histo', opdracht: 'In welke klasse liggen de meeste gegevens?', html: opgave(Q.zin) + fig, sleutel: Q.toon.join() + v, rapport: `${Q.R.xn}: meeste gegevens`, antw: keuze(kTex(kl), j), uitleg: [`\\text{de hoogste staaf: } ${kl[j]} \\text{ met ${mx} gegevens}`] }; }
      const i = rnd(1, Q.R.k - 1), g = Q.grenzen[i];
      if (v === 'aantal') return { soort: 'histo', opdracht: `Hoeveel gegevens zijn kleiner dan ${tekst(g)}?`, html: opgave(Q.zin) + fig, sleutel: Q.toon.join() + v + i, rapport: `${Q.R.xn}: aantal < ${g}`,
        antw: getal(som(Q.f.slice(0, i))), uitleg: [`${Q.f.slice(0, i).join(' + ')} = ${som(Q.f.slice(0, i))}`] };
      const n = v === 'minder' ? som(Q.f.slice(0, i)) : som(Q.f.slice(i)), p = 100 * n / Q.N; if (W.grensgeval(p, 1)) return this.gen();
      return { soort: 'histo', opdracht: `Hoeveel procent van de gegevens is ${v === 'minder' ? 'kleiner dan' : 'minstens'} ${tekst(g)}?`, html: opgave(Q.zin) + fig, sleutel: Q.toon.join() + v + i, rapport: `${Q.R.xn}: % ${v} ${g}`,
        antw: pct(p, { dec: 1 }), uitleg: [`\\text{aantal: } ${(v === 'minder' ? Q.f.slice(0, i) : Q.f.slice(i)).join(' + ')} = ${n} \\text{ van de } ${Q.N}`, ...pctUitleg(n, Q.N)] };
    } },
    tabel: { naam: 'Met de frequentietabel', gen() {
      const Q = maakReeks(kies([20, 25, 50])), i = rnd(1, Q.R.k - 1), g = Q.grenzen[i], v = kies(['minder', 'minstens']);
      const rel = Q.f.map(x => 100 * x / Q.N), deel = v === 'minder' ? rel.slice(0, i) : rel.slice(i), p = W.rond(som(deel), 6);
      return { soort: 'tabel', opdracht: `Hoeveel procent van de gegevens is ${v === 'minder' ? 'kleiner dan' : 'minstens'} ${tekst(g)}?`, html: opgave(Q.zin) + freqTabelHTML(Q, true), sleutel: Q.toon.join() + v + i + 't', rapport: `${Q.R.xn}: % ${v} ${g} (tabel)`,
        antw: pct(p, { dec: 1 }), uitleg: [`\\text{tel de relatieve frequenties op: } ${deel.map(x => tg(r1(x)) + '\\,\\%').join(' + ')} = ${tg(r1(p))}\\,\\%`] };
    } },
    rekenhisto: { naam: 'Histogram met het rekenblad', gen() {
      const Q = maakReeks(kies([40, 50, 60])), v = kies(['meest', 'klasse']), g0 = Q.R.g0, w = Q.R.w;
      const kl = Q.grenzen.slice(0, -1).map((g, k) => `[${tg(g)};\\, ${tg(Q.grenzen[k + 1])}[`);
      const zin = Q.zin + ` De gegevens staan in het rekenblad (kolom A). Maak een histogram met klassen van breedte ${tekst(w)}, beginnend bij ${tekst(g0)}.`;
      const rb = rekenblad(Q.R.xn, Q.toon, [], { histogram: true, hoog: 10 });
      if (v === 'meest') { const mx = Math.max(...Q.f); if (Q.f.filter(x => x === mx).length > 1) return this.gen(); const j = Q.f.indexOf(mx);
        return { soort: 'rekenhisto', opdracht: 'In welke klasse liggen de meeste gegevens?', html: opgave(zin), sleutel: Q.toon.join() + v, rapport: `${Q.R.xn} (${Q.N}): meeste gegevens via histogram`,
          antw: delen(['\\text{rekenblad}', rb], ['\\text{klasse}', keuze(kTex(kl), j)]), uitleg: [`\\text{begin } ${tg(g0)}, \\text{ breedte } ${tg(w)}`, `\\text{de hoogste staaf: } ${kl[j]} \\text{ met ${mx} gegevens}`], uitlegHtml: histogram(Q.grenzen, Q.f, { xn: Q.R.xn, waarden: true }) }; }
      const i = rnd(0, Q.R.k - 1);
      return { soort: 'rekenhisto', opdracht: `Hoeveel gegevens liggen in de klasse ${klasTekst(Q.grenzen[i], Q.grenzen[i + 1])}?`, html: opgave(zin), sleutel: Q.toon.join() + v + i, rapport: `${Q.R.xn} (${Q.N}): abs. freq. via histogram`,
        antw: delen(['\\text{rekenblad}', rb], ['\\text{aantal}', getal(Q.f[i])]), uitleg: [`\\text{begin } ${tg(g0)}, \\text{ breedte } ${tg(w)}`, `\\text{staaf boven } ${kl[i]}: ${Q.f[i]}`], uitlegHtml: histogram(Q.grenzen, Q.f, { xn: Q.R.xn, waarden: true }) };
    } },
  },
  oefenMix: [['abs', 2], ['rel', 2], ['klasse', 1], ['histo', 2], ['tabel', 1], ['rekenhisto', 2]],
  test: [['klasse', 1], ['abs', 2], ['rel', 2], ['histo', 2], ['tabel', 1], ['rekenhisto', 2]], testSchudden: false,
};

// ---- 5. Gemiddelde en standaardafwijking -------------------------------------------------------------------
const KLEINE_REEKSEN = [
  ['De punten op 20 van {n} leerlingen.', 4, 20, 'punten'], ['Het aantal doelpunten van een voetbalploeg in {n} matchen.', 0, 6, 'doelpunten'],
  ['De temperatuur (in °C) om 12 uur op {n} dagen.', 8, 24, '°C'], ['Het aantal minuten dat {n} leerlingen nodig hebben om naar school te fietsen.', 6, 35, 'min'],
  ['De prijs (in euro) van {n} tweedehandsfietsen.', 60, 240, 'euro'], ['Het gewicht (in kg) van {n} valiezen op de luchthaven.', 12, 26, 'kg'],
];
function kleineReeks() {
  const [t, a, b, e] = kies(KLEINE_REEKSEN), n = rnd(6, 10), data = Array.from({ length: n }, () => rnd(a, b));
  return { zin: t.replace('{n}', n), data, n, e };
}
function zelfdeGemiddelde() { // twee reeksen van 14 punten op 20 met hetzelfde gemiddelde, één smal en één breed
  const m = rnd(10, 14), smal = [], breed = [];
  for (let i = 0; i < 7; i++) { const d1 = rnd(0, 2), d2 = rnd(1, 6); smal.push(m - d1, m + d1); breed.push(m - d2, m + d2); }
  return { m, smal, breed };
}
const D5 = {
  nr: 5, titel: 'Gemiddelde en standaardafwijking', kort: 'x̄: de som gedeeld door het aantal. s: hoe ver de gegevens van x̄ liggen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Gemiddelde en standaardafwijking</div>
      <ul><li>Het (rekenkundig) <b>gemiddelde</b> $\\bar{x}$ is de som van alle gegevens gedeeld door het aantal gegevens.</li>
      <li>De <b>standaardafwijking</b> $s$ geeft aan hoe ver de gegevens gemiddeld van het gemiddelde liggen.<br><b>kleine $s$</b>: de gegevens liggen dicht bij elkaar &nbsp;·&nbsp; <b>grote $s$</b>: de gegevens liggen ver uit elkaar.</li></ul>
      <p>De formule voor $s$ hoef je niet te kennen: je laat het rekenblad rekenen. Rond af op 1 decimaal.</p></div>
    <div class="kader eig"><div class="kader-titel">De formules in het rekenblad</div>
      ${htmlTabel([['', 'Nederlands', 'Engels'], ['gemiddelde', '<code>=GEMIDDELDE(A2:A25)</code>', '<code>=AVERAGE(A2:A25)</code>'], ['standaardafwijking', '<code>=STDEV.S(A2:A25)</code>', '<code>=STDEV.S(A2:A25)</code>']])}
      <p class="klein">De gegevens staan in A2 tot en met A25 (in A1 staat de titel). Lengte van de 24 leerlingen: $\\bar{x} \\approx 170{,}8$ cm en $s \\approx 8{,}1$ cm.
      Let op: <b>STDEV.S</b>, niet STDEV.P. Rond pas op het einde af op 1 decimaal.</p></div>
    ${RB_UITLEG}
    <div class="kader"><div class="kader-titel">Wat zegt s?</div>
      <p>Klas P en klas Q maken dezelfde toets, allebei met gemiddeld 14 op 20. Klas P: $s = 1{,}2$, klas Q: $s = 3{,}5$.
      In klas Q liggen de punten veel verder uit elkaar: er zijn zowel heel lage als heel hoge scores.</p></div>`,
  voorbeelden: [
    { tex: '\\text{Punten: } 12,\\ 15,\\ 9,\\ 14,\\ 10. \\text{ Gemiddelde?}', stappen: ['\\bar{x} = \\frac{12 + 15 + 9 + 14 + 10}{5} = \\frac{60}{5} = 12'] },
    { tex: '\\text{Bakkerij A en B: broden van gemiddeld 800 g. A: } s = 5 \\text{ g, B: } s = 25 \\text{ g.}', stappen: ['\\text{bij A wegen bijna alle broden ongeveer 800 g}', '\\text{bij A weet je beter wat je krijgt}'] },
  ],
  soorten: {
    gemiddelde: { naam: 'Het gemiddelde berekenen', gen() {
      const Q = kleineReeks(), m = gem(Q.data); if (W.grensgeval(m, 1)) return this.gen();
      return { soort: 'gemiddelde', opdracht: 'Bereken het gemiddelde. Rond af op 1 decimaal.', html: opgave(Q.zin) + gegevensTabel(Q.data), sleutel: Q.data.join(), rapport: `${Q.zin} gemiddelde`,
        antw: getal(m, { dec: 1, voor: '\\bar{x} =' }), uitleg: [`\\bar{x} = \\frac{${Q.data.join(' + ')}}{${Q.n}} = \\frac{${som(Q.data)}}{${Q.n}} ${ongeveer(m)} ${tg(r1(m))}`] };
    } },
    stdev: { naam: 'De standaardafwijking', gen() {
      const Q = kleineReeks(), s = stdevS(Q.data); if (W.grensgeval(s, 1) || s === 0) return this.gen();
      return { soort: 'stdev', opdracht: 'Bereken de standaardafwijking met een formule in het rekenblad. Rond af op 1 decimaal.', html: opgave(Q.zin), sleutel: Q.data.join() + 's', rapport: `${Q.zin} standaardafwijking`,
        antw: delen(['\\text{rekenblad}', rekenblad(Q.e, Q.data, [{ ...rijStdev(Q.n), doel: s }])], ['s =', getal(s, { dec: 1 })]), uitleg: [`\\text{de gegevens staan in A2 tot en met A${Q.n + 1}}`, `\\text{=STDEV.S(A2:A${Q.n + 1})} \\approx ${tg(W.rond(s, 3))}`, `s \\approx ${tg(r1(s))}`] };
    } },
    groot: { naam: 'x̄ en s met het rekenblad', gen() {
      const Q = maakReeks(kies([24, 30, 40, 50])), n = Q.N, m = gem(Q.toon), sd = stdevS(Q.toon); if (W.grensgeval(m, 1) || W.grensgeval(sd, 1)) return this.gen();
      return { soort: 'groot', opdracht: 'Bereken het gemiddelde en de standaardafwijking met formules in het rekenblad. Rond af op 1 decimaal.', html: opgave(Q.zin), sleutel: Q.toon.join() + 'g', rapport: `${Q.R.xn} (${n}): x̄ en s met rekenblad`,
        antw: delen(['\\text{rekenblad}', rekenblad(Q.R.xn, Q.toon, [{ ...rijGem(n), doel: m }, { ...rijStdev(n), doel: sd }])], ['\\bar{x} =', getal(m, { dec: 1 })], ['s =', getal(sd, { dec: 1 })]),
        uitleg: [`\\text{C2: =GEMIDDELDE(A2:A${n + 1})} \\approx ${tg(W.rond(m, 3))} \\rightarrow \\bar{x} \\approx ${tg(r1(m))}`, `\\text{C3: =STDEV.S(A2:A${n + 1})} \\approx ${tg(W.rond(sd, 3))} \\rightarrow s \\approx ${tg(r1(sd))}`] };
    } },
    excel: { naam: 'De juiste formule', gen() {
      const n = rnd(15, 40), wat = kies(['gemiddelde', 'standaardafwijking']), e = n + 1;
      const juist = wat === 'gemiddelde' ? `=GEMIDDELDE(A2:A${e})` : `=STDEV.S(A2:A${e})`;
      const fout = wat === 'gemiddelde' ? [`=GEMIDDELDE(A3:A${e})`, `=SOM(A2:A${e})`, `=STDEV.S(A2:A${e})`, `=GEMIDDELDE(A2:A${n})`] : [`=STDEV.S(A3:A${e})`, `=GEMIDDELDE(A2:A${e})`, `=STDEV.P(A2:A${e})`, `=STDEV.S(A2:A${n})`];
      const zin = `In cel A1 staat de titel. De ${n} gegevens staan in A2 tot en met A${e}. Met welke formule bereken je ${wat === 'gemiddelde' ? 'het' : 'de'} ${wat}?`;
      const k = uniekKeuze(`<code>${juist}</code>`, fout.map(f => `<code>${f}</code>`), kZin);
      return { soort: 'excel', opdracht: 'Kies de juiste formule.', html: opgave(zin), sleutel: zin, rapport: `formule ${wat} (${n})`, antw: k,
        uitleg: [`\\text{${juist}}`, `\\text{${wat === 'gemiddelde' ? 'GEMIDDELDE (Engels: AVERAGE)' : 'STDEV.S'}, van A2 (zonder de titel) tot A${e}}`] };
    } },
    vergelijk: { naam: 'Welke s is groter?', gen() {
      const Z = zelfdeGemiddelde(), PQ = kies([true, false]), P = PQ ? Z.smal : Z.breed, Qd = PQ ? Z.breed : Z.smal;
      const sP = r1(stdevS(P)), sQ = r1(stdevS(Qd)), v = kies(['groot', 'koppel', 'tekort']);
      const hist = (d, t) => histogram(Array.from({ length: 21 }, (_, i) => i), Array.from({ length: 20 }, (_, i) => d.filter(x => x === i || (i === 19 && x === 20)).length), { xn: 'punten op 20', titel: t, elkeTweede: true, breed: 320, hoog: 120 });
      const fig = `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px">${hist(P, `Klas P (gemiddelde ${Z.m})`)}${hist(Qd, `Klas Q (gemiddelde ${Z.m})`)}</div>`, grootQ = !PQ;
      if (v === 'groot') return { soort: 'vergelijk', opdracht: 'Beide klassen hebben hetzelfde gemiddelde. Welke klas heeft de grootste standaardafwijking?', html: fig, sleutel: P.join() + Qd.join() + v, rapport: 'grootste s (stippendiagram)',
        antw: keuze(kT(['klas P', 'klas Q']), grootQ ? 1 : 0), uitleg: [`\\text{in klas ${grootQ ? 'Q' : 'P'} liggen de punten veel verder uit elkaar}`] };
      if (v === 'koppel') { const lo = Math.min(sP, sQ), hi = Math.max(sP, sQ); if (lo === hi) return this.gen();
        return { soort: 'vergelijk', opdracht: `De standaardafwijkingen zijn ${tekst(lo)} en ${tekst(hi)}. Welke hoort bij klas P?`, html: fig, sleutel: P.join() + Qd.join() + v, rapport: 's koppelen (stippendiagram)',
          antw: keuze(kTex([`s = ${tg(lo)}`, `s = ${tg(hi)}`]), grootQ ? 0 : 1), uitleg: [`\\text{de klas waarin de punten het verst uit elkaar liggen, heeft de grootste } s`, `\\text{klas P: } s = ${tg(sP)} \\qquad \\text{klas Q: } s = ${tg(sQ)}`] }; }
      const tP = P.filter(x => x < 10).length, tQ = Qd.filter(x => x < 10).length; if (tP === tQ) return this.gen();
      return { soort: 'vergelijk', opdracht: 'In welke klas zijn er meer leerlingen met een tekort (minder dan 10)?', html: fig, sleutel: P.join() + Qd.join() + v, rapport: 'tekorten (stippendiagram)',
        antw: keuze(kT(['klas P', 'klas Q']), tQ > tP ? 1 : 0), uitleg: [`\\text{klas P: ${tP} tekort${tP === 1 ? '' : 'en'}, klas Q: ${tQ} tekort${tQ === 1 ? '' : 'en'}}`, '\\text{meestal de klas met de grootste } s'] };
    } },
    betekenis: { naam: 'Wat betekent s?', gen() {
      const C = kies([
        ['Bakkerij A en bakkerij B verkopen allebei broden van gemiddeld {m} g. Bij bakkerij A is s = {s1} g, bij bakkerij B is s = {s2} g.', 800, 'Bij welke bakkerij weet je beter wat je krijgt?', 'bakkerij', 'bijna alle broden ongeveer {m} g wegen'],
        ['Bus A en bus B hebben allebei een gemiddelde rijtijd van {m} minuten. Bij bus A is s = {s1} min, bij bus B is s = {s2} min.', 35, 'Op welke bus kan je het best rekenen om op tijd te komen?', 'bus', 'de rijtijd bijna altijd ongeveer {m} minuten is'],
        ['Twee machines vullen flessen met gemiddeld {m} ml. Bij machine A is s = {s1} ml, bij machine B is s = {s2} ml.', 500, 'Welke machine vult de flessen het gelijkmatigst?', 'machine', 'bijna alle flessen ongeveer {m} ml bevatten'],
      ]);
      const s1 = kies([2, 3, 4, 5]), s2 = s1 * kies([4, 5, 6]), omg = kies([true, false]), sa = omg ? s2 : s1, sb = omg ? s1 : s2, best = omg ? 'B' : 'A';
      const zin = C[0].replace('{m}', C[1]).replace('{s1}', sa).replace('{s2}', sb);
      return { soort: 'betekenis', opdracht: C[2], html: opgave(zin), sleutel: zin, rapport: zin,
        antw: zinKeuze(`${C[3][0].toUpperCase() + C[3].slice(1)} ${best}: de kleine standaardafwijking betekent dat ${C[4].replace('{m}', C[1])}.`, [`${C[3][0].toUpperCase() + C[3].slice(1)} ${best === 'A' ? 'B' : 'A'}: een grote standaardafwijking betekent dat alles dichter bij het gemiddelde ligt.`, 'Er is geen verschil: het gemiddelde is hetzelfde.', `${C[3][0].toUpperCase() + C[3].slice(1)} ${best === 'A' ? 'B' : 'A'}: de standaardafwijking zegt niets over de spreiding.`]),
        uitleg: ['\\text{kleine } s \\text{: de gegevens liggen dicht bij het gemiddelde}', `\\text{${C[3]} ${best} heeft de kleinste } s`] };
    } },
  },
  oefenMix: [['gemiddelde', 2], ['stdev', 2], ['groot', 2], ['excel', 1], ['vergelijk', 2], ['betekenis', 1]],
  test: [['gemiddelde', 2], ['stdev', 1], ['groot', 2], ['excel', 1], ['vergelijk', 3], ['betekenis', 1]], testSchudden: true,
};
