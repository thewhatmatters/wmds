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
  title: "Components/Input",
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

**Pill** single-line text field. Optional label, **status validation** (not required asterisks). See **ADR-0006**.

| Pattern | Props |
|---------|--------|
| **With label** | \`label\`, optional \`description\` (the hint, above the field, kept with a status message) |
| **Hidden label** | \`aria-label\` — only for a field alone with its button (search, a one-field newsletter) |
| **Rich label** | \`label\` with inline markup (\`<strong>\`) — still the field's accessible name |
| **Validation** | \`status\` + \`message\` — tinted status band (\`messagePosition\` top or bottom) |
| **Status only** | \`status\` without \`message\` — border + trailing icon |
| **Loading** | \`loading\` — trailing spinner |
| **End badge** | \`endBadge={<Badge>Required</Badge>}\` — trailing inset inside the pill |
| **Monospace** | \`mono\` — \`type-code\` face for a read-only key or id |

## Best practices

- **Do** use \`status\` + \`message\` for validation feedback — not label asterisks.
- **Do** mark required fields with \`endBadge={<Badge size="sm">Required</Badge>}\` + native \`required\`.
- **Do** give every field a visible \`label\`. Hide it (\`aria-label\`) only when the field sits alone with its button.
- **Do** put examples and formats in \`description\`, not a placeholder. Placeholders belong to search fields only.
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
    "aria-label": "Location",
  },
};

export const WithLabel: Story = {
  name: "Pattern — with label",
  args: {
    label: "Email",
    type: "email",
    autoComplete: "email",
    description: "We'll never share your email.",
  },
};

export const RichLabel: Story = {
  name: "Pattern — rich label",
  args: {
    label: (
      <>
        Type <strong>@sarah-lee</strong> to confirm
      </>
    ),
    autoComplete: "off",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`label` takes inline markup. The whole label is the field's accessible name (\"Type @sarah-lee to confirm\"). Keep it to text, `<strong>`, and `<code>`.",
      },
    },
  },
};

export const ErrorMessage: Story = {
  name: "Pattern — error message",
  args: {
    label: "Email",
    defaultValue: "sarah@",
    status: "error",
    message: "Enter an email address like name@example.com.",
  },
};

export const HintWithError: Story = {
  name: "Pattern — hint with an error",
  args: {
    label: "Phone",
    type: "tel",
    autoComplete: "tel",
    description: "Include the area code, like 512 555 0134.",
    defaultValue: "555 0134",
    status: "error",
    message: "Enter a phone number with its area code.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The hint sits between the label and the field and stays when a message shows, so the example is still there while someone fixes the error. Examples and formats go here, never in a placeholder.",
      },
    },
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
    message: "Enter an email address like name@example.com.",
  },
};

export const Monospace: Story = {
  name: "Reference — monospace",
  args: {
    mono: true,
    readOnly: true,
    label: "API key",
    defaultValue: "wm_test_4f8c2a91e0b7",
  },
};

export const Disabled: Story = {
  name: "Pattern — disabled",
  args: {
    label: "Disabled field",
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
