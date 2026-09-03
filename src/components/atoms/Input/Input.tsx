import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactElement,
} from "react";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { InputStatusBanner } from "./InputStatusBanner";
import { InputTrailingAffordance } from "./InputTrailingAffordance";
import {
  inputAttachedFieldClasses,
  inputAttachedInputClasses,
  inputBaseClasses,
  inputCompoundInnerFieldClassesFor,
  inputCompoundShellClassesFor,
  inputControlStackClasses,
  inputDisabledClasses,
  inputDisabledLabelClasses,
  inputEndBadgeAndStatusGapClasses,
  inputEndBadgeGapClasses,
  inputEndBadgeWrapperClasses,
  inputFieldStackClasses,
  inputIconGapClasses,
  inputIconPositionClasses,
  inputIconSizeClasses,
  inputInlineClasses,
  inputShellClasses,
  inputSizeClasses,
  inputSoloFocusRingBaseClasses,
  inputSoloFocusRingColorClasses,
  inputSoloRadiusClasses,
  inputStatusGapClasses,
  inputStatusShellClasses,
  inputTrailingInsetClasses,
  inputTrailingInsetPositionClasses,
  type InputMessagePosition,
  type InputSize,
  type InputStatus,
} from "./inputShellStyles";

export type { InputMessagePosition, InputSize, InputStatus } from "./inputShellStyles";
export { inputMessagePositions, inputSizes, inputStatuses } from "./inputShellStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type InputLayoutClassName = string;

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  /** Optional visible label — omit for bare inputs. No label asterisk; use `endBadge` for Required. */
  label?: string;
  /** Neutral helper below the control — hidden when validation `message` is shown. */
  description?: string;
  /** Validation status — border + trailing icon ([Astryx Text Input](https://astryx.atmeta.com/components/TextInput)). */
  status?: InputStatus;
  /** Validation copy in integrated status band — requires `status`; omit for status-only (border + icon). */
  message?: string;
  /** Status band placement when `message` is set — default `bottom` ([Astryx ChatComposer](https://astryx.atmeta.com/components/ChatComposer)). */
  messagePosition?: InputMessagePosition;
  /** Trailing spinner — async validation. Combinable with `endBadge`. */
  loading?: boolean;
  /** Leading Lucide icon. */
  icon?: ReactElement;
  /**
   * Trailing inset inside the shell — pass {@link Badge} (e.g. Required).
   * Atoms cannot import Badge; compose at call site. Combinable with `status` / `loading`.
   */
  endBadge?: ReactElement;
  /** Inside Search — no outer shell; parent pill owns border and focus ring. */
  inline?: boolean;
  className?: InputLayoutClassName;
}

function assertInputA11y(
  props: Pick<InputProps, "label" | "aria-label" | "aria-labelledby">,
) {
  if (props.label == null && props["aria-label"] == null && props["aria-labelledby"] == null) {
    console.warn("[WMDS Input] Provide `label`, `aria-label`, or `aria-labelledby`.");
  }
}

function assertInputPattern(
  props: Pick<
    InputProps,
    "status" | "message" | "messagePosition" | "loading" | "inline" | "label" | "description"
  >,
) {
  if (props.message != null && props.status == null) {
    console.warn("[WMDS Input] `message` requires `status`.");
  }
  if (props.inline && (props.label != null || props.description != null || props.status != null || props.message != null)) {
    console.warn("[WMDS Input] `inline` is for Search rows only — omit label, description, and validation.");
  }
}

function resolveTrailingPadding(
  size: InputSize,
  hasEndBadge: boolean,
  hasStatusAffordance: boolean,
): string | false {
  if (hasEndBadge && hasStatusAffordance) {
    return inputEndBadgeAndStatusGapClasses[size];
  }
  if (hasEndBadge) {
    return inputEndBadgeGapClasses[size];
  }
  if (hasStatusAffordance) {
    return inputStatusGapClasses[size];
  }
  return false;
}

