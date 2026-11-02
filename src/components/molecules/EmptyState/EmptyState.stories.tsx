import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderOpen, SearchX } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../atoms/Button/Button";
import { Chip, ChipFilterGroup } from "../Chip/Chip";
import { IndexList } from "../IndexList/IndexList";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

What takes a list’s place when there’s nothing in it (Empty states, Rule 22). The page around it stays: heading, search and filters. It looks different from loading (**Skeleton**) and from an error. Every \`empty\` slot (TileGrid, IndexList, TaskRows, LogView) turns a plain string into an EmptyState; CalEmbed’s empty state is one.

| Kind | Sentence template | Action |
|------|-------------------|--------|
| \`first-use\` | "No [things] yet." + "[Things] you [verb] show up here." | The main action (secondary if the page has a primary) |
| \`no-results\` | "No [things] match [the words or filters]." | **Clear filters** (\`onClearFilters\`, required) |
| \`done\` | "You’re all caught up." / "Nothing waiting." | None |

## Best practices

- **Do** name the search words or filters in \`no-results\`, and announce the count on the list (\`resultsLabel\`: "0 projects match").
- **Do** keep it to a title, one line and one action, plus a quiet "Learn more" at most.
- **Do** use a 24px icon only when it names the thing. **Don’t** add illustrations.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstUse: Story = {
  name: "Kind — first use",
  args: {
    kind: "first-use",
    icon: <FolderOpen strokeWidth={2} />,
    title: "No projects yet",
    description: "Projects you start show up here, with their status and next step.",
    action: <Button role="primary">Start a project</Button>,
  },
};

export const NoResults: Story = {
  name: "Kind — no results",
  args: {
    kind: "no-results",
    icon: <SearchX strokeWidth={2} />,
    title: "No work matches Restaurants and Video",
    description: "Try fewer filters, or clear them to see everything.",
    onClearFilters: () => undefined,
  },
};

export const Done: Story = {
  name: "Kind — done",
  args: { kind: "done", title: "You’re all caught up", description: "New requests show up here." },
};

const work = [
  { id: "1", title: "Cinder & Sotol site", tags: ["Restaurants"] },
  { id: "2", title: "Barton Bakehouse video", tags: ["Video"] },
  { id: "3", title: "Eastside menu photos", tags: ["Restaurants"] },
];

function FilteredWork() {
  const [query, setQuery] = useState<string[]>([]);
  const shown = work.filter((item) => query.every((tag) => item.tags.includes(tag)));
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <h2 className="type-heading-3 text-fg">Our work</h2>
      {/* Chips, not Buttons: a filter's selected look is part of the empty result (Z4, Choices C9). */}
      <ChipFilterGroup aria-label="Filters" value={query} onValueChange={(next) => setQuery(next as string[])}>
        {["Restaurants", "Video"].map((tag) => (
          <Chip key={tag} value={tag}>
            {tag}
          </Chip>
        ))}
      </ChipFilterGroup>
      <IndexList
        aria-label="Work"
        resultsLabel={shown.length === 0 ? "0 projects match" : `${shown.length} projects`}
        empty={
          <EmptyState
            kind="no-results"
            title={`No work matches ${query.join(" and ")}`}
            onClearFilters={() => setQuery([])}
          />
        }
      >
        {shown.map((item) => (
          <IndexList.Item key={item.id} title={item.title} />
        ))}
      </IndexList>
    </div>
  );
}

export const FilterToZero: Story = {
  name: "Pattern — filter to zero",
  args: { title: "" },
  render: () => <FilteredWork />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Restaurants" }));
    await userEvent.click(canvas.getByRole("button", { name: "Video" }));
    // Both filters read as selected, so the empty result points back at them.
    await expect(canvas.getByRole("button", { name: "Restaurants" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Video" })).toHaveAttribute("aria-pressed", "true");
    // The page stays (heading, filters); the empty state names the filters and the count is announced.
    await expect(canvas.getByRole("heading", { name: "Our work" })).toBeVisible();
    await expect(canvas.getByText("No work matches Restaurants and Video")).toBeVisible();
    await expect(canvas.getByRole("status")).toHaveTextContent("0 projects match");
    await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("3 projects");
    await expect(canvas.getByRole("button", { name: "Video" })).toHaveAttribute("aria-pressed", "false");
  },
};
