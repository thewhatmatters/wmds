import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Apple, MapPin, Map as MapIcon } from "lucide-react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { Status } from "../../atoms/Status/Status";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { Chip } from "../Chip/Chip";
import { Card, cardBodyTextClasses, cardTitleClasses } from "../Card/Card";
import { TaskRows } from "./TaskRows";

const specLabelClasses = cn(typographyClass("ui-label"), "text-[0.8125rem] font-medium text-fg");
const specMetaClasses = cn(typographyClass("caption"), "text-muted");
const specCodeClasses = "font-mono text-[0.6875rem] text-fg";

function AnatomySpecTable({
  title,
  rows,
}: {
  title: string;
  rows: { slot: string; source: string; notes: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-4 py-2.5">
        <h3 className={specLabelClasses}>{title}</h3>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-secondary/40">
            <th className={cn(specMetaClasses, "px-4 py-2 font-medium")}>Slot</th>
            <th className={cn(specMetaClasses, "px-4 py-2 font-medium")}>Prop / atom</th>
            <th className={cn(specMetaClasses, "px-4 py-2 font-medium")}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.slot} className="border-b border-border last:border-b-0">
              <td className={cn(specLabelClasses, "px-4 py-2.5 align-top")}>{row.slot}</td>
              <td className={cn(specCodeClasses, "px-4 py-2.5 align-top")}>{row.source}</td>
              <td className={cn(specMetaClasses, "px-4 py-2.5 align-top")}>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

Expandable **task / action rows** — composes **Accordion** for disclosure, then adds status UI, meta, detail rails, and list vs capsule chrome. Use inside cards and panels when a single button per row is not enough.

| Pattern | Composition |
|---------|-------------|
| **Status rows** | \`variant="list"\` + \`status="done" \| "running" \| …\` |
| **Capsules** | \`variant="capsule"\` — separated rounded rows (with or without **Card**) |
| **Action details** | \`detailsLayout="actions"\` + \`TaskRows.Detail variant="button"\` ( **Button** \`size="xs"\`) |
| **Tag chips** | \`detailsLayout="chips"\` + read-only **Chip** \`size="sm"\` |
| **Controlled expand** | \`open\` + \`onOpenChange\` on \`TaskRows.Item\` |

See **Anatomy** for a live specimen and slot reference tables.

## Anatomy

\`\`\`
TaskRows
└── Accordion.Item (disclosure shell)
    ├── leading? · status / icon? (TaskRows defaults)
    ├── label
    ├── trailing cluster?
    ├── chevron (Accordion — when details present)
    └── details — TaskRows.Detail · Button row · Chip row
\`\`\`

## Best practices

- **Do** use \`leading\` for any leading column content — replaces default **Badge** / **Status** / \`icon\`.
- **Do** use \`trailing\` for any trailing cluster content — not limited to meta or status pills.
- **Do** omit \`trailing\` and use \`meta\` (+ \`status\`) when the default agent-row layout is enough.
- **Do** use \`variant="list"\` for agent / progress flows with \`status\`.
- **Do** use \`variant="capsule"\` for separated expandable rows — standalone or in **Card.Body**.
- **Do** use \`icon\` + \`status="none"\` for expand-only rows without task status UI.
- **Do** use read-only **Chip** \`size="sm"\` inside \`detailsLayout="chips"\` — tags sit below \`ui-label\` row titles, not beside them.
- **Do** use \`TaskRows.Detail\` with \`onPress\` for external actions — labels stay on one line (do not wrap).
- **Don't** rely on cursor alone for expandable rows — the trigger band uses \`hover:bg-ghost-hover\`.
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

export const Anatomy: Story = {
  name: "Anatomy",
  parameters: {
    docs: {
      description: {
        story:
          "Live **TaskRows** specimen plus slot tables — no wireframe overlays. Compare the four **leading** rows in the second list: outcome marks (✓/×) are **not** the **`icon` prop**.",
      },
    },
  },
  render: () => (
    <div className="max-w-lg space-y-8 font-sans text-fg">
      <section className="space-y-3">
        <p className={specMetaClasses}>
          Expanded row — every trigger slot populated. Details panel opens below the trigger.
        </p>
        <TaskRows variant="list">
          <TaskRows.Item
            label="Verified vendor records"
            meta="12 suppliers"
            status="done"
            defaultOpen
            detailsLabel="Breakdown"
          >
            <TaskRows.Detail label="Matched tax and contact IDs" meta="12/12" />
            <TaskRows.Detail label="Flagged stale records" meta="0" />
          </TaskRows.Item>
        </TaskRows>
        <AnatomySpecTable
          title="Trigger row — left to right"
          rows={[
            { slot: "Leading", source: "leading? · status · icon", notes: "leading replaces defaults — see leading table below" },
            { slot: "Label", source: "label", notes: "Primary row title — flex-1, truncates" },
            {
              slot: "Trailing cluster",
              source: "trailing?",
              notes:
                "Any ReactNode — Badge, meta text, actions, custom layout. When omitted, TaskRows composes meta + muted Badge for done/failed",
            },
            { slot: "Chevron", source: "(built-in)", notes: "Outside the cluster — when children present" },
          ]}
        />
        <AnatomySpecTable
          title="Details panel — expanded"
          rows={[
            { slot: "Details label", source: "detailsLabel?", notes: "Optional lead-in above detail content" },
            { slot: "Children", source: "children", notes: "TaskRows.Detail · Button row · read-only Chip row" },
          ]}
        />
      </section>

      <section className="space-y-3">
        <p className={specMetaClasses}>
          Leading column only — four real rows. Rows 1–2 are <strong>outcome marks</strong> (status done/failed). Row 4
          is the <strong>icon prop</strong> (plain Lucide, no filled circle).
        </p>
        <TaskRows variant="list">
          <TaskRows.Item label="Verified vendor records" meta="12 suppliers" status="done" />
          <TaskRows.Item label="Sync opening hours" meta="1 source" status="failed" />
          <TaskRows.Item label="Build reorder task list" meta="7 SKUs" status="running" step={2} />
          <TaskRows.Item
            label="Get directions"
            meta="0.4 mi"
            icon={<MapPin strokeWidth={2} />}
          />
        </TaskRows>
        <AnatomySpecTable
          title="Leading slot variants"
          rows={[
            {
              slot: "Outcome mark",
              source: 'status="done" | "failed"',
              notes: "Badge iconOnly — solid circle + ✓ or ×",
            },
            {
              slot: "Progress ring",
              source: 'status="running" | "pending" + step?',
              notes: "Status variant=ring",
            },
            {
              slot: "Row icon",
              source: "icon + status=none",
              notes: "ButtonIcon — directions / services rows",
            },
          ]}
        />
      </section>
    </div>
  ),
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

export const ActionDetails: Story = {
  name: "Pattern — action details",
  parameters: {
    docs: {
      description: {
        story:
          "Expand-only service row — **TaskRows.Detail variant=\"button\"** composes **Button** `size=\"xs\"` for map / external app choices.",
      },
    },
  },
  render: () => (
    <div className="max-w-md p-4">
      <TaskRows variant="list">
        <TaskRows.Item
          label="Cone supplier"
          meta="0.4 mi"
          icon={<MapPin strokeWidth={2} />}
          defaultOpen
          detailsLabel="Open in"
          detailsLayout="actions"
        >
          <TaskRows.Detail
            variant="button"
            label="Apple Maps"
            icon={<Apple strokeWidth={2} />}
            onPress={() => undefined}
          />
          <TaskRows.Detail
            variant="button"
            label="Google Maps"
            icon={<MapIcon strokeWidth={2} />}
            onPress={() => undefined}
          />
        </TaskRows.Item>
      </TaskRows>
    </div>
  ),
};

