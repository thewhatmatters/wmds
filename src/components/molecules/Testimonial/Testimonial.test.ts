/** @vitest-environment happy-dom */
import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Testimonial, testimonialLongQuoteLength, testimonialQuoteSize, testimonialStars } from "./Testimonial";

describe("Testimonial", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
    root = undefined;
    container = undefined;
  });

  function render(props: ComponentProps<typeof Testimonial>) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(Testimonial, props));
    });
    return container;
  }

  const slot = (view: HTMLElement, name: string) => view.querySelector<HTMLElement>(`[data-slot="${name}"]`);

  it("is a figure: the quote in a blockquote, the person in its figcaption", () => {
    const view = render({ quote: "They fixed it the same day.", name: "Dana Whitfield", detail: "Round Rock" });
    const figure = view.querySelector("figure")!;
    expect(figure.querySelector("blockquote p")!.textContent).toBe("They fixed it the same day.");
    const legend = figure.querySelector("figcaption")!;
    expect(legend.textContent).toBe("Dana WhitfieldRound Rock");
    // No rating, no source: neither is drawn.
    expect(slot(view, "rating")).toBeNull();
    expect(slot(view, "source")).toBeNull();
  });

  it("sets a quote over 200 characters a step smaller, and a fixed size wins", () => {
    const short = "x".repeat(testimonialLongQuoteLength);
    const long = "x".repeat(testimonialLongQuoteLength + 1);
    expect(testimonialQuoteSize(short)).toBe("lg");
    expect(testimonialQuoteSize(long)).toBe("md");
    expect(testimonialQuoteSize(long, "lg")).toBe("lg");
    expect(testimonialQuoteSize(short, "md")).toBe("md");
    // Markup can't be measured, so it keeps the large size unless told otherwise.
    expect(testimonialQuoteSize(createElement("p", null, long))).toBe("lg");

    const view = render({ quote: long, name: "Sam" });
    expect(view.querySelector("figure")!.dataset.size).toBe("md");
    expect(slot(view, "quote")!.className).toContain("type-large");
    act(() => root?.unmount());
    expect(slot(render({ quote: short, name: "Sam" }), "quote")!.className).toContain("type-heading-1");
  });

  it("shows a rating as five stars with one spoken name", () => {
    expect(testimonialStars(4.6)).toBe(5);
    expect(testimonialStars(0)).toBe(1);
    expect(testimonialStars(9)).toBe(5);
    expect(testimonialStars(Number.NaN)).toBeNull();
    expect(testimonialStars(undefined)).toBeNull();

    const view = render({ quote: "Great.", name: "Sam", rating: 4 });
    const stars = slot(view, "rating")!;
    expect(stars.getAttribute("role")).toBe("img");
    expect(stars.getAttribute("aria-label")).toBe("Rated 4 out of 5");
    const glyphs = [...stars.querySelectorAll("svg")];
    expect(glyphs).toHaveLength(5);
    expect(glyphs.every((glyph) => glyph.getAttribute("aria-hidden") === "true")).toBe(true);
    expect(glyphs.map((glyph) => glyph.getAttribute("fill"))).toEqual([
      "currentColor",
      "currentColor",
      "currentColor",
      "currentColor",
      "none",
    ]);
  });

  it("takes a rating name in another language", () => {
    const view = render({ quote: "Muy bien.", name: "Ana", rating: 5, ratingLabel: "5 de 5 estrellas" });
    expect(slot(view, "rating")!.getAttribute("aria-label")).toBe("5 de 5 estrellas");
  });

  it("names the source at the end of the caption", () => {
    const view = render({ quote: "Great.", name: "Sam", detail: "Leander", source: "Google review" });
    const legend = view.querySelector("figcaption")!;
    expect(legend.lastElementChild!.getAttribute("data-slot")).toBe("source");
    expect(legend.lastElementChild!.textContent).toBe("Google review");
  });

  it("sits on a Card: layout classes, data attributes and tone go to the card", () => {
    const view = render({
      quote: "Great.",
      name: "Sam",
      tone: "inverse",
      className: "col-span-2",
      "data-reveal": "rise",
    } as ComponentProps<typeof Testimonial>);
    const card = view.firstElementChild as HTMLElement;
    expect(card.className).toContain("col-span-2");
    expect(card.dataset.reveal).toBe("rise");
    expect(card.dataset.tone).toBe("inverse");
    expect(card.querySelector("figure")!.className).not.toContain("col-span-2");
  });
});
