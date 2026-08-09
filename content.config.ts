import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const quizOption = z.object({
  text: z.string(),
  correct: z.boolean(),
  explanation: z.string().optional(),
})

const quizQuestionBase = z.object({
  id: z.number().int().positive(),
  revision: z.number().int().positive(),
  question: z.string(),
  reason: z.string().optional(),
})

const quizQuestion = z.discriminatedUnion('type', [
  quizQuestionBase.extend({ type: z.literal('text'), answer: z.string() }),
  quizQuestionBase.extend({ type: z.literal('single'), options: z.array(quizOption).min(1) }),
  quizQuestionBase.extend({ type: z.literal('multiple'), options: z.array(quizOption).min(1) }),
])

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
        updatedAt: z.string(),
      }),
    }),
    quizzes: defineCollection({
      type: 'data',
      source: 'quizzes/*.json',
      schema: z.object({
        quizId: z.string().regex(/^[a-z0-9-]{1,64}$/),
        version: z.number().int().positive(),
        questions: z.array(quizQuestion).min(6),
      }),
    }),
  },
})
