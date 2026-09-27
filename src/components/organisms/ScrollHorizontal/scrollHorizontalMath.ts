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

/**
 * Placeholder fills. Brand navy, muted brand, neutral slate, muted info, and accent.
 * Existing semantic tokens only — not raw hues.
 */
export const scrollHorizontalDefaultColors = [
  "var(--color-brand)",
  "var(--color-brand-soft)",
  "var(--color-primary)",
  "var(--color-info-muted)",
  "var(--color-accent)",
] as const;

export interface ScrollHorizontalShell {
  /** Track length. `auto` drops the sticky scroll distance. */
  containerHeight: "300svh" | "400svh" | "auto";
  sticky: boolean;
  overflowX: "clip" | "auto";
  translate: boolean;
}

/**
 * Sticky scroll, in viewports, used by the horizontal phase.
 * A `300svh` track pins for `300 − 100` = 2 viewports.
 */
export const scrollHorizontalHorizontalViewports = 2;

/**
 * Extra sticky scroll, in viewports, for `expandLast`.
 * Added on top of the horizontal phase so that phase does not speed up.
 */
export const scrollHorizontalExpandViewports = 1;

/** Painted corner radius at rest. `--radius-xl` is 0.75rem (12px) at the default root size. */
export const scrollHorizontalRadius = 12;

/** Progress where horizontal travel finishes. `1` when `expandLast` is off. */
export function scrollHorizontalHorizontalEnd(expandLast: boolean): number {
  if (!expandLast) return 1;
  const total = scrollHorizontalHorizontalViewports + scrollHorizontalExpandViewports;
  return scrollHorizontalHorizontalViewports / total;
}

/** Track length. `400svh` is the 300svh gallery plus one viewport of grow. */
export function scrollHorizontalTrack(expandLast: boolean): "300svh" | "400svh" {
  return expandLast ? "400svh" : "300svh";
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

export function scrollHorizontalShell(
  reduceMotion: boolean,
  expandLast = false,
): ScrollHorizontalShell {
  if (reduceMotion) {
    return {
      containerHeight: "auto",
      sticky: false,
      overflowX: "auto",
      translate: false,
    };
  }
  return {
    containerHeight: scrollHorizontalTrack(expandLast),
    sticky: true,
    overflowX: "clip",
    translate: true,
  };
}

function scrollHorizontalClamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Map full-track progress onto the horizontal phase.
 * With `expandLast`, progress `2/3` is the end of that phase (2 of 3 pinned viewports).
 */
export function scrollHorizontalPhaseProgress(progress: number, horizontalEnd: number): number {
  if (!Number.isFinite(progress)) return 0;
  if (!Number.isFinite(horizontalEnd) || horizontalEnd <= 0) return 0;
  if (horizontalEnd >= 1) return scrollHorizontalClamp01(progress);
  return scrollHorizontalClamp01(progress / horizontalEnd);
}

/** 0 through the horizontal phase, then 0 → 1 across the grow. */
export function scrollHorizontalExpandAmount(progress: number, horizontalEnd: number): number {
  if (!Number.isFinite(progress) || !Number.isFinite(horizontalEnd) || horizontalEnd >= 1) return 0;
  return scrollHorizontalClamp01((progress - horizontalEnd) / (1 - horizontalEnd));
}

/** Earlier tiles fade across the first part of the grow. */
export function scrollHorizontalPeerOpacity(amount: number): number {
  const t = scrollHorizontalClamp01(amount);
  if (t <= 0) return 1;
  return 1 - Math.min(1, t / 0.45);
}

/** Slot on the full-bleed tile. Stays clear until the tile is mostly expanded. */
export function scrollHorizontalExpandedOpacity(amount: number): number {
  const t = scrollHorizontalClamp01(amount);
  if (t <= 0.62) return 0;
  return (t - 0.62) / 0.38;
}

export interface ScrollHorizontalExpandMetrics {
  viewportWidth: number;
  viewportHeight: number;
  cardWidth: number;
  cardHeight: number;
  /** First card's rest left, relative to the sticky window. The last card sits here when travel ends. */
  cardLeft: number;
  cardTop: number;
  /** `cardWidth + gap`. Distance from one card's left edge to the next. */
  pitch: number;
  radius: number;
}

export interface ScrollHorizontalClipRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  radius: number;
}

/** Resting frame before the DOM measurement lands. The card is centered in the viewport. */
export function scrollHorizontalNominalExpandMetrics(
  viewportWidth: number,
  viewportHeight: number,
): ScrollHorizontalExpandMetrics {
  const nominal = scrollHorizontalNominalMetrics(viewportWidth);
  const compact =
    !Number.isFinite(viewportWidth) || viewportWidth < scrollHorizontalCompactBreakpoint;
  const cardWidth = nominal.itemWidth;
  const cardHeight = compact ? scrollHorizontalItemHeightCompact : scrollHorizontalItemHeight;
  const vw = Number.isFinite(viewportWidth) && viewportWidth > 0 ? viewportWidth : cardWidth;
  const vh = Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : cardHeight;
  return {
    viewportWidth: vw,
    viewportHeight: vh,
    cardWidth,
    cardHeight,
    cardLeft: (vw - cardWidth) / 2,
    cardTop: (vh - cardHeight) / 2,
    pitch: cardWidth + nominal.gap,
    radius: scrollHorizontalRadius,
  };
}

