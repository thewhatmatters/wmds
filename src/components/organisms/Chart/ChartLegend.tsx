import type { HTMLAttributes } from "react";
import type { ChartSeriesConfig, ChartSeriesConfigDelta } from "../../../lib/chartTheme";
import { cn } from "../../../lib/cn";
import {
  chartLegendClasses,
  chartLegendItemClasses,
  chartLegendLabelClasses,
  chartLegendSwatchClasses,
  chartLegendTabularClasses,
  chartLegendTabularDeltaClasses,
  chartLegendTabularItemClasses,
  chartLegendTabularLabelClasses,
  chartLegendTabularPercentClasses,
  chartLegendTabularValueClasses,
} from "./chartStyles";

/** Layout-only — margin in Card.Body below plot. */
export type ChartLegendLayoutClassName = string;

export const chartLegendVariants = ["series", "tabular"] as const;

export type ChartLegendVariant = (typeof chartLegendVariants)[number];

export interface ChartLegendProps extends HTMLAttributes<HTMLDivElement> {
  config: ChartSeriesConfig;
  /** Subset and order — defaults to Object.keys(config). */
  keys?: string[];
  /**
   * `series` — swatch and label (Cartesian, unit grid).
   * `tabular` — swatch, label, mono value, percent, delta.
   */
  variant?: ChartLegendVariant;
  className?: ChartLegendLayoutClassName;
}

function deltaClass(delta: ChartSeriesConfigDelta | undefined): string {
  return chartLegendTabularDeltaClasses[delta?.direction ?? "flat"];
}

/** Series key row — same config as **Chart.Tooltip.Content** (ADR-0015). */
export function ChartLegend({
  config,
  keys,
  variant = "series",
  className,
  ...props
}: ChartLegendProps) {
  const legendKeys = keys ?? Object.keys(config);
  const tabular = variant === "tabular";

  return (
    <div
      {...props}
      className={cn(tabular ? chartLegendTabularClasses : chartLegendClasses, className)}
      role="list"
    >
      {legendKeys.map((key) => {
        const entry = config[key];
        if (entry == null) {
          return null;
        }

        if (tabular) {
          return (
            <div key={key} className={chartLegendTabularItemClasses} role="listitem">
              <span
                className={chartLegendSwatchClasses}
                style={{ backgroundColor: entry.color }}
                aria-hidden
              />
              <span className={chartLegendTabularLabelClasses}>{entry.label}</span>
              <span className={chartLegendTabularValueClasses}>{entry.value}</span>
              <span className={chartLegendTabularPercentClasses}>{entry.percent}</span>
              <span className={deltaClass(entry.delta)}>{entry.delta?.label}</span>
            </div>
          );
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
