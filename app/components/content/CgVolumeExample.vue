<script setup lang="ts">
defineProps<{
  variant:
    | 'ct-scan'
    | 'volume-ray'
    | 'transfer-function'
    | 'texture-slices'
    | 'alpha-blending'
    | 'ray-volume-transform'
    | 'step-size'
    | 'volume-composition'
    | 'splatting'
    | 'gradient-shading'
    | 'marching-cubes'
}>()
</script>

<template>
  <ExampleBlock v-if="variant === 'ct-scan'" title="Example: CT slice reconstruction">
    <svg viewBox="0 0 460 170" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="CT scan rays">
      <defs><marker id="cg-ct-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
      <circle cx="230" cy="85" r="45" fill="var(--ui-bg)" stroke="currentColor" />
      <path d="M95 45 L365 125" stroke="currentColor" fill="none" marker-end="url(#cg-ct-arrow)" />
      <path d="M95 85 L365 85" stroke="currentColor" fill="none" marker-end="url(#cg-ct-arrow)" />
      <path d="M95 125 L365 45" stroke="currentColor" fill="none" marker-end="url(#cg-ct-arrow)" />
      <text x="230" y="155" text-anchor="middle" fill="currentColor">many projections reconstruct one slice</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'volume-ray'" title="Example: ray samples in a volume">
    <svg viewBox="0 0 460 190" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Volume ray samples">
      <defs><marker id="cg-volume-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
      <rect x="130" y="40" width="200" height="110" fill="var(--ui-bg)" stroke="currentColor" />
      <g opacity=".45">
        <line v-for="x in [170,210,250,290]" :key="`x-${x}`" :x1="x" y1="40" :x2="x" y2="150" stroke="currentColor" />
        <line v-for="y in [62,84,106,128]" :key="`y-${y}`" x1="130" :y1="y" x2="330" :y2="y" stroke="currentColor" />
      </g>
      <path d="M70 135 L370 55" fill="none" stroke="currentColor" marker-end="url(#cg-volume-arrow)" />
      <circle v-for="(p, i) in [[157,112], [197,101], [237,91], [277,80], [317,69]]" :key="i" :cx="p[0]" :cy="p[1]" r="5" fill="var(--ui-primary)" />
      <text x="230" y="175" text-anchor="middle" fill="currentColor">sample, interpolate, accumulate</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'transfer-function'" title="Example: transfer function">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Transfer function lookup">
      <defs><marker id="cg-transfer-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
      <rect x="55" y="62" width="80" height="56" rx="4" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="95" y="85" text-anchor="middle" fill="currentColor">density</text>
      <text x="95" y="105" text-anchor="middle" fill="currentColor">value</text>
      <path d="M135 90 L205 90" fill="none" stroke="currentColor" marker-end="url(#cg-transfer-arrow)" />
      <rect x="210" y="48" width="50" height="84" fill="var(--ui-bg)" stroke="currentColor" />
      <rect x="220" y="58" width="30" height="16" fill="var(--ui-bg)" stroke="currentColor" />
      <rect x="220" y="82" width="30" height="16" fill="var(--ui-primary)" opacity=".35" stroke="currentColor" />
      <rect x="220" y="106" width="30" height="16" fill="var(--ui-primary)" opacity=".7" stroke="currentColor" />
      <text x="235" y="35" text-anchor="middle" fill="currentColor">lookup</text>
      <path d="M260 90 L330 90" fill="none" stroke="currentColor" marker-end="url(#cg-transfer-arrow)" />
      <rect x="335" y="62" width="80" height="56" rx="4" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="375" y="85" text-anchor="middle" fill="currentColor">RGBA</text>
      <text x="375" y="105" text-anchor="middle" fill="currentColor">color + α</text>
      <text x="230" y="160" text-anchor="middle" fill="currentColor">raw samples become visible material properties</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'marching-cubes'" title="Example: marching cubes split">
    <svg viewBox="0 0 460 190" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Marching cubes split">
      <path d="M150 130 L150 65 L215 35 L280 65 L280 130 L215 160 Z" fill="var(--ui-bg)" stroke="currentColor" />
      <path d="M150 65 L215 95 L280 65 M215 35 L215 95 L215 160 M150 130 L215 95 L280 130" fill="none" stroke="currentColor" />
      <circle cx="150" cy="65" r="5" fill="var(--ui-primary)" />
      <circle cx="215" cy="35" r="5" fill="var(--ui-primary)" />
      <circle cx="280" cy="65" r="5" fill="var(--ui-bg)" stroke="currentColor" />
      <circle cx="150" cy="130" r="5" fill="var(--ui-bg)" stroke="currentColor" />
      <circle cx="215" cy="160" r="5" fill="var(--ui-bg)" stroke="currentColor" />
      <circle cx="280" cy="130" r="5" fill="var(--ui-bg)" stroke="currentColor" />
      <path d="M170 93 L215 60 L260 93 L230 126 L185 126 Z" fill="var(--ui-primary)" opacity=".2" stroke="currentColor" />
      <text x="230" y="182" text-anchor="middle" fill="currentColor">polygon separates above/below threshold corners</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else title="Example: volume rendering stage">
    <div class="flex flex-wrap items-center justify-center gap-2 text-sm">
      <UBadge color="neutral" variant="outline">{{ variant === 'texture-slices' ? '3D texture' : variant === 'alpha-blending' ? 'samples' : variant === 'ray-volume-transform' ? 'transform' : variant === 'step-size' ? 'step width' : variant === 'volume-composition' ? 'compose' : variant === 'splatting' ? 'project voxels' : 'gradient' }}</UBadge>
      <UIcon name="i-lucide-arrow-right" class="size-4 text-primary" />
      <UBadge color="primary" variant="soft">{{ variant === 'gradient-shading' ? 'surface normal' : 'pixel color' }}</UBadge>
    </div>
  </ExampleBlock>
</template>
