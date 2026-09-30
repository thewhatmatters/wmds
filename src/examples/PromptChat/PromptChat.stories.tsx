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

An ask page. The landing is a short headline and **PromptBar**. Send keeps the bar in place: the headline fades, the sent line travels into a trailing pill, then a static reply fades in. The chat keeps **SiteNav**. The brand mark returns to the landing.

This story is the pattern alone. It is not mounted on the marketing page. **SiteNav** is reused as it exists — not restyled.

Voice and attachments are not part of this version. The reply is sample copy. Nothing calls a model. \`prefers-reduced-motion\` skips the travel and shows the end state.

| Piece | Composition |
|-------|-------------|
| **Headline** | \`type-display-2\`, normal weight, \`--color-brand\` (\`#011272\`) |
| **Chat chrome** | **SiteNav** — existing brand mark and menu. The mark is home |
| **User turn** | Trailing pill on \`bg-fill-selected\`. Not a new Badge or Button variant |
| **Reply** | \`type-body\`. Not a card |
| **Composer** | **PromptBar**, pinned to the bottom of the column |
| **Motion** | \`motion\` via \`motionTransitionProp\` — medium for the travel, fast for the reply |

## Anatomy

\`\`\`
Page — cream field, no sidebar
├── Landing — headline, centered. No nav
│   or Chat — SiteNav, user pill, plain reply, empty space below
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
            "Landing first. Enter or the send control fades the headline, moves the sent line into the trailing pill, then fades in one static reply. SiteNav stays on the chat. The brand mark returns to the landing. Reduced motion shows the end state immediately. Voice and attachments are not part of this version.",
        },
      },
    },
    promptChatPatternCopySource,
  ),
  render: () => <AskWhatMatters />,
};
