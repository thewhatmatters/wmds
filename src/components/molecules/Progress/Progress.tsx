"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "../../atoms/Button/Button";
import { cn } from "../../../lib/cn";
import {
  progressActionsClasses,
  progressClasses,
  progressFillClasses,
  progressFillErrorClasses,
  progressFooterClasses,
  progressHeaderClasses,
  progressIndeterminateClasses,
  progressLabelClasses,
  progressMessageClasses,
  progressMetaClasses,
  progressTrackClasses,
  progressValueClasses,
  type ProgressSize,
} from "./progressStyles";

export { progressSizes, type ProgressSize } from "./progressStyles";

/** Layout-only — width or margin. */
export type ProgressLayoutClassName = string;

export interface ProgressProps {
  /** What's happening ("Uploading photos"): the visible label and the bar's name. */
  label: string;
  /** Done so far. Omit only when there's no total (indeterminate). */
  value?: number;
  /** The total. Default 100. */
  max?: number;
  /** Counted things ("files"): shows "3 of 12 files". Omit for a percentage. */
  unit?: string;
  /** Caller-formatted, e.g. "About 2 minutes left". */
  timeLeft?: string;
  /** Stops the work. Required unless `cancellable={false}` (an action that can't be stopped once begun). */
  onCancel?: () => void;
  cancelLabel?: string;
  /** Set `false` only for work that can't be stopped; the bar then has no Cancel. Default true. */
  cancellable?: boolean;
  /** `error`: the bar stops, `message` says why, and Retry appears with `onRetry`. */
  status?: "error";
  message?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  /** Read out when `value` reaches `max` ("Upload complete"). Default: `${label} complete`. */
  completeLabel?: string;
  size?: ProgressSize;
  className?: ProgressLayoutClassName;
}

/**
 * Loading states Y9: a progress bar for waits over 10 seconds, uploads and exports. Determinate when there's
 * a total ("3 of 12 files", "25%"), indeterminate only when there isn't. Always a way out (Cancel), a retry
 * after an error, and screen readers hear milestones (every 10%) and the end, not every tick.
 */
export function Progress({
  label,
  value,
  max = 100,
  unit,
  timeLeft,
  onCancel,
  cancelLabel = "Cancel",
  cancellable = true,
  status,
  message,
  onRetry,
  retryLabel = "Try again",
  completeLabel,
  size = "md",
  className,
}: ProgressProps) {
  const labelId = useId();
  if (cancellable && onCancel == null) {
    console.warn("[WMDS Progress] Give `onCancel` (a way out), or set `cancellable={false}` for work that can't be stopped.");
  }
  const determinate = value != null;
  const clamped = determinate ? Math.min(Math.max(value, 0), max) : 0;
  const percent = determinate && max > 0 ? Math.round((clamped / max) * 100) : 0;
  const valueText = !determinate ? "Working…" : unit != null ? `${clamped} of ${max} ${unit}` : `${percent}%`;
  const complete = determinate && clamped >= max;
  const spoken = [valueText, timeLeft].filter(Boolean).join(", ");

  // Milestones only: every 10% (or each counted item when there are 10 or fewer), and the end.
  const [announced, setAnnounced] = useState("");
  const lastStep = useRef(-1);
  useEffect(() => {
    if (status === "error") return;
    if (complete) {
      setAnnounced(completeLabel ?? `${label} complete`);
      return;
    }
    if (!determinate) return;
    const step = unit != null && max <= 10 ? clamped : Math.floor(percent / 10);
    if (step !== lastStep.current) {
      lastStep.current = step;
      setAnnounced(spoken);
    }
  }, [clamped, complete, completeLabel, determinate, label, max, percent, spoken, status, unit]);

  return (
    <div className={cn(progressClasses, className)} data-progress="">
      <div className={progressHeaderClasses}>
        <span id={labelId} className={progressLabelClasses}>
          {label}
        </span>
        <span className={progressValueClasses} aria-hidden>
          {valueText}
        </span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={determinate ? 0 : undefined}
        aria-valuemax={determinate ? max : undefined}
        aria-valuenow={determinate ? clamped : undefined}
        aria-valuetext={spoken}
        className={progressTrackClasses[size]}
      >
        {determinate ? (
          <div className={cn(progressFillClasses, status === "error" && progressFillErrorClasses)} style={{ width: `${percent}%` }} />
        ) : (
          <div className={progressIndeterminateClasses} />
        )}
      </div>
      <div className={progressFooterClasses}>
        {status === "error" && message != null ? (
          <p className={progressMessageClasses} role="alert">
            {message}
          </p>
        ) : timeLeft != null ? (
          <p className={progressMetaClasses} aria-hidden>
            {timeLeft}
          </p>
        ) : null}
        <div className={progressActionsClasses}>
          {status === "error" && onRetry != null ? (
            <Button role="secondary" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
          {cancellable && onCancel != null && !complete ? (
            <Button role={status === "error" ? "ghost" : "secondary"} size="sm" onClick={onCancel}>
              {cancelLabel}
            </Button>
          ) : null}
        </div>
      </div>
      <p className="sr-only" role="status">
        {announced}
      </p>
    </div>
  );
}
