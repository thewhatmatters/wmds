import { useState } from "react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Button } from "../../components/atoms/Button/Button";
import { AlertDialog } from "../../components/organisms/Dialog/AlertDialog";
import { Dialog } from "../../components/organisms/Dialog/Dialog";
import { PitchKitExampleShell } from "./PitchKitExampleShell";
import { pitchKitAccount } from "./pitchKitData";
import {
  pitchKitSupportingClasses,
  pitchKitTopbarEndClasses,
  pitchKitUserSettingsBodyClasses,
  pitchKitUserSettingsIdentityClasses,
  pitchKitUserSettingsIdentityCopyClasses,
  pitchKitUserSettingsNameClasses,
} from "./pitchKitStyles";

export function UserSettingsDialog({
  account = pitchKitAccount,
  open,
  onOpenChange,
}: {
  account?: typeof pitchKitAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content
          size="sm"
          title="User settings"
          description="Account details for this PitchKit."
        >
          <div className={pitchKitUserSettingsBodyClasses}>
            <div className={pitchKitUserSettingsIdentityClasses}>
              <Avatar
                name={account.displayName}
                src={account.profilePictureUrl}
                size="md"
              />
              <div className={pitchKitUserSettingsIdentityCopyClasses}>
                <p className={pitchKitUserSettingsNameClasses}>{account.displayName}</p>
                <p className={pitchKitSupportingClasses}>{account.email}</p>
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
          onOpenChange(false);
        }}
      />
    </>
  );
}

export function PitchKitUserSettingsOwnerExample() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <PitchKitExampleShell
      topbarEnd={
        <>
          <span />
          <span className={pitchKitTopbarEndClasses}>
            <Button
              type="button"
              role="ghost"
              size="sm"
              aria-label="Open user settings"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen(true)}
            >
              <Avatar
                name={pitchKitAccount.displayName}
                src={pitchKitAccount.profilePictureUrl}
                size="sm"
              />
            </Button>
          </span>
        </>
      }
      overlay={
        <UserSettingsDialog
          account={pitchKitAccount}
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        />
      }
    />
  );
}
