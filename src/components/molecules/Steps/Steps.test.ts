/** @vitest-environment happy-dom */
import { act, createElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Steps, stepsNumber, type StepsProps } from "./Steps";

const steps = [
  { title: "Call or text", text: "We answer the same day." },
  { title: "We come and look", text: "A free visit and a written price." },
  { title: "We do the work", text: "On the day we said." },
];

describe("stepsNumber", () => {
  it("writes two digits", () => {
    expect(stepsNumber(1)).toBe("01");
    expect(stepsNumber(12)).toBe("12");
  });
});

describe("Steps", () => {
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

  function render(props: Partial<StepsProps> = {}, children?: ReactNode) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    const items =
      children ??
      steps.map((step) => createElement(Steps.Item, { key: step.title, title: step.title }, step.text));
    act(() => {
      root?.render(createElement(Steps, { ...props, children: items }));
    });
    return container;
  }

  const slots = (view: HTMLElement, name: string) => [...view.querySelectorAll<HTMLElement>(`[data-slot="${name}"]`)];

  it("is an ordered list that keeps its list role, one item per step", () => {
    const view = render({ "aria-label": "How it works" });
    const list = view.querySelector("ol")!;
    expect(list.getAttribute("role")).toBe("list");
    expect(list.getAttribute("aria-label")).toBe("How it works");
    expect(list.querySelectorAll(":scope > li")).toHaveLength(3);
  });

  it("numbers the steps itself, in two digits, hidden from screen readers", () => {
    const view = render();
    const numbers = slots(view, "number");
    expect(numbers.map((number) => number.textContent)).toEqual(["01", "02", "03"]);
    expect(numbers.every((number) => number.getAttribute("aria-hidden") === "true")).toBe(true);
    expect(numbers.every((number) => number.className.includes("type-eyebrow"))).toBe(true);
  });

  it("counts from start", () => {
    const view = render({ start: 4 });
    expect(slots(view, "number").map((number) => number.textContent)).toEqual(["04", "05", "06"]);
    expect(view.querySelector("ol")!.getAttribute("start")).toBe("4");
  });

  it("sets each title as an h3 by default and takes another element", () => {
    expect(slots(render(), "title").map((title) => title.tagName)).toEqual(["H3", "H3", "H3"]);
    expect(slots(render({ titleAs: "p" }), "title").map((title) => title.tagName)).toEqual(["P", "P", "P"]);
  });

  it("shows the title and its one line, and no empty line without one", () => {
    const view = render({}, [
      createElement(Steps.Item, { key: "a", title: "Call or text" }, "We answer the same day."),
      createElement(Steps.Item, { key: "b", title: "We do the work" }),
    ]);
    expect(slots(view, "title").map((title) => title.textContent)).toEqual(["Call or text", "We do the work"]);
    expect(slots(view, "text").map((text) => text.textContent)).toEqual(["We answer the same day."]);
  });

  it("rules every step, and sets columns only from md", () => {
    const rows = render();
    expect(slots(rows, "step").every((step) => step.className.includes("border-t"))).toBe(true);
    expect(rows.querySelector("ol")!.className).not.toContain("md:grid-flow-col");
    const columns = render({ layout: "columns" });
    const list = columns.querySelector("ol")!;
    expect(list.getAttribute("data-layout")).toBe("columns");
    expect(list.className).toContain("md:grid-flow-col");
    // Below md it is the same single column as rows.
    expect(list.className).toContain("flex-col");
  });

  it("passes className and data attributes to the list and to a step", () => {
    const view = render({ className: "md:col-span-8", "data-section": "process" } as Partial<StepsProps>, [
      createElement(Steps.Item, { key: "a", title: "One", className: "md:col-span-2", "data-step": "first" } as never),
    ]);
    const list = view.querySelector("ol")!;
    expect(list.className).toContain("md:col-span-8");
    expect(list.getAttribute("data-section")).toBe("process");
    const step = slots(view, "step")[0]!;
    expect(step.className).toContain("md:col-span-2");
    expect(step.getAttribute("data-step")).toBe("first");
  });
});
