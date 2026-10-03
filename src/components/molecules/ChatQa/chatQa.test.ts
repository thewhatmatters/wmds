/** @vitest-environment happy-dom */
import { createElement, type ComponentProps } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { ChatQa } from "./ChatQa";
import {
  chatQaAnswerClasses,
  chatQaPairClasses,
  chatQaQuestionClasses,
  chatQaShellClasses,
} from "./chatQaStyles";

const samplePairs = [
  { question: "What are you shipping next?", answer: "A new feature" },
  { question: "Which platforms does it need to cover?", answer: "Web, Chrome extension" },
  {
    question: "Rank WhatMatters most for this launch",
    answer: "Ranked: 1. Speed to ship, 2. Polish, 3. Marketing readiness, 4. Test coverage",
  },
] as const;

function mount(props: ComponentProps<typeof ChatQa> = { pairs: samplePairs }) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(createElement(ChatQa, props));
  });
  return { container, root };
}

describe("ChatQa", () => {
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

  it("renders stacked question and answer pairs in a quiet panel", () => {
    const view = mount();
    root = view.root;
    container = view.container;

    const panel = view.container.querySelector('[aria-label="Collected answers"]');
    expect(panel).not.toBeNull();
    expect(panel?.tagName).toBe("DL");
    expect(panel?.className).toContain("bg-surface");
    expect(panel?.className).toContain("border-border");
    expect(panel?.className).toContain("rounded-2xl");
    expect(panel?.className).not.toContain("bg-brand");
    expect(panel?.className).not.toContain("shadow");

    const text = view.container.textContent ?? "";
    expect(text).toContain("What are you shipping next?");
    expect(text).toContain("A new feature");
    expect(text).toContain("Web, Chrome extension");
    expect(text).toContain("Ranked: 1. Speed to ship");

    const questions = view.container.querySelectorAll("dt");
    const answers = view.container.querySelectorAll("dd");
    expect(questions).toHaveLength(3);
    expect(answers).toHaveLength(3);
    expect(questions[0]?.className).toContain("text-muted");
    expect(answers[0]?.className).toContain("type-label");
    expect(answers[0]?.className).toContain("text-fg");
  });

  it("keeps shell classes on the quiet surface tokens", () => {
    expect(chatQaShellClasses).toContain("bg-surface");
    expect(chatQaShellClasses).toContain("border-border");
    expect(chatQaShellClasses).not.toContain("bg-brand");
    expect(chatQaQuestionClasses).toContain("text-muted");
    expect(chatQaAnswerClasses).toContain("type-label");
    expect(chatQaPairClasses).toContain("flex-col");
  });
});
