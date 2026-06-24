<script setup lang="ts">
type Variant = 'basics' | 'power' | 'oracle' | 'oracle-optimized' | 'complement' | 'product'

const props = defineProps<{ variant: Variant }>()
const basicsDeterministic = ref(true)
const basicsComplete = ref(true)
const complementTransformed = ref(false)
const oracleTransformed = ref(false)
const oracleOptimized = ref(false)

const titles: Record<string, string> = {
  basics: 'Example: deterministic and complete',
  power: 'Example: power automaton',
  oracle: 'Example: oracle labels',
  'oracle-optimized': 'Example: optimized oracle',
  complement: 'Example: complement',
  product: 'Example: product states',
}
</script>

<template>
  <ExampleBlock :title="titles[variant]">
    <!-- BASICS AUTOMATON -->
    <template v-if="variant === 'basics'">
      <div class="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <UButton size="xs" :variant="basicsDeterministic ? 'solid' : 'ghost'" label="Deterministic" @click="basicsDeterministic = !basicsDeterministic" />
        <UButton size="xs" :variant="basicsComplete ? 'solid' : 'ghost'" label="Complete" @click="basicsComplete = !basicsComplete" />
      </div>
      <svg viewBox="0 -20 440 180" class="graph-svg w-full max-w-xl" role="img" aria-label="Basics Automaton">
        <defs><marker id="arrow-basics" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
        
        <!-- Keep b visible so the alphabet remains explicit when incomplete. -->
        <path d="M 88 53 C 65 -10, 135 -10, 112 53" stroke="currentColor" fill="none" marker-end="url(#arrow-basics)" />
        <text x="100" y="0" text-anchor="middle" fill="currentColor">b</text>

        <!-- A to B (a) -->
        <path d="M125 75 L205 75" stroke="currentColor" fill="none" marker-end="url(#arrow-basics)" />
        <text x="165" y="65" text-anchor="middle" fill="currentColor">a</text>
        
        <!-- B to C (a) -->
        <path d="M255 75 L335 75" stroke="currentColor" fill="none" marker-end="url(#arrow-basics)" />
        <text x="295" y="65" text-anchor="middle" fill="currentColor">a</text>
        
        <!-- B loop (b) -->
        <path v-if="basicsComplete" d="M 218 53 C 195 -10, 265 -10, 242 53" stroke="currentColor" fill="none" marker-end="url(#arrow-basics)" />
        <text v-if="basicsComplete" x="230" y="0" text-anchor="middle" fill="currentColor">b</text>

        <!-- C loop (entire alphabet) -->
        <path v-if="basicsComplete" d="M 348 53 C 325 -10, 395 -10, 372 53" stroke="currentColor" fill="none" marker-end="url(#arrow-basics)" />
        <text v-if="basicsComplete" x="360" y="0" text-anchor="middle" fill="currentColor">*</text>

        <!-- A to C non-deterministic branch (if toggled) -->
        <path v-if="!basicsDeterministic" d="M 115 95 C 140 150, 320 150, 345 95" stroke="currentColor" fill="none" marker-end="url(#arrow-basics)" />
        <text v-if="!basicsDeterministic" x="230" y="125" text-anchor="middle" fill="currentColor">a</text>

        <!-- Initial arrow -->
        <path d="M40 75 L75 75" stroke="currentColor" fill="none" marker-end="url(#arrow-basics)" />

        <!-- States -->
        <g transform="translate(100 75)">
          <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
          <text y="5" text-anchor="middle" fill="currentColor" font-size="14">A</text>
        </g>
        <g transform="translate(230 75)">
          <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
          <circle r="20" fill="none" stroke="currentColor" stroke-width="2" />
          <text y="5" text-anchor="middle" fill="currentColor" font-size="14">B</text>
        </g>
        <g transform="translate(360 75)">
          <circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" />
          <text y="5" text-anchor="middle" fill="currentColor" font-size="14">C</text>
        </g>
      </svg>

      <div class="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div class="flex min-w-0 flex-col items-start gap-1.5">
          <UBadge :color="basicsDeterministic ? 'primary' : 'neutral'">
            {{ basicsDeterministic ? 'Deterministic' : 'Non-deterministic' }}
          </UBadge>
          <p class="w-full text-muted">
            {{
              basicsDeterministic
                ? 'Every state has at most one outgoing transition per action.'
                : 'State A has two outgoing transitions for action a.'
            }}
          </p>
        </div>
        <div class="flex min-w-0 flex-col items-start gap-1.5">
          <UBadge :color="basicsComplete ? 'primary' : 'neutral'">
            {{ basicsComplete ? 'Complete' : 'Incomplete' }}
          </UBadge>
          <p class="w-full text-muted">
            {{
              basicsComplete
                ? 'Every state has a transition for both a and b.'
                : 'The alphabet is {a, b}, but states B and C are missing transitions.'
            }}
          </p>
        </div>
      </div>
    </template>

    <!-- POWER AUTOMATON -->
    <template v-else-if="variant === 'power'">
      <div class="flex flex-col gap-6">
        <div>
          <h4 class="font-semibold text-sm mb-2">1. Original Graph</h4>
          <div class="flex justify-center">
            <svg viewBox="0 -20 400 210" class="graph-svg w-full max-w-sm" role="img">
              <defs><marker id="arrow-pow0" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
              
              <!-- Init -> A -->
              <path d="M60 60 L95 60" stroke="currentColor" fill="none" marker-end="url(#arrow-pow0)" />
              
              <!-- A loop (a) -->
              <path d="M110 36 C90 -10, 150 -10, 130 36" stroke="currentColor" fill="none" marker-end="url(#arrow-pow0)" />
              <text x="120" y="-8" text-anchor="middle" fill="currentColor" font-size="14">a</text>

              <!-- A -> B (a) -->
              <path d="M145 60 L255 60" stroke="currentColor" fill="none" marker-end="url(#arrow-pow0)" />
              <text x="200" y="50" text-anchor="middle" fill="currentColor" font-size="14">a</text>

              <!-- A -> C (b) -->
              <path d="M136 80 L184 140" stroke="currentColor" fill="none" marker-end="url(#arrow-pow0)" />
              <text x="150" y="115" text-anchor="middle" fill="currentColor" font-size="14">b</text>

              <!-- B -> C (a) -->
              <path d="M264 80 L216 140" stroke="currentColor" fill="none" marker-end="url(#arrow-pow0)" />
              <text x="250" y="115" text-anchor="middle" fill="currentColor" font-size="14">a</text>

              <!-- Nodes -->
              <g transform="translate(120 60)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">A</text></g>
              <g transform="translate(280 60)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">B</text></g>
              <g transform="translate(200 160)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><circle r="20" fill="none" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">C</text></g>
            </svg>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-sm mb-2">2. Original Table</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left table-fixed">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  <th class="py-2 px-4 w-1/3 border-r border-gray-200 dark:border-gray-800 font-medium">State</th>
                  <th class="py-2 px-4 w-1/3 border-r border-gray-200 dark:border-gray-800 font-medium">a</th>
                  <th class="py-2 px-4 w-1/3 font-medium">b</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 dark:border-gray-800"><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">→ A</td><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">A, B</td><td class="py-2 px-4">C</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800"><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">B</td><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">C</td><td class="py-2 px-4">∅</td></tr>
                <tr><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">* C</td><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">∅</td><td class="py-2 px-4">∅</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-sm mb-2">3. Power Table</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left table-fixed">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  <th class="py-2 px-4 w-1/3 border-r border-gray-200 dark:border-gray-800 font-medium">State</th>
                  <th class="py-2 px-4 w-1/3 border-r border-gray-200 dark:border-gray-800 font-medium">a</th>
                  <th class="py-2 px-4 w-1/3 font-medium">b</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 dark:border-gray-800"><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">→ A</td><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">A, B</td><td class="py-2 px-4">C</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800"><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">A, B</td><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">A, B, C</td><td class="py-2 px-4">C</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800"><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">* C</td><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">∅</td><td class="py-2 px-4">∅</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800"><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">* A, B, C</td><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">A, B, C</td><td class="py-2 px-4">C</td></tr>
                <tr><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">∅</td><td class="py-2 px-4 border-r border-gray-200 dark:border-gray-800">∅</td><td class="py-2 px-4">∅</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h4 class="font-semibold text-sm mb-2">4. Power Automaton</h4>
          <div class="flex justify-center">
            <svg viewBox="0 20 500 200" class="graph-svg w-full max-w-xl" role="img">
              <defs><marker id="arrow-pow3" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
              <!-- Init -> {A} -->
              <path d="M40 60 L75 60" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              
              <!-- {A} -> {A,B} -->
              <path d="M125 60 L225 60" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              <text x="175" y="50" text-anchor="middle" fill="currentColor" font-size="14">a</text>

              <!-- {A,B} -> {A,B,C} -->
              <path d="M275 60 L375 60" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              <text x="325" y="50" text-anchor="middle" fill="currentColor" font-size="14">a</text>

              <!-- {A,B,C} loop -->
              <path d="M421.65 47.5 C475 20, 475 100, 421.65 72.5" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              <text x="470" y="65" text-anchor="middle" fill="currentColor" font-size="14">a</text>

              <!-- {A} -> {C} -->
              <path d="M121 74 L229 146" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              <text x="165" y="125" text-anchor="middle" fill="currentColor" font-size="14">b</text>

              <!-- {A,B} -> {C} -->
              <path d="M250 85 L250 135" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              <text x="260" y="115" text-anchor="middle" fill="currentColor" font-size="14">b</text>

              <!-- {A,B,C} -> {C} -->
              <path d="M379 74 L271 146" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              <text x="335" y="125" text-anchor="middle" fill="currentColor" font-size="14">b</text>

              <!-- {C} -> ∅ -->
              <path d="M275 160 L375 160" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              <text x="325" y="156" text-anchor="middle" fill="currentColor" font-size="14">*</text>

              <!-- ∅ loop -->
              <path d="M421.65 147.5 C475 120, 475 200, 421.65 172.5" stroke="currentColor" fill="none" marker-end="url(#arrow-pow3)" />
              <text x="470" y="165" text-anchor="middle" fill="currentColor" font-size="14">*</text>

              <!-- Nodes -->
              <g transform="translate(100 60)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor" font-size="13">A</text></g>
              <g transform="translate(250 60)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor" font-size="12">A, B</text></g>
              <g transform="translate(400 60)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><circle r="20" fill="none" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor" font-size="10">A, B, C</text></g>
              <g transform="translate(250 160)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><circle r="20" fill="none" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor" font-size="13">C</text></g>
              <g transform="translate(400 160)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor" font-size="14">∅</text></g>
            </svg>
          </div>
        </div>
      </div>
    </template>

    <!-- ORACLE -->
    <template v-else-if="variant === 'oracle'">
      <div class="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <UButton size="xs" :variant="!oracleTransformed ? 'solid' : 'ghost'" label="Original" @click="oracleTransformed = false" />
        <UButton size="xs" :variant="oracleTransformed ? 'solid' : 'ghost'" label="Oracle" @click="oracleTransformed = true" />
      </div>

      <div class="flex justify-center">
        <svg viewBox="0 -10 350 160" class="graph-svg w-full max-w-md" role="img" aria-label="Oracle Automaton">
          <defs><marker id="arrow-oracle" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
          <path d="M20 75 L55 75" stroke="currentColor" fill="none" marker-end="url(#arrow-oracle)" />
          
          <template v-if="!oracleTransformed">
            <!-- Non-deterministic Original -->
            <path d="M 105 70 L 235 45" stroke="currentColor" fill="none" marker-end="url(#arrow-oracle)" />
            <text x="160" y="45" text-anchor="middle" fill="currentColor" font-size="13">*</text>
            
            <path d="M 105 80 L 235 105" stroke="currentColor" fill="none" marker-end="url(#arrow-oracle)" />
            <text x="160" y="110" text-anchor="middle" fill="currentColor" font-size="13">a</text>
          </template>
          <template v-else>
            <!-- Unoptimized Oracle -->
            <path d="M 105 70 L 235 45" stroke="currentColor" fill="none" marker-end="url(#arrow-oracle)" />
            <text x="160" y="45" text-anchor="middle" fill="currentColor" font-size="13">* / B</text>
            
            <path d="M 105 80 L 235 105" stroke="currentColor" fill="none" marker-end="url(#arrow-oracle)" />
            <text x="160" y="110" text-anchor="middle" fill="currentColor" font-size="13">a / C</text>
          </template>
          
          <g transform="translate(80 75)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">A</text></g>
          <g transform="translate(260 40)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">B</text></g>
          <g transform="translate(260 110)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><circle r="20" fill="none" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">C</text></g>
        </svg>
      </div>
    </template>

    <!-- OPTIMIZED ORACLE -->
    <template v-else-if="variant === 'oracle-optimized'">
      <div class="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <UButton size="xs" :variant="!oracleOptimized ? 'solid' : 'ghost'" label="Unoptimized" @click="oracleOptimized = false" />
        <UButton size="xs" :variant="oracleOptimized ? 'solid' : 'ghost'" label="Optimized" @click="oracleOptimized = true" />
      </div>

      <div class="flex justify-center">
        <svg viewBox="0 -10 350 160" class="graph-svg w-full max-w-md" role="img" aria-label="Optimized Oracle Automaton">
          <defs><marker id="arrow-opt" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
          <path d="M20 75 L55 75" stroke="currentColor" fill="none" marker-end="url(#arrow-opt)" />
          
          <template v-if="!oracleOptimized">
            <!-- Unoptimized Oracle -->
            <path d="M 105 70 L 235 45" stroke="currentColor" fill="none" marker-end="url(#arrow-opt)" />
            <text x="160" y="45" text-anchor="middle" fill="currentColor" font-size="13">* / B</text>
            
            <path d="M 105 80 L 235 105" stroke="currentColor" fill="none" marker-end="url(#arrow-opt)" />
            <text x="160" y="110" text-anchor="middle" fill="currentColor" font-size="13">a / C</text>
          </template>
          <template v-else>
            <!-- Optimized Oracle -->
            <path d="M 105 70 L 235 45" stroke="currentColor" fill="none" marker-end="url(#arrow-opt)" />
            <text x="160" y="45" text-anchor="middle" fill="currentColor" font-size="13">* / 0</text>
            
            <path d="M 105 80 L 235 105" stroke="currentColor" fill="none" marker-end="url(#arrow-opt)" />
            <text x="160" y="110" text-anchor="middle" fill="currentColor" font-size="13">a / 1</text>
          </template>
          
          <g transform="translate(80 75)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">A</text></g>
          <g transform="translate(260 40)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">B</text></g>
          <g transform="translate(260 110)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><circle r="20" fill="none" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">C</text></g>
        </svg>
      </div>
    </template>

    <!-- COMPLEMENT -->
    <template v-else-if="variant === 'complement'">
      <div class="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <UButton size="xs" :variant="!complementTransformed ? 'solid' : 'ghost'" label="Original" @click="complementTransformed = false" />
        <UButton size="xs" :variant="complementTransformed ? 'solid' : 'ghost'" label="Complement" @click="complementTransformed = true" />
      </div>

      <div class="flex justify-center">
        <svg viewBox="0 -20 350 170" class="graph-svg w-full max-w-sm" role="img" aria-label="Complement Example">
          <defs><marker id="arrow-comp" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
          <path d="M50 75 L115 75" stroke="currentColor" fill="none" marker-end="url(#arrow-comp)" />
          
          <path d="M170 75 L235 75" stroke="currentColor" fill="none" marker-end="url(#arrow-comp)" />
          <text x="205" y="65" text-anchor="middle" fill="currentColor">a</text>
          
          <!-- Loop b on state 1 -->
          <path d="M 133 53 C 110 -10, 180 -10, 157 53" stroke="currentColor" fill="none" marker-end="url(#arrow-comp)" />
          <text x="145" y="0" text-anchor="middle" fill="currentColor">b</text>
          
          <g transform="translate(145 75)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><circle v-if="complementTransformed" r="20" fill="none" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">A</text></g>
          <g transform="translate(265 75)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><circle v-if="!complementTransformed" r="20" fill="none" stroke="currentColor" stroke-width="2" /><text y="5" text-anchor="middle" fill="currentColor">B</text></g>
          
          <!-- Loop a,b on state 2 -->
          <path d="M 253 53 C 230 -10, 300 -10, 277 53" stroke="currentColor" fill="none" marker-end="url(#arrow-comp)" />
          <text x="265" y="0" text-anchor="middle" fill="currentColor">*</text>
        </svg>
      </div>
    </template>

    <!-- PRODUCT -->
    <template v-else-if="variant === 'product'">
      <div class="grid gap-4 md:grid-cols-[1fr_auto_1.5fr] items-center max-w-3xl mx-auto">
        <!-- Automaton A & B -->
        <div class="flex flex-col gap-3">
          <div class="border border-[var(--ui-border)] bg-[var(--ui-bg)] rounded-md p-2 flex flex-col items-center">
            <div class="text-[10px] font-semibold uppercase text-muted mb-1">Automaton A</div>
            <svg viewBox="0 20 160 60" class="graph-svg w-full max-w-[140px]">
              <defs><marker id="arrow-prod-s" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
              <path d="M10 40 L30 40" stroke="currentColor" fill="none" marker-end="url(#arrow-prod-s)" />
              <path d="M60 40 L100 40" stroke="currentColor" fill="none" marker-end="url(#arrow-prod-s)" />
              <text x="80" y="35" text-anchor="middle" fill="currentColor" font-size="12">a</text>
              <g transform="translate(45 40)"><circle r="15" fill="var(--ui-bg)" stroke="currentColor" /><text y="4" text-anchor="middle" fill="currentColor" font-size="12">1</text></g>
              <g transform="translate(115 40)"><circle r="15" fill="var(--ui-bg)" stroke="currentColor" /><circle r="11" fill="none" stroke="currentColor" /><text y="4" text-anchor="middle" fill="currentColor" font-size="12">2</text></g>
            </svg>
          </div>
          
          <div class="border border-[var(--ui-border)] bg-[var(--ui-bg)] rounded-md p-2 flex flex-col items-center">
            <div class="text-[10px] font-semibold uppercase text-muted mb-1">Automaton B</div>
            <svg viewBox="0 0 160 80" class="graph-svg w-full max-w-[140px]">
              <defs><marker id="arrow-prod-b" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
              <path d="M10 40 L30 40" stroke="currentColor" fill="none" marker-end="url(#arrow-prod-b)" />
              <!-- Top curve from X to Y -->
              <path d="M 56 30 Q 80 5 104 30" stroke="currentColor" fill="none" marker-end="url(#arrow-prod-b)" />
              <text x="80" y="10" text-anchor="middle" fill="currentColor" font-size="11">a</text>
              <!-- Bottom curve from Y to X -->
              <path d="M 104 50 Q 80 75 56 50" stroke="currentColor" fill="none" marker-end="url(#arrow-prod-b)" />
              <text x="80" y="76" text-anchor="middle" fill="currentColor" font-size="11">b</text>
              
              <g transform="translate(45 40)"><circle r="15" fill="var(--ui-bg)" stroke="currentColor" /><text y="4" text-anchor="middle" fill="currentColor" font-size="12">X</text></g>
              <g transform="translate(115 40)"><circle r="15" fill="var(--ui-bg)" stroke="currentColor" /><circle r="11" fill="none" stroke="currentColor" /><text y="4" text-anchor="middle" fill="currentColor" font-size="12">Y</text></g>
            </svg>
          </div>
        </div>
        
        <UIcon name="i-lucide-arrow-right" class="hidden md:block size-6 text-muted" />

        <!-- Product Automaton -->
        <div class="border border-[var(--ui-border)] bg-[var(--ui-bg)] rounded-md p-3 flex flex-col items-center h-full justify-center min-h-[160px]">
          <div class="text-[10px] font-semibold uppercase text-muted mb-2">Product A × B</div>
          <svg viewBox="0 20 250 110" class="graph-svg h-full w-full">
            <defs><marker id="arrow-prod-l" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
            <path d="M20 75 L50 75" stroke="currentColor" fill="none" marker-end="url(#arrow-prod-l)" />
            
            <path d="M100 75 L170 75" stroke="currentColor" fill="none" marker-end="url(#arrow-prod-l)" />
            <text x="135" y="70" text-anchor="middle" fill="currentColor" font-size="12">a</text>

            <g transform="translate(75 75)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><text y="4" text-anchor="middle" fill="currentColor" font-size="10">(1,X)</text></g>
            <g transform="translate(195 75)"><circle r="25" fill="var(--ui-bg)" stroke="currentColor" stroke-width="2" /><circle r="20" fill="none" stroke="currentColor" stroke-width="2" /><text y="4" text-anchor="middle" fill="currentColor" font-size="10">(2,X)</text></g>
            
            <text x="135" y="125" text-anchor="middle" fill="currentColor" font-size="11" class="opacity-60">Only synchronized transitions are kept</text>
          </svg>
        </div>
      </div>
    </template>
  </ExampleBlock>
</template>
