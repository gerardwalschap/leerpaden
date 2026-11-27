// ---------- hoe zeg je "bij x" en "de grootheid" in een situatie?
function xZin(S, x) {
  const t = kg(x);
  return { conc: `${t} uur na inname`, baby: `op dag ${t}`, hart: `na ${t} minuten`, saldo: `${t} maanden na 1 september`, griep: `na ${t} weken`, spoed: `om ${klok(x)}`,
    fontein: `op ${t} m van de spuitmond`, doos: `bij een vierkantje van ${t} cm`, fuif: `bij een ticketprijs van ${t} euro`, bacterie: `${t} uur na het toevoegen`,
    zwembad: `bij ${t} °C`, inwoners: `in ${2000 + x}` }[S.fam];
}
function yWat(S) {
  return { conc: 'de concentratie', baby: 'het gewicht van de baby', hart: 'de hartslag', saldo: 'het saldo', griep: 'het aantal zieke leerlingen', spoed: 'het aantal patiënten in de wachtzaal',
    fontein: 'de hoogte van de straal', doos: 'het volume van de doos', fuif: 'de opbrengst', bacterie: 'het aantal bacteriën (in duizendtallen)', zwembad: 'het aantal bezoekers', inwoners: 'het aantal inwoners' }[S.fam];
}
const tx = (s) => '@@' + s; // gewone tekst in de uitleg (wordt HTML, zodat lange zinnen afbreken)
const naTex = (S) => `\\text{ ${S.ye}}`;

const NAMEN = { begin: 'de beginwaarde (het snijpunt met de verticale as)', nul: 'de nulpunten', max: 'het maximum', min: 'het minimum', dom: 'het domein',
  bereik: 'het bereik', verloop: 'het verloopschema (stijgen en dalen)', teken: 'het tekenschema (positief of negatief)', dal: 'een lokaal minimum', top1: 'een lokaal maximum' };

// ===================================================================
//  0 · WOORDENLIJST: VAN WISKUNDETAAL NAAR CONTEXTTAAL
// ===================================================================
const ALLE = ['conc', 'baby', 'hart', 'saldo', 'griep', 'spoed'];
const sleutels = (S) => Object.keys(S.w).filter(k => S.z[k]);
const D1 = {
  nr: 1, titel: 'Woordenlijst: van wiskundetaal naar contexttaal', kort: 'Wat betekent een kenmerk in een echte situatie?', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Kenmerken in context</div>
      <p>Je kan al heel wat kenmerken van een functie aflezen op een grafiek: het domein, het bereik, de nulpunten, het tekenschema en het verloopschema.
      In een situatie moet je diezelfde kenmerken uitleggen in de <b>taal van die situatie</b>: een geneesmiddel in het bloed, de drukte op een spoeddienst, het gewicht van een baby …</p>
      <p>Een nulpunt is dan niet zomaar "een getal waarvoor $f(x) = 0$", maar bijvoorbeeld "het moment waarop het geneesmiddel volledig uitgewerkt is".</p>${WOORDENLIJST}</div>
    ${LET_OP}
    <div class="kader werk"><div class="kader-titel">Uitgewerkt voorbeeld: een griepgolf</div>
      <p>Op een grote scholencampus breekt een griepgolf uit. Het aantal zieke leerlingen $Z$, $w$ weken na het begin van de griepgolf, is $Z(w) = -w^3 + 12w^2$ met $0 \\leq w \\leq 12$.</p>
      ${figuur(rgraf({ x: [0, 12], y: [0, 300], xs: 1, ys: 50, xn: 'w (weken)', yn: 'zieke leerlingen', functies: [{ f: (w) => -(w ** 3) + 12 * w * w, e: '-(x**3)+12*x**2' }], punten: [{ x: 8, y: 256 }] }))}
      <table class="tabel"><tr><th>Kenmerk</th><th>Wiskundig</th><th>In de context</th></tr>
      <tr><td>Domein</td><td>$\\text{dom } Z = [0 \\,;\\, 12]$</td><td>We volgen de griepgolf gedurende 12 weken.</td></tr>
      <tr><td>Bereik</td><td>$\\text{ber } Z = [0 \\,;\\, 256]$</td><td>Het aantal zieke leerlingen schommelt tussen 0 en 256.</td></tr>
      <tr><td>Beginwaarde</td><td>$Z(0) = 0$</td><td>Bij het begin van de griepgolf is nog niemand ziek.</td></tr>
      <tr><td>Nulpunten</td><td>$0$ en $12$</td><td>Bij de start (week 0) en na 12 weken is niemand ziek: de griepgolf is voorbij.</td></tr>
      <tr><td>Maximum</td><td>$256$ voor $w = 8$</td><td>In week 8 zijn er het meeste zieken: 256 leerlingen.</td></tr>
      <tr><td>Verloop</td><td>stijgend op $[0 \\,;\\, 8]$, dalend op $[8 \\,;\\, 12]$</td><td>De eerste 8 weken neemt het aantal zieken toe, daarna neemt het af.</td></tr></table>
      ${schema('w', 'Z(w)', [{ x: '0', y: '0' }, { y: '+' }, { x: '12', y: '0' }])}
      ${schema('w', 'Z(w)', [{ x: '0', y: '0' }, { y: PIJL_OP }, { x: '8', y: '256 max' }, { y: PIJL_NEER }, { x: '12', y: '0' }])}
      <p><b>Het verhaal van de grafiek.</b> Bij het begin van de griepgolf is nog geen enkele leerling ziek. Daarna breidt de griep zich uit: het aantal zieke leerlingen neemt eerst traag toe, daarna steeds sneller.
      In week 8 bereikt de griepgolf haar hoogtepunt met 256 zieke leerlingen. Vanaf dan neemt het aantal zieken af, en vanaf week 10 zelfs heel snel. Na 12 weken is de griepgolf voorbij en is niemand meer ziek.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Pijnstiller: $C(t) = 0{,}05t^3 - 1{,}2t^2 + 7{,}2t$ met $0 \\leq t \\leq 12$ ($C$ in mg/l, $t$ in uur na inname om 8 u).')}<p>Wiskundig: de nulpunten zijn $0$ en $12$. Wat betekent dat?</p>`,
      stappen: ['\\text{Bij de inname (t = 0) zit er nog geen pijnstiller in het bloed.}', '\\text{Na 12 uur (om 20 u) is de pijnstiller volledig uitgewerkt: de concentratie is weer 0.}'] },
    { html: `${opgave('Baby: $G(d) = 6d^2 - 60d + 3500$ met $0 \\leq d \\leq 14$ ($G$ in gram, $d$ in dagen na de geboorte).')}<p>Wiskundig: minimum $3350$ voor $d = 5$. Wat betekent dat?</p>`,
      stappen: ['\\text{Op dag 5 weegt de baby het minst: 3350 gram.}', '\\text{Let op: 3350 is het gewicht (y-waarde), 5 is de dag (x-waarde).}'] },
  ],
  soorten: {
    betekenis: { naam: 'Wiskundetaal → contexttaal', gen() {
      const S = kiesSit(ALLE), k = kies(sleutels(S)), juist = S.z[k];
      const fout = schud(sleutels(S).filter(x => x !== k).map(x => S.z[x])); if (S.zF[k]) fout.unshift(S.zF[k]);
      return { soort: 'betekenis', opdracht: 'Kies de zin die past bij de situatie.', html: `${sitOpgave(S)}<p>In wiskundetaal staat er: $${S.w[k]}$</p>${vraag('Wat betekent dat in de situatie?')}`, sleutel: S.fam + k + juist,
        rapport: `${S.titel}: ${W.platteTekst(S.w[k])}`, antw: zinnen(juist, fout), uitleg: [`\\text{${NAMEN[k]}: } ${S.w[k]}`, tx(juist)] };
    } },
    kenmerk: { naam: 'Welk kenmerk?', gen() {
      const S = kiesSit(ALLE), k = kies(sleutels(S));
      const fout = schud(Object.keys(NAMEN).filter(x => x !== k && !(['max', 'top1'].includes(k) && ['max', 'top1'].includes(x)) && !(['min', 'dal'].includes(k) && ['min', 'dal'].includes(x)))).map(x => NAMEN[x]);
      return { soort: 'kenmerk', opdracht: 'Kies het kenmerk.', html: `${sitOpgave(S)}<p>Iemand schrijft over deze situatie:</p><p class="midden"><i>"${S.z[k]}"</i></p>${vraag('Over welk kenmerk van de functie gaat deze zin?')}`, sleutel: S.fam + k + S.z[k],
        rapport: `${S.titel}: "${S.z[k]}"`, antw: zinnen(NAMEN[k], fout), uitleg: [`\\text{Het gaat over ${NAMEN[k]}: } ${S.w[k]}`] };
    } },
    naarWiskunde: { naam: 'Contexttaal → wiskundetaal', gen() {
      const S = kiesSit(ALLE), ks = sleutels(S), k = kies(ks);
      const opties = schud([k, ...schud(ks.filter(x => x !== k)).slice(0, 3)]);
      return { soort: 'naarWiskunde', opdracht: 'Kies de wiskundige zin.', html: `${sitOpgave(S)}<p>Iemand schrijft over deze situatie:</p><p class="midden"><i>"${S.z[k]}"</i></p>${vraag('Welke wiskundige zin zegt hetzelfde?')}`, sleutel: S.fam + k + S.z[k],
        rapport: `${S.titel}: "${S.z[k]}"`, antw: { soort: 'keuze', opties: opties.map((x, i) => ({ k: String(i), l: S.w[x] })), juist: String(opties.indexOf(k)) },
        uitleg: [`${S.w[k]} \\quad (\\text{${NAMEN[k]}})`] };
    } },
  },
  oefenMix: [['betekenis', 2], ['kenmerk', 1], ['naarWiskunde', 1]],
  test: [['betekenis', 4], ['kenmerk', 3], ['naarWiskunde', 3]], testSchudden: true,
};

