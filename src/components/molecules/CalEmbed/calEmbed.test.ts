/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
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
  });
});
