import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { Card, cardBodyTextClasses, cardTitleClasses } from "../Card/Card";
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
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Expandable **rows** — leading icon or status badge, label, meta, chevron, nested detail. Use standalone or inside **Card.Body** when the shell needs header/footer.

| Pattern | Composition |
|---------|-------------|
| **Status rows** | \`variant="list"\` + \`status="done" \| "running" \| …\` |
| **Capsules** | \`variant="capsule"\` — separated rounded rows (with or without **Card**) |
| **Action details** | \`detailsLayout="actions"\` + \`TaskRows.Detail variant="button"\` |
| **Tag chips** | \`detailsLayout="chips"\` + read-only **Chip** children |
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

- **Do** use \`variant="list"\` for agent / progress flows with \`status\`.
- **Do** use \`variant="capsule"\` for separated expandable rows — standalone or in **Card.Body**.
- **Do** use \`icon\` + \`status="none"\` for expand-only rows without task status UI.
- **Do** use read-only **Chip** inside \`detailsLayout="chips"\` for tags and attributes.
- **Do** use \`TaskRows.Detail\` with \`onPress\` for external actions — labels stay on one line (do not wrap).
- **Don't** use \`status="done"\` when the row is not a task/progress flow.
- **Don't** use for browse lists.
- **Don't** pair \`border\` with \`shadow-raised\` — the shadow token already includes a 1px hairline ring (\`theme.css\`).
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof TaskRows>;

export default meta;
type Story = StoryObj<typeof meta>;

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
        <TaskRows.Item label="Sync opening hours" meta="1 source" status="failed">
          <TaskRows.Detail label="External API timeout" meta="retry" />
        </TaskRows.Item>
      </TaskRows>
    </div>
  ),
};

export const CardWithStatusRows: Story = {
  name: "Pattern — card + status rows",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "Optional **Card** wrapper — **TaskRows variant=\"list\"** in **Card.Body** for agent / progress flows.",
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
          <TaskRows.Item label="Sync opening hours" meta="1 source" status="failed">
            <TaskRows.Detail label="External API timeout" meta="retry" />
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
  parameters: {
    docs: {
      description: {
        story:
          "Separated pill rows — **22px** radius when collapsed, **14px** when expanded (`open ? 14 : 22`). Second row starts open.",
      },
    },
  },
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
