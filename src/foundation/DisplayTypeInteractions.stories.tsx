import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { TextSequence } from "../components/molecules/TextSequence/TextSequence";

/**
 * Display rule D5 (WCAG 1.4.10 reflow): at 320px a display step with a long word breaks it instead of
 * widening its flex or grid track. Run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Display type",
  tags: ["test", "!dev", "!autodocs"],
  parameters: { docs: { disable: true }, wmdsLayout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const worst = "We help Austin's independent restaurants and Supercalifragilisticexpialidociously-long-names get found";
const steps = ["type-display-hero", "type-display-xl", "type-display-1", "type-display-2", "type-display-3"] as const;

export const LongWordsReflowAt320: Story = {
  name: "every display step and TextSequence reflow a long word inside 320px boxes",
  render: () => (
    <div className="flex flex-col gap-8">
      {steps.map((step) => (
        <div key={step} className="flex w-[320px] items-center justify-center outline outline-1" data-box="">
          <p className={`${step} text-fg`}>{worst}</p>
        </div>
      ))}
      {steps.map((step) => (
        <div key={`${step}-grid`} className="grid w-[320px] grid-cols-4 outline outline-1" data-box="">
          <h2 className={`${step} col-span-4 text-fg`}>{worst}</h2>
        </div>
      ))}
      {/* TextSequence word masks reach 0.08em past each word (headroom for caps and strokes): allow that. */}
      <div className="flex w-[320px] justify-center outline outline-1" data-box="" data-headroom="">
        <h2 className="type-display-2 text-center text-fg">
          <TextSequence>{worst}</TextSequence>
        </h2>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    for (const box of canvasElement.querySelectorAll<HTMLElement>("[data-box]")) {
      const text = box.firstElementChild as HTMLElement;
      const headroom = box.hasAttribute("data-headroom") ? parseFloat(getComputedStyle(text).fontSize) * 0.1 : 0;
      const limit = box.getBoundingClientRect().right + 1 + headroom;
      expect(text.getBoundingClientRect().right, text.className).toBeLessThanOrEqual(limit);
      expect(box.scrollWidth, text.className).toBeLessThanOrEqual(box.clientWidth + 1 + headroom);
    }
  },
};
