import { createContext, useContext, useId, type ReactNode } from "react";

export interface PanelContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  dismissOnEscape: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const PanelContext = createContext<PanelContextValue | null>(null);

export function PanelProvider({
  value,
  children,
}: {
  value: PanelContextValue;
  children: ReactNode;
}) {
  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}

export function usePanelContext(component: string): PanelContextValue {
  const context = useContext(PanelContext);
  if (context == null) {
    throw new Error(`[WMDS ${component}] must be used within \`Panel\`.`);
  }
  return context;
}

export function usePanelLabelIds(prefix: string) {
  const reactId = useId();
  return {
    titleId: `${prefix}-title${reactId}`,
    descriptionId: `${prefix}-description${reactId}`,
  };
}
