// Programma 'meetkundige-constructies' — automatisch samengevoegd uit bron/meetkundige-constructies/ (niet rechtstreeks bewerken)
(() => {
// ===== Meetkundige constructies · Toegepaste wiskunde 4BW =====
// Leidraad: cursus TWiskunde 4BW hoofdstuk 10 "Meetkundige constructies" (G. Walschap). Het construeren zelf gebeurt met passer en liniaal op papier;
// dit leerpad oefent het herkennen van de constructies, de volgorde van de stappen en de eigenschappen waarop ze steunen.
const { rnd, kies, schud } = W;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: schud([...new Set(opties)].map(o => ({ k: String(o), l: `\\text{${o}}` }))), juist: String(juist) });
const lijstKeuze = (opties, juist) => { const o = schud([...new Set(opties)]); return { soort: 'keuze', lijst: true, opties: o.map((t, i) => ({ k: String(i), l: t, html: true })), juist: String(o.indexOf(juist)) }; };
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const tx = (s) => '@@' + s;
const kg = (x) => String(W.rond(x, 2)).replace('.', ',');

// ---------- tekenen: wiskundige coördinaten (y omhoog) in een vak van 320 × 240
const RAD = Math.PI / 180, HV = 240;
const pol = (c, r, a) => [c[0] + r * Math.cos(a * RAD), c[1] + r * Math.sin(a * RAD)];
const sn = (c1, r1, c2, r2) => { const dx = c2[0] - c1[0], dy = c2[1] - c1[1], d = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a)), mx = c1[0] + a * dx / d, my = c1[1] + a * dy / d;
  return [[mx - h * dy / d, my + h * dx / d], [mx + h * dy / d, my - h * dx / d]]; };
const hoekVan = (c, p) => Math.atan2(p[1] - c[1], p[0] - c[0]) / RAD;
const verleng = (p, q, t1, t2) => [[p[0] + (q[0] - p[0]) * t1, p[1] + (q[1] - p[1]) * t1], [p[0] + (q[0] - p[0]) * t2, p[1] + (q[1] - p[1]) * t2]];
const KL = { geg: '#1f2733', boog: '#7a8b99', res: '#e8772e' };
const Y = (y) => HV - y;
const E = {
  lijn: (p, q, kl = KL.geg, w = 2, streep = false) => `<line x1="${p[0]}" y1="${Y(p[1])}" x2="${q[0]}" y2="${Y(q[1])}" stroke="${kl}" stroke-width="${w}" ${streep ? 'stroke-dasharray="6 4"' : ''}/>`,
  cirkel: (c, r, kl = KL.geg, w = 1.8, streep = false) => `<circle cx="${c[0]}" cy="${Y(c[1])}" r="${r}" fill="none" stroke="${kl}" stroke-width="${w}" ${streep ? 'stroke-dasharray="5 4"' : ''}/>`,
  boog: (c, r, a1, a2, kl = KL.boog) => { const p = pol(c, r, a1), q = pol(c, r, a2); return `<path d="M ${p[0]} ${Y(p[1])} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${q[0]} ${Y(q[1])}" fill="none" stroke="${kl}" stroke-width="1.4"/>`; },
  bogen: (c, r, p, d = 14, kl) => { const a = hoekVan(c, p); return E.boog(c, r, a - d, a + d, kl); },
  pt: (p, n, dx = 6, dy = -6, kl = KL.geg) => `<circle cx="${p[0]}" cy="${Y(p[1])}" r="3.5" fill="${kl}"/>` + (n ? `<text x="${p[0] + dx}" y="${Y(p[1]) + dy}" font-size="14" font-weight="bold" font-style="italic" fill="${kl}">${n}</text>` : ''),
};
const fig = (inhoud, label) => `<div class="figuur"><svg viewBox="0 0 320 ${HV}" width="320" height="${HV}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="font-family:Verdana,sans-serif;max-width:100%">${inhoud}</svg></div>`;

