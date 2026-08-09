<script setup lang="ts">
import type { QuizQuestion } from '#shared/types/quiz'

const props = defineProps<{ quizId: string, questions: QuizQuestion[] }>()
const route = useRoute()
const onboardingStorageKey = `${props.quizId}-quiz-onboarding-v1`
const showOnboarding = ref(false)
const expandedExplanations = ref<number[]>([])
const focusMode = ref(false)
const focusPanel = useTemplateRef<HTMLElement>('focusPanel')
const quiz = useSpacedQuiz({
  questions: props.questions,
  quizId: props.quizId,
  storageKey: `${props.quizId}-quiz-progress-v2`,
  legacyStorageKey: props.quizId === 'computer-graphics'
    ? 'cg-altklausur-quiz-progress-v1'
    : undefined,
})

const stageLabel = computed(() => {
  if (quiz.currentStats.value?.completed) return 'Review question'
  if (quiz.currentStats.value?.streak === 1) return 'One more correct answer'
  if (quiz.currentStats.value?.attempts) return 'Try again'
  return 'New question'
})

const feedback = computed(() => {
  if (quiz.wasReview.value) {
    return quiz.wasCorrect.value
      ? 'Correct—nice work!'
      : 'Not quite. Take a look at the explanation below.'
  }
  if (!quiz.wasCorrect.value) return 'Not quite. Review the explanation below and try again when this question returns.'
  if (quiz.currentStats.value?.completed) return 'Correct again—nice work! You\'ve completed this question.'
  return 'Correct! You\'ll see this question again later to make sure it sticks.'
})

watch(() => quiz.currentQuestion.value?.id, () => {
  expandedExplanations.value = []
})

watch(focusMode, (isFocused) => {
  if (!import.meta.client) return
  document.body.classList.toggle('overflow-hidden', isFocused)
})

function setExplanation(index: number, open?: boolean) {
  const expanded = expandedExplanations.value.includes(index)
  const shouldOpen = open ?? !expanded
  expandedExplanations.value = shouldOpen
    ? [...new Set([...expandedExplanations.value, index])]
    : expandedExplanations.value.filter(value => value !== index)
}

useQuizKeyboard({
  checked: quiz.checked,
  complete: quiz.complete,
  hasAnswer: quiz.hasAnswer,
  next: advanceQuestion,
  optionOrder: quiz.optionOrder,
  question: quiz.currentQuestion,
  selected: quiz.selected,
  submit: () => quiz.submit(false),
  toggleExplanation: setExplanation,
  toggleOption: quiz.toggleOption,
})

onMounted(() => {
  showOnboarding.value = localStorage.getItem(onboardingStorageKey) !== 'seen'
  window.addEventListener('keydown', handleFocusModeKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleFocusModeKey)
  document.body.classList.remove('overflow-hidden')
})

function dismissOnboarding() {
  showOnboarding.value = false
  localStorage.setItem(onboardingStorageKey, 'seen')
}

function enterFocusMode() {
  focusMode.value = true
  nextTick(() => focusPanel.value?.scrollTo({ top: 0 }))
}

function exitFocusMode() {
  focusMode.value = false
}

function handleFocusModeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && focusMode.value) exitFocusMode()
}

function advanceQuestion() {
  quiz.chooseNext()
  nextTick(() => focusPanel.value?.scrollTo({ top: 0, behavior: 'smooth' }))
}

async function resetProgress() {
  if (!window.confirm('Reset all progress for this quiz? This also deletes the synced copy.')) return
  await quiz.resetProgress()
}
</script>

