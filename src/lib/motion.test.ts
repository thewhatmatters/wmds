import { describe, expect, it } from "vitest";
import {
  motionDurationFallbackMs,
  parseCubicBezier,
  parseDurationSeconds,
  readMotionDurationSeconds,
  readMotionEase,
} from "./motion";

describe("parseDurationSeconds", () => {
  it("parses ms values", () => {
    expect(parseDurationSeconds("150ms")).toBe(0.15);
    expect(parseDurationSeconds(" 300ms ")).toBe(0.3);
  });

  it("parses s values", () => {
    expect(parseDurationSeconds("0.2s")).toBe(0.2);
  });

  it("returns undefined for garbage", () => {
    expect(parseDurationSeconds("nope")).toBeUndefined();
  });
});

describe("parseCubicBezier", () => {
  it("parses theme expo curve", () => {
    expect(parseCubicBezier("cubic-bezier(0.16, 1, 0.3, 1)")).toEqual([0.16, 1, 0.3, 1]);
  });
});

describe("readMotionDurationSeconds", () => {
  it("falls back without a root element", () => {
    expect(readMotionDurationSeconds("fast", null)).toBe(
      motionDurationFallbackMs.fast / 1000,
    );
  });
});

describe("readMotionEase", () => {
  it("falls back to expo bezier without a root element", () => {
    expect(readMotionEase("out-expo", null)).toEqual([0.16, 1, 0.3, 1]);
  });

  it("falls back to ease-out curve for standard without a root element", () => {
    expect(readMotionEase("standard", null)).toEqual([0, 0, 0.2, 1]);
  });
});
