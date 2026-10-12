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

/** 8px inset around the raised surface. */
export const appShellCanvasClasses = "flex min-h-0 min-w-0 flex-1 p-2";

/** Raised surface — the Card shell radius and the soft card shadow. */
export const appShellSurfaceClasses = cn(
  "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface shadow-soft-card",
  cardLayoutShellShapeClasses.rounded,
);

export const appShellMainClasses =
  "min-h-0 flex-1 overflow-y-auto px-[var(--grid-margin)] py-6 focus-visible:outline-none";

export const appShellToggleDesktopClasses = "max-lg:!hidden";

export const appShellToggleMobileClasses = "lg:!hidden";

export const appShellSheetBodyClasses = "flex h-full min-h-0 flex-col";
