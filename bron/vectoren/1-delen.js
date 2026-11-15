// ===================================================================
//  VECTOREN — de delen (volgens de cursus 4. Vectoren, 4BW-MWW)
// ===================================================================
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
const TEKENEN = `<div class="kader"><div class="kader-titel">Zo teken je op de computer</div>
  <p>Klik eerst het <b>startpunt</b> van de pijl aan en daarna het <b>eindpunt</b> (altijd op een roosterpunt). Moet je meer pijlen tekenen, kies dan eerst de juiste pijl met de gekleurde knop.
  Fout getekend? Klik gewoon opnieuw een startpunt aan, of gebruik <i>pijl wissen</i>.</p></div>`;
// meerkeuze uit een vragenbank [vraag, [juist, fout, fout, …]]
const bankVraag = (bank) => { const [v, opts] = kies(bank); const s = schud(opts.map((o, i) => ({ o, i }))); return { opdracht: 'Kies het juiste antwoord.', html: `<p class="opgave-tekst">${v}</p>`, antw: keuze(kT(s.map(x => x.o)), s.findIndex(x => x.i === 0)) }; };

// ---- 1. Wat is een vector? ----------------------------------------------------------
const D1 = {
  nr: 1, titel: 'Wat is een vector?', kort: 'Grootte, richting en zin; een vector legt een verplaatsing vast.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Definitie</div>
      <p>Een punt legt enkel een <b>plaats</b> vast. Een <b>vector</b> legt een <b>verplaatsing</b> vast: het is een grootheid met een <b>grootte</b>, een <b>richting</b> en een <b>zin</b>, voorgesteld door een pijl.</p>
      <ul><li><b>Grootte:</b> de lengte van de pijl.</li><li><b>Richting:</b> de rechte waarop de pijl ligt (of een evenwijdige rechte).</li><li><b>Zin:</b> de kant waarnaar de pijl wijst, van startpunt naar eindpunt.</li></ul>
      ${vfig({ h: 5, b: 12, gegeven: [{ van: [2, 1], d: [6, 3], naam: 'v' }], punten: [{ p: [2, 1], naam: 'A' }, { p: [8, 4], naam: 'B' }] })}
      <p>Een vector van A naar B noteer je als $\\overrightarrow{AB}$, of kort met een kleine letter: $\\vec{a}$, $\\vec{b}$, $\\vec{v}$, …</p></div>
    <div class="kader eig"><div class="kader-titel">Vakjes tellen</div>
      <p>Op geruit papier beschrijf je een vector door te tellen hoeveel vakjes hij <b>horizontaal</b> (naar rechts of naar links) en <b>verticaal</b> (omhoog of omlaag) gaat. De vector hierboven: 6 naar rechts en 3 omhoog.</p></div>`,
  voorbeelden: [
    { html: `Hoe verplaatst de vector $\\vec{a}$ zich? ${vfig({ h: 5, b: 10, gegeven: [{ van: [7, 1], d: [-4, 3], naam: 'a' }] })}`,
      stappen: ['\\text{Startpunt: onderaan rechts. Eindpunt: de kop van de pijl.}', '\\text{Horizontaal: 4 vakjes naar links.}', '\\text{Verticaal: 3 vakjes omhoog.}', '\\vec{a}\\text{: 4 naar links en 3 omhoog}'] },
    { html: `Welke vectoren hebben dezelfde richting als $\\vec{a}$? Welke ook dezelfde zin? ${vfig({ h: 6, b: 14, gegeven: [{ van: [1, 1], d: [3, 1], naam: 'a' }, { van: [10, 5], d: [-3, -1], naam: 'b' }, { van: [5, 2], d: [6, 2], naam: 'c' }, { van: [12, 1], d: [1, 3], naam: 'd' }] })}`,
      stappen: ['\\text{Zelfde richting = op evenwijdige rechten: } \\vec{a}, \\vec{b} \\text{ en } \\vec{c}.', '\\vec{d} \\text{ staat steiler: andere richting.}', '\\text{Zelfde zin: } \\vec{a} \\text{ en } \\vec{c} \\text{ wijzen naar rechtsboven, } \\vec{b} \\text{ naar linksonder.}'] },
  ],
  soorten: {
    tellen: { naam: 'Vakjes tellen', gen() {
      const d = rv(4, 4, { as: Math.random() < 0.2 });
      const fouten = [[d[1], d[0]], [-d[0], d[1]], [d[0], -d[1]], [-d[0], -d[1]]].filter(e => (e[0] !== d[0] || e[1] !== d[1]) && (e[0] || e[1]));
      const opts = [d, ...schud(fouten).filter((e, i, A) => A.findIndex(f => f[0] === e[0] && f[1] === e[1]) === i).slice(0, 3)];
      const s = schud(opts.map((o, i) => ({ o, i })));
      const van = [d[0] >= 0 ? rnd(1, 9 - Math.max(d[0], 0)) : rnd(1 - d[0], 9), d[1] >= 0 ? rnd(0, 5 - d[1]) : rnd(-d[1], 5)];
      return { opdracht: 'Hoe verplaatst de vector zich?', html: vfig({ b: 10, h: 5, gegeven: [{ van, d, naam: 'a' }] }),
        antw: keuze(kT(s.map(x => woorden(x.o))), s.findIndex(x => x.i === 0)), uitleg: [uitlegD('a', d)] };
    } },
    puntvector: { naam: 'Punt of vector?', gen() {
      const bank = [['De school ligt op de hoek van de straat.', 0], ['De top van de Mont Ventoux.', 0], ['Het station van Ekeren.', 0], ['De plaats waar de bal op het veld ligt.', 0],
        ['De bus rijdt 2 km naar het noorden.', 1], ['Je duwt met een kracht van 50 N naar rechts tegen een kast.', 1], ['Een vliegtuig vliegt met 600 km/h naar het oosten.', 1], ['Je stapt 3 passen naar links.', 1], ['De wind blaast met 40 km/h uit het westen.', 1]];
      const [zin, j] = kies(bank);
      return { opdracht: 'Gaat het over een punt (een plaats) of over een vector (een verplaatsing, kracht of snelheid met een richting en zin)?', html: `<p class="opgave-tekst">${zin}</p>`,
        antw: keuze(kT(['een punt', 'een vector']), j), uitleg: [j ? '\\text{Er is een grootte, een richting en een zin: een vector.}' : '\\text{Er wordt enkel een plaats vastgelegd: een punt.}'] };
    } },
    rz: { naam: 'Richting en zin vergelijken', gen() {
      for (;;) {
        const a = rv(3, 2);
        const zelfde = maal(2, a), tegen = maal(kies([-1, -2]), a);
        let anders; do { anders = rv(3, 3); } while (evenwijdig(anders, a));
        const cand = schud([{ d: zelfde, t: 'zz' }, { d: tegen, t: 'za' }, { d: anders, t: 'ar' }]);
        const namen = ['b', 'c', 'd'];
        const ds = [a, ...cand.map(c => c.d)];
        if (!pastInStrook([a]) || ds.some(d => Math.abs(d[0]) > 6 || Math.abs(d[1]) > 4)) continue;
        // plaatsen: a links, de anderen naast elkaar
        const g = [{ van: [a[0] >= 0 ? 0 : -a[0], a[1] >= 0 ? 1 : 1 - a[1]], d: a, naam: 'a' }];
        let x = STROOK - 1;
        const HH = 7;
        cand.forEach((c, i) => { const dx = c.d[0]; const van = [dx >= 0 ? x + 1 : x + 1 - dx, c.d[1] >= 0 ? rnd(0, HH - c.d[1]) : rnd(-c.d[1], HH)]; g.push({ van, d: c.d, naam: namen[i] }); x = Math.max(van[0], van[0] + dx) + 1; });
        if (x > 18) continue;
        const vraag = kies([['zz', 'Welke vector heeft dezelfde richting én dezelfde zin als $\\vec{a}$?'], ['za', 'Welke vector heeft dezelfde richting als $\\vec{a}$, maar een andere zin?'], ['ar', 'Welke vector heeft een andere richting dan $\\vec{a}$?']]);
        const j = cand.findIndex(c => c.t === vraag[0]);
        return { opdracht: 'Vergelijk de richting en de zin.', html: `<p class="opgave-tekst">${vraag[1]}</p>${vfig({ b: 18, h: 7, gegeven: g })}`,
          antw: keuze(kTex(namen.map(vt)), j), uitleg: ['\\text{Zelfde richting: de pijlen liggen op evenwijdige rechten.}', '\\text{Zelfde zin: ze wijzen naar dezelfde kant.}'] };
      }
    } },
  },
  oefenMix: [['tellen', 2], ['puntvector', 1], ['rz', 2]],
  test: [['tellen', 4], ['puntvector', 3], ['rz', 3]], testSchudden: true,
};

// ---- 2. Gelijke vectoren, nulvector en tegengestelde vector ----------------------------
const D2 = {
  nr: 2, titel: 'Gelijke, nul- en tegengestelde vectoren', kort: 'Gelijke vectoren, de nulvector en de tegengestelde vector −a.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Gelijke vectoren</div>
      <p>Twee vectoren zijn <b>gelijk</b> als ze dezelfde grootte, dezelfde richting én dezelfde zin hebben. De plaats in het vlak speelt geen rol: je mag een vector vrij verschuiven, evenwijdig aan zichzelf.</p>
      ${vfig({ h: 5, b: 13, gegeven: [{ van: [1, 1], d: [3, 3], naam: 'v' }, { van: [5, 1], d: [3, 3], naam: 'v' }, { van: [9, 1], d: [3, 3], naam: 'v' }] })}</div>
    <div class="kader def"><div class="kader-titel">Nulvector en tegengestelde vector</div>
      <p><b>Nulvector</b> $\\vec{0}$: startpunt en eindpunt vallen samen. Grootte 0, geen richting en geen zin. Je tekent hem als een punt.</p>
      <p><b>Tegengestelde vector</b> $-\\vec{a}$: zelfde grootte, zelfde richting, maar <b>omgekeerde zin</b>. Is $\\vec{a} = \\overrightarrow{AB}$, dan is $-\\vec{a} = \\overrightarrow{BA}$.</p>
      ${vfig({ h: 5, b: 13, gegeven: [{ van: [1, 1], d: [4, 3], naam: 'a' }, { van: [12, 4], d: [-4, -3], naam: '-a', kleur: OR }], punten: [{ p: [6, 1], naam: '' }] })}
      <p class="klein">Tegengestelde vector tekenen: tel de vakjes van $\\vec{a}$ en ga evenveel vakjes de <b>andere kant</b> op (links ↔ rechts, omhoog ↔ omlaag).</p></div>${TEKENEN}`,
  voorbeelden: [
    { html: `Welke vector is gelijk aan $\\vec{a}$? ${vfig({ h: 6, b: 15, gegeven: [{ van: [1, 2], d: [3, 2], naam: 'a' }, { van: [5, 1], d: [2, 3], naam: 'b' }, { van: [8, 4], d: [3, 2], naam: 'c' }, { van: [14, 3], d: [-3, -2], naam: 'd' }] })}`,
      stappen: ['\\vec{a}\\text{: 3 naar rechts en 2 omhoog.}', '\\vec{b}\\text{: 2 naar rechts en 3 omhoog: andere richting.}', '\\vec{c}\\text{: 3 naar rechts en 2 omhoog: gelijk aan } \\vec{a}.', '\\vec{d}\\text{: 3 naar links en 2 omlaag: andere zin, dus } \\vec{d} = -\\vec{a}.'] },
    { html: `Teken de tegengestelde vector van $\\vec{a}$ vanuit P. ${vfig({ h: 6, b: 13, gegeven: [{ van: [1, 2], d: [4, 1], naam: 'a' }], punten: [{ p: [11, 4], naam: 'P' }] })}`,
      stappen: ['\\vec{a}\\text{: 4 naar rechts en 1 omhoog.}', '-\\vec{a}\\text{: omgekeerde zin, dus 4 naar links en 1 omlaag.}',
        stapfig({ h: 6, b: 13, gegeven: [{ van: [1, 2], d: [4, 1], naam: 'a' }], punten: [{ p: [11, 4], naam: 'P' }] }, [{ van: [11, 4], d: [-4, -1], naam: '-a', kleur: OR }])] },
  ],
  soorten: {
    gelijk: { naam: 'Welke vector is gelijk?', gen() {
      for (;;) {
        const a = rv(3, 3);
        let ander; do { ander = rv(3, 3); } while (evenwijdig(ander, a));
        const c = schud([{ d: a, ok: 1 }, { d: maal(-1, a), ok: 0 }, { d: [a[1], a[0]].some((x, i) => x !== a[i]) ? [a[1], a[0]] : ander, ok: 0 }, { d: ander, ok: 0 }]);
        if (c.filter(x => x.d[0] === a[0] && x.d[1] === a[1]).length !== 1) continue;
        const namen = ['b', 'c', 'd', 'e'], g = [{ van: [a[0] >= 0 ? 0 : -a[0], a[1] >= 0 ? 2 : 2 - a[1]], d: a, naam: 'a' }];
        let x = 4;
        c.forEach((q, i) => { const van = [q.d[0] >= 0 ? x + 1 : x + 1 - q.d[0], q.d[1] >= 0 ? rnd(0, H - 1 - q.d[1]) : rnd(-q.d[1], H - 1)]; g.push({ van, d: q.d, naam: namen[i] }); x = Math.max(van[0], van[0] + q.d[0]) + 1; });
        if (x > 24) continue;
        return { opdracht: 'Welke vector is gelijk aan a?', html: `<p class="opgave-tekst">Welke vector is gelijk aan $\\vec{a}$?</p>${vfig({ b: 24, h: H, gegeven: g })}`,
          antw: keuze(kTex(namen.map(vt)), c.findIndex(q => q.ok)), uitleg: [uitlegD('a', a), '\\text{Gelijk: zelfde aantal vakjes in dezelfde zin.}'] };
      }
    } },
    tegen: { naam: 'Tegengestelde vector tekenen', gen() {
      for (;;) {
        const a = rv(4, 4); if (!pastInStrook([a])) continue;
        const P = startVoor([[0, 0], maal(-1, a)]); if (!P) continue;
        return { opdracht: 'Teken de tegengestelde vector van a vanuit P.', html: `<p class="opgave-tekst">Teken de tegengestelde vector $-\\vec{a}$ vanuit het punt P.</p>`,
          antw: tekenAntw({ gegeven: strook([{ d: a, naam: 'a' }]), punten: [{ p: P, naam: 'P' }], teken: [{ naam: '-a', d: maal(-1, a), van: P }] }),
          uitleg: [uitlegD('a', a), `\\text{dus } -\\vec{a}\\text{: ${woorden(maal(-1, a))}}`] };
      }
    } },
    begrip: { naam: 'Begrippen', gen() {
      return bankVraag([
        ['Een vector waarvan het startpunt en het eindpunt samenvallen, noem je …', ['de nulvector', 'de tegengestelde vector', 'een gelijke vector', 'een punt']],
        ['De tegengestelde vector van a heeft …', ['dezelfde grootte en richting, maar de omgekeerde zin', 'dezelfde grootte, richting en zin', 'een andere richting', 'grootte 0']],
        ['Twee vectoren zijn gelijk als ze …', ['dezelfde grootte, richting én zin hebben', 'in hetzelfde punt starten', 'even lang zijn', 'op dezelfde rechte liggen']],
        ['Je verschuift een vector evenwijdig aan zichzelf naar een andere plaats. Dan …', ['blijft het dezelfde vector', 'krijg je de tegengestelde vector', 'verandert de richting', 'verandert de grootte']],
        ['De nulvector heeft …', ['grootte 0, geen richting en geen zin', 'grootte 1', 'dezelfde richting als elke vector', 'een richting maar geen zin']],
      ]);
    } },
  },
  oefenMix: [['gelijk', 2], ['tegen', 2], ['begrip', 1]],
  test: [['gelijk', 3], ['tegen', 4], ['begrip', 3]], testSchudden: true,
};

