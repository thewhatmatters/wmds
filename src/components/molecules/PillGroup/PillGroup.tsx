import {
  createContext,
  useContext,
  useId,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  pillGroupClasses,
  pillGroupFieldClasses,
  pillGroupLabelClasses,
  pillGroupIdleClasses,
  pillGroupMutedClasses,
  pillGroupSelectedClasses,
} from "./pillGroupStyles";

/** Layout-only — width or margin. */
export type PillGroupLayoutClassName = string;

export const pillGroupEmphases = ["solid", "muted"] as const;

export type PillGroupEmphasis = (typeof pillGroupEmphases)[number];

interface PillGroupContextValue {
  name: string;
  value: string | null;
  onValueChange: (value: string) => void;
}

const PillGroupContext = createContext<PillGroupContextValue | null>(null);

function usePillGroupContext(component: string): PillGroupContextValue {
  const value = useContext(PillGroupContext);
  if (value == null) {
    throw new Error(`${component} must be used inside PillGroup.`);
  }
  return value;
}

export interface PillGroupProps {
  /**
   * The question, shown above the pills and naming the group (Dropdowns C2, C9). Prefer it to `aria-label`.
   */
  label?: ReactNode;
  /** Accessible name when the question is visible elsewhere (a heading right above). */
  "aria-label"?: string;
  value: string | null;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: PillGroupLayoutClassName;
}

export interface PillGroupItemProps {
  value: string;
  children: ReactNode;
  /**
   * `muted` uses the existing Badge neutral muted surface for a softer idle pill.
   * Selected pills share the brand fill.
   */
  emphasis?: PillGroupEmphasis;
  className?: PillGroupLayoutClassName;
}

function pillSurface(selected: boolean, emphasis: PillGroupEmphasis): string {
  if (selected) {
    return pillGroupSelectedClasses;
  }
  return emphasis === "muted" ? pillGroupMutedClasses : pillGroupIdleClasses;
}

function PillGroupRoot({
  label,
  "aria-label": ariaLabel,
  value,
  onValueChange,
  children,
  className,
}: PillGroupProps) {
  const name = useId();
  const labelId = `${name}-label`;
  if (label == null && ariaLabel == null) {
    console.warn("[WMDS PillGroup] Provide `label` (the question) or `aria-label`.");
  }

  const group = (
    <div
      role="radiogroup"
      aria-label={label == null ? ariaLabel : undefined}
      aria-labelledby={label != null ? labelId : undefined}
      className={cn(pillGroupClasses, label == null && className)}
    >
      {children}
    </div>
  );

  return (
    <PillGroupContext.Provider value={{ name, value, onValueChange }}>
      {label != null ? (
        <div className={cn(pillGroupFieldClasses, className)}>
          <span id={labelId} className={pillGroupLabelClasses}>
            {label}
          </span>
          {group}
        </div>
      ) : (
        group
      )}
    </PillGroupContext.Provider>
  );
}

/** One radio pill. Wraps with its siblings. */
function PillGroupItem({
  value,
  children,
  emphasis = "solid",
  className,
}: PillGroupItemProps) {
  const group = usePillGroupContext("PillGroup.Item");
  const selected = group.value === value;

  return (
    <label className="inline-flex" data-emphasis={emphasis} data-value={value}>
      <input
        type="radio"
        className="peer sr-only"
        name={group.name}
        value={value}
        checked={selected}
        onChange={() => group.onValueChange(value)}
      />
      <span className={cn(pillSurface(selected, emphasis), className)}>{children}</span>
    </label>
  );
}

export const PillGroup = Object.assign(PillGroupRoot, {
  Item: PillGroupItem,
});
