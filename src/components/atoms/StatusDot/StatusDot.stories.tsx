import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot, statusDotVariants, type StatusDotVariant } from "./StatusDot";

const meta = {
  title: "Atoms/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: [...statusDotVariants] },
    pulsing: { control: "boolean" },
    besideLabel: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    variant: "success",
    label: "Online",
    pulsing: false,
    besideLabel: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

**Two prescribed patterns** — pick one story, copy the code.

| Pattern | Props |
|---------|--------|
| **Standalone** | \`variant\` + \`label\` (screen reader + tooltip) |
| **Beside label** | \`variant\` + \`besideLabel\` + visible text sibling |
| **Live** | either pattern + \`pulsing\` |

Fixed **8px** diameter. Five semantic variants. Inspired by [Astryx StatusDot](https://astryx.atmeta.com/components/StatusDot). Maps Astryx \`error\` → **\`destructive\`**, \`accent\` → **\`info\`**.

## Best practices

- **Do** pair with visible text in list rows — use \`besideLabel\`.
- **Do** provide \`label\` when the dot stands alone.
- **Do** use \`pulsing\` only for live, processing, or urgent states.
- **Don't** nest inside Badge — dot + text beside each other instead.
- **Don't** rely on color alone — adjacent text or \`label\` carries meaning.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {
  name: "Pattern — standalone",
  parameters: {
    docs: {
      description: {
        story: "Dot alone — `label` is required for screen readers and native tooltip.",
      },
    },
  },
  args: {
    variant: "success",
    label: "Online",
    besideLabel: false,
  },
};

export const BesideLabel: Story = {
  name: "Pattern — beside label",
  parameters: {
    docs: {
      description: {
        story: "Visible text beside the dot is the accessible name — dot is aria-hidden.",
      },
    },
  },
  render: () => (
    <span className="inline-flex items-center gap-1.5 text-sm text-fg">
      <StatusDot variant="success" besideLabel />
      Online
    </span>
  ),
};

export const LivePulsing: Story = {
  name: "Pattern — live (pulsing)",
  parameters: {
    docs: {
      description: {
        story: "Pulsing animation for live, processing, or error attention states.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <span className="inline-flex items-center gap-1.5 text-sm">
        <StatusDot variant="success" besideLabel pulsing />
        Live
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm">
        <StatusDot variant="info" besideLabel pulsing />
        Processing
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm">
        <StatusDot variant="destructive" besideLabel pulsing />
        Error
      </span>
    </div>
  ),
};

export const Variants: Story = {
  name: "All variants",
  parameters: {
    docs: {
      description: {
        story: "All five semantic color variants — standalone pattern with labels.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(statusDotVariants as readonly StatusDotVariant[]).map((variant) => (
        <StatusDot key={variant} variant={variant} label={variant} />
      ))}
    </div>
  ),
};

export const LabeledList: Story = {
  name: "List row",
  parameters: {
    docs: {
      description: {
        story: "Presence list — `besideLabel` + visible text in each row.",
      },
    },
  },
  render: () => (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {(
        [
          { variant: "success", label: "Online" },
          { variant: "warning", label: "Away" },
          { variant: "neutral", label: "Offline" },
        ] as const
      ).map(({ variant, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5 text-sm">
          <StatusDot variant={variant} besideLabel />
          {label}
        </li>
      ))}
    </ul>
  ),
};
