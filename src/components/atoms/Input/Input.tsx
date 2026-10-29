import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { InputStatusBanner, warnStatusWithoutMessage } from "../inputShared/InputStatusBanner";
import { InputTrailingAffordance } from "../inputShared/InputTrailingAffordance";
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
  inputMonoFaceClasses,
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
import { isAutofillField } from "./autofillFields";
import { fieldWidthBandStyle, fieldWidthStyle, type FieldWidth } from "./fieldWidth";

export { fieldWidths, type FieldWidth } from "./fieldWidth";

export type { InputMessagePosition, InputSize, InputStatus } from "./inputShellStyles";
export { inputMessagePositions, inputSizes, inputStatuses } from "./inputShellStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type InputLayoutClassName = string;

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "width"> {
  size?: InputSize;
  /**
   * Optional visible label — omit for bare inputs. No label asterisk; use `endBadge` for Required.
   * Text or inline markup (`<strong>`, `<code>`). It names the field, so keep it to phrasing content.
   */
  label?: ReactNode;
  /** Neutral helper below the control — hidden when validation `message` is shown. */
  description?: string;
  /** Validation status — border + trailing icon. */
  status?: InputStatus;
  /** Validation copy in integrated status band — requires `status`; omit for status-only (border + icon). */
  message?: string;
  /** Status band placement when `message` is set — default `bottom`. */
  messagePosition?: InputMessagePosition;
  /** Trailing spinner — async validation. Combinable with `endBadge`. */
  loading?: boolean;
  /** Leading Lucide icon. */
  icon?: ReactElement;
  /** Monospace value — `type-code` instead of the sans face. For a read-only key or id. */
  mono?: boolean;
  /**
   * Trailing inset inside the shell — pass {@link Badge} ("Optional" or "Required", whichever is the
   * exception in the form). Atoms cannot import Badge; compose at call site. Combinable with
   * `status` / `loading`: the status icon comes first, then the badge. Screen readers hear it as part
   * of the field's description. Not on autofill fields (name, email, tel, password, address,
   * organization): autofill paints over it, so put "(optional)" in the label there.
   */
  endBadge?: ReactElement;
  /**
   * Field width in characters for fixed-length answers (ZIP `5ch`, year `4ch`, phone `10ch`); default
   * `full`. Free-form answers stay full width (Form layout L7). The label and hint keep their own width.
   */
  width?: FieldWidth;
  /** Inside a parent pill (Search, CopyField) — no outer shell; the parent owns border and focus ring. */
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

function assertEndBadge(hasEndBadge: boolean, autoComplete: string | undefined) {
  if (hasEndBadge && isAutofillField(autoComplete)) {
    console.warn(
      `[WMDS Input] No \`endBadge\` on an autofill field (autocomplete="${autoComplete}"): put "(optional)" in the label.`,
    );
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
    console.warn(
      "[WMDS Input] `inline` is for a parent pill (Search, CopyField) — omit label, description, and validation.",
    );
  }
}

/** Rem of shell around the characters, per size: side padding, insets for icons and badge, and the border. */
const inputSidePaddingRem: Record<InputSize, number> = { sm: 0.625, md: 0.75, lg: 1 };
const inputLeadingIconRem: Record<InputSize, number> = { sm: 2, md: 2.5, lg: 2.75 };
const inputTrailingRem: Record<string, number> = {
  [inputStatusGapClasses.sm]: 2,
  [inputStatusGapClasses.md]: 2.5,
  [inputStatusGapClasses.lg]: 2.75,
  [inputEndBadgeGapClasses.sm]: 4.5,
  [inputEndBadgeGapClasses.md]: 5,
  [inputEndBadgeGapClasses.lg]: 6,
  [inputEndBadgeAndStatusGapClasses.sm]: 6.5,
  [inputEndBadgeAndStatusGapClasses.md]: 7,
  [inputEndBadgeAndStatusGapClasses.lg]: 8,
};

function inputWidthChrome(size: InputSize, leadingIcon: boolean, trailingPadding: string | false): string {
  const side = inputSidePaddingRem[size];
  const start = leadingIcon ? inputLeadingIconRem[size] : side;
  const end = trailingPadding === false ? side : (inputTrailingRem[trailingPadding] ?? side);
  return `${start + end}rem + 2px`;
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
 * Single-line pill text input — validation via `status`, `message`, and trailing icon.
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
    width = "full",
    mono = false,
    inline = false,
    className,
    disabled,
    id: idProp,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  warnStatusWithoutMessage("Input", status, message);
  const generatedId = useId();
  const controlId = idProp ?? generatedId;
  assertInputA11y({ label, "aria-label": rest["aria-label"], "aria-labelledby": rest["aria-labelledby"] });
  assertInputPattern({ status, message, messagePosition, loading, inline, label, description });

  const hasMessage = message != null && message.length > 0 && status != null;
  const hasEndBadge = endBadge != null;
  assertEndBadge(hasEndBadge, rest.autoComplete);
  const showTrailingStatusIcon = !hasMessage && (loading || status != null);
  const showLeadingIcon = icon != null;
  const trailingPadding = resolveTrailingPadding(size, hasEndBadge, showTrailingStatusIcon);
  // Labels and placeholders F8: the hint sits between the label and the field and stays when a message shows.
  const descriptionId = description != null ? `${controlId}-description` : undefined;
  const messageId = hasMessage ? `${controlId}-message` : undefined;
  // Required and optional Q8: the badge is read with the field, after the hint.
  const badgeId = hasEndBadge ? `${controlId}-badge` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, badgeId, messageId].filter(Boolean).join(" ") || undefined;

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
          mono && inputMonoFaceClasses,
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
                      // Errors and validation V8: a status-only success is the tick alone, on the plain shell.
                      status != null && status !== "success"
                        ? cn("border", inputStatusShellClasses[status])
                        : inputShellClasses[size],
                      inputSoloRadiusClasses[size],
                      inputSoloFocusRingBaseClasses,
                      status != null && status !== "success"
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
          {/* Q8: the status icon first, then the badge. */}
          {showTrailingStatusIcon ? (
            <InputTrailingAffordance
              size={size}
              status={loading ? undefined : status}
              loading={loading}
            />
          ) : null}
          {hasEndBadge ? (
            <span id={badgeId} className={inputEndBadgeWrapperClasses}>
              {endBadge}
            </span>
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

  // One tree whether or not a message shows (top slot, field, bottom slot), so React keeps the same
  // <input> when a status appears: what people typed and the focus survive (Errors and validation V4).
  const withMessage = hasMessage && status != null;
  const widthChrome = inputWidthChrome(size, showLeadingIcon, trailingPadding);
  const widthStyle = inline ? undefined : fieldWidthStyle(width, widthChrome);
  const control = (
    <div
      // With a message the shell takes the band's width and the field inside keeps its own.
      style={withMessage && !inline ? fieldWidthBandStyle(width, widthChrome) : widthStyle}
      className={
        withMessage
          ? inputCompoundShellClassesFor(size, status)
          : cn(inline ? "relative flex min-w-0 flex-1 items-center" : inputControlStackClasses)
      }
    >
      {withMessage && messagePosition === "top" ? statusBanner : null}
      <div
        style={withMessage ? widthStyle : undefined}
        className={
          withMessage
            ? inputCompoundInnerFieldClassesFor(size, status, messagePosition)
            : "relative flex w-full items-center"
        }
      >
        {inputRow}
      </div>
      {withMessage && messagePosition === "bottom" ? statusBanner : null}
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
      {descriptionId != null ? (
        <p id={descriptionId} className={typographyClass("caption")}>
          {description}
        </p>
      ) : null}
      {control}
    </div>
  );
});
