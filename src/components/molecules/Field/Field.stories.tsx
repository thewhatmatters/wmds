import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin } from "lucide-react";
import { Input } from "../../atoms/Input/Input";
import { TextArea } from "../../atoms/TextArea/TextArea";
import { Search } from "../Search/Search";
import { Select } from "../Select/Select";
import { Field, fieldOrientations } from "./Field";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

function FieldSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-md px-8 py-6">{children}</div>;
}

const meta = {
  title: "Molecules/Field",
  component: Field,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  decorators: [
    (Story) => (
      <FieldSpecimen>
        <Story />
      </FieldSpecimen>
    ),
  ],
  argTypes: {
    orientation: { control: "select", options: [...fieldOrientations] },
    label: { control: "text" },
    description: { control: "text" },
    disabled: { control: "boolean" },
    children: { control: false },
  },
  args: {
    label: "ZIP code",
    description: "Used to locate your market.",
    orientation: "horizontal",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

**Layout molecule**, not a text control (ADR-0006). Wrap **Input**, **TextArea**, **Select**, or **Search** when orientation or shared label context is clearer than props on the control.

| Pattern | When |
|---------|------|
| **Vertical + single control** | Prefer **\`Input label\`** for simple stacks — **Field** optional |
| **Horizontal** | \`orientation="horizontal"\` — label beside control (settings rows, compact forms) |
| **Multi-control** | One label for several controls (date range, address rows) |
| **Validation** | Keep \`status\` + \`message\` on **Input** / **TextArea** — not on **Field** |

## Anatomy

- **Label** — \`typographyClass("ui-label")\`; wires \`htmlFor\` to a single child automatically
- **Description** — \`typographyClass("caption")\` below control(s)
- **Control slot** — bare child — omit child \`label\` when **Field** owns it

## Best practices

- **Do** use **Field** for horizontal label beside control.
- **Do** use bare children with **Field** \`label\` — not both **Field** and **Input** \`label\`.
- **Do** keep validation on the atom (\`status\`, \`message\`, \`loading\`).
- **Don't** require **Field** for every labeled input — **Input label** is fine for vertical forms.
- **Don't** put \`error\` on **Field** — use **Input** status band.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HorizontalInput: Story = {
  name: "Pattern — horizontal input",
  render: (args) => (
    <Field {...args} label="ZIP code" description="5-digit US ZIP.">
      <Input placeholder="97201" aria-label="ZIP code" />
    </Field>
  ),
  parameters: storyCopySource(`
import { Field, Input } from "@whatmatters/wmds";

<Field label="ZIP code" description="5-digit US ZIP." orientation="horizontal">
  <Input placeholder="97201" aria-label="ZIP code" />
</Field>
`),
};

export const HorizontalTextArea: Story = {
  name: "Pattern — horizontal textarea",
  render: () => (
    <Field
      label="Notes"
      description="Visible to admins only."
      orientation="horizontal"
    >
      <TextArea placeholder="Add context…" aria-label="Notes" rows={3} />
    </Field>
  ),
  parameters: storyCopySource(`
import { Field, TextArea } from "@whatmatters/wmds";

<Field label="Notes" description="Visible to admins only." orientation="horizontal">
  <TextArea placeholder="Add context…" aria-label="Notes" rows={3} />
</Field>
`),
};

export const MultiControl: Story = {
  name: "Pattern — multi-control",
  render: () => (
    <Field label="Location" description="City or ZIP — search updates the map.">
      <Search placeholder="ZIP or city" aria-label="Location" actionLabel="GO" />
      <Input placeholder="Unit / suite (optional)" aria-label="Unit or suite" />
    </Field>
  ),
  parameters: storyCopySource(`
import { Field, Input, Search } from "@whatmatters/wmds";

<Field label="Location" description="City or ZIP — search updates the map.">
  <Search placeholder="ZIP or city" aria-label="Location" actionLabel="GO" />
  <Input placeholder="Unit / suite (optional)" aria-label="Unit or suite" />
</Field>
`),
};

export const WithValidation: Story = {
  name: "Pattern — validation on Input",
  render: () => (
    <Field label="Email" orientation="horizontal">
      <Input
        type="email"
        defaultValue="not-an-email"
        aria-label="Email"
        status="error"
        message="Enter a valid email address."
      />
    </Field>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Validation chrome stays on **Input** — **Field** only adjusts label placement.",
      },
    },
  },
};

export const HorizontalSelect: Story = {
  name: "Pattern — horizontal select",
  render: () => (
    <Field label="Reporting period" orientation="horizontal">
      <Select
        aria-label="Reporting period"
        defaultValue="30d"
        options={[
          { value: "7d", label: "Last 7 days" },
          { value: "30d", label: "Last 30 days" },
          { value: "90d", label: "Last 90 days" },
        ]}
      />
    </Field>
  ),
};

export const CompareVertical: Story = {
  name: "Reference — Input label vs Field",
  parameters: {
    docs: {
      description: {
        story:
          "Simple vertical forms — **Input label** (left) is enough. **Field** (right) duplicates layout unless you need the wrapper for composition.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Input
        label="Email"
        description="We'll never share this."
        placeholder="you@example.com"
      />
      <Field label="Email" description="We'll never share this.">
        <Input placeholder="you@example.com" aria-label="Email" />
      </Field>
    </div>
  ),
};

export const HorizontalForm: Story = {
  name: "Example — horizontal form rows",
  render: () => (
    <form className="flex flex-col gap-5">
      <Field label="First name" orientation="horizontal">
        <Input placeholder="Jane" aria-label="First name" />
      </Field>
      <Field label="Last name" orientation="horizontal">
        <Input placeholder="Diaz" aria-label="Last name" />
      </Field>
      <Field label="Work email" orientation="horizontal">
        <Input type="email" placeholder="you@company.com" aria-label="Work email" />
      </Field>
      <Field
        label="Location"
        description="ZIP or city for market lookup."
        orientation="horizontal"
      >
        <Input placeholder="ZIP or city" aria-label="Location" icon={<MapPin strokeWidth={2} />} />
      </Field>
    </form>
  ),
};
