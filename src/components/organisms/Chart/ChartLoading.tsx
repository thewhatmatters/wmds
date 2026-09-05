import { ButtonSpinner } from "../../atoms/Button/ButtonSpinner";
import { typographyClass } from "../../../lib/typography";
import { cn } from "../../../lib/cn";
import { chartLoadingLabelClasses, chartLoadingPanelClasses } from "./chartStyles";

/** Layout-only — width, min-height in dashboard grids. */
export type ChartLoadingLayoutClassName = string;

export interface ChartLoadingProps {
  /** Status copy — defaults to "Retrieving data". */
  label?: string;
  /** Matches **Chart.Cartesian** host height in Card wells. */
  minHeight?: number;
  className?: ChartLoadingLayoutClassName;
}

/** Centered spinner + label while chart data resolves — use instead of animating marks. */
export function ChartLoading({
  label = "Retrieving data",
  minHeight = 240,
  className,
}: ChartLoadingProps) {
  return (
    <div
      className={cn(chartLoadingPanelClasses, className)}
      style={{ minHeight, height: minHeight }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <ButtonSpinner size="sm" />
      <span className={chartLoadingLabelClasses}>{label}</span>
    </div>
  );
}
