# Leerpaden wiskunde — installatie

Eén website en één databank voor **al je online leerpaden**. Het eerste leerpad is
**De reële getallen** (zelfstudie 7VJHO, 10 delen). Later kunnen er andere programma's bij
(zoals de remediëring Machten en wortels), met dezelfde leerkrachtlogin en dezelfde
leerlingaccounts.

> De bestaande remediëring (Supabase-project *remediering 5DOF H1*, repo *remediering-wortels*)
> wordt hierdoor **niet** aangeraakt. Je maakt een nieuw project en een nieuwe repo.

Eenmalig ongeveer 15 minuten.

## 1. Nieuwe databank (Supabase)

1. Ga naar https://supabase.com en meld je aan.
2. Klik op **New project** en vul in:
   * **Name**: `leerpaden`
   * **Database password**: kies er een en bewaar het (je hebt het normaal niet meer nodig).
   * **Region**: *Central EU (Frankfurt)*.
3. Wacht tot het project klaar is (±2 min).
4. Open links **SQL Editor** en klik op **New query**.
5. Plak de volledige inhoud van `supabase/schema.sql` en klik op **Run**. Je ziet "Success".
6. Maak een nieuwe query en stel je leerkrachtwachtwoord in (minstens 8 tekens):

   ```sql
   select lk_stel_wachtwoord('JouwSterkWachtwoord');
   ```

   Dit ene wachtwoord geldt voor alle leerpaden. Je kan het later opnieuw zo wijzigen.
7. Klik bovenaan op **Connect** (of **Project Settings → API Keys**) en kopieer:
   * de **Project URL**, bv. `https://abcdefgh.supabase.co`;
   * de **publishable** key (begint met `sb_publishable_…`) of de oude **anon** key (begint met `eyJ…`).
8. Open `js/config.js` en vul beide in tussen de aanhalingstekens.

> De publishable/anon key mag publiek zijn: leerlingen kunnen niets rechtstreeks lezen,
> alles loopt via beveiligde functies.
>
> **Let op:** een gratis Supabase-project wordt gepauzeerd na 7 dagen zonder enig gebruik.
> Je krijgt dan een mail; klik in het dashboard op **Restore**. Er gaat niets verloren.

## 2. Website (GitHub Pages)

1. Ga naar https://github.com/new:
   * **Repository name**: `leerpaden`
   * kies **Public** en klik op **Create repository**.
2. Klik op **uploading an existing file**. Sleep **alles uit deze map** erin
   (`index.html`, `leerkracht.html`, `LEESMIJ.md` en de mappen `css`, `js`, `programmas`, `supabase`, `bron`).
   Klik op **Commit changes**.
3. **Settings → Pages**: kies bij *Branch* **main** / **(root)** en klik op **Save**.
4. Na ±1 minuut staat alles online:
   * Leerlingen: https://gerardwalschap.github.io/leerpaden/
   * Leerkracht: https://gerardwalschap.github.io/leerpaden/leerkracht.html

Zolang `js/config.js` leeg is, draait de site in **demomodus** (alles blijft in je eigen browser;
leerling `demo` / `demo`, leerkracht `demo`). Handig om eerst rond te kijken.

## 3. Gebruik

**Leerlingen toevoegen** — op de leerkrachtpagina, tabblad *De reële getallen*, klik je op
**+ Nieuwe leerlingen**. Vul de klas in (bv. `7VJHOa`) en plak de namen, één per lijn
(`Voornaam Naam`, `Naam, Voornaam` of twee kolommen uit Excel). Doe dit per klas.
Download meteen de **inlogkaartjes (PDF)**: wachtwoorden zijn later niet meer te zien
(je kan ze wel opnieuw instellen).

**Eén account per leerling, voor alle leerpaden** — onder **👥 Alle leerlingen** zie je elk account
met een vinkje per leerpad. Vink aan om een leerling aan een leerpad te koppelen, uit om te
ontkoppelen. Ontkoppelen wist geen resultaten. Je kan ook een hele klas selecteren en in één
keer koppelen, of nieuwe wachtwoorden + kaartjes maken.

**Opvolgen** — per leerpad zie je de voortgang van elke leerling (filter op klas of zoek op naam).
Bij *Nu bezig met* zie je hoeveel keer een leerling de test van dat deel al niet haalde.

* **Niet geslaagd = automatisch opnieuw open**: de leerling kan de test meteen opnieuw maken,
  met nieuwe vragen. Elke poging blijft bewaard (en telt mee in de puntenlijst). Bij de leerling
  zie je hoeveel er sinds de vorige test geoefend werd.
* **Lopende test laten vallen**: heeft een leerling per ongeluk een test gestart, dan kan je die
  wissen; dat telt dan niet als poging.
* **Deel vrijgeven zonder test**: om een leerling bv. meteen in deel 5 te laten starten.
* **Slaagdrempel**: standaard 80%, per leerpad aan te passen (link *wijzigen*).

**Rapporten** — per leerling een PDF (knop **Rapport**), of één PDF voor alle getoonde leerlingen
(bv. een hele klas), en een Excel-overzicht.

## 4. Het leerpad De reële getallen

