/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Meter, meterPercent, type MeterProps } from "./Meter";

describe("meterPercent", () => {
  it("places the value in the range", () => {
    expect(meterPercent(48, 0, 100)).toBe(48);
    expect(meterPercent(3, 0, 12)).toBe(25);
    expect(meterPercent(7.5, 5, 10)).toBe(50);
  });

  it("clamps to the range", () => {
    expect(meterPercent(-4, 0, 100)).toBe(0);
    expect(meterPercent(140, 0, 100)).toBe(100);
  });

  it("reads as empty for a range with no width or a value that isn't a number", () => {
    expect(meterPercent(5, 10, 10)).toBe(0);
    expect(meterPercent(5, 10, 0)).toBe(0);
    expect(meterPercent(Number.NaN, 0, 100)).toBe(0);
    expect(meterPercent(5, 0, Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("Meter", () => {
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

  function render(props: MeterProps) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(Meter, props));
    });
    return container.firstElementChild as HTMLElement;
  }

  it("is a named meter with its range, value and a percentage to read out", () => {
    const meter = render({ value: 3, max: 12, label: "Seats taken" });
    expect(meter.getAttribute("role")).toBe("meter");
    expect(meter.getAttribute("aria-label")).toBe("Seats taken");
    expect(meter.getAttribute("aria-valuemin")).toBe("0");
    expect(meter.getAttribute("aria-valuemax")).toBe("12");
    expect(meter.getAttribute("aria-valuenow")).toBe("3");
    expect(meter.getAttribute("aria-valuetext")).toBe("25%");
    expect(meter.querySelector<HTMLElement>("[data-meter-fill]")?.style.width).toBe("25%");
  });

  it("clamps the value it reports and draws", () => {
    const meter = render({ value: 180, label: "Load" });
    expect(meter.getAttribute("aria-valuenow")).toBe("100");
    expect(meter.querySelector<HTMLElement>("[data-meter-fill]")?.style.width).toBe("100%");
  });

  it("reads out the caller's value text", () => {
    const meter = render({ value: 48, max: 120, label: "Calcium", valueText: "48 mg/l" });
    expect(meter.getAttribute("aria-valuetext")).toBe("48 mg/l");
  });

  it("drops the meter role when hidden beside a written figure", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const meter = render({ value: 48, "aria-hidden": true });
    expect(meter.getAttribute("role")).toBeNull();
    expect(meter.getAttribute("aria-valuenow")).toBeNull();
    expect(meter.getAttribute("aria-hidden")).toBe("true");
    expect(warn).not.toHaveBeenCalled();
  });

  it("warns when it has no name and isn't hidden", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render({ value: 48 });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("[WMDS Meter]");
  });

  it("takes a name from aria-labelledby without a warning, and passes data-* through", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const meter = render({ value: 48, "aria-labelledby": "row-1", "data-reveal": "grow" } as MeterProps);
    expect(meter.getAttribute("aria-labelledby")).toBe("row-1");
    expect(meter.getAttribute("data-reveal")).toBe("grow");
    expect(warn).not.toHaveBeenCalled();
  });

  it("sizes the track and tones the fill", () => {
    const hairline = render({ value: 48, label: "Share", size: "xs", tone: "neutral" });
    expect(hairline.className).toContain("h-0.5");
    expect(hairline.querySelector("[data-meter-fill]")?.className).toContain("var(--color-text-primary)");
    expect(hairline.querySelector("[data-meter-fill]")?.className).toContain("motion-reduce:transition-none");
  });
});
