/**
 * ScrollHorizontal shell.
 *
 * Motion: a 300svh track (`shrink-0` so a flex parent keeps that height), a sticky svh viewport that clips inline overflow,
 * and a centered window one card wide. The row starts with the first card
 * filling that window. `expandLast` uses a 400svh track: the same horizontal
 * distance, then one viewport of grow. The grow layer is the sticky window
 * (edge longhands, not the `inset` shorthand) revealed with `clip-path`.
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
 * Fill the sticky window from its padding edges.
 * Four edge longhands, not the `inset` shorthand: a consuming app that emits
 * `.inset-0` later must not be able to reset this box.
 */
export const scrollHorizontalExpandFillClasses =
  "absolute top-0 right-0 bottom-0 left-0";

/**
 * Full-viewport color layer. `clip-path` reveals it from the last card out to
 * the sticky window. Hidden on the reduced-motion branch, which uses the static section.
 */
export const scrollHorizontalExpandLayerClasses = [
  "pointer-events-none z-20 bg-[var(--scroll-horizontal-color)] will-change-[clip-path]",
  scrollHorizontalExpandFillClasses,
  "motion-reduce:!hidden",
  "group-data-[reduce=true]/scroll-horizontal:!hidden",
].join(" ");

/** Optional content on the full-bleed tile. Fades in late. Hidden when motion is reduced. */
export const scrollHorizontalExpandedSlotClasses = [
  "z-30",
  scrollHorizontalExpandFillClasses,
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

/**
 * Intro track. The sticky is an inline-size container so panel widths use
 * `100cqw` (the gallery viewport, not `100vw`).
 * The track's inline start is the page-grid content edge: the same inset as
 * `grid-page` (`--grid-margin` inside a centered `--grid-max`). Percentage
 * padding resolves against the sticky, so it does not depend on `cqw`.
 * Padding is longhands only (`ps` / `pe` / `py`). A padding shorthand such as
 * `p-0` on this element lets a consuming app's later `.p-0 { padding: 0 }`
 * clear the inline start. The inset is on the translating track, so scroll
 * carries the panel off the left edge with the tiles.
 * Reduced motion stacks the panel above a native scroller and keeps the inset.
 */
export const scrollHorizontalIntroStickyClasses = "[container-type:inline-size]";

export const scrollHorizontalIntroTrackClasses = [
  "m-0 flex h-full w-max items-center self-start gap-8 py-0 pe-0 max-sm:gap-4 will-change-transform",
  "ps-[max(var(--grid-margin),calc((100%-var(--grid-max))/2+var(--grid-margin)))]",
  "motion-reduce:!h-auto motion-reduce:!w-full motion-reduce:!max-w-full motion-reduce:!flex-col motion-reduce:!items-stretch motion-reduce:!self-stretch motion-reduce:!transform-none motion-reduce:will-change-auto",
  "group-data-[reduce=true]/scroll-horizontal:!h-auto",
  "group-data-[reduce=true]/scroll-horizontal:!w-full",
  "group-data-[reduce=true]/scroll-horizontal:!max-w-full",
  "group-data-[reduce=true]/scroll-horizontal:!flex-col",
  "group-data-[reduce=true]/scroll-horizontal:!items-stretch",
  "group-data-[reduce=true]/scroll-horizontal:!self-stretch",
  "group-data-[reduce=true]/scroll-horizontal:!transform-none",
  "group-data-[reduce=true]/scroll-horizontal:will-change-auto",
].join(" ");

/**
 * First panel. Below `md` it is the full content box so the statement fits at 390.
 * From `md`, 4 of 8 columns. From `lg`, 6 of 12 — the left half of the page grid.
 * Top padding clears the compact site nav (`--site-nav-height` plus the 1rem pin offset).
 */
export const scrollHorizontalIntroPanelClasses = [
  "box-border flex h-full min-w-0 shrink-0 flex-col justify-center self-stretch",
  "pt-[calc(var(--site-nav-height)+var(--spacing)*4)]",
  "w-[calc(min(100cqw,var(--grid-max))-2*var(--grid-margin))]",
  "md:w-[calc(4*((min(100cqw,var(--grid-max))-2*var(--grid-margin)-7*var(--grid-column-gap))/8)+3*var(--grid-column-gap))]",
  "lg:w-[calc(6*((min(100cqw,var(--grid-max))-2*var(--grid-margin)-11*var(--grid-column-gap))/12)+5*var(--grid-column-gap))]",
  "motion-reduce:!h-auto motion-reduce:!self-auto",
  "group-data-[reduce=true]/scroll-horizontal:!h-auto",
  "group-data-[reduce=true]/scroll-horizontal:!self-auto",
].join(" ");

/** Native scroller for the cards when an intro leads the track. */
export const scrollHorizontalIntroWindowClasses = [
  "flex min-w-0 items-center",
  "motion-reduce:!w-full motion-reduce:overflow-x-auto motion-reduce:scroll-fade-x",
  "group-data-[reduce=true]/scroll-horizontal:!w-full",
  "group-data-[reduce=true]/scroll-horizontal:overflow-x-auto",
  "group-data-[reduce=true]/scroll-horizontal:scroll-fade-x",
].join(" ");

/** Eyebrow, statement, and action. The statement uses the panel width as its measure. */
export const scrollHorizontalIntroBodyClasses =
  "flex w-full min-w-0 flex-col items-start gap-8 pr-[var(--grid-column-gap)]";

export const scrollHorizontalIntroCopyClasses = "flex w-full min-w-0 flex-col items-start gap-3";

/**
 * Statement. `type-display-2` is the largest display step that wraps to about
 * four or five lines in the left columns. Weight is `--font-weight-normal`
 * (display tokens bake in semibold/bold). Leading is the tighter display-1 token.
 * `text-pretty` keeps the last word off a line by itself.
 */
export const scrollHorizontalIntroStatementClasses = [
  "type-display-2 m-0 max-w-full min-w-0 text-left text-fg break-words text-pretty",
  "!font-normal",
  "!leading-[var(--text-display-1-leading)]",
  "!tracking-[var(--text-display-1-tracking)]",
].join(" ");
