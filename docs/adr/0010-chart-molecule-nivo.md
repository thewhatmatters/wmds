# ADR-0010: Chart as a Nivo molecule

**Status:** Accepted  
**Date:** 2026-09-02  
**Amends:** ADR-0002 (planned catalog — Chart), ADR-0005 (organism examples)

## Context

ADR-0002 listed **Chart** as an organism — a section-scale dashboard block (legend, variants, multi-series). Scaffolding in `src/lib/chartTheme.ts` assumed **Recharts**.

Pitchkit needs a single 30-day Insights plot. Look lock (Randy):

- Engine: **`@nivo/line`** with area enabled — not Recharts, shadcn, or visx
- One series; Nivo is the engine, not demo chrome (no multi-country legend, full grid, or transportation axes)
- Theme from WMDS tokens only (`accent`, `fg`, `muted`, `surface`)
- No legend; no vertical grid; quiet horizontal ticks if needed
- Points small or off; curve monotone
- Empty / no-data: render nothing (Pitchkit hides Insights chrome when the series is missing)

That is a reusable named pattern, not a page region.

## Decision

### Reclassify

| Component | Was | Now |
|-----------|-----|-----|
| **Chart** | Organism (planned) | **Molecule** |

Implement under `src/components/molecules/Chart/`. Storybook: **`Molecules/Chart`**. Exported from `src/index.ts`.

### Engine

- **`@nivo/line`** (`ResponsiveLine`, `enableArea`) is the only chart engine
- `chartTheme.ts` maps WMDS CSS variables onto Nivo `theme` + series color — no Nivo schemes, no hardcoded palettes
- Recharts is not a dependency

### Pattern

One series of daily `{ x, y }` points. `className` is layout-only. Empty or missing data returns `null`.

## Consequences

- `src/package.manifest.ts` moves Chart from `organisms` to `molecules`
- Planned organism list is Carousel, MoreMenu, Tab, Table
- Pitchkit imports `{ Chart }` from `@whatmatters/wmds` — see **CONSUMING.md**

## Related

- ADR-0002 — atomic design tiers
- ADR-0004 — pattern-first (Storybook is the contract)
- ADR-0005 — molecule vs organism rule
- ADR-0007 — color tokens (`accent`, `fg`, `muted`, `surface`)
