/** Class toggled on `<html>` so CSS-only overlays stay in sync with the React control. */
export const GRID_ON_CLASS = "grid-on";

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** Skip the `g` shortcut while the user is typing in a field. */
export function isEditableGridOverlayTarget(target: EventTarget | null): boolean {
  if (target == null || typeof target !== "object") return false;
  const el = target as { isContentEditable?: boolean; tagName?: string };
  if (el.isContentEditable) return true;
  return typeof el.tagName === "string" && EDITABLE_TAGS.has(el.tagName);
}

/** `g` / `G` with no modifiers, and not while typing. */
export function gridOverlayKeyShouldToggle(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey" | "target">,
): boolean {
  if (event.metaKey || event.ctrlKey || event.altKey) return false;
  if (event.key !== "g" && event.key !== "G") return false;
  return !isEditableGridOverlayTarget(event.target);
}

/**
 * How far column guides should extend outside the overlay host so they cover
 * the document above and below `grid-page` without growing the scrollport.
 * `hostTop` and `hostHeight` are document coordinates (px).
 */
export function gridGuidesDocumentSpread(
  hostTop: number,
  hostHeight: number,
  documentHeight: number,
): { before: number; after: number } {
  const before = Math.max(0, Math.floor(hostTop));
  const after = Math.max(0, Math.floor(documentHeight - hostTop - hostHeight));
  return { before, after };
}

/** Read `--grid-cols` from an element (the `grid-page` wrap, or `:root`). */
export function readGridColumnCount(from: Element | null): number {
  if (!from || typeof getComputedStyle === "undefined") return 12;
  const raw = getComputedStyle(from).getPropertyValue("--grid-cols").trim();
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 12;
}

export function setDocumentGridOn(on: boolean, root: ParentNode | null = null): void {
  const doc = (root as Document | null) ?? (typeof document === "undefined" ? null : document);
  doc?.documentElement.classList.toggle(GRID_ON_CLASS, on);
}
