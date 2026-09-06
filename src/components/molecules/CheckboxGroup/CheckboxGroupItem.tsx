import { type ChangeEvent } from "react";
import { Checkbox, type CheckboxLayoutClassName } from "../../atoms/Checkbox/Checkbox";
import { useCheckboxGroupContext } from "./CheckboxGroupContext";

export interface CheckboxGroupItemProps {
  /** Stable value when the group manages selection. */
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: CheckboxLayoutClassName;
}

/** One option inside **CheckboxGroup** — wires `checked` when group `values` / `onValuesChange` are set. */
export function CheckboxGroupItem({
  value,
  label,
  description,
  disabled,
  className,
}: CheckboxGroupItemProps) {
  const context = useCheckboxGroupContext();
  const groupDisabled = context?.disabled ?? false;
  const size = context?.size ?? "md";
  const values = context?.values;
  const onValuesChange = context?.onValuesChange;

  const isManaged = values != null && onValuesChange != null;
  const checked = isManaged ? values.includes(value) : undefined;

  const handleChange = isManaged
    ? (event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.checked
          ? [...values, value]
          : values.filter((entry) => entry !== value);
        onValuesChange(next);
      }
    : undefined;

  if (!isManaged) {
    console.warn(
      "[WMDS CheckboxGroup] Item requires group `values` and `onValuesChange`, or use bare **Checkbox** children.",
    );
  }

  return (
    <Checkbox
      label={label}
      description={description}
      size={size}
      checked={checked}
      disabled={groupDisabled || disabled}
      onChange={handleChange}
      className={className}
    />
  );
}
