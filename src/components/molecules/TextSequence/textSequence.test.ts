/** @vitest-environment happy-dom */
import { createElement, useRef, type ReactNode } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import gsap from "gsap";
import { describe, expect, it, vi } from "vitest";
import { riveHandEnteredAttr, riveHandSequenceOrigin } from "../../atoms/RiveHand/riveHandUtils";
import { TextSequence, sequencePlainText, textSequenceDefaultStagger } from "./TextSequence";
import { textSequenceWordBoldClasses, textSequenceWordRegularClasses } from "./textSequenceStyles";
import { textSequenceShapeVariants } from "../../atoms/TextSequenceShape/TextSequenceShape";
import {
  textSequenceShapeGraphicClasses,
  textSequenceShapeSizeClasses,
} from "../../atoms/TextSequenceShape/textSequenceShapeStyles";

const sentence = "Your brand is already online";

function line(children: ReactNode) {
  return createElement(TextSequence, { idle: false, trigger: "mount", children });
}

function reducedMatchMedia(query: string): MediaQueryList {
  const reduced = query.includes("prefers-reduced-motion");
  return {
    matches: reduced,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  };
}

describe("sequencePlainText", () => {
  it("joins words and skips shapes", () => {
    const plain = sequencePlainText([
      "Your brand ",
      createElement(TextSequence.Shape, { variant: "asterisk" }),
      " is already online",
    ]);
    expect(plain).toBe("Your brand is already online");
  });

  it("keeps a nowrap phrase together and still counts both words", () => {
    const plain = sequencePlainText([
      "We're a design and product studio based in ",
      createElement("span", { className: "whitespace-nowrap" }, "Austin,\u00A0Texas."),
    ]);
    expect(plain).toBe("We're a design and product studio based in Austin, Texas.");
    const html = renderToStaticMarkup(
      createElement(
        TextSequence,
        { emphasis: "none", idle: false },
        "We're a design and product studio based in ",
        createElement("span", { className: "whitespace-nowrap" }, "Austin,\u00A0Texas."),
      ),
    );
    expect(html).toContain('class="whitespace-nowrap"');
    expect(html).toContain("Austin,</span>\u00A0<span");
    expect(html).toContain("Texas.");
    expect(html).toContain(
      'data-plain="We&#x27;re a design and product studio based in Austin, Texas."',
    );
    expect(html.match(/data-text-sequence-word=/g)).toHaveLength(10);
  });
});

describe("TextSequence server markup", () => {
  it("renders the full sentence and hides shapes, with no mask", () => {
    const html = renderToStaticMarkup(
      createElement(
        TextSequence,
        null,
        "Your brand ",
        createElement(TextSequence.Shape, { variant: "asterisk" }),
        " is already ",
        createElement(TextSequence.Shape, { variant: "circle", tone: "accent" }),
        " online",
      ),
    );
    expect(html).toContain("Your");
    expect(html).toContain("brand");
    expect(html).toContain("already");
    expect(html).toContain("online");
    expect(html).toContain('data-plain="Your brand is already online"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("overflow");
    expect(html).not.toContain("aria-label");
    expect(html).toContain(textSequenceWordRegularClasses);
    expect(html).toContain(textSequenceWordBoldClasses);
  });
});

describe("TextSequence inside a heading", () => {
  it("keeps the heading role and names it with the plain sentence", async () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          },
        }) as MediaQueryList,
    );
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        createElement(
          "h2",
          null,
          createElement(TextSequence, { trigger: "mount", emphasis: "none", children: "Placeholder statement" }),
        ),
      );
    });
    const heading = container.querySelector("h2");
    expect(heading?.getAttribute("role")).toBeNull();
    expect(heading?.tagName).toBe("H2");
    expect(heading?.getAttribute("aria-label")).toBe("Placeholder statement");
    expect(heading?.querySelector("[data-text-sequence]")?.getAttribute("role")).toBeNull();
    expect(heading?.querySelector("[data-text-sequence]")?.getAttribute("aria-label")).toBeNull();
    root.unmount();
    container.remove();
    vi.unstubAllGlobals();
  });
});

describe("TextSequence reduced motion", () => {
  it("stays at rest with hidden shapes and the full sentence", async () => {
    vi.stubGlobal("matchMedia", reducedMatchMedia);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        line([
          "Your brand ",
          createElement(TextSequence.Shape, { variant: "pill", tone: "brand-soft" }),
          " is already online",
        ]),
      );
    });

    const sequence = container.querySelector("[data-text-sequence]");
    expect(sequence?.getAttribute("data-text-sequence-state")).toBe("rest");
    expect(sequence?.getAttribute("aria-label")).toBeNull();
    expect(sequence?.textContent?.replace(/\s+/g, " ").trim()).toContain(sentence);
    const shapes = container.querySelectorAll("[data-text-sequence-shape]");
    expect(shapes.length).toBe(1);
    expect(shapes[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("[style*='overflow']")).toBeNull();
    const word = container.querySelector("[data-text-sequence-word]");
    expect(word).not.toBeNull();

    root.unmount();
    container.remove();
    vi.unstubAllGlobals();
  });
});

