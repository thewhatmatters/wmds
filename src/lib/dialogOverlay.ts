import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Rendered, not `visibility: hidden`, and not inside an `inert` subtree. */
function isTabbable(node: HTMLElement): boolean {
  if (node.closest("[inert]") != null) return false;
  if (typeof node.checkVisibility === "function") {
    return node.checkVisibility({ visibilityProperty: true });
  }
  return node.offsetParent !== null && getComputedStyle(node).visibility !== "hidden";
}

/** The tabbable controls inside `container`, in DOM order. */
export function tabbablesIn(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isTabbable);
}

/**
 * Mark everything inert except `keep` and their ancestors — returns cleanup. Unlike `inertPageBehind`,
 * this works when the surface lives inside the page (a header whose bar stays live above its own menu):
 * at every level from each kept element up to `body`, the siblings that hold no kept element go inert.
 */
export function inertAllBut(keep: HTMLElement[]): () => void {
  if (typeof document === "undefined") return () => undefined;
  const holdsKept = (node: Element) => keep.some((element) => node === element || node.contains(element));
  const marked = new Set<HTMLElement>();
  for (const element of keep) {
    for (let node: HTMLElement | null = element; node != null && node !== document.body; node = node.parentElement) {
      const parent = node.parentElement;
      if (parent == null) break;
      for (const sibling of Array.from(parent.children)) {
        if (!(sibling instanceof HTMLElement) || holdsKept(sibling) || sibling.hasAttribute("inert")) continue;
        if (["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)) continue;
        sibling.setAttribute("inert", "");
        marked.add(sibling);
      }
    }
  }
  return () => {
    for (const node of marked) node.removeAttribute("inert");
  };
}

/** Tab cycle within a modal surface — returns cleanup. */
export function trapFocus(container: HTMLElement): () => void {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((node) => isTabbable(node) || node === document.activeElement);

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !container.contains(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener("keydown", handleKeyDown);
  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}

/**
 * Prevent background scroll while a modal is open — returns cleanup.
 *
 * `html { scrollbar-gutter: stable }` (grid.css) keeps a scrollbar-wide strip after the body stops scrolling,
 * and a fixed scrim cannot paint into it — on a classic-scrollbar platform it shows as a pale band at the
 * trailing edge. While locked the gutter is released so the scrim reaches the edge, and the body takes its
 * width as padding so the page behind does not move.
 */
let scrollLocks = 0;
let releaseScrollLock: () => void = () => undefined;

export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  // Stacked modals share one lock: the first saves the page's styles, the last restores them, in
  // whatever order they close. Restoring per lock would leave the page locked when they close out of order.
  scrollLocks += 1;
  if (scrollLocks === 1) releaseScrollLock = applyScrollLock(document);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLocks -= 1;
    if (scrollLocks === 0) releaseScrollLock();
  };
}

function applyScrollLock({ body, documentElement }: Document): () => void {
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;
  const previousGutter = documentElement.style.scrollbarGutter;

  body.style.overflow = "hidden";
  // The reserved strip is the viewport less the scrollable area; read it once scrolling is off.
  const reservesGutter = getComputedStyle(documentElement).scrollbarGutter.includes("stable");
  const gutter = reservesGutter ? Math.max(0, window.innerWidth - documentElement.scrollWidth) : 0;
  if (gutter > 0) {
    const currentPaddingRight = parseFloat(getComputedStyle(body).paddingRight) || 0;
    documentElement.style.scrollbarGutter = "auto";
    body.style.paddingRight = `${currentPaddingRight + gutter}px`;
  }

  return () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
    documentElement.style.scrollbarGutter = previousGutter;
  };
}

/** Focus the first tabbable control inside the panel — usually the primary action or close. */
export function focusInitialElement(
  container: HTMLElement,
  preferSelector?: string,
): void {
  if (preferSelector) {
    const preferred = container.querySelector<HTMLElement>(preferSelector);
    if (preferred != null) {
      preferred.focus();
      return;
    }
  }

  const focusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  focusable?.focus();
}

/**
 * Mark every other top-level node of `document.body` inert while a modal surface is open —
 * returns cleanup. Nodes that were already inert are left alone.
 */
