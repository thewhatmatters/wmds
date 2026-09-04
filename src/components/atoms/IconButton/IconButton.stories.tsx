import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pencil, Plus, Settings, Trash2, Wrench, X } from "lucide-react";
import { IconButton, buttonRoles } from "./IconButton";
import { iconButtonToolbarGroupClasses } from "./iconButtonStyles";

const meta = {
  title: "Atoms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    role: { control: "select", options: [...buttonRoles] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    fab: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: { control: false },
    onClick: { action: "clicked" },
  },
  args: {
    "aria-label": "Settings",
    role: "ghost",
    size: "md",
    fab: false,
    loading: false,
    disabled: false,
    icon: <Settings strokeWidth={2} />,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

**Four prescribed patterns** — icon only, no visible text. If the action is not obvious from the icon, use **Button** with a label instead.

| Pattern | Props |
|---------|--------|
| **Toolbar group** | ghost \`IconButton\`s in the pill shell (\`iconButtonToolbarGroupClasses\`) |
| **FAB** | \`fab\` + \`aria-label\` |
| **With tooltip** | \`title\` (defaults to \`aria-label\`) |
| **Async** | \`loading\` + \`aria-label\` |
| **Inset dismiss** | \`inset\` + \`size="sm" \| "md" \| "lg"\` — removable Chip trailing × |

Inspired by [Astryx IconButton](https://astryx.atmeta.com/components/IconButton). Circular hit target; \`md\` = cluster lg (44×44px, ADR-0003). \`xs\` / \`sm\` / \`md\` map to cluster sm / md / lg — see **Foundation → Cluster** (ADR-0011).

## Best practices

- **Do** make \`aria-label\` specific — "Delete conversation", not just "Delete".
- **Do** set \`title\` when the icon alone is ambiguous for sighted users.
- **Do** use \`ghost\` in dense toolbars.
- **Don't** use IconButton when the action needs visible text — use \`Button\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toolbar: Story = {
  name: "Pattern — toolbar group",
  parameters: {
    docs: {
      description: {
        story:
          "Ghost icon buttons in a pill shell — use for compact action clusters (card headers, row actions). Not a separate molecule yet; copy this pattern or ask for `IconButtonGroup` if it ships in three or more places.",
      },
    },
  },
  render: () => (
    <div role="toolbar" aria-label="Item actions" className={iconButtonToolbarGroupClasses}>
      <IconButton icon={<Pencil strokeWidth={2} />} aria-label="Edit item" title="Edit item" />
      <IconButton icon={<Trash2 strokeWidth={2} />} aria-label="Delete conversation" title="Delete conversation" role="ghost" />
      <IconButton icon={<Settings strokeWidth={2} />} aria-label="Open settings" title="Settings" />
    </div>
  ),
};

export const InsetDismiss: Story = {
  name: "Pattern — inset dismiss",
  parameters: {
    docs: {
      description: {
        story:
          "Compact ghost dismiss — pairs with **Chip** `onRemove` (trailing ×). Use `inset` so hit targets match chip innards.",
      },
    },
  },
  render: () => (
    <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 shadow-hairline">
      <span className="text-sm text-fg">78701</span>
      <IconButton
        inset
        size="md"
        role="ghost"
        icon={<X strokeWidth={2} />}
        aria-label="Remove 78701"
        title="Remove 78701"
      />
    </div>
  ),
};

export const Fab: Story = {
  name: "Pattern — FAB",
  parameters: {
    docs: {
      description: {
        story: "Floating action button — primary fill with elevated shadow.",
      },
    },
    wmdsLayout: "centered",
  },
  render: () => (
    <IconButton
      fab
      icon={<Plus strokeWidth={2.5} />}
      aria-label="Create item"
      title="Create item"
    />
  ),
};

export const WithTooltip: Story = {
  name: "Pattern — with tooltip",
  parameters: {
    docs: {
      description: {
        story: "`title` provides a native tooltip on hover — use when the icon needs a sighted hint.",
      },
    },
  },
  args: {
    icon: <Wrench strokeWidth={2} />,
    "aria-label": "Configure workspace",
    title: "Configure workspace",
    role: "secondary",
  },
};

export const AsyncLoading: Story = {
  name: "Pattern — async",
  parameters: {
    docs: {
      description: {
        story: "Spinner replaces icon while an action is in flight.",
      },
    },
  },
  render: function AsyncIconButton() {
    const [loading, setLoading] = useState(false);

    return (
      <IconButton
        icon={<Trash2 strokeWidth={2} />}
        aria-label="Delete conversation"
        title="Delete conversation"
        role="destructive"
        loading={loading}
        onClick={() => {
          setLoading(true);
          window.setTimeout(() => setLoading(false), 1500);
        }}
      />
    );
  },
};

export const Roles: Story = {
  name: "Reference — roles",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton icon={<Settings strokeWidth={2} />} aria-label="Primary settings" role="primary" />
      <IconButton icon={<Settings strokeWidth={2} />} aria-label="Secondary settings" role="secondary" />
      <IconButton icon={<Settings strokeWidth={2} />} aria-label="Ghost settings" role="ghost" />
      <IconButton icon={<Trash2 strokeWidth={2} />} aria-label="Delete conversation" role="destructive" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  parameters: {
    docs: {
      description: {
        story: "`xs` / `sm` / `md` align to cluster sm (28px) / md (36px) / lg (44px). `lg` is extended (FAB).",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <IconButton size="xs" icon={<Plus strokeWidth={2} />} aria-label="Extra small add" />
      <IconButton size="sm" icon={<Plus strokeWidth={2} />} aria-label="Small add" />
      <IconButton size="md" icon={<Plus strokeWidth={2} />} aria-label="Medium add" />
      <IconButton size="lg" icon={<Plus strokeWidth={2} />} aria-label="Large add" />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Reference — disabled",
  args: {
    disabled: true,
    "aria-label": "Unavailable action",
  },
};
