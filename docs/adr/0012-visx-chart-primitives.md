# ADR-0012: visx for Chart primitives

**Status:** Accepted  
**Date:** 2026-09-04

## Context

Dashboard-heavy WhatMatters products need charts that inherit WMDS semantic tokens, typography, motion, and pattern-first Storybook contracts. WMDS must own the **Chart organism** shell (tooltip, legend, grid, variants) while keeping bundle size and render-tree control.

Earlier scaffolding referenced Recharts and `chartTheme.ts` prop helpers. Recharts is convenient for generic dashboards but fights deep customization — axis layout, bespoke marks, and branded interaction are easier when WMDS owns the SVG tree.

## Decision

### Library

- **[@visx/visx](https://airbnb.io/visx/) v4** — Airbnb’s React + D3 visualization primitives.
- **Peer dependency**, not bundled — same model as `motion` and `lucide-react`.
- Consuming apps install once:

  ```bash
  npm install @visx/visx
  ```

- WMDS **Chart** implementation imports granular `@visx/*` packages (`@visx/scale`, `@visx/shape`, `@visx/axis`, …) for tree-shaking. Installing `@visx/visx` satisfies those subpaths.

### WMDS owns

- **`src/lib/chartTheme.ts`** — semantic token maps (`--color-*`), margins, area presets, dot-grid — library-agnostic SVG/chart chrome.
- **`Organisms/Chart`** — responsive shell, WMDS tooltip/legend, Storybook patterns.
- **Foundation → Charts** — token specimens when Chart ships.

### WMDS does not ship

- Pre-built chart apps (Tremor-style dashboard kits).
- A second chart engine (Recharts, ECharts, Nivo) in the core package.

Exotic canvas-scale charts in individual apps may use other libraries outside WMDS; they are not part of the design-system contract.

## Consequences

- Chart patterns take more upfront composition than a high-level `<BarChart />`, but every pixel can match WMDS.
- First Chart pattern sets the template for later types (scales, axes, grid, tooltip, a11y).
- `vite.lib.config.ts` externalizes all `@visx/*` imports via `libExternalPrefixes` in `package.manifest.ts`.

## References

- [visx documentation](https://airbnb.io/visx/)
- ADR-0001 (`chartTheme.ts` in lib)
- ADR-0004 (pattern-first consumer API)
- ADR-0013 (chart color tiers — categorical palette)