describe("TextSequence shapes", () => {
  it("renders every variant aria-hidden", () => {
    const html = renderToStaticMarkup(
      createElement(TextSequence, {
        emphasis: "none",
        children: textSequenceShapeVariants.map((variant) =>
          createElement(TextSequence.Shape, { key: variant, variant }),
        ),
      }),
    );
    for (const variant of textSequenceShapeVariants) {
      expect(html).toContain(`data-variant="${variant}"`);
    }
    expect(html.match(/aria-hidden="true"/g)?.length).toBe(textSequenceShapeVariants.length);
    expect(html).toContain("min-w-[14px]");
    expect(html).toContain("var(--color-brand)");
    for (const variant of textSequenceShapeVariants) {
      expect(textSequenceShapeSizeClasses[variant]).toMatch(/min-w-\[(?:14|28)px\]/);
      expect(textSequenceShapeGraphicClasses[variant]).toContain("min-h-[14px]");
    }
    expect(textSequenceShapeSizeClasses.pill).toContain("w-[2.2em]");
    expect(textSequenceShapeSizeClasses["double-pill"]).toContain("w-[2.35em]");
    expect(textSequenceShapeGraphicClasses.asterisk).toContain("h-[1.15em]");
    expect(textSequenceShapeGraphicClasses.dots).toContain("h-[1.2em]");
  });

  it("paints brand-soft as a token gradient", () => {
    const html = renderToStaticMarkup(
      createElement(TextSequence.Shape, { variant: "pill", tone: "brand-soft" }),
    );
    expect(html).toContain("linearGradient");
    expect(html).toContain("var(--color-brand)");
    expect(html).toContain("var(--color-brand-soft)");
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });
});

