import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { ChatQa } from "./ChatQa";

const samplePairs = [
  { question: "What are you shipping next?", answer: "A new feature" },
  { question: "Which platforms does it need to cover?", answer: "Web, Chrome extension" },
  {
    question: "Rank WhatMatters most for this launch",
    answer:
      "Ranked: 1. Speed to ship, 2. Polish, 3. Marketing readiness, 4. Test coverage",
  },
] as const;

const sampleReply =
  "That's the full loop — shipping surface, platforms, and what to optimize for first. Next we would sketch the feature path, then pin the Chrome extension shell so the web cut and the extension stay on one system.";

const chatQaCopySource = `
import { ChatQa } from "@whatmatters/wmds";

const pairs = [
  { question: "What are you shipping next?", answer: "A new feature" },
  { question: "Which platforms does it need to cover?", answer: "Web, Chrome extension" },
  {
    question: "Rank WhatMatters most for this launch",
    answer: "Ranked: 1. Speed to ship, 2. Polish, 3. Marketing readiness, 4. Test coverage",
  },
];

export function IntakeAnswersInThread() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <ChatQa pairs={pairs} />
      <p className="type-body text-fg">
        That's the full loop — shipping surface, platforms, and what to optimize for first. Next we would sketch the feature path, then pin the Chrome extension shell so the web cut and the extension stay on one system.
      </p>
    </div>
  );
}
`.trim();

const meta = {
  title: "Components/ChatQa",
  component: ChatQa,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Quiet Q&A summary for an AI chat thread. After a gate or form finishes, render the collected pairs as one light panel in the thread. The agent's reply stays **outside and below** the panel — nothing between them.

| Piece | Composition |
|-------|-------------|
| **Panel** | Surface fill, thin \`border-border\`, large radius — not a **Card**, not brand navy |
| **Question** | \`type-body\` muted |
| **Answer** | \`type-label\` foreground — already a string (one choice, comma list, or ranked line) |

Pass an ordered \`pairs\` list. Do not invent a tool-result slot inside the panel. Thinking rows and hover reply actions stay outside.

## Anatomy

\`\`\`
ChatQa (dl) — quiet rounded panel
└── pair (div) × N
    ├── dt — muted question
    └── dd — heavier answer
\`\`\`

Reply text, thinking, and actions are **siblings below** in the thread — not children of **ChatQa**.

## Best practices

- **Do** copy **Pattern — Q&A with reply**. \`className\` is width and margin only.
- **Do** format answers in app code before passing them in.
- **Don't** wrap the reply, thinking row, or hover actions inside the panel.
- **Don't** add a new **Card** / **Badge** / **Button** variant or a new color for this block.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ChatQa>;

export default meta;
type Story = StoryObj<typeof meta>;
/** Stories that pass required props in their own JSX — args stay optional. */
type RenderStory = StoryObj<typeof ChatQa>;

export const PatternQaWithReply: RenderStory = {
  name: "Pattern — Q&A with reply",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Quiet Q&A panel in the thread, then the agent reply directly under it. No thinking row or hover actions inside the panel. Answers are plain strings — single choice, comma list, or a ranked line.",
        },
      },
    },
    chatQaCopySource,
  ),
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <ChatQa pairs={samplePairs} />
      <p className="type-body text-fg">{sampleReply}</p>
    </div>
  ),
};

export const ReferencePairs: Story = {
  name: "Reference — pairs only",
  parameters: {
    docs: {
      description: {
        story: "Panel alone for Controls and visual review. Prefer the Pattern story for the thread contract.",
      },
    },
  },
  args: {
    pairs: [...samplePairs],
  },
};
