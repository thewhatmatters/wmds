import { useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { expect, fn, spyOn, userEvent, waitFor, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, DollarSign } from "lucide-react";
import { Avatar } from "../components/atoms/Avatar/Avatar";
import { Button } from "../components/atoms/Button/Button";
import { Checkbox } from "../components/atoms/Checkbox/Checkbox";
import { useKbdChoiceKeys } from "../components/atoms/Kbd/useKbdChoiceKeys";
import {
  ChatDock,
  type ChatDockMessage,
  type ChatDockSuggestion,
} from "../components/organisms/ChatDock/ChatDock";

/**
 * Browser interaction tests — `npm run test:interactions`.
 * Inline placement keeps the dock in the canvas; the behavior is the same as fixed.
 */
const meta = {
  title: "Internal/Interactions/ChatDock",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const suggestions: ChatDockSuggestion[] = [
  { id: "cost", label: "How much does it cost?", prompt: "How much does it cost?", icon: <DollarSign /> },
  { id: "start", label: "Start a project", icon: <ArrowRight /> },
];

const onSend = fn();
const onSuggestionSelect = fn();

/** Echoes each prompt into the thread, so the suggestion rows give way to the conversation. */
function Dock() {
  const [messages, setMessages] = useState<ChatDockMessage[]>([]);
  return (
    <div className="pt-24">
      <ChatDock
        placement="inline"
        title="WhatMatters"
        subtitle="Ask anything"
        mark={<Avatar name="WhatMatters" size="md" />}
        greeting="Hi, ask me anything."
        messages={messages}
        suggestions={suggestions}
        onSend={(prompt) => {
          onSend(prompt);
          setMessages((current) => [...current, { id: String(current.length), role: "user", content: prompt }]);
        }}
        onSuggestionSelect={onSuggestionSelect}
        disclaimer="Answers may be incomplete"
      />
    </div>
  );
}

function windowQuery(canvasElement: HTMLElement) {
  return canvasElement.querySelector<HTMLElement>("[role='dialog']");
}

/** The window card behind the composer — always mounted, `hidden` once it has folded away. */
function windowCard(canvasElement: HTMLElement): HTMLElement {
  const card = canvasElement.querySelector<HTMLElement>("[data-chat-dock-window]");
  if (card == null) throw new Error("ChatDock window is missing");
  return card;
}

/** The composer pill — the field's shell. */
function composerShell(canvasElement: HTMLElement): HTMLElement {
  const shell = canvasElement.querySelector("textarea")?.parentElement;
  if (shell == null) throw new Error("ChatDock composer is missing");
  return shell;
}

/** Inline specimens open to 32rem. */
const inlineOpenHeight = 512;

/**
 * The window opens on the medium tier and its content fades in on the fast tier; let every visible
 * layer finish so contrast is measured at full opacity.
 */
async function waitForWindowSettled(canvasElement: HTMLElement) {
  await waitFor(
    () => {
      const card = windowCard(canvasElement);
      expect(card.hidden).toBe(false);
      expect(card.getBoundingClientRect().height).toBeCloseTo(inlineOpenHeight, 0);
      expect(getComputedStyle(card).opacity).toBe("1");
      const dock = card.parentElement ?? card;
      for (const layer of dock.querySelectorAll<HTMLElement>("[style*='opacity']:not([aria-hidden='true'])")) {
        // Layers that have faded out and been hidden (the composer behind a gate) are not on screen.
        if (layer.closest("[hidden]") != null) continue;
        expect(getComputedStyle(layer).opacity).toBe("1");
      }
    },
    { timeout: 4000 },
  );
}

/** Stretches the medium and fast tiers so a test can act while the window is still moving. */
function slowMotion(): () => void {
  const root = document.documentElement;
  root.style.setProperty("--duration-medium", "2000ms");
  root.style.setProperty("--duration-fast", "800ms");
  return () => {
    root.style.removeProperty("--duration-medium");
    root.style.removeProperty("--duration-fast");
  };
}

async function nextFrame() {
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

export const OpenAndClose: Story = {
  name: "opens on focus, closes with Escape and Close",
  render: () => <Dock />,
  play: async ({ canvas, canvasElement }) => {
    expect(windowQuery(canvasElement)).toBeNull();
    expect(windowCard(canvasElement).hidden).toBe(true);
    const restBar = composerShell(canvasElement).getBoundingClientRect();

    await userEvent.click(canvas.getByRole("textbox", { name: "Ask anything" }));
    const dialog = await waitFor(() => canvas.getByRole("dialog", { name: "WhatMatters" }));
    expect(dialog).toHaveAttribute("aria-modal", "false");
    const field = within(dialog).getByRole("textbox", { name: "Ask anything" });
    await waitFor(() => {
      expect(field).toHaveFocus();
    });
    expect(within(dialog).getByRole("group", { name: "Suggested questions" })).toBeInTheDocument();
    await waitForWindowSettled(canvasElement);

    // One composer: it keeps its width and place, rising only by the line under it, and the window
    // grows up from the resting bar's bottom edge.
    expect(canvasElement.querySelectorAll("textarea")).toHaveLength(1);
    const openBar = composerShell(canvasElement).getBoundingClientRect();
    expect(openBar.left).toBeCloseTo(restBar.left, 0);
    expect(openBar.width).toBeCloseTo(restBar.width, 0);
    expect(openBar.bottom).toBeLessThan(restBar.bottom);
    const card = windowCard(canvasElement).getBoundingClientRect();
    expect(card.bottom).toBeCloseTo(restBar.bottom, 0);
    expect(card.left).toBeLessThan(openBar.left);
    expect(card.right).toBeGreaterThan(openBar.right);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(windowQuery(canvasElement)).toBeNull();
    });
    const restField = canvas.getByRole("textbox", { name: "Ask anything" });
    expect(restField).toBe(field);
    await waitFor(() => {
      expect(restField).toHaveFocus();
    });
    await waitFor(() => {
      expect(windowCard(canvasElement).hidden).toBe(true);
    });
    expect(composerShell(canvasElement).getBoundingClientRect().bottom).toBeCloseTo(restBar.bottom, 0);
    // Returning focus does not reopen the window.
    await new Promise((resolve) => {
      window.setTimeout(resolve, 150);
    });
    expect(windowQuery(canvasElement)).toBeNull();

    await userEvent.click(restField);
    const reopened = await waitFor(() => canvas.getByRole("dialog", { name: "WhatMatters" }));
    await userEvent.click(within(reopened).getByRole("button", { name: "Close chat" }));
    await waitFor(() => {
      expect(windowQuery(canvasElement)).toBeNull();
    });
    await waitFor(() => {
      expect(restField).toHaveFocus();
      expect(windowCard(canvasElement).hidden).toBe(true);
    });
  },
};

export const InterruptOpening: Story = {
  name: "Escape while opening folds back from where it is",
  render: () => <Dock />,
  play: async ({ canvas, canvasElement }) => {
    const restore = slowMotion();
    try {
      const field = canvas.getByRole("textbox", { name: "Ask anything" });
      const card = windowCard(canvasElement);
      await userEvent.click(field);
      await waitFor(() => {
        expect(card.getBoundingClientRect().height).toBeGreaterThan(120);
      });
      const midOpen = card.getBoundingClientRect().height;
      expect(midOpen).toBeLessThan(inlineOpenHeight - 40);

      await userEvent.keyboard("{Escape}");
      expect(windowQuery(canvasElement)).toBeNull();
      // It shrinks from where it was; it does not finish opening first.
      await waitFor(() => {
        expect(card.getBoundingClientRect().height).toBeLessThan(midOpen - 20);
      });
      expect(card.hidden).toBe(false);
      await waitFor(
        () => {
          expect(card.hidden).toBe(true);
        },
        { timeout: 5000 },
      );
      expect(field).toHaveFocus();
    } finally {
      restore();
    }
  },
};

export const InterruptClosing: Story = {
  name: "a click while closing opens it again from where it is",
  render: () => <Dock />,
  play: async ({ canvas, canvasElement }) => {
    const field = canvas.getByRole("textbox", { name: "Ask anything" });
    const card = windowCard(canvasElement);
    await userEvent.click(field);
    await waitForWindowSettled(canvasElement);

    const restore = slowMotion();
    try {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(card.getBoundingClientRect().height).toBeLessThan(inlineOpenHeight - 60);
      });
      const midClose = card.getBoundingClientRect().height;
      expect(card.hidden).toBe(false);

      await userEvent.click(field);
      expect(canvas.getByRole("dialog", { name: "WhatMatters" })).toBeInTheDocument();
      await waitFor(() => {
        expect(card.getBoundingClientRect().height).toBeGreaterThan(midClose + 20);
      });
      expect(card.hidden).toBe(false);
    } finally {
      restore();
    }
    await waitForWindowSettled(canvasElement);
    expect(field).toHaveFocus();
  },
};

