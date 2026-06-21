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
      <div class="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <UButton size="xs" :variant="!converted ? 'solid' : 'ghost'" label="Original" @click="converted = false" />
        <UButton size="xs" :variant="converted ? 'solid' : 'ghost'" :label="variant === 'moore' ? 'Convert to Mealy' : 'Convert to Moore'" @click="converted = true" />
      </div>

      <div class="flex justify-center">
        <svg viewBox="0 -10 350 160" class="w-full max-w-sm text-highlighted" role="img" :aria-label="titles[variant]">
          <defs><marker :id="`arrow-${variant}`" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
          <path d="M50 75 L120 75" stroke="currentColor" fill="none" :marker-end="`url(#arrow-${variant})`" />
          <path d="M170 75 L240 75" stroke="currentColor" fill="none" :marker-end="`url(#arrow-${variant})`" />
          
          <text x="205" y="65" text-anchor="middle" fill="currentColor" font-size="14">
            <template v-if="!converted">
              {{ variant === 'moore' ? 'a' : 'a / 1' }}
            </template>
            <template v-else>
              {{ variant === 'moore' ? 'a / 1' : 'a' }}
            </template>
          </text>
          
          <path d="M290 75 L330 75" stroke="currentColor" fill="none" stroke-dasharray="4" />
          
          <g transform="translate(145 75)">
            <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
            <text y="5" text-anchor="middle" fill="currentColor" font-size="14">
              <template v-if="!converted">
                {{ variant === 'moore' ? 'q0 / 1' : 'q0' }}
              </template>
              <template v-else>
                q0
              </template>
            </text>
          </g>
          
          <g transform="translate(265 75)">
            <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
            <text y="5" text-anchor="middle" fill="currentColor" font-size="14">
              <template v-if="!converted">
                q1
              </template>
              <template v-else>
                {{ variant === 'moore' ? 'q1' : 'q1 / 1' }}
              </template>
            </text>
          </g>
        </svg>
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
