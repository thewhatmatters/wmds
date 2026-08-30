import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

export const listVariants = ["surface", "ghost"] as const;

export type ListVariant = (typeof listVariants)[number];

export const listItemLayouts = ["stacked", "split"] as const;

export type ListItemLayout = (typeof listItemLayouts)[number];

/** List root — panel inset; parent owns outer radius ([Astryx List](https://astryx.atmeta.com/components/List)). */
export const listRootClasses = "flex w-full flex-col font-sans text-fg";

export const listVariantClasses: Record<ListVariant, string> = {
  surface: "bg-surface",
  ghost: "bg-transparent",
};

/** Optional chrome above rows — FM filter/search sits outside the list. */
export const listHeaderClasses =
  "border-b border-border-emphasized px-4 py-3 type-label text-fg";

export const listBodyClasses = "m-0 flex list-none flex-col p-0";

export const listBodyDividersClasses = "divide-y divide-border";

export const listItemButtonClasses =
  "w-full text-left " +
  motionTransition("fast") +
  " transition-colors hover:bg-ghost-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50";

export const listItemSelectedClasses = "bg-body";

/** ~8px inset rhythm — Astryx List owns the content line inside Section padding={0}. */
export const listItemPaddingClasses = "px-4 py-3";

export const listItemStackedContentClasses = "flex w-full flex-col gap-0.5";

export const listItemSplitContentClasses = "flex w-full items-start gap-3";

export const listItemPrimaryColumnClasses = "flex min-w-0 flex-1 flex-col gap-0.5";

export const listItemPrimaryClasses = typographyClass("ui-label");

export const listItemSecondaryClasses = typographyClass("caption");

export const listItemMetaClasses = `${typographyClass("caption")} tabular-nums`;

export const listItemMetaColumnClasses = "flex shrink-0 flex-col items-end";

export const listItemTrailingSplitClasses = "mt-1.5 flex flex-wrap gap-1.5";

export const listItemTrailingStackClasses = "mt-1";
