"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid, LayoutList, Rows3 } from "lucide-react";
import { expect } from "storybook/test";
import { useState } from "react";
import { Badge } from "../Badge/Badge";
import { StatusDot } from "../StatusDot/StatusDot";
import { Table } from "../Table/Table";
import { Tab } from "./Tab";

const meta = {
  title: "Components/Tab",
  tags: ["autodocs", "ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Segmented tab control from Paper **Tab group** — shared pill **`Tab.Group`** track with raised **`Tab`** segments. " +
          "The active segment uses a raised surface pill; hover previews with a softer secondary-hover pill that slides under the same motion tokens. " +
          "Use for view switching (Steps / Reasoning / …). For filter toggles above tables, prefer **`Chip.Group`** — same density, no shared track, `aria-pressed` semantics.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState("steps");
    return (
      <Tab.Group aria-label="Agent views" value={value} onValueChange={setValue}>
        <Tab value="steps">Steps</Tab>
        <Tab value="reasoning">Reasoning</Tab>
        <Tab value="search">Search</Tab>
        <Tab value="coding">Coding</Tab>
      </Tab.Group>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const reasoning = canvas.getByRole("tab", { name: /reasoning/i });
    await expect(reasoning).toHaveAttribute("aria-selected", "false");
    await userEvent.click(reasoning);
    await expect(reasoning).toHaveAttribute("aria-selected", "true");
  },
};

export const LayoutSwitcher: Story = {
  name: "Layout switcher (icon-only)",
  parameters: {
    docs: {
      description: {
        story:
          "Icon-only **view switcher** — same `Tab.Group` track and sliding indicator as labeled tabs. " +
          "Use `layout=\"equal\"` for fixed segment widths (list / stack / grid layouts).",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("list");
    return (
      <Tab.Group
        aria-label="Layout"
        className="w-[216px]"
        layout="equal"
        size="xs"
        value={value}
        onValueChange={setValue}
      >
        <Tab value="list" icon={<LayoutList strokeWidth={2} />} iconOnly aria-label="List view">
          List
        </Tab>
        <Tab value="stack" icon={<Rows3 strokeWidth={2} />} iconOnly aria-label="Stack view">
          Stack
        </Tab>
        <Tab value="grid" icon={<LayoutGrid strokeWidth={2} />} iconOnly aria-label="Grid view">
          Grid
        </Tab>
      </Tab.Group>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const grid = canvas.getByRole("tab", { name: /grid view/i });
    await userEvent.click(grid);
    await expect(grid).toHaveAttribute("aria-selected", "true");
  },
};

const tabSizes = ["xs", "sm", "md"] as const;

export const Sizes: Story = {
  name: "Sizes",
  parameters: {
    docs: {
      description: {
        story:
          "`Tab.Group` **`size`** — `xs` (dense agent toolbar, default), `sm` (Chip-aligned ~26px), `md` (roomier panel headers).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 font-sans">
      {tabSizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{size}</p>
          <Tab.Group
            aria-label={`Agent views ${size}`}
            size={size}
            value="steps"
            onValueChange={() => undefined}
          >
            <Tab value="steps">Steps</Tab>
            <Tab value="reasoning">Reasoning</Tab>
            <Tab value="search">Search</Tab>
            <Tab value="coding">Coding</Tab>
          </Tab.Group>
        </div>
      ))}
    </div>
  ),
};

export const WithEndContent: Story = {
  name: "With end content",
  render: () => {
    const [value, setValue] = useState("live");
    return (
      <Tab.Group aria-label="Monitor views" value={value} onValueChange={setValue}>
        <Tab value="live" endContent={<StatusDot variant="success" decorative />}>
          Live
        </Tab>
        <Tab value="history">History</Tab>
        <Tab value="alerts" count={3}>
          Alerts
        </Tab>
      </Tab.Group>
    );
  },
};

const rows = [
  { task: "Restock mango sorbet", date: "Dec 03", status: "todo" as const },
  { task: "Churn black sesame", date: "Sep 22", status: "progress" as const },
  { task: "Order waffle cones", date: "Apr 14", status: "done" as const },
];

const statusBadge = {
  todo: { label: "To do", variant: "warning" as const },
  progress: { label: "In Progress", variant: "info" as const },
  done: { label: "Completed", variant: "success" as const },
};

export const WithTable: Story = {
  name: "With table",
  parameters: {
    docs: {
      description: {
        story:
          "Tab group switches the panel above a table — same slot **`Chip.Group`** often occupies for filters. " +
          "Tabs = view mode; chips = row filter.",
      },
    },
  },
  render: () => {
    const [view, setView] = useState<"tasks" | "owners">("tasks");

    return (
      <div className="flex w-full max-w-lg flex-col gap-[length:var(--spacing-3)] font-sans">
        <Tab.Group aria-label="Task table views" value={view} onValueChange={setView}>
          <Tab value="tasks">Tasks</Tab>
          <Tab value="owners">By owner</Tab>
        </Tab.Group>

        <Table aria-label="Tasks" variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.Head>{view === "tasks" ? "Task" : "Owner"}</Table.Head>
              <Table.Head>Date</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => {
              const pill = statusBadge[row.status];
              return (
                <Table.Row key={row.task}>
                  <Table.Cell className="font-medium">{row.task}</Table.Cell>
                  <Table.Cell className="text-muted">{row.date}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={pill.variant}>{pill.label}</Badge>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  },
};
