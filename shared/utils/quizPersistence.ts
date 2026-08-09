import type { QuizProgress, QuizQuestionRevisions } from '../types/quiz'
import {
  createQuizProgress,
  normalizeQuizProgress,
  QUIZ_REQUIRED_STREAK,
  recordQuizAnswer,
} from './spacedQuiz'

const asObject = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' ? value as Record<string, unknown> : null

export function migrateLegacyQuizProgress(
  input: unknown,
  questionIds: number[],
  revisions: QuizQuestionRevisions = {},
): QuizProgress {
  const source = asObject(input)
  let progress = createQuizProgress(questionIds, new Date().toISOString(), revisions)
  if (!source || !Array.isArray(source.history)) return progress

  for (const rawEntry of source.history) {
    const entry = asObject(rawEntry)
    const id = Number(entry?.id)
    if (!entry || !progress.stats[id] || typeof entry.ok !== 'boolean') continue
    const timestamp = Number.isFinite(Number(entry.time)) ? Number(entry.time) : Date.now()
    progress = recordQuizAnswer(
      progress,
      id,
      entry.ok,
      questionIds,
      revisions,
      new Date(timestamp).toISOString(),
    )
  }

  const currentId = questionIds[Number(source.currentIndex)]
  progress.currentQuestionId = currentId !== undefined && questionIds.includes(currentId)
    ? currentId
    : null
  return progress
}

export function mergeQuizProgress(
  leftInput: unknown,
  rightInput: unknown,
  questionIds: number[],
  revisions: QuizQuestionRevisions = {},
): QuizProgress {
  const leftSource = asObject(leftInput)
  const rightSource = asObject(rightInput)
  const left = normalizeQuizProgress(leftInput, questionIds, revisions)
  const right = normalizeQuizProgress(rightInput, questionIds, revisions)
  const latest = leftSource?.version !== 2
    ? right
    : rightSource?.version !== 2
      ? left
      : Date.parse(right.updatedAt) > Date.parse(left.updatedAt) ? right : left
  const merged = createQuizProgress(questionIds, new Date().toISOString(), revisions)

  for (const id of questionIds) {
    const a = left.stats[id]!
    const b = right.stats[id]!
    const completed = a.completed || b.completed
    merged.stats[id] = {
      questionRevision: revisions[id] ?? 1,
      attempts: Math.max(a.attempts, b.attempts),
      correct: Math.max(a.correct, b.correct),
      wrong: Math.max(a.wrong, b.wrong),
      streak: completed ? QUIZ_REQUIRED_STREAK : Math.max(a.streak, b.streak),
      completed,
    }
  }

  merged.answered = Math.max(left.answered, right.answered)
  merged.history = [...left.history, ...right.history]
    .filter((entry, index, entries) => entries.findIndex(candidate =>
      candidate.id === entry.id && candidate.correct === entry.correct && candidate.at === entry.at,
    ) === index)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    .slice(-100)
  merged.recentIds = latest.recentIds
  merged.currentQuestionId = latest.currentQuestionId
  merged.updatedAt = new Date().toISOString()
  return merged
}
