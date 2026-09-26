/**
 * Scroll progress at which the footer reveal finishes.
 * `useScroll` offset `["end end", "end start"]` runs across one viewport of
 * travel; the scrub itself is one footer-height, clamped so a tiny or
 * oversized footer still completes inside the viewport.
 */
export function footerRevealAt(footerHeight: number, viewportHeight: number): number {
  const viewport = viewportHeight > 0 ? viewportHeight : 1;
  return Math.min(0.95, Math.max(0.05, footerHeight / viewport));
}
