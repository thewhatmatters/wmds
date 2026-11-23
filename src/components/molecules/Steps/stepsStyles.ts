export const stepsLayouts = ["rows", "columns"] as const;

/**
 * `rows` (default) stacks the steps at every width, the number in a column beside the words.
 * `columns` sets them side by side from `md`, the number above the words; on a phone it is `rows`.
 */
export type StepsLayout = (typeof stepsLayouts)[number];

export const stepsTitleTags = ["h2", "h3", "h4", "p"] as const;

export type StepsTitleTag = (typeof stepsTitleTags)[number];

const stepsRootBaseClasses = "m-0 flex min-w-0 list-none flex-col gap-8 p-0";

export const stepsRootClasses: Record<StepsLayout, string> = {
  rows: stepsRootBaseClasses,
  columns: `${stepsRootBaseClasses} md:grid md:auto-cols-fr md:grid-flow-col md:gap-x-8`,
};

/** One rule above each step: the list reads as ruled between steps, and opens on a rule. */
const stepsItemBaseClasses =
  "grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 border-t border-border pt-6";

export const stepsItemClasses: Record<StepsLayout, string> = {
  rows: stepsItemBaseClasses,
  columns: `${stepsItemBaseClasses} md:grid-cols-1 md:content-start md:gap-y-4`,
};

export const stepsNumberClasses = "text-muted type-eyebrow tabular-nums";

export const stepsBodyClasses = "min-w-0";

export const stepsTitleClasses = "m-0 text-fg type-heading-2 [overflow-wrap:anywhere]";

export const stepsTextClasses = "m-0 mt-2 text-muted type-reading [overflow-wrap:anywhere]";
