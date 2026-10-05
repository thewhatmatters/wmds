// @thewhatmatters/wmds@0.4.3 · Pattern — custom leading / trailing
// Storybook: Components/TaskRows → Pattern — custom leading / trailing (?path=/story/components-taskrows--custom-slots)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Badge, Status, TaskRows } from "@thewhatmatters/wmds";

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
