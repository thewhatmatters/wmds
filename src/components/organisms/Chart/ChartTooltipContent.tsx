import type { HTMLAttributes } from "react";
import type { ChartTooltipIndicator, ChartTooltipItem } from "../../../lib/chartTheme";
import { cn } from "../../../lib/cn";
import {
  chartTooltipIndicatorClasses,
  chartTooltipLabelClasses,
  chartTooltipListClasses,
  chartTooltipNameClasses,
  chartTooltipPanelClasses,
  chartTooltipRowBodyClasses,
  chartTooltipRowClasses,
  chartTooltipValueClasses,
} from "./chartStyles";

/** Layout-only — positioning comes from Chart.Tooltip shell. */
export type ChartTooltipContentLayoutClassName = string;

export interface ChartTooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Header — formatted date or category at crosshair. */
  label?: string;
  items: ChartTooltipItem[];
  indicator?: ChartTooltipIndicator;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  className?: ChartTooltipContentLayoutClassName;
}

/**
 * Tooltip panel rows — shadcn Chart parity on WMDS tokens (ADR-0015).
 * Series name left; tabular mono value right (`justify-between`).
 */
export function ChartTooltipContent({
  label,
  items,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  className,
  ...props
}: ChartTooltipContentProps) {
  return (
    <div {...props} className={cn(chartTooltipPanelClasses, className)}>
      {label != null && !hideLabel ? (
        <p className={chartTooltipLabelClasses}>{label}</p>
      ) : null}
      <ul className={cn(chartTooltipListClasses, "m-0 list-none p-0")}>
        {items.map((item) => (
          <li key={item.key} className={chartTooltipRowClasses}>
            {!hideIndicator ? (
              <span
                className={chartTooltipIndicatorClasses(indicator)}
                style={
                  indicator === "dashed"
                    ? { borderColor: item.color }
                    : { backgroundColor: item.color }
                }
                aria-hidden
              />
            ) : null}
            <span className={chartTooltipRowBodyClasses}>
              <span className={chartTooltipNameClasses}>{item.label}</span>
              <span className={chartTooltipValueClasses}>{item.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
