import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { FilterPanelPage } from "./FilterPanelExample";

const meta = {
  title: "Guides/Filter panel",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

A filtered index page — a side panel of checkbox filters beside an **IndexList**. Copy **Pattern — filtered index** for a blog, case studies, or resources: pass the posts and the filter groups; the page filters, counts, and clears.

A post can carry one option or several per group (\`facets: { topic: ["guides", "brand"] }\`). Within a group the options on are alternatives — a post shows when it has any of them; across groups they combine. The page can open filtered (\`defaultSelection\`, for example from \`/blog?topic=guides\`), or the app can hold the selection (\`selection\` + \`onSelectionChange\`, for example in the URL).

| Part | Component | Why |
|------|-----------|-----|
| Panel title | **SectionCaption** with Clear all in \`end\` | Small uppercase mono caption on a rule, level with the list's column captions |
| Groups | **Accordion** \`variant="plain"\` \`flush\` | Each group collapses; a closed group leaves the tab order |
| Options | **CheckboxGroup** + **CheckboxGroup.Item** \`count\` | Multi-select with a muted result count per option, read as "Guides (2 posts)" |
| Clear all | **Button** \`role="ghost"\` \`size="xs"\` in the caption's \`end\` | Disabled until a filter is on |
| Results | **IndexList** with \`empty\` | Dated rows; the empty slot covers a filter with no matches |
| Phones | **Button** \`count\` → **Sheet** (bottom) | The same groups in a drawer, with Clear all and Show N posts |

## Anatomy

\`\`\`
main.grid-page
└── band
    ├── header (col-span-full) — h1 with the shown count · Filters button (below md)
    ├── p[role=status].sr-only — "3 posts" after each change
    ├── aside (md:col-span-3, hidden below md)
    │   ├── SectionCaption "Filters" (h2) · end: Clear all
    │   └── Accordion plain flush → Accordion.Item per group → CheckboxGroup (labelHidden, sm)
    ├── div (md:col-span-5 lg:col-span-9) → IndexList (captions, empty)
    └── Sheet → Sheet.Content "Filters" → the same groups; footer Clear all · Show N posts
\`\`\`

The panel's rule sits level with the list's caption rule. \`flush\` drops the accordion's inset, so group labels line up with the panel title, counts end at the column's edge, and the dividers match the panel's rule.

## Best practices

- **Do** count each option over all posts and pass \`countLabel\` ("2 posts") so the spoken count says what it counts.
- **Do** keep the shown count in a visually hidden status line so a filter change is announced.
- **Do** keep the groups open by default; collapse is for long panels.
- **Don't** write the count into the option label ("Guides (2)") — use \`count\`.
- **Do** open the page filtered when a link asks for it: a category tag linking to \`/blog?topic=guides\` passes \`defaultSelection={{ topic: ["guides"] }}\`.
- **Do** hold the selection in the URL (\`selection\` + \`onSelectionChange\`) only when filtered views need their own links; otherwise leave it to the pattern.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilteredIndex: Story = {
  name: "Pattern — filtered index",
  render: () => <FilterPanelPage />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Check an option to filter the list; Clear all resets it. Below md the panel becomes a Filters button that opens a bottom Sheet. Open Layout to change the grid width or column gap live; Show code omits the Storybook-only inspector.",
        },
      },
    },
    `
import { useId, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Accordion, Button, CheckboxGroup, IndexList, SectionCaption, Sheet } from "@thewhatmatters/wmds";

export interface FilterGroupDef {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface FilteredPost {
  slug: string;
  title: string;
  href: string;
  /** ISO date, for the time element. */
  date: string;
  /** The date as readers see it, for example "Sep 14, 2026". */
  dateLabel: string;
  description: string;
  /** The post's options in each filter group, by group id — one or several, for example { topic: ["guides", "brand"] }. */
  facets: Record<string, string | string[]>;
}

/** The options on in each group, by group id — for example { topic: ["guides"] }. */
export type FilterSelection = Record<string, string[]>;

function postsLabel(count: number) {
  return count === 1 ? "1 post" : \`\${count} posts\`;
}

function facetValues(post: FilteredPost, groupId: string): string[] {
  const value = post.facets[groupId];
  return value == null ? [] : Array.isArray(value) ? value : [value];
}

/** A post shows when, in every group with options on, it has at least one of them. */
function matches(post: FilteredPost, groups: FilterGroupDef[], selection: FilterSelection) {
  return groups.every((group) => {
    const values = selection[group.id] ?? [];
    return values.length === 0 || facetValues(post, group.id).some((value) => values.includes(value));
  });
}

function FilterGroups({
  groups,
  posts,
  selection,
  onGroupChange,
}: {
  groups: FilterGroupDef[];
  posts: FilteredPost[];
  selection: FilterSelection;
  onGroupChange: (groupId: string, values: string[]) => void;
}) {
  return (
    <Accordion variant="plain" flush>
      {groups.map((group) => (
        <Accordion.Item key={group.id} label={group.label} defaultOpen>
          <CheckboxGroup
            label={group.label}
            labelHidden
            size="sm"
            values={selection[group.id] ?? []}
            onValuesChange={(values) => onGroupChange(group.id, values)}
          >
            {group.options.map((option) => {
              const count = posts.filter((post) => facetValues(post, group.id).includes(option.value)).length;
              return (
                <CheckboxGroup.Item
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  count={count}
                  countLabel={postsLabel(count)}
                />
              );
            })}
          </CheckboxGroup>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export interface FilteredIndexProps {
  title: string;
  posts: FilteredPost[];
  groups: FilterGroupDef[];
  /** The filters on when the page opens — for example { topic: ["guides"] } from /blog?topic=guides. */
  defaultSelection?: FilterSelection;
  /** The filters on, when the app holds them — for example in the URL. Pass with onSelectionChange. */
  selection?: FilterSelection;
  /** Every change: an option on or off, or Clear all. */
  onSelectionChange?: (selection: FilterSelection) => void;
}

export function FilteredIndex({
  title,
  posts,
  groups,
  defaultSelection,
  selection: selectionProp,
  onSelectionChange,
}: FilteredIndexProps) {
  const filtersHeadingId = useId();
  const [ownSelection, setOwnSelection] = useState<FilterSelection>(defaultSelection ?? {});
  const selection = selectionProp ?? ownSelection;
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = Object.values(selection).reduce((total, values) => total + values.length, 0);
  const shown = posts.filter((post) => matches(post, groups, selection));

  function changeSelection(next: FilterSelection) {
    if (selectionProp == null) setOwnSelection(next);
    onSelectionChange?.(next);
  }

  function setGroup(groupId: string, values: string[]) {
    changeSelection({ ...selection, [groupId]: values });
  }

  return (
    <main className="grid-page bg-body">
      <div className="band py-6 sm:py-10 lg:py-14">
        <header className="col-span-full mb-4 flex items-end justify-between gap-4 sm:mb-8">
          <h1 className="type-display-2 text-fg">
            {title} <span className="tabular-nums text-muted">{shown.length}</span>
          </h1>
          <Button
            role="secondary"
            icon={<SlidersHorizontal />}
            count={activeCount > 0 ? activeCount : undefined}
            className="md:hidden"
            onClick={() => setSheetOpen(true)}
          >
            Filters
          </Button>
        </header>
        <p role="status" className="sr-only">
          {postsLabel(shown.length)}
        </p>

        <aside aria-labelledby={filtersHeadingId} className="hidden md:col-span-3 md:block">
          <SectionCaption
            id={filtersHeadingId}
            end={
              <Button role="ghost" size="xs" disabled={activeCount === 0} onClick={() => changeSelection({})}>
                Clear all
              </Button>
            }
          >
            Filters
          </SectionCaption>
          <FilterGroups groups={groups} posts={posts} selection={selection} onGroupChange={setGroup} />
        </aside>

        <div className="col-span-full md:col-span-5 lg:col-span-9">
          <IndexList
            aria-label="Posts"
            captions={{ meta: "Date", title: "Name" }}
            empty={<p className="type-body text-muted">No posts match these filters.</p>}
          >
            {shown.map((post) => (
              <IndexList.Item
                key={post.slug}
                title={post.title}
                href={post.href}
                meta={<time dateTime={post.date}>{post.dateLabel}</time>}
                preview={<p>{post.description}</p>}
              />
            ))}
          </IndexList>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <Sheet.Content
          title="Filters"
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button role="secondary" size="sm" disabled={activeCount === 0} onClick={() => changeSelection({})}>
                Clear all
              </Button>
              <Button role="primary" size="sm" onClick={() => setSheetOpen(false)}>
                Show {postsLabel(shown.length)}
              </Button>
            </div>
          }
        >
          <FilterGroups groups={groups} posts={posts} selection={selection} onGroupChange={setGroup} />
        </Sheet.Content>
      </Sheet>
    </main>
  );
}
`,
  ),
};

export const StartingSelection: Story = {
  name: "Starting selection",
  render: () => <FilterPanelPage defaultSelection={{ topic: ["notes"] }} />,
  parameters: {
    docs: {
      description: {
        story:
          "`defaultSelection={{ topic: [\"notes\"] }}` — the page opens on Notes, as from a category tag linking to `/blog?topic=notes`. The brief carries two topics, Guides and Notes, so it shows under either.",
      },
    },
  },
};