// ---------- de tien constructies (met constructiebogen)
const FIG = {
  middelloodlijn() { const A = [70, 120], B = [250, 120], r = 120, [S1, S2] = sn(A, r, B, r);
    return fig(E.lijn(A, B) + E.bogen(A, r, S1, 16) + E.bogen(A, r, S2, 16) + E.bogen(B, r, S1, 16) + E.bogen(B, r, S2, 16) + E.lijn(...verleng(S1, S2, -0.1, 1.1), KL.res, 2.4) + E.pt(A, 'A', -8, 20) + E.pt(B, 'B', 0, 20) + E.pt(S1, '') + E.pt(S2, ''), 'middelloodlijn van AB'); },
  bissectrice() { const Z = [50, 50], a = 52, P1 = pol(Z, 100, 0), P2 = pol(Z, 100, a), Q = sn(P1, 85, P2, 85).sort((u, v) => Math.hypot(...v.map((x, i) => x - Z[i])) - Math.hypot(...u.map((x, i) => x - Z[i])))[0];
    return fig(E.lijn(Z, pol(Z, 250, 0)) + E.lijn(Z, pol(Z, 230, a)) + E.boog(Z, 100, -6, a + 6) + E.bogen(P1, 85, Q, 14) + E.bogen(P2, 85, Q, 14) + E.lijn(Z, pol(Z, 250, a / 2), KL.res, 2.4) + E.pt(Z, 'Z', -16, 16) + E.pt(P1, '') + E.pt(P2, '') + E.pt(Q, ''), 'bissectrice van een hoek'); },
  loodlijn() { const P = [160, 180], y0 = 80, r = 130, d = Math.sqrt(r * r - (P[1] - y0) ** 2), S1 = [160 - d, y0], S2 = [160 + d, y0], [T1, T2] = sn(S1, 100, S2, 100), T = T1[1] < T2[1] ? T1 : T2;
    return fig(E.lijn([10, y0], [310, y0]) + E.boog(P, r, hoekVan(P, S2) - 8, hoekVan(P, S1) + 8) + E.bogen(S1, 100, T, 14) + E.bogen(S2, 100, T, 14) + E.lijn([160, 225], [160, 15], KL.res, 2.4) + E.pt(P, 'P', 8, 4) + E.pt(S1, '') + E.pt(S2, '') + E.pt(T, ''), 'loodlijn door P op een rechte'); },
  evenwijdige() { const A = [10, 50], B = [310, 90], Q = [200, 50 + 40 * 190 / 300], P = [110, 190], t = hoekVan(Q, P), lh = hoekVan(Q, B), r = 45;
    const Q1 = pol(Q, r, lh), Q2 = pol(Q, r, t), ch = Math.hypot(Q1[0] - Q2[0], Q1[1] - Q2[1]), P2 = pol(P, r, t), P1 = sn(P, r, P2, ch).sort((u, v) => v[0] - u[0])[0];
    return fig(E.lijn(A, B) + E.lijn(...verleng(Q, P, -0.3, 1.25), KL.boog, 1.6) + E.boog(Q, r, lh - 6, t + 6) + E.boog(P, r, lh - 6, t + 6) + E.bogen(P2, ch, P1, 12) + E.lijn(...verleng(P, P1, -2.2, 4.6), KL.res, 2.4) + E.pt(P, 'P', -18, -4) + E.pt(Q, '') + E.pt(P1, ''), 'evenwijdige door P'); },
  overbrengen() { const Z = [30, 60], Zp = [180, 60], a = 42, r = 70, P1 = pol(Z, r, 0), P2 = pol(Z, r, a), ch = Math.hypot(P1[0] - P2[0], P1[1] - P2[1]), Q1 = pol(Zp, r, 0), Q2 = sn(Zp, r, Q1, ch).sort((u, v) => v[1] - u[1])[0];
    return fig(E.lijn(Z, pol(Z, 130, 0)) + E.lijn(Z, pol(Z, 130, a)) + E.boog(Z, r, -5, a + 8) + E.lijn(Zp, pol(Zp, 130, 0)) + E.boog(Zp, r, -5, a + 8) + E.bogen(Q1, ch, Q2, 12) + E.lijn(Zp, pol(Zp, 130, hoekVan(Zp, Q2)), KL.res, 2.4) + E.pt(Z, 'Z', -6, 18) + E.pt(Zp, "Z′", -6, 18), 'een hoek overbrengen'); },
  verdelen() { const A = [30, 70], B = [290, 70], n = 5, s = 42, pts = [...Array(n)].map((_, i) => pol(A, s * (i + 1), 32)), last = pts[n - 1];
    let g = E.lijn(A, B) + E.lijn(A, pol(A, s * n + 25, 32), KL.boog, 1.6) + pts.map(p => E.bogen(p, 10, pol(p, 1, -60), 30)).join('') + E.lijn(last, B, KL.res, 2);
    pts.slice(0, -1).forEach((p, i) => { const t = (i + 1) / n, X = [A[0] + (B[0] - A[0]) * t, 70]; g += E.lijn(p, X, KL.res, 1.6, true) + E.pt(X, ''); });
    return fig(g + pts.map(p => E.pt(p, '')).join('') + E.pt(A, 'A', -8, 20) + E.pt(B, 'B', 0, 20), 'lijnstuk verdelen in 5 gelijke delen'); },
  omgeschreven() { const A = [80, 70], B = [240, 70], C = [130, 180], ax = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])), sq = (p) => p[0] ** 2 + p[1] ** 2;
    const O = [(sq(A) * (B[1] - C[1]) + sq(B) * (C[1] - A[1]) + sq(C) * (A[1] - B[1])) / ax, (sq(A) * (C[0] - B[0]) + sq(B) * (A[0] - C[0]) + sq(C) * (B[0] - A[0])) / ax], R = Math.hypot(O[0] - A[0], O[1] - A[1]);
    const ml = (p, q) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = [-(q[1] - p[1]), q[0] - p[0]], L = Math.hypot(...d); return E.lijn([m[0] - d[0] / L * 40, m[1] - d[1] / L * 40], [m[0] + d[0] / L * 40, m[1] + d[1] / L * 40], KL.boog, 1.5, true); };
    return fig(`<polygon points="${[A, B, C].map(p => `${p[0]},${Y(p[1])}`).join(' ')}" fill="#eef3fa" stroke="${KL.geg}" stroke-width="2"/>` + ml(A, B) + ml(B, C) + ml(A, C) + E.cirkel(O, R, KL.res, 2.2) + E.pt(O, 'O', 6, 16, KL.res) + E.pt(A, 'A', -16, 8) + E.pt(B, 'B', 8, 8) + E.pt(C, 'C', -4, -8), 'omgeschreven cirkel'); },
  ingeschreven() { const A = [40, 40], B = [290, 50], C = [130, 210], a = Math.hypot(B[0] - C[0], B[1] - C[1]), b = Math.hypot(A[0] - C[0], A[1] - C[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1]), s = a + b + c;
    const I = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s], ar = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2, r = 2 * ar / s;
    return fig(`<polygon points="${[A, B, C].map(p => `${p[0]},${Y(p[1])}`).join(' ')}" fill="#eef3fa" stroke="${KL.geg}" stroke-width="2"/>` + [A, B, C].map(p => E.lijn(p, verleng(p, I, 0, 1.25)[1], KL.boog, 1.5, true)).join('') + E.cirkel(I, r, KL.res, 2.2) + E.pt(I, 'I', 6, 16, KL.res) + E.pt(A, 'A', -16, 8) + E.pt(B, 'B', 8, 8) + E.pt(C, 'C', -4, -8), 'ingeschreven cirkel'); },
  zeshoek() { const O = [160, 120], r = 95, P = [...Array(6)].map((_, i) => pol(O, r, 90 + 60 * i));
    return fig(E.cirkel(O, r, KL.geg, 1.6) + P.map(p => E.bogen(p, r, pol(p, 1, hoekVan(p, O) + 60), 8) + E.bogen(p, r, pol(p, 1, hoekVan(p, O) - 60), 8)).join('') + `<polygon points="${P.map(p => `${p[0]},${Y(p[1])}`).join(' ')}" fill="none" stroke="${KL.res}" stroke-width="2.4"/>` + E.pt(O, 'O', 6, 16) + E.pt(P[0], 'P', 6, -6) + P.slice(1).map(p => E.pt(p, '')).join(''), 'regelmatige zeshoek'); },
  raaklijn() { const O = [95, 120], r = 60, P = [285, 120], M = [(O[0] + P[0]) / 2, 120], [T1, T2] = sn(O, r, M, (P[0] - O[0]) / 2);
    return fig(E.cirkel(O, r, KL.geg, 2) + E.lijn(O, P, KL.boog, 1.4, true) + E.cirkel(M, (P[0] - O[0]) / 2, KL.boog, 1.3, true) + E.lijn(...verleng(P, T1, 0, 1.35), KL.res, 2.4) + E.lijn(...verleng(P, T2, 0, 1.35), KL.res, 2.4) + E.lijn(O, T1, KL.boog, 1.4) + E.lijn(O, T2, KL.boog, 1.4) + E.pt(O, 'O', -8, 20) + E.pt(P, 'P', -4, 20) + E.pt(M, 'M', -6, 20, KL.boog) + E.pt(T1, '') + E.pt(T2, ''), 'raaklijnen vanuit P'); },
};
const NAMEN = { middelloodlijn: 'middelloodlijn van een lijnstuk', bissectrice: 'bissectrice van een hoek', loodlijn: 'loodlijn op een rechte', evenwijdige: 'evenwijdige door een punt', overbrengen: 'een hoek overbrengen', verdelen: 'lijnstuk verdelen in gelijke delen',
  omgeschreven: 'omgeschreven cirkel', ingeschreven: 'ingeschreven cirkel', zeshoek: 'regelmatige zeshoek', raaklijn: 'raaklijn vanuit een extern punt' };
