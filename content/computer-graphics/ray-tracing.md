---
title: Ray Tracing
description: Pixel-first global illumination, intersections, secondary rays, and acceleration structures.
order: 1
kind: topic
downloadPath: /content/computer-graphics/ray-tracing.md
updatedAt: "2026-06-23T09:54:24+02:00"
---

## General

### Ray Casting

- Ray casting traces only primary rays.
- It can replace rasterization plus depth buffering for visible-surface selection.
- It is especially important as a basis for volume rendering.
- If the first hit is shaded only with a local illumination model, the method is ray casting, not full ray tracing.

::cg-example{variant="ray-basics"}
::

### Ray Equation

- A ray starts at the camera position $e$ and passes through a screen point $s$.
- The parametric ray equation is:

$$
p(t) = e + t(s - e)
$$

- $t=0$ gives the camera position.
- $t=1$ gives the screen point.
- Only intersections with $t>0$ are in front of the camera.

### Ray-Object Intersections

- For implicit objects, insert the ray equation into the object equation and solve for $t$.
- For triangles, equalize the ray equation and the triangle plane equation.
- This gives three equations and three unknowns:
  - $t$.
  - $\beta$.
  - $\gamma$.
- The checks should be ordered to avoid unnecessary work:
  - Compute and validate $t$.
  - Then validate $\gamma$.
  - Then validate $\beta$.
- The barycentric coordinates decide whether the hit lies inside the triangle.

## Computational Cost

### Main Cost Drivers

- Cost mainly depends on the number of pixels and rays.
- Higher image resolution means more primary rays.
- Distribution effects multiply the number of secondary rays.
- Triangle count can be handled sub-linearly with acceleration structures.

### Acceleration Structures

- Object partitioning:
  - Put bounding boxes around objects or groups of triangles.
  - Traverse a bounding volume hierarchy before testing triangles.
  - Test triangles only inside hit boxes.
- Space partitioning:
  - Split the scene into cells.
  - Examples: BSP trees and Kd-trees.
  - Traverse only cells crossed by the ray.
- These structures reduce intersection tests dramatically.

::cg-example{variant="ray-acceleration"}
::

### Hardware

- Ray Tracing is embarrassingly parallel because pixels are mostly independent.
- Useful hardware:
  - Multi-core CPUs.
  - GPUs.
  - Render farms.
  - Specialized ray tracing units.
- Recursive ray traversal is harder for traditional GPU pipelines, so real-time systems often use hybrid rendering.

## Secondary-Ray Effects

### Shadows

- Hard shadows are cheap.
- Cast one shadow ray from the hit point to a point light.
- If the ray is blocked, the point is in shadow.
- If the ray reaches the light, the point is illuminated.

### Soft Shadows

- Soft shadows need distribution ray tracing.
- Cast many shadow rays toward an area light.
- The fraction of unblocked rays determines shadow intensity.
- Larger light sources create wider penumbra regions.

::cg-example{variant="ray-effects"}
::

### Reflections

- Perfect reflections are relatively cheap.
- Compute the surface normal at the hit point.
- Reflect the incoming direction around the normal.
- Trace the reflected ray recursively.
- Backpropagate the returned color contribution.

### Glossy Reflections

- Glossy reflections need distribution ray tracing.
- Spawn multiple slightly perturbed reflection rays.
- Average their results.
- Wider distributions create blurrier reflections.

::cg-example{variant="ray-distribution"}
::

### Refractions

- Refraction happens when a ray hits transparent material.
- Use the material's refraction index and Snell's law to compute the transmitted direction.
- Trace the refracted ray recursively.
- Wavelength-dependent refraction can produce chromatic aberration.

### Depth of Field

- Depth of field needs distribution ray tracing.
- Use multiple camera rays through a focal plane.
- Rays start from different positions on a finite lens area.
- Points on the focal plane stay sharp.
- Points away from the focal plane are averaged into blur.

### Color Bleeding

- Color bleeding is indirect diffuse reflection of surface color onto other surfaces.
- It needs many random secondary rays.
- Pure ray tracing is inefficient for strong diffuse inter-reflection.
- Radiosity is better suited for that case.

## Path Tracing

### Distribution Ray Tracing

- Distribution ray tracing uses multiple randomly selected rays per effect.
- Quality depends on the number of samples.
- It supports:
  - Soft shadows.
  - Glossy reflections.
  - Depth of field.
  - Antialiasing.
- It is expensive because every additional sample can spawn more work.

### Bidirectional Path Tracing

- Ordinary path tracing shoots paths from the camera.
- Bidirectional path tracing shoots paths from both the camera and the light.
- This is more efficient for difficult light transport.
- It helps with effects such as caustics.
- Photon mapping follows a similar idea.
