import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../../lib/cn";
import {
  motionTransitionProp,
  readMotionDurationSeconds,
} from "../../../lib/motion";
import {
  chartRankedBarFillClasses,
  chartRankedBarHeaderClasses,
  chartRankedBarLabelClasses,
  chartRankedBarListClasses,
  chartRankedBarRowClasses,
  chartRankedBarTrackClasses,
  chartRankedBarValueClasses,
} from "./chartStyles";

export interface ChartRankedBarItem {
  label: string;
  value: number;
  valueLabel?: string;
}

/** Layout-only — width and margin in dashboard grids. */
export type ChartRankedBarsLayoutClassName = string;
export type ChartRankedBarsAnimate = "initial" | "none";

export interface ChartRankedBarsProps {
  items: ChartRankedBarItem[];
  "aria-label": string;
  max?: number;
  /** Mount enter only — bars reveal from zero with a short stagger. */
  animate?: ChartRankedBarsAnimate;
  className?: ChartRankedBarsLayoutClassName;
}

export function ChartRankedBars({
  items,
  "aria-label": ariaLabel,
  max = 100,
  animate = "none",
  className,
}: ChartRankedBarsProps) {
  const safeMax = max > 0 ? max : 100;
  const shouldReduceMotion = useReducedMotion();
  const shouldEnter = animate === "initial" && !shouldReduceMotion;

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={cn(chartRankedBarListClasses, className)}
    >
      {items.map((item, index) => {
        const value = Math.min(Math.max(item.value, 0), safeMax);
        const width = `${(value / safeMax) * 100}%`;
        const valueLabel = item.valueLabel ?? `${item.value}%`;

        return (
          <div key={item.label} role="listitem" className={chartRankedBarRowClasses}>
            <div className={chartRankedBarHeaderClasses}>
              <span className={chartRankedBarLabelClasses}>{item.label}</span>
              <span className={chartRankedBarValueClasses}>{valueLabel}</span>
            </div>
            <div
              role="meter"
              aria-label={`${item.label}: ${valueLabel}`}
              aria-valuemin={0}
              aria-valuemax={safeMax}
              aria-valuenow={value}
              className={chartRankedBarTrackClasses}
            >
              <motion.span
                aria-hidden
                className={chartRankedBarFillClasses}
                style={{ "--chart-ranked-bar-width": width } as CSSProperties}
                initial={shouldEnter ? { scaleX: 0 } : false}
                animate={{ scaleX: 1 }}
                transition={
                  shouldEnter
                    ? {
                        ...motionTransitionProp("medium"),
                        delay:
                          index * readMotionDurationSeconds("fast") * 0.35,
                      }
                    : { duration: 0 }
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
