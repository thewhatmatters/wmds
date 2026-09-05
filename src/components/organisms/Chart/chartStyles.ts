import { typographyClass } from "../../../lib/typography";
import { cn } from "../../../lib/cn";

/** Responsive plot region — axis-agnostic; marks fill the frame. */
export const chartFrameClasses = "relative w-full";

/** Segmented bar — fixed tick height; width comes from layout. */
export const chartSegmentBarHostClasses =
  "relative block w-full min-w-0 [height:var(--chart-segment-height,2rem)]";

/** Occupancy-style KPI row — hero value + inline mono trend (no Badge). */
export const chartKpiHeroRowClasses = "flex flex-wrap items-baseline gap-x-3 gap-y-1";

export const chartKpiHeroValueClasses = `${typographyClass("display")} tabular-nums tracking-tight text-fg`;

export const chartKpiTrendRowClasses = "flex flex-wrap items-baseline gap-x-2 gap-y-0.5";

/** Apply `text-success` or `text-destructive` for direction. */
export const chartKpiTrendValueClasses = "font-mono text-sm tabular-nums leading-none";

export const chartKpiTrendLabelClasses = `${typographyClass("overline")} text-muted`;

/** Shifts **Chart.Tooltip.Content** above/below the crosshair anchor inside an unstyled visx portal. */
export const chartTooltipAnchorAboveClasses = "-translate-y-[calc(100%+4px)]";

export const chartTooltipAnchorBelowClasses = "translate-y-1";

/** Floating tooltip panel — frosted glass on popover token (ADR-0015). */
export const chartTooltipPanelClasses = cn(
  "pointer-events-none w-max rounded-lg px-2.5 py-2",
  "border border-border/40",
  "bg-[color-mix(in_srgb,var(--color-background-popover)_72%,transparent)]",
  "shadow-[var(--shadow-drop-sm),var(--shadow-inset-highlight)]",
  "backdrop-blur-md backdrop-saturate-150",
  "[@supports_not_(backdrop-filter:blur(0))]:bg-popover",
);

export const chartTooltipLabelClasses = `${typographyClass("caption")} mb-1 font-medium text-fg`;

export const chartTooltipListClasses = "flex flex-col gap-1";

export const chartTooltipRowClasses = "flex items-center gap-1.5";

export const chartTooltipRowBodyClasses = "inline-flex items-baseline gap-1.5";

export const chartTooltipIndicatorDotClasses = "size-2 shrink-0 rounded-full";

export const chartTooltipIndicatorLineClasses = "h-3 w-0.5 shrink-0 rounded-full";

export const chartTooltipIndicatorDashedClasses =
  "h-3 w-0 shrink-0 border-l-2 border-dashed bg-transparent";

export const chartTooltipNameClasses = `${typographyClass("caption")} text-muted whitespace-nowrap`;

export const chartTooltipValueClasses =
  "shrink-0 font-mono text-xs tabular-nums leading-none text-fg whitespace-nowrap";

/** Cartesian host — ParentSize needs explicit height (not min-height alone). */
export const chartCartesianHostClasses = "relative w-full min-w-0";

export const chartCartesianSvgClasses = "block max-w-full overflow-visible select-none";

/** Vertical crosshair at hovered x — SVG line in Cartesian plots. */
export const chartTooltipCrosshairLineClasses = "pointer-events-none stroke-border [stroke-width:1px]";

/** Vertical crosshair — static wireframe div overlay. */
export const chartTooltipCrosshairClasses = "pointer-events-none absolute top-0 w-px bg-border";

/** Active point on series at crosshair — Cartesian tooltip only. */
export const chartTooltipActiveDotClasses = "stroke-background [stroke-width:2px]";

/** Static plot wireframe for reference stories — dot grid + min height. */
export const chartCartesianWireframeClasses =
  "relative min-h-[200px] w-full overflow-hidden rounded-lg border border-border bg-body";

export const chartCartesianWireframePlotClasses = "absolute inset-0 bg-[length:14px_14px] bg-body";

/** Legend row below Cartesian plot — Card.Body typical placement. */
export const chartLegendClasses = "flex flex-wrap items-center gap-x-4 gap-y-2";

export const chartLegendItemClasses = "flex items-center gap-2";

export const chartLegendSwatchClasses = "size-2 shrink-0 rounded-full";

export const chartLegendLabelClasses = `${typographyClass("caption")} text-muted`;

/** @deprecated Use chartTooltipPanelClasses — ADR-0015 rename. */
export const chartPeriodTooltipClasses = chartTooltipPanelClasses;

/** @deprecated Use chartTooltipLabelClasses. */
export const chartPeriodTooltipTitleClasses = chartTooltipLabelClasses;

/** @deprecated Use chartTooltipListClasses. */
export const chartPeriodTooltipListClasses = chartTooltipListClasses;

/** @deprecated Use chartTooltipRowBodyClasses. */
export const chartPeriodTooltipRowClasses =
  "flex items-baseline justify-between gap-4 font-mono text-xs tabular-nums leading-none";

/** @deprecated Use chartTooltipNameClasses. */
export const chartPeriodTooltipPointLabelClasses = chartTooltipNameClasses;

/** @deprecated Use chartTooltipValueClasses. */
export const chartPeriodTooltipPointValueClasses = chartTooltipValueClasses;

export function chartTooltipIndicatorClasses(
  indicator: "dot" | "line" | "dashed",
  className?: string,
): string {
  return cn(
    indicator === "dot" && chartTooltipIndicatorDotClasses,
    indicator === "line" && chartTooltipIndicatorLineClasses,
    indicator === "dashed" && chartTooltipIndicatorDashedClasses,
    className,
  );
}