// ---- 3. Vectoren tekenen ------------------------------------------------------------
const D3 = {
  nr: 3, titel: 'Vectoren tekenen', kort: 'Een vector natekenen vanuit een ander startpunt.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div>
      <ol><li>Tel hoeveel vakjes de vector <b>horizontaal</b> gaat (naar rechts of naar links).</li><li>Tel hoeveel vakjes <b>verticaal</b> (omhoog of omlaag).</li><li>Tel exact hetzelfde vanuit het nieuwe startpunt en teken de pijl.</li></ol>
      ${vfig({ h: 5, b: 13, gegeven: [{ van: [1, 1], d: [4, 2], naam: 'a' }, { van: [7, 2], d: [4, 2], naam: 'a', kleur: OR }], punten: [{ p: [7, 2], naam: 'P' }] })}</div>${TEKENEN}`,
  voorbeelden: [
    { html: `Teken $\\vec{a}$ opnieuw vanuit P. ${vfig({ h: 7, b: 14, gegeven: [{ van: [1, 1], d: [5, 2], naam: 'a' }], punten: [{ p: [7, 4], naam: 'P' }] })}`,
      stappen: ['\\vec{a}\\text{: 5 naar rechts en 2 omhoog.}', '\\text{Vanuit P: 5 naar rechts en 2 omhoog.}', stapfig({ h: 7, b: 14, gegeven: [{ van: [1, 1], d: [5, 2], naam: 'a' }], punten: [{ p: [7, 4], naam: 'P' }] }, [{ van: [7, 4], d: [5, 2], naam: 'a', kleur: OR }])] },
    { html: `Teken $\\vec{b}$ opnieuw vanuit Q. ${vfig({ h: 7, b: 13, gegeven: [{ van: [5, 1], d: [-3, 4], naam: 'b' }], punten: [{ p: [11, 2], naam: 'Q' }] })}`,
      stappen: ['\\vec{b}\\text{: 3 naar links en 4 omhoog.}', '\\text{Vanuit Q: 3 naar links en 4 omhoog.}', stapfig({ h: 7, b: 13, gegeven: [{ van: [5, 1], d: [-3, 4], naam: 'b' }], punten: [{ p: [11, 2], naam: 'Q' }] }, [{ van: [11, 2], d: [-3, 4], naam: 'b', kleur: OR }]), '\\text{Controle: even lang, evenwijdig en dezelfde zin.}'] },
  ],
  soorten: {
    een: { naam: 'Een vector natekenen', gen() {
      for (;;) {
        const a = rv(4, 4, { as: Math.random() < 0.15 }); if (!pastInStrook([a])) continue;
        const P = startVoor([[0, 0], a]); if (!P) continue;
        return { opdracht: 'Teken a opnieuw vanuit P.', html: `<p class="opgave-tekst">Teken $\\vec{a}$ opnieuw, maar nu vanuit het punt P.</p>`,
          antw: tekenAntw({ gegeven: strook([{ d: a, naam: 'a' }]), punten: [{ p: P, naam: 'P' }], teken: [{ naam: 'a', d: a, van: P }] }), uitleg: [uitlegD('a', a)] };
      }
    } },
    twee: { naam: 'Twee vectoren natekenen', gen() {
      for (;;) {
        const a = rv(4, 4), b = rv(4, 4); if (!pastInStrook([a, b])) continue;
        const P = startVoor([[0, 0], a]), Q = P && startVoor([[0, 0], b]);
        if (!P || !Q || (P[0] === Q[0] && P[1] === Q[1])) continue;
        return { opdracht: 'Teken a vanuit P en b vanuit Q.', html: `<p class="opgave-tekst">Teken $\\vec{a}$ vanuit P en $\\vec{b}$ vanuit Q.</p>`,
          antw: tekenAntw({ gegeven: strook([{ d: a, naam: 'a' }, { d: b, naam: 'b' }]), punten: [{ p: P, naam: 'P' }, { p: Q, naam: 'Q' }], teken: [{ naam: 'a', d: a, van: P }, { naam: 'b', d: b, van: Q }] }),
          uitleg: [uitlegD('a', a), uitlegD('b', b)] };
      }
    } },
  },
  oefenMix: [['een', 2], ['twee', 1]],
  test: [['een', 6], ['twee', 4]], testSchudden: true,
};

// ---- 4. Som: kop-staartmethode ---------------------------------------------------------
function somOpgave(methode, vrij) {
  for (;;) {
    const a = rv(4, 4), b = rv(4, 4); if (!pastInStrook([a, b]) || evenwijdig(a, b)) continue;
    const s = som(a, b);
    const P = startVoor([[0, 0], a, b, s]); if (!P) continue;
    const teken = methode === 'ks'
      ? [{ naam: 'a', d: a, ...(vrij ? { vb: P } : { van: P }) }, { naam: 'b', d: b, kopVan: 0 }, { naam: 'a+b', d: s, startVan: 0 }]
      : [{ naam: 'a', d: a, ...(vrij ? { vb: P } : { van: P }) }, { naam: 'b', d: b, startVan: 0 }, { naam: 'a+b', d: s, startVan: 0 }];
    return { a, b, s, P, antw: tekenAntw({ gegeven: strook([{ d: a, naam: 'a' }, { d: b, naam: 'b' }]), punten: vrij ? [] : [{ p: P, naam: 'P' }], teken }) };
  }
}
const D4 = {
  nr: 4, titel: 'De som: kop-staartmethode', kort: 'Teken b vanuit de kop van a; a + b gaat van het begin van a naar de kop van b.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De kop-staartmethode</div>
      <ol><li>Teken $\\vec{a}$.</li><li>Teken $\\vec{b}$ vanuit de <b>kop</b> (het eindpunt) van $\\vec{a}$.</li><li>De som $\\vec{a} + \\vec{b}$ loopt van het startpunt van $\\vec{a}$ naar de kop van $\\vec{b}$.</li></ol>
      ${vfig({ h: 6, b: 9, gegeven: [{ van: [1, 1], d: [4, 1], naam: 'a' }, { van: [5, 2], d: [1, 3], naam: 'b' }, { van: [1, 1], d: [5, 4], naam: 'a+b', kleur: OR }] })}</div>
    <div class="kader eig"><div class="kader-titel">Tip</div><p>Tel ook bij de som de vakjes: de vakjes van $\\vec{a}$ en $\\vec{b}$ tel je gewoon op. Hierboven: 4 + 1 = 5 naar rechts en 1 + 3 = 4 omhoog.</p></div>${TEKENEN}`,
  voorbeelden: [
    { html: `Teken $\\vec{a} + \\vec{b}$ met de kop-staartmethode, vanuit P. ${vfig({ h: 8, b: 14, gegeven: [{ van: [0, 6], d: [4, 1], naam: 'a' }, { van: [1, 1], d: [1, 3], naam: 'b' }], punten: [{ p: [7, 1], naam: 'P' }] })}`,
      stappen: ['\\text{Teken } \\vec{a} \\text{ vanuit P: 4 naar rechts en 1 omhoog.}', '\\text{Teken } \\vec{b} \\text{ vanuit de kop van } \\vec{a}\\text{: 1 naar rechts en 3 omhoog.}',
        stapfig({ h: 8, b: 14, gegeven: [{ van: [0, 6], d: [4, 1], naam: 'a' }, { van: [1, 1], d: [1, 3], naam: 'b' }], punten: [{ p: [7, 1], naam: 'P' }] }, [{ van: [7, 1], d: [4, 1], naam: 'a', kleur: BL }, { van: [11, 2], d: [1, 3], naam: 'b', kleur: OR }, { van: [7, 1], d: [5, 4], naam: 'a+b', kleur: GR }]),
        '\\vec{a} + \\vec{b}\\text{: van P naar de kop van } \\vec{b}\\text{, 5 naar rechts en 4 omhoog.}'] },
    { html: `Teken $\\vec{a} + \\vec{b}$ met de kop-staartmethode. ${vfig({ h: 8, b: 14, gegeven: [{ van: [0, 5], d: [4, 2], naam: 'a' }, { van: [1, 4], d: [2, -3], naam: 'b' }], punten: [{ p: [7, 3], naam: 'P' }] })}`,
      stappen: ['\\vec{a}\\text{: 4 naar rechts en 2 omhoog, vanuit P.}', '\\vec{b}\\text{ vanuit de kop van } \\vec{a}\\text{: 2 naar rechts en 3 omlaag.}',
        stapfig({ h: 8, b: 14, gegeven: [{ van: [0, 5], d: [4, 2], naam: 'a' }, { van: [1, 4], d: [2, -3], naam: 'b' }], punten: [{ p: [7, 3], naam: 'P' }] }, [{ van: [7, 3], d: [4, 2], naam: 'a', kleur: BL }, { van: [11, 5], d: [2, -3], naam: 'b', kleur: OR }, { van: [7, 3], d: [6, -1], naam: 'a+b', kleur: GR }]),
        '\\vec{a} + \\vec{b}\\text{: 6 naar rechts en 1 omlaag.}'] },
  ],
  soorten: {
    ks: { naam: 'Kop-staart vanuit P', gen() { const o = somOpgave('ks', false); return { opdracht: 'Teken a vanuit P, b vanuit de kop van a, en dan a + b.', html: `<p class="opgave-tekst">Teken met de kop-staartmethode: $\\vec{a}$ vanuit P, $\\vec{b}$ vanuit de kop van $\\vec{a}$, en dan $\\vec{a} + \\vec{b}$.</p>`, antw: o.antw, uitleg: [uitlegD('a', o.a), uitlegD('b', o.b), `\\vec{a} + \\vec{b}\\text{: ${woorden(o.s)}}`] }; } },
    ksvrij: { naam: 'Kop-staart, zelf een startpunt kiezen', gen() { const o = somOpgave('ks', true); return { opdracht: 'Teken a + b met de kop-staartmethode (startpunt vrij).', html: `<p class="opgave-tekst">Teken $\\vec{a} + \\vec{b}$ met de kop-staartmethode. Kies zelf een startpunt in het rooster.</p>`, antw: o.antw, uitleg: [uitlegD('a', o.a), uitlegD('b', o.b), `\\vec{a} + \\vec{b}\\text{: ${woorden(o.s)}}`] }; } },
  },
  oefenMix: [['ks', 2], ['ksvrij', 1]],
  test: [['ks', 6], ['ksvrij', 4]], testSchudden: true,
};

