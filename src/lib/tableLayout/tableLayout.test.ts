import { describe, expect, it } from "vitest";
import {
  buildColumnTemplate,
  computeScrollEdge,
  computeStickyCounts,
  computeStickyOffsets,
  stickyScrollShadowClass,
  stickyStyles,
} from "./tableLayout";

describe("buildColumnTemplate", () => {
  it("returns null for empty widths", () => {
    expect(buildColumnTemplate([])).toBeNull();
  });

  it("joins measured widths as px columns", () => {
    expect(buildColumnTemplate([120, 80, 200])).toBe("120px 80px 200px");
  });
});

describe("computeStickyCounts", () => {
  it("counts start and end sticky columns", () => {
    expect(
      computeStickyCounts(["start", undefined, "end", "start", "end"]),
    ).toEqual({ start: 2, end: 2 });
  });
});

describe("computeStickyOffsets", () => {
  it("returns empty offsets when nothing is sticky", () => {
    expect(computeStickyOffsets([100, 200], [undefined, undefined])).toEqual({
      start: [],
      end: [],
    });
  });

  it("accumulates start offsets left to right", () => {
    expect(computeStickyOffsets([100, 80, 120], ["start", "start", undefined])).toEqual({
      start: [0, 100],
      end: [],
    });
  });

  it("accumulates end offsets from the trailing edge inward", () => {
    expect(computeStickyOffsets([100, 80, 120], [undefined, "end", "end"])).toEqual({
      start: [],
      end: [0, 120],
    });
  });

  it("handles mixed start and end sticky columns", () => {
    expect(
      computeStickyOffsets([100, 80, 120, 60], ["start", undefined, "end", "end"]),
    ).toEqual({
      start: [0],
      end: [0, 60],
    });
  });
});

describe("stickyStyles", () => {
  const offsets = { start: [0, 100], end: [0, 80] };

  it("returns undefined when sticky is not set", () => {
    expect(stickyStyles(undefined, 0, offsets)).toBeUndefined();
  });

  it("maps start sticky indices to left offsets", () => {
    expect(stickyStyles("start", 1, offsets)).toEqual({ left: 100 });
  });

  it("maps end sticky indices to right offsets", () => {
    expect(stickyStyles("end", 0, offsets)).toEqual({ right: 0 });
  });
});

describe("stickyScrollShadowClass", () => {
  const counts = { start: 2, end: 1 };

  it("shadows the last start sticky column when scrolled away from the start edge", () => {
    expect(
      stickyScrollShadowClass("start", 1, counts, {
        canScrollStart: true,
        canScrollEnd: false,
      }),
    ).toBe("wmds-table-scroll-shadow-start");
  });

  it("shadows the first end sticky column when more content exists to the right", () => {
    expect(
      stickyScrollShadowClass("end", 0, counts, {
        canScrollStart: false,
        canScrollEnd: true,
      }),
    ).toBe("wmds-table-scroll-shadow-end");
  });

  it("returns false when scroll edges are inactive", () => {
    expect(
      stickyScrollShadowClass("start", 1, counts, {
        canScrollStart: false,
        canScrollEnd: false,
      }),
    ).toBe(false);
  });
});

describe("computeScrollEdge", () => {
  it("reports no edges when content fits", () => {
    expect(computeScrollEdge(0, 500, 500)).toEqual({
      canScrollStart: false,
      canScrollEnd: false,
    });
  });

  it("reports start edge when scrolled right", () => {
    expect(computeScrollEdge(50, 400, 800)).toEqual({
      canScrollStart: true,
      canScrollEnd: true,
    });
  });

  it("reports only end edge at scroll origin with overflow", () => {
    expect(computeScrollEdge(0, 400, 800)).toEqual({
      canScrollStart: false,
      canScrollEnd: true,
    });
  });

  it("reports only start edge when scrolled to the end", () => {
    expect(computeScrollEdge(400, 400, 800)).toEqual({
      canScrollStart: true,
      canScrollEnd: false,
    });
  });
});
