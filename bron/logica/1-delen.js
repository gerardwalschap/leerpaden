// ===================================================================
//  LOGICA — de delen
// ===================================================================
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });

// ---- 1. Herhaling: proposities en waarheidstabellen ----------------------------------------
const ZINNEN = [
  ['Het regent en de zon schijnt.', 'AND'], ['Een leerling met een broer of een zus krijgt voorrang bij het inschrijven.', 'OR'],
  ['Als het niet regent, dan ga je met de fiets naar school.', 'IMP'], ['Je bent ofwel op school, ofwel thuis.', 'XOR'],
  ['Je mag naar een volgend jaar als en slechts als je geslaagd bent.', 'EQ'], ['Het regent niet.', 'NOT'],
  ['Jos eet ofwel frietjes, ofwel een pitta.', 'XOR'], ['Als je niet studeert, dan zal je niet slagen.', 'IMP'],
  ['Mijn rugzak is blauw en mijn jas is groen.', 'AND'], ['Je mag een dessert of een koffie nemen (of allebei).', 'OR'],
  ['Een driehoek is gelijkzijdig als en slechts als zijn drie hoeken 60° zijn.', 'EQ'], ['Niemand is te laat.', 'NOT'],
  ['Als een getal deelbaar is door 4, dan is het even.', 'IMP'], ['Een muntstuk valt ofwel op kop, ofwel op munt.', 'XOR'],
];
const FORMULES = [
  { o: 'NOT', a: ['p'] }, { o: 'AND', a: ['p', 'q'] }, { o: 'OR', a: ['p', 'q'] }, { o: 'XOR', a: ['p', 'q'] }, { o: 'IMP', a: ['p', 'q'] }, { o: 'EQ', a: ['p', 'q'] },
  { o: 'AND', a: [{ o: 'NOT', a: ['p'] }, 'q'] }, { o: 'IMP', a: [{ o: 'OR', a: ['p', 'q'] }, 'p'] },
  { o: 'AND', a: [{ o: 'IMP', a: ['p', 'q'] }, { o: 'IMP', a: ['q', 'p'] }] }, { o: 'EQ', a: [{ o: 'XOR', a: ['p', 'q'] }, { o: 'NOT', a: [{ o: 'AND', a: ['p', 'q'] }] }] },
  { o: 'EQ', a: [{ o: 'IMP', a: ['p', 'q'] }, { o: 'OR', a: [{ o: 'NOT', a: ['p'] }, 'q'] }] }, { o: 'OR', a: [{ o: 'IMP', a: ['p', 'q'] }, { o: 'IMP', a: ['q', 'p'] }] },
  { o: 'AND', a: ['p', { o: 'NOT', a: [{ o: 'OR', a: ['p', 'q'] }] }] }, { o: 'IMP', a: ['p', { o: 'IMP', a: ['q', 'p'] }] },
  { o: 'OR', a: ['p', { o: 'NOT', a: ['q'] }] }, { o: 'IMP', a: [{ o: 'NOT', a: ['q'] }, { o: 'NOT', a: ['p'] }] },
];
const tabelKolommen = (f) => deelformules(f).map(d => ({ kop: pTex(d), uit: pKolom(d) }));
const D1 = {
  nr: 1, titel: 'Herhaling: proposities, waarheidstabellen en redeneren', kort: 'Operatoren, vertalen naar symbolen, nodig/voldoende, ∀ en ∃, tegenvoorbeeld.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Proposities</div>
      <p>Een <b>propositie</b> is een uitspraak die waar (1) of vals (0) is. We gebruiken een letter als symbool: $p$: "Het regent." Een <b>waarheidstabel</b> geeft alle mogelijkheden weer.</p>
      <p>Samengestelde uitspraken maak je met verbindingswoorden: de <b>logische operatoren</b>.</p></div>
    <div class="kader def"><div class="kader-titel">De logische operatoren</div>
      <table class="tabel"><tr><th>operator</th><th>symbool</th><th>verbindingswoord</th></tr>
      ${['NOT', 'AND', 'OR', 'XOR', 'IMP', 'EQ'].map(o => `<tr><td><b>${OPS[o].naam}</b></td><td>$${o === 'NOT' ? '\\neg p' : `p ${OPS[o].tex} q`}$</td><td>${OPS[o].woord}</td></tr>`).join('')}</table></div>
    <div class="kader eig"><div class="kader-titel">De waarheidstabellen</div>
      <p class="midden">$\\begin{array}{cc|cccccc} p & q & \\neg p & p \\wedge q & p \\vee q & p \\oplus q & p \\Rightarrow q & p \\Leftrightarrow q \\\\ \\hline ${PQ.map(([p, q]) => [p, q, 1 - p, p & q, p | q, p ^ q, (p && !q) ? 0 : 1, p === q ? 1 : 0].join(' & ')).join(' \\\\ ')} \\end{array}$</p>
      <ul><li>Conjunctie: enkel waar als <b>beide</b> waar zijn.</li><li>Inclusieve disjunctie: waar zodra <b>minstens één</b> waar is.</li>
      <li>Exclusieve disjunctie: waar als <b>juist één</b> waar is.</li><li>Implicatie: enkel vals als $p$ waar is en $q$ vals.</li><li>Equivalentie: waar als $p$ en $q$ <b>dezelfde</b> waarheidswaarde hebben.</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Let op: ‘of’ en ‘als … dan …’ in de omgangstaal</div>
      <p>‘Wil je koffie of thee?’: in de omgangstaal betekent ‘of’ vaak ‘ofwel … ofwel’. In de logica is ‘of’ altijd <b>inclusief</b> (en/of), tenzij er ‘ofwel … ofwel’ staat.</p>
      <p>‘Als je je kamer opruimt, dan mag je gamen.’ In de omgangstaal begrijp je ‘als en slechts als’. In de logica zegt een implicatie <b>niets</b> over het geval waarin de voorwaarde vals is: dan is $p \\Rightarrow q$ altijd waar.</p></div>
    <div class="kader def"><div class="kader-titel">Vertalen naar symbolen</div>
      <p>Kies een letter voor elke enkelvoudige uitspraak (zonder ‘niet’), vervang de verbindingswoorden door symbolen en zet haakjes waar nodig. Met $p$: Het regent. en $q$: Ik ga met de fiets.</p>
      <ul><li>Het regent niet en ik ga met de fiets: $\\neg p \\wedge q$</li><li>Als het regent, dan ga ik niet met de fiets: $p \\Rightarrow \\neg q$</li><li>Het is niet waar dat het regent en dat ik met de fiets ga: $\\neg(p \\wedge q)$</li></ul></div>
    <div class="kader def"><div class="kader-titel">Nodige en voldoende voorwaarde</div>
      <p>Is $p \\Rightarrow q$ altijd waar, dan is $p$ een <b>voldoende</b> voorwaarde voor $q$ en is $q$ een <b>nodige</b> voorwaarde voor $p$. Is $p \\Leftrightarrow q$ altijd waar, dan is het een <b>nodige en voldoende</b> voorwaarde.</p>
      <p class="klein">Deelbaar door 4 ⇒ even: deelbaar door 4 is voldoende om even te zijn; even zijn is nodig om deelbaar door 4 te zijn.</p></div>
    <div class="kader def"><div class="kader-titel">∀, ∃ en een tegenvoorbeeld</div>
      <p>$\\forall$ = ‘voor alle’, $\\exists$ = ‘er bestaat (minstens één)’. Bv. $\\forall x \\in \\mathbb{R}: x^2 \\geq 0$ is waar; $\\exists x \\in \\mathbb{N}: x + 3 = 1$ is vals.</p>
      <p>Een uitspraak ‘voor alle …’ weerleg je met <b>één tegenvoorbeeld</b>. ‘Alle priemgetallen zijn oneven’ is vals: 2 is een even priemgetal. Eén voorbeeld dat wél klopt, bewijst niets.</p></div>
    <div class="kader"><div class="kader-titel">Een samengestelde formule</div><p>Werk van binnen naar buiten: maak een kolom voor elk deel. Bv. $(p \\vee q) \\Rightarrow p$: eerst de kolom $p \\vee q$, dan de hele formule.</p></div>`,
  voorbeelden: [
    { html: `Vertaal met $p$: Ik heb honger. en $q$: Ik eet een boterham. <br>‘Als ik geen honger heb, dan eet ik geen boterham.’`, stappen: ['\\text{‘geen honger’: } \\neg p', '\\text{‘geen boterham’: } \\neg q', '\\text{‘als … dan …’: } \\neg p \\Rightarrow \\neg q'] },
    { html: `Een vader zegt: ‘Als je je huiswerk maakt, dan mag je tv kijken.’ Je maakt je huiswerk niet en je mag toch tv kijken. Heeft hij gelogen?`, stappen: ['p = 0 \\text{ (geen huiswerk)}, \\; q = 1 \\text{ (tv)}', 'p \\Rightarrow q = 0 \\Rightarrow 1 = 1', '\\text{De implicatie is waar: hij heeft niet gelogen.}'] },
    { html: `‘Voor alle reële getallen $a$ geldt $a^2 \\geq a$.’ Waar of vals?`, stappen: ['\\text{Zoek een tegenvoorbeeld: probeer een getal tussen 0 en 1.}', 'a = 0{,}5: \\; a^2 = 0{,}25 < 0{,}5', '\\text{Eén tegenvoorbeeld volstaat: de uitspraak is vals.}'] },
    { tex: `\\begin{array}{cc|cc} p & q & \\neg p & \\neg p \\wedge q \\\\ \\hline 1 & 1 & 0 & 0 \\\\ 1 & 0 & 0 & 0 \\\\ 0 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 0 \\end{array}`, stappen: ['\\text{eerst de kolom } \\neg p', '\\text{dan de conjunctie met } q: \\text{ enkel 1 als beide 1 zijn}'] },
  ],
  soorten: {
    operator: { naam: 'Welke operator?', gen() {
      const [z, o] = kies(ZINNEN), namen = ['NOT', 'AND', 'OR', 'XOR', 'IMP', 'EQ'];
      return { soort: 'operator', opdracht: 'Welke logische operator herken je in deze uitspraak?', html: opgave(z), sleutel: z, rapport: z,
        antw: keuze(kT(namen.map(n => OPS[n].naam)), namen.indexOf(o)), uitleg: [`\\text{verbindingswoord "${OPS[o].woord}": ${OPS[o].naam}}`] };
    } },
    waarde: { naam: 'Waar of vals?', gen() {
      const f = kies(FORMULES), p = rnd(0, 1), q = rnd(0, 1), v = pEval(f, { p, q });
      const stappen = deelformules(f).map(d => `${pTex(d)} = ${pEval(d, { p, q })}`);
      return { soort: 'waarde', opdracht: `Wat is de waarheidswaarde als p = ${p} en q = ${q}?`, tex: pTex(f), antw: neKeuze(v), uitleg: [`p = ${p}, \\; q = ${q}`, ...stappen] };
    } },
    vertaal: { naam: 'Vertalen naar symbolen', gen() {
      // hoofdzin p / q, bijzin (na 'als', 'dat') p / niet p / q, inversie na 'dan' q / niet q
      const Z = kies([
        { p: 'het regent', q: 'ik ga met de fiets', bp: 'het regent', bnp: 'het niet regent', bq: 'ik met de fiets ga', iq: 'ga ik met de fiets', inq: 'ga ik niet met de fiets', np: 'het regent niet' },
        { p: 'ik heb honger', q: 'ik eet een boterham', bp: 'ik honger heb', bnp: 'ik geen honger heb', bq: 'ik een boterham eet', iq: 'eet ik een boterham', inq: 'eet ik geen boterham', np: 'ik heb geen honger' },
        { p: 'het is weekend', q: 'ik slaap lang', bp: 'het weekend is', bnp: 'het geen weekend is', bq: 'ik lang slaap', iq: 'slaap ik lang', inq: 'slaap ik niet lang', np: 'het is geen weekend' },
        { p: 'de schakelaar staat aan', q: 'de lamp brandt', bp: 'de schakelaar aan staat', bnp: 'de schakelaar niet aan staat', bq: 'de lamp brandt', iq: 'brandt de lamp', inq: 'brandt de lamp niet', np: 'de schakelaar staat niet aan' }]);
      const H = (z) => z.charAt(0).toUpperCase() + z.slice(1);
      const bank = [
        [`${H(Z.np)} en ${Z.q}.`, '\\neg p \\wedge q', ['p \\wedge \\neg q', '\\neg(p \\wedge q)', '\\neg p \\vee q']],
        [`Als ${Z.bp}, dan ${Z.inq}.`, 'p \\Rightarrow \\neg q', ['\\neg p \\Rightarrow q', 'p \\Leftrightarrow \\neg q', '\\neg(p \\Rightarrow q)']],
        [`Als ${Z.bnp}, dan ${Z.inq}.`, '\\neg p \\Rightarrow \\neg q', ['p \\Rightarrow q', '\\neg(p \\Rightarrow q)', 'q \\Rightarrow p']],
        [`Als ${Z.bp}, dan ${Z.iq}.`, 'p \\Rightarrow q', ['q \\Rightarrow p', 'p \\Leftrightarrow q', 'p \\wedge q']],
        [`${H(Z.q)} als en slechts als ${Z.bp}.`, 'q \\Leftrightarrow p', ['q \\Rightarrow p', 'p \\Rightarrow q', 'p \\wedge q']],
        [`Het is niet waar dat ${Z.bp} en dat ${Z.bq}.`, '\\neg(p \\wedge q)', ['\\neg p \\wedge q', '\\neg p \\wedge \\neg q', '\\neg(p \\vee q)']],
        [`${H(Z.p)} of ${Z.q} (of allebei).`, 'p \\vee q', ['p \\oplus q', 'p \\wedge q', 'p \\Rightarrow q']],
        [`${H(Z.p)} of ${Z.q}, maar niet allebei.`, 'p \\oplus q', ['p \\vee q', 'p \\Leftrightarrow q', 'p \\wedge q']],
      ];
      const [zin, j, f] = kies(bank), s = schud([j, ...f]);
      return { soort: 'vertaal', opdracht: 'Welke uitspraak in symbolen hoort bij de zin?', html: opgave(`$p$: ${H(Z.p)}. &nbsp; $q$: ${H(Z.q)}.<br><b>${zin}</b>`), sleutel: zin, rapport: zin,
        antw: keuze(kTex(s), s.indexOf(j)), uitleg: [j] };
    } },
    omgang: { naam: '‘Of’ en ‘als … dan’ in de omgangstaal', gen() {
      const bank = [
        ['‘Kinderen jonger dan 12 jaar of ouder dan 65 jaar betalen minder.’ Welke disjunctie is dit?', ['inclusieve disjunctie', 'exclusieve disjunctie', 'conjunctie', 'implicatie']],
        ['‘Je komt ofwel met de bus, ofwel met de fiets.’ Welke disjunctie is dit?', ['exclusieve disjunctie', 'inclusieve disjunctie', 'equivalentie', 'negatie']],
        ['Een vader zegt: ‘Als je je huiswerk maakt, dan mag je tv kijken.’ Je maakt je huiswerk niet en mag toch tv kijken. Heeft de vader gelogen?', ['nee, de implicatie is waar', 'ja, de implicatie is vals', 'dat kan je niet weten', 'ja, want het is een equivalentie']],
        ['Wanneer is ‘Als het regent, dan is de straat nat’ vals?', ['als het regent en de straat niet nat is', 'als het niet regent en de straat nat is', 'als het niet regent en de straat droog is', 'nooit']],
        ['In de logica betekent ‘of’ (zonder ‘ofwel … ofwel’) …', ['en/of: minstens één van beide', 'juist één van beide', 'beide tegelijk', 'geen van beide']],
        ['Een leraar zegt: ‘Als je 10 op 10 haalt, dan krijg je een sticker.’ Je haalt 8 op 10 en krijgt toch een sticker. Is de uitspraak van de leraar vals?', ['nee, de voorwaarde is vals, dus de implicatie is waar', 'ja, want je had geen 10 op 10', 'ja, want het gevolg is waar', 'dat hangt af van de leraar']],
      ];
      const [v, opts] = kies(bank), s = schud(opts.map((o, i) => ({ o, i })));
      return { soort: 'omgang', opdracht: 'Kies het juiste antwoord.', html: opgave(v), sleutel: v, rapport: v, antw: keuze(kT(s.map(x => x.o)), s.findIndex(x => x.i === 0)),
        uitleg: ['\\text{‘of’ = en/of (inclusief); } p \\Rightarrow q \\text{ is enkel vals als } p = 1 \\text{ en } q = 0.'] };
    } },
    voorwaarde: { naam: 'Nodige en voldoende voorwaarde', gen() {
      const bank = [
        ['‘Deelbaar zijn door 4’ is voor ‘even zijn’ een …', 0], ['‘Even zijn’ is voor ‘deelbaar zijn door 4’ een …', 1],
        ['‘Deelbaar zijn door 10’ is voor ‘op 0 eindigen’ een …', 2], ['‘$x = 3$’ is voor ‘$x^2 = 9$’ een …', 0], ['‘$x^2 = 9$’ is voor ‘$x = 3$’ een …', 1],
        ['‘Vier gelijke zijden hebben’ is voor ‘een vierkant zijn’ een …', 1], ['‘Drie hoeken van 60° hebben’ is voor ‘een gelijkzijdige driehoek zijn’ een …', 2],
        ['‘Een vierkant zijn’ is voor ‘vier gelijke zijden hebben’ een …', 0],
      ];
      const [v, j] = kies(bank), namen = ['voldoende voorwaarde (niet nodig)', 'nodige voorwaarde (niet voldoende)', 'nodige en voldoende voorwaarde'];
      return { soort: 'voorwaarde', opdracht: 'Vul aan.', html: opgave(v), sleutel: v, rapport: v.replace(/\$/g, ''), antw: keuze(kT(namen), j),
        uitleg: ['p \\Rightarrow q: \\; p \\text{ is voldoende, } q \\text{ is nodig}', 'p \\Leftrightarrow q: \\text{ nodig en voldoende}'] };
    } },
    kwantor: { naam: '∀ en ∃: waar of vals?', gen() {
      const bank = [
        ['\\forall x \\in \\mathbb{R}: x^2 \\geq 0', 1, '\\text{een kwadraat is nooit negatief}'], ['\\forall x \\in \\mathbb{R}: x^2 > 0', 0, 'x = 0: \\; 0^2 = 0'],
        ['\\exists x \\in \\mathbb{N}: x + 3 = 1', 0, '\\text{de oplossing } -2 \\text{ is geen natuurlijk getal}'], ['\\exists x \\in \\mathbb{Z}: x + 3 = 1', 1, 'x = -2'],
        ['\\forall n \\in \\mathbb{N}: n^2 > n', 0, 'n = 1: \\; 1^2 = 1'], ['\\exists x \\in \\mathbb{R}: x^2 = -4', 0, '\\text{een kwadraat is nooit negatief}'],
        ['\\forall n \\in \\mathbb{N}: 2n \\text{ is even}', 1, '\\text{het dubbel van een natuurlijk getal is even}'], ['\\exists x \\in \\mathbb{N}: x < 1', 1, 'x = 0'],
      ];
      const [f, w, u] = kies(bank);
      return { soort: 'kwantor', opdracht: 'Is de uitspraak waar of vals?', tex: f, antw: keuze(kT(['waar', 'vals']), w ? 0 : 1), uitleg: [u] };
    } },
    tegen: { naam: 'Een tegenvoorbeeld kiezen', gen() {
      const bank = [
        ['Alle priemgetallen zijn oneven.', ['2', '3', '9', '15']], ['Alle veelvouden van 3 zijn oneven.', ['6', '9', '15', '21']],
        ['Als een getal deelbaar is door 2, dan is het deelbaar door 4.', ['6', '8', '12', '16']], ['Voor alle reële getallen $a$ geldt $a^2 \\geq a$.', ['$a = 0{,}5$', '$a = 2$', '$a = -1$', '$a = 1$']],
        ['Voor alle $x$ geldt $(x + 1)^2 = x^2 + 1$.', ['$x = 1$', '$x = 0$', 'geen: de uitspraak is waar', '$x = -0$']],
        ['Elk getal dat eindigt op 4 is deelbaar door 4.', ['14', '24', '44', '64']],
      ];
      const [v, opts] = kies(bank), s = schud(opts.map((o, i) => ({ o, i })));
      return { soort: 'tegen', opdracht: 'Welk getal is een tegenvoorbeeld voor deze uitspraak?', html: opgave(v), sleutel: v, rapport: v.replace(/\$/g, ''),
        antw: keuze(s.map((x, i) => ({ k: String(i), l: /\$/.test(x.o) ? x.o.replace(/\$/g, '') : `\\text{${x.o}}` })), s.findIndex(x => x.i === 0)),
        uitleg: ['\\text{Eén geval waarin de uitspraak niet klopt, weerlegt ze.}'] };
    } },
    tabel: { naam: 'Waarheidstabel invullen', gen() {
      const f = kies(FORMULES);
      return { soort: 'tabel', opdracht: 'Vul de waarheidstabel in.', tex: pTex(f), antw: { soort: 'wt', vars: ['p', 'q'], kolommen: tabelKolommen(f) }, uitleg: ['\\text{werk van binnen naar buiten}', LG.wtTex({ vars: ['p', 'q'], kolommen: tabelKolommen(f) })] };
    } },
  },
  oefenMix: [['operator', 1], ['vertaal', 1], ['waarde', 1], ['tabel', 2], ['omgang', 1], ['voorwaarde', 1], ['kwantor', 1], ['tegen', 1]],
  test: [['operator', 1], ['vertaal', 2], ['waarde', 1], ['tabel', 2], ['omgang', 1], ['voorwaarde', 1], ['kwantor', 1], ['tegen', 1]], testSchudden: true,
};

// ---- 2. en 3. logische poorten ------------------------------------------------------------
function poortSoorten(lijst, alle) {
  return {
    herken: { naam: 'Welke poort is dit?', gen() {
      const t = kies(lijst), opts = schud([...new Set([t, ...schud(alle.filter(x => x !== t)).slice(0, 3)])]);
      return { soort: 'herken', opdracht: 'Welke poort stelt dit IEC-symbool voor?', html: gateIcoon(t), sleutel: t, rapport: t, antw: keuze(kT(opts), opts.indexOf(t)),
        uitleg: [`\\text{label } ${{ '&': '\\&', '≥1': '\\geq 1', '=1': '=1', '1': '1' }[LG.POORT[t].lab]}\\text{${LG.POORT[t].neg ? ' met een bolletje (negatie)' : ''}: ${t}}`] };
    } },
    tabel: { naam: 'Waarheidstabel van een poort', gen() {
      const t = kies(lijst), P = LG.POORT[t];
      const a = P.n === 1 ? { soort: 'wt', vars: ['A'], kolommen: [{ kop: 'X', uit: [0, 1] }] } : { soort: 'wt', vars: ['A', 'B'], kolommen: [{ kop: 'X', uit: LG.rijen(2).map(([x, y]) => P.f(x, y)) }] };
      return { soort: 'tabel', opdracht: `Vul de waarheidstabel van de ${t}-poort in.`, html: gateIcoon(t), sleutel: 't' + t, rapport: `tabel ${t}`, antw: a, uitleg: [gateTabelTex(t)] };
    } },
    uitvoer: { naam: 'Wat is de output?', gen() {
      const t = kies(lijst), P = LG.POORT[t], A = rnd(0, 1), B = rnd(0, 1), X = P.n === 1 ? P.f(A) : P.f(A, B);
      return { soort: 'uitvoer', opdracht: P.n === 1 ? `Wat is de output X als A = ${A}?` : `Wat is de output X als A = ${A} en B = ${B}?`, html: gateIcoon(t), sleutel: `u${t}${A}${B}`, rapport: `${t}(${A},${B})`,
        antw: neKeuze(X), uitleg: [`\\text{${t}}: \\; ${P.n === 1 ? `A = ${A}` : `A = ${A}, B = ${B}`} \\Rightarrow X = ${X}`] };
    } },
    welke: { naam: 'Welke poort hoort bij de tabel?', gen() {
      const t = kies(lijst.filter(x => x !== 'NOT')), opts = schud([...new Set([t, ...schud(alle.filter(x => x !== t && x !== 'NOT')).slice(0, 3)])]);
      return { soort: 'welke', opdracht: 'Welke poort hoort bij deze waarheidstabel?', tex: gateTabelTex(t), antw: keuze(kT(opts), opts.indexOf(t)), uitleg: [`\\text{${t}}`] };
    } },
  };
}
const POORTEN_THEORIE = (lijst) => lijst.map(t => `<div class="kader ${t === 'XOR' || t === 'XNOR' ? 'eig' : 'def'}"><div class="kader-titel">De ${t}-poort</div>
  <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:center">${gateIcoon(t)}<span>$${gateTabelTex(t)}$</span></div>
  <p>${{ NOT: 'Eén input (enkelvoudig). De output is altijd het <b>tegengestelde</b> van de input: de negatie.',
    AND: 'Volgt de waarheidstabel van de <b>conjunctie</b>: de output is enkel 1 als <b>beide</b> inputs 1 zijn. IEC-label: &amp;.',
    OR: 'Volgt de waarheidstabel van de <b>inclusieve disjunctie</b>: de output is 1 zodra <b>minstens één</b> input 1 is. IEC-label: ≥1.',
    XOR: 'De <b>exclusieve disjunctie</b>: zoals OR, behalve als beide inputs 1 zijn. XOR geeft enkel 1 als de inputs <b>verschillend</b> zijn. IEC-label: =1.',
    NAND: 'De <b>negatie van de AND-poort</b>: eerst AND, dan het omgekeerde. Het bolletje aan de output betekent negatie.',
    NOR: 'De <b>negatie van de OR-poort</b>: enkel 1 als beide inputs 0 zijn.',
    XNOR: 'De <b>negatie van de XOR-poort</b>: de output is 1 zodra beide inputs <b>gelijk</b> zijn.' }[t]}</p></div>`).join('');
const D2 = {
  nr: 2, titel: 'Logische poorten: NOT, AND, OR en XOR', kort: 'Booleaanse data en de vier basispoorten met hun IEC-symbool.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Binaire wereld</div>
      <p>Computers werken met stroom die doorstroomt of niet: aan (1) of uit (0). <b>Booleaanse data</b> zijn gegevens die slechts twee waarden kunnen aannemen: 1 (waar) of 0 (onwaar).</p>
      <p><b>Logische poorten</b> zijn visuele voorstellingen van elektronische schakelingen met één of meer inputs en één output. Elke poort heeft een waarheidstabel. We gebruiken de <b>IEC-symbolen</b>: een rechthoek met een label.</p></div>
    ${POORTEN_THEORIE(['NOT', 'AND', 'OR', 'XOR'])}`,
  voorbeelden: [{ html: gateIcoon('OR'), stappen: ['\\text{label } \\geq 1: \\text{ OR-poort}', 'A = 0, \\; B = 1 \\Rightarrow X = 1 \\text{ (minstens één input is 1)}'] }],
  soorten: { ...poortSoorten(['NOT', 'AND', 'OR', 'XOR'], ['NOT', 'AND', 'OR', 'XOR']),
    operator: { naam: 'Poort en operator', gen() {
      const t = kies(['NOT', 'AND', 'OR', 'XOR']), opts = ['negatie', 'conjunctie', 'inclusieve disjunctie', 'exclusieve disjunctie'];
      return { soort: 'operator', opdracht: `Welke logische operator volgt de ${t}-poort?`, html: gateIcoon(t), sleutel: 'o' + t, rapport: t, antw: keuze(kT(opts), opts.indexOf(OPERATOR_VAN[t])), uitleg: [`\\text{${t}: ${OPERATOR_VAN[t]}}`] };
    } } },
  oefenMix: [['herken', 1], ['tabel', 1], ['uitvoer', 1], ['welke', 1], ['operator', 1]],
  test: [['herken', 2], ['tabel', 2], ['uitvoer', 3], ['welke', 2], ['operator', 1]], testSchudden: true,
};
const ALLE7 = ['NOT', 'AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'];
const D3 = {
  nr: 3, titel: 'Negatiepoorten: NAND, NOR en XNOR', kort: 'Eerst de gewone poort, dan de negatie: het bolletje.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">N-poorten</div>
      <p>Elke poort met meervoudige input kan gecombineerd worden met een NOT-schakeling: je neemt eerst de gewone poort en negeert daarna de output. Zo ontstaan <b>NAND</b>, <b>NOR</b> en <b>XNOR</b>.</p>
      <p>Het kleine rondje (<b>bubble</b>) op de output betekent telkens negatie.</p></div>${POORTEN_THEORIE(['NAND', 'NOR', 'XNOR'])}`,
  voorbeelden: [{ html: gateIcoon('NAND'), stappen: ['\\text{label \\& met bolletje: NAND}', 'A = 1, \\; B = 1: \\; \\text{AND geeft } 1, \\text{ de negatie } 0'] }],
  soorten: poortSoorten(['NAND', 'NOR', 'XNOR', 'NAND', 'NOR', 'XNOR', 'AND', 'OR', 'XOR', 'NOT'], ALLE7),
  oefenMix: [['herken', 1], ['tabel', 1], ['uitvoer', 1], ['welke', 1]],
  test: [['herken', 3], ['tabel', 2], ['uitvoer', 3], ['welke', 2]], testSchudden: true,
};

// ---- 4. Poorten combineren -------------------------------------------------------------
const OP2 = ['AND', 'OR', 'XOR'];
function schakelBoom() {
  const g = () => kies([...OP2, 'AND', 'OR', kies(['NAND', 'NOR'])]);
  return kies([
    () => ({ t: g(), a: [{ t: kies(OP2), a: [0, 1] }, 2] }),            // (A ∘ B) ∘ C
    () => ({ t: kies(['AND', 'OR']), a: [{ t: 'NOT', a: [0] }, 1] }),   // ¬A ∘ B   (2 ingangen)
    () => ({ t: kies(['AND', 'OR']), a: [{ t: kies(OP2), a: [0, 1] }, { t: 'NOT', a: [2] }] }), // (A ∘ B) ∘ ¬C
    () => ({ t: kies(['AND', 'OR']), a: [0, { t: kies(OP2), a: [1, 2] }] }), // A ∘ (B ∘ C)
  ])();
}
const nIn = (b) => { let m = 0; const r = (k) => { if (typeof k === 'number') m = Math.max(m, k); else k.a.forEach(r); }; r(b); return m + 1; };
function tussen(b) { const l = []; const r = (k) => { if (typeof k === 'number') return; k.a.forEach(r); l.push(k); }; r(b); return l; }
const LETTERS_T = ['Y', 'Z', 'W'];
function combiKolommen(b, namen) {
  const T = tussen(b), n = namen.length;
  return T.map((k, i) => ({ kop: i === T.length - 1 ? 'X' : LETTERS_T[i], uit: LG.boomTabel(n, k) }));
}
function mutaties(b) {
  const m = [], wissel = { AND: 'OR', OR: 'AND', XOR: 'OR', NAND: 'NOR', NOR: 'NAND', XNOR: 'XOR', NOT: 'NOT' };
  const kopie = (x) => JSON.parse(JSON.stringify(x));
  const a1 = kopie(b); a1.t = wissel[a1.t]; m.push(a1);
  const a2 = kopie(b); const binnen = a2.a.find(k => typeof k !== 'number' && k.t !== 'NOT'); if (binnen) { binnen.t = wissel[binnen.t]; m.push(a2); }
  const a3 = kopie(b); a3.a = a3.a.map(k => typeof k === 'number' ? { t: 'NOT', a: [k] } : (k.t === 'NOT' ? k.a[0] : k)); m.push(a3);
  const a4 = kopie(b); if (binnen) { const i = a4.a.findIndex(k => typeof k !== 'number' && k.t !== 'NOT'); const j = 1 - i; if (typeof a4.a[j] === 'number') { const tmp = a4.a[i].a[0]; a4.a[i].a[0] = a4.a[j]; a4.a[j] = tmp; m.push(a4); } }
  return m;
}
const D4 = {
  nr: 4, titel: 'Poorten combineren', kort: 'Werk stap voor stap: eerst de poort het dichtst bij de inputs.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Schakelingen met meerdere poorten</div>
      <p>Een schakeling bestaat meestal uit meerdere poorten na elkaar. Werk ze stap voor stap uit: eerst de poort(en) die het dichtst bij de inputs staan, dan de volgende poort met die <b>tussenresultaten</b> als input.</p>
      <p><b>Voorbeeld:</b> X is 1 als A EN B allebei 1 zijn, OF als C 1 is. Eerst $Y = A \\text{ AND } B$, dan $X = Y \\text{ OR } C$: &nbsp; $X = (A \\cdot B) + C$.</p>
      ${LG.vastSVG({ ingangen: ['A', 'B', 'C'], uitgang: 'X' }, { t: 'OR', a: [{ t: 'AND', a: [0, 1] }, 2] })}</div>
    <div class="kader eig"><div class="kader-titel">Notatie van de logische functie</div>
      <p>$\\cdot$ = AND &nbsp; · &nbsp; $+$ = OR &nbsp; · &nbsp; $\\neg$ = NOT &nbsp; · &nbsp; $\\oplus$ = XOR. Met 3 inputs heeft de waarheidstabel $2^3 = 8$ rijen.</p></div>`,
  voorbeelden: [{ tex: `\\begin{array}{ccc|cc} A & B & C & Y = A \\cdot B & X = Y + C \\\\ \\hline ${LG.rijen(3).map(([a, b, c]) => `${a} & ${b} & ${c} & ${a & b} & ${(a & b) | c}`).join(' \\\\ ')} \\end{array}`, stappen: ['\\text{eerst de kolom } Y, \\text{ dan } X'] }],
  soorten: {
    tabel: { naam: 'Waarheidstabel van een schakeling', gen() {
      const b = schakelBoom(), namen = ['A', 'B', 'C'].slice(0, nIn(b)), a = { ingangen: namen, uitgang: 'X' };
      const kol = combiKolommen(b, namen), T = tussen(b);
      return { soort: 'tabel', opdracht: `Vul de waarheidstabel in.${T.length > 1 ? ` ${T.slice(0, -1).map((k, i) => `${LETTERS_T[i]} is de output van de ${k.t}-poort`).join(', ')}.` : ''}`, html: `<div class="lg-figuur">${LG.vastSVG(a, b)}</div>`, sleutel: JSON.stringify(b), rapport: `X = ${sTex(b, namen)}`,
        antw: { soort: 'wt', vars: namen, kolommen: kol }, uitleg: [`X = ${sTex(b, namen)}`, LG.wtTex({ vars: namen, kolommen: kol })] };
    } },
    uitvoer: { naam: 'Output van een schakeling', gen() {
      const b = schakelBoom(), namen = ['A', 'B', 'C'].slice(0, nIn(b)), ins = namen.map(() => rnd(0, 1)), X = LG.boomEval(b, ins);
      return { soort: 'uitvoer', opdracht: `Wat is de output X als ${namen.map((n, i) => `${n} = ${ins[i]}`).join(', ')}?`, html: `<div class="lg-figuur">${LG.vastSVG({ ingangen: namen, uitgang: 'X' }, b)}</div>`, sleutel: JSON.stringify(b) + ins, rapport: `X = ${sTex(b, namen)}`,
        antw: neKeuze(X), uitleg: [...tussen(b).map((k, i, L) => `${i === L.length - 1 ? 'X' : LETTERS_T[i]} = ${k.t}: \\; ${LG.boomEval(k, ins)}`)] };
    } },
    functie: { naam: 'Logische functie aflezen', gen() {
      const b = schakelBoom(), namen = ['A', 'B', 'C'].slice(0, nIn(b)), j = `X = ${sTex(b, namen)}`;
      return { soort: 'functie', opdracht: 'Welke logische functie hoort bij de schakeling?', html: `<div class="lg-figuur">${LG.vastSVG({ ingangen: namen, uitgang: 'X' }, b)}</div>`, sleutel: 'f' + JSON.stringify(b), rapport: j,
        antw: drieUniek(j, mutaties(b).map(m => `X = ${sTex(m, namen)}`)), uitleg: ['\\text{volg de poorten van links naar rechts}', j] };
    } },
  },
  oefenMix: [['tabel', 2], ['uitvoer', 1], ['functie', 1]],
  test: [['tabel', 4], ['uitvoer', 3], ['functie', 3]], testSchudden: true,
};

