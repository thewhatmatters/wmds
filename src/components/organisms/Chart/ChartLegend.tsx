import type { HTMLAttributes } from "react";
import type { ChartSeriesConfig } from "../../../lib/chartTheme";
import { cn } from "../../../lib/cn";
import {
  chartLegendClasses,
  chartLegendItemClasses,
  chartLegendLabelClasses,
  chartLegendSwatchClasses,
} from "./chartStyles";

/** Layout-only — margin in Card.Body below plot. */
export type ChartLegendLayoutClassName = string;

export interface ChartLegendProps extends HTMLAttributes<HTMLDivElement> {
  config: ChartSeriesConfig;
  /** Subset and order — defaults to Object.keys(config). */
  keys?: string[];
  className?: ChartLegendLayoutClassName;
}

/** Series key row — same config as **Chart.Tooltip.Content** (ADR-0015). */
export function ChartLegend({ config, keys, className, ...props }: ChartLegendProps) {
  const legendKeys = keys ?? Object.keys(config);

  return (
    <div {...props} className={cn(chartLegendClasses, className)} role="list">
      {legendKeys.map((key) => {
        const entry = config[key];
        if (entry == null) {
          return null;
        }

        return (
          <div key={key} className={chartLegendItemClasses} role="listitem">
            <span
              className={chartLegendSwatchClasses}
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <span className={chartLegendLabelClasses}>{entry.label}</span>
          </div>
        );
      })}
    </div>
  );
}
