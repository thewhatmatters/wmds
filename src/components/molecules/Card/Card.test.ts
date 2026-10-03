/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Card, type CardProps } from "./Card";

describe("Card pinned height with Footer", () => {
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

  it("scrolls Body between Header and Footer when the root height is pinned", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        createElement(
          Card,
          { padding: "none", variant: "surface", className: "h-[280px]" } as CardProps,
          createElement(Card.Header, { start: createElement("h2", null, "Title") }),
          createElement(
            Card.Body,
            null,
            createElement("div", { "data-occupant": "" }, "Long body"),
          ),
          createElement(Card.Footer, null, createElement("button", { type: "button" }, "Next")),
        ),
      );
    });

    const card = container.firstElementChild;
    expect(card?.className).toContain("h-[280px]");
    expect(card?.className).toContain("overflow-hidden");
    expect(card?.className).toContain("min-h-0");

    const header = card?.querySelector(":scope > header");
    const footer = card?.querySelector(":scope > footer");
    const body = [...(card?.children ?? [])].find(
      (el) => el instanceof HTMLElement && el.tagName === "DIV",
    );

    expect(header?.className).toContain("shrink-0");
    expect(footer?.className).toContain("shrink-0");
    expect(body?.className).toContain("px-[2px]");
    expect(body?.className).toContain("flex-1");
    expect(body?.className).toContain("overflow-y-auto");
    expect(body?.className).not.toContain("[&>*]:flex-1");
  });

  it("keeps terminal Body fill when Footer is omitted", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        createElement(
          Card,
          { padding: "none", variant: "surface", className: "h-[280px]" } as CardProps,
          createElement(Card.Header, { start: createElement("h2", null, "Title") }),
          createElement(
            Card.Body,
            null,
            createElement("div", { "data-occupant": "" }, "Fill"),
          ),
        ),
      );
    });

    const card = container.firstElementChild;
    const body = [...(card?.children ?? [])].find(
      (el) => el instanceof HTMLElement && el.tagName === "DIV",
    );
    expect(body?.className).toContain("flex-1");
    expect(body?.className).toContain("[&>*]:flex-1");
    expect(body?.className).not.toContain("overflow-y-auto");
  });
});
