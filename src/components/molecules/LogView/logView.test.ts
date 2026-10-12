/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Stat } from "../Stat/Stat";
import { LogView } from "./LogView";

const lines = ["alpha", "beta"];

describe("LogView", () => {
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
  }

  it("numbers lines, counts them, and copies the text", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(createElement(LogView, { label: "Scan log", lines }));

    expect(container?.textContent).toContain("2 lines");
    expect(container?.querySelector("[role='log']")?.getAttribute("aria-label")).toBe("Scan log");
    const numbers = [...(container?.querySelectorAll("[aria-hidden='true']") ?? [])].map(
      (node) => node.textContent,
    );
    expect(numbers).toEqual(["1", "2"]);

    const copy = [...(container?.querySelectorAll("button") ?? [])].find((button) =>
      button.textContent?.includes("Copy"),
    );
    await act(async () => {
      copy?.click();
    });
    expect(writeText).toHaveBeenCalledWith("alpha\nbeta");
    expect(container?.textContent).toContain("Copied");
  });

  it("presses Follow and leaves an empty or loading log without lines", () => {
    const onFollowChange = vi.fn();
    render(
      createElement(LogView, {
        label: "Scan log",
        lines,
        follow: false,
        onFollowChange,
      }),
    );
    const follow = [...(container?.querySelectorAll("button") ?? [])].find((button) =>
      button.textContent?.includes("Follow"),
    );
    expect(follow?.getAttribute("aria-pressed")).toBe("false");
    act(() => {
      follow?.click();
    });
    expect(onFollowChange).toHaveBeenCalledWith(true);

    act(() => {
      root?.render(createElement(LogView, { label: "Scan log", lines: [], follow: false }));
    });
    expect(container?.textContent).toContain("No log lines");
    expect(container?.textContent).toContain("0 lines");

    act(() => {
      root?.render(createElement(LogView, { label: "Scan log", lines, loading: true }));
    });
    expect(container?.querySelector("[role='log']")?.getAttribute("aria-busy")).toBe("true");
    expect(container?.textContent).not.toContain("alpha");
  });
});

describe("Stat detail", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
  });

  it("renders one line under the figure and hides it while loading", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(Stat, { label: "Findings", value: "12", detail: "3 new" }));
    });
    expect(container?.textContent).toContain("3 new");

    act(() => {
      root?.render(
        createElement(Stat, { label: "Findings", value: "12", detail: "3 new", loading: true }),
      );
    });
    expect(container?.textContent).not.toContain("3 new");
    expect(container?.querySelector("article")?.getAttribute("aria-busy")).toBe("true");
  });
});
