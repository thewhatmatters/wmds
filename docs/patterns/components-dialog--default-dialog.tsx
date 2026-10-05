// @thewhatmatters/wmds@0.4.3 · Pattern — dialog
// Storybook: Components/Dialog → Pattern — dialog (?path=/story/components-dialog--default-dialog)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Button, Dialog } from "@thewhatmatters/wmds";
import { dialogFooterActionsClasses } from "@thewhatmatters/wmds";

export function NotificationSettingsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="primary" onClick={() => setOpen(true)}>
        Open settings
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content
          title="Notification settings"
          description="Choose how WhatMatters reaches you."
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </div>
          }
        >
          <p className="text-muted">
            Email digests and push alerts can be configured in your account preferences.
          </p>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
