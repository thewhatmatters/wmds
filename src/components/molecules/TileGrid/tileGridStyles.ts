import { cn } from "../../../lib/cn";

export const tileGridLayouts = ["masonry", "uniform"] as const;

/**
 * `masonry` (default) — tiles keep their heights and pack upward. `uniform` — rows of equal
 * height; pair it with a fixed `ratio` on the tiles.
 */
export type TileGridLayout = (typeof tileGridLayouts)[number];

export const tileGridBreakpoints = ["base", "sm", "md", "lg", "xl"] as const;

export type TileGridBreakpoint = (typeof tileGridBreakpoints)[number];

/** Columns per breakpoint. A breakpoint left out keeps the one below it. */
export type TileGridColumns = number | Partial<Record<TileGridBreakpoint, number>>;

/** One column on phones, two from `sm`, three from `lg` — for a 9-column main area beside a rail. */
export const tileGridDefaultColumns = { base: 1, sm: 2, lg: 3 } as const satisfies TileGridColumns;

/**
 * A packed grid's row track, in px (`--spacing`). A tile spans as many as its height needs, so
 * the space under a tile is the row gap plus at most this much less one.
 */
export const tileGridRowUnitPx = 4;

export const tileGridRootClasses = "w-full min-w-0";

/**
 * Columns on the page grid's gutter. The row gap is padding under each item, not a grid gap: a
 * packed grid has 4px row tracks and no gap between them. The margin takes the last row's back.
 */
export const tileGridListClasses = cn(
  "relative m-0 -mb-[var(--tile-grid-row-gap)] grid list-none items-start p-0 [--tile-grid-row-gap:2rem]",
  "gap-x-[var(--grid-column-gap,1.5rem)] gap-y-0",
  "grid-cols-[repeat(var(--tile-grid-cols),minmax(0,1fr))] sm:grid-cols-[repeat(var(--tile-grid-cols-sm),minmax(0,1fr))]",
  "md:grid-cols-[repeat(var(--tile-grid-cols-md),minmax(0,1fr))] lg:grid-cols-[repeat(var(--tile-grid-cols-lg),minmax(0,1fr))]",
  "xl:grid-cols-[repeat(var(--tile-grid-cols-xl),minmax(0,1fr))]",
  // Packed (set once the tiles are measured): each item spans the 4px rows its height needs.
  "data-[packed]:auto-rows-[4px]",
);

export const tileGridItemClasses = "min-w-0";

/** What is measured: the tile and the row gap under it. */
export const tileGridItemInnerClasses = "flex min-w-0 flex-col pb-[var(--tile-grid-row-gap)]";

/** Empty state — in the tiles' place. */
export const tileGridEmptyClasses = "py-8";
