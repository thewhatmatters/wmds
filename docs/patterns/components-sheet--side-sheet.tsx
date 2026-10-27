// @thewhatmatters/wmds@0.4.29 · Pattern — side sheet
// Storybook: Components/Sheet → Pattern — side sheet (?path=/story/components-sheet--side-sheet)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Button, Sheet, dialogFooterActionsClasses } from "@thewhatmatters/wmds";

export function ApprovalSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="primary" onClick={() => setOpen(true)}>
        Review Maya Chen
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          side="end"
          size="md"
          title="Maya Chen"
          description="Creator application, waiting 3 days"
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="outline" onClick={() => setOpen(false)}>
                Deny
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Approve
              </Button>
            </div>
          }
        >
          <p>Writes about independent studios. Two published samples attached.</p>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
