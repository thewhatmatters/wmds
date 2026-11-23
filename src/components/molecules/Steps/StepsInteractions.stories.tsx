import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Steps, type StepsProps } from "./Steps";

/**
 * Browser interaction tests for Steps — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Steps",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const viewports = {
  phone390: { name: "Phone 390", styles: { width: "390px", height: "844px" }, type: "mobile" as const },
  desktop1280: { name: "Desktop 1280", styles: { width: "1280px", height: "800px" }, type: "desktop" as const },
};

const box = (element: Element) => element.getBoundingClientRect();

const slots = (root: Element, name: string) => [...root.querySelectorAll<HTMLElement>(`[data-slot="${name}"]`)];

function Example({ layout }: Pick<StepsProps, "layout">) {
  return (
    <Steps aria-label="How it works" layout={layout}>
      <Steps.Item title="Call or text">Tell us what's wrong. We answer the same day.</Steps.Item>
      <Steps.Item title="We come and look, measure up and talk it through with you">
        A free visit, and a written price before any work starts.
      </Steps.Item>
      <Steps.Item title="We do the work">On the day we said, by the people you met.</Steps.Item>
      <Steps.Item title="You check it">Nothing is owed until you're happy with it.</Steps.Item>
    </Steps>
  );
}

export const RowsOnAPhone: Story = {
  name: "On a phone: one column, the number beside the words, a rule above each step",
  globals: { viewport: { value: "phone390", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="p-4">
      <Example />
    </div>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list", { name: "How it works" });
    const items = canvas.getAllByRole("listitem");
    await expect(items).toHaveLength(4);
    await expect(canvas.getAllByRole("heading", { level: 3 })).toHaveLength(4);

    // One column: every step starts at the same left edge, each below the last.
    for (const [index, item] of items.entries()) {
      await expect(Math.round(box(item).left)).toBe(Math.round(box(list).left));
      await expect(box(item).right).toBeLessThanOrEqual(390);
      if (index > 0) await expect(box(item).top).toBeGreaterThan(box(items[index - 1]!).bottom);
      await expect(parseFloat(getComputedStyle(item).borderTopWidth)).toBeGreaterThanOrEqual(1);
    }

    // The number is mono, counted, and sits beside the title on its first line.
    const numbers = slots(list, "number");
    await expect(numbers.map((number) => number.textContent)).toEqual(["01", "02", "03", "04"]);
    const titles = slots(list, "title");
    for (const [index, number] of numbers.entries()) {
      await expect(getComputedStyle(number).fontFamily.toLowerCase()).toContain("mono");
      await expect(box(number).right).toBeLessThanOrEqual(box(titles[index]!).left);
      await expect(box(number).top).toBeLessThan(box(titles[index]!).top + parseFloat(getComputedStyle(titles[index]!).lineHeight));
    }
    // The long title wraps inside its column.
    await expect(box(titles[1]!).height).toBeGreaterThan(box(titles[0]!).height);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};

export const ColumnsOnAPhone: Story = {
  name: "On a phone: columns is one column too",
  globals: { viewport: { value: "phone390", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="p-4">
      <Example layout="columns" />
    </div>
  ),
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole("listitem");
    for (const [index, item] of items.entries()) {
      if (index > 0) {
        await expect(box(item).top).toBeGreaterThan(box(items[index - 1]!).bottom);
        await expect(Math.round(box(item).left)).toBe(Math.round(box(items[0]!).left));
      }
    }
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};

export const ColumnsOnADesktop: Story = {
  name: "On a desktop: columns sets the steps side by side, equal widths, the number above",
  globals: { viewport: { value: "desktop1280", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="p-6">
      <Example layout="columns" />
    </div>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list", { name: "How it works" });
    const items = canvas.getAllByRole("listitem");
    const widths = items.map((item) => Math.round(box(item).width));
    for (const [index, item] of items.entries()) {
      await expect(Math.round(box(item).top)).toBe(Math.round(box(items[0]!).top));
      await expect(Math.abs(widths[index]! - widths[0]!)).toBeLessThanOrEqual(1);
      if (index > 0) await expect(box(item).left).toBeGreaterThan(box(items[index - 1]!).right);
    }
    const numbers = slots(list, "number");
    const titles = slots(list, "title");
    for (const [index, number] of numbers.entries()) {
      await expect(box(number).bottom).toBeLessThanOrEqual(box(titles[index]!).top);
    }
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};
