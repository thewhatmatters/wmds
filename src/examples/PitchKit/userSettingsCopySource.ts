import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import {
  pitchKitBrandClasses,
  pitchKitConnectionMetaClasses,
  pitchKitPageClasses,
  pitchKitSectionEyebrowClasses,
  pitchKitSettingsBodyClasses,
  pitchKitSettingsCardClasses,
  pitchKitShareKitActionsClasses,
  pitchKitShareKitStackClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
  pitchKitUserSettingsActionsClasses,
  pitchKitUserSettingsBodyClasses,
} from "./pitchKitStyles";

export const userSettingsOwnerCopySource = `
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Dialog,
  TextLink,
  Toaster,
  cardTitleClasses,
  toast,
} from "@whatmatters/wmds";
import { Copy } from "lucide-react";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${creatorIdentityStripCopySource}

export function AccountSettingsOwnerPage({ identity }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const sharePath = \`/k/\${identity.handle}\`;

  function copyShareKitUrl() {
    void navigator.clipboard.writeText(sharePath);
    toast.add({
      title: "Kit URL copied",
      description: sharePath,
      tone: "success",
    });
  }

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
              aria-label="Account settings"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen(true)}
            >
              <Avatar
                name={identity.displayName ?? identity.handle}
                src={identity.profilePictureUrl}
                size="sm"
              />
            </Button>
          </span>
        </header>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <Dialog.Content size="md" title="Account settings">
          <div className="${pitchKitUserSettingsBodyClasses}">
            <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitSettingsCardClasses}">
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
                <div className="${pitchKitSettingsBodyClasses}">
                  <CreatorIdentityStrip
                    identity={identity}
                    nameAs="p"
                    showProfessionalChip
                  />
                  {identity.lastSyncedLabel != null ? (
                    <p className="${pitchKitConnectionMetaClasses}">
                      Last synced {identity.lastSyncedLabel}
                    </p>
                  ) : null}
                </div>
              </Card.Body>
            </Card>

            <div className="${pitchKitShareKitStackClasses}">
              <span className="${pitchKitSectionEyebrowClasses}">Share kit</span>
              <div className="${pitchKitShareKitActionsClasses}">
                <TextLink href={sharePath}>{sharePath}</TextLink>
                <Button role="secondary" size="sm" icon={<Copy />} onClick={copyShareKitUrl}>
                  Copy
                </Button>
              </div>
            </div>

            <div className="${pitchKitUserSettingsActionsClasses}">
              <Button role="secondary" size="sm">Sign out</Button>
              <Button role="secondary" size="sm">Disconnect</Button>
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
          setSettingsOpen(false);
        }}
      />
      <Toaster position="bottom-right" />
    </main>
  );
}
`;
