export type QuizQuestionType = 'text' | 'single' | 'multiple'

export interface QuizOption {
  text: string
  correct: boolean
  explanation?: string
}

export interface QuizQuestion {
  id: number
  revision: number
  type: QuizQuestionType
  question: string
  answer?: string
  reason?: string
  options?: QuizOption[]
}

export interface QuizQuestionProgress {
  questionRevision: number
  attempts: number
  correct: number
  wrong: number
  streak: number
  completed: boolean
}

export interface QuizHistoryEntry {
  id: number
  correct: boolean
  at: string
}

export interface QuizProgress {
  version: 2
  answered: number
  stats: Record<number, QuizQuestionProgress>
  recentIds: number[]
  history: QuizHistoryEntry[]
  currentQuestionId: number | null
  updatedAt: string
}

export type QuizQuestionRevisions = Record<number, number>
