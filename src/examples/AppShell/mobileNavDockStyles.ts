import { motionTransition } from "../../lib/motion";
import { cn } from "../../lib/cn";
import { clusterSquareClasses, type ClusterTier } from "../../lib/clusterScale";
import { typographyClass } from "../../lib/typography";

/** Dock control row — **IconButton** via `iconButtonSizeForCluster(mobileNavDockClusterTier)`. */
export const mobileNavDockClusterTier = "md" satisfies ClusterTier;

/** Fixed host — grid margin inset; sits above canvas content. */
export const mobileNavDockHostClasses =
  "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-stretch px-[var(--grid-margin)] pb-4";

/** Scrim — dismiss expanded menu; `--color-overlay` token. */
export const mobileNavDockScrimClasses = cn(
  "pointer-events-auto fixed inset-0 z-40 bg-overlay",
  motionTransition("medium"),
);

/** One elevated menu surface — full-width rows stay visually grouped above the dock. */
export const mobileNavDockMenuClasses = cn(
  "pointer-events-auto relative z-50 mb-2 flex flex-col gap-0.5 overflow-hidden",
  "rounded-2xl border border-border bg-surface p-1 shadow-raised",
);

export const mobileNavDockMenuItemWrapClasses = "w-full";

/** Floating dock pill — active summary + expand control. */
export const mobileNavDockShellClasses = cn(
  "pointer-events-auto relative z-50 flex w-full items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-raised",
  "[&_[data-layout=nav]]:rounded-full",
  motionTransition("fast"),
);

export const mobileNavDockActiveButtonClasses = "min-w-0 flex-1";

export const mobileNavDockActiveLabelClasses = cn(
  typographyClass("body"),
  "min-w-0 truncate text-left font-medium text-fg",
);

export const mobileNavDockActiveIconClasses = "inline-flex shrink-0 text-fg";

export const mobileNavDockToggleWrapClasses = cn(
  "flex shrink-0 items-center justify-center",
  clusterSquareClasses[mobileNavDockClusterTier],
);

/** Canvas clearance — keep content above the dock pill (~52px + 16px inset). */
export const appShellMobileBodyPadBottomClasses = "pb-20";
