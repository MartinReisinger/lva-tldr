<script setup lang="ts">
type Variant =
  | 'ray-basics'
  | 'ray-effects'
  | 'ray-acceleration'
  | 'ray-distribution'
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
  | 'data-types'
  | 'scalar-contours'
  | 'vector-field'
  | 'tensor-field'
  | 'stream-tube'
  | 'bezier'
  | 'bezier-surface'
  | 'bspline'

const props = defineProps<{ variant: Variant }>()

const rayVariants = ['ray-basics', 'ray-effects', 'ray-acceleration', 'ray-distribution'] as const
const radiosityVariants = ['radiosity-patches', 'radiosity-equation', 'form-factors', 'area-sampling', 'radiosity-gathering', 'radiosity-shooting', 'progressive-radiosity', 'light-bounces', 'patch-subdivision', 'radiosity-reconstruction'] as const
const volumeVariants = ['ct-scan', 'volume-ray', 'transfer-function', 'texture-slices', 'alpha-blending', 'ray-volume-transform', 'step-size', 'volume-composition', 'splatting', 'gradient-shading', 'marching-cubes'] as const
const dataVariants = ['data-types', 'scalar-contours', 'vector-field', 'tensor-field', 'stream-tube'] as const
const curveVariants = ['bezier', 'bezier-surface', 'bspline'] as const
</script>

<template>
  <CgRayExample
    v-if="rayVariants.includes(props.variant as typeof rayVariants[number])"
    :variant="props.variant as typeof rayVariants[number]"
  />
  <CgRadiosityExample
    v-else-if="radiosityVariants.includes(props.variant as typeof radiosityVariants[number])"
    :variant="props.variant as typeof radiosityVariants[number]"
  />
  <CgVolumeExample
    v-else-if="volumeVariants.includes(props.variant as typeof volumeVariants[number])"
    :variant="props.variant as typeof volumeVariants[number]"
  />
  <CgDataExample
    v-else-if="dataVariants.includes(props.variant as typeof dataVariants[number])"
    :variant="props.variant as typeof dataVariants[number]"
  />
  <CgCurveExample
    v-else-if="curveVariants.includes(props.variant as typeof curveVariants[number])"
    :variant="props.variant as typeof curveVariants[number]"
  />
</template>
