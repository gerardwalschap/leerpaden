// Programma 'tweedegraadsfuncties-contexten-plus' — automatisch samengevoegd uit bron/tweedegraadsfuncties-contexten-plus/ (niet rechtstreeks bewerken)
(() => {
// ===== Tweedegraadsfuncties in contexten + · Wiskunde 4BW-MWW — hulpmiddelen =====
// De +-versie van "Tweedegraadsfuncties in contexten": dezelfde situaties (halfpipe, hangbrug, terras,
// remweg, vallen, poort), maar moeilijkere vragen: de formule zelf opstellen, terugrekenen met een
// vierkantswortel, problemen in twee stappen. Enkel functies f(x) = ax². Enkel individueel werk.
// Leidraad: de werkbundels "3. Tweedegraadsfuncties – contexten" en "contexten in de basis", G. Walschap.
const { rnd, kies, schud } = W;
const r10 = (x) => +(+x).toFixed(10);
const tg = (x, d = null) => W.texGetal(r10(x), d);
const kg = (x, d = null) => W.komma(r10(x), d).replace(/^-/, '−');
const M = (t) => W.tex(t);
const BLAUW = '#1c4e8a', ORANJE = '#e8772e', GROEN = '#2e7d4f';
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde: r10(waarde), voor: '', ...extra });
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const vz = (stukken, voor) => ({ soort: 'verzameling', stukken, voor });
const iv = (a, b, ai = true, bi = true) => [{ a, ai, b, bi }];
const I = Infinity;
const tx = (s) => '@@' + s; // gewone tekst in de uitleg
const opgave = (t) => `<p>${t}</p>`;
const gegeven = (t) => `<div class="kader"><div class="kader-titel">Gegeven</div><p>${t}</p></div>`;
const zin = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function zinnen(juist, fout, opt = {}) {
  const alle = schud([juist, ...fout.filter((z, i, a) => z && z !== juist && a.indexOf(z) === i).slice(0, opt.max || 3)]);
  return { soort: 'keuze', lijst: opt.lijst !== false, opties: alle.map((z, i) => ({ k: String(i), l: z, html: true })), juist: String(alle.indexOf(juist)) };
}
const jaNee = (ja, a = 'juist', b = 'fout') => ({ soort: 'keuze', opties: [{ k: 'j', l: `\\text{${a}}` }, { k: 'n', l: `\\text{${b}}` }], juist: ja ? 'j' : 'n' });
function texKeuze(juist, fout) {
  const alle = schud([juist, ...fout.filter((z, i, a) => z !== juist && a.indexOf(z) === i).slice(0, 3)]);
  return { soort: 'keuze', opties: alle.map((t, i) => ({ k: String(i), l: t })), juist: String(alle.indexOf(juist)) };
}
function figuren(juist, fout) {
  const alle = schud([juist, ...fout].map((l, i) => ({ l, nr: i })));
  return { soort: 'keuze', opties: alle.map((o, i) => ({ k: String(i), l: o.l, html: true, tekst: `grafiek ${'ABCD'[i]}` })), juist: String(alle.findIndex(o => o.nr === 0)) };
}
// a·x² als TeX (a als kommagetal)
const aTex = (a) => a === 1 ? '' : a === -1 ? '-' : tg(a);
const kw = (naam, v, a) => `${naam}(${v}) = ${aTex(a)}${v}^2`;
const tabel = (xn, xs, yn, ys) => `<table class="tabel"><tr><th>${xn}</th>${xs.map(x => `<td>${x}</td>`).join('')}</tr><tr><th>${yn}</th>${ys.map(y => `<td>${y}</td>`).join('')}</tr></table>`;

// ---- grafieken (SVG)
const nice = (v) => { const e = 10 ** Math.floor(Math.log10(v)), r = v / e; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * e; };
function rgraf(opt) {
  const [X0, X1] = opt.x, [Y0, Y1] = opt.y;
  const B = opt.breed || 360, H = opt.hoog || 230, ml = opt.klein ? 34 : 46, mr = 14, mt = 14, mb = opt.klein ? 26 : 38;
  const w = ml + B + mr, h = mt + H + mb;
  const X = (x) => ml + (x - X0) / (X1 - X0) * B, Y = (y) => mt + (Y1 - y) / (Y1 - Y0) * H;
  const xs = opt.xs || nice((X1 - X0) / 6), ys = opt.ys || nice((Y1 - Y0) / 6);
  const fs = opt.klein ? 9 : 10, num = (v) => (v < 0 ? '−' : '') + kg(Math.abs(+v.toFixed(6)));
  let g = '';
  for (let k = Math.ceil(X0 / xs) * xs; k <= X1 + 1e-9; k += xs) g += `<line x1="${X(k)}" y1="${Y(Y0)}" x2="${X(k)}" y2="${Y(Y1)}" stroke="#e3e7ee"/><text x="${X(k)}" y="${Y(Y0) + 13}" font-size="${fs}" text-anchor="middle" fill="#555">${num(k)}</text>`;
  for (let k = Math.ceil(Y0 / ys) * ys; k <= Y1 + 1e-9; k += ys) g += `<line x1="${X(X0)}" y1="${Y(k)}" x2="${X(X1)}" y2="${Y(k)}" stroke="#e3e7ee"/><text x="${X(X0) - 4}" y="${Y(k) + 3}" font-size="${fs}" text-anchor="end" fill="#555">${num(k)}</text>`;
  // assen: x-as op y = 0 als die in beeld is, anders onderaan
  const yAs = Y0 <= 0 && Y1 >= 0 ? Y(0) : Y(Y0), xAs = X0 <= 0 && X1 >= 0 ? X(0) : X(X0);
  g += `<line x1="${X(X0)}" y1="${yAs}" x2="${X(X1)}" y2="${yAs}" stroke="#1f2733" stroke-width="1.2"/><line x1="${xAs}" y1="${Y(Y0)}" x2="${xAs}" y2="${Y(Y1)}" stroke="#1f2733" stroke-width="1.2"/>`;
  if (!opt.klein && opt.xn) g += `<text x="${ml + B / 2}" y="${h - 6}" font-size="11" text-anchor="middle" fill="#333">${opt.xn}</text>`;
  if (!opt.klein && opt.yn) g += `<text x="12" y="${mt + H / 2}" font-size="11" text-anchor="middle" fill="#333" transform="rotate(-90 12 ${mt + H / 2})">${opt.yn}</text>`;
  let k = '';
  for (const a of opt.ha || []) if (a >= Y0 && a <= Y1) k += `<line x1="${X(X0)}" y1="${Y(a)}" x2="${X(X1)}" y2="${Y(a)}" stroke="${ORANJE}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  for (const a of opt.va || []) if (a >= X0 && a <= X1) k += `<line x1="${X(a)}" y1="${Y(Y0)}" x2="${X(a)}" y2="${Y(Y1)}" stroke="${ORANJE}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  for (const fn of opt.functies || []) {
    const van = Math.max(fn.van ?? X0, X0), tot = Math.min(fn.tot ?? X1, X1);
    if (opt.losse || fn.losse) {
      const st = fn.stap || 1;
      for (let x = Math.ceil(van); x <= tot; x += st) { const y = fn.f(x); if (y >= Y0 && y <= Y1) k += `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="1.8" fill="${fn.kleur || BLAUW}"/>`; }
      continue;
    }
    let d = '', aan = false;
    for (let i = 0; i <= 600; i++) {
      const x = van + (tot - van) * i / 600, y = fn.f(x);
      if (!isFinite(y) || y < Y0 - (Y1 - Y0) || y > Y1 + (Y1 - Y0)) { aan = false; continue; }
      const yy = Math.max(Y0 - (Y1 - Y0) * 0.05, Math.min(Y1 + (Y1 - Y0) * 0.05, y));
      d += `${aan ? 'L' : 'M'}${X(x).toFixed(1)},${Y(yy).toFixed(1)} `; aan = true;
    }
    k += `<path d="${d}" fill="none" stroke="${fn.kleur || BLAUW}" stroke-width="${opt.klein ? 2 : 2.4}"/>`;
  }
  for (const p of opt.punten || []) k += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4" fill="${p.hol ? '#fff' : BLAUW}" stroke="${BLAUW}" stroke-width="2"/>`;
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grafiek" style="font-family:Verdana,sans-serif;max-width:100%;height:auto">
    <defs><clipPath id="${id}"><rect x="${ml}" y="${mt - 2}" width="${B}" height="${H + 4}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${k}</g></svg>`;
}
const figuur = (svg) => `<div class="figuur">${svg}</div>`;

// ---- één duidelijke vraagzin onder de opgave; meerdere deelvragen als genummerde lijst
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const vragen = (...t) => `<ol class="vraagzin">${t.map(x => `<li><b>${x}</b></li>`).join('')}</ol>`;

// ---- opmaak voor de vraagzin en de moeilijke woorden (één keer op de pagina)
(() => {
  if (typeof document === 'undefined' || window.__woordStijl2) return;
  window.__woordStijl2 = true;
  const st = document.createElement('style');
  st.textContent = `.vraagzin{margin-top:12px;font-size:16px}
ol.vraagzin{padding-left:1.4em}ol.vraagzin li{margin:4px 0}
.woord{border-bottom:2px dotted #e8772e;cursor:help;position:relative;outline:none}
.woord .woord-uitleg{display:none;position:absolute;left:0;top:1.5em;z-index:30;width:250px;background:#fffbe6;border:1px solid #e8c36a;border-radius:6px;padding:6px 8px;font-size:13px;line-height:1.4;color:#1f2733;font-weight:normal;font-style:normal;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.woord:hover .woord-uitleg,.woord:focus .woord-uitleg{display:block}`;
  document.head.appendChild(st);
})();

