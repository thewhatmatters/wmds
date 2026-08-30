import { typographyClass } from "../../../lib/typography";

export const cardShapes = ["flush", "rounded"] as const;

export type CardShape = (typeof cardShapes)[number];

export const cardVariants = ["surface", "outlined", "ghost"] as const;

export type CardVariant = (typeof cardVariants)[number];

export const cardPaddings = ["none", "md", "lg"] as const;

export type CardPadding = (typeof cardPaddings)[number];

/** Default flush — cards sit inside panels/sidebars without their own radius. */
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

export const cardSectionPaddingClasses: Record<
  CardPadding,
  { header: string; body: string; footer: string }
> = {
  none: {
    header: "flex flex-col gap-1.5 border-b border-border px-4 pb-3 pt-4",
    body: "px-4 py-3",
    footer: "flex items-center justify-between gap-3 border-t border-border px-4 py-3",
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
