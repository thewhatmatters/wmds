import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Badge, type BadgeVariant } from "./Badge";

const semanticVariants: BadgeVariant[] = [
  "neutral",
  "info",
  "success",
  "warning",
  "destructive",
];

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: semanticVariants },
    size: { control: "select", options: ["sm", "md"] },
    appearance: { control: "select", options: ["label", "count"] },
    label: { control: "text" },
    children: { control: false },
  },
  args: {
    label: "Badge",
    variant: "neutral",
    size: "sm",
    appearance: "label",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Short status, count, or category label — inspired by [Astryx Badge](https://astryx.atmeta.com/components/Badge). " +
          "WMDS ships **semantic variants** only (`neutral`, `info`, `success`, `warning`, `destructive`); decorative palette tags (blue, purple, …) are intentionally omitted. " +
          "Use `appearance=\"count\"` for numeric pills.",
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SemanticVariants: Story = {
  name: "Semantic variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Error</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Maps Astryx semantic variants; `destructive` replaces Astryx `error`.",
      },
    },
  },
};

export const StatusLabels: Story = {
  name: "Status labels",
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
  parameters: {
    docs: {
      description: {
        story: "Grouped status labels — mirrors Astryx status-labels example.",
      },
    },
  },
};

export const CountBadges: Story = {
  name: "Count badges",
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {(
        [
          { variant: "info" as const, label: "3", note: "Messages" },
          { variant: "destructive" as const, label: "99+", note: "Alerts" },
          { variant: "success" as const, label: "12", note: "Completed" },
          { variant: "warning" as const, label: "5", note: "Pending" },
        ] as const
      ).map(({ variant, label, note }) => (
        <div key={note} className="flex flex-col items-center gap-2">
          <Badge variant={variant} appearance="count">
            {label}
          </Badge>
          <span className="text-xs text-muted">{note}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Compact count pills with tabular numerals — mirrors Astryx count-badges example.",
      },
    },
  },
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
      <Badge variant="success" size="sm" appearance="count">
        3
      </Badge>
      <Badge variant="success" size="md" appearance="count">
        3
      </Badge>
    </div>
  ),
};

export const OnButton: Story = {
  name: "On button (end slot)",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" badge={3}>
        Inbox
      </Button>
      <Button variant="primary" badge="New">
        Updates
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Button `badge` shorthand delegates to `Badge` with contextual styling on colored surfaces.",
      },
    },
  },
};
