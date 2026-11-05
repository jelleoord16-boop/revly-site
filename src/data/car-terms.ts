type Translation<T = string> = { nl: T; en: T };

interface TermEntry {
  naam: string;
  naamEn: string;
  slugEn: string;
  category: Translation;
  title: Translation;
  definition: Translation;
  intro: Translation;
  heading: Translation;
  explanation: Translation<string[]>;
  exampleTitle: Translation;
  example: Translation;
  takeaway: Translation;
  alt: Translation;
  heroAfbeelding?: string | null;
  bestaandeAfbeelding?: string;
  appAnchor: string;
  appCopy: Translation;
  sources: { label: string; url: string }[];
  gerelateerd?: string[];
  bijgewerkt?: string | null;
  seoTitel?: Translation;
  meta?: Translation;
}

const entries = import.meta.glob<TermEntry>('../content/autobegrippen/*.json', {
  eager: true,
  import: 'default',
});

export const carTerms = Object.entries(entries).map(([path, entry]) => {
  const id = path.split('/').pop()!.replace(/\.json$/, '');
  const slugEn = entry.slugEn || id;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugEn)) {
    throw new Error(`Ongeldige Engelse URL voor autobegrip ${id}`);
  }
  const image = [entry.heroAfbeelding, entry.bestaandeAfbeelding]
    .find(path => path && /^\/images\/[a-z0-9/_-]+\.(avif|gif|jpe?g|png|webp)$/i.test(path))
    || '/images/bmw-e30-example.jpg';
  return {
    ...entry,
    id,
    slug: { nl: id, en: slugEn },
    name: { nl: entry.naam, en: entry.naamEn },
    image,
    sources: (entry.sources ?? []).filter(source => /^https?:\/\//i.test(source.url)),
  };
});

if (new Set(carTerms.map(term => term.slug.en)).size !== carTerms.length) {
  throw new Error('Ieder autobegrip moet een unieke Engelse URL hebben.');
}

export type CarTerm = typeof carTerms[number];
