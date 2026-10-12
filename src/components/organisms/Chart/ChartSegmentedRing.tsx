import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";
import { cn } from "../../../lib/cn";
import { chartStroke, chartUiTokens, type ChartTone } from "../../../lib/chartTheme";
import {
  chartSegmentedBarSpringConfig,
  type ChartSegmentedBarAnimate,
} from "./chartSegmentedBarMotion";
import {
  chartSegmentedRingCenterClasses,
  chartSegmentedRingFrameClasses,
  chartSegmentedRingLabelClasses,
  chartSegmentedRingOverflowClasses,
  chartSegmentedRingSizeClasses,
  chartSegmentedRingUnavailableLabelClasses,
  chartSegmentedRingUnavailableReasonClasses,
  chartSegmentedRingValueClasses,
} from "./chartStyles";

/** Discrete ticks around the ring. Channels uses a fine meter; 72 keeps the gaps visible. */
export const chartSegmentedRingSegmentDefault = 72;

export const chartSegmentedRingSizes = ["sm", "md", "lg"] as const;

export type ChartSegmentedRingSize = (typeof chartSegmentedRingSizes)[number];

/** Replaces the center figure when the source is unwired. The track stays empty. */
export interface ChartSegmentedRingUnavailable {
  /** Defaults to "Not connected". */
  label?: string;
  reason: string;
}

export interface ChartSegmentedRingProps {
  /** Filled amount. Values above `max` clamp the arc and mark overflow. */
  value: number;
  /** Capacity. `0` is treated as 1 so the meter stays determinate. */
  max: number;
  /** Tick count. Default 72. */
  segments?: number;
  /** Semantic fill for filled ticks. */
  tone?: ChartTone;
  /** Figure in the hole — tabular. Hidden while `unavailable`. */
  centerValue?: ReactNode;
  /** Caption under `centerValue`. */
  centerLabel?: ReactNode;
  /** sm 96px, md 160px, lg 192px. */
  size?: ChartSegmentedRingSize;
  /** `initial` sweeps from empty on mount. Reduced motion stays on the final fill. */
  animate?: ChartSegmentedBarAnimate;
  /** Accessible name. Defaults to the percent of capacity. */
  label?: string;
  /** Source not wired — empty track, muted label and reason in the hole. */
  unavailable?: ChartSegmentedRingUnavailable;
  className?: string;
}

export function chartSegmentedRingModel(value: number, max: number, segments: number) {
  const count = Math.max(1, Math.round(segments));
  const safeMax = max > 0 ? max : 1;
  const safeValue = Number.isFinite(value) ? value : 0;
  const overflow = safeValue > safeMax;
  const clamped = Math.min(Math.max(safeValue, 0), safeMax);
  const progress = clamped / safeMax;
  return { count, safeMax, safeValue, overflow, clamped, progress };
}

/** One tick as a wedge in a 100×100 viewBox, gap included, starting at 12 o'clock. */
export function chartSegmentedRingTickPath(index: number, count: number): string {
  const cx = 50;
  const cy = 50;
  const outer = 46;
  const inner = 34;
  const sweep = (Math.PI * 2) / count;
  const gap = Math.min(sweep * 0.32, 0.08);
  const start = -Math.PI / 2 + index * sweep + gap / 2;
  const end = -Math.PI / 2 + (index + 1) * sweep - gap / 2;
  const point = (radius: number, angle: number) => {
    const x = Math.round((cx + radius * Math.cos(angle)) * 1000) / 1000;
    const y = Math.round((cy + radius * Math.sin(angle)) * 1000) / 1000;
    return `${x} ${y}`;
  };
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${point(outer, start)} A ${outer} ${outer} 0 ${large} 1 ${point(outer, end)} L ${point(inner, end)} A ${inner} ${inner} 0 ${large} 0 ${point(inner, start)} Z`;
}

/**
 * Segmented radial meter. A fixed viewBox, so the server HTML already has the ticks —
 * unlike **Chart.SegmentedBar**, which measures the host.
 */
export function ChartSegmentedRing({
  value,
  max,
  segments = chartSegmentedRingSegmentDefault,
  tone = "primary",
  centerValue,
  centerLabel,
  size = "md",
  animate = "initial",
  label,
  unavailable,
  className,
}: ChartSegmentedRingProps) {
  const model = chartSegmentedRingModel(value, max, segments);
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(unavailable ? 0 : model.progress);
  const spring = useSpring(unavailable ? 0 : model.progress, chartSegmentedBarSpringConfig);
  const entered = useRef(false);

  useLayoutEffect(() => {
    const target = unavailable ? 0 : model.progress;
    if (!entered.current) {
      entered.current = true;
      if (animate === "initial" && !shouldReduceMotion && !unavailable) {
        spring.jump(0);
        setProgress(0);
        spring.set(target);
        return;
      }
    }
    spring.jump(target);
    setProgress(target);
  }, [animate, model.progress, shouldReduceMotion, spring, unavailable]);

  useMotionValueEvent(spring, "change", (latest) => {
    setProgress(latest);
  });

  const filled = unavailable
    ? 0
    : Math.round(Math.min(Math.max(progress, 0), 1) * model.count);
  const paths = useMemo(
    () => Array.from({ length: model.count }, (_, index) => chartSegmentedRingTickPath(index, model.count)),
    [model.count],
  );

  const fillColor = chartStroke(tone);
  const trackColor = chartUiTokens.placeholder;
  const percent = Math.round((unavailable ? 0 : model.clamped / model.safeMax) * 100);
  const rawPercent = Math.round((model.safeValue / model.safeMax) * 100);
  const unavailableLabel = unavailable?.label ?? "Not connected";
  const ariaLabel = unavailable
    ? `${unavailableLabel}. ${unavailable.reason}`
    : (label ?? `${percent}% of capacity`);
  const valueText = unavailable
    ? ariaLabel
    : model.overflow
      ? `${rawPercent}% of capacity, over capacity`
      : `${percent}% of capacity`;

  return (
    <div
      className={cn(chartSegmentedRingFrameClasses, chartSegmentedRingSizeClasses[size], className)}
      data-size={size}
      data-overflow={model.overflow && !unavailable ? "" : undefined}
      data-state={unavailable ? "unavailable" : undefined}
    >
      <svg
        viewBox="0 0 100 100"
        role="meter"
        aria-label={ariaLabel}
        aria-valuetext={valueText}
        aria-valuenow={unavailable ? 0 : Math.round(model.clamped)}
        aria-valuemin={0}
        aria-valuemax={model.safeMax}
        data-filled={filled}
        className="block size-full"
      >
        {paths.map((path, index) => (
          <path
            key={index}
            d={path}
            data-filled={index < filled ? "true" : "false"}
            fill={index < filled ? fillColor : trackColor}
          />
        ))}
      </svg>
      <div className={chartSegmentedRingCenterClasses}>
        {unavailable ? (
          <>
            <p className={chartSegmentedRingUnavailableLabelClasses}>{unavailableLabel}</p>
            <p className={chartSegmentedRingUnavailableReasonClasses}>{unavailable.reason}</p>
          </>
        ) : (
          <>
            {centerValue != null ? (
              <p className={chartSegmentedRingValueClasses[size]}>{centerValue}</p>
            ) : null}
            {centerLabel != null ? <p className={chartSegmentedRingLabelClasses}>{centerLabel}</p> : null}
            {model.overflow ? <p className={chartSegmentedRingOverflowClasses}>Over capacity</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