// ---- 5. Schakelingen bouwen ------------------------------------------------------------------
const BOUW_THEORIE = `<div class="kader def"><div class="kader-titel">Zelf een schakeling bouwen</div>
    <ol><li>Rechts staan de poorten. <b>Sleep</b> een poort naar het werkblad (of klik erop).</li>
    <li>Verbind: klik op een <b>uitgang</b> (blauw bolletje rechts van een ingang of poort) en daarna op een <b>ingang</b> van een poort (wit bolletje links). Zo trek je een draad.</li>
    <li>Verbind de laatste poort met de uitgang rechts.</li>
    <li><b>Probeer uit:</b> klik op de ingangen links om ze tussen 0 en 1 te wisselen. Draden met een 1 kleuren oranje en de uitgang licht op.</li></ol>
    <p class="klein">Een draad weghalen: klik op de witte ingang waar hij aankomt. Een poort weghalen: klik op ✕.</p></div>
  <div class="kader eig"><div class="kader-titel">Van functie naar schakeling</div><p>$X = (A \\cdot B) + \\neg C$: een AND-poort met A en B, een NOT-poort op C, en beide uitgangen samen in een OR-poort.</p>
    ${LG.vastSVG({ ingangen: ['A', 'B', 'C'], uitgang: 'X' }, { t: 'OR', a: [{ t: 'AND', a: [0, 1] }, { t: 'NOT', a: [2] }] })}</div>`;
