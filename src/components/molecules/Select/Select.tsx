import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { Dropdown } from "../Dropdown/Dropdown";
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
  id: idProp,
  "aria-label": ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const controlId = idProp ?? generatedId;
  const listboxId = `${controlId}-listbox`;
  const descriptionId = description != null ? `${controlId}-description` : undefined;
  const rootRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const initial = valueProp ?? defaultValue;
    const index = options.findIndex((option) => option.value === initial);
    return index >= 0 ? index : 0;
  });

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  assertSelectA11y({ label, "aria-label": ariaLabel, options });

  const selectedLabel = findOptionLabel(options, value);

  const close = useCallback(() => {
    setOpen(false);
    setMenuStyle(null);
  }, []);

  const openListbox = useCallback(() => {
    const shell = shellRef.current;
    if (shell != null) {
      setMenuStyle(measureSelectMenuStyle(shell, options));
    }
    setOpen(true);
  }, [options]);

  const selectValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
      close();
    },
    [close, isControlled, onValueChange],
  );

  const updateMenuPosition = useCallback(() => {
    const shell = shellRef.current;
    if (shell == null) {
      return;
    }

    setMenuStyle(measureSelectMenuStyle(shell, options));
  }, [options]);

  useLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    updateMenuPosition();

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current != null && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [close, open]);

  useEffect(() => {
    const index = options.findIndex((option) => option.value === value);
    if (index >= 0) {
      setActiveIndex(index);
    }
  }, [options, value]);

  function moveActive(delta: number) {
    setActiveIndex((current) => {
      if (options.length === 0) {
        return 0;
      }
      return (current + delta + options.length) % options.length;
    });
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openListbox();
        } else {
          moveActive(1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openListbox();
        } else {
          moveActive(-1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) {
          const option = options[activeIndex];
          if (option != null) {
            selectValue(option.value);
          }
        } else {
          openListbox();
        }
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      default:
        break;
    }
  }

  const control = (
    <div ref={rootRef} className={cn(selectRootClasses, className)}>
      <div
        ref={shellRef}
        className={cn(selectShellClasses[size], disabled && selectShellDisabledClasses)}
        data-open={open ? "true" : "false"}
      >
        <button
          type="button"
          id={controlId}
          disabled={disabled}
          aria-label={label == null ? ariaLabel : undefined}
          aria-labelledby={label != null ? `${controlId}-label` : undefined}
          aria-describedby={descriptionId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => {
            if (disabled) {
              return;
            }
            if (open) {
              close();
            } else {
              openListbox();
            }
          }}
          onKeyDown={handleTriggerKeyDown}
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
                open && selectTriggerCaretOpenClasses,
              )}
            >
              <ChevronDown strokeWidth={2} />
            </span>
          </span>
        </button>
      </div>
      {open && menuStyle != null ? (
        <Dropdown.Menu
          id={listboxId}
          role="listbox"
          aria-labelledby={controlId}
          style={menuStyle}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li key={option.value} role="presentation">
                <Dropdown.Item
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  selected={isSelected}
                  active={isActive}
                  truncate={false}
                  start={option.start}
                  end={option.end}
                  onMouseEnter={() => {
                    setActiveIndex(index);
                  }}
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
