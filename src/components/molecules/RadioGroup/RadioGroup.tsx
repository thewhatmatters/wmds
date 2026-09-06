import { useId, useMemo, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { InputStatusBanner } from "../../atoms/inputShared/InputStatusBanner";
import type { InputSize, InputStatus } from "../../atoms/Input/inputShellStyles";
import {
  radioGroupDescriptionClasses,
  radioGroupFieldStackClasses,
  radioGroupItemsClasses,
  radioGroupLabelClassesFor,
  radioGroupStatusBannerClassesFor,
  type RadioGroupOrientation,
  type RadioSize,
} from "./radioGroupStyles";
import { RadioGroupItem } from "./RadioGroupItem";
import { RadioGroupProvider, useRadioGroupName } from "./RadioGroupContext";

export {
  radioGroupOrientations,
  radioSizes,
  type RadioGroupOrientation,
  type RadioSize,
} from "./radioGroupStyles";
export type { RadioGroupItemProps } from "./RadioGroupItem";

/** Layout-only — width/margin on the field stack. */
export type RadioGroupLayoutClassName = string;

export interface RadioGroupProps {
  /** Group label — rendered as legend / aria-labelledby source. */
  label?: string;
  /** Visually hide group label — still available to assistive tech. */
  labelHidden?: boolean;
  /** Neutral helper below the group label. */
  description?: string;
  /** Selected option value — controlled. */
  value: string;
  onValueChange: (value: string) => void;
  /** Shared `name` for native radio grouping — auto-generated when omitted. */
  name?: string;
  orientation?: RadioGroupOrientation;
  size?: RadioSize;
  disabled?: boolean;
  /** Group validation — flat band below items. */
  status?: InputStatus;
  message?: string;
  children: ReactNode;
  className?: RadioGroupLayoutClassName;
}

const statusBannerSizeForRadioGroup: Record<RadioSize, InputSize> = {
  sm: "sm",
  md: "md",
};

function assertRadioGroupPattern(props: Pick<RadioGroupProps, "status" | "message">) {
  if (props.message != null && props.status == null) {
    console.warn("[WMDS RadioGroup] `message` requires `status`.");
  }
}

function RadioGroupRoot({
  label,
  labelHidden = false,
  description,
  value,
  onValueChange,
  name,
  orientation = "vertical",
  size = "md",
  disabled = false,
  status,
  message,
  children,
  className,
}: RadioGroupProps) {
  const fieldId = useId();
  const groupName = useRadioGroupName(name);
  assertRadioGroupPattern({ status, message });

  const legendId = label != null ? `${fieldId}-legend` : undefined;
  const descriptionId = description != null ? `${fieldId}-description` : undefined;
  const messageId = message != null && status != null ? `${fieldId}-message` : undefined;
  const describedBy =
    [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  const contextValue = useMemo(
    () => ({
      name: groupName,
      value,
      onValueChange,
      disabled,
      size,
    }),
    [groupName, value, onValueChange, disabled, size],
  );

  return (
    <fieldset
      disabled={disabled}
      className={cn(radioGroupFieldStackClasses, "min-w-0 border-0 p-0", className)}
    >
      {label != null ? (
        <legend
          id={legendId}
          className={cn(
            radioGroupLabelClassesFor(disabled),
            labelHidden && "sr-only",
            (description != null || !labelHidden) && "pb-px",
          )}
        >
          {label}
        </legend>
      ) : null}

      {description != null ? (
        <p id={descriptionId} className={cn(radioGroupDescriptionClasses, "pb-1")}>
          {description}
        </p>
      ) : null}

      <div
        role="radiogroup"
        aria-labelledby={legendId}
        aria-describedby={describedBy}
        aria-invalid={status === "error" || undefined}
        aria-disabled={disabled || undefined}
        className={radioGroupItemsClasses[orientation]}
      >
        <RadioGroupProvider value={contextValue}>{children}</RadioGroupProvider>
      </div>

      {message != null && status != null && messageId != null ? (
        <InputStatusBanner
          status={status}
          message={message}
          messageId={messageId}
          size={statusBannerSizeForRadioGroup[size]}
          messagePosition="bottom"
          bannerClassName={radioGroupStatusBannerClassesFor(status)}
        />
      ) : null}
    </fieldset>
  );
}

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});
