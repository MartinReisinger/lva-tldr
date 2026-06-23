# Curves and Surfaces

## General

### Why Not Only Triangles

- Piece-wise linear geometry is easy.
- Examples include line segments, triangles, and cells.
- Complex smooth shapes need many tiny pieces.
- Too few pieces create visible discontinuities.
- Too many pieces are hard to model and animate manually.
- A better approach is to define a few control points and compute intermediate curve or surface points by interpolation.

## Interpolation Recap

### Bilinear Interpolation

- Interpolation computes a weighted sum of control points.
- In 2D, use parameters u and v.
- Bilinear interpolation works for patches and quads.
- Four control points do not need to be coplanar.
- Parameter values decide influence weights.
- The weights sum to 1.

### Trilinear Interpolation

- Trilinear interpolation is the 3D version.
- It uses parameters x, y, and z.
- It is used inside cube or hexahedron cells.
- It interpolates from 8 corner values.
- It is smoother than nearest-neighbor sampling.

### Cell Types

- Interpolation depends on the cell type.
- Common cells:
  - Vertex.
  - Line.
  - Triangle.
  - Quad.
  - Tetrahedron.
  - Hexahedron.

## Piece-Wise Linear Interpolation

### Idea

- Complex geometry is stitched from independent linear pieces.
- Line segments approximate a curve.
- Triangles approximate a surface.
- Cubes or cells approximate a volume.
- The result is polygonal or polyhedral.

### Limitation

- It is good for simple shapes.
- It is bad for smooth complex surfaces unless the resolution is high.
- Patch and cell borders can become visible.
- Modeling and animation become inefficient.

## Splines

### Idea

- A spline is an interpolated curve generated from control points or a control polygon.
- A spline surface extends the same idea to surfaces.
- Instead of manually placing every triangle:
  - Place control points.
  - Use basis or blending functions.
  - Compute intermediate points.

### Control Polygon

- The control polygon connects the control points with line segments.
- The curve follows the general shape of the control polygon.
- It does not necessarily pass through every control point.
- The beginning and end of a Bézier curve are tangent to the control polygon.

## Quadratic Bézier Curves

### Construction

- A quadratic Bézier curve has 3 control points.
- It has degree 2.
- It has 3 basis functions.
- It can be built by recursive midpoint subdivision.
- Repeated corner cutting converges to a smooth limit curve.

### Formula

```math
p(t) = (1-t)^2p_0 + 2(1-t)t p_1 + t^2p_2
```

- t ranges from 0 to 1.
- The weights are normalized and always sum to 1.
- p0 has maximum influence at t equals 0.
- p1 has maximum influence around t equals one half.
- p2 has maximum influence at t equals 1.

## Cubic Bézier Curves

### Construction

- A cubic Bézier curve has 4 control points.
- It has degree 3.
- It has 4 basis functions.
- It uses the same recursive subdivision idea.
- It is common in modeling because it is still cheap and flexible.

### Formula

```math
p(t) =
(1-t)^3p_0
+ 3(1-t)^2t p_1
+ 3(1-t)t^2 p_2
+ t^3p_3
```

## Higher-Order Bézier Curves

### Rule

- N control points produce degree N minus 1.
- The number of basis functions equals the number of control points.
- Coefficients follow the binomial pattern.

### Advantages

- They are a simple generalization.
- They are easy to implement recursively.
- All weights still sum to 1.
- Endpoints are controlled exactly.

### Disadvantages

- High-degree polynomials become inefficient and unstable.
- Every control point influences almost the whole curve.
- Moving one control point changes too much.
- For many control points, Bézier curves are not the best choice.

## Bézier Surfaces

### Idea

- Bézier surfaces extend Bézier curves to two parameters u and v.
- Use a 2D grid of 3D control points.
- A 2D blending function is the product of two 1D blending functions.
- The surface point is a weighted sum of all control points.

### Rectangular Base

- Bézier surfaces work naturally for rectangular parameter domains.
- Control points form a grid.
- The number of control points can differ in both directions.

### Trimming

- Not every useful surface is rectangular.
- A trimming curve restricts the parameter space.
- Parameter values outside the trimming boundary are ignored.
- A trimming curve can be polygonal or a spline.

## B-Splines

### Motivation

- Bézier curves have two main problems:
  - Many control points create high-degree polynomials.
  - They have poor local control.
- B-splines solve this with local basis functions.
- Basis functions are pieces of low-degree polynomials.
- Each control point influences only a local parameter region.

### Uniform B-Splines

- The same basis function is shifted along the parameter axis.
- The parameter range is larger than 0 to 1.
- Contributions of overlapping basis functions are summed.
- At each parameter value, the weights still sum to 1.
- Moving one control point changes only a nearby curve region.

### Uniform Cubic B-Splines

- A cubic basis function is made from four polynomial segments.
- Each segment is evaluated in a local range from 0 to 1.
- One control point influences roughly t equals i minus 2 to t equals i plus 2.
- The global ends are limited because not enough neighboring functions exist there.

## Non-Cubic B-Splines

- Cubic B-splines are only one option.
- Lower-order B-splines have smaller influence regions and less smoothness.
- Higher-order B-splines have larger influence regions and more smoothness.
- Basis functions can be computed recursively after mapping t to the local range.

## NURBS

### Meaning

- NURBS means non-uniform rational B-splines.
- Non-uniform means the knot or parameter gaps do not need to be equal.
- Rational means the blending function is a ratio of two polynomials.

### Advantage

- NURBS can represent conics exactly.
- Examples include circles, cylinders, and spheres.
- They are preferred in CAD and precise modeling.
- They are more practical than plain uniform B-splines for many engineering shapes.

## Remember

- Linear interpolation is cheap but needs many pieces.
- Bézier curves are simple and smooth but have poor local control for many points.
- B-splines give local control with low-degree polynomial pieces.
- NURBS extend B-splines for exact conics and practical modeling.
