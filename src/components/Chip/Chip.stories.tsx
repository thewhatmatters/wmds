import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useState } from "react";
import { FilterTable } from "../FilterTable/FilterTable";
import { Chip } from "../Chip/Chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs", "ai-generated"],
  args: {
    children: "Chip",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Interactive filter chip — a **`button`** with `aria-pressed` for toggling list filters. " +
          "Distinct from **`Badge`** (static labels). Compose a row with **`Chip.Group`** for single-select filters; " +
          "use optional **`dot`** (semantic **`StatusDot`** variant), **`count`**, or **`startSlot`** for leading media.",
      },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function PlaygroundStory() {
    const [value, setValue] = useState("all");

    return (
      <Chip.Group aria-label="Status filters" value={value} onValueChange={setValue}>
        <Chip value="all" count={5}>
          All
        </Chip>
        <Chip value="todo" dot="warning" count={2}>
          To do
        </Chip>
        <Chip value="progress" dot="info" count={2}>
          In Progress
        </Chip>
        <Chip value="done" dot="success" count={1}>
          Completed
        </Chip>
      </Chip.Group>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const todo = canvas.getByRole("button", { name: /to do/i });
    await userEvent.click(todo);
    await expect(todo).toHaveAttribute("aria-pressed", "true");
  },
};

export const States: Story = {
  name: "Pressed / default",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip pressed count={5}>
        Pressed
      </Chip>
      <Chip count={2}>Default</Chip>
      <Chip dot="warning" count={2}>
        With dot
      </Chip>
      <Chip pressed disabled count={1}>
        Disabled
      </Chip>
    </div>
  ),
};

export const WithTable: Story = {
  name: "With table",
  parameters: {
    docs: {
      description: {
        story:
          "Filter chips above a table with motion-token row collapse — header stays static while rows animate in and out. " +
          "See **`Examples / Filter table`** for the same specimen.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg rounded-lg bg-bg p-4">
        <Story />
      </div>
    ),
  ],
  render: () => <FilterTable />,
};
