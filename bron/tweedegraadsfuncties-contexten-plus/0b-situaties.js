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
