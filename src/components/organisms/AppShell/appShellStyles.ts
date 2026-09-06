import { pageHeaderAppBandHeightClasses } from "../../molecules/PageHeader/pageHeaderStyles";
import { clusterSquareClasses, type ClusterTier } from "../../../lib/clusterScale";
import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

export const appShellChromeInsetClasses = "p-1";

export const appShellRootClasses =
  `flex h-full min-h-0 w-full flex-1 gap-2 overflow-hidden bg-body font-sans text-fg ${appShellChromeInsetClasses}`;

export { pageHeaderAppBandHeightClasses as appShellBrandBandHeightClasses };

export const appShellWorkspaceClasses =
  "flex h-full min-h-0 min-w-0 flex-1 self-stretch overflow-x-clip";

export const appShellSecondaryNavHostClasses = (isDragging: boolean) =>
  `w-52 shrink-0 overflow-hidden transition-opacity${isDragging ? "" : ` ${motionTransition("medium")}`}`;

export const appShellCanvasHostClasses = (isDragging: boolean) =>
  `relative z-10 box-border flex min-h-0 min-w-0 flex-1 flex-col self-stretch overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-[margin-left]${isDragging ? "" : ` ${motionTransition("medium")}`}`;

export const appShellCanvasClasses =
  "relative flex min-h-0 min-w-0 flex-1 flex-col self-stretch";

export const appShellBodyClasses =
  "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-[var(--grid-margin)] py-4";

export const appShellDragHandleClasses =
  "absolute left-1 top-1/2 z-20 flex h-11 w-6 -translate-y-1/2 cursor-col-resize! items-center justify-start rounded-full border-0 bg-transparent p-0 touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring";

export const appShellDragHandleBarClasses =
  "pointer-events-none h-8 w-1 rounded-full bg-border-emphasized shadow-hairline";

export const appShellMobileRootClasses =
  "relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-body font-sans text-fg";

export const appShellMobileCanvasHostClasses =
  "relative z-10 box-border flex min-h-0 min-w-0 flex-1 flex-col self-stretch overflow-hidden bg-surface";

export const appShellMobileSecondaryNavClasses =
  "shrink-0 border-b border-border bg-surface px-[var(--grid-margin)] py-2";

export const appShellMobileBodyClasses = cn(appShellBodyClasses, "pb-20");

export const appShellMobileNavClusterTier = "md" satisfies ClusterTier;

export const appShellMobileNavHostClasses =
  "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-stretch px-[var(--grid-margin)] pb-4";

export const appShellMobileNavScrimClasses = cn(
  "pointer-events-auto fixed inset-0 z-40 bg-overlay",
  motionTransition("medium"),
);

export const appShellMobileNavMenuClasses = cn(
  "pointer-events-auto relative z-50 mb-2 flex flex-col gap-0.5 overflow-hidden",
  "rounded-2xl border border-border bg-surface p-1 shadow-raised",
);

export const appShellMobileNavMenuItemClasses = "w-full";

export const appShellMobileNavDockClasses = cn(
  "pointer-events-auto relative z-50 flex w-full items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-raised",
  "[&_[data-layout=nav]]:rounded-full",
  motionTransition("fast"),
);

export const appShellMobileNavActiveButtonClasses = "min-w-0 flex-1";

export const appShellMobileNavActiveLabelClasses = cn(
  typographyClass("body"),
  "min-w-0 truncate text-left font-medium text-fg",
);

export const appShellMobileNavActiveIconClasses = "inline-flex shrink-0 text-fg";

export const appShellMobileNavToggleClasses = cn(
  "flex shrink-0 items-center justify-center",
  clusterSquareClasses[appShellMobileNavClusterTier],
);
