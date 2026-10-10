// @thewhatmatters/wmds@0.4.8 · Pattern — card + status rows
// Storybook: Components/TaskRows → Pattern — card + status rows (?path=/story/components-taskrows--card-with-status-rows)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, Card, TaskRows } from "@thewhatmatters/wmds";

<Card padding="none">
  <Card.Header
    start={<h2>Restock run</h2>}
    end={<span>Step 2 of 4</span>}
  />
  <Card.Body>
    <TaskRows variant="list" inset>
      <TaskRows.Item label="Verified vendor records" meta="12 suppliers" status="done" defaultOpen>
        <TaskRows.Detail label="Matched tax and contact IDs" meta="12/12" />
        <TaskRows.Detail label="Flagged stale records" meta="0" />
      </TaskRows.Item>
      <TaskRows.Item label="Build reorder task list" meta="7 SKUs" status="running" step={2} defaultOpen>
        <TaskRows.Detail label="Reading POS export" meta="3 files" />
        <TaskRows.Detail label="Scoring stockout risk" meta="68%" />
      </TaskRows.Item>
    </TaskRows>
  </Card.Body>
  <Card.Footer>
    <span>2 complete · 1 running</span>
    <Button role="primary" size="sm">
      Continue
    </Button>
  </Card.Footer>
</Card>
