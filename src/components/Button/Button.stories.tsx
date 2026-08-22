import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, type ButtonVariant } from "./Button";

const variants: ButtonVariant[] = [
  "primary",
  "secondary",
  "ghost",
  "destructive",
  "success",
  "warning",
  "info",
];

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    onClick: { action: "clicked" },
    icon: { control: false },
    badge: { control: false },
    startSlot: { control: false },
    endSlot: { control: false },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WMDS button — token-driven colors, real `:hover` / `:active` / `:focus-visible` / `disabled` states. " +
          "Optional `icon` / `badge` shorthands (or `startSlot` / `endSlot`) for composition. Icons via [Lucide](https://lucide.dev). " +
          "Use the **Controls** panel or interact in the canvas (hover, click, Tab to focus).",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Destructive" },
};

export const Success: Story = {
  args: { variant: "success", children: "Success" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Warning" },
};

export const Info: Story = {
  args: { variant: "info", children: "Info" },
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Disabled", disabled: true },
};

export const Loading: Story = {
  args: { variant: "primary", children: "Saving", loading: true },
};

export const AllSizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button size="xs">XS</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

/** Hover, press, and keyboard focus — interact in the canvas. */
export const InteractiveStates: Story = {
  name: "Interactive states",
  parameters: {
    docs: {
      description: {
        story:
          "Hover and click buttons below. Press **Tab** to move focus and see the focus ring (`--color-focus-ring`). " +
          "Disabled and loading rows are non-interactive.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-2">
      <section className="flex flex-col gap-3">
        <p className="text-sm text-muted">Default — hover, active, focus</p>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <p className="text-sm text-muted">Disabled</p>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} disabled>
              {variant}
            </Button>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <p className="text-sm text-muted">Loading</p>
        <div className="flex flex-wrap gap-3">
          <Button loading>Primary</Button>
          <Button variant="secondary" loading>
            Secondary
          </Button>
        </div>
      </section>
    </div>
  ),
};

export const VariantSizeMatrix: Story = {
  name: "Variant × size matrix",
  render: () => (
    <div className="grid grid-cols-[5rem_1fr_1fr_1fr_1fr] items-center gap-x-4 gap-y-3">
      <span />
      <span className="text-center text-xs tracking-wide text-muted uppercase">xs</span>
      <span className="text-center text-xs tracking-wide text-muted uppercase">sm</span>
      <span className="text-center text-xs tracking-wide text-muted uppercase">md</span>
      <span className="text-center text-xs tracking-wide text-muted uppercase">lg</span>
      {variants.flatMap((variant) => [
        <span key={`${variant}-label`} className="text-sm capitalize text-fg">
          {variant}
        </span>,
        <Button key={`${variant}-xs`} variant={variant} size="xs">
          Label
        </Button>,
        <Button key={`${variant}-sm`} variant={variant} size="sm">
          Label
        </Button>,
        <Button key={`${variant}-md`} variant={variant} size="md">
          Label
        </Button>,
        <Button key={`${variant}-lg`} variant={variant} size="lg">
          Label
        </Button>,
      ])}
    </div>
  ),
};

/** Leading icon reinforces the label — pass Lucide (or any SVG) via `icon`. */
export const WithLeadingIcon: Story = {
  name: "Slots — icon (start)",
  parameters: {
    docs: {
      description: {
        story:
          "Buttons with a leading icon that reinforces the label. Use when the icon helps identify the action faster — e.g. plus for “New” or trash for “Delete”. Icons scale with button size.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button icon={<Plus strokeWidth={2} />}>New item</Button>
      <Button variant="secondary" icon={<Pencil strokeWidth={2} />}>
        Edit
      </Button>
      <Button variant="ghost" icon={<Download strokeWidth={2} />}>
        Download
      </Button>
      <Button variant="destructive" icon={<Trash2 strokeWidth={2} />}>
        Delete
      </Button>
    </div>
  ),
};

/** Trailing badge for counts or short status labels. */
export const WithTrailingBadge: Story = {
  name: "Slots — badge (end)",
  parameters: {
    docs: {
      description: {
        story:
          "Buttons with a trailing badge for notification counts or status. Pass a number for compact counts, a string for label pills like “New”. Semantic badge colors come with the standalone Badge component.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button badge={3}>Messages</Button>
      <Button variant="secondary" badge={12}>
        Notifications
      </Button>
      <Button variant="ghost" badge="New">
        Updates
      </Button>
    </div>
  ),
};

export const WithIconAndBadge: Story = {
  name: "Slots — icon + badge",
  render: () => (
    <Button icon={<Pencil strokeWidth={2} />} badge={12}>
      Notifications
    </Button>
  ),
};
