<script setup lang="ts">
type Variant = 'markings' | 'prepost' | 'cen' | 'ptn' | 'lts'
const props = defineProps<{ variant: Variant }>()
const initial = computed(() => props.variant === 'ptn' ? { left: 3, right: 0 } : { left: 1, right: 0 })
const marking = ref({ ...initial.value })

const titles: Record<Variant, string> = {
  markings: 'Example: possible markings',
  prepost: 'Example: precondition and postcondition',
  cen: 'Example: fire event',
  ptn: 'Example: weighted transition',
  lts: 'Example: resulting LTS',
}

function fire() {
  const input = props.variant === 'ptn' ? 2 : 1
  marking.value = fireTransition(marking.value, input, 1)
}

function reset() {
  marking.value = { ...initial.value }
}
</script>

<template>
  <ExampleBlock :title="titles[variant]">
    <p v-if="variant === 'markings'" class="text-sm">
      Two conditions produce 2² = 4 possible markings: ∅, {r}, {s}, and {r,s}.
    </p>

    <template v-else-if="variant === 'lts'">
      <svg viewBox="0 0 400 130" class="w-full max-w-lg text-highlighted" role="img" aria-label="LTS with three markings">
        <title>Reachable markings as an LTS</title>
        <defs><marker id="lts-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="currentColor" /></marker></defs>
        <path d="M110 65H180M250 65H320" stroke="currentColor" marker-end="url(#lts-arrow)" />
        <text x="145" y="54" fill="currentColor" text-anchor="middle">a</text>
        <text x="285" y="54" fill="currentColor" text-anchor="middle">b</text>
        <g v-for="(label, index) in ['(1,0)', '(0,1)', '(1,1)']" :key="label" :transform="`translate(${75 + index * 140} 65)`">
          <ellipse rx="36" ry="23" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
          <text y="5" fill="currentColor" text-anchor="middle">{{ label }}</text>
        </g>
      </svg>
    </template>

    <template v-else>
      <svg viewBox="0 0 420 150" class="w-full max-w-xl text-highlighted" role="img" :aria-label="titles[variant]">
        <title>{{ titles[variant] }}</title>
        <defs><marker :id="`net-arrow-${variant}`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="currentColor" /></marker></defs>
        <path d="M125 75H185M235 75H295" stroke="currentColor" :marker-end="`url(#net-arrow-${variant})`" />
        <circle cx="95" cy="75" r="29" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
        <rect x="185" y="50" width="50" height="50" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
        <circle cx="325" cy="75" r="29" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
        <text x="95" y="81" text-anchor="middle" fill="currentColor" font-size="18">{{ marking.left }}</text>
        <text x="210" y="81" text-anchor="middle" fill="currentColor" font-size="16">e</text>
        <text x="325" y="81" text-anchor="middle" fill="currentColor" font-size="18">{{ marking.right }}</text>
        <text v-if="variant === 'ptn'" x="155" y="64" text-anchor="middle" fill="currentColor">2</text>
        <text x="95" y="125" text-anchor="middle" fill="currentColor">pre</text>
        <text x="325" y="125" text-anchor="middle" fill="currentColor">post</text>
      </svg>
      <div v-if="variant === 'cen' || variant === 'ptn'" class="mt-3 flex gap-2">
        <UButton size="xs" label="Fire e" :disabled="marking.left < (variant === 'ptn' ? 2 : 1)" @click="fire" />
        <UButton size="xs" label="Reset" color="neutral" variant="outline" @click="reset" />
      </div>
      <p v-else class="mt-2 text-sm text-muted">Incoming arrows are preconditions; outgoing arrows are postconditions.</p>
    </template>
  </ExampleBlock>
</template>
