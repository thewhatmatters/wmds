import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

/**
 * The gate — a well set into the conversation: a hairline border at the card body radius, the page
 * floor inside, and an inset shade under its top edge, so it reads as embedded rather than raised. As
 * wide as the conversation's turns. Focusable: ChatDock moves focus here; the ring sits inside.
 */
export const chatDockGateClasses = cn(
  "flex flex-col gap-3 rounded-[var(--radius-card-body)] border border-border bg-body px-4 py-3 shadow-inset-well",
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring",
);

/** The step's title and subtitle, with previous, progress, and next at the end. */
export const chatDockGateHeaderClasses = "flex items-start justify-between gap-3";

/** Title and subtitle, one block. */
export const chatDockGateHeadingClasses = "flex min-w-0 flex-1 flex-col";

/** Previous, "2 of 4", next. */
export const chatDockGateControlsClasses = "-me-2 flex shrink-0 items-center gap-1";

/** One step. It never scrolls on its own: the conversation scrolls, and the window grows first. */
export const chatDockGateStepClasses = "flex flex-col gap-3";

/** "2 of 4" between the header controls. */
export const chatDockGateProgressClasses = cn(typographyClass("caption"), "px-1 text-muted tabular-nums");

/** The footer block: the hairline, then the pending or error line, then the actions. */
export const chatDockGateFooterBlockClasses = "flex w-full flex-col";

/** Hairline over the footer. */
export const chatDockGateFooterRuleClasses = "m-0 w-full border-0 border-t border-border p-0";

/** The footer row — the start slot, then Cancel and the primary action at the end. */
export const chatDockGateFooterRowClasses = "flex items-center justify-between gap-3 pt-3";

/** Cancel and the primary action, at the end of the footer. */
export const chatDockGateFooterActionsClasses = "ml-auto flex items-center gap-2";

/** While the step's action runs — muted caption over the actions. */
export const chatDockGatePendingClasses = cn(typographyClass("caption"), "pt-3 text-muted");

/** The step's action failed — error caption over the actions. */
export const chatDockGateErrorClasses = cn(typographyClass("caption"), "pt-3 text-error");
