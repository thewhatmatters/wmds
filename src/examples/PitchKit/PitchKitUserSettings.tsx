import { useState } from "react";
import { Copy } from "lucide-react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { AlertDialog } from "../../components/organisms/Dialog/AlertDialog";
import { Dialog } from "../../components/organisms/Dialog/Dialog";
import { Toaster, toast } from "../../components/organisms/Toast/Toast";
import { PitchKitExampleShell } from "./PitchKitExampleShell";
import { CreatorIdentityStrip } from "./PitchKitCreatorIdentity";
import {
  pitchKitCreatorIdentity,
  pitchKitShareKitPath,
  type PitchKitCreatorIdentity,
} from "./pitchKitData";
import {
  pitchKitConnectionMetaClasses,
  pitchKitSectionEyebrowClasses,
  pitchKitSettingsBodyClasses,
  pitchKitSettingsCardClasses,
  pitchKitShareKitActionsClasses,
  pitchKitShareKitStackClasses,
  pitchKitTopbarEndClasses,
  pitchKitUserSettingsActionsClasses,
  pitchKitUserSettingsBodyClasses,
} from "./pitchKitStyles";

function copyShareKitUrl(handle: string) {
  const path = pitchKitShareKitPath(handle);
  void navigator.clipboard?.writeText(path).catch(() => undefined);
  toast.add({
    title: "Kit URL copied",
    description: path,
    tone: "success",
  });
}

function AccountSettingsShareKit({
  identity,
}: {
  identity: PitchKitCreatorIdentity;
}) {
  const sharePath = pitchKitShareKitPath(identity.handle);

  return (
    <div className={pitchKitShareKitStackClasses}>
      <span className={pitchKitSectionEyebrowClasses}>Share kit</span>
      <div className={pitchKitShareKitActionsClasses}>
        <TextLink href={sharePath}>{sharePath}</TextLink>
        <Button
          role="secondary"
          size="sm"
          icon={<Copy />}
          onClick={() => copyShareKitUrl(identity.handle)}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}

export function AccountSettingsDialog({
  identity = pitchKitCreatorIdentity,
  open,
  onOpenChange,
}: {
  identity?: PitchKitCreatorIdentity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content size="md" title="Account settings">
          <div className={pitchKitUserSettingsBodyClasses}>
            <Card
              variant="outlined"
              shape="rounded"
              bodyTerminal
              className={pitchKitSettingsCardClasses}
            >
              <Card.Header
                start={<h2 className={cardTitleClasses}>Connected Instagram</h2>}
                end={
                  identity.connected ? (
                    <Badge variant="success" emphasis="muted" size="sm">
                      Connected
                    </Badge>
                  ) : null
                }
              />
              <Card.Body>
                <div className={pitchKitSettingsBodyClasses}>
                  <CreatorIdentityStrip
                    identity={identity}
                    nameAs="p"
                    showProfessionalChip
                  />
                  {identity.lastSyncedLabel != null ? (
                    <p className={pitchKitConnectionMetaClasses}>
                      Last synced {identity.lastSyncedLabel}
                    </p>
                  ) : null}
                </div>
              </Card.Body>
            </Card>

            <AccountSettingsShareKit identity={identity} />

            <div className={pitchKitUserSettingsActionsClasses}>
              <Button role="secondary" size="sm">
                Sign out
              </Button>
              <Button role="secondary" size="sm">
                Disconnect
              </Button>
              <Button
                role="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
              >
                Delete account
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your Pitchkit account?"
        description="This permanently deletes your kit, stored media copies, and connection. Your Instagram account is not deleted. This cannot be undone."
        cancelLabel="Cancel"
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
  const topbarName =
    pitchKitCreatorIdentity.displayName ?? pitchKitCreatorIdentity.handle;

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
              aria-label="Account settings"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen(true)}
            >
              <Avatar
                name={topbarName}
                src={pitchKitCreatorIdentity.profilePictureUrl}
                size="sm"
              />
            </Button>
          </span>
        </>
      }
      overlay={
        <>
          <AccountSettingsDialog
            identity={pitchKitCreatorIdentity}
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
          />
          <Toaster position="bottom-right" />
        </>
      }
    />
  );
}
