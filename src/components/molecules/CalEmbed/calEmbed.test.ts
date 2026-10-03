/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Card, type CardProps } from "../Card/Card";
import { CalEmbed } from "./CalEmbed";

describe("CalEmbed caption", () => {
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

  it("lists token names in the frame caption without a brand hex literal", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(createElement(CalEmbed));
    });

    const text = container.textContent ?? "";
    expect(text).toContain("--color-brand");
    expect(text).toContain("--color-background-body");
    expect(text).toContain("--color-background-surface");
    expect(text).not.toContain("#011272");
    expect(container.querySelector("[data-cal-embed]")).not.toBeNull();
    expect(container.querySelector("[data-cal-embed] [data-cal-embed-skip]")).not.toBeNull();
  });

  it("omits the in-body skip when the Skip slot is used", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    const onSkip = vi.fn();

    act(() => {
      root?.render(
        createElement(Card, { padding: "none", variant: "surface" } as CardProps, [
          createElement(Card.Body, { key: "body" }, createElement(CalEmbed, { skip: false })),
          createElement(
            Card.Footer,
            { key: "footer" },
            createElement(CalEmbed.Skip, { onSkip }),
          ),
        ]),
      );
    });

    const embed = container.querySelector("[data-cal-embed]");
    expect(embed).not.toBeNull();
    expect(embed?.querySelector("[data-cal-embed-skip]")).toBeNull();
    expect(embed?.querySelector("a")).toBeNull();

    const skip = container.querySelector("[data-cal-embed-skip]");
    expect(skip).not.toBeNull();
    expect(skip?.closest("footer")).not.toBeNull();
    expect(skip?.textContent).toBe("Skip, just email me");

    act(() => {
      skip?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("omits the in-body skip when skip is a CalEmbed.Skip node", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        createElement(CalEmbed, {
          skip: createElement(CalEmbed.Skip, { onSkip: () => undefined }),
        }),
      );
    });

    expect(container.querySelector("[data-cal-embed] [data-cal-embed-skip]")).toBeNull();
    expect(container.querySelector("[data-cal-embed-skip]")).toBeNull();
  });
});