function HandSlot({ hand }: { hand: "rock" | "point" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  return createElement(
    "span",
    {
      "data-rive-hand-slot": hand,
      style: { display: "inline-block", position: "relative", width: "24px", height: "0px" },
    },
    createElement(
      "span",
      { "data-rive-hand-pop": "" },
      createElement("canvas", { ref, "data-rive-hand": hand, width: 73, height: 73 }),
    ),
  );
}

function RockSlot() {
  return createElement(HandSlot, { hand: "rock" });
}

describe("TextSequence hand slot", () => {
  it("keeps the rock canvas connected after the words split", async () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          },
        }) as MediaQueryList,
    );
    const container = document.createElement("div");
    container.style.fontSize = "32px";
    container.style.width = "720px";
    document.body.appendChild(container);
    const root = createRoot(container);
    let live: HTMLCanvasElement | null = null;
    await act(async () => {
      root.render(
        createElement(
          TextSequence,
          { trigger: "mount", emphasis: "none", idle: false, lines: true },
          "Your brand ",
          createElement(RockSlot),
          " is already online",
        ),
      );
    });
    live = container.querySelector("canvas");
    expect(live).toBeInstanceOf(HTMLCanvasElement);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    const slot = container.querySelector("[data-rive-hand-slot='rock']");
    const canvas = slot?.querySelector("canvas");
    expect(slot?.isConnected).toBe(true);
    expect(live?.isConnected).toBe(true);
    expect(canvas).toBe(live);
    expect(slot?.previousSibling?.nodeType).toBe(Node.TEXT_NODE);
    expect(slot?.previousSibling?.textContent ?? "").toMatch(/\s/);
    expect(slot?.nextSibling?.nodeType).toBe(Node.TEXT_NODE);
    expect(slot?.nextSibling?.textContent ?? "").toMatch(/\s/);
    root.unmount();
    container.remove();
    vi.unstubAllGlobals();
  });

  it("pops a hand slot with the shape entrance on the beat after the previous word", async () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          },
        }) as MediaQueryList,
    );
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        createElement(
          TextSequence,
          { trigger: "mount", emphasis: "none", idle: false, lines: true },
          "Your brand ",
          createElement(RockSlot),
          " is already ",
          createElement(TextSequence.Shape, { variant: "circle" }),
          " online",
        ),
      );
    });
    const slot = container.querySelector<HTMLElement>("[data-rive-hand-slot='rock']");
    const pop = slot?.querySelector<HTMLElement>("[data-rive-hand-pop]");
    const circle = container.querySelector<HTMLElement>("[data-text-sequence-shape]");
    expect(slot).toBeTruthy();
    expect(pop).toBeTruthy();
    expect(circle).toBeTruthy();
    const handTween = pop ? gsap.getTweensOf(pop)[0] : undefined;
    const shapeTween = circle ? gsap.getTweensOf(circle)[0] : undefined;
    expect(handTween).toBeTruthy();
    expect(shapeTween).toBeTruthy();
    expect(handTween?.vars.scale).toBe(0);
    expect(handTween?.vars.rotation).toBe(-16);
    expect(handTween?.vars.duration).toBe(shapeTween?.vars.duration);
    expect(handTween?.vars.ease).toBe(shapeTween?.vars.ease);
    expect(handTween?.vars.opacity).toBeUndefined();
    expect(shapeTween?.vars.opacity).toBeUndefined();
    expect(handTween?.vars.transformOrigin).toBe(riveHandSequenceOrigin);
    expect(Number(gsap.getProperty(pop!, "scale"))).toBe(0);
    expect(handTween?.startTime()).toBeCloseTo((2 - 0.5) * textSequenceDefaultStagger, 5);
    expect(slot?.getAttribute(riveHandEnteredAttr)).toBeNull();
    await act(async () => {
      handTween?.progress(1);
    });
    expect(slot?.getAttribute(riveHandEnteredAttr)).toBe("true");
    root.unmount();
    container.remove();
    vi.unstubAllGlobals();
  });

  it("pops the point hand on the beat after impression", async () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          },
        }) as MediaQueryList,
    );
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        createElement(
          TextSequence,
          { trigger: "mount", emphasis: "none", idle: false, lines: true },
          "Every screen ",
          createElement(TextSequence.Shape, { variant: "asterisk" }),
          " is a first impression ",
          createElement(HandSlot, { hand: "point" }),
          " and we make yours",
        ),
      );
    });
    const slot = container.querySelector<HTMLElement>("[data-rive-hand-slot='point']");
    const pop = slot?.querySelector<HTMLElement>("[data-rive-hand-pop]");
    const handTween = pop ? gsap.getTweensOf(pop)[0] : undefined;
    expect(handTween?.vars.scale).toBe(0);
    expect(handTween?.vars.rotation).toBe(-16);
    expect(handTween?.startTime()).toBeCloseTo((6 - 0.5) * textSequenceDefaultStagger, 5);
    root.unmount();
    container.remove();
    vi.unstubAllGlobals();
  });

  it("leaves a hand slot at rest when motion is reduced", async () => {
    vi.stubGlobal("matchMedia", reducedMatchMedia);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        createElement(
          TextSequence,
          { trigger: "mount", emphasis: "none", idle: false, lines: true },
          "Your brand ",
          createElement(RockSlot),
          " is already online",
        ),
      );
    });
    const slot = container.querySelector<HTMLElement>("[data-rive-hand-slot='rock']");
    const pop = slot?.querySelector<HTMLElement>("[data-rive-hand-pop]");
    expect(slot?.getAttribute(riveHandEnteredAttr)).toBeNull();
    expect(pop?.style.transform ?? "").not.toContain("scale");
    expect(gsap.getTweensOf(pop!)).toHaveLength(0);
    root.unmount();
    container.remove();
    vi.unstubAllGlobals();
  });
});

describe("marketing hero text sequence story", () => {
  it("keeps the default hero copy and adds the sequence variant", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/organisms/HeroTileStack/HeroTileStack.stories.tsx"),
      "utf8",
    );
    const patternEnd = source.indexOf("export const MarketingHeroPattern");
    const variantStart = source.indexOf("function MarketingHeroTextSequenceView");
    const variantEnd = source.indexOf("function expectSequenceInsideViewport", variantStart);
    expect(patternEnd).toBeGreaterThan(-1);
    expect(variantStart).toBeGreaterThan(patternEnd);
    expect(variantEnd).toBeGreaterThan(variantStart);
    const pattern = source.slice(0, variantStart);
    const variant = source.slice(variantStart, variantEnd);
    expect(pattern).toContain('lead="We\'re a design and product studio based in Austin,\u00A0Texas."');
    expect(variant).toContain('{"We\'re a design and product studio based in "}');
    expect(variant).toContain("Austin,&nbsp;Texas.");
    expect(variant).toContain('className="whitespace-nowrap"');
    expect(variant).toContain("delay={0.7}");
    expect(variant).toContain("delay={1.05}");
    expect(variant.indexOf("Austin,&nbsp;Texas.")).toBeLessThan(variant.indexOf("Your brand"));
    expect(variant).toContain("Your brand");
    expect(variant).toContain("is already");
    expect(variant).toContain("online");
    expect(variant).toContain("Make it");
    expect(variant).toContain("impossible to ignore");
    expect(variant).not.toContain('variant="asterisk"');
    expect(variant).toContain('variant="pill"');
    expect(variant).toContain('variant="circle"');
    expect(variant).not.toContain("<Badge");
    expect(variant).toContain('hand="rock"');
    expect(variant).toContain("inline");
    expect(variant).not.toContain("We Are WhatMatters");
  });
});
