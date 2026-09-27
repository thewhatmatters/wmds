/** @vitest-environment happy-dom */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cssColorToRgb,
  nextRiveHandIdleDelayMs,
  readRiveHandFillRgb,
  readRiveHandOutlineRgb,
  riveHandArtboards,
  riveHandBooleanInput,
  riveHandBooleanValue,
  riveHandBoxSize,
  riveHandFillProperty,
  riveHandGrowDelaySec,
  riveHandIdleAllowed,
  riveHandIdleHoldMs,
  riveHandIdleMaxMs,
  riveHandIdleMinMs,
  riveHandOutlineFallback,
  riveHandOutlineProperty,
  riveHandOutlineToken,
  riveHandSrc,
  riveHandStateMachine,
} from "./riveHandUtils";

const runtime = vi.hoisted(() => {
  const setRgb = vi.fn();
  const pause = vi.fn();
  const drawFrame = vi.fn();
  const rgb = vi.fn();
  const input = { value: false };
  const color = vi.fn(() => ({ rgb }));
  const viewModelInstance = { color };
  const useRive = vi.fn();
  const useViewModelInstanceColor = vi.fn(() => ({ setRgb }));
  const useStateMachineInput = vi.fn(() => input);
  return {
    setRgb,
    pause,
    drawFrame,
    rgb,
    input,
    color,
    viewModelInstance,
    useRive,
    useViewModelInstanceColor,
    useStateMachineInput,
  };
});

vi.mock("@rive-app/react-canvas", () => {
  const React = require("react") as typeof import("react");
  class Layout {
    fit: string;
    constructor(options: { fit: string }) {
      this.fit = options.fit;
    }
  }
  runtime.useRive.mockImplementation(
    (params: {
      onRiveReady?: (rive: unknown) => void;
    }) => {
      params.onRiveReady?.({
        viewModelInstance: runtime.viewModelInstance,
        pause: runtime.pause,
        drawFrame: runtime.drawFrame,
      });
      return {
        rive: {
          viewModelInstance: runtime.viewModelInstance,
          pause: runtime.pause,
          drawFrame: runtime.drawFrame,
        },
        RiveComponent: () => React.createElement("canvas", { "data-rive-hand": "true" }),
      };
    },
  );
  return {
    Fit: { Contain: "contain" },
    Layout,
    useRive: runtime.useRive,
    useViewModelInstanceColor: runtime.useViewModelInstanceColor,
    useStateMachineInput: runtime.useStateMachineInput,
  };
});

import { RiveHand } from "./RiveHand";

function stubMotion(reduced: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  })) as typeof window.matchMedia;
}

describe("rive hand tokens", () => {
  it("parses hex and rgb colors", () => {
    expect(cssColorToRgb("#262626")).toEqual({ r: 38, g: 38, b: 38 });
    expect(cssColorToRgb("#171717")).toEqual({ r: 23, g: 23, b: 23 });
    expect(cssColorToRgb("rgb(38, 38, 38)")).toEqual({ r: 38, g: 38, b: 38 });
    expect(riveHandBoxSize(24)).toBe("24px");
    expect(riveHandBoxSize("1.35em")).toBe("1.35em");
  });

  it("maps point and rock to the cleaned artboards", () => {
    expect(riveHandArtboards.point).toBe("31_Cigarette");
    expect(riveHandArtboards.rock).toBe("29_Rock");
  });
});

