// @thewhatmatters/wmds@0.4.9 · Pattern — filter panel
// Storybook: Components/FilterPanel → Pattern — filter panel (?path=/story/components-filterpanel--panel)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

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
  return count === 1 ? "1 item" : `${count} items`;
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
