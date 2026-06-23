---
name: svg-graph-rendering
description: Use when creating or editing repo-native inline SVG graph visualizations for the LVA TL;DR Nuxt content site, especially automata, transition systems, nets, CTL examples, Moore/Mealy machines, process algebra trees, and compact educational diagrams. Ensures consistent style, scale, arrow geometry, labels, and example references.
---

# SVG Graph Rendering

Use this skill when adding or editing inline SVG diagrams in this repo.

The goal is not decorative drawing. The goal is a compact study-note visualization that makes the formal-model idea obvious at a glance.

## Reference files

Use these repo-local files as visual anchors before editing a new diagram:

- `app/assets/css/main.css` — shared `.graph-svg` styling.
- `app/components/content/AutomataExample.vue` — best graph references:
  - `variant === 'power'`, section `1. Original Graph`: best overall scale and style reference.
  - `variant === 'power'`, section `4. Power Automaton`: reference for larger automata and sink states.
  - `variant === 'basics'`: reference for deterministic/complete toggles and dynamic explanations.
  - `variant === 'oracle-optimized'`: reference for optimized oracle style.
- `app/components/content/MachineExample.vue` — reference for Moore/Mealy conversion diagrams.
- `app/components/content/CtlExample.vue` — reference for CTL state highlighting.
- `app/components/content/NetExample.vue` — reference for condition/event net and PTN diagrams.
- `app/components/content/ProcessExample.vue` — reference for process algebra trees, but keep its scale consistent with the automata style when touching it.

## Required visual style

- Use inline SVG inside the relevant `app/components/content/*.vue` component.
- Every small graph SVG must use `class="graph-svg ..."`.
- Use `currentColor` for strokes/text and `var(--ui-bg)` for node fills.
- Prefer white/neutral strokes plus primary green only for semantic highlights.
- Use the existing site typography; do not set a custom font family.
- Keep diagrams compact and centered. Prefer `max-w-sm`, `max-w-md`, or `max-w-xl` instead of full-width oversized graphics.
- Use consistent node sizes:
  - normal state/place node: `r="25"`;
  - small thumbnail node only: about `r="15"`;
  - accepting state: outer `r="25"` plus inner `r="20"`.
- Use normal text size around `14`; use `12` or `10` only when labels would otherwise collide inside subset states.

## Arrow and edge geometry

Arrows must meet the node boundary, not the node center.

- For a circle with radius `25`, horizontal edges should end about 25 units before/after the node center.
  - Example: from center `(100, 60)` to center `(250, 60)`, draw `M125 60 L225 60`.
- For diagonal edges, manually offset both endpoints to the circle boundary. Do not draw center-to-center.
- For loops, start and end on the circle boundary. The arrowhead must touch the perimeter and must not protrude from the node interior.
- Use marker definitions like the existing examples:
  - `markerWidth="8" markerHeight="8"`
  - `refX="10" refY="5"`
  - `orient="auto"`
- If an arrow looks detached or buried, adjust path endpoints first, not marker size.

## Labels

- Edge labels should sit close to their own edge and clearly farther from unrelated edges.
- Horizontal labels usually sit 6-12 SVG units above the line.
- Curved/diagonal labels may need 10-18 units of offset, but keep them visibly attached to the edge they describe.
- If a transition covers the whole alphabet, label it `*`, not `a, b` or `A, B`.
- Use `*` consistently everywhere the whole alphabet is meant, including sink-state self-loops and sink incoming edges.
- Avoid placing labels where self-loops or neighboring edges pass through them.

## State and graph semantics

- Do not make example outputs visually identical when the point is to compare operators or transformations.
  - CTL examples for `EX`, `EF`, `AG`, `AF` should highlight different state sets when possible.
  - If two formulas naturally produce the same result, change the underlying example graph or proposition placement so the pedagogical difference is visible.
- For incomplete automata examples, make the full alphabet explicit. Include at least one visible transition for the other symbol, so the missing transition is meaningful.
- For Moore machines, every state label must include the state output, e.g. `q0 / 0`, `q1 / 1`.
- For Mealy machines, outputs belong on transitions, e.g. `a / 1`.
- For sink states with all actions looping to the sink, use `*` for the self-loop.

## Layout rules

- Keep all related graphics in the same family visually comparable:
  - same node radius;
  - same stroke widths through `.graph-svg`;
  - similar spacing between states;
  - similar label offsets;
  - similar caption/explainer style.
- Prefer 2-column layouts only when both diagrams remain readable at laptop width.
- If an explanation accompanies dynamic button state, put the pill/badge on its own line and the prose below it so text wraps cleanly.
- Captions should explain why the current state is true, not restate the button label.

## Before finishing

Check:

- all SVGs have `graph-svg`;
- arrowheads touch boundaries cleanly;
- no labels overlap arrows, loops, or node text;
- whole-alphabet transitions use `*` consistently;
- dynamic variants produce visibly different results where comparison is the point;
- the rendered prose still stays in Markdown content, not duplicated in Vue unless it is UI state text.
