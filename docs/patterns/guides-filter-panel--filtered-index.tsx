// @thewhatmatters/wmds@0.4.9 · Pattern — filtered index
// Storybook: Guides/Filter panel → Pattern — filtered index (?path=/story/guides-filter-panel--filtered-index)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

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
