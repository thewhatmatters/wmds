import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clock, Globe } from "lucide-react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { List } from "../List/List";
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
    shape: "rounded",
    variant: "surface",
    padding: "none",
    as: "div",
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

[Astryx Card](https://astryx.atmeta.com/components/Card) — **Header** and **Footer** sit on a white shell; **Body** is a muted inset **slot**. Put almost any supporting content in the Body — TaskRows, List, forms, or a custom canvas. The shell does not care what occupies the well.

| Pattern | Composition |
|---------|-------------|
| **Layout** | \`Card padding="none"\` + \`Card.Header\` / \`Card.Body\` / \`Card.Footer\` — default; shell + Body slot |
| **Simple** | \`Card padding="md"\` — flat padded block (no sections) |

Default \`shape="rounded"\` — \`rounded-2xl shadow-md\` on the shell. Use \`shape="flush"\` only when a parent owns outer radius and shadow.

## Anatomy

\`\`\`
Card (bg-surface shell, p-4, gap-3)
├── Card.Header   — title, metadata (on shell)
├── Card.Body     — \`bg-body\` inset well — composition slot (4px gutter)
└── Card.Footer   — status, actions (on shell)
\`\`\`

## Best practices

- **Do** set \`padding="none"\` when using Header/Body/Footer.
- **Do** treat \`Card.Body\` as a slot — TaskRows, List, Inputs, or custom UI all belong there.
- **Do** keep title, address, and meta in **Header**; primary actions in **Footer**.
- **Do** use default \`shape="rounded"\` — FM market detail, dashboard widgets, map overlays.
- **Do** use \`shape="flush"\` only when nested inside a parent that already owns radius and shadow.
- **Don't** restrict the Body to TaskRows — that is one occupant, not the contract.
- **Don't** re-theme the inset well with \`className\` — put layout tweaks on the root only.
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
    shape: "rounded",
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
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Default layout card — white shell, muted inset **Body** slot, header and footer on the shell. The dashed well is the slot; swap in any occupant.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header>
        <div className="flex items-center justify-between gap-3">
          <h2 className={cardTitleClasses}>Meeting Finder</h2>
          <Badge size="sm">11:00 UTC</Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-surface/60">
          <p className={mutedText(cardBodyTextClasses)}>
            Body slot — TaskRows, List, form, or custom canvas
          </p>
        </div>
      </Card.Body>
      <Card.Footer>
        <span className={mutedText(cardBodyTextClasses)}>1 of 4 in working hours</span>
        <Button role="primary" size="sm" icon={<Clock strokeWidth={2} />}>
          Find best time
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const BodySlotList: Story = {
  name: "Pattern — body slot (List)",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "**List** in the Body slot — same shell as layout Card. List owns row chrome; Card owns the well.",
      },
    },
  },
  render: function BodySlotListDemo() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header>
          <h2 className={cardTitleClasses}>Nearby markets</h2>
          <p className={mutedText(cardBodyTextClasses)}>Saturday · within 5 mi</p>
        </Card.Header>
        <Card.Body>
          <List
            variant="surface"
            hasDividers
            className="overflow-hidden rounded-[1.375rem]"
          >
            <List.Item
              layout="stacked"
              primary="SFC Farmers' Market Downtown"
              secondary="422 Guadalupe St"
              meta="0.8 mi"
              selected={selected === "downtown"}
              onPress={() => setSelected("downtown")}
            />
            <List.Item
              layout="stacked"
              primary="Triangle Farmers Market"
              secondary="122 E Main St"
              meta="2.1 mi"
              selected={selected === "triangle"}
              onPress={() => setSelected("triangle")}
            />
            <List.Item
              layout="stacked"
              primary="Eastside Farm Stand"
              secondary="1800 E 12th St"
              meta="3.4 mi"
              selected={selected === "eastside"}
              onPress={() => setSelected("eastside")}
            />
          </List>
        </Card.Body>
        <Card.Footer>
          <span className={mutedText(cardBodyTextClasses)}>3 results</span>
          <Button role="secondary" size="sm">
            View map
          </Button>
        </Card.Footer>
      </Card>
    );
  },
};

export const BodySlotForm: Story = {
  name: "Pattern — body slot (form)",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Form controls in the Body slot — Inputs and helper copy sit in the well; the footer keeps the action.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header>
        <h2 className={cardTitleClasses}>Working hours</h2>
        <p className={mutedText(cardBodyTextClasses)}>Used to score overlapping time zones</p>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col gap-3 rounded-[1.375rem] bg-surface p-4">
          <Input
            label="Home time zone"
            defaultValue="America/Chicago"
            icon={<Globe strokeWidth={2} />}
          />
          <Input label="Typical start" defaultValue="09:00" description="Local time, 24-hour" />
        </div>
      </Card.Body>
      <Card.Footer>
        <span className={mutedText(cardBodyTextClasses)}>Saved to this workspace</span>
        <Button role="primary" size="sm">
          Update
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const RoundedStandalone: Story = {
  name: "Pattern — simple (rounded)",
  args: {
    shape: "rounded",
    variant: "surface",
    padding: "md",
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <h2 className={cardTitleClasses}>Simple card</h2>
      <p className={mutedText(cardBodyTextClasses)}>
        Flat padded surface — use when you do not need header/body/footer regions.
      </p>
    </Card>
  ),
};
