import { describe, expect, it } from "vitest";
import { computeTableLayoutMetrics } from "./tableMeasurer";

describe("computeTableLayoutMetrics", () => {
  it("builds column template and sticky offsets from measured widths", () => {
    const metrics = computeTableLayoutMetrics({
      measuredWidths: [80, 120, 60],
      stickyByColumn: ["start", undefined, "end"],
    });

    expect(metrics.columnTemplate).toBe("80px 120px 60px");
    expect(metrics.stickyCounts).toEqual({ start: 1, end: 1 });
    expect(metrics.stickyOffsets).toEqual({ start: [0], end: [0] });
  });

  it("accumulates sticky offsets for multiple columns on one side", () => {
    const metrics = computeTableLayoutMetrics({
      measuredWidths: [40, 50, 30],
      stickyByColumn: ["start", "start", undefined],
    });

    expect(metrics.stickyOffsets.start).toEqual([0, 40]);
    expect(metrics.stickyCounts.start).toBe(2);
  });
});
