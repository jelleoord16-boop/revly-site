import { collection, fields, singleton } from '@keystatic/core';

function vertaling(label: string, options: { multiline?: boolean; max?: number; required?: boolean } = {}) {
  const { multiline, max, required } = options;
  const validation = { isRequired: required, length: max ? { max } : undefined };
  return fields.object({
    nl: fields.text({ label: 'Nederlands', multiline, validation }),
    en: fields.text({ label: 'Engels', multiline, validation }),
  }, { label });
}

const seo = {
  seoTitel: vertaling('SEO-titel', { max: 60 }),
  meta: vertaling('Metabeschrijving', { multiline: true, max: 160 }),
};

const introductie = {
  kop: vertaling('Paginakop', { multiline: true, required: true }),
  intro: vertaling('Introductie', { multiline: true, required: true }),
};

const sectieVelden = {
  bovenkop: 'Kleine kop boven de titel',
  kop: 'Kop',
  vervolg: 'Tweede regel van de kop',
  tekst: 'Tekst',
  knop: 'Linktekst',
  fotobijschrift: 'Fotobijschrift',
  kaartKop: 'Kop van het appvoorbeeld',
  kaartTekst: 'Tekst bij het appvoorbeeld',
  winkelKnop: 'App Store-knop',
  winkelBinnenkort: 'Tekst zolang de downloadlink ontbreekt',
};

function sectie(label: string, keys: (keyof typeof sectieVelden)[]) {
  return fields.object(Object.fromEntries(keys.map(key => [
    key, vertaling(sectieVelden[key], { multiline: key === 'tekst' || key === 'kaartTekst', required: true }),
  ])), { label });
}

const tekstblok = fields.object({
  label: fields.text({ label: 'Naam in inhoudsopgave', validation: { isRequired: true } }),
  kop: fields.text({ label: 'Kop', validation: { isRequired: true } }),
  tekst: fields.text({ label: 'Tekst', multiline: true, validation: { isRequired: true } }),
});

const appHoofdstukken = ['garage', 'onderhoud', 'ritten', 'verbruik', 'kosten', 'delen', 'vorige-autos', 'autopaspoort'] as const;
const appHoofdstukVelden = Object.fromEntries(appHoofdstukken.map(id => [
  id, fields.object({ nl: tekstblok, en: tekstblok }, { label: id }),
]));

function siteTaal(label: string) {
  return fields.object({
    menu: fields.object({
      home: fields.text({ label: 'Home' }),
      check: fields.text({ label: 'Check je auto' }),
      app: fields.text({ label: 'De app' }),
      plus: fields.text({ label: 'Plus' }),
      blog: fields.text({ label: 'Blog' }),
      download: fields.text({ label: 'Download' }),
    }, { label: 'Menu' }),
    footerIntro: fields.text({ label: 'Beschrijving in de footer', multiline: true }),
    footerKolommen: fields.array(fields.object({
      kop: fields.text({ label: 'Kolomkop', validation: { isRequired: true } }),
      links: fields.array(fields.object({
        label: fields.text({ label: 'Linktekst', validation: { isRequired: true } }),
        url: fields.text({ label: 'URL', description: 'Begin met / of https://.', validation: { isRequired: true } }),
      }), { label: 'Links', itemLabel: props => props.fields.label.value }),
    }), { label: 'Footer-kolommen', itemLabel: props => props.fields.kop.value }),
    metaStandaard: fields.text({ label: 'Standaard metabeschrijving', multiline: true, validation: { length: { max: 160 } } }),
  }, { label });
}

