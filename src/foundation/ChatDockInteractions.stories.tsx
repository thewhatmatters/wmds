import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, DollarSign } from "lucide-react";
import { Avatar } from "../components/atoms/Avatar/Avatar";
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

/** The window fades in on the medium tier; let it finish so contrast is measured at full opacity. */
async function waitForWindowSettled(dialog: HTMLElement) {
  await waitFor(() => {
    expect(getComputedStyle(dialog).opacity).toBe("1");
  });
}

export const OpenAndClose: Story = {
  name: "opens on focus, closes with Escape and Close",
  render: () => <Dock />,
  play: async ({ canvas, canvasElement }) => {
    expect(windowQuery(canvasElement)).toBeNull();

    await userEvent.click(canvas.getByRole("textbox", { name: "Ask anything" }));
    const dialog = await waitFor(() => canvas.getByRole("dialog", { name: "WhatMatters" }));
    expect(dialog).toHaveAttribute("aria-modal", "false");
    const field = within(dialog).getByRole("textbox", { name: "Ask anything" });
    await waitFor(() => {
      expect(field).toHaveFocus();
    });
    expect(within(dialog).getByRole("group", { name: "Suggested questions" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(windowQuery(canvasElement)).toBeNull();
    });
    const restField = canvas.getByRole("textbox", { name: "Ask anything" });
    await waitFor(() => {
      expect(restField).toHaveFocus();
    });
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
    await waitForWindowSettled(dialog);
  },
};

export const ActionSuggestion: Story = {
  name: "an action suggestion does not send",
  render: () => <Dock />,
  play: async ({ canvas }) => {
    onSend.mockClear();
    onSuggestionSelect.mockClear();

    await userEvent.click(canvas.getByRole("textbox", { name: "Ask anything" }));
    const dialog = await waitFor(() => canvas.getByRole("dialog", { name: "WhatMatters" }));
    await userEvent.click(within(dialog).getByRole("button", { name: "Start a project" }));
    expect(onSuggestionSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "start" }));
    expect(onSend).not.toHaveBeenCalled();
    await waitForWindowSettled(dialog);
  },
};
