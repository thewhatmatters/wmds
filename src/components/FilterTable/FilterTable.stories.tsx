import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterTable } from "./FilterTable";

const meta = {
  title: "Examples/Filter table",
  component: FilterTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Design-system specimen — not a shipped component.** Composes **`Chip.Group`**, **`Table`**, and **`Badge`**. " +
          "The header stays fixed while rows collapse with **`.motion-collapse`** (`--duration-slower`, `--ease-out-expo`) — rows stay mounted; set **`Table.Row`** `visible` + `colSpan` instead of filtering data out of the tree.",
      },
    },
  },
} satisfies Meta<typeof FilterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="rounded-lg bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};
