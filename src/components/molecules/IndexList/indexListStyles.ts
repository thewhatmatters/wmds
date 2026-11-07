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

/**
 * `columns="page"`: the list sits on the WMDS page grid (subgrid) instead of its own tracks. The meta takes the
 * first two columns from md (above the title on phones), the title the width, and a row's arrow the last column.
 */
export const indexListPageRootClasses = "col-span-full grid min-w-0 grid-cols-subgrid";
export const indexListPageListClasses = "col-span-full grid grid-cols-subgrid";
export const indexListPageCaptionsClasses = cn(
  "col-span-full grid-cols-subgrid border-b border-border-emphasized pb-3 text-muted max-md:hidden md:grid",
  typographyClass("eyebrow"),
);
export const indexListPageItemClasses = "col-span-full grid grid-cols-subgrid items-baseline border-b border-border py-4";
export const indexListPageMetaClasses = cn(typographyClass("caption"), "col-span-full mb-1 tabular-nums md:col-span-2 md:mb-0");
/** The title cell beside the meta; a row with an end cell (tags, arrow) leaves the last columns for it. */
export const indexListPageTitleCellClasses = "col-span-full flex min-w-0 items-start gap-3 md:col-span-6 md:col-start-3 lg:col-span-10";
export const indexListPageTitleCellEndClasses = "col-span-3 flex min-w-0 items-start gap-3 md:col-span-4 md:col-start-3 lg:col-span-7";
/** The end cell: the row's tags (badges) then its arrow, flush to the end; one column on phones (arrow only), two from md, three from lg. */
export const indexListPageEndClasses = "col-span-1 flex items-center justify-end gap-3 self-center md:col-span-2 lg:col-span-3";
/** Tags sit in the end cell from md; on phones they join the meta line. */
export const indexListTagsClasses = "flex-wrap justify-end gap-2 max-md:hidden md:flex";
export const indexListTagsInMetaClasses = "ms-2 flex-wrap gap-2 align-middle max-md:inline-flex md:hidden";
export const indexListPagePanelClasses = "col-span-full md:col-span-6 md:col-start-3 lg:col-span-10";

/**
 * A row that is one link (`arrow` or `external`): the title's link covers the whole row, and the row lights up under
 * the pointer or keyboard focus with a quiet fill that bleeds a little past the text.
 */
export const indexListRowLinkClasses = cn(
  "group/row relative isolate [&_a]:after:absolute [&_a]:after:inset-0 [&_a]:after:content-['']",
  "before:pointer-events-none before:absolute before:inset-y-0 before:-inset-x-3 before:-z-10 before:rounded-md before:bg-ghost-hover before:opacity-0",
  "has-[a:hover]:before:opacity-100 has-[a:focus-visible]:before:opacity-100",
  motionTransition("fast"),
  "before:transition-opacity",
);
/** The row's arrow at the end: decorative (the title says where it goes), nudged on hover. */
export const indexListArrowClasses = cn(
  "pointer-events-none flex shrink-0 justify-end self-center text-muted transition-transform",
  motionTransition("fast"),
);
export const indexListArrowNudgeClasses = "group-has-[a:hover]/row:translate-x-1";
export const indexListArrowNudgeExternalClasses = "group-has-[a:hover]/row:-translate-y-0.5 group-has-[a:hover]/row:translate-x-0.5";
/** The preview control stays clickable over the row's link. */
export const indexListToggleAboveRowClasses = "relative z-10";
