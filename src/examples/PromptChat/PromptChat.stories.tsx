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

An ask page. The landing is a short headline and **PromptBar**. Send keeps the bar in place: the headline fades, the sent line fades in where it rests, then a collapsed sparkle row shows a Thought-for timer — supporting type and muted gray, smaller than the reply. Expand it while thinking to read the steps. The whole row leaves when the reply starts. The reply streams word by word out of a blur. One **TextLink** arrives with the words around it. When the stream finishes, copy / thumbs **IconButton** actions sit under that reply and stay hidden until hover (touch opens that reply only). Follow-up prompts become usable after the stream. A follow-up, or another send, appends that line in the same thread. Earlier messages stay. The page shell is \`h-[100svh]\`. When the thread is taller than that view, it scrolls inside the narrowed column. The thread reserves the composer's measured height plus the space under the pill, including while a reply is still growing, so the reply and its follow-ups finish above the composer. The composer stays pinned. The chat keeps **SiteNav**. The brand mark returns to the landing.

This story is the pattern alone. It is not mounted on the marketing page. **SiteNav** is reused as it exists — not restyled.

Voice and attachments are not part of this version. The trace and the reply are scripted sample copy. Nothing calls a model. \`prefers-reduced-motion\` skips the fade and the trace play, and shows the finished reply.

| Piece | Composition |
|-------|-------------|
| **Headline** | \`type-display-2\`, normal weight, \`--color-brand\` (\`#011272\`) |
| **Chat chrome** | **SiteNav** — existing brand mark and menu. The mark is home |
| **User turn** | Trailing pill on \`bg-fill-selected\`. Not a new Badge or Button variant |
| **Thinking** | Collapsed sparkle + Thought-for timer on this pattern. Supporting size and muted gray. Expandable while thinking; the row leaves when the reply starts. Reasoning, search, and coding keep the settled disclosure |
| **Reply** | \`type-body\`, full width of the thread. Words resolve in place. One **TextLink** in the sentence. Not a card |
| **Actions** | **IconButton** \`sm\`, ghost. Copy, helpful, not helpful. Under the reply, hidden until hover / focus-within (or touch-open on that reply) |
| **Follow-ups** | **Button** \`role="outline"\` \`size="md"\`, same column as the reply, quiet \`border-border\`. Clicking one appends that line in the same thread |
| **Composer** | **PromptBar**, same narrowed column as the thread, pinned under the scrolling stage. **Start Project** in **SiteNav** swaps it for a starter **Card** gate in place; Cancel restores the bar |
| **Start gate** | Real **Card** \`padding="none"\` with **Card.Header** / **Card.Body** / **Card.Footer**. Body keeps the 2px gutter; occupant uses the documented inset well. **Checkbox** rows + **Kbd** digits. **Button** Cancel / Next trailing. Distinct WhatMatters choices — not four identical placeholders |
| **Intake summary** | After **Done**, collected answers append as **ChatQa** in the thread — quiet surface panel, muted questions, heavier answers. The scripted reply sits directly under the panel (no thinking row between them) |
| **Motion** | \`motion\` via \`motionTransitionProp\`. The sent line fades in. Fast for each word |

## Anatomy

\`\`\`
Page — cream field, no sidebar, narrowed page grid (40rem)
├── Landing — headline, centered. No nav
│   or Chat — SiteNav, thread in that column (scrolls)
│              each turn stays: user pill, Thought-for row until that reply starts, reply, hover actions
│              Start Project Done → ChatQa panel + reply under it (no thinking between)
│              follow-ups on the latest turn only. The stage scrolls; the bar does not
└── PromptBar — same column, pinned
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
            "Landing first. Enter or the send control fades the headline, and the sent line fades in where it rests. A collapsed sparkle + Thought-for timer plays — supporting type and muted gray — until the reply starts, then leaves. Expand the row while thinking to read the steps. The reply streams after that. Copy / thumbs actions stay under the reply and hide until hover. Follow-ups wait until the stream finishes. A follow-up appends the next user line in the same thread. The page shell is h-[100svh]. When the thread is taller than that view, it scrolls inside the narrowed column. The thread reserves the composer's measured height plus the space under the pill, including while a reply is still growing, so the reply and its follow-ups finish above the composer. The composer stays pinned. SiteNav stays on the chat. The brand mark returns to the landing. Reduced motion shows the finished reply. Voice and attachments are not part of this version.",
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
