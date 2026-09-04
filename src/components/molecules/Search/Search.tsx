import { forwardRef, type InputHTMLAttributes, type ReactElement } from "react";
import { cn } from "../../../lib/cn";
import { Button, type ButtonRole } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import {
  searchButtonSizeClasses,
  searchInlineInputClasses,
  searchInsetButtonClasses,
  searchShellClasses,
  type SearchSize,
} from "./searchStyles";

export type { SearchSize } from "./searchStyles";
export { searchSizes } from "./searchStyles";

/** Layout-only — width, margin, flex placement. */
export type SearchLayoutClassName = string;

export interface SearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: SearchSize;
  /** Trailing inset action — e.g. "Use my location", "GO". */
  actionLabel: string;
  onAction?: () => void;
  actionRole?: ButtonRole;
  actionDisabled?: boolean;
  /** Leading Lucide icon on the input. */
  icon?: ReactElement;
  className?: SearchLayoutClassName;
}

/**
 * Inline search pill — bare {@link Input} + inset {@link Button} in one shell.
 * Expanded search row — input + inset action button. Parent owns collapse/expand when morphing.
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    size = "md",
    actionLabel,
    onAction,
    actionRole = "primary",
    actionDisabled,
    icon,
    className,
    disabled,
    ...inputProps
  },
  ref,
) {
  const buttonSize = searchButtonSizeClasses[size];

  return (
    <div className={cn(searchShellClasses[size], className)}>
      <Input
        {...inputProps}
        ref={ref}
        inline
        size="sm"
        disabled={disabled}
        icon={icon}
        className={searchInlineInputClasses[size]}
      />
      <Button
        type="button"
        role={actionRole}
        size={buttonSize}
        disabled={disabled || actionDisabled}
        className={searchInsetButtonClasses}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
});
