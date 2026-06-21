import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    topics: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        order: z.number(),
      }),
    }),
  },
})
