import { typographyClass } from "../../../lib/typography";

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

/** Period-strip bucket tooltip — WMDS surface tokens. */
export const chartPeriodTooltipClasses =
  "pointer-events-none absolute z-10 min-w-[9rem] rounded-lg border border-border bg-body px-3 py-2 shadow-md";

export const chartPeriodTooltipTitleClasses = `${typographyClass("caption")} mb-1.5 font-medium text-fg`;

export const chartPeriodTooltipListClasses = "flex flex-col gap-1";

export const chartPeriodTooltipRowClasses =
  "flex items-baseline justify-between gap-4 font-mono text-xs tabular-nums leading-none";

export const chartPeriodTooltipPointLabelClasses = `${typographyClass("caption")} text-muted`;

export const chartPeriodTooltipPointValueClasses = "text-fg";
