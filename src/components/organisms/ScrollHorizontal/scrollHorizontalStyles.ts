/**
 * ScrollHorizontal shell.
 *
 * Motion: a 300svh track (`shrink-0` so a flex parent keeps that height), a sticky svh viewport that clips inline overflow,
 * and a centered window one card wide. The row starts with the first card
 * filling that window. `expandLast` uses a 400svh track: the same horizontal
 * distance, then one viewport of grow. The grow layer is the sticky window
 * (`inset-0`) revealed with `clip-path`.
 *
 * Reduced motion (`motion-reduce` and `data-reduce="true"`): height auto,
 * the viewport is not sticky, and the window is a native horizontal scroller
 * with vertical padding. `!` wins over the motion utilities. The heading is
 * `sr-only` while the window is pinned, and visible above that scroller.
 *
 * Card pitch: 400×500 and gap-8 from `sm`; 280×350 and gap-4 below `sm`.
 * Radius is `rounded-xl` (`--radius-xl`, 12px).
 */

export const scrollHorizontalRootClasses = [
  "group/scroll-horizontal relative h-[300svh] w-full max-w-full shrink-0",
  "motion-reduce:!h-auto data-[reduce=true]:!h-auto",
].join(" ");

/** Same shell as the root, with one extra viewport for the grow. `shrink-0` keeps that height in a flex parent. */
export const scrollHorizontalRootExpandClasses = [
  "group/scroll-horizontal relative h-[400svh] w-full max-w-full shrink-0",
  "motion-reduce:!h-auto data-[reduce=true]:!h-auto",
].join(" ");

/**
 * Full-viewport color layer. `clip-path` reveals it from the last card out to
 * the sticky window. Hidden on the reduced-motion branch, which uses the static section.
 */
export const scrollHorizontalExpandLayerClasses = [
  "pointer-events-none absolute inset-0 z-20 bg-[var(--scroll-horizontal-color)] will-change-[clip-path]",
  "motion-reduce:!hidden",
  "group-data-[reduce=true]/scroll-horizontal:!hidden",
].join(" ");

/** Optional content on the full-bleed tile. Fades in late. Hidden when motion is reduced. */
export const scrollHorizontalExpandedSlotClasses = [
  "absolute inset-0 z-30",
  "motion-reduce:!hidden",
  "group-data-[reduce=true]/scroll-horizontal:!hidden",
].join(" ");

/**
 * Reduced motion: the last tile as its own `h-svh` section after the scroller.
 * `hidden` until `motion-reduce` or `data-reduce="true"`. Radius is 0.
 */
export const scrollHorizontalExpandedSectionClasses = [
  "relative hidden h-svh w-full max-w-full shrink-0 overflow-hidden rounded-none",
  "motion-reduce:!block",
  "group-data-[reduce=true]/scroll-horizontal:!block",
].join(" ");

export const scrollHorizontalStickyClasses = [
  "sticky top-0 flex h-svh w-full flex-col items-center justify-center overflow-x-clip",
  "motion-reduce:!relative motion-reduce:!h-auto motion-reduce:!items-stretch motion-reduce:!justify-start motion-reduce:!overflow-x-visible motion-reduce:py-12",
  "group-data-[reduce=true]/scroll-horizontal:!relative",
  "group-data-[reduce=true]/scroll-horizontal:!h-auto",
  "group-data-[reduce=true]/scroll-horizontal:!items-stretch",
  "group-data-[reduce=true]/scroll-horizontal:!justify-start",
  "group-data-[reduce=true]/scroll-horizontal:!overflow-x-visible",
  "group-data-[reduce=true]/scroll-horizontal:py-12",
].join(" ");

export const scrollHorizontalWindowClasses = [
  "mx-auto flex w-[400px] max-w-full shrink-0 items-center overflow-visible max-sm:w-[280px]",
  "motion-reduce:!mx-0 motion-reduce:!w-full motion-reduce:max-w-none motion-reduce:overflow-x-auto motion-reduce:scroll-fade-x",
  "group-data-[reduce=true]/scroll-horizontal:!mx-0",
  "group-data-[reduce=true]/scroll-horizontal:!w-full",
  "group-data-[reduce=true]/scroll-horizontal:max-w-none",
  "group-data-[reduce=true]/scroll-horizontal:overflow-x-auto",
  "group-data-[reduce=true]/scroll-horizontal:scroll-fade-x",
].join(" ");

export const scrollHorizontalRowClasses = [
  "m-0 flex w-max list-none gap-8 p-0 max-sm:gap-4 will-change-transform",
  "motion-reduce:!transform-none motion-reduce:will-change-auto",
  "group-data-[reduce=true]/scroll-horizontal:!transform-none",
  "group-data-[reduce=true]/scroll-horizontal:will-change-auto",
].join(" ");

/**
 * Section name. `sr-only` on the pinned window so it does not sit under the
 * floating site nav. Reduced motion shows it above the native scroller.
 * `not-sr-only` restores a normal box; `!` padding and margin beat that reset.
 */
export const scrollHorizontalHeadingClasses = [
  "sr-only",
  "motion-reduce:not-sr-only motion-reduce:!mb-6 motion-reduce:!px-[var(--grid-margin)] motion-reduce:text-center",
  "group-data-[reduce=true]/scroll-horizontal:not-sr-only",
  "group-data-[reduce=true]/scroll-horizontal:!mb-6",
  "group-data-[reduce=true]/scroll-horizontal:!px-[var(--grid-margin)]",
  "group-data-[reduce=true]/scroll-horizontal:text-center",
].join(" ");

export const scrollHorizontalItemClasses = [
  "relative h-[500px] w-[400px] shrink-0 overflow-hidden rounded-xl bg-[var(--scroll-horizontal-color)]",
  "max-sm:h-[350px] max-sm:w-[280px]",
].join(" ");

/** Accessible name for a placeholder tile. Not painted. */
export const scrollHorizontalLabelClasses = "sr-only";