10 delen, telkens theorie, uitgewerkte voorbeelden (stap voor stap), onbeperkt oefenen
(met meteen verbetering en uitleg) en een test van 10 vragen.

| deel | onderwerp | rekenmachine |
|---|---|---|
| 1 | De reële getallen (ℚ, ℝ \ ℚ, diagram, waar/niet waar) | ja |
| 2 | Bewerkingen in ℝ (derdemachtswortels, 5 decimalen, benaderen, wortel van een product) | ja |
| 3 | Bewerkingen in ℝ zonder rekenmachine (vereenvoudigen, vermenigvuldigen, optellen, noemer wortelvrij) | nee |
| 4 | Intervallen en halfrechten (getallenas, ongelijkheden) | nee |
| 5 | Machten met rationale exponenten | ja |
| 6 | De logaritme | ja |
| 7 | Rekenregels met logaritmen | ja |
| 8 | De stelling van Pythagoras | ja |
| 9 | Vergelijkingen | — |
| 10 | Omvormen van formules (test: 3 basis + 9 uitdagend) | nee |

Testregels: 10 vragen met telkens nieuwe getallen, 80% nodig voor het volgende deel,
één poging (die telt vanaf de start: herladen of sluiten geeft dezelfde vragen terug),
oefenen kan onbeperkt en wordt geregistreerd.

## 4b. Het leerpad Eerstegraadsvergelijkingen (remediëring)

16 kleine stappen, elk maar een beetje moeilijker: x + a = b → x − a = b → a·x = b → kommagetallen →
a·x + b = c → negatieve getallen → x in beide leden → haakjes → minteken voor haakjes → noemers →
bijzondere gevallen (V = ∅ en V = ℝ) → eindtest. Leerlingen noteren altijd V = {…}; kommagetallen
juist afgerond op 2 decimalen (een exacte breuk wordt ook goedgekeurd). Het rapport per leerling begint
met een samenvatting (periode, aantal werkdagen, oefeningen, geslaagde stappen met datum): je bewijs
van remediëring.

## 4c. Het leerpad Merkwaardige producten en ontbinden (remediëring)

18 kleine stappen volgens de cursus *TWiskunde 4BW – 1. Tweedegraadsvergelijkingen*:

* **A · Merkwaardige producten** (1–7): (x + a)² → (ax + by)² → (a − b)² → mintekens → (a + b)(a − b) →
  derde macht van een som of verschil → werk uit en herleid (factor ervoor, twee producten).
* **B · Ontbinden in factoren** (8–14): gemeenschappelijke factor (getal, letters, veelterm) → groepering →
  verschil van twee kwadraten → volkomen kwadraat → product-som methode → volledig ontbinden (stappenplan).
* **C · De discriminantmethode** (15–17): D en het aantal oplossingen → oplossen met mooie oplossingen →
  alle gevallen (D = 0, D < 0, D geen kwadraat, eerst herleiden).
* **D · Eindtest** (18): alles door elkaar.

Leerlingen typen veeltermen zoals `x^2 + 6x + 9` of `3x(x - 4)`. De website werkt hun antwoord zelf uit
en kijkt het na; staat het juiste antwoord niet in de gevraagde vorm, dan krijgen ze een gerichte tip
(bv. *Neem gelijksoortige termen nog samen*, *Er kan nog een gemeenschappelijke factor buiten de haakjes*,
*Je kan nog verder ontbinden*). Oplossingen noteren ze als `V = {2 ; -1/3}` (volgorde vrij, breuk of
kommagetal afgerond op 2 decimalen) of met de knop V = ∅.

## 4d. Het leerpad Complexe getallen (5BCW, toegepaste wiskunde)

12 delen volgens de cursus en de werkbundel *TWiskunde 5BCW – 2. Complexe getallen*, slaagdrempel **70%**
(staat in het programmabestand: `drempel: 70`; wordt automatisch ingesteld zolang er nog niemand gekoppeld is).

* **A · Het complexe vlak** (1–3): i en a + bi, Re en Im · punten aflezen en kwadranten · modulus.
* **B · Bewerkingen in cartesische vorm** (4–6): optellen/aftrekken · vermenigvuldigen en toegevoegde · delen.
* **C · Goniometrische vorm** (7–8): cartesisch → goniometrisch (r en θ, kwadrant!) · goniometrisch → cartesisch.
* **D · Bewerkingen in goniometrische vorm** (9–10): vermenigvuldigen en delen · De Moivre.
* **E · Tweedegraadsvergelijkingen in ℂ** (11) en **F · Eindtest** (12).

Hoeken altijd in **graden** (geen radialen). Elke gelijkwaardige hoek is juist (−45° = 315°).
Leerlingen typen complexe getallen als `3 - 2i`, `-1/2 + i`, `2√2 + 2√2 i`; oplossingen als `3 + 2i ; 3 - 2i` of `3 ± 2i`.
Bij een bijzondere hoek wordt de exacte waarde gevraagd (met √); een afgerond antwoord geeft dan een tip.

## 4e. Het leerpad Tweedegraadsfuncties: transformaties en kenmerken (4BW, toegepaste wiskunde)

11 delen volgens de cursus en de werkbundel *TWiskunde 4BW – 3. Tweedegraadsfuncties uitdieping*, slaagdrempel **70%**.

