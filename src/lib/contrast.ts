/**
 * WCAG 2 contrast for opaque hex colours — the brand-kit check (Foundations/Brand kit, unit tests).
 * `bin/wmds-check.mjs` carries the same formula for apps' CSS (`brand-contrast`).
 */

function channel(value: number) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function rgb(hex: string): [number, number, number] {
  let digits = hex.replace(/^#/, "");
  if (digits.length === 3) digits = [...digits].map((d) => d + d).join("");
  if (!/^[0-9a-f]{6}$/i.test(digits)) throw new Error(`Not an opaque hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)) as [number, number, number];
}

export function relativeLuminance(hex: string) {
  const [r, g, b] = rgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string) {
  const [la, lb] = [relativeLuminance(a), relativeLuminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** `color-mix(in srgb, a weight%, b)` for opaque hex colours. */
export function mixSrgb(a: string, weight: number, b: string) {
  const [ca, cb] = [rgb(a), rgb(b)];
  return `#${ca
    .map((value, i) => Math.round(value * weight + cb[i] * (1 - weight)).toString(16).padStart(2, "0"))
    .join("")}`;
}

/** Text on a colour needs 4.5:1 (WCAG AA, normal size). */
export const textContrastMinimum = 4.5;
