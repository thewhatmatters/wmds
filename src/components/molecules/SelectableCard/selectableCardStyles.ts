import { cn } from "../../../lib/cn";
import { focusRingTransitionClasses } from "../../../lib/motion";

export const selectableCardGroupClasses = "flex w-full flex-col gap-8";

/** Two columns on mobile, three from the desktop grid (`lg`). */
export const selectableCardGridClasses = "grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4";

export const selectableCardClasses = cn(
  "relative flex min-h-36 cursor-pointer flex-col gap-2 rounded-[var(--radius-card-shell)] bg-surface p-4 pr-12 text-left shadow-soft-card",
  "border-2 border-transparent",
  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-body",
  focusRingTransitionClasses,
);

export const selectableCardSelectedClasses = "border-brand";

/** Unchecked corner — same 22px circle as Badge icon-only. Checked state swaps in Badge. */
export const selectableCardMarkClasses =
  "pointer-events-none absolute top-4 right-4 size-[1.375rem] rounded-full border border-border bg-surface";

export const selectableCardCheckedClasses = "pointer-events-none absolute top-4 right-4";
