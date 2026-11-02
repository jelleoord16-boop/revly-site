import { defineConfig } from 'astro/config';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

// Keystatic draait in deze proefversie alleen lokaal (npm run dev).
// Voor beheer op getrevly.nl/keystatic komt er later de Cloudflare-adapter bij.
const isDev = process.argv.includes('dev');

// Pagina's met noindex horen niet in de sitemap.
const verbruik = JSON.parse(readFileSync('./src/data/verbruik.json', 'utf8'));
const d = verbruik.drempel;
const teWeinigData = verbruik.modellen
  .filter((m) => !(m.revly.deelnemers >= d.deelnemers && m.revly.deelnemerMaanden >= d.deelnemerMaanden && m.revly.kilometers >= d.kilometers && m.revly.grootsteAandeel <= d.maxAandeel))
  .map((m) => `/verbruik/${m.merkSlug}/${m.modelSlug}/`);
const blogNoindex = readdirSync('./src/content/blog')
  .filter((f) => /noindex:\s*true/.test(readFileSync(`./src/content/blog/${f}`, 'utf8')))
  .map((f) => `/blog/${f.replace(/\.mdoc$/, '')}/`);
const uitSitemap = [...teWeinigData, ...blogNoindex];

// Schrijft de redirects uit Keystatic naar een _redirects-bestand voor Cloudflare.
const cloudflareRedirects = {
  name: 'revly-redirects',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const { regels = [] } = JSON.parse(readFileSync('./src/data/redirects.json', 'utf8'));
      const regelsTekst = regels
        .filter((r) => r.van && r.naar)
        .map((r) => `${r.van} ${r.naar} ${r.code || '301'}`)
        .join('\n');
      writeFileSync(new URL('_redirects', dir), regelsTekst + '\n');
    },
  },
};

export default defineConfig({
  site: 'https://getrevly.nl',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [
    markdoc(),
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/keystatic') && !uitSitemap.some((p) => page.endsWith(p)),
      i18n: { defaultLocale: 'nl', locales: { nl: 'nl-NL', en: 'en-GB' } },
    }),
    cloudflareRedirects,
    ...(isDev ? [react(), keystatic()] : []),
  ],
});
