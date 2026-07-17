import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.string(),
  image: z.string(),
  author: z.string().default('Микола'),
  readTime: z.string(),
  tags: z.array(z.string()),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  toc: z.array(z.object({
    id: z.string(),
    title: z.string(),
  })),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

const blogRu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-ru' }),
  schema: blogSchema,
});

const blogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-en' }),
  schema: blogSchema,
});

export const collections = { blog, 'blog-ru': blogRu, 'blog-en': blogEn };
