import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import {
  FilterPanel,
  countFilterOptions,
  matchesFilterSelection,
  useFilterSelection,
  type FilterFacets,
  type FilterPanelGroup,
} from "./FilterPanel";

interface FilterableItem {
  id: string;
  title: string;
  facets: FilterFacets;
}

const sampleGroups: FilterPanelGroup[] = [
  {
    id: "topic",
    label: "Topic",
    options: [
      { value: "guides", label: "Guides" },
      { value: "notes", label: "Notes" },
      { value: "news", label: "News" },
    ],
  },
  {
    id: "year",
    label: "Year",
    options: [
      { value: "2026", label: "2026" },
      { value: "2025", label: "2025" },
    ],
  },
];

const sampleItems: FilterableItem[] = [
  { id: "brand-sprint", title: "How we scope a brand sprint", facets: { topic: "guides", year: "2026" } },
  { id: "design-system", title: "A design system that ships with the site", facets: { topic: "notes", year: "2026" } },
  { id: "writing-briefs", title: "Writing briefs people finish reading", facets: { topic: ["guides", "notes"], year: "2026" } },
  { id: "studio-notes", title: "Studio notes: the first year", facets: { topic: "news", year: "2025" } },
];

function itemsLabel(count: number) {
  return count === 1 ? "1 item" : `${count} items`;
}

function FilteredList({ items, groups }: { items: FilterableItem[]; groups: FilterPanelGroup[] }) {
  const [selection, setSelection] = useFilterSelection();
  const shown = items.filter((item) => matchesFilterSelection(item.facets, selection));

  return (
    <FilterPanel
      groups={countFilterOptions(groups, items, itemsLabel)}
      selection={selection}
      onSelectionChange={setSelection}
      resultsLabel={itemsLabel(shown.length)}
    >
      <div className="grid w-full max-w-[48rem] grid-cols-1 gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
        <FilterPanel.Trigger className="justify-self-start md:hidden" />
        <FilterPanel.Rail className="max-md:hidden" />
        <div>
          <p role="status" className="type-supporting text-muted">
            {itemsLabel(shown.length)}
          </p>
          <ul className="type-body m-0 mt-3 list-none p-0 text-fg">
            {shown.map((item) => (
              <li key={item.id} className="border-b border-border py-3">
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FilterPanel.Sheet />
    </FilterPanel>
  );
}

const meta = {
  title: "Components/FilterPanel",
  component: FilterPanel,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Checkbox filters for an index page: a side rail from tablet up, and the same groups in a bottom **Sheet** on phones, over one selection. **FilterPanel** renders no element — wrap the page in it and place its three parts on the page grid. The full pages are **Guides/Filter panel → Pattern — filtered index** and **Pattern — filtered grid**.

| Part | What it is |
|------|------------|
| **FilterPanel** | Holds \`groups\`, \`selection\` + \`onSelectionChange\`, and \`resultsLabel\` ("3 posts") |
| **FilterPanel.Rail** | \`aside\`: **SectionCaption** "Filters" with Clear all, over flush **Accordion** groups of **CheckboxGroup** with counts |
| **FilterPanel.Trigger** | **Button** \`secondary\` "Filters" with the number of options on; opens the Sheet |
| **FilterPanel.Sheet** | The same groups in a bottom **Sheet**; footer Clear all · Show 3 posts |

| Helper | What it does |
|--------|--------------|
| \`useFilterSelection({ defaultSelection, selection, onSelectionChange })\` | The selection: the page's own, or the app's (for example in the URL) |
| \`matchesFilterSelection(facets, selection)\` | Whether an item shows — alternatives within a group, combined across groups |
| \`countFilterOptions(groups, items, label)\` | The groups with each option's count over all items, and what it counts ("2 posts") |
| \`filterSelectionCount(selection)\` | How many options are on |

## Anatomy

\`\`\`
FilterPanel (context only)
├── FilterPanel.Trigger — Button · count          (className: where it shows, e.g. "md:hidden")
├── FilterPanel.Rail — aside[aria-labelledby]      (className: "hidden md:col-span-3 md:block")
│   ├── SectionCaption (h2) · end: Clear all (ghost, xs, disabled until a filter is on)
│   └── Accordion plain flush → Accordion.Item per group → CheckboxGroup (labelHidden, sm) → Item count
└── FilterPanel.Sheet — Sheet (bottom) → the same groups; footer Clear all · Show N
\`\`\`

## Best practices

- **Do** show the rail and the trigger at opposite breakpoints through \`className\` — one is always hidden.
- **Do** mount **FilterPanel.Sheet** once, anywhere inside **FilterPanel**.
- **Do** keep a visually hidden \`role="status"\` line with the shown count, so a change is announced.
- **Do** pass \`labels\` to translate "Filters", "Clear all", and "Show …".
- **Don't** write counts into option labels — pass \`count\` (or use \`countFilterOptions\`).
- **Don't** use it for a single choice — that is **Select** or **SegmentedControl**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof FilterPanel>;

export const Panel: Story = {
  name: "Pattern — filter panel",
  render: () => <FilteredList items={sampleItems} groups={sampleGroups} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "The rail beside a plain list from md; below md, a Filters button opens the same groups in a bottom Sheet.",
        },
      },
    },
    `
import {
  FilterPanel,
  countFilterOptions,
  matchesFilterSelection,
  useFilterSelection,
  type FilterFacets,
  type FilterPanelGroup,
} from "@thewhatmatters/wmds";

export interface FilterableItem {
  id: string;
  title: string;
  /** The item's options in each filter group, by group id. */
  facets: FilterFacets;
}

function itemsLabel(count: number) {
  return count === 1 ? "1 item" : \`\${count} items\`;
}

export function FilteredList({ items, groups }: { items: FilterableItem[]; groups: FilterPanelGroup[] }) {
  const [selection, setSelection] = useFilterSelection();
  const shown = items.filter((item) => matchesFilterSelection(item.facets, selection));

  return (
    <FilterPanel
      groups={countFilterOptions(groups, items, itemsLabel)}
      selection={selection}
      onSelectionChange={setSelection}
      resultsLabel={itemsLabel(shown.length)}
    >
      <div className="grid w-full max-w-[48rem] grid-cols-1 gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
        <FilterPanel.Trigger className="justify-self-start md:hidden" />
        <FilterPanel.Rail className="max-md:hidden" />
        <div>
          <p role="status" className="type-supporting text-muted">
            {itemsLabel(shown.length)}
          </p>
          <ul className="type-body m-0 mt-3 list-none p-0 text-fg">
            {shown.map((item) => (
              <li key={item.id} className="border-b border-border py-3">
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FilterPanel.Sheet />
    </FilterPanel>
  );
}
`,
  ),
};
