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
      <svg viewBox="0 10 480 170" class="w-full text-highlighted" role="img" aria-label="Process Algebra Evaluation Tree">
        <defs><marker id="arrow-proc" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
        
        <!-- Root node -->
        <rect x="180" y="20" width="120" height="20" rx="3" fill="var(--ui-bg)" stroke="currentColor" stroke-width="1.5" />
        <text x="240" y="34" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">(a.P + b.Q) || c.R</text>

        <!-- Edges -->
        <path d="M210 40 L110 115" stroke="currentColor" fill="none" marker-end="url(#arrow-proc)" stroke-width="1.5" />
        <path d="M240 40 L240 115" stroke="currentColor" fill="none" marker-end="url(#arrow-proc)" stroke-width="1.5" />
        <path d="M270 40 L370 115" stroke="currentColor" fill="none" marker-end="url(#arrow-proc)" stroke-width="1.5" />
        
        <text x="140" y="70" text-anchor="middle" fill="currentColor" font-size="11">a</text>
        <text x="248" y="80" text-anchor="start" fill="currentColor" font-size="11">b</text>
        <text x="340" y="70" text-anchor="middle" fill="currentColor" font-size="11">c</text>

        <!-- Leaf nodes -->
        <rect x="65" y="120" width="90" height="20" rx="3" fill="var(--ui-bg)" stroke="currentColor" stroke-width="1.5" />
        <text x="110" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">P || c.R</text>

        <rect x="195" y="120" width="90" height="20" rx="3" fill="var(--ui-bg)" stroke="currentColor" stroke-width="1.5" />
        <text x="240" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">Q || c.R</text>

        <rect x="325" y="120" width="110" height="20" rx="3" fill="var(--ui-bg)" stroke="currentColor" stroke-width="1.5" />
        <text x="380" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">(a.P + b.Q) || R</text>
        
        <!-- Legend/Explanation below -->
        <text x="240" y="165" text-anchor="middle" fill="currentColor" font-size="10" class="opacity-70">Shows prefix resolution (.), choice branching (+), and parallel interleaving (||)</text>
      </svg>
    </template>
    <div v-else class="flex flex-col gap-3 font-mono text-sm sm:flex-row sm:items-center">
      <code class="rounded bg-elevated px-3 py-2">{{ example.before }}</code>
      <UIcon name="i-lucide-arrow-right" class="size-5 shrink-0 text-primary" />
      <code class="rounded bg-elevated px-3 py-2 text-highlighted">{{ example.after }}</code>
    </div>
  </ExampleBlock>
</template>
