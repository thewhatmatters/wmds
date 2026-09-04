import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin } from "lucide-react";
import { Search, searchSizes } from "./Search";

const meta = {
  title: "Molecules/Search",
  component: Search,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: [...searchSizes] },
    icon: { control: false },
    actionLabel: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "ZIP or city",
    "aria-label": "Location",
    actionLabel: "Use my location",
    size: "md",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Hero location search — one **pill shell** with inset action button.

| Pattern | Composition |
|---------|-------------|
| **Inline + button** | \`Search\` — \`Input inline\` + trailing \`Button\` |
| **Find collapsed** | \`Button\` "Find" only — parent owns expand |
| **Find committed** | removable \`Chip\` — app flow |

**Shell:** \`bg-surface\` pill on \`bg-body\` page, \`h-11\` with \`p-1 pl-2\` inset — even gutter on the embedded button (top / right / bottom); inner track is \`h-8\`.

## Best practices

- **Do** use for ZIP/city + "Use my location" / "GO" search rows.
- **Do** pair with Example-level expand/collapse from a "Find" trigger.
- **Don't** use solo bordered \`Input\` beside \`Button\` for this pattern — use \`Search\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InlineButton: Story = {
  name: "Pattern — inline + button",
};

export const WithIcon: Story = {
  name: "With leading icon",
  args: {
    icon: <MapPin strokeWidth={2} />,
  },
};

export const GoAction: Story = {
  name: "GO action",
  args: {
    actionLabel: "GO",
    defaultValue: "97201",
  },
};

export const OnBeige: Story = {
  name: "On page background (FM)",
  parameters: {
    docs: {
      description: {
        story: "White surface pill on gray body — Astryx surface hierarchy.",
      },
    },
  },
  render: (args) => (
    <div className="w-full max-w-lg rounded-xl bg-body p-6">
      <Search {...args} />
    </div>
  ),
};
