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
      <div class="mb-4 flex gap-2">
        <UButton size="xs" :variant="!converted ? 'solid' : 'outline'" label="Before" @click="converted = false" />
        <UButton size="xs" :variant="converted ? 'solid' : 'outline'" label="After" @click="converted = true" />
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <UCard>
          <p class="text-xs font-medium uppercase text-muted">State A</p>
          <p class="mt-2 font-mono">
            {{ variant === 'moore' && !converted ? 'A / 1' : 'A' }}
          </p>
        </UCard>
        <UCard>
          <p class="text-xs font-medium uppercase text-muted">Transition a</p>
          <p class="mt-2 font-mono">
            {{ variant === 'moore' && converted ? 'a / 1' : variant === 'mealy' && !converted ? 'a / 1' : 'a' }}
          </p>
        </UCard>
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
