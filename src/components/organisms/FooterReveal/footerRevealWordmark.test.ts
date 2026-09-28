/** @vitest-environment happy-dom */
import { describe, expect, it } from "vitest";
import { footerRevealWordmarkFontSize } from "./footerRevealStyles";
import {
  footerRevealWordmarkEm,
  footerRevealWordmarkEmCss,
  footerRevealWordmarkFitEm,
  footerRevealWordmarkFillsFrame,
  footerRevealWordmarkFittedEm,
  footerRevealWordmarkFrameWidth,
  syncFooterRevealWordmark,
} from "./footerRevealWordmark";

const viewports = [320, 390, 768, 1280, 1440, 1920, 2560, 3840];

describe("footerRevealWordmarkEm", () => {
  it("returns advance width in em", () => {
    expect(footerRevealWordmarkEm(642, 100)).toBeCloseTo(6.42);
  });

  it("rejects an empty probe", () => {
    expect(footerRevealWordmarkEm(0, 100)).toBeNull();
    expect(footerRevealWordmarkEm(100, 0)).toBeNull();
    expect(footerRevealWordmarkEm(Number.NaN, 100)).toBeNull();
  });
});

describe("footerRevealWordmarkFittedEm", () => {
  it("fills the frame at every viewport width", () => {
    const em = 6.42;
    for (const width of viewports) {
      const fontSize = width / em;
      expect(fontSize * em).toBeCloseTo(width, 5);
      expect(footerRevealWordmarkFittedEm(em, fontSize * em, width)).toBeCloseTo(em, 5);
    }
  });

  it("increases em when the word is wider than the frame", () => {
    expect(footerRevealWordmarkFittedEm(7, 1400, 1000)).toBeCloseTo(9.8);
  });

  it("rejects a zero frame", () => {
    expect(footerRevealWordmarkFittedEm(7, 1400, 0)).toBeNull();
  });
});

describe("footerRevealWordmarkEmCss", () => {
  it("rounds to a unitless value", () => {
    expect(footerRevealWordmarkEmCss(6.123456789)).toBe("6.123457");
  });

  it("falls back when the measure is unusable", () => {
    expect(footerRevealWordmarkEmCss(0)).toBe("9");
    expect(footerRevealWordmarkEmCss(Number.NaN)).toBe("9");
  });
});

describe("footerRevealWordmarkFitEm", () => {
  it("picks the rounded em whose width fills the frame", () => {
    const em = footerRevealWordmarkFitEm(1000, 6.42, (candidate) => 1000 * (6.42 / candidate));
    expect(em).toBeCloseTo(6.42, 2);
  });

  it("grows em when the fitted size is wider than the 100px probe", () => {
    const em = footerRevealWordmarkFitEm(1000, 6, (candidate) => 1000 * (6.6 / candidate));
    expect(em).toBeCloseTo(6.6, 2);
  });
});

describe("footerRevealWordmarkFillsFrame", () => {
  it("accepts a word that covers the content box", () => {
    const frame = document.createElement("div");
    const text = document.createElement("p");
    Object.defineProperty(frame, "clientWidth", { configurable: true, get: () => 1000 });
    Object.defineProperty(text, "scrollWidth", { configurable: true, get: () => 970 });
    expect(footerRevealWordmarkFillsFrame(text, frame)).toBe(true);
    Object.defineProperty(text, "scrollWidth", { configurable: true, get: () => 800 });
    expect(footerRevealWordmarkFillsFrame(text, frame)).toBe(false);
  });
});

describe("syncFooterRevealWordmark", () => {
  const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");

  function mockProbeWidth(widthAtPx: (px: number, transitionsDisabled: boolean) => number) {
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get(this: HTMLElement) {
        if (!this.hasAttribute("data-footer-wordmark-probe")) return 0;
        const transitionsDisabled =
          this.style.getPropertyPriority("transition-property") === "important" &&
          this.style.getPropertyValue("transition-property") === "none" &&
          this.style.getPropertyPriority("transition-duration") === "important" &&
          this.style.getPropertyValue("transition-duration") === "0s";
        const px = Number.parseFloat(this.style.getPropertyValue("font-size"));
        return widthAtPx(Number.isFinite(px) ? px : 0, transitionsDisabled);
      },
    });
  }

  function restoreScrollWidth() {
    if (originalScrollWidth) {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", originalScrollWidth);
    }
  }

  it("sets the em so 100cqi fills the frame", () => {
    const frame = document.createElement("div");
    const node = document.createElement("p");
    node.textContent = "WhatMatters";
    node.style.fontSize = footerRevealWordmarkFontSize;
    Object.defineProperty(frame, "clientWidth", { configurable: true, get: () => 1000 });
    mockProbeWidth((px, transitionsDisabled) => (transitionsDisabled ? 6.42 * px : 10000));

    const em = syncFooterRevealWordmark(node, frame);
    expect(em).toBeCloseTo(6.42, 2);
    expect(Number(frame.style.getPropertyValue("--footer-wordmark-em"))).toBeCloseTo(6.42, 2);
    expect(node.style.fontSize).toBe(footerRevealWordmarkFontSize);
    expect(document.querySelector("[data-footer-wordmark-probe]")).toBeNull();
    expect(footerRevealWordmarkFrameWidth(frame)).toBe(1000);
    restoreScrollWidth();
  });

  it("ignores a stale width left by a reduced-motion transition", () => {
    const frame = document.createElement("div");
    const node = document.createElement("p");
    node.textContent = "WhatMatters";
    node.style.fontSize = footerRevealWordmarkFontSize;
    Object.defineProperty(frame, "clientWidth", { configurable: true, get: () => 1000 });
    // Without transition: none, scrollWidth stays on the previous (too-wide) size.
    mockProbeWidth((px, transitionsDisabled) => (transitionsDisabled ? 6.42 * px : 10000));

    const em = syncFooterRevealWordmark(node, frame);
    expect(em).toBeCloseTo(6.42, 2);
    expect(em).toBeLessThan(10);
    restoreScrollWidth();
  });

  it("corrects a probe that does not match the fitted optical size", () => {
    const frame = document.createElement("div");
    const node = document.createElement("p");
    node.textContent = "WhatMatters";
    node.style.fontSize = footerRevealWordmarkFontSize;
    Object.defineProperty(frame, "clientWidth", { configurable: true, get: () => 1000 });
    mockProbeWidth((px, transitionsDisabled) => {
      if (!transitionsDisabled) return 10000;
      // Fitted sizes run 10% wider than the 100px probe predicted.
      return px === 100 ? 600 : 6.6 * px;
    });

    const em = syncFooterRevealWordmark(node, frame);
    expect(em).toBeCloseTo(6.6, 2);
    restoreScrollWidth();
  });
});
