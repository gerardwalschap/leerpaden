// ===== Tweedegraadsfuncties in contexten · Wiskunde 4BW-MWW — hulpmiddelen =====
// Leidraad: de werkbundels "3. Tweedegraadsfuncties – contexten in de basis" (± 75 % van de vragen)
// en "3. Tweedegraadsfuncties – contexten" (± 25 %), G. Walschap. Enkel individueel werk.
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
  <li>Je mag je rekenmachine gebruiken. Noteer altijd de juiste eenheid.</li></ul></div>`;
