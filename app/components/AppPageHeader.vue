<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
  icon?: string
  backTo?: string
  backLabel?: string
}>()

defineSlots<{
  links(): unknown
}>()
</script>

<template>
  <NuxtLink
    v-if="backTo && backLabel"
    :to="backTo"
    class="mb-1 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-highlighted"
  >
    <UIcon name="i-lucide-arrow-left" class="size-4" />
    {{ backLabel }}
  </NuxtLink>

  <UPageHeader
    :title="title"
    :description="description"
    :ui="{
      root: 'py-5 sm:py-6',
      wrapper: 'gap-3',
      headline: 'mb-2',
      description: 'mt-3',
      links: 'gap-2',
    }"
  >
    <template v-if="eyebrow" #headline>
      <UIcon v-if="icon" :name="icon" class="size-4" />
      {{ eyebrow }}
    </template>

    <template v-if="$slots.links" #links>
      <slot name="links" />
    </template>
  </UPageHeader>
</template>
