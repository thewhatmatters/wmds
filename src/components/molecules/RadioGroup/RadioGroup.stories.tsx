import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  RadioGroup,
  radioGroupOrientations,
  radioSizes,
} from "./RadioGroup";
import { inputStatuses } from "../../atoms/Radio/Radio";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

function RadioGroupSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-md px-8 py-6">{children}</div>;
}

const meta = {
  title: "Molecules/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  decorators: [
    (Story) => (
      <RadioGroupSpecimen>
        <Story />
      </RadioGroupSpecimen>
    ),
  ],
  argTypes: {
    orientation: { control: "select", options: [...radioGroupOrientations] },
    size: { control: "select", options: [...radioSizes] },
    status: { control: "select", options: [undefined, ...inputStatuses] },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    labelHidden: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: false },
  },
  args: {
    label: "Notification preference",
    orientation: "vertical",
    size: "md",
    disabled: false,
    labelHidden: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

[Astryx RadioList](https://astryx.atmeta.com/components/RadioList) — mutually exclusive options with optional group label, description, and validation band.

| Pattern | Props |
|---------|--------|
| **Vertical list** | \`orientation="vertical"\` (default) |
| **Horizontal row** | \`orientation="horizontal"\` — size toggles, compact filters |
| **Validation** | \`status\` + \`message\` on the group |
| **Item description** | **RadioGroup.Item** \`description\` — per-option helper |

## Anatomy

- **Fieldset** — group \`label\` as \`legend\`; \`role="radiogroup"\` on item track
- **RadioGroup.Item** — composes **Radio** atom; shared \`name\` from context

## Best practices

- **Do** use for 2–5 visible options — larger sets → **Select**.
- **Do** put group-level validation on **RadioGroup**, not each item.
- **Don't** use for binary view switching — **SegmentedControl** owns connected tracks.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Pattern — vertical",
  render: function VerticalRadioGroup(args) {
    const [value, setValue] = useState("email");
    return (
      <RadioGroup {...args} value={value} onValueChange={setValue}>
        <RadioGroup.Item value="email" label="Email" />
        <RadioGroup.Item value="push" label="Push notifications" />
        <RadioGroup.Item value="sms" label="SMS" />
      </RadioGroup>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { RadioGroup } from "@whatmatters/wmds";

function NotificationPreference() {
  const [value, setValue] = useState("email");
  return (
    <RadioGroup
      label="Notification preference"
      value={value}
      onValueChange={setValue}
    >
      <RadioGroup.Item value="email" label="Email" />
      <RadioGroup.Item value="push" label="Push notifications" />
      <RadioGroup.Item value="sms" label="SMS" />
    </RadioGroup>
  );
}
`),
};

export const WithDescription: Story = {
  name: "Pattern — group + item descriptions",
  render: function DescribedRadioGroup() {
    const [value, setValue] = useState("email");
    return (
      <RadioGroup
        label="Notification preference"
        description="Choose how you would like to be notified."
        value={value}
        onValueChange={setValue}
      >
        <RadioGroup.Item
          value="email"
          label="Email"
          description="Quote and SEC filing notifications."
        />
        <RadioGroup.Item value="push" label="Push notifications" />
        <RadioGroup.Item value="sms" label="SMS" />
      </RadioGroup>
    );
  },
};

export const Horizontal: Story = {
  name: "Pattern — horizontal",
  render: function HorizontalRadioGroup() {
    const [value, setValue] = useState("md");
    return (
      <RadioGroup label="Size" orientation="horizontal" value={value} onValueChange={setValue}>
        <RadioGroup.Item value="sm" label="Small" />
        <RadioGroup.Item value="md" label="Medium" />
        <RadioGroup.Item value="lg" label="Large" />
      </RadioGroup>
    );
  },
};

export const ValidationError: Story = {
  name: "Pattern — validation error",
  render: function ErrorRadioGroup() {
    const [value, setValue] = useState("");
    return (
      <RadioGroup
        label="Notification preference"
        value={value}
        onValueChange={setValue}
        status="error"
        message="Please select a notification method."
      >
        <RadioGroup.Item value="email" label="Email" />
        <RadioGroup.Item value="push" label="Push notifications" />
      </RadioGroup>
    );
  },
};

export const Disabled: Story = {
  name: "Reference — disabled group",
  render: () => (
    <RadioGroup label="Notification preference" value="email" onValueChange={() => undefined} disabled>
      <RadioGroup.Item value="email" label="Email" />
      <RadioGroup.Item value="push" label="Push notifications" />
    </RadioGroup>
  ),
};

export const DisabledItem: Story = {
  name: "Reference — disabled item",
  render: function DisabledItemGroup() {
    const [value, setValue] = useState("email");
    return (
      <RadioGroup label="Notification preference" value={value} onValueChange={setValue}>
        <RadioGroup.Item value="email" label="Email" />
        <RadioGroup.Item value="push" label="Push notifications" disabled />
        <RadioGroup.Item value="sms" label="SMS" />
      </RadioGroup>
    );
  },
};
