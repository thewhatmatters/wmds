import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";

export const textLinkVariants = ["prose", "quiet"] as const;

export type TextLinkVariant = (typeof textLinkVariants)[number];

export const textLinkTones = ["default", "brand"] as const;

export type TextLinkTone = (typeof textLinkTones)[number];

/** The link's ink. Kept apart from the variant, so a tone swaps it and no page needs a `!` override. */
export const textLinkToneClasses: Record<TextLinkTone, string> = {
  default: "text-fg",
  brand: "text-brand",
};

/** A prose link's underline on hover: the tone's own ink. */
const textLinkProseHoverClasses: Record<TextLinkTone, string> = {
  default: "hover:decoration-fg",
  brand: "hover:decoration-brand",
};

/** Shared focus ring — the same on every variant. */
export const textLinkFocusClasses =
  "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body";

/** Prose — medium weight with a solid hairline underline that darkens on hover. */
const textLinkProseTreatment = cn(
  "font-medium underline decoration-solid decoration-border-emphasized underline-offset-4",
  "transition-[color,text-decoration-color]",
  motionTransition("fast"),
  textLinkFocusClasses,
);

/**
 * Quiet — headline-size and list titles. Inherits the surrounding type (size and weight); no
 * underline at rest; hover and keyboard focus draw an underline scaled to the text.
 */
const textLinkQuietTreatment = cn(
  "underline decoration-transparent decoration-solid decoration-[length:0.06em] underline-offset-[0.16em]",
  "transition-[color,text-decoration-color]",
  motionTransition("fast"),
  "hover:decoration-current focus-visible:decoration-current",
  // A wrapped title gets a whole ring on each line rather than one ring cut at the line ends.
  "box-decoration-clone",
  textLinkFocusClasses,
);

/** A variant's treatment in a tone's ink. */
export function textLinkClassesFor(variant: TextLinkVariant, tone: TextLinkTone = "default") {
  return variant === "prose"
    ? cn(textLinkToneClasses[tone], textLinkProseTreatment, textLinkProseHoverClasses[tone])
    : cn(textLinkToneClasses[tone], textLinkQuietTreatment);
}

export const textLinkProseClasses = textLinkClassesFor("prose");

export const textLinkQuietClasses = textLinkClassesFor("quiet");

export const textLinkVariantClasses: Record<TextLinkVariant, string> = {
  prose: textLinkProseClasses,
  quiet: textLinkQuietClasses,
};

/** @deprecated Use `textLinkVariantClasses.prose`. */
export const textLinkClasses = textLinkProseClasses;

export const textLinkExternalIconClasses =
  "ml-0.5 inline-block size-[0.85em] align-[0.05em] stroke-current";
