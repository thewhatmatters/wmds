import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { InputStatusBanner } from "../inputShared/InputStatusBanner";
import { InputTrailingAffordance } from "../inputShared/InputTrailingAffordance";
import {
  inputAttachedFieldClasses,
  inputAttachedInputClasses,
  inputCompoundShellClassesFor,
  inputControlStackClasses,
  inputDisabledClasses,
  inputDisabledLabelClasses,
  inputFieldStackClasses,
  inputStatusGapClasses,
  textareaBaseClasses,
  textareaCompoundFieldPaddingClasses,
  textareaCompoundInnerFieldClassesFor,
  textareaFixedPaddingClasses,
  textareaMinHeightClasses,
  textareaResizeClasses,
  textareaSoloShellClassesFor,
  textareaStatusBannerClassesFor,
  textareaTrailingInsetClasses,
  textareaTrailingInsetPositionClasses,
  type InputMessagePosition,
  type InputSize,
  type InputStatus,
  type TextAreaResize,
} from "./textareaShellStyles";

export type { InputMessagePosition, InputSize, InputStatus, TextAreaResize } from "./textareaShellStyles";
export { inputMessagePositions, inputSizes, inputStatuses, textareaResizes } from "./textareaShellStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type TextAreaLayoutClassName = string;

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: InputSize;
  /** Optional visible label — omit for bare controls. */
  label?: string;
  /** Neutral helper below the control — hidden when validation `message` is shown. */
  description?: string;
  /** Validation status — border + trailing icon. */
  status?: InputStatus;
  /** Validation copy in integrated status band — requires `status`. */
  message?: string;
  /** Status band placement when `message` is set — default `bottom`. */
  messagePosition?: InputMessagePosition;
  /** Trailing spinner — async validation. */
  loading?: boolean;
  /** Visible row count — default **4**. */
  rows?: number;
  /** Native resize — default **`vertical`**. */
  resize?: TextAreaResize;
  className?: TextAreaLayoutClassName;
}

function assertTextAreaA11y(
  props: Pick<TextAreaProps, "label" | "aria-label" | "aria-labelledby">,
) {
  if (props.label == null && props["aria-label"] == null && props["aria-labelledby"] == null) {
    console.warn("[WMDS TextArea] Provide `label`, `aria-label`, or `aria-labelledby`.");
  }
}

function assertTextAreaPattern(props: Pick<TextAreaProps, "status" | "message">) {
  if (props.message != null && props.status == null) {
    console.warn("[WMDS TextArea] `message` requires `status`.");
  }
}

/**
 * Multiline text control — same optional label / validation chrome as **Input** (ADR-0006).
 * Element-radius shell (not pill); status band + trailing icon match Input patterns.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    size = "md",
    label,
    description,
    status,
    message,
    messagePosition = "bottom",
    loading = false,
    rows = 4,
    resize = "vertical",
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
  assertTextAreaA11y({ label, "aria-label": rest["aria-label"], "aria-labelledby": rest["aria-labelledby"] });
  assertTextAreaPattern({ status, message });

  const hasMessage = message != null && message.length > 0 && status != null;
  const showTrailingStatusIcon = !hasMessage && (loading || status != null);
  const descriptionId = description != null && !hasMessage ? `${controlId}-description` : undefined;
  const messageId = hasMessage ? `${controlId}-message` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  const textareaElement = (
    <textarea
      {...rest}
      ref={ref}
      id={controlId}
      rows={rows}
      disabled={disabled}
      aria-invalid={status === "error" || undefined}
      aria-describedby={describedBy}
      className={cn(
        inputDisabledClasses,
        textareaResizeClasses[resize],
        textareaBaseClasses,
        textareaFixedPaddingClasses[size],
        textareaMinHeightClasses[size],
        "w-full border-0 bg-transparent shadow-none",
        showTrailingStatusIcon && inputStatusGapClasses[size],
        hasMessage && cn(inputAttachedFieldClasses, inputAttachedInputClasses, "rounded-none"),
      )}
    />
  );

  const trailingIcon = showTrailingStatusIcon ? (
    <span
      className={cn(textareaTrailingInsetClasses, textareaTrailingInsetPositionClasses[size])}
    >
      <InputTrailingAffordance
        size={size}
        status={loading ? undefined : status}
        loading={loading}
      />
    </span>
  ) : null;

  const fieldBody = (
    <>
      {textareaElement}
      {trailingIcon}
    </>
  );

  const soloShell = (
    <div className={cn(textareaSoloShellClassesFor(size, status, resize), className)}>
      {fieldBody}
    </div>
  );

  const compoundField = (
    <div
      className={cn(
        "relative w-full",
        textareaCompoundFieldPaddingClasses(resize, size),
      )}
    >
      {fieldBody}
    </div>
  );

  const statusBanner =
    hasMessage && status != null && messageId != null ? (
      <TextAreaStatusBanner
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
        <div className={textareaCompoundInnerFieldClassesFor(size, status, messagePosition)}>
          {compoundField}
        </div>
        {messagePosition === "bottom" ? statusBanner : null}
      </div>
    ) : (
      <div className={inputControlStackClasses}>{soloShell}</div>
    );

  if (label == null && description == null) {
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

function TextAreaStatusBanner({
  status,
  message,
  messageId,
  size,
  messagePosition,
}: {
  status: InputStatus;
  message: string;
  messageId: string;
  size: InputSize;
  messagePosition: InputMessagePosition;
}) {
  return (
    <InputStatusBanner
      status={status}
      message={message}
      messageId={messageId}
      size={size}
      messagePosition={messagePosition}
      bannerClassName={textareaStatusBannerClassesFor(status, size, messagePosition)}
    />
  );
}
