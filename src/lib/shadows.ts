/** Shadow token reference — primitives + semantic elevations. */
export interface ShadowToken {
  token: string;
  value: string;
  role: string;
  tailwind?: string;
  usedIn: string[];
  /** Paper applies drop layers as literals; hairline uses var(--color-border) border. */
  paperPattern?: string;
}

export const shadowPrimitives: ShadowToken[] = [
  {
    token: "--shadow-soft-sm",
    value:
      "0 2px 4px rgb(35 30 24 / 3%), 0 8px 28px -8px rgb(35 30 24 / 12%), inset 0 0 0 1px rgb(35 30 24 / 4%)",
    role: "Nav and menu elevation — diffuse drop plus inset ring",
    tailwind: "shadow-soft-sm",
    usedIn: ["SiteNav compact", "SiteNav mega menu", "Dropdown"],
    paperPattern:
      "border: 1px solid var(--color-elevation-edge); box-shadow: 0 2px 4px rgb(35 30 24 / 3%), 0 8px 28px -8px rgb(35 30 24 / 12%), inset 0 0 0 1px rgb(35 30 24 / 4%)",
  },
  {
    token: "--shadow-soft-card",
    value: "0 1px 2px rgb(26 26 24 / 6%), 0 16px 32px -12px rgb(26 26 24 / 10%)",
    role: "Card elevation — no stroke",
    tailwind: "shadow-soft-card",
    usedIn: ["Card layout surface", "Card outlined", "Sheet", "Panel"],
    paperPattern:
      "box-shadow: 0 1px 2px rgb(26 26 24 / 6%), 0 16px 32px -12px rgb(26 26 24 / 10%)",
  },
  {
    token: "--shadow-drop-sm",
    value: "0 2px 4px rgb(35 30 24 / 3%)",
    role: "Tight warm veil — no hairline",
    usedIn: ["Composes --shadow-sm"],
    paperPattern: "box-shadow: 0 2px 4px rgb(35 30 24 / 3%)",
  },
  {
    token: "--shadow-drop-lg",
    value: "0 2px 4px rgb(35 30 24 / 4%), 0 12px 40px -12px rgb(35 30 24 / 16%)",
    role: "Wider diffuse lift",
    usedIn: ["Composes --shadow-lg", "Toast"],
    paperPattern:
      "box-shadow: 0 2px 4px rgb(35 30 24 / 4%), 0 12px 40px -12px rgb(35 30 24 / 16%)",
  },
  {
    token: "--shadow-inset-highlight",
    value: "inset 0 1px 0 rgb(255 255 255 / 14%)",
    role: "Top inset highlight on filled buttons",
    tailwind: "shadow-inset-highlight",
    usedIn: ["Button success variant"],
    paperPattern: "box-shadow: inset 0 1px 0 rgb(255 255 255 / 14%)",
  },
];

export const shadowElevations: ShadowToken[] = [
  {
    token: "--shadow-sm",
    value: "0 2px 4px rgb(35 30 24 / 3%)",
    role: "Tight veil",
    tailwind: "shadow-sm",
    usedIn: ["Tooltip", "Input compound field"],
    paperPattern: "box-shadow: 0 2px 4px rgb(35 30 24 / 3%)",
  },
  {
    token: "--shadow-md",
    value: "0 1px 2px rgb(26 26 24 / 6%), 0 16px 32px -12px rgb(26 26 24 / 10%)",
    role: "Alias of --shadow-soft-card",
    tailwind: "shadow-md",
    usedIn: ["Alias — prefer shadow-soft-card"],
    paperPattern:
      "box-shadow: 0 1px 2px rgb(26 26 24 / 6%), 0 16px 32px -12px rgb(26 26 24 / 10%)",
  },
  {
    token: "--shadow-lg",
    value: "0 2px 4px rgb(35 30 24 / 4%), 0 12px 40px -12px rgb(35 30 24 / 16%)",
    role: "Wider diffuse lift",
    tailwind: "shadow-lg",
    usedIn: ["Toast"],
    paperPattern:
      "box-shadow: 0 2px 4px rgb(35 30 24 / 4%), 0 12px 40px -12px rgb(35 30 24 / 16%)",
  },
  {
    token: "--shadow-hairline",
    value: "0 0 0 1px var(--color-border)",
    role: "Crisp inset shell — hairline only, no drop",
    tailwind: "shadow-hairline",
    usedIn: ["Chip selected", "Chip removable"],
    paperPattern: "border: 1px solid var(--color-border)",
  },
  {
    token: "--shadow-raised",
    value: "0 0 0 1px var(--color-border), 0 2px 4px rgb(35 30 24 / 3%)",
    role: "Raised control — secondary buttons",
    tailwind: "shadow-raised",
    usedIn: ["Button secondary", "Badge neutral", "Input", "Select"],
    paperPattern:
      "border: 1px solid var(--color-border); box-shadow: 0 2px 4px rgb(35 30 24 / 3%)",
  },
];

export type ShadowElevation = "none" | "sm" | "md" | "raised";

/** Semantic elevation tailwind classes — mirrors shadowElevations catalog. */
export const shadowElevationClasses: Record<ShadowElevation, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  raised: "shadow-raised",
};

export function shadowElevationClass(elevation: ShadowElevation): string {
  return shadowElevationClasses[elevation];
}
