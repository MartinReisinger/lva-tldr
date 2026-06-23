# Volume Rendering

## General

### Volumetric Data

- Volume rendering visualizes 3D sampled data.
- Data can be measured, simulated, or computed procedurally.
- A volume can be understood as a stack of correlated 2D slices.
- Rendering the stack slice by slice is limited because it only works naturally from the slicing direction.

### Voxels and Cells

- A voxel is one discrete sample in the volume.
- A voxel is homogeneous and stores one measured or computed value.
- A cell is the cube between 8 neighboring voxels.
- Cells are inhomogeneous because values inside them are interpolated.
- Trilinear interpolation gives smoother intermediate values than nearest-neighbor sampling.

## CT Example

### Scanner Idea

- An X-ray source emits rays through the object.
- A detector measures the remaining intensity.
- The measured intensity gives absorption along the ray.
- The source and detector rotate around the object.
- Many projections are reconstructed into one 2D slice.
- Moving the object through the scanner creates a stack of slices.

### Reconstruction

- Absorption along a ray is a line integral.
- CT reconstruction inverts these projections.
- Important terms:
  - Radon transform maps object densities to projections.
  - Filtered backprojection reconstructs slices from projections.

## Transfer Functions

### Purpose

- Raw volume values are scalar data such as density, absorption, pressure, or simulation values.
- A transfer function maps scalar values to RGBA.
- It assigns color and opacity.
- Example mapping:
  - Air is transparent.
  - Soft tissue is semi-transparent.
  - Bone is opaque and bright.

### Importance

- The transfer function decides what becomes visible.
- A poor transfer function hides important structures.
- A good transfer function separates materials and features.
- It can be a lookup table or a more complex function.

## Texture-Based Rendering

### 3D Texture Slicing

- Store the volume as a 3D texture.
- Render many parallel polygons through the volume.
- Texture-map them with 3D texture coordinates.
- Render back-to-front with alpha blending.
- Slices can be axis aligned or view aligned.

### Tradeoff

- The method is hardware accelerated and simple on GPUs.
- Quality depends on slice count and orientation.
- View-aligned slices need updates when the camera changes.

## Alpha Blending

- Each sample has color `C` and opacity `alpha`.
- `alpha=0` means fully transparent.
- `alpha=1` means fully opaque.
- Colors and opacities are accumulated along the viewing direction.
- Once enough opacity is accumulated, deeper samples no longer matter.

## Image-Order Rendering

### Ray Casting

- Cast one ray through the volume for every pixel.
- Traverse the volume along the ray.
- Sample density, color, and opacity at positions on the ray.
- Accumulate samples into the final pixel.
- This is also called image-order rendering, pixel-space traversal, or back projection.

### Ray Casting vs. Ray Tracing

- Volume ray casting usually follows one ray direction through the volume.
- It does not recursively spawn secondary rays by default.
- Ray Tracing traces secondary rays for reflection, refraction, and shadows.

## Ray Transform vs. Volume Transform

### Ray Transform

- Keep the volume fixed.
- Inversely transform every ray into volume space.
- For every sample:
  - Find the cell.
  - Interpolate values trilinearly.
  - Accumulate color and opacity.
- Advantage: the whole volume does not need to be resampled.
- Disadvantage: interpolation happens many times during traversal.

### Volume Transform

- Transform or resample the volume first.
- Cast regular untransformed rays afterward.
- The transformation can be decomposed into shear operations.
- After each shear, voxel values need interpolation.
- Advantage: ray traversal becomes more regular.
- Disadvantage: resampling can blur data and costs memory and time.

## Step Size

- Too large:
  - Small details are missed.
  - Aliasing increases.
- Too small:
  - Rendering becomes slow.
  - Too many samples are evaluated.
- Adaptive or scan-conversion techniques balance speed and quality better than a naive constant step width.

## Composition and Acceleration

### Composition Functions

- Average: average all sampled values.
- Maximum intensity projection: take the strongest value along a ray.
- Distance: encode distance to the first or most important hit.
- Alpha compositing: accumulate transparency and color.

### Acceleration

- Early stopping:
  - Stop a ray when accumulated opacity is high enough.
- Empty-space skipping:
  - Skip regions below an opacity threshold.
  - Octrees or other space partitions can help.
- Bricking:
  - Split huge volumes into smaller chunks.
  - Load or render bricks sequentially if the full volume does not fit in memory.

## Object-Order Rendering

### Voxel Projection

- Traverse voxels or voxel planes.
- Project them onto the image plane.
- Accumulate into the framebuffer.
- This is also called object-order rendering, voxel-space traversal, or forward projection.

### Traversal Order

- Front-to-back traversal can stop early when opacity is sufficient.
- Back-to-front traversal gives direct alpha blending and shows contributions sequentially.

### Splatting

- Projecting only voxel centers can create holes.
- Splatting spreads each voxel over nearby pixels.
- A filter footprint, often Gaussian, weights the contribution.
- With orthographic projection, the same footprint can be precomputed.

## Surfaces in Volumes

### Gradient Shading

- If a voxel contains a surface fragment, recover a normal from the local gradient.
- The gradient direction approximates the surface normal `N`.
- If the gradient length is zero, the region is homogeneous and contains no surface.
- Use `N / |N|` for Phong shading.
- Use `|N|` to weight the strength of the surface contribution.

### Limitation

- Gradient shading does not recover real occlusion from the light source to the surface.
- It gives a local shading look but does not extract an actual mesh.

## Isosurface Extraction

### Marching Cubes

- Choose an isovalue threshold.
- Process one cube or cell after another.
- Classify all 8 cube corners as above or below the threshold.
- Place polygons that separate both corner sets.
- There are `2^8 = 256` cases.
- Symmetry reduces them to 15 unique cases.
- Interpolate along cube edges to get accurate polygon positions.
- The final mesh can be rendered normally.

### When to Use

- Direct volume rendering is useful for semi-transparent and internal structures.
- Marching cubes is useful when one clear surface should become a triangle mesh.
