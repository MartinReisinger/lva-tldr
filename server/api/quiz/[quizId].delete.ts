import { and, eq } from 'drizzle-orm'
import { quizProgress } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireQuizUser(event)
  const quizId = getRouterParam(event, 'quizId') ?? ''
  await requireQuizBank(event, quizId)
  db.delete(quizProgress).where(and(
    eq(quizProgress.userId, user.id),
    eq(quizProgress.quizId, quizId),
  )).run()
  return { ok: true }
})
