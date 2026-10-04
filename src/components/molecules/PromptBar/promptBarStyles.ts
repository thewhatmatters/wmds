import { focusRingTransitionClasses } from "../../../lib/motion";

/**
 * One-line shell is a pill. IconButton `sm` is 2.25rem and the inset is 0.5rem,
 * so the outer height is 3.25rem and the radius is half of that (1.625rem).
 * The radius stays put when the field grows, and the circle keeps the same inset.
 * The shell owns the single focus ring (inset, so it does not stack a second edge).
 */
export const promptBarShellClasses =
  "flex w-full items-end gap-2 rounded-[1.625rem] border border-border-control bg-surface p-2 " +
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-focus-ring " +
  focusRingTransitionClasses;

/**
 * Leading inset. The text starts 1.25rem in; with a `start` slot the slot takes the same
 * 0.5rem inset as the send circle, and the field keeps 0.25rem more air than the shell gap.
 */
export const promptBarShellStartPadClasses = {
  field: "pl-5",
  slot: "pl-2",
} as const;

/**
 * Leading slot — a brand mark or avatar at the send circle's size (2.25rem), pinned to the
 * last line like the send control.
 */
export const promptBarStartSlotClasses = "mr-1 flex size-9 shrink-0 items-center justify-center";

/** Trailing slot — extra inset controls (for example a mic **IconButton** `sm`) before send. */
export const promptBarEndSlotClasses = "flex shrink-0 items-end gap-2";

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
