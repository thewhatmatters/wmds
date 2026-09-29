import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";

export const stepProgressClasses = "flex w-full flex-col items-center gap-3";

export const stepProgressTrackClasses = "flex w-full gap-1.5";

export const stepProgressSegmentClasses = cn(
  "h-1.5 min-w-0 flex-1 rounded-full",
  motionTransition("fast"),
);

/** Filled segments use brand navy (`--color-brand`, #011272). */
export const stepProgressSegmentFilledClasses = "bg-brand";

export const stepProgressSegmentRestClasses = "bg-secondary";
