import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, radioSizes, inputStatuses } from "./Radio";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

function RadioSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-md px-8 py-6">{children}</div>;
}

const meta = {
  title: "Components/Forms/Radio",
  component: Radio,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  decorators: [
    (Story) => (
      <RadioSpecimen>
        <Story />
      </RadioSpecimen>
    ),
  ],
  argTypes: {
    size: { control: "select", options: [...radioSizes] },
    status: { control: "select", options: [undefined, ...inputStatuses] },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    labelHidden: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Email alerts",
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

Single radio option — circle + label row. Prefer **RadioGroup** for mutually exclusive options.

| Pattern | When |
|---------|------|
| **Standalone** | Single radio with explicit \`name\` + \`checked\` |
| **Grouped** | **RadioGroup** + **RadioGroup.Item** — shared \`name\` and selection |

## Anatomy

- **Circle** — \`rounded-full\`; emphasized border → \`bg-primary\` + inner dot when selected
- **Label column** — same rhythm as **Checkbox** (\`ui-label\`, optional \`caption\` description)

## Best practices

- **Do** use **RadioGroup** for pick-one lists — not bare **Radio** siblings without shared context.
- **Do** keep validation \`status\` + \`message\` on **RadioGroup** for grouped fields.
- **Don't** mix **SegmentedControl** (connected track) with **RadioGroup** — different patterns.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {
  name: "Pattern — standalone",
  render: function StandaloneRadio() {
    const [value, setValue] = useState("email");
    return (
      <div className="flex flex-col gap-3">
        <Radio
          name="notify"
          value="email"
          label="Email"
          checked={value === "email"}
          onChange={() => setValue("email")}
        />
        <Radio
          name="notify"
          value="push"
          label="Push"
          checked={value === "push"}
          onChange={() => setValue("push")}
        />
      </div>
    );
  },
};

export const WithDescription: Story = {
  name: "Pattern — with description",
  render: function DescriptionRadio() {
    const [checked, setChecked] = useState(true);
    return (
      <Radio
        name="plan"
        value="pro"
        label="Pro plan"
        description="Unlimited projects and priority support."
        checked={checked}
        onChange={() => setChecked(true)}
      />
    );
  },
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: function SizeRadios() {
    const [value, setValue] = useState("md");
    return (
      <div className="flex flex-col gap-4">
        <Radio
          name="size-demo"
          value="sm"
          size="sm"
          label="Compact radio"
          checked={value === "sm"}
          onChange={() => setValue("sm")}
        />
        <Radio
          name="size-demo"
          value="md"
          label="Default radio"
          checked={value === "md"}
          onChange={() => setValue("md")}
        />
      </div>
    );
  },
};
