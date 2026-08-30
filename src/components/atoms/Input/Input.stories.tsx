import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin, Search } from "lucide-react";
import { Badge } from "../Badge/Badge";
import { Input, inputShapes, inputSizes, inputStatuses } from "./Input";
import { InputValidationMorphDemo } from "./InputValidationMorph";

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: [...inputSizes] },
    shape: { control: "select", options: [...inputShapes] },
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
    shape: "rounded",
    disabled: false,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

[Astryx Text Input](https://astryx.atmeta.com/components/TextInput) patterns — optional label, **status validation** (not required asterisks). See **ADR-0006**.

| Pattern | Props |
|---------|--------|
| **Bare** | \`placeholder\` + \`aria-label\` — Find pill, toolbar search |
| **With label** | \`label\`, optional \`description\` |
| **Validation** | \`status\` + \`message\` — [Astryx ChatComposer](https://astryx.atmeta.com/components/ChatComposer) compound: elevated field + tinted status band (\`messagePosition\` \`top\` \| \`bottom\`) |
| **Status only** | \`status\` without \`message\` — border + trailing icon ([Astryx Text Input](https://astryx.atmeta.com/components/TextInput)) |
| **Loading** | \`loading\` — trailing spinner |
| **End badge** | \`endBadge={<Badge>Required</Badge>}\` — trailing inset inside shell |
| **With icon** | \`icon\` (Lucide, leading) |

**Shape:** \`rounded\` (default, Astryx forms) | \`pill\` (standalone search or capsule validation — see **All validation states — pill**)

**Sizes:** \`sm\` | \`md\` (default, 44px) | \`lg\`

## Best practices

- **Do** use \`status\` + \`message\` for validation feedback — not label asterisks.
- **Do** mark required fields with \`endBadge={<Badge size="sm">Required</Badge>}\` + native \`required\`.
- **Do** use bare \`Input\` when placeholder + context is enough (FM ZIP field).
- **Do** set \`aria-label\` when \`label\` is omitted.
- **Don't** use generic slots — \`icon\` prop only.
- **Don't** use \`className\` for radius — use \`shape\`. FM hero search with inset button → **Search** molecule.
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

export const PillShape: Story = {
  name: "Shape — pill",
  args: {
    shape: "pill",
    placeholder: "ZIP or city",
    "aria-label": "Location",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Standalone pill shell — for inset-button hero search use **Molecules/Search** instead.",
      },
    },
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
    shape: "pill",
    label: "Error message",
    defaultValue: "sarah@",
    status: "error",
    message: "Please enter a valid email address.",
  },
};

export const WarningMessage: Story = {
  name: "Pattern — warning message",
  args: {
    shape: "pill",
    label: "Warning message",
    defaultValue: "sarah_chen",
    status: "warning",
    message: "This username is already taken — try adding a number.",
  },
};

export const SuccessMessage: Story = {
  name: "Pattern — success message",
  args: {
    shape: "pill",
    label: "Success message",
    defaultValue: "https://sarahchen.dev",
    status: "success",
    message: "URL is valid and reachable.",
  },
};

export const StatusWithoutMessage: Story = {
  name: "Pattern — status without message",
  args: {
    shape: "pill",
    label: "Status without message",
    defaultValue: "test",
    status: "error",
  },
};

export const Loading: Story = {
  name: "Pattern — loading",
  args: {
    label: "Loading field",
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
  name: "End badge + validation",
  args: {
    shape: "pill",
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
  name: "With search icon",
  args: {
    placeholder: "Search markets",
    "aria-label": "Search markets",
    icon: <Search strokeWidth={2} />,
  },
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
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
  name: "All validation states — pill",
  parameters: {
    docs: {
      description: {
        story:
          "With `message` — field keeps **full border radius** (same as status-only); tinted band overlaps underneath ([Astryx ChatComposer](https://astryx.atmeta.com/components/ChatComposer)). Status-only — border + trailing icon.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Input
        shape="pill"
        label="Error message"
        defaultValue="sarah@"
        status="error"
        message="Please enter a valid email address."
      />
      <Input
        shape="pill"
        label="Warning message"
        defaultValue="sarah_chen"
        status="warning"
        message="This username is already taken — try adding a number."
      />
      <Input
        shape="pill"
        label="Success message"
        defaultValue="https://sarahchen.dev"
        status="success"
        message="URL is valid and reachable."
      />
      <Input
        shape="pill"
        label="Error message (top band)"
        defaultValue="sarah@"
        status="error"
        message="Failed to send message. Please try again."
        messagePosition="top"
      />
      <Input shape="pill" label="Status without message" defaultValue="test" status="error" />
      <Input shape="pill" label="Disabled field" placeholder="Enter a value" disabled />
      <Input shape="pill" label="Loading field" defaultValue="sarahc" loading />
    </div>
  ),
};

export const RoundedValidationStates: Story = {
  name: "All validation states — rounded",
  parameters: {
    docs: {
      description: {
        story:
          "Default `shape=\"rounded\"` — same ChatComposer compound when `message` is set; Text Input border pattern when status-only.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
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