const herken = (keys) => ({ naam: 'Welke constructie zie je?', gen() { const k = kies(keys), ander = schud(Object.keys(NAMEN).filter(x => x !== k)).slice(0, 3);
  return { soort: 'herken', html: FIG[k]() + vraag('Welke constructie zie je hier? (grijs: constructiebogen en hulplijnen, oranje: resultaat)'), sleutel: `h${k}`, antw: tekstKeuze([NAMEN[k], ...ander.map(x => NAMEN[x])], NAMEN[k]), uitleg: [tx(`Dit is de constructie: ${NAMEN[k]}.`)] }; } });
// meerkeuzebank: [vraag, juist, [foute opties], uitleg]
const bank = (naam, L) => ({ naam, gen() { const [v, j, f, u] = kies(L); return { soort: 'bank', html: vraag(v), sleutel: `b${v}`, antw: lijstKeuze([j, ...f], j), uitleg: [tx(u)] }; } });
const WERK = `<div class="kader"><div class="kader-titel">Werkwijze</div><p>Zoek op hoe de constructie werkt (bv. een instructiefilmpje) en construeer ze daarna zelf met <b>passer en liniaal</b>. Laat al je <b>constructiebogen</b> zichtbaar staan: die tonen hoe je te werk ging. In dit leerpad oefen je het herkennen, de stappen en de eigenschappen.</p></div>`;
const def = (t, html) => `<div class="kader def"><div class="kader-titel">${t}</div>${html}</div>`;
const stp = (t, l) => `<div class="kader werk"><div class="kader-titel">${t}</div><ol>${l.map(x => `<li>${x}</li>`).join('')}</ol></div>`;

