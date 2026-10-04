// @thewhatmatters/wmds@0.4.1 · Pattern — end sheet
// Storybook: Components/Sheet → Pattern — end sheet (?path=/story/components-sheet--end-sheet)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Button, Sheet, Switch } from "@thewhatmatters/wmds";

export function SettingsSheet() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <Button role="primary" onClick={() => setOpen(true)}>
        Open settings
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          side="end"
          title="Settings"
          description="Workspace preferences"
        >
          <Switch
            layout="settings"
            label="Email notifications"
            checked={notifications}
            onChange={(event) => setNotifications(event.target.checked)}
          />
        </Sheet.Content>
      </Sheet>
    </>
  );
}
