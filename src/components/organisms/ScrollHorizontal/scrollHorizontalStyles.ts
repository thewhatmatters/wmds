/**
 * ScrollHorizontal shell.
 *
 * Motion: a 300svh track (`shrink-0` so a flex parent keeps that height), a sticky svh viewport that clips inline overflow,
 * and a centered window one card wide. The row starts with the first card
 * filling that window.
 *
 * Reduced motion (`motion-reduce` and `data-reduce="true"`): height auto,
 * the viewport is not sticky, and the window is a native horizontal scroller
 * with vertical padding. `!` wins over the motion utilities.
 *
 * Card pitch: 400×500 and gap-8 from `sm`; 280×350 and gap-4 below `sm`.
 * Radius is `rounded-xl` (`--radius-xl`, 12px).
 */

export const scrollHorizontalRootClasses = [
  "group/scroll-horizontal relative h-[300svh] w-full max-w-full shrink-0",
  "motion-reduce:!h-auto data-[reduce=true]:!h-auto",
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

export const scrollHorizontalHeadingClasses = [
  "absolute inset-x-0 top-8 z-10 px-[var(--grid-margin)] text-center",
  "motion-reduce:!static motion-reduce:!inset-auto motion-reduce:top-auto motion-reduce:mb-6",
  "group-data-[reduce=true]/scroll-horizontal:!static",
  "group-data-[reduce=true]/scroll-horizontal:!inset-auto",
  "group-data-[reduce=true]/scroll-horizontal:top-auto",
  "group-data-[reduce=true]/scroll-horizontal:mb-6",
].join(" ");

export const scrollHorizontalItemClasses = [
  "relative h-[500px] w-[400px] shrink-0 overflow-hidden rounded-xl bg-[var(--scroll-horizontal-color)]",
  "max-sm:h-[350px] max-sm:w-[280px]",
].join(" ");

/** Accessible name for a placeholder tile. Not painted. */
export const scrollHorizontalLabelClasses = "sr-only";
