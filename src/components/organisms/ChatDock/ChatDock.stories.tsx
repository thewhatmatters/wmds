import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, CalendarClock, DollarSign, Workflow } from "lucide-react";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { storybookViewports } from "../../../lib/viewports";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { ChatDock, type ChatDockMessage, type ChatDockSuggestion } from "./ChatDock";

const reviewViewports = {
  ...storybookViewports,
  review1280: {
    name: "Review 1280",
    styles: { width: "1280px", height: "800px" },
    type: "desktop" as const,
  },
  review1440: {
    name: "Review 1440",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
  review390: {
    name: "Review 390",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

const chatDockCopySource = `
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

/** What \`ask\` resolves with: the reply, or the reply and the follow-ups to offer under it. */
export type AskWhatMattersResult = string | { reply: string; followUps?: ChatDockSuggestion[] };

export interface AskWhatMattersProps {
  /** The app's assistant request. Resolves with the reply, and with follow-ups for it when there are any. */
  ask: (prompt: string, history: ChatDockMessage[]) => Promise<AskWhatMattersResult>;
  /** Opens the Start a project intake. */
  onStartProject: () => void;
}

export function AskWhatMatters({ ask, onStartProject }: AskWhatMattersProps) {
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
      const reply = typeof result === "string" ? result : result.reply;
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
      setFollowUps(typeof result === "string" ? [] : (result.followUps ?? []));
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
      followUps={followUps}
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
`.trim();

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

/** What `ask` resolves with: the reply, or the reply and the follow-ups to offer under it. */
type AskWhatMattersResult = string | { reply: string; followUps?: ChatDockSuggestion[] };

interface AskWhatMattersProps {
  /** The app's assistant request. Resolves with the reply, and with follow-ups for it when there are any. */
  ask: (prompt: string, history: ChatDockMessage[]) => Promise<AskWhatMattersResult>;
  /** Opens the Start a project intake. */
  onStartProject: () => void;
}

function AskWhatMatters({ ask, onStartProject }: AskWhatMattersProps) {
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
      const reply = typeof result === "string" ? result : result.reply;
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
      setFollowUps(typeof result === "string" ? [] : (result.followUps ?? []));
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
      followUps={followUps}
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

const followUpCost: ChatDockSuggestion = {
  id: "cost",
  label: "How much does a project cost?",
  prompt: "How much does a project cost?",
  icon: <DollarSign />,
};
const followUpProcess: ChatDockSuggestion = {
  id: "process",
  label: "How does a project work?",
  prompt: "How does a project work?",
  icon: <Workflow />,
};
const followUpStart: ChatDockSuggestion = { id: "start", label: "Start a project", icon: <ArrowRight /> };

const makeReply =
  "Brand identity, web experiences, mobile apps, social media, content and copy, and AI assistants. Then launch, growth, and care once it ships.";

/**
 * Storybook stand-in for the app's request: a short pause, then a canned reply. Some replies bring
 * follow-ups and some do not — the app decides.
 */
function demoAsk(prompt: string): Promise<AskWhatMattersResult> {
  const text = prompt.toLowerCase();
  const result: AskWhatMattersResult = text.includes("make")
    ? { reply: makeReply, followUps: [followUpCost, followUpProcess, followUpStart] }
    : text.includes("cost")
      ? {
          reply: "Most projects start at a fixed scope. Tell us what you need and we'll send a range within a day.",
          followUps: [followUpProcess, followUpStart],
        }
      : text.includes("work")
        ? {
            reply: "A short discovery call, a written plan, then weekly reviews until launch.",
            followUps: [followUpStart],
          }
        : text.includes("long")
          ? "A focused brand or product sprint takes four to six weeks. Larger builds run in phases."
          : "Good question. Share a little about the project and we'll point you to the right next step.";
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(result), 1200);
  });
}

/** Page behind the dock — Storybook-only, so the pinned composer has something to sit over. */
function ChatDockPage() {
  const [intakeOpened, setIntakeOpened] = useState(false);

  return (
    <div className="min-h-[150vh] bg-body">
      <main className="grid-page pt-24">
        <div className="band">
          <div className="col-span-full flex flex-col gap-4 lg:col-span-8">
            <h1 className="type-display-2 text-fg">We build what matters.</h1>
            <p className="type-large text-muted">
              Hover the composer for suggested questions. Click into it to open the chat window. The page stays
              usable behind it.
            </p>
            <p className="type-body text-muted" aria-live="polite">
              {intakeOpened ? "Start a project opens the intake here." : "Start a project calls the app's handler."}
            </p>
          </div>
        </div>
      </main>
      <AskWhatMatters ask={demoAsk} onStartProject={() => setIntakeOpened(true)} />
    </div>
  );
}

const conversation: ChatDockMessage[] = [
  { id: "q1", role: "user", content: "How much does a project cost?" },
  {
    id: "a1",
    role: "assistant",
    content: "Most projects start at a fixed scope. Tell us what you need and we'll send a range within a day.",
  },
  { id: "q2", role: "user", content: "Do you work with early-stage teams?" },
];

const greeting =
  "Hi, I'm the WhatMatters assistant. Ask about our work, our process, pricing, or how to start a project.";

const mark = <Avatar name="WhatMatters" size="md" />;

const meta = {
  title: "Components/ChatDock",
  component: ChatDock,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    viewport: { options: reviewViewports },
    docs: {
      description: {
        component: `
## Usage
The site's assistant, pinned to the bottom of the page. At rest it is a **PromptBar** with the brand mark. Hovering the bar shows suggested questions as pills above it. Clicking or typing into it opens the chat window in its place: the conversation, the suggestions as rows, the composer, and an optional disclaimer. Escape or **Close chat** returns to the resting bar.

The window is not modal: the page behind it stays usable. On phones it fills the screen. The app owns the conversation: it passes \`messages\`, sets \`thinking\` while a reply is on its way, and appends the reply. Copy **Pattern — chat dock**.

| Prop | Contract |
|------|----------|
| \`title\`, \`subtitle\`, \`mark\` | Window header. \`mark\` is an **Avatar** \`size="md"\`; it also starts the resting bar |
| \`greeting\` | First assistant message, always at the top |
| \`messages\` | \`{ id, role: "user" \\| "assistant", content }[]\`, oldest first. \`content\` is text or Markdown the app already rendered |
| \`thinking\` | Shows the thinking row after the last message |
| \`suggestions\` | \`{ id, label, icon?, prompt? }[]\`. With \`prompt\`: a pill at rest and a row in the window, and choosing it sends the prompt. Without: a row only, and \`onSuggestionSelect\` runs (for example **Start a project**) |
| \`followUps\` | The same items as \`suggestions\`, for the latest reply only. Shown while the last message is an assistant reply and \`thinking\` is off; gone the moment the visitor sends. The app decides which replies get them |
| \`followUpsPlacement\` | \`inline\` (default): rows in the conversation, under the reply. \`composer\`: pills pinned above the composer |
| \`onSend\` | Receives the typed message, a suggestion's prompt, or a follow-up's prompt |
| \`open\` / \`onOpenChange\` | Optional control of the window |
| \`placement\` | \`fixed\` (default) pins it to the viewport; \`inline\` keeps it in flow for previews |

## Anatomy
\`\`\`
ChatDock — fixed to the bottom, page grid at --grid-max 40rem, under SiteNav
├── at rest
│   ├── suggestion pills — Button secondary md + icon, shown on hover only
│   └── PromptBar — start: mark · field · send
└── open — Card layout shell on the surface (full screen below md)
    ├── header — mark · title · subtitle | IconButton close (shared overlay header)
    ├── conversation — greeting, replies as text, visitor turns on the brand tint, thinking row (Status dot); scrolls, stays at the end
    │   └── follow-ups (inline) — Button ghost rows under the latest reply, 44px on phones
    ├── suggestion rows — Button ghost row + icon, until the first message
    ├── follow-ups (composer) — Button secondary pills, wrap
    ├── PromptBar
    └── disclaimer — caption, muted
\`\`\`

## Best practices
- **Do** keep pill suggestions to two or three short questions. Put actions such as **Start a project** in the list only (no \`prompt\`).
- **Do** stream replies by updating the last assistant message's \`content\`; the thread stays pinned to the end while the reader is there.
- **Do** pass \`followUps\` only after replies that have an obvious next question — one to three, short labels, Lucide icons — and clear them when the visitor sends. Copy the follow-up state from **Pattern — chat dock**.
- **Do** keep follow-ups \`inline\`. They read as part of the answer and cost the conversation no height on a phone. Use \`composer\` only where the thread is long and the follow-ups must stay beside the field.
- **Don't** make suggestions the only way to ask: touch devices never see the pills, only the rows in the window.
- **Don't** add a second send arrow or an expand button to the header. Send is the composer's arrow. Voice is not part of this version.
- **Don't** mount a second dock on a page, or restyle **SiteNav** to make room for it.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ChatDock>;

export default meta;

type Story = StoryObj<typeof ChatDock>;

export const PatternChatDock: Story = {
  name: "Pattern — chat dock",
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        story: { inline: false, height: "720px" },
        description: {
          story:
            "The site assistant on a page. Hover the composer for the two suggested questions; click into it to open the window. **Start a project** runs the app's handler instead of sending. The reply here is a canned stand-in for the app's request.",
        },
      },
    },
    chatDockCopySource,
  ),
  render: () => <ChatDockPage />,
};

export const Open: Story = {
  name: "Open",
  parameters: {
    docs: {
      description: {
        story: "The window before the first message: greeting, suggestion rows, composer, disclaimer.",
      },
    },
  },
  render: () => (
    <div className="bg-body py-8">
      <ChatDock
        placement="inline"
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        suggestions={suggestions}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  ),
};

export const Conversation: Story = {
  name: "Conversation",
  parameters: {
    docs: {
      description: {
        story: "After the first message the suggestion rows give way to the thread. `thinking` shows the row under the last turn.",
      },
    },
  },
  render: () => (
    <div className="bg-body py-8">
      <ChatDock
        placement="inline"
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        messages={conversation}
        thinking
        suggestions={suggestions}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  ),
};

export const AtRest: Story = {
  name: "At rest",
  parameters: {
    docs: {
      description: {
        story: "The resting bar. Hover it to show the suggestion pills above it.",
      },
    },
  },
  render: () => (
    <div className="bg-body pb-8 pt-28">
      <ChatDock
        placement="inline"
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        suggestions={suggestions}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
      />
    </div>
  ),
};

export const At390: Story = {
  name: "At 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story: "On phones the window fills the screen, above the site navigation. The pills never show on touch; the rows do.",
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-body">
      <ChatDock
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        suggestions={suggestions}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  ),
};

const followUpConversation: ChatDockMessage[] = [
  { id: "q1", role: "user", content: "What do you make?" },
  { id: "a1", role: "assistant", content: makeReply },
];

const followUpItems = [followUpCost, followUpProcess, followUpStart];

function FollowUpsSpecimen({ followUpsPlacement }: { followUpsPlacement: "inline" | "composer" }) {
  return (
    <div className="min-h-screen bg-body">
      <ChatDock
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        messages={followUpConversation}
        suggestions={suggestions}
        followUps={followUpItems}
        followUpsPlacement={followUpsPlacement}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  );
}

export const FollowUpsInline: Story = {
  name: "Follow-ups — inline",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story:
          "Default. Three follow-ups as rows directly under the reply they belong to. They read as part of the answer and take no fixed height; they scroll with the thread, which stays pinned to the end.",
      },
    },
  },
  render: () => <FollowUpsSpecimen followUpsPlacement="inline" />,
};

export const FollowUpsAboveComposer: Story = {
  name: "Follow-ups — above the composer",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story:
          "`followUpsPlacement=\"composer\"`. The same three follow-ups as pills pinned between the conversation and the composer. At this width two fit on a line.",
      },
    },
  },
  render: () => <FollowUpsSpecimen followUpsPlacement="composer" />,
};

export const FollowUpsInlineAt390: Story = {
  name: "Follow-ups — inline at 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story: "Inline at 390. Each row is a 44px target and a long label stays on one line.",
      },
    },
  },
  render: () => <FollowUpsSpecimen followUpsPlacement="inline" />,
};

export const FollowUpsAboveComposerAt390: Story = {
  name: "Follow-ups — above the composer at 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story:
          "Above the composer at 390. Each pill takes its own line, so three follow-ups take about 150px from the conversation, and more once the keyboard is open.",
      },
    },
  },
  render: () => <FollowUpsSpecimen followUpsPlacement="composer" />,
};
