import { pageHeaderAppBandHeightClasses } from "../../components/molecules/PageHeader/pageHeaderStyles";
import { motionTransition } from "../../lib/motion";
import { type ClusterTier } from "../../lib/clusterScale";

/**
 * Application shell — example-tier class recipes.
 * Desktop: body gutter, floating nav accents, inset canvas sheet.
 */

/** Header identity row — account **Avatar** at cluster **sm** (28px). */
export const appShellHeaderClusterTier = "sm" satisfies ClusterTier;

/** 4px body gutter around the shell chrome (`p-1` at 4px base). */
export const appShellChromeInsetClasses = "p-1";

/** Viewport shell — fills Storybook fullscreen shell; inset on all edges. */
export const appShellRootClasses =
  `flex h-full min-h-0 w-full flex-1 gap-2 overflow-hidden bg-body font-sans text-fg ${appShellChromeInsetClasses}`;

/** Shared 56px band height — re-export for example docs/tests. */
export { pageHeaderAppBandHeightClasses as appShellBrandBandHeightClasses };

/** Side nav + canvas — fills root inset beside **NavRail**. */
export const appShellWorkspaceClasses =
  "flex h-full min-h-0 min-w-0 flex-1 self-stretch overflow-x-clip";

/** **NavList** host — fixed width; canvas slides over when revealed. */
export const sideNavHostClasses = (isDragging: boolean) =>
  `w-52 shrink-0 overflow-hidden transition-opacity${isDragging ? "" : ` ${motionTransition("medium")}`}`;

/** Canvas host — sheet chrome; **border** (not shadow hairline) survives \`overflow-hidden\`. */
export const appCanvasHostClasses = (isDragging: boolean) =>
  `relative z-10 box-border flex min-h-0 min-w-0 flex-1 flex-col self-stretch overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-[margin-left]${isDragging ? "" : ` ${motionTransition("medium")}`}`;

/** Inner flex column — layout only; chrome on **appCanvasHostClasses**. */
export const appCanvasShellClasses =
  "relative flex min-h-0 min-w-0 flex-1 flex-col self-stretch";

/** Vertical drag pill — inset on the canvas leading edge (inside the sheet). */
export const appCanvasDragHandleButtonClasses =
  "absolute left-1 top-1/2 z-20 flex h-11 w-6 -translate-y-1/2 cursor-col-resize! items-center justify-start rounded-full border-0 bg-transparent p-0 touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring";

export const appCanvasDragHandleBarClasses =
  "pointer-events-none h-8 w-1 rounded-full bg-border-emphasized shadow-hairline";

/**
 * Scrollable canvas body — Tailwind flex layout; horizontal inset matches **AppHeader**.
 */
export const appCanvasBodyClasses =
  "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-[var(--grid-margin)] py-4";

/** Insights metric row — 8px gutters between tiles (`gap-2` at 4px base). */
export const appShellStatGroupClasses = "gap-2";

/** Mobile shell — full viewport column; no desktop gutter or **NavRail**. */
export const appShellMobileRootClasses =
  "relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-body font-sans text-fg";
