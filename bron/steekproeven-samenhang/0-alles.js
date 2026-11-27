// ===== Steekproeven en samenhang (statistiek) · Wiskunde 5BCW / 5WW =====
// Leidraad: de cursus "7. Steekproeven en samenhang" en de PWP (G. Walschap).
// Volledig conceptueel: herkennen, beoordelen en verklaren — geen berekeningen.
const { rnd, kies, schud } = W;
const getal = (waarde, extra = {}) => ({ soort: 'getal', waarde, voor: '', ...extra });
function zinnen(juist, fout, opt = {}) {
  const alle = schud([juist, ...fout.filter((z, i, a) => z && z !== juist && a.indexOf(z) === i).slice(0, opt.max || 3)]);
  return { soort: 'keuze', lijst: true, opties: alle.map((z, i) => ({ k: String(i), l: z, html: true })), juist: String(alle.indexOf(juist)) };
}
const tekstKeuze = (opties, juist) => ({ soort: 'keuze', opties: opties.map(o => ({ k: o, l: `\\text{${o}}` })), juist });
const opgave = (t) => `<p class="opgave-tekst">${t}</p>`;
const bericht = (t) => `<div class="bericht">${t}</div>`;
const vraag = (t) => `<p class="vraagzin"><b>${t}</b></p>`;
const tx = (s) => '@@' + s;
const hoofd = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- woorden met uitleg (oranje stippellijn)
const WOORDEN = [
  ['populatie', 'De volledige groep waarover je iets wil weten.'],
  ['steekproef', 'Het deel van de populatie dat je effectief bevraagt of onderzoekt.'],
  ['randomisatie', 'Doelbewust toeval gebruiken, zodat elk lid van de populatie evenveel kans heeft om gekozen te worden.'],
  ['aselecte', 'Willekeurig: elk lid van de populatie heeft evenveel kans om gekozen te worden.'],
  ['representatief', 'Een goede afspiegeling van de populatie (leeftijd, geslacht, achtergrond …).'],
  ['zelfselectie', 'Deelnemers beslissen zelf of ze meedoen; daardoor is de steekproef vaak niet representatief.'],
  ['samenhang', 'Twee variabelen veranderen doorgaans samen (ook: correlatie).'],
  ['causaliteit', 'Een oorzakelijk verband: de ene verandering veroorzaakt de andere.'],
  ['derde factor', 'Een onderliggende variabele die twee andere beïnvloedt, zonder dat die elkaar veroorzaken.'],
  ['woonzorgcentrum', 'Een huis waar oudere mensen wonen en zorg krijgen.'],
  ['OCMW', 'Openbaar centrum voor maatschappelijk welzijn: helpt mensen met financiële of sociale problemen.'],
  ['dagcentrum', 'Een centrum waar mensen overdag opvang en begeleiding krijgen.'],
  ['enquête', 'Een vragenlijst om meningen of gegevens te verzamelen.'],
  ['thuisverpleging', 'Verpleegkundigen die zorg geven bij de mensen thuis.'],
  ['jeugdwerker', 'Iemand die jongeren begeleidt in hun vrije tijd, bv. in een jeugdhuis.'],
].sort((p, q) => q[0].length - p[0].length);
function woorden(html) {
  if (!html || typeof html !== 'string' || html.includes('class="woord"')) return html;
  const gebruikt = new Set(), tokens = [];
  const stukken = html.split(/(<span class="woord"[\s\S]*?<\/span><\/span>|<[^>]+>|\$\$[\s\S]*?\$\$|\$[^$]*\$)/);
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
const STIJL = `
.woord{border-bottom:2px dotted #e8772e;cursor:help;position:relative;outline:none}
.woord .woord-uitleg{display:none;position:absolute;left:0;top:1.5em;z-index:30;width:250px;background:#fffbe6;border:1px solid #e8c36a;border-radius:6px;padding:6px 8px;font-size:13px;line-height:1.4;color:#1f2733;font-weight:normal;font-style:normal;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.woord:hover .woord-uitleg,.woord:focus .woord-uitleg{display:block}
.vraagzin{margin-top:12px;font-size:16px}
.bericht{background:#fff;border:1px solid #b9c6d2;border-left:5px solid #1c4e8a;border-radius:6px;padding:10px 14px;margin:8px 0;font-style:italic;font-size:16px}
.diagram3{display:flex;flex-direction:column;align-items:center;gap:6px;margin:10px 0}
.diagram3 .vak{border:2px solid #1c4e8a;border-radius:8px;padding:6px 12px;background:#fff;font-weight:bold;text-align:center}
.diagram3 .vak.f{border-color:#e8772e;color:#c2561a;background:#fff4ec}
.diagram3 .rij{display:flex;gap:40px;align-items:center}
`;
if (typeof document !== 'undefined' && document.head && !document.getElementById('sts-stijl')) { const st = document.createElement('style'); st.id = 'sts-stijl'; st.textContent = STIJL; document.head.appendChild(st); }
const diagram = (f, a, b) => `<div class="diagram3"><div class="vak f">${f}</div><div>↙ &nbsp; &nbsp; ↘</div><div class="rij"><div class="vak">${a}</div><span style="color:#4e6577">- - samenhang - -</span><div class="vak">${b}</div></div></div>`;

const AFSPRAAK = `<div class="kader"><div class="kader-titel">Afspraken in dit leerpad</div>
  <ul><li>In dit hoofdstuk reken je niets uit: je <b>herkent</b>, <b>beoordeelt</b> en <b>verklaart</b>. Lees elke situatie rustig en goed.</li>
  <li>Een woord met een <span style="border-bottom:2px dotted #e8772e">oranje stippellijn</span> eronder is een moeilijk woord: raak het aan voor de uitleg.</li></ul></div>`;

// ===================================================================
//  BANKEN MET SITUATIES
// ===================================================================
// organisatie, lidwoord, wie (meervoud), onderwerp
const ORG = [
  ['woonzorgcentrum', 'het', 'bewoners', 'de maaltijden', [80, 120, 150]], ['school', 'de', 'leerlingen', 'het schoolrestaurant', [600, 900, 1200]],
  ['jeugdhuis', 'het', 'leden', 'de nieuwe openingsuren', [150, 200, 300]], ['ziekenhuis', 'het', 'patiënten van de afdeling', 'de bezoekuren', [60, 90, 120]],
  ['dagcentrum', 'het', 'cliënten', 'de activiteiten', [40, 60, 80]], ['OCMW', 'het', 'cliënten', 'de dienstverlening', [500, 800, 1000]],
  ['kinderdagverblijf', 'het', 'ouders', 'de breng- en haaluren', [70, 90, 110]], ['sportclub', 'de', 'leden', 'het nieuwe trainingsschema', [250, 400, 500]],
  ['thuisverpleging', 'de', 'cliënten', 'de planning van de bezoeken', [300, 450, 600]],
];
function sitPS() {
  const [org, lw, wie, ond, Ns] = kies(ORG), N = kies(Ns), n = kies([10, 15, 20, 25, 30, 40, 50, 60, 80, 100].filter(x => x <= N / 2 && x >= N / 15));
  return { org, lw, wie, ond, N, n, tekst: `${hoofd(lw === 'het' ? 'een' : 'een')} ${org} met ${N} ${wie} bevraagt ${n} ${wie} over ${ond}.`,
    pop: `alle ${N} ${wie} van ${lw} ${org}`, st: `de ${n} bevraagde ${wie}`, sl: `${org}${N}${n}` };
}
// besluiten: [bericht, mag?, uitleg]
const BESLUIT = [
  ['Een ziekenhuis meet de bloeddruk van 100 patiënten op de afdeling cardiologie. De krant schrijft: "De Belgen hebben een te hoge bloeddruk."', false, 'De steekproef bestaat uit patiënten met hartproblemen: geen afspiegeling van alle Belgen.'],
  ['Een school trekt via de computer 80 leerlingen uit de volledige leerlingenlijst. 70% vindt de nieuwe schooluren goed. De directeur besluit: "De meeste leerlingen van onze school vinden de nieuwe uren goed."', true, 'Aselecte steekproef uit precies de populatie waarover het besluit gaat.'],
  ['Een fitnessclub bevraagt 50 van haar leden: 90% sport minstens drie keer per week. Een website schrijft: "90% van de jongeren sport drie keer per week."', false, 'Leden van een fitnessclub sporten meer dan gemiddeld: ze zijn geen afspiegeling van alle jongeren.'],
  ['Een woonzorgcentrum loot 40 van zijn 120 bewoners uit en bevraagt hen over de maaltijden. Het besluit: "Een grote meerderheid van onze bewoners is tevreden over de maaltijden."', true, 'Geloot uit alle bewoners van het woonzorgcentrum, en het besluit gaat over die bewoners.'],
  ['Een bibliotheek bevraagt de bezoekers van zaterdag: 95% leest elke week een boek. De gemeente besluit: "Bijna alle inwoners lezen elke week."', false, 'Bibliotheekbezoekers lezen meer dan gemiddeld; de populatie "alle inwoners" werd niet goed vertegenwoordigd.'],
  ['Een jeugdhuis trekt willekeurig 60 namen uit zijn ledenlijst van 300. 75% wil langere openingsuren. Het bestuur besluit: "De meeste leden willen langere openingsuren."', true, 'Willekeurig getrokken uit alle leden, en het besluit gaat over de leden.'],
  ['Een online forum over slaapproblemen vraagt zijn bezoekers hoe ze slapen: 80% slaapt slecht. Een tijdschrift kopt: "80% van de Vlamingen slaapt slecht."', false, 'Wie een forum over slaapproblemen bezoekt, slaapt vaker slecht dan gemiddeld (zelfselectie).'],
  ['Een kinderdagverblijf bevraagt alle ouders van zijn eigen kinderen over de haaluren. Het besluit iets over "de ouders van onze kinderen".', true, 'Dan is de hele populatie bevraagd: het besluit gaat over precies die groep.'],
];
// is dit randomisatie? [situatie, ja?, uitleg]
const RANDOM = [
  ['Een school laat een computer 30 namen trekken uit de volledige leerlingenlijst.', true, 'Elke leerling heeft evenveel kans om gekozen te worden.'],
  ['Een begeleider bevraagt de jongeren die vanavond toevallig in het jeugdhuis zijn.', false, 'Wie vanavond niet komt, maakt geen kans.'],
  ['Een verpleegkundige kiest zelf 10 patiënten die "goed kunnen vertellen".', false, 'De onderzoeker kiest zelf: bepaalde patiënten worden voorgetrokken.'],
  ['Een OCMW trekt via lootjes 25 dossiers uit alle dossiers van dit jaar.', true, 'Elk dossier heeft evenveel kans.'],
  ['Een woonzorgcentrum bevraagt de eerste 50 bewoners die in de cafetaria zitten.', false, 'Bedlegerige bewoners of wie de cafetaria vermijdt, maken nooit kans.'],
  ['Uit de volledige bewonerslijst trekt een computerprogramma willekeurig 50 namen.', true, 'Elke bewoner had op voorhand evenveel kans.'],
  ['Een onderzoeker zet een oproep op sociale media: "Wie wil meedoen aan ons onderzoek?"', false, 'Mensen kiezen zelf of ze meedoen (zelfselectie).'],
  ['Een stad trekt willekeurig 500 adressen uit het bevolkingsregister.', true, 'Elke inwoner van de stad heeft evenveel kans.'],
  ['Een leerkracht bevraagt de leerlingen die vooraan in de klas zitten.', false, 'Wie achteraan zit, maakt geen kans.'],
  ['Een dagcentrum laat elke cliënt een genummerd lootje trekken en kiest de nummers 1 tot 15.', true, 'Het toeval beslist wie gekozen wordt; iedereen heeft evenveel kans.'],
  ['Een sportclub bevraagt de leden die na de training nog in de kantine blijven.', false, 'Leden die meteen naar huis gaan, maken geen kans.'],
  ['Een ziekenhuis kiest met een toevalsgenerator 40 patiënten uit alle opnames van vorige maand.', true, 'Elke opgenomen patiënt heeft evenveel kans.'],
  ['Een onderzoeker bevraagt de eerste 30 mensen die het station uitkomen.', false, 'Mensen die geen trein nemen of op een ander moment komen, maken geen kans.'],
  ['Een directeur kiest per klas de leerlingen die het best kunnen uitleggen.', false, 'De directeur kiest zelf; dat is geen toeval.'],
];
// oorzaak van vertekening: [situatie, oorzaak, uitleg]
const OORZ = [
  ['Een jeugdorganisatie zet een enquête op Instagram: wie wil, vult ze in.', 'zelfselectie', 'Jongeren beslissen zelf of ze meedoen.'],
  ['Een dienst gezinszorg belt cliënten tussen 9 u en 12 u op om hun tevredenheid te meten.', 'bereikbaarheid', 'Wie overdag werkt, wordt niet bereikt.'],
  ['Een thuisverpleging bevraagt enkel cliënten via een online formulier.', 'bereikbaarheid', 'Cliënten zonder internet vallen weg.'],
  ['Een directeur bevraagt willekeurig 5 van de 400 leerlingen over de nieuwe schooluren.', 'te kleine steekproef', '5 leerlingen kunnen toevallig allemaal dezelfde mening hebben.'],
  ['Na een cursus mogen deelnemers vrijwillig een beoordeling online zetten.', 'zelfselectie', 'Vooral wie erg tevreden of erg ontevreden is, doet de moeite.'],
  ['Een gemeente bevraagt inwoners enkel via een app.', 'bereikbaarheid', 'Inwoners zonder smartphone vallen weg.'],
  ['Een ziekenhuis trekt willekeurig 3 patiënten om de tevredenheid van alle 900 patiënten te meten.', 'te kleine steekproef', '3 patiënten kunnen toevallig een vertekend beeld geven.'],
  ['Een radiozender vraagt luisteraars om te bellen als ze een mening hebben over de nieuwe jeugdzorgwet.', 'zelfselectie', 'Enkel wie een uitgesproken mening heeft, belt.'],
  ['Een onderzoeker bevraagt bewoners van een woonzorgcentrum enkel tijdens de daguitstap.', 'bereikbaarheid', 'Bewoners die niet mee kunnen (bv. bedlegerig), vallen weg.'],
  ['Een sportclub trekt willekeurig 4 van haar 500 leden om te vragen of het lidgeld omhoog mag.', 'te kleine steekproef', '4 leden is veel te weinig om iets over 500 leden te besluiten.'],
  ['Een website plaatst een poll: "Hoe tevreden bent u over uw huisarts?" Iedereen mag stemmen.', 'zelfselectie', 'Bezoekers beslissen zelf of ze stemmen.'],
  ['Een dienst bevraagt ouderen enkel via e-mail.', 'bereikbaarheid', 'Ouderen zonder e-mail worden niet bereikt.'],
];
const OORZ_ALLE = ['zelfselectie', 'bereikbaarheid', 'te kleine steekproef'];
// waar/niet waar over steekproeven
const WNW_STEEK = [
  ['Een steekproef is altijd representatief als ze groot genoeg is.', false, 'Ook een grote steekproef kan vertekend zijn, bv. door zelfselectie.'],
  ['Bij randomisatie heeft elk lid van de populatie evenveel kans om gekozen te worden.', true, 'Dat is precies de definitie.'],
  ['Een kleine steekproef kan toevallig een vertekend beeld geven, ook als ze aselect getrokken is.', true, 'Bij weinig mensen speelt het toeval een grote rol.'],
  ['Als mensen zelf kiezen om mee te doen, is de steekproef meestal representatief.', false, 'Zelfselectie geeft net vaak een vertekend beeld.'],
  ['De populatie is het deel van de groep dat je effectief bevraagt.', false, 'Dat is de steekproef. De populatie is de volledige groep.'],
  ['Met een online enquête mis je mogelijk mensen zonder internet.', true, 'Dat is een probleem van bereikbaarheid.'],
  ['Randomisatie voorkomt dat de onderzoeker zelf (bewust of onbewust) een bepaalde groep kiest.', true, 'Het toeval beslist, niet de onderzoeker.'],
  ['Een representatieve steekproef is een goede afspiegeling van de populatie.', true, 'Dat is de definitie van representatief.'],
  ['Je kan uit elke steekproef een besluit trekken over alle Belgen.', false, 'Alleen als de steekproef een goede afspiegeling is van de populatie waarover je iets besluit.'],
];
// samenhang of causaliteit: [samenhang-formulering, causaliteit-formulering]
const SC = [
  ['Jongeren die meer sporten, slapen gemiddeld beter.', 'Sporten zorgt ervoor dat jongeren beter slapen.'],
  ['Wijken met meer groen hebben minder inwoners met stress.', 'Een groene wijk verlaagt je stress.'],
  ['Kinderen die meer snoep eten, hebben vaker gaatjes.', 'Snoep eten veroorzaakt gaatjes bij kinderen.'],
  ['Ouderen die veel sociale contacten hebben, voelen zich minder eenzaam.', 'Sociale contacten zorgen ervoor dat ouderen zich minder eenzaam voelen.'],
  ['Leerlingen die meer uren gamen, halen gemiddeld lagere punten.', 'Gamen leidt tot lagere punten.'],
  ['Mensen die meer groenten eten, zijn gemiddeld gezonder.', 'Groenten eten maakt je gezonder.'],
  ['Patiënten die vaker bezoek krijgen, herstellen gemiddeld sneller.', 'Bezoek zorgt ervoor dat patiënten sneller herstellen.'],
  ['Jongeren die veel op sociale media zitten, voelen zich vaker somber.', 'Sociale media veroorzaken sombere gevoelens bij jongeren.'],
  ['Gemeenten met meer jeugdhuizen hebben minder vandalisme.', 'Jeugdhuizen doen het vandalisme dalen.'],
  ['Mensen die meer wandelen, hebben een lagere bloeddruk.', 'Wandelen verlaagt je bloeddruk.'],
  ['Baby\'s die borstvoeding kregen, zijn later minder vaak ziek.', 'Borstvoeding zorgt ervoor dat kinderen later minder vaak ziek zijn.'],
  ['Werknemers met een plant op hun bureau melden minder stress.', 'Een plant op je bureau vermindert stress.'],
];
const WNW_SC = [
  ['Samenhang bewijst causaliteit.', false, 'Samenhang bewijst geen causaliteit: er kan een derde factor, omgekeerde causaliteit of toeval achter zitten.'],
  ['Causaliteit is een sterkere uitspraak dan samenhang.', true, 'Causaliteit zegt dat het ene het andere veroorzaakt; samenhang alleen dat ze samen veranderen.'],
  ['Als twee variabelen samenhang vertonen, veranderen ze doorgaans samen.', true, 'Dat is de definitie van samenhang.'],
  ['Het aantal verkochte ijsjes veroorzaakt verdrinkingen.', false, 'Warm weer is een derde factor die beide doet stijgen.'],
  ['Een ander woord voor samenhang is correlatie.', true, 'Samenhang wordt ook correlatie genoemd.'],
  ['Woorden als "zorgt voor" of "veroorzaakt" wijzen op een uitspraak over causaliteit.', true, 'Ze beweren een oorzaak.'],
  ['Als A en B samenhangen, veroorzaakt A altijd B.', false, 'Misschien veroorzaakt B net A, of is er een derde factor.'],
];
// valkuilen: [bericht, soort, uitleg, derde factor of omgekeerde verklaring]
const VAL = [
  ['Ziekenhuizen met meer artsen hebben meer overlijdens.', 'derde factor', 'Grotere ziekenhuizen hebben meer artsen én meer zware patiënten.', 'de grootte van het ziekenhuis'],
  ['Kinderen met grotere voeten lezen beter.', 'derde factor', 'Oudere kinderen hebben grotere voeten én lezen beter.', 'de leeftijd'],
  ['Mensen met meer grijze haren dragen vaker een bril.', 'derde factor', 'Oudere mensen hebben vaker grijze haren én zien slechter.', 'de leeftijd'],
  ['In de zomer worden er meer ijsjes verkocht en zijn er meer verdrinkingen.', 'derde factor', 'Warm weer zorgt voor meer ijsjes én meer zwemmen.', 'het warme weer'],
  ['Hoe meer brandweerlieden bij een brand, hoe groter de schade.', 'derde factor', 'Bij een grote brand komen meer brandweerlieden én is de schade groter.', 'de grootte van de brand'],
  ['In maanden met meer verkochte zonnecrème zijn er meer bezoekers in de spoeddienst na een fietsongeval.', 'derde factor', 'Bij mooi weer wordt meer zonnecrème verkocht én wordt er meer gefietst.', 'het mooie weer'],
  ['Mensen die veel pijnstillers nemen, hebben vaker pijn.', 'omgekeerde causaliteit', 'Wie pijn heeft, neemt pijnstillers: de pijn is de oorzaak.', 'Wie pijn heeft, neemt meer pijnstillers.'],
  ['Jongeren die vaker naar de jeugdwerker gaan, hebben meer schoolproblemen.', 'omgekeerde causaliteit', 'Jongeren met schoolproblemen zoeken vaker hulp bij de jeugdwerker.', 'Jongeren met schoolproblemen zoeken vaker hulp bij de jeugdwerker.'],
  ['Mensen die vaker naar de huisarts gaan, zijn vaker ziek.', 'omgekeerde causaliteit', 'Wie ziek is, gaat vaker naar de huisarts.', 'Wie ziek is, gaat vaker naar de huisarts.'],
  ['Wijken met meer politie hebben meer criminaliteit.', 'omgekeerde causaliteit', 'Waar veel criminaliteit is, zet men meer politie in.', 'Waar veel criminaliteit is, zet men meer politie in.'],
  ['Mensen die een rollator gebruiken, vallen vaker.', 'omgekeerde causaliteit', 'Wie slecht te been is en vaker valt, krijgt een rollator.', 'Wie vaker valt of slecht te been is, krijgt een rollator.'],
  ['In ons dagcentrum van 8 cliënten kwamen de cliënten met een kat het vaakst op tijd.', 'toeval', 'Met 8 cliënten is de groep veel te klein: dit kan puur toeval zijn.', ''],
  ['In één klas van 20 leerlingen halen de leerlingen met een rode jas de beste punten (er werden 30 kenmerken vergeleken).', 'toeval', 'Kleine groep en veel vergeleken kenmerken: dan vind je altijd wel ergens een "verband".', ''],
  ['Bij 6 bewoners van een woonzorgcentrum sliepen degenen die thee dronken het best.', 'toeval', 'Met 6 bewoners kan dit puur toeval zijn.', ''],
];
const VAL_SOORT = ['derde factor', 'omgekeerde causaliteit', 'toeval'];
const FOUTE_FACTOR = ['de kleur van het gebouw', 'het weer van gisteren', 'het aantal letters in de naam', 'de dag van de week', 'de lengte van de onderzoeker'];
// cases: [bericht, vragen: {populatie, steekproef(probleem), soort(samenhang/causaliteit), valkuil, conclusie}]
const CASES = [
  { b: 'Een onderzoek bij 40 vrijwillige deelnemers aan een online forum voor jongvolwassenen toont aan dat 90% van hen zich weleens eenzaam voelt.',
    pop: 'alle jongvolwassenen', prob: 'zelfselectie: wie actief is op zo\'n forum, voelt zich mogelijk vaker eenzaam dan gemiddeld', conc: 'De 90% zegt weinig over jongvolwassenen in het algemeen.' },
  { b: 'Scholen met een hoger budget voor sportinfrastructuur hebben leerlingen met betere examenresultaten. Meer investeren in sportinfrastructuur verbetert dus de examenresultaten.',
    sc: 'causaliteit', val: 'derde factor', fac: 'meer middelen in het algemeen (kleinere klassen, meer leerkrachten, betere begeleiding)', conc: 'De samenhang bewijst niet dat de sportinfrastructuur zelf de resultaten verbetert.' },
  { b: 'In ons woonzorgcentrum vallen bewoners die elke week naar de beweegnamiddag komen, minder vaak. Bewegen voorkomt dus valpartijen.',
    sc: 'causaliteit', val: 'derde factor', fac: 'de algemene gezondheid van de bewoners', prob: 'zelfselectie: vooral de fittere bewoners kiezen om te komen', conc: 'De samenhang bewijst nog niet dat bewegen valpartijen voorkomt.' },
  { b: 'Een gemeente zet een poll op Facebook: "Moet de bibliotheek langer open?" 1200 mensen stemmen, 88% zegt ja. De gemeente besluit dat bijna alle inwoners langere openingsuren willen.',
    pop: 'alle inwoners van de gemeente', prob: 'zelfselectie en bereikbaarheid: wie stemt, kiest zelf, en wie niet op Facebook zit, valt weg', conc: 'De 88% zegt weinig over alle inwoners, ook al stemden er veel mensen.' },
  { b: 'Een hulpverleningsorganisatie ziet dat cliënten die naar de praatgroep komen, minder vaak hervallen. Ze schrijft: "De praatgroep zorgt ervoor dat cliënten niet hervallen."',
    sc: 'causaliteit', val: 'derde factor', fac: 'de motivatie van de cliënten', prob: 'zelfselectie: cliënten kiezen zelf of ze naar de praatgroep komen', conc: 'De samenhang bewijst niet dat de praatgroep zelf het hervallen voorkomt.' },
  { b: 'Een ziekenhuis bevraagt 15 patiënten die toevallig in de wachtzaal zitten: 14 vinden de wachttijd aanvaardbaar. Het ziekenhuis besluit: "Onze patiënten vinden de wachttijden geen probleem."',
    pop: 'alle patiënten van het ziekenhuis', prob: 'geen randomisatie en een kleine steekproef: wie al lang wachtte of vertrok, werd niet bevraagd', conc: 'Je mag dit niet besluiten over alle patiënten.' },
  { b: 'Jongeren die meer tijd doorbrengen in het jeugdhuis, hebben meer vrienden. Het jeugdhuis besluit: "Naar het jeugdhuis gaan zorgt voor meer vrienden."',
    sc: 'causaliteit', val: 'omgekeerde causaliteit', fac: '', omg: 'jongeren met veel vrienden gaan net vaker naar het jeugdhuis', conc: 'De samenhang bewijst niet dat het jeugdhuis zelf voor meer vrienden zorgt.' },
];

// ===================================================================
//  DEEL 1 · POPULATIE EN STEEKPROEF
// ===================================================================
const D1 = {
  nr: 1, titel: 'Populatie en steekproef', kort: 'De volledige groep en het deel dat je bevraagt.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Instap: hoe tevreden zijn de bezoekers écht?</div>
      <p>Een jeugdwelzijnsorganisatie wil weten hoe tevreden jongeren zijn over hun nieuwe fuifzaal. Ze plaatst een korte enquête op Instagram. Binnen een week vullen 200 jongeren de enquête in: 85% zegt "heel tevreden" te zijn.</p>
      <p>Geeft die 85% een goed beeld van álle bezoekers? Wie vult zo'n enquête in, en wie niet? Daarover gaat dit hoofdstuk: hoe je een steekproef goed trekt, en hoe je een verband kritisch beoordeelt.</p></div>
    <div class="kader def"><div class="kader-titel">Populatie en steekproef</div>
      <p>De <b>populatie</b> is de volledige groep waarover je iets wil weten (bv. alle bezoekers van de fuifzaal).<br>Een <b>steekproef</b> is het deel van die populatie dat je effectief bevraagt of onderzoekt (bv. de 200 jongeren die de enquête invulden).</p>
      <p>De hele populatie bevragen is meestal <b>onmogelijk</b>, <b>te duur</b> of <b>te tijdrovend</b>. Daarom werk je met een steekproef, maar die moet dan wel een goede <b>afspiegeling</b> zijn van de populatie. Anders trek je verkeerde conclusies.</p></div>
    <div class="kader werk"><div class="kader-titel">Let op wat je besluit</div>
      <p>Een ziekenhuis meet de bloeddruk van 100 patiënten op de afdeling cardiologie. De krant schrijft: "De Belgen hebben een te hoge bloeddruk."<br>Steekproef: de 100 patiënten · populatie in het besluit: alle Belgen. Dat mag niet: patiënten op cardiologie zijn geen afspiegeling van alle Belgen.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Een woonzorgcentrum met 120 bewoners bevraagt 40 bewoners over de maaltijden.'), stappen: [tx('populatie: alle 120 bewoners van het woonzorgcentrum'), tx('steekproef: de 40 bevraagde bewoners')] },
  ],
  soorten: {
    pop: { naam: 'Wat is de populatie?', gen() {
      const S = sitPS();
      return { soort: 'pop', opdracht: 'De populatie is de volledige groep waarover je iets wil weten.', html: opgave(S.tekst) + vraag('Wat is de populatie?'), sleutel: 'p' + S.sl,
        antw: zinnen(S.pop, [S.st, `${S.ond}`, `alle ${S.wie} in België`]), uitleg: [tx(`populatie: ${S.pop}`)] };
    } },
    steek: { naam: 'Wat is de steekproef?', gen() {
      const S = sitPS();
      return { soort: 'steek', opdracht: 'De steekproef is het deel dat effectief bevraagd wordt.', html: opgave(S.tekst) + vraag('Wat is de steekproef?'), sleutel: 's' + S.sl,
        antw: zinnen(S.st, [S.pop, `${S.ond}`, `de ${S.N - S.n} ${S.wie} die niet bevraagd werden`]), uitleg: [tx(`steekproef: ${S.st}`)] };
    } },
    grootte: { naam: 'Hoe groot?', gen() {
      const S = sitPS(), welk = kies(['populatie', 'steekproef']);
      return { soort: 'grootte', opdracht: 'Lees de situatie goed.', html: opgave(S.tekst) + vraag(`Hoeveel ${S.wie} telt de ${welk}?`), sleutel: 'g' + S.sl + welk,
        antw: getal(welk === 'populatie' ? S.N : S.n), uitleg: [tx(`${welk}: ${welk === 'populatie' ? S.pop : S.st}`)] };
    } },
    besluit: { naam: 'Mag je dit besluiten?', gen() {
      const [b, ok, u] = kies(BESLUIT);
      return { soort: 'besluit', opdracht: 'Gaat het besluit over dezelfde groep als de steekproef, en is die een goede afspiegeling?', html: bericht(b) + vraag('Mag men dit besluiten?'), sleutel: b,
        antw: tekstKeuze(['ja', 'nee'], ok ? 'ja' : 'nee'), uitleg: [tx(u)] };
    } },
    waarom: { naam: 'Waarom een steekproef?', gen() {
      const v = kies([
        ['Waarom werkt men meestal met een steekproef?', 'De hele populatie bevragen is vaak onmogelijk, te duur of te tijdrovend.', ['Een steekproef geeft altijd een juister resultaat dan de hele populatie.', 'Omdat de populatie altijd klein is.', 'Omdat je met een steekproef niets hoeft te controleren.']],
        ['Waaraan moet een steekproef voldoen om er een besluit over de populatie uit te trekken?', 'Ze moet een goede afspiegeling zijn van de populatie.', ['Ze moet minstens 10 000 mensen bevatten.', 'Ze moet alleen tevreden mensen bevatten.', 'Ze moet door de onderzoeker zelf gekozen worden.']],
        ['Wat is het verschil tussen populatie en steekproef?', 'De populatie is de volledige groep; de steekproef is het deel dat je bevraagt.', ['De steekproef is de volledige groep; de populatie is het deel dat je bevraagt.', 'Er is geen verschil.', 'De populatie zijn altijd personen, een steekproef zijn altijd getallen.']],
      ]);
      return { soort: 'waarom', opdracht: 'Kies het juiste antwoord.', html: vraag(v[0]), sleutel: v[0], antw: zinnen(v[1], v[2]), uitleg: [tx(v[1])] };
    } },
  },
  oefenMix: [['pop', 2], ['steek', 2], ['grootte', 1], ['besluit', 2], ['waarom', 1]],
  test: [['pop', 2], ['steek', 2], ['grootte', 1], ['besluit', 3], ['waarom', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 2 · RANDOMISATIE
// ===================================================================
const D2 = {
  nr: 2, titel: 'Aselecte steekproef en randomisatie', kort: 'Elk lid van de populatie heeft evenveel kans.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Aselecte steekproef en randomisatie</div>
      <p>Een <b>aselecte steekproef</b> (of random steekproef) is een steekproef waarbij elk lid van de populatie <b>evenveel kans</b> heeft om gekozen te worden.<br>Het doelbewust gebruiken van <b>toeval</b> bij het trekken van een steekproef noem je <b>randomisatie</b>.</p>
      <p>Randomisatie is belangrijk omdat ze voorkomt dat de onderzoeker (bewust of onbewust) een groep kiest die toevallig al een bepaalde mening of een bepaald kenmerk deelt.</p></div>
    <div class="kader werk"><div class="kader-titel">50 bewoners van een woonzorgcentrum bevragen</div>
      <table class="tabel"><tr><th>Aanpak 1</th><th>Aanpak 2</th></tr>
      <tr><td>de eerste 50 bewoners die toevallig in de cafetaria zitten</td><td>via een computerprogramma 50 namen willekeurig trekken uit de volledige bewonerslijst</td></tr>
      <tr><td><b>geen randomisatie:</b> bedlegerige bewoners of wie de cafetaria vermijdt, maakt nooit kans</td><td><b>wel randomisatie:</b> elke bewoner had op voorhand evenveel kans</td></tr></table></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Een begeleider bevraagt de jongeren die vanavond toevallig in het jeugdhuis zijn.'), stappen: [tx('geen randomisatie: wie vanavond niet komt, maakt geen kans')] },
    { html: opgave('Een stad trekt willekeurig 500 adressen uit het bevolkingsregister.'), stappen: [tx('wel randomisatie: elke inwoner heeft evenveel kans')] },
  ],
  soorten: {
    isRandom: { naam: 'Is dit randomisatie?', gen() {
      const [v, ok, u] = kies(RANDOM);
      return { soort: 'isRandom', opdracht: 'Heeft elk lid van de populatie evenveel kans?', html: opgave(v) + vraag('Is dit randomisatie?'), sleutel: v, antw: tekstKeuze(['ja', 'nee'], ok ? 'ja' : 'nee'), uitleg: [tx(u)] };
    } },
    beste: { naam: 'Welke aanpak is aselect?', gen() {
      const [org, lw, wie] = kies(ORG), n = kies([20, 30, 40, 50]);
      const juist = `${n} namen willekeurig laten trekken door een computer uit de volledige lijst van alle ${wie}`;
      const fout = [`de eerste ${n} ${wie} bevragen die vandaag binnenkomen`, `${n} ${wie} kiezen die de onderzoeker goed kent`, `een oproep doen en de eerste ${n} ${wie} nemen die zich melden`, `${n} ${wie} bevragen die makkelijk bereikbaar zijn via e-mail`];
      return { soort: 'beste', opdracht: 'Bij randomisatie beslist het toeval.', html: opgave(`${hoofd(lw === 'het' ? 'het' : 'de')} ${org} wil ${n} ${wie} bevragen.`) + vraag('Welke aanpak is een aselecte steekproef?'), sleutel: org + n,
        antw: zinnen(juist, schud(fout)), uitleg: [tx('Alleen als het toeval kiest uit de volledige lijst, heeft iedereen evenveel kans.')] };
    } },
    waarom: { naam: 'Waarom randomisatie?', gen() {
      const v = kies([
        ['Waarom is randomisatie belangrijk?', 'Ze voorkomt dat de onderzoeker (bewust of onbewust) een groep kiest die al een bepaalde mening of een bepaald kenmerk deelt.', ['Ze zorgt ervoor dat de steekproef kleiner kan.', 'Ze zorgt ervoor dat alleen tevreden mensen meedoen.', 'Ze maakt het onderzoek sneller.']],
        ['Wat is een aselecte steekproef?', 'Een steekproef waarbij elk lid van de populatie evenveel kans heeft om gekozen te worden.', ['Een steekproef die de onderzoeker zelf zorgvuldig kiest.', 'Een steekproef van vrijwilligers.', 'Een steekproef die de hele populatie bevat.']],
        ['Wat is randomisatie?', 'Het doelbewust gebruiken van toeval bij het trekken van een steekproef.', ['Het bevragen van de mensen die het makkelijkst te bereiken zijn.', 'Het weglaten van vreemde antwoorden.', 'Het bevragen van zoveel mogelijk mensen.']],
        ['Waarom is randomisatie moeilijk met enkel een online enquête?', 'Je hebt geen volledige lijst van de populatie en mensen kiezen zelf of ze meedoen.', ['Omdat online enquêtes altijd te kort zijn.', 'Omdat computers geen toeval kunnen gebruiken.', 'Omdat online enquêtes altijd te veel mensen bereiken.']],
      ]);
      return { soort: 'waarom', opdracht: 'Kies het juiste antwoord.', html: vraag(v[0]), sleutel: v[0], antw: zinnen(v[1], v[2]), uitleg: [tx(v[1])] };
    } },
    wieGeenKans: { naam: 'Wie maakt geen kans?', gen() {
      const v = kies([
        ['Een woonzorgcentrum bevraagt de eerste 50 bewoners die in de cafetaria zitten.', 'bewoners die bedlegerig zijn of de cafetaria vermijden', ['bewoners die graag koffie drinken', 'bewoners die in de cafetaria zitten', 'het personeel']],
        ['Een jeugdhuis bevraagt de jongeren die op zaterdagavond aanwezig zijn.', 'jongeren die op zaterdagavond niet komen (bv. omdat ze werken)', ['jongeren die op zaterdagavond aanwezig zijn', 'de jeugdwerkers', 'jongeren die graag fuiven']],
        ['Een ziekenhuis bevraagt patiënten die in de wachtzaal zitten tussen 9 u en 10 u.', 'patiënten die op een ander moment komen of niet in de wachtzaal wachten', ['patiënten in de wachtzaal tussen 9 u en 10 u', 'de artsen', 'patiënten die vroeg opstaan']],
        ['Een sportclub bevraagt de leden die na de training in de kantine blijven.', 'leden die na de training meteen naar huis gaan', ['leden die in de kantine blijven', 'de trainers', 'leden die graag praten']],
      ]);
      return { soort: 'wieGeenKans', opdracht: 'Bij een aselecte steekproef heeft iedereen evenveel kans. Hier niet.', html: opgave(v[0]) + vraag('Wie maakt hier geen kans om bevraagd te worden?'), sleutel: v[0], antw: zinnen(v[1], v[2]), uitleg: [tx(v[1])] };
    } },
  },
  oefenMix: [['isRandom', 3], ['beste', 1], ['waarom', 2], ['wieGeenKans', 1]],
  test: [['isRandom', 4], ['beste', 2], ['waarom', 2], ['wieGeenKans', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 3 · REPRESENTATIVITEIT
// ===================================================================
const D3 = {
  nr: 3, titel: 'Representativiteit', kort: 'Is de steekproef een goede afspiegeling van de populatie?', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Representativiteit</div>
      <p>Een steekproef is <b>representatief</b> als ze, wat belangrijke kenmerken betreft (leeftijd, geslacht, achtergrond …), een goede <b>afspiegeling</b> is van de volledige populatie. Een niet-representatieve steekproef geeft een <b>vertekend beeld</b>, ook al is de steekproef op zich groot genoeg.</p></div>
    <div class="kader eig"><div class="kader-titel">Oorzaken van een niet-representatieve steekproef</div>
      <ul><li><b>Zelfselectie</b> (vrijwillige respons): mensen die zelf beslissen om deel te nemen, zijn vaak niet representatief. Denk aan de Instagram-enquête: vooral tevreden of erg ontevreden bezoekers doen de moeite.</li>
      <li><b>Bereikbaarheid</b>: als je enkel mensen bevraagt die makkelijk te bereiken zijn (bv. enkel online, of enkel overdag telefonisch), mis je systematisch bepaalde groepen (mensen zonder internet, mensen die overdag werken …).</li>
      <li><b>Te kleine steekproef</b>: een kleine steekproef kan toevallig een vertekend beeld geven, zelfs als ze aselect getrokken is.</li></ul></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: opgave('Een stad wil weten hoeveel inwoners de buurtgezondheidscentra gebruiken en bevraagt mensen bij de ingang van een centrum.'), stappen: [tx('niet representatief: iedereen die je bevraagt, gebruikt het centrum al')] },
    { html: opgave('Een thuisverpleging bevraagt enkel cliënten via een online formulier.'), stappen: [tx('bereikbaarheid: cliënten zonder internet vallen weg')] },
  ],
  soorten: {
    oorzaak: { naam: 'Welke oorzaak?', gen() {
      const [v, o, u] = kies(OORZ);
      return { soort: 'oorzaak', opdracht: 'Zelfselectie, bereikbaarheid of een te kleine steekproef?', html: opgave(v) + vraag('Waardoor is deze steekproef niet representatief?'), sleutel: v, antw: tekstKeuze(OORZ_ALLE, o), uitleg: [tx(u)] };
    } },
    wnw: { naam: 'Waar of niet waar?', gen() {
      const [v, ok, u] = kies(WNW_STEEK);
      return { soort: 'wnw', opdracht: 'Denk aan de definities.', html: opgave(v) + vraag('Waar of niet waar?'), sleutel: v, antw: tekstKeuze(['waar', 'niet waar'], ok ? 'waar' : 'niet waar'), uitleg: [tx(u)] };
    } },
    groot: { naam: 'Groot maar vertekend', gen() {
      const v = kies([
        ['Een tv-programma laat kijkers stemmen via sms: 25 000 mensen stemmen. Is dit representatief voor alle Vlamingen?', 'Nee: ondanks de grootte kiezen de kijkers zelf of ze stemmen (zelfselectie).'],
        ['Een gemeente krijgt 3000 antwoorden op een online enquête. Is dit representatief voor alle inwoners?', 'Nee: inwoners zonder internet of die de enquête niet zien, vallen weg, en mensen kiezen zelf of ze meedoen.'],
        ['Een ziekenhuis bevraagt 2000 bezoekers van de spoeddienst over de gezondheid van de Belgen. Is dit representatief?', 'Nee: bezoekers van de spoeddienst zijn vaker ziek of gewond dan gemiddeld.'],
      ]);
      return { soort: 'groot', opdracht: 'Een grote steekproef is niet automatisch representatief.', html: opgave(v[0]), sleutel: v[0],
        antw: zinnen(v[1], ['Ja: zoveel mensen geven altijd een goed beeld.', 'Ja: een steekproef is representatief zodra ze meer dan 1000 mensen telt.', 'Nee: een steekproef moet altijd de hele populatie bevatten.']), uitleg: [tx(v[1])] };
    } },
    beter: { naam: 'Hoe kan het beter?', gen() {
      const v = kies([
        ['De Instagram-enquête over de fuifzaal uit de instap.', 'Willekeurig bezoekers kiezen (bv. uit de ticketverkoop) en hen persoonlijk bevragen.'],
        ['Een dienst gezinszorg belt cliënten enkel tussen 9 u en 12 u op.', 'Willekeurig cliënten uit de volledige lijst kiezen en hen ook \'s avonds of op een andere manier bevragen.'],
        ['Een thuisverpleging bevraagt enkel cliënten via een online formulier.', 'Willekeurig cliënten uit de volledige lijst kiezen en hen ook op papier of tijdens een bezoek bevragen.'],
        ['Een directeur bevraagt 5 van de 400 leerlingen.', 'Meer leerlingen willekeurig trekken uit de volledige leerlingenlijst.'],
      ]);
      return { soort: 'beter', opdracht: 'Wat maakt de steekproef representatiever?', html: opgave(v[0]) + vraag('Welke aanpassing maakt de steekproef het meest representatief?'), sleutel: v[0],
        antw: zinnen(v[1], ['Alleen de mensen bevragen die al tevreden zijn.', 'De enquête korter maken, maar verder niets veranderen.', 'De onderzoeker zelf laten kiezen wie het best kan antwoorden.']), uitleg: [tx(v[1])] };
    } },
  },
  oefenMix: [['oorzaak', 3], ['wnw', 2], ['groot', 1], ['beter', 1]],
  test: [['oorzaak', 4], ['wnw', 3], ['groot', 1], ['beter', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 4 · SAMENHANG VERSUS CAUSALITEIT
// ===================================================================
const D4 = {
  nr: 4, titel: 'Samenhang versus causaliteit', kort: 'Samen veranderen is nog geen oorzaak.', rekenmachine: false,
  theorie: `<div class="kader def"><div class="kader-titel">Samenhang en causaliteit</div>
      <p>Twee variabelen vertonen <b>samenhang</b> (of <b>correlatie</b>) als ze de neiging hebben om samen te veranderen: als de ene stijgt (of daalt), stijgt (of daalt) de andere doorgaans mee.</p>
      <p><b>Causaliteit</b> betekent dat de verandering in de ene variabele <b>veroorzaakt</b> wordt door de verandering in de andere. Dat is een veel sterkere uitspraak dan samenhang.</p>
      <p class="midden" style="font-size:18px;color:#c2561a"><b>Samenhang bewijst geen causaliteit.</b></p></div>
    <div class="kader werk"><div class="kader-titel">Ijsjes en verdrinkingen</div>
      <p>Het aantal verkochte ijsjes en het aantal verdrinkingen hangen sterk samen doorheen het jaar. Veroorzaakt ijsjes eten verdrinkingen? Natuurlijk niet: een <b>derde factor</b>, warm weer, zorgt ervoor dat mensen zowel meer ijsjes eten als meer gaan zwemmen.</p>
      ${diagram('warm weer', 'meer ijsjes', 'meer verdrinkingen')}</div>
    <div class="kader"><div class="kader-titel">Signaalwoorden</div><p>"zorgt voor", "veroorzaakt", "verlaagt", "leidt tot", "maakt je …", "dus" … beweren een <b>oorzaak</b>. "hangt samen met", "hebben vaker", "gaat samen met" beschrijven een <b>samenhang</b>.</p></div>${AFSPRAAK}`,
  voorbeelden: [
    { html: bericht('Jongeren die meer sporten, slapen gemiddeld beter.'), stappen: [tx('samenhang: er staat alleen dat ze samen voorkomen')] },
    { html: bericht('Sporten zorgt ervoor dat jongeren beter slapen.'), stappen: [tx('causaliteit: "zorgt ervoor" beweert een oorzaak')] },
  ],
  soorten: {
    samOfCaus: { naam: 'Samenhang of causaliteit?', gen() {
      const p = kies(SC), c = Math.random() < 0.5 ? 0 : 1;
      return { soort: 'samOfCaus', opdracht: 'Beweert men alleen dat ze samen veranderen, of dat het ene het andere veroorzaakt?', html: bericht(p[c]) + vraag('Is dit een uitspraak over samenhang of over causaliteit?'), sleutel: p[c],
        antw: tekstKeuze(['samenhang', 'causaliteit'], c ? 'causaliteit' : 'samenhang'), uitleg: [tx(c ? 'Er wordt een oorzaak beweerd (signaalwoord: "zorgt voor", "veroorzaakt", "verlaagt", "leidt tot", "maakt" …).' : 'Er staat alleen dat de twee samen voorkomen: samenhang.')] };
    } },
    magDat: { naam: 'Mag je dat besluiten?', gen() {
      const p = kies(SC);
      return { soort: 'magDat', opdracht: 'Samenhang bewijst geen causaliteit.', html: opgave('Een onderzoek stelt vast:') + bericht(p[0]) + vraag(`Mag je daaruit besluiten: "${p[1]}"?`), sleutel: 'm' + p[0],
        antw: zinnen('Nee: dit is een samenhang; die bewijst geen oorzakelijk verband.', ['Ja: als twee zaken samen voorkomen, veroorzaakt het ene altijd het andere.', 'Ja, maar alleen als de steekproef groot is.', 'Nee: de twee hebben niets met elkaar te maken.']),
        uitleg: [tx('Er kan een derde factor, omgekeerde causaliteit of toeval achter de samenhang zitten.')] };
    } },
    wnw: { naam: 'Waar of niet waar?', gen() {
      const [v, ok, u] = kies(WNW_SC);
      return { soort: 'wnw', opdracht: 'Denk aan de definities.', html: opgave(v) + vraag('Waar of niet waar?'), sleutel: v, antw: tekstKeuze(['waar', 'niet waar'], ok ? 'waar' : 'niet waar'), uitleg: [tx(u)] };
    } },
    begrip: { naam: 'Begrippen', gen() {
      const v = kies([
        ['Wat is samenhang (correlatie)?', 'Twee variabelen hebben de neiging om samen te veranderen.', ['De ene variabele veroorzaakt de andere.', 'Twee variabelen zijn altijd gelijk.', 'Een variabele die nooit verandert.']],
        ['Wat is causaliteit?', 'De verandering in de ene variabele veroorzaakt de verandering in de andere.', ['Twee variabelen veranderen toevallig samen.', 'Twee variabelen hebben niets met elkaar te maken.', 'Een steekproef die representatief is.']],
        ['Welke uitspraak is het sterkst?', '"A veroorzaakt B."', ['"A en B hangen samen."', '"Als A stijgt, stijgt B doorgaans mee."', '"A en B veranderen vaak samen."']],
      ]);
      return { soort: 'begrip', opdracht: 'Kies het juiste antwoord.', html: vraag(v[0]), sleutel: v[0], antw: zinnen(v[1], v[2]), uitleg: [tx(v[1])] };
    } },
  },
  oefenMix: [['samOfCaus', 3], ['magDat', 2], ['wnw', 2], ['begrip', 1]],
  test: [['samOfCaus', 4], ['magDat', 2], ['wnw', 2], ['begrip', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 5 · VALKUILEN
// ===================================================================
const D5 = {
  nr: 5, titel: 'Veelvoorkomende valkuilen', kort: 'Derde factor, omgekeerde causaliteit en toeval.', rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Zie je een samenhang? Denk dan eerst aan …</div>
      <ul><li><b>Derde factor</b> (verstorende variabele): een onderliggende factor beïnvloedt beide variabelen tegelijk (zoals het weer bij de ijsjes en de verdrinkingen).</li>
      <li><b>Omgekeerde causaliteit</b>: misschien is het net andersom. "Jongeren die vaker naar de jeugdwerker gaan, hebben meer schoolproblemen": veroorzaakt de jeugdwerker de problemen, of gaan jongeren met problemen juist vaker naar de jeugdwerker op zoek naar hulp?</li>
      <li><b>Toeval</b>: bij een kleine steekproef of bij het vergelijken van veel variabelen tegelijk kan een verband puur toevallig ontstaan, zonder enige onderliggende reden.</li></ul></div>
    <div class="kader werk"><div class="kader-titel">Een derde factor zoeken</div>
      <p>"Mensen met meer grijze haren dragen vaker een bril." De derde factor is de <b>leeftijd</b>: oudere mensen hebben vaker grijze haren én zien vaker slechter.</p>
      ${diagram('leeftijd', 'grijze haren', 'een bril dragen')}</div>${AFSPRAAK}`,
  voorbeelden: [
    { html: bericht('Mensen die veel pijnstillers nemen, hebben vaker pijn.'), stappen: [tx('omgekeerde causaliteit: wie pijn heeft, neemt pijnstillers')] },
    { html: bericht('In ons dagcentrum van 8 cliënten kwamen de cliënten met een kat het vaakst op tijd.'), stappen: [tx('toeval: veel te kleine groep')] },
  ],
  soorten: {
    welke: { naam: 'Welke valkuil?', gen() {
      const [b, s, u] = kies(VAL);
      return { soort: 'welke', opdracht: 'Derde factor, omgekeerde causaliteit of toeval?', html: bericht(b) + vraag('Welke valkuil verklaart deze samenhang het best?'), sleutel: b, antw: tekstKeuze(VAL_SOORT, s), uitleg: [tx(u)] };
    } },
    factor: { naam: 'Zoek de derde factor', gen() {
      const v = kies(VAL.filter(x => x[1] === 'derde factor')), andere = VAL.filter(x => x[1] === 'derde factor' && x[3] !== v[3]).map(x => x[3]);
      return { soort: 'factor', opdracht: 'Welke factor beïnvloedt beide variabelen tegelijk?', html: bericht(v[0]) + vraag('Wat is de meest waarschijnlijke derde factor?'), sleutel: 'f' + v[0],
        antw: zinnen(v[3], schud([...schud(andere).slice(0, 1), ...schud(FOUTE_FACTOR).slice(0, 2)])), uitleg: [tx(v[2])] };
    } },
    omgekeerd: { naam: 'Omgekeerde causaliteit', gen() {
      const v = kies(VAL.filter(x => x[1] === 'omgekeerde causaliteit')), andere = VAL.filter(x => x[1] === 'omgekeerde causaliteit' && x[0] !== v[0]).map(x => x[3]);
      return { soort: 'omgekeerd', opdracht: 'Misschien is het net andersom.', html: bericht(v[0]) + vraag('Welke verklaring is een voorbeeld van omgekeerde causaliteit?'), sleutel: 'o' + v[0],
        antw: zinnen(v[3], [...schud(andere).slice(0, 2), 'Het is altijd toeval.']), uitleg: [tx(v[2])] };
    } },
    toeval: { naam: 'Wanneer toeval?', gen() {
      const v = kies([
        ['Wanneer kan een samenhang puur toevallig ontstaan?', 'bij een kleine steekproef of als je veel variabelen tegelijk vergelijkt', ['alleen als de steekproef heel groot is', 'alleen bij randomisatie', 'nooit: een samenhang heeft altijd een oorzaak']],
        ['Wat doe je best met een verband dat je vond in één kleine groep?', 'het controleren in een nieuwe, grotere steekproef', ['het meteen als oorzaak publiceren', 'de groep nog kleiner maken', 'niets: het bewijs is geleverd']],
      ]);
      return { soort: 'toeval', opdracht: 'Kies het juiste antwoord.', html: vraag(v[0]), sleutel: v[0], antw: zinnen(v[1], v[2]), uitleg: [tx(v[1])] };
    } },
  },
  oefenMix: [['welke', 3], ['factor', 2], ['omgekeerd', 1], ['toeval', 1]],
  test: [['welke', 4], ['factor', 3], ['omgekeerd', 2], ['toeval', 1]], testSchudden: true,
};

// ===================================================================
//  DEEL 6 · CASES ONTLEDEN
// ===================================================================
const STAPPEN = `<ol><li><b>Populatie en steekproef:</b> over wie gaat de uitspraak? Wie werd effectief bevraagd?</li><li><b>Representativiteit:</b> is er randomisatie? Zelfselectie, bereikbaarheid, te klein?</li>
  <li><b>Samenhang of causaliteit?</b> Wordt er een oorzaak beweerd, of alleen een samenhang?</li><li><b>Valkuilen:</b> derde factor, omgekeerde causaliteit of toeval?</li><li><b>Conclusie:</b> wat mag je wél besluiten, en wat niet?</li></ol>`;
const D6 = {
  nr: 6, titel: 'Cases ontleden', kort: 'Berichten en onderzoek uit de zorg en welzijn kritisch bekijken.', rekenmachine: false,
  theorie: `<div class="kader eig"><div class="kader-titel">Zo ontleed je een bericht of onderzoek</div>${STAPPEN}</div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld A</div>${bericht(CASES[0].b)}
      <p><b>Populatie/steekproef:</b> de populatie zou "alle jongvolwassenen" kunnen zijn, maar de steekproef bestaat enkel uit forumgebruikers die vrijwillig deelnamen.<br><b>Representativiteit:</b> waarschijnlijk niet: zelfselectie.<br><b>Conclusie:</b> ${CASES[0].conc}</p></div>
    <div class="kader werk"><div class="kader-titel">Voorbeeld B</div>${bericht(CASES[1].b)}
      <p>Een uitspraak over <b>causaliteit</b>, gebaseerd op een samenhang. Mogelijke <b>derde factor</b>: ${CASES[1].fac}.<br><b>Conclusie:</b> ${CASES[1].conc}</p></div>${AFSPRAAK}`,
  voorbeelden: [],
  soorten: {
    casePop: { naam: 'Populatie in een case', gen() {
      const C = kies(CASES.filter(c => c.pop));
      return { soort: 'casePop', opdracht: 'Stap 1: over wie gaat de uitspraak?', html: bericht(C.b) + vraag('Over welke populatie wil men iets besluiten?'), sleutel: 'p' + C.b,
        antw: zinnen(C.pop, CASES.filter(c => c.pop && c.pop !== C.pop).map(c => c.pop).concat(['alleen de onderzoekers'])), uitleg: [tx(C.pop)] };
    } },
    caseProb: { naam: 'Wat is het probleem met de steekproef?', gen() {
      const C = kies(CASES.filter(c => c.prob));
      return { soort: 'caseProb', opdracht: 'Stap 2: is de steekproef representatief?', html: bericht(C.b) + vraag('Wat is het belangrijkste probleem met de steekproef?'), sleutel: 'r' + C.b,
        antw: zinnen(C.prob, ['er is geen probleem: de steekproef is representatief', 'de steekproef is te groot', 'er werden te veel vragen gesteld']), uitleg: [tx(C.prob)] };
    } },
    caseSC: { naam: 'Samenhang of causaliteit in een case?', gen() {
      const C = kies(CASES.filter(c => c.sc));
      return { soort: 'caseSC', opdracht: 'Stap 3: beweert men een oorzaak?', html: bericht(C.b) + vraag('Wat beweert het besluit?'), sleutel: 's' + C.b,
        antw: zinnen('causaliteit, gebaseerd op een samenhang', ['enkel een samenhang', 'niets: er wordt niets besloten', 'een uitspraak over een populatie zonder steekproef']), uitleg: [tx('Er wordt een oorzaak beweerd ("dus", "zorgt ervoor", "verbetert", "voorkomt"), terwijl men alleen een samenhang zag.')] };
    } },
    caseVal: { naam: 'Valkuil in een case', gen() {
      const C = kies(CASES.filter(c => c.val));
      const juist = C.val === 'derde factor' ? `een derde factor, bv. ${C.fac}` : `omgekeerde causaliteit: ${C.omg}`;
      return { soort: 'caseVal', opdracht: 'Stap 4: welke valkuil?', html: bericht(C.b) + vraag('Welke verklaring maakt het besluit twijfelachtig?'), sleutel: 'v' + C.b,
        antw: zinnen(juist, ['er is geen enkele andere verklaring mogelijk', 'de samenhang bewijst de oorzaak', 'de steekproef is te groot']), uitleg: [tx(juist)] };
    } },
    caseConc: { naam: 'Conclusie', gen() {
      const C = kies(CASES);
      return { soort: 'caseConc', opdracht: 'Stap 5: wat mag je besluiten?', html: bericht(C.b) + vraag('Welke conclusie is correct?'), sleutel: 'c' + C.b,
        antw: zinnen(C.conc, ['Het besluit is helemaal juist.', 'Je mag alleen besluiten dat het onderzoek fout is en niets betekent.', 'Het besluit is juist omdat er cijfers in staan.']), uitleg: [tx(C.conc)] };
    } },
  },
  oefenMix: [['casePop', 1], ['caseProb', 2], ['caseSC', 1], ['caseVal', 2], ['caseConc', 2]],
  test: [['casePop', 2], ['caseProb', 2], ['caseSC', 2], ['caseVal', 2], ['caseConc', 2]], testSchudden: true,
};

// ===================================================================
//  DEEL 7 · EINDTEST
// ===================================================================
const mix = (D, s, naam) => ({ naam, gen() { const v = D.soorten[s].gen(); return { ...v, soort: 'D' + D.nr + s }; } });
const D7 = {
  nr: 7, titel: 'Eindtest steekproeven en samenhang', kort: 'Alle soorten vragen door elkaar.', rekenmachine: false,
  theorie: `<div class="kader"><div class="kader-titel">Alles samen</div><p>In deze eindtest komen alle soorten vragen door elkaar. Herhaal gerust de theorie van een vorig deel.</p></div>
    <div class="kader eig"><div class="kader-titel">Stappenplan</div>${STAPPEN}</div>${AFSPRAAK}`,
  voorbeelden: [],
  soorten: {
    e1: mix(D1, 'pop', 'Populatie'), e2: mix(D1, 'besluit', 'Mag je dit besluiten?'), e3: mix(D2, 'isRandom', 'Randomisatie'), e4: mix(D3, 'oorzaak', 'Oorzaak van vertekening'), e5: mix(D3, 'wnw', 'Steekproeven: waar of niet waar'),
    e6: mix(D4, 'samOfCaus', 'Samenhang of causaliteit'), e7: mix(D4, 'magDat', 'Mag je dat besluiten?'), e8: mix(D5, 'welke', 'Welke valkuil?'), e9: mix(D5, 'factor', 'Derde factor'), e10: mix(D6, 'caseConc', 'Case: conclusie'),
  },
  oefenMix: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]],
  test: [['e1', 1], ['e2', 1], ['e3', 1], ['e4', 1], ['e5', 1], ['e6', 1], ['e7', 1], ['e8', 1], ['e9', 1], ['e10', 1]], testSchudden: true,
};

for (const D of [D1, D2, D3, D4, D5, D6, D7]) {
  for (const s of Object.values(D.soorten)) {
    const g = s.gen.bind(s);
    s.gen = () => {
      const v = { ...g() };
      if (v.html) v.html = woorden(v.html);
      if (v.uitleg && v.uitleg.length) {
        const a = v.antw, juist = a && a.soort === 'keuze' ? (a.opties.find(o => o.k === a.juist) || {}).l : null;
        v.uitlegHtml = (v.uitlegHtml || '') + [].concat(v.uitleg).filter(u => !(u.startsWith('@@') && u.slice(2) === juist))
          .map(u => `<div class="uitlegregel">${u.startsWith('@@') ? W.esc(u.slice(2)) : W.tex(u)}</div>`).join('');
        v.uitleg = [];
      }
      return v;
    };
  }
  D.theorie = woorden(D.theorie);
  for (const vb of D.voorbeelden) if (vb.html) vb.html = woorden(vb.html);
  for (const vb of D.voorbeelden) vb.stappen = vb.stappen.map(u => (typeof u === 'string' && u.startsWith('@@') ? { html: `<p>${W.esc(u.slice(2))}</p>` } : u));
}

Leerpaden.registreer({
  code: 'steekproeven-samenhang',
  titel: 'Steekproeven en samenhang',
  ondertitel: 'Wiskunde · 5BCW / 5WW',
  klas: '5BCW',
  drempel: 70,
  intro: `<p>Je leert het verschil tussen <b>populatie</b> en <b>steekproef</b>, waarom <b>randomisatie</b> belangrijk is, wanneer een steekproef <b>representatief</b> is,
    en het verschil tussen <b>samenhang</b> en <b>causaliteit</b>, met de valkuilen derde factor, omgekeerde causaliteit en toeval. Tot slot ontleed je zelf berichten uit de zorg en welzijn. Alles volgt de PowerPoint uit de les.</p>
    <p>Lees de theorie, bekijk de voorbeelden, oefen zoveel je wil en maak dan de test van 10 vragen. Haal je <b>7 op 10</b>, dan gaat het volgende deel open.</p>
    <p>Je rekent in dit hoofdstuk niets uit: je herkent, beoordeelt en verklaart. Lees elke situatie dus goed.</p>`,
  groepen: [
    { titel: 'A · Steekproeven', delen: [1, 2, 3] },
    { titel: 'B · Samenhang en causaliteit', delen: [4, 5] },
    { titel: 'C · Kritisch toepassen', delen: [6] },
    { titel: 'D · Eindtest', delen: [7] },
  ],
  delen: [D1, D2, D3, D4, D5, D6, D7],
});
