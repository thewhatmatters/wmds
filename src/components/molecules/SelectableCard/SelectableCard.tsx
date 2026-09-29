import {
  createContext,
  useContext,
  useId,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";
import { Badge } from "../../atoms/Badge/Badge";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import {
  selectableCardCheckedClasses,
  selectableCardClasses,
  selectableCardGridClasses,
  selectableCardGroupClasses,
  selectableCardMarkClasses,
  selectableCardSelectedClasses,
} from "./selectableCardStyles";

/** Layout-only — width or margin. */
export type SelectableCardLayoutClassName = string;

interface SelectableCardContextValue {
  values: readonly string[];
  onToggle: (value: string) => void;
}

const SelectableCardContext = createContext<SelectableCardContextValue | null>(null);

function useSelectableCardContext(component: string): SelectableCardContextValue {
  const value = useContext(SelectableCardContext);
  if (value == null) {
    throw new Error(`${component} must be used inside SelectableCard.Group.`);
  }
  return value;
}

export interface SelectableCardGroupProps {
  /** Accessible name for the checkbox group. */
  label: string;
  values: readonly string[];
  onValuesChange: (values: string[]) => void;
  /**
   * Slot above the grid. Compose a hugged **SegmentedControl**
   * for a fresh / refresh choice.
   */
  toggle?: ReactNode;
  children: ReactNode;
  className?: SelectableCardLayoutClassName;
}

export interface SelectableCardProps {
  value: string;
  title: string;
  description?: string;
  className?: SelectableCardLayoutClassName;
}

function SelectableCardGroup({
  label,
  values,
  onValuesChange,
  toggle,
  children,
  className,
}: SelectableCardGroupProps) {
  function onToggle(value: string) {
    if (values.includes(value)) {
      onValuesChange(values.filter((item) => item !== value));
      return;
    }
    onValuesChange([...values, value]);
  }

  return (
    <SelectableCardContext.Provider value={{ values, onToggle }}>
      <div
        role="group"
        aria-label={label}
        className={cn(selectableCardGroupClasses, className)}
      >
        {toggle}
        <div className={selectableCardGridClasses}>{children}</div>
      </div>
    </SelectableCardContext.Provider>
  );
}

/**
 * Multi-select card. The whole card is the checkbox.
 * Checked state is **Badge** `iconOnly` with a Lucide check.
 */
function SelectableCardItem({
  value,
  title,
  description,
  className,
}: SelectableCardProps) {
  const { values, onToggle } = useSelectableCardContext("SelectableCard");
  const titleId = useId();
  const descriptionId = useId();
  const checked = values.includes(value);

  return (
    <label
      className={cn(selectableCardClasses, checked && selectableCardSelectedClasses, className)}
      data-value={value}
      data-checked={checked ? "true" : "false"}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        aria-labelledby={titleId}
        aria-describedby={description != null ? descriptionId : undefined}
        onChange={() => onToggle(value)}
      />
      <span id={titleId} className={typographyClass("subheading")}>
        {title}
      </span>
      {description != null ? (
        <span id={descriptionId} className={typographyClass("caption")}>
          {description}
        </span>
      ) : null}
      {checked ? (
        <span className={selectableCardCheckedClasses}>
          <Badge variant="neutral" iconOnly icon={<Check strokeWidth={2} />} />
        </span>
      ) : (
        <span className={selectableCardMarkClasses} aria-hidden />
      )}
    </label>
  );
}

export const SelectableCard = Object.assign(SelectableCardItem, {
  Group: SelectableCardGroup,
});
