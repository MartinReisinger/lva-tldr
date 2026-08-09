<script setup lang="ts">
import type { QuizQuestion } from '../../../shared/types/quiz'

const props = defineProps<{
  question: QuizQuestion
  selected: number[]
  textAnswer: string
  checked: boolean
}>()

const emit = defineEmits<{
  toggle: [index: number, enabled: boolean]
  'update:textAnswer': [value: string]
}>()

function optionState(index: number) {
  const option = props.question.options?.[index]
  if (!props.checked || !option) return ''
  if (option.correct) return 'border-success bg-success/10'
  if (props.selected.includes(index)) return 'border-error bg-error/10'
  return 'opacity-70'
}
</script>

<template>
  <div>
    <p class="text-lg font-semibold leading-relaxed text-highlighted sm:text-xl">
      {{ question.question }}
    </p>

    <div v-if="question.type === 'text'" class="mt-5">
      <UInput
        :model-value="textAnswer"
        :disabled="checked"
        autocomplete="off"
        class="w-full"
        placeholder="Type your answer…"
        size="xl"
        @update:model-value="emit('update:textAnswer', String($event))"
      />
      <div
        v-if="checked"
        class="mt-3 rounded-lg border border-default bg-muted/40 p-4 text-sm leading-relaxed"
      >
        <p><strong>Correct answer:</strong> {{ question.answer }}</p>
        <p v-if="question.reason" class="mt-1 text-muted">{{ question.reason }}</p>
      </div>
    </div>

    <div v-else class="mt-5 space-y-3">
      <label
        v-for="(option, index) in question.options"
        :key="index"
        class="block rounded-xl border border-default bg-default p-4 transition-colors"
        :class="[
          optionState(index),
          checked ? 'cursor-default' : 'cursor-pointer hover:border-primary',
        ]"
      >
        <span class="flex items-start gap-3">
          <input
            :type="question.type === 'single' ? 'radio' : 'checkbox'"
            name="quiz-answer"
            class="mt-1 size-4 shrink-0 accent-primary"
            :checked="selected.includes(index)"
            :disabled="checked"
            @change="emit('toggle', index, ($event.target as HTMLInputElement).checked)"
          >
          <span class="min-w-0 flex-1 leading-relaxed">{{ option.text }}</span>
          <UIcon
            v-if="checked && option.correct"
            name="i-lucide-circle-check"
            class="mt-0.5 size-5 shrink-0 text-success"
          />
          <UIcon
            v-else-if="checked && selected.includes(index)"
            name="i-lucide-circle-x"
            class="mt-0.5 size-5 shrink-0 text-error"
          />
        </span>
        <details v-if="checked && option.explanation" class="mt-3 pl-7 text-sm text-muted">
          <summary class="cursor-pointer font-medium text-toned">Explanation</summary>
          <p class="mt-2 leading-relaxed">{{ option.explanation }}</p>
        </details>
      </label>
      <p v-if="question.type === 'multiple'" class="text-sm text-muted">
        Select every correct answer.
      </p>
    </div>
  </div>
</template>
