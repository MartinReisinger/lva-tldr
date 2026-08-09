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
