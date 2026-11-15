// ===================================================================
//  VECTOREN (4BW-MWW, basisvorming) — gedeelde hulpfuncties
// ===================================================================
const { rnd, kies, schud } = W;
const B = 17, H = 10, STROOK = 5;            // rooster 17 × 10, links een strook voor de gegeven vectoren
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kT = (t) => t.map((x, i) => ({ k: String(i), l: `\\text{${x}}` }));
const kTex = (t) => t.map((x, i) => ({ k: String(i), l: x }));
const kHtml = (t) => t.map((x, i) => ({ k: String(i), l: x, html: true }));
const delen = (...d) => ({ soort: 'delen', delen: d.map(([label, antw]) => ({ label, antw })) });
const getal = (w, na = '') => ({ soort: 'getal', waarde: w, voor: '', na });
const add = (p, d) => [p[0] + d[0], p[1] + d[1]];
const maal = (k, d) => [k * d[0], k * d[1]];
const som = (...ds) => ds.reduce((s, d) => [s[0] + d[0], s[1] + d[1]], [0, 0]);
const woorden = (d) => VEC.woorden(d);
const vt = (n) => `\\vec{${n}}`; // TeX

// willekeurige vector (geen nulvector); evenwijdig aan een as alleen als 'as' toegelaten is
function rv(mx = 4, my = 4, opt = {}) {
  for (;;) {
    const d = [rnd(-mx, mx), rnd(-my, my)];
    if (!d[0] && !d[1]) continue;
    if (!opt.as && (!d[0] || !d[1])) continue;
    if (opt.even && (d[0] % 2 || d[1] % 2)) continue;
    return d;
  }
}
const evenwijdig = (d, e) => d[0] * e[1] - d[1] * e[0] === 0;

// gegeven vectoren in de linkerstrook (x van 0 tot 5), boven elkaar
function strook(lijst) {
  const n = lijst.length, band = Math.floor(H / n);
  return lijst.map((v, i) => {
    const yb = H - (i + 1) * band, x0 = v.d[0] >= 0 ? Math.max(0, Math.floor((STROOK - v.d[0]) / 2)) : Math.min(STROOK, STROOK - Math.floor((STROOK + v.d[0]) / 2));
    const y0 = v.d[1] >= 0 ? yb + Math.max(0, Math.floor((band - v.d[1]) / 2)) : yb + band - Math.max(0, Math.floor((band + v.d[1]) / 2));
    return { van: [x0, y0], d: v.d, naam: v.naam };
  });
}
const pastInStrook = (ds) => ds.every(d => Math.abs(d[0]) <= STROOK - 1 && Math.abs(d[1]) <= Math.floor(H / ds.length) - 1);

// startpunt zodat alle relatieve punten in het tekengebied (x ≥ 7) passen
function startVoor(rel, xmin = STROOK + 2) {
  const xs = rel.map(p => p[0]), ys = rel.map(p => p[1]);
  const lo = [xmin - Math.min(...xs), 0 - Math.min(...ys)], hi = [B - Math.max(...xs), H - Math.max(...ys)];
  if (lo[0] > hi[0] || lo[1] > hi[1]) return null;
  return [rnd(lo[0], hi[0]), rnd(lo[1], hi[1])];
}

// statische figuur (theorie, voorbeelden, opgaven)
const vfig = (a) => `<div class="vfig">${VEC.svg({ b: a.b || B, h: a.h || H, ...a }, null, 'statisch')}</div>`;
// figuur met getekende pijlen (voor stappen in voorbeelden): pijlen = [{van, d, naam, kleur}]
const OR = '#e8772e', BL = '#1c4e8a', GR = '#2e7d4f';
const stapfig = (a, pijlen) => ({ html: vfig({ ...a, gegeven: [...(a.gegeven || []), ...pijlen] }) });

// teken-antwoord
const tekenAntw = (a) => ({ soort: 'vector', b: B, h: H, ...a });
const uitlegD = (naam, d) => `\\text{${naam}: ${woorden(d)}}`;
