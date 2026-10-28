/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { Accordion } from "./Accordion";

function render(size?: "ui" | "reading") {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  act(() =>
    root.render(
      createElement(Accordion, { size, children: createElement(Accordion.Item, { label: "Q", defaultOpen: true, children: "An answer people read." }) }),
    ),
  );
  const panel = [...host.querySelectorAll("div")].find((d) => d.textContent === "An answer people read." && d.children.length === 0)!;
  const classes = panel.className;
  act(() => root.unmount());
  host.remove();
  return classes;
}

describe("Accordion size (Body rules B7, B9)", () => {
  it("keeps 14px muted UI text by default", () => {
    expect(render()).toContain("type-body text-muted");
  });
  it("sets answers in 17px regular ink with size=reading", () => {
    const classes = render("reading");
    expect(classes).toContain("type-large text-fg");
    expect(classes).not.toContain("text-muted");
  });
});
