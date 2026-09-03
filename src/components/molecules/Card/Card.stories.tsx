import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clock, EllipsisVertical, Globe } from "lucide-react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Input } from "../../atoms/Input/Input";
import { Chip, ChipFilterGroup } from "../Chip/Chip";
import { List } from "../List/List";
import { TaskRows } from "../TaskRows/TaskRows";
import {
  Card,
  cardBodyTextClasses,
  cardPaddings,
  cardShapes,
  cardSubtitleClasses,
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
    layout: "padded",
    docs: {
      description: {
        component: `
## Usage

[Astryx Card](https://astryx.atmeta.com/components/Card) — **Header** and **Footer** sit on the shell; **Body** is a square **slot** 2px from the card edges. No default fill, radius, or inner pad — content inherits the shell and owns its own chrome.

| Pattern | Composition |
|---------|-------------|
| **Layout** | \`Card padding="none"\` + \`Card.Header\` / \`Card.Body\` / \`Card.Footer\` — default; shell + Body slot (inherits fill) |
| **Header** | Horizontal \`start\` / \`end\` slots — title + subtitle, kebab, chips-as-tabs, Badge, or any cluster |
| **Body slot** | Status rows, List, form, or custom UI — occupant owns chrome |
| **Simple** | \`Card padding="md"\` — flat padded block (no sections) |

Default \`shape="rounded"\` — \`rounded-2xl shadow-md\` on the shell. Use \`shape="flush"\` only when a parent owns outer radius and shadow.

## Anatomy

\`\`\`
Card (bg-surface shell, p-4, gap-3)
├── Card.Header   — start | end slots — 16px inset
├── Card.Body     — slot — 2px outside, square, no fill (inherits shell)
└── Card.Footer   — status, actions (on shell, 16px inset)
\`\`\`

## Best practices

- **Do** set \`padding="none"\` when using Header/Body/Footer.
- **Do** put leading copy in \`start\` and trailing actions in \`end\` — do not hand-roll the header row.
- **Do** treat \`Card.Body\` as a slot — TaskRows, List, Inputs, or custom UI all belong there.
- **Do** keep title, address, and meta in **Header**; primary actions in **Footer**.
- **Do** use default \`shape="rounded"\` — FM market detail, dashboard widgets, map overlays.
- **Do** use \`shape="flush"\` only when nested inside a parent that already owns radius and shadow.
- **Don't** restrict the Body to TaskRows — that is one occupant, not the contract.
- **Don't** put a muted fill on \`Card.Body\` — the slot inherits the shell.
- **Don't** re-theme the slot with \`className\` — put layout tweaks on the root only.
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
          "Default layout card — header/footer on the shell. **Body** is 2px from the card edges, square, no fill — content inherits the shell.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Meeting Finder</h2>}
        end={<Badge size="sm">11:00 UTC</Badge>}
      />
      <Card.Body>
        <div className="flex min-h-32 items-center justify-center px-4 py-6">
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

export const HeaderSlots: Story = {
  name: "Pattern — header slots",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "**Header** is two horizontal slots. `start` and `end` take any cluster — title + subtitle, chips-as-tabs, kebab `IconButton`, Badge.",
      },
    },
  },
  render: function HeaderSlotsDemo() {
    const [view, setView] = useState("overview");

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header
          start={
            <>
              <h2 className={cardTitleClasses}>Texas Farmers&apos; Market at Mueller</h2>
              <p className={cardSubtitleClasses}>2006 Philomena St. · Austin, TX</p>
            </>
          }
          end={
            <>
              <ChipFilterGroup
                aria-label="Market detail view"
                selectionMode="single"
                value={view}
                onValueChange={setView}
              >
                <Chip value="overview" size="sm">
                  Overview
                </Chip>
                <Chip value="hours" size="sm">
                  Hours
                </Chip>
              </ChipFilterGroup>
              <IconButton
                icon={<EllipsisVertical strokeWidth={2} />}
                aria-label="More market actions"
                title="More"
                role="ghost"
                size="sm"
              />
            </>
          }
        />
        <Card.Body>
          <div className="flex min-h-32 items-center justify-center px-4 py-6">
            <p className={mutedText(cardBodyTextClasses)}>
              {view === "overview"
                ? "Overview — directions, services, and hours"
                : "Hours — Saturday 9am – 1pm"}
            </p>
          </div>
        </Card.Body>
      </Card>
    );
  },
};

export const BodySlotList: Story = {
  name: "Pattern — body slot (List)",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "**List** in the Body slot — inherits the shell. List owns row chrome.",
      },
    },
  },
  render: function BodySlotListDemo() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header
          start={
            <>
              <h2 className={cardTitleClasses}>Nearby markets</h2>
              <p className={cardSubtitleClasses}>Saturday · within 5 mi</p>
            </>
          }
        />
        <Card.Body>
          <List variant="surface" hasDividers className="overflow-hidden rounded-[1.375rem]">
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
          "Form controls in the Body slot — inherit the shell; the footer keeps the action.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={
          <>
            <h2 className={cardTitleClasses}>Working hours</h2>
            <p className={cardSubtitleClasses}>Used to score overlapping time zones</p>
          </>
        }
      />
      <Card.Body>
        <div className="flex flex-col gap-3 p-4">
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

export const BodySlotStatusRows: Story = {
  name: "Example — body slot (status rows)",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "**TaskRows variant=\"list\"** in the Body slot — inherits the shell. No muted well. Status rows own their chrome.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Restock run</h2>}
        end={
          <span className={cardBodyTextClasses + " text-muted tabular-nums"}>Step 2 of 4</span>
        }
      />
      <Card.Body>
        <TaskRows variant="list" inset>
          <TaskRows.Item
            label="Verified vendor records"
            meta="12 suppliers"
            status="done"
            defaultOpen
          >
            <TaskRows.Detail label="Matched tax and contact IDs" meta="12/12" />
            <TaskRows.Detail label="Flagged stale records" meta="0" />
          </TaskRows.Item>
          <TaskRows.Item
            label="Build reorder task list"
            meta="7 SKUs"
            status="running"
            step={2}
            defaultOpen
          >
            <TaskRows.Detail label="Reading POS export" meta="3 files" />
            <TaskRows.Detail label="Scoring stockout risk" meta="68%" />
          </TaskRows.Item>
          <TaskRows.Item label="Draft supplier emails" meta="2 messages" status="pending" step={3}>
            <TaskRows.Detail label="Cone supplier follow-up" meta="draft" />
            <TaskRows.Detail label="Pistachio reorder note" meta="draft" />
          </TaskRows.Item>
          <TaskRows.Item label="Sync market hours" meta="1 source" status="failed">
            <TaskRows.Detail label="USDA API timeout" meta="retry" />
          </TaskRows.Item>
        </TaskRows>
      </Card.Body>
      <Card.Footer>
        <span className={mutedText(cardBodyTextClasses)}>2 complete · 1 running</span>
        <Button role="primary" size="sm">
          Continue
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
