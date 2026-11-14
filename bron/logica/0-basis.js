// ===================================================================
//  LOGICA (4BW-MWW) — gedeelde hulpfuncties
// ===================================================================
const { rnd, kies, schud } = W;
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kT = (t) => t.map((x, i) => ({ k: String(i), l: `\\text{${x}}` }));
const kTex = (t) => t.map((x, i) => ({ k: String(i), l: x }));
const kHTML = (t) => t.map((x, i) => ({ k: String(i), l: x, html: true }));
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const drieUniek = (juist, fout, n = 4) => { const u = [juist]; for (const f of fout) if (!u.includes(f) && u.length < n) u.push(f); const s = schud(u); return keuze(kTex(s), s.indexOf(juist)); };
const NUL_EEN = () => kT(['1', '0']);
const neKeuze = (v) => keuze(NUL_EEN(), v ? 0 : 1);

// ---- proposities (herhaling): boom {o:'NOT'|'AND'|'OR'|'XOR'|'IMP'|'EQ', a:[…]} of 'p' / 'q'
const OPS = {
  NOT: { tex: '\\neg', f: (a) => 1 - a, naam: 'negatie', woord: 'niet' },
  AND: { tex: '\\wedge', f: (a, b) => a & b, naam: 'conjunctie', woord: 'en' },
  OR: { tex: '\\vee', f: (a, b) => a | b, naam: 'inclusieve disjunctie', woord: 'of (en/of)' },
  XOR: { tex: '\\oplus', f: (a, b) => a ^ b, naam: 'exclusieve disjunctie', woord: 'ofwel … ofwel' },
  IMP: { tex: '\\rightarrow', f: (a, b) => (a && !b) ? 0 : 1, naam: 'implicatie', woord: 'als … dan' },
  EQ: { tex: '\\leftrightarrow', f: (a, b) => a === b ? 1 : 0, naam: 'equivalentie', woord: 'als en slechts als' },
};
const pEval = (b, w) => typeof b === 'string' ? w[b] : OPS[b.o].f(...b.a.map(k => pEval(k, w)));
function pTex(b, top = true) {
  if (typeof b === 'string') return b;
  if (b.o === 'NOT') return `\\neg ${typeof b.a[0] === 'string' ? b.a[0] : `(${pTex(b.a[0], false)})`}`;
  const s = `${pTex(b.a[0], false)} ${OPS[b.o].tex} ${pTex(b.a[1], false)}`;
  return top ? s : `(${s})`;
}
// deelformules (van binnen naar buiten), zonder de letters zelf
function deelformules(b, lijst = []) { if (typeof b === 'string') return lijst; b.a.forEach(k => deelformules(k, lijst)); if (!lijst.some(x => pTex(x) === pTex(b))) lijst.push(b); return lijst; }
const PQ = [[1, 1], [1, 0], [0, 1], [0, 0]];
const pKolom = (b) => PQ.map(([p, q]) => pEval(b, { p, q }));

// ---- poorten en schakelingen: boom {t:'AND', a:[…]} of index van een ingang
const POORTNAAM = { NOT: 'NOT', AND: 'AND', OR: 'OR', XOR: 'XOR', NAND: 'NAND', NOR: 'NOR', XNOR: 'XNOR' };
const OPERATOR_VAN = { NOT: 'negatie', AND: 'conjunctie', OR: 'inclusieve disjunctie', XOR: 'exclusieve disjunctie' };
const naamTex = (nm) => nm.length > 1 ? `\\mathrm{${nm}}` : nm;
function sTex(b, namen, top = true) { // schakelfunctie met · + ¬ ⊕
  if (typeof b === 'number') return naamTex(namen[b]);
  const inner = (k) => sTex(k, namen, false);
  const OP = { AND: '\\cdot', OR: '+', XOR: '\\oplus' };
  if (b.t === 'NOT') return `\\neg ${typeof b.a[0] === 'number' ? naamTex(namen[b.a[0]]) : `(${sTex(b.a[0], namen, true)})`}`;
  if (b.t === 'NAND' || b.t === 'NOR' || b.t === 'XNOR') { const op = { NAND: '\\cdot', NOR: '+', XNOR: '\\oplus' }[b.t]; return `\\neg(${inner(b.a[0])} ${op} ${inner(b.a[1])})`; }
  const s = `${inner(b.a[0])} ${OP[b.t]} ${inner(b.a[1])}`;
  return top ? s : `(${s})`;
}
const gateIcoon = (t) => `<span class="lg-figuur"><svg viewBox="-30 -8 130 66" width="150" height="76">
  <line x1="-26" y1="${t === 'NOT' ? 25 : 14}" x2="0" y2="${t === 'NOT' ? 25 : 14}" stroke="#1f2733" stroke-width="1.6"/>${t === 'NOT' ? '' : '<line x1="-26" y1="36" x2="0" y2="36" stroke="#1f2733" stroke-width="1.6"/>'}
  <text x="-28" y="${t === 'NOT' ? 21 : 10}" font-size="11" font-family="Verdana">A</text>${t === 'NOT' ? '' : '<text x="-28" y="32" font-size="11" font-family="Verdana">B</text>'}
  ${LG.poortSVG({ id: '', t, x: 0, y: 0 })}<line x1="${LG.POORT[t].neg ? 58 : 50}" y1="25" x2="84" y2="25" stroke="#1f2733" stroke-width="1.6"/><text x="86" y="29" font-size="11" font-family="Verdana">X</text></svg></span>`;
const gateTabelTex = (t) => {
  const P = LG.POORT[t];
  if (P.n === 1) return `\\begin{array}{c|c} A & X \\\\ \\hline 1 & 0 \\\\ 0 & 1 \\end{array}`;
  return `\\begin{array}{cc|c} A & B & X \\\\ \\hline ${LG.rijen(2).map(([a, b]) => `${a} & ${b} & ${P.f(a, b)}`).join(' \\\\ ')} \\end{array}`;
};