export const ReducedMotion: Story = {
  name: "reduced motion crossfades the window in place",
  render: () => (
    <MotionConfig reducedMotion="always">
      <Dock />
    </MotionConfig>
  ),
  play: async ({ canvas, canvasElement }) => {
    const restore = slowMotion();
    try {
      const card = windowCard(canvasElement);
      await userEvent.click(canvas.getByRole("textbox", { name: "Ask anything" }));
      await nextFrame();
      // Full size at once, fading in rather than growing.
      expect(card.hidden).toBe(false);
      expect(card.getBoundingClientRect().height).toBeCloseTo(inlineOpenHeight, 0);
      expect(Number(getComputedStyle(card).opacity)).toBeLessThan(1);
      await waitFor(
        () => {
          expect(getComputedStyle(card).opacity).toBe("1");
        },
        { timeout: 3000 },
      );

      await userEvent.keyboard("{Escape}");
      await nextFrame();
      expect(card.getBoundingClientRect().height).toBeCloseTo(inlineOpenHeight, 0);
      await waitFor(
        () => {
          expect(card.hidden).toBe(true);
        },
        { timeout: 3000 },
      );
    } finally {
      restore();
    }
  },
};

export const SendAndSuggestions: Story = {
  name: "sends typed text and suggestion prompts",
  render: () => <Dock />,
  play: async ({ canvas, canvasElement }) => {
    onSend.mockClear();
    onSuggestionSelect.mockClear();

    // Pills stay out of the accessibility tree until a pointer hovers the dock (CSS :hover,
    // which synthetic events cannot trigger), so query them as hidden and click directly.
    const pills = canvasElement.querySelector<HTMLElement>("[role='group'][aria-label='Suggested questions']");
    if (pills == null) throw new Error("Suggestion pills are missing");
    expect(getComputedStyle(pills).visibility).toBe("hidden");
    const pillLabels = [...pills.querySelectorAll("button")].map((button) => button.textContent);
    expect(pillLabels).toEqual(["How much does it cost?"]);
    pills.querySelector("button")?.click();
    expect(onSend).toHaveBeenCalledWith("How much does it cost?");
    expect(onSuggestionSelect).toHaveBeenCalledTimes(1);

    const dialog = await waitFor(() => canvas.getByRole("dialog", { name: "WhatMatters" }));
    expect(within(dialog).getByRole("log", { name: "Conversation" })).toHaveTextContent("How much does it cost?");
    expect(within(dialog).queryByRole("group", { name: "Suggested questions" })).toBeNull();

    const field = within(dialog).getByRole("textbox", { name: "Ask anything" });
    await userEvent.type(field, "Do you do product work?{Enter}");
    expect(onSend).toHaveBeenLastCalledWith("Do you do product work?");
    expect(field).toHaveValue("");
    await waitForWindowSettled(canvasElement);
  },
};

