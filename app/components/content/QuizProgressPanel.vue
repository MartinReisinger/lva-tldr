<script setup lang="ts">
import type { QuizProgress, QuizQuestion } from '#shared/types/quiz'
import { quizQuestionQueue } from '#shared/utils/spacedQuiz'

const props = defineProps<{
  questions: QuizQuestion[]
  progress: QuizProgress
  syncState: 'local' | 'syncing' | 'synced' | 'error'
  auth: {
    enabled: boolean
    user: null | { name: string, email: string, avatar?: string }
  }
}>()

const emit = defineEmits<{ reset: [], shuffle: [], signOut: [] }>()
const byId = computed(() => new Map(props.questions.map(question => [question.id, question])))
const orderedQuestions = computed(() => quizQuestionQueue(
  props.progress,
  props.questions.map(question => question.id),
).map(id => byId.value.get(id)).filter((question): question is QuizQuestion => Boolean(question)))
const unseenCount = computed(() => props.questions.filter(question =>
  props.progress.stats[question.id]?.attempts === 0
    && question.id !== props.progress.currentQuestionId,
).length)

function status(question: QuizQuestion) {
  const record = props.progress.stats[question.id]
  if (!record) return 'Not started'
  if (record.completed) return 'Completed'
  if (record.streak === 1) return '1/2 correct'
  return record.attempts ? 'Needs retry' : 'Not started'
}

function statusClass(question: QuizQuestion) {
  const record = props.progress.stats[question.id]
  if (!record) return 'text-muted'
  if (record.completed) return 'text-success'
  if (record.streak === 1) return 'text-primary'
  if (record.wrong) return 'text-error'
  return 'text-muted'
}
</script>

<template>
  <aside class="space-y-4">
    <UCard>
      <div class="flex items-center gap-3">
        <UAvatar
          v-if="auth.user"
          :src="auth.user.avatar"
          :alt="auth.user.name"
          size="sm"
        />
        <UIcon v-else name="i-lucide-hard-drive" class="size-5 text-primary" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-highlighted">
            {{ auth.user?.name ?? 'Saved on this device' }}
          </p>
          <p class="truncate text-xs text-muted">
            <template v-if="auth.user">
              {{ syncState === 'syncing' ? 'Syncing…' : syncState === 'error' ? 'Sync failed; local copy is safe' : 'Synced with Google' }}
            </template>
            <template v-else>Anonymous local progress</template>
          </p>
        </div>
      </div>
      <div class="mt-4">
        <UButton
          v-if="auth.enabled && !auth.user"
          to="/auth/google"
          external
          block
          color="neutral"
          icon="i-lucide-log-in"
          label="Sign in with Google"
          variant="outline"
        />
        <UButton
          v-else-if="auth.user"
          block
          color="neutral"
          label="Sign out"
          variant="ghost"
          @click="emit('signOut')"
        />
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-sm font-semibold text-highlighted">Question order</h2>
          <p class="mt-0.5 text-xs text-muted">Current question, then the upcoming queue</p>
        </div>
        <UTooltip text="Shuffle questions you have not seen yet">
          <UButton
            aria-label="Shuffle unseen questions"
            color="neutral"
            icon="i-lucide-shuffle"
            size="xs"
            square
            variant="ghost"
            :disabled="unseenCount < 2"
            @click="emit('shuffle')"
          />
        </UTooltip>
      </div>
      <div class="mt-3 max-h-[30rem] space-y-1 overflow-y-auto pr-1">
        <div
          v-for="(question, index) in orderedQuestions"
          :key="question.id"
          class="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-xs"
          :class="question.id === progress.currentQuestionId ? 'bg-primary/10' : ''"
        >
          <span class="flex min-w-0 items-center gap-2 font-medium text-toned">
            <span class="w-5 text-right tabular-nums text-dimmed">{{ index + 1 }}</span>
            <span>Q{{ question.id }}</span>
          </span>
          <span v-if="question.id === progress.currentQuestionId" class="text-primary">Now</span>
          <span v-else :class="statusClass(question)">{{ status(question) }}</span>
        </div>
      </div>
    </UCard>

    <UButton
      block
      color="error"
      icon="i-lucide-trash-2"
      label="Reset quiz progress"
      variant="soft"
      @click="emit('reset')"
    />
  </aside>
</template>
