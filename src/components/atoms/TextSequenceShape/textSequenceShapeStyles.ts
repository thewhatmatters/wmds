/**
 * Inline decorative marks for TextSequence.
 * Size is em so the mark tracks the surrounding cap height and wraps with the line.
 * Tone classes set currentColor from semantic tokens — no hex in the SVG.
 */

export const textSequenceShapeVariants = [
  "asterisk",
  "pill",
  "diamond",
  "dots",
  "double-pill",
  "circle",
  "smiley",
] as const;

export type TextSequenceShapeVariant = (typeof textSequenceShapeVariants)[number];

export const textSequenceShapeTones = ["brand", "brand-soft", "accent", "primary", "info"] as const;

export type TextSequenceShapeTone = (typeof textSequenceShapeTones)[number];

export const textSequenceShapeBaseClasses =
  "pointer-events-none inline-block shrink-0 select-none align-middle";

/** Cap-height box. Wider marks stay short so they sit in the line, not above it. */
export const textSequenceShapeSizeClasses: Record<TextSequenceShapeVariant, string> = {
  asterisk: "h-[0.72em] w-[0.72em]",
  pill: "mx-[0.04em] h-[0.56em] w-[1.15em]",
  diamond: "h-[0.62em] w-[0.62em]",
  dots: "h-[0.78em] w-[0.36em]",
  "double-pill": "mx-[0.04em] h-[0.48em] w-[1.2em]",
  circle: "h-[0.52em] w-[0.52em]",
  smiley: "h-[0.72em] w-[0.72em]",
};

export const textSequenceShapeToneClasses: Record<TextSequenceShapeTone, string> = {
  brand: "text-brand",
  "brand-soft": "text-brand-soft",
  accent: "text-accent",
  primary: "text-primary",
  info: "text-info",
};
