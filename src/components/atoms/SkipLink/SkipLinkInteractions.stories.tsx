import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { TextLink } from "../TextLink/TextLink";
import { SkipLink } from "./SkipLink";

/**
 * Browser interaction tests for SkipLink — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/SkipLink",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const box = (element: Element) => element.getBoundingClientRect();

export const FirstTabStop: Story = {
  name: "the first Tab shows the link over a fixed bar; Enter moves the focus into main",
  render: () => (
    <div>
      <SkipLink />
      {/* A fixed bar at the layer SiteNav uses: the shown link must sit over it. */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-6 border-b border-border bg-body px-6">
        <TextLink href="#menu" variant="quiet">
          Menu
        </TextLink>
        <TextLink href="#visit" variant="quiet">
          Visit
        </TextLink>
      </header>
      <main id="main" className="px-6 pt-24 outline-none">
        <h1 className="type-heading-2 m-0 text-fg">Wood-fired, every night</h1>
        <p className="type-body">
          <TextLink href="#book">Book a table</TextLink>
        </p>
      </main>
    </div>
  ),
  play: async ({ canvas }) => {
    const skip = canvas.getByRole("link", { name: "Skip to content" });
    const main = canvas.getByRole("main");

    // Out of sight until it has the focus: one clipped pixel, still in the Tab order.
    await expect(box(skip).width).toBeLessThanOrEqual(1);
    await expect(main).not.toHaveAttribute("tabindex");

    await userEvent.tab();
    await expect(skip).toHaveFocus();
    await waitFor(() => expect(box(skip).height).toBeGreaterThanOrEqual(44));
    await expect(getComputedStyle(skip).position).toBe("fixed");
    await expect(box(skip).top).toBe(16);
    await expect(box(skip).left).toBe(16);
    // Drawn over the fixed bar, not under it.
    const centre = { x: box(skip).left + box(skip).width / 2, y: box(skip).top + box(skip).height / 2 };
    await expect(document.elementFromPoint(centre.x, centre.y)).toBe(skip);

    await userEvent.keyboard("{Enter}");
    await expect(main).toHaveFocus();
    await expect(main).toHaveAttribute("tabindex", "-1");
    await expect(window.location.hash).toBe("");
    // Hidden again once the focus has left it.
    await waitFor(() => expect(box(skip).width).toBeLessThanOrEqual(1));

    // The next Tab starts inside main, past the header's links.
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Book a table" })).toHaveFocus();
  },
};

export const OwnTarget: Story = {
  name: "a second link jumps to its own region",
  render: () => (
    <div className="p-6">
      <SkipLink target="results">Skip to results</SkipLink>
      <div className="flex gap-4">
        <TextLink href="#open">Open now</TextLink>
        <TextLink href="#patio">Patio</TextLink>
      </div>
      <section id="results" aria-label="Results" className="pt-4 outline-none">
        <TextLink href="#one">First result</TextLink>
      </section>
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab();
    const skip = canvas.getByRole("link", { name: "Skip to results" });
    await expect(skip).toHaveFocus();
    await expect(skip).toHaveAttribute("href", "#results");
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("region", { name: "Results" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "First result" })).toHaveFocus();
  },
};