// ===================================================================
//  1 · KENMERKEN AFLEZEN EN INTERPRETEREN IN CONTEXT
// ===================================================================
function vraagWaarde() {
  const S = kiesSit(['conc', 'baby', 'hart', 'saldo', 'griep', 'spoed']), [a, b] = S.dom, d = S.dec;
  let x; do { x = rnd(Math.ceil(a) + (S.fam === 'spoed' ? 0 : 1), Math.floor(b) - 1); } while (d < 2 && W.grensgeval(S.f(x), d));
  const y = S.f(x);
  return { soort: 'waarde', opdracht: 'Tip: typ de waarde bij "Bereken" in het grafiekvenster (of gebruik je rekenmachine).', html: `${sitOpgave(S)}${vraag(`Hoe groot is ${yWat(S)} ${xZin(S, x)}?`)}${sitVenster(S, { t: 'vf' })}`, sleutel: S.e + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: getal(y, { dec: d, voor: `${S.fn}(${tg(x)}) =`, na: naTex(S) }),
    uitleg: [`${S.fn}(${tg(x)}) \\approx ${tg(W.rond(y, d))}${naTex(S)}`, tx(`${zin(xZin(S, x))} is ${yWat(S)} ongeveer ${kg(W.rond(y, d))} ${S.ye}.`)] };
}
function vraagHoeLang() {
  const S = kiesSit(['conc', 'hart', 'griep', 'baby']);
  let c, vr, antw, uitl;
  if (S.fam === 'baby') {
    vr = `Vroedvrouwen zeggen: "Na ongeveer tien dagen zit een baby terug op zijn geboortegewicht." Op welke dag zit deze baby terug op ${S.G0} gram?`;
    antw = getal(S.terug, { voor: 'd =', na: '\\text{ dagen}' });
    uitl = [`\\text{Snijpunt met } y = ${S.G0}: d = 0 \\text{ en } d = ${S.terug}`, tx(`Op dag ${S.terug} weegt de baby opnieuw ${S.G0} gram.`)];
  } else {
    const [a, b] = S.dom, top = S.max.y;
    if (S.fam === 'conc') c = kies([0.5, 0.6, 0.7, 0.75].map(p => r0(p * top)).filter(v => v > 0));
    if (S.fam === 'hart') c = r0((S.H0 + S.Hmax) / 2 + kies([0, 5, 10]));
    if (S.fam === 'griep') c = Math.round(kies([0.5, 0.6, 0.75]) * top / 10) * 10;
    const xs = nulpunten(S.f, a, b, c), duur = xs[1] - xs[0];
    vr = { conc: () => `${zin(S.ding)} werkt pas als de concentratie minstens ${c} mg/l is. Hoe lang werkt ${S.ding}?`, hart: () => `Hoe lang is de hartslag van ${S.naam} hoger dan ${c} slagen per minuut?`,
      griep: () => `Hoeveel weken zijn er meer dan ${c} leerlingen ziek?` }[S.fam]();
    antw = getal(duur, { dec: 1, na: `\\text{ ${S.xe}}` });
    uitl = [`\\text{Snijpunt met } y = ${c}: \\; ${S.x} \\approx ${tg(r2(xs[0]))} \\text{ en } ${S.x} \\approx ${tg(r2(xs[1]))}`, `${tg(r2(xs[1]))} - ${tg(r2(xs[0]))} \\approx ${tg(r1(duur))} \\text{ ${S.xe}}`];
    if (S.fam === 'conc') uitl.push(tx(`${zin(S.ding)} werkt van ongeveer ${klok(S.uur + xs[0])} tot ${klok(S.uur + xs[1])}.`));
  }
  return { soort: 'hoelang', opdracht: 'Tip: typ de waarde bij "Snijpunt" in het grafiekvenster (y = …).', html: `${sitOpgave(S)}${vraag(vr)}${sitVenster(S, { t: 'vs' })}`, sleutel: S.e + c,
    rapport: `${S.titel}: ${W.platteTekst(vr)}`, antw, uitleg: uitl };
}
function vraagMax() {
  const S = kiesSit(['conc', 'hart', 'griep']);
  const vr = { conc: 'Wanneer is de concentratie het hoogst, en hoe hoog is ze dan?', hart: `Wanneer is de hartslag van ${S.naam} het hoogst, en hoeveel bedraagt hij dan?`, griep: 'Wanneer zijn er het meeste zieke leerlingen, en hoeveel?' }[S.fam];
  const d = [[`\\text{Wanneer? } ${S.x} =`, getal(S.max.x, { na: `\\text{ ${S.xe}}` })], [`\\text{Hoeveel? } ${S.fn} =`, getal(S.max.y, { dec: S.dec, na: naTex(S) })]];
  if (S.fam === 'conc') d.push(['\\text{Om hoe laat is dat? Om}', getal(S.uur + S.tm, { na: '\\text{ u}' })]);
  return { soort: 'max', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag(vr)}${sitVenster(S, { t: 'vm' })}`), sleutel: S.e,
    rapport: `${S.titel}: maximum`, antw: delen(...d), uitleg: [`\\text{Hoogste punt: } (${tg(S.max.x)} \\,;\\, ${tg(S.max.y)})`, tx(S.z.max)] };
}
function vraagMinBaby() {
  const S = sitBaby(), verlies = S.G0 - S.q, pct = verlies / S.G0 * 100;
  return { soort: 'min', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag('Op welke dag weegt de baby het minst? Hoeveel gram verliest de baby in totaal? Hoeveel procent van het geboortegewicht is dat?')}${sitVenster(S, { t: 'vfm' })}`), sleutel: S.e,
    rapport: `${S.titel}: minimum en verlies`, antw: delen(['\\text{dag: } d =', getal(S.p)], ['\\text{verlies:}', getal(verlies, { na: '\\text{ gram}' })], ['\\text{in procent:}', getal(pct, { dec: 1, na: '\\,\\%' })]),
    uitleg: [`\\text{Laagste punt: } (${S.p} \\,;\\, ${S.q})`, `${S.G0} - ${S.q} = ${verlies} \\text{ gram}`,
      `\\text{verhoudingstabel: } ${S.G0} \\text{ g} \\to 100\\,\\% \\quad\\Rightarrow\\quad 1 \\text{ g} \\to \\dfrac{100}{${S.G0}}\\,\\% \\quad\\Rightarrow\\quad ${verlies} \\text{ g} \\to \\dfrac{${verlies} \\cdot 100}{${S.G0}} \\approx ${tg(r1(pct))}\\,\\%`] };
}
function vraagRood() {
  const S = sitSaldo();
  const fout = [S.zF.nul, `Op 1 ${MAANDEN[S.q1]} en op 1 ${MAANDEN[S.q2]} heeft de jeugdbeweging het meeste geld.`, `Van 1 ${MAANDEN[S.q1]} tot 1 ${MAANDEN[S.q2]} heeft de jeugdbeweging het meeste geld.`];
  return { soort: 'rood', opdracht: 'Tip: de nulpunten vind je met "Snijpunt" en y = 0.', html: sitOpgave(S, `${vraag('Wat zijn de nulpunten van S? In welke periode staat de rekening in het rood?')}${sitVenster(S, { t: 'vs' })}`), sleutel: S.e,
    rapport: `${S.titel}: nulpunten en tekenschema`, antw: delen(['\\text{eerste nulpunt: } m =', getal(S.q1)], ['\\text{tweede nulpunt: } m =', getal(S.q2)], ['\\text{betekenis:}', zinnen(S.z.teken, [S.zF.teken, ...fout])]),
    uitleg: [`S(${S.q1}) = 0 \\text{ en } S(${S.q2}) = 0`, `\\text{tekenschema: } S(m) < 0 \\text{ op } {]}${S.q1} \\,;\\, ${S.q2}{[}`, tx(S.z.teken)] };
}
function vraagSaldoMax() {
  const S = sitSaldo();
  const vr = kies(['schuld', 'meeste']);
  if (vr === 'schuld') return { soort: 'saldomax', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag('Hoe groot is de grootste schuld (in euro)? Rond af op 0,1.')}${sitVenster(S, { t: 'vm' })}`), sleutel: S.e + vr,
    rapport: `${S.titel}: grootste schuld`, antw: getal(-S.min.y, { dec: 1, na: '\\text{ euro}' }), uitleg: [`\\text{Laagste punt: } (${tg(r1(S.min.x))} \\,;\\, ${tg(r1(S.min.y))})`, tx(`De grootste schuld is ongeveer ${kg(r1(-S.min.y))} euro.`)] };
  const juist = `Op 1 september: dan staat er ${S.S0} euro op de rekening. De top van de grafiek op het einde van het jaar is lager (ongeveer ${kg(r0(Math.max(S.lokMax.y, S.S12)))} euro).`;
  return { soort: 'saldomax', opdracht: 'Let goed op: het absolute maximum kan ook aan de rand van het domein liggen.', html: sitOpgave(S, `${vraag('Wanneer heeft de jeugdbeweging het meeste geld op de rekening tijdens dit werkjaar?')}${sitVenster(S, { t: 'vfm' })}`), sleutel: S.e + vr,
    rapport: `${S.titel}: absoluut maximum`, antw: zinnen(juist, [`Ongeveer ${kg(r1(S.lokMax.x))} maanden na 1 september: daar ligt de top van de grafiek.`, `Op 1 ${MAANDEN[S.q2]}: dan is de schuld afbetaald.`, `Na 12 maanden: dan is het werkjaar voorbij.`]),
    uitleg: [`S(0) = ${S.S0} \\text{ is groter dan het lokaal maximum } \\approx ${tg(r0(S.lokMax.y))}`, tx('Het absolute maximum ligt hier aan de rand van het domein: op 1 september.')] };
}
function vraagSpoed() {
  const S = sitSpoed(), s = kies(['drukst', 'dal']);
  if (s === 'drukst') return { soort: 'spoed', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag('Om hoe laat is het het drukst in de wachtzaal? Hoeveel patiënten zitten er dan?')}${sitVenster(S, { t: 'vm' })}`), sleutel: S.e + s,
    rapport: `${S.titel}: drukste moment`, antw: delen(['\\text{om}', getal(S.t3, { na: '\\text{ u}' })], ['\\text{aantal patiënten:}', getal(S.max.y)]), uitleg: [`\\text{Hoogste punt: } (${S.t3} \\,;\\, ${S.max.y})`, tx(S.z.max)] };
  const minRand = Math.min(S.W6, S.W22), rustiger = minRand < S.dal.y;
  const juist = rustiger ? `Neen: om ${S.W6 < S.W22 ? '6 u' : '22 u'} zitten er minder patiënten (ongeveer ${kg(r0(minRand))}). Om ${S.t2} u is het enkel rustiger dan de uren ervoor en erna.` : `Ja: nergens op de dag zitten er minder patiënten dan om ${S.t2} u.`;
  const fout = rustiger ? [`Ja: een dal van de grafiek is altijd het rustigste moment.`, `Neen: om ${S.t3} u zitten er minder patiënten.`, `Ja: om ${S.t2} u zitten er 0 patiënten.`]
    : [`Neen: om 6 u zitten er minder patiënten.`, `Neen: om ${S.t3} u zitten er minder patiënten.`, `Ja: om ${S.t2} u zitten er 0 patiënten.`];
  return { soort: 'spoed', opdracht: 'Let op: een lokaal minimum is niet altijd de kleinste waarde van de hele dag.', html: sitOpgave(S, `${vraag(`Om ${S.t2} u heeft de grafiek een "dal". Is dat het rustigste moment van de dag?`)}${sitVenster(S, { t: 'vfm' })}`), sleutel: S.e + s,
    rapport: `${S.titel}: lokaal minimum`, antw: zinnen(juist, fout), uitleg: [`W(${S.t2}) = ${S.dal.y}, \\quad W(6) \\approx ${tg(r0(S.W6))}, \\quad W(22) \\approx ${tg(r0(S.W22))}`, tx(juist)] };
}
function vraagGemVerandering() {
  const S = kies([sitBaby, sitHart])();
  let a, b, vr, eenh;
  if (S.fam === 'baby') { a = 10; b = 14; vr = 'Hoeveel gram komt de baby gemiddeld per dag bij tussen dag 10 en dag 14?'; eenh = 'gram per dag'; }
  else { a = kies([0, 2, 4]); b = a + 2; vr = `Hoeveel slagen per minuut stijgt de hartslag gemiddeld per minuut tussen minuut ${a} en minuut ${b}?`; eenh = 'slagen per minuut per minuut'; }
  const g = (S.f(b) - S.f(a)) / (b - a);
  return { soort: 'gemV', opdracht: 'Tip: bereken eerst de twee functiewaarden. Deel het verschil door de lengte van het interval.', html: `${sitOpgave(S)}${vraag(vr)}${sitVenster(S, { t: 'vf' })}`, sleutel: S.e + a,
    rapport: `${S.titel}: gemiddelde verandering [${a}, ${b}]`, antw: getal(g, { dec: 1, na: `\\text{ ${eenh}}` }),
    uitleg: [`${S.fn}(${a}) = ${tg(r2(S.f(a)))}, \\quad ${S.fn}(${b}) = ${tg(r2(S.f(b)))}`, `\\dfrac{${tg(r2(S.f(b)))} - ${tg(r2(S.f(a)))}}{${b} - ${a}} \\approx ${tg(r1(g))}`] };
}
const D2 = {
  nr: 2, titel: 'Kenmerken aflezen en interpreteren', kort: 'Functiewaarden, maximum en minimum, nulpunten en tekenschema in context.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Lees af én interpreteer</div>
      <p>Je bepaalt een kenmerk in het grafiekvenster. Je stopt niet bij het getal: je legt ook uit wat het betekent in de situatie, <b>in een volledige zin, met eenheden</b>.</p>
      <ul><li><b>Functiewaarde</b> $f(a)$: hoe groot is de grootheid bij $x = a$?</li>
      <li><b>Wanneer is $f(x) = c$?</b> Snijd de grafiek met de horizontale rechte $y = c$ (grafiekvenster: <i>Snijpunt</i>). Bij een berg krijg je twee snijpunten: het verschil is hoe lang de grootheid boven $c$ ligt.</li>
      <li><b>Maximum en minimum</b>: grafiekvenster <i>Hoogste en laagste punt</i>. Noteer wanneer (de $x$-waarde) én hoe groot (de $y$-waarde). Het absolute maximum kan aan de rand van het domein liggen!</li>
      <li><b>Nulpunten en tekenschema</b>: waar is de grootheid 0, positief of negatief (bv. de rekening staat in het rood)?</li>
      <li><b>Gemiddelde verandering</b> tussen $a$ en $b$: $\\dfrac{f(b) - f(a)}{b - a}$.</li></ul></div>${GEOGEBRA}
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een pijnstiller in het bloed</div>
      <p>$C(t) = 0{,}05t^3 - 1{,}2t^2 + 7{,}2t$ met $0 \\leq t \\leq 12$ ($C$ in mg/l, $t$ in uur na inname om 8 u).</p>
      ${figuur(rgraf({ x: [0, 12], y: [0, 15], xs: 1, ys: 2, xn: 't (uur)', yn: 'concentratie (mg/l)', functies: [{ f: (t) => 0.05 * t ** 3 - 1.2 * t * t + 7.2 * t, e: '0.05*x**3-1.2*x**2+7.2*x' }], punten: [{ x: 4, y: 12.8 }] }))}
      <ul><li>Nulpunten $0$ en $12$: bij inname en na 12 uur (om 20 u) zit er geen pijnstiller in het bloed.</li>
      <li>Maximum $(4 \\,;\\, 12{,}8)$: na 4 uur, om 12 u, is de concentratie het hoogst: 12,8 mg/l.</li>
      <li>Verloopschema: $C$ stijgt op $[0 \\,;\\, 4]$ en daalt op $[4 \\,;\\, 12]$.</li>
      <li>$C(t) \\geq 10$ tussen $t \\approx 2{,}16$ en $t \\approx 6{,}24$: de pijnstiller werkt ongeveer 4,1 uur.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: het budget van de jeugdbeweging</div>
      <p>$S(m) = -5m^3 + 120m^2 - 780m + 1120$ met $0 \\leq m \\leq 12$ ($S$ in euro, $m$ in maanden na 1 september).</p>
      <p>Nulpunten $2$ en $8$: de rekening staat in het rood van 1 november tot 1 mei (tekenschema: $-$ tussen 2 en 8).
      <b>Let goed op:</b> het meeste geld staat er op 1 september (1120 euro), niet op de top op het einde van het jaar. Het absolute maximum ligt hier aan de rand van het domein.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Hartslag: $H(t) = -0{,}8t^2 + 16t + 70$ met $0 \\leq t \\leq 20$ ($H$ in slagen per minuut).')}<p>Wanneer is de hartslag het hoogst en hoeveel bedraagt die dan?</p>`,
      stappen: ['\\text{Hoogste punt: } (10 \\,;\\, 150)', '\\text{Na 10 minuten is de hartslag het hoogst: 150 slagen per minuut.}'] },
    { html: `${opgave('Baby: $G(d) = 6d^2 - 60d + 3500$ met $0 \\leq d \\leq 14$.')}<p>Hoeveel gram komt de baby gemiddeld per dag bij tussen dag 10 en dag 14?</p>`,
      stappen: ['G(10) = 3500, \\quad G(14) = 3836', '\\dfrac{3836 - 3500}{14 - 10} = 84 \\text{ gram per dag}'] },
  ],
  soorten: {
    waarde: { naam: 'Functiewaarde in context', gen: vraagWaarde },
    hoelang: { naam: 'Hoe lang? / Wanneer opnieuw?', gen: vraagHoeLang },
    max: { naam: 'Maximum in context', gen: vraagMax },
    min: { naam: 'Minimum: het gewicht van de baby', gen: vraagMinBaby },
    rood: { naam: 'Nulpunten en tekenschema: in het rood', gen: vraagRood },
    saldomax: { naam: 'Grootste schuld en meeste geld', gen: vraagSaldoMax },
    spoed: { naam: 'Toppen en dalen: de spoeddienst', gen: vraagSpoed },
    gemV: { naam: 'Gemiddelde verandering', gen: vraagGemVerandering },
  },
  oefenMix: [['waarde', 2], ['hoelang', 1], ['max', 1], ['min', 1], ['rood', 1], ['saldomax', 1], ['spoed', 1], ['gemV', 1]],
  test: [['waarde', 2], ['hoelang', 1], ['max', 1], ['min', 1], ['rood', 1], ['saldomax', 1], ['spoed', 2], ['gemV', 1]], testSchudden: true,
};

