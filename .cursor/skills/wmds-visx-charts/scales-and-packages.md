# Scales, domains, and visx packages

Condensed from D3 visualization practice — adapted for **visx in WMDS**, not raw `d3.select`.

## Margin → inner chart size

```ts
const margin = chartMargins.hero; // or compact | sparkline
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
```

SVG y-axis increases downward — **`range: [innerHeight, 0]`** for linear/time y scales.

## Scale picker

| Data | visx scale | Typical x/y |
|------|------------|-------------|
| Continuous numbers | `scaleLinear` | value axes |
| Dates | `scaleTime` | time series x |
| Categories | `scaleBand` + `scalePoint` | bar groups, ordinal x |
| 0–100%, shares | `scaleLinear` domain `[0, 1]` or `[0, 100]` | normalize in data first |

Always set **`nice: true`** on value axes when tick round numbers matter.

## Domain hygiene

- Filter null/NaN before `Math.min` / `Math.max`.
- Pad y domain slightly above max so area/line does not clip (`domain [0, max * 1.05]`).
- Single-point series: widen domain artificially so scale is valid.

## Axes + ticks

- Hide axis lines when design calls for minimal chrome — `tickLine={false}`, `axisLine={false}` (match Search/TaskRows minimal aesthetic).
- Format ticks in the scale or `tickFormat` — use tabular nums for numeric axes (`typographyClass("caption")` on tick labels when rendered as HTML overlay).
- Thin dense ticks: `@visx/axis` `numTicks` or `@visx/chart` tick helpers.

## Responsive sizing

Prefer **`ParentSize`** from `@visx/responsive`:

- Parent wrapper: **`min-h-[VALUE]`** required (same rule as shadcn ChartContainer).
- Memoize scales when `width` / `height` change.

Avoid window `resize` listeners when `ParentSize` suffices.

## Interaction stack

| Interaction | Package |
|-------------|---------|
| Hover tooltip | `@visx/tooltip` + `@visx/bounds` |
| Nearest point | `@visx/voronoi` or manual distance |
| Pan/zoom | `@visx/zoom` |
| Brush range | `@visx/brush` |

Wire pointer handlers on SVG groups; keep state in React (`useState` / controlled props).

## Chart-type → packages

| Pattern | Packages |
|---------|----------|
| Line / area | `@visx/shape` LinePath, AreaClosed, `@visx/gradient` |
| Bar (vertical) | `@visx/shape` Bar, `scaleBand` |
| Stacked bar | `@visx/shape` BarStack, `@visx/scale` |
| Sparkline | compact margins, no axes or minimal ticks |
| Heatmap | `@visx/heatmap` |
| Donut | `@visx/shape` Pie + `@visx/shape` PieArc |
| Network | `@visx/network` |

## Color (WMDS override)

Do **not** use D3 categorical schemes (`d3.schemeCategory10`) as defaults. Map series index → semantic tokens or future `--chart-1` … `--chart-5` palette in `colors.css` (propose ADR/token before adding).
