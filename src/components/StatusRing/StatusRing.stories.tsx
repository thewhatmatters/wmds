import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "../List/List";
import { Card } from "../Card/Card";
import { StatusRing } from "./StatusRing";

const meta = {
  title: "Components/StatusRing",
  component: StatusRing,
  tags: ["autodocs"],
  argTypes: {
    count: { control: { type: "number", min: 0, max: 99 } },
    active: { control: "boolean" },
    decorative: { control: "boolean" },
  },
  args: {
    count: 2,
    active: true,
    decorative: true,
    label: "Open positions",
  },
  parameters: {
    docs: {
      description: {
        component:
          "24px count ring with optional clockwise arc sweep — live/active rows in **`List.ItemMedia`**. " +
          "Companion to **`StatusDot`**: dot for binary state, ring for numeric counts in progress. " +
          "**`active`** defaults to **`true`** when **`count > 0`**. Use **`decorative`** when the row label is visible.",
      },
    },
  },
} satisfies Meta<typeof StatusRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <StatusRing count={0} decorative label="Idle" />
      <StatusRing count={2} decorative label="Active" />
      <StatusRing count={5} active={false} decorative label="Paused" />
    </div>
  ),
};

export const InListRow: Story = {
  name: "In List row",
  render: () => (
    <Card variant="outlined" elevation="raised" padding="none" className="max-w-md">
      <List variant="contained">
        <List.Item>
          <List.ItemRow>
            <List.ItemMedia>
              <StatusRing count={2} decorative />
            </List.ItemMedia>
            <List.ItemLabel>Open positions</List.ItemLabel>
            <List.ItemMeta className="font-medium text-success">+$2.38</List.ItemMeta>
          </List.ItemRow>
        </List.Item>
        <List.Item>
          <List.ItemRow>
            <List.ItemMedia>
              <StatusRing count={0} decorative />
            </List.ItemMedia>
            <List.ItemLabel>Queue</List.ItemLabel>
            <List.ItemMeta className="text-muted">Empty</List.ItemMeta>
          </List.ItemRow>
        </List.Item>
      </List>
    </Card>
  ),
};
