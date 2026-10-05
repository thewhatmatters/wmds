// @thewhatmatters/wmds@0.4.5 · Pattern — chat dock
// Storybook: Components/ChatDock → Pattern — chat dock (?path=/story/components-chatdock--pattern-chat-dock)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState, type ReactNode } from "react";
import { ArrowRight, CalendarClock, DollarSign } from "lucide-react";
import {
  Avatar,
  ChatDock,
  ChatQa,
  type ChatDockFeedback,
  type ChatDockMessage,
  type ChatDockMessageMeta,
  type ChatDockSuggestion,
  type ChatQaPair,
} from "@thewhatmatters/wmds";

const suggestions: ChatDockSuggestion[] = [
  {
    id: "cost",
    label: "How much does a project cost?",
    prompt: "How much does a project cost?",
    icon: <DollarSign />,
  },
  {
    id: "timeline",
    label: "How long does a project take?",
    prompt: "How long does a project take?",
    icon: <CalendarClock />,
  },
  { id: "start", label: "Start a project", icon: <ArrowRight /> },
];

/** What the assistant knows when it opens Start a project — services and budget, or nothing yet. */
export interface StartProjectRequest {
  services?: string[];
  budget?: string;
}

/**
 * What `ask` resolves with: the reply, or the reply with its follow-ups, its score, the text Copy
 * copies, and a Start a project request when the assistant opens the gate.
 */
export type AskWhatMattersResult =
  | string
  | {
      reply: string;
      followUps?: ChatDockSuggestion[];
      meta?: ChatDockMessageMeta;
      copyText?: string;
      startProject?: StartProjectRequest;
    };

/** What the Start a project gate gets: the request, and how to close or complete it. */
export interface StartProjectGateSlot {
  request: StartProjectRequest;
  close: () => void;
  complete: (answers: ChatQaPair[], confirmation: string) => void;
}

export interface AskWhatMattersProps {
  /** The app's assistant request. Resolves with the reply, and with its follow-ups, score, copy text, or a Start a project request. */
  ask: (prompt: string, history: ChatDockMessage[]) => Promise<AskWhatMattersResult>;
  /** The visitor voted on a reply, or cleared their vote (`null`). */
  onFeedback: (reply: ChatDockMessage, value: ChatDockFeedback) => void;
  /** Start a project is open while this is set: what the assistant already knows, or `{}`. A site button can set it too. */
  startProject: StartProjectRequest | null;
  onStartProjectChange: (request: StartProjectRequest | null) => void;
  /** The gate — return **Pattern — start a project gate** with the slot spread onto it. It sits in the conversation, under the latest message. */
  renderStartProject: (slot: StartProjectGateSlot) => ReactNode;
}

export function AskWhatMatters({
  ask,
  onFeedback,
  startProject,
  onStartProjectChange,
  renderStartProject,
}: AskWhatMattersProps) {
  const [messages, setMessages] = useState<ChatDockMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [followUps, setFollowUps] = useState<ChatDockSuggestion[]>([]);

  async function handleSend(prompt: string) {
    const question: ChatDockMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    const history = [...messages, question];
    setMessages(history);
    setFollowUps([]);
    setThinking(true);
    try {
      const result = await ask(prompt, history);
      const answer: Exclude<AskWhatMattersResult, string> = typeof result === "string" ? { reply: result } : result;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer.reply,
          copyText: answer.copyText ?? answer.reply,
          meta: answer.meta,
          feedback: null,
        },
      ]);
      setFollowUps(answer.followUps ?? []);
      if (answer.startProject != null) onStartProjectChange(answer.startProject);
    } finally {
      setThinking(false);
    }
  }

  function handleFeedback(reply: ChatDockMessage, value: ChatDockFeedback) {
    setMessages((current) =>
      current.map((message) => (message.id === reply.id ? { ...message, feedback: value } : message)),
    );
    onFeedback(reply, value);
  }

  function completeStartProject(answers: ChatQaPair[], confirmation: string) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "assistant", content: <ChatQa pairs={answers} aria-label="Your project" /> },
      { id: crypto.randomUUID(), role: "assistant", content: confirmation },
    ]);
    setFollowUps([]);
    onStartProjectChange(null);
  }

  return (
    <ChatDock
      title="WhatMatters"
      subtitle="Ask anything"
      gateSubtitle="Start a project"
      mark={<Avatar name="WhatMatters" size="md" />}
      greeting="Hi, I'm the WhatMatters assistant. Ask about our work, our process, pricing, or how to start a project."
      messages={messages}
      thinking={thinking}
      suggestions={suggestions}
      followUps={followUps}
      onSend={(prompt) => {
        void handleSend(prompt);
      }}
      onSuggestionSelect={(suggestion) => {
        if (suggestion.id === "start") onStartProjectChange({});
      }}
      onMessageFeedback={handleFeedback}
      gate={
        startProject == null
          ? undefined
          : renderStartProject({
              request: startProject,
              close: () => onStartProjectChange(null),
              complete: completeStartProject,
            })
      }
      placeholder="Ask anything about WhatMatters"
      disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
    />
  );
}
