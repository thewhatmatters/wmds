import type { ButtonHTMLAttributes, ReactNode } from "react";
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
  ...props
}: DropdownItemProps) {
  const trailing = selected ? (
    <span className={dropdownItemSelectedCheckClasses} aria-hidden>
      <Check strokeWidth={2} />
    </span>
  ) : end != null ? (
    <span className={dropdownItemEndClasses}>{end}</span>
  ) : null;

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={cn(
        dropdownItemButtonClasses,
        selected && "hover:bg-transparent focus-visible:bg-transparent",
        active && !selected && dropdownItemActiveClasses,
        disabled && dropdownItemDisabledClasses,
        className,
      )}
    >
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
    </button>
  );
}
