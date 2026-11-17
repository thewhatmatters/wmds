/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { afterEach, describe, expect, it } from "vitest";
import { SegmentedControl, segmentedControlSizes } from "./SegmentedControl";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("SegmentedControl", () => {
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
      root?.render(createElement(MotionConfig, { reducedMotion: "always" }, node));
    });
    return container;
  }

  it("gives every segment a 44px-tall tap layer on a touch screen, at each size", () => {
    const view = render(
      createElement(
        "div",
        null,
        segmentedControlSizes.map((size) =>
          createElement(SegmentedControl, {
            key: size,
            "aria-label": `View ${size}`,
            size,
            value: "list",
            onValueChange: () => {},
            children: [
              createElement(SegmentedControl.Item, { key: "list", value: "list", children: "List" }),
              createElement(SegmentedControl.Item, { key: "grid", value: "grid", children: "Grid" }),
            ],
          }),
        ),
      ),
    );

    const segments = [...view.querySelectorAll("[role='radio']")];
    expect(segments).toHaveLength(segmentedControlSizes.length * 2);
    for (const segment of segments) {
      const classes = segment.className.split(/\s+/);
      // The layer hangs off the segment, 44px tall and centred on it, and only on coarse pointers.
      expect(classes).toContain("relative");
      expect(classes).toContain("pointer-coarse:after:absolute");
      expect(classes).toContain("pointer-coarse:after:h-11");
      expect(classes).toContain("pointer-coarse:after:top-1/2");
      expect(classes).toContain("pointer-coarse:after:-translate-y-1/2");
      expect(classes).toContain("pointer-coarse:after:content-['']");
      // No wider than the segment: its neighbours sit edge to edge.
      expect(classes).toContain("pointer-coarse:after:inset-x-0");
      // The track keeps its cluster height; nothing grows on touch.
      expect(classes.some((name) => name.startsWith("pointer-coarse:min-h") || name.startsWith("pointer-coarse:h-"))).toBe(false);
    }
  });

  it("selects a segment on click and leaves the selected one alone", () => {
    const picked: string[] = [];
    const view = render(
      createElement(SegmentedControl, {
        "aria-label": "View",
        value: "list",
        onValueChange: (value: string) => picked.push(value),
        children: [
          createElement(SegmentedControl.Item, { key: "list", value: "list", children: "List" }),
          createElement(SegmentedControl.Item, { key: "grid", value: "grid", children: "Grid" }),
        ],
      }),
    );
    const [list, grid] = [...view.querySelectorAll<HTMLButtonElement>("[role='radio']")];
    expect(list?.getAttribute("aria-checked")).toBe("true");
    act(() => {
      list?.click();
      grid?.click();
    });
    expect(picked).toEqual(["grid"]);
  });
});
