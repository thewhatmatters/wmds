import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";

export const textLinkVariants = ["prose", "quiet"] as const;

export type TextLinkVariant = (typeof textLinkVariants)[number];

/** Shared focus ring — the same on every variant. */
export const textLinkFocusClasses =
  "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body";

/** Prose — medium weight with a solid hairline underline that darkens on hover. */
export const textLinkProseClasses = cn(
  "font-medium text-fg underline decoration-solid decoration-border-emphasized underline-offset-4",
  "transition-[color,text-decoration-color]",
  motionTransition("fast"),
  "hover:decoration-fg",
  textLinkFocusClasses,
);

/**
 * Quiet — headline-size and list titles. Inherits the surrounding type (size and weight); no
 * underline at rest; hover and keyboard focus draw an underline scaled to the text.
 */
export const textLinkQuietClasses = cn(
  "text-fg underline decoration-transparent decoration-solid decoration-[length:0.06em] underline-offset-[0.16em]",
  "transition-[color,text-decoration-color]",
  motionTransition("fast"),
  "hover:decoration-current focus-visible:decoration-current",
  // A wrapped title gets a whole ring on each line rather than one ring cut at the line ends.
  "box-decoration-clone",
  textLinkFocusClasses,
);

export const textLinkVariantClasses: Record<TextLinkVariant, string> = {
  prose: textLinkProseClasses,
  quiet: textLinkQuietClasses,
};

/** @deprecated Use `textLinkVariantClasses.prose`. */
export const textLinkClasses = textLinkProseClasses;

export const textLinkExternalIconClasses =
  "ml-0.5 inline-block size-[0.85em] align-[0.05em] stroke-current";
