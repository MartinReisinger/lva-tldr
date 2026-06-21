<script setup lang="ts">
type Variant = 'basics' | 'power' | 'oracle' | 'optimized' | 'complement' | 'product'

const props = defineProps<{ variant: Variant }>()
const transformed = ref(false)

const titles: Record<Variant, string> = {
  basics: 'Example: deterministic and complete',
  power: 'Example: power automaton',
  oracle: 'Example: oracle labels',
  optimized: 'Example: optimized oracle labels',
  complement: 'Example: complement',
  product: 'Example: product states',
}

const labels = computed(() => {
  if (props.variant === 'power' && transformed.value) return ['{A}', '{A,B}', '∅']
  if (props.variant === 'product') return ['A1', 'B2', 'B1']
  return ['A', 'B', 'C']
})

const edgeLabels = computed(() => {
  if (props.variant === 'oracle') return ['a/1', 'a/2']
  if (props.variant === 'optimized') return ['a/0', 'a/1']
  return ['a', 'b']
})

const finalIndex = computed(() => {
  if (props.variant === 'complement' && transformed.value) return 0
  return 1
})
</script>

<template>
  <ExampleBlock :title="titles[variant]">
    <div v-if="variant === 'power' || variant === 'complement'" class="mb-4 flex gap-2">
      <UButton
        :variant="!transformed ? 'solid' : 'outline'"
        size="xs"
        label="Original"
        @click="transformed = false"
      />
      <UButton
        :variant="transformed ? 'solid' : 'outline'"
        size="xs"
        :label="variant === 'power' ? 'Power automaton' : 'Complement'"
        @click="transformed = true"
      />
    </div>

    <svg
      viewBox="0 0 440 150"
      class="w-full max-w-xl text-highlighted"
      role="img"
      :aria-label="titles[variant]"
    >
      <title>{{ titles[variant] }}</title>
      <defs>
        <marker :id="`automata-arrow-${variant}`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
        </marker>
      </defs>
      <path d="M18 75H75" stroke="currentColor" fill="none" :marker-end="`url(#automata-arrow-${variant})`" />
      <path d="M125 75H205" stroke="currentColor" fill="none" :marker-end="`url(#automata-arrow-${variant})`" />
      <path d="M255 75H335" stroke="currentColor" fill="none" :marker-end="`url(#automata-arrow-${variant})`" />
      <path d="M100 48C75 10 130 10 105 48" stroke="currentColor" fill="none" :marker-end="`url(#automata-arrow-${variant})`" />
      <text x="165" y="64" text-anchor="middle" fill="currentColor" font-size="14">{{ edgeLabels[0] }}</text>
      <text x="295" y="64" text-anchor="middle" fill="currentColor" font-size="14">{{ edgeLabels[1] }}</text>
      <text x="100" y="17" text-anchor="middle" fill="currentColor" font-size="14">b</text>

      <g v-for="(label, index) in labels" :key="label" :transform="`translate(${100 + index * 130} 75)`">
        <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
        <circle v-if="index === finalIndex" r="20" fill="none" stroke="currentColor" stroke-width="2" />
        <text y="5" text-anchor="middle" fill="currentColor" font-size="14">{{ label }}</text>
      </g>
    </svg>

    <div v-if="variant === 'basics'" class="mt-3 flex flex-wrap gap-2 text-sm">
      <UBadge color="success" variant="subtle">Deterministic: one target per symbol</UBadge>
      <UBadge color="success" variant="subtle">Complete: a and b exist at every state</UBadge>
    </div>
    <p v-else-if="variant === 'power'" class="mt-3 text-sm text-muted">
      Each state is a set of original states. The empty set is the sink for missing transitions.
    </p>
    <p v-else-if="variant === 'complement'" class="mt-3 text-sm text-muted">
      The transition graph stays the same; accepting and rejecting states swap.
    </p>
    <p v-else-if="variant === 'product'" class="mt-3 text-sm text-muted">
      Product states pair one state from each original automaton and advance together.
    </p>
    <p v-else class="mt-3 text-sm text-muted">
      The oracle index selects one of the possible targets. Optimization reuses the smallest local index set.
    </p>
  </ExampleBlock>
</template>
