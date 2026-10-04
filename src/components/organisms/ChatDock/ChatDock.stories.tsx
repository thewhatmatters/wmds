import { useState } from "react";
import { MotionConfig } from "motion/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, CalendarClock, DollarSign } from "lucide-react";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { storybookViewports } from "../../../lib/viewports";
import { Avatar } from "../../atoms/Avatar/Avatar";
import {
  ChatDock,
  type ChatDockFeedback,
  type ChatDockMessage,
  type ChatDockMessageMeta,
  type ChatDockSuggestion,
} from "./ChatDock";

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
import {
  Avatar,
  ChatDock,
  type ChatDockFeedback,
  type ChatDockMessage,
  type ChatDockMessageMeta,
  type ChatDockSuggestion,
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

/** What \`ask\` resolves with: the reply, or the reply with its follow-ups, its score, and the text Copy copies. */
export type AskWhatMattersResult =
  | string
  | { reply: string; followUps?: ChatDockSuggestion[]; meta?: ChatDockMessageMeta; copyText?: string };

export interface AskWhatMattersProps {
  /** The app's assistant request. Resolves with the reply, and with its follow-ups, score, and copy text when there are any. */
  ask: (prompt: string, history: ChatDockMessage[]) => Promise<AskWhatMattersResult>;
  /** The visitor voted on a reply, or cleared their vote (\`null\`). */
  onFeedback: (reply: ChatDockMessage, value: ChatDockFeedback) => void;
  /** Opens the Start a project intake. */
  onStartProject: () => void;
}

export function AskWhatMatters({ ask, onFeedback, onStartProject }: AskWhatMattersProps) {
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
        },
      ]);
      setFollowUps(answer.followUps ?? []);
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
      onMessageFeedback={handleFeedback}
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

/** What `ask` resolves with: the reply, or the reply with its follow-ups, its score, and the text Copy copies. */
type AskWhatMattersResult =
  | string
  | { reply: string; followUps?: ChatDockSuggestion[]; meta?: ChatDockMessageMeta; copyText?: string };

interface AskWhatMattersProps {
  /** The app's assistant request. Resolves with the reply, and with its follow-ups, score, and copy text when there are any. */
  ask: (prompt: string, history: ChatDockMessage[]) => Promise<AskWhatMattersResult>;
  /** The visitor voted on a reply, or cleared their vote (`null`). */
  onFeedback: (reply: ChatDockMessage, value: ChatDockFeedback) => void;
  /** Opens the Start a project intake. */
  onStartProject: () => void;
}

function AskWhatMatters({ ask, onFeedback, onStartProject }: AskWhatMattersProps) {
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
        },
      ]);
      setFollowUps(answer.followUps ?? []);
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
      onMessageFeedback={handleFeedback}
      placeholder="Ask anything about WhatMatters"
      disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
    />
  );
}

/** Follow-ups carry no icon: inline rows all lead with the same arrow, and pills above the composer are text only. */
const followUpCost: ChatDockSuggestion = {
  id: "cost",
  label: "How much does a project cost?",
  prompt: "How much does a project cost?",
};
const followUpProcess: ChatDockSuggestion = {
  id: "process",
  label: "How does a project work?",
  prompt: "How does a project work?",
};
const followUpStart: ChatDockSuggestion = { id: "start", label: "Start a project" };

const makeReply =
  "Brand identity, web experiences, mobile apps, social media, content and copy, and AI assistants. Then launch, growth, and care once it ships.";

/** The app's match score for a reply — WMDS shows the text the app passes. */
function matchScore(percent: number): ChatDockMessageMeta {
  return {
    label: `Match ${percent}%`,
    description: "How sure the assistant is that it matched your question.",
  };
}

/**
 * Storybook stand-in for the app's request: a short pause, then a canned reply. Some replies bring
 * follow-ups or a match score and some do not — the app decides.
 */
function demoAsk(prompt: string): Promise<AskWhatMattersResult> {
  const text = prompt.toLowerCase();
  const result: AskWhatMattersResult = text.includes("make")
    ? { reply: makeReply, followUps: [followUpCost, followUpProcess, followUpStart], meta: matchScore(99) }
    : text.includes("cost")
      ? {
          reply: "Most projects start at a fixed scope. Tell us what you need and we'll send a range within a day.",
          followUps: [followUpProcess, followUpStart],
          meta: matchScore(97),
        }
      : text.includes("work")
        ? {
            reply: "A short discovery call, a written plan, then weekly reviews until launch.",
            followUps: [followUpStart],
            meta: matchScore(94),
          }
        : text.includes("long")
          ? { reply: "A focused brand or product sprint takes four to six weeks. Larger builds run in phases.", meta: matchScore(91) }
          : "Good question. Share a little about the project and we'll point you to the right next step.";
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(result), 1200);
  });
}

