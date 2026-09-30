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
} from "./PromptChatPattern";
import {
  promptChatActionsClasses,
  promptChatBarClasses,
  promptChatColumnClasses,
  promptChatFollowUpsClasses,
  promptChatHeadlineClasses,
  promptChatPageClasses,
  promptChatReplyClasses,
  promptChatStageClasses,
  promptChatThreadClasses,
  promptChatUserClasses,
} from "./promptChatStyles";
import { promptChatPartDelay, promptChatReplyParts, promptChatSampleReply } from "./promptChatStream";

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
    expect(view.container.querySelector("header")).toBeNull();
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
    expect(view.container.querySelector("header")).not.toBeNull();
    expect(view.container.textContent).toContain("What services do you offer?");
    expect(view.container.textContent).toContain(promptChatSampleReply);
    expect(view.container.querySelector("a[href='/notes']")?.textContent).toBe("studio notes");
    expect(view.container.querySelector("[aria-label='Copy reply']")).toBeNull();
    expect(view.field).toHaveProperty("value", "");
  });

  it("returns to the landing when the brand mark is pressed", () => {
    const view = mount();
    root = view.root;
    container = view.container;

    typeDraft(view.field, "What services do you offer?");
    act(() => {
      view.send.click();
    });

    const home = view.container.querySelector("a[aria-label='WhatMatters']");
    if (home == null) {
      throw new Error("Chat did not render the SiteNav brand mark");
    }
    act(() => {
      home.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });

    expect(view.container.querySelector("h1")?.textContent).toBe(promptChatHeadline);
    expect(view.container.querySelector("header")).toBeNull();
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
      promptChatColumnClasses,
      promptChatStageClasses,
      promptChatHeadlineClasses,
      promptChatThreadClasses,
      promptChatUserClasses,
      promptChatReplyClasses,
      promptChatActionsClasses,
      promptChatFollowUpsClasses,
      promptChatBarClasses,
    ]) {
      expect(source).toContain(classes);
      expect(promptChatPatternCopySource).toContain(classes);
    }
    expect(promptChatPatternCopySource).toContain('from "@whatmatters/wmds"');
    expect(promptChatPatternCopySource).toContain("PromptBar");
    expect(promptChatPatternCopySource).toContain("TextLink");
    expect(promptChatPatternCopySource).toContain("IconButton");
    expect(promptChatPatternCopySource).toContain("SiteNav");
    expect(promptChatPatternCopySource).toContain("motion/react");
    expect(promptChatPatternCopySource).toContain("useReducedMotion");
    expect(promptChatPatternCopySource).toContain(promptChatHeadline);
    expect(promptChatPatternCopySource).toContain(promptChatSampleReply);
    expect(promptChatPatternCopySource).not.toContain("ExampleGridControls");
  });
});

describe("prompt chat stream timing", () => {
  const sourceIndex = promptChatReplyParts.findIndex((part) => part.kind === "source");

  it("holds the source until the word before it has arrived", () => {
    const before = promptChatPartDelay(sourceIndex - 1);
    const source = promptChatPartDelay(sourceIndex);
    const after = promptChatPartDelay(sourceIndex + 1);
    expect(source - before).toBeCloseTo(0.175);
    expect(after - source).toBeCloseTo(0.175);
    expect(promptChatPartDelay(1)).toBeCloseTo(0.06);
  });

  it("shows every part immediately when motion is reduced", () => {
    expect(promptChatPartDelay(sourceIndex, true)).toBe(0);
    expect(promptChatPartDelay(promptChatReplyParts.length - 1, true)).toBe(0);
  });
});
