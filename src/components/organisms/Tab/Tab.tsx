import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { Dropdown } from "../../molecules/Dropdown/Dropdown";
import {
  measureDropdownMenuStyle,
  type DropdownMenuMeasureRow,
} from "../../molecules/Dropdown/dropdownMenuPosition";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import { resolveTabOverflow } from "./tabOverflow";
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
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const measureMoreRef = useRef<HTMLSpanElement>(null);
  const measureRefs = useRef(new Map<string, HTMLSpanElement>());
  const visibleTabRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusValue = useRef<string | null>(null);
  const items = useMemo(() => toTabItems(children), [children]);
  const values = items.map((item) => item.props.value);
  const [visibleValues, setVisibleValues] = useState(values);
  const [overflowValues, setOverflowValues] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
  const [menuActiveIndex, setMenuActiveIndex] = useState(0);

  const recalculate = useCallback(() => {
    const root = rootRef.current;
    const more = measureMoreRef.current;
    if (root == null || more == null) return;

    const measuredItems = items.map((item) => ({
      value: item.props.value,
      width: Math.ceil(measureRefs.current.get(item.props.value)?.getBoundingClientRect().width ?? 0),
    }));

    if (measuredItems.some((item) => item.width === 0)) return;

    const result = resolveTabOverflow(
      measuredItems,
      value,
      root.clientWidth,
      Math.ceil(more.getBoundingClientRect().width),
    );
    setVisibleValues(result.visibleValues);
    setOverflowValues(result.overflowValues);
    if (result.overflowValues.length === 0) {
      setMenuOpen(false);
      setMenuStyle(null);
    }
  }, [items, value]);

  useLayoutEffect(() => {
    recalculate();
    const root = rootRef.current;
    if (root == null) return undefined;

    const observer = new ResizeObserver(recalculate);
    observer.observe(root);
    void document.fonts?.ready.then(recalculate);
    return () => observer.disconnect();
  }, [recalculate]);

  useLayoutEffect(() => {
    const pending = pendingFocusValue.current;
    if (pending == null) return;
    const node = visibleTabRefs.current.get(pending);
    if (node != null) {
      node.focus();
      pendingFocusValue.current = null;
    }
  }, [visibleValues, value]);

  const visibleSet = new Set(visibleValues);
  const visibleItems = items.filter((item) => visibleSet.has(item.props.value));
  const overflowSet = new Set(overflowValues);
  const overflowItems = items.filter((item) => overflowSet.has(item.props.value));

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMenuStyle(null);
  }, []);

  const openMenu = useCallback(() => {
    const trigger = moreRef.current;
    if (trigger == null) return;
    setMenuStyle(
      measureDropdownMenuStyle(trigger, toMeasureRows(overflowItems), {
        align: "end",
        widthMode: "content",
      }),
    );
    setMenuActiveIndex(0);
    setMenuOpen(true);
  }, [overflowItems]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current != null && !rootRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        moreRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [closeMenu, menuOpen]);

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

  function selectOverflowValue(nextValue: string) {
    pendingFocusValue.current = nextValue;
    onValueChange(nextValue);
    closeMenu();
  }

  function handleMoreKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!menuOpen) {
        openMenu();
        setMenuActiveIndex(event.key === "ArrowDown" ? 0 : Math.max(overflowItems.length - 1, 0));
      } else {
        const delta = event.key === "ArrowDown" ? 1 : -1;
        setMenuActiveIndex((current) =>
          (current + delta + overflowItems.length) % overflowItems.length,
        );
      }
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && menuOpen) {
      event.preventDefault();
      const item = overflowItems[menuActiveIndex];
      if (item != null && !item.props.disabled) selectOverflowValue(item.props.value);
    }
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
    <div ref={rootRef} className={cn(tabRootClasses, className)}>
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
              ref={moreRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuId : undefined}
              className={cn(tabItemClasses, tabItemSizeClasses[size])}
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
              onKeyDown={handleMoreKeyDown}
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
            ref={(node) => {
              if (node == null) measureRefs.current.delete(item.props.value);
              else measureRefs.current.set(item.props.value, node);
            }}
            className={cn(tabItemClasses, tabItemSizeClasses[size])}
          >
            <span>{item.props.children}</span>
            {item.props.count != null ? (
              <span className={tabCountClasses}>{item.props.count.toLocaleString()}</span>
            ) : null}
          </span>
        ))}
        <span
          ref={measureMoreRef}
          className={cn(tabItemClasses, tabItemSizeClasses[size])}
        >
          <span>More</span>
          <ChevronDown className={tabMoreIconClasses} strokeWidth={2} />
        </span>
      </div>

      {menuOpen && menuStyle != null ? (
        <Dropdown.Menu id={menuId} role="menu" aria-label={`${ariaLabel} overflow`} style={menuStyle}>
          {overflowItems.map((item, index) => (
            <li key={item.props.value} role="presentation">
              <Dropdown.Item
                role="menuitem"
                tabIndex={-1}
                truncate={false}
                selected={item.props.value === value}
                active={index === menuActiveIndex}
                disabled={item.props.disabled}
                end={item.props.count?.toLocaleString()}
                onMouseEnter={() => setMenuActiveIndex(index)}
                onClick={() => selectOverflowValue(item.props.value)}
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
