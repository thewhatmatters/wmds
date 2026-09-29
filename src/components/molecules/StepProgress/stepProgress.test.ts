import { describe, expect, it } from "vitest";
import { isStepProgressSegmentFilled, stepProgressLabel } from "./StepProgress";

describe("StepProgress", () => {
  it("labels the current step", () => {
    expect(stepProgressLabel(1, 4)).toBe("Step 1 of 4");
    expect(stepProgressLabel(4, 4)).toBe("Step 4 of 4");
  });

  it("fills segments through the current step", () => {
    expect(isStepProgressSegmentFilled(0, 1)).toBe(true);
    expect(isStepProgressSegmentFilled(1, 1)).toBe(false);
    expect([0, 1, 2, 3].map((index) => isStepProgressSegmentFilled(index, 3))).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });
});
