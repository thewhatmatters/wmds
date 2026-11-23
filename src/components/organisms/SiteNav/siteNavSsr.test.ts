/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { SiteNav } from "./SiteNav";

/**
 * Motion reads the reader's motion setting once and then follows the media query's change events, so the stub keeps
 * the listeners and tells them when a test flips the setting.
 */
let reducedMotion = false;
const motionListeners = new Set<() => void>();

function setReducedMotion(next: boolean) {
  reducedMotion = next;
  for (const listener of motionListeners) listener();
}

function navTree() {
  return createElement(SiteNav, {
    "aria-label": "Main",
    state: "compact",
    start: createElement("a", { href: "/" }, "Home"),
    end: createElement("a", { href: "/start" }, "Start"),
  });
}

/** The server can't know the reader's motion setting, so its markup is always the no-preference one. */
function serverHtml() {
  setReducedMotion(false);
  return renderToString(navTree());
}

describe("site nav compact SSR", () => {
  beforeAll(() => {
    window.matchMedia = ((query: string) => {
      const motionQuery = query.includes("prefers-reduced-motion");
      return {
        get matches() {
          return motionQuery && reducedMotion;
        },
        media: query,
        addEventListener: (_type: string, listener: () => void) => {
          if (motionQuery) motionListeners.add(listener);
        },
        removeEventListener: (_type: string, listener: () => void) => {
          motionListeners.delete(listener);
        },
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
        onchange: null,
      };
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("renders the compact bar on the server at its hidden start", () => {
    const html = serverHtml();
    expect(html).toContain('data-state="compact"');
    expect(html).toMatch(/opacity:0/);
  });

  it("renders the same first markup whether or not the reader prefers reduced motion", () => {
    const html = serverHtml();
    setReducedMotion(true);
    expect(renderToString(navTree())).toBe(html);
  });

  for (const reduced of [false, true]) {
    it(`hydrates without a mismatch when reduced motion is ${reduced ? "on" : "off"}`, async () => {
      const html = serverHtml();
      setReducedMotion(reduced);
      const container = document.createElement("div");
      document.body.appendChild(container);
      container.innerHTML = html;
      const errors = vi.spyOn(console, "error").mockImplementation(() => {});
      await act(async () => {
        hydrateRoot(container, navTree());
      });
      const messages = errors.mock.calls.map((call) => call.map(String).join(" "));
      expect(messages.filter((message) => /hydrat|did not match|didn't match/i.test(message))).toEqual([]);
      expect(container.querySelector("header[data-state='compact']")).toBeInstanceOf(HTMLElement);
    });
  }
});
