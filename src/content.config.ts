import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    stack: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    artifact: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    problem: z.string(),
    approach: z.string(),
    outcome: z.string(),
    links: z.object({
      live: z.string().url().optional(),
      github: z.string().url().optional(),
    }).optional(),
  }),
});

const writing = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/writing",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.string().optional(),
  }),
});

export const collections = {
  projects,
  writing,
};