/**
 * Single-line pill text input — Astryx validation patterns (status, message footer, trailing icon).
 * Bare by default; optional `label` (ADR-0006). Required fields: `endBadge` + `required`, not asterisks.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "md",
    label,
    description,
    status,
    message,
    messagePosition = "bottom",
    loading = false,
    icon,
    endBadge,
    inline = false,
    className,
    disabled,
    id: idProp,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const controlId = idProp ?? generatedId;
  assertInputA11y({ label, "aria-label": rest["aria-label"], "aria-labelledby": rest["aria-labelledby"] });
  assertInputPattern({ status, message, messagePosition, loading, inline, label, description });

  const hasMessage = message != null && message.length > 0 && status != null;
  const hasEndBadge = endBadge != null;
  const showTrailingStatusIcon = !hasMessage && (loading || status != null);
  const showLeadingIcon = icon != null;
  const trailingPadding = resolveTrailingPadding(size, hasEndBadge, showTrailingStatusIcon);
  const descriptionId = description != null && !hasMessage ? `${controlId}-description` : undefined;
  const messageId = hasMessage ? `${controlId}-message` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  const inputRow = (
    <>
      {showLeadingIcon ? (
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 inline-flex -translate-y-1/2 [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
            inputIconPositionClasses[size],
            inputIconSizeClasses[size],
          )}
          aria-hidden
        >
          {icon}
        </span>
      ) : null}
      <input
        {...rest}
        ref={ref}
        id={controlId}
        disabled={disabled}
        aria-invalid={status === "error" || undefined}
        aria-describedby={describedBy}
        className={cn(
          inputDisabledClasses,
          hasMessage
            ? cn(
                inputAttachedFieldClasses,
                inputSizeClasses[size],
                showLeadingIcon && inputIconGapClasses[size],
                trailingPadding,
                inputAttachedInputClasses,
              )
            : cn(
                inputBaseClasses,
                inline
                  ? cn(
                      inputInlineClasses,
                      showLeadingIcon && inputIconGapClasses[size],
                      className ?? inputSizeClasses[size],
                    )
                  : cn(
                      inputSizeClasses[size],
                      showLeadingIcon && inputIconGapClasses[size],
                      trailingPadding,
                      status != null
                        ? cn("border", inputStatusShellClasses[status])
                        : inputShellClasses[size],
                      inputSoloRadiusClasses[size],
                      inputSoloFocusRingBaseClasses,
                      status != null
                        ? inputSoloFocusRingColorClasses[status]
                        : inputSoloFocusRingColorClasses.default,
                      className,
                    ),
              ),
        )}
      />
      {hasEndBadge || showTrailingStatusIcon ? (
        <span
          className={cn(
            inputTrailingInsetClasses,
            inputTrailingInsetPositionClasses[size],
          )}
        >
          {hasEndBadge ? (
            <span className={inputEndBadgeWrapperClasses}>{endBadge}</span>
          ) : null}
          {showTrailingStatusIcon ? (
            <InputTrailingAffordance
              size={size}
              status={loading ? undefined : status}
              loading={loading}
            />
          ) : null}
        </span>
      ) : null}
    </>
  );

  const statusBanner =
    hasMessage && status != null && messageId != null ? (
      <InputStatusBanner
        status={status}
        message={message}
        messageId={messageId}
        size={size}
        messagePosition={messagePosition}
      />
    ) : null;

  const control =
    hasMessage && status != null ? (
      <div className={inputCompoundShellClassesFor(size, status)}>
        {messagePosition === "top" ? statusBanner : null}
        <div className={inputCompoundInnerFieldClassesFor(size, status, messagePosition)}>
          {inputRow}
        </div>
        {messagePosition === "bottom" ? statusBanner : null}
      </div>
    ) : (
      <div
        className={cn(
          inline ? "relative flex min-w-0 flex-1 items-center" : inputControlStackClasses,
        )}
      >
        <div className="relative flex w-full items-center">{inputRow}</div>
      </div>
    );

  if (inline || (label == null && description == null)) {
    return control;
  }

  return (
    <div className={inputFieldStackClasses}>
      {label != null ? (
        <label
          htmlFor={controlId}
          className={cn(typographyClass("ui-label"), disabled && inputDisabledLabelClasses)}
        >
          {label}
        </label>
      ) : null}
      {control}
      {descriptionId != null ? (
        <p id={descriptionId} className={typographyClass("caption")}>
          {description}
        </p>
      ) : null}
    </div>
  );
});
