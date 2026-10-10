import {
  Children,
  forwardRef,
  isValidElement,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import { tileGridColumnCount, tileGridResolveColumns, tileGridRowSpan } from "./tileGridMath";
import {
  tileGridEmptyClasses,
  tileGridItemClasses,
  tileGridItemInnerClasses,
  tileGridListClasses,
  tileGridRootClasses,
  tileGridRowUnitPx,
  type TileGridColumns,
  type TileGridLayout,
} from "./tileGridStyles";

export {
  tileGridBreakpoints,
  tileGridDefaultColumns,
  tileGridLayouts,
  type TileGridBreakpoint,
  type TileGridColumns,
  type TileGridLayout,
} from "./tileGridStyles";

/** Layout-only — width, margin, or grid placement. */
export type TileGridLayoutClassName = string;

export interface TileGridProps {
  /**
   * `masonry` (default) — tiles keep their heights and pack upward, each next tile going to the
   * shortest column. `uniform` — rows of equal height; give the tiles a fixed `ratio`.
   */
  layout?: TileGridLayout;
  /**
   * Columns — one number, or one per breakpoint (`{ base, sm, md, lg, xl }`; a breakpoint left out
   * keeps the one below it). Default: `{ base: 1, sm: 2, lg: 3 }`. The gap is the grid gutter.
   */
  columns?: TileGridColumns;
  /** Shown in place of the tiles when there are none — for example "No resources match these filters." */
  empty?: ReactNode;
  /** The tiles are placeholders for content on its way (`aria-busy`). */
  busy?: boolean;
  /** Names the list for screen readers, for example "Resources". */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** **TileGrid.Item** children, one per tile, each with a `key`. */
  children?: ReactNode;
  className?: TileGridLayoutClassName;
}

export interface TileGridItemProps {
  /** One tile — a **LinkTile**, or a card. */
  children?: ReactNode;
  className?: TileGridLayoutClassName;
}

/**
 * A grid of tiles on the page gutter. Reading order and tab order are the order of the items in
 * both layouts: a masonry grid places each item in the shortest column, so the order runs across
 * the top row and then down the page.
 */
function TileGridRoot({
  layout = "masonry",
  columns,
  empty,
  busy = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  className,
}: TileGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const items = Children.toArray(children);
  const hasItems = items.length > 0;
  const itemKeys = items.map((item) => (isValidElement(item) ? item.key : "")).join("|");
  const resolved = tileGridResolveColumns(columns);
  const style = useMemo(
    () =>
      ({
        "--tile-grid-cols": resolved.base,
        "--tile-grid-cols-sm": resolved.sm,
        "--tile-grid-cols-md": resolved.md,
        "--tile-grid-cols-lg": resolved.lg,
        "--tile-grid-cols-xl": resolved.xl,
      }) as CSSProperties,
    [resolved.base, resolved.sm, resolved.md, resolved.lg, resolved.xl],
  );

  // Masonry: each item spans the row tracks its measured height needs, and the browser's own grid
  // placement packs them in item order. One column needs no packing; the server and the first
  // paint show aligned rows.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (list == null) return;
    const elements = () => [...list.children].filter((child): child is HTMLElement => child instanceof HTMLElement);

    if (layout !== "masonry" || typeof ResizeObserver === "undefined") {
      list.removeAttribute("data-packed");
      for (const item of elements()) item.style.removeProperty("grid-row-end");
      return;
    }

    const sync = () => {
      const pack = tileGridColumnCount(getComputedStyle(list).gridTemplateColumns) > 1;
      for (const item of elements()) {
        const inner = item.firstElementChild;
        if (pack && inner != null) {
          // offsetHeight: a tile mid-move is transformed, and its layout height is what packs.
          const height = inner instanceof HTMLElement ? inner.offsetHeight : inner.getBoundingClientRect().height;
          item.style.gridRowEnd = `span ${tileGridRowSpan(height, tileGridRowUnitPx)}`;
        } else {
          item.style.removeProperty("grid-row-end");
        }
      }
      list.toggleAttribute("data-packed", pack);
    };

    sync();
    // Packing changes the list's own height, so a resize is answered on the next frame, not
    // inside the observer's callback.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    });
    observer.observe(list);
    for (const item of elements()) {
      if (item.firstElementChild != null) observer.observe(item.firstElementChild);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [layout, itemKeys]);

  return (
    <div className={cn(tileGridRootClasses, className)} data-tile-grid="" data-layout={layout}>
      {hasItems ? (
        <ul
          ref={listRef}
          role="list"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-busy={busy || undefined}
          className={tileGridListClasses}
          style={style}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {children}
          </AnimatePresence>
        </ul>
      ) : empty != null ? (
        <div className={tileGridEmptyClasses} data-tile-grid-empty="">
          {empty}
        </div>
      ) : null}
    </div>
  );
}

/**
 * One tile's place in the grid. When the set of items changes, the ones that stay move to their
 * new places and the ones that come and go fade; under reduced motion they change at once.
 */
const TileGridItem = forwardRef<HTMLLIElement, TileGridItemProps>(function TileGridItem(
  { children, className },
  ref,
) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.li
      ref={ref}
      layout={reduce ? false : "position"}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={motionTransitionProp("medium")}
      className={cn(tileGridItemClasses, className)}
    >
      <div className={tileGridItemInnerClasses}>{children}</div>
    </motion.li>
  );
});

export const TileGrid = Object.assign(TileGridRoot, {
  Item: TileGridItem,
});
