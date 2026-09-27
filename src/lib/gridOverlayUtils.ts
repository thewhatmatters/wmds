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

/**
 * How far the page overlay may extend. A FooterReveal footer keeps its own
 * guides on the field, behind the type. The page overlay stops at that
 * footer's in-flow top so its stripes do not paint over the headline.
 * `footerTop` is the cover's bottom (the footer's in-flow start), or null.
 */
export function gridGuidesSpreadLimit(
  hostTop: number,
  hostBottom: number,
  documentHeight: number,
  footerTop: number | null,
): number {
  if (footerTop == null || footerTop + 1 < hostTop) return documentHeight;
  return Math.min(documentHeight, Math.max(hostBottom, footerTop));
}

/** In-flow document top. Sticky `getBoundingClientRect` is the stuck visual, not this. */
export function elementDocumentTop(el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * Where a sticky FooterReveal footer begins in document flow.
 * `offsetTop` on the footer itself is the stuck position (often 0). The
 * preceding cover's bottom is the in-flow edge the page guides must stop at.
 */
export function stickyFooterInFlowTop(footer: HTMLElement): number | null {
  const cover = footer.previousElementSibling;
  if (!(cover instanceof HTMLElement)) return null;
  return elementDocumentTop(cover) + cover.offsetHeight;
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
