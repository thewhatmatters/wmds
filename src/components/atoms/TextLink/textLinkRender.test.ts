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

  it("opens another site in a new tab and says so", () => {
    const html = renderToString(createElement(TextLink, { href: "https://example.com", external: true, children: "Example" }));
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
});
