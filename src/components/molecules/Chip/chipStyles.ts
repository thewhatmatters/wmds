import { motionTransition } from "../../../lib/motion";
import { clusterHeightClasses } from "../../../lib/clusterScale";

export const chipSizes = ["sm", "md", "lg"] as const;

export type ChipSize = (typeof chipSizes)[number];

export const chipBaseClasses =
  "inline-flex shrink-0 items-center justify-center rounded-full font-sans font-medium tracking-normal " +
  "transition-[background-color,box-shadow,color] " +
  motionTransition("fast");

export const chipSizeClasses: Record<ChipSize, string> = {
  sm: `${clusterHeightClasses.sm} gap-1 px-2.5 text-xs leading-none`,
  md: `${clusterHeightClasses.md} gap-1.5 px-3 text-sm leading-none`,
  lg: `${clusterHeightClasses.lg} gap-2 px-4 text-sm leading-none`,
};

export const chipIconGapClasses: Record<ChipSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

export const chipSelectedClasses = "cursor-pointer bg-surface text-fg shadow-hairline";

export const chipUnselectedClasses = "cursor-pointer text-muted hover:bg-ghost-hover";

/** Read-only labels — border only; no drop (sits flush in panels and cards). */
export const chipReadOnlyClasses =
  "border border-border bg-secondary text-secondary-foreground";

/** Removable shell — same height/typography as filter chips; trailing inset for dismiss. */
export const chipRemovableGapClasses: Record<ChipSize, string> = {
  sm: `${clusterHeightClasses.sm} gap-0.5 pl-2.5 pr-1 text-xs leading-none`,
  md: `${clusterHeightClasses.md} gap-1 pl-3 pr-2 text-sm leading-none`,
  lg: `${clusterHeightClasses.lg} gap-1 pl-4 pr-2.5 text-sm leading-none`,
};
