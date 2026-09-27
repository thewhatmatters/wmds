/**
 * Scroll distance for ScrollHorizontal.
 *
 * The sticky window is one card wide and centered, so progress 0 shows the
 * first card centered and progress 1 shows the last. The row moves by one
 * card-pitch per item: width + gap, times the gaps between items.
 */

/** Desktop card. The sticky window matches this width. */
export const scrollHorizontalItemWidth = 400;
export const scrollHorizontalItemHeight = 500;

/** Below `sm` (640px), the nearest system breakpoint to the 600px compact cutoff. */
export const scrollHorizontalItemWidthCompact = 280;
export const scrollHorizontalItemHeightCompact = 350;

/** Tailwind `sm` min-width. Compact geometry applies below this. */
export const scrollHorizontalCompactBreakpoint = 640;

/**
 * `gap-8` — 32px. 30px is equidistant from `gap-7` (28px) and `gap-8`;
 * 32px sits on the 8px baseline.
 */
export const scrollHorizontalGap = 32;

/** `gap-4` — 16px, the nearest 8px-baseline step to 15px. */
export const scrollHorizontalGapCompact = 16;

/** `rounded-xl` — `--radius-xl` is 0.75rem (12px). */
export const scrollHorizontalRadiusUtility = "rounded-xl";

/** Vertical padding on the reduced-motion scroller. `py-12` is 48px, nearest baseline step to 50px. */
export const scrollHorizontalReducedPaddingUtility = "py-12";

/** Default item tints. Brand navy, then chart categorical tokens. Not hue variables. */
export const scrollHorizontalDefaultColors = [
  "var(--color-brand)",
  "var(--color-chart-categorical-1)",
  "var(--color-chart-categorical-2)",
  "var(--color-chart-categorical-4)",
  "var(--color-chart-categorical-5)",
] as const;

export interface ScrollHorizontalShell {
  /** Track length. `auto` drops the sticky scroll distance. */
  containerHeight: "300svh" | "auto";
  sticky: boolean;
  overflowX: "clip" | "auto";
  translate: boolean;
}

export function scrollHorizontalItemNumber(index: number): string {
  const value = index + 1;
  if (!Number.isFinite(value) || value < 1) return "00";
  if (value >= 100) return String(Math.floor(value));
  return String(Math.floor(value)).padStart(2, "0");
}

export function scrollHorizontalItemColor(color: string | undefined, index: number): string {
  const explicit = color?.trim();
  if (explicit) return explicit;
  const paletteIndex = ((index % scrollHorizontalDefaultColors.length) + scrollHorizontalDefaultColors.length) %
    scrollHorizontalDefaultColors.length;
  return scrollHorizontalDefaultColors[paletteIndex] ?? scrollHorizontalDefaultColors[0];
}

/** Nominal card pitch before the DOM measurement lands. */
export function scrollHorizontalNominalMetrics(viewportWidth: number): {
  itemWidth: number;
  gap: number;
} {
  if (!Number.isFinite(viewportWidth) || viewportWidth < scrollHorizontalCompactBreakpoint) {
    return {
      itemWidth: scrollHorizontalItemWidthCompact,
      gap: scrollHorizontalGapCompact,
    };
  }
  return {
    itemWidth: scrollHorizontalItemWidth,
    gap: scrollHorizontalGap,
  };
}

export function scrollHorizontalParseGap(raw: string): number {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function scrollHorizontalReadMetrics(
  item: Element,
  row: Element,
): { itemWidth: number; gap: number } {
  const itemWidth = item.getBoundingClientRect().width;
  const gap = scrollHorizontalParseGap(getComputedStyle(row).columnGap);
  return {
    itemWidth: Number.isFinite(itemWidth) && itemWidth > 0 ? itemWidth : 0,
    gap,
  };
}

/** `(count - 1) * (itemWidth + gap)`. Zero when there is nothing to travel. */
export function scrollHorizontalDistance(count: number, itemWidth: number, gap: number): number {
  if (!Number.isFinite(count) || count <= 1) return 0;
  if (!Number.isFinite(itemWidth) || itemWidth <= 0) return 0;
  if (!Number.isFinite(gap) || gap < 0) return 0;
  return (count - 1) * (itemWidth + gap);
}

/**
 * Scroll progress 0 → 1 maps to `0 → -distance`.
 * Reduced motion stays at 0 so the row can use native overflow instead.
 */
export function scrollHorizontalTranslateX(
  progress: number,
  distance: number,
  reduceMotion: boolean,
): number {
  if (reduceMotion) return 0;
  if (!Number.isFinite(progress) || !Number.isFinite(distance) || distance <= 0) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  if (clamped === 0) return 0;
  return -distance * clamped;
}

export function scrollHorizontalShell(reduceMotion: boolean): ScrollHorizontalShell {
  if (reduceMotion) {
    return {
      containerHeight: "auto",
      sticky: false,
      overflowX: "auto",
      translate: false,
    };
  }
  return {
    containerHeight: "300svh",
    sticky: true,
    overflowX: "clip",
    translate: true,
  };
}
