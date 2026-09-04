import { typographyClass } from "../../../lib/typography";

export const cardShapes = ["flush", "rounded"] as const;

export type CardShape = (typeof cardShapes)[number];

export const cardVariants = ["surface", "outlined", "ghost"] as const;

export type CardVariant = (typeof cardVariants)[number];

export const cardPaddings = ["none", "md", "lg"] as const;

export type CardPadding = (typeof cardPaddings)[number];

/** Default rounded — layout cards float with shell radius + shadow; use flush when parent owns chrome. */
export const cardBaseClasses = "flex w-full flex-col font-sans text-fg";

export const cardOverflowClasses = "overflow-hidden";

export const cardShapeClasses: Record<CardShape, string> = {
  flush: "rounded-none",
  rounded: "rounded-lg",
};

export const cardVariantClasses: Record<CardVariant, string> = {
  surface: "bg-surface",
  outlined: "border border-border bg-card",
  ghost: "bg-transparent",
};

export const cardRootPaddingClasses: Record<CardPadding, string> = {
  none: "",
  md: "p-4",
  lg: "p-6",
};

/**
 * Layout card — header/footer at 16px inset; Body gutter is 2px from the shell edge.
 */
export const cardLayoutShellClasses = "gap-3 bg-surface py-4";

/** Horizontal inset for header/footer on the layout shell (16px). */
export const cardLayoutSectionInsetXClasses = "px-4";

/** Body gutter — 2px from the card shell edge; slot is full width inside. */
export const cardLayoutBodyGutterClasses = "px-[2px]";

/**
 * Body occupant horizontal pad — 14px (`px-3.5`).
 * With the 2px Body gutter, edges align with Header/Footer at 16px (`px-4`).
 */
export const cardLayoutBodyOccupantInsetXClasses = "px-3.5";

export const cardLayoutShellShapeClasses: Record<CardShape, string> = {
  flush: "",
  rounded: "rounded-2xl shadow-md",
};

/** Header row — start | end. Occupants decide what lands in each slot. */
export const cardLayoutHeaderRowClasses = "flex items-start justify-between gap-3";

export const cardLayoutHeaderClasses = [
  cardLayoutSectionInsetXClasses,
  cardLayoutHeaderRowClasses,
].join(" ");

/** Title + subtitle sit as one block — no flex gap; type leading is snug. */
export const cardLayoutHeaderStartClasses = "flex min-w-0 flex-1 flex-col gap-0";

export const cardLayoutHeaderEndClasses = "flex shrink-0 items-center gap-2";

/** Body slot — full width inside 2px shell gutter; transparent. Occupant paint dictates the region. */
export const cardLayoutBodyWellClasses = [
  cardLayoutBodyGutterClasses,
  "flex min-h-0 w-full flex-col",
].join(" ");

/** Opt-in muted body fill for occupants — e.g. `className={cardBodyWellClasses}` on content inside `Card.Body`. */
export const cardBodyWellClasses = "bg-body p-0.5";

export const cardLayoutFooterClasses = [
  cardLayoutSectionInsetXClasses,
  "flex items-center justify-between gap-3",
].join(" ");

/** Simple padded cards — flat sections with dividers (legacy when padding md/lg + sections). */
export const cardSectionPaddingClasses: Record<
  CardPadding,
  { header: string; body: string; footer: string }
> = {
  none: {
    header: cardLayoutHeaderClasses,
    body: cardLayoutBodyWellClasses,
    footer: cardLayoutFooterClasses,
  },
  md: {
    header: `${cardLayoutHeaderRowClasses} border-b border-border px-4 pb-3 pt-4`,
    body: "px-4 py-3",
    footer: "flex items-center justify-between gap-4 border-t border-border px-4 py-3",
  },
  lg: {
    header: `${cardLayoutHeaderRowClasses} border-b border-border px-6 pb-4 pt-6`,
    body: "px-6 py-4",
    footer: "flex items-center justify-between gap-4 border-t border-border px-6 py-4",
  },
};

export const cardTitleClasses = `${typographyClass("subheading")} leading-snug`;

export const cardSubtitleClasses = `${typographyClass("caption")} leading-snug text-muted`;

export const cardBodyTextClasses = typographyClass("body");

/** Street + city/state/ZIP — one block; same tight stack as header title + subtitle. */
export const cardAddressClasses =
  `${typographyClass("body")} flex flex-col gap-0 leading-snug`;

export const cardDividerClasses = "m-0 border-0 border-t border-border";
