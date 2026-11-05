import { config } from '@keystatic/core';
import localConfig from './keystatic.config';

export default config({
  storage: {
    kind: 'github',
    repo: 'jelleoord16-boop/revly-site',
  },
  ui: { brand: { name: 'Revly' } },
  collections: { blog: localConfig.collections.blog },
});
