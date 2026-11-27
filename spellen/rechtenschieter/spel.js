// Rechtenschieter — themaspel bij functieleer 5–9 (7VJHO).
// Je schiet rechten y = ax + b door doelen op een rooster. Elk level hoort bij een stuk van de PWP:
// 5. f(x) = c en f(x) = ax · 6. f(x) = ax + b (evenwijdige rechten) · 7. functievoorschrift opstellen
// 8. vergelijkingen en ongelijkheden grafisch oplossen · 9. differentiecoëfficiënt en hellingshoek.
(() => {
  const { esc, T, getal, komma, feedback } = TM;
  const rnd = W.rnd, kies = W.kies;
  const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
  const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const BLAUW = '#1c6fb8', ORANJE = '#f28c16', GROEN = '#2b8f5c', ROOD = '#cf4a3f';
  const EPS = 1e-6;

  // ---------- getallen en TeX
  const tg = (x) => W.texGetal(x);
  const breuk = (t, n) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n); return { t: t / g, n: n / g, v: t / n }; };
  const bTex = (q) => q.n === 1 ? tg(q.t) : `${q.t < 0 ? '-' : ''}\\frac{${Math.abs(q.t)}}{${q.n}}`;
  function voorschrift(a, b, naam = 'f') { // a als breuk-object, b als getal
    let s = '';
    if (a.t !== 0) s = (a.n === 1 && Math.abs(a.t) === 1 ? (a.t < 0 ? '-' : '') : bTex(a)) + 'x';
    if (b !== 0 || !s) s += s ? ` ${b < 0 ? '-' : '+'} ${tg(Math.abs(b))}` : tg(b);
    return `${naam}(x) = ${s}`;
  }

  // ---------- het rooster (SVG)
  const M = 8, B = 400, PAD = 18, SC = (B - 2 * PAD) / (2 * M);
  const X = (x) => PAD + (x + M) * SC, Y = (y) => PAD + (M - y) * SC;
  function lijn(a, b, kleur, opt = {}) {
    if (opt.label && Math.abs(a * opt.lx + b) > 6.5) { // label binnen het rooster houden
      const xs = []; for (let x = -7; x <= 6; x += 0.5) if (Math.abs(a * x + b) <= 6.5) xs.push(x);
      if (xs.length) opt.lx = opt.lx < 0 ? xs[0] : xs[xs.length - 1];
    }
    const x1 = -M - 1, x2 = M + 1;
    return `<line x1="${X(x1)}" y1="${Y(a * x1 + b)}" x2="${X(x2)}" y2="${Y(a * x2 + b)}" stroke="${kleur}" stroke-width="${opt.dik || 3}" ${opt.streep ? 'stroke-dasharray="8 6"' : ''} class="${opt.klasse || ''}" stroke-linecap="round"/>`
      + (opt.label ? `<text x="${X(opt.lx)}" y="${Y(a * opt.lx + b) - 8}" fill="${kleur}" font-weight="700" font-size="15">${esc(opt.label)}</text>` : '');
  }
  const doel = (x, y, raak) => `<g class="doel${raak === true ? ' raak' : raak === false ? ' mis' : ''}"><circle cx="${X(x)}" cy="${Y(y)}" r="11" fill="#fff" stroke="${ROOD}" stroke-width="3"/>
      <circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="${ROOD}"/></g>`;
  const punt = (x, y, label, kleur = BLAUW) => `<circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="${kleur}"/>${label ? `<text x="${X(x) + 8}" y="${Y(y) - 8}" font-size="14" font-weight="700" fill="${kleur}">${esc(label)}</text>` : ''}`;
  function rooster(inhoud = '') {
    let g = '';
    for (let k = -M; k <= M; k++) {
      g += `<line x1="${X(k)}" y1="${Y(-M)}" x2="${X(k)}" y2="${Y(M)}" stroke="#e1e8ef"/><line x1="${X(-M)}" y1="${Y(k)}" x2="${X(M)}" y2="${Y(k)}" stroke="#e1e8ef"/>`;
      if (k && k % 2 === 0) g += `<text x="${X(k)}" y="${Y(0) + 15}" font-size="11" text-anchor="middle" fill="#6b7a8c">${k < 0 ? '−' + -k : k}</text><text x="${X(0) - 6}" y="${Y(k) + 4}" font-size="11" text-anchor="end" fill="#6b7a8c">${k < 0 ? '−' + -k : k}</text>`;
    }
    g += `<line x1="${X(-M)}" y1="${Y(0)}" x2="${X(M) + 8}" y2="${Y(0)}" stroke="#334" stroke-width="1.5"/><line x1="${X(0)}" y1="${Y(-M)}" x2="${X(0)}" y2="${Y(M) - 8}" stroke="#334" stroke-width="1.5"/>
      <text x="${X(M) + 4}" y="${Y(0) - 6}" font-size="13" font-style="italic">x</text><text x="${X(0) + 6}" y="${Y(M) - 2}" font-size="13" font-style="italic">y</text>`;
    return `<svg viewBox="0 0 ${B} ${B}" width="${B}" height="${B}" role="img" aria-label="rooster"><defs><clipPath id="kader"><rect x="${PAD}" y="${PAD}" width="${B - 2 * PAD}" height="${B - 2 * PAD}"/></clipPath></defs>
      ${g}<g clip-path="url(#kader)">${inhoud}</g></svg>`;
  }
  const stijl = document.createElement('style');
  stijl.textContent = `.schot{stroke-dasharray:1200;stroke-dashoffset:1200;animation:schiet .7s ease-out forwards}@keyframes schiet{to{stroke-dashoffset:0}}
    .doel.raak circle:first-child{fill:#e3f4ea;stroke:${GROEN}}.doel.raak circle:last-child{fill:${GROEN}}
    .klikbaar{cursor:crosshair}.knipper{animation:kn .8s ease-in-out 2}@keyframes kn{50%{opacity:.2}}`;
  document.head.appendChild(stijl);

  // Helling a = Δy/Δx met kleine noemer, zodat de rechte door roosterpunten loopt.
  const HELLINGEN = [[1, 1], [-1, 1], [2, 1], [-2, 1], [3, 1], [-3, 1], [1, 2], [-1, 2], [3, 2], [-3, 2], [2, 3], [-2, 3], [1, 3], [-1, 3], [1, 4], [-3, 4]];

  // Gemeenschappelijk: invoervelden a en/of b, knop "Schiet!", nakijken.
  // cfg: { vraag (html), rooster(extra svg), velden: ['a','b'] of ['c'], juist: {a,b} (getallen), naam,
  //        uitleg(): string, raakDoelen: [[x,y]] }
  function schietOpdracht(cfg) {
    return {
      render(el, klaar) {
        const veldHTML = cfg.velden.map(v => `<label for="v-${v}">${v} =</label><input id="v-${v}" inputmode="decimal" autocomplete="off" placeholder="${v === 'a' ? 'bv. 3/2' : 'bv. −3'}">`).join('');
        el.innerHTML = `<div class="scenario">${cfg.vraag}</div>
          <div class="svgwrap" id="bord">${rooster(cfg.rooster + cfg.raakDoelen.map(([x, y]) => doel(x, y)).join(''))}</div>
          <div class="midden" id="vs" style="font-size:1.15rem;min-height:1.6em"></div>
          <div class="invul">${veldHTML}</div><div id="msg" class="midden"></div>
          <div class="knoppen"><button class="btn gold" id="schiet" type="button">🎯 Schiet!</button></div>`;
        W.renderIn(el);
        const inp = cfg.velden.map(v => el.querySelector('#v-' + v));
        const toon = () => {
          const w = inp.map(i => getal(i.value));
          if (w.some(isNaN)) { el.querySelector('#vs').innerHTML = ''; return null; }
          const a = cfg.velden[0] === 'c' ? 0 : w[0], b = cfg.velden[0] === 'c' ? w[0] : cfg.velden.includes('b') ? w[1] : 0;
          const q = Number.isInteger(a) ? breuk(a, 1) : (() => { for (let n = 2; n <= 12; n++) if (Math.abs(a * n - Math.round(a * n)) < EPS) return breuk(Math.round(a * n), n); return null; })();
          el.querySelector('#vs').innerHTML = q ? T(voorschrift(q, b, cfg.naam || 'f')) : T(`${cfg.naam || 'f'}(x) = ${komma(a, 3)}x ${b < 0 ? '-' : '+'} ${komma(Math.abs(b), 3)}`);
          return { a, b };
        };
        inp.forEach((i, k) => { i.oninput = toon; i.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); (inp[k + 1] || el.querySelector('#schiet')).focus(); if (!inp[k + 1]) schiet(); } }; });
        if (window.innerWidth > 700) inp[0].focus({ preventScroll: true });
        let klaarGeschoten = false;
        const schiet = () => {
          if (klaarGeschoten) return;
          const s = toon();
          if (!s) { el.querySelector('#msg').innerHTML = '<p class="melding let">Vul ' + cfg.velden.join(' en ') + ' in met een getal (een breuk mag ook, bv. 3/2).</p>'; return; }
          klaarGeschoten = true;
          inp.forEach(i => { i.disabled = true; }); el.querySelector('#schiet').remove(); el.querySelector('#msg').innerHTML = '';
          const raak = cfg.raakDoelen.map(([x, y]) => Math.abs(s.a * x + s.b - y) < 1e-6);
          const ok = raak.every(Boolean) && Math.abs(s.a - cfg.juist.a) < EPS && Math.abs(s.b - cfg.juist.b) < EPS;
          el.querySelector('#bord').innerHTML = rooster(cfg.rooster + lijn(s.a, s.b, ok ? GROEN : ORANJE, { klasse: 'schot' })
            + (ok ? '' : lijn(cfg.juist.a, cfg.juist.b, GROEN, { streep: true, dik: 2 }))
            + cfg.raakDoelen.map(([x, y], k) => doel(x, y, raak[k])).join(''));
          setTimeout(() => feedback(el, ok, (ok ? '' : `<p>De juiste rechte (groen gestreept): ${T(voorschrift(cfg.juistQ, cfg.juist.b, cfg.naam || 'f'))}</p>`) + cfg.uitleg(), klaar,
            ok ? kies(['Raak! 🎯', 'Voltreffer! 🎯', 'In de roos! 🎯']) : raak.some(Boolean) ? 'Eén doel geraakt, maar niet allemaal.' : 'Mis!'), 650);
        };
        el.querySelector('#schiet').onclick = schiet;
      },
    };
  }
  const regel = (s) => `<div class="uitlegregel">${T(s)}</div>`;

  // ---------- level 1: f(x) = c en f(x) = ax
  function opdrachtCofAx() {
    if (Math.random() < 0.3) {
      const c = nz(-6, 6), p = nz(-6, 6);
      return schietOpdracht({ velden: ['c'], naam: 'f', juist: { a: 0, b: c }, juistQ: breuk(0, 1), raakDoelen: [[p, c]], rooster: '',
        vraag: `Schiet een <b>horizontale rechte</b> ${T('f(x) = c')} door het doel. Hoeveel is ${T('c')}?`,
        uitleg: () => regel(`\\text{het doel ligt op hoogte } y = ${tg(c)}`) + regel(`f(x) = ${tg(c)} \\text{ is een horizontale rechte}`) });
    }
    const [dy, dx] = kies(HELLINGEN), k = kies([1, 2, 3].filter(m => Math.abs(m * dx) <= 7 && Math.abs(m * dy) <= 7)) || 1, s = kies([1, -1]);
    const p = s * k * dx, q = s * k * dy, a = breuk(dy, dx);
    return schietOpdracht({ velden: ['a'], naam: 'f', juist: { a: a.v, b: 0 }, juistQ: a, raakDoelen: [[p, q]], rooster: punt(0, 0, 'O', '#334'),
      vraag: `Schiet een rechte ${T('f(x) = ax')} vanuit de oorsprong door het doel. Hoeveel is ${T('a')}?`,
      uitleg: () => regel(`\\text{doel } (${tg(p)}, ${tg(q)})`) + regel(`a = \\frac{y}{x} = \\frac{${tg(q)}}{${tg(p)}} = ${bTex(a)}`) + regel(voorschrift(a, 0)) });
  }
  // ---------- level 2: voorschrift opstellen door twee punten
  function opdrachtTweeDoelen() {
    let dy, dx, xA, yA, b, xB, yB;
    do {
      [dy, dx] = kies(HELLINGEN); const k = kies([1, 2]);
      xA = rnd(-6, 2); b = rnd(-5, 5); const a = dy / dx;
      // A op de rechte met gehele coördinaten: xA een veelvoud van dx
      xA = Math.round(xA / dx) * dx; yA = a * xA + b; xB = xA + k * dx * (dx < 3 ? 2 : 1); yB = a * xB + b;
    } while (!Number.isInteger(yA) || !Number.isInteger(b) || [yA, yB].some(y => Math.abs(y) > 7) || Math.abs(xB) > 7 || xA === xB);
    const a = breuk(dy, dx);
    return schietOpdracht({ velden: ['a', 'b'], naam: 'f', juist: { a: a.v, b }, juistQ: a, raakDoelen: [[xA, yA], [xB, yB]], rooster: '',
      vraag: `Schiet één rechte ${T('f(x) = ax + b')} door <b>beide</b> doelen. Lees de coördinaten van de doelen af en stel het voorschrift op.`,
      uitleg: () => regel(`A(${tg(xA)}, ${tg(yA)}) \\text{ en } B(${tg(xB)}, ${tg(yB)})`)
        + regel(`a = \\frac{\\Delta y}{\\Delta x} = \\frac{${tg(yB)} - ${yA < 0 ? `(${tg(yA)})` : tg(yA)}}{${tg(xB)} - ${xA < 0 ? `(${tg(xA)})` : tg(xA)}} = \\frac{${tg(yB - yA)}}{${tg(xB - xA)}} = ${bTex(a)}`)
        + regel(`y - ${yA < 0 ? `(${tg(yA)})` : tg(yA)} = ${bTex(a)}\\left(x - ${xA < 0 ? `(${tg(xA)})` : tg(xA)}\\right) \\;\\Rightarrow\\; ${voorschrift(a, b, '').replace(/^\(x\) = /, 'y = ')}`) });
  }
  // ---------- level 3: evenwijdige rechte door een doel
  function opdrachtEvenwijdig() {
    let dy, dx, b1, xT, yT, b2;
    do { [dy, dx] = kies(HELLINGEN); b1 = rnd(-4, 4); xT = Math.round(rnd(-6, 6) / dx) * dx; yT = rnd(-6, 6); b2 = yT - dy / dx * xT; }
    while (!Number.isInteger(b2) || b2 === b1 || Math.abs(b2) > 9);
    const a = breuk(dy, dx);
    return schietOpdracht({ velden: ['a', 'b'], naam: 'g', juist: { a: a.v, b: b2 }, juistQ: a, raakDoelen: [[xT, yT]],
      rooster: lijn(a.v, b1, BLAUW, { label: 'f', lx: a.v > 0 ? -6 : 5 }),
      vraag: `De blauwe rechte is ${T(voorschrift(a, b1))}. Schiet een rechte ${T('g(x) = ax + b')} die <b>evenwijdig</b> loopt met ${T('f')} en door het doel gaat.`,
      uitleg: () => regel(`g \\parallel f \\;\\Rightarrow\\; \\text{dezelfde } a = ${bTex(a)}`) + regel(`\\text{doel } (${tg(xT)}, ${tg(yT)}): \\; ${tg(yT)} = ${bTex(a)} \\cdot ${xT < 0 ? `(${tg(xT)})` : tg(xT)} + b`)
        + regel(`b = ${tg(b2)} \\;\\Rightarrow\\; ${voorschrift(a, b2, 'g')}`) });
  }
  // ---------- level 4: grafisch oplossen (snijpunt aanklikken, ongelijkheid)
  function tweeRechten() {
    let f, g, x0, y0;
    do {
      x0 = rnd(-5, 5); y0 = rnd(-5, 5);
      const h1 = kies(HELLINGEN), h2 = kies(HELLINGEN);
      f = { a: breuk(h1[0], h1[1]) }; g = { a: breuk(h2[0], h2[1]) };
      f.b = y0 - f.a.v * x0; g.b = y0 - g.a.v * x0;
    } while (Math.abs(f.a.v - g.a.v) < 0.4 || !Number.isInteger(f.b) || !Number.isInteger(g.b) || Math.abs(f.b) > 8 || Math.abs(g.b) > 8);
    if (Math.random() < 0.3) { g = { a: breuk(0, 1), b: y0 }; } // soms: f(x) = getal
    return { f, g, x0, y0 };
  }
  function opdrachtSnijpunt() {
    const { f, g, x0, y0 } = tweeRechten();
    const svgBasis = lijn(f.a.v, f.b, BLAUW, { label: 'f', lx: -7 }) + lijn(g.a.v, g.b, ORANJE, { label: g.a.t === 0 ? 'y = ' + g.b : 'g', lx: 5.2 });
    const rechterlid = g.a.t === 0 ? tg(g.b) : 'g(x)';
    return { render(el, klaar) {
      el.innerHTML = `<div class="scenario">Los grafisch op: ${T(`f(x) = ${rechterlid}`)} met ${T(voorschrift(f.a, f.b))}${g.a.t === 0 ? '' : ' en ' + T(voorschrift(g.a, g.b, 'g'))}.
          <br><b>Klik op het snijpunt</b> van de twee rechten.</div>
        <div class="svgwrap" id="bord">${rooster(svgBasis)}</div><div class="midden klein" id="info">Je klik springt naar het dichtstbijzijnde roosterpunt.</div>`;
      W.renderIn(el);
      const svg = el.querySelector('svg'); svg.classList.add('klikbaar');
      svg.addEventListener('click', function klik(e) {
        const r = svg.getBoundingClientRect(), sx = (e.clientX - r.left) * B / r.width, sy = (e.clientY - r.top) * B / r.height;
        const x = Math.round((sx - PAD) / SC - M), y = Math.round(M - (sy - PAD) / SC);
        svg.removeEventListener('click', klik);
        const ok = x === x0 && y === y0;
        el.querySelector('#bord').innerHTML = rooster(svgBasis + punt(x, y, `(${x}, ${y})`, ok ? GROEN : ROOD) + (ok ? '' : punt(x0, y0, `(${x0}, ${y0})`, GROEN)));
        el.querySelector('#info').innerHTML = '';
        feedback(el, ok, regel(`\\text{snijpunt } (${tg(x0)}, ${tg(y0)})`) + regel(`\\text{daar zijn beide leden even hoog: } f(${tg(x0)}) = ${tg(y0)}`) + regel(`V = \\{${tg(x0)}\\}`), klaar,
          ok ? 'Raak! Dat is het snijpunt.' : `Niet juist: je klikte op (${x}, ${y}).`);
      });
    } };
  }
  function opdrachtOngelijk() {
    const { f, g, x0 } = tweeRechten();
    const t = kies(['<', '>', '\\leq', '\\geq']), incl = t.includes('eq'), groter = t === '>' || t === '\\geq';
    const fBoven = (x) => f.a.v * x + f.b > g.a.v * x + g.b;
    const rechts = fBoven(x0 + 1) === groter; // oplossing rechts van x0?
    const opties = [`]-\\infty, ${tg(x0)}[`, `]-\\infty, ${tg(x0)}]`, `]${tg(x0)}, +\\infty[`, `[${tg(x0)}, +\\infty[`];
    const juist = rechts ? (incl ? 3 : 2) : (incl ? 1 : 0);
    const rechterlid = g.a.t === 0 ? tg(g.b) : 'g(x)';
    return { render(el, klaar) {
      el.innerHTML = `<div class="scenario">Los grafisch op: ${T(`f(x) ${t} ${rechterlid}`)} met ${T(voorschrift(f.a, f.b))}${g.a.t === 0 ? '' : ' en ' + T(voorschrift(g.a, g.b, 'g'))}.</div>
        <div class="svgwrap">${rooster(lijn(f.a.v, f.b, BLAUW, { label: 'f', lx: -7 }) + lijn(g.a.v, g.b, ORANJE, { label: g.a.t === 0 ? 'y = ' + g.b : 'g', lx: 5.2 }))}</div>
        <div class="keuzes">${opties.map((o, k) => `<button type="button" data-k="${k}">${T('V = ' + o)}</button>`).join('')}</div>`;
      W.renderIn(el);
      el.querySelectorAll('.keuzes button').forEach(b => b.onclick = () => {
        const k = +b.dataset.k, ok = k === juist;
        el.querySelectorAll('.keuzes button').forEach(x => { x.disabled = true; if (+x.dataset.k === juist) x.classList.add('juist'); });
        if (!ok) b.classList.add('fout');
        feedback(el, ok, regel(`\\text{snijpunt bij } x = ${tg(x0)}`) + regel(`\\text{de grafiek van } f \\text{ ligt ${groter ? 'boven' : 'onder'} ${g.a.t === 0 ? 'de rechte y = ' + tg(g.b) : 'die van g'} ${rechts ? 'rechts' : 'links'} van } x = ${tg(x0)}`)
          + regel(`${tg(x0)} \\text{ hoort er${incl ? '' : ' niet'} bij: } V = ${opties[juist]}`), klaar);
      });
    } };
  }
  // ---------- level 5: differentiecoëfficiënt en hellingshoek
  function opdrachtHelling() {
    let dy, dx, xA, yA, xB, yB;
    do { dx = rnd(1, 6); dy = nz(-7, 7); xA = rnd(-7, 7 - dx); yA = rnd(-7, 7); xB = xA + dx; yB = yA + dy; }
    while (Math.abs(yB) > 7 || ggd(dy, dx) > 1 && Math.random() < 0.5);
    const a = dy / dx, al = Math.atan(a) * 180 / Math.PI, alR = Math.round(al * 100) / 100;
    const b = yA - a * xA;
    return { render(el, klaar) {
      el.innerHTML = `<div class="scenario">Een skischans loopt in een rechte lijn van ${T(`A(${tg(xA)}, ${tg(yA)})`)} naar ${T(`B(${tg(xB)}, ${tg(yB)})`)}.
          Bereken de <b>differentiecoëfficiënt</b> en de <b>hellingshoek</b> ${T('\\alpha')} van de schans (rond ${T('\\alpha')} af op 2 decimalen). 🧮 Rekentoestel toegestaan.</div>
        <div class="svgwrap">${rooster(lijn(a, b, BLAUW, { dik: 2, streep: true }) + `<line x1="${X(xA)}" y1="${Y(yA)}" x2="${X(xB)}" y2="${Y(yB)}" stroke="${BLAUW}" stroke-width="5" stroke-linecap="round"/>` + punt(xA, yA, 'A') + punt(xB, yB, 'B'))}</div>
        <div class="invul"><label for="v-dq">dq =</label><input id="v-dq" inputmode="decimal" autocomplete="off" placeholder="bv. 3/4">
          <label for="v-al">α ≈</label><input id="v-al" inputmode="decimal" autocomplete="off" placeholder="graden"><span>°</span></div><div id="msg"></div>
        <div class="knoppen"><button class="btn gold" id="check" type="button">⛷️ Controleer</button></div>`;
      W.renderIn(el);
      const i1 = el.querySelector('#v-dq'), i2 = el.querySelector('#v-al');
      if (window.innerWidth > 700) i1.focus({ preventScroll: true });
      i1.onkeydown = (e) => { if (e.key === 'Enter') i2.focus(); };
      i2.onkeydown = (e) => { if (e.key === 'Enter') el.querySelector('#check').click(); };
      el.querySelector('#check').onclick = () => {
        const dq = getal(i1.value), h = getal(i2.value);
        if (isNaN(dq) || isNaN(h)) { el.querySelector('#msg').innerHTML = '<p class="melding let midden">Vul beide vakjes in met een getal.</p>'; return; }
        const okDq = Math.abs(dq - a) < 1e-6 || Math.abs(dq - Math.round(a * 100) / 100) < 1e-9, okAl = Math.abs(h - alR) < 0.0051;
        i1.disabled = i2.disabled = true; el.querySelector('#check').remove(); el.querySelector('#msg').innerHTML = '';
        const q = breuk(dy, dx);
        feedback(el, okDq && okAl, regel(`dq = \\frac{\\Delta y}{\\Delta x} = \\frac{${tg(yB)} - ${yA < 0 ? `(${tg(yA)})` : tg(yA)}}{${tg(xB)} - ${xA < 0 ? `(${tg(xA)})` : tg(xA)}} = ${bTex(q)}${q.n === 1 ? '' : ` \\approx ${tg(Math.round(a * 100) / 100)}`}`)
          + regel(`a = dq = \\tan \\alpha \\;\\Rightarrow\\; \\alpha = \\tan^{-1}\\left(${bTex(q)}\\right) \\approx ${tg(alR)}^\\circ`)
          + (okDq && okAl ? '' : `<p class="klein">${okDq ? 'De differentiecoëfficiënt is juist.' : 'De differentiecoëfficiënt is niet juist.'} ${okAl ? 'De hoek is juist.' : 'De hoek is niet juist (2 decimalen!).'}</p>`), klaar,
          okDq && okAl ? 'Perfecte sprong! ⛷️' : 'Niet helemaal juist.');
      };
    } };
  }

  window.THEMA = {
    sleutel: 'rechtenschieter-v1', icoon: '🎯', titel: 'Rechtenschieter', ondertitel: 'Functieleer · delen 5 tot 9',
    intro: `<p class="muted">Schiet rechten door de doelen op het rooster! Typ ${T('a')} en ${T('b')}, bekijk je voorschrift en druk op <b>Schiet</b>.
      Een breuk mag je typen als <code>3/2</code>, een kommagetal als <code>1,5</code>.</p>`,
    levels: [
      { id: 'r1', naam: 'Recht vanuit de oorsprong', kort: 'f(x) = c en f(x) = ax', n: 6, nodig: 5, maak: opdrachtCofAx,
        uitleg: `${T('f(x) = c')}: horizontale rechte op hoogte ${T('c')}. ${T('f(x) = ax')}: rechte door de oorsprong, ${T('a = \\frac{y}{x}')}.` },
      { id: 'r2', naam: 'Twee vliegen in één klap', kort: 'Voorschrift opstellen door twee punten', n: 6, nodig: 5, maak: opdrachtTweeDoelen,
        uitleg: `${T('a = \\frac{\\Delta y}{\\Delta x}')}, daarna ${T('y - y_A = a(x - x_A)')}.` },
      { id: 'r3', naam: 'Evenwijdig schieten', kort: 'Dezelfde richting, ander snijpunt met de y-as', n: 6, nodig: 5, maak: opdrachtEvenwijdig,
        uitleg: 'Evenwijdige rechten hebben <b>dezelfde</b> richtingscoëfficiënt ' + T('a') + '.' },
      { id: 'r4', naam: 'Kruispunt', kort: 'Vergelijkingen en ongelijkheden grafisch oplossen', n: 6, nodig: 5,
        maak: () => Math.random() < 0.5 ? opdrachtSnijpunt() : opdrachtOngelijk(),
        uitleg: 'Het snijpunt geeft de oplossing van ' + T('f(x) = g(x)') + '. Bij een ongelijkheid kijk je waar de grafiek van ' + T('f') + ' boven of onder ligt.' },
      { id: 'r5', naam: 'Skischans', kort: 'Differentiecoëfficiënt en hellingshoek', n: 5, nodig: 4, maak: opdrachtHelling,
        uitleg: T('dq = \\frac{\\Delta y}{\\Delta x}') + ' en ' + T('\\alpha = \\tan^{-1}(a)') + '. Zet je rekentoestel in graden (DEG)!' },
    ],
  };
  TM.start();
})();
