import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch, switchLayouts, switchSizes, inputStatuses } from "./Switch";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

function SwitchSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-md px-8 py-6">{children}</div>;
}

const meta = {
  title: "Components/Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  decorators: [
    (Story) => (
      <SwitchSpecimen>
        <Story />
      </SwitchSpecimen>
    ),
  ],
  argTypes: {
    size: { control: "select", options: [...switchSizes] },
    layout: { control: "select", options: [...switchLayouts] },
    status: { control: "select", options: [undefined, ...inputStatuses] },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    labelHidden: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: {
    label: "Enable notifications",
    size: "md",
    layout: "inline",
    disabled: false,
    loading: false,
    labelHidden: false,
    readOnly: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

Instant on/off — pill track + sliding thumb for settings and preferences.

| Pattern | Props |
|---------|--------|
| **Inline** | \`layout="inline"\` (default) — control leading, label trailing (Checkbox rhythm) |
| **Settings row** | \`layout="settings"\` — label + description left, switch trailing |
| **With description** | \`description\` — caption under label |
| **Hidden label** | \`labelHidden\` — table/toolbar row (label stays for SR) |
| **Validation** | \`status\` + \`message\` — flat band below row |
| **Loading** | \`loading\` — spinner on thumb while saving |

## Anatomy

- **Track** — off: recessed \`bg-body\` + \`shadow-hairline\`; on: \`bg-primary\` fill; **fast** CSS transition on fill
- **Thumb** — Motion slide on \`motionTransitionProp("fast")\` — same tier as **SegmentedControl** thumb
- **Label column** — \`ui-label\` + optional \`caption\` description
- **Hit target** — whole row clickable; focus ring on track

## Best practices

- **Do** use **Switch** for immediate settings — **Checkbox** for forms, consent, and multi-select lists.
- **Do** use \`layout="settings"\` in Card settings panels — label left, control right.
- **Do** use \`status\` + \`message\` for validation — not label asterisks.
- **Don't** use for mutually exclusive options — **RadioGroup** or **SegmentedControl**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Pattern — default",
  render: function DefaultSwitch(args) {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        {...args}
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Switch } from "@whatmatters/wmds";

function NotificationsSwitch() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      label="Enable notifications"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
`),
};

export const SettingsRow: Story = {
  name: "Pattern — settings row",
  render: function SettingsSwitch() {
    const [checked, setChecked] = useState(true);
    return (
      <Switch
        layout="settings"
        label="Weekly digest"
        description="A personalized summary sent every Monday morning."
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Switch } from "@whatmatters/wmds";

function WeeklyDigestSwitch() {
  const [checked, setChecked] = useState(true);
  return (
    <Switch
      layout="settings"
      label="Weekly digest"
      description="A personalized summary sent every Monday morning."
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
`),
};

export const WithDescription: Story = {
  name: "Pattern — inline with description",
  render: function DescriptionSwitch() {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        label="Marketing emails"
        description="Product updates and feature announcements."
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
};

export const HiddenLabel: Story = {
  name: "Pattern — hidden label",
  render: function HiddenLabelSwitch() {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        label="Toggle feature"
        labelHidden
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
};

export const ValidationError: Story = {
  name: "Pattern — validation error",
  render: function ErrorSwitch() {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        layout="settings"
        label="Accept data sharing"
        description="Required to use this feature."
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        status="error"
        message="You must enable data sharing to continue."
      />
    );
  },
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: function SizeSwitchRows() {
    const [sm, setSm] = useState(false);
    const [md, setMd] = useState(true);
    return (
      <div className="flex flex-col gap-4">
        <Switch
          label="Compact switch"
          size="sm"
          checked={sm}
          onChange={(event) => setSm(event.target.checked)}
        />
        <Switch
          label="Default switch"
          size="md"
          checked={md}
          onChange={(event) => setMd(event.target.checked)}
        />
      </div>
    );
  },
};

export const DisabledStates: Story = {
  name: "Reference — disabled",
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch
        layout="settings"
        label="Premium feature"
        description="Upgrade to enable."
        disabled
      />
      <Switch layout="settings" label="Feature enabled" checked disabled readOnly />
    </div>
  ),
};

export const Loading: Story = {
  name: "Reference — loading",
  args: {
    layout: "settings",
    label: "Saving preference…",
    loading: true,
    checked: true,
  },
};

export const SettingsPanelReference: Story = {
  name: "Reference — settings panel",
  render: function SettingsPanelReferenceExample() {
    const [notifications, setNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [autoSave, setAutoSave] = useState(false);

    return (
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-4 shadow-hairline">
        <div className="flex flex-col gap-4">
          <Switch
            layout="settings"
            label="Enable notifications"
            checked={notifications}
            onChange={(event) => setNotifications(event.target.checked)}
          />
          <Switch
            layout="settings"
            label="Dark mode"
            checked={darkMode}
            onChange={(event) => setDarkMode(event.target.checked)}
          />
          <Switch
            layout="settings"
            label="Auto-save"
            checked={autoSave}
            onChange={(event) => setAutoSave(event.target.checked)}
          />
        </div>
      </div>
    );
  },
};

export const SettingsList: Story = {
  name: "Example — settings list",
  render: function SettingsListExample() {
    const [values, setValues] = useState({
      digest: true,
      marketing: false,
      analytics: true,
    });

    return (
      <div className="flex w-full flex-col gap-4">
        <Switch
          layout="settings"
          label="Weekly digest"
          description="Summary email every Monday."
          checked={values.digest}
          onChange={(event) =>
            setValues((current) => ({ ...current, digest: event.target.checked }))
          }
        />
        <Switch
          layout="settings"
          label="Marketing emails"
          checked={values.marketing}
          onChange={(event) =>
            setValues((current) => ({ ...current, marketing: event.target.checked }))
          }
        />
        <Switch
          layout="settings"
          label="Usage analytics"
          description="Help improve WhatMatters with anonymous usage data."
          checked={values.analytics}
          onChange={(event) =>
            setValues((current) => ({ ...current, analytics: event.target.checked }))
          }
        />
      </div>
    );
  },
};
