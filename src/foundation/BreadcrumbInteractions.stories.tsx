import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Breadcrumb, breadcrumbSlots, type BreadcrumbItemDef } from "../components/molecules/Breadcrumb/Breadcrumb";

/**
 * Browser interaction tests for **Breadcrumb** — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Breadcrumb",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const path: BreadcrumbItemDef[] = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Northwind Health", href: "#northwind" },
  { label: "Design system", href: "#design-system" },
  { label: "Components", href: "#components" },
  { label: "Breadcrumb" },
];

export const CollapsedPath: Story = {
  name: "a long path folds into a menu of links",
  render: () => (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={path} renderLink={(item) => <a href={item.href} data-router-link="" />} />
      <a href="#after">After the breadcrumb</a>
    </div>
  ),
  play: async ({ canvas }) => {
    // The slots: first, the folded middle, the last two.
    const slots = breadcrumbSlots(path, 4);
    expect(slots.map((slot) => (slot.kind === "more" ? `more:${slot.items.length}` : slot.item.label))).toEqual([
      "Home",
      "more:3",
      "Components",
      "Breadcrumb",
    ]);
    expect(breadcrumbSlots(path.slice(0, 3), 4)).toHaveLength(3);

    const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });
    const list = within(nav).getByRole("list");
    expect(within(list).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Home",
      "",
      "Components",
      "Breadcrumb",
    ]);
    const current = within(nav).getByText("Breadcrumb");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(within(nav).queryByRole("link", { name: "Breadcrumb" })).toBeNull();

    // Every crumb goes through renderLink.
    const home = within(nav).getByRole("link", { name: "Home" });
    expect(home).toHaveAttribute("href", "#home");
    expect(home).toHaveAttribute("data-router-link");

    // The "…" control opens a list of the folded links and moves focus into it.
    const more = within(nav).getByRole("button", { name: "Show 3 more pages" });
    expect(more).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(more);
    expect(more).toHaveAttribute("aria-expanded", "true");
    const menu = await waitFor(() => within(nav).getByRole("list", { name: "Show 3 more pages" }));
    const work = within(menu).getByRole("link", { name: "Work" });
    await waitFor(() => {
      expect(work).toHaveFocus();
    });
    expect(work).toHaveAttribute("data-router-link");
    expect(within(menu).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "#work",
      "#northwind",
      "#design-system",
    ]);

    // Arrow keys move between the links; Escape closes and returns focus to the control.
    await userEvent.keyboard("{ArrowDown}");
    expect(within(menu).getByRole("link", { name: "Northwind Health" })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(within(menu).getByRole("link", { name: "Design system" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(more).toHaveAttribute("aria-expanded", "false");
      expect(more).toHaveFocus();
    });

    // Arrow down on the control opens it too; tabbing out of the last link closes it.
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => {
      expect(within(nav).getByRole("link", { name: "Work" })).toHaveFocus();
    });
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await waitFor(() => {
      expect(more).toHaveAttribute("aria-expanded", "false");
    });
    expect(within(nav).queryByRole("list", { name: "Show 3 more pages" })).toBeNull();
  },
};

export const ShortPath: Story = {
  name: "a short path shows every crumb",
  render: () => (
    <Breadcrumb
      items={[{ label: "Home", href: "#home" }, { label: "Blog", href: "#blog" }, { label: "A post" }]}
      variant="mono"
      separator="slash"
    />
  ),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).queryByRole("button")).toBeNull();
    expect(within(nav).getAllByRole("link").map((link) => link.textContent)).toEqual(["Home", "Blog"]);
    expect(within(nav).getByText("A post")).toHaveAttribute("aria-current", "page");
  },
};
