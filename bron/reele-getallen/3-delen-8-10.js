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
        <div><p>$A(-2, -1)$ en $B(5, 3)$<br>$x_1 = -2,\\ y_1 = -1,\\ x_2 = 5,\\ y_2 = 3$</p>
        <p>$AB = \\sqrt{(5-(-2))^2 + (3-(-1))^2}$<br>$\\phantom{AB} = \\sqrt{7^2 + 4^2} = \\sqrt{49 + 16} = \\sqrt{65} \\approx 8{,}06$</p></div></div>
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
// ---- uitdagend: exacte oplossingen (ook breuken) en V = ∅, stap voor stap in beide leden
const fr9 = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = ggd(Math.abs(p), q) || 1; return { p: p / g, q: q / g }; };
const frTex = ({ p, q }) => q === 1 ? `${p}` : `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
const frH = (f) => f.p < 0 ? `\\left(${frTex(f)}\\right)` : frTex(f);
const V9 = (f) => ({ soort: 'V', waarde: f.p / f.q, exact: true, tex: frTex(f), metSpeciaal: 'leeg' });
const Vg = (x) => V9(fr9(x, 1));
const V9leeg = () => ({ soort: 'V', speciaal: 'leeg', metSpeciaal: 'leeg' });
const xs = (k) => k === 1 ? 'x' : `${k}x`;
// a·x + b (a = 0 → enkel b; nul = true → 0x + b)
const lin9 = (a, b, nul = false) => a === 0 ? (nul ? `0x${cst(b)}` : `${b}`) : `${term(a, 'x', true)}${cst(b)}`;
// − (a·x + b) uitgewerkt, met teken ervoor
const minLin = (a, b) => `${a === 0 ? '' : ' ' + term(-a, 'x', false)}${cst(-b)}`;
const tekenOp = (c) => c < 0 ? '+' : '-';
// Los A·x + B = C·x + D op, telkens dezelfde bewerking in beide leden.
// Zet de lijnen in L; proef(f) geeft eventueel een proeflijn. Geeft het antwoord terug.
function losOp(A, B, C, D, L, proef = null) {
  if (C !== 0) {
    L.push(`${lin9(A, B)} ${tekenOp(C)} ${xs(Math.abs(C))} = ${lin9(C, D)} ${tekenOp(C)} ${xs(Math.abs(C))}`);
    A -= C; C = 0;
    L.push(`${lin9(A, B, true)} = ${D}`);
  }
  if (B !== 0) {
    L.push(`${lin9(A, B, true)} ${tekenOp(B)} ${Math.abs(B)} = ${D} ${tekenOp(B)} ${Math.abs(B)}`);
    D -= B; B = 0;
    L.push(`${A === 0 ? '0x' : term(A, 'x', true)} = ${D}`);
  }
  if (A === 0) {
    L.push(`\\text{Geen enkel getal maal 0 geeft } ${D}\\text{: er is geen oplossing.}`);
    L.push('V = \\varnothing');
    return V9leeg();
  }
  if (A !== 1) L.push(`\\frac{${term(A, 'x', true)}}{${A}} = \\frac{${D}}{${A}}`);
  const f = fr9(D, A);
  L.push(`x = ${frTex(f)}`);
  if (proef) L.push(proef(f));
  L.push(f.q === 1 ? `V = \\{${frTex(f)}\\}` : `V = \\left\\{${frTex(f)}\\right\\}`);
  return V9(f);
}
const klein = (f, q = 6, m = 20) => f.q <= q && Math.abs(f.p / f.q) <= m;
const DEEL9 = {
  nr: 9, titel: 'Vergelijkingen', kort: 'Haakjes, noemers, evenredigheden en wortels.',
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
    <div class="kader">
      <div class="kader-titel">Minteken voor de haakjes</div>
      <p>Een minteken voor de haakjes verandert het teken van <b>elke</b> term tussen de haakjes.</p>
      <p>$-(2x - 3) = -2x + 3 \\qquad 5 - 2(x + 4) = 5 - 2x - 8$</p>
    </div>
    <div class="kader">
      <div class="kader-titel">Een tweeterm in de teller</div>
      <p>Zet de teller tussen haakjes als je met de noemer vermenigvuldigt, zeker als er een minteken voor de breuk staat.</p>
      <p>$\\dfrac{x + 1}{3} - \\dfrac{x - 2}{4} = 1 \\;\\Leftrightarrow\\; 4(x + 1) - 3(x - 2) = 12$ &nbsp; <span class="klein">(beide leden maal 12)</span></p>
    </div>
    <div class="kader eig">
      <div class="kader-titel">Geen oplossing: $V = \\varnothing$</div>
      <p>Soms is er <b>geen enkel getal</b> dat voldoet. Dan is de oplossingenverzameling leeg: $V = \\varnothing$.</p>
      <ul><li>De $x$ valt weg en je krijgt iets dat nooit klopt: $2(x + 3) = 2x + 1 \\;\\Leftrightarrow\\; 2x + 6 = 2x + 1 \\;\\Leftrightarrow\\; 0x = -5$. Geen enkel getal maal 0 geeft $-5$.</li>
        <li>Een vierkantswortel is <b>nooit negatief</b>: $\\sqrt{x + 3} + 7 = 5 \\;\\Leftrightarrow\\; \\sqrt{x + 3} = -2$. Dat kan niet.</li></ul>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <p>Typ in het vakje tussen de accolades enkel de oplossing, bv. $V = \\{\\,\\boxed{-3}\\,\\}$: typ <code>-3</code>.</p>
      <p>Is de oplossing geen geheel getal? Geef dan de <b>exacte</b> oplossing als vereenvoudigde breuk: typ <code>7/3</code> of <code>-5/2</code> (geen afgerond kommagetal).</p>
      <p>Is er geen oplossing? Klik dan op de knop $V = \\varnothing$.</p></div>`,
  voorbeelden: [
    { tex: '3x - 4 = 11', stappen: ['3x = 11 + 4 = 15', 'x = 5', '\\text{proef: } 3 \\cdot 5 - 4 = 11 \\;✓', 'V = \\{5\\}'] },
    { tex: '5x + 2 = 2x - 7', stappen: ['5x - 2x = -7 - 2', '3x = -9', 'x = -3', 'V = \\{-3\\}'] },
    { tex: '2(x + 3) = x + 10', stappen: ['2x + 6 = x + 10', 'x = 4', 'V = \\{4\\}'] },
    { tex: '\\dfrac{x}{2} + \\dfrac{x}{4} = 6', stappen: ['\\text{beide leden maal 4: } 2x + x = 24', '3x = 24', 'x = 8', 'V = \\{8\\}'] },
    { tex: '\\dfrac{3}{x + 1} = \\dfrac{6}{x + 4}', stappen: ['3(x + 4) = 6(x + 1)', '3x + 12 = 6x + 6', '-3x = -6 \\;\\Leftrightarrow\\; x = 2', 'V = \\{2\\}'] },
    { tex: '\\sqrt{2x + 7} = 5', stappen: ['\\text{kwadrateren: } 2x + 7 = 25', '2x = 18 \\;\\Leftrightarrow\\; x = 9', '\\text{proef: } \\sqrt{2 \\cdot 9 + 7} = \\sqrt{25} = 5 \\;✓', 'V = \\{9\\}'] },
    { tex: '3(2x - 1) - (x + 4) = 2(x - 5)', stappen: ['\\text{haakjes wegwerken: } 6x - 3 - x - 4 = 2x - 10', '5x - 7 = 2x - 10', '5x - 7 - 2x = 2x - 10 - 2x', '3x - 7 = -10', '3x - 7 + 7 = -10 + 7', '3x = -3', '\\frac{3x}{3} = \\frac{-3}{3}', 'x = -1', 'V = \\{-1\\}'] },
    { tex: '\\dfrac{x + 1}{3} - \\dfrac{x - 2}{4} = 1', stappen: ['\\text{beide leden maal 12: } 4(x + 1) - 3(x - 2) = 12', '4x + 4 - 3x + 6 = 12', 'x + 10 = 12', 'x + 10 - 10 = 12 - 10', 'x = 2', 'V = \\{2\\}'] },
    { tex: '4x + 1 = x + 8', stappen: ['4x + 1 - x = x + 8 - x', '3x + 1 = 8', '3x + 1 - 1 = 8 - 1', '3x = 7', '\\frac{3x}{3} = \\frac{7}{3}', 'x = \\frac{7}{3}', 'V = \\left\\{\\frac{7}{3}\\right\\}'] },
    { tex: '\\sqrt{x + 3} + 7 = 5', stappen: ['\\sqrt{x + 3} + 7 - 7 = 5 - 7', '\\sqrt{x + 3} = -2', '\\text{Een vierkantswortel is nooit negatief: er is geen oplossing.}', 'V = \\varnothing'] },
  ],
  soorten: {
    lineair: { naam: 'Eenvoudige vergelijkingen', gen() {
      const x = nz(-10, 12), vorm = kies(['ax+b', 'ax+b', 'b-ax', 'beide']);
      let tex, stap;
      if (vorm === 'ax+b') { const a = nz(2, 9) * (Math.random() < 0.2 ? -1 : 1), b = nz(-20, 20); tex = `${term(a, 'x', true)}${cst(b)} = ${a * x + b}`; stap = [`${term(a, 'x', true)} = ${a * x + b} ${b < 0 ? '+' : '-'} ${Math.abs(b)} = ${a * x}`]; }
      else if (vorm === 'b-ax') { const a = rnd(2, 9), b = nz(1, 20); tex = `${b} - ${a}x = ${b - a * x}`; stap = [`-${a}x = ${b - a * x} - ${b} = ${-a * x}`]; }
      else { let a, c; do { a = rnd(2, 9); c = rnd(1, 8); } while (a === c); const b = nz(-12, 12), d = (a - c) * x + b; tex = `${term(a, 'x', true)}${cst(b)} = ${term(c, 'x', true)}${cst(d)}`; stap = [`${a}x - ${c === 1 ? '' : c}x = ${d}${b < 0 ? ` + ${-b}` : ` - ${b}`}`, `${a - c}x = ${d - b}`]; }
      return { soort: 'lineair', tex, antw: Vg(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    haakjes: { naam: 'Eerst de haakjes weg', gen() {
      const x = nz(-8, 10), vorm = kies(['a(x+b)+c', 'a(x+b)=cx+d', 'a(bx+c)-dx']);
      let tex, stap;
      if (vorm === 'a(x+b)+c') { const a = rnd(2, 6), b = nz(-6, 6), c = nz(-9, 9); tex = `${a}(x${cst(b)})${cst(c)} = ${a * (x + b) + c}`; stap = [`${a}x${cst(a * b)}${cst(c)} = ${a * (x + b) + c}`, `${a}x = ${a * x}`]; }
      else if (vorm === 'a(x+b)=cx+d') { let a, c; do { a = rnd(2, 6); c = rnd(1, 7); } while (a === c); const b = nz(-6, 6), d = a * (x + b) - c * x; tex = `${a}(x${cst(b)}) = ${term(c, 'x', true)}${cst(d)}`; stap = [`${a}x${cst(a * b)} = ${term(c, 'x', true)}${cst(d)}`, `${a - c}x = ${(a - c) * x}`]; }
      else { const a = rnd(2, 5), b = rnd(2, 4), c = nz(-5, 5); let d; do { d = rnd(1, 9); } while (d === a * b); const e = a * (b * x + c) - d * x; tex = `${a}(${b}x${cst(c)}) - ${d === 1 ? '' : d}x = ${e}`; stap = [`${a * b}x${cst(a * c)} - ${d === 1 ? '' : d}x = ${e}`, `${a * b - d}x = ${(a * b - d) * x}`]; }
      return { soort: 'haakjes', opdracht: 'Los op. Werk eerst de haakjes weg.', tex, antw: Vg(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    noemer: { naam: 'Eerst de noemer weg', gen() {
      const vorm = kies(['x/a+b', 'bx/a-c', 'x/a+x/b']);
      let tex, x, stap;
      if (vorm === 'x/a+b') { const a = rnd(2, 9), k = nz(-6, 8), b = nz(-9, 9); x = a * k; const r = k + b; tex = `\\dfrac{x}{${a}}${cst(b)} = ${r}`; stap = [`\\text{beide leden maal ${a}: } x${cst(a * b)} = ${a * r}`]; }
      else if (vorm === 'bx/a-c') { let a, b; do { a = rnd(2, 7); b = rnd(2, 7); } while (ggd(a, b) > 1); const k = nz(-5, 6), c = nz(-9, 9); x = a * k; const r = b * k - c; tex = `\\dfrac{${b}x}{${a}}${cst(-c)} = ${r}`; stap = [`\\text{beide leden maal ${a}: } ${b}x${cst(-a * c)} = ${a * r}`, `${b}x = ${a * r + a * c}`]; }
      else { let a, b; do { a = rnd(2, 6); b = rnd(2, 6); } while (a === b); const L = kgv(a, b), k = nz(-4, 5); x = L * k; const r = x / a + x / b; tex = `\\dfrac{x}{${a}} + \\dfrac{x}{${b}} = ${r}`; stap = [`\\text{beide leden maal ${L}: } ${L / a}x + ${L / b}x = ${L * r}`, `${L / a + L / b}x = ${L * r}`]; }
      return { soort: 'noemer', opdracht: 'Los op. Werk eerst de noemer weg.', tex, antw: Vg(x), uitleg: [...stap, `x = ${x}`, `V = \\{${x}\\}`] };
    } },
    evenredigheid: { naam: 'Evenredigheden', gen() {
      for (;;) {
        if (Math.random() < 0.5) { // a/x = b/c
          const x = rnd(1, 12), b = rnd(2, 12), c = rnd(2, 12); const a = b * x / c; if (!Number.isInteger(a) || a < 1 || a > 40) continue;
          return { soort: 'evenredigheid', opdracht: 'Los de evenredigheid op.', tex: `\\dfrac{${a}}{x} = \\dfrac{${b}}{${c}}`, antw: Vg(x), uitleg: [`${a} \\cdot ${c} = ${b} \\cdot x`, `${a * c} = ${b}x`, `x = ${x}`, `V = \\{${x}\\}`] };
        }
        const a = rnd(2, 9), b = rnd(2, 9); if (a === b) continue;
        const p = nz(-5, 5), q = nz(-5, 5); if (p === q) continue;
        const x = (b * p - a * q) / (a - b); if (!Number.isInteger(x) || x + p === 0 || x + q === 0 || Math.abs(x) > 20) continue;
        const tex = `\\dfrac{${a}}{x${cst(p)}} = \\dfrac{${b}}{x${cst(q)}}`;
        return { soort: 'evenredigheid', opdracht: 'Los de evenredigheid op.', tex, antw: Vg(x),
          uitleg: [`${a}(x${cst(q)}) = ${b}(x${cst(p)})`, `${a}x${cst(a * q)} = ${b}x${cst(b * p)}`, `${term(a - b, 'x', true)} = ${b * p - a * q}`, `x = ${x}`, `V = \\{${x}\\}`] };
      }
    } },
    wortel: { naam: 'Eerst de wortel weg', gen() {
      for (;;) {
        const c = rnd(2, 9), a = nz(-4, 5), x = nz(-8, 12), b = c * c - a * x;
        if (Math.abs(b) > 60) continue;
        const binnen = `${term(a, 'x', true)}${cst(b)}`;
        return { soort: 'wortel', opdracht: 'Los op. Werk eerst de wortel weg door beide leden te kwadrateren. Maak de proef.', tex: `\\sqrt{${binnen}} = ${c}`, antw: Vg(x),
          uitleg: [`\\text{kwadrateren: } ${binnen} = ${c * c}`, `${term(a, 'x', true)} = ${c * c - b}`, `x = ${x}`, `\\text{proef: } \\sqrt{${a === 1 ? '' : a === -1 ? '-' : a + ' \\cdot '}${h(x)}${cst(b)}} = \\sqrt{${c * c}} = ${c} \\;✓`, `V = \\{${x}\\}`] };
      }
    } },
    lineairU: { naam: '★ Uitdagend: x in beide leden', gen() {
      for (;;) {
        const a = nz(-9, 9), c = nz(-9, 9); if (a === c) continue;
        const b = nz(-15, 15), d = nz(-15, 15), f = fr9(d - b, a - c);
        if (!klein(f, 9, 15) || (f.q === 1 && Math.random() < 0.7)) continue;
        const L = [], antw = losOp(a, b, c, d, L);
        return { soort: 'lineairU', tex: `${lin9(a, b)} = ${lin9(c, d)}`, antw, uitleg: L };
      }
    } },
    haakjesU: { naam: '★ Uitdagend: minteken voor de haakjes, haakjes in beide leden', gen() {
      const leeg = Math.random() < 0.25;
      for (;;) {
        let tex, uit, A, B, C, D;
        if (Math.random() < 0.5) { // a(bx + c) − (dx + e) = f(x + g)
          const a = rnd(2, 5), b = rnd(1, 4), c = nz(-6, 6), d = rnd(1, 6), e = nz(-8, 8), f = rnd(2, 5), g = nz(-6, 6);
          tex = `${a}(${lin9(b, c)}) - (${lin9(d, e)}) = ${f}(x${cst(g)})`;
          uit = `${lin9(a * b, a * c)}${minLin(d, e)} = ${lin9(f, f * g)}`;
          A = a * b - d; B = a * c - e; C = f; D = f * g;
        } else { // −a(x + b) + c = d − (ex + f)
          const a = rnd(2, 6), b = nz(-6, 6), c = nz(-9, 9), d = nz(-9, 9), e = rnd(1, 6), f = nz(-8, 8);
          tex = `-${a}(x${cst(b)})${cst(c)} = ${d} - (${lin9(e, f)})`;
          uit = `${lin9(-a, -a * b)}${cst(c)} = ${d}${minLin(e, f)}`;
          A = -a; B = -a * b + c; C = -e; D = d - f;
        }
        if (leeg ? (A !== C || B === D) : (A === C || !klein(fr9(D - B, A - C)))) continue;
        const L = [`\\text{haakjes wegwerken: } ${uit}`, `${lin9(A, B)} = ${lin9(C, D)}`];
        const antw = losOp(A, B, C, D, L);
        return { soort: 'haakjesU', opdracht: 'Los op. Werk eerst de haakjes weg.', tex, antw, uitleg: L };
      }
    } },
    noemerU: { naam: '★ Uitdagend: tweetermen in de teller', gen() {
      if (Math.random() < 0.2) { // (x + p)/a = x/a + r  → V = ∅
        const a = rnd(2, 8), r = nz(-5, 5); let p; do { p = nz(-9, 9); } while (p === a * r);
        const L = [`\\text{beide leden maal ${a}: } x${cst(p)} = x${cst(a * r)}`];
        const antw = losOp(1, p, 1, a * r, L);
        return { soort: 'noemerU', opdracht: 'Los op. Werk eerst de noemer weg.', tex: `\\dfrac{${lin9(1, p)}}{${a}} = \\dfrac{x}{${a}}${cst(r)}`, antw, uitleg: L };
      }
      for (;;) {
        const a = rnd(2, 6), b = rnd(2, 6); if (a === b) continue;
        const m1 = rnd(1, 3), m2 = rnd(1, 3), p = nz(-6, 6), q = nz(-6, 6), r = rnd(-4, 6), s = Math.random() < 0.6 ? -1 : 1;
        const Lk = kgv(a, b), k1 = Lk / a, k2 = Lk / b;
        const A = k1 * m1 + s * k2 * m2, B = k1 * p + s * k2 * q, D = Lk * r;
        if (A === 0 || !klein(fr9(D - B, A))) continue;
        const f1 = k1 === 1 ? lin9(m1, p) : `${k1}(${lin9(m1, p)})`;
        const f2 = k2 === 1 ? (s < 0 ? `(${lin9(m2, q)})` : lin9(m2, q)) : `${k2}(${lin9(m2, q)})`;
        const uit = `${lin9(k1 * m1, k1 * p)}${s < 0 ? minLin(k2 * m2, k2 * q) : ` + ${xs(k2 * m2)}${cst(k2 * q)}`}`;
        const L = [`\\text{beide leden maal ${Lk}: } ${f1} ${s < 0 ? '-' : '+'} ${f2} = ${D}`, `${uit} = ${D}`, `${lin9(A, B)} = ${D}`];
        const antw = losOp(A, B, 0, D, L);
        return { soort: 'noemerU', opdracht: 'Los op. Werk eerst de noemer weg.', tex: `\\dfrac{${lin9(m1, p)}}{${a}} ${s < 0 ? '-' : '+'} \\dfrac{${lin9(m2, q)}}{${b}} = ${r}`, antw, uitleg: L };
      }
    } },
    evenredigheidU: { naam: '★ Uitdagend: evenredigheden met tweetermen', gen() {
      const leeg = Math.random() < 0.15;
      for (;;) {
        if (leeg || Math.random() < 0.6) { // (ax + p)/b = (cx + q)/d
          const a = nz(-4, 5), c = nz(-4, 5), b = rnd(2, 9), d = rnd(2, 9), p = nz(-9, 9), q = nz(-9, 9);
          if (b === d) continue;
          const A = d * a, B = d * p, C = b * c, D = b * q;
          if (leeg ? (A !== C || B === D) : (A === C || !klein(fr9(D - B, A - C)))) continue;
          const L = [`\\text{uitersten = middelsten: } ${d}(${lin9(a, p)}) = ${b}(${lin9(c, q)})`, `${lin9(A, B)} = ${lin9(C, D)}`];
          const antw = losOp(A, B, C, D, L);
          return { soort: 'evenredigheidU', opdracht: 'Los de evenredigheid op.', tex: `\\dfrac{${lin9(a, p)}}{${b}} = \\dfrac{${lin9(c, q)}}{${d}}`, antw, uitleg: L };
        }
        // a/(x + p) = b/(cx + q)
        const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 4), p = nz(-6, 6), q = nz(-6, 6);
        const A = a * c, B = a * q, C = b, D = b * p;
        if (A === C) continue;
        const f = fr9(D - B, A - C), x = f.p / f.q;
        if (!klein(f) || Math.abs(x + p) < 1e-9 || Math.abs(c * x + q) < 1e-9) continue;
        const L = [`\\text{uitersten = middelsten: } ${a}(${lin9(c, q)}) = ${b}(x${cst(p)})`, `${lin9(A, B)} = ${lin9(C, D)}`];
        const antw = losOp(A, B, C, D, L);
        return { soort: 'evenredigheidU', opdracht: 'Los de evenredigheid op.', tex: `\\dfrac{${a}}{x${cst(p)}} = \\dfrac{${b}}{${lin9(c, q)}}`, antw, uitleg: L };
      }
    } },
    wortelU: { naam: '★ Uitdagend: eerst de wortel alleen zetten', gen() {
      const opdr = 'Los op. Zet de wortel alleen, kwadrateer beide leden en maak de proef.';
      const vorm = W.gewogen([['plus', 2], ['maal', 1], ['breuk', 1]]);
      for (;;) {
        if (vorm === 'breuk') { // √((x + p)/a) = k
          const a = rnd(2, 6), p = nz(-9, 9), k = rnd(1, 5), x = a * k * k - p;
          const L = [`\\text{kwadrateren: } \\dfrac{${lin9(1, p)}}{${a}} = ${k * k}`, `\\text{beide leden maal ${a}: } ${lin9(1, p)} = ${a * k * k}`];
          const antw = losOp(1, p, 0, a * k * k, L, () => `\\text{proef: } \\sqrt{\\dfrac{${h(x)}${cst(p)}}{${a}}} = \\sqrt{${k * k}} = ${k} \\;✓`);
          return { soort: 'wortelU', opdracht: opdr, tex: `\\sqrt{\\dfrac{${lin9(1, p)}}{${a}}} = ${k}`, antw, uitleg: L };
        }
        const a = nz(-4, 5), b = nz(-12, 12), binnen = lin9(a, b);
        const W2 = `\\sqrt{${binnen}}`;
        const negatief = Math.random() < 0.35;
        const k = negatief ? -rnd(1, 6) : rnd(1, 7);
        const f = fr9(k * k - b, a);
        if (!negatief && !klein(f, 5, 25)) continue;
        const L = [];
        let tex;
        if (vorm === 'plus') { // √(ax + b) + c = d
          const c = nz(-9, 9), d = k + c;
          tex = `${W2}${cst(c)} = ${d}`;
          L.push(`${W2}${cst(c)} ${tekenOp(c)} ${Math.abs(c)} = ${d} ${tekenOp(c)} ${Math.abs(c)}`, `${W2} = ${k}`);
        } else { // m·√(ax + b) = n
          const m = rnd(2, 5), n = m * k;
          tex = `${m}${W2} = ${n}`;
          L.push(`\\frac{${m}${W2}}{${m}} = \\frac{${n}}{${m}}`, `${W2} = ${k}`);
        }
        if (negatief) {
          L.push(`\\text{Een vierkantswortel is nooit negatief: er is geen oplossing.}`, 'V = \\varnothing');
          return { soort: 'wortelU', opdracht: opdr, tex, antw: V9leeg(), uitleg: L };
        }
        L.push(`\\text{kwadrateren: } ${binnen} = ${k * k}`);
        const antw = losOp(a, b, 0, k * k, L, (g) => `\\text{proef: } \\sqrt{${a === 1 ? '' : a === -1 ? '-' : a + ' \\cdot '}${frH(g)}${cst(b)}} = \\sqrt{${k * k}} = ${k} \\;✓`);
        return { soort: 'wortelU', opdracht: opdr, tex, antw, uitleg: L };
      }
    } },
  },
  oefenMix: [['lineair', 2], ['haakjes', 2], ['noemer', 2], ['evenredigheid', 1], ['wortel', 2],
             ['lineairU', 2], ['haakjesU', 3], ['noemerU', 3], ['evenredigheidU', 2], ['wortelU', 3]],
  // 12 vragen: 3 basis (25 %) en 9 uitdagend (75 %)
  test: [['lineair', 1], ['haakjes', 1], ['wortel', 1],
         ['lineairU', 2], ['haakjesU', 2], ['noemerU', 2], ['evenredigheidU', 1], ['wortelU', 2]],
};

// ===================================================================
//  DEEL 10 — Omvormen van formules
// ===================================================================
// Elke opgave: één formule + één gevraagde grootheid. sleutel = de formule, zodat een formule
// maar één keer in een test voorkomt. De uitleg toont de stappen: telkens dezelfde bewerking in beide leden.
const OF = (f, vars, doel, expr, tex, stappen) => ({ f, vars, doel, expr, tex, stappen });
const bl = (s) => `\\quad \\text{(beide leden ${s})}`;
const wis = '\\quad \\text{(leden verwisselen)}';

// ---- basis (25 %): één of twee eenvoudige stappen
const OF_BASIS = [
  OF('v = \\dfrac{s}{t}', ['v', 's', 't'], 's', 'v*t', 'v \\cdot t', [`v \\cdot t = s ${bl('maal } t\\text{')}`, `s = v \\cdot t ${wis}`]),
  OF('v = \\dfrac{s}{t}', ['v', 's', 't'], 't', 's/v', '\\dfrac{s}{v}', [`v \\cdot t = s ${bl('maal } t\\text{')}`, `t = \\dfrac{s}{v} ${bl('delen door } v\\text{')}`]),
  OF('P = \\dfrac{F}{A}', ['P', 'F', 'A'], 'F', 'P*A', 'P \\cdot A', [`P \\cdot A = F ${bl('maal } A\\text{')}`, `F = P \\cdot A ${wis}`]),
  OF('P = \\dfrac{F}{A}', ['P', 'F', 'A'], 'A', 'F/P', '\\dfrac{F}{P}', [`P \\cdot A = F ${bl('maal } A\\text{')}`, `A = \\dfrac{F}{P} ${bl('delen door } P\\text{')}`]),
  OF('\\rho = \\dfrac{m}{V}', ['ρ', 'm', 'V'], 'm', 'ρ*V', '\\rho \\cdot V', [`\\rho \\cdot V = m ${bl('maal } V\\text{')}`, `m = \\rho \\cdot V ${wis}`]),
  OF('\\rho = \\dfrac{m}{V}', ['ρ', 'm', 'V'], 'V', 'm/ρ', '\\dfrac{m}{\\rho}', [`\\rho \\cdot V = m ${bl('maal } V\\text{')}`, `V = \\dfrac{m}{\\rho} ${bl('delen door } \\rho\\text{')}`]),
  OF('O = 4z', ['O', 'z'], 'z', 'O/4', '\\dfrac{O}{4}', [`4z = O ${wis}`, `z = \\dfrac{O}{4} ${bl('delen door 4')}`]),
  OF('A = z^2', ['A', 'z'], 'z', '√A', '\\sqrt{A}', [`z^2 = A ${wis}`, `z = \\sqrt{A} \\quad \\text{(vierkantswortel nemen)}`]),
  OF('V = z^3', ['V', 'z'], 'z', '∛V', '\\sqrt[3]{V}', [`z^3 = V ${wis}`, `z = \\sqrt[3]{V} \\quad \\text{(derdemachtswortel nemen)}`]),
  OF('F = m \\cdot g', ['F', 'm', 'g'], 'm', 'F/g', '\\dfrac{F}{g}', [`m \\cdot g = F ${wis}`, `m = \\dfrac{F}{g} ${bl('delen door } g\\text{')}`]),
  OF('F = m \\cdot g', ['F', 'm', 'g'], 'g', 'F/m', '\\dfrac{F}{m}', [`m \\cdot g = F ${wis}`, `g = \\dfrac{F}{m} ${bl('delen door } m\\text{')}`]),
  OF('O = 2 \\cdot r \\cdot \\pi', ['O', 'r'], 'r', 'O/(2π)', '\\dfrac{O}{2\\pi}', [`2 \\cdot r \\cdot \\pi = O ${wis}`, `r = \\dfrac{O}{2\\pi} ${bl('delen door } 2\\pi\\text{')}`]),
];

// ---- uitdagend (75 %) — A: de grootheid staat in een som of tussen haakjes
const OF_SOM = [
  OF('O = 2b + 2l', ['O', 'b', 'l'], 'l', '(O-2b)/2', '\\dfrac{O - 2b}{2}', [`2b + 2l = O ${wis}`, `2l = O - 2b ${bl('min } 2b\\text{')}`, `l = \\dfrac{O - 2b}{2} ${bl('delen door 2')}`]),
  OF('O = 2(l + b)', ['O', 'l', 'b'], 'l', 'O/2-b', '\\dfrac{O}{2} - b', [`2(l + b) = O ${wis}`, `l + b = \\dfrac{O}{2} ${bl('delen door 2')}`, `l = \\dfrac{O}{2} - b ${bl('min } b\\text{')}`]),
  OF('A = \\dfrac{(B + b) \\cdot h}{2}', ['A', 'B', 'b', 'h'], 'b', '2A/h-B', '\\dfrac{2A}{h} - B', [`2A = (B + b) \\cdot h ${bl('maal 2')}`, `\\dfrac{2A}{h} = B + b ${bl('delen door } h\\text{')}`, `\\dfrac{2A}{h} - B = b ${bl('min } B\\text{')}`, `b = \\dfrac{2A}{h} - B ${wis}`]),
  OF('A = \\dfrac{(B + b) \\cdot h}{2}', ['A', 'B', 'b', 'h'], 'h', '2A/(B+b)', '\\dfrac{2A}{B + b}', [`2A = (B + b) \\cdot h ${bl('maal 2')}`, `\\dfrac{2A}{B + b} = h ${bl('delen door } (B + b)\\text{')}`, `h = \\dfrac{2A}{B + b} ${wis}`]),
  OF('F = 1{,}8 \\cdot C + 32', ['F', 'C'], 'C', '(F-32)/1.8', '\\dfrac{F - 32}{1{,}8}', [`1{,}8 \\cdot C + 32 = F ${wis}`, `1{,}8 \\cdot C = F - 32 ${bl('min 32')}`, `C = \\dfrac{F - 32}{1{,}8} ${bl('delen door 1,8')}`]),
  OF('y = a \\cdot x + b', ['y', 'a', 'x', 'b'], 'x', '(y-b)/a', '\\dfrac{y - b}{a}', [`a \\cdot x + b = y ${wis}`, `a \\cdot x = y - b ${bl('min } b\\text{')}`, `x = \\dfrac{y - b}{a} ${bl('delen door } a\\text{')}`]),
  OF('y = a \\cdot x + b', ['y', 'a', 'x', 'b'], 'a', '(y-b)/x', '\\dfrac{y - b}{x}', [`a \\cdot x + b = y ${wis}`, `a \\cdot x = y - b ${bl('min } b\\text{')}`, `a = \\dfrac{y - b}{x} ${bl('delen door } x\\text{')}`]),
  OF('g = \\dfrac{a + b}{2}', ['g', 'a', 'b'], 'b', '2g-a', '2g - a', [`2g = a + b ${bl('maal 2')}`, `2g - a = b ${bl('min } a\\text{')}`, `b = 2g - a ${wis}`]),
  OF('K = k + k \\cdot i \\cdot n', ['K', 'k', 'i', 'n'], 'n', '(K-k)/(k*i)', '\\dfrac{K - k}{k \\cdot i}', [`k + k \\cdot i \\cdot n = K ${wis}`, `k \\cdot i \\cdot n = K - k ${bl('min } k\\text{')}`, `n = \\dfrac{K - k}{k \\cdot i} ${bl('delen door } k \\cdot i\\text{')}`]),
  OF('K = k + k \\cdot i \\cdot n', ['K', 'k', 'i', 'n'], 'i', '(K-k)/(k*n)', '\\dfrac{K - k}{k \\cdot n}', [`k + k \\cdot i \\cdot n = K ${wis}`, `k \\cdot i \\cdot n = K - k ${bl('min } k\\text{')}`, `i = \\dfrac{K - k}{k \\cdot n} ${bl('delen door } k \\cdot n\\text{')}`]),
  OF('O = 2\\pi r^2 + 2\\pi r h', ['O', 'r', 'h'], 'h', '(O-2πr²)/(2πr)', '\\dfrac{O - 2\\pi r^2}{2\\pi r}', [`2\\pi r^2 + 2\\pi r h = O ${wis}`, `2\\pi r h = O - 2\\pi r^2 ${bl('min } 2\\pi r^2\\text{')}`, `h = \\dfrac{O - 2\\pi r^2}{2\\pi r} ${bl('delen door } 2\\pi r\\text{')}`]),
];

// ---- uitdagend — B: breuken en producten (de grootheid in de noemer, of samen met andere factoren)
const OF_BREUK = [
  OF('A = \\dfrac{b \\cdot h}{2}', ['A', 'b', 'h'], 'h', '2A/b', '\\dfrac{2A}{b}', [`2A = b \\cdot h ${bl('maal 2')}`, `\\dfrac{2A}{b} = h ${bl('delen door } b\\text{')}`, `h = \\dfrac{2A}{b} ${wis}`]),
  OF('V = \\dfrac{G \\cdot h}{3}', ['V', 'G', 'h'], 'G', '3V/h', '\\dfrac{3V}{h}', [`3V = G \\cdot h ${bl('maal 3')}`, `\\dfrac{3V}{h} = G ${bl('delen door } h\\text{')}`, `G = \\dfrac{3V}{h} ${wis}`]),
  OF('V = \\pi \\cdot r^2 \\cdot h', ['V', 'r', 'h'], 'h', 'V/(πr²)', '\\dfrac{V}{\\pi r^2}', [`\\pi \\cdot r^2 \\cdot h = V ${wis}`, `h = \\dfrac{V}{\\pi r^2} ${bl('delen door } \\pi r^2\\text{')}`]),
  OF('V = \\dfrac{\\pi \\cdot r^2 \\cdot h}{3}', ['V', 'r', 'h'], 'h', '3V/(πr²)', '\\dfrac{3V}{\\pi r^2}', [`3V = \\pi \\cdot r^2 \\cdot h ${bl('maal 3')}`, `\\dfrac{3V}{\\pi r^2} = h ${bl('delen door } \\pi r^2\\text{')}`, `h = \\dfrac{3V}{\\pi r^2} ${wis}`]),
  OF('E = \\dfrac{m \\cdot v^2}{2}', ['E', 'm', 'v'], 'm', '2E/v²', '\\dfrac{2E}{v^2}', [`2E = m \\cdot v^2 ${bl('maal 2')}`, `\\dfrac{2E}{v^2} = m ${bl('delen door } v^2\\text{')}`, `m = \\dfrac{2E}{v^2} ${wis}`]),
  OF('P = I^2 \\cdot R', ['P', 'I', 'R'], 'R', 'P/I²', '\\dfrac{P}{I^2}', [`I^2 \\cdot R = P ${wis}`, `R = \\dfrac{P}{I^2} ${bl('delen door } I^2\\text{')}`]),
  OF('R = \\dfrac{\\rho \\cdot l}{A}', ['R', 'ρ', 'l', 'A'], 'A', 'ρ*l/R', '\\dfrac{\\rho \\cdot l}{R}', [`R \\cdot A = \\rho \\cdot l ${bl('maal } A\\text{')}`, `A = \\dfrac{\\rho \\cdot l}{R} ${bl('delen door } R\\text{')}`]),
  OF('R = \\dfrac{\\rho \\cdot l}{A}', ['R', 'ρ', 'l', 'A'], 'l', 'R*A/ρ', '\\dfrac{R \\cdot A}{\\rho}', [`R \\cdot A = \\rho \\cdot l ${bl('maal } A\\text{')}`, `\\dfrac{R \\cdot A}{\\rho} = l ${bl('delen door } \\rho\\text{')}`, `l = \\dfrac{R \\cdot A}{\\rho} ${wis}`]),
  OF('a = \\dfrac{v - u}{t}', ['a', 'v', 'u', 't'], 't', '(v-u)/a', '\\dfrac{v - u}{a}', [`a \\cdot t = v - u ${bl('maal } t\\text{')}`, `t = \\dfrac{v - u}{a} ${bl('delen door } a\\text{')}`]),
  OF('a = \\dfrac{v - u}{t}', ['a', 'v', 'u', 't'], 'v', 'a*t+u', 'a \\cdot t + u', [`a \\cdot t = v - u ${bl('maal } t\\text{')}`, `a \\cdot t + u = v ${bl('plus } u\\text{')}`, `v = a \\cdot t + u ${wis}`]),
];

// ---- uitdagend — C: kwadraten en derde machten (eerst de macht alleen, dan de wortel)
const OF_WORTEL = [
  OF('A = r^2 \\cdot \\pi', ['A', 'r'], 'r', '√(A/π)', '\\sqrt{\\dfrac{A}{\\pi}}', [`r^2 \\cdot \\pi = A ${wis}`, `r^2 = \\dfrac{A}{\\pi} ${bl('delen door } \\pi\\text{')}`, `r = \\sqrt{\\dfrac{A}{\\pi}} \\quad \\text{(vierkantswortel nemen)}`]),
  OF('O = 6z^2', ['O', 'z'], 'z', '√(O/6)', '\\sqrt{\\dfrac{O}{6}}', [`6z^2 = O ${wis}`, `z^2 = \\dfrac{O}{6} ${bl('delen door 6')}`, `z = \\sqrt{\\dfrac{O}{6}} \\quad \\text{(vierkantswortel nemen)}`]),
  OF('O = 4\\pi r^2', ['O', 'r'], 'r', '√(O/(4π))', '\\sqrt{\\dfrac{O}{4\\pi}}', [`4\\pi r^2 = O ${wis}`, `r^2 = \\dfrac{O}{4\\pi} ${bl('delen door } 4\\pi\\text{')}`, `r = \\sqrt{\\dfrac{O}{4\\pi}} \\quad \\text{(vierkantswortel nemen)}`]),
  OF('V = \\pi \\cdot r^2 \\cdot h', ['V', 'r', 'h'], 'r', '√(V/(πh))', '\\sqrt{\\dfrac{V}{\\pi h}}', [`\\pi \\cdot r^2 \\cdot h = V ${wis}`, `r^2 = \\dfrac{V}{\\pi h} ${bl('delen door } \\pi h\\text{')}`, `r = \\sqrt{\\dfrac{V}{\\pi h}} \\quad \\text{(vierkantswortel nemen)}`]),
  OF('V = \\dfrac{\\pi \\cdot r^2 \\cdot h}{3}', ['V', 'r', 'h'], 'r', '√(3V/(πh))', '\\sqrt{\\dfrac{3V}{\\pi h}}', [`3V = \\pi \\cdot r^2 \\cdot h ${bl('maal 3')}`, `\\dfrac{3V}{\\pi h} = r^2 ${bl('delen door } \\pi h\\text{')}`, `r = \\sqrt{\\dfrac{3V}{\\pi h}} \\quad \\text{(vierkantswortel nemen, leden verwisselen)}`]),
  OF('V = \\dfrac{4}{3} \\pi r^3', ['V', 'r'], 'r', '∛(3V/(4π))', '\\sqrt[3]{\\dfrac{3V}{4\\pi}}', [`3V = 4\\pi r^3 ${bl('maal 3')}`, `\\dfrac{3V}{4\\pi} = r^3 ${bl('delen door } 4\\pi\\text{')}`, `r = \\sqrt[3]{\\dfrac{3V}{4\\pi}} \\quad \\text{(derdemachtswortel nemen, leden verwisselen)}`]),
  OF('a^2 = b^2 + c^2', ['a', 'b', 'c'], 'b', '√(a²-c²)', '\\sqrt{a^2 - c^2}', [`b^2 + c^2 = a^2 ${wis}`, `b^2 = a^2 - c^2 ${bl('min } c^2\\text{')}`, `b = \\sqrt{a^2 - c^2} \\quad \\text{(vierkantswortel nemen)}`]),
  OF('a^2 = b^2 + c^2', ['a', 'b', 'c'], 'c', '√(a²-b²)', '\\sqrt{a^2 - b^2}', [`b^2 + c^2 = a^2 ${wis}`, `c^2 = a^2 - b^2 ${bl('min } b^2\\text{')}`, `c = \\sqrt{a^2 - b^2} \\quad \\text{(vierkantswortel nemen)}`]),
  OF('E = \\dfrac{m \\cdot v^2}{2}', ['E', 'm', 'v'], 'v', '√(2E/m)', '\\sqrt{\\dfrac{2E}{m}}', [`2E = m \\cdot v^2 ${bl('maal 2')}`, `\\dfrac{2E}{m} = v^2 ${bl('delen door } m\\text{')}`, `v = \\sqrt{\\dfrac{2E}{m}} \\quad \\text{(vierkantswortel nemen, leden verwisselen)}`]),
  OF('P = I^2 \\cdot R', ['P', 'I', 'R'], 'I', '√(P/R)', '\\sqrt{\\dfrac{P}{R}}', [`I^2 \\cdot R = P ${wis}`, `I^2 = \\dfrac{P}{R} ${bl('delen door } R\\text{')}`, `I = \\sqrt{\\dfrac{P}{R}} \\quad \\text{(vierkantswortel nemen)}`]),
];

const ofSoort = (soort, lijst, opdracht = 'Vorm om naar de gevraagde grootheid.') => () => {
  const o = kies(lijst);
  return { soort, opdracht, tex: `${o.f} \\qquad ${o.doel === 'ρ' ? '\\rho' : o.doel} = \\,?`, sleutel: o.f,
    antw: { soort: 'formule', expr: o.expr, doel: o.doel, vars: o.vars, tex: o.tex }, uitleg: o.stappen };
};

const DEEL10 = {
  nr: 10, titel: 'Omvormen van formules', kort: 'Een formule omvormen naar een gevraagde grootheid.',
  rekenmachine: false,
  opdracht: 'Vorm om naar de gevraagde grootheid.',
  theorie: `
    <div class="kader werk">
      <div class="kader-titel">Methode</div>
      <ol><li>Staat de gevraagde grootheid in het rechterlid? Verwissel dan de leden.</li>
        <li>Duid de grootheid aan waarnaar je omvormt.</li>
        <li>Pas de regels toe van het oplossen van vergelijkingen: doe telkens <b>dezelfde bewerking in beide leden</b>, tot de grootheid alleen staat.</li></ol>
      <p>Voorbeeld: $F = m \\cdot g \;\\rightarrow\; m = \\dfrac{F}{g}$ &nbsp; <span class="klein">(beide leden delen door $g$, daarna de leden verwisselen)</span></p>
    </div>
    <div class="kader">
      <div class="kader-titel">Nog enkele voorbeelden</div>
      <table class="tabel"><tr><th>formule</th><th>gevraagd</th><th>omgevormd</th></tr>
        <tr><td>$\\rho = \\dfrac{m}{V}$</td><td>$V$</td><td>$\\rho \\cdot V = m \;\\rightarrow\; V = \\dfrac{m}{\\rho}$</td></tr>
        <tr><td>$A = \\dfrac{b \\cdot h}{2}$</td><td>$b$</td><td>$2A = b \\cdot h \;\\rightarrow\; b = \\dfrac{2A}{h}$</td></tr>
        <tr><td>$O = 2b + 2l$</td><td>$b$</td><td>$O - 2l = 2b \;\\rightarrow\; b = \\dfrac{O - 2l}{2}$</td></tr>
        <tr><td>$A = z^2$</td><td>$z$</td><td>$z = \\sqrt{A}$ &nbsp; <span class="klein">(de wortel heft het kwadraat op)</span></td></tr></table>
    </div>
    <div class="kader werk">
      <div class="kader-titel">Pittigere formules: in welke volgorde?</div>
      <p>Werk de bewerkingen rond de gevraagde grootheid af <b>van buiten naar binnen</b>:</p>
      <ol><li>Staat er een <b>noemer</b>? Vermenigvuldig beide leden met die noemer.</li>
        <li>Staat er een <b>term</b> bij (+ of −)? Breng die over met de omgekeerde bewerking in beide leden.</li>
        <li>Staat er een <b>factor</b> bij (ook een factor voor de haakjes)? Deel beide leden door die factor.</li>
        <li>Staat de grootheid in het <b>kwadraat</b> of tot de <b>derde macht</b>? Zet die macht eerst helemaal alleen en neem dan de vierkantswortel of de derdemachtswortel.</li></ol>
      <table class="tabel"><tr><th>formule</th><th>gevraagd</th><th>omgevormd</th></tr>
        <tr><td>$y = a \\cdot x + b$</td><td>$x$</td><td>$a \\cdot x = y - b \;\\rightarrow\; x = \\dfrac{y - b}{a}$</td></tr>
        <tr><td>$a = \\dfrac{v - u}{t}$</td><td>$t$</td><td>$a \\cdot t = v - u \;\\rightarrow\; t = \\dfrac{v - u}{a}$</td></tr>
        <tr><td>$A = r^2 \\cdot \\pi$</td><td>$r$</td><td>$r^2 = \\dfrac{A}{\\pi} \;\\rightarrow\; r = \\sqrt{\\dfrac{A}{\\pi}}$</td></tr>
        <tr><td>$a^2 = b^2 + c^2$</td><td>$b$</td><td>$b^2 = a^2 - c^2 \;\\rightarrow\; b = \\sqrt{a^2 - c^2}$</td></tr></table>
      <p class="klein">Let op: $\\sqrt{a^2 - c^2}$ is <b>niet</b> hetzelfde als $a - c$. De wortel komt over het hele rechterlid.</p>
    </div>
    <div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
      <table class="tabel"><tr><th>wiskunde</th><th>typ</th></tr>
        <tr><td>$\\dfrac{F}{g}$</td><td><code>F/g</code></td></tr>
        <tr><td>$\\dfrac{2A}{h}$</td><td><code>2A/h</code></td></tr>
        <tr><td>$\\dfrac{O - 2l}{2}$</td><td><code>(O-2l)/2</code> &nbsp;(haakjes rond de teller!)</td></tr>
        <tr><td>$\\dfrac{O}{2\\pi}$</td><td><code>O/(2π)</code> &nbsp;(haakjes rond de noemer!)</td></tr>
        <tr><td>$\\dfrac{V}{\\pi r^2}$</td><td><code>V/(πr²)</code></td></tr>
        <tr><td>$\\sqrt{\\dfrac{A}{\\pi}}$</td><td><code>√(A/π)</code></td></tr>
        <tr><td>$\\sqrt{a^2 - c^2}$</td><td><code>√(a²-c²)</code></td></tr>
        <tr><td>$\\dfrac{F - 32}{1{,}8}$</td><td><code>(F-32)/1,8</code></td></tr></table>
      <p class="klein">Let op hoofdletters: $A$ en $a$, $V$ en $v$, $K$ en $k$ zijn verschillende grootheden. $O$ is de letter O, geen nul. Gebruik de knoppen π, ρ, √, ∛ en x².</p></div>`,
  voorbeelden: [
    { tex: 'F = m \\cdot g \\qquad g = \\,?', stappen: ['m \\cdot g = F \\quad \\text{(leden verwisselen)}', 'g = \\dfrac{F}{m} \\quad \\text{(beide leden delen door } m)'] },
    { tex: '\\rho = \\dfrac{m}{V} \\qquad V = \\,?', stappen: ['\\rho \\cdot V = m \\quad \\text{(beide leden maal } V)', 'V = \\dfrac{m}{\\rho} \\quad \\text{(beide leden delen door } \\rho)'] },
    { tex: 'O = 2b + 2l \\qquad b = \\,?', stappen: ['2b + 2l = O \\quad \\text{(leden verwisselen)}', '2b = O - 2l \\quad \\text{(beide leden min } 2l)', 'b = \\dfrac{O - 2l}{2} \\quad \\text{(beide leden delen door 2)}'] },
    { tex: 'A = \\dfrac{(B + b) \\cdot h}{2} \\qquad b = \\,?', stappen: ['2A = (B + b) \\cdot h \\quad \\text{(beide leden maal 2)}', '\\dfrac{2A}{h} = B + b \\quad \\text{(beide leden delen door } h)', '\\dfrac{2A}{h} - B = b \\quad \\text{(beide leden min } B)', 'b = \\dfrac{2A}{h} - B \\quad \\text{(leden verwisselen)}'] },
    { tex: 'a = \\dfrac{v - u}{t} \\qquad t = \\,?', stappen: ['a \\cdot t = v - u \\quad \\text{(beide leden maal } t)', 't = \\dfrac{v - u}{a} \\quad \\text{(beide leden delen door } a)'] },
    { tex: 'V = \\pi \\cdot r^2 \\cdot h \\qquad r = \\,?', stappen: ['\\pi \\cdot r^2 \\cdot h = V \\quad \\text{(leden verwisselen)}', 'r^2 = \\dfrac{V}{\\pi h} \\quad \\text{(beide leden delen door } \\pi h)', 'r = \\sqrt{\\dfrac{V}{\\pi h}} \\quad \\text{(vierkantswortel nemen)}'] },
  ],
  soorten: {
    omvormen: { naam: 'Formule omvormen (basis)', gen: ofSoort('omvormen', OF_BASIS) },
    somU: { naam: '★ Uitdagend: de grootheid in een som of tussen haakjes', gen: ofSoort('somU', OF_SOM) },
    breukU: { naam: '★ Uitdagend: breuken en producten', gen: ofSoort('breukU', OF_BREUK) },
    wortelU: { naam: '★ Uitdagend: kwadraten en derde machten', gen: ofSoort('wortelU', OF_WORTEL) },
  },
  oefenMix: [['omvormen', 2], ['somU', 3], ['breukU', 3], ['wortelU', 3]],
  // 12 vragen: 3 basis (25 %) en 9 uitdagend (75 %)
  test: [['omvormen', 3], ['somU', 3], ['breukU', 3], ['wortelU', 3]],
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
