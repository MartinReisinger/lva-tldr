import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { QuizQuestion } from '../../shared/types/quiz'
import { isQuizAnswerCorrect, shuffledOptionIndices } from '../../shared/utils/quizAnswer'

const bank = JSON.parse(
  readFileSync('content/quizzes/computer-graphics.json', 'utf8'),
) as { quizId: string, version: number, questions: QuizQuestion[] }
const questions = bank.questions

describe('Computer Graphics question bank', () => {
  it('contains 84 uniquely identified, answerable questions', () => {
    expect(questions).toHaveLength(84)
    expect(bank.quizId).toBe('computer-graphics')
    expect(bank.version).toBe(2)
    expect(new Set(questions.map(question => question.id)).size).toBe(84)

    for (const question of questions) {
      expect(Number.isInteger(question.id) && question.id > 0).toBe(true)
      expect(Number.isInteger(question.revision) && question.revision > 0).toBe(true)
      expect(question.question.trim()).not.toBe('')
      if (question.type === 'text') expect(question.answer).toBeTruthy()
      else {
        const correctOptions = question.options?.filter(option => option.correct) ?? []
        if (question.type === 'single') expect(correctOptions).toHaveLength(1)
        expect(correctOptions.length).toBeGreaterThan(0)
        expect(question.options?.every(option => option.explanation)).toBe(true)
      }
    }
  })

  it('keeps all learner-facing content in English', () => {
    const learnerText = JSON.stringify(questions)
    const germanMarker = /[äöüß]|\b(?:wahr|falsch|eine|einer|eines|nicht|daher|durch|wird|werden|zwischen|zwei|drei|vier|sechs|acht|eigenvektoren|basisfunktionen|würfel|ecken|fälle)\b/i

    expect(learnerText).not.toMatch(germanMarker)
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

  it('randomizes options without changing their original answer indices', () => {
    const question = questions.find(item => (item.options?.length ?? 0) >= 3)!
    const shuffled = shuffledOptionIndices(question, () => 0)

    expect(new Set(shuffled)).toEqual(new Set(question.options!.map((_, index) => index)))
    expect(shuffled).not.toEqual(question.options!.map((_, index) => index))
  })
})
