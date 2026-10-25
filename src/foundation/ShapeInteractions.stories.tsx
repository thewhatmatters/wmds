import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ShapeKnobsSpecimen } from "./Shape.stories";

/**
 * Browser interaction tests for the shape design knobs — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Shape",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const radius = (element: Element) => getComputedStyle(element).borderTopLeftRadius;

export const KnobsOnAWrapper: Story = {
  name: "knobs set on a wrapper reshape every control and surface inside it",
  render: () => <ShapeKnobsSpecimen />,
  play: async ({ canvas }) => {
    const rect = within(canvas.getByTestId("knobs-rect"));
    const pill = within(canvas.getByTestId("knobs-default"));

    // Default: controls are pills, the card is 16px.
    expect(parseFloat(radius(pill.getByRole("button", { name: "Get a quote" })))).toBeGreaterThan(1000);
    // A padded Card uses the small surface step: 8px by default.
    expect(radius(canvas.getByTestId("knobs-default").firstElementChild!)).toBe("8px");

    // [--radius-control:4px] [--radius-surface:6px]
    for (const control of [
      rect.getByRole("button", { name: "Get a quote" }),
      rect.getByRole("button", { name: "See the menu" }),
      rect.getByRole("button", { name: "Add" }),
      rect.getByRole("combobox", { name: "Party size" }).parentElement!,
    ]) {
      expect(radius(control)).toBe("4px");
    }
    const field = rect.getByRole("textbox", { name: "Email" });
    expect(radius(field.closest("[class*='radius-control']")!)).toBe("4px");
    expect(radius(rect.getByText("New").closest("[class*='radius-control']")!)).toBe("4px");
    expect(radius(canvas.getByTestId("knobs-rect").firstElementChild!)).toBe("3px");
  },
};
