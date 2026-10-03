// @thewhatmatters/wmds@0.2.0 · Pattern — status rows
// Storybook: Components/TaskRows → Pattern — status rows (?path=/story/components-taskrows--status-list)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { TaskRows } from "@thewhatmatters/wmds";

<TaskRows variant="list">
  <TaskRows.Item label="Verified vendor records" meta="12 suppliers" status="done" defaultOpen>
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
