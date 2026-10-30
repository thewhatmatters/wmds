import { cn } from "../../../lib/cn";

export const progressSizes = ["sm", "md"] as const;
export type ProgressSize = (typeof progressSizes)[number];

export const progressClasses = "flex w-full min-w-0 flex-col gap-2";
export const progressHeaderClasses = "flex min-w-0 items-baseline justify-between gap-3";
export const progressLabelClasses = "min-w-0 truncate type-label text-fg";
export const progressValueClasses = "shrink-0 type-supporting tabular-nums text-muted";

/** Track: a soft mix of the text colour, so it reads on any surface. */
export const progressTrackClasses: Record<ProgressSize, string> = {
  sm: "relative h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-text-primary)_10%,transparent)]",
  md: "relative h-2 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-text-primary)_10%,transparent)]",
};

export const progressFillClasses = cn("absolute inset-y-0 start-0 rounded-full bg-primary", "transition-[width] duration-medium ease-standard motion-reduce:transition-none");
export const progressFillErrorClasses = "bg-error";

/** No total: a third of the track drifting across; still under reduced motion (the words carry it). */
export const progressIndeterminateClasses =
  "absolute inset-y-0 w-1/3 rounded-full bg-primary animate-[progress-drift_1.6s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:start-0";

export const progressFooterClasses = "flex min-w-0 flex-wrap items-center justify-between gap-3";
export const progressMetaClasses = "min-w-0 type-supporting text-muted";
export const progressMessageClasses = "type-supporting text-error";
export const progressActionsClasses = "ms-auto flex shrink-0 items-center gap-2";