export const ActionSuggestion: Story = {
  name: "an action suggestion does not send",
  render: () => <Dock />,
  play: async ({ canvas, canvasElement }) => {
    onSend.mockClear();
    onSuggestionSelect.mockClear();

    await userEvent.click(canvas.getByRole("textbox", { name: "Ask anything" }));
    const dialog = await waitFor(() => canvas.getByRole("dialog", { name: "WhatMatters" }));
    await userEvent.click(within(dialog).getByRole("button", { name: "Start a project" }));
    expect(onSuggestionSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "start" }));
    expect(onSend).not.toHaveBeenCalled();
    await waitForWindowSettled(canvasElement);
  },
};

/** The rows leave once the first message exists: focus goes to the composer, so Escape still closes. */
async function expectRowHandsFocusToComposer(canvasElement: HTMLElement, dialog: HTMLElement) {
  const field = within(dialog).getByRole("textbox", { name: "Ask anything" });
  await waitFor(() => {
    expect(within(dialog).queryByRole("group", { name: "Suggested questions" })).toBeNull();
  });
  expect(field).toHaveFocus();
  await waitForWindowSettled(canvasElement);
  expect(field).toHaveFocus();

  await userEvent.keyboard("{Escape}");
  await waitFor(() => {
    expect(windowQuery(canvasElement)).toBeNull();
  });
  await waitFor(() => {
    expect(windowCard(canvasElement).hidden).toBe(true);
  });
  // Back on the resting bar, without reopening.
  expect(field).toHaveFocus();
  expect(windowQuery(canvasElement)).toBeNull();
}

