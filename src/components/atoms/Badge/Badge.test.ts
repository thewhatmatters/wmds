/** @vitest-environment happy-dom */
import { createElement, type SVGProps } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Badge } from "./Badge";

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return createElement("svg", { viewBox: "0 0 24 24", "data-icon": "calendar", ...props });
}

describe("Badge status pill", () => {
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

  it("paints an active pill with a pulsing brand dot", () => {
    const view = render(createElement(Badge, { status: "active", dot: true, children: "Active" }));
    const pill = view.querySelector("[data-pattern='status']");
    expect(pill?.getAttribute("data-status")).toBe("active");
    expect(pill?.className).toContain("bg-brand-tint");
    expect(pill?.className).toContain("text-brand-outline");
    expect(pill?.className).toContain("rounded-[var(--radius-control)]");
    expect(pill?.className).toContain("tabular-nums");
    expect(pill?.className).toContain("h-7");
    expect(pill?.textContent).toBe("Active");

    const dot = pill?.querySelector("[data-pulsing]");
    expect(dot?.className).toContain("bg-brand-outline");
    expect(dot?.className).toContain("size-2");
    expect(dot?.className).toContain("animate-status-dot-pulse");
    expect(dot?.getAttribute("aria-hidden")).toBe("true");
  });

  it("uses a leading icon for cadence and does not pulse idle", () => {
    const view = render(
      createElement(Badge, {
        status: "idle",
        icon: createElement(CalendarIcon),
        children: "Every 2 days",
      }),
    );
    const pill = view.querySelector("[data-pattern='status']");
    expect(pill?.getAttribute("data-status")).toBe("idle");
    expect(pill?.className).toContain("bg-secondary");
    expect(pill?.querySelector("[data-icon='calendar']")).not.toBeNull();
    expect(pill?.querySelector("[data-pulsing]")).toBeNull();
    expect(pill?.textContent).toContain("Every 2 days");
  });

  it("keeps success, failed, and warning dots still", () => {
    const view = render(
      createElement(
        "div",
        null,
        createElement(Badge, { status: "success", dot: true, children: "Succeeded" }),
        createElement(Badge, { status: "failed", dot: true, children: "Failed" }),
        createElement(Badge, { status: "warning", dot: true, children: "Needs a look" }),
      ),
    );
    const pills = [...view.querySelectorAll("[data-pattern='status']")];
    expect(pills.map((pill) => pill.getAttribute("data-status"))).toEqual(["success", "failed", "warning"]);
    expect(view.querySelector("[data-pulsing]")).toBeNull();
    expect(pills[1]?.querySelector("span")?.className).toContain("bg-error");
    expect(view.textContent).toContain("Failed");
  });

  it("leaves a plain label badge on the 20px shell", () => {
    const view = render(createElement(Badge, { variant: "success", children: "Active" }));
    const pill = view.querySelector("[data-pattern='label']");
    expect(pill?.getAttribute("data-status")).toBeNull();
    expect(pill?.className).toContain("h-5");
    expect(pill?.className).not.toContain("h-7");
    expect(pill?.querySelector("[data-pulsing]")).toBeNull();
  });

  it("warns when dot is used without a status", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(createElement(Badge, { dot: true, children: "Active" }));
    expect(warn).toHaveBeenCalled();
    expect(container?.querySelector("[data-pattern='status']")).toBeNull();
    expect(container?.querySelector(".size-2")).toBeNull();
  });
});
