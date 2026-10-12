/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NavList } from "./NavList";

describe("NavList links", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
    root = undefined;
    container = undefined;
    vi.restoreAllMocks();
  });

  function render(node: ReturnType<typeof createElement>) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(node);
    });
    return container;
  }

  it("renders an anchor with aria-current when href is set", () => {
    const view = render(
      createElement(NavList, {
        "aria-label": "Tasks",
        activeId: "ikea",
        sections: [
          {
            label: "Recent",
            labelAlign: "section",
            items: [{ id: "ikea", label: "Track my IKEA order", href: "/tasks/ikea" }],
          },
        ],
      }),
    );

    const link = view.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/tasks/ikea");
    expect(link?.getAttribute("aria-current")).toBe("page");
    expect(link?.textContent).toContain("Track my IKEA order");
    expect(view.querySelector("button")).toBeNull();
  });

  it("composes a router link and keeps a plain row as a button", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = render(
      createElement(NavList, {
        "aria-label": "Tasks",
        sections: [
          {
            label: "Pinned",
            labelAlign: "section",
            items: [
              {
                id: "apartment",
                label: "Find a new apartment",
                href: "/ignored",
                render: createElement("a", { href: "/tasks/apartment", "data-router": "" }),
              },
              { id: "dinner", label: "Plan team dinner" },
            ],
          },
        ],
      }),
    );

    const routed = view.querySelector("[data-router]");
    expect(routed?.getAttribute("href")).toBe("/tasks/apartment");
    expect(view.querySelector("a[href='/ignored']")).toBeNull();
    expect(view.querySelector("button")?.textContent).toContain("Plan team dinner");
    expect(warn).toHaveBeenCalled();
  });

  it("shows a trailing mark and a section action", () => {
    const view = render(
      createElement(NavList, {
        "aria-label": "Tasks",
        sections: [
          {
            label: "Pinned",
            labelAlign: "section",
            action: createElement("span", { "data-action": "" }, "Filter"),
            items: [
              {
                id: "apartment",
                label: "Find a new apartment",
                href: "/tasks/apartment",
                count: 2,
                trailing: createElement("span", { "data-trailing": "" }, "Unread"),
              },
            ],
          },
        ],
      }),
    );

    expect(view.querySelector("[data-action]")?.textContent).toBe("Filter");
    expect(view.querySelector("[data-trailing]")?.textContent).toBe("Unread");
    const trail = view.querySelector("[data-trailing]")?.parentElement;
    expect(trail?.className).toContain("ml-auto");
    expect(trail?.textContent).toContain("2");
    expect(trail?.querySelector("span")?.className).toContain("tabular-nums");
  });
});