// ===================================================================
const D1 = {
  nr: 1, titel: 'Middelloodlijn en bissectrice', kort: 'Loodrecht door het midden · een hoek in twee gelijke delen.', rekenmachine: false,
  theorie: `${WERK}${def('Middelloodlijn van een lijnstuk', '<p>De <b>middelloodlijn</b> van $[AB]$ staat loodrecht op $[AB]$ en gaat door het midden van $[AB]$. Elk punt ervan ligt <b>even ver van $A$ als van $B$</b>.</p>')}
    ${stp('Middelloodlijn construeren', ['Neem een passeropening <b>groter dan de helft</b> van $[AB]$ (anders snijden de bogen elkaar niet).', 'Teken met middelpunt $A$ een boog boven én onder $AB$.', 'Teken met dezelfde opening en middelpunt $B$ twee bogen die de eerste snijden.', 'Verbind de twee snijpunten: dat is de middelloodlijn.'])}
    ${def('Bissectrice van een hoek', '<p>De <b>bissectrice</b> is de halfrechte die de hoek in <b>twee gelijke delen</b> verdeelt. Elk punt ervan ligt <b>even ver van de twee benen</b>.</p>')}
    ${stp('Bissectrice construeren (3 bogen)', ['Boog met middelpunt het hoekpunt $Z$: snijdt beide benen.', 'Vanuit elk van die twee snijpunten een boog met dezelfde opening, binnen de hoek.', 'Verbind $Z$ met het snijpunt van die twee bogen.'])}`,
  voorbeelden: [{ html: FIG.middelloodlijn(), stappen: ['\\text{de twee snijpunten liggen even ver van } A \\text{ als van } B', '\\text{de rechte erdoor is de middelloodlijn}'] }, { html: FIG.bissectrice(), stappen: ['\\text{3 bogen: één rond } Z, \\text{ twee vanuit de snijpunten op de benen}'] }],
  soorten: {
    herken: herken(['middelloodlijn', 'bissectrice']),
    eig: bank('Eigenschappen en stappen', [
      ['Elk punt van de middelloodlijn van [AB] ligt …', 'even ver van A als van B', ['even ver van de twee benen', 'op [AB]', 'dichter bij A dan bij B'], 'De middelloodlijn is de verzameling punten die even ver van A als van B liggen.'],
      ['Waarom moet de passeropening groter zijn dan de helft van [AB]?', 'anders snijden de bogen elkaar niet', ['anders wordt de lijn niet recht', 'dat hoeft niet', 'zodat de bogen mooier zijn'], 'Met een kleinere opening raken of snijden de bogen rond A en B elkaar niet.'],
      ['Wat stellen de twee snijpunten van de bogen voor bij de middelloodlijn?', 'twee punten die even ver van A als van B liggen', ['het midden van [AB]', 'de eindpunten van [AB]', 'punten op de bissectrice'], 'Beide snijpunten liggen op dezelfde afstand (de passeropening) van A en van B.'],
      ['Elk punt van de bissectrice van een hoek ligt …', 'even ver van de twee benen', ['even ver van A als van B', 'op het hoekpunt', 'op één been'], 'De bissectrice verdeelt de hoek in twee gelijke delen; haar punten liggen even ver van beide benen.'],
      ['Hoeveel bogen teken je om een bissectrice te construeren?', '3', ['2', '4', '1'], 'Eén boog rond het hoekpunt en twee vanuit de snijpunten op de benen.'],
      ['Welk middelpunt heeft de eerste boog bij de bissectrice?', 'het hoekpunt', ['het midden van een been', 'een willekeurig punt', 'het snijpunt van de bogen'], 'De eerste boog heeft het hoekpunt Z als middelpunt.'],
      ['De middelloodlijn van [AB] maakt met AB een hoek van …', '90°', ['45°', '60°', '180°'], 'De middelloodlijn staat loodrecht op [AB].'],
      ['Een hoek is 74°. Hoe groot zijn de twee delen na het tekenen van de bissectrice?', '37° en 37°', ['74° en 74°', '30° en 44°', '90° en 16°'], 'De bissectrice verdeelt de hoek in twee gelijke delen: 74° : 2 = 37°.'],
    ]),
  },
  oefenMix: [['herken', 2], ['eig', 3]],
  test: [['herken', 3], ['eig', 7]], testSchudden: true,
};

