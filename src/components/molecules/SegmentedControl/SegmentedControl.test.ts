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

  function renderThree(value: string, picked: string[], extra: { disabledGrid?: boolean } = {}) {
    return render(
      createElement(SegmentedControl, {
        "aria-label": "View",
        value,
        onValueChange: (next: string) => picked.push(next),
        children: [
          createElement(SegmentedControl.Item, { key: "list", value: "list", children: "List" }),
          createElement(SegmentedControl.Item, { key: "grid", value: "grid", disabled: extra.disabledGrid, children: "Grid" }),
          createElement(SegmentedControl.Item, { key: "board", value: "board", children: "Board" }),
        ],
      }),
    );
  }

  function press(target: Element, key: string) {
    act(() => {
      target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    });
  }

  it("keeps one tab stop: the selected segment", () => {
    const view = renderThree("grid", []);
    const tabIndexes = [...view.querySelectorAll<HTMLButtonElement>("[role='radio']")].map((el) => el.tabIndex);
    expect(tabIndexes).toEqual([-1, 0, -1]);
  });

  it("leaves every segment tabbable while none is selected", () => {
    const view = renderThree("none", []);
    const tabIndexes = [...view.querySelectorAll<HTMLButtonElement>("[role='radio']")].map((el) => el.tabIndex);
    expect(tabIndexes).toEqual([0, 0, 0]);
  });

  it("moves and selects with the arrow keys, wrapping, and skips disabled segments", () => {
    const picked: string[] = [];
    const view = renderThree("list", picked, { disabledGrid: true });
    const [list, , board] = [...view.querySelectorAll<HTMLButtonElement>("[role='radio']")];
    list?.focus();
    press(list!, "ArrowRight");
    expect(document.activeElement).toBe(board);
    press(list!, "ArrowLeft");
    press(list!, "ArrowDown");
    press(list!, "End");
    press(list!, "Home");
    expect(picked).toEqual(["board", "board", "board", "board"]);
    expect(document.activeElement).toBe(list);
  });
});
