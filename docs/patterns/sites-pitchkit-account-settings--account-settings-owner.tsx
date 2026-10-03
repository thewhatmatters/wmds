// @thewhatmatters/wmds@0.2.0 · Pattern — account settings (owner)
// Storybook: Sites/PitchKit/Account settings → Pattern — account settings (owner) (?path=/story/sites-pitchkit-account-settings--account-settings-owner)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Dialog,
  Dropdown,
  TextLink,
  Toaster,
  cardTitleClasses,
  toast,
} from "@thewhatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});


export interface PitchKitCreatorIdentity {
  displayName?: string;
  /** Without the @ — shown as @handle, shared as /k/[handle]. */
  handle: string;
  profilePictureUrl?: string;
  followersCount?: number;
  professionalAccount?: "Business" | "Creator";
  connected?: boolean;
  lastSyncedLabel?: string;
}

function CreatorIdentityStrip({
  identity,
  nameAs = "h1",
  showProfessionalChip = false,
}: {
  identity: PitchKitCreatorIdentity;
  nameAs?: "h1" | "p";
  showProfessionalChip?: boolean;
}) {
  const NameTag = nameAs;
  const avatarName = identity.displayName ?? identity.handle;
  const handleLabel = `@${identity.handle}`;
  const followerLabel =
    identity.followersCount == null
      ? null
      : `${compactNumber.format(identity.followersCount)} followers`;
  const meta = [handleLabel, followerLabel].filter(Boolean).join(" · ");
  const showTitleRow =
    identity.displayName != null ||
    (showProfessionalChip && identity.professionalAccount != null);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar
        name={avatarName}
        src={identity.profilePictureUrl}
        size="lg"
      />
      <div className="flex min-w-0 flex-col gap-1">
        {showTitleRow ? (
          <div className="flex flex-wrap items-center gap-2">
            {identity.displayName != null ? (
              <NameTag className="type-heading-2 text-fg">
                {identity.displayName}
              </NameTag>
            ) : null}
            {showProfessionalChip && identity.professionalAccount != null ? (
              <Chip readOnly size="sm">
                {identity.professionalAccount}
              </Chip>
            ) : null}
          </div>
        ) : null}
        <p className="type-body text-fg text-muted">{meta}</p>
      </div>
    </div>
  );
}


function copyShareKitUrl(handle: string) {
  const path = `/k/${handle}`;
  void navigator.clipboard.writeText(path);
  toast.add({
    title: "Kit URL copied",
    description: path,
    tone: "success",
  });
}

function AccountSettingsDialog({
  identity,
  open,
  onOpenChange,
}: {
  identity: PitchKitCreatorIdentity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="md" title="Account settings">
        <div className="flex w-full min-w-0 flex-col gap-4">
          <Card variant="outlined" shape="rounded" bodyTerminal className="col-span-full">
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
              <div className="flex min-w-0 flex-col gap-4 px-3.5 py-[16px]">
                <CreatorIdentityStrip
                  identity={identity}
                  nameAs="p"
                  showProfessionalChip
                />
                {identity.lastSyncedLabel != null ? (
                  <p className="type-supporting text-muted text-muted">
                    Last synced {identity.lastSyncedLabel}
                  </p>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

function OwnerAccountMenu({ identity }: { identity: PitchKitCreatorIdentity }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleAction(actionId: string) {
    setMenuOpen(false);
    if (actionId === "settings") {
      setSettingsOpen(true);
      return;
    }
    if (actionId === "share") {
      copyShareKitUrl(identity.handle);
      return;
    }
    if (actionId === "delete") {
      setDeleteOpen(true);
    }
  }

  return (
    <>
      <div className="relative">
        <Button
          type="button"
          role="ghost"
          size="sm"
          aria-label="My account"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="size-9 min-h-9 gap-0 px-0 py-0 focus-visible:ring-offset-0"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Avatar
            name={identity.displayName ?? identity.handle}
            src={identity.profilePictureUrl}
            size="md"
          />
        </Button>
        {menuOpen ? (
          <Dropdown.Menu
            role="menu"
            aria-label="My account"
            className="absolute end-0 top-full mt-1 min-w-56"
          >
            <li role="presentation">
              <p className="type-supporting font-medium uppercase tracking-wider text-muted px-3.5 py-2">My account</p>
            </li>
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("settings")}>
                Account settings
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("share")}>
                Share kit
              </Dropdown.Item>
            </li>
            <li role="separator" className="mx-1.5 my-0.5 border-0 border-t border-border" />
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("signout")}>
                Sign out
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("disconnect")}>
                Disconnect
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("delete")}>Delete</Dropdown.Item>
            </li>
          </Dropdown.Menu>
        ) : null}
      </div>
      <AccountSettingsDialog
        identity={identity}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your Pitchkit account?"
        description="This permanently deletes your kit, stored media copies, and connection. Your Instagram account is not deleted. This cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Delete account"
        confirmRole="destructive"
        onConfirm={() => setDeleteOpen(false)}
      />
    </>
  );
}

function PitchKitPageFooter() {
  return (
    <div className="band pb-6 pt-10">
      <footer className="col-span-full flex items-center justify-center gap-4">
        <TextLink href="/privacy">Privacy</TextLink>
        <TextLink href="mailto:hello@whatmatters.com">Support</TextLink>
      </footer>
    </div>
  );
}


export function AccountSettingsOwnerPage({ identity }: { identity: PitchKitCreatorIdentity }) {
  return (
    <main className="grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]">
      <div className="band pb-4">
        <header className="col-span-full grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <span className="type-heading-4 text-fg text-fg">PitchKit</span>
          <span />
          <span className="justify-self-end">
            <OwnerAccountMenu identity={identity} />
          </span>
        </header>
      </div>
      <PitchKitPageFooter />
      <Toaster position="bottom-right" />
    </main>
  );
}