const D2 = {
  nr: 2, titel: 'Loodlijn, evenwijdige en hoek overbrengen', kort: 'Constructies met rechte hoeken en gelijke hoeken.', rekenmachine: false,
  theorie: `${WERK}${def('Loodlijn op een rechte door een punt $P$', '<p>Het punt $P$ kan <b>op</b> de rechte liggen of <b>erbuiten</b>. In beide gevallen teken je eerst een boog rond $P$ die de rechte in twee punten snijdt, en construeer je daarna de <b>middelloodlijn</b> van het lijnstuk tussen die twee punten.</p>')}
    ${def('Evenwijdige door een punt $P$', '<p>Teken een snijlijn door $P$ die de gegeven rechte snijdt. Breng de hoek tussen snijlijn en rechte over naar $P$: zo maak je <b>F-hoeken (overeenkomstige hoeken)</b> of <b>Z-hoeken (verwisselende binnenhoeken)</b> gelijk, en dan zijn de rechten evenwijdig.</p>')}
    ${stp('Een hoek overbrengen (zonder gradenboog)', ['Boog met middelpunt $Z$: snijdt beide benen.', 'Dezelfde boog met middelpunt $Z′$ op de nieuwe halfrechte.', 'Neem met je passer de <b>afstand tussen de twee snijpunten</b> (de koorde) over.', 'Zet die afstand af op de boog rond $Z′$ en teken het tweede been.'])}
    <p>Twee gelijke stralen en een gelijke koorde geven <b>congruente driehoeken</b>, dus een even grote hoek.</p>`,
  voorbeelden: [{ html: FIG.loodlijn(), stappen: ['\\text{boog rond } P \\text{ snijdt de rechte in twee punten}', '\\text{middelloodlijn van die twee punten gaat door } P'] }, { html: FIG.overbrengen(), stappen: ['\\text{gelijke stralen en gelijke koorde: gelijke hoek}'] }],
  soorten: {
    herken: herken(['loodlijn', 'evenwijdige', 'overbrengen']),
    eig: bank('Eigenschappen en stappen', [
      ['Welke eerdere constructie gebruik je bij de loodlijn door P?', 'de middelloodlijn', ['de bissectrice', 'de omgeschreven cirkel', 'de regelmatige zeshoek'], 'Na de boog rond P construeer je de middelloodlijn van de twee snijpunten.'],
      ['Wat doe je eerst bij een loodlijn door een punt P buiten de rechte?', 'een boog rond P die de rechte in twee punten snijdt', ['de bissectrice tekenen', 'P met het midden verbinden', 'een hoek van 90° meten met een gradenboog'], 'De boog rond P levert twee punten op de rechte, symmetrisch t.o.v. de loodlijn.'],
      ['Welke hoeken maak je gelijk om een evenwijdige te construeren?', 'F-hoeken of Z-hoeken', ['nevenhoeken', 'overstaande hoeken', 'rechte hoeken'], 'Gelijke overeenkomstige (F) of verwisselende (Z) hoeken betekenen evenwijdige rechten.'],
      ['Welke afstand neem je over met de passer bij het overbrengen van een hoek?', 'de afstand tussen de twee snijpunten op de benen', ['de lengte van een been', 'de afstand van Z tot Z′', 'de hoekgrootte in graden'], 'De koorde tussen de snijpunten bepaalt de grootte van de hoek.'],
      ['Waarom is de overgebrachte hoek even groot?', 'twee gelijke stralen en een gelijke koorde geven congruente driehoeken', ['omdat je hem meet', 'omdat de benen even lang zijn', 'omdat de hoeken nevenhoeken zijn'], 'De driehoeken hebben drie gelijke zijden (ZZZ) en zijn dus congruent.'],
      ['Heb je een gradenboog nodig om een hoek over te brengen?', 'nee, passer en liniaal volstaan', ['ja, altijd', 'enkel bij stompe hoeken', 'enkel bij scherpe hoeken'], 'Je neemt enkel afstanden over met de passer.'],
      ['Een loodlijn maakt met de rechte een hoek van …', '90°', ['45°', '180°', '60°'], 'Loodrecht betekent een hoek van 90°.'],
    ]),
  },
  oefenMix: [['herken', 2], ['eig', 3]],
  test: [['herken', 3], ['eig', 7]], testSchudden: true,
};

