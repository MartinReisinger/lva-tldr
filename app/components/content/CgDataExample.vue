<script setup lang="ts">
defineProps<{ variant: 'data-types' | 'scalar-contours' | 'vector-field' | 'tensor-field' | 'stream-tube' }>()
</script>

<template>
  <ExampleBlock v-if="variant === 'data-types'" title="Example: scalar, vector, tensor">
    <svg viewBox="0 0 460 170" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Scalar vector tensor comparison">
      <g transform="translate(90 75)">
        <circle r="25" fill="var(--ui-bg)" stroke="currentColor" />
        <text y="5" text-anchor="middle" fill="currentColor">7</text>
        <text y="58" text-anchor="middle" fill="currentColor">scalar</text>
      </g>

      <g transform="translate(230 75)">
        <defs>
          <marker id="cg-data-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
          </marker>
        </defs>
        <circle r="25" fill="var(--ui-bg)" stroke="currentColor" />
        <path d="M-12 12 L13 -13" fill="none" stroke="currentColor" marker-end="url(#cg-data-arrow)" />
        <text y="58" text-anchor="middle" fill="currentColor">vector</text>
      </g>

      <g transform="translate(370 75)">
        <ellipse rx="38" ry="16" fill="var(--ui-bg)" stroke="currentColor" transform="rotate(-25)" />
        <line x1="-34" y1="16" x2="34" y2="-16" stroke="currentColor" />
        <line x1="-7" y1="-15" x2="7" y2="15" stroke="currentColor" stroke-dasharray="4 4" />
        <text y="58" text-anchor="middle" fill="currentColor">tensor</text>
      </g>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'scalar-contours'" title="Example: scalar contours">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Scalar contour lines">
      <rect x="90" y="45" width="280" height="90" rx="4" fill="var(--ui-bg)" stroke="currentColor" />
      <path d="M110 118 C150 82, 185 88, 220 65 C258 40, 300 70, 350 55" fill="none" stroke="currentColor" />
      <path d="M120 135 C155 105, 200 110, 238 86 C280 60, 312 90, 360 78" fill="none" stroke="currentColor" />
      <path d="M106 98 C138 62, 180 67, 205 48" fill="none" stroke="var(--ui-primary)" stroke-width="4" />
      <line x1="90" y1="90" x2="370" y2="90" stroke="currentColor" stroke-dasharray="5 5" />
      <text x="230" y="32" text-anchor="middle" fill="currentColor">same scalar value forms a line</text>
      <text x="230" y="158" text-anchor="middle" fill="currentColor">slice + contour equals contour + slice</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'vector-field'" title="Example: streamline through a vector field">
    <svg viewBox="0 0 460 190" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Streamline through a vector field">
      <defs>
        <marker id="cg-vector-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
        <marker id="cg-stream-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--ui-primary)" />
        </marker>
      </defs>

      <rect x="70" y="35" width="320" height="115" rx="4" fill="var(--ui-bg)" stroke="currentColor" />
      <g opacity=".85">
        <line v-for="(p, i) in [[95,125,123,105],[95,90,126,74],[95,55,126,48],[165,125,194,100],[165,90,198,77],[165,55,198,52],[235,125,266,104],[235,90,270,83],[235,55,268,62],[305,125,338,112],[305,90,340,92],[305,55,336,72]]" :key="i" :x1="p[0]" :y1="p[1]" :x2="p[2]" :y2="p[3]" stroke="currentColor" marker-end="url(#cg-vector-arrow)" />
      </g>
      <path d="M92 133 C132 96, 165 82, 205 76 C255 68, 305 82, 365 53" fill="none" stroke="var(--ui-primary)" stroke-width="4" marker-end="url(#cg-stream-arrow)" />
      <circle cx="92" cy="133" r="5" fill="var(--ui-bg)" stroke="currentColor" />
      <text x="230" y="24" text-anchor="middle" fill="currentColor">streamline follows the sampled field</text>
      <text x="230" y="174" text-anchor="middle" fill="currentColor">glyphs are local directions; integration connects them</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else-if="variant === 'tensor-field'" title="Example: tensor principal axes">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Tensor principal axes">
      <defs>
        <marker id="cg-tensor-major" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--ui-primary)" />
        </marker>
        <marker id="cg-tensor-minor" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
      </defs>
      <ellipse cx="230" cy="90" rx="105" ry="34" fill="var(--ui-bg)" stroke="currentColor" transform="rotate(-18 230 90)" />
      <path d="M170 110 L317 62" stroke="var(--ui-primary)" stroke-width="4" fill="none" marker-end="url(#cg-tensor-major)" />
      <path d="M220 58 L239 119" stroke="currentColor" fill="none" stroke-dasharray="5 5" marker-end="url(#cg-tensor-minor)" />
      <text x="345" y="58" fill="currentColor">major vector</text>
      <text x="248" y="140" fill="currentColor">minor vector</text>
      <text x="230" y="165" text-anchor="middle" fill="currentColor">eigenvectors give directions; eigenvalues give size</text>
    </svg>
  </ExampleBlock>

  <ExampleBlock v-else title="Example: stream tube cross sections">
    <svg viewBox="0 0 460 180" class="graph-svg mx-auto w-full max-w-md" role="img" aria-label="Stream tube cross sections">
      <path d="M75 125 C130 58, 190 65, 250 92 C305 116, 340 80, 395 50" fill="none" stroke="var(--ui-primary)" stroke-width="4" />
      <ellipse cx="130" cy="82" rx="13" ry="22" fill="var(--ui-bg)" stroke="currentColor" transform="rotate(35 130 82)" />
      <ellipse cx="245" cy="92" rx="18" ry="28" fill="var(--ui-bg)" stroke="currentColor" transform="rotate(-68 245 92)" />
      <ellipse cx="350" cy="73" rx="11" ry="20" fill="var(--ui-bg)" stroke="currentColor" transform="rotate(55 350 73)" />
      <text x="230" y="34" text-anchor="middle" fill="currentColor">tube follows flow; radius can encode data</text>
      <text x="230" y="158" text-anchor="middle" fill="currentColor">hyper-streamlines use tensor eigenvalues for radii</text>
    </svg>
  </ExampleBlock>
</template>