// ===================================================================
//  2 · WISKUNDIG DOMEIN EN PRAKTISCH DOMEIN
// ===================================================================
const PRAKT = ['fontein', 'doos', 'fuif', 'bacterie', 'zwembad'];
const venW = (S, t) => sitVenster(S, { t, buiten: true }); // venster met de hele grafiek (praktisch domein in blauw)
function vraagWiskDom() {
  const S = kiesSit(PRAKT);
  return { soort: 'wiskdom', opdracht: 'Kies het juiste antwoord.', html: sitKort(S, vraag('Wat is het wiskundig domein? Dat zijn alle getallen die je in de formule kan invullen, ook getallen die in de situatie geen zin hebben.')), sleutel: S.e,
    rapport: `${S.titel}: wiskundig domein`, antw: zinnen('ℝ: in een veeltermfunctie kan je elk reëel getal invullen.', [`$${ivTex(S.dom[0], r2(S.dom[1]))}$: dat is het praktisch domein.`, '$\\mathbb{R}^+$: negatieve getallen kan je niet invullen.', `$\\mathbb{R} \\setminus \\{0\\}$: je mag niet delen door nul.`].map(z => z.replace(/\$([^$]+)\$/g, (m, t) => M(t)))),
    uitleg: ['\\text{dom } ' + S.fn + ' = \\mathbb{R}', tx('Het wiskundig domein van een veeltermfunctie is altijd ℝ. In de situatie hebben lang niet al die waarden zin: daarvoor dient het praktisch domein.')] };
}
function vraagPraktDom() {
  const S = kiesSit(PRAKT), [a, b] = S.dom, B = r2(b);
  const r = (s) => s.replace(/\$([^$]+)\$/g, (m, t) => M(t));
  let juist, fout, uit;
  if (S.fam === 'fontein') { juist = `$${ivTex(0, S.L)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(0, S.H)}$`, `$${ivTex(0, S.L / 2)}$`]; uit = `De straal begint aan de spuitmond (x = 0) en komt ${S.L} m verder neer: daar is h(x) = 0. Daarbuiten zou de hoogte negatief zijn.`; }
  if (S.fam === 'doos') { juist = `$${ivTex(0, S.B / 2, false, false)}$`; fout = [`$${ivTex(0, S.A / 2)}$`, `$${ivTex(0, S.B / 2)}$`, `$${ivTex(0, S.B, false, false)}$`]; uit = `Het vierkantje moet groter zijn dan 0 (anders zijn er geen randen) en kleiner dan ${kg(S.B / 2)} cm (de helft van de breedte ${S.B} cm). In 0 en ${kg(S.B / 2)} is het volume 0: geen doos, dus de randen horen er niet bij.`; }
  if (S.fam === 'fuif') { juist = `$${ivTex(0, S.pnul)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(0, S.pmax)}$`, `$${ivTex(0, S.N)}$`]; uit = `De prijs is niet negatief, en bij ${kg(S.pnul)} euro worden er ${S.N} − ${S.k} · ${kg(S.pnul)} = 0 tickets verkocht. Een hogere prijs geeft een negatief aantal tickets.`; }
  if (S.fam === 'bacterie') { juist = `$${ivTex(0, B)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(0, I, true, false)}$`, `$${ivTex(-3, B)}$`]; uit = `We starten bij het toevoegen van het antibioticum (t = 0) en stoppen als er geen bacteriën meer zijn: B(t) = 0 voor t ≈ ${kg(B)}.`; }
  if (S.fam === 'zwembad') { juist = `$${ivTex(S.q1, S.q2)}$`; fout = ['$\\mathbb{R}$', `$${ivTex(0, S.q2)}$`, `$${ivTex(0, I, true, false)}$`]; uit = `Volgens het model komen er enkel bezoekers als Z(T) ≥ 0: tussen ${S.q1} °C en ${S.q2} °C. (In België is een kleiner interval, bv. [15 ; 35], realistischer.)`; }
  return { soort: 'praktdom', opdracht: 'Kies het praktisch domein.', html: sitKort(S, `${vraag(`Welke waarden van $${S.x}$ zijn mogelijk in de situatie? Kies het praktisch domein.`)}${venW(S, 'vfs')}`), sleutel: S.e,
    rapport: `${S.titel}: praktisch domein`, antw: zinnen(r(juist), fout.map(r), { lijst: false }), uitleg: [tx(uit)] };
}
function vraagBereikPrakt() {
  const S = kiesSit(['fontein', 'fuif', 'zwembad']);
  const top = S.max.y, st = [{ a: 0, ai: true, b: top, bi: true }];
  return { soort: 'bereik', opdracht: 'Tip: zoek de kleinste en de grootste waarde (knop "Hoogste en laagste punt").', html: sitOpgave(S, `${vraag(`Welke waarden kan ${yWat(S)} hebben op het praktisch domein? Geef het bereik.`)}${venW(S, 'vfm')}`), sleutel: S.e + 'b',
    rapport: `${S.titel}: bereik`, antw: vz(st, `\\text{ber } ${S.fn} =`), uitleg: [`\\text{kleinste waarde } 0 \\text{ (aan de randen), grootste waarde } ${tg(top)} \\text{ (de top)}`, `\\text{ber } ${S.fn} = ${ivTex(0, top)}`] };
}
function vraagMaxPrakt() {
  const S = kiesSit(['doos', 'bacterie', 'fuif']);
  const d = S.dec, vr = { doos: 'Bij welke x is het volume maximaal? Hoe groot is dat volume?', bacterie: 'Wanneer zijn er het meeste bacteriën? Hoeveel (in duizendtallen) zijn het er dan?', fuif: 'Bij welke ticketprijs is de opbrengst maximaal? Hoeveel bedraagt ze?' }[S.fam];
  const delenL = [[`${S.x} =`, getal(S.max.x, { dec: S.fam === 'fuif' ? 2 : d, na: `\\text{ ${S.xe}}` })], [`${S.fn} =`, getal(S.max.y, { dec: d, na: naTex(S) })]];
  if (S.fam === 'fuif') delenL.push(['\\text{aantal verkochte tickets:}', getal(S.N - S.k * S.pmax)]);
  const extra = S.fam === 'bacterie' ? [tx(`${kg(r2(S.max.x))} uur is ongeveer ${Math.floor(S.max.x)} uur en ${Math.round((S.max.x % 1) * 60)} minuten.`)] : [];
  return { soort: 'maxprakt', opdracht: 'Tip: klik in het grafiekvenster op "Hoogste en laagste punt".', html: sitOpgave(S, `${vraag(vr)}${venW(S, 'vfm')}`), sleutel: S.e + 'm',
    rapport: `${S.titel}: maximum`, antw: delen(...delenL), uitleg: [`\\text{Hoogste punt: } (${tg(W.rond(S.max.x, 2))} \\,;\\, ${tg(W.rond(S.max.y, d))})`, tx(S.z.max), ...extra] };
}
function vraagGrens() {
  const S = kiesSit(['fontein', 'fuif']);
  let c, vr;
  if (S.fam === 'fontein') { c = kies([0.4, 0.5, 0.6, 0.75]).toFixed(2) * S.H; c = r1(c); vr = `Een bewoner van ${kg(c)} m groot wil onder de straal door wandelen zonder nat te worden. Tussen welke afstanden van de spuitmond kan dat?`; }
  else { c = Math.round(kies([0.5, 0.6, 0.75]) * S.Rmax / 100) * 100; vr = `De leerlingenraad wil minstens ${c} euro opbrengen. Welke ticketprijzen zijn mogelijk?`; }
  const xs = nulpunten(S.f, S.dom[0], S.dom[1], c);
  return { soort: 'grens', opdracht: 'Tip: typ de waarde bij "Snijpunt" in het grafiekvenster (y = …). Rond af op 0,01.', html: sitOpgave(S, `${vraag(vr)}${venW(S, 'vs')}`), sleutel: S.e + c, rapport: `${S.titel}: ${vr}`,
    antw: delen([`\\text{van } ${S.x} =`, getal(xs[0], { dec: 2, na: `\\text{ ${S.xe}}` })], [`\\text{tot } ${S.x} =`, getal(xs[1], { dec: 2, na: `\\text{ ${S.xe}}` })]),
    uitleg: [`\\text{Snijpunt met } y = ${tg(c)}: \\; ${S.x} \\approx ${tg(r2(xs[0]))} \\text{ en } ${S.x} \\approx ${tg(r2(xs[1]))}`, tx(S.fam === 'fontein' ? 'Tussen die twee afstanden is de straal hoger dan de bewoner.' : 'Tussen die twee prijzen is de opbrengst minstens zo groot.')] };
}
function vraagZinloos() {
  const S = kiesSit(['doos', 'fuif', 'bacterie']);
  let x, juist, fout;
  if (S.fam === 'doos') { x = S.B / 2 + kies([1, 2, 3]); juist = `Bij een vierkantje van ${kg(x)} cm is het karton te smal: ${S.B} − 2 · ${kg(x)} is negatief. Er is dan geen doos, ook al is de uitkomst positief.`;
    fout = ['Dat is het grootste volume.', 'Dat kan: dan is de doos heel hoog.', 'Dat is een nulpunt van V.']; }
  else if (S.fam === 'fuif') { x = S.pnul + kies([2, 5, 10]); juist = `Bij een prijs van ${kg(x)} euro zou het aantal tickets negatief zijn. Dat kan niet: de prijs ligt buiten het praktisch domein.`;
    fout = ['De leerlingenraad moet dan geld bijbetalen.', 'Dat is het maximum van de opbrengst.', 'Er komen dan heel veel leerlingen.']; }
  else { x = -kies([1, 2, 3]); juist = `${-x} uur vóór het toevoegen gold het model nog niet: het antibioticum zat er toen nog niet in. Het model beschrijft enkel wat er na het toevoegen gebeurt.`;
    fout = [`${-x} uur vóór het toevoegen waren er precies zoveel bacteriën.`, 'Het model klopt ook voor negatieve tijden.', 'Dat is het maximum van het aantal bacteriën.']; }
  const y = S.f(x), d = S.dec;
  return { soort: 'zinloos', opdracht: 'Tip: bereken de waarde met "Bereken" in het grafiekvenster.', html: sitKort(S, `${vraag(`Bereken $${S.fn}(${tg(x)})$. Wat besluit je?`)}${venW(S, 'vf')}`), sleutel: S.e + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: delen([`${S.fn}(${tg(x)}) =`, getal(y, { dec: d })], ['\\text{Wat besluit je?}', zinnen(juist, fout)]), uitleg: [`${S.fn}(${tg(x)}) \\approx ${tg(W.rond(y, d))}`, tx(juist)] };
}
const D3 = {
  nr: 3, titel: 'Wiskundig domein en praktisch domein', kort: 'Voor welke waarden is het model zinvol? Bereik en maximum op het praktisch domein.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Wiskundig domein en praktisch domein</div>
      <p>Het <b>wiskundig domein</b> van een veeltermfunctie is altijd $\\mathbb{R}$: je kan elk reëel getal invullen in het voorschrift.</p>
      <p>In een situatie hebben niet alle waarden zin. Een tijd, een lengte of een prijs is bijvoorbeeld meestal niet negatief, en een aantal kan niet negatief worden.
      Het <b>praktisch domein</b> is het deel van het domein waarvoor het model zinvol is. Het bereik bepaal je dan op het praktisch domein.</p></div>
    <div class="kader eig"><div class="kader-titel">Stappenplan</div>
      <ol><li>Bekijk de grafiek in het grafiekvenster.</li><li>Vraag je af: welke waarden kan de onafhankelijke veranderlijke ($x$, $t$, $p$ …) in werkelijkheid aannemen?</li>
      <li>Vraag je af: waar geeft het model onmogelijke uitkomsten (negatieve aantallen, een negatieve hoogte …)?</li>
      <li>Noteer het praktisch domein als interval en verklaar de grenzen.</li><li>Bepaal het bereik op dat praktisch domein.</li></ol></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een fontein</div>
      <p>$h(x) = -0{,}25x^2 + 2x$ ($h$ = hoogte van de straal in m, $x$ = afstand tot de spuitmond in m).</p>
      ${figuur(rgraf({ x: [-2, 10], y: [-2, 5], xs: 1, ys: 1, xn: 'x (m)', yn: 'hoogte (m)', functies: [{ f: (x) => -0.25 * x * x + 2 * x, e: '-0.25*x**2+2*x', van: 0, tot: 8 }], buiten: true, punten: [{ x: 4, y: 4 }] }))}
      <ul><li>Wiskundig domein: $\\mathbb{R}$.</li><li>Praktisch domein: $[0 \\,;\\, 8]$: de straal start aan de spuitmond en komt 8 m verder neer ($h(8) = 0$). Daarbuiten zou de hoogte negatief zijn.</li>
      <li>Maximum $(4 \\,;\\, 4)$: 4 m van de spuitmond is de straal het hoogst, 4 m. Bereik op het praktisch domein: $[0 \\,;\\, 4]$.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: een doos uit karton</div>
      <p>Karton van 30 cm op 20 cm, in elke hoek een vierkantje met zijde $x$ wegknippen: $V(x) = x(30 - 2x)(20 - 2x)$.</p>
      <p>Lengte $30 - 2x$, breedte $20 - 2x$, hoogte $x$. Praktisch domein ${M('{]}0 \\,;\\, 10{[}')}$: de randen horen er niet bij (bij $x = 0$ en $x = 10$ is er geen doos).
      Het volume is maximaal bij $x \\approx 3{,}9$ cm: ongeveer $1056{,}3$ cm³. Volgens de formule is $V(16)$ positief, maar bij $x = 16$ is het karton te smal: die waarde heeft geen betekenis.</p></div>
    <div class="kader"><div class="kader-titel">Zo vul je in</div><p>Een interval: <code>[0 ; 4]</code> of <code>]0 ; 10[</code>.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Benefietfuif: bij een prijs van $p$ euro worden er $400 - 20p$ tickets verkocht. Opbrengst $R(p) = p(400 - 20p)$.')}<p>Bepaal het praktisch domein en de maximale opbrengst.</p>`,
      stappen: ['400 - 20p = 0 \\Leftrightarrow p = 20: \\text{ bij 20 euro koopt niemand een ticket}', '\\text{praktisch domein } [0 \\,;\\, 20]', '\\text{Hoogste punt } (10 \\,;\\, 2000): \\text{ bij 10 euro is de opbrengst maximaal, 2000 euro (200 tickets).}'] },
  ],
  soorten: {
    wiskdom: { naam: 'Wiskundig domein', gen: vraagWiskDom },
    praktdom: { naam: 'Praktisch domein kiezen', gen: vraagPraktDom },
    bereik: { naam: 'Bereik op het praktisch domein', gen: vraagBereikPrakt },
    maxprakt: { naam: 'Maximum op het praktisch domein', gen: vraagMaxPrakt },
    grens: { naam: 'Tussen welke waarden?', gen: vraagGrens },
    zinloos: { naam: 'Een waarde zonder betekenis', gen: vraagZinloos },
  },
  oefenMix: [['wiskdom', 1], ['praktdom', 2], ['bereik', 1], ['maxprakt', 1], ['grens', 1], ['zinloos', 1]],
  test: [['wiskdom', 1], ['praktdom', 3], ['bereik', 1], ['maxprakt', 2], ['grens', 2], ['zinloos', 1]], testSchudden: true,
};

