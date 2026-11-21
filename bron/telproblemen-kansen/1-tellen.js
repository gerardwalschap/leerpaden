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
