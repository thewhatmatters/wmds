import { Badge } from "../../atoms/Badge/Badge";
import { cn } from "../../../lib/cn";
import {
  stepProgressClasses,
  stepProgressSegmentClasses,
  stepProgressSegmentFilledClasses,
  stepProgressSegmentRestClasses,
  stepProgressTrackClasses,
} from "./stepProgressStyles";

/** Layout-only — width or margin. */
export type StepProgressLayoutClassName = string;

export interface StepProgressProps {
  /** Current step, 1-based. */
  step: number;
  /** Segment count. Default 4. */
  steps?: number;
  /** Visible pill label. Default `Step N of N`. */
  label?: string;
  className?: StepProgressLayoutClassName;
}

/** Spoken and visible label for the progress pill. */
export function stepProgressLabel(step: number, steps: number): string {
  return `Step ${step} of ${steps}`;
}

/** True when the segment at `index` (0-based) is filled through the current step. */
export function isStepProgressSegmentFilled(index: number, step: number): boolean {
  return index < step;
}

/**
 * Segmented progress — a pill label and N navy segments.
 * Filled segments use `--color-brand` (#011272).
 */
export function StepProgress({
  step,
  steps = 4,
  label,
  className,
}: StepProgressProps) {
  const safeSteps = Math.max(1, steps);
  const safeStep = Math.min(Math.max(1, step), safeSteps);
  const text = label ?? stepProgressLabel(safeStep, safeSteps);

  return (
    <div
      className={cn(stepProgressClasses, className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={safeSteps}
      aria-valuenow={safeStep}
      aria-valuetext={text}
      data-step={safeStep}
      data-steps={safeSteps}
    >
      <span aria-hidden>
        <Badge variant="neutral" emphasis="muted">
          {text}
        </Badge>
      </span>
      <div className={stepProgressTrackClasses}>
        {Array.from({ length: safeSteps }, (_, index) => {
          const filled = isStepProgressSegmentFilled(index, safeStep);
          return (
            <span
              key={index}
              className={cn(
                stepProgressSegmentClasses,
                filled ? stepProgressSegmentFilledClasses : stepProgressSegmentRestClasses,
              )}
              data-filled={filled ? "true" : "false"}
            />
          );
        })}
      </div>
    </div>
  );
}
