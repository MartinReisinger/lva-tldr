<script setup lang="ts">
import type { QuizQuestion } from '../../../shared/types/quiz'

const props = defineProps<{ quizId: string, questions: QuizQuestion[] }>()
const route = useRoute()
const quiz = useSpacedQuiz({
  questions: props.questions,
  quizId: props.quizId,
  storageKey: `${props.quizId}-quiz-progress-v2`,
  legacyStorageKey: props.quizId === 'computer-graphics'
    ? 'cg-altklausur-quiz-progress-v1'
    : undefined,
})

const stageLabel = computed(() => {
  if (quiz.currentStats.value?.completed) return 'Spacing review'
  if (quiz.currentStats.value?.streak === 1) return 'Second correct answer needed'
  if (quiz.currentStats.value?.attempts) return 'Retry · streak 0/2'
  return 'First attempt'
})

const feedback = computed(() => {
  if (quiz.wasReview.value) {
    return quiz.wasCorrect.value
      ? 'Correct. This completed question filled one spacing position.'
      : 'That review was wrong, but the question remains completed.'
  }
  if (!quiz.wasCorrect.value) return 'Not quite. The streak is back to 0/2; review the answer explanations below.'
  if (quiz.currentStats.value?.completed) return 'Correct again—this question is now completed.'
  return 'Correct. The streak is 1/2; at least five different questions will appear before this one returns.'
})

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

    <div class="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-repeat-2" class="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p class="font-medium text-highlighted">Two correct answers, spaced apart</p>
          <p class="mt-1 text-sm leading-relaxed text-muted">
            A question is completed after two correct submissions in a row for that question.
            At least five different questions appear between attempts; a wrong answer resets the streak.
          </p>
        </div>
      </div>
    </div>

    <div class="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-lg border border-default bg-muted/30 p-3">
        <p class="text-xs text-muted">Completed</p>
        <p class="mt-1 font-semibold text-highlighted">{{ quiz.totals.value.completed }}/{{ questions.length }}</p>
      </div>
      <div class="rounded-lg border border-default bg-muted/30 p-3">
        <p class="text-xs text-muted">Current streak</p>
        <p class="mt-1 font-semibold text-primary">{{ quiz.currentStats.value?.streak ?? 0 }}/2</p>
      </div>
      <div class="rounded-lg border border-success/40 bg-success/5 p-3">
        <p class="text-xs text-muted">Correct</p>
        <p class="mt-1 font-semibold text-success">{{ quiz.totals.value.correct }}</p>
      </div>
      <div class="rounded-lg border border-error/40 bg-error/5 p-3">
        <p class="text-xs text-muted">Wrong</p>
        <p class="mt-1 font-semibold text-error">{{ quiz.totals.value.wrong }}</p>
      </div>
    </div>

    <div class="mb-6">
      <div class="mb-2 flex justify-between text-xs text-muted">
        <span>Mastery progress</span>
        <span>{{ quiz.percentage.value }}%</span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-muted">
        <div
          class="h-full rounded-full bg-primary transition-[width] duration-300"
          :style="{ width: `${quiz.percentage.value}%` }"
        />
      </div>
    </div>

    <div class="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]">
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
            :text-answer="quiz.textAnswer.value"
            :checked="quiz.checked.value"
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
            <UButton
              v-if="!quiz.checked.value"
              type="button"
              color="neutral"
              label="Show solution"
              variant="outline"
              @click="quiz.submit(true)"
            />
            <UButton
              v-else
              type="button"
              trailing-icon="i-lucide-arrow-right"
              label="Next question"
              @click="quiz.chooseNext"
            />
          </div>
          <p v-if="!quiz.checked.value" class="mt-2 text-xs text-muted">
            Showing the solution counts as a wrong submission.
          </p>
        </form>
      </UCard>

      <QuizProgressPanel
        :questions="questions"
        :progress="quiz.progress.value"
        :auth="quiz.auth.value"
        :sync-state="quiz.syncState.value"
        @reset="resetProgress"
        @sign-out="quiz.signOut"
      />
    </div>
  </div>
</template>
