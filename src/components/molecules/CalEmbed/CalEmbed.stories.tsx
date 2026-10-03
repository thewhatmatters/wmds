import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { Card } from "../Card/Card";
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

Theme the embed with the page tokens: \`--color-brand\`, \`--color-background-body\`, and \`--color-background-surface\`. The visible caption lists those token names only — not a hex literal.

Pass the embed as \`children\`. \`onSkip\` runs the email path and cancels the href.

When the calendar sits in **Card.Body**, place **CalEmbed.Skip** in **Card.Footer** and pass \`skip={false}\` (or \`skip={<CalEmbed.Skip />}\`) so the in-body skip is omitted. The skip is the same **TextLink**. Do not fork **Card**.

## Anatomy

\`\`\`
CalEmbed
└── frame — theming note + children slot
CalEmbed.Skip — TextLink (after the frame by default, or Card.Footer)
\`\`\`

## Best practices

- **Do** keep the skip link even after the embed script is mounted.
- **Do** put **CalEmbed.Skip** in **Card.Footer** when the embed is in **Card.Body**.
- **Do** theme Cal.com from the tokens above. Do not introduce a new color role.
- **Don't** render both the in-body skip and **CalEmbed.Skip**.
- **Don't** build a second calendar component.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof CalEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

const skipInFooterSource = `
import { Button, CalEmbed, Card } from "@whatmatters/wmds";

export function BookACall() {
  return (
    <Card padding="none" variant="surface">
      <Card.Body>
        <CalEmbed skip={false}>
          <Button role="primary" type="button">
            Confirm this time
          </Button>
        </CalEmbed>
      </Card.Body>
      <Card.Footer>
        <CalEmbed.Skip onSkip={() => undefined} />
        <Button role="secondary" type="button">
          Cancel
        </Button>
      </Card.Footer>
    </Card>
  );
}
`.trim();

export const PatternSkipInFooter: Story = {
  name: "Pattern — skip in footer",
  render: () => (
    <div className="w-full max-w-xl">
      <Card padding="none" variant="surface">
        <Card.Body>
          <CalEmbed skip={false}>
            <Button role="primary" type="button">
              Confirm this time
            </Button>
          </CalEmbed>
        </Card.Body>
        <Card.Footer>
          <CalEmbed.Skip onSkip={() => undefined} />
          <Button role="secondary" type="button">
            Cancel
          </Button>
        </Card.Footer>
      </Card>
    </div>
  ),
  parameters: storyCopySource(skipInFooterSource),
};

export const ReferenceInBodySkip: Story = {
  name: "Reference — in-body skip",
  parameters: {
    docs: {
      description: {
        story:
          "Default skip after the frame when there is no Card.Footer. Prefer **Pattern — skip in footer** when the embed is in a Card.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-xl">
      <CalEmbed onSkip={() => undefined}>
        <Button role="primary" type="button">
          Confirm this time
        </Button>
      </CalEmbed>
    </div>
  ),
};
