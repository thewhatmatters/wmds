import { describe, expect, it } from "vitest";
import {
  ASTRYX_EASE_STANDARD,
  motionDurationFallbackMs,
  parseCubicBezier,
  parseDurationSeconds,
  readMotionDurationSeconds,
  readMotionEase,
} from "./motion";

describe("parseDurationSeconds", () => {
  it("parses ms values", () => {
    expect(parseDurationSeconds("175ms")).toBe(0.175);
    expect(parseDurationSeconds(" 410ms ")).toBe(0.41);
  });

  it("parses s values", () => {
    expect(parseDurationSeconds("0.2s")).toBe(0.2);
  });

  it("returns undefined for garbage", () => {
    expect(parseDurationSeconds("nope")).toBeUndefined();
  });
});

describe("parseCubicBezier", () => {
  it("parses Astryx standard curve", () => {
    expect(parseCubicBezier("cubic-bezier(0.24, 1, 0.4, 1)")).toEqual(ASTRYX_EASE_STANDARD);
  });
});

describe("readMotionDurationSeconds", () => {
  it("falls back without a root element", () => {
    expect(readMotionDurationSeconds("fast", null)).toBe(
      motionDurationFallbackMs.fast / 1000,
    );
    expect(readMotionDurationSeconds("medium", null)).toBe(
      motionDurationFallbackMs.medium / 1000,
    );
  });
});

describe("readMotionEase", () => {
  it("falls back to Astryx standard bezier without a root element", () => {
    expect(readMotionEase("standard", null)).toEqual(ASTRYX_EASE_STANDARD);
  });
});
