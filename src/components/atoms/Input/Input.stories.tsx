import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin, Search } from "lucide-react";
import { Badge } from "../Badge/Badge";
import { Input, inputSizes, inputStatuses } from "./Input";
import { InputValidationMorphDemo } from "./InputValidationMorph";

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm px-4 py-3">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: "select", options: [...inputSizes] },
    status: { control: "select", options: [undefined, ...inputStatuses] },
    icon: { control: false },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    endBadge: { control: false },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    placeholder: "Enter text",
    size: "md",
    disabled: false,
    loading: false,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Usage

[Astryx Text Input](https://astryx.atmeta.com/components/TextInput) patterns — **pill** shell, optional label, **status validation** (not required asterisks). See **ADR-0006**.

| Pattern | Props |
|---------|--------|
| **Bare** | \`placeholder\` + \`aria-label\` — Find pill, toolbar search |
| **With label** | \`label\`, optional \`description\` |
| **Validation** | \`status\` + \`message\` — [Astryx ChatComposer](https://astryx.atmeta.com/components/ChatComposer) compound: elevated field + tinted status band (\`messagePosition\` top or bottom) |
| **Status only** | \`status\` without \`message\` — border + trailing icon |
| **Loading** | \`loading\` — trailing spinner |
| **End badge** | \`endBadge={<Badge>Required</Badge>}\` — trailing inset inside shell |
| **With icon** | \`icon\` (Lucide, leading) |

**Sizes:** \`sm\` | \`md\` (default, 44px) | \`lg\`

## Best practices

- **Do** use \`status\` + \`message\` for validation feedback — not label asterisks.
- **Do** mark required fields with \`endBadge={<Badge size="sm">Required</Badge>}\` + native \`required\`.
- **Do** use bare \`Input\` when placeholder + context is enough (FM ZIP field).
- **Do** set \`aria-label\` when \`label\` is omitted.
- **Don't** use generic slots — \`icon\` prop only.
- **Don't** restyle the shell with \`className\` — FM hero search with inset button → **Search** molecule.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bare: Story = {
  name: "Pattern — bare",
  args: {
    placeholder: "ZIP or city",
    "aria-label": "Location",
  },
};

export const WithLabel: Story = {
  name: "Pattern — with label",
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    description: "We'll never share your email.",
  },
};

export const ErrorMessage: Story = {
  name: "Pattern — error message",
  args: {
    label: "Email",
    defaultValue: "sarah@",
    status: "error",
    message: "Please enter a valid email address.",
  },
};

export const WarningMessage: Story = {
  name: "Pattern — warning message",
  args: {
    label: "Username",
    defaultValue: "sarah_chen",
    status: "warning",
    message: "This username is already taken — try adding a number.",
  },
};

export const SuccessMessage: Story = {
  name: "Pattern — success message",
  args: {
    label: "Website",
    defaultValue: "https://sarahchen.dev",
    status: "success",
    message: "URL is valid and reachable.",
  },
};

export const StatusWithoutMessage: Story = {
  name: "Pattern — status without message",
  args: {
    label: "ZIP",
    defaultValue: "test",
    status: "error",
  },
};

export const Loading: Story = {
  name: "Pattern — loading",
  args: {
    label: "Username",
    defaultValue: "sarahc",
    loading: true,
  },
};

export const RequiredEndBadge: Story = {
  name: "Pattern — required (end badge)",
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
    endBadge: <Badge size="sm">Required</Badge>,
  },
};

export const EndBadgeWithError: Story = {
  name: "Pattern — end badge + validation",
  args: {
    label: "Email",
    defaultValue: "sarah@",
    required: true,
    endBadge: <Badge size="sm">Required</Badge>,
    status: "error",
    message: "Please enter a valid email address.",
  },
};

export const WithIcon: Story = {
  name: "Pattern — with icon",
  args: {
    placeholder: "ZIP or city",
    "aria-label": "Location",
    icon: <MapPin strokeWidth={2} />,
  },
};

export const SearchIcon: Story = {
  name: "Pattern — search icon",
  args: {
    placeholder: "Search markets",
    "aria-label": "Search markets",
    icon: <Search strokeWidth={2} />,
  },
};

export const Sizes: Story = {
  name: "Pattern — sizes",
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Input size="sm" placeholder="Small" aria-label="Small input" />
      <Input size="md" placeholder="Medium" aria-label="Medium input" />
      <Input size="lg" placeholder="Large" aria-label="Large input" />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Pattern — disabled",
  args: {
    label: "Disabled field",
    placeholder: "Enter a value",
    disabled: true,
  },
};

export const ValidationStates: Story = {
  name: "Pattern — validation gallery",
  parameters: {
    docs: {
      description: {
        story:
          "With `message` — field keeps **full pill radius**; tinted band overlaps underneath ([Astryx ChatComposer](https://astryx.atmeta.com/components/ChatComposer)). Status-only — border + trailing icon.",
      },
    },
  },
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <Input
        label="Error message"
        defaultValue="sarah@"
        status="error"
        message="Please enter a valid email address."
      />
      <Input
        label="Warning message"
        defaultValue="sarah_chen"
        status="warning"
        message="This username is already taken — try adding a number."
      />
      <Input
        label="Success message"
        defaultValue="https://sarahchen.dev"
        status="success"
        message="URL is valid and reachable."
      />
      <Input
        label="Error message (top band)"
        defaultValue="sarah@"
        status="error"
        message="Failed to send message. Please try again."
        messagePosition="top"
      />
      <Input label="Status without message" defaultValue="test" status="error" />
      <Input label="Disabled field" placeholder="Enter a value" disabled />
      <Input label="Loading field" defaultValue="sarahc" loading />
    </div>
  ),
};

export const ValidationMotion: Story = {
  name: "Pattern — validation motion",
  parameters: {
    docs: {
      description: {
        story:
          "Interactive morph — neutral pill → error status band springs in underneath ([Astryx ChatComposer](https://astryx.atmeta.com/components/ChatComposer) joint). Blur with invalid email, or use **Show error** / **Clear validation**.",
      },
    },
  },
  render: () => <InputValidationMorphDemo />,
};