// ---- moeilijke woorden: oranje stippellijn, uitleg bij aanraken of muis erover
const WOORDEN = [
  ['halfpipe', 'Een U-vormige baan in een skatepark. Je rijdt van de ene wand naar beneden en aan de andere kant weer omhoog.'],
  ['skatepark', 'Een plaats met hellingen en banen om te skaten.'],
  ['skater', 'Iemand die rijdt op een skateboard.'],
  ['doorsnede', 'Wat je ziet als je iets in twee snijdt en er recht op kijkt.'],
  ['hangbrug', 'Een brug die aan grote kabels hangt.'],
  ['pijlers', 'De hoge palen (torens) waaraan de kabels van een brug hangen.'],
  ['pijler', 'Een hoge paal (toren) waaraan de kabels van een brug hangen.'],
  ['kabel', 'Een dik, sterk touw van staal.'],
  ['wand', 'De schuine zijkant.'],
  ['terras', 'Een plaats naast een huis met een vloer van tegels.'],
  ['tegels', 'Platte vierkante stenen voor een vloer.'],
  ['remweg', 'Hoeveel meter een auto nog rijdt terwijl hij remt, tot hij stilstaat.'],
  ['remafstand', 'Hoeveel meter je nog rijdt terwijl je remt, tot je stilstaat.'],
  ['vuistregel', 'Een eenvoudige regel om snel iets ongeveer uit te rekenen.'],
  ['rijschool', 'Een school waar je leert autorijden.'],
  ['wegdek', 'De bovenkant van de weg, waar je op rijdt.'],
  ['vrijevaltoren', 'Een hoge attractie in een pretpark: je zit in een bakje dat naar beneden valt.'],
  ['pretpark', 'Een park met attracties, zoals Walibi of Plopsaland.'],
  ['bakje', 'Het zitje waarin de mensen zitten.'],
  ['afgeremd', 'Langzamer gemaakt tot het stilstaat.'],
  ['startpunt', 'De plaats waar het begint.'],
  ['valafstand', 'Hoeveel meter iets al gevallen is.'],
  ['poort', 'Een grote opening in een muur waar je door kan rijden.'],
  ['boog', 'Een gebogen bovenkant, zoals bij een poort of een brug.'],
  ['busje', 'Een kleine bus of bestelwagen.'],
  ['bestelwagen', 'Een kleine vrachtauto om pakjes te leveren.'],
  ['vrachtwagen', 'Een grote auto om goederen te vervoeren.'],
  ['kerkraam', 'Een raam van een kerk, vaak met een spitse bovenkant.'],
  ['spitse', 'Met een scherpe punt bovenaan.'],
  ['ondiepe', 'Niet diep.'],
  ['kom', 'Een ronde schaal.'],
  ['extremum', 'Het hoogste of laagste punt van de grafiek.'],
  ['dalparabool', 'Een parabool met de opening naar boven, zoals een U (a > 0).'],
  ['bergparabool', 'Een parabool met de opening naar onder, zoals een ∩ (a < 0).'],
  ['symmetrisch', 'Links en rechts zijn elkaars spiegelbeeld.'],
  ['symmetrie', 'Links en rechts zijn elkaars spiegelbeeld.'],
  ['spiegelbeeld', 'Wat je ziet als je iets in een spiegel bekijkt: omgekeerd.'],
  ['toenemend', 'Het wordt telkens meer.'],
  ['domein', 'Alle x-waarden die je mag (of die zinvol zijn).'],
  ['bereik', 'Alle y-waarden die voorkomen.'],
  ['nulwaarde', 'De x-waarde waarvoor de functiewaarde 0 is.'],
  ['evenredig', 'Als het ene verdubbelt, verdubbelt het andere ook.'],
  ['verdubbeld', 'Twee keer zo groot gemaakt.'],
  ['verdrievoudigd', 'Drie keer zo groot gemaakt.'],
  ['factor', 'Het getal waarmee je vermenigvuldigt.'],
  ['oppervlakte', 'Hoeveel plaats een vlak inneemt, bv. in cm².'],
  ['natuurlijk getal', 'Een getal zoals 0, 1, 2, 3 … (geen kommagetal, niet negatief).'],
  ['hangkabels', 'De dunne verticale kabels tussen de grote kabel en het brugdek.'],
  ['brugdek', 'De weg op de brug, waar de auto’s over rijden.'],
  ['remspoor', 'De zwarte streep die de banden op de weg achterlaten als een auto hard remt.'],
  ['put', 'Een diep gat in de grond met water onderaan.'],
  ['plons', 'Het geluid als iets in het water valt.'],
  ['boord', 'De rand.'],
  ['rivier', 'Een grote stroom water.'],
  ['parameter', 'Het getal a in de formule y = ax².'],
  ['percent', 'Per honderd: 10 % is 10 op de 100.'],
  ['vierkantswortel', 'Het omgekeerde van een kwadraat: √49 = 7, want 7² = 49.'],
].sort((p, q) => q[0].length - p[0].length);
function woorden(html) {
  if (!html || typeof html !== 'string' || html.includes('class="woord"')) return html; // al gedaan (bv. vragen in de eindtest)
  const gebruikt = new Set(), tokens = [];
  const stukken = html.split(/(<svg[\s\S]*?<\/svg>|<code>[\s\S]*?<\/code>|<span class="woord"[\s\S]*?<\/span><\/span>|<[^>]+>|\$\$[\s\S]*?\$\$|\$[^$]*\$)/);
  const vervang = (tekst) => {
    for (const [w, uitleg] of WOORDEN) {
      if (gebruikt.has(uitleg)) continue;
      const re = new RegExp(`(^|[^\\p{L}])(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![\\p{L}])`, 'iu');
      const m = tekst.match(re); if (!m) continue;
      gebruikt.add(uitleg);
      tokens.push(`<span class="woord" tabindex="0">${m[2]}<span class="woord-uitleg">${uitleg}</span></span>`);
      tekst = tekst.slice(0, m.index) + m[1] + `\u0001${tokens.length - 1}\u0002` + tekst.slice(m.index + m[0].length);
    }
    return tekst;
  };
  return stukken.map((s, i) => (i % 2 ? s : vervang(s))).join('').replace(/\u0001(\d+)\u0002/g, (m, k) => tokens[+k]);
}

// ---- afspraken bovenaan het leerpad
const AFSPRAKEN = `<div class="kader"><div class="kader-titel">Afspraken in dit leerpad</div>
  <ul><li>Een woord met een <span style="border-bottom:2px dotted #e8772e">oranje stippellijn</span> is een moeilijk woord. Raak het aan (of ga erover met de muis): dan zie je de uitleg.</li>
  <li>Elke vraag eindigt met een <b>vetgedrukte vraagzin</b>: daar staat wat je moet zoeken. Onder de titel staat een tip.</li>
  <li>Bij elke rekenvraag staat <b>op hoeveel decimalen je afrondt</b>. Komt de uitkomst exact uit (bv. 4 of 2,5), schrijf ze dan gewoon zo.</li>
  <li>Kommagetallen typ je met een komma: <code>2,25</code>. Een interval typ je zoals in de werkbundel: <code>[-4 ; 4]</code> (een komma tussen de grenzen mag ook).</li>
  <li>Je mag je rekenmachine gebruiken. Noteer altijd de juiste eenheid.</li>
  <li>In deze +-versie moet je vaak <b>terugrekenen</b>: je kent de uitkomst en zoekt $x$. Dan heb je een <b>vierkantswortel</b> nodig: $ax^2 = c$ geeft $x^2 = c : a$ en $x = \\sqrt{c : a}$.</li></ul></div>`;
// ===== situaties (overgenomen uit het gewone leerpad, zodat beide leerpaden dezelfde formules gebruiken) =====
// halfpipe of hangbrugkabel: dalparabool y = a·x², x = afstand tot het midden
function sitHalfpipe() {
  const [a, w] = kies([[0.25, 4], [0.5, 2], [0.125, 4], [0.2, 3]]);
  return { soort: 'halfpipe', a, w, fn: 'h', eenheid: 'm', stap: w <= 3 ? 0.5 : 1, rand: r10(a * w * w),
    tekst: `Dit is de doorsnede van een halfpipe in een skatepark.<br>
      $x$ = de afstand tot het midden (in m). Links van het midden is $x$ negatief, rechts is $x$ positief.<br>
      $h$ = de hoogte boven de bodem (in m).<br>
      De halfpipe is ${kg(2 * w)} m breed. De formule is $${kw('h', 'x', a)}$.`,
    wie: 'een skater', waar: 'staat', hoog: 'hoog' };
}
function sitKabel() {
  const [a, w] = kies([[0.01, 50], [0.02, 40], [0.005, 60], [0.01, 40]]);
  return { soort: 'kabel', a, w, fn: 'y', eenheid: 'm', stap: 10, rand: r10(a * w * w),
    tekst: `De grote kabel van een hangbrug hangt tussen twee pijlers. De pijlers staan ${2 * w} m uit elkaar.<br>
      $x$ = de afstand tot het midden van de brug (in m).<br>
      $y$ = hoe hoog de kabel hangt boven zijn laagste punt (in m).<br>
      De formule is $y = ${aTex(a)}x^2$.`,
    wie: 'de kabel', waar: 'hangt', hoog: 'hoog' };
}
const kiesDal = () => kies([sitHalfpipe, sitKabel])();
const dalGraf = (S, klein) => rgraf({ x: [-S.w, S.w], y: [0, nice(S.rand * 1.1)], xs: S.soort === 'kabel' ? 10 : S.w <= 3 ? 0.5 : 1, xn: 'x (m)', yn: S.soort === 'kabel' ? 'y (m)' : 'h (m)', functies: [{ f: (x) => S.a * x * x }], klein });
const zijde = (x) => x < 0 ? 'links' : 'rechts';
// aantal decimalen van een getal (om "mooie" uitkomsten te kiezen)
const nDec = (v) => { const s = String(r10(Math.abs(v))); return (s.split('.')[1] || '').length; };

