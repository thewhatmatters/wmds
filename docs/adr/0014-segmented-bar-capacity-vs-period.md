# ADR-0014: SegmentedBar — capacity meter only

**Status:** Accepted (amended 2026-09-04)  
**Date:** 2026-09-04

## Context

The occupancy KPI card scopes metrics to a Header period (e.g. **This month**). `Chart.SegmentedBar` renders a **capacity meter** — contiguous left → right fill from `value / max`.

An earlier iteration added **period strip** mode (per-day ticks, bucketing, tooltips). That overlapped the job of **Cartesian** charts (`Chart.Area`) and implied calendar meaning on ticks that are purely decorative granularity for a scalar fill.

## Decision

### `Chart.SegmentedBar` — capacity only

| Prop | Role |
|------|------|
| `value` / `max` | Snapshot fill — e.g. 144 occupied of 200 units |
| `fill` | `velocity` (occupancy fade), `semantic` (RAG), `solid` |
| `segments` | Target tick count — default **60** |

**Not supported:** per-day data, period bucketing, or calendar strips on this component. Daily / multi-day history → **`Chart.Area`** (planned Cartesian pattern).

Header **Select** (period) scopes the **hero KPI and trend**, not the tick count on the capacity bar.

### Fixed tick width, full card width

- **`chartSegmentTickSpec`** — **5px** tick width, **1px** minimum gap, **2px** radius.
- Ticks **never stretch** — width stays uniform.
- **Gap flexes** so the bar **fills the card container** (`resolveCapacityBarLayout`).
- On very narrow cards, tick count drops (still 5px wide) so gaps stay ≥ 1px.

### Card composition

- **Header** — title + Select (period for KPI copy).
- **Body** — KPI row + **capacity** `Chart.SegmentedBar` + future `Chart.Legend` on Cartesian charts.
- **Footer** — meta + actions.

## Consequences

- `chartBucketPeriodData` remains in **`chartTheme.ts`** for future Cartesian / time-series patterns — not wired to `SegmentedBar`.
- Occupancy Storybook examples use capacity bar only; period comparison stories removed.
- Apps must not use segmented ticks to encode individual days.

## References

- ADR-0012 (visx Chart organism)
- ADR-0013 (chart color tiers)
- `src/lib/chartTheme.ts` — `resolveCapacityBarLayout`, `chartSegmentTickSpec`
- `Organisms/Chart` — Pattern — occupancy KPI in Card
