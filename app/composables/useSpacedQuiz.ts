import type { QuizProgress, QuizQuestion } from '#shared/types/quiz'
import {
  createQuizProgress,
  normalizeQuizProgress,
  quizTotals,
  recordQuizAnswer,
  selectNextQuestion,
} from '#shared/utils/spacedQuiz'
import { isQuizAnswerCorrect } from '#shared/utils/quizAnswer'
import {
  mergeQuizProgress,
  migrateLegacyQuizProgress,
} from '#shared/utils/quizPersistence'

interface QuizAuthStatus {
  enabled: boolean
  user: null | { name: string, email: string, avatar?: string }
}

interface SpacedQuizOptions {
  questions: QuizQuestion[]
  quizId: string
  storageKey: string
  legacyStorageKey?: string
}

export function useSpacedQuiz(options: SpacedQuizOptions) {
  const questionIds = options.questions.map(question => question.id)
  const revisions = Object.fromEntries(
    options.questions.map(question => [question.id, question.revision]),
  )
  const byId = new Map(options.questions.map(question => [question.id, question]))
  const progress = ref<QuizProgress>(createQuizProgress(questionIds, undefined, revisions))
  const ready = ref(false)
  const selected = ref<number[]>([])
  const textAnswer = ref('')
  const checked = ref(false)
  const wasCorrect = ref(false)
  const wasReview = ref(false)
  const syncState = ref<'local' | 'syncing' | 'synced' | 'error'>('local')
  const auth = ref<QuizAuthStatus>({ enabled: false, user: null })
  let syncTimer: ReturnType<typeof setTimeout> | undefined

  const currentQuestion = computed(() =>
    progress.value.currentQuestionId
      ? byId.get(progress.value.currentQuestionId) ?? null
      : null,
  )
  const currentStats = computed(() => currentQuestion.value
    ? progress.value.stats[currentQuestion.value.id]
    : null)
  const totals = computed(() => quizTotals(progress.value))
  const complete = computed(() => totals.value.completed === questionIds.length)
  const percentage = computed(() => Math.round(totals.value.completed / questionIds.length * 100))
  const hasAnswer = computed(() => currentQuestion.value?.type === 'text'
    ? textAnswer.value.trim().length > 0
    : selected.value.length > 0)
  const history = computed(() => [...progress.value.history]
    .reverse()
    .map(entry => ({ ...entry, question: byId.get(entry.id) }))
    .filter(entry => entry.question)
    .slice(0, 20))

  function resetAnswer() {
    selected.value = []
    textAnswer.value = ''
    checked.value = false
    wasCorrect.value = false
    wasReview.value = false
  }

  function chooseNext() {
    progress.value.currentQuestionId = selectNextQuestion(progress.value, questionIds)
    resetAnswer()
    persist()
  }

  function ensureFreshQuestion() {
    const currentId = progress.value.currentQuestionId
    if (!complete.value && (!currentId || progress.value.recentIds.includes(currentId))) {
      progress.value.currentQuestionId = selectNextQuestion(progress.value, questionIds)
    }
  }

  function saveLocal() {
    localStorage.setItem(options.storageKey, JSON.stringify(progress.value))
  }

  async function upload() {
    if (!auth.value.user) return
    syncState.value = 'syncing'
    try {
      const response = await $fetch<{ progress: QuizProgress }>(`/api/quiz/${options.quizId}`, {
        method: 'PUT',
        body: progress.value,
      })
      progress.value = mergeQuizProgress(progress.value, response.progress, questionIds, revisions)
      saveLocal()
      syncState.value = 'synced'
    } catch {
      syncState.value = 'error'
    }
  }

  function persist(remote = true) {
    if (!import.meta.client || !ready.value) return
    progress.value.updatedAt = new Date().toISOString()
    saveLocal()
    if (!remote || !auth.value.user) return
    syncState.value = 'syncing'
    clearTimeout(syncTimer)
    syncTimer = setTimeout(() => void upload(), 350)
  }

  function submit(showSolution = false) {
    const question = currentQuestion.value
    if (!question || checked.value || (!showSolution && !hasAnswer.value)) return
    wasReview.value = Boolean(currentStats.value?.completed)
    wasCorrect.value = !showSolution && isQuizAnswerCorrect(
      question,
      textAnswer.value,
      selected.value,
    )
    progress.value = recordQuizAnswer(
      progress.value,
      question.id,
      wasCorrect.value,
      questionIds,
      revisions,
    )
    checked.value = true
    persist()
  }

  function toggleOption(index: number, enabled: boolean) {
    if (checked.value) return
    if (currentQuestion.value?.type === 'single') selected.value = enabled ? [index] : []
    else if (enabled) selected.value = [...selected.value, index]
    else selected.value = selected.value.filter(value => value !== index)
  }

  async function refreshAuthAndSync() {
    try {
      auth.value = await $fetch<QuizAuthStatus>('/api/quiz/auth')
      if (!auth.value.user) return
      syncState.value = 'syncing'
      const response = await $fetch<{ progress: QuizProgress | null }>(`/api/quiz/${options.quizId}`)
      progress.value = mergeQuizProgress(progress.value, response.progress, questionIds, revisions)
      ensureFreshQuestion()
      saveLocal()
      await upload()
    } catch {
      syncState.value = auth.value.user ? 'error' : 'local'
    }
  }

  async function resetProgress() {
    clearTimeout(syncTimer)
    progress.value = createQuizProgress(questionIds, undefined, revisions)
    progress.value.currentQuestionId = selectNextQuestion(progress.value, questionIds)
    resetAnswer()
    saveLocal()
    if (auth.value.user) {
      try {
        await $fetch(`/api/quiz/${options.quizId}`, { method: 'DELETE' })
        syncState.value = 'synced'
      } catch {
        syncState.value = 'error'
      }
    }
  }

  async function signOut() {
    await $fetch('/api/quiz/logout', { method: 'POST' })
    auth.value.user = null
    syncState.value = 'local'
  }

  onMounted(async () => {
    const raw = localStorage.getItem(options.storageKey)
    if (raw) {
      try { progress.value = normalizeQuizProgress(JSON.parse(raw), questionIds, revisions) } catch { /* ignore malformed local data */ }
    } else if (options.legacyStorageKey) {
      const legacy = localStorage.getItem(options.legacyStorageKey)
      if (legacy) {
        try { progress.value = migrateLegacyQuizProgress(JSON.parse(legacy), questionIds, revisions) } catch { /* ignore malformed legacy data */ }
      }
    }
    ensureFreshQuestion()
    ready.value = true
    saveLocal()
    await refreshAuthAndSync()
  })

  onBeforeUnmount(() => clearTimeout(syncTimer))

  return {
    auth, checked, chooseNext, complete, currentQuestion, currentStats, hasAnswer,
    history, percentage, progress, ready, resetProgress, selected, signOut, submit,
    syncState, textAnswer, toggleOption, totals, wasCorrect, wasReview,
  }
}
