/** @vitest-environment happy-dom */
import { createElement, type SVGProps } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "../../atoms/Button/Button";

function ReceiptIcon(props: SVGProps<SVGSVGElement>) {
  return createElement("svg", { viewBox: "0 0 24 24", ...props });
}
import { Stat } from "./Stat";
import { statTrendBadgeVariant } from "./statStyles";

describe("Stat hero", () => {
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

  it("sets the lg figure on display-3 with tabular numbers and a visible vs line", () => {
    const view = render(
      createElement(Stat, {
        size: "lg",
        label: "Attributed revenue",
        value: "$18,420",
        context: "vs $14,850",
        trend: { value: "+24.1%", direction: "up", label: "versus prior week" },
      }),
    );

    const figure = [...view.querySelectorAll("span")].find((el) => el.textContent === "$18,420");
    expect(figure?.className).toContain("type-display-3");
    expect(figure?.className).toContain("tabular-nums");

    const context = [...view.querySelectorAll("p")].find((el) => el.textContent === "vs $14,850");
    expect(context?.className).toContain("tabular-nums");
    expect(view.querySelector("[title='versus prior week']")).not.toBeNull();
    expect(view.textContent).toContain("vs $14,850");
  });

  it("keeps sm figures off the display step", () => {
    const view = render(createElement(Stat, { label: "Followers", value: "12,480" }));
    const figure = [...view.querySelectorAll("span")].find((el) => el.textContent === "12,480");
    expect(figure?.className).not.toContain("type-display-3");
    expect(figure?.className).toContain("tabular-nums");
  });

  it("composes a brand icon tile and a label-row action", () => {
    const view = render(
      createElement(Stat, {
        size: "lg",
        label: "Attributed revenue",
        value: "$18,420",
        icon: createElement(ReceiptIcon, { strokeWidth: 2 }),
        action: createElement(Button, { role: "secondary", size: "sm", children: "View details" }),
      }),
    );

    const tile = view.querySelector("span.bg-brand-tint");
    expect(tile).not.toBeNull();
    expect(tile?.querySelector("svg")).not.toBeNull();
    expect(tile?.getAttribute("aria-hidden")).toBeNull();
    expect(tile?.querySelector("[aria-hidden='true']")).not.toBeNull();

    const button = [...view.querySelectorAll("button")].find((el) => el.textContent === "View details");
    expect(button).not.toBeNull();
    expect(view.textContent).toContain("Attributed revenue");
  });

  it("replaces the figure when the source is not connected", () => {
    const view = render(
      createElement(Stat, {
        size: "lg",
        label: "Content awaiting approval",
        value: "07",
        trend: { value: "+1", direction: "up" },
        context: "vs last week",
        unavailable: { reason: "Google Analytics is not linked" },
      }),
    );

    expect(view.textContent).toContain("Not connected");
    expect(view.textContent).toContain("Google Analytics is not linked");
    expect(view.textContent).not.toContain("07");
    expect(view.textContent).not.toContain("+1");
    expect(view.textContent).not.toContain("vs last week");
    expect(view.querySelector(".type-display-3")).toBeNull();
  });

  it("uses a custom unavailable label", () => {
    const view = render(
      createElement(Stat, {
        label: "Revenue",
        value: "$0",
        unavailable: { label: "Source offline", reason: "The ledger timed out" },
      }),
    );
    expect(view.textContent).toContain("Source offline");
    expect(view.textContent).toContain("The ledger timed out");
    expect(view.textContent).not.toContain("$0");
  });

  it("treats a flat trend as a muted badge", () => {
    expect(statTrendBadgeVariant("flat")).toBe("neutral");
    expect(statTrendBadgeVariant("neutral")).toBe("neutral");
    expect(statTrendBadgeVariant("up")).toBe("success");
    expect(statTrendBadgeVariant("down")).toBe("destructive");

    const view = render(
      createElement(Stat, {
        size: "lg",
        label: "Available to spend",
        value: "$14.00",
        trend: { value: "0.0%", direction: "flat" },
      }),
    );
    expect(view.textContent).toContain("0.0%");
    expect(view.textContent).toContain("$14.00");
  });

  it("keeps loading as a busy skeleton and hides the figure", () => {
    const view = render(
      createElement(Stat, {
        size: "lg",
        label: "Attributed revenue",
        value: "$18,420",
        context: "vs $14,850",
        loading: true,
      }),
    );

    const article = view.querySelector("article");
    expect(article?.getAttribute("aria-busy")).toBe("true");
    expect(article?.getAttribute("aria-label")).toBe("Attributed revenue");
    expect(view.textContent).not.toContain("$18,420");
    expect(view.textContent).not.toContain("vs $14,850");
    expect(view.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThanOrEqual(3);
  });
});
