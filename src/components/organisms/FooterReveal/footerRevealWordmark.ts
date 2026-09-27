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
 * Advance width in em at a fixed px size. `scrollWidth` ignores the footer's
 * reveal scale (`transform`); a bounding rect would not.
 */
export function readFooterRevealWordmarkEm(node: HTMLElement): number | null {
  const previous = node.style.fontSize;
  node.style.fontSize = `${probeFontPx}px`;
  const width = node.scrollWidth;
  node.style.fontSize = previous;
  return footerRevealWordmarkEm(width, probeFontPx);
}

/**
 * Writes `--footer-wordmark-em` so `100cqi / em` fills the frame.
 * Hinting is not linear, so a single scale can jump past the frame and clip
 * the terminal letters. Search for the largest size that still fits.
 */
export function syncFooterRevealWordmark(node: HTMLElement, frame: HTMLElement): number | null {
  const measured = readFooterRevealWordmarkEm(node);
  if (measured == null) return null;

  const frameWidth = footerRevealWordmarkFrameWidth(frame);
  if (frameWidth <= 0) {
    const fallback = footerRevealWordmarkEmCss(measured);
    frame.style.setProperty("--footer-wordmark-em", fallback);
    return Number(fallback);
  }

  const apply = (em: number) => {
    const css = footerRevealWordmarkEmCss(em);
    frame.style.setProperty("--footer-wordmark-em", css);
    return Number(css);
  };

  let low = measured * 0.5;
  let high = measured * 1.5;
  apply(high);
  if (node.scrollWidth > frameWidth) high = measured * 3;

  let best = apply(high);
  for (let pass = 0; pass < 16; pass += 1) {
    const mid = apply((low + high) / 2);
    if (node.scrollWidth <= frameWidth) {
      best = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  apply(best);
  return best;
}
