// @thewhatmatters/wmds@0.4.37 · Pattern — alert dialog (typed confirmation delete)
// Storybook: Components/Dialog → Pattern — alert dialog (typed confirmation delete) (?path=/story/components-dialog--alert-dialog-typed-confirmation)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { AlertDialog, Button, Input } from "@thewhatmatters/wmds";

function normalizeHandle(value: string): string {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export function DeleteAccountAlert({ handle }: { handle: string }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const matches = typed.trim() !== "" && normalizeHandle(typed) === normalizeHandle(handle);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setTyped("");
    }
  }

  return (
    <>
      <Button role="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Delete this account?"
        description="This removes the account and everything it owns. You cannot undo this action."
        cancelLabel="Keep account"
        confirmLabel="Delete account"
        confirmRole="destructive"
        confirmDisabled={!matches}
        onConfirm={() => handleOpenChange(false)}
      >
        <Input
          label={
            <>
              Type <strong>{handle}</strong> to confirm
            </>
          }
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </AlertDialog>
    </>
  );
}