* **A · Transformaties** (1–3): f(x) + k · f(x − h) · k·f(x), telkens ook voor x³, √x en 1/x en met grafieken.
* **B · De topvorm** (4–7): top aflezen en transformaties combineren · kwadraat afsplitsen (a = 1 en a ≠ 1) · voorschrift uit top + punt.
* **C · Kenmerken** (8–11): domein, bereik, nulwaarden · tekenverloop, stijgen/dalen, extremum · symmetrie · functieoverzicht.

Leerlingen typen voorschriften als `2(x - 1)^2 + 5`, `√(x - 3)` of `1/(x + 2)` (rekenkern `js/kern/functie.js`,
antwoordsoort `functie`). Een voorschrift wordt vergeleken op functiewaarden; met `vorm: 'topvorm'` moet het in de vorm a(x − h)² + k staan.

## 4f. Het leerpad Tweedegraadsongelijkheden (4BW, toegepaste wiskunde)

6 delen volgens de PowerPoint *PWP_Tweedegraadsongelijkheden* (werkwijze grafisch en algebraïsch) en de werkbundel, slaagdrempel **70%**, zonder vraagstukken.

* **A · Grafisch oplossen** (1–2): parabool met twee nulwaarden · geen of één nulwaarde.
* **B · Algebraïsch oplossen** (3–5): V aflezen uit het tekenschema · D > 0 · D = 0 en D < 0 (antwoord: D, nulwaarden en V).
* **C · Eindtest** (6).

Leerlingen typen V als `]-∞, 2[ ∪ ]3, +∞[`, `[-1, 3]`, `ℝ`, `∅`, `ℝ \ {3}` of `{3}` (rekenkern `js/kern/verzameling.js`,
antwoordsoort `verzameling`; komma of puntkomma tussen de grenzen, knoppen voor ∪, ∞, ℝ, ∅).

## 4g. Het leerpad Vectoren (4BW-MWW, basisvorming)

11 delen volgens de cursus en de PWP *Wiskunde 4BW_MWW – 4. Vectoren*, slaagdrempel **70%**. Leerlingen **tekenen zelf vectoren** in een rooster
(nieuwe antwoordsoort `vector`, rekenkern `js/kern/vector.js`): startpunt aanklikken, dan eindpunt. De website kijkt na op grootte, richting en zin
(aantal vakjes) en op het startpunt (vast punt, kop van een andere pijl of zelfde startpunt), met gerichte tips (*verkeerde zin*, *juiste richting maar niet de juiste grootte*, *teken b vanuit de kop van a*).

* **A · Wat is een vector?** (1–3): vakjes tellen, punt of vector, richting en zin · gelijke vectoren, nulvector, tegengestelde vector · natekenen.
* **B · Bewerkingen** (4–8): kop-staartmethode · parallellogrammethode en a + (−a) = 0 · k·a · verschil a − b · combinaties en het midden van een lijnstuk.
* **C · Verschuivingen en context** (9–10): beeld van een driehoek/vierhoek (het beeld verschijnt zodra alle pijlen staan) · verplaatsing, krachten, snelheid.
* **D · Eindtest** (11).

## 4h. Het leerpad Logica (4BW-MWW) — update november 2026

Deel 1 (herhaling 3e jaar) volgt nu de nieuwe cursus *1. Logica* (deel A): naast operatoren, waarde en waarheidstabellen ook
**vertalen naar symbolen**, **‘of’ en ‘als … dan …’ in de omgangstaal**, **nodige en voldoende voorwaarde**, **∀ en ∃** en **tegenvoorbeelden**.
Implicatie en equivalentie worden nu genoteerd als ⇒ en ⇔. De nummering van de delen is niet veranderd, dus bestaande resultaten blijven geldig.

## 4i. Het leerpad Rationale functies in context (5WW / 5BCW, wiskunde)

11 delen volgens de werkbundel *Rationale functies in context* (elk hoofdstuk 0–9 is een deel), slaagdrempel **70%**, telkens een test van **10 vragen**.
Alles is individueel werk: de duo- en groepsopdrachten uit de werkbundel en hoofdstuk 10 (poster in groep) zitten niet in het leerpad. Leerlingen gebruiken GeoGebra; bij elke rekenvraag staat op hoeveel decimalen ze afronden.

* **A · Kenmerken in context** (1–2): woordenlijst wiskundetaal ↔ contexttaal · aflezen en interpreteren (functiewaarde, snijden met y = c, asymptoot, maximum, nulwaarde, gemiddelde verandering).
* **B · Domein en kritisch kijken** (3–4): wiskundig en praktisch domein, losse punten, bereik, rol van de verticale asymptoot · waar breekt het model, interpoleren/extrapoleren, twee modellen.
* **C · Grafiek en situatie** (5–8): grafiek ↔ situatie koppelen · verhaal → grafiek, asymptoot, domein, voorschrift · kenmerken → schets (teken- en verloopschema, limieten, "kan dit?") · een grafiek vertellen.
* **D · Fouten en modellen** (9–10): foutenanalyse (juist/fout, welke zin is fout, verbeter) · parameters met betekenis (k + a/(t + 10), p + v/n, a·w/(w + b), a·t/(t² + b)).
* **E · Eindtest** (11): uit elk hoofdstuk één vraag.

