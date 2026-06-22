<script setup lang="ts">
const props = withDefaults(
  defineProps<{ title?: string, collapsedLabel?: string }>(),
  { title: 'Example', collapsedLabel: undefined },
)
const open = ref(false)
</script>

<template>
  <div class="my-4 flex flex-col gap-2">
    <UButton
      :label="open ? `Hide ${props.title.toLowerCase()}` : (props.collapsedLabel ?? props.title)"
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
