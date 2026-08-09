import type {
  QuizProgress,
  QuizQuestionProgress,
  QuizQuestionRevisions,
} from '../types/quiz'

export const QUIZ_REQUIRED_STREAK = 2
export const QUIZ_SPACING = 5

const emptyQuestionProgress = (questionRevision = 1): QuizQuestionProgress => ({
  questionRevision,
  attempts: 0,
  correct: 0,
  wrong: 0,
  streak: 0,
  completed: false,
})

const asObject = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' ? value as Record<string, unknown> : null

const asCount = (value: unknown) =>
  Number.isInteger(value) && Number(value) >= 0 ? Number(value) : 0

export function createQuizProgress(
  questionIds: number[],
  now = new Date().toISOString(),
  revisions: QuizQuestionRevisions = {},
): QuizProgress {
  return {
    version: 2,
    answered: 0,
    stats: Object.fromEntries(questionIds.map(id => [id, emptyQuestionProgress(revisions[id] ?? 1)])),
    recentIds: [],
    questionOrder: [...questionIds],
    history: [],
    currentQuestionId: null,
    updatedAt: now,
  }
}

export function normalizeQuizProgress(
  input: unknown,
  questionIds: number[],
  revisions: QuizQuestionRevisions = {},
): QuizProgress {
  const source = asObject(input)
  const normalized = createQuizProgress(questionIds, new Date().toISOString(), revisions)
  if (!source || source.version !== 2) return normalized

  const sourceStats = asObject(source.stats)
  for (const id of questionIds) {
    const raw = asObject(sourceStats?.[id])
    if (!raw) continue
    const currentRevision = revisions[id] ?? 1
    const storedRevision = asCount(raw.questionRevision) || 1
    if (storedRevision !== currentRevision) continue
    const completed = raw.completed === true
    normalized.stats[id] = {
      questionRevision: currentRevision,
      attempts: asCount(raw.attempts),
      correct: asCount(raw.correct),
      wrong: asCount(raw.wrong),
      streak: completed ? QUIZ_REQUIRED_STREAK : Math.min(1, asCount(raw.streak)),
      completed,
    }
  }

  const validIds = new Set(questionIds)
  const storedOrder = Array.isArray(source.questionOrder)
    ? source.questionOrder.map(Number).filter((id, index, ids) =>
        validIds.has(id) && ids.indexOf(id) === index,
      )
    : []
  normalized.questionOrder = [
    ...storedOrder,
    ...questionIds.filter(id => !storedOrder.includes(id)),
  ]
  normalized.answered = asCount(source.answered)
  const recentIds = Array.isArray(source.recentIds)
    ? source.recentIds.filter((id): id is number => validIds.has(Number(id))).map(Number)
    : []
  normalized.recentIds = recentIds
    .filter((id, index, ids) => ids.lastIndexOf(id) === index)
    .slice(-QUIZ_SPACING)
  normalized.history = Array.isArray(source.history)
    ? source.history.slice(-100).flatMap((entry) => {
        const item = asObject(entry)
        const id = Number(item?.id)
        if (!item || !validIds.has(id) || typeof item.correct !== 'boolean' || typeof item.at !== 'string') return []
        return [{ id, correct: item.correct, at: item.at }]
      })
    : []
  const currentId = Number(source.currentQuestionId)
  normalized.currentQuestionId = validIds.has(currentId) ? currentId : null
  normalized.updatedAt = typeof source.updatedAt === 'string' ? source.updatedAt : normalized.updatedAt
  return normalized
}

export function recordQuizAnswer(
  current: QuizProgress,
  id: number,
  correct: boolean,
  questionIds: number[],
  revisions: QuizQuestionRevisions = {},
  now = new Date().toISOString(),
): QuizProgress {
  const progress = normalizeQuizProgress(current, questionIds, revisions)
  const record = progress.stats[id]
  if (!record) return progress

  record.attempts++
  if (correct) record.correct++
  else record.wrong++

  if (!record.completed) {
    record.streak = correct ? record.streak + 1 : 0
    if (record.streak >= QUIZ_REQUIRED_STREAK) {
      record.streak = QUIZ_REQUIRED_STREAK
      record.completed = true
    }
  }

  progress.answered++
  progress.recentIds = [...progress.recentIds.filter(recentId => recentId !== id), id]
    .slice(-QUIZ_SPACING)
  progress.history = [...progress.history, { id, correct, at: now }].slice(-100)
  progress.updatedAt = now
  return progress
}

export function selectNextQuestion(
  progress: QuizProgress,
  questionIds: number[],
): number | null {
  if (questionIds.every(id => progress.stats[id]?.completed)) return null

  const recent = new Set(progress.recentIds)
  const ordered = normalizedOrder(progress, questionIds)
  const unfinishedWithoutCorrect = ordered.filter(id =>
    !progress.stats[id]?.completed && progress.stats[id]?.streak === 0,
  )
  const eligibleWithoutCorrect = unfinishedWithoutCorrect.filter(id => !recent.has(id))
  if (eligibleWithoutCorrect.length) return eligibleWithoutCorrect[0]!

  const eligibleCompleted = ordered.filter(id => progress.stats[id]?.completed && !recent.has(id))
  if (unfinishedWithoutCorrect.length && eligibleCompleted.length) return eligibleCompleted[0]!

  const eligibleWaitingForSecond = ordered.filter(id =>
    !progress.stats[id]?.completed && progress.stats[id]?.streak === 1 && !recent.has(id),
  )
  return eligibleWaitingForSecond[0] ?? eligibleCompleted[0] ?? null
}

function normalizedOrder(progress: QuizProgress, questionIds: number[]) {
  const validIds = new Set(questionIds)
  const stored = progress.questionOrder.filter((id, index, ids) =>
    validIds.has(id) && ids.indexOf(id) === index,
  )
  return [...stored, ...questionIds.filter(id => !stored.includes(id))]
}

export function quizQuestionQueue(progress: QuizProgress, questionIds: number[]) {
  const current = progress.currentQuestionId
  const ordered = normalizedOrder(progress, questionIds)
  const next = selectNextQuestion(progress, questionIds)
  const leading = [current, next].filter((id, index, ids): id is number =>
    id !== null && questionIds.includes(id) && ids.indexOf(id) === index,
  )
  const remaining = ordered.filter(id => !leading.includes(id))
  const withoutCorrect = remaining.filter(id =>
    !progress.stats[id]?.completed && progress.stats[id]?.streak === 0,
  )
  const waitingForSecond = remaining.filter(id => progress.stats[id]?.streak === 1)
  const completed = remaining.filter(id => progress.stats[id]?.completed)
  return [...leading, ...withoutCorrect, ...waitingForSecond, ...completed]
}

export function shuffleUnseenQuestionOrder(
  progress: QuizProgress,
  random = Math.random,
) {
  const order = [...progress.questionOrder]
  const positions = order.flatMap((id, index) =>
    progress.stats[id]?.attempts === 0 && id !== progress.currentQuestionId ? [index] : [],
  )
  const unseen = positions.map(index => order[index]!)
  for (let index = unseen.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[unseen[index], unseen[swapIndex]] = [unseen[swapIndex]!, unseen[index]!]
  }
  positions.forEach((position, index) => { order[position] = unseen[index]! })
  return order
}

export function quizTotals(progress: QuizProgress) {
  const records = Object.values(progress.stats)
  return {
    completed: records.filter(record => record.completed).length,
    masterySteps: records.reduce((sum, record) => sum + record.streak, 0),
    correct: records.reduce((sum, record) => sum + record.correct, 0),
    wrong: records.reduce((sum, record) => sum + record.wrong, 0),
  }
}