const bouwAntw = (namen, uitgang, b, poorten) => ({ soort: 'schakeling', ingangen: namen, uitgang, doel: LG.boomTabel(namen.length, b), boom: b, tex: `${naamTex(uitgang)} = ${sTex(b, namen)}`, poorten });
const D5 = {
  nr: 5, titel: 'Schakelingen bouwen', kort: 'Sleep poorten naar het werkblad en verbind ze.', rekenmachine: false,
  theorie: BOUW_THEORIE,
  voorbeelden: [],
  soorten: {
    bouw: { naam: 'Bouw de schakeling', gen() {
      const b = schakelBoom(), namen = ['A', 'B', 'C'].slice(0, nIn(b));
      return { soort: 'bouw', opdracht: 'Bouw de schakeling voor deze logische functie. Probeer ze daarna uit.', tex: `X = ${sTex(b, namen)}`, antw: bouwAntw(namen, 'X', b, ALLE7),
        uitleg: [`X = ${sTex(b, namen)}`, `\\text{poorten: } ${tussen(b).map(k => `\\text{${k.t}}`).join(', ')}`] };
    } },
    tabelbouw: { naam: 'Bouw de schakeling bij een tabel', gen() {
      const t = kies(['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR']), b = { t, a: [0, 1] };
      return { soort: 'tabelbouw', opdracht: 'Bouw een schakeling met deze waarheidstabel.', tex: gateTabelTex(t), antw: bouwAntw(['A', 'B'], 'X', b, ALLE7), uitleg: [`\\text{${t}-poort}`] };
    } },
  },
  oefenMix: [['bouw', 3], ['tabelbouw', 1]],
  test: [['bouw', 7], ['tabelbouw', 3]], testSchudden: true,
};

