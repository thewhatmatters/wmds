import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Copy, Pencil, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { MoreMenu } from "./MoreMenu";

const meta = {
  title: "Components/MoreMenu",
  component: MoreMenu,
  tags: ["autodocs", "ai-generated"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "destructive"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    placement: { control: "select", options: ["below", "above"] },
    alignment: { control: "select", options: ["start", "end"] },
    disabled: { control: "boolean" },
    icon: { control: false },
    items: { control: false },
  },
  args: {
    label: "More options",
    variant: "ghost",
    size: "md",
    placement: "below",
    alignment: "end",
    disabled: false,
    items: [
      { label: "Edit", icon: <Pencil strokeWidth={2} />, onClick: () => undefined },
      { label: "Share", icon: <Share2 strokeWidth={2} />, onClick: () => undefined },
      { type: "divider" },
      { label: "Delete", icon: <Trash2 strokeWidth={2} />, variant: "destructive", onClick: () => undefined },
    ],
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Overflow menu with an icon-only trigger, following [Astryx MoreMenu](https://astryx.atmeta.com/components/MoreMenu). " +
          "Closed `items` API — actions, dividers, and sections. Default trigger is **`ghost`** kebab (`MoreVertical`). " +
          "Menu panel portals to the viewport and auto-flips when near screen edges or inside overflow-hidden containers.",
      },
    },
  },
} satisfies Meta<typeof MoreMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas, userEvent, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /more options/i });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(within(canvasElement.ownerDocument.body).getByRole("menu")).toBeVisible();
  },
};

export const WithDescriptions: Story = {
  args: {
    items: [
      {
        label: "Copy link",
        description: "Share this row with your team",
        icon: <Copy strokeWidth={2} />,
        endContent: "⌘C",
        onClick: () => undefined,
      },
      {
        label: "Edit position",
        description: "Opens the trade ticket",
        icon: <Pencil strokeWidth={2} />,
        onClick: () => undefined,
      },
      { type: "divider" },
      {
        label: "Close position",
        description: "Irreversible",
        icon: <Trash2 strokeWidth={2} />,
        variant: "destructive",
        onClick: () => undefined,
      },
    ],
  },
};

export const Sections: Story = {
  args: {
    items: [
      {
        type: "section",
        title: "Row",
        items: [
          { label: "Edit", icon: <Pencil strokeWidth={2} />, onClick: () => undefined },
          { label: "Share", icon: <Share2 strokeWidth={2} />, onClick: () => undefined },
        ],
      },
      { type: "divider" },
      {
        label: "Delete",
        icon: <Trash2 strokeWidth={2} />,
        variant: "destructive",
        onClick: () => undefined,
      },
    ],
  },
};

export const TableRowActions: Story = {
  name: "Table row actions",
  args: {
    label: "Row actions",
    size: "xs",
    alignment: "end",
    items: [
      { id: "edit", label: "Edit row", icon: <Pencil strokeWidth={2} />, onClick: () => undefined },
      { id: "share", label: "Share", icon: <Share2 strokeWidth={2} />, onClick: () => undefined },
      { type: "divider" },
      {
        id: "delete",
        label: "Delete",
        icon: <Trash2 strokeWidth={2} />,
        variant: "destructive",
        onClick: () => undefined,
      },
    ],
  },
};

export const ClippedContainer: Story = {
  name: "Clipped container (auto-flip)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Menu portals to `document.body` and flips/clamps to the viewport — stays visible inside `overflow: hidden` parents (tables, cards, Storybook canvas edges).",
      },
    },
  },
  render: (args) => (
    <div className="flex h-[100svh] flex-col justify-end p-6">
      <div className="overflow-hidden rounded-lg border border-border bg-surface p-3 shadow-md">
        <div className="flex items-center justify-end">
          <MoreMenu {...args} />
        </div>
      </div>
    </div>
  ),
  args: {
    label: "More options",
    size: "sm",
    placement: "below",
    alignment: "end",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-start gap-3">
        <MoreMenu {...args} open={open} onOpenChange={setOpen} />
        <p className="text-sm text-muted">Menu is {open ? "open" : "closed"}.</p>
      </div>
    );
  },
};
