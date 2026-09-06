import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CheckboxSize } from "../../atoms/Checkbox/checkboxStyles";

export interface CheckboxGroupContextValue {
  disabled: boolean;
  size: CheckboxSize;
  values?: string[];
  onValuesChange?: (values: string[]) => void;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
  return useContext(CheckboxGroupContext);
}

export function CheckboxGroupProvider({
  value,
  children,
}: {
  value: CheckboxGroupContextValue;
  children: ReactNode;
}) {
  const memoValue = useMemo(() => value, [value]);
  return (
    <CheckboxGroupContext.Provider value={memoValue}>{children}</CheckboxGroupContext.Provider>
  );
}
