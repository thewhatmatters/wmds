import { useRender } from "@base-ui/react/use-render";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import { ButtonBadge } from "./ButtonBadge";
import { ButtonIcon } from "./ButtonIcon";
import { ButtonStatusButton } from "./ButtonStatusButton";
import type { ButtonStatus } from "./buttonStatusStyles";
import {
  buttonBaseClasses,
  buttonPillClass,
  buttonRoleClasses,
  buttonNavLayoutClasses,
  buttonNavStateClasses,
  buttonRowBaseClasses,
  buttonRowLayoutClasses,
  buttonSizeClasses,
  type ButtonLayout,
  type ButtonRole,
  type ButtonSize,
} from "./buttonStyles";

export type { ButtonLayout, ButtonRole, ButtonSize } from "./buttonStyles";
export { buttonLayouts, buttonRoles } from "./buttonStyles";
export type { ButtonStatus } from "./buttonStatusStyles";
export { defaultStatusLabels, getNextButtonStatus } from "./buttonStatusStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type ButtonLayoutClassName = string;

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className" | "role" | "size"
  > {
  /** Button label. */
  children: ReactNode;
  /** Action role — primary CTA, secondary, ghost, or destructive. Default: `primary`. */
  role?: ButtonRole;
  /** `pill` (default) or `row` — flat full-width lines for detail / settings rows. */
  layout?: ButtonLayout;
  size?: ButtonSize;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  /**
   * Async / submit morph — whole pill animates idle → loading → success → error.
   * [Motion multi-state badge](https://motion.dev/examples/react-multi-state-badge).
   * Mutually exclusive with `icon` and `count`.
   */
  status?: ButtonStatus;
  statusLabels?: Partial<Record<ButtonStatus, string>>;
  /** When true, error state is non-interactive. Default: clickable for retry. */
  disableOnError?: boolean;
  /** Leading Lucide icon — `import { … } from "lucide-react"`. Not combinable with `status`. */
  icon?: ReactElement;
  /** Trailing numeric count (inbox / notifications). Not combinable with `status`. */
  count?: number;
  /** Inset nav row — `layout="nav"` only. Sets quiet selected fill + `aria-current`. */
  selected?: boolean;
  /**
   * Compose Button chrome onto another element (Base UI `render`) — e.g.
   * `render={<a href="/docs" />}` for navigation links. Pill layout only; not with `status`.
   * `disabled` maps to `aria-disabled` on non-button elements.
   */
  render?: ReactElement;
  /** Layout-only: width, margin, flex placement. */
  className?: ButtonLayoutClassName;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  "aria-keyshortcuts"?: string;
  id?: string;
  name?: string;
  form?: string;
}

function assertActionPattern(
  props: Pick<ButtonProps, "status" | "icon" | "count" | "layout" | "render">,
) {
  if (
    (props.layout === "row" || props.layout === "nav") &&
    (props.status != null || props.icon != null || props.count != null)
  ) {
    console.warn(
      `[WMDS Button] \`layout="${props.layout}"\` is mutually exclusive with \`status\`, \`icon\`, and \`count\`.`,
    );
  }

  if (props.status != null) {
    if (props.icon != null || props.count != null) {
      console.warn("[WMDS Button] `status` is mutually exclusive with `icon` and `count`.");
    }
  }

  if (props.render != null && (props.layout !== "pill" || props.status != null)) {
    console.warn("[WMDS Button] `render` is supported on `layout=\"pill\"` without `status` only.");
  }
}

interface ButtonPillProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "role"> {
  render?: ReactElement;
  className: string;
  children: ReactNode;
  "data-role": ButtonRole;
  "data-size": ButtonSize;
}

/** Pill shell — a `<button>` by default, or Button chrome composed onto `render` (Base UI). */
const ButtonPill = forwardRef<HTMLButtonElement, ButtonPillProps>(function ButtonPill(
  { render, type, disabled, ...props },
  ref,
) {
  return useRender({
    render,
    ref,
    defaultTagName: "button",
    props: render
      ? {
          ...props,
          "aria-disabled": disabled ? true : undefined,
          "data-disabled": disabled ? "" : undefined,
          tabIndex: disabled ? -1 : props.tabIndex,
        }
      : { ...props, type, disabled },
  });
});

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
    children,
    role = "primary",
    layout = "pill",
    size = "md",
    disabled,
    type = "button",
    status,
    statusLabels,
    disableOnError,
    icon,
    count,
    selected = false,
    render,
    className,
    onClick,
    "aria-label": ariaLabel,
    "aria-pressed": ariaPressed,
    "aria-keyshortcuts": ariaKeyShortcuts,
    id,
    name,
    form,
    ...buttonProps
  }, ref) {
  assertActionPattern({ status, icon, count, layout, render });

  if (status != null) {
    return (
      <ButtonStatusButton
        {...buttonProps}
        ref={ref}
        status={status}
        role={role}
        size={size}
        statusLabels={statusLabels}
        disableOnError={disableOnError}
        disabled={disabled}
        className={className}
        type={type}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        aria-keyshortcuts={ariaKeyShortcuts}
        id={id}
        name={name}
        form={form}
      >
        {children}
      </ButtonStatusButton>
    );
  }

  if (layout === "row") {
    return (
      <button
        {...buttonProps}
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        aria-keyshortcuts={ariaKeyShortcuts}
        id={id}
        name={name}
        form={form}
        className={cn(buttonRowBaseClasses, buttonRoleClasses[role], buttonRowLayoutClasses, className)}
        data-role={role}
        data-layout="row"
      >
        {children}
      </button>
    );
  }

  if (layout === "nav") {
    return (
      <button
        {...buttonProps}
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        aria-keyshortcuts={ariaKeyShortcuts}
        aria-current={selected ? "page" : undefined}
        id={id}
        name={name}
        form={form}
        className={cn(
          buttonRowBaseClasses,
          buttonNavLayoutClasses,
          buttonNavStateClasses(selected),
          className,
        )}
        data-layout="nav"
        data-selected={selected ? "" : undefined}
      >
        {children}
      </button>
    );
  }

  return (
    <ButtonPill
      {...buttonProps}
      ref={ref}
      render={render}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-keyshortcuts={ariaKeyShortcuts}
      id={id}
      name={name}
      form={form}
      className={cn(
        buttonBaseClasses,
        buttonRoleClasses[role],
        buttonSizeClasses[size],
        buttonPillClass,
        "gap-2",
        className,
      )}
      data-role={role}
      data-size={size}
    >
      {icon ? <ButtonIcon size={size}>{icon}</ButtonIcon> : null}
      <span>{children}</span>
      {count != null ? <ButtonBadge value={count} /> : null}
    </ButtonPill>
  );
});
