# WMDS

What Matters Design System — Paper tokens, React components, and Storybook catalog for shipped UI primitives.

## Language

**Table layout module**:
Pure sticky-offset, scroll-edge, and column-template math extracted from the Table compound component (`tableLayout.ts`). DOM measurement stays in Table hooks; layout rules are unit-tested without a browser.
_Avoid_: sticky engine, table utils, layout helpers

**Table**:
Compound scrollable data grid with optional frozen columns, filter-row collapse, and surface chrome — the public seam consumers import from `@whatmatters/wmds`.
_Avoid_: DataTable, grid component

**Examples**:
Storybook-only specimens under `src/examples/` that compose exported components against target UI patterns — never added to `src/index.ts`.
_Avoid_: demo components, sample pages, specimens folder
