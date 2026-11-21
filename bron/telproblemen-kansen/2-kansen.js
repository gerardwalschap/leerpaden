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
