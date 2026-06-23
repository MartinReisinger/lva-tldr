<script setup lang="ts">
defineProps<{
  variant:
    | 'radiosity-patches'
    | 'radiosity-equation'
    | 'form-factors'
    | 'area-sampling'
    | 'radiosity-gathering'
    | 'radiosity-shooting'
    | 'progressive-radiosity'
    | 'light-bounces'
    | 'patch-subdivision'
    | 'radiosity-reconstruction'
}>()
</script>

<template>
  <ExampleBlock v-if="variant === 'radiosity-patches'" title="Example: patch energy exchange">
    <svg viewBox="0 0 460 170" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Radiosity patch exchange">
      <defs><marker id="cg-radio-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
      <rect x="65" y="50" width="90" height="60" rx="4" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="110" y="85" text-anchor="middle" fill="currentColor">patch i</text>
      <rect x="305" y="50" width="90" height="60" rx="4" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="350" y="85" text-anchor="middle" fill="currentColor">patch j</text>
      <path d="M155 72 L305 72" fill="none" stroke="currentColor" marker-end="url(#cg-radio-arrow)" />
      <path d="M305 98 L155 98" fill="none" stroke="currentColor" marker-end="url(#cg-radio-arrow)" />
      <text x="230" y="62" text-anchor="middle" fill="currentColor">Fᵢⱼ</text>
      <text x="230" y="132" text-anchor="middle" fill="currentColor">object-space light transfer</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'radiosity-equation'" title="Example: radiosity equation">
    <div class="grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <code class="rounded bg-elevated px-3 py-2 text-center">Bᵢ</code>
      <UIcon name="i-lucide-equal" class="mx-auto size-5 text-primary" />
      <div class="flex flex-wrap justify-center gap-2">
        <code class="rounded bg-elevated px-3 py-2">Eᵢ</code>
        <code class="rounded bg-elevated px-3 py-2">ρᵢΣFᵢⱼBⱼ</code>
      </div>
    </div>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'form-factors'" title="Example: hemicube form factor">
    <svg viewBox="0 0 460 190" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Hemicube form factor">
      <path d="M145 138 L210 98 L275 138 Z" fill="var(--ui-bg)" stroke="currentColor" />
      <path d="M145 138 L145 80 L210 40 L210 98 Z" fill="var(--ui-bg)" stroke="currentColor" />
      <path d="M210 98 L210 40 L275 80 L275 138 Z" fill="var(--ui-bg)" stroke="currentColor" />
      <rect x="196" y="138" width="28" height="10" fill="currentColor" />
      <path d="M320 62 L395 86 L375 132 L300 112 Z" fill="var(--ui-bg)" stroke="currentColor" />
      <line x1="210" y1="138" x2="346" y2="96" stroke="currentColor" stroke-dasharray="5 5" />
      <text x="210" y="170" text-anchor="middle" fill="currentColor">projected cells</text>
      <text x="350" y="154" text-anchor="middle" fill="currentColor">visible patch</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'area-sampling'" title="Example: area sampling">
    <svg viewBox="0 0 460 170" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Area sampling">
      <defs><marker id="cg-area-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
      <circle cx="95" cy="88" r="22" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="95" y="93" text-anchor="middle" fill="currentColor">dAᵢ</text>
      <rect x="300" y="48" width="95" height="80" rx="4" fill="var(--ui-bg)" stroke="currentColor" />
      <g v-for="(p, i) in [[322,68], [356,68], [376,92], [332,110], [365,114]]" :key="i">
        <circle :cx="p[0]" :cy="p[1]" r="4" fill="var(--ui-primary)" />
        <path :d="`M117 88 L${p[0] - 5} ${p[1]}`" fill="none" stroke="currentColor" marker-end="url(#cg-area-arrow)" />
      </g>
      <text x="230" y="150" text-anchor="middle" fill="currentColor">cast sample rays; sum visible contributions</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'radiosity-gathering'" title="Example: gathering">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Radiosity gathering">
      <defs><marker id="cg-gather-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
      <circle cx="230" cy="90" r="25" fill="var(--ui-bg)" stroke="currentColor" /><text x="230" y="95" text-anchor="middle" fill="currentColor">i</text>
      <circle cx="95" cy="48" r="20" fill="var(--ui-bg)" stroke="currentColor" /><text x="95" y="53" text-anchor="middle" fill="currentColor">j₁</text>
      <circle cx="95" cy="132" r="20" fill="var(--ui-bg)" stroke="currentColor" /><text x="95" y="137" text-anchor="middle" fill="currentColor">j₂</text>
      <circle cx="365" cy="90" r="20" fill="var(--ui-bg)" stroke="currentColor" /><text x="365" y="95" text-anchor="middle" fill="currentColor">j₃</text>
      <path d="M114 54 L206 80" fill="none" stroke="currentColor" marker-end="url(#cg-gather-arrow)" />
      <path d="M114 126 L206 100" fill="none" stroke="currentColor" marker-end="url(#cg-gather-arrow)" />
      <path d="M345 90 L255 90" fill="none" stroke="currentColor" marker-end="url(#cg-gather-arrow)" />
      <text x="230" y="160" text-anchor="middle" fill="currentColor">Jacobi / Gauss-Seidel: update receiver i</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'radiosity-shooting'" title="Example: shooting">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Radiosity shooting">
      <defs><marker id="cg-shoot-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></marker></defs>
      <circle cx="120" cy="90" r="25" fill="var(--ui-bg)" stroke="currentColor" /><text x="120" y="95" text-anchor="middle" fill="currentColor">j</text>
      <circle cx="335" cy="45" r="20" fill="var(--ui-bg)" stroke="currentColor" /><text x="335" y="50" text-anchor="middle" fill="currentColor">i₁</text>
      <circle cx="355" cy="90" r="20" fill="var(--ui-bg)" stroke="currentColor" /><text x="355" y="95" text-anchor="middle" fill="currentColor">i₂</text>
      <circle cx="335" cy="135" r="20" fill="var(--ui-bg)" stroke="currentColor" /><text x="335" y="140" text-anchor="middle" fill="currentColor">i₃</text>
      <path d="M144 82 L315 50" fill="none" stroke="currentColor" marker-end="url(#cg-shoot-arrow)" />
      <path d="M145 90 L335 90" fill="none" stroke="currentColor" marker-end="url(#cg-shoot-arrow)" />
      <path d="M144 98 L315 130" fill="none" stroke="currentColor" marker-end="url(#cg-shoot-arrow)" />
      <text x="230" y="160" text-anchor="middle" fill="currentColor">Southwell / progressive: shoot source j</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else title="Example: radiosity pipeline">
    <div class="flex flex-wrap items-center justify-center gap-2 text-sm">
      <UBadge color="neutral" variant="outline">patches</UBadge>
      <UIcon name="i-lucide-arrow-right" class="size-4 text-primary" />
      <UBadge color="neutral" variant="outline">{{ variant === 'light-bounces' ? 'bounces' : variant === 'patch-subdivision' ? 'adaptive mesh' : variant === 'progressive-radiosity' ? 'iterations' : 'reconstruction' }}</UBadge>
      <UIcon name="i-lucide-arrow-right" class="size-4 text-primary" />
      <UBadge color="primary" variant="soft">diffuse result</UBadge>
    </div>
  </ExampleBlock>
</template>
