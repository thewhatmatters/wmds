import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "lucide-react";
import { Button } from "../Button/Button";
import { Badge, badgeVariants, type BadgeVariant } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: [...badgeVariants] },
    size: { control: "select", options: ["sm", "md"] },
    count: { control: "number" },
    icon: { control: false },
    children: { control: "text" },
  },
  args: {
    children: "Label",
    variant: "neutral",
    size: "sm",
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

**Three prescribed patterns** — pick one story, copy the code. Not a composable slot API.

| Pattern | Props |
|---------|--------|
| **Status label** | \`variant\` + label |
| **Count** | \`count\` + \`variant\` |
| **With icon** | \`icon\` (Lucide) + \`variant\` + label |

Solid semantic fills inspired by [Astryx Badge](https://astryx.atmeta.com/components/Badge). **Variants:** \`neutral\` (categories), \`info\`, \`success\`, \`warning\`, \`destructive\` (status). Maps Astryx \`error\` → **\`destructive\`**.

## Best practices

- **Do** badge states that need attention — errors, warnings, follow-up items.
- **Do** keep labels to one or two words; use surrounding text for detail.
- **Do** pair StatusDot **beside** a label in list rows — not inside Badge.
- **Don't** badge every healthy row — if all items show green "Active", none stand out.
- **Don't** use badges for metadata (dates, durations) — use supporting text.
- **Don't** make badges clickable — use Button or Link for actions.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusLabel: Story = {
  name: "Pattern — status label",
  args: {
    children: "Active",
    variant: "success",
  },
};

export const SemanticVariants: Story = {
  name: "All variants",
  parameters: {
    docs: {
      description: {
        story: "Solid semantic fills — status row from Astryx Badge.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(badgeVariants as readonly BadgeVariant[]).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant === "destructive" ? "Failed" : variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};

export const StatusLabels: Story = {
  name: "Status labels in context",
  parameters: {
    docs: {
      description: {
        story: "Show item state like Active, Pending, or Failed — in tables, lists, or detail pages.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">System status</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Workflow</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="info">In review</Badge>
        </div>
      </div>
    </div>
  ),
};

export const WithIcon: Story = {
  name: "Pattern — with icon",
  parameters: {
    docs: {
      description: {
        story: "Leading Lucide icon — same padding shell as the label pattern at each size.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="info" size="sm" icon={<Tag />}>
        Engineering
      </Badge>
      <Badge variant="info" size="md" icon={<Tag />}>
        Engineering
      </Badge>
    </div>
  ),
};

export const CountBadges: Story = {
  name: "Pattern — count",
  parameters: {
    docs: {
      description: {
        story: "Compact count pills for notifications, unread messages, or task totals.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {(
        [
          { variant: "info" as const, count: 3, note: "Messages" },
          { variant: "destructive" as const, count: 99, note: "Alerts" },
          { variant: "success" as const, count: 12, note: "Completed" },
          { variant: "warning" as const, count: 5, note: "Pending" },
        ] as const
      ).map(({ variant, count, note }) => (
        <div key={note} className="flex flex-col items-center gap-2">
          <Badge variant={variant} count={count} />
          <span className="text-xs text-muted">{note}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="info" size="sm">
        Small
      </Badge>
      <Badge variant="info" size="md">
        Medium
      </Badge>
      <Badge variant="success" size="sm" count={3} />
      <Badge variant="success" size="md" count={3} />
    </div>
  ),
};

export const InlineInProse: Story = {
  name: "Inline in prose",
  render: () => (
    <p className="max-w-sm text-sm leading-normal text-muted">
      Reorder status is{" "}
      <Badge variant="success">On track</Badge> with lead time{" "}
      <Badge variant="neutral">7 days</Badge>.
    </p>
  ),
};

export const OnButton: Story = {
  name: "On button (internal count)",
  parameters: {
    docs: {
      description: {
        story: "Button `count` prop — numeric trailing badge on action buttons only. Uses internal styling, not `Badge`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button role="secondary" count={3}>
        Inbox
      </Button>
      <Button role="primary">Updates</Button>
    </div>
  ),
};
