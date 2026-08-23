"use client";

import { useState } from "react";
import { Badge } from "../../components/Badge/Badge";
import { Chip } from "../../components/Chip/Chip";
import { Table } from "../../components/Table/Table";

type Status = "todo" | "progress" | "done";

const COLUMN_COUNT = 4;

const rows: { task: string; date: string; status: Status; owner: string }[] = [
  { task: "Restock mango sorbet", date: "Dec 03", status: "todo", owner: "Mango Moon Gelato" },
  { task: "Churn black sesame", date: "Sep 22", status: "progress", owner: "Kumo Creamery" },
  { task: "Print summer menu", date: "Jan 02", status: "todo", owner: "Coral Coast Sorbet" },
  { task: "Taste-test batch 42", date: "Nov 08", status: "progress", owner: "Maple Orbit" },
  { task: "Order waffle cones", date: "Apr 14", status: "done", owner: "Aurora Scoops" },
];

const statusBadge: Record<Status, { label: string; variant: "warning" | "info" | "success" }> = {
  todo: { label: "To do", variant: "warning" },
  progress: { label: "In Progress", variant: "info" },
  done: { label: "Completed", variant: "success" },
};

const statusCounts = rows.reduce(
  (counts, row) => {
    counts[row.status] += 1;
    return counts;
  },
  { todo: 0, progress: 0, done: 0 },
);

/** Chip filter bar + animated table rows — design-system specimen. */
export function FilterTable() {
  const [filter, setFilter] = useState<"all" | Status>("all");

  return (
    <div className="flex w-full max-w-lg flex-col gap-[length:var(--spacing-1)] font-sans">
      <Chip.Group aria-label="Task status filters" value={filter} onValueChange={setFilter}>
        <Chip value="all" count={rows.length}>
          All
        </Chip>
        <Chip value="todo" dot="warning" count={statusCounts.todo}>
          To do
        </Chip>
        <Chip value="progress" dot="info" count={statusCounts.progress}>
          In Progress
        </Chip>
        <Chip value="done" dot="success" count={statusCounts.done}>
          Completed
        </Chip>
      </Chip.Group>

      <Table aria-label="Filtered tasks" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.Head>Task name</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Advisor</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => {
            const pill = statusBadge[row.status];
            const shown = filter === "all" || row.status === filter;

            return (
              <Table.Row key={row.task} visible={shown} colSpan={COLUMN_COUNT}>
                <Table.Cell className="font-medium">
                  <span className="block max-w-[10rem] truncate">{row.task}</span>
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
    </div>
  );
}
