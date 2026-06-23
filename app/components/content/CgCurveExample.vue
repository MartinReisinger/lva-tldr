<script setup lang="ts">
defineProps<{ variant: 'bezier' | 'bezier-surface' | 'bspline' }>()
</script>

<template>
  <ExampleBlock v-if="variant === 'bezier'" title="Example: Bézier control polygon">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Bézier control polygon">
      <polyline points="65,130 155,45 285,55 395,125" fill="none" stroke="currentColor" stroke-dasharray="5 5" />
      <path d="M65 130 C155 45, 285 55, 395 125" fill="none" stroke="var(--ui-primary)" stroke-width="4" />
      <g v-for="(p, i) in [[65,130],[155,45],[285,55],[395,125]]" :key="i">
        <circle :cx="p[0]" :cy="p[1]" r="8" fill="var(--ui-bg)" stroke="currentColor" />
        <text :x="p[0]" :y="p[1] - 14" text-anchor="middle" fill="currentColor">p{{ i }}</text>
      </g>
      <text x="230" y="163" text-anchor="middle" fill="currentColor">global control: every point pulls the curve</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'bezier-surface'" title="Example: Bézier surface control grid">
    <svg viewBox="0 0 460 190" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Bézier surface control grid">
      <path d="M105 135 C155 80, 295 80, 355 130" fill="none" stroke="var(--ui-primary)" stroke-width="4" />
      <path d="M95 95 C155 45, 300 48, 365 92" fill="none" stroke="var(--ui-primary)" opacity=".55" stroke-width="3" />
      <path d="M115 55 C175 25, 295 28, 345 58" fill="none" stroke="var(--ui-primary)" opacity=".35" stroke-width="3" />
      <g stroke="currentColor" stroke-dasharray="5 5">
        <polyline points="95,95 105,135 115,55" fill="none" />
        <polyline points="230,75 230,112 230,42" fill="none" />
        <polyline points="365,92 355,130 345,58" fill="none" />
      </g>
      <g v-for="(p, i) in [[95,95],[105,135],[115,55],[230,75],[230,112],[230,42],[365,92],[355,130],[345,58]]" :key="i">
        <circle :cx="p[0]" :cy="p[1]" r="5" fill="var(--ui-bg)" stroke="currentColor" />
      </g>
      <text x="230" y="170" text-anchor="middle" fill="currentColor">two parameters blend a grid of control points</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else title="Example: local B-spline basis">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Local B-spline basis functions">
      <line x1="55" y1="140" x2="405" y2="140" stroke="currentColor" />
      <path d="M70 140 C100 140, 112 70, 145 70 C178 70, 190 140, 220 140" fill="none" stroke="currentColor" />
      <path d="M145 140 C175 140, 187 70, 220 70 C253 70, 265 140, 295 140" fill="none" stroke="var(--ui-primary)" stroke-width="4" />
      <path d="M220 140 C250 140, 262 70, 295 70 C328 70, 340 140, 370 140" fill="none" stroke="currentColor" />
      <circle cx="220" cy="70" r="6" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="220" y="45" text-anchor="middle" fill="currentColor">local peak</text>
      <text x="230" y="165" text-anchor="middle" fill="currentColor">only neighboring basis functions overlap</text>
    </svg>
  </ExampleBlock>
</template>
