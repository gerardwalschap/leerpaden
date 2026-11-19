// ===================================================================
//  DEEL 8 — De stelling van Pythagoras
// ===================================================================
const DRIETALLEN = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41], [20, 21, 29], [12, 35, 37]];
function drietal() { const [a, b, c] = kies(DRIETALLEN), k = c <= 13 ? kies([1, 1, 2, 3]) : 1; return [a * k, b * k, c * k]; }
const sq = (x) => `${h(x)}^2`;
// rechthoekige driehoek met lengtes op de zijden; de gevraagde zijde krijgt een rode letter (a = schuine zijde, b en c = rechthoekszijden)
// z = { r1, r2, s } (rechthoekszijden en schuine zijde, als tekst); spiegel = rechte hoek rechts
function pyFiguur(z, spiegel = false) {
  const W0 = 300, X = (x) => spiegel ? W0 - x : x, anc = (a) => !spiegel ? a : a === 'start' ? 'end' : a === 'end' ? 'start' : a;
  const onb = (t) => /^[abcx]$/.test(t), kl = (t) => onb(t) ? '#b83a2e' : '#1c4e8a';
  const lab = (x, y, t, a) => `<text x="${X(x)}" y="${y}" font-size="16" font-weight="bold" text-anchor="${anc(a)}" fill="${kl(t)}" font-style="${onb(t) ? 'italic' : 'normal'}">${t}</text>`;
  return `<svg viewBox="0 0 ${W0} 140" width="${W0}" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rechthoekige driehoek">
    <path d="M${X(95)},15 L${X(95)},112 L${X(250)},112 Z" fill="#fff" stroke="#222" stroke-width="2"/>
    <path d="M${X(95)},100 L${X(107)},100 L${X(107)},112" fill="none" stroke="#222"/>
    ${lab(87, 69, z.r1, 'end')}${lab(172, 132, z.r2, 'middle')}${lab(180, 58, z.s, 'start')}</svg>`;
}
const NAMEN = [['Tom', 'Lisa'], ['Ines', 'Yusuf'], ['Lotte', 'Amir'], ['Noor', 'Milan'], ['Sara', 'Ruben'], ['Elif', 'Jonas']];

