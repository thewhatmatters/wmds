import type { Meta, StoryObj } from "@storybook/react-vite";
import { RestockCard } from "./RestockCard";

const meta = {
  title: "Examples/Restock agent card",
  component: RestockCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Design-system specimen — not a shipped component.** Recreates a target agent UI (restock prompt) using WMDS tokens and primitives only, to prove the system can generate real product surfaces. " +
          "If this pattern ships later, it would likely compose `Card`, `Button`, and extracted list-row pieces — not import this file as-is.",
      },
    },
  },
} satisfies Meta<typeof RestockCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Token-bound light-mode recreation — compare with the Paper artboard and reference frame. */
export const Default: Story = {
  args: {
    onAlternatives: () => {},
    onAccepted: () => {},
  },
};
