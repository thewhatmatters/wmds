/**
 * Inline decorative marks for TextSequence.
 * The layout box is zero-height and em-wide so the mark takes a word-sized gap
 * without growing the line box. The graphic is about 1.1–1.25em tall (pills
 * 2–2.4em wide), centered on the line, with a 14px floor so subtext stays readable.
 * Fills are semantic tokens only — no hex.
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

export const textSequenceShapeTones = ["brand", "brand-soft", "accent", "info-muted"] as const;

export type TextSequenceShapeTone = (typeof textSequenceShapeTones)[number];

/** Zero-height inline gap. `align-middle` sits the graphic on the x-height. */
export const textSequenceShapeBaseClasses =
  "pointer-events-none relative inline-block h-0 shrink-0 select-none align-middle";

/** Layout width of the gap. Does not set the painted height. */
export const textSequenceShapeSizeClasses: Record<TextSequenceShapeVariant, string> = {
  asterisk: "mx-[0.08em] w-[1.15em] min-w-[14px]",
  pill: "mx-[0.12em] w-[2.2em] min-w-[28px]",
  diamond: "mx-[0.08em] w-[1.15em] min-w-[14px]",
  dots: "mx-[0.08em] w-[0.85em] min-w-[14px]",
  "double-pill": "mx-[0.12em] w-[2.35em] min-w-[28px]",
  circle: "mx-[0.08em] w-[1.15em] min-w-[14px]",
  smiley: "mx-[0.08em] w-[1.15em] min-w-[14px]",
};

/** Painted box, centered on the layout gap. Min 14px so subtext marks stay readable. */
export const textSequenceShapeGraphicClasses: Record<TextSequenceShapeVariant, string> = {
  asterisk: "h-[1.15em] min-h-[14px] w-[1.15em] min-w-[14px]",
  pill: "h-[1.12em] min-h-[14px] w-[2.2em] min-w-[28px]",
  diamond: "h-[1.15em] min-h-[14px] w-[1.15em] min-w-[14px]",
  dots: "h-[1.2em] min-h-[14px] w-[0.85em] min-w-[14px]",
  "double-pill": "h-[1.12em] min-h-[14px] w-[2.35em] min-w-[28px]",
  circle: "h-[1.15em] min-h-[14px] w-[1.15em] min-w-[14px]",
  smiley: "h-[1.15em] min-h-[14px] w-[1.15em] min-w-[14px]",
};

export const textSequenceShapeGraphicBaseClasses =
  "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

/**
 * Solid token, or a two-stop gradient between tokens.
 * Lighter tones blend into a neighbor so the mark still reads on a light field.
 */
export const textSequenceShapePaints: Record<
  TextSequenceShapeTone,
  { solid: string } | { stops: readonly [string, string] }
> = {
  brand: { solid: "var(--color-brand)" },
  "brand-soft": { stops: ["var(--color-brand)", "var(--color-brand-soft)"] },
  accent: { solid: "var(--color-accent)" },
  "info-muted": { stops: ["var(--color-brand-soft)", "var(--color-info-muted)"] },
};
