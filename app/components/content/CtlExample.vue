<script setup lang="ts">
import { ctlFormulas } from '~/utils/ctl'

// Only 'operators' variant remains
</script>

<template>
  <ExampleBlock title="Example: CTL state highlighting">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="(item, index) in ctlFormulas" :key="item.formula" class="flex flex-col items-center">
        <div class="text-sm font-semibold mb-2 bg-[var(--ui-bg)] px-2 py-1 rounded border border-[var(--ui-border)]">{{ item.formula }}</div>
        <svg viewBox="0 0 380 180" class="w-full text-highlighted" role="img" :aria-label="`${item.formula}: states ${item.states.join(', ')}`">
          <title>{{ item.formula }} holds in states {{ item.states.join(', ') }}</title>
          <defs><marker :id="`ctl-arrow-${index}`" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
          
          <!-- Initial arrow INTO state 1 -->
          <path d="M35 70 L55 70" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />
          
          <!-- State 1 to State 2 -->
          <path d="M115 70 L170 70" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />
          
          <!-- State 2 to State 3 -->
          <path d="M225 70 L280 110" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />
          
          <!-- State 3 to State 2 (loop back) -->
          <path d="M310 95 C310 30 200 30 200 45" stroke="currentColor" fill="none" :marker-end="`url(#ctl-arrow-${index})`" stroke-width="1.5" />
          
          <!-- State 1 -->
          <g transform="translate(85 70)">
            <circle r="27" fill="var(--ui-bg)" :stroke="item.states.includes(1) ? 'var(--ui-primary)' : 'currentColor'" :stroke-width="item.states.includes(1) ? 4 : 1.5" />
            <text y="5" text-anchor="middle" fill="currentColor">p, q</text>
          </g>
          
          <!-- State 2 -->
          <g transform="translate(200 70)">
            <circle r="27" fill="var(--ui-bg)" :stroke="item.states.includes(2) ? 'var(--ui-primary)' : 'currentColor'" :stroke-width="item.states.includes(2) ? 4 : 1.5" />
            <text y="5" text-anchor="middle" fill="currentColor">p</text>
          </g>
          
          <!-- State 3 -->
          <g transform="translate(310 130)">
            <circle r="27" fill="var(--ui-bg)" :stroke="item.states.includes(3) ? 'var(--ui-primary)' : 'currentColor'" :stroke-width="item.states.includes(3) ? 4 : 1.5" />
            <text y="5" text-anchor="middle" fill="currentColor">q</text>
          </g>
        </svg>
        <p class="mt-3 text-sm text-muted text-center">{{ item.note }}</p>
      </div>
    </div>
  </ExampleBlock>
</template>
