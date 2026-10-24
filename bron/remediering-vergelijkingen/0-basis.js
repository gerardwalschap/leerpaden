// ===== Remediëring eerstegraadsvergelijkingen (4DOF) — hulpmiddelen =====
const { rnd, kies } = W;
const tg = (x) => W.texGetal(x);
const ggd = W.ggd;
const kgv = (a, b) => a / ggd(a, b) * b;
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };

// a·x als (eerste) term, of met teken ervoor
const tx = (c, eerste = true) => { const k = Math.abs(c) === 1 ? 'x' : `${tg(Math.abs(c))}x`; return eerste ? (c < 0 ? `-${k}` : k) : (c < 0 ? ` - ${k}` : ` + ${k}`); };
// constante met teken ervoor (of niets bij 0)
const tc = (c) => c === 0 ? '' : c < 0 ? ` - ${tg(-c)}` : ` + ${tg(c)}`;
// a·x + b
const lin = (a, b) => a === 0 ? tg(b) : `${tx(a)}${tc(b)}`;
// getal + a·x  (bv. 5 - 2x)
const linCx = (b, a) => `${tg(b)}${tx(a, false)}`;

// oplossing x = p/q
const exact2 = (w) => Math.abs(W.rond(w, 2) - w) < 1e-12;
function opl(p, q) {
  if (q < 0) { p = -p; q = -q; }
  const g = ggd(p, q) || 1; p /= g; q /= g;
  const w = p / q;
  return { p, q, w, exact: exact2(w), V: `V = \\{${tg(W.rond(w, 2))}\\}`, antw: { soort: 'V', waarde: w, dec: 2 } };
}
const veilig = (p, q) => q !== 0 && !W.grensgeval(p / q, 2);
// lijnen voor de uitleg: eerste lijn = vergelijking, daarna ⇔ ...
const stap = (tex, hint) => `\\Leftrightarrow\\; ${tex}${hint ? `\\qquad \\text{\\small ${hint}}` : ''}`;
// laatste stappen vanaf  A·x = B  (A, B gehele getallen, A ≠ 0)
function slot(A, B, L, hint = true) {
  const o = opl(B, A);
  if (A === -1) L.push(stap(`x = ${tg(-B)}`, hint ? '(beide leden maal -1)' : ''));
  else if (A !== 1) {
    const uit = o.q === 1 ? ` = ${tg(o.w)}` : ` ${o.exact ? '=' : '\\approx'} ${tg(W.rond(o.w, 2))}`;
    L.push(stap(`x = \\frac{${tg(B)}}{${tg(A)}}${uit}`, hint ? `(beide leden delen door ${A < 0 ? '(' + tg(A) + ')' : tg(A)})` : ''));
  }
  L.push(o.V);
  return o;
}
const vraag = (soort, tex, o, L, extra = {}) => ({ soort, tex, antw: o.antw, uitleg: L, ...extra });
const metSp = (v) => { v.antw = { ...v.antw, metSpeciaal: true }; return v; };

const REGELS = `<div class="kader def"><div class="kader-titel">De twee regels (balansmethode)</div>
  <ul><li>Beide leden mogen met <b>hetzelfde getal of dezelfde term</b> vermeerderd of verminderd worden.</li>
  <li>Beide leden mogen met <b>hetzelfde getal ($\\neq 0$)</b> vermenigvuldigd of gedeeld worden.</li></ul>
  <p class="klein">Wat je links doet, doe je ook rechts. Zo blijft de vergelijking in evenwicht.</p></div>`;
const NOTEER = `<div class="kader"><div class="kader-titel">Zo noteer je je antwoord</div>
  <p>Je schrijft de oplossing altijd als <b>oplossingenverzameling</b>: $V = \\{\\ldots\\}$. Bv. $x = 7$ geeft $V = \\{7\\}$.</p>
  <p>In het vakje tussen de accolades typ je enkel het getal: <code>7</code>, <code>-3</code> of een kommagetal <code>2,33</code>.
  Is de oplossing geen mooi getal? Rond dan <b>juist af op 2 cijfers na de komma</b>.</p></div>`;
const OPDRACHT = 'Los op. Noteer de oplossing als V = {…}.';
