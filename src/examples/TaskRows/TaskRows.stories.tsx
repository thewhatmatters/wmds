import type { Meta, StoryObj } from "@storybook/react-vite";
import { TaskRows } from "./TaskRows";

const meta = {
  title: "Examples/Task rows",
  component: TaskRows,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Design-system specimen — not a shipped component.** Agent task list with staged motion (spinner, expand, failed → completed). " +
          "Composes **`Card`**, **`List`**, and **`Badge`** — step rings and tick choreography stay in this file.",
      },
    },
  },
} satisfies Meta<typeof TaskRows>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contained: Story = {
  name: "Contained",
  args: {
    variant: "contained",
  },
};

export const Separated: Story = {
  name: "Separated",
  args: {
    variant: "separated",
  },
};
