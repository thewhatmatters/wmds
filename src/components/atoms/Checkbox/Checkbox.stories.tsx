import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, checkboxSizes, inputStatuses } from "./Checkbox";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

function CheckboxSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-md px-8 py-6">{children}</div>;
}

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  decorators: [
    (Story) => (
      <CheckboxSpecimen>
        <Story />
      </CheckboxSpecimen>
    ),
  ],
  argTypes: {
    size: { control: "select", options: [...checkboxSizes] },
    status: { control: "select", options: [undefined, ...inputStatuses] },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    labelHidden: { control: "boolean" },
    indeterminate: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: {
    label: "Accept terms and conditions",
    size: "md",
    disabled: false,
    loading: false,
    labelHidden: false,
    indeterminate: false,
    readOnly: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

[Astryx CheckboxInput](https://astryx.atmeta.com/components/CheckboxInput) — box + label row; optional description and status message below.

| Pattern | Props |
|---------|--------|
| **Default** | \`label\` + controlled/uncontrolled \`checked\` |
| **With description** | \`description\` — caption under label |
| **Indeterminate** | \`indeterminate\` — mixed / select-all parent |
| **Hidden label** | \`labelHidden\` — icon-only or table row (label stays for SR) |
| **Validation** | \`status\` + \`message\` — flat band below row |
| **Loading** | \`loading\` — spinner inside box |

## Anatomy

- **Box** — \`rounded\` / \`rounded-md\`; \`border-emphasized\` → \`bg-primary\` when checked
- **Label column** — \`ui-label\` + optional \`caption\` description
- **Hit target** — whole row is clickable; focus ring on box

## Best practices

- **Do** keep \`label\` text meaningful — use \`labelHidden\` only when context is obvious.
- **Do** use \`status\` + \`message\` for validation — not label asterisks.
- **Do** pair with **Field** / **CheckboxGroup** (planned) for grouped options.
- **Don't** restyle the box with \`className\` — layout width only on the row.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Pattern — default",
  render: function DefaultCheckbox(args) {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Checkbox } from "@whatmatters/wmds";

function TermsCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Accept terms and conditions"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
`),
};

export const WithDescription: Story = {
  name: "Pattern — with description",
  render: function DescriptionCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="Subscribe to newsletter"
        description="Receive weekly updates about new features and announcements."
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Checkbox } from "@whatmatters/wmds";

function NewsletterCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Subscribe to newsletter"
      description="Receive weekly updates about new features and announcements."
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
`),
};

export const Indeterminate: Story = {
  name: "Pattern — indeterminate",
  render: function IndeterminateCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="Select all items"
        description="Some items are selected."
        indeterminate={!checked}
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
};

export const HiddenLabel: Story = {
  name: "Pattern — hidden label",
  render: function HiddenLabelCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="Select row"
        labelHidden
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
};

export const ValidationError: Story = {
  name: "Pattern — validation error",
  render: function ErrorCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="Accept terms and conditions"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        status="error"
        message="You must accept the terms to continue."
      />
    );
  },
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: function SizeCheckboxRows() {
    const [sm, setSm] = useState(false);
    const [md, setMd] = useState(true);
    return (
      <div className="flex flex-col gap-4">
        <Checkbox
          label="Compact checkbox"
          size="sm"
          checked={sm}
          onChange={(event) => setSm(event.target.checked)}
        />
        <Checkbox
          label="Default checkbox"
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
      <Checkbox label="Premium feature" description="Upgrade to enable." disabled />
      <Checkbox label="Feature enabled" checked disabled readOnly />
    </div>
  ),
};

export const Loading: Story = {
  name: "Reference — loading",
  args: {
    label: "Saving preference…",
    loading: true,
    checked: true,
  },
};

export const CheckboxList: Story = {
  name: "Example — option list",
  render: function OptionList() {
    const [values, setValues] = useState({
      email: true,
      push: false,
      sms: false,
    });

    return (
      <fieldset className="flex w-full flex-col gap-3 border-0 p-0">
        <legend className="mb-1 font-sans text-sm font-medium text-fg">Alert type</legend>
        <Checkbox
          label="Email alerts"
          description="Quote and SEC filing notifications."
          checked={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.checked }))
          }
        />
        <Checkbox
          label="Push notifications"
          checked={values.push}
          onChange={(event) =>
            setValues((current) => ({ ...current, push: event.target.checked }))
          }
        />
        <Checkbox
          label="Weekly summary"
          checked={values.sms}
          onChange={(event) =>
            setValues((current) => ({ ...current, sms: event.target.checked }))
          }
        />
      </fieldset>
    );
  },
};
