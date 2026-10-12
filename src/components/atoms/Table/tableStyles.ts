import { typographyClass } from "../../../lib/typography";

export const tableAligns = ["start", "center", "end"] as const;

/** Horizontal alignment of a column's text — `end` for figures. */
export type TableAlign = (typeof tableAligns)[number];

/** The scroll box. Focusable so a keyboard can scroll a wide table. */
export const tableScrollClasses =
  "w-full max-w-full overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring";

export const tableClasses = `w-full min-w-max caption-bottom border-collapse text-fg ${typographyClass("body")}`;

export const tableHeaderClasses = "[&_tr]:border-b [&_tr]:border-border";

export const tableBodyClasses = "[&_tr:last-child]:border-b-0";

export const tableFooterClasses = "border-t border-border-emphasized [&>tr]:border-b-0";

export const tableRowClasses = "border-b border-border transition-colors hover:bg-ghost-hover";

export const tableHeadClasses = `h-11 px-3 text-start align-middle font-normal whitespace-nowrap text-muted ${typographyClass("caption")}`;

export const tableCellClasses = "px-3 py-3 align-middle";

export const tableCaptionClasses = `mt-3 text-start text-muted ${typographyClass("caption")}`;

export const tableAlignClasses: Record<TableAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end tabular-nums",
};
