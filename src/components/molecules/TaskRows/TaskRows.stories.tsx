import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Dog, MapPin, Tags, X } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Card, cardAddressClasses, cardBodyTextClasses, cardSubtitleClasses, cardTitleClasses } from "../Card/Card";
import { Chip } from "../Chip/Chip";
import { TaskRows } from "./TaskRows";

const meta = {
  title: "Molecules/TaskRows",
  component: TaskRows,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["list", "capsule"] },
    children: { control: false },
    labels: { control: false },
  },
  args: {
    variant: "list",
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## Usage

Expandable **rows** inside cards — leading icon or status badge, label, meta, chevron, nested detail. **FM market detail** uses expand-only rows (\`status="none"\`, optional \`icon\`) — not task progress UI.

| Pattern | Composition |
|---------|-------------|
| **FM market detail** | **Card** \`shape="rounded"\` + \`TaskRows variant="capsule"\` + \`icon\` |
| **FM directions** | \`Detail variant="button" label="Apple Maps"\` — standard **Button** \`secondary\`; one line, no wrap |
| **FM services** | \`icon={<Tags />}\` + \`detailsLayout="chips"\` + read-only **Chip** children |
| **Progress list** | \`variant="list"\` + \`inset\` inside **Card.Body** — \`status="done" \| "running" \| …\` |
| **Controlled expand** | \`open\` + \`onOpenChange\` on \`TaskRows.Item\` |

## Anatomy

\`\`\`
TaskRows
└── TaskRows.Item (button when details present)
    ├── icon? · status badge? (mutually exclusive)
    ├── label
    ├── meta?
    ├── status pill? (task flows only)
    ├── chevron?
    └── details — buttons, chips, or label / meta lines
\`\`\`

## Best practices

- **Do** use **Card** + \`TaskRows variant="capsule"\` — pill rows inside the inset body well.
- **Do** put hours, address, and meta copy in **Card.Header** — not inside the Body slot (occupants own inner chrome).
- **Do** use \`icon\` + \`status="none"\` for FM expandable rows — directions, services, hours.
- **Do** use read-only **Chip** inside \`detailsLayout="chips"\` for SNAP, dogs, etc.
- **Do** use \`TaskRows.Detail\` with \`onPress\` for FM Apple Maps / Google Maps deep links — labels stay on one line (do not wrap).
- **Don't** use \`status="done"\` on FM rows — that's for agent task progress, not market detail.
- **Don't** swap the whole card body for one action — expand in place instead.
- **Don't** use for browse lists — **List** remains the market picker in **ContentRail**.
- **Don't** pair \`border\` with \`shadow-raised\` — the shadow token already includes a 1px hairline ring (\`theme.css\`).
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof TaskRows>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FarmerMarketDetail: Story = {
  name: "Pattern — FM market detail",
  render: function FarmerMarketDetailDemo() {
    const [directionsOpen, setDirectionsOpen] = useState(true);
    const [servicesOpen, setServicesOpen] = useState(false);

    return (
      <div className="w-max bg-body p-4">
        <Card shape="rounded" padding="none">
          <Card.Header
            start={
              <>
                <h2 className={cardTitleClasses}>Texas Farmers&apos; Market at Mueller</h2>
                <div className={cardAddressClasses}>
                  <span>2006 Philomena St.</span>
                  <span>Austin, TX 78723</span>
                </div>
              </>
            }
            end={
              <IconButton
                icon={<X strokeWidth={2} />}
                aria-label="Close market detail"
                title="Close market detail"
                role="secondary"
                size="sm"
              />
            }
          />
          <Card.Body>
            <TaskRows variant="capsule">
              <TaskRows.Item
                icon={<MapPin strokeWidth={2} />}
                label="Get directions"
                meta="0.1 mi"
                detailsLayout="actions"
                detailsLabel="Open in"
                open={directionsOpen}
                onOpenChange={setDirectionsOpen}
              >
                <TaskRows.Detail
                  variant="button"
                  label="Apple Maps"
                  onPress={() => window.alert("Open Apple Maps")}
                />
                <TaskRows.Detail
                  variant="button"
                  label="Google Maps"
                  onPress={() => window.alert("Open Google Maps")}
                />
              </TaskRows.Item>
              <TaskRows.Item
                icon={<Tags strokeWidth={2} />}
                label="Services offered"
                meta="3"
                detailsLayout="chips"
                open={servicesOpen}
                onOpenChange={setServicesOpen}
              >
                <Chip readOnly size="sm">
                  SNAP / EBT
                </Chip>
                <Chip readOnly size="sm" icon={<Dog strokeWidth={2} />}>
                  Dogs welcome
                </Chip>
                <Chip readOnly size="sm">
                  Open today
                </Chip>
              </TaskRows.Item>
            </TaskRows>
          </Card.Body>
        </Card>
      </div>
    );
  },
};

export const StatusList: Story = {
  name: "Pattern — status rows",
  render: () => (
    <div className="max-w-md p-4">
      <TaskRows variant="list">
        <TaskRows.Item
          label="Verified vendor records"
          meta="12 suppliers"
          status="done"
          defaultOpen
        >
          <TaskRows.Detail label="Matched tax and contact IDs" meta="12/12" />
          <TaskRows.Detail label="Flagged stale records" meta="0" />
        </TaskRows.Item>
        <TaskRows.Item label="Build reorder task list" meta="7 SKUs" status="running" step={2} defaultOpen>
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
    </div>
  ),
};

export const CardWithStatusRows: Story = {
  name: "Pattern — card + status rows",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Layout **Card** (white shell, gray inset well) with **TaskRows variant=\"list\"** — agent / progress flows with done, running, pending, failed.",
      },
    },
  },
  render: () => (
    <Card padding="none" className="max-w-md">
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
        <span className={cardBodyTextClasses + " text-muted"}>2 complete · 1 running</span>
        <Button role="primary" size="sm">
          Continue
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const Capsules: Story = {
  name: "Pattern — capsules",
  args: {
    variant: "capsule",
  },
  render: (args) => (
    <div className="max-w-md bg-body p-4">
      <TaskRows {...args}>
        <TaskRows.Item label="Export vendor CSV" meta="12 rows" status="done">
          <TaskRows.Detail label="Generated file" meta="vendors.csv" />
        </TaskRows.Item>
        <TaskRows.Item label="Refresh POS data" meta="3 files" status="running" step={2} defaultOpen>
          <TaskRows.Detail label="Reading export" meta="2/3" />
        </TaskRows.Item>
      </TaskRows>
    </div>
  ),
};

export const WithPrimaryAction: Story = {
  name: "Example — card + rows + footer",
  parameters: {
    docs: {
      description: {
        story:
          "Hours and address live in **Card.Header** (shell padding). **TaskRows** occupies the **Card.Body** slot — one of several valid occupants.",
      },
    },
  },
  render: function CardComposeDemo() {
    const [directionsOpen, setDirectionsOpen] = useState(false);

    return (
      <div className="w-max p-4">
        <Card shape="rounded" padding="none">
          <Card.Header
            start={
              <>
                <h2 className={cardTitleClasses}>SFC Farmers&apos; Market Downtown</h2>
                <p className={cardSubtitleClasses}>422 Guadalupe St</p>
                <p className={`${cardBodyTextClasses} text-muted`}>Saturdays · 9am – 1pm</p>
              </>
            }
            end={
              <IconButton
                icon={<X strokeWidth={2} />}
                aria-label="Close market detail"
                title="Close market detail"
                role="secondary"
                size="sm"
              />
            }
          />
          <Card.Body>
            <TaskRows variant="capsule">
              <TaskRows.Item
                label="Get directions"
                meta="2.4 mi"
                detailsLayout="actions"
                detailsLabel="Open in"
                open={directionsOpen}
                onOpenChange={setDirectionsOpen}
              >
                <TaskRows.Detail variant="button" label="Apple Maps" onPress={() => undefined} />
                <TaskRows.Detail variant="button" label="Google Maps" onPress={() => undefined} />
              </TaskRows.Item>
            </TaskRows>
          </Card.Body>
          <Card.Footer>
            <Button
              role="primary"
              size="sm"
              className="w-full"
              icon={<MapPin strokeWidth={2} />}
            >
              View market
            </Button>
          </Card.Footer>
        </Card>
      </div>
    );
  },
};
