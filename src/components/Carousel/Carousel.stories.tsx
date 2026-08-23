import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useState } from "react";
import { Badge } from "../Badge/Badge";
import { StatusDot } from "../StatusDot/StatusDot";
import { Carousel } from "./Carousel";

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs", "ai-generated"],
  argTypes: {
    title: { control: "text" },
    children: { control: false },
  },
  args: {
    title: "Insights",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Title, slide count, and ghost prev/next — no autoplay. " +
          "Controlled via **`index`** / **`onIndexChange`**. Compose each `Carousel.Slide` with Badge, StatusDot, and `font-mono` figures.",
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

function AccountChip({ handle }: { handle: string }) {
  return (
    <Badge
      variant="neutral"
      size="sm"
      className="mx-0.5"
      startSlot={<StatusDot variant="warning" decorative />}
    >
      @{handle}
    </Badge>
  );
}

export const Playground: Story = {
  render: (args) => {
    const [index, setIndex] = useState(0);
    return (
      <div className="w-[600px]">
        <Carousel {...args} index={index} onIndexChange={setIndex}>
          <Carousel.Slide>
            The worst performer in your <AccountChip handle="Creamery" /> is Rocky Road — down{" "}
            <span className="font-mono text-[11.5px] text-destructive">-6%</span> or{" "}
            <span className="font-mono text-[11.5px] text-destructive">-$2,453.44</span>.
          </Carousel.Slide>
          <Carousel.Slide>
            The best performer in your <AccountChip handle="Creamery" /> is Pistachio — up{" "}
            <span className="font-mono text-[11.5px] text-success">+4.2%</span> or{" "}
            <span className="font-mono text-[11.5px] text-success">+$812.10</span>.
          </Carousel.Slide>
          <Carousel.Slide>
            Cash in <AccountChip handle="Creamery" /> is{" "}
            <span className="font-mono text-[11.5px] text-fg">$369.49</span>{" "}
            <span className="font-mono text-[11.5px] text-warning">72%</span> of the book — drag until a dip fills.
          </Carousel.Slide>
        </Carousel>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("heading", { name: "Insights" })).toBeVisible();
    await expect(canvas.getByText("3")).toBeVisible();
    const next = canvas.getByRole("button", { name: /next slide/i });
    await userEvent.click(next);
    await expect(canvas.getByText(/best performer/i)).toBeVisible();
  },
};
