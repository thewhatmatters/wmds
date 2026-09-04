import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge/Badge";
import { Input, inputStatuses } from "./Input";
import { InputValidationMorphDemo } from "./InputValidationMorph";

/** Keeps docs canvases from stretching the pill edge-to-edge. */
function InputSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-sm px-8 py-6">{children}</div>;
}

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <InputSpecimen>
        <Story />
      </InputSpecimen>
    ),
  ],
  argTypes: {
    status: { control: "select", options: [undefined, ...inputStatuses] },
    icon: { control: false },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    endBadge: { control: false },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    size: { control: false },
  },
  args: {
    placeholder: "Enter text",
    size: "md",
    disabled: false,
    loading: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

[Astryx Text Input](https://astryx.atmeta.com/components/TextInput) — **pill** shell only. Optional label, **status validation** (not required asterisks). See **ADR-0006**.

| Pattern | Props |
|---------|--------|
| **Bare** | \`placeholder\` + \`aria-label\` — Find pill, toolbar search |
| **With label** | \`label\`, optional \`description\` |
| **Validation** | \`status\` + \`message\` — tinted status band (\`messagePosition\` top or bottom) |
| **Status only** | \`status\` without \`message\` — border + trailing icon |
| **Loading** | \`loading\` — trailing spinner |
| **End badge** | \`endBadge={<Badge>Required</Badge>}\` — trailing inset inside the pill |

## Best practices

- **Do** use \`status\` + \`message\` for validation feedback — not label asterisks.
- **Do** mark required fields with \`endBadge={<Badge size="sm">Required</Badge>}\` + native \`required\`.
- **Do** use bare \`Input\` when placeholder + context is enough (ZIP or search field).
- **Do** set \`aria-label\` when \`label\` is omitted.
- **Don't** restyle the shell with \`className\` — hero search with inset button → **Search** molecule.
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

export const Disabled: Story = {
  name: "Pattern — disabled",
  args: {
    label: "Disabled field",
    placeholder: "Enter a value",
    disabled: true,
  },
};

export const ValidationMotion: Story = {
  name: "Pattern — validation motion",
  parameters: {
    docs: {
      description: {
        story:
          "Interactive morph — neutral pill → error status band springs in underneath. Blur with invalid email, or use **Show error** / **Clear validation**.",
      },
    },
  },
  render: () => <InputValidationMorphDemo />,
};
