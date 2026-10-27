/**
 * InlinePill classes. Everything is in em so the pill scales with the text it sits in (a display
 * headline, a lead paragraph, body copy).
 */

/**
 * The pill: an inline run (not inline-flex), so it sits on the text's baseline and punctuation right
 * after it never wraps away. Fill is the text colour at 4% (8% in dark, where 4% disappears).
 * If a long pill wraps, it splits like text (the default `box-decoration-break: slice`): the padding stays at
 * its two ends, so a wrapped pill can't overflow the line by its padding.
 */
export const inlinePillClasses =
  "group/inline-pill relative rounded-full bg-[color-mix(in_srgb,var(--color-text-primary)_4%,transparent)] " +
  "py-0 pr-[0.32em] pl-[1.3em] " +
  "[[data-theme=dark]_&]:bg-[color-mix(in_srgb,var(--color-text-primary)_8%,transparent)]";

/** Without a picture, the left padding matches the right. */
export const inlinePillNoMediaClasses = "pl-[0.32em]";

/**
 * The picture: 1em square, a touch proud of the pill, held in the pill's left padding and out of the
 * text flow, so it can never be left at a line end without its word. Anchored to the first line (an
 * inline box that wraps spans two lines, so 50% would float between them).
 *
 * Hidden while an ancestor's pop-in is pending (`data-inline-pills="pending"`), never in print; tilts a
 * little on hover where motion is allowed.
 */
export const inlinePillMediaClasses =
  "absolute top-[0.14em] left-[0.15em] size-[1em] [&>img]:size-full [&>img]:object-contain [&>svg]:block [&>svg]:size-full " +
  "in-data-[inline-pills=pending]:scale-0 in-data-[inline-pills=pending]:opacity-0 print:!scale-100 print:!opacity-100 " +
  "motion-safe:transition-transform motion-safe:duration-[var(--duration-fast)] motion-safe:ease-[var(--ease-standard)] " +
  "motion-safe:group-hover/inline-pill:-rotate-8 motion-safe:group-hover/inline-pill:scale-105";

/** Pop-in keyframes: from nothing with a tilt, past full size, then settle. Transform and opacity only. */
export const inlinePillPopInKeyframes: Keyframe[] = [
  { transform: "scale(0) rotate(-24deg)", opacity: 0 },
  { transform: "scale(1.14) rotate(6deg)", opacity: 1, offset: 0.6 },
  { transform: "scale(1) rotate(0deg)", opacity: 1 },
];

/** The whole pop-in run stays under about this long, however many pills there are (ms). */
export const inlinePillPopInMaxSpread = 480;
