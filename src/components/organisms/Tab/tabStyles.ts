import { clusterHeightClasses } from "../../../lib/clusterScale";
import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

export const tabSizes = ["sm", "md", "lg"] as const;
export type TabSize = (typeof tabSizes)[number];

export const tabRootClasses = "relative min-w-0";

/** Label row. Overflow is resolved into More rather than horizontal scrolling. */
export const tabListClasses = cn(
  "relative inline-flex max-w-full items-stretch",
  motionTransition("fast"),
);

export const tabItemSizeClasses: Record<TabSize, string> = {
  sm: cn(clusterHeightClasses.sm, "px-2.5"),
  md: cn(clusterHeightClasses.md, "px-3"),
  lg: cn(clusterHeightClasses.lg, "px-4"),
};

export const tabItemClasses = cn(
  "relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full",
  typographyClass("ui-label"),
  "font-normal text-muted transition-colors hover:bg-ghost-hover hover:text-fg",
  motionTransition("fast"),
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
  "disabled:pointer-events-none disabled:opacity-50",
);

export const tabItemSelectedClasses = "font-medium text-fg";

/** Shared active rule — Motion moves one underline beneath the selected label. */
export const tabIndicatorClasses =
  "pointer-events-none absolute inset-x-3 bottom-[-2px] h-0.5 rounded-full bg-fg";

export const tabItemContentClasses = "relative z-10";

export const tabCountClasses =
  "font-mono text-[10.5px] leading-none tabular-nums text-muted";

export const tabMoreIconClasses = "size-3.5 shrink-0 stroke-current";

/** Invisible exact-size specimens used by ResizeObserver overflow calculation. */
export const tabMeasureRailClasses =
  "pointer-events-none invisible absolute left-0 top-0 -z-10 flex w-max";
