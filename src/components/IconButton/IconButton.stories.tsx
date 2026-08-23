import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreVertical, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import { IconButton, type IconButtonVariant } from "./IconButton";

const variants: IconButtonVariant[] = [
  "primary",
  "secondary",
  "ghost",
  "destructive",
  "success",
  "warning",
  "info",
];

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    icon: { control: false },
    onClick: { action: "clicked" },
  },
  args: {
    label: "Settings",
    icon: <Settings strokeWidth={2} />,
    variant: "secondary",
    size: "md",
    disabled: false,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Icon-only button inspired by [Astryx IconButton](https://astryx.atmeta.com/components/IconButton). " +
          "Separate from **`Button`** — requires **`label`** (→ `aria-label`) and **`icon`**; no visible text. " +
          "Default variant is **`secondary`** (Astryx parity). Use **`ghost`** in dense toolbars and table rows.",
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton label="Add item" variant="primary" icon={<Plus strokeWidth={2} />} />
      <IconButton label="Settings" variant="secondary" icon={<Settings strokeWidth={2} />} />
      <IconButton label="Edit row" variant="ghost" icon={<Pencil strokeWidth={2} />} />
      <IconButton label="Delete item" variant="destructive" icon={<Trash2 strokeWidth={2} />} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <IconButton label="Extra small" size="xs" variant="ghost" icon={<MoreVertical strokeWidth={2} />} />
      <IconButton label="Small" size="sm" variant="ghost" icon={<MoreVertical strokeWidth={2} />} />
      <IconButton label="Medium" size="md" variant="ghost" icon={<MoreVertical strokeWidth={2} />} />
      <IconButton label="Large" size="lg" variant="ghost" icon={<MoreVertical strokeWidth={2} />} />
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, label: "Saving" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const TableRowActions: Story = {
  name: "Table row actions",
  parameters: {
    docs: {
      description: {
        story: "Kebab menu trigger for sticky table action columns — `xs` + `ghost`.",
      },
    },
  },
  render: () => (
    <IconButton
      label="Row actions"
      size="xs"
      variant="ghost"
      icon={<MoreVertical strokeWidth={2} />}
    />
  ),
};
