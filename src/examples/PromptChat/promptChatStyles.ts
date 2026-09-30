/**
 * Immersive ask page. The column is a narrowed page grid so the statement,
 * the thread, and the prompt bar share one measure. Not the marketing homepage.
 */

/** Viewport shell. SiteNav stays on the page grid; the column below narrows separately. */
export const promptChatPageClasses = "flex h-full min-h-0 w-full flex-1 flex-col bg-body";

/** Statement, thread, and prompt bar. `--grid-max` keeps that column from stretching across 1440. */
export const promptChatColumnClasses =
  "flex min-h-0 w-full flex-1 flex-col [--grid-max:40rem]";

/** Stage above the pinned bar. Landing centers the headline; chat starts at the top. */
export const promptChatStageClasses = "grid-page min-h-0 w-full flex-1 overflow-y-auto !py-0";

export const promptChatLandingClasses = "place-content-center";

/**
 * Short landing statement. `type-display-2` at normal weight, same step as the
 * marketing intro. Brand navy is the existing `--color-brand` (`#011272`).
 */
export const promptChatHeadlineClasses =
  "col-span-full type-display-2 !font-normal text-balance text-center text-brand";

/** User turn under the nav, reply underneath, empty space down to the bar. */
export const promptChatThreadClasses = "col-span-full flex flex-col items-start gap-6 pt-6";

/**
 * The sent line. Existing selected-pill fill — not a new Badge or Button variant.
 * Hugs the text and sits on the trailing edge of the column.
 */
export const promptChatUserClasses =
  "ml-auto max-w-full rounded-full bg-fill-selected px-4 py-2 type-body text-fg";

/** Plain reply. Not a card. Words stream inside this line. */
export const promptChatReplyClasses = "type-body text-fg";

/** Thinking trace. One disclosure, then the body for whichever script is playing. */
export const promptChatTraceClasses = "flex w-full flex-col items-start gap-2";

/** Rows hang off one existing control hairline. Not a new tone. */
export const promptChatTraceBodyClasses =
  "flex w-full flex-col items-start gap-2 border-l border-border-control py-0.5 pl-3";

export const promptChatTraceLineClasses = "flex items-center gap-2 type-body text-fg";

/** Working label. Existing muted ink and brand navy — a moving highlight, not a new tone. */
export const promptChatThinkingLabelClasses =
  "inline-block bg-[linear-gradient(90deg,var(--color-text-secondary),var(--color-brand),var(--color-text-secondary))] bg-[length:200%_100%] bg-clip-text text-transparent";

/** Settled label. Past tense, quiet. */
export const promptChatThoughtLabelClasses = "type-body text-muted";

/** Lucide mark on a resolved line. Brand navy is `--color-brand` (`#011272`). */
export const promptChatTraceIconClasses = "size-4 shrink-0 text-brand";

/** Current step. Same box as the check, so the row does not jump when it resolves. */
export const promptChatTraceSpinClasses = "size-4 shrink-0 animate-spin text-brand";

export const promptChatTraceChevronClasses = "size-4 shrink-0 text-muted";

/** Copy, helpful, and not helpful. Existing icon buttons, shown when the stream ends. */
export const promptChatActionsClasses = "flex items-center gap-1";

/** Suggested prompts. Outline pills, stacked to the column width. */
export const promptChatFollowUpsClasses = "flex w-full flex-col gap-2";

/**
 * Layout on the existing outline button. The pill fills the column, the label
 * stays at the start, and the stroke is the quiet divider (`--color-border`),
 * not the outline role’s `border-fg`.
 */
export const promptChatFollowUpClasses = "w-full !justify-start !border-border";

/** Same column as the stage. Stays at the bottom of the viewport. */
export const promptChatBarClasses = "grid-page w-full shrink-0 !pt-0 !pb-6";
