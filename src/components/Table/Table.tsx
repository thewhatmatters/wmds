import {
  createContext,
  useContext,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import "./table.css";
import {
  stickyScrollShadowClass,
  stickyStyles,
  type StickyOffsets,
} from "./tableLayout";
import { useMeasureTableLayout, useScrollEdgeState } from "./useTableLayout";
import { cn } from "../../lib/cn";

export type TableVariant = "surface" | "plain";
export type TableDensity = "compact" | "default";
export type TableAlign = "start" | "center" | "end";
export type TableSticky = "start" | "end";

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface wraps the scroller in card-like chrome; plain is borderless. */
  variant?: TableVariant;
  density?: TableDensity;
  /** Accessible name for the scroll region. */
  "aria-label"?: string;
  children?: ReactNode;
}

export interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  /**
   * Collapse the row with motion tokens instead of unmounting — keeps `Table.Header` static
   * while filtering. Requires `colSpan` matching the header column count.
   */
  visible?: boolean;
  /** Column span for collapsible rows — must match the number of table columns. */
  colSpan?: number;
}

export interface TableHeadProps
  extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: TableAlign;
  /** Tabular figures for numeric column headers. */
  numeric?: boolean;
  /** Pin column while horizontally scrolling — `start` (left) or `end` (right). */
  sticky?: TableSticky;
  /** Minimum width hint — helps sticky offset measurement stay stable. */
  minWidth?: number | string;
}

export interface TableCellProps
  extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: TableAlign;
  sticky?: TableSticky;
  /** Tabular figures for numeric columns. */
  numeric?: boolean;
  minWidth?: number | string;
}

interface StickyIndexHelpers {
  nextStart: () => number;
  nextEnd: () => number;
}

const TableContext = createContext<{ variant: TableVariant; density: TableDensity }>({
  variant: "surface",
  density: "default",
});

const StickyOffsetsContext = createContext<StickyOffsets>({ start: [], end: [] });

const ColumnTemplateContext = createContext<string | null>(null);

const StickyIndexContext = createContext<StickyIndexHelpers | null>(null);

const CollapsibleRowContext = createContext(false);

const ScrollEdgeContext = createContext({
  canScrollStart: false,
  canScrollEnd: false,
  stickyCounts: { start: 0, end: 0 },
});

function useTableContext() {
  return useContext(TableContext);
}

function useStickyOffsets() {
  return useContext(StickyOffsetsContext);
}

function useColumnTemplate() {
  return useContext(ColumnTemplateContext);
}

function useStickyIndexHelpers() {
  const helpers = useContext(StickyIndexContext);
  if (!helpers) {
    throw new Error("Table.Head and Table.Cell must be rendered inside Table.Row.");
  }
  return helpers;
}

function useCollapsibleRow() {
  return useContext(CollapsibleRowContext);
}

function useScrollEdge() {
  return useContext(ScrollEdgeContext);
}

