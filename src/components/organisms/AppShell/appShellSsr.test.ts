import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

function shell(props: { footer?: boolean } = {}) {
  return createElement(
    AppShell,
    {
      title: "Dashboard",
      brand: createElement("span", null, "WhatMatters"),
      sidebar: createElement("nav", { "aria-label": "Portal" }, createElement("a", { href: "/" }, "Home")),
      sidebarFooter: props.footer === false ? undefined : createElement("p", null, "Appearance"),
    },
    createElement("p", null, "Page body"),
  );
}

describe("AppShell server render", () => {
  it("renders the sidebar, the footer, the title bar, and the page without a browser", () => {
    const html = renderToString(shell());
    expect(html).toContain("WhatMatters");
    expect(html).toContain("Home");
    expect(html).toContain("Appearance");
    expect(html).toContain("Dashboard");
    expect(html).toContain("Page body");
  });

  it("names the phone toggle Menu", () => {
    expect(renderToString(shell())).toContain('aria-label="Menu"');
  });

  it("renders no footer row when the slot is empty", () => {
    expect(renderToString(shell({ footer: false }))).not.toContain("Appearance");
  });

  it("leaves the Sheet closed, so no dialog is in the server HTML", () => {
    expect(renderToString(shell())).not.toContain('role="dialog"');
  });
});
