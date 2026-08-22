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
    token: "--shadow-drop-sm",
    value: "0 1px 2px rgb(28 27 25 / 8%)",
    role: "Subtle drop — no hairline",
    usedIn: ["Composes --shadow-sm", "Paper: box-shadow literal"],
    paperPattern: "box-shadow: 0 1px 2px rgb(28 27 25 / 8%)",
  },
  {
    token: "--shadow-drop-md",
    value: "0 1px 2px rgb(28 27 25 / 6%), 0 2px 6px rgb(28 27 25 / 4%)",
    role: "Card depth drop layers",
    usedIn: ["Composes --shadow-md (with hairline)"],
    paperPattern:
      "border: 1px solid var(--color-border); box-shadow: 0 1px 2px rgb(28 27 25 / 6%), 0 2px 6px rgb(28 27 25 / 4%)",
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
    value: "0 1px 2px rgb(28 27 25 / 8%)",
    role: "Subtle lift",
    tailwind: "shadow-sm",
    usedIn: ["Card elevation sm"],
    paperPattern: "box-shadow: 0 1px 2px rgb(28 27 25 / 8%)",
  },
  {
    token: "--shadow-md",
    value:
      "0 0 0 1px var(--color-border), 0 1px 2px rgb(28 27 25 / 6%), 0 2px 6px rgb(28 27 25 / 4%)",
    role: "Default card elevation",
    tailwind: "shadow-md",
    usedIn: ["Card default", "RestockCard"],
    paperPattern:
      "border: 1px solid var(--color-border); box-shadow: 0 1px 2px rgb(28 27 25 / 6%), 0 2px 6px rgb(28 27 25 / 4%)",
  },
  {
    token: "--shadow-raised",
    value: "0 0 0 1px var(--color-border), 0 1px 2px rgb(28 27 25 / 8%)",
    role: "Raised control — secondary buttons",
    tailwind: "shadow-raised",
    usedIn: ["Button secondary"],
    paperPattern:
      "border: 1px solid var(--color-border); box-shadow: 0 1px 2px rgb(28 27 25 / 8%)",
  },
];
