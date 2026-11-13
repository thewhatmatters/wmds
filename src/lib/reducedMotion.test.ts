import { describe, expect, it } from "vitest";
import { resolveReducedMotion } from "./reducedMotion";

describe("resolveReducedMotion", () => {
  it("follows the reader's setting in an app with no MotionConfig (Motion's default is \"never\")", () => {
    expect(resolveReducedMotion(true, "never")).toBe(true);
    expect(resolveReducedMotion(true, undefined)).toBe(true);
    expect(resolveReducedMotion(true, "user")).toBe(true);
  });

  it("keeps motion when the reader has not asked for less", () => {
    expect(resolveReducedMotion(false, "never")).toBe(false);
    expect(resolveReducedMotion(false, "user")).toBe(false);
    // Not known yet (the server, or before Motion has read the setting).
    expect(resolveReducedMotion(null, "user")).toBe(false);
  });

  it("reduces under MotionConfig reducedMotion=\"always\" whatever the reader's setting", () => {
    expect(resolveReducedMotion(false, "always")).toBe(true);
    expect(resolveReducedMotion(null, "always")).toBe(true);
  });
});
