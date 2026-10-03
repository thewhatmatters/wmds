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
  promptChatReplyBlockClasses,
  promptChatReplyClasses,
  promptChatStageClasses,
  promptChatStartGateCardClasses,
  promptChatStartGateOccupantClasses,
  promptChatStartGateOptionClasses,
  promptChatStartGateOptionNumberClasses,
  promptChatStartGateOptionsClasses,
  promptChatStartGateStepClasses,
  promptChatThreadClasses,
  promptChatThinkingLabelClasses,
  promptChatThoughtLabelClasses,
  promptChatTraceBodyClasses,
  promptChatTraceChevronClasses,
  promptChatTraceClasses,
  promptChatTraceIconClasses,
  promptChatTraceLineClasses,
  promptChatTraceSpinClasses,
  promptChatTraceTriggerClasses,
  promptChatUserClasses,
} from "./promptChatStyles";
import {
  promptChatFollowUps,
  promptChatPartDelay,
  promptChatReplyParts,
  promptChatSampleReply,
} from "./promptChatStream";
import {
  promptChatThoughtForLabel,
  promptChatThoughtLabel,
  promptChatTraceDurationSeconds,
  promptChatTraces,
} from "./promptChatThinking";
import {
  promptChatIntakeQaPairs,
  promptChatStartGateTitle,
  promptChatStartOptions,
} from "./PromptChatStartGate";
import { intakeAboutEmpty } from "../../../components/molecules/IntakeForm/IntakeForm";

/** Steps duration (~4s) plus a buffer so the reply has started. */
const stepsReadyMs = Math.ceil(promptChatTraceDurationSeconds(promptChatTraces.steps.length) * 1000) + 400;
/** Reasoning duration plus buffer. */
const reasoningReadyMs =
  Math.ceil(promptChatTraceDurationSeconds(promptChatTraces.reasoning.length) * 1000) + 400;
/** Word stream after the reply starts (last part delay + settle + slack). */
const streamDoneMs = 2200;

const nativeAnimate = HTMLElement.prototype.animate;

