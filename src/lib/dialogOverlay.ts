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
export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  const { body, documentElement } = document;
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