// ===================================================================
//  3 · KRITISCH KIJKEN NAAR EEN MODEL
// ===================================================================
function vraagExtrapoleer() {
  const k = kies(['baby', 'inwoners', 'conc']);
  let S, x, vr, juist, fout, info = '', Xv, Yv;
  if (k === 'baby') {
    S = sitBaby(); x = 60; vr = 'Hoeveel zou de baby volgens het model wegen na twee maanden (60 dagen)?'; info = 'Een baby van twee maanden weegt in werkelijkheid ongeveer 5 kg (5000 gram).';
    juist = 'Het model klopt enkel de eerste twee weken. Daarna groeit een baby veel trager dan het model voorspelt.'; fout = ['Het model klopt: de baby weegt na twee maanden zoveel.', 'Het model klopt, want een tweedegraadsfunctie stijgt altijd.', 'Het model is fout, want de baby verliest gewicht.'];
    Xv = [0, 65]; Yv = [0, top(S.f(60) * 1.1)];
  } else if (k === 'inwoners') {
    S = sitInwoners(); x = kies([50, -30]); vr = `Hoeveel inwoners heeft de gemeente volgens het model in ${2000 + x}?`; info = 'Het model werd gemaakt met de gegevens van 2000 tot 2025.';
    juist = `${2000 + x} ligt ver buiten de periode van de gegevens: dat is extrapoleren. De uitkomst is niet betrouwbaar.`; fout = [`Het model past goed bij de gegevens, dus de voorspelling voor ${2000 + x} klopt zeker.`, 'Dat is interpoleren: de uitkomst is betrouwbaar.', 'Het model is altijd fout.'];
    Xv = [-35, 55]; Yv = [0, top(Math.max(S.f(50), S.f(-30)) * 1.1)];
  } else {
    S = sitConc(); x = S.T + kies([2, 3, 4]); vr = `Hoe groot is de concentratie volgens het model ${x} uur na de inname?`;
    juist = `Volgens het model stijgt de concentratie weer na ${S.T} uur, zonder nieuwe dosis. Dat kan niet: het model klopt enkel tot ${S.ding} uitgewerkt is.`; fout = ['Het model klopt: de concentratie stijgt na een tijd weer vanzelf.', `Na ${x} uur is de concentratie negatief.`, `${zin(S.ding)} werkt na ${x} uur het best.`];
    Xv = [0, S.T + 5]; Yv = [0, top(Math.max(S.Mx, S.f(S.T + 5)) * 1.15)];
  }
  const y = S.f(x), d = S.dec;
  return { soort: 'extra', opdracht: 'Tip: bereken de waarde met "Bereken" in het grafiekvenster. Denk dan na: kan dat echt?', html: `${sitOpgave(S)}${info ? p_(info) : ''}${vraag(vr)}${sitVenster(S, { t: 'f', X: Xv, Y: Yv, buiten: true })}`, sleutel: S.e + x,
    rapport: `${S.titel}: ${S.fn}(${kg(x)})`, antw: delen([`${S.fn}(${tg(x)}) =`, getal(y, { dec: d, na: naTex(S) })], ['\\text{Wat besluit je?}', zinnen(juist, fout)]),
    uitleg: [`${S.fn}(${tg(x)}) \\approx ${tg(W.rond(y, d))}`, tx(juist)] };
}
function vraagInterExtra() {
  const t0 = 0, t1 = kies([8, 9, 10, 12]), t = kies([rnd(1, t1 - 1), rnd(1, t1 - 1), t1 + kies([5, 10, 20, 50])]), inter = t < t1;
  const wat = kies([{ w: 'het gewicht van een baby', e: 'dagen' }, { w: 'de concentratie van een geneesmiddel', e: 'uur' }, { w: 'het aantal 65-plussers in een gemeente', e: 'jaar' }]);
  const juist = inter ? `Interpoleren: ${t} ${wat.e} ligt binnen het gebied van de metingen.` : `Extrapoleren: ${t} ${wat.e} ligt buiten het gebied van de metingen. Opgelet: dat is gevaarlijk!`;
  const fout = inter ? [`Extrapoleren: ${t} ${wat.e} ligt buiten het gebied van de metingen.`, 'Extrapoleren: elke voorspelling met een model is extrapoleren.', 'Interpoleren: elke voorspelling met een model is interpoleren.']
    : [`Interpoleren: ${t} ${wat.e} ligt binnen het gebied van de metingen.`, 'Interpoleren: het model is een veeltermfunctie, dus het is altijd betrouwbaar.', 'Extrapoleren: elke voorspelling met een model is extrapoleren.'];
  return { soort: 'interextra', opdracht: 'Kies het juiste antwoord.', html: opgave(`Men meet ${wat.w} van ${t0} tot ${t1} ${wat.e}. Met die metingen maakt men een model. Met het model voorspelt men ${wat.w} na ${t} ${wat.e}.`) + vraag('Is dat interpoleren of extrapoleren?'),
    sleutel: `${wat.w}${t1}${t}`, rapport: `metingen ${t0}–${t1}, voorspelling ${t}`, antw: zinnen(juist, fout), uitleg: ['\\text{Binnen de metingen: interpoleren. Erbuiten: extrapoleren.}'] };
}
const MA = (j) => 0.02 * j * j + 0.3 * j + 5, MB = (j) => -0.004 * j ** 3 + 0.08 * j * j + 0.1 * j + 5;
const METINGEN = [[0, 5], [1, 5.4], [2, 5.6], [3, 6.1], [4, 6.4], [5, 7], [6, 7.6], [7, 8.2], [8, 8.7], [9, 9.4], [10, 10]];
const TWEE_MODELLEN = `<p>In een gemeente telde men het aantal 65-plussers (in duizendtallen), $j$ jaren na 2015:</p>
  <table class="tabel"><tr><th>$j$</th>${METINGEN.map(m => `<td>${m[0]}</td>`).join('')}</tr><tr><th>aantal (×1000)</th>${METINGEN.map(m => `<td>${kg(m[1], 1, true)}</td>`).join('')}</tr></table>
  <p>Twee leerlingen stellen elk een model voor: &nbsp; $A(j) = 0{,}02j^2 + 0{,}3j + 5$ &nbsp; en &nbsp; $B(j) = -0{,}004j^3 + 0{,}08j^2 + 0{,}1j + 5$.</p>`;
