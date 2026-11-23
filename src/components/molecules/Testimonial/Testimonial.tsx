import { Star } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { Card, type CardTone } from "../Card/Card";
import {
  testimonialDetailClasses,
  testimonialFigureClasses,
  testimonialLegendClasses,
  testimonialLongQuoteLength,
  testimonialNameClasses,
  testimonialPersonClasses,
  testimonialQuoteClasses,
  testimonialRatingClasses,
  testimonialRatingMax,
  testimonialSourceClasses,
  testimonialStarClasses,
  testimonialTopClasses,
  type TestimonialQuoteSize,
  type TestimonialSize,
  type TestimonialVariant,
} from "./testimonialStyles";

export {
  testimonialLongQuoteLength,
  testimonialRatingMax,
  testimonialSizes,
  testimonialVariants,
  type TestimonialQuoteSize,
  type TestimonialSize,
  type TestimonialVariant,
} from "./testimonialStyles";

/** Layout-only — width, margin, or grid placement. */
export type TestimonialLayoutClassName = string;

export interface TestimonialProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "className"> {
  /** What they said, in their words. No quote marks: the card is the quotation. */
  quote: ReactNode;
  /** Who said it. */
  name: ReactNode;
  /** Their role or their place: "Owner, Corner Bakery", "Round Rock". */
  detail?: ReactNode;
  /** Stars out of five, when the review came with a rating. Whole stars: 4.6 shows as 5. */
  rating?: number;
  /** Replaces the rating's spoken name ("Rated 5 out of 5"), for another language. */
  ratingLabel?: string;
  /** Where the words were published: "Google review". */
  source?: ReactNode;
  /**
   * `auto` (default) sets a quote over 200 characters a step smaller. `lg` and `md` fix the size, to keep
   * a row of cards at one size.
   */
  size?: TestimonialSize;
  /** The card's surface: `outlined` (default), `surface` or `muted`. */
  variant?: TestimonialVariant;
  /** The card's own colour pair, as on **Card**: `inverse`, `field` or `light`. */
  tone?: CardTone;
  className?: TestimonialLayoutClassName;
}

/** The size a quote is set at: the given size, or by its length when `auto`. */
export function testimonialQuoteSize(quote: ReactNode, size: TestimonialSize = "auto"): TestimonialQuoteSize {
  if (size !== "auto") {
    return size;
  }
  const length = typeof quote === "string" || typeof quote === "number" ? String(quote).trim().length : 0;
  return length > testimonialLongQuoteLength ? "md" : "lg";
}

/** A rating as whole stars from 1 to 5; anything that isn't a number shows no stars. */
export function testimonialStars(rating: number | undefined): number | null {
  if (typeof rating !== "number" || !Number.isFinite(rating)) {
    return null;
  }
  return Math.min(testimonialRatingMax, Math.max(1, Math.round(rating)));
}

function isShown(node: ReactNode): boolean {
  return node != null && node !== false && node !== "";
}

/**
 * One person's words on a card: the quote, who said it, and where they're from. A rating shows as stars
 * and a source names where the words were published. A long quote is set smaller.
 */
export function Testimonial({
  quote,
  name,
  detail,
  rating,
  ratingLabel,
  source,
  size = "auto",
  variant = "outlined",
  tone,
  className,
  ...rest
}: TestimonialProps) {
  const quoteSize = testimonialQuoteSize(quote, size);
  const stars = testimonialStars(rating);

  return (
    <Card {...rest} variant={variant} padding="lg" tone={tone} className={className}>
      <figure className={testimonialFigureClasses} data-slot="testimonial" data-size={quoteSize}>
        <div className={testimonialTopClasses}>
          {stars != null ? (
            <span
              role="img"
              aria-label={ratingLabel ?? `Rated ${stars} out of ${testimonialRatingMax}`}
              className={testimonialRatingClasses}
              data-slot="rating"
              data-rating={stars}
            >
              {Array.from({ length: testimonialRatingMax }, (_, index) => (
                <Star
                  key={index}
                  aria-hidden
                  className={index < stars ? testimonialStarClasses.on : testimonialStarClasses.off}
                  fill={index < stars ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </span>
          ) : null}
          <blockquote className={testimonialQuoteClasses[quoteSize]} data-slot="quote">
            {typeof quote === "string" || typeof quote === "number" ? <p className="m-0">{quote}</p> : quote}
          </blockquote>
        </div>
        <figcaption className={testimonialLegendClasses}>
          <span className={testimonialPersonClasses}>
            <span className={testimonialNameClasses} data-slot="name">
              {name}
            </span>
            {isShown(detail) ? (
              <span className={testimonialDetailClasses} data-slot="detail">
                {detail}
              </span>
            ) : null}
          </span>
          {isShown(source) ? (
            <span className={testimonialSourceClasses} data-slot="source">
              {source}
            </span>
          ) : null}
        </figcaption>
      </figure>
    </Card>
  );
}
