# ADR-0015: Chart Cartesian — Area, tooltip, and legend

**Status:** Accepted (implemented 2026-09-04)  
**Date:** 2026-09-04

## Context

WMDS ships **Chart.SegmentedBar** as a **capacity meter only** (ADR-0014) — no tooltip, no axes, no time series. Dashboard products still need **history and comparison** charts (occupancy over a month, multi-series traffic) with hover readouts and series keys.

[shadcn/ui Chart](https://ui.shadcn.com/docs/components/chart) (Recharts) established a strong UX pattern:

1. **`ChartConfig`** — series labels and colors decoupled from data shape  
2. **`ChartTooltipContent`** — floating panel: x label, colored indicator, series name, tabular value  
3. **`ChartLegendContent`** — same config → swatch + label below the plot  

ADR-0012 commits WMDS to **visx** for marks/scales — not Recharts. WMDS owns **shell, tooltip, legend, and Storybook patterns**. Categorical colors live in ADR-0013; period bucketing helpers already exist in **`chartTheme.ts`** (`chartBucketPeriodData`).

**SegmentedBar does not get a tooltip.** Tooltip + legend ship on **`Chart.Cartesian`** + **`Chart.Cartesian.Area`** (first Cartesian pattern).

## Decision

### Plot families

| Family | Pattern | Tooltip | Legend | Axes |
|--------|---------|---------|--------|------|
| **Capacity meter** | `Chart.SegmentedBar` | No | No | No |
| **Ranked breakdown** | `Chart.RankedBars` | No | No | No |
| **Unit composition** | `Chart.UnitGrid` | Shared panel | Yes | No |
| **Distribution strip** | `Chart.DistributionStrip` | Shared panel | No | One numeric |
| **Matrix heatmap** | `Chart.Heatmap` | Shared panel | Intensity | Two categorical |
| **Cartesian** | `Chart.Cartesian` + `Chart.Cartesian.Area` (v1) | Yes | Optional | Yes |

Future Cartesian types (line, bar) reuse the same shell, config, tooltip, and legend — not new chrome.

### Compound API (shipped)

```
Chart.Cartesian          — ParentSize, margins, svg root, series context
├── Chart.Cartesian.Grid
├── Chart.Cartesian.AxisBottom / Chart.Cartesian.AxisLeft
├── Chart.Cartesian.Area — fill + stroke (single or multi series)
├── Chart.Cartesian.Tooltip — @visx/tooltip + crosshair + active dots
Chart.Tooltip.Content    — presentational rows (also Reference stories)
Chart.Legend             — config-driven row (typical: Card.Body below plot)

Chart.SegmentedBar       — unchanged (ADR-0014)
Chart.RankedBars         — ordered percentage rows (audience fit / demographics)
Chart.UnitGrid           — exact part-to-whole composition
Chart.DistributionStrip  — peer values + optional reference line
Chart.Heatmap            — row × column intensity matrix
Chart.Frame              — axis-agnostic shell (SegmentedBar)
```

**Reference stories** — static **`Chart.Tooltip.Content`** and **`Chart.Legend`** specimens lock visual contract; **Pattern — area** stories wire live visx interaction.

### Series config (`ChartSeriesConfig`)

One config object drives marks, tooltip rows, and legend items (shadcn `ChartConfig` equivalent):

```tsx
const seriesConfig = {
  occupied: { label: "Occupied units", color: chartSeriesColor(0) },
  available: { label: "Available units", color: chartSeriesColor(1) },
} satisfies ChartSeriesConfig;
```

| Field | Tooltip | Legend | Area mark |
|-------|---------|--------|-----------|
| `label` | Row name | Legend copy | aria |
| `color` | Indicator + swatch | Swatch | stroke / fill |

- **Multi-series** — categorical `chartSeriesColor(index)` (ADR-0013).  
- **Single-series** — semantic `ChartTone` via `chartStroke` / `chartFill`; legend omitted.  
- Config is **decoupled from data shape** — apps map data keys to config keys.

Helpers: **`chartSeriesConfigFromKeys()`**, types in **`chartTheme.ts`**.

### Tooltip surface and anatomy

**Surface:** frosted glass — `color-mix` popover at ~72% opacity + `backdrop-blur-md` + inset highlight; solid popover fallback when blur is unsupported.

**`Chart.Tooltip.Content` rows:**

```
┌─────────────────────────────┐
│  Apr 12, 2026               │  caption, medium — x-axis label (optional)
├─────────────────────────────┤
│  ● Occupied units       144 │  label left, tabular mono value right
│  ● Available units       56 │
└─────────────────────────────┘
```

| Prop | Role |
|------|------|
| `label?` | Header — formatted date or category |
| `items[]` | `{ key, label, value, color }` per visible series at crosshair |
| `indicator?` | `dot` \| `line` \| `dashed` — default **`dot`** |
| `hideLabel?` / `hideIndicator?` | Row chrome toggles (shadcn parity) |

**Interaction:** `@visx/tooltip` + `@visx/event` bisect on x; vertical crosshair; tooltip anchored to topmost series Y at the crosshair (active dots per series). Portal via **`useTooltipInPortal`** with **`unstyled`** + **`applyPositionStyle`** — visx default tooltip chrome must **not** wrap **`Chart.Tooltip.Content`** (double padding/background). Panel: **`w-max min-w-[8rem]`**; row body **`justify-between gap-2`** — series name left, **`tabular-nums`** value right (shadcn **ChartTooltipContent** parity).

**Non-Cartesian marks:** `UnitGrid`, `DistributionStrip`, and `Heatmap` use the same portal and `Chart.Tooltip.Content` surface. The hovered mark receives a restrained active outline or size change; the panel exposes category/entity context plus the exact supplied value. `UnitGrid` keeps every unit in the active category fully opaque and reduces other categories to 28%, preserving the part-to-whole grouping while focusing comparison. Existing SVG titles and screen-reader summaries remain the non-pointer fallback.

**Cartesian host:** `@visx/responsive` **`ParentSize`** needs explicit **`height`** on the host (default `minHeight={240}` sets both `minHeight` and `height`) — `min-height` alone renders a blank plot.

Styles live in **`chartStyles.ts`** (`chartTooltip*`, `chartTooltipAnchorAboveClasses`). Legacy `chartPeriodTooltip*` names are retired.

### Legend

- Renders **below the plot** in **Card.Body** (ADR-0014 Card composition).  
- Horizontal wrap; **8px** swatch + caption label per series.  
- Reads the **same `ChartSeriesConfig`** as tooltip — colors and names never drift.  
- **v1:** display only (no click-to-toggle series).

### Area pattern (shipped)

| Story | Series | Tooltip | Legend |
|-------|--------|---------|--------|
| **Pattern — area (single series)** | 1 (`chartSeriesConfigFromTone`) | Yes | No |
| **Pattern — area (multi series + legend)** | 2+ (`chartSeriesConfigFromKeys`) | Yes | Yes |
| **Pattern — occupancy history in Card** | 2 (categorical) | Yes | Yes |

Data shape: **`ChartCartesianPoint[]`** — `{ date: Date; [seriesKey: number] }`. Sample builder: **`buildOccupancyAreaSeries()`** in **`chartSampleData.ts`**.

**Card composition (occupancy history):** **`bodyTerminal`** on **Card** (no Footer → 2px shell bottom); occupant = **`cardLayoutBodyOccupantPadYClasses`** + **`cardLayoutBodyOccupantWellClasses`** + **`cardLayoutBodyOccupantInsetXClasses`**. See **Components/Layout/Card** docs (inset well radius = shell 16px − 2px gutter = **14px**).

**Not wired yet:** **Card.Header** **Select** period state → **`chartBucketPeriodData`** (stories use static 30-day sample).

Variants: **`chartAreaPresets`**; Cartesian margins **`chartCartesianMargins`** (distinct from **`chartMargins`** / SegmentedBar).

### Ranked breakdown pattern

**`Chart.RankedBars`** renders ordered labeled values as compact horizontal meters. It is intended for audience-fit comparisons such as country, city, age, and gender. Apps sort the data before passing it; the component owns visible labels, tabular values, token-backed tracks/fills, clamping, and accessible meter semantics. `animate="initial"` reveals fills from zero with a short row stagger after loading; reduced-motion users receive the final state immediately.

This is not a capacity meter: use **`Chart.SegmentedBar`** when one value fills a single known capacity. Ranked breakdowns compare multiple independent rows and do not imply that the visible rows sum to 100%.

### Additional non-Cartesian patterns

- **`Chart.UnitGrid`** — exact unit composition, normally 100 cells. Categories share one denominator; unused units remain visibly neutral.
- **`Chart.DistributionStrip`** — one numeric measure across peer entities. An optional reference line must be a real supplied statistic, not an invented benchmark.
- **`Chart.Heatmap`** — categorical row × column matrix with token-backed intensity. The app supplies the complete matrix; WMDS does not infer missing analytics.

All three use a measured `ParentSize` plot host: marks consume the full available width and the explicit `minHeight` (default `240`). Adjacent plots use the same `minHeight` so chart areas align; DistributionStrip anchors its numeric axis near the bottom edge.

### Date formatting

Axis ticks use **`chartFormatAxisDateLabel(date, period?)`**: compact month/day labels omit repeated years, while year views use month-only labels. The first and final ticks anchor inward so labels remain inside the plot. Tooltips retain period-aware full context through **`chartFormatTooltipLabel(date, period?)`**. Both use `Intl.DateTimeFormat`.

### Non-goals (v1)

- Tooltip on **SegmentedBar**  
- Recharts or copied shadcn chart code — **UX parity only**, visx under the hood  
- Legend series toggle  
- Generic **`Popover`** molecule (Chart-local tooltip first; extract later if Select/menus need shared primitive)

## Consequences

- **`Chart.Cartesian`**, **`Chart.Tooltip.Content`**, **`Chart.Legend`**, and **`chartSeriesConfigFrom*`** helpers export from **`src/index.ts`**.  
- **`chartUiTokens.tooltipBg`** → **`--color-background-popover`**; frosted panel in **`chartTooltipPanelClasses`**.  
- **`Chart.stories.tsx`** — Reference (tooltip/legend) + Pattern (area, occupancy KPI/history Card with **body-state** toolbar). **`chartCardBodyStateStory.ts`** — story-only arg helpers. **`Card.stories.tsx`** — **Example — body slot (occupancy history / KPI)** (no state toolbar).
- **`compositionShellExceptions`** includes **`ChartCartesian.tsx`** (visx SVG), same tier as SegmentedBar.  
- **Patterns → Form controls** catalog documents Input / Select / Dropdown cross-tier map (ADR-0006).

### Loading phases (shipped)

Three layout-level phases — not props on chart marks:

| Phase | UI |
|-------|-----|
| Initial layout | Compose **Skeleton** blocks; **`aria-busy`** on **Card** |
| Fetch in flight | **Chart.Loading** in **Card.Body**; **Card.Header** mounted |
| Data resolved | **Chart.Cartesian** (`animate="initial"` path draw), **Chart.SegmentedBar** (`animate="initial"` spring fill), or **Chart.RankedBars** (`animate="initial"` staggered fill) |

**SegmentedBar** — no **`empty`/`error`** state prop (ADR-0014 capacity-only). **Storybook** Card patterns: **`bodyState`** arg + chip toolbar; implementation in **`Chart.stories.tsx`** (`useChartCardBodyStateFromArgs` — React state, not **`useArgs`**).

### Next session (backlog)

- Wire occupancy **Select** → **`chartBucketPeriodData`** / period kind on **Chart.Cartesian**.  
- Extract generic **Popover** molecule if tooltip + Select/menus need shared primitive.  
- Legend series toggle (non-goal v1 — revisit with product need).

## References

- ADR-0012 (visx Chart organism)
- ADR-0013 (chart color tiers)
- ADR-0014 (SegmentedBar capacity only)
- [shadcn Chart — tooltip & legend](https://ui.shadcn.com/docs/components/chart)
- `src/lib/chartTheme.ts` — `chartBucketPeriodData`, `chartSeriesColor`
- `src/components/organisms/Chart/` — Cartesian, tooltip, legend, stories
- `src/components/molecules/Select/` — listbox positioning (`selectMenuPosition.ts`, 4px offset, Card boundary)