<template>
  <div v-if="!quiz.ready.value" class="py-12 text-center text-muted">
    <UIcon name="i-lucide-loader-circle" class="mx-auto size-6 animate-spin" />
    <p class="mt-2 text-sm">Loading quiz progress…</p>
  </div>

  <div
    v-else
    ref="focusPanel"
    class="not-prose"
    :class="focusMode
      ? 'fixed inset-0 z-[60] flex min-h-dvh items-center justify-center overflow-y-auto bg-default p-3 sm:p-6'
      : ''"
  >
    <UAlert
      v-if="!focusMode && route.query.login === 'failed'"
      class="mb-4"
      color="error"
      icon="i-lucide-circle-alert"
      title="Google sign-in failed"
      description="Your local quiz progress is unchanged."
    />

    <QuizOnboarding
      v-if="!focusMode && showOnboarding"
      :auth="quiz.auth.value"
      :sync-state="quiz.syncState.value"
      @dismiss="dismissOnboarding"
      @sign-out="quiz.signOut"
    />

    <div v-if="!focusMode" class="mb-6">
      <div class="mb-2 flex items-center justify-between gap-3 text-xs text-muted">
        <span>Learning progress</span>
        <div class="flex items-center gap-3">
          <UButton
            color="neutral"
            label="How it works"
            size="xs"
            variant="link"
            @click="showOnboarding = true"
          />
          <span>{{ quiz.percentage.value }}%</span>
        </div>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-muted">
        <div
          class="h-full rounded-full bg-primary transition-[width] duration-300"
          :style="{ width: `${quiz.percentage.value}%` }"
        />
      </div>
    </div>

    <div :class="focusMode ? 'mx-auto w-full max-w-3xl' : 'grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]'">
      <UCard :class="focusMode ? 'min-w-0 shadow-xl' : 'min-w-0'">
        <div v-if="quiz.complete.value" class="py-10 text-center">
          <UIcon name="i-lucide-trophy" class="mx-auto size-10 text-primary" />
          <h2 class="mt-4 text-2xl font-semibold text-highlighted">Quiz completed</h2>
          <p class="mx-auto mt-2 max-w-md text-muted">
            Every question was answered correctly twice with the required spacing.
          </p>
          <UButton
            v-if="focusMode"
            class="mt-5"
            color="neutral"
            icon="i-lucide-minimize-2"
            label="Exit focus mode"
            variant="outline"
            @click="exitFocusMode"
          />
        </div>

        <form v-else-if="quiz.currentQuestion.value" @submit.prevent="quiz.submit(false)">
          <div class="mb-5 flex flex-wrap items-center justify-between gap-2">
            <UBadge color="neutral" variant="outline">
              Question {{ quiz.currentQuestion.value.id }}
            </UBadge>
            <div class="flex items-center gap-1">
              <span class="text-xs font-medium text-muted">{{ stageLabel }}</span>
              <UTooltip v-if="!focusMode" text="Focus on the quiz">
                <UButton
                  aria-label="Enter focus mode"
                  color="neutral"
                  icon="i-lucide-maximize-2"
                  size="xs"
                  square
                  variant="ghost"
                  @click="enterFocusMode"
                />
              </UTooltip>
              <UButton
                v-else
                aria-label="Exit focus mode"
                color="neutral"
                icon="i-lucide-minimize-2"
                label="Exit"
                size="xs"
                variant="ghost"
                @click="exitFocusMode"
              />
            </div>
          </div>

          <QuizQuestion
            :question="quiz.currentQuestion.value"
            :selected="quiz.selected.value"
            :option-order="quiz.optionOrder.value"
            :expanded-explanations="expandedExplanations"
            :text-answer="quiz.textAnswer.value"
            :checked="quiz.checked.value"
            @toggle-explanation="setExplanation"
            @toggle="quiz.toggleOption"
            @update:text-answer="quiz.textAnswer.value = $event"
          />

          <div
            v-if="quiz.checked.value"
            class="mt-5 rounded-lg border p-4 text-sm leading-relaxed"
            :class="quiz.wasCorrect.value
              ? 'border-success/50 bg-success/10 text-success'
              : 'border-error/50 bg-error/10 text-error'"
            role="status"
          >
            {{ feedback }}
          </div>

          <div
            class="mt-6 flex flex-wrap gap-2"
            :class="focusMode ? 'sticky bottom-0 border-t border-default bg-default/95 py-4 backdrop-blur' : ''"
          >
            <UButton
              v-if="!quiz.checked.value"
              type="submit"
              icon="i-lucide-check"
              label="Check answer"
              :disabled="!quiz.hasAnswer.value"
            />
            <UTooltip v-if="!quiz.checked.value" text="Counts as a wrong submission">
              <UButton
                type="button"
                color="neutral"
                label="Show solution"
                variant="outline"
                @click="quiz.submit(true)"
              />
            </UTooltip>
            <UButton
              v-else
              type="button"
              trailing-icon="i-lucide-arrow-right"
              label="Next question"
              @click="advanceQuestion"
            />
          </div>
        </form>
      </UCard>

      <QuizProgressPanel
        v-if="!focusMode"
        :questions="questions"
        :progress="quiz.progress.value"
        :can-shuffle="quiz.canShuffle.value"
        @reset="resetProgress"
        @shuffle="quiz.shuffleUnseen"
      />
    </div>
  </div>
</template>
