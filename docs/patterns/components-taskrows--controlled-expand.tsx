// @thewhatmatters/wmds@0.4.3 · Pattern — controlled expand
// Storybook: Components/TaskRows → Pattern — controlled expand (?path=/story/components-taskrows--controlled-expand)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Button, TaskRows } from "@thewhatmatters/wmds";

export function ReorderPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
