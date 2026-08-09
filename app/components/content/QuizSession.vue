<script setup lang="ts">
import type { QuizQuestion } from '#shared/types/quiz'

const props = defineProps<{ quizId: string, questions: QuizQuestion[] }>()
const route = useRoute()
const introStorageKey = `${props.quizId}-quiz-intro-v1`
const showIntro = ref(false)
const expandedExplanations = ref<number[]>([])
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
  next: quiz.chooseNext,
  optionOrder: quiz.optionOrder,
  question: quiz.currentQuestion,
  selected: quiz.selected,
  submit: () => quiz.submit(false),
  toggleExplanation: setExplanation,
  toggleOption: quiz.toggleOption,
})

onMounted(() => {
  showIntro.value = localStorage.getItem(introStorageKey) !== 'seen'
})

function dismissIntro() {
  showIntro.value = false
  localStorage.setItem(introStorageKey, 'seen')
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

  <div v-else class="not-prose">
    <UAlert
      v-if="route.query.login === 'failed'"
      class="mb-4"
      color="error"
      icon="i-lucide-circle-alert"
      title="Google sign-in failed"
      description="Your local quiz progress is unchanged."
    />

    <div v-if="showIntro" class="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-repeat-2" class="mt-0.5 size-5 shrink-0 text-primary" />
        <div class="min-w-0 flex-1">
          <p class="font-medium text-highlighted">Two correct answers, spaced apart</p>
          <p class="mt-1 text-sm leading-relaxed text-muted">
            Answer a question correctly twice without getting it wrong in between to complete it.
            The same question never returns until you have submitted five different questions.
            Questions still waiting for their first correct answer come first.
          </p>
          <UButton class="mt-3" label="Got it" size="xs" @click="dismissIntro" />
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="mb-2 flex items-center justify-between gap-3 text-xs text-muted">
        <span>Learning progress</span>
        <div class="flex items-center gap-3">
          <UButton
            color="neutral"
            label="How it works"
            size="xs"
            variant="link"
            @click="showIntro = true"
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

    <div class="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <UCard class="min-w-0">
        <div v-if="quiz.complete.value" class="py-10 text-center">
          <UIcon name="i-lucide-trophy" class="mx-auto size-10 text-primary" />
          <h2 class="mt-4 text-2xl font-semibold text-highlighted">Quiz completed</h2>
          <p class="mx-auto mt-2 max-w-md text-muted">
            Every question was answered correctly twice with the required spacing.
          </p>
        </div>

        <form v-else-if="quiz.currentQuestion.value" @submit.prevent="quiz.submit(false)">
          <div class="mb-5 flex flex-wrap items-center justify-between gap-2">
            <UBadge color="neutral" variant="outline">
              Question {{ quiz.currentQuestion.value.id }}
            </UBadge>
            <span class="text-xs font-medium text-muted">{{ stageLabel }}</span>
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

          <div class="mt-6 flex flex-wrap gap-2">
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
              @click="quiz.chooseNext"
            />
          </div>
        </form>
      </UCard>

      <QuizProgressPanel
        :questions="questions"
        :progress="quiz.progress.value"
        :can-shuffle="quiz.canShuffle.value"
        :auth="quiz.auth.value"
        :sync-state="quiz.syncState.value"
        @reset="resetProgress"
        @shuffle="quiz.shuffleUnseen"
        @sign-out="quiz.signOut"
      />
    </div>
  </div>
</template>