export const autobegrippen = collection({
  label: 'Autobegrippen',
  slugField: 'naam',
  path: 'src/content/autobegrippen/*',
  format: { data: 'json' },
  schema: {
    naam: fields.slug({
      name: { label: 'Begrip (Nederlands)', validation: { isRequired: true } },
      slug: { label: 'Nederlandse URL', description: 'Behoud deze waarde voor bestaande begrippen.' },
    }),
    naamEn: fields.text({ label: 'Begrip (Engels)', validation: { isRequired: true } }),
    slugEn: fields.text({
      label: 'Engelse URL',
      description: 'Gebruik kleine letters, cijfers en koppeltekens. Behoud deze waarde voor bestaande begrippen.',
      validation: { isRequired: true, pattern: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ } },
    }),
    category: vertaling('Onderwerp', { required: true }),
    title: vertaling('Paginakop', { required: true }),
    intro: vertaling('Introductie', { multiline: true }),
    definition: vertaling('Definitie', { multiline: true, required: true }),
    heading: vertaling('Kop van de uitleg', { required: true }),
    explanation: fields.object({
      nl: fields.array(fields.text({ label: 'Alinea', multiline: true }), { label: 'Nederlands' }),
      en: fields.array(fields.text({ label: 'Alinea', multiline: true }), { label: 'Engels' }),
    }, { label: 'Uitleg' }),
    exampleTitle: vertaling('Kop van het praktijkvoorbeeld', { required: true }),
    example: vertaling('Praktijkvoorbeeld', { multiline: true, required: true }),
    takeaway: vertaling('Afsluitende tip', { multiline: true }),
    heroAfbeelding: fields.image({
      label: 'Headerafbeelding',
      description: 'Verschijnt bovenaan het begrip en in het overzicht.',
      directory: 'public/images/terms/uploads',
      publicPath: '/images/terms/uploads/',
    }),
    bestaandeAfbeelding: fields.text({ label: 'Pad naar bestaande afbeelding', description: 'Wordt gebruikt zonder upload. Leeg laten voor de standaardfoto.' }),
    alt: vertaling('Beschrijving van de afbeelding'),
    appAnchor: fields.select({
      label: 'Verwijzing naar een onderdeel van de app',
      options: [{ label: 'Algemene app-pagina', value: '' }, ...appHoofdstukken.map(id => ({ label: id, value: id }))],
      defaultValue: '',
    }),
    appCopy: vertaling('Uitleg bij de verwijzing naar Revly', { multiline: true }),
    sources: fields.array(fields.object({
      label: fields.text({ label: 'Bronnaam' }),
      url: fields.text({ label: 'Bron-URL' }),
    }), { label: 'Bronnen', itemLabel: props => props.fields.label.value }),
    gerelateerd: fields.array(fields.relationship({ label: 'Begrip', collection: 'autobegrippen', validation: { isRequired: true } }), { label: 'Gerelateerde begrippen' }),
    bijgewerkt: fields.date({ label: 'Laatst bijgewerkt' }),
    ...seo,
  },
});

export const siteContent = {
  home: singleton({
    label: 'Home',
    path: 'src/data/pages/home',
    format: { data: 'json' },
    schema: {
      ...introductie,
      kopVervolg: vertaling('Tweede regel van de kop', { required: true }),
      primaireKnop: vertaling('Knop Ontdek Revly', { required: true }),
      secundaireKnop: vertaling('Knop Kijk in de app', { required: true }),
      gratis: vertaling('Tekst onder de knoppen'),
      secties: fields.object({
        verhaal: sectie('Het verhaal van je auto', ['kop', 'tekst']),
        overzicht: sectie('Appvoorbeelden', ['kop', 'knop']),
        ritten: sectie('Ritten', ['bovenkop', 'kop', 'vervolg', 'tekst', 'knop']),
        onderhoud: sectie('Onderhoud', ['bovenkop', 'kop', 'vervolg', 'tekst', 'knop']),
        inzichten: sectie('Inzichten', ['bovenkop', 'kop']),
        vorigeAutos: sectie('Vorige auto’s', ['bovenkop', 'kop', 'tekst', 'fotobijschrift', 'kaartKop', 'kaartTekst']),
        plus: sectie('Plus', ['kop', 'vervolg', 'tekst', 'knop']),
        download: sectie('Download', ['kop', 'vervolg', 'tekst', 'winkelKnop', 'winkelBinnenkort', 'knop']),
      }, { label: 'Secties op de homepage' }),
      ...seo,
    },
  }),
  app: singleton({
    label: 'De app',
    path: 'src/data/pages/app',
    format: { data: 'json' },
    schema: {
      ...introductie,
      broodkruimel: vertaling('Paginanaam in broodkruimelpad'),
      hoofdstukken: fields.object(appHoofdstukVelden, { label: 'Hoofdstukken' }),
      ...seo,
    },
  }),
  plus: singleton({
    label: 'Revly Plus',
    path: 'src/data/pages/plus',
    format: { data: 'json' },
    schema: { ...introductie, ...seo },
  }),
  begrippenOverzicht: singleton({
    label: 'Overzicht autobegrippen',
    path: 'src/data/pages/termen',
    format: { data: 'json' },
    schema: { ...introductie, ...seo },
  }),
  siteCopy: singleton({
    label: 'Menu, footer en standaard SEO',
    path: 'src/data/site-copy',
    format: { data: 'json' },
    schema: { nl: siteTaal('Nederlands'), en: siteTaal('Engels') },
  }),
};