/** Page behind the dock — Storybook-only, so the pinned composer has something to sit over. */
function ChatDockPage() {
  const [intakeOpened, setIntakeOpened] = useState(false);
  const [lastVote, setLastVote] = useState<ChatDockFeedback | undefined>(undefined);

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
              {intakeOpened ? "Start a project opens the intake here." : "Start a project calls the app's handler."}{" "}
              {lastVote === undefined
                ? "Votes on a reply go to the app's handler."
                : lastVote === null
                  ? "The app's handler got a cleared vote."
                  : `The app's handler got a ${lastVote === "up" ? "helpful" : "not helpful"} vote.`}
            </p>
          </div>
        </div>
      </main>
      <AskWhatMatters
        ask={demoAsk}
        onFeedback={(_reply, value) => setLastVote(value)}
        onStartProject={() => setIntakeOpened(true)}
      />
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
The site's assistant, pinned to the bottom of the page. At rest it is a **PromptBar** with the brand mark. Hovering the bar shows suggested questions as pills above it. Clicking or typing into it opens the chat window around the same composer: the window grows up and out of the bar, the mark moves to the header, and the composer keeps its width, rising only by the disclaimer line under it. Escape or **Close chat** folds the window back into the bar. Either can interrupt the other midway.

The window is not modal: the page behind it stays usable. On phones it fills the screen, rising from the bottom edge. With reduced motion the window crossfades in place. The app owns the conversation: it passes \`messages\`, sets \`thinking\` while a reply is on its way, and appends the reply. Copy **Pattern — chat dock**.

| Prop | Contract |
|------|----------|
| \`title\`, \`subtitle\`, \`mark\` | Window header. \`mark\` is an **Avatar** \`size="md"\`; it also starts the resting bar |
| \`greeting\` | First assistant message, always at the top |
| \`messages\` | \`{ id, role: "user" \\| "assistant", content }[]\`, oldest first. \`content\` is text or Markdown the app already rendered. Replies can add \`copyText\` (shows **Copy**), \`meta\` (\`{ label, description? }\`, a muted note such as the match score), and \`feedback\` (\`"up" \\| "down" \\| null\`, the visitor's vote) |
| \`thinking\` | Shows the thinking row after the last message |
| \`suggestions\` | \`{ id, label, icon?, prompt? }[]\`. With \`prompt\`: a pill at rest and a row in the window, and choosing it sends the prompt. Without: a row only, and \`onSuggestionSelect\` runs (for example **Start a project**) |
| \`followUps\` | The same items as \`suggestions\`, for the latest reply only; their \`icon\` is not shown. Shown while the last message is an assistant reply and \`thinking\` is off; gone the moment the visitor sends. The app decides which replies get them |
| \`followUpsPlacement\` | \`inline\` (default): rows in the conversation, under the reply. \`composer\`: pills pinned above the composer |
| \`onSend\` | Receives the typed message, a suggestion's prompt, or a follow-up's prompt |
| \`onMessageFeedback\` | Shows the thumbs under every finished reply and receives each vote (\`null\` clears it). The app passes the vote back as the reply's \`feedback\` |
| \`open\` / \`onOpenChange\` | Optional control of the window |
| \`placement\` | \`fixed\` (default) pins it to the viewport; \`inline\` keeps it in flow for previews |

## Anatomy
\`\`\`
ChatDock — fixed to the bottom, page grid at --grid-max 40rem, under SiteNav
├── suggestion pills — Button secondary md + icon, on hover while the window is closed
├── window — opaque card on the surface behind the composer; grows from the bar (full screen below md, rising from the bottom edge)
│   ├── header — mark · title · subtitle | IconButton close (shared overlay header)
│   ├── conversation — greeting, replies as text, visitor turns on the brand tint, thinking row (Status dot); scrolls, stays at the end
│   │   ├── reply row — IconButton ghost Copy · thumbs up / down (toggles) · score caption; under finished replies, on hover or focus (always on touch)
│   │   └── follow-ups (inline) — Button ghost rows under the latest reply, each led by the corner-down-right arrow, 44px on phones
│   ├── suggestion rows — Button ghost row + icon, until the first message
│   └── follow-ups (composer) — Button secondary pills, text only, wrap
└── composer — one PromptBar in both states
    ├── start: mark — folds away while the window is open
    └── disclaimer — caption, muted, opens under the composer
\`\`\`

## Best practices
- **Do** keep pill suggestions to two or three short questions. Put actions such as **Start a project** in the list only (no \`prompt\`).
- **Do** stream replies by updating the last assistant message's \`content\`; the thread stays pinned to the end while the reader is there.
- **Do** pass \`followUps\` only after replies that have an obvious next question — one to three, short labels — and clear them when the visitor sends. Leave out \`icon\`: every inline row leads with the same corner-down-right arrow, and pills above the composer are text only. Copy the follow-up state from **Pattern — chat dock**.
- **Do** keep follow-ups \`inline\`. They read as part of the answer and cost the conversation no height on a phone. Use \`composer\` only where the thread is long and the follow-ups must stay beside the field.
- **Do** pass \`meta\` only for a score the app stands behind: a short \`label\` ("Match 99%") and a \`description\` that says what it measures. It is read to screen readers after the label.
- **Do** keep votes in the app and pass each one back as the reply's \`feedback\`. **Pattern — chat dock** holds them and hands each vote to \`onFeedback\`.
- **Don't** put buttons or scores inside a reply's \`content\` — use \`copyText\`, \`meta\`, and \`onMessageFeedback\`.
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
        story: "The resting bar. Hover it to show the suggestion pills above it; click into it to open the window. An inline specimen keeps the open window's height free above the bar.",
      },
    },
  },
  render: () => (
    <div className="bg-body py-8">
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

export const ReducedMotion: Story = {
  name: "Reduced motion",
  parameters: {
    docs: {
      description: {
        story:
          "With reduced motion the window does not grow or rise: it crossfades in place at full size. Nothing slides: the mark and the disclaimer line under the composer switch at once, so the composer steps up by that line. Click into the bar to open it.",
      },
    },
  },
  render: () => (
    <MotionConfig reducedMotion="always">
      <div className="bg-body py-8">
        <ChatDock
          placement="inline"
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
    </MotionConfig>
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

const costReply = "Most projects start at a fixed scope. Tell us what you need and we'll send a range within a day.";

const replyConversation: ChatDockMessage[] = [
  { id: "q1", role: "user", content: "What do you make?" },
  { id: "a1", role: "assistant", content: makeReply, copyText: makeReply, meta: matchScore(99), feedback: "up" },
  { id: "q2", role: "user", content: "How much does a project cost?" },
  { id: "a2", role: "assistant", content: costReply, copyText: costReply, meta: matchScore(97) },
];

/** Holds the votes the way **Pattern — chat dock** does, so the thumbs toggle. */
function ReplyActionsSpecimen() {
  const [messages, setMessages] = useState(replyConversation);
  return (
    <div className="min-h-screen bg-body">
      <ChatDock
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        messages={messages}
        suggestions={suggestions}
        onSend={() => undefined}
        onMessageFeedback={(reply, value) =>
          setMessages((current) =>
            current.map((message) => (message.id === reply.id ? { ...message, feedback: value } : message)),
          )
        }
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  );
}

/** Focuses the latest reply's Copy, as a keyboard user tabbing into the row would. */
async function focusLatestCopy(canvasElement: HTMLElement) {
  const rows = canvasElement.querySelectorAll<HTMLElement>("[data-reply-actions='ready']");
  rows[rows.length - 1]?.querySelector<HTMLButtonElement>("button")?.focus();
}

export const ReplyActions: Story = {
  name: "Reply actions",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story:
          "Hover a reply to show its row: **Copy** (`copyText`), the thumbs (`onMessageFeedback`), and the score (`meta`). The row keeps its place while hidden, so the thread never moves. The first reply has a helpful vote; pressing the active thumb clears it. On a touch screen the row is always shown.",
      },
    },
  },
  render: () => <ReplyActionsSpecimen />,
};

export const ReplyActionsKeyboardFocus: Story = {
  name: "Reply actions — keyboard focus",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story: "Focus inside a reply shows its row, so keyboard users reach the same actions. Here the latest reply's Copy has focus.",
      },
    },
  },
  render: () => <ReplyActionsSpecimen />,
  play: async ({ canvasElement }) => {
    await focusLatestCopy(canvasElement);
  },
};

export const ReplyActionsDark: Story = {
  name: "Reply actions — dark",
  globals: {
    viewport: { value: "review1280", isRotated: false },
    theme: "dark",
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: { story: "The same row in the dark theme, shown by keyboard focus." },
    },
  },
  render: () => <ReplyActionsSpecimen />,
  play: async ({ canvasElement }) => {
    await focusLatestCopy(canvasElement);
  },
};

export const ReplyActionsAt390: Story = {
  name: "Reply actions at 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story:
          "On phones each button is a 44px target. A touch screen shows the row under every finished reply without hover; a desktop browser at this width still reveals it on hover or focus (focus shown here).",
      },
    },
  },
  render: () => <ReplyActionsSpecimen />,
  play: async ({ canvasElement }) => {
    await focusLatestCopy(canvasElement);
  },
};

export const ReplyActionsAt390Dark: Story = {
  name: "Reply actions at 390 — dark",
  globals: {
    viewport: { value: "review390", isRotated: false },
    theme: "dark",
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: { story: "The phone row in the dark theme." },
    },
  },
  render: () => <ReplyActionsSpecimen />,
  play: async ({ canvasElement }) => {
    await focusLatestCopy(canvasElement);
  },
};
