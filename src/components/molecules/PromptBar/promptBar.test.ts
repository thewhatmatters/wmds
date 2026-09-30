/** @vitest-environment happy-dom */
import { createElement, type ComponentProps } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PromptBar } from "./PromptBar";

function mount(props: ComponentProps<typeof PromptBar>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(createElement(PromptBar, props));
  });
  const field = container.querySelector("textarea");
  const send = container.querySelector("button");
  if (field == null || send == null) {
    throw new Error("PromptBar did not render a field and send control");
  }
  return { container, root, field, send };
}

describe("PromptBar", () => {
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

  it("disables send when the field is empty", () => {
    const view = mount({ value: "", onValueChange: () => {}, onSend: () => {} });
    root = view.root;
    container = view.container;

    expect(view.field).toHaveProperty("placeholder", "Ask anything…");
    expect(view.send).toHaveProperty("disabled", true);
    expect(view.send.getAttribute("aria-label")).toBe("Send");
  });

  it("disables send when the draft is only whitespace", () => {
    const view = mount({ value: "   ", onValueChange: () => {}, onSend: () => {} });
    root = view.root;
    container = view.container;

    expect(view.send).toHaveProperty("disabled", true);
  });

  it("calls the send handler when Enter is pressed", () => {
    const onSend = vi.fn();
    const view = mount({ value: "Name the work", onValueChange: () => {}, onSend });
    root = view.root;
    container = view.container;

    expect(view.send).toHaveProperty("disabled", false);
    expect(view.send.className).toContain("bg-brand");
    expect(view.send.className).toContain("text-on-brand");

    act(() => {
      view.field.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
      );
    });

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith("Name the work");
  });

  it("does not send on Shift+Enter", () => {
    const onSend = vi.fn();
    const view = mount({ value: "Name the work", onValueChange: () => {}, onSend });
    root = view.root;
    container = view.container;

    act(() => {
      view.field.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send on Enter when the field is empty", () => {
    const onSend = vi.fn();
    const view = mount({ value: "", onValueChange: () => {}, onSend });
    root = view.root;
    container = view.container;

    act(() => {
      view.field.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
      );
    });

    expect(onSend).not.toHaveBeenCalled();
  });
});
