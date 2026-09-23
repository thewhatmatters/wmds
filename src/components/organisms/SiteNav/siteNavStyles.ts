import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

/** Scroll-driven shell state — `expanded` (page top) or `compact` (scrolled). */
export const siteNavStates = ["expanded", "compact"] as const;
export type SiteNavState = (typeof siteNavStates)[number];

/** `fixed` — page chrome (default). `inline` — static specimen for docs and tests; no scroll detection. */
export const siteNavPlacements = ["fixed", "inline"] as const;
export type SiteNavPlacement = (typeof siteNavPlacements)[number];

/** Compact pill width — `hug` shrinks to its items (default, narrower than grid); `grid` fills `--grid-max`. */
export const siteNavCompactLayouts = ["hug", "grid"] as const;
export type SiteNavCompactLayout = (typeof siteNavCompactLayouts)[number];

/** Scroll distance (px) that flips expanded → compact. */
export const siteNavDefaultCollapseAt = 48;

/** Expanded band height — pages that start under the nav reserve this with `pt-16`. */
export const siteNavExpandedHeightClasses = "h-16 min-h-16";

/** Compact pill — height hugs controls; equal shell inset (`p-1`) all around. */

/** Compact pill offset from the viewport top. */
export const siteNavCompactTopOffsetClasses = "mt-4";

/** Outer chrome — full-width fixed strip; only the bar itself accepts pointer events.
 * `z-50` keeps the bar above the mega-menu backdrop (`z-40`). */
export const siteNavRootClasses: Record<SiteNavPlacement, string> = {
  fixed: "pointer-events-none fixed inset-x-0 top-0 z-50",
  inline: "relative z-50 w-full",
};

/** Centered content column — bar host + mega vertical anchor; always grid-wide even when the pill hugs. */
export const siteNavContainerClasses =
  "relative mx-auto w-full max-w-[var(--grid-max)]";

/** Bar shell — surface, radius, and shadow morph between states (Motion `layout` handles geometry). */
export const siteNavBarBaseClasses = cn(
  "pointer-events-auto relative z-[1] flex w-full items-center",
  "transition-[background-color,box-shadow,border-color,backdrop-filter]",
  motionTransition("medium"),
);

export const siteNavBarStateClasses: Record<SiteNavState, string> = {
  expanded: cn(
    siteNavExpandedHeightClasses,
    "w-full border border-transparent bg-transparent px-[var(--grid-margin)] shadow-none",
  ),
  compact: cn(
    "box-border border border-border bg-surface/80 p-1.5 shadow-sm backdrop-blur-md",
    "supports-[backdrop-filter]:bg-surface/80",
  ),
};

/** Compact width — hugging the items (default) or grid-contained. */
export const siteNavBarCompactLayoutClasses: Record<SiteNavCompactLayout, string> = {
  hug: "mx-auto w-max max-w-full",
  grid: "w-full",
};

/**
 * Mega-menu focus layer — light dim over the page (not Dialog `bg-overlay`).
 * Pointer-events none so hover dismiss still works; under the bar/popup (`z-50`).
 */
export const siteNavMenuBackdropClasses = cn(
  "fixed inset-0 z-40 bg-fg/15 pointer-events-none",
  "transition-opacity",
  motionTransition("medium"),
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
);

/** Gap between the bar and the mega panel — 0.5rem. */
export const siteNavMenuSideOffsetPx = 8;

/**
 * Slot rail — expanded / compact-grid use equal thirds so middle links stay optically centered.
 * Compact hug uses a content cluster so the middle track is not starved to 1/3 (avoids early More).
 */
export const siteNavSlotsClasses = {
  three: "grid w-full grid-cols-3 items-center gap-3",
  threeHug: "flex w-max max-w-full items-center gap-3",
  ends: "flex w-full items-center justify-between gap-4",
  middleOnly: "flex w-full min-w-0 items-center justify-center",
  startOnly: "flex w-full items-center justify-start",
  endOnly: "flex w-full items-center justify-end",
} as const;

export const siteNavStartClasses = "flex shrink-0 items-center gap-2 justify-self-start";
export const siteNavMiddleClasses =
  "flex min-w-0 w-full items-center justify-center justify-self-stretch";
/** Compact hug middle — content-sized; can shrink only when the pill hits `max-w-full`. */
export const siteNavMiddleHugClasses = "flex min-w-0 max-w-full items-center justify-center";
export const siteNavEndClasses = "flex shrink-0 flex-nowrap items-center gap-2 justify-self-end";

/** Middle slot hides below `md` when a `mobile` menu is supplied. */
export const siteNavMiddleResponsiveClasses = "hidden md:flex min-w-0 w-full";
export const siteNavMobileTriggerClasses = "md:hidden";

