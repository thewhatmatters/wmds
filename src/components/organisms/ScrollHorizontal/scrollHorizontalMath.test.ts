/** @vitest-environment happy-dom */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScrollHorizontal } from "./ScrollHorizontal";
import { scrollHorizontalMarketingItems } from "./scrollHorizontalExamples";
import {
  scrollHorizontalClipFillsViewport,
  scrollHorizontalCompactBreakpoint,
  scrollHorizontalDefaultColors,
  scrollHorizontalDistance,
  scrollHorizontalExpandAmount,
  scrollHorizontalExpandClip,
  scrollHorizontalExpandClipRect,
  scrollHorizontalExpandViewports,
  scrollHorizontalExpandedOpacity,
  scrollHorizontalGap,
  scrollHorizontalGapCompact,
  scrollHorizontalHorizontalEnd,
  scrollHorizontalHorizontalViewports,
  scrollHorizontalItemColor,
  scrollHorizontalItemHeight,
  scrollHorizontalItemHeightCompact,
  scrollHorizontalItemWidth,
  scrollHorizontalItemWidthCompact,
  scrollHorizontalNominalExpandMetrics,
  scrollHorizontalNominalMetrics,
  scrollHorizontalParseGap,
  scrollHorizontalPeerOpacity,
  scrollHorizontalPhaseProgress,
  scrollHorizontalReadFrame,
  scrollHorizontalReadMetrics,
  scrollHorizontalReadTranslateX,
  scrollHorizontalShell,
  scrollHorizontalTrack,
  scrollHorizontalTranslateX,
  type ScrollHorizontalExpandMetrics,
} from "./scrollHorizontalMath";
import {
  scrollHorizontalExpandedSectionClasses,
  scrollHorizontalExpandLayerClasses,
  scrollHorizontalHeadingClasses,
  scrollHorizontalItemClasses,
  scrollHorizontalRootClasses,
  scrollHorizontalRootExpandClasses,
  scrollHorizontalRowClasses,
  scrollHorizontalStickyClasses,
  scrollHorizontalWindowClasses,
} from "./scrollHorizontalStyles";

const items = scrollHorizontalMarketingItems.slice(0, 3);

function installMatchMedia(reduced: boolean) {
  const previous = window.matchMedia.bind(window);
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  return () => {
    window.matchMedia = previous;
  };
}

