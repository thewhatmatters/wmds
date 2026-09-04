import { motionTransition } from "../../../lib/motion";

export const chipSizes = ["sm", "md", "lg"] as const;

export type ChipSize = (typeof chipSizes)[number];

export const chipBaseClasses =
  "inline-flex shrink-0 items-center justify-center rounded-full font-sans font-medium tracking-normal " +
  "transition-[background-color,box-shadow,color] " +
  motionTransition("fast");

export const chipSizeClasses: Record<ChipSize, string> = {
  sm: "h-7 gap-1 px-2.5 text-xs leading-none",
  md: "h-9 gap-1.5 px-3 text-sm leading-none",
  lg: "min-h-11 gap-2 px-4 text-sm leading-none",
};

export const chipIconGapClasses: Record<ChipSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

export const chipIconSizeClasses: Record<ChipSize, string> = {
  sm: "size-3 shrink-0 stroke-current",
  md: "size-3.5 shrink-0 stroke-current",
  lg: "size-4 shrink-0 stroke-current",
};

export const chipSelectedClasses = "cursor-pointer bg-surface text-fg shadow-hairline";

export const chipUnselectedClasses = "cursor-pointer text-muted hover:bg-ghost-hover";

/** Read-only labels — border only; no drop (sits flush in panels and cards). */
export const chipReadOnlyClasses =
  "border border-border bg-secondary text-secondary-foreground";

/** Removable shell — same height/typography as filter chips; trailing inset for dismiss. */
export const chipRemovableGapClasses: Record<ChipSize, string> = {
  sm: "h-7 gap-0.5 pl-2.5 pr-1 text-xs leading-none",
  md: "h-9 gap-1 pl-3 pr-2 text-sm leading-none",
  lg: "min-h-11 gap-1 pl-4 pr-2.5 text-sm leading-none",
};

/** Inset dismiss — chip height is fixed; button stays smaller than the shell. */
export const chipRemoveButtonClasses: Record<ChipSize, string> = {
  sm: "inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-ghost-hover hover:text-fg active:bg-ghost-active",
  md: "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-ghost-hover hover:text-fg active:bg-ghost-active",
  lg: "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-ghost-hover hover:text-fg active:bg-ghost-active",
};

export const chipRemoveIconClasses: Record<ChipSize, string> = {
  sm: "size-2.5 stroke-current",
  md: "size-3 stroke-current",
  lg: "size-3.5 stroke-current",
};
