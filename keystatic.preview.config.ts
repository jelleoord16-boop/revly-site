import { config } from '@keystatic/core';
import { siteContent } from './keystatic.site-content';
import localConfig from './keystatic.config';

export default config({
  storage: {
    kind: 'github',
    repo: 'jelleoord16-boop/revly-site',
  },
  ui: {
    brand: { name: 'Revly' },
    navigation: {
      Inhoud: ['blog', 'autobegrippen'],
      'Pagina’s': ['home', 'app', 'plus', 'begrippenOverzicht'],
      Instellingen: ['siteCopy'],
    },
  },
  collections: { blog: localConfig.collections.blog, autobegrippen: localConfig.collections.autobegrippen },
  singletons: siteContent,
});