// ---- 5. Som: parallellogrammethode en a + (−a) --------------------------------------
const D5 = {
  nr: 5, titel: 'De som: parallellogrammethode', kort: 'a en b vanuit hetzelfde punt; de diagonaal is a + b. En a + (−a) = 0.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">De parallellogrammethode</div>
      <ol><li>Teken $\\vec{a}$ en $\\vec{b}$ vanuit <b>hetzelfde startpunt</b>.</li><li>Vervolledig de figuur tot een parallellogram.</li><li>De diagonaal vanuit het startpunt is $\\vec{a} + \\vec{b}$.</li></ol>
      ${vfig({ h: 6, b: 9, gegeven: [{ van: [1, 1], d: [4, 1], naam: 'a' }, { van: [1, 1], d: [1, 3], naam: 'b' }, { van: [1, 1], d: [5, 4], naam: 'a+b', kleur: OR }], lijnen: [{ van: [5, 2], naar: [6, 5], stippel: true }, { van: [2, 4], naar: [6, 5], stippel: true }] })}
      <p>Beide methodes geven <b>dezelfde som</b>. De parallellogrammethode is handig als de vectoren in hetzelfde punt starten, zoals krachten op een voorwerp.</p></div>
    <div class="kader eig"><div class="kader-titel">Een vector plus zijn tegengestelde vector</div>
      <p>Tel je bij $\\vec{a}$ zijn tegengestelde vector op, dan kom je terug in het startpunt: $\\vec{a} + (-\\vec{a}) = \\vec{0}$.</p></div>${TEKENEN}`,
  voorbeelden: [
    { html: `Teken $\\vec{a} + \\vec{b}$ met de parallellogrammethode, vanuit P. ${vfig({ h: 7, b: 14, gegeven: [{ van: [0, 5], d: [4, 1], naam: 'a' }, { van: [1, 1], d: [1, 3], naam: 'b' }], punten: [{ p: [7, 1], naam: 'P' }] })}`,
      stappen: ['\\text{Teken } \\vec{a} \\text{ en } \\vec{b} \\text{ allebei vanuit P.}', '\\text{Trek door de kop van } \\vec{a} \\text{ een lijn evenwijdig met } \\vec{b}\\text{, en omgekeerd.}',
        stapfig({ h: 7, b: 14, gegeven: [{ van: [0, 5], d: [4, 1], naam: 'a' }, { van: [1, 1], d: [1, 3], naam: 'b' }], punten: [{ p: [7, 1], naam: 'P' }], lijnen: [{ van: [11, 2], naar: [12, 5], stippel: true }, { van: [8, 4], naar: [12, 5], stippel: true }] }, [{ van: [7, 1], d: [4, 1], naam: 'a', kleur: BL }, { van: [7, 1], d: [1, 3], naam: 'b', kleur: OR }, { van: [7, 1], d: [5, 4], naam: 'a+b', kleur: GR }]),
        '\\text{De diagonaal vanuit P is } \\vec{a} + \\vec{b}\\text{: 5 naar rechts en 4 omhoog. Dezelfde som als met kop-staart!}'] },
    { html: `Wat is $\\vec{a} + (-\\vec{a})$?`,
      stappen: ['\\text{Teken } \\vec{a}\\text{, en vanuit de kop van } \\vec{a} \\text{ de vector } -\\vec{a}\\text{: even lang, maar terug.}',
        stapfig({ h: 5, b: 9, gegeven: [] }, [{ van: [2, 1], d: [5, 3], naam: 'a', kleur: BL }, { van: [7, 4], d: [-5, -3], naam: '-a', kleur: OR }]), '\\text{Je komt terug in het startpunt: } \\vec{a} + (-\\vec{a}) = \\vec{0}.'] },
  ],
  soorten: {
    pg: { naam: 'Parallellogrammethode vanuit P', gen() { const o = somOpgave('pg', false); return { opdracht: 'Teken a en b vanuit P, en dan a + b.', html: `<p class="opgave-tekst">Teken met de parallellogrammethode: $\\vec{a}$ en $\\vec{b}$ allebei vanuit P, en dan $\\vec{a} + \\vec{b}$.</p>`, antw: o.antw, uitleg: [uitlegD('a', o.a), uitlegD('b', o.b), `\\vec{a} + \\vec{b}\\text{: ${woorden(o.s)}}`] }; } },
    nul: { naam: 'a + (−a) tekenen', gen() {
      for (;;) {
        const a = rv(4, 4); if (!pastInStrook([a])) continue;
        const P = startVoor([[0, 0], a]); if (!P) continue;
        return { opdracht: 'Teken a vanuit P en dan −a vanuit de kop van a. Welke vector is a + (−a)?', html: `<p class="opgave-tekst">Teken $\\vec{a}$ vanuit P en $-\\vec{a}$ vanuit de kop van $\\vec{a}$. Welke vector is $\\vec{a} + (-\\vec{a})$?</p>`,
          antw: delen(['', tekenAntw({ gegeven: strook([{ d: a, naam: 'a' }]), punten: [{ p: P, naam: 'P' }], teken: [{ naam: 'a', d: a, van: P }, { naam: '-a', d: maal(-1, a), kopVan: 0 }] })],
            ['\\vec{a} + (-\\vec{a}) =', keuze(kTex(['\\vec{0}', '2\\vec{a}', '-\\vec{a}', '\\vec{a}']), 0)]),
          uitleg: ['\\text{Je komt terug in het startpunt: } \\vec{a} + (-\\vec{a}) = \\vec{0}'] };
      }
    } },
    begrip: { naam: 'Begrippen', gen() {
      return bankVraag([
        ['Je tekent a + b met de kop-staartmethode en met de parallellogrammethode. Dan …', ['krijg je twee keer dezelfde vector', 'is de som met kop-staart langer', 'hebben de sommen een andere zin', 'krijg je de nulvector']],
        ['Bij de parallellogrammethode teken je a en b …', ['vanuit hetzelfde startpunt', 'b vanuit de kop van a', 'in tegengestelde zin', 'evenwijdig naast elkaar']],
        ['a + b en b + a zijn …', ['gelijke vectoren', 'tegengestelde vectoren', 'altijd de nulvector', 'verschillend van richting']],
        ['Twee krachten grijpen aan in hetzelfde punt van een voorwerp. Welke methode is dan het handigst?', ['de parallellogrammethode', 'de kop-staartmethode', 'geen van beide', 'vermenigvuldigen met een getal']],
      ]);
    } },
  },
  oefenMix: [['pg', 2], ['nul', 1], ['begrip', 1]],
  test: [['pg', 5], ['nul', 2], ['begrip', 3]], testSchudden: true,
};

// ---- 6. Vermenigvuldiging met een getal ----------------------------------------------
const kNaam = (k) => k === 1 ? '' : k === -1 ? '-' : k === 0.5 ? '½' : k === -0.5 ? '-½' : String(k);
const kTexN = (k) => k === 1 ? '' : k === -1 ? '-' : k === 0.5 ? '\\tfrac{1}{2}' : k === -0.5 ? '-\\tfrac{1}{2}' : String(k);
const D6 = {
  nr: 6, titel: 'Een vector maal een getal', kort: 'k·a: zelfde richting, grootte |k| keer zo groot, zin om als k < 0.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Scalaire vermenigvuldiging</div>
      <p>$k \\cdot \\vec{a}$ heeft dezelfde <b>richting</b> als $\\vec{a}$. De <b>grootte</b> wordt $|k|$ keer zo groot. Is $k < 0$, dan draait de <b>zin</b> om.</p>
      <table class="tabel"><tr><th>getal k</th><th>grootte</th><th>zin</th></tr><tr><td>k &gt; 1</td><td>langer</td><td>zelfde zin</td></tr><tr><td>0 &lt; k &lt; 1</td><td>korter</td><td>zelfde zin</td></tr><tr><td>k = 0</td><td>grootte 0: de nulvector</td><td>geen zin</td></tr><tr><td>k = −1</td><td>zelfde grootte: de tegengestelde vector</td><td>omgekeerde zin</td></tr><tr><td>k &lt; 0</td><td>langer of korter volgens |k|</td><td>omgekeerde zin</td></tr></table>
      ${vfig({ h: 5, b: 15, gegeven: [{ van: [1, 1], d: [2, 1], naam: 'a' }, { van: [4, 1], d: [4, 2], naam: '2a', kleur: OR }, { van: [9, 1], d: [1, 0.5], naam: '½a', kleur: OR }, { van: [14, 4], d: [-2, -1], naam: '-a', kleur: OR }] })}
      <p class="klein">Op geruit papier: vermenigvuldig het aantal vakjes horizontaal én verticaal met k. Bij een negatieve k ga je de andere kant op.</p></div>${TEKENEN}`,
  voorbeelden: [
    { html: `Teken $2\\vec{a}$ en $3\\vec{a}$ als $\\vec{a}$ 2 vakjes naar rechts en 1 omhoog gaat.`,
      stappen: ['2\\vec{a}\\text{: alles maal 2, dus 4 naar rechts en 2 omhoog.}', '3\\vec{a}\\text{: alles maal 3, dus 6 naar rechts en 3 omhoog.}',
        stapfig({ h: 5, b: 15, gegeven: [{ van: [0, 1], d: [2, 1], naam: 'a' }] }, [{ van: [3, 1], d: [4, 2], naam: '2a', kleur: OR }, { van: [8, 1], d: [6, 3], naam: '3a', kleur: BL }])] },
    { html: `Teken $\\tfrac{1}{2}\\vec{a}$ en $-2\\vec{a}$ als $\\vec{a}$ 4 vakjes naar rechts en 2 omhoog gaat.`,
      stappen: ['\\tfrac{1}{2}\\vec{a}\\text{: alles gedeeld door 2, dus 2 naar rechts en 1 omhoog, zelfde zin.}', '-2\\vec{a}\\text{: maal 2 geeft 8 en 4; het minteken draait de zin om: 8 naar links en 4 omlaag.}',
        stapfig({ h: 6, b: 16, gegeven: [{ van: [0, 1], d: [4, 2], naam: 'a' }] }, [{ van: [5, 1], d: [2, 1], naam: '½a', kleur: OR }, { van: [16, 5], d: [-8, -4], naam: '-2a', kleur: BL }])] },
  ],
  soorten: {
    k: { naam: 'k·a tekenen', gen() {
      for (;;) {
        const k = kies([2, 3, -1, -2, -3, 0.5, -0.5, 2]);
        const a = rv(Math.abs(k) >= 2 ? 3 : 4, Math.abs(k) >= 2 ? 3 : 4, { even: Math.abs(k) === 0.5, as: Math.random() < 0.15 });
        const d = maal(k, a); if (!pastInStrook([a])) continue;
        const P = startVoor([[0, 0], d]); if (!P) continue;
        return { opdracht: `Teken ${kNaam(k).replace('-', '−')}a vanuit P.`, html: `<p class="opgave-tekst">Teken $${kTexN(k)}\\vec{a}$ vanuit het punt P.</p>`,
          antw: tekenAntw({ gegeven: strook([{ d: a, naam: 'a' }]), punten: [{ p: P, naam: 'P' }], teken: [{ naam: kNaam(k) + 'a', d, van: P }] }),
          uitleg: [uitlegD('a', a), `${kTexN(k)}\\vec{a}\\text{: ${woorden(d)}}`] };
      }
    } },
    tabel: { naam: 'Effect van k', gen() {
      const k = kies([3, 2, 0.5, 0, -1, -2, -0.5]);
      const juist = k > 1 ? 'langer, zelfde zin' : k > 0 ? 'korter, zelfde zin' : k === 0 ? 'de nulvector' : k === -1 ? 'even lang, omgekeerde zin' : k < -1 ? 'langer, omgekeerde zin' : 'korter, omgekeerde zin';
      const alle = ['langer, zelfde zin', 'korter, zelfde zin', 'de nulvector', 'even lang, omgekeerde zin', 'langer, omgekeerde zin', 'korter, omgekeerde zin'];
      const opts = [juist, ...schud(alle.filter(x => x !== juist)).slice(0, 3)], s = schud(opts.map((o, i) => ({ o, i })));
      return { opdracht: 'Wat gebeurt er met de vector?', tex: `${k === 0.5 ? '\\tfrac{1}{2}' : k === -0.5 ? '-\\tfrac{1}{2}' : k} \\cdot \\vec{a}`,
        antw: keuze(kT(s.map(x => x.o)), s.findIndex(x => x.i === 0)), uitleg: ['\\text{Grootte: } |k| \\text{ keer zo groot. Zin: om als } k < 0.'] };
    } },
  },
  oefenMix: [['k', 3], ['tabel', 1]],
  test: [['k', 7], ['tabel', 3]], testSchudden: true,
};

