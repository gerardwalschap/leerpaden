// Instaptoets: punten op 100, niveau (uitslag) en tabel per getallenverzameling.
// Gebruikt door de leerlingen- en de leerkrachtpagina. Een programma is een instaptoets
// als het in zijn programmabestand een blok `instaptoets: { domeinen, niveaus, uitslag }` heeft.
const Instap = (() => {
  const komma = (x) => String(Math.round(x * 10) / 10).replace('.', ',');
  const pct = (score, max) => max ? 100 * score / max : 0;
  const punten = (score, max) => komma(pct(score, max));

  // Hoogste niveau waarvan de ondergrens gehaald is (bv. ≥ 70 → Gevorderd).
  function uitslag(P, score, max) {
    const p = pct(score, max) + 1e-9;
    return P.instaptoets.uitslag.filter(u => p >= u.min).sort((a, b) => b.min - a.min)[0] || P.instaptoets.uitslag[0];
  }

  // items: [{ d: 'N', n: 'A', j: true }, …] (zoals lk_instaptoets ze geeft)
  function telling(P, items) {
    const T = {};
    for (const D of P.instaptoets.domeinen) { T[D.k] = { tot: { j: 0, n: 0 } }; for (const N of P.instaptoets.niveaus) T[D.k][N.k] = { j: 0, n: 0 }; }
    const niv = {}; P.instaptoets.niveaus.forEach(N => niv[N.k] = { j: 0, n: 0 });
    let j = 0, n = 0;
    for (const it of items) {
      const r = T[it.d]; if (!r) continue;
      n++; if (it.j) j++;
      r.tot.n++; if (it.j) r.tot.j++;
      if (r[it.n]) { r[it.n].n++; if (it.j) r[it.n].j++; }
      if (niv[it.n]) { niv[it.n].n++; if (it.j) niv[it.n].j++; }
    }
    return { T, niv, j, n };
  }
  const itemsUit = (vragen, details) => vragen.map((v, k) => ({ d: v.domein, n: v.niveau, j: !!(details[k] && details[k].juist) }));
  // punten op 100 die bij een aantal vragen horen (elke vraag even zwaar)
  const deelPunten = (x, totaalN) => komma(totaalN ? 100 * x / totaalN : 0);

  // Tabel per getallenverzameling (voor leerling-verbetering en rapport).
  function tabel(P, vragen, details) {
    const { T, niv, n } = telling(P, itemsUit(vragen, details));
    const N = P.instaptoets.niveaus;
    return `<div class="kaart tabelwrap"><h2 style="margin-top:0">Per getallenverzameling</h2><table class="lijst instap-tabel">
      <tr><th></th>${N.map(x => `<th class="sc">${x.kort}</th>`).join('')}<th class="sc">Punten</th></tr>
      ${P.instaptoets.domeinen.map(D => `<tr><td><b>${D.teken}</b> ${D.naam}</td>
        ${N.map(x => `<td class="sc">${T[D.k][x.k].j}/${T[D.k][x.k].n}</td>`).join('')}
        <td class="sc"><b>${deelPunten(T[D.k].tot.j, n)}</b>/${deelPunten(T[D.k].tot.n, n)}</td></tr>`).join('')}
      <tr><td><b>Totaal</b></td>${N.map(x => `<td class="sc"><b>${niv[x.k].j}/${niv[x.k].n}</b></td>`).join('')}
        <td class="sc"><b>${deelPunten(Object.values(niv).reduce((s, x) => s + x.j, 0), n)}</b>/100</td></tr>
    </table></div>`;
  }
  return { komma, pct, punten, uitslag, telling, itemsUit, deelPunten, tabel };
})();
