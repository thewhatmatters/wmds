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
