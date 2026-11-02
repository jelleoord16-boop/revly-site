# Werken aan de Revly-website (getrevly.nl)

Dit is de marketingsite van de Revly-app, gebouwd met Astro en Keystatic. Hij draait als statische site op Cloudflare Pages. Nieuwere expliciete instructies van Jelle gaan voor.

## Samenwerken

- Communiceer in standaard Nederlands, direct en praktisch. Jelle is geen ervaren ontwikkelaar: leg stappen uit in gewone taal.
- Begin met `git status` en bekijk bestaande wijzigingen. Overschrijf geen werk dat niet bij je opdracht hoort.
- Commit en push alleen met autorisatie van Jelle voor die opdracht. Toestemming voor een eerdere push geldt niet voor latere.
- Gebruik `codex/` voor branches van Codex en `claude/` voor Claude Code. Iedere push naar een branch geeft op Cloudflare Pages een previewlink; `main` is de live site.
- Publiceer geen secrets, API-sleutels of persoonlijke gegevens.
- Eén schrijver tegelijk in deze map. Gelijktijdig werken kan alleen in een aparte worktree met eigen branch.

## Copy en SEO

- Je-vorm, korte zinnen, sentence case.
- Gebruik nooit een gedachtestreepje (—) in teksten.
- Gebruik nooit het woord "gids" in titels of metabeschrijvingen.
- SEO-titel maximaal 60 tekens, metabeschrijving maximaal 160 tekens.
- Productclaims moeten kloppen met de app. Controleer gedrag in `revly-ios` (bijvoorbeeld: de APK-melding komt twee maanden en twee weken voor de vervaldatum).
- Verbruikscijfers van Revly-gebruikers alleen tonen boven de drempel in `src/data/verbruik.json` (minstens 10 deelnemers, 20 deelnemer-maanden, 10.000 km, één deelnemer maximaal 25%). Onder de drempel: geen cijfer en `noindex`.

## Ontwerp

- Kleuren komen uit de app. Pas ze aan in `src/styles/global.css`, niet per pagina:
  - merkblauw #3B85FD naar #0F49E5 (app-icoon), accent #007AFF (donker #0A84FF), links #0065D3;
  - garagekaart #1C2438 naar #0A0D14, kentekengeel #F7C700, EU-blauw #003399;
  - achtergrond #F2F2F7 met kaarten #FFFFFF, donker #000 met #1C1C1E;
  - koppen in SF Pro Rounded (`ui-rounded`).
- Eén bewegingsmoment per pagina, en respecteer `prefers-reduced-motion`.
- Houd WCAG 2.1 AA aan (contrast, kopvolgorde, focus). Lighthouse staat op 100 voor publieke pagina's: houd dat zo.
- Doelen: LCP onder 2,5 s, INP onder 200 ms, CLS onder 0,1.
- Maak de kleinste complete wijziging. Geen nieuwe libraries zonder reden.

## Waar staat wat

- Pagina's: `src/pages/`. De layout met topbar, footer en tabbar staat in `src/layouts/Base.astro`.
- Blog: `src/content/blog/*.mdoc`. Keystatic schrijft hier. Het blok `{% verbruik model="..." /%}` toont verbruikscijfers.
- Veelgestelde vragen: `src/content/vragen/`.
- Prijzen, App Store-link, KvK: `src/data/site.json`.
- Redirects: `src/data/redirects.json`. Bij het bouwen wordt dit `dist/_redirects`.
- Verbruiksdata: `src/data/verbruik.json` is VOORBEELDDATA. Later komt dit uit Cloudflare D1 (revly-insights).
- Privacy en support: `src/legacy/`, overgenomen van de oude site. Moet een privacywijziging in de app hier terechtkomen, pas dan beide talen aan en de datum bovenaan.
- De kentekencheck (`src/pages/check.astro`) haalt gegevens rechtstreeks uit RDW Open Data in de browser. Bouw DOM met `textContent`, nooit `innerHTML` met RDW-data. Of RDW dit vanuit de browser toestaat (CORS), is nog niet getest op de live site; anders komt er een Cloudflare Worker tussen.

## Controleren

```sh
npm install
npm run build      # moet zonder fouten bouwen
npm run dev        # site op http://127.0.0.1:4321, beheer op /keystatic
```

- Bekijk gewijzigde pagina's op desktop en mobiel, in licht en donker.
- Rapporteer apart wat je hebt gebouwd, bekeken en getest.
