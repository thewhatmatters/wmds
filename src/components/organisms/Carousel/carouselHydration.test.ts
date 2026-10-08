/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Carousel } from "./Carousel";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const tree = () =>
  createElement(
    Carousel,
    { "aria-label": "Selected work", bleed: true },
    createElement(Carousel.Item, { key: "a" }, "First"),
    createElement(Carousel.Item, { key: "b" }, "Second"),
  );

describe("Carousel hydration", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("hydrates the server markup without a mismatch", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const onRecoverableError = vi.fn();
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree());
    document.body.append(container);
    const serverMarkup = container.querySelector("[data-carousel-viewport]")?.outerHTML;
    expect(serverMarkup).toContain('aria-label="1 of 2"');

    const root = await act(async () => hydrateRoot(container, tree(), { onRecoverableError }));

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    // The row hydrated in place, and it has been measured.
    const viewport = container.querySelector<HTMLElement>("[data-carousel-viewport]");
    expect(viewport?.getAttribute("aria-label")).toBe("Selected work");
    expect(viewport?.hasAttribute("data-overflowing")).toBe(true);
    await act(async () => root.unmount());
  });
});
