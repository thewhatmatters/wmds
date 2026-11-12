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

function labelClasses(props: { variant?: "list" | "plain"; size?: "ui" | "reading" }) {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  act(() =>
    root.render(createElement(Accordion, { ...props, children: createElement(Accordion.Item, { label: "A question", children: "An answer." }) })),
  );
  const label = [...host.querySelectorAll("button span")].find((span) => span.textContent === "A question")!;
  const classes = label.className;
  act(() => root.unmount());
  host.remove();
  return classes;
}

describe("Accordion plain labels", () => {
  it("wrap instead of truncating", () => {
    expect(labelClasses({ variant: "plain" })).not.toContain("truncate");
    expect(labelClasses({ variant: "plain" })).toContain("type-body");
  });
  it("take the answer's 17px step with size=reading", () => {
    const classes = labelClasses({ variant: "plain", size: "reading" });
    expect(classes).toContain("type-large");
    expect(classes).not.toContain("truncate");
  });
  it("stay one truncated line in list rows", () => {
    expect(labelClasses({ variant: "list", size: "reading" })).toContain("truncate");
  });
});

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
