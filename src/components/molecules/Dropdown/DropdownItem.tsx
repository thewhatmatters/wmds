import { useRender } from "@base-ui/react/use-render";
import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode, type Ref } from "react";
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
export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(function DropdownItem({
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
}, ref) {
  const trailing = selected ? (
    <span className={dropdownItemSelectedCheckClasses} aria-hidden>
      <Check strokeWidth={2} />
    </span>
  ) : end != null ? (
    <span className={dropdownItemEndClasses}>{end}</span>
  ) : null;

  const rowClassName = cn(
    dropdownItemButtonClasses,
    // The active row (keyboard or pointer) is always filled, a selected one included, so focus is visible.
    selected && !active && "hover:bg-transparent",
    active && dropdownItemActiveClasses,
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
      elementRef={ref}
      render={render}
      type={type}
      disabled={disabled}
      className={rowClassName}
    >
      {content}
    </DropdownItemShell>
  );
});

interface DropdownItemShellProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Not `ref`: a plain function component only receives `ref` as a prop on React 19. */
  elementRef?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  className: string;
  children: ReactNode;
}

/** A `<button>` by default, or the row composed onto `render` — a link in a menu of links. */
function DropdownItemShell({ elementRef, render, type, disabled, ...props }: DropdownItemShellProps) {
  return useRender({
    render,
    ref: elementRef,
    defaultTagName: "button",
    props: render
      ? { ...props, "aria-disabled": disabled ? true : undefined }
      : { ...props, type, disabled },
  });
}
