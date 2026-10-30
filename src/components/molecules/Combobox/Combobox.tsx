import { useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { Input, type FieldWidth, type InputMessagePosition, type InputSize, type InputStatus } from "../../atoms/Input/Input";
import { Dropdown } from "../Dropdown/Dropdown";
import { measureDropdownMenuStyle } from "../Dropdown/dropdownMenuPosition";
import { dropdownMenuClasses, dropdownMenuListClasses } from "../Dropdown/dropdownStyles";
import { useDropdownMenu } from "../Dropdown/useDropdownMenu";
import { comboboxResultsMessage, filterComboboxOptions } from "./comboboxFilter";

export { filterComboboxOptions } from "./comboboxFilter";

/** Layout-only — width, margin, grid placement. */
export type ComboboxLayoutClassName = string;

export type ComboboxOption = {
  value: string;
  label: string;
  /** Leading slot — icon, swatch (**Dropdown.Item** `start`). */
  start?: ReactNode;
  /** Trailing slot — a category or a count (**Dropdown.Item** `end`); the selected row shows a check instead. */
  end?: ReactNode;
  /** Extra words that match the typed text but aren't shown (a category, a former name). */
  keywords?: readonly string[];
  disabled?: boolean;
};

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  /** The chosen option's `value` (or the typed text with `allowCustom`). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Controlled text in the field while typing. Default: the component keeps it. */
  inputValue?: string;
  onInputChange?: (text: string) => void;
  /** Replace the default filter (starts with, then a word starts with, then contains). */
  filter?: (options: readonly ComboboxOption[], query: string) => readonly ComboboxOption[];
  /** Said and shown when nothing matches. */
  emptyText?: string;
  /** Rows rendered at once; type to narrow the rest. Default 50, so a list of thousands stays quick. */
  maxResults?: number;
  /** Take what was typed as the value when it matches no option (Enter or leaving the field). */
  allowCustom?: boolean;
  label?: string;
  "aria-label"?: string;
  description?: string;
  placeholder?: string;
  size?: InputSize;
  width?: FieldWidth;
  status?: InputStatus;
  message?: string;
  messagePosition?: InputMessagePosition;
  disabled?: boolean;
  required?: boolean;
  /** Form name: a hidden input carries the chosen value on submit. */
  name?: string;
  id?: string;
  className?: ComboboxLayoutClassName;
}

/**
 * Searchable select — the **Input** pill with a search icon over a **Dropdown** listbox that narrows as
 * people type (Dropdowns C7: lists of 16 or more). WAI-ARIA combobox with list autocomplete: focus stays
 * in the field, ↓ / ↑ move through the results, Enter picks, Escape closes and then clears.
 */
