import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { Card } from "../Card/Card";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { CalEmbed } from "./CalEmbed";

const meta = {
  title: "Components/CalEmbed",
  component: CalEmbed,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Frame for a Cal.com embed, plus a **Skip, just email me** **TextLink**.

Pass the embed as \`children\` and theme it with the page tokens: \`--color-brand\`, \`--color-background-body\`, and \`--color-background-surface\`. With no children the frame shows a visitor-facing **empty state** (\`emptyTitle\`, \`emptyDescription\`) that points at the skip — never a blank frame or developer notes. \`onSkip\` runs the email path and cancels the href.

When the calendar sits in **Card.Body**, place **CalEmbed.Skip** in **Card.Header** (above the calendar) and pass \`skip={false}\` (or \`skip={<CalEmbed.Skip />}\`) so the in-body skip is omitted. The skip is the same **TextLink**. Do not fork **Card**.

## Anatomy

\`\`\`
CalEmbed
└── frame — children (the embed), or the empty state: emptyTitle + emptyDescription
CalEmbed.Skip — TextLink (above the frame by default, inside the empty state, or Card.Header)
\`\`\`

## Best practices

- **Do** keep the skip link even after the embed script is mounted.
- **Do** keep the skip visible without scrolling past the calendar at 390 (Contact and booking forms T8): the in-body skip sits above the frame, and with no embed it sits inside the empty state. If you place **CalEmbed.Skip** yourself, put it above the calendar or in a pinned footer, never after a month grid.
- **Do** keep booking optional and after the details are sent.
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

const skipAboveSource = `
import { CalEmbed, Card } from "@thewhatmatters/wmds";

export function BookACall() {
  return (
    <Card padding="none" variant="surface">
      <Card.Header start={<span className="type-label">Pick a time (optional)</span>} end={<CalEmbed.Skip onSkip={() => undefined} />} />
      <Card.Body>
        <CalEmbed skip={false}>{/* Mount the Cal.com embed here. */}</CalEmbed>
      </Card.Body>
    </Card>
  );
}
`.trim();

export const PatternSkipAbove: Story = {
  name: "Pattern — skip above the calendar",
  parameters: {
    ...storyCopySource(skipAboveSource),
    docs: {
      ...storyCopySource(skipAboveSource).docs,
      description: {
        story:
          "In a Card, the skip sits in **Card.Header**, above the calendar, so on a phone it's visible without scrolling past the month (Contact and booking forms T8).",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-xl">
      <Card padding="none" variant="surface">
        <Card.Header
          start={<span className="type-label">Pick a time (optional)</span>}
          end={<CalEmbed.Skip onSkip={() => undefined} />}
        />
        <Card.Body>
          <CalEmbed skip={false}>
            <div className="h-96 w-full rounded-md bg-body" aria-label="Calendar placeholder" role="img" />
          </CalEmbed>
        </Card.Body>
      </Card>
    </div>
  ),
};

export const ReferenceInBodySkip: Story = {
  name: "Reference — in-body skip",
  parameters: {
    docs: {
      description: {
        story:
          "Default skip above the frame when CalEmbed stands alone. In a Card, use **Pattern — skip above the calendar**.",
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
