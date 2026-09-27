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
  scrollHorizontalCompactBreakpoint,
  scrollHorizontalDefaultColors,
  scrollHorizontalDistance,
  scrollHorizontalGap,
  scrollHorizontalGapCompact,
  scrollHorizontalItemColor,
  scrollHorizontalItemWidth,
  scrollHorizontalItemWidthCompact,
  scrollHorizontalNominalMetrics,
  scrollHorizontalParseGap,
  scrollHorizontalReadMetrics,
  scrollHorizontalShell,
  scrollHorizontalTranslateX,
} from "./scrollHorizontalMath";
import {
  scrollHorizontalItemClasses,
  scrollHorizontalRootClasses,
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

describe("ScrollHorizontal reduced-motion branch", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("hydrates on the motion shell before the OS query", async () => {
    const restore = installMatchMedia(false);
    const view = await renderGallery(createElement(ScrollHorizontal, { items }));
    const section = view.container.querySelector("[data-scroll-horizontal]");
    expect(section?.getAttribute("data-reduce")).toBe("false");
    expect(view.container.querySelectorAll("li")).toHaveLength(3);
    expect(view.container.querySelector("img")).toBeNull();
    expect(view.container.querySelector("h3")).toBeNull();
    expect(view.container.querySelector(".sr-only")?.textContent).toBe("Project One");
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
});