// ---- 7. Het verschil ------------------------------------------------------------------
function verschil(eerst = 'a', tweede = 'b', vrij = false) {
  for (;;) {
    const a = rv(4, 4), b = rv(4, 4); if (!pastInStrook([a, b]) || evenwijdig(a, b)) continue;
    const [x, y] = eerst === 'a' ? [a, b] : [b, a];
    const r = som(x, maal(-1, y));
    const P = startVoor([[0, 0], x, r]); if (!P) continue;
    return { a, b, x, y, r, antw: tekenAntw({ gegeven: strook([{ d: a, naam: 'a' }, { d: b, naam: 'b' }]), punten: vrij ? [] : [{ p: P, naam: 'P' }],
      teken: [{ naam: eerst, d: x, ...(vrij ? { vb: P } : { van: P }) }, { naam: '-' + tweede, d: maal(-1, y), kopVan: 0 }, { naam: `${eerst}-${tweede}`, d: r, startVan: 0 }] }) };
  }
}
const D7 = {
  nr: 7, titel: 'Het verschil van twee vectoren', kort: 'a − b = a + (−b).', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div>
      <ol><li>Teken $\\vec{a}$.</li><li>Teken vanuit de kop van $\\vec{a}$ de tegengestelde vector $-\\vec{b}$.</li><li>Van het startpunt van $\\vec{a}$ naar de kop van $-\\vec{b}$: dat is $\\vec{a} - \\vec{b}$.</li></ol>
      <p class="midden">$\\vec{a} - \\vec{b} = \\vec{a} + (-\\vec{b})$</p>
      ${vfig({ h: 6, b: 11, gegeven: [{ van: [1, 3], d: [5, 1], naam: 'a' }, { van: [9, 1], d: [1, 3], naam: 'b' }, { van: [6, 4], d: [-1, -3], naam: '-b', kleur: OR }, { van: [1, 3], d: [4, -2], naam: 'a-b', kleur: BL }] })}</div>${TEKENEN}`,
  voorbeelden: [
    { html: `Teken $\\vec{a} - \\vec{b}$ als $\\vec{a}$: 5 naar rechts en 1 omhoog, en $\\vec{b}$: 1 naar rechts en 3 omhoog.`,
      stappen: ['-\\vec{b}\\text{: 1 naar links en 3 omlaag.}', '\\text{Teken } \\vec{a} \\text{ en daarna } -\\vec{b} \\text{ vanuit de kop van } \\vec{a}.',
        stapfig({ h: 6, b: 11, gegeven: [] }, [{ van: [1, 3], d: [5, 1], naam: 'a', kleur: BL }, { van: [6, 4], d: [-1, -3], naam: '-b', kleur: OR }, { van: [1, 3], d: [4, -2], naam: 'a-b', kleur: GR }]), '\\vec{a} - \\vec{b}\\text{: 4 naar rechts en 2 omlaag.}'] },
    { html: `Teken $\\vec{b} - \\vec{a}$ als $\\vec{a}$: 3 naar rechts en 3 omhoog, en $\\vec{b}$: 4 naar rechts en 1 omlaag.`,
      stappen: ['-\\vec{a}\\text{: 3 naar links en 3 omlaag.}', '\\text{Teken } \\vec{b} \\text{ en daarna } -\\vec{a} \\text{ vanuit de kop van } \\vec{b}.',
        stapfig({ h: 6, b: 9, gegeven: [] }, [{ van: [1, 5], d: [4, -1], naam: 'b', kleur: BL }, { van: [5, 4], d: [-3, -3], naam: '-a', kleur: OR }, { van: [1, 5], d: [1, -4], naam: 'b-a', kleur: GR }]), '\\vec{b} - \\vec{a}\\text{: 1 naar rechts en 4 omlaag.}'] },
  ],
  soorten: {
    ab: { naam: 'a − b tekenen', gen() { const o = verschil('a', 'b'); return { opdracht: 'Teken a vanuit P, −b vanuit de kop van a, en dan a − b.', html: `<p class="opgave-tekst">Teken $\\vec{a}$ vanuit P, $-\\vec{b}$ vanuit de kop van $\\vec{a}$, en dan $\\vec{a} - \\vec{b}$.</p>`, antw: o.antw, uitleg: [`-\\vec{b}\\text{: ${woorden(maal(-1, o.b))}}`, `\\vec{a} - \\vec{b}\\text{: ${woorden(o.r)}}`] }; } },
    ba: { naam: 'b − a tekenen (startpunt vrij)', gen() { const o = verschil('b', 'a', true); return { opdracht: 'Teken b − a (startpunt vrij).', html: `<p class="opgave-tekst">Teken $\\vec{b} - \\vec{a}$: eerst $\\vec{b}$, dan $-\\vec{a}$ vanuit de kop van $\\vec{b}$, dan het verschil. Kies zelf een startpunt.</p>`, antw: o.antw, uitleg: [`-\\vec{a}\\text{: ${woorden(maal(-1, o.a))}}`, `\\vec{b} - \\vec{a}\\text{: ${woorden(o.r)}}`] }; } },
  },
  oefenMix: [['ab', 2], ['ba', 1]],
  test: [['ab', 7], ['ba', 3]], testSchudden: true,
};

// ---- 8. Combinaties --------------------------------------------------------------------
const D8 = {
  nr: 8, titel: 'Combinaties tekenen', kort: 'Eerst vermenigvuldigen, dan optellen. Het midden van een lijnstuk.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Werkwijze</div>
      <ol><li>Vermenigvuldig eerst (bv. $2\\vec{a}$ of $-\\vec{b}$).</li><li>Tel daarna op met de kop-staartmethode.</li></ol>
      ${vfig({ h: 6, b: 12, gegeven: [{ van: [0, 1], d: [2, 1], naam: 'a' }, { van: [0, 3], d: [1, 2], naam: 'b' }, { van: [4, 1], d: [4, 2], naam: '2a', kleur: BL }, { van: [8, 3], d: [1, 2], naam: 'b', kleur: OR }, { van: [4, 1], d: [5, 4], naam: '2a+b', kleur: GR }] })}</div>
    <div class="kader eig"><div class="kader-titel">Toepassing: het midden van een lijnstuk</div>
      <p>Het midden M van [AB] vind je door vanuit A de helft van $\\overrightarrow{AB}$ te tekenen: $M = A + \\tfrac{1}{2}\\overrightarrow{AB}$.</p></div>${TEKENEN}`,
  voorbeelden: [
    { html: `Teken $2\\vec{a} + \\vec{b}$ als $\\vec{a}$: 2 naar rechts en 1 omhoog, en $\\vec{b}$: 1 naar rechts en 3 omhoog.`,
      stappen: ['2\\vec{a}\\text{: 4 naar rechts en 2 omhoog.}', '\\vec{b} \\text{ vanuit de kop van } 2\\vec{a}\\text{: 1 naar rechts en 3 omhoog.}',
        stapfig({ h: 7, b: 8, gegeven: [] }, [{ van: [1, 1], d: [4, 2], naam: '2a', kleur: BL }, { van: [5, 3], d: [1, 3], naam: 'b', kleur: OR }, { van: [1, 1], d: [5, 5], naam: '2a+b', kleur: GR }]), '2\\vec{a} + \\vec{b}\\text{: 5 naar rechts en 5 omhoog.}'] },
    { html: `Zoek het midden M van [AB] met vectoren. ${vfig({ h: 6, b: 11, punten: [{ p: [1, 1], naam: 'A' }, { p: [9, 5], naam: 'B' }], lijnen: [{ van: [1, 1], naar: [9, 5] }] })}`,
      stappen: ['\\overrightarrow{AB}\\text{: 8 naar rechts en 4 omhoog.}', '\\tfrac{1}{2}\\overrightarrow{AB}\\text{: 4 naar rechts en 2 omhoog.}',
        stapfig({ h: 6, b: 11, punten: [{ p: [1, 1], naam: 'A' }, { p: [9, 5], naam: 'B' }, { p: [5, 3], naam: 'M' }], lijnen: [{ van: [1, 1], naar: [9, 5] }] }, [{ van: [1, 1], d: [4, 2], naam: '½AB', kleur: OR }]), '\\text{Vanuit A over } \\tfrac{1}{2}\\overrightarrow{AB} \\text{ kom je in M.}'] },
  ],
  soorten: {
    combi: { naam: 'k·a + l·b tekenen', gen() {
      for (;;) {
        const k = kies([2, 2, 3, -1, -2]), l = kies([1, -1, 2, -2]);
        if (k === 1 && l === 1) continue;
        const a = rv(3, 3), b = rv(3, 3); if (!pastInStrook([a, b]) || evenwijdig(a, b)) continue;
        const ka = maal(k, a), lb = maal(l, b), r = som(ka, lb);
        const P = startVoor([[0, 0], ka, r]); if (!P) continue;
        const nA = kNaam(k) + 'a', nB = kNaam(l) + 'b', nR = `${kNaam(k)}a${l < 0 ? '-' : '+'}${kNaam(Math.abs(l))}b`;
        const tex = `${kTexN(k)}\\vec{a} ${l < 0 ? '-' : '+'} ${kTexN(Math.abs(l))}\\vec{b}`;
        return { opdracht: `Teken ${nR.replace(/-/g, '−')} vanuit P.`, html: `<p class="opgave-tekst">Teken $${tex}$: eerst $${kTexN(k)}\\vec{a}$ vanuit P, dan $${kTexN(l)}\\vec{b}$ vanuit de kop, dan het resultaat.</p>`,
          antw: tekenAntw({ gegeven: strook([{ d: a, naam: 'a' }, { d: b, naam: 'b' }]), punten: [{ p: P, naam: 'P' }], teken: [{ naam: nA, d: ka, van: P }, { naam: nB, d: lb, kopVan: 0 }, { naam: nR, d: r, startVan: 0 }] }),
          uitleg: [`${kTexN(k)}\\vec{a}\\text{: ${woorden(ka)}}`, `${kTexN(l)}\\vec{b}\\text{: ${woorden(lb)}}`, `${tex}\\text{: ${woorden(r)}}`] };
      }
    } },
    midden: { naam: 'Midden van een lijnstuk', gen() {
      for (;;) {
        const d = rv(8, 8, { even: true }); if (Math.abs(d[0]) < 2 && Math.abs(d[1]) < 2) continue;
        const A = startVoor([[0, 0], d], 1); if (!A) continue;
        const Bp = add(A, d), h = maal(0.5, d);
        return { opdracht: 'Teken vanuit A de helft van de vector AB: zo vind je het midden M.', html: `<p class="opgave-tekst">Teken vanuit A de vector $\\tfrac{1}{2}\\overrightarrow{AB}$. Zijn kop is het midden M van [AB].</p>`,
          antw: tekenAntw({ punten: [{ p: A, naam: 'A' }, { p: Bp, naam: 'B' }], lijnen: [{ van: A, naar: Bp }], teken: [{ naam: '½AB', d: h, van: A }] }),
          uitleg: [`\\overrightarrow{AB}\\text{: ${woorden(d)}}`, `\\tfrac{1}{2}\\overrightarrow{AB}\\text{: ${woorden(h)}}`] };
      }
    } },
  },
  oefenMix: [['combi', 2], ['midden', 1]],
  test: [['combi', 7], ['midden', 3]], testSchudden: true,
};

