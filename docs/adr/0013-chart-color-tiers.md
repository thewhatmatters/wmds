# ADR-0013: Chart color tiers

**Status:** Accepted  
**Date:** 2026-09-04

## Context

WMDS charts need three distinct color jobs. Conflating them breaks dashboard readability — red as “Region B” reads as failure; green as “Series 3” reads as success.

| Tier | Job | Example |
|------|-----|---------|
| **Semantic** | Encode meaning | KPI trend `text-success`, `ChartTone` stroke |
| **Threshold / RAG** | Position on a scalar | `Chart.SegmentedBar` `fill="semantic"` (red → orange → yellow → green via `--color-chart-rag-*`) |
| **Categorical** | Series identity, no meaning | Multi-series line, legend swatch, donut segment |

ADR-0012 established visx + `chartTheme.ts`. Occupancy KPI and segmented bar patterns shipped semantic and RAG tiers. Multi-series Cartesian charts need a dedicated categorical palette.

## Decision

### Three tiers — keep separate

1. **Semantic** — existing `--color-primary`, `--color-success`, `--color-error`, etc. via `ChartTone` and `chartColorTokens`.
2. **Threshold / RAG** — `chartSegmentFillVariants.semantic` stops (`--color-chart-rag-1` … `4`) on segmented capacity bars.
3. **Categorical** — new `--color-chart-categorical-1` … `--color-chart-categorical-12` in `colors.css`.

Do **not** map series color to Badge variants or status roles.

### v1 categorical palette

- **12 tokens** — covers typical dashboard series counts without maintaining a 50-color sheet on day one.
- **Theme-aware** — same token names; light and dark values under `:root` and `[data-theme="dark"]`.
- **Harmonized with WMDS** — distinct from semantic greens/reds; tuned for `bg-body` / `bg-surface`, not copied from third-party palettes.
- **Helpers** — `chartCategoricalPalette`, `chartSeriesColor(index)` in `chartTheme.ts`; index wraps modulo length.

### Tailwind bridge

`theme.css` exposes `bg-chart-categorical-*` utilities for Storybook specimens and internal chart chrome. Consumer apps should prefer **`chartSeriesColor()`** in visx SVG fills/strokes.

### Foundation

**Foundation → Charts** documents the categorical swatch grid and tier separation.

## Consequences

- Adding series 13+ reuses colors via modulo — acceptable for v1; expand token count in a follow-up ADR amendment if dense dashboards require it.
- Legend and Cartesian patterns must import categorical helpers, not hard-coded hex or semantic tokens.
- New chart color roles (e.g. diverging scales) require a separate ADR tier — do not overload categorical tokens.

## References

- ADR-0007 (semantic color system)
- ADR-0012 (visx chart primitives)
- `src/lib/chartTheme.ts`
- `src/foundation/Charts.stories.tsx`
