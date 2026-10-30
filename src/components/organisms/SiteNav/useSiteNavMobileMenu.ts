import { useEffect, useRef, useState, type RefObject } from "react";
import { inertAllBut, lockBodyScroll, tabbablesIn } from "../../../lib/dialogOverlay";

export interface SiteNavMobileMenuOptions {
  open: boolean;
  onClose: () => void;
  /** The header: its bar (with the Menu / Close button) stays live above the panel. */
  barRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
}

/**
 * The phone menu as a dialog that keeps its bar (Header rule N6): page scroll locks, everything but the
 * bar and the panel goes inert, Tab cycles through the bar and the panel, focus starts on the panel's
 * first link, Escape closes, and focus returns to the Menu button. Widening past `md` closes it.
 * Returns the panel's top edge (the bar's bottom) so the panel sits under the bar.
 */
export function useSiteNavMobileMenu({ open, onClose, barRef, panelRef, triggerRef }: SiteNavMobileMenuOptions) {
  const [top, setTop] = useState(0);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const bar = barRef.current;
    const panel = panelRef.current;
    if (!open || bar == null || panel == null) return undefined;

    const measure = () => setTop(Math.max(0, Math.round(bar.getBoundingClientRect().bottom)));
    measure();
    const unlock = lockBodyScroll();
    const release = inertAllBut([bar, panel]);
    const order = () => [...tabbablesIn(bar), ...tabbablesIn(panel)];

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.isComposing && !event.defaultPrevented) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const list = order();
      if (list.length === 0) return;
      const index = list.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey
        ? list[index <= 0 ? list.length - 1 : index - 1]
        : list[index === -1 || index === list.length - 1 ? 0 : index + 1];
      event.preventDefault();
      next.focus();
    }
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", measure);
    const wide = window.matchMedia("(min-width: 768px)");
    const closeWhenWide = () => {
      if (wide.matches) onCloseRef.current();
    };
    wide.addEventListener("change", closeWhenWide);
    const frame = window.requestAnimationFrame(() => {
      const first = tabbablesIn(panel)[0];
      first?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", measure);
      wide.removeEventListener("change", closeWhenWide);
      release();
      unlock();
      const active = document.activeElement;
      if (active == null || active === document.body || panel.contains(active) || bar.contains(active)) {
        triggerRef.current?.focus();
      }
    };
  }, [open, barRef, panelRef, triggerRef]);

  return top;
}
