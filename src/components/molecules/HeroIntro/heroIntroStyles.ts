/**
 * Marketing hero intro — two lines on the page grid.
 * Line recipes live here so Show code passes `lead` and children, not a break.
 */

/** `grid-page` with the page block pad removed so it does not stack on the hero gap. */
export const heroIntroPageClasses = "grid-page w-full !py-0";

/**
 * Centered `type-large` at regular weight. Columns 4–9 from `lg` (6 of 12).
 * Full width of the page grid below `lg`. `min-w-0` keeps a nowrap lead from
 * stretching those tracks.
 */
export const heroIntroCopyClasses =
  "type-large col-span-full min-w-0 text-center font-normal text-muted lg:col-start-4 lg:col-end-10";

/** First sentence. One line from `md`. May wrap below `md`. */
export const heroIntroLeadClasses = "block md:whitespace-nowrap";

/** Rest of the intro. Always the next line, same type step and leading. */
export const heroIntroRestClasses = "block";

/**
 * Sequenced hero subtext. Same size and normal weight as ScrollHorizontal.Intro
 * (`type-display-2`). Full width of the page grid — columns 4–9 are the
 * type-large measure and are too narrow for this step. `!font-normal` wins
 * over the display token's semibold.
 */
export const heroIntroDisplayCopyClasses = [
  "type-display-2 !font-normal",
  "col-span-full min-w-0 text-center text-muted",
].join(" ");

/** Display step lead. Wraps when the measure is short (390). No nowrap. */
export const heroIntroDisplayLeadClasses = "block min-w-0";
