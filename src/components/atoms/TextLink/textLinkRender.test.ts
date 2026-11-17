import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TextLink } from "./TextLink";

describe("TextLink", () => {
  it("renders an anchor to href", () => {
    const html = renderToString(createElement(TextLink, { href: "/blog", children: "Blog" }));
    expect(html).toMatch(/^<a [^>]*href="\/blog"/);
    expect(html).not.toContain("target=");
  });

  it("marks another site with the icon and opens it in the same tab (Links K9)", () => {
    const html = renderToString(createElement(TextLink, { href: "https://example.com", external: true, children: "Example" }));
    expect(html).toContain("<svg");
    expect(html).not.toContain("target=");
    expect(html).not.toContain("(opens in a new tab)");
  });

  it("opens a new tab only with newTab, and says so in the accessible name", () => {
    const html = renderToString(createElement(TextLink, { href: "https://example.com", external: true, newTab: true, children: "Example" }));
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("(opens in a new tab)");
  });

  it("composes onto a router's link with render, keeping the treatment", () => {
    const routerLink = createElement("a", { href: "/blog/post", "data-router": "" });
    const html = renderToString(createElement(TextLink, { variant: "quiet", render: routerLink, children: "A post" }));
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('href="/blog/post"');
    expect(html).toContain('data-router=""');
    expect(html).toContain("decoration-transparent");
    expect(html).toContain("A post");
  });

  it("sets brand ink with tone, in place of the text colour and with no ! override", () => {
    const brand = renderToString(createElement(TextLink, { href: "/about", tone: "brand", children: "About" }));
    expect(brand).toContain("text-brand");
    expect(brand).toContain("hover:decoration-brand");
    expect(brand).not.toMatch(/\btext-fg\b/);
    expect(brand).not.toContain("decoration-fg");
    expect(brand).not.toContain("!");
    const quiet = renderToString(createElement(TextLink, { href: "/about", variant: "quiet", tone: "brand", children: "About" }));
    expect(quiet).toContain("text-brand");
    expect(quiet).toContain("decoration-transparent");
    expect(quiet).not.toMatch(/\btext-fg\b/);
  });

  it("keeps the default tone's classes as they were", () => {
    const plain = renderToString(createElement(TextLink, { href: "/about", children: "About" }));
    expect(plain).toMatch(/\btext-fg\b/);
    expect(plain).toContain("hover:decoration-fg");
    expect(plain).not.toContain("text-brand");
  });
});
