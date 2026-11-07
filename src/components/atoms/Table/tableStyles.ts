import { typographyClass } from "../../../lib/typography";

export const tableAligns = ["start", "center", "end"] as const;

/** Horizontal alignment of a column's text — `end` for figures. */
export type TableAlign = (typeof tableAligns)[number];

/** The scroll box. Focusable so a keyboard can scroll a wide table. */
export const tableScrollClasses =
  "w-full max-w-full overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring";

/** A table with a `colgroup` lays its columns out from the `col` widths, so a filled and an empty table match. */
export const tableClasses = `w-full min-w-max caption-bottom border-collapse has-[colgroup]:table-fixed text-fg ${typographyClass("body")}`;

/** `rules="grid"`: a rule between every column and round the outside, so each cell is a ruled box (a pricing grid). */
export const tableGridRulesClasses =
  // Fits its box (equal columns that wrap) instead of growing to its content's width like a data table.
  "!min-w-0 border border-border [&_th]:border-x [&_th]:border-border [&_td]:border-x [&_td]:border-border " +
  // Roomier cells, the same inset in every cell, so a column's content lines up from its header down.
  "[&_th]:px-6 [&_td]:px-6 [&_td]:py-4 lg:[&_th]:px-8 lg:[&_td]:px-8";

export const tableHeaderClasses = "[&_tr]:border-b [&_tr]:border-border";

export const tableBodyClasses = "[&_tr:last-child]:border-b-0";

export const tableFooterClasses = "border-t border-border-emphasized [&>tr]:border-b-0";

export const tableRowClasses = "border-b border-border transition-colors hover:bg-ghost-hover";

export const tableHeadClasses = `h-11 px-3 text-start align-middle font-normal whitespace-nowrap ${typographyClass("ui-label")}`;

export const tableCellClasses = "px-3 py-3 align-middle";

/**
 * `stickyHeader` (with `rules="grid"`, which fits its box): the scroll box lets go of its overflow so the header row
 * can stick to the page, and the whole header (every header row) pins to the top (below `--table-sticky-top`, e.g. a fixed nav's height),
 * opaque so the rows slide under them.
 */
export const tableStickyHeaderScrollClasses = "!overflow-visible";
export const tableStickyHeaderClasses =
  "[&_thead]:sticky [&_thead]:top-[var(--table-sticky-top,0px)] [&_thead]:z-10 [&_thead]:bg-body [&_thead]:shadow-[0_1px_0_var(--color-border)]";

/** A header cell that holds more than a label (a package's name, price and action): wraps, sits at the top, roomier. */
export const tableHeadWrapClasses = "!h-auto !whitespace-normal !align-top py-6 lg:py-8";

export const tableCaptionClasses = `mt-3 text-start ${typographyClass("body")} text-muted`;

/** A column pinned to the start edge while the rest scrolls — opaque so cells slide under it. */
export const tableStickyClasses = "sticky start-0 z-10 bg-body";

export const tableAlignClasses: Record<TableAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end tabular-nums",
};