export const SuggestionRowClickFocus: Story = {
  name: "a suggestion row chosen by click hands focus to the composer",
  render: () => <Dock />,
  play: async ({ canvas, canvasElement }) => {
    onSend.mockClear();
    await userEvent.click(canvas.getByRole("textbox", { name: "Ask anything" }));
    const dialog = await waitFor(() => canvas.getByRole("dialog", { name: "WhatMatters" }));
    await waitForWindowSettled(canvasElement);

    await userEvent.click(within(dialog).getByRole("button", { name: "How much does it cost?" }));
    expect(onSend).toHaveBeenCalledWith("How much does it cost?");
    await expectRowHandsFocusToComposer(canvasElement, dialog);
  },
};

export const SuggestionRowKeyboardFocus: Story = {
  name: "a suggestion row chosen with Enter hands focus to the composer",
  render: () => <Dock />,
  play: async ({ canvas, canvasElement }) => {
    onSend.mockClear();
    await userEvent.click(canvas.getByRole("textbox", { name: "Ask anything" }));
    const dialog = await waitFor(() => canvas.getByRole("dialog", { name: "WhatMatters" }));
    await waitForWindowSettled(canvasElement);

    const row = within(dialog).getByRole("button", { name: "How much does it cost?" });
    row.focus();
    expect(row).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onSend).toHaveBeenCalledWith("How much does it cost?");
    await expectRowHandsFocusToComposer(canvasElement, dialog);
  },
};

const followUpItems: ChatDockSuggestion[] = [
  { id: "cost", label: "How much does a project cost?", prompt: "How much does a project cost?" },
  { id: "process", label: "How does a project work?", prompt: "How does a project work?" },
  { id: "start", label: "Start a project" },
];

const replied: ChatDockMessage[] = [
  { id: "q", role: "user", content: "What do you make?" },
  { id: "a", role: "assistant", content: "Brands, sites, and apps." },
];

/**
 * A reply with three follow-ups. The harness neither appends the visitor's message nor clears
 * the follow-ups on send, so a test can see ChatDock hide them by itself at once.
 */
function FollowUpDock({
  followUpsPlacement,
  thinking = false,
}: {
  followUpsPlacement: "inline" | "composer";
  thinking?: boolean;
}) {
  return (
    <ChatDock
      placement="inline"
      defaultOpen
      title="WhatMatters"
      subtitle="Ask anything"
      mark={<Avatar name="WhatMatters" size="md" />}
      greeting="Hi, ask me anything."
      messages={replied}
      thinking={thinking}
      followUps={followUpItems}
      followUpsPlacement={followUpsPlacement}
      onSend={onSend}
      onSuggestionSelect={onSuggestionSelect}
    />
  );
}

