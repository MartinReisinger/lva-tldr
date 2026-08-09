import { and, eq } from 'drizzle-orm'
import { quizProgress } from '../../db/schema'
import { normalizeQuizProgress } from '../../../shared/utils/spacedQuiz'

export default defineEventHandler(async (event) => {
  const user = await requireQuizUser(event)
  const quizId = getRouterParam(event, 'quizId') ?? ''
  const bank = await requireQuizBank(event, quizId)
  const { questionIds, revisions } = quizBankIdentity(bank)
  const row = db.select().from(quizProgress).where(and(
    eq(quizProgress.userId, user.id),
    eq(quizProgress.quizId, quizId),
  )).get()

  if (!row) return { progress: null, revision: 0 }
  let stored: unknown = null
  try { stored = JSON.parse(row.stateJson) } catch { /* normalize corrupt data below */ }
  return {
    progress: normalizeQuizProgress(stored, questionIds, revisions),
    revision: row.revision,
  }
})