const D3 = {
  nr: 3, titel: 'Een lijnstuk verdelen in gelijke delen', kort: 'Steunt op de stelling van Thales.', rekenmachine: true,
  theorie: `${WERK}${stp('Lijnstuk $[AB]$ verdelen in $n$ gelijke delen', ['Teken vanuit $A$ een hulphalfrechte in een <b>andere richting</b> dan $[AB]$.', 'Zet met de passer $n$ keer <b>dezelfde afstand</b> af op die hulphalfrechte.', 'Verbind het laatste punt met $B$.', 'Teken door de andere punten <b>evenwijdigen</b> met die verbindingslijn: ze verdelen $[AB]$ in $n$ gelijke delen.'])}
    ${def('Waarom werkt dit?', '<p>Door de <b>stelling van Thales</b> (hoofdstuk 6): evenwijdige rechten verdelen de twee snijlijnen in evenredige stukken. Gelijke stukken op de hulplijn geven dus gelijke stukken op $[AB]$. De hulplijn moet een andere richting hebben, anders snijden de evenwijdigen $[AB]$ niet.</p>')}`,
  voorbeelden: [{ html: FIG.verdelen(), stappen: ['\\text{5 gelijke stukken op de hulplijn}', '\\text{evenwijdigen met de laatste verbindingslijn: 5 gelijke delen op } [AB]'] }],
  soorten: {
    herken: herken(['verdelen', 'evenwijdige', 'middelloodlijn']),
    deel: { naam: 'Lengte van een deel', gen() { const n = kies([3, 4, 5, 6, 7]), L = kies([9, 10, 12, 14, 15, 18, 21]), k = rnd(1, n - 1);
      return { soort: 'deel', html: opgave(`Je verdeelt een lijnstuk [AB] van ${L} cm in ${n} gelijke delen. Het punt P is het ${k}e verdeelpunt vanaf A.`) + vraag('Hoe ver ligt P van A (afgerond op 0,01 cm)?'), sleutel: `d${n}${L}${k}`,
        antw: getal(W.rond(L * k / n, 2), { dec: 2, na: '\\text{ cm}' }), uitleg: [`\\text{één deel} = \\frac{${L}}{${n}} \\text{ cm}`, `|AP| = ${k} \\cdot \\frac{${L}}{${n}} \\approx ${W.texGetal(W.rond(L * k / n, 2))} \\text{ cm}`] }; } },
    eig: bank('Eigenschappen en stappen', [
      ['Op welke stelling steunt het verdelen van een lijnstuk in gelijke delen?', 'de stelling van Thales', ['de stelling van Pythagoras', 'de sinusregel', 'de grondformule'], 'Evenwijdige rechten verdelen snijlijnen in evenredige stukken (Thales).'],
      ['Waarom moet de hulplijn een andere richting hebben dan [AB]?', 'anders snijden de evenwijdigen [AB] niet', ['anders is ze te kort', 'dat hoeft niet', 'zodat je kan meten'], 'Valt de hulplijn samen met AB, dan zijn er geen snijpunten.'],
      ['Welke lijnen teken je door de verdeelpunten op de hulplijn?', 'evenwijdigen met de lijn door het laatste punt en B', ['loodlijnen op [AB]', 'bissectrices', 'middelloodlijnen'], 'De evenwijdigen brengen de gelijke stukken over naar [AB].'],
      ['Hoeveel keer zet je dezelfde afstand af om [AB] in 6 gelijke delen te verdelen?', '6', ['5', '7', '3'], 'Voor n gelijke delen zet je n keer dezelfde afstand af.'],
      ['Moet je met een liniaal meten om [AB] in gelijke delen te verdelen?', 'nee, de passer zet gelijke afstanden af', ['ja, in millimeter', 'ja, maar enkel bij oneven delen', 'ja, om [AB] te kennen'], 'Je meet niet: de passer zorgt voor gelijke stukken en Thales doet de rest.'],
    ]),
  },
  oefenMix: [['herken', 1], ['deel', 2], ['eig', 2]],
  test: [['herken', 2], ['deel', 4], ['eig', 4]], testSchudden: true,
};

