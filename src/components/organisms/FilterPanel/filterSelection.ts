import { useState } from "react";

/** An item's options in each filter group, by group id — one or several, for example `{ topic: ["guides", "brand"] }`. */
export type FilterFacets = Record<string, string | string[]>;

/** The options on in each group, by group id — for example `{ topic: ["guides"] }`. */
export type FilterSelection = Record<string, string[]>;

export interface FilterPanelOption {
  value: string;
  label: string;
  /** How many items carry this option — a muted number at the row's end. `countFilterOptions` fills it. */
  count?: number;
  /** What the count counts, for screen readers — "2 posts". */
  countLabel?: string;
}

export interface FilterPanelGroup {
  id: string;
  label: string;
  options: FilterPanelOption[];
}

/** An item's options in one group, as a list. */
export function filterFacetValues(facets: FilterFacets, groupId: string): string[] {
  const value = facets[groupId];
  return value == null ? [] : Array.isArray(value) ? value : [value];
}

/**
 * Whether an item shows: in every group with options on, it has at least one of them. Within a
 * group the options are alternatives; across groups they combine.
 */
export function matchesFilterSelection(facets: FilterFacets, selection: FilterSelection): boolean {
  return Object.entries(selection).every(
    ([groupId, values]) =>
      values.length === 0 || filterFacetValues(facets, groupId).some((value) => values.includes(value)),
  );
}

/** How many options are on, across all groups. */
export function filterSelectionCount(selection: FilterSelection): number {
  return Object.values(selection).reduce((total, values) => total + values.length, 0);
}

/**
 * The groups with each option's `count` over all items (not only the ones showing), and its
 * `countLabel` when `label` is passed — `countFilterOptions(groups, posts, (n) => n === 1 ? "1 post" : n + " posts")`.
 */
export function countFilterOptions(
  groups: FilterPanelGroup[],
  items: { facets: FilterFacets }[],
  label?: (count: number) => string,
): FilterPanelGroup[] {
  return groups.map((group) => ({
    ...group,
    options: group.options.map((option) => {
      const count = items.filter((item) => filterFacetValues(item.facets, group.id).includes(option.value)).length;
      return { ...option, count, countLabel: label?.(count) ?? option.countLabel };
    }),
  }));
}

export interface UseFilterSelectionOptions {
  /** The filters on when the page opens — for example `{ topic: ["guides"] }` from /blog?topic=guides. */
  defaultSelection?: FilterSelection;
  /** The filters on, when the app holds them — for example in the URL. Pass with `onSelectionChange`. */
  selection?: FilterSelection;
  /** Every change: an option on or off, or Clear all. */
  onSelectionChange?: (selection: FilterSelection) => void;
}

/** The page's filter state: its own (from `defaultSelection`), or the app's (`selection` + `onSelectionChange`). */
export function useFilterSelection({
  defaultSelection,
  selection: selectionProp,
  onSelectionChange,
}: UseFilterSelectionOptions = {}): [FilterSelection, (selection: FilterSelection) => void] {
  const [ownSelection, setOwnSelection] = useState<FilterSelection>(defaultSelection ?? {});

  function setSelection(next: FilterSelection) {
    if (selectionProp == null) setOwnSelection(next);
    onSelectionChange?.(next);
  }

  return [selectionProp ?? ownSelection, setSelection];
}