const TWEE_VENSTER = () => venster({ fs: [{ e: '0.02*x*x+0.3*x+5', n: 'A' }, { e: '-0.004*x**3+0.08*x*x+0.1*x+5', n: 'B', k: GROEN }], X: [0, 25], Y: [0, 25], a: 0, b: 25, xv: 'j', xe: 'jaar na 2015', ye: 'duizend 65-plussers',
  xn: 'j (jaren na 2015)', yn: '65-plussers (× 1000)', t: 'vfm', pts: METINGEN.map(([x, y]) => ({ x, y })), buiten: false, geenDomein: true });
function vraagTweeModellen() {
  const s = kies(['waarde', 'waarde', 'daal', 'welk']);
  if (s === 'waarde') {
    const jaar = kies([2030, 2035]), j = jaar - 2015, m = kies(['A', 'B']), y = (m === 'A' ? MA : MB)(j);
    return { soort: 'twee', opdracht: `Tip: kies grafiek ${m} in het grafiekvenster en gebruik "Bereken".`, html: `${TWEE_MODELLEN}${vraag(`Hoeveel 65-plussers (in duizendtallen) voorspelt model ${m} voor ${jaar}?`)}${TWEE_VENSTER()}`, sleutel: m + j, rapport: `twee modellen: ${m}(${j})`,
      antw: getal(y, { dec: 2, voor: `${m}(${j}) =`, na: '\\text{ duizend}' }), uitleg: [`${jaar} - 2015 = ${j}`, `${m}(${j}) \\approx ${tg(r2(y))}`] };
  }
  if (s === 'daal') return { soort: 'twee', opdracht: 'Tip: kies grafiek B in het grafiekvenster en zoek het hoogste punt.', html: `${TWEE_MODELLEN}${vraag('Volgens model B daalt het aantal 65-plussers na een tijd. In welk jaar begint die daling?')}${TWEE_VENSTER()}`, sleutel: 'daal',
    rapport: 'twee modellen: top van B', antw: getal(2029, { voor: '\\text{in}' }), uitleg: ['\\text{Hoogste punt van B: } j \\approx 13{,}93', '2015 + 13{,}93 \\approx 2029', tx('Dat is niet logisch: de bevolking in België vergrijst, het aantal 65-plussers blijft stijgen.')] };
  return { soort: 'twee', opdracht: 'Kies het juiste antwoord.', html: TWEE_MODELLEN + vraag('Wat leer je uit deze twee modellen?') + TWEE_VENSTER(), sleutel: 'welk', rapport: 'twee modellen: wat leer je?',
    antw: zinnen('Beide modellen passen goed bij de metingen, maar daarbuiten geven ze heel verschillende voorspellingen. Extrapoleren is gevaarlijk.',
      ['Model B is het beste, want het heeft een derde graad.', 'Beide modellen geven dezelfde voorspelling voor 2035.', 'Een model dat goed past bij de metingen, voorspelt de toekomst altijd juist.']),
    uitleg: ['\\text{Binnen de metingen (2015–2025) passen beide modellen goed.}', '\\text{In 2035: } A(20) = 19 \\text{ duizend, } B(20) = 7 \\text{ duizend.}'] };
}
const D4 = {
  nr: 4, titel: 'Kritisch kijken naar een model', kort: 'Waar "breekt" het model? Interpoleren en extrapoleren.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Een model is een vereenvoudiging</div>
      <p>Een functie die een situatie beschrijft, noemen we een <b>model</b>. Een model is nooit perfect: het is een vereenvoudiging van de werkelijkheid.</p>
      <p>De grafiek van een veeltermfunctie loopt altijd verder, naar links en naar rechts. De werkelijkheid doet dat niet. Daarom stel je je bij elk model drie vragen:</p>
      <ol><li>Voor welke waarden geeft het model zinvolle resultaten?</li><li>Waar "breekt" het model: waar geeft het onmogelijke of onrealistische uitkomsten?</li><li>Wat zou er in werkelijkheid gebeuren?</li></ol>
      <p>Een voorspelling <b>binnen</b> het gebied van de gemeten gegevens heet <b>interpoleren</b>. Een voorspelling <b>erbuiten</b> heet <b>extrapoleren</b>. Extrapoleren is gevaarlijk!</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: de baby wordt groter</div>
      <p>$G(d) = 6d^2 - 60d + 3500$: $G(60) = 21\\,500$ gram, dus ongeveer 21,5 kg na twee maanden! Een baby van twee maanden weegt in werkelijkheid ongeveer 5 kg.
      Het model "breekt" na de eerste twee weken: in werkelijkheid groeit een baby daarna veel trager. Je kan het model enkel vertrouwen op $[0 \\,;\\, 14]$.</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld: twee modellen, één werkelijkheid</div>${TWEE_MODELLEN}
      ${figuur(rgraf({ x: [0, 25], y: [0, 25], xs: 5, ys: 5, xn: 'j (jaren na 2015)', yn: '65-plussers (× 1000)', functies: [{ f: MA }, { f: MB, kleur: GROEN }], punten: METINGEN.map(([x, y]) => ({ x, y })) }))}
      <p class="klein midden">blauw: model A · groen: model B · bolletjes: metingen</p>
      <p>Tussen 2015 en 2025 passen beide modellen goed. Maar voor 2035 voorspelt A ongeveer 19 000 en B ongeveer 7 000 65-plussers! Volgens model B daalt het aantal vanaf 2029, terwijl de bevolking vergrijst.
      Twee modellen die goed passen bij de metingen, kunnen daarbuiten totaal verschillende voorspellingen geven.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: `${opgave('Inwoners: $P(j) = 8j^2 - 160j + 12\\,000$, met $j$ het aantal jaren na 2000 (gegevens van 2000 tot 2025).')}<p>Bereken $P(-30)$ (het jaar 1970). In werkelijkheid waren er toen 9500 inwoners. Wat besluit je?</p>`,
      stappen: ['P(-30) = 7200 + 4800 + 12\\,000 = 24\\,000', '\\text{Dat klopt helemaal niet met 9500: 1970 ligt ver buiten de gegevens (extrapoleren).}'] },
  ],
  soorten: {
    extra: { naam: 'Ver buiten de metingen', gen: vraagExtrapoleer },
    interextra: { naam: 'Interpoleren of extrapoleren?', gen: vraagInterExtra },
    twee: { naam: 'Twee modellen vergelijken', gen: vraagTweeModellen },
  },
  oefenMix: [['extra', 2], ['interextra', 1], ['twee', 2]],
  test: [['extra', 4], ['interextra', 2], ['twee', 4]], testSchudden: true,
};