const D4 = {
  nr: 4, titel: 'Omgeschreven en ingeschreven cirkel', kort: 'Omcentrum (middelloodlijnen) · incentrum (bissectrices).', rekenmachine: false,
  theorie: `${WERK}${def('Omgeschreven cirkel', '<p>De omgeschreven cirkel gaat door de <b>drie hoekpunten</b>. Het middelpunt is het <b>omcentrum</b>: het snijpunt van de drie <b>middelloodlijnen</b> van de zijden. Het ligt even ver van de drie hoekpunten; die afstand is de straal.</p>')}
    ${def('Ingeschreven cirkel', '<p>De ingeschreven cirkel <b>raakt de drie zijden</b>. Het middelpunt is het <b>incentrum</b>: het snijpunt van de drie <b>bissectrices</b> van de hoeken. Het ligt even ver van de drie zijden.</p><p>De straal: teken vanuit het incentrum de <b>loodlijn</b> op een zijde; de afstand tot het voetpunt is de straal.</p>')}
    <p class="klein">Twee middelloodlijnen (of twee bissectrices) volstaan al om het snijpunt te vinden; de derde dient als controle.</p>`,
  voorbeelden: [{ html: FIG.omgeschreven(), stappen: ['\\text{middelloodlijnen snijden in het omcentrum } O'] }, { html: FIG.ingeschreven(), stappen: ['\\text{bissectrices snijden in het incentrum } I'] }],
  soorten: {
    herken: herken(['omgeschreven', 'ingeschreven']),
    eig: bank('Eigenschappen en stappen', [
      ['Het omcentrum is het snijpunt van de drie …', 'middelloodlijnen', ['bissectrices', 'hoogtelijnen', 'zwaartelijnen'], 'Het omcentrum ligt even ver van de drie hoekpunten, dus op elke middelloodlijn.'],
      ['Het incentrum is het snijpunt van de drie …', 'bissectrices', ['middelloodlijnen', 'hoogtelijnen', 'zijden'], 'Het incentrum ligt even ver van de drie zijden, dus op elke bissectrice.'],
      ['De omgeschreven cirkel gaat door …', 'de drie hoekpunten', ['de middens van de zijden', 'het incentrum', 'geen enkel hoekpunt'], 'Omgeschreven: de cirkel gaat door A, B en C.'],
      ['De ingeschreven cirkel …', 'raakt de drie zijden', ['gaat door de drie hoekpunten', 'snijdt elke zijde twee keer', 'ligt buiten de driehoek'], 'Ingeschreven: de cirkel raakt elke zijde in één punt.'],
      ['Hoe bepaal je de straal van de ingeschreven cirkel?', 'loodlijn vanuit het incentrum op een zijde', ['afstand incentrum tot een hoekpunt', 'halve lengte van een zijde', 'afstand tussen twee hoekpunten'], 'De straal is de afstand van het incentrum tot een zijde: die meet je loodrecht.'],
      ['Waarom liggen de drie hoekpunten even ver van het omcentrum?', 'het omcentrum ligt op elke middelloodlijn', ['het omcentrum ligt op elke bissectrice', 'de driehoek is gelijkzijdig', 'toeval'], 'Op de middelloodlijn van [AB] liggen de punten even ver van A als van B, en zo voor elke zijde.'],
      ['Hoeveel middelloodlijnen heb je minstens nodig om het omcentrum te vinden?', '2', ['1', '3', '4'], 'Twee rechten bepalen al een snijpunt; de derde is een controle.'],
    ]),
  },
  oefenMix: [['herken', 2], ['eig', 3]],
  test: [['herken', 3], ['eig', 7]], testSchudden: true,
};

const D5 = {
  nr: 5, titel: 'Regelmatige zeshoek en raaklijn', kort: 'Zijde = straal · raaklijn ⟂ straal.', rekenmachine: true,
  theorie: `${WERK}${def('Regelmatige zeshoek in een cirkel', '<p>Zet vanaf $P$ met de <b>straal</b> als passeropening zes keer een boog af op de cirkel en verbind de punten. Dat werkt omdat de zeshoek bestaat uit <b>zes gelijkzijdige driehoeken</b>: elke zijde is even lang als de straal.</p><p>Verbind je slechts elk tweede hoekpunt, dan krijg je een <b>gelijkzijdige driehoek</b>.</p>')}
    ${def('Raaklijn vanuit een extern punt $P$', '<p>Een raaklijn heeft precies één punt gemeen met de cirkel en staat daar <b>loodrecht op de straal</b> (hoek van 90°).</p><ol><li>Construeer het midden $M$ van $[OP]$ (middelloodlijn).</li><li>Teken de cirkel met middelpunt $M$ door $O$ en $P$.</li><li>De snijpunten met de gegeven cirkel zijn de raakpunten: de hoek in een halve cirkel is 90°.</li><li>Verbind $P$ met de raakpunten.</li></ol><p>Vanuit een extern punt zijn er <b>twee</b> raaklijnen, vanuit een punt op de cirkel <b>één</b>.</p>')}`,
  voorbeelden: [{ html: FIG.zeshoek(), stappen: ['\\text{passeropening} = \\text{straal: zes keer afzetten}'] }, { html: FIG.raaklijn(), stappen: ['\\text{cirkel op } [OP] \\text{ als middellijn geeft hoeken van } 90°'] }],
  soorten: {
    herken: herken(['zeshoek', 'raaklijn', 'omgeschreven']),
    omtrek: { naam: 'Zijde en omtrek van de zeshoek', gen() { const r = kies([3, 3.5, 4, 4.5, 5, 6, 7.5]); const wat = kies(['zijde', 'omtrek']);
      return { soort: 'omtrek', html: opgave(`Je construeert een regelmatige zeshoek in een cirkel met straal ${kg(r)} cm.`) + vraag(wat === 'zijde' ? 'Hoe lang is een zijde van de zeshoek?' : 'Hoe groot is de omtrek van de zeshoek?'), sleutel: `z${r}${wat}`,
        antw: getal(wat === 'zijde' ? r : 6 * r, { dec: 2, na: '\\text{ cm}' }), uitleg: [tx('Elke zijde is even lang als de straal.'), wat === 'zijde' ? `${W.texGetal(r)} \\text{ cm}` : `6 \\cdot ${W.texGetal(r)} = ${W.texGetal(6 * r)} \\text{ cm}`] }; } },
    eig: bank('Eigenschappen en stappen', [
      ['Waarom gebruik je de straal als passeropening voor elke zijde van de zeshoek?', 'de zeshoek bestaat uit zes gelijkzijdige driehoeken', ['dat is toevallig', 'de zeshoek is een vierkant', 'de straal is de helft van de zijde'], 'Elke middelpuntshoek is 360° : 6 = 60°, dus elke driehoek is gelijkzijdig: zijde = straal.'],
      ['Welke veelhoek krijg je als je slechts elk tweede hoekpunt van de zeshoek verbindt?', 'een gelijkzijdige driehoek', ['een vierkant', 'een vijfhoek', 'een rechthoek'], 'Drie van de zes hoekpunten, telkens één overgeslagen: een gelijkzijdige driehoek.'],
      ['Welke hoek maakt een raaklijn met de straal naar het raakpunt?', '90°', ['60°', '45°', '180°'], 'Een raaklijn staat loodrecht op de straal in het raakpunt.'],
      ['Hoeveel raaklijnen kan je construeren vanuit een punt buiten de cirkel?', '2', ['1', '0', 'oneindig veel'], 'Vanuit een extern punt zijn er twee raaklijnen.'],
      ['Hoeveel raaklijnen gaan er door een punt óp de cirkel?', '1', ['2', '0', 'oneindig veel'], 'In een punt van de cirkel is er precies één raaklijn.'],
      ['Wat construeer je eerst bij de raaklijnen vanuit P?', 'het midden M van [OP]', ['de bissectrice van hoek P', 'een zeshoek', 'de omgeschreven cirkel van O'], 'Je construeert M met de middelloodlijn van [OP] en tekent dan de cirkel met middellijn [OP].'],
      ['Een raaklijn heeft met de cirkel …', 'precies één punt gemeen', ['twee punten gemeen', 'geen enkel punt gemeen', 'drie punten gemeen'], 'Raken betekent precies één gemeenschappelijk punt.'],
    ]),
  },
  oefenMix: [['herken', 1], ['omtrek', 1], ['eig', 3]],
  test: [['herken', 3], ['omtrek', 2], ['eig', 5]], testSchudden: true,
};

