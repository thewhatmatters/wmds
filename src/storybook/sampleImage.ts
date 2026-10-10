/**
 * Storybook-only — never exported from the package.
 */
export type SampleImageTone = "light" | "dark" | "blue" | "lime" | "sand";

/** A drawn stand-in for a screenshot — no network, any size, light or dark. */
export function sampleImage(width: number, height: number, tone: SampleImageTone) {
  const [ground, ink] = {
    light: ["#ffffff", "#d9d9d9"],
    dark: ["#161616", "#3a3a3a"],
    blue: ["#1f3fd6", "#8fa2f2"],
    lime: ["#d9f26b", "#7f9414"],
    sand: ["#efe6d6", "#bfae8f"],
  }[tone];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${ground}"/>` +
    `<rect x="${width * 0.08}" y="${height * 0.1}" width="${width * 0.4}" height="${height * 0.08}" rx="6" fill="${ink}"/>` +
    `<rect x="${width * 0.08}" y="${height * 0.26}" width="${width * 0.84}" height="${height * 0.5}" rx="12" fill="${ink}" opacity="0.45"/>` +
    `<circle cx="${width * 0.86}" cy="${height * 0.14}" r="${Math.min(width, height) * 0.045}" fill="${ink}"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