// poort: bergparabool y = a·x², y = hoeveel lager dan het hoogste punt
function sitPoort() {
  const [B, H] = kies([[8, 4], [10, 5], [6, 4.5], [12, 9], [8, 6], [10, 6]]);
  const a = r10(-H / ((B / 2) ** 2));
  return { B, H, a, w: B / 2,
    tekst: `Een poort heeft de vorm van een parabool. De poort is ${kg(B)} m breed en ${kg(H)} m hoog.<br>
      $x$ = de afstand tot het midden (in m).<br>
      $y$ = hoeveel de boog lager ligt dan het hoogste punt (in m).<br>
      De formule is $y = ${aTex(a)}x^2$.` };
}
const poortGraf = (P) => rgraf({ x: [-P.w, P.w], y: [-nice(P.H * 1.05), 0], xs: P.w <= 4 ? 0.5 : 1, xn: 'x (m)', yn: 'y (m)', functies: [{ f: (x) => P.a * x * x }] });

const TERRAS = 'Een vierkant terras heeft $n$ tegels aan elke zijde.<br>Het aantal tegels dat je nodig hebt, is $T(n) = n^2$.';
const VUISTREGEL = 'De vuistregel uit de rijschool: deel de snelheid door 10 en neem het kwadraat.<br>Als formule: $d(v) = 0{,}01v^2$.<br>$v$ = de snelheid (in km/u), $d$ = de remweg (in m).';
const DROOGNAT = 'Op een <b>droog</b> wegdek remt een auto beter: daar is de remweg ongeveer $d(v) = 0{,}005v^2$.<br>Op een <b>nat</b> wegdek geldt de vuistregel: $d(v) = 0{,}01v^2$.<br>($v$ in km/u, $d$ in m)';
const STEEN = 'Een steen valt van een brug.<br>De valafstand $s$ (in m) na $t$ seconden is $s(t) = 4{,}9t^2$.';
// ===================================================================
//  TWEEDEGRAADSFUNCTIES IN CONTEXTEN + — zes delen en een eindtest
// ===================================================================
const wortel = (x) => Math.sqrt(x);
const zeker = (x, d) => !W.grensgeval(x, d);
const tot = (f) => { for (let i = 0; i < 4000; i++) { const r = f(); if (r) return r; } throw new Error('geen geldige vraag gevonden'); };
const PLUS = (t) => `<div class="kader werk"><div class="kader-titel">Terugrekenen en formules opstellen</div>${t}</div>`;
const sq = (x) => x < 0 ? `(${tg(x)})^2` : `${tg(x)}^2`;
const ong = (x, d) => Math.abs(W.rond(x, d) - x) < 1e-9 ? '=' : '\\approx'; // = als de uitkomst exact is
const euro = (x) => W.komma(x, 2, true);

// ===================================================================
//  1 · HALFPIPE EN HANGBRUG +
// ===================================================================
const HP = [[6, 2.25], [8, 4], [8, 2], [10, 5], [6, 1.8], [4, 1], [12, 4.5], [10, 3], [8, 3.2], [12, 3.6], [5, 2.5], [10, 4], [16, 4], [6, 2.7]]; // [breedte, hoogte rand]
function vraagHpA() {
  const [B, H] = kies(HP), w = B / 2, a = r10(H / (w * w));
  return { soort: 'hpa', opdracht: 'Tip: de rand ligt op de halve breedte van het midden. Vul dat punt in h = a·x² in en zoek a.', html: `${gegeven(`Een halfpipe is ${kg(B)} m breed. De randen zijn ${kg(H)} m hoog.<br>$x$ = de afstand tot het midden (in m), $h$ = de hoogte (in m). De formule heeft de vorm $h(x) = a \\cdot x^2$.`)}${vraag('Hoe groot is $a$? Schrijf daarna de formule.')}`,
    sleutel: 'hpa' + B + H, rapport: `halfpipe ${kg(B)} m breed, ${kg(H)} m hoog: a`,
    antw: delen(['a =', getal(a, { dec: 4 })], ['\\text{formule:}', texKeuze(`h(x) = ${aTex(a)}x^2`, [`h(x) = ${aTex(r10(H / B))}x^2`, `h(x) = ${aTex(r10(H / w))}x^2`, `h(x) = ${aTex(r10(w * w / H))}x^2`])]),
    uitleg: [`\\text{de rand: } x = ${tg(w)}, \\; h = ${tg(H)}`, `${tg(H)} = a \\cdot ${tg(w)}^2 = a \\cdot ${tg(w * w)}`, `a = ${tg(H)} : ${tg(w * w)} = ${tg(a)}`] };
}
function vraagHpTerug() {
  return tot(() => {
    const S = kiesDal(), y = r10(S.rand * kies([0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 0.25, 0.75])), x = wortel(y / S.a);
    if (!zeker(x, 2) || nDec(y) > 2) return null;
    return { soort: 'hpterug', opdracht: `Tip: vul ${S.fn} in en zoek x. Er zijn twee plaatsen: links en rechts van het midden.`, html: `${gegeven(S.tekst)}${figuur(dalGraf(S))}${vraag(`Op welke afstand van het midden ${S.waar} ${S.wie} ${kg(y)} m hoog?`)}`,
      sleutel: 'ht' + S.soort + S.a + y, rapport: `${S.soort}: waar is ${S.fn} = ${kg(y)}?`,
      antw: getal(x, { dec: 2, voor: 'x \\approx \\pm', na: '\\text{ m}' }),
      uitleg: [`${tg(S.a)} \\cdot x^2 = ${tg(y)}`, `x^2 = ${tg(y)} : ${tg(S.a)} = ${tg(y / S.a)}`, `x = \\pm\\sqrt{${tg(y / S.a)}} \\approx \\pm ${tg(W.rond(x, 2))}`, tx(`Op ongeveer ${kg(W.rond(x, 2))} m links én rechts van het midden.`)] };
  });
}
function vraagHangers() {
  return tot(() => {
    const [a, w] = kies([[0.01, 50], [0.02, 40], [0.005, 60], [0.01, 40]]), c = kies([1, 1.5, 2, 2.5]), stap = 10;
    const xs = []; for (let x = -w + stap; x <= w - stap; x += stap) xs.push(x);
    const lengtes = xs.map(x => r10(c + a * x * x)), som = r10(lengtes.reduce((s, x) => s + x, 0)), x0 = kies(xs.filter(x => x > 0));
    return { soort: 'hangers', opdracht: 'Tip: een hangkabel loopt van de grote kabel naar het brugdek. Tel de hoogte boven het laagste punt op bij de afstand tot het brugdek.', html: `${gegeven(`De grote kabel van een hangbrug: $y = ${aTex(a)}x^2$ ($x$ = afstand tot het midden, $y$ = hoe hoog de kabel hangt boven zijn laagste punt, in m).<br>De pijlers staan ${2 * w} m uit elkaar. Het laagste punt van de kabel hangt ${kg(c)} m boven het brugdek.<br>Om de 10 m hangt er een verticale hangkabel tussen de grote kabel en het brugdek (niet bij de pijlers zelf).`)}${vragen(`Hoe lang is de hangkabel op ${x0} m van het midden?`, `Hoeveel hangkabels zijn er?`, 'Hoeveel meter hangkabel heb je in totaal nodig?')}`,
      sleutel: 'hg' + a + w + c, rapport: `hangbrug: hangkabels (a = ${kg(a)}, c = ${kg(c)})`,
      antw: delen([`1. \\text{ op ${x0} m:}`, getal(c + a * x0 * x0, { dec: 2, voor: '', na: '\\text{ m}' })], ['2. \\text{ aantal:}', getal(xs.length, { na: '\\text{ hangkabels}' })], ['3. \\text{ totaal:}', getal(som, { dec: 2, voor: '', na: '\\text{ m}' })]),
      uitleg: [`${tg(c)} + ${tg(a)} \\cdot ${x0}^2 = ${tg(c + a * x0 * x0)} \\text{ m}`, tx(`Van −${w - stap} tot ${w - stap}, om de 10 m: ${xs.length} hangkabels.`), `${lengtes.map(tg).join(' + ')} = ${tg(som)} \\text{ m}`, tx('Tip: door de symmetrie moet je maar de helft uitrekenen en verdubbelen (plus de middelste).')] };
  });
}
function vraagSteiler() {
  const S = sitHalfpipe(), w = S.w, k = kies([2, 3]);
  const d1 = r10(S.a * (1 - 0)), dn = r10(S.a * (w * w - (w - 1) ** 2));
  return { soort: 'steiler', opdracht: 'Tip: bereken de stijging op de eerste meter en op de laatste meter. Deel daarna.', html: `${gegeven(S.tekst)}${vragen('Hoeveel keer zoveel stijgt de hoogte op de laatste meter (tot aan de rand) als op de eerste meter (vanaf het midden)?', `Een tweede halfpipe heeft de formule $h(x) = ${aTex(r10(k * S.a))}x^2$ en is even breed. Hoeveel keer zo hoog zijn de randen?`)}`,
    sleutel: 'stl' + S.a + k, rapport: 'halfpipe: steilheid vergelijken',
    antw: delen(['1. \\text{ hoeveel keer zoveel:}', getal(dn / d1, { dec: 2, voor: '', na: '\\text{ keer}' })], ['2. \\text{ hoeveel keer zo hoog:}', getal(k, { voor: '', na: '\\text{ keer}' })]),
    uitleg: [`\\text{eerste meter: } ${tg(d1)}, \\quad \\text{laatste meter: } ${tg(S.a * w * w)} - ${tg(S.a * (w - 1) ** 2)} = ${tg(dn)}`, `${tg(dn)} : ${tg(d1)} = ${tg(r10(dn / d1))}`, tx(`a wordt ${k} keer zo groot, dus elke hoogte (ook de rand) wordt ${k} keer zo groot.`)] };
}
const D1 = {
  nr: 1, titel: 'Halfpipe en hangbrug +', kort: 'De formule opstellen, terugrekenen naar x, hangkabels, steilheid vergelijken.', rekenmachine: true,
  theorie: `${AFSPRAKEN}<div class="kader def"><div class="kader-titel">Herhaling: de halfpipe $h(x) = ax^2$</div>
      <p>$x$ = de afstand tot het midden, $h$ = de hoogte. Het laagste punt is de top $(0, 0)$. De grafiek is symmetrisch ten opzichte van de $y$-as: links en rechts even hoog.</p></div>
    ${PLUS(`<p><b>De formule opstellen.</b> Ken je één punt, bv. de rand, dan vind je $a$. Een halfpipe van 8 m breed met randen van 4 m hoog: de rand ligt op $x = 4$ en $h = 4$.</p>
      <p class="midden">$4 = a \\cdot 4^2 = 16a \\quad\\Rightarrow\\quad a = 4 : 16 = 0{,}25 \\quad\\Rightarrow\\quad h(x) = 0{,}25x^2$</p>
      <p><b>Terugrekenen.</b> Waar is de halfpipe 2 m hoog? $0{,}25x^2 = 2 \\Rightarrow x^2 = 2 : 0{,}25 = 8 \\Rightarrow x = \\pm\\sqrt{8} \\approx \\pm 2{,}83$ m: links én rechts van het midden.</p>
      <p><b>Hangkabels</b> van een hangbrug lopen van de grote kabel naar het brugdek. Hangt het laagste punt van de kabel 2 m boven het brugdek, dan is een hangkabel op $x$ m van het midden $2 + ax^2$ meter lang.</p>
      <p><b>a groter maken</b>: $a$ 2 keer zo groot maakt elke hoogte 2 keer zo groot.</p>`)}`,
  voorbeelden: [
    { html: `${gegeven('Een halfpipe is 6 m breed en de randen zijn 1,8 m hoog.')}${vraag('Bepaal de formule $h(x) = ax^2$.')}`, stappen: ['\\text{rand: } x = 3, \\; h = 1{,}8', '1{,}8 = a \\cdot 9 \\Rightarrow a = 0{,}2', 'h(x) = 0{,}2x^2'] },
    { html: `${gegeven('Hangbrug: $y = 0{,}01x^2$.')}${vraag('Op welke afstand van het midden hangt de kabel 9 m boven zijn laagste punt?')}`, stappen: ['0{,}01x^2 = 9 \\Rightarrow x^2 = 900', 'x = \\pm 30 \\text{ m}'] },
  ],
  soorten: {
    hpa: { naam: 'De formule opstellen', gen: vraagHpA }, hpterug: { naam: 'Terugrekenen: waar is het zo hoog?', gen: vraagHpTerug },
    hangers: { naam: 'Hangkabels van een hangbrug', gen: vraagHangers }, steiler: { naam: 'Steilheid vergelijken', gen: vraagSteiler },
  },
  oefenMix: [['hpa', 1], ['hpterug', 2], ['hangers', 1], ['steiler', 1]],
  test: [['hpa', 1], ['hpterug', 2], ['hangers', 1], ['steiler', 1]], testSchudden: true,
};

