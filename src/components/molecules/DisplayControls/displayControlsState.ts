import { isEditableGridOverlayTarget } from "../../../lib/gridOverlayUtils";

export const displayControlThemeModes = ["auto", "light", "dark"] as const;

export type DisplayControlThemeMode = (typeof displayControlThemeModes)[number];

/** `localStorage` key for the appearance choice. The no-flash snippet reads the same key. */
export const displayThemeStorageKey = "wmds-theme";

/**
 * Paste into `<head>` before the stylesheet so the first paint matches the saved
 * appearance. `auto` and a missing key follow `prefers-color-scheme`. `light` clears
 * `data-theme`. `dark` sets it. No new color — the attribute swaps the existing tokens.
 */
export const displayThemeNoFlashScript =
  '(function(){try{var t=localStorage.getItem("wmds-theme");var dark=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var root=document.documentElement;if(dark)root.setAttribute("data-theme","dark");else root.removeAttribute("data-theme");}catch(e){}})();';

function isThemeMode(value: string | null): value is DisplayControlThemeMode {
  return value === "auto" || value === "light" || value === "dark";
}

/** Saved appearance. `auto` when nothing valid is stored or storage is blocked. */
export function readDisplayTheme(): DisplayControlThemeMode {
  try {
    const value = localStorage.getItem(displayThemeStorageKey);
    if (isThemeMode(value)) return value;
  } catch {
    // Storage can throw in private mode.
  }
  return "auto";
}

/** Remembers the appearance. Storage failures leave the attribute change intact. */
export function persistDisplayTheme(mode: DisplayControlThemeMode): void {
  try {
    localStorage.setItem(displayThemeStorageKey, mode);
  } catch {
    // Storage can throw in private mode.
  }
}

let stopAutoTheme: (() => void) | null = null;

/**
 * Sets or clears `data-theme` on `<html>`. `light` clears it (the default tokens).
 * `dark` sets it. `auto` follows the system and keeps listening until the next call.
 */
export function applyDisplayTheme(mode: DisplayControlThemeMode): void {
  stopAutoTheme?.();
  stopAutoTheme = null;
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  if (mode === "dark") {
    root.setAttribute("data-theme", "dark");
    return;
  }
  if (mode === "light") {
    root.removeAttribute("data-theme");
    return;
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const apply = () => {
    if (media.matches) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
  };
  apply();
  media.addEventListener("change", apply);
  stopAutoTheme = () => media.removeEventListener("change", apply);
}

const themeListeners = new Set<() => void>();

/** Subscribe to `commitDisplayTheme`. Pair with `useSyncExternalStore`. */
export function subscribeDisplayTheme(listener: () => void): () => void {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

/** Saves the choice, applies it, and notifies subscribers. One call from a theme control. */
export function commitDisplayTheme(mode: DisplayControlThemeMode): void {
  persistDisplayTheme(mode);
  applyDisplayTheme(mode);
  for (const listener of themeListeners) listener();
}

export type DisplayControlShortcut = "grid" | "theme";

export function nextDisplayControlThemeMode(
  current: DisplayControlThemeMode,
): DisplayControlThemeMode {
  const currentIndex = displayControlThemeModes.indexOf(current);
  return displayControlThemeModes[
    (currentIndex + 1) % displayControlThemeModes.length
  ];
}

export function displayControlShortcutFromEvent(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey" | "target">,
): DisplayControlShortcut | null {
  if (event.metaKey || event.ctrlKey || event.altKey) return null;
  if (isEditableGridOverlayTarget(event.target)) return null;

  const key = event.key.toLowerCase();
  if (key === "g") return "grid";
  if (key === "t") return "theme";
  return null;
}
