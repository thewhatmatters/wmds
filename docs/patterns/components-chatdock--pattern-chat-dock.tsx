// @thewhatmatters/wmds@0.4.0 · Pattern — chat dock
// Storybook: Components/ChatDock → Pattern — chat dock (?path=/story/components-chatdock--pattern-chat-dock)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { ArrowRight, CalendarClock, DollarSign } from "lucide-react";
import { Avatar, ChatDock, type ChatDockMessage, type ChatDockSuggestion } from "@thewhatmatters/wmds";

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

export interface AskWhatMattersProps {
  /** The app's assistant request. Resolves with the reply. */
  ask: (prompt: string, history: ChatDockMessage[]) => Promise<string>;
  /** Opens the Start a project intake. */
  onStartProject: () => void;
}

export function AskWhatMatters({ ask, onStartProject }: AskWhatMattersProps) {
  const [messages, setMessages] = useState<ChatDockMessage[]>([]);
  const [thinking, setThinking] = useState(false);

  async function handleSend(prompt: string) {
    const question: ChatDockMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    const history = [...messages, question];
    setMessages(history);
    setThinking(true);
    try {
      const reply = await ask(prompt, history);
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <ChatDock
      title="WhatMatters"
      subtitle="Ask anything"
      mark={<Avatar name="WhatMatters" size="md" />}
      greeting="Hi, I'm the WhatMatters assistant. Ask about our work, our process, pricing, or how to start a project."
      messages={messages}
      thinking={thinking}
      suggestions={suggestions}
      onSend={(prompt) => {
        void handleSend(prompt);
      }}
      onSuggestionSelect={(suggestion) => {
        if (suggestion.id === "start") onStartProject();
      }}
      placeholder="Ask anything about WhatMatters"
      disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
    />
  );
}