// ===================================================================
//  2 · TERRAS EN OPPERVLAKTE +
// ===================================================================
function vraagRand() {
  const n = rnd(4, 15), r = kies([1, 2]);
  const binnen = n * n, buiten = (n + 2 * r) ** 2, rood = buiten - binnen;
  return { soort: 'rand', opdracht: 'Tip: bereken het hele terras en het witte midden. Trek af.', html: `${gegeven(TERRAS)}<p>Een terras heeft een wit vierkant midden van ${n} bij ${n} tegels. Rondom komt een rode rand van ${r} ${r === 1 ? 'tegel' : 'tegels'} breed.</p>${vragen('Hoeveel tegels aan elke zijde heeft het hele terras?', 'Hoeveel rode tegels heb je nodig?')}`,
    sleutel: 'rd' + n + r, rapport: `terras ${n}×${n} met rand ${r}`,
    antw: delen(['1. \\text{ tegels aan elke zijde:}', getal(n + 2 * r)], ['2. \\text{ rode tegels:}', getal(rood, { na: '\\text{ tegels}' })]),
    uitleg: [`${n} + 2 \\cdot ${r} = ${n + 2 * r} \\text{ tegels aan elke zijde}`, `T(${n + 2 * r}) - T(${n}) = ${buiten} - ${binnen} = ${rood}`] };
}
function vraagFactorTerug() {
  return tot(() => {
    const k = kies([2, 3, 5, 1.5, 10, 0.5, 6, 7, 8, 2.5, 0.25, 12]), x = wortel(k); if (!zeker(x, 2)) return null;
    return { soort: 'factorterug', opdracht: 'Tip: bij een kwadraat wordt de oppervlakte factor² keer zo groot. Hier ken je de factor van de oppervlakte: neem de vierkantswortel.', html: `${gegeven('De oppervlakte $A$ van een vierkant met zijde $z$ is $A(z) = z^2$.')}<p>Je wil een vierkant maken met een oppervlakte die <b>${k === 0.5 ? 'half zo groot' : kg(k) + ' keer zo groot'}</b> is.</p>${vraag('Met welk getal moet je de zijde vermenigvuldigen?')}`,
      sleutel: 'ft' + k, rapport: `oppervlakte ×${kg(k)}: zijde ×?`,
      antw: getal(x, { dec: 2, voor: '\\text{zijde} \\times', na: '' }),
      uitleg: [`(f \\cdot z)^2 = f^2 \\cdot z^2, \\text{ dus } f^2 = ${tg(k)}`, `f = \\sqrt{${tg(k)}} \\approx ${tg(W.rond(x, 2))}`, tx(k === 2 ? 'Let op: om de oppervlakte te verdubbelen, maak je de zijde niet 2 keer zo groot, maar ongeveer 1,41 keer.' : 'De zijde verandert minder dan de oppervlakte.')] };
  });
}
function vraagRechthoekTerug() {
  return tot(() => {
    const k = kies([2, 3, 4, 1.5]), A = kies([50, 72, 100, 120, 150, 200, 96, 60]), b = wortel(A / k); if (!zeker(b, 2)) return null;
    return { soort: 'rhterug', opdracht: 'Tip: deel eerst door het getal voor b². Neem dan de vierkantswortel.', html: `${gegeven(`Een rechthoek heeft breedte $b$ (in m) en lengte ${kg(k)}$b$.<br>De oppervlakte is $A(b) = ${tg(k)}b^2$.`)}<p>De oppervlakte moet ${A} m² zijn.</p>${vragen('Hoe breed is de rechthoek?', 'Hoe lang is de rechthoek?')}`,
      sleutel: 'rt' + k + A, rapport: `${kg(k)}b² = ${A}`,
      antw: delen(['1. \\; b \\approx', getal(b, { dec: 2, voor: '', na: '\\text{ m}' })], ['2. \\text{ lengte} \\approx', getal(k * b, { dec: 2, voor: '', na: '\\text{ m}' })]),
      uitleg: [`${tg(k)}b^2 = ${A} \\Rightarrow b^2 = ${tg(A / k)}`, `b = \\sqrt{${tg(r10(A / k))}} \\approx ${tg(W.rond(b, 2))} \\text{ m (een breedte is positief)}`, `\\text{lengte: } ${tg(k)} \\cdot ${tg(b, 4)} \\approx ${tg(W.rond(k * b, 2))} \\text{ m}`] };
  });
}
function vraagBudget() {
  return tot(() => {
    const prijs = kies([4, 5, 6, 8, 2.5, 3.5]), geld = rnd(30, 150) * 10, aantal = Math.floor(geld / prijs), n = Math.floor(wortel(aantal)); if (n < 4) return null;
    const naam = kies(['Jonas', 'Yasmina', 'Ilias', 'Fien', 'Bram']);
    return { soort: 'budget', opdracht: 'Tip: bereken eerst hoeveel tegels je kan kopen. Zoek dan het grootste kwadraat.', html: `${gegeven(TERRAS)}<p>Een tegel kost € ${euro(prijs)}. ${naam} heeft € ${geld} en wil een zo groot mogelijk vierkant terras.</p>${vragen('Hoeveel tegels kan hij kopen?', 'Hoeveel tegels aan elke zijde heeft het grootste vierkante terras?', 'Hoeveel geld houdt hij over als hij enkel die tegels koopt?')}`,
      sleutel: 'bg' + prijs + geld, rapport: `budget € ${geld}, tegel € ${kg(prijs)}`,
      antw: delen(['1. \\text{ tegels kopen:}', getal(aantal, { na: '\\text{ tegels}' })], ['2. \\text{ aan elke zijde:}', getal(n, { na: '\\text{ tegels}' })], ['3. \\text{ over:}', getal(geld - n * n * prijs, { dec: 2, voor: '€\\,', na: '' })]),
      uitleg: [`${geld} : ${tg(prijs)} ${ong(geld / prijs, 2)} ${tg(W.rond(geld / prijs, 2))} \\Rightarrow ${aantal} \\text{ tegels}`, `${n}^2 = ${n * n} \\leq ${aantal} < ${(n + 1) ** 2} = ${n + 1}^2`, `${geld} - ${n * n} \\cdot ${tg(prijs)} = ${tg(geld - n * n * prijs)} \\text{ euro}`] };
  });
}
const D2 = {
  nr: 2, titel: 'Terras en oppervlakte +', kort: 'Een rand rond een terras, de zijde bij een gegeven factor, rechthoeken en een budget.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Herhaling</div>
      <p>Een vierkant terras met $n$ tegels aan elke zijde heeft $T(n) = n^2$ tegels. De oppervlakte van een vierkant is $A(z) = z^2$: zijde 2 keer zo groot geeft een oppervlakte die 4 keer zo groot is.</p></div>
    ${PLUS(`<p><b>Een rand</b>: een wit midden van 6 bij 6 met een rode rand van 1 tegel breed. Het hele terras is $6 + 2 = 8$ bij 8. Rode tegels: $64 - 36 = 28$.</p>
      <p><b>Omgekeerd denken</b>: de oppervlakte moet 2 keer zo groot worden. Met welk getal $f$ vermenigvuldig je de zijde? $f^2 = 2$, dus $f = \\sqrt{2} \\approx 1{,}41$ (niet 2!).</p>
      <p><b>Rechthoek</b> met lengte $3b$: $A(b) = 3b^2$. Oppervlakte 75 m²: $3b^2 = 75 \\Rightarrow b^2 = 25 \\Rightarrow b = 5$ m en de lengte is 15 m.</p>`)}`,
  voorbeelden: [
    { html: `${gegeven(TERRAS)}<p>Een wit midden van 10 bij 10 tegels krijgt een rode rand van 2 tegels breed.</p>${vraag('Hoeveel rode tegels heb je nodig?')}`, stappen: ['10 + 2 \\cdot 2 = 14 \\text{ tegels aan elke zijde}', '14^2 - 10^2 = 196 - 100 = 96 \\text{ rode tegels}'] },
    { html: `${gegeven('$A(z) = z^2$')}${vraag('De oppervlakte moet 3 keer zo groot worden. Met welk getal vermenigvuldig je de zijde?')}`, stappen: ['f^2 = 3', 'f = \\sqrt{3} \\approx 1{,}73'] },
  ],
  soorten: {
    rand: { naam: 'Een rand rond het terras', gen: vraagRand }, factorterug: { naam: 'Oppervlakte k keer zo groot: de zijde?', gen: vraagFactorTerug },
    rhterug: { naam: 'Rechthoek: breedte bij een oppervlakte', gen: vraagRechthoekTerug }, budget: { naam: 'Een terras met een budget', gen: vraagBudget },
  },
  oefenMix: [['rand', 1], ['factorterug', 1], ['rhterug', 1], ['budget', 1]],
  test: [['rand', 1], ['factorterug', 1], ['rhterug', 2], ['budget', 1]], testSchudden: true,
};

// ===================================================================
//  3 · DE REMWEG +
// ===================================================================
function vraagMaxSnel() {
  return tot(() => {
    const d = rnd(12, 140), v = 10 * wortel(d), nat = Math.random() < 0.6, a = nat ? 0.01 : 0.005, vv = wortel(d / a); if (!zeker(vv, 1) || Number.isInteger(r10(vv))) return null;
    return { soort: 'maxsnel', opdracht: 'Tip: de remweg mag hoogstens zo lang zijn als de afstand tot het obstakel. Vul d in en zoek v.', html: `${gegeven(DROOGNAT)}<p>Een chauffeur ziet plots ${d} m voor zich een obstakel op een <b>${nat ? 'nat' : 'droog'}</b> wegdek. (We rekenen enkel met de remweg.)</p>${vraag('Hoe snel mocht hij maximaal rijden om nog op tijd stil te staan?')}`,
      sleutel: 'ms' + d + nat, rapport: `max snelheid bij ${d} m (${nat ? 'nat' : 'droog'})`,
      antw: getal(vv, { dec: 1, voor: 'v \\approx', na: '\\text{ km/u}' }),
      uitleg: [`${tg(a)} \\cdot v^2 = ${d}`, `v^2 = ${d} : ${tg(a)} = ${tg(d / a)}`, `v = \\sqrt{${tg(d / a)}} \\approx ${tg(W.rond(vv, 1))} \\text{ km/u}`] };
  });
}
function vraagRemspoor() {
  return tot(() => {
    const zone = kies([30, 50, 70, 90]), d = rnd(Math.round(0.6 * zone * zone * 0.005), Math.round(1.6 * zone * zone * 0.005)), v = wortel(d / 0.005); if (!zeker(v, 1)) return null;
    const te = v > zone;
    return { soort: 'remspoor', opdracht: 'Tip: het remspoor is de remweg. Het wegdek was droog. Zoek v en vergelijk met de toegelaten snelheid.', html: `${gegeven(DROOGNAT)}<p>Na een ongeval in een zone ${zone} meet de politie een remspoor van ${d} m op een droog wegdek.</p>${vragen('Hoe snel reed de auto ongeveer?', `Reed de auto te snel?`)}`,
      sleutel: 'rs' + zone + d, rapport: `remspoor ${d} m in zone ${zone}`,
      antw: delen(['1. \\; v \\approx', getal(v, { dec: 1, voor: '', na: '\\text{ km/u}' })], ['2. \\text{ Te snel?}', jaNee(te, 'ja, te snel', 'nee, niet te snel')]),
      uitleg: [`0{,}005v^2 = ${d} \\Rightarrow v^2 = ${tg(d / 0.005)}`, `v = \\sqrt{${tg(d / 0.005)}} \\approx ${tg(W.rond(v, 1))} \\text{ km/u}`, tx(`${kg(W.rond(v, 1))} km/u ${te ? '>' : '≤'} ${zone} km/u: ${te ? 'te snel' : 'niet te snel'}.`)] };
  });
}
function vraagZelfde() {
  return tot(() => {
    const v = kies([30, 40, 50, 60, 70, 80, 90]), richting = kies(['natNaarDroog', 'droogNaarNat']);
    const d = richting === 'natNaarDroog' ? 0.01 * v * v : 0.005 * v * v, a2 = richting === 'natNaarDroog' ? 0.005 : 0.01, v2 = wortel(d / a2); if (!zeker(v2, 1)) return null;
    const van = richting === 'natNaarDroog' ? 'nat' : 'droog', naar = richting === 'natNaarDroog' ? 'droog' : 'nat';
    return { soort: 'zelfde', opdracht: 'Tip: bereken eerst de remweg in de eerste situatie. Zoek dan de snelheid met dezelfde remweg in de tweede situatie.', html: `${gegeven(DROOGNAT)}${vragen(`Hoe lang is de remweg bij ${v} km/u op een ${van} wegdek?`, `Bij welke snelheid heb je op een ${naar} wegdek dezelfde remweg?`)}`,
      sleutel: 'zf' + v + richting, rapport: `zelfde remweg ${van} ${v} → ${naar}`,
      antw: delen(['1. \\text{ remweg:}', getal(d, { dec: 1, voor: '', na: '\\text{ m}' })], ['2. \\; v \\approx', getal(v2, { dec: 1, voor: '', na: '\\text{ km/u}' })]),
      uitleg: [`d(${v}) = ${tg(richting === 'natNaarDroog' ? 0.01 : 0.005)} \\cdot ${v * v} = ${tg(d)} \\text{ m}`, `${tg(a2)} \\cdot v^2 = ${tg(d)} \\Rightarrow v^2 = ${tg(d / a2)} \\Rightarrow v \\approx ${tg(W.rond(v2, 1))} \\text{ km/u}`] };
  });
}
function vraagProcent() {
  const p = kies([10, 20, 30, 50]), f = 1 + p / 100, q = r10((f * f - 1) * 100);
  return { soort: 'procent', opdracht: 'Tip: kies zelf een snelheid, bv. 100 km/u, en reken de remweg uit voor en na.', html: `${gegeven(VUISTREGEL)}${vraag(`Je rijdt ${p} % sneller. Met hoeveel procent wordt je remweg langer?`)}`,
    sleutel: 'pc' + p, rapport: `${p} % sneller: remweg?`,
    antw: getal(q, { dec: 1, voor: '', na: '\\text{ \\% langer}' }),
    uitleg: [`\\text{bv. } 100 \\text{ km/u} \\to d = 100 \\text{ m}`, `${tg(100 * f)} \\text{ km/u} \\to d = 0{,}01 \\cdot ${tg(10000 * f * f)} = ${tg(100 * f * f)} \\text{ m}`, tx(`${kg(q)} % langer (niet ${p} %): de snelheid staat in het kwadraat.`)] };
}
const D3 = {
  nr: 3, titel: 'De remweg +', kort: 'Maximale snelheid, een remspoor, nat en droog vergelijken, procenten.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Herhaling</div>
      <p>Vuistregel (ook op een <b>nat</b> wegdek): $d(v) = 0{,}01v^2$. Op een <b>droog</b> wegdek: $d(v) = 0{,}005v^2$. ($v$ in km/u, $d$ in m)</p></div>
    ${PLUS(`<p><b>Terugrekenen naar de snelheid</b>: de remweg op een droog wegdek is 32 m. $0{,}005v^2 = 32 \\Rightarrow v^2 = 32 : 0{,}005 = 6400 \\Rightarrow v = 80$ km/u. Zo berekent de politie de snelheid uit een remspoor.</p>
      <p><b>Dezelfde remweg</b>: bij 50 km/u op een nat wegdek is de remweg 25 m. Op een droog wegdek heb je 25 m bij $0{,}005v^2 = 25 \\Rightarrow v^2 = 5000 \\Rightarrow v \\approx 70{,}7$ km/u.</p>
      <p><b>Procenten</b>: 10 % sneller rijden geeft een remweg die $1{,}1^2 = 1{,}21$ keer zo lang is: 21 % langer.</p>`)}`,
  voorbeelden: [
    { html: `${gegeven(DROOGNAT)}${vraag('Een remspoor van 45 m op een droog wegdek. Hoe snel reed de auto?')}`, stappen: ['0{,}005v^2 = 45 \\Rightarrow v^2 = 9000', 'v = \\sqrt{9000} \\approx 94{,}9 \\text{ km/u}'] },
  ],
  soorten: {
    maxsnel: { naam: 'Maximale snelheid', gen: vraagMaxSnel }, remspoor: { naam: 'Het remspoor', gen: vraagRemspoor },
    zelfde: { naam: 'Dezelfde remweg op nat en droog', gen: vraagZelfde }, procent: { naam: 'Procent sneller', gen: vraagProcent },
  },
  oefenMix: [['maxsnel', 1], ['remspoor', 1], ['zelfde', 1], ['procent', 1]],
  test: [['maxsnel', 1], ['remspoor', 2], ['zelfde', 1], ['procent', 1]], testSchudden: true,
};

