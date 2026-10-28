/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroIntro, type HeroIntroProps } from "./HeroIntro";

function render(props: HeroIntroProps) {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  act(() => root.render(createElement(HeroIntro, props)));
  return { host, done: () => { act(() => root.unmount()); host.remove(); } };
}

afterEach(() => vi.restoreAllMocks());

describe("HeroIntro firstLine, lead alias and description (0.4.30)", () => {
  it("sets firstLine as the heading's first line, with no warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { host, done } = render({ firstLine: "A studio in Austin." });
    expect(host.querySelector("h1")!.textContent).toBe("A studio in Austin.");
    expect(warn).not.toHaveBeenCalled();
    done();
  });

  it("still takes the deprecated lead, and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { host, done } = render({ lead: "A studio in Austin." });
    expect(host.querySelector("h1")!.textContent).toBe("A studio in Austin.");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("firstLine"));
    done();
  });

  it("renders description as a type-lead paragraph in ink after the h1", () => {
    const { host, done } = render({ firstLine: "A studio in Austin.", description: "Sites, video and social." });
    const p = host.querySelector("h1 + p")!;
    expect(p.textContent).toBe("Sites, video and social.");
    expect(p.className).toContain("type-lead");
    expect(p.className).toContain("text-fg");
    done();
  });

  it("renders no paragraph without a description", () => {
    const { host, done } = render({ firstLine: "A studio in Austin." });
    expect(host.querySelector("p")).toBeNull();
    done();
  });
});
