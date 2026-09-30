/**
 * Immersive ask page. The column is a narrowed page grid so the statement,
 * the thread, and the prompt bar share one measure. Not the marketing homepage.
 */

/** Viewport shell. `--grid-max` keeps the column from stretching across 1440. */
export const promptChatPageClasses =
  "flex h-full min-h-0 w-full flex-1 flex-col bg-body [--grid-max:40rem]";

/** Stage above the pinned bar. Landing centers the headline; chat starts at the top. */
export const promptChatStageClasses = "grid-page min-h-0 w-full flex-1 overflow-y-auto !py-0";

export const promptChatLandingClasses = "place-content-center";

/**
 * Short landing statement. `type-display-2` at normal weight, same step as the
 * marketing intro. Brand navy is the existing `--color-brand` (`#011272`).
 */
export const promptChatHeadlineClasses =
  "col-span-full type-display-2 !font-normal text-balance text-center text-brand";

/** User turn near the top, reply underneath, empty space down to the bar. */
export const promptChatThreadClasses = "col-span-full flex flex-col items-start gap-6 pt-12 sm:pt-16";

/**
 * The sent line. Existing selected-pill fill — not a new Badge or Button variant.
 * Hugs the text and sits on the trailing edge of the column.
 */
export const promptChatUserClasses =
  "ml-auto max-w-full rounded-full bg-fill-selected px-4 py-2 type-body text-fg";

/** Plain reply. Not a card. */
export const promptChatReplyClasses = "type-body text-fg";

/** Same column as the stage. Stays at the bottom of the viewport. */
export const promptChatBarClasses = "grid-page w-full shrink-0 !pt-0 !pb-6";
