/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChatDock } from "./ChatDock";

function stubReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: matches && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  })) as typeof window.matchMedia;
}

function dock() {
  return createElement(ChatDock, {
    title: "WhatMatters",
    subtitle: "Ask anything",
    greeting: "Hi, ask me anything.",
    onSend: () => undefined,
    disclaimer: "Answers may be incomplete",
  });
}

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("ChatDock hydration", () => {
  it("hydrates without a mismatch when the reader prefers reduced motion", async () => {
    // The reader prefers reduced motion. A server can't know that, so the markup must be the one a
    // server makes — the window folded into the bar's shape — and the hydration render must match it.
    stubReducedMotion(true);
    const html = renderToString(dock());
    expect(html).toMatch(/data-chat-dock-window="closed"[^>]*style="[^"]*height:52px/);

    const errors: unknown[] = [];
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      errors.push(args);
    });
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = html;
    await act(async () => {
      hydrateRoot(container, dock(), { onRecoverableError: (error) => errors.push(error) });
    });

    expect(errors).toEqual([]);
    // Closed, the window stays hidden behind the bar.
    expect(container.querySelector<HTMLElement>("[data-chat-dock-window]")?.hidden).toBe(true);
  });
});
