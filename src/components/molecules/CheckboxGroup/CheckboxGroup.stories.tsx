import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CheckboxGroup,
  checkboxGroupOrientations,
  checkboxSizes,
} from "./CheckboxGroup";
import { inputStatuses } from "../../atoms/Checkbox/Checkbox";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

function CheckboxGroupSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-md px-8 py-6">{children}</div>;
}

const meta = {
  title: "Molecules/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  decorators: [
    (Story) => (
      <CheckboxGroupSpecimen>
        <Story />
      </CheckboxGroupSpecimen>
    ),
  ],
  argTypes: {
    orientation: { control: "select", options: [...checkboxGroupOrientations] },
    size: { control: "select", options: [...checkboxSizes] },
    status: { control: "select", options: [undefined, ...inputStatuses] },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    labelHidden: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: false },
  },
  args: {
    label: "Alert type",
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

Multi-select option list — group label, shared validation, and optional \`values\` / \`onValuesChange\` when using **CheckboxGroup.Item**.

| Pattern | Props |
|---------|--------|
| **Vertical list** | \`orientation="vertical"\` (default) |
| **Horizontal row** | \`orientation="horizontal"\` — compact filters |
| **Managed selection** | \`values\` + \`onValuesChange\` + **CheckboxGroup.Item** |
| **Validation** | \`status\` + \`message\` on the group |

## Anatomy

- **Fieldset** — group \`label\` as \`legend\`
- **CheckboxGroup.Item** — composes **Checkbox** atom; toggles value in group array

## Best practices

- **Do** use for multi-select consent, filters, and alert preferences.
- **Do** put group-level validation on **CheckboxGroup**, not each item.
- **Don't** use for instant settings toggles — **Switch** \`layout="settings"\`.
- **Don't** use for pick-one — **RadioGroup** or **Select**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Pattern — default",
  render: function DefaultCheckboxGroup(args) {
    const [values, setValues] = useState(["email"]);
    return (
      <CheckboxGroup {...args} values={values} onValuesChange={setValues}>
        <CheckboxGroup.Item
          value="email"
          label="Email alerts"
          description="Quote and SEC filing notifications."
        />
        <CheckboxGroup.Item value="push" label="Push notifications" />
        <CheckboxGroup.Item value="weekly" label="Weekly summary" />
      </CheckboxGroup>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { CheckboxGroup } from "@whatmatters/wmds";

function AlertPreferences() {
  const [values, setValues] = useState(["email"]);
  return (
    <CheckboxGroup
      label="Alert type"
      values={values}
      onValuesChange={setValues}
    >
      <CheckboxGroup.Item value="email" label="Email alerts" />
      <CheckboxGroup.Item value="push" label="Push notifications" />
      <CheckboxGroup.Item value="weekly" label="Weekly summary" />
    </CheckboxGroup>
  );
}
`),
};

export const Horizontal: Story = {
  name: "Pattern — horizontal",
  render: function HorizontalCheckboxGroup() {
    const [values, setValues] = useState<string[]>([]);
    return (
      <CheckboxGroup
        label="Categories"
        orientation="horizontal"
        values={values}
        onValuesChange={setValues}
      >
        <CheckboxGroup.Item value="news" label="News" />
        <CheckboxGroup.Item value="sports" label="Sports" />
        <CheckboxGroup.Item value="finance" label="Finance" />
      </CheckboxGroup>
    );
  },
};

export const ValidationError: Story = {
  name: "Pattern — validation error",
  render: function ErrorCheckboxGroup() {
    const [values, setValues] = useState<string[]>([]);
    return (
      <CheckboxGroup
        label="Terms"
        description="Select all that apply."
        values={values}
        onValuesChange={setValues}
        status="error"
        message="Select at least one option."
      >
        <CheckboxGroup.Item value="terms" label="Accept terms of service" />
        <CheckboxGroup.Item value="privacy" label="Accept privacy policy" />
      </CheckboxGroup>
    );
  },
};

export const Disabled: Story = {
  name: "Reference — disabled",
  render: () => (
    <CheckboxGroup label="Premium filters" values={["a"]} onValuesChange={() => {}} disabled>
      <CheckboxGroup.Item value="a" label="Option A" />
      <CheckboxGroup.Item value="b" label="Option B" />
    </CheckboxGroup>
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: function SizeCheckboxGroups() {
    const [sm, setSm] = useState(["a"]);
    const [md, setMd] = useState(["a"]);
    return (
      <div className="flex flex-col gap-6">
        <CheckboxGroup label="Compact" size="sm" values={sm} onValuesChange={setSm}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup>
        <CheckboxGroup label="Default" size="md" values={md} onValuesChange={setMd}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup>
      </div>
    );
  },
};
