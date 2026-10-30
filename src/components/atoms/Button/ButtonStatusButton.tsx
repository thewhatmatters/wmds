import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { ButtonStatusIcon, ButtonStatusLabel } from "./ButtonStatusContent";
import { buttonIconSizeClasses } from "./buttonStyles";
import {
  getStatusPaint,
  getStatusShellClass,
  statusMorphTransition,
} from "./buttonStatusMotion";
import {
  buttonStatusIconGapClasses,
  buttonStatusSizeClasses,
  resolveStatusLabels,
  type ButtonStatus,
} from "./buttonStatusStyles";
import {
  buttonBaseClasses,
  buttonPillClass,
  type ButtonRole,
  type ButtonSize,
} from "./buttonStyles";

export interface ButtonStatusButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className" | "role" | "size"
  > {
  status: ButtonStatus;
  role?: ButtonRole;
  size?: ButtonSize;
  statusLabels?: Partial<Record<ButtonStatus, string>>;
  /** Leading icon while idle; the status glyphs morph out of it. */
  icon?: ReactElement;
  disableOnError?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  "aria-keyshortcuts"?: string;
  id?: string;
  name?: string;
  form?: string;
  children: ReactNode;
}

const buttonStatusOrder = ["idle", "loading", "success", "error"] as const;

export const ButtonStatusButton = forwardRef<
  HTMLButtonElement,
  ButtonStatusButtonProps
>(function ButtonStatusButton({
    status,
    role = "primary",
    size = "md",
    statusLabels,
    icon,
    disableOnError = false,
    disabled,
    className,
    children,
    type = "button",
    onClick,
    "aria-label": ariaLabel,
    "aria-pressed": ariaPressed,
    "aria-keyshortcuts": ariaKeyShortcuts,
    id,
    name,
    form,
    ...buttonProps
  }, ref) {
  const labels = resolveStatusLabels(children, statusLabels);
  if (status === "loading" && statusLabels?.loading == null) {
    console.warn('[WMDS Button] `status="loading"` without `statusLabels.loading`: say what is happening ("Saving…").');
  }
  const label = labels[status];
  // Busy states keep the button focusable: native `disabled` would drop keyboard focus to <body>
  // mid-submit. `aria-disabled` plus the click guard below block activation instead.
  const isBusyDisabled = !disabled && (status === "loading" || (status === "error" && disableOnError));
  const isDisabled = disabled || isBusyDisabled;
  const paint = getStatusPaint(status, role);

  return (
    <motion.button
      {...(buttonProps as unknown as ComponentProps<typeof motion.button>)}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={isBusyDisabled || undefined}
      aria-busy={status === "loading" || undefined}
      aria-live="polite"
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-keyshortcuts={ariaKeyShortcuts}
      data-role={role}
      data-size={size}
      data-status={status}
      animate={paint}
      initial={false}
      className={cn(
        buttonBaseClasses,
        "justify-center",
        buttonStatusSizeClasses[size],
        buttonPillClass,
        getStatusShellClass(status, role),
        "overflow-hidden",
        // Busy, not disabled: keep the full fill (Y8). aria-disabled would otherwise dim it to 70%, which reads
        // as "can't press this" and drops the label under 4.5:1.
        isBusyDisabled && "aria-disabled:!opacity-100",
        className,
      )}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={statusMorphTransition}
      onClick={(event) => {
        if (isBusyDisabled) {
          // Also stops a submit button from submitting its form again.
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      id={id}
      name={name}
      form={form}
    >
      {/* Loading states Y8: the button keeps one width through idle, loading, success and error. Hidden
          copies of every state size one grid cell; the live state sits on top of them. */}
      <span className="inline-grid items-center justify-items-center">
        {buttonStatusOrder.map((each) => (
          <span
            key={each}
            aria-hidden
            className={cn(
              "invisible col-start-1 row-start-1 inline-flex items-center whitespace-nowrap",
              (each !== "idle" || icon != null) && buttonStatusIconGapClasses[size],
            )}
          >
            {each !== "idle" || icon != null ? <span className={cn("shrink-0", buttonIconSizeClasses[size])} /> : null}
            {/* Generated text: sizes the cell without adding words to the button's text. */}
            <span data-label={labels[each]} className="before:content-[attr(data-label)]" />
          </span>
        ))}
        <span
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center",
            (status !== "idle" || icon != null) && buttonStatusIconGapClasses[size],
          )}
        >
          <ButtonStatusIcon status={status} size={size} icon={icon} />
          <ButtonStatusLabel label={label} />
        </span>
      </span>
    </motion.button>
  );
});
