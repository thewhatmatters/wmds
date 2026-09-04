/**
 * Semantic typography — Astryx-aligned roles mapped to type-* utilities.
 * Reference: https://astryx.atmeta.com/docs/typography
 *
 * Use typographyClass(role) in components — not raw text-sm / font-medium.
 * Atoms with fixed-height shells still use text-sm + leading-none until Phase 4 (type-control).
 */

/** WMDS document roles — map to Astryx semantic type scale. */
export type TypographyRole =
  | "display"
  | "page-heading"
  | "section-heading"
  | "subheading"
  | "body"
  | "ui-label"
  | "caption"
  | "overline";

/** Astryx semantic type names (Foundation reference). */
export type AstryxTypeScale =
  | "display-1"
  | "display-2"
  | "display-3"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
  | "large"
  | "body"
  | "label"
  | "supporting"
  | "code"
  | "control";

export type TypographyTracking = "tight" | "normal" | "wider";

export interface GeometricScaleStep {
  token: string;
  value: string;
  sample: string;
}

export interface TypographyStyle {
  role: TypographyRole;
  label: string;
  description: string;
  /** Astryx semantic type this role maps to */
  astryxType: AstryxTypeScale;
  className: string;
  tracking: TypographyTracking;
  trackingClass: string;
  sample: string;
  usedIn: string[];
}

export const trackingRules: Array<{
  tracking: TypographyTracking;
  utility: string;
  rule: string;
}> = [
  {
    tracking: "tight",
    utility: "tracking-tight",
    rule: "Display and page headings only — large Geist headlines",
  },
  {
    tracking: "normal",
    utility: "tracking-normal",
    rule: "Body, labels, captions, section headings — default UI copy",
  },
  {
    tracking: "wider",
    utility: "tracking-wider",
    rule: "Uppercase overlines / eyebrows only — never on mixed-case text",
  },
];

/** Astryx geometric ramp — 14px base × 1.2 ratio (src/theme/typography.css). */
export const geometricScale: GeometricScaleStep[] = [
  { token: "--font-size-4xs", value: "0.375rem", sample: "6px step" },
  { token: "--font-size-3xs", value: "0.4375rem", sample: "7px step" },
  { token: "--font-size-2xs", value: "0.5rem", sample: "8px step" },
  { token: "--font-size-xs", value: "0.625rem", sample: "10px step" },
  { token: "--font-size-sm", value: "0.75rem", sample: "12px step" },
  { token: "--font-size-base", value: "0.875rem", sample: "14px — UI body base" },
  { token: "--font-size-lg", value: "1.0625rem", sample: "17px step" },
  { token: "--font-size-xl", value: "1.25rem", sample: "20px step" },
  { token: "--font-size-2xl", value: "1.5rem", sample: "24px — heading-1" },
  { token: "--font-size-3xl", value: "1.8125rem", sample: "29px step" },
  { token: "--font-size-4xl", value: "2.1875rem", sample: "35px step" },
  { token: "--font-size-5xl", value: "2.625rem", sample: "42px — display-1" },
];

export const fontWeights = [
  { token: "--font-weight-normal", value: "400", role: "Body, code, supporting" },
  { token: "--font-weight-medium", value: "500", role: "Labels, overline" },
  { token: "--font-weight-semibold", value: "600", role: "Headings, display" },
  { token: "--font-weight-bold", value: "700", role: "Strong emphasis" },
] as const;

/** @deprecated Use geometricScale — kept for Storybook compat during migration. */
export const typeScale = geometricScale.map(({ token, value, sample }) => ({
  token: token.replace("--font-size-", ""),
  size: value,
  lineHeight: "—",
  sample,
}));

