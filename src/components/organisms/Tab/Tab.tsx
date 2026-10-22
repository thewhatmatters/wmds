import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { Dropdown } from "../../molecules/Dropdown/Dropdown";
import { type DropdownMenuMeasureRow } from "../../molecules/Dropdown/dropdownMenuPosition";
import { textOf, useOverflowMenu } from "../../molecules/Dropdown/useOverflowMenu";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import {
  tabCountClasses,
  tabIndicatorClasses,
  tabItemClasses,
  tabItemContentClasses,
  tabItemSelectedClasses,
  tabItemSizeClasses,
  tabListClasses,
  tabMeasureRailClasses,
  tabMoreIconClasses,
  tabRootClasses,
  type TabSize,
} from "./tabStyles";

export type { TabSize } from "./tabStyles";
export { tabSizes } from "./tabStyles";

export interface TabItemProps {
  value: string;
  children: string;
  count?: number;
  disabled?: boolean;
  /** ID of the controlled panel. */
  panelId?: string;
}

export interface TabGroupProps {
  "aria-label": string;
  value: string;
  onValueChange: (value: string) => void;
  size?: TabSize;
  children: ReactNode;
  className?: string;
}

interface TabContextValue {
  value: string;
  size: TabSize;
  layoutId: string;
  onValueChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, value: string) => void;
  registerVisibleTab: (value: string, node: HTMLButtonElement | null) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

function TabItem({ value, children, count, disabled, panelId }: TabItemProps) {
  const group = useContext(TabContext);
  if (group == null) {
    throw new Error("[WMDS Tab] Tab items must be rendered inside Tab.Group.");
  }

  const selected = value === group.value;

  return (
    <button
      ref={(node) => group.registerVisibleTab(value, node)}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={cn(
        tabItemClasses,
        tabItemSizeClasses[group.size],
        selected && tabItemSelectedClasses,
      )}
      data-value={value}
      onClick={() => group.onValueChange(value)}
      onKeyDown={(event) => group.onKeyDown(event, value)}
    >
      {selected ? (
        <motion.span
          layoutId={group.layoutId}
          className={tabIndicatorClasses}
          transition={motionTransitionProp("fast")}
          aria-hidden
        />
      ) : null}
      <span className={tabItemContentClasses}>{children}</span>
      {count != null ? (
        <span className={cn(tabItemContentClasses, tabCountClasses)}>
          {count.toLocaleString()}
        </span>
      ) : null}
    </button>
  );
}

function toTabItems(children: ReactNode): ReactElement<TabItemProps>[] {
  return Children.toArray(children).filter(
    (child): child is ReactElement<TabItemProps> =>
      isValidElement<TabItemProps>(child) && child.type === TabItem,
  );
}

function toMeasureRows(items: ReactElement<TabItemProps>[]): DropdownMenuMeasureRow[] {
  return items.map((item) => ({
    label: item.props.children,
    end: item.props.count != null ? item.props.count.toLocaleString() : undefined,
    selectionCheck: true,
  }));
}

