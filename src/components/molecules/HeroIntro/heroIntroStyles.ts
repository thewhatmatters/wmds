/**
 * Marketing hero intro — two lines on the page grid.
 * Line recipes live here so Show code passes `lead` and children, not a break.
 */

/** `grid-page` with the page block pad removed so it does not stack on the hero gap. */
export const heroIntroPageClasses = "grid-page w-full !py-0";

/**
 * Left-aligned `h1` on `type-display-2` at normal weight — the same size and
 * leading as **ScrollHorizontal.Intro** and the sequenced hero. `!font-normal`
 * beats the display token's semibold. `text-balance` evens wrapped lines so a
 * last line is not a single word.
 * Columns 4–9 from `lg` (6 of 12). Full width of the page grid below `lg`.
 * The lead wraps inside that measure. Left at every width (Headings H8): it runs past 2 lines on phones
 * and again in the 6-column measure from `lg` (measured 4 lines at 390 and 1440, 2026-10-28).
 */
export const heroIntroCopyClasses = [
  "type-display-2 !font-normal text-balance",
  "col-span-full min-w-0 text-left text-muted lg:col-start-4 lg:col-end-10",
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
  "col-span-full mt-6 min-w-0 max-w-[42rem] text-pretty text-left type-lead text-fg lg:col-start-4 lg:col-end-10";

/** The description under the display step follows its heading: left on phones, centred from `md`. */
export const heroIntroDisplayDescriptionClasses =
  "col-span-full mt-6 min-w-0 max-w-[42rem] text-pretty text-left type-lead text-fg md:mx-auto md:text-center lg:col-start-4 lg:col-end-10";
