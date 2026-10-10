// @thewhatmatters/wmds@0.4.8 · Pattern — filtered grid
// Storybook: Guides/Filter panel → Pattern — filtered grid (?path=/story/guides-filter-panel--filtered-grid)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

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
