# Scientific Data Visualization

## General

### Rendering vs. Visualization

- Rendering displays synthetic or modeled scenes.
- Visualization displays measured or simulated data.
- The goal is to make complicated datasets easier to interpret.
- Volume rendering is better understood as volume visualization because it visualizes sampled data.

### Data Types

- Scalar data has one value per point.
  - Examples: density, pressure, temperature, and height.
- Vector data has a tuple of values per point.
  - Examples: velocity, direction, and force.
- Tensor data describes directional behavior with higher-dimensional attributes.
  - Examples: curvature, diffusion, stress, and strain.

## Sampled Data

### Sampling and Reconstruction

- Continuous data must be sampled before it can be visualized.
- Reconstruction approximates continuous data from samples.
- Interpolation uses weighted sums of basis functions.
- Basis function choice is a tradeoff:
  - Simple functions are cheap but low quality.
  - Higher-order functions are smoother but more expensive.

### Basis Functions

- Constant basis functions are nearest-neighbor reconstruction.
- They are cheap but produce blocky results.
- Linear basis functions improve continuity.
- Linear interpolation depends on the cell type.

## Cells and Grids

### Cell Types

- Vertices are sample points.
- Common cells:
  - Vertex.
  - Line.
  - Triangle.
  - Quad.
  - Tetrahedron.
  - Hexahedron.
- Interpolation depends on the cell.
- Triangles usually use linear or barycentric interpolation.
- Hexahedra usually use trilinear interpolation.

### Grid Types

- Uniform grid:
  - Equal spacing.
  - Simple but not always optimal.
- Rectilinear grid:
  - Axis-aligned with non-uniform spacing.
  - Resolution changes only along axes.
- Structured grid:
  - Sample points can move freely.
  - Topology stays fixed.
- Unstructured grid:
  - No fixed topological order.
  - Flexible but harder to process.

## Scalar Fields

### Visualization Options

- Map scalar values to:
  - Intensity.
  - Color.
  - Texture.
  - Opacity.
  - Contours or isolines.
  - Isosurfaces.
- Scalar visualization can be combined with vector and tensor visualization.

### Isosurfaces

- An isosurface is the set of all 3D points with the same scalar value.
- It is commonly extracted with marching cubes.
- It is useful when one meaningful boundary exists.

### Isolines

- An isoline is the set of all 2D points with the same scalar value.
- Marching squares extracts isolines.
- It is the 2D version of marching cubes.

### Marching Squares and Marching Cubes

- Marching squares has 4 corners and `2^4 = 16` cases.
- Symmetry reduces this to four unique cases.
- Marching cubes has 8 corners and `2^8 = 256` cases.
- Symmetry reduces this to 15 unique cases.
- Ambiguity can happen.
- Alternatives such as marching triangles or marching tetrahedra can avoid some ambiguity.

### Slicing vs. Contouring

- Slicing and contouring are commutative.
- Slicing a volume and then computing isolines is equivalent to computing an isosurface and then slicing it.
- This means a 3D isosurface can be assembled from 2D isolines on parallel slices.

## Vector Fields

### Vector Data

- Vector data usually stores 2D or 3D tuples.
- A common application is computational fluid dynamics.
- Per time step, the simulation can store:
  - Velocity.
  - Pressure.
  - Density.
  - Divergence.
  - Vorticity.

### Vector Glyphs

- A glyph is a small icon placed in the field.
- Glyphs can encode position, orientation, direction, size, magnitude, and color.
- Examples include lines, hedgehogs, arrows, and cones.
- The vector field is usually subsampled.
- High sampling density shows more data but creates clutter.
- Low sampling density is cleaner but can miss detail.
- Random sampling can reduce artifacts from a regular sampling grid.

### 3D Glyphs

- 3D glyphs have the same meaning as 2D glyphs.
- Occlusion becomes a major limitation.
- Transparency can help, especially with grayscale color maps.

## Stream Lines

### Idea

- Start at a seed point.
- Follow the vector field step by step.
- Connect computed points into a line.
- Stop when an exit criterion is reached.

### Euler Integration

```math
p_{n+1} = p_n + \Delta t \cdot v(p_n)
```

- Delta t is an integration parameter, not physical time for a static vector field.
- Runge-Kutta integration gives better quality than Euler integration.

### Quality

- Streamline quality depends on seed point density, seed distribution, and step width.
- Too many streamlines create clutter.
- Too few streamlines miss structure.
- Parameters can be adapted locally.

## Stream Tubes

- A stream tube sweeps a circular cross section along a streamline.
- Tube diameter can encode another scalar.
- Color can encode another property.
- Stream tubes can be traced downstream, upstream, or in both directions.

## Tensor Fields

### Tensors

- A tensor generalizes scalars and vectors.
- Rank examples:
  - Scalar: rank 0.
  - Vector: rank 1.
  - Matrix or Hessian: rank 2.
- Tensors describe direction-dependent quantities such as curvature, diffusion, stress, and strain.

### Curvature

- Planar curve curvature uses the second derivative.
- Surface curvature depends on direction.
- For a surface point, choose direction s.
- Curvature in direction s can be expressed with Hessian H.

```math
c(s) = s^T H s
```

## PCA and Eigenvectors

- Tensor visualization often focuses on extreme directions.
- Eigendecomposition gives principal directions and magnitudes.
- Eigenvectors are the principal directions.
- Eigenvalues are the strengths in those directions.
- Isotropic behavior has similar eigenvalues.
- Anisotropic behavior has one or more dominant eigenvalues.

## Tensor Glyphs

- Tensor glyphs generalize vector glyphs.
- They encode eigenvectors as directions.
- They encode eigenvalues as size or shape.
- Common glyph shapes include ellipsoids, cuboids, cylinders, and superquadrics.
- They suffer from clutter, occlusion, and sampling-density problems.

## Fiber Tracking

- Fiber tracking is used for tensor data such as DT-MRI.
- It constructs streamlines along major eigenvectors.
- It needs strong anisotropy to be stable.
- Seed point choice is critical.
- Plain fiber streamlines show direction and path but do not encode all eigenvalues.

## Hyper-Streamlines

- Hyper-streamlines are stream tubes for tensor fields.
- They follow the major eigenvector field.
- The tube cross section is elliptical.
- The ellipse axes follow the medium and minor eigenvectors.
- The ellipse radii scale with the corresponding eigenvalues.
