/**
 * Frosted glass fill, shared by every glass surface (Card `variant="glass"`, PromptBar
 * `variant="glass"`): the surface colour at part strength over a blur of whatever sits behind.
 * It follows the theme and `tone`, because the tint is the surface token. Knobs:
 * `--card-glass-tint` (how much surface; default 70% in light themes and 88% in dark, from
 * `--card-glass-tint-default`) and `--card-glass-blur` (default 12px). Solid surface where the
 * browser has no backdrop filter, and when the visitor asks for reduced transparency.
 */
export const glassSurfaceFillClasses = [
  "bg-[color-mix(in_srgb,var(--color-background-surface)_var(--card-glass-tint,var(--card-glass-tint-default,70%)),transparent)]",
  "backdrop-blur-[var(--card-glass-blur,12px)] backdrop-saturate-150",
  "[@supports_not_(backdrop-filter:blur(0))]:bg-surface",
  "[@media(prefers-reduced-transparency:reduce)]:bg-surface",
  "[@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none",
].join(" ");
