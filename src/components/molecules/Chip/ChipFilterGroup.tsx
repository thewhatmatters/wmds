import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  horizontalScrollClasses,
} from "../../../lib/segmentedControl";

export type ChipSelectionMode = "single" | "multiple";

type ChipFilterGroupContextValue = {
  selectionMode: ChipSelectionMode;
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
};

const ChipFilterGroupContext = createContext<ChipFilterGroupContextValue | null>(null);

export function useChipFilterGroup() {
  return useContext(ChipFilterGroupContext);
}

type ChipFilterGroupBaseProps = {
  /** Accessible name for the filter toolbar. */
  "aria-label": string;
  children: ReactNode;
  className?: string;
};

export type ChipFilterGroupProps =
  | (ChipFilterGroupBaseProps & {
      selectionMode?: "multiple";
      value: string[];
      onValueChange: (value: string[]) => void;
    })
  | (ChipFilterGroupBaseProps & {
      selectionMode: "single";
      value: string;
      onValueChange: (value: string) => void;
    });

/**
 * Filter chip toolbar — multi-select by default.
 * Pair with {@link Chip} `value` props inside the group.
 */
export function ChipFilterGroup(props: ChipFilterGroupProps) {
  const { children, className, "aria-label": ariaLabel } = props;

  if (props.selectionMode === "single") {
    const contextValue: ChipFilterGroupContextValue = {
      selectionMode: "single",
      value: props.value,
      onValueChange: (next) => props.onValueChange(next as string),
    };

    return (
      <ChipFilterGroupContext.Provider value={contextValue}>
        <div
          role="toolbar"
          aria-label={ariaLabel}
          className={cn(
            "-mx-1 flex items-center gap-1 px-1 py-1",
            horizontalScrollClasses,
            className,
          )}
        >
          {children}
        </div>
      </ChipFilterGroupContext.Provider>
    );
  }

  const contextValue: ChipFilterGroupContextValue = {
    selectionMode: "multiple",
    value: props.value,
    onValueChange: (next) => props.onValueChange(next as string[]),
  };

  return (
    <ChipFilterGroupContext.Provider value={contextValue}>
      <div
        role="toolbar"
        aria-label={ariaLabel}
        className={cn(
          "-mx-1 flex items-center gap-1 px-1 py-1",
          horizontalScrollClasses,
          className,
        )}
      >
        {children}
      </div>
    </ChipFilterGroupContext.Provider>
  );
}
