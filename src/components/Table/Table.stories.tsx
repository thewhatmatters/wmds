import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Share2, Trash2 } from "lucide-react";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { MoreMenu } from "../MoreMenu/MoreMenu";
import { Table } from "./Table";

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    variant: "surface",
    density: "default",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Token-driven data table with compound slots. " +
          "Set **`sticky=\"start\"`** or **`sticky=\"end\"`** on matching **`Table.Head`** and **`Table.Cell`** pairs to freeze columns while scrolling — supports multiple frozen columns on each side. " +
          "Horizontal overflow shows edge shadows on sticky columns (or scroller inset when no sticky cols) — `--color-fg` mix works in light and dark. " +
          "Offsets are measured from the header row and update on resize. " +
          "For animated filter rows, pass **`visible`** + **`colSpan`** on **`Table.Row`** (see **`Examples / Filter table`**) — header stays static while rows collapse via **`.motion-collapse`**. " +
          "**Cell content** is compositional — pass text, **`Badge`** (status labels), **`Button`** / **`MoreMenu`** (actions), or any React node inside **`Table.Cell`**. Use **`Chip`** for filter bars above the table, not inside cells. " +
          "For truncation, put **`max-w-* truncate`** on an inner **`span`**, not on **`Table.Cell`** — width constraints on `<td>` leave gaps where row hover bleeds through.",
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const tasks = [
  { task: "Restock mango sorbet", date: "Dec 03", status: "todo" as const, owner: "Mango Moon Gelato" },
  { task: "Churn black sesame", date: "Sep 22", status: "progress" as const, owner: "Kumo Creamery" },
  { task: "Print summer menu", date: "Jan 02", status: "todo" as const, owner: "Coral Coast Sorbet" },
  { task: "Taste-test batch 42", date: "Nov 08", status: "progress" as const, owner: "Maple Orbit" },
  { task: "Order waffle cones", date: "Apr 14", status: "done" as const, owner: "Aurora Scoops" },
];

const statusBadge: Record<
  (typeof tasks)[number]["status"],
  { label: string; variant: "warning" | "info" | "success" }
> = {
  todo: { label: "To do", variant: "warning" },
  progress: { label: "In Progress", variant: "info" },
  done: { label: "Completed", variant: "success" },
};

