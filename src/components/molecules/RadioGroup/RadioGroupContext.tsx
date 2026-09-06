import { createContext, useContext, useId, useMemo, type ReactNode } from "react";
import type { RadioSize } from "../../atoms/Radio/radioStyles";

export interface RadioGroupContextValue {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  size: RadioSize;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext(): RadioGroupContextValue {
  const context = useContext(RadioGroupContext);
  if (context == null) {
    throw new Error("[WMDS RadioGroup] Item must be used within RadioGroup.");
  }
  return context;
}

export function RadioGroupProvider({
  value,
  children,
}: {
  value: RadioGroupContextValue;
  children: ReactNode;
}) {
  const memoValue = useMemo(() => value, [value]);
  return <RadioGroupContext.Provider value={memoValue}>{children}</RadioGroupContext.Provider>;
}

export function useRadioGroupName(fallback?: string): string {
  const generated = useId();
  return fallback ?? generated;
}
