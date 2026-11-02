# Revly-site (getrevly.nl, Astro + Keystatic)

## Starten op je MacBook
1. Open Terminal in deze map.
2. `npm install` (eenmalig, duurt een paar minuten)
3. `npm run dev`
4. Open in je browser:
   - http://127.0.0.1:4321 voor de site
   - http://127.0.0.1:4321/keystatic voor het beheer (blogs, vragen, prijzen, redirects)
   - http://127.0.0.1:4321/admin/ voor de verbruiksdata (voorbeelddata)

Stoppen: Ctrl + C in Terminal.

## Waar staat wat
- Blogberichten: `src/content/blog/` (Keystatic schrijft hier)
- Veelgestelde vragen: `src/content/vragen/`
- Prijzen, App Store-link, KvK: `src/data/site.json` (in Keystatic: Algemene gegevens)
- Redirects: `src/data/redirects.json` (wordt bij het bouwen `_redirects` voor Cloudflare)
- Verbruiksdata: `src/data/verbruik.json` is VOORBEELDDATA. Later komt dit uit D1 (revly-insights).
- Privacy en support: `src/legacy/` (overgenomen van de huidige revly-site)
- Opmaak: `src/styles/global.css`

## Nog te doen voor livegang
- Keystatic op `storage: { kind: 'github' }` zetten en de Cloudflare-adapter toevoegen, zodat beheer ook op getrevly.nl/keystatic werkt.
- Echte verbruiksdata uit D1 koppelen, en de admin achter Cloudflare Access zetten.
- Toestemmingstekst in de app aanpassen voordat verbruikscijfers openbaar worden.
- Echte schermafdrukken, App Store-link, KvK-nummer en adres invullen.

## Live zetten
Cloudflare Pages bouwt deze repo automatisch. Instellingen: build command `npm run build`, output directory `dist`, Node 22 (staat in `.node-version`). Iedere branch krijgt een previewlink, `main` is de live site.