// ===================================================================
//  4 · VALLEN +
// ===================================================================
function vraagValtijd() {
  return tot(() => {
    const H = kies([20, 30, 45, 50, 60, 80, 100, 120, 15, 25]), t = wortel(H / 4.9); if (!zeker(t, 2)) return null;
    return { soort: 'valtijd', opdracht: 'Tip: de steen raakt het water als de valafstand gelijk is aan de hoogte. Zoek t.', html: `${gegeven(STEEN)}<p>De brug ligt ${H} m boven het water.</p>${vraag('Na hoeveel seconden valt de steen in het water?')}`,
      sleutel: 'vt' + H, rapport: `valtijd van ${H} m`,
      antw: getal(t, { dec: 2, voor: 't \\approx', na: '\\text{ s}' }),
      uitleg: [`4{,}9t^2 = ${H}`, `t^2 = ${H} : 4{,}9 \\approx ${tg(H / 4.9, 4)}`, `t \\approx ${tg(W.rond(t, 2))} \\text{ s (een tijd is positief)}`] };
  });
}
function vraagHalfweg() {
  return tot(() => {
    const H = kies([50, 55, 60, 65, 70, 80]), T = H >= 60 ? 3 : 2, d = 5 * T * T, half = d / 2, t = wortel(half / 5); if (!zeker(t, 2)) return null;
    return { soort: 'halfweg', opdracht: 'Tip: bereken eerst hoe ver het bakje in totaal vrij valt. Zoek dan wanneer het de helft daarvan gevallen is.', html: `${gegeven(sitTorenTekst(H, T))}${vragen(`Hoeveel meter valt het bakje in de ${T} seconden vrije val?`, 'Na hoeveel seconden is het bakje de helft daarvan gevallen?', 'Is dat de helft van de tijd?')}`,
      sleutel: 'hw' + H, rapport: `vrijevaltoren ${H} m: halfweg`,
      antw: delen(['1. \\text{ totaal:}', getal(d, { voor: '', na: '\\text{ m}' })], ['2. \\; t \\approx', getal(t, { dec: 2, voor: '', na: '\\text{ s}' })], ['3. \\text{ De helft van de tijd?}', jaNee(false, 'ja', 'nee, later')]),
      uitleg: [`h(${T}) = -5 \\cdot ${T * T} = ${-d}: \\text{ ${d} m}`, `-5t^2 = ${tg(-half)} \\Rightarrow t^2 = ${tg(half / 5)} \\Rightarrow t \\approx ${tg(W.rond(t, 2))} \\text{ s}`, tx(`De helft van de tijd is ${kg(T / 2)} s. Het bakje valt in het begin trager, dus het duurt langer dan de helft van de tijd.`)] };
  });
}
function sitTorenTekst(H, T) { return `In een pretpark staat een vrijevaltoren van ${H} m hoog. Het bakje start bovenaan en valt ${T} seconden vrij naar beneden. Daarna wordt het afgeremd.<br>$t$ = de tijd (in s). $h$ = de plaats ten opzichte van het startpunt (in m), negatief = onder het startpunt.<br>De formule is $h(t) = -5t^2$.`; }
function vraagPut() {
  return tot(() => {
    const t = kies([1.5, 2, 2.5, 3, 1.8, 2.2, 2.4, 2.8]), s = 4.9 * t * t;
    return { soort: 'put', opdracht: 'Tip: vul de tijd in de formule in. (Je mag de tijd van het geluid verwaarlozen.)', html: `${gegeven(STEEN)}<p>Je laat een steen vallen in een put. Na ${kg(t)} s hoor je de plons.</p>${vraag('Hoe diep ligt het water?')}`,
      sleutel: 'pt' + t, rapport: `put: plons na ${kg(t)} s`,
      antw: getal(s, { dec: 2, voor: '', na: '\\text{ m diep}' }), uitleg: [`s(${tg(t)}) = 4{,}9 \\cdot ${tg(t * t)} = ${tg(s)} \\text{ m}`] };
  });
}
function vraagTweeStenen() {
  const t = kies([2, 3, 4]);
  const s1 = 4.9 * t * t, s2 = 4.9 * (t - 1) ** 2;
  return { soort: 'tweestenen', opdracht: 'Tip: de tweede steen is op elk moment 1 s korter aan het vallen. Bereken beide valafstanden en trek af.', html: `${gegeven(STEEN)}<p>Je laat een steen vallen. Precies 1 s later laat je een tweede steen vallen.</p>${vragen(`Hoeveel meter is de eerste steen gevallen na ${t} s?`, 'Hoeveel meter is de tweede steen op dat moment gevallen?', 'Hoe ver zitten de stenen dan uit elkaar? Wordt die afstand groter of kleiner?')}`,
    sleutel: 'ts' + t, rapport: `twee stenen, t = ${t}`,
    antw: delen(['1. \\text{ eerste steen:}', getal(s1, { dec: 2, voor: '', na: '\\text{ m}' })], ['2. \\text{ tweede steen:}', getal(s2, { dec: 2, voor: '', na: '\\text{ m}' })],
      ['3. \\text{ afstand:}', getal(s1 - s2, { dec: 2, voor: '', na: '\\text{ m}' })], ['\\text{De afstand wordt}', zinnen('groter: de eerste steen valt steeds sneller.', ['kleiner: de tweede steen haalt de eerste in.', 'gelijk: ze vallen allebei met 4,9t².'], { lijst: false })]),
    uitleg: [`s(${t}) = ${tg(s1)}, \\quad s(${t - 1}) = ${tg(s2)}`, `${tg(s1)} - ${tg(s2)} = ${tg(s1 - s2)} \\text{ m}`, tx('Elke seconde valt de eerste steen meer meter dan de tweede: de afstand wordt groter.')] };
}
const D4 = {
  nr: 4, titel: 'Vallen +', kort: 'Hoe lang duurt de val? Halfweg in de vrijevaltoren, een put, twee stenen.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Herhaling</div>
      <p>Vrijevaltoren: $h(t) = -5t^2$ (negatief = onder het startpunt). Vallende steen: valafstand $s(t) = 4{,}9t^2$. ($t$ in s, afstanden in m)</p></div>
    ${PLUS(`<p><b>Hoe lang duurt de val?</b> Een steen valt 45 m: $4{,}9t^2 = 45 \\Rightarrow t^2 = 45 : 4{,}9 \\approx 9{,}18 \\Rightarrow t \\approx 3{,}03$ s.</p>
      <p><b>Halfweg is niet halverwege de tijd.</b> In 3 s valt het bakje 45 m. De helft, 22,5 m, bereikt het na $\\sqrt{22{,}5 : 5} \\approx 2{,}12$ s: later dan 1,5 s, want in het begin valt het trager.</p>
      <p><b>Twee stenen</b>, de tweede 1 s later: na 3 s is de eerste $4{,}9 \\cdot 9 = 44{,}1$ m gevallen, de tweede $4{,}9 \\cdot 4 = 19{,}6$ m. Ze zitten 24,5 m uit elkaar, en die afstand wordt steeds groter.</p>`)}`,
  voorbeelden: [
    { html: `${gegeven(STEEN)}${vraag('Na hoeveel seconden valt een steen van 80 m hoogte in het water?')}`, stappen: ['4{,}9t^2 = 80 \\Rightarrow t^2 \\approx 16{,}33', 't \\approx 4{,}04 \\text{ s}'] },
  ],
  soorten: {
    valtijd: { naam: 'Hoe lang duurt de val?', gen: vraagValtijd }, halfweg: { naam: 'Halfweg in de vrijevaltoren', gen: vraagHalfweg },
    put: { naam: 'Hoe diep is de put?', gen: vraagPut }, tweestenen: { naam: 'Twee stenen', gen: vraagTweeStenen },
  },
  oefenMix: [['valtijd', 1], ['halfweg', 1], ['put', 1], ['tweestenen', 1]],
  test: [['valtijd', 2], ['halfweg', 1], ['put', 1], ['tweestenen', 1]], testSchudden: true,
};

// ===================================================================
//  5 · DE BOOG VAN EEN POORT +
// ===================================================================
function vraagPoortA() {
  const [B, H] = kies([[8, 4], [10, 5], [6, 4.5], [12, 9], [8, 6], [10, 6], [14, 7], [6, 3]]), w = B / 2, a = r10(-H / (w * w));
  return { soort: 'poorta', opdracht: 'Tip: aan de rand (op de halve breedte) ligt de boog zo laag als de poort hoog is. y is daar dus negatief.', html: `${gegeven(`Een poort heeft de vorm van een parabool. Ze is ${kg(B)} m breed en ${kg(H)} m hoog.<br>$x$ = de afstand tot het midden (in m), $y$ = hoeveel de boog lager ligt dan het hoogste punt (in m).`)}${vraag('Bepaal $a$ in de formule $y = a \\cdot x^2$.')}`,
    sleutel: 'pa' + B + H, rapport: `poort ${kg(B)}×${kg(H)}: a`,
    antw: getal(a, { dec: 4, voor: 'a =' }), uitleg: [`\\text{rand: } x = ${tg(w)}, \\; y = ${tg(-H)}`, `${tg(-H)} = a \\cdot ${tg(w * w)}`, `a = ${tg(-H)} : ${tg(w * w)} = ${tg(a)}`] };
}
function vraagBreedteOpHoogte() {
  return tot(() => {
    const P = sitPoort(), h = r10(kies([0.25, 0.4, 0.5, 0.6, 0.75]) * P.H), x = wortel((P.H - h) / -P.a); if (!zeker(2 * x, 2) || nDec(h) > 2) return null;
    return { soort: 'breedte', opdracht: 'Tip: hoeveel lager dan het hoogste punt ligt die hoogte? Vul dat (negatief) in voor y en zoek x. De breedte is 2·x.', html: `${gegeven(P.tekst)}${figuur(poortGraf(P))}${vragen(`Hoeveel meter lager dan het hoogste punt ligt een hoogte van ${kg(h)} m boven de grond?`, `Hoe breed is de poort op ${kg(h)} m boven de grond?`)}`,
      sleutel: 'bh' + P.B + P.H + h, rapport: `poort: breedte op ${kg(h)} m`,
      antw: delen(['1. \\text{ lager:}', getal(P.H - h, { dec: 2, voor: '', na: '\\text{ m}' })], ['2. \\text{ breedte:}', getal(2 * x, { dec: 2, voor: '', na: '\\text{ m}' })]),
      uitleg: [`${tg(P.H)} - ${tg(h)} = ${tg(P.H - h)}: \\; y = ${tg(h - P.H)}`, `${tg(P.a)} \\cdot x^2 = ${tg(h - P.H)} \\Rightarrow x^2 = ${tg((P.H - h) / -P.a, 4)} \\Rightarrow x ${ong(x, 4)} \\pm ${tg(W.rond(x, 4))}`, `\\text{breedte: } 2 \\cdot ${tg(W.rond(x, 4))} ${ong(2 * x, 2)} ${tg(W.rond(2 * x, 2))} \\text{ m}`] };
  });
}
function vraagMaxVoertuig() {
  return tot(() => {
    const P = sitPoort(), soort = kies(['hoog', 'breed']);
    if (soort === 'hoog') {
      const b = kies([1.8, 2, 2.2, 2.4, 2.5]); if (b >= P.B) return null; const hmax = P.H + P.a * (b / 2) ** 2; if (!zeker(hmax, 2)) return null;
      return { soort: 'maxvoertuig', opdracht: 'Tip: de randen van het voertuig zitten op de halve breedte van het midden. Daar is de boog het laagst boven het voertuig.', html: `${gegeven(P.tekst)}<p>Een voertuig van ${kg(b)} m breed rijdt door het midden van de poort.</p>${vraag('Hoe hoog mag het voertuig maximaal zijn?')}`,
        sleutel: 'mh' + P.B + P.H + b, rapport: `poort: max hoogte bij ${kg(b)} m breed`, antw: getal(hmax, { dec: 2, voor: '', na: '\\text{ m}' }),
        uitleg: [`x = ${tg(b / 2)}: \\; y = ${tg(P.a)} \\cdot ${tg((b / 2) ** 2)} = ${tg(P.a * (b / 2) ** 2)}`, `${tg(P.H)} - ${tg(-P.a * (b / 2) ** 2)} = ${tg(W.rond(hmax, 2))} \\text{ m}`] };
    }
    const hv = kies([2, 2.5, 3, 3.5, 4]); if (hv >= P.H - 0.3) return null; const x = wortel((P.H - hv) / -P.a); if (!zeker(2 * x, 2)) return null;
    return { soort: 'maxvoertuig', opdracht: 'Tip: zoek waar de boog precies zo hoog is als het voertuig. Daar mogen de randen zitten.', html: `${gegeven(P.tekst)}<p>Een voertuig van ${kg(hv)} m hoog rijdt door het midden van de poort.</p>${vraag('Hoe breed mag het voertuig maximaal zijn?')}`,
      sleutel: 'mb' + P.B + P.H + hv, rapport: `poort: max breedte bij ${kg(hv)} m hoog`, antw: getal(2 * x, { dec: 2, voor: '', na: '\\text{ m}' }),
      uitleg: [`y = ${tg(hv)} - ${tg(P.H)} = ${tg(hv - P.H)}`, `${tg(P.a)} \\cdot x^2 = ${tg(hv - P.H)} \\Rightarrow x ${ong(x, 4)} \\pm ${tg(W.rond(x, 4))}`, `\\text{breedte: } 2 \\cdot ${tg(W.rond(x, 4))} ${ong(2 * x, 2)} ${tg(W.rond(2 * x, 2))} \\text{ m}`] };
  });
}
function vraagBrug() {
  return tot(() => {
    const B = kies([20, 24, 30, 16]), H = kies([4, 5, 6, 3]), w = B / 2, a = r10(-H / (w * w)), boot = kies([4, 6, 8, 3]), bh = kies([2, 2.5, 3, 3.5, 4]);
    if (bh >= H) return null; const boog = r10(H + a * (boot / 2) ** 2), past = boog > bh; if (Math.abs(boog - bh) < 0.05 || !zeker(boog, 2)) return null;
    return { soort: 'brug', opdracht: 'Tip: stel eerst de formule op met de rand van de boog. Bereken dan de hoogte boven de randen van de boot.', html: `${gegeven(`Een brug over een rivier heeft een boog in de vorm van een parabool. Op het water is de boog ${B} m breed, en het hoogste punt ligt ${H} m boven het water.<br>$x$ = de afstand tot het midden, $y$ = hoeveel de boog lager ligt dan het hoogste punt (in m).`)}<p>Een boot van ${boot} m breed steekt ${kg(bh)} m boven het water uit. Hij vaart precies door het midden.</p>${vragen('Bepaal $a$ in $y = a \\cdot x^2$.', 'Hoe hoog is de boog boven de randen van de boot?', 'Kan de boot onder de brug door?')}`,
      sleutel: 'br' + B + H + boot + bh, rapport: `brug ${B}×${H}, boot ${boot} m breed, ${kg(bh)} m hoog`,
      antw: delen(['1. \\; a =', getal(a, { dec: 4, voor: '' })], ['2. \\text{ hoogte boven de randen:}', getal(boog, { dec: 2, voor: '', na: '\\text{ m}' })], ['3. \\text{ Kan het?}', jaNee(past, 'ja', 'nee')]),
      uitleg: [`${tg(-H)} = a \\cdot ${w}^2 \\Rightarrow a = ${tg(a)}`, `x = ${tg(boot / 2)}: \\; ${tg(H)} - ${tg(-a)} \\cdot ${tg((boot / 2) ** 2)} = ${tg(boog)} \\text{ m}`, tx(`${kg(W.rond(boog, 2))} m ${past ? '>' : '<'} ${kg(bh)} m: ${past ? 'de boot kan erdoor' : 'de boot kan er niet door'}.`)] };
  });
}
const D5 = {
  nr: 5, titel: 'De boog van een poort +', kort: 'De formule opstellen, de breedte op een hoogte, het grootste voertuig, een brug over een rivier.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Herhaling</div>
      <p>Poort: $y = ax^2$ met $a < 0$; $y$ = hoeveel de boog lager ligt dan het hoogste punt. Hoogte boven de grond = hoogte van de poort $+ \\, y$.</p></div>
    ${PLUS(`<p><b>De formule opstellen</b>: een poort van 10 m breed en 5 m hoog. Aan de rand is $x = 5$ en $y = -5$: $-5 = a \\cdot 25 \\Rightarrow a = -0{,}2$.</p>
      <p><b>Hoe breed is de poort op 3 m hoogte?</b> Dat is 2 m lager dan de top: $-0{,}2x^2 = -2 \\Rightarrow x^2 = 10 \\Rightarrow x \\approx \\pm 3{,}16$. De breedte is $2 \\cdot 3{,}16 \\approx 6{,}32$ m.</p>
      <p><b>Het grootste voertuig</b>: een voertuig van 3 m hoog mag zo breed zijn als de poort op 3 m hoogte. Een voertuig van 2,5 m breed mag zo hoog zijn als de boog op 1,25 m van het midden.</p>`)}`,
  voorbeelden: [
    { html: `${gegeven('Poort van 8 m breed en 4 m hoog: $y = -0{,}25x^2$.')}${vraag('Hoe breed mag een voertuig van 3 m hoog maximaal zijn?')}`, stappen: ['y = 3 - 4 = -1', '-0{,}25x^2 = -1 \\Rightarrow x^2 = 4 \\Rightarrow x = \\pm 2', '\\text{maximaal } 4 \\text{ m breed}'] },
  ],
  soorten: {
    poorta: { naam: 'De formule van de poort opstellen', gen: vraagPoortA }, breedte: { naam: 'Breedte op een bepaalde hoogte', gen: vraagBreedteOpHoogte },
    maxvoertuig: { naam: 'Het grootste voertuig', gen: vraagMaxVoertuig }, brug: { naam: 'Een brug over een rivier', gen: vraagBrug },
  },
  oefenMix: [['poorta', 1], ['breedte', 1], ['maxvoertuig', 1], ['brug', 1]],
  test: [['poorta', 1], ['breedte', 1], ['maxvoertuig', 2], ['brug', 1]], testSchudden: true,
};

