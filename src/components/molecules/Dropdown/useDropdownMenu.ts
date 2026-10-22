import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";

export type DropdownMenuRow = { label: string; disabled?: boolean };

/**
 * Where keyboard focus lives while the menu is open.
 * - `trigger`: focus stays on the trigger, which names the active row with `aria-activedescendant`
 *   (a select-only combobox: **Select**).
 * - `items`: focus moves onto the rows (roving focus: the menu-button pattern for action menus and
 *   menus of links). `aria-activedescendant` is not allowed on a `button`.
 */
export type DropdownMenuFocus = "trigger" | "items";

export type DropdownMenuOpenAt = "first" | "last" | "initial" | number;

export interface DropdownMenuOptions {
  /** Rows in order. Labels drive type-ahead; disabled rows are skipped by the keyboard. */
  rows: readonly DropdownMenuRow[];
  /** The focusable trigger. Focus returns here on Escape. */
  triggerRef: RefObject<HTMLElement | null>;
  /** Positions the menu against the trigger (or a wider shell); called on open, scroll and resize. */
  measure: () => CSSProperties | null;
  focus: DropdownMenuFocus;
  /** Row the menu opens on with `"initial"`: the selected option of a Select. Default: first enabled. */
  initialIndex?: number;
  /** `trigger` focus only: Enter or Space on the trigger chooses the active row. */
  onChoose?: (index: number) => void;
}

const typeAheadResetMs = 500;

/**
 * Open state, dismissal, keyboard, and position for every WMDS dropdown menu (Select, MoreMenu,
 * Breadcrumb, Tab and SiteNav More). Spread `rootProps` on an element that wraps the trigger and the
 * menu (a portaled menu still counts: React events bubble through portals).
 *
 * Dismissal: Escape (handled here, `preventDefault` so an enclosing Dialog or Sheet stays open), a
 * pointer press outside, focus leaving (Tab), and choosing a row. Scroll and resize reposition the menu.
 */