export const TagChips: Story = {
  name: "Pattern — tag chips",
  parameters: {
    docs: {
      description: {
        story: "Read-only **Chip** `size=\"sm\"` in `detailsLayout=\"chips\"` — tags and attributes, not filters.",
      },
    },
  },
  render: () => (
    <div className="max-w-md p-4">
      <TaskRows variant="list">
        <TaskRows.Item label="Weekend market booth" meta="Sat–Sun" defaultOpen detailsLayout="chips">
          <Chip readOnly size="sm">
            Outdoor
          </Chip>
          <Chip readOnly size="sm">
            Produce
          </Chip>
          <Chip readOnly size="sm">
            Card accepted
          </Chip>
        </TaskRows.Item>
      </TaskRows>
    </div>
  ),
};

export const CustomSlots: Story = {
  name: "Pattern — custom leading / trailing",
  parameters: {
    docs: {
      description: {
        story: "`leading` and `trailing` replace default atom composition — any ReactNode.",
      },
    },
  },
  render: () => (
    <div className="max-w-md p-4">
      <TaskRows variant="list">
        <TaskRows.Item
          label="Live inventory sync"
          leading={<Status variant="dot" tone="success" pulsing besideLabel label="Syncing" />}
          trailing={
            <Badge variant="info" emphasis="muted">
              In progress
            </Badge>
          }
          defaultOpen
        >
          <TaskRows.Detail label="POS webhook" meta="connected" />
          <TaskRows.Detail label="Last push" meta="2s ago" />
        </TaskRows.Item>
      </TaskRows>
    </div>
  ),
};

function ControlledExpandDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-md space-y-3 p-4">
      <TaskRows variant="list">
        <TaskRows.Item
          label="Reorder recommendations"
          meta="7 SKUs"
          status="running"
          step={2}
          open={open}
          onOpenChange={setOpen}
        >
          <TaskRows.Detail label="Reading POS export" meta="3 files" />
          <TaskRows.Detail label="Scoring stockout risk" meta="68%" />
        </TaskRows.Item>
      </TaskRows>
      <Button role="secondary" size="sm" onClick={() => setOpen((value) => !value)}>
        {open ? "Collapse row" : "Expand row"}
      </Button>
    </div>
  );
}

export const ControlledExpand: Story = {
  name: "Pattern — controlled expand",
  parameters: {
    docs: {
      description: {
        story: "Drive expand state from the app — `open` + `onOpenChange` on **TaskRows.Item**.",
      },
    },
  },
  render: () => <ControlledExpandDemo />,
};