export const FollowUpsInline: Story = {
  name: "follow-ups under the reply send their prompt",
  render: () => <FollowUpDock followUpsPlacement="inline" />,
  play: async ({ canvas }) => {
    onSend.mockClear();
    onSuggestionSelect.mockClear();

    const dialog = canvas.getByRole("dialog", { name: "WhatMatters" });
    const log = within(dialog).getByRole("log", { name: "Conversation" });
    const group = within(log).getByRole("group", { name: "Suggested follow-ups" });
    expect(within(group).getAllByRole("button").map((button) => button.textContent)).toEqual([
      "How much does a project cost?",
      "How does a project work?",
      "Start a project",
    ]);

    const field = within(dialog).getByRole("textbox", { name: "Ask anything" });
    await userEvent.click(field);
    await userEvent.click(within(group).getByRole("button", { name: "How much does a project cost?" }));

    expect(onSuggestionSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "cost" }));
    expect(onSend).toHaveBeenCalledWith("How much does a project cost?");
    expect(onSuggestionSelect.mock.invocationCallOrder[0]).toBeLessThan(onSend.mock.invocationCallOrder[0]);
    await waitFor(() => {
      expect(within(dialog).queryByRole("group", { name: "Suggested follow-ups" })).toBeNull();
    });
    expect(field).toHaveFocus();
  },
};

export const FollowUpsAboveComposer: Story = {
  name: "follow-ups above the composer, action only selects",
  render: () => <FollowUpDock followUpsPlacement="composer" />,
  play: async ({ canvas }) => {
    onSend.mockClear();
    onSuggestionSelect.mockClear();

    const dialog = canvas.getByRole("dialog", { name: "WhatMatters" });
    const group = within(dialog).getByRole("group", { name: "Suggested follow-ups" });
    expect(within(dialog).getByRole("log", { name: "Conversation" }).contains(group)).toBe(false);
    const field = within(dialog).getByRole("textbox", { name: "Ask anything" });
    expect(group.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await userEvent.click(within(group).getByRole("button", { name: "Start a project" }));
    expect(onSuggestionSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "start" }));
    expect(onSend).not.toHaveBeenCalled();
    expect(within(dialog).getByRole("group", { name: "Suggested follow-ups" })).toBeInTheDocument();
    expect(field).toHaveFocus();
  },
};

export const FollowUpsWhileThinking: Story = {
  name: "no follow-ups beside a pending reply",
  render: () => <FollowUpDock followUpsPlacement="inline" thinking />,
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole("dialog", { name: "WhatMatters" });
    expect(within(dialog).getByText("Thinking…")).toBeInTheDocument();
    expect(within(dialog).queryByRole("group", { name: "Suggested follow-ups" })).toBeNull();
  },
};

const onMessageFeedback = fn();

const answered: ChatDockMessage[] = [
  { id: "q", role: "user", content: "What do you make?" },
  {
    id: "a",
    role: "assistant",
    content: "Brands, sites, and apps.",
    copyText: "Brands, sites, and apps.",
    meta: { label: "Match 99%", description: "How sure the assistant is that it matched your question." },
    feedback: null,
  },
];

/** Holds votes like the pattern does. `thinking` marks the last reply as still arriving. */
function ReplyDock({ messages: initial = answered, thinking = false }: { messages?: ChatDockMessage[]; thinking?: boolean }) {
  const [messages, setMessages] = useState(initial);
  return (
    <ChatDock
      placement="inline"
      defaultOpen
      title="WhatMatters"
      subtitle="Ask anything"
      mark={<Avatar name="WhatMatters" size="md" />}
      greeting="Hi, ask me anything."
      messages={messages}
      thinking={thinking}
      onSend={onSend}
      onMessageFeedback={(reply, value) => {
        onMessageFeedback(reply.id, value);
        setMessages((current) => current.map((message) => (message.id === reply.id ? { ...message, feedback: value } : message)));
      }}
    />
  );
}

function replyRow(canvasElement: HTMLElement): HTMLElement {
  const row = canvasElement.querySelector<HTMLElement>("[data-role='assistant'] [data-reply-actions]");
  if (row == null) throw new Error("Reply row is missing");
  return row;
}

