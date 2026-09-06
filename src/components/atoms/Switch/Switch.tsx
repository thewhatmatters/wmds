import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import { InputStatusBanner } from "../inputShared/InputStatusBanner";
import {
  switchDescriptionClasses,
  switchDescriptionRowClasses,
  switchHiddenInputClasses,
  switchHitTargetDescriptionAlignClasses,
  switchHitTargetSizeClasses,
  switchLabelClassesFor,
  switchRowBaseClasses,
  switchRowDisabledClasses,
  switchRowLabelOnlyClasses,
  switchRowSizeClasses,
  switchSettingsRowClasses,
  switchStatusBannerClassesFor,
  switchTextColumnClasses,
  switchThumbClasses,
  switchThumbOffsetPx,
  switchThumbSizeClasses,
  switchTrackClassesFor,
  type SwitchLayout,
  type SwitchSize,
} from "./switchStyles";
import type { InputSize, InputStatus } from "../Input/inputShellStyles";

export { switchLayouts, switchSizes, type SwitchLayout, type SwitchSize } from "./switchStyles";
export { inputStatuses, type InputStatus } from "../Input/inputShellStyles";

/** Layout-only — width/margin on the row wrapper. */
export type SwitchLayoutClassName = string;

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "role"> {
  size?: SwitchSize;
  /** `inline` — control leading (Checkbox rhythm). `settings` — label left, switch trailing. */
  layout?: SwitchLayout;
  /** Visible label — always rendered; use `labelHidden` to visually hide. */
  label: string;
  labelHidden?: boolean;
  /** Neutral helper below the label. */
  description?: string;
  status?: InputStatus;
  message?: string;
  loading?: boolean;
  className?: SwitchLayoutClassName;
}

const statusBannerSizeForSwitch: Record<SwitchSize, InputSize> = {
  sm: "sm",
  md: "md",
};

function assertSwitchPattern(props: Pick<SwitchProps, "status" | "message">) {
  if (props.message != null && props.status == null) {
    console.warn("[WMDS Switch] `message` requires `status`.");
  }
}

/**
 * Boolean toggle — [Astryx Switch](https://astryx.atmeta.com/components/Switch) pattern.
 * Pill track + sliding thumb; `layout="settings"` for label-left / switch-right rows.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    size = "md",
    layout = "inline",
    label,
    labelHidden = false,
    description,
    status,
    message,
    loading = false,
    className,
    disabled,
    readOnly,
    checked,
    defaultChecked,
    id: idProp,
    onChange,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const controlId = idProp ?? generatedId;
  assertSwitchPattern({ status, message });

  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
  const resolvedChecked = isControlled ? Boolean(checked) : uncontrolledChecked;
  const isDisabled = disabled || loading;
  const hasMessage = message != null && message.length > 0 && status != null;
  const messageId = hasMessage ? `${controlId}-message` : undefined;
  const descriptionId =
    description != null && !labelHidden ? `${controlId}-description` : undefined;
  const describedBy =
    [rest["aria-describedby"], descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      event.preventDefault();
      return;
    }
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }
    onChange?.(event);
  };

  const trackClasses = switchTrackClassesFor(
    size,
    resolvedChecked,
    isDisabled,
    hasMessage ? undefined : status,
  );

  const hasDescription = description != null && !labelHidden;

  const thumbSlideTransition = motionTransitionProp("fast");
  const thumbOffset = switchThumbOffsetPx[size];

  const renderControl = (hitTargetClassName?: string) => (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        switchHitTargetSizeClasses[size],
        hitTargetClassName,
      )}
    >
      <input
        {...rest}
        ref={ref}
        id={controlId}
        type="checkbox"
        role="switch"
        checked={isControlled ? checked : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={isDisabled}
        readOnly={readOnly}
        aria-invalid={status === "error" || undefined}
        aria-describedby={describedBy}
        aria-busy={loading || undefined}
        onChange={handleChange}
        className={switchHiddenInputClasses}
      />
      <span className={trackClasses} aria-hidden>
        {loading ? (
          <motion.span
            className={cn(switchThumbSizeClasses[size], "flex items-center justify-center")}
            animate={{ x: resolvedChecked ? thumbOffset : 0 }}
            transition={thumbSlideTransition}
          >
            <Loader2 className="size-full animate-spin text-fg" strokeWidth={2} />
          </motion.span>
        ) : (
          <motion.span
            className={cn(switchThumbClasses, switchThumbSizeClasses[size])}
            animate={{ x: resolvedChecked ? thumbOffset : 0 }}
            transition={thumbSlideTransition}
          />
        )}
      </span>
    </span>
  );

  const labelColumn = labelHidden ? (
    <span className="sr-only">{label}</span>
  ) : (
    <span className={switchTextColumnClasses}>
      <span className={switchLabelClassesFor(isDisabled, hasDescription)}>{label}</span>
      {hasDescription ? (
        <span id={descriptionId} className={switchDescriptionClasses}>
          {description}
        </span>
      ) : null}
    </span>
  );

  const row = (
    <label
      htmlFor={controlId}
      className={cn(
        switchRowBaseClasses,
        layout === "settings" ? switchSettingsRowClasses : switchRowLabelOnlyClasses,
        layout === "inline" && !hasDescription && switchRowSizeClasses[size],
        layout === "inline" && hasDescription && undefined,
        isDisabled && switchRowDisabledClasses,
        className,
      )}
    >
      {labelHidden ? (
        <>
          {renderControl()}
          <span className="sr-only">{label}</span>
        </>
      ) : layout === "settings" ? (
        <>
          {labelColumn}
          {renderControl()}
        </>
      ) : hasDescription ? (
        <span className={switchDescriptionRowClasses[size]}>
          {renderControl(switchHitTargetDescriptionAlignClasses[size])}
          {labelColumn}
        </span>
      ) : (
        <>
          {renderControl()}
          {!labelHidden ? (
            <span className={switchLabelClassesFor(isDisabled)}>{label}</span>
          ) : null}
        </>
      )}
    </label>
  );

  if (!hasMessage || status == null || messageId == null) {
    return row;
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      {row}
      <InputStatusBanner
        status={status}
        message={message}
        messageId={messageId}
        size={statusBannerSizeForSwitch[size]}
        messagePosition="bottom"
        bannerClassName={switchStatusBannerClassesFor(status)}
      />
    </div>
  );
});
