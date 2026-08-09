import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'

export async function requireQuizBank(event: H3Event, quizId: string) {
  if (!/^[a-z0-9-]{1,64}$/.test(quizId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid quiz identifier' })
  }
  const bank = await queryCollection(event, 'quizzes')
    .where('quizId', '=', quizId)
    .first()
  if (!bank) throw createError({ statusCode: 404, statusMessage: 'Quiz not found' })
  return bank
}

export function quizBankIdentity(bank: Awaited<ReturnType<typeof requireQuizBank>>) {
  return {
    questionIds: bank.questions.map(question => question.id),
    revisions: Object.fromEntries(
      bank.questions.map(question => [question.id, question.revision]),
    ),
  }
}
