import { useId, useMemo, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { InputStatusBanner } from "../../atoms/inputShared/InputStatusBanner";
import type { InputSize, InputStatus } from "../../atoms/Input/inputShellStyles";
import {
  checkboxGroupDescriptionClasses,
  checkboxGroupDescriptionSpacingClasses,
  checkboxGroupFieldStackClasses,
  checkboxGroupItemsClasses,
  checkboxGroupLabelClassesFor,
  checkboxGroupLegendLabelOnlySpacingClasses,
  checkboxGroupLegendWithDescriptionSpacingClasses,
  checkboxGroupMessageTopSpacingClasses,
  checkboxGroupStatusBannerClassesFor,
  type CheckboxGroupOrientation,
  type CheckboxSize,
} from "./checkboxGroupStyles";
import { CheckboxGroupItem } from "./CheckboxGroupItem";
import { CheckboxGroupProvider } from "./CheckboxGroupContext";

export {
  checkboxGroupOrientations,
  checkboxSizes,
  type CheckboxGroupOrientation,
  type CheckboxSize,
} from "./checkboxGroupStyles";
export type { CheckboxGroupItemProps } from "./CheckboxGroupItem";

/** Layout-only — width/margin on the field stack. */
export type CheckboxGroupLayoutClassName = string;

export interface CheckboxGroupProps {
  /** Group label — rendered as legend / aria-labelledby source. */
  label?: string;
  labelHidden?: boolean;
  description?: string;
  /** Selected option values — controlled when using **CheckboxGroup.Item**. */
  values?: string[];
  onValuesChange?: (values: string[]) => void;
  orientation?: CheckboxGroupOrientation;
  size?: CheckboxSize;
  disabled?: boolean;
  status?: InputStatus;
  message?: string;
  children: ReactNode;
  className?: CheckboxGroupLayoutClassName;
}

const statusBannerSizeForCheckboxGroup: Record<CheckboxSize, InputSize> = {
  sm: "sm",
  md: "md",
};

function assertCheckboxGroupPattern(
  props: Pick<CheckboxGroupProps, "status" | "message" | "values" | "onValuesChange">,
) {
  if (props.message != null && props.status == null) {
    console.warn("[WMDS CheckboxGroup] `message` requires `status`.");
  }
  if ((props.values != null) !== (props.onValuesChange != null)) {
    console.warn("[WMDS CheckboxGroup] `values` and `onValuesChange` must be used together.");
  }
}

function CheckboxGroupRoot({
  label,
  labelHidden = false,
  description,
  values,
  onValuesChange,
  orientation = "vertical",
  size = "md",
  disabled = false,
  status,
  message,
  children,
  className,
}: CheckboxGroupProps) {
  const fieldId = useId();
  assertCheckboxGroupPattern({ status, message, values, onValuesChange });

  const legendId = label != null ? `${fieldId}-legend` : undefined;
  const descriptionId = description != null ? `${fieldId}-description` : undefined;
  const messageId = message != null && status != null ? `${fieldId}-message` : undefined;
  const describedBy =
    [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  const contextValue = useMemo(
    () => ({
      values,
      onValuesChange,
      disabled,
      size,
    }),
    [values, onValuesChange, disabled, size],
  );

  return (
    <fieldset
      disabled={disabled}
      className={cn(checkboxGroupFieldStackClasses, "min-w-0 border-0 p-0", className)}
    >
      {label != null ? (
        <legend
          id={legendId}
          className={cn(
            checkboxGroupLabelClassesFor(disabled),
            labelHidden && "sr-only",
            description != null
              ? checkboxGroupLegendWithDescriptionSpacingClasses
              : checkboxGroupLegendLabelOnlySpacingClasses,
          )}
        >
          {label}
        </legend>
      ) : null}

      {description != null ? (
        <p
          id={descriptionId}
          className={cn(checkboxGroupDescriptionClasses, checkboxGroupDescriptionSpacingClasses)}
        >
          {description}
        </p>
      ) : null}

      <div
        role="group"
        aria-labelledby={legendId}
        aria-describedby={describedBy}
        aria-invalid={status === "error" || undefined}
        aria-disabled={disabled || undefined}
        className={checkboxGroupItemsClasses[orientation]}
      >
        <CheckboxGroupProvider value={contextValue}>{children}</CheckboxGroupProvider>
      </div>

      {message != null && status != null && messageId != null ? (
        <InputStatusBanner
          status={status}
          message={message}
          messageId={messageId}
          size={statusBannerSizeForCheckboxGroup[size]}
          messagePosition="bottom"
          bannerClassName={cn(
            checkboxGroupStatusBannerClassesFor(status),
            checkboxGroupMessageTopSpacingClasses,
          )}
        />
      ) : null}
    </fieldset>
  );
}

export const CheckboxGroup = Object.assign(CheckboxGroupRoot, {
  Item: CheckboxGroupItem,
});
