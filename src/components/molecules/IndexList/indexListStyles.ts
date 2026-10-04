import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

export const indexListSizes = ["lg", "md", "sm"] as const;

/** Title scale — `lg` type-display-3, `md` type-heading-1, `sm` type-heading-3. */
export type IndexListSize = (typeof indexListSizes)[number];

export const indexListTitleElements = ["h2", "h3", "h4"] as const;

export type IndexListTitleElement = (typeof indexListTitleElements)[number];

/**
 * Two tracks once the list is 32rem wide (a container query, so a narrow column on a tablet reads
 * like a phone): the meta column (7.5rem) and the title. Captions and rows share them, so a
 * caption sits over its column. The gap follows the page grid's column gap.
 */
const indexListTracksClasses =
  "@lg:grid @lg:grid-cols-[7.5rem_minmax(0,1fr)] @lg:gap-x-[var(--grid-column-gap,1.5rem)]";

export const indexListRootClasses = "@container flex w-full min-w-0 flex-col";

/** Column captions — hidden below 32rem, where the rows are one column. */
export const indexListCaptionsClasses = cn(
  "@max-lg:hidden border-b border-border-emphasized pb-3 text-muted",
  indexListTracksClasses,
  typographyClass("eyebrow"),
);

export const indexListListClasses = "m-0 list-none p-0 border-t border-border";

/** With captions, their rule is the list's top rule — until they hide in one column. */
export const indexListListCaptionedClasses = "@lg:border-t-0";

/** One row: meta over the title in one column; meta beside it on two tracks, on the title's first baseline. */
export const indexListItemClasses = cn(
  "flex flex-col border-b border-border py-4 @lg:items-baseline",
  indexListTracksClasses,
);

export const indexListMetaClasses = cn(typographyClass("caption"), "mb-1 tabular-nums @lg:mb-0");

/** Title cell — the linked title, then the preview control at the row's end. */
export const indexListTitleCellClasses = "flex min-w-0 items-start gap-3 @lg:col-start-2";

export const indexListTitleSizeClasses: Record<IndexListSize, string> = {
  lg: "type-display-3",
  md: "type-heading-1",
  sm: "type-heading-3",
};

export const indexListTitleClasses = "min-w-0 flex-1 text-pretty text-fg";

/** Centers the 44px preview control on the title's first line, at each size. */
export const indexListToggleAlignClasses: Record<IndexListSize, string> = {
  lg: "mt-[calc((var(--text-display-3-size)*var(--text-display-3-leading)-2.75rem)/2)]",
  md: "mt-[calc((var(--text-heading-1-size)*var(--text-heading-1-leading)-2.75rem)/2)]",
  sm: "mt-[calc((var(--text-heading-3-size)*var(--text-heading-3-leading)-2.75rem)/2)]",
};

export const indexListChevronClasses = cn("transition-transform", motionTransition("medium"));

export const indexListChevronOpenClasses = "rotate-180";

/** The preview panel sits under the title, in the title column. */
export const indexListPanelClasses = "@lg:col-start-2";

export const indexListPanelInnerClasses = "overflow-hidden";

export const indexListPanelContentClasses = cn(typographyClass("body"), "text-muted pt-2 pb-1 pr-14");

/** Empty state — between the same rules as the rows. */
export const indexListEmptyClasses = "border-y border-border py-8";
