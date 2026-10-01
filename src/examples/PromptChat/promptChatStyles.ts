/**
 * Immersive ask page. The column is a narrowed page grid (`--grid-max: 40rem`)
 * so the thread, follow-ups, and composer share one measure. Not the marketing homepage.
 */

/**
 * Viewport shell. The page owns `100svh`, so the stage can scroll without a
 * height-constrained parent. SiteNav stays outside this column and is not restyled.
 */
export const promptChatPageClasses =
  "flex h-[100svh] min-h-0 w-full flex-col overflow-hidden bg-body";

/**
 * Statement, scrolling thread, and pinned prompt bar. One narrowed page grid.
 * The column clips; the stage inside it is the scrollport.
 */
export const promptChatColumnClasses =
  "flex min-h-0 w-full flex-1 flex-col overflow-hidden [--grid-max:40rem]";

/**
 * Stage above the pinned bar. This region scrolls when the thread is taller
 * than the view. The composer stays outside it.
 */
export const promptChatStageClasses = "grid-page min-h-0 w-full flex-1 overflow-y-auto !py-0";

export const promptChatLandingClasses = "place-content-center";

/**
 * Short landing statement. `type-display-2` at normal weight, same step as the
 * marketing intro. Brand navy is the existing `--color-brand` (`#011272`).
 */
export const promptChatHeadlineClasses =
  "col-span-full type-display-2 !font-normal text-balance text-center text-brand";

/**
 * User turn, reply, and follow-ups. One column of the narrowed grid.
 * The thread's bottom padding is the composer's measured height plus the space
 * under the pill to the bottom of the column, so the reply and its follow-ups
 * end above the bar while a reply is still growing and after it finishes.
 */
export const promptChatThreadClasses =
  "col-span-full flex w-full min-w-0 flex-col items-start gap-6 pt-6";

/**
 * The sent line. Existing selected-pill fill — not a new Badge or Button variant.
 * Hugs the text and sits on the trailing edge of the column.
 */
export const promptChatUserClasses =
  "ml-auto max-w-full rounded-full bg-fill-selected px-4 py-2 type-body text-fg";

/** Plain reply. Same column as the follow-ups. Not a card. Words stream inside this line. */
export const promptChatReplyClasses = "w-full type-body text-fg";

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

/** Suggested prompts. Same thread column as the reply, stacked to that width. */
export const promptChatFollowUpsClasses = "flex w-full flex-col gap-2";

/**
 * Layout on the existing outline button. The pill fills the column, the label
 * stays at the start, and the stroke is the quiet divider (`--color-border`),
 * not the outline role’s `border-fg`.
 */
export const promptChatFollowUpClasses = "w-full !justify-start !border-border";

/** Same narrowed grid as the thread. Stays pinned under the scrolling stage. */
export const promptChatBarClasses = "grid-page w-full shrink-0 !pt-0 !pb-6";

/** Composer fills that column, the same measure as the reply and follow-ups. */
export const promptChatComposerClasses = "col-span-full";