Alle situaties (pijnstiller, daguitstap, flessenwarmer, werkplaats, wachttijd, zomerkamp, ziekenwagen, warmtepomp …) krijgen telkens nieuwe getallen.
Open opdrachten uit de werkbundel (schetsen tekenen, verhalen schrijven) zijn omgezet naar meerkeuzevragen: de juiste grafiek, het juiste verslag of de juiste zin kiezen.
Nieuw in de kern: een meerkeuzevraag met `lijst: true` toont de keuzes als zinnen onder elkaar (`js/kern/antwoord.js`, `css/stijl.css`).

## 4j. Het leerpad Tweedegraadsfuncties in contexten (4BW-MWW, wiskunde)

8 delen, slaagdrempel **70%**, telkens een test van **10 vragen**. Een mengeling van de werkbundels *3. Tweedegraadsfuncties – contexten in de basis* (± 75 % van de vragen)
en *3. Tweedegraadsfuncties – contexten* (± 25 %). Enkel individueel werk; rekenmachine toegelaten.

* **A · Dalparabolen in context** (1–3): halfpipe en hangbrug (aflezen, symmetrie, top, domein/bereik, steilheid) · terras $T(n) = n^2$ en vierkant $A(z) = z^2$, rechthoek $2b^2$ · remweg $0{,}01v^2$, droog/nat, fietser.
* **B · Bergparabolen in context** (4–5): vrijevaltoren $-5t^2$ en vallende steen $4{,}9t^2$ · de boog van een poort (past het busje?).
* **C · Vergelijken en redeneren** (6–7): situatie ↔ voorschrift ↔ grafiek (berg/dal, breed/smal) · wie heeft gelijk? (juist/fout, verbeter).
* **D · Eindtest** (8).

## 4k. Het leerpad Telproblemen en kansrekenen (7VJHO, wiskunde)

12 delen volgens de PWP's en werkbladen *3.1.1 Telproblemen* en *3.1.2 Kansen bepalen*, slaagdrempel **70%**, telkens een test van **10 vragen**.
De oefeningen zijn andere situaties dan in de werkbladen (die blijven de klasoefening). Rekenmachine toegelaten.

* **A · Telproblemen** (1–6): boomdiagrammen · productregel · somregel (en EN/OF samen) · tellen met een venndiagram (2 en 3 verzamelingen) · complementregel · welke regel? (alles door elkaar).
* **B · Kansen bepalen** (7–11): kansexperiment, U, gebeurtenis, complement en kansschaal · relatieve frequentie en kans · wet van Laplace (kaartjes, knikkers, kaartspel, rad, ongelijke vakken, venndiagram) · twee dobbelstenen · kansbomen (met en zonder terugleggen, kansen in procent).
* **C · Eindtest** (12).

Afspraken (staan ook in de intro): een kans als **vereenvoudigde breuk** met de echte breuk in de formule-editor; een percentage enkel als het gevraagd wordt; een relatieve frequentie op **3 decimalen**.
Boomdiagrammen, kansbomen, venndiagrammen, wegenkaarten en raden worden door de website zelf getekend (met telkens nieuwe getallen).

In de catalogus is hoofdstuk 3 van 7VJHO opgesplitst: **3. Telproblemen en kansrekenen** (dit leerpad) en **4. Statistiek** (nog te maken).

