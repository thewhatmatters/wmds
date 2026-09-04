import type { Meta, StoryObj } from "@storybook/react-vite";
import { Status, statusTones, statusVariants } from "./Status";

const meta = {
  title: "Atoms/Status",
  component: Status,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: [...statusVariants] },
    tone: { control: "select", options: [...statusTones] },
    active: { control: "boolean" },
    step: { control: "number" },
    pulsing: { control: "boolean" },
    besideLabel: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    variant: "ring",
    active: false,
    step: 2,
    besideLabel: true,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

One **Status** component — pick a **variant** for the indicator scale and pattern.

| Variant | Scale | Key props |
|---------|-------|-----------|
| **\`ring\`** | 24px | \`active\`, \`step\`, \`besideLabel\` / \`label\` |
| **\`dot\`** | 8px | \`tone\`, \`pulsing\`, \`besideLabel\` / \`label\` |

**StatusDot** on Astryx maps to \`variant="dot"\` here — one **Status** atom, not a separate export.

## Best practices

- **Do** use \`variant="ring"\` in **TaskRows** and disclosure leading slots (\`besideLabel\`).
- **Do** use \`variant="dot"\` + \`tone\` beside visible labels in list rows.
- **Do** provide \`label\` when the indicator is not beside descriptive text.
- **Don't** use \`variant="ring"\` for generic button loading — **ButtonSpinner** instead.
- **Don't** nest inside **Badge** — indicator + text beside each other.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RingPending: Story = {
  name: "Pattern — ring pending",
  args: {
    variant: "ring",
    step: 3,
    active: false,
    besideLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Static track + step number — queued task before execution starts.",
      },
    },
  },
};

export const RingRunning: Story = {
  name: "Pattern — ring running",
  args: {
    variant: "ring",
    step: 2,
    active: true,
    besideLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Spinning arc segment — active task step.",
      },
    },
  },
};

export const RingBesideLabel: Story = {
  name: "Pattern — ring beside label",
  parameters: {
    docs: {
      description: {
        story: "Typical **TaskRows** leading slot — ring is decorative; label text is the accessible name.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md items-center gap-2.5 px-4 py-2 font-sans text-fg">
      <Status variant="ring" step={2} active besideLabel />
      <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium">Build reorder task list</span>
      <span className="shrink-0 tabular-nums text-muted text-xs">7 SKUs</span>
    </div>
  ),
};

export const RingStandalone: Story = {
  name: "Pattern — ring standalone",
  args: {
    variant: "ring",
    step: 2,
    active: true,
    label: "Step 2 running",
  },
  parameters: {
    docs: {
      description: {
        story: "Ring without adjacent copy — `label` is required for screen readers and tooltip.",
      },
    },
  },
};

export const DotBesideLabel: Story = {
  name: "Pattern — dot beside label",
  args: {
    variant: "dot",
    tone: "success",
    besideLabel: true,
  },
  render: (args) => (
    <div className="flex items-center gap-2 font-sans text-fg">
      <Status {...args} />
      <span className="text-sm">Online</span>
    </div>
  ),
};

export const DotStandalone: Story = {
  name: "Pattern — dot standalone",
  args: {
    variant: "dot",
    tone: "warning",
    label: "Needs review",
  },
};

export const DotPulsing: Story = {
  name: "Pattern — dot pulsing",
  args: {
    variant: "dot",
    tone: "info",
    pulsing: true,
    besideLabel: true,
  },
  render: (args) => (
    <div className="flex items-center gap-2 font-sans text-fg">
      <Status {...args} />
      <span className="text-sm">Syncing</span>
    </div>
  ),
};

export const AllDotTones: Story = {
  name: "Example — dot tones",
  parameters: {
    docs: {
      description: {
        story: "Semantic fills for `variant=\"dot\"` — maps Astryx `error` → **destructive**.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4 font-sans text-fg">
      {statusTones.map((tone) => (
        <div key={tone} className="flex items-center gap-2">
          <Status variant="dot" tone={tone} besideLabel />
          <span className="text-sm capitalize">{tone}</span>
        </div>
      ))}
    </div>
  ),
};

export const RingStepSequence: Story = {
  name: "Example — ring step sequence",
  render: () => (
    <div className="flex items-center gap-6 font-sans text-fg">
      <div className="flex flex-col items-center gap-1">
        <Status variant="ring" step={1} besideLabel />
        <span className="text-xs text-muted">Pending</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Status variant="ring" step={2} active besideLabel />
        <span className="text-xs text-muted">Running</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Status variant="ring" step={3} besideLabel />
        <span className="text-xs text-muted">Queued</span>
      </div>
    </div>
  ),
};
