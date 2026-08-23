/** Semantic type styles — composed from tokens, not separate CSS vars. */
export type TypographyRole =
  | "display"
  | "page-heading"
  | "section-heading"
  | "subheading"
  | "body"
  | "ui-label"
  | "caption"
  | "overline";

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
  usedIn: string[];
}

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
    className: "text-3xl font-bold leading-[var(--line-height-3xl)] tracking-tight text-fg",
    usedIn: ["Marketing pages (future)"],
  },
  {
    role: "page-heading",
    label: "Page heading",
    description: "Top-level page title",
    className: "text-2xl font-semibold leading-[var(--line-height-2xl)] tracking-tight text-fg",
    usedIn: ["App shell (future)"],
  },
  {
    role: "section-heading",
    label: "Section heading",
    description: "In-page section title",
    className: "text-xl font-semibold leading-[var(--line-height-xl)] tracking-normal text-fg",
    usedIn: ["Settings sections (future)"],
  },
  {
    role: "subheading",
    label: "Subheading",
    description: "Card titles, compact headings",
    className: "text-sm font-semibold leading-[var(--line-height-sm)] tracking-normal text-fg",
    usedIn: ["Card.Header", "Restock agent specimen title"],
  },
  {
    role: "body",
    label: "Body",
    description: "Default reading text and descriptions",
    className: "text-sm font-normal leading-[var(--line-height-sm)] tracking-normal text-fg",
    usedIn: ["Card.Body", "Restock agent specimen description"],
  },
  {
    role: "ui-label",
    label: "UI label",
    description: "Buttons, form labels, list rows",
    className: "text-sm font-medium leading-[var(--line-height-sm)] tracking-normal text-fg",
    usedIn: ["Button (xs–md)", "Button badge count"],
  },
  {
    role: "caption",
    label: "Caption",
    description: "Secondary text, metadata, hints",
    className: "text-xs font-normal leading-[var(--line-height-xs)] tracking-normal text-muted",
    usedIn: ["Matrix labels", "helper text (future)"],
  },
  {
    role: "overline",
    label: "Overline",
    description: "Section eyebrows, all-caps labels",
    className:
      "text-xs font-medium uppercase leading-[var(--line-height-xs)] tracking-wider text-muted",
    usedIn: ["Restock agent specimen “Other options”", "Card section labels"],
  },
];

export const fontFamilies = [
  {
    token: "sans",
    name: "IBM Plex Sans",
    css: "var(--font-family-sans)",
    usage: "All UI text",
  },
  {
    token: "mono",
    name: "IBM Plex Mono",
    css: "var(--font-family-mono)",
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
