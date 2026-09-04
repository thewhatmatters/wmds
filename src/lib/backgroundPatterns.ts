/**
 * Background pattern library — named textures for Card occupants, chart canvases, empty states.
 * CSS lives in src/theme/patterns.css; Storybook specimens in Foundation/Patterns.
 */

/** Dot grid — 14px pitch, 1px dots at 8% / 12% primary mix (light / dark). */
export const backgroundPatternDotGridClasses = "wmds-pattern-dot-grid";

/** Diagonal lines — 14px pitch, 1px strokes at -45°, 8% / 12% primary mix (light / dark). */
export const backgroundPatternDiagonalLinesClasses = "wmds-pattern-diagonal-lines";

export const backgroundPatterns = {
  dotGrid: {
    id: "dot-grid",
    className: backgroundPatternDotGridClasses,
    pitch: "14px",
    dot: "1px",
    base: "var(--color-background-body)",
  },
  diagonalLines: {
    id: "diagonal-lines",
    className: backgroundPatternDiagonalLinesClasses,
    pitch: "14px",
    stroke: "1px",
    angle: "-45deg",
    base: "var(--color-background-body)",
  },
} as const;

export type BackgroundPatternId =
  (typeof backgroundPatterns)[keyof typeof backgroundPatterns]["id"];
