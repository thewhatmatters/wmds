/** @vitest-environment happy-dom */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cssColorToRgb,
  readRiveGloveHandFillRgb,
  readRiveGloveHandOutlineRgb,
  riveGloveHandArtboards,
  riveGloveHandBooleanInput,
  riveGloveHandBoxSize,
  riveGloveHandFillProperty,
  riveGloveHandOutlineProperty,
  riveGloveHandSrc,
  riveGloveHandStateMachine,
} from "./riveGloveHand";

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
        RiveComponent: () => React.createElement("canvas", { "data-rive-glove": "true" }),
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

import { RiveGloveHand } from "./RiveGloveHand";

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

describe("rive glove hand tokens", () => {
  it("parses hex and rgb colors", () => {
    expect(cssColorToRgb("#262626")).toEqual({ r: 38, g: 38, b: 38 });
    expect(cssColorToRgb("#171717")).toEqual({ r: 23, g: 23, b: 23 });
    expect(cssColorToRgb("rgb(38, 38, 38)")).toEqual({ r: 38, g: 38, b: 38 });
    expect(riveGloveHandBoxSize(24)).toBe("24px");
    expect(riveGloveHandBoxSize("1.35em")).toBe("1.35em");
  });

  it("maps point and rock to the cleaned artboards", () => {
    expect(riveGloveHandArtboards.point).toBe("31_Cigarette");
    expect(riveGloveHandArtboards.rock).toBe("29_Rock");
  });
});

describe("RiveGloveHand", () => {
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
    document.documentElement.style.setProperty("--color-accent", "#262626");
    document.documentElement.style.setProperty("--color-fg", "#171717");
    document.documentElement.style.setProperty("--color-text-primary", "#171717");
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
    await render(createElement(RiveGloveHand, { hand: "point", size: "1.35em", active: true, className: "absolute" }));

    const params = runtime.useRive.mock.calls.at(-1)?.[0];
    expect(params).toMatchObject({
      src: riveGloveHandSrc,
      artboard: "31_Cigarette",
      stateMachines: riveGloveHandStateMachine,
      autoBind: true,
    });
    expect(params.layout.fit).toBe("contain");
    expect(runtime.useViewModelInstanceColor).toHaveBeenCalledWith(
      riveGloveHandFillProperty,
      expect.anything(),
    );
    expect(runtime.useViewModelInstanceColor).toHaveBeenCalledWith(
      riveGloveHandOutlineProperty,
      expect.anything(),
    );
    expect(runtime.useStateMachineInput).toHaveBeenCalledWith(
      expect.anything(),
      riveGloveHandStateMachine,
      riveGloveHandBooleanInput,
    );
    expect(readRiveGloveHandFillRgb()).toEqual({ r: 38, g: 38, b: 38 });
    expect(readRiveGloveHandOutlineRgb()).toEqual({ r: 23, g: 23, b: 23 });
    expect(runtime.rgb).toHaveBeenCalledWith(38, 38, 38);
    expect(runtime.rgb).toHaveBeenCalledWith(23, 23, 23);
    expect(runtime.setRgb).toHaveBeenCalledWith(38, 38, 38);
    expect(runtime.setRgb).toHaveBeenCalledWith(23, 23, 23);
    expect(runtime.input.value).toBe(true);
    expect(container.querySelector("canvas")).not.toBeNull();
    const box = container.querySelector("div");
    expect(box?.getAttribute("aria-hidden")).toBe("true");
    expect(box?.className).toContain("pointer-events-none");
    expect(box?.className).toContain("absolute");
    expect(box?.style.width).toBe("1.35em");
    expect(box?.style.height).toBe("1.35em");
    root.unmount();
  });

  it("pauses on the first frame and does not play the interaction when motion is reduced", async () => {
    stubMotion(true);
    await render(createElement(RiveGloveHand, { hand: "rock", size: 48, active: true }));

    expect(runtime.useRive.mock.calls.at(-1)?.[0].artboard).toBe("29_Rock");
    expect(runtime.pause).toHaveBeenCalled();
    expect(runtime.drawFrame).toHaveBeenCalled();
    expect(runtime.input.value).toBe(false);
    expect(container.querySelector("div")?.style.width).toBe("48px");
    root.unmount();
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
    expect(copy).toContain('className="type-display-1 text-fg"');
    expect(live).toContain('className="type-display-1 text-fg"');
    expect(copy).toContain('hand="rock"');
    expect(copy).toContain('hand="point"');
    expect(live).toContain(copy.slice(copy.indexOf("<h1"), copy.indexOf("</h1>") + "</h1>".length));
    expect(source).not.toContain("MarketingHeroWithHands");
  });
});
