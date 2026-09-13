import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const articles = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/articles' }), schema: z.object({ title: z.string().optional(), created: z.coerce.date().optional(), updated: z.coerce.date().optional(), category: z.string().optional(), tags: z.array(z.string()).optional(), description: z.string().optional() }) });
export const collections = { articles };
