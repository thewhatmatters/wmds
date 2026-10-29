import { useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Dropdown } from "../Dropdown/Dropdown";
import { useDropdownMenu } from "../Dropdown/useDropdownMenu";
import { cn } from "../../../lib/cn";
import { measureSelectMenuStyle } from "./selectMenuPosition";
import {
  selectDescriptionClasses,
  selectDisabledLabelClasses,
  selectFieldStackClasses,
  selectLabelClasses,
  selectRootClasses,
  selectShellClasses,
  selectShellDisabledClasses,
  selectTriggerCaretOpenClasses,
  selectTriggerCaretRotateClasses,
  selectTriggerCaretSlotClasses,
  selectTriggerInnerClasses,
  selectTriggerLabelClasses,
  selectTriggerPlaceholderClasses,
  type SelectSize,
} from "./selectStyles";
import { fieldWidthStyle, type FieldWidth } from "../../atoms/Input/fieldWidth";

export type { SelectSize } from "./selectStyles";
export { selectSizes } from "./selectStyles";

/** Layout-only — width, margin in toolbars and Card headers. */
export type SelectLayoutClassName = string;

export type SelectOption = {
  value: string;
  label: string;
  /** Leading slot — icon, checkbox, swatch (**Dropdown.Item** `start`). */
  start?: ReactNode;
  /** Trailing slot — shortcut, count, checkmark (**Dropdown.Item** `end`). */
  end?: ReactNode;
};

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: SelectSize;
  className?: SelectLayoutClassName;
  id?: string;
  "aria-label"?: string;
  /**
   * Trigger width in characters for short fixed answers (a US state `2ch`); default `full` (Form layout L7).
   */
  width?: FieldWidth;
  /**
   * Form name. With `name` or `autoComplete`, Select keeps a hidden native `<select>` in step, so the value
   * submits with a plain form and the browser can autofill it (e.g. `autoComplete="address-level1"`).
   */
  name?: string;
  autoComplete?: string;
  /** Extra ids that describe the trigger (Field passes its description here); joined with `description`. */
  "aria-describedby"?: string;
}

function assertSelectA11y(
  props: Pick<SelectProps, "label" | "aria-label" | "options">,
) {
  if (props.label == null && props["aria-label"] == null) {
    console.warn("[WMDS Select] Provide `label` or `aria-label`.");
  }
  if (props.options.length === 0) {
    console.warn("[WMDS Select] `options` must not be empty.");
  }
}

/** Shell around the characters, per size: side padding, the caret and its gap, and the border. */
const selectWidthChrome: Record<SelectSize, string> = {
  sm: "2.75rem + 2px",
  md: "3rem + 2px",
  lg: "3.5rem + 2px",
};

function findOptionLabel(options: SelectOption[], value: string | undefined): string | undefined {
  if (value == null) {
    return undefined;
  }

  return options.find((option) => option.value === value)?.label;
}

/**
 * Pill select — Input-matched trigger + floating listbox panel.
 * Compose in forms and Card headers (period filters).
 */
export function Select({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  label,
  description,
  disabled = false,
  size = "md",
  className,
  width = "full",
  name,
  autoComplete,
  id: idProp,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: SelectProps) {
  const generatedId = useId();
  const controlId = idProp ?? generatedId;
  const descriptionId = description != null ? `${controlId}-description` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || undefined;
  const shellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  assertSelectA11y({ label, "aria-label": ariaLabel, options });

  const selectedLabel = findOptionLabel(options, value);

  function commitValue(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  function selectValue(nextValue: string) {
    commitValue(nextValue);
    menu.close({ returnFocus: true });
  }

  const menu = useDropdownMenu({
    rows: options,
    triggerRef,
    focus: "trigger",
    initialIndex: options.findIndex((option) => option.value === value),
    measure: () => (shellRef.current == null ? null : measureSelectMenuStyle(shellRef.current, options)),
    onChoose: (index) => {
      const option = options[index];
      if (option != null) selectValue(option.value);
    },
  });

  const control = (
    <div
      {...menu.rootProps}
      style={fieldWidthStyle(width, selectWidthChrome[size])}
      className={cn(selectRootClasses, className)}
    >
      {name != null || autoComplete != null ? (
        // Autofill and plain-form mirror: hidden from people and assistive tech, kept in step both ways.
        <select
          aria-hidden
          tabIndex={-1}
          name={name}
          autoComplete={autoComplete}
          disabled={disabled}
          value={value ?? ""}
          onChange={(event) => commitValue(event.target.value)}
          className="sr-only"
          data-select-mirror=""
        >
          <option value="" />
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      <div
        ref={shellRef}
        className={cn(selectShellClasses[size], disabled && selectShellDisabledClasses)}
        data-open={menu.open ? "true" : "false"}
      >
        <button
          ref={triggerRef}
          type="button"
          id={controlId}
          role="combobox"
          disabled={disabled}
          aria-label={label == null ? ariaLabel : undefined}
          aria-labelledby={label != null ? `${controlId}-label` : undefined}
          aria-describedby={describedBy}
          aria-haspopup="listbox"
          {...menu.triggerProps}
          onClick={() => {
            if (!disabled) menu.toggle();
          }}
          className={selectTriggerInnerClasses[size]}
        >
          <span
            className={cn(
              selectTriggerLabelClasses,
              selectedLabel == null && selectTriggerPlaceholderClasses,
            )}
          >
            {selectedLabel ?? placeholder}
          </span>
          <span className={selectTriggerCaretSlotClasses[size]} aria-hidden>
            <span
              className={cn(
                selectTriggerCaretRotateClasses,
                menu.open && selectTriggerCaretOpenClasses,
              )}
            >
              <ChevronDown strokeWidth={2} />
            </span>
          </span>
        </button>
      </div>
      {menu.open && menu.menuStyle != null ? (
        <Dropdown.Menu {...menu.menuProps} role="listbox" aria-labelledby={controlId}>
          {options.map((option, index) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <Dropdown.Item
                  {...menu.rowProps(index)}
                  role="option"
                  aria-selected={isSelected}
                  selected={isSelected}
                  truncate={false}
                  start={option.start}
                  end={option.end}
                  // Keep focus on the trigger: it owns the keyboard and names the active option.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    selectValue(option.value);
                  }}
                >
                  {option.label}
                </Dropdown.Item>
              </li>
            );
          })}
        </Dropdown.Menu>
      ) : null}
    </div>
  );

  if (label == null && description == null) {
    return control;
  }

  return (
    <div className={selectFieldStackClasses}>
      {label != null ? (
        <label
          id={`${controlId}-label`}
          htmlFor={controlId}
          className={cn(selectLabelClasses, disabled && selectDisabledLabelClasses)}
        >
          {label}
        </label>
      ) : null}
      {control}
      {description != null ? (
        <p id={descriptionId} className={selectDescriptionClasses}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
