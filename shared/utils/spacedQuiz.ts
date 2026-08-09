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
  normalized.answered = asCount(source.answered)
  normalized.recentIds = Array.isArray(source.recentIds)
    ? source.recentIds.filter((id): id is number => validIds.has(Number(id))).map(Number).slice(-QUIZ_SPACING)
    : []
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
  progress.recentIds = [...progress.recentIds, id].slice(-QUIZ_SPACING)
  progress.history = [...progress.history, { id, correct, at: now }].slice(-100)
  progress.updatedAt = now
  return progress
}

export function selectNextQuestion(
  progress: QuizProgress,
  questionIds: number[],
  random = Math.random,
): number | null {
  if (questionIds.every(id => progress.stats[id]?.completed)) return null

  const recent = new Set(progress.recentIds)
  const remaining = questionIds.filter(id => !progress.stats[id]?.completed && !recent.has(id))
  const spacers = questionIds.filter(id => progress.stats[id]?.completed && !recent.has(id))
  const candidates = remaining.length ? remaining : spacers
  const minimumAttempts = Math.min(...candidates.map(id => progress.stats[id]?.attempts ?? 0))
  const leastSeen = candidates.filter(id => (progress.stats[id]?.attempts ?? 0) === minimumAttempts)
  return leastSeen[Math.min(leastSeen.length - 1, Math.floor(random() * leastSeen.length))] ?? null
}

export function quizTotals(progress: QuizProgress) {
  const records = Object.values(progress.stats)
  return {
    completed: records.filter(record => record.completed).length,
    correct: records.reduce((sum, record) => sum + record.correct, 0),
    wrong: records.reduce((sum, record) => sum + record.wrong, 0),
  }
}
