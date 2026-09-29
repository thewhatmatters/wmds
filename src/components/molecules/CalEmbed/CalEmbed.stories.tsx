import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { CalEmbed } from "./CalEmbed";

const meta = {
  title: "Components/Forms/CalEmbed",
  component: CalEmbed,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Placeholder frame for a Cal.com embed, plus a **Skip, just email me** **TextLink**.

Theme the embed with the page tokens. Brand navy is \`--color-brand\` (#011272). The page floor is \`--color-background-body\`. Cards and the frame use \`--color-background-surface\`.

Pass the embed as \`children\`. \`onSkip\` runs the email path and cancels the href.

## Anatomy

\`\`\`
CalEmbed
├── frame — theming note + children slot
└── TextLink — Skip, just email me
\`\`\`

## Best practices

- **Do** keep the skip link even after the embed script is mounted.
- **Do** theme Cal.com from the tokens above. Do not introduce a new color role.
- **Don't** build a second calendar component.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof CalEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalEmbedPattern: Story = {
  name: "Pattern — cal embed",
  render: () => (
    <div className="w-full max-w-xl">
      <CalEmbed>
        <Button role="primary" type="button">
          Confirm this time
        </Button>
      </CalEmbed>
    </div>
  ),
  parameters: storyCopySource(`
import { Button, CalEmbed } from "@whatmatters/wmds";

export function BookACall() {
  return (
    <CalEmbed onSkip={() => undefined}>
      <Button role="primary" type="button">
        Confirm this time
      </Button>
    </CalEmbed>
  );
}
`),
};