export function useDropdownMenu({
  rows,
  triggerRef,
  measure,
  focus,
  initialIndex,
  onChoose,
}: DropdownMenuOptions) {
  const menuId = useId();
  const rootRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const typeAhead = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

  const measureRef = useRef(measure);
  useEffect(() => {
    measureRef.current = measure;
  });

  const rowId = useCallback((index: number) => `${menuId}-row-${index}`, [menuId]);

  const resolveIndex = useCallback(
    (at: DropdownMenuOpenAt) => {
      if (typeof at === "number") return at;
      if (at === "last") return stepEnabled(rows, rows.length, -1);
      if (at === "initial" && initialIndex != null && initialIndex >= 0 && !rows[initialIndex]?.disabled) {
        return initialIndex;
      }
      return stepEnabled(rows, -1, 1);
    },
    [initialIndex, rows],
  );

  const openMenu = useCallback(
    (at: DropdownMenuOpenAt = "initial") => {
      setMenuStyle(measureRef.current());
      setActiveIndex(resolveIndex(at));
      setOpen(true);
    },
    [resolveIndex],
  );

  const close = useCallback(
    ({ returnFocus = false }: { returnFocus?: boolean } = {}) => {
      setOpen(false);
      setMenuStyle(null);
      if (returnFocus) triggerRef.current?.focus();
    },
    [triggerRef],
  );

  const toggle = useCallback(() => (open ? close() : openMenu()), [close, open, openMenu]);

  // Follow the trigger while open.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const reposition = () => setMenuStyle(measureRef.current());
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  // A press outside the root and the menu closes it. `pointerdown` covers mouse, touch, and pen.
  useEffect(() => {
    if (!open) return undefined;
    function handlePointerDown(event: PointerEvent) {
      if (!isInside(event.target as Node | null)) close();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  });

  // Roving focus: the active row holds focus.
  useLayoutEffect(() => {
    if (!open || focus !== "items" || menuStyle == null) return;
    rowRefs.current[activeIndex]?.focus({ preventScroll: true });
  }, [activeIndex, focus, menuStyle, open]);

  // Keep the active row in view in a long menu.
  useLayoutEffect(() => {
    if (!open || focus !== "trigger") return;
    rowRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, focus, open]);

  function isInside(node: Node | null) {
    return node != null && (rootRef.current?.contains(node) === true || menuRef.current?.contains(node) === true);
  }

  function matchTypeAhead(key: string): number | null {
    const now = Date.now();
    const state = typeAhead.current;
    state.text = now - state.at > typeAheadResetMs ? key : state.text + key;
    state.at = now;
    const query = state.text.toLowerCase();
    // A repeated single letter cycles through rows starting with it.
    const cycling = query.length > 1 && [...query].every((char) => char === query[0]);
    const needle = cycling ? query[0] : query;
    const start = open ? activeIndex + (cycling || query.length === 1 ? 1 : 0) : 0;
    for (let offset = 0; offset < rows.length; offset += 1) {
      const index = (start + offset) % rows.length;
      const row = rows[index];
      if (row != null && !row.disabled && row.label.toLowerCase().startsWith(needle)) return index;
    }
    return null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing) return;
    const { key } = event;
    const isPrintable = key.length === 1 && key !== " " && !event.metaKey && !event.ctrlKey && !event.altKey;
    const onTrigger = triggerRef.current?.contains(event.target as Node) === true;

    if (!open) {
      if (!onTrigger) return;
      if (key === "ArrowDown" || key === "ArrowUp") {
        event.preventDefault();
        openMenu(focus === "trigger" ? "initial" : key === "ArrowDown" ? "first" : "last");
      } else if (focus === "trigger" && (key === "Home" || key === "End")) {
        event.preventDefault();
        openMenu(key === "Home" ? "first" : "last");
      } else if (focus === "trigger" && (key === "Enter" || key === " ")) {
        event.preventDefault();
        openMenu();
      } else if (focus === "trigger" && isPrintable) {
        const match = matchTypeAhead(key);
        if (match != null) openMenu(match);
      }
      return;
    }

    switch (key) {
      case "Escape":
        event.preventDefault();
        close({ returnFocus: true });
        return;
      case "Tab":
        close();
        return;
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => stepEnabled(rows, current, key === "ArrowDown" ? 1 : -1));
        return;
      case "Home":
      case "End":
        event.preventDefault();
        setActiveIndex(resolveIndex(key === "Home" ? "first" : "last"));
        return;
      case "Enter":
      case " ":
        if (focus === "trigger") {
          event.preventDefault();
          if (!rows[activeIndex]?.disabled) onChoose?.(activeIndex);
        } else if (key === " " && !onTrigger) {
          // A focused row is a button or a link; Space should choose it like Enter does.
          event.preventDefault();
          rowRefs.current[activeIndex]?.click();
        }
        return;
      default:
        if (isPrintable) {
          const match = matchTypeAhead(key);
          if (match != null) setActiveIndex(match);
        }
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (open && !isInside(event.relatedTarget as Node | null)) close();
  }

  return {
    open,
    activeIndex,
    menuStyle,
    openMenu,
    close,
    toggle,
    rootProps: {
      ref: (node: HTMLElement | null) => {
        rootRef.current = node;
      },
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
    },
    triggerProps: {
      "aria-expanded": open,
      "aria-controls": open ? menuId : undefined,
      "aria-activedescendant": focus === "trigger" && open ? rowId(activeIndex) : undefined,
    },
    menuProps: {
      id: menuId,
      ref: (node: HTMLElement | null) => {
        menuRef.current = node;
      },
      style: menuStyle ?? undefined,
    },
    rowProps: (index: number) => ({
      id: rowId(index),
      ref: (node: HTMLElement | null) => {
        rowRefs.current[index] = node;
      },
      tabIndex: -1,
      active: index === activeIndex,
      onMouseEnter: () => {
        if (!rows[index]?.disabled) setActiveIndex(index);
      },
    }),
  };
}

/** The next enabled row from `from` in `direction`, wrapping; `from` itself if none is enabled. */
export function stepEnabled(rows: readonly DropdownMenuRow[], from: number, direction: 1 | -1): number {
  const count = rows.length;
  if (count === 0) return 0;
  for (let step = 1; step <= count; step += 1) {
    const index = (((from + direction * step) % count) + count) % count;
    if (!rows[index]?.disabled) return index;
  }
  return Math.min(Math.max(from, 0), count - 1);
}
