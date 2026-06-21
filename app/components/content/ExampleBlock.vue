<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: 'Example' })
const open = ref(false)
</script>

<template>
  <div class="my-4 flex flex-col gap-2">
    <UButton
      :label="open ? `Hide ${title.toLowerCase()}` : title"
      color="primary"
      variant="soft"
      size="sm"
      class="w-fit group"
      trailing-icon="i-lucide-chevron-down"
      :ui="{ trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200' }"
      :aria-expanded="open"
      @click="open = !open"
    />

    <div v-if="open" class="rounded-lg border border-default bg-muted/40 p-4 sm:p-5">
      <slot />
    </div>
  </div>
</template>
