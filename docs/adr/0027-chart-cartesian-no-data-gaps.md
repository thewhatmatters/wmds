# ADR-0027: Chart Cartesian in-series no-data gaps

**Status:** Accepted  
**Date:** 2026-09-18

## Context

**Chart.Cartesian** already plots daily / multi-series history (ADR-0015). Product windows often include dates with no measurement — for example the first days of a 30-day reach series — while later dates are plottable.

That is a different empty from:

| Situation | Pattern |
|-----------|---------|
| Entire series missing, too thin, or all-zero | Card.Body empty (Insights **State — insufficient reach data**) — no plot |
| Fetch in flight | **Skeleton** then **Chart.Loading** |
| Some x-values in an otherwise plottable series are missing | **This ADR** — hatch the gap, draw the series where values exist |

Substituting `0` for missing days invents a drop to the baseline. Apps must pass `null` / `undefined`.

## Decision

### Data

`ChartCartesianPoint` series fields may be `number | null | undefined`. A value is plottable only when it is a finite number. **`0` is real data** and is drawn.

`LinePath` / `AreaClosed` use `defined()` so the stroke and fill break across missing runs. `y` domain ignores non-finite values. Tooltip snaps only to points that have at least one plottable plotted series.

### Hatch bands

Contiguous missing x-runs become SVG hatch rects (`<pattern>`, skeleton wash + soft border-emphasized stripe — theme-aware, not a literal third-party palette). A centered muted **Badge** (`variant="neutral"`) labels bands wide enough for **Badge** `sm`. Narrow bands keep the hatch and an SVG `title` / `aria-label`.

Default detection: **gap when every key in `seriesKeys` is missing** (`noData.mode="plotted"`). Each series still breaks independently. `mode="all"` requires every key in the series config to be missing. Apps may pass explicit `{ start, end }` ranges.

`noData` defaults **on**. `noData={false}` disables the hatch. Compound slot: **`Chart.Cartesian.NoData`** (after **Grid**, before **Area**).

### Helpers

Exported for apps that choose empty vs gaps before mount:

- `isChartCartesianNumber` / `isChartCartesianSeriesDefined`
- `chartCartesianGapRuns` / `chartCartesianDefinedSegments`
- `chartCartesianHasPlottableValues` — `false` → Card empty Pattern, not a full-plot hatch
- `chartCartesianGapBands` / `resolveChartCartesianNoData` / `resolveChartCartesianGapKeys`

### Documentation

**Components/Data display/Chart → Pattern — Cartesian no-data gaps** is the copy contract (Show code). Insights PitchKit empty remains a separate State story.

## Non-goals (v1)

- Wiring the hatch into PitchKit Insights (optional follow-up)
- Per-series hatch overlays when another plotted series still has a value
- Treating `0` as missing

## Consequences

- Existing Cartesian stories without nulls are unchanged.
- Custom `Chart.Cartesian` children must include `<Chart.Cartesian.NoData />` after **Grid** to keep the hatch; default children already do.
- Composition audit: Cartesian SVG shell exception now covers the hatch pattern (ADR-0012).

## References

- ADR-0012 — visx Chart organism
- ADR-0015 — Cartesian area, tooltip, legend
- `src/components/organisms/Chart/chartCartesianGaps.ts`
- **Components/Data display/Chart → Pattern — Cartesian no-data gaps**
