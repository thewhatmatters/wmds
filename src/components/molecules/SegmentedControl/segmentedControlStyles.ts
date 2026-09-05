import { clusterHeightClasses } from "../../../lib/clusterScale";
import { motionTransition } from "../../../lib/motion";
import { cn } from "../../../lib/cn";

export const segmentedControlSizes = ["sm", "md", "lg"] as const;

export type SegmentedControlSize = (typeof segmentedControlSizes)[number];

export const segmentedControlLayouts = ["hug", "stretch"] as const;

export type SegmentedControlLayout = (typeof segmentedControlLayouts)[number];

/** Shared track — inset padding matches Dropdown menu (`p-0.5`). Outer height = cluster tier (ADR-0011). */
export const segmentedControlTrackClasses = cn(
  "relative inline-flex items-stretch rounded-full bg-secondary p-0.5 shadow-hairline",
  motionTransition("fast"),
);

export const segmentedControlTrackStretchClasses = "flex w-full min-w-0";

/** Track shell — same pixel heights as **Chip** / cluster table (28 / 36 / 44px). */
export const segmentedControlTrackSizeClasses: Record<SegmentedControlSize, string> = {
  sm: clusterHeightClasses.sm,
  md: clusterHeightClasses.md,
  lg: clusterHeightClasses.lg,
};

/**
 * Segment label typography + horizontal pad — matches **Chip** filter shells at each tier.
 * `size` prop names align 1:1 with cluster tiers (unlike **Button** xs/sm/md).
 */
export const segmentedControlItemSizeClasses: Record<SegmentedControlSize, string> = {
  sm: "px-2.5 text-xs leading-none",
  md: "px-3 text-sm leading-none",
  lg: "px-4 text-sm leading-none",
};

export const segmentedControlItemClasses = cn(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-sans font-medium tracking-normal",
  "transition-[color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
  motionTransition("fast"),
);

export const segmentedControlItemStretchClasses = "min-w-0 flex-1";

export const segmentedControlItemBodyClasses =
  "relative z-10 inline-flex min-w-0 items-center justify-center";

export const segmentedControlItemBodyStretchClasses = "w-full";

/** Gap between start | label | end — matches **Chip** icon gaps at each tier. */
export const segmentedControlItemGapClasses: Record<SegmentedControlSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

/** Leading slot — icon or swatch from stories; wrap Lucide in **ButtonIcon** / **BadgeIcon**. */
export const segmentedControlItemStartClasses: Record<SegmentedControlSize, string> = {
  sm: "flex shrink-0 items-center text-current [&>svg]:size-3 [&>svg]:shrink-0 [&>svg]:stroke-current",
  md: "flex shrink-0 items-center text-current [&>svg]:size-3.5 [&>svg]:shrink-0 [&>svg]:stroke-current",
  lg: "flex shrink-0 items-center text-current [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-current",
};

export const segmentedControlItemLabelClasses = "min-w-0 truncate";

/** Trailing meta — count or key cap; prefer **BadgeSegmentCount** for filter-style totals. */
export const segmentedControlItemEndClasses =
  "shrink-0 font-mono text-[10.5px] leading-none tabular-nums text-muted";

export const segmentedControlItemSelectedClasses = "text-fg";

/** Idle segment — `text-muted` (secondary text); hover promotes to primary ink. */
export const segmentedControlItemUnselectedClasses = "text-muted hover:text-fg";

export const segmentedControlThumbClasses =
  "pointer-events-none absolute inset-0 rounded-full bg-surface shadow-hairline";
