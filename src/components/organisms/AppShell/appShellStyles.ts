import { cn } from "../../../lib/cn";
import { cardLayoutShellShapeClasses } from "../../molecules/Card/cardStyles";
import { pageHeaderAppBandHeightClasses } from "../../molecules/PageHeader/pageHeaderStyles";

/** Page canvas — the sidebar sits directly on `bg-body`. */
export const appShellRootClasses = "flex h-full min-h-0 w-full bg-body font-sans text-fg";

/** Sidebar column from `lg`; below it the same content opens in a start **Sheet**. */
export const appShellSidebarClasses = "flex h-full min-h-0 w-60 shrink-0 flex-col pt-2 max-lg:!hidden";

/** Same 56px band token as the title bar — their bottom edges align. */
export const appShellBrandClasses = cn(
  "box-border flex shrink-0 items-center gap-2 px-4",
  pageHeaderAppBandHeightClasses,
);

export const appShellSidebarBodyClasses = "min-h-0 flex-1 overflow-y-auto";

/** Pinned under the scrolling nav — the same 16px inset as the brand row. */
export const appShellSidebarFooterClasses = "box-border shrink-0 px-4 py-3";

/** 8px inset around the raised surface (and a docked aside beside it, 8px apart). */
export const appShellCanvasClasses = "flex min-h-0 min-w-0 flex-1 gap-2 p-2";

/**
 * `asideMode="docked"` from `lg`: a second raised surface beside the page, which narrows to make room,
 * so the page stays visible and usable while the aside is open (live controls, a font panel).
 */
export const appShellAsideDockedClasses = cn(
  "flex min-h-0 w-80 shrink-0 flex-col overflow-hidden bg-surface shadow-soft-card",
  cardLayoutShellShapeClasses.rounded,
);

/** Raised surface — the Card shell radius and the soft card shadow. */
export const appShellSurfaceClasses = cn(
  "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface shadow-soft-card",
  cardLayoutShellShapeClasses.rounded,
);

/** First tab stop: hidden until focused, then pinned over the top-start corner. */
export const appShellSkipLinkClasses =
  "sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-control)] " +
  "focus:bg-body focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg " +
  "focus:outline-none focus:ring-2 focus:ring-focus-ring";

export const appShellMainClasses =
  "min-h-0 flex-1 overflow-y-auto px-[var(--grid-margin)] py-6 focus-visible:outline-none";

export const appShellToggleDesktopClasses = "max-lg:!hidden";

export const appShellToggleMobileClasses = "lg:!hidden";

export const appShellSheetBodyClasses = "flex h-full min-h-0 flex-col";