// ---- 9. Verschuivingen -----------------------------------------------------------------
function verschuiving(n) {
  for (;;) {
    const v = rv(6, 4); if (Math.abs(v[0]) + Math.abs(v[1]) < 4) continue;
    let pts;
    if (n === 3) { pts = [[0, 0], [rnd(2, 4), 0], [rnd(0, 3), rnd(2, 3)]]; }
    else { pts = [[0, 0], [rnd(2, 4), 0], [rnd(2, 4), rnd(2, 3)], [0, rnd(2, 3)]]; }
    const alle = [...pts, ...pts.map(p => add(p, v))];
    const s = startVoor(alle, 0); if (!s) continue;
    const fig = pts.map(p => add(s, p));
    // gegeven vector v moet ergens vrij passen: probeer een plek die de figuren niet raakt
    const bx = (ps) => [Math.min(...ps.map(p => p[0])), Math.min(...ps.map(p => p[1])), Math.max(...ps.map(p => p[0])), Math.max(...ps.map(p => p[1]))];
    const boxes = [bx(fig), bx(fig.map(p => add(p, v)))];
    let g = null;
    for (let t = 0; t < 60 && !g; t++) { const c = startVoor([[0, 0], v], 0); if (!c) break; const bb = bx([c, add(c, v)]); if (boxes.every(q => bb[2] < q[0] - 0 || bb[0] > q[2] || bb[3] < q[1] || bb[1] > q[3])) g = c; }
    if (!g) continue;
    const namen = n === 3 ? ['A', 'B', 'C'] : ['K', 'L', 'M', 'N'];
    return { v, fig, namen, antw: tekenAntw({ gegeven: [{ van: g, d: v, naam: 'v' }], vormen: [{ pts: fig, namen }],
      teken: fig.map((p, i) => ({ naam: `${namen[i]}${namen[i]}'`, d: v, van: p })), beeld: { pijlen: fig.map((_, i) => i), namen: namen.map(x => x + "'") } }) };
  }
}
const D9 = {
  nr: 9, titel: 'Vectoren en verschuivingen', kort: 'Alle punten van een figuur over dezelfde vector v verplaatsen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Definitie</div>
      <p>Verplaats je <b>alle</b> punten van een figuur over dezelfde vector $\\vec{v}$, dan voer je een <b>verschuiving</b> uit. Elk punt A gaat naar zijn beeldpunt A' met $\\overrightarrow{AA'} = \\vec{v}$.</p>
      <p>Werkwijze: teken vanuit elk hoekpunt de vector $\\vec{v}$ (tel de vakjes) en verbind de beeldpunten. Het beeld heeft dezelfde vorm, grootte en stand.</p>
      ${vfig({ h: 7, b: 13, vormen: [{ pts: [[1, 1], [4, 1], [2, 4]], namen: ['A', 'B', 'C'] }, { pts: [[8, 3], [11, 3], [9, 6]], namen: ["A'", "B'", "C'"] }], gegeven: [{ van: [1, 1], d: [7, 2], naam: 'v', kleur: OR }, { van: [4, 1], d: [7, 2], naam: '', kleur: OR }, { van: [2, 4], d: [7, 2], naam: '', kleur: OR }] })}</div>
    <div class="kader eig"><div class="kader-titel">Op de computer</div><p>Teken de pijlen $\\overrightarrow{AA'}$, $\\overrightarrow{BB'}$, … één voor één (kies telkens de juiste knop). Zodra alle pijlen er staan, verschijnt het beeld van de figuur.</p></div>${TEKENEN}`,
  voorbeelden: [
    { html: `Teken het beeld van driehoek ABC onder de verschuiving over $\\vec{v}$ (6 naar rechts en 2 omhoog).`,
      stappen: ['\\text{Vanuit A: 6 naar rechts en 2 omhoog. Zo vind je A\'.}', '\\text{Doe hetzelfde vanuit B en C: B\' en C\'.}',
        stapfig({ h: 7, b: 13, vormen: [{ pts: [[1, 1], [4, 1], [2, 4]], namen: ['A', 'B', 'C'] }, { pts: [[7, 3], [10, 3], [8, 6]], namen: ["A'", "B'", "C'"] }] }, [{ van: [1, 1], d: [6, 2], naam: 'v', kleur: OR }, { van: [4, 1], d: [6, 2], naam: '', kleur: OR }, { van: [2, 4], d: [6, 2], naam: '', kleur: OR }]),
        '\\text{Verbind A\', B\' en C\': dat is het beeld.}'] },
    { html: `Teken het beeld van vierhoek KLMN onder de verschuiving over $\\vec{v}$ (6 naar links en 3 omhoog).`,
      stappen: ['\\text{Vanuit K: 6 naar links en 3 omhoog: K\'.}', '\\text{Vanuit L, M en N: L\', M\' en N\'.}',
        stapfig({ h: 8, b: 13, vormen: [{ pts: [[8, 1], [11, 1], [11, 3], [9, 4]], namen: ['K', 'L', 'M', 'N'] }, { pts: [[2, 4], [5, 4], [5, 6], [3, 7]], namen: ["K'", "L'", "M'", "N'"] }] }, [{ van: [8, 1], d: [-6, 3], naam: 'v', kleur: OR }, { van: [11, 1], d: [-6, 3], naam: '', kleur: OR }, { van: [11, 3], d: [-6, 3], naam: '', kleur: OR }, { van: [9, 4], d: [-6, 3], naam: '', kleur: OR }]),
        '\\text{Controle: K\'L\'M\'N\' is even groot als KLMN.}'] },
  ],
  soorten: {
    drie: { naam: 'Driehoek verschuiven', gen() { const o = verschuiving(3); return { opdracht: "Teken het beeld van driehoek ABC: teken AA', BB' en CC' gelijk aan v.", html: `<p class="opgave-tekst">Teken het beeld van driehoek ABC onder de verschuiving over $\\vec{v}$: teken vanuit elk hoekpunt de vector $\\vec{v}$.</p>`, antw: o.antw, uitleg: [uitlegD('v', o.v), '\\text{Vanuit elk hoekpunt tel je dezelfde vakjes.}'] }; } },
    vier: { naam: 'Vierhoek verschuiven', gen() { const o = verschuiving(4); return { opdracht: "Teken het beeld van vierhoek KLMN: teken KK', LL', MM' en NN' gelijk aan v.", html: `<p class="opgave-tekst">Teken het beeld van vierhoek KLMN onder de verschuiving over $\\vec{v}$.</p>`, antw: o.antw, uitleg: [uitlegD('v', o.v)] }; } },
    begrip: { naam: 'Begrippen', gen() {
      return bankVraag([
        ['Bij een verschuiving over v …', ['verplaatsen alle punten zich over dezelfde vector v', 'draait de figuur rond een punt', 'wordt de figuur groter', 'verplaatst enkel één hoekpunt']],
        ['Het beeld van een figuur onder een verschuiving …', ['heeft dezelfde vorm en dezelfde grootte', 'is altijd groter', 'is gespiegeld', 'heeft een andere vorm']],
        ["Bij een verschuiving zijn de vectoren AA', BB' en CC' …", ['gelijke vectoren', 'tegengestelde vectoren', 'telkens de nulvector', 'verschillend van grootte']],
      ]);
    } },
  },
  oefenMix: [['drie', 2], ['vier', 1], ['begrip', 1]],
  test: [['drie', 5], ['vier', 2], ['begrip', 3]], testSchudden: true,
};

// ---- 10. Vectoren in context ------------------------------------------------------------
const TRIPEL = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]];
const grootteKeuze = (c, x, y, eenh) => { const opts = [c, x + y, Math.abs(x - y) || x + y + 1, Math.max(x, y) + 1].map(v => v * eenh.f).filter((v, i, A) => A.indexOf(v) === i).slice(0, 4); const s = schud(opts.map((o, i) => ({ o, i }))); return keuze(kT(s.map(z => `${z.o} ${eenh.t}`)), s.findIndex(z => z.i === 0)); };
const D10 = {
  nr: 10, titel: 'Vectoren in context', kort: 'Verplaatsing, krachten en snelheid samenstellen.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Vectoren in de fysica</div>
      <p>Een <b>verplaatsing</b>, een <b>kracht</b> en een <b>snelheid</b> hebben een grootte, een richting en een zin: het zijn vectoren. Kies eerst een <b>schaal</b>, bijvoorbeeld 1 vakje = 10 N.</p>
      <ul><li><b>Totale verplaatsing</b>: tel de verplaatsingen op met de kop-staartmethode.</li><li><b>Resulterende kracht</b> $\\vec{F} = \\vec{F_1} + \\vec{F_2}$: de krachten grijpen in hetzelfde punt aan, dus de parallellogrammethode.</li><li><b>Werkelijke snelheid</b>: de som van de snelheidsvectoren (bv. boot + stroming).</li></ul></div>
    <div class="kader eig"><div class="kader-titel">Grootte bepalen</div>
      <p>De grootte lees je af door de pijl te <b>meten</b> en de schaal te gebruiken. Liggen beide vectoren op één rechte, dan tel je gewoon (zelfde zin) of trek je af (tegengestelde zin).</p>
      ${vfig({ h: 5, b: 10, gegeven: [{ van: [1, 1], d: [4, 0], naam: 'F1', kleur: OR }, { van: [1, 1], d: [0, 3], naam: 'F2', kleur: BL }, { van: [1, 1], d: [4, 3], naam: 'F', kleur: GR }], lijnen: [{ van: [5, 1], naar: [5, 4], stippel: true }, { van: [1, 4], naar: [5, 4], stippel: true }] })}
      <p class="klein">1 vakje = 10 N: $\\vec{F}$ is 5 vakjes lang, dus 50 N.</p></div>${TEKENEN}`,
  voorbeelden: [
    { html: `Touwtrekken: ploeg 1 trekt met 50 N naar rechts, ploeg 2 met 30 N naar links. Wat is de resulterende kracht?`,
      stappen: ['\\text{Beide krachten liggen op één rechte, in tegengestelde zin: aftrekken.}', '50\\text{ N} - 30\\text{ N} = 20\\text{ N}', '\\text{De resulterende kracht is 20 N naar rechts: ploeg 1 wint.}'] },
    { html: `Een boot vaart met 4 m/s naar de overkant. Het water stroomt met 3 m/s naar rechts. Wat is de werkelijke snelheid? (1 vakje = 1 m/s)`,
      stappen: ['\\vec{v_1}\\text{: 4 vakjes omhoog. } \\vec{v_2}\\text{: 3 vakjes naar rechts.}', stapfig({ h: 6, b: 8, gegeven: [], lijnen: [{ van: [5, 1], naar: [5, 5], stippel: true }, { van: [2, 5], naar: [5, 5], stippel: true }] }, [{ van: [2, 1], d: [0, 4], naam: 'v1', kleur: OR }, { van: [2, 1], d: [3, 0], naam: 'v2', kleur: BL }, { van: [2, 1], d: [3, 4], naam: 'v', kleur: GR }]),
        '\\text{De diagonaal } \\vec{v} \\text{ is 5 vakjes lang: de boot vaart 5 m/s, schuin naar de overkant.}'] },
  ],
  soorten: {
    touw: { naam: 'Krachten op één rechte', gen() {
      const n1 = rnd(2, 8), n2 = rnd(1, 7), r = n1 - n2;
      const zinOpts = ['naar rechts', 'naar links', 'geen: de nulvector'], j = r > 0 ? 0 : r < 0 ? 1 : 2;
      return { opdracht: 'Bepaal de resulterende kracht.', html: `<p class="opgave-tekst">Bij touwtrekken trekt ploeg 1 met ${n1 * 10} N naar rechts en ploeg 2 met ${n2 * 10} N naar links. Bepaal de resulterende kracht.</p>`,
        antw: delen(['\\text{grootte (N)} =', getal(Math.abs(r) * 10)], ['\\text{zin:}', keuze(kT(zinOpts), j)]),
        uitleg: [`${n1 * 10}\\text{ N} - ${n2 * 10}\\text{ N} = ${r * 10}\\text{ N}`, r ? `\\text{De resulterende kracht wijst naar ${r > 0 ? 'rechts' : 'links'}.}` : '\\text{De krachten heffen elkaar op: } \\vec{F} + (-\\vec{F}) = \\vec{0}'] };
    } },
    kracht: { naam: 'Resulterende kracht tekenen', gen() {
      for (;;) {
        const [x, y, c] = kies(TRIPEL), sx = kies([1, -1]), sy = kies([1, -1]);
        const F1 = [sx * x, 0], F2 = [0, sy * y], F = som(F1, F2);
        const P = startVoor([[0, 0], F1, F2, F], 0); if (!P) continue;
        return { opdracht: 'Teken de resulterende kracht en bepaal haar grootte (1 vakje = 10 N).', html: `<p class="opgave-tekst">Op een kist in P werken $\\vec{F_1}$ (${x * 10} N) en $\\vec{F_2}$ (${y * 10} N). Teken de resulterende kracht $\\vec{F}$ vanuit P met de parallellogrammethode. Schaal: 1 vakje = 10 N.</p>`,
          antw: delen(['', tekenAntw({ punten: [{ p: P, naam: 'P' }], gegeven: [{ van: P, d: F1, naam: 'F1', kleur: '#b0590f' }, { van: P, d: F2, naam: 'F2', kleur: '#1c4e8a' }], teken: [{ naam: 'F', d: F, van: P }] })],
            ['\\text{grootte van } \\vec{F} =', grootteKeuze(c, x, y, { f: 10, t: 'N' })]),
          uitleg: [`\\vec{F}\\text{: ${woorden(F)}}`, `\\text{De pijl is ${c} vakjes lang, dus ${c * 10} N.}`] };
      }
    } },
    boot: { naam: 'Snelheid: boot en stroming', gen() {
      for (;;) {
        const [y, x, c] = kies(TRIPEL), sx = kies([1, -1]);
        const v1 = [0, y], v2 = [sx * x, 0], v = som(v1, v2);
        const P = startVoor([[0, 0], v1, v2, v], 0); if (!P) continue;
        return { opdracht: 'Teken de werkelijke snelheid en bepaal haar grootte (1 vakje = 1 m/s).', html: `<p class="opgave-tekst">Een boot vaart met ${y} m/s naar de overkant ($\\vec{v_1}$). Het water stroomt met ${x} m/s naar ${sx > 0 ? 'rechts' : 'links'} ($\\vec{v_2}$). Teken de werkelijke snelheid $\\vec{v}$ vanuit P. Schaal: 1 vakje = 1 m/s.</p>`,
          antw: delen(['', tekenAntw({ punten: [{ p: P, naam: 'P' }], gegeven: [{ van: P, d: v1, naam: 'v1', kleur: '#b0590f' }, { van: P, d: v2, naam: 'v2', kleur: '#1c4e8a' }], teken: [{ naam: 'v', d: v, van: P }] })],
            ['\\text{grootte van } \\vec{v} =', grootteKeuze(c, x, y, { f: 1, t: 'm/s' })]),
          uitleg: [`\\vec{v} = \\vec{v_1} + \\vec{v_2}\\text{: ${woorden(v)}}`, `\\text{De pijl is ${c} vakjes lang: ${c} m/s.}`] };
      }
    } },
    wind: { naam: 'Snelheid: mee- of tegenwind', gen() {
      const v1 = rnd(5, 9) * 100, w = rnd(1, 3) * 50, mee = kies([true, false]);
      return { opdracht: 'Bepaal de werkelijke snelheid.', html: `<p class="opgave-tekst">Een vliegtuig vliegt met ${v1} km/h naar het oosten. Er staat een ${mee ? 'meewind' : 'tegenwind'} van ${w} km/h (${mee ? 'naar het oosten' : 'naar het westen'}). Hoe snel vliegt het vliegtuig werkelijk?</p>`,
        antw: getal(mee ? v1 + w : v1 - w, '\\text{ km/h}'),
        uitleg: [mee ? '\\text{Zelfde zin: optellen.}' : '\\text{Tegengestelde zin: aftrekken.}', `${v1} ${mee ? '+' : '-'} ${w} = ${mee ? v1 + w : v1 - w}\\text{ km/h}`] };
    } },
    wandel: { naam: 'Totale verplaatsing tekenen', gen() {
      for (;;) {
        const n = kies([2, 3]), legs = [];
        for (let i = 0; i < n; i++) { const as = i % 2 === 0 ? 0 : 1, l = kies([-1, 1]) * rnd(2, 5); legs.push(as === 0 ? [l, 0] : [0, l]); }
        const tot = som(...legs); if (!tot[0] || !tot[1]) continue;
        const rel = [[0, 0]]; legs.forEach(d => rel.push(add(rel[rel.length - 1], d)));
        const S = startVoor(rel, 0); if (!S) continue;
        const tekst = legs.map(d => woorden(d)).join(', dan ');
        return { opdracht: 'Teken de totale verplaatsing vanuit S.', html: `<p class="opgave-tekst">Een robotje vertrekt in S en rijdt ${tekst}. Teken de <b>totale verplaatsing</b> vanuit S (1 vakje = 1 m).</p>`,
          antw: tekenAntw({ punten: [{ p: S, naam: 'S' }], teken: [{ naam: 'v', d: tot, van: S }] }),
          uitleg: [`\\text{Tel alles op: ${woorden(tot)}.}`, '\\text{De totale verplaatsing gaat van S rechtstreeks naar het eindpunt.}'] };
      }
    } },
  },
  oefenMix: [['touw', 1], ['kracht', 1], ['boot', 1], ['wind', 1], ['wandel', 1]],
  test: [['touw', 2], ['kracht', 2], ['boot', 2], ['wind', 2], ['wandel', 2]], testSchudden: true,
};

