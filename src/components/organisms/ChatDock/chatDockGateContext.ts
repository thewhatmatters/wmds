import { createContext, useContext } from "react";

/** What **ChatDock** hands the gate in its conversation. */
export interface ChatDockGateContextValue {
  /**
   * Brings the gate into view in the conversation — the whole form when it fits, otherwise its top.
   * The gate asks on mount and on each step.
   */
  revealGate: () => void;
  /**
   * The height of the gate's pinned footer, in px (0 when the gate goes). The conversation keeps that
   * much scroll padding at its end, so a control that takes focus never sits under the footer.
   */
  setFooterInset: (px: number) => void;
}

export const ChatDockGateContext = createContext<ChatDockGateContextValue | null>(null);

/** The conversation the gate sits in, or `null` outside **ChatDock**. */
export function useChatDockGateWindow(): ChatDockGateContextValue | null {
  return useContext(ChatDockGateContext);
}
