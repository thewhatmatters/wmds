/** Content rail — fixed-width supporting pane (map + list, settings sidebar). */

export const contentRailWidths = ["sm", "md", "lg"] as const;

export type ContentRailWidth = (typeof contentRailWidths)[number];

export const contentRailRootClasses =
  "flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-surface md:h-full md:max-h-full md:flex-none md:self-stretch";

export const contentRailPositionClasses = {
  start: "border-border md:border-r",
  end: "border-border md:border-l",
} as const;

export type ContentRailPosition = keyof typeof contentRailPositionClasses;

export const contentRailWidthClasses: Record<ContentRailWidth, string> = {
  sm: "md:w-72",
  md: "md:w-80",
  lg: "md:w-96",
};

export const contentRailHeaderClasses =
  "flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3";

export const contentRailBodyClasses = "min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain";
