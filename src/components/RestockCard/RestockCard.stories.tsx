import type { Meta, StoryObj } from "@storybook/react-vite";
import { RestockCard } from "./RestockCard";

const meta = {
  title: "Components/Restock card",
  component: RestockCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Token-bound recreation of the restock agent card (light mode). Uses surface, border, secondary, success, warning, and muted tokens — no custom colors.",
      },
    },
  },
} satisfies Meta<typeof RestockCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onAlternatives: () => {},
    onAccepted: () => {},
  },
};
