import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { lockedViewportStory } from "../../lib/viewports";
import { FilterPanelPage, FilteredGridPage } from "./FilterPanelExample";

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

A filtered index page — a side panel of checkbox filters beside the results. Two patterns share the panel, the page header, and the selection props; only the main column differs:

| Pattern | Main column | For |
|---------|-------------|-----|
| **Pattern — filtered index** | **IndexList** — dated rows | A blog, case studies |
| **Pattern — filtered grid** | **TileGrid** of **LinkTile** — image tiles that link out | Resources, a link library |

An item can carry one option or several per group (\`facets: { topic: ["guides", "brand"] }\`). Within a group the options on are alternatives — an item shows when it has any of them; across groups they combine. The page can open filtered (\`defaultSelection\`, for example from \`/blog?topic=guides\`), or the app can hold the selection (\`selection\` + \`onSelectionChange\`, for example in the URL).

| Part | Component | Why |
|------|-----------|-----|
| Panel | **FilterPanel.Rail** | Caption with Clear all, over collapsible checkbox groups with counts |
| Phones | **FilterPanel.Trigger** → **FilterPanel.Sheet** | The same groups in a bottom drawer, with Clear all and Show N |
| State | \`useFilterSelection\`, \`matchesFilterSelection\`, \`countFilterOptions\` | The selection, which items show, and each option's count |
| Results, as rows | **IndexList** with \`empty\` | Dated rows; the empty slot covers a filter with no matches |
| Results, as tiles | **SectionCaption** over **TileGrid** with \`empty\` | Tiles pack (\`masonry\`) or sit in equal rows (\`uniform\`) |
| A tile | **LinkTile** | One link: the image, the name, the domain, an optional **Badge** tag |
| Page layers | \`overlay\` | Page-level children inside the page grid — a **GridOverlay** |

## Anatomy

\`\`\`
FilterPanel (no element — holds the groups, the selection, and the Sheet's open state)
└── main.grid-page
    ├── {overlay}
    ├── band
    │   ├── header (col-span-full) — h1 with the shown count · FilterPanel.Trigger (below md)
    │   ├── p[role=status].sr-only — "3 posts" after each change
    │   ├── FilterPanel.Rail (aside, md:col-span-3, hidden below md)
    │   └── div (md:col-span-5 lg:col-span-9)
    │       ├── filtered index → IndexList (captions, empty)
    │       └── filtered grid  → SectionCaption (h2) · TileGrid (empty) → TileGrid.Item → LinkTile
    └── FilterPanel.Sheet
\`\`\`

The panel's rule sits level with the main column's caption rule.

## Best practices

- **Do** count each option over all items (\`countFilterOptions\`) and pass it a label ("2 posts") so the spoken count says what it counts.
- **Do** keep the shown count in a visually hidden status line so a filter change is announced.
- **Do** open the page filtered when a link asks for it: a category tag linking to \`/blog?topic=guides\` passes \`defaultSelection={{ topic: ["guides"] }}\`.
- **Do** hold the selection in the URL (\`selection\` + \`onSelectionChange\`) only when filtered views need their own links; otherwise leave it to the pattern.
- **Do** give every grid image its real \`width\` and \`height\` — the tile holds its space from them, so nothing moves when the image loads.
- **Do** pass items in the order they should read. The grid has no sort, search, or paging in this version; it shows every item.
- **Do** pass \`renderLink\` — \`(post) => <Link href={post.href} />\` on the index, \`(item) => <Link href={item.href} />\` on the grid — so titles and tiles use the app's router.
- **Do** mount page-level layers through \`overlay\`. Adding an element to the pasted markup reads as drift to \`wmds-check\`.
- **Don't** write the count into the option label ("Guides (2)") — the panel shows \`count\`.
- **Don't** put a link or a button inside a tile. The tile is the link.
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
import { type ReactElement, type ReactNode } from "react";
import {
  FilterPanel,
  IndexList,
  countFilterOptions,
  matchesFilterSelection,
  useFilterSelection,
  type FilterFacets,
  type FilterPanelGroup,
  type FilterSelection,
} from "@thewhatmatters/wmds";

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
  facets: FilterFacets;
}

function postsLabel(count: number) {
  return count === 1 ? "1 post" : \`\${count} posts\`;
}

export interface FilteredIndexProps {
  title: string;
  posts: FilteredPost[];
  groups: FilterPanelGroup[];
  /** The filters on when the page opens — for example { topic: ["guides"] } from /blog?topic=guides. */
  defaultSelection?: FilterSelection;
  /** The filters on, when the app holds them — for example in the URL. Pass with onSelectionChange. */
  selection?: FilterSelection;
  /** Every change: an option on or off, or Clear all. */
  onSelectionChange?: (selection: FilterSelection) => void;
  /** The router's link for a post's title, in place of a plain anchor — (post) => <Link href={post.href} />. */
  renderLink?: (post: FilteredPost) => ReactElement;
  /** Page-level layers inside the page grid — for example a GridOverlay. */
  overlay?: ReactNode;
}

export function FilteredIndex({
  title,
  posts,
  groups,
  defaultSelection,
  selection: selectionProp,
  onSelectionChange,
  renderLink,
  overlay,
}: FilteredIndexProps) {
  const [selection, setSelection] = useFilterSelection({
    defaultSelection,
    selection: selectionProp,
    onSelectionChange,
  });
  const shown = posts.filter((post) => matchesFilterSelection(post.facets, selection));

  return (
    <FilterPanel
      groups={countFilterOptions(groups, posts, postsLabel)}
      selection={selection}
      onSelectionChange={setSelection}
      resultsLabel={postsLabel(shown.length)}
    >
      <main className="grid-page bg-body">
        {overlay}
        <div className="band py-6 sm:py-10 lg:py-14">
          <header className="col-span-full mb-4 flex items-end justify-between gap-4 sm:mb-8">
            <h1 className="type-display-2 text-fg">
              {title} <span className="tabular-nums text-muted">{shown.length}</span>
            </h1>
            <FilterPanel.Trigger className="md:hidden" />
          </header>
          <p role="status" className="sr-only">
            {postsLabel(shown.length)}
          </p>

          <FilterPanel.Rail className="hidden md:col-span-3 md:block" />

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
                  href={renderLink != null ? undefined : post.href}
                  render={renderLink?.(post)}
                  meta={<time dateTime={post.date}>{post.dateLabel}</time>}
                  preview={<p>{post.description}</p>}
                />
              ))}
            </IndexList>
          </div>
        </div>

        <FilterPanel.Sheet />
      </main>
    </FilterPanel>
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

export const FilteredGrid: Story = {
  name: "Pattern — filtered grid",
  render: () => <FilteredGridPage />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The same panel beside a grid of link tiles. Images keep their own heights and the tiles pack; Tab moves through them in reading order, across the top and then down. A tile to another site opens a new tab and says so. Show code omits the Storybook-only inspector.",
        },
      },
    },
    `
import { useId, type ReactElement, type ReactNode } from "react";
import {
  Badge,
  FilterPanel,
  LinkTile,
  SectionCaption,
  TileGrid,
  countFilterOptions,
  matchesFilterSelection,
  useFilterSelection,
  type FilterFacets,
  type FilterPanelGroup,
  type FilterSelection,
  type TileGridColumns,
  type TileGridLayout,
} from "@thewhatmatters/wmds";

export interface ResourceImage {
  src: string;
  alt: string;
  /** The image's own size, in px. They hold the tile's space before the image loads. */
  width: number;
  height: number;
}

export interface FilteredResource {
  id: string;
  title: string;
  /** Where the tile goes — the resource's page in the app, for example /resources/type-scale. */
  href: string;
  /** Only for a tile that links straight to another site: it opens a new tab. */
  external?: boolean;
  /** The preview. */
  image: ResourceImage;
  /** One line under the title, for example the domain. */
  meta?: string;
  /** A short label over the image, for example "Free". */
  tag?: string;
  /** The resource's options in each filter group, by group id — one or several, for example { type: ["tools", "fonts"] }. */
  facets: FilterFacets;
}

function resourcesLabel(count: number) {
  return count === 1 ? "1 resource" : \`\${count} resources\`;
}

/** The image's shape in a uniform grid, and of the placeholders while loading, as width / height. */
const uniformRatio = 4 / 3;

/** One placeholder tile each, while loading. */
const loadingTiles = ["one", "two", "three", "four", "five", "six"];

export interface FilteredGridProps {
  title: string;
  /** The caption over the grid, in sentence case. It names the list. */
  caption: string;
  items: FilteredResource[];
  groups: FilterPanelGroup[];
  /** masonry (default): tiles keep their image's height and pack. uniform: every image is 4:3. */
  layout?: TileGridLayout;
  /** Columns per breakpoint. Default: 1 on phones, 2 from sm, 3 from lg. */
  columns?: TileGridColumns;
  /** Placeholder tiles while the items are on their way. */
  loading?: boolean;
  /** The filters on when the page opens — for example { type: ["tools"] } from /resources?type=tools. */
  defaultSelection?: FilterSelection;
  /** The filters on, when the app holds them — for example in the URL. Pass with onSelectionChange. */
  selection?: FilterSelection;
  /** Every change: an option on or off, or Clear all. */
  onSelectionChange?: (selection: FilterSelection) => void;
  /** The router's link for a tile, in place of a plain anchor — (item) => <Link href={item.href} />. Not used for external items. */
  renderLink?: (item: FilteredResource) => ReactElement;
  /** The app's image component, in place of img — (image) => <Image {...image} sizes="…" />. */
  renderImage?: (image: ResourceImage) => ReactNode;
  /** Page-level layers inside the page grid — for example a GridOverlay. */
  overlay?: ReactNode;
}

export function FilteredGrid({
  title,
  caption,
  items,
  groups,
  layout = "masonry",
  columns,
  loading = false,
  defaultSelection,
  selection: selectionProp,
  onSelectionChange,
  renderLink,
  renderImage,
  overlay,
}: FilteredGridProps) {
  const gridHeadingId = useId();
  const [selection, setSelection] = useFilterSelection({
    defaultSelection,
    selection: selectionProp,
    onSelectionChange,
  });
  const shown = items.filter((item) => matchesFilterSelection(item.facets, selection));

  return (
    <FilterPanel
      groups={countFilterOptions(groups, items, resourcesLabel)}
      selection={selection}
      onSelectionChange={setSelection}
      resultsLabel={resourcesLabel(shown.length)}
    >
      <main className="grid-page bg-body">
        {overlay}
        <div className="band py-6 sm:py-10 lg:py-14">
          <header className="col-span-full mb-4 flex items-end justify-between gap-4 sm:mb-8">
            <h1 className="type-display-2 text-fg">
              {title} {loading ? null : <span className="tabular-nums text-muted">{shown.length}</span>}
            </h1>
            <FilterPanel.Trigger className="md:hidden" />
          </header>
          <p role="status" className="sr-only">
            {loading ? "Loading" : resourcesLabel(shown.length)}
          </p>

          <FilterPanel.Rail className="hidden md:col-span-3 md:block" />

          <div className="col-span-full md:col-span-5 lg:col-span-9">
            <SectionCaption id={gridHeadingId}>{caption}</SectionCaption>
            <TileGrid
              aria-labelledby={gridHeadingId}
              layout={layout}
              columns={columns}
              busy={loading}
              empty={<p className="type-body text-muted">No resources match these filters.</p>}
              className="mt-6"
            >
              {loading
                ? loadingTiles.map((key) => (
                    <TileGrid.Item key={key}>
                      <LinkTile loading ratio={uniformRatio} />
                    </TileGrid.Item>
                  ))
                : shown.map((item) => {
                    const routed = renderLink != null && !item.external;
                    return (
                      <TileGrid.Item key={item.id}>
                        <LinkTile
                          title={item.title}
                          href={routed ? undefined : item.href}
                          render={routed ? renderLink(item) : undefined}
                          external={item.external}
                          meta={item.meta}
                          ratio={layout === "uniform" ? uniformRatio : undefined}
                          tag={item.tag != null ? <Badge>{item.tag}</Badge> : undefined}
                          media={
                            renderImage != null ? (
                              renderImage(item.image)
                            ) : (
                              <img
                                src={item.image.src}
                                alt={item.image.alt}
                                width={item.image.width}
                                height={item.image.height}
                                loading="lazy"
                                decoding="async"
                              />
                            )
                          }
                        />
                      </TileGrid.Item>
                    );
                  })}
            </TileGrid>
          </div>
        </div>

        <FilterPanel.Sheet />
      </main>
    </FilterPanel>
  );
}
`,
  ),
};

