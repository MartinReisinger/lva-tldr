# Radiosity

## General

### Ray Tracing vs. Radiosity

- Ray Tracing and radiosity complement each other.
- Ray Tracing is good at:
  - Perfect specular reflections.
  - Refractions and transmissions.
  - Hard shadows.
- Ray Tracing is expensive for:
  - Diffuse inter-reflections.
  - Color bleeding.
  - Soft indirect light.
  - Scattering over many diffuse surfaces.
- Radiosity solves the diffuse-light problem.
- It is especially useful for indoor scenes where diffuse surfaces dominate.
- It is not efficient for specular reflection or refraction.

### Object Space vs. Image Space

- Ray Tracing is an image-space method.
  - It traces rays per pixel.
  - It is tied to the current camera view.
- Radiosity is an object-space method.
  - It computes light transfer between scene patches.
  - It is view independent.
  - The camera can move without recomputing radiosity.
  - Recompute only when scene geometry, lights, or materials change.

## Radiosity Setup

### Patches

- Split the scene into surface patches.
- Patches can be uniform or adaptive.
- Light sources are also approximated as patches.
- Compute light energy transfer from patch to patch.
- Cost is roughly `O(n^2)` for `n` patches.
- The low-resolution radiosity result is reconstructed onto the final scene.

### Radiosity Equation

- Radiosity `B_i` is the energy leaving patch `i` per unit area and time.
- It contains emitted light and reflected incoming light.

```math
B_i = E_i + \rho_i \sum_j F_{ij} B_j
```

- `E_i` is emission of patch `i`.
- `rho_i` is reflectance of patch `i`.
- `F_ij` is the form factor from patch `i` to patch `j`.
- `B_j` is radiosity of patch `j`.

## Form Factors

### Meaning

- A form factor describes how much light leaving one patch reaches another patch.
- It depends on:
  - Distance.
  - Orientation.
  - Visible area.
  - Occlusion.
- Form factors are reciprocal because light transport is symmetric when patch properties are swapped.

### Visibility

- Patches can be blocked by other geometry.
- Use a visibility factor `V_ij`.
- `V=1` means visible.
- `V=0` means blocked.
- Occlusion can remove transfer between patches.

### Exact Solution

- Exact surface-to-surface form factors need a double integral over both patch areas.
- This is too expensive for practical rendering.
- Practical methods approximate the integral.

## Computing Form Factors

### Nusselt Analog

- Place a hemisphere above a patch point.
- Project the other surface onto the hemisphere.
- Project the hemisphere onto the base disk.
- Projected area divided by `pi` gives the form factor contribution.

### Hemicube Method

- Approximate the hemisphere with a half cube.
- Center the hemicube above a patch point.
- Project scene polygons onto the cube faces.
- Use z-buffering for visibility.
- Sum the covered cell contributions.
- Advantage:
  - Uses standard graphics pipeline operations.
  - Can run on GPU.
- Disadvantage:
  - Discretization errors.
  - Aliasing, visibility, and proximity errors.
  - Higher resolution becomes slower.

### Area Sampling

- Subdivide the destination patch into small samples.
- Cast rays between the source point and destination samples.
- Add a contribution only if the ray is visible.
- It is slower than hemicube rendering.
- Accuracy can be increased as needed.
- It is preferred in modern implementations.

## Solving Radiosity

### Linear System

- Every patch contributes one equation.
- All equations together form a large linear system.
- Direct solving is usually infeasible.
- Gaussian elimination is around `O(n^3)`.
- Iterative methods are preferred.

### Gathering

- Compute one patch by gathering light from all other patches.
- Initialize emitting patches with `B=E`.
- Update patches repeatedly until convergence.
- Typical methods:
  - Jacobi.
  - Gauss-Seidel.

### Shooting

- Choose one patch and shoot its unshot energy to all other patches.
- Initialize emitting patches with `B=E`.
- Often shoot the patch with the highest unshot energy first.
- Typical method:
  - Southwell.
  - Progressive radiosity.

## Progressive Radiosity

- Iterative solutions produce usable images early.
- Every iteration improves the result.
- Stop when the image changes only slightly.
- Frame rate is inversely related to iteration cost.

## Light Bounces

### Neumann Series

- Radiosity can be interpreted as a sum of light bounces.
- `I` term means emission.
- `A` term means first bounce.
- `A^2` term means second bounce.
- `A^k` term means kth bounce.
- This is useful when only the first few bounces matter.

## Patch Subdivision

### Uniform Patches

- Uniform patches are simple.
- Low resolution creates artifacts:
  - Blocky shadows.
  - Discontinuities.
  - Rough indirect light.
- Increasing resolution everywhere is expensive.

### Adaptive Patches

- Refine only where needed:
  - Shadow borders.
  - Strong light changes.
  - High-detail regions.
- Keep unimportant regions coarse.
- This gives a better quality-cost tradeoff.

## Reconstruction

- Mesh surfaces into patches.
- Compute form factors.
- Solve the radiosity equation.
- Reconstruct or interpolate the low-resolution result.
- Remember:
  - Radiosity is best for diffuse, soft, indirect light.
  - Ray Tracing is best for specular effects, refraction, and hard shadows.