const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D6 = {
  nr: 6, titel: 'Eindtest meetkundige constructies', kort: 'Alles door elkaar.', rekenmachine: true,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><ul><li>middelloodlijn: loodrecht door het midden; punten even ver van $A$ en $B$</li><li>bissectrice: hoek in twee gelijke delen; punten even ver van de benen</li><li>loodlijn: boog rond $P$ + middelloodlijn</li><li>evenwijdige: F- of Z-hoeken gelijk maken</li><li>hoek overbrengen: stralen en koorde overnemen</li><li>lijnstuk verdelen: Thales</li><li>omcentrum: middelloodlijnen · incentrum: bissectrices</li><li>zeshoek: zijde = straal · raaklijn ⟂ straal</li></ul></div>`,
  voorbeelden: [],
  soorten: { e1: herken(Object.keys(FIG)), e2: mix(D1, 'eig', 'Middelloodlijn en bissectrice'), e3: mix(D2, 'eig', 'Loodlijn, evenwijdige, hoek'), e4: mix(D3, 'deel', 'Lijnstuk verdelen'), e5: mix(D3, 'eig', 'Lijnstuk verdelen'),
    e6: mix(D4, 'eig', 'Om- en ingeschreven cirkel'), e7: mix(D5, 'eig', 'Zeshoek en raaklijn'), e8: mix(D5, 'omtrek', 'Zeshoek') },
  oefenMix: [['e1', 2], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1]],
  test: [['e1', 2], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 2], ['e7', 1], ['e8', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6]) {
  for (const s of Object.values(D.soorten)) {
    if (s._ingepakt) continue; s._ingepakt = true;
    const g = s.gen.bind(s);
    s.gen = () => {
      const v = { ...g() };
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

Leerpaden.registreer({
  code: 'meetkundige-constructies',
  titel: 'Meetkundige constructies',
  ondertitel: 'Toegepaste wiskunde · 4BW',
  klas: '4BW',
  drempel: 70,
  intro: `<p>Tien constructies met <b>passer en liniaal</b>: middelloodlijn, bissectrice, loodlijn, evenwijdige, hoek overbrengen, lijnstuk verdelen, omgeschreven en ingeschreven cirkel, regelmatige zeshoek en raaklijn. Het construeren zelf doe je op papier (werkbundel); hier oefen je het <b>herkennen</b>, de <b>stappen</b> en de <b>eigenschappen</b> waarop ze steunen.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>`,
  groepen: [
    { titel: 'A · Basisconstructies', delen: [1, 2, 3] },
    { titel: 'B · Cirkels en veelhoeken', delen: [4, 5] },
    { titel: 'C · Eindtest', delen: [6] },
  ],
  delen: [D1, D2, D3, D4, D5, D6],
});
})();