// ===================================================================
//  6 · REDENEREN MET a +
// ===================================================================
function vraagDoorPunt() {
  return tot(() => {
    const s = kies([
      () => { const x = kies([20, 30, 40]), y = kies([4, 6, 8, 9, 12]); return { t: `De kabel van een hangbrug hangt op ${x} m van het midden ${y} m boven zijn laagste punt.`, x, y, f: 'y' }; },
      () => { const x = kies([2, 3, 1.5]), y = kies([1, 1.8, 2, 0.9, 1.35]); return { t: `Een halfpipe is op ${kg(x)} m van het midden ${kg(y)} m hoog.`, x, y, f: 'h' }; },
      () => { const v = kies([40, 60, 80]), d = kies([12, 16, 20, 24, 32]); return { t: `Op een bepaald wegdek is de remweg bij ${v} km/u gelijk aan ${d} m.`, x: v, y: d, f: 'd' }; },
    ])();
    const a = r10(s.y / (s.x * s.x)); if (nDec(a) > 5) return null;
    const x2 = s.x * kies([2, 0.5, 1.5]), y2 = r10(a * x2 * x2);
    return { soort: 'doorpunt', opdracht: 'Tip: vul het gegeven punt in y = a·x² in en zoek a. Gebruik daarna de formule.', html: `${gegeven(`${s.t}<br>De formule heeft de vorm $${s.f} = a \\cdot x^2$.`)}${vragen('Bepaal $a$.', `Bereken de waarde bij $x = ${tg(x2)}$.`)}`,
      sleutel: 'dp' + s.x + s.y + x2, rapport: `door (${kg(s.x)}, ${kg(s.y)})`,
      antw: delen(['1. \\; a =', getal(a, { dec: 5, voor: '' })], [`2. \\; ${s.f}(${tg(x2)}) =`, getal(y2, { dec: 2, voor: '' })]),
      uitleg: [`${tg(s.y)} = a \\cdot ${tg(s.x * s.x)} \\Rightarrow a = ${tg(a)}`, `${tg(a)} \\cdot ${tg(x2 * x2)} = ${tg(y2)}`] };
  });
}
function vraagIsKwadratisch() {
  return tot(() => {
    const a = kies([0.5, 2, 3, 0.25, 1.5]), ok = Math.random() < 0.5, xs = [1, 2, 3, 4, 5];
    const ys = xs.map(x => ok ? r10(a * x * x) : r10(a * x * (x + 1)));
    const q = xs.map((x, i) => r10(ys[i] / (x * x)));
    return { soort: 'iskwadr', opdracht: 'Tip: bij y = a·x² is y : x² altijd hetzelfde getal (dat is a).', html: `<p>Een leerling meet deze waarden bij een proef:</p>${tabel('$x$', xs, '$y$', ys.map(y => kg(y)))}${vraag('Past de formule $y = a \\cdot x^2$ bij deze tabel? Zo ja, hoe groot is $a$?')}`,
      sleutel: 'ik' + a + ok, rapport: `tabel: ax²? (${ok ? 'ja' : 'nee'})`,
      antw: ok ? delen(['\\text{Past } y = ax^2?', jaNee(true, 'ja', 'nee')], ['a =', getal(a, { dec: 2, voor: '' })]) : jaNee(false, 'ja', 'nee'),
      uitleg: [`y : x^2 = ${q.map(tg).join(', \\; ')}`, tx(ok ? `Altijd ${kg(a)}: de formule past, a = ${kg(a)}.` : 'Niet altijd hetzelfde getal: y = ax² past niet.')] };
  });
}
function vraagParameter() {
  const k = kies([2, 3, 0.5]), sit = kies([
    { s: 'de remweg $d(v) = 0{,}01v^2$', w: 'de remweg', x: 'snelheid' },
    { s: 'de halfpipe $h(x) = 0{,}25x^2$', w: 'de hoogte', x: 'plaats' },
    { s: 'de valafstand $s(t) = 4{,}9t^2$', w: 'de valafstand', x: 'tijd' },
  ]);
  const juist = `${zin(sit.w)} wordt overal ${k === 0.5 ? 'half zo groot' : k + ' keer zo groot'}.`;
  return { soort: 'parameter', opdracht: 'Tip: vergelijk a·x² met (k·a)·x² voor dezelfde x.', html: `<p>Situatie: ${sit.s}.</p>${vraag(`Wat gebeurt er als het getal $a$ ${k === 0.5 ? 'half zo groot' : k + ' keer zo groot'} wordt? (Bij dezelfde ${sit.x}.)`)}`,
    sleutel: 'pm' + k + sit.w, rapport: `parameter ×${kg(k)}`,
    antw: zinnen(juist, [`${zin(sit.w)} wordt overal ${k === 0.5 ? 'een vierde' : k * k + ' keer zo groot'}.`, `${zin(sit.w)} verandert niet: enkel de grafiek wordt breder.`, `${zin(sit.w)} wordt ${k === 0.5 ? 'kleiner' : 'groter'}, maar enkel ver van 0.`]),
    uitleg: [tx(`(${kg(k)}a)·x² = ${kg(k)} · (a·x²): elke waarde wordt met ${kg(k)} vermenigvuldigd. De parabool wordt ${k > 1 ? 'smaller' : 'breder'}.`)] };
}
function vraagWanneerGelijk() {
  return tot(() => {
    const d = kies([20, 30, 40, 50, 60]), extra = kies([5, 10, 15, 20]), v1 = wortel(d / 0.01), v2 = wortel((d + extra) / 0.005);
    if (!zeker(v1, 1) || !zeker(v2, 1)) return null;
    return { soort: 'gelijk', opdracht: 'Tip: zoek telkens de snelheid bij die remweg met de juiste formule.', html: `${gegeven(DROOGNAT)}<p>Twee auto’s remmen. Auto A remt op een nat wegdek en heeft een remweg van ${d} m. Auto B remt op een droog wegdek en heeft een remweg van ${d + extra} m.</p>${vragen('Hoe snel reed auto A?', 'Hoe snel reed auto B?', 'Welke auto reed het snelst?')}`,
      sleutel: 'wg' + d + extra, rapport: `nat ${d} m, droog ${d + extra} m`,
      antw: delen(['1. \\text{ A:}', getal(v1, { dec: 1, voor: 'v \\approx', na: '\\text{ km/u}' })], ['2. \\text{ B:}', getal(v2, { dec: 1, voor: 'v \\approx', na: '\\text{ km/u}' })], ['3. \\text{ Het snelst:}', jaNee(v2 > v1, 'auto B', 'auto A')]),
      uitleg: [`0{,}01v^2 = ${d} \\Rightarrow v \\approx ${tg(W.rond(v1, 1))}`, `0{,}005v^2 = ${d + extra} \\Rightarrow v \\approx ${tg(W.rond(v2, 1))}`, tx(`Auto ${v2 > v1 ? 'B' : 'A'} reed het snelst. Let op: een langere remweg betekent niet altijd een hogere snelheid, het wegdek speelt mee.`)] };
  });
}
const D6 = {
  nr: 6, titel: 'Redeneren met a +', kort: 'De formule door een punt, past ax² bij een tabel?, wat doet a?, snelheden vergelijken.', rekenmachine: true,
  theorie: `<div class="kader def"><div class="kader-titel">Herhaling</div>
      <p>$a > 0$: dalparabool, $a < 0$: bergparabool. Hoe dichter $a$ bij 0, hoe breder de parabool.</p></div>
    ${PLUS(`<p><b>Door één punt</b>: ken je één punt $(x, y)$, dan is $a = y : x^2$. De kabel hangt op 30 m van het midden 9 m hoog: $a = 9 : 900 = 0{,}01$.</p>
      <p><b>Past $y = ax^2$ bij een tabel?</b> Bereken telkens $y : x^2$. Is dat altijd hetzelfde getal, dan past de formule en is dat getal $a$.</p>
      <p><b>$a$ veranderen</b>: $a$ 3 keer zo groot maakt <b>elke</b> uitkomst 3 keer zo groot (niet 9 keer: dat gebeurt als $x$ 3 keer zo groot wordt).</p>`)}`,
  voorbeelden: [
    { html: `${tabel('$x$', [1, 2, 3, 4], '$y$', [1.5, 6, 13.5, 24])}${vraag('Past $y = ax^2$? Hoe groot is $a$?')}`, stappen: ['1{,}5 : 1 = 6 : 4 = 13{,}5 : 9 = 24 : 16 = 1{,}5', '\\text{Ja, } a = 1{,}5'] },
  ],
  soorten: {
    doorpunt: { naam: 'De formule door één punt', gen: vraagDoorPunt }, iskwadr: { naam: 'Past y = ax² bij de tabel?', gen: vraagIsKwadratisch },
    parameter: { naam: 'Wat doet a?', gen: vraagParameter }, gelijk: { naam: 'Snelheden vergelijken', gen: vraagWanneerGelijk },
  },
  oefenMix: [['doorpunt', 1], ['iskwadr', 1], ['parameter', 1], ['gelijk', 1]],
  test: [['doorpunt', 2], ['iskwadr', 1], ['parameter', 1], ['gelijk', 1]], testSchudden: true,
};

