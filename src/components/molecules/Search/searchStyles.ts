import { focusRingTransitionClasses } from "../../../lib/motion";

export const searchSizes = ["sm", "md"] as const;

export type SearchSize = (typeof searchSizes)[number];

const searchShellBaseClasses =
  "flex w-full items-center rounded-[var(--radius-control)] border border-border-control bg-surface " +
  // Labels and placeholders F10: the pill's ring is the field's; the inset button shows its own.
  "has-[input:focus-visible]:outline-none has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-focus-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-body " +
  focusRingTransitionClasses;

/** Hero search pill — fixed outer height; `p-*` insets the trailing button evenly; `pl-*` extra for the input track. */
export const searchShellClasses: Record<SearchSize, string> = {
  sm: `${searchShellBaseClasses} h-10 gap-1.5 p-1 pl-2`,
  md: `${searchShellBaseClasses} h-11 gap-2 p-1 pl-2`,
};

/** Inline input track — shorter than solo Input md so the inset button can breathe. */
export const searchInlineInputClasses: Record<SearchSize, string> = {
  sm: "h-7 min-h-0 px-2.5 text-xs pointer-coarse:text-base leading-none",
  md: "h-8 min-h-0 pl-4 pr-1 text-sm pointer-coarse:text-base leading-none",
};

/** Lock inset action height to the inner track — not the full 44px shell. */
/** The inset action: 32px to look at, a 44px tap area on touch screens (F10). */
export const searchInsetButtonClasses =
  "relative h-8 min-h-8 max-h-8 shrink-0 self-center py-0 leading-none pointer-coarse:after:absolute pointer-coarse:after:-inset-1.5 pointer-coarse:after:content-['']";

export const searchButtonSizeClasses: Record<SearchSize, "xs" | "sm"> = {
  sm: "xs",
  md: "sm",
};
