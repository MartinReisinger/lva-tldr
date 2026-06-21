<script setup lang="ts">
type Variant = 'moore' | 'mealy' | 'subset'
const props = defineProps<{ variant: Variant }>()
const converted = ref(false)

const titles: Record<Variant, string> = {
  moore: 'Example: Moore to Mealy',
  mealy: 'Example: Mealy to Moore',
  subset: 'Example: subset check',
}
</script>

<template>
  <ExampleBlock :title="titles[variant]">
    <template v-if="variant !== 'subset'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <!-- Before -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-semibold mb-2 text-muted uppercase tracking-wider">Before</span>
          <svg viewBox="0 0 350 150" class="w-full max-w-sm text-highlighted" role="img" :aria-label="titles[variant]">
            <defs><marker :id="`arrow-${variant}-before`" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
            <path d="M50 75 L120 75" stroke="currentColor" fill="none" :marker-end="`url(#arrow-${variant}-before)`" />
            <path d="M170 75 L240 75" stroke="currentColor" fill="none" :marker-end="`url(#arrow-${variant}-before)`" />
            <text x="205" y="65" text-anchor="middle" fill="currentColor" font-size="14">
              {{ variant === 'moore' ? 'a' : 'a / 1' }}
            </text>
            <path d="M290 75 L330 75" stroke="currentColor" fill="none" stroke-dasharray="4" />
            
            <g transform="translate(145 75)">
              <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
              <text y="5" text-anchor="middle" fill="currentColor" font-size="14">
                {{ variant === 'moore' ? 'q0 / 1' : 'q0' }}
              </text>
            </g>
            
            <g transform="translate(265 75)">
              <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
              <text y="5" text-anchor="middle" fill="currentColor" font-size="14">
                q1
              </text>
            </g>
          </svg>
        </div>

        <!-- After -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-semibold mb-2 text-muted uppercase tracking-wider">After</span>
          <svg viewBox="0 0 350 150" class="w-full max-w-sm text-highlighted" role="img" :aria-label="titles[variant]">
            <defs><marker :id="`arrow-${variant}-after`" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
            <path d="M50 75 L120 75" stroke="currentColor" fill="none" :marker-end="`url(#arrow-${variant}-after)`" />
            <path d="M170 75 L240 75" stroke="currentColor" fill="none" :marker-end="`url(#arrow-${variant}-after)`" />
            <text x="205" y="65" text-anchor="middle" fill="currentColor" font-size="14">
              {{ variant === 'moore' ? 'a / 1' : 'a' }}
            </text>
            <path d="M290 75 L330 75" stroke="currentColor" fill="none" stroke-dasharray="4" />
            
            <g transform="translate(145 75)">
              <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
              <text y="5" text-anchor="middle" fill="currentColor" font-size="14">
                q0
              </text>
            </g>
            
            <g transform="translate(265 75)">
              <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
              <text y="5" text-anchor="middle" fill="currentColor" font-size="14">
                {{ variant === 'moore' ? 'q1' : 'q1 / 1' }}
              </text>
            </g>
          </svg>
        </div>
      </div>
      <p class="mt-3 text-sm text-muted">
        {{ variant === 'moore' ? 'The state output moves to every outgoing transition.' : 'Incoming transition outputs become state outputs; duplicate states if necessary.' }}
      </p>
    </template>

    <ol v-else class="space-y-3 text-sm">
      <li><UBadge class="mr-2">1</UBadge>Build the complete deterministic power automaton P(A2).</li>
      <li><UBadge class="mr-2">2</UBadge>Complement it to obtain C(P(A2)).</li>
      <li><UBadge class="mr-2">3</UBadge>Build A1 × C(P(A2)); a reachable final state is a counterexample.</li>
    </ol>
  </ExampleBlock>
</template>
