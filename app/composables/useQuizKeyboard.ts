import type { Ref } from 'vue'
import type { QuizQuestion } from '#shared/types/quiz'

interface QuizKeyboardOptions {
  checked: Readonly<Ref<boolean>>
  complete: Readonly<Ref<boolean>>
  hasAnswer: Readonly<Ref<boolean>>
  optionOrder: Readonly<Ref<number[]>>
  question: Readonly<Ref<QuizQuestion | null>>
  selected: Readonly<Ref<number[]>>
  next: () => void
  submit: () => void
  toggleExplanation: (index: number) => void
  toggleOption: (index: number, enabled: boolean) => void
}

export function useQuizKeyboard(options: QuizKeyboardOptions) {
  function handleKey(event: KeyboardEvent) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
    const question = options.question.value
    if (!question || options.complete.value) return

    if (/^[1-9]$/.test(event.key) && question.type !== 'text') {
      const optionIndex = options.optionOrder.value[Number(event.key) - 1]
      if (optionIndex === undefined) return
      event.preventDefault()
      if (options.checked.value) {
        if (question.options?.[optionIndex]?.explanation) options.toggleExplanation(optionIndex)
      } else {
        const enabled = question.type === 'single'
          || !options.selected.value.includes(optionIndex)
        options.toggleOption(optionIndex, enabled)
      }
      return
    }

    if (event.key !== 'Enter' || event.target instanceof HTMLButtonElement) return
    if (!options.checked.value && question.type === 'text') return
    event.preventDefault()
    if (options.checked.value) options.next()
    else if (options.hasAnswer.value) options.submit()
  }

  onMounted(() => window.addEventListener('keydown', handleKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))
}
