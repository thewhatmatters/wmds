import { useRender } from "@base-ui/react/use-render";
import { SquareArrowOutUpRight } from "lucide-react";
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
  buttonAlignClasses,
  buttonBaseClasses,
  buttonEndIconSquareClasses,
  buttonExternalIconClasses,
  buttonOutlineQuietClasses,
  buttonRowWidthClasses,
  buttonMonoLabelClasses,
  buttonPillClass,
  buttonRoleClasses,
  buttonNavLayoutClasses,
  buttonNavStateClasses,
  buttonRowBaseClasses,
  buttonRowLayoutClasses,
  buttonSizeClasses,
  type ButtonAlign,
  type ButtonEmphasis,
  type ButtonLayout,
  type ButtonRole,
  type ButtonSize,
  type ButtonWidth,
} from "./buttonStyles";

export type { ButtonAlign, ButtonEmphasis, ButtonLayout, ButtonRole, ButtonSize, ButtonWidth } from "./buttonStyles";
export { buttonAligns, buttonEmphases, buttonLayouts, buttonRoles, buttonWidths } from "./buttonStyles";
export type { ButtonStatus } from "./buttonStatusStyles";
export { buttonStatusHoldMs, defaultStatusLabels, getNextButtonStatus } from "./buttonStatusStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type ButtonLayoutClassName = string;

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className" | "role" | "size"
  > {
  /** Button label. */
  children: ReactNode;
  /** Action role — primary, secondary, ghost, destructive, inverse, or outline (hairline, transparent fill). Default: `primary`. */
  role?: ButtonRole;
  /** `pill` (default) or `row` — flat full-width lines for detail / settings rows. */
  layout?: ButtonLayout;
  /**
   * `layout="row"` only. `fill` (default) spans the container with label and value pushed apart;
   * `hug` sizes the row to its content with a tight gap — e.g. an inline disclosure trigger.
   */
  width?: ButtonWidth;
  /**
   * Pill content alignment. `center` (default); `start` left-aligns the label — full-width
   * suggestion or choice pills. Size the pill with `className` (`w-full`).
   */
  align?: ButtonAlign;
  /**
   * `role="outline"` only. `strong` (default) is the `border-fg` hairline; `quiet` uses the
   * `border-border` hairline for secondary choices such as follow-up suggestions.
   */
  emphasis?: ButtonEmphasis;
  size?: ButtonSize;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  /**
   * Async / submit morph — whole pill animates idle → loading → success → error.
   * [Motion multi-state badge](https://motion.dev/examples/react-multi-state-badge).
   * With `icon`, the status glyphs morph out of the icon (a copy button's Copy glyph turns into the
   * check). Mutually exclusive with `count`, `endIcon`, `mono`, and `render`.
   */
  status?: ButtonStatus;
  statusLabels?: Partial<Record<ButtonStatus, string>>;
  /** When true, error state is non-interactive. Default: clickable for retry. */
  disableOnError?: boolean;
  /** Leading Lucide icon — `import { … } from "lucide-react"`. With `status`, it morphs into the status glyph. */
  icon?: ReactElement;
  /** Trailing numeric count (inbox / notifications). Not combinable with `status`. */
  count?: number;
  /**
   * Mono uppercase label. Pairs with `role="outline"` for an eyebrow action.
   * Not with `status`.
   */
  mono?: boolean;
  /**
   * Trailing Lucide glyph on a filled accent square. Not with `status`, `count`,
   * or `layout="row"` / `layout="nav"`.
   */
  endIcon?: ReactElement;
  /** Inset nav row — `layout="nav"` only. Sets quiet selected fill + `aria-current`. */
  selected?: boolean;
  /**
   * Compose Button chrome onto another element (Base UI `render`) — e.g.
   * `render={<a href="/docs" />}` for navigation links. Pill layout only; not with `status`.
   * `disabled` maps to `aria-disabled` on non-button elements.
   */
  render?: ReactElement;
  /**
   * With `render={<a href />}` to another site: opens it in a new tab (`target="_blank"`, a safe
   * `rel`), tells screen readers so, and shows the trailing external icon **TextLink** uses.
   */
  external?: boolean;
  /** `external` only — `false` drops the trailing icon; the spoken "opens in a new tab" stays. */
  externalIcon?: boolean;
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
  props: Pick<
    ButtonProps,
    | "status"
    | "icon"
    | "count"
    | "layout"
    | "render"
    | "endIcon"
    | "mono"
    | "width"
    | "align"
    | "emphasis"
    | "role"
    | "external"
  >,
) {
  if (props.external && (props.render == null || props.layout !== "pill")) {
    console.warn('[WMDS Button] `external` needs `render={<a href />}` on a pill button.');
  }
  if (props.external && props.endIcon != null) {
    console.warn("[WMDS Button] `external` is mutually exclusive with `endIcon`.");
  }
  if (props.width != null && props.layout !== "row") {
    console.warn('[WMDS Button] `width` applies to `layout="row"` only.');
  }
  if (props.align != null && (props.layout === "row" || props.layout === "nav")) {
    console.warn('[WMDS Button] `align` applies to pill buttons only.');
  }
  if (props.emphasis != null && props.role !== "outline") {
    console.warn('[WMDS Button] `emphasis` applies to `role="outline"` only.');
  }

  if (
    (props.layout === "row" || props.layout === "nav") &&
    (props.status != null || props.icon != null || props.count != null || props.endIcon != null || props.mono)
  ) {
    console.warn(
      `[WMDS Button] \`layout="${props.layout}"\` is mutually exclusive with \`status\`, \`icon\`, \`count\`, \`endIcon\`, and \`mono\`.`,
    );
  }

  if (props.status != null) {
    if (props.count != null || props.endIcon != null || props.mono) {
      console.warn("[WMDS Button] `status` is mutually exclusive with `count`, `endIcon`, and `mono`.");
    }
  }

  if (props.endIcon != null && props.count != null) {
    console.warn("[WMDS Button] `endIcon` is mutually exclusive with `count`.");
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
    width,
    align,
    emphasis,
    size = "md",
    disabled,
    type = "button",
    status,
    statusLabels,
    disableOnError,
    icon,
    count,
    mono = false,
    endIcon,
    selected = false,
    render,
    external = false,
    externalIcon = true,
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
  assertActionPattern({ status, icon, count, layout, render, endIcon, mono, width, align, emphasis, role, external });

  if (status != null) {
    return (
      <ButtonStatusButton
        {...buttonProps}
        ref={ref}
        status={status}
        role={role}
        size={size}
        statusLabels={statusLabels}
        icon={icon}
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
        className={cn(
          buttonRowBaseClasses,
          buttonRoleClasses[role],
          buttonRowLayoutClasses,
          buttonRowWidthClasses[width ?? "fill"],
          className,
        )}
        data-role={role}
        data-layout="row"
        data-width={width ?? "fill"}
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

  const opensNewTab = external && render != null;

  return (
    <ButtonPill
      {...buttonProps}
      {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : null)}
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
        buttonAlignClasses[align ?? "center"],
        role === "outline" && emphasis === "quiet" ? buttonOutlineQuietClasses : buttonRoleClasses[role],
        buttonSizeClasses[size],
        buttonPillClass,
        "gap-2",
        className,
      )}
      data-role={role}
      data-size={size}
      data-align={align}
      data-emphasis={role === "outline" ? (emphasis ?? "strong") : undefined}
      data-mono={mono ? "" : undefined}
      data-end-icon={endIcon ? "" : undefined}
      data-external={opensNewTab ? "" : undefined}
    >
      {icon ? <ButtonIcon size={size}>{icon}</ButtonIcon> : null}
      <span className={mono ? buttonMonoLabelClasses : undefined}>
        {children}
        {opensNewTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </span>
      {opensNewTab && externalIcon ? (
        <SquareArrowOutUpRight className={buttonExternalIconClasses} strokeWidth={2} aria-hidden />
      ) : null}
      {endIcon ? (
        <span className={buttonEndIconSquareClasses}>
          <ButtonIcon size="xs">{endIcon}</ButtonIcon>
        </span>
      ) : null}
      {count != null ? <ButtonBadge value={count} /> : null}
    </ButtonPill>
  );
});
