import type { QuizQuestion } from '../types/quiz'

export function isQuizAnswerCorrect(
  question: QuizQuestion,
  textAnswer: string,
  selected: number[],
) {
  if (question.type === 'text') {
    return textAnswer.trim().toLocaleLowerCase()
      === String(question.answer ?? '').trim().toLocaleLowerCase()
  }
  const answer = (question.options ?? [])
    .flatMap((option, index) => option.correct ? [index] : [])
  const submitted = [...selected].sort((a, b) => a - b)
  return submitted.length === answer.length
    && submitted.every((value, index) => value === answer[index])
}

export function shuffledOptionIndices(
  question: QuizQuestion,
  random = Math.random,
) {
  const indices = (question.options ?? []).map((_, index) => index)
  for (let index = indices.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[indices[index], indices[swapIndex]] = [indices[swapIndex]!, indices[index]!]
  }
  return indices
}
