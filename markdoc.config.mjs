import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    verbruik: {
      render: component('./src/components/VerbruikBlok.astro'),
      attributes: { model: { type: String } },
    },
  },
});
