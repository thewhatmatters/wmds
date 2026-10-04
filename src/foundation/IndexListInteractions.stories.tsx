import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import { IndexList } from "../components/molecules/IndexList/IndexList";

/**
 * Browser interaction tests for **IndexList** — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/IndexList",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const posts = [
  { slug: "a", title: "How we scope a brand sprint", date: "2026-09-14", label: "Sep 14, 2026", description: "Two weeks." },
  { slug: "b", title: "Writing briefs people finish reading", date: "2026-06-21", label: "Jun 21, 2026", description: "Short sentences." },
];

function Harness() {
  const [shown, setShown] = useState(posts);
  return (
    <div className="flex w-[56rem] flex-col gap-4">
      <Button role="secondary" size="sm" className="self-start" onClick={() => setShown(shown.length > 0 ? [] : posts)}>
        Toggle rows
      </Button>
      <IndexList
        aria-label="Posts"
        captions={{ meta: "Date", title: "Name" }}
        empty={<p className="type-body text-muted">No posts match these filters.</p>}
      >
        {shown.map((post) => (
          <IndexList.Item
            key={post.slug}
            title={post.title}
            href={`#${post.slug}`}
            meta={<time dateTime={post.date}>{post.label}</time>}
            preview={<p>{post.description}</p>}
          />
        ))}
      </IndexList>
    </div>
  );
}

export const RowsCaptionsAndPreview: Story = {
  name: "rows link, captions share the tracks, previews expand",
  render: () => <Harness />,
  play: async ({ canvas, canvasElement }) => {
    const list = canvas.getByRole("list", { name: "Posts" });
    const rows = within(list).getAllByRole("listitem");
    expect(rows).toHaveLength(2);

    // Each title is a heading that links.
    const heading = within(rows[0]).getByRole("heading", { level: 2, name: "How we scope a brand sprint" });
    const link = within(heading).getByRole("link", { name: "How we scope a brand sprint" });
    expect(link).toHaveAttribute("href", "#a");

    // Captions sit over their columns.
    const captions = canvasElement.querySelector<HTMLElement>("[data-index-list-captions]");
    if (captions == null) throw new Error("Captions are missing");
    expect(captions).toHaveAttribute("aria-hidden", "true");
    const [metaCaption, titleCaption] = [...captions.children] as HTMLElement[];
    const time = rows[0].querySelector("time");
    if (time == null) throw new Error("Meta is missing");
    expect(metaCaption.getBoundingClientRect().left).toBeCloseTo(time.getBoundingClientRect().left, 0);
    expect(titleCaption.getBoundingClientRect().left).toBeCloseTo(heading.getBoundingClientRect().left, 0);

    // A quiet link draws its underline on focus only.
    expect(getComputedStyle(link).textDecorationColor).toBe("rgba(0, 0, 0, 0)");
    link.focus();
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    expect(link).toHaveFocus();
    await waitFor(() => {
      expect(getComputedStyle(link).textDecorationColor).toBe(getComputedStyle(link).color);
    });

    // The preview control expands the panel under the title; closed, it leaves the tab order.
    const toggle = within(rows[0]).getByRole("button", { name: "Preview: How we scope a brand sprint" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    if (panel == null) throw new Error("Preview panel is missing");
    expect(getComputedStyle(panel.parentElement ?? panel).visibility).toBe("hidden");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => {
      expect(getComputedStyle(panel.parentElement ?? panel).visibility).toBe("visible");
      expect(getComputedStyle(panel.parentElement ?? panel).opacity).toBe("1");
    });
    expect(panel).toHaveTextContent("Two weeks.");
    expect(panel.getBoundingClientRect().left).toBeCloseTo(heading.getBoundingClientRect().left, 0);

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => {
      expect(getComputedStyle(panel.parentElement ?? panel).visibility).toBe("hidden");
    });
  },
};

export const EmptyState: Story = {
  name: "the empty slot replaces the rows and captions",
  render: () => <Harness />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Toggle rows" }));
    expect(canvas.queryByRole("list", { name: "Posts" })).toBeNull();
    expect(canvasElement.querySelector("[data-index-list-captions]")).toBeNull();
    expect(canvas.getByText("No posts match these filters.")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Toggle rows" }));
    expect(within(canvas.getByRole("list", { name: "Posts" })).getAllByRole("listitem")).toHaveLength(2);
    expect(canvas.queryByText("No posts match these filters.")).toBeNull();
  },
};
