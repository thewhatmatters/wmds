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

export const ownerAccountChromeCopySource = `
function copyShareKitUrl(handle) {
  const path = \`/k/\${handle}\`;
  void navigator.clipboard.writeText(path);
  toast.add({
    title: "Kit URL copied",
    description: path,
    tone: "success",
  });
}

function AccountSettingsDialog({ identity, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

function OwnerAccountMenu({ identity }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleAction(actionId) {
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
      <div className="${pitchKitAccountMenuRootClasses}">
        <Button
          type="button"
          role="ghost"
          size="sm"
          aria-label="My account"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="${pitchKitAvatarTriggerClasses}"
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
            className="${pitchKitAccountMenuPanelClasses}"
          >
            <li role="presentation">
              <p className="${pitchKitMenuHeaderClasses}">My account</p>
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
            <li role="separator" className="${pitchKitMenuSeparatorClasses}" />
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
    <div className="${pitchKitFooterBandClasses}">
      <footer className="${pitchKitFooterClasses}">
        <TextLink href="/privacy">Privacy</TextLink>
        <TextLink href="mailto:hello@whatmatters.com">Support</TextLink>
      </footer>
    </div>
  );
}
`;
