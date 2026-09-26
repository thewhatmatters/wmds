import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { footerRevealAt } from "./footerRevealAt";
import {
  footerRevealContentClasses,
  footerRevealFadeClasses,
  footerRevealFieldClasses,
  footerRevealRootClasses,
  footerRevealScaleClasses,
  footerRevealStickyClasses,
} from "./footerRevealStyles";

describe("footerRevealAt", () => {
  it("clamps a tiny footer to 0.05", () => {
    expect(footerRevealAt(0, 800)).toBe(0.05);
    expect(footerRevealAt(10, 800)).toBe(0.05);
  });

  it("clamps a footer taller than the viewport to 0.95", () => {
    expect(footerRevealAt(900, 800)).toBe(0.95);
    expect(footerRevealAt(800, 800)).toBe(0.95);
  });

  it("uses footer height over viewport height inside the clamp", () => {
    expect(footerRevealAt(280, 800)).toBeCloseTo(0.35);
  });

  it("treats a zero viewport as 1px before clamping", () => {
    expect(footerRevealAt(0, 0)).toBe(0.05);
    expect(footerRevealAt(1, 0)).toBe(0.95);
  });
});

describe("footer reveal shell", () => {
  it("keeps the cover above a sticky footer inside an isolate root", () => {
    expect(footerRevealRootClasses).toContain("isolate");
    expect(footerRevealRootClasses).toContain("overflow-x-clip");
    expect(footerRevealRootClasses).toContain("overflow-y-visible");
    expect(footerRevealContentClasses).toContain("z-[1]");
    expect(footerRevealContentClasses).toContain("min-h-dvh");
    expect(footerRevealContentClasses).toContain("bg-body");
    expect(footerRevealStickyClasses).toContain("sticky");
    expect(footerRevealStickyClasses).toContain("bottom-0");
    expect(footerRevealStickyClasses).toContain("z-[-1]");
  });

  it("does not hide the scrollbar or use a bare footer class", () => {
    const shell = [
      footerRevealRootClasses,
      footerRevealContentClasses,
      footerRevealStickyClasses,
      footerRevealFadeClasses,
      footerRevealScaleClasses,
      footerRevealFieldClasses,
    ].join(" ");
    expect(shell).not.toContain("scrollbar-width");
    expect(shell.split(/\s+/)).not.toContain("footer");
    expect(shell).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(shell).not.toContain("oklch");
  });

  it("paints the field with primary and on-primary", () => {
    const field = ["bg", "primary"].join("-");
    const ink = ["text", "primary-foreground"].join("-");
    expect(footerRevealFieldClasses.split(" ")).toContain(field);
    expect(footerRevealFieldClasses.split(" ")).toContain(ink);
  });

  it("is a client module and does not ship an inline stylesheet", () => {
    const source = readFileSync(new URL("./FooterReveal.tsx", import.meta.url), "utf8");
    expect(source.startsWith('"use client"')).toBe(true);
    expect(source).not.toContain("<style");
    expect(source).not.toContain("scrollbar-width");
    expect(source).toContain('offset: ["end end", "end start"]');
    expect(source).toContain("50% 100%");
  });
});
