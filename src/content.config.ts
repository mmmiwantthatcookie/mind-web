import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'es']),
    order: z.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const guidesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'es']),
    order: z.number().optional(),
  }),
});

const changelogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'es']),
    type: z.enum(['feature', 'fix', 'dataset', 'research']),
    version: z.string().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
  guides: guidesCollection,
  changelog: changelogCollection,
};