async function renderGallery(node: ReturnType<typeof createElement>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(node);
  });
  return {
    container,
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe("scrollHorizontalDistance", () => {
  it("travels one card-pitch per step between the first and last item", () => {
    expect(scrollHorizontalDistance(5, scrollHorizontalItemWidth, scrollHorizontalGap)).toBe(
      4 * (400 + 32),
    );
    expect(scrollHorizontalDistance(5, scrollHorizontalItemWidthCompact, scrollHorizontalGapCompact)).toBe(
      4 * (280 + 16),
    );
    expect(scrollHorizontalDistance(2, 400, 32)).toBe(432);
  });

  it("stays at 0 when there is no second card or the pitch is unusable", () => {
    expect(scrollHorizontalDistance(0, 400, 32)).toBe(0);
    expect(scrollHorizontalDistance(1, 400, 32)).toBe(0);
    expect(scrollHorizontalDistance(5, 0, 32)).toBe(0);
    expect(scrollHorizontalDistance(5, 400, -1)).toBe(0);
    expect(scrollHorizontalDistance(Number.NaN, 400, 32)).toBe(0);
  });
});

describe("scrollHorizontalTranslateX", () => {
  it("maps progress 0 to 1 onto 0 to -distance", () => {
    expect(scrollHorizontalTranslateX(0, 1728, false)).toBe(0);
    expect(scrollHorizontalTranslateX(0.5, 1728, false)).toBe(-864);
    expect(scrollHorizontalTranslateX(1, 1728, false)).toBe(-1728);
    expect(scrollHorizontalTranslateX(2, 1728, false)).toBe(-1728);
    expect(scrollHorizontalTranslateX(-1, 1728, false)).toBe(0);
  });

  it("returns 0 on the reduced-motion branch", () => {
    expect(scrollHorizontalTranslateX(0, 1728, true)).toBe(0);
    expect(scrollHorizontalTranslateX(0.5, 1728, true)).toBe(0);
    expect(scrollHorizontalTranslateX(1, 1728, true)).toBe(0);
  });
});

describe("scrollHorizontalShell", () => {
  it("describes the sticky track when motion is allowed", () => {
    expect(scrollHorizontalShell(false)).toEqual({
      containerHeight: "300svh",
      sticky: true,
      overflowX: "clip",
      translate: true,
    });
    expect(scrollHorizontalShell(false, true)).toEqual({
      containerHeight: "400svh",
      sticky: true,
      overflowX: "clip",
      translate: true,
    });
    expect(scrollHorizontalTrack(false)).toBe("300svh");
    expect(scrollHorizontalTrack(true)).toBe("400svh");
    expect(scrollHorizontalHorizontalEnd(false)).toBe(1);
    expect(scrollHorizontalHorizontalEnd(true)).toBe(
      scrollHorizontalHorizontalViewports /
        (scrollHorizontalHorizontalViewports + scrollHorizontalExpandViewports),
    );
    expect(scrollHorizontalRootExpandClasses).toContain("h-[400svh]");
    expect(scrollHorizontalRootExpandClasses).toContain("shrink-0");
    expect(scrollHorizontalRootExpandClasses).toContain("motion-reduce:!h-auto");
    expect(scrollHorizontalExpandLayerClasses).toContain("inset-0");
    expect(scrollHorizontalExpandLayerClasses).toContain("will-change-[clip-path]");
    expect(scrollHorizontalExpandLayerClasses).toContain("motion-reduce:!hidden");
    expect(scrollHorizontalExpandedSectionClasses).toContain("h-svh");
    expect(scrollHorizontalExpandedSectionClasses).toContain("rounded-none");
    expect(scrollHorizontalExpandedSectionClasses).toContain("hidden");
    expect(scrollHorizontalExpandedSectionClasses).toContain("motion-reduce:!block");
  });

  it("describes the native scroller when motion is reduced", () => {
    expect(scrollHorizontalShell(true)).toEqual({
      containerHeight: "auto",
      sticky: false,
      overflowX: "auto",
      translate: false,
    });
    expect(scrollHorizontalRootClasses).toContain("h-[300svh]");
    expect(scrollHorizontalRootClasses).toContain("shrink-0");
    expect(scrollHorizontalRootClasses).toContain("motion-reduce:!h-auto");
    expect(scrollHorizontalRootClasses).toContain("data-[reduce=true]:!h-auto");
    expect(scrollHorizontalStickyClasses).toContain("sticky");
    expect(scrollHorizontalStickyClasses).toContain("h-svh");
    expect(scrollHorizontalStickyClasses).toContain("overflow-x-clip");
    expect(scrollHorizontalStickyClasses).toContain("motion-reduce:!relative");
    expect(scrollHorizontalStickyClasses).toContain("motion-reduce:!h-auto");
    expect(scrollHorizontalStickyClasses).toContain("motion-reduce:py-12");
    expect(scrollHorizontalStickyClasses).not.toContain("motion-reduce:sticky");
    expect(scrollHorizontalWindowClasses).toContain("w-[400px]");
    expect(scrollHorizontalWindowClasses).toContain("max-sm:w-[280px]");
    expect(scrollHorizontalWindowClasses).toContain("motion-reduce:overflow-x-auto");
    expect(scrollHorizontalWindowClasses).toContain("motion-reduce:scroll-fade-x");
    expect(scrollHorizontalRowClasses).toContain("gap-8");
    expect(scrollHorizontalRowClasses).toContain("max-sm:gap-4");
    expect(scrollHorizontalRowClasses).toContain("motion-reduce:!transform-none");
    expect(scrollHorizontalItemClasses).toContain("h-[500px]");
    expect(scrollHorizontalItemClasses).toContain("w-[400px]");
    expect(scrollHorizontalItemClasses).toContain("max-sm:h-[350px]");
    expect(scrollHorizontalItemClasses).toContain("max-sm:w-[280px]");
    expect(scrollHorizontalItemClasses).toContain("rounded-xl");
  });
});

describe("scrollHorizontalNominalMetrics", () => {
  it("uses the compact pitch below sm and the desktop pitch from sm", () => {
    expect(scrollHorizontalNominalMetrics(390)).toEqual({ itemWidth: 280, gap: 16 });
    expect(scrollHorizontalNominalMetrics(600)).toEqual({ itemWidth: 280, gap: 16 });
    expect(scrollHorizontalNominalMetrics(scrollHorizontalCompactBreakpoint - 1)).toEqual({
      itemWidth: 280,
      gap: 16,
    });
    expect(scrollHorizontalNominalMetrics(scrollHorizontalCompactBreakpoint)).toEqual({
      itemWidth: 400,
      gap: 32,
    });
    expect(scrollHorizontalNominalMetrics(1440)).toEqual({ itemWidth: 400, gap: 32 });
    expect(scrollHorizontalDistance(5, 400, 32)).toBe(
      scrollHorizontalDistance(
        5,
        scrollHorizontalNominalMetrics(1440).itemWidth,
        scrollHorizontalNominalMetrics(1440).gap,
      ),
    );
  });
});

describe("scrollHorizontalReadMetrics", () => {
  it("reads item width and column gap from the DOM", () => {
    const item = document.createElement("div");
    const row = document.createElement("div");
    item.getBoundingClientRect = () =>
      ({
        width: 280,
        height: 350,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 280,
        bottom: 350,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    const previous = window.getComputedStyle.bind(window);
    window.getComputedStyle = (() => ({ columnGap: "16px" })) as typeof window.getComputedStyle;
    expect(scrollHorizontalReadMetrics(item, row)).toEqual({ itemWidth: 280, gap: 16 });
    window.getComputedStyle = previous;
  });

  it("parses a missing gap as 0", () => {
    expect(scrollHorizontalParseGap("normal")).toBe(0);
    expect(scrollHorizontalParseGap("32px")).toBe(32);
  });
});

describe("scrollHorizontal item chrome", () => {
  it("falls back to the placeholder token cycle", () => {
    expect(scrollHorizontalItemColor(undefined, 0)).toBe("var(--color-brand)");
    expect(scrollHorizontalItemColor("  ", 1)).toBe(scrollHorizontalDefaultColors[1]);
    expect(scrollHorizontalItemColor("var(--color-primary)", 0)).toBe("var(--color-primary)");
    expect(scrollHorizontalItemColor(undefined, 5)).toBe(scrollHorizontalDefaultColors[0]);
    expect(scrollHorizontalDefaultColors).toEqual([
      "var(--color-brand)",
      "var(--color-brand-soft)",
      "var(--color-primary)",
      "var(--color-info-muted)",
      "var(--color-accent)",
    ]);
  });

  it("renders the marketing gallery as solid labeled placeholders", () => {
    expect(scrollHorizontalMarketingItems.map((item) => item.color)).toEqual([
      ...scrollHorizontalDefaultColors,
    ]);
    expect(new Set(scrollHorizontalMarketingItems.map((item) => item.color)).size).toBe(5);
    expect(scrollHorizontalMarketingItems.every((item) => !("image" in item))).toBe(true);
    expect(scrollHorizontalItemClasses).toContain("bg-[var(--scroll-horizontal-color)]");
    expect(scrollHorizontalItemClasses).not.toMatch(/gradient|mix-blend|object-cover/);
  });

  it("keeps pattern show code on the same placeholder items", () => {
    const files = [
      "src/components/organisms/ScrollHorizontal/ScrollHorizontal.stories.tsx",
      "src/components/organisms/HeroTileStack/HeroTileStack.stories.tsx",
      "src/components/organisms/FooterReveal/FooterReveal.stories.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      for (const item of scrollHorizontalMarketingItems) {
        expect(source).toContain(
          `{ id: "${item.id}", label: "${item.label}", color: "${item.color}" }`,
        );
      }
      expect(source).not.toContain("/scroll-horizontal/");
    }
  });
});

describe("scrollHorizontal expandLast", () => {
  const centered = (viewportWidth: number, viewportHeight: number, cardWidth: number, cardHeight: number) =>
    ({
      viewportWidth,
      viewportHeight,
      cardWidth,
      cardHeight,
      cardLeft: (viewportWidth - cardWidth) / 2,
      cardTop: (viewportHeight - cardHeight) / 2,
      pitch: cardWidth + (cardWidth === scrollHorizontalItemWidthCompact ? scrollHorizontalGapCompact : scrollHorizontalGap),
      radius: 12,
    }) satisfies ScrollHorizontalExpandMetrics;

  it("keeps horizontal travel on the first two thirds and grows on the last third", () => {
    const end = scrollHorizontalHorizontalEnd(true);
    expect(end).toBeCloseTo(2 / 3);
    expect(scrollHorizontalPhaseProgress(0, end)).toBe(0);
    expect(scrollHorizontalPhaseProgress(end / 2, end)).toBeCloseTo(0.5);
    expect(scrollHorizontalPhaseProgress(end, end)).toBe(1);
    expect(scrollHorizontalPhaseProgress(1, end)).toBe(1);
    expect(scrollHorizontalExpandAmount(0, end)).toBe(0);
    expect(scrollHorizontalExpandAmount(end, end)).toBe(0);
    expect(scrollHorizontalExpandAmount(end + (1 - end) / 2, end)).toBeCloseTo(0.5);
    expect(scrollHorizontalExpandAmount(1, end)).toBe(1);
    expect(scrollHorizontalExpandAmount(0.5, 1)).toBe(0);
    expect(scrollHorizontalTranslateX(scrollHorizontalPhaseProgress(0.5, 1), 1728, false)).toBe(-864);
    expect(scrollHorizontalPeerOpacity(0)).toBe(1);
    expect(scrollHorizontalPeerOpacity(0.45)).toBe(0);
    expect(scrollHorizontalExpandedOpacity(0)).toBe(0);
    expect(scrollHorizontalExpandedOpacity(1)).toBe(1);
  });

  it("parks the last card on the centered rect, then clips exactly to the viewport", () => {
    const viewports = [
      { viewportWidth: 390, viewportHeight: 844, cardWidth: scrollHorizontalItemWidthCompact, cardHeight: scrollHorizontalItemHeightCompact },
      { viewportWidth: 1440, viewportHeight: 900, cardWidth: scrollHorizontalItemWidth, cardHeight: scrollHorizontalItemHeight },
      { viewportWidth: 1920, viewportHeight: 1080, cardWidth: scrollHorizontalItemWidth, cardHeight: scrollHorizontalItemHeight },
    ];
    for (const viewport of viewports) {
      const metrics = centered(
        viewport.viewportWidth,
        viewport.viewportHeight,
        viewport.cardWidth,
        viewport.cardHeight,
      );
      const parked = scrollHorizontalExpandClipRect(1, 0, metrics, 5);
      expect(parked.left).toBeCloseTo(metrics.cardLeft);
      expect(parked.top).toBeCloseTo(metrics.cardTop);
      expect(parked.radius).toBe(12);
      const filled = scrollHorizontalExpandClipRect(1, 1, metrics, 5);
      expect(scrollHorizontalClipFillsViewport(filled, viewport.viewportWidth, viewport.viewportHeight)).toBe(
        true,
      );
      expect(scrollHorizontalExpandClip(1, 1, metrics, 5)).toBe(
        "inset(0px 0px 0px 0px round 0px)",
      );
    }
  });

  it("fills the viewport from an off-center card without a leftover inset", () => {
    const metrics: ScrollHorizontalExpandMetrics = {
      viewportWidth: 1440,
      viewportHeight: 900,
      cardWidth: 400,
      cardHeight: 500,
      cardLeft: 519.4,
      cardTop: 199.6,
      pitch: 432,
      radius: 12,
    };
    const start = scrollHorizontalExpandClipRect(1, 0, metrics, 5);
    expect(start.left).toBeCloseTo(519.4);
    expect(start.top).toBeCloseTo(199.6);
    const end = scrollHorizontalExpandClipRect(1, 1, metrics, 5);
    expect(end).toEqual({ top: 0, right: 0, bottom: 0, left: 0, radius: 0 });
    expect(scrollHorizontalNominalExpandMetrics(1440, 900).cardLeft).toBe(520);
    expect(scrollHorizontalNominalExpandMetrics(390, 844).cardWidth).toBe(280);
  });

  it("reads a row translate and ignores a Y-only transform", () => {
    expect(scrollHorizontalReadTranslateX("none")).toBe(0);
    expect(scrollHorizontalReadTranslateX("translateY(12px)")).toBe(0);
    expect(scrollHorizontalReadTranslateX("translateX(-1728px)")).toBe(-1728);
    expect(scrollHorizontalReadTranslateX("matrix(1, 0, 0, 1, -40, 0)")).toBe(-40);
  });

  it("removes the row translate when reading the resting card", () => {
    const sticky = document.createElement("div");
    const row = document.createElement("div");
    const item = document.createElement("div");
    sticky.getBoundingClientRect = () =>
      ({ width: 1440, height: 900, left: 0, top: 0, right: 1440, bottom: 900, x: 0, y: 0, toJSON() { return {}; } }) as DOMRect;
    item.getBoundingClientRect = () =>
      ({ width: 400, height: 500, left: 80, top: 200, right: 480, bottom: 700, x: 80, y: 200, toJSON() { return {}; } }) as DOMRect;
    const previous = window.getComputedStyle.bind(window);
    window.getComputedStyle = ((element: Element) => {
      if (element === row) return { transform: "matrix(1, 0, 0, 1, -440, 0)", columnGap: "32px" };
      return { transform: "none", columnGap: "normal", borderTopLeftRadius: "12px" };
    }) as typeof window.getComputedStyle;
    expect(scrollHorizontalReadFrame(sticky, item, row, 1440, 900)).toMatchObject({
      viewportWidth: 1440,
      viewportHeight: 900,
      cardWidth: 400,
      cardHeight: 500,
      cardLeft: 520,
      cardTop: 200,
      pitch: 432,
      radius: 12,
    });
    window.getComputedStyle = previous;
  });
});

describe("ScrollHorizontal reduced-motion branch", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("hydrates on the motion shell before the OS query", async () => {
    const restore = installMatchMedia(false);
    const view = await renderGallery(createElement(ScrollHorizontal, { items }));
    const section = view.container.querySelector("[data-scroll-horizontal]");
    expect(section?.getAttribute("data-reduce")).toBe("false");
    expect(section?.getAttribute("data-expand-last")).toBe("false");
    expect(section?.className).toContain("h-[300svh]");
    expect(section?.querySelector("[data-scroll-horizontal-expanded]")).toBeNull();
    expect(view.container.querySelectorAll("li")).toHaveLength(3);
    expect(view.container.querySelector("img")).toBeNull();
    expect(view.container.querySelector("h3")).toBeNull();
    expect(view.container.querySelector(".sr-only")?.textContent).toBe("Project One");
    expect(scrollHorizontalHeadingClasses.startsWith("sr-only")).toBe(true);
    expect(scrollHorizontalHeadingClasses).toContain("motion-reduce:not-sr-only");
    expect(scrollHorizontalHeadingClasses).not.toContain("top-8");
    const card = view.container.querySelector("li");
    expect(card?.getAttribute("style")).toContain("var(--color-brand)");
    expect(card?.className ?? "").not.toMatch(/gradient|mix-blend/);
    view.unmount();
    restore();
  });

  it("drops the transform when prefers-reduced-motion matches", async () => {
    const restore = installMatchMedia(true);
    const view = await renderGallery(
      createElement(ScrollHorizontal, {
        items,
        heading: createElement("h2", null, "Selected work"),
      }),
    );
    const section = view.container.querySelector("[data-scroll-horizontal]");
    expect(section?.getAttribute("data-reduce")).toBe("true");
    const row = view.container.querySelector("ul");
    expect(row?.getAttribute("style") ?? "").not.toMatch(/translate/i);
    expect(view.container.querySelector("h2")?.textContent).toBe("Selected work");
    const heading = view.container.querySelector("h2")?.parentElement;
    expect(heading?.className).toContain("sr-only");
    expect(heading?.className).toContain("motion-reduce:not-sr-only");
    expect(heading?.className).toContain("group-data-[reduce=true]/scroll-horizontal:not-sr-only");
    expect(section?.getAttribute("aria-labelledby")).toBe(heading?.id);
    view.unmount();
    restore();
  });

  it("keeps the heading sr-only on the motion shell", async () => {
    const restore = installMatchMedia(false);
    const view = await renderGallery(
      createElement(ScrollHorizontal, {
        items,
        heading: createElement("h2", null, "Selected work"),
      }),
    );
    const section = view.container.querySelector("[data-scroll-horizontal]");
    const heading = view.container.querySelector("h2")?.parentElement;
    expect(section?.getAttribute("data-reduce")).toBe("false");
    expect(heading?.className).toContain("sr-only");
    expect(heading?.className).not.toContain("top-8");
    expect(section?.getAttribute("aria-labelledby")).toBe(heading?.id);
    expect(heading?.textContent).toBe("Selected work");
    view.unmount();
    restore();
  });

  it("follows MotionConfig reducedMotion always even when the OS allows motion", async () => {
    const restore = installMatchMedia(false);
    const view = await renderGallery(
      createElement(
        MotionConfig,
        { reducedMotion: "always" },
        createElement(ScrollHorizontal, { items }),
      ),
    );
    expect(view.container.querySelector("[data-scroll-horizontal]")?.getAttribute("data-reduce")).toBe(
      "true",
    );
    expect(view.container.querySelector("ul")?.getAttribute("style") ?? "").not.toMatch(/translate/i);
    view.unmount();
    restore();
  });

  it("marks expandLast on the longer track and keeps the default shell free of that layer", async () => {
    const restore = installMatchMedia(false);
    const view = await renderGallery(
      createElement(ScrollHorizontal, {
        items,
        expandLast: true,
        expanded: createElement("p", null, "Expanded slot"),
      }),
    );
    const section = view.container.querySelector("[data-scroll-horizontal]");
    expect(section?.getAttribute("data-expand-last")).toBe("true");
    expect(section?.className).toContain("h-[400svh]");
    expect(section?.className).not.toContain("h-[300svh]");
    const hosts = section?.querySelectorAll("[data-scroll-horizontal-expanded]") ?? [];
    expect(hosts).toHaveLength(2);
    expect(view.container.textContent).toContain("Expanded slot");
    expect(view.container.querySelector("[data-scroll-horizontal-slot]")?.textContent).toBe(
      "Expanded slot",
    );
    view.unmount();
    restore();
  });

  it("follows expandLast with a static full-viewport section when motion is reduced", async () => {
    const restore = installMatchMedia(true);
    const view = await renderGallery(
      createElement(ScrollHorizontal, {
        items: scrollHorizontalMarketingItems,
        expandLast: true,
        expanded: createElement("p", null, "Reduced slot"),
      }),
    );
    const section = view.container.querySelector("[data-scroll-horizontal]");
    expect(section?.getAttribute("data-reduce")).toBe("true");
    expect(section?.getAttribute("data-expand-last")).toBe("true");
    expect(view.container.querySelector("ul")?.getAttribute("style") ?? "").not.toMatch(/translate/i);
    expect(view.container.querySelectorAll("li")).toHaveLength(scrollHorizontalMarketingItems.length);
    const hosts = [...(section?.querySelectorAll("[data-scroll-horizontal-expanded]") ?? [])];
    const reduced = hosts.find((host) => host.className.includes("h-svh"));
    expect(reduced?.className).toContain("rounded-none");
    expect(reduced?.className).toContain("motion-reduce:!block");
    expect(reduced?.textContent).toContain("Project Five");
    expect(reduced?.textContent).toContain("Reduced slot");
    view.unmount();
    restore();
  });
});
