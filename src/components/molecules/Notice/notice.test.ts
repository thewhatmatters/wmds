/** @vitest-environment happy-dom */
import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Notice, noticeStoragePrefix, noticeTones } from "./Notice";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

function mount(props: ComponentProps<typeof Notice>, after?: string) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root?.render(
      createElement(
        "div",
        null,
        createElement(Notice, props),
        after != null ? createElement("a", { href: "#next" }, after) : null,
      ),
    );
  });
  return container;
}

function dismissButton(scope: HTMLElement) {
  const button = scope.querySelector<HTMLButtonElement>("button[aria-label]");
  if (button == null) throw new Error("No Dismiss button");
  return button;
}

describe("Notice", () => {
  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    root = undefined;
    container = undefined;
    window.localStorage.clear();
  });

  it("renders title, copy, and action, with no live role by default", () => {
    const scope = mount({
      tone: "info",
      title: "Closed Thanksgiving Day",
      children: "We reopen Friday.",
      action: createElement("a", { href: "/hours" }, "See hours"),
    });
    const notice = scope.querySelector("[data-tone='info']");
    expect(notice?.textContent).toContain("Closed Thanksgiving Day");
    expect(notice?.textContent).toContain("We reopen Friday.");
    expect(notice?.querySelector("a[href='/hours']")).not.toBeNull();
    expect(notice?.getAttribute("role")).toBeNull();
    expect(notice?.querySelector("button")).toBeNull();
  });

  it("announces with status, or alert for error, only when live", () => {
    for (const tone of noticeTones) {
      const scope = mount({ tone, title: "T", live: true });
      const role = scope.querySelector(`[data-tone='${tone}']`)?.getAttribute("role");
      expect(role).toBe(tone === "error" ? "alert" : "status");
      act(() => root?.unmount());
      container?.remove();
    }
  });

  it("takes an explicit live role over the tone's", () => {
    const urgent = mount({ tone: "warning", title: "T", live: "alert" });
    expect(urgent.querySelector("[data-tone='warning']")?.getAttribute("role")).toBe("alert");
    act(() => root?.unmount());
    container?.remove();
    const polite = mount({ tone: "error", title: "T", live: "status" });
    expect(polite.querySelector("[data-tone='error']")?.getAttribute("role")).toBe("status");
  });

  it("draws the tone icon, a replacement, or none", () => {
    expect(mount({ tone: "warning", title: "T" }).querySelector("svg")).not.toBeNull();
    act(() => root?.unmount());
    expect(mount({ tone: "warning", title: "T", icon: false }).querySelector("svg")).toBeNull();
  });

  it("dismisses, calls onDismiss once, and moves focus to the next control", () => {
    const onDismiss = vi.fn();
    const scope = mount({ title: "T", dismissible: true, dismissLabel: "Hide", onDismiss }, "Next");
    const button = dismissButton(scope);
    expect(button.getAttribute("aria-label")).toBe("Hide");
    button.focus();
    act(() => button.click());
    expect(scope.querySelector("[data-tone]")).toBeNull();
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(document.activeElement?.textContent).toBe("Next");
  });

  it("remembers a dismissal under dismissKey and hides on the next mount", () => {
    const scope = mount({ title: "T", dismissible: true, dismissKey: "holiday-2026" });
    act(() => dismissButton(scope).click());
    expect(window.localStorage.getItem(`${noticeStoragePrefix}holiday-2026`)).toBe("1");
    act(() => root?.unmount());
    container?.remove();

    expect(mount({ title: "T", dismissKey: "holiday-2026" }).querySelector("[data-tone]")).toBeNull();
    act(() => root?.unmount());
    container?.remove();
    expect(mount({ title: "T", dismissKey: "holiday-2027" }).querySelector("[data-tone]")).not.toBeNull();
  });

  it("still hides for the page view when storage throws", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const scope = mount({ title: "T", dismissible: true, dismissKey: "k" });
    act(() => dismissButton(scope).click());
    expect(scope.querySelector("[data-tone]")).toBeNull();
    setItem.mockRestore();
  });

  it("server-renders the notice even when a dismissKey is set", () => {
    window.localStorage.setItem(`${noticeStoragePrefix}k`, "1");
    const html = renderToString(createElement(Notice, { title: "Server", dismissKey: "k" }));
    expect(html).toContain("Server");
  });
});
