import { createContext, useContext, useId, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { SectionCaption } from "../../atoms/SectionCaption/SectionCaption";
import { Accordion } from "../../molecules/Accordion/Accordion";
import { CheckboxGroup } from "../../molecules/CheckboxGroup/CheckboxGroup";
import { Sheet } from "../Sheet/Sheet";
import { filterSelectionCount, type FilterPanelGroup, type FilterSelection } from "./filterSelection";

export {
  countFilterOptions,
  filterFacetValues,
  filterSelectionCount,
  matchesFilterSelection,
  useFilterSelection,
  type FilterFacets,
  type FilterPanelGroup,
  type FilterPanelOption,
  type FilterSelection,
  type UseFilterSelectionOptions,
} from "./filterSelection";

/** Layout-only — grid placement and which breakpoints show the part. */
export type FilterPanelLayoutClassName = string;

export interface FilterPanelLabels {
  /** The panel's caption, the Sheet's title, and the trigger's label. Default: "Filters". */
  title: string;
  /** Default: "Clear all". */
  clear: string;
  /** The Sheet's closing button, from `resultsLabel`. Default: "Show 3 posts". */
  show: (resultsLabel: string) => string;
}

export interface FilterPanelProps {
  /** The filter groups, each with its options. `countFilterOptions` adds the counts. */
  groups: FilterPanelGroup[];
  /** The options on in each group. Hold it with `useFilterSelection`. */
  selection: FilterSelection;
  /** Every change: an option on or off, or Clear all (an empty selection). */
  onSelectionChange: (selection: FilterSelection) => void;
  /** What is showing, for the Sheet's closing button — "3 posts" reads "Show 3 posts". */
  resultsLabel: string;
  labels?: Partial<FilterPanelLabels>;
  /** The page: **FilterPanel.Trigger**, **FilterPanel.Rail**, and **FilterPanel.Sheet** go anywhere inside. */
  children?: ReactNode;
}

export interface FilterPanelRailProps {
  /** Placement, and where it shows — for example `"hidden md:col-span-3 md:block"`. */
  className?: FilterPanelLayoutClassName;
}

export interface FilterPanelTriggerProps {
  /** Replaces the leading icon. */
  icon?: ReactElement;
  /** Placement, and where it shows — for example `"md:hidden"`. */
  className?: FilterPanelLayoutClassName;
}

interface FilterPanelContextValue {
  groups: FilterPanelGroup[];
  selection: FilterSelection;
  onSelectionChange: (selection: FilterSelection) => void;
  resultsLabel: string;
  labels: FilterPanelLabels;
  activeCount: number;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
}

const defaultLabels: FilterPanelLabels = {
  title: "Filters",
  clear: "Clear all",
  show: (resultsLabel) => `Show ${resultsLabel}`,
};

const FilterPanelContext = createContext<FilterPanelContextValue | null>(null);

function useFilterPanel(part: string): FilterPanelContextValue {
  const context = useContext(FilterPanelContext);
  if (context == null) throw new Error(`[WMDS FilterPanel] ${part} must be inside <FilterPanel>.`);
  return context;
}

/**
 * Checkbox filters for an index page — a side rail from tablet up and the same groups in a bottom
 * **Sheet** on phones, over one selection. It renders no element of its own: place its parts on
 * the page grid.
 */
function FilterPanelRoot({ groups, selection, onSelectionChange, resultsLabel, labels, children }: FilterPanelProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const value = useMemo<FilterPanelContextValue>(
    () => ({
      groups,
      selection,
      onSelectionChange,
      resultsLabel,
      labels: { ...defaultLabels, ...labels },
      activeCount: filterSelectionCount(selection),
      sheetOpen,
      setSheetOpen,
    }),
    [groups, selection, onSelectionChange, resultsLabel, labels, sheetOpen],
  );

  return <FilterPanelContext.Provider value={value}>{children}</FilterPanelContext.Provider>;
}

/** The groups — each one collapses, and a closed group leaves the tab order. */
function FilterPanelGroups() {
  const { groups, selection, onSelectionChange } = useFilterPanel("FilterPanel.Groups");

  return (
    <Accordion variant="plain" flush>
      {groups.map((group) => (
        <Accordion.Item key={group.id} label={group.label} defaultOpen>
          <CheckboxGroup
            label={group.label}
            labelHidden
            size="sm"
            values={selection[group.id] ?? []}
            onValuesChange={(values) => onSelectionChange({ ...selection, [group.id]: values })}
          >
            {group.options.map((option) => (
              <CheckboxGroup.Item
                key={option.value}
                value={option.value}
                label={option.label}
                count={option.count}
                countLabel={option.countLabel}
              />
            ))}
          </CheckboxGroup>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

/** The side rail: the caption with Clear all at its end, over the groups. */
function FilterPanelRail({ className }: FilterPanelRailProps) {
  const { labels, activeCount, onSelectionChange } = useFilterPanel("FilterPanel.Rail");
  const headingId = useId();

  return (
    <aside aria-labelledby={headingId} className={className} data-filter-panel-rail="">
      <SectionCaption
        id={headingId}
        end={
          <Button role="ghost" size="xs" disabled={activeCount === 0} onClick={() => onSelectionChange({})}>
            {labels.clear}
          </Button>
        }
      >
        {labels.title}
      </SectionCaption>
      <FilterPanelGroups />
    </aside>
  );
}

/** Opens the Sheet. Its count is how many options are on. */
function FilterPanelTrigger({ icon, className }: FilterPanelTriggerProps) {
  const { labels, activeCount, setSheetOpen } = useFilterPanel("FilterPanel.Trigger");

  return (
    <Button
      role="secondary"
      icon={icon ?? <SlidersHorizontal />}
      count={activeCount > 0 ? activeCount : undefined}
      className={className}
      onClick={() => setSheetOpen(true)}
    >
      {labels.title}
    </Button>
  );
}

/** The same groups in a bottom Sheet, with Clear all and a button that closes it on the results. */
function FilterPanelSheet() {
  const { labels, activeCount, onSelectionChange, resultsLabel, sheetOpen, setSheetOpen } =
    useFilterPanel("FilterPanel.Sheet");

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <Sheet.Content
        title={labels.title}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button role="secondary" size="sm" disabled={activeCount === 0} onClick={() => onSelectionChange({})}>
              {labels.clear}
            </Button>
            <Button role="primary" size="sm" onClick={() => setSheetOpen(false)}>
              {labels.show(resultsLabel)}
            </Button>
          </div>
        }
      >
        <FilterPanelGroups />
      </Sheet.Content>
    </Sheet>
  );
}

export const FilterPanel = Object.assign(FilterPanelRoot, {
  Rail: FilterPanelRail,
  Trigger: FilterPanelTrigger,
  Sheet: FilterPanelSheet,
});
