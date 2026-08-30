import { typographyClass } from "../../../lib/typography";

export const cardShapes = ["flush", "rounded"] as const;

export type CardShape = (typeof cardShapes)[number];

export const cardVariants = ["surface", "outlined", "ghost"] as const;

export type CardVariant = (typeof cardVariants)[number];

export const cardPaddings = ["none", "md", "lg"] as const;

export type CardPadding = (typeof cardPaddings)[number];

/** Default rounded — layout cards float with shell radius + shadow; use flush when parent owns chrome. */
export const cardBaseClasses = "flex w-full flex-col overflow-hidden font-sans text-fg";

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
 * Layout card — header/footer on white shell; body is a muted inset well (`bg-body`).
 * Default for `padding="none"` + Header / Body / Footer.
 */
export const cardLayoutShellClasses = "gap-3 bg-surface p-4";

export const cardLayoutShellShapeClasses: Record<CardShape, string> = {
  flush: "",
  rounded: "rounded-2xl shadow-md",
};

export const cardLayoutHeaderClasses = "flex flex-col gap-1.5";

/** Inset content well — muted surface recessed inside the white shell. */
export const cardLayoutBodyWellClasses = "rounded-xl bg-body p-3";

export const cardLayoutFooterClasses = "flex items-center justify-between gap-3";

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
    header: "flex flex-col gap-2 border-b border-border px-4 pb-3 pt-4",
    body: "px-4 py-3",
    footer: "flex items-center justify-between gap-4 border-t border-border px-4 py-3",
  },
  lg: {
    header: "flex flex-col gap-2 border-b border-border px-6 pb-4 pt-6",
    body: "px-6 py-4",
    footer: "flex items-center justify-between gap-4 border-t border-border px-6 py-4",
  },
};

export const cardTitleClasses = typographyClass("subheading");

export const cardBodyTextClasses = typographyClass("body");

/** Street + city/state/ZIP — one block; tighter line spacing than header `gap-1.5`. */
export const cardAddressClasses =
  `${typographyClass("body")} flex flex-col gap-0 leading-snug`;

export const cardDividerClasses = "m-0 border-0 border-t border-border";
