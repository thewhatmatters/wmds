import { focusRingTransitionClasses } from "../../../lib/motion";

export const searchSizes = ["sm", "md"] as const;

export type SearchSize = (typeof searchSizes)[number];

const searchShellBaseClasses =
  "flex w-full items-center rounded-full border border-border bg-surface " +
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-2 focus-within:ring-offset-body " +
  focusRingTransitionClasses;

/** FM hero pill — fixed outer height; py/pr/pl inset the trailing button from the curve. */
export const searchShellClasses: Record<SearchSize, string> = {
  sm: `${searchShellBaseClasses} h-10 gap-1.5 py-1 pl-2 pr-1`,
  md: `${searchShellBaseClasses} h-11 gap-2 py-1.5 pl-2 pr-1.5`,
};

/** Inline input track — shorter than solo Input md so the inset button can breathe. */
export const searchInlineInputClasses: Record<SearchSize, string> = {
  sm: "h-7 min-h-0 px-2.5 text-xs leading-none",
  md: "h-8 min-h-0 pl-4 pr-1 text-sm leading-none",
};

/** Lock inset action height to the inner track — not the full 44px shell. */
export const searchInsetButtonClasses = "h-8 min-h-8 max-h-8 shrink-0 self-center py-0 leading-none";

export const searchButtonSizeClasses: Record<SearchSize, "xs" | "sm"> = {
  sm: "xs",
  md: "sm",
};
