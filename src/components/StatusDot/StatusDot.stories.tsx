import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Badge } from "../Badge/Badge";
import { Chip } from "../Chip/Chip";
import { StatusDot, type StatusDotVariant } from "./StatusDot";

const variants: StatusDotVariant[] = ["neutral", "info", "success", "warning", "destructive"];

const meta = {
  title: "Components/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variants },
    pulsing: { control: "boolean" },
    decorative: { control: "boolean" },
    icon: { control: false },
  },
  args: {
    variant: "success",
    label: "Online",
    pulsing: false,
    decorative: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Fixed 8px semantic status dot — [Astryx StatusDot](https://astryx.atmeta.com/components/StatusDot). " +
          "Requires **`label`** (→ `aria-label`) unless **`decorative`** inside Badge/Chip with a visible name. " +
          "Maps Astryx `error` → **`destructive`**, `accent` → **`info`**. WMDS variants align with Badge/Chip.",
      },
    },
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <StatusDot variant="neutral" label="Neutral" />
      <StatusDot variant="info" label="In progress" />
      <StatusDot variant="success" label="Online" />
      <StatusDot variant="warning" label="At risk" />
      <StatusDot variant="destructive" label="Offline" />
    </div>
  ),
};

export const Pulsing: Story = {
  args: { variant: "success", label: "Live", pulsing: true },
};

export const WithIcon: Story = {
  args: {
    variant: "success",
    label: "Verified",
    icon: <Check strokeWidth={3} />,
  },
};

export const InBadge: Story = {
  name: "In Badge",
  render: () => (
    <Badge variant="success" startSlot={<StatusDot variant="success" decorative />}>
      Online
    </Badge>
  ),
};

export const InChip: Story = {
  name: "In Chip group",
  render: () => (
    <Chip.Group aria-label="Status filters" value="all" onValueChange={() => undefined}>
      <Chip value="all">All</Chip>
      <Chip value="live" dot="success">
        Live
      </Chip>
      <Chip value="risk" dot="warning">
        At risk
      </Chip>
    </Chip.Group>
  ),
};
