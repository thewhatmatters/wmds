import type { ScrollHorizontalItem } from "./ScrollHorizontal";

/**
 * Five solid placeholders for the marketing gallery.
 * Colors are the default palette, spelled out so Show code can paste them.
 */
/** Placeholder copy for the gallery intro. Obviously placeholder — not brand voice. */
export const scrollHorizontalIntroEyebrow = "SELECTED WORK";

export const scrollHorizontalIntroStatement =
  "Placeholder statement — a bold, left-aligned line about the work WhatMatters does for brands goes here.";

export const scrollHorizontalIntroActionLabel = "See our work";

export const scrollHorizontalMarketingItems: ScrollHorizontalItem[] = [
  { id: "project-one", label: "Project One", color: "var(--color-brand)" },
  { id: "project-two", label: "Project Two", color: "var(--color-brand-soft)" },
  { id: "project-three", label: "Project Three", color: "var(--color-primary)" },
  { id: "project-four", label: "Project Four", color: "var(--color-info-muted)" },
  { id: "project-five", label: "Project Five", color: "var(--color-accent)" },
];
