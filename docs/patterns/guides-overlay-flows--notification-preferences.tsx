// @whatmatters/wmds@0.2.0 · Pattern — notification preferences
// Storybook: Guides/Overlay flows → Pattern — notification preferences (?path=/story/guides-overlay-flows--notification-preferences)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import {
  AlertDialog,
  Button,
  Card,
  CheckboxGroup,
  Dialog,
  Input,
  Sheet,
  Switch,
  dialogFooterActionsClasses,
} from "@whatmatters/wmds";

export function NotificationPreferencesPage() {
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [disableAlertsOpen, setDisableAlertsOpen] = useState(false);
  const [emailDigests, setEmailDigests] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [channels, setChannels] = useState(["email", "push"]);

  return (
    <>
      <Card padding="none">
        {/* Card.Header + Card.Body (occupant inset) + Card.Footer — see full story */}
      </Card>
      <Dialog open={channelsOpen} onOpenChange={setChannelsOpen}>
        <Dialog.Content title="Alert channels" footer={/* Save / Cancel */}>
          <CheckboxGroup values={channels} onValuesChange={setChannels}>
            {/* items */}
          </CheckboxGroup>
        </Dialog.Content>
      </Dialog>
      <AlertDialog
        open={disableAlertsOpen}
        onOpenChange={setDisableAlertsOpen}
        title="Disable critical alerts?"
        confirmRole="destructive"
        onConfirm={() => setCriticalAlerts(false)}
      />
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <Sheet.Content title="Market filters">{/* filters */}</Sheet.Content>
      </Sheet>
    </>
  );
}
