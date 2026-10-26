// ===== Remediëring merkwaardige producten, ontbinden en discriminant (4DOF) — hulpmiddelen =====
// Leidraad: cursus TWiskunde 4BW, hoofdstuk 1 Tweedegraadsvergelijkingen (G. Walschap).
const { rnd, kies } = W;
const ggd = W.ggd;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const teken = () => kies([-1, 1]);
const isKw = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));

// ---- veeltermen als tekst (zoals een leerling ze typt) en als TeX
// monoom: c·letters, bv. mono(3, 'x^2y') = '3x^2y', mono(-1, 'x') = '-x', mono(5) = '5'
const mono = (c, l = '') => l ? (c === 1 ? '' : c === -1 ? '-' : String(c)) + l : String(c);
// som van termen (tekst): ['x^2', '-3x', '5'] -> 'x^2 - 3x + 5'
const som = (ts) => ts.filter(t => t !== '0' && t !== '').map((t, i) => i ? (t[0] === '-' ? ` - ${t.slice(1)}` : ` + ${t}`) : t).join('');
// x + c  (c geheel getal)
const lin = (v, c) => c === 0 ? v : c > 0 ? `${v} + ${c}` : `${v} - ${-c}`;
const etx = (s) => VT.texVan(s);           // TeX zoals geschreven
const vtx = (s) => VT.uitgewerktTex(s);    // TeX van de uitgewerkte en herleide vorm
// TeX van een term in een formule: tussen haakjes als het geen enkele letter of getal is
const P = (s) => /^([a-z]|\d+)$/.test(s) ? s : `\\left(${etx(s)}\\right)`;
const tg = (x) => W.texGetal(x);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const bt = (p, q) => W.breukTex(p, q);

// ---- vragen
const uitwerk = (soort, s, uitleg, extra = {}) => ({ soort, tex: etx(s), antw: { soort: 'veelterm', expr: s, vorm: 'uitgewerkt', tex: vtx(s) }, uitleg, ...extra });
// f = de volledig ontbonden vorm (tekst); opg = TeX van de opgave (standaard: uitgewerkt)
const ontbind = (soort, f, uitleg, opg = null, extra = {}) => ({ soort, tex: opg || vtx(f), antw: { soort: 'veelterm', expr: f, vorm: 'ontbonden', tex: etx(f) }, uitleg, ...extra });

// ---- letters en monomen om mee te werken
const LETTER = () => kies(['x', 'x', 'x', 'a', 'y', 'p']);
const TWEE = () => kies([['x', 'y'], ['a', 'b'], ['p', 'q'], ['x', 'y']]);

const OPDR_MP = 'Werk uit met een merkwaardig product.';
const OPDR_ONT = 'Ontbind volledig in factoren.';
const OPDR_D = 'Los op met de discriminantmethode.';

const FORMULES = `<div class="kader def"><div class="kader-titel">De merkwaardige producten</div>
  <table class="tabel"><tr><td>kwadraat van een som</td><td>$(a+b)^2 = a^2 + 2ab + b^2$</td></tr>
  <tr><td>kwadraat van een verschil</td><td>$(a-b)^2 = a^2 - 2ab + b^2$</td></tr>
  <tr><td>product van een som en een verschil</td><td>$(a+b)(a-b) = a^2 - b^2$</td></tr>
  <tr><td>derde macht van een som</td><td>$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$</td></tr>
  <tr><td>derde macht van een verschil</td><td>$(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$</td></tr></table></div>`;

const STAPPENPLAN = `<div class="kader werk"><div class="kader-titel">Stappenplan om te ontbinden</div>
  <ol><li>Kijk eerst of er een <b>gemeenschappelijke factor</b> buiten haakjes kan.</li>
  <li>Controleer daarna of je een <b>merkwaardig product</b> herkent.</li>
  <li>Herken je geen merkwaardig product, gebruik dan de <b>product-som methode</b>.</li>
  <li>Heeft de veelterm <b>vier termen</b>, probeer dan te <b>groeperen</b>.</li></ol></div>`;

