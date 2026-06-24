<script setup lang="ts">
type Variant = 'combined' | 'alphabet' | 'synchronization' | 'satisfiable' | 'underspecification'
const props = defineProps<{ variant: Variant }>()

const examples: Record<Variant, { title: string, before: string, after: string }> = {
  combined: { title: 'Example: process algebra semantics', before: '', after: '' },
  alphabet: { title: 'Example: alphabet', before: 'P = a.b.b.P', after: 'Σ(P) = {a,b}' },
  synchronization: { title: 'Example: synchronization', before: 'Σ(P)={a,b}, Σ(Q)={a,c}', after: 'Θ = {a}' },
  satisfiable: { title: 'Example: satisfiable', before: 'x = 4, y² = x, y > 0', after: 'y = 2 exists' },
  underspecification: { title: 'Example: underspecification', before: '0 < y ≤ x + 1, x = 3', after: 'y ∈ {1,2,3,4}' },
}

const example = computed(() => examples[props.variant])
</script>

<template>
  <ExampleBlock :title="example.title">
    <template v-if="variant === 'combined'">
      <div class="mx-auto mb-3 w-full max-w-xl overflow-x-auto rounded bg-elevated px-3 py-2 font-mono text-xs text-highlighted sm:text-sm">
        <span>Θ = Σ(a.P + b.Q) ∩ Σ(c.R) = ∅</span>
      </div>
      <svg viewBox="0 0 560 190" class="graph-svg mx-auto w-full max-w-xl" role="img" aria-label="Process Algebra Evaluation Tree">
        <defs><marker id="arrow-proc" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>

        <!-- Root node -->
        <rect x="180" y="20" width="200" height="42" rx="6" fill="var(--ui-bg)" stroke="currentColor" />
        <text x="280" y="46" text-anchor="middle" fill="currentColor">(a.P + b.Q) || c.R</text>

        <!-- Edges -->
        <path d="M225 63 L100 129" stroke="currentColor" fill="none" marker-end="url(#arrow-proc)" />
        <path d="M280 63 L280 129" stroke="currentColor" fill="none" marker-end="url(#arrow-proc)" />
        <path d="M335 63 L460 129" stroke="currentColor" fill="none" marker-end="url(#arrow-proc)" />

        <text x="170" y="88" text-anchor="middle" fill="currentColor">a</text>
        <text x="290" y="96" text-anchor="start" fill="currentColor">b</text>
        <text x="390" y="88" text-anchor="middle" fill="currentColor">c</text>

        <!-- Leaf nodes -->
        <rect x="30" y="130" width="140" height="42" rx="6" fill="var(--ui-bg)" stroke="currentColor" />
        <text x="100" y="156" text-anchor="middle" fill="currentColor">P || c.R</text>

        <rect x="210" y="130" width="140" height="42" rx="6" fill="var(--ui-bg)" stroke="currentColor" />
        <text x="280" y="156" text-anchor="middle" fill="currentColor">Q || c.R</text>

        <rect x="380" y="130" width="160" height="42" rx="6" fill="var(--ui-bg)" stroke="currentColor" />
        <text x="460" y="156" text-anchor="middle" fill="currentColor">(a.P + b.Q) || R</text>
      </svg>
    </template>
    <div v-else class="flex flex-col gap-3 font-mono text-sm sm:flex-row sm:items-center">
      <code class="rounded bg-elevated px-3 py-2">{{ example.before }}</code>
      <UIcon name="i-lucide-arrow-right" class="size-5 shrink-0 text-primary" />
      <code class="rounded bg-elevated px-3 py-2 text-highlighted">{{ example.after }}</code>
    </div>
  </ExampleBlock>
</template>