function toMinWidth(value?: number | string) {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function cellPaddingClasses(density: TableDensity) {
  return density === "compact"
    ? "px-[length:var(--spacing-2)] py-[length:var(--spacing-1-5)]"
    : "px-[length:var(--spacing-3)] py-[length:var(--spacing-2)]";
}

function TableRoot({
  variant = "surface",
  density = "default",
  className,
  children,
  "aria-label": ariaLabel = "Scrollable table",
  ...props
}: TableProps) {
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { stickyOffsets, stickyCounts, columnTemplate } = useMeasureTableLayout(tableRef);
  const scrollEdge = useScrollEdgeState(scrollerRef);

  return (
    <TableContext.Provider value={{ variant, density }}>
      <ScrollEdgeContext.Provider value={{ ...scrollEdge, stickyCounts }}>
        <StickyOffsetsContext.Provider value={stickyOffsets}>
          <ColumnTemplateContext.Provider value={columnTemplate}>
            <div
              className={cn(
                "font-sans",
                variant === "surface" &&
                  "overflow-hidden rounded-lg border border-border bg-surface shadow-md",
                className,
              )}
              data-variant={variant}
              data-density={density}
              {...props}
            >
              <div
                ref={scrollerRef}
                aria-label={ariaLabel}
                className={cn(
                  "overflow-x-auto",
                  scrollEdge.canScrollStart &&
                    stickyCounts.start === 0 &&
                    "wmds-table-scroller-shadow-start",
                  scrollEdge.canScrollEnd &&
                    stickyCounts.end === 0 &&
                    "wmds-table-scroller-shadow-end",
                )}
                role="region"
                tabIndex={0}
              >
                <table
                  ref={tableRef}
                  className={cn(
                    "w-full min-w-max border-collapse text-left text-sm leading-[var(--line-height-sm)]",
                    density === "compact"
                      ? "text-xs leading-[var(--line-height-xs)]"
                      : "text-sm",
                  )}
                >
                  {children}
                </table>
              </div>
            </div>
          </ColumnTemplateContext.Provider>
        </StickyOffsetsContext.Provider>
      </ScrollEdgeContext.Provider>
    </TableContext.Provider>
  );
}

function TableHeader({ className, children, ...props }: TableSectionProps) {
  return (
    <thead className={cn("border-b border-border", className)} {...props}>
      {children}
    </thead>
  );
}

function TableBody({ className, children, ...props }: TableSectionProps) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

function TableRow({
  visible,
  colSpan,
  className,
  children,
  ...props
}: TableRowProps) {
  const columnTemplate = useColumnTemplate();
  const countersRef = useRef({ start: 0, end: 0 });
  countersRef.current.start = 0;
  countersRef.current.end = 0;

  const helpers: StickyIndexHelpers = {
    nextStart: () => countersRef.current.start++,
    nextEnd: () => countersRef.current.end++,
  };

  const rowClassName = cn(
    "group border-b border-border last:border-0 hover:bg-secondary-hover",
    className,
  );

  const rowContent = (
    <StickyIndexContext.Provider value={helpers}>{children}</StickyIndexContext.Provider>
  );

  if (visible === undefined) {
    return (
      <tr className={rowClassName} {...props}>
        {rowContent}
      </tr>
    );
  }

  if (colSpan == null) {
    throw new Error("Table.Row with `visible` requires `colSpan` matching the column count.");
  }

  const gridTemplateColumns = columnTemplate ?? `repeat(${colSpan}, minmax(0, 1fr))`;

  return (
    <tr aria-hidden={!visible} {...props}>
      <td colSpan={colSpan} className="border-0 p-0">
        <div className="motion-collapse" data-visible={visible ? "true" : "false"}>
          <div className="min-h-0 overflow-y-hidden">
            <CollapsibleRowContext.Provider value={true}>
              <div
                role="row"
                className={cn("grid w-full min-w-full items-center", rowClassName)}
                style={{ gridTemplateColumns }}
              >
                {rowContent}
              </div>
            </CollapsibleRowContext.Provider>
          </div>
        </div>
      </td>
    </tr>
  );
}

function TableHead({
  align = "start",
  sticky,
  numeric = false,
  minWidth,
  className,
  style,
  children,
  ...props
}: TableHeadProps) {
  const { variant, density } = useTableContext();
  const offsets = useStickyOffsets();
  const { stickyCounts, ...scrollEdge } = useScrollEdge();
  const { nextStart, nextEnd } = useStickyIndexHelpers();

  const stickyIndex =
    sticky === "start" ? nextStart() : sticky === "end" ? nextEnd() : undefined;

  const cellStyle = {
    minWidth: toMinWidth(minWidth),
    ...stickyStyles(sticky, stickyIndex, offsets),
    ...style,
  };

  return (
    <th
      className={cn(
        "whitespace-nowrap",
        cellPaddingClasses(density),
        "font-medium text-muted",
        align === "end" && "text-right",
        align === "center" && "text-center",
        numeric && "tabular-nums",
        variant === "surface" && "bg-surface",
        sticky != null && "sticky z-20",
        sticky === "start" && "border-r border-border",
        sticky === "end" && "border-l border-border",
        stickyScrollShadowClass(sticky, stickyIndex, stickyCounts, scrollEdge),
        className,
      )}
      data-sticky={sticky}
      data-sticky-index={stickyIndex}
      style={cellStyle}
      scope="col"
      {...props}
    >
      {children}
    </th>
  );
}

function TableCell({
  align = "start",
  sticky,
  numeric = false,
  minWidth,
  className,
  style,
  children,
  ...props
}: TableCellProps) {
  const { variant, density } = useTableContext();
  const offsets = useStickyOffsets();
  const { stickyCounts, ...scrollEdge } = useScrollEdge();
  const { nextStart, nextEnd } = useStickyIndexHelpers();
  const collapsible = useCollapsibleRow();

  const stickyIndex =
    sticky === "start" ? nextStart() : sticky === "end" ? nextEnd() : undefined;

  const cellStyle = {
    minWidth: toMinWidth(minWidth),
    ...stickyStyles(sticky, stickyIndex, offsets),
    ...style,
  };

  const cellClassName = cn(
    "whitespace-nowrap text-fg",
    cellPaddingClasses(density),
    align === "end" && "text-right",
    align === "center" && "text-center",
    numeric && "tabular-nums",
    sticky != null && "sticky z-10",
    sticky != null &&
      variant === "surface" &&
      "bg-surface group-hover:bg-secondary-hover",
    sticky != null && variant === "plain" && "bg-bg group-hover:bg-secondary-hover",
    sticky === "start" && "border-r border-border",
    sticky === "end" && "border-l border-border",
    stickyScrollShadowClass(sticky, stickyIndex, stickyCounts, scrollEdge),
    collapsible && "min-w-0",
    className,
  );

  if (collapsible) {
    return (
      <div
        role="cell"
        className={cellClassName}
        data-sticky={sticky}
        data-sticky-index={stickyIndex}
        style={cellStyle}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  }

  return (
    <td
      className={cellClassName}
      data-sticky={sticky}
      data-sticky-index={stickyIndex}
      style={cellStyle}
      {...props}
    >
      {children}
    </td>
  );
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
});
