import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import { InputStatusBanner } from "../inputShared/InputStatusBanner";
import {
  checkboxBoxClassesFor,
  checkboxCheckIconSizeClasses,
  checkboxDescriptionClasses,
  checkboxDescriptionRowClasses,
  checkboxHiddenInputClasses,
  checkboxHitTargetDescriptionAlignClasses,
  checkboxHitTargetSizeClasses,
  checkboxIndeterminateBarSizeClasses,
  checkboxLabelClassesFor,
  checkboxMarkClasses,
  checkboxRowBaseClasses,
  checkboxRowDisabledClasses,
  checkboxRowLabelOnlyClasses,
  checkboxRowSizeClasses,
  checkboxTextColumnClasses,
  checkboxStatusBannerClassesFor,
  type CheckboxSize,
} from "./checkboxStyles";
import type { InputSize, InputStatus } from "../Input/inputShellStyles";

export { checkboxSizes, type CheckboxSize } from "./checkboxStyles";
export { inputStatuses, type InputStatus } from "../Input/inputShellStyles";

/** Layout-only — width/margin on the row wrapper. */
export type CheckboxLayoutClassName = string;

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: CheckboxSize;
  /** Visible label — always rendered; use `labelHidden` to visually hide. */
  label: string;
  /** Visually hide label — still available to assistive tech. */
  labelHidden?: boolean;
  /** Neutral helper below the label. */
  description?: string;
  /** Mixed selection — sets native `indeterminate` on the input. */
  indeterminate?: boolean;
  /** Validation status — tints box border; pair with `message`. */
  status?: InputStatus;
  /** Validation copy below the row — requires `status`. */
  message?: string;
  /** Spinner inside the box — async validation. */
  loading?: boolean;
  className?: CheckboxLayoutClassName;
}

/** Maps checkbox size to status banner density — matches Input `md` band scale. */
const statusBannerSizeForCheckbox: Record<CheckboxSize, InputSize> = {
  sm: "sm",
  md: "md",
};

function assertCheckboxPattern(props: Pick<CheckboxProps, "status" | "message">) {
  if (props.message != null && props.status == null) {
    console.warn("[WMDS Checkbox] `message` requires `status`.");
  }
}

/**
 * Boolean toggle — box + label row.
 * Label + optional description beside the box; validation message below the row.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size = "md",
    label,
    labelHidden = false,
    description,
    indeterminate = false,
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
  assertCheckboxPattern({ status, message });

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

  const setIndeterminateRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) {
        node.indeterminate = indeterminate;
      }
      if (typeof ref === "function") {
        ref(node);
      } else if (ref != null) {
        ref.current = node;
      }
    },
    [indeterminate, ref],
  );

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

  const boxClasses = checkboxBoxClassesFor(
    size,
    resolvedChecked,
    indeterminate,
    isDisabled,
    hasMessage ? undefined : status,
  );

  const hasDescription = description != null && !labelHidden;

  const renderControl = (hitTargetClassName?: string) => (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        checkboxHitTargetSizeClasses[size],
        hitTargetClassName,
      )}
    >
      <input
        {...rest}
        ref={setIndeterminateRef}
        id={controlId}
        type="checkbox"
        checked={isControlled ? checked : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={isDisabled}
        readOnly={readOnly}
        aria-invalid={status === "error" || undefined}
        aria-describedby={describedBy}
        aria-checked={indeterminate ? "mixed" : undefined}
        aria-busy={loading || undefined}
        onChange={handleChange}
        className={checkboxHiddenInputClasses}
      />
      <span className={boxClasses} aria-hidden>
        {loading ? (
          <Loader2
            className={cn(
              checkboxCheckIconSizeClasses[size],
              checkboxMarkClasses,
              "animate-spin",
            )}
            strokeWidth={2}
          />
        ) : indeterminate ? (
          <span
            className={cn(
              checkboxIndeterminateBarSizeClasses[size],
              checkboxMarkClasses,
              "rounded-full bg-current",
            )}
          />
        ) : resolvedChecked ? (
          <Check
            className={cn(checkboxCheckIconSizeClasses[size], checkboxMarkClasses)}
            strokeWidth={3}
            aria-hidden
          />
        ) : null}
      </span>
    </span>
  );

  const row = (
    <label
      htmlFor={controlId}
      className={cn(
        checkboxRowBaseClasses,
        !hasDescription && checkboxRowLabelOnlyClasses,
        !hasDescription && checkboxRowSizeClasses[size],
        isDisabled && checkboxRowDisabledClasses,
        className,
      )}
    >
      {labelHidden ? (
        <>
          {renderControl()}
          <span className="sr-only">{label}</span>
        </>
      ) : hasDescription ? (
        <span className={checkboxDescriptionRowClasses[size]}>
          {renderControl(checkboxHitTargetDescriptionAlignClasses[size])}
          <span className={checkboxTextColumnClasses}>
            <span className={checkboxLabelClassesFor(isDisabled, true)}>{label}</span>
            <span id={descriptionId} className={checkboxDescriptionClasses}>
              {description}
            </span>
          </span>
        </span>
      ) : (
        <>
          {renderControl()}
          <span className={checkboxLabelClassesFor(isDisabled)}>{label}</span>
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
        size={statusBannerSizeForCheckbox[size]}
        messagePosition="bottom"
        bannerClassName={checkboxStatusBannerClassesFor(status)}
      />
    </div>
  );
});
