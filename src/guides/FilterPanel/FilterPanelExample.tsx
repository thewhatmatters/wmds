/**
 * Storybook-only — the live **Guides/Filter panel** patterns and their sample data. Apps copy the
 * Show code in FilterPanel.stories.tsx, not this file.
 */
import { useEffect, useId, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { SectionCaption } from "../../components/atoms/SectionCaption/SectionCaption";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { IndexList } from "../../components/molecules/IndexList/IndexList";
import { LinkTile } from "../../components/molecules/LinkTile/LinkTile";
import { TileGrid, type TileGridColumns, type TileGridLayout } from "../../components/molecules/TileGrid/TileGrid";
import {
  FilterPanel,
  countFilterOptions,
  matchesFilterSelection,
  useFilterSelection,
  type FilterFacets,
  type FilterPanelGroup,
  type FilterSelection,
} from "../../components/organisms/FilterPanel/FilterPanel";
import { GridOverlay } from "../../lib/GridOverlay";
import { sampleImage, type SampleImageTone } from "../../storybook/sampleImage";
import { ExampleGridControls } from "../../storybook/ExampleGridControls/ExampleGridControls";

export type { FilterSelection } from "../../components/organisms/FilterPanel/FilterPanel";

// ── Pattern — filtered index — mirrors Show code in FilterPanel.stories.tsx line for line ──

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
  return count === 1 ? "1 post" : `${count} posts`;
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

// ── Pattern — filtered grid — mirrors Show code in FilterPanel.stories.tsx line for line ───

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
  return count === 1 ? "1 resource" : `${count} resources`;
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

// ── Sample data and the Storybook-only grid inspector ─────────────────────────────────────

export const sampleGroups: FilterPanelGroup[] = [
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

export const samplePosts: FilteredPost[] = [
  {
    slug: "brand-sprint",
    title: "How we scope a brand sprint",
    href: "#brand-sprint",
    date: "2026-09-14",
    dateLabel: "Sep 14, 2026",
    description: "Two weeks, one decision a day: the questions we ask before a sprint starts and what we hand over at the end.",
    facets: { topic: "guides", year: "2026" },
  },
  {
    slug: "design-system",
    title: "A design system that ships with the site",
    href: "#design-system",
    date: "2026-08-02",
    dateLabel: "Aug 2, 2026",
    description: "Why the components, the patterns, and the marketing site live in one release train.",
    facets: { topic: "notes", year: "2026" },
  },
  {
    slug: "writing-briefs",
    title: "Writing briefs people finish reading",
    href: "#writing-briefs",
    date: "2026-06-21",
    dateLabel: "Jun 21, 2026",
    description: "Short sentences, one ask per paragraph, and a done-when list.",
    facets: { topic: ["guides", "notes"], year: "2026" },
  },
  {
    slug: "studio-notes",
    title: "Studio notes: the first year",
    href: "#studio-notes",
    date: "2025-12-09",
    dateLabel: "Dec 9, 2025",
    description: "What changed in how we price, plan, and pick projects.",
    facets: { topic: "news", year: "2025" },
  },
];

export const sampleResourceGroups: FilterPanelGroup[] = [
  {
    id: "type",
    label: "Type",
    options: [
      { value: "tools", label: "Tools" },
      { value: "inspiration", label: "Inspiration" },
      { value: "fonts", label: "Fonts" },
    ],
  },
  {
    id: "price",
    label: "Price",
    options: [
      { value: "free", label: "Free" },
      { value: "paid", label: "Paid" },
    ],
  },
];

function sampleResource(
  id: string,
  title: string,
  meta: string,
  [width, height]: [number, number],
  tone: SampleImageTone,
  type: string | string[],
  price: "free" | "paid",
  external = false,
): FilteredResource {
  return {
    id,
    title,
    href: external ? `https://${meta}` : `#resources/${id}`,
    external,
    image: { src: sampleImage(width, height, tone), alt: `${title} home page`, width, height },
    meta,
    tag: price === "free" ? "Free" : undefined,
    facets: { type, price },
  };
}

/**
 * Nine resources with images from 4:5 to 16:9, light and dark, so a masonry grid has something to
 * pack. Each tile goes to the resource's page in the app; the first links straight out, to show `external`.
 */
export const sampleResources: FilteredResource[] = [
  sampleResource("grid-notes", "Grid notes", "gridnotes.example", [800, 1000], "light", "inspiration", "free", true),
  sampleResource("type-scale", "Type scale", "typescale.example", [800, 450], "dark", "tools", "free"),
  sampleResource("contrast", "Contrast checker", "contrast.example", [800, 600], "blue", "tools", "free"),
  sampleResource("serif-library", "Serif library", "seriflibrary.example", [800, 800], "sand", "fonts", "free"),
  sampleResource("motion-field", "Motion field notes", "motionfield.example", [800, 1100], "dark", "inspiration", "free"),
  sampleResource("palette", "Palette from a photo", "palette.example", [800, 520], "lime", "tools", "paid"),
  sampleResource("mono-faces", "Mono faces worth setting", "monofaces.example", [800, 640], "light", ["fonts", "inspiration"], "free"),
  sampleResource("brief-template", "Our brief template", "whatmatters.so", [800, 900], "blue", "tools", "free"),
  sampleResource("landing-archive", "Landing page archive", "landings.example", [800, 480], "sand", "inspiration", "paid"),
];

const defaultGridMax = 1280;
const defaultColumnGap = 24;

/** A pattern on the page, with the Storybook-only grid inspector. The pattern takes the guides as its `overlay`. */
function ExamplePage({ children }: { children: (overlay: ReactNode) => ReactNode }) {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(defaultGridMax);
  const [columnGap, setColumnGap] = useState(defaultColumnGap);
  const tuned = gridMax !== defaultGridMax || columnGap !== defaultColumnGap;

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    return () => {
      if (previousTheme == null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  return (
    <div
      className="relative min-h-screen bg-body"
      style={
        tuned
          ? ({ "--grid-max": `${gridMax}px`, "--grid-column-gap": `${columnGap}px` } as CSSProperties)
          : undefined
      }
    >
      {children(<GridOverlay visible={gridVisible} onVisibleChange={setGridVisible} keyboardShortcut={false} />)}
      <ExampleGridControls
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
        maxWidth={gridMax}
        onMaxWidthChange={setGridMax}
        columnGap={columnGap}
        onColumnGapChange={setColumnGap}
        defaultMaxWidth={defaultGridMax}
        defaultColumnGap={defaultColumnGap}
      />
    </div>
  );
}

/** **Pattern — filtered index** on the page. */
export function FilterPanelPage({ defaultSelection }: { defaultSelection?: FilterSelection } = {}) {
  return (
    <ExamplePage>
      {(overlay) => (
        <FilteredIndex
          title="Blog"
          posts={samplePosts}
          groups={sampleGroups}
          defaultSelection={defaultSelection}
          overlay={overlay}
        />
      )}
    </ExamplePage>
  );
}

/** **Pattern — filtered grid** on the page. */
export function FilteredGridPage(
  props: Pick<FilteredGridProps, "layout" | "columns" | "loading" | "defaultSelection"> = {},
) {
  return (
    <ExamplePage>
      {(overlay) => (
        <FilteredGrid
          title="Resources"
          caption="Library"
          items={sampleResources}
          groups={sampleResourceGroups}
          overlay={overlay}
          {...props}
        />
      )}
    </ExamplePage>
  );
}
