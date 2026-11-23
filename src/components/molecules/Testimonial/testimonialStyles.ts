import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

export const testimonialSizes = ["auto", "lg", "md"] as const;

/**
 * How large the quote is set. `auto` (default) picks by length: a quote over
 * `testimonialLongQuoteLength` characters is set at `md`, a shorter one at `lg`.
 */
export type TestimonialSize = (typeof testimonialSizes)[number];

/** The size a quote is set at once `auto` is resolved. */
export type TestimonialQuoteSize = Exclude<TestimonialSize, "auto">;

/** A quote longer than this many characters is set a step smaller, so a long one doesn't tower over its row. */
export const testimonialLongQuoteLength = 200;

export const testimonialVariants = ["outlined", "surface", "muted"] as const;

/** The **Card** surface the testimonial sits on. */
export type TestimonialVariant = (typeof testimonialVariants)[number];

/** The most stars a rating shows. */
export const testimonialRatingMax = 5;

/** The quote at the top, the person at the bottom: cards in one row line their people up. */
export const testimonialFigureClasses = "m-0 flex h-full min-w-0 flex-col justify-between gap-8";

export const testimonialTopClasses = "flex min-w-0 flex-col gap-4";

const testimonialQuoteBase = "m-0 min-w-0 text-fg text-pretty [overflow-wrap:anywhere]";

export const testimonialQuoteClasses: Record<TestimonialQuoteSize, string> = {
  lg: cn(testimonialQuoteBase, "type-heading-1"),
  md: cn(testimonialQuoteBase, "type-large"),
};

export const testimonialRatingClasses = "inline-flex items-center gap-0.5 self-start";

const testimonialStarBase = "size-4 shrink-0";

export const testimonialStarClasses = {
  on: cn(testimonialStarBase, "text-fg"),
  off: cn(testimonialStarBase, "text-muted"),
} as const;

export const testimonialLegendClasses = "flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-2";

export const testimonialPersonClasses = "flex min-w-0 flex-col gap-0.5";

export const testimonialNameClasses = cn("m-0 text-fg [overflow-wrap:anywhere]", typographyClass("ui-label"));

export const testimonialDetailClasses = cn("m-0 text-muted [overflow-wrap:anywhere]", typographyClass("caption"));

export const testimonialSourceClasses = "m-0 type-eyebrow text-muted";
