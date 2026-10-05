// @thewhatmatters/wmds@0.4.6 · Pattern — alert dialog (destructive)
// Storybook: Components/Dialog → Pattern — alert dialog (destructive) (?path=/story/components-dialog--alert-dialog-destructive)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { AlertDialog, Button } from "@thewhatmatters/wmds";

export function DeleteProjectAlert() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this project?"
        description="This removes all tasks and history. You cannot undo this action."
        cancelLabel="Keep project"
        confirmLabel="Delete project"
        confirmRole="destructive"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