beforeAll(() => {
  // happy-dom rejects Animation.cancel. The trace unmounts mid-play when the reply starts.
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
    // The component defaults its whole props argument, so the props type is spelled out here.
    root.render(createElement<{ trace?: "steps" | "reasoning" }>(AskWhatMatters, { trace }));
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
    expect(view.container.textContent).toContain(promptChatThoughtForLabel(1));
    expect(view.container.textContent).not.toContain("Thinking");
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
    expect(view.container.textContent).toContain(promptChatThoughtForLabel(1));
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
      promptChatReplyBlockClasses,
      promptChatTraceClasses,
      promptChatTraceTriggerClasses,
      promptChatTraceBodyClasses,
      promptChatTraceLineClasses,
      promptChatThinkingLabelClasses,
      promptChatThoughtLabelClasses,
      promptChatTraceIconClasses,
      promptChatTraceChevronClasses,
      promptChatTraceSpinClasses,
      promptChatActionsClasses,
      promptChatFollowUpClasses,
      promptChatFollowUpsClasses,
      promptChatBarClasses,
      promptChatStartGateStepClasses,
      promptChatStartGateCardClasses,
      promptChatStartGateOccupantClasses,
      promptChatStartGateOptionsClasses,
      promptChatStartGateOptionClasses,
      promptChatStartGateOptionNumberClasses,
    ]) {
      expect(source).toContain(classes);
      expect(promptChatPatternCopySource).toContain(classes);
    }
    expect(promptChatStartGateCardClasses).toBe("h-[411px]");
    expect(promptChatPatternCopySource).toContain("h-[411px]");
    expect(promptChatPatternCopySource).toContain('className={startGateCardClasses}');
    expect(promptChatPatternCopySource).not.toContain("startGateBodyClasses");
    expect(promptChatPatternCopySource).not.toContain("intakeModalBodyClasses");
    expect(promptChatPatternCopySource).not.toContain("overlayPanelBodyScrollClasses");
    expect(promptChatPatternCopySource).toContain('from "@whatmatters/wmds"');
    expect(promptChatPatternCopySource).toContain("PromptBar");
    expect(promptChatPatternCopySource).toContain("TextLink");
    expect(promptChatPatternCopySource).toContain("IconButton");
    expect(promptChatPatternCopySource).toContain("SiteNav");
    expect(promptChatPatternCopySource).toContain("Sparkle");
    expect(promptChatPatternCopySource).toContain("ChevronDown");
    expect(promptChatPatternCopySource).toContain("motion/react");
    expect(promptChatPatternCopySource).toContain("opacity: 0");
    expect(promptChatPatternCopySource).not.toContain("layoutId");
    expect(promptChatPatternCopySource).toContain("useReducedMotion");
    expect(promptChatPatternCopySource).toContain(promptChatHeadline);
    expect(promptChatPatternCopySource).toContain(promptChatSampleReply);
    expect(promptChatPatternCopySource).toContain(promptChatThoughtLabel);
    expect(promptChatPatternCopySource).toContain("thoughtForLabel");
    expect(promptChatPatternCopySource).toContain("group-hover/reply");
    expect(promptChatPatternCopySource).toContain("data-actions=");
    expect(promptChatPatternCopySource).toContain('data-reply-actions=""');
    expect(promptChatPatternCopySource).toContain("Start Project");
    expect(promptChatPatternCopySource).toContain("Card");
    expect(promptChatPatternCopySource).toContain("Card.Header");
    expect(promptChatPatternCopySource).toContain("Card.Body");
    expect(promptChatPatternCopySource).toContain("Card.Footer");
    expect(promptChatPatternCopySource).toContain("padding=\"none\"");
    expect(promptChatPatternCopySource).toContain("cardLayoutBodyOccupantWellClasses");
    expect(promptChatPatternCopySource).toContain("Checkbox");
    expect(promptChatPatternCopySource).toContain("Kbd");
    expect(promptChatPatternCopySource).toContain("useKbdChoiceKeys");
    expect(promptChatPatternCopySource).not.toContain("Badge");
    expect(promptChatPatternCopySource).toContain("PillGroup");
    expect(promptChatPatternCopySource).toContain("IntakeForm");
    expect(promptChatPatternCopySource).toContain("CalEmbed");
    expect(promptChatPatternCopySource).toContain("CalEmbed.Skip");
    expect(promptChatPatternCopySource).toContain("skip={false}");
    expect(promptChatPatternCopySource).toContain("IntakeConfirmation");
    expect(promptChatPatternCopySource).toContain("ChatQa");
    expect(promptChatPatternCopySource).toContain("kind: \"intake\"");
    expect(promptChatPatternCopySource).toContain("finishStartGate");
    expect(promptChatPatternCopySource).toContain("ConfettiProvider");
    expect(promptChatPatternCopySource).toContain(promptChatStartGateTitle);
    expect(promptChatPatternCopySource).toContain("What are we making?");
    expect(promptChatPatternCopySource).toContain("ml-auto");
    expect(promptChatStartOptions.map((option) => option.label).join("|")).toContain("Brand identity");
    expect(promptChatStartOptions.map((option): string => option.label)).not.toContain("Web experience");
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

  it(
    "scrolls again after the reply has grown",
    async () => {
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
        await new Promise((resolve) => setTimeout(resolve, stepsReadyMs));
      });

      expect(writes.length).toBeGreaterThan(afterSend);
      expect(writes.at(-1)).toBe(940);
    },
    10_000,
  );

  it(
    "removes the steps trace when the reply starts",
    async () => {
      const view = mount();
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      expect(view.container.textContent).toContain(promptChatThoughtForLabel(1));
      expect(
        Array.from(view.container.querySelectorAll("button")).some((button) =>
          (button.textContent ?? "").includes("Thought for"),
        ),
      ).toBe(true);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, stepsReadyMs));
      });

      expect(view.container.textContent).toContain(promptChatSampleReply);
      expect(view.container.textContent).not.toContain("Thought for");
      expect(
        Array.from(view.container.querySelectorAll("button")).some((button) =>
          (button.textContent ?? "").includes("Thought for"),
        ),
      ).toBe(false);
    },
    10_000,
  );

  it(
    "expands the collapsed thought row while thinking",
    async () => {
      const view = mount();
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 550));
      });

      const trigger = Array.from(view.container.querySelectorAll("button")).find((button) =>
        (button.textContent ?? "").includes("Thought for"),
      );
      if (!(trigger instanceof HTMLButtonElement)) {
        throw new Error("Collapsed thought row did not render");
      }
      expect(trigger.getAttribute("aria-expanded")).toBe("false");

      act(() => {
        trigger.click();
      });

      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(view.container.textContent).toContain("Read the brief");
    },
    10_000,
  );

  it(
    "keeps reply actions hidden until the reply is hovered",
    async () => {
      const view = mount();
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, stepsReadyMs));
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, streamDoneMs));
      });

      const copy = view.container.querySelector("[aria-label='Copy reply']");
      if (!(copy instanceof HTMLElement)) {
        throw new Error("Copy action did not render after the stream");
      }
      const actions = copy.parentElement;
      if (actions == null) throw new Error("Actions row missing");
      expect(actions.className).toContain("opacity-0");
      expect(actions.className).toContain("group-hover/reply:opacity-100");
      expect(view.container.querySelector("[data-reply-actions]")).not.toBeNull();
    },
    12_000,
  );

  it(
    "appends a follow-up in the same thread",
    async () => {
      const view = mount();
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, stepsReadyMs));
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, streamDoneMs));
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
      expect(text).toContain("Thought for");
      expect(view.container.querySelector("h1")).toBeNull();
    },
    10_000,
  );

  it(
    "keeps the settled trace on the reasoning story",
    async () => {
      const view = mount("reasoning");
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, reasoningReadyMs));
      });

      expect(view.container.textContent).toContain(promptChatSampleReply);
      expect(view.container.textContent).toContain(promptChatThoughtLabel);
    },
    10_000,
  );
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
    expect(promptChatTraceDurationSeconds(promptChatTraces.steps.length)).toBeCloseTo(4);
    expect(promptChatTraceDurationSeconds(promptChatTraces.steps.length, true)).toBe(0);
    expect(promptChatThoughtForLabel(1)).toBe("Thought for 1 second");
    expect(promptChatThoughtForLabel(4)).toBe(promptChatThoughtLabel);
  });
});

