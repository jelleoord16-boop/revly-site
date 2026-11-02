import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/blog' }),
  schema: z.object({
    titel: z.string(),
    status: z.enum(['concept', 'gepubliceerd']).default('concept'),
    datum: z.coerce.date().nullable().optional(),
    bijgewerkt: z.coerce.date().nullable().optional(),
    taal: z.enum(['nl', 'en']).default('nl'),
    samenvatting: z.string().optional().default(''),
    seo: z
      .object({
        titel: z.string().optional().default(''),
        beschrijving: z.string().optional().default(''),
        afbeelding: z.string().nullable().optional(),
        canonical: z.string().optional().default(''),
        noindex: z.boolean().optional().default(false),
      })
      .optional()
      .default({}),
  }),
});

const vragen = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/vragen' }),
  schema: z.object({
    vraag: z.string(),
    onderwerp: z.string().default('algemeen'),
    antwoord: z.string().default(''),
    opHome: z.boolean().default(false),
  }),
});

export const collections = { blog, vragen };
