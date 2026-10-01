import { useEffect, useRef } from "react";
import { isEditableGridOverlayTarget } from "../../../lib/gridOverlayUtils";

export interface UseKbdChoiceKeysOptions {
  /**
   * When false, digit listeners stay idle. Use while the numbered choices are
   * on screen (for example, step 1 of a starter gate).
   */
  enabled?: boolean;
  /**
   * `KeyboardEvent.key` → select handler. Keys are usually `"1"`…`"4"`.
   * Each handler must match the click path for that choice (toggle / select).
   */
  choices: Readonly<Record<string, () => void>>;
}

/**
 * Window-level shortcuts for numbered choices documented with **Kbd**.
 *
 * **Kbd** stays display-only — this hook owns the select behavior so Pattern
 * Show code can copy both. Ignores editable targets (`input`, `textarea`,
 * `select`, contenteditable) and meta/ctrl/alt chords.
 */
export function useKbdChoiceKeys({
  enabled = true,
  choices,
}: UseKbdChoiceKeysOptions): void {
  const choicesRef = useRef(choices);
  choicesRef.current = choices;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableGridOverlayTarget(event.target)) return;
      const select = choicesRef.current[event.key];
      if (select == null) return;
      event.preventDefault();
      select();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
