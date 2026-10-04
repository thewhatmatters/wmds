import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

export const descriptionListLayouts = ["inline", "stacked"] as const;

/** `inline` — the value beside the name. `stacked` — the value under the name (tags, actions). */
export type DescriptionListLayout = (typeof descriptionListLayouts)[number];

export const descriptionListRules = ["solid", "dotted", "none"] as const;

/** The hairline between rows — `solid` (default) or the quieter `dotted`; `none` for no rule. */
export type DescriptionListRule = (typeof descriptionListRules)[number];

export const descriptionListVariants = ["sans", "mono"] as const;

/**
 * `sans` (default) — the name in caption type, the value in body type. `mono` — editorial metadata:
 * the name as an eyebrow and the value in mono caps with tabular figures.
 */
export type DescriptionListVariant = (typeof descriptionListVariants)[number];

export const descriptionListRootClasses = "m-0 flex w-full min-w-0 flex-col";

/** The rule under each row; the last row keeps it, closing the list. */
export const descriptionListRuleClasses: Record<DescriptionListRule, string> = {
  solid: "border-b border-border",
  dotted: "border-b border-dotted border-border-emphasized",
  none: "",
};

export const descriptionListRowLayoutClasses: Record<DescriptionListLayout, string> = {
  inline: "grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-baseline gap-x-4 py-3",
  stacked: "flex flex-col gap-2.5 py-3",
};

export const descriptionListNameClasses: Record<DescriptionListVariant, string> = {
  sans: cn("m-0", typographyClass("caption")),
  mono: cn("m-0", typographyClass("eyebrow")),
};

export const descriptionListValueClasses: Record<DescriptionListVariant, string> = {
  sans: cn("m-0 min-w-0", typographyClass("body")),
  mono: "m-0 min-w-0 type-eyebrow tabular-nums text-fg",
};

/** Several values — tags, actions — wrap in a row with a gap. */
export const descriptionListValueFlowClasses: Record<DescriptionListLayout, string> = {
  inline: "flex flex-wrap items-baseline gap-x-2 gap-y-1.5",
  stacked: "flex flex-wrap items-center gap-2",
};