export const ReplyActionsCopyAndVote: Story = {
  name: "reply row copies the reply and toggles one vote",
  render: () => <ReplyDock />,
  play: async ({ canvas, canvasElement }) => {
    onMessageFeedback.mockClear();
    const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    try {
      const dialog = canvas.getByRole("dialog", { name: "WhatMatters" });
      const copy = within(dialog).getByRole("button", { name: "Copy reply" });
      await userEvent.click(copy);
      expect(writeText).toHaveBeenCalledWith("Brands, sites, and apps.");
      await waitFor(() => {
        expect(within(dialog).getByRole("button", { name: "Copied" })).toBe(copy);
        expect(within(dialog).getByRole("status")).toHaveTextContent("Copied");
      });

      const helpful = within(dialog).getByRole("button", { name: "Mark this reply helpful" });
      const notHelpful = within(dialog).getByRole("button", { name: "Mark this reply not helpful" });
      expect(helpful).toHaveAttribute("aria-pressed", "false");
      await userEvent.click(helpful);
      expect(onMessageFeedback).toHaveBeenLastCalledWith("a", "up");
      expect(helpful).toHaveAttribute("aria-pressed", "true");
      await userEvent.click(notHelpful);
      expect(onMessageFeedback).toHaveBeenLastCalledWith("a", "down");
      expect(helpful).toHaveAttribute("aria-pressed", "false");
      expect(notHelpful).toHaveAttribute("aria-pressed", "true");
      // Pressing the active thumb clears the vote.
      await userEvent.click(notHelpful);
      expect(onMessageFeedback).toHaveBeenLastCalledWith("a", null);
      expect(notHelpful).toHaveAttribute("aria-pressed", "false");

      // The score is text with its description for screen readers, not a control.
      const row = replyRow(canvasElement);
      expect(row).toHaveTextContent("Match 99%. How sure the assistant is that it matched your question.");
      expect(within(row).getAllByRole("button")).toHaveLength(3);
      await waitForWindowSettled(canvasElement);
    } finally {
      writeText.mockRestore();
    }
  },
};

export const ReplyActionsReveal: Story = {
  name: "reply row keeps its place and shows on focus",
  render: () => <ReplyDock />,
  play: async ({ canvasElement }) => {
    await waitForWindowSettled(canvasElement);
    const row = replyRow(canvasElement);
    const height = row.getBoundingClientRect().height;
    expect(height).toBeGreaterThanOrEqual(36);
    // A desktop pointer can hover, so the row waits for hover or focus — and still takes its space.
    if (window.matchMedia("(hover: hover)").matches) {
      await waitFor(() => {
        expect(getComputedStyle(row).opacity).toBe("0");
      });
    }
    within(row).getByRole("button", { name: "Copy reply" }).focus();
    await waitFor(() => {
      expect(getComputedStyle(row).opacity).toBe("1");
    });
    expect(row.getBoundingClientRect().height).toBe(height);
  },
};

export const ReplyActionsPending: Story = {
  name: "no reply row while the reply is still arriving",
  render: () => <ReplyDock thinking />,
  play: async ({ canvas, canvasElement }) => {
    const row = replyRow(canvasElement);
    expect(row).toHaveAttribute("data-reply-actions", "pending");
    expect(getComputedStyle(row).visibility).toBe("hidden");
    expect(row.getBoundingClientRect().height).toBeGreaterThan(0);
    expect(canvas.queryByRole("button", { name: "Copy reply" })).toBeNull();
  },
};

export const ReplyActionsAbsent: Story = {
  name: "no reply row without copy text, score, or votes",
  render: () => (
    <ChatDock
      placement="inline"
      defaultOpen
      title="WhatMatters"
      greeting="Hi, ask me anything."
      messages={replied}
      onSend={onSend}
    />
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("[data-reply-actions]")).toBeNull();
    expect(canvasElement.querySelector("[data-role='assistant']")).toHaveTextContent("Brands, sites, and apps.");
  },
};

const gateOptions = [
  "Brand identity",
  "Web experiences",
  "Mobile apps",
  "Social media",
  "Content and copy",
  "AI assistants",
  "Launch and growth",
  "Care and support",
  "Something else",
];

const gateConversation: ChatDockMessage[] = [
  { id: "q", role: "user", content: "I need a new brand." },
  { id: "a", role: "assistant", content: "Happy to help. Start a project and we'll take it from there." },
];