// ===================================================================
//  EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D7 = {
  nr: 7, titel: 'Eindtest tweedegraadsfuncties in contexten +', kort: 'Alle situaties door elkaar, op het niveau van de +-versie.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest krijg je vragen over alle situaties door elkaar. Herhaal gerust de theorie van een vorig deel. Werk op een kladblad en noteer telkens de eenheid.</p></div>`,
  voorbeelden: [],
  soorten: {
    e1: mix(D1, 'hpterug', 'Halfpipe en hangbrug'), e2: mix(D2, 'rhterug', 'Oppervlakte'), e3: mix(D3, 'remspoor', 'De remweg'), e4: mix(D4, 'valtijd', 'Vallen'),
    e5: mix(D5, 'maxvoertuig', 'De poort'), e6: mix(D6, 'doorpunt', 'Redeneren met a'), e7: mix(D1, 'hangers', 'Hangkabels'), e8: mix(D5, 'brug', 'Brug over een rivier'),
  },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1]], testSchudden: true,
};

// tekst links in gewone grootte; moeilijke woorden met uitleg; uitleg als HTML
for (const D of [D1, D2, D3, D4, D5, D6, D7]) {
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
for (const D of [D1, D2, D3, D4, D5, D6, D7]) {
  D.theorie = woorden(D.theorie);
  for (const vb of D.voorbeelden || []) if (vb.html) vb.html = woorden(vb.html);
}

Leerpaden.registreer({
  code: 'tweedegraadsfuncties-contexten-plus',
  titel: 'Tweedegraadsfuncties in contexten +',
  ondertitel: 'Wiskunde · 4BW-MWW · uitdaging',
  klas: '4BW-MWW',
  drempel: 70,
  intro: `<p>Je werkte het leerpad <b>Tweedegraadsfuncties in contexten</b> al af. In deze <b>+-versie</b> kom je dezelfde situaties tegen (halfpipe, hangbrug, terras, remweg, vallen, poort),
    maar de vragen zijn moeilijker: je stelt zelf de formule $y = ax^2$ op, je rekent terug van de uitkomst naar $x$ (met een vierkantswortel) en je lost problemen in twee stappen op.</p>
    <p>Lees de theorie (zeker het kader <b>Terugrekenen en formules opstellen</b>), bekijk de voorbeelden, oefen en maak dan de test. Een test heeft <b>5 vragen</b> (de eindtest 6); met <b>4 op 5</b> ga je naar het volgende deel.</p>
    <p><b>Moeilijke woorden</b> hebben een oranje stippellijn: raak ze aan voor de uitleg. Bij elke rekenvraag staat op hoeveel decimalen je afrondt.</p>`,
  groepen: [
    { titel: 'A · Dalparabolen', delen: [1, 2, 3] },
    { titel: 'B · Bergparabolen', delen: [4, 5] },
    { titel: 'C · Redeneren', delen: [6] },
    { titel: 'D · Eindtest', delen: [7] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7],
});
})();
