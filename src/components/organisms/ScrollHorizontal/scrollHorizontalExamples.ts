import type { ScrollHorizontalItem } from "./ScrollHorizontal";

/**
 * Five solid placeholders for the marketing gallery.
 * Colors are the default palette, spelled out so Show code can paste them.
 */
/** Gallery intro copy. The statement is the plain sentence; shapes live in the nodes helper. */
export const scrollHorizontalIntroEyebrow = "SELECTED WORK";

export const scrollHorizontalIntroStatement =
  "Every screen is a first impression and we make yours the one they remember.";

export const scrollHorizontalIntroActionLabel = "Start a project";

export const scrollHorizontalMarketingItems: ScrollHorizontalItem[] = [
  { id: "project-one", label: "Project One", color: "var(--color-brand)" },
  { id: "project-two", label: "Project Two", color: "var(--color-brand-soft)" },
  { id: "project-three", label: "Project Three", color: "var(--color-primary)" },
  { id: "project-four", label: "Project Four", color: "var(--color-info-muted)" },
  { id: "project-five", label: "Project Five", color: "var(--color-accent)" },
];
