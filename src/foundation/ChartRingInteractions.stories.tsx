import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import { Chart } from "../components/organisms/Chart/Chart";

/**
 * Browser interaction tests for Chart.SegmentedRing's fluid size and `animate="always"` — run via
 * `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Chart ring",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const figures = [35, 65, 20];

function SteppingRing() {
  const [index, setIndex] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="w-80">
        <Chart.SegmentedRing
          value={figures[index]}
          max={100}
          size="fluid"
          animate="always"
          segments={72}
          centerValue={`${figures[index]}%`}
          label={`${figures[index]}%`}
        />
      </div>
      <Button role="secondary" onClick={() => setIndex((current) => (current + 1) % figures.length)}>
        Next figure
      </Button>
    </div>
  );
}

const filledOf = (meter: Element) => Number(meter.getAttribute("data-filled"));
const ticksFor = (percent: number) => Math.round((percent / 100) * 72);

export const FluidFillsItsContainer: Story = {
  name: "fluid fills its container's width, square, with the figure sized to the ring",
  render: () => <SteppingRing />,
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter");
    const ring = meter.parentElement as HTMLElement;
    expect(ring.getAttribute("data-size")).toBe("fluid");
    expect(ring.offsetWidth).toBe(320);
    expect(ring.offsetHeight).toBe(320);
    const figure = canvas.getByText("35%");
    // 18% of the ring's width, not the viewport's display size.
    expect(Math.round(parseFloat(getComputedStyle(figure).fontSize))).toBe(Math.round(320 * 0.18));
  },
};

export const AlwaysSweepsFromTheLastValue: Story = {
  name: "animate=\"always\" sweeps from the last value to the next, never back to empty",
  render: () => <SteppingRing />,
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter");
    await waitFor(() => expect(filledOf(meter)).toBe(ticksFor(35)), { timeout: 4000 });

    // Up: 35 → 65. Every frame sits between the two values; none drops to empty.
    const upFrames: number[] = [];
    const watchUp = new MutationObserver(() => upFrames.push(filledOf(meter)));
    watchUp.observe(meter, { attributes: true, attributeFilter: ["data-filled"] });
    await userEvent.click(canvas.getByRole("button", { name: "Next figure" }));
    await waitFor(() => expect(filledOf(meter)).toBe(ticksFor(65)), { timeout: 4000 });
    watchUp.disconnect();
    expect(upFrames.length).toBeGreaterThan(2);
    expect(Math.min(...upFrames)).toBeGreaterThanOrEqual(ticksFor(35));

    // Down: 65 → 20 sweeps back rather than jumping.
    const downFrames: number[] = [];
    const watchDown = new MutationObserver(() => downFrames.push(filledOf(meter)));
    watchDown.observe(meter, { attributes: true, attributeFilter: ["data-filled"] });
    await userEvent.click(canvas.getByRole("button", { name: "Next figure" }));
    await waitFor(() => expect(filledOf(meter)).toBe(ticksFor(20)), { timeout: 4000 });
    watchDown.disconnect();
    expect(downFrames.length).toBeGreaterThan(2);
  },
};
