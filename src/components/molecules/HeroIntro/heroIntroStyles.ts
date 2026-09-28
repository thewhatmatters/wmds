/**
 * Marketing hero intro — two lines on the page grid.
 * Line recipes live here so Show code passes `lead` and children, not a break.
 */

/** `grid-page` with the page block pad removed so it does not stack on the hero gap. */
export const heroIntroPageClasses = "grid-page w-full !py-0";

/**
 * Centered `h1` on `type-display-2` at normal weight — the same size and
 * leading as **ScrollHorizontal.Intro** and the sequenced hero. `!font-normal`
 * beats the display token's semibold. `text-pretty` keeps a last word from sitting alone.
 * Columns 4–9 from `lg` (6 of 12). Full width of the page grid below `lg`.
 * The lead wraps inside that measure.
 */
export const heroIntroCopyClasses = [
  "type-display-2 !font-normal text-pretty",
  "col-span-full min-w-0 text-center text-muted lg:col-start-4 lg:col-end-10",
].join(" ");

/** First sentence. Wraps at every width, including the display-2 measure from `md`. */
export const heroIntroLeadClasses = "block min-w-0";

/** Rest of the intro. Always the next line, same type step and leading. */
export const heroIntroRestClasses = "block";

/**
 * Sequenced hero subtext. Same `type-display-2` size and normal weight as the
 * default intro and **ScrollHorizontal.Intro**. Full width of the page grid —
 * columns 4–9 are the default measure and are too narrow for this longer line
 * with shapes. `!font-normal` wins over the display token's semibold.
 * `text-pretty` keeps a last word from sitting alone.
 */
export const heroIntroDisplayCopyClasses = [
  "type-display-2 !font-normal text-pretty",
  "col-span-full min-w-0 text-center text-muted",
].join(" ");

/** Display step lead. Wraps when the measure is short (390). No nowrap. */
export const heroIntroDisplayLeadClasses = "block min-w-0";
