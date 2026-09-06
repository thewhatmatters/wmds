import { Radio, type RadioLayoutClassName } from "../../atoms/Radio/Radio";
import { useRadioGroupContext } from "./RadioGroupContext";

export interface RadioGroupItemProps {
  /** Stable value for this option. */
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: RadioLayoutClassName;
}

/** One option inside **RadioGroup** — wires `name`, `checked`, and `onChange` from context. */
export function RadioGroupItem({
  value,
  label,
  description,
  disabled,
  className,
}: RadioGroupItemProps) {
  const { name, value: selectedValue, onValueChange, disabled: groupDisabled, size } =
    useRadioGroupContext();

  return (
    <Radio
      name={name}
      value={value}
      label={label}
      description={description}
      size={size}
      checked={selectedValue === value}
      disabled={groupDisabled || disabled}
      onChange={() => onValueChange(value)}
      className={className}
    />
  );
}