/**
 * Brand — layout only when wordmark **Button**; icon brands use **IconButton** (circular).
 */
export const siteNavBrandClasses = "text-fg!";

/** Links cluster — full middle track width for overflow measure; cluster centered inside. */
export const siteNavLinksRootClasses =
  "relative flex min-w-0 w-full max-w-full items-center justify-center gap-1";

/** NavigationMenu root — hug the list so justify-center on the parent can center it. */
export const siteNavNavigationRootClasses = "flex min-w-0 max-w-full justify-center";

/** Link list — Base UI NavigationMenu list. */
export const siteNavLinkListClasses =
  "m-0 flex min-w-0 list-none flex-nowrap items-center gap-1 overflow-hidden p-0";

/** Invisible exact-size specimens for ResizeObserver overflow (same idea as Tab). */
export const siteNavMeasureRailClasses =
  "pointer-events-none invisible absolute left-0 top-0 -z-10 flex w-max gap-1";

export const siteNavMoreTriggerClasses = cn(
  "text-muted! hover:text-fg!",
  "data-[state=open]:bg-ghost-hover data-[state=open]:text-fg!",
);

export const siteNavMoreIconClasses = cn(
  "inline-flex [&>svg]:size-3.5 [&>svg]:stroke-current",
  "transition-transform data-[state=open]:rotate-180",
  motionTransition("fast"),
);

export const siteNavMeasureItemClasses =
  "inline-flex h-9 items-center px-4 text-sm leading-none";

export const siteNavMeasureMoreClasses =
  "inline-flex h-9 items-center gap-1 px-4 text-sm leading-none";

/** Nav link — ghost pill; quiet ink until hover, full ink when current. */
export const siteNavLinkClasses = cn(
  "text-muted! hover:text-fg!",
  "data-[active]:text-fg! aria-[current=page]:text-fg!",
);

/** Mega-menu trigger — keeps the hover surface while its panel is open. */
export const siteNavTriggerClasses = cn(
  "text-muted! hover:text-fg!",
  "data-[popup-open]:bg-ghost-hover data-[popup-open]:text-fg!",
);

export const siteNavTriggerLabelClasses = "inline-flex items-center gap-1";

export const siteNavTriggerIconClasses = cn(
  "inline-flex [&>svg]:size-3.5 [&>svg]:stroke-current",
  "transition-transform data-[popup-open]:rotate-180",
  motionTransition("fast"),
);

/** Portal positioner — always `--grid-max` wide (not the hug pill). Centered via Floating UI. */
export const siteNavMenuPositionerClasses =
  "z-[51] w-[min(var(--grid-max),calc(100vw_-_2_*_var(--grid-margin)))] outline-none";

/** Mega-menu popup — soft pill-family radius (not a sharp card); height animates to content. */
export const siteNavMenuPopupClasses = cn(
  "relative box-border w-full overflow-hidden rounded-3xl border border-border bg-popover shadow-md",
  "h-[var(--popup-height)] origin-top",
  "transition-[height,opacity,transform]",
  motionTransition("medium"),
  "data-[starting-style]:-translate-y-2 data-[starting-style]:opacity-0",
  "data-[ending-style]:-translate-y-2 data-[ending-style]:opacity-0",
);

export const siteNavMenuViewportClasses = "relative h-full w-full overflow-hidden";

/** One trigger's content — columns with hairline dividers; sections set their own span. */
export const siteNavMenuContentClasses = cn(
  "grid w-full grid-flow-col auto-cols-fr divide-x divide-border",
  "transition-opacity",
  motionTransition("fast"),
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
);

export const siteNavMenuSectionClasses = "flex min-w-0 flex-col gap-4 p-6";

export const siteNavMenuSectionSpanClasses: Record<1 | 2 | 3, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
};

export const siteNavMenuSectionLabelClasses = typographyClass("overline");

/** Menu link row — ghost **Button** anchor pulled flush with the section edge (sm pill `px-4`). */
export const siteNavMenuLinkClasses = "-mx-4 justify-start! self-start";

/** Menu link grid — two quiet columns of icon + label rows. */
export const siteNavMenuLinkGridClasses = "grid grid-cols-2 gap-x-6 gap-y-1";

/** Mobile sheet body — stacked links. */
export const siteNavMobileListClasses = "flex flex-col gap-1";

/** Mobile link row — full-width ghost **Button** anchor; current page gets the quiet secondary fill. */
export const siteNavMobileLinkClasses = cn(
  "w-full justify-start! text-muted! hover:text-fg!",
  "aria-[current=page]:bg-secondary aria-[current=page]:text-fg!",
);
