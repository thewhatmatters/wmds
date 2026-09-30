import { focusRingTransitionClasses } from "../../../lib/motion";

/**
 * One-line shell is a pill. IconButton `sm` is 2.25rem and the inset is 0.5rem,
 * so the outer height is 3.25rem and the radius is half of that (1.625rem).
 * The radius stays put when the field grows, and the circle keeps the same inset.
 * The shell owns the single focus ring (inset, so it does not stack a second edge).
 */
export const promptBarShellClasses =
  "flex w-full items-end gap-2 rounded-[1.625rem] border border-border-control bg-surface p-2 pl-5 " +
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-focus-ring " +
  focusRingTransitionClasses;

/**
 * Empty is one line — min height matches the send circle, with padding that centers that line.
 * Grows with the text, stops at three lines (`max-h`), then scrolls.
 */
export const promptBarFieldClasses =
  "min-h-9 min-w-0 flex-1 overflow-y-auto py-2 type-body [field-sizing:content] " +
  "max-h-[4.75rem]";

/**
 * No focus ring on the circle. IconButton's ring-offset would sit on the pill border.
 */
export const promptBarSendClasses =
  "focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none";

/** Enabled send — existing brand navy, not a new blue. */
export const promptBarSendReadyClasses = "!bg-brand !text-on-brand hover:!bg-brand active:!bg-brand";

/**
 * Empty send. Neutral fill and disabled ink — muted, not a faded navy.
 * `disabled:!opacity-100` keeps that pair; IconButton's opacity-50 would wash it out.
 */
export const promptBarSendMutedClasses = "!bg-neutral !text-disabled disabled:!opacity-100";
