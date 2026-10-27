/** @vitest-environment happy-dom */
import { act, createElement, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InlinePill, useInlinePillsPopIn } from "./InlinePill";

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function render(node: ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root!.render(node));
  return container;
}

function stubMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduce && query.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
}

/** An IntersectionObserver whose callback the test fires by hand. */
function stubObserver() {
  const observers: { fire: (visible: boolean) => void }[] = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        observers.push({ fire: (visible) => callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as never) });
      }
      observe() {}
      disconnect() {}
    },
  );
  return observers;
}

function Headline({ enabled = true }: { enabled?: boolean }) {
  const popIn = useInlinePillsPopIn<HTMLHeadingElement>(enabled);
  return createElement(
    "h2",
    popIn,
    "We build ",
    createElement(InlinePill, { media: createElement("svg", { "data-icon": "web" }), children: "websites" }),
    ", shoot ",
    createElement(InlinePill, { children: "video" }),
    ".",
  );
}

describe("InlinePill", () => {
  it("renders the word in the sentence and hides the picture from screen readers", () => {
    const html = render(createElement("p", null, "We build ", createElement(InlinePill, { media: createElement("svg"), children: "websites" }), "."));
    const pill = html.querySelector("[data-inline-pill]")!;
    expect(html.querySelector("p")!.textContent).toBe("We build websites.");
    expect(pill.tagName).toBe("SPAN");
    expect(pill.querySelector("[data-inline-pill-media]")!.getAttribute("aria-hidden")).toBe("true");
  });

  it("evens its padding when there's no picture", () => {
    const html = render(createElement(InlinePill, { children: "video" }));
    const pill = html.querySelector("[data-inline-pill]")!;
    expect(pill.querySelector("[data-inline-pill-media]")).toBeNull();
    expect(pill.className).toContain("pl-[0.32em]");
  });
});

describe("useInlinePillsPopIn", () => {
  it("stays still under reduced motion", () => {
    stubMotion(true);
    stubObserver();
    const html = render(createElement(Headline));
    expect(html.querySelector("h2")!.dataset.inlinePills).toBe("still");
  });

  it("stays still when turned off", () => {
    stubMotion(false);
    stubObserver();
    const html = render(createElement(Headline, { enabled: false }));
    expect(html.querySelector("h2")!.dataset.inlinePills).toBe("still");
  });

  it("hides the pictures until in view, then pops each one in once", () => {
    stubMotion(false);
    const observers = stubObserver();
    const animate = vi.fn();
    vi.stubGlobal("__animate", HTMLElement.prototype.animate);
    HTMLElement.prototype.animate = animate as unknown as typeof HTMLElement.prototype.animate;
    const html = render(createElement(Headline));
    const heading = html.querySelector("h2")!;
    expect(heading.dataset.inlinePills).toBe("pending");

    act(() => observers.at(-1)!.fire(false));
    expect(animate).not.toHaveBeenCalled();

    act(() => observers.at(-1)!.fire(true));
    expect(heading.dataset.inlinePills).toBe("done");
    expect(animate).toHaveBeenCalledTimes(1); // one pill has a picture
    const [, options] = animate.mock.calls[0]!;
    expect(options).toMatchObject({ fill: "backwards" });
    HTMLElement.prototype.animate = (globalThis as unknown as { __animate: typeof HTMLElement.prototype.animate }).__animate;
  });
});