// ---- 11. Eindtest ----------------------------------------------------------------------
const D11 = {
  nr: 11, titel: 'Eindtest vectoren', kort: 'Alles door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komt alles door elkaar: vakjes tellen, gelijke en tegengestelde vectoren, de som (kop-staart en parallellogram), vermenigvuldigen met een getal, het verschil, combinaties, verschuivingen en vectoren in context. Herhaal gerust de theorie van een vorig deel.</p></div>${TEKENEN}`,
  voorbeelden: [],
  soorten: { te: mix(D1, 'tellen'), tg: mix(D2, 'tegen'), ks: mix(D4, 'ks'), pg: mix(D5, 'pg'), k: mix(D6, 'k'), vs: mix(D7, 'ab'), co: mix(D8, 'combi'), sch: mix(D9, 'drie'), kr: mix(D10, 'kracht'), wa: mix(D10, 'wandel') },
  oefenMix: [['te', 1], ['tg', 1], ['ks', 1], ['pg', 1], ['k', 1], ['vs', 1], ['co', 1], ['sch', 1], ['kr', 1], ['wa', 1]],
  test: [['te', 1], ['tg', 1], ['ks', 1], ['pg', 1], ['k', 1], ['vs', 1], ['co', 1], ['sch', 1], ['kr', 1], ['wa', 1]], testSchudden: false,
};

Leerpaden.registreer({
  code: 'vectoren', titel: 'Vectoren', ondertitel: 'Wiskunde · 4BW-MWW', klas: '4BW-MWW', drempel: 70,
  intro: `<p>Je leert wat een vector is en je <b>tekent zelf vectoren</b> in een rooster: natekenen, de tegengestelde vector, de som (kop-staart en parallellogram), een vector maal een getal, het verschil, combinaties en verschuivingen.
    Tot slot gebruik je vectoren bij verplaatsingen, krachten en snelheden. Lees de theorie, bekijk de voorbeelden stap voor stap, oefen zoveel je wil en maak dan de test. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [{ titel: 'A · Wat is een vector?', delen: [1, 2, 3] }, { titel: 'B · Bewerkingen met vectoren', delen: [4, 5, 6, 7, 8] }, { titel: 'C · Verschuivingen en context', delen: [9, 10] }, { titel: 'D · Eindtest', delen: [11] }],
  delen: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11],
});
