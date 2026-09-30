import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { AskWhatMatters, promptChatPatternCopySource } from "./PromptChatPattern";

const meta = {
  title: "Patterns/Prompt chat",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

An ask page. The landing is a short headline and **PromptBar**. Send keeps the bar in place: the headline fades, the sent line travels into a trailing pill, then a Steps trace plays. The trace leaves when the reply starts. The reply streams word by word out of a blur. One **TextLink** arrives with the words around it. When the stream finishes, **IconButton** actions and follow-up prompts become usable. The chat keeps **SiteNav**. The brand mark returns to the landing.

This story is the pattern alone. It is not mounted on the marketing page. **SiteNav** is reused as it exists — not restyled.

Voice and attachments are not part of this version. The trace and the reply are scripted sample copy. Nothing calls a model. \`prefers-reduced-motion\` skips the travel and the trace play, and shows the finished reply.

| Piece | Composition |
|-------|-------------|
| **Headline** | \`type-display-2\`, normal weight, \`--color-brand\` (\`#011272\`) |
| **Chat chrome** | **SiteNav** — existing brand mark and menu. The mark is home |
| **User turn** | Trailing pill on \`bg-fill-selected\`. Not a new Badge or Button variant |
| **Thinking** | Steps on this pattern. The label shimmers while the reply has not started, then the trace leaves. Reasoning, search, and coding keep the settled disclosure |
| **Reply** | \`type-body\`. Words resolve in place after the trace settles. One **TextLink** in the sentence. Not a card |
| **Actions** | **IconButton** \`sm\`, ghost. Copy, helpful, not helpful. After the stream |
| **Follow-ups** | **Button** \`role="outline"\` \`size="md"\`, full width of the column, quiet \`border-border\`. Prompts the user could send next |
| **Composer** | **PromptBar**, pinned to the bottom of the column |
| **Motion** | \`motion\` via \`motionTransitionProp\` — medium for the travel, fast for each word |

## Anatomy

\`\`\`
Page — cream field, no sidebar
├── Landing — headline, centered. No nav
│   or Chat — SiteNav, user pill, thinking trace until the reply starts, streaming reply, actions, follow-ups
└── PromptBar — pinned to the bottom
\`\`\`

## Best practices

- **Do** copy **Pattern — landing to chat**.
- **Do** keep the reply as text. Do not wrap it in a card.
- **Do** reuse **SiteNav** for the chat chrome. The brand mark returns home.
- **Don't** add voice, dictation, attachments, or a plus menu. Those are not part of this version.
- **Don't** mount this on the marketing homepage. **Don't** restyle **SiteNav**.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LandingToChat: Story = {
  name: "Pattern — landing to chat",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Landing first. Enter or the send control fades the headline and moves the sent line into the trailing pill. A Steps trace plays until the reply starts, then leaves. The reply streams after that. Actions and follow-ups wait until the stream finishes. SiteNav stays on the chat. The brand mark returns to the landing. Reduced motion shows the finished reply. Voice and attachments are not part of this version.",
        },
      },
    },
    promptChatPatternCopySource,
  ),
  render: () => <AskWhatMatters trace="steps" />,
};

export const Reasoning: Story = {
  name: "Reasoning",
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "The same ask page and the same trace. Send plays two sentences of prose, then the reply streams.",
      },
    },
  },
  render: () => <AskWhatMatters trace="reasoning" />,
};

export const Search: Story = {
  name: "Search",
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "The same ask page and the same trace. Send plays a query and source links, then the reply streams.",
      },
    },
  },
  render: () => <AskWhatMatters trace="search" />,
};

export const Coding: Story = {
  name: "Coding",
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "The same ask page and the same trace. Send plays files, an edit, and a command, then the reply streams.",
      },
    },
  },
  render: () => <AskWhatMatters trace="coding" />,
};
