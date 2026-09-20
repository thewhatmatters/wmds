import { useEffect, useRef, useState } from "react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Dropdown } from "../../components/molecules/Dropdown/Dropdown";
import { AlertDialog } from "../../components/organisms/Dialog/AlertDialog";
import { Dialog } from "../../components/organisms/Dialog/Dialog";
import { toast } from "../../components/organisms/Toast/Toast";
import { CreatorIdentityStrip } from "./PitchKitCreatorIdentity";
import {
  pitchKitCreatorIdentity,
  pitchKitShareKitPath,
  type PitchKitCreatorIdentity,
} from "./pitchKitData";
import {
  pitchKitAccountMenuPanelClasses,
  pitchKitAccountMenuRootClasses,
  pitchKitAvatarTriggerClasses,
  pitchKitConnectionMetaClasses,
  pitchKitFooterBandClasses,
  pitchKitFooterClasses,
  pitchKitMenuHeaderClasses,
  pitchKitMenuSeparatorClasses,
  pitchKitSettingsBodyClasses,
  pitchKitSettingsCardClasses,
  pitchKitUserSettingsBodyClasses,
} from "./pitchKitStyles";

export function copyPitchKitShareUrl(handle: string) {
  const path = pitchKitShareKitPath(handle);
  void navigator.clipboard?.writeText(path).catch(() => undefined);
  toast.add({
    title: "Kit URL copied",
    description: path,
    tone: "success",
  });
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
  return (
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
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

export function OwnerAccountMenu({
  identity = pitchKitCreatorIdentity,
}: {
  identity?: PitchKitCreatorIdentity;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const topbarName = identity.displayName ?? identity.handle;

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event: MouseEvent) {
      if (
        rootRef.current != null &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function handleAction(actionId: string) {
    setMenuOpen(false);
    if (actionId === "settings") {
      setSettingsOpen(true);
      return;
    }
    if (actionId === "share") {
      copyPitchKitShareUrl(identity.handle);
      return;
    }
    if (actionId === "delete") {
      setDeleteOpen(true);
    }
  }

  return (
    <>
      <div ref={rootRef} className={pitchKitAccountMenuRootClasses}>
        <Button
          type="button"
          role="ghost"
          size="sm"
          aria-label="My account"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={pitchKitAvatarTriggerClasses}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Avatar
            name={topbarName}
            src={identity.profilePictureUrl}
            size="md"
          />
        </Button>
        {menuOpen ? (
          <Dropdown.Menu
            role="menu"
            aria-label="My account"
            className={pitchKitAccountMenuPanelClasses}
          >
            <li role="presentation">
              <p className={pitchKitMenuHeaderClasses}>My account</p>
            </li>
            <li role="presentation">
              <Dropdown.Item
                role="menuitem"
                truncate={false}
                onClick={() => handleAction("settings")}
              >
                Account settings
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item
                role="menuitem"
                truncate={false}
                onClick={() => handleAction("share")}
              >
                Share kit
              </Dropdown.Item>
            </li>
            <li role="separator" className={pitchKitMenuSeparatorClasses} />
            <li role="presentation">
              <Dropdown.Item
                role="menuitem"
                truncate={false}
                onClick={() => handleAction("signout")}
              >
                Sign out
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item
                role="menuitem"
                truncate={false}
                onClick={() => handleAction("disconnect")}
              >
                Disconnect
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item
                role="menuitem"
                truncate={false}
                onClick={() => handleAction("delete")}
              >Delete</Dropdown.Item>
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

export function PitchKitPageFooter() {
  return (
    <div className={pitchKitFooterBandClasses}>
      <footer className={pitchKitFooterClasses}>
        <TextLink href="/privacy">Privacy</TextLink>
        <TextLink href="mailto:hello@whatmatters.com">Support</TextLink>
      </footer>
    </div>
  );
}