/** A two-step gate: numbered options (digits while focus is in the gate), then a thank-you. */
function TestGate({ onClose }: { onClose: () => void }) {
  const gateRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [chosen, setChosen] = useState<string[]>([]);
  const toggle = (option: string) =>
    setChosen((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]));
  useKbdChoiceKeys({
    enabled: step === 1,
    scope: gateRef,
    choices: Object.fromEntries(gateOptions.map((option, index) => [String(index + 1), () => toggle(option)])),
  });
  return (
    <ChatDock.Gate
      ref={gateRef}
      title={step === 1 ? "Pick services" : "Say hello"}
      subtitle="Choose all that apply."
      step={step}
      stepCount={2}
      onPrevious={() => setStep(1)}
      onNext={step === 1 ? () => setStep(2) : undefined}
      canContinue={chosen.length > 0}
      onClose={onClose}
    >
      {step === 1 ? (
        <div role="group" aria-label="Services" className="flex flex-col">
          {gateOptions.map((option) => (
            <div key={option} className="flex items-center py-3">
              <Checkbox size="md" label={option} checked={chosen.includes(option)} onChange={() => toggle(option)} />
            </div>
          ))}
        </div>
      ) : (
        <p>Thanks — that's everything.</p>
      )}
    </ChatDock.Gate>
  );
}

/** A dock whose gate a page button opens, the way a site's Start a project button does. */
function GateDock() {
  const [gateOpen, setGateOpen] = useState(false);
  return (
    <div>
      <Button role="primary" type="button" onClick={() => setGateOpen(true)}>
        Open the gate
      </Button>
      <ChatDock
        placement="inline"
        title="WhatMatters"
        subtitle="Ask anything"
        mark={<Avatar name="WhatMatters" size="md" />}
        greeting="Hi, ask me anything."
        messages={gateConversation}
        suggestions={suggestions}
        onSend={onSend}
        disclaimer="Answers may be incomplete"
        gate={gateOpen ? <TestGate onClose={() => setGateOpen(false)} /> : undefined}
      />
    </div>
  );
}

function gateRoot(canvasElement: HTMLElement): HTMLElement | null {
  return canvasElement.querySelector<HTMLElement>("[data-chat-dock-gate-focus]");
}

async function openGate(canvas: ReturnType<typeof within>, canvasElement: HTMLElement) {
  await userEvent.click(canvas.getByRole("button", { name: "Open the gate" }));
  await waitFor(
    () => {
      const gate = gateRoot(canvasElement);
      expect(gate).not.toBeNull();
      expect(gate).toHaveFocus();
    },
    { timeout: 3000 },
  );
  return gateRoot(canvasElement) as HTMLElement;
}

export const GateTakesTheComposersPlace: Story = {
  name: "a gate opens the window in the composer's place and takes focus",
  render: () => <GateDock />,
  play: async ({ canvas, canvasElement }) => {
    expect(windowQuery(canvasElement)).toBeNull();
    const gate = await openGate(canvas, canvasElement);
    const dialog = canvas.getByRole("dialog", { name: "WhatMatters" });
    expect(within(dialog).getByRole("group", { name: "Pick services" })).toBe(gate);
    // The composer, the suggestion rows, and the disclaimer step aside; the conversation stays.
    await waitFor(
      () => {
        expect(within(dialog).queryByRole("textbox", { name: "Ask anything" })).toBeNull();
      },
      { timeout: 3000 },
    );
    expect(within(dialog).queryByRole("group", { name: "Suggested questions" })).toBeNull();
    expect(dialog).not.toHaveTextContent("Answers may be incomplete");
    expect(within(dialog).getByRole("log", { name: "Conversation" })).toHaveTextContent("Start a project");

    // It hugs its step up to the cap; past the cap its body scrolls, and the reply above stays in view.
    await waitForWindowSettled(canvasElement);
    await waitFor(
      () => {
        const cap = Number.parseFloat(getComputedStyle(gate).getPropertyValue("--chat-dock-gate-max"));
        expect(gate.getBoundingClientRect().height).toBeLessThanOrEqual(cap + 1);
        const body = gate.querySelector<HTMLElement>(".overflow-y-auto");
        if (body == null) throw new Error("Gate body is missing");
        expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
        const reply = within(dialog).getByText("Happy to help. Start a project and we'll take it from there.");
        const log = within(dialog).getByRole("log", { name: "Conversation" });
        expect(reply.getBoundingClientRect().bottom).toBeLessThanOrEqual(gate.getBoundingClientRect().top);
        expect(reply.getBoundingClientRect().bottom).toBeGreaterThan(log.getBoundingClientRect().top);
      },
      { timeout: 3000 },
    );
  },
};

