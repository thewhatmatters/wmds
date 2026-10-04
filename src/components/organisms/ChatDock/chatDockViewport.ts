import { useSyncExternalStore } from "react";

/** From this width the fixed window grows out of the composer; below it the window fills the screen. */
export const chatDockWideQuery = "(min-width: 48rem)";

/** Re-reads on resize, on the wide query flipping, and on the visual viewport moving (phone keyboards). */
export function subscribeChatDockViewport(onChange: () => void): () => void {
  window.addEventListener("resize", onChange);
  const query = typeof window.matchMedia === "function" ? window.matchMedia(chatDockWideQuery) : null;
  query?.addEventListener("change", onChange);
  const visual = window.visualViewport;
  visual?.addEventListener("resize", onChange);
  visual?.addEventListener("scroll", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    query?.removeEventListener("change", onChange);
    visual?.removeEventListener("resize", onChange);
    visual?.removeEventListener("scroll", onChange);
  };
}

function readWide(): boolean {
  return typeof window.matchMedia === "function" ? window.matchMedia(chatDockWideQuery).matches : true;
}

/** True from `md` — 36px controls and the growing window; false on phones — 44px controls, full screen. */
export function useChatDockWide(): boolean {
  return useSyncExternalStore(subscribeChatDockViewport, readWide, () => true);
}

/** The part of the layout viewport a phone keyboard (or browser chrome) hides, in px. */
export interface ChatDockVisibleArea {
  /** Hidden above the visible area — iOS scrolls the page up while the keyboard is open. */
  top: number;
  /** Hidden below it — the keyboard. */
  bottom: number;
}

/** The visible area from the layout viewport height and the visual viewport. */
export function chatDockVisibleArea(
  layoutHeight: number,
  visual: { height: number; offsetTop: number } | null | undefined,
): ChatDockVisibleArea {
  if (visual == null) return { top: 0, bottom: 0 };
  const top = Math.max(0, Math.round(visual.offsetTop));
  const bottom = Math.max(0, Math.round(layoutHeight - visual.offsetTop - visual.height));
  return { top, bottom };
}

function readVisibleAreaKey(): string {
  const area = chatDockVisibleArea(window.innerHeight, window.visualViewport);
  return `${area.top}:${area.bottom}`;
}

/** The visible area while `active` (the phone window is on screen); zero otherwise. */
export function useChatDockVisibleArea(active: boolean): ChatDockVisibleArea {
  const key = useSyncExternalStore(subscribeChatDockViewport, readVisibleAreaKey, () => "0:0");
  if (!active) return { top: 0, bottom: 0 };
  const [top, bottom] = key.split(":").map(Number);
  return { top: top ?? 0, bottom: bottom ?? 0 };
}