export const Playground: Story = {
  render: () => (
    <Table aria-label="Task list" className="max-w-lg">
      <Table.Header>
        <Table.Row>
          <Table.Head>Task name</Table.Head>
          <Table.Head>Date</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Advisor</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tasks.map((row) => {
          const pill = statusBadge[row.status];
          return (
            <Table.Row key={row.task}>
              <Table.Cell className="font-medium">
                <span className="block max-w-[12rem] truncate">{row.task}</span>
              </Table.Cell>
              <Table.Cell numeric className="text-muted">
                {row.date}
              </Table.Cell>
              <Table.Cell>
                <Badge variant={pill.variant}>{pill.label}</Badge>
              </Table.Cell>
              <Table.Cell className="text-muted">
                <span className="block max-w-[9rem] truncate">{row.owner}</span>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  ),
};

export const CellContent: Story = {
  name: "Cell content types",
  parameters: {
    docs: {
      description: {
        story:
          "**Badge** for read-only status or category labels in cells. **Chip** is for interactive filters *above* the table (`Chip.Group`) — not row data. " +
          "Use **`numeric`** on **`Table.Head`** / **`Table.Cell`** for tabular figures; actions compose **`Button`**, **`MoreMenu`**, etc.",
      },
    },
  },
  render: () => (
    <Table aria-label="Cell content examples" className="max-w-2xl">
      <Table.Header>
        <Table.Row>
          <Table.Head>Task</Table.Head>
          <Table.Head align="end" numeric>
            Qty
          </Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Vendor</Table.Head>
          <Table.Head sticky="end" align="center" minWidth={52}>
            <span className="sr-only">Actions</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tasks.slice(0, 3).map((row) => {
          const pill = statusBadge[row.status];
          const initials = row.owner
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2);

          return (
            <Table.Row key={row.task}>
              <Table.Cell className="font-medium">
                <span className="block max-w-[12rem] truncate">{row.task}</span>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {120}
              </Table.Cell>
              <Table.Cell>
                <Badge variant={pill.variant}>{pill.label}</Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  variant="neutral"
                  startSlot={
                    <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-muted">
                      {initials}
                    </span>
                  }
                >
                  {row.owner}
                </Badge>
              </Table.Cell>
              <Table.Cell sticky="end" align="center">
                <MoreMenu
                  label={`Actions for ${row.task}`}
                  size="xs"
                  items={[{ label: "Open task", icon: <Pencil strokeWidth={2} /> }]}
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  ),
};

export const StickyStartAndEnd: Story = {
  name: "Sticky start + end",
  parameters: {
    docs: {
      description: {
        story:
          "Wide table in a narrow container — first column (task name) and last column (actions) stay pinned. " +
          "Apply the same `sticky` value on **`Table.Head`** and every **`Table.Cell`** in that column.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Table aria-label="Task list with frozen columns">
        <Table.Header>
          <Table.Row>
            <Table.Head sticky="start" minWidth={160}>
              Task name
            </Table.Head>
            <Table.Head minWidth={72}>Date</Table.Head>
            <Table.Head minWidth={120}>Status</Table.Head>
            <Table.Head minWidth={140}>Advisor</Table.Head>
            <Table.Head minWidth={100} align="end" numeric>
              Est. cost
            </Table.Head>
            <Table.Head minWidth={100} align="end" numeric>
              Margin
            </Table.Head>
            <Table.Head sticky="end" minWidth={96} align="end">
              Actions
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tasks.map((row, index) => {
            const pill = statusBadge[row.status];
            return (
              <Table.Row key={row.task}>
                <Table.Cell sticky="start" className="font-medium">
                  <span className="block max-w-[10rem] truncate">{row.task}</span>
                </Table.Cell>
                <Table.Cell numeric className="text-muted">
                  {row.date}
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={pill.variant}>{pill.label}</Badge>
                </Table.Cell>
                <Table.Cell className="text-muted">
                  <span className="block max-w-[8rem] truncate">{row.owner}</span>
                </Table.Cell>
                <Table.Cell align="end" numeric className="text-muted">
                  ${(420 + index * 37).toLocaleString()}
                </Table.Cell>
                <Table.Cell align="end" numeric className="text-muted">
                  {(12 + index * 2.4).toFixed(1)}%
                </Table.Cell>
                <Table.Cell sticky="end" align="end">
                  <Button size="xs" variant="ghost">
                    Open
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  ),
};

const positions = [
  { symbol: "AAPL", name: "Apple Inc.", qty: 120, avg: 182.4, mark: 191.02, pl: 1034.4 },
  { symbol: "MSFT", name: "Microsoft", qty: 80, avg: 402.1, mark: 415.33, pl: 1058.4 },
  { symbol: "NVDA", name: "NVIDIA", qty: 45, avg: 118.2, mark: 124.8, pl: 297.0 },
  { symbol: "TSLA", name: "Tesla", qty: 60, avg: 248.5, mark: 241.2, pl: -438.0 },
  { symbol: "COIN", name: "Coinbase", qty: 35, avg: 215.0, mark: 228.4, pl: 469.0 },
];

export const StickyMultipleStart: Story = {
  name: "Sticky multiple start columns",
  parameters: {
    docs: {
      description: {
        story:
          "Trading-style layout — freeze symbol and name, scroll greeks/prices in the middle, freeze a compact actions column on the right. " +
          "Row actions use **`MoreMenu`** (`xs` + `ghost` kebab).",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl rounded-lg bg-bg p-4">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Table aria-label="Positions blotter" variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.Head sticky="start" minWidth={72}>
            Symbol
          </Table.Head>
          <Table.Head sticky="start" minWidth={128}>
            Name
          </Table.Head>
          <Table.Head align="end" minWidth={64} numeric>
            Qty
          </Table.Head>
          <Table.Head align="end" minWidth={88} numeric>
            Avg
          </Table.Head>
          <Table.Head align="end" minWidth={88} numeric>
            Mark
          </Table.Head>
          <Table.Head align="end" minWidth={96} numeric>
            P&amp;L
          </Table.Head>
          <Table.Head align="end" minWidth={88} numeric>
            Delta
          </Table.Head>
          <Table.Head align="end" minWidth={88} numeric>
            Gamma
          </Table.Head>
          <Table.Head sticky="end" minWidth={52} align="center">
            <span className="sr-only">Actions</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {positions.map((row) => (
          <Table.Row key={row.symbol}>
            <Table.Cell sticky="start" className="font-medium">
              {row.symbol}
            </Table.Cell>
            <Table.Cell sticky="start" className="text-muted">
              <span className="block min-w-0 truncate">{row.name}</span>
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {row.qty}
            </Table.Cell>
            <Table.Cell align="end" numeric className="text-muted">
              {row.avg.toFixed(2)}
            </Table.Cell>
            <Table.Cell align="end" numeric className="text-muted">
              {row.mark.toFixed(2)}
            </Table.Cell>
            <Table.Cell
              align="end"
              numeric
              className={row.pl >= 0 ? "text-success" : "text-destructive"}
            >
              {row.pl >= 0 ? "+" : ""}
              {row.pl.toFixed(2)}
            </Table.Cell>
            <Table.Cell align="end" numeric className="text-muted">
              0.42
            </Table.Cell>
            <Table.Cell align="end" numeric className="text-muted">
              0.08
            </Table.Cell>
            <Table.Cell sticky="end" align="center">
              <MoreMenu
                label={`Actions for ${row.symbol}`}
                size="xs"
                alignment="end"
                items={[
                  { label: "Edit row", icon: <Pencil strokeWidth={2} /> },
                  { label: "Share", icon: <Share2 strokeWidth={2} /> },
                  { type: "divider" },
                  { label: "Close position", icon: <Trash2 strokeWidth={2} />, variant: "destructive" },
                ]}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

export const Density: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-6">
      <Table aria-label="Default density" density="default">
        <Table.Header>
          <Table.Row>
            <Table.Head>Column</Table.Head>
            <Table.Head align="end" numeric>
              Value
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Default density</Table.Cell>
            <Table.Cell align="end" numeric>
              1.00
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Table aria-label="Compact density" density="compact">
        <Table.Header>
          <Table.Row>
            <Table.Head>Column</Table.Head>
            <Table.Head align="end" numeric>
              Value
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Compact density</Table.Cell>
            <Table.Cell align="end" numeric>
              1.00
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  ),
};
