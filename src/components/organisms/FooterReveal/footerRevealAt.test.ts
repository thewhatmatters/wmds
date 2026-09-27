import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { footerRevealAt } from "./footerRevealAt";
import {
  footerRevealBrandClasses,
  footerRevealContentClasses,
  footerRevealExternalLinkProps,
  footerRevealFadeClasses,
  footerRevealFieldClasses,
  footerRevealRootClasses,
  footerRevealScaleClasses,
  footerRevealSocialLinkClasses,
  footerRevealStickyClasses,
  footerRevealWordmarkClasses,
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

  it("paints the field with brand and surface ink", () => {
    const field = ["bg", "brand"].join("-");
    const ink = ["text", "surface"].join("-");
    expect(footerRevealFieldClasses.split(" ")).toContain(field);
    expect(footerRevealFieldClasses.split(" ")).toContain(ink);
  });

  it("keeps surface on brand at the AA threshold and large text well above it", () => {
    const css = readFileSync(new URL("../../../theme/colors.css", import.meta.url), "utf8");
    const brand = css.match(/--color-brand:\s*(#[0-9a-fA-F]{6})/)?.[1];
    const surface = css.match(/--color-background-surface:\s*(#[0-9a-fA-F]{6})/)?.[1];
    expect(brand).toBeTruthy();
    expect(surface).toBeTruthy();
    const ratio = contrastRatio(surface!, brand!);
    expect(Math.round(ratio * 10) / 10).toBeGreaterThanOrEqual(4.5);
    expect(ratio).toBeGreaterThan(3);
    expect(footerRevealSocialLinkClasses).toContain("type-heading-1");
    expect(footerRevealWordmarkClasses).toContain("text-surface/20");
    expect(footerRevealWordmarkClasses).toContain("clamp(");
    expect(footerRevealBrandClasses).toContain("overflow-hidden");
  });

  it("is a client module and does not ship an inline stylesheet", () => {
    const source = readFileSync(new URL("./FooterReveal.tsx", import.meta.url), "utf8");
    expect(source.startsWith('"use client"')).toBe(true);
    expect(source).not.toContain("<style");
    expect(source).not.toContain("scrollbar-width");
    expect(source).toContain('offset: ["end end", "end start"]');
    expect(source).toContain("50% 100%");
    expect(source).toContain("reduceMotion ? [0, 0] : [12, 0]");
    expect(source).toContain('aria-hidden="true"');
    expect(source).not.toContain("reduceMotion ? [0, 0] : [6, 0]");
  });
});

describe("footerRevealExternalLinkProps", () => {
  it("opens https links in a new tab", () => {
    expect(footerRevealExternalLinkProps("https://www.instagram.com/thewhatmatters")).toEqual({
      target: "_blank",
      rel: "noopener",
    });
  });

  it("leaves placeholder hashes on the same page", () => {
    expect(footerRevealExternalLinkProps("#contra-TODO")).toEqual({});
    expect(footerRevealExternalLinkProps("#x-TODO")).toEqual({});
  });
});

function contrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string) => {
    const channel = (value: number) => {
      const srgb = value / 255;
      return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
    };
    const r = channel(parseInt(hex.slice(1, 3), 16));
    const g = channel(parseInt(hex.slice(3, 5), 16));
    const b = channel(parseInt(hex.slice(5, 7), 16));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
