import { useRender } from "@base-ui/react/use-render";
import { forwardRef, type ButtonHTMLAttributes, type ReactElement } from "react";
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
import {
  iconButtonExpandedStyle,
  iconButtonFabClasses,
  iconButtonInsetFocusClasses,
  iconButtonInsetHitClasses,
  iconButtonInsetIconSizeClasses,
  iconButtonShapeClass,
} from "./iconButtonStyles";

export type { ButtonRole, IconButtonSize } from "../Button/buttonStyles";
export { buttonRoles } from "../Button/buttonStyles";

export type IconButtonInsetSize = "sm" | "md" | "lg";

/** Layout-only — not for colors, borders, or typography overrides. */
export type IconButtonLayoutClassName = string;

export interface IconButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "aria-label" | "children" | "className" | "role" | "size" | "title"
  > {
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
  /** Native tooltip for sighted users — defaults to `aria-label`. Pass `""` to suppress. */
  title?: string;
  /** FAB pattern — primary fill + elevated shadow. */
  fab?: boolean;
  /** Shows spinner instead of icon — async feedback. */
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  /**
   * Compose IconButton chrome onto another element (Base UI `render`) — e.g.
   * `render={<a href="/" />}` for a circular brand mark. Not with `fab` or `inset`.
   * `disabled` maps to `aria-disabled` on non-button elements.
   */
  render?: ReactElement;
  className?: IconButtonLayoutClassName;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  "aria-current"?: React.AriaAttributes["aria-current"];
  "aria-haspopup"?: boolean | "menu" | "dialog" | "listbox" | "tree" | "grid";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  id?: string;
  name?: string;
  form?: string;
}

function assertIconButtonPattern(
  props: Pick<IconButtonProps, "fab" | "role" | "render" | "inset">,
) {
  if (props.fab && props.role != null && props.role !== "primary") {
    console.warn("[WMDS IconButton] `fab` uses primary role — omit `role` or set `primary`.");
  }
  if (props.render != null && (props.fab || props.inset)) {
    console.warn("[WMDS IconButton] `render` is not supported with `fab` or `inset`.");
  }
}

/**
 * Icon-only action control — circular hit target; **`aria-label` required**.
 * Use when space is tight and the icon is universally understood; otherwise use `Button` with a label.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
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
    render,
    className,
    onClick,
    onKeyDown,
    "aria-current": ariaCurrent,
    "aria-haspopup": ariaHasPopup,
    "aria-expanded": ariaExpanded,
    "aria-controls": ariaControls,
    id,
    name,
    form,
    ...buttonProps
  },
  ref,
) {
  assertIconButtonPattern({ fab, role: roleProp, render, inset });

  const role = fab ? "primary" : (roleProp ?? "ghost");
  const isDisabled = disabled || loading;
  const tooltip = title === undefined ? ariaLabel : title;
  const insetSize = inset ? (size as IconButtonInsetSize) : null;
  const hitClass = inset
    ? iconButtonInsetHitClasses[insetSize ?? "md"]
    : iconButtonSizeClasses[size as IconButtonSize];

  const classNameMerged = cn(
    buttonBaseClasses,
    buttonRoleClasses[role],
    hitClass,
    iconButtonShapeClass,
    inset && iconButtonInsetFocusClasses,
    fab && iconButtonFabClasses,
    className,
  );

  const content = loading ? (
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
  );

  return useRender({
    render,
    ref,
    defaultTagName: "button",
    props: render
      ? {
          ...buttonProps,
          className: classNameMerged,
          "aria-label": ariaLabel,
          "aria-current": ariaCurrent,
          "aria-haspopup": ariaHasPopup,
          "aria-expanded": ariaExpanded,
          "aria-controls": ariaControls,
          "aria-busy": loading || undefined,
          "aria-disabled": isDisabled ? true : undefined,
          "data-disabled": isDisabled ? "" : undefined,
          "data-role": role,
          "data-size": size,
          "data-pattern": fab ? "fab" : inset ? "inset" : "icon",
          "data-loading": loading || undefined,
          title: tooltip === "" ? undefined : tooltip,
          tabIndex: isDisabled ? -1 : buttonProps.tabIndex,
          onClick,
          onKeyDown,
          id,
          name,
          form,
          style: ariaExpanded && role === "ghost" ? iconButtonExpandedStyle : undefined,
          children: content,
        }
      : {
          ...buttonProps,
          className: classNameMerged,
          type,
          disabled: isDisabled,
          "aria-busy": loading || undefined,
          "aria-label": ariaLabel,
          "aria-current": ariaCurrent,
          "aria-haspopup": ariaHasPopup,
          "aria-expanded": ariaExpanded,
          "aria-controls": ariaControls,
          title: tooltip === "" ? undefined : tooltip,
          onClick,
          onKeyDown,
          id,
          name,
          form,
          style: ariaExpanded && role === "ghost" ? iconButtonExpandedStyle : undefined,
          "data-role": role,
          "data-size": size,
          "data-pattern": fab ? "fab" : inset ? "inset" : "icon",
          "data-loading": loading || undefined,
          children: content,
        },
  });
});
