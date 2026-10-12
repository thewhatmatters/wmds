/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DisplayControls } from "./DisplayControls";
import {
  applyDisplayTheme,
  commitDisplayTheme,
  displayThemeNoFlashScript,
  displayThemeStorageKey,
  persistDisplayTheme,
  readDisplayTheme,
  subscribeDisplayTheme,
} from "./displayControlsState";

describe("display theme", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
    root = undefined;
    container = undefined;
    applyDisplayTheme("light");
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("names the storage key in the no-flash snippet and follows the system when unset", () => {
    expect(displayThemeStorageKey).toBe("wmds-theme");
    expect(displayThemeNoFlashScript).toContain("wmds-theme");
    expect(displayThemeNoFlashScript).toContain("prefers-color-scheme");
    expect(displayThemeNoFlashScript).toContain('removeAttribute("data-theme")');
    expect(displayThemeNoFlashScript).toContain('setAttribute("data-theme","dark")');
  });

  it("reads and writes a saved mode, and falls back to auto", () => {
    expect(readDisplayTheme()).toBe("auto");
    persistDisplayTheme("dark");
    expect(localStorage.getItem(displayThemeStorageKey)).toBe("dark");
    expect(readDisplayTheme()).toBe("dark");
    localStorage.setItem(displayThemeStorageKey, "nope");
    expect(readDisplayTheme()).toBe("auto");
  });

  it("treats blocked storage as auto and still applies the attribute", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readDisplayTheme()).toBe("auto");
    expect(() => commitDisplayTheme("dark")).not.toThrow();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("clears data-theme for light, sets it for dark, and follows the system for auto", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    applyDisplayTheme("light");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);

    applyDisplayTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    const listeners = new Set<(event: { matches: boolean }) => void>();
    const media = {
      matches: false,
      addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
        listeners.add(listener);
      },
      removeEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
        listeners.delete(listener);
      },
    };
    vi.stubGlobal("matchMedia", () => media);

    applyDisplayTheme("auto");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);

    media.matches = true;
    for (const listener of listeners) listener({ matches: true });
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    applyDisplayTheme("light");
    expect(listeners.size).toBe(0);
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("notifies subscribers when the theme is committed", () => {
    const listener = vi.fn();
    const stop = subscribeDisplayTheme(listener);
    commitDisplayTheme("light");
    expect(listener).toHaveBeenCalledOnce();
    stop();
    commitDisplayTheme("dark");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("hides the grid control and does not capture G", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    const onThemeChange = vi.fn();
    const onGridVisibleChange = vi.fn();

    act(() => {
      root?.render(
        createElement(DisplayControls, {
          controls: "theme",
          theme: "auto",
          onThemeChange,
          onGridVisibleChange,
        }),
      );
    });

    expect(container.textContent).not.toContain("Grid");
    expect(container.querySelector("[aria-keyshortcuts='G']")).toBeNull();

    const gridEvent = new KeyboardEvent("keydown", { key: "g", bubbles: true, cancelable: true });
    act(() => {
      window.dispatchEvent(gridEvent);
    });
    expect(gridEvent.defaultPrevented).toBe(false);
    expect(onGridVisibleChange).not.toHaveBeenCalled();

    const themeEvent = new KeyboardEvent("keydown", { key: "t", bubbles: true, cancelable: true });
    act(() => {
      window.dispatchEvent(themeEvent);
    });
    expect(themeEvent.defaultPrevented).toBe(true);
    expect(onThemeChange).toHaveBeenCalledWith("light");
  });
});
