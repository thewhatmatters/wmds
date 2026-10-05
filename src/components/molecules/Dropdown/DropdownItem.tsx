import { useRender } from "@base-ui/react/use-render";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  dropdownItemActiveClasses,
  dropdownItemButtonClasses,
  dropdownItemDisabledClasses,
  dropdownItemEndClasses,
  dropdownItemLabelClasses,
  dropdownItemLabelFullClasses,
  dropdownItemSelectedCheckClasses,
  dropdownItemStartClasses,
} from "./dropdownStyles";

/** Layout-only — not for row colors or typography overrides. */
export type DropdownItemLayoutClassName = string;

export interface DropdownItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Primary row label. */
  children: ReactNode;
  /** Leading affordance — icon, checkbox, swatch (from stories / app). */
  start?: ReactNode;
  /** Trailing meta — shortcut or count. Omitted when `selected` (check fills end). */
  end?: ReactNode;
  /** Committed selection — renders a check in the end slot, not a row fill. */
  selected?: boolean;
  /** Keyboard / hover highlight — transient row fill. */
  active?: boolean;
  /** When false, label stays full width — **Select** listbox. Default true for action menus. */
  truncate?: boolean;
  /**
   * Compose the row onto another element (Base UI `render`) — `render={<a href="/docs" />}` for a
   * menu of links, such as **Breadcrumb**'s collapsed pages. `disabled` maps to `aria-disabled`.
   */
  render?: ReactElement;
  className?: DropdownItemLayoutClassName;
}

/**
 * Dropdown row — start | label | end. Used by **Select** listbox options and future menu patterns.
 */
export function DropdownItem({
  children,
  start,
  end,
  selected = false,
  active = false,
  truncate = true,
  disabled,
  className,
  type = "button",
  render,
  ...props
}: DropdownItemProps) {
  const trailing = selected ? (
    <span className={dropdownItemSelectedCheckClasses} aria-hidden>
      <Check strokeWidth={2} />
    </span>
  ) : end != null ? (
    <span className={dropdownItemEndClasses}>{end}</span>
  ) : null;

  const rowClassName = cn(
    dropdownItemButtonClasses,
    selected && "hover:bg-transparent focus-visible:bg-transparent",
    active && !selected && dropdownItemActiveClasses,
    disabled && dropdownItemDisabledClasses,
    className,
  );
  const content = (
    <>
      {start != null ? (
        <span className={dropdownItemStartClasses} aria-hidden>
          {start}
        </span>
      ) : null}
      <span
        className={truncate ? dropdownItemLabelClasses : dropdownItemLabelFullClasses}
      >
        {children}
      </span>
      {trailing}
    </>
  );

  return (
    <DropdownItemShell
      {...props}
      render={render}
      type={type}
      disabled={disabled}
      className={rowClassName}
    >
      {content}
    </DropdownItemShell>
  );
}

interface DropdownItemShellProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  render?: ReactElement;
  className: string;
  children: ReactNode;
}

/** A `<button>` by default, or the row composed onto `render` — a link in a menu of links. */
function DropdownItemShell({ render, type, disabled, ...props }: DropdownItemShellProps) {
  return useRender({
    render,
    defaultTagName: "button",
    props: render
      ? { ...props, "aria-disabled": disabled ? true : undefined }
      : { ...props, type, disabled },
  });
}
