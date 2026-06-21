<script setup lang="ts">
type Variant = 'prefix' | 'choice' | 'parallel' | 'alphabet' | 'synchronization' | 'satisfiable' | 'underspecification'
const props = defineProps<{ variant: Variant }>()

const examples: Record<Variant, { title: string, before: string, after: string }> = {
  prefix: { title: 'Example: prefix', before: 'a.Q', after: '—a→ Q' },
  choice: { title: 'Example: choice', before: 'a.P + b.Q', after: '—a→ P  or  —b→ Q' },
  parallel: { title: 'Example: parallel', before: 'a.P ∥ b.Q', after: '—a→ P ∥ b.Q' },
  alphabet: { title: 'Example: alphabet', before: 'P = a.b.b.P', after: 'Σ(P) = {a,b}' },
  synchronization: { title: 'Example: synchronization', before: 'Σ(P)={a,b}, Σ(Q)={a,c}', after: 'Θ = {a}' },
  satisfiable: { title: 'Example: satisfiable', before: 'x = 4, y² = x, y > 0', after: 'y = 2 exists' },
  underspecification: { title: 'Example: underspecification', before: '0 < y ≤ x + 1, x = 3', after: 'y ∈ {1,2,3,4}' },
}

const example = computed(() => examples[props.variant])
</script>

<template>
  <ExampleBlock :title="example.title">
    <div class="flex flex-col gap-3 font-mono text-sm sm:flex-row sm:items-center">
      <code class="rounded bg-elevated px-3 py-2">{{ example.before }}</code>
      <UIcon name="i-lucide-arrow-right" class="size-5 shrink-0 text-primary" />
      <code class="rounded bg-elevated px-3 py-2 text-highlighted">{{ example.after }}</code>
    </div>
  </ExampleBlock>
</template>
