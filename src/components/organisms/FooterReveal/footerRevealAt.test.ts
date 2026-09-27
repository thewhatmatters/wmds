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
  footerRevealWordmarkEmFallback,
  footerRevealWordmarkFontSize,
  footerRevealWordmarkFrameClasses,
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
    expect(footerRevealRootClasses).toContain("overflow-visible");
    expect(footerRevealRootClasses).not.toContain("overflow-x-clip");
    expect(footerRevealContentClasses).toContain("overflow-visible");
    expect(footerRevealContentClasses).not.toContain("overflow-x-clip");
    expect(footerRevealFadeClasses).toContain("overflow-x-clip");
    expect(footerRevealStickyClasses).toContain("overflow-x-clip");
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

  it("paints the field with brand and on-brand ink", () => {
    const field = ["bg", "brand"].join("-");
    const ink = ["text", "on-brand"].join("-");
    expect(footerRevealFieldClasses.split(" ")).toContain(field);
    expect(footerRevealFieldClasses.split(" ")).toContain(ink);
  });

  it("keeps white on brand navy well above AA", () => {
    const css = readFileSync(new URL("../../../theme/colors.css", import.meta.url), "utf8");
    const brands = [...css.matchAll(/--color-brand:\s*(#[0-9a-fA-F]{6})/g)].map((match) => match[1]);
    expect(brands).toEqual(["#011272", "#011272"]);
    const onBrand = css.match(/--color-on-brand:\s*(#[0-9a-fA-F]{6})/)?.[1];
    expect(onBrand).toBe("#ffffff");
    const ratio = contrastRatio(onBrand!, brands[0]!);
    expect(ratio).toBeGreaterThan(7);
    expect(css).toContain("color-mix(in srgb, var(--color-brand) 45%, white)");
    expect(css).toContain("color-mix(in srgb, var(--color-on-brand) 40%, var(--color-brand))");
    const outline = mixHex("#011272", "#ffffff", 0.45);
    expect(contrastRatio(outline, "#262626")).toBeGreaterThan(4.5);
    expect(contrastRatio(outline, "#1b1b1b")).toBeGreaterThan(4.5);
    expect(contrastRatio("#011272", "#1b1b1b")).toBeLessThan(3);
    const wordmark = mixHex("#ffffff", "#011272", 0.4);
    expect(contrastRatio(wordmark, "#011272")).toBeGreaterThan(2.5);
    expect(footerRevealSocialLinkClasses).toContain("type-heading-1");
    expect(footerRevealWordmarkClasses).toContain("text-brand-soft");
    expect(footerRevealWordmarkClasses.split(" ")).toContain(["font", "bold"].join("-"));
    expect(footerRevealWordmarkClasses).toContain("translate-y-[16%]");
    expect(footerRevealWordmarkClasses).toContain("tracking-[-0.045em]");
    expect(footerRevealWordmarkClasses).not.toContain("clamp(");
    expect(footerRevealWordmarkClasses).not.toContain("22rem");
    expect(footerRevealWordmarkClasses).not.toContain("-12vw");
    expect(footerRevealWordmarkFrameClasses).toContain("@container");
    expect(footerRevealWordmarkFrameClasses).toContain("inset-x-0");
    expect(footerRevealWordmarkFontSize).toBe(
      `calc(100cqi / var(--footer-wordmark-em, ${footerRevealWordmarkEmFallback}))`,
    );
    expect(footerRevealWordmarkFontSize).not.toContain("vw");
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

/** sRGB mix. `weightA` is the share of `a` (the rest is `b`). */
function mixHex(a: string, b: string, weightA: number): string {
  const channels = (hex: string) =>
    [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  const [ar, ag, ab] = channels(a);
  const [br, bg, bb] = channels(b);
  const channel = (left: number, right: number) =>
    Math.round(left * weightA + right * (1 - weightA))
      .toString(16)
      .padStart(2, "0");
  return `#${channel(ar, br)}${channel(ag, bg)}${channel(ab, bb)}`;
}

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
