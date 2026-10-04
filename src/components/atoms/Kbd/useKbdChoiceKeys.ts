import { useEffect, useRef, type RefObject } from "react";

export interface UseKbdChoiceKeysOptions {
  /**
   * When false, digit listeners stay idle. Use while the numbered choices are
   * on screen (for example, step 1 of a starter gate).
   */
  enabled?: boolean;
  /**
   * `KeyboardEvent.key` → select handler. Keys are usually `"1"`…`"7"`.
   * Each handler must match the click path for that choice (toggle / select).
   */
  choices: Readonly<Record<string, () => void>>;
  /**
   * Only while focus is inside this element — for example a gate in the chat window, so digits
   * typed elsewhere on the page are left alone. Omit to listen page-wide.
   */
  scope?: RefObject<HTMLElement | null>;
}

/** Inputs that take no typing — digits pressed on them can select a choice. */
const nonTextInputTypes = new Set(["button", "checkbox", "color", "file", "image", "radio", "range", "reset", "submit"]);

/** Text entry — a text field, text area, select, or editable element — where digits are typing. */
export function kbdChoiceKeysTypingTarget(target: EventTarget | null): boolean {
  if (target == null || typeof target !== "object") return false;
  const element = target as { isContentEditable?: boolean; tagName?: string; type?: string };
  if (element.isContentEditable === true) return true;
  if (element.tagName === "TEXTAREA" || element.tagName === "SELECT") return true;
  return element.tagName === "INPUT" && !nonTextInputTypes.has(String(element.type ?? "text").toLowerCase());
}

/**
 * Window-level shortcuts for numbered choices documented with **Kbd**.
 *
 * **Kbd** stays display-only — this hook owns the select behavior so Pattern
 * Show code can copy both. Ignores text entry (text inputs, `textarea`, `select`,
 * contenteditable) and meta/ctrl/alt chords; a focused checkbox or radio still takes digits.
 * With `scope`, digits act only while focus is inside that element.
 */
export function useKbdChoiceKeys({
  enabled = true,
  choices,
  scope,
}: UseKbdChoiceKeysOptions): void {
  const choicesRef = useRef(choices);
  choicesRef.current = choices;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (kbdChoiceKeysTypingTarget(event.target)) return;
      if (scope != null) {
        const target = event.target;
        if (!(target instanceof Node) || scope.current?.contains(target) !== true) return;
      }
      const select = choicesRef.current[event.key];
      if (select == null) return;
      event.preventDefault();
      select();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, scope]);
}