const DEEL8 = {
  nr: 8, titel: 'De stelling van Pythagoras', kort: 'Ontbrekende zijde, omgekeerde stelling, vraagstukken en afstand.',
  rekenmachine: true,
  opdracht: 'Bereken de ontbrekende zijde. Afspraak: $a$ is de schuine zijde, $b$ en $c$ zijn de rechthoekszijden. Rond af op 2 decimalen waar nodig.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">De stelling van Pythagoras</div>
      <div class="twee"><div class="figuur">${driehoekSVG({ a: 'c', b: 'b', c: 'a' })}</div>
        <div><p>In elke <b>rechthoekige driehoek</b> is het kwadraat van de <b class="rood">schuine zijde</b> (hypotenusa) gelijk aan de som van de kwadraten van de twee <b>rechthoekszijden</b> (catheten).</p>
        <p class="midden" style="font-size:20px">$a^2 = b^2 + c^2$</p>
        <p class="klein">$a$ = schuine zijde, de langste zijde, tegenover de rechte hoek &nbsp;·&nbsp; $b$ en $c$ = rechthoekszijden</p></div></div>
    </div>
    <div class="twee">
      <div class="kader eig"><div class="kader-titel">Schuine zijde gevraagd</div><p class="midden">$a = \\sqrt{b^2 + c^2}$</p><p class="midden klein">kwadraten <b>optellen</b></p></div>
      <div class="kader eig"><div class="kader-titel">Rechthoekszijde gevraagd</div><p class="midden">$b = \\sqrt{a^2 - c^2}$ &nbsp; of &nbsp; $c = \\sqrt{a^2 - b^2}$</p><p class="midden klein">kwadraten <b>aftrekken</b></p></div>
    </div>
    <div class="kader werk"><div class="kader-titel">Eerst kijken: welke zijde is gevraagd?</div>
      <p>Afspraak: $a$ is altijd de <b>schuine zijde</b>, $b$ en $c$ zijn de <b>rechthoekszijden</b>. Zoek in een figuur eerst de <b>rechte hoek</b>: de zijde <b>tegenover</b> de rechte hoek is de schuine zijde $a$.</p>
      <ul><li>Is de <b>schuine zijde</b> gevraagd? Dan ken je de twee rechthoekszijden: <b>optellen</b>.</li>
        <li>Is een <b>rechthoekszijde</b> gevraagd? Dan ken je de schuine zijde en de andere rechthoekszijde: <b>aftrekken</b> (groot kwadraat min klein kwadraat).</li></ul>
      <p class="klein">Rond pas op het einde af (2 decimalen). Controle: de schuine zijde is altijd de langste zijde.</p></div>
    <div class="kader">
      <table class="tabel"><tr><th>gegeven</th><th>berekening</th><th>antwoord</th></tr>
        <tr><td>$b = 3,\\ c = 4$</td><td>$a = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25}$</td><td>$a = 5$</td></tr>
        <tr><td>$a = 10,\\ c = 6$</td><td>$b = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = \\sqrt{64}$</td><td>$b = 8$</td></tr>
        <tr><td>$b = 7,\\ c = 7$</td><td>$a = \\sqrt{7^2 + 7^2} = \\sqrt{49 + 49} = \\sqrt{98}$</td><td>$a \\approx 9{,}90$</td></tr></table>
    </div>
    <div class="kader werk">
      <div class="kader-titel">De omgekeerde stelling</div>
      <p>Als $a^2 = b^2 + c^2$, dan is de driehoek <b>rechthoekig</b>. Zo controleer je of een driehoek rechthoekig is:</p>
      <ol><li>neem voor $a$ de <b>langste</b> zijde</li><li>bereken $a^2$ en $b^2 + c^2$</li><li>gelijk → rechthoekig. Niet gelijk → niet rechthoekig.</li></ol>
      <p>$3, 4, 5$: &nbsp; $5^2 = 25$ en $3^2 + 4^2 = 9 + 16 = 25$ → <span class="groen"><b>ja</b></span> &nbsp;·&nbsp; $5, 7, 9$: &nbsp; $9^2 = 81$ en $5^2 + 7^2 = 74$ → <span class="rood"><b>nee</b></span></p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Vraagstukken</div>
      <p>Maak een schets, zoek de rechthoekige driehoek en duid de schuine zijde aan. Schrijf je berekening en formuleer een antwoord.</p>
      <p>Een ladder van 5 m staat tegen een muur. De voet staat 2 m van de muur. Hoe hoog reikt de ladder?<br>
        Schuine zijde = ladder = 5 m: $h = \\sqrt{5^2 - 2^2} = \\sqrt{25 - 4} = \\sqrt{21} \\approx 4{,}58$. &nbsp; <b>Antwoord:</b> ongeveer 4,58 m.</p>
    </div>
    <div class="kader def">
      <div class="kader-titel">De afstandsformule</div>
      <p>De afstand $AB$ tussen $A(x_1, y_1)$ en $B(x_2, y_2)$:</p>
      <p class="midden" style="font-size:19px">$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$</p>
      <ul><li>$x_2 - x_1$ = de horizontale afstand</li><li>$y_2 - y_1$ = de verticale afstand</li><li>Je berekent dus de schuine zijde van een rechthoekige driehoek.</li></ul>
      <div class="twee"><div class="figuur">${rooster([-2, -1], [5, 3], ['A', 'B'], 6)}</div>
        <div><p>$A(-2, -1)$ en $B(5, 3)$<br>horizontaal: $5 - (-2) = 7$, verticaal: $3 - (-1) = 4$</p>
        <p>$AB = \\sqrt{(5+2)^2 + (3+1)^2} = \\sqrt{49 + 16} = \\sqrt{65} \\approx 8{,}06$</p></div></div>
    </div>`,
  voorbeelden: [
    { html: `Gegeven: de rechthoekszijden $b = 12$ en $c = 5$. Bereken de schuine zijde $a$.<div class="figuur">${pyFiguur({ r1: 'c = 5', r2: 'b = 12', s: 'a' })}</div>`, stappen: ['\\text{schuine zijde gevraagd: optellen}', 'a = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13'] },
    { html: `Gegeven: de schuine zijde $a = 13$ en de rechthoekszijde $b = 5$. Bereken de rechthoekszijde $c$.<div class="figuur">${pyFiguur({ r1: 'c', r2: 'b = 5', s: 'a = 13' }, true)}</div>`, stappen: ['\\text{rechthoekszijde gevraagd: aftrekken}', 'c = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12'] },
    { html: `Gegeven: de rechthoekszijden $b = 1$ en $c = 1$. Bereken de schuine zijde $a$.<div class="figuur">${pyFiguur({ r1: 'c = 1', r2: 'b = 1', s: 'a' }, true)}</div>`, stappen: ['\\text{schuine zijde gevraagd: optellen}', 'a = \\sqrt{1^2 + 1^2} = \\sqrt{2} \\approx 1{,}41'] },
    { tex: '8,\\ 15,\\ 17 \\text{ rechthoekig?}', stappen: ['8^2 + 15^2 = 64 + 225 = 289', '17^2 = 289', '\\text{gelijk: ja, rechthoekig}'] },
    { html: 'Een gelijkbenige driehoek heeft een basis van 10 cm en een hoogte van 12 cm. Hoe lang zijn de gelijke zijden?', stappen: ['\\text{De hoogte verdeelt de basis in twee: } 10 : 2 = 5', 'z = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13', '\\text{Antwoord: de gelijke zijden zijn 13 cm lang.}'] },
    { html: 'Een rechthoekige driehoek heeft een schuine zijde van 26 cm en één rechthoekszijde van 24 cm. Bereken de oppervlakte.', stappen: ['a = 26 \\text{ (schuine zijde)}, \\ b = 24', 'c = \\sqrt{26^2 - 24^2} = \\sqrt{676 - 576} = \\sqrt{100} = 10', '\\text{opp} = \\frac{b \\cdot c}{2} = \\frac{24 \\cdot 10}{2} = 120', '\\text{Antwoord: de oppervlakte is } 120 \\text{ cm}^2.'] },
    { tex: 'A(5, -2) \\text{ en } B(-4, -6)', stappen: ['AB = \\sqrt{(-4-5)^2 + (-6+2)^2}', '= \\sqrt{81 + 16} = \\sqrt{97}', '\\approx 9{,}85'] },
  ],
  soorten: {
    zijde: { naam: 'Ontbrekende zijde', gen() {
      for (;;) {
        let a, b, c;
        if (Math.random() < 0.45) [a, b, c] = drietal();
        else { a = Math.random() < 0.2 ? rnd(11, 99) / 10 : rnd(1, 20); b = rnd(1, 20); c = Math.sqrt(a * a + b * b); }
        const spiegel = Math.random() < 0.5, kl = (x) => kg(x);
        // afspraak: a = schuine zijde (S), b en c = rechthoekszijden (b onderaan, c verticaal in de figuur)
        if (Math.random() < 0.55) {
          // schuine zijde a gevraagd: b en c gegeven
          if (!Number.isInteger(+c.toFixed(9)) && !zekerRond(c, 2)) continue;
          const S = c, ex = Number.isInteger(+S.toFixed(9));
          const [rb, rc] = Math.random() < 0.5 ? [a, b] : [b, a];
          const zin = `Gegeven: b = ${kl(rb)} en c = ${kl(rc)}. Bereken de schuine zijde a.`;
          return { soort: 'zijde', html: `<div>Gegeven: de rechthoekszijden $b = ${tg(rb)}$ en $c = ${tg(rc)}$. Bereken de <b>schuine zijde</b> $a$.</div><div class="figuur">${pyFiguur({ r1: `c = ${kl(rc)}`, r2: `b = ${kl(rb)}`, s: 'a' }, spiegel)}</div>`,
            sleutel: `a|${rb}|${rc}`, rapport: zin, antw: getal(S, 2, { voor: ex ? 'a =' : 'a \\approx' }),
            uitleg: ['\\text{schuine zijde gevraagd: kwadraten optellen}', `a = \\sqrt{${sq(rb)} + ${sq(rc)}} = \\sqrt{${tg(+(rb * rb).toFixed(4))} + ${tg(+(rc * rc).toFixed(4))}} = \\sqrt{${tg(+(rb * rb + rc * rc).toFixed(4))}} ${ex ? '=' : '\\approx'} ${tg(S, 2)}`] };
        }
        // rechthoekszijde (b of c) gevraagd: a en de andere rechthoekszijde gegeven
        let S, G; if (Number.isInteger(+c.toFixed(9))) { S = Math.round(c); G = Math.random() < 0.5 ? a : b; } else { S = rnd(5, 25); G = rnd(1, S - 1); }
        const X = Math.sqrt(S * S - G * G); if (!Number.isInteger(+X.toFixed(9)) && !zekerRond(X, 2)) continue;
        const ex = Number.isInteger(+X.toFixed(9));
        const [gv, gl] = Math.random() < 0.5 ? ['b', 'c'] : ['c', 'b'];   // gv = gevraagde letter, gl = gegeven letter
        const fig = gv === 'c' ? { r1: 'c', r2: `b = ${kl(G)}`, s: `a = ${kl(S)}` } : { r1: `c = ${kl(G)}`, r2: 'b', s: `a = ${kl(S)}` };
        const zin = `Gegeven: a = ${kl(S)} en ${gl} = ${kl(G)}. Bereken de rechthoekszijde ${gv}.`;
        return { soort: 'zijde', html: `<div>Gegeven: de schuine zijde $a = ${tg(S)}$ en de rechthoekszijde $${gl} = ${tg(G)}$. Bereken de <b>rechthoekszijde</b> $${gv}$.</div><div class="figuur">${pyFiguur(fig, spiegel)}</div>`,
          sleutel: `${gv}|${S}|${G}`, rapport: zin, antw: getal(X, 2, { voor: ex ? `${gv} =` : `${gv} \\approx` }),
          uitleg: ['\\text{rechthoekszijde gevraagd: kwadraten aftrekken}', `${gv} = \\sqrt{${sq(S)} - ${sq(G)}} = \\sqrt{${tg(S * S)} - ${tg(+(G * G).toFixed(4))}} = \\sqrt{${tg(+(S * S - G * G).toFixed(4))}} ${ex ? '=' : '\\approx'} ${tg(X, 2)}`] };
      }
    } },
    rechthoekig: { naam: 'Is de driehoek rechthoekig?', gen() {
      let z, ja = Math.random() < 0.5;
      if (ja) z = drietal();
      else { do { z = drietal(); const i = rnd(0, 2); z[i] += kies([-1, 1, 2]); z.sort((p, q) => p - q); } while (z[0] * z[0] + z[1] * z[1] === z[2] * z[2] || z[0] + z[1] <= z[2]); if (Math.random() < 0.35) { do { z = [rnd(2, 9), rnd(3, 10), rnd(4, 12)].sort((p, q) => p - q); } while (z[0] * z[0] + z[1] * z[1] === z[2] * z[2] || z[0] + z[1] <= z[2]); } }
      const [a, b, c] = z, s = a * a + b * b;
      return { soort: 'rechthoekig', opdracht: 'Is de driehoek rechthoekig? Controleer met de omgekeerde stelling.', tex: `${a},\\ ${b},\\ ${c}`, antw: keuze(JANEE, s === c * c ? 'ja' : 'nee'),
        uitleg: [`${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${s} \\qquad ${c}^2 = ${c * c}`, s === c * c ? '\\text{gelijk: ja, rechthoekig}' : '\\text{niet gelijk: nee, niet rechthoekig}'] };
    } },
    vraagstuk: { naam: 'Vraagstukken', gen() {
      for (;;) {
        const t = kies(['ladder', 'vlieger', 'gelijkbenig', 'perceel', 'opp', 'tv']);
        let zin, w, na, uit;
        if (t === 'ladder') { const L = rnd(8, 16) / 2, v = rnd(2, 6) / 2; if (v >= L - 1) continue; w = Math.sqrt(L * L - v * v); na = '\\text{m}';
          zin = `Een ladder van ${kg(L)} m staat tegen een muur. De voet staat ${kg(v)} m van de muur. Hoe hoog reikt de ladder?`;
          uit = [`\\text{schuine zijde = ladder} = ${tg(L)}`, `h = \\sqrt{${sq(L)} - ${sq(v)}} = \\sqrt{${tg(L * L)} - ${tg(v * v)}} ${Number.isInteger(+w.toFixed(9)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'vlieger') { const L = rnd(4, 12) * 5, d = rnd(2, L / 5 - 1) * 5; w = Math.sqrt(L * L - d * d); na = '\\text{m}';
          zin = `Een vlieger hangt aan een strak touw van ${L} m. De vlieger hangt recht boven een punt dat ${d} m van jou verwijderd is. Hoe hoog hangt de vlieger? (Je mag de hoogte van je hand verwaarlozen.)`;
          uit = [`\\text{schuine zijde = touw} = ${L}`, `h = \\sqrt{${L}^2 - ${d}^2} = \\sqrt{${L * L} - ${d * d}} ${Number.isInteger(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'gelijkbenig') { const B = rnd(3, 12) * 2, hh = rnd(3, 15); w = Math.sqrt((B / 2) ** 2 + hh * hh); na = '\\text{cm}';
          zin = `Een gelijkbenige driehoek heeft een basis van ${B} cm en een hoogte van ${hh} cm. Hoe lang zijn de gelijke zijden?`;
          uit = [`\\text{de hoogte verdeelt de basis in twee: } ${B} : 2 = ${B / 2}`, `z = \\sqrt{${B / 2}^2 + ${hh}^2} = \\sqrt{${(B / 2) ** 2} + ${hh * hh}} ${Number.isInteger(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'perceel') { const p = rnd(5, 40), q = rnd(5, 60); w = Math.sqrt(p * p + q * q); na = '\\text{m}';
          zin = `Een rechthoekig perceel heeft zijden van ${p} m en ${q} m. Hoe lang is de diagonaal?`;
          uit = ['\\text{de diagonaal is de schuine zijde}', `d = \\sqrt{${p}^2 + ${q}^2} = \\sqrt{${p * p} + ${q * q}} ${Number.isInteger(w) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'opp') { const [a, b, c] = drietal(); w = a * b / 2; na = '\\text{cm}^2';
          zin = `Een rechthoekige driehoek heeft een schuine zijde van ${c} cm en één rechthoekszijde van ${b} cm. Bereken de oppervlakte van de driehoek.`;
          uit = [`a = ${c} \\text{ (schuine zijde)}, \\ b = ${b}`, `c = \\sqrt{${c}^2 - ${b}^2} = \\sqrt{${c * c} - ${b * b}} = ${a}`, `\\text{opp} = \\frac{b \\cdot c}{2} = \\frac{${b} \\cdot ${a}}{2} = ${tg(w)}`]; }
        if (t === 'tv') { const br = rnd(50, 140), ho = Math.round(br * kies([0.5625, 0.6, 0.75]) ); w = Math.sqrt(br * br + ho * ho); na = '\\text{cm}';
          zin = `Een rechthoekig scherm is ${br} cm breed en ${ho} cm hoog. Hoe lang is de diagonaal van het scherm?`;
          uit = ['\\text{de diagonaal is de schuine zijde}', `d = \\sqrt{${br}^2 + ${ho}^2} = \\sqrt{${br * br} + ${ho * ho}} \\approx ${tg(w, 2)}`]; }
        if (!Number.isInteger(+w.toFixed(9)) && !zekerRond(w, 2)) continue;
        uit.push(`\\text{Antwoord: } ${tg(w, 2)}\\ ${na}`);
        return { soort: 'vraagstuk', opdracht: 'Maak een schets op je kladblad en bereken. Rond af op 2 decimalen.', html: `<div class="tekstopgave">${W.esc(zin)}</div>`, rapport: zin, sleutel: zin,
          antw: getal(w, 2, { voor: '', na }), uitleg: uit };
      }
    } },
    afstand: { naam: 'Afstand tussen twee punten', gen() {
      for (;;) {
        const b = 6, P = [rnd(-b, b), rnd(-b, b)], Q = [rnd(-b, b), rnd(-b, b)];
        const dx = Q[0] - P[0], dy = Q[1] - P[1]; if (!dx || !dy) continue;
        const w = Math.sqrt(dx * dx + dy * dy); if (!Number.isInteger(+w.toFixed(9)) && !zekerRond(w, 2)) continue;
        const nm = kies([['A', 'B'], ['P', 'Q'], ['C', 'D'], ['E', 'F']]);
        const pt = (n, p) => `${n}(${tg(p[0])}, ${tg(p[1])})`;
        const ex = Number.isInteger(+w.toFixed(9));
        const metRooster = Math.random() < 0.4;
        const opg = `$${pt(nm[0], P)}$ en $${pt(nm[1], Q)}$`;
        return { soort: 'afstand', opdracht: `Bereken de afstand ${nm.join('')} met de afstandsformule. Rond af op 2 decimalen waar nodig.`,
          html: `<div>${opg}</div>${metRooster ? `<div class="figuur">${rooster(P, Q, nm, b)}</div>` : ''}`, sleutel: opg, rapport: `${nm[0]}(${P}) en ${nm[1]}(${Q})`.replace(/-/g, '−'),
          antw: getal(w, 2, { voor: `${nm.join('')} ${ex ? '=' : '\\approx'}` }),
          uitleg: [`${nm.join('')} = \\sqrt{(${tg(Q[0])} - ${h(P[0])})^2 + (${tg(Q[1])} - ${h(P[1])})^2} = \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${dx * dx + dy * dy}} ${ex ? '=' : '\\approx'} ${tg(w, 2)}`] };
      }
    } },
  },
  oefenMix: [['zijde', 3], ['rechthoekig', 2], ['vraagstuk', 2], ['afstand', 2]],
  test: [['zijde', 3], ['rechthoekig', 2], ['afstand', 3], ['vraagstuk', 2]],
};

// ===================================================================
//  DEEL 9 — Vergelijkingen
// ===================================================================
const term = (c, x = 'x', eerste = false) => { // c·x als TeX met teken
  const k = c === 1 ? x : c === -1 ? `-${x}` : `${c}${x}`;
  return eerste ? k : (c < 0 ? `- ${k.slice(1)}` : `+ ${k}`);
};
const cst = (c) => c === 0 ? '' : c < 0 ? ` - ${-c}` : ` + ${c}`;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const DEEL9 = {
  nr: 9, titel: 'Vergelijkingen', kort: 'Haakjes, noemers, evenredigheden, wortels en vraagstukken.',
  rekenmachine: null,
  opdracht: 'Los op en maak de proef.',
  theorie: `
    <div class="kader def">
      <div class="kader-titel">Regels</div>
      <ul><li>Beide leden mogen met <b>dezelfde eenterm</b> opgeteld of afgetrokken worden.</li>
        <li>Beide leden mogen met <b>hetzelfde getal ($\\neq 0$)</b> vermenigvuldigd of gedeeld worden.</li></ul>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Stappenplan</div>
      <ol><li>noemer wegwerken</li><li>wortel wegwerken</li><li>de lineaire vergelijking oplossen</li><li>de proef maken</li></ol>
      <p>Noteer de oplossing als $V = \\{\\ldots\\}$.</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Haakjes wegwerken</div>
      <p>Werk eerst de haakjes weg (distributiviteit), daarna los je op zoals gewoonlijk.</p>
      <p>$4(x - 1) + 3 = 15 \\;\\Leftrightarrow\\; 4x - 4 + 3 = 15 \\;\\Leftrightarrow\\; 4x = 16 \\;\\Leftrightarrow\\; x = 4$</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Noemer wegwerken</div>
      <p>Vermenigvuldig beide leden met de (gemeenschappelijke) noemer.</p>
      <p>$\\dfrac{x}{4} + 1 = 3 \\;\\Leftrightarrow\\; x + 4 = 12 \\;\\Leftrightarrow\\; x = 8$ &nbsp; <span class="klein">(beide leden maal 4)</span></p>
    </div>
    <div class="kader">
      <div class="kader-titel">Evenredigheid</div>
      <p>Het product van de uitersten is gelijk aan het product van de middelsten: $\\dfrac{a}{b} = \\dfrac{c}{d} \\;\\Leftrightarrow\\; a \\cdot d = b \\cdot c$</p>
      <p>$\\dfrac{5}{x} = \\dfrac{10}{6} \\;\\Leftrightarrow\\; 5 \\cdot 6 = 10x \\;\\Leftrightarrow\\; x = 3$</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Wortel wegwerken</div>
      <p>Werk de wortel weg door <b>beide leden te kwadrateren</b>. Maak zeker de proef.</p>
      <p>$\\sqrt{x + 5} = 3 \\;\\Leftrightarrow\\; x + 5 = 9 \\;\\Leftrightarrow\\; x = 4$ &nbsp; <span class="klein">proef: $\\sqrt{4 + 5} = \\sqrt{9} = 3$ ✓</span></p>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Vraagstukken</div>
      <p><b>Onbekende</b> – <b>vergelijking</b> – <b>oplossing</b> – <b>antwoord</b> – <b>controle</b>.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <p>Typ in het vakje tussen de accolades enkel de oplossing, bv. $V = \\{\\,\\boxed{-3}\\,\\}$: typ <code>-3</code>. Een breuk typ je als <code>5/2</code>.</p></div>`,
  voorbeelden: [
    { tex: '3x - 4 = 11', stappen: ['3x = 11 + 4 = 15', 'x = 5', '\\text{proef: } 3 \\cdot 5 - 4 = 11 \\;✓', 'V = \\{5\\}'] },
    { tex: '5x + 2 = 2x - 7', stappen: ['5x - 2x = -7 - 2', '3x = -9', 'x = -3', 'V = \\{-3\\}'] },
    { tex: '2(x + 3) = x + 10', stappen: ['2x + 6 = x + 10', 'x = 4', 'V = \\{4\\}'] },
    { tex: '\\dfrac{x}{2} + \\dfrac{x}{4} = 6', stappen: ['\\text{beide leden maal 4: } 2x + x = 24', '3x = 24', 'x = 8', 'V = \\{8\\}'] },
    { tex: '\\dfrac{3}{x + 1} = \\dfrac{6}{x + 4}', stappen: ['3(x + 4) = 6(x + 1)', '3x + 12 = 6x + 6', '-3x = -6 \\;\\Leftrightarrow\\; x = 2', 'V = \\{2\\}'] },
    { tex: '\\sqrt{2x + 7} = 5', stappen: ['\\text{kwadrateren: } 2x + 7 = 25', '2x = 18 \\;\\Leftrightarrow\\; x = 9', '\\text{proef: } \\sqrt{2 \\cdot 9 + 7} = \\sqrt{25} = 5 \\;✓', 'V = \\{9\\}'] },
    { html: 'Ines en Yusuf hebben samen € 60. Yusuf heeft € 12 meer dan Ines. Hoeveel heeft elk?', stappen: ['\\text{onbekende: Ines heeft } x \\text{ euro, Yusuf } x + 12', '\\text{vergelijking: } x + (x + 12) = 60', '2x = 48 \\;\\Leftrightarrow\\; x = 24', '\\text{antwoord: Ines heeft 24 euro, Yusuf 36 euro}', '\\text{controle: } 24 + 36 = 60 \\;✓'] },
  ],
  soorten: {
    lineair: { naam: 'Eenvoudige vergelijkingen', gen() {
      const x = nz(-10, 12), vorm = kies(['ax+b', 'ax+b', 'b-ax', 'beide']);
      let tex, stap;
      if (vorm === 'ax+b') { const a = nz(2, 9) * (Math.random() < 0.2 ? -1 : 1), b = nz(-20, 20); tex = `${term(a, 'x', true)}${cst(b)} = ${a * x + b}`; stap = [`${term(a, 'x', true)} = ${a * x + b} ${b < 0 ? '+' : '-'} ${Math.abs(b)} = ${a * x}`]; }
      else if (vorm === 'b-ax') { const a = rnd(2, 9), b = nz(1, 20); tex = `${b} - ${a}x = ${b - a * x}`; stap = [`-${a}x = ${b - a * x} - ${b} = ${-a * x}`]; }
      else { let a, c; do { a = rnd(2, 9); c = rnd(1, 8); } while (a === c); const b = nz(-12, 12), d = (a - c) * x + b; tex = `${term(a, 'x', true)}${cst(b)} = ${term(c, 'x', true)}${cst(d)}`; stap = [`${a}x - ${c === 1 ? '' : c}x = ${d}${b < 0 ? ` + ${-b}` : ` - ${b}`}`, `${a - c}x = ${d - b}`]; }
      return { soort: 'lineair', tex, antw: V(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    haakjes: { naam: 'Eerst de haakjes weg', gen() {
      const x = nz(-8, 10), vorm = kies(['a(x+b)+c', 'a(x+b)=cx+d', 'a(bx+c)-dx']);
      let tex, stap;
      if (vorm === 'a(x+b)+c') { const a = rnd(2, 6), b = nz(-6, 6), c = nz(-9, 9); tex = `${a}(x${cst(b)})${cst(c)} = ${a * (x + b) + c}`; stap = [`${a}x${cst(a * b)}${cst(c)} = ${a * (x + b) + c}`, `${a}x = ${a * x}`]; }
      else if (vorm === 'a(x+b)=cx+d') { let a, c; do { a = rnd(2, 6); c = rnd(1, 7); } while (a === c); const b = nz(-6, 6), d = a * (x + b) - c * x; tex = `${a}(x${cst(b)}) = ${term(c, 'x', true)}${cst(d)}`; stap = [`${a}x${cst(a * b)} = ${term(c, 'x', true)}${cst(d)}`, `${a - c}x = ${(a - c) * x}`]; }
      else { const a = rnd(2, 5), b = rnd(2, 4), c = nz(-5, 5); let d; do { d = rnd(1, 9); } while (d === a * b); const e = a * (b * x + c) - d * x; tex = `${a}(${b}x${cst(c)}) - ${d === 1 ? '' : d}x = ${e}`; stap = [`${a * b}x${cst(a * c)} - ${d === 1 ? '' : d}x = ${e}`, `${a * b - d}x = ${(a * b - d) * x}`]; }
      return { soort: 'haakjes', opdracht: 'Los op. Werk eerst de haakjes weg.', tex, antw: V(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    noemer: { naam: 'Eerst de noemer weg', gen() {
      const vorm = kies(['x/a+b', 'bx/a-c', 'x/a+x/b']);
      let tex, x, stap;
      if (vorm === 'x/a+b') { const a = rnd(2, 9), k = nz(-6, 8), b = nz(-9, 9); x = a * k; const r = k + b; tex = `\\dfrac{x}{${a}}${cst(b)} = ${r}`; stap = [`\\text{beide leden maal ${a}: } x${cst(a * b)} = ${a * r}`]; }
      else if (vorm === 'bx/a-c') { let a, b; do { a = rnd(2, 7); b = rnd(2, 7); } while (ggd(a, b) > 1); const k = nz(-5, 6), c = nz(-9, 9); x = a * k; const r = b * k - c; tex = `\\dfrac{${b}x}{${a}}${cst(-c)} = ${r}`; stap = [`\\text{beide leden maal ${a}: } ${b}x${cst(-a * c)} = ${a * r}`, `${b}x = ${a * r + a * c}`]; }
      else { let a, b; do { a = rnd(2, 6); b = rnd(2, 6); } while (a === b); const L = kgv(a, b), k = nz(-4, 5); x = L * k; const r = x / a + x / b; tex = `\\dfrac{x}{${a}} + \\dfrac{x}{${b}} = ${r}`; stap = [`\\text{beide leden maal ${L}: } ${L / a}x + ${L / b}x = ${L * r}`, `${L / a + L / b}x = ${L * r}`]; }
      return { soort: 'noemer', opdracht: 'Los op. Werk eerst de noemer weg.', tex, antw: V(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    evenredigheid: { naam: 'Evenredigheden', gen() {
      for (;;) {
        if (Math.random() < 0.5) { // a/x = b/c
          const x = rnd(1, 12), b = rnd(2, 12), c = rnd(2, 12); const a = b * x / c; if (!Number.isInteger(a) || a < 1 || a > 40) continue;
          return { soort: 'evenredigheid', opdracht: 'Los de evenredigheid op.', tex: `\\dfrac{${a}}{x} = \\dfrac{${b}}{${c}}`, antw: V(x), uitleg: [`${a} \\cdot ${c} = ${b} \\cdot x`, `${a * c} = ${b}x`, `x = ${x}`, `V = \\{${x}\\}`] };
        }
        const a = rnd(2, 9), b = rnd(2, 9); if (a === b) continue;
        const p = nz(-5, 5), q = nz(-5, 5); if (p === q) continue;
        const x = (b * p - a * q) / (a - b); if (!Number.isInteger(x) || x + p === 0 || x + q === 0 || Math.abs(x) > 20) continue;
        const tex = `\\dfrac{${a}}{x${cst(p)}} = \\dfrac{${b}}{x${cst(q)}}`;
        return { soort: 'evenredigheid', opdracht: 'Los de evenredigheid op.', tex, antw: V(x),
          uitleg: [`${a}(x${cst(q)}) = ${b}(x${cst(p)})`, `${a}x${cst(a * q)} = ${b}x${cst(b * p)}`, `${term(a - b, 'x', true)} = ${b * p - a * q}`, `x = ${x}`, `V = \\{${x}\\}`] };
      }
    } },
    wortel: { naam: 'Eerst de wortel weg', gen() {
      for (;;) {
        const c = rnd(2, 9), a = nz(-4, 5), x = nz(-8, 12), b = c * c - a * x;
        if (Math.abs(b) > 60) continue;
        const binnen = `${term(a, 'x', true)}${cst(b)}`;
        return { soort: 'wortel', opdracht: 'Los op. Werk eerst de wortel weg door beide leden te kwadrateren. Maak de proef.', tex: `\\sqrt{${binnen}} = ${c}`, antw: V(x),
          uitleg: [`\\text{kwadrateren: } ${binnen} = ${c * c}`, `${term(a, 'x', true)} = ${c * c - b}`, `x = ${x}`, `\\text{proef: } \\sqrt{${a === 1 ? '' : a === -1 ? '-' : a + ' \\cdot '}${h(x)}${cst(b)}} = \\sqrt{${c * c}} = ${c} \\;✓`, `V = \\{${x}\\}`] };
      }
    } },
    vraagstuk: { naam: 'Vraagstukken', gen() {
      if (Math.random() < 0.55) {
        const [p, q] = kies(NAMEN), x = rnd(5, 60), d = rnd(2, 30), S = 2 * x + d;
        const zin = `${p} en ${q} hebben samen € ${S}. ${q} heeft € ${d} meer dan ${p}. Hoeveel heeft elk?`;
        return { soort: 'vraagstuk', opdracht: 'Los het vraagstuk op met een vergelijking.', html: `<div class="tekstopgave">${zin}</div>`, rapport: zin, sleutel: zin,
          antw: { soort: 'delen', delen: [{ label: `\\text{${p}}`, antw: getal(x, null, { voor: '', na: '\\text{euro}' }) }, { label: `\\text{${q}}`, antw: getal(x + d, null, { voor: '', na: '\\text{euro}' }) }] },
          uitleg: [`\\text{onbekende: ${p} heeft } x \\text{ euro, ${q} heeft } x + ${d}`, `x + (x + ${d}) = ${S}`, `2x = ${S - d} \\;\\Leftrightarrow\\; x = ${x}`, `\\text{antwoord: ${p} heeft ${x} euro, ${q} heeft ${x + d} euro}`, `\\text{controle: } ${x} + ${x + d} = ${S} \\;✓`] };
      }
      const n = rnd(5, 60), S = 3 * n + 3;
      const zin = `De som van drie opeenvolgende natuurlijke getallen is ${S}. Welke getallen zijn het?`;
      return { soort: 'vraagstuk', opdracht: 'Los het vraagstuk op met een vergelijking.', html: `<div class="tekstopgave">${zin}</div>`, rapport: zin, sleutel: zin,
        antw: { soort: 'vakjes', sjabloon: [{ veld: 0 }, { tex: ',' }, { veld: 1 }, { tex: '\\text{ en }' }, { veld: 2 }], velden: [veldE(`${n}`), veldE(`${n + 1}`), veldE(`${n + 2}`)] },
        uitleg: [`\\text{onbekende: de getallen zijn } x,\\ x + 1 \\text{ en } x + 2`, `x + (x + 1) + (x + 2) = ${S}`, `3x + 3 = ${S} \\;\\Leftrightarrow\\; 3x = ${S - 3} \\;\\Leftrightarrow\\; x = ${n}`, `\\text{antwoord: } ${n},\\ ${n + 1} \\text{ en } ${n + 2}`, `\\text{controle: } ${n} + ${n + 1} + ${n + 2} = ${S} \\;✓`] };
    } },
  },
  oefenMix: [['lineair', 2], ['haakjes', 2], ['noemer', 2], ['evenredigheid', 2], ['wortel', 2], ['vraagstuk', 1]],
  test: [['lineair', 2], ['haakjes', 2], ['noemer', 2], ['evenredigheid', 1], ['wortel', 2], ['vraagstuk', 1]],
};

// ===================================================================
//  DEEL 10 — Omvormen van formules
// ===================================================================
const FORMULES = [
  { f: 'v = \\dfrac{s}{t}', vars: ['v', 's', 't'], doelen: { s: ['v*t', 'v \\cdot t'], t: ['s/v', '\\dfrac{s}{v}'] } },
  { f: 'P = \\dfrac{F}{A}', vars: ['P', 'F', 'A'], doelen: { F: ['P*A', 'P \\cdot A'], A: ['F/P', '\\dfrac{F}{P}'] } },
  { f: '\\rho = \\dfrac{m}{V}', vars: ['ρ', 'm', 'V'], doelen: { m: ['ρ*V', '\\rho \\cdot V'], V: ['m/ρ', '\\dfrac{m}{\\rho}'] } },
  { f: 'O = 4z', vars: ['O', 'z'], doelen: { z: ['O/4', '\\dfrac{O}{4}'] } },
  { f: 'A = z^2', vars: ['A', 'z'], doelen: { z: ['√A', '\\sqrt{A}'] } },
  { f: 'V = z^3', vars: ['V', 'z'], doelen: { z: ['∛V', '\\sqrt[3]{V}'] } },
  { f: 'O = 2b + 2l', vars: ['O', 'b', 'l'], doelen: { l: ['(O-2b)/2', '\\dfrac{O - 2b}{2}'], b: ['(O-2l)/2', '\\dfrac{O - 2l}{2}'] } },
  { f: 'A = \\dfrac{b \\cdot h}{2}', vars: ['A', 'b', 'h'], doelen: { h: ['2A/b', '\\dfrac{2A}{b}'], b: ['2A/h', '\\dfrac{2A}{h}'] } },
  { f: 'O = 2 \\cdot r \\cdot \\pi', vars: ['O', 'r'], doelen: { r: ['O/(2π)', '\\dfrac{O}{2\\pi}'] } },
  { f: 'A = r^2 \\cdot \\pi', vars: ['A', 'r'], doelen: { r: ['√(A/π)', '\\sqrt{\\dfrac{A}{\\pi}}'] } },
  { f: 'F = m \\cdot g', vars: ['F', 'm', 'g'], doelen: { m: ['F/g', '\\dfrac{F}{g}'], g: ['F/m', '\\dfrac{F}{m}'] } },
];
const DEEL10 = {
  nr: 10, titel: 'Omvormen van formules', kort: 'Een formule omvormen naar een gevraagde grootheid, toepassingen.',
  rekenmachine: true,
  opdracht: 'Vorm om naar de gevraagde grootheid.',
  theorie: `
    <div class="kader werk">
      <div class="kader-titel">Methode</div>
      <ol><li>Staat de gevraagde grootheid in het rechterlid? Verwissel dan de leden.</li>
        <li>Duid de grootheid aan waarnaar je omvormt.</li>
        <li>Pas de regels toe van het oplossen van vergelijkingen.</li></ol>
      <p>Voorbeeld: $F = m \\cdot g \\;\\rightarrow\\; m = \\dfrac{F}{g}$ &nbsp; <span class="klein">(beide leden delen door $g$, daarna de leden verwisselen)</span></p>
    </div>
    <div class="kader">
      <div class="kader-titel">Nog enkele voorbeelden</div>
      <table class="tabel"><tr><th>formule</th><th>gevraagd</th><th>omgevormd</th></tr>
        <tr><td>$\\rho = \\dfrac{m}{V}$</td><td>$V$</td><td>$\\rho \\cdot V = m \\;\\rightarrow\\; V = \\dfrac{m}{\\rho}$</td></tr>
        <tr><td>$A = \\dfrac{b \\cdot h}{2}$</td><td>$b$</td><td>$2A = b \\cdot h \\;\\rightarrow\\; b = \\dfrac{2A}{h}$</td></tr>
        <tr><td>$O = 2b + 2l$</td><td>$b$</td><td>$O - 2l = 2b \\;\\rightarrow\\; b = \\dfrac{O - 2l}{2}$</td></tr>
        <tr><td>$A = z^2$</td><td>$z$</td><td>$z = \\sqrt{A}$ &nbsp; <span class="klein">(de wortel heft het kwadraat op)</span></td></tr></table>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Toepassingen</div>
      <p><b>Gegevens</b> – <b>gevraagd</b> – <b>formule</b> – <b>omgevormde formule</b> – <b>antwoord</b>. Rond af op 2 decimalen waar nodig.</p>
      <p>Een vierkant heeft een oppervlakte van 30,25 cm². Hoe lang is een zijde?<br>
        $A = z^2 \\;\\rightarrow\\; z = \\sqrt{A} = \\sqrt{30{,}25} = 5{,}5$ &nbsp; <b>Antwoord:</b> een zijde is 5,5 cm.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$\\dfrac{F}{g}$</td><td><code>F/g</code></td></tr>
        <tr><td>$\\dfrac{2A}{h}$</td><td><code>2A/h</code></td></tr>
        <tr><td>$\\dfrac{O - 2l}{2}$</td><td><code>(O-2l)/2</code> &nbsp;(haakjes rond de teller!)</td></tr>
        <tr><td>$\\dfrac{O}{2\\pi}$</td><td><code>O/(2π)</code> &nbsp;(haakjes rond de noemer!)</td></tr>
        <tr><td>$\\sqrt{\\dfrac{A}{\\pi}}$</td><td><code>√(A/π)</code></td></tr></table>
      <p class="klein">Let op hoofdletters: $A$ en $a$, $V$ en $v$ zijn verschillende grootheden. $O$ is de letter O, geen nul. Gebruik de knoppen π en ρ.</p></div>`,
  voorbeelden: [
    { tex: 'F = m \\cdot g \\qquad g = \\,?', stappen: ['m \\cdot g = F \\quad \\text{(leden verwisselen)}', 'g = \\dfrac{F}{m} \\quad \\text{(beide leden delen door } m)'] },
    { tex: '\\rho = \\dfrac{m}{V} \\qquad V = \\,?', stappen: ['\\rho \\cdot V = m \\quad \\text{(beide leden maal } V)', 'V = \\dfrac{m}{\\rho} \\quad \\text{(beide leden delen door } \\rho)'] },
    { tex: 'O = 2b + 2l \\qquad b = \\,?', stappen: ['2b + 2l = O', '2b = O - 2l', 'b = \\dfrac{O - 2l}{2}'] },
    { tex: 'A = \\dfrac{b \\cdot h}{2} \\qquad b = \\,?', stappen: ['\\dfrac{b \\cdot h}{2} = A', 'b \\cdot h = 2A', 'b = \\dfrac{2A}{h}'] },
    { html: 'Een kubus heeft een volume van 64 cm³. Hoe lang is een ribbe?', stappen: ['V = z^3 \\;\\rightarrow\\; z = \\sqrt[3]{V}', 'z = \\sqrt[3]{64} = 4', '\\text{Antwoord: een ribbe is 4 cm.}'] },
  ],
  soorten: {
    omvormen: { naam: 'Formule omvormen', gen() {
      const f = kies(FORMULES), doel = kies(Object.keys(f.doelen)), [e, t] = f.doelen[doel];
      return { soort: 'omvormen', opdracht: 'Vorm om naar de gevraagde grootheid.', tex: `${f.f} \\qquad ${doel === 'ρ' ? '\\rho' : doel} = \\,?`, sleutel: f.f + doel,
        antw: { soort: 'formule', expr: e, doel, vars: f.vars, tex: t }, uitleg: [`${doel} = ${t}`] };
    } },
    toepassing: { naam: 'Toepassingen', gen() {
      for (;;) {
        const t = kies(['fiets', 'druk', 'ijzer', 'vierkant', 'cirkel', 'kubus']);
        let zin, w, na, uit;
        if (t === 'fiets') { const v = rnd(12, 30), s = rnd(10, 120); w = s / v; na = '\\text{u}'; zin = `Een fietser legt ${s} km af aan ${v} km/u. Hoe lang is hij onderweg (in uur)?`; uit = [`v = \\dfrac{s}{t} \\;\\rightarrow\\; t = \\dfrac{s}{v}`, `t = \\dfrac{${s}}{${v}} ${Number.isInteger(+(w * 100).toFixed(6)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'druk') { const F = rnd(1, 40) * 50, P = rnd(2, 40) * 100; w = F / P; na = '\\text{m}^2'; zin = `Een kracht van ${F} N zorgt voor een druk van ${P} Pa. Hoe groot is de oppervlakte (in m²)?`; uit = [`P = \\dfrac{F}{A} \\;\\rightarrow\\; A = \\dfrac{F}{P}`, `A = \\dfrac{${F}}{${P}} ${Number.isInteger(+(w * 100).toFixed(6)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'ijzer') { const [stof, rho] = kies([['ijzer', 7.87], ['aluminium', 2.7], ['koper', 8.96], ['goud', 19.3]]); const m = rnd(100, 2000) / 2; w = m / rho; na = '\\text{cm}^3';
          zin = `Een blokje ${stof} heeft een massa van ${kg(m)} g. De massadichtheid van ${stof} is ${kg(rho)} g/cm³. Bereken het volume.`; uit = [`\\rho = \\dfrac{m}{V} \\;\\rightarrow\\; V = \\dfrac{m}{\\rho}`, `V = \\dfrac{${tg(m)}}{${tg(rho)}} \\approx ${tg(w, 2)}`]; }
        if (t === 'vierkant') { const z = Math.random() < 0.5 ? rnd(11, 150) / 2 : rnd(3, 25); const A = Math.random() < 0.5 ? +(z * z).toFixed(2) : rnd(10, 400); w = Math.sqrt(A); na = '\\text{cm}';
          zin = `Een vierkant heeft een oppervlakte van ${kg(A)} cm². Hoe lang is een zijde?`; uit = [`A = z^2 \\;\\rightarrow\\; z = \\sqrt{A}`, `z = \\sqrt{${tg(A)}} ${Number.isInteger(+(w * 100).toFixed(6)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (t === 'cirkel') { const O = rnd(10, 150); w = O / (2 * Math.PI); na = '\\text{cm}'; zin = `Een cirkel heeft een omtrek van ${O} cm. Bereken de straal.`; uit = [`O = 2 \\cdot r \\cdot \\pi \\;\\rightarrow\\; r = \\dfrac{O}{2\\pi}`, `r = \\dfrac{${O}}{2\\pi} \\approx ${tg(w, 2)}`]; }
        if (t === 'kubus') { const z = rnd(2, 12), exact = Math.random() < 0.5; const Vv = exact ? z ** 3 : rnd(10, 1500); w = Math.cbrt(Vv); na = '\\text{cm}'; zin = `Een kubus heeft een volume van ${Vv} cm³. Hoe lang is een ribbe?`; uit = [`V = z^3 \\;\\rightarrow\\; z = \\sqrt[3]{V}`, `z = \\sqrt[3]{${Vv}} ${Number.isInteger(+w.toFixed(9)) ? '=' : '\\approx'} ${tg(w, 2)}`]; }
        if (!Number.isInteger(+(w * 100).toFixed(6)) && !zekerRond(w, 2)) continue;
        if (w < 0.01) continue;
        uit.push(`\\text{Antwoord: } ${tg(w, 2)}\\ ${na}`);
        return { soort: 'toepassing', opdracht: 'Gegevens – gevraagd – formule – omgevormde formule – antwoord. Rond af op 2 decimalen waar nodig.', html: `<div class="tekstopgave">${zin}</div>`, rapport: zin, sleutel: zin,
          antw: getal(w, 2, { voor: '', na }), uitleg: uit };
      }
    } },
  },
  oefenMix: [['omvormen', 3], ['toepassing', 2]],
  test: [['omvormen', 6], ['toepassing', 4]],
};

// ===================================================================
//  Registratie
// ===================================================================
Leerpaden.registreer({
  code: 'reele-getallen',
  titel: 'Rekenen in ℝ',
  ondertitel: 'Zelfstudie · 7VJHO',
  klas: '7VJHO',
  soort: 'zelfstudie',
  afspraken: `<div class="kader eig"><div class="kader-titel">Afspraak: afronden</div>
    <p>Bij elke vraag staat naast het invulvak op hoeveel decimalen je afrondt, bv. <span class="afrond-voorbeeld">rond af op 2 decimalen</span>.</p>
    <ul>
      <li>Komt de uitkomst <b>exact</b> uit (bv. $6$ of $2{,}5$)? Dan schrijf je ze gewoon zo, zonder extra nullen.</li>
      <li>Rond pas <b>op het einde</b> af. Noteer tussenresultaten met minstens 2 decimalen meer dan gevraagd.</li>
      <li>Staat er geen afronding bij? Dan is het antwoord exact (een geheel getal, een breuk of een wortelvorm).</li>
    </ul></div>`,
  groepen: [
    { titel: 'A · Reële getallen en bewerkingen', delen: [1, 2, 3] },
    { titel: 'B · Intervallen', delen: [4] },
    { titel: 'C · Machten en logaritmen', delen: [5, 6, 7] },
    { titel: 'D · Pythagoras, vergelijkingen en formules', delen: [8, 9, 10] },
  ],
  delen: [DEEL1, DEEL2, DEEL3, DEEL4, DEEL5, DEEL6, DEEL7, DEEL8, DEEL9, DEEL10],
});
