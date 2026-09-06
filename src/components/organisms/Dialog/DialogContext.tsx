import { createContext, useContext, useId, type ReactNode } from "react";

export interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  dismissOnBackdrop: boolean;
  dismissOnEscape: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({
  value,
  children,
}: {
  value: DialogContextValue;
  children: ReactNode;
}) {
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function useDialogContext(component: string): DialogContextValue {
  const context = useContext(DialogContext);
  if (context == null) {
    throw new Error(`[WMDS ${component}] must be used within \`Dialog\`.`);
  }
  return context;
}

export function useDialogOptionalContext(): DialogContextValue | null {
  return useContext(DialogContext);
}

/** Stable ids for alertdialog title + description. */
export function useDialogLabelIds(prefix: string) {
  const reactId = useId();
  return {
    titleId: `${prefix}-title${reactId}`,
    descriptionId: `${prefix}-description${reactId}`,
  };
}