export const GridUniform: Story = {
  name: "Grid — uniform",
  render: () => <FilteredGridPage layout="uniform" />,
  parameters: {
    docs: {
      description: {
        story: '`layout="uniform"` — every image is cropped to 4:3, so the rows are level.',
      },
    },
  },
};

export const GridFiltersApplied: Story = {
  name: "Grid — filters applied",
  render: () => <FilteredGridPage defaultSelection={{ type: ["tools"] }} />,
  parameters: {
    docs: {
      description: {
        story: "`defaultSelection={{ type: [\"tools\"] }}` — four of the nine resources. Clear all brings the rest back; the tiles that stay move to their new places.",
      },
    },
  },
};

export const GridNoMatches: Story = {
  name: "Grid — no matches",
  render: () => <FilteredGridPage defaultSelection={{ type: ["fonts"], price: ["paid"] }} />,
  parameters: {
    docs: {
      description: {
        story: "Fonts and Paid share no resource, so the `empty` slot takes the grid's place. The title's count reads 0 and Clear all brings every tile back.",
      },
    },
  },
};

export const GridLoading: Story = {
  name: "Grid — loading",
  render: () => <FilteredGridPage loading />,
  parameters: {
    docs: {
      description: {
        story: "`loading` — six placeholder tiles (**LinkTile** `loading`) in a grid marked `aria-busy`; the status line says Loading.",
      },
    },
  },
};

export const GridTablet: Story = {
  name: "Grid — tablet",
  render: () => <FilteredGridPage />,
  ...lockedViewportStory("tablet"),
};

export const GridPhone: Story = {
  name: "Grid — phone",
  render: () => <FilteredGridPage />,
  ...lockedViewportStory("mobile"),
};

export const GridDark: Story = {
  name: "Grid — dark",
  render: () => <FilteredGridPage />,
  globals: { theme: "dark" },
};
