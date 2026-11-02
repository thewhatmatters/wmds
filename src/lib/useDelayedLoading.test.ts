/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDelayedLoading } from "./useDelayedLoading";

let seen: boolean[] = [];
function Probe({ loading }: { loading: boolean }) {
  seen.push(useDelayedLoading(loading));
  return null;
}

describe("useDelayedLoading (Loading states Y7)", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  beforeEach(() => {
    vi.useFakeTimers();
    seen = [];
    container = document.createElement("div");
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    vi.useRealTimers();
  });
  const render = (loading: boolean) => act(() => root.render(createElement(Probe, { loading })));
  const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));
  const now = () => seen[seen.length - 1];

  it("shows nothing for a load under 400ms", () => {
    render(true);
    advance(300);
    render(false);
    advance(1000);
    expect(seen).not.toContain(true);
  });

  it("shows after 400ms and keeps it 400ms even when the load ends at once", () => {
    render(true);
    advance(399);
    expect(now()).toBe(false);
    advance(1);
    expect(now()).toBe(true);
    advance(50);
    render(false);
    advance(300);
    expect(now()).toBe(true);
    advance(50);
    expect(now()).toBe(false);
  });

  it("hides at once when it has already been shown long enough", () => {
    render(true);
    advance(400);
    advance(900);
    render(false);
    advance(0);
    expect(now()).toBe(false);
  });
});
