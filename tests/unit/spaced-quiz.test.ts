import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  createQuizProgress,
  recordQuizAnswer,
  selectNextQuestion,
} from '../../shared/utils/spacedQuiz'
import type { QuizQuestion } from '../../shared/types/quiz'
import { isQuizAnswerCorrect } from '../../shared/utils/quizAnswer'
import {
  mergeQuizProgress,
  migrateLegacyQuizProgress,
} from '../../shared/utils/quizPersistence'

const ids = Array.from({ length: 8 }, (_, index) => index + 1)

describe('spaced quiz progress', () => {
  it('completes a question only after two correct submissions', () => {
    let progress = createQuizProgress(ids, '2026-08-09T10:00:00.000Z')
    progress = recordQuizAnswer(progress, 1, true, ids)
    expect(progress.stats[1]).toMatchObject({ streak: 1, completed: false })

    progress = recordQuizAnswer(progress, 1, true, ids)
    expect(progress.stats[1]).toMatchObject({ streak: 2, completed: true })
  })

  it('resets an unfinished streak after every wrong answer', () => {
    let progress = createQuizProgress(ids)
    progress = recordQuizAnswer(progress, 1, true, ids)
    progress = recordQuizAnswer(progress, 1, false, ids)
    expect(progress.stats[1]).toMatchObject({ streak: 0, completed: false })

    progress = recordQuizAnswer(progress, 1, true, ids)
    expect(progress.stats[1]).toMatchObject({ streak: 1, completed: false })
  })

  it('keeps a question out of the next five positions', () => {
    const spacingIds = [1, 2, 3, 4, 5, 6]
    let progress = createQuizProgress(spacingIds)
    progress = recordQuizAnswer(progress, 1, true, spacingIds)

    for (let expected = 2; expected <= 6; expected++) {
      const next = selectNextQuestion(progress, spacingIds, () => 0)
      expect(next).toBe(expected)
      progress = recordQuizAnswer(progress, next!, false, spacingIds)
    }

    expect(selectNextQuestion(progress, spacingIds, () => 0)).toBe(1)
  })

  it('uses completed questions as spacers if the only unfinished one is cooling down', () => {
    let progress = createQuizProgress(ids)
    for (const id of ids.slice(0, -1)) {
      progress.stats[id].completed = true
      progress.stats[id].streak = 2
    }
    progress = recordQuizAnswer(progress, 8, false, ids)

    expect(selectNextQuestion(progress, ids, () => 0)).toBe(1)
  })

  it('shows five different completed reviews before the last unfinished question returns', () => {
    let progress = createQuizProgress(ids)
    for (const id of ids.slice(0, -1)) {
      progress.stats[id].completed = true
      progress.stats[id].streak = 2
    }
    progress = recordQuizAnswer(progress, 8, true, ids)

    const reviews = new Set<number>()
    for (let position = 0; position < 5; position++) {
      const next = selectNextQuestion(progress, ids, () => 0)
      expect(next).not.toBe(8)
      reviews.add(next!)
      progress = recordQuizAnswer(progress, next!, false, ids)
    }

    expect(reviews.size).toBe(5)
    expect(selectNextQuestion(progress, ids, () => 0)).toBe(8)
  })

  it('merges local and remote progress without losing either completed question', () => {
    const local = recordQuizAnswer(
      recordQuizAnswer(createQuizProgress(ids), 1, true, ids),
      1,
      true,
      ids,
    )
    const remote = recordQuizAnswer(
      recordQuizAnswer(createQuizProgress(ids), 2, true, ids),
      2,
      true,
      ids,
    )

    const merged = mergeQuizProgress(local, remote, ids)
    expect(merged.stats[1].completed).toBe(true)
    expect(merged.stats[2].completed).toBe(true)
  })

  it('keeps local scheduling state when no remote progress exists yet', () => {
    const local = recordQuizAnswer(createQuizProgress(ids), 1, true, ids)
    local.currentQuestionId = 2

    const merged = mergeQuizProgress(local, null, ids)
    expect(merged.recentIds).toEqual([1])
    expect(merged.currentQuestionId).toBe(2)
  })

  it('derives consecutive streaks when migrating the legacy history', () => {
    const migrated = migrateLegacyQuizProgress({
      history: [
        { id: 1, ok: true, time: 1 },
        { id: 1, ok: false, time: 2 },
        { id: 1, ok: true, time: 3 },
        { id: 2, ok: true, time: 4 },
        { id: 2, ok: true, time: 5 },
      ],
    }, ids)

    expect(migrated.stats[1]).toMatchObject({ streak: 1, completed: false })
    expect(migrated.stats[2]).toMatchObject({ streak: 2, completed: true })
  })

  it('resets only a question whose authored revision changed', () => {
    const progress = recordQuizAnswer(
      createQuizProgress(ids, undefined, { 1: 1 }),
      1,
      true,
      ids,
      { 1: 1 },
    )

    const normalized = mergeQuizProgress(progress, null, ids, { 1: 2 })
    expect(normalized.stats[1]).toMatchObject({
      questionRevision: 2,
      attempts: 0,
      streak: 0,
      completed: false,
    })
  })
})

describe('Computer Graphics question bank', () => {
  const bank = JSON.parse(
    readFileSync('content/quizzes/computer-graphics.json', 'utf8'),
  ) as { quizId: string, version: number, questions: QuizQuestion[] }
  const questions = bank.questions

  it('contains 84 uniquely identified, answerable questions', () => {
    expect(questions).toHaveLength(84)
    expect(bank.quizId).toBe('computer-graphics')
    expect(new Set(questions.map(question => question.id)).size).toBe(84)

    for (const question of questions) {
      expect(Number.isInteger(question.id) && question.id > 0).toBe(true)
      expect(Number.isInteger(question.revision) && question.revision > 0).toBe(true)
      expect(question.question.trim()).not.toBe('')
      if (question.type === 'text') {
        expect(question.answer).toBeTruthy()
      } else {
        const correctOptions = question.options?.filter(option => option.correct) ?? []
        if (question.type === 'single') expect(correctOptions).toHaveLength(1)
        expect(correctOptions.length).toBeGreaterThan(0)
        expect(question.options?.every(option => option.explanation)).toBe(true)
      }
    }
  })

  it('checks text, single-choice, and multiple-choice answers exactly', () => {
    const text = questions.find(question => question.type === 'text')!
    const single = questions.find(question => question.type === 'single')!
    const multiple = questions.find(question => question.type === 'multiple')!

    expect(isQuizAnswerCorrect(text, ` ${text.answer} `, [])).toBe(true)
    expect(isQuizAnswerCorrect(single, '', [single.options!.findIndex(option => option.correct)])).toBe(true)
    expect(isQuizAnswerCorrect(
      multiple,
      '',
      multiple.options!.flatMap((option, index) => option.correct ? [index] : []),
    )).toBe(true)
  })
})
