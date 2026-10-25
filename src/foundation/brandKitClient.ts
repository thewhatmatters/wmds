/**
 * The reference client for the brand kit: Product Designer's "Bold and loud" offer sheet (2026-10-25).
 * Shared by **Foundations/Brand kit → Theme a client** and `src/theme/brandKit.test.ts`.
 */

const brandCss = `
/* brand.css — imported after @thewhatmatters/wmds/styles.css, unlayered */
:root {
  --font-display: "Anton", Impact, "Arial Narrow", sans-serif;
  --font-display-weight: 400;
  --font-display-tracking: 0;
  --font-display-case: uppercase;
  --text-display-hero-size: clamp(4rem, 17.5vw, 18rem);

  --color-primary: #b33a1c;
  --color-on-primary: #fff6ea;
  --color-brand-surface: #120d08;
  --color-on-brand-surface: #f3e3c3;
  --color-on-brand-surface-muted: #a89a80;
  --color-field: #e2522b;
  --color-on-field: #120d08;
}

[data-theme="dark"] {
  --color-primary: #e86a3e;
  --color-on-primary: #120d08;
}
`.trim();

export const brandKitClient = {
  name: "Bold and loud",
  /** What the app ships as `brand.css`. */
  brandCss,
  pairs: [
    { label: "on-primary on primary", ink: "#fff6ea", background: "#b33a1c" },
    { label: "on-primary on primary (dark)", ink: "#120d08", background: "#e86a3e" },
    { label: "on-brand-surface on brand-surface", ink: "#f3e3c3", background: "#120d08" },
    { label: "on-brand-surface-muted on brand-surface", ink: "#a89a80", background: "#120d08" },
    { label: "on-field on field", ink: "#120d08", background: "#e2522b" },
  ],
} as const;

/**
 * The same values scoped to one specimen, so the story can sit beside unbranded ones. An app sets
 * them on `:root` instead (`brandCss`).
 */
export function scopedBrandCss(scope: string) {
  return brandCss
    .replace(/^\/\*.*\*\/\n/, "")
    .replace(
      ":root {",
      // On :root these follow --color-primary by themselves; a scoped copy has to derive them again.
      `${scope} {\n  --color-primary-hover: color-mix(in oklch, var(--color-primary) 82%, black);\n  --color-primary-active: color-mix(in oklch, var(--color-primary) 68%, black);\n  --color-focus-ring: color-mix(in srgb, var(--color-primary) 62%, transparent);`,
    )
    .replace('[data-theme="dark"] {', `${scope} [data-theme="dark"], ${scope}[data-theme="dark"] {`);
}
