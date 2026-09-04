---
name: wmds-visx-charts
description: >-
  Builds WMDS Chart organisms and dashboard visualizations with visx v4 and
  chartTheme tokens. Use when authoring Organisms/Chart, visx compositions,
  chart Storybook patterns, scales/axes/grid/tooltip work, or when the user
  mentions visx, dashboard charts, or WMDS chartTheme.
---

# WMDS visx charts

## Stack (non-negotiable)

| Layer | Owner |
|-------|--------|
| Marks, scales, axes math | **visx v4** (`@visx/*`) — peer dep, not bundled |
| Colors, grid, margins, variants | **`src/lib/chartTheme.ts`** + `src/theme/colors.css` |
| Shell, tooltip, legend, patterns | **WMDS `Organisms/Chart`** + Storybook |
| Motion | **`motionTransition()` / `motionTransitionProp()`** — not visx animation |

See **ADR-0012**, **AGENTS.md** (Chart bullet), **`.cursor/rules/wmds-pattern-first.mdc`**.

## Do not

- Import **Recharts**, **Nivo**, **ECharts**, or **Tremor** in WMDS.
- Use **`d3.select()`**, **`enter()` / `exit()` / `update()`**, or **`useEffect` + imperative SVG redraw** — visx exists to avoid this in React.
- Hard-code hex colors — use **`var(--color-*)`** from `chartTheme.ts` or approved chart series tokens.
- Ship raw visx recipes as the consumer API — export **Chart patterns + props**.

## visx integration pattern (React)

**Always Pattern B from D3 skills, upgraded to visx components** — scales/layout in hooks; SVG via JSX.

```tsx
import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { LinePath, AreaClosed } from "@visx/shape";
import { ParentSize } from "@visx/responsive";
import { chartMargins, chartStroke, chartUiTokens } from "../../../lib/chartTheme";

function ChartInner({ width, height, data }: { width: number; height: number; data: Point[] }) {
  const margin = chartMargins.hero;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [data[0].date, data[data.length - 1].date],
        range: [0, innerWidth],
      }),
    [data, innerWidth],
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.value))],
        range: [innerHeight, 0],
        nice: true,
      }),
    [data, innerHeight],
  );

  return (
    <svg width={width} height={height} role="img" aria-label="…">
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={yScale} width={innerWidth} stroke={chartUiTokens.grid} />
        <AreaClosed data={data} x={(d) => xScale(d.date) ?? 0} y={(d) => yScale(d.value) ?? 0} … />
        <LinePath data={data} x={…} y={…} stroke={chartStroke("primary")} strokeWidth={2} />
        <AxisBottom top={innerHeight} scale={xScale} stroke={chartUiTokens.axis} tickStroke={chartUiTokens.axis} />
        <AxisLeft scale={yScale} stroke={chartUiTokens.axis} tickStroke={chartUiTokens.axis} />
      </Group>
    </svg>
  );
}

export function ExampleChart({ data }: { data: Point[] }) {
  return (
    <div className="min-h-[240px] w-full">
      <ParentSize>{({ width, height }) => <ChartInner width={width} height={height} data={data} />}</ParentSize>
    </div>
  );
}
```

## Standard build order

Copy this checklist for every new chart pattern:

```
- [ ] 1. Pick variant — hero | compact | sparkline (`chartTheme.ts`)
- [ ] 2. ParentSize (or fixed aspect shell) — container MUST have min-height
- [ ] 3. Margins from chartMargins[variant]
- [ ] 4. Scales in useMemo (domain from data, range from innerWidth/innerHeight)
- [ ] 5. Grid + axes — chartUiTokens for stroke; typography via tickLabelProps / WMDS type scale
- [ ] 6. Marks — @visx/shape paths/bars; stroke/fill from chartStroke/chartFill
- [ ] 7. Tooltip — @visx/tooltip + WMDS surface (Card/Badge typography), not default HTML chrome
- [ ] 8. a11y — role, aria-label, @visx/a11y when pattern is non-trivial
- [ ] 9. Storybook — Usage → Anatomy → Best practices → Pattern (storyCopySource for Pattern only)
- [ ] 10. First pattern becomes template — later chart types reuse shell/hooks
```

## Package map (import granular packages)

| Need | Package |
|------|---------|
| Scales | `@visx/scale` |
| SVG group offset | `@visx/group` |
| Axes | `@visx/axis` |
| Grid | `@visx/grid` |
| Line, area, bar, pie paths | `@visx/shape` |
| Responsive parent | `@visx/responsive` |
| Tooltip / bounds | `@visx/tooltip`, `@visx/bounds` |
| Pointer events | `@visx/event` |
| Heatmap | `@visx/heatmap` |
| Network / sankey | `@visx/network`, `@visx/sankey` |
| A11y | `@visx/a11y` |
| Layout helpers | `@visx/chart` (domains, tick thinning — optional) |

Install umbrella for apps: `npm install @visx/visx`. WMDS source imports `@visx/*` subpaths for tree-shaking.

## WMDS styling rules

- **Grid:** prefer dot-grid shell class `wmds-chart-grid` (`chartGrid` in chartTheme) OR `@visx/grid` with `chartUiTokens.grid` — not both fighting.
- **Series colors:** semantic tones (`primary`, `success`, `destructive`, `neutral`) before inventing new hues; propose new `--color-*` roles before adding literals.
- **Tooltip:** `chartUiTokens.tooltipBg/Border/Fg/Muted`; compose WMDS typography utilities.
- **Dark mode:** tokens only — no separate light/dark chart themes in component code.

## When to drop below visx

Reach for **`@visx/voronoi`**, custom `@visx/shape` paths, or D3 layout packages **inside** visx only when no primitive covers the design. Do not add a standalone `d3` dependency unless ADR amends ADR-0012.

## Borrowed from D3 skills (concepts only)

The [chrisvoncsefalvay d3-viz skill](https://github.com/chrisvoncsefalvay/claude-d3js-skill) is useful for **scale math, margins, and chart anatomy** — not for imperative DOM. See [scales-and-packages.md](scales-and-packages.md).

## External references

- [visx docs](https://airbnb.io/visx/)
- [visx gallery](https://airbnb.io/visx/gallery)
- [visx shadcn registry (starters)](https://github.com/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes)
