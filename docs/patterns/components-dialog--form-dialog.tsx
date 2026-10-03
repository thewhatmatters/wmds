// @whatmatters/wmds@0.2.0 · Pattern — form dialog
// Storybook: Components/Dialog → Pattern — form dialog (?path=/story/components-dialog--form-dialog)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Button, Dialog, Input } from "@whatmatters/wmds";
import { dialogFooterActionsClasses } from "@whatmatters/wmds";

function InviteDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="secondary" onClick={() => setOpen(true)}>
        Invite teammate
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content
          size="lg"
          title="Invite teammate"
          description="Send an email invite to join this workspace."
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Send invite
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 pb-2">
            <Input label="Email address" placeholder="name@company.com" />
            <Input label="Role" placeholder="Editor" />
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
