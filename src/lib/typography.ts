/** Semantic type styles — composed from Tailwind utilities, not separate CSS vars. */
export type TypographyRole =
  | "display"
  | "page-heading"
  | "section-heading"
  | "subheading"
  | "body"
  | "ui-label"
  | "caption"
  | "overline";

/** Letter-spacing rules — three values for the whole system. Assign via roles, not ad hoc. */
export type TypographyTracking = "tight" | "normal" | "wider";

export interface TypeScaleStep {
  token: string;
  size: string;
  lineHeight: string;
  sample: string;
}

export interface TypographyStyle {
  role: TypographyRole;
  label: string;
  description: string;
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

export const typeScale: TypeScaleStep[] = [
  { token: "xs", size: "12px", lineHeight: "16px", sample: "The quick brown fox" },
  { token: "sm", size: "14px", lineHeight: "20px", sample: "The quick brown fox" },
  { token: "base", size: "16px", lineHeight: "24px", sample: "The quick brown fox" },
  { token: "lg", size: "18px", lineHeight: "28px", sample: "The quick brown fox" },
  { token: "xl", size: "20px", lineHeight: "28px", sample: "The quick brown fox" },
  { token: "2xl", size: "24px", lineHeight: "32px", sample: "The quick brown fox" },
  { token: "3xl", size: "30px", lineHeight: "36px", sample: "The quick brown fox" },
];

export const typographyStyles: TypographyStyle[] = [
  {
    role: "display",
    label: "Display",
    description: "Hero / marketing headlines",
    className: "text-3xl font-bold tracking-tight text-fg",
    tracking: "tight",
    trackingClass: "tracking-tight",
    sample: "WhatMatters",
    usedIn: ["Marketing pages (future)"],
  },
  {
    role: "page-heading",
    label: "Page heading",
    description: "Top-level page title",
    className: "text-2xl font-semibold tracking-tight text-fg",
    tracking: "tight",
    trackingClass: "tracking-tight",
    sample: "Task queue",
    usedIn: ["App shell (future)"],
  },
  {
    role: "section-heading",
    label: "Section heading",
    description: "In-page section title",
    className: "text-xl font-semibold tracking-normal text-fg",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "Recent activity",
    usedIn: ["Settings sections (future)"],
  },
  {
    role: "subheading",
    label: "Subheading",
    description: "Card titles, compact headings",
    className: "text-sm font-semibold tracking-normal text-fg",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "Restock recommendation",
    usedIn: ["Card.Header", "Restock agent specimen title"],
  },
  {
    role: "body",
    label: "Body",
    description: "Default reading text and descriptions",
    className: "text-sm font-normal tracking-normal text-fg",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "The quick brown fox jumps over the lazy dog.",
    usedIn: ["Card.Body", "Restock agent specimen description"],
  },
  {
    role: "ui-label",
    label: "UI label",
    description: "Buttons, form labels, list rows",
    className: "text-sm font-medium tracking-normal text-fg",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "Accept recommendation",
    usedIn: ["Button (xs–md)", "Button badge count"],
  },
  {
    role: "caption",
    label: "Caption",
    description: "Secondary text, metadata, hints",
    className: "text-xs font-normal tracking-normal text-muted",
    tracking: "normal",
    trackingClass: "tracking-normal",
    sample: "Updated 2 minutes ago",
    usedIn: ["Matrix labels", "helper text (future)"],
  },
  {
    role: "overline",
    label: "Overline",
    description: "Section eyebrows, all-caps labels",
    className: "text-xs font-medium uppercase tracking-wider text-muted",
    tracking: "wider",
    trackingClass: "tracking-wider",
    sample: "Other options",
    usedIn: ["Restock agent specimen “Other options”", "Card section labels"],
  },
];

export const fontFamilies = [
  {
    token: "sans",
    name: "Geist Sans",
    css: "var(--font-sans)",
    tailwind: "font-sans",
    usage: "All UI text",
  },
  {
    token: "mono",
    name: "Geist Mono",
    css: "var(--font-mono)",
    tailwind: "font-mono",
    usage: "Code, IDs, numeric data — default letter-spacing, never tracked",
  },
] as const;

/** Tailwind classes per semantic typography role — single source for components and Storybook. */
export const typographyRoleClasses = Object.fromEntries(
  typographyStyles.map((style) => [style.role, style.className]),
) as Record<TypographyRole, string>;

export function typographyClass(role: TypographyRole): string {
  return typographyRoleClasses[role];
}
