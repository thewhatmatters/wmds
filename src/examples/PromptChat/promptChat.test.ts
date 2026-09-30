/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  AskWhatMatters,
  promptChatHeadline,
  promptChatPatternCopySource,
  promptChatSampleReply,
} from "./PromptChatPattern";
import {
  promptChatBarClasses,
  promptChatHeadlineClasses,
  promptChatPageClasses,
  promptChatReplyClasses,
  promptChatStageClasses,
  promptChatThreadClasses,
  promptChatUserClasses,
} from "./promptChatStyles";

function mount() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(createElement(AskWhatMatters));
  });
  const field = container.querySelector("textarea");
  const send = container.querySelector("button");
  if (field == null || send == null) {
    throw new Error("Prompt chat did not render a field and send control");
  }
  return { container, root, field, send };
}

function typeDraft(field: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  act(() => {
    setter?.call(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("prompt chat pattern", () => {
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

  it("starts on the landing headline", () => {
    const view = mount();
    root = view.root;
    container = view.container;

    expect(view.container.querySelector("h1")?.textContent).toBe(promptChatHeadline);
    expect(view.container.textContent).not.toContain(promptChatSampleReply);
    expect(view.send).toHaveProperty("disabled", true);
  });

  it("moves to chat when Enter sends a prompt", () => {
    const view = mount();
    root = view.root;
    container = view.container;

    typeDraft(view.field, "What services do you offer?");
    act(() => {
      view.field.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
      );
    });

    expect(view.container.querySelector("h1")).toBeNull();
    expect(view.container.textContent).toContain("What services do you offer?");
    expect(view.container.textContent).toContain(promptChatSampleReply);
    expect(view.field).toHaveProperty("value", "");
  });

  it("moves to chat when the send control is clicked", () => {
    const view = mount();
    root = view.root;
    container = view.container;

    typeDraft(view.field, "What services do you offer?");
    act(() => {
      view.send.click();
    });

    expect(view.container.querySelector("h1")).toBeNull();
    expect(view.container.textContent).toContain(promptChatSampleReply);
  });

  it("mirrors the pattern in Show code", () => {
    const source = readFileSync(join(import.meta.dirname, "promptChatStyles.ts"), "utf8");
    for (const classes of [
      promptChatPageClasses,
      promptChatStageClasses,
      promptChatHeadlineClasses,
      promptChatThreadClasses,
      promptChatUserClasses,
      promptChatReplyClasses,
      promptChatBarClasses,
    ]) {
      expect(source).toContain(classes);
      expect(promptChatPatternCopySource).toContain(classes);
    }
    expect(promptChatPatternCopySource).toContain('from "@whatmatters/wmds"');
    expect(promptChatPatternCopySource).toContain("PromptBar");
    expect(promptChatPatternCopySource).toContain(promptChatHeadline);
    expect(promptChatPatternCopySource).toContain(promptChatSampleReply);
    expect(promptChatPatternCopySource).not.toContain("ExampleGridControls");
    expect(promptChatPatternCopySource).not.toContain("SiteNav");
  });
});
