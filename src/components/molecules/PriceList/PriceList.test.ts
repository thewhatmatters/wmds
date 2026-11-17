/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { PriceList } from "./PriceList";

describe("PriceList", () => {
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

  function render(node: ReturnType<typeof createElement>) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(node);
    });
    return container;
  }

  it("renders a named list whose rows read name, note, price", () => {
    const view = render(
      createElement(
        PriceList,
        {
          "aria-label": "Pizzas",
          children: [
            createElement(PriceList.Item, { key: "a", name: "Margherita", note: "Tomato, mozzarella, basil", price: "$18" }),
            createElement(PriceList.Item, { key: "b", name: "Cheese slice", price: "$4.50" }),
          ],
        },
      ),
    );
    const list = view.querySelector("ul")!;
    expect(list.getAttribute("role")).toBe("list");
    expect(list.getAttribute("aria-label")).toBe("Pizzas");
    const rows = [...list.querySelectorAll("li")];
    expect(rows).toHaveLength(2);
    expect([...rows[0]!.children].map((part) => part.getAttribute("data-slot"))).toEqual(["name", "note", "price"]);
    expect(rows[0]!.textContent).toBe("MargheritaTomato, mozzarella, basil$18");
    // No note, no empty slot.
    expect([...rows[1]!.children].map((part) => part.getAttribute("data-slot"))).toEqual(["name", "price"]);
  });

  it("keeps every row able to shrink and wrap, so the list fits a phone", () => {
    const view = render(
      createElement(
        PriceList,
        {
          size: "lg",
          rule: "dotted",
          children: createElement(PriceList.Item, { name: "White clam", note: "Clams, garlic", price: "$24" }),
        },
      ),
    );
    const list = view.querySelector("ul")!;
    expect(list.className).toContain("grid-cols-[minmax(0,1fr)_fit-content(40%)]");
    expect(list.className).not.toMatch(/overflow-x|whitespace-nowrap/);
    const row = list.querySelector("li")!;
    expect(row.className).toContain("grid-cols-subgrid");
    expect(row.className).toContain("border-dotted");
    for (const part of row.querySelectorAll("[data-slot]")) {
      expect(part.className).toContain("min-w-0");
      expect(part.className).not.toContain("whitespace-nowrap");
    }
    expect(row.querySelector('[data-slot="price"]')!.className).toContain("tabular-nums");
    expect(row.querySelector('[data-slot="name"]')!.className).toContain("type-heading-3");
  });

  it("stacked never moves the note beside the name", () => {
    const view = render(
      createElement(
        PriceList,
        {
          layout: "stacked",
          rule: "none",
          children: createElement(PriceList.Item, { name: "Garlic knots", note: "Six", price: "$7" }),
        },
      ),
    );
    const row = view.querySelector("li")!;
    expect(row.querySelector('[data-slot="note"]')!.className).not.toContain("md:col-start-2");
    expect(row.className).not.toContain("border-b");
  });
});
