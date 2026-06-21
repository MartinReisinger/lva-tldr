<script setup lang="ts">
import { ctlFormulas } from '~/utils/ctl'

// Only 'operators' variant remains
</script>

<template>
  <ExampleBlock title="Example: CTL state highlighting">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="(item, index) in ctlFormulas" :key="item.formula" class="flex flex-col items-center">
        <div class="text-sm font-semibold mb-2 bg-[var(--ui-bg)] px-2 py-1 rounded border border-[var(--ui-border)]">{{ item.formula }}</div>
        <svg viewBox="0 -10 380 140" class="graph-svg w-full" role="img" :aria-label="`${item.formula}: states ${item.states.join(', ')}`">
          <title>{{ item.formula }} holds in states {{ item.states.join(', ') }}</title>
          <defs><marker :id="`ctl-arrow-${index}`" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
          
          <!-- Initial arrow INTO state 1 -->
          <path d="M30 75 L55 75" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />
          
          <!-- State 1 to State 2 -->
          <path d="M105 75 L175 75" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />
          
          <!-- State 2 to State 3 -->
          <path d="M225 75 L295 75" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />
          
          <!-- State 2 can remain in p indefinitely. Angled endpoints keep the
               curve and arrowhead tangent to the node boundary. -->
          <path d="M212.5 53.35 C245 5 155 5 187.5 53.35" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />

          <!-- State 3 remains in q. -->
          <path d="M332.5 53.35 C365 5 275 5 307.5 53.35" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />
          
          <!-- State 1 -->
          <g transform="translate(80 75)">
            <circle r="25" fill="var(--ui-bg)" :class="{ 'graph-highlight': item.states.includes(1) }" :stroke="item.states.includes(1) ? 'var(--ui-primary)' : 'currentColor'" />
            <text y="5" text-anchor="middle" fill="currentColor">p, q</text>
          </g>
          
          <!-- State 2 -->
          <g transform="translate(200 75)">
            <circle r="25" fill="var(--ui-bg)" :class="{ 'graph-highlight': item.states.includes(2) }" :stroke="item.states.includes(2) ? 'var(--ui-primary)' : 'currentColor'" />
            <text y="5" text-anchor="middle" fill="currentColor">p</text>
          </g>
          
          <!-- State 3 -->
          <g transform="translate(320 75)">
            <circle r="25" fill="var(--ui-bg)" :class="{ 'graph-highlight': item.states.includes(3) }" :stroke="item.states.includes(3) ? 'var(--ui-primary)' : 'currentColor'" />
            <text y="5" text-anchor="middle" fill="currentColor">q</text>
          </g>
        </svg>
        <p class="mt-3 text-sm text-muted text-center">{{ item.note }}</p>
      </div>
    </div>
  </ExampleBlock>
</template>
