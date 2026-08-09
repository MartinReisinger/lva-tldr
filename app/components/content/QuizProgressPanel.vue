<script setup lang="ts">
import type { QuizProgress, QuizQuestion } from '../../../shared/types/quiz'

const props = defineProps<{
  questions: QuizQuestion[]
  progress: QuizProgress
  syncState: 'local' | 'syncing' | 'synced' | 'error'
  auth: {
    enabled: boolean
    user: null | { name: string, email: string, avatar?: string }
  }
}>()

const emit = defineEmits<{ reset: [], signOut: [] }>()

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
        <h2 class="text-sm font-semibold text-highlighted">Question progress</h2>
        <span class="text-xs text-muted">{{ questions.length }} questions</span>
      </div>
      <div class="mt-3 max-h-[30rem] space-y-1 overflow-y-auto pr-1">
        <div
          v-for="question in questions"
          :key="question.id"
          class="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-xs"
          :class="question.id === progress.currentQuestionId ? 'bg-primary/10' : ''"
        >
          <span class="font-medium text-toned">Q{{ question.id }}</span>
          <span :class="statusClass(question)">{{ status(question) }}</span>
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
