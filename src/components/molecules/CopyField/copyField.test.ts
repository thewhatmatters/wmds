/** @vitest-environment happy-dom */
import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buttonStatusHoldMs } from "../../atoms/Button/Button";
import { CopyField, copyFieldFallbackHint } from "./CopyField";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Motion cancels WAAPI animations on update. happy-dom rejects `animation.finished`
// with AbortError and nothing catches it, which fails the Vitest run.
if (typeof window !== "undefined" && window.Animation != null) {
  const cancel = window.Animation.prototype.cancel;
  window.Animation.prototype.cancel = function cancelWithoutUnhandledAbort(this: Animation) {
    void this.finished.catch(() => {});
    return cancel.call(this);
  };
}

const secret = "wm_test_4f8c2a91e0b7";

function mount(props: ComponentProps<typeof CopyField>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      createElement(MotionConfig, { reducedMotion: "always" }, createElement(CopyField, props)),
    );
  });
  const field = container.querySelector("input");
  const button = container.querySelector("button");
  const hint = container.querySelector("[role='status']");
  if (field == null || button == null || hint == null) {
    throw new Error("CopyField did not render a field, button, and status hint");
  }
  return { container, root, field, button, hint };
}

async function settle() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("CopyField", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;
  const consoleMethods = ["log", "info", "debug", "warn", "error"] as const;
  let consoleSpies: Array<ReturnType<typeof vi.spyOn>> = [];

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
    root = undefined;
    container = undefined;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function watchConsole() {
    consoleSpies = consoleMethods.map((method) => vi.spyOn(console, method).mockImplementation(() => {}));
  }

  function assertSecretUnlogged() {
    for (const spy of consoleSpies) {
      for (const args of spy.mock.calls) {
        const rendered = args
          .map((arg: unknown) => {
            if (typeof arg === "string") return arg;
            if (arg instanceof Error) return `${arg.name} ${arg.message}`;
            return "";
          })
          .join(" ");
        expect(rendered).not.toContain(secret);
      }
    }
  }

  it("shows Copied, announces it, and returns after the hold", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    watchConsole();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const view = mount({ label: "API key", value: secret });
    root = view.root;
    container = view.container;

    expect(view.field.readOnly).toBe(true);
    expect(view.field.className).toContain("type-code");
    expect(view.button.getAttribute("aria-live")).toBe("polite");
    expect(view.button.getAttribute("data-status")).toBe("idle");
    expect(view.button.textContent).toContain("Copy key");

    view.button.focus();
    expect(document.activeElement).toBe(view.button);

    await act(async () => {
      view.button.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(secret);
    expect(view.button.getAttribute("data-status")).toBe("success");
    expect(view.button.textContent).toContain("Copied");
    expect(view.hint.textContent).toBe("");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(buttonStatusHoldMs);
    });

    expect(view.button.getAttribute("data-status")).toBe("idle");
    expect(view.button.textContent).toContain("Copy key");
    assertSecretUnlogged();
  });

  it("copies when the button is activated from the keyboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const view = mount({ label: "API key", value: secret });
    root = view.root;
    container = view.container;

    expect(view.button.tagName).toBe("BUTTON");
    expect(view.button.getAttribute("type")).toBe("button");
    view.button.focus();

    await act(async () => {
      view.button.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
      );
    });
    await settle();
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(secret);

    await act(async () => {
      view.button.dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }),
      );
    });
    await settle();
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it("selects the value and shows the shortcut hint when the clipboard is blocked", async () => {
    watchConsole();
    const writeText = vi.fn().mockRejectedValue(new Error(`NotAllowedError: failed to copy ${secret}`));
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const execCommand = vi.fn().mockReturnValue(false);
    document.execCommand = execCommand;

    const view = mount({ label: "API key", value: secret });
    root = view.root;
    container = view.container;

    await act(async () => {
      view.button.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith(secret);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(view.field.selectionStart).toBe(0);
    expect(view.field.selectionEnd).toBe(secret.length);
    expect(view.button.getAttribute("data-status")).toBe("idle");
    expect(view.button.textContent).not.toContain("Copied");
    expect(view.hint.getAttribute("aria-live")).toBe("polite");
    expect(view.hint.textContent).toBe(copyFieldFallbackHint);
    expect(view.field.getAttribute("aria-describedby")).toBe(view.hint.id);
    assertSecretUnlogged();
  });

  it("uses the same fallback when the Clipboard API is missing", async () => {
    watchConsole();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    const view = mount({ label: "API key", value: secret });
    root = view.root;
    container = view.container;

    await act(async () => {
      view.button.click();
      await Promise.resolve();
    });

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(view.field.selectionStart).toBe(0);
    expect(view.field.selectionEnd).toBe(secret.length);
    expect(view.hint.textContent).toBe(copyFieldFallbackHint);
    assertSecretUnlogged();
  });

  it("keeps a pinned copied state past the hold", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const view = mount({ label: "API key", value: secret, state: "copied" });
    root = view.root;
    container = view.container;

    expect(view.button.getAttribute("data-status")).toBe("success");
    expect(view.button.textContent).toContain("Copied");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(buttonStatusHoldMs + 500);
    });

    expect(view.button.getAttribute("data-status")).toBe("success");
    expect(view.hint.textContent).toBe("");
  });

  it("seats the button inside the pill and truncates a long value", () => {
    const longKey = `wm_test_${"a".repeat(80)}`;
    const view = mount({ label: "API key", value: longKey });
    root = view.root;
    container = view.container;

    const shell = view.button.parentElement;
    expect(shell).not.toBeNull();
    expect(shell?.contains(view.field)).toBe(true);
    expect(shell?.className).toContain("rounded-[1.625rem]");
    expect(shell?.className).toContain("items-end");
    expect(view.field.className).toContain("truncate");
    expect(view.field.className).toContain("min-w-0");
    expect(view.button.className).toContain("shrink-0");
    expect(view.field.className).not.toContain("absolute");
    // Only its touch-target layer (after:) is absolute; the button itself sits in the flex row.
    expect(view.button.className.split(" ")).not.toContain("absolute");
    expect(view.button.className).toContain("pointer-coarse:after:absolute");
    expect(view.field.value).toBe(longKey);

    const label = view.container.querySelector("label");
    expect(label?.getAttribute("for")).toBe(view.field.id);
    expect(label?.className).toContain("type-label");
    expect(label?.className).not.toContain("text-fg");
    expect(view.hint.className).toContain("type-supporting");
    expect(view.hint.className).not.toContain("text-muted");
    expect(shell?.contains(label)).toBe(false);
    expect(shell?.contains(view.hint)).toBe(false);
  });
});
