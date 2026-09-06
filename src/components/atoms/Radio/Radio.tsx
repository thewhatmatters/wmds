import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { cn } from "../../../lib/cn";
import { InputStatusBanner } from "../inputShared/InputStatusBanner";
import {
  radioCircleClassesFor,
  radioDescriptionClasses,
  radioDescriptionRowClasses,
  radioDotClasses,
  radioDotSizeClasses,
  radioHiddenInputClasses,
  radioHitTargetDescriptionAlignClasses,
  radioHitTargetSizeClasses,
  radioLabelClassesFor,
  radioRowBaseClasses,
  radioRowDisabledClasses,
  radioRowLabelOnlyClasses,
  radioRowSizeClasses,
  radioStatusBannerClassesFor,
  radioTextColumnClasses,
  type RadioSize,
} from "./radioStyles";
import type { InputSize, InputStatus } from "../Input/inputShellStyles";

export { radioSizes, type RadioSize } from "./radioStyles";
export { inputStatuses, type InputStatus } from "../Input/inputShellStyles";

/** Layout-only — width/margin on the row wrapper. */
export type RadioLayoutClassName = string;

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: RadioSize;
  /** Visible label — always rendered; use `labelHidden` to visually hide. */
  label: string;
  labelHidden?: boolean;
  /** Neutral helper below the label. */
  description?: string;
  /** Validation status — tints circle border; pair with `message` (standalone use). */
  status?: InputStatus;
  /** Validation copy below the row — requires `status`. */
  message?: string;
  className?: RadioLayoutClassName;
}

const statusBannerSizeForRadio: Record<RadioSize, InputSize> = {
  sm: "sm",
  md: "md",
};

function assertRadioPattern(props: Pick<RadioProps, "status" | "message">) {
  if (props.message != null && props.status == null) {
    console.warn("[WMDS Radio] `message` requires `status`.");
  }
}

/**
 * Single radio option — circle + label row; compose in **RadioGroup**.
 * Compose inside **RadioGroup** for grouped selection, or use standalone with a shared `name`.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    size = "md",
    label,
    labelHidden = false,
    description,
    status,
    message,
    className,
    disabled,
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
  assertRadioPattern({ status, message });

  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
  const resolvedChecked = isControlled ? Boolean(checked) : uncontrolledChecked;
  const hasMessage = message != null && message.length > 0 && status != null;
  const messageId = hasMessage ? `${controlId}-message` : undefined;
  const descriptionId =
    description != null && !labelHidden ? `${controlId}-description` : undefined;
  const describedBy =
    [rest["aria-describedby"], descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }
    onChange?.(event);
  };

  const circleClasses = radioCircleClassesFor(
    size,
    resolvedChecked,
    disabled,
    hasMessage ? undefined : status,
  );

  const hasDescription = description != null && !labelHidden;

  const renderControl = (hitTargetClassName?: string) => (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        radioHitTargetSizeClasses[size],
        hitTargetClassName,
      )}
    >
      <input
        {...rest}
        ref={ref}
        id={controlId}
        type="radio"
        checked={isControlled ? checked : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={disabled}
        aria-invalid={status === "error" || undefined}
        aria-describedby={describedBy}
        onChange={handleChange}
        className={radioHiddenInputClasses}
      />
      <span className={circleClasses} aria-hidden>
        {resolvedChecked ? (
          <span className={cn(radioDotSizeClasses[size], radioDotClasses)} />
        ) : null}
      </span>
    </span>
  );

  const row = (
    <label
      htmlFor={controlId}
      className={cn(
        radioRowBaseClasses,
        !hasDescription && radioRowLabelOnlyClasses,
        !hasDescription && radioRowSizeClasses[size],
        disabled && radioRowDisabledClasses,
        className,
      )}
    >
      {labelHidden ? (
        <>
          {renderControl()}
          <span className="sr-only">{label}</span>
        </>
      ) : hasDescription ? (
        <span className={radioDescriptionRowClasses[size]}>
          {renderControl(radioHitTargetDescriptionAlignClasses[size])}
          <span className={radioTextColumnClasses}>
            <span className={radioLabelClassesFor(disabled, true)}>{label}</span>
            <span id={descriptionId} className={radioDescriptionClasses}>
              {description}
            </span>
          </span>
        </span>
      ) : (
        <>
          {renderControl()}
          <span className={radioLabelClassesFor(disabled)}>{label}</span>
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
        size={statusBannerSizeForRadio[size]}
        messagePosition="bottom"
        bannerClassName={radioStatusBannerClassesFor(status)}
      />
    </div>
  );
});
