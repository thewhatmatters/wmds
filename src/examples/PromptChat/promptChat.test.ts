/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import {
  AskWhatMatters,
  promptChatHeadline,
  promptChatPatternCopySource,
} from "./PromptChatPattern";
import {
  promptChatActionsClasses,
  promptChatBarClasses,
  promptChatColumnClasses,
  promptChatComposerClasses,
  promptChatFollowUpClasses,
  promptChatFollowUpsClasses,
  promptChatHeadlineClasses,
  promptChatPageClasses,
  promptChatReplyClasses,
  promptChatStageClasses,
  promptChatThreadClasses,
  promptChatThinkingLabelClasses,
  promptChatTraceBodyClasses,
  promptChatTraceChevronClasses,
  promptChatTraceClasses,
  promptChatTraceIconClasses,
  promptChatTraceLineClasses,
  promptChatTraceSpinClasses,
  promptChatUserClasses,
} from "./promptChatStyles";
import {
  promptChatFollowUps,
  promptChatPartDelay,
  promptChatReplyParts,
  promptChatSampleReply,
} from "./promptChatStream";
import {
  promptChatThoughtLabel,
  promptChatThinkingLabel,
  promptChatTraceDurationSeconds,
  promptChatTraces,
} from "./promptChatThinking";

const nativeAnimate = HTMLElement.prototype.animate;

beforeAll(() => {
  // happy-dom rejects Animation.cancel. The trace unmounts mid-shimmer when the reply starts.
  HTMLElement.prototype.animate = () =>
    ({
      cancel: () => undefined,
      finish: () => undefined,
      play: () => undefined,
      pause: () => undefined,
      persist: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      finished: Promise.resolve(),
      ready: Promise.resolve(),
    }) as unknown as Animation;
});

afterAll(() => {
  HTMLElement.prototype.animate = nativeAnimate;
});

function mount(trace?: "steps" | "reasoning") {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(createElement(AskWhatMatters, trace == null ? {} : { trace }));
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
    expect(view.container.textContent).toContain("Thinking");
    expect(view.container.textContent).not.toContain("Thought for a few seconds");
    expect(view.container.textContent).not.toContain(promptChatSampleReply);
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
    expect(view.container.textContent).toContain("Thinking");
    expect(view.container.textContent).not.toContain(promptChatSampleReply);
  });

  it("mirrors the pattern in Show code", () => {
    const source = readFileSync(join(import.meta.dirname, "promptChatStyles.ts"), "utf8");
    for (const classes of [
      promptChatPageClasses,
      promptChatColumnClasses,
      promptChatComposerClasses,
      promptChatStageClasses,
      promptChatHeadlineClasses,
      promptChatThreadClasses,
      promptChatUserClasses,
  promptChatReplyClasses,
  promptChatTraceClasses,
  promptChatTraceBodyClasses,
  promptChatTraceLineClasses,
  promptChatThinkingLabelClasses,
  promptChatTraceIconClasses,
  promptChatTraceChevronClasses,
  promptChatTraceSpinClasses,
  promptChatActionsClasses,
      promptChatFollowUpClasses,
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
    expect(promptChatPatternCopySource).toContain("opacity: 0");
    expect(promptChatPatternCopySource).not.toContain("layoutId");
    expect(promptChatPatternCopySource).toContain("useReducedMotion");
    expect(promptChatPatternCopySource).toContain(promptChatHeadline);
    expect(promptChatPatternCopySource).toContain(promptChatSampleReply);
    expect(promptChatPatternCopySource).toContain(promptChatThinkingLabel);
    expect(promptChatPatternCopySource).not.toContain(promptChatThoughtLabel);
    expect(promptChatPageClasses).toContain("h-[100svh]");
    expect(promptChatPageClasses).toContain("overflow-hidden");
    expect(promptChatPageClasses).not.toContain("h-full");
    expect(promptChatColumnClasses).toContain("[--grid-max:40rem]");
    expect(promptChatComposerClasses).toBe("col-span-full");
    expect(promptChatPatternCopySource).toContain("[--grid-max:40rem]");
    expect(promptChatPatternCopySource).not.toContain("lg:col-start-4");
    expect(promptChatPatternCopySource).toContain("!border-border");
    expect(promptChatPatternCopySource).not.toContain("ExampleGridControls");
  });

  it("scrolls again after the reply has grown", async () => {
    const view = mount();
    root = view.root;
    container = view.container;
    const stage = view.container.querySelector("main");
    if (stage == null) throw new Error("Prompt chat did not render a stage");
    const writes: number[] = [];
    Object.defineProperty(stage, "scrollHeight", { configurable: true, get: () => 940 });
    Object.defineProperty(stage, "scrollTop", {
      configurable: true,
      get: () => writes.at(-1) ?? 0,
      set: (value: number) => {
        writes.push(value);
      },
    });

    typeDraft(view.field, "What services do you offer?");
    act(() => {
      view.send.click();
    });
    const afterSend = writes.length;
    expect(afterSend).toBeGreaterThan(0);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2800));
    });

    expect(writes.length).toBeGreaterThan(afterSend);
    expect(writes.at(-1)).toBe(940);
  });

  it("removes the steps trace when the reply starts", async () => {
    const view = mount();
    root = view.root;
    container = view.container;

    typeDraft(view.field, "What services do you offer?");
    act(() => {
      view.send.click();
    });

    expect(view.container.textContent).toContain("Thinking");

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2800));
    });

    expect(view.container.textContent).toContain(promptChatSampleReply);
    expect(view.container.textContent).not.toContain("Thinking");
    expect(view.container.textContent).not.toContain(promptChatThoughtLabel);
  });

  it("appends a follow-up in the same thread", async () => {
    const view = mount();
    root = view.root;
    container = view.container;

    typeDraft(view.field, "What services do you offer?");
    act(() => {
      view.send.click();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2800));
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    });

    const followUp = Array.from(view.container.querySelectorAll("button")).find(
      (button) => button.textContent === promptChatFollowUps[0],
    );
    if (followUp == null) {
      throw new Error("The first reply did not offer a follow-up");
    }
    act(() => {
      followUp.click();
    });

    const text = view.container.textContent ?? "";
    expect(text).toContain("What services do you offer?");
    expect(text.split(promptChatSampleReply).length - 1).toBe(1);
    expect(text).toContain(promptChatFollowUps[0]);
    expect(text).toContain("Thinking");
    expect(view.container.querySelector("h1")).toBeNull();
  });

  it("keeps the settled trace on the reasoning story", async () => {
    const view = mount("reasoning");
    root = view.root;
    container = view.container;

    typeDraft(view.field, "What services do you offer?");
    act(() => {
      view.send.click();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    expect(view.container.textContent).toContain(promptChatSampleReply);
    expect(view.container.textContent).toContain(promptChatThoughtLabel);
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

describe("prompt chat thinking trace", () => {
  it("keeps four scripts on one trace and skips the play when motion is reduced", () => {
    expect(promptChatTraces.steps.length).toBeGreaterThan(1);
    expect(promptChatTraces.reasoning.length).toBeGreaterThan(0);
    expect(promptChatTraces.search.some((entry) => entry.kind === "source")).toBe(true);
    expect(promptChatTraces.coding.some((entry) => entry.kind === "command")).toBe(true);
    expect(promptChatTraceDurationSeconds(promptChatTraces.steps.length)).toBeGreaterThan(0);
    expect(promptChatTraceDurationSeconds(promptChatTraces.steps.length, true)).toBe(0);
  });
});
