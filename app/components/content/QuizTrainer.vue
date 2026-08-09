<script setup lang="ts">
const props = defineProps<{ quizId: string }>()

const { data: bank } = await useAsyncData(`quiz-bank:${props.quizId}`, () =>
  queryCollection('quizzes').where('quizId', '=', props.quizId).first(),
)
</script>

<template>
  <QuizSession
    v-if="bank"
    :quiz-id="bank.quizId"
    :questions="bank.questions"
  />
  <UAlert
    v-else
    color="error"
    icon="i-lucide-circle-alert"
    title="Quiz unavailable"
    description="The requested question bank could not be loaded."
  />
</template>
