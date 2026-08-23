import { cn } from "../../lib/cn";

/** Dot-grid canvas behind chart series — matches workflow editor surfaces. */
export const chartGridClass = "wmds-chart-grid";

const chartSurfaceBase = "relative overflow-hidden rounded-md";

/** Recharts surface — token-bound axis/cursor overrides. */
export function chartContainerClasses(showGrid = true) {
  return cn(
    chartSurfaceBase,
    "w-full text-xs text-muted",
    showGrid ? chartGridClass : "bg-border",
    "[&_.recharts-cartesian-axis-tick_text]:fill-[var(--color-muted)]",
    "[&_.recharts-cartesian-grid_line]:stroke-[var(--color-border)]",
    "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-[var(--color-border)]",
    "[&_.recharts-layer]:outline-none",
    "[&_.recharts-surface]:outline-none",
  );
}

export function chartPlaceholderClasses(showGrid = true) {
  return cn(chartSurfaceBase, "w-full shrink-0", showGrid ? chartGridClass : "bg-border");
}

export function chartSparklineClasses(showGrid = true) {
  return cn(
    chartSurfaceBase,
    "shrink-0 text-xs text-muted",
    showGrid ? chartGridClass : "bg-border",
    "[&_.recharts-layer]:outline-none",
    "[&_.recharts-surface]:outline-none",
  );
}
