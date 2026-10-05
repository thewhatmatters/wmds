import { createContext, useContext } from "react";

/** What **ChatDock** hands the gate in its window. */
export interface ChatDockGateContextValue {
  /** Folds the window. The gate stays, with its progress, for when the window reopens. */
  closeWindow: () => void;
  /** Name of the gate's header close — **ChatDock**'s `labels.close`. */
  closeLabel: string;
}

export const ChatDockGateContext = createContext<ChatDockGateContextValue | null>(null);

/** The window the gate fills, or `null` outside **ChatDock**. */
export function useChatDockGateWindow(): ChatDockGateContextValue | null {
  return useContext(ChatDockGateContext);
}
