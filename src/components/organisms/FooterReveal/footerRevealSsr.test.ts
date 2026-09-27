/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FooterReveal } from "./FooterReveal";

function footerTree() {
  return createElement(
    FooterReveal,
    null,
    createElement(FooterReveal.Content, null, "Cover"),
    createElement(
      FooterReveal.Footer,
      { className: "bg-brand" },
      createElement(FooterReveal.Brand, null),
    ),
  );
}

function stubReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: matches && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  })) as typeof window.matchMedia;
}

describe("footer reveal reduced motion SSR", () => {
  it("hydrates sharp when the server value is unknown and the reader prefers reduced motion", async () => {
    stubReducedMotion(true);
    const html = renderToString(footerTree());
    expect(html).not.toMatch(/blur\(\s*(?!0\b)\d/);
    expect(html).toContain("filter:none");

    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = html;
    await act(async () => {
      hydrateRoot(container, footerTree());
    });

    const scale = container.querySelector("[data-footer-reveal='scale']");
    expect(scale).toBeInstanceOf(HTMLElement);
    const filter = (scale as HTMLElement).style.filter;
    expect(filter === "none" || filter === "").toBe(true);
    expect(filter).not.toContain("blur");
    container.remove();
  });
});