/**
 * `translateX` from a computed transform. `none` and a Y-only translate are 0.
 * Used to remove the row's travel from a bounding rect.
 */
export function scrollHorizontalReadTranslateX(transform: string): number {
  if (!transform || transform === "none") return 0;
  const wrapped = transform.trim();
  const matrix3d = wrapped.match(/^matrix3d\((.+)\)$/);
  if (matrix3d?.[1]) {
    const parts = matrix3d[1].split(",").map((part) => Number.parseFloat(part.trim()));
    return Number.isFinite(parts[12]) ? parts[12] : 0;
  }
  const matrix = wrapped.match(/^matrix\((.+)\)$/);
  if (matrix?.[1]) {
    const parts = matrix[1].split(",").map((part) => Number.parseFloat(part.trim()));
    return Number.isFinite(parts[4]) ? parts[4] : 0;
  }
  const translate = wrapped.match(/translate(?:3d|X)?\(\s*([-.\d]+)px/);
  if (translate?.[1]) {
    const value = Number.parseFloat(translate[1]);
    return Number.isFinite(value) ? value : 0;
  }
  return 0;
}

/** Card rect and viewport from the sticky window and the first card. Transforms are removed. */
export function scrollHorizontalReadFrame(
  sticky: HTMLElement,
  item: HTMLElement,
  row: HTMLElement,
  viewportWidth: number,
  viewportHeight: number,
): ScrollHorizontalExpandMetrics {
  const nominal = scrollHorizontalNominalExpandMetrics(viewportWidth, viewportHeight);
  const stickyRect = sticky.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const shift =
    scrollHorizontalReadTranslateX(getComputedStyle(row).transform) +
    scrollHorizontalReadTranslateX(getComputedStyle(item).transform);
  const vw = stickyRect.width > 0 ? stickyRect.width : nominal.viewportWidth;
  const vh = stickyRect.height > 0 ? stickyRect.height : nominal.viewportHeight;
  const cardWidth = itemRect.width > 0 ? itemRect.width : nominal.cardWidth;
  const cardHeight = itemRect.height > 0 ? itemRect.height : nominal.cardHeight;
  const cardLeft =
    itemRect.width > 0 ? itemRect.left - shift - stickyRect.left : (vw - cardWidth) / 2;
  const cardTop = itemRect.height > 0 ? itemRect.top - stickyRect.top : (vh - cardHeight) / 2;
  const gap = scrollHorizontalParseGap(getComputedStyle(row).columnGap);
  const radius = scrollHorizontalParseGap(getComputedStyle(item).borderTopLeftRadius);
  return {
    viewportWidth: vw,
    viewportHeight: vh,
    cardWidth,
    cardHeight,
    cardLeft,
    cardTop,
    pitch: cardWidth + (gap > 0 ? gap : nominal.pitch - nominal.cardWidth),
    radius: radius > 0 ? radius : scrollHorizontalRadius,
  };
}

/**
 * Clip rect of the full-viewport layer.
 * Horizontal progress parks the last card on the centered card rect.
 * Expand amount then insets that rect out to the viewport edges and takes the radius to 0.
 * At amount 1 the clip is `inset(0)` so the layer's own box — the sticky `h-svh` window — is the tile.
 */
export function scrollHorizontalExpandClipRect(
  horizontalProgress: number,
  expandAmount: number,
  metrics: ScrollHorizontalExpandMetrics,
  count: number,
): ScrollHorizontalClipRect {
  const grow = scrollHorizontalClamp01(expandAmount);
  const travel =
    Number.isFinite(count) && count > 1 && metrics.pitch > 0 ? (count - 1) * metrics.pitch : 0;
  const horizontal = scrollHorizontalClamp01(horizontalProgress);
  const left = metrics.cardLeft + travel * (1 - horizontal);
  const top = metrics.cardTop;
  const right = metrics.viewportWidth - left - metrics.cardWidth;
  const bottom = metrics.viewportHeight - top - metrics.cardHeight;
  const radius = (Number.isFinite(metrics.radius) ? metrics.radius : 0) * (1 - grow);
  return {
    top: top * (1 - grow),
    right: right * (1 - grow),
    bottom: bottom * (1 - grow),
    left: left * (1 - grow),
    radius,
  };
}

export function scrollHorizontalExpandClip(
  horizontalProgress: number,
  expandAmount: number,
  metrics: ScrollHorizontalExpandMetrics,
  count: number,
): string {
  const rect = scrollHorizontalExpandClipRect(horizontalProgress, expandAmount, metrics, count);
  return `inset(${rect.top}px ${rect.right}px ${rect.bottom}px ${rect.left}px round ${rect.radius}px)`;
}

/** True when the clip no longer insets the viewport and the radius is 0. */
export function scrollHorizontalClipFillsViewport(
  rect: ScrollHorizontalClipRect,
  viewportWidth: number,
  viewportHeight: number,
): boolean {
  if (rect.radius !== 0) return false;
  if (rect.top > 0 || rect.right > 0 || rect.bottom > 0 || rect.left > 0) return false;
  const width = viewportWidth - rect.left - rect.right;
  const height = viewportHeight - rect.top - rect.bottom;
  return width >= viewportWidth && height >= viewportHeight;
}
