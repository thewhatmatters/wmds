import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { Chip } from "../Chip/Chip";
import {
  Card,
  cardBodyTextClasses,
  cardPaddings,
  cardShapes,
  cardTitleClasses,
  cardVariants,
} from "./Card";

function mutedText(className: string) {
  return `${className} text-muted`;
}

const meta = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    shape: { control: "select", options: [...cardShapes] },
    variant: { control: "select", options: [...cardVariants] },
    padding: { control: "select", options: [...cardPaddings] },
    as: { control: "select", options: ["div", "article", "section"] },
  },
  args: {
    shape: "flush",
    variant: "surface",
    padding: "none",
    as: "div",
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

[Astryx Card](https://astryx.atmeta.com/components/Card) layout — **Header**, **Body**, **Footer**. No elevation by default; depth comes from the **panel** around the card.

| Pattern | Composition |
|---------|-------------|
| **Simple** | \`Card padding="md"\` — padded content block |
| **Layout** | \`Card padding="none"\` + \`Card.Header\` / \`Card.Body\` / \`Card.Footer\` |
| **Panel inset** | \`shape="flush"\` (default) inside sidebar/panel — no card radius |
| **Standalone** | \`shape="rounded"\` when the card owns the outer chrome |

**Default shape:** \`flush\` — Farmer Market detail in a sidebar should read as *inside* the panel, not a floating tile.

## Best practices

- **Do** use \`flush\` for FM market detail, settings panels, list selection panes.
- **Do** set \`padding="none"\` when using Header/Body/Footer — sections own spacing.
- **Do** use \`rounded\` only when the card floats on \`bg\` without a panel wrapper.
- **Don't** add shadow/elevation on the card when the parent panel already frames the content.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  name: "Pattern — simple",
  args: {
    padding: "md",
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <h2 className={cardTitleClasses}>Simple card</h2>
      <p className={mutedText(cardBodyTextClasses)}>
        Padded content without header/footer regions — quick summaries or empty states.
      </p>
    </Card>
  ),
};

export const Layout: Story = {
  name: "Pattern — layout",
  render: () => (
    <Card className="max-w-md">
      <Card.Header>
        <h2 className={cardTitleClasses}>Card title</h2>
        <p className={mutedText(cardBodyTextClasses)}>Optional subtitle or metadata.</p>
      </Card.Header>
      <Card.Body>
        <p className={cardBodyTextClasses}>
          Body content — market hours, description, or list detail.
        </p>
      </Card.Body>
      <Card.Footer>
        <Button role="ghost" size="sm">
          Secondary
        </Button>
        <Button role="primary" size="sm">
          Primary
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const PanelInset: Story = {
  name: "Pattern — panel inset (FM)",
  parameters: {
    docs: {
      description: {
        story:
          "Flush card inside a panel — no card radius; the panel owns the outer shape. Farmer Market sidebar target.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-bg shadow-raised">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-fg">Market detail</p>
      </div>
      <Card variant="surface" shape="flush">
        <Card.Header>
          <h2 className={cardTitleClasses}>Portland Farmers Market</h2>
          <p className={mutedText(cardBodyTextClasses)}>1831 SW Jefferson St</p>
        </Card.Header>
        <Card.Body className="flex flex-col gap-3">
          <p className={cardBodyTextClasses}>Open Saturdays · 8:30am – 2pm</p>
          <div className="flex flex-wrap gap-2">
            <Chip readOnly size="sm">
              SNAP
            </Chip>
            <Chip readOnly size="sm" icon={<MapPin strokeWidth={2} />}>
              1.2 mi
            </Chip>
          </div>
        </Card.Body>
        <Card.Footer>
          <Button role="ghost" size="sm">
            Share
          </Button>
          <Button role="primary" size="sm" icon={<MapPin strokeWidth={2} />}>
            Get directions
          </Button>
        </Card.Footer>
      </Card>
    </div>
  ),
};

export const RoundedStandalone: Story = {
  name: "Shape — rounded (standalone)",
  args: {
    shape: "rounded",
    variant: "outlined",
    padding: "md",
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <h2 className={cardTitleClasses}>Floating card</h2>
      <p className={mutedText(cardBodyTextClasses)}>
        Use shape=&quot;rounded&quot; when the card sits directly on the page background — not inside a panel.
      </p>
    </Card>
  ),
};
