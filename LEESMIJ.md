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
Bovenaan staat wie wacht op het heropenen van een test.

* **Test opnieuw openzetten**: klik op de leerling en dan op de knop bij het deel.
  Je ziet er ook hoeveel de leerling sinds de vorige test geoefend heeft.
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
| 10 | Omvormen van formules | ja |

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
