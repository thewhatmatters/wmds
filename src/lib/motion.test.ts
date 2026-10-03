import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ASTRYX_EASE_STANDARD,
  motionBeatSeconds,
  motionBlurReveal,
  motionChoreographyFallbacks,
  motionDurationFallbackMs,
  motionStaggerSeconds,
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

describe("choreography helpers", () => {
  it("fall back to the motion.css values without a root", () => {
    expect(motionStaggerSeconds(null)).toBe(0.06);
    expect(motionBeatSeconds(1, null)).toBe(0.16);
    expect(motionBeatSeconds(3, null)).toBe(0.48);
    expect(motionBeatSeconds(13, null)).toBe(2.08);
    expect(motionBlurReveal(false, null)).toEqual({
      initial: { opacity: 0, filter: "blur(4px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
    });
  });

  it("skip the initial frame under reduced motion", () => {
    expect(motionBlurReveal(true, null).initial).toBe(false);
  });

  it("keep fallbacks in step with src/theme/motion.css", () => {
    const css = readFileSync(new URL("../theme/motion.css", import.meta.url), "utf8");
    expect(css).toContain(`--motion-stagger: ${motionChoreographyFallbacks.staggerMs}ms;`);
    expect(css).toContain(`--motion-beat: ${motionChoreographyFallbacks.beatMs}ms;`);
    expect(css).toContain(`--motion-blur-reveal: ${motionChoreographyFallbacks.blurRevealPx}px;`);
  });
});
