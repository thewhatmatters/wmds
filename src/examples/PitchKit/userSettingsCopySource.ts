import {
  pitchKitBrandClasses,
  pitchKitPageClasses,
  pitchKitSupportingClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
  pitchKitUserSettingsBodyClasses,
  pitchKitUserSettingsIdentityClasses,
  pitchKitUserSettingsIdentityCopyClasses,
  pitchKitUserSettingsNameClasses,
} from "./pitchKitStyles";

export const userSettingsOwnerCopySource = `
import { useState } from "react";
import { AlertDialog, Avatar, Button, Dialog } from "@whatmatters/wmds";

export function UserSettingsOwnerPage({ account }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <span />
          <span className="${pitchKitTopbarEndClasses}">
            <Button
              type="button"
              role="ghost"
              size="sm"
              aria-label="Open user settings"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen(true)}
            >
              <Avatar name={account.displayName} size="sm" />
            </Button>
          </span>
        </header>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <Dialog.Content
          size="sm"
          title="User settings"
          description="Account details for this PitchKit."
        >
          <div className="${pitchKitUserSettingsBodyClasses}">
            <div className="${pitchKitUserSettingsIdentityClasses}">
              <Avatar name={account.displayName} size="md" />
              <div className="${pitchKitUserSettingsIdentityCopyClasses}">
                <p className="${pitchKitUserSettingsNameClasses}">{account.displayName}</p>
                <p className="${pitchKitSupportingClasses}">{account.email}</p>
              </div>
            </div>
            <Button
              role="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              Delete account
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete account?"
        description="This permanently removes your PitchKit account. You cannot undo this action."
        cancelLabel="Keep account"
        confirmLabel="Delete account"
        confirmRole="destructive"
        onConfirm={() => {
          setDeleteOpen(false);
          setSettingsOpen(false);
        }}
      />
    </main>
  );
}
`;
