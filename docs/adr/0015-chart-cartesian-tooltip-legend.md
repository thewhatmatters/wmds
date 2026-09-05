# ADR-0015: Chart Cartesian — Area, tooltip, and legend

**Status:** Accepted  
**Date:** 2026-09-04

## Context

WMDS ships **Chart.SegmentedBar** as a **capacity meter only** (ADR-0014) — no tooltip, no axes, no time series. Dashboard products still need **history and comparison** charts (occupancy over a month, multi-series traffic) with hover readouts and series keys.

[shadcn/ui Chart](https://ui.shadcn.com/docs/components/chart) (Recharts) established a strong UX pattern:

1. **`ChartConfig`** — series labels and colors decoupled from data shape  
2. **`ChartTooltipContent`** — floating panel: x label, colored indicator, series name, tabular value  
3. **`ChartLegendContent`** — same config → swatch + label below the plot  

ADR-0012 commits WMDS to **visx** for marks/scales — not Recharts. WMDS owns **shell, tooltip, legend, and Storybook patterns**. Categorical colors live in ADR-0013; period bucketing helpers already exist in **`chartTheme.ts`** (`chartBucketPeriodData`).

**SegmentedBar does not get a tooltip.** Tooltip + legend are designed on **`Chart.Area`** (first Cartesian pattern).

## Decision

### Plot families

| Family | Pattern | Tooltip | Legend | Axes |
|--------|---------|---------|--------|------|
| **Capacity meter** | `Chart.SegmentedBar` | No | No | No |
| **Cartesian** | `Chart.Area` (v1) | Yes | Optional | Yes |

Future Cartesian types (line, bar) reuse the same shell, config, tooltip, and legend — not new chrome.

### Compound API (v1 target)

```
Chart.Cartesian          — ParentSize, margins, svg root, series context
├── Chart.Grid
├── Chart.AxisBottom / Chart.AxisLeft
├── Chart.Area           — fill + stroke (single or multi series)
├── Chart.Tooltip        — @visx/tooltip + crosshair
│   └── Chart.Tooltip.Content
└── Chart.Legend         — config-driven row (typical: Card.Body below plot)

Chart.SegmentedBar       — unchanged (ADR-0014)
Chart.Frame              — axis-agnostic shell (SegmentedBar today)
```

**Reference stories ship first** — static **`Chart.Tooltip.Content`** and **`Chart.Legend`** specimens (no visx) to lock visual contract before **`Chart.Area`** interaction.

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
│  ● Occupied units    144     │  indicator + label + tabular mono value
│  ● Available units    56      │
└─────────────────────────────┘
```

| Prop | Role |
|------|------|
| `label?` | Header — formatted date or category |
| `items[]` | `{ key, label, value, color }` per visible series at crosshair |
| `indicator?` | `dot` \| `line` \| `dashed` — default **`dot`** |
| `hideLabel?` / `hideIndicator?` | Row chrome toggles (shadcn parity) |

**Interaction (when Area ships):** `@visx/tooltip` + `@visx/event` bisect; vertical crosshair at `chartUiTokens.cursor`; portal/fixed positioning (Card-safe, same class of fix as **Select** menu).

Styles live in **`chartStyles.ts`** (`chartTooltip*`). Legacy `chartPeriodTooltip*` names are retired in favor of `chartTooltip*`.

### Legend

- Renders **below the plot** in **Card.Body** (ADR-0014 Card composition).  
- Horizontal wrap; **8px** swatch + caption label per series.  
- Reads the **same `ChartSeriesConfig`** as tooltip — colors and names never drift.  
- **v1:** display only (no click-to-toggle series).

### Area pattern (implementation follow-up)

| Story | Series | Tooltip | Legend |
|-------|--------|---------|--------|
| **Occupancy history** | 1 (`ChartTone`) | Yes | No |
| **Multi-series comparison** | 2–3 (categorical) | Yes | Yes |

Data: `{ date: Date; [seriesKey: number] }[]` or per-series arrays; period scope via **Card.Header Select** + `chartBucketPeriodData`.

Variants: **`chartAreaPresets`** (`hero` \| `compact` \| `sparkline`); margins from **`chartMargins`**.

### Date formatting

Default: **`chartFormatTooltipLabel(date, period?)`** in **`chartTheme.ts`** using `Intl.DateTimeFormat`. Apps may pass pre-formatted `label` strings.

### Non-goals (v1)

- Tooltip on **SegmentedBar**  
- Recharts or copied shadcn chart code — **UX parity only**, visx under the hood  
- Legend series toggle  
- Generic **`Popover`** molecule (Chart-local tooltip first; extract later if Select/menus need shared primitive)

## Consequences

- **`Chart.Tooltip.Content`** and **`Chart.Legend`** export as presentational components before visx Area ships.  
- **`chartUiTokens.tooltipBg`** points at **`--color-background-popover`**.  
- **`Chart.stories.tsx`** gains Reference specimens for tooltip, legend, and paired chrome.  
- Next implementation PR: **`Chart.Cartesian`** + **`Chart.Area`** + wired tooltip.  
- **`CONSUMING.md`** / **AGENTS.md** updated when Area pattern ships.

## References

- ADR-0012 (visx Chart organism)
- ADR-0013 (chart color tiers)
- ADR-0014 (SegmentedBar capacity only)
- [shadcn Chart — tooltip & legend](https://ui.shadcn.com/docs/components/chart)
- `src/lib/chartTheme.ts` — `chartBucketPeriodData`, `chartSeriesColor`
- `src/components/organisms/Chart/` — tooltip/legend reference stories
