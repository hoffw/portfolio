import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/projects' }),
  schema: z.object({
    name: z.string(),
    thumbnail: z.string(),
    tech: z.array(z.string()),
    description: z.string(),
    download: z.string().optional(),
    github: z.string().optional()
  }),
});

export const collections = { projects };