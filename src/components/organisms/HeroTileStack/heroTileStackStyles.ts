/**
 * Hero tile stack shell.
 *
 * The root clips the inline axis (`overflow-x: clip`) so a raised `strength`
 * cannot open a horizontal scrollbar. `clip` does not force the block axis
 * into a scroll container, so `overflow-y: visible` still lets cards leave
 * the stack vertically. The row itself does not clip.
 *
 * Tile size is `--hero-tile-size`: a square, at most `--hero-tile-max`
 * (400px), and a fraction of the stack width. Below `md` the overlap
 * tightens into a pile.
 */

/** Outer frame — full width of the hero, clips inline overflow only. */
export const heroTileStackRootClasses =
  "relative isolate w-full max-w-full overflow-x-clip overflow-y-visible @container";

/**
 * Resting hit area. Sets `--hero-tile-size` and `--hero-tile-overlap` from the
 * parent inline-size container. Below `md`: a tight pile. From `md`: the fan,
 * capped by `--hero-tile-max` (default 400px).
 */
export const heroTileStackRowClasses = [
  "relative mx-auto flex w-fit max-w-full touch-manipulation select-none items-center justify-center overflow-visible px-1 py-6 md:px-3",
  "[--hero-tile-size:min(var(--hero-tile-max,400px),58cqi)]",
  "[--hero-tile-overlap:calc(var(--hero-tile-size)*-0.82)]",
  "md:[--hero-tile-size:min(var(--hero-tile-max,400px),34cqi)]",
  "md:[--hero-tile-overlap:calc(var(--hero-tile-size)*-0.44)]",
].join(" ");

/** Square tile. Width is `--hero-tile-size`. */
export const heroTileStackTileSize = "var(--hero-tile-size)";

/** Negative inline margin. The CSS variable is already negative. */
export const heroTileStackTileOverlap = "var(--hero-tile-overlap)";

export const heroTileStackSlotClasses = "relative aspect-square shrink-0";

/**
 * Moving surface. Radius is `--radius-card-shell`. Elevation is
 * `--shadow-soft-card` (`shadow-soft-card`) so the shadow travels with the card.
 * Pointer events stay on the resting slot — a flown card does not keep the scatter alive.
 */
export const heroTileStackSurfaceClasses =
  "pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--radius-card-shell)] bg-surface shadow-soft-card will-change-transform";

export const heroTileStackImageClasses = "h-full w-full object-cover select-none";