const DISCR = `<div class="kader def"><div class="kader-titel">De discriminantmethode</div>
  <p>Schrijf de vergelijking in de standaardvorm $ax^2 + bx + c = 0$ (met $a \\neq 0$) en bereken de <b>discriminant</b>:</p>
  <p class="midden">$D = b^2 - 4ac$</p>
  <table class="tabel"><tr><th>Discriminant</th><th>Aantal oplossingen</th><th>Notatie</th></tr>
  <tr><td>$D > 0$</td><td>2 verschillende oplossingen</td><td>$V = \\{x_1 ; x_2\\}$</td></tr>
  <tr><td>$D = 0$</td><td>1 oplossing (dubbele wortel)</td><td>$V = \\{x\\}$</td></tr>
  <tr><td>$D < 0$</td><td>geen oplossingen in $\\mathbb{R}$</td><td>$V = \\varnothing$</td></tr></table>
  <p>Als $D > 0$: $\\;x_1 = \\dfrac{-b + \\sqrt{D}}{2a}\\;$ en $\\;x_2 = \\dfrac{-b - \\sqrt{D}}{2a}$. &nbsp; Als $D = 0$: $\\;x = \\dfrac{-b}{2a}$.</p></div>`;

const INTYPEN = `<div class="kader"><div class="kader-titel">Zo typ je je antwoord</div>
  <ul><li>Een macht typ je met <code>^</code> of met de knop: <code>x^2</code> of <code>x²</code>.</li>
  <li>Een maalteken mag je weglaten: <code>3x(x - 4)</code> betekent $3x \\cdot (x-4)$.</li>
  <li>Onder het vakje zie je hoe je antwoord gelezen wordt. Kijk dat even na.</li></ul></div>`;
const INTYPEN_V = `<div class="kader"><div class="kader-titel">Zo noteer je de oplossingen</div>
  <p>In het vakje tussen de accolades typ je de oplossingen, met een <b>puntkomma</b> ertussen: <code>2 ; -3</code>.
  Een breuk mag: <code>-1/3</code>. Is een oplossing geen mooi getal, rond dan af op <b>2 cijfers na de komma</b>: <code>3,41</code>.
  Geen oplossingen? Klik op de knop $V = \\varnothing$.</p></div>`;

// ---- discriminant: vergelijking ax² + bx + c = 0 en de volledige uitwerking
function vgl(a, b, c, rechts = '0') { return `${etx(som([mono(a, 'x^2'), mono(b, 'x'), String(c)].filter((t, i) => [a, b, c][i] !== 0)))} = ${rechts}`; }
function discrUitleg(a, b, c) {
  const D = b * b - 4 * a * c;
  const L = [`a = ${tg(a)},\\; b = ${tg(b)},\\; c = ${tg(c)}`,
    `D = b^2 - 4ac = ${h(b)}^2 - 4 \\cdot ${h(a)} \\cdot ${h(c)} = ${tg(D)}`];
  let waarden = [], tex = [];
  if (D < 0) { L.push('D < 0 \\;\\Rightarrow\\; \\text{geen oplossingen}', 'V = \\varnothing'); return { D, L, waarden, tex }; }
  if (D === 0) {
    const t = bt(-b, 2 * a); waarden = [-b / (2 * a)]; tex = [t];
    L.push('D = 0 \\;\\Rightarrow\\; \\text{1 oplossing}', `x = \\dfrac{-b}{2a} = \\dfrac{${tg(-b)}}{${tg(2 * a)}} = ${t}`, `V = \\{${t}\\}`);
    return { D, L, waarden, tex };
  }
  L.push('D > 0 \\;\\Rightarrow\\; \\text{2 oplossingen}');
  const w = Math.sqrt(D), mooi = isKw(D);
  const xs = [(-b + w) / (2 * a), (-b - w) / (2 * a)];
  ['+', '-'].forEach((op, i) => {
    const t = mooi ? bt(op === '+' ? -b + w : -b - w, 2 * a) : W.texGetal(W.rond(xs[i], 2));
    tex.push(t);
    L.push(`x_${i + 1} = \\dfrac{${tg(-b)} ${op} ${mooi ? tg(w) : `\\sqrt{${tg(D)}}`}}{${tg(2 * a)}} ${mooi ? '=' : '\\approx'} ${t}`);
  });
  if (xs[0] > xs[1]) { xs.reverse(); tex.reverse(); }
  waarden = xs;
  L.push(`V = \\{${tex.join('\\,;\\,')}\\}`);
  return { D, L, waarden, tex };
}
const Vantw = (r) => r.waarden.length ? { soort: 'Vmeer', waarden: r.waarden, tex: r.tex, dec: 2 } : { soort: 'Vmeer', waarden: [], leeg: true };
