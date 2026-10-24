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