// ===================================================================
//  4 · KOPPEL DE GRAFIEK AAN DE SITUATIE
// ===================================================================
// kleine "situaties" zonder model van de werkbundel: een gsm die leegloopt en een constante temperatuur
const sitGsm = () => ({ fam: 'gsm', titel: 'Batterij van een gsm', f: (t) => 100 - 12.5 * t, e: '100-12.5*x', dom: [0, 8], graf: { x: [0, 8], y: [0, 110] }, tex: 'B(t) = 100 - 12{,}5t' });
const sitTemp37 = () => ({ fam: 'temp37', titel: 'Lichaamstemperatuur', f: () => 37, e: '37+0*x', dom: [0, 24], graf: { x: [0, 24], y: [0, 40] }, tex: 'T(t) = 37' });
const VORM = (S) => ({ conc: 'berg0', griep: 'berg0', baby: 'dal', hart: 'berg', saldo: 'golf', spoed: 'twee', fontein: 'berg0', gsm: 'lin', temp37: 'const' }[S.fam]);
function korteSit(S) {
  return { conc: 'De concentratie van een geneesmiddel in het bloed (in mg/l) tijdens de eerste uren na inname.', griep: 'Het aantal zieke leerlingen tijdens een griepgolf.',
    baby: 'Het gewicht van een baby (in gram) tijdens de eerste twee weken na de geboorte.', hart: 'De hartslag tijdens een looptest: eerst steeds sneller lopen, daarna steeds trager.',
    saldo: 'Het saldo van een jeugdbeweging, dat een tijd in het rood staat.', spoed: 'Het aantal patiënten in de wachtzaal van een spoeddienst tussen 6 u en 22 u.',
    fontein: 'De hoogte (in meter) van een waterstraal, van de spuitmond tot hij neerkomt.', gsm: 'Het batterijpercentage van een gsm die volledig opgeladen is en in 8 uur gelijkmatig leegloopt.',
    temp37: 'De lichaamstemperatuur van een gezonde persoon, die de hele dag 37 °C blijft.' }[S.fam];
}
const KOPPEL = { conc: sitConc, baby: sitBaby, hart: sitHart, saldo: sitSaldo, spoed: sitSpoed, griep: sitGriep, fontein: sitFontein, gsm: sitGsm, temp37: sitTemp37 };
function andereSits(S, n) {
  const uit = [], vormen = new Set([VORM(S)]);
  for (const fam of schud(Object.keys(KOPPEL))) { if (uit.length >= n) break; const T = KOPPEL[fam](); if (vormen.has(VORM(T))) continue; vormen.add(VORM(T)); uit.push(T); }
  return uit;
}
const kaal = (S, klein) => rgraf({ x: S.graf.x, y: S.graf.y, functies: [{ f: S.f, e: S.e, van: S.dom[0], tot: S.dom[1] }], klein, breed: klein ? 260 : 360, hoog: klein ? 160 : 230 });
const kiesKoppel = () => KOPPEL[kies(['conc', 'baby', 'hart', 'saldo', 'spoed', 'griep', 'fontein'])]();
function vraagGrafNaarSit() {
  const S = kiesKoppel(), A = andereSits(S, 3);
  return { soort: 'grafsit', opdracht: 'Kijk naar de vorm en de getallen van de grafiek.', html: figuur(kaal(S)) + vraag('Welke situatie past bij deze grafiek?'), sleutel: S.e,
    rapport: `grafiek → situatie (${S.titel})`, antw: zinnen(korteSit(S), A.map(korteSit)), uitleg: [tx(korteSit(S)), `\\text{Model: } ${S.tex}`] };
}
function vraagSitNaarGraf() {
  const S = kiesKoppel(), A = andereSits(S, 3);
  return { soort: 'sitgraf', opdracht: 'Kijk naar de beginwaarde, stijgen of dalen, toppen en dalen, en nulpunten.', html: opgave(korteSit(S)) + vraag('Welke grafiek past bij deze situatie?'), sleutel: S.e,
    rapport: `situatie → grafiek (${S.titel})`, antw: figuren(kaal(S, true), A.map(T => kaal(T, true))), uitleg: [tx('Kijk naar de beginwaarde, stijgen of dalen, toppen en dalen, en nulpunten.')] };
}
function vraagDoorslag() {
  const S = KOPPEL[kies(['conc', 'baby', 'saldo', 'spoed', 'hart'])]();
  const K = { conc: 'Start bij 0, stijgt tot een top en daalt weer tot 0: het geneesmiddel komt in het bloed en is daarna uitgewerkt.', baby: 'Start hoog, daalt eerst een beetje (een dal) en stijgt daarna: de baby verliest eerst gewicht en komt dan bij.',
    saldo: 'De grafiek komt onder de x-as: het saldo wordt negatief (in het rood).', spoed: 'De grafiek heeft twee toppen: twee drukke momenten op de dag.', hart: 'Start bij een waarde groter dan 0, stijgt tot een top en daalt weer: de hartslag in rust, dan inspanning, dan rustiger.' };
  return { soort: 'doorslag', opdracht: 'Kies het kenmerk dat de doorslag geeft.', html: `${figuur(kaal(S))}${opgave(korteSit(S))}${vraag('Welk kenmerk van de grafiek toont het best dat ze bij deze situatie hoort?')}`, sleutel: S.e + 'd',
    rapport: `doorslaggevend kenmerk (${S.titel})`, antw: zinnen(K[S.fam], Object.keys(K).filter(k => k !== S.fam).map(k => K[k])), uitleg: [tx(K[S.fam])] };
}
const D5 = {
  nr: 5, titel: 'Koppel de grafiek aan de situatie', kort: 'Grafieken en situaties aan elkaar koppelen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Grafiek en situatie koppelen</div>
      <p>Bij een grafiek zonder namen bij de assen redeneer je met de <b>vorm</b> en de <b>getallen</b>:</p>
      <ul><li><b>Beginwaarde:</b> start de grafiek bij 0 (nog geen geneesmiddel, nog niemand ziek) of bij een andere waarde (hartslag in rust, geboortegewicht)?</li>
      <li><b>Stijgen en dalen:</b> één top (berg), één dal, twee toppen (twee drukke momenten), of overal dalend (gsm-batterij)?</li>
      <li><b>Nulpunten:</b> komt de grafiek op 0 (uitgewerkt, de straal komt neer) of zelfs eronder (schuld)?</li>
      <li><b>Constant:</b> een horizontale rechte (de temperatuur blijft 37 °C).</li>
      <li><b>Domein:</b> waar begint en eindigt de grafiek (van 6 u tot 22 u, de eerste 14 dagen …)?</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Voorbeelden uit de werkbundel</div>
      <table class="tabel"><tr><th>Grafiek</th><th>Situatie</th><th>Doorslaggevend kenmerk</th></tr>
      <tr><td>${rgraf({ x: [0, 14], y: [3200, 3900], xs: 2, ys: 100, functies: [{ f: (d) => 6 * d * d - 60 * d + 3500 }], klein: true, breed: 200, hoog: 110 })}</td><td>gewicht van een baby de eerste twee weken</td><td>start hoog, een dal op dag 5, daarna stijgend</td></tr>
      <tr><td>${rgraf({ x: [0, 12], y: [-600, 1200], xs: 2, ys: 300, functies: [{ f: (m) => -5 * m ** 3 + 120 * m * m - 780 * m + 1120 }], klein: true, breed: 200, hoog: 110 })}</td><td>saldo van een jeugdbeweging</td><td>de grafiek komt onder de $x$-as (in het rood)</td></tr>
      <tr><td>${rgraf({ x: [0, 8], y: [0, 110], xs: 1, ys: 20, functies: [{ f: (t) => 100 - 12.5 * t }], klein: true, breed: 200, hoog: 110 })}</td><td>batterij van een gsm die gelijkmatig leegloopt</td><td>een dalende rechte</td></tr></table></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: figuur(rgraf({ x: [0, 20], y: [0, 170], xs: 2, ys: 20, functies: [{ f: (t) => -0.8 * t * t + 16 * t + 70, e: '-0.8*x**2+16*x+70' }] })),
      stappen: ['\\text{Start bij 70 (niet bij 0), stijgt tot een top van 150 en daalt weer tot 70.}', '\\text{Past bij: de hartslag tijdens een looptest.}'] },
  ],
  soorten: {
    grafsit: { naam: 'Grafiek → situatie', gen: vraagGrafNaarSit },
    sitgraf: { naam: 'Situatie → grafiek', gen: vraagSitNaarGraf },
    doorslag: { naam: 'Welk kenmerk geeft de doorslag?', gen: vraagDoorslag },
  },
  oefenMix: [['grafsit', 2], ['sitgraf', 2], ['doorslag', 1]],
  test: [['grafsit', 4], ['sitgraf', 4], ['doorslag', 2]], testSchudden: true,
};