export const GateKeysAndSteps: Story = {
  name: "gate: number keys while focus is in it, and the step controls",
  render: () => <GateDock />,
  play: async ({ canvas, canvasElement }) => {
    const gate = await openGate(canvas, canvasElement);
    const first = within(gate).getByRole("checkbox", { name: "Brand identity" });
    const second = within(gate).getByRole("checkbox", { name: "Web experiences" });
    const third = within(gate).getByRole("checkbox", { name: "Mobile apps" });
    expect(within(gate).getByText("1 of 2")).toBeInTheDocument();
    const next = within(gate).getByRole("button", { name: "Next" });
    expect(next).toBeDisabled();

    await userEvent.keyboard("1");
    expect(first).toBeChecked();
    await userEvent.keyboard("1");
    expect(first).not.toBeChecked();
    await userEvent.keyboard("2");
    expect(second).toBeChecked();
    // A focused checkbox still takes digits.
    second.focus();
    await userEvent.keyboard("1");
    expect(first).toBeChecked();
    // Outside the gate, digits are left alone.
    canvas.getByRole("button", { name: "Open the gate" }).focus();
    await userEvent.keyboard("3");
    expect(third).not.toBeChecked();

    expect(next).toBeEnabled();
    await userEvent.click(within(gate).getByRole("button", { name: "Next step" }));
    await waitFor(() => {
      expect(within(gate).getByText("2 of 2")).toBeInTheDocument();
      expect(within(gate).getByText("Thanks — that's everything.")).toBeInTheDocument();
    });
    expect(within(gate).getByRole("button", { name: "Next step" })).toBeDisabled();
    expect(within(gate).queryByRole("button", { name: "Next" })).toBeNull();
    await userEvent.click(within(gate).getByRole("button", { name: "Previous step" }));
    await waitFor(() => {
      expect(within(gate).getByRole("checkbox", { name: "Brand identity" })).toBeInTheDocument();
    });
    expect(within(gate).getByRole("button", { name: "Previous step" })).toBeDisabled();
    await waitForWindowSettled(canvasElement);
  },
};

export const GateEscape: Story = {
  name: "gate: Escape closes the gate, then a second Escape closes the window",
  render: () => <GateDock />,
  play: async ({ canvas, canvasElement }) => {
    await openGate(canvas, canvasElement);
    await userEvent.keyboard("{Escape}");
    const dialog = canvas.getByRole("dialog", { name: "WhatMatters" });
    const field = await waitFor(() => within(dialog).getByRole("textbox", { name: "Ask anything" }), { timeout: 3000 });
    await waitFor(() => {
      expect(gateRoot(canvasElement)).toBeNull();
      expect(field).toHaveFocus();
    });
    expect(windowQuery(canvasElement)).not.toBeNull();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(windowQuery(canvasElement)).toBeNull();
      expect(windowCard(canvasElement).hidden).toBe(true);
    });
  },
};

export const GateWindowClose: Story = {
  name: "gate: closing the window keeps the gate for when it reopens",
  render: () => <GateDock />,
  play: async ({ canvas, canvasElement }) => {
    const gate = await openGate(canvas, canvasElement);
    await userEvent.click(within(gate).getByRole("checkbox", { name: "Social media" }));
    await userEvent.click(canvas.getByRole("button", { name: "Close chat" }));
    await waitFor(
      () => {
        expect(windowQuery(canvasElement)).toBeNull();
        expect(windowCard(canvasElement).hidden).toBe(true);
      },
      { timeout: 3000 },
    );
    // At rest the composer is the bar again; opening the window brings the gate back.
    const bar = canvas.getByRole("textbox", { name: "Ask anything" });
    await userEvent.click(bar);
    await waitFor(
      () => {
        const back = gateRoot(canvasElement);
        expect(back).not.toBeNull();
        expect(back).toHaveFocus();
      },
      { timeout: 3000 },
    );
    expect(within(gateRoot(canvasElement) as HTMLElement).getByRole("checkbox", { name: "Social media" })).toBeChecked();
    await waitForWindowSettled(canvasElement);
  },
};
