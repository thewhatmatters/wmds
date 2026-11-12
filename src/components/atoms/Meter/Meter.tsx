import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import {
  meterFillClasses,
  meterFillToneClasses,
  meterSizeClasses,
  meterTrackClasses,
  type MeterSize,
  type MeterTone,
} from "./meterStyles";

export { meterSizes, meterTones, type MeterSize, type MeterTone } from "./meterStyles";

/** Layout-only — width or margin; not for re-colouring the bar. */
export type MeterLayoutClassName = string;

/** Other attributes (`id`, `data-*`, `aria-labelledby`, `aria-hidden`) land on the track. */
export interface MeterProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "className" | "role"> {
  /** The measure. Clamped to `min`–`max`. */
  value: number;
  /** Default 0. */
  min?: number;
  /** Default 100. */
  max?: number;
  /**
   * The meter's name for screen readers ("Calcium share"). Or point `aria-labelledby` at visible
   * text. Pass `aria-hidden` instead when the figure is already written beside the bar.
   */
  label?: string;
  /** What a screen reader says for the value ("48 mg/l"). Default: the percentage of the range. */
  valueText?: string;
  /** `xs`: a 2px hairline for table cells and dense rows. `sm` (default): 4px. `md`: 6px. */
  size?: MeterSize;
  /** `primary` (default): the action colour. `neutral`: the text colour, for editorial tables. */
  tone?: MeterTone;
  className?: MeterLayoutClassName;
}

/** Where `value` sits in `min`–`max`, as 0–100. A range with no width reads as empty. */
export function meterPercent(value: number, min: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 0;
  const clamped = Math.min(Math.max(value, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

/**
 * A static measure in a known range: a share, a score, a level, capacity used. One thin bar that
 * fits a table cell, a list row, a card or a **Stat** `detail`. For work in flight use **Progress**;
 * for a ticked capacity bar or a ring use **Chart**.
 */
export function Meter({
  value,
  min = 0,
  max = 100,
  label,
  valueText,
  size = "sm",
  tone = "primary",
  className,
  ...props
}: MeterProps) {
  const percent = meterPercent(value, min, max);
  const decorative = props["aria-hidden"] === true || props["aria-hidden"] === "true";
  const named = label != null || props["aria-label"] != null || props["aria-labelledby"] != null;
  if (!decorative && !named) {
    console.warn(
      "[WMDS Meter] Give `label` or `aria-labelledby` (the meter's name), or `aria-hidden` when the figure is written beside it.",
    );
  }
  const now = Number.isFinite(value) ? Math.min(Math.max(value, min), max) : min;

  return (
    <span
      aria-label={label}
      {...props}
      role={decorative ? undefined : "meter"}
      aria-valuemin={decorative ? undefined : min}
      aria-valuemax={decorative ? undefined : max}
      aria-valuenow={decorative ? undefined : now}
      aria-valuetext={decorative ? undefined : (valueText ?? `${Math.round(percent)}%`)}
      className={cn(meterTrackClasses, meterSizeClasses[size], className)}
      data-meter=""
      data-size={size}
    >
      <span data-meter-fill="" className={cn(meterFillClasses, meterFillToneClasses[tone])} style={{ width: `${percent}%` }} />
    </span>
  );
}
