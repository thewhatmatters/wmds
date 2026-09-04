import type { ReactElement } from "react";
import { cn } from "../../../lib/cn";
import { ButtonIcon } from "../Button/ButtonIcon";
import { ButtonSpinner } from "../Button/ButtonSpinner";
import {
  buttonBaseClasses,
  buttonRoleClasses,
  iconButtonSizeClasses,
  type ButtonRole,
  type IconButtonSize,
} from "../Button/buttonStyles";
import { iconButtonFabClasses, iconButtonInsetFocusClasses, iconButtonInsetHitClasses, iconButtonInsetIconSizeClasses, iconButtonShapeClass } from "./iconButtonStyles";

export type { ButtonRole, IconButtonSize } from "../Button/buttonStyles";
export { buttonRoles } from "../Button/buttonStyles";

export type IconButtonInsetSize = "sm" | "md" | "lg";

/** Layout-only — not for colors, borders, or typography overrides. */
export type IconButtonLayoutClassName = string;

export interface IconButtonProps {
  /** Lucide icon — `import { … } from "lucide-react"`. */
  icon: ReactElement;
  /** Required — specific action name for screen readers (e.g. "Delete conversation"). */
  "aria-label": string;
  /** Action role. Default: `ghost` (toolbars). FAB pattern forces `primary`. */
  role?: ButtonRole;
  /** Toolbar / FAB size — or inset dismiss tier when `inset` is set. Default: `md`. */
  size?: IconButtonSize | IconButtonInsetSize;
  /** Inset dismiss — compact hit target for chip innards; `size` uses sm | md | lg inset scale. */
  inset?: boolean;
  /** Native tooltip for sighted users — defaults to `aria-label`. */
  title?: string;
  /** FAB pattern — primary fill + elevated shadow. [Astryx IconButton](https://astryx.atmeta.com/components/IconButton). */
  fab?: boolean;
  /** Shows spinner instead of icon — async feedback. */
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: IconButtonLayoutClassName;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  id?: string;
  name?: string;
  form?: string;
}

function assertIconButtonPattern(props: Pick<IconButtonProps, "fab" | "role">) {
  if (props.fab && props.role != null && props.role !== "primary") {
    console.warn("[WMDS IconButton] `fab` uses primary role — omit `role` or set `primary`.");
  }
}

/**
 * Icon-only action control — [Astryx IconButton](https://astryx.atmeta.com/components/IconButton).
 * Use when space is tight and the icon is universally understood; otherwise use `Button` with a label.
 */
export function IconButton({
  icon,
  "aria-label": ariaLabel,
  role: roleProp,
  size = "md",
  inset = false,
  title,
  fab = false,
  loading = false,
  disabled,
  type = "button",
  className,
  onClick,
  id,
  name,
  form,
}: IconButtonProps) {
  assertIconButtonPattern({ fab, role: roleProp });

  const role = fab ? "primary" : (roleProp ?? "ghost");
  const isDisabled = disabled || loading;
  const tooltip = title ?? ariaLabel;
  const insetSize = inset ? (size as IconButtonInsetSize) : null;
  const hitClass = inset
    ? iconButtonInsetHitClasses[insetSize ?? "md"]
    : iconButtonSizeClasses[size as IconButtonSize];

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      title={tooltip}
      onClick={onClick}
      id={id}
      name={name}
      form={form}
      className={cn(
        buttonBaseClasses,
        buttonRoleClasses[role],
        hitClass,
        iconButtonShapeClass,
        inset && iconButtonInsetFocusClasses,
        fab && iconButtonFabClasses,
        className,
      )}
      data-role={role}
      data-size={size}
      data-pattern={fab ? "fab" : inset ? "inset" : "icon"}
      data-loading={loading || undefined}
    >
      {loading ? (
        <ButtonSpinner size={inset ? "xs" : (size as IconButtonSize)} />
      ) : inset ? (
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center text-inherit [&>svg]:size-full",
            iconButtonInsetIconSizeClasses[insetSize ?? "md"],
          )}
          aria-hidden
        >
          {icon}
        </span>
      ) : (
        <ButtonIcon size={size as IconButtonSize}>{icon}</ButtonIcon>
      )}
    </button>
  );
}