// ---- 6. Domotica -----------------------------------------------------------------------
const AND = (...a) => ({ t: 'AND', a }), OR = (...a) => ({ t: 'OR', a }), NOT = (x) => ({ t: 'NOT', a: [x] }), XOR = (...a) => ({ t: 'XOR', a });
const DOMOTICA = [
  { z: 'Als het licht van de badkamer aan is (L1) EN je zet de douche aan (D), dan start de ventilator (V).', in: ['L1', 'D'], uit: 'V', b: AND(0, 1) },
  { z: 'De buitenverlichting (Lb) gaat aan als het donker is (S, schemersensor) OF als iemand op de bel drukt (Bel).', in: ['S', 'Bel'], uit: 'Lb', b: OR(0, 1) },
  { z: 'Het alarm gaat af als een raamsensor (R) OF een deursensor (Dr) een opening detecteert, MAAR alleen als het alarm ingeschakeld is (A).', in: ['R', 'Dr', 'A'], uit: 'Al', b: AND(OR(0, 1), 2) },
  { z: 'De rolluiken (Ro) sluiten als de windsnelheid te hoog is (W) OF als het begint te regenen (Re) EN het raam openstaat (Ra).', in: ['W', 'Re', 'Ra'], uit: 'Ro', b: OR(0, AND(1, 2)) },
  { z: 'In de garage gaat het licht (Lg) aan als de garagepoort opent (P) EN het NIET dag is (S = 1 als het dag is).', in: ['P', 'S'], uit: 'Lg', b: AND(0, NOT(1)) },
  { z: 'De verwarming (Vw) staat aan als de thermostaat warmte vraagt (T), maar NIET als het raam open is (Ra).', in: ['T', 'Ra'], uit: 'Vw', b: AND(0, NOT(1)) },
  { z: 'Een lamp (L) wordt bediend met twee schakelaars S1 en S2 (wisselschakeling): de lamp brandt als precies één van de twee schakelaars actief is.', in: ['S1', 'S2'], uit: 'L', b: XOR(0, 1) },
  { z: 'De afzuigkap (Af) start als het kookvuur aan staat (K) EN de rookmelder NIET afgaat (Rm).', in: ['K', 'Rm'], uit: 'Af', b: AND(0, NOT(1)) },
  { z: 'De tuinverlichting (Tl) gaat aan als het donker is (S) EN (er beweging is (B) OF de bewoner de lichten via de app activeert (App)).', in: ['S', 'B', 'App'], uit: 'Tl', b: AND(0, OR(1, 2)) },
  { z: 'Het brandalarm (Al) gaat af als de rookmelder (Rm) OF de hittesensor (H) een signaal geeft, maar NIET tijdens de testmodus (Te = 1 tijdens test).', in: ['Rm', 'H', 'Te'], uit: 'Al', b: AND(OR(0, 1), NOT(2)) },
  { z: 'De tuinsproeier (Sp) start als de bodem droog is (Dr) EN de tijdklok actief is (Ti), OF als de bewoner hem via de app aanzet (App).', in: ['Dr', 'Ti', 'App'], uit: 'Sp', b: OR(AND(0, 1), 2) },
  { z: 'Het zwembadfilter (F) start als de pomptimer actief is (Ti) EN het water warm genoeg is (Te), maar NIET als het waterniveau te laag is (N = 1).', in: ['Ti', 'Te', 'N'], uit: 'F', b: AND(AND(0, 1), NOT(2)) },
  { z: 'De garagepoort (G) gaat open als je op de afstandsbediening drukt (Ab) OF de wagen herkend wordt (Ca), maar NIET als er een obstakel is (Ob).', in: ['Ab', 'Ca', 'Ob'], uit: 'G', b: AND(OR(0, 1), NOT(2)) },
  { z: 'De koffiemachine (Km) start als het 7 uur is (Wk) EN er water in het reservoir zit (Wa).', in: ['Wk', 'Wa'], uit: 'Km', b: AND(0, 1) },
  { z: 'De bel (Bl) gaat binnen af als iemand aan de voordeur (Vd) OF aan de achterdeur (Ad) aanbelt.', in: ['Vd', 'Ad'], uit: 'Bl', b: OR(0, 1) },
  { z: 'Het licht in de gang (Lg) brandt als er beweging is (B) EN het donker is (S), OF als de nachtmodus aan staat (N).', in: ['B', 'S', 'N'], uit: 'Lg', b: OR(AND(0, 1), 2) },
];
const D6 = {
  nr: 6, titel: 'Domotica: logische schakelingen in huis', kort: 'Ingangen en uitgang benoemen, functie opstellen, schakeling bouwen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div>
      <ol><li>Benoem de <b>ingangen</b> (sensoren, schakelaars) en de <b>uitgang</b> (lamp, alarm, …).</li>
      <li>Zoek de redenering: EN (beide nodig) → AND · OF (één volstaat) → OR · NIET → NOT · precies één van beide → XOR.</li>
      <li>Stel de logische functie op met $\\cdot$, $+$, $\\neg$ en $\\oplus$. Let op de volgorde (haakjes!).</li>
      <li>Bouw de schakeling met de IEC-symbolen en probeer ze uit.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld</div>
      <p>Het alarm gaat af als een raamsensor (R) OF een deursensor (Dr) een opening detecteert, MAAR alleen als het alarm ingeschakeld is (A).</p>
      <p>Eerst R OF Dr (OR-poort), dat resultaat EN A (AND-poort): $\\mathrm{Alarm} = A \\cdot (R + \\mathrm{Dr})$</p>
      ${LG.vastSVG({ ingangen: ['R', 'Dr', 'A'], uitgang: 'Alarm' }, AND(OR(0, 1), 2))}
      <p class="klein">"NIET dag" schrijf je met een NOT-poort: $\\neg S$. "Ongeacht T" of "maar niet als …" vraagt meestal een AND met een NOT.</p></div>${BOUW_THEORIE}`,
  voorbeelden: [],
  soorten: {
    functie: { naam: 'Logische functie opstellen', gen() {
      const d = kies(DOMOTICA), j = `${naamTex(d.uit)} = ${sTex(d.b, d.in)}`;
      return { soort: 'functie', opdracht: 'Welke logische functie hoort bij deze situatie?', html: opgave(d.z), sleutel: d.z, rapport: d.z,
        antw: drieUniek(j, mutaties(d.b).map(m => `${naamTex(d.uit)} = ${sTex(m, d.in)}`)), uitleg: [j] };
    } },
    bouw: { naam: 'Domotica: functie en schakeling', gen() {
      const d = kies(DOMOTICA), j = `${naamTex(d.uit)} = ${sTex(d.b, d.in)}`;
      return { soort: 'bouw', opdracht: 'Kies de logische functie en bouw de schakeling.', html: opgave(d.z), sleutel: 'b' + d.z, rapport: d.z,
        antw: delen(['\\text{1. functie:}', drieUniek(j, mutaties(d.b).map(m => `${naamTex(d.uit)} = ${sTex(m, d.in)}`))], ['\\text{2. schakeling}', bouwAntw(d.in, d.uit, d.b, ['NOT', 'AND', 'OR', 'XOR'])]),
        uitleg: [j, `\\text{poorten: } ${tussen(d.b).map(k => `\\text{${k.t}}`).join(', ')}`] };
    } },
    tabel: { naam: 'Waarheidstabel bij een situatie', gen() {
      const d = kies(DOMOTICA), kol = [{ kop: naamTex(d.uit), uit: LG.boomTabel(d.in.length, d.b) }];
      return { soort: 'tabel', opdracht: 'Vul de waarheidstabel in voor deze situatie.', html: opgave(d.z) + `<p class="klein midden">$${naamTex(d.uit)} = ${sTex(d.b, d.in)}$</p>`, sleutel: 't' + d.z, rapport: d.z,
        antw: { soort: 'wt', vars: d.in.map(naamTex), kolommen: kol }, uitleg: [`${naamTex(d.uit)} = ${sTex(d.b, d.in)}`] };
    } },
  },
  oefenMix: [['functie', 1], ['bouw', 2], ['tabel', 1]],
  test: [['functie', 3], ['bouw', 5], ['tabel', 2]], testSchudden: true,
};

const D7 = {
  nr: 7, titel: 'Eindtest logica', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles door elkaar: waarheidstabellen, poorten, schakelingen en domotica.</p></div>`,
  voorbeelden: [],
  soorten: { wt: mix(D1, 'tabel'), hk: mix(D3, 'herken'), uv: mix(D3, 'uitvoer'), ct: mix(D4, 'tabel'), cf: mix(D4, 'functie'), bw: mix(D5, 'bouw'), df: mix(D6, 'functie'), db: mix(D6, 'bouw') },
  oefenMix: [['wt', 1], ['hk', 1], ['uv', 1], ['ct', 1], ['cf', 1], ['bw', 1], ['df', 1], ['db', 1]],
  test: [['wt', 1], ['hk', 1], ['uv', 1], ['ct', 2], ['cf', 1], ['bw', 1], ['df', 1], ['db', 2]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'logica', titel: 'Logica', ondertitel: 'Wiskunde · 4BW-MWW', klas: '4BW-MWW', drempel: 70,
  intro: `<p>Eerst herhaal je proposities en waarheidstabellen. Daarna leer je de logische poorten (NOT, AND, OR, XOR, NAND, NOR, XNOR) met hun IEC-symbolen, combineer je poorten tot schakelingen
    en <b>bouw je zelf schakelingen</b> voor domotica-toepassingen: poorten naar het werkblad slepen, verbinden en uitproberen.
    Lees de theorie, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Herhaling', delen: [1] }, { titel: 'B · Logische poorten', delen: [2, 3] }, { titel: 'C · Schakelingen', delen: [4, 5, 6] }, { titel: 'D · Eindtest', delen: [7] }],
  delen: [D1, D2, D3, D4, D5, D6, D7],
});
