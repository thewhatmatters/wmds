import { forwardRef, useId, type InputHTMLAttributes, type ReactElement } from "react";
import { cn } from "../../../lib/cn";
import { Button, type ButtonRole } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { type InputStatus } from "../../atoms/Input/inputShellStyles";
import { InputStatusBanner, warnStatusWithoutMessage } from "../../atoms/inputShared/InputStatusBanner";
import {
  searchBannerSizes,
  searchButtonSizeClasses,
  searchShellBorderClasses,
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
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "width"> {
  size?: SearchSize;
  /**
   * The field's name, read by screen readers (Labels and placeholders F7, F10). It may stay visually
   * hidden: a search field alone with its button is the one place a hidden label is allowed.
   */
  label?: string;
  /** Trailing inset action — e.g. "Use my location", "GO". */
  actionLabel: string;
  onAction?: () => void;
  actionRole?: ButtonRole;
  actionDisabled?: boolean;
  /**
   * `submit` makes the inset action the form's submit button, so Enter and a click both send the form (a
   * newsletter or waitlist signup). Default `button`: it calls `onAction` only.
   */
  actionType?: "button" | "submit";
  /** Leading Lucide icon on the input. */
  icon?: ReactElement;
  /** Validation status: the pill's border takes the colour and, with `message`, the band opens under it. */
  status?: InputStatus;
  /** What's wrong and how to fix it, in the band under the pill (Errors and validation V6, V10). Needs `status`. */
  message?: string;
  className?: SearchLayoutClassName;
}

/**
 * Inline search pill — bare {@link Input} + inset {@link Button} in one shell.
 * Expanded search row — input + inset action button. Parent owns collapse/expand when morphing.
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    size = "md",
    label,
    actionLabel,
    onAction,
    actionRole = "primary",
    actionDisabled,
    actionType = "button",
    icon,
    status,
    message,
    className,
    disabled,
    ...inputProps
  },
  ref,
) {
  const buttonSize = searchButtonSizeClasses[size];
  const messageId = `${useId()}-message`;
  warnStatusWithoutMessage("Search", status, message);
  const hasMessage = status != null && message != null && message.length > 0;
  const describedBy = [inputProps["aria-describedby"], hasMessage ? messageId : undefined].filter(Boolean).join(" ") || undefined;
  if (label == null && inputProps["aria-label"] == null && inputProps["aria-labelledby"] == null) {
    console.warn("[WMDS Search] Provide `label` (it can stay hidden), `aria-label`, or `aria-labelledby`.");
  }

  // One tree whether or not a message shows, so React keeps the same <input>: what people typed and the focus
  // survive the band opening (Errors and validation V4).
  return (
    <div className={cn("relative flex w-full flex-col", className)}>
      <div className={cn(searchShellClasses[size], searchShellBorderClasses[status ?? "default"])}>
        <Input
          {...inputProps}
          aria-label={inputProps["aria-label"] ?? label}
          aria-describedby={describedBy}
          aria-invalid={status === "error" || inputProps["aria-invalid"] || undefined}
          ref={ref}
          inline
          size="sm"
          disabled={disabled}
          icon={icon}
          className={searchInlineInputClasses[size]}
        />
        <Button
          type={actionType}
          role={actionRole}
          size={buttonSize}
          disabled={disabled || actionDisabled}
          className={searchInsetButtonClasses}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </div>
      {hasMessage ? (
        <InputStatusBanner status={status} message={message} messageId={messageId} size={searchBannerSizes[size]} messagePosition="bottom" />
      ) : null}
    </div>
  );
});
