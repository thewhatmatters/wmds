// @whatmatters/wmds@0.2.0 · Pattern — end detail rail
// Storybook: Components/Panel → Pattern — end detail rail (?path=/story/components-panel--end-detail-rail)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Button, Card, Panel } from "@whatmatters/wmds";

function MarketDetailRail() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card padding="none">{/* list row */}</Card>
      <Panel open={open} onOpenChange={setOpen}>
        <Panel.Content
          title="Threshold history"
          description="Last 7 days — Mueller market"
          size="md"
        >
          {/* scrollable detail */}
        </Panel.Content>
      </Panel>
    </>
  );
}
