import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    category: z.string().default('随笔'),
    tags: z.array(z.string()).default([]),
    references: z
      .array(
        z.object({
          title: z.string(),
          url: z.url(),
          publisher: z.string().optional(),
          accessed: z.string().optional(),
        }),
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
});

const blogVersions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-versions' }),
  schema: z.object({
    post: z.string(),
    versionDate: z.date(),
    label: z.string().default('历史版本'),
    changeNote: z.string().optional(),
    references: z
      .array(
        z.object({
          title: z.string(),
          url: z.url(),
          publisher: z.string().optional(),
          accessed: z.string().optional(),
        }),
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, blogVersions };
