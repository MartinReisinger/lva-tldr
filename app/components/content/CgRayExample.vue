<script setup lang="ts">
defineProps<{ variant: 'ray-basics' | 'ray-effects' | 'ray-acceleration' | 'ray-distribution' }>()
</script>

<template>
  <ExampleBlock v-if="variant === 'ray-basics'" title="Example: primary viewing rays">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Primary viewing rays">
      <defs>
        <marker id="cg-ray-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
      </defs>

      <circle cx="65" cy="90" r="25" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="65" y="95" text-anchor="middle" fill="currentColor">e</text>

      <line x1="165" y1="35" x2="165" y2="145" stroke="currentColor" />
      <text x="165" y="162" text-anchor="middle" fill="currentColor">screen</text>

      <circle cx="165" cy="60" r="4" fill="currentColor" />
      <circle cx="165" cy="90" r="4" fill="currentColor" />
      <circle cx="165" cy="120" r="4" fill="currentColor" />

      <path d="M90 82 L260 45" fill="none" stroke="currentColor" marker-end="url(#cg-ray-arrow)" />
      <path d="M91 90 L276 90" fill="none" stroke="currentColor" marker-end="url(#cg-ray-arrow)" />
      <path d="M90 98 L260 135" fill="none" stroke="currentColor" marker-end="url(#cg-ray-arrow)" />

      <circle cx="315" cy="90" r="38" fill="var(--ui-bg)" stroke="currentColor" />
      <path d="M300 116 L332 116 L315 68 Z" fill="var(--ui-primary)" opacity=".2" stroke="currentColor" />
      <text x="315" y="155" text-anchor="middle" fill="currentColor">first intersection wins</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'ray-effects'" title="Example: secondary rays">
    <svg viewBox="0 0 460 190" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Secondary rays">
      <defs>
        <marker id="cg-effect-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
      </defs>

      <circle cx="75" cy="95" r="25" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="75" y="100" text-anchor="middle" fill="currentColor">eye</text>
      <path d="M100 95 L205 95" fill="none" stroke="currentColor" marker-end="url(#cg-effect-arrow)" />
      <text x="150" y="83" text-anchor="middle" fill="currentColor">primary</text>

      <circle cx="230" cy="95" r="25" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="230" y="100" text-anchor="middle" fill="currentColor">hit</text>

      <path d="M248 77 L338 32" fill="none" stroke="currentColor" marker-end="url(#cg-effect-arrow)" />
      <text x="295" y="32" text-anchor="middle" fill="currentColor">shadow</text>
      <circle cx="365" cy="25" r="15" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="365" y="30" text-anchor="middle" fill="currentColor">*</text>

      <path d="M255 95 L360 95" fill="none" stroke="currentColor" marker-end="url(#cg-effect-arrow)" />
      <text x="310" y="84" text-anchor="middle" fill="currentColor">reflection</text>

      <path d="M248 113 L338 158" fill="none" stroke="currentColor" marker-end="url(#cg-effect-arrow)" />
      <text x="292" y="170" text-anchor="middle" fill="currentColor">refraction</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'ray-acceleration'" title="Example: acceleration hierarchy">
    <svg viewBox="0 0 460 210" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Ray tracing acceleration hierarchy">
      <defs>
        <marker id="cg-bvh-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
      </defs>

      <circle cx="230" cy="35" r="25" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="230" y="40" text-anchor="middle" fill="currentColor">box</text>

      <path d="M214 55 L155 105" fill="none" stroke="currentColor" marker-end="url(#cg-bvh-arrow)" />
      <path d="M246 55 L305 105" fill="none" stroke="currentColor" marker-end="url(#cg-bvh-arrow)" />

      <circle cx="135" cy="125" r="25" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="135" y="130" text-anchor="middle" fill="currentColor">hit</text>
      <circle cx="325" cy="125" r="25" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="325" y="130" text-anchor="middle" fill="currentColor">skip</text>

      <path d="M160 125 L235 125" fill="none" stroke="currentColor" marker-end="url(#cg-bvh-arrow)" />
      <text x="200" y="112" text-anchor="middle" fill="currentColor">test triangles</text>
      <path d="M245 145 L280 170 L315 145 Z" fill="var(--ui-primary)" opacity=".2" stroke="currentColor" />
      <text x="280" y="194" text-anchor="middle" fill="currentColor">only after a box hit</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else title="Example: distribution ray tracing">
    <svg viewBox="0 0 460 190" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Distribution ray tracing">
      <defs>
        <marker id="cg-dist-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
      </defs>

      <circle cx="105" cy="95" r="25" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="105" y="100" text-anchor="middle" fill="currentColor">hit</text>
      <path d="M128 86 L270 42" fill="none" stroke="currentColor" marker-end="url(#cg-dist-arrow)" />
      <path d="M130 95 L285 95" fill="none" stroke="currentColor" marker-end="url(#cg-dist-arrow)" />
      <path d="M128 104 L270 148" fill="none" stroke="currentColor" marker-end="url(#cg-dist-arrow)" />
      <path d="M127 91 L255 70" fill="none" stroke="currentColor" stroke-dasharray="5 5" marker-end="url(#cg-dist-arrow)" />
      <path d="M127 99 L255 120" fill="none" stroke="currentColor" stroke-dasharray="5 5" marker-end="url(#cg-dist-arrow)" />
      <line x1="320" y1="40" x2="320" y2="150" stroke="currentColor" />
      <text x="320" y="32" text-anchor="middle" fill="currentColor">area light / lens</text>
      <text x="215" y="174" text-anchor="middle" fill="currentColor">many samples average into soft effects</text>
    </svg>
  </ExampleBlock>
</template>
