import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import {
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantWellClasses,
} from "../../molecules/Card/cardStyles";

/**
 * The gate — focusable (ChatDock moves focus here) and capped at the height ChatDock allows
 * (`--chat-dock-gate-max`, measured so the latest reply above stays in view).
 */
export const chatDockGateClasses = "flex max-h-[var(--chat-dock-gate-max,28rem)] min-h-0 flex-col outline-none";

/** The Card shell shrinks to the cap, so its body scrolls instead of the gate growing. */
export const chatDockGateCardClasses = "min-h-0";

/** Clips the body while it eases to the next step's height; never shrinks, so a tall step scrolls the body. */
export const chatDockGateStepClasses = "shrink-0 overflow-hidden";

/** One step on the body occupant — the inset well, as in **Card** layout bodies. */
export const chatDockGateOccupantClasses = cn(
  cardLayoutBodyOccupantWellClasses,
  cardLayoutBodyOccupantInsetXClasses,
  "flex flex-col gap-3 py-3",
);

/** "2 of 4" between the header controls. */
export const chatDockGateProgressClasses = cn(typographyClass("caption"), "px-1 text-muted tabular-nums");

/** Cancel and the primary action, at the end of the footer. */
export const chatDockGateFooterActionsClasses = "ml-auto flex items-center gap-2";
