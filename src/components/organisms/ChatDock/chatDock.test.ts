/** @vitest-environment happy-dom */
import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ChatDock,
  chatDockOpenHeight,
  chatDockPillSuggestions,
  chatDockShowsFollowUps,
  chatDockShowsSuggestionRows,
  type ChatDockMessage,
  type ChatDockSuggestion,
} from "./ChatDock";

const suggestions: ChatDockSuggestion[] = [
  { id: "cost", label: "How much does it cost?", prompt: "How much does it cost?" },
  { id: "blank", label: "Blank prompt", prompt: "  " },
  { id: "start", label: "Start a project" },
];

describe("chatDockPillSuggestions", () => {
  it("keeps only suggestions that send a prompt", () => {
    expect(chatDockPillSuggestions(suggestions).map((s) => s.id)).toEqual(["cost"]);
  });
});

describe("chatDockShowsSuggestionRows", () => {
  it("shows rows until the conversation starts", () => {
    expect(chatDockShowsSuggestionRows(suggestions, [])).toBe(true);
    expect(chatDockShowsSuggestionRows(suggestions, [{ id: "1", role: "user", content: "Hi" }])).toBe(false);
    expect(chatDockShowsSuggestionRows([], [])).toBe(false);
  });
});

describe("chatDockShowsFollowUps", () => {
  const followUps = suggestions.slice(0, 1);
  const replied: ChatDockMessage[] = [
    { id: "q", role: "user", content: "What do you make?" },
    { id: "a", role: "assistant", content: "Brands, sites, and apps." },
  ];

  it("shows under the latest reply", () => {
    expect(chatDockShowsFollowUps({ followUps, messages: replied, thinking: false, sentAfterId: null })).toBe(true);
  });

  it("hides while a reply is pending, when the list is empty, and before any reply", () => {
    expect(chatDockShowsFollowUps({ followUps, messages: replied, thinking: true, sentAfterId: null })).toBe(false);
    expect(chatDockShowsFollowUps({ followUps: [], messages: replied, thinking: false, sentAfterId: null })).toBe(false);
    expect(chatDockShowsFollowUps({ followUps, messages: replied.slice(0, 1), thinking: false, sentAfterId: null })).toBe(
      false,
    );
  });

  it("hides as soon as the visitor sends after that reply", () => {
    expect(chatDockShowsFollowUps({ followUps, messages: replied, thinking: false, sentAfterId: "a" })).toBe(false);
    const next: ChatDockMessage[] = [...replied, { id: "q2", role: "user", content: "More" }, { id: "a2", role: "assistant", content: "Sure." }];
    expect(chatDockShowsFollowUps({ followUps, messages: next, thinking: false, sentAfterId: "a" })).toBe(true);
  });
});

describe("chatDockOpenHeight", () => {
  it("is 40rem, or the viewport less 7rem when that is shorter", () => {
    expect(chatDockOpenHeight("fixed", 900, 16)).toBe(640);
    expect(chatDockOpenHeight("fixed", 700, 16)).toBe(588);
    expect(chatDockOpenHeight("fixed", 80, 16)).toBe(0);
  });

  it("is 32rem for inline specimens", () => {
    expect(chatDockOpenHeight("inline", 300, 16)).toBe(512);
  });
});

describe("ChatDock", () => {
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

  function mount(props: Partial<ComponentProps<typeof ChatDock>> = {}) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(
        createElement(ChatDock, {
          placement: "inline",
          title: "WhatMatters",
          subtitle: "Ask anything",
          suggestions,
          onSend: () => undefined,
          ...props,
        }),
      );
    });
    return container;
  }

  it("opens the window when the resting field takes focus, and moves focus into it", () => {
    const onOpenChange = vi.fn();
    const view = mount({ onOpenChange });
    const restField = view.querySelector("textarea");
    expect(view.querySelector("[role='dialog']")).toBeNull();

    act(() => {
      restField?.focus();
    });

    const dialog = view.querySelector("[role='dialog']");
    expect(dialog).not.toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(document.activeElement).toBe(dialog?.querySelector("textarea"));
    // One composer serves both states.
    expect(view.querySelectorAll("textarea")).toHaveLength(1);
    expect(dialog?.querySelector("textarea")).toBe(restField);
    expect(view.querySelector<HTMLElement>("[data-chat-dock-window]")?.hidden).toBe(false);
  });

  it("closes with Escape and keeps focus in the composer without reopening", () => {
    const onOpenChange = vi.fn();
    const view = mount({ defaultOpen: true, onOpenChange });
    const field = view.querySelector("textarea");
    act(() => {
      field?.focus();
    });
    act(() => {
      field?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(view.querySelector("[role='dialog']")).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(document.activeElement).toBe(field);
  });

  it("starts open with defaultOpen and lists every suggestion as a row", () => {
    const view = mount({ defaultOpen: true });
    const rows = view.querySelectorAll("[role='dialog'] [role='group'] button");
    expect([...rows].map((row) => row.textContent)).toEqual([
      "How much does it cost?",
      "Blank prompt",
      "Start a project",
    ]);
  });
});
