/** @vitest-environment happy-dom */
import { createElement, useRef, useState } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { kbdChoiceKeysTypingTarget, useKbdChoiceKeys } from "./useKbdChoiceKeys";

function Harness({
  enabled = true,
  onChoice,
}: {
  enabled?: boolean;
  onChoice: (key: string) => void;
}) {
  useKbdChoiceKeys({
    enabled,
    choices: {
      "1": () => onChoice("1"),
      "2": () => onChoice("2"),
      "3": () => onChoice("3"),
      "4": () => onChoice("4"),
    },
  });
  return createElement("div", null, "ready");
}

function FieldHarness({ onChoice }: { onChoice: (key: string) => void }) {
  const [value, setValue] = useState("");
  useKbdChoiceKeys({
    choices: {
      "1": () => onChoice("1"),
    },
  });
  return createElement("input", {
    value,
    onChange: (event: { target: { value: string } }) => setValue(event.target.value),
  });
}

function ScopedHarness({ onChoice }: { onChoice: (key: string) => void }) {
  const scope = useRef<HTMLDivElement>(null);
  useKbdChoiceKeys({ scope, choices: { "1": () => onChoice("1") } });
  return createElement(
    "div",
    null,
    createElement("button", { id: "outside", type: "button" }, "Outside"),
    createElement(
      "div",
      { ref: scope },
      createElement("input", { id: "choice", type: "checkbox" }),
      createElement("input", { id: "text", type: "text" }),
    ),
  );
}

describe("kbdChoiceKeysTypingTarget", () => {
  it("treats text entry as typing and choice inputs as not", () => {
    const make = (type: string) => Object.assign(document.createElement("input"), { type });
    expect(kbdChoiceKeysTypingTarget(make("text"))).toBe(true);
    expect(kbdChoiceKeysTypingTarget(make("email"))).toBe(true);
    expect(kbdChoiceKeysTypingTarget(document.createElement("textarea"))).toBe(true);
    expect(kbdChoiceKeysTypingTarget(make("checkbox"))).toBe(false);
    expect(kbdChoiceKeysTypingTarget(make("radio"))).toBe(false);
    expect(kbdChoiceKeysTypingTarget(document.createElement("button"))).toBe(false);
  });
});

describe("useKbdChoiceKeys", () => {
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

  it("invokes the matching choice for digit keys", () => {
    const onChoice = vi.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(Harness, { onChoice }));
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "2", bubbles: true }));
    });

    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith("2");
  });

  it("stays idle when enabled is false", () => {
    const onChoice = vi.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(Harness, { enabled: false, onChoice }));
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
    });

    expect(onChoice).not.toHaveBeenCalled();
  });

  it("ignores digit keys while focus is in a text field", () => {
    const onChoice = vi.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(FieldHarness, { onChoice }));
    });

    const field = container.querySelector("input");
    if (!(field instanceof HTMLInputElement)) {
      throw new Error("Field harness did not render an input");
    }
    act(() => {
      field.focus();
      field.dispatchEvent(
        new KeyboardEvent("keydown", { key: "1", bubbles: true, cancelable: true }),
      );
    });

    expect(onChoice).not.toHaveBeenCalled();
  });

  it("with a scope, acts only while focus is inside it — a focused checkbox included", () => {
    const onChoice = vi.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(ScopedHarness, { onChoice }));
    });
    const press = (id: string) => {
      const element = container?.querySelector<HTMLElement>(`#${id}`);
      if (element == null) throw new Error(`Missing #${id}`);
      element.focus();
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true, cancelable: true }));
    };

    act(() => {
      press("outside");
    });
    expect(onChoice).not.toHaveBeenCalled();
    act(() => {
      press("choice");
    });
    expect(onChoice).toHaveBeenCalledTimes(1);
    act(() => {
      press("text");
    });
    expect(onChoice).toHaveBeenCalledTimes(1);
  });
});
