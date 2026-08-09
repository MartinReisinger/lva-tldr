<script setup lang="ts">
import type { QuizQuestion } from '#shared/types/quiz'

const props = defineProps<{
  question: QuizQuestion
  selected: number[]
  optionOrder: number[]
  expandedExplanations: number[]
  textAnswer: string
  checked: boolean
}>()

const emit = defineEmits<{
  toggle: [index: number, enabled: boolean]
  'toggleExplanation': [index: number, open?: boolean]
  'update:textAnswer': [value: string]
}>()

const textInput = useTemplateRef<{ inputRef: HTMLInputElement | null }>('textInput')

function optionState(index: number) {
  const option = props.question.options?.[index]
  if (!props.checked || !option) return ''
  if (option.correct) return 'border-success bg-success/10'
  if (props.selected.includes(index)) return 'border-error bg-error/10'
  return 'opacity-70'
}

const orderedOptions = computed(() => {
  const options = props.question.options ?? []
  const order = props.optionOrder.length === options.length
    ? props.optionOrder
    : options.map((_, index) => index)
  return order.map(index => ({ index, option: options[index]! }))
})

watch(() => props.question.id, async () => {
  await nextTick()
  textInput.value?.inputRef?.focus()
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div>
    <p class="text-lg font-semibold leading-relaxed text-highlighted sm:text-xl">
      {{ question.question }}
    </p>

    <div v-if="question.type === 'text'" class="mt-5">
      <UInput
        ref="textInput"
        :model-value="textAnswer"
        :disabled="checked"
        autofocus
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
        v-for="(entry, displayIndex) in orderedOptions"
        :key="entry.index"
        class="block rounded-xl border border-default bg-default p-4 transition-colors"
        :class="[
          optionState(entry.index),
          checked ? 'cursor-default' : 'cursor-pointer hover:border-primary',
        ]"
      >
        <span class="flex items-start gap-3">
          <input
            :type="question.type === 'single' ? 'radio' : 'checkbox'"
            name="quiz-answer"
            class="mt-1 size-4 shrink-0 accent-primary"
            :checked="selected.includes(entry.index)"
            :disabled="checked"
            @change="emit('toggle', entry.index, ($event.target as HTMLInputElement).checked)"
          >
          <span class="min-w-0 flex-1 leading-relaxed">{{ entry.option.text }}</span>
          <UKbd :value="String(displayIndex + 1)" />
          <UIcon
            v-if="checked && entry.option.correct"
            name="i-lucide-circle-check"
            class="mt-0.5 size-5 shrink-0 text-success"
          />
          <UIcon
            v-else-if="checked && selected.includes(entry.index)"
            name="i-lucide-circle-x"
            class="mt-0.5 size-5 shrink-0 text-error"
          />
        </span>
        <details
          v-if="checked && entry.option.explanation"
          class="mt-3 pl-7 text-sm text-muted"
          :open="expandedExplanations.includes(entry.index)"
          @toggle="emit(
            'toggleExplanation',
            entry.index,
            ($event.target as HTMLDetailsElement).open,
          )"
        >
          <summary class="cursor-pointer font-medium text-toned">Explanation</summary>
          <p class="mt-2 leading-relaxed">{{ entry.option.explanation }}</p>
        </details>
      </label>
      <p v-if="question.type === 'multiple'" class="text-sm text-muted">
        Select every correct answer.
      </p>
    </div>
  </div>
</template>
