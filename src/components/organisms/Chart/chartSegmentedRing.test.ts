/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { prefersReducedMotion } from "motion-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { chartSeriesColor, type ChartSeriesConfig } from "../../../lib/chartTheme";
import { Chart } from "./Chart";
import { chartSegmentedRingModel } from "./ChartSegmentedRing";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("chartSegmentedRingModel", () => {
  it("clamps a full ring and marks overflow past the max", () => {
    expect(chartSegmentedRingModel(100, 100, 72).overflow).toBe(false);
    expect(chartSegmentedRingModel(100, 100, 72).progress).toBe(1);
    const over = chartSegmentedRingModel(128, 100, 10);
    expect(over.overflow).toBe(true);
    expect(over.clamped).toBe(100);
    expect(Math.round(over.progress * over.count)).toBe(10);
  });

  it("treats an empty meter as no filled ticks", () => {
    const empty = chartSegmentedRingModel(0, 3412, 72);
    expect(empty.progress).toBe(0);
    expect(empty.overflow).toBe(false);
  });
});

describe("Chart.SegmentedBar server render", () => {
  it("renders CSS segments before the host is measured", () => {
    const html = renderToString(
      createElement(Chart.SegmentedBar, {
        value: 50,
        max: 100,
        segments: 10,
        animate: "none",
        label: "Half full",
      }),
    );
    expect(html).toContain('data-chart-segment-fallback=""');
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-label="Half full"');
    expect(html.match(/data-segment=/g)?.length).toBe(10);
    expect(html.match(/data-filled="true"/g)?.length).toBe(5);
  });

  it("keeps the CSS meter when the host width is still zero", async () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    });
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => {
      root.render(
        createElement(Chart.SegmentedBar, {
          value: 1,
          max: 4,
          segments: 4,
          animate: "none",
        }),
      );
    });
    expect(host.querySelector("[data-chart-segment-fallback]")).not.toBeNull();
    expect(host.querySelectorAll("[data-filled='true']").length).toBe(1);
    root.unmount();
  });
});

describe("Chart.SegmentedRing", () => {
  it("server-renders the settled ticks, including when animate is initial", () => {
    const html = renderToString(
      createElement(Chart.SegmentedRing, {
        value: 38,
        max: 100,
        segments: 10,
        animate: "initial",
        centerValue: "38%",
        centerLabel: "of weekly goals",
        label: "Weekly goals",
      }),
    );
    expect(html).toContain("38%");
    expect(html).toContain("of weekly goals");
    expect(html).toContain('role="meter"');
    expect(html.match(/data-filled="true"/g)?.length).toBe(4);
    expect(html).not.toContain("data-overflow");
  });

  it("marks overflow and replaces the center when the source is not connected", () => {
    const over = renderToString(
      createElement(Chart.SegmentedRing, {
        value: 128,
        max: 100,
        segments: 8,
        animate: "none",
        centerValue: "128%",
      }),
    );
    expect(over).toContain("data-overflow");
    expect(over).toContain("Over capacity");
    expect(over).toContain("over capacity");
    expect(over.match(/data-filled="true"/g)?.length).toBe(8);

    const unwired = renderToString(
      createElement(Chart.SegmentedRing, {
        value: 40,
        max: 100,
        segments: 8,
        animate: "none",
        centerValue: "40%",
        unavailable: { reason: "Source is not connected" },
      }),
    );
    expect(unwired).toContain("Not connected");
    expect(unwired).toContain("Source is not connected");
    expect(unwired).not.toContain("40%");
    expect(unwired.match(/data-filled="true"/g)).toBeNull();
    expect(unwired).toContain('data-state="unavailable"');
  });

  it("hydrates the settled ring when the reader prefers reduced motion", async () => {
    prefersReducedMotion.current = true;
    const element = createElement(Chart.SegmentedRing, {
      value: 50,
      max: 100,
      segments: 4,
      animate: "initial",
      centerValue: "50%",
    });
    const html = renderToString(element);
    const errors: unknown[] = [];
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      errors.push(args);
    });
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = html;
    await act(async () => {
      hydrateRoot(container, element, {
        onRecoverableError: (error) => errors.push(error),
      });
    });
    expect(errors).toEqual([]);
    expect(container.querySelectorAll("[data-filled='true']").length).toBe(2);
    prefersReducedMotion.current = false;
  });
});

describe("Chart.Legend tabular", () => {
  const config: ChartSeriesConfig = {
    widget: {
      label: "Chat widget",
      color: chartSeriesColor(0),
      value: "1,569",
      percent: "46%",
      delta: { label: "+8%", direction: "up" },
    },
  };

  it("renders mono tabular figures only for the tabular variant", () => {
    const tabular = renderToString(
      createElement(Chart.Legend, { variant: "tabular", config }),
    );
    expect(tabular).toContain("1,569");
    expect(tabular).toContain("46%");
    expect(tabular).toContain("+8%");
    expect(tabular).toContain("tabular-nums");
    expect(tabular).toContain("text-success");

    const series = renderToString(createElement(Chart.Legend, { config }));
    expect(series).toContain("Chat widget");
    expect(series).not.toContain("1,569");
  });
});
