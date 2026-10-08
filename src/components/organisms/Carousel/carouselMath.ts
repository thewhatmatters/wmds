/**
 * Carousel geometry — positions are logical: `0` is the row's start and the value grows toward
 * its end, in px, in both writing directions. The component maps them to `scrollLeft`.
 */

/** Share of an overscroll the row follows before it springs back. */
export const carouselOverscrollElasticity = 0.5;

/** Pointer travel, in px, before a press on the row becomes a drag. */
export const carouselDragThreshold = 4;

/** The filled part of the scrubber never gets narrower than this, in px. */
export const carouselThumbMinWidth = 24;

/** Rounding slack, in px, when comparing scroll positions. */
const epsilon = 1;

export function carouselClamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** How far the row can scroll. `0` when every item fits. */
export function carouselMaxScroll(viewWidth: number, contentWidth: number): number {
  return Math.max(0, contentWidth - viewWidth);
}

/** True when the row has more than it can show. */
export function carouselOverflows(viewWidth: number, contentWidth: number): boolean {
  return carouselMaxScroll(viewWidth, contentWidth) > epsilon;
}

/**
 * Where the row rests: each item's leading edge, capped at the end of the row. Items that
 * share a resting place (those past the last full view) collapse into one point.
 */
export function carouselSnapPoints(itemOffsets: readonly number[], maxScroll: number): number[] {
  const points: number[] = [];
  for (const offset of [...itemOffsets].sort((a, b) => a - b)) {
    const point = carouselClamp(offset, 0, maxScroll);
    const last = points[points.length - 1];
    if (last === undefined || point - last > epsilon) points.push(point);
  }
  if (points.length === 0) return [0];
  return points;
}

/** The resting place closest to `position`. */
export function carouselNearestSnap(points: readonly number[], position: number): number {
  let nearest = points[0] ?? 0;
  for (const point of points) {
    if (Math.abs(point - position) < Math.abs(nearest - position)) nearest = point;
  }
  return nearest;
}

/** One item toward the end (`1`) or the start (`-1`) from `position`; stays put at either end. */
export function carouselStep(points: readonly number[], position: number, direction: 1 | -1): number {
  if (direction === 1) {
    return points.find((point) => point > position + epsilon) ?? points[points.length - 1] ?? 0;
  }
  for (let index = points.length - 1; index >= 0; index -= 1) {
    if (points[index] < position - epsilon) return points[index];
  }
  return points[0] ?? 0;
}

/** Row progress, 0–1. */
export function carouselProgress(position: number, maxScroll: number): number {
  if (maxScroll <= 0) return 0;
  return carouselClamp(position / maxScroll, 0, 1);
}

/**
 * Width of the scrubber's filled part as a share of its track (0–1): the share of the row in
 * view, held to `carouselThumbMinWidth` so it stays easy to grab.
 */
export function carouselThumbShare(viewWidth: number, contentWidth: number, trackWidth: number): number {
  if (contentWidth <= 0 || trackWidth <= 0) return 1;
  const inView = carouselClamp(viewWidth / contentWidth, 0, 1);
  return carouselClamp(Math.max(inView, carouselThumbMinWidth / trackWidth), 0, 1);
}

/**
 * Row progress for a press on the scrubber's track at `pointer` px from the track's start: the
 * filled part centers on the pointer.
 */
export function carouselProgressAtPointer(pointer: number, trackWidth: number, thumbWidth: number): number {
  const travel = trackWidth - thumbWidth;
  if (travel <= 0) return 0;
  return carouselClamp((pointer - thumbWidth / 2) / travel, 0, 1);
}

/** How far the row shifts for an overscroll of `overshoot` px. */
export function carouselOverscrollOffset(overshoot: number): number {
  return overshoot * carouselOverscrollElasticity;
}
