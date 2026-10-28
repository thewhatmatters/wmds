/**
 * Marketing hero intro — two lines on the page grid.
 * Line recipes live here so Show code passes `lead` and children, not a break.
 */

/** `grid-page` with the page block pad removed so it does not stack on the hero gap. */
export const heroIntroPageClasses = "grid-page w-full !py-0";

/**
 * `h1` on `type-display-2` at normal weight — the same size and
 * leading as **ScrollHorizontal.Intro** and the sequenced hero. `!font-normal`
 * beats the display token's semibold. `text-balance` evens wrapped lines so a
 * last line is not a single word.
 * Columns 2–11 from `lg` (10 of 12; a heading may run wider than body text, Grid G8), so a 12-word
 * intro holds 2 lines. Full width of the page grid below `lg`. Left on phones, where it runs 3+ lines;
 * centred from `md` (Headings H8).
 */
export const heroIntroCopyClasses = [
  "type-display-2 !font-normal text-balance",
  "col-span-full min-w-0 text-left text-muted md:text-center lg:col-start-2 lg:col-end-12",
].join(" ");

/** First sentence. Wraps at every width, including the display-2 measure from `md`. */
export const heroIntroLeadClasses = "block min-w-0";

/** Rest of the intro. Always the next line, same type step and leading. */
export const heroIntroRestClasses = "block";

/**
 * Sequenced hero subtext. Same `type-display-2` size and normal weight as the
 * default intro and **ScrollHorizontal.Intro**. Full width of the page grid —
 * columns 4–9 are the default measure and are too narrow for this longer sentence.
 * `!font-normal` wins over the display token's semibold.
 * `text-balance` evens wrapped lines so a last line is not a single word.
 * Left on phones, where it runs past 2 lines; centred from `md`, where it holds 2 (Headings H8).
 */
export const heroIntroDisplayCopyClasses = [
  "type-display-2 !font-normal text-balance",
  "col-span-full min-w-0 text-left text-muted md:text-center",
].join(" ");

/** Display step lead. Wraps when the measure is short (390). No nowrap. */
export const heroIntroDisplayLeadClasses = "block min-w-0";

/**
 * Optional lead paragraph under the heading: `type-lead` (18px phone to 21px, regular, 1.45) in ink, at the
 * 42rem measure, centred under the heading on the same columns (Lead rules L7, L8).
 */
export const heroIntroDescriptionClasses =
  "col-span-full mt-6 min-w-0 text-pretty text-left type-lead text-fg md:mx-auto md:max-w-[42rem] md:text-center lg:col-start-4 lg:col-end-10";

/** The description under the display step: the same 6-column measure, left on phones, centred from `md`. */
export const heroIntroDisplayDescriptionClasses = heroIntroDescriptionClasses;