describe("prompt chat start project gate", () => {
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

  it(
    "replaces the composer with the starter card in full chat, and Cancel restores it",
    async () => {
      const view = mount();
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, stepsReadyMs));
      });

      expect(view.container.querySelector("textarea")).not.toBeNull();
      expect(view.container.textContent).not.toContain(promptChatStartGateTitle);

      const start = Array.from(view.container.querySelectorAll("button")).find(
        (button) => button.textContent === "Start Project",
      );
      if (start == null) throw new Error("Start Project control missing in chat");
      act(() => {
        start.click();
      });

      expect(view.container.textContent).toContain(promptChatStartGateTitle);
      expect(view.container.textContent).toContain("What are we making?");
      expect(view.container.textContent).toContain("1 of 4");
      expect(view.container.textContent).toContain("Brand identity");
      expect(view.container.textContent).toContain("Design system");
      expect(view.container.textContent).not.toContain("Web experience");
      expect(view.container.textContent).not.toContain("A sharp presence");
      expect(view.container.querySelector("textarea")).toBeNull();
      expect(view.container.textContent).toContain("What services do you offer?");

      const card = view.container.querySelector('[aria-label="Name the work"]');
      expect(card?.getAttribute("data-layout")).toBe("shell");
      expect(card?.getAttribute("data-padding")).toBe("none");
      expect(card?.className).toContain("h-[411px]");
      expect(card?.querySelector(":scope > header")).not.toBeNull();
      expect(card?.querySelector(":scope > footer")).not.toBeNull();
      const body = [...(card?.children ?? [])].find(
        (el) => el instanceof HTMLElement && el.tagName === "DIV",
      );
      expect(body?.className).toContain("px-[2px]");
      // Scroll comes from Card when Footer is present — not a gate one-off.
      expect(body?.className).toContain("overflow-y-auto");
      expect(body?.className).toContain("flex-1");

      const keycaps = view.container.querySelectorAll("kbd");
      expect(keycaps.length).toBe(4);
      expect([...keycaps].map((node) => node.textContent).join("")).toBe("1234");

      const cancel = Array.from(view.container.querySelectorAll("button")).find(
        (button) => button.textContent === "Cancel",
      );
      if (cancel == null) throw new Error("Cancel missing on starter card");
      act(() => {
        cancel.click();
      });

      expect(view.container.querySelector("textarea")).not.toBeNull();
      expect(view.container.textContent).not.toContain(promptChatStartGateTitle);
    },
    12_000,
  );

  it(
    "toggles step-1 choices with digit keys while the gate is open",
    async () => {
      const view = mount();
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, stepsReadyMs));
      });

      const start = Array.from(view.container.querySelectorAll("button")).find(
        (button) => button.textContent === "Start Project",
      );
      if (start == null) throw new Error("Start Project control missing in chat");
      act(() => {
        start.click();
      });

      const brand = Array.from(view.container.querySelectorAll('input[type="checkbox"]')).find(
        (input) => input.closest("label")?.textContent?.includes("Brand identity"),
      );
      if (!(brand instanceof HTMLInputElement)) {
        throw new Error("Brand identity checkbox missing");
      }
      expect(brand.checked).toBe(false);

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true, cancelable: true }));
      });
      expect(brand.checked).toBe(true);

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true, cancelable: true }));
      });
      expect(brand.checked).toBe(false);
    },
    12_000,
  );

  it(
    "keeps one Start Project card height from step 1 through About you",
    async () => {
      const view = mount();
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, stepsReadyMs));
      });

      const start = Array.from(view.container.querySelectorAll("button")).find(
        (button) => button.textContent === "Start Project",
      );
      if (start == null) throw new Error("Start Project control missing in chat");
      act(() => {
        start.click();
      });

      const step1 = view.container.querySelector('[aria-label="Name the work"]');
      expect(step1?.className).toContain(promptChatStartGateCardClasses);

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true, cancelable: true }));
      });
      const next = Array.from(view.container.querySelectorAll("button")).find(
        (button) => button.textContent === "Next",
      );
      if (!(next instanceof HTMLButtonElement)) throw new Error("Next missing");
      act(() => {
        next.click();
      });

      const budget = view.container.querySelector('input[type="radio"][value="10-25"]');
      if (!(budget instanceof HTMLInputElement)) throw new Error("Budget pill missing");
      act(() => {
        budget.click();
      });
      act(() => {
        next.click();
      });

      const about = view.container.querySelector('[aria-label="About you"]');
      expect(about?.className).toContain(promptChatStartGateCardClasses);
      expect(about?.className).toBe(step1?.className);
      const aboutBody = [...(about?.children ?? [])].find(
        (el) => el instanceof HTMLElement && el.tagName === "DIV",
      );
      expect(aboutBody?.className).toContain("overflow-y-auto");
    },
    12_000,
  );

  it(
    "advances through intake steps 2–4 inside the starter card",
    async () => {
      const view = mount();
      root = view.root;
      container = view.container;

      typeDraft(view.field, "What services do you offer?");
      act(() => {
        view.send.click();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, stepsReadyMs));
      });

      const start = Array.from(view.container.querySelectorAll("button")).find(
        (button) => button.textContent === "Start Project",
      );
      if (start == null) throw new Error("Start Project control missing in chat");
      act(() => {
        start.click();
      });

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true, cancelable: true }));
      });

      const next = () => {
        const button = Array.from(view.container.querySelectorAll("button")).find(
          (node) => node.textContent === "Next",
        );
        if (!(button instanceof HTMLButtonElement)) throw new Error("Next missing");
        act(() => {
          button.click();
        });
      };

      next();
      expect(view.container.textContent).toContain("What's the budget?");
      expect(view.container.textContent).toContain("2 of 4");

      const budget = view.container.querySelector('input[type="radio"][value="10-25"]');
      if (!(budget instanceof HTMLInputElement)) throw new Error("Budget pill missing");
      act(() => {
        budget.click();
      });
      next();

      expect(view.container.textContent).toContain("About you");
      expect(view.container.textContent).toContain("3 of 4");
      const name = view.container.querySelector('input[aria-label="Name"]');
      const email = view.container.querySelector('input[aria-label="Email"]');
      const details = view.container.querySelector("textarea");
      if (
        !(name instanceof HTMLInputElement) ||
        !(email instanceof HTMLInputElement) ||
        !(details instanceof HTMLTextAreaElement)
      ) {
        throw new Error("About form fields missing");
      }
      const setValue = (field: HTMLInputElement | HTMLTextAreaElement, value: string) => {
        const proto =
          field instanceof HTMLTextAreaElement
            ? window.HTMLTextAreaElement.prototype
            : window.HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
        act(() => {
          setter?.call(field, value);
          field.dispatchEvent(new Event("input", { bubbles: true }));
        });
      };
      setValue(name, "Randy");
      setValue(email, "randy@whatmatters.so");
      setValue(details, "A starter site and brand line.");
      next();

      expect(view.container.textContent).toContain("Book a call");
      expect(view.container.textContent).toContain("4 of 4");
      expect(
        Array.from(view.container.querySelectorAll("button")).some(
          (button) => button.textContent === "Next",
        ),
      ).toBe(false);

      const skip = Array.from(view.container.querySelectorAll("a")).find(
        (node) => node.textContent === "Skip, just email me",
      );
      if (skip == null) throw new Error("CalEmbed skip link missing");
      expect(skip.closest("[data-cal-embed]")).toBeNull();
      expect(skip.closest("footer")).not.toBeNull();
      expect(view.container.querySelector("[data-cal-embed] a")).toBeNull();
      act(() => {
        skip.click();
      });

      expect(view.container.textContent).toContain("We'll be in touch");
      const done = Array.from(view.container.querySelectorAll("button")).find(
        (button) => button.textContent === "Done",
      );
      if (done == null) throw new Error("Done missing on confirmation");
      act(() => {
        done.click();
      });

      const qa = view.container.querySelector('[aria-label="Collected answers"]');
      expect(qa).not.toBeNull();
      expect(qa?.className).toContain("bg-surface");
      expect(qa?.className).toContain("border-border");
      expect(view.container.textContent).toContain("What are we making?");
      expect(view.container.textContent).toContain("Brand identity");
      expect(view.container.textContent).toContain("$10–25k");
      expect(view.container.textContent).toContain("Randy");
      expect(view.container.textContent).toContain("Email me");
      expect(view.container.querySelector("textarea")).not.toBeNull();
      expect(view.container.textContent).not.toContain(promptChatStartGateTitle);
    },
    15_000,
  );
});

describe("prompt chat intake Q&A pairs", () => {
  it("formats gate answers as ChatQa strings", () => {
    const pairs = promptChatIntakeQaPairs({
      needs: ["brand", "website"],
      budget: "10-25",
      about: { ...intakeAboutEmpty, name: "Randy", company: "WhatMatters" },
      outcome: "emailed",
    });
    expect(pairs).toEqual([
      { question: "What are we making?", answer: "Brand identity, Website" },
      { question: "What's the budget?", answer: "$10–25k" },
      { question: "About you", answer: "Randy, WhatMatters" },
      { question: "How should we follow up?", answer: "Email me" },
    ]);
  });
});