describe("RiveHand", () => {
  let root: Root;
  let container: HTMLDivElement;

  beforeEach(() => {
    runtime.setRgb.mockClear();
    runtime.pause.mockClear();
    runtime.drawFrame.mockClear();
    runtime.rgb.mockClear();
    runtime.color.mockClear();
    runtime.useRive.mockClear();
    runtime.useViewModelInstanceColor.mockClear();
    runtime.useStateMachineInput.mockClear();
    runtime.input.value = false;
    document.documentElement.style.setProperty("--color-surface", "#ffffff");
    document.documentElement.style.setProperty("--color-background-surface", "#ffffff");
    document.documentElement.style.setProperty("--color-brand", "#011272");
    document.documentElement.style.removeProperty("--color-brand-outline");
    stubMotion(false);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  async function render(node: ReactNode) {
    await act(async () => {
      root.render(node);
    });
  }

  it("binds the point artboard, token colors, and the interaction input", async () => {
    await render(createElement(RiveHand, { hand: "point", size: "1.35em", active: true, className: "absolute" }));

    const params = runtime.useRive.mock.calls.at(-1)?.[0];
    expect(params).toMatchObject({
      src: riveHandSrc,
      artboard: "31_Cigarette",
      stateMachines: riveHandStateMachine,
      autoBind: true,
    });
    expect(params.layout.fit).toBe("contain");
    expect(runtime.useViewModelInstanceColor).toHaveBeenCalledWith(
      riveHandFillProperty,
      expect.anything(),
    );
    expect(runtime.useViewModelInstanceColor).toHaveBeenCalledWith(
      riveHandOutlineProperty,
      expect.anything(),
    );
    expect(runtime.useStateMachineInput).toHaveBeenCalledWith(
      expect.anything(),
      riveHandStateMachine,
      riveHandBooleanInput,
    );
    expect(readRiveHandFillRgb()).toEqual({ r: 255, g: 255, b: 255 });
    expect(riveHandOutlineToken).toBe("--color-brand");
    expect(riveHandOutlineFallback).toEqual({ r: 1, g: 18, b: 114 });
    expect(readRiveHandOutlineRgb()).toEqual({ r: 1, g: 18, b: 114 });
    document.documentElement.style.removeProperty("--color-brand");
    expect(readRiveHandOutlineRgb()).toEqual(riveHandOutlineFallback);
    expect(runtime.rgb).toHaveBeenCalledWith(255, 255, 255);
    expect(runtime.rgb).toHaveBeenCalledWith(1, 18, 114);
    expect(runtime.setRgb).toHaveBeenCalledWith(255, 255, 255);
    expect(runtime.setRgb).toHaveBeenCalledWith(1, 18, 114);
    expect(runtime.input.value).toBe(true);
    const box = container.querySelector("div");
    expect(box?.shadowRoot?.querySelector("canvas")).not.toBeNull();
    expect(box?.getAttribute("aria-hidden")).toBe("true");
    expect(box?.className).toContain("pointer-events-none");
    expect(box?.className).toContain("absolute");
    expect(box?.style.width).toBe("1.35em");
    expect(box?.style.height).toBe("1.35em");
    root.unmount();
  });

  it("pauses on the first frame and does not play the interaction when motion is reduced", async () => {
    stubMotion(true);
    vi.useFakeTimers();
    await render(createElement(RiveHand, { hand: "rock", size: 48, active: true, idle: true }));

    expect(runtime.useRive.mock.calls.at(-1)?.[0].artboard).toBe("29_Rock");
    expect(runtime.pause).toHaveBeenCalled();
    expect(runtime.drawFrame).toHaveBeenCalled();
    expect(runtime.input.value).toBe(false);
    await act(async () => {
      vi.advanceTimersByTime(riveHandIdleMaxMs + riveHandIdleHoldMs);
    });
    expect(runtime.input.value).toBe(false);
    expect(container.querySelector("div")?.style.width).toBe("48px");
    root.unmount();
    vi.useRealTimers();
  });
});

function installIntersectingObserver() {
  class ImmediateObserver {
    private readonly callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe() {
      this.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  vi.stubGlobal("IntersectionObserver", ImmediateObserver);
}

describe("rive hand idle schedule", () => {
  it("spreads delays across 4–9s and keeps the point hand inside the stagger window", () => {
    expect(nextRiveHandIdleDelayMs(0)).toBe(riveHandIdleMinMs);
    expect(nextRiveHandIdleDelayMs(1)).toBe(riveHandIdleMaxMs);
    expect(nextRiveHandIdleDelayMs(0.5)).toBe(6500);
    expect(nextRiveHandIdleDelayMs(0)).not.toBe(nextRiveHandIdleDelayMs(1));
    expect(riveHandGrowDelaySec).toBeGreaterThanOrEqual(0.15);
    expect(riveHandGrowDelaySec).toBeLessThanOrEqual(0.25);
    expect(riveHandIdleAllowed({ idle: true, reduced: false, pageVisible: true, inView: true })).toBe(true);
    expect(riveHandIdleAllowed({ idle: true, reduced: true, pageVisible: true, inView: true })).toBe(false);
    expect(riveHandIdleAllowed({ idle: true, reduced: false, pageVisible: false, inView: true })).toBe(false);
    expect(riveHandIdleAllowed({ idle: true, reduced: false, pageVisible: true, inView: false })).toBe(false);
    expect(riveHandIdleAllowed({ idle: false, reduced: false, pageVisible: true, inView: true })).toBe(false);
    expect(riveHandBooleanValue(true, false, false)).toBe(true);
    expect(riveHandBooleanValue(false, true, false)).toBe(true);
    expect(riveHandBooleanValue(true, true, true)).toBe(false);
  });

  describe("timers", () => {
    let root: Root;
    let container: HTMLDivElement;
    let visibility: DocumentVisibilityState;

    beforeEach(() => {
      runtime.input.value = false;
      stubMotion(false);
      installIntersectingObserver();
      vi.spyOn(Math, "random").mockReturnValue(0);
      vi.useFakeTimers();
      visibility = "visible";
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => visibility,
      });
      container = document.createElement("div");
      document.body.appendChild(container);
      root = createRoot(container);
    });

    afterEach(() => {
      root.unmount();
      vi.useRealTimers();
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    async function render(node: ReactNode) {
      await act(async () => {
        root.render(node);
      });
    }

    it("pulses Boolean 1 after the rolled delay, holds, then arms the next gap", async () => {
      await render(createElement(RiveHand, { hand: "point", size: 48, idle: true }));
      expect(runtime.input.value).toBe(false);

      await act(async () => {
        vi.advanceTimersByTime(riveHandIdleMinMs - 1);
      });
      expect(runtime.input.value).toBe(false);

      await act(async () => {
        vi.advanceTimersByTime(1);
      });
      expect(runtime.input.value).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(riveHandIdleHoldMs);
      });
      expect(runtime.input.value).toBe(false);

      await act(async () => {
        vi.advanceTimersByTime(riveHandIdleMinMs);
      });
      expect(runtime.input.value).toBe(true);
    });

    it("does not pulse while the tab is hidden, and resumes with a fresh delay", async () => {
      await render(createElement(RiveHand, { hand: "rock", size: 48 }));
      visibility = "hidden";
      await act(async () => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await act(async () => {
        vi.advanceTimersByTime(riveHandIdleMaxMs);
      });
      expect(runtime.input.value).toBe(false);

      visibility = "visible";
      await act(async () => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await act(async () => {
        vi.advanceTimersByTime(riveHandIdleMinMs);
      });
      expect(runtime.input.value).toBe(true);
    });

    it("does not pulse after unmount", async () => {
      await render(createElement(RiveHand, { hand: "point", size: 48, idle: true }));
      root.unmount();
      await act(async () => {
        vi.advanceTimersByTime(riveHandIdleMinMs + riveHandIdleHoldMs);
      });
      expect(runtime.input.value).toBe(false);
    });
  });
});

describe("marketing hero show code", () => {
  const source = readFileSync(
    join(process.cwd(), "src/components/organisms/HeroTileStack/HeroTileStack.stories.tsx"),
    "utf8",
  );

  it("keeps the default marketing hero render and show code aligned", () => {
    const copyStart = source.indexOf("const marketingHeroCopySource = `");
    const copyEnd = source.indexOf("`.trim();", copyStart);
    const raw = source.slice(copyStart, copyEnd);
    const copy = raw.slice(raw.indexOf("`") + 1).trim().replaceAll("tiles={tiles}", "tiles={heroTiles}");
    const liveStart = source.indexOf("\nfunction MarketingHero()");
    const liveEnd = source.indexOf("export const MarketingHeroPattern");
    const live = source.slice(liveStart, liveEnd);
    expect(copy.startsWith('"use client";')).toBe(true);
    expect(copy).toContain("npm install @rive-app/react-canvas");
    expect(copy).toContain("/rive/interactive-icon-set.riv");
    expect(copy).toContain('className="type-display-1 isolate text-fg"');
    expect(live).toContain('className="type-display-1 isolate text-fg"');
    expect(copy).toContain('hand="rock"');
    expect(copy).toContain('hand="point"');
    expect(live).toContain(copy.slice(copy.indexOf("<h1"), copy.indexOf("</h1>") + "</h1>".length));
    expect(source).not.toContain("MarketingHeroWithHands");
  });
});
