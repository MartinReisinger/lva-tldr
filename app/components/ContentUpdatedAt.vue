<script setup lang="ts">
const props = defineProps<{ value: string }>()
const locale = useLocale()

const label = computed(() =>
  locale.value === 'de' ? 'Zuletzt aktualisiert' : 'Last updated',
)

const formattedValue = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'de' ? 'de-AT' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Vienna',
  }).format(new Date(props.value)),
)
</script>

<template>
  <footer class="mt-16 border-t border-default/60 pt-4 text-right text-xs text-dimmed">
    {{ label }}:
    <time :datetime="value">{{ formattedValue }}</time>
  </footer>
</template>
