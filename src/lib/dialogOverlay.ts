const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Tab cycle within a modal surface — returns cleanup. */
export function trapFocus(container: HTMLElement): () => void {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((node) => node.offsetParent !== null || node === document.activeElement);

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
