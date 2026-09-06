import { motionTransition } from "../../../lib/motion";
import { cn } from "../../../lib/cn";
import { clusterSquareClasses, type ClusterTier } from "../../../lib/clusterScale";
import { pageHeaderAppBandHeightClasses } from "../../molecules/PageHeader/pageHeaderStyles";

/** Icon row cluster tier — **IconButton** via `iconButtonSizeForCluster(navRailClusterTier)`. */
export const navRailClusterTier = "md" satisfies ClusterTier;

export const navRailItemSurfaces = ["flat", "glass"] as const;

export type NavRailItemSurface = (typeof navRailItemSurfaces)[number];

/** Outer slot — full column height beside workspace (example shell inset). */
export const navRailSlotClasses = "box-border flex h-full min-h-0 shrink-0 flex-col";

export const navRailItemStackGapClasses = "gap-2";

/** Floating accent rail — `w-14` (56px), rounded sheet on `bg-accent`. */
export const navRailShellClasses = cn(
  "flex min-h-0 w-14 flex-1 flex-col items-center rounded-2xl bg-accent px-0 pb-4 text-on-accent shadow-raised",
  navRailItemStackGapClasses,
);

export const navRailBrandBandClasses = cn(
  "box-border flex w-full shrink-0 items-center justify-center",
  pageHeaderAppBandHeightClasses,
);

export const navRailBrandClasses = "flex items-center justify-center text-on-accent";

export const navRailBrandMarkClasses = "size-6 shrink-0";

export const navRailMainNavClasses = cn(
  "flex min-h-0 w-full flex-1 flex-col items-center justify-center",
  navRailItemStackGapClasses,
);

export const navRailFooterClasses = cn(
  "flex w-full shrink-0 flex-col items-center",
  navRailItemStackGapClasses,
);

export const navRailItemWrapClasses = cn(
  "relative flex items-center justify-center",
  clusterSquareClasses[navRailClusterTier],
);

const navRailItemActiveIndicatorBaseClasses =
  "pointer-events-none absolute inset-0 rounded-full " + motionTransition("fast");

export const navRailItemActiveIndicatorClasses: Record<NavRailItemSurface, string> = {
  flat: cn(navRailItemActiveIndicatorBaseClasses, "bg-on-accent/25"),
  glass: cn(
    navRailItemActiveIndicatorBaseClasses,
    "bg-on-accent/12 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.14)] ring-1 ring-inset ring-on-accent/22 backdrop-blur-sm",
  ),
};

/** Ghost **IconButton** on accent rail — scoped hover; active page skips button fill. */
export const navRailIconScopeClasses: Record<NavRailItemSurface, string> = {
  flat:
    "[&_button]:relative [&_button]:z-10 [&_button]:rounded-full [&_button]:text-on-accent " +
    "[&_button]:hover:bg-on-accent/10 [&_button]:active:bg-on-accent/15 " +
    "[&_button[aria-current=page]]:hover:bg-transparent [&_button[aria-current=page]]:active:bg-transparent",
  glass:
    "[&_button]:relative [&_button]:z-10 [&_button]:rounded-full [&_button]:text-on-accent " +
    "[&_button:not([aria-current=page])]:hover:bg-on-accent/8 " +
    "[&_button:not([aria-current=page])]:hover:backdrop-blur-sm " +
    "[&_button:not([aria-current=page])]:hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.1)] " +
    "[&_button:not([aria-current=page])]:hover:ring-1 [&_button:not([aria-current=page])]:hover:ring-inset " +
    "[&_button:not([aria-current=page])]:hover:ring-on-accent/18 " +
    "[&_button:not([aria-current=page])]:active:bg-on-accent/12 " +
    "[&_button[aria-current=page]]:hover:bg-transparent [&_button[aria-current=page]]:active:bg-transparent",
};