export const typographyStyles: TypographyStyle[] = [
  {
    role: "display",
    label: "Display",
    description: "Hero / marketing headlines",
    astryxType: "display-1",
    className: "type-display-1 text-fg tracking-tight",
    tracking: "tight",
    trackingClass: "tracking-tight",
    sample: "WhatMatters",
    usedIn: ["Marketing pages (future)"],
  },
  {
    role: "page-heading",
    label: "Page heading",
    description: "Top-level page title — maps to heading-1",
    astryxType: "heading-1",
    className: "type-heading-1 text-fg tracking-tight",
    tracking: "tight",
    trackingClass: "tracking-tight",
    sample: "Find a market",
    usedIn: ["Page title", "Page headings"],
  },
  {
    role: "section-heading",
    label: "Section heading",
    description: "In-page section title — maps to heading-2",
    astryxType: "heading-2",
    className: "type-heading-2 text-fg",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "Recent activity",
    usedIn: ["Settings sections (future)"],
  },
  {
    role: "subheading",
    label: "Subheading",
    description: "Card titles, compact headings — maps to heading-4",
    astryxType: "heading-4",
    className: "type-heading-4 text-fg",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "Portland Farmers Market",
    usedIn: ["Card.Header"],
  },
  {
    role: "body",
    label: "Body",
    description: "Default reading text — maps to body",
    astryxType: "body",
    className: "type-body text-fg",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "The quick brown fox jumps over the lazy dog.",
    usedIn: ["Card.Body", "Empty states"],
  },
  {
    role: "ui-label",
    label: "UI label",
    description: "Form labels, list primary lines — maps to label",
    astryxType: "label",
    className: "type-label text-fg",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "Accept recommendation",
    usedIn: ["Input label", "List row title"],
  },
  {
    role: "caption",
    label: "Caption",
    description: "Secondary text, metadata — maps to supporting",
    astryxType: "supporting",
    className: "type-supporting text-muted",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "Updated 2 minutes ago",
    usedIn: ["Address line", "Input description"],
  },
  {
    role: "overline",
    label: "Overline",
    description: "Section eyebrows — supporting + uppercase (WMDS extension)",
    astryxType: "supporting",
    className: "type-supporting font-medium uppercase tracking-wider text-muted",
    tracking: "wider",
    trackingClass: "tracking-wider",
    sample: "Other options",
    usedIn: ["Card section labels"],
  },
];

export const astryxTypeScale: Array<{
  type: AstryxTypeScale;
  utility: string;
  size: string;
  weight: string;
  leading: string;
}> = [
  { type: "display-1", utility: "type-display-1", size: "2.625rem", weight: "600", leading: "1.24" },
  { type: "display-2", utility: "type-display-2", size: "2.1875rem", weight: "600", leading: "1.26" },
  { type: "display-3", utility: "type-display-3", size: "1.8125rem", weight: "600", leading: "1.24" },
  { type: "heading-1", utility: "type-heading-1", size: "1.5rem", weight: "600", leading: "1.33" },
  { type: "heading-2", utility: "type-heading-2", size: "1.25rem", weight: "600", leading: "1.4" },
  { type: "heading-3", utility: "type-heading-3", size: "1.0625rem", weight: "600", leading: "1.41" },
  { type: "heading-4", utility: "type-heading-4", size: "0.875rem", weight: "600", leading: "1.43" },
  { type: "heading-5", utility: "type-heading-5", size: "0.75rem", weight: "600", leading: "1.67" },
  { type: "heading-6", utility: "type-heading-6", size: "0.625rem", weight: "600", leading: "1.6" },
  { type: "large", utility: "type-large", size: "1.0625rem", weight: "600", leading: "1.41" },
  { type: "body", utility: "type-body", size: "0.875rem", weight: "400", leading: "1.43" },
  { type: "label", utility: "type-label", size: "0.875rem", weight: "500", leading: "1.43" },
  { type: "supporting", utility: "type-supporting", size: "0.75rem", weight: "400", leading: "1.67" },
  { type: "code", utility: "type-code", size: "0.875rem", weight: "400", leading: "1.43" },
  { type: "control", utility: "type-control", size: "0.875rem", weight: "500", leading: "1" },
];

export const fontFamilies = [
  {
    token: "body",
    name: "Geist Sans",
    css: "var(--font-family-body)",
    tailwind: "font-sans",
    usage: "Body text, labels, headings (shared stack)",
  },
  {
    token: "heading",
    name: "Geist Sans",
    css: "var(--font-family-heading)",
    tailwind: "font-sans",
    usage: "Headings — inherits body stack unless theme overrides",
  },
  {
    token: "code",
    name: "Geist Mono",
    css: "var(--font-family-code)",
    tailwind: "font-mono",
    usage: "Code, IDs, numeric data",
  },
] as const;

/** Tailwind classes per semantic typography role — single source for components and Storybook. */
export const typographyRoleClasses = Object.fromEntries(
  typographyStyles.map((style) => [style.role, style.className]),
) as Record<TypographyRole, string>;

export function typographyClass(role: TypographyRole): string {
  return typographyRoleClasses[role];
}

/** Resolve live geometric scale values for Foundation docs (browser only). */
export function resolveTypographyTokenValues(root: Element | null = typeof document !== "undefined"
  ? document.documentElement
  : null): GeometricScaleStep[] {
  if (!root) {
    return geometricScale;
  }
  const style = getComputedStyle(root);
  return geometricScale.map((row) => ({
    ...row,
    value: style.getPropertyValue(row.token).trim() || row.value,
  }));
}
