import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { PriceList } from "./PriceList";

/**
 * Browser interaction tests for PriceList — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/PriceList",
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

const longNote = "Chopped clams, roasted garlic, oregano, pecorino, chili flake, lemon and a lot of olive oil";

function MenuSpecimen() {
  return (
    <div className="p-4" data-testid="page">
      <PriceList size="lg" aria-label="Pizzas">
        <PriceList.Item name="Margherita" note="Tomato, fresh mozzarella, basil" price="$18" />
        <PriceList.Item name="White clam" note={longNote} price="$24" />
        <PriceList.Item name="Supercalifragilisticexpialidocious-pepperoni-special" price="$4.50 a slice, $32 a pie" />
        <PriceList.Item name="Cheese slice" price="$4.50" />
      </PriceList>
    </div>
  );
}

const box = (element: Element) => element.getBoundingClientRect();
const slot = (row: Element, name: string) => row.querySelector(`[data-slot="${name}"]`)!;

/** Nothing leaves the list or the page, at any width. */
function expectNoSidewaysScroll(canvasElement: HTMLElement) {
  const list = canvasElement.querySelector("ul")!;
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
  for (const part of list.querySelectorAll("[data-slot]")) {
    expect(box(part).left).toBeGreaterThanOrEqual(box(list).left - 0.5);
    expect(box(part).right).toBeLessThanOrEqual(box(list).right + 0.5);
  }
}

export const WrapsOnAPhone: Story = {
  name: "at 390 a row wraps: the note under the name, the price at the row's end, no sideways scroll",
  globals: { viewport: { value: "phone390", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => <MenuSpecimen />,
  play: async ({ canvas, canvasElement }) => {
    expect(window.innerWidth).toBeLessThanOrEqual(400);
    const list = canvas.getByRole("list", { name: "Pizzas" });
    const rows = canvas.getAllByRole("listitem");
    expect(rows).toHaveLength(4);
    expectNoSidewaysScroll(canvasElement);

    for (const row of rows) {
      const name = slot(row, "name");
      const price = slot(row, "price");
      // The price ends on the list's edge, on the name's first line.
      expect(Math.abs(box(price).right - box(list).right)).toBeLessThan(1);
      expect(box(price).left).toBeGreaterThanOrEqual(box(name).right - 0.5);
      expect(Math.abs(box(price).top - box(name).top)).toBeLessThan(8);
      const note = row.querySelector('[data-slot="note"]');
      if (note) {
        expect(box(note).top).toBeGreaterThanOrEqual(box(name).bottom - 0.5);
        expect(Math.abs(box(note).left - box(name).left)).toBeLessThan(1);
      }
      // One rule under each row.
      expect(getComputedStyle(row).borderBottomWidth).toBe("1px");
      expect(getComputedStyle(row).borderTopWidth).toBe("0px");
    }
    // A long price wraps in its own track; the name keeps most of the row.
    const long = rows[2]!;
    expect(box(slot(long, "price")).width).toBeLessThanOrEqual(box(list).width * 0.4 + 1);
    expect(box(slot(long, "name")).width).toBeGreaterThan(box(list).width * 0.5);
    // Read in order: name, note, price.
    expect(rows[0]!.textContent).toBe("MargheritaTomato, fresh mozzarella, basil$18");
    expect(getComputedStyle(slot(rows[0]!, "price")).fontVariantNumeric).toContain("tabular-nums");
  },
};

export const OneLineOnDesktop: Story = {
  name: "from md the name, note and price share one line, and prices and notes line up down the list",
  globals: { viewport: { value: "desktop1280", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => <MenuSpecimen />,
  play: async ({ canvas, canvasElement }) => {
    expect(window.innerWidth).toBeGreaterThanOrEqual(768);
    const list = canvas.getByRole("list", { name: "Pizzas" });
    const rows = canvas.getAllByRole("listitem");
    expectNoSidewaysScroll(canvasElement);

    const first = rows[0]!;
    const [name, note, price] = [slot(first, "name"), slot(first, "note"), slot(first, "price")];
    expect(Math.abs(box(note).top - box(name).top)).toBeLessThan(8);
    expect(box(note).left).toBeGreaterThanOrEqual(box(name).right - 0.5);
    expect(box(price).left).toBeGreaterThanOrEqual(box(note).right - 0.5);
    // Rows share the list's columns.
    const noteLefts = rows.flatMap((row) => [...row.querySelectorAll('[data-slot="note"]')].map((el) => box(el).left));
    expect(Math.max(...noteLefts) - Math.min(...noteLefts)).toBeLessThan(1);
    for (const row of rows) expect(Math.abs(box(slot(row, "price")).right - box(list).right)).toBeLessThan(1);
  },
};

export const StackedStaysStacked: Story = {
  name: "stacked keeps the note under the name on desktop too",
  globals: { viewport: { value: "desktop1280", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="p-4">
      <PriceList layout="stacked" rule="none" aria-label="Sides">
        <PriceList.Item name="Garlic knots" note="Six, with marinara" price="$7" />
      </PriceList>
    </div>
  ),
  play: async ({ canvas }) => {
    const row = canvas.getByRole("listitem");
    expect(box(slot(row, "note")).top).toBeGreaterThanOrEqual(box(slot(row, "name")).bottom - 0.5);
    expect(getComputedStyle(row).borderBottomWidth).toBe("0px");
  },
};
