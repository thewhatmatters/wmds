/**
 * Errors and validation V5: the summary at the top of a form after a failed submit. A heavy error
 * edge so it reads as the place to start, the page surface inside, error-coloured links (7:1 light,
 * 12:1 dark on the page).
 */
export const errorSummaryClasses =
  "flex flex-col gap-3 rounded-[var(--radius-surface-md)] border-2 border-error bg-surface p-4 outline-none focus-visible:ring-2 focus-visible:ring-error-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body md:p-5";

export const errorSummaryTitleClasses = "type-heading-3 text-fg";

export const errorSummaryListClasses = "flex flex-col gap-2";

export const errorSummaryLinkClasses =
  "type-body font-medium text-error underline decoration-solid underline-offset-4 hover:decoration-2 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export const errorSummaryHeadingLevels = ["h2", "h3"] as const;
export type ErrorSummaryHeadingLevel = (typeof errorSummaryHeadingLevels)[number];
