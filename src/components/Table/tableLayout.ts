/** Sticky column sides — mirrors `TableSticky` on the compound Table API. */
export type StickySide = "start" | "end";

export interface StickyOffsets {
  start: number[];
  end: number[];
}

export interface StickyCounts {
  start: number;
  end: number;
}

export interface ScrollEdgeState {
  canScrollStart: boolean;
  canScrollEnd: boolean;
}

export function buildColumnTemplate(widths: number[]): string | null {
  if (widths.length === 0) return null;
  return widths.map((width) => `${width}px`).join(" ");
}

export function computeStickyCounts(
  stickyByColumn: Array<StickySide | undefined>,
): StickyCounts {
  return {
    start: stickyByColumn.filter((sticky) => sticky === "start").length,
    end: stickyByColumn.filter((sticky) => sticky === "end").length,
  };
}

export function computeStickyOffsets(
  columnWidths: number[],
  stickyByColumn: Array<StickySide | undefined>,
): StickyOffsets {
  const startIndices = stickyByColumn
    .map((sticky, index) => (sticky === "start" ? index : -1))
    .filter((index) => index >= 0);

  const endIndices = stickyByColumn
    .map((sticky, index) => (sticky === "end" ? index : -1))
    .filter((index) => index >= 0)
    .reverse();

  let cumulative = 0;
  const start = startIndices.map((index) => {
    const offset = cumulative;
    cumulative += columnWidths[index] ?? 0;
    return offset;
  });

  cumulative = 0;
  const end = endIndices.map((index) => {
    const offset = cumulative;
    cumulative += columnWidths[index] ?? 0;
    return offset;
  });

  return { start, end };
}

export function stickyStyles(
  sticky: StickySide | undefined,
  stickyIndex: number | undefined,
  offsets: StickyOffsets,
): { left?: number; right?: number } | undefined {
  if (sticky == null || stickyIndex == null) return undefined;

  if (sticky === "start") {
    return { left: offsets.start[stickyIndex] ?? 0 };
  }

  return { right: offsets.end[stickyIndex] ?? 0 };
}

export function stickyScrollShadowClass(
  sticky: StickySide | undefined,
  stickyIndex: number | undefined,
  stickyCounts: StickyCounts,
  scrollEdge: ScrollEdgeState,
): string | false {
  if (
    sticky === "start" &&
    stickyIndex != null &&
    stickyIndex === stickyCounts.start - 1 &&
    scrollEdge.canScrollStart
  ) {
    return "wmds-table-scroll-shadow-start";
  }

  if (sticky === "end" && stickyIndex === 0 && scrollEdge.canScrollEnd) {
    return "wmds-table-scroll-shadow-end";
  }

  return false;
}

export function computeScrollEdge(
  scrollLeft: number,
  clientWidth: number,
  scrollWidth: number,
): ScrollEdgeState {
  const hasOverflow = scrollWidth - clientWidth > 1;
  return {
    canScrollStart: hasOverflow && scrollLeft > 1,
    canScrollEnd: hasOverflow && scrollLeft + clientWidth < scrollWidth - 1,
  };
}
