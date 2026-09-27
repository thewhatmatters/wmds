/** @vitest-environment happy-dom */
import { describe, expect, it } from "vitest";
import { footerRevealWordmarkFontSize } from "./footerRevealStyles";
import {
  footerRevealWordmarkEm,
  footerRevealWordmarkEmCss,
  footerRevealWordmarkFittedEm,
  footerRevealWordmarkFrameWidth,
  readFooterRevealWordmarkEm,
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

describe("syncFooterRevealWordmark", () => {
  it("sets the em so 100cqi fills the frame", () => {
    const frame = document.createElement("div");
    const node = document.createElement("p");
    node.style.fontSize = footerRevealWordmarkFontSize;
    Object.defineProperty(frame, "clientWidth", { configurable: true, get: () => 1000 });
    Object.defineProperty(node, "scrollWidth", {
      configurable: true,
      get() {
        const probe = /^(\d+(?:\.\d+)?)px$/.exec(node.style.fontSize);
        if (probe) return 6.42 * Number(probe[1]);
        const em = Number.parseFloat(frame.style.getPropertyValue("--footer-wordmark-em")) || 9;
        return 1000 * (6.42 / em);
      },
    });

    const em = syncFooterRevealWordmark(node, frame);
    expect(em).toBeCloseTo(6.42);
    expect(frame.style.getPropertyValue("--footer-wordmark-em")).toBe("6.42");
    expect(node.style.fontSize).toBe(footerRevealWordmarkFontSize);
    expect(footerRevealWordmarkFrameWidth(frame)).toBe(1000);
  });

  it("corrects a probe that does not match the fitted optical size", () => {
    const frame = document.createElement("div");
    const node = document.createElement("p");
    node.style.fontSize = footerRevealWordmarkFontSize;
    Object.defineProperty(frame, "clientWidth", { configurable: true, get: () => 1000 });
    Object.defineProperty(node, "scrollWidth", {
      configurable: true,
      get() {
        const probe = /^(\d+(?:\.\d+)?)px$/.exec(node.style.fontSize);
        if (probe) return 6 * Number(probe[1]);
        const em = Number.parseFloat(frame.style.getPropertyValue("--footer-wordmark-em")) || 9;
        // Fitted size is 10% wider than the 100px probe predicted.
        return 1000 * (6.6 / em);
      },
    });

    const em = syncFooterRevealWordmark(node, frame);
    expect(em).toBeCloseTo(6.6, 3);
    expect(Math.abs(node.scrollWidth - 1000)).toBeLessThanOrEqual(1);
  });
});
