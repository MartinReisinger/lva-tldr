<script setup lang="ts">
type Variant = 'action' | 'checking'
type ActionCase = 'correct' | 'missing' | 'wrong'
type CheckCase = 'invariant' | 'reachability' | 'fairness'

const props = defineProps<{ variant: Variant }>()
const actionCase = ref<ActionCase>('correct')
const checkCase = ref<CheckCase>('invariant')

const titles: Record<Variant, string> = {
  action: 'Example: correct a TLA+ action',
  checking: 'Example: TLC checks and fairness',
}

const actionResult = computed(() => ({
  correct: ['Correct', 'coins becomes 1; brewing keeps its value.'],
  missing: ['Missing next value', 'brewing is neither updated nor declared UNCHANGED.'],
  wrong: ['Wrong update', "coins' = 0 does not model inserting a coin."],
}[actionCase.value]))

const checkContent = computed(() => ({
  invariant: ['TypeOK', 'All reachable states satisfy the declared value ranges.'],
  reachability: ['brewing = FALSE', 'TLC violates this invariant with the trace InsertCoin → Brew.'],
  fairness: ['WF_vars(Brew)', 'If Brew remains enabled, stuttering cannot postpone it forever.'],
}[checkCase.value]))
</script>

<template>
  <ExampleBlock :title="titles[variant]">
    <template v-if="variant === 'action'">
      <div class="mb-4 flex flex-wrap gap-2 border-b border-default pb-2">
        <UButton size="xs" label="Correct" :variant="actionCase === 'correct' ? 'solid' : 'ghost'" @click="actionCase = 'correct'" />
        <UButton size="xs" label="Missing UNCHANGED" :variant="actionCase === 'missing' ? 'solid' : 'ghost'" @click="actionCase = 'missing'" />
        <UButton size="xs" label="Wrong update" :variant="actionCase === 'wrong' ? 'solid' : 'ghost'" @click="actionCase = 'wrong'" />
      </div>

      <div class="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,1fr)]">
        <pre class="overflow-x-auto rounded-md border border-default bg-default p-3 text-xs"><code><span class="text-primary">InsertCoin</span> == /\ coins = <span class="text-info">0</span>
              /\ brewing = <span class="text-warning">FALSE</span>
              /\ coins' = <span class="text-info">{{ actionCase === 'wrong' ? 0 : 1 }}</span><template v-if="actionCase !== 'missing'">
              /\ <span class="text-warning">UNCHANGED</span> brewing</template></code></pre>
        <svg viewBox="0 20 380 120" class="graph-svg w-full" role="img" :aria-label="`InsertCoin action: ${actionResult[0]}`">
          <defs><marker id="tla-action-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
          <path d="M35 80 L74 80" stroke="currentColor" fill="none" marker-end="url(#tla-action-arrow)" />
          <path d="M126 80 L254 80" :stroke="actionCase === 'correct' ? 'var(--ui-primary)' : 'currentColor'" fill="none" marker-end="url(#tla-action-arrow)" />
          <text x="190" y="70" text-anchor="middle" fill="currentColor">InsertCoin</text>
          <g transform="translate(100 80)">
            <circle r="25" fill="var(--ui-bg)" stroke="currentColor" />
            <text y="5" text-anchor="middle" fill="currentColor">0</text>
          </g>
          <text x="100" y="120" text-anchor="middle" fill="currentColor">Idle</text>
          <g transform="translate(280 80)">
            <circle r="25" fill="var(--ui-bg)" :stroke="actionCase === 'correct' ? 'var(--ui-primary)' : 'currentColor'" :class="{ 'graph-highlight': actionCase === 'correct' }" />
            <text y="5" text-anchor="middle" fill="currentColor">{{ actionCase === 'wrong' ? 0 : 1 }}</text>
          </g>
          <text x="280" y="120" text-anchor="middle" fill="currentColor">{{ actionCase === 'missing' ? 'brewing = ?' : 'Idle' }}</text>
        </svg>
      </div>

      <div class="mt-3 flex flex-col items-start gap-1.5 text-sm">
        <UBadge :color="actionCase === 'correct' ? 'primary' : 'neutral'">{{ actionResult[0] }}</UBadge>
        <p class="text-muted">{{ actionResult[1] }}</p>
      </div>
    </template>

    <template v-else>
      <div class="mb-4 flex flex-wrap gap-2 border-b border-default pb-2">
        <UButton size="xs" label="Invariant" :variant="checkCase === 'invariant' ? 'solid' : 'ghost'" @click="checkCase = 'invariant'" />
        <UButton size="xs" label="Reachability" :variant="checkCase === 'reachability' ? 'solid' : 'ghost'" @click="checkCase = 'reachability'" />
        <UButton size="xs" label="Fairness" :variant="checkCase === 'fairness' ? 'solid' : 'ghost'" @click="checkCase = 'fairness'" />
      </div>

      <div class="mx-auto max-w-xl">
        <div class="mb-2 text-center"><UBadge color="neutral" variant="subtle">{{ checkContent[0] }}</UBadge></div>
        <svg viewBox="0 0 420 150" class="graph-svg w-full" role="img" :aria-label="`TLA+ ${checkCase} example`">
          <defs><marker id="tla-check-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
          <path d="M30 85 L54 85" stroke="currentColor" fill="none" marker-end="url(#tla-check-arrow)" />
          <path d="M106 85 L184 85" stroke="currentColor" fill="none" marker-end="url(#tla-check-arrow)" />
          <path d="M236 85 L314 85" stroke="currentColor" fill="none" marker-end="url(#tla-check-arrow)" />
          <text x="145" y="75" text-anchor="middle" fill="currentColor">InsertCoin</text>
          <text x="275" y="75" text-anchor="middle" fill="currentColor">Brew</text>
          <path v-if="checkCase === 'fairness'" d="M197 63.5 C170 16 250 16 223 63.5" stroke="currentColor" fill="none" marker-end="url(#tla-check-arrow)" />
          <text v-if="checkCase === 'fairness'" x="210" y="14" text-anchor="middle" fill="currentColor">stutter</text>

          <g v-for="(state, index) in ['Idle', 'Paid', 'Brewing']" :key="state" :transform="`translate(${80 + index * 130} 85)`">
            <circle r="25" fill="var(--ui-bg)" :stroke="checkCase === 'invariant' || (checkCase === 'reachability' && index === 2) || (checkCase === 'fairness' && index === 1) ? 'var(--ui-primary)' : 'currentColor'" :class="{ 'graph-highlight': checkCase === 'invariant' || (checkCase === 'reachability' && index === 2) || (checkCase === 'fairness' && index === 1) }" />
            <text y="5" text-anchor="middle" fill="currentColor">{{ index }}</text>
            <text y="43" text-anchor="middle" fill="currentColor">{{ state }}</text>
          </g>
        </svg>
        <p class="mt-3 text-center text-sm text-muted">{{ checkContent[1] }}</p>
      </div>
    </template>
  </ExampleBlock>
</template>
