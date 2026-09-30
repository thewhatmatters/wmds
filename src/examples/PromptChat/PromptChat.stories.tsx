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

An ask page. The landing is a short headline and **PromptBar**. Send replaces the headline with one exchange: the sent line as a pill, a static reply as plain text, and the same prompt bar pinned to the bottom.

This story is the pattern alone. It is not mounted on the marketing page.

Voice and attachments are not part of this version. The reply is sample copy. Nothing calls a model.

| Piece | Composition |
|-------|-------------|
| **Headline** | \`type-display-2\`, normal weight, \`--color-brand\` (\`#011272\`) |
| **User turn** | Trailing pill on \`bg-fill-selected\`. Not a new Badge or Button variant |
| **Reply** | \`type-body\`. Not a card |
| **Composer** | **PromptBar**, pinned to the bottom of the column |

## Anatomy

\`\`\`
Page — cream field, one centered column, no sidebar
├── Landing — headline, centered
│   or Chat — user pill, then plain reply, empty space below
└── PromptBar — pinned to the bottom
\`\`\`

## Best practices

- **Do** copy **Pattern — landing to chat**.
- **Do** keep the reply as text. Do not wrap it in a card.
- **Don't** add voice, dictation, attachments, or a plus menu. Those are not part of this version.
- **Don't** mount this on the marketing homepage or SiteNav.
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
            "Landing first. Enter or the send control clears the headline and shows the sent line plus one static reply. The prompt bar stays at the bottom. Voice and attachments are not part of this version.",
        },
      },
    },
    promptChatPatternCopySource,
  ),
  render: () => <AskWhatMatters />,
};
