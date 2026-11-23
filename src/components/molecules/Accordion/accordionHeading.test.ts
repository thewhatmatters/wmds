/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { Accordion, type AccordionHeadingLevel } from "./Accordion";

function render(headingLevel?: AccordionHeadingLevel) {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  act(() =>
    root.render(
      createElement(Accordion, {
        headingLevel,
        children: [
          createElement(Accordion.Item, { key: "a", label: "How long does it take?", defaultOpen: true, children: "Six weeks." }),
          createElement(Accordion.Item, { key: "b", label: "Who owns the site?", children: "You do." }),
          createElement(Accordion.Item, { key: "c", label: "A row with no panel" }),
        ],
      }),
    ),
  );
  return {
    host,
    done: () => {
      act(() => root.unmount());
      host.remove();
    },
  };
}

describe("Accordion headingLevel", () => {
  it("leaves the buttons bare by default", () => {
    const { host, done } = render();
    expect(host.querySelectorAll("button[aria-expanded]")).toHaveLength(2);
    expect(host.querySelectorAll("h1, h2, h3, h4, h5, h6")).toHaveLength(0);
    done();
  });

  it("puts each expandable row's button in a heading of that level", () => {
    const { host, done } = render(3);
    const headings = [...host.querySelectorAll("h3")];
    expect(headings.map((heading) => heading.textContent)).toEqual(["How long does it take?", "Who owns the site?"]);
    for (const heading of headings) {
      const button = heading.firstElementChild;
      expect(heading.children).toHaveLength(1);
      expect(button?.tagName).toBe("BUTTON");
      expect(document.getElementById(button!.getAttribute("aria-controls")!)).toBeInstanceOf(HTMLElement);
    }
    expect(headings[0]!.querySelector("button")!.getAttribute("aria-expanded")).toBe("true");
    done();
  });

  it("gives a row with no panel no heading, since it opens nothing", () => {
    const { host, done } = render(4);
    expect(host.querySelectorAll("h4")).toHaveLength(2);
    expect([...host.querySelectorAll("h4")].some((heading) => heading.textContent === "A row with no panel")).toBe(false);
    done();
  });

  it("still opens and closes from inside the heading", () => {
    const { host, done } = render(3);
    const second = host.querySelectorAll<HTMLButtonElement>("h3 > button")[1]!;
    expect(second.getAttribute("aria-expanded")).toBe("false");
    act(() => second.click());
    expect(second.getAttribute("aria-expanded")).toBe("true");
    done();
  });
});