export function inertPageBehind(surface: HTMLElement): () => void {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  let root: HTMLElement = surface;
  while (root.parentElement != null && root.parentElement !== document.body) {
    root = root.parentElement;
  }

  const marked: HTMLElement[] = [];
  for (const node of Array.from(document.body.children)) {
    if (node === root || !(node instanceof HTMLElement) || node.hasAttribute("inert")) {
      continue;
    }
    node.setAttribute("inert", "");
    marked.push(node);
  }

  return () => {
    for (const node of marked) {
      node.removeAttribute("inert");
    }
  };
}

/** Where focus goes when the opener is gone — the page's main landmark (a deep link has no trigger). */
export function focusMainContent(): void {
  if (typeof document === "undefined") {
    return;
  }
  const main = document.querySelector<HTMLElement>("main, [role='main']");
  if (main == null) {
    return;
  }
  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
  }
  main.focus({ preventScroll: true });
}

export interface OverlayLifecycleOptions {
  /** The overlay is showing. The lifecycle runs while this is true and the panel is mounted. */
  open: boolean;
  /** Called when the overlay asks to close (Escape). */
  onClose: () => void;
  /**
   * A modal overlay locks page scroll, makes the page behind inert, and traps Tab inside the panel.
   * A non-modal overlay (Panel) does none of these. Default `true`.
   */
  modal?: boolean;
  /** Escape closes the overlay. It still blocks overlays beneath it when `false`. Default `true`. */
  closeOnEscape?: boolean;
  /** CSS selector for the control that takes focus on open; else the first tabbable control. */
  initialFocus?: string;
  /** Where focus returns on close; else whatever had focus when the overlay opened. */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/** Open overlays, oldest first. Only the last one answers Escape. */
const overlayStack: object[] = [];

/**
 * The whole open → close lifecycle of an overlay panel, shared by Dialog, Sheet, IntakeModal and Panel.
 *
 * While open: scroll lock, inert page and focus trap (modal only); focus moves into the panel; Escape
 * closes the topmost overlay only, and is left alone when something inside already handled it
 * (`defaultPrevented`). On close: focus returns to the opener when it is still in the page and focus
 * has not moved on elsewhere, else to `<main>` (a deep link has no opener).
 */
export function useOverlayLifecycle(
  panelRef: RefObject<HTMLElement | null>,
  { open, onClose, modal = true, closeOnEscape = true, initialFocus, returnFocusRef }: OverlayLifecycleOptions,
): void {
  const onCloseRef = useRef(onClose);
  const closeOnEscapeRef = useRef(closeOnEscape);
  useEffect(() => {
    onCloseRef.current = onClose;
    closeOnEscapeRef.current = closeOnEscape;
  });

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || panel == null) {
      return undefined;
    }

    const entry = {};
    overlayStack.push(entry);
    const opener = returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);

    const releaseModal = modal ? chainCleanups(lockBodyScroll(), inertPageBehind(panel), trapFocus(panel)) : noop;
    // Move focus in on the next frame (the panel is mid-entrance), unless the user has already put it
    // somewhere: inside the panel, or elsewhere in the page beside a non-modal panel.
    const initialFocusFrame = window.requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active == null || active === document.body || active === opener) {
        focusInitialElement(panel, initialFocus);
      }
    });

    function handleKeyDown(event: KeyboardEvent) {
      // An Escape during text composition (IME) cancels the composition, not the overlay.
      if (event.key !== "Escape" || event.isComposing || event.defaultPrevented || overlayStack.at(-1) !== entry) {
        return;
      }
      if (!closeOnEscapeRef.current) return;
      event.preventDefault();
      onCloseRef.current();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.cancelAnimationFrame(initialFocusFrame);
      overlayStack.splice(overlayStack.indexOf(entry), 1);
      releaseModal();
      restoreFocus(panel, opener);
    };
  }, [initialFocus, modal, open, panelRef, returnFocusRef]);
}

function noop() {}

function chainCleanups(...cleanups: Array<() => void>): () => void {
  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}

/** Return focus on close, unless the user already moved it somewhere else in the page. */
function restoreFocus(panel: HTMLElement, opener: HTMLElement | null) {
  const active = document.activeElement;
  const focusLeftPanel = active != null && active !== document.body && !panel.contains(active);
  if (focusLeftPanel) return;

  if (opener != null && opener.isConnected && opener !== document.body) {
    opener.focus();
    return;
  }
  // No opener to return to. Move focus once the page is un-inert and the close has committed,
  // so it is not dropped to <body>.
  focusMainContent();
  window.requestAnimationFrame(() => {
    const now = document.activeElement;
    if (now == null || now === document.body || panel.contains(now)) focusMainContent();
  });
}
