import { config, fields, collection, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';
import verbruik from './src/data/verbruik.json';

const modelOpties = verbruik.modellen.map((m) => ({
  label: `${m.merk} ${m.model} (${m.brandstof.toLowerCase()})`,
  value: m.id,
}));

export default config({
  // Lokaal: teksten worden in deze map opgeslagen.
  // Live: vervang door { kind: 'github', repo: 'jelleoord16-boop/revly-site' }
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'Revly' },
    navigation: {
      Inhoud: ['blog', 'vragen'],
      Instellingen: ['site', 'redirects'],
    },
  },

  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'titel',
      path: 'src/content/blog/*',
      format: { contentField: 'inhoud' },
      entryLayout: 'content',
      columns: ['titel', 'status', 'datum'],
      schema: {
        titel: fields.slug({
          name: { label: 'Titel', validation: { isRequired: true } },
          slug: { label: 'URL', description: 'Komt achter getrevly.nl/blog/' },
        }),
        status: fields.select({
          label: 'Status',
          description: 'Een concept staat niet op de site.',
          options: [
            { label: 'Concept', value: 'concept' },
            { label: 'Gepubliceerd', value: 'gepubliceerd' },
          ],
          defaultValue: 'concept',
        }),
        datum: fields.date({ label: 'Publicatiedatum', defaultValue: { kind: 'today' } }),
        bijgewerkt: fields.date({ label: 'Laatst bijgewerkt (optioneel)' }),
        taal: fields.select({
          label: 'Taal',
          options: [
            { label: 'Nederlands', value: 'nl' },
            { label: 'Engels', value: 'en' },
          ],
          defaultValue: 'nl',
        }),
        samenvatting: fields.text({
          label: 'Samenvatting',
          description: 'Staat in het blogoverzicht onder de titel.',
          multiline: true,
        }),
        seo: fields.object(
          {
            titel: fields.text({
              label: 'SEO-titel',
              description: 'Leeg laten = de titel van het bericht. Maximaal 60 tekens.',
              validation: { length: { max: 60 } },
            }),
            beschrijving: fields.text({
              label: 'Metabeschrijving',
              description: 'Maximaal 160 tekens.',
              multiline: true,
              validation: { length: { max: 160 } },
            }),
            afbeelding: fields.image({
              label: 'Deelafbeelding',
              description: 'Voor WhatsApp, LinkedIn en Facebook. 1200 x 630 pixels.',
              directory: 'public/images/blog',
              publicPath: '/images/blog/',
            }),
            canonical: fields.text({
              label: 'Canonical (optioneel)',
              description: 'Alleen invullen als dit bericht een kopie is van een andere pagina.',
            }),
            noindex: fields.checkbox({ label: 'Niet indexeren', defaultValue: false }),
          },
          { label: 'SEO' }
        ),
        inhoud: fields.markdoc({
          label: 'Inhoud',
          extension: 'mdoc',
          options: {
            image: { directory: 'public/images/blog', publicPath: '/images/blog/' },
          },
          components: {
            verbruik: block({
              label: 'Revly-verbruiksdata',
              description: 'Toont het gemeten verbruik van Revly-rijders naast de fabriekswaarde.',
              schema: {
                model: fields.select({
                  label: 'Model',
                  options: modelOpties,
                  defaultValue: modelOpties[0].value,
                }),
              },
            }),
          },
        }),
      },
    }),

    vragen: collection({
      label: 'Veelgestelde vragen',
      slugField: 'vraag',
      path: 'src/content/vragen/*',
      columns: ['vraag', 'onderwerp'],
      schema: {
        vraag: fields.slug({ name: { label: 'Vraag' } }),
        onderwerp: fields.select({
          label: 'Onderwerp',
          options: [
            { label: 'Algemeen', value: 'algemeen' },
            { label: 'Ritten', value: 'ritten' },
            { label: 'Revly Plus', value: 'plus' },
            { label: 'Privacy', value: 'privacy' },
          ],
          defaultValue: 'algemeen',
        }),
        antwoord: fields.text({ label: 'Antwoord', multiline: true }),
        opHome: fields.checkbox({ label: 'Tonen op de homepage', defaultValue: false }),
      },
    }),
  },

  singletons: {
    site: singleton({
      label: 'Algemene gegevens',
      path: 'src/data/site',
      format: { data: 'json' },
      schema: {
        appStoreUrl: fields.text({ label: 'App Store-link', description: 'Leeg = "Binnenkort in de App Store".' }),
        prijsMaand: fields.text({ label: 'Prijs Plus per maand (zonder euroteken)' }),
        prijsJaar: fields.text({ label: 'Prijs Plus per jaar (zonder euroteken)' }),
        proefperiode: fields.text({ label: 'Proefperiode', description: 'Bijvoorbeeld "14 dagen gratis". Leeg = niet tonen.' }),
        supportEmail: fields.text({ label: 'Supportadres' }),
        kvkNummer: fields.text({ label: 'KvK-nummer' }),
        adres: fields.text({ label: 'Vestigingsadres', multiline: true }),
      },
    }),
    redirects: singleton({
      label: 'Redirects',
      path: 'src/data/redirects',
      format: { data: 'json' },
      schema: {
        regels: fields.array(
          fields.object({
            van: fields.text({ label: 'Van (oud pad)' }),
            naar: fields.text({ label: 'Naar (nieuw pad of URL)' }),
            code: fields.select({
              label: 'Soort',
              options: [
                { label: '301 permanent', value: '301' },
                { label: '302 tijdelijk', value: '302' },
              ],
              defaultValue: '301',
            }),
          }),
          { label: 'Redirects', itemLabel: (p) => `${p.fields.van.value} naar ${p.fields.naar.value}` }
        ),
      },
    }),
  },
});
