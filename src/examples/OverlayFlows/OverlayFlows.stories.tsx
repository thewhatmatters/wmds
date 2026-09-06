import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/atoms/Button/Button";
import { Switch } from "../../components/atoms/Switch/Switch";
import { Card } from "../../components/molecules/Card/Card";
import { CheckboxGroup } from "../../components/molecules/CheckboxGroup/CheckboxGroup";
import { Input } from "../../components/atoms/Input/Input";
import { AlertDialog } from "../../components/organisms/Dialog/AlertDialog";
import { Dialog } from "../../components/organisms/Dialog/Dialog";
import { dialogFooterActionsClasses } from "../../components/organisms/Dialog/dialogStyles";
import { Sheet } from "../../components/organisms/Sheet/Sheet";
import { storyCopySource, storyMetaDocsDefaults } from "../../lib/storyCopySource";

const meta = {
  title: "Examples/Overlay flows",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Page-level composition — when to reach for each overlay primitive on a real settings surface.

| User action | Component | Why |
|-------------|-----------|-----|
| Edit a short form in place | **Dialog** | Brief modal; scrim focuses attention; dismissible |
| Confirm irreversible change | **AlertDialog** | Blocking; scrim dismiss off; explicit cancel/confirm |
| Filters or side detail without leaving context | **Sheet** | Edge-attached; hairlines when body scrolls |

Copy this story for workspace settings, market filters, or destructive toggles — do not hand-roll portal/scrim/focus.

## Anatomy

\`\`\`
Card (settings surface)
├── Switch rows — inline toggles
├── Dialog — channel picker (CheckboxGroup + footer actions)
├── AlertDialog — disable critical alerts
└── Sheet — market filters (bottom drawer)
\`\`\`
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotificationPreferences: Story = {
  name: "Pattern — notification preferences",
  render: function NotificationPreferencesFlow() {
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
        <Card padding="md" className="mx-auto max-w-lg">
          <Card.Header
            start={
              <div>
                <h2 className="type-heading-4 leading-snug text-fg">Notification preferences</h2>
                <p className="type-supporting pt-1 text-muted">
                  Choose how WhatMatters reaches residents and staff.
                </p>
              </div>
            }
          />
          <Card.Body className="flex flex-col gap-4">
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
          </Card.Body>
          <Card.Footer className="flex flex-wrap justify-end gap-2">
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
  },
  parameters: storyCopySource(`
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
      <Card padding="md">
        {/* Switch rows + footer actions — see full story */}
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
`),
};