export function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  inputValue: inputValueProp,
  onInputChange,
  filter = filterComboboxOptions,
  emptyText = "No matches",
  maxResults = 50,
  allowCustom = false,
  label,
  "aria-label": ariaLabel,
  description,
  placeholder,
  size = "md",
  width = "full",
  status,
  message,
  messagePosition,
  disabled = false,
  required,
  name,
  id: idProp,
  className,
}: ComboboxProps) {
  const generatedId = useId();
  const controlId = idProp ?? generatedId;
  const statusId = `${controlId}-results`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  // The typed text while editing; `null` shows the chosen option's label.
  const [draft, setDraft] = useState<string | null>(null);

  if (label == null && ariaLabel == null) {
    console.warn("[WMDS Combobox] Provide `label` or `aria-label`.");
  }

  const value = valueProp !== undefined ? valueProp : uncontrolledValue;
  const selected = options.find((option) => option.value === value);
  const selectedText = selected?.label ?? (allowCustom ? (value ?? "") : "");
  const text = inputValueProp ?? draft ?? selectedText;
  const query = draft ?? "";

  const matches = useMemo(() => filter(options, query), [filter, options, query]);
  const shown = useMemo(() => matches.slice(0, Math.max(1, maxResults)), [matches, maxResults]);
  const announcement = comboboxResultsMessage(matches.length, shown.length, emptyText);

  function setText(next: string | null) {
    setDraft(next);
    onInputChange?.(next ?? "");
  }

  function commit(nextValue: string) {
    if (valueProp === undefined) setUncontrolledValue(nextValue);
    if (nextValue !== value) onValueChange?.(nextValue);
  }

  function pick(option: ComboboxOption) {
    commit(option.value);
    setText(null);
    menu.close();
    inputRef.current?.focus();
  }

  /** Leaving or confirming without a pick: keep custom text, else go back to the chosen label. */
  function settleDraft() {
    if (draft == null) return;
    const typed = draft.trim();
    const exact = options.find((option) => option.label.toLowerCase() === typed.toLowerCase() && !option.disabled);
    if (exact != null) commit(exact.value);
    else if (allowCustom && typed !== "") commit(typed);
    else if (typed === "" && !required) commit("");
    setText(null);
  }

  const menu = useDropdownMenu({
    rows: shown,
    triggerRef: inputRef,
    focus: "trigger",
    editable: true,
    initialIndex: shown.findIndex((option) => option.value === value),
    measure: () => {
      const anchor = inputRef.current?.parentElement;
      return anchor == null ? null : measureDropdownMenuStyle(anchor, []);
    },
    onChoose: (index) => {
      const option = shown[index];
      if (option != null) pick(option);
    },
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
    menu.openMenu("first");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape" && !menu.open && text !== "") {
      // APG: a second Escape clears the field.
      event.preventDefault();
      setText("");
    } else if (event.key === "Enter" && (!menu.open || shown.length === 0)) {
      if (draft != null) event.preventDefault();
      settleDraft();
      menu.close();
    }
  }

  const activeId = menu.open && menu.activeIndex < shown.length ? menu.triggerProps["aria-activedescendant"] : undefined;

  return (
    <div
      {...menu.rootProps}
      onBlur={(event) => {
        menu.rootProps.onBlur(event);
        const next = event.relatedTarget as Node | null;
        if (next == null || !event.currentTarget.contains(next)) settleDraft();
      }}
      className={cn("relative min-w-0", className)}
    >
      <Input
        ref={inputRef}
        id={controlId}
        role="combobox"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-autocomplete="list"
        aria-expanded={menu.open}
        aria-controls={menu.open ? menu.menuProps.id : undefined}
        aria-activedescendant={activeId}
        aria-label={label == null ? ariaLabel : undefined}
        aria-describedby={statusId}
        aria-required={required || undefined}
        label={label}
        description={description}
        placeholder={placeholder}
        size={size}
        width={width}
        status={status}
        message={message}
        messagePosition={messagePosition}
        disabled={disabled}
        icon={<SearchIcon strokeWidth={2} />}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (!menu.open && !disabled) menu.openMenu("initial");
        }}
      />
      {name != null ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      {/* Results count for screen readers, polite so typing isn't interrupted. */}
      <span id={statusId} role="status" className="sr-only">
        {menu.open ? announcement : ""}
      </span>
      {menu.open && menu.menuStyle != null ? (
        <div ref={menu.menuProps.ref} style={menu.menuProps.style} className={dropdownMenuClasses}>
          {shown.length > 0 ? (
            <ul id={menu.menuProps.id} role="listbox" aria-label={label ?? ariaLabel} className={dropdownMenuListClasses}>
              {shown.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <li key={option.value} role="presentation">
                    <Dropdown.Item
                      {...menu.rowProps(index)}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      selected={isSelected}
                      disabled={option.disabled}
                      truncate={false}
                      start={option.start}
                      end={option.end}
                      className="pointer-coarse:min-h-11"
                      // Keep focus in the field: it owns the keyboard and names the active option.
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => pick(option)}
                    >
                      {option.label}
                    </Dropdown.Item>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p id={menu.menuProps.id} className={cn(typographyClass("body"), "m-0 px-3.5 py-2 text-muted")}>
              {emptyText}
            </p>
          )}
          {shown.length < matches.length ? (
            <p aria-hidden className={cn(typographyClass("caption"), "m-0 px-3.5 py-2 text-muted")}>
              {`${(matches.length - shown.length).toLocaleString("en-US")} more. Keep typing to narrow.`}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
