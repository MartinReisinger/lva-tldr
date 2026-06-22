import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    topics: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        order: z.number(),
        kind: z.enum(['topic', 'group']).default('topic'),
        downloadPath: z.string().optional(),
        originalDownloadPath: z.string().optional(),
        solutionDownloadPath: z.string().optional(),
      }),
    }),
  },
})
