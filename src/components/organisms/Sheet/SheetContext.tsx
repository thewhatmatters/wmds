import { createContext, useContext, useId, type ReactNode } from "react";

export interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  dismissOnBackdrop: boolean;
  dismissOnEscape: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function SheetProvider({
  value,
  children,
}: {
  value: SheetContextValue;
  children: ReactNode;
}) {
  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

export function useSheetContext(component: string): SheetContextValue {
  const context = useContext(SheetContext);
  if (context == null) {
    throw new Error(`[WMDS ${component}] must be used within \`Sheet\`.`);
  }
  return context;
}

export function useSheetLabelIds(prefix: string) {
  const reactId = useId();
  return {
    titleId: `${prefix}-title${reactId}`,
    descriptionId: `${prefix}-description${reactId}`,
  };
}
