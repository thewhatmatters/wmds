// @thewhatmatters/wmds@0.4.4 · Pattern — end detail rail
// Storybook: Components/Panel → Pattern — end detail rail (?path=/story/components-panel--end-detail-rail)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Info } from "lucide-react";
import {
  Button,
  Card,
  Panel,
  cardBodyTextClasses,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardTitleClasses,
  cn,
  dialogFooterActionsClasses,
} from "@thewhatmatters/wmds";

export function MarketDetailRail() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card padding="none" className="max-w-xl">
        <Card.Header start={<h2 className={cardTitleClasses}>Mueller market</h2>} />
        <Card.Body>
          <div className={cn(cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantPadYClasses)}>
            <p className={cardBodyTextClasses}>
              Occupancy held at 82% this week. Open the detail rail to review threshold
              history without leaving the list.
            </p>
          </div>
        </Card.Body>
        <Card.Footer className="justify-end">
          <Button role="secondary" size="sm" onClick={() => setOpen(true)}>
            View details
          </Button>
        </Card.Footer>
      </Card>

      <Panel open={open} onOpenChange={setOpen}>
        <Panel.Content
          title="Threshold history"
          description="Last 7 days — Mueller market"
          headerStart={<Info strokeWidth={2} />}
          size="md"
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          }
        >
          <ul className="flex flex-col gap-3 pb-4 text-muted type-body">
            <li>Mon — 84% (threshold 80%)</li>
            <li>Tue — 81% (threshold 80%)</li>
            <li>Wed — 79% (threshold 80%)</li>
            <li>Thu — 82% (threshold 80%)</li>
          </ul>
        </Panel.Content>
      </Panel>
    </>
  );
}
