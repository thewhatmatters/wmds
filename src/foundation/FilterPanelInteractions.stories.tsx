import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { FilteredIndex, sampleGroups, samplePosts } from "../guides/FilterPanel/FilterPanelExample";

/**
 * Browser interaction tests for **Guides/Filter panel → Pattern — filtered index** — run via
 * `npm run test:interactions`. The side panel and the phone Sheet share the same filter state; the
 * test reaches whichever one is off screen at this width with a direct click.
 */
const meta = {
  title: "Internal/Interactions/Filter panel",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function postTitles(canvasElement: HTMLElement) {
  const list = within(canvasElement).queryByRole("list", { name: "Posts" });
  return list == null ? [] : within(list).getAllByRole("heading").map((heading) => heading.textContent);
}

export const PanelFiltersAndClears: Story = {
  name: "the side panel filters the list, counts, and clears",
  render: () => <FilteredIndex title="Blog" posts={samplePosts} groups={sampleGroups} />,
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector<HTMLElement>("aside");
    if (panel == null) throw new Error("Filter panel is missing");
    const status = within(canvasElement).getByRole("status");
    expect(status).toHaveTextContent("4 posts");
    expect(postTitles(canvasElement)).toHaveLength(4);

    // Counts are read with the label; Clear all waits for a filter.
    const guides = within(panel).getByRole("checkbox", { name: "Guides (2 posts)", hidden: true });
    const clear = within(panel).getByRole("button", { name: "Clear all", hidden: true });
    expect(clear).toBeDisabled();

    guides.click();
    await waitFor(() => {
      expect(guides).toBeChecked();
    });
    expect(status).toHaveTextContent("2 posts");
    expect(postTitles(canvasElement)).toEqual(["How we scope a brand sprint", "Writing briefs people finish reading"]);
    expect(clear).toBeEnabled();

    // Groups combine: Guides from 2025 matches nothing, and the empty slot takes the list's place.
    within(panel).getByRole("checkbox", { name: "2025 (1 post)", hidden: true }).click();
    await waitFor(() => {
      expect(status).toHaveTextContent("0 posts");
    });
    expect(postTitles(canvasElement)).toEqual([]);
    expect(within(canvasElement).getByText("No posts match these filters.")).toBeInTheDocument();

    clear.click();
    await waitFor(() => {
      expect(status).toHaveTextContent("4 posts");
    });
    expect(guides).not.toBeChecked();
    expect(clear).toBeDisabled();

    // A collapsed group's options leave the tab order.
    const topic = within(panel).getByRole("button", { name: "Topic", hidden: true });
    topic.click();
    await waitFor(() => {
      expect(topic).toHaveAttribute("aria-expanded", "false");
    });
    const collapse = document.getElementById(topic.getAttribute("aria-controls") ?? "")?.parentElement;
    if (collapse == null) throw new Error("Topic panel is missing");
    await waitFor(() => {
      expect(getComputedStyle(collapse).visibility).toBe("hidden");
    });
  },
};

export const SheetFiltersOnPhones: Story = {
  name: "the Filters button opens the same groups in a Sheet",
  render: () => <FilteredIndex title="Blog" posts={samplePosts} groups={sampleGroups} />,
  play: async ({ canvasElement }) => {
    // Hidden from md up, where the side panel shows; the Sheet works at any width.
    const filters = [...canvasElement.querySelectorAll<HTMLButtonElement>("header button")].find((button) =>
      button.textContent?.startsWith("Filters"),
    );
    if (filters == null) throw new Error("Filters button is missing");
    filters.click();
    const sheet = await waitFor(() => within(document.body).getByRole("dialog", { name: "Filters" }));

    await userEvent.click(within(sheet).getByRole("checkbox", { name: "Notes (1 post)" }));
    expect(within(sheet).getByRole("checkbox", { name: "Notes (1 post)" })).toBeChecked();
    expect(within(canvasElement).getByRole("status")).toHaveTextContent("1 post");
    // The page's Filters button shows how many filters are on.
    expect(filters).toHaveTextContent("1");

    await userEvent.click(within(sheet).getByRole("button", { name: "Show 1 post" }));
    await waitFor(() => {
      expect(within(document.body).queryByRole("dialog", { name: "Filters" })).toBeNull();
    });
    expect(postTitles(canvasElement)).toEqual(["A design system that ships with the site"]);

    // The side panel holds the same selection.
    const panel = canvasElement.querySelector<HTMLElement>("aside");
    if (panel == null) throw new Error("Filter panel is missing");
    expect(within(panel).getByRole("checkbox", { name: "Notes (1 post)", hidden: true })).toBeChecked();
  },
};
