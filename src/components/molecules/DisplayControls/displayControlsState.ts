import { isEditableGridOverlayTarget } from "../../../lib/gridOverlayUtils";

export const displayControlThemeModes = ["auto", "light", "dark"] as const;

export type DisplayControlThemeMode = (typeof displayControlThemeModes)[number];
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