function TabGroup({
  "aria-label": ariaLabel,
  value,
  onValueChange,
  size = "md",
  children,
  className,
}: TabGroupProps) {
  const layoutId = useId();
  const visibleTabRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusValue = useRef<string | null>(null);
  const items = useMemo(() => toTabItems(children), [children]);
  const itemsByValue = useMemo(() => new Map(items.map((item) => [item.props.value, item])), [items]);
  const pick = (ids: readonly string[]) => ids.flatMap((id) => itemsByValue.get(id) ?? []);

  const overflow = useOverflowMenu({
    ids: items.map((item) => item.props.value),
    activeId: value,
    toMenuRows: (ids) =>
      pick(ids).map((item) => ({ label: textOf(item.props.children), disabled: item.props.disabled })),
    toMeasureRows: (ids) => toMeasureRows(pick(ids)),
  });
  const { menu } = overflow;

  useLayoutEffect(() => {
    const pending = pendingFocusValue.current;
    if (pending == null) return;
    const node = visibleTabRefs.current.get(pending);
    if (node != null) {
      node.focus();
      pendingFocusValue.current = null;
    }
  }, [overflow.visibleIds, value]);

  const visibleItems = pick(overflow.visibleIds);
  const overflowItems = pick(overflow.overflowIds);

  const selectValue = useCallback(
    (nextValue: string, focus = false) => {
      if (focus) pendingFocusValue.current = nextValue;
      onValueChange(nextValue);
    },
    [onValueChange],
  );

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentValue: string) {
    const enabled = items.filter((item) => !item.props.disabled);
    const currentIndex = enabled.findIndex((item) => item.props.value === currentValue);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % enabled.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = enabled.length - 1;
    else return;

    event.preventDefault();
    const nextValue = enabled[nextIndex]?.props.value;
    if (nextValue != null) selectValue(nextValue, true);
  }

  function selectOverflowValue(item: ReactElement<TabItemProps>) {
    if (item.props.disabled) return;
    menu.close({ returnFocus: true });
    selectValue(item.props.value, true);
  }

  const context: TabContextValue = {
    value,
    size,
    layoutId,
    onValueChange: selectValue,
    onKeyDown: handleTabKeyDown,
    registerVisibleTab: (tabValue, node) => {
      if (node == null) visibleTabRefs.current.delete(tabValue);
      else visibleTabRefs.current.set(tabValue, node);
    },
  };

  return (
    <div {...overflow.rowProps} className={cn(tabRootClasses, className)}>
      <LayoutGroup id={layoutId}>
        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-orientation="horizontal"
          className={tabListClasses}
        >
          <TabContext.Provider value={context}>{visibleItems}</TabContext.Provider>
          {overflowItems.length > 0 ? (
            <button
              ref={overflow.moreRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={menu.triggerProps["aria-expanded"]}
              aria-controls={menu.triggerProps["aria-controls"]}
              className={cn(tabItemClasses, tabItemSizeClasses[size])}
              onClick={menu.toggle}
            >
              <span>More</span>
              <ChevronDown className={tabMoreIconClasses} strokeWidth={2} aria-hidden />
            </button>
          ) : null}
        </div>
      </LayoutGroup>

      <div className={tabMeasureRailClasses} aria-hidden>
        {items.map((item) => (
          <span
            key={item.props.value}
            ref={overflow.measureRef(item.props.value)}
            className={cn(tabItemClasses, tabItemSizeClasses[size])}
          >
            <span>{item.props.children}</span>
            {item.props.count != null ? (
              <span className={tabCountClasses}>{item.props.count.toLocaleString()}</span>
            ) : null}
          </span>
        ))}
        <span
          ref={overflow.moreMeasureRef}
          className={cn(tabItemClasses, tabItemSizeClasses[size])}
        >
          <span>More</span>
          <ChevronDown className={tabMoreIconClasses} strokeWidth={2} />
        </span>
      </div>

      {menu.open && menu.menuStyle != null ? (
        <Dropdown.Menu {...menu.menuProps} role="menu" aria-label={`${ariaLabel} overflow`}>
          {overflowItems.map((item, index) => (
            <li key={item.props.value} role="presentation">
              <Dropdown.Item
                {...menu.rowProps(index)}
                role="menuitem"
                truncate={false}
                selected={item.props.value === value}
                disabled={item.props.disabled}
                end={item.props.count?.toLocaleString()}
                onClick={() => selectOverflowValue(item)}
              >
                {item.props.children}
              </Dropdown.Item>
            </li>
          ))}
        </Dropdown.Menu>
      ) : null}
    </div>
  );
}

/** Responsive view navigation — selected hidden tabs promote before the More trigger. */
export const Tab = Object.assign(TabItem, {
  Group: TabGroup,
});
