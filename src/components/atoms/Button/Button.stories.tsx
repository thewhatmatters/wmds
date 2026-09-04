import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, buttonLayouts, buttonRoles, getNextButtonStatus, type ButtonStatus } from "./Button";
import { typographyClass } from "../../../lib/typography";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    role: { control: "select", options: [...buttonRoles] },
    layout: { control: "select", options: [...buttonLayouts] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    status: { control: "select", options: ["idle", "loading", "success", "error"] },
    count: { control: "number" },
    disableOnError: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: { control: false },
    onClick: { action: "clicked" },
  },
  args: {
    children: "Label",
    role: "primary",
    size: "md",
    disabled: false,
  },
  parameters: {
    docs: {
      ...storyMetaDocsDefaults().docs,
      description: {
        component: `
## Usage

**Four prescribed patterns** — pick one story, copy the code. Not a composable slot API.

| Pattern | Props |
|---------|--------|
| **Action** | \`role\` + label |
| **Row** | \`layout="row"\` + \`role="ghost"\` — flat full-width detail / settings lines |
| **With icon** | \`icon\` (Lucide) + \`role\` |
| **With count** | \`count\` + \`role\` (inbox / notifications) |
| **Submit / async** | \`status\` + optional \`statusLabels\` |

Pill-shaped by default (\`layout="pill"\`). **Row layout** is flat full-width — for TaskRows detail lines and settings rows. **Roles:** \`primary\` (main CTA), \`secondary\`, \`ghost\`, \`destructive\`. No semantic color variants — success/error live on \`status\` morph only.

## Best practices

- **Do** copy a named story below — don't mix \`status\` with \`icon\` or \`count\`.
- **Do** use \`status\` for form submit and async feedback.
- **Do** use \`count\` only for numeric notification badges on nav actions.
- **Don't** pass arbitrary nodes — no slots, no \`className\` for colors.
- **Don't** invent new button looks in app code — extend WMDS via ADR.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiStateBadge: Story = {
  name: "Pattern — submit / async",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Primary pattern for form submit and async actions. Control `status` from parent state after API response.",
        },
      },
      wmdsLayout: "centered",
      backgrounds: { default: "dark" },
    },
    `
import { useState } from "react";
import { Button, getNextButtonStatus, type ButtonStatus } from "@whatmatters/wmds";

function SubmitForm() {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  return (
    <Button status={status} onClick={() => setStatus(getNextButtonStatus(status))}>
      Submit
    </Button>
  );
}
    `,
  ),
  render: function SubmitPattern() {
    const [status, setStatus] = useState<ButtonStatus>("idle");

    return (
      <Button
        status={status}
        onClick={() => setStatus(getNextButtonStatus(status))}
      >
        Submit
      </Button>
    );
  },
};

export const PrimaryAction: Story = {
  name: "Pattern — primary action",
  parameters: storyCopySource(`
import { Button } from "@whatmatters/wmds";

<Button role="primary">Save changes</Button>
  `),
  args: { role: "primary", children: "Save changes" },
};

export const SecondaryAction: Story = {
  name: "Pattern — secondary action",
  parameters: storyCopySource(`
import { Button } from "@whatmatters/wmds";

<Button role="secondary">Cancel</Button>
  `),
  args: { role: "secondary", children: "Cancel" },
};

export const GhostAction: Story = {
  name: "Pattern — ghost action",
  parameters: storyCopySource(`
import { Button } from "@whatmatters/wmds";

<Button role="ghost">Learn more</Button>
  `),
  args: { role: "ghost", children: "Learn more" },
};

export const RowLayout: Story = {
  name: "Pattern — row",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Flat full-width ghost row for detail lines (TaskRows.Detail) and settings lists. Mutually exclusive with `icon`, `count`, and `status`.",
        },
      },
    },
    `
import { Button } from "@whatmatters/wmds";

<Button role="ghost" layout="row" type="button" onClick={() => openDueDatePicker()}>
  <span>Due date</span>
  <span>Sep 12</span>
</Button>
    `,
  ),
  render: () => (
    <div className="max-w-md rounded-lg border border-border bg-surface p-3">
      <Button role="ghost" layout="row" type="button" onClick={() => undefined}>
        <span className={typographyClass("caption") + " text-muted"}>Due date</span>
        <span className={typographyClass("caption")}>Sep 12</span>
      </Button>
      <Button role="ghost" layout="row" type="button" onClick={() => undefined}>
        <span className={typographyClass("caption") + " text-muted"}>Assignee</span>
        <span className={typographyClass("caption")}>Alex</span>
      </Button>
    </div>
  ),
};

export const DestructiveAction: Story = {
  name: "Pattern — destructive action",
  parameters: storyCopySource(`
import { Button } from "@whatmatters/wmds";

<Button role="destructive">Delete account</Button>
  `),
  args: { role: "destructive", children: "Delete account" },
};

export const WithIcon: Story = {
  name: "Pattern — with icon",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "Leading Lucide icon reinforces the label. Icon choice is app-specific; sizing is automatic.",
        },
      },
    },
    `
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@whatmatters/wmds";

<Button role="primary" icon={<Plus strokeWidth={2} />}>
  New item
</Button>
    `,
  ),
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button role="primary" icon={<Plus strokeWidth={2} />}>
        New item
      </Button>
      <Button role="secondary" icon={<Pencil strokeWidth={2} />}>
        Edit
      </Button>
      <Button role="destructive" icon={<Trash2 strokeWidth={2} />}>
        Delete
      </Button>
    </div>
  ),
};

export const WithCount: Story = {
  name: "Pattern — with count",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "Trailing numeric count for inbox / notification nav actions only.",
        },
      },
    },
    `
import { Button } from "@whatmatters/wmds";

<Button role="primary" count={3}>
  Inbox
</Button>
    `,
  ),
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button role="primary" count={3}>
        Inbox
      </Button>
      <Button role="secondary" count={12}>
        Messages
      </Button>
    </div>
  ),
};

export const StatusStates: Story = {
  name: "Reference — status states",
  parameters: {
    docs: {
      description: {
        story: "Visual reference for each `status` value — use Pattern — submit / async in production.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button status="idle">Submit</Button>
      <Button status="loading">Submit</Button>
      <Button status="success">Submit</Button>
      <Button status="error">Submit</Button>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  parameters: {
    docs: {
      description: {
        story: "`md` = 44px min height (touch target). `xs` for dense UI / input adornments.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Reference — disabled",
  args: { children: "Unavailable", disabled: true },
};

export const TokenCheck: Story = {
  name: "Reference — primary token",
  args: { role: "primary", children: "Submit" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /submit/i });
    await expect(getComputedStyle(button).backgroundColor).toBe("rgb(57, 72, 92)");
  },
};
