/**
 * Hero tile stack shell.
 *
 * The root clips the inline axis (`overflow-x: clip`) so a raised `strength`
 * cannot open a horizontal scrollbar. `clip` does not force the block axis
 * into a scroll container, so `overflow-y: visible` still lets cards leave
 * the stack vertically. The row itself does not clip.
 *
 * Tile size tracks the root container (`14cqi`), clamped to a hero scale.
 */

/** Outer frame — full width of the hero, clips inline overflow only. */
export const heroTileStackRootClasses =
  "relative isolate w-full max-w-full overflow-x-clip overflow-y-visible @container";

/** Resting hit area. Scattered cards paint outside this box. */
export const heroTileStackRowClasses =
  "relative mx-auto flex w-fit max-w-full touch-manipulation select-none items-center justify-center overflow-visible px-3 py-6";

/** Square tile. Width is the container-relative hero size. */
export const heroTileStackTileSize = "clamp(6rem, 14cqi, 12.5rem)";

/** Overlap that pulls the next tile over this one (~44% of the tile). */
export const heroTileStackTileOverlap = "calc(clamp(6rem, 14cqi, 12.5rem) * -0.44)";

export const heroTileStackSlotClasses = "relative aspect-square shrink-0";

/**
 * Moving surface. Radius is `--radius-card-shell`. Elevation is
 * `--shadow-soft-card` (`shadow-soft-card`) so the shadow travels with the card.
 * Pointer events stay on the resting slot — a flown card does not keep the scatter alive.
 */
export const heroTileStackSurfaceClasses =
  "pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--radius-card-shell)] bg-surface shadow-soft-card will-change-transform";

export const heroTileStackImageClasses = "h-full w-full object-cover select-none";
