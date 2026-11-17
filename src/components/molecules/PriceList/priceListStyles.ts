import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

export const priceListLayouts = ["inline", "stacked"] as const;

/**
 * `inline` — from `md` the note sits beside the name, on one line with the price; on phones it drops
 * under the name. `stacked` — the note stays under the name at every width.
 */
export type PriceListLayout = (typeof priceListLayouts)[number];

export const priceListRules = ["solid", "dotted", "none"] as const;

/** The hairline under each row — `solid` (default) or the quieter `dotted`; `none` for no rule. */
export type PriceListRule = (typeof priceListRules)[number];

export const priceListSizes = ["md", "lg"] as const;

/** `md` (default) — a label-size name. `lg` — the name and price a step up, in the heading face (a menu). */
export type PriceListSize = (typeof priceListSizes)[number];

const priceListRootBase = "m-0 grid w-full min-w-0 list-none gap-x-4 p-0";

/**
 * The list is the grid and each row a subgrid of it, so prices line up down the list. The price track
 * is `fit-content`: it takes what the price needs, and a long price wraps instead of squeezing the name out.
 */
export const priceListRootClasses: Record<PriceListLayout, string> = {
  inline: cn(
    priceListRootBase,
    "grid-cols-[minmax(0,1fr)_fit-content(40%)]",
    "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_fit-content(25%)] md:gap-x-6",
  ),
  stacked: cn(priceListRootBase, "grid-cols-[minmax(0,1fr)_fit-content(40%)]"),
};

export const priceListRowClasses = "col-span-full grid grid-cols-subgrid items-baseline gap-y-1 py-3";

/** The rule under each row; the last row keeps it, closing the list. */
export const priceListRuleClasses: Record<PriceListRule, string> = {
  solid: "border-b border-border",
  dotted: "border-b border-dotted border-border-emphasized",
  none: "",
};

const priceListNameBase = "col-start-1 row-start-1 m-0 min-w-0 [overflow-wrap:anywhere]";

export const priceListNameClasses: Record<PriceListSize, string> = {
  md: cn(priceListNameBase, typographyClass("ui-label")),
  lg: cn(priceListNameBase, "type-heading-3 text-fg"),
};

const priceListNoteBase = "col-start-1 row-start-2 m-0 min-w-0 type-body text-muted [overflow-wrap:anywhere]";

export const priceListNoteClasses: Record<PriceListLayout, string> = {
  inline: cn(priceListNoteBase, "md:col-start-2 md:row-start-1"),
  stacked: priceListNoteBase,
};

const priceListPriceBase = "col-start-2 row-start-1 m-0 min-w-0 text-end tabular-nums";

const priceListPriceSizeClasses: Record<PriceListSize, string> = {
  md: typographyClass("ui-label"),
  lg: "type-heading-3 text-fg",
};

export function priceListPriceClasses(layout: PriceListLayout, size: PriceListSize) {
  return cn(priceListPriceBase, priceListPriceSizeClasses[size], layout === "inline" && "md:col-start-3");
}
