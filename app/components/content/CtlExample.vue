<script setup lang="ts">
import { ctlFormulas } from '~/utils/ctl'

type Variant = 'operators' | 'equivalences'
const props = defineProps<{ variant: Variant }>()
const selected = ref(0)
const current = computed(() => ctlFormulas[selected.value]!)
</script>

<template>
  <ExampleBlock :title="variant === 'operators' ? 'Example: CTL state highlighting' : 'Example: equivalence'">
    <template v-if="variant === 'operators'">
      <div class="mb-4 flex flex-wrap gap-2">
        <UButton
          v-for="(item, index) in ctlFormulas"
          :key="item.formula"
          size="xs"
          :variant="selected === index ? 'solid' : 'outline'"
          :label="item.formula"
          @click="selected = index"
        />
      </div>

      <svg viewBox="0 0 380 180" class="w-full max-w-lg text-highlighted" role="img" :aria-label="`${current.formula}: states ${current.states.join(', ')}`">
        <title>{{ current.formula }} holds in states {{ current.states.join(', ') }}</title>
        <defs><marker id="ctl-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="currentColor" /></marker></defs>
        <path d="M115 70H175M225 70L285 110M305 95V45" stroke="currentColor" fill="none" marker-end="url(#ctl-arrow)" />
        <g v-for="state in [{ id: 1, x: 85, y: 70, label: '{p}' }, { id: 2, x: 200, y: 70, label: '{}' }, { id: 3, x: 310, y: 125, label: '{p,q}' }]" :key="state.id">
          <circle :cx="state.x" :cy="state.y" r="27" :fill="current.states.includes(state.id) ? 'var(--ui-primary)' : 'var(--ui-bg)'" stroke="currentColor" stroke-width="2" />
          <text :x="state.x" :y="state.y + 5" text-anchor="middle" :fill="current.states.includes(state.id) ? 'var(--ui-text-inverted)' : 'currentColor'">{{ state.id }}</text>
          <text :x="state.x" :y="state.y + 45" text-anchor="middle" fill="currentColor" font-size="13">{{ state.label }}</text>
        </g>
      </svg>
      <p class="mt-3 text-sm text-muted">{{ current.note }}</p>
    </template>

    <div v-else class="grid gap-3 sm:grid-cols-2">
      <code class="rounded bg-elevated px-3 py-2">AG φ</code>
      <code class="rounded bg-elevated px-3 py-2 text-primary">¬EF(¬φ)</code>
    </div>
  </ExampleBlock>
</template>
