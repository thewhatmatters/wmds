import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import {
  tableAlignClasses,
  tableBodyClasses,
  tableCaptionClasses,
  tableCellClasses,
  tableClasses,
  tableFooterClasses,
  tableHeadClasses,
  tableHeaderClasses,
  tableRowClasses,
  tableScrollClasses,
  tableStickyClasses,
  type TableAlign,
} from "./tableStyles";

export { tableAligns, type TableAlign } from "./tableStyles";

/** Layout-only — width, margin, or grid placement. */
export type TableLayoutClassName = string;

export interface TableProps {
  /** `TableCaption`, `TableHeader`, `TableBody`, and `TableFooter`. */
  children: ReactNode;
  /** Names the scrolling region and the table. One of `aria-label` or `aria-labelledby` is required. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Layout-only — applies to the scroll box. */
  className?: TableLayoutClassName;
}

export interface TableSectionProps {
  children?: ReactNode;
  className?: TableLayoutClassName;
}

export interface TableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, "className"> {
  children?: ReactNode;
  className?: TableLayoutClassName;
}

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "className" | "align"> {
  /** Text alignment of the column. Default `start`. */
  align?: TableAlign;
  /** Pin the column to the start edge while the table scrolls sideways. Set it on every cell of the column. */
  sticky?: boolean;
  className?: TableLayoutClassName;
}

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "className" | "align"> {
  /** Text alignment of the column. Default `start`. `end` sets tabular figures. */
  align?: TableAlign;
  /** Pin the column to the start edge while the table scrolls sideways. Set it on every cell of the column. */
  sticky?: boolean;
  className?: TableLayoutClassName;
}

export interface TableCaptionProps {
  children: ReactNode;
  className?: TableLayoutClassName;
}

/**
 * Semantic table in a horizontal-scroll box. The box is a focusable `region` named by the table's
 * label, so a keyboard can scroll it; the table never squeezes its columns below their content.
 */
function Table({ children, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, className }: TableProps) {
  return (
    <div
      role="region"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(tableScrollClasses, className)}
    >
      <table className={tableClasses}>
        {children}
      </table>
    </div>
  );
}

function TableHeader({ children, className }: TableSectionProps) {
  return <thead className={cn(tableHeaderClasses, className)}>{children}</thead>;
}

function TableBody({ children, className }: TableSectionProps) {
  return <tbody className={cn(tableBodyClasses, className)}>{children}</tbody>;
}

function TableFooter({ children, className }: TableSectionProps) {
  return <tfoot className={cn(tableFooterClasses, className)}>{children}</tfoot>;
}

function TableRow({ children, className, ...rest }: TableRowProps) {
  return (
    <tr {...rest} className={cn(tableRowClasses, className)}>
      {children}
    </tr>
  );
}

function TableHead({ align = "start", sticky, scope = "col", className, children, ...rest }: TableHeadProps) {
  return (
    <th {...rest} scope={scope} className={cn(tableHeadClasses, tableAlignClasses[align], sticky && tableStickyClasses, className)}>
      {children}
    </th>
  );
}

function TableCell({ align = "start", sticky, className, children, ...rest }: TableCellProps) {
  return (
    <td {...rest} className={cn(tableCellClasses, tableAlignClasses[align], sticky && tableStickyClasses, className)}>
      {children}
    </td>
  );
}

function TableCaption({ children, className }: TableCaptionProps) {
  return <caption className={cn(tableCaptionClasses, className)}>{children}</caption>;
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
