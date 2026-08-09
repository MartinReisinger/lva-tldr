import { and, eq, sql } from 'drizzle-orm'
import { quizProgress } from '../../db/schema'
import { normalizeQuizProgress } from '../../../shared/utils/spacedQuiz'
import { mergeQuizProgress } from '../../../shared/utils/quizPersistence'

export default defineEventHandler(async (event) => {
  const user = await requireQuizUser(event)
  const quizId = getRouterParam(event, 'quizId') ?? ''
  const bank = await requireQuizBank(event, quizId)
  const { questionIds, revisions } = quizBankIdentity(bank)
  const incoming = normalizeQuizProgress(await readBody(event), questionIds, revisions)

  const progress = db.transaction((tx) => {
    const row = tx.select().from(quizProgress).where(and(
      eq(quizProgress.userId, user.id),
      eq(quizProgress.quizId, quizId),
    )).get()
    let stored: unknown = null
    try { stored = row ? JSON.parse(row.stateJson) : null } catch { /* merge from an empty state */ }
    const merged = mergeQuizProgress(stored, incoming, questionIds, revisions)

    tx.insert(quizProgress).values({
      userId: user.id,
      quizId,
      stateJson: JSON.stringify(merged),
      revision: 1,
      updatedAt: merged.updatedAt,
    }).onConflictDoUpdate({
      target: [quizProgress.userId, quizProgress.quizId],
      set: {
        stateJson: JSON.stringify(merged),
        revision: sql`${quizProgress.revision} + 1`,
        updatedAt: merged.updatedAt,
      },
    }).run()
    return merged
  })

  return { progress }
})
