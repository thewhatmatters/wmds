import { createContext, useContext } from "react";

/** What **ChatDock** hands the gate in its conversation. */
export interface ChatDockGateContextValue {
  /**
   * Brings the gate into view in the conversation — the whole form when it fits, otherwise its top.
   * The gate asks on mount and on each step.
   */
  revealGate: () => void;
}

export const ChatDockGateContext = createContext<ChatDockGateContextValue | null>(null);

/** The conversation the gate sits in, or `null` outside **ChatDock**. */
export function useChatDockGateWindow(): ChatDockGateContextValue | null {
  return useContext(ChatDockGateContext);
}
