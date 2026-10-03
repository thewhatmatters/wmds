// @whatmatters/wmds@0.2.0 · Pattern — capsules
// Storybook: Components/TaskRows → Pattern — capsules (?path=/story/components-taskrows--capsules)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { TaskRows } from "@whatmatters/wmds";

<TaskRows variant="capsule">
  <TaskRows.Item label="Export vendor CSV" meta="12 rows" status="done">
    <TaskRows.Detail label="Generated file" meta="vendors.csv" />
  </TaskRows.Item>
  <TaskRows.Item label="Refresh POS data" meta="3 files" status="running" step={2} defaultOpen>
    <TaskRows.Detail label="Reading export" meta="2/3" />
  </TaskRows.Item>
</TaskRows>
