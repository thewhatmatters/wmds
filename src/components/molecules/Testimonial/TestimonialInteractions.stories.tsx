import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Testimonial } from "./Testimonial";

/**
 * Browser interaction tests for Testimonial — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Testimonial",
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
const slots = (canvasElement: HTMLElement, name: string) => [
  ...canvasElement.querySelectorAll<HTMLElement>(`[data-slot="${name}"]`),
];

const short = "They fixed in an afternoon what two other crews couldn't find in a month.";
const long =
  "We called on a Sunday night with water coming through the kitchen ceiling. They were at the door within the hour, found the leak behind the upstairs bath, and had it stopped before midnight. The next morning they came back to patch the ceiling and wouldn't take a cent more than the quote.";

function Row() {
  return (
    <ul role="list" className="m-0 grid list-none grid-cols-1 gap-6 p-4 md:grid-cols-3">
      <li className="flex">
        <Testimonial quote={short} name="Dana Whitfield" detail="Round Rock" rating={5} source="Google review" />
      </li>
      <li className="flex">
        <Testimonial quote={long} name="Marcus Oyelaran" detail="Cedar Park" rating={5} source="Google review" />
      </li>
      <li className="flex">
        <Testimonial quote="On time and tidy." name="Priya Raman" detail="Leander" rating={4} source="Google review" />
      </li>
    </ul>
  );
}

export const RowLinesUp: Story = {
  name: "in a row the cards share a height, the people sit along the bottom, and a long quote is smaller",
  globals: { viewport: { value: "desktop1280", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => <Row />,
  play: async ({ canvas, canvasElement }) => {
    const cards = slots(canvasElement, "testimonial").map((figure) => figure.parentElement!);
    expect(cards).toHaveLength(3);
    const heights = cards.map((card) => Math.round(box(card).height));
    expect(new Set(heights).size).toBe(1);

    const names = slots(canvasElement, "name");
    const bottoms = names.map((name) => Math.round(box(name).top));
    expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeLessThanOrEqual(1);

    const quotes = slots(canvasElement, "quote");
    const sizes = quotes.map((quote) => parseFloat(getComputedStyle(quote).fontSize));
    expect(sizes[1]).toBeLessThan(sizes[0]!);
    expect(sizes[2]).toBe(sizes[0]);

    // The stars are one named picture each; the source is small capitals at the caption's end.
    expect(canvas.getAllByRole("img", { name: "Rated 5 out of 5" })).toHaveLength(2);
    expect(canvas.getByRole("img", { name: "Rated 4 out of 5" })).toBeVisible();
    const [source] = slots(canvasElement, "source");
    expect(getComputedStyle(source!).textTransform).toBe("uppercase");
    expect(box(source!).left).toBeGreaterThan(box(names[0]!).right);
  },
};

export const OnAPhone: Story = {
  name: "at 390 the cards stack, long words wrap inside the card, and nothing scrolls sideways",
  globals: { viewport: { value: "phone390", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Testimonial
        quote="Supercalifragilisticexpialidocious-level-service-from-start-to-finish, honestly."
        name="Bartholomew Featherstonehaugh-Cholmondeley"
        detail="Owner, The Corner Bakery and Coffee Roasters of Round Rock"
        rating={5}
        source="Google review"
      />
      <Testimonial quote={long} name="Marcus Oyelaran" detail="Cedar Park" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThanOrEqual(400);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
    const [first, second] = slots(canvasElement, "testimonial").map((figure) => figure.parentElement!);
    expect(box(second!).top).toBeGreaterThanOrEqual(box(first!).bottom);
    for (const part of ["quote", "name", "detail", "source"]) {
      for (const element of slots(canvasElement, part)) {
        const card = element.closest('[data-slot="testimonial"]')!.parentElement!;
        expect(box(element).left).toBeGreaterThanOrEqual(box(card).left);
        expect(box(element).right).toBeLessThanOrEqual(box(card).right + 0.5);
      }
    }
  },
};
