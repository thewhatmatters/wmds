// @thewhatmatters/wmds@0.4.0 · Pattern — bottom sheet
// Storybook: Components/Sheet → Pattern — bottom sheet (?path=/story/components-sheet--bottom-sheet)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Button, Input, Sheet } from "@thewhatmatters/wmds";
import { dialogFooterActionsClasses } from "@thewhatmatters/wmds";

export function FilterSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="secondary" onClick={() => setOpen(true)}>
        Filter results
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          title="Filters"
          description="Refine the occupancy view."
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                Reset
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 pb-4">
            <Input label="Minimum occupancy %" placeholder="80" />
            <Input label="Market" placeholder="All markets" />
          </div>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
