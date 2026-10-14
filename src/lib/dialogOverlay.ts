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

/** Prevent background scroll while a modal is open — returns cleanup. */
export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  const { body } = document;
  const previousOverflow = body.style.overflow;
  body.style.overflow = "hidden";

  return () => {
    body.style.overflow = previousOverflow;
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
