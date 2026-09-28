import { footerRevealWordmarkEmFallback } from "./footerRevealStyles";

const probeFontPx = 100;

/** Advance width of the word in em. Null when the probe did not lay out. */
export function footerRevealWordmarkEm(textWidthPx: number, fontSizePx: number): number | null {
  if (!Number.isFinite(textWidthPx) || !Number.isFinite(fontSizePx)) return null;
  if (textWidthPx <= 0 || fontSizePx <= 0) return null;
  return textWidthPx / fontSizePx;
}

/**
 * Em count that makes a word of `measuredEm` fill `frameWidthPx`.
 * `textWidthPx` is that word's layout width at `measuredEm`.
 */
export function footerRevealWordmarkFittedEm(
  measuredEm: number,
  textWidthPx: number,
  frameWidthPx: number,
): number | null {
  if (!Number.isFinite(measuredEm) || measuredEm <= 0) return null;
  if (!Number.isFinite(textWidthPx) || textWidthPx <= 0) return null;
  if (!Number.isFinite(frameWidthPx) || frameWidthPx <= 0) return null;
  return measuredEm * (textWidthPx / frameWidthPx);
}

/** Unitless CSS value. Rounded so resize passes do not churn the attribute. */
export function footerRevealWordmarkEmCss(em: number): string {
  if (!Number.isFinite(em) || em <= 0) return String(footerRevealWordmarkEmFallback);
  return (Math.round(em * 1e6) / 1e6).toString();
}

/**
 * Content-box inline size. `100cqi` resolves against this box, not `clientWidth`
 * when the frame has padding.
 */
export function footerRevealWordmarkFrameWidth(frame: HTMLElement): number {
  const style = getComputedStyle(frame);
  const pad =
    Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
  const extra = Number.isFinite(pad) ? pad : 0;
  return frame.clientWidth - extra;
}

/**
 * Largest em whose width still fits. Smaller em is a larger font.
 * `widthAt` is called with the rounded em that `100cqi / em` will use.
 */
export function footerRevealWordmarkFitEm(
  frameWidthPx: number,
  measuredEm: number,
  widthAt: (em: number) => number,
): number | null {
  if (!Number.isFinite(frameWidthPx) || frameWidthPx <= 0) return null;
  if (!Number.isFinite(measuredEm) || measuredEm <= 0) return null;

  const rounded = (em: number) => Number(footerRevealWordmarkEmCss(em));
  let low = measuredEm * 0.5;
  let high = measuredEm * 1.5;
  if (widthAt(rounded(high)) > frameWidthPx) high = measuredEm * 3;

  let best = rounded(high);
  for (let pass = 0; pass < 16; pass += 1) {
    const mid = rounded((low + high) / 2);
    if (widthAt(mid) <= frameWidthPx) {
      best = mid;
      high = mid;
    } else {
      low = mid;
    }
  }
  return best;
}

/** True when the word covers at least `minRatio` of the frame's content box. */
export function footerRevealWordmarkFillsFrame(
  text: HTMLElement,
  frame: HTMLElement,
  minRatio = 0.9,
): boolean {
  const content = footerRevealWordmarkFrameWidth(frame);
  if (content <= 0) return false;
  const width = text.scrollWidth;
  return width >= content * minRatio && width <= content + 1;
}

/**
 * Off-screen copy of the word. Transitions are `none` with `!important` so the
 * reduced-motion rule (`transition-duration: 0.01ms !important` on `*`,
 * `transition-property: all`) cannot freeze `scrollWidth` on the previous size.
 */
function mountWordmarkProbe(source: HTMLElement): HTMLElement {
  const probe = source.cloneNode(true) as HTMLElement;
  probe.removeAttribute("data-footer-ruled");
  probe.removeAttribute("data-footer-reveal");
  probe.setAttribute("data-footer-wordmark-probe", "");
  probe.setAttribute("aria-hidden", "true");
  probe.style.setProperty("position", "fixed", "important");
  probe.style.setProperty("left", "0", "important");
  probe.style.setProperty("top", "0", "important");
  probe.style.setProperty("visibility", "hidden", "important");
  probe.style.setProperty("pointer-events", "none", "important");
  probe.style.setProperty("margin", "0", "important");
  probe.style.setProperty("width", "max-content", "important");
  probe.style.setProperty("max-width", "none", "important");
  probe.style.setProperty("white-space", "nowrap", "important");
  probe.style.setProperty("transition-property", "none", "important");
  probe.style.setProperty("transition-duration", "0s", "important");
  probe.style.setProperty("animation", "none", "important");
  const parent = source.ownerDocument.body ?? source.ownerDocument.documentElement;
  parent.appendChild(probe);
  return probe;
}

function probeWidthAtEm(probe: HTMLElement, frameWidthPx: number, em: number): number {
  const px = frameWidthPx / Number(footerRevealWordmarkEmCss(em));
  probe.style.setProperty("font-size", `${px}px`, "important");
  return probe.scrollWidth;
}

/**
 * Advance width in em at a fixed px size. `scrollWidth` ignores the footer's
 * reveal scale (`transform`); a bounding rect would not. Measured on a probe
 * so the live word's font-size does not transition.
 */
export function readFooterRevealWordmarkEm(node: HTMLElement): number | null {
  const probe = mountWordmarkProbe(node);
  try {
    probe.style.setProperty("font-size", `${probeFontPx}px`, "important");
    return footerRevealWordmarkEm(probe.scrollWidth, probeFontPx);
  } finally {
    probe.remove();
  }
}

/**
 * Writes `--footer-wordmark-em` so `100cqi / em` fills the frame.
 * Hinting is not linear, so a single scale can jump past the frame and clip
 * the terminal letters. Search for the largest size that still fits.
 * The search reads a hidden probe, not the live word: under reduced motion the
 * global `transition-duration` would otherwise keep `scrollWidth` on the size
 * from before each write.
 */
export function syncFooterRevealWordmark(node: HTMLElement, frame: HTMLElement): number | null {
  const probe = mountWordmarkProbe(node);
  try {
    probe.style.setProperty("font-size", `${probeFontPx}px`, "important");
    const measured = footerRevealWordmarkEm(probe.scrollWidth, probeFontPx);
    if (measured == null) return null;

    const frameWidth = footerRevealWordmarkFrameWidth(frame);
    if (frameWidth <= 0) {
      const fallback = footerRevealWordmarkEmCss(measured);
      frame.style.setProperty("--footer-wordmark-em", fallback);
      return Number(fallback);
    }

    const best = footerRevealWordmarkFitEm(frameWidth, measured, (em) =>
      probeWidthAtEm(probe, frameWidth, em),
    );
    if (best == null) return null;
    const css = footerRevealWordmarkEmCss(best);
    frame.style.setProperty("--footer-wordmark-em", css);
    return Number(css);
  } finally {
    probe.remove();
  }
}
