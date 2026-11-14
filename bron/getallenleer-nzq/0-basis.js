// ===== Getallenleer 7VJHO: Rekenen in ℕ, ℤ en ℚ — gedeelde hulpmiddelen =====
// Drie aparte leerpaden in één bestand. Leidraad: de werkbundels "Natuurlijke getallen", "Gehele getallen"
// en "Rationale getallen" en de werkbladen in OneDrive › WISKUNDE 7VJHO › 1. GETALLENLEER (G. Walschap).
// Procenten en evenredigheden: altijd met een verhoudingstabel (wat je boven doet, doe je ook onder).
const { rnd, kies, schud } = W;
const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
const tg = (x, d = null) => W.texGetal(x, d);
const h = (x) => x < 0 ? `(${tg(x)})` : tg(x);
const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const kgv = (a, b) => a / ggd(a, b) * b;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, ...extra });
const keuze = (opties, juist) => ({ soort: 'keuze', opties, juist: String(juist) });
const kTekst = (teksten) => teksten.map((t, i) => ({ k: String(i), l: `\\text{${t}}` }));
const vt = (expr, tex, extra = {}) => ({ soort: 'veelterm', expr, vorm: 'uitgewerkt', tex, ...extra });
const br = (t, n, extra = {}) => { const g = ggd(t, n); return { soort: 'breuk', t: t / g * Math.sign(n), n: Math.abs(n / g), ...extra }; };
const fr = (t, n) => { const g = ggd(t, n); t = t / g * Math.sign(n); n = Math.abs(n / g); return n === 1 ? tg(t) : `${t < 0 ? '-' : ''}\\dfrac{${Math.abs(t)}}{${n}}`; };
const frRaw = (t, n) => `${t < 0 ? '-' : ''}\\dfrac{${Math.abs(t)}}{${n}}`;
const VERGELIJK = [{ k: '<', l: '<' }, { k: '>', l: '>' }, { k: '=', l: '=' }];
const vgl = (a, b) => Math.abs(a - b) < 1e-12 ? '=' : a < b ? '<' : '>';
const naarTekst = (x) => String(x).replace('.', ',');

// ---- verhoudingstabel (HTML) zoals in de werkbladen: hoeveelheid boven, procenten / tweede grootheid onder
function verhoudingstabel(namen, kolommen, bewerking) {
  return `<table class="tabel verhouding"><tr><th>${namen[0]}</th>${kolommen.map(c => `<td>${c[0]}</td>`).join('')}</tr>
    <tr><th>${namen[1]}</th>${kolommen.map(c => `<td>${c[1]}</td>`).join('')}</tr></table>${bewerking ? `<p class="klein midden">${bewerking}</p>` : ''}`;
}
// in de uitleg (TeX): een tabel als array
const vtTex = (namen, kolommen) => { const nm = namen.map(x => x.replace(/%/g, '\\%')); return `\\begin{array}{l|${'c'.repeat(kolommen.length)}} \\text{${nm[0]}} & ${kolommen.map(c => c[0]).join(' & ')} \\\\ \\hline \\text{${nm[1]}} & ${kolommen.map(c => c[1]).join(' & ')} \\end{array}`; };

// ---- getallenas met punten (SVG)
function getallenas(punten, min, max, opt = {}) {
  const deel = opt.deel || 1, u = opt.u || (deel > 1 ? Math.max(16, Math.round(300 / ((max - min) * deel))) * deel : 40), x0 = 24;
  const w = x0 * 2 + (max - min) * u, hh = 64, y = 34;
  const X = (v) => x0 + (v - min) * u;
  let s = `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="getallenas" style="font-family:Verdana,sans-serif">`;
  s += `<line x1="4" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#555" stroke-width="1.4"/><path d="M${w - 13},${y - 5} L${w - 3},${y} L${w - 13},${y + 5} Z" fill="#555"/>`;
  for (let v = min; v <= max; v++) {
    s += `<line x1="${X(v)}" y1="${y - 7}" x2="${X(v)}" y2="${y + 7}" stroke="#555" stroke-width="1.4"/>`;
    s += `<text x="${X(v)}" y="${y + 24}" font-size="13" text-anchor="middle" fill="#333">${v < 0 ? '−' + (-v) : v}</text>`;
    if (deel > 1 && v < max) for (let k = 1; k < deel; k++) s += `<line x1="${X(v + k / deel)}" y1="${y - 4}" x2="${X(v + k / deel)}" y2="${y + 4}" stroke="#888"/>`;
  }
  for (const p of punten) s += `<circle cx="${X(p.x)}" cy="${y}" r="5" fill="#e8772e"/><text x="${X(p.x)}" y="${y - 12}" font-size="14" font-weight="bold" text-anchor="middle" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}

// ---- rooster met punten (SVG)
function rooster(punten, n = 6) {
  const u = 24, w = 2 * n * u + 34, o = w / 2;
  const X = (x) => o + x * u, Y = (y) => o - y * u;
  let s = `<svg viewBox="0 0 ${w} ${w}" width="${w}" height="${w}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rooster" style="font-family:Verdana,sans-serif">`;
  for (let i = -n; i <= n; i++) s += `<line x1="${X(i)}" y1="${Y(-n)}" x2="${X(i)}" y2="${Y(n)}" stroke="#e2e6ec"/><line x1="${X(-n)}" y1="${Y(i)}" x2="${X(n)}" y2="${Y(i)}" stroke="#e2e6ec"/>`;
  s += `<line x1="${X(-n)}" y1="${o}" x2="${X(n) + 10}" y2="${o}" stroke="#333" stroke-width="1.4"/><line x1="${o}" y1="${Y(-n)}" x2="${o}" y2="${Y(n) - 10}" stroke="#333" stroke-width="1.4"/>`;
  s += `<text x="${X(n) + 8}" y="${o - 6}" font-size="12" font-style="italic" text-anchor="end">x</text><text x="${o + 6}" y="${Y(n) - 2}" font-size="12" font-style="italic">y</text>`;
  for (let i = -n; i <= n; i++) if (i) s += `<text x="${X(i)}" y="${o + 14}" font-size="10" text-anchor="middle" fill="#666">${i < 0 ? '−' + (-i) : i}</text><text x="${o - 5}" y="${Y(i) + 4}" font-size="10" text-anchor="end" fill="#666">${i < 0 ? '−' + (-i) : i}</text>`;
  for (const p of punten) s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="#e8772e"/><text x="${X(p.x) + 7}" y="${Y(p.y) - 7}" font-size="14" font-weight="bold" fill="#e8772e">${p.label}</text>`;
  return `<div class="figuur">${s}</svg></div>`;
}

// ---- mix-deel voor een eindtest
const mix = (D, s, naam) => ({ naam: naam || D.soorten[s].naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s, opdracht: v.opdracht || D.soorten[s].opdracht || D.opdracht }; } });
