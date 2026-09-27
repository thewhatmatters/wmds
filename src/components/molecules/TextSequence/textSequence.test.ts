/** @vitest-environment happy-dom */
import { createElement, type ReactNode } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { TextSequence, sequencePlainText } from "./TextSequence";
import { textSequenceWordBoldClasses, textSequenceWordRegularClasses } from "./textSequenceStyles";
import { textSequenceShapeVariants } from "../../atoms/TextSequenceShape/TextSequenceShape";

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
    expect(patternEnd).toBeGreaterThan(-1);
    expect(variantStart).toBeGreaterThan(patternEnd);
    const pattern = source.slice(0, variantStart);
    const variant = source.slice(variantStart);
    expect(pattern).toContain('lead="We\'re a design and product studio based in Austin, Texas."');
    expect(variant).toContain("Your brand");
    expect(variant).toContain("is already");
    expect(variant).toContain("online");
    expect(variant).toContain("Make it");
    expect(variant).toContain("impossible to ignore");
    expect(variant).toContain('TextSequence.Shape variant="asterisk"');
    expect(variant).toContain('variant="pill"');
    expect(variant).toContain('variant="circle"');
    expect(variant).not.toContain("<Badge");
    expect(variant).toContain("We Are");
    expect(variant).toContain("WhatMatters");
  });
});
