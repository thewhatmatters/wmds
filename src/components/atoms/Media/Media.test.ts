/** @vitest-environment happy-dom */
import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Media, mediaFocusPosition, mediaRatios } from "./Media";
import { mediaRatioClasses } from "./mediaStyles";

describe("Media", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;
  /** happy-dom never loads a picture, so say what the browser would: still loading, or loaded and broken. */
  let imageState: "loading" | "broken" = "loading";

  beforeAll(() => {
    Object.defineProperty(HTMLImageElement.prototype, "complete", { configurable: true, get: () => imageState === "broken" });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", { configurable: true, get: () => 0 });
    Object.defineProperty(HTMLImageElement.prototype, "currentSrc", {
      configurable: true,
      get(this: HTMLImageElement) {
        return this.getAttribute("src") ?? "";
      },
    });
  });

  afterEach(() => {
    imageState = "loading";
    act(() => {
      root?.unmount();
    });
    container?.remove();
    root = undefined;
    container = undefined;
  });

  function render(props: ComponentProps<typeof Media>) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(Media, props));
    });
    return container;
  }

  const frame = (view: HTMLElement) => view.querySelector<HTMLElement>('[data-slot="frame"]')!;

  it("has a literal aspect class for every ratio", () => {
    for (const ratio of mediaRatios) expect(mediaRatioClasses[ratio]).toMatch(/^aspect-/);
  });

  it("server-renders a frame that holds its shape, with a lazy picture inside", () => {
    const html = renderToString(createElement(Media, { src: "/taco.jpg", alt: "Al pastor tacos", ratio: "16/9" }));
    expect(html).toContain("aspect-video");
    expect(html).toContain('alt="Al pastor tacos"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('data-status="image"');
    // No caption, no tag: no figure.
    expect(html).not.toContain("<figure");
  });

  it("crops to the focus: a name or percentages, held to the picture's edges", () => {
    expect(mediaFocusPosition("top")).toBe("50% 0%");
    expect(mediaFocusPosition("bottom-left")).toBe("0% 100%");
    expect(mediaFocusPosition({ x: 30, y: 120 })).toBe("30% 100%");
    expect(mediaFocusPosition({ x: Number.NaN, y: -4 })).toBe("50% 0%");

    const view = render({ src: "/room.jpg", alt: "The dining room", focus: { x: 50, y: 20 } });
    const image = view.querySelector("img")!;
    expect(image.style.objectPosition).toBe("50% 20%");
    expect(image.className).toContain("object-cover");
  });

  it("leaves the crop point alone at the centre, and shows the whole picture with contain", () => {
    const view = render({ src: "/logo.svg", alt: "Logo", fit: "contain" });
    const image = view.querySelector("img")!;
    expect(image.getAttribute("style")).toBeNull();
    expect(image.className).toContain("object-contain");
  });

  it("follows the surface radius knob", () => {
    expect(frame(render({ src: "/a.jpg", alt: "" })).className).toContain("rounded-[var(--radius-surface-sm)]");
    act(() => root?.unmount());
    expect(frame(render({ src: "/a.jpg", alt: "", radius: "lg" })).className).toContain("rounded-[var(--radius-surface)]");
  });

  it("puts the caption and the tag in a figcaption, caption first", () => {
    const view = render({ src: "/a.jpg", alt: "A dish", caption: "From the autumn menu", tag: "Stock photo", className: "col-span-2" });
    const figure = view.querySelector("figure")!;
    expect(figure.className).toContain("col-span-2");
    expect(frame(view).className).not.toContain("col-span-2");
    const legend = figure.querySelector("figcaption")!;
    expect([...legend.children].map((part) => part.getAttribute("data-slot"))).toEqual(["caption", "tag"]);
    expect(legend.textContent).toBe("From the autumn menuStock photo");
  });

  it("shows a tag alone, without an empty caption", () => {
    const view = render({ src: "/a.jpg", alt: "A dish", tag: "Stock photo" });
    const legend = view.querySelector("figcaption")!;
    expect([...legend.children].map((part) => part.getAttribute("data-slot"))).toEqual(["tag"]);
  });

  it("shows the named fallback when there is no picture", () => {
    const view = render({ alt: "The patio in summer" });
    expect(frame(view).dataset.status).toBe("fallback");
    expect(view.querySelector("img")).toBeNull();
    const fallback = view.querySelector('[data-slot="fallback"]')!;
    expect(fallback.getAttribute("role")).toBe("img");
    expect(fallback.getAttribute("aria-label")).toBe("The patio in summer");
    // The frame still holds its shape.
    expect(frame(view).className).toContain("aspect-4/3");
  });

  it("swaps a failed picture for the fallback, and tries again when src changes", () => {
    let failures = 0;
    const view = render({ src: "/gone.jpg", alt: "", onError: () => (failures += 1) });
    act(() => {
      view.querySelector("img")!.dispatchEvent(new Event("error"));
    });
    expect(failures).toBe(1);
    expect(frame(view).dataset.status).toBe("fallback");
    // Decoration stays out of the accessibility tree.
    expect(view.querySelector('[data-slot="fallback"]')!.getAttribute("aria-hidden")).toBe("true");

    act(() => {
      root?.render(createElement(Media, { src: "/next.jpg", alt: "" }));
    });
    expect(frame(view).dataset.status).toBe("image");
    expect(view.querySelector("img")!.getAttribute("src")).toBe("/next.jpg");
  });

  it("shows the fallback for a picture that failed before React attached", () => {
    imageState = "broken";
    const view = render({ src: "/gone.jpg", alt: "The bar" });
    expect(frame(view).dataset.status).toBe("fallback");
    expect(view.querySelector("img")).toBeNull();
  });

  it("renders through another image component", () => {
    const view = render({
      src: "/a.jpg",
      alt: "A dish",
      render: createElement("img", { "data-next": "yes", sizes: "50vw" }),
    });
    const image = view.querySelector("img")!;
    expect(image.getAttribute("data-next")).toBe("yes");
    expect(image.getAttribute("src")).toBe("/a.jpg");
    expect(image.getAttribute("alt")).toBe("A dish");
    expect(image.className).toContain("object-cover");
  });
});
