import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea, textareaResizes, inputStatuses } from "./TextArea";

function TextAreaSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-sm px-8 py-6">{children}</div>;
}

const meta = {
  title: "Atoms/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TextAreaSpecimen>
        <Story />
      </TextAreaSpecimen>
    ),
  ],
  argTypes: {
    status: { control: "select", options: [undefined, ...inputStatuses] },
    resize: { control: "select", options: [...textareaResizes] },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
    size: { control: false },
  },
  args: {
    placeholder: "Enter details…",
    size: "md",
    rows: 4,
    resize: "vertical",
    disabled: false,
    loading: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

**Element-radius** multiline field (\`rounded-xl\` / 12px), not pill. Same optional label and **status validation** as **Input** (ADR-0006).

| Pattern | Props |
|---------|--------|
| **Bare** | \`placeholder\` + \`aria-label\` |
| **With label** | \`label\`, optional \`description\` |
| **Validation** | \`status\` + \`message\` — tinted status band (\`messagePosition\` top or bottom) |
| **Status only** | \`status\` without \`message\` — border + top-trailing icon |
| **Loading** | \`loading\` — trailing spinner |
| **Resize** | \`resize="none" | "vertical" | "both"\` — default \`vertical\` |

## Anatomy

- **Shell** — \`rounded-xl\`, border + \`shadow-raised\`, shared focus ring tokens from \`inputShellStyles\`
- **Trailing** — status icon / spinner top-right (multiline inset)
- **Status band** — same compound validation morph as **Input**, overlap tuned for taller field

## Best practices

- **Do** use \`status\` + \`message\` for validation — not label asterisks.
- **Do** set \`aria-label\` when \`label\` is omitted.
- **Do** keep \`resize="vertical"\` unless layout must stay fixed height.
- **Don't** restyle the shell with \`className\` — layout width only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bare: Story = {
  name: "Pattern — bare",
  args: {
    placeholder: "Describe the issue…",
    "aria-label": "Issue description",
  },
};

export const WithLabel: Story = {
  name: "Pattern — with label",
  args: {
    label: "Notes",
    placeholder: "Add context for the team…",
    description: "Visible to admins on this market record.",
  },
};

export const ErrorMessage: Story = {
  name: "Pattern — error message",
  args: {
    label: "Bio",
    defaultValue: "Sarah is a designer based in",
    status: "error",
    message: "Bio must be at least 40 characters.",
  },
};

export const WarningMessage: Story = {
  name: "Pattern — warning message",
  args: {
    label: "Public description",
    defaultValue: "Farmers market every Sunday…",
    status: "warning",
    message: "Description is close to the 280-character limit.",
  },
};

export const SuccessMessage: Story = {
  name: "Pattern — success message",
  args: {
    label: "Instructions",
    defaultValue: "Park on Philomena St. and enter through the south gate.",
    status: "success",
    message: "Instructions saved.",
  },
};

export const StatusWithoutMessage: Story = {
  name: "Pattern — status without message",
  args: {
    label: "Feedback",
    defaultValue: "Too short",
    status: "error",
  },
};

export const Loading: Story = {
  name: "Pattern — loading",
  args: {
    label: "Review",
    defaultValue: "Checking spelling…",
    loading: true,
  },
};

export const Disabled: Story = {
  name: "Pattern — disabled",
  args: {
    label: "Archived notes",
    defaultValue: "Read-only record from 2024.",
    disabled: true,
    resize: "none",
  },
};

export const Sizes: Story = {
  name: "Reference — sizes",
  parameters: {
    docs: {
      description: {
        story: "`sm` | `md` | `lg` — same scale as **Input** / **Select** (`inputShellStyles`).",
      },
    },
  },
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <TextArea size="sm" label="Small" placeholder="Short note…" rows={3} />
      <TextArea size="md" label="Medium" placeholder="Default body copy…" rows={4} />
      <TextArea size="lg" label="Large" placeholder="Longer form copy…" rows={4} />
    </div>
  ),
};

export const ResizeNone: Story = {
  name: "Pattern — fixed height",
  args: {
    label: "Fixed height",
    placeholder: "Resize disabled for dashboard tiles.",
    resize: "none",
    rows: 5,
  },
};