> Let op met `bron/bouw.sh`: de bronbestanden van *complexe-getallen*, *functieleer*, *getallenleer-nzq* en *merkwaardige-producten-ontbinden*
> zijn niet meer gelijk aan hun programmabestand (die programma's werden rechtstreeks aangepast). Het script voegt alle mappen opnieuw samen
> en zou die vier dus terugzetten naar een oudere versie. Upload daarom enkel `programmas/telproblemen-kansen.js` (dat is al samengevoegd).

## 4m. Het leerpad Statistiek (7VJHO, wiskunde)

9 delen volgens de cursus *3.2 Statistiek* en de PWP's en werkbladen van de drie submappen, slaagdrempel **70%**, telkens een test van **10 vragen**.
De oefeningen zijn andere situaties en andere getallen dan in de werkbladen. Formules typen de leerlingen in het rekenblad in het leerpad (zie 4n); Excel is niet nodig.

* **A · Steekproeven** (3.2.1, delen 1–3): populatie en steekproef · een goede steekproef (aselect, groot genoeg, non-respons) · besluiten over de populatie.
* **B · Gegevens verwerken** (3.2.2, delen 4–5): frequentietabel en histogram (absolute en relatieve frequentie, klassen) · gemiddelde en standaardafwijking (Excel: GEMIDDELDE, STDEV.S; wat zegt s?).
* **C · De normale verdeling** (3.2.3, delen 6–8): de normale kromme (top, buigpunten, x̄ en s veranderen, past het model?) · de 68-95-99,7-regel · kansen met het rekenblad (NORM.VERD.N).
* **D · Eindtest** (9).

Procenten, gemiddelden en standaardafwijkingen op 1 decimaal; procenten in de uitleg altijd met een verhoudingstabel.
Histogrammen, stippendiagrammen en normale krommen tekent de website zelf. Bij Excelvragen worden enkel grenzen gekozen waarbij
afronden op 3 decimalen (zoals in de cursus: 0,903 − 0,080) en exact rekenen hetzelfde percentage op 0,1 % geven.

## 4r. Het leerpad Machtswortelfuncties (5WW / 5BCW, wiskunde) — november 2026

6 delen volgens de cursus en de PWP *4. Machtswortelfuncties*, slaagdrempel **70%**, telkens een test van **10 vragen**, zonder rekenmachine.
Eén leerpad voor 5BCW en 5WW samen (basisvorming, enkel de leerstof van de cursus). Alles is af te leiden uit de PWP: na elk stuk theorie staat daar een dia die naar het juiste deel verwijst.

* **A · Wat is een machtswortelfunctie?** (1): even of oneven aan het voorschrift · machtswortels berekenen (let op het teken, bestaat niet in ℝ).
* **B · Even en oneven** (2–3): domein, bereik (uit het voorschrift of de grafiek), gedrag op oneindig, geen horizontale asymptoot, nulwaarde · even of oneven aan de grafiek.
* **C · Vergelijken en toepassen** (4–5): domein zonder grafiek, negatief getal invullen?, kenmerken, verschil met rationale functies · in de zorg en welzijn: grafiek aflezen (ontwikkelingsscore, logopedie, revalidatie, zelfstandig eten), "evenredig met de vierkantswortel" (2×, 4×, 9×), welk model past, waarom niet oneven.
* **D · Eindtest** (6).

Domein en bereik typen de leerlingen als `[0, +∞[` of `ℝ` (antwoordsoort `verzameling`). Bron: `bron/machtswortelfuncties/`, bouwen met `sh bron/bouw.sh machtswortelfuncties`.

## 4s. Het leerpad Veeltermfuncties in context (5WW / 5BCW, wiskunde) — november 2026

11 delen volgens de werkbundel *Veeltermfuncties in context* (elk hoofdstuk 0–9 is een deel, plus een eindtest), slaagdrempel **70%**, telkens een test van **10 vragen**.
Gebouwd zoals het leerpad *Rationale functies in context*: **geen GeoGebra nodig**. Bij elke rekenvraag staat een grafiekvenster met de formule al ingevuld
(bewegen over de grafiek, Bereken, Snijpunt, Hoogste en laagste punt, in- en uitzoomen; praktisch domein in blauw). Moeilijke woorden krijgen een uitleg (oranje stippellijn).
Enkel individueel werk: de duo- en groepsopdrachten en hoofdstuk 10 (poster) zitten er niet in.

* **A · Kenmerken in context** (1–2): woordenlijst (griepgolf) · aflezen en interpreteren: pijnstiller, spoeddienst (twee toppen, lokaal ≠ absoluut), baby, hartslag, budget jeugdbeweging (in het rood, absoluut maximum aan de rand).
* **B · Domein en kritisch kijken** (3–4): wiskundig domein ℝ en praktisch domein (fontein, doos, benefietfuif, bacteriën, zwembad), bereik en maximum op het praktisch domein · extrapoleren (baby na 60 dagen, inwoners), twee modellen voor de 65-plussers.
* **C · Grafiek en situatie** (5–8): koppelen (ook gsm-batterij en constante temperatuur) · verhaal → grafiek, maximum/domein, voorschrift (opendeurdag) · tekenschema, minimale graad, nulpunten uit het verloopschema, snijden of raken, "kan dit?" · een grafiek vertellen.
* **D · Fouten en modellen** (9–10): Ruben, Amina, Lotte, Jonas en Sem · modellen op maat: a·t·(t − b)², a·x·(x − b), a(d − p)² + q.
* **E · Eindtest** (11): uit elk hoofdstuk één vraag.

Bron: `bron/veeltermfuncties-context/` (het grafiekvenster is overgenomen uit rationale-functies-context), bouwen met `sh bron/bouw.sh veeltermfuncties-context`.

## 4t. Het leerpad Sinusfunctie (5WW / 5BCW, wiskunde) — november 2026

8 delen volgens de cursus en de PWP *5. Sinusfunctie*, slaagdrempel **70%**, telkens een test van **10 vragen**.
Radialen typen de leerlingen als het getal vóór π (antwoordsoort `breuk` met `na: '\\cdot \\pi'`, in de formule-editor: 3/4 voor 3π/4).
Geen GeoGebra: bij de vergelijkingen staat een grafiekvenster met π op de x-as (eigen klasse `.gvs` met eigen luisteraars, zodat het niet botst met het grafiekvenster van de contexten-leerpaden); in het venster mag je `3π/2` of `3pi/2` typen.

* **A** (1–2): graden ↔ radialen, veelgebruikte hoeken, omwentelingen · sinuswaarden, basiskenmerken, nulwaarden/toppen/dalen, "kan sin x = c?".
* **B** (3–4): wat doen a, b, k, p · voorschrift → grafiek · amplitude, evenwichtslijn, bereik, periode, faseverschuiving uit voorschrift en grafiek.
* **C** (5–7): vergelijkingen grafisch oplossen in [0, 2π] (oplossingen, aantal, waarom geen) · beperkt interval (bereik, max/min, nulwaarden) · zorg en welzijn (bioritme, bloeddruk, hartslag baby, slaapcycli, ademhaling).
* **D** (8): eindtest.

Bron: `bron/sinusfunctie/0-alles.js`, bouwen met `sh bron/bouw.sh sinusfunctie`.

## 4u. Het leerpad Afgeleiden (5WW / 5BCW, wiskunde) — november 2026

6 delen volgens de cursus en de PWP *6. Afgeleiden*, slaagdrempel **70%**, telkens een test van **10 vragen**.
Alles grafisch en conceptueel: nergens worden afgeleiden met rekenregels berekend. Geen GeoGebra; grafieken met raaklijnen, secansen en roosterpunten worden als SVG getekend (`agraf`).

* **A** (1–2): differentiequotiënt uit twee punten, op een grafiek en in een situatie (eenheden), interpretatie, waar/niet waar · de afgeleide als limiet (tabellen die naderen), begrippen, gemiddeld of ogenblikkelijk.
* **B** (3–4): teken van f '(a) uit de raaklijn, rico van een raaklijn aflezen via roosterpunten, in welk punt, wat zegt f '(a) · van f naar het tekenschema van f ', van de grafiek van f ' naar het verloop van f, extremum uit f ', welke f / welke f ' past.
* **C** (5): zorg en welzijn (koorts, concentratie van een medicijn, mindfulnesssessie): gemiddelde verandering, wanneer is de afgeleide 0, teken, betekenis, eenheid.
* **D** (6): eindtest.

Bron: `bron/afgeleiden/0-alles.js`, bouwen met `sh bron/bouw.sh afgeleiden`.

## 4n. Het rekenblad (een klein "Excel" in het leerpad) — november 2026

Nieuwe antwoordsoort `rekenblad` (rekenkern `js/kern/rekenblad.js`, opmaak in `css/platform.css`). Gegevens staan in kolom A (A1 = titel),
in kolom C typt de leerling formules zoals in Excel. De website rekent ze uit (de uitkomst verschijnt meteen onder de cel) en kijkt de formule na,
met gerichte tips (verkeerd bereik, STDEV.P in plaats van STDEV.S, 1 − vergeten bij "meer dan", gemiddelde en s omgewisseld, ONWAAR i.p.v. WAAR, komma i.p.v. puntkomma …).

* Functies: GEMIDDELDE, STDEV.S, NORM.VERD.N, SOM, AANTAL, MIN, MAX, WORTEL, AFRONDEN (ook de Engelse namen AVERAGE, NORM.DIST, SUM, … met komma's en decimale punten), WAAR/ONWAAR, + − · / ^ en haakjes. Een cel mag naar een andere cel verwijzen (bv. `=NORM.VERD.N(140; C2; C3; WAAR)`).
* Met `histogram: true` staat onder het rekenblad een knop **Maak histogram** (begin en klassenbreedte invullen).
* Zonder `rijen` is het rekenblad enkel een hulpmiddel (wordt niet nagekeken). In het testverslag staan de formules van de leerling.
* Gebruikt in het leerpad Statistiek: deel 4 (histogram met het rekenblad), deel 5 (standaardafwijking, x̄ en s van een grote reeks), deel 8 (kansen met NORM.VERD.N en de nieuwe oefening *Van gegevens naar model*, zoals werkbladoefening 8).

## 4l. Formule-editor in donkere modus (november 2026)

Stond de computer van een leerling in donkere modus, dan werd het vakje van een breuk (of ander deel van de formule) waarin je typt donkergrijs,
zodat je de cijfers niet meer zag. De formule-editor blijft nu altijd in lichte kleuren (`css/platform.css`): dat geldt meteen voor alle leerpaden.

## 4p. De instaptoets getallenleer (7VJHO) — november 2026

**Eenmalig nodig:** voer `supabase/update-instaptoets.sql` uit (Supabase → SQL Editor → New query → plakken → **Run**).
Er gaat niets verloren en de gewone leerpaden werken zoals voordien.

De instaptoets staat bij **7VJHO › Wiskunde** als eerste rij (★ *Instaptoets*), vóór hoofdstuk 1.
Bedoeld voor de eerste schooldag: het niveau van elke leerling bepalen in getallenleer.

* **Geen theorie, geen oefenen**: de leerling komt meteen bij de toets.
* **40 vragen, zonder rekenmachine**, ongeveer 50 à 60 minuten (de leerlingen krijgen twee lesuren).
* **Deel A · Basis**: 24 vragen (6 per getallenverzameling) = 60 punten.
  **Deel B · Uitdagend**: 16 vragen (4 per getallenverzameling) = 40 punten.
  Elke vraag telt even zwaar (2,5 punten op 100); per getallenverzameling (ℕ, ℤ, ℚ, ℝ) 25 punten.
* **Niveau**: minder dan 70/100 = **Beginner**, 70/100 of meer = **Gevorderd**.
  Met enkel het basisdeel (max. 60) is een leerling dus nooit gevorderd: er moet ook uitdagend werk juist zijn.
* **Eén poging.** Sluit een leerling per ongeluk de pagina, dan kan hij verdergaan (zelfde vragen, antwoorden bewaard).
  Liep er iets mis? Klik op de leerling → **Nieuwe poging geven**. Een gestarte maar niet ingediende toets kan je
  ook laten vallen (telt dan niet).
* **De vragen** komen uit de leerpaden Rekenen in ℕ, ℤ, ℚ en De reële getallen (zelfde notaties, afspraken en verbetering:
  bv. procenten met een verhoudingstabel). Elke leerling krijgt andere getallen.
* **Na het indienen** ziet de leerling zijn score op 100, zijn niveau, een tabel per getallenverzameling en de verbetering (ook als PDF).
* **Resultatenoverzicht** (leerkrachtpagina, instaptoets openen): per leerling score, niveau, punten per getallenverzameling,
  basis en uitdagend; filter per klas, sorteer op score; download als **Excel** of **PDF**; per leerling de verbetering (PDF).
  De instaptoets staat niet in het afdrukcentrum (telt niet voor Skore).
* **Doorschakelen gebeurt niet automatisch**: je koppelt de leerlingen zelf aan het juiste leerpad
  (later bv. *Natuurlijke getallen* of *Natuurlijke getallen +*).

Inhoud (vraag per vraag):

| | ℕ | ℤ | ℚ | ℝ |
|---|---|---|---|---|
| **Basis** | volgorde · volgorde met wortels · eentermen vereenvoudigen · getalwaarde · vergelijken · x% van een getal | optellen · aftrekken · vermenigvuldigen/delen · (−a)ⁿ · vierkantswortels · getalwaarde | afronden · breuk vereenvoudigen · percentage → breuk · breuk op de getallenas · breuken optellen/aftrekken · breuken vermenigvuldigen | ℚ of ℝ\ℚ · derdemachtswortel · wortel vereenvoudigen · wortels optellen · ongelijkheid → interval · logaritme |
| **Uitdagend** | volgorde met logaritmen · vraagstuk procenten · recht of omgekeerd evenredig · omgekeerde evenredigheid | volgorde in ℤ · −aⁿ · rekenregels machten · uitwerken en vereenvoudigen | breuken delen · negatieve exponent · volgorde in ℚ · repeterend → breuk | eerst vereenvoudigen, dan optellen · noemer wortelvrij · wortel → rationale exponent · vergelijking met haakjes |

De samenstelling, de grens van 70 en de teksten voor de leerling staan in `bron/instaptoets-7vjho/0-basis.js`.
Na een aanpassing: `sh bron/bouw.sh instaptoets-7vjho` (bouwt enkel dit programma).

> Ook nieuw: dubbele knoppen op het toetsenbord onder een test (bv. twee keer `( )`) worden nu weggelaten,
> in alle leerpaden.

## Inlogbrieven

Na het aanmaken van accounts (of nieuwe wachtwoorden) krijg je per leerling **één A4** met de inloggegevens én de handleiding.
* **Inlogbrieven (PDF)**: om enkelzijdig af te drukken.
* **Inlogbrieven voor recto-verso (PDF)**: na elke brief een lege bladzijde, zodat elke leerling een eigen blad heeft.
Bij één leerling (knop *Nieuw wachtwoord*) kan je meteen zijn inlogbrief downloaden.

## 5. Later: een nieuw leerpad toevoegen

Een leerpad is één bestand in `programmas/` (bv. `programmas/machten-wortels.js`) plus één regel
in `index.html` en `leerkracht.html`:

```html
<script src="programmas/machten-wortels.js?v=1"></script>
```

Zodra je je als leerkracht aanmeldt, maakt de website het nieuwe leerpad zelf aan in de databank.
Je hoeft in Supabase niets te doen. De leerlingen kies je dan bij **Alle leerlingen**.

De bronbestanden van een leerpad staan in `bron/<naam>/`; `bron/bouw.sh` voegt ze samen tot
`programmas/<naam>.js`.

## 6. Na een aanpassing

Upload de gewijzigde bestanden opnieuw naar dezelfde repo. Zie je de wijziging niet meteen,
herlaad dan de pagina met **Ctrl + F5** (Mac: **Cmd + Shift + R**).
`supabase/schema.sql` mag je later gerust opnieuw uitvoeren: bestaande gegevens blijven bewaard.

## 7. Het platform: klas → vak → hoofdstuk (nieuw, november 2026)

De structuur van het platform staat in **`js/catalogus.js`**: de klassen (4BW, 4MWW, 5BCW, 5WW, 7VJHO),
hun vakken (= de wiskundemappen in OneDrive › Vakken) en per vak de hoofdstukken.
Een leerpad hoort bij een hoofdstuk via `leerpaden: ['code-van-het-leerpad']`.

* **Leerkracht:** *🏫 Klassen en leerpaden* → klas → vak → alle hoofdstukken. Hoofdstukken zonder
  leerpad staan op *Nog te maken* (enkel voor jou zichtbaar). Per leerpad zie je hoeveel leerlingen van
  die klas gekoppeld zijn, met een knop **Hele klas koppelen**. Remediëring: koppel enkel wie het nodig heeft.
* **Leerling:** ziet enkel de leerpaden waaraan hij gekoppeld is, gegroepeerd per vak. Met maar één
  leerpad opent dat meteen (zoals vroeger); links met `?p=…` blijven werken.
* Een leerling hoort bij een klas als zijn klasnaam ermee begint (7VJHOa → 7VJHO).
* **De databank verandert niet.** Alles werkt met de bestaande koppelingen.

**Online sinds november 2026** op de gewone links (leerlingen: …/leerpaden/, leerkracht: …/leerpaden/leerkracht.html).
De map `test/` mag blijven staan: daar kan je later een nieuwe versie eerst uitproberen.

### 4o. Functieleer: breuken als antwoord (nov 2026)
- Toenamegetal a, nulwaarde en "a aflezen" kunnen een breuk zijn (bv. −1/3). Die vragen krijgen nu de formule-editor en het juiste antwoord wordt als breuk getoond i.p.v. −0,333333.
- Aangepast rechtstreeks in `programmas/functieleer.js` (de bron-map van functieleer is verouderd: niet herbouwen met bouw.sh).

### 4p. Functieleer: nieuw deel 8 "Vergelijkingen en ongelijkheden grafisch oplossen" (nov 2026)
- Dekt BV3_06.07. Soorten: vergelijking f(x) = c, ongelijkheid f(x) < c, twee rechten f(x) = g(x) en f(x) > g(x); antwoord als V = {…} of halfrechte (verzameling).
- De oude delen 8, 9 en 10 zijn nu 9, 10 en 11 (eindtest). De eindtest bevat één ongelijkheid uit deel 8 (in plaats van functiewaarde berekenen).
- Hoort bij PWP 2.8 en Werkbundel 2.8 in OneDrive (mappen 2.8 → 2.11 hernummerd).

### 4q. Bugfixes na het uitproberen (21 nov 2026)
- **∞ in opgeslagen tests**: gewone JSON maakt van ±Infinity `null`. Daardoor verloren testvragen met een halfrechte of ℝ als antwoord hun juiste antwoord (bv. "dom f = ∅" i.p.v. ℝ) en werd een juist antwoord fout gerekend. Nieuw: `JSONX` (in api.js) bewaart ∞ als tekstmarkering; gebruikt voor de databank, de demo-opslag en de sessie-opslag. Geldt voor alle leerpaden. Tests die al vóór deze update gestart waren, blijven foutief.
- **Formule boven een figuur**: had een vraag zowel een figuur (html) als een formule (tex), dan werd de formule niet getoond (bv. "Welke rechte hoort bij het voorschrift?"). Nieuw: `W.opgave(v)` in hulp.js toont de formule boven de figuur. Ook in stelsels (D2, D8) en tweedegraadsfuncties-ax2 (D3, D9).
- Functieleer: "Zoek a" (deel 5) geeft een breuk i.p.v. −0,6666…; uitleg bij "eerstegraadsfunctie of niet?" (deel 7) wijst de plaats aan waar Δy/Δx verandert; minder horizontale rechten bij domein en bereik.
- test/js/leerling.js en test/js/leerkracht.js zijn opnieuw gelijkgezet met js/kern/.

## Menu voor leerlingen (js/menu.js)

Na het aanmelden ziet een 7VJHO-leerling grote tegels: **1. Instaptoets · 2. Getallenleer · 3. Functieleer ·
4. Telproblemen en kansrekenen · 5. Statistiek**. Een tegel opent knoppen (bv. Rekenen in ℕ, ℕ +, ℤ, …, ★ Proeftoets),
en achter een knop staat het leerpad (of één groep ervan, bv. *Eerstegraadsfuncties*) met de spellen die erbij horen.
De instaptoets start meteen. Een leerling ziet enkel tegels en knoppen waaraan je hem gekoppeld hebt.

* Indeling aanpassen of een spel bij een onderwerp zetten: enkel `js/menu.js` (uitleg bovenaan dat bestand).
* Actief op de echte site en in `test/`.

## Pi's Getallenavontuur (spellen/galaxie) — grote getallenleer-game (nov 2026)
- Verhaal: robotje Pi zoekt de vier stukken van het Getallenkristal. Enkel naam typen en spelen; voortgang (wereld, levens, munten, score) blijft bewaard.
- Werelden: `w1-platform.js` (ℕ, platformspel: tegen het juiste blok springen), `w2-race.js` (ℤ, pseudo-3D race: door de juiste poort), `w3-puzzel.js` (ℚ, duwpuzzel: juiste blok op het slot, iets moeilijkere vragen), `w4-doolhof.js` (ℝ, 3D-doolhof/raycaster: juiste robot neerschieten), `w5-ruimte.js` (finale: asteroïden + moederschip met tussenstappen).
- `kern.js`: invoer, geluid, levens (start 5; extra leven met hartjes en per 50 munten; game over = wereld opnieuw), vragen uit de gewone leerpaden (`BRON`: per wereld makkelijke soorten), HUD, verhaalschermen. Geen uitleg bij een fout (ontspanning): −1 leven, het foute antwoord verdwijnt.
- Menu: knop 🤖 onderaan Getallenleer; databank: programma `spel-galaxie`.
