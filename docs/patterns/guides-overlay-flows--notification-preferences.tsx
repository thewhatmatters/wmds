// @thewhatmatters/wmds@0.4.8 · Pattern — notification preferences
// Storybook: Guides/Overlay flows → Pattern — notification preferences (?path=/story/guides-overlay-flows--notification-preferences)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  AlertDialog,
  Button,
  Card,
  CheckboxGroup,
  Dialog,
  Input,
  Sheet,
  Switch,
  cardLayoutBodyOccupantInsetXClasses,
  cardSubtitleClasses,
  cardTitleClasses,
  dialogFooterActionsClasses,
} from "@thewhatmatters/wmds";

export function NotificationPreferencesPage() {
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [disableAlertsOpen, setDisableAlertsOpen] = useState(false);
  const [emailDigests, setEmailDigests] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [channels, setChannels] = useState(["email", "push"]);

  function handleCriticalChange(checked: boolean) {
    if (!checked && criticalAlerts) {
      setDisableAlertsOpen(true);
      return;
    }
    setCriticalAlerts(checked);
  }

  return (
    <>
      <Card padding="none" className="mx-auto max-w-lg">
        <Card.Header
          start={
            <div>
              <h2 className={cardTitleClasses}>Notification preferences</h2>
              <p className={cardSubtitleClasses}>Choose how WhatMatters reaches residents and staff.</p>
            </div>
          }
        />
        <Card.Body>
          <div className={`flex flex-col gap-4 py-4 ${cardLayoutBodyOccupantInsetXClasses}`}>
            <Switch
              layout="settings"
              label="Email digests"
              description="Weekly occupancy summary"
              checked={emailDigests}
              onChange={(event) => setEmailDigests(event.target.checked)}
            />
            <Switch
              layout="settings"
              label="Critical alerts"
              description="Immediate SMS for threshold breaches"
              checked={criticalAlerts}
              onChange={(event) => handleCriticalChange(event.target.checked)}
            />
          </div>
        </Card.Body>
        <Card.Footer className="justify-end gap-2">
          <Button role="secondary" size="sm" onClick={() => setFiltersOpen(true)}>
            Market filters
          </Button>
          <Button role="primary" size="sm" onClick={() => setChannelsOpen(true)}>
            Manage channels
          </Button>
        </Card.Footer>
      </Card>

      <Dialog open={channelsOpen} onOpenChange={setChannelsOpen}>
        <Dialog.Content
          title="Alert channels"
          description="Residents receive notices on every channel you enable."
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setChannelsOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" role="primary" onClick={() => setChannelsOpen(false)}>
                Save
              </Button>
            </div>
          }
        >
          <CheckboxGroup label="Channels" values={channels} onValuesChange={setChannels}>
            <CheckboxGroup.Item value="email" label="Email" />
            <CheckboxGroup.Item value="push" label="Push notifications" />
            <CheckboxGroup.Item value="sms" label="SMS" />
          </CheckboxGroup>
        </Dialog.Content>
      </Dialog>

      <AlertDialog
        open={disableAlertsOpen}
        onOpenChange={setDisableAlertsOpen}
        title="Disable critical alerts?"
        description="Staff will not receive immediate SMS when occupancy thresholds are breached."
        cancelLabel="Keep alerts on"
        confirmLabel="Disable alerts"
        confirmRole="destructive"
        onConfirm={() => {
          setCriticalAlerts(false);
          setDisableAlertsOpen(false);
        }}
        onCancel={() => setDisableAlertsOpen(false)}
      />

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <Sheet.Content
          title="Market filters"
          description="Scope notifications to selected markets."
          headerStart={<SlidersHorizontal strokeWidth={2} />}
          size="md"
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setFiltersOpen(false)}>
                Reset
              </Button>
              <Button size="sm" role="primary" onClick={() => setFiltersOpen(false)}>
                Apply
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 pb-4">
            <Input label="Market" placeholder="All markets" />
            <Input label="Region" placeholder="All regions" />
          </div>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
