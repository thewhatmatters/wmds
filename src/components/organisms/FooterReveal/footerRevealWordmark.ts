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
 * Writes `--footer-wordmark-em` so `100cqi / em` matches the frame.
 * One correction pass absorbs optical-size drift between the probe and the
 * fitted size. Sub-pixel remainder stays put so measurement does not loop.
 */
export function syncFooterRevealWordmark(node: HTMLElement, frame: HTMLElement): number | null {
  const measured = readFooterRevealWordmarkEm(node);
  if (measured == null) return null;

  let em = measured;
  frame.style.setProperty("--footer-wordmark-em", footerRevealWordmarkEmCss(em));

  for (let pass = 0; pass < 2; pass += 1) {
    const textWidth = node.scrollWidth;
    const frameWidth = footerRevealWordmarkFrameWidth(frame);
    if (textWidth <= 0 || frameWidth <= 0) break;
    if (Math.abs(textWidth - frameWidth) <= 1) break;
    const next = footerRevealWordmarkFittedEm(em, textWidth, frameWidth);
    if (next == null) break;
    em = next;
    frame.style.setProperty("--footer-wordmark-em", footerRevealWordmarkEmCss(em));
  }

  return em;
}
