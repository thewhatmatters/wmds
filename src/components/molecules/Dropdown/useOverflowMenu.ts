import { isValidElement, useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { measureDropdownMenuStyle, type DropdownMenuMeasureRow } from "./dropdownMenuPosition";
import { resolveOverflow } from "./resolveOverflow";
import { useDropdownMenu, type DropdownMenuRow } from "./useDropdownMenu";

export interface OverflowMenuOptions {
  /** Every item's stable id, in order. */
  ids: readonly string[];
  /** The current item: it stays visible, promoted into the last slot before More. */
  activeId: string;
  /** The More menu's rows for the items that don't fit (a SiteNav menu flattens into several). */
  toMenuRows: (overflowIds: readonly string[]) => DropdownMenuRow[];
  /** How to size the menu (slots, counts, a check). Default: the rows' labels. */
  toMeasureRows?: (overflowIds: readonly string[]) => DropdownMenuMeasureRow[];
}

/**
 * A row of items that folds what doesn't fit into a More menu: **Tab** and **SiteNav**.
 *
 * Owns the measuring (an offscreen rail of every item plus More, a ResizeObserver on the row, a
 * remeasure once fonts load), the fit ({@link resolveOverflow}), and the More menu's behaviour
 * ({@link useDropdownMenu}, roving focus). Callers render their own items, More button, and rows.
 */
export function useOverflowMenu({ ids, activeId, toMenuRows, toMeasureRows }: OverflowMenuOptions) {
  const rowRef = useRef<HTMLElement | null>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const moreMeasureRef = useRef<HTMLElement | null>(null);
  const measureRefs = useRef(new Map<string, HTMLElement>());
  const [visibleIds, setVisibleIds] = useState<readonly string[]>(ids);
  const [overflowIds, setOverflowIds] = useState<readonly string[]>([]);

  const menuRows = toMenuRows(overflowIds);
  const menu = useDropdownMenu({
    rows: menuRows,
    triggerRef: moreRef,
    focus: "items",
    measure: () =>
      moreRef.current == null
        ? null
        : measureDropdownMenuStyle(
            moreRef.current,
            toMeasureRows?.(overflowIds) ?? menuRows.map((row) => ({ label: row.label })),
            { align: "end", widthMode: "content" },
          ),
  });
  const { close } = menu;

  const idsKey = ids.join("\u0000");
  const recalculate = useCallback(() => {
    const row = rowRef.current;
    const more = moreMeasureRef.current;
    if (row == null || more == null) return;

    const measured = idsKey.split("\u0000").map((id) => ({
      value: id,
      width: Math.ceil(measureRefs.current.get(id)?.getBoundingClientRect().width ?? 0),
    }));
    if (measured.some((item) => item.width === 0)) return;

    const result = resolveOverflow(measured, activeId, row.clientWidth, Math.ceil(more.getBoundingClientRect().width));
    setVisibleIds(result.visibleValues);
    setOverflowIds(result.overflowValues);
    if (result.overflowValues.length === 0) close();
  }, [activeId, close, idsKey]);

  useLayoutEffect(() => {
    recalculate();
    const row = rowRef.current;
    if (row == null) return undefined;
    const observer = new ResizeObserver(recalculate);
    observer.observe(row);
    void document.fonts?.ready.then(recalculate);
    return () => observer.disconnect();
  }, [recalculate]);

  return {
    visibleIds,
    overflowIds,
    menuRows,
    menu,
    moreRef,
    /** Spread on the element whose width the items share; it also wraps More and its menu. */
    rowProps: {
      ...menu.rootProps,
      ref: (node: HTMLElement | null) => {
        rowRef.current = node;
        menu.rootProps.ref(node);
      },
    },
    /** Ref for an item's copy in the offscreen measure rail. */
    measureRef: (id: string) => (node: HTMLElement | null) => {
      if (node == null) measureRefs.current.delete(id);
      else measureRefs.current.set(id, node);
    },
    /** Ref for More's copy in the offscreen measure rail. */
    moreMeasureRef: (node: HTMLElement | null) => {
      moreMeasureRef.current = node;
    },
  };
}

/** Plain text of a label, for type-ahead in a More menu. */
export function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}
