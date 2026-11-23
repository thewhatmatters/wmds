import { glassSurfaceFillClasses } from "../../../lib/glassSurface";
import { focusRingTransitionClasses } from "../../../lib/motion";

export const searchSizes = ["sm", "md", "lg"] as const;

export type SearchSize = (typeof searchSizes)[number];

export const searchVariants = ["surface", "glass"] as const;

export type SearchVariant = (typeof searchVariants)[number];

const searchShellBaseClasses =
  "relative z-10 flex w-full items-center rounded-[var(--radius-control)] border " +
  // Labels and placeholders F10: the pill's ring is the field's; the inset button shows its own.
  "has-[input:focus-visible]:outline-none has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-focus-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-body " +
  focusRingTransitionClasses;

/** Hero search pill — fixed outer height; `p-*` insets the trailing button evenly; `pl-*` extra for the input track. */
export const searchShellClasses: Record<SearchSize, string> = {
  sm: `${searchShellBaseClasses} h-10 gap-1.5 p-1 pl-2`,
  md: `${searchShellBaseClasses} h-11 gap-2 p-1 pl-2`,
  lg: `${searchShellBaseClasses} h-14 gap-2 p-1.5 pl-3`,
};

/**
 * The pill's fill. `glass` is the frosted fill Card and PromptBar use (`--card-glass-tint`,
 * `--card-glass-blur`), for a field over a picture or a scene.
 */
export const searchShellFillClasses: Record<SearchVariant, string> = {
  surface: "bg-surface",
  glass: glassSurfaceFillClasses,
};

/**
 * The pill's resting border. Solid: the control line (3:1). Glass: the hairline elevation edge, as on
 * PromptBar's glass bar; the field is told apart by its fill, its label and the button inside it.
 */
export const searchShellRestBorderClasses: Record<SearchVariant, string> = {
  surface: "border-border-control",
  glass: "border-elevation-edge",
};

/** The pill's border while a validation message shows: the status colour, on either fill. */
export const searchShellStatusBorderClasses = {
  error: "border-error shadow-sm",
  warning: "border-warning shadow-sm",
  success: "border-success shadow-sm",
} as const;

/** The band under the pill tucks up under its lower half, as on Input. */
export const searchBannerSizes: Record<SearchSize, "sm" | "md" | "lg"> = { sm: "sm", md: "md", lg: "lg" };

/** Inline input track — shorter than solo Input md so the inset button can breathe. */
export const searchInlineInputClasses: Record<SearchSize, string> = {
  sm: "h-7 min-h-0 px-2.5 text-xs pointer-coarse:text-base leading-none",
  md: "h-8 min-h-0 pl-4 pr-1 text-sm pointer-coarse:text-base leading-none",
  lg: "h-10 min-h-0 pl-4 pr-1 text-base leading-none",
};

/** On glass the placeholder steps up to the text colour at 80%, as in PromptBar, so it reads over a bright backdrop. */
export const searchInlineInputVariantClasses: Record<SearchVariant, string> = {
  surface: "",
  glass: "placeholder:!text-[color-mix(in_srgb,var(--color-text-primary)_80%,transparent)]",
};

/**
 * The inset action, locked to the inner track: 32px to look at (40px in `lg`), a 44px tap area on touch
 * screens (F10). Its focus ring hugs the button (no offset, as in PromptBar), so it never runs over the pill's edge.
 */
const searchInsetButtonBaseClasses =
  "relative focus-visible:!ring-offset-0 shrink-0 self-center py-0 leading-none pointer-coarse:after:absolute pointer-coarse:after:content-['']";

export const searchInsetButtonClasses: Record<SearchSize, string> = {
  sm: `${searchInsetButtonBaseClasses} h-8 min-h-8 max-h-8 pointer-coarse:after:-inset-1.5`,
  md: `${searchInsetButtonBaseClasses} h-8 min-h-8 max-h-8 pointer-coarse:after:-inset-1.5`,
  // Button md is min-h-11; the important min-height brings it down to the 40px track.
  lg: `${searchInsetButtonBaseClasses} h-10 !min-h-10 max-h-10 pointer-coarse:after:-inset-0.5`,
};

/**
 * With `actionStatus` the action is Button's status pill, which clips its own box. Here the box stays open,
 * or the touch layer above is cut back to the button's own height. The label and glyph clip themselves.
 */
export const searchInsetButtonStatusClasses = "!overflow-visible";

export const searchButtonSizeClasses: Record<SearchSize, "xs" | "sm" | "md"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};
