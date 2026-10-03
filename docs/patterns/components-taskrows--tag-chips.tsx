// @thewhatmatters/wmds@0.2.0 · Pattern — tag chips
// Storybook: Components/TaskRows → Pattern — tag chips (?path=/story/components-taskrows--tag-chips)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Chip, TaskRows } from "@thewhatmatters/wmds";

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
