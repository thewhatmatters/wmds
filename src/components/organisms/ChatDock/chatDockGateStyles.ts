import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { cardLayoutBodyOccupantInsetXClasses, cardLayoutSectionInsetXClasses } from "../../molecules/Card/cardStyles";

/** The gate — fills the chat window, and takes focus (ChatDock moves focus here). */
export const chatDockGateClasses = "flex h-full min-h-0 flex-col outline-none";

/** The flush Card shell, as tall as the window, so the body scrolls between the header and the footer. */
export const chatDockGateCardClasses = "h-full min-h-0";

/** The step body — takes the height the header and footer leave, and scrolls. */
export const chatDockGateBodyClasses = "overscroll-contain";

/** One step, on the window surface — lined up with the header and footer at 16px. */
export const chatDockGateOccupantClasses = cn(cardLayoutBodyOccupantInsetXClasses, "flex flex-col gap-3 pb-1");

/** "2 of 4" between the header controls. */
export const chatDockGateProgressClasses = cn(typographyClass("caption"), "px-1 text-muted tabular-nums");

/** The footer block: the hairline, then the pending or error line, then the actions. */
export const chatDockGateFooterBlockClasses = "flex w-full shrink-0 flex-col";

/** The footer row under its hairline. */
export const chatDockGateFooterRowClasses = "pt-3";

/** Cancel and the primary action, at the end of the footer. */
export const chatDockGateFooterActionsClasses = "ml-auto flex items-center gap-2";

/** While the step's action runs — muted caption over the actions. */
export const chatDockGatePendingClasses = cn(cardLayoutSectionInsetXClasses, typographyClass("caption"), "pt-3 text-muted");

/** The step's action failed — error caption over the actions. */
export const chatDockGateErrorClasses = cn(cardLayoutSectionInsetXClasses, typographyClass("caption"), "pt-3 text-error");
