import { cn } from "../../../lib/cn";
import { focusRingTransitionClasses, motionTransition } from "../../../lib/motion";

export const carouselProgressPlacements = ["center", "start", "full", "none"] as const;

/**
 * Where the scrubber sits under the row: a shorter track at the `center` (default) or the
 * `start`, the `full` row width, or `none`. The shorter tracks are full width on phones.
 */
export type CarouselProgressPlacement = (typeof carouselProgressPlacements)[number];

export const carouselBreakpoints = ["base", "sm", "md", "lg"] as const;

export type CarouselBreakpoint = (typeof carouselBreakpoints)[number];

/** Item width as a percentage of the row, per breakpoint. A breakpoint left out keeps the one below it. */
export type CarouselItemWidth = number | Partial<Record<CarouselBreakpoint, number>>;

/** About one item on phones, two from `sm`, two and a half from `lg` — the next one always shows. */
export const carouselDefaultItemWidth = { base: 80, sm: 55, lg: 40 } as const satisfies CarouselItemWidth;

/** The root is the size container the item widths are a share of. */
export const carouselRootClasses = "@container/carousel flex w-full min-w-0 flex-col";

/**
 * Holds the row and draws its focus ring — the row itself is masked by the edge fade, which would
 * cut a ring off. With `bleed` it reaches past the root to the page edges.
 */
export const carouselFrameClasses = cn(
  "relative rounded-[var(--radius-card-shell)]",
  "ml-[calc(var(--carousel-bleed-left,0px)*-1)] mr-[calc(var(--carousel-bleed-right,0px)*-1)]",
  "has-[>[data-carousel-viewport]:focus-visible]:ring-2 has-[>[data-carousel-viewport]:focus-visible]:ring-focus-ring",
  "has-[>[data-carousel-viewport]:focus-visible]:ring-offset-2 has-[>[data-carousel-viewport]:focus-visible]:ring-offset-body",
  focusRingTransitionClasses,
);

/**
 * The scroller. Its own scrollbar is hidden — the scrubber stands in for it. The block padding
 * (taken back by the margins) leaves room for an item's shadow, which the scroller would clip.
 */
export const carouselViewportClasses = cn(
  "-mt-2 -mb-6 overflow-x-auto overflow-y-hidden overscroll-x-contain pt-2 pb-6 outline-none",
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "scroll-pl-[var(--carousel-bleed-left,0px)] scroll-pr-[var(--carousel-bleed-right,0px)]",
  "data-[overflowing=true]:cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:select-none",
);

/** Rest on item edges — off while the pointer or an animation is moving the row. */
export const carouselViewportSnapClasses = "snap-x snap-mandatory data-[moving]:snap-none";

export const carouselViewportFadeClasses = "scroll-fade-x";

/**
 * As wide as the items, plus the bleed on either side. It stays put while the track inside it
 * shifts on an overscroll, so the scroll width does not change under the pointer.
 */
export const carouselExtentClasses =
  "w-max min-w-full pl-[var(--carousel-bleed-left,0px)] pr-[var(--carousel-bleed-right,0px)]";

/** Items in a row on the page grid's gutter. Images and links inside are not picked up by a drag. */
export const carouselTrackClasses = cn(
  "flex w-max min-w-full gap-[var(--grid-column-gap,1.5rem)]",
  "[&_a]:[-webkit-user-drag:none] [&_img]:[-webkit-user-drag:none]",
);

export const carouselItemClasses = cn(
  "min-w-0 shrink-0 grow-0 snap-start",
  "basis-[calc(var(--carousel-item)*1cqw)] sm:basis-[calc(var(--carousel-item-sm)*1cqw)]",
  "md:basis-[calc(var(--carousel-item-md)*1cqw)] lg:basis-[calc(var(--carousel-item-lg)*1cqw)]",
);

/**
 * The scrubber's hit area: 44px tall around a slim track. It keeps its place when every item
 * fits, so the page under it does not move when the row starts to overflow.
 */
export const carouselProgressClasses =
  "group/carousel-progress relative flex h-11 w-full cursor-pointer touch-none select-none items-center data-[overflowing=false]:invisible";

export const carouselProgressPlacementClasses: Record<Exclude<CarouselProgressPlacement, "none">, string> = {
  center: "self-center sm:w-60",
  start: "self-start sm:w-60",
  full: "",
};

export const carouselProgressTrackClasses = cn(
  "relative h-1 w-full rounded-full bg-neutral transition-[height]",
  "group-data-[scrubbing]/carousel-progress:h-1.5",
  motionTransition("fast"),
);

/** The filled part: its width is the share of the row in view, its place the row's progress. */
export const carouselProgressThumbClasses = cn(
  "absolute inset-y-0 w-[calc(var(--carousel-thumb,0)*100%)] cursor-grab rounded-full bg-muted",
  "start-[calc(var(--carousel-progress,0)*(1_-_var(--carousel-thumb,0))*100%)]",
  "transition-colors group-hover/carousel-progress:bg-fg",
  "group-data-[scrubbing]/carousel-progress:cursor-grabbing group-data-[scrubbing]/carousel-progress:bg-fg",
  motionTransition("fast"),
);